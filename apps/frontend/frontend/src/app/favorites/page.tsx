'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Location } from '@/types'

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Location[]>([])
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem('favorites')
    if (stored) {
      setFavorites(JSON.parse(stored))
    }
  }, [])

  return (
    <main className="favorites-container">

      {/* HEADER */}
      <div className="favorites-header">
        <button className="back-button" onClick={() => router.push('/')}>
        ←
        </button>
        <h2>Oblíbené</h2>
      </div>

      {/* LIST */}
      <div className="favorites-list">
        {favorites.length === 0 ? (
          <p>Žádné oblíbené lokace 😢</p>
        ) : (
          favorites.map((loc) => (
            <div key={loc.id} className="favorite-item">

              <img src={loc.imageUrl} alt={loc.name} />

              <div className="favorite-info">
                <h3>{loc.name}</h3>
                <p>{loc.categoryId || 'Neznámá kategorie'}</p>
              </div>

            </div>
          ))
        )}
      </div>

    </main>
  )
}