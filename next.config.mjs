/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Seulement nos uploads (Vercel Blob) : l'optimiseur d'images ne sert pas de proxy à tout Internet
    remotePatterns: [{ protocol: 'https', hostname: '*.public.blob.vercel-storage.com' }],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Site perso : hors des moteurs de recherche
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'DENY' },
        ],
      },
    ]
  },
}

export default nextConfig
