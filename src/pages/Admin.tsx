import { NavLink, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from '../lib/useAuth'
import Login from './admin/Login'
import Dashboard from './admin/Dashboard'
import { NewsList, NewsEditor } from './admin/NewsAdmin'
import { ProjectsList, ProjectEditor } from './admin/ProjectsAdmin'
import Enquiries from './admin/Enquiries'
import Subscribers from './admin/Subscribers'
import SiteContent from './admin/SiteContent'
import { btnGhost } from './admin/ui'

const links = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/news', label: 'News' },
  { to: '/admin/projects', label: 'Our work' },
  { to: '/admin/enquiries', label: 'Enquiries' },
  { to: '/admin/subscribers', label: 'Subscribers' },
  { to: '/admin/content', label: 'Site details' },
]

function Shell() {
  const { email, signOut } = useAuth()

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-terrace/10 bg-terrace">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-3 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="font-display text-xl font-bold text-paper">
              AVR<span className="text-volt">.</span>
            </span>
            <span className="text-sm text-paper/60">Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-paper/70 underline hover:text-paper"
            >
              View site
            </a>
            <span className="hidden text-sm text-paper/60 sm:inline">{email}</span>
            <button
              type="button"
              onClick={() => void signOut()}
              className="rounded-lg border border-paper/25 px-3 py-1.5 text-sm font-medium text-paper transition hover:bg-paper/10"
            >
              Sign out
            </button>
          </div>
        </div>

        <nav aria-label="Admin" className="mx-auto max-w-6xl px-5 sm:px-8">
          <ul className="flex gap-1 overflow-x-auto pb-2">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.end}
                  className={({ isActive }) =>
                    `block whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                      isActive ? 'bg-volt text-terrace' : 'text-paper/75 hover:bg-paper/10'
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="news" element={<NewsList />} />
          <Route path="news/:id" element={<NewsEditor />} />
          <Route path="projects" element={<ProjectsList />} />
          <Route path="projects/:id" element={<ProjectEditor />} />
          <Route path="enquiries" element={<Enquiries />} />
          <Route path="subscribers" element={<Subscribers />} />
          <Route path="content" element={<SiteContent />} />
          <Route
            path="*"
            element={
              <div>
                <p className="text-ink/65">That admin page does not exist.</p>
                <NavLink to="/admin" className={`${btnGhost} mt-4`}>
                  Back to dashboard
                </NavLink>
              </div>
            }
          />
        </Routes>
      </main>
    </div>
  )
}

function Gate() {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-terrace">
        <p className="text-paper/70">Loading…</p>
      </div>
    )
  }
  // Unauthenticated visitors only ever see the login form. Even if this were
  // bypassed, RLS means the anon key can read nothing private.
  return session ? <Shell /> : <Login />
}

export default function Admin() {
  return (
    <AuthProvider>
      <Gate />
    </AuthProvider>
  )
}
