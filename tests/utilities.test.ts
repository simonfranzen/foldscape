// Pure-function tests. These exercise the small set of non-trivial
// utilities the rest of the app builds on. Nothing here touches the DOM.

import { describe, it, expect } from "vitest";

import { speakLatex } from "@/components/Formula";
import { TOPIC_HUBS, isHub } from "@/lib/topicHubs";
import { TOPICS } from "@/lib/topics";
import { parse as parseIota, reduceTrace } from "@/lib/iota/reduce";
import { PROGRAM_DEFS, isPrime, runProgram } from "@/lib/halting/machine";

describe("speakLatex", () => {
  it("expands common macros to speakable words", () => {
    expect(speakLatex("a \\leq b")).toBe("a less or equal b");
    expect(speakLatex("\\forall x \\in A")).toBe("for all x in A");
    expect(speakLatex("\\neg p \\lor q")).toBe("not p or q");
  });

  it("expands fractions and roots structurally", () => {
    expect(speakLatex("\\frac{a}{b}")).toBe("a over b");
    expect(speakLatex("\\sqrt{x}")).toBe("square root of x");
  });

  it("rewrites superscripts and subscripts", () => {
    // Single-char and brace-wrapped forms both reduce to readable English.
    expect(speakLatex("x^2")).toBe("x to the 2");
    expect(speakLatex("x^{10}")).toBe("x to the 10");
    expect(speakLatex("a_n")).toBe("a sub n");
    expect(speakLatex("a_{n+1}")).toBe("a sub n+1");
  });

  it("collapses LaTeX spacing macros into normal whitespace", () => {
    // Multiple thin-space macros + braces should not leave residue.
    const out = speakLatex("\\,x\\;y\\:z");
    expect(out).not.toMatch(/\\/);
    expect(out).toMatch(/x +y +z/);
  });

  it("trims leading/trailing whitespace", () => {
    expect(speakLatex("  x  ")).toBe("x");
  });

  it("is idempotent on plain ASCII expressions", () => {
    expect(speakLatex("x + y = z")).toBe("x + y = z");
  });
});

describe("topic hubs derivation", () => {
  it("isHub agrees with TOPIC_HUBS set membership", () => {
    for (const t of TOPICS) {
      expect(isHub(t.id)).toBe(TOPIC_HUBS.has(t.id));
    }
  });

  it("derives at most HUBS_PER_CATEGORY × #categories hubs (= 12)", () => {
    expect(TOPIC_HUBS.size).toBeLessThanOrEqual(12);
  });

  it("picks at least one hub per category", () => {
    const cats = new Set(TOPICS.filter((t) => TOPIC_HUBS.has(t.id)).map((t) => t.category));
    // Six declared categories; the derivation must hit each.
    expect(cats.size).toBe(6);
  });

  it("derivation is deterministic across calls (frozen set)", () => {
    // Capture once, compare to a fresh snapshot: TOPIC_HUBS is computed once
    // at module load, so repeated reads must agree.
    const snap1 = Array.from(TOPIC_HUBS).sort();
    const snap2 = Array.from(TOPIC_HUBS).sort();
    expect(snap1).toEqual(snap2);
  });
});

describe("reduceTrace step limit", () => {
  // ι (ι (ι ι)) needs exactly nine rewrites to reach K.
  const term = () => parseIota("ι (ι (ι ι))");

  it("reports a normal form when the limit equals the steps needed", () => {
    const trace = reduceTrace(term(), 9);
    expect(trace.normal).toBe(true);
    expect(trace.hitLimit).toBe(false);
    expect(trace.steps).toHaveLength(10);
    expect(trace.steps[trace.steps.length - 1]).toBe("K");
  });

  it("reports the limit when one step is missing", () => {
    const trace = reduceTrace(term(), 8);
    expect(trace.normal).toBe(false);
    expect(trace.hitLimit).toBe(true);
    expect(trace.steps).toHaveLength(9);
  });

  it("still hits the limit on a term without normal form", () => {
    const trace = reduceTrace(parseIota("S I I (S I I)"), 30);
    expect(trace.normal).toBe(false);
    expect(trace.hitLimit).toBe(true);
  });
});

describe("halting explorer presets", () => {
  const preset = (id: string) => {
    const p = PROGRAM_DEFS.find((d) => d.id === id);
    if (!p) throw new Error(`unknown preset ${id}`);
    return p;
  };

  it("counts to 100 in 301 tape-machine steps", () => {
    const s = runProgram(preset("count-to-100"), 0, 10_000);
    expect(s.status).toBe("halted");
    expect(s.step).toBe(301);
  });

  it("runs the real Collatz orbit of 27: 111 Collatz steps, 446 machine steps", () => {
    const s = runProgram(preset("collatz-27"), 0, 10_000);
    expect(s.status).toBe("halted");
    expect(s.regs).toEqual({ n: 1, k: 111 });
    expect(s.step).toBe(446);
  });

  it("gives up on Collatz one step short and takes the start value from the input", () => {
    expect(runProgram(preset("collatz-27"), 0, 445).status).toBe("cap");
    const s = runProgram(preset("collatz-input"), 837_799, 10_000);
    expect(s.status).toBe("halted");
    expect(s.regs.k).toBe(524);
    expect(s.step).toBe(2098);
  });

  it("really searches for a Goldbach counterexample and finds none in budget", () => {
    const s = runProgram(preset("goldbach"), 0, 10_000);
    expect(s.status).toBe("cap");
    expect(s.regs.n).toBe(848);
    // The decomposition test the program relies on, checked independently.
    for (let n = 4; n <= 848; n += 2) {
      let found = false;
      for (let p = 2; p <= n - p; p++) if (isPrime(p) && isPrime(n - p)) found = true;
      expect(found).toBe(true);
    }
  });

  it("makes D do the opposite of the claimed answer", () => {
    expect(runProgram(preset("diagonal-d"), 0, 1000).status).toBe("halted");
    expect(runProgram(preset("diagonal-d"), 1, 1000).status).toBe("cap");
  });
});

// ---- Euler-characteristic meshes -------------------------------------------
// The explorer displays V − E + F straight from these meshes, so the meshes
// themselves have to be the surfaces their labels claim.

import { PRESETS as EULER_PRESETS, buildDoubleTorus, buildTorus } from "@/lib/eulerchar/meshes";
import type { Polyhedron as EulerMesh } from "@/lib/eulerchar/meshes";

// Number of connected components, by union-find over the edge list.
function eulerComponents(mesh: EulerMesh): number {
  const parent = mesh.vertices.map((_, i) => i);
  const find = (i: number): number => {
    while (parent[i] !== i) {
      parent[i] = parent[parent[i]];
      i = parent[i];
    }
    return i;
  };
  for (const [a, b] of mesh.edges) parent[find(a)] = find(b);
  return new Set(parent.map((_, i) => find(i))).size;
}

// A closed, consistently oriented surface uses every edge exactly twice, once
// in each direction. Returns false as soon as a directed edge repeats or is
// left without its opposite.
function eulerClosedOriented(mesh: EulerMesh): boolean {
  const directed = new Set<string>();
  for (const face of mesh.faces) {
    for (let i = 0; i < face.length; i++) {
      const key = `${face[i]}>${face[(i + 1) % face.length]}`;
      if (directed.has(key)) return false;
      directed.add(key);
    }
  }
  for (const key of directed) {
    const [a, b] = key.split(">");
    if (!directed.has(`${b}>${a}`)) return false;
  }
  return directed.size === 2 * mesh.edges.length;
}

// Each vertex must be surrounded by a single fan of faces, otherwise two
// sheets could touch in a point and the 2 − 2g formula would not apply.
function eulerVertexLinksAreCycles(mesh: EulerMesh): boolean {
  const next = mesh.vertices.map(() => new Map<number, number>());
  for (const face of mesh.faces) {
    const n = face.length;
    for (let i = 0; i < n; i++) {
      next[face[i]].set(face[(i + 1) % n], face[(i + n - 1) % n]);
    }
  }
  return next.every((link) => {
    if (link.size === 0) return false;
    const start = link.keys().next().value as number;
    let cur = start;
    let steps = 0;
    do {
      const nx = link.get(cur);
      if (nx === undefined) return false;
      cur = nx;
      steps++;
    } while (cur !== start && steps <= link.size);
    return cur === start && steps === link.size;
  });
}

describe("Euler-characteristic meshes", () => {
  const chi = (m: EulerMesh) => m.V - m.E + m.F;
  const byId = (prefix: string) => EULER_PRESETS.find((p) => p.id.startsWith(prefix))!;

  it("stores counts that match the mesh for every preset", () => {
    for (const p of EULER_PRESETS) {
      expect([p.id, p.V, p.E, p.F]).toEqual([
        p.id,
        p.vertices.length,
        p.edges.length,
        p.faces.length,
      ]);
      const used = new Set(p.faces.flat());
      expect([p.id, used.size]).toEqual([p.id, p.vertices.length]);
    }
  });

  it("builds every preset as one closed, oriented surface", () => {
    for (const p of EULER_PRESETS) {
      expect([p.id, eulerComponents(p)]).toEqual([p.id, 1]);
      expect([p.id, eulerClosedOriented(p)]).toEqual([p.id, true]);
      expect([p.id, eulerVertexLinksAreCycles(p)]).toEqual([p.id, true]);
    }
  });

  it("gives χ = 2 for all sphere-like presets", () => {
    const spheres = EULER_PRESETS.filter((p) => !p.id.includes("torus"));
    expect(spheres).toHaveLength(9);
    for (const p of spheres) expect([p.id, chi(p)]).toEqual([p.id, 2]);
  });

  it("gives χ = 0 for the torus and χ = −2 for the double torus", () => {
    expect(chi(byId("torus"))).toBe(0);
    const dt = byId("double-torus");
    expect(chi(dt)).toBe(-2);
    // 14 × 8 grid per torus: V = 2MN − 4, E = 4MN − 4, F = 2MN − 2.
    expect([dt.V, dt.E, dt.F]).toEqual([220, 444, 222]);
  });

  it("keeps χ independent of the grid resolution", () => {
    expect(chi(buildTorus(5, 4, 1, 0.4))).toBe(0);
    expect(chi(buildDoubleTorus(5, 4, 1, 0.4))).toBe(-2);
    expect(chi(buildDoubleTorus(20, 12, 0.9, 0.3))).toBe(-2);
  });

  it("has no coincident vertices in the double torus", () => {
    // The seam is shared by index; two vertices in the same place would mean
    // the tori only touch instead of being glued.
    const dt = byId("double-torus");
    const keys = new Set(dt.vertices.map((v) => v.map((c) => c.toFixed(6)).join(",")));
    expect(keys.size).toBe(dt.V);
  });
});

// ---- Fourier sound recipes -------------------------------------------------
// The sound lab plays these coefficients, so each recipe has to converge to
// the wave it is named after.

import {
  PULSE_DUTY,
  canonicalCoefficient as soundCoefficient,
  partialAmplitude,
  partialGains,
  partialSum,
  usesCosine,
} from "@/lib/fourier/soundRecipes";

describe("Fourier sound recipes", () => {
  const MANY = 4000;

  it("converges to a ±1 square wave", () => {
    expect(partialSum("square", MANY, false, [], 1)).toBeCloseTo(1, 2);
    expect(partialSum("square", MANY, false, [], -1)).toBeCloseTo(-1, 2);
  });

  it("converges to a rising ramp for the sawtooth", () => {
    // x/π on (−π, π).
    expect(partialSum("sawtooth", MANY, false, [], 1)).toBeCloseTo(1 / Math.PI, 2);
    expect(partialSum("sawtooth", MANY, false, [], -2)).toBeCloseTo(-2 / Math.PI, 2);
  });

  it("converges to a triangle with peak 1 at a quarter period", () => {
    expect(partialSum("triangle", MANY, false, [], Math.PI / 2)).toBeCloseTo(1, 3);
    expect(partialSum("triangle", MANY, false, [], Math.PI / 4)).toBeCloseTo(0.5, 3);
  });

  it("converges to a real pulse wave with the stated duty cycle", () => {
    expect(usesCosine("pulse")).toBe(true);
    // High for |x| < π·d, low elsewhere; the series omits the mean 2d − 1.
    const mean = 2 * PULSE_DUTY - 1;
    const edge = Math.PI * PULSE_DUTY;
    for (const x of [0, 0.5 * edge, -0.9 * edge]) {
      expect(partialSum("pulse", MANY, false, [], x) + mean).toBeCloseTo(1, 1);
    }
    for (const x of [1.2 * edge, Math.PI, -2]) {
      expect(partialSum("pulse", MANY, false, [], x) + mean).toBeCloseTo(-1, 1);
    }
  });

  it("drops every harmonic that is a multiple of 1/duty from the pulse", () => {
    for (const k of [4, 8, 12, 32]) expect(soundCoefficient("pulse", k)).toBe(0);
    expect(soundCoefficient("pulse", 2)).toBeCloseTo(2 / Math.PI, 12);
  });

  it("keeps the summed signal within ±1 even when all partials peak together", () => {
    const worstBank = [1.3, -1.3, 1.3, 1.3, -1.3, 1.3, 1.3, 1.3];
    for (const wave of ["square", "sawtooth", "triangle", "pulse"] as const) {
      for (const custom of [false, true]) {
        for (let n = 1; n <= 32; n++) {
          const gains = partialGains(wave, n, custom, worstBank);
          const worst = gains.reduce((sum, g) => sum + Math.abs(g), 0);
          expect(worst).toBeLessThanOrEqual(1 + 1e-9);
          // Scaling must not change the recipe itself.
          const a1 = partialAmplitude(wave, 1, custom, worstBank);
          const a3 = partialAmplitude(wave, 3, custom, worstBank);
          if (n >= 3 && a1 !== 0) expect(gains[2] / gains[0]).toBeCloseTo(a3 / a1, 9);
        }
      }
    }
    expect(partialGains("square", 8, true, [0, 0, 0, 0, 0, 0, 0, 0])).toEqual(
      new Array(32).fill(0),
    );
  });

  it("silences partials above the slider bank in custom mode", () => {
    const bank = [1, 0.5, 0, 0, 0, 0, 0, 0.25];
    expect(partialAmplitude("square", 8, true, bank)).toBe(0.25);
    expect(partialAmplitude("square", 9, true, bank)).toBe(0);
    expect(partialAmplitude("square", 9, false, bank)).toBeCloseTo(4 / (9 * Math.PI), 12);
  });
});

// ---- Four-colour maps ------------------------------------------------------
// The theorem is about regions that share a border, so the adjacency the
// solver sees must not include regions that only meet in a corner.

import {
  MIN_SHARED_BORDER,
  PRESETS as FOURCOLOR_PRESETS,
  buildAdjacency,
  buildMap,
  solveFourColouring,
} from "@/lib/fourcolor/map";

describe("Four-colour map adjacency", () => {
  it("ignores regions that only touch in a corner", () => {
    // Four 10×10 quadrants (0 1 / 2 3). One pixel of region 0 pokes across the
    // centre, so 0 and 3 share a single pixel pair, as at a pixelated corner.
    const w = 20;
    const h = 20;
    const labels = new Int16Array(w * h);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) labels[y * w + x] = (y < 10 ? 0 : 2) + (x < 10 ? 0 : 1);
    }
    labels[9 * w + 10] = 0;
    const { adjacency, edges } = buildAdjacency(labels, w, h, 4);
    expect(MIN_SHARED_BORDER).toBeGreaterThan(1);
    expect(adjacency[0]).toEqual([1, 2]);
    expect(adjacency[3]).toEqual([1, 2]);
    expect(edges).toBe(4);
  });

  it("turns the six inner wedges of the stress test into a ring", () => {
    const stress = FOURCOLOR_PRESETS.find((p) => p.id === "stress")!;
    for (const [w, h] of [
      [720, 480],
      [731, 1022],
    ]) {
      const map = buildMap(stress, 1, w, h);
      for (let i = 0; i < 6; i++) {
        const inner = map.adjacency[i].filter((j) => j < 6).sort((a, b) => a - b);
        expect(inner).toEqual([(i + 5) % 6, (i + 1) % 6].sort((a, b) => a - b));
      }
    }
  });

  it("stays planar and four-colourable for every preset", () => {
    for (const preset of FOURCOLOR_PRESETS) {
      for (const seed of [1, 2]) {
        const map = buildMap(preset, seed, 600, 400);
        expect(map.edges).toBeLessThanOrEqual(3 * map.n - 6);
        const { solution } = solveFourColouring(map.adjacency);
        expect(solution).not.toBeNull();
        map.adjacency.forEach((list, i) => {
          for (const j of list) expect(solution![i]).not.toBe(solution![j]);
        });
      }
    }
  });
});
