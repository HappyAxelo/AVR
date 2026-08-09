import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Banner, Card, Empty, PageTitle, btnGhost, btnDanger, downloadCsv } from './ui'

interface Subscriber {
  id: string
  email: string
  status: 'subscribed' | 'unsubscribed'
  confirmed: boolean
  created_at: string
}

export default function Subscribers() {
  const [rows, setRows] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const { data, error: e } = await supabase
      .from('subscribers')
      .select('id,email,status,confirmed,created_at')
      .order('created_at', { ascending: false })
    if (e) setError(e.message)
    else setRows((data ?? []) as Subscriber[])
    setLoading(false)
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const remove = async (row: Subscriber) => {
    if (!confirm(`Remove ${row.email} from the list?`)) return
    const { error: e } = await supabase.from('subscribers').delete().eq('id', row.id)
    if (e) setError(e.message)
    else setRows((rs) => rs.filter((r) => r.id !== row.id))
  }

  const sendable = rows.filter((r) => r.status === 'subscribed' && r.confirmed).length
  const pending = rows.filter((r) => r.status === 'subscribed' && !r.confirmed).length

  return (
    <div>
      <PageTitle
        action={
          <button
            type="button"
            className={btnGhost}
            disabled={rows.length === 0}
            onClick={() =>
              downloadCsv(
                `avr-subscribers-${new Date().toISOString().slice(0, 10)}.csv`,
                rows.map((r) => ({
                  email: r.email,
                  status: r.status,
                  confirmed: r.confirmed,
                  joined: new Date(r.created_at).toISOString(),
                })),
              )
            }
          >
            Export CSV
          </button>
        }
      >
        Subscribers
      </PageTitle>

      {error && (
        <div className="mb-4">
          <Banner kind="error">{error}</Banner>
        </div>
      )}

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <Card>
          <p className="text-3xl font-semibold text-terrace">{sendable}</p>
          <p className="mt-1 text-sm text-ink/65">confirmed, will receive newsletters</p>
        </Card>
        <Card>
          <p className="text-3xl font-semibold text-terrace">{pending}</p>
          <p className="mt-1 text-sm text-ink/65">awaiting email confirmation</p>
        </Card>
        <Card>
          <p className="text-3xl font-semibold text-terrace">
            {rows.filter((r) => r.status === 'unsubscribed').length}
          </p>
          <p className="mt-1 text-sm text-ink/65">unsubscribed</p>
        </Card>
      </div>

      {loading ? (
        <p className="text-ink/65">Loading…</p>
      ) : rows.length === 0 ? (
        <Empty>No subscribers yet.</Empty>
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-[34rem] text-sm">
            <thead>
              <tr className="border-b border-terrace/10 text-left text-ink/65">
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Joined</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-terrace/5 last:border-0">
                  <td className="px-5 py-3">{row.email}</td>
                  <td className="px-5 py-3">
                    {row.status === 'unsubscribed' ? (
                      <span className="text-ink/60">unsubscribed</span>
                    ) : row.confirmed ? (
                      <span className="font-medium text-terrace">confirmed</span>
                    ) : (
                      <span className="text-ink/60">pending</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-ink/65">
                    {new Date(row.created_at).toLocaleDateString('en-GB')}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button type="button" className={btnDanger} onClick={() => void remove(row)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  )
}
