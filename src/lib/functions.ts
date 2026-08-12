// Calls to the Supabase Edge Functions from the public site.
// These endpoints are anonymous by design; each one validates its own input
// server-side (see supabase/functions/*/index.ts).

import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '../config/public'

const URL_BASE = import.meta.env.VITE_SUPABASE_URL || PUBLIC_SUPABASE_URL
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || PUBLIC_SUPABASE_ANON_KEY

export const hasFunctions = Boolean(URL_BASE && ANON_KEY)

function endpoint(name: string): string {
  return `${URL_BASE}/functions/v1/${name}`
}

/** Signs someone up and triggers the confirmation email. */
export async function requestSubscribe(email: string): Promise<{ ok: boolean }> {
  // As with insertRow: report failure rather than a false success.
  if (!hasFunctions) return { ok: false }
  try {
    const res = await fetch(endpoint('subscribe'), {
      method: 'POST',
      headers: { apikey: ANON_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    return { ok: res.ok }
  } catch {
    return { ok: false }
  }
}

/**
 * Asks AVR to be emailed about an enquiry that was just saved.
 * Fire-and-forget: the enquiry is already in the database, so a failure here
 * costs a notification, not the lead.
 */
export function notifyEnquiry(id: string): void {
  if (!hasFunctions || !id) return
  void fetch(endpoint('notify-enquiry'), {
    method: 'POST',
    headers: { apikey: ANON_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
    keepalive: true,
  }).catch(() => {
    // Visible to AVR in the admin panel regardless.
  })
}

export type TokenResult = 'ok' | 'invalid' | 'error'

/** Shared by the confirm and unsubscribe pages. */
export async function submitToken(
  fn: 'confirm-subscription' | 'unsubscribe',
  token: string,
): Promise<TokenResult> {
  if (!/^[0-9a-f-]{36}$/i.test(token)) return 'invalid'
  if (!hasFunctions) return 'error'

  try {
    const res = await fetch(`${endpoint(fn)}?token=${encodeURIComponent(token)}`, {
      headers: { apikey: ANON_KEY },
    })
    if (res.ok) return 'ok'
    return res.status === 400 || res.status === 404 ? 'invalid' : 'error'
  } catch {
    return 'error'
  }
}
