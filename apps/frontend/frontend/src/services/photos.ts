import { api } from './api';
import { Category } from '@/types';

/**
 * Získá všechny dostupné kategorie z databáze
 */
export const getPhoto = async (googleRef: string): Promise<string> => {
  const cleanRef = googleRef.replace('/api/photos?googleRef=', '')
  const params = { cleanRef }
  const response = await api.get<string>('/photos', { params });
  return response.data;
};

// /**
//  * Uloží kategorii (Upsert - vytvoří novou nebo upraví stávající)
//  */
// export const saveCategory = async (categoryData: Partial<Category>): Promise<Category> => {
//   const response = await api.post<Category>('/admin/categories', categoryData);
//   return response.data;
// };