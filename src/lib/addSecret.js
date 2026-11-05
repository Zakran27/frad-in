import { createHash, timingSafeEqual } from 'node:crypto'

// En-tête x-add-secret === ADD_SECRET, comparé en temps constant. Fermé si ADD_SECRET manque.
export function hasAddSecret(request) {
  const expected = process.env.ADD_SECRET
  const given = request.headers.get('x-add-secret')
  if (!expected || !given) return false
  const digest = (s) => createHash('sha256').update(s).digest()
  return timingSafeEqual(digest(given), digest(expected))
}
