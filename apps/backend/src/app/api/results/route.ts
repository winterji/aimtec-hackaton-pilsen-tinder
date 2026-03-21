import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * POST: Odeslání výsledků swipování uživatelem.
 * Parametry: sessionId (UUID), likedLocations (pole Google ID), dislikedLocations (pole Google ID)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, likedLocations, dislikedLocations } = body;

    if (!sessionId) {
      return NextResponse.json({ error: 'Chybí sessionId.' }, { status: 400 });
    }

    // 1. Kontrola, zda již výsledky pro toto sessionId nebyly uloženy (prevence duplicit)
    const existingSession = await prisma.swipeSession.findUnique({
      where: { id: sessionId }
    });

    if (existingSession) {
      return NextResponse.json({ error: 'Výsledky pro toto sessionId již byly uloženy.' }, { status: 400 });
    }

    // 2. Uložení session (historie hlasování)
    await prisma.swipeSession.create({
      data: {
        id: sessionId,
        likedLocations: Array.isArray(likedLocations) ? likedLocations : [],
        dislikedLocations: Array.isArray(dislikedLocations) ? dislikedLocations : []
      }
    });

    // 3. Inkrementace globálních statistik v tabulce Place
    
    // Zpracování lajků
    if (Array.isArray(likedLocations) && likedLocations.length > 0) {
      await prisma.place.updateMany({
        where: { googleId: { in: likedLocations } },
        data: { likesCount: { increment: 1 } }
      });
    }

    // Zpracování dislajků
    if (Array.isArray(dislikedLocations) && dislikedLocations.length > 0) {
      await prisma.place.updateMany({
        where: { googleId: { in: dislikedLocations } },
        data: { dislikesCount: { increment: 1 } }
      });
    }

    return NextResponse.json({ 
      message: 'Results successfully saved' 
    }, { status: 201 });

  } catch (error) {
    console.error('Submit results error:', error);
    return NextResponse.json({ error: 'Interní chyba při ukládání výsledků.' }, { status: 500 });
  }
}
