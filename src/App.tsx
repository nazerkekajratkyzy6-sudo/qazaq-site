import { HashRouter, Route, Routes } from 'react-router-dom'
import { AppProvider } from './lib/app'
import Layout from './components/Layout'
import Home from './pages/Home'
import Timeline from './pages/Timeline'
import Archive from './pages/Archive'
import Figures from './pages/Figures'
import { TopicsIndex, TopicPage } from './pages/Topics'
import Lab from './pages/Lab'
import Games from './pages/Games'
import Results from './pages/Results'
import Sources from './pages/Sources'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="timeline" element={<Timeline />} />
            <Route path="archive" element={<Archive />} />
            <Route path="figures" element={<Figures />} />
            <Route path="topics" element={<TopicsIndex />} />
            <Route path="topics/:id" element={<TopicPage />} />
            <Route path="lab" element={<Lab />} />
            <Route path="games" element={<Games />} />
            <Route path="results" element={<Results />} />
            <Route path="sources" element={<Sources />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </HashRouter>
    </AppProvider>
  )
}
