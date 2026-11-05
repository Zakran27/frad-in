'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { isBlobUrl } from '@/lib/media'

const FIELD =
  'w-full min-h-11 rounded-xl bg-ink-2 border border-line px-4 text-paper placeholder:text-muted focus:border-paper/50'

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
    // Recherche littérale : une parenthèse ou un point dans la recherche ne doit pas casser la page
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const parts = text.split(new RegExp(`(${escaped})`, 'gi'))
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="bg-acid text-ink px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    )
  }

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)] mb-8">
        <label className="block">
          <span className="sr-only">Search</span>
          <input
            type="search"
            placeholder="Search by title or context…"
            className={FIELD}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </label>
        <label className="block">
          <span className="sr-only">Type</span>
          <select className={FIELD} value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
            <option value="all">All types</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
            <option value="embed">Embed</option>
            <option value="text">Text</option>
          </select>
        </label>
        <label className="block">
          <span className="sr-only">Sort</span>
          <select className={FIELD} value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="az">A-Z</option>
            <option value="za">Z-A</option>
          </select>
        </label>
      </div>

      <ul className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        {filteredEntries.map((entry) => (
          <li key={entry.id}>
            <Link
              href={`/talaref/${entry.slug}`}
              className="group h-56 rounded-2xl bg-ink-2 border border-line p-4 flex flex-col justify-between hover:border-paper/40 hover:bg-ink-3 transition-colors"
            >
              <div className="flex-grow flex items-center justify-center">
                {isBlobUrl(entry.thumbnail) ? (
                  <Image
                    src={entry.thumbnail}
                    alt=""
                    width={80}
                    height={80}
                    className="object-cover rounded-xl size-20 transition-transform motion-safe:group-hover:rotate-[-3deg]"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="text-5xl transition-transform motion-safe:group-hover:scale-110"
                  >
                    {entry.thumbnail}
                  </span>
                )}
              </div>
              <h2 className="font-display font-bold leading-tight [overflow-wrap:anywhere]">
                {highlightText(entry.title, searchQuery)}
              </h2>
            </Link>
          </li>
        ))}
      </ul>

      {filteredEntries.length === 0 && (
        <p className="text-muted text-center mt-12">😔 No entries match your filters…</p>
      )}
    </>
  )
}
