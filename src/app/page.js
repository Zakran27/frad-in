'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FaGithub, FaTwitter } from 'react-icons/fa'

export default function Home() {
  const [title, setTitle] = useState(null)
  const [showDamien, setShowDamien] = useState(false)

  useEffect(() => {
    const options = [
      { text: '🩰 Ballerrrinaaa ☕ Cappuccciiiinnnaa' },
      { text: 'Aaarhghaaggga..... 💀' },
      { text: '😲 (**visage choqué**)' },
      { isLink: true, text: 'Click here to know what time it is 🕒', href: 'http://quelleheureestilenjoy.com/' },
      { text: 'hmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm' },
    ]
    const random = options[Math.floor(Math.random() * options.length)]
    setTitle(random)
  }, [])

  return (
    <main className="min-h-screen bg-black text-white px-6 py-12 md:px-20 lg:px-40 max-w-7xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-bold text-blue-500 mb-4">
        {title?.isLink ? (
          <Link href={title.href} target="_blank" rel="noopener noreferrer" className="hover:underline">
            {title.text}
          </Link>
        ) : (
          title?.text
        )}
      </h1>

      <p className="text-lg mb-8 text-gray-300">A playground of side projects, dumb jokes, and weird experiments.</p>

      {/* Damien toggle section */}
      <div className="mb-10">
        <button
          onClick={() => setShowDamien(!showDamien)}
          className="text-pink-400 font-semibold mb-4 hover:underline transition flex items-center gap-2"
        >
          {showDamien ? 'Hide Damien 🐶⬆️' : 'Show Damien 🐶⬇️'}
        </button>
        {showDamien && (
          <div>
            <p className="mb-2">Your grosse daronne Damien :D</p>
            <Image
              src="/damien.jpg"
              width={250}
              height={250}
              alt="Damien"
              className="rounded-lg border border-white"
            />
          </div>
        )}
      </div>

      {/* Project cards */}
      <h2 className="text-2xl md:text-3xl font-bold mb-6">Latest Projects</h2>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2">talaref?</h3>
          <p className="text-gray-400 text-sm">best refs&memes.</p>
        </div>
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2">B2B</h3>
          <p className="text-gray-400 text-sm">bendo na bendo.</p>
        </div>
        <a
          href="/flops"
          className="bg-gray-900 border border-gray-700 rounded-lg p-6 shadow hover:shadow-lg transition flex items-center justify-center text-3xl"
          title="Shhh... it's a secret"
        >
          💀
        </a>
        <a
          href="/sanity-checker"
          className="bg-gray-900 border border-gray-700 rounded-lg p-6 shadow hover:shadow-lg transition flex flex-col justify-between"
        >
          <h3 className="text-xl font-semibold mb-2">rot.</h3>
          <p className="text-gray-400 text-sm">🕒</p>
        </a>
      </div>

      {/* Social links */}
      <footer className="mt-16 flex flex-col items-start gap-4 text-sm text-gray-400">
        <div className="flex items-center gap-4">
          <a href="https://github.com/Zakran27" target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center gap-2">
            <FaGithub /> GitHub
          </a>
          <a href="https://x.com/zakran27" target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center gap-2">
            <FaTwitter /> Twitter
          </a>
        </div>
        <p>© 2025 — Thomas Fradin de Bellabre. All rights reserved.</p>
      </footer>
    </main>
  )
}
