import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Banner, Card, Empty, PageTitle, btn, btnGhost, field, label } from './ui'

interface Campaign {
  id: string
  subject: string
  recipient_count: number
  status: string
  sent_at: string | null
  created_at: string
}

interface SendResponse {
  ok?: boolean
  error?: string
  message?: string
  delivered?: number
  total?: number
  sentTo?: string
  remainingToday?: number
}

export default function Newsletter() {
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState<{ kind: 'error' | 'success'; text: string } | null>(null)
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [confirmedCount, setConfirmedCount] = useState<number | null>(null)

  const load = useCallback(async () => {
    const [history, subs] = await Promise.all([
      supabase
        .from('newsletter_campaigns')
        .select('id,subject,recipient_count,status,sent_at,created_at')
        .order('created_at', { ascending: false })
        .limit(20),
      supabase
        .from('subscribers')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'subscribed')
        .eq('confirmed', true),
    ])
    setCampaigns((history.data ?? []) as Campaign[])
    setConfirmedCount(subs.count ?? 0)
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const send = async (test: boolean) => {
    setBusy(true)
    setResult(null)

    const { data: sessionData } = await supabase.auth.getSession()
    const token = sessionData.session?.access_token
    if (!token) {
      setBusy(false)
      setResult({ kind: 'error', text: 'Your session expired. Please sign in again.' })
      return
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-newsletter`,
        {
          method: 'POST',
          headers: {
            apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ subject, body, test }),
        },
      )
      const data = (await res.json()) as SendResponse
      setBusy(false)

      if (!res.ok) {
        setResult({ kind: 'error', text: data.message ?? data.error ?? 'The send failed.' })
        return
      }
      if (test) {
        setResult({ kind: 'success', text: `Test sent to ${data.sentTo}. Check that it looks right before sending to everyone.` })
        return
      }
      setResult({
        kind: 'success',
        text:
          `Sent to ${data.delivered} of ${data.total} subscribers.` +
          (data.remainingToday !== undefined
            ? ` ${data.remainingToday} emails left in today's free allowance.`
            : ''),
      })
      setSubject('')
      setBody('')
      void load()
    } catch {
      setBusy(false)
      setResult({ kind: 'error', text: 'Could not reach the send service.' })
    }
  }

  return (
    <div>
      <PageTitle>Newsletter</PageTitle>

      <div className="space-y-4">
        {result && <Banner kind={result.kind}>{result.text}</Banner>}

        <Card>
          <p className="mb-5 text-sm text-ink/65">
            {confirmedCount === null
              ? 'Checking the list…'
              : confirmedCount === 0
                ? 'No confirmed subscribers yet. You can still send yourself a test.'
                : `${confirmedCount} confirmed ${confirmedCount === 1 ? 'subscriber' : 'subscribers'} will receive this. ` +
                  'The free plan allows 100 emails a day and 3,000 a month.'}
          </p>

          <div className="space-y-4">
            <div>
              <label htmlFor="nl-subject" className={label}>
                Subject
              </label>
              <input
                id="nl-subject"
                className={field}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="nl-body" className={label}>
                Message
              </label>
              <p className="mb-2 text-sm text-ink/60">
                Leave a blank line between paragraphs. An unsubscribe link is added automatically.
              </p>
              <textarea
                id="nl-body"
                rows={14}
                className={`${field} leading-relaxed`}
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
            </div>
          </div>
        </Card>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className={btnGhost}
            disabled={busy || !subject.trim() || !body.trim()}
            onClick={() => void send(true)}
          >
            {busy ? 'Working…' : 'Send test to myself'}
          </button>
          <button
            type="button"
            className={btn}
            disabled={busy || !subject.trim() || !body.trim() || !confirmedCount}
            onClick={() => {
              if (confirm(`Send "${subject}" to ${confirmedCount} subscribers? This cannot be undone.`)) {
                void send(false)
              }
            }}
          >
            Send to all subscribers
          </button>
        </div>

        <div>
          <h2 className="mb-3 mt-8 text-lg font-semibold text-terrace">Past campaigns</h2>
          {campaigns.length === 0 ? (
            <Empty>Nothing sent yet.</Empty>
          ) : (
            <Card className="overflow-x-auto p-0">
              <table className="w-full min-w-[32rem] text-sm">
                <thead>
                  <tr className="border-b border-terrace/10 text-left text-ink/65">
                    <th className="px-5 py-3 font-medium">Subject</th>
                    <th className="px-5 py-3 font-medium">Recipients</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Sent</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((c) => (
                    <tr key={c.id} className="border-b border-terrace/5 last:border-0">
                      <td className="px-5 py-3">{c.subject}</td>
                      <td className="px-5 py-3">{c.recipient_count}</td>
                      <td className="px-5 py-3">{c.status}</td>
                      <td className="px-5 py-3 text-ink/65">
                        {c.sent_at ? new Date(c.sent_at).toLocaleString('en-GB') : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
