"use client";

import { StoryPageShell, StoryCard } from "@/components/StoryPageShell";
import { Reveal } from "@/components/Reveal";
import { Formula } from "@/components/Formula";
import { useI18n } from "@/lib/i18n/context";
import { GodelLoopHero } from "@/components/signature/GodelLoopHero";

// Long-form story page for Gödel's Incompleteness Theorems.
// Canonical hero + section copy lives in lib/i18n/stories.ts (s.pages.godel)
// so it stays in step with the multi-locale story bundle.

const ACCENT = "text-signal-violet";

// A handful of symbols from the formal language, each with a Gödel number.
// Real Gödel numberings vary across sources; this table is illustrative and
// follows the textbook convention of small numbers for logical connectives
// and successive numbers for the equality/arithmetic constants.
const GODEL_SYMBOL_TABLE: Array<{ symbol: string; meaning: string; code: number }> = [
  { symbol: "¬", meaning: "not", code: 1 },
  { symbol: "∨", meaning: "or", code: 2 },
  { symbol: "∀", meaning: "for all", code: 3 },
  { symbol: "∃", meaning: "there exists", code: 4 },
  { symbol: "=", meaning: "equals", code: 5 },
  { symbol: "0", meaning: "zero", code: 6 },
  { symbol: "S", meaning: "successor", code: 7 },
  { symbol: "+", meaning: "plus", code: 8 },
  { symbol: "·", meaning: "times", code: 9 },
  { symbol: "(", meaning: "open", code: 10 },
];

export default function GodelStoryPage() {
  const { s } = useI18n();
  const page = s.pages.godel;
  const [sec0, sec1, sec2, sec3] = page.sections;

  return (
    <StoryPageShell
      page={page}
      ctaHref="/godel/explorer"
      accent={ACCENT}
      borderAccent="border-signal-violet/70"
      bgAccent="bg-signal-violet/10"
      hoverAccent="hover:bg-signal-violet/20"
      gradient="from-signal-violet/10"
      formulaBadge="G ⇔ ¬Prov(⌜G⌝)"
      formulaLatex={"G \\;\\Leftrightarrow\\; \\neg\\,\\mathrm{Prov}(\\ulcorner G \\urcorner)"}
      finalLabel={s.storyLabels.stepIntoIt}
      signature={<GodelLoopHero />}
    >
      <section className="mx-auto max-w-3xl space-y-10">
        {/* Section 1 — Hilbert's dream */}
        <StoryCard pretitle={sec0.pretitle} title={sec0.title} body={sec0.body} accent={ACCENT} />

        {/* Section 2 — Gödel numbering, with a visual table of symbol codes */}
        <StoryCard pretitle={sec1.pretitle} title={sec1.title} body={sec1.body} accent={ACCENT} />

        <Reveal>
          <div className="hairline glass space-y-5 rounded-2xl border p-6 md:p-8">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              Gödel numbering · a sample of symbol codes
            </div>
            <p className="max-w-2xl text-sm leading-relaxed text-ink-200">
              Each symbol of the formal language gets its own natural number. A full formula s₁s₂s₃…
              is then encoded as the single integer 2<sup>s₁</sup>·3<sup>s₂</sup>·5<sup>s₃</sup>·… —
              unique because every integer has a unique prime factorisation.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full font-mono text-sm">
                <thead>
                  <tr className="hairline border-b text-left text-ink-400">
                    <th className="py-2 pr-4">symbol</th>
                    <th className="py-2 pr-4">meaning</th>
                    <th className="py-2 pr-4 text-right">Gödel #</th>
                  </tr>
                </thead>
                <tbody>
                  {GODEL_SYMBOL_TABLE.map((row) => (
                    <tr
                      key={row.symbol}
                      className="hairline border-b transition-colors last:border-b-0 hover:bg-signal-violet/5"
                    >
                      <td className={`py-2 pr-4 text-lg ${ACCENT}`}>{row.symbol}</td>
                      <td className="py-2 pr-4 text-ink-200">{row.meaning}</td>
                      <td className="py-2 pr-4 text-right text-ink-100">{row.code}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="hairline border-t pt-2">
              <p className="text-xs leading-relaxed text-ink-300">
                Example: the tiny formula <span className="font-mono text-ink-100">0 = 0</span>{" "}
                (symbols 0, =, 0 → codes 6, 5, 6) becomes the Gödel number
                <span className={`font-mono ${ACCENT} ml-2`}>
                  2<sup>6</sup>·3<sup>5</sup>·5<sup>6</sup> = 64 · 243 · 15625 = 243 000 000.
                </span>
              </p>
            </div>
          </div>
        </Reveal>

        {/* Section 3 — The diagonal trick, with a self-reference loop diagram */}
        <StoryCard pretitle={sec2.pretitle} title={sec2.title} body={sec2.body} accent={ACCENT} />

        <Reveal>
          <div className="hairline glass space-y-6 rounded-2xl border p-6 md:p-8">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              The self-reference loop
            </div>
            <p className="max-w-2xl text-sm leading-relaxed text-ink-200">
              G's content and G's Gödel number are wired together. G asserts that the formula
              numbered ⌜G⌝ has no proof — and the formula numbered ⌜G⌝ is G itself. The loop closes
              on the diagonal.
            </p>
            <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-3">
              <div className="hairline space-y-2 rounded-lg border bg-ink-950/60 p-5">
                <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
                  sentence
                </div>
                <div className="math-italic text-2xl text-ink-100">G</div>
                <div className="text-xs leading-relaxed text-ink-300">«I am not provable in S»</div>
              </div>
              <div className="flex flex-col items-center justify-center gap-2 text-center">
                <div className={`font-mono text-3xl ${ACCENT}`}>↔</div>
                <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                  arithmetic equivalence
                </div>
                <div className={ACCENT}>
                  <Formula
                    expression={"\\neg\\,\\exists x\\;\\mathrm{Prov}(x,\\ulcorner G \\urcorner)"}
                    size="md"
                  />
                </div>
              </div>
              <div className="hairline space-y-2 rounded-lg border bg-ink-950/60 p-5">
                <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
                  Gödel number
                </div>
                <div className="math-italic text-2xl text-ink-100">⌜G⌝</div>
                <div className="text-xs leading-relaxed text-ink-300">
                  the natural number that encodes G itself
                </div>
              </div>
            </div>
            <div className="hairline grid grid-cols-1 gap-3 border-t pt-3 text-xs md:grid-cols-2">
              <div className="hairline space-y-1 rounded-md border bg-ink-950/40 p-3">
                <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
                  if G is provable
                </div>
                <div className="leading-relaxed text-ink-200">
                  S proves a sentence that says «I have no proof» — the system is inconsistent.
                </div>
              </div>
              <div className="hairline space-y-1 rounded-md border bg-ink-950/40 p-3">
                <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
                  if G is not provable
                </div>
                <div className="leading-relaxed text-ink-200">
                  Then what G claims is exactly true — true, yet unprovable in S.
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Section 4 — Where it spread */}
        <StoryCard pretitle={sec3.pretitle} title={sec3.title} body={sec3.body} accent={ACCENT} />
      </section>
    </StoryPageShell>
  );
}
