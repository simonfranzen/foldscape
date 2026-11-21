"use client";

import Link from "@/components/LocaleLink";
import { useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import type { Locale } from "@/lib/i18n/types";
import { useDpr } from "@/lib/hooks/useDpr";
import { palette } from "@/lib/visual/palette";
import { ExplorerGuideSection, ExplorerHelpButton } from "@/components/ExplorerGuide";
import { EULERCHAR_GUIDE } from "@/lib/explorer-guides/eulerchar";
import { PRESETS, type Polyhedron, type Vec3 } from "@/lib/eulerchar/meshes";

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
// must match the `id` strings produced by the builders in lib/eulerchar/meshes.ts (e.g.
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
      doubleTorus: { label: "Dobbelttorus", note: "to håndtak · χ = −2 (genus 2)" },
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
    notSphereLike: "χ ≠ 2: this surface is not sphere-like.",
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
    notSphereLike: "χ ≠ 2: Diese Fläche ist nicht kugelartig.",
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
    autoSpin: "Autorrotación",
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
    notSphereLike: "χ ≠ 2: esta superficie no es tipo esfera.",
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
    notSphereLike: "χ ≠ 2 : cette surface n'est pas de type sphère.",
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
    notSphereLike: "χ ≠ 2: questa superficie non è di tipo sfera.",
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
    notSphereLike: "χ ≠ 2: esta superfície não é do tipo esfera.",
    torusNote: "Uma superfície com uma asa: χ cai para 0.",
    doubleTorusNote: "Duas asas: χ = 2 − 2·2 = −2.",
    stageIdle: "Escolhe uma etapa →",
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
    notSphereLike: "χ ≠ 2: denna yta är inte sfärlik.",
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
    notSphereLike: "χ ≠ 2: Denne flaten er ikke kulelignende.",
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
// "Count vertices" → "Count edges" → "Count faces", each stage highlights the
// elements one by one and updates a running tally. The final equation
// V − E + F = χ is shown beside the shape.
// ---------------------------------------------------------------------------

type Stage = "idle" | "vertices" | "edges" | "faces" | "done";

// ---- Component ------------------------------------------------------------

export default function EulerCharExplorer() {
  const { a, u, locale } = useI18n();
  const topic = a.topics.eulerchar;
  const tr = RICH_EXPLORER[locale];
  const polyMap = buildPolyMap(locale);
  // Look up a polyhedron's localized display strings; the icosphere keeps
  // its subdivision suffix from `note` ("60 − 120 + 80 = 20 …") so we don't
  // overwrite it, we only translate `label` and the non-numeric portion.
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
  const [reduced, setReduced] = useState(false);
  const [spinSpeed, setSpinSpeed] = useState(0.6);
  const [stage, setStage] = useState<Stage>("idle");
  const [progress, setProgress] = useState(0); // how many V/E/F revealed
  const [tally, setTally] = useState({ V: 0, E: 0, F: 0 });

  const polyhedron = PRESETS[presetIdx];

  // Rotation state kept in a ref so the animation loop stays untouched by
  // React re-renders.
  const rotRef = useRef({ rx: 0.3, ry: 0.4 });

  // Track prefers-reduced-motion and re-subscribe so a system-setting change
  // swaps between the spinning loop and static frames.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(m.matches);
    on();
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);

  // Cap on highlight reveal: for huge meshes (icosphere, torus) we cap the
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

    let lastTs = performance.now();

    const draw = (ts: number) => {
      const dt = (ts - lastTs) / 1000;
      lastTs = ts;
      if (autoSpin && !reduced) {
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

      // Reduced motion: no rAF loop. The effect re-runs on every state change
      // (preset, stage, progress), so each run paints exactly one still frame.
      if (!reduced) raf = requestAnimationFrame(draw);
    };

    const resize = () => {
      canvas.width = Math.floor(canvas.clientWidth * dpr);
      canvas.height = Math.floor(canvas.clientHeight * dpr);
      // Setting width/height clears the canvas, and without a loop nothing
      // would repaint it.
      if (reduced) draw(performance.now());
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    if (!reduced) raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [polyhedron, stage, progress, revealCap, autoSpin, spinSpeed, dpr, reduced]);

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
  // Every preset is a closed, connected, orientable surface (the mesh tests
  // check this), so the number of handles follows from χ = 2 − 2g.
  const genus = (2 - finalSum) / 2;
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
            <div className="flex items-center gap-2">
              <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
                V − E + F = {finalSum}
              </div>
              <ExplorerHelpButton guide={EULERCHAR_GUIDE} />
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
                  {genus === 0
                    ? tr.sphereLike
                    : genus === 1
                      ? tr.oneHandle
                      : genus === 2
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
                disabled={reduced}
                aria-pressed={autoSpin && !reduced}
                className={`rounded-md border px-3 py-1 font-mono text-[10px] uppercase tracking-widest2 transition-colors disabled:opacity-50 ${
                  autoSpin && !reduced
                    ? "border-signal-amber/60 bg-signal-amber/10 text-signal-amber"
                    : "hairline text-ink-300 hover:text-ink-100"
                }`}
              >
                {autoSpin && !reduced ? tr.on : tr.off}
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
              disabled={!autoSpin || reduced}
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
                {genus === 1 ? tr.torusNote : genus === 2 ? tr.doubleTorusNote : tr.notSphereLike}
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
      <ExplorerGuideSection guide={EULERCHAR_GUIDE} storyHref="/eulerchar" />
    </main>
  );
}
