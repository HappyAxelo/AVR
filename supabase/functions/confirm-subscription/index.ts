// Newsletter sign-up, step two of double opt-in.
//
// Opened by clicking the link in the confirmation email, so it responds with
// a page rather than JSON. Only a valid confirm_token sets confirmed = true.
// verify_jwt is off: a mail client sends no Authorization header.

import { cors, page, db } from '../_shared/lib.ts'

interface Subscriber {
  id: string
  confirmed: boolean
  status: string
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })

  const token = new URL(req.url).searchParams.get('token')?.trim()
  if (!token || !/^[0-9a-f-]{36}$/i.test(token)) {
    return page('Link not recognised', 'That confirmation link is not valid. Please subscribe again.', 400)
  }

  const found = await db<Subscriber>(
    `subscribers?confirm_token=eq.${encodeURIComponent(token)}&select=id,confirmed,status&limit=1`,
  )
  const subscriber = found.rows?.[0]

  if (!subscriber) {
    return page('Link not recognised', 'That confirmation link is not valid. Please subscribe again.', 404)
  }

  if (subscriber.confirmed && subscriber.status === 'subscribed') {
    return page('Already confirmed', 'You are on the list. Nothing more to do.')
  }

  const updated = await db(`subscribers?id=eq.${subscriber.id}`, {
    method: 'PATCH',
    body: JSON.stringify({ confirmed: true, status: 'subscribed' }),
    returnRows: false,
  })

  if (!updated.ok) {
    console.error('confirm-subscription: update failed', updated.status)
    return page('Something went wrong', 'Please try the link again in a moment.', 500)
  }

  return page('Subscription confirmed', 'Thank you. You will hear from us at the start of each spray season.')
})
