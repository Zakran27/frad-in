'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

const getTimeRoast = (hour) => {
  if (hour >= 0 && hour < 5) return "💀 It's real n*** hours 🤙😏😏 go to sleep bro"
  if (hour >= 5 && hour < 7) return "🌅 Sun's not even up yet… why are you here?"
  if (hour >= 22) return "🌙 You're entering the danger zone…"
  return "✅ All good. For now..."
}

const degenerationMessages = [
  '',
  "you're still here huh…",
  'bro for real, close the tab.',
  'okay… starting to worry now',
  'touch some grass. please.',
  'internet detox imminent. browser self-destruct in 3... 2...',
]

const degenerationImages = [
  '',
  '/manu.jpeg',
  '/bbh.jpg',
  '/sip.jpeg',
  '/abs.png',
  '/tng.jpeg',
]

export default function SanityChecker() {
  const [hour, setHour] = useState(() => new Date().getHours())
  const [degenerationLevel, setDegenerationLevel] = useState(0)

  useEffect(() => {
    const hourTick = setInterval(() => setHour(new Date().getHours()), 60_000)
    const levelTick = setInterval(() => {
      setDegenerationLevel((lvl) => Math.min(lvl + 1, degenerationMessages.length - 1))
    }, 10_000)
    return () => {
      clearInterval(hourTick)
      clearInterval(levelTick)
    }
  }, [])

  const showRoast = degenerationLevel === 0
  const currentMessage = degenerationMessages[degenerationLevel]
  const currentImage = degenerationImages[degenerationLevel]

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center py-12">
      {showRoast && (
        <p className="text-xl md:text-2xl font-semibold text-pink-400 mb-6">{getTimeRoast(hour)}</p>
      )}

      {degenerationLevel > 0 && (
        <div className="flex flex-col items-center">
          {currentImage && (
            <Image
              src={currentImage}
              alt="degeneration"
              width={200}
              height={200}
              className="mb-6"
            />
          )}
          <p className="text-lg md:text-xl text-red-400 italic animate-pulse">
            {currentMessage}
          </p>
        </div>
      )}
    </div>
  )
}
