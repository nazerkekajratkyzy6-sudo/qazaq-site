import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader, useVisit, Tabs } from '../components/ui'
import { useLocalStorage } from '../lib/storage'
import { useApp } from '../lib/app'
import { SOURCES } from '../data/sources'

interface Draft {
  author: string; date: string; theme: string; problem: string
  problemText: string
  evidenceType: 'fact' | 'quote' | ''
  evidence: string; evidenceSource: string
  conclusion: string; impact: string
  rubric: Record<string, number>
  name: string
}
const EMPTY: Draft = { author: '', date: '', theme: '', problem: '', problemText: '', evidenceType: '', evidence: '', evidenceSource: '', conclusion: '', impact: '', rubric: {}, name: '' }

const RUBRIC = [
  ['source', 'Дереккөзді дұрыс көрсеттім (нөмір, күні, автор немесе «белгісіз»)'],
  ['problem', 'Мәселені өз сөзіммен нақты тұжырымдадым'],
  ['evidence', 'Дәлелім тексерілетін факт немесе дәл дәйексөз'],
  ['logic', 'Қорытынды дәлелден шығады, асыра айтпадым'],
  ['limits', 'Қорытындымның шектеуін (бір мақала ғана) атадым'],
] as const

const STEPS = [
  { id: 's1', title: 'Дерекпен танысу' },
  { id: 's2', title: 'Мәселені анықтау' },
  { id: 's3', title: 'Дәлел келтіру' },
  { id: 's4', title: 'Қорытынды жасау' },
] as const

type Mode = 'steps' | 'sheet'

export default function Lab() {
  useVisit('lab')
  const { setLabStep } = useApp()
  const [d, setD, resetDraft] = useLocalStorage<Draft>('lab-draft', EMPTY)
  const [step, setStep] = useState(0)
  const [mode, setMode] = useState<Mode>('steps')
  const [saved, setSaved] = useState(false)

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD(x => ({ ...x, [k]: v }))

  const done = {
    s1: !!(d.theme.trim() && d.date.trim() && d.author.trim()),
    s2: d.problemText.trim().length >= 20,
    s3: !!(d.evidenceType && d.evidence.trim().length >= 10 && d.evidenceSource.trim()),
    s4: d.conclusion.trim().length >= 40,
  }
  useEffect(() => { (['s1', 's2', 's3', 's4'] as const).forEach(k => setLabStep(k, done[k])) })
  useEffect(() => { setSaved(true); const t = setTimeout(() => setSaved(false), 1500); return () => clearTimeout(t) }, [d])

  const count = Object.values(done).filter(Boolean).length
  const rubricSum = Object.values(d.rubric).reduce((a, b) => a + b, 0)

  const clear = () => { if (window.confirm('Барлық жазбаларды өшіру керек пе?')) { resetDraft(); setStep(0) } }

  return (
    <div className="wrap">
      <PageHeader eyebrow="Зерттеу зертханасы" title="Дерек → дәлел → қорытынды" lead="Төрт қадам. Жазбалар осы құрылғыда автоматты түрде сақталады (тіркелу қажет емес)." />

      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
        <Tabs<Mode> label="Режим" value={mode} onChange={setMode} tabs={[{ id: 'steps', label: 'Қадамдар' }, { id: 'sheet', label: 'Зерттеу парағы' }]} />
        <p className="text-sm font-bold text-ink-500" aria-live="polite">{saved ? 'Сақталды ✓' : `Аяқталған қадам: ${count} / 4`}</p>
      </div>

      {mode === 'steps' && (
        <div className="no-print">
          <ol className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {STEPS.map((s, i) => (
              <li key={s.id}>
                <button type="button" onClick={() => setStep(i)} aria-current={step === i ? 'step' : undefined}
                  className={`w-full rounded-xl border p-3 text-left transition ${step === i ? 'border-bark-700 bg-bark-600 text-paper-50' : 'border-paper-300 bg-white hover:bg-paper-100'}`}>
                  <span className="font-serif text-xl font-bold">{i + 1} {done[s.id] && '✓'}</span>
                  <span className="block text-sm font-bold">{s.title}</span>
                </button>
              </li>
            ))}
          </ol>

          <section className="card p-6 sm:p-8" aria-label={STEPS[step].title}>
            <h2 className="text-2xl font-bold">{step + 1}. {STEPS[step].title}</h2>
            {step === 0 && (
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <p className="text-ink-700 sm:col-span-2">Газет материалын таңдап, деректемесін жазыңыз. Білмесеңіз — «белгісіз» деп жазыңыз, болжамай.</p>
                <div><label className="mb-1 block font-bold" htmlFor="author">Автор</label><input id="author" className="field" value={d.author} onChange={e => set('author', e.target.value)} placeholder="Автор немесе «белгісіз»" /></div>
                <div><label className="mb-1 block font-bold" htmlFor="date">Күні және нөмірі</label><input id="date" className="field" value={d.date} onChange={e => set('date', e.target.value)} placeholder="Мысалы: 1914, № 91" /></div>
                <div><label className="mb-1 block font-bold" htmlFor="theme">Тақырыбы</label><input id="theme" className="field" value={d.theme} onChange={e => set('theme', e.target.value)} placeholder="Материал тақырыбы" /></div>
                <div><label className="mb-1 block font-bold" htmlFor="problem">Көтерілген мәселе (қысқаша)</label><input id="problem" className="field" value={d.problem} onChange={e => set('problem', e.target.value)} placeholder="Мысалы: жер орналастыру" /></div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block font-bold" htmlFor="srcpick">Дереккөзді тізімнен таңдау (міндетті емес)</label>
                  <select id="srcpick" className="field" value="" onChange={e => { const s = SOURCES.find(x => x.id === e.target.value); if (s) set('evidenceSource', `${s.author}. ${s.title}. ${s.publisher}, ${s.year}`) }}>
                    <option value="">— таңдаңыз —</option>
                    {SOURCES.filter(s => s.kind !== 'reference').map(s => <option key={s.id} value={s.id}>{s.title.slice(0, 90)}</option>)}
                  </select>
                  <p className="mt-1 text-sm text-ink-500">Таңдаған дереккөз 3-қадамдағы «Дереккөз» өрісіне түседі.</p>
                </div>
              </div>
            )}
            {step === 1 && (
              <div className="mt-5">
                <label className="mb-1 block font-bold" htmlFor="pt">Мәселені өз сөзіңізбен тұжырымдаңыз</label>
                <textarea id="pt" rows={6} className="field" value={d.problemText} onChange={e => set('problemText', e.target.value)} placeholder="Автор қандай мәселені көтеріп отыр? Кімге қатысты? Неге маңызды?" />
                <p className="mt-1 text-sm text-ink-500">{d.problemText.trim().length} таңба (кемінде 20)</p>
              </div>
            )}
            {step === 2 && (
              <div className="mt-5 grid gap-4">
                <fieldset>
                  <legend className="mb-2 font-bold">Дәлел түрі</legend>
                  <div className="flex flex-wrap gap-3">
                    {([['fact', 'Факт'], ['quote', 'Тексерілген дәйексөз']] as const).map(([v, l]) => (
                      <label key={v} className={`flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full border px-4 font-bold ${d.evidenceType === v ? 'border-bark-700 bg-paper-200' : 'border-paper-300 bg-white'}`}>
                        <input type="radio" name="et" className="accent-[#8A5A33]" checked={d.evidenceType === v} onChange={() => set('evidenceType', v)} />{l}
                      </label>
                    ))}
                  </div>
                </fieldset>
                <div><label className="mb-1 block font-bold" htmlFor="ev">Дәлел</label><textarea id="ev" rows={4} className="field" value={d.evidence} onChange={e => set('evidence', e.target.value)} placeholder="Түпнұсқадан тексеріп жазылған факт немесе дәл дәйексөз" /></div>
                <div><label className="mb-1 block font-bold" htmlFor="es">Дереккөз</label><input id="es" className="field" value={d.evidenceSource} onChange={e => set('evidenceSource', e.target.value)} placeholder="Автор, атауы, нөмірі, күні, бет" /></div>
              </div>
            )}
            {step === 3 && (
              <div className="mt-5 grid gap-4">
                <div><label className="mb-1 block font-bold" htmlFor="im">Жарияланымның ұлттық санаға ықпалы (сіздің бағаңыз)</label><textarea id="im" rows={3} className="field" value={d.impact} onChange={e => set('impact', e.target.value)} placeholder="Қандай ықпал болуы мүмкін? Оны не дәлелдейді?" /></div>
                <div><label className="mb-1 block font-bold" htmlFor="cc">Қорытынды</label><textarea id="cc" rows={5} className="field" value={d.conclusion} onChange={e => set('conclusion', e.target.value)} placeholder="Дәлелге сүйеніп, шектеулерді атап жазыңыз." />
                  <p className="mt-1 text-sm text-ink-500">{d.conclusion.trim().length} таңба (кемінде 40)</p></div>
              </div>
            )}
          </section>

          <div className="mt-4 flex justify-between">
            <button type="button" className="btn" disabled={step === 0} onClick={() => setStep(s => s - 1)}>← Артқа</button>
            {step < 3 ? <button type="button" className="btn btn-primary" onClick={() => setStep(s => s + 1)}>Келесі →</button> : <button type="button" className="btn btn-primary" onClick={() => setMode('sheet')}>Зерттеу парағын ашу</button>}
          </div>
        </div>
      )}

      {mode === 'sheet' && (
        <div>
          <article className="card p-6 sm:p-10" id="sheet">
            <p className="eyebrow">Зерттеу парағы</p>
            <h2 className="mt-1 text-3xl font-bold">«Қазақ» газеті: дерек → қорытынды</h2>
            <div className="no-print mt-4"><label htmlFor="nm" className="mb-1 block font-bold">Оқушының аты-жөні</label><input id="nm" className="field max-w-md" value={d.name} onChange={e => set('name', e.target.value)} /></div>
            {d.name && <p className="print-only mt-2 font-bold">Оқушы: {d.name}</p>}
            <dl className="mt-6 grid gap-5 sm:grid-cols-2">
              {([
                ['Автор', d.author], ['Күні, нөмірі', d.date], ['Тақырып', d.theme], ['Көтерілген мәселе', d.problem],
              ] as const).map(([k, v]) => <div key={k}><dt className="text-sm font-bold uppercase tracking-wider text-bark-500">{k}</dt><dd className="mt-1 border-b border-paper-300 pb-1">{v || <span className="text-ink-300">толтырылмаған</span>}</dd></div>)}
              <div className="sm:col-span-2"><dt className="text-sm font-bold uppercase tracking-wider text-bark-500">Мәселе (өз сөзімен)</dt><dd className="mt-1 whitespace-pre-line">{d.problemText || <span className="text-ink-300">толтырылмаған</span>}</dd></div>
              <div className="sm:col-span-2"><dt className="text-sm font-bold uppercase tracking-wider text-bark-500">Дәлел ({d.evidenceType === 'quote' ? 'дәйексөз' : d.evidenceType === 'fact' ? 'факт' : 'түрі таңдалмаған'})</dt><dd className="mt-1 whitespace-pre-line">{d.evidence || <span className="text-ink-300">толтырылмаған</span>}</dd><dd className="mt-1 text-sm text-ink-500">{d.evidenceSource}</dd></div>
              <div className="sm:col-span-2"><dt className="text-sm font-bold uppercase tracking-wider text-bark-500">Ұлттық санаға ықпалы</dt><dd className="mt-1 whitespace-pre-line">{d.impact || <span className="text-ink-300">толтырылмаған</span>}</dd></div>
              <div className="sm:col-span-2"><dt className="text-sm font-bold uppercase tracking-wider text-bark-500">Қорытынды</dt><dd className="mt-1 whitespace-pre-line">{d.conclusion || <span className="text-ink-300">толтырылмаған</span>}</dd></div>
            </dl>

            <div className="mt-8">
              <h3 className="text-xl font-bold">Өзін-өзі бағалау рубрикасы</h3>
              <p className="mt-1 text-sm text-ink-500">Ашық жауап автоматты «дұрыс/бұрыс» деп тексерілмейді. Әр критерийді 0–2 балмен өзіңіз бағалаңыз (0 — жоқ, 1 — ішінара, 2 — толық).</p>
              <ul className="mt-3 space-y-2">
                {RUBRIC.map(([k, l]) => (
                  <li key={k} className="flex flex-col gap-2 rounded-xl border border-paper-300 bg-paper-100/60 p-3 sm:flex-row sm:items-center sm:justify-between">
                    <span>{l}</span>
                    <span className="flex gap-1" role="radiogroup" aria-label={l}>
                      {[0, 1, 2].map(v => (
                        <button key={v} type="button" role="radio" aria-checked={d.rubric[k] === v} onClick={() => set('rubric', { ...d.rubric, [k]: v })}
                          className={`no-print-btn h-11 w-11 rounded-full border font-bold ${d.rubric[k] === v ? 'border-bark-700 bg-bark-600 text-white' : 'border-paper-400 bg-white'}`}>{v}</button>
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 font-bold">Жиыны: {rubricSum} / {RUBRIC.length * 2}</p>
            </div>
            <p className="mt-6 text-xs text-ink-500">Дерек пен қорытынды оқушының өз жұмысы; жасанды интеллект құралдары қолданылса, ол көрсетілуі тиіс. Тарихи деректер дереккөзбен тексерілді ме — қорғау алдында тағы қараңыз.</p>
          </article>

          <div className="no-print mt-4 flex flex-wrap gap-3">
            <button type="button" className="btn btn-primary" onClick={() => window.print()}>Басып шығару / PDF сақтау</button>
            <button type="button" className="btn" onClick={() => setMode('steps')}>← Қадамдарға оралу</button>
            <button type="button" className="btn btn-quiet text-bad" onClick={clear}>Жазбаларды өшіру</button>
          </div>
          <p className="no-print mt-2 text-sm text-ink-500">PDF сақтау: басып шығару терезесінде «PDF ретінде сақтау» таңдаңыз. <Link className="font-bold underline" to="/results">Нәтиже бетіне өту</Link></p>
        </div>
      )}
    </div>
  )
}
