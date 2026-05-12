import Link from 'next/link'

export const metadata = { title: '404' }

export default function NotFound() {
  return (
    <section className="min-h-[60vh] flex flex-col items-center justify-center text-center py-12">
      <h1 className="text-6xl mb-4">🛸</h1>
      <h2 className="text-2xl font-bold text-blue-500 mb-2">Lost in space</h2>
      <p className="text-gray-400 mb-6">This page does not exist. Or maybe it never did.</p>
      <Link href="/" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white font-semibold">
        Beam me home
      </Link>
    </section>
  )
}
