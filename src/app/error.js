'use client'

import { useEffect } from 'react'

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <section className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <p className="text-6xl" aria-hidden="true">💥</p>
      <h1 className="mt-4 font-display text-3xl font-extrabold">Something broke</h1>
      <p className="mt-2 text-muted">An unexpected error happened. Try again?</p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 min-h-11 px-6 rounded-full bg-paper text-ink font-semibold hover:bg-acid active:scale-95 transition"
      >
        Retry
      </button>
    </section>
  )
}
