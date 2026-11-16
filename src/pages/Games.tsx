import { useSearchParams, Link } from 'react-router-dom'
import { PageHeader, useVisit } from '../components/ui'
import { useApp } from '../lib/app'
import Chronology from '../games/Chronology'
import WhoseWork from '../games/WhoseWork'
import FactOpinion from '../games/FactOpinion'
import EditorGame from '../games/Editor'
import FindError from '../games/FindError'
import Consciousness from '../games/Consciousness'
import type { ComponentType } from 'react'

const GAMES: { id: string; title: string; desc: string; C: ComponentType }[] = [
  { id: 'chronology', title: 'Тарихи хронология', desc: 'Оқиғаларды дұрыс ретке қойыңыз.', C: Chronology },
  { id: 'whose', title: 'Кімнің еңбегі?', desc: 'Еңбектер мен қызметті авторларымен сәйкестендіріңіз.', C: WhoseWork },
  { id: 'factopinion', title: 'Дерек пе, пікір ме?', desc: 'Тексеруге болатын фактіні интерпретациядан ажыратыңыз.', C: FactOpinion },
  { id: 'editor', title: 'Газет редакторы', desc: 'Материалға лайық, асыра айтпайтын тақырып таңдаңыз.', C: EditorGame },
  { id: 'finderror', title: 'Тарихи қатені тап', desc: 'Мәтіндегі әдейі жіберілген қателерді табыңыз.', C: FindError },
  { id: 'consciousness', title: 'Ұлттық сана', desc: 'Мәселе, дереккөз және қоғамдық маңызды байланыстырыңыз.', C: Consciousness },
]

export default function Games() {
  useVisit('games')
  const { progress } = useApp()
  const [sp, setSp] = useSearchParams()
  const cur = GAMES.find(g => g.id === sp.get('g'))

  return (
    <div className="wrap">
      <PageHeader eyebrow="Интерактивті тапсырмалар" title="Тапсырмалар" lead="Алты тапсырма: тексеру, түсіндірме және қайталау. Нәтиже бір әрекет үшін бір рет есептеледі; ең жақсы нәтиже сақталады." />
      {!cur ? (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GAMES.map((g, i) => (
            <li key={g.id}>
              <button type="button" onClick={() => setSp({ g: g.id })} className="card group h-full w-full p-6 text-left transition hover:-translate-y-0.5 hover:bg-white">
                <span className="font-serif text-3xl font-bold text-gold-500">{String(i + 1).padStart(2, '0')}</span>
                <span className="mt-2 block font-serif text-xl font-bold group-hover:text-bark-600">{g.title}</span>
                <span className="mt-1 block text-ink-700">{g.desc}</span>
                <span className="mt-3 block text-sm font-bold text-bark-500">{progress.games[g.id] !== undefined ? `Ең жақсы нәтиже: ${progress.games[g.id]}%` : 'Әлі ойналмады'}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <section aria-label={cur.title}>
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <button type="button" className="btn" onClick={() => setSp({})}>← Барлық тапсырмалар</button>
            <h2 className="font-serif text-2xl font-bold">{cur.title}</h2>
          </div>
          <div className="card p-5 sm:p-8"><cur.C /></div>
          <p className="mt-4 text-sm text-ink-500">Тапсырмалар жоба материалына негізделген. Дереккөздер: <Link className="font-bold underline" to="/sources">Дереккөздер</Link>.</p>
        </section>
      )}
    </div>
  )
}
