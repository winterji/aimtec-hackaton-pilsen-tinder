'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { Location } from '@/types'
import '../../styles.css'

export default function MapPage() {
  const router = useRouter()
  const [locations, setLocations] = useState<Location[]>([])



  const [favorites, setFavorites] = useState<Location[]>([])

  useEffect(() => {
    if (locations.length > 0) {
        localStorage.setItem('mapLocations', JSON.stringify(locations))
    }
    }, [locations])

  useEffect(() => {
    const storedLocations = localStorage.getItem('mapLocations')
    const storedFavorites = localStorage.getItem('favorites')

    if (storedLocations) {
      setLocations(JSON.parse(storedLocations))
    }

    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites))
    }
  }, [])

  return (
    <main style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* HEADER */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px',
        gap: '10px'
      }}>
        <button onClick={() => router.push('/')}>←</button>
        <h2>Mapa</h2>
      </div>

      {/* MAP */}
      <div style={{ flex: 1 }}>
        <MapContainer
          center={[49.7475, 13.3776]} // Plzeň default
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

          {locations.map((loc) => {
            const isFav = favorites.some((f) => f.id === loc.id)

            return (
              <Marker
                key={loc.id}
                position={[loc.coordinates.lat, loc.coordinates.lng]}
              >
                <Popup>
                  <strong>{loc.name}</strong><br />
                  {loc.address}<br />
                  {isFav && "❤️ Oblíbené"}
                </Popup>
              </Marker>
            )
          })}
        </MapContainer>
      </div>

    </main>
  )
}