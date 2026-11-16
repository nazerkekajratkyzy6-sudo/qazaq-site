import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'

interface Props {
  src: string
  alt: string
  /** сурет үстіне салынатын қабат (аннотациялар) — сурет өлшеміне пропорционал */
  overlay?: ReactNode
}

const MIN = 1
const MAX = 6

export default function ZoomPan({ src, alt, overlay }: Props) {
  const box = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [full, setFull] = useState(false)
  const [failed, setFailed] = useState(false)
  const pointers = useRef(new Map<number, { x: number; y: number }>())
  const last = useRef<{ d?: number; x?: number; y?: number }>({})

  const clamp = useCallback((s: number, p: { x: number; y: number }) => {
    const el = box.current
    if (!el) return p
    const maxX = ((s - 1) * el.clientWidth) / 2
    const maxY = ((s - 1) * el.clientHeight) / 2
    return { x: Math.max(-maxX, Math.min(maxX, p.x)), y: Math.max(-maxY, Math.min(maxY, p.y)) }
  }, [])

  const zoomTo = useCallback((next: number) => {
    const s = Math.max(MIN, Math.min(MAX, next))
    setScale(s)
    setPos(p => (s === 1 ? { x: 0, y: 0 } : clamp(s, p)))
  }, [clamp])

  const reset = () => { setScale(1); setPos({ x: 0, y: 0 }) }

  useEffect(() => { reset() }, [src])
  useEffect(() => {
    const onFs = () => setFull(document.fullscreenElement === box.current?.parentElement)
    document.addEventListener('fullscreenchange', onFs)
    return () => document.removeEventListener('fullscreenchange', onFs)
  }, [])

  // wheel тыңдаушысы — passive емес болуы керек
  useEffect(() => {
    const el = box.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey && scale === 1) return // бетті айналдыруға рұқсат
      e.preventDefault()
      zoomTo(scale * (e.deltaY < 0 ? 1.15 : 1 / 1.15))
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [scale, zoomTo])

  const onDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button')) return
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    last.current = { x: e.clientX, y: e.clientY }
    ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
  }
  const onMove = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    const pts = [...pointers.current.values()]
    if (pts.length === 2) {
      const d = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y)
      if (last.current.d) zoomTo(scale * (d / last.current.d))
      last.current.d = d
    } else if (scale > 1 && last.current.x !== undefined) {
      const dx = e.clientX - last.current.x!, dy = e.clientY - (last.current.y ?? e.clientY)
      setPos(p => clamp(scale, { x: p.x + dx, y: p.y + dy }))
      last.current = { x: e.clientX, y: e.clientY }
    }
  }
  const onUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId)
    last.current = { x: e.clientX, y: e.clientY }
  }

  const onKey = (e: React.KeyboardEvent) => {
    const step = 40
    if (e.key === '+' || e.key === '=') zoomTo(scale * 1.25)
    else if (e.key === '-') zoomTo(scale / 1.25)
    else if (e.key === '0') reset()
    else if (e.key === 'ArrowLeft') setPos(p => clamp(scale, { ...p, x: p.x + step }))
    else if (e.key === 'ArrowRight') setPos(p => clamp(scale, { ...p, x: p.x - step }))
    else if (e.key === 'ArrowUp') setPos(p => clamp(scale, { ...p, y: p.y + step }))
    else if (e.key === 'ArrowDown') setPos(p => clamp(scale, { ...p, y: p.y - step }))
    else return
    e.preventDefault()
  }

  const toggleFull = async () => {
    const host = box.current?.parentElement
    if (!host) return
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
      else await host.requestFullscreen()
    } catch { /* толық экран қолдау таппады */ }
  }
  const fsSupported = typeof document !== 'undefined' && !!document.documentElement.requestFullscreen

  return (
    <div className={`relative rounded-2xl border border-paper-300 bg-paper-200 p-2 sm:p-3 ${full ? 'flex flex-col !rounded-none bg-paper-100' : ''}`}>
      <div className="no-print mb-2 flex flex-wrap items-center gap-2">
        <button type="button" className="btn !min-h-[40px] !px-4" onClick={() => zoomTo(scale / 1.25)} aria-label="Кішірейту" disabled={scale <= MIN}>−</button>
        <span className="min-w-[3.5rem] text-center text-sm font-bold tabular-nums" aria-live="polite">{Math.round(scale * 100)}%</span>
        <button type="button" className="btn !min-h-[40px] !px-4" onClick={() => zoomTo(scale * 1.25)} aria-label="Үлкейту" disabled={scale >= MAX}>+</button>
        <button type="button" className="btn !min-h-[40px]" onClick={reset} disabled={scale === 1 && pos.x === 0}>Бастапқы өлшем</button>
        {fsSupported && <button type="button" className="btn !min-h-[40px]" onClick={toggleFull}>{full ? 'Толық экраннан шығу' : 'Толық экран'}</button>}
        <span className="ml-auto hidden text-xs text-ink-500 md:inline">Сүйреңіз · екі саусақпен үлкейтіңіз · + / − / 0 / ← ↑ → ↓</span>
      </div>
      <div
        ref={box}
        tabIndex={0}
        role="group"
        aria-label={`${alt}. Үлкейту және жылжыту мүмкін`}
        onKeyDown={onKey}
        onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
        onDoubleClick={() => (scale > 1 ? reset() : zoomTo(2.5))}
        className={`relative overflow-hidden rounded-xl bg-white ${scale > 1 ? 'cursor-grab active:cursor-grabbing' : ''} ${full ? 'flex-1' : ''}`}
        style={{ touchAction: scale > 1 ? 'none' : 'pan-y' }}
      >
        <div
          className="relative mx-auto w-full origin-center will-change-transform"
          style={{ transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`, transition: pointers.current.size ? 'none' : 'transform .15s ease-out', maxWidth: full ? '90vh' : undefined }}
        >
          {failed ? (
            <div className="flex aspect-[4/3] items-center justify-center bg-paper-100 text-ink-500">Сурет жүктелмеді</div>
          ) : (
            <img src={src} alt={alt} draggable={false} onError={() => setFailed(true)} className="block h-auto w-full select-none" />
          )}
          {overlay && <div className="absolute inset-0">{overlay}</div>}
        </div>
      </div>
    </div>
  )
}
