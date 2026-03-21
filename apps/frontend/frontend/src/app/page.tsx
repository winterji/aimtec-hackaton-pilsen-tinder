'use client'

import { useState, useRef } from 'react'
import '../styles.css'

const places = [
  {
    name: 'Kavárna 1',
    description: 'Stylová kavárna v centru Plzně',
    hours: '8:00 - 20:00',
    images: [
      'https://picsum.photos/500/800?1',
      'https://picsum.photos/500/800?2'
    ]
  },
  {
    name: 'Park 1',
    description: 'Velký park ideální na relax',
    hours: 'nonstop',
    images: [
      'https://picsum.photos/500/800?3',
      'https://picsum.photos/500/800?4'
    ]
  }
]

export default function Home() {
  const [index, setIndex] = useState(0)
  const [imgIndex, setImgIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)

  const [dragX, setDragX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const startX = useRef(0)

  const sliderRef = useRef<HTMLDivElement | null>(null)

  const place = places[index]

  // 👉 CATEGORY DRAG (zůstává)
  // (tvůj původní useEffect můžeš nechat – funguje)

  // 👉 SWIPE LOGIKA (React style)
  const handleStart = (clientX: number) => {
    setIsDragging(true)
    startX.current = clientX
  }

  const handleMove = (clientX: number) => {
    if (!isDragging) return
    const delta = clientX - startX.current
    setDragX(delta)
  }

  const handleEnd = () => {
    setIsDragging(false)

    const threshold = 120

    if (dragX < -threshold) {
      setDragX(-500)
      setTimeout(() => {
        setIndex((i) => Math.min(i + 1, places.length - 1))
        setImgIndex(0)
        setFlipped(false)
        setDragX(0)
      }, 200)

    } else if (dragX > threshold) {
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

  return (
    <main className="app-container">

      {/* TOP SEARCH */}
      <div className="top-search">
        <input placeholder="Hledat podnik..." />
      </div>

      {/* CATEGORY BAR */}
      <div className="category-wrapper">
        <div className="category-bar" ref={sliderRef}>
          <div className="category-inner">
            {[
              'Kavárny','Parky','Restaurace','Restaurace2',
              'Restaurace3','Restaurace4','Restaurace5','Další','Další2'
            ].map((c) => (
              <button key={c}>{c}</button>
            ))}
          </div>
        </div>
      </div>

      {/* CARD */}
      <div className="card-wrapper">
        <div
          className="card"
          style={{
            transform: `translateX(${dragX}px) rotate(${dragX * 0.05}deg)`,
            transition: isDragging ? 'none' : 'transform 0.3s ease'
          }}
          onMouseDown={(e) => handleStart(e.clientX)}
          onMouseMove={(e) => handleMove(e.clientX)}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={(e) => handleStart(e.touches[0].clientX)}
          onTouchMove={(e) => handleMove(e.touches[0].clientX)}
          onTouchEnd={handleEnd}
        >

          {!flipped && (
            <div
              className="card-front"
              style={{ backgroundImage: `url(${place.images[imgIndex]})` }}
              onClick={(e) => {
                if (isDragging) return // 🔥 zabrání konfliktu swipe vs click

                const x = e.clientX
                const width = window.innerWidth

                if (x < width * 0.3) {
                  setImgIndex((i) => Math.max(i - 1, 0))
                } else if (x > width * 0.7) {
                  setImgIndex((i) => Math.min(i + 1, place.images.length - 1))
                } else {
                  setFlipped(true)
                }
              }}
            >
              <div className="card-title-wrapper">
                <div className="card-title">{place.name}</div>
              </div>

              <div className="card-bottom">
                <div className="dots">
                  {place.images.map((_, i) => (
                    <div key={i} className={`dot ${i === imgIndex ? 'active' : ''}`} />
                  ))}
                </div>

                <div className="actions">
                  <button>❤️</button>

                  <div className="right-actions">
                    <button onClick={() => setFlipped(true)}>ℹ️</button>
                    <button>+</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {flipped && (
            <div className="card-back" onClick={() => setFlipped(false)}>
              <h2>{place.name}</h2>
              <p>{place.description}</p>
              <p>{place.hours}</p>
            </div>
          )}

        </div>
      </div>

      {/* BOTTOM */}
      <div className="bottom-bar">
        <button>+ Přidat do tripu</button>
      </div>

    </main>
  )
}