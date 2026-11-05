import Link from 'next/link'

export const metadata = { title: '404' }

export default function NotFound() {
  return (
    <section className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <p className="text-6xl" aria-hidden="true">🛸</p>
      <h1 className="mt-4 font-display text-3xl font-extrabold">Lost in space</h1>
      <p className="mt-2 text-muted">This page does not exist. Or maybe it never did.</p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center min-h-11 px-6 rounded-full bg-paper text-ink font-semibold hover:bg-acid active:scale-95 transition"
      >
        Beam me home
      </Link>
    </section>
  )
}
