---
title: Writing posts on this site
description: A starter post showing the front matter, maths and code support. Delete it whenever you like.
pubDate: 2026-07-28
---

This is an example post. Create a new one by adding a Markdown file under
`src/content/blog/` — the file name becomes the URL, so `lattice-surgery.md`
is served at `/blog/lattice-surgery/`.

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

## Deleting this post

Just remove `src/content/blog/writing-posts.md`. If no posts remain, the blog
index shows "No posts yet." rather than breaking.
