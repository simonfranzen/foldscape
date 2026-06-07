# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Next dev server at http://localhost:3000.
- `npm run build` — production build. Use this (not just `dev`) before reporting big changes as done.
- `npm run start` — serve a built bundle.
- `npm run typecheck` — `tsc --noEmit`. **The bar for "done" on any edit.** Strict mode is on.
- `npm test` — Vitest suite under `tests/` (jsdom env). `npm run test:watch` for the watch loop.
- `npm run lint` — ESLint 9 (flat config) over `app/`, `components/`, `lib/`, `tests/`. Warnings allowed, errors fail. `npm run lint:fix` auto-fixes the safe ones.
- `npm run format` — Prettier (+ `prettier-plugin-tailwindcss` for class ordering). `npm run format:check` is the CI variant.

Typecheck, tests, and lint are the gates. Prettier is the formatter — run `npm run format` before committing big changes.

### Tests (three tiers)

1. **Data invariants** (`tests/data-invariants.test.ts`) — every `TopicId` has an atlas card per locale, every edge endpoint exists, `TOPIC_LINKS` covers every id, a story page exists on disk for every id, EN ↔ DE key parity for the four i18n bundles (`MESSAGES`, `ATLAS`, `UI`, `BODIES`). Optional fields the other six locales legitimately omit are not checked — the call sites fall back to EN literals.
2. **Pure utility tests** (`tests/utilities.test.ts`) — `speakLatex` (exported from `components/Formula.tsx`) and the hub-derivation in `lib/topicHubs.ts`.
3. **Render smoke** (`tests/render-smoke.test.tsx`) — landing, one story page (`/banach`), and `TopicConstellation` mount without throwing. `next/navigation` is mocked; the canvas-based `LandingBackdrop` is stubbed because jsdom can't satisfy a 2d context.

## Big-picture architecture

### Topic registry → story page → explorer

Every "room" in the atlas is three things tied together by a `TopicId`:

1. **Entry in `lib/topics.ts`** — `TOPICS: Topic[]` with `id`, `href`, `status`, `category`, `glyph`, `formula`, `sections`. Category is one of `logic | computation | chaos | geometry | analysis | paradox` and drives accent colour + constellation cluster placement.
2. **Story page** at `app/<topic>/page.tsx` — long-form prose wrapped in `<StoryPageShell>`. Often carries its own inline `RICH_STORY: Record<Locale, RichStory>` constant (8 entries), but smaller pages pull from the shared `s.pages.<topic>` via `useI18n()`. **Both patterns coexist by design** — use the inline `RICH_STORY` pattern when a page has lots of locale-specific prose; keep small pages on shared stories.
3. **Explorer** at `app/<topic>/explorer/page.tsx` — the interactive playground. Same i18n choices apply.

`lib/topicEdges.ts` (curated affinities) + `lib/topicHubs.ts` (auto-derived hub-of-its-category by graph degree) feed the Atlas constellation on the landing page.

### i18n: five bundles, two patterns

8 locales (`en, de, es, fr, it, pt, sv, no`). The `I18nProvider` in `lib/i18n/context.tsx` exposes via `useI18n()`:

| key | source                                          | what it holds                                                |
| --- | ----------------------------------------------- | ------------------------------------------------------------ |
| `a` | `lib/i18n/atlas.ts`                             | Landing copy + per-topic title/tagline/body for atlas cards. |
| `s` | `lib/i18n/stories.ts` (+ `stories.<locale>.ts`) | Long-form per-topic stories (where they're shared).          |
| `u` | `lib/i18n/ui.ts`                                | Common UI strings (back, sound, further, applications).      |
| `t` | `lib/i18n/messages.ts`                          | Nav/footer/hero/section labels.                              |
| `b` | `lib/i18n/bodies.ts`                            | Body copy bundle.                                            |

For topic-specific prose, the **inline `RICH_STORY: Record<Locale, RichStory>` pattern** (see `app/banach/page.tsx`, `app/lorenz/page.tsx`) is preferred over fattening the shared stories bundle. Same pattern extends to explorers — they declare a local `RICH_EXPLORER` keyed by `Locale` if they need a lot of UI strings.

`AtlasDict` allows optional fields so newer keys only need EN+DE filled in; other locales fall through via `??`. Don't break this — make new i18n fields optional on the interface unless you fill all 8.

A `?lang=<locale>` query parameter overrides browser/localStorage detection (short `de` and IETF `de-DE` both resolve via `parseLangParam` in `lib/i18n/types.ts`); invalid values fall back to detection. When the user picks a locale in `LocaleSwitcher`, `I18nProvider.setLocale` mirrors it into the URL via `router.replace(..., { scroll: false })` so links stay shareable. `I18nProvider` reads `useSearchParams()` and therefore sits under a `<Suspense>` boundary in `app/layout.tsx`.

### Visual identity layers

- **Atlas constellation** (`components/TopicConstellation.tsx`) — landing-page navigation. Default sky shows only hubs (12 stars); category clusters expand on click. Pure SVG, deterministic hash-seeded layout (no force sim, no zoom). Edges are quadratic Beziers; labels carry an ink-950 stroke halo via `paint-order: stroke fill` so they read on top of lines. Mobile (<720px) falls back to a card list inside the same component.
- **Signature heroes** (`components/signature/*.tsx`) — per-topic visual identity in the hero slot of `<StoryPageShell signature={...}>`. Each is a self-contained SVG/Canvas component that respects `prefers-reduced-motion` with a static fallback. Examples: `GodelLoopHero` (text along a lemniscate), `HaltingTapeHero` (live Turing tape), `FourColorVoronoiHero` (re-coloured Voronoi with hatch patterns for protanopia), `MobiusStripHero`.
- **Demo components** under `components/` are inline interactives. DPR-aware, `requestAnimationFrame`-driven, accessible. Clamp numerical state to avoid NaN cascades on aggressive params (see `TuringGrayScott.tsx`).

### Formula rendering

`components/Formula.tsx` wraps KaTeX with:

- `output: "htmlAndMathml"` so screen readers get MathML.
- `aria-label` set to a best-effort speakable form of the LaTeX (overrideable via prop).
- Empty `span[role="math"]` gets a `min-height` CLS guard from `globals.css`.

KaTeX fonts are loaded from `public/fonts/` (the four hot variants are copied locally) with `font-display: swap` overrides + `<link rel="preload">` in `app/layout.tsx`. This kills the FOIT that the upstream `font-display: block` produces. **Don't revert this** — it's the fix for "formulas look weird for half a second".

### Accessibility + motion

- Skip-link in `app/layout.tsx` → `#main`.
- Global focus-visible ring in `globals.css` (violet accent).
- `@media (prefers-reduced-motion: reduce)` rule in `globals.css` kills `.reveal`, `.shimmer-text`, `.float-gentle`, `.pulse-glow`, plus a blanket `*` rule shortening transition/animation durations. Per-component canvases also check the media query and freeze.
- Browser-native view transitions are enabled via `experimental.viewTransition: true` in `next.config.mjs` + the `@view-transition { navigation: auto }` rule.

## Conventions specific to this repo

- "use client" at top of any component that uses state/refs/effect.
- No emojis in code unless they're already a topic `glyph` in `lib/topics.ts`.
- German prose is gender-neutral (_Studierende_, _Mathematiker:innen_). When writing German low-quotes, use `„text\"` (escaped) or French guillemets `«text»` — never `„text"` with an ASCII closing quote, because the unescaped `"` terminates the JS string and breaks the build.
- Inline comments explain **why** (constraint, invariant, surprising choice), not what. Look at `lib/topicEdges.ts` or `components/TopicConstellation.tsx` for the comment voice.
- Tailwind utilities first; custom CSS only in `app/globals.css` when utilities can't express it. Accent palette: `signal-violet`, `signal-cyan`, `signal-amber`, `signal-rose`.

## Adding a topic (workflow)

1. Add `TopicId` and a `TOPICS` entry in `lib/topics.ts`.
2. Optionally add affinity edges in `lib/topicEdges.ts`.
3. Atlas-card copy → either fill in `lib/i18n/atlas.ts` per locale, or rely on the EN fallback in `lib/i18n/placeholders.ts`.
4. `app/<topic>/page.tsx` — start from `app/apollonian/page.tsx` (simple) or `app/banach/page.tsx` (full inline `RICH_STORY` pattern). Use `<StoryPageShell>` for the hero; pass a `signature` if the topic has a hero artefact.
5. `app/<topic>/explorer/page.tsx` for the interactive room.
6. Demo components under `components/<Topic>...tsx`.
7. `npm run typecheck`.
