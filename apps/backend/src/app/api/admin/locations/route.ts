import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { LocationCreateSchema, formatZodError } from '@/lib/schemas';

/**
 * GET: Získání seznamu všech lokací z databáze.
 * Vyžaduje JWT token v hlavičce Authorization.
 */
export async function GET(request: NextRequest) {
  console.log('--- [BACKEND DEBUG] GET /api/admin/locations START ---');
  // 1. Ověření administrátora
  const admin = verifyToken(request);
  if (!admin) {
    console.log('[BACKEND DEBUG] Unauthorized access - token invalid or missing');
    return NextResponse.json({ error: 'Unauthorized access (missing or invalid token)' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;

    console.log(`[BACKEND DEBUG] Fetching locations from DB (limit: ${limit || 'none'})...`);
    const places = await prisma.place.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit && !isNaN(limit) ? limit : undefined
    });
    console.log(`[BACKEND DEBUG] Found ${places.length} places in DB.`);

    const formattedPlaces = places.map(p => ({
      id: p.googleId,
      name: p.name,
      address: p.address,
      description: p.description || '',
      imageUrl: p.photoReference,
      categoryId: p.categoryId,
      coordinates: {
        lat: p.latitude,
        lng: p.longitude
      }
    }));

    return NextResponse.json(formattedPlaces);
  } catch (error) {
    console.error('[BACKEND DEBUG] Fetch admin locations error:', error);
    return NextResponse.json({ error: 'Interní chyba serveru při komunikaci s databází' }, { status: 500 });
  }
}

/**
 * POST: Přidá nové místo do databáze (Admin jen).
 * Vyžaduje JWT token v hlavičce Authorization.
 */
export async function POST(request: NextRequest) {
  console.log('--- [BACKEND DEBUG] POST /api/admin/locations START ---');
  // 1. Ověření administrátora
  const admin = verifyToken(request);
  if (!admin) {
    console.log('[BACKEND DEBUG] Unauthorized access - token invalid or missing');
    return NextResponse.json({ error: 'Unauthorized access (missing or invalid token)' }, { status: 401 });
  }

  try {
    const body = await request.json();
    console.log('[BACKEND DEBUG] Received body:', JSON.stringify(body, null, 2));

    // Validace vstupu pomocí Zod
    const validation = LocationCreateSchema.safeParse(body);
    if (!validation.success) {
      console.log('[BACKEND DEBUG] Zod validation FAILED:', JSON.stringify(validation.error.format(), null, 2));
      return NextResponse.json(formatZodError(validation.error), { status: 400 });
    }

    const { categoryId, googlePlaceId, name, customDescription, imageUrl, lat, lng } = validation.data;
    console.log(`[BACKEND DEBUG] Data for UPSERT:
      - googleId: ${googlePlaceId}
      - categoryId: ${categoryId}
      - name: ${name}
      - lat/lng: ${lat}, ${lng}`);

    // Zkontrolujeme, zda kategorie existuje
    if (categoryId) {
        const cat = await prisma.category.findUnique({ where: { id: categoryId } });
        if (!cat) {
            console.log(`[BACKEND DEBUG] WARNING: Category with ID "${categoryId}" does NOT exist in database!`);
        } else {
            console.log(`[BACKEND DEBUG] Found category in DB: ${cat.name}`);
        }
    }

    // 2. Uložení místa do DB (používáme upsert pro případ, že místo už existuje)
    const newPlace = await prisma.place.upsert({
      where: { googleId: googlePlaceId },
      update: {
        name,
        latitude: lat,
        longitude: lng,
        photoReference: imageUrl,
        description: customDescription,
        categoryId: categoryId,
      },
      create: {
        googleId: googlePlaceId,
        name,
        latitude: lat,
        longitude: lng,
        photoReference: imageUrl,
        description: customDescription,
        categoryId: categoryId,
      }
    });

    console.log('[BACKEND DEBUG] UPSERT successful. Result from DB:', JSON.stringify(newPlace, null, 2));

    return NextResponse.json({ 
      message: 'Location successfully added',
      place: newPlace 
    }, { status: 201 });

  } catch (error: any) {
    console.error('[BACKEND DEBUG] Create admin location FATAL ERROR:', error);
    return NextResponse.json({ error: 'Internal server error while adding location.', details: error.message }, { status: 500 });
  }
}
