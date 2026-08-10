// One-click unsubscribe from the link in every newsletter.
//
// Responds with a page, since it is opened from an email client. The token is
// the only credential needed — that is deliberate, because requiring a login
// to unsubscribe is hostile and breaks bulk-sender requirements.
// verify_jwt is off: a mail client sends no Authorization header.

import { cors, page, db } from '../_shared/lib.ts'

interface Subscriber {
  id: string
  email: string
  status: string
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })

  const url = new URL(req.url)
  let token = url.searchParams.get('token')?.trim() ?? ''

  // Mail clients that support one-click unsubscribe POST a form instead.
  if (!token && req.method === 'POST') {
    try {
      const body = (await req.json()) as { token?: string }
      token = (body.token ?? '').trim()
    } catch {
      // fall through to the invalid-token response
    }
  }

  if (!token || !/^[0-9a-f-]{36}$/i.test(token)) {
    return page('Link not recognised', 'That unsubscribe link is not valid.', 400)
  }

  const found = await db<Subscriber>(
    `subscribers?unsubscribe_token=eq.${encodeURIComponent(token)}&select=id,email,status&limit=1`,
  )
  const subscriber = found.rows?.[0]

  if (!subscriber) {
    return page('Link not recognised', 'That unsubscribe link is not valid.', 404)
  }

  if (subscriber.status === 'unsubscribed') {
    return page('Already unsubscribed', 'You are not on the list. We will not email you again.')
  }

  const updated = await db(`subscribers?id=eq.${subscriber.id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'unsubscribed' }),
    returnRows: false,
  })

  if (!updated.ok) {
    console.error('unsubscribe: update failed', updated.status)
    return page('Something went wrong', 'Please try the link again in a moment.', 500)
  }

  return page('Unsubscribed', 'You will not receive any more newsletters from AVR.')
})
