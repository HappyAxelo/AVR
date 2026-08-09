import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Banner, Card, Empty, PageTitle, btnGhost, btnDanger, downloadCsv } from './ui'

interface Enquiry {
  id: string
  name: string
  phone: string
  email: string | null
  location: string | null
  crop: string | null
  hectares: number | null
  message: string | null
  read: boolean
  created_at: string
}

export default function Enquiries() {
  const [rows, setRows] = useState<Enquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showRead, setShowRead] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const { data, error: e } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false })
    if (e) setError(e.message)
    else setRows((data ?? []) as Enquiry[])
    setLoading(false)
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const toggleRead = async (row: Enquiry) => {
    const { error: e } = await supabase
      .from('contact_submissions')
      .update({ read: !row.read })
      .eq('id', row.id)
    if (e) setError(e.message)
    else setRows((rs) => rs.map((r) => (r.id === row.id ? { ...r, read: !r.read } : r)))
  }

  const remove = async (row: Enquiry) => {
    if (!confirm(`Delete the enquiry from ${row.name}?`)) return
    const { error: e } = await supabase.from('contact_submissions').delete().eq('id', row.id)
    if (e) setError(e.message)
    else setRows((rs) => rs.filter((r) => r.id !== row.id))
  }

  const visible = showRead ? rows : rows.filter((r) => !r.read)
  const unread = rows.filter((r) => !r.read).length

  return (
    <div>
      <PageTitle
        action={
          <div className="flex flex-wrap gap-2">
            <button type="button" className={btnGhost} onClick={() => setShowRead((v) => !v)}>
              {showRead ? 'Show unread only' : 'Show all'}
            </button>
            <button
              type="button"
              className={btnGhost}
              disabled={rows.length === 0}
              onClick={() =>
                downloadCsv(
                  `avr-enquiries-${new Date().toISOString().slice(0, 10)}.csv`,
                  rows.map((r) => ({
                    date: new Date(r.created_at).toISOString(),
                    name: r.name,
                    phone: r.phone,
                    email: r.email ?? '',
                    location: r.location ?? '',
                    crop: r.crop ?? '',
                    hectares: r.hectares ?? '',
                    message: r.message ?? '',
                    read: r.read,
                  })),
                )
              }
            >
              Export CSV
            </button>
          </div>
        }
      >
        Enquiries {unread > 0 && <span className="text-base font-normal text-ink/60">({unread} unread)</span>}
      </PageTitle>

      {error && (
        <div className="mb-4">
          <Banner kind="error">{error}</Banner>
        </div>
      )}

      {loading ? (
        <p className="text-ink/65">Loading…</p>
      ) : visible.length === 0 ? (
        <Empty>{rows.length === 0 ? 'No enquiries yet.' : 'Nothing unread.'}</Empty>
      ) : (
        <div className="space-y-3">
          {visible.map((row) => (
            <Card key={row.id} className={row.read ? 'opacity-70' : ''}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold text-terrace">{row.name}</h2>
                    {!row.read && (
                      <span className="rounded-full bg-terrace px-2 py-0.5 text-xs font-semibold text-volt">
                        new
                      </span>
                    )}
                    <span className="text-xs text-ink/60">
                      {new Date(row.created_at).toLocaleString('en-GB')}
                    </span>
                  </div>

                  <dl className="mt-3 grid gap-x-8 gap-y-1 text-sm sm:grid-cols-2">
                    <div className="flex gap-2">
                      <dt className="text-ink/60">Phone:</dt>
                      <dd>
                        <a href={`tel:${row.phone}`} className="text-terrace underline">
                          {row.phone}
                        </a>
                      </dd>
                    </div>
                    {row.email && (
                      <div className="flex gap-2">
                        <dt className="text-ink/60">Email:</dt>
                        <dd>
                          <a href={`mailto:${row.email}`} className="text-terrace underline">
                            {row.email}
                          </a>
                        </dd>
                      </div>
                    )}
                    {row.location && (
                      <div className="flex gap-2">
                        <dt className="text-ink/60">Location:</dt>
                        <dd>{row.location}</dd>
                      </div>
                    )}
                    {row.crop && (
                      <div className="flex gap-2">
                        <dt className="text-ink/60">Crop:</dt>
                        <dd>{row.crop}</dd>
                      </div>
                    )}
                    {row.hectares !== null && (
                      <div className="flex gap-2">
                        <dt className="text-ink/60">Hectares:</dt>
                        <dd>{row.hectares}</dd>
                      </div>
                    )}
                  </dl>

                  {row.message && (
                    <p className="mt-3 whitespace-pre-line rounded-lg bg-paper/70 p-3 text-sm text-ink/80">
                      {row.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <a href={`https://wa.me/${row.phone.replace(/\D/g, '').replace(/^0/, '250')}`}
                     target="_blank" rel="noopener noreferrer" className={btnGhost}>
                    WhatsApp
                  </a>
                  <button type="button" className={btnGhost} onClick={() => void toggleRead(row)}>
                    {row.read ? 'Mark unread' : 'Mark read'}
                  </button>
                  <button type="button" className={btnDanger} onClick={() => void remove(row)}>
                    Delete
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
