import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

/**
 * GET: Vrátí statistiky swipování pro administrátora.
 * Zabezpečený endpoint.
 */
export async function GET(request: NextRequest) {
  // 1. Ověření administrátora
  const admin = verifyToken(request);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized access (missing or invalid token)' }, { status: 401 });
  }

  try {
    // 2. Načtení všech míst z databáze
    const places = await prisma.place.findMany({
      orderBy: { 
        likesCount: 'desc' 
      }
    });

    // 3. Výpočet statistik pro každé místo
    const stats = places.map(p => {
      const totalSwipes = p.likesCount + p.dislikesCount;
      const matchRate = totalSwipes > 0 
        ? (p.likesCount / totalSwipes) * 100 
        : 0;

      return {
        locationId: p.googleId,
        name: p.name,
        likesCount: p.likesCount,
        dislikesCount: p.dislikesCount,
        matchRate: `${matchRate.toFixed(1)}%`
      };
    });

    return NextResponse.json(stats);

  } catch (error) {
    console.error('Fetch admin results error:', error);
    return NextResponse.json({ error: 'Internal server error while fetching statistics.' }, { status: 500 });
  }
}
