"use client";

import { Reveal } from "@/components/Reveal";
import { StoryPageShell, StoryCard } from "@/components/StoryPageShell";
import { useI18n } from "@/lib/i18n/context";

const ACCENT = "text-signal-cyan";

export default function SmallWorldStoryPage() {
  const { s } = useI18n();
  const page = s.pages.smallworld;
  const [sec0, sec1, sec2, sec3] = page.sections;

  return (
    <StoryPageShell
      page={page}
      ctaHref="/smallworld/explorer"
      accent={ACCENT}
      borderAccent="border-signal-cyan/70"
      bgAccent="bg-signal-cyan/10"
      hoverAccent="hover:bg-signal-cyan/20"
      gradient="from-signal-cyan/10"
      formulaBadge="L ∝ log N,  C ≈ 0.7"
      formulaLatex={"L \\propto \\log N, \\quad C \\approx 0.7"}
      finalLabel="Shrink the world."
    >
      <section className="mx-auto mt-16 max-w-5xl space-y-8">
        <StoryCard pretitle={sec0.pretitle} title={sec0.title} body={sec0.body} accent={ACCENT} />
        <StoryCard pretitle={sec1.pretitle} title={sec1.title} body={sec1.body} accent={ACCENT} />
        <StoryCard pretitle={sec2.pretitle} title={sec2.title} body={sec2.body} accent={ACCENT} />
        <StoryCard pretitle={sec3.pretitle} title={sec3.title} body={sec3.body} accent={ACCENT} />

        <Reveal>
          <figure className="glass hairline space-y-6 rounded-2xl border p-8 md:p-10">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              Three networks, three regimes
            </div>
            <h2 className="math-italic text-2xl leading-tight md:text-3xl">
              Lattice · small world · random
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {[
                {
                  label: "Regular lattice",
                  sub: "p = 0 · high C, high L",
                  body: "Every node is tied to its neighbours. Friends-of-friends are friends. To reach the far side of the ring you take many short steps.",
                  p: 0,
                },
                {
                  label: "Watts-Strogatz",
                  sub: "p ≈ 0.1 · high C, low L",
                  body: "A handful of random shortcuts. Clustering survives; the diameter collapses. The small-world sweet spot.",
                  p: 0.1,
                },
                {
                  label: "Random graph",
                  sub: "p = 1 · low C, low L",
                  body: "Edges land anywhere. Path lengths are tiny, but the local triangles are gone — no community structure left.",
                  p: 1,
                },
              ].map((card) => (
                <div
                  key={card.label}
                  className="hairline space-y-3 rounded-xl border bg-ink-950/60 p-4"
                >
                  <div className="overflow-hidden rounded-md bg-ink-950">
                    <SmallNetworkSVG p={card.p} seed={card.label.length} />
                  </div>
                  <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
                    {card.sub}
                  </div>
                  <div className="math-italic text-lg leading-tight text-ink-100">{card.label}</div>
                  <p className="text-sm leading-relaxed text-ink-200">{card.body}</p>
                </div>
              ))}
            </div>
            <figcaption className="text-sm leading-relaxed text-ink-200">
              Same N = 24 nodes, same starting ring lattice with k = 3 neighbours per side. Only the
              rewiring probability p changes. The middle picture is the small-world regime —
              shortcuts (drawn as chords across the circle) shrink the average path length
              dramatically while local triangles, the source of clustering, are mostly preserved.
            </figcaption>
          </figure>
        </Reveal>
      </section>
    </StoryPageShell>
  );
}

// Deterministic Watts-Strogatz mini-graph for the comparison panel. Pure SVG,
// no client state needed — the seed makes the rewiring reproducible across
// renders so the three pictures stay stable.
function SmallNetworkSVG({ p, seed }: { p: number; seed: number }) {
  const N = 24;
  const k = 3;
  const R = 70;
  const cx = 90;
  const cy = 90;

  // Tiny seeded RNG (mulberry32) — keeps the pictures stable.
  let s = (seed * 9301 + 49297) >>> 0;
  const rand = () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  // Position on the ring.
  const pos = (i: number): { x: number; y: number } => {
    const a = (i / N) * 2 * Math.PI - Math.PI / 2;
    return { x: cx + R * Math.cos(a), y: cy + R * Math.sin(a) };
  };

  // Build edges: for each node, k forward neighbours. Rewire with probability p.
  const edges: Array<{ a: number; b: number; rewired: boolean }> = [];
  for (let i = 0; i < N; i++) {
    for (let j = 1; j <= k; j++) {
      const orig = (i + j) % N;
      if (rand() < p) {
        // Pick a random target that isn't i itself and isn't already a neighbour.
        let target = Math.floor(rand() * N);
        let tries = 0;
        while (
          (target === i ||
            edges.some((e) => (e.a === i && e.b === target) || (e.a === target && e.b === i))) &&
          tries < 20
        ) {
          target = Math.floor(rand() * N);
          tries++;
        }
        edges.push({ a: i, b: target, rewired: true });
      } else {
        edges.push({ a: i, b: orig, rewired: false });
      }
    }
  }

  return (
    <svg viewBox="0 0 180 180" className="block h-auto w-full">
      {edges.map((e, idx) => {
        const A = pos(e.a);
        const B = pos(e.b);
        return (
          <line
            key={idx}
            x1={A.x}
            y1={A.y}
            x2={B.x}
            y2={B.y}
            stroke={e.rewired ? "#7df3ff" : "#8a90a4"}
            strokeOpacity={e.rewired ? 0.9 : 0.45}
            strokeWidth={e.rewired ? 1.2 : 0.7}
          />
        );
      })}
      {Array.from({ length: N }, (_, i) => {
        const P = pos(i);
        return <circle key={i} cx={P.x} cy={P.y} r={2.6} fill="#7df3ff" />;
      })}
    </svg>
  );
}
