import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

/**
 * POST: Vytvoří novou kategorii.
 * Vyžaduje Admin token v hlavičce Authorization.
 */
export async function POST(request: NextRequest) {
  // 1. Ověření administrátora
  const admin = verifyToken(request);
  if (!admin) {
    return NextResponse.json({ error: 'Neautorizovaný přístup. Chybí nebo je neplatný token.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, name, icon, number_of_items, description } = body;

    // Základní validace povinných polí
    if (!id || !name) {
      return NextResponse.json({ error: 'ID a název kategorie jsou povinné.' }, { status: 400 });
    }

    // 2. Vytvoření kategorie v DB
    const newCategory = await prisma.category.create({
      data: {
        id,
        name,
        icon: icon || null,
        description: description || null,
        number_of_items: number_of_items || 0
      }
    });

    return NextResponse.json({ 
      message: 'Category successfully created',
      category: newCategory 
    }, { status: 201 });

  } catch (error: any) {
    // Pokud kategorie s tímto ID nebo názvem už existuje
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Kategorie s tímto ID nebo názvem již existuje.' }, { status: 400 });
    }
    console.error('Create admin category error:', error);
    return NextResponse.json({ error: 'Chyba při vytváření kategorie.' }, { status: 500 });
  }
}
