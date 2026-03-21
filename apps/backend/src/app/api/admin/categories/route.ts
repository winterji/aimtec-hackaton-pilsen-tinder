import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { CategoryCreateSchema, formatZodError } from '@/lib/schemas';

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
    
    // Validace vstupu pomocí Zod
    const validation = CategoryCreateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(formatZodError(validation.error), { status: 400 });
    }

    const { id, name, icon, number_of_items, description } = validation.data;

    // 2. Vytvoření nebo aktualizace kategorie v DB
    const category = await prisma.category.upsert({
      where: { id },
      update: {
        name,
        icon,
        description,
        number_of_items
      },
      create: {
        id,
        name,
        icon,
        description,
        number_of_items
      }
    });

    return NextResponse.json({ 
      message: 'Category successfully processed',
      category: category 
    }, { status: 200 });

  } catch (error: any) {
    console.error('Process admin category error:', error);
    return NextResponse.json({ error: 'Chyba při ukládání kategorie.' }, { status: 500 });
  }
}
