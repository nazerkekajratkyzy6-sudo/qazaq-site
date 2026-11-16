import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { SOURCES } from '../data/sources'
import { PageHeader, useVisit } from '../components/ui'
import type { Source } from '../data/types'

function Item({ s }: { s: Source }) {
  return (
    <li id={s.id} className="card min-w-0 scroll-mt-28 break-words p-5 [overflow-wrap:anywhere]">
      <p className="font-serif text-lg font-bold leading-snug">{s.title}</p>
      <dl className="mt-2 grid grid-cols-[minmax(0,1fr)] gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
        <div><dt className="inline font-bold">Автор: </dt><dd className="inline text-ink-700">{s.author}</dd></div>
        <div><dt className="inline font-bold">Жылы: </dt><dd className="inline text-ink-700">{s.year}</dd></div>
        <div className="sm:col-span-2"><dt className="inline font-bold">Архив / баспа: </dt><dd className="inline text-ink-700">{s.publisher || 'Дереккөз нақтылануда'}</dd></div>
        <div className="sm:col-span-2 break-words"><dt className="inline font-bold">URL: </dt>
          <dd className="inline text-ink-700">{s.url ? <a className="font-bold text-bark-600 underline" href={s.url} target="_blank" rel="noopener noreferrer">{s.url}</a> : 'жоқ — дереккөз нақтылануда'}</dd></div>
        <div><dt className="inline font-bold">Қаралған күні: </dt><dd className="inline text-ink-700">{s.accessed ?? '—'}</dd></div>
      </dl>
      {s.note && <p className="mt-3 rounded-lg bg-paper-100 p-3 text-sm text-ink-700">{s.note}</p>}
    </li>
  )
}

export default function Sources() {
  useVisit('sources')
  const { hash } = useLocation()
  useEffect(() => { if (hash) setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'center' }), 80) }, [hash])
  const g = (k: Source['kind']) => SOURCES.filter(s => s.kind === k)
  return (
    <div className="wrap">
      <PageHeader eyebrow="Дереккөздер" title="Дереккөздер" lead="Алғашқы тарихи материалдар және қазіргі зерттеулер бөлек көрсетілген. Сілтемелер жанама болса — ол белгіленген, түпнұсқа тексерілуі тиіс." />
      <section aria-labelledby="g1"><h2 id="g1" className="mb-4 text-2xl font-bold">Алғашқы тарихи материалдар</h2><ul className="space-y-4">{g('primary').map(s => <Item key={s.id} s={s} />)}</ul></section>
      <section aria-labelledby="g2" className="mt-12"><h2 id="g2" className="mb-4 text-2xl font-bold">Қазіргі зерттеулер</h2><ul className="space-y-4">{g('research').map(s => <Item key={s.id} s={s} />)}</ul></section>
      <section aria-labelledby="g3" className="mt-12"><h2 id="g3" className="mb-4 text-2xl font-bold">Анықтамалық және қосымша материалдар</h2><ul className="space-y-4">{g('reference').map(s => <Item key={s.id} s={s} />)}</ul></section>
      <section className="mt-12"><h2 className="mb-2 text-2xl font-bold">Суреттер атрибуциясы</h2>
        <p className="text-ink-700">Сайттағы барлық суреттер — жіберілген скриншоттардан алынған. Түпнұсқа авторы, архиві және құқық иесі: <b>Дереккөз нақтылануда</b>. Жарияламас бұрын құқықты тексеріңіз. Сыртқы дереккөздердің мәтіндері көшірілмеген, тек қысқаша сипатталған.</p></section>
    </div>
  )
}
