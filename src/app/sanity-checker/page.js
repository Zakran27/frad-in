'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

const getTimeRoast = (hour) => {
  if (hour >= 0 && hour < 5) return "💀 It's real n*** hours 🤙😏😏 go to sleep bro"
  if (hour >= 5 && hour < 7) return "🌅 Sun's not even up yet… why are you here?"
  if (hour >= 22) return "🌙 You're entering the danger zone…"
  return '✅ All good. For now...'
}

const degenerationMessages = [
  '',
  "you're still here huh…",
  'bro for real, close the tab.',
  'okay… starting to worry now',
  'touch some grass. please.',
  'internet detox imminent. browser self-destruct in 3... 2...',
]

const degenerationImages = ['', '/manu.jpeg', '/bbh.jpg', '/sip.jpeg', '/abs.png', '/tng.jpeg']

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

  const currentImage = degenerationImages[degenerationLevel]

  return (
    <section
      aria-live="polite"
      className="min-h-[70vh] flex flex-col items-center justify-center text-center"
    >
      {degenerationLevel === 0 ? (
        <p className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-balance max-w-3xl">
          {getTimeRoast(hour)}
        </p>
      ) : (
        <div className="flex flex-col items-center">
          {currentImage && (
            <Image
              src={currentImage}
              alt=""
              width={200}
              height={200}
              className="mb-8 rounded-2xl border border-line rotate-[-3deg]"
            />
          )}
          <p className="font-display text-2xl sm:text-4xl font-bold text-signal italic motion-safe:animate-pulse">
            {degenerationMessages[degenerationLevel]}
          </p>
        </div>
      )}
      <p className="mt-10 font-mono text-sm text-muted">
        rot level {degenerationLevel}/{degenerationMessages.length - 1}
      </p>
    </section>
  )
}
