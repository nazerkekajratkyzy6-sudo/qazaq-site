import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { EVENTS } from '../data/timeline'
import { docById } from '../data/documents'
import { PageHeader, SourceChips, StatusBadge, useVisit, FavButton } from '../components/ui'

const YEARS = [1913, 1914, 1915, 1916, 1917, 1918]

export default function Timeline() {
  useVisit('timeline')
  const [sp, setSp] = useSearchParams()
  const initial = Number(sp.get('year'))
  const [year, setYear] = useState<number>(YEARS.includes(initial) ? initial : 1913)
  useEffect(() => { setSp({ year: String(year) }, { replace: true }) }, [year, setSp])
  const list = useMemo(() => EVENTS.map((e, i) => ({ e, i })).filter(x => x.e.year === year), [year])

  const move = (dir: number) => setYear(y => Math.max(1913, Math.min(1918, y + dir)))

  return (
    <div className="wrap">
      <PageHeader eyebrow="Тарихи уақыт" title="Уақытқа саяхат: 1913–1918" lead="Жылды таңдаңыз: расталған оқиғалар, жалпы контекст және байланысты құжаттар ашылады. Бос жылдарға жалған оқиға қосылмайды." />

      <div role="tablist" aria-label="Жылдар" className="sticky top-[67px] z-30 -mx-4 flex gap-2 overflow-x-auto bg-paper-50/95 px-4 py-3 backdrop-blur sm:mx-0 sm:justify-between sm:px-0"
        onKeyDown={e => { if (e.key === 'ArrowRight') move(1); if (e.key === 'ArrowLeft') move(-1) }}>
        {YEARS.map(y => {
          const has = EVENTS.some(e => e.year === y)
          return (
            <button key={y} role="tab" aria-selected={year === y} onClick={() => setYear(y)}
              className={`min-h-[48px] min-w-[84px] flex-1 rounded-xl border font-serif text-xl font-bold transition ${year === y ? 'border-bark-700 bg-bark-600 text-paper-50' : 'border-paper-400 bg-white text-ink-900 hover:bg-paper-200'}`}>
              {y}{!has && <span className="sr-only"> (оқиғалар жоқ)</span>}
            </button>
          )
        })}
      </div>

      <ol className="relative mt-6 space-y-5 border-l-2 border-gold-500/50 pl-5 sm:pl-8" aria-label={`${year} жылғы оқиғалар`}>
        {list.length === 0 && (
          <li className="rounded-2xl border border-dashed border-bark-500/40 bg-paper-100 p-6 text-ink-700">
            {year} жылы үшін расталған оқиға әзірге қосылмаған. Дереккөзбен расталса, <code>src/data/timeline.ts</code> файлына қосуға болады.
          </li>
        )}
        {list.map(({ e, i }) => (
          <li key={i} className="card relative p-5 sm:p-6">
            <span className="absolute -left-[1.85rem] top-7 h-3.5 w-3.5 rounded-full border-2 border-gold-500 bg-paper-50 sm:-left-[2.55rem]" aria-hidden />
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="eyebrow">{e.date}</p>
              <div className="flex items-center gap-2"><StatusBadge s={e.status} /><FavButton id={`ev:${i}`} label={e.title} /></div>
            </div>
            <h2 className="mt-2 text-2xl font-bold">{e.title}</h2>
            <p className="mt-3 leading-relaxed text-ink-700">{e.text}</p>
            {e.docIds && (
              <p className="mt-4 flex flex-wrap gap-2">
                {e.docIds.map(id => <Link key={id} className="btn !min-h-[40px]" to={`/archive?doc=${id}`}>Құжат: {docById(id)?.title.slice(0, 40)}…</Link>)}
              </p>
            )}
            <div className="mt-4"><SourceChips ids={e.sourceIds} /></div>
          </li>
        ))}
      </ol>

      <div className="mt-8 flex justify-between">
        <button type="button" className="btn" disabled={year === 1913} onClick={() => move(-1)}>← {year - 1}</button>
        <button type="button" className="btn" disabled={year === 1918} onClick={() => move(1)}>{year + 1} →</button>
      </div>
    </div>
  )
}
