import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

/**
 * GET: Vrátí seznam míst pro swipování (buď podle kategorie, nebo vyhledávání v Google).
 * Parametry: categoryId (DB) NEBO searchString (Google)
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const categoryId = searchParams.get('categoryId');
  const searchString = searchParams.get('searchString');

  // 1. Validace parametrů (musí být buď jeden, nebo druhý)
  if ((!categoryId && !searchString) || (categoryId && searchString)) {
    return NextResponse.json({ 
      error: 'You must provide EITHER categoryId OR searchString. If neither or both are provided, the server will return a 400 Bad Request.' 
    }, { status: 400 });
  }

  const sessionId = crypto.randomUUID(); // Vygenerujeme ID pro tuto session
  let locations: any[] = [];

  try {
    // A) Vyhledávání v naší DB (podle kategorie)
    if (categoryId) {
      const dbPlaces = await prisma.place.findMany({
        where: { categoryId },
        orderBy: { createdAt: 'desc' }
      });

      locations = dbPlaces.map(p => ({
        id: p.googleId, // Používáme Google ID jako identifikátor pro frontend
        name: p.name,
        address: p.address,
        description: p.description || '',
        imageUrl: p.photoReference ? `/api/photos?googleRef=${p.photoReference}` : null,
        coordinates: {
          lat: p.latitude,
          lng: p.longitude
        }
      }));
    }

    // B) Vyhledávání v Google API (podle searchString)
    if (searchString) {
      const apiKey = process.env.GOOGLE_PLACES_API_KEY;
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
        body: JSON.stringify({
          textQuery: searchString,
          languageCode: 'cs',
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error('Google API Error');

      locations = data.places?.map((place: any) => ({
        id: place.id,
        name: place.displayName?.text || 'Neznámý název',
        address: place.formattedAddress,
        description: '', // Google Text Search (Basic) nevrací popis místa, musel by se volat Place Details
        imageUrl: place.photos?.[0]?.name ? `/api/photos?googleRef=${place.photos[0].name}` : null,
        coordinates: {
          lat: place.location?.latitude,
          lng: place.location?.longitude
        }
      })) || [];
    }

    // Odpověď musí být pole s jedním objektem dle vašeho schématu (session_id a locations)
    return NextResponse.json([{
      session_id: sessionId,
      locations: locations
    }]);

  } catch (error) {
    console.error('Fetch locations error:', error);
    return NextResponse.json({ error: 'Interní chyba při získávání lokací.' }, { status: 500 });
  }
}
