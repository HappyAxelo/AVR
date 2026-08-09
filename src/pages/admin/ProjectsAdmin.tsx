import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import type { ProjectRow, GalleryImage } from '../../lib/supabase'
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

export function ProjectsList() {
  const [rows, setRows] = useState<ProjectRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const { data, error: e } = await supabase
      .from('projects')
      .select('*')
      .order('sort_order', { ascending: true })
    if (e) setError(e.message)
    else setRows((data ?? []) as ProjectRow[])
    setLoading(false)
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const togglePublish = async (row: ProjectRow) => {
    const { error: e } = await supabase
      .from('projects')
      .update({ status: row.status === 'draft' ? 'published' : 'draft' })
      .eq('id', row.id)
    if (e) setError(e.message)
    else void load()
  }

  const remove = async (row: ProjectRow) => {
    if (!confirm(`Delete "${row.title}"? This cannot be undone.`)) return
    const { error: e } = await supabase.from('projects').delete().eq('id', row.id)
    if (e) setError(e.message)
    else void load()
  }

  return (
    <div>
      <PageTitle
        action={
          <Link to="/admin/projects/new" className={btn}>
            New project
          </Link>
        }
      >
        Our work
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
          No projects yet.{' '}
          <Link to="/admin/projects/new" className="underline">
            Add the first one.
          </Link>
          <br />
          <span className="mt-2 block text-sm">
            Until you do, the site shows three clearly-marked placeholder projects.
          </span>
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
                      {[row.client, row.year].filter(Boolean).join(' · ') || '/work/' + row.slug}
                      {row.gallery?.length ? ` · ${row.gallery.length} photos` : ''}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link to={`/admin/projects/${row.id}`} className={btnGhost}>
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

const emptyProject = {
  title: '',
  slug: '',
  client: '',
  year: '',
  summary: '',
  overview: '',
  task: '',
  cover_image_url: null as string | null,
  gallery: [] as GalleryImage[],
  status: 'draft' as 'draft' | 'published',
  sort_order: 0,
}

export function ProjectEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = id === 'new'

  const [project, setProject] = useState(emptyProject)
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [slugTouched, setSlugTouched] = useState(!isNew)

  useEffect(() => {
    if (isNew) return
    let cancelled = false
    supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .maybeSingle()
      .then(({ data, error: e }) => {
        if (cancelled) return
        if (e) setError(e.message)
        else if (data) {
          const row = data as ProjectRow
          setProject({
            title: row.title,
            slug: row.slug,
            client: row.client,
            year: row.year,
            summary: row.summary,
            overview: row.overview,
            task: row.task,
            cover_image_url: row.cover_image_url,
            gallery: row.gallery ?? [],
            status: row.status,
            sort_order: row.sort_order,
          })
        }
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [id, isNew])

  const set = <K extends keyof typeof project>(key: K, value: (typeof project)[K]) => {
    setProject((p) => ({ ...p, [key]: value }))
    setSaved(false)
  }

  const save = async (publish?: boolean) => {
    setError(null)
    if (!project.title.trim()) {
      setError('Give the project a title before saving.')
      return
    }
    const slug = (project.slug.trim() || slugify(project.title)).trim()
    if (!slug) {
      setError('Could not build a web address from that title. Please set the slug manually.')
      return
    }

    setSaving(true)
    const status = publish === undefined ? project.status : publish ? 'published' : 'draft'
    const payload = {
      title: project.title.trim(),
      slug,
      client: project.client.trim(),
      year: project.year.trim(),
      summary: project.summary.trim(),
      overview: project.overview,
      task: project.task,
      cover_image_url: project.cover_image_url,
      gallery: project.gallery,
      status,
      sort_order: Number(project.sort_order) || 0,
    }

    const query = isNew
      ? supabase.from('projects').insert(payload).select('id').maybeSingle()
      : supabase.from('projects').update(payload).eq('id', id).select('id').maybeSingle()

    const { data, error: e } = await query
    setSaving(false)

    if (e) {
      setError(
        e.code === '23505'
          ? 'Another project already uses that web address. Change the slug.'
          : e.message,
      )
      return
    }
    setProject((p) => ({ ...p, slug, status }))
    setSaved(true)
    if (isNew && data?.id) navigate(`/admin/projects/${data.id}`, { replace: true })
  }

  if (loading) return <p className="text-ink/65">Loading…</p>

  return (
    <div>
      <PageTitle
        action={
          <Link to="/admin/projects" className={btnGhost}>
            ← All projects
          </Link>
        }
      >
        {isNew ? 'New project' : 'Edit project'}
      </PageTitle>

      <div className="space-y-4">
        {error && <Banner kind="error">{error}</Banner>}
        {saved && !error && (
          <Banner kind="success">
            Saved.{' '}
            {project.status === 'published' ? (
              <a
                href={`/work/${project.slug}`}
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
              <label htmlFor="p-title" className={label}>
                Project title
              </label>
              <input
                id="p-title"
                className={field}
                value={project.title}
                onChange={(e) => {
                  const title = e.target.value
                  setProject((p) => ({ ...p, title, slug: slugTouched ? p.slug : slugify(title) }))
                  setSaved(false)
                }}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="p-client" className={label}>
                  Client
                </label>
                <input
                  id="p-client"
                  className={field}
                  value={project.client}
                  placeholder="Cooperative or organisation name"
                  onChange={(e) => set('client', e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="p-year" className={label}>
                  Year
                </label>
                <input
                  id="p-year"
                  className={field}
                  value={project.year}
                  placeholder="2025"
                  onChange={(e) => set('year', e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="p-slug" className={label}>
                Web address
              </label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-ink/60">/work/</span>
                <input
                  id="p-slug"
                  className={field}
                  value={project.slug}
                  onChange={(e) => {
                    setSlugTouched(true)
                    set('slug', e.target.value)
                  }}
                />
              </div>
            </div>

            <div>
              <label htmlFor="p-summary" className={label}>
                Card summary
              </label>
              <input
                id="p-summary"
                className={field}
                value={project.summary}
                placeholder="One line, shown on the project card"
                onChange={(e) => set('summary', e.target.value)}
              />
            </div>

            <CoverImageField
              bucket="project-images"
              value={project.cover_image_url}
              onChange={(url) => set('cover_image_url', url)}
            />
          </div>
        </Card>

        <Card>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="p-overview" className={label}>
                Overview
              </label>
              <p className="mb-2 text-sm text-ink/60">What the project was and how it went.</p>
              <textarea
                id="p-overview"
                rows={8}
                className={field}
                value={project.overview}
                onChange={(e) => set('overview', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="p-task" className={label}>
                The task
              </label>
              <p className="mb-2 text-sm text-ink/60">What the client asked you to do.</p>
              <textarea
                id="p-task"
                rows={8}
                className={field}
                value={project.task}
                onChange={(e) => set('task', e.target.value)}
              />
            </div>
          </div>
        </Card>

        <Card>
          <GalleryField
            bucket="project-images"
            value={project.gallery}
            onChange={(gallery) => set('gallery', gallery)}
          />
        </Card>

        <Card>
          <label htmlFor="p-order" className={label}>
            Display order
          </label>
          <p className="mb-2 text-sm text-ink/60">Lower numbers appear first.</p>
          <input
            id="p-order"
            type="number"
            className={`${field} max-w-32`}
            value={project.sort_order}
            onChange={(e) => set('sort_order', Number(e.target.value))}
          />
        </Card>

        <div className="sticky bottom-0 flex flex-wrap items-center gap-3 border-t border-terrace/10 bg-paper/95 py-4 backdrop-blur">
          <button type="button" className={btnGhost} disabled={saving} onClick={() => void save()}>
            {saving ? 'Saving…' : 'Save'}
          </button>
          {project.status === 'published' ? (
            <button type="button" className={btn} disabled={saving} onClick={() => void save(false)}>
              Unpublish
            </button>
          ) : (
            <button type="button" className={btn} disabled={saving} onClick={() => void save(true)}>
              Publish
            </button>
          )}
          <StatusPill status={project.status} />
        </div>
      </div>
    </div>
  )
}
