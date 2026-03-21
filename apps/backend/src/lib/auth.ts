import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_tajne_heslo';

/**
 * Ověří JWT token z hlavičky Authorization: Bearer <token>
 * @returns Dekódovaný token nebo null, pokud je neplatný
 */
export function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];

  try {
    // Vrátí payload (userId, username), pokud je token v pořádku
    return jwt.verify(token, JWT_SECRET) as { userId: string; username: string };
  } catch (error) {
    // Token je neplatný, vypršel atd.
    return null;
  }
}
