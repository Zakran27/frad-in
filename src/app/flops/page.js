'use client'
import { useState } from 'react'
import Image from 'next/image'

export default function FlopsPage() {
  const [openCard, setOpenCard] = useState(null)

  const toggleCard = (card) => {
    setOpenCard(openCard === card ? null : card)
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-12 md:px-20 lg:px-32">
      <h1 className="text-3xl md:text-4xl font-bold text-blue-500 mb-8">🫣 The Flops Collection</h1>

      <div className="space-y-6">
        {/* CARD 1 */}
        <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-lg overflow-hidden">
          <button
            onClick={() => toggleCard('vocal')}
            className="w-full text-left p-6 text-lg font-semibold text-pink-400 hover:bg-gray-800 transition flex justify-between items-center"
          >
            <span>{openCard === 'vocal' ? '🔊 0 reaction mdrrrr' : '🔊 Le vocal de la honte'}</span>
            <span className="text-xl">{openCard === 'vocal' ? '⬆️' : '⬇️'}</span>
          </button>
          {openCard === 'vocal' && (
            <div className="p-6 border-t border-gray-700 bg-gray-950">
              <audio controls className="w-full">
                <source src="/vocal-de-la-honte.mp3" type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
        </div>

        {/* CARD 2 */}
        <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-lg overflow-hidden">
          <button
            onClick={() => toggleCard('join')}
            className="w-full text-left p-6 text-lg font-semibold text-pink-400 hover:bg-gray-800 transition flex justify-between items-center"
          >
            <span>{openCard === 'join' ? '😔 it sads' : '😔 pls join'}</span>
            <span className="text-xl">{openCard === 'join' ? '⬆️' : '⬇️'}</span>
          </button>
          {openCard === 'join' && (
            <div className="p-6 border-t border-gray-700 bg-gray-950 flex justify-center">
              <Image
                src="/pls-join-screenshot.png"
                alt="pls join"
                width={500}
                height={350}
                className="rounded-md border border-white w-full max-w-lg object-contain"
                />
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
