// Affinities between topics — the "verwandtschaften" rendered as constellation
// lines on the atlas landing. Pairs are listed once; the renderer treats them
// as undirected. The `kind` lets the renderer style families differently:
//
//   bridge — a marquee cross-category link the jury should see ("aha!")
//   family — same family, mutually reinforcing ideas
//   echo   — a quieter resonance worth showing
//
// Edges are deliberately curated, not exhaustive. Roughly two per topic on
// average — enough to feel like a sky, sparse enough to read.

import type { TopicId } from "./topics";

export type TopicEdgeKind = "bridge" | "family" | "echo";
export interface TopicEdge {
  a: TopicId;
  b: TopicId;
  kind: TopicEdgeKind;
}

export const TOPIC_EDGES: TopicEdge[] = [
  // ── Logic + foundations ────────────────────────────────────────────────
  { a: "godel", b: "halting", kind: "bridge" },
  { a: "halting", b: "pvsnp", kind: "bridge" },
  { a: "godel", b: "pvsnp", kind: "echo" },
  { a: "godel", b: "cantor", kind: "family" }, // diagonal arguments
  { a: "halting", b: "cantor", kind: "family" }, // diagonal arguments

  // ── Combinator / building-blocks ───────────────────────────────────────
  { a: "nand", b: "iota", kind: "family" },
  { a: "iota", b: "halting", kind: "echo" },
  { a: "rsa", b: "pvsnp", kind: "echo" },

  // ── Cellular automata / computation ────────────────────────────────────
  { a: "life", b: "rule110", kind: "family" },
  { a: "rule110", b: "wang", kind: "family" },
  { a: "life", b: "langton", kind: "family" },
  { a: "langton", b: "rule110", kind: "echo" },
  { a: "wang", b: "penrose", kind: "bridge" }, // aperiodic tilings
  { a: "boids", b: "smallworld", kind: "echo" },

  // ── Chaos & attractors ─────────────────────────────────────────────────
  { a: "lorenz", b: "aizawa", kind: "family" },
  { a: "aizawa", b: "logistic", kind: "family" },
  { a: "lorenz", b: "logistic", kind: "bridge" },
  { a: "logistic", b: "mandelbrot", kind: "bridge" }, // bifurcation ↔ M-set
  { a: "doublependulum", b: "magpendulum", kind: "family" },
  { a: "doublependulum", b: "lorenz", kind: "echo" },
  { a: "magpendulum", b: "mandelbrot", kind: "echo" }, // basins of attraction

  // ── Reaction–diffusion & emergence ─────────────────────────────────────
  { a: "bzr", b: "turingpattern", kind: "family" },
  { a: "turingpattern", b: "dla", kind: "echo" },
  { a: "dla", b: "sierpinski", kind: "echo" },

  // ── Geometry / fractals ────────────────────────────────────────────────
  { a: "sierpinski", b: "chaosgame", kind: "family" },
  { a: "chaosgame", b: "lsystem", kind: "family" },
  { a: "lsystem", b: "phi", kind: "echo" },
  { a: "sierpinski", b: "pascalmod", kind: "bridge" }, // Pascal mod 2 = Sierpinski
  { a: "apollonian", b: "sierpinski", kind: "family" },
  { a: "phi", b: "sternbrocot", kind: "family" },
  { a: "phi", b: "penrose", kind: "bridge" }, // golden ratio in Penrose
  { a: "cardioid", b: "mandelbrot", kind: "bridge" }, // main cardioid

  // ── Topology / surfaces / graphs ───────────────────────────────────────
  { a: "mobius", b: "eulerchar", kind: "family" },
  { a: "eulerchar", b: "konigsberg", kind: "family" },
  { a: "konigsberg", b: "fourcolor", kind: "family" },
  { a: "fourcolor", b: "smallworld", kind: "echo" },
  { a: "mobius", b: "konigsberg", kind: "bridge" }, // graph drawn on a surface

  // ── Analysis / numbers ─────────────────────────────────────────────────
  { a: "fourier", b: "euler", kind: "bridge" }, // e^{iωt}
  { a: "euler", b: "mandelbrot", kind: "echo" }, // complex plane
  { a: "fourier", b: "logistic", kind: "echo" }, // spectra of chaos
  { a: "buffon", b: "galton", kind: "family" },
  { a: "galton", b: "smallworld", kind: "echo" },
  { a: "ulam", b: "sternbrocot", kind: "echo" },
  { a: "ulam", b: "rsa", kind: "bridge" }, // primes
  { a: "ulam", b: "pascalmod", kind: "echo" },

  // ── Paradoxes ──────────────────────────────────────────────────────────
  { a: "hilberthotel", b: "cantor", kind: "family" },
  { a: "gabrielshorn", b: "fourier", kind: "echo" }, // analysis paradoxes
  { a: "banach", b: "hilberthotel", kind: "family" },
  { a: "banach", b: "cantor", kind: "echo" },

  // ── Fifth wave — Backprop, Diffusion, Riemann ─────────────────────────
  { a: "backprop", b: "logistic", kind: "bridge" }, // sigmoid + chain rule
  { a: "backprop", b: "fourier", kind: "echo" }, // signal processing math
  { a: "backprop", b: "pvsnp", kind: "echo" }, // training NP-hardness
  { a: "backprop", b: "diffusion", kind: "family" }, // modern AI math
  { a: "diffusion", b: "lorenz", kind: "bridge" }, // stochastic dynamics
  { a: "diffusion", b: "bzr", kind: "echo" }, // reaction–diffusion cousin
  { a: "diffusion", b: "turingpattern", kind: "family" }, // pattern formation via diffusion
  { a: "diffusion", b: "galton", kind: "echo" }, // Gaussian noise + CLT
  { a: "riemann", b: "ulam", kind: "bridge" }, // primes distribution
  { a: "riemann", b: "euler", kind: "family" }, // ζ comes from Euler's product
  { a: "riemann", b: "pvsnp", kind: "echo" }, // Millennium siblings
  { a: "riemann", b: "cantor", kind: "echo" }, // foundations / open problems
];

// Quick adjacency lookup keyed by topic id. Built once at module load.
export const TOPIC_NEIGHBORS: Record<TopicId, TopicId[]> = (() => {
  const map: Partial<Record<TopicId, Set<TopicId>>> = {};
  for (const e of TOPIC_EDGES) {
    (map[e.a] ??= new Set()).add(e.b);
    (map[e.b] ??= new Set()).add(e.a);
  }
  const out = {} as Record<TopicId, TopicId[]>;
  (Object.keys(map) as TopicId[]).forEach((k) => {
    out[k] = Array.from(map[k]!);
  });
  return out;
})();
