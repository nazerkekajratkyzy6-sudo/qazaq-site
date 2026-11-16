import { useState } from 'react'
import { Note, ResultBar, shuffle, useReport } from './shared'

const SOURCES = [
  { id: 's1', t: '«Қазақ», 1914, № 91 (жанама сілтеме)' },
  { id: 's2', t: '«Қазақ», 1913, № 42 (жанама сілтеме)' },
  { id: 's3', t: 'Газеттегі майданға алу туралы мақалалар (1914–1918)' },
  { id: 's4', t: '«Қазақ», 1913, № 7 — кітап дүкені жарнамасы' },
]
const MEANINGS = [
  { id: 'm1', t: 'Жергілікті жер мәселесі қоғам назарына шықты' },
  { id: 'm2', t: 'Газетті қоғамдық күшпен қолдау ұйымы құрылды' },
  { id: 'm3', t: 'Соғыс кезіндегі құқықтық мәселелер талқыланды' },
  { id: 'm4', t: 'Оқырманға кітап сатылымы туралы ақпарат берілді' },
]
const ROWS = [
  { id: 'r1', p: 'Жер мәселесі', s: 's1', m: 'm1' },
  { id: 'r2', p: 'Ұлттық бірлік', s: 's2', m: 'm2' },
  { id: 'r3', p: 'Қоғам және құқық', s: 's3', m: 'm3' },
  { id: 'r4', p: 'Білім және ағарту', s: 's4', m: 'm4' },
]

export default function Consciousness() {
  const [opts, setOpts] = useState(() => ({ s: shuffle(SOURCES), m: shuffle(MEANINGS) }))
  const [ans, setAns] = useState<Record<string, { s?: string; m?: string }>>({})
  const [checked, setChecked] = useState(false)
  const [round, setRound] = useState(0)
  const report = useReport('consciousness')
  const total = ROWS.length * 2
  const score = ROWS.reduce((a, r) => a + (ans[r.id]?.s === r.s ? 1 : 0) + (ans[r.id]?.m === r.m ? 1 : 0), 0)
  const complete = ROWS.every(r => ans[r.id]?.s && ans[r.id]?.m)

  return (
    <div>
      <p className="text-ink-700">Әр мәселеге сәйкес дереккөзді және оның қоғамдық маңызын таңдаңыз. Бұл — материал мазмұны бойынша байланыс; ықпалдың өлшемі емес.</p>
      <ul className="mt-4 space-y-4">
        {ROWS.map(r => {
          const a = ans[r.id] ?? {}
          return (
            <li key={r.id} className="rounded-xl border border-paper-300 bg-white p-4">
              <p className="font-serif text-lg font-bold text-bark-700">Мәселе: {r.p}</p>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-bold" htmlFor={`s-${r.id}`}>Дереккөз</label>
                  <select id={`s-${r.id}`} className="field" disabled={checked} value={a.s ?? ''} onChange={e => setAns(x => ({ ...x, [r.id]: { ...x[r.id], s: e.target.value } }))}>
                    <option value="">— таңдаңыз —</option>{opts.s.map(o => <option key={o.id} value={o.id}>{o.t}</option>)}
                  </select>
                  {checked && <Note ok={a.s === r.s}>{a.s === r.s ? 'Дұрыс.' : `Дұрыс: ${SOURCES.find(x => x.id === r.s)?.t}`}</Note>}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-bold" htmlFor={`m-${r.id}`}>Қоғамдық маңызы</label>
                  <select id={`m-${r.id}`} className="field" disabled={checked} value={a.m ?? ''} onChange={e => setAns(x => ({ ...x, [r.id]: { ...x[r.id], m: e.target.value } }))}>
                    <option value="">— таңдаңыз —</option>{opts.m.map(o => <option key={o.id} value={o.id}>{o.t}</option>)}
                  </select>
                  {checked && <Note ok={a.m === r.m}>{a.m === r.m ? 'Дұрыс.' : `Дұрыс: ${MEANINGS.find(x => x.id === r.m)?.t}`}</Note>}
                </div>
              </div>
            </li>
          )
        })}
      </ul>
      {!checked
        ? <button type="button" className="btn btn-primary mt-4" disabled={!complete} onClick={() => { setChecked(true); report(Math.round((score / total) * 100), `${round}`) }}>Тексеру</button>
        : <ResultBar score={score} total={total} onRetry={() => { setOpts({ s: shuffle(SOURCES), m: shuffle(MEANINGS) }); setAns({}); setChecked(false); setRound(r => r + 1) }} />}
    </div>
  )
}
