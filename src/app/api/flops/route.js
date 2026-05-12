import { sql } from '/lib/neonClient'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const rows = await sql`SELECT id, title, media_type, link, created_at FROM public.flops ORDER BY id ASC`
    return Response.json(rows)
  } catch (err) {
    console.error('GET /api/flops failed:', err)
    return Response.json({ error: 'Failed to load flops' }, { status: 500 })
  }
}
