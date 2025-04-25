import './globals.css'
import Link from 'next/link'
import { FaGithub, FaTwitter } from 'react-icons/fa'
import { Toaster } from 'react-hot-toast'

export const metadata = {
  title: 'bellab.re',
  description: 'weird side projects & memes',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        {/* HEADER */}
        <header className="sticky top-0 z-50 bg-black px-6 py-4 md:px-10 lg:px-20 border-b border-gray-800">
          <Link href="/" className="text-blue-500 text-lg font-bold hover:underline flex items-center gap-2">
            <span role="img" aria-label="planet">🪐</span> bellab.re
          </Link>
        </header>

        {/* TOASTER */}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1f2937',
              color: '#fff',
              border: '1px solid #4b5563'
            },
            success: {
              icon: '✅'
            },
            error: {
              icon: '❌'
            }
          }}
        />

        {/* MAIN CONTENT */}
        <main className="px-6 py-8 md:px-10 lg:px-24 xl:px-40 max-w-screen-2xl mx-auto">
          {children}
        </main>

        {/* FOOTER */}
        <footer className="mt-16 border-t border-gray-800 pt-6 pb-10 text-sm text-gray-400 px-6 md:px-10 lg:px-20">
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
                <FaTwitter /> Twitter
              </a>
            </div>
            <p>© 2025 — Thomas Fradin de Bellabre. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
