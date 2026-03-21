import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET: Vrátí zjednodušené lokace pro herní mapu.
 * Parametr: category (ID kategorie v URL cestě)
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    const { category: categoryId } = await params;

    if (!categoryId) {
      return NextResponse.json({ error: 'Chybí ID kategorie v URL.' }, { status: 400 });
    }

    // 1. Ověříme, zda kategorie existuje
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    });

    if (!category) {
      return NextResponse.json({ error: 'Kategorie nenalezena.' }, { status: 404 });
    }

    // 2. Načteme všechna místa pro danou kategorii
    const places = await prisma.place.findMany({
      where: { categoryId },
      select: {
        name: true,
        latitude: true,
        longitude: true
      }
    });

    // 3. Formátování do požadovaného herního schématu (nazev, x, y)
    const gameLocations = places.map(p => ({
      nazev: p.name,
      x: p.latitude,
      y: p.longitude
    }));

    return NextResponse.json(gameLocations);

  } catch (error) {
    console.error('Fetch game locations error:', error);
    return NextResponse.json({ error: 'Interní chyba při načítání herních lokací.' }, { status: 500 });
  }
}
