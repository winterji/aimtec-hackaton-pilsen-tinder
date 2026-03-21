"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Location } from '@/types';
import { getLocations, deleteLocation } from '@/services/locations.service';

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Načtení dat při zobrazení stránky
  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    setIsLoading(true);
    try {
      // V services/locations.ts máme funkci, která zavolá GET /api/locations
      const data = await getLocations();
      setLocations(data);
    } catch (error) {
      console.error("Nepodařilo se načíst lokace:", error);
      alert("Chyba při načítání dat.");
    } finally {
      setIsLoading(false);
    }
  };

  // Funkce pro smazání lokace
  const handleDelete = async (id: string) => {
    if (!window.confirm("Opravdu chcete tuto lokaci smazat?")) return;

    try {
      await deleteLocation(id);
      // Pokud se to povede, vyfiltrujeme smazanou lokaci ze stavu, 
      // aby zmizela z tabulky bez nutnosti obnovovat stránku
      setLocations(locations.filter(loc => loc.id !== id));
    } catch (error) {
      console.error("Nepodařilo se smazat lokaci:", error);
      alert("Chyba při mazání.");
    }
  };

  return (
    <div className="p-6">
      {/* Hlavička stránky s tlačítkem pro přidání */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Správa lokací</h1>
          <p className="text-gray-500 text-sm mt-1">Seznam všech míst dostupných v aplikaci Plzeň Swipe.</p>
        </div>
        <Link 
          href="/locations/new" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          + Přidat lokaci
        </Link>
      </div>

      {/* Tabulka */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fotka</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Název</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategorie</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Popis</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Akce</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                    Načítám lokace...
                  </td>
                </tr>
              ) : locations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                    Zatím tu nejsou žádná místa. Přidejte první!
                  </td>
                </tr>
              ) : (
                locations.map((loc) => (
                  <tr key={loc.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {/* Zobrazení miniatury fotky */}
                      <img 
                        src={loc.imageUrl} 
                        alt={loc.name} 
                        className="h-10 w-10 rounded-md object-cover border border-gray-200"
                        onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/40?text=Bez+fotky')}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{loc.name}</div>
                      <div className="text-xs text-gray-500">{loc.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {loc.categoryId || 'Neznámá'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 line-clamp-2 max-w-xs">
                        {loc.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {/* Odkaz na úpravu (využívá dynamický route, který vytvoříme) */}
                      <Link 
                        href={`/locations/edit/${loc.id}`} 
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Upravit
                      </Link>
                      {/* Tlačítko pro smazání */}
                      <button 
                        onClick={() => handleDelete(loc.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Smazat
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}