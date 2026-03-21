import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { AuthSchema, formatZodError } from '@/lib/schemas';

// POST: Registrace nového uživatele
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validace vstupu pomocí Zod
    const validation = AuthSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(formatZodError(validation.error), { status: 400 });
    }

    const { username, password } = validation.data;

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
