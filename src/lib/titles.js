// Titres aléatoires de l'accueil (tirés côté serveur, relançables côté client)
export const TITLES = [
  { text: '🩰 Ballerrrinaaa ☕ Cappuccciiiinnnaa' },
  { text: 'Aaarhghaaggga..... 💀' },
  { text: '😲 (**visage choqué**)' },
  { text: 'Click here to know what time it is 🕒', href: 'http://quelleheureestilenjoy.com/' },
  { text: 'hmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm' },
]

export const randomTitleIndex = (exclude = -1) => {
  const pool = TITLES.map((_, i) => i).filter((i) => i !== exclude)
  return pool[Math.floor(Math.random() * pool.length)]
}
