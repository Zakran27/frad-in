'use client'
export const dynamic = "force-dynamic";

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

const SECRET_KEY = 'talaref_add_secret'

export default function AddTalarefPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    title: '',
    context: '',
    media_type: 'text',
    link: '',
    thumbnail: ''
  })
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [secret, setSecret] = useState('')

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? sessionStorage.getItem(SECRET_KEY) : null
    if (stored) setSecret(stored)
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleFile = (e) => {
    setFile(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (!secret) {
      toast.error('Secret required')
      setLoading(false)
      return
    }

    if (!form.title || !form.context || !form.media_type || (!form.link && !file)) {
      toast.error('All fields are required!')
      setLoading(false)
      return
    }

    let link = form.link.trim()

    if (
      form.media_type === 'video' &&
      (link.includes('youtube.com') || link.includes('youtu.be'))
    ) {
      const match = link.match(/(?:v=|\/|be\/)([0-9A-Za-z_-]{11})/)
      const videoId = match?.[1]
      if (videoId) {
        link = `https://www.youtube.com/embed/${videoId}`
      }
    }

    try {
      if (file) {
        const formData = new FormData()
        formData.append('file', file)
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
          headers: { 'x-add-secret': secret },
        })
        if (!uploadRes.ok) {
          const errPayload = await uploadRes.json().catch(() => ({}))
          throw new Error(errPayload.error || 'Upload failed')
        }
        const uploadJson = await uploadRes.json()
        link = uploadJson.url
      }

      const slug = form.title
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")

      const insertRes = await fetch('/api/talaref', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-add-secret': secret },
        body: JSON.stringify({
          title: form.title.trim(),
          context: form.context.trim(),
          media_type: form.media_type,
          link,
          slug,
          thumbnail: form.thumbnail.trim()
        })
      })

      if (!insertRes.ok) {
        const errPayload = await insertRes.json().catch(() => ({}))
        throw new Error(errPayload.error || 'Insert failed')
      }

      sessionStorage.setItem(SECRET_KEY, secret)
      toast.success('Ref added ✅')
      router.push('/talaref')
    } catch (err) {
      toast.error(`Error: ${err.message}`)
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-12 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-500 mb-6">➕ Add a ref</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          name="secret"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          required
          placeholder="Secret"
          autoComplete="current-password"
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
        />

        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          placeholder="Title"
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
        />

        <input
          type="text"
          name="thumbnail"
          value={form.thumbnail}
          onChange={handleChange}
          required
          placeholder="Thumbnail (emoji or image URL)"
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
        />

        <textarea
          name="context"
          value={form.context}
          onChange={handleChange}
          required
          placeholder="What's the joke, meme or context?"
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
          rows={3}
        />

        <select
          name="media_type"
          value={form.media_type}
          onChange={handleChange}
          required
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
        >
          <option value="text">Text</option>
          <option value="image">Image (upload or URL)</option>
          <option value="video">Video (YouTube or upload)</option>
          <option value="embed">Embed (Tweet, etc.)</option>
        </select>

        <input
          type="text"
          name="link"
          value={form.link}
          onChange={handleChange}
          placeholder="Media URL (leave empty if uploading a file)"
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
        />

        <input
          type="file"
          accept="image/*,video/*"
          onChange={handleFile}
          className="block w-full text-sm text-gray-300
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-md file:border-0
                     file:text-sm file:font-semibold
                     file:bg-blue-600 file:text-white
                     hover:file:bg-blue-700"
        />

        <div className="pt-6">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white font-semibold w-full"
          >
            {loading ? 'Submitting...' : 'Add Ref'}
          </button>
        </div>
      </form>
    </main>
  )
}
