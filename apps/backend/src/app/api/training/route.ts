import { NextRequest, NextResponse } from 'next/server';

// GET: Vyhledávání v Google, vrací POUZE pole názvů (string[])
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Chybí parametr "q" pro vyhledávání.' }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey || apiKey === 'TVUJ_API_KLIC_ZDE') {
    return NextResponse.json({ error: 'Google Places API klíč není nastaven.' }, { status: 500 });
  }

  try {
    let allNames: string[] = [];
    let nextPageToken: string | null = null;
    let pagesFetched = 0;
    const MAX_PAGES = 3; // Limit na 3 stránky (cca 60 výsledků)

    do {
      const requestBody: any = {
        textQuery: query,
        languageCode: 'cs',
      };

      if (nextPageToken) {
        requestBody.pageToken = nextPageToken;
      }

      const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          // FieldMask: omezíme data pouze na to, co potřebujeme (displayName a token)
          'X-Goog-FieldMask': 'places.displayName,nextPageToken', 
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Training API Google Error:', data);
        break;
      }

      // Extrakce pouze názvů míst
      const namesFromPage = data.places?.map((place: any) => place.displayName?.text || 'Neznámý název') || [];
      
      allNames = [...allNames, ...namesFromPage];
      nextPageToken = data.nextPageToken || null;
      pagesFetched++;

      if (nextPageToken && pagesFetched < MAX_PAGES) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

    } while (nextPageToken && pagesFetched < MAX_PAGES);

    return NextResponse.json(allNames);

  } catch (error) {
    console.error('Training API error:', error);
    return NextResponse.json({ error: 'Interní chyba serveru.' }, { status: 500 });
  }
}
