# Design branch charter

Rules every `design/*` branch must follow. A design may reinvent the entire
visual language and page layout — but the things below are load-bearing and
must survive intact.

---

## 1. Hard constraints — non-negotiable

### Never edit
- `src/lib/content.js` — every word of copy and all data. Not one character.
- `src/lib/site.js`, `src/app/sitemap.js`, `src/app/robots.js`
- `CONTENT-TODO.md`, `README.md`, `AGENTS.md`, `CLAUDE.md`, this file

### Routing is frozen
These eight routes must exist, keep their exact paths, and render the same
content. No adding, removing, renaming, merging or reordering:

| Route | |
| --- | --- |
| `/` | home |
| `/work` | experience |
| `/projects` | index |
| `/projects/[slug]` | 5 project pages |
| `/freelance` | consulting |
| `/open-source` | contributions |
| `/about` | bio + skills |
| 404 | `not-found.js` |

### Navigation is frozen
Every way of getting **to and from** a page must still work:

- Top nav: Work · Projects · Freelance · Open Source · About · Contact
- Brand mark → `/`
- Breadcrumbs on every sub-page (Home / Section / Page)
- Footer links on every page
- Home teaser buttons → their full pages
- Per-project "Read the full write-up" buttons
- Project prev/next, "All projects", and jump-to-any
- 404 recovery links

You may restyle or re-place any of these. You may **not** remove one, hide it
behind an interaction that could fail, or make it unreachable. A loading screen
must never be able to trap the user.

---

## 2. What this phase wants

Motion and depth are the point. Aim for:

- **A loading screen** — branded, on first paint, that always resolves. Never
  gate content behind an animation that can hang.
- **Scroll-driven navigation and motion** — progress indicators, scroll-linked
  scenes, sticky sequences, section transitions.
- **Real 3D** — WebGL where it earns its place, CSS 3D transforms where it does
  not. Depth should be structural, not decorative sprinkle.
- **Page and element transitions** — entrances, staggering, view transitions.
- **Layout reinvention** — unlike earlier branches, you may restructure page
  layout freely, as long as routing and navigation above survive.

---

## 3. Assets already in the repo

`three@0.161.0` is a dependency. These components exist, work, and are
currently unused — reuse or adapt them rather than starting from zero:

| Path | What it is |
| --- | --- |
| `src/components/displacement-sphere/` | Perlin-noise displaced sphere, full GLSL vertex + fragment shaders, theme-aware, disposes correctly |
| `src/components/particle-field/` | 150-node drifting particle network with proximity-linked lines, custom point shader, pointer parallax |
| `src/components/skill-constellation/` | Fibonacci-sphere of canvas-texture text sprites inside a wireframe icosahedron, drag to spin |
| `src/components/reveal/` | framer-motion scroll reveal + stagger group |
| `src/components/scramble-text/` | Character-scramble decode effect |
| `src/components/scroll-progress/` | Spring-damped scroll progress bar |
| `src/lib/three-utils.js` | `cleanScene` / `cleanMaterial` / `cleanRenderer` / `removeLights` |
| `src/lib/hooks.js` | `useInViewport`, `useWindowSize`, breakpoint tokens |

You may add dependencies. `@react-three/fiber@9.6.1` and
`@react-three/drei@10.7.7` are React 19 compatible and available. Prefer
generating geometry in code over sourcing external 3D model files — the site
must stay self-contained and fast.

---

## 4. Quality bar — a design is not done until all pass

1. `npx eslint src --max-warnings=0` → zero output
2. `npm run build` → succeeds, every route prerendered
3. Server actually runs; all 8 route types return 200, unknown path returns 404
4. No horizontal overflow at 375px **or** 1440px
5. Both light and dark themes work — the theme toggle must keep working
6. `:focus-visible` outlines survive on every interactive element
7. **`prefers-reduced-motion: reduce` must meaningfully disable motion** —
   no parallax, no autoplay loops, no scroll-jacking. This is an
   accessibility requirement, not a nicety.
8. Every WebGL context disposes on unmount, pauses off-screen, and caps
   `devicePixelRatio` — no leaked contexts, no pinned CPU on a background tab
9. No console errors

Report honestly. Do not claim a check you did not run.

---

## 5. Scrollbar and layout invariants

- Scrollbar stays hidden (`scrollbar-width: none` + `::-webkit-scrollbar`)
- `--page-width: 100%` — full-bleed; no centred max-width container
- Long-form text stays capped by `--prose-width`
- `.prose` global class is used by `/work`, `/freelance`, `/open-source` and
  project pages — it must keep working. Grep before repurposing `.sheet`,
  `.ruled` or `.hand`.
