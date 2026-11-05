'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

const SECRET_KEY = 'talaref_add_secret'
const FIELD =
  'mt-1 w-full min-h-11 rounded-xl bg-ink-2 border border-line px-4 py-2 text-paper placeholder:text-muted focus:border-paper/50'
const LABEL = 'block text-sm font-medium'

export default function AddTalarefPage() {
  const router = useRouter()
  const secretRef = useRef(null)
  const [form, setForm] = useState({ title: '', context: '', media_type: 'text', link: '', thumbnail: '' })
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)

  // Secret mémorisé pour la session : écrit dans le champ (non contrôlé), pas dans l'état React
  useEffect(() => {
    const stored = sessionStorage.getItem(SECRET_KEY)
    if (stored && secretRef.current) secretRef.current.value = stored
  }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const secret = secretRef.current?.value.trim()
    if (!secret) return toast.error('Secret required')
    if (!form.title || !form.context || !form.media_type || (!form.link && !file)) {
      return toast.error('All fields are required!')
    }
    setLoading(true)

    let link = form.link.trim()
    if (form.media_type === 'video' && (link.includes('youtube.com') || link.includes('youtu.be'))) {
      const videoId = link.match(/(?:v=|\/|be\/)([0-9A-Za-z_-]{11})/)?.[1]
      if (videoId) link = `https://www.youtube.com/embed/${videoId}`
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
        const uploadJson = await uploadRes.json().catch(() => ({}))
        if (!uploadRes.ok) throw new Error(uploadJson.error || 'Upload failed')
        link = uploadJson.url
      }

      const slug = form.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

      const insertRes = await fetch('/api/talaref', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-add-secret': secret },
        body: JSON.stringify({
          title: form.title.trim(),
          context: form.context.trim(),
          media_type: form.media_type,
          link,
          slug,
          thumbnail: form.thumbnail.trim(),
        }),
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
    <section className="max-w-2xl">
      <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight mb-8">Add a ref</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <label className={LABEL}>
          Secret
          <input ref={secretRef} type="password" name="secret" required autoComplete="current-password" className={FIELD} />
        </label>

        <label className={LABEL}>
          Title
          <input type="text" name="title" value={form.title} onChange={handleChange} required className={FIELD} />
        </label>

        <label className={LABEL}>
          Thumbnail <span className="text-muted font-normal">(emoji, or an uploaded image URL)</span>
          <input type="text" name="thumbnail" value={form.thumbnail} onChange={handleChange} required className={FIELD} />
        </label>

        <label className={LABEL}>
          Context <span className="text-muted font-normal">(what&apos;s the joke, meme or context?)</span>
          <textarea name="context" value={form.context} onChange={handleChange} required rows={3} className={FIELD} />
        </label>

        <label className={LABEL}>
          Type
          <select name="media_type" value={form.media_type} onChange={handleChange} required className={FIELD}>
            <option value="text">Text</option>
            <option value="image">Image (upload)</option>
            <option value="video">Video (YouTube or upload)</option>
            <option value="embed">Embed (tweet, TikTok, Spotify…)</option>
          </select>
        </label>

        <label className={LABEL}>
          Media URL <span className="text-muted font-normal">(leave empty if uploading a file)</span>
          <input type="text" name="link" value={form.link} onChange={handleChange} className={FIELD} />
        </label>

        <label className={LABEL}>
          File
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif,video/*,audio/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="mt-1 block w-full text-sm text-muted file:mr-4 file:min-h-11 file:px-4 file:rounded-full file:border-0 file:bg-paper file:text-ink file:font-semibold hover:file:bg-acid"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full min-h-12 rounded-full bg-signal text-ink font-bold hover:brightness-110 active:scale-[0.98] transition disabled:opacity-60"
        >
          {loading ? 'Submitting…' : 'Add ref'}
        </button>
      </form>
    </section>
  )
}
