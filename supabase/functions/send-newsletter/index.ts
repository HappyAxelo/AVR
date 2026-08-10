// Sends a newsletter to every confirmed subscriber.
//
// Caller must be a signed-in admin on the `admin_users` allowlist — checked
// server-side, never trusted from the request.
//
// Respects the Resend free tier: 100 emails/day and 3,000/month. If the send
// would exceed the daily allowance the function stops and reports it rather
// than sending a partial newsletter and failing halfway.

import {
  cors,
  json,
  db,
  sendBatch,
  sendEmail,
  emailShell,
  escapeHtml,
  siteUrl,
  env,
} from '../_shared/lib.ts'

const DAILY_CAP = 100
const MONTHLY_CAP = 3000
const BATCH_SIZE = 100 // Resend's per-call maximum

interface Subscriber {
  email: string
  unsubscribe_token: string
}

interface Campaign {
  id: string
  recipient_count: number
  sent_at: string | null
  status: string
}

/** Resolves the caller to an email, then checks the admin allowlist. */
async function callerIsAdmin(req: Request): Promise<{ ok: boolean; email?: string }> {
  const auth = req.headers.get('Authorization') ?? ''
  const token = auth.replace(/^Bearer\s+/i, '').trim()
  if (!token) return { ok: false }

  // Ask GoTrue who this token belongs to; a forged token fails here.
  const res = await fetch(`${env('SUPABASE_URL')}/auth/v1/user`, {
    headers: { apikey: env('SUPABASE_SERVICE_ROLE_KEY'), Authorization: `Bearer ${token}` },
  })
  if (!res.ok) return { ok: false }

  const user = (await res.json()) as { email?: string }
  const email = user.email?.toLowerCase()
  if (!email) return { ok: false }

  const admin = await db<{ email: string }>(
    `admin_users?email=eq.${encodeURIComponent(email)}&select=email&limit=1`,
  )
  return { ok: admin.rows.length > 0, email }
}

/** Emails already sent today and this month, from recorded campaigns. */
async function usage(): Promise<{ today: number; month: number }> {
  const now = new Date()
  const dayStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))

  const [day, month] = await Promise.all([
    db<Campaign>(
      `newsletter_campaigns?status=eq.sent&sent_at=gte.${dayStart.toISOString()}&select=recipient_count`,
    ),
    db<Campaign>(
      `newsletter_campaigns?status=eq.sent&sent_at=gte.${monthStart.toISOString()}&select=recipient_count`,
    ),
  ])

  const sum = (rows: Campaign[]) => rows.reduce((n, r) => n + (r.recipient_count ?? 0), 0)
  return { today: sum(day.rows), month: sum(month.rows) }
}

function renderBody(body: string, unsubscribeUrl: string): string {
  const paragraphs = body
    .split(/\n{2,}/)
    .filter((p) => p.trim())
    .map(
      (p) =>
        `<p style="margin:0 0 16px;line-height:1.65;color:#3c4a40">${escapeHtml(p.trim()).replace(
          /\n/g,
          '<br>',
        )}</p>`,
    )
    .join('')

  return emailShell(
    '',
    paragraphs,
    ` · <a href="${unsubscribeUrl}" style="color:#6b6c67">Unsubscribe</a>`,
  )
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  if (req.method !== 'POST') return json({ error: 'Use POST' }, 405)

  const admin = await callerIsAdmin(req)
  if (!admin.ok) return json({ error: 'Not authorised' }, 401)

  let subject = ''
  let body = ''
  let testOnly = false
  try {
    const payload = (await req.json()) as { subject?: string; body?: string; test?: boolean }
    subject = (payload.subject ?? '').trim()
    body = payload.body ?? ''
    testOnly = payload.test === true
  } catch {
    return json({ error: 'Invalid request body' }, 400)
  }

  if (!subject) return json({ error: 'A subject is required' }, 400)
  if (!body.trim()) return json({ error: 'The newsletter body is empty' }, 400)

  // ---- test send: one email to the admin, never recorded as a campaign ----
  if (testOnly) {
    const preview = `${siteUrl()}/unsubscribe?token=00000000-0000-0000-0000-000000000000`
    const sent = await sendEmail({
      to: admin.email!,
      subject: `[Test] ${subject}`,
      html: renderBody(body, preview),
    })
    return sent.ok
      ? json({ ok: true, test: true, sentTo: admin.email })
      : json({ ok: false, error: sent.error }, 502)
  }

  // ---- real send ----
  const list = await db<Subscriber>(
    'subscribers?status=eq.subscribed&confirmed=is.true&select=email,unsubscribe_token',
  )
  const recipients = list.rows
  if (recipients.length === 0) {
    return json({ error: 'There are no confirmed subscribers yet' }, 400)
  }

  const used = await usage()
  if (used.today + recipients.length > DAILY_CAP) {
    return json(
      {
        error: 'daily_cap',
        message:
          `Sending to ${recipients.length} people would pass the free tier's ` +
          `${DAILY_CAP} emails a day. ${used.today} have gone out today, so ` +
          `${Math.max(0, DAILY_CAP - used.today)} remain. Nothing was sent.`,
        recipients: recipients.length,
        sentToday: used.today,
        remainingToday: Math.max(0, DAILY_CAP - used.today),
      },
      429,
    )
  }
  if (used.month + recipients.length > MONTHLY_CAP) {
    return json(
      {
        error: 'monthly_cap',
        message:
          `That would pass the free tier's ${MONTHLY_CAP} emails a month. ` +
          `${used.month} have gone out this month. Nothing was sent.`,
      },
      429,
    )
  }

  const campaign = await db<Campaign>('newsletter_campaigns', {
    method: 'POST',
    body: JSON.stringify({ subject, body, status: 'sending', recipient_count: 0 }),
    headers: { Prefer: 'return=representation' },
  })
  const campaignId = campaign.rows?.[0]?.id

  let delivered = 0
  const failures: string[] = []

  for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
    const slice = recipients.slice(i, i + BATCH_SIZE)
    const messages = slice.map((s) => ({
      to: s.email,
      subject,
      html: renderBody(body, `${siteUrl()}/unsubscribe?token=${s.unsubscribe_token}`),
    }))

    const res = await sendBatch(messages)
    if (res.ok) delivered += slice.length
    else failures.push(res.error ?? 'unknown error')
  }

  if (campaignId) {
    await db(`newsletter_campaigns?id=eq.${campaignId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        recipient_count: delivered,
        status: failures.length && delivered === 0 ? 'failed' : 'sent',
        sent_at: new Date().toISOString(),
      }),
      returnRows: false,
    })
  }

  if (delivered === 0) {
    return json({ ok: false, error: failures[0] ?? 'Nothing could be sent' }, 502)
  }

  return json({
    ok: true,
    delivered,
    total: recipients.length,
    partial: failures.length > 0,
    remainingToday: Math.max(0, DAILY_CAP - used.today - delivered),
  })
})
