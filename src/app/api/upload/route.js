import { put } from '@vercel/blob'

export const dynamic = 'force-dynamic'

const MAX_BYTES = 25 * 1024 * 1024 // 25 MB
const ALLOWED_PREFIXES = ['image/', 'video/', 'audio/']

export async function POST(request) {
  if (request.headers.get('x-add-secret') !== process.env.ADD_SECRET) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file')
    if (!file || typeof file === 'string') {
      return Response.json({ error: 'No file provided' }, { status: 400 })
    }
    if (file.size > MAX_BYTES) {
      return Response.json({ error: `File too large (max ${MAX_BYTES / 1024 / 1024} MB)` }, { status: 413 })
    }
    if (!ALLOWED_PREFIXES.some((p) => (file.type || '').startsWith(p))) {
      return Response.json({ error: 'Unsupported file type' }, { status: 415 })
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const filename = `talaref-sources/${Date.now()}-${safeName}`
    const blob = await put(filename, file, {
      access: 'public',
      addRandomSuffix: false,
    })

    return Response.json({ url: blob.url })
  } catch (err) {
    console.error('POST /api/upload failed:', err)
    return Response.json({ error: err.message || 'Upload failed' }, { status: 500 })
  }
}
