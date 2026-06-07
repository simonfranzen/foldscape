# Contributing to Foldscape

Thank you for considering a contribution. Foldscape is built to be the kind
of mathematical reference its authors wished existed in school — clear,
visual, and honest. PRs that move it in that direction are very welcome.

## Quick links

- [Open an issue](https://github.com/zauberware/foldscape/issues/new/choose)
- [Project structure](README.md#project-structure)
- [Adding a topic](README.md#adding-a-topic)
- [License — CC BY 4.0](LICENSE)

## Ways to help

- **Translation improvements** — every topic ships in 8 languages, but
  many came from a single pass. Native-quality polishes are gold.
- **New topics** — a single rule that unfolds into something rich, that
  isn't covered yet. See the existing categories (logic, computation,
  chaos, geometry, analysis, paradox) for the kind of fit we're after.
- **Visualisation upgrades** — better Canvas demos, smoother animations,
  more interactive sliders.
- **Bug reports** — broken layouts, type-check failures, accessibility
  issues, language-switch oddities.
- **Documentation** — clearer code comments, better README/CONTRIBUTING
  copy, tutorial walk-throughs.

## Style guide

### Code

- TypeScript everywhere. `npx tsc --noEmit` must exit 0.
- Tailwind utility classes. Custom CSS lives in `app/globals.css`; use
  it only when Tailwind utilities can't express the intent.
- Components are functional, "use client" when they need state or refs.
- Avoid heavyweight viz libraries — Canvas 2D and SVG cover us.

### Prose

- **Tone**: warm, concrete, not condescending. Assume curiosity but not
  background. A 14-year-old should be able to grasp the encounter
  section; a professor should find the deep section accurate.
- **Citations**: when referencing classical results, name the year and
  the author (e.g. _Cantor 1891_, _Witten–Sander 1981_). Brief, not
  pedantic.
- **Math notation**: use Unicode where readable (πr², ℵ₀, z² + c).
  Avoid heavy LaTeX in prose — the badge component handles formulas.

### German

We use gender-neutral language: _Studierende_ (not _Studenten_),
_Mathematiker:innen_, _Forschende_, _Lehrer:innen_ etc. The colon-form
is preferred; substantivised participles (_Forschende_) where they read
naturally.

When you need a low-quote pair in German, use either escaped curly
quotes (`„text\"`) or French guillemets (`«text»`) — **never** the
pattern `„text"` with an ASCII closing quote, because the unescaped `"`
inside a JS string literal terminates the string and breaks the build.

### Commits

- One logical change per commit, short imperative subject (max ~70 chars).
- Body explains _why_, not _what_ — diffs show what.
- No "🤖 Generated …" trailers, no Co-Authored-By: Claude.

## Getting set up

```bash
git clone https://github.com/zauberware/foldscape
cd foldscape
npm install
npm run dev
```

Then open <http://localhost:3000>.

## Workflow

1. **Fork** the repository.
2. **Branch** from `main`. Use a topic-style name:
   `git checkout -b lorenz/rho-slider-fix`.
3. **Implement**. Type-check with `npx tsc --noEmit` and click through
   the affected pages in the browser.
4. **Open a PR** to `main`. Describe the change, link any issue, paste
   a screenshot if the change is visual.
5. We'll review, suggest tweaks, and merge.

## Translations: what to know

The bulk of localised content lives in **two** places per topic:

| Where                                         | What                                                                                                                      |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `lib/i18n/atlas.ts` (each locale block)       | The short title + tagline + 2–4-sentence body shown on the landing-page topic card.                                       |
| `app/<topic>/page.tsx` → `RICH_STORY[locale]` | Long-form hero (`page.intro`), `encounter` cards, the six `sections`, the inline demo captions, and the closing CTA copy. |

For a smaller targeted improvement, edit one locale's body inside the
relevant `RICH_STORY` entry, run `npx tsc --noEmit`, and open a PR.

Long-form essays for the first-wave topics also live in
`lib/i18n/stories.ts` (en + de) and `lib/i18n/stories.<locale>.ts`
(six other languages). For most NEW topics, the inline `RICH_STORY`
pattern is preferred because it bundles all content next to the page
that uses it.

## Demo components

Inline interactives live under `components/<Topic>...tsx`. Keep them:

- self-contained (no shared mutable state across instances),
- 60-fps friendly (clamp loops, use `requestAnimationFrame` and
  `cancelAnimationFrame` on cleanup),
- DPR-aware (`Math.min(window.devicePixelRatio || 1, 2)`),
- accessible where possible (`aria-label` on canvases, keyboard-friendly
  sliders).

If a demo numerically integrates an ODE or PDE, clamp the state range
after every step to avoid NaN cascades on aggressive parameters. (See
`components/TuringGrayScott.tsx` for an example.)

## Code of conduct

By participating you agree to abide by the
[Code of Conduct](CODE_OF_CONDUCT.md). Be kind. Assume good intent.

## License

By contributing, you agree your contribution is released under the
[CC BY 4.0 license](LICENSE), the same license as the rest of the
project.
