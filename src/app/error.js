'use client'

import { useEffect } from 'react'

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <section className="min-h-[60vh] flex flex-col items-center justify-center text-center py-12">
      <h1 className="text-6xl mb-4">💥</h1>
      <h2 className="text-2xl font-bold text-red-500 mb-2">Something broke</h2>
      <p className="text-gray-400 mb-6">An unexpected error happened. Try again?</p>
      <button
        onClick={reset}
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white font-semibold"
      >
        Retry
      </button>
    </section>
  )
}
