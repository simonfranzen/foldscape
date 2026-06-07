"use client";

import { StoryPageShell, StoryCard } from "@/components/StoryPageShell";
import { Reveal } from "@/components/Reveal";
import { useI18n } from "@/lib/i18n/context";

const ACCENT = "text-signal-cyan";

// Platonic solids reference table. Standard values; every row sums to χ = 2.
const PLATONIC: ReadonlyArray<{
  name: string;
  V: number;
  E: number;
  F: number;
  faceShape: string;
}> = [
  { name: "Tetrahedron", V: 4, E: 6, F: 4, faceShape: "4 triangles" },
  { name: "Cube", V: 8, E: 12, F: 6, faceShape: "6 squares" },
  { name: "Octahedron", V: 6, E: 12, F: 8, faceShape: "8 triangles" },
  { name: "Dodecahedron", V: 20, E: 30, F: 12, faceShape: "12 pentagons" },
  { name: "Icosahedron", V: 12, E: 30, F: 20, faceShape: "20 triangles" },
];

interface GenusIcon {
  label: string;
  chi: number;
  genus: number;
  draw: React.ReactNode;
}

// Three small SVG icons: sphere (χ=2), torus (χ=0), double torus (χ=−2).
const GENUS_ICONS: ReadonlyArray<GenusIcon> = [
  {
    label: "Sphere",
    chi: 2,
    genus: 0,
    draw: (
      <g>
        <ellipse
          cx="80"
          cy="60"
          rx="42"
          ry="42"
          fill="rgba(125,243,255,0.10)"
          stroke="#7df3ff"
          strokeWidth="1.6"
        />
        <ellipse
          cx="80"
          cy="60"
          rx="42"
          ry="14"
          fill="none"
          stroke="rgba(125,243,255,0.45)"
          strokeWidth="1"
          strokeDasharray="3 3"
        />
        <ellipse
          cx="80"
          cy="60"
          rx="14"
          ry="42"
          fill="none"
          stroke="rgba(125,243,255,0.45)"
          strokeWidth="1"
          strokeDasharray="3 3"
        />
      </g>
    ),
  },
  {
    label: "Torus",
    chi: 0,
    genus: 1,
    draw: (
      <g>
        <ellipse
          cx="80"
          cy="60"
          rx="50"
          ry="30"
          fill="rgba(125,243,255,0.10)"
          stroke="#7df3ff"
          strokeWidth="1.6"
        />
        <path d="M 50 60 Q 80 80 110 60" fill="none" stroke="#7df3ff" strokeWidth="1.4" />
        <path
          d="M 56 56 Q 80 44 104 56"
          fill="none"
          stroke="rgba(125,243,255,0.55)"
          strokeWidth="1.2"
        />
      </g>
    ),
  },
  {
    label: "Double torus",
    chi: -2,
    genus: 2,
    draw: (
      <g>
        <ellipse
          cx="55"
          cy="60"
          rx="32"
          ry="22"
          fill="rgba(125,243,255,0.10)"
          stroke="#7df3ff"
          strokeWidth="1.6"
        />
        <ellipse
          cx="105"
          cy="60"
          rx="32"
          ry="22"
          fill="rgba(125,243,255,0.10)"
          stroke="#7df3ff"
          strokeWidth="1.6"
        />
        <path d="M 38 60 Q 55 73 72 60" fill="none" stroke="#7df3ff" strokeWidth="1.3" />
        <path d="M 88 60 Q 105 73 122 60" fill="none" stroke="#7df3ff" strokeWidth="1.3" />
        <path
          d="M 42 57 Q 55 49 68 57"
          fill="none"
          stroke="rgba(125,243,255,0.55)"
          strokeWidth="1.1"
        />
        <path
          d="M 92 57 Q 105 49 118 57"
          fill="none"
          stroke="rgba(125,243,255,0.55)"
          strokeWidth="1.1"
        />
      </g>
    ),
  },
];

export default function EulerCharStoryPage() {
  const { s } = useI18n();
  const page = s.pages.eulerchar;
  const [sec0, sec1, sec2, sec3] = page.sections;

  return (
    <StoryPageShell
      page={page}
      ctaHref="/eulerchar/explorer"
      accent="text-signal-cyan"
      borderAccent="border-signal-cyan/70"
      bgAccent="bg-signal-cyan/10"
      hoverAccent="hover:bg-signal-cyan/20"
      gradient="from-signal-cyan/10"
      formulaBadge="V − E + F = 2 − 2g"
      formulaLatex={"V - E + F = 2 - 2g"}
      finalLabel="Count and verify."
    >
      <section className="mx-auto mb-16 max-w-4xl space-y-8">
        <StoryCard pretitle={sec0.pretitle} title={sec0.title} body={sec0.body} accent={ACCENT} />
        <StoryCard pretitle={sec1.pretitle} title={sec1.title} body={sec1.body} accent={ACCENT} />
        <StoryCard pretitle={sec2.pretitle} title={sec2.title} body={sec2.body} accent={ACCENT} />
        <StoryCard pretitle={sec3.pretitle} title={sec3.title} body={sec3.body} accent={ACCENT} />
      </section>

      {/* Reference table: the five Platonic solids and their V − E + F = 2 */}
      <Reveal>
        <section className="glass hairline mx-auto mb-12 mt-8 max-w-4xl space-y-6 rounded-2xl border p-6 md:p-10">
          <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
            Reference · the five Platonic solids
          </div>
          <h2 className="math-italic text-2xl leading-tight text-ink-100 md:text-3xl">
            Every row sums to 2.
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full font-mono text-sm">
              <thead>
                <tr className="hairline border-b text-[10px] uppercase tracking-widest2 text-ink-300">
                  <th className="py-3 pr-4 text-left">Solid</th>
                  <th className="py-3 pr-4 text-left">Faces</th>
                  <th className="px-3 py-3 text-right">V</th>
                  <th className="px-3 py-3 text-right">E</th>
                  <th className="px-3 py-3 text-right">F</th>
                  <th className={`py-3 pl-3 text-right ${ACCENT}`}>V − E + F</th>
                </tr>
              </thead>
              <tbody>
                {PLATONIC.map((row) => (
                  <tr key={row.name} className="hairline border-b last:border-b-0">
                    <td className="py-3 pr-4 text-ink-100">{row.name}</td>
                    <td className="py-3 pr-4 text-ink-300">{row.faceShape}</td>
                    <td className="px-3 py-3 text-right text-ink-100">{row.V}</td>
                    <td className="px-3 py-3 text-right text-ink-100">{row.E}</td>
                    <td className="px-3 py-3 text-right text-ink-100">{row.F}</td>
                    <td className={`py-3 pl-3 text-right ${ACCENT}`}>{row.V - row.E + row.F}</td>
                  </tr>
                ))}
                <tr className="text-[11px] text-ink-400">
                  <td className="py-3 pr-4">Truncated icosahedron</td>
                  <td className="py-3 pr-4">12 pent. + 20 hex.</td>
                  <td className="px-3 py-3 text-right">60</td>
                  <td className="px-3 py-3 text-right">90</td>
                  <td className="px-3 py-3 text-right">32</td>
                  <td className={`py-3 pl-3 text-right ${ACCENT}`}>2</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm leading-relaxed text-ink-300">
            The five Platonic solids were already known to the ancient Greeks; Archimedes catalogued
            the thirteen semi-regular polyhedra including the truncated icosahedron — the soccer
            ball. Whatever the face shapes, V − E + F is always 2. Descartes noticed the pattern in
            a 1639 manuscript; Euler rediscovered and published it in 1750 / 1758.
          </p>
        </section>
      </Reveal>

      {/* Genus panel: sphere χ=2, torus χ=0, double torus χ=−2 */}
      <Reveal>
        <section className="glass hairline mx-auto mb-12 mt-8 max-w-4xl space-y-6 rounded-2xl border p-6 md:p-10">
          <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
            Topology · each handle costs you two
          </div>
          <h2 className="math-italic text-2xl leading-tight text-ink-100 md:text-3xl">
            χ = 2 − 2g
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {GENUS_ICONS.map((icon) => (
              <div
                key={icon.label}
                className="hairline flex flex-col items-center space-y-3 rounded-xl border bg-ink-950/40 p-5 text-center"
              >
                <svg
                  viewBox="0 0 160 120"
                  className="h-auto w-full max-w-[200px]"
                  role="img"
                  aria-label={`${icon.label}, Euler characteristic ${icon.chi}`}
                >
                  {icon.draw}
                </svg>
                <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
                  {icon.label}
                </div>
                <div className="font-mono text-sm text-ink-100">
                  g = {icon.genus} &nbsp;·&nbsp; χ = {icon.chi}
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm leading-relaxed text-ink-300">
            The sphere has no handles: g = 0, χ = 2. A torus has one handle: g = 1, χ = 0. A double
            torus has two: g = 2, χ = −2. Every closed orientable surface in three dimensions lives
            on this ladder. Gauss-Bonnet says the same number falls out of integrating the curvature
            — geometry and topology, locked together.
          </p>
        </section>
      </Reveal>
    </StoryPageShell>
  );
}
