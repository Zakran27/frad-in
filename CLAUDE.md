# frad-in (bellab.re): project guide

Thomas's personal playground, live at https://bellab.re. Jokes, side projects and experiments, mostly in French.

**Not on Google, on purpose**: `robots: { index: false }` in `src/app/layout.js` plus `X-Robots-Tag: noindex` in `next.config.mjs`. No SEO work (no sitemap, no per-page SEO metadata).

## Stack
Next.js 16 (App Router, JavaScript, no TypeScript) · React 19 · Tailwind CSS v4 (tokens in `src/app/globals.css`) · Neon Postgres via `@neondatabase/serverless` (tagged template `sql` in `src/lib/neonClient.js`) · Vercel Blob for uploads · Vercel (deploy on push to `master`). No LLM API: the fake punchlines were written once and live in the DB. The GitHub repo is public.

Env vars (names only): `DATABASE_URL` (production: role `web_app`, least privilege), `DATABASE_URL_UNPOOLED` (owner, for scripts), `ADD_SECRET`, `BLOB_READ_WRITE_TOKEN`.

## Map
- `/`: random title picked on the server (`src/lib/titles.js`), re-roll button (`HomeTitle.js`), Damien easter egg (`DamienToggle.js`), project cards.
- `/talaref`, `/talaref/[slug]`, `/talaref/add`: French YouTube meme encyclopedia. The add page sends `x-add-secret`.
- `/b2b`: "Bendo na Bendo", real vs AI rap punchline.
- `/flops`, `/sanity-checker`.
- API: `POST /api/talaref` and `POST /api/upload` (both check `x-add-secret` via `src/lib/addSecret.js`), `GET /api/b2b-random` (public).

## Database (Neon project `frad-in`, id `late-thunder-57069239`, eu-central-1)
- Branches: `main` (production, managed by the Vercel integration) and `vercel-dev` (Development env). Schema changes go to both.
- Tables: `talaref_entries`, `b2b_punchlines` (real bars), `flops`, `b2b_fakes` (1000+ AI-written fake bars, static); function `get_random_punchline()`.
- Role `web_app` (production app): SELECT on the 4 tables, INSERT on `talaref_entries` only, EXECUTE on the function. A new table or write needs a GRANT, otherwise production breaks. Add fakes with the owner role (Neon MCP).
- Use the Neon MCP for schema and queries. Test a migration on `vercel-dev` first; destructive SQL only after Thomas says go.

## Working rules
- Talk to Thomas in French. Commit messages in English, conventional (`feat:`, `fix:`, `refactor:`, `chore:`). Push directly to `master`, no branches, no PRs.
- Server Components by default; `"use client"` only for the interactive part, in its own file (pattern: `TalarefBrowser.js`, `HomeTitle.js`).
- SQL only through the `sql` tagged template (parameterised). Never build SQL strings.
- Media links (talaref, flops) go through `src/lib/media.js`: https and allowlisted hosts only, checked on insert and on render. Third-party iframes are sandboxed. `node src/lib/media.check.mjs` after touching it.
- `/api/b2b-random` is public and only reads the DB: 50/50 between `b2b_punchlines` and `b2b_fakes`. A fake must never be an exact copy of a real bar.
- `next/image` only loads Vercel Blob (`remotePatterns`). `public/` is served as is: only files meant to be public go there.

## Design principles (impeccable "Experience" mode, hallmark, jakubkrehel/skills)
Dark warm "lab notebook": personality over convention, not the default Next.js + Tailwind look.
- Tokens only (`@theme` in `globals.css`): `ink` / `ink-2` / `ink-3` backgrounds, `line`, `paper` text, `muted`, one accent `signal` (orange), one highlight `acid` (lime). No raw Tailwind greys or blues.
- Fonts: Bricolage Grotesque (`font-display`) for titles, Instrument Sans (`font-sans`) for text, JetBrains Mono (`font-mono`) for small meta. Three families, no more.
- Cards differ by size and colour (bento on the home page), never a grid of identical grey boxes. Emoji are content, not UI icons.
- Motion: transform / opacity, `active:scale-95` presses, `motion-safe:` on anything decorative, `prefers-reduced-motion` respected globally.
- Accessibility: `:focus-visible` ring (acid), `aria-expanded` on toggles, labels on every input (visible or `sr-only`), tap targets `min-h-11`, contrast at least 4.5:1, long strings wrap (`[overflow-wrap:anywhere]`).

## Checks before pushing
```bash
npm run lint
npm run build
node src/lib/media.check.mjs
npm audit --omit=dev
```
Then open the changed pages at 390px and 1440px and check the console. If the build says a module is missing after an upgrade, delete `.next` (stale cache).
