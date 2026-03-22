// types/index.ts

// ==========================================
// ZÁKLADNÍ MODELY (Čtení z API)
// ==========================================

export interface Category {
  id: string;
  name: string;
  icon: string;
  number_of_items?: number;
  description: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Location {
  id: string; // V praxi to bude Google Place ID
  categoryId?: string; // Užitečné pro filtrování v admin tabulce
  name: string;
  address?: string; // Adresa od Googlu
  description: string; // Váš vlastní popisek
  imageUrl: string;
  coordinates: Coordinates;
}

export interface LocationResponse {
  session_id: number;
  locations: Location[];
}

// ==========================================
// ADMIN MODELY (Odesílání do API - POST/Upsert)
// ==========================================

// Tento typ přesně odpovídá tomu, co posíláte na `POST /api/admin/locations`
export interface AdminLocationPayload {
  id?: string; // Volitelné: Pokud posíláte ID, backend dělá UPDATE. Pokud chybí, dělá INSERT.
  categoryId: string;
  googlePlaceId: string;
  name: string;
  customDescription: string;
  imageUrl: string;
  lat: number;
  lng: number;
}

// ==========================================
// SPECIFICKÉ MODELY (Herní mapa a Statistiky)
// ==========================================

export interface GameLocation {
  nazev: string;
  x: number;
  y: number;
}

export interface Stats {
  locationId: string;
  name: string;
  likesCount: number;
  dislikesCount: number;
  matchRate: string;
}