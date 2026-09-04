"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import type { Locale } from "@/lib/i18n/types";
import { getDpr } from "@/lib/hooks/useDpr";
import { palette } from "@/lib/visual/palette";

// --------------------------------------------------------------------------
// Per-locale UI strings for the Möbius / Klein explorer. Kept inline so the
// translations live next to the controls they label and don't fatten the
// shared i18n bundles.
// --------------------------------------------------------------------------

type CutPresetCopy = { label: string; result: string };

type RichExplorer = {
  badgeMobius: string;
  badgeKlein: string;
  hudMobius: (n: number) => string;
  hudKlein: string;
  hudCut: (val: string, revealed: boolean) => string;
  hudCutRevealedSuffix: string;
  dragHint: (autoSpin: boolean, mode: string) => string;
  on: string;
  off: string;
  surface: string;
  mobiusStrip: string;
  kleinBottle: string;
  surfaceNoteMobius: string;
  surfaceNoteKlein: string;
  autoSpin: string;
  speed: string;
  speedUnit: string;
  width: string;
  halfTwists: string;
  halfTwistsHint: string;
  cutRatio: string;
  revealCuts: string;
  resealing: string;
  story: string;
  cutPresets: ReadonlyArray<CutPresetCopy>;
  hudModeMobius: (n: number) => string;
  hudModeKlein: string;
};

const RICH_EXPLORER: Record<Locale, RichExplorer> = {
  en: {
    badgeMobius: "Möbius strip · parametric",
    badgeKlein: "Klein bottle · 3-D immersion",
    hudMobius: (n) => `Möbius strip · ${n} half-twist${n === 1 ? "" : "s"}`,
    hudKlein: "Klein bottle · 3-D immersion (self-intersects)",
    hudCut: (val, revealed) => `Cut at v = ±${val}${revealed ? "  ·  pulled apart" : ""}`,
    hudCutRevealedSuffix: "pulled apart",
    dragHint: (autoSpin, mode) => `drag to rotate · auto-spin ${autoSpin ? "on" : "off"} · ${mode}`,
    on: "on",
    off: "off",
    surface: "Surface",
    mobiusStrip: "Möbius strip",
    kleinBottle: "Klein bottle",
    surfaceNoteMobius: "Möbius & Listing, 1858. χ = 0, one side, one edge.",
    surfaceNoteKlein:
      "Felix Klein, 1882. In 4-D this is smooth and closed; in 3-D it must pass through itself. Auto-spin reveals the self-intersection.",
    autoSpin: "Auto-spin",
    speed: "Speed",
    speedUnit: "rad/s",
    width: "Width w",
    halfTwists: "Number of half-twists",
    halfTwistsHint:
      "1 = classical Möbius (one-sided). 2 = ordinary two-sided cylinder. 3, 5 are non-orientable like 1; 4 is orientable like 2.",
    cutRatio: "Cut ratio (from centre)",
    revealCuts: "Reveal cuts",
    resealing: "Resealing…",
    story: "← Story",
    cutPresets: [
      { label: "middle  ·  1/2", result: "one longer two-sided strip with two full twists" },
      { label: "third  ·  1/3", result: "a Möbius + a longer linked Möbius, interlocked" },
      { label: "quarter  ·  1/4", result: "same family — narrower interlocked pair" },
      { label: "no cut", result: "the intact Möbius strip" },
    ],
    hudModeMobius: (n) => `${n} half-twist${n === 1 ? "" : "s"}`,
    hudModeKlein: "Klein mode",
  },
  de: {
    badgeMobius: "Möbius-Band · parametrisch",
    badgeKlein: "Klein-Flasche · 3D-Immersion",
    hudMobius: (n) => `Möbius-Band · ${n} Halbdrehung${n === 1 ? "" : "en"}`,
    hudKlein: "Klein-Flasche · 3D-Immersion (selbstschneidend)",
    hudCut: (val, revealed) =>
      `Schnitt bei v = ±${val}${revealed ? "  ·  auseinandergezogen" : ""}`,
    hudCutRevealedSuffix: "auseinandergezogen",
    dragHint: (autoSpin, mode) =>
      `ziehen zum Drehen · Auto-Rotation ${autoSpin ? "an" : "aus"} · ${mode}`,
    on: "an",
    off: "aus",
    surface: "Fläche",
    mobiusStrip: "Möbius-Band",
    kleinBottle: "Klein-Flasche",
    surfaceNoteMobius: "Möbius & Listing, 1858. χ = 0, eine Seite, eine Kante.",
    surfaceNoteKlein:
      "Felix Klein, 1882. Im 4D ist sie glatt und geschlossen; im 3D muss sie sich selbst durchdringen. Auto-Rotation zeigt die Selbstdurchdringung.",
    autoSpin: "Auto-Rotation",
    speed: "Geschwindigkeit",
    speedUnit: "rad/s",
    width: "Breite w",
    halfTwists: "Anzahl Halbdrehungen",
    halfTwistsHint:
      "1 = klassisches Möbius-Band (einseitig). 2 = gewöhnlicher zweiseitiger Zylinder. 3, 5 sind nicht-orientierbar wie 1; 4 ist orientierbar wie 2.",
    cutRatio: "Schnittverhältnis (vom Zentrum)",
    revealCuts: "Schnitte zeigen",
    resealing: "Wird verschlossen…",
    story: "← Geschichte",
    cutPresets: [
      {
        label: "Mitte  ·  1/2",
        result: "ein längerer, zweiseitiger Streifen mit zwei vollen Drehungen",
      },
      {
        label: "Drittel  ·  1/3",
        result: "ein Möbius + ein längeres verschlungenes Möbius, ineinandergehakt",
      },
      { label: "Viertel  ·  1/4", result: "gleiche Familie — schmaleres verschlungenes Paar" },
      { label: "kein Schnitt", result: "das unversehrte Möbius-Band" },
    ],
    hudModeMobius: (n) => `${n} Halbdrehung${n === 1 ? "" : "en"}`,
    hudModeKlein: "Klein-Modus",
  },
  es: {
    badgeMobius: "Banda de Möbius · paramétrica",
    badgeKlein: "Botella de Klein · inmersión 3D",
    hudMobius: (n) => `Banda de Möbius · ${n} media vuelta${n === 1 ? "" : "s"}`,
    hudKlein: "Botella de Klein · inmersión 3D (se autointerseca)",
    hudCut: (val, revealed) => `Corte en v = ±${val}${revealed ? "  ·  separados" : ""}`,
    hudCutRevealedSuffix: "separados",
    dragHint: (autoSpin, mode) =>
      `arrastra para rotar · auto-rotación ${autoSpin ? "activa" : "inactiva"} · ${mode}`,
    on: "act.",
    off: "inact.",
    surface: "Superficie",
    mobiusStrip: "Banda de Möbius",
    kleinBottle: "Botella de Klein",
    surfaceNoteMobius: "Möbius y Listing, 1858. χ = 0, una cara, un borde.",
    surfaceNoteKlein:
      "Felix Klein, 1882. En 4D es suave y cerrada; en 3D debe atravesarse a sí misma. La auto-rotación revela la autointersección.",
    autoSpin: "Auto-rotación",
    speed: "Velocidad",
    speedUnit: "rad/s",
    width: "Anchura w",
    halfTwists: "Número de medias vueltas",
    halfTwistsHint:
      "1 = Möbius clásica (una cara). 2 = cilindro ordinario de dos caras. 3, 5 son no orientables como 1; 4 es orientable como 2.",
    cutRatio: "Razón de corte (desde el centro)",
    revealCuts: "Mostrar cortes",
    resealing: "Volviendo a sellar…",
    story: "← Historia",
    cutPresets: [
      {
        label: "centro  ·  1/2",
        result: "una banda más larga de dos caras con dos vueltas completas",
      },
      { label: "tercio  ·  1/3", result: "una Möbius + una Möbius más larga enlazadas" },
      { label: "cuarto  ·  1/4", result: "misma familia — par enlazado más estrecho" },
      { label: "sin corte", result: "la banda de Möbius intacta" },
    ],
    hudModeMobius: (n) => `${n} media vuelta${n === 1 ? "" : "s"}`,
    hudModeKlein: "Modo Klein",
  },
  fr: {
    badgeMobius: "Ruban de Möbius · paramétrique",
    badgeKlein: "Bouteille de Klein · immersion 3D",
    hudMobius: (n) => `Ruban de Möbius · ${n} demi-tour${n === 1 ? "" : "s"}`,
    hudKlein: "Bouteille de Klein · immersion 3D (auto-intersection)",
    hudCut: (val, revealed) => `Coupe à v = ±${val}${revealed ? "  ·  écartés" : ""}`,
    hudCutRevealedSuffix: "écartés",
    dragHint: (autoSpin, mode) =>
      `glisser pour tourner · rotation auto ${autoSpin ? "on" : "off"} · ${mode}`,
    on: "on",
    off: "off",
    surface: "Surface",
    mobiusStrip: "Ruban de Möbius",
    kleinBottle: "Bouteille de Klein",
    surfaceNoteMobius: "Möbius et Listing, 1858. χ = 0, une face, un bord.",
    surfaceNoteKlein:
      "Felix Klein, 1882. En 4D, elle est lisse et fermée ; en 3D, elle doit se traverser. La rotation auto révèle l'auto-intersection.",
    autoSpin: "Rotation auto",
    speed: "Vitesse",
    speedUnit: "rad/s",
    width: "Largeur w",
    halfTwists: "Nombre de demi-tours",
    halfTwistsHint:
      "1 = Möbius classique (une face). 2 = cylindre ordinaire à deux faces. 3, 5 sont non orientables comme 1 ; 4 est orientable comme 2.",
    cutRatio: "Ratio de coupe (depuis le centre)",
    revealCuts: "Afficher les coupes",
    resealing: "Refermeture…",
    story: "← Histoire",
    cutPresets: [
      {
        label: "milieu  ·  1/2",
        result: "une bande plus longue à deux faces avec deux tours complets",
      },
      { label: "tiers  ·  1/3", result: "un Möbius + un Möbius plus long, entrelacés" },
      { label: "quart  ·  1/4", result: "même famille — paire entrelacée plus étroite" },
      { label: "pas de coupe", result: "le ruban de Möbius intact" },
    ],
    hudModeMobius: (n) => `${n} demi-tour${n === 1 ? "" : "s"}`,
    hudModeKlein: "Mode Klein",
  },
  it: {
    badgeMobius: "Nastro di Möbius · parametrico",
    badgeKlein: "Bottiglia di Klein · immersione 3D",
    hudMobius: (n) => `Nastro di Möbius · ${n} mezzo giro${n === 1 ? "" : " (mezzi giri)"}`,
    hudKlein: "Bottiglia di Klein · immersione 3D (si autointerseca)",
    hudCut: (val, revealed) => `Taglio in v = ±${val}${revealed ? "  ·  separati" : ""}`,
    hudCutRevealedSuffix: "separati",
    dragHint: (autoSpin, mode) =>
      `trascina per ruotare · rotazione auto ${autoSpin ? "on" : "off"} · ${mode}`,
    on: "on",
    off: "off",
    surface: "Superficie",
    mobiusStrip: "Nastro di Möbius",
    kleinBottle: "Bottiglia di Klein",
    surfaceNoteMobius: "Möbius e Listing, 1858. χ = 0, una faccia, un bordo.",
    surfaceNoteKlein:
      "Felix Klein, 1882. In 4D è liscia e chiusa; in 3D deve attraversare sé stessa. La rotazione auto rivela l'autointersezione.",
    autoSpin: "Rotazione auto",
    speed: "Velocità",
    speedUnit: "rad/s",
    width: "Larghezza w",
    halfTwists: "Numero di mezzi giri",
    halfTwistsHint:
      "1 = Möbius classico (una faccia). 2 = cilindro ordinario a due facce. 3, 5 sono non orientabili come 1; 4 è orientabile come 2.",
    cutRatio: "Rapporto di taglio (dal centro)",
    revealCuts: "Mostra tagli",
    resealing: "Risigillatura…",
    story: "← Storia",
    cutPresets: [
      { label: "centro  ·  1/2", result: "un nastro più lungo a due facce con due giri completi" },
      { label: "terzo  ·  1/3", result: "un Möbius + un Möbius più lungo, intrecciati" },
      { label: "quarto  ·  1/4", result: "stessa famiglia — coppia intrecciata più stretta" },
      { label: "nessun taglio", result: "il nastro di Möbius intatto" },
    ],
    hudModeMobius: (n) => `${n} mezzo giro${n === 1 ? "" : " (mezzi giri)"}`,
    hudModeKlein: "Modalità Klein",
  },
  pt: {
    badgeMobius: "Faixa de Möbius · paramétrica",
    badgeKlein: "Garrafa de Klein · imersão 3D",
    hudMobius: (n) => `Faixa de Möbius · ${n} meia-volta${n === 1 ? "" : "s"}`,
    hudKlein: "Garrafa de Klein · imersão 3D (autointerseta-se)",
    hudCut: (val, revealed) => `Corte em v = ±${val}${revealed ? "  ·  afastados" : ""}`,
    hudCutRevealedSuffix: "afastados",
    dragHint: (autoSpin, mode) =>
      `arraste para girar · rotação auto ${autoSpin ? "on" : "off"} · ${mode}`,
    on: "on",
    off: "off",
    surface: "Superfície",
    mobiusStrip: "Faixa de Möbius",
    kleinBottle: "Garrafa de Klein",
    surfaceNoteMobius: "Möbius e Listing, 1858. χ = 0, um lado, uma aresta.",
    surfaceNoteKlein:
      "Felix Klein, 1882. Em 4D é lisa e fechada; em 3D precisa atravessar-se a si mesma. A rotação auto revela a autointerseção.",
    autoSpin: "Rotação auto",
    speed: "Velocidade",
    speedUnit: "rad/s",
    width: "Largura w",
    halfTwists: "Número de meias-voltas",
    halfTwistsHint:
      "1 = Möbius clássica (um lado). 2 = cilindro comum de dois lados. 3, 5 são não orientáveis como 1; 4 é orientável como 2.",
    cutRatio: "Razão de corte (do centro)",
    revealCuts: "Mostrar cortes",
    resealing: "A re-selar…",
    story: "← História",
    cutPresets: [
      {
        label: "meio  ·  1/2",
        result: "uma faixa mais longa de dois lados com duas voltas completas",
      },
      { label: "terço  ·  1/3", result: "uma Möbius + uma Möbius mais longa, entrelaçadas" },
      { label: "quarto  ·  1/4", result: "mesma família — par entrelaçado mais estreito" },
      { label: "sem corte", result: "a faixa de Möbius intacta" },
    ],
    hudModeMobius: (n) => `${n} meia-volta${n === 1 ? "" : "s"}`,
    hudModeKlein: "Modo Klein",
  },
  sv: {
    badgeMobius: "Möbius-band · parametriskt",
    badgeKlein: "Kleinflaska · 3D-immersion",
    hudMobius: (n) => `Möbius-band · ${n} halvvarv`,
    hudKlein: "Kleinflaska · 3D-immersion (självskärande)",
    hudCut: (val, revealed) => `Snitt vid v = ±${val}${revealed ? "  ·  isärdraget" : ""}`,
    hudCutRevealedSuffix: "isärdraget",
    dragHint: (autoSpin, mode) =>
      `dra för att rotera · auto-rotation ${autoSpin ? "på" : "av"} · ${mode}`,
    on: "på",
    off: "av",
    surface: "Yta",
    mobiusStrip: "Möbius-band",
    kleinBottle: "Kleinflaska",
    surfaceNoteMobius: "Möbius & Listing, 1858. χ = 0, en sida, en kant.",
    surfaceNoteKlein:
      "Felix Klein, 1882. I 4D är den slät och sluten; i 3D måste den passera genom sig själv. Auto-rotationen visar självskärningen.",
    autoSpin: "Auto-rotation",
    speed: "Hastighet",
    speedUnit: "rad/s",
    width: "Bredd w",
    halfTwists: "Antal halvvarv",
    halfTwistsHint:
      "1 = klassisk Möbius (ensidig). 2 = vanlig tvåsidig cylinder. 3, 5 är icke-orienterbara som 1; 4 är orienterbar som 2.",
    cutRatio: "Skärförhållande (från centrum)",
    revealCuts: "Visa snitt",
    resealing: "Försluter…",
    story: "← Berättelse",
    cutPresets: [
      { label: "mitten  ·  1/2", result: "ett längre tvåsidigt band med två hela varv" },
      { label: "tredjedel  ·  1/3", result: "ett Möbius + ett längre länkat Möbius, hopflätade" },
      { label: "fjärdedel  ·  1/4", result: "samma familj — smalare hopflätat par" },
      { label: "inget snitt", result: "det intakta Möbius-bandet" },
    ],
    hudModeMobius: (n) => `${n} halvvarv`,
    hudModeKlein: "Kleinläge",
  },
  no: {
    badgeMobius: "Möbius-bånd · parametrisk",
    badgeKlein: "Kleinflaske · 3D-immersjon",
    hudMobius: (n) => `Möbius-bånd · ${n} halvomdreining${n === 1 ? "" : "er"}`,
    hudKlein: "Kleinflaske · 3D-immersjon (selvskjærende)",
    hudCut: (val, revealed) =>
      `Kutt ved v = ±${val}${revealed ? "  ·  trukket fra hverandre" : ""}`,
    hudCutRevealedSuffix: "trukket fra hverandre",
    dragHint: (autoSpin, mode) =>
      `dra for å rotere · auto-rotasjon ${autoSpin ? "på" : "av"} · ${mode}`,
    on: "på",
    off: "av",
    surface: "Flate",
    mobiusStrip: "Möbius-bånd",
    kleinBottle: "Kleinflaske",
    surfaceNoteMobius: "Möbius & Listing, 1858. χ = 0, én side, én kant.",
    surfaceNoteKlein:
      "Felix Klein, 1882. I 4D er den glatt og lukket; i 3D må den gå gjennom seg selv. Auto-rotasjonen viser selvskjæringen.",
    autoSpin: "Auto-rotasjon",
    speed: "Hastighet",
    speedUnit: "rad/s",
    width: "Bredde w",
    halfTwists: "Antall halvomdreininger",
    halfTwistsHint:
      "1 = klassisk Möbius (énsidig). 2 = vanlig tosidig sylinder. 3, 5 er ikke-orienterbare som 1; 4 er orienterbar som 2.",
    cutRatio: "Kuttforhold (fra senter)",
    revealCuts: "Vis kutt",
    resealing: "Forsegler…",
    story: "← Historie",
    cutPresets: [
      { label: "midten  ·  1/2", result: "ett lengre tosidig bånd med to hele omdreininger" },
      { label: "tredjedel  ·  1/3", result: "én Möbius + én lengre lenket Möbius, sammenflettet" },
      { label: "fjerdedel  ·  1/4", result: "samme familie — smalere sammenflettet par" },
      { label: "ingen kutt", result: "det intakte Möbius-båndet" },
    ],
    hudModeMobius: (n) => `${n} halvomdreining${n === 1 ? "" : "er"}`,
    hudModeKlein: "Kleinmodus",
  },
};

// --------------------------------------------------------------------------
// Möbius / Klein explorer.
//
// A minimal software renderer (no three.js): parametric surface → triangles
// → rotation matrix → perspective projection → painter's algorithm with
// back-face-aware Lambertian shading. Two surfaces are available:
//
//   - Möbius strip with adjustable number of half-twists, adjustable width
//     and an interactive "cut" along v = ±cut·w that splits the strip into
//     two coloured halves and animates them pulling apart.
//   - Klein bottle (Lawson-style immersion in 3-D).
//
// Accent colour throughout: signal-amber.
// --------------------------------------------------------------------------

type Vec3 = readonly [number, number, number];

interface ProjectedTri {
  // Screen-space coordinates of the three vertices (post-projection).
  ax: number;
  ay: number;
  bx: number;
  by: number;
  cx: number;
  cy: number;
  // Average camera-space z for painter's sort.
  z: number;
  // Lambertian shade in [0, 1].
  shade: number;
  // Which side of the strip this triangle belongs to (used to colour the
  // gradient that demonstrates one-sidedness — red→blue along the length).
  hue: number; // 0 = red end, 1 = blue end
  // Whether the camera looks at the "front" of the surface normal or the
  // back. We keep both — that's the whole point of a one-sided surface.
  facingFront: boolean;
  // Cut group: 0 = uncut, 1 = inner band, 2 = outer band. Used to colour
  // the cut and to offset the two halves when "Reveal cuts" is on.
  cutGroup: 0 | 1 | 2;
}

const TAU = Math.PI * 2;

// 3×3 rotation around X then Y then Z.
function rotate(p: Vec3, rx: number, ry: number, rz: number): Vec3 {
  const [x0, y0, z0] = p;
  // X
  const cx = Math.cos(rx);
  const sx = Math.sin(rx);
  const y1 = y0 * cx - z0 * sx;
  const z1 = y0 * sx + z0 * cx;
  // Y
  const cy = Math.cos(ry);
  const sy = Math.sin(ry);
  const x2 = x0 * cy + z1 * sy;
  const z2 = -x0 * sy + z1 * cy;
  // Z
  const cz = Math.cos(rz);
  const sz = Math.sin(rz);
  const x3 = x2 * cz - y1 * sz;
  const y3 = x2 * sz + y1 * cz;
  return [x3, y3, z2];
}

function sub(a: Vec3, b: Vec3): Vec3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}
function cross(a: Vec3, b: Vec3): Vec3 {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}
function dot(a: Vec3, b: Vec3): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
function norm(a: Vec3): Vec3 {
  const m = Math.hypot(a[0], a[1], a[2]) || 1;
  return [a[0] / m, a[1] / m, a[2] / m];
}

// Parametric Möbius strip with k half-twists. k = 1 is the classical Möbius;
// k = 2 is a regular cylinder; k = 3 is more twisted. R is the major radius,
// w is the half-width, v ∈ [-w, w], u ∈ [0, 2π).
function mobiusPoint(u: number, v: number, k: number, R: number): Vec3 {
  const twist = (k * u) / 2;
  const x = (R + v * Math.cos(twist)) * Math.cos(u);
  const y = (R + v * Math.cos(twist)) * Math.sin(u);
  const z = v * Math.sin(twist);
  return [x, y, z];
}

// Klein bottle — Lawson / "figure-8" style 3-D immersion. Uses the standard
// parametrisation that Wikipedia lists as the "3-D pinched torus" form:
//   x = (a + cos(u/2) sin v − sin(u/2) sin 2v) cos u
//   y = (a + cos(u/2) sin v − sin(u/2) sin 2v) sin u
//   z = sin(u/2) sin v + cos(u/2) sin 2v
function kleinPoint(u: number, v: number, a: number): Vec3 {
  const r = a + Math.cos(u / 2) * Math.sin(v) - Math.sin(u / 2) * Math.sin(2 * v);
  const x = r * Math.cos(u);
  const y = r * Math.sin(u);
  const z = Math.sin(u / 2) * Math.sin(v) + Math.cos(u / 2) * Math.sin(2 * v);
  return [x, y, z];
}

// HSL → CSS string with explicit alpha.
function shadeColour(hue: number, light: number, alpha: number): string {
  // hue 0 → red (350), hue 1 → blue (220). Sweep through violet for cohesion.
  const h = 350 - hue * 130;
  const s = 70;
  const l = Math.round(20 + light * 60);
  return `hsla(${h.toFixed(0)}, ${s}%, ${l}%, ${alpha})`;
}

export default function MobiusExplorer() {
  const { a, u, locale } = useI18n();
  const topic = a.topics.mobius;
  const t = RICH_EXPLORER[locale];

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [autoSpin, setAutoSpin] = useState(true);
  const [spinSpeed, setSpinSpeed] = useState(0.45);
  const [width, setWidth] = useState(0.32);
  const [halfTwists, setHalfTwists] = useState(1);
  const [cutRatio, setCutRatio] = useState(0.0);
  const [reveal, setReveal] = useState(false);
  const [kleinMode, setKleinMode] = useState(false);

  // Rotation state lives in refs so the render loop sees the latest values
  // without forcing a React re-render every frame.
  const rotRef = useRef<{ x: number; y: number; z: number }>({ x: 0.6, y: 0.0, z: 0.0 });
  const lastT = useRef<number>(0);

  // Pointer drag → manual rotation.
  const dragRef = useRef<{ active: boolean; x: number; y: number }>({ active: false, x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let raf = 0;
    let stopped = false;

    const render = (now: number) => {
      if (stopped) return;
      const dpr = getDpr();
      const cssW = canvas.clientWidth;
      const cssH = canvas.clientHeight;
      const W = Math.floor(cssW * dpr);
      const H = Math.floor(cssH * dpr);
      if (canvas.width !== W || canvas.height !== H) {
        canvas.width = W;
        canvas.height = H;
      }
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = palette.canvas.bg;
      ctx.fillRect(0, 0, W, H);

      // Time delta → auto-spin.
      const dt = lastT.current === 0 ? 0 : (now - lastT.current) / 1000;
      lastT.current = now;
      if (autoSpin) {
        rotRef.current = {
          x: rotRef.current.x,
          y: rotRef.current.y + spinSpeed * dt,
          z: rotRef.current.z,
        };
      }

      const { x: rx, y: ry, z: rz } = rotRef.current;

      // Tessellation density.
      const Nu = kleinMode ? 120 : 160;
      const Nv = kleinMode ? 36 : 16;

      // Surface parameters.
      const R = 1.0;
      const w = width;
      const k = halfTwists;
      const aKlein = 2.0;

      // Light direction in camera space, normalised.
      const light: Vec3 = norm([0.4, -0.6, 0.7]);

      // Camera / projection.
      const camZ = kleinMode ? 6.5 : 4.5;
      const focal = Math.min(W, H) * 0.9;
      const cx = W / 2;
      const cyScr = H / 2;

      // Collect every triangle, project, sort by depth, draw.
      const tris: ProjectedTri[] = [];

      // Cut threshold — for k=1 the strip lives in v ∈ [-w, w] and we cut at
      // v = ±cutRatio·w (symmetric so the cut traverses around twice and only
      // closes after two laps). For Klein mode we don't cut.
      const cutAbs = cutRatio * w;
      // The "reveal" mode separates the two cut groups by sliding them apart
      // perpendicular to the cut. We use a small offset along the local
      // ribbon-frame y-axis (≈ world z direction after rotation) so the user
      // can read the resulting linked rings.
      const revealShift = reveal && cutRatio > 0.001 ? 0.35 : 0;

      for (let i = 0; i < Nu; i++) {
        for (let j = 0; j < Nv; j++) {
          const u0 = (i / Nu) * TAU;
          const u1 = ((i + 1) / Nu) * TAU;

          // Domain in v depends on mode.
          const vMin = kleinMode ? 0 : -w;
          const vMax = kleinMode ? TAU : w;
          const v0 = vMin + (j / Nv) * (vMax - vMin);
          const v1 = vMin + ((j + 1) / Nv) * (vMax - vMin);

          // Cut grouping for the Möbius strip.
          let group: 0 | 1 | 2 = 0;
          if (!kleinMode && cutAbs > 0.0005) {
            const vc = (v0 + v1) / 2;
            group = Math.abs(vc) < cutAbs ? 1 : 2;
          }

          // Sample the four corners.
          const pA: Vec3 = kleinMode ? kleinPoint(u0, v0, aKlein) : mobiusPoint(u0, v0, k, R);
          const pB: Vec3 = kleinMode ? kleinPoint(u1, v0, aKlein) : mobiusPoint(u1, v0, k, R);
          const pC: Vec3 = kleinMode ? kleinPoint(u1, v1, aKlein) : mobiusPoint(u1, v1, k, R);
          const pD: Vec3 = kleinMode ? kleinPoint(u0, v1, aKlein) : mobiusPoint(u0, v1, k, R);

          // Reveal-cut shift: slide groups apart along world z.
          const shift = revealShift * (group === 1 ? 1 : group === 2 ? -1 : 0);
          const shifted = (p: Vec3): Vec3 => [p[0], p[1], p[2] + shift];

          const qA = shifted(pA);
          const qB = shifted(pB);
          const qC = shifted(pC);
          const qD = shifted(pD);

          // Two triangles per quad.
          const tA = [qA, qB, qC] as const;
          const tB = [qA, qC, qD] as const;

          for (const tri of [tA, tB]) {
            const [p0, p1, p2] = tri;

            // Rotate into camera space.
            const r0 = rotate(p0, rx, ry, rz);
            const r1 = rotate(p1, rx, ry, rz);
            const r2 = rotate(p2, rx, ry, rz);

            // Camera-space face normal.
            const n = norm(cross(sub(r1, r0), sub(r2, r0)));
            // Light dot normal — signed; we render both sides, so use |·|.
            const ldot = dot(n, light);
            const shade = 0.18 + 0.82 * Math.max(0, Math.abs(ldot));

            // Project.
            const z0c = r0[2] + camZ;
            const z1c = r1[2] + camZ;
            const z2c = r2[2] + camZ;
            if (z0c <= 0.05 || z1c <= 0.05 || z2c <= 0.05) continue;
            const ax = cx + (r0[0] * focal) / z0c;
            const ay = cyScr - (r0[1] * focal) / z0c;
            const bx = cx + (r1[0] * focal) / z1c;
            const by = cyScr - (r1[1] * focal) / z1c;
            const cxs = cx + (r2[0] * focal) / z2c;
            const cys = cyScr - (r2[1] * focal) / z2c;

            const zAvg = (z0c + z1c + z2c) / 3;

            // Hue along the length: 0 → 1 going around u. For the Möbius
            // strip this is the point — walk the surface once and the colour
            // hits the opposite end without ever leaving the surface.
            const hue = (i + 0.5) / Nu;

            tris.push({
              ax,
              ay,
              bx,
              by,
              cx: cxs,
              cy: cys,
              z: zAvg,
              shade,
              hue,
              facingFront: ldot >= 0,
              cutGroup: group,
            });
          }
        }
      }

      // Painter's algorithm — far first.
      tris.sort((p, q) => q.z - p.z);

      // Set canvas-space transform once.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      for (const tri of tris) {
        // Cut colouring: group 1 (the inside band) gets a contrasting amber
        // tint so the user can see exactly what the scissors took out.
        const alpha = 0.92;
        let fill: string;
        if (tri.cutGroup === 1) {
          // Amber band.
          const h = 40;
          const l = Math.round(28 + tri.shade * 50);
          fill = `hsla(${h}, 85%, ${l}%, ${alpha})`;
        } else {
          // The default red→blue gradient along the strip.
          fill = shadeColour(tri.hue, tri.shade, alpha);
        }

        ctx.fillStyle = fill;
        ctx.strokeStyle = tri.facingFront ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.18)";
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(tri.ax / dpr, tri.ay / dpr);
        ctx.lineTo(tri.bx / dpr, tri.by / dpr);
        ctx.lineTo(tri.cx / dpr, tri.cy / dpr);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }

      // HUD overlay — title-like badge so the visitor knows what they look
      // at (Möbius vs Klein).
      ctx.fillStyle = "rgba(167,139,250,0.85)";
      ctx.font = `${12}px ui-monospace, monospace`;
      ctx.fillText(kleinMode ? t.hudKlein : t.hudMobius(halfTwists), 14, 22);
      if (!kleinMode && cutRatio > 0.001) {
        ctx.fillStyle = "rgba(255,209,102,0.85)";
        ctx.fillText(t.hudCut((cutRatio * width).toFixed(3), reveal), 14, 40);
      }

      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);

    const onDown = (e: PointerEvent) => {
      dragRef.current = { active: true, x: e.clientX, y: e.clientY };
      canvas.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      const d = dragRef.current;
      if (!d.active) return;
      const dxp = e.clientX - d.x;
      const dyp = e.clientY - d.y;
      dragRef.current = { active: true, x: e.clientX, y: e.clientY };
      rotRef.current = {
        x: rotRef.current.x + dyp * 0.005,
        y: rotRef.current.y + dxp * 0.005,
        z: rotRef.current.z,
      };
    };
    const onUp = (e: PointerEvent) => {
      dragRef.current = { active: false, x: 0, y: 0 };
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch {
        // capture may have been released already
      }
    };
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);

    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
    };
  }, [autoSpin, spinSpeed, width, halfTwists, cutRatio, reveal, kleinMode, t]);

  // Preset cuts. 0.5 → middle (the famous "still one piece" cut); 1/3 →
  // interlocked pair; 1/4 → similar interlocked pair, just thinner. Labels &
  // result strings come from the per-locale `t.cutPresets` table, paired by
  // index with these ratios.
  const CUT_RATIOS: ReadonlyArray<number> = [0.5, 0.333, 0.25, 0.0];
  const CUT_PRESETS = CUT_RATIOS.map((ratio, i) => ({
    ratio,
    label: t.cutPresets[i].label,
    result: t.cutPresets[i].result,
  }));

  return (
    <main className="flex min-h-screen flex-col pt-14">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_420px]">
        <div className="relative flex min-h-[60vh] flex-col gap-4 bg-ink-950 p-4 lg:min-h-[calc(100vh-3.5rem)] lg:p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              {kleinMode ? t.badgeKlein : t.badgeMobius}
            </div>
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
              {kleinMode
                ? "(a + cos u/2 sin v − sin u/2 sin 2v) · (cos u, sin u)"
                : "(R + v cos(ku/2)) (cos u, sin u),  v sin(ku/2)"}
            </div>
          </div>
          <div className="hairline flex-1 touch-none overflow-hidden rounded-2xl border bg-ink-950">
            <canvas
              ref={canvasRef}
              className="block h-full w-full cursor-grab active:cursor-grabbing"
            />
          </div>
          <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
            {t.dragHint(autoSpin, kleinMode ? t.hudModeKlein : t.hudModeMobius(halfTwists))}
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

          {/* Surface toggle */}
          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {t.surface}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setKleinMode(false)}
                className={`rounded-md border px-3 py-2 font-mono text-xs transition-colors ${
                  !kleinMode
                    ? "border-signal-amber/70 bg-signal-amber/10 text-signal-amber"
                    : "hairline text-ink-200 hover:border-signal-amber/40 hover:text-ink-100"
                }`}
              >
                {t.mobiusStrip}
              </button>
              <button
                onClick={() => setKleinMode(true)}
                className={`rounded-md border px-3 py-2 font-mono text-xs transition-colors ${
                  kleinMode
                    ? "border-signal-amber/70 bg-signal-amber/10 text-signal-amber"
                    : "hairline text-ink-200 hover:border-signal-amber/40 hover:text-ink-100"
                }`}
              >
                {t.kleinBottle}
              </button>
            </div>
            <p className="text-xs leading-relaxed text-ink-400">
              {kleinMode ? t.surfaceNoteKlein : t.surfaceNoteMobius}
            </p>
          </div>

          {/* Auto-spin */}
          <div className="hairline space-y-3 border-b p-5">
            <div className="flex items-center justify-between">
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                {t.autoSpin}
              </div>
              <button
                onClick={() => setAutoSpin((s) => !s)}
                className={`rounded-md border px-2 py-1 font-mono text-[10px] uppercase tracking-widest2 transition-colors ${
                  autoSpin
                    ? "border-signal-amber/70 bg-signal-amber/10 text-signal-amber"
                    : "hairline text-ink-300 hover:border-signal-amber/40 hover:text-ink-100"
                }`}
              >
                {autoSpin ? t.on : t.off}
              </button>
            </div>
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {t.speed}
            </div>
            <input
              type="range"
              value={spinSpeed}
              min={0}
              max={1.5}
              step={0.01}
              onChange={(e) => setSpinSpeed(parseFloat(e.target.value))}
              className="w-full accent-signal-amber"
            />
            <div className="text-right font-mono text-[10px] text-ink-400">
              {spinSpeed.toFixed(2)} {t.speedUnit}
            </div>
          </div>

          {/* Width */}
          <div
            className={`hairline space-y-3 border-b p-5 ${kleinMode ? "pointer-events-none opacity-40" : ""}`}
          >
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {t.width}
            </div>
            <input
              type="range"
              value={width}
              min={0.05}
              max={0.5}
              step={0.005}
              onChange={(e) => setWidth(parseFloat(e.target.value))}
              className="w-full accent-signal-amber"
            />
            <div className="text-right font-mono text-[10px] text-ink-400">{width.toFixed(3)}</div>
          </div>

          {/* Half-twists */}
          <div
            className={`hairline space-y-3 border-b p-5 ${kleinMode ? "pointer-events-none opacity-40" : ""}`}
          >
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {t.halfTwists}
            </div>
            <input
              type="range"
              value={halfTwists}
              min={1}
              max={5}
              step={1}
              onChange={(e) => setHalfTwists(parseInt(e.target.value, 10))}
              className="w-full accent-signal-amber"
            />
            <div className="grid grid-cols-5 gap-1 font-mono text-[10px] text-ink-400">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => setHalfTwists(n)}
                  className={`rounded border py-1 transition-colors ${
                    halfTwists === n
                      ? "border-signal-amber/70 bg-signal-amber/10 text-signal-amber"
                      : "hairline hover:border-signal-amber/40 hover:text-ink-100"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <p className="text-xs leading-relaxed text-ink-400">{t.halfTwistsHint}</p>
          </div>

          {/* Cut ratio */}
          <div
            className={`hairline space-y-3 border-b p-5 ${kleinMode ? "pointer-events-none opacity-40" : ""}`}
          >
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {t.cutRatio}
            </div>
            <input
              type="range"
              value={cutRatio}
              min={0}
              max={0.5}
              step={0.005}
              onChange={(e) => setCutRatio(parseFloat(e.target.value))}
              className="w-full accent-signal-amber"
            />
            <div className="text-right font-mono text-[10px] text-ink-400">
              v = ±{cutRatio.toFixed(3)} · w
            </div>
            <div className="grid grid-cols-2 gap-2">
              {CUT_PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => setCutRatio(p.ratio)}
                  className={`rounded-md border px-3 py-2 text-left transition-colors ${
                    Math.abs(cutRatio - p.ratio) < 0.01
                      ? "border-signal-amber/60 bg-signal-amber/10 text-signal-amber"
                      : "hairline text-ink-200 hover:border-signal-amber/40 hover:text-ink-100"
                  }`}
                >
                  <div className="font-mono text-xs">{p.label}</div>
                  <div className="mt-0.5 font-mono text-[10px] leading-snug text-ink-400">
                    {p.result}
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setReveal((r) => !r)}
              disabled={cutRatio < 0.01}
              className={`w-full rounded-md border px-3 py-2 font-mono text-xs uppercase tracking-widest2 transition-colors ${
                reveal && cutRatio >= 0.01
                  ? "border-signal-amber/70 bg-signal-amber/10 text-signal-amber"
                  : "hairline text-ink-200 hover:border-signal-amber/40 hover:text-ink-100 disabled:opacity-40 disabled:hover:border-ink-700/40 disabled:hover:text-ink-200"
              }`}
            >
              {reveal ? t.resealing : t.revealCuts}
            </button>
          </div>

          {/* Back link */}
          <div className="p-5">
            <Link
              href="/mobius"
              className="hairline mb-2 block w-full rounded-md border py-2 text-center font-mono text-[10px] uppercase tracking-widest2 text-ink-300 transition-colors hover:border-signal-amber/40 hover:text-signal-amber"
            >
              {t.story}
            </Link>
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
