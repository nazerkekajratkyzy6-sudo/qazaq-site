import { useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { TOPICS, topicById } from '../data/topics'
import { EmptyState, FavButton, PageHeader, SourceChips, useVisit } from '../components/ui'
import { useLocalStorage } from '../lib/storage'

export function TopicsIndex() {
  useVisit('topics')
  return (
    <div className="wrap">
      <PageHeader eyebrow="Бес мәселе" title="Газет көтерген бес мәселе" lead="Әр тақырып бөлек бет: контекст, алғашқы дереккөз, талдау, сұрақ, түсіндірме және қорытынды." />
      <ol className="grid gap-4 sm:grid-cols-2">
        {TOPICS.map(t => (
          <li key={t.id}>
            <Link to={`/topics/${t.id}`} className="card group flex h-full gap-4 p-6 transition hover:-translate-y-0.5 hover:bg-white">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-paper-200 font-serif text-3xl font-bold text-bark-600">{t.n}</span>
              <span><span className="block font-serif text-2xl font-bold group-hover:text-bark-600">{t.title}</span><span className="mt-1 block text-ink-700">{t.lead}</span></span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  )
}

const STEPS = ['Контекст', 'Алғашқы дереккөз', 'Талдау', 'Сұрақ', 'Түсіндірме', 'Қорытынды'] as const

export function TopicPage() {
  const { id = '' } = useParams()
  const t = topicById(id)
  useVisit(`topic-${id}`)
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useLocalStorage<Record<string, string>>('topic-answers', {})
  if (!t) return <Navigate to="/topics" replace />
  const idx = TOPICS.findIndex(x => x.id === t.id)
  const key = `${t.id}`
  const ans = answers[key] ?? ''

  return (
    <div className="wrap">
      <PageHeader eyebrow={`Мәселе ${t.n} / 5`} title={t.title} lead={t.lead} />
      <div className="mb-4 flex items-center justify-between"><Link to="/topics" className="btn btn-quiet">← Барлық мәселелер</Link><FavButton id={`topic:${t.id}`} label={t.title} /></div>

      <ol className="mb-6 grid grid-cols-3 gap-2 sm:grid-cols-6" aria-label="Қадамдар">
        {STEPS.map((s, i) => (
          <li key={s}>
            <button type="button" onClick={() => setStep(i)} aria-current={step === i ? 'step' : undefined}
              className={`w-full rounded-xl border px-2 py-2 text-sm font-bold transition ${step === i ? 'border-bark-700 bg-bark-600 text-paper-50' : i < step ? 'border-gold-500/60 bg-paper-200' : 'border-paper-300 bg-white hover:bg-paper-100'}`}>
              <span className="block font-serif text-lg">{i + 1}</span>{s}
            </button>
          </li>
        ))}
      </ol>

      <section key={step} className="card flip min-h-[260px] p-6 sm:p-8" aria-live="polite">
        <h2 className="text-2xl font-bold">{STEPS[step]}</h2>
        {step === 0 && <p className="mt-4 max-w-3xl text-lg leading-relaxed text-ink-700">{t.context}</p>}
        {step === 1 && (
          <div className="mt-4 space-y-3">
            {t.primary.map(p => (
              <div key={p.cite} className="rounded-xl border border-paper-300 bg-paper-100 p-4">
                <p className="font-bold">{p.cite}</p>
                <p className="mt-1 text-sm text-bad">{p.status}</p>
              </div>
            ))}
            <EmptyState title="Түпнұсқа мәтін мен дәйексөз қосылмаған">Газеттің сәйкес нөмірін ашып, тексерілген үзіндіні <code>src/data/topics.ts</code> немесе зерттеу парағына қосыңыз. Дәйексөзді болжаммен жазбаңыз.</EmptyState>
          </div>
        )}
        {step === 2 && <p className="mt-4 max-w-3xl text-lg leading-relaxed text-ink-700">{t.analysis}</p>}
        {step === 3 && (
          <div className="mt-4 max-w-3xl">
            <p className="font-serif text-xl leading-relaxed">{t.question}</p>
            <label htmlFor="ans" className="mt-5 block font-bold">Менің жауабым (құрылғыда сақталады)</label>
            <textarea id="ans" rows={5} className="field mt-2" value={ans} onChange={e => setAnswers(a => ({ ...a, [key]: e.target.value }))} placeholder="Жауабыңызды дерекке сүйеніп жазыңыз…" />
          </div>
        )}
        {step === 4 && <p className="mt-4 max-w-3xl text-lg leading-relaxed text-ink-700">{t.explanation}</p>}
        {step === 5 && (
          <div className="mt-4 max-w-3xl space-y-4">
            <p className="text-lg leading-relaxed text-ink-700">{t.conclusion}</p>
            {ans && <div className="rounded-xl bg-paper-100 p-4"><p className="text-sm font-bold text-bark-500">Сіздің жауабыңыз</p><p className="mt-1 whitespace-pre-line">{ans}</p></div>}
            <Link to="/lab" className="btn btn-primary">Зертханаға өту</Link>
          </div>
        )}
      </section>

      <div className="mt-4 flex items-center justify-between">
        <button type="button" className="btn" disabled={step === 0} onClick={() => setStep(s => s - 1)}>← Артқа</button>
        <button type="button" className="btn btn-primary" disabled={step === STEPS.length - 1} onClick={() => setStep(s => s + 1)}>Келесі →</button>
      </div>

      <div className="mt-8"><p className="eyebrow mb-2">Дереккөздер</p><SourceChips ids={t.sourceIds} /></div>
      <div className="mt-8 flex justify-between text-sm font-bold">
        {idx > 0 ? <Link className="btn" to={`/topics/${TOPICS[idx - 1].id}`}>← {TOPICS[idx - 1].title}</Link> : <span />}
        {idx < TOPICS.length - 1 && <Link className="btn" to={`/topics/${TOPICS[idx + 1].id}`}>{TOPICS[idx + 1].title} →</Link>}
      </div>
    </div>
  )
}
