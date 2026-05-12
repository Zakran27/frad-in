'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function TalarefBrowser({ entries }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [sortOrder, setSortOrder] = useState('newest')

  const filteredEntries = useMemo(() => {
    let temp = [...entries]

    if (selectedType !== 'all') {
      temp = temp.filter((entry) => entry.media_type === selectedType)
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase()
      temp = temp.filter(
        (entry) =>
          entry.title.toLowerCase().includes(q) ||
          (entry.context && entry.context.toLowerCase().includes(q))
      )
    }

    if (sortOrder === 'newest') {
      temp.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    } else if (sortOrder === 'oldest') {
      temp.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    } else if (sortOrder === 'az') {
      temp.sort((a, b) => a.title.localeCompare(b.title))
    } else if (sortOrder === 'za') {
      temp.sort((a, b) => b.title.localeCompare(a.title))
    }

    return temp
  }, [entries, selectedType, searchQuery, sortOrder])

  const highlightText = (text, query) => {
    if (!query) return text
    const parts = text.split(new RegExp(`(${query})`, 'gi'))
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="bg-yellow-300 text-black px-1 rounded">{part}</mark>
      ) : (
        part
      )
    )
  }

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <input
          type="text"
          placeholder="Search by title or context..."
          className="bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-1/3"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select
          className="bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-1/5"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="all">All types</option>
          <option value="image">Image</option>
          <option value="video">Video</option>
          <option value="embed">Embed</option>
          <option value="text">Text</option>
        </select>

        <select
          className="bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-1/5"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="az">A-Z</option>
          <option value="za">Z-A</option>
        </select>
      </div>

      <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {filteredEntries.map((entry) => (
          <Link
            key={entry.id}
            href={`/talaref/${entry.slug}`}
            className="bg-gray-900 border border-gray-700 rounded-lg hover:shadow-md hover:bg-gray-800 transition h-64 min-w-[8rem] p-3 flex flex-col justify-between items-center text-center"
          >
            <div className="flex-grow flex items-center justify-center">
              {entry.thumbnail?.startsWith('http') ? (
                <Image
                  src={entry.thumbnail}
                  alt={entry.title}
                  width={64}
                  height={64}
                  className="object-cover rounded max-w-[64px] max-h-[64px]"
                />
              ) : (
                <span className="text-5xl">{entry.thumbnail}</span>
              )}
            </div>
            <h3 className="text-sm font-bold mt-4 break-words">
              {highlightText(entry.title, searchQuery)}
            </h3>
          </Link>
        ))}
      </div>

      {filteredEntries.length === 0 && (
        <p className="text-gray-400 text-center mt-12">
          😔 No entries match your filters...
        </p>
      )}
    </>
  )
}
