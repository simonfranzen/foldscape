<div align="center">

# Foldscape

**An Atlas of Mathematical Curiosities**

From a single rule, a whole universe unfolds. Foldscape is a multilingual,
interactive atlas of mathematical ideas in which something almost trivially
small generates something absurdly intricate. Built for everyone — the curious
teenager, the working scientist, the professor looking for a story to tell.

[**Live demo →**](https://foldscape.zauberware.com) ·
[License: CC BY 4.0](LICENSE) ·
[Contributing](CONTRIBUTING.md)

</div>

---

## What's inside

36 topic rooms, each with a long-form story and an interactive playground:

- **Logic & computation** — Sheffer stroke (NAND), Iota combinator,
  Conway's Game of Life, Rule 110, Wang tiles, Boids, Langton's ant,
  halting problem, P vs NP, RSA.
- **Chaos & dynamics** — Logistic map, Lorenz attractor, Aizawa attractor,
  double pendulum, magnetic pendulum, BZ reaction, Collatz, DLA.
- **Geometry** — Mandelbrot set, L-systems, Sierpiński, chaos game,
  Penrose tilings, Apollonian packings, Pascal's triangle mod _n_,
  cardioid (coffee cup), Möbius/Klein, Euler characteristic, four colour
  theorem, golden ratio.
- **Analysis** — Fourier transform, Euler's identity, Buffon's needle,
  Galton board, Stern–Brocot tree, Ulam spiral, Königsberg bridges,
  small-world networks.
- **Paradox & foundations** — Banach–Tarski, Hilbert's hotel,
  Gabriel's horn, Cantor's diagonal, Gödel's incompleteness.

Every topic ships in **8 languages**: English, German, Spanish, French,
Italian, Portuguese, Swedish, Norwegian.

## Stack

- [Next.js 15](https://nextjs.org) (App Router, React 19)
- TypeScript
- Tailwind CSS
- Canvas 2D + SVG for visualisations — no heavyweight viz libraries
- Self-contained per-topic i18n via inline `RICH_STORY: Record<Locale, ...>`
  constants. Landing copy and shorter topic blurbs live in
  `lib/i18n/{atlas,messages,placeholders,stories}.ts`.

## Quick start

```bash
git clone https://github.com/zauberware/foldscape
cd foldscape
npm install
npm run dev
```

Open <http://localhost:3000>. Hot-reload works for everything including
i18n changes.

## Project structure

```
app/                       # Next.js routes
  page.tsx                 # Atlas landing page
  <topic>/page.tsx         # Long-form story for a topic
  <topic>/explorer/        # Interactive playground for that topic
components/                # Shared UI + inline interactive demos
  StoryPageShell.tsx       # Canonical hero + final CTA wrapper
  Reveal.tsx               # Intersection-observer fade-in animation
  <Topic>...Sim.tsx        # Per-topic Canvas 2D / SVG demos
lib/
  topics.ts                # Topic registry (ID, route, category, glyph, formula)
  i18n/
    types.ts               # Locale union + detection
    context.tsx            # React context provider
    atlas.ts               # Landing + topic-card strings (8 langs)
    messages.ts            # Nav, footer, hero, sections (8 langs)
    placeholders.ts        # English fallback for topic blurbs
    stories.ts             # Long-form per-topic stories (en + de full)
    stories.<locale>.ts    # Per-locale long-form stories
```

## Adding a topic

1. Add a new TopicId to `lib/topics.ts` (`type TopicId = ...`) and append an
   entry to the `TOPICS` array with `id`, `href`, `status`, `category`,
   `glyph`, `formula`, and `sections`.
2. Add a short blurb to `lib/i18n/placeholders.ts` (English fallback for all
   locales) and a localised override in each locale block of
   `lib/i18n/atlas.ts`.
3. Create `app/<topic>/page.tsx` with the canonical pattern — `RICH_STORY:
Record<Locale, RichStory>` const containing 8 locale entries, plus
   `StoryPageShell` for the hero.
4. Create `app/<topic>/explorer/page.tsx` for the interactive playground.
5. Place any custom Canvas/SVG demo components under `components/<Topic>...tsx`.

Run `npx tsc --noEmit` to verify. See an existing simple example like
`app/apollonian/` or `app/mandelbrot/` for the full pattern.

## Adding a translation

Each topic page carries its rich story inline (8 languages already filled).
To improve a translation:

- Hero copy: edit the `page` field of the relevant locale inside the topic
  page's `RICH_STORY` (`app/<topic>/page.tsx`).
- Encounter cards and sections: same file, the `encounter` and `sections`
  fields of the locale.
- Atlas-card title/tagline/blurb (shown on the landing page): edit the
  topic's entry inside `lib/i18n/atlas.ts` for the relevant locale block.

We follow gender-neutral language conventions for German prose (e.g.
_Studierende_ instead of _Studenten_, _Mathematiker:innen_ etc.).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Bug reports and PRs welcome,
especially new topics, translation improvements, and visualisation
upgrades.

## License

[CC BY 4.0](LICENSE) — share, remix, build on it freely, just credit
the project.

Curated by [Simon Franzen](https://github.com/simonfranzen) ·
[zauberware](https://www.zauberware.com).
