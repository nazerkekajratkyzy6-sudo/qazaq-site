import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useApp } from '../lib/app'
import Panels from './Panels'

export const NAV = [
  { to: '/', label: 'Басты бет', end: true },
  { to: '/timeline', label: 'Тарихи уақыт' },
  { to: '/archive', label: 'Газет мұрағаты' },
  { to: '/figures', label: 'Алаш тұлғалары' },
  { to: '/lab', label: 'Зерттеу' },
  { to: '/games', label: 'Тапсырмалар' },
  { to: '/results', label: 'Нәтиже' },
  { to: '/sources', label: 'Дереккөздер' },
]

function ToolButton({ onClick, label, children, badge }: { onClick: () => void; label: string; children: React.ReactNode; badge?: number }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} title={label} className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-paper-300 bg-white text-lg text-bark-700 transition hover:bg-paper-200">
      {children}
      {!!badge && <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-bark-600 px-1 text-[11px] font-bold text-white">{badge}</span>}
    </button>
  )
}

export default function Layout() {
  const { openPanel, presentation, togglePresentation, percent, favorites } = useApp()
  const [menu, setMenu] = useState(false)
  const loc = useLocation()

  useEffect(() => { setMenu(false) }, [loc.pathname])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openPanel('search') }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [openPanel])

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:shadow-card">Негізгі мазмұнға өту</a>

      <header className="no-print sticky top-0 z-40 border-b border-paper-300/80 bg-paper-50/92 backdrop-blur">
        <div className="wrap flex h-16 items-center gap-2 sm:gap-3">
          <Link to="/" className="flex shrink-0 items-baseline gap-2" aria-label="ҚАЗАҚ — басты бет">
            <span className="font-serif text-2xl font-bold tracking-wide text-bark-700">ҚАЗАҚ</span>
            <span className="hidden truncate text-xs font-bold uppercase tracking-[.16em] text-ink-500 sm:inline">1913–1918</span>
          </Link>

          <nav aria-label="Негізгі навигация" className="ml-4 hidden flex-1 items-center gap-0.5 2xl:flex">
            {NAV.map(n => (
              <NavLink key={n.to} to={n.to} end={n.end}
                className={({ isActive }) => `whitespace-nowrap rounded-full px-3 py-2 text-[14px] font-bold transition ${isActive ? 'bg-bark-600 text-paper-50' : 'text-ink-700 hover:bg-paper-200'}`}>
                {n.label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <ToolButton onClick={() => openPanel('search')} label="Іздеу (Ctrl+K)"><span aria-hidden>⌕</span></ToolButton>
            <ToolButton onClick={() => openPanel('favorites')} label="Таңдаулылар" badge={favorites.length || undefined}><span aria-hidden>★</span></ToolButton>
            <span className="hidden sm:contents"><ToolButton onClick={() => openPanel('glossary')} label="Тарихи сөздік"><span aria-hidden className="font-serif font-bold">Аә</span></ToolButton>
            <ToolButton onClick={() => openPanel('share')} label="QR және сілтемелер"><span aria-hidden>⧉</span></ToolButton></span>
            <button type="button" onClick={togglePresentation} aria-pressed={presentation} className={`btn !min-h-[44px] !px-3 ${presentation ? 'btn-primary' : ''}`}>
              <span className="hidden 2xl:inline">Көрсету режимі</span><span className="22xl:hidden" aria-hidden>▣</span>
              <span className="sr-only 22xl:hidden">Көрсету режимі</span>
            </button>
            <button type="button" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-paper-300 bg-white text-xl text-bark-700 2xl:hidden" onClick={() => setMenu(m => !m)} aria-expanded={menu} aria-controls="mobile-menu" aria-label={menu ? 'Мәзірді жабу' : 'Мәзірді ашу'}>
              {menu ? '✕' : '☰'}
            </button>
          </div>
        </div>
        <div className="h-[3px] bg-paper-200" role="progressbar" aria-label="Зерттеу барысы" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
          <div className="h-full bg-bark-500 transition-[width] duration-500" style={{ width: `${percent}%` }} />
        </div>
        {menu && (
          <nav id="mobile-menu" aria-label="Мобильді мәзір" className="page-in border-t border-paper-300 bg-paper-50 2xl:hidden">
            <ul className="wrap grid gap-1 py-3 sm:grid-cols-2">
              {NAV.map(n => (
                <li key={n.to}>
                  <NavLink to={n.to} end={n.end} className={({ isActive }) => `block rounded-xl px-4 py-3 text-base font-bold ${isActive ? 'bg-bark-600 text-paper-50' : 'text-ink-900 hover:bg-paper-200'}`}>{n.label}</NavLink>
                </li>
              ))}
              <li className="sm:hidden"><button type="button" onClick={() => openPanel('glossary')} className="block w-full rounded-xl px-4 py-3 text-left text-base font-bold hover:bg-paper-200">Тарихи сөздік</button></li>
              <li className="sm:hidden"><button type="button" onClick={() => openPanel('share')} className="block w-full rounded-xl px-4 py-3 text-left text-base font-bold hover:bg-paper-200">QR және сілтемелер</button></li>
              <li><NavLink to="/topics" className={({ isActive }) => `block rounded-xl px-4 py-3 text-base font-bold ${isActive ? 'bg-bark-600 text-paper-50' : 'text-ink-900 hover:bg-paper-200'}`}>Газет көтерген бес мәселе</NavLink></li>
            </ul>
            <p className="wrap pb-3 text-sm text-ink-500">Зерттеу барысы: {percent}%</p>
          </nav>
        )}
      </header>

      <main id="main" className="flex-1">
        <div key={loc.pathname} className="page-in"><Outlet /></div>
      </main>

      <footer className="no-print mt-20 border-t border-paper-300 bg-paper-100/70">
        <div className="wrap grid gap-8 py-10 md:grid-cols-3">
          <div>
            <p className="font-serif text-xl font-bold text-bark-700">ҚАЗАҚ — ҰЛТТЫ ОЯТҚАН ГАЗЕТ</p>
            <p className="mt-2 text-sm text-ink-700">«Қазақ» газеті және халықтың рухани оянуы. Бағыты: «Тіл, әдебиет және ұлттық сана».</p>
          </div>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm font-bold text-ink-700">
            {NAV.map(n => <li key={n.to}><Link className="hover:text-bark-600" to={n.to}>{n.label}</Link></li>)}
            <li><Link className="hover:text-bark-600" to="/topics">Бес мәселе</Link></li>
          </ul>
          <p className="text-sm leading-relaxed text-ink-500">
            Сайт — конференцияның қосымша ресурсы, міндетті материалдарды (баяндама, презентация/постер) алмастырмайды. Жасанды интеллект құралдары қолданылды; тарихи деректер жариялау алдында тексерілуі тиіс.
          </p>
        </div>
      </footer>

      {presentation && (
        <div className="no-print fixed inset-x-0 bottom-0 z-50 border-t border-bark-600/30 bg-paper-50/95 backdrop-blur">
          <div className="wrap flex flex-wrap items-center justify-center gap-2 py-3">
            <span className="mr-2 hidden text-sm font-bold uppercase tracking-widest text-bark-500 sm:inline">Көрсету</span>
            <Link to="/archive" className="btn btn-primary">Газет</Link>
            <Link to="/lab" className="btn btn-primary">Зерттеу</Link>
            <Link to="/results" className="btn btn-primary">Қорытынды</Link>
            <Link to="/timeline" className="btn">Уақыт</Link>
            <button type="button" className="btn" onClick={togglePresentation}>Шығу</button>
          </div>
        </div>
      )}
      <Panels />
    </div>
  )
}
