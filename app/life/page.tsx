"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { LifeRuleDemo } from "@/components/LifeRuleDemo";
import { LifeGliderDemo } from "@/components/LifeGliderDemo";
import { Reveal } from "@/components/Reveal";

// Seeds chosen so the rule story plays out over several generations. The
// demos run on a 7×7 grid (centred) and loop after `cycleSteps`.
//
// BIRTH (B3) — L-tromino → a fourth cell is born at the corner, forming a
//   stable Block. Watch the new cell appear at step 1.
const SEED_BIRTH = [
  [0, 0], [1, 0], [0, 1],
] as const;
// SURVIVE (S2/S3) — Blinker oscillates horizontal ↔ vertical forever.
const SEED_SURVIVE3 = [
  [0, 1], [1, 1], [2, 1],
] as const;
// UNDERPOPULATION — A diagonal of 5 isolated cells progressively dies from
// the outside in: each step strips the endpoints until nothing remains.
const SEED_UNDERPOP = [
  [0, 0], [1, 1], [2, 2], [3, 3], [4, 4],
] as const;
// OVERPOPULATION — A plus-shape briefly explodes, then collapses to four
// disconnected cells, then dies entirely. Visible cascade of over-crowding.
const SEED_OVERPOP = [
  [1, 0], [0, 1], [1, 1], [2, 1], [1, 2],
] as const;

const GLIDER = [
  [2, 1], [3, 2], [1, 3], [2, 3], [3, 3],
] as const;
const LWSS = [
  [1, 1], [4, 1], [5, 2], [1, 3], [5, 3], [2, 4], [3, 4], [4, 4], [5, 4],
] as const;

export default function LifeStory() {
  const { s, u } = useI18n();
  const page = s.pages.life;
  const [sec0, sec1, sec2, sec3] = page.sections;

  return (
    <main className="relative isolate min-h-screen pb-32 pt-24 px-6">
      <div className="fixed inset-0 -z-10 grid-bg opacity-30 pointer-events-none" />
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-signal-cyan/10 via-transparent to-ink-950 pointer-events-none" />

      {/* Hero */}
      <section className="max-w-5xl mx-auto text-center space-y-7 mb-32">
        <Reveal>
          <div className="font-mono text-[10px] tracking-widest2 text-signal-cyan uppercase">
            {page.pretitle}
          </div>
        </Reveal>
        <Reveal delay={120}>
          <h1 className="math-italic text-6xl md:text-8xl leading-[0.95] tracking-tight">{page.title}</h1>
        </Reveal>
        <Reveal delay={250}>
          <p className="text-2xl md:text-3xl math-italic text-ink-200 leading-snug">{page.tagline}</p>
        </Reveal>
        <Reveal delay={380}>
          <p className="text-ink-200 max-w-2xl mx-auto leading-relaxed">{page.intro}</p>
        </Reveal>
        <Reveal delay={500}>
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/life/sandbox"
              className="px-6 py-3 rounded-full border border-signal-cyan/70 bg-signal-cyan/10 hover:bg-signal-cyan/20 text-signal-cyan font-mono text-xs uppercase tracking-widest2 transition-colors"
            >
              {page.ctaInteractive}
            </Link>
            <Link
              href="/"
              className="px-6 py-3 rounded-full border hairline hover:border-ink-300/50 text-ink-200 hover:text-ink-100 font-mono text-xs uppercase tracking-widest2 transition-colors"
            >
              {u.back}
            </Link>
          </div>
        </Reveal>
        <Reveal delay={620}>
          <div className="rounded-md border hairline bg-ink-950/60 max-w-md mx-auto p-3 font-mono text-base text-ink-100 mt-6 float-gentle">
            Born 3 · Survive 2,3 · else die
          </div>
        </Reveal>
      </section>

      {/* Section 1 — four rules */}
      <section className="max-w-5xl mx-auto mb-32 space-y-8">
        <Reveal>
          <Card pretitle={sec0.pretitle} title={sec0.title} body={sec0.body} accent="text-signal-cyan" />
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Reveal delay={60}>
            <LifeRuleDemo
              initial={SEED_BIRTH}
              label="Birth · B3"
              caption="A dead cell with exactly three live neighbours flips on. Watch an L-tromino grow a fourth cell and settle as a stable Block."
              accent="text-signal-violet"
              cycleSteps={6}
              holdMs={700}
            />
          </Reveal>
          <Reveal delay={150}>
            <LifeRuleDemo
              initial={SEED_SURVIVE3}
              label="Survive · S2/S3"
              caption="A live cell with two or three live neighbours keeps living. A Blinker oscillates between horizontal and vertical forever."
              accent="text-signal-cyan"
              cycleSteps={8}
              holdMs={650}
            />
          </Reveal>
          <Reveal delay={240}>
            <LifeRuleDemo
              initial={SEED_UNDERPOP}
              label="Underpopulation"
              caption="A live cell with fewer than two neighbours dies. A diagonal of five cells progressively loses its endpoints until nothing is left."
              accent="text-signal-rose"
              cycleSteps={5}
              holdMs={750}
            />
          </Reveal>
          <Reveal delay={330}>
            <LifeRuleDemo
              initial={SEED_OVERPOP}
              label="Overpopulation"
              caption="A live cell with more than three neighbours dies. The Plus pattern briefly explodes outward, then suffocates and vanishes."
              accent="text-signal-amber"
              cycleSteps={5}
              holdMs={750}
            />
          </Reveal>
        </div>
      </section>

      {/* Section 2 — glider */}
      <section className="max-w-5xl mx-auto mb-32 space-y-8">
        <Reveal>
          <Card pretitle={sec1.pretitle} title={sec1.title} body={sec1.body} accent="text-signal-cyan" />
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Reveal delay={80}>
            <LifeGliderDemo
              cells={GLIDER}
              label="The Glider"
              caption="Five cells, repeats every four steps, shifted one diagonal."
              cols={18}
              rows={12}
              speedMs={180}
              accent="text-signal-cyan"
            />
          </Reveal>
          <Reveal delay={200}>
            <LifeGliderDemo
              cells={LWSS}
              label="Lightweight Spaceship"
              caption="Nine cells, cruises straight, period four."
              cols={20}
              rows={14}
              speedMs={180}
              accent="text-signal-violet"
            />
          </Reveal>
        </div>
      </section>

      {/* Section 3 */}
      <section className="max-w-4xl mx-auto mb-32">
        <Reveal>
          <Card pretitle={sec2.pretitle} title={sec2.title} body={sec2.body} accent="text-signal-cyan" />
        </Reveal>
      </section>

      {/* Section 4 */}
      <section className="max-w-4xl mx-auto mb-32">
        <Reveal>
          <Card pretitle={sec3.pretitle} title={sec3.title} body={sec3.body} accent="text-signal-cyan" />
        </Reveal>
      </section>

      {/* Final CTA */}
      <Reveal>
      <section className="max-w-3xl mx-auto text-center space-y-6 glass border hairline rounded-3xl p-10">
        <div className="math-italic text-3xl md:text-5xl leading-tight shimmer-text">
          Your turn.
        </div>
        <p className="text-ink-200 leading-relaxed">
          The Sandbox holds a 120×70 toroidal grid, seven classic patterns and a draw-by-dragging tool. Open it, click around, see what survives.
        </p>
        <Link
          href="/life/sandbox"
          className="inline-block px-8 py-4 rounded-full border border-signal-cyan/70 bg-signal-cyan/10 hover:bg-signal-cyan/25 text-signal-cyan font-mono text-sm uppercase tracking-widest2 transition-colors"
        >
          {page.ctaInteractive}
        </Link>
      </section>
      </Reveal>
    </main>
  );
}

function Card({
  pretitle,
  title,
  body,
  accent,
}: {
  pretitle: string;
  title: string;
  body: string;
  accent: string;
}) {
  return (
    <article className="glass border hairline rounded-2xl p-8 md:p-10 space-y-4">
      <div className={`font-mono text-[10px] tracking-widest2 uppercase ${accent}`}>{pretitle}</div>
      <h2 className="math-italic text-3xl md:text-4xl leading-tight">{title}</h2>
      <p className="text-ink-100 leading-relaxed">{body}</p>
    </article>
  );
}
