# portfolio-v4

Personal portfolio for **Priyansh Gupta** — Forward Deployed Engineer.
Next.js 16 · React 19 · CSS Modules.

Live content is sourced from the public [tsenta profile](https://tsenta.com/u/priyansh-gupta)
and the GitHub API.

---

## One design per branch

Content, routing and page structure are shared. **Only the visual layer changes
between branches**, so a design can be swapped without touching a word of copy.

| Branch | Design |
| --- | --- |
| `main` | Baseline — beige paper "slam book" |
| `design/slam-book` | Snapshot of the baseline design |
| `design/<name>` | One branch per additional design |

```bash
git branch -a          # list every design
git switch design/x    # try one
npm run dev
```

### How a new design gets added

1. `git switch main && git switch -c design/<name>`
2. Restyle — see *What a design may change* below
3. `npm run build` must pass, then push the branch

Content fixes always land on `main` and are merged **into** the design branches,
never the other way round. That keeps one source of truth for the copy.

### What a design may change

| Safe to change | Leave alone |
| --- | --- |
| `src/app/globals.css` — all tokens: palette, fonts, spacing, radius, gutters | `src/lib/content.js` — every word of copy and all data |
| Any `*.module.css` | Route structure under `src/app/` |
| Component markup, where structure demands it | Breadcrumbs, nav destinations, sitemap, OG images |

Most of a design lands in `globals.css` alone — it holds the full token set.

---

## Routes

| Path | Purpose |
| --- | --- |
| `/` | Teasers only; every section links to its own page |
| `/work` | Full experience + career narrative |
| `/projects` | Index of all write-ups |
| `/projects/[slug]` | Per-project deep dive, prev/next, jump-to-any |
| `/freelance` | Services, process, availability, case studies |
| `/open-source` | Upstream contributions + maintained repos |
| `/about` | Bio, skills, education, certifications |

Plus a custom 404, `sitemap.xml`, `robots.txt` and generated OG images.

Nothing appears on two URLs — the home page never duplicates a page's content.

---

## Getting started

```bash
npm install
npm run dev
```

Then <http://localhost:3000>.

## Before deploying

Set the canonical origin, or every OG tag and sitemap URL will point at
localhost:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

See [`src/lib/site.js`](src/lib/site.js).

## Outstanding content

[`CONTENT-TODO.md`](CONTENT-TODO.md) lists the facts that still need filling in —
CV, photos, how the headline metrics were measured, and freelance proof. Every
field is already wired up: fill it in and it renders, leave it blank and its
section stays hidden.
