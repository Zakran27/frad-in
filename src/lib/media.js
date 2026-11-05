// Médias talaref / flops : seuls ces hôtes sont acceptés, à l'ajout (/api/talaref) comme à l'affichage.
const EMBED_HOSTS = new Set([
  'www.youtube.com',
  'youtube.com',
  'www.youtube-nocookie.com',
  'player.vimeo.com',
  'www.dailymotion.com',
  'www.tiktok.com',
  'open.spotify.com',
  'w.soundcloud.com',
  'twitter.com',
  'x.com',
])
const isBlobHost = (host) => host.endsWith('.public.blob.vercel-storage.com')

// URL https d'un hôte autorisé (Vercel Blob = nos uploads), normalisée, sinon null
export function safeMediaUrl(link, { blobOnly = false } = {}) {
  try {
    const u = new URL(link)
    if (u.protocol !== 'https:') return null
    if (isBlobHost(u.hostname) || (!blobOnly && EMBED_HOSTS.has(u.hostname))) return u.href
  } catch {}
  return null
}

export const isBlobUrl = (link) => !!safeMediaUrl(link, { blobOnly: true })

// Id d'un tweet (twitter.com ou x.com), sinon null
export function tweetId(link) {
  return /^https:\/\/(www\.)?(twitter|x)\.com\/[^/]+\/status\/(\d+)/.exec(link || '')?.[3] ?? null
}
