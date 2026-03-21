// ----------------------
import { useState } from 'react'

export default function SwipeCard({ place, imageIndex, onNext, onPrev, onNextImage, onPrevImage }: any) {
  const [flipped, setFlipped] = useState(false)

  const handleClick = (e: any) => {
    const x = e.clientX
    const width = window.innerWidth

    if (x < width * 0.3) return onPrevImage()
    if (x > width * 0.7) return onNextImage()

    setFlipped(!flipped)
  }

  return (
    <div className="w-[90%] max-w-md h-[70vh] relative">
      <div className={`w-full h-full rounded-2xl overflow-hidden shadow-xl transition-transform duration-500 ${flipped ? 'rotate-y-180' : ''}`}>
        {!flipped ? (
          <div
            className="w-full h-full bg-cover bg-center flex flex-col justify-between"
            style={{ backgroundImage: `url(${place.images[imageIndex]})` }}
            onClick={handleClick}
          >
            <div className="flex justify-center gap-1 pt-2">
              {place.images.map((_: any, i: number) => (
                <div key={i} className={`h-1 w-6 ${i === imageIndex ? 'bg-white' : 'bg-gray-500'}`} />
              ))}
            </div>

            <div className="flex justify-between p-4">
              <button className="text-2xl">❤️</button>
              <button onClick={() => setFlipped(true)}>ℹ️</button>
            </div>
          </div>
        ) : (
          <div className="w-full h-full bg-white text-black p-4" onClick={() => setFlipped(false)}>
            <h2 className="text-xl font-bold">{place.name}</h2>
            <p>{place.description}</p>
            <p className="mt-2 text-sm">Otevírací doba: {place.hours}</p>
          </div>
        )}
      </div>

      <div className="absolute inset-0 flex justify-between">
        <div className="w-1/2" onClick={onPrev} />
        <div className="w-1/2" onClick={onNext} />
      </div>
    </div>
  )
}