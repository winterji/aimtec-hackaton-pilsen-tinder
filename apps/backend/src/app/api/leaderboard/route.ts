import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

// Validační schéma pro uložení skóre
const LeaderboardCreateSchema = z.object({
  name: z.string().min(1, "Jméno hráče je povinné").max(50),
  score: z.number().int().nonnegative("Skóre musí být nezáporné číslo"),
});

/**
 * GET: Vrátí nejlepší hráče (Leaderboard).
 * Parametry: ?limit=10 (výchozí 10)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 10;

    const leaderboard = await prisma.leaderboard.findMany({
      orderBy: {
        score: 'desc',
      },
      take: isNaN(limit) ? 10 : limit,
      select: {
        name: true,
        score: true,
      }
    });

    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error('Fetch leaderboard error:', error);
    return NextResponse.json({ error: 'Interní chyba serveru při načítání leaderboardu' }, { status: 500 });
  }
}

/**
 * POST: Uloží nový výsledek hráče do leaderboardu.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validace vstupu
    const validation = LeaderboardCreateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ 
        error: 'Chyba validace dat',
        details: validation.error.format() 
      }, { status: 400 });
    }

    const { name, score } = validation.data;

    // Uložení do DB
    const entry = await prisma.leaderboard.create({
      data: {
        name,
        score,
      }
    });

    return NextResponse.json({ 
      message: 'Skóre úspěšně uloženo',
      entry 
    }, { status: 201 });

  } catch (error) {
    console.error('Save score error:', error);
    return NextResponse.json({ error: 'Interní chyba serveru při ukládání skóre' }, { status: 500 });
  }
}
