"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { CategoryForm } from '@/components/FormCategory/FormCategory';
import { getCategories } from '@/services/categories.service'; // Předpokládám, že zde máte metodu pro získání jedné kategorie
import { Category } from '@/types';

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams(); // Získáme [id] z URL
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        // Zde by bylo ideální mít v service metodu getCategoryById(id)
        // Pokud ji nemáte, můžete načíst všechny a vyfiltrovat (méně efektivní)
        const allCategories = await getCategories();
        const found = allCategories.find(c => c.id === params.id);
        
        if (found) {
          setCategory(found);
        } else {
          alert("Kategorie nenalezena");
          router.push('/categories');
        }
      } catch (error) {
        console.error("Chyba při načítání kategorie:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchCategory();
  }, [params.id, router]);

  if (loading) return <div className="p-6 text-center">Načítám data kategorie...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Upravit kategorii</h1>
          <p className="text-gray-500 text-sm mt-1">
            Provádíte změny v kategorii: <span className="font-semibold">{category?.name}</span>
          </p>
        </div>
        <Link 
          href="/categories" 
          className="text-gray-600 hover:text-gray-900 font-medium text-sm bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md transition-colors"
        >
          Zrušit
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <CategoryForm 
          initialData={category ?? undefined} // Předáme data do formuláře
          onSuccess={() => {
            router.push('/categories');
          }} 
        />
      </div>
    </div>
  );
}