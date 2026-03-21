'use client'

import { useState, useRef, useEffect } from 'react'
import '../styles.css'

import { getCategories } from "@/services/categories"
import { getLocations } from "@/services/locations"


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

  const sliderRef = useRef<HTMLDivElement | null>(null)
  const startX = useRef(0)
  const isDragging = useRef(false)
  const isClickOnButton = useRef(false)

  const place = places[index]

  const [categories, setCategories] = useState<any[]>([])

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
        setIndex((i) => Math.min(i + 1, places.length - 1))
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

  return (
    <main className="app-container">

      <div className="top-search">
        <input placeholder="Hledat podnik..." />
      </div>

      <div className="category-wrapper">
        <div className="category-bar" ref={sliderRef}>
          <div className="category-inner">
            {categories.map((c) => (
              <button key={c.id}>{c.name}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="card-wrapper">
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
            style={{ backgroundImage: `url(${place.images[imgIndex]})` }}
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
                  <p>{place.hours}</p>
                </div>
              </div>
            )}

            {/* BOTTOM */}
            <div className="card-bottom">
              <div className="dots">
                {place.images.map((_, i) => (
                  <div key={i} className={`dot ${i === imgIndex ? 'active' : ''}`} />
                ))}
              </div>

              <div className="actions">
                <button
                  onPointerDown={(e) => {
                    isClickOnButton.current = true
                    e.stopPropagation()
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    console.log('like ❤️')
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
      </div>

      <div className="bottom-bar">
        <button>+ Přidat do tripu</button>
      </div>

    </main>
  )
}