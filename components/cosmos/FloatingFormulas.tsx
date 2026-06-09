"use client";

// Slow-drifting mathematical fragments behind the constellations. Each
// "presence" is a single formula (or symbol) rendered in serif italic,
// very low opacity, slowly translating + breathing. They give the cosmos
// the feeling that *something is alive* without ever competing with the
// stars or the prose. Eight pieces, four visible at any one time after
// fade math — sparse, on purpose.
//
// All motion is CSS-keyframe driven (no rAF loop, no scroll listener) so
// the layer costs essentially nothing per frame. Reduced-motion freezes
// the keyframes — see globals.css `.cosmos-drift`.

// Each piece carries its own drift angle so the layer doesn't feel like
// a tiled logo (user feedback: "sieht wie Logo-Teppich aus"). Distances
// are much bigger than v3 — 90–160 px range — and each formula uses a
// distinct CSS keyframe class so neighbours never move in lockstep.
const PIECES: {
  glyph: string;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  variant: 1 | 2 | 3 | 4;
}[] = [
  { glyph: "e^{i\\pi}+1=0", x: 8, y: 12, size: 28, delay: 0, duration: 60, variant: 1 },
  { glyph: "\\zeta(s)", x: 82, y: 8, size: 32, delay: 4, duration: 72, variant: 2 },
  { glyph: "\\aleph_0", x: 70, y: 78, size: 38, delay: 2, duration: 64, variant: 3 },
  { glyph: "\\nabla^2 u", x: 14, y: 84, size: 26, delay: 6, duration: 56, variant: 4 },
  { glyph: "\\varphi", x: 50, y: 30, size: 30, delay: 10, duration: 78, variant: 2 },
  { glyph: "P \\stackrel{?}{=} NP", x: 88, y: 42, size: 22, delay: 8, duration: 68, variant: 1 },
  { glyph: "\\sigma(y-x)", x: 22, y: 48, size: 22, delay: 12, duration: 62, variant: 3 },
  { glyph: "\\chi = V-E+F", x: 60, y: 60, size: 20, delay: 14, duration: 70, variant: 4 },
];

// Render formulas as plain Unicode-ish strings (the LaTeX-y text is just
// suggestive — we don't pull in KaTeX for the backdrop layer because that
// would explode the cost of "decorative drift" by an order of magnitude).
// What ships visually is a serif italic glyph stream like "e^iπ + 1 = 0".
function pretty(s: string): string {
  return s
    .replace(/\\pi/g, "π")
    .replace(/\\zeta/g, "ζ")
    .replace(/\\aleph_0/g, "ℵ₀")
    .replace(/\\nabla/g, "∇")
    .replace(/\\varphi/g, "φ")
    .replace(/\\sigma/g, "σ")
    .replace(/\\chi/g, "χ")
    .replace(/\\stackrel\{\?\}\{=\}/g, "≟")
    .replace(/\^2/g, "²")
    .replace(/\^\{i\\pi\}/g, "ⁱπ");
}

export function FloatingFormulas() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-20 overflow-hidden"
    >
      {PIECES.map((p, i) => (
        <span
          key={i}
          className={`cosmos-drift cosmos-drift-${p.variant} math-italic absolute text-ink-300`}
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            fontSize: `${p.size}px`,
            animationDelay: `-${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        >
          {pretty(p.glyph)}
        </span>
      ))}
    </div>
  );
}
