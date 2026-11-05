import Link from 'next/link'
import HomeTitle from './HomeTitle'
import DamienToggle from './DamienToggle'
import { randomTitleIndex } from '@/lib/titles'

// Un titre différent à chaque visite, présent dès le HTML (pas de flash au chargement)
export const dynamic = 'force-dynamic'

const card =
  'group rounded-2xl p-6 sm:p-7 flex flex-col justify-between gap-6 transition-transform motion-safe:hover:-translate-y-0.5'

export default function Home() {
  return (
    <>
      <section className="pt-4 sm:pt-10">
        <HomeTitle initial={randomTitleIndex()} />
        <p className="mt-8 text-lg sm:text-xl text-muted max-w-2xl">
          A playground of side projects, dumb jokes, and weird experiments.
        </p>
        <DamienToggle />
      </section>

      <section aria-labelledby="projects" className="mt-16 sm:mt-24">
        <h2 id="projects" className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
          Latest projects
        </h2>
        <div className="mt-6 grid gap-4 grid-cols-2 sm:grid-cols-6 sm:auto-rows-[minmax(9rem,auto)]">
          <Link
            href="/talaref"
            className={`${card} col-span-2 sm:col-span-4 sm:row-span-2 bg-ink-2 border border-line hover:border-paper/40 min-h-64`}
          >
            <span className="text-6xl" aria-hidden="true">📚</span>
            <div>
              <h3 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight">talaref</h3>
              <p className="mt-2 text-muted max-w-md">The pretty niche ref db to flex on your friends.</p>
            </div>
          </Link>

          <Link href="/b2b" className={`${card} col-span-2 bg-signal text-ink`}>
            <h3 className="font-display text-3xl font-extrabold tracking-tight">B2B 🔥</h3>
            <p className="font-medium">Real French rap punchline, or AI? bendo2bendo.</p>
          </Link>

          <Link
            href="/flops"
            title="Shhh... it's a secret"
            className={`${card} bg-ink-3 border border-line items-center justify-center text-5xl`}
          >
            <span aria-hidden="true">💀</span>
            <span className="sr-only">flops (secret)</span>
          </Link>

          <Link href="/sanity-checker" className={`${card} bg-acid text-ink`}>
            <h3 className="font-display text-2xl font-extrabold">rot.</h3>
            <span className="text-3xl" aria-hidden="true">🕒</span>
          </Link>
        </div>
      </section>
    </>
  )
}
