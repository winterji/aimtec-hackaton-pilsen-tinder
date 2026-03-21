"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Category } from '@/types';
import { getCategories, deleteCategory } from '@/services/categories.service';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Načtení dat při zobrazení stránky
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const data = await getCategories();
      console.log("Načtené kategorie:", data);
      setCategories(data);
    } catch (error) {
      console.error("Nepodařilo se načíst kategorie:", error);
      alert("Chyba při načítání dat.");
    } finally {
      setIsLoading(false);
    }
  };

  // Funkce pro smazání kategorie
  const handleDelete = async (id: string) => {
    if (!window.confirm("Opravdu chcete tuto kategorii smazat? Smazání kategorie může ovlivnit lokace, které do ní patří!")) return;

    try {
      await deleteCategory(id);
      // Pokud se to povede, vyfiltrujeme smazanou kategorii ze stavu
      setCategories(categories.filter(cat => cat.id !== id));
    } catch (error) {
      console.error("Nepodařilo se smazat kategorii:", error);
      alert("Chyba při mazání.");
    }
  };

  return (
    <div className="p-6">
      {/* Hlavička stránky s tlačítkem pro přidání */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Správa kategorií</h1>
          <p className="text-gray-500 text-sm mt-1">Seznam všech kategorií (např. Památky, Kavárny, Parky).</p>
        </div>
        <Link 
          href="/categories/new" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          + Přidat kategorii
        </Link>
      </div>

      {/* Tabulka */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">Ikona</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Název a ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Popis</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Akce</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                    Načítám kategorie...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                    Zatím tu nejsou žádné kategorie. Přidejte první!
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-2xl text-center">
                      {/* Ikona může být emoji nebo text */}
                      {cat.icon || '📁'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{cat.name}</div>
                      <div className="text-xs text-gray-500 font-mono">{cat.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 line-clamp-2">
                        {cat.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {/* Odkaz na úpravu (využívá dynamický route) */}
                      <Link 
                        href={`/categories/edit/${cat.id}`} 
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Upravit
                      </Link>
                      {/* Tlačítko pro smazání */}
                      <button 
                        onClick={() => handleDelete(cat.id)}
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