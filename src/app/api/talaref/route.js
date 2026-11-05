import { sql } from '@/lib/neonClient'
import { hasAddSecret } from '@/lib/addSecret'
import { isBlobUrl, safeMediaUrl, tweetId } from '@/lib/media'

export const dynamic = 'force-dynamic'

const MEDIA_TYPES = ['text', 'image', 'video', 'embed']
const str = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

export async function POST(request) {
  if (!hasAddSecret(request)) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const title = str(body.title, 200)
    const context = str(body.context, 2000)
    const media_type = body.media_type
    const slug = str(body.slug, 120)
    const thumbnail = str(body.thumbnail, 500)
    let link = str(body.link, 2000)

    if (!title || !context || !link || !MEDIA_TYPES.includes(media_type) || !/^[a-z0-9-]+$/.test(slug)) {
      return Response.json({ error: 'Missing or invalid fields' }, { status: 400 })
    }
    // Médias : https et hôtes autorisés seulement (images = nos uploads Vercel Blob)
    if (media_type !== 'text') {
      link = media_type === 'image' ? (isBlobUrl(link) ? link : null) : safeMediaUrl(link)
      if (!link || (media_type === 'embed' && /(twitter|x)\.com/.test(link) && !tweetId(link))) {
        return Response.json({ error: 'Unsupported media link' }, { status: 400 })
      }
    }
    // Vignette : un emoji / texte court, ou une image uploadée
    if (thumbnail.startsWith('http') && !isBlobUrl(thumbnail)) {
      return Response.json({ error: 'Thumbnail must be an emoji or an uploaded image' }, { status: 400 })
    }

    const [inserted] = await sql`
      INSERT INTO public.talaref_entries (title, context, media_type, link, slug, thumbnail)
      VALUES (${title}, ${context}, ${media_type}, ${link}, ${slug}, ${thumbnail})
      RETURNING id, slug
    `
    return Response.json(inserted, { status: 201 })
  } catch (err) {
    console.error('POST /api/talaref failed:', err)
    return Response.json({ error: 'Failed to insert entry' }, { status: 500 })
  }
}
