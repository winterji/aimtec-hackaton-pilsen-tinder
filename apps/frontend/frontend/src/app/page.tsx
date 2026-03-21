'use client'

import { useState, useRef, useEffect } from 'react'
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

  // 🔥 CHYBĚLO → ref
  const sliderRef = useRef<HTMLDivElement | null>(null)

  const place = places[index]

  // 🔥 DRAG SCROLL
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
        <div className="card">

          {!flipped && (
            <div
              className="card-front"
              style={{ backgroundImage: `url(${place.images[imgIndex]})` }}
              onClick={(e) => {
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
                <div className="card-title">
                  {place.name}
                </div>
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

        {/* NAV */}
        <div className="nav-zones">
          <div onClick={() => {
            setIndex((i) => Math.max(i - 1, 0))
            setImgIndex(0)
            setFlipped(false)
          }} />
          <div onClick={() => {
            setIndex((i) => Math.min(i + 1, places.length - 1))
            setImgIndex(0)
            setFlipped(false)
          }} />
        </div>
      </div>

      {/* BOTTOM */}
      <div className="bottom-bar">
        <button>+ Přidat do tripu</button>
      </div>

    </main>
  )
}