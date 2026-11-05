import { sql } from '@/lib/neonClient'

export const dynamic = 'force-dynamic'

// Une chance sur deux : vraie punchline (b2b_punchlines) ou fausse écrite par une IA, stockée une
// fois pour toutes dans b2b_fakes (aucun appel d'API ici).
export async function GET() {
  try {
    if (Math.random() < 0.5) {
      const [fake] = await sql`SELECT text FROM public.b2b_fakes ORDER BY random() LIMIT 1`
      if (fake) return Response.json({ text: fake.text, isReal: false })
    }
    const [real] = await sql`SELECT * FROM public.get_random_punchline()`
    if (!real) return Response.json({ error: 'No data' }, { status: 404 })
    return Response.json({
      text: real.text,
      isReal: true,
      artist: real.artist,
      title: real.title,
      source: real.source,
    })
  } catch (err) {
    console.error('GET /api/b2b-random failed:', err)
    return Response.json({ error: 'DB failed' }, { status: 500 })
  }
}
