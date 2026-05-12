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
    <section className="py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-blue-500 mb-8">🫣 The Flops Collection</h1>
      <FlopsList flops={flops} />
    </section>
  )
}
