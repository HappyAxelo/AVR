import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ScrollToHash from './components/ScrollToHash'
import { useT } from './i18n'

// Home ships in the initial bundle; everything else loads on demand so the
// marketing page stays light on 4G.
const Work = lazy(() => import('./pages/Work'))
const WorkProject = lazy(() => import('./pages/WorkProject'))
const News = lazy(() => import('./pages/News'))
const NewsPost = lazy(() => import('./pages/NewsPost'))
const Admin = lazy(() => import('./pages/Admin'))
const TokenAction = lazy(() => import('./pages/TokenAction'))
const NotFound = lazy(() => import('./pages/NotFound'))

function RouteFallback() {
  const t = useT()
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper">
      <p className="text-sm text-ink/65">{t.common.loading}</p>
    </div>
  )
}

export default function App() {
  return (
    <>
      <ScrollToHash />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work" element={<Work />} />
          <Route path="/work/:slug" element={<WorkProject />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:slug" element={<NewsPost />} />
          <Route path="/admin/*" element={<Admin />} />
          <Route path="/unsubscribe" element={<TokenAction action="unsubscribe" />} />
          <Route path="/confirm" element={<TokenAction action="confirm" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  )
}
