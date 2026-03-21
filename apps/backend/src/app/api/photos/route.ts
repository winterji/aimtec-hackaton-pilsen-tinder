import { NextRequest, NextResponse } from 'next/server';

/**
 * GET: Přesměruje klienta na skutečný obrázek z Google Places API.
 * Parametr: googleRef (photo reference z Google API)
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const photoReference = searchParams.get('googleRef');

  if (!photoReference) {
    return NextResponse.json({ error: 'Chybí parametr "googleRef" pro fotku.' }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey || apiKey === 'TVUJ_API_KLIC_ZDE') {
    return NextResponse.json({ error: 'Google API klíč není nastaven.' }, { status: 500 });
  }

  try {
    // Používáme Google Places API (New) - Photo Media
    // Dokumentace: https://developers.google.com/maps/documentation/places/web-service/photos
    // skipHttpRedirect=true nám vrátí JSON s photoUri, na kterou pak klienta přesměrujeme (302)
    const url = `https://places.googleapis.com/v1/${photoReference}/media?key=${apiKey}&maxWidthPx=800&maxHeightPx=800&skipHttpRedirect=true`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      console.error('Google Photo API Error Response:', JSON.stringify(data, null, 2));
      return NextResponse.json({ 
        error: 'Chyba při získávání URL fotky z Google API', 
        details: data 
      }, { status: response.status });
    }

    // Google nám v JSONu vrátí "photoUri".
    if (data.photoUri) {
      // Provedeme 302 Temporary Redirect přímo na URL obrázku
      return NextResponse.redirect(data.photoUri, 302);
    }

    return NextResponse.json({ error: 'Fotka nebyla nalezena.' }, { status: 404 });

  } catch (error) {
    console.error('Photo API Internal Error:', error);
    return NextResponse.json({ error: 'Interní chyba serveru při načítání fotky.' }, { status: 500 });
  }
}
