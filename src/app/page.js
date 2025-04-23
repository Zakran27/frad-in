'use client'

import { FaMicrophoneAlt } from 'react-icons/fa'
import { AiOutlineCopyrightCircle } from 'react-icons/ai'

export default function Home() {
  return (
    <main className="min-h-screen px-6 py-16 md:py-24 bg-black text-white font-sans flex flex-col items-center">
      <section className="text-center max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-blue-500 leading-tight">
          Welcome to my personal website
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-16">
          Explore my latest tech projects, side experiments and digital tools.
        </p>
      </section>

      <section className="w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-8 text-white text-center">
          🧪 Featured Project
        </h2>

        <div className="mb-12 px-4 md:px-0">
          <div className="flex items-center gap-3 mb-2">
            <FaMicrophoneAlt className="text-pink-400 text-xl" />
            <h3 className="text-xl font-semibold">RapLyrics Finder</h3>
          </div>
          <p className="text-gray-400 ml-8">
            A search engine to browse all French rap lyrics. (Work in progress)
          </p>
        </div>
      </section>

      <footer className="text-center text-sm text-gray-500 mt-auto flex items-center justify-center gap-1">
        <AiOutlineCopyrightCircle />
        <p>2025 – Thomas Fradin de Bellabre. All rights reserved.</p>
      </footer>
    </main>
  )
}
