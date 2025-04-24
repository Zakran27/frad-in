'use client'
import Image from 'next/image'
import { useState } from 'react'
import { FaGithub, FaTwitter } from 'react-icons/fa'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'

export default function Home() {
  const [showDamien, setShowDamien] = useState(false)

  return (
    <main className="min-h-screen bg-black text-white px-4 sm:px-8 md:px-12 lg:px-24 xl:px-36 py-12">
      {/* Header */}
      <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-500 mb-3">Welcome to my site 🎉</h1>
      <p className="text-lg text-gray-300 mb-8">
        A place to explore my tech projects, side ideas and experiments.
      </p>

      {/* Damien section */}
      <div className="mb-10">
        <button
          onClick={() => setShowDamien(!showDamien)}
          className="flex items-center gap-2 text-pink-400 font-semibold transition hover:text-pink-300"
        >
          Your grosse daronne Damien :D {showDamien ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        {showDamien && (
          <div className="mt-4">
            <Image
              src="/damien.jpg"
              width={250}
              height={250}
              alt="Damien"
              className="rounded-lg border border-white shadow-lg"
            />
          </div>
        )}
      </div>

      {/* Projects */}
      <section>
        <h2 className="text-2xl sm:text-3xl font-bold mb-6">Latest Projects</h2>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">RapLyrics Finder</h3>
            <p className="text-gray-400 text-sm">
              A search engine for all French rap lyrics (WIP).
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-16 text-sm text-gray-400 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex gap-4 items-center">
          <a
            href="https://github.com/Zakran27"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white flex items-center gap-2"
          >
            <FaGithub /> GitHub
          </a>
          <a
            href="https://x.com/zakran27"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white flex items-center gap-2"
          >
            <FaTwitter /> Twitter
          </a>
        </div>
        <p>© 2025 — Thomas Fradin de Bellabre. All rights reserved.</p>
      </footer>
    </main>
  )
}
