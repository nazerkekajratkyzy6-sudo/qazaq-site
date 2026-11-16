import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FIGURES } from '../data/figures'
import { TOPICS } from '../data/topics'
import { imgUrl } from '../data/documents'
import { PageHeader, SourceChips, useVisit, Reveal } from '../components/ui'

export default function Figures() {
  useVisit('figures')
  const { hash } = useLocation()
  useEffect(() => {
    if (hash) setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60)
  }, [hash])

  return (
    <div className="wrap">
      <PageHeader eyebrow="Алаш тұлғалары" title="Алаштың үш арысы" lead="Үш тұлға — газеттің ұйымдастырылуы мен шығуымен байланысты қайраткерлер. Өмірбаяндық деректер редакциялық қызметтен бөлек көрсетіледі." />

      <figure className="card mx-auto mb-10 max-w-3xl overflow-hidden p-2">
        <img src={imgUrl('three_alash_figures.jpg')} alt="Үш ер адамның топтық қара-ақ фотосуреті" className="h-auto w-full rounded-xl" loading="lazy" />
        <figcaption className="p-3 text-sm text-ink-500">Топтық портрет. Тұлғаларды анықтау — сурет атауы бойынша; түпнұсқа авторы мен архиві нақтылануда.</figcaption>
      </figure>

      <div className="space-y-12">
        {FIGURES.map(f => (
          <Reveal key={f.id}>
            <article id={f.id} className="card scroll-mt-28 overflow-hidden">
              <div className="grid md:grid-cols-[260px_1fr]">
                <div className="bg-paper-200 p-4">
                  <div role="img" aria-label={`${f.name} — топтық суреттен кесінді`} className="aspect-[3/4] w-full rounded-xl border border-paper-300 bg-no-repeat"
                    style={{ backgroundImage: `url(${imgUrl('three_alash_figures.jpg')})`, backgroundSize: '300% 100%', backgroundPosition: `${f.crop} 50%` }} />
                  <p className="mt-2 text-xs text-ink-500">Топтық фотодан кесінді. Портрет қайта салынған жоқ.</p>
                </div>
                <div className="p-6 sm:p-8">
                  <p className="eyebrow">{f.years}</p>
                  <h2 className="mt-1 text-3xl font-bold">{f.name}</h2>
                  {f.yearsNote && <p className="mt-1 text-sm text-ink-500">{f.yearsNote}</p>}

                  <div className="mt-5 rounded-xl bg-paper-100 p-4">
                    <p className="text-sm font-bold uppercase tracking-wider text-bark-500">Газеттегі рөлі</p>
                    <p className="mt-1 font-serif text-lg font-bold">{f.role}</p>
                    <p className="mt-1 text-sm text-ink-700">{f.roleNote}</p>
                  </div>

                  <h3 className="mt-6 font-serif text-xl font-bold">Өмірбаяндық хронология</h3>
                  <ol className="mt-3 space-y-2 border-l-2 border-gold-500/50 pl-4">
                    {f.chronology.map(c => (
                      <li key={c.y + c.t} className="text-ink-700"><b className="mr-2 font-serif text-bark-600">{c.y}</b>{c.t}</li>
                    ))}
                  </ol>

                  <h3 className="mt-6 font-serif text-xl font-bold">Негізгі еңбектері</h3>
                  <ul className="mt-2 space-y-1">
                    {f.works.map(w => (
                      <li key={w.t} className="text-ink-700">• {w.t} <span className="text-ink-500">({w.y})</span>{w.check && <span className="chip ml-2">тексеру қажет</span>}</li>
                    ))}
                  </ul>

                  <h3 className="mt-6 font-serif text-xl font-bold">Байланысты тақырыптар</h3>
                  <p className="mt-2 flex flex-wrap gap-2">
                    {f.topicIds.map(id => <Link key={id} to={`/topics/${id}`} className="btn !min-h-[40px]">{TOPICS.find(t => t.id === id)?.title}</Link>)}
                  </p>
                  <p className="mt-3 text-sm text-ink-500">Тұлғаның газеттегі нақты мақалалары: тексерілген түпнұсқа әзірге тіркелмеген — оқушы архивтен табады.</p>

                  <h3 className="mt-6 font-serif text-xl font-bold">Библиография</h3>
                  <div className="mt-2"><SourceChips ids={f.sourceIds} /></div>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  )
}
