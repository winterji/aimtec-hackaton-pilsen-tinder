'use client'

import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { Location } from '@/types'
import '../../styles.css'

export default function MapPage() {

  const MapContainer = dynamic(
    () => import('react-leaflet').then((mod) => mod.MapContainer),
    { ssr: false }
  )

  const TileLayer = dynamic(
    () => import('react-leaflet').then((mod) => mod.TileLayer),
    { ssr: false }
  )

  const Marker = dynamic(
    () => import('react-leaflet').then((mod) => mod.Marker),
    { ssr: false }
  )

  const Popup = dynamic(
    () => import('react-leaflet').then((mod) => mod.Popup),
    { ssr: false }
  )


  const router = useRouter()
  const [locations, setLocations] = useState<Location[]>([])



  const [favorites, setFavorites] = useState<Location[]>([])

  

  useEffect(() => {
    const storedLocations = localStorage.getItem('mapLocations')
    const storedFavorites = localStorage.getItem('favorites')

    console.log("📦 storedLocations:", storedLocations)
    console.log("❤️ storedFavorites:", storedFavorites)

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