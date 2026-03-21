import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Vyhledávání v Google nebo vracení míst z naší DB podle kategorie
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  const categoryId = searchParams.get('categoryId');

  // 1. Pokud je zadáno categoryId, vracíme uložená místa z naší databáze
  if (categoryId) {
    try {
      const dbPlaces = await prisma.place.findMany({
        where: { categoryId },
        orderBy: { createdAt: 'desc' }
      });
      return NextResponse.json(dbPlaces);
    } catch (error) {
      console.error('Fetch DB places error:', error);
      return NextResponse.json({ error: 'Chyba při načítání míst z databáze.' }, { status: 500 });
    }
  }

  // 2. Pokud je zadáno "q", vyhledáváme v Google Places API (s podporou více stránek)
  if (query) {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    if (!apiKey || apiKey === 'TVUJ_API_KLIC_ZDE') {
      return NextResponse.json({ error: 'Google Places API klíč není nastaven.' }, { status: 500 });
    }

    try {
      let allPlaces: any[] = [];
      let nextPageToken: string | null = null;
      let pagesFetched = 0;
      const MAX_PAGES = 3; // Limit na 3 stránky (cca 60 výsledků)

      do {
        const requestBody: any = {
          textQuery: query,
          languageCode: 'cs',
        };

        // Pokud máme token z předchozí stránky, přidáme ho do požadavku
        if (nextPageToken) {
          requestBody.pageToken = nextPageToken;
        }

        const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': apiKey,
            // FieldMask musí obsahovat i nextPageToken, abychom ho dostali v odpovědi
            'X-Goog-FieldMask': 'places.id,places.displayName,places.location,places.photos,places.formattedAddress,nextPageToken', 
          },
          body: JSON.stringify(requestBody),
        });

        const data = await response.json();

        if (!response.ok) {
          console.error('Google API Error:', data);
          break; // Pokud jedna stránka selže, vrátíme aspoň to, co už máme
        }

        const formattedPage = data.places?.map((place: any) => ({
          googleId: place.id,
          name: place.displayName?.text || 'Neznámý název',
          address: place.formattedAddress,
          latitude: place.location?.latitude,
          longitude: place.location?.longitude,
          photoReference: place.photos?.[0]?.name || null,
        })) || [];

        allPlaces = [...allPlaces, ...formattedPage];
        nextPageToken = data.nextPageToken || null;
        pagesFetched++;

        // Malá pauza mezi požadavky (Google ji někdy vyžaduje pro aktivaci tokenu)
        if (nextPageToken && pagesFetched < MAX_PAGES) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

      } while (nextPageToken && pagesFetched < MAX_PAGES);

      return NextResponse.json(allPlaces);

    } catch (error) {
      console.error('Google Search error:', error);
      return NextResponse.json({ error: 'Interní chyba při vyhledávání v Google.' }, { status: 500 });
    }
  }

  return NextResponse.json({ error: 'Musíš zadat buď "q" pro hledání, nebo "categoryId" pro výpis.' }, { status: 400 });
}

// POST: Uložení místa (z Google výsledků) do naší databáze
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { googleId, name, address, latitude, longitude, photoReference, categoryId } = body;

    if (!googleId || !name || !categoryId) {
      return NextResponse.json({ error: 'Chybí povinné údaje (googleId, name nebo categoryId).' }, { status: 400 });
    }

    const newPlace = await prisma.place.upsert({
      where: { googleId },
      update: {
        name,
        address,
        latitude,
        longitude,
        photoReference,
        categoryId,
      },
      create: {
        googleId,
        name,
        address,
        latitude,
        longitude,
        photoReference,
        categoryId,
      }
    });

    return NextResponse.json(newPlace, { status: 201 });

  } catch (error) {
    console.error('Create place error:', error);
    return NextResponse.json({ error: 'Chyba při ukládání místa do databáze.' }, { status: 500 });
  }
}
