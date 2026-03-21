import { api } from './api';
import { Category } from '../types';

export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get('/categories');
  console.log(response);
  return response.data;
};

// POST pro PŘIDÁNÍ i ÚPRAVU
export const saveCategory = async (categoryData: Partial<Category>): Promise<void> => {
  const response = await api.post('/admin/categories', categoryData);
  return response.data;
};

// DELETE pro SMAZÁNÍ
export const deleteCategory = async (id: string): Promise<void> => {
  const response = await api.delete(`/admin/categories/${id}`);
  return response.data;
};