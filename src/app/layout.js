import './globals.css'
import Link from 'next/link'
import { Bricolage_Grotesque, Instrument_Sans, JetBrains_Mono } from 'next/font/google'
import { FaGithub } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { Toaster } from 'react-hot-toast'

const display = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-bricolage' })
const sans = Instrument_Sans({ subsets: ['latin'], variable: '--font-instrument' })
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains', weight: ['400', '500'] })

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
  // Site perso : pas dans les moteurs de recherche (doublé par X-Robots-Tag dans next.config.mjs)
  robots: {
    index: false,
    follow: false,
  },
}

export const viewport = {
  themeColor: '#0f0e0c',
  width: 'device-width',
  initialScale: 1,
}

const NAV = [
  { href: '/talaref', label: 'talaref' },
  { href: '/b2b', label: 'b2b' },
  { href: '/flops', label: 'flops' },
  { href: '/sanity-checker', label: 'rot' },
]

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body className="bg-ink text-paper font-sans antialiased min-h-dvh flex flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 bg-acid text-ink px-3 py-2 rounded"
        >
          Skip to content
        </a>
        <header className="sticky top-0 z-40 bg-ink/90 backdrop-blur border-b border-line">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
            <Link href="/" className="font-display text-xl font-bold tracking-tight hover:text-signal">
              bellab<span className="text-signal">.</span>re
            </Link>
            <nav aria-label="Projects" className="flex items-center gap-1 sm:gap-2 font-mono text-sm">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-2 sm:px-3 py-2 rounded text-muted hover:text-paper hover:bg-ink-3"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#24211c', color: '#efe9dc', border: '1px solid #36312a' },
          }}
        />

        <main id="main" className="flex-1 mx-auto w-full max-w-6xl px-4 sm:px-6 py-10 sm:py-14">
          {children}
        </main>

        <footer className="border-t border-line">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 flex flex-col sm:flex-row justify-between gap-4 text-sm text-muted">
            <div className="flex items-center gap-5">
              <a
                href="https://github.com/Zakran27"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 py-2 hover:text-paper"
              >
                <FaGithub aria-hidden="true" /> GitHub
              </a>
              <a
                href="https://x.com/zakran27"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 py-2 hover:text-paper"
              >
                <FaXTwitter aria-hidden="true" /> X
              </a>
            </div>
            <p className="font-mono py-2">© 2026 Thomas Fradin de Bellabre</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
