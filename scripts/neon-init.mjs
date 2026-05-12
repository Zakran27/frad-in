// One-off migration script: restore Supabase public schema into Neon.
// Reads tab-separated COPY data from scripts/_supabase_dump.sql and inserts
// it row-by-row into Neon via @neondatabase/serverless (HTTP driver).
//
// Usage:
//   1. Ensure DATABASE_URL is set in .env.local (or in your shell env)
//   2. node --env-file=.env.local scripts/neon-init.mjs
//
// Idempotent: uses CREATE TABLE IF NOT EXISTS and ON CONFLICT DO NOTHING.

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { neon } from '@neondatabase/serverless'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DUMP_PATH = resolve(__dirname, '_supabase_dump.sql')

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL not set. Run with: node --env-file=.env.local scripts/neon-init.mjs')
  process.exit(1)
}

const sql = neon(process.env.DATABASE_URL)

const SCHEMA_STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS public.b2b_punchlines (
     id uuid DEFAULT gen_random_uuid() NOT NULL,
     text text NOT NULL,
     artist text,
     title text,
     source text,
     created_at timestamp with time zone DEFAULT now(),
     CONSTRAINT b2b_punchlines_pkey PRIMARY KEY (id)
   )`,
  `CREATE TABLE IF NOT EXISTS public.flops (
     id uuid DEFAULT gen_random_uuid() NOT NULL,
     title text,
     media_type text,
     link text,
     created_at timestamp with time zone DEFAULT now() NOT NULL,
     CONSTRAINT flops_pkey PRIMARY KEY (id)
   )`,
  `CREATE TABLE IF NOT EXISTS public.talaref_entries (
     id uuid DEFAULT gen_random_uuid() NOT NULL,
     title text,
     slug text,
     thumbnail text,
     media_type text NOT NULL,
     link text,
     context text,
     created_at timestamp without time zone DEFAULT now(),
     CONSTRAINT talaref_entries_pkey PRIMARY KEY (id)
   )`,
  `CREATE OR REPLACE FUNCTION public.get_random_punchline()
     RETURNS TABLE(text text, artist text, title text, source text)
     LANGUAGE sql AS $$
       SELECT text, artist, title, source
       FROM public.b2b_punchlines
       ORDER BY random()
       LIMIT 1
     $$`,
]

const TABLES = ['b2b_punchlines', 'flops', 'talaref_entries']

function parseCopyBlock(dump, tableName) {
  const marker = `COPY public.${tableName} (`
  const start = dump.indexOf(marker)
  if (start === -1) throw new Error(`COPY block not found for ${tableName}`)
  const headerEnd = dump.indexOf('\n', start)
  const header = dump.slice(start, headerEnd)
  const cols = header.match(/\(([^)]+)\)/)[1].split(',').map((s) => s.trim())
  const body = dump.slice(headerEnd + 1)
  const terminator = body.search(/^\\\.$/m)
  if (terminator === -1) throw new Error(`COPY terminator \\. not found for ${tableName}`)
  const data = body.slice(0, terminator)
  const rows = data
    .split('\n')
    .filter((line) => line.length > 0)
    .map((line) =>
      line.split('\t').map((field) => {
        if (field === '\\N') return null
        // pg_dump escapes \t \n \r \\ — unescape them
        return field
          .replace(/\\t/g, '\t')
          .replace(/\\n/g, '\n')
          .replace(/\\r/g, '\r')
          .replace(/\\\\/g, '\\')
      })
    )
  return { cols, rows }
}

async function main() {
  console.log('Reading dump from', DUMP_PATH)
  const dump = readFileSync(DUMP_PATH, 'utf8')

  console.log('\n--- Creating schema ---')
  for (const stmt of SCHEMA_STATEMENTS) {
    await sql.query(stmt)
    console.log('  ✓', stmt.split('\n')[0].slice(0, 70))
  }

  console.log('\n--- Inserting data ---')
  for (const table of TABLES) {
    const { cols, rows } = parseCopyBlock(dump, table)
    const colList = cols.join(', ')
    const placeholders = cols.map((_, i) => `$${i + 1}`).join(', ')
    const insertSQL = `INSERT INTO public.${table} (${colList}) VALUES (${placeholders}) ON CONFLICT (id) DO NOTHING`
    let inserted = 0
    for (const row of rows) {
      const result = await sql.query(insertSQL, row)
      inserted += result.length === undefined ? 1 : 0 // neon http driver returns rows array
    }
    const { count } = (await sql.query(`SELECT count(*)::int as count FROM public.${table}`))[0]
    console.log(`  ✓ ${table}: ${rows.length} attempted, ${count} now in table`)
  }

  console.log('\n--- Verifying function ---')
  const sample = await sql.query('SELECT * FROM public.get_random_punchline()')
  console.log('  ✓ get_random_punchline() returned:', sample[0])

  console.log('\n✅ Done.')
}

main().catch((err) => {
  console.error('❌ Migration failed:', err)
  process.exit(1)
})
