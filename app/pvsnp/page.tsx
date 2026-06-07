"use client";

import { StoryPageShell, StoryCard } from "@/components/StoryPageShell";
import { Reveal } from "@/components/Reveal";
import { useI18n } from "@/lib/i18n/context";

const ACCENT = "text-signal-rose";

const NP_COMPLETE_PROBLEMS: Array<{ name: string; gloss: string }> = [
  { name: "SAT", gloss: "Boolean satisfiability — the original Cook-Levin problem." },
  { name: "3-SAT", gloss: "SAT with clauses of length 3. The canonical NP-complete." },
  { name: "Hamiltonian Path", gloss: "Visit every vertex of a graph exactly once." },
  { name: "Subset Sum", gloss: "Pick a sub-multiset summing to a target integer." },
  { name: "Graph Colouring", gloss: "Colour vertices with k colours, no edge monochrome." },
  { name: "Clique", gloss: "Find a complete subgraph of size k." },
  { name: "Travelling Salesman (decision)", gloss: "Tour all cities within budget B." },
  { name: "Tetris / Solitaire", gloss: "Optimal play — Demaine, Hohenberger, Liben-Nowell 2003." },
  { name: "Sudoku N×N", gloss: "Generalised to n² × n² boards. Yato & Seta 2003." },
  { name: "Minesweeper consistency", gloss: "Kaye 2000 — given a board, is it consistent?" },
];

export default function PvsNPStoryPage() {
  const { s } = useI18n();
  const page = s.pages.pvsnp;
  const [sec0, sec1, sec2, sec3] = page.sections;

  return (
    <StoryPageShell
      page={page}
      ctaHref="/pvsnp/explorer"
      accent="text-signal-rose"
      borderAccent="border-signal-rose/70"
      bgAccent="bg-signal-rose/10"
      hoverAccent="hover:bg-signal-rose/20"
      gradient="from-signal-rose/10"
      formulaBadge="P ⊆ NP ⊆ EXP"
      formulaLatex={
        "\\mathrm{P} \\;\\subseteq\\; \\mathrm{NP} \\;\\subseteq\\; \\mathrm{PSPACE} \\;\\subseteq\\; \\mathrm{EXP}"
      }
      finalLabel="Watch the search."
    >
      <section className="mx-auto mb-16 max-w-4xl space-y-8">
        <StoryCard pretitle={sec0.pretitle} title={sec0.title} body={sec0.body} accent={ACCENT} />
        <StoryCard pretitle={sec1.pretitle} title={sec1.title} body={sec1.body} accent={ACCENT} />
        <StoryCard pretitle={sec2.pretitle} title={sec2.title} body={sec2.body} accent={ACCENT} />
        <StoryCard pretitle={sec3.pretitle} title={sec3.title} body={sec3.body} accent={ACCENT} />
      </section>

      {/* Venn diagram of complexity classes */}
      <Reveal>
        <section className="glass hairline mx-auto mb-12 mt-8 max-w-4xl space-y-6 rounded-2xl border p-8 md:p-10">
          <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
            Diagram · the complexity zoo, restricted view
          </div>
          <h2 className="math-italic text-2xl leading-tight text-ink-100 md:text-3xl">
            P sits inside NP sits inside EXP. NP-complete is the hardest rim of NP.
          </h2>
          <div className="flex justify-center">
            <svg
              viewBox="0 0 640 360"
              role="img"
              aria-label="Venn diagram of P, NP, NP-complete, PSPACE and EXP"
              className="h-auto w-full max-w-2xl"
            >
              {/* EXP outer */}
              <ellipse
                cx="320"
                cy="180"
                rx="300"
                ry="160"
                fill="rgba(125,243,255,0.05)"
                stroke="rgba(125,243,255,0.55)"
                strokeWidth="1.5"
              />
              <text x="40" y="40" fill="#7df3ff" fontFamily="ui-monospace, monospace" fontSize="14">
                EXP
              </text>

              {/* PSPACE */}
              <ellipse
                cx="320"
                cy="190"
                rx="250"
                ry="130"
                fill="rgba(167,139,250,0.06)"
                stroke="rgba(167,139,250,0.6)"
                strokeWidth="1.5"
              />
              <text x="90" y="80" fill="#a78bfa" fontFamily="ui-monospace, monospace" fontSize="13">
                PSPACE
              </text>

              {/* NP */}
              <ellipse
                cx="290"
                cy="200"
                rx="180"
                ry="100"
                fill="rgba(255,209,102,0.08)"
                stroke="rgba(255,209,102,0.7)"
                strokeWidth="1.5"
              />
              <text
                x="145"
                y="120"
                fill="#ffd166"
                fontFamily="ui-monospace, monospace"
                fontSize="13"
              >
                NP
              </text>

              {/* P */}
              <ellipse
                cx="240"
                cy="210"
                rx="80"
                ry="55"
                fill="rgba(125,243,255,0.12)"
                stroke="rgba(125,243,255,0.8)"
                strokeWidth="1.5"
              />
              <text
                x="225"
                y="215"
                fill="#7df3ff"
                fontFamily="ui-monospace, monospace"
                fontSize="14"
              >
                P
              </text>

              {/* NP-complete (a crescent at NP's rim, excluding P) */}
              <ellipse
                cx="380"
                cy="200"
                rx="80"
                ry="60"
                fill="rgba(255,122,182,0.18)"
                stroke="rgba(255,122,182,0.8)"
                strokeWidth="1.5"
              />
              <text
                x="345"
                y="205"
                fill="#ff7ab6"
                fontFamily="ui-monospace, monospace"
                fontSize="11"
              >
                NP-complete
              </text>

              {/* Caption: containment line */}
              <text
                x="320"
                y="335"
                fill="#cfd2dc"
                fontFamily="ui-monospace, monospace"
                fontSize="12"
                textAnchor="middle"
              >
                P ⊆ NP ⊆ PSPACE ⊆ EXP · P ⊊ EXP (time hierarchy theorem)
              </text>
            </svg>
          </div>
          <p className="text-sm leading-relaxed text-ink-300">
            P sits as a small disc inside NP. NP-complete problems are the hardest in NP — every
            other NP problem reduces to them. If a single NP-complete problem turned out to be in P,
            the rose disc would collapse into the cyan one and P would equal NP. The time hierarchy
            theorem already proves P ⊊ EXP, so at least one of the inclusions above is strict — we
            just don't know which.
          </p>
        </section>
      </Reveal>

      {/* Canonical NP-complete problems */}
      <Reveal>
        <section className="glass hairline mx-auto mb-12 mt-8 max-w-4xl space-y-6 rounded-2xl border p-8 md:p-10">
          <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
            Catalogue · canonical NP-complete problems
          </div>
          <h2 className="math-italic text-2xl leading-tight text-ink-100 md:text-3xl">
            Solve any of these in polynomial time — solve them all.
          </h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {NP_COMPLETE_PROBLEMS.map((p) => (
              <div
                key={p.name}
                className="hairline space-y-2 rounded-md border bg-ink-950/40 p-4 transition-colors hover:border-signal-rose/40"
              >
                <div className={`font-mono text-[11px] uppercase tracking-widest2 ${ACCENT}`}>
                  {p.name}
                </div>
                <div className="text-sm leading-relaxed text-ink-200">{p.gloss}</div>
              </div>
            ))}
          </div>
          <p className="pt-2 text-xs leading-relaxed text-ink-400">
            All inter-reducible in polynomial time. 3-SAT is the canonical instance — the Explorer
            is a working DPLL solver on it.
          </p>
        </section>
      </Reveal>
    </StoryPageShell>
  );
}
