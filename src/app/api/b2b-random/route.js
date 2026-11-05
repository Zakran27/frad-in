import Anthropic from '@anthropic-ai/sdk'
import { sql } from '@/lib/neonClient'

export const dynamic = 'force-dynamic'

// Fausses punchlines : générées par Claude puis gardées en base (table b2b_fakes). Au-delà de
// FAKE_POOL_MAX, plus aucun appel API : la route est publique, le coût total est donc plafonné.
// ponytail: deux appels simultanés peuvent dépasser le plafond d'une ou deux lignes, sans importance.
const FAKE_MODEL = 'claude-haiku-5-5'
const FAKE_POOL_MAX = 200
const client = process.env.ANTHROPIC_API_KEY ? new Anthropic() : null

const prompts = [
  "Écris une seule punchline de rap français, crue, originale et percutante. Une ligne. Pas de guillemets, pas d’intro. Ne sois pas poétique, sois réel, provocateur, brut ou drôle. Utilise du langage parlé ou familier si nécessaire. Aucun filtre.",
  "Génère une punchline de rap français comme si c’était Booba, Alpha Wann ou Freeze Corleone. Pas de guillemets. Une ligne, sèche, egotrip ou menaçante. Pas de fluff, pas d’explication.",
  "Fais une punchline de rap français à l’ancienne, sombre ou absurde, mais percutante. Pas de guillemets. Pas d’intro, une ligne brute, comme si c’était un freestyle.",
  "Invente une punchline de rap FR qui pourrait choquer ou faire rire. Pas de métaphores chiantes. Pas de guillemets. Une ligne, directe, efficace, que des vrais ressentent.",
]

async function generateFake() {
  if (!client) return null
  try {
    const res = await client.messages.create({
      model: FAKE_MODEL,
      max_tokens: 300,
      // Une ligne : pas besoin de réflexion (elle consommerait les tokens de sortie)
      thinking: { type: 'disabled' },
      output_config: { effort: 'low' },
      messages: [{ role: 'user', content: prompts[Math.floor(Math.random() * prompts.length)] }],
    })
    // refusal (pas de repli serveur sur Haiku) ou réponse coupée : on se rabat sur la base
    if (res.stop_reason !== 'end_turn') return null
    const text = res.content
      .find((b) => b.type === 'text')
      ?.text.trim()
      .replace(/^["«\s]+|["»\s]+$/g, '')
    return text || null
  } catch (err) {
    if (err instanceof Anthropic.APIError) console.error('Claude API error', err.status, err.message)
    else console.error('Claude request failed', err)
    return null
  }
}

async function fakePunchline() {
  const [{ n }] = await sql`SELECT count(*)::int AS n FROM public.b2b_fakes`
  if (n < FAKE_POOL_MAX) {
    const text = await generateFake()
    if (text) {
      await sql`INSERT INTO public.b2b_fakes (text) VALUES (${text}) ON CONFLICT (text) DO NOTHING`
      return text
    }
  }
  const [row] = await sql`SELECT text FROM public.b2b_fakes ORDER BY random() LIMIT 1`
  return row?.text ?? null
}

export async function GET() {
  try {
    if (Math.random() < 0.5) {
      const text = await fakePunchline()
      if (text) return Response.json({ text, isReal: false })
    }
    // Vraie punchline (ou repli si aucune fausse n'est disponible)
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
