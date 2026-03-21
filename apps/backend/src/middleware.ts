import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Zde definujete VŠECHNY domény a porty, které mají mít přístup
const allowedOrigins = ['http://localhost:3001', 'http://localhost:3002', 'http://13.51.36.227:3000'];

export function middleware(request: NextRequest) {
  // Zjistíme, odkud požadavek přichází
  const origin = request.headers.get('origin') ?? '';
  
  const response = NextResponse.next();

  // Pokud je příchozí doména na našem seznamu povolených, nastavíme ji do hlavičky
  if (allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }

  // Přidáme zbytek nutných CORS hlaviček
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  response.headers.set(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  // Řešení pro preflight (OPTIONS) požadavky
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { 
      status: 200, 
      headers: response.headers 
    });
  }

  return response;
}

// Omezíme běh middleware pouze na API cesty
export const config = {
  matcher: '/api/:path*',
};