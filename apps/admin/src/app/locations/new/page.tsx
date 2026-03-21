"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LocationForm } from '@/components/FormLocation/FormLocation';
import { Category } from '@/types';
import { getCategories } from '@/services/categories.service';

export default function NewLocationPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Načtení kategorií z API po zobrazení stránky
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Nepodařilo se načíst kategorie:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Přidat novou lokaci</h1>
        <p className="text-gray-500">Vyplňte detaily nového místa v Plzni pro swipování.</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        {isLoading ? (
          <p className="text-gray-500">Načítám kategorie...</p>
        ) : (
          <LocationForm 
            categories={categories}
            onSuccess={() => {
              // Po uložení přesměrujeme zpět na seznam lokací
              router.push('/locations');
            }} 
          />
        )}
      </div>
    </div>
  );
}