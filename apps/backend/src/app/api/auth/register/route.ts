import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// POST: Registrace nového uživatele
export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Uživatelské jméno a heslo jsou povinné.' }, { status: 400 });
    }

    // 1. Zjistíme, jestli už uživatel neexistuje
    const existingUser = await prisma.user.findUnique({
      where: { username }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Uživatelské jméno je již obsazeno.' }, { status: 400 });
    }

    // 2. Zahashujeme heslo (např. 10 salt rounds)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Vytvoříme uživatele v DB
    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword
      }
    });

    // 4. Vrátíme informaci o úspěchu (bez hesla!)
    return NextResponse.json({ 
      message: 'Uživatel byl úspěšně zaregistrován.',
      user: { id: newUser.id, username: newUser.username }
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Interní chyba při registraci.' }, { status: 500 });
  }
}
