import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// 3. Smazání kategorie
// Next.js nám automaticky předá "id" z URL v objektu context
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Chybí ID kategorie.' }, { status: 400 });
    }

    // Smažeme kategorii (pozor: pokud má v sobě místa, Prisma nás na to upozorní, pokud nemáme nastaveno kaskádové mazání)
    const deletedCategory = await prisma.category.delete({
      where: { id }
    });

    return NextResponse.json({ 
      message: 'Kategorie byla úspěšně smazána.', 
      deleted: deletedCategory 
    });

  } catch (error: any) {
    // Kategorie s tímto ID neexistuje
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Kategorie nebyla nalezena.' }, { status: 404 });
    }
    console.error('Delete category error:', error);
    return NextResponse.json({ error: 'Chyba při mazání kategorie.' }, { status: 500 });
  }
}
