"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { MandelOrbitDemo } from "@/components/MandelOrbitDemo";
import { MandelMini } from "@/components/MandelMini";
import { Reveal } from "@/components/Reveal";

export default function MandelbrotStory() {
  const { a, s, u } = useI18n();
  const page = s.pages.mandelbrot;
  const [sec0, sec1, sec2, sec3] = page.sections;

  return (
    <main className="relative isolate min-h-screen pb-32 pt-24 px-6">
      <div className="fixed inset-0 -z-10 grid-bg opacity-30 pointer-events-none" />
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-signal-amber/10 via-transparent to-ink-950 pointer-events-none" />

      {/* Hero */}
      <section className="max-w-5xl mx-auto text-center space-y-7 mb-32">
        <Reveal>
          <div className="font-mono text-[10px] tracking-widest2 text-signal-amber uppercase">
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
              href="/mandelbrot/explorer"
              className="px-6 py-3 rounded-full border border-signal-amber/70 bg-signal-amber/10 hover:bg-signal-amber/20 text-signal-amber font-mono text-xs uppercase tracking-widest2 transition-colors"
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
            z₀ = 0, zₙ₊₁ = zₙ² + c
          </div>
        </Reveal>
      </section>

      {/* Section 1 */}
      <section className="max-w-4xl mx-auto mb-32">
        <Reveal>
          <Card pretitle={sec0.pretitle} title={sec0.title} body={sec0.body} accent="text-signal-amber" />
        </Reveal>
      </section>

      {/* Section 2 — orbit demos */}
      <section className="max-w-5xl mx-auto mb-32 space-y-8">
        <Reveal>
          <Card pretitle={sec1.pretitle} title={sec1.title} body={sec1.body} accent="text-signal-amber" />
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Reveal delay={80}>
            <MandelOrbitDemo
              c={[-0.5, 0]}
              label="inside the set"
              accent="text-signal-cyan"
              maxSteps={80}
              bound={1.6}
              speedMs={140}
            />
          </Reveal>
          <Reveal delay={200}>
            <MandelOrbitDemo
              c={[-0.745, 0.113]}
              label="on the boundary"
              accent="text-signal-violet"
              maxSteps={120}
              bound={1.6}
              speedMs={120}
            />
          </Reveal>
          <Reveal delay={320}>
            <MandelOrbitDemo
              c={[0.4, 0.3]}
              label="outside the set"
              accent="text-signal-rose"
              maxSteps={40}
              bound={2.2}
              speedMs={140}
            />
          </Reveal>
        </div>
      </section>

      {/* Section 3 — boundary, with embedded mini render */}
      <section className="max-w-5xl mx-auto mb-32 space-y-8">
        <Reveal>
          <Card pretitle={sec2.pretitle} title={sec2.title} body={sec2.body} accent="text-signal-amber" />
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Reveal delay={100}>
            <div className="rounded-2xl border hairline bg-ink-950/40 p-4 space-y-2">
              <div className="font-mono text-[10px] tracking-widest2 text-signal-amber uppercase">
                The full set
              </div>
              <div className="aspect-square w-full bg-ink-950 rounded-md overflow-hidden border hairline">
                <MandelMini center={[-0.6, 0]} scale={1.4} maxIter={160} className="w-full h-full" />
              </div>
              <div className="text-xs text-ink-300">All of c, drawn at modest detail.</div>
            </div>
          </Reveal>
          <Reveal delay={250}>
            <div className="rounded-2xl border hairline bg-ink-950/40 p-4 space-y-2">
              <div className="font-mono text-[10px] tracking-widest2 text-signal-violet uppercase">
                Seahorse Valley
              </div>
              <div className="aspect-square w-full bg-ink-950 rounded-md overflow-hidden border hairline">
                <MandelMini center={[-0.75, 0.1]} scale={0.05} maxIter={350} className="w-full h-full" />
              </div>
              <div className="text-xs text-ink-300">Zoom 10² into the upper notch — and another universe.</div>
            </div>
          </Reveal>
        </div>
        {/* Deep-zoom ladder */}
        <Reveal delay={150}>
          <div className="rounded-2xl border hairline bg-ink-950/40 p-4 space-y-3">
            <div className="font-mono text-[10px] tracking-widest2 text-signal-amber uppercase">
              Zoom ladder · same point, ten times deeper at each step
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { center: [-0.7436438, 0.1318259] as [number, number], scale: 0.05, iter: 250, label: "10²" },
                { center: [-0.7436438, 0.1318259] as [number, number], scale: 0.005, iter: 450, label: "10³" },
                { center: [-0.7436438, 0.1318259] as [number, number], scale: 0.0005, iter: 700, label: "10⁴" },
                { center: [-0.7436438, 0.1318259] as [number, number], scale: 0.00005, iter: 1100, label: "10⁵" },
              ].map((z) => (
                <div key={z.label} className="space-y-1">
                  <div className="aspect-square w-full bg-ink-950 rounded-md overflow-hidden border hairline">
                    <MandelMini center={z.center} scale={z.scale} maxIter={z.iter} className="w-full h-full" />
                  </div>
                  <div className="font-mono text-[10px] text-ink-400 tracking-widest uppercase">{z.label}</div>
                </div>
              ))}
            </div>
            <div className="text-xs text-ink-300">
              The structure does not simplify. Each step finds new spirals, new mini-Mandelbrots, new filigree.
            </div>
          </div>
        </Reveal>
      </section>

      {/* Section 4 */}
      <section className="max-w-4xl mx-auto mb-32">
        <Reveal>
          <Card pretitle={sec3.pretitle} title={sec3.title} body={sec3.body} accent="text-signal-amber" />
        </Reveal>
      </section>

      {/* Final CTA */}
      <Reveal>
        <section className="max-w-3xl mx-auto text-center space-y-6 glass border hairline rounded-3xl p-10">
          <div className="math-italic text-3xl md:text-5xl leading-tight shimmer-text">
            Ready to fly?
          </div>
          <p className="text-ink-200 leading-relaxed">
            The Explorer lets you zoom into the boundary forever (down to 10⁹), jump to famous spots, and tune iteration depth live.
          </p>
          <Link
            href="/mandelbrot/explorer"
            className="inline-block px-8 py-4 rounded-full border border-signal-amber/70 bg-signal-amber/10 hover:bg-signal-amber/25 text-signal-amber font-mono text-sm uppercase tracking-widest2 transition-colors"
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
