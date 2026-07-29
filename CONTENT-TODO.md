# Content still needed

Everything structural is built. These are the facts only you have — I left each
one empty rather than inventing it. **Every field below is wired up already: fill
it in and it renders; leave it blank and its section stays hidden.**

---

## 1. Confirm your status — `src/lib/content.js` → `profile.status`

I derived this from the dates on your tsenta profile (AIS ended Mar 2026, M.Sc.
ended Jul 2026, freelance listed as ongoing):

> "Consulting independently, open to forward-deployed roles"

It now appears in the hero, on `/about`, and in the contact copy. **Check it says
what you want it to say** — it is the first thing every visitor reads.

## 2. Your CV — `links.resume`

Put a PDF at `public/priyansh-gupta-cv.pdf`, then set:

```js
resume: '/priyansh-gupta-cv.pdf',
```

The "Download CV" button in the hero is hidden until this is set, so the site
never links to a 404.

## 3. Photos — `public/photos/`

There are 5 placeholder frames left (down from 8). Each shows its own label so
it is obvious what belongs there:

| Where | What |
|---|---|
| Home hero | A portrait |
| Home + `/about` | Graduation / campus |
| Each project page (×2) | Screenshots — captions are already written per project |

Add `src: '/photos/whatever.png'` next to the existing `alt` and `caption`.

## 4. How the numbers were measured — `outcomes[].basis`

The `~35%` and `~80%` claims are the least defensible thing on the site — no
method, no baseline, no sample size. Each headline outcome now has a `basis`
field that renders as small print under the number:

```js
{ value: '~35%', label: 'Fewer hallucinated or incorrect outputs',
  basis: 'Measured on N held-out tasks, judged by …, before vs after the critic pass.' }
```

Fill in the ones you can actually stand behind, and **delete the numbers you
cannot**. One credible figure beats five round ones.

## 5. The freelance overlap — `experienceNote`

Your freelance line runs Aug 2022 – Present, concurrent with two full-time AIS
roles. A reader notices immediately. One sentence closes it:

```js
export const experienceNote = 'Freelance work ran alongside my AIS role with …';
```

## 6. Freelance proof — `freelance.availability`, `freelance.caseStudies`, `freelance.testimonials`

This is the highest-value gap on the site. A buyer currently has no next step
except a cold email.

- **`availability`** — status, capacity, typical engagement length, rates.
  Each line renders only when non-empty.
- **`caseStudies`** — 2–3 anonymised: `{ sector, title, problem, work, result, duration }`.
  The whole section is hidden while the array is empty.
- **`testimonials`** — `{ quote, attribution }`, or your Upwork rating / JSS.

## 7. Response time — `contactMeta.responseTime`

Left blank deliberately — it is a promise on your behalf. Set it to something you
can honour ("within two working days") and it appears in the contact block.
Timezone (GST) is already there.

## 8. BlastR dissertation — `projects[2].evidence.paper`

Put the PDF in `public/` and set the path. The "Read the dissertation →" link
appears automatically.

## 9. Rewrite the project narratives in your own words

**The most important item.** Your profile gave one line per project; I expanded
each into ~500 words of problem/approach prose. It is plausible and consistent,
but it is *my* inference and *my* voice, and some specifics are probably wrong.

Read every `problem` and `approach` block in `content.js` as a draft to correct.
Adding one thing that went wrong on each project would do more for credibility
than anything else here.

---

## Before deploying

Set the canonical origin, or every OG tag and sitemap URL points at localhost:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

`src/lib/site.js` falls back to `http://localhost:3000` for local builds only.
