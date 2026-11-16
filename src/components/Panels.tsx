import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import QRCode from 'qrcode'
import { useApp } from '../lib/app'
import { INDEX, search } from '../lib/search'
import { GLOSSARY } from '../data/glossary'
import { SourceChips } from './ui'
import { useLocalStorage } from '../lib/storage'

function Sheet({ title, onClose, children, wide }: { title: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null
    ref.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab' && ref.current) {
        const f = ref.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input,textarea,select,[tabindex]:not([tabindex="-1"])')
        if (!f.length) return
        const first = f[0], last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; prev?.focus() }
  }, [onClose])
  return (
    <div className="no-print fixed inset-0 z-[60] flex items-end justify-center bg-ink-900/35 p-0 sm:items-start sm:p-6 sm:pt-20" onMouseDown={e => { if (e.target === e.currentTarget) onClose() }}>
      <div ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-label={title}
        className={`page-in flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-3xl border border-paper-300 bg-paper-50 shadow-2xl outline-none sm:rounded-3xl ${wide ? 'max-w-3xl' : 'max-w-2xl'}`}>
        <div className="flex items-center justify-between gap-3 border-b border-paper-300 px-5 py-4">
          <h2 className="font-serif text-xl font-bold">{title}</h2>
          <button type="button" onClick={onClose} className="btn !min-h-[40px] !px-4" aria-label="Жабу">✕</button>
        </div>
        <div className="overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  )
}

function SearchSheet() {
  const { closePanel, openPanel } = useApp()
  const nav = useNavigate()
  const [q, setQ] = useState('')
  const hits = useMemo(() => search(q), [q])
  const go = (to: string, type: string) => {
    if (type === 'Сөздік') { openPanel('glossary'); return }
    closePanel(); nav(to)
  }
  return (
    <Sheet title="Іздеу" onClose={closePanel}>
      <label htmlFor="q" className="sr-only">Іздеу сұранысы</label>
      <input id="q" autoFocus className="field" value={q} onChange={e => setQ(e.target.value)} placeholder="Мысалы: Орынбор, жер, төте жазу…" />
      <p className="mt-2 text-xs text-ink-500">Тек сайтқа жүктелген материалдардан ({INDEX.length} жазба) іздейді.</p>
      <ul className="mt-4 space-y-2">
        {hits.map(h => (
          <li key={h.id}>
            <button type="button" onClick={() => go(h.to, h.type)} className="w-full rounded-xl border border-paper-300 bg-white p-3 text-left hover:bg-paper-100">
              <span className="chip mr-2">{h.type}</span><span className="font-bold">{h.title}</span>
              <span className="mt-1 line-clamp-2 block text-sm text-ink-500">{h.text}</span>
            </button>
          </li>
        ))}
        {q.trim().length >= 2 && !hits.length && <li className="rounded-xl border border-dashed border-paper-400 p-4 text-center text-ink-500">Ештеңе табылмады. Басқа сөзбен іздеп көріңіз.</li>}
      </ul>
    </Sheet>
  )
}

function FavoritesSheet() {
  const { closePanel, favorites, toggleFav } = useApp()
  const items = favorites.map(id => INDEX.find(h => h.id === id)).filter(Boolean)
  return (
    <Sheet title="Таңдаулылар" onClose={closePanel}>
      {!items.length ? (
        <p className="rounded-xl border border-dashed border-paper-400 p-5 text-center text-ink-700">Әзірге бос. Мұрағат құжаттарындағы немесе мәселелер бетіндегі ☆ белгісін басыңыз.</p>
      ) : (
        <ul className="space-y-2">
          {items.map(h => h && (
            <li key={h.id} className="flex items-center gap-2 rounded-xl border border-paper-300 bg-white p-3">
              <Link to={h.to} onClick={closePanel} className="flex-1 font-bold hover:text-bark-600"><span className="chip mr-2">{h.type}</span>{h.title}</Link>
              <button type="button" className="btn btn-quiet !min-h-[40px] !px-3" onClick={() => toggleFav(h.id)} aria-label={`Таңдаулыдан алу: ${h.title}`}>★</button>
            </li>
          ))}
        </ul>
      )}
    </Sheet>
  )
}

function GlossarySheet() {
  const { closePanel } = useApp()
  const [f, setF] = useState('')
  const list = GLOSSARY.filter(g => (g.term + g.def).toLocaleLowerCase('kk').includes(f.toLocaleLowerCase('kk')))
  return (
    <Sheet title="Тарихи сөздік" onClose={closePanel}>
      <label htmlFor="gf" className="sr-only">Сөздіктен іздеу</label>
      <input id="gf" className="field" placeholder="Терминді іздеу…" value={f} onChange={e => setF(e.target.value)} />
      <dl className="mt-4 space-y-3">
        {list.map(g => (
          <div key={g.term} className="rounded-xl border border-paper-300 bg-white p-4">
            <dt className="font-serif text-lg font-bold text-bark-700">{g.term}</dt>
            <dd className="mt-1 text-ink-700">{g.def}</dd>
            <dd className="mt-2"><SourceChips ids={g.sourceIds} /></dd>
          </div>
        ))}
        {!list.length && <p className="text-center text-ink-500">Термин табылмады.</p>}
      </dl>
    </Sheet>
  )
}

const TARGETS = [
  { path: '/', label: 'Басты бет' },
  { path: '/archive', label: 'Газет мұрағаты' },
  { path: '/lab', label: 'Зерттеу зертханасы' },
  { path: '/games', label: 'Интерактивті тапсырмалар' },
  { path: '/results', label: 'Зерттеу нәтижесі' },
]

function ShareSheet() {
  const { closePanel } = useApp()
  const envUrl = (import.meta.env.VITE_SITE_URL as string | undefined) ?? ''
  const [siteUrl, setSiteUrl] = useLocalStorage<string>('siteUrl', envUrl)
  const [qr, setQr] = useState('')
  const [copied, setCopied] = useState('')
  const valid = /^https?:\/\/[^\s]+\.[^\s]+/.test(siteUrl.trim())
  const base = siteUrl.trim().replace(/\/$/, '')
  const isLocal = /^(localhost|127\.|192\.168\.)/.test(window.location.hostname)

  useEffect(() => {
    if (!valid) { setQr(''); return }
    QRCode.toDataURL(base + '/#/', { width: 520, margin: 2, color: { dark: '#2A2521', light: '#FDFBF6' } }).then(setQr).catch(() => setQr(''))
  }, [valid, base])

  const copy = async (text: string, key: string) => {
    try { await navigator.clipboard.writeText(text) }
    catch {
      const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select()
      try { document.execCommand('copy') } catch { /* қолдау жоқ */ }
      ta.remove()
    }
    setCopied(key); setTimeout(() => setCopied(''), 1800)
  }

  return (
    <Sheet title="QR және сілтемелер" onClose={closePanel} wide>
      <div className="space-y-5">
        <div>
          <p className="mb-2 font-bold">Осы беттің сілтемесі</p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input readOnly className="field" value={window.location.href} onFocus={e => e.currentTarget.select()} aria-label="Ағымдағы бет сілтемесі" />
            <button type="button" className="btn btn-primary shrink-0" onClick={() => copy(window.location.href, 'cur')}>{copied === 'cur' ? 'Көшірілді ✓' : 'Көшіру'}</button>
          </div>
          {isLocal && <p className="mt-2 text-sm text-bad">Бұл — жергілікті мекенжай; басқа құрылғыда ашылмайды. Сайтты жариялағаннан кейін жаңа сілтемені көшіріңіз.</p>}
        </div>

        <div className="rule" />

        <div>
          <label htmlFor="site" className="mb-2 block font-bold">Жарияланған сайт мекенжайы (Vercel)</label>
          <input id="site" className="field" value={siteUrl} onChange={e => setSiteUrl(e.target.value)} placeholder="https://сіздің-сайт.vercel.app" inputMode="url" />
          <p className="mt-2 text-sm text-ink-500">Сайт жарияланғанға дейін QR жасалмайды — жалған мекенжай қойылмайды.</p>
        </div>

        {!valid ? (
          <div className="rounded-xl border border-dashed border-bark-500/40 bg-paper-100 p-5 text-center text-ink-700">Мекенжайды енгізгеннен кейін QR-код және тікелей сілтемелер осы жерде пайда болады.</div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-[220px_1fr]">
            <div className="text-center">
              {qr && <img src={qr} alt={`QR-код: ${base}`} className="mx-auto w-full max-w-[220px] rounded-xl border border-paper-300" />}
              {qr && <a href={qr} download="qazaq-qr.png" className="btn mt-3 w-full">QR жүктеу (PNG)</a>}
            </div>
            <ul className="space-y-2">
              {TARGETS.map(t => {
                const link = `${base}/#${t.path}`
                return (
                  <li key={t.path} className="flex items-center gap-2 rounded-xl border border-paper-300 bg-white p-3">
                    <div className="min-w-0 flex-1"><p className="font-bold">{t.label}</p><p className="truncate text-xs text-ink-500">{link}</p></div>
                    <button type="button" className="btn !min-h-[40px] !px-4" onClick={() => copy(link, t.path)}>{copied === t.path ? '✓' : 'Көшіру'}</button>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>
    </Sheet>
  )
}

export default function Panels() {
  const { panel } = useApp()
  if (panel === 'search') return <SearchSheet />
  if (panel === 'favorites') return <FavoritesSheet />
  if (panel === 'glossary') return <GlossarySheet />
  if (panel === 'share') return <ShareSheet />
  return null
}
