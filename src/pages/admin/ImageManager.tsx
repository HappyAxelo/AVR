import { useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { GalleryImage } from '../../lib/supabase'
import { btnGhost, btnDanger, field, label } from './ui'

const MAX_BYTES = 5 * 1024 * 1024 // matches the bucket limit

interface UploadResult {
  url: string
  error: string | null
}

/** Uploads one file to a bucket and returns its public URL. */
async function uploadTo(bucket: string, file: File): Promise<UploadResult> {
  if (file.size > MAX_BYTES) {
    return { url: '', error: `${file.name} is larger than 5 MB. Please compress it first.` }
  }
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  const path = `${crypto.randomUUID()}.${ext}`

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '31536000',
    upsert: false,
  })
  if (error) return { url: '', error: error.message }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return { url: data.publicUrl, error: null }
}

/* ---------------- cover image ---------------- */

export function CoverImageField({
  bucket,
  value,
  onChange,
}: {
  bucket: string
  value: string | null
  onChange: (url: string | null) => void
}) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const pick = async (file: File) => {
    setBusy(true)
    setError(null)
    const { url, error: uploadError } = await uploadTo(bucket, file)
    setBusy(false)
    if (uploadError) {
      setError(uploadError)
      return
    }
    onChange(url)
  }

  return (
    <div>
      <span className={label}>Cover image</span>
      {value ? (
        <div className="flex flex-wrap items-start gap-4">
          <img src={value} alt="" className="h-28 w-44 rounded-lg border border-terrace/15 object-cover" />
          <div className="flex gap-2">
            <button type="button" className={btnGhost} onClick={() => inputRef.current?.click()}>
              Replace
            </button>
            <button type="button" className={btnDanger} onClick={() => onChange(null)}>
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className={btnGhost}
          disabled={busy}
          onClick={() => inputRef.current?.click()}
        >
          {busy ? 'Uploading…' : 'Upload cover image'}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          e.target.value = ''
          if (file) void pick(file)
        }}
      />
      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
    </div>
  )
}

/* ---------------- captioned gallery ---------------- */

export function GalleryField({
  bucket,
  value,
  onChange,
}: {
  bucket: string
  value: GalleryImage[]
  onChange: (images: GalleryImage[]) => void
}) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const addFiles = async (files: FileList) => {
    setBusy(true)
    setError(null)
    const added: GalleryImage[] = []
    const failures: string[] = []

    for (const file of Array.from(files)) {
      const { url, error: uploadError } = await uploadTo(bucket, file)
      if (uploadError) failures.push(uploadError)
      else added.push({ url, caption: '' })
    }

    setBusy(false)
    if (failures.length) setError(failures.join(' '))
    if (added.length) onChange([...value, ...added])
  }

  const setCaption = (i: number, caption: string) =>
    onChange(value.map((img, idx) => (idx === i ? { ...img, caption } : img)))

  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i))

  const move = (i: number, delta: number) => {
    const j = i + delta
    if (j < 0 || j >= value.length) return
    const next = [...value]
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className={label}>Photos ({value.length})</span>
        <button
          type="button"
          className={btnGhost}
          disabled={busy}
          onClick={() => inputRef.current?.click()}
        >
          {busy ? 'Uploading…' : 'Add photos'}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={(e) => {
          const files = e.target.files
          e.target.value = ''
          if (files?.length) void addFiles(files)
        }}
      />

      {error && <p className="mb-3 text-sm text-red-700">{error}</p>}

      {value.length === 0 ? (
        <p className="rounded-lg border border-dashed border-terrace/25 p-6 text-center text-sm text-ink/65">
          No photos yet. Captions appear under each photo on the site.
        </p>
      ) : (
        <ul className="space-y-3">
          {value.map((img, i) => (
            <li
              key={`${img.url}-${i}`}
              className="flex flex-wrap items-start gap-4 rounded-lg border border-terrace/10 bg-paper/50 p-3"
            >
              <img
                src={img.url}
                alt=""
                className="h-20 w-28 shrink-0 rounded-md border border-terrace/15 object-cover"
              />
              <div className="min-w-[12rem] flex-1">
                <label htmlFor={`cap-${i}`} className="mb-1 block text-xs font-medium text-ink/70">
                  Caption
                </label>
                <input
                  id={`cap-${i}`}
                  className={field}
                  value={img.caption}
                  placeholder="Describe what is happening in this photo"
                  onChange={(e) => setCaption(i, e.target.value)}
                />
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  className={btnGhost}
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  aria-label="Move photo earlier"
                >
                  ↑
                </button>
                <button
                  type="button"
                  className={btnGhost}
                  onClick={() => move(i, 1)}
                  disabled={i === value.length - 1}
                  aria-label="Move photo later"
                >
                  ↓
                </button>
                <button
                  type="button"
                  className={btnDanger}
                  onClick={() => remove(i)}
                  aria-label="Remove photo"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
