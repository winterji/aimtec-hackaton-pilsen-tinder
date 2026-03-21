import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { LocationCreateSchema, formatZodError } from '@/lib/schemas';

/**
 * POST: Přidá nové místo do databáze (Admin jen).
 * Vyžaduje JWT token v hlavičce Authorization.
 */
export async function POST(request: NextRequest) {
  // 1. Ověření administrátora
  const admin = verifyToken(request);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized access (missing or invalid token)' }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    // Validace vstupu pomocí Zod
    const validation = LocationCreateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(formatZodError(validation.error), { status: 400 });
    }

    const { categoryId, googlePlaceId, name, customDescription, imageUrl, lat, lng } = validation.data;

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

    return NextResponse.json({ 
      message: 'Location successfully added',
      place: newPlace 
    }, { status: 201 });

  } catch (error) {
    console.error('Create admin location error:', error);
    return NextResponse.json({ error: 'Internal server error while adding location.' }, { status: 500 });
  }
}
