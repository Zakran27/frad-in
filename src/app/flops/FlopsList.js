'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function FlopsList({ flops }) {
  const [openCard, setOpenCard] = useState(null)

  const toggleCard = (id) => {
    setOpenCard(openCard === id ? null : id)
  }

  return (
    <div className="space-y-6">
      {flops.map((flop) => (
        <div key={flop.id} className="bg-gray-900 border border-gray-700 rounded-lg shadow-lg overflow-hidden">
          <button
            onClick={() => toggleCard(flop.id)}
            className="w-full text-left p-6 text-lg font-semibold text-pink-400 hover:bg-gray-800 transition flex justify-between items-center"
          >
            <span>{openCard === flop.id ? `hush 🤫` : flop.title}</span>
            <span className="text-xl">{openCard === flop.id ? '⬆️' : '⬇️'}</span>
          </button>
          {openCard === flop.id && (
            <div className="p-6 border-t border-gray-700 bg-gray-950 flex justify-center">
              {flop.media_type === 'audio' ? (
                <audio controls className="w-full">
                  <source src={flop.link} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              ) : (
                <Image
                  src={flop.link}
                  alt={flop.title}
                  width={500}
                  height={350}
                  className="rounded-md border border-white w-full max-w-lg object-contain"
                />
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
