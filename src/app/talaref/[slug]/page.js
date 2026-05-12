import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Tweet } from 'react-tweet'
import { sql } from '@/lib/neonClient'

export const dynamic = 'force-dynamic'

function extractTweetId(url) {
  const match = url?.match(/status\/(\d+)/)
  return match?.[1] || null
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const rows = await sql`SELECT title, context FROM public.talaref_entries WHERE slug = ${slug} LIMIT 1`
  if (rows.length === 0) return { title: 'Not found' }
  return {
    title: rows[0].title,
    description: rows[0].context,
  }
}

export default async function TalarefEntryPage({ params }) {
  const { slug } = await params
  const rows = await sql`
    SELECT id, title, slug, thumbnail, media_type, link, context
    FROM public.talaref_entries
    WHERE slug = ${slug}
    LIMIT 1
  `

  if (rows.length === 0) notFound()
  const entry = rows[0]

  return (
    <section className="py-12">
      <div className="max-w-screen-xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-500 mb-2">{entry.title}</h1>
        <p className="mb-6 text-gray-300 text-lg">{entry.context}</p>

        <div className="border border-gray-700 rounded-lg bg-gray-900 p-4 md:p-6 lg:p-8 flex justify-center items-center">
          {entry.media_type === 'image' && (
            <Image
              src={entry.link}
              alt={entry.title}
              width={1000}
              height={600}
              className="rounded-md object-contain w-full"
            />
          )}

          {entry.media_type === 'video' && (
            <div className="w-full aspect-video">
              <iframe
                src={entry.link}
                title={entry.title}
                className="w-full h-full rounded-md"
                allowFullScreen
              />
            </div>
          )}

          {entry.media_type === 'embed' && entry.link.includes('twitter.com') ? (
            <div className="w-full flex justify-center">
              <div className="max-w-xl w-full bg-black/10 p-4 rounded-md">
                <Tweet id={extractTweetId(entry.link)} />
              </div>
            </div>
          ) : entry.media_type === 'embed' ? (
            <iframe
              src={entry.link}
              className="w-full h-[480px] rounded-md"
              title={entry.title}
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          ) : null}

          {entry.media_type === 'text' && (
            <p className="text-lg text-center">{entry.link}</p>
          )}
        </div>
      </div>
    </section>
  )
}
