// Curated EML expressions. The first three are the paper's exact
// reconstructions; the rest are aesthetic compositions hand-tuned for
// domain-coloring beauty.

export interface Preset {
  id: string;
  title: string;       // human title (math italic)
  tagline: string;     // one-line intuition
  src: string;         // EML source
  depth: number;       // visual depth label
  // Optional default parameter for `p`
  p?: [number, number];
  // Optional view rect (centerX, centerY, halfHeight)
  view?: [number, number, number];
}

export const PRESETS: Preset[] = [
  {
    id: "exp",
    title: "eˣ",
    tagline: "The first miracle. Feed 1 to the right slot and log vanishes.",
    src: "eml(z, 1)",
    depth: 1,
    view: [0, 0, 2.4],
  },
  {
    id: "ln",
    title: "ln(z)",
    tagline: "Four nested EMLs. The logarithm crawls out of pure exponentials.",
    src: "eml(1, eml(eml(1, z), 1))",
    depth: 3,
    view: [0, 0, 2.4],
  },
  {
    id: "id",
    title: "id(z)",
    tagline: "Identity, reborn. Exponential of logarithm — depth four, value z.",
    src: "eml(eml(1, eml(eml(1, z), 1)), 1)",
    depth: 4,
    view: [0, 0, 2.4],
  },
  {
    id: "selfdual",
    title: "eᶻ − ln z",
    tagline: "The atom itself. EML applied to z, twice.",
    src: "eml(z, z)",
    depth: 1,
    view: [0, 0, 2.4],
  },
  {
    id: "twin",
    title: "double helix",
    tagline: "exp and log fold into each other.",
    src: "eml(eml(z, 1), eml(1, z))",
    depth: 2,
    view: [0, 0, 3.0],
  },
  {
    id: "param-vortex",
    title: "vortex",
    tagline: "A parametric eddy. Move p to bend the swirl.",
    src: "eml(eml(z, p), eml(p, z))",
    depth: 2,
    p: [0.6, 0.4],
    view: [0, 0, 2.6],
  },
  {
    id: "cathedral",
    title: "cathedral",
    tagline: "Stacked rosette. Branches multiply into stained glass.",
    src: "eml(eml(eml(z, 1), z), eml(eml(1, z), eml(z, p)))",
    depth: 4,
    p: [0.0, 1.0],
    view: [0, 0, 3.0],
  },
  {
    id: "nebula",
    title: "nebula",
    tagline: "Deep tree. Numerical overflow becomes light.",
    src: "eml(eml(eml(z, eml(1, z)), 1), eml(eml(p, z), eml(z, eml(z, 1))))",
    depth: 5,
    p: [0.2, 0.7],
    view: [0, 0, 2.2],
  },
];

export const getPreset = (id: string) => PRESETS.find((p) => p.id === id);
