// Newsletter sign-up, step one of double opt-in.
//
// Inserts (or finds) the subscriber and emails them a confirmation link.
// `confirmed` stays false until they click it, so we never send a newsletter
// to an address that did not ask for one.
//
// The response is always {ok:true} for a valid address, whether the row was
// new or already existed. Anything else would let this endpoint be used to
// test whether an address is on the list.

import { cors, json, db, sendEmail, emailShell, button, siteUrl, escapeHtml } from '../_shared/lib.ts'

interface Subscriber {
  id: string
  email: string
  confirmed: boolean
  status: string
  confirm_token: string
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  if (req.method !== 'POST') return json({ error: 'Use POST' }, 405)

  let email = ''
  try {
    const body = (await req.json()) as { email?: string }
    email = (body.email ?? '').trim().toLowerCase()
  } catch {
    return json({ error: 'Invalid request body' }, 400)
  }

  // Deliberately simple: the confirmation email is the real validation.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 254) {
    return json({ error: 'Please enter a valid email address' }, 400)
  }

  // Insert, or fetch the existing row if the address is already known.
  const insert = await db<Subscriber>('subscribers', {
    method: 'POST',
    body: JSON.stringify({ email }),
    headers: { Prefer: 'return=representation' },
  })

  let subscriber: Subscriber | undefined = insert.rows?.[0]

  if (!subscriber) {
    const existing = await db<Subscriber>(
      `subscribers?email=eq.${encodeURIComponent(email)}&select=id,email,confirmed,status,confirm_token&limit=1`,
    )
    subscriber = existing.rows?.[0]
  }

  if (!subscriber) {
    console.error('subscribe: could not insert or find subscriber', insert.status)
    return json({ ok: false, error: 'Could not complete the sign-up' }, 500)
  }

  // Someone re-subscribing after unsubscribing goes back to pending.
  if (subscriber.status === 'unsubscribed') {
    await db(`subscribers?id=eq.${subscriber.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'subscribed', confirmed: false }),
      returnRows: false,
    })
    subscriber.confirmed = false
  }

  // Already confirmed: nothing to send, but report success either way.
  if (subscriber.confirmed) return json({ ok: true })

  const link = `${siteUrl()}/confirm?token=${subscriber.confirm_token}`
  const sent = await sendEmail({
    to: email,
    subject: 'Confirm your AVR newsletter subscription',
    html: emailShell(
      'Confirm your subscription',
      `<p style="margin:0 0 20px;line-height:1.6;color:#3c4a40">
         Please confirm you want field notes and spray-season reminders from AVR.
         A few emails a season, no more.
       </p>
       <p style="margin:0 0 24px">${button(link, 'Confirm subscription')}</p>
       <p style="margin:0;font-size:13px;line-height:1.6;color:#6b6c67">
         If the button does not work, paste this into your browser:<br>
         <span style="word-break:break-all">${escapeHtml(link)}</span>
       </p>
       <p style="margin:20px 0 0;font-size:13px;color:#6b6c67">
         If you did not request this, ignore this email and nothing happens.
       </p>`,
    ),
  })

  // The row exists either way; a failed send is logged, not surfaced, so the
  // visitor is not told which addresses are on the list.
  if (!sent.ok) console.error('subscribe: email failed —', sent.error)

  return json({ ok: true })
})
