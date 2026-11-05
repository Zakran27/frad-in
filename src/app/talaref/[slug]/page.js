import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Tweet } from 'react-tweet'
import { sql } from '@/lib/neonClient'
import { isBlobUrl, safeMediaUrl, tweetId } from '@/lib/media'

export const dynamic = 'force-dynamic'

// iframes tierces : scripts autorisés (lecteurs vidéo), mais pas de navigation de la page parente
const IFRAME_SANDBOX = 'allow-scripts allow-same-origin allow-presentation allow-popups'

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
  // Lien revérifié à l'affichage (les anciennes entrées n'ont pas été validées à l'ajout)
  const media = entry.media_type === 'text' ? null : safeMediaUrl(entry.link)
  const tweet = entry.media_type === 'embed' ? tweetId(media) : null

  return (
    <section>
      <div className="max-w-4xl">
        <Link href="/talaref" className="inline-flex min-h-11 items-center font-mono text-sm text-muted hover:text-paper">
          ← all refs
        </Link>
        <h1 className="mt-2 font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-balance [overflow-wrap:anywhere]">
          {entry.title}
        </h1>
        <p className="mt-4 mb-8 text-lg text-muted max-w-2xl">{entry.context}</p>

        <div className="rounded-3xl bg-ink-2 border border-line p-4 sm:p-6 lg:p-8 flex justify-center items-center">
          {entry.media_type === 'image' && isBlobUrl(media) && (
            <Image
              src={media}
              alt={entry.title}
              width={1000}
              height={600}
              className="rounded-md object-contain w-full"
            />
          )}

          {entry.media_type === 'video' && isBlobUrl(media) && (
            <video src={media} controls preload="metadata" className="w-full rounded-md" />
          )}

          {entry.media_type === 'video' && media && !isBlobUrl(media) && (
            <div className="w-full aspect-video">
              <iframe
                src={media}
                title={entry.title}
                className="w-full h-full rounded-md"
                sandbox={IFRAME_SANDBOX}
                referrerPolicy="strict-origin-when-cross-origin"
                loading="lazy"
                allowFullScreen
              />
            </div>
          )}

          {tweet && (
            <div className="w-full flex justify-center">
              <div className="max-w-xl w-full bg-black/10 p-4 rounded-md">
                <Tweet id={tweet} />
              </div>
            </div>
          )}

          {entry.media_type === 'embed' && media && !tweet && (
            <iframe
              src={media}
              className="w-full h-[480px] rounded-md"
              title={entry.title}
              sandbox={IFRAME_SANDBOX}
              referrerPolicy="strict-origin-when-cross-origin"
              loading="lazy"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          )}

          {entry.media_type !== 'text' && !media && (
            <p className="text-muted text-center">Link hidden (host not allowed).</p>
          )}

          {entry.media_type === 'text' && (
            <p className="font-display text-2xl sm:text-3xl font-bold text-center text-balance [overflow-wrap:anywhere]">{entry.link}</p>
          )}
        </div>
      </div>
    </section>
  )
}
