import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Card, PageTitle } from './ui'

interface Counts {
  subscribers: number
  unread: number
  published: number
  drafts: number
  projects: number
}

export default function Dashboard() {
  const [counts, setCounts] = useState<Counts | null>(null)

  useEffect(() => {
    let cancelled = false
    const head = { count: 'exact' as const, head: true }

    Promise.all([
      supabase.from('subscribers').select('id', head).eq('status', 'subscribed'),
      supabase.from('contact_submissions').select('id', head).eq('read', false),
      supabase.from('news_posts').select('id', head).eq('status', 'published'),
      supabase.from('news_posts').select('id', head).eq('status', 'draft'),
      supabase.from('projects').select('id', head).eq('status', 'published'),
    ]).then(([subs, unread, published, drafts, projects]) => {
      if (cancelled) return
      setCounts({
        subscribers: subs.count ?? 0,
        unread: unread.count ?? 0,
        published: published.count ?? 0,
        drafts: drafts.count ?? 0,
        projects: projects.count ?? 0,
      })
    })

    return () => {
      cancelled = true
    }
  }, [])

  const tiles = [
    { label: 'Unread enquiries', value: counts?.unread, to: '/admin/enquiries' },
    { label: 'Subscribers', value: counts?.subscribers, to: '/admin/subscribers' },
    { label: 'Published articles', value: counts?.published, to: '/admin/news' },
    { label: 'Draft articles', value: counts?.drafts, to: '/admin/news' },
    { label: 'Published projects', value: counts?.projects, to: '/admin/projects' },
  ]

  return (
    <div>
      <PageTitle>Dashboard</PageTitle>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map((tile) => (
          <Link key={tile.label} to={tile.to} className="block">
            <Card className="transition hover:border-terrace/30 hover:shadow-sm">
              <p className="text-4xl font-semibold text-terrace">
                {tile.value === undefined ? '—' : tile.value}
              </p>
              <p className="mt-1 text-sm text-ink/65">{tile.label}</p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Card>
          <h2 className="font-semibold text-terrace">Write a news article</h2>
          <p className="mt-1 text-sm text-ink/65">
            Add a story with a cover image, photos and captions, then publish it.
          </p>
          <Link to="/admin/news/new" className="mt-3 inline-block text-sm font-medium text-terrace underline">
            New article →
          </Link>
        </Card>
        <Card>
          <h2 className="font-semibold text-terrace">Add a project</h2>
          <p className="mt-1 text-sm text-ink/65">
            Client, year, overview, the task and a photo gallery.
          </p>
          <Link to="/admin/projects/new" className="mt-3 inline-block text-sm font-medium text-terrace underline">
            New project →
          </Link>
        </Card>
      </div>
    </div>
  )
}
