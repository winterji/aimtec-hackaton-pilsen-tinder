"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { AdminLocationPayload, Category } from '@/types';
import { saveLocation } from '@/services/locations.service';

interface LocationFormProps {
  initialData?: AdminLocationPayload;
  categories: Category[]; // Potřebujeme seznam kategorií pro roletku (Select)
  onSuccess?: () => void;
}

export const LocationForm: React.FC<LocationFormProps> = ({ initialData, categories, onSuccess }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AdminLocationPayload>({
    defaultValues: initialData || {
      categoryId: '', googlePlaceId: '', name: '', customDescription: '', imageUrl: '', lat: 0, lng: 0
    }
  });

  const onSubmit = async (data: AdminLocationPayload) => {
    try {
      // Převedeme stringy ze vstupů na čísla pro souřadnice
      const payload = { ...data, lat: Number(data.lat), lng: Number(data.lng) };
      
      await saveLocation(payload);
      alert('Lokace úspěšně uložena!');
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Chyba při ukládání lokace:', error);
      alert('Nepodařilo se uložit lokaci.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
      
      {/* Výběr kategorie */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Kategorie</label>
        <select 
          {...register('categoryId', { required: 'Vyberte kategorii' })} 
          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
        >
          <option value="">-- Vyberte kategorii --</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        {errors.categoryId && <span className="text-red-500 text-sm">{errors.categoryId.message}</span>}
      </div>

      {/* Název lokace */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Název místa</label>
        <input 
          {...register('name', { required: 'Název je povinný' })} 
          className="mt-1 block w-full rounded-md border border-gray-300 p-2" 
        />
      </div>

      {/* Vlastní popisek */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Váš popisek (pro Tinder kartu)</label>
        <textarea 
          {...register('customDescription', { required: 'Popisek je povinný' })} 
          className="mt-1 block w-full rounded-md border border-gray-300 p-2" 
          rows={3}
        />
      </div>

      {/* URL Fotky */}
      <div>
        <label className="block text-sm font-medium text-gray-700">URL Fotky</label>
        <input 
          {...register('imageUrl', { required: 'URL fotky je povinná' })} 
          className="mt-1 block w-full rounded-md border border-gray-300 p-2" 
        />
      </div>

      {/* Technická data: Google Place ID a Souřadnice */}
      <div className="grid grid-cols-2 gap-4 border-t pt-4 mt-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">Google Place ID</label>
          <input 
            {...register('googlePlaceId', { required: 'Google Place ID je povinné' })} 
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm text-gray-500" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Zeměpisná šířka (Lat)</label>
          <input 
            type="number" step="any"
            {...register('lat', { required: 'Vyplňte šířku' })} 
            className="mt-1 block w-full rounded-md border border-gray-300 p-2" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Zeměpisná délka (Lng)</label>
          <input 
            type="number" step="any"
            {...register('lng', { required: 'Vyplňte délku' })} 
            className="mt-1 block w-full rounded-md border border-gray-300 p-2" 
          />
        </div>
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white rounded-md py-2 px-4 mt-4 hover:bg-blue-700 disabled:bg-blue-300"
      >
        {isSubmitting ? 'Ukládám...' : 'Uložit lokaci'}
      </button>
    </form>
  );
};