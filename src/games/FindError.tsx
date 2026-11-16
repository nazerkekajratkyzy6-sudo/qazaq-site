import { useState } from 'react'
import { Note, ResultBar, useReport } from './shared'

const S = [
  { t: '«Қазақ» газеті Орынборда шығып тұрды.', wrong: false },
  { t: 'Газеттің алғашқы нөмірі 1913 жылы 2 ақпанда жарық көрді.', wrong: false },
  { t: 'Газеттің жауапты редакторы Міржақып Дулатұлы болды.', wrong: true, fix: 'Жауапты редактор — Ахмет Байтұрсынұлы; Дулатұлы газетті басқарушылардың бірі.' },
  { t: 'Газет латын әрпімен басылды.', wrong: true, fix: 'Газет араб жазуымен, төте жазу емлесімен басылды.' },
  { t: '1915 жылдан бастап газет аптасына екі рет шықты.', wrong: false },
  { t: '«Қазақ» және «Сары Арқа» — бір газеттің екі атауы.', wrong: true, fix: 'Бұл екі бөлек басылым (Қазақ — 1913–1918, Сары Арқа — 1917–1919 деп көрсетіледі).' },
]

export default function FindError() {
  const [sel, setSel] = useState<Set<number>>(new Set())
  const [checked, setChecked] = useState(false)
  const [round, setRound] = useState(0)
  const report = useReport('finderror')
  const total = S.filter(s => s.wrong).length
  const hits = S.filter((s, i) => s.wrong && sel.has(i)).length
  const falses = S.filter((s, i) => !s.wrong && sel.has(i)).length
  const score = Math.max(0, hits - falses)

  const toggle = (i: number) => { if (checked) return; setSel(p => { const n = new Set(p); n.has(i) ? n.delete(i) : n.add(i); return n }) }

  return (
    <div>
      <p className="text-ink-700">Мәтінде {total} қате бар. Қате деп ойлаған сөйлемдерді басып белгілеңіз (қате белгілеу балды азайтады).</p>
      <ol className="mt-4 space-y-2 rounded-2xl border border-paper-300 bg-white p-3 sm:p-5">
        {S.map((s, i) => {
          const on = sel.has(i)
          return (
            <li key={i}>
              <button type="button" aria-pressed={on} onClick={() => toggle(i)}
                className={`w-full rounded-lg border px-3 py-3 text-left transition ${checked ? (s.wrong ? 'border-ok/60 bg-[#EAF0E2]' : on ? 'border-bad/60 bg-[#F6E6E1]' : 'border-transparent') : on ? 'border-bark-700 bg-paper-200 underline decoration-wavy decoration-bark-500' : 'border-transparent hover:bg-paper-100'}`}>
                <span className="mr-2 font-bold text-bark-600">{i + 1}.</span>{s.t}
              </button>
              {checked && s.wrong && <Note ok={on}>{on ? 'Дұрыс таптыңыз. ' : 'Бұл қате болатын. '}{s.fix}</Note>}
              {checked && !s.wrong && on && <Note ok={false}>Бұл сөйлем дұрыс болатын.</Note>}
            </li>
          )
        })}
      </ol>
      {!checked
        ? <button type="button" className="btn btn-primary mt-4" disabled={sel.size === 0} onClick={() => { setChecked(true); report(Math.round((score / total) * 100), `${round}`) }}>Тексеру</button>
        : <ResultBar score={score} total={total} onRetry={() => { setSel(new Set()); setChecked(false); setRound(r => r + 1) }} />}
    </div>
  )
}
