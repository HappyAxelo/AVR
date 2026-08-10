// Emails AVR when a new enquiry arrives.
//
// The browser calls this with the id of the row it just inserted. The details
// are read from the database, never taken from the request body, and the
// `notified` flag makes it idempotent — so this cannot be used to send
// arbitrary mail or to spam the inbox by replaying a request.

import { cors, json, db, sendEmail, emailShell, escapeHtml } from '../_shared/lib.ts'

interface Enquiry {
  id: string
  name: string
  phone: string
  email: string | null
  location: string | null
  crop: string | null
  hectares: number | null
  message: string | null
  notified: boolean
  created_at: string
}

function row(labelText: string, value: string): string {
  return `<tr>
    <td style="padding:6px 12px 6px 0;color:#6b6c67;vertical-align:top;white-space:nowrap">${escapeHtml(labelText)}</td>
    <td style="padding:6px 0;color:#101410">${escapeHtml(value)}</td>
  </tr>`
}

/** ADMIN_EMAIL if set, otherwise the first address on the allowlist. */
async function recipient(): Promise<string | null> {
  const configured = Deno.env.get('ADMIN_EMAIL')
  if (configured) return configured
  const admins = await db<{ email: string }>('admin_users?select=email&order=created_at.asc&limit=1')
  return admins.rows?.[0]?.email ?? null
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  if (req.method !== 'POST') return json({ error: 'Use POST' }, 405)

  let id = ''
  try {
    const body = (await req.json()) as { id?: string }
    id = (body.id ?? '').trim()
  } catch {
    return json({ error: 'Invalid request body' }, 400)
  }

  if (!/^[0-9a-f-]{36}$/i.test(id)) return json({ error: 'Invalid id' }, 400)

  const to = await recipient()
  if (!to) {
    console.error('notify-enquiry: no ADMIN_EMAIL and no admin_users row')
    return json({ ok: false, error: 'No notification recipient configured' }, 500)
  }

  const found = await db<Enquiry>(`contact_submissions?id=eq.${encodeURIComponent(id)}&limit=1`)
  const enquiry = found.rows?.[0]

  // Unknown id, or already emailed: report success without sending again.
  if (!enquiry || enquiry.notified) return json({ ok: true })

  // Claim the row first. If two requests race, only one flips false -> true,
  // so only one email goes out.
  const claim = await db<Enquiry>(
    `contact_submissions?id=eq.${enquiry.id}&notified=is.false`,
    {
      method: 'PATCH',
      body: JSON.stringify({ notified: true }),
      headers: { Prefer: 'return=representation' },
    },
  )
  if (!claim.ok || claim.rows.length === 0) return json({ ok: true })

  const parts = [
    row('Name', enquiry.name),
    row('Phone', enquiry.phone),
    enquiry.email ? row('Email', enquiry.email) : '',
    enquiry.location ? row('Location', enquiry.location) : '',
    enquiry.crop ? row('Crop', enquiry.crop) : '',
    enquiry.hectares !== null ? row('Hectares', String(enquiry.hectares)) : '',
  ].join('')

  const wa = enquiry.phone.replace(/\D/g, '').replace(/^0/, '250')

  const sent = await sendEmail({
    to,
    subject: `New spray enquiry — ${enquiry.name}`,
    html: emailShell(
      'New enquiry from the website',
      `<table style="border-collapse:collapse;font-size:15px;margin:0 0 16px">${parts}</table>
       ${
         enquiry.message
           ? `<p style="margin:0 0 16px;padding:12px;background:#F4F1EA;border-radius:8px;
                white-space:pre-line;line-height:1.6">${escapeHtml(enquiry.message)}</p>`
           : ''
       }
       <p style="margin:0">
         <a href="https://wa.me/${escapeHtml(wa)}" style="color:#12472F;font-weight:600">Reply on WhatsApp</a>
         &nbsp;·&nbsp;
         <a href="tel:${escapeHtml(enquiry.phone)}" style="color:#12472F;font-weight:600">Call</a>
       </p>`,
    ),
  })

  if (!sent.ok) {
    // Release the claim so a later retry can still deliver it.
    await db(`contact_submissions?id=eq.${enquiry.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ notified: false }),
      returnRows: false,
    })
    console.error('notify-enquiry: email failed —', sent.error)
    return json({ ok: false, error: 'Notification could not be sent' }, 502)
  }

  return json({ ok: true })
})
