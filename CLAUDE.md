# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The personal academic homepage of Ryo Wakizaka (Ph.D. student, Kyoto University — quantum programming languages), built with **Astro 7**. It is a CV-first site with a small blog, deployed to GitHub Pages at `https://rwakizaka.github.io`.

Design constraints that shaped the code, and that changes should preserve:

- **No animation.** No transitions, no view transitions, no scroll effects. `prefers-reduced-motion` is honoured on top of that.
- **Zero runtime JavaScript.** `dist/` currently contains no `.js` at all — maths (KaTeX) and syntax highlighting (Shiki) are rendered at build time. Adding a client-side island would break this property; check `find dist -name '*.js'` after changes.
- **Readable on desktop and phone alike.** Neither is a degraded version of the other; the layout adapts on its own. Nothing may overflow horizontally at any width — verified at 320/414/768/900/1000/1024/1440/1920px. Tables restack into blocks below 40rem rather than scrolling sideways.
- **Adding content must stay trivial** — see below.

## Layout

Two columns above 62rem, one below — the usual academic-portfolio shape. `src/layouts/Base.astro` renders `.layout` as a CSS grid holding `Sidebar.astro` and a content column; the breakpoint lives in `src/styles/global.css`.

`Sidebar.astro` carries the name, role, affiliation, nav and contact links. On desktop it is `position: sticky` and the nav is a vertical list with a left accent border on the current page; below the breakpoint the same markup reflows into a compact header block with a horizontal nav. There is no JavaScript involved and no hamburger menu — the collapse is pure CSS.

The site owner's name is the `<h1>` on the home page only; every other page supplies its own `<h1>` and the sidebar name is demoted to a link (`NameTag` in `Sidebar.astro`).

There is deliberately **no profile photo** — it was considered and dropped.

## Commands

```bash
npm install
npm run dev      # localhost:4321
npm run build    # -> dist/
npm run preview  # serve the production build
npm run check    # astro check (type + template diagnostics)
```

`npm run check` should stay at 0 errors / 0 warnings / 0 hints.

## Content model — this is the important part

All CV content is **data, not markup**. Pages are generic renderers; editing the site normally means editing YAML only.

`src/data/*.yaml` — `profile`, `news`, `publications`, `awards`, `activities`, `education`, `experience`, `teaching`, `service`. Each is a plain YAML list (except `profile.yaml`, a single mapping), loaded as an Astro content collection and validated by a Zod schema in `src/content.config.ts`. A malformed entry **fails the build** with the offending file named.

Adding a publication = appending a block to `src/data/publications.yaml`. Order in the file is irrelevant: `groupByKind()` in `src/lib/publications.ts` buckets entries by `kind` and sorts by `year` then `month`, descending. Sections with no entries disappear.

Two conventions worth knowing before editing templates:

- **Never write `<u>` or `<strong>` around your own name.** `profile.yaml`'s `nameAliases` (currently `Ryo Wakizaka` and `脇坂遼`) drive automatic emphasis via `isSelf()` in `src/lib/publications.ts`. Adding a new spelling of the name means adding an alias, not editing entries.
- **`id` fields are generated, not authored.** `file()` requires an `id` on every array item; the `yamlList()` parser in `src/content.config.ts` injects positional ones so the data files stay free of bookkeeping. Zod strips them before they reach templates.

Blog posts are Markdown/MDX in `src/content/blog/`; the filename becomes the URL. `draft: true` excludes a post from the build, the blog index and the RSS feed.

## Things that will bite you

- **`public/` is source, not output.** It holds `papers/` and `slides/`, linked from `publications.yaml` as `/papers/…` and `/slides/…` — the same URLs the old Hugo site used, so external links to the PDFs still resolve. The Hugo-era `.gitignore` ignored `/public/` (Hugo's build output); if that line ever comes back, the PDFs silently stop being committed and every paper link 404s. Build output is `dist/`.
- **`/about` is a redirect to `/`**, configured in `astro.config.mjs`. The Hugo site served the CV there. Don't remove it.
- **Markdown plugins go through `unified()`** from `@astrojs/markdown-remark`, not `markdown.remarkPlugins` — the latter is deprecated in Astro 7 and warns on every build.
- **Import `z` from `zod`, not from `astro:content`** — the re-export is deprecated. `zod` is an explicit dependency for this reason, and `js-yaml` is pinned to `^4` to match Astro's own copy (v5 dropped the default export Astro relies on).
- **KaTeX's stylesheet is imported only in `src/pages/blog/[...slug].astro`**, so its ~25KB of CSS and its fonts never load on the CV pages. Keep it there.
- Section headings (`h2`) are styled globally as small uppercase labels. Inside blog prose that's wrong, so `[...slug].astro` overrides `h2`/`h3` back to normal headings. New long-form pages need the same treatment.
- The email address appears as a bare `Email` link in the sidebar (the full address wraps badly in a 15rem column) and spelled out in the home page's Contact section. `obfuscateEmail()` in `src/lib/format.ts` renders it as `user [at] domain`; the `mailto:` uses the real address.

## Deployment

`.github/workflows/gh-pages.yml` builds on push to `main` and publishes `dist/` with `actions/upload-pages-artifact` + `actions/deploy-pages`.

This requires **Pages → Source = "GitHub Actions"** in the repository settings. The repo previously deployed from a `gh-pages` branch via `peaceiris/actions-gh-pages`; if deploys 404 or serve stale content, that setting is the first thing to check.
