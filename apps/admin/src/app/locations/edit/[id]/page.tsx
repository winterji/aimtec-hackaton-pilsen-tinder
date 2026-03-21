"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { LocationForm } from '@/components/FormLocation/FormLocation';
import { getLocations } from '@/services/locations.service';
import { getCategories } from '@/services/categories.service';
import { Category, Location, AdminLocationPayload } from '@/types';

export default function EditLocationPage() {
  const router = useRouter();
  const params = useParams(); // Získáme [id] (Google Place ID) z URL
  
  const [initialData, setInitialData] = useState<AdminLocationPayload | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. Načteme všechny kategorie pro dropdown
        const cats = await getCategories();
        setCategories(cats);

        // 2. Načteme data konkrétní lokace
        // Poznámka: Pokud máte endpoint /api/locations/[id], použijte ten.
        // Pokud ne, najdeme ji v seznamu všech:
        const allLocs = await getLocations();
        const found = allLocs.find(l => l.id === params.id);

        if (found) {
          // Mapujeme data z typu Location na AdminLocationPayload (pro formulář)
          setInitialData({
            id: found.id,
            categoryId: found.categoryId || '',
            googlePlaceId: found.id, // ID je u nás Google Place ID
            name: found.name,
            customDescription: found.description,
            imageUrl: found.imageUrl,
            lat: found.coordinates.lat,
            lng: found.coordinates.lng,
          });
        } else {
          alert("Lokace nebyla nalezena.");
          router.push('/locations');
        }
      } catch (error) {
        console.error("Chyba při načítání dat pro editaci:", error);
        alert("Nepodařilo se načíst data.");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) loadData();
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-lg font-medium text-gray-500 animate-pulse">
          Načítám detaily lokace...
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Hlavička s navigací zpět */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Upravit místo
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Upravujete záznam: <span className="font-semibold text-blue-600">{initialData?.name}</span>
          </p>
        </div>
        <Link 
          href="/locations" 
          className="text-gray-600 hover:text-gray-900 font-medium text-sm bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md transition-colors dark:bg-gray-800 dark:text-gray-300"
        >
          Zrušit a zpět
        </Link>
      </div>

      {/* Kontejner s formulářem */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 dark:bg-gray-dark dark:border-gray-800">
        {initialData && (
          <LocationForm 
            initialData={initialData} 
            categories={categories}
            onSuccess={() => {
              // Po úspěšném POST požadavku (Upsert) se vrátíme na seznam
              router.push('/locations');
            }} 
          />
        )}
      </div>
    </div>
  );
}