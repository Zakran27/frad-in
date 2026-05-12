import './globals.css'
import Link from 'next/link'
import { Inter } from 'next/font/google'
import { FaGithub } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata = {
  metadataBase: new URL('https://bellab.re'),
  title: {
    default: 'bellab.re',
    template: '%s · bellab.re',
  },
  description: 'Weird side projects, dumb jokes, and tech experiments by Thomas Fradin de Bellabre.',
  applicationName: 'bellab.re',
  authors: [{ name: 'Thomas Fradin de Bellabre' }],
  openGraph: {
    type: 'website',
    url: 'https://bellab.re',
    siteName: 'bellab.re',
    title: 'bellab.re',
    description: 'Weird side projects, dumb jokes, and tech experiments.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'bellab.re',
    description: 'Weird side projects, dumb jokes, and tech experiments.',
    creator: '@zakran27',
  },
  icons: {
    icon: '/favicon.ico',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-black text-white">
        <header className="sticky top-0 z-50 bg-black border-b border-gray-800">
          <div className="px-4 py-4 sm:px-6 md:px-10 lg:px-24 xl:px-40 max-w-screen-2xl mx-auto flex items-center justify-between gap-4">
            <Link href="/" className="text-blue-500 text-lg font-bold hover:underline flex items-center gap-2">
              <span role="img" aria-label="planet">🪐</span> bellab.re
            </Link>
            <nav className="flex items-center gap-4 text-sm text-gray-400">
              <Link href="/talaref" className="hover:text-white">talaref</Link>
              <Link href="/b2b" className="hover:text-white">b2b</Link>
              <Link href="/flops" className="hover:text-white">flops</Link>
              <Link href="/sanity-checker" className="hover:text-white">rot</Link>
            </nav>
          </div>
        </header>

        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1f2937',
              color: '#fff',
              border: '1px solid #4b5563',
            },
            success: { icon: '✅' },
            error: { icon: '❌' },
          }}
        />

        <main className="px-4 py-6 sm:px-6 sm:py-8 md:px-10 lg:px-24 xl:px-40 max-w-screen-2xl mx-auto min-h-[calc(100vh-180px)]">
          {children}
        </main>

        <footer className="mt-16 border-t border-gray-800">
          <div className="px-4 py-6 sm:px-6 md:px-10 lg:px-24 xl:px-40 max-w-screen-2xl mx-auto pt-6 pb-10 text-sm text-gray-400">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4">
                <a
                  href="https://github.com/Zakran27"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-2"
                >
                  <FaGithub /> GitHub
                </a>
                <a
                  href="https://x.com/zakran27"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-2"
                >
                  <FaXTwitter /> X
                </a>
              </div>
              <p>© 2026 — Thomas Fradin de Bellabre.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
