"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { useDpr } from "@/lib/hooks/useDpr";
import { palette } from "@/lib/visual/palette";
import type { Locale } from "@/lib/i18n/types";

const withAlpha = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

// ---------- Geometry types ----------

interface Circle {
  x: number; // centre x; outer disc centred at (0,0), radius r = 1/|k_outer|
  y: number;
  r: number; // geometric radius, always positive
  k: number; // signed curvature: +1/r for ordinary circles, −1/r for the enclosing one
}

interface Preset {
  label: string;
  seeds: [number, number, number, number]; // (k1, k2, k3, k4) with k1 the outer (negative)
}

// All listed packings are integer Apollonian. The first entry is the enclosing
// (negative-curvature) circle; the other three are the original mutually
// tangent triple; the fourth seed circle is derived geometrically.
const PRESETS: Preset[] = [
  { label: "(−1, 2, 2, 3)", seeds: [-1, 2, 2, 3] },
  { label: "(−2, 3, 6, 7)", seeds: [-2, 3, 6, 7] },
  { label: "(−3, 5, 8, 8)", seeds: [-3, 5, 8, 8] },
  { label: "(−4, 8, 9, 9)", seeds: [-4, 8, 9, 9] },
  { label: "(−6, 11, 14, 15)", seeds: [-6, 11, 14, 15] },
];

// ---------- Seed-circle placement ----------
//
// Given four mutually tangent signed curvatures (k1, k2, k3, k4) with k1 the
// outer (negative) circle, we place the four circles in the unit-square plane
// using these geometric facts:
//
//   • The outer circle has radius R = 1/|k1| and centre at (0, 0).
//   • If two interior circles touch the outer one and each other along a
//     diameter, they are co-linear with the centre. We can place the larger
//     interior circles symmetrically along the x-axis.
//   • The remaining circles are positioned by the Descartes / complex form
//     reflection law, derived from solving for the centre of the small circle
//     given the curvatures and centres of three mutually tangent circles.
//
// For robustness we use the Lagarias–Mallows–Wilks "complex Descartes" form:
//   k4·z4 = k1·z1 + k2·z2 + k3·z3 ± 2·√(k1 k2 z1 z2 + k2 k3 z2 z3 + k3 k1 z3 z1)
// where z = x + iy. We unfold complex arithmetic into (x, y) pairs.

interface CNum {
  re: number;
  im: number;
}
const cAdd = (a: CNum, b: CNum): CNum => ({ re: a.re + b.re, im: a.im + b.im });
const cSub = (a: CNum, b: CNum): CNum => ({ re: a.re - b.re, im: a.im - b.im });
const cMul = (a: CNum, b: CNum): CNum => ({
  re: a.re * b.re - a.im * b.im,
  im: a.re * b.im + a.im * b.re,
});
const cScale = (a: CNum, s: number): CNum => ({ re: a.re * s, im: a.im * s });
const cSqrt = (a: CNum): CNum => {
  const mag = Math.hypot(a.re, a.im);
  const re = Math.sqrt((mag + a.re) / 2);
  const im = Math.sign(a.im || 1) * Math.sqrt(Math.max(0, (mag - a.re) / 2));
  return { re, im };
};

// Solve for the two candidate fourth circles given three known ones.
//
// In the complex Descartes theorem the sign of the centre equation
// (linear ± 2√disc) is INDEPENDENT of the sign of the curvature equation
// (sumK ± 2√inner). So we return both curvature roots plus the raw `linear`
// and `sq = 2√disc` terms; the caller matches the target curvature and then
// picks the centre sign by an explicit tangency test (see placeSeed). Coupling
// zPlus↔kPlus / zMinus↔kMinus here would be wrong for most seeds.
function descartesFourthZ(
  k1: number,
  k2: number,
  k3: number,
  z1: CNum,
  z2: CNum,
  z3: CNum,
): { kPlus: number; kMinus: number; linear: CNum; sq: CNum } {
  const sumK = k1 + k2 + k3;
  const inner = k1 * k2 + k2 * k3 + k3 * k1;
  const root = 2 * Math.sqrt(Math.max(0, inner));
  const kPlus = sumK + root;
  const kMinus = sumK - root;

  // z-form numerator: k1 z1 + k2 z2 + k3 z3
  const linear = cAdd(cAdd(cScale(z1, k1), cScale(z2, k2)), cScale(z3, k3));
  // discriminant inside sqrt for z: k1 k2 z1 z2 + k2 k3 z2 z3 + k3 k1 z3 z1
  const disc = cAdd(
    cAdd(cScale(cMul(z1, z2), k1 * k2), cScale(cMul(z2, z3), k2 * k3)),
    cScale(cMul(z3, z1), k3 * k1),
  );
  const sq = cScale(cSqrt(disc), 2);
  return { kPlus, kMinus, linear, sq };
}

// Place a seed quadruple in normalised (unit-disc) coordinates.
//
// Convention: seeds[0] is the outer circle (negative curvature). We centre
// the outer circle at (0, 0). For the other three we place the largest
// interior circle on the x-axis to the left so that its centre lies on a
// diameter of the outer circle, then place the next interior circle on the
// x-axis to the right (also tangent to the outer one and to circle 2), then
// solve for circle 4 via Descartes.
function placeSeed(seeds: [number, number, number, number]): Circle[] {
  const [k0, k1, k2, k3] = seeds;
  const r0 = 1 / Math.abs(k0);
  const r1 = 1 / k1;
  const r2 = 1 / k2;
  const r3 = 1 / k3;

  // Outer circle, signed curvature k0 < 0.
  const c0: Circle = { x: 0, y: 0, r: r0, k: k0 };

  // Place circle 1 internally tangent to outer, centre on negative x-axis.
  const c1: Circle = { x: -(r0 - r1), y: 0, r: r1, k: k1 };

  // Place circle 2 internally tangent to outer AND externally tangent to circle 1.
  // Centre on positive side, possibly off-axis. Distance from origin = r0 − r2,
  // distance from c1 = r1 + r2. Solve for (x, y).
  const d_o2 = r0 - r2;
  const d_12 = r1 + r2;
  // Place c1 at (a, 0) with a = -(r0 − r1). Then |c2 − c1|² = (x − a)² + y² = d_12².
  // And x² + y² = d_o2². Subtract: −2 a x + a² = d_12² − d_o2², so x = (a² − d_12² + d_o2²) / (2 a).
  const a = c1.x;
  const x2 = (a * a - d_12 * d_12 + d_o2 * d_o2) / (2 * a);
  const y2sq = Math.max(0, d_o2 * d_o2 - x2 * x2);
  const c2: Circle = { x: x2, y: Math.sqrt(y2sq), r: r2, k: k2 };

  // Place circle 3 via complex Descartes. We know k3, choose the placement
  // that puts it on the opposite side of the (c1, c2) chord from c0's
  // negative-curvature "side", which here just means: choose the y that
  // matches our target curvature k3 (one of the two roots, by curvature).
  const z0: CNum = { re: c0.x, im: c0.y };
  const z1: CNum = { re: c1.x, im: c1.y };
  const z2: CNum = { re: c2.x, im: c2.y };
  const cand = descartesFourthZ(c0.k, c1.k, c2.k, z0, z1, z2);
  // Match the target curvature k3 to one of the two Descartes roots.
  const kMatched =
    Math.abs(cand.kPlus - k3) <= Math.abs(cand.kMinus - k3) ? cand.kPlus : cand.kMinus;
  // The centre-equation sign is independent of the curvature root, so both
  // (linear ± 2√disc)/kMatched are algebraically valid centres. Only one is
  // actually tangent to all three parents; we keep the minimum-residual one.
  const candidates: CNum[] = [
    cScale(cAdd(cand.linear, cand.sq), 1 / kMatched),
    cScale(cSub(cand.linear, cand.sq), 1 / kMatched),
  ];
  const parents = [c0, c1, c2];
  const tangencyResidual = (z: CNum): number =>
    parents.reduce((sum, p) => {
      const d = Math.hypot(z.re - p.x, z.im - p.y);
      // Enclosing parent (k < 0): internal tangency, d = r_parent − r_child.
      // Interior parent (k > 0): external tangency, d = r_parent + r_child.
      const expected = p.k < 0 ? p.r - r3 : p.r + r3;
      return sum + Math.abs(d - expected);
    }, 0);
  const z3pick =
    tangencyResidual(candidates[0]!) <= tangencyResidual(candidates[1]!)
      ? candidates[0]!
      : candidates[1]!;
  const c3: Circle = { x: z3pick.re, y: z3pick.im, r: r3, k: k3 };

  return [c0, c1, c2, c3];
}

// ---------- Recursive gap filling ----------
//
// For four mutually tangent circles A, B, C, D one of the two Descartes
// solutions for the fourth curvature given A, B, C is D itself. The other
// solution E is the new circle inscribed in the curved-triangular gap between
// A, B, C on the side away from D. By the linearity of the Descartes form
// (subtract the two solutions):
//
//   kE = 2(kA + kB + kC) − kD
//   kE · zE = 2(kA zA + kB zB + kC zC) − kD · zD
//
// After inserting E, three new curved-triangular gaps appear, each bounded
// by (A, B, E), (B, C, E) and (A, C, E) — with the "old" circle being C, A,
// B respectively. We recurse on each.

function reflectThrough(a: Circle, b: Circle, c: Circle, d: Circle): Circle {
  const k = 2 * (a.k + b.k + c.k) - d.k;
  const numX = 2 * (a.k * a.x + b.k * b.x + c.k * c.x) - d.k * d.x;
  const numY = 2 * (a.k * a.y + b.k * b.y + c.k * c.y) - d.k * d.y;
  const r = 1 / Math.abs(k);
  return { x: numX / k, y: numY / k, r, k };
}

interface Gap {
  a: Circle;
  b: Circle;
  c: Circle;
  // the "opposite" circle whose reflection through (a,b,c) gives the new
  // inscribed circle for this gap
  opp: Circle;
  depth: number;
}

function growGasket(seed: Circle[], maxDepth: number): Circle[] {
  if (seed.length !== 4) return seed.slice();
  const [c0, c1, c2, c3] = seed;
  const out: Circle[] = [c0, c1, c2, c3];

  const stack: Gap[] = [
    { a: c1, b: c2, c: c3, opp: c0, depth: 0 },
    { a: c0, b: c2, c: c3, opp: c1, depth: 0 },
    { a: c0, b: c1, c: c3, opp: c2, depth: 0 },
    { a: c0, b: c1, c: c2, opp: c3, depth: 0 },
  ];

  let inserted = 0;
  const HARD_LIMIT = 60000;

  while (stack.length > 0 && inserted < HARD_LIMIT) {
    const g = stack.pop()!;
    if (g.depth > maxDepth) continue;
    const e = reflectThrough(g.a, g.b, g.c, g.opp);
    if (!Number.isFinite(e.x) || !Number.isFinite(e.y) || !Number.isFinite(e.r)) continue;
    if (e.r < 1e-5) continue;
    out.push(e);
    inserted++;
    if (g.depth >= maxDepth) continue;
    // After inserting e, three new gaps bounded by (a,b,e), (b,c,e), (a,c,e),
    // with the previously-removed-corner circle as the "opposite" reference.
    stack.push({ a: g.a, b: g.b, c: e, opp: g.c, depth: g.depth + 1 });
    stack.push({ a: g.b, b: g.c, c: e, opp: g.a, depth: g.depth + 1 });
    stack.push({ a: g.a, b: g.c, c: e, opp: g.b, depth: g.depth + 1 });
  }

  return out;
}

// ---------- Explorer UI strings (per locale) ----------
//
// The sidebar and canvas HUD carry a lot of copy that is specific to this
// explorer, so we keep it in a local per-locale record (the RICH_EXPLORER
// pattern) rather than fattening the shared UI bundle.

type ExplorerStrings = {
  presetPacking: string;
  seedNote: string;
  recursionDepth: string;
  depthHint: string;
  view: string;
  showLabels: string;
  showGaps: string;
  colourByCurvature: string;
  fillFrame: string;
  seedCircles: string;
  resetView: string;
  circles: (n: number) => string;
  hudDepth: string;
  canvasLabel: (preset: string, n: number) => string;
};

const RICH_EXPLORER: Record<Locale, ExplorerStrings> = {
  en: {
    presetPacking: "Preset packing",
    seedNote: "integer Apollonian seed",
    recursionDepth: "Recursion depth",
    depthHint: "Each step fills every curved-triangle gap with its inscribed circle.",
    view: "View",
    showLabels: "Show curvature labels",
    showGaps: "Highlight triangle gaps",
    colourByCurvature: "Colour by curvature",
    fillFrame: "Fill frame",
    seedCircles: "Seed circles",
    resetView: "Reset view",
    circles: (n) => `${n} circles`,
    hudDepth: "depth ≤",
    canvasLabel: (p, n) => `Apollonian gasket for packing ${p}, ${n} circles`,
  },
  de: {
    presetPacking: "Vordefinierte Packung",
    seedNote: "ganzzahliger Apollonischer Keim",
    recursionDepth: "Rekursionstiefe",
    depthHint: "Jeder Schritt füllt jede krummlinige Dreieckslücke mit ihrem einbeschriebenen Kreis.",
    view: "Ansicht",
    showLabels: "Krümmungswerte anzeigen",
    showGaps: "Dreieckslücken hervorheben",
    colourByCurvature: "Nach Krümmung färben",
    fillFrame: "Bild füllen",
    seedCircles: "Keimkreise",
    resetView: "Ansicht zurücksetzen",
    circles: (n) => `${n} Kreise`,
    hudDepth: "Tiefe ≤",
    canvasLabel: (p, n) => `Apollonische Dichtung für Packung ${p}, ${n} Kreise`,
  },
  es: {
    presetPacking: "Empaquetado predefinido",
    seedNote: "semilla apolínea entera",
    recursionDepth: "Profundidad de recursión",
    depthHint: "Cada paso rellena cada hueco triangular curvo con su círculo inscrito.",
    view: "Vista",
    showLabels: "Mostrar valores de curvatura",
    showGaps: "Resaltar huecos triangulares",
    colourByCurvature: "Colorear por curvatura",
    fillFrame: "Llenar el marco",
    seedCircles: "Círculos semilla",
    resetView: "Restablecer vista",
    circles: (n) => `${n} círculos`,
    hudDepth: "profundidad ≤",
    canvasLabel: (p, n) => `Junta apolínea para el empaquetado ${p}, ${n} círculos`,
  },
  fr: {
    presetPacking: "Empilement prédéfini",
    seedNote: "germe apollonien entier",
    recursionDepth: "Profondeur de récursion",
    depthHint: "Chaque étape remplit chaque interstice triangulaire courbe par son cercle inscrit.",
    view: "Affichage",
    showLabels: "Afficher les courbures",
    showGaps: "Mettre en évidence les interstices",
    colourByCurvature: "Colorer selon la courbure",
    fillFrame: "Remplir le cadre",
    seedCircles: "Cercles germes",
    resetView: "Réinitialiser la vue",
    circles: (n) => `${n} cercles`,
    hudDepth: "profondeur ≤",
    canvasLabel: (p, n) => `Joint d'Apollonius pour l'empilement ${p}, ${n} cercles`,
  },
  it: {
    presetPacking: "Impacchettamento predefinito",
    seedNote: "seme apollineo intero",
    recursionDepth: "Profondità di ricorsione",
    depthHint: "Ogni passo riempie ogni lacuna triangolare curva con il suo cerchio inscritto.",
    view: "Vista",
    showLabels: "Mostra le curvature",
    showGaps: "Evidenzia le lacune triangolari",
    colourByCurvature: "Colora per curvatura",
    fillFrame: "Riempi il riquadro",
    seedCircles: "Cerchi seme",
    resetView: "Reimposta la vista",
    circles: (n) => `${n} cerchi`,
    hudDepth: "profondità ≤",
    canvasLabel: (p, n) => `Guarnizione di Apollonio per l'impacchettamento ${p}, ${n} cerchi`,
  },
  pt: {
    presetPacking: "Empacotamento predefinido",
    seedNote: "semente apoloniana inteira",
    recursionDepth: "Profundidade de recursão",
    depthHint: "Cada passo preenche cada lacuna triangular curva com o seu círculo inscrito.",
    view: "Visualização",
    showLabels: "Mostrar as curvaturas",
    showGaps: "Realçar as lacunas triangulares",
    colourByCurvature: "Colorir por curvatura",
    fillFrame: "Preencher o quadro",
    seedCircles: "Círculos semente",
    resetView: "Repor a visualização",
    circles: (n) => `${n} círculos`,
    hudDepth: "profundidade ≤",
    canvasLabel: (p, n) => `Junta apoloniana para o empacotamento ${p}, ${n} círculos`,
  },
  sv: {
    presetPacking: "Fördefinierad packning",
    seedNote: "heltalsapollonskt frö",
    recursionDepth: "Rekursionsdjup",
    depthHint: "Varje steg fyller varje krökt triangelglapp med sin inskrivna cirkel.",
    view: "Vy",
    showLabels: "Visa krökningsvärden",
    showGaps: "Framhäv triangelglapp",
    colourByCurvature: "Färga efter krökning",
    fillFrame: "Fyll rutan",
    seedCircles: "Fröcirklar",
    resetView: "Återställ vyn",
    circles: (n) => `${n} cirklar`,
    hudDepth: "djup ≤",
    canvasLabel: (p, n) => `Apollonisk packning ${p}, ${n} cirklar`,
  },
  no: {
    presetPacking: "Forhåndsvalgt pakning",
    seedNote: "heltallsapollonisk frø",
    recursionDepth: "Rekursjonsdybde",
    depthHint: "Hvert steg fyller hvert krumt trekantglipp med sin innskrevne sirkel.",
    view: "Visning",
    showLabels: "Vis krumningsverdier",
    showGaps: "Uthev trekantglipp",
    colourByCurvature: "Farg etter krumning",
    fillFrame: "Fyll rammen",
    seedCircles: "Frøsirkler",
    resetView: "Tilbakestill visning",
    circles: (n) => `${n} sirkler`,
    hudDepth: "dybde ≤",
    canvasLabel: (p, n) => `Apollonisk pakning ${p}, ${n} sirkler`,
  },
};

// ---------- Component ----------

export default function ApollonianExplorer() {
  const { a, u, locale } = useI18n();
  const RE = RICH_EXPLORER[locale];
  const topic = a.topics.apollonian;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dpr = useDpr();

  const [presetIdx, setPresetIdx] = useState(0);
  const [depth, setDepth] = useState(4);
  const [showLabels, setShowLabels] = useState(false);
  const [showGaps, setShowGaps] = useState(false);
  const [colourByCurvature, setColourByCurvature] = useState(true);
  // When on, the packing is scaled up to fill the frame; when off, a wider
  // margin zooms it out. (It does not re-centre: the seed is already centred.)
  const [fillFrame, setFillFrame] = useState(true);

  const seed = useMemo(() => placeSeed(PRESETS[presetIdx]!.seeds), [presetIdx]);
  const circles = useMemo(() => growGasket(seed, depth), [seed, depth]);

  // Render
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

      // Determine viewport — we always centre on the outer disc at (0, 0).
      // The outer disc has radius 1/|k_outer| in unit coordinates, so we divide
      // the pixel scale by that radius to make the enclosing circle fill the
      // frame for every preset (otherwise the −6 packing would render at a
      // sixth of the canvas). The margin toggle just adds breathing room.
      const margin = fillFrame ? 0.92 : 0.6;
      const outerR = circles[0]?.r ?? 1;
      const scale = ((Math.min(W, H) / 2) * margin) / outerR;
      const cx = W / 2;
      const cy = H / 2;
      const toPx = (x: number, y: number): [number, number] => [cx + x * scale, cy - y * scale];

      // Optional: shade gaps under the circles. We approximate gaps by
      // filling the outer disc with a light wash and then "punching out" each
      // interior circle with the background colour. This isn't strict gap
      // colouring (which would need actual curved-triangle geometry) but it
      // gives the user a clear sense of which regions are still empty.
      if (showGaps) {
        const outer = circles[0];
        if (outer) {
          const [ox, oy] = toPx(outer.x, outer.y);
          ctx.fillStyle = withAlpha(palette.signal.rose, 0.1);
          ctx.beginPath();
          ctx.arc(ox, oy, outer.r * scale, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = palette.canvas.bg;
        for (let i = 1; i < circles.length; i++) {
          const c = circles[i]!;
          const [px, py] = toPx(c.x, c.y);
          ctx.beginPath();
          ctx.arc(px, py, c.r * scale, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Draw circle outlines.
      // Compute curvature range for colouring (interior circles only).
      let maxLog = 0;
      for (const c of circles) {
        if (c.k > 0) {
          const v = Math.log10(c.k);
          if (v > maxLog) maxLog = v;
        }
      }
      maxLog = Math.max(maxLog, 1);

      for (const c of circles) {
        const [px, py] = toPx(c.x, c.y);
        const radiusPx = c.r * scale;
        if (radiusPx < 0.4) continue;

        let stroke = withAlpha(palette.ink[100], 0.85);
        if (c.k < 0) {
          // Outer enclosing circle — distinctive rose.
          stroke = withAlpha(palette.signal.rose, 0.95);
        } else if (colourByCurvature) {
          const t = Math.min(1, Math.log10(Math.max(1, c.k)) / maxLog);
          // hue sweeps from rose (350) through amber (40) through cyan (185)
          // through violet (270) as curvature grows.
          const hue = (350 + t * 280) % 360;
          stroke = `hsl(${hue}, 75%, 65%)`;
        }
        ctx.strokeStyle = stroke;
        ctx.lineWidth = c.k < 0 ? 1.6 : Math.max(0.6, 1.4 - Math.log10(Math.max(1, c.k)) * 0.25);
        ctx.beginPath();
        ctx.arc(px, py, radiusPx, 0, Math.PI * 2);
        ctx.stroke();

        if (showLabels && radiusPx > 14) {
          ctx.fillStyle = withAlpha(palette.ink[100], 0.9);
          ctx.font = `${Math.min(13, Math.max(9, radiusPx * 0.35))}px ui-monospace, monospace`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          const label = Number.isInteger(c.k) ? `${c.k}` : c.k.toFixed(c.k < 10 ? 2 : 1);
          ctx.fillText(label, px, py);
        }
      }

      // HUD
      ctx.fillStyle = withAlpha(palette.ink[100], 0.65);
      ctx.font = "11px ui-monospace, monospace";
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillText(RE.circles(circles.length), 12, 10);
      ctx.fillText(`${RE.hudDepth} ${depth}`, 12, 26);
    };

    render();
    const ro = new ResizeObserver(render);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [circles, depth, showLabels, showGaps, colourByCurvature, fillFrame, dpr, RE]);

  return (
    <main className="flex min-h-screen flex-col pt-14">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_420px]">
        <div className="relative flex min-h-[60vh] flex-col gap-4 bg-ink-950 p-4 lg:min-h-[calc(100vh-3.5rem)] lg:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              Packing · {PRESETS[presetIdx]!.label}
            </div>
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
              (k₁+k₂+k₃+k₄)² = 2(k₁²+k₂²+k₃²+k₄²)
            </div>
          </div>
          <div className="hairline flex-1 overflow-hidden rounded-2xl border bg-ink-950">
            <canvas
              ref={canvasRef}
              className="block h-full w-full"
              role="img"
              aria-label={RE.canvasLabel(PRESETS[presetIdx]!.label, circles.length)}
            />
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

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {RE.presetPacking}
            </div>
            <div className="grid grid-cols-1 gap-2">
              {PRESETS.map((p, i) => (
                <button
                  key={p.label}
                  onClick={() => setPresetIdx(i)}
                  className={`rounded-md border px-3 py-2 text-left transition-colors ${
                    presetIdx === i
                      ? "border-signal-amber/60 bg-signal-amber/10 text-signal-amber"
                      : "hairline text-ink-200 hover:border-signal-amber/40 hover:text-ink-100"
                  }`}
                >
                  <div className="font-mono text-xs">{p.label}</div>
                  <div className="mt-0.5 font-mono text-[10px] text-ink-400">
                    {RE.seedNote}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {RE.recursionDepth}
            </div>
            <div className="flex items-center justify-between font-mono text-sm">
              <span className="text-signal-amber">{depth}</span>
              <span className="text-[10px] text-ink-400">{RE.circles(circles.length)}</span>
            </div>
            <input
              type="range"
              value={depth}
              min={0}
              max={8}
              step={1}
              onChange={(e) => setDepth(parseInt(e.target.value))}
              aria-label={RE.recursionDepth}
              className="w-full accent-signal-amber"
            />
            <p className="font-mono text-[10px] leading-relaxed text-ink-400">
              {RE.depthHint}
            </p>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {RE.view}
            </div>

            <label className="flex cursor-pointer items-center gap-3 text-sm text-ink-200">
              <input
                type="checkbox"
                checked={showLabels}
                onChange={(e) => setShowLabels(e.target.checked)}
                className="accent-signal-amber"
              />
              <span>{RE.showLabels}</span>
            </label>

            <label className="flex cursor-pointer items-center gap-3 text-sm text-ink-200">
              <input
                type="checkbox"
                checked={showGaps}
                onChange={(e) => setShowGaps(e.target.checked)}
                className="accent-signal-amber"
              />
              <span>{RE.showGaps}</span>
            </label>

            <label className="flex cursor-pointer items-center gap-3 text-sm text-ink-200">
              <input
                type="checkbox"
                checked={colourByCurvature}
                onChange={(e) => setColourByCurvature(e.target.checked)}
                className="accent-signal-amber"
              />
              <span>{RE.colourByCurvature}</span>
            </label>

            <label className="flex cursor-pointer items-center gap-3 text-sm text-ink-200">
              <input
                type="checkbox"
                checked={fillFrame}
                onChange={(e) => setFillFrame(e.target.checked)}
                className="accent-signal-amber"
              />
              <span>{RE.fillFrame}</span>
            </label>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {RE.seedCircles}
            </div>
            <table className="w-full font-mono text-xs">
              <thead className="hairline border-b text-ink-300">
                <tr>
                  <th className="px-1 py-1 text-left text-[10px] uppercase tracking-widest">k</th>
                  <th className="px-1 py-1 text-left text-[10px] uppercase tracking-widest">r</th>
                  <th className="px-1 py-1 text-left text-[10px] uppercase tracking-widest">
                    (x, y)
                  </th>
                </tr>
              </thead>
              <tbody>
                {seed.map((c, i) => (
                  <tr key={i} className="border-b border-ink-700/30 last:border-0">
                    <td className="px-1 py-1 text-signal-amber">
                      {Number.isInteger(c.k) ? c.k : c.k.toFixed(2)}
                    </td>
                    <td className="px-1 py-1 text-ink-200">{c.r.toFixed(3)}</td>
                    <td className="px-1 py-1 text-ink-300">
                      ({c.x.toFixed(2)}, {c.y.toFixed(2)})
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={() => {
                setDepth(4);
                setShowLabels(false);
                setShowGaps(false);
                setColourByCurvature(true);
                setFillFrame(true);
              }}
              className="hairline w-full rounded-md border py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-300 transition-colors hover:border-signal-amber/40 hover:text-signal-amber"
            >
              {RE.resetView}
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
