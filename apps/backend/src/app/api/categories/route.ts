import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// 1. Získání všech kategorií
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { places: true } // Bonus: uvidíme, kolik míst v kategorii už je
        }
      }
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Fetch categories error:', error);
    return NextResponse.json({ error: 'Chyba při načítání kategorií.' }, { status: 500 });
  }
}

// 2. Přidání nové kategorie
export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Název kategorie je povinný.' }, { status: 400 });
    }

    const newCategory = await prisma.category.create({
      data: { name }
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error: any) {
    // Ošetření unikátního názvu (kategorie už existuje)
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Tato kategorie již existuje.' }, { status: 400 });
    }
    console.error('Create category error:', error);
    return NextResponse.json({ error: 'Chyba při vytváření kategorie.' }, { status: 500 });
  }
}
