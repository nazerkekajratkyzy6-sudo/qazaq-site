import { useState } from 'react'
import { ResultBar, shuffle, useReport } from './shared'

const ITEMS = [
  { id: 'a', t: '«Қазақ» газетінің алғашқы нөмірі шықты', d: '2 ақпан 1913', o: 1 },
  { id: 'b', t: 'Бірінші дүниежүзілік соғыс басталды', d: '1914', o: 2 },
  { id: 'c', t: 'Газет аптасына екі рет шыға бастады', d: '1915', o: 3 },
  { id: 'd', t: 'Орта Азия мен Қазақстандағы көтеріліс', d: '1916', o: 4 },
  { id: 'e', t: 'Ақпан революциясы', d: '1917', o: 5 },
  { id: 'f', t: '«Қазақ» газетінің шығуы тоқтады', d: '1918', o: 6 },
]

const mk = () => { let s = shuffle(ITEMS); while (s.every((x, i) => x.o === i + 1)) s = shuffle(ITEMS); return s }

export default function Chronology() {
  const [round, setRound] = useState(0)
  const [order, setOrder] = useState(mk)
  const [sel, setSel] = useState<number | null>(null)
  const [drag, setDrag] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)
  const report = useReport('chronology')

  const swap = (i: number, j: number) => setOrder(o => { const a = [...o]; [a[i], a[j]] = [a[j], a[i]]; return a })
  const tap = (i: number) => {
    if (checked) return
    if (sel === null) setSel(i)
    else { if (sel !== i) swap(sel, i); setSel(null) }
  }
  const score = order.filter((x, i) => x.o === i + 1).length
  const check = () => { setChecked(true); report(Math.round((score / ITEMS.length) * 100), `${round}`) }
  const retry = () => { setOrder(mk()); setRound(r => r + 1); setChecked(false); setSel(null) }

  return (
    <div>
      <p className="text-ink-700">Оқиғаларды ескіден жаңаға қарай орналастырыңыз. Екі оқиғаны ретімен басып ауыстырыңыз, ▲▼ түймелерін қолданыңыз немесе сүйреңіз.</p>
      <ol className="mt-4 space-y-2">
        {order.map((x, i) => {
          const ok = x.o === i + 1
          return (
            <li key={x.id} draggable={!checked} onDragStart={() => setDrag(i)} onDragOver={e => e.preventDefault()} onDrop={() => { if (drag !== null && drag !== i) swap(drag, i); setDrag(null) }}
              className={`flex items-center gap-2 rounded-xl border p-2 ${checked ? (ok ? 'border-ok/50 bg-[#EAF0E2]' : 'border-bad/50 bg-[#F6E6E1]') : sel === i ? 'border-bark-700 bg-paper-200' : 'border-paper-300 bg-white'}`}>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-paper-200 font-bold">{i + 1}</span>
              <button type="button" onClick={() => tap(i)} aria-pressed={sel === i} className="min-h-[44px] flex-1 text-left font-bold">
                {x.t}{checked && <span className="ml-2 font-normal text-ink-500">— {x.d}</span>}
              </button>
              {!checked && (
                <span className="flex gap-1">
                  <button type="button" className="btn !min-h-[40px] !px-3" disabled={i === 0} onClick={() => swap(i, i - 1)} aria-label={`Жоғары: ${x.t}`}>▲</button>
                  <button type="button" className="btn !min-h-[40px] !px-3" disabled={i === order.length - 1} onClick={() => swap(i, i + 1)} aria-label={`Төмен: ${x.t}`}>▼</button>
                </span>
              )}
            </li>
          )
        })}
      </ol>
      {!checked ? <button type="button" className="btn btn-primary mt-4" onClick={check}>Тексеру</button> : (
        <>
          <ResultBar score={score} total={ITEMS.length} onRetry={retry} />
          <p className="mt-3 text-sm text-ink-700">Дұрыс тәртіп: {ITEMS.map(i => `${i.d}`).join(' → ')}. 1914 және 1916 жылдары — жалпы тарихи контекст оқиғалары.</p>
        </>
      )}
    </div>
  )
}
