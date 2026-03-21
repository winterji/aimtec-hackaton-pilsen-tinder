"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CategoryForm } from '@/components/FormCategory/FormCategory'; // Adjust path if needed

export default function NewCategoryPage() {
  const router = useRouter();

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header section with a Back button */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Přidat novou kategorii</h1>
          <p className="text-gray-500 text-sm mt-1">
            Vytvořte novou kategorii pro swipování (např. Parky, Pivo).
          </p>
        </div>
        <Link 
          href="/categories" 
          className="text-gray-600 hover:text-gray-900 font-medium text-sm bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md transition-colors"
        >
          Zpět na seznam
        </Link>
      </div>

      {/* The Form Container */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <CategoryForm 
          onSuccess={() => {
            // Once the API successfully saves the data, redirect back to the table
            router.push('/categories');
          }} 
        />
      </div>
    </div>
  );
}