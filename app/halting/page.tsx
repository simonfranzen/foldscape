"use client";

import Link from "next/link";
import { StoryPageShell, StoryCard } from "@/components/StoryPageShell";
import { Reveal } from "@/components/Reveal";
import { useI18n } from "@/lib/i18n/context";
import { Formula } from "@/components/Formula";
import { HaltingTapeHero } from "@/components/signature/HaltingTapeHero";

const ACCENT = "text-signal-cyan";

export default function HaltingStoryPage() {
  const { s, u } = useI18n();
  const page = s.pages.halting;
  const [sec0, sec1, sec2, sec3] = page.sections;

  return (
    <StoryPageShell
      page={page}
      ctaHref="/halting/explorer"
      accent="text-signal-cyan"
      borderAccent="border-signal-cyan/70"
      bgAccent="bg-signal-cyan/10"
      hoverAccent="hover:bg-signal-cyan/20"
      gradient="from-signal-cyan/10"
      formulaBadge="halts(P, x) ∈ {⊤, ⊥}"
      formulaLatex={"\\mathrm{halts}(P, x) \\in \\{\\top, \\bot\\}"}
      finalLabel="Try it."
      signature={<HaltingTapeHero />}
    >
      <section className="mx-auto mb-16 max-w-4xl space-y-8">
        <StoryCard pretitle={sec0.pretitle} title={sec0.title} body={sec0.body} accent={ACCENT} />
        <StoryCard pretitle={sec1.pretitle} title={sec1.title} body={sec1.body} accent={ACCENT} />
        <StoryCard pretitle={sec2.pretitle} title={sec2.title} body={sec2.body} accent={ACCENT} />
        <StoryCard pretitle={sec3.pretitle} title={sec3.title} body={sec3.body} accent={ACCENT} />
      </section>

      <Reveal>
        <section className="glass hairline mx-auto mb-12 mt-8 max-w-4xl space-y-6 rounded-2xl border p-8 md:p-10">
          <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
            Diagram · the diagonal program D
          </div>
          <h2 className="math-italic text-2xl leading-tight text-ink-100 md:text-3xl">
            Whatever H says about D on D, D does the opposite.
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="hairline space-y-3 rounded-md border bg-ink-950/40 p-5">
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
                Branch ⊤
              </div>
              <div className="text-sm leading-relaxed text-ink-100">
                <Formula expression="H(D, D) = \top" /> &nbsp;⇒&nbsp; D loops forever on D
              </div>
              <div className="text-sm leading-relaxed text-ink-300">
                But H said D halts. Contradiction.
              </div>
            </div>
            <div className="hairline space-y-3 rounded-md border bg-ink-950/40 p-5">
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
                Branch ⊥
              </div>
              <div className="text-sm leading-relaxed text-ink-100">
                <Formula expression="H(D, D) = \bot" /> &nbsp;⇒&nbsp; D halts immediately on D
              </div>
              <div className="text-sm leading-relaxed text-ink-300">
                But H said D loops. Contradiction.
              </div>
            </div>
          </div>
          <div className="space-y-2 rounded-md border border-signal-cyan/30 bg-signal-cyan/5 p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
              Conclusion
            </div>
            <p className="text-sm leading-relaxed text-ink-100">
              Both branches of the assumed halts oracle H break the definition of D. No total
              computable H can exist. The halting problem is undecidable.
            </p>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="mx-auto mb-12 mt-8 max-w-3xl text-center">
          <Link
            href="/"
            className="hairline inline-block rounded-full border px-6 py-3 font-mono text-xs uppercase tracking-widest2 text-ink-200 transition-colors hover:border-ink-300/50 hover:text-ink-100"
          >
            {u.back}
          </Link>
        </section>
      </Reveal>
    </StoryPageShell>
  );
}
