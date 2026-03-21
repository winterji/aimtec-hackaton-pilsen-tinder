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
    //return response.data;

    return [
        {
          id: '1',
          categoryId: 'kavarny',
          name: 'Kavárna Central',
          address: 'Náměstí Republiky, Plzeň',
          description: 'Stylová kavárna v centru',
          imageUrl: 'https://picsum.photos/500/800?1',
          coordinates: {
            lat: 49.7475,
            lng: 13.3776
          }
        },
        {
          id: '2',
          categoryId: 'parky',
          name: 'Borský park',
          address: 'Borský park, Plzeň',
          description: 'Velký park ideální na relax',
          imageUrl: 'https://picsum.photos/500/800?2',
          coordinates: {
            lat: 49.738,
            lng: 13.355
          }
        },
        {
          id: '3',
          categoryId: 'pamatky',
          name: 'Katedrála sv. Bartoloměje',
          address: 'Náměstí Republiky',
          description: 'Dominanta Plzně',
          imageUrl: 'https://picsum.photos/500/800?3',
          coordinates: {
            lat: 49.7478,
            lng: 13.3775
          }
        },
        {
          id: '4',
          categoryId: 'pamatky2',
          name: 'Katedrála',
          address: 'Náměstí Republiky',
          description: 'Dominanta Plzně',
          imageUrl: 'https://picsum.photos/500/800?4',
          coordinates: {
            lat: 49.7478,
            lng: 13.3775
          }
        },
        {
          id: '5',
          categoryId: 'kavarny',
          name: 'sv. Bartoloměje',
          address: 'Náměstí Republiky',
          description: 'Dominanta Plzně',
          imageUrl: 'https://picsum.photos/500/800?5',
          coordinates: {
            lat: 49.7478,
            lng: 13.3775
          }
        },
        {
          id: '6',
          categoryId: 'kavarny',
          name: 'oměje',
          address: 'Náměstí Republiky',
          description: 'Dominanta Plzně',
          imageUrl: 'https://picsum.photos/500/800?6',
          coordinates: {
            lat: 49.7478,
            lng: 13.3775
          }
        }
      ]
    


};

// /**
//  * Získá detail jedné lokace
//  */
// export const getLocationById = async (id: string): Promise<Location> => {
//   const response = await api.get<Location>(`/locations/${id}`);
//   return response.data;
// };

