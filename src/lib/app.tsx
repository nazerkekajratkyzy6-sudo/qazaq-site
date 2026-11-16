import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useLocalStorage } from './storage'

export type Panel = null | 'search' | 'favorites' | 'glossary' | 'share'

export interface Progress {
  visited: string[]
  games: Record<string, number> // ең жоғары нәтиже, %
  lab: Record<string, boolean>
}

interface Ctx {
  panel: Panel
  openPanel: (p: Panel) => void
  closePanel: () => void
  presentation: boolean
  togglePresentation: () => void
  favorites: string[]
  toggleFav: (id: string) => void
  isFav: (id: string) => boolean
  progress: Progress
  markVisited: (id: string) => void
  setGameBest: (id: string, pct: number) => void
  setLabStep: (id: string, done: boolean) => void
  percent: number
}

const AppCtx = createContext<Ctx | null>(null)
export const useApp = () => {
  const c = useContext(AppCtx)
  if (!c) throw new Error('AppProvider жоқ')
  return c
}

const MAIN = ['home', 'timeline', 'archive', 'figures', 'topics', 'lab', 'games', 'results', 'sources']
export const PROGRESS_TOTAL = MAIN.length + 6 + 4 // беттер + ойындар + зертхана қадамдары

export function AppProvider({ children }: { children: ReactNode }) {
  const [panel, setPanel] = useState<Panel>(null)
  const [presentation, setPresentation] = useLocalStorage<boolean>('presentation', false)
  const [favorites, setFavorites] = useLocalStorage<string[]>('favorites', [])
  const [progress, setProgress] = useLocalStorage<Progress>('progress', { visited: [], games: {}, lab: {} })

  useEffect(() => {
    document.documentElement.classList.toggle('presentation', presentation)
  }, [presentation])

  const markVisited = useCallback((id: string) => {
    setProgress(p => (p.visited.includes(id) ? p : { ...p, visited: [...p.visited, id] }))
  }, [setProgress])
  const setGameBest = useCallback((id: string, pct: number) => {
    setProgress(p => ((p.games[id] ?? -1) >= pct ? p : { ...p, games: { ...p.games, [id]: pct } }))
  }, [setProgress])
  const setLabStep = useCallback((id: string, done: boolean) => {
    setProgress(p => (!!p.lab[id] === done ? p : { ...p, lab: { ...p.lab, [id]: done } }))
  }, [setProgress])
  const toggleFav = useCallback((id: string) => {
    setFavorites(f => (f.includes(id) ? f.filter(x => x !== id) : [...f, id]))
  }, [setFavorites])

  const percent = useMemo(() => {
    const done = progress.visited.filter(v => MAIN.includes(v)).length + Object.values(progress.games).filter(v => v >= 60).length + Object.values(progress.lab).filter(Boolean).length
    return Math.min(100, Math.round((done / PROGRESS_TOTAL) * 100))
  }, [progress])

  const value: Ctx = {
    panel, openPanel: setPanel, closePanel: () => setPanel(null),
    presentation, togglePresentation: () => setPresentation(v => !v),
    favorites, toggleFav, isFav: id => favorites.includes(id),
    progress, markVisited, setGameBest, setLabStep, percent,
  }
  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>
}
