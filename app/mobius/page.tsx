"use client";

import { StoryPageShell, StoryCard } from "@/components/StoryPageShell";
import { Reveal } from "@/components/Reveal";
import { useI18n } from "@/lib/i18n/context";
import { MobiusStripHero } from "@/components/signature/MobiusStripHero";

const ACCENT = "text-signal-violet";

export default function MobiusStoryPage() {
  const { s } = useI18n();
  const page = s.pages.mobius;
  const [sec0, sec1, sec2, sec3] = page.sections;

  return (
    <StoryPageShell
      page={page}
      ctaHref="/mobius/explorer"
      accent="text-signal-violet"
      borderAccent="border-signal-violet/70"
      bgAccent="bg-signal-violet/10"
      hoverAccent="hover:bg-signal-violet/20"
      gradient="from-signal-violet/10"
      formulaBadge="χ = 0,  one side,  one edge"
      formulaLatex={"\\chi = 0, \\quad \\text{one side}, \\quad \\text{one edge}"}
      finalLabel="Take it apart."
      signature={<MobiusStripHero />}
    >
      <section className="mx-auto mb-16 max-w-4xl space-y-8">
        <StoryCard pretitle={sec0.pretitle} title={sec0.title} body={sec0.body} accent={ACCENT} />
        <StoryCard pretitle={sec1.pretitle} title={sec1.title} body={sec1.body} accent={ACCENT} />
        <StoryCard pretitle={sec2.pretitle} title={sec2.title} body={sec2.body} accent={ACCENT} />
        <StoryCard pretitle={sec3.pretitle} title={sec3.title} body={sec3.body} accent={ACCENT} />
      </section>

      {/* Identification diagram: flat strip with the half-twist gluing arrows */}
      <Reveal>
        <section className="glass hairline mx-auto mb-12 mt-8 max-w-4xl space-y-6 rounded-2xl border p-8 md:p-10">
          <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
            Diagram · the gluing identification
          </div>
          <h2 className="math-italic text-2xl leading-tight text-ink-100 md:text-3xl">
            A rectangle with two arrows pointing the opposite way.
          </h2>
          <div className="flex justify-center">
            <svg
              viewBox="0 0 640 280"
              role="img"
              aria-label="Flat rectangle with the two short edges identified with opposite orientation, producing a Möbius strip"
              className="h-auto w-full max-w-2xl"
            >
              {/* The flat rectangle */}
              <rect
                x="80"
                y="80"
                width="480"
                height="120"
                fill="rgba(167,139,250,0.08)"
                stroke="rgba(167,139,250,0.7)"
                strokeWidth="1.5"
              />

              {/* Top edge (free boundary) */}
              <line
                x1="80"
                y1="80"
                x2="560"
                y2="80"
                stroke="rgba(207,210,220,0.55)"
                strokeWidth="1.2"
                strokeDasharray="4 4"
              />
              {/* Bottom edge (free boundary) */}
              <line
                x1="80"
                y1="200"
                x2="560"
                y2="200"
                stroke="rgba(207,210,220,0.55)"
                strokeWidth="1.2"
                strokeDasharray="4 4"
              />

              {/* Left short edge with arrow pointing UP */}
              <line x1="80" y1="200" x2="80" y2="80" stroke="#a78bfa" strokeWidth="2.5" />
              <polygon points="80,76 74,90 86,90" fill="#a78bfa" />
              <text
                x="58"
                y="145"
                fill="#a78bfa"
                fontFamily="ui-monospace, monospace"
                fontSize="13"
              >
                ↑
              </text>

              {/* Right short edge with arrow pointing DOWN (opposite) */}
              <line x1="560" y1="80" x2="560" y2="200" stroke="#a78bfa" strokeWidth="2.5" />
              <polygon points="560,204 554,190 566,190" fill="#a78bfa" />
              <text
                x="572"
                y="145"
                fill="#a78bfa"
                fontFamily="ui-monospace, monospace"
                fontSize="13"
              >
                ↓
              </text>

              {/* Coordinates */}
              <text
                x="80"
                y="225"
                fill="#cfd2dc"
                fontFamily="ui-monospace, monospace"
                fontSize="12"
                textAnchor="middle"
              >
                (0, y)
              </text>
              <text
                x="560"
                y="225"
                fill="#cfd2dc"
                fontFamily="ui-monospace, monospace"
                fontSize="12"
                textAnchor="middle"
              >
                (1, 1−y)
              </text>
              <text
                x="80"
                y="70"
                fill="#8a90a4"
                fontFamily="ui-monospace, monospace"
                fontSize="11"
                textAnchor="middle"
              >
                0
              </text>
              <text
                x="560"
                y="70"
                fill="#8a90a4"
                fontFamily="ui-monospace, monospace"
                fontSize="11"
                textAnchor="middle"
              >
                1
              </text>

              {/* Identification rule */}
              <text
                x="320"
                y="40"
                fill="#a78bfa"
                fontFamily="ui-monospace, monospace"
                fontSize="14"
                textAnchor="middle"
              >
                identify (0, y) ∼ (1, 1 − y)
              </text>

              {/* A traced loop showing the path */}
              <path
                d="M 110 140 Q 320 100 550 140"
                fill="none"
                stroke="rgba(255,209,102,0.85)"
                strokeWidth="1.4"
                strokeDasharray="2 4"
              />
              <text
                x="320"
                y="265"
                fill="#8a90a4"
                fontFamily="ui-monospace, monospace"
                fontSize="11"
                textAnchor="middle"
              >
                the two short edges are glued with opposite orientation — that single flip is the
                whole story
              </text>
            </svg>
          </div>
          <p className="text-sm leading-relaxed text-ink-300">
            A Möbius strip is the quotient of the unit square [0, 1] × [0, 1] under the relation (0,
            y) ∼ (1, 1 − y): glue the two short sides together after flipping one. The two long
            sides remain free, but they meet up at the join — what looked like two boundary curves
            is in fact a single edge. The same diagram for the Klein bottle would add a second
            identification, gluing the long sides as well (this time with the same orientation),
            removing every boundary at once.
          </p>
        </section>
      </Reveal>
    </StoryPageShell>
  );
}
