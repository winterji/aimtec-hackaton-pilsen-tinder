import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

/**
 * DELETE: Odstraní místo z databáze podle jeho Google Place ID.
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
    const { id: googleId } = await params;

    if (!googleId) {
      return NextResponse.json({ error: 'Chybí Google Place ID v URL.' }, { status: 400 });
    }

    // 2. Smazání místa z DB podle googleId
    // Používáme deleteMany, protože googleId je v našem schématu unikátní,
    // ale delete vyžaduje primární klíč (id). deleteMany nám umožní filtrovat podle googleId.
    const deleteResult = await prisma.place.deleteMany({
      where: { googleId }
    });

    if (deleteResult.count === 0) {
      return NextResponse.json({ error: 'Místo s tímto Google Place ID nebylo v databázi nalezeno.' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Location successfully deleted',
      googleId
    });

  } catch (error) {
    console.error('Delete admin location error:', error);
    return NextResponse.json({ error: 'Interní chyba při mazání místa.' }, { status: 500 });
  }
}
