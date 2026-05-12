import { put } from '@vercel/blob'

export const dynamic = 'force-dynamic'

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    if (!file || typeof file === 'string') {
      return Response.json({ error: 'No file provided' }, { status: 400 })
    }

    const filename = `talaref-sources/${Date.now()}-${file.name}`
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
