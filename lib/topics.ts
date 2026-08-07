// The atlas of mathematical curiosities. Each topic gets one entry here;
// the i18n layer fills in the name + tagline + body per locale.

export type TopicId =
  // First wave (already built)
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
  | "cantor"
  // Third wave
  | "boids"
  | "dla"
  | "langton"
  | "pascalmod"
  | "sternbrocot"
  | "ulam"
  | "aizawa"
  | "cardioid"
  | "galton"
  | "magpendulum"
  // Fourth wave — foundations & graphs
  | "godel"
  | "halting"
  | "pvsnp"
  | "rsa"
  | "mobius"
  | "eulerchar"
  | "konigsberg"
  | "fourcolor"
  | "smallworld"
  // Fifth wave — open problems + the AI math
  | "backprop"
  | "diffusion"
  | "riemann"
  // Sixth wave — logic & satisfiability
  | "sat";

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
    id: "sat",
    href: "/sat",
    status: "interactive",
    category: "logic",
    glyph: "⊨",
    formula: "(x ∨ ¬y) ∧ (y ∨ z)",
    sections: [
      { key: "story", href: "/sat" },
      { key: "explorer", href: "/sat/explorer" },
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
    status: "interactive",
    category: "chaos",
    glyph: "δ",
    formula: "xₙ₊₁ = r · xₙ(1 − xₙ)",
    sections: [
      { key: "story", href: "/logistic" },
      { key: "explorer", href: "/logistic/explorer" },
      { key: "sound", href: "/logistic/sound" },
    ],
  },
  {
    id: "lorenz",
    href: "/lorenz",
    status: "interactive",
    category: "chaos",
    glyph: "∞",
    formula: "σ(y − x), x(ρ − z) − y, xy − βz",
    sections: [
      { key: "story", href: "/lorenz" },
      { key: "explorer", href: "/lorenz/explorer" },
    ],
  },
  {
    id: "fourier",
    href: "/fourier",
    status: "interactive",
    category: "analysis",
    glyph: "∑sin",
    formula: "f(t) = Σ aₖ sin(kωt)",
    sections: [
      { key: "story", href: "/fourier" },
      { key: "explorer", href: "/fourier/explorer" },
      { key: "sound", href: "/fourier/sound" },
    ],
  },
  {
    id: "euler",
    href: "/euler",
    status: "interactive",
    category: "analysis",
    glyph: "eⁱᵖⁱ",
    formula: "eⁱᵖⁱ + 1 = 0",
    sections: [
      { key: "story", href: "/euler" },
      { key: "explorer", href: "/euler/explorer" },
    ],
  },
  {
    id: "banach",
    href: "/banach",
    status: "interactive",
    category: "paradox",
    glyph: "1 → 2",
    formula: "S = S₁ ⊔ S₂",
    sections: [
      { key: "story", href: "/banach" },
      { key: "explorer", href: "/banach/explorer" },
    ],
  },
  // Second wave
  {
    id: "lsystem",
    href: "/lsystem",
    status: "interactive",
    category: "geometry",
    glyph: "L",
    formula: "A → AB · B → A",
    sections: [
      { key: "story", href: "/lsystem" },
      { key: "explorer", href: "/lsystem/explorer" },
    ],
  },
  {
    id: "wang",
    href: "/wang",
    status: "interactive",
    category: "computation",
    glyph: "▣",
    formula: "edge-colour matching",
    sections: [
      { key: "story", href: "/wang" },
      { key: "explorer", href: "/wang/explorer" },
    ],
  },
  {
    id: "collatz",
    href: "/collatz",
    status: "interactive",
    category: "chaos",
    glyph: "3n+1",
    formula: "n/2  ·  3n + 1",
    sections: [
      { key: "story", href: "/collatz" },
      { key: "explorer", href: "/collatz/explorer" },
    ],
  },
  {
    id: "doublependulum",
    href: "/doublependulum",
    status: "interactive",
    category: "chaos",
    glyph: "ψ",
    formula: "θ̈₁ , θ̈₂ coupled",
    sections: [
      { key: "story", href: "/doublependulum" },
      { key: "explorer", href: "/doublependulum/explorer" },
    ],
  },
  {
    id: "bzr",
    href: "/bzr",
    status: "interactive",
    category: "chaos",
    glyph: "✻",
    formula: "BrO₃⁻ + Ce³⁺ → spirals",
    sections: [
      { key: "story", href: "/bzr" },
      { key: "explorer", href: "/bzr/explorer" },
    ],
  },
  {
    id: "turingpattern",
    href: "/turingpattern",
    status: "interactive",
    category: "analysis",
    glyph: "∇²u",
    formula: "∂u/∂t = D∇²u + f(u, v)",
    sections: [
      { key: "story", href: "/turingpattern" },
      { key: "explorer", href: "/turingpattern/explorer" },
    ],
  },
  {
    id: "sierpinski",
    href: "/sierpinski",
    status: "interactive",
    category: "geometry",
    glyph: "△",
    formula: "self-similarity at every scale",
    sections: [
      { key: "story", href: "/sierpinski" },
      { key: "explorer", href: "/sierpinski/explorer" },
    ],
  },
  {
    id: "chaosgame",
    href: "/chaosgame",
    status: "interactive",
    category: "geometry",
    glyph: "◇",
    formula: "midpoint to random vertex",
    sections: [
      { key: "story", href: "/chaosgame" },
      { key: "explorer", href: "/chaosgame/explorer" },
    ],
  },
  {
    id: "penrose",
    href: "/penrose",
    status: "interactive",
    category: "geometry",
    glyph: "✦",
    formula: "kite + dart, never repeats",
    sections: [
      { key: "story", href: "/penrose" },
      { key: "explorer", href: "/penrose/explorer" },
    ],
  },
  {
    id: "apollonian",
    href: "/apollonian",
    status: "interactive",
    category: "geometry",
    glyph: "◯",
    formula: "Descartes circle equation",
    sections: [
      { key: "story", href: "/apollonian" },
      { key: "explorer", href: "/apollonian/explorer" },
    ],
  },
  {
    id: "phi",
    href: "/phi",
    status: "interactive",
    category: "geometry",
    glyph: "φ",
    formula: "φ = (1 + √5) / 2",
    sections: [
      { key: "story", href: "/phi" },
      { key: "explorer", href: "/phi/explorer" },
    ],
  },
  {
    id: "buffon",
    href: "/buffon",
    status: "interactive",
    category: "analysis",
    glyph: "π",
    formula: "P(hit) = 2ℓ / (πd)",
    sections: [
      { key: "story", href: "/buffon" },
      { key: "explorer", href: "/buffon/explorer" },
    ],
  },
  {
    id: "hilberthotel",
    href: "/hilberthotel",
    status: "interactive",
    category: "paradox",
    glyph: "∞🏨",
    formula: "card(ℕ) = card(ℕ ∪ {x})",
    sections: [
      { key: "story", href: "/hilberthotel" },
      { key: "explorer", href: "/hilberthotel/explorer" },
    ],
  },
  {
    id: "gabrielshorn",
    href: "/gabrielshorn",
    status: "interactive",
    category: "paradox",
    glyph: "🎺",
    formula: "V < ∞, A = ∞",
    sections: [
      { key: "story", href: "/gabrielshorn" },
      { key: "explorer", href: "/gabrielshorn/explorer" },
    ],
  },
  {
    id: "cantor",
    href: "/cantor",
    status: "interactive",
    category: "paradox",
    glyph: "ℵ",
    formula: "card(ℝ) > card(ℕ)",
    sections: [
      { key: "story", href: "/cantor" },
      { key: "explorer", href: "/cantor/explorer" },
    ],
  },
  // Third wave
  {
    id: "boids",
    href: "/boids",
    status: "interactive",
    category: "computation",
    glyph: "⇶",
    formula: "separate · align · cohere",
    sections: [
      { key: "story", href: "/boids" },
      { key: "explorer", href: "/boids/explorer" },
    ],
  },
  {
    id: "dla",
    href: "/dla",
    status: "interactive",
    category: "chaos",
    glyph: "❅",
    formula: "random walk → stick",
    sections: [
      { key: "story", href: "/dla" },
      { key: "explorer", href: "/dla/explorer" },
    ],
  },
  {
    id: "langton",
    href: "/langton",
    status: "interactive",
    category: "computation",
    glyph: "L↻",
    formula: "white: turn R, flip · black: turn L, flip",
    sections: [
      { key: "story", href: "/langton" },
      { key: "explorer", href: "/langton/explorer" },
    ],
  },
  {
    id: "pascalmod",
    href: "/pascalmod",
    status: "interactive",
    category: "geometry",
    glyph: "Δ%",
    formula: "C(n, k) mod p",
    sections: [
      { key: "story", href: "/pascalmod" },
      { key: "explorer", href: "/pascalmod/explorer" },
    ],
  },
  {
    id: "sternbrocot",
    href: "/sternbrocot",
    status: "interactive",
    category: "analysis",
    glyph: "p⁄q",
    formula: "mediant: (a+c) / (b+d)",
    sections: [
      { key: "story", href: "/sternbrocot" },
      { key: "explorer", href: "/sternbrocot/explorer" },
    ],
  },
  {
    id: "ulam",
    href: "/ulam",
    status: "interactive",
    category: "analysis",
    glyph: "◌",
    formula: "spiral(n) ∈ ℙ ?",
    sections: [
      { key: "story", href: "/ulam" },
      { key: "explorer", href: "/ulam/explorer" },
    ],
  },
  {
    id: "aizawa",
    href: "/aizawa",
    status: "interactive",
    category: "chaos",
    glyph: "⌬",
    formula: "ẋ=(z−b)x−dy …",
    sections: [
      { key: "story", href: "/aizawa" },
      { key: "explorer", href: "/aizawa/explorer" },
    ],
  },
  {
    id: "cardioid",
    href: "/cardioid",
    status: "interactive",
    category: "geometry",
    glyph: "♡",
    formula: "r = 2a(1 − cos θ)",
    sections: [
      { key: "story", href: "/cardioid" },
      { key: "explorer", href: "/cardioid/explorer" },
    ],
  },
  {
    id: "galton",
    href: "/galton",
    status: "interactive",
    category: "analysis",
    glyph: "╲╱",
    formula: "Σ Bernoulli ⇒ 𝒩",
    sections: [
      { key: "story", href: "/galton" },
      { key: "explorer", href: "/galton/explorer" },
    ],
  },
  {
    id: "magpendulum",
    href: "/magpendulum",
    status: "interactive",
    category: "chaos",
    glyph: "⟁",
    formula: "p̈ = −Σᵢ kᵢ (p − mᵢ) / r³",
    sections: [
      { key: "story", href: "/magpendulum" },
      { key: "explorer", href: "/magpendulum/explorer" },
    ],
  },
  // Fourth wave — foundations & graph theory
  {
    id: "godel",
    href: "/godel",
    status: "interactive",
    category: "paradox",
    glyph: "G",
    formula: "G ⇔ ¬Prov(⌜G⌝)",
    sections: [
      { key: "story", href: "/godel" },
      { key: "explorer", href: "/godel/explorer" },
    ],
  },
  {
    id: "halting",
    href: "/halting",
    status: "interactive",
    category: "computation",
    glyph: "H?",
    formula: "halts(P, x) ∈ {⊤, ⊥}",
    sections: [
      { key: "story", href: "/halting" },
      { key: "explorer", href: "/halting/explorer" },
    ],
  },
  {
    id: "pvsnp",
    href: "/pvsnp",
    status: "interactive",
    category: "computation",
    glyph: "P=?NP",
    formula: "P  ⊆  NP  ⊆  EXP",
    sections: [
      { key: "story", href: "/pvsnp" },
      { key: "explorer", href: "/pvsnp/explorer" },
    ],
  },
  {
    id: "rsa",
    href: "/rsa",
    status: "interactive",
    category: "computation",
    glyph: "🔐",
    formula: "n = p · q",
    sections: [
      { key: "story", href: "/rsa" },
      { key: "explorer", href: "/rsa/explorer" },
    ],
  },
  {
    id: "mobius",
    href: "/mobius",
    status: "interactive",
    category: "geometry",
    glyph: "∞",
    formula: "one-sided surface",
    sections: [
      { key: "story", href: "/mobius" },
      { key: "explorer", href: "/mobius/explorer" },
    ],
  },
  {
    id: "eulerchar",
    href: "/eulerchar",
    status: "interactive",
    category: "geometry",
    glyph: "χ",
    formula: "V − E + F = 2",
    sections: [
      { key: "story", href: "/eulerchar" },
      { key: "explorer", href: "/eulerchar/explorer" },
    ],
  },
  {
    id: "konigsberg",
    href: "/konigsberg",
    status: "interactive",
    category: "analysis",
    glyph: "⌂⌂",
    formula: "Eulerian iff all deg even",
    sections: [
      { key: "story", href: "/konigsberg" },
      { key: "explorer", href: "/konigsberg/explorer" },
    ],
  },
  {
    id: "fourcolor",
    href: "/fourcolor",
    status: "interactive",
    category: "analysis",
    glyph: "🟥🟦",
    formula: "χ(planar) ≤ 4",
    sections: [
      { key: "story", href: "/fourcolor" },
      { key: "explorer", href: "/fourcolor/explorer" },
    ],
  },
  {
    id: "smallworld",
    href: "/smallworld",
    status: "interactive",
    category: "analysis",
    glyph: "·6·",
    formula: "L ∝ log N",
    sections: [
      { key: "story", href: "/smallworld" },
      { key: "explorer", href: "/smallworld/explorer" },
    ],
  },
  // Fifth wave — open problems + the AI math
  {
    id: "backprop",
    href: "/backprop",
    status: "interactive",
    category: "analysis",
    glyph: "∂L",
    formula: "w ← w − η∇w L",
    sections: [
      { key: "story", href: "/backprop" },
      { key: "explorer", href: "/backprop/explorer" },
    ],
  },
  {
    id: "diffusion",
    href: "/diffusion",
    status: "interactive",
    category: "chaos",
    glyph: "→←",
    formula: "x_t = √(1−β)·x_{t−1} + √β·ε",
    sections: [
      { key: "story", href: "/diffusion" },
      { key: "explorer", href: "/diffusion/explorer" },
    ],
  },
  {
    id: "riemann",
    href: "/riemann",
    status: "interactive",
    category: "analysis",
    glyph: "ζ",
    formula: "ζ(s) = 0 ⇒ ℜ(s) = ½",
    sections: [
      { key: "story", href: "/riemann" },
      { key: "explorer", href: "/riemann/explorer" },
    ],
  },
];

export const getTopic = (id: TopicId) => TOPICS.find((t) => t.id === id)!;
