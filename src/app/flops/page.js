'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import Image from 'next/image'

export default function FlopsPage() {
  const [flops, setFlops] = useState([])
  const [openCard, setOpenCard] = useState(null)

  const toggleCard = (id) => {
    setOpenCard(openCard === id ? null : id)
  }

  useEffect(() => {
    const fetchFlops = async () => {
      const { data, error } = await supabase.from('flops').select('*').order('id', { ascending: true })
      if (error) console.error('Error loading flops:', error)
      else setFlops(data)
    }

    fetchFlops()
  }, [])

  return (
    <main className="min-h-screen bg-black text-white px-6 py-12 md:px-20 lg:px-32">
      <h1 className="text-3xl md:text-4xl font-bold text-blue-500 mb-8">🫣 The Flops Collection</h1>

      <div className="space-y-6">
        {flops.map((flop) => (
          <div key={flop.id} className="bg-gray-900 border border-gray-700 rounded-lg shadow-lg overflow-hidden">
            <button
              onClick={() => toggleCard(flop.id)}
              className="w-full text-left p-6 text-lg font-semibold text-pink-400 hover:bg-gray-800 transition flex justify-between items-center"
            >
              <span>{openCard === flop.id ? `🔊 ${flop.title}` : flop.title}</span>
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
    </main>
  )
}
