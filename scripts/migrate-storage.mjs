// One-off script: upload Supabase storage zip contents to Vercel Blob,
// then UPDATE Neon rows to swap dead Supabase URLs for fresh Blob URLs.
//
// Requirements:
//   1. BLOB_READ_WRITE_TOKEN set in .env.local (from Vercel → Storage → Blob → .env.local tab)
//   2. DATABASE_URL set in .env.local (Neon)
//   3. The storage zip downloaded from Supabase, path below
//
// Usage:
//   node --env-file=.env.local scripts/migrate-storage.mjs

import { readFileSync, writeFileSync, mkdtempSync, readdirSync, statSync } from 'node:fs'
import { join, basename, relative } from 'node:path'
import { tmpdir } from 'node:os'
import { execSync } from 'node:child_process'
import { put } from '@vercel/blob'
import { neon } from '@neondatabase/serverless'

const ZIP_PATH = 'C:\\Users\\tfb27\\Downloads\\jqrickrnwcgmkdekhqsu.storage.zip'
const SUPABASE_BASE = 'https://jqrickrnwcgmkdekhqsu.supabase.co/storage/v1/object/public/'

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error('BLOB_READ_WRITE_TOKEN not set. Create a Vercel Blob store and add the token to .env.local.')
  process.exit(1)
}
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL not set.')
  process.exit(1)
}

const sql = neon(process.env.DATABASE_URL)

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) walk(full, files)
    else files.push(full)
  }
  return files
}

async function main() {
  console.log('Extracting zip to temp dir...')
  const tmp = mkdtempSync(join(tmpdir(), 'storage-migrate-'))
  // tar is available on modern Windows
  execSync(`tar -xf "${ZIP_PATH}" -C "${tmp}"`)

  const allFiles = walk(tmp).filter((f) => !f.endsWith('.emptyFolderPlaceholder'))
  console.log(`Found ${allFiles.length} files to upload.`)

  const urlMap = {}

  for (const filePath of allFiles) {
    // path layout: <tmp>/jqrickrnwcgmkdekhqsu/<bucket>/<filename>
    const rel = relative(tmp, filePath).replace(/\\/g, '/')
    const parts = rel.split('/')
    // parts: ['jqrickrnwcgmkdekhqsu', '<bucket>', '<...filename>']
    const bucket = parts[1]
    const filename = parts.slice(2).join('/')
    const data = readFileSync(filePath)

    const blob = await put(`${bucket}/${filename}`, data, {
      access: 'public',
      addRandomSuffix: false,
    })

    // Supabase URL had a double slash between bucket and filename — preserve both forms
    const oldUrl = `${SUPABASE_BASE}${bucket}//${filename}`
    const oldUrlClean = `${SUPABASE_BASE}${bucket}/${filename}`
    urlMap[oldUrl] = blob.url
    urlMap[oldUrlClean] = blob.url
    console.log(`  ✓ ${rel} → ${blob.url}`)
  }

  writeFileSync('scripts/_url-map.json', JSON.stringify(urlMap, null, 2))
  console.log('\n--- Updating Neon URLs ---')

  for (const [oldUrl, newUrl] of Object.entries(urlMap)) {
    const flopsRes = await sql`UPDATE public.flops SET link = ${newUrl} WHERE link = ${oldUrl}`
    const tlinkRes = await sql`UPDATE public.talaref_entries SET link = ${newUrl} WHERE link = ${oldUrl}`
    const tthumbRes = await sql`UPDATE public.talaref_entries SET thumbnail = ${newUrl} WHERE thumbnail = ${oldUrl}`
    const total = (flopsRes.length || 0) + (tlinkRes.length || 0) + (tthumbRes.length || 0)
    if (total > 0) console.log(`  ✓ ${oldUrl} → ${newUrl} (${total} row(s) updated)`)
  }

  console.log('\n--- Verifying no Supabase URLs remain ---')
  const leftoverFlops = await sql`SELECT id, link FROM public.flops WHERE link LIKE '%supabase.co%'`
  const leftoverTalarefLink = await sql`SELECT id, slug, link FROM public.talaref_entries WHERE link LIKE '%supabase.co%'`
  const leftoverTalarefThumb = await sql`SELECT id, slug, thumbnail FROM public.talaref_entries WHERE thumbnail LIKE '%supabase.co%'`

  if (leftoverFlops.length || leftoverTalarefLink.length || leftoverTalarefThumb.length) {
    console.warn('⚠️  Some rows still point to supabase.co:')
    if (leftoverFlops.length) console.warn('  flops:', leftoverFlops)
    if (leftoverTalarefLink.length) console.warn('  talaref_entries.link:', leftoverTalarefLink)
    if (leftoverTalarefThumb.length) console.warn('  talaref_entries.thumbnail:', leftoverTalarefThumb)
  } else {
    console.log('  ✓ All Supabase URLs replaced.')
  }

  console.log('\n✅ Storage migration done.')
}

main().catch((err) => {
  console.error('❌ Migration failed:', err)
  process.exit(1)
})
