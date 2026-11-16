import { useState } from 'react'
import { Note, ResultBar, shuffle, useReport } from './shared'

const PEOPLE = [
  { id: 'b', n: 'Ахмет Байтұрсынұлы' }, { id: 'e', n: 'Әлихан Бөкейхан' }, { id: 'd', n: 'Міржақып Дулатұлы' },
]
const ITEMS = [
  { id: '1', t: '«Қырық мысал» (1909)', a: 'b', why: 'Байтұрсынұлының бірінші кітабы.' },
  { id: '2', t: 'Төте жазу — қазақ жазуының реформасы (1912)', a: 'b', why: 'Араб жазуын қазақ тіліне лайықтаған реформа Байтұрсынұлымен байланысты.' },
  { id: '3', t: '«Бақытсыз Жамал» романы (1910)', a: 'd', why: 'Дулатұлының романы.' },
  { id: '4', t: '«Оян, қазақ!» жинағы (1909)', a: 'd', why: 'Дулатұлының өлеңдер жинағы.' },
  { id: '5', t: 'Алаш автономиясының үкіметін басқарды (1917 жылдан)', a: 'e', why: 'Бөкейхан Алаш автономиясы үкіметінің басшысы ретінде аталады.' },
  { id: '6', t: 'Қарқаралы өңірінде туған (1866)', a: 'e', why: 'Бөкейханның туған жері мен жылы.' },
]

export default function WhoseWork() {
  const [items, setItems] = useState(() => shuffle(ITEMS))
  const [map, setMap] = useState<Record<string, string>>({})
  const [sel, setSel] = useState<string | null>(null)
  const [checked, setChecked] = useState(false)
  const [round, setRound] = useState(0)
  const report = useReport('whose')
  const score = items.filter(i => map[i.id] === i.a).length

  const assign = (pid: string) => { if (sel && !checked) { setMap(m => ({ ...m, [sel]: pid })); setSel(null) } }
  const check = () => { setChecked(true); report(Math.round((score / ITEMS.length) * 100), `${round}`) }
  const retry = () => { setItems(shuffle(ITEMS)); setMap({}); setSel(null); setChecked(false); setRound(r => r + 1) }

  return (
    <div>
      <p className="text-ink-700">1) Қызметті немесе еңбекті таңдаңыз; 2) оны иесінің атын басып сәйкестендіріңіз. Қайта басу арқылы өзгертуге болады.</p>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <ul className="space-y-2" aria-label="Еңбектер">
          {items.map(i => {
            const p = PEOPLE.find(x => x.id === map[i.id])
            const ok = checked && map[i.id] === i.a
            return (
              <li key={i.id}>
                <button type="button" onClick={() => !checked && setSel(sel === i.id ? null : i.id)} aria-pressed={sel === i.id}
                  className={`w-full rounded-xl border p-3 text-left transition ${checked ? (ok ? 'border-ok/50 bg-[#EAF0E2]' : 'border-bad/50 bg-[#F6E6E1]') : sel === i.id ? 'border-bark-700 bg-paper-200' : 'border-paper-300 bg-white hover:bg-paper-100'}`}>
                  <span className="font-bold">{i.t}</span>
                  <span className="mt-1 block text-sm text-ink-500">{p ? `→ ${p.n}` : 'әлі сәйкестендірілмеген'}</span>
                  {checked && <Note ok={ok}>{ok ? 'Дұрыс. ' : `Дұрыс жауап: ${PEOPLE.find(x => x.id === i.a)?.n}. `}{i.why}</Note>}
                </button>
              </li>
            )
          })}
        </ul>
        <div className="space-y-2 md:sticky md:top-24 md:self-start" role="group" aria-label="Авторлар">
          {PEOPLE.map(p => (
            <button key={p.id} type="button" disabled={!sel || checked} onClick={() => assign(p.id)} className="btn w-full !justify-start !rounded-xl !py-3 text-left">
              {p.n}<span className="ml-auto text-xs text-ink-500">{Object.values(map).filter(v => v === p.id).length}</span>
            </button>
          ))}
          {!sel && !checked && <p className="text-sm text-ink-500">Алдымен сол жақтан бір карточканы таңдаңыз.</p>}
        </div>
      </div>
      {!checked ? <button type="button" className="btn btn-primary mt-4" disabled={Object.keys(map).length < ITEMS.length} onClick={check}>Тексеру</button> : <ResultBar score={score} total={ITEMS.length} onRetry={retry} />}
      <p className="mt-3 text-xs text-ink-500">Дәл жылдар мен атаулар сайтта «тексеру қажет» ретінде белгіленген: қорғау алдында дереккөзбен салыстырыңыз.</p>
    </div>
  )
}
