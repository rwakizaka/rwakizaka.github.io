import { defineCollection } from 'astro:content'
import { file, glob } from 'astro/loaders'
// Imported directly rather than via `astro:content`, whose `z` re-export is
// deprecated in Astro 7.
import { z } from 'zod'
import yaml from 'js-yaml'

/**
 * Parses a top-level YAML sequence and gives each item a stable id derived from
 * its position. Astro's `file()` loader requires an `id` (or `slug`) on every
 * array item; generating it here keeps the data files free of bookkeeping —
 * adding a publication stays "append a few lines".
 */
const yamlList =
  (prefix: string) =>
  (text: string): Array<Record<string, unknown>> => {
    const items = yaml.load(text)
    if (items == null) return []
    if (!Array.isArray(items)) {
      throw new Error(`${prefix}.yaml must contain a YAML list at the top level`)
    }
    return items.map((item, index) => ({
      ...(item as Record<string, unknown>),
      id: `${prefix}-${String(index).padStart(3, '0')}`,
    }))
  }

/**
 * Parses a YAML mapping that describes a single record. `file()` would
 * otherwise turn each top-level key into its own entry.
 */
const yamlRecord =
  (id: string) =>
  (text: string): Record<string, Record<string, unknown>> => {
    const data = yaml.load(text)
    if (data == null || typeof data !== 'object' || Array.isArray(data)) {
      throw new Error(`${id}.yaml must contain a YAML mapping at the top level`)
    }
    return { [id]: data as Record<string, unknown> }
  }

/** An external URL, or a path rooted in `public/` such as `/papers/foo.pdf`. */
const linkTarget = z
  .string()
  .refine((value) => /^https?:\/\//.test(value) || value.startsWith('/'), {
    message:
      'must be an absolute URL (https://…) or a site-root path (/papers/…)',
  })

const linkSchema = z.object({
  label: z.string(),
  url: linkTarget,
})

export const PUBLICATION_KINDS = [
  'journal',
  'conference',
  'domestic-refereed',
  'domestic',
  'talk',
  'poster',
] as const

const profile = defineCollection({
  loader: file('src/data/profile.yaml', { parser: yamlRecord('profile') }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    tagline: z.string().optional(),
    bio: z.string().optional(),
    nameAliases: z.array(z.string()).min(1),
    affiliation: z.array(
      z.object({ text: z.string(), url: linkTarget.optional() }),
    ),
    researchInterests: z.array(z.string()),
    email: z.string(),
    links: z.array(linkSchema).default([]),
    cv: z.string().default(''),
  }),
})

const publications = defineCollection({
  loader: file('src/data/publications.yaml', {
    parser: yamlList('publications'),
  }),
  schema: z.object({
    kind: z.enum(PUBLICATION_KINDS),
    year: z.number().int(),
    month: z.number().int().min(1).max(12).optional(),
    authors: z.array(z.string()).min(1),
    title: z.string(),
    venue: z.string(),
    venueUrl: linkTarget.optional(),
    location: z.string().optional(),
    note: z.string().optional(),
    links: z.array(linkSchema).default([]),
  }),
})

const news = defineCollection({
  loader: file('src/data/news.yaml', { parser: yamlList('news') }),
  schema: z.object({
    date: z
      .string()
      .regex(/^\d{4}-\d{2}(-\d{2})?$/, 'must be YYYY-MM or YYYY-MM-DD'),
    text: z.string(),
    url: linkTarget.optional(),
  }),
})

const awards = defineCollection({
  loader: file('src/data/awards.yaml', { parser: yamlList('awards') }),
  schema: z.object({
    year: z.number().int(),
    title: z.string(),
    venue: z.string(),
  }),
})

const activities = defineCollection({
  loader: file('src/data/activities.yaml', { parser: yamlList('activities') }),
  schema: z.object({
    year: z.number().int(),
    title: z.string(),
    result: z.string().optional(),
  }),
})

const education = defineCollection({
  loader: file('src/data/education.yaml', { parser: yamlList('education') }),
  schema: z.object({
    period: z.string(),
    degree: z.string(),
    institution: z.string(),
  }),
})

const experience = defineCollection({
  loader: file('src/data/experience.yaml', { parser: yamlList('experience') }),
  schema: z.object({
    period: z.string(),
    position: z.string(),
    organization: z.string(),
    note: z.string().optional(),
  }),
})

const teaching = defineCollection({
  loader: file('src/data/teaching.yaml', { parser: yamlList('teaching') }),
  schema: z.object({
    period: z.string(),
    role: z.string(),
    description: z.string(),
  }),
})

const service = defineCollection({
  loader: file('src/data/service.yaml', { parser: yamlList('service') }),
  schema: z.object({
    year: z.number().int(),
    role: z.string(),
    venue: z.string(),
    url: linkTarget.optional(),
  }),
})

const blog = defineCollection({
  loader: glob({ base: 'src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    draft: z.boolean().default(false),
  }),
})

export const collections = {
  profile,
  publications,
  news,
  awards,
  activities,
  education,
  experience,
  teaching,
  service,
  blog,
}
