"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import type { Locale } from "@/lib/i18n/types";
import { useDpr } from "@/lib/hooks/useDpr";
import { palette } from "@/lib/visual/palette";

// ---------------------------------------------------------------------------
// P3 (rhombi) Penrose tiling via inflation of Robinson half-rhombi.
//
// We represent each tile as a triangle (half-rhombus) with three complex
// vertices A, B, C and a type:
//   type 0  →  half of a THIN  rhombus  (golden triangle: 36° at A, 72° at B/C)
//   type 1  →  half of a THICK rhombus  (golden gnomon:   108° at A, 36° at B/C)
// Two mirrored type-0 triangles share the edge B–C to form one thin rhombus;
// likewise for type-1 and the thick rhombus.
//
// Inflation rules (Penrose, standard formulation):
//   type 0:  P = A + (B − A) / φ
//            → type 0 (C, P, B), type 1 (P, C, A)
//   type 1:  Q = B + (A − B) / φ
//            R = B + (C − B) / φ
//            → type 1 (R, C, A), type 1 (Q, R, B), type 0 (R, Q, A)
// ---------------------------------------------------------------------------

const PHI = (1 + Math.sqrt(5)) / 2;

interface Complex {
  re: number;
  im: number;
}

interface Tri {
  t: 0 | 1; // half-rhombus type
  a: Complex;
  b: Complex;
  c: Complex;
}

const cAdd = (x: Complex, y: Complex): Complex => ({ re: x.re + y.re, im: x.im + y.im });
const cSub = (x: Complex, y: Complex): Complex => ({ re: x.re - y.re, im: x.im - y.im });
const cScale = (x: Complex, k: number): Complex => ({ re: x.re * k, im: x.im * k });
const cFromPolar = (r: number, theta: number): Complex => ({
  re: r * Math.cos(theta),
  im: r * Math.sin(theta),
});
const _cRot = (x: Complex, theta: number): Complex => {
  const c = Math.cos(theta);
  const s = Math.sin(theta);
  return { re: x.re * c - x.im * s, im: x.re * s + x.im * c };
};

// Seed: ten thick half-rhombi around the origin, alternating chirality,
// arranged to form a regular decagon — gives perfect 5-fold symmetry.
function seedSun(rotation: number): Tri[] {
  const tris: Tri[] = [];
  const origin: Complex = { re: 0, im: 0 };
  for (let i = 0; i < 10; i++) {
    const baseAngle = ((2 * i - 1) * Math.PI) / 10 + rotation;
    const tipAngle = ((2 * i + 1) * Math.PI) / 10 + rotation;
    let b = cFromPolar(1, baseAngle);
    let c = cFromPolar(1, tipAngle);
    // Mirror every other triangle so adjacent pairs form one full rhombus.
    if (i % 2 === 0) {
      const tmp = b;
      b = c;
      c = tmp;
    }
    tris.push({ t: 0, a: origin, b, c });
  }
  return tris;
}

function inflate(tris: Tri[]): Tri[] {
  const out: Tri[] = [];
  for (const tr of tris) {
    if (tr.t === 0) {
      const P = cAdd(tr.a, cScale(cSub(tr.b, tr.a), 1 / PHI));
      out.push({ t: 0, a: tr.c, b: P, c: tr.b });
      out.push({ t: 1, a: P, b: tr.c, c: tr.a });
    } else {
      const Q = cAdd(tr.b, cScale(cSub(tr.a, tr.b), 1 / PHI));
      const R = cAdd(tr.b, cScale(cSub(tr.c, tr.b), 1 / PHI));
      out.push({ t: 1, a: R, b: tr.c, c: tr.a });
      out.push({ t: 1, a: Q, b: R, c: tr.b });
      out.push({ t: 0, a: R, b: Q, c: tr.a });
    }
  }
  return out;
}

function buildTiling(depth: number, rotation: number): Tri[] {
  let tris = seedSun(rotation);
  for (let i = 0; i < depth; i++) tris = inflate(tris);
  return tris;
}

// ---------------------------------------------------------------------------
// "Half-triangles" view of the SAME P3 tiling.
//
// This mode does not build a different tiling: it renders the Robinson
// half-rhombi (golden triangles) directly instead of pairing them into full
// rhombi. Two mirrored type-0 halves make one thin rhombus; two mirrored
// type-1 halves make one thick rhombus. It is the same deflation, shown one
// abstraction level lower, the triangles the rhombi are cut from.
// ---------------------------------------------------------------------------

function buildHalfTriangles(depth: number, rotation: number): Tri[] {
  let tris = seedSun(rotation);
  for (let i = 0; i < depth; i++) tris = inflate(tris);
  return tris;
}

// Group mirrored half-rhombi back into full rhombi for clean rendering.
// Each rhombus has 4 vertices: A, B, A', C (where A' is reflection of A across BC).
// For a half-triangle (A, B, C), the missing vertex is A' = B + C − A only if BC is
// the axis of symmetry — which it IS for our Robinson triangles (both legs have
// equal length |AB| = |AC| for type 0 and |BA| = |BC| for type 1... wait).
//
// Actually: type 0 (thick half-rhombus) has the apex A at 36°; its two equal
// edges are A→B and A→C (the rhombus sides). The base B–C is the rhombus's
// short diagonal. The mirror partner shares B–C; the full rhombus has vertices
// A, B, A', C with A' = B + C − A. ✓
// type 1 (thin half-rhombus) has the apex A at 108°; the equal edges are again
// A→B and A→C, so the same construction works.
interface Rhomb {
  t: 0 | 1;
  pts: [Complex, Complex, Complex, Complex];
}

function trianglesToRhombi(tris: Tri[]): Rhomb[] {
  // De-duplicate via the BC midpoint key.
  const map = new Map<string, Tri>();
  const out: Rhomb[] = [];
  const key = (p: Complex, q: Complex): string => {
    const mx = (p.re + q.re) / 2;
    const my = (p.im + q.im) / 2;
    return `${mx.toFixed(6)}:${my.toFixed(6)}`;
  };
  for (const tr of tris) {
    const k = key(tr.b, tr.c);
    const partner = map.get(k);
    if (partner !== undefined && partner.t === tr.t) {
      const aPrime = cSub(cAdd(partner.b, partner.c), partner.a);
      out.push({ t: tr.t, pts: [tr.a, tr.b, aPrime, tr.c] });
      map.delete(k);
    } else {
      map.set(k, tr);
    }
  }
  // Leftover half-rhombi at the boundary — render them as triangles via degenerate
  // quad (A, B, midpoint-shifted, C). We treat them as full rhombi by reflecting
  // anyway so the boundary stays clean.
  for (const tr of map.values()) {
    const aPrime = cSub(cAdd(tr.b, tr.c), tr.a);
    out.push({ t: tr.t, pts: [tr.a, tr.b, aPrime, tr.c] });
  }
  return out;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Inline per-locale UI copy for the explorer sidebar (mirrors the story page's
// RICH_STORY pattern so the room is fully localized, not English-only).
// ---------------------------------------------------------------------------

type ExplorerCopy = {
  mode: string;
  modeRhombi: string;
  modeTriangles: string;
  trianglesNote: string;
  depth: string;
  rhombiWord: string;
  halvesWord: string;
  depthNote: string;
  rotation: string;
  display: string;
  outlines: string;
  colors: string;
  arrows: string;
  arrowsNote: string;
  center: string;
  thick: string;
  thin: string;
  thickHalves: string;
  thinHalves: string;
  ratioNote: string;
  on: string;
  off: string;
  canvasLabel: string;
};

const RICH_EXPLORER: Record<Locale, ExplorerCopy> = {
  en: {
    mode: "Mode",
    modeRhombi: "Rhombi",
    modeTriangles: "Half-triangles",
    trianglesNote:
      "The Robinson half-triangles the rhombi are cut from. Thick halves violet, thin halves amber; the thick/thin count ratio converges to φ ≈ 1.618.",
    depth: "Deflation depth",
    rhombiWord: "rhombi",
    halvesWord: "half-tiles",
    depthNote: "Depth 6 is already about 1,200 rhombi; the count grows by φ² ≈ 2.618 each step.",
    rotation: "Seed rotation",
    display: "Display",
    outlines: "Show outlines",
    colors: "Show colors",
    arrows: "Matching markers",
    arrowsNote:
      "Single marker = thick-rhombus edge · double = thin. Conway-style hint: markers must agree across a shared edge.",
    center: "Centre · reset rotation",
    thick: "thick",
    thin: "thin",
    thickHalves: "thick halves",
    thinHalves: "thin halves",
    ratioNote: "thick / thin → φ",
    on: "on",
    off: "off",
    canvasLabel: "Penrose P3 rhombus tiling",
  },
  de: {
    mode: "Modus",
    modeRhombi: "Rhomben",
    modeTriangles: "Halbdreiecke",
    trianglesNote:
      "Die Robinson-Halbdreiecke, aus denen die Rhomben geschnitten sind. Dicke Hälften violett, dünne bernstein; das Verhältnis dick/dünn konvergiert gegen φ ≈ 1,618.",
    depth: "Deflationstiefe",
    rhombiWord: "Rhomben",
    halvesWord: "Halbkacheln",
    depthNote: "Tiefe 6 sind schon etwa 1.200 Rhomben; die Anzahl wächst pro Schritt um φ² ≈ 2,618.",
    rotation: "Keim-Drehung",
    display: "Anzeige",
    outlines: "Umrisse zeigen",
    colors: "Farben zeigen",
    arrows: "Anlegemarken",
    arrowsNote:
      "Einfache Marke = Kante des dicken Rhombus · doppelte = dünn. Conway-artiger Hinweis: die Marken müssen über eine geteilte Kante zusammenpassen.",
    center: "Zentrieren · Drehung zurücksetzen",
    thick: "dick",
    thin: "dünn",
    thickHalves: "dicke Hälften",
    thinHalves: "dünne Hälften",
    ratioNote: "dick / dünn → φ",
    on: "an",
    off: "aus",
    canvasLabel: "Penrose-P3-Rhombenparkettierung",
  },
  es: {
    mode: "Modo",
    modeRhombi: "Rombos",
    modeTriangles: "Medios triángulos",
    trianglesNote:
      "Los medios triángulos de Robinson de los que se recortan los rombos. Mitades gruesas en violeta, finas en ámbar; la razón grueso/fino converge a φ ≈ 1,618.",
    depth: "Profundidad de deflación",
    rhombiWord: "rombos",
    halvesWord: "medias-piezas",
    depthNote: "La profundidad 6 ya son unos 1200 rombos; el número crece por φ² ≈ 2,618 en cada paso.",
    rotation: "Rotación de la semilla",
    display: "Visualización",
    outlines: "Mostrar contornos",
    colors: "Mostrar colores",
    arrows: "Marcas de encaje",
    arrowsNote:
      "Marca simple = arista del rombo grueso · doble = fino. Pista al estilo Conway: las marcas deben coincidir a través de una arista compartida.",
    center: "Centrar · restablecer rotación",
    thick: "grueso",
    thin: "fino",
    thickHalves: "mitades gruesas",
    thinHalves: "mitades finas",
    ratioNote: "grueso / fino → φ",
    on: "sí",
    off: "no",
    canvasLabel: "Teselado de rombos Penrose P3",
  },
  fr: {
    mode: "Mode",
    modeRhombi: "Losanges",
    modeTriangles: "Demi-triangles",
    trianglesNote:
      "Les demi-triangles de Robinson dont on découpe les losanges. Moitiés épaisses en violet, fines en ambre ; le rapport épais/fin converge vers φ ≈ 1,618.",
    depth: "Profondeur de déflation",
    rhombiWord: "losanges",
    halvesWord: "demi-tuiles",
    depthNote: "La profondeur 6 fait déjà environ 1 200 losanges ; le nombre croît de φ² ≈ 2,618 à chaque étape.",
    rotation: "Rotation de la graine",
    display: "Affichage",
    outlines: "Afficher les contours",
    colors: "Afficher les couleurs",
    arrows: "Marques d'accord",
    arrowsNote:
      "Marque simple = arête du losange épais · double = fin. Indice façon Conway : les marques doivent concorder de part et d'autre d'une arête partagée.",
    center: "Centrer · réinitialiser la rotation",
    thick: "épais",
    thin: "fin",
    thickHalves: "moitiés épaisses",
    thinHalves: "moitiés fines",
    ratioNote: "épais / fin → φ",
    on: "oui",
    off: "non",
    canvasLabel: "Pavage de losanges Penrose P3",
  },
  it: {
    mode: "Modalità",
    modeRhombi: "Rombi",
    modeTriangles: "Mezzi triangoli",
    trianglesNote:
      "I mezzi triangoli di Robinson da cui si ritagliano i rombi. Metà spesse in viola, sottili in ambra; il rapporto spesso/sottile converge a φ ≈ 1,618.",
    depth: "Profondità di deflazione",
    rhombiWord: "rombi",
    halvesWord: "mezze-piastrelle",
    depthNote: "La profondità 6 sono già circa 1200 rombi; il numero cresce di φ² ≈ 2,618 a ogni passo.",
    rotation: "Rotazione del seme",
    display: "Visualizzazione",
    outlines: "Mostra contorni",
    colors: "Mostra colori",
    arrows: "Marche di incastro",
    arrowsNote:
      "Marca singola = lato del rombo spesso · doppia = sottile. Suggerimento alla Conway: le marche devono combaciare su un lato condiviso.",
    center: "Centra · azzera rotazione",
    thick: "spesso",
    thin: "sottile",
    thickHalves: "metà spesse",
    thinHalves: "metà sottili",
    ratioNote: "spesso / sottile → φ",
    on: "sì",
    off: "no",
    canvasLabel: "Tassellatura di rombi Penrose P3",
  },
  pt: {
    mode: "Modo",
    modeRhombi: "Losangos",
    modeTriangles: "Meios triângulos",
    trianglesNote:
      "Os meios triângulos de Robinson de que se recortam os losangos. Metades espessas em violeta, finas em âmbar; a razão espesso/fino converge para φ ≈ 1,618.",
    depth: "Profundidade de deflação",
    rhombiWord: "losangos",
    halvesWord: "meias-peças",
    depthNote: "A profundidade 6 já são cerca de 1200 losangos; o número cresce por φ² ≈ 2,618 a cada passo.",
    rotation: "Rotação da semente",
    display: "Visualização",
    outlines: "Mostrar contornos",
    colors: "Mostrar cores",
    arrows: "Marcas de encaixe",
    arrowsNote:
      "Marca simples = aresta do losango espesso · dupla = fino. Dica ao estilo Conway: as marcas têm de coincidir através de uma aresta partilhada.",
    center: "Centrar · repor rotação",
    thick: "espesso",
    thin: "fino",
    thickHalves: "metades espessas",
    thinHalves: "metades finas",
    ratioNote: "espesso / fino → φ",
    on: "sim",
    off: "não",
    canvasLabel: "Tiling de losangos Penrose P3",
  },
  sv: {
    mode: "Läge",
    modeRhombi: "Romber",
    modeTriangles: "Halvtrianglar",
    trianglesNote:
      "Robinson-halvtrianglarna som romberna skärs ur. Tjocka halvor i violett, tunna i bärnsten; förhållandet tjock/tunn konvergerar mot φ ≈ 1,618.",
    depth: "Deflationsdjup",
    rhombiWord: "romber",
    halvesWord: "halvplattor",
    depthNote: "Djup 6 är redan omkring 1 200 romber; antalet växer med φ² ≈ 2,618 per steg.",
    rotation: "Frörotation",
    display: "Visning",
    outlines: "Visa konturer",
    colors: "Visa färger",
    arrows: "Matchmarkeringar",
    arrowsNote:
      "Enkel markering = kant på den tjocka romben · dubbel = tunn. Conway-liknande ledtråd: markeringarna måste stämma över en delad kant.",
    center: "Centrera · nollställ rotation",
    thick: "tjock",
    thin: "tunn",
    thickHalves: "tjocka halvor",
    thinHalves: "tunna halvor",
    ratioNote: "tjock / tunn → φ",
    on: "på",
    off: "av",
    canvasLabel: "Penrose P3-rombparkettering",
  },
  no: {
    mode: "Modus",
    modeRhombi: "Romber",
    modeTriangles: "Halvtrekanter",
    trianglesNote:
      "Robinson-halvtrekantene som rombene skjæres ut av. Tykke halvdeler i fiolett, tynne i rav; forholdet tykk/tynn konvergerer mot φ ≈ 1,618.",
    depth: "Deflasjonsdybde",
    rhombiWord: "romber",
    halvesWord: "halvfliser",
    depthNote: "Dybde 6 er allerede omtrent 1200 romber; antallet vokser med φ² ≈ 2,618 per trinn.",
    rotation: "Frørotasjon",
    display: "Visning",
    outlines: "Vis omriss",
    colors: "Vis farger",
    arrows: "Matchmarkeringer",
    arrowsNote:
      "Enkel markering = kant på den tykke romben · dobbel = tynn. Conway-aktig hint: markeringene må stemme over en delt kant.",
    center: "Sentrer · nullstill rotasjon",
    thick: "tykk",
    thin: "tynn",
    thickHalves: "tykke halvdeler",
    thinHalves: "tynne halvdeler",
    ratioNote: "tykk / tynn → φ",
    on: "på",
    off: "av",
    canvasLabel: "Penrose P3-rombeflislegging",
  },
};

type Mode = "P3" | "P2";

const FAT_FILL = "rgba(167, 139, 250, 0.30)"; // violet
const FAT_STROKE = "rgba(167, 139, 250, 0.95)";
const THIN_FILL = "rgba(255, 110, 196, 0.32)"; // rose
const THIN_STROKE = "rgba(255, 110, 196, 0.95)";
const ARROW_SINGLE = "rgba(255, 209, 102, 0.9)";
const ARROW_DOUBLE = "rgba(125, 243, 255, 0.9)";

// Half-triangle palette: thick halves violet, thin halves amber
const THICK_HALF_FILL = "rgba(179, 136, 255, 0.15)"; // violet
const THICK_HALF_STROKE = palette.signal.violet;
const THIN_HALF_FILL = "rgba(255, 209, 102, 0.15)"; // amber
const THIN_HALF_STROKE = palette.signal.amber;

export default function PenroseExplorer() {
  const { a, u, locale } = useI18n();
  const topic = a.topics.penrose;
  const copy = RICH_EXPLORER[locale];
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dpr = useDpr();

  const [mode, setMode] = useState<Mode>("P3");
  const [depth, setDepth] = useState(4);
  const [rotation, setRotation] = useState(0); // degrees
  const [showOutlines, setShowOutlines] = useState(true);
  const [showColors, setShowColors] = useState(true);
  const [showArrows, setShowArrows] = useState(false);
  const [recenterTick, setRecenterTick] = useState(0);

  const rotationRad = (rotation * Math.PI) / 180;

  const rhombi = useMemo<Rhomb[]>(() => {
    if (mode !== "P3") return [];
    const tris = buildTiling(depth, rotationRad);
    return trianglesToRhombi(tris);
  }, [mode, depth, rotationRad]);

  const p2Tris = useMemo<Tri[]>(() => {
    if (mode !== "P2") return [];
    return buildHalfTriangles(depth, rotationRad);
  }, [mode, depth, rotationRad]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const render = () => {
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = palette.canvas.bg;
      ctx.fillRect(0, 0, W, H);

      // Auto-scale: fit the seed disc of radius ~1 to ~85% of the viewport.
      const margin = 24;
      const fit = Math.min(W, H) - margin * 2;
      const scale = (fit / 2) * 0.95;
      const cx = W / 2;
      const cy = H / 2;
      const px = (p: Complex) => cx + p.re * scale;
      const py = (p: Complex) => cy - p.im * scale;

      if (mode === "P2") {
        const thickFill = showColors ? THICK_HALF_FILL : "rgba(205, 210, 224, 0.10)";
        const thinFill = showColors ? THIN_HALF_FILL : "rgba(205, 210, 224, 0.06)";

        // Type-1 half-triangles (thick-rhombus halves) multiply faster under
        // the Robinson deflation (transition matrix [[1,1],[1,2]] has
        // eigenvector [1, φ]), so thick outnumber thin and the thick/thin
        // count ratio converges to φ ≈ 1.618, the canonical Penrose result.
        const isThick = (t: 0 | 1) => t === 1;

        // Pass 1: fills (half-triangles tile cleanly).
        for (const tr of p2Tris) {
          ctx.beginPath();
          ctx.moveTo(px(tr.a), py(tr.a));
          ctx.lineTo(px(tr.b), py(tr.b));
          ctx.lineTo(px(tr.c), py(tr.c));
          ctx.closePath();
          ctx.fillStyle = isThick(tr.t) ? thickFill : thinFill;
          ctx.fill();
        }

        // Pass 2: outlines. Draw only the two rhombus sides (A→B and A→C) so
        // the internal symmetry-axis seams (B to C) are hidden, showing each
        // half-triangle cleanly.
        if (showOutlines) {
          ctx.lineWidth = Math.max(0.5, Math.min(1.4, 1.6 - depth * 0.15));
          for (const tr of p2Tris) {
            ctx.strokeStyle = isThick(tr.t) ? THICK_HALF_STROKE : THIN_HALF_STROKE;
            ctx.globalAlpha = showColors ? 0.85 : 0.6;
            ctx.beginPath();
            ctx.moveTo(px(tr.a), py(tr.a));
            ctx.lineTo(px(tr.b), py(tr.b));
            ctx.moveTo(px(tr.a), py(tr.a));
            ctx.lineTo(px(tr.c), py(tr.c));
            ctx.stroke();
          }
          ctx.globalAlpha = 1;
        }

        // Subtle vignette
        const gradP2 = ctx.createRadialGradient(cx, cy, fit * 0.4, cx, cy, fit * 0.95);
        gradP2.addColorStop(0, "rgba(0,0,0,0)");
        gradP2.addColorStop(1, "rgba(6,7,13,0.7)");
        ctx.fillStyle = gradP2;
        ctx.fillRect(0, 0, W, H);
        return;
      }

      // Draw fills first, sorted by type (thick under thin, so outlines mix nicely).
      const fatFill = showColors ? FAT_FILL : "rgba(205, 210, 224, 0.10)";
      const thinFill = showColors ? THIN_FILL : "rgba(205, 210, 224, 0.06)";

      for (const r of rhombi) {
        ctx.beginPath();
        ctx.moveTo(px(r.pts[0]), py(r.pts[0]));
        ctx.lineTo(px(r.pts[1]), py(r.pts[1]));
        ctx.lineTo(px(r.pts[2]), py(r.pts[2]));
        ctx.lineTo(px(r.pts[3]), py(r.pts[3]));
        ctx.closePath();
        ctx.fillStyle = r.t === 1 ? fatFill : thinFill;
        ctx.fill();
        if (showOutlines) {
          ctx.lineWidth = 0.8;
          ctx.strokeStyle = r.t === 1 ? FAT_STROKE : THIN_STROKE;
          ctx.globalAlpha = showColors ? 0.7 : 0.55;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }

      // Conway's matching arrows: every edge carries a single or double arrow.
      // For P3 rhombi, the standard convention places one arrow on the "short"
      // type-of-edge and a double arrow on the "long" type. We use the rhombus
      // sides only (the inflation does not give us the diagonals here), and
      // draw arrows from vertex 0 → 1 and from vertex 2 → 3, single for thick,
      // double for thin (an iconic-but-simplified rendering).
      if (showArrows) {
        const drawArrow = (p: Complex, q: Complex, colour: string, double: boolean): void => {
          const x1 = px(p);
          const y1 = py(p);
          const x2 = px(q);
          const y2 = py(q);
          const mx = (x1 + x2) / 2;
          const my = (y1 + y2) / 2;
          const dx = x2 - x1;
          const dy = y2 - y1;
          const len = Math.hypot(dx, dy);
          if (len < 6) return;
          const ux = dx / len;
          const uy = dy / len;
          const size = Math.min(7, len * 0.18);
          ctx.strokeStyle = colour;
          ctx.fillStyle = colour;
          ctx.lineWidth = 1.1;
          const drawHead = (cxh: number, cyh: number) => {
            ctx.beginPath();
            ctx.moveTo(cxh, cyh);
            ctx.lineTo(cxh - ux * size - uy * size * 0.5, cyh - uy * size + ux * size * 0.5);
            ctx.moveTo(cxh, cyh);
            ctx.lineTo(cxh - ux * size + uy * size * 0.5, cyh - uy * size - ux * size * 0.5);
            ctx.stroke();
          };
          if (double) {
            drawHead(mx + ux * 2, my + uy * 2);
            drawHead(mx - ux * 2, my - uy * 2);
          } else {
            drawHead(mx, my);
          }
        };
        for (const r of rhombi) {
          const single = r.t === 1; // thick (fat) → single arrows
          const colour = single ? ARROW_SINGLE : ARROW_DOUBLE;
          drawArrow(r.pts[0], r.pts[1], colour, !single);
          drawArrow(r.pts[2], r.pts[3], colour, single);
        }
      }

      // Subtle vignette
      const grad = ctx.createRadialGradient(cx, cy, fit * 0.4, cx, cy, fit * 0.95);
      grad.addColorStop(0, "rgba(0,0,0,0)");
      grad.addColorStop(1, "rgba(6,7,13,0.7)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
    };

    render();
    const ro = new ResizeObserver(render);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [rhombi, p2Tris, mode, depth, showOutlines, showColors, showArrows, recenterTick, dpr]);

  const tileCount = rhombi.length;
  // type 1 → thick rhombus, type 0 → thin rhombus. Thick outnumber thin by φ.
  const fatCount = rhombi.filter((r) => r.t === 1).length;
  const thinCount = rhombi.filter((r) => r.t === 0).length;
  const ratio = thinCount > 0 ? (fatCount / thinCount).toFixed(4) : "—";

  // Half-triangle counts: type 1 = thick-rhombus halves, type 0 = thin. The
  // thick/thin count ratio converges to φ ≈ 1.618.
  const thickHalfCount = p2Tris.filter((t) => t.t === 1).length;
  const thinHalfCount = p2Tris.filter((t) => t.t === 0).length;
  const p2Ratio = thinHalfCount > 0 ? (thickHalfCount / thinHalfCount).toFixed(4) : "—";
  const halfCount = p2Tris.length;

  return (
    <main className="flex min-h-screen flex-col pt-14">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_420px]">
        <div className="relative flex min-h-[60vh] flex-col gap-4 bg-ink-950 p-4 lg:min-h-[calc(100vh-3.5rem)] lg:p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              {mode === "P3"
                ? `Penrose P3 · ${copy.depth} ${depth} · ${tileCount} ${copy.rhombiWord}`
                : `Penrose P3 · ${copy.depth} ${depth} · ${halfCount} ${copy.halvesWord}`}
            </div>
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-violet">
              φ = (1 + √5) / 2
            </div>
          </div>
          <div className="hairline flex-1 overflow-hidden rounded-2xl border bg-ink-950">
            <canvas
              ref={canvasRef}
              className="block h-full w-full"
              role="img"
              aria-label={`${copy.canvasLabel} · ${copy.depth} ${depth}`}
            />
          </div>
          {mode === "P3" ? (
            <div className="grid grid-cols-3 gap-3">
              <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase text-ink-300">
                <div className="text-signal-violet">{copy.thick}</div>
                <div className="mt-1 font-mono text-sm normal-case text-ink-100">{fatCount}</div>
              </div>
              <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase text-ink-300">
                <div className="text-signal-rose">{copy.thin}</div>
                <div className="mt-1 font-mono text-sm normal-case text-ink-100">{thinCount}</div>
              </div>
              <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase text-ink-300">
                <div>{copy.ratioNote}</div>
                <div className="mt-1 font-mono text-sm normal-case text-ink-100">{ratio}</div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase text-ink-300">
                <div className="text-signal-violet">{copy.thickHalves}</div>
                <div className="mt-1 font-mono text-sm normal-case text-ink-100">{thickHalfCount}</div>
              </div>
              <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase text-ink-300">
                <div className="text-signal-amber">{copy.thinHalves}</div>
                <div className="mt-1 font-mono text-sm normal-case text-ink-100">{thinHalfCount}</div>
              </div>
              <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase text-ink-300">
                <div>{copy.ratioNote}</div>
                <div className="mt-1 font-mono text-sm normal-case text-ink-100">{p2Ratio}</div>
              </div>
            </div>
          )}
        </div>

        <aside className="hairline scrollbar-thin flex flex-col overflow-y-auto border-l bg-ink-900/40">
          <div className="hairline space-y-3 border-b p-6">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-violet">
              {topic.title}
            </div>
            <h1 className="math-italic text-3xl leading-tight text-ink-100">{topic.tagline}</h1>
            <p className="text-sm leading-relaxed text-ink-200">{topic.body}</p>
          </div>

          <div className="hairline space-y-4 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {copy.mode}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(["P3", "P2"] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  aria-pressed={mode === m}
                  className={`rounded-md border px-3 py-2 font-mono text-xs transition-colors ${
                    mode === m
                      ? "border-signal-violet/60 bg-signal-violet/10 text-signal-violet"
                      : "hairline text-ink-200 hover:border-signal-violet/40 hover:text-ink-100"
                  }`}
                >
                  {m === "P3" ? copy.modeRhombi : copy.modeTriangles}
                </button>
              ))}
            </div>
            {mode === "P2" && (
              <p className="font-mono text-[10px] leading-relaxed text-ink-400">
                {copy.trianglesNote}
              </p>
            )}
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {copy.depth}
            </div>
            <div className="flex items-center justify-between font-mono text-sm">
              <span className="text-signal-violet">{depth}</span>
              <span className="text-[10px] text-ink-400">
                {mode === "P3"
                  ? `${tileCount} ${copy.rhombiWord}`
                  : `${halfCount} ${copy.halvesWord}`}
              </span>
            </div>
            <input
              type="range"
              value={depth}
              min={0}
              max={6}
              step={1}
              onChange={(e) => setDepth(parseInt(e.target.value, 10))}
              className="w-full accent-signal-violet"
              aria-label={copy.depth}
            />
            {depth >= 5 && (
              <p className="font-mono text-[10px] leading-relaxed text-ink-400">{copy.depthNote}</p>
            )}
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {copy.rotation}
            </div>
            <div className="flex items-center justify-between font-mono text-sm">
              <span className="text-signal-amber">{rotation}°</span>
            </div>
            <input
              type="range"
              value={rotation}
              min={0}
              max={360}
              step={1}
              onChange={(e) => setRotation(parseInt(e.target.value, 10))}
              className="w-full accent-signal-amber"
              aria-label={copy.rotation}
            />
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {copy.display}
            </div>
            <Toggle label={copy.outlines} value={showOutlines} onChange={setShowOutlines} on={copy.on} off={copy.off} />
            <Toggle label={copy.colors} value={showColors} onChange={setShowColors} on={copy.on} off={copy.off} />
            <Toggle label={copy.arrows} value={showArrows} onChange={setShowArrows} on={copy.on} off={copy.off} />
            <p className="pt-1 font-mono text-[10px] leading-relaxed text-ink-400">{copy.arrowsNote}</p>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <button
              onClick={() => {
                setRotation(0);
                setRecenterTick((n) => n + 1);
              }}
              className="hairline block w-full rounded-md border py-2 text-center font-mono text-[10px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-signal-violet/40 hover:text-signal-violet"
            >
              {copy.center}
            </button>
          </div>

          <div className="p-5">
            <Link
              href="/"
              className="hairline block w-full rounded-md border py-2 text-center font-mono text-[10px] uppercase tracking-widest2 text-ink-300 transition-colors hover:border-signal-violet/40 hover:text-signal-violet"
            >
              {u.back}
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}

function Toggle({
  label,
  value,
  onChange,
  on,
  off,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
  on: string;
  off: string;
}) {
  return (
    <button
      onClick={() => onChange(!value)}
      aria-pressed={value}
      className={`flex w-full items-center justify-between rounded-md border px-3 py-2 font-mono text-xs transition-colors ${
        value
          ? "border-signal-violet/50 bg-signal-violet/10 text-signal-violet"
          : "hairline text-ink-200 hover:border-signal-violet/40 hover:text-ink-100"
      }`}
    >
      <span>{label}</span>
      <span className="text-[10px] uppercase tracking-widest2">{value ? on : off}</span>
    </button>
  );
}
