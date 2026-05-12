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
    <section className="py-12 px-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-500">📚 Talaref?</h1>
        <Link
          href="/talaref/add"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-semibold"
        >
          ➕ Add a Ref
        </Link>
      </div>

      <TalarefBrowser entries={entries} />
    </section>
  )
}
