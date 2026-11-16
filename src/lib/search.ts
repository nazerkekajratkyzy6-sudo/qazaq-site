import { DOCS } from '../data/documents'
import { EVENTS } from '../data/timeline'
import { FIGURES } from '../data/figures'
import { TOPICS } from '../data/topics'
import { GLOSSARY } from '../data/glossary'
import { SOURCES } from '../data/sources'

export interface Hit { id: string; type: string; title: string; text: string; to: string }

export const INDEX: Hit[] = [
  ...DOCS.map(d => ({ id: 'doc:' + d.id, type: 'Мұрағат', title: d.title, text: [d.kind, d.origin, ...d.explainer].join(' '), to: `/archive?doc=${d.id}` })),
  ...EVENTS.map((e, i) => ({ id: 'ev:' + i, type: 'Уақыт', title: `${e.date} — ${e.title}`, text: e.text, to: `/timeline?year=${e.year}` })),
  ...FIGURES.map(f => ({ id: 'fig:' + f.id, type: 'Тұлға', title: f.name, text: [f.role, f.roleNote, ...f.chronology.map(c => c.t)].join(' '), to: `/figures#${f.id}` })),
  ...TOPICS.map(t => ({ id: 'topic:' + t.id, type: 'Мәселе', title: t.title, text: [t.lead, t.context, t.analysis].join(' '), to: `/topics/${t.id}` })),
  ...GLOSSARY.map(g => ({ id: 'gl:' + g.term, type: 'Сөздік', title: g.term, text: g.def, to: '/#glossary' })),
  ...SOURCES.map(s => ({ id: 'src:' + s.id, type: 'Дереккөз', title: s.title, text: [s.author, s.publisher, s.note ?? ''].join(' '), to: `/sources#${s.id}` })),
]

const norm = (s: string) => s.toLocaleLowerCase('kk').replace(/ё/g, 'е')

export function search(q: string): Hit[] {
  const query = norm(q.trim())
  if (query.length < 2) return []
  return INDEX
    .map(h => {
      const t = norm(h.title), x = norm(h.text)
      const score = (t.includes(query) ? 3 : 0) + (x.includes(query) ? 1 : 0)
      return { h, score }
    })
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 20)
    .map(r => r.h)
}
