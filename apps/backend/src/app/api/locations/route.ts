import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

const MAX_CACHE_DAYS = 30;

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

    // Aktualizujeme data v naší DB
    return await prisma.place.update({
      where: { googleId },
      data: {
        name: place.displayName?.text || 'Neznámý název',
        address: place.formattedAddress,
        latitude: place.location?.latitude || 0,
        longitude: place.location?.longitude || 0,
        photoReference: place.photos?.[0]?.name || null,
        // updatedAt se díky Prisma @updatedAt automaticky nastaví na "teď"
      }
    });
  } catch (error) {
    console.error(`Chyba při osvěžování místa ${googleId}:`, error);
    return null;
  }
}

/**
 * GET: Vrátí seznam míst pro swipování.
 * Implementuje 30denní politiku Google Maps (automatické osvěžení starých dat).
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const categoryId = searchParams.get('categoryId');
  const searchString = searchParams.get('searchString');

  if ((!categoryId && !searchString) || (categoryId && searchString)) {
    return NextResponse.json({ 
      error: 'You must provide EITHER categoryId OR searchString.' 
    }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY || '';
  const sessionId = crypto.randomUUID();
  let finalLocations: any[] = [];

  try {
    // A) Načtení z naší DB podle kategorie (s kontrolou stáří dat)
    if (categoryId) {
      const dbPlaces = await prisma.place.findMany({
        where: { categoryId },
        orderBy: { createdAt: 'desc' }
      });

      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - (MAX_CACHE_DAYS * 24 * 60 * 60 * 1000));

      // Kontrola a případné osvěžení každého místa
      const refreshedPlaces = await Promise.all(dbPlaces.map(async (p) => {
        if (p.updatedAt < thirtyDaysAgo && apiKey) {
          // Data jsou starší než 30 dní -> Refresh z Google
          const refreshed = await refreshPlaceFromGoogle(p.googleId, apiKey);
          return refreshed || p; // Pokud refresh selže, vrátíme aspoň stará data
        }
        return p;
      }));

      finalLocations = refreshedPlaces.map(p => ({
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

      // Automatické uložení/aktualizace nalezených míst (vždy čerstvé -> reset 30denního limitu)
      for (const place of googlePlaces) {
        await prisma.place.upsert({
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
        });
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
