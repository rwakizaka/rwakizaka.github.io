import rss from '@astrojs/rss'
import { getCollection, getEntry } from 'astro:content'
import type { APIContext } from 'astro'

export async function GET(context: APIContext) {
  const profileEntry = await getEntry('profile', 'profile')
  const name = profileEntry?.data.name ?? 'Blog'

  const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  )

  return rss({
    title: `${name} — Blog`,
    description: profileEntry?.data.tagline ?? '',
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.id}/`,
    })),
  })
}
