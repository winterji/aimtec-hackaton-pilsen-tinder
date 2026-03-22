'use client'

import { useState, useRef, useEffect } from 'react'
import '../styles.css'

import { getCategories } from "@/services/categories"
import { getPhoto } from "@/services/photos"
import { getLocations } from "@/services/locations"
import type { Location } from "@/types/index"

import { useRouter } from 'next/navigation'

type LocationWithImages = Location & {
  images: string[]
}


export default function Home() {

  const router = useRouter()

  const [index, setIndex] = useState(0)
  const [imgIndex, setImgIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)

  const [dragX, setDragX] = useState(0)

  const sliderRef = useRef<HTMLDivElement | null>(null)
  const startX = useRef(0)
  const isDragging = useRef(false)
  const isClickOnButton = useRef(false)
  const [locations, setLocations] = useState<LocationWithImages[]>([])


  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const [favorites, setFavorites] = useState<Location[]>(() => {
    if (typeof window === 'undefined') return []
    const stored = localStorage.getItem('favorites')
    return stored ? JSON.parse(stored) : []
  })

  const place = locations[index] || locations[0]

  const handleCategoryClick = (id: string) => {
    setIndex(0) // reset swipe
    setImgIndex(0)

    setActiveCategory((prev) => (prev === id ? null : id))
  }
    

  const isFavorite = place
  ? favorites.some((l) => l.id === place.id)
  : false

  

  

  const [categories, setCategories] = useState<any[]>([])

  useEffect(() => {
    const loadLocations = async () => {
      try {
        console.log("🚀 fetch start", activeCategory)

        // 👉 pokud je vybraná kategorie
        if (activeCategory) {
          const data = await getLocations(activeCategory)

          const mapped = data.locations.map((loc) => ({
            ...loc,
            images: [loc.imageUrl]
          }))

          setLocations(mapped)
          return
        }

        // 👉 jinak načti všechno (tvůj ALL useEffect)
        const categories = await getCategories()

        const requests = categories.map((cat) =>
          getLocations(cat.id)
        )

        const results = await Promise.all(requests)

        const allLocations = results
          .filter((res) => res?.locations?.length)
          .flatMap((res) => res.locations)

        const mapped = allLocations.map((loc) => ({
          ...loc,
          images: [loc.imageUrl]
        }))

        setLocations(mapped)

      } catch (err) {
        console.error("❌ ERROR:", err)
      }
    }

    loadLocations()
  }, [activeCategory])

  useEffect(() => {
    const stored = localStorage.getItem('favorites')
    if (stored) {
      setFavorites(JSON.parse(stored))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    const loadAllLocations = async () => {
      try {
        console.log("🚀 fetch ALL start")

        // 1️⃣ načti kategorie
        const categories = await getCategories()
        console.log("📂 categories:", categories)

        // 2️⃣ fetch pro každou kategorii
        const requests = categories.map((cat) =>
          getLocations(cat.id)
        )

        const results = await Promise.all(requests)
        console.log("📦 all responses:", results)

        // 3️⃣ vyber jen locations (některé mohou být prázdné!)
        const allLocations = results
          .filter((res) => res && res.locations && res.locations.length > 0)
          .flatMap((res) => res.locations)

        // 4️⃣ mapování (NEPŘIDÁVÁME baseURL!)
        const mapped = allLocations.map((loc) => ({
          ...loc,
          images: [loc.imageUrl] // 👉 přesně jak backend vrací
        }))

        console.log("✅ final mapped:", mapped)

        setLocations(mapped)

      } catch (err) {
        console.error("❌ ERROR:", err)
      }
    }

    loadAllLocations()
  }, [])

  

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories()
        setCategories(data)
      } catch (err) {
        console.error('Chyba při načítání kategorií:', err)
      }
    }

    loadCategories()
  }, [])
  

  // 👉 CATEGORY DRAG
  useEffect(() => {
    const slider = sliderRef.current
    if (!slider) return

    let isDown = false
    let startX = 0
    let scrollLeft = 0

    const mouseDown = (e: MouseEvent) => {
      isDown = true
      slider.classList.add('dragging')
      startX = e.pageX - slider.offsetLeft
      scrollLeft = slider.scrollLeft
    }

    const mouseLeave = () => {
      isDown = false
      slider.classList.remove('dragging')
    }

    const mouseUp = () => {
      isDown = false
      slider.classList.remove('dragging')
    }

    const mouseMove = (e: MouseEvent) => {
      if (!isDown) return
      e.preventDefault()
      const x = e.pageX - slider.offsetLeft
      const walk = (x - startX) * 1.5
      slider.scrollLeft = scrollLeft - walk
    }

    slider.addEventListener('mousedown', mouseDown)
    slider.addEventListener('mouseleave', mouseLeave)
    slider.addEventListener('mouseup', mouseUp)
    slider.addEventListener('mousemove', mouseMove)

    return () => {
      slider.removeEventListener('mousedown', mouseDown)
      slider.removeEventListener('mouseleave', mouseLeave)
      slider.removeEventListener('mouseup', mouseUp)
      slider.removeEventListener('mousemove', mouseMove)
    }
  }, [])

  

  // 👉 SWIPE + CLICK
  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true
    startX.current = e.clientX
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return
    const delta = e.clientX - startX.current
    setDragX(delta)
  }

  const handlePointerUp = (e: React.PointerEvent) => {

    if (isClickOnButton.current) {
      isClickOnButton.current = false
      return
    }

    if (!isDragging.current) return
    isDragging.current = false

    const delta = e.clientX - startX.current

    const swipeThreshold = 120
    const clickThreshold = 10

    // 👉 CLICK
    if (Math.abs(delta) < clickThreshold) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
      const x = e.clientX - rect.left
      const width = rect.width

      if (x < width * 0.5) {
        setImgIndex((i) => (i - 1 + place.images.length) % place.images.length)
      } else {
        setImgIndex((i) => (i + 1) % place.images.length)
      }

      setDragX(0)
      return
    }

    // 👉 SWIPE
    if (delta < -swipeThreshold) {
      setDragX(-500)
      setTimeout(() => {
        setIndex((i) => Math.min(i + 1, locations.length - 1))
        setImgIndex(0)
        setFlipped(false)
        setDragX(0)
      }, 200)

    } else if (delta > swipeThreshold) {
      setDragX(500)
      setTimeout(() => {
        setIndex((i) => Math.max(i - 1, 0))
        setImgIndex(0)
        setFlipped(false)
        setDragX(0)
      }, 200)

    } else {
      setDragX(0)
    }
  }

  


  const toggleFavorite = (location: Location) => {
    setFavorites((prev) => {
      const exists = prev.find((l) => l.id === location.id)

      if (exists) {
        return prev.filter((l) => l.id !== location.id)
      } else {
        return [...prev, location]
      }
    })
  }

  

  return (
    <main className="app-container">

      <div className="top-search">
        <input placeholder="Hledat podnik..." />
      </div>

      <div className="category-wrapper">
        <div className="category-bar" ref={sliderRef}>
          <div className="category-inner">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => handleCategoryClick(c.id)}
                className={activeCategory === c.id ? 'active' : ''}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="card-wrapper">
        {locations.length === 0 ? (
          <div style={{ padding: 20 }}>Načítám...</div>
        ) : (
          <div
            className="card"
            style={{
              transform: `translateX(${dragX}px) rotate(${dragX * 0.05}deg)`,
              transition: isDragging.current ? 'none' : 'transform 0.3s ease'
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >

            <div
              className="card-front"
              style={{ backgroundImage: `url(http://13.51.36.227:3000${place.images[imgIndex]})` }}
            >

              {/* TITLE */}
              <div className="card-title-wrapper">
                <div className="card-title">{place.name}</div>
              </div>

              {/* 👉 INFO OVERLAY */}
              {flipped && (
                <div
                  className="info-overlay"
                  onClick={(e) => {
                    e.stopPropagation()
                    setFlipped(false)
                  }}
                >
                  <div className="info-content">
                    <h2>{place.name}</h2>
                    <p>{place.description}</p>
                    <p>{place.address}</p>
                  </div>
                </div>
              )}

              {/* BOTTOM */}
              <div className="card-bottom">
                <div className="dots">
                  {place.images.length > 1 && (
                    <div className="dots">
                      {place.images.map((_, i) => (
                        <div
                          key={i}
                          className={`dot ${i === imgIndex ? 'active' : ''}`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="actions">
                  <button
                    className={isFavorite ? 'active-like' : ''}
                    onPointerDown={(e) => {
                      isClickOnButton.current = true
                      e.stopPropagation()
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavorite(place)
                    }}
                  >
                    ❤️
                  </button>

                  <div className="right-actions">
                    <button
                      onPointerDown={(e) => {
                        isClickOnButton.current = true
                        e.stopPropagation()
                      }}
                      onClick={(e) => {
                        e.stopPropagation()
                        setFlipped(true)
                      }}
                    >
                      ℹ️
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>

      <div className="bottom-bar">
        <button onClick={() => router.push('/favorites')}>
          Zobrazit oblíbené lokace
        </button>
      </div>

    </main>
  )
}