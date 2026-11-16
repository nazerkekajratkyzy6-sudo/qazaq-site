import { useEffect, useRef, type ReactNode } from 'react'
import { useApp } from '../lib/app'

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] }
  return a
}

/** Нәтижені бір әрекет үшін бір рет қана жазады (қайталанған балл жоқ) */
export function useReport(id: string) {
  const { setGameBest } = useApp()
  const reported = useRef<string>('')
  return (pct: number, attemptKey: string) => {
    if (reported.current === attemptKey) return
    reported.current = attemptKey
    setGameBest(id, pct)
  }
}

export function ResultBar({ score, total, onRetry }: { score: number; total: number; onRetry: () => void }) {
  const pct = Math.round((score / total) * 100)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => { ref.current?.focus() }, [])
  return (
    <div ref={ref} tabIndex={-1} role="status" className={`mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4 outline-none ${pct >= 60 ? 'border-ok/40 bg-[#EAF0E2]' : 'border-bad/40 bg-[#F6E6E1]'}`}>
      <p className="font-serif text-xl font-bold">Нәтиже: {score} / {total} ({pct}%) {pct === 100 ? '— тамаша!' : pct >= 60 ? '— жақсы' : '— қайталап көріңіз'}</p>
      <button type="button" className="btn btn-primary" onClick={onRetry}>Қайта ойнау</button>
    </div>
  )
}

export function Note({ ok, children }: { ok: boolean; children: ReactNode }) {
  return <p className={`mt-2 rounded-lg px-3 py-2 text-sm ${ok ? 'bg-[#EAF0E2] text-ok' : 'bg-[#F6E6E1] text-bad'}`}>{children}</p>
}
