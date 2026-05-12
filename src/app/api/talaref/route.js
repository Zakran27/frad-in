import { sql } from '@/lib/neonClient'

export const dynamic = 'force-dynamic'

export async function POST(request) {
  if (request.headers.get('x-add-secret') !== process.env.ADD_SECRET) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { title, context, media_type, link, slug, thumbnail } = body

    if (!title || !context || !media_type || !link || !slug) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 })
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
