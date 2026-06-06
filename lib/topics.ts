// The atlas of mathematical curiosities. Each topic gets one entry here;
// the i18n layer fills in the name + tagline + body per locale.

export type TopicId =
  // First wave (already built)
  | "eml"
  | "nand"
  | "iota"
  | "life"
  | "rule110"
  | "logistic"
  | "mandelbrot"
  | "lorenz"
  | "fourier"
  | "euler"
  | "banach"
  // Second wave (placeholders)
  | "lsystem"
  | "wang"
  | "collatz"
  | "doublependulum"
  | "bzr"
  | "turingpattern"
  | "sierpinski"
  | "chaosgame"
  | "penrose"
  | "apollonian"
  | "phi"
  | "buffon"
  | "hilberthotel"
  | "gabrielshorn"
  | "cantor";

export type TopicStatus = "interactive" | "stub";
export type TopicCategory = "logic" | "computation" | "chaos" | "geometry" | "analysis" | "paradox";

export interface TopicSection {
  key: string;
  href: string;
}

export interface Topic {
  id: TopicId;
  href: string;
  status: TopicStatus;
  category: TopicCategory;
  glyph: string;
  formula?: string;
  sections?: TopicSection[];
}

export const TOPICS: Topic[] = [
  {
    id: "eml",
    href: "/eml",
    status: "interactive",
    category: "logic",
    glyph: "eml(x, y)",
    formula: "eˣ − ln y",
    sections: [
      { key: "cathedral", href: "/eml" },
      { key: "atelier", href: "/eml/atelier" },
      { key: "resonance", href: "/eml/resonance" },
    ],
  },
  {
    id: "mandelbrot",
    href: "/mandelbrot",
    status: "interactive",
    category: "chaos",
    glyph: "M",
    formula: "z → z² + c",
    sections: [
      { key: "story", href: "/mandelbrot" },
      { key: "explorer", href: "/mandelbrot/explorer" },
    ],
  },
  {
    id: "life",
    href: "/life",
    status: "interactive",
    category: "computation",
    glyph: "🛰",
    formula: "B3/S23",
    sections: [
      { key: "story", href: "/life" },
      { key: "sandbox", href: "/life/sandbox" },
    ],
  },
  {
    id: "nand",
    href: "/nand",
    status: "interactive",
    category: "logic",
    glyph: "↑",
    formula: "a ↑ b",
    sections: [
      { key: "story", href: "/nand" },
      { key: "builder", href: "/nand/builder" },
    ],
  },
  {
    id: "iota",
    href: "/iota",
    status: "interactive",
    category: "computation",
    glyph: "℩",
    formula: "℩x = xSK",
    sections: [
      { key: "story", href: "/iota" },
      { key: "reducer", href: "/iota/reducer" },
    ],
  },
  {
    id: "rule110",
    href: "/rule110",
    status: "interactive",
    category: "computation",
    glyph: "110",
    formula: "01101110₂",
    sections: [
      { key: "story", href: "/rule110" },
      { key: "simulator", href: "/rule110/simulator" },
    ],
  },
  {
    id: "logistic",
    href: "/logistic",
    status: "stub",
    category: "chaos",
    glyph: "δ",
    formula: "xₙ₊₁ = r · xₙ(1 − xₙ)",
  },
  {
    id: "lorenz",
    href: "/lorenz",
    status: "stub",
    category: "chaos",
    glyph: "∞",
    formula: "σ(y − x), x(ρ − z) − y, xy − βz",
  },
  {
    id: "fourier",
    href: "/fourier",
    status: "stub",
    category: "analysis",
    glyph: "∑sin",
    formula: "f(t) = Σ aₖ sin(kωt)",
  },
  {
    id: "euler",
    href: "/euler",
    status: "stub",
    category: "analysis",
    glyph: "eⁱᵖⁱ",
    formula: "eⁱᵖⁱ + 1 = 0",
  },
  {
    id: "banach",
    href: "/banach",
    status: "stub",
    category: "paradox",
    glyph: "1 → 2",
    formula: "S = S₁ ⊔ S₂",
  },
  // Second wave
  {
    id: "lsystem",
    href: "/lsystem",
    status: "stub",
    category: "geometry",
    glyph: "L",
    formula: "A → ABA · B → BBB",
  },
  {
    id: "wang",
    href: "/wang",
    status: "stub",
    category: "computation",
    glyph: "▣",
    formula: "edge-colour matching",
  },
  {
    id: "collatz",
    href: "/collatz",
    status: "stub",
    category: "chaos",
    glyph: "3n+1",
    formula: "n/2  ·  3n + 1",
  },
  {
    id: "doublependulum",
    href: "/doublependulum",
    status: "stub",
    category: "chaos",
    glyph: "ψ",
    formula: "θ̈₁ , θ̈₂ coupled",
  },
  {
    id: "bzr",
    href: "/bzr",
    status: "stub",
    category: "chaos",
    glyph: "✻",
    formula: "BrO₃⁻ + Ce³⁺ → spirals",
  },
  {
    id: "turingpattern",
    href: "/turingpattern",
    status: "stub",
    category: "analysis",
    glyph: "∇²u",
    formula: "∂u/∂t = D∇²u + f(u, v)",
  },
  {
    id: "sierpinski",
    href: "/sierpinski",
    status: "stub",
    category: "geometry",
    glyph: "△",
    formula: "self-similarity at every scale",
  },
  {
    id: "chaosgame",
    href: "/chaosgame",
    status: "stub",
    category: "geometry",
    glyph: "◇",
    formula: "midpoint to random vertex",
  },
  {
    id: "penrose",
    href: "/penrose",
    status: "stub",
    category: "geometry",
    glyph: "✦",
    formula: "kite + dart, never repeats",
  },
  {
    id: "apollonian",
    href: "/apollonian",
    status: "stub",
    category: "geometry",
    glyph: "◯",
    formula: "Descartes circle equation",
  },
  {
    id: "phi",
    href: "/phi",
    status: "stub",
    category: "geometry",
    glyph: "φ",
    formula: "φ = (1 + √5) / 2",
  },
  {
    id: "buffon",
    href: "/buffon",
    status: "stub",
    category: "analysis",
    glyph: "π",
    formula: "P(hit) = 2ℓ / (πd)",
  },
  {
    id: "hilberthotel",
    href: "/hilberthotel",
    status: "stub",
    category: "paradox",
    glyph: "∞🏨",
    formula: "card(ℕ) = card(ℕ ∪ {x})",
  },
  {
    id: "gabrielshorn",
    href: "/gabrielshorn",
    status: "stub",
    category: "paradox",
    glyph: "🎺",
    formula: "V < ∞, A = ∞",
  },
  {
    id: "cantor",
    href: "/cantor",
    status: "stub",
    category: "paradox",
    glyph: "ℵ",
    formula: "card(ℝ) > card(ℕ)",
  },
];

export const getTopic = (id: TopicId) => TOPICS.find((t) => t.id === id)!;
