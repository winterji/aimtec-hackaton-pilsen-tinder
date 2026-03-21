import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_tajne_heslo';

// POST: Přihlášení uživatele
export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Uživatelské jméno a heslo jsou povinné.' }, { status: 400 });
    }

    // 1. Najdeme uživatele v databázi
    const user = await prisma.user.findUnique({
      where: { username }
    });

    if (!user) {
      return NextResponse.json({ error: 'Špatné jméno nebo heslo.' }, { status: 401 });
    }

    // 2. Porovnáme heslo (v DB je zahashované)
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json({ error: 'Špatné jméno nebo heslo.' }, { status: 401 });
    }

    // 3. Vytvoříme JWT token
    // Do tokenu uložíme id a username (bez hesla!)
    // Vypršení nastavíme např. na 24 hodin
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // 4. Vrátíme token a informace o uživateli
    return NextResponse.json({
      message: 'Přihlášení bylo úspěšné.',
      token,
      user: { id: user.id, username: user.username }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Interní chyba při přihlášení.' }, { status: 500 });
  }
}
