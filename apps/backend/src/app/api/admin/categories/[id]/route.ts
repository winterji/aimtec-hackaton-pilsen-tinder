import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

/**
 * DELETE: Odstraní kategorii z databáze podle jejího ID.
 * Vyžaduje Admin token v hlavičce Authorization.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // 1. Ověření administrátora
  const admin = verifyToken(request);
  if (!admin) {
    return NextResponse.json({ error: 'Neautorizovaný přístup. Chybí nebo je neplatný token.' }, { status: 401 });
  }

  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Chybí ID kategorie v URL.' }, { status: 400 });
    }

    // 2. Smazání kategorie
    // Poznámka: Pokud kategorie obsahuje místa, Prisma vyhodí chybu (pokud není nastaveno kaskádové mazání)
    const deletedCategory = await prisma.category.delete({
      where: { id }
    });

    return NextResponse.json({ 
      message: 'Category successfully deleted',
      deleted: deletedCategory 
    });

  } catch (error: any) {
    // Kategorie s tímto ID neexistuje
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Kategorie nebyla nalezena.' }, { status: 404 });
    }
    console.error('Delete admin category error:', error);
    return NextResponse.json({ error: 'Chyba při mazání kategorie.' }, { status: 500 });
  }
}
