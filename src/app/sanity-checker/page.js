'use client'
import { useEffect, useState } from 'react'

const getTimeRoast = (hour) => {
  if (hour >= 0 && hour < 5) return "💀 it’s real n*** hours 🤙😏😏 go to sleep bro"
  if (hour >= 5 && hour < 7) return "sun’s not even up yet… why are you here?"
  if (hour >= 22) return "you’re entering the danger zone…"
  return "all good. for now..."
}

export default function SanityChecker() {
  const [roast, setRoast] = useState('')
  const [degenerationLevel, setDegenerationLevel] = useState(0)

  useEffect(() => {
    // Time check on load
    const hour = new Date().getHours()
    setRoast(getTimeRoast(hour))

    // Degeneration loop
    const interval = setInterval(() => {
      setDegenerationLevel((lvl) => Math.min(lvl + 1, 5))
    }, 10000) // increase level every 10s

    return () => clearInterval(interval)
  }, [])

  const degenerationMessages = [
    "",
    "you’re still here huh…",
    "bro for real, close the tab.",
    "okay… starting to worry now",
    "touch some grass. please.",
    "internet detox imminent. browser self-destruct in 3... 2..."
  ]

  return (
    <main className="min-h-screen bg-black text-white px-6 py-20 md:px-32 lg:px-64 flex flex-col items-center justify-center text-center space-y-6">
      <p className="text-xl text-pink-400">{roast}</p>

      {degenerationLevel > 0 && (
        <div className="text-lg mt-4 text-red-400 italic animate-pulse">
          {degenerationMessages[degenerationLevel]}
        </div>
      )}
    </main>
  )
}
