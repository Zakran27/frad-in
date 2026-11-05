'use client'

import { useState } from 'react'
import { TITLES, randomTitleIndex } from '@/lib/titles'

export default function HomeTitle({ initial }) {
  const [index, setIndex] = useState(initial)
  const title = TITLES[index]

  return (
    <div>
      <h1
        aria-live="polite"
        className="font-display font-extrabold tracking-tight text-balance [overflow-wrap:anywhere] leading-[1.02] text-[clamp(2.5rem,7vw,5.75rem)] max-w-5xl"
      >
        {title.href ? (
          <a
            href={title.href}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-signal decoration-4 underline-offset-8 hover:text-signal"
          >
            {title.text}
          </a>
        ) : (
          title.text
        )}
      </h1>
      <button
        type="button"
        onClick={() => setIndex(randomTitleIndex(index))}
        className="mt-6 inline-flex items-center gap-2 min-h-11 px-4 rounded-full border border-line font-mono text-sm text-muted hover:text-ink hover:bg-acid hover:border-acid transition-colors active:scale-95"
      >
        <span aria-hidden="true">🎲</span> another title
      </button>
    </div>
  )
}
