'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import '../../styles.css'
import type { Location } from '@/types'

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Location[]>(() => {
    if (typeof window === 'undefined') return []
    const stored = localStorage.getItem('favorites')
    return stored ? JSON.parse(stored) : []
  })
  const router = useRouter()

  const removeFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((l) => l.id !== id))
  }

  

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites))
    }, [favorites])

  

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
            <p className='noLoc'>Žádné oblíbené lokace 😢</p>
        ) : (
            favorites.map((loc) => (
            <div key={loc.id} className="favorite-item">

                <img
                    src={`http://13.51.36.227:3000${loc.imageUrl}`}
                    alt={loc.name}
                />

                <div className="favorite-info">
                <h3 className='info-name'>{loc.name}</h3>
                <p>{loc.categoryId || 'Neznámá kategorie'}</p>
                </div>

                {/* ❤️ REMOVE BUTTON */}
                <button
                className="favorite-remove"
                onClick={() => removeFavorite(loc.id)}
                >
                ❤️
                </button>

            </div>
            ))
        )}
        </div>

    </main>
    )
}