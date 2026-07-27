---
title: Writing posts on this site
description: Reference for the front matter, maths and code support. Kept as a draft, so it is not published.
pubDate: 2026-07-28
draft: true
---

This post is a **draft** (`draft: true` above), so it is excluded from the
build, the blog index, the RSS feed and the sitemap. It is here purely as a
reference for writing the first real post.

Create a new post by adding a Markdown file under `src/content/blog/` — the
file name becomes the URL, so `lattice-surgery.md` is served at
`/blog/lattice-surgery/`.

## Front matter

Only `title` and `pubDate` are required:

```yaml
---
title: Type-based qubit allocation, revisited
description: Optional one-line summary, also used in the RSS feed.
pubDate: 2026-08-01
updatedDate: 2026-08-03   # optional
draft: true               # optional; drafts are excluded from the build
---
```

Anything that fails the schema stops the build with a message pointing at the
offending file, so a typo can't quietly ship.

## Maths

Inline maths like $\ket{\psi} = \alpha\ket{0} + \beta\ket{1}$ uses single
dollars, and display maths uses double dollars:

$$
\frac{1}{\sqrt{2}} \left( \ket{00} + \ket{11} \right)
$$

KaTeX renders at build time, so no JavaScript is sent to the browser.

## Code

Syntax highlighting is also done at build time:

```ocaml
let rec alloc (g : coupling_graph) = function
  | Var x -> lookup g x
  | App (e1, e2) -> alloc g e1 @ alloc g e2
```

## Publishing

Remove the `draft: true` line (or set it to `false`) and the post appears on
`/blog` and in the feed on the next build. Until then the blog index shows
"No posts yet." rather than breaking.

This file can be deleted outright once it has served its purpose.
