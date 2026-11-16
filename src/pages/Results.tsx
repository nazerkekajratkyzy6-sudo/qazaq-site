import { Link } from 'react-router-dom'
import { PageHeader, SourceChips, useVisit } from '../components/ui'
import { useLocalStorage } from '../lib/storage'

const ROWS = [
  { id: 'p1', pub: '«Қазақ», 1913, № 42 — «Азамат» серіктігі туралы жарияланым', issue: 'Қоғамдық ұйым, газетті қолдау', src: ['qazaq-1913-42', 'karsu-vestnik'] },
  { id: 'p2', pub: '«Қазақ», 1914, № 91 — Шыдырты болысындағы жер орналастыру туралы', issue: 'Жер мәселесі', src: ['qazaq-1914-91', 'kazpravda-archive'] },
  { id: 'p3', pub: 'Майданның қара жұмысына қазақтарды алу туралы мақалалар (1914–1918)', issue: 'Қоғам және құқық, соғыс кезеңі', src: ['qazaq-1914-1918-front', 'nurmukhamed-front'] },
]

const TASKS = [
  'Газеттің шығу фактілерін (орны, жылдары, кезеңділігі, таралымы) дереккөзбен нақтылау.',
  'Кемінде үш жарияланымды түпнұсқадан тауып, деректемесін жазу.',
  'Әр жарияланымдағы мәселе мен негізгі ойды анықтау.',
  'Жарияланымның ұлттық санаға ықпалы туралы дәлелді қорытынды жасау.',
]
const METHODS = ['Дереккөздерді талдау (алғашқы және зерттеулер)', 'Салыстыру (бірнеше жарияланымды)', 'Дерек пен интерпретацияны ажырату', 'Хронологиялық әдіс']

const MISSING = [
  'Түпнұсқа нөмірлердің цифрлық көшірмесі (1913, № 42; 1914, № 91 және т.б.) және архив шифрлары.',
  'Мақалалардың тексерілген транскрипциясы және қазақша атаулары.',
  'Бес мәселеге қатысты нақты алғашқы дәйексөздер.',
  'Суреттердің түпнұсқа авторы, сақтаушы мекемесі және пайдалану құқығы.',
  'Үш тұлғаның портреттері үшін архивтік дереккөз.',
  'Газеттің соңғы нөмірінің нақты күні (дереккөздер сәйкес емес).',
]

const CONF = [
  'Баяндама: 2–3 бет, Times New Roman 14, интервал 1,5.',
  'Презентация 4–6 слайд НЕМЕСЕ цифрлық постер (1 бет).',
  'Қорғау: 5 минут баяндама + 2 минут жауап.',
  'Оқушы өз қорытындыларын түсіндіре алуы тиіс.',
  'Жасанды интеллект қолданылғаны көрсетіледі; тарихи деректер тексеріледі.',
]

export default function Results() {
  useVisit('results')
  const [cells, setCells] = useLocalStorage<Record<string, string>>('results-cells', {})
  const [concl, setConcl] = useLocalStorage<string>('results-conclusion', '')
  const set = (k: string, v: string) => setCells(c => ({ ...c, [k]: v }))

  return (
    <div className="wrap">
      <PageHeader eyebrow="Зерттеу нәтижесі" title="Зерттеу нәтижесі" lead="Бұл бет — зерттеу құрылымы. Сайттың өзі ғылыми жаңалық емес: қорытынды түпнұсқамен жұмыс істегеннен кейін оқушының өзі жасайды." />

      <section className="card p-6 sm:p-8">
        <h2 className="text-2xl font-bold">Зерттеу сұрағы</h2>
        <p className="mt-3 font-serif text-xl">«Қазақ» газеті ХХ ғасыр басындағы халықтың ұлттық санасының оянуына қалай ықпал етті?</p>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <div><h3 className="font-serif text-lg font-bold text-bark-700">Мақсаты</h3><p className="mt-2 text-ink-700">Газет материалдары негізінде оның ұлттық сананың қалыптасуымен байланысын дәлелді талдау.</p></div>
          <div><h3 className="font-serif text-lg font-bold text-bark-700">Міндеттері</h3><ul className="mt-2 space-y-1 text-ink-700">{TASKS.map(t => <li key={t}>• {t}</li>)}</ul></div>
          <div><h3 className="font-serif text-lg font-bold text-bark-700">Әдістері</h3><ul className="mt-2 space-y-1 text-ink-700">{METHODS.map(t => <li key={t}>• {t}</li>)}</ul></div>
        </div>
      </section>

      <section className="mt-10" aria-labelledby="cmp">
        <h2 id="cmp" className="text-2xl font-bold">Салыстырмалы кесте</h2>
        <p className="mt-2 max-w-3xl text-ink-700">«Жарияланым», «Көтерілген мәселе» және «Дереккөз» бағандары дереккөздерден алынған. «Негізгі ой» мен «Ықпалы» — түпнұсқаны ашып, оқушы толтыратын өрістер (құрылғыда сақталады).</p>
        <div className="card mt-4 overflow-x-auto">
          <table className="w-full min-w-[820px] border-collapse text-left text-sm">
            <caption className="sr-only">Үш жарияланымның салыстырмалы кестесі</caption>
            <thead className="bg-paper-200 text-bark-700">
              <tr>{['Жарияланым', 'Көтерілген мәселе', 'Негізгі ой', 'Ұлттық санаға ықпалы', 'Дереккөз'].map(h => <th key={h} scope="col" className="px-4 py-3 font-serif text-base">{h}</th>)}</tr>
            </thead>
            <tbody>
              {ROWS.map(r => (
                <tr key={r.id} className="border-t border-paper-300 align-top">
                  <th scope="row" className="px-4 py-3 font-bold">{r.pub}</th>
                  <td className="px-4 py-3">{r.issue}</td>
                  <td className="px-4 py-3"><label className="sr-only" htmlFor={`${r.id}-i`}>Негізгі ой: {r.pub}</label><textarea id={`${r.id}-i`} rows={4} className="field !text-sm" placeholder="Түпнұсқаны оқып, толтырыңыз" value={cells[`${r.id}-i`] ?? ''} onChange={e => set(`${r.id}-i`, e.target.value)} /></td>
                  <td className="px-4 py-3"><label className="sr-only" htmlFor={`${r.id}-e`}>Ықпалы: {r.pub}</label><textarea id={`${r.id}-e`} rows={4} className="field !text-sm" placeholder="Дәлелмен толтырыңыз" value={cells[`${r.id}-e`] ?? ''} onChange={e => set(`${r.id}-e`, e.target.value)} /></td>
                  <td className="px-4 py-3"><SourceChips ids={r.src} /><p className="mt-2 text-xs text-bad">Жанама сілтеме — түпнұсқа тексерілмеген</p></td>
                </tr>
              ))}
              <tr className="border-t border-dashed border-bark-500/40 bg-paper-100/60">
                <td colSpan={5} className="px-4 py-3 text-ink-500">+ Төртінші жарияланымды қосу: түпнұсқаны тапқаннан кейін <code>src/pages/Results.tsx</code> ішіндегі <code>ROWS</code> массивіне жол қосыңыз.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10 card p-6 sm:p-8">
        <h2 className="text-2xl font-bold">Автордың қорытындысы</h2>
        <label htmlFor="concl" className="sr-only">Қорытынды</label>
        <textarea id="concl" rows={7} className="field mt-3" value={concl} onChange={e => setConcl(e.target.value)} placeholder="Өз қорытындыңызды дәлелге сүйеніп жазыңыз: нені анықтадыңыз, қандай шектеу бар?" />
        <p className="mt-2 text-sm text-ink-500">Зерттеу парағын <Link to="/lab" className="font-bold underline">зертханада</Link> толтырыңыз.</p>
      </section>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <section className="card p-6">
          <h2 className="text-xl font-bold">Жетіспейтін материалдар</h2>
          <ul className="mt-3 space-y-2 text-ink-700">{MISSING.map(m => <li key={m} className="flex gap-2"><span aria-hidden className="text-bad">○</span>{m}</li>)}</ul>
        </section>
        <section className="card p-6">
          <h2 className="text-xl font-bold">Конференция талаптары</h2>
          <ul className="mt-3 space-y-2 text-ink-700">{CONF.map(m => <li key={m} className="flex gap-2"><span aria-hidden className="text-ok">✓</span>{m}</li>)}</ul>
          <p className="mt-3 text-sm text-ink-500">Сайт — қосымша ресурс; міндетті материалдарды алмастырмайды.</p>
        </section>
      </div>
    </div>
  )
}
