import Link from 'next/link'
import { sql } from '@/lib/neonClient'
import TalarefBrowser from './TalarefBrowser'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'talaref',
  description: 'A niche ref database for French YouTube culture and tala refs.',
}

export default async function TalarefList() {
  const entries = await sql`
    SELECT id, title, slug, thumbnail, media_type, link, context, created_at
    FROM public.talaref_entries
    ORDER BY created_at DESC
  `

  return (
    <section>
      <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
        <div>
          <h1 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight">
            talaref<span className="text-signal">?</span>
          </h1>
          <p className="mt-2 text-muted">
            {entries.length} refs to flex on your friends.
          </p>
        </div>
        <Link
          href="/talaref/add"
          className="inline-flex items-center min-h-11 px-5 rounded-full bg-paper text-ink font-semibold hover:bg-acid active:scale-95 transition"
        >
          Add a ref
        </Link>
      </div>

      <TalarefBrowser entries={entries} />
    </section>
  )
}
