// @ts-check
import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import { unified } from '@astrojs/markdown-remark'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'

// https://astro.build/config
export default defineConfig({
  site: 'https://rwakizaka.github.io',
  integrations: [mdx(), sitemap()],
  markdown: {
    // Maths is rendered to HTML at build time, so no JS ships to the browser.
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
    }),
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
    },
  },
  redirects: {
    // The Hugo site served the CV at /about; it now lives at the root.
    '/about': '/',
  },
})
