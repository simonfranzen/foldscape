"use client";

import { Reveal } from "@/components/Reveal";
import { StoryPageShell, StoryCard } from "@/components/StoryPageShell";
import { useI18n } from "@/lib/i18n/context";
import { FourColorVoronoiHero } from "@/components/signature/FourColorVoronoiHero";

const ACCENT = "text-signal-teal";

// Three tiny example maps that force exactly 2, 3 or 4 colours. SVGs are
// rendered inline so they don't drag in any image assets, and the chosen
// palette echoes the four sidebar swatches in the Explorer. Each colour is
// also paired with a unique hatch pattern so the maps still parse under
// protanopia / deuteranopia — the visual constraint is colour-encoded AND
// texture-encoded.
const SWATCHES = ["#7df3ff", "#ffd166", "#b18cff", "#ff7ab6"];
const PATTERNS = ["fc-h", "fc-v", "fc-d1", "fc-d2"]; // horizontal, vertical, diag-up, diag-down

function ExampleMap({
  caption,
  title,
  needs,
  svg,
}: {
  caption: string;
  title: string;
  needs: number;
  svg: React.ReactNode;
}) {
  return (
    <div className="hairline space-y-3 rounded-xl border bg-ink-950/60 p-5">
      <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>{caption}</div>
      <h3 className="font-mono text-sm leading-tight text-ink-100">{title}</h3>
      <div className="hairline aspect-square overflow-hidden rounded-md border bg-ink-950">
        {svg}
      </div>
      <div className="flex items-center gap-2 font-mono text-[10px] text-ink-300">
        <span>needs</span>
        {SWATCHES.slice(0, needs).map((c, i) => (
          <svg
            key={i}
            width="14"
            height="14"
            className="inline-block rounded-sm border border-ink-700"
          >
            <rect width="14" height="14" fill={c} />
            <rect width="14" height="14" fill={`url(#${PATTERNS[i]})`} opacity="0.7" />
          </svg>
        ))}
        <span className="text-ink-400">· χ = {needs}</span>
      </div>
    </div>
  );
}

export default function FourColorStoryPage() {
  const { s } = useI18n();
  const page = s.pages.fourcolor;
  const [sec0, sec1, sec2, sec3] = page.sections;

  return (
    <StoryPageShell
      page={page}
      ctaHref="/fourcolor/explorer"
      accent={ACCENT}
      borderAccent="border-signal-teal/70"
      bgAccent="bg-signal-teal/10"
      hoverAccent="hover:bg-signal-teal/20"
      gradient="from-signal-teal/10"
      formulaBadge="χ(planar) ≤ 4"
      formulaLatex={"\\chi(\\text{planar graph}) \\leq 4"}
      finalLabel="Colour a map."
      signature={<FourColorVoronoiHero />}
    >
      {/* Hidden SVG holding pattern defs that the inline example maps and the
          legend swatches reference. Defining them once at the document scope
          lets every other SVG fragment fill via url(#fc-…). */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <defs>
          <pattern id="fc-h" width="6" height="6" patternUnits="userSpaceOnUse">
            <line x1="0" y1="3" x2="6" y2="3" stroke="rgba(5,6,10,0.5)" strokeWidth="1.2" />
          </pattern>
          <pattern id="fc-v" width="6" height="6" patternUnits="userSpaceOnUse">
            <line x1="3" y1="0" x2="3" y2="6" stroke="rgba(5,6,10,0.5)" strokeWidth="1.2" />
          </pattern>
          <pattern id="fc-d1" width="6" height="6" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="6" y2="6" stroke="rgba(5,6,10,0.5)" strokeWidth="1.2" />
          </pattern>
          <pattern id="fc-d2" width="6" height="6" patternUnits="userSpaceOnUse">
            <line x1="6" y1="0" x2="0" y2="6" stroke="rgba(5,6,10,0.5)" strokeWidth="1.2" />
          </pattern>
        </defs>
      </svg>
      <section className="mx-auto mt-16 max-w-5xl space-y-8">
        <StoryCard pretitle={sec0.pretitle} title={sec0.title} body={sec0.body} accent={ACCENT} />
        <StoryCard pretitle={sec1.pretitle} title={sec1.title} body={sec1.body} accent={ACCENT} />
        <StoryCard pretitle={sec2.pretitle} title={sec2.title} body={sec2.body} accent={ACCENT} />
        <StoryCard pretitle={sec3.pretitle} title={sec3.title} body={sec3.body} accent={ACCENT} />

        <Reveal>
          <figure className="glass hairline space-y-6 rounded-2xl border p-8 md:p-10">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              Three little maps · three forced colourings
            </div>
            <h2 className="math-italic text-2xl leading-tight md:text-3xl">
              From two colours to four — the lower-bound examples
            </h2>
            <p className="max-w-2xl text-sm leading-relaxed text-ink-200">
              The chromatic number χ of a map is the smallest number of colours that suffice. Two
              colours are enough for any tree-like layout; three suffice for an even cycle of
              regions; four is forced as soon as four regions become mutually adjacent. The theorem
              says: you never need a fifth.
            </p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <ExampleMap
                caption="χ = 2"
                title="Two halves of a disc"
                needs={2}
                svg={
                  <svg viewBox="0 0 200 200" className="block h-full w-full">
                    <rect width="200" height="200" fill="#06070d" />
                    <rect
                      x="20"
                      y="20"
                      width="80"
                      height="160"
                      fill={SWATCHES[0]}
                      opacity="0.85"
                      stroke="#0b0d18"
                      strokeWidth="2"
                    />
                    <rect
                      x="20"
                      y="20"
                      width="80"
                      height="160"
                      fill={`url(#${PATTERNS[0]})`}
                      opacity="0.55"
                    />
                    <rect
                      x="100"
                      y="20"
                      width="80"
                      height="160"
                      fill={SWATCHES[1]}
                      opacity="0.85"
                      stroke="#0b0d18"
                      strokeWidth="2"
                    />
                    <rect
                      x="100"
                      y="20"
                      width="80"
                      height="160"
                      fill={`url(#${PATTERNS[1]})`}
                      opacity="0.55"
                    />
                    <text
                      x="60"
                      y="108"
                      textAnchor="middle"
                      fontFamily="ui-monospace, monospace"
                      fontSize="11"
                      fill="#06070d"
                    >
                      A
                    </text>
                    <text
                      x="140"
                      y="108"
                      textAnchor="middle"
                      fontFamily="ui-monospace, monospace"
                      fontSize="11"
                      fill="#06070d"
                    >
                      B
                    </text>
                  </svg>
                }
              />
              <ExampleMap
                caption="χ = 3"
                title="An odd cycle of three"
                needs={3}
                svg={
                  <svg viewBox="0 0 200 200" className="block h-full w-full">
                    <rect width="200" height="200" fill="#06070d" />
                    {/* Three wedges meeting at the centre */}
                    <path
                      d="M 100 100 L 100 20 A 80 80 0 0 1 169 140 Z"
                      fill={SWATCHES[0]}
                      opacity="0.85"
                      stroke="#0b0d18"
                      strokeWidth="2"
                    />
                    <path
                      d="M 100 100 L 100 20 A 80 80 0 0 1 169 140 Z"
                      fill={`url(#${PATTERNS[0]})`}
                      opacity="0.55"
                    />
                    <path
                      d="M 100 100 L 169 140 A 80 80 0 0 1 31 140 Z"
                      fill={SWATCHES[1]}
                      opacity="0.85"
                      stroke="#0b0d18"
                      strokeWidth="2"
                    />
                    <path
                      d="M 100 100 L 169 140 A 80 80 0 0 1 31 140 Z"
                      fill={`url(#${PATTERNS[1]})`}
                      opacity="0.55"
                    />
                    <path
                      d="M 100 100 L 31 140 A 80 80 0 0 1 100 20 Z"
                      fill={SWATCHES[2]}
                      opacity="0.85"
                      stroke="#0b0d18"
                      strokeWidth="2"
                    />
                    <path
                      d="M 100 100 L 31 140 A 80 80 0 0 1 100 20 Z"
                      fill={`url(#${PATTERNS[2]})`}
                      opacity="0.55"
                    />
                    <text
                      x="130"
                      y="65"
                      textAnchor="middle"
                      fontFamily="ui-monospace, monospace"
                      fontSize="11"
                      fill="#06070d"
                    >
                      A
                    </text>
                    <text
                      x="125"
                      y="145"
                      textAnchor="middle"
                      fontFamily="ui-monospace, monospace"
                      fontSize="11"
                      fill="#06070d"
                    >
                      B
                    </text>
                    <text
                      x="65"
                      y="120"
                      textAnchor="middle"
                      fontFamily="ui-monospace, monospace"
                      fontSize="11"
                      fill="#06070d"
                    >
                      C
                    </text>
                  </svg>
                }
              />
              <ExampleMap
                caption="χ = 4"
                title="Four mutually adjacent regions (K₄)"
                needs={4}
                svg={
                  <svg viewBox="0 0 200 200" className="block h-full w-full">
                    <rect width="200" height="200" fill="#06070d" />
                    {/* One central region D surrounded by three petals A, B, C — each pair touches */}
                    <path
                      d="M 100 100 L 100 20 A 80 80 0 0 1 169 140 Z"
                      fill={SWATCHES[0]}
                      opacity="0.85"
                      stroke="#0b0d18"
                      strokeWidth="2"
                    />
                    <path
                      d="M 100 100 L 100 20 A 80 80 0 0 1 169 140 Z"
                      fill={`url(#${PATTERNS[0]})`}
                      opacity="0.55"
                    />
                    <path
                      d="M 100 100 L 169 140 A 80 80 0 0 1 31 140 Z"
                      fill={SWATCHES[1]}
                      opacity="0.85"
                      stroke="#0b0d18"
                      strokeWidth="2"
                    />
                    <path
                      d="M 100 100 L 169 140 A 80 80 0 0 1 31 140 Z"
                      fill={`url(#${PATTERNS[1]})`}
                      opacity="0.55"
                    />
                    <path
                      d="M 100 100 L 31 140 A 80 80 0 0 1 100 20 Z"
                      fill={SWATCHES[2]}
                      opacity="0.85"
                      stroke="#0b0d18"
                      strokeWidth="2"
                    />
                    <path
                      d="M 100 100 L 31 140 A 80 80 0 0 1 100 20 Z"
                      fill={`url(#${PATTERNS[2]})`}
                      opacity="0.55"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="26"
                      fill={SWATCHES[3]}
                      opacity="0.95"
                      stroke="#0b0d18"
                      strokeWidth="2"
                    />
                    <circle cx="100" cy="100" r="26" fill={`url(#${PATTERNS[3]})`} opacity="0.55" />
                    <text
                      x="130"
                      y="60"
                      textAnchor="middle"
                      fontFamily="ui-monospace, monospace"
                      fontSize="11"
                      fill="#06070d"
                    >
                      A
                    </text>
                    <text
                      x="125"
                      y="150"
                      textAnchor="middle"
                      fontFamily="ui-monospace, monospace"
                      fontSize="11"
                      fill="#06070d"
                    >
                      B
                    </text>
                    <text
                      x="65"
                      y="120"
                      textAnchor="middle"
                      fontFamily="ui-monospace, monospace"
                      fontSize="11"
                      fill="#06070d"
                    >
                      C
                    </text>
                    <text
                      x="100"
                      y="104"
                      textAnchor="middle"
                      fontFamily="ui-monospace, monospace"
                      fontSize="11"
                      fill="#06070d"
                    >
                      D
                    </text>
                  </svg>
                }
              />
            </div>
            <figcaption className="text-sm leading-relaxed text-ink-200">
              The third map is the complete graph K₄ drawn in the plane — every pair of regions
              shares a boundary, so every pair needs a different colour. Add a fifth region that
              touches all four and you cannot draw the result without one of the borders crossing
              another. That non-crossing constraint is the entire content of planarity, and it is
              the whole reason four is enough.
            </figcaption>
          </figure>
        </Reveal>
      </section>
    </StoryPageShell>
  );
}
