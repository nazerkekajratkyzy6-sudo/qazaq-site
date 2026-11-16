import { useState } from 'react'
import { Note, ResultBar, shuffle, useReport } from './shared'

const S = [
  { id: 1, t: '«Қазақ» газетінің алғашқы нөмірі 1913 жылы 2 ақпанда Орынборда шықты.', a: 'fact', why: 'Нақты күн мен орын — бірнеше дереккөзбен расталады.' },
  { id: 2, t: 'Газеттің таралымы 3000-нан 8000 данаға дейін жетті.', a: 'fact', why: 'Сандық дерек (зерттеу мақаласы бойынша); бірақ нақты нөмірге байланысты өзгеруі мүмкін.' },
  { id: 3, t: '«Қазақ» — қазақ баспасөзіндегі ең маңызды газет.', a: 'opinion', why: '«Ең маңызды» — баға; оны өлшеуге болмайды, дәлел қажет.' },
  { id: 4, t: '1915 жылдан бастап газет аптасына екі рет шықты.', a: 'fact', why: 'Шығу жиілігі — тексерілетін дерек.' },
  { id: 5, t: 'Газет халықтың ұлттық санасын оятты.', a: 'opinion', why: 'Бұл — тарихи интерпретация; нақты мақалалармен дәлелденуі тиіс.' },
  { id: 6, t: 'Газеттің жауапты редакторы Ахмет Байтұрсынұлы болды.', a: 'fact', why: 'Редакциялық қызмет — бірнеше дереккөзде көрсетілген.' },
  { id: 7, t: 'Газет барлық қазақ оқырманын бірден біріктірді.', a: 'opinion', why: '«Барлығын бірден» — асыра айту; дәлелсіз жалпылама.' },
  { id: 8, t: 'Газет бетінде кітап дүкендерінің жарнамасы жарияланды.', a: 'fact', why: '1913 жылғы 7-нөмірдің бетінде кітап дүкені жарнамасы көрінеді.' },
]

export default function FactOpinion() {
  const [list, setList] = useState(() => shuffle(S))
  const [ans, setAns] = useState<Record<number, string>>({})
  const [checked, setChecked] = useState(false)
  const [round, setRound] = useState(0)
  const report = useReport('factopinion')
  const score = list.filter(s => ans[s.id] === s.a).length

  return (
    <div>
      <p className="text-ink-700">Әр сөйлемді <b>дерек</b> (тексеруге болады) немесе <b>пікір/интерпретация</b> (баға, қорытынды) деп белгілеңіз.</p>
      <ul className="mt-4 space-y-3">
        {list.map(s => {
          const ok = ans[s.id] === s.a
          return (
            <li key={s.id} className={`rounded-xl border p-4 ${checked ? (ok ? 'border-ok/50 bg-[#EAF0E2]' : 'border-bad/50 bg-[#F6E6E1]') : 'border-paper-300 bg-white'}`}>
              <p className="font-bold">{s.t}</p>
              <div className="mt-2 flex gap-2" role="radiogroup" aria-label={s.t}>
                {([['fact', 'Дерек'], ['opinion', 'Пікір']] as const).map(([v, l]) => (
                  <button key={v} type="button" role="radio" aria-checked={ans[s.id] === v} disabled={checked} onClick={() => setAns(a => ({ ...a, [s.id]: v }))}
                    className={`min-h-[44px] rounded-full border px-5 font-bold ${ans[s.id] === v ? 'border-bark-700 bg-bark-600 text-white' : 'border-paper-400 bg-white hover:bg-paper-100'}`}>{l}</button>
                ))}
              </div>
              {checked && <Note ok={ok}>{ok ? 'Дұрыс. ' : `Дұрыс жауап: ${s.a === 'fact' ? 'дерек' : 'пікір'}. `}{s.why}</Note>}
            </li>
          )
        })}
      </ul>
      {!checked
        ? <button type="button" className="btn btn-primary mt-4" disabled={Object.keys(ans).length < list.length} onClick={() => { setChecked(true); report(Math.round((score / list.length) * 100), `${round}`) }}>Тексеру</button>
        : <ResultBar score={score} total={list.length} onRetry={() => { setList(shuffle(S)); setAns({}); setChecked(false); setRound(r => r + 1) }} />}
    </div>
  )
}
