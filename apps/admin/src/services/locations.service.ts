import { api } from './api';
import { Location } from '../types'; // Zde si naimportujete typy, které jsme definovali ve Swaggeru

export const getLocations = async (categoryId?: string): Promise<Location[]> => {
  // Volá veřejný endpoint (nevyžaduje token, ale api instanci můžeme použít)
  const params = categoryId ? { categoryId } : {};
  const response = await api.get('/locations', { params });
  return response.data;
};

// POST pro PŘIDÁNÍ i ÚPRAVU (Upsert)
export const saveLocation = async (locationData: Partial<Location>): Promise<void> => {
  // Pokud locationData obsahuje 'id', backend pozná, že upravujeme
  // Pokud 'id' chybí, backend vytvoří novou lokaci
  const response = await api.post('/admin/locations', locationData);
  return response.data;
};

// DELETE pro SMAZÁNÍ
export const deleteLocation = async (id: string): Promise<void> => {
  const response = await api.delete(`/admin/locations/${id}`);
  return response.data;
};