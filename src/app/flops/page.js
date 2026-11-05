import { sql } from '@/lib/neonClient'
import FlopsList from './FlopsList'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'flops',
  description: 'The personal collection of embarrassments.',
}

export default async function FlopsPage() {
  const flops = await sql`SELECT id, title, media_type, link FROM public.flops ORDER BY id ASC`

  return (
    <section className="max-w-3xl">
      <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight mb-8">
        The Flops Collection <span aria-hidden="true">🫣</span>
      </h1>
      <FlopsList flops={flops} />
    </section>
  )
}
