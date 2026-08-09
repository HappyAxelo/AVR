import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import type { NewsRow, GalleryImage } from '../../lib/supabase'
import { CoverImageField, GalleryField } from './ImageManager'
import {
  Banner,
  Card,
  Empty,
  PageTitle,
  StatusPill,
  btn,
  btnDanger,
  btnGhost,
  field,
  label,
  slugify,
} from './ui'

/* ------------------------- list ------------------------- */

export function NewsList() {
  const [rows, setRows] = useState<NewsRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const { data, error: e } = await supabase
      .from('news_posts')
      .select('*')
      .order('created_at', { ascending: false })
    if (e) setError(e.message)
    else setRows((data ?? []) as NewsRow[])
    setLoading(false)
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const togglePublish = async (row: NewsRow) => {
    const publishing = row.status === 'draft'
    const { error: e } = await supabase
      .from('news_posts')
      .update({
        status: publishing ? 'published' : 'draft',
        // Stamp the publish date the first time it goes live, then keep it.
        published_at: publishing ? (row.published_at ?? new Date().toISOString()) : row.published_at,
      })
      .eq('id', row.id)
    if (e) setError(e.message)
    else void load()
  }

  const remove = async (row: NewsRow) => {
    if (!confirm(`Delete "${row.title}"? This cannot be undone.`)) return
    const { error: e } = await supabase.from('news_posts').delete().eq('id', row.id)
    if (e) setError(e.message)
    else void load()
  }

  return (
    <div>
      <PageTitle
        action={
          <Link to="/admin/news/new" className={btn}>
            New article
          </Link>
        }
      >
        News
      </PageTitle>

      {error && (
        <div className="mb-4">
          <Banner kind="error">{error}</Banner>
        </div>
      )}

      {loading ? (
        <p className="text-ink/65">Loading…</p>
      ) : rows.length === 0 ? (
        <Empty>
          No articles yet. <Link to="/admin/news/new" className="underline">Write the first one.</Link>
        </Empty>
      ) : (
        <div className="space-y-3">
          {rows.map((row) => (
            <Card key={row.id}>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-4">
                  {row.cover_image_url && (
                    <img
                      src={row.cover_image_url}
                      alt=""
                      className="h-14 w-20 shrink-0 rounded-md object-cover"
                    />
                  )}
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="truncate font-semibold text-terrace">{row.title}</h2>
                      <StatusPill status={row.status} />
                    </div>
                    <p className="mt-0.5 text-sm text-ink/60">
                      /news/{row.slug}
                      {row.gallery?.length ? ` · ${row.gallery.length} photos` : ''}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link to={`/admin/news/${row.id}`} className={btnGhost}>
                    Edit
                  </Link>
                  <button type="button" className={btnGhost} onClick={() => void togglePublish(row)}>
                    {row.status === 'published' ? 'Unpublish' : 'Publish'}
                  </button>
                  <button type="button" className={btnDanger} onClick={() => void remove(row)}>
                    Delete
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

/* ------------------------- editor ------------------------- */

const emptyPost = {
  title: '',
  slug: '',
  excerpt: '',
  body: '',
  cover_image_url: null as string | null,
  gallery: [] as GalleryImage[],
  status: 'draft' as 'draft' | 'published',
  published_at: null as string | null,
}

export function NewsEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = id === 'new'

  const [post, setPost] = useState(emptyPost)
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [slugTouched, setSlugTouched] = useState(!isNew)

  useEffect(() => {
    if (isNew) return
    let cancelled = false
    supabase
      .from('news_posts')
      .select('*')
      .eq('id', id)
      .maybeSingle()
      .then(({ data, error: e }) => {
        if (cancelled) return
        if (e) setError(e.message)
        else if (data) {
          const row = data as NewsRow
          setPost({
            title: row.title,
            slug: row.slug,
            excerpt: row.excerpt,
            body: row.body,
            cover_image_url: row.cover_image_url,
            gallery: row.gallery ?? [],
            status: row.status,
            published_at: row.published_at,
          })
        }
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [id, isNew])

  const set = <K extends keyof typeof post>(key: K, value: (typeof post)[K]) => {
    setPost((p) => ({ ...p, [key]: value }))
    setSaved(false)
  }

  const save = async (publish?: boolean) => {
    setError(null)
    if (!post.title.trim()) {
      setError('Give the article a title before saving.')
      return
    }
    const slug = (post.slug.trim() || slugify(post.title)).trim()
    if (!slug) {
      setError('Could not build a web address from that title. Please set the slug manually.')
      return
    }

    setSaving(true)
    const status = publish === undefined ? post.status : publish ? 'published' : 'draft'
    const payload = {
      title: post.title.trim(),
      slug,
      excerpt: post.excerpt.trim(),
      body: post.body,
      cover_image_url: post.cover_image_url,
      gallery: post.gallery,
      status,
      published_at:
        status === 'published' ? (post.published_at ?? new Date().toISOString()) : post.published_at,
    }

    const query = isNew
      ? supabase.from('news_posts').insert(payload).select('id').maybeSingle()
      : supabase.from('news_posts').update(payload).eq('id', id).select('id').maybeSingle()

    const { data, error: e } = await query
    setSaving(false)

    if (e) {
      setError(
        e.code === '23505'
          ? 'Another article already uses that web address. Change the slug.'
          : e.message,
      )
      return
    }
    setPost((p) => ({ ...p, slug, status, published_at: payload.published_at }))
    setSaved(true)
    if (isNew && data?.id) navigate(`/admin/news/${data.id}`, { replace: true })
  }

  if (loading) return <p className="text-ink/65">Loading…</p>

  return (
    <div>
      <PageTitle
        action={
          <Link to="/admin/news" className={btnGhost}>
            ← All articles
          </Link>
        }
      >
        {isNew ? 'New article' : 'Edit article'}
      </PageTitle>

      <div className="space-y-4">
        {error && <Banner kind="error">{error}</Banner>}
        {saved && !error && (
          <Banner kind="success">
            Saved.{' '}
            {post.status === 'published' ? (
              <a
                href={`/news/${post.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                View it live →
              </a>
            ) : (
              'Still a draft, so it is not visible on the site yet.'
            )}
          </Banner>
        )}

        <Card>
          <div className="space-y-4">
            <div>
              <label htmlFor="n-title" className={label}>
                Title
              </label>
              <input
                id="n-title"
                className={field}
                value={post.title}
                onChange={(e) => {
                  const title = e.target.value
                  setPost((p) => ({
                    ...p,
                    title,
                    slug: slugTouched ? p.slug : slugify(title),
                  }))
                  setSaved(false)
                }}
              />
            </div>

            <div>
              <label htmlFor="n-slug" className={label}>
                Web address
              </label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-ink/60">/news/</span>
                <input
                  id="n-slug"
                  className={field}
                  value={post.slug}
                  onChange={(e) => {
                    setSlugTouched(true)
                    set('slug', e.target.value)
                  }}
                />
              </div>
            </div>

            <div>
              <label htmlFor="n-excerpt" className={label}>
                Summary
              </label>
              <textarea
                id="n-excerpt"
                rows={2}
                className={field}
                value={post.excerpt}
                placeholder="One or two sentences. Shown on the news list and cards."
                onChange={(e) => set('excerpt', e.target.value)}
              />
            </div>

            <CoverImageField
              bucket="news-images"
              value={post.cover_image_url}
              onChange={(url) => set('cover_image_url', url)}
            />
          </div>
        </Card>

        <Card>
          <label htmlFor="n-body" className={label}>
            Story
          </label>
          <p className="mb-2 text-sm text-ink/60">
            Leave a blank line between paragraphs.
          </p>
          <textarea
            id="n-body"
            rows={16}
            className={`${field} font-mono text-sm leading-relaxed`}
            value={post.body}
            onChange={(e) => set('body', e.target.value)}
          />
        </Card>

        <Card>
          <GalleryField
            bucket="news-images"
            value={post.gallery}
            onChange={(gallery) => set('gallery', gallery)}
          />
        </Card>

        <div className="sticky bottom-0 flex flex-wrap items-center gap-3 border-t border-terrace/10 bg-paper/95 py-4 backdrop-blur">
          <button type="button" className={btnGhost} disabled={saving} onClick={() => void save()}>
            {saving ? 'Saving…' : 'Save'}
          </button>
          {post.status === 'published' ? (
            <button type="button" className={btn} disabled={saving} onClick={() => void save(false)}>
              Unpublish
            </button>
          ) : (
            <button type="button" className={btn} disabled={saving} onClick={() => void save(true)}>
              Publish
            </button>
          )}
          <StatusPill status={post.status} />
        </div>
      </div>
    </div>
  )
}
