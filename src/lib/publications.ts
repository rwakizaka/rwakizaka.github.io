import type { CollectionEntry } from 'astro:content'
import { PUBLICATION_KINDS } from '../content.config'

type Kind = (typeof PUBLICATION_KINDS)[number]
export type Publication = CollectionEntry<'publications'>

/** Section headings, in the order they appear on the publications page. */
export const PUBLICATION_SECTIONS: ReadonlyArray<{
  kind: Kind
  heading: string
}> = [
  { kind: 'journal', heading: 'Journal Articles (refereed)' },
  { kind: 'conference', heading: 'Conference Papers (refereed)' },
  { kind: 'domestic-refereed', heading: 'Conference Papers (refereed, domestic)' },
  { kind: 'domestic', heading: 'Conference Papers (not refereed, domestic)' },
  { kind: 'talk', heading: 'Talks' },
  { kind: 'poster', heading: 'Posters' },
]

/** Newest first. Entries without a month sort after same-year entries with one. */
export function byDateDesc(a: Publication, b: Publication): number {
  if (a.data.year !== b.data.year) return b.data.year - a.data.year
  return (b.data.month ?? 0) - (a.data.month ?? 0)
}

/** Groups publications by kind, dropping sections that have no entries. */
export function groupByKind(publications: Publication[]) {
  const sorted = [...publications].sort(byDateDesc)
  return PUBLICATION_SECTIONS.map(({ kind, heading }) => ({
    kind,
    heading,
    entries: sorted.filter((entry) => entry.data.kind === kind),
  })).filter((section) => section.entries.length > 0)
}

/** True when an author string refers to the site owner. */
export function isSelf(author: string, aliases: string[]): boolean {
  return aliases.some((alias) => alias === author)
}
