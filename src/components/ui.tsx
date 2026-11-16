import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { sourceById } from '../data/sources'
import { useApp } from '../lib/app'

export function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) { setShown(true); return }
    const fb = setTimeout(() => setShown(true), 2500)
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect() } }, { threshold: 0.12 })
    io.observe(el)
    return () => { io.disconnect(); clearTimeout(fb) }
  }, [])
  return <div ref={ref} className={`reveal ${shown ? 'in' : ''} ${className}`}>{children}</div>
}

export function PageHeader({ eyebrow, title, lead }: { eyebrow: string; title: string; lead?: string }) {
  return (
    <header className="page-in pb-6 pt-10 sm:pt-14">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-2 text-3xl font-bold leading-tight sm:text-5xl">{title}</h1>
      {lead && <p className="mt-4 max-w-3xl text-lg leading-relaxed text-ink-700">{lead}</p>}
      <div className="rule mt-8" />
    </header>
  )
}

export function Img({ src, alt, className = '', style }: { src: string; alt: string; className?: string; style?: React.CSSProperties }) {
  const [bad, setBad] = useState(false)
  if (bad) {
    return <div role="img" aria-label={alt} className={`flex items-center justify-center bg-paper-200 p-4 text-center text-sm text-ink-500 ${className}`}>Сурет қолжетімсіз</div>
  }
  return <img src={src} alt={alt} loading="lazy" decoding="async" onError={() => setBad(true)} className={className} style={style} />
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-bark-500/40 bg-paper-100/70 p-6 text-center">
      <p className="font-serif text-lg font-bold text-bark-700">{title}</p>
      {children && <div className="mt-2 text-sm text-ink-700">{children}</div>}
    </div>
  )
}

export function SourceChips({ ids }: { ids: string[] }) {
  if (!ids.length) return <span className="chip">Дереккөз нақтылануда</span>
  return (
    <span className="flex flex-wrap gap-2">
      {ids.map(id => {
        const s = sourceById(id)
        if (!s) return null
        return (
          <Link key={id} to={`/sources#${id}`} className="chip hover:bg-paper-200" title={s.title}>
            {s.kind === 'primary' ? '◆ ' : '▫ '}{s.author.split(/[,(]/)[0].trim().slice(0, 30)}{s.year !== '—' ? ` · ${s.year}` : ''}
          </Link>
        )
      })}
    </span>
  )
}

export function StatusBadge({ s }: { s: 'verified' | 'context' | 'disputed' }) {
  const map = {
    verified: ['Дереккөзбен расталған', 'bg-[#E7EEDD] text-ok border-ok/30'],
    context: ['Жалпы контекст — нақтылау керек', 'bg-paper-200 text-bark-700 border-bark-500/30'],
    disputed: ['Дереккөздер сәйкес емес', 'bg-[#F4E1DC] text-bad border-bad/30'],
  } as const
  return <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${map[s][1]}`}>{map[s][0]}</span>
}

export function FavButton({ id, label }: { id: string; label: string }) {
  const { isFav, toggleFav } = useApp()
  const on = isFav(id)
  return (
    <button type="button" onClick={() => toggleFav(id)} aria-pressed={on} aria-label={`${on ? 'Таңдаулыдан алу' : 'Таңдаулыға қосу'}: ${label}`} className="btn btn-quiet !min-h-[40px] !px-3">
      <span aria-hidden className="text-lg leading-none">{on ? '★' : '☆'}</span>
      <span className="hidden sm:inline">{on ? 'Таңдаулыда' : 'Таңдаулыға'}</span>
    </button>
  )
}

export function Tabs<T extends string>({ tabs, value, onChange, label }: { tabs: { id: T; label: string }[]; value: T; onChange: (t: T) => void; label: string }) {
  return (
    <div role="tablist" aria-label={label} className="flex flex-wrap gap-2">
      {tabs.map(t => (
        <button key={t.id} role="tab" id={`tab-${t.id}`} aria-selected={value === t.id} aria-controls={`panel-${t.id}`} type="button"
          onClick={() => onChange(t.id)}
          className={`min-h-[44px] rounded-full border px-5 text-[15px] font-bold transition ${value === t.id ? 'border-bark-700 bg-bark-600 text-paper-50' : 'border-paper-400 bg-white text-ink-700 hover:bg-paper-200'}`}>
          {t.label}
        </button>
      ))}
    </div>
  )
}

export function useVisit(id: string) {
  const { markVisited } = useApp()
  useEffect(() => { markVisited(id); window.scrollTo({ top: 0 }) }, [id, markVisited])
}
