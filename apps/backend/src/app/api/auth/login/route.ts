import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthSchema, formatZodError } from '@/lib/schemas';

const JWT_SECRET = process.env.JWT_SECRET;

// POST: Přihlášení uživatele
export async function POST(request: NextRequest) {
  if (!JWT_SECRET) {
    console.error('CRITICAL: JWT_SECRET is not defined in environment variables.');
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
  }

  try {
    const body = await request.json();

    // Validace vstupu pomocí Zod
    const validation = AuthSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(formatZodError(validation.error), { status: 400 });
    }

    const { username, password } = validation.data;

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
    // Vypršení nastavíme na 12 hodin
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '12h' }
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
