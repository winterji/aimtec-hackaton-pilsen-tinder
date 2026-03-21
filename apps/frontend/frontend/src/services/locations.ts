import { api } from './api';
import { Location } from '@/types';

/**
 * Získá seznam lokací. 
 * Pokud je předáno categoryId, vrátí pouze lokace z této kategorie.
 * Pokud je předáno searchString, vrátí pouze lokace odpovídající vyhledávání.
 */
export const getLocations = async (categoryId?: string, searchString?: string): Promise<Location[]> => {
    // Sestavení query parametrů: /api/locations?categoryId=pamatky nebo /api/locations?searchString=hrad
    const params: Record<string, string> = {};
    if (categoryId) params.categoryId = categoryId;
    else if (searchString) params.searchString = searchString;
    else {
      // Pokud nejsou žádné parametry, vrátíme chybu
      throw new Error('Musíte zadat buď categoryId nebo searchString pro získání lokací.');
    }
    
    const config = Object.keys(params).length > 0 ? { params } : {};
    const response = await api.get<Location[]>('/locations', config);
    return response.data;
};

// /**
//  * Získá detail jedné lokace
//  */
// export const getLocationById = async (id: string): Promise<Location> => {
//   const response = await api.get<Location>(`/locations/${id}`);
//   return response.data;
// };

