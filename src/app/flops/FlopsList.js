'use client'

import { useState } from 'react'
import Image from 'next/image'
import { isBlobUrl } from '@/lib/media'

export default function FlopsList({ flops }) {
  const [openCard, setOpenCard] = useState(null)

  return (
    <ul className="space-y-3">
      {flops.map((flop) => {
        const open = openCard === flop.id
        const media = isBlobUrl(flop.link) ? flop.link : null
        return (
          <li key={flop.id} className="rounded-2xl bg-ink-2 border border-line overflow-hidden">
            <button
              type="button"
              aria-expanded={open}
              aria-controls={`flop-${flop.id}`}
              onClick={() => setOpenCard(open ? null : flop.id)}
              className="w-full min-h-14 text-left px-6 py-4 flex justify-between items-center gap-4 font-display text-lg font-bold hover:bg-ink-3"
            >
              <span>{open ? 'hush 🤫' : flop.title}</span>
              <span aria-hidden="true">{open ? '⬆️' : '⬇️'}</span>
            </button>
            {open && (
              <div id={`flop-${flop.id}`} className="px-6 pb-6 flex justify-center">
                {!media ? (
                  <p className="text-muted">Media unavailable.</p>
                ) : flop.media_type === 'audio' ? (
                  <audio controls src={media} className="w-full" />
                ) : (
                  <Image
                    src={media}
                    alt={flop.title}
                    width={500}
                    height={350}
                    className="rounded-xl border border-line w-full max-w-lg object-contain"
                  />
                )}
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
