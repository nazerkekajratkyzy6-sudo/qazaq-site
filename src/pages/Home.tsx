import { Link } from 'react-router-dom'
import { Img, Reveal, SourceChips, useVisit } from '../components/ui'
import { imgUrl, docById } from '../data/documents'
import { useApp } from '../lib/app'

const FACTS = [
  { k: '1913', v: 'Алғашқы нөмір: 2 ақпан', s: ['kazpravda-day', 'kazpravda-history'] },
  { k: '1918', v: 'Басылымның аяқталған жылы (нақты күні дереккөздерде әртүрлі)', s: ['karsu-vestnik', 'wiki-qazaq'] },
  { k: 'Орынбор', v: 'Басылым шыққан қала', s: ['kazpravda-history', 'karsu-vestnik'] },
]

const ROUTE = [
  ['01', 'Дерекпен танысу', '/archive', 'Газет бетін үлкейтіп қарап, деректемесін оқыңыз.'],
  ['02', 'Контекст', '/timeline', 'Жылдар бойынша расталған оқиғаларды қараңыз.'],
  ['03', 'Тұлғалар', '/figures', 'Газет төңірегіндегі үш тұлғамен танысыңыз.'],
  ['04', 'Мәселелер', '/topics', 'Газет көтерген бес тақырыпты талдаңыз.'],
  ['05', 'Зерттеу', '/lab', 'Төрт қадам арқылы өз қорытындыңызды жасаңыз.'],
  ['06', 'Тексеру', '/games', 'Ойындар арқылы білімді бекітіңіз.'],
] as const

export default function Home() {
  useVisit('home')
  const { openPanel } = useApp()
  const hero = docById('volumes-photo')!
  return (
    <>
      <section className="overflow-hidden">
        <div className="wrap grid items-center gap-10 py-12 lg:grid-cols-[1.05fr_1fr] lg:py-20">
          <div className="page-in">
            <p className="eyebrow">Ұлттық баспасөз мұрасы</p>
            <h1 className="mt-3 text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl">ҚАЗАҚ —<br />ҰЛТТЫ ОЯТҚАН ГАЗЕТ</h1>
            <p className="mt-5 font-serif text-xl italic text-bark-600">1913–1918 жылдардағы ұлттық баспасөз мұрасы</p>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-700">
              «Қазақ» газеті және халықтың рухани оянуы: құжатпен жұмыс істеп, дерек → дәлел → қорытынды жолын өзіңіз жүріп өтетін виртуалды музей.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/lab" className="btn btn-primary">Зерттеуді бастау</Link>
              <Link to="/archive" className="btn">Газет мұрағаты</Link>
              <Link to="/timeline" className="btn">Тарихи саяхат</Link>
            </div>
          </div>
          <figure className="flip">
            <div className="card overflow-hidden p-2">
              <Img src={imgUrl(hero.file)} alt={hero.title} className="h-auto w-full rounded-xl" />
            </div>
            <figcaption className="mt-3 text-sm text-ink-500">{hero.title}. {hero.origin}</figcaption>
          </figure>
        </div>
      </section>

      <section className="wrap">
        <Reveal>
          <div className="grid gap-4 md:grid-cols-3">
            {FACTS.map(f => (
              <div key={f.k} className="card p-6">
                <p className="font-serif text-4xl font-bold text-bark-600">{f.k}</p>
                <p className="mt-2 text-ink-900">{f.v}</p>
                <div className="mt-4"><SourceChips ids={f.s} /></div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-16">
          <h2 className="text-3xl font-bold">Зерттеу сұрағы</h2>
          <blockquote className="mt-4 rounded-2xl border-l-4 border-gold-500 bg-paper-100 p-6 font-serif text-xl leading-relaxed">
            «Қазақ» газеті ХХ ғасыр басындағы халықтың ұлттық санасының оянуына қалай ықпал етті?
          </blockquote>
          <div className="prose-kz mt-6 max-w-3xl">
            <p>Сайт төрт бөліктен тұрады: виртуалды музей, алғашқы дереккөздер мұрағаты, интерактивті зерттеу және тексеру тапсырмалары. Әр материалдың атрибуциясы көрсетіледі; тексерілмеген деректер «нақтылануда» деп белгіленеді.</p>
            <p>Зерттеуді баяндамамен, презентациямен немесе постермен бірге ұсыну қажет — сайт оларды алмастырмайды.</p>
          </div>
        </Reveal>

        <Reveal className="mt-16">
          <h2 className="text-3xl font-bold">Зерттеу бағыты</h2>
          <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ROUTE.map(([n, t, to, d]) => (
              <li key={n}>
                <Link to={to} className="card group block h-full p-6 transition hover:-translate-y-0.5 hover:bg-white">
                  <span className="font-serif text-3xl font-bold text-gold-500">{n}</span>
                  <p className="mt-2 font-serif text-xl font-bold group-hover:text-bark-600">{t}</p>
                  <p className="mt-1 text-ink-700">{d}</p>
                </Link>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal className="mt-16">
          <div className="card flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-serif text-2xl font-bold">Қорғауға дайындалу</h2>
              <p className="mt-1 text-ink-700">Көрсету режимі мәтінді үлкейтеді және газетке, зерттеуге, қорытындыға жылдам өтуді қосады. 5 минут баяндама + 2 минут жауап.</p>
            </div>
            <div className="flex gap-2">
              <button type="button" className="btn" onClick={() => openPanel('glossary')}>Тарихи сөздік</button>
              <button type="button" className="btn btn-primary" onClick={() => openPanel('share')}>QR және сілтемелер</button>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  )
}
