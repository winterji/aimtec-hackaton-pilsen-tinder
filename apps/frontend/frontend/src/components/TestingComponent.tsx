"use client";

import { useEffect, useState } from "react";
import { getCategories } from "@/services/categories";
import { getLocations } from "@/services/locations";
import { Category, Location } from "@/types";

export function TestingComponent() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Voláme naši službu
    const loadData = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
        const locs = await getLocations("kavarny");
        setLocations(locs);
      } catch (error) {
        console.error("Chyba při načítání:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <p>Hledám nejlepší místa v Plzni...</p>;
  if (categories.length === 0) return <p>V této kategorii zatím nic není.</p>;

  return (
    <div>
      {/* Zde by byla vaše TinderCard komponenta */}
      <h1>Kategorie:</h1>
      <p>Nalezeno {categories.length} míst.</p>
      {categories.map((cat) => (
          <span>{cat.name}, </span>
      ))}
      <h1>Umístění:</h1>
      <p>Nalezeno {locations.length} míst.</p>
      {locations.map((loc) => (
          <span>{loc.name}, </span>
      ))}
    </div>
  );
}