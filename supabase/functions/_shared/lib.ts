// Shared helpers for the AVR Edge Functions.
// Every secret is read from the function environment and never leaves the server.

export const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

export function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  })
}

/** A short HTML page, used for links people click in an email. */
export function page(title: string, message: string, status = 200): Response {
  const html = `<!doctype html>
<html lang="en-GB"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(title)} — AVR</title>
<style>
  body{margin:0;min-height:100vh;display:grid;place-items:center;background:#12472F;
       color:#F4F1EA;font-family:system-ui,-apple-system,Segoe UI,sans-serif;padding:24px}
  .box{max-width:32rem;text-align:center}
  h1{font-size:1.6rem;margin:0 0 .75rem}
  p{margin:0 0 1.5rem;line-height:1.6;color:rgba(244,241,234,.8)}
  a{display:inline-block;background:#C6F135;color:#12472F;text-decoration:none;
    font-weight:600;padding:.7rem 1.4rem;border-radius:999px}
</style></head>
<body><div class="box">
  <h1>${escapeHtml(title)}</h1>
  <p>${escapeHtml(message)}</p>
  <a href="${escapeAttr(Deno.env.get('SITE_URL') ?? '/')}">Back to the site</a>
</div></body></html>`
  return new Response(html, { status, headers: { ...cors, 'Content-Type': 'text/html; charset=utf-8' } })
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function escapeAttr(s: string): string {
  return escapeHtml(s)
}

export function env(name: string): string {
  const v = Deno.env.get(name)
  if (!v) throw new Error(`Missing environment variable: ${name}`)
  return v
}

export function siteUrl(): string {
  return (Deno.env.get('SITE_URL') ?? 'http://localhost:5173').replace(/\/$/, '')
}

/** The verified sender. Falls back to Resend's test sender until the domain is verified. */
export function fromAddress(): string {
  return Deno.env.get('FROM_EMAIL') ?? 'AVR <onboarding@resend.dev>'
}

export interface EmailMessage {
  to: string
  subject: string
  html: string
}

export interface SendResult {
  ok: boolean
  error?: string
}

/** Sends one email through Resend. */
export async function sendEmail(msg: EmailMessage): Promise<SendResult> {
  const key = Deno.env.get('RESEND_API_KEY')
  if (!key) return { ok: false, error: 'RESEND_API_KEY is not set' }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: fromAddress(), to: msg.to, subject: msg.subject, html: msg.html }),
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    return { ok: false, error: `Resend responded ${res.status}: ${detail.slice(0, 300)}` }
  }
  return { ok: true }
}

/** Sends up to 100 distinct emails in one Resend batch call. */
export async function sendBatch(messages: EmailMessage[]): Promise<SendResult> {
  const key = Deno.env.get('RESEND_API_KEY')
  if (!key) return { ok: false, error: 'RESEND_API_KEY is not set' }

  const res = await fetch('https://api.resend.com/emails/batch', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(
      messages.map((m) => ({ from: fromAddress(), to: m.to, subject: m.subject, html: m.html })),
    ),
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    return { ok: false, error: `Resend responded ${res.status}: ${detail.slice(0, 300)}` }
  }
  return { ok: true }
}

/** Calls PostgREST with the service-role key. Server-side only. */
export async function db<T>(
  path: string,
  init: RequestInit & { returnRows?: boolean } = {},
): Promise<{ ok: boolean; rows: T[]; status: number }> {
  const url = env('SUPABASE_URL')
  const key = env('SUPABASE_SERVICE_ROLE_KEY')

  const res = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: init.returnRows === false ? 'return=minimal' : 'return=representation',
      ...(init.headers ?? {}),
    },
  })

  let rows: T[] = []
  if (init.returnRows !== false) {
    rows = (await res.json().catch(() => [])) as T[]
  }
  return { ok: res.ok, rows, status: res.status }
}

/** Wraps content in the AVR email shell. */
export function emailShell(heading: string, bodyHtml: string, footerHtml = ''): string {
  return `<!doctype html><html><body style="margin:0;padding:24px;background:#F4F1EA;
    font-family:system-ui,-apple-system,Segoe UI,sans-serif;color:#101410">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden">
    <div style="background:#12472F;padding:20px 24px">
      <span style="color:#F4F1EA;font-size:20px;font-weight:700">AVR<span style="color:#C6F135">.</span></span>
    </div>
    <div style="padding:24px">
      ${heading ? `<h1 style="margin:0 0 16px;font-size:20px;color:#12472F">${escapeHtml(heading)}</h1>` : ''}
      ${bodyHtml}
    </div>
  </div>
  <p style="max-width:560px;margin:16px auto 0;font-size:12px;color:#6b6c67;text-align:center">
    Ampere Vision Rwanda Ltd, Nyarugenge District, Kigali${footerHtml}
  </p>
</body></html>`
}

export function button(href: string, text: string): string {
  return `<a href="${escapeAttr(href)}" style="display:inline-block;background:#C6F135;color:#12472F;
    text-decoration:none;font-weight:600;padding:12px 22px;border-radius:999px">${escapeHtml(text)}</a>`
}
