'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function DamienToggle() {
  const [open, setOpen] = useState(false)

  return (
    <div className="mt-10">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="damien"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 min-h-11 font-mono text-sm text-signal hover:underline underline-offset-4"
      >
        {open ? 'Hide Damien 🐶⬆️' : 'Show Damien 🐶⬇️'}
      </button>
      {open && (
        <div id="damien" className="mt-4">
          <p className="mb-3 text-muted">Your grosse daronne Damien :D</p>
          <Image
            src="/damien.jpg"
            width={250}
            height={250}
            alt="Damien"
            className="rounded-xl border border-line w-full max-w-[250px] rotate-[-2deg]"
          />
        </div>
      )}
    </div>
  )
}
