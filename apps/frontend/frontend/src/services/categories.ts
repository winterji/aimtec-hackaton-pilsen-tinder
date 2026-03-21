import { api } from './api';
import { Category } from '@/types';

/**
 * Získá všechny dostupné kategorie z databáze
 */
export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get<Category[]>('/categories');
  return response.data;
};

// /**
//  * Uloží kategorii (Upsert - vytvoří novou nebo upraví stávající)
//  */
// export const saveCategory = async (categoryData: Partial<Category>): Promise<Category> => {
//   const response = await api.post<Category>('/admin/categories', categoryData);
//   return response.data;
// };