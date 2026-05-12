import { sql } from '/lib/neonClient'

export const dynamic = 'force-dynamic'

export async function GET(_request, { params }) {
  try {
    const { slug } = await params
    const rows = await sql`
      SELECT id, title, slug, thumbnail, media_type, link, context, created_at
      FROM public.talaref_entries
      WHERE slug = ${slug}
      LIMIT 1
    `
    if (rows.length === 0) {
      return Response.json({ error: 'Not found' }, { status: 404 })
    }
    return Response.json(rows[0])
  } catch (err) {
    console.error('GET /api/talaref/[slug] failed:', err)
    return Response.json({ error: 'Failed to load entry' }, { status: 500 })
  }
}
