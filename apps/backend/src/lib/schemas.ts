import { z } from 'zod';

/**
 * Schéma pro registraci a přihlášení
 */
export const AuthSchema = z.object({
  username: z.string().min(3, "Uživatelské jméno musí mít aspoň 3 znaky").max(30),
  password: z.string().min(6, "Heslo musí mít aspoň 6 znaků"),
});

/**
 * Schéma pro vytvoření nové kategorie (Admin)
 */
export const CategoryCreateSchema = z.object({
  id: z.string().min(1, "ID kategorie je povinné").regex(/^[a-z0-9-]+$/, "ID může obsahovat jen malá písmena, čísla a pomlčky"),
  name: z.string().min(1, "Název kategorie je povinný"),
  icon: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  number_of_items: z.number().int().nonnegative().default(0),
});

/**
 * Schéma pro uložení nové lokace do DB (Admin)
 */
export const LocationCreateSchema = z.object({
  categoryId: z.string().min(1, "ID kategorie je povinné"),
  googlePlaceId: z.string().min(1, "Google Place ID je povinné"),
  name: z.string().min(1, "Název místa je povinný"),
  customDescription: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

/**
 * Schéma pro odeslání výsledků swipování
 */
export const SwipeResultsSchema = z.object({
  sessionId: z.string().uuid("Neplatný formát sessionId (očekáváno UUID)"),
  likedLocations: z.array(z.string()).default([]),
  dislikedLocations: z.array(z.string()).default([]),
});

/**
 * Pomocná funkce pro formátování Zod chyb do čitelného JSONu
 */
export function formatZodError(error: z.ZodError) {
  return {
    error: 'Chyba validace dat',
    details: error.errors.map(err => ({
      path: err.path.join('.'),
      message: err.message
    }))
  };
}
