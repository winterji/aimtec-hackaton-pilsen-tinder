import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET: Vrátí seznam všech kategorií.
 * Veřejný endpoint pro frontend.
 */
export async function GET() {
  try {
    // Vrátíme všechny kategorie se všemi poli (id, name, icon, description, number_of_items)
    const categories = await prisma.category.findMany({
      orderBy: { id: 'asc' }
    });

    return NextResponse.json(categories);

  } catch (error) {
    console.error('Fetch categories error:', error);
    return NextResponse.json({ error: 'Chyba při načítání kategorií.' }, { status: 500 });
  }
}
