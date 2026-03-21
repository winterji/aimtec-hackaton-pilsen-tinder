import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const photoName = searchParams.get('name'); // Očekává např. places/ChIJ.../photos/AU_...

  if (!photoName) {
    return NextResponse.json({ error: 'Chybí parametr "name" pro fotku.' }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey || apiKey === 'TVUJ_API_KLIC_ZDE') {
    return NextResponse.json({ error: 'Google API klíč není nastaven.' }, { status: 500 });
  }

  try {
    // Google Places API (New) - Photo Media
    // Dokumentace: https://developers.google.com/maps/documentation/places/web-service/photos
    // MaxWidth/MaxHeight určují velikost výsledného obrázku
    const url = `https://places.googleapis.com/v1/${photoName}/media?key=${apiKey}&maxWidthPx=800&maxHeightPx=800&skipHttpRedirect=true`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: 'Chyba při získávání URL fotky', details: data }, { status: response.status });
    }

    // Google nám vrátí JSON s "photoUri". Můžeme buď vrátit tuhle URL, 
    // nebo na ni klienta rovnou přesměrovat (redirect). Přesměrování je pro <img> tag nejlepší.
    if (data.photoUri) {
      return NextResponse.redirect(data.photoUri);
    }

    return NextResponse.json({ error: 'Fotka nebyla nalezena.' }, { status: 404 });

  } catch (error) {
    console.error('Photo API Error:', error);
    return NextResponse.json({ error: 'Interní chyba serveru při načítání fotky.' }, { status: 500 });
  }
}
