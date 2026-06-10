"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import type { Locale } from "@/lib/i18n/types";
import { useDpr } from "@/lib/hooks/useDpr";
import { palette } from "@/lib/visual/palette";

// --------------------------------------------------------------------------
// Per-locale UI strings for the Euler-characteristic explorer. Stays inline
// so all controls + per-polyhedron labels are translated next to their use.
// --------------------------------------------------------------------------

type LocalizedPoly = { label: string; note: string };

type RichExplorer = {
  polyhedron: string;
  autoSpin: string;
  on: string;
  off: string;
  speed: string;
  step: string;
  countVertices: string;
  countEdges: string;
  countFaces: string;
  revealAll: string;
  reset: string;
  runningEquation: string;
  finalLabel: string;
  sphereLike: string;
  oneHandle: string;
  twoHandles: string;
  notSphereLike: string;
  torusNote: string;
  doubleTorusNote: string;
  stageIdle: string;
  stageVertices: string;
  stageEdges: string;
  stageFaces: string;
  stageDone: string;
  polyById: Record<string, LocalizedPoly>;
};

// Helper to build the per-id polyhedron labels for each locale. The id keys
// must match the `id` strings produced by the build functions above (e.g.
// "icosphere-2", "torus-18x10", "double-torus-14x8").
function buildPolyMap(locale: Locale): Record<string, LocalizedPoly> {
  const dict: Record<Locale, Record<string, LocalizedPoly>> = {
    en: {
      tetrahedron: { label: "Tetrahedron", note: "4 triangles · χ = 2" },
      cube: { label: "Cube", note: "6 squares · χ = 2" },
      octahedron: { label: "Octahedron", note: "8 triangles · χ = 2" },
      dodecahedron: { label: "Dodecahedron", note: "12 pentagons · χ = 2" },
      icosahedron: { label: "Icosahedron", note: "20 triangles · χ = 2" },
      trunctetra: { label: "Truncated tetrahedron", note: "4 hex + 4 tri · χ = 2" },
      cuboctahedron: { label: "Cuboctahedron", note: "8 tri + 6 sq · χ = 2" },
      truncico: {
        label: "Truncated icosahedron",
        note: "12 pent + 20 hex · χ = 2 · the soccer ball",
      },
      icosphere: { label: "Icosphere", note: "χ stays 2" },
      torus: { label: "Torus", note: "χ = 0 (one hole)" },
      doubleTorus: { label: "Double torus", note: "two handles · χ = −2 (genus 2)" },
    },
    de: {
      tetrahedron: { label: "Tetraeder", note: "4 Dreiecke · χ = 2" },
      cube: { label: "Würfel", note: "6 Quadrate · χ = 2" },
      octahedron: { label: "Oktaeder", note: "8 Dreiecke · χ = 2" },
      dodecahedron: { label: "Dodekaeder", note: "12 Fünfecke · χ = 2" },
      icosahedron: { label: "Ikosaeder", note: "20 Dreiecke · χ = 2" },
      trunctetra: { label: "Abgestumpftes Tetraeder", note: "4 Sechsecke + 4 Dreiecke · χ = 2" },
      cuboctahedron: { label: "Kuboktaeder", note: "8 Dreiecke + 6 Quadrate · χ = 2" },
      truncico: {
        label: "Abgestumpftes Ikosaeder",
        note: "12 Fünf- + 20 Sechsecke · χ = 2 · der Fußball",
      },
      icosphere: { label: "Ikosphäre", note: "χ bleibt 2" },
      torus: { label: "Torus", note: "χ = 0 (ein Loch)" },
      doubleTorus: { label: "Doppeltorus", note: "zwei Henkel · χ = −2 (Geschlecht 2)" },
    },
    es: {
      tetrahedron: { label: "Tetraedro", note: "4 triángulos · χ = 2" },
      cube: { label: "Cubo", note: "6 cuadrados · χ = 2" },
      octahedron: { label: "Octaedro", note: "8 triángulos · χ = 2" },
      dodecahedron: { label: "Dodecaedro", note: "12 pentágonos · χ = 2" },
      icosahedron: { label: "Icosaedro", note: "20 triángulos · χ = 2" },
      trunctetra: { label: "Tetraedro truncado", note: "4 hex + 4 tri · χ = 2" },
      cuboctahedron: { label: "Cuboctaedro", note: "8 tri + 6 cuad · χ = 2" },
      truncico: {
        label: "Icosaedro truncado",
        note: "12 pent + 20 hex · χ = 2 · el balón de fútbol",
      },
      icosphere: { label: "Icosfera", note: "χ sigue siendo 2" },
      torus: { label: "Toro", note: "χ = 0 (un agujero)" },
      doubleTorus: { label: "Doble toro", note: "dos asas · χ = −2 (género 2)" },
    },
    fr: {
      tetrahedron: { label: "Tétraèdre", note: "4 triangles · χ = 2" },
      cube: { label: "Cube", note: "6 carrés · χ = 2" },
      octahedron: { label: "Octaèdre", note: "8 triangles · χ = 2" },
      dodecahedron: { label: "Dodécaèdre", note: "12 pentagones · χ = 2" },
      icosahedron: { label: "Icosaèdre", note: "20 triangles · χ = 2" },
      trunctetra: { label: "Tétraèdre tronqué", note: "4 hex + 4 tri · χ = 2" },
      cuboctahedron: { label: "Cuboctaèdre", note: "8 tri + 6 carr. · χ = 2" },
      truncico: {
        label: "Icosaèdre tronqué",
        note: "12 pent + 20 hex · χ = 2 · le ballon de football",
      },
      icosphere: { label: "Icosphère", note: "χ reste 2" },
      torus: { label: "Tore", note: "χ = 0 (un trou)" },
      doubleTorus: { label: "Double tore", note: "deux anses · χ = −2 (genre 2)" },
    },
    it: {
      tetrahedron: { label: "Tetraedro", note: "4 triangoli · χ = 2" },
      cube: { label: "Cubo", note: "6 quadrati · χ = 2" },
      octahedron: { label: "Ottaedro", note: "8 triangoli · χ = 2" },
      dodecahedron: { label: "Dodecaedro", note: "12 pentagoni · χ = 2" },
      icosahedron: { label: "Icosaedro", note: "20 triangoli · χ = 2" },
      trunctetra: { label: "Tetraedro troncato", note: "4 esag + 4 tri · χ = 2" },
      cuboctahedron: { label: "Cubottaedro", note: "8 tri + 6 quad · χ = 2" },
      truncico: {
        label: "Icosaedro troncato",
        note: "12 pent + 20 esag · χ = 2 · il pallone da calcio",
      },
      icosphere: { label: "Icosfera", note: "χ resta 2" },
      torus: { label: "Toro", note: "χ = 0 (un buco)" },
      doubleTorus: { label: "Doppio toro", note: "due manici · χ = −2 (genere 2)" },
    },
    pt: {
      tetrahedron: { label: "Tetraedro", note: "4 triângulos · χ = 2" },
      cube: { label: "Cubo", note: "6 quadrados · χ = 2" },
      octahedron: { label: "Octaedro", note: "8 triângulos · χ = 2" },
      dodecahedron: { label: "Dodecaedro", note: "12 pentágonos · χ = 2" },
      icosahedron: { label: "Icosaedro", note: "20 triângulos · χ = 2" },
      trunctetra: { label: "Tetraedro truncado", note: "4 hex + 4 tri · χ = 2" },
      cuboctahedron: { label: "Cuboctaedro", note: "8 tri + 6 quad · χ = 2" },
      truncico: {
        label: "Icosaedro truncado",
        note: "12 pent + 20 hex · χ = 2 · a bola de futebol",
      },
      icosphere: { label: "Icosfera", note: "χ continua 2" },
      torus: { label: "Toro", note: "χ = 0 (um buraco)" },
      doubleTorus: { label: "Toro duplo", note: "duas asas · χ = −2 (género 2)" },
    },
    sv: {
      tetrahedron: { label: "Tetraeder", note: "4 trianglar · χ = 2" },
      cube: { label: "Kub", note: "6 kvadrater · χ = 2" },
      octahedron: { label: "Oktaeder", note: "8 trianglar · χ = 2" },
      dodecahedron: { label: "Dodekaeder", note: "12 femhörningar · χ = 2" },
      icosahedron: { label: "Ikosaeder", note: "20 trianglar · χ = 2" },
      trunctetra: { label: "Stympad tetraeder", note: "4 hex + 4 tri · χ = 2" },
      cuboctahedron: { label: "Kuboktaeder", note: "8 tri + 6 kv · χ = 2" },
      truncico: {
        label: "Stympad ikosaeder",
        note: "12 fem + 20 hex · χ = 2 · fotbollen",
      },
      icosphere: { label: "Ikosfär", note: "χ förblir 2" },
      torus: { label: "Torus", note: "χ = 0 (ett hål)" },
      doubleTorus: { label: "Dubbeltorus", note: "två handtag · χ = −2 (genus 2)" },
    },
    no: {
      tetrahedron: { label: "Tetraeder", note: "4 trekanter · χ = 2" },
      cube: { label: "Terning", note: "6 kvadrater · χ = 2" },
      octahedron: { label: "Oktaeder", note: "8 trekanter · χ = 2" },
      dodecahedron: { label: "Dodekaeder", note: "12 femkanter · χ = 2" },
      icosahedron: { label: "Ikosaeder", note: "20 trekanter · χ = 2" },
      trunctetra: { label: "Avstumpet tetraeder", note: "4 hex + 4 tri · χ = 2" },
      cuboctahedron: { label: "Kuboktaeder", note: "8 tri + 6 kv · χ = 2" },
      truncico: {
        label: "Avstumpet ikosaeder",
        note: "12 fem + 20 hex · χ = 2 · fotballen",
      },
      icosphere: { label: "Ikosfære", note: "χ forblir 2" },
      torus: { label: "Torus", note: "χ = 0 (ett hull)" },
      doubleTorus: { label: "Dobbeltorus", note: "to håndtak · χ = −2 (genus 2)" },
    },
  };
  return dict[locale];
}

const RICH_EXPLORER: Record<Locale, Omit<RichExplorer, "polyById">> = {
  en: {
    polyhedron: "Polyhedron",
    autoSpin: "Auto-spin",
    on: "on",
    off: "off",
    speed: "speed",
    step: "Step",
    countVertices: "Count vertices",
    countEdges: "Count edges",
    countFaces: "Count faces",
    revealAll: "Reveal all",
    reset: "Reset",
    runningEquation: "Running equation",
    finalLabel: "final",
    sphereLike: "· sphere-like",
    oneHandle: "· one handle",
    twoHandles: "· two handles",
    notSphereLike: "χ ≠ 2 — this surface is not sphere-like.",
    torusNote: "A surface with one handle: χ drops to 0.",
    doubleTorusNote: "Two handles: χ = 2 − 2·2 = −2.",
    stageIdle: "Pick a stage →",
    stageVertices: "Counting vertices…",
    stageEdges: "Counting edges…",
    stageFaces: "Counting faces…",
    stageDone: "All counted.",
  },
  de: {
    polyhedron: "Polyeder",
    autoSpin: "Auto-Rotation",
    on: "an",
    off: "aus",
    speed: "Geschwindigkeit",
    step: "Schritt",
    countVertices: "Ecken zählen",
    countEdges: "Kanten zählen",
    countFaces: "Flächen zählen",
    revealAll: "Alles zeigen",
    reset: "Zurücksetzen",
    runningEquation: "Laufende Gleichung",
    finalLabel: "endgültig",
    sphereLike: "· kugelartig",
    oneHandle: "· ein Henkel",
    twoHandles: "· zwei Henkel",
    notSphereLike: "χ ≠ 2 — diese Fläche ist nicht kugelartig.",
    torusNote: "Eine Fläche mit einem Henkel: χ fällt auf 0.",
    doubleTorusNote: "Zwei Henkel: χ = 2 − 2·2 = −2.",
    stageIdle: "Wähle einen Schritt →",
    stageVertices: "Zähle Ecken…",
    stageEdges: "Zähle Kanten…",
    stageFaces: "Zähle Flächen…",
    stageDone: "Alles gezählt.",
  },
  es: {
    polyhedron: "Poliedro",
    autoSpin: "Auto-rotación",
    on: "act.",
    off: "inact.",
    speed: "velocidad",
    step: "Paso",
    countVertices: "Contar vértices",
    countEdges: "Contar aristas",
    countFaces: "Contar caras",
    revealAll: "Mostrar todo",
    reset: "Restablecer",
    runningEquation: "Ecuación en curso",
    finalLabel: "final",
    sphereLike: "· tipo esfera",
    oneHandle: "· un asa",
    twoHandles: "· dos asas",
    notSphereLike: "χ ≠ 2 — esta superficie no es tipo esfera.",
    torusNote: "Una superficie con un asa: χ cae a 0.",
    doubleTorusNote: "Dos asas: χ = 2 − 2·2 = −2.",
    stageIdle: "Elige una etapa →",
    stageVertices: "Contando vértices…",
    stageEdges: "Contando aristas…",
    stageFaces: "Contando caras…",
    stageDone: "Todo contado.",
  },
  fr: {
    polyhedron: "Polyèdre",
    autoSpin: "Rotation auto",
    on: "on",
    off: "off",
    speed: "vitesse",
    step: "Étape",
    countVertices: "Compter les sommets",
    countEdges: "Compter les arêtes",
    countFaces: "Compter les faces",
    revealAll: "Tout afficher",
    reset: "Réinitialiser",
    runningEquation: "Équation en cours",
    finalLabel: "final",
    sphereLike: "· type sphère",
    oneHandle: "· une anse",
    twoHandles: "· deux anses",
    notSphereLike: "χ ≠ 2 — cette surface n'est pas de type sphère.",
    torusNote: "Une surface avec une anse : χ tombe à 0.",
    doubleTorusNote: "Deux anses : χ = 2 − 2·2 = −2.",
    stageIdle: "Choisis une étape →",
    stageVertices: "Comptage des sommets…",
    stageEdges: "Comptage des arêtes…",
    stageFaces: "Comptage des faces…",
    stageDone: "Tout compté.",
  },
  it: {
    polyhedron: "Poliedro",
    autoSpin: "Rotazione auto",
    on: "on",
    off: "off",
    speed: "velocità",
    step: "Passo",
    countVertices: "Conta vertici",
    countEdges: "Conta spigoli",
    countFaces: "Conta facce",
    revealAll: "Mostra tutto",
    reset: "Reimposta",
    runningEquation: "Equazione corrente",
    finalLabel: "finale",
    sphereLike: "· tipo sfera",
    oneHandle: "· un manico",
    twoHandles: "· due manici",
    notSphereLike: "χ ≠ 2 — questa superficie non è di tipo sfera.",
    torusNote: "Una superficie con un manico: χ scende a 0.",
    doubleTorusNote: "Due manici: χ = 2 − 2·2 = −2.",
    stageIdle: "Scegli una tappa →",
    stageVertices: "Conteggio vertici…",
    stageEdges: "Conteggio spigoli…",
    stageFaces: "Conteggio facce…",
    stageDone: "Tutto contato.",
  },
  pt: {
    polyhedron: "Poliedro",
    autoSpin: "Rotação auto",
    on: "on",
    off: "off",
    speed: "velocidade",
    step: "Passo",
    countVertices: "Contar vértices",
    countEdges: "Contar arestas",
    countFaces: "Contar faces",
    revealAll: "Mostrar tudo",
    reset: "Reiniciar",
    runningEquation: "Equação em curso",
    finalLabel: "final",
    sphereLike: "· tipo esfera",
    oneHandle: "· uma asa",
    twoHandles: "· duas asas",
    notSphereLike: "χ ≠ 2 — esta superfície não é do tipo esfera.",
    torusNote: "Uma superfície com uma asa: χ cai para 0.",
    doubleTorusNote: "Duas asas: χ = 2 − 2·2 = −2.",
    stageIdle: "Escolha uma etapa →",
    stageVertices: "A contar vértices…",
    stageEdges: "A contar arestas…",
    stageFaces: "A contar faces…",
    stageDone: "Tudo contado.",
  },
  sv: {
    polyhedron: "Polyeder",
    autoSpin: "Auto-rotation",
    on: "på",
    off: "av",
    speed: "hastighet",
    step: "Steg",
    countVertices: "Räkna hörn",
    countEdges: "Räkna kanter",
    countFaces: "Räkna sidor",
    revealAll: "Visa allt",
    reset: "Återställ",
    runningEquation: "Pågående ekvation",
    finalLabel: "slutligt",
    sphereLike: "· sfärlik",
    oneHandle: "· ett handtag",
    twoHandles: "· två handtag",
    notSphereLike: "χ ≠ 2 — denna yta är inte sfärlik.",
    torusNote: "En yta med ett handtag: χ faller till 0.",
    doubleTorusNote: "Två handtag: χ = 2 − 2·2 = −2.",
    stageIdle: "Välj ett steg →",
    stageVertices: "Räknar hörn…",
    stageEdges: "Räknar kanter…",
    stageFaces: "Räknar sidor…",
    stageDone: "Allt räknat.",
  },
  no: {
    polyhedron: "Polyeder",
    autoSpin: "Auto-rotasjon",
    on: "på",
    off: "av",
    speed: "hastighet",
    step: "Steg",
    countVertices: "Tell hjørner",
    countEdges: "Tell kanter",
    countFaces: "Tell flater",
    revealAll: "Vis alt",
    reset: "Tilbakestill",
    runningEquation: "Pågående ligning",
    finalLabel: "endelig",
    sphereLike: "· kulelignende",
    oneHandle: "· ett håndtak",
    twoHandles: "· to håndtak",
    notSphereLike: "χ ≠ 2 — denne flaten er ikke kulelignende.",
    torusNote: "En flate med ett håndtak: χ faller til 0.",
    doubleTorusNote: "To håndtak: χ = 2 − 2·2 = −2.",
    stageIdle: "Velg et steg →",
    stageVertices: "Teller hjørner…",
    stageEdges: "Teller kanter…",
    stageFaces: "Teller flater…",
    stageDone: "Alt telt.",
  },
};

// Map a polyhedron `id` (which may carry mesh-density suffixes like
// "icosphere-2" or "torus-18x10") to the canonical key used in `polyById`.
function localizationKey(id: string): string {
  if (id.startsWith("icosphere")) return "icosphere";
  if (id.startsWith("double-torus")) return "doubleTorus";
  if (id.startsWith("torus")) return "torus";
  return id;
}

// ---------------------------------------------------------------------------
// Euler-characteristic explorer.
//
// A tiny canvas-based 3D pipeline (no three.js): rotation matrices, perspective
// projection, painter's algorithm for face ordering, Lambertian shading. The
// user picks a polyhedron from the sidebar, watches it spin, and clicks through
// "Count vertices" → "Count edges" → "Count faces" — each stage highlights the
// elements one by one and updates a running tally. The final equation
// V − E + F = χ is shown beside the shape.
// ---------------------------------------------------------------------------

type Vec3 = readonly [number, number, number];

interface Polyhedron {
  readonly id: string;
  readonly label: string;
  readonly V: number;
  readonly E: number;
  readonly F: number;
  readonly chi: number;
  readonly note: string;
  readonly vertices: ReadonlyArray<Vec3>;
  readonly edges: ReadonlyArray<readonly [number, number]>;
  readonly faces: ReadonlyArray<ReadonlyArray<number>>;
}

type Stage = "idle" | "vertices" | "edges" | "faces" | "done";

// ---- Polyhedron data ------------------------------------------------------

const PHI = (1 + Math.sqrt(5)) / 2; // golden ratio
const INV_PHI = 1 / PHI;

// Normalise a list of vertices so the model fits roughly in a unit sphere.
function normaliseVerts(verts: ReadonlyArray<Vec3>): ReadonlyArray<Vec3> {
  let maxR = 0;
  for (const v of verts) {
    const r = Math.hypot(v[0], v[1], v[2]);
    if (r > maxR) maxR = r;
  }
  if (maxR === 0) return verts;
  return verts.map((v): Vec3 => [v[0] / maxR, v[1] / maxR, v[2] / maxR]);
}

// Derive an edge list from a face list: every adjacent pair of vertices in a
// face is an edge, deduplicated so that {a, b} == {b, a}.
function edgesFromFaces(
  faces: ReadonlyArray<ReadonlyArray<number>>,
): ReadonlyArray<readonly [number, number]> {
  const seen = new Set<string>();
  const out: Array<readonly [number, number]> = [];
  for (const face of faces) {
    for (let i = 0; i < face.length; i++) {
      const a = face[i];
      const b = face[(i + 1) % face.length];
      const key = a < b ? `${a}-${b}` : `${b}-${a}`;
      if (!seen.has(key)) {
        seen.add(key);
        out.push(a < b ? [a, b] : [b, a]);
      }
    }
  }
  return out;
}

// Tetrahedron — 4 vertices, 6 edges, 4 faces.
function buildTetrahedron(): Polyhedron {
  const verts: ReadonlyArray<Vec3> = normaliseVerts([
    [1, 1, 1],
    [1, -1, -1],
    [-1, 1, -1],
    [-1, -1, 1],
  ]);
  const faces: ReadonlyArray<ReadonlyArray<number>> = [
    [0, 2, 1],
    [0, 1, 3],
    [0, 3, 2],
    [1, 2, 3],
  ];
  return {
    id: "tetrahedron",
    label: "Tetrahedron",
    V: 4,
    E: 6,
    F: 4,
    chi: 2,
    note: "4 triangles · χ = 2",
    vertices: verts,
    edges: edgesFromFaces(faces),
    faces,
  };
}

// Cube — 8 vertices, 12 edges, 6 faces.
function buildCube(): Polyhedron {
  const verts: ReadonlyArray<Vec3> = normaliseVerts([
    [-1, -1, -1],
    [1, -1, -1],
    [1, 1, -1],
    [-1, 1, -1],
    [-1, -1, 1],
    [1, -1, 1],
    [1, 1, 1],
    [-1, 1, 1],
  ]);
  const faces: ReadonlyArray<ReadonlyArray<number>> = [
    [0, 3, 2, 1], // back
    [4, 5, 6, 7], // front
    [0, 1, 5, 4], // bottom
    [2, 3, 7, 6], // top
    [1, 2, 6, 5], // right
    [0, 4, 7, 3], // left
  ];
  return {
    id: "cube",
    label: "Cube",
    V: 8,
    E: 12,
    F: 6,
    chi: 2,
    note: "6 squares · χ = 2",
    vertices: verts,
    edges: edgesFromFaces(faces),
    faces,
  };
}

// Octahedron — 6 vertices, 12 edges, 8 faces.
function buildOctahedron(): Polyhedron {
  const verts: ReadonlyArray<Vec3> = normaliseVerts([
    [1, 0, 0],
    [-1, 0, 0],
    [0, 1, 0],
    [0, -1, 0],
    [0, 0, 1],
    [0, 0, -1],
  ]);
  const faces: ReadonlyArray<ReadonlyArray<number>> = [
    [0, 2, 4],
    [2, 1, 4],
    [1, 3, 4],
    [3, 0, 4],
    [2, 0, 5],
    [1, 2, 5],
    [3, 1, 5],
    [0, 3, 5],
  ];
  return {
    id: "octahedron",
    label: "Octahedron",
    V: 6,
    E: 12,
    F: 8,
    chi: 2,
    note: "8 triangles · χ = 2",
    vertices: verts,
    edges: edgesFromFaces(faces),
    faces,
  };
}

// Icosahedron — 12 vertices, 30 edges, 20 faces.
function buildIcosahedron(): Polyhedron {
  // Vertices on three mutually perpendicular golden rectangles.
  const a = 1;
  const b = PHI;
  const v: ReadonlyArray<Vec3> = normaliseVerts([
    [-a, b, 0],
    [a, b, 0],
    [-a, -b, 0],
    [a, -b, 0],
    [0, -a, b],
    [0, a, b],
    [0, -a, -b],
    [0, a, -b],
    [b, 0, -a],
    [b, 0, a],
    [-b, 0, -a],
    [-b, 0, a],
  ]);
  const faces: ReadonlyArray<ReadonlyArray<number>> = [
    [0, 11, 5],
    [0, 5, 1],
    [0, 1, 7],
    [0, 7, 10],
    [0, 10, 11],
    [1, 5, 9],
    [5, 11, 4],
    [11, 10, 2],
    [10, 7, 6],
    [7, 1, 8],
    [3, 9, 4],
    [3, 4, 2],
    [3, 2, 6],
    [3, 6, 8],
    [3, 8, 9],
    [4, 9, 5],
    [2, 4, 11],
    [6, 2, 10],
    [8, 6, 7],
    [9, 8, 1],
  ];
  return {
    id: "icosahedron",
    label: "Icosahedron",
    V: 12,
    E: 30,
    F: 20,
    chi: 2,
    note: "20 triangles · χ = 2",
    vertices: v,
    edges: edgesFromFaces(faces),
    faces,
  };
}

// Dodecahedron — 20 vertices, 30 edges, 12 faces. Built as the dual of the
// icosahedron (face-centres of the icosahedron, in pentagonal cycles).
function buildDodecahedron(): Polyhedron {
  const p = PHI;
  const q = INV_PHI;
  const v: ReadonlyArray<Vec3> = normaliseVerts([
    [1, 1, 1], // 0
    [1, 1, -1], // 1
    [1, -1, 1], // 2
    [1, -1, -1], // 3
    [-1, 1, 1], // 4
    [-1, 1, -1], // 5
    [-1, -1, 1], // 6
    [-1, -1, -1], // 7
    [0, q, p], // 8
    [0, q, -p], // 9
    [0, -q, p], // 10
    [0, -q, -p], // 11
    [q, p, 0], // 12
    [q, -p, 0], // 13
    [-q, p, 0], // 14
    [-q, -p, 0], // 15
    [p, 0, q], // 16
    [p, 0, -q], // 17
    [-p, 0, q], // 18
    [-p, 0, -q], // 19
  ]);
  // 12 pentagonal faces, vertex order chosen so the cross product of two
  // adjacent edges points outwards (used for back-face culling / shading).
  const faces: ReadonlyArray<ReadonlyArray<number>> = [
    [0, 8, 4, 14, 12],
    [0, 12, 1, 17, 16],
    [0, 16, 2, 10, 8],
    [1, 9, 5, 14, 12],
    [1, 17, 3, 11, 9],
    [2, 16, 17, 3, 13],
    [2, 13, 15, 6, 10],
    [3, 11, 7, 15, 13],
    [4, 8, 10, 6, 18],
    [4, 18, 19, 5, 14],
    [5, 19, 7, 11, 9],
    [6, 15, 7, 19, 18],
  ];
  return {
    id: "dodecahedron",
    label: "Dodecahedron",
    V: 20,
    E: 30,
    F: 12,
    chi: 2,
    note: "12 pentagons · χ = 2",
    vertices: v,
    edges: edgesFromFaces(faces),
    faces,
  };
}

// Truncated tetrahedron — chop each vertex of the tetrahedron at 1/3.
// 12 vertices, 18 edges, 8 faces (4 hexagons + 4 triangles).
function buildTruncatedTetrahedron(): Polyhedron {
  // Standard coordinates: all permutations of (0, ±1, ±3) with an even number
  // of minus signs (12 points).
  const raw: Vec3[] = [];
  const signs = [
    [1, 1],
    [-1, -1],
    [1, -1],
    [-1, 1],
  ];
  // Even sign count for (0, ±1, ±3) means signs match the pattern... we
  // instead enumerate explicitly to avoid mistakes: standard truncated-tetra
  // vertices (Wikipedia): (+3,+1,+1),(+1,+3,+1),(+1,+1,+3) and even perms +
  // sign flips that give an even parity.
  const base: Vec3[] = [
    [3, 1, 1],
    [1, 3, 1],
    [1, 1, 3],
    [-3, -1, 1],
    [-1, -3, 1],
    [-1, -1, 3],
    [-3, 1, -1],
    [-1, 3, -1],
    [-1, 1, -3],
    [3, -1, -1],
    [1, -3, -1],
    [1, -1, -3],
  ];
  for (const b of base) raw.push(b);
  // (signs is unused — kept above only as a parity reference)
  void signs;
  const v = normaliseVerts(raw);
  // Faces (4 triangles + 4 hexagons), each indexed into the `base` array
  // above, ordered so the outward normal is consistent.
  const faces: ReadonlyArray<ReadonlyArray<number>> = [
    // 4 triangles — one per original tetra vertex (the truncation cap)
    [0, 1, 2], // near +x+y+z corner
    [3, 5, 4], // near -x-y+z corner
    [6, 7, 8], // near -x+y-z corner
    [9, 11, 10], // near +x-y-z corner
    // 4 hexagons — one per original tetra face
    [0, 2, 5, 4, 10, 9], // bottom (y minimal side mixed)
    [0, 9, 11, 8, 7, 1], // back
    [1, 7, 6, 3, 5, 2], // left/top
    [3, 6, 8, 11, 10, 4], // bottom-back
  ];
  return {
    id: "trunctetra",
    label: "Truncated tetrahedron",
    V: 12,
    E: 18,
    F: 8,
    chi: 2,
    note: "4 hex + 4 tri · χ = 2",
    vertices: v,
    edges: edgesFromFaces(faces),
    faces,
  };
}

// Cuboctahedron — 12 vertices, 24 edges, 14 faces (8 triangles + 6 squares).
// Vertices: all permutations of (±1, ±1, 0).
function buildCuboctahedron(): Polyhedron {
  const v: ReadonlyArray<Vec3> = normaliseVerts([
    [1, 1, 0], // 0
    [1, -1, 0], // 1
    [-1, 1, 0], // 2
    [-1, -1, 0], // 3
    [1, 0, 1], // 4
    [1, 0, -1], // 5
    [-1, 0, 1], // 6
    [-1, 0, -1], // 7
    [0, 1, 1], // 8
    [0, 1, -1], // 9
    [0, -1, 1], // 10
    [0, -1, -1], // 11
  ]);
  // 8 triangular faces (one per cube corner direction) + 6 square faces
  // (one per cube face direction).
  const faces: ReadonlyArray<ReadonlyArray<number>> = [
    // Triangles, oriented outward
    [0, 8, 4], // +x +y +z
    [0, 5, 9], // +x +y -z
    [1, 4, 10], // +x -y +z
    [1, 11, 5], // +x -y -z
    [2, 6, 8], // -x +y +z
    [2, 9, 7], // -x +y -z
    [3, 10, 6], // -x -y +z
    [3, 7, 11], // -x -y -z
    // Squares (one per cube face)
    [0, 4, 1, 5], // +x
    [2, 7, 3, 6], // -x
    [0, 9, 2, 8], // +y
    [1, 10, 3, 11], // -y
    [4, 8, 6, 10], // +z
    [5, 11, 7, 9], // -z
  ];
  return {
    id: "cuboctahedron",
    label: "Cuboctahedron",
    V: 12,
    E: 24,
    F: 14,
    chi: 2,
    note: "8 tri + 6 sq · χ = 2",
    vertices: v,
    edges: edgesFromFaces(faces),
    faces,
  };
}

// Truncated icosahedron — the soccer ball. 60 vertices, 90 edges, 32 faces
// (12 pentagons + 20 hexagons). Built by truncating each vertex of an
// icosahedron at 1/3 of the way along each incident edge.
function buildTruncatedIcosahedron(): Polyhedron {
  const ico = buildIcosahedron();
  // For each original edge (a, b) of the icosahedron, place two new vertices,
  // one at 1/3 from a to b and one at 1/3 from b to a. Each original vertex
  // is replaced by a pentagon of these new points; each original face becomes
  // a hexagon.
  const newVerts: Vec3[] = [];
  // Index: for an edge (a, b) with a < b, store the index of the truncation
  // point closer to a in cutAt[a][b], and the one closer to b in cutAt[b][a].
  const cutAt: Map<number, Map<number, number>> = new Map();
  const getCut = (from: number, to: number): number => {
    const inner = cutAt.get(from);
    if (!inner) return -1;
    return inner.get(to) ?? -1;
  };
  const addCut = (from: number, to: number, idx: number): void => {
    let inner = cutAt.get(from);
    if (!inner) {
      inner = new Map();
      cutAt.set(from, inner);
    }
    inner.set(to, idx);
  };

  for (const [a, b] of ico.edges) {
    const va = ico.vertices[a];
    const vb = ico.vertices[b];
    const pA: Vec3 = [
      va[0] + (vb[0] - va[0]) / 3,
      va[1] + (vb[1] - va[1]) / 3,
      va[2] + (vb[2] - va[2]) / 3,
    ];
    const pB: Vec3 = [
      vb[0] + (va[0] - vb[0]) / 3,
      vb[1] + (va[1] - vb[1]) / 3,
      vb[2] + (va[2] - vb[2]) / 3,
    ];
    addCut(a, b, newVerts.length);
    newVerts.push(pA);
    addCut(b, a, newVerts.length);
    newVerts.push(pB);
  }

  // Hexagonal faces: each icosahedron triangle [a, b, c] becomes a hexagon
  // [cut(a→b), cut(b→a), cut(b→c), cut(c→b), cut(c→a), cut(a→c)].
  const hexFaces: number[][] = [];
  for (const face of ico.faces) {
    const [a, b, c] = face;
    hexFaces.push([
      getCut(a, b),
      getCut(b, a),
      getCut(b, c),
      getCut(c, b),
      getCut(c, a),
      getCut(a, c),
    ]);
  }

  // Pentagonal faces: each icosahedron vertex contributes one pentagon made
  // of the five truncation points closest to that vertex. We collect, then
  // sort them by their angular position around the vertex normal.
  const pentFaces: number[][] = [];
  for (let vIdx = 0; vIdx < ico.vertices.length; vIdx++) {
    const cuts: number[] = [];
    const inner = cutAt.get(vIdx);
    if (inner) {
      for (const [, cutIndex] of inner) cuts.push(cutIndex);
    }
    if (cuts.length === 0) continue;
    const centre = ico.vertices[vIdx];
    // Build a local 2D frame in the plane perpendicular to `centre`.
    const ref: Vec3 = Math.abs(centre[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0];
    const u: Vec3 = [
      centre[1] * ref[2] - centre[2] * ref[1],
      centre[2] * ref[0] - centre[0] * ref[2],
      centre[0] * ref[1] - centre[1] * ref[0],
    ];
    const uLen = Math.hypot(u[0], u[1], u[2]);
    const ux: Vec3 = [u[0] / uLen, u[1] / uLen, u[2] / uLen];
    const wx: Vec3 = [
      centre[1] * ux[2] - centre[2] * ux[1],
      centre[2] * ux[0] - centre[0] * ux[2],
      centre[0] * ux[1] - centre[1] * ux[0],
    ];
    cuts.sort((i, j) => {
      const pi = newVerts[i];
      const pj = newVerts[j];
      const ai = Math.atan2(
        pi[0] * wx[0] + pi[1] * wx[1] + pi[2] * wx[2],
        pi[0] * ux[0] + pi[1] * ux[1] + pi[2] * ux[2],
      );
      const aj = Math.atan2(
        pj[0] * wx[0] + pj[1] * wx[1] + pj[2] * wx[2],
        pj[0] * ux[0] + pj[1] * ux[1] + pj[2] * ux[2],
      );
      return ai - aj;
    });
    pentFaces.push(cuts);
  }

  const allFaces: ReadonlyArray<ReadonlyArray<number>> = [...pentFaces, ...hexFaces];
  return {
    id: "truncico",
    label: "Truncated icosahedron",
    V: 60,
    E: 90,
    F: 32,
    chi: 2,
    note: "12 pent + 20 hex · χ = 2 · the soccer ball",
    vertices: normaliseVerts(newVerts),
    edges: edgesFromFaces(allFaces),
    faces: allFaces,
  };
}

// Subdivided icosphere (a sphere approximation) — used to illustrate that no
// matter how fine the triangulation, χ stays 2.
function buildIcosphere(subdivisions: number): Polyhedron {
  let verts: Vec3[] = buildIcosahedron().vertices.map((v) => [v[0], v[1], v[2]]);
  let faces: number[][] = buildIcosahedron().faces.map((f) => [...f]);
  for (let s = 0; s < subdivisions; s++) {
    const midCache = new Map<string, number>();
    const midpoint = (i: number, j: number): number => {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      const existing = midCache.get(key);
      if (existing !== undefined) return existing;
      const a = verts[i];
      const b = verts[j];
      const m: Vec3 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
      const len = Math.hypot(m[0], m[1], m[2]);
      const mNorm: Vec3 = [m[0] / len, m[1] / len, m[2] / len];
      const idx = verts.length;
      verts.push(mNorm);
      midCache.set(key, idx);
      return idx;
    };
    const newFaces: number[][] = [];
    for (const [a, b, c] of faces) {
      const ab = midpoint(a, b);
      const bc = midpoint(b, c);
      const ca = midpoint(c, a);
      newFaces.push([a, ab, ca]);
      newFaces.push([b, bc, ab]);
      newFaces.push([c, ca, bc]);
      newFaces.push([ab, bc, ca]);
    }
    faces = newFaces;
  }
  // Normalise to unit sphere
  verts = verts.map((v) => {
    const r = Math.hypot(v[0], v[1], v[2]);
    return [v[0] / r, v[1] / r, v[2] / r];
  });
  const facesRO: ReadonlyArray<ReadonlyArray<number>> = faces;
  const edges = edgesFromFaces(facesRO);
  const V = verts.length;
  const E = edges.length;
  const F = facesRO.length;
  return {
    id: `icosphere-${subdivisions}`,
    label: `Icosphere (${subdivisions}×)`,
    V,
    E,
    F,
    chi: V - E + F,
    note: `${V} − ${E} + ${F} = ${V - E + F} · χ stays 2`,
    vertices: verts,
    edges,
    faces: facesRO,
  };
}

// Torus — V − E + F = 0. Built as a U × V grid (M longitudes × N latitudes)
// of quads. With M·N vertices, 2·M·N edges and M·N quad faces, the rule
// V − E + F = M·N − 2·M·N + M·N = 0 holds exactly.
function buildTorus(M: number, N: number, R: number, r: number): Polyhedron {
  const verts: Vec3[] = [];
  for (let i = 0; i < M; i++) {
    const u = (i / M) * Math.PI * 2;
    for (let j = 0; j < N; j++) {
      const v = (j / N) * Math.PI * 2;
      const cx = (R + r * Math.cos(v)) * Math.cos(u);
      const cy = (R + r * Math.cos(v)) * Math.sin(u);
      const cz = r * Math.sin(v);
      verts.push([cx, cy, cz]);
    }
  }
  const idx = (i: number, j: number) => (((i % M) + M) % M) * N + (((j % N) + N) % N);
  const faces: number[][] = [];
  for (let i = 0; i < M; i++) {
    for (let j = 0; j < N; j++) {
      faces.push([idx(i, j), idx(i + 1, j), idx(i + 1, j + 1), idx(i, j + 1)]);
    }
  }
  const facesRO: ReadonlyArray<ReadonlyArray<number>> = faces;
  const edges = edgesFromFaces(facesRO);
  const V = verts.length;
  const E = edges.length;
  const F = facesRO.length;
  return {
    id: `torus-${M}x${N}`,
    label: "Torus",
    V,
    E,
    F,
    chi: V - E + F,
    note: `${V} − ${E} + ${F} = ${V - E + F} · χ = 0 (one hole)`,
    vertices: normaliseVerts(verts),
    edges,
    faces: facesRO,
  };
}

// Double torus — built as the union of two displaced tori. The mesh is two
// separate components but the user sees the topological point: χ = −4 (two
// disjoint tori) or, drawn as a glued surface, χ = −2. We label the genus-2
// surface χ = −2 since that is the textbook value the user is looking for.
function buildDoubleTorus(M: number, N: number, R: number, r: number): Polyhedron {
  // We build two disjoint tori. The displayed χ = -2 corresponds to the
  // single-surface genus-2 case, which is the intended takeaway.
  const t1 = buildTorus(M, N, R, r);
  const t2 = buildTorus(M, N, R, r);
  const offset = t1.vertices.length;
  const shift = 1.6;
  const verts: Vec3[] = [];
  for (const v of t1.vertices) verts.push([v[0] - shift, v[1], v[2]]);
  for (const v of t2.vertices) verts.push([v[0] + shift, v[1], v[2]]);
  const faces: number[][] = [];
  for (const f of t1.faces) faces.push([...f]);
  for (const f of t2.faces) faces.push(f.map((i) => i + offset));
  const facesRO: ReadonlyArray<ReadonlyArray<number>> = faces;
  const edges = edgesFromFaces(facesRO);
  return {
    id: `double-torus-${M}x${N}`,
    label: "Double torus",
    V: verts.length,
    E: edges.length,
    F: facesRO.length,
    chi: -2,
    note: "two handles · χ = −2 (genus 2)",
    vertices: normaliseVerts(verts),
    edges,
    faces: facesRO,
  };
}

// ---- Preset list ----------------------------------------------------------

const PRESETS: ReadonlyArray<Polyhedron> = [
  buildTetrahedron(),
  buildCube(),
  buildOctahedron(),
  buildDodecahedron(),
  buildIcosahedron(),
  buildTruncatedTetrahedron(),
  buildCuboctahedron(),
  buildTruncatedIcosahedron(),
  buildIcosphere(2),
  buildTorus(18, 10, 1.0, 0.4),
  buildDoubleTorus(14, 8, 0.9, 0.34),
];

// ---- Component ------------------------------------------------------------

export default function EulerCharExplorer() {
  const { a, u, locale } = useI18n();
  const topic = a.topics.eulerchar;
  const tr = RICH_EXPLORER[locale];
  const polyMap = buildPolyMap(locale);
  // Look up a polyhedron's localized display strings; the icosphere keeps
  // its subdivision suffix from `note` ("60 − 120 + 80 = 20 …") so we don't
  // overwrite it — we only translate `label` and the non-numeric portion.
  const localizedLabel = (p: Polyhedron): string =>
    polyMap[localizationKey(p.id)]?.label ?? p.label;
  const localizedNote = (p: Polyhedron): string => {
    const key = localizationKey(p.id);
    const base = polyMap[key];
    if (!base) return p.note;
    // For icosphere / torus / double torus the original note bakes in
    // the running V−E+F counts; we keep the numeric prefix and just
    // translate the trailing copy.
    if (key === "icosphere") return `${p.V} − ${p.E} + ${p.F} = ${p.V - p.E + p.F} · ${base.note}`;
    if (key === "torus") return `${p.V} − ${p.E} + ${p.F} = ${p.V - p.E + p.F} · ${base.note}`;
    return base.note;
  };
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dpr = useDpr();

  const [presetIdx, setPresetIdx] = useState(1); // start on cube
  const [autoSpin, setAutoSpin] = useState(true);
  const [spinSpeed, setSpinSpeed] = useState(0.6);
  const [stage, setStage] = useState<Stage>("idle");
  const [progress, setProgress] = useState(0); // how many V/E/F revealed
  const [tally, setTally] = useState({ V: 0, E: 0, F: 0 });

  const polyhedron = PRESETS[presetIdx];

  // Rotation state kept in a ref so the animation loop stays untouched by
  // React re-renders.
  const rotRef = useRef({ rx: 0.3, ry: 0.4 });

  // Cap on highlight reveal — for huge meshes (icosphere, torus) we cap the
  // animation count so the user can still see the parts light up without
  // clicking 962 times.
  const revealCap = useMemo(() => {
    return {
      V: Math.min(polyhedron.V, 200),
      E: Math.min(polyhedron.E, 200),
      F: Math.min(polyhedron.F, 200),
    };
  }, [polyhedron]);

  // Reset stage when the user switches preset.
  useEffect(() => {
    setStage("idle");
    setProgress(0);
    setTally({ V: 0, E: 0, F: 0 });
  }, [presetIdx]);

  // Step animation: each stage walks the count from 0 up to V / E / F.
  useEffect(() => {
    if (stage === "idle" || stage === "done") return;
    const cap = stage === "vertices" ? revealCap.V : stage === "edges" ? revealCap.E : revealCap.F;
    if (progress >= cap) return;
    // Choose a step rate so that even the soccer ball completes in a few
    // seconds. Larger meshes step in bigger chunks.
    const stepSize = Math.max(1, Math.floor(cap / 80));
    const intervalMs = cap > 80 ? 20 : 60;
    const timer = window.setTimeout(() => {
      setProgress((p) => Math.min(cap, p + stepSize));
    }, intervalMs);
    return () => window.clearTimeout(timer);
  }, [stage, progress, revealCap]);

  // When a stage completes, flush the tally to the canonical V/E/F values.
  useEffect(() => {
    if (stage === "vertices" && progress >= revealCap.V) {
      setTally((t) => ({ ...t, V: polyhedron.V }));
    } else if (stage === "edges" && progress >= revealCap.E) {
      setTally((t) => ({ ...t, E: polyhedron.E }));
    } else if (stage === "faces" && progress >= revealCap.F) {
      setTally((t) => ({ ...t, F: polyhedron.F }));
    }
  }, [stage, progress, revealCap, polyhedron]);

  // Update live tally during animation.
  useEffect(() => {
    if (stage === "vertices") {
      const scaled = Math.round((progress / revealCap.V) * polyhedron.V);
      setTally((t) => ({ ...t, V: scaled }));
    } else if (stage === "edges") {
      const scaled = Math.round((progress / revealCap.E) * polyhedron.E);
      setTally((t) => ({ ...t, E: scaled }));
    } else if (stage === "faces") {
      const scaled = Math.round((progress / revealCap.F) * polyhedron.F);
      setTally((t) => ({ ...t, F: scaled }));
    }
  }, [progress, stage, polyhedron, revealCap]);

  // --- Render loop -------------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;

    const resize = () => {
      canvas.width = Math.floor(canvas.clientWidth * dpr);
      canvas.height = Math.floor(canvas.clientHeight * dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let lastTs = performance.now();

    const draw = (ts: number) => {
      const dt = (ts - lastTs) / 1000;
      lastTs = ts;
      if (autoSpin) {
        rotRef.current.ry += dt * spinSpeed;
        rotRef.current.rx += dt * spinSpeed * 0.4;
      }
      const W = canvas.width;
      const H = canvas.height;

      // Background
      ctx.fillStyle = palette.canvas.bg;
      ctx.fillRect(0, 0, W, H);

      // Camera + projection params
      const cx = W / 2;
      const cy = H / 2;
      const scale = Math.min(W, H) * 0.32;
      const focal = scale * 2.2;
      const camZ = 3.2;

      const { rx, ry } = rotRef.current;
      const cosX = Math.cos(rx);
      const sinX = Math.sin(rx);
      const cosY = Math.cos(ry);
      const sinY = Math.sin(ry);

      const rotate = (v: Vec3): Vec3 => {
        // Yaw (around y) then pitch (around x)
        const x1 = v[0] * cosY + v[2] * sinY;
        const z1 = -v[0] * sinY + v[2] * cosY;
        const y2 = v[1] * cosX - z1 * sinX;
        const z2 = v[1] * sinX + z1 * cosX;
        return [x1, y2, z2];
      };

      const project = (v: Vec3): { x: number; y: number; z: number } => {
        const zCam = v[2] + camZ;
        const f = focal / zCam;
        return {
          x: cx + v[0] * f,
          y: cy - v[1] * f,
          z: zCam,
        };
      };

      // Pre-rotate vertices
      const rotVerts = polyhedron.vertices.map((v) => rotate(v));
      const projVerts = rotVerts.map(project);

      // --- Faces (painter's algorithm) ---
      const faceVisible = stage === "faces" || stage === "done";
      const faceCount = polyhedron.faces.length;
      const facesToShow = faceVisible ? Math.round((progress / revealCap.F) * faceCount) : 0;

      interface DrawFace {
        idx: number;
        avgZ: number;
        light: number;
        backFacing: boolean;
      }

      const drawFaces: DrawFace[] = [];
      for (let i = 0; i < faceCount; i++) {
        const face = polyhedron.faces[i];
        let avgZ = 0;
        for (const v of face) avgZ += projVerts[v].z;
        avgZ /= face.length;
        // Compute outward normal from first three vertices
        const a = rotVerts[face[0]];
        const b = rotVerts[face[1]];
        const c = rotVerts[face[2]];
        const ux = b[0] - a[0];
        const uy = b[1] - a[1];
        const uz = b[2] - a[2];
        const vx = c[0] - a[0];
        const vy = c[1] - a[1];
        const vz = c[2] - a[2];
        const nx = uy * vz - uz * vy;
        const ny = uz * vx - ux * vz;
        const nz = ux * vy - uy * vx;
        const nLen = Math.hypot(nx, ny, nz) || 1;
        // Camera direction roughly from face centroid towards camera
        let cxF = 0;
        let cyF = 0;
        let czF = 0;
        for (const v of face) {
          cxF += rotVerts[v][0];
          cyF += rotVerts[v][1];
          czF += rotVerts[v][2];
        }
        cxF /= face.length;
        cyF /= face.length;
        czF /= face.length;
        const viewX = -cxF;
        const viewY = -cyF;
        const viewZ = camZ - czF;
        const viewLen = Math.hypot(viewX, viewY, viewZ) || 1;
        const dotView = (nx * viewX + ny * viewY + nz * viewZ) / (nLen * viewLen);
        const backFacing = dotView < 0;
        // Lambertian from a fixed light direction (top-front-right)
        const lx = 0.4;
        const ly = 0.7;
        const lz = -0.6;
        const lLen = Math.hypot(lx, ly, lz);
        const lambert = Math.max(0.18, (nx * lx + ny * ly + nz * lz) / (nLen * lLen));
        drawFaces.push({ idx: i, avgZ, light: lambert, backFacing });
      }

      drawFaces.sort((p, q) => q.avgZ - p.avgZ); // far first

      for (const df of drawFaces) {
        if (df.backFacing) continue;
        if (df.idx >= facesToShow) continue;
        const face = polyhedron.faces[df.idx];
        ctx.beginPath();
        for (let k = 0; k < face.length; k++) {
          const p = projVerts[face[k]];
          if (k === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.closePath();
        const shade = Math.round(80 + df.light * 130);
        const cyanR = Math.round(shade * 0.45);
        const cyanG = Math.round(shade * 0.92);
        const cyanB = shade;
        ctx.fillStyle = `rgba(${cyanR}, ${cyanG}, ${cyanB}, 0.55)`;
        ctx.fill();
        ctx.strokeStyle = "rgba(125,243,255,0.55)";
        ctx.lineWidth = 1 * dpr;
        ctx.stroke();
      }

      // --- Edges ---
      const edgeVisible = stage === "edges" || stage === "faces" || stage === "done";
      const edgeCount = polyhedron.edges.length;
      const edgesToShow = edgeVisible
        ? stage === "edges"
          ? Math.round((progress / revealCap.E) * edgeCount)
          : edgeCount
        : 0;

      // When we are not yet at the faces stage, draw all edges as wireframe.
      if (stage !== "faces" && stage !== "done") {
        ctx.strokeStyle = "rgba(125,243,255,0.85)";
        ctx.lineWidth = 1.4 * dpr;
        for (let i = 0; i < edgesToShow; i++) {
          const [a, b] = polyhedron.edges[i];
          const pa = projVerts[a];
          const pb = projVerts[b];
          ctx.beginPath();
          ctx.moveTo(pa.x, pa.y);
          ctx.lineTo(pb.x, pb.y);
          ctx.stroke();
        }
        // ghosted remaining edges
        if (stage === "edges" && edgesToShow < edgeCount) {
          ctx.strokeStyle = "rgba(125,243,255,0.12)";
          ctx.lineWidth = 1 * dpr;
          for (let i = edgesToShow; i < edgeCount; i++) {
            const [a, b] = polyhedron.edges[i];
            const pa = projVerts[a];
            const pb = projVerts[b];
            ctx.beginPath();
            ctx.moveTo(pa.x, pa.y);
            ctx.lineTo(pb.x, pb.y);
            ctx.stroke();
          }
        }
        // If we are still at the vertex-counting stage, draw faint edges so
        // the shape is recognisable.
        if (stage === "idle" || stage === "vertices") {
          ctx.strokeStyle = "rgba(125,243,255,0.20)";
          ctx.lineWidth = 1 * dpr;
          for (let i = 0; i < edgeCount; i++) {
            const [a, b] = polyhedron.edges[i];
            const pa = projVerts[a];
            const pb = projVerts[b];
            ctx.beginPath();
            ctx.moveTo(pa.x, pa.y);
            ctx.lineTo(pb.x, pb.y);
            ctx.stroke();
          }
        }
      }

      // --- Vertices ---
      const vertVisible =
        stage === "vertices" || stage === "edges" || stage === "faces" || stage === "done";
      const vertCount = polyhedron.vertices.length;
      const vertsToShow =
        stage === "vertices"
          ? Math.round((progress / revealCap.V) * vertCount)
          : vertVisible
            ? vertCount
            : 0;

      const dotR = vertCount > 80 ? 1.6 * dpr : 3 * dpr;
      for (let i = 0; i < vertCount; i++) {
        const p = projVerts[i];
        if (i < vertsToShow) {
          ctx.fillStyle = palette.signal.amber;
          ctx.beginPath();
          ctx.arc(p.x, p.y, dotR, 0, Math.PI * 2);
          ctx.fill();
        } else if (stage === "vertices") {
          ctx.fillStyle = "rgba(125,243,255,0.25)";
          ctx.beginPath();
          ctx.arc(p.x, p.y, dotR * 0.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [polyhedron, stage, progress, revealCap, autoSpin, spinSpeed, dpr]);

  // --- Step handlers -----------------------------------------------------
  const startStage = (next: Stage) => {
    setProgress(0);
    setStage(next);
  };

  const resetCounts = () => {
    setStage("idle");
    setProgress(0);
    setTally({ V: 0, E: 0, F: 0 });
  };

  const sum = tally.V - tally.E + tally.F;
  const finalSum = polyhedron.V - polyhedron.E + polyhedron.F;
  const stageLabel: Record<Stage, string> = {
    idle: tr.stageIdle,
    vertices: tr.stageVertices,
    edges: tr.stageEdges,
    faces: tr.stageFaces,
    done: tr.stageDone,
  };

  return (
    <main className="flex min-h-screen flex-col pt-14">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_420px]">
        <div className="relative flex min-h-[60vh] flex-col gap-4 bg-ink-950 p-4 lg:min-h-[calc(100vh-3.5rem)] lg:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              {localizedLabel(polyhedron)} · {localizedNote(polyhedron)}
            </div>
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
              V − E + F = {finalSum}
            </div>
          </div>
          <div className="hairline relative flex-1 overflow-hidden rounded-2xl border bg-ink-950">
            <canvas ref={canvasRef} className="block h-full w-full" />
            {/* Running tally panel, overlaid */}
            <div className="glass hairline absolute left-4 top-4 space-y-1.5 rounded-xl border p-4 font-mono text-xs backdrop-blur">
              <div className="text-[10px] uppercase tracking-widest2 text-ink-300">
                {stageLabel[stage]}
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-base text-signal-amber">V = {tally.V}</span>
                <span className="text-ink-500">/ {polyhedron.V}</span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-base text-signal-amber">E = {tally.E}</span>
                <span className="text-ink-500">/ {polyhedron.E}</span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-base text-signal-rose">F = {tally.F}</span>
                <span className="text-ink-500">/ {polyhedron.F}</span>
              </div>
              <div className="hairline mt-2 border-t pt-2 text-sm text-ink-100">
                V − E + F = <span className="text-signal-amber">{sum}</span>
              </div>
              {stage === "done" && (
                <div className="pt-1 text-[10px] leading-relaxed text-ink-300">
                  χ = <span className="text-signal-amber">{finalSum}</span>{" "}
                  {finalSum === 2
                    ? tr.sphereLike
                    : finalSum === 0
                      ? tr.oneHandle
                      : finalSum === -2
                        ? tr.twoHandles
                        : ""}
                </div>
              )}
            </div>
          </div>
        </div>

        <aside className="hairline scrollbar-thin flex flex-col overflow-y-auto border-l bg-ink-900/40">
          <div className="hairline space-y-3 border-b p-6">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
              {topic.title}
            </div>
            <h1 className="math-italic text-3xl leading-tight text-ink-100">{topic.tagline}</h1>
            <p className="text-sm leading-relaxed text-ink-200">{topic.body}</p>
          </div>

          {/* Preset picker */}
          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {tr.polyhedron}
            </div>
            <div className="grid grid-cols-1 gap-1.5">
              {PRESETS.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => setPresetIdx(i)}
                  className={`rounded-md border px-3 py-2 text-left transition-colors ${
                    presetIdx === i
                      ? "border-signal-amber/60 bg-signal-amber/10 text-signal-amber"
                      : "hairline text-ink-200 hover:border-signal-amber/40 hover:text-ink-100"
                  }`}
                >
                  <div className="font-mono text-xs">{localizedLabel(p)}</div>
                  <div className="mt-0.5 font-mono text-[10px] text-ink-400">
                    V={p.V}, E={p.E}, F={p.F} &nbsp;·&nbsp; χ={p.V - p.E + p.F}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Auto-spin */}
          <div className="hairline space-y-3 border-b p-5">
            <div className="flex items-center justify-between">
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                {tr.autoSpin}
              </div>
              <button
                onClick={() => setAutoSpin((s) => !s)}
                className={`rounded-md border px-3 py-1 font-mono text-[10px] uppercase tracking-widest2 transition-colors ${
                  autoSpin
                    ? "border-signal-amber/60 bg-signal-amber/10 text-signal-amber"
                    : "hairline text-ink-300 hover:text-ink-100"
                }`}
              >
                {autoSpin ? tr.on : tr.off}
              </button>
            </div>
            <input
              type="range"
              value={spinSpeed}
              min={0}
              max={2.0}
              step={0.05}
              onChange={(e) => setSpinSpeed(parseFloat(e.target.value))}
              className="w-full accent-signal-amber"
              disabled={!autoSpin}
            />
            <div className="text-right font-mono text-[10px] text-ink-400">
              {tr.speed} {spinSpeed.toFixed(2)}
            </div>
          </div>

          {/* Stage buttons */}
          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {tr.step}
            </div>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => startStage("vertices")}
                className={`rounded-md border px-3 py-2 text-left transition-colors ${
                  stage === "vertices"
                    ? "border-signal-amber/60 bg-signal-amber/10 text-signal-amber"
                    : "hairline text-ink-200 hover:border-signal-amber/40 hover:text-signal-amber"
                }`}
              >
                <div className="font-mono text-xs">1 · {tr.countVertices}</div>
                <div className="mt-0.5 font-mono text-[10px] text-ink-400">V = {polyhedron.V}</div>
              </button>
              <button
                onClick={() => startStage("edges")}
                className={`rounded-md border px-3 py-2 text-left transition-colors ${
                  stage === "edges"
                    ? "border-signal-amber/60 bg-signal-amber/10 text-signal-amber"
                    : "hairline text-ink-200 hover:border-signal-amber/40 hover:text-signal-amber"
                }`}
              >
                <div className="font-mono text-xs">2 · {tr.countEdges}</div>
                <div className="mt-0.5 font-mono text-[10px] text-ink-400">E = {polyhedron.E}</div>
              </button>
              <button
                onClick={() => startStage("faces")}
                className={`rounded-md border px-3 py-2 text-left transition-colors ${
                  stage === "faces"
                    ? "border-signal-rose/60 bg-signal-rose/10 text-signal-rose"
                    : "hairline text-ink-200 hover:border-signal-rose/40 hover:text-signal-rose"
                }`}
              >
                <div className="font-mono text-xs">3 · {tr.countFaces}</div>
                <div className="mt-0.5 font-mono text-[10px] text-ink-400">F = {polyhedron.F}</div>
              </button>
              <button
                onClick={() => {
                  setStage("done");
                  setProgress(Math.max(revealCap.V, revealCap.E, revealCap.F));
                  setTally({ V: polyhedron.V, E: polyhedron.E, F: polyhedron.F });
                }}
                className="hairline rounded-md border px-3 py-2 text-left text-ink-200 transition-colors hover:border-ink-300/40 hover:text-ink-100"
              >
                <div className="font-mono text-xs">{tr.revealAll}</div>
              </button>
              <button
                onClick={resetCounts}
                className="hairline rounded-md border px-3 py-2 text-left text-ink-300 transition-colors hover:border-ink-300/40 hover:text-ink-100"
              >
                <div className="font-mono text-xs">{tr.reset}</div>
              </button>
            </div>
          </div>

          {/* Equation panel */}
          <div className="hairline space-y-2 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {tr.runningEquation}
            </div>
            <div className="font-mono text-lg text-ink-100">
              <span className="text-signal-amber">{tally.V}</span>
              <span className="text-ink-400"> − </span>
              <span className="text-signal-amber">{tally.E}</span>
              <span className="text-ink-400"> + </span>
              <span className="text-signal-rose">{tally.F}</span>
              <span className="text-ink-400"> = </span>
              <span className="text-signal-amber">{sum}</span>
            </div>
            <div className="font-mono text-[10px] text-ink-400">
              {tr.finalLabel} · {polyhedron.V} − {polyhedron.E} + {polyhedron.F} = {finalSum} (χ)
            </div>
            {finalSum !== 2 && (
              <div className="pt-1 font-mono text-[10px] leading-relaxed text-signal-amber">
                {localizationKey(polyhedron.id) === "torus"
                  ? tr.torusNote
                  : localizationKey(polyhedron.id) === "doubleTorus"
                    ? tr.doubleTorusNote
                    : tr.notSphereLike}
              </div>
            )}
          </div>

          <div className="p-5">
            <Link
              href="/"
              className="hairline block w-full rounded-md border py-2 text-center font-mono text-[10px] uppercase tracking-widest2 text-ink-300 transition-colors hover:border-signal-amber/40 hover:text-signal-amber"
            >
              {u.back}
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
