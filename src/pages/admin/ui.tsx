import type { ReactNode } from 'react'

/* Shared admin styling. The admin panel is English-only and deliberately
   plain: it is a tool, not a shop window. */

export const field =
  'w-full rounded-lg border border-terrace/20 bg-white px-3 py-2 text-ink placeholder:text-ink/45 focus:border-terrace focus:outline-none'

export const label = 'mb-1.5 block text-sm font-medium text-terrace'

export const btn =
  'inline-flex items-center justify-center gap-2 rounded-lg bg-terrace px-4 py-2 text-sm font-semibold text-paper transition hover:bg-terrace-light disabled:cursor-not-allowed disabled:opacity-60'

export const btnAccent =
  'inline-flex items-center justify-center gap-2 rounded-lg bg-volt px-4 py-2 text-sm font-semibold text-terrace transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60'

export const btnGhost =
  'inline-flex items-center justify-center gap-2 rounded-lg border border-terrace/25 px-4 py-2 text-sm font-medium text-terrace transition hover:bg-terrace/5 disabled:cursor-not-allowed disabled:opacity-60'

export const btnDanger =
  'inline-flex items-center justify-center gap-2 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60'

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-terrace/10 bg-white p-5 ${className}`}>{children}</div>
  )
}

export function PageTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h1 className="text-2xl font-semibold text-terrace">{children}</h1>
      {action}
    </div>
  )
}

export function StatusPill({ status }: { status: 'draft' | 'published' }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
        status === 'published'
          ? 'bg-terrace text-volt'
          : 'border border-terrace/25 text-terrace/75'
      }`}
    >
      {status}
    </span>
  )
}

export function Banner({ kind, children }: { kind: 'error' | 'success'; children: ReactNode }) {
  const tone =
    kind === 'error'
      ? 'border-red-300 bg-red-50 text-red-800'
      : 'border-terrace/25 bg-terrace/5 text-terrace'
  return (
    <p role={kind === 'error' ? 'alert' : 'status'} className={`rounded-lg border px-4 py-3 text-sm ${tone}`}>
      {children}
    </p>
  )
}

export function Empty({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-terrace/25 p-10 text-center text-ink/65">
      {children}
    </div>
  )
}

/** Turns a title into a URL-safe slug. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    // Drop the combining marks NFD split off, so "réalisé" becomes "realise".
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

/** Builds a CSV file and triggers a download, no library needed. */
export function downloadCsv(filename: string, rows: Record<string, unknown>[]) {
  if (rows.length === 0) return
  const headers = Object.keys(rows[0])
  const escape = (v: unknown) => {
    const s = v === null || v === undefined ? '' : String(v)
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  const csv = [
    headers.join(','),
    ...rows.map((r) => headers.map((h) => escape(r[h])).join(',')),
  ].join('\n')

  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }))
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
