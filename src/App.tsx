import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import News from './pages/News'
import NewsPost from './pages/NewsPost'
import Admin from './pages/Admin'
import Unsubscribe from './pages/Unsubscribe'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/news" element={<News />} />
      <Route path="/news/:slug" element={<NewsPost />} />
      <Route path="/admin/*" element={<Admin />} />
      <Route path="/unsubscribe" element={<Unsubscribe />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
