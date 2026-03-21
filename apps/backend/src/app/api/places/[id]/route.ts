import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// DELETE: Smazání místa z naší databáze
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Chybí ID místa.' }, { status: 400 });
    }

    const deletedPlace = await prisma.place.delete({
      where: { id }
    });

    return NextResponse.json({ 
      message: 'Místo bylo úspěšně smazáno.', 
      deleted: deletedPlace 
    });

  } catch (error: any) {
    // Místo s tímto ID neexistuje
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Místo nebylo nalezeno.' }, { status: 404 });
    }
    console.error('Delete place error:', error);
    return NextResponse.json({ error: 'Chyba při mazání místa.' }, { status: 500 });
  }
}
