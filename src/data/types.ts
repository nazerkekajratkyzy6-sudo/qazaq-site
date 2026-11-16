export type SourceKind = 'primary' | 'research' | 'reference'
export interface Source {
  id: string
  kind: SourceKind
  author: string
  title: string
  year: string
  publisher: string
  url?: string
  accessed?: string
  note?: string
}
export interface Annotation {
  id: string
  /** процент бойынша аймақ (сурет өлшемінен) */
  x: number; y: number; w: number; h: number
  label: string
  topic: string
  explanation: string
  term?: string
  quote?: string
  sourceIds: string[]
}
export interface ArchiveDoc {
  id: string
  title: string
  file: string
  kind: 'Газет беті' | 'Газет көшірмелері (фото)' | 'Коллаж' | 'Салыстырмалы сурет' | 'Топтық портрет'
  isOriginalDocument: boolean
  issue?: string
  date?: string
  author?: string
  origin: string
  transcription?: string
  explainer: string[]
  caution: string
  annotations: Annotation[]
  sourceIds: string[]
}
export interface TimelineEvent {
  year: number
  date: string
  title: string
  text: string
  status: 'verified' | 'context' | 'disputed'
  sourceIds: string[]
  docIds?: string[]
}
export interface Figure {
  id: string
  name: string
  years: string
  yearsNote?: string
  crop: '0%' | '50%' | '100%'
  role: string
  roleNote: string
  chronology: { y: string; t: string }[]
  works: { t: string; y: string; check: boolean }[]
  topicIds: string[]
  sourceIds: string[]
}
export interface Topic {
  id: string
  n: number
  title: string
  lead: string
  context: string
  primary: { cite: string; status: string }[]
  analysis: string
  question: string
  explanation: string
  conclusion: string
  sourceIds: string[]
}
export interface GlossaryTerm { term: string; def: string; sourceIds: string[] }
