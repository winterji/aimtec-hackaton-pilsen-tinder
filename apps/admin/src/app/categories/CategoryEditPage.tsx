"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { CategoryForm } from '@/components/FormCategory/FormCategory';

export default function NewCategoryPage() {
  const router = useRouter();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Přidat novou kategorii</h1>
        <p className="text-gray-500">Vytvořte novou kategorii pro swipování (např. Parky, Pivo).</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <CategoryForm 
          onSuccess={() => {
            // Po úspěšném uložení přesměrujeme zpět na seznam kategorií
            router.push('/categories');
          }} 
        />
      </div>
    </div>
  );
}