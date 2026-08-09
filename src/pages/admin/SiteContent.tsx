import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Banner, Card, PageTitle, btn, field, label } from './ui'

/** Keys the admin can edit, in display order. */
const FIELDS: { key: string; title: string; hint?: string }[] = [
  { key: 'contact_phone', title: 'Phone (as displayed)', hint: 'e.g. 0792 437 462' },
  {
    key: 'contact_phone_e164',
    title: 'Phone (international, digits only)',
    hint: 'Used for the call and WhatsApp links. e.g. 250792437462',
  },
  { key: 'contact_whatsapp', title: 'WhatsApp (as displayed)' },
  { key: 'contact_email', title: 'Email' },
  { key: 'contact_address', title: 'Base / address' },
]

export default function SiteContent() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    let cancelled = false
    supabase
      .from('site_content')
      .select('key,value')
      .then(({ data, error: e }) => {
        if (cancelled) return
        if (e) setError(e.message)
        else {
          const next: Record<string, string> = {}
          for (const row of data ?? []) {
            next[row.key as string] = typeof row.value === 'string' ? row.value : ''
          }
          setValues(next)
        }
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const save = async () => {
    setSaving(true)
    setError(null)
    const rows = FIELDS.map((f) => ({ key: f.key, value: values[f.key] ?? '' }))
    const { error: e } = await supabase.from('site_content').upsert(rows, { onConflict: 'key' })
    setSaving(false)
    if (e) setError(e.message)
    else setSaved(true)
  }

  if (loading) return <p className="text-ink/65">Loading…</p>

  return (
    <div>
      <PageTitle>Site details</PageTitle>

      <div className="space-y-4">
        {error && <Banner kind="error">{error}</Banner>}
        {saved && !error && <Banner kind="success">Saved. The site updates on next load.</Banner>}

        <Card>
          <p className="mb-5 text-sm text-ink/65">
            These appear in the contact section and the footer, in every language. Marketing copy
            and headings live in the translation files, since each needs a version per language.
          </p>

          <div className="space-y-4">
            {FIELDS.map((f) => (
              <div key={f.key}>
                <label htmlFor={f.key} className={label}>
                  {f.title}
                </label>
                {f.hint && <p className="mb-1.5 text-sm text-ink/60">{f.hint}</p>}
                <input
                  id={f.key}
                  className={field}
                  value={values[f.key] ?? ''}
                  onChange={(e) => {
                    setValues((v) => ({ ...v, [f.key]: e.target.value }))
                    setSaved(false)
                  }}
                />
              </div>
            ))}
          </div>
        </Card>

        <button type="button" className={btn} disabled={saving} onClick={() => void save()}>
          {saving ? 'Saving…' : 'Save details'}
        </button>
      </div>
    </div>
  )
}
