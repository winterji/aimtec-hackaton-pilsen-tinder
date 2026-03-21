import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';
import { isRateLimited } from '@/lib/rate-limit';

const SOFT_EXPIRATION_DAYS = 28; // Refresh on background
const HARD_EXPIRATION_DAYS = 30; // Must refresh before returning

/**
 * Pomocná funkce pro osvěžení dat jednoho místa z Google Places API.
 */
async function refreshPlaceFromGoogle(googleId: string, apiKey: string) {
  try {
    const response = await fetch(`https://places.googleapis.com/v1/places/${googleId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        // Požadujeme pole, která ukládáme
        'X-Goog-FieldMask': 'id,displayName,formattedAddress,location,photos', 
      },
    });

    if (!response.ok) return null;
    const place = await response.json();

    return await prisma.place.update({
      where: { googleId },
      data: {
        name: place.displayName?.text || 'Neznámý název',
        address: place.formattedAddress,
        latitude: place.location?.latitude || 0,
        longitude: place.location?.longitude || 0,
        photoReference: place.photos?.[0]?.name || null,
      }
    });
  } catch (error) {
    console.error(`Chyba při osvěžování místa ${googleId}:`, error);
    return null;
  }
}

/**
 * GET: Vrátí seznam míst pro swipování.
 * Optimalizováno pro rychlost a právní soulad (28-denní background refresh).
 */
export async function GET(request: NextRequest) {
  // 1. Ochrana proti vytěžování (Rate Limiting)
  // Limit: 10 požadavků za minutu (60000 ms)
  if (isRateLimited(request, { limit: 10, windowMs: 60000 })) {
    return NextResponse.json({ 
      error: 'Too many requests. Please try again in a minute.',
      info: 'Rate limit applied to protect Google API quota.'
    }, { status: 429 });
  }

  const searchParams = request.nextUrl.searchParams;
  const categoryId = searchParams.get('categoryId');
  const searchString = searchParams.get('searchString');
  const categoryId = searchParams.get('categoryId');
  
  if ((!categoryId && !searchString) || (categoryId && searchString)) {
    return NextResponse.json({ 
      error: 'You must provide EITHER categoryId OR searchString.' 
    }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY || '';
  const sessionId = crypto.randomUUID();
  let finalLocations: any[] = [];

  try {
    // A) Načtení z naší DB podle kategorie
    if (categoryId) {
      const dbPlaces = await prisma.place.findMany({
        where: { categoryId },
        orderBy: { createdAt: 'desc' }
      });

      const now = new Date();
      const softLimit = new Date(now.getTime() - (SOFT_EXPIRATION_DAYS * 24 * 60 * 60 * 1000));
      const hardLimit = new Date(now.getTime() - (HARD_EXPIRATION_DAYS * 24 * 60 * 60 * 1000));

      const processedPlaces = await Promise.all(dbPlaces.map(async (p) => {
        if (!apiKey) return p;

        if (p.updatedAt < hardLimit) {
          // 1. KRITICKÉ: Data starší než 30 dní -> Musíme počkat na refresh (Hard Limit)
          const refreshed = await refreshPlaceFromGoogle(p.googleId, apiKey);
          return refreshed || p;
        } 
        
        if (p.updatedAt < softLimit) {
          // 2. OPTIMALIZACE: Data mezi 28-30 dny -> Vrátíme hned, ale spustíme refresh na pozadí
          // Nečekáme na výsledek (nepoužijeme await)
          refreshPlaceFromGoogle(p.googleId, apiKey).catch(err => 
            console.error(`Background refresh failed for ${p.googleId}:`, err)
          );
          return p;
        }

        // 3. Čerstvá data -> Nic neřešíme
        return p;
      }));

      finalLocations = processedPlaces.map(p => ({
        id: p.googleId,
        name: p.name,
        address: p.address,
        description: p.description || '',
        imageUrl: p.photoReference ? `/api/photos?googleRef=${p.photoReference}` : null,
        coordinates: { lat: p.latitude, lng: p.longitude }
      }));
    }

    // B) Vyhledávání v Google API (vždy čerstvá data)
    if (searchString) {
      if (!apiKey || apiKey === 'TVUJ_API_KLIC_ZDE') {
        return NextResponse.json({ error: 'Google Places API klíč není nastaven.' }, { status: 500 });
      }

      const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'places.id,places.displayName,places.location,places.photos,places.formattedAddress', 
        },
        body: JSON.stringify({ textQuery: searchString, languageCode: 'cs' }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error('Google API Error');

      const googlePlaces = data.places || [];

      // Automatické uložení nalezených míst (vždy čerstvé)
      // Spouštíme asynchronně, abychom neblokovali odpověď pro uživatele
      for (const place of googlePlaces) {
        prisma.place.upsert({
          where: { googleId: place.id },
          update: {
            name: place.displayName?.text || 'Neznámý název',
            address: place.formattedAddress,
            latitude: place.location?.latitude || 0,
            longitude: place.location?.longitude || 0,
            photoReference: place.photos?.[0]?.name || null,
          },
          create: {
            googleId: place.id,
            name: place.displayName?.text || 'Neznámý název',
            address: place.formattedAddress,
            latitude: place.location?.latitude || 0,
            longitude: place.location?.longitude || 0,
            photoReference: place.photos?.[0]?.name || null,
            categoryId: null,
            description: ''
          }
        }).catch(err => console.error("Async upsert failed:", err));
      }

      finalLocations = googlePlaces.map((place: any) => ({
        id: place.id,
        name: place.displayName?.text || 'Neznámý název',
        address: place.formattedAddress,
        description: '',
        imageUrl: place.photos?.[0]?.name ? `/api/photos?googleRef=${place.photos[0].name}` : null,
        coordinates: { lat: place.location?.latitude, lng: place.location?.longitude }
      }));
    }

    return NextResponse.json([{
      session_id: sessionId,
      locations: finalLocations
    }]);

  } catch (error) {
    console.error('Fetch locations error:', error);
    return NextResponse.json({ error: 'Interní chyba serveru.' }, { status: 500 });
  }
}
