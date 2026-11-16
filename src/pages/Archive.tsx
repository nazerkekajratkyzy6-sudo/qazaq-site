import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ZoomPan from '../components/ZoomPan'
import { DOCS, imgUrl } from '../data/documents'
import { EmptyState, FavButton, Img, PageHeader, SourceChips, Tabs, useVisit } from '../components/ui'

type Tab = 'orig' | 'text' | 'expl'

export default function Archive() {
  useVisit('archive')
  const [sp, setSp] = useSearchParams()
  const idx = Math.max(0, DOCS.findIndex(d => d.id === sp.get('doc')))
  const doc = DOCS[idx]
  const [tab, setTab] = useState<Tab>('orig')
  const [annId, setAnnId] = useState<string | null>(null)
  const [showAnn, setShowAnn] = useState(true)
  const ann = useMemo(() => doc.annotations.find(a => a.id === annId) ?? null, [doc, annId])

  const select = (i: number) => { setSp({ doc: DOCS[(i + DOCS.length) % DOCS.length].id }); setAnnId(null); setTab('orig') }

  const overlay = showAnn && doc.annotations.length > 0 && (
    <>
      {doc.annotations.map((a, n) => (
        <button key={a.id} type="button" aria-label={`Аннотация ${n + 1}: ${a.label}`} aria-pressed={annId === a.id}
          onClick={e => { e.stopPropagation(); setAnnId(annId === a.id ? null : a.id) }}
          onDoubleClick={e => e.stopPropagation()}
          className={`absolute rounded-md border-2 transition ${annId === a.id ? 'border-bark-600 bg-bark-500/25' : 'border-bark-500/60 bg-transparent hover:bg-bark-500/15'}`}
          style={{ left: `${a.x}%`, top: `${a.y}%`, width: `${a.w}%`, height: `${a.h}%` }}>
          <span className="absolute -left-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-bark-600 text-xs font-bold text-white shadow">{n + 1}</span>
        </button>
      ))}
    </>
  )

  return (
    <div className="wrap">
      <PageHeader eyebrow="Газет мұрағаты" title="Тірі газет" lead="Құжатты үлкейтіп, жылжытып қараңыз. Әр материалдың шығу тегі және сенімділігі көрсетілген: коллаж немесе фото — архив құжаты емес." />

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <section aria-label="Құжат көрсеткіші" className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-serif text-xl font-bold sm:text-2xl">{doc.title}</h2>
            <div className="flex items-center gap-2">
              <FavButton id={`doc:${doc.id}`} label={doc.title} />
            </div>
          </div>
          <div key={doc.id} className="flip">
            <ZoomPan src={imgUrl(doc.file)} alt={doc.title} overlay={overlay || undefined} />
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button type="button" className="btn" onClick={() => select(idx - 1)}>← Алдыңғы</button>
            <span className="text-sm font-bold text-ink-500">{idx + 1} / {DOCS.length}</span>
            <button type="button" className="btn" onClick={() => select(idx + 1)}>Келесі →</button>
            {doc.annotations.length > 0 && (
              <label className="ml-auto flex min-h-[44px] cursor-pointer items-center gap-2 text-sm font-bold">
                <input type="checkbox" className="h-5 w-5 accent-[#8A5A33]" checked={showAnn} onChange={e => setShowAnn(e.target.checked)} /> Аннотацияларды көрсету
              </label>
            )}
          </div>

          <div className="mt-6">
            <Tabs<Tab> label="Құжат көріністері" value={tab} onChange={setTab} tabs={[
              { id: 'orig', label: 'Түпнұсқа' }, { id: 'text', label: 'Оқуға ыңғайлы мәтін' }, { id: 'expl', label: 'Түсіндірме' },
            ]} />
            <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} className="card mt-3 p-5 sm:p-6">
              {tab === 'orig' && (
                <div className="space-y-3">
                  <p className="text-ink-700">Жоғарыдағы сурет — өзгертусіз көрсетілген материал: мәтін дорисовкаланбаған, бейнелер қайта салынбаған.</p>
                  {!doc.isOriginalDocument && <p className="rounded-xl bg-paper-200 p-3 text-sm font-bold text-bark-700">Назар аударыңыз: бұл — {doc.kind.toLowerCase()}, архивтік түпнұсқа емес.</p>}
                </div>
              )}
              {tab === 'text' && (doc.transcription
                ? <p className="whitespace-pre-line leading-relaxed">{doc.transcription}</p>
                : <EmptyState title="Бұл материалдың тексерілген мәтіндік нұсқасы әзірге қолжетімсіз">Мәтінді болжам бойынша «оқуға» болмайды. Транскрипция мен аударма бастапқы дерекке сүйеніп қосылады (<code>src/data/documents.ts</code>).</EmptyState>)}
              {tab === 'expl' && (
                <div className="space-y-3">
                  {doc.explainer.map((p, i) => <p key={i} className="leading-relaxed text-ink-700">{p}</p>)}
                  {doc.annotations.length === 0 && <p className="text-sm text-ink-500">Бұл материал үшін тексерілген аннотациялар әзірге қосылмаған.</p>}
                </div>
              )}
            </div>
          </div>

          {ann && (
            <div className="card mt-4 border-bark-500/50 p-5" role="region" aria-live="polite" aria-label="Аннотация">
              <p className="eyebrow">Аннотация · {ann.topic}</p>
              <h3 className="mt-1 text-xl font-bold">{ann.label}</h3>
              {ann.term && <p className="mt-2 text-sm"><b>Термин:</b> {ann.term}</p>}
              <p className="mt-2 leading-relaxed text-ink-700">{ann.explanation}</p>
              <p className="mt-2 text-sm text-ink-500"><b>Дәйексөз:</b> {ann.quote ?? 'тексерілген мәтін жоқ — дәйексөз берілмейді'}</p>
              <div className="mt-3"><SourceChips ids={ann.sourceIds} /></div>
            </div>
          )}
        </section>

        <aside className="min-w-0 space-y-6" aria-label="Дереккөз карточкасы және тізім">
          <div className="card p-5">
            <p className="eyebrow">Дереккөз карточкасы</p>
            <dl className="mt-3 space-y-2 text-sm">
              <div><dt className="font-bold">Түрі</dt><dd className="text-ink-700">{doc.kind}{doc.isOriginalDocument ? ' (газет беті)' : ' — архив құжаты емес'}</dd></div>
              <div><dt className="font-bold">Нөмірі</dt><dd className="text-ink-700">{doc.issue ?? 'Анықталмаған'}</dd></div>
              <div><dt className="font-bold">Күні</dt><dd className="text-ink-700">{doc.date ?? 'Анықталмаған'}</dd></div>
              <div><dt className="font-bold">Авторы</dt><dd className="text-ink-700">{doc.author ?? 'Көрсетілмеген (авторы анықталмаған)'}</dd></div>
              <div><dt className="font-bold">Шыққан жері / сақтаушы</dt><dd className="text-ink-700">{doc.origin}</dd></div>
              <div><dt className="font-bold">Дереккөз</dt><dd className="mt-1"><SourceChips ids={doc.sourceIds} /></dd></div>
            </dl>
            <p className="mt-4 rounded-xl bg-paper-200 p-3 text-xs leading-relaxed text-ink-700">{doc.caution}</p>
          </div>

          <div>
            <p className="eyebrow mb-2">Қолжетімді беттер</p>
            <ul className="grid grid-cols-2 gap-2 lg:grid-cols-1">
              {DOCS.map((d, i) => (
                <li key={d.id}>
                  <button type="button" onClick={() => select(i)} aria-current={i === idx} className={`flex w-full items-center gap-3 rounded-xl border p-2 text-left transition ${i === idx ? 'border-bark-600 bg-white shadow-card' : 'border-paper-300 bg-paper-100/60 hover:bg-white'}`}>
                    <Img src={imgUrl(d.file)} alt="" className="h-14 w-20 shrink-0 rounded-lg object-cover" />
                    <span className="min-w-0 text-sm font-bold leading-snug">{d.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}
