import { useState } from 'react'
import { Note, ResultBar, shuffle, useReport } from './shared'

interface Q { id: number; m: string; opts: { t: string; ok: boolean; why: string }[] }
const Qs: Q[] = [
  { id: 1, m: 'Материал: «Қазақ» газетінің алғашқы нөмірі 1913 жылы 2 ақпанда Орынборда жарық көрді.', opts: [
    { t: 'Орынборда «Қазақ» газетінің алғашқы нөмірі жарық көрді', ok: true, why: 'Тақырып материалдағы фактіні дәл және бейтарап береді.' },
    { t: '«Қазақ» бір күнде бүкіл халықты оятты', ok: false, why: 'Материалда мұндай дерек жоқ; асыра айту.' },
    { t: 'Орынборда жасырын газет шықты', ok: false, why: '«Жасырын» деген дерек материалда жоқ.' } ] },
  { id: 2, m: 'Материал: газет алғашқы жылдары аптасына бір рет, 1915 жылдан аптасына екі рет шыққан.', opts: [
    { t: '1915 жылдан «Қазақ» аптасына екі рет шыға бастады', ok: true, why: 'Дерекке дәл сәйкес.' },
    { t: 'Газет 1915 жылы күн сайын шықты', ok: false, why: 'Материалда «күн сайын» деп айтылмайды.' },
    { t: 'Газеттің таралымы 1915 жылы екі есе өсті', ok: false, why: 'Таралым туралы мұндай дерек жоқ.' } ] },
  { id: 3, m: 'Материал: газет таралымы 3000-нан 8000 данаға дейін жеткен.', opts: [
    { t: 'Таралымы 3–8 мың дана аралығында болды', ok: true, why: 'Материалдағы сандарға сәйкес.' },
    { t: 'Таралымы жүз мыңға жетті', ok: false, why: 'Сан материалға қайшы.' },
    { t: 'Газетті тек Орынборда оқыды', ok: false, why: 'Деректер басылымның Орынбордан тыс жерде де таралғанын көрсетеді.' } ] },
  { id: 4, m: 'Материал: 1914 жылғы 91-нөмірде Шыдырты болысы қазақтарын жер учаскелеріне орналастыру туралы жазылған (жанама сілтеме бойынша).', opts: [
    { t: 'Шыдырты болысындағы жер орналастыру «Қазақ» бетінде көтерілді', ok: true, why: 'Тақырып тек материал айтқанын айтады, қорытынды қоспайды.' },
    { t: 'Жер мәселесі толық шешілді', ok: false, why: 'Мұндай нәтиже туралы дерек жоқ.' },
    { t: 'Газет барлық жер дауын реттеді', ok: false, why: 'Асыра айту — бір мақала бүкіл мәселені шешпейді.' } ] },
]

export default function EditorGame() {
  const [qs, setQs] = useState(() => Qs.map(q => ({ ...q, opts: shuffle(q.opts) })))
  const [ans, setAns] = useState<Record<number, number>>({})
  const [checked, setChecked] = useState(false)
  const [round, setRound] = useState(0)
  const report = useReport('editor')
  const score = qs.filter(q => q.opts[ans[q.id]]?.ok).length

  return (
    <div>
      <p className="text-ink-700">Сіз — редакторсыз. Әр материалға тек сол материал айтқанына сүйенетін тақырыпты таңдаңыз.</p>
      <ol className="mt-4 space-y-4">
        {qs.map(q => (
          <li key={q.id} className="rounded-xl border border-paper-300 bg-white p-4">
            <p className="font-serif text-lg font-bold">{q.id}. {q.m}</p>
            <ul className="mt-3 space-y-2" role="radiogroup" aria-label={`Тақырыптар ${q.id}`}>
              {q.opts.map((o, i) => {
                const chosen = ans[q.id] === i
                return (
                  <li key={o.t}>
                    <button type="button" role="radio" aria-checked={chosen} disabled={checked} onClick={() => setAns(a => ({ ...a, [q.id]: i }))}
                      className={`w-full rounded-xl border p-3 text-left font-bold transition ${checked ? (o.ok ? 'border-ok/60 bg-[#EAF0E2]' : chosen ? 'border-bad/60 bg-[#F6E6E1]' : 'border-paper-300') : chosen ? 'border-bark-700 bg-paper-200' : 'border-paper-300 hover:bg-paper-100'}`}>
                      «{o.t}»
                    </button>
                    {checked && (chosen || o.ok) && <Note ok={o.ok}>{o.why}</Note>}
                  </li>
                )
              })}
            </ul>
          </li>
        ))}
      </ol>
      {!checked
        ? <button type="button" className="btn btn-primary mt-4" disabled={Object.keys(ans).length < qs.length} onClick={() => { setChecked(true); report(Math.round((score / qs.length) * 100), `${round}`) }}>Тексеру</button>
        : <ResultBar score={score} total={qs.length} onRetry={() => { setQs(Qs.map(q => ({ ...q, opts: shuffle(q.opts) }))); setAns({}); setChecked(false); setRound(r => r + 1) }} />}
    </div>
  )
}
