"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import type { Locale } from "@/lib/i18n/types";
import { palette } from "@/lib/visual/palette";

const FAMOUS_SEEDS = [27, 97, 871, 6171];

const MAX_SEED = 1_000_000;
const MAX_STEPS = 2000;

// --------------------------------------------------------------------------
// Per-locale UI strings for the Collatz explorer. Kept inline (the repo's
// RICH_EXPLORER pattern) so a German or French reader gets a localized room
// instead of the previous hardcoded English literals.
// --------------------------------------------------------------------------

type RichExplorer = {
  hudTrajectory: (n: number) => string;
  hudTree: (depth: number, nodes: number | null) => string;
  treeHidden: string;
  statStartingN: string;
  statStepsTo1: string;
  statPeakValue: string;
  statPeakAtStep: string;
  seedLabel: string;
  sliderCaption: (max: string) => string;
  statsHeading: string;
  steps: string;
  peakValue: string;
  peakStep: string;
  pathLength: string;
  showTree: string;
  treeDepth: string;
  treeExplain: string;
  axisStep: (steps: number) => string;
  peakMarker: (peak: number, step: number) => string;
  famousSeeds: readonly [string, string, string, string];
};

const RICH_EXPLORER: Record<Locale, RichExplorer> = {
  en: {
    hudTrajectory: (n) => `Hailstone trajectory · n = ${n}`,
    hudTree: (depth, nodes) =>
      `Inverse coral · backwards tree rooted at 1 · depth ${depth}${nodes ? ` · ${nodes} nodes` : ""}`,
    treeHidden: "Inverse tree hidden",
    statStartingN: "Starting n",
    statStepsTo1: "Steps to 1",
    statPeakValue: "Peak value",
    statPeakAtStep: "Peak at step",
    seedLabel: "Seed n",
    sliderCaption: (max) => `slider: 1 … 10 000 · input: 1 … ${max}`,
    statsHeading: "Stats",
    steps: "Steps",
    peakValue: "Peak value",
    peakStep: "Peak step",
    pathLength: "Path length",
    showTree: "Show inverse tree",
    treeDepth: "Tree depth",
    treeExplain:
      "Backwards from 1: each v has parent 2v (always) and (v−1)/3 if v ≡ 4 mod 6 and the result is odd > 1. Capped at 280 nodes; the current seed's orbit glows cyan when it hits the tree.",
    axisStep: (s) => `step index (0 … ${s})`,
    peakMarker: (p, s) => `peak ${p} @ step ${s}`,
    famousSeeds: ["111 steps · peak 9232", "118 steps", "178 steps", "261 steps"],
  },
  de: {
    hudTrajectory: (n) => `Hagelbahn · n = ${n}`,
    hudTree: (depth, nodes) =>
      `Inverse Koralle · Rückwärtsbaum verwurzelt bei 1 · Tiefe ${depth}${nodes ? ` · ${nodes} Knoten` : ""}`,
    treeHidden: "Inverser Baum verborgen",
    statStartingN: "Startzahl n",
    statStepsTo1: "Schritte bis 1",
    statPeakValue: "Gipfelwert",
    statPeakAtStep: "Gipfel bei Schritt",
    seedLabel: "Keim n",
    sliderCaption: (max) => `Regler: 1 … 10 000 · Eingabe: 1 … ${max}`,
    statsHeading: "Statistik",
    steps: "Schritte",
    peakValue: "Gipfelwert",
    peakStep: "Gipfelschritt",
    pathLength: "Pfadlänge",
    showTree: "Inversen Baum zeigen",
    treeDepth: "Baumtiefe",
    treeExplain:
      "Rückwärts von 1: jedes v hat Elter 2v (immer) und (v−1)/3, falls v ≡ 4 mod 6 und das Ergebnis ungerade > 1 ist. Bei 280 Knoten gekappt; die Bahn des aktuellen Keims leuchtet cyan, sobald sie den Baum trifft.",
    axisStep: (s) => `Schrittindex (0 … ${s})`,
    peakMarker: (p, s) => `Gipfel ${p} @ Schritt ${s}`,
    famousSeeds: ["111 Schritte · Gipfel 9232", "118 Schritte", "178 Schritte", "261 Schritte"],
  },
  es: {
    hudTrajectory: (n) => `Trayectoria de granizo · n = ${n}`,
    hudTree: (depth, nodes) =>
      `Coral inverso · árbol hacia atrás con raíz en 1 · profundidad ${depth}${nodes ? ` · ${nodes} nodos` : ""}`,
    treeHidden: "Árbol inverso oculto",
    statStartingN: "n inicial",
    statStepsTo1: "Pasos hasta 1",
    statPeakValue: "Valor pico",
    statPeakAtStep: "Pico en el paso",
    seedLabel: "Semilla n",
    sliderCaption: (max) => `control: 1 … 10 000 · entrada: 1 … ${max}`,
    statsHeading: "Estadísticas",
    steps: "Pasos",
    peakValue: "Valor pico",
    peakStep: "Paso del pico",
    pathLength: "Longitud del camino",
    showTree: "Mostrar árbol inverso",
    treeDepth: "Profundidad del árbol",
    treeExplain:
      "Hacia atrás desde 1: cada v tiene padre 2v (siempre) y (v−1)/3 si v ≡ 4 mod 6 y el resultado es impar > 1. Limitado a 280 nodos; la órbita de la semilla actual brilla en cian cuando toca el árbol.",
    axisStep: (s) => `índice de paso (0 … ${s})`,
    peakMarker: (p, s) => `pico ${p} @ paso ${s}`,
    famousSeeds: ["111 pasos · pico 9232", "118 pasos", "178 pasos", "261 pasos"],
  },
  fr: {
    hudTrajectory: (n) => `Trajectoire de grêle · n = ${n}`,
    hudTree: (depth, nodes) =>
      `Corail inverse · arbre à rebours enraciné en 1 · profondeur ${depth}${nodes ? ` · ${nodes} nœuds` : ""}`,
    treeHidden: "Arbre inverse masqué",
    statStartingN: "n de départ",
    statStepsTo1: "Étapes jusqu'à 1",
    statPeakValue: "Valeur du sommet",
    statPeakAtStep: "Sommet à l'étape",
    seedLabel: "Graine n",
    sliderCaption: (max) => `curseur : 1 … 10 000 · saisie : 1 … ${max}`,
    statsHeading: "Statistiques",
    steps: "Étapes",
    peakValue: "Valeur du sommet",
    peakStep: "Étape du sommet",
    pathLength: "Longueur du chemin",
    showTree: "Afficher l'arbre inverse",
    treeDepth: "Profondeur de l'arbre",
    treeExplain:
      "À rebours depuis 1 : chaque v a pour parent 2v (toujours) et (v−1)/3 si v ≡ 4 mod 6 et que le résultat est impair > 1. Plafonné à 280 nœuds ; l'orbite de la graine courante brille en cyan quand elle touche l'arbre.",
    axisStep: (s) => `indice d'étape (0 … ${s})`,
    peakMarker: (p, s) => `sommet ${p} @ étape ${s}`,
    famousSeeds: ["111 étapes · sommet 9232", "118 étapes", "178 étapes", "261 étapes"],
  },
  it: {
    hudTrajectory: (n) => `Traiettoria di grandine · n = ${n}`,
    hudTree: (depth, nodes) =>
      `Corallo inverso · albero all'indietro radicato in 1 · profondità ${depth}${nodes ? ` · ${nodes} nodi` : ""}`,
    treeHidden: "Albero inverso nascosto",
    statStartingN: "n iniziale",
    statStepsTo1: "Passi fino a 1",
    statPeakValue: "Valore di picco",
    statPeakAtStep: "Picco al passo",
    seedLabel: "Seme n",
    sliderCaption: (max) => `cursore: 1 … 10 000 · input: 1 … ${max}`,
    statsHeading: "Statistiche",
    steps: "Passi",
    peakValue: "Valore di picco",
    peakStep: "Passo del picco",
    pathLength: "Lunghezza del percorso",
    showTree: "Mostra l'albero inverso",
    treeDepth: "Profondità dell'albero",
    treeExplain:
      "All'indietro da 1: ogni v ha genitore 2v (sempre) e (v−1)/3 se v ≡ 4 mod 6 e il risultato è dispari > 1. Limitato a 280 nodi; l'orbita del seme corrente brilla in ciano quando tocca l'albero.",
    axisStep: (s) => `indice di passo (0 … ${s})`,
    peakMarker: (p, s) => `picco ${p} @ passo ${s}`,
    famousSeeds: ["111 passi · picco 9232", "118 passi", "178 passi", "261 passi"],
  },
  pt: {
    hudTrajectory: (n) => `Trajetória de granizo · n = ${n}`,
    hudTree: (depth, nodes) =>
      `Coral inverso · árvore para trás com raiz em 1 · profundidade ${depth}${nodes ? ` · ${nodes} nós` : ""}`,
    treeHidden: "Árvore inversa oculta",
    statStartingN: "n inicial",
    statStepsTo1: "Passos até 1",
    statPeakValue: "Valor de pico",
    statPeakAtStep: "Pico no passo",
    seedLabel: "Semente n",
    sliderCaption: (max) => `controle: 1 … 10 000 · entrada: 1 … ${max}`,
    statsHeading: "Estatísticas",
    steps: "Passos",
    peakValue: "Valor de pico",
    peakStep: "Passo do pico",
    pathLength: "Comprimento do caminho",
    showTree: "Mostrar árvore inversa",
    treeDepth: "Profundidade da árvore",
    treeExplain:
      "Para trás desde 1: cada v tem pai 2v (sempre) e (v−1)/3 se v ≡ 4 mod 6 e o resultado for ímpar > 1. Limitado a 280 nós; a órbita da semente atual brilha em ciano quando toca a árvore.",
    axisStep: (s) => `índice de passo (0 … ${s})`,
    peakMarker: (p, s) => `pico ${p} @ passo ${s}`,
    famousSeeds: ["111 passos · pico 9232", "118 passos", "178 passos", "261 passos"],
  },
  sv: {
    hudTrajectory: (n) => `Hagelbana · n = ${n}`,
    hudTree: (depth, nodes) =>
      `Omvänd korall · bakåtträd rotat vid 1 · djup ${depth}${nodes ? ` · ${nodes} noder` : ""}`,
    treeHidden: "Omvänt träd dolt",
    statStartingN: "Starttal n",
    statStepsTo1: "Steg till 1",
    statPeakValue: "Toppvärde",
    statPeakAtStep: "Topp vid steg",
    seedLabel: "Frö n",
    sliderCaption: (max) => `reglage: 1 … 10 000 · inmatning: 1 … ${max}`,
    statsHeading: "Statistik",
    steps: "Steg",
    peakValue: "Toppvärde",
    peakStep: "Toppsteg",
    pathLength: "Banlängd",
    showTree: "Visa omvänt träd",
    treeDepth: "Träddjup",
    treeExplain:
      "Bakåt från 1: varje v har förälder 2v (alltid) och (v−1)/3 om v ≡ 4 mod 6 och resultatet är udda > 1. Begränsat till 280 noder; det aktuella fröets bana lyser cyan när den träffar trädet.",
    axisStep: (s) => `stegindex (0 … ${s})`,
    peakMarker: (p, s) => `topp ${p} @ steg ${s}`,
    famousSeeds: ["111 steg · topp 9232", "118 steg", "178 steg", "261 steg"],
  },
  no: {
    hudTrajectory: (n) => `Hagelbane · n = ${n}`,
    hudTree: (depth, nodes) =>
      `Omvendt korall · bakovertre rotfestet i 1 · dybde ${depth}${nodes ? ` · ${nodes} noder` : ""}`,
    treeHidden: "Omvendt tre skjult",
    statStartingN: "Starttall n",
    statStepsTo1: "Trinn til 1",
    statPeakValue: "Toppverdi",
    statPeakAtStep: "Topp ved trinn",
    seedLabel: "Frø n",
    sliderCaption: (max) => `glidebryter: 1 … 10 000 · inndata: 1 … ${max}`,
    statsHeading: "Statistikk",
    steps: "Trinn",
    peakValue: "Toppverdi",
    peakStep: "Topptrinn",
    pathLength: "Banelengde",
    showTree: "Vis omvendt tre",
    treeDepth: "Tredybde",
    treeExplain:
      "Baklengs fra 1: hver v har forelder 2v (alltid) og (v−1)/3 hvis v ≡ 4 mod 6 og resultatet er oddetall > 1. Begrenset til 280 noder; banen til det gjeldende frøet lyser cyan når den treffer treet.",
    axisStep: (s) => `trinnindeks (0 … ${s})`,
    peakMarker: (p, s) => `topp ${p} @ trinn ${s}`,
    famousSeeds: ["111 trinn · topp 9232", "118 trinn", "178 trinn", "261 trinn"],
  },
};

interface TrajectoryStats {
  values: number[];
  steps: number;
  peak: number;
  peakStep: number;
}

function computeTrajectory(seed: number): TrajectoryStats {
  const values: number[] = [];
  let n = Math.max(1, Math.floor(seed));
  values.push(n);
  let peak = n;
  let peakStep = 0;
  let i = 0;
  while (n !== 1 && i < MAX_STEPS) {
    n = n % 2 === 0 ? n / 2 : 3 * n + 1;
    values.push(n);
    i++;
    if (n > peak) {
      peak = n;
      peakStep = i;
    }
  }
  return { values, steps: i, peak, peakStep };
}

interface TreeNode {
  v: number;
  depth: number;
  parent: number | null;
  children: number[]; // indices in node list
  angle: number;
}

interface TreeLayout {
  nodes: TreeNode[];
  maxDepth: number;
}

// BFS the inverse Collatz tree from 1, up to maxDepth, capped at ~maxNodes.
function buildInverseTree(maxDepth: number, maxNodes: number): TreeLayout {
  const nodes: TreeNode[] = [];
  const seen = new Set<number>();
  nodes.push({ v: 1, depth: 0, parent: null, children: [], angle: 0 });
  seen.add(1);
  let head = 0;
  while (head < nodes.length && nodes.length < maxNodes) {
    const cur = nodes[head];
    head++;
    if (cur.depth >= maxDepth) continue;
    // Always: 2 * v
    const dbl = cur.v * 2;
    if (dbl < Number.MAX_SAFE_INTEGER && !seen.has(dbl)) {
      seen.add(dbl);
      const idx = nodes.length;
      nodes.push({ v: dbl, depth: cur.depth + 1, parent: head - 1, children: [], angle: 0 });
      cur.children.push(idx);
      if (nodes.length >= maxNodes) break;
    }
    // Inverse 3n+1: parent (v-1)/3 if v ≡ 1 (mod 6), > 1, and the result is odd.
    if (cur.v > 4 && cur.v % 6 === 4) {
      const odd = (cur.v - 1) / 3;
      if (odd > 1 && odd % 2 === 1 && !seen.has(odd)) {
        seen.add(odd);
        const idx = nodes.length;
        nodes.push({ v: odd, depth: cur.depth + 1, parent: head - 1, children: [], angle: 0 });
        cur.children.push(idx);
      }
    }
  }
  let maxD = 0;
  for (const n of nodes) if (n.depth > maxD) maxD = n.depth;
  return { nodes, maxDepth: maxD };
}

interface Positioned {
  x: number;
  y: number;
  v: number;
  depth: number;
  parent: number | null;
}

// Radial layout: assign each child an angular sector inside the parent's sector,
// proportional to its subtree leaf count. Root sits at the centre.
function layoutRadial(tree: TreeLayout, radiusStep: number): Positioned[] {
  const { nodes } = tree;
  const leafCount = new Array<number>(nodes.length).fill(0);
  // Post-order: process by descending depth.
  const order = nodes.map((_, i) => i).sort((a, b) => nodes[b].depth - nodes[a].depth);
  for (const i of order) {
    const n = nodes[i];
    if (n.children.length === 0) leafCount[i] = 1;
    else {
      let s = 0;
      for (const c of n.children) s += leafCount[c];
      leafCount[i] = s;
    }
  }

  const angleStart = new Array<number>(nodes.length).fill(0);
  const angleEnd = new Array<number>(nodes.length).fill(0);
  angleStart[0] = 0;
  angleEnd[0] = Math.PI * 2;
  // Pre-order: process by ascending depth.
  const pre = nodes.map((_, i) => i).sort((a, b) => nodes[a].depth - nodes[b].depth);
  for (const i of pre) {
    const n = nodes[i];
    if (n.children.length === 0) continue;
    const total = leafCount[i];
    const span = angleEnd[i] - angleStart[i];
    let acc = angleStart[i];
    for (const c of n.children) {
      const share = (leafCount[c] / total) * span;
      angleStart[c] = acc;
      angleEnd[c] = acc + share;
      acc += share;
    }
  }

  return nodes.map((n, i) => {
    const ang = (angleStart[i] + angleEnd[i]) / 2;
    const r = n.depth * radiusStep;
    return {
      x: Math.cos(ang) * r,
      y: Math.sin(ang) * r,
      v: n.v,
      depth: n.depth,
      parent: n.parent,
    };
  });
}

function withAlpha(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function CollatzExplorer() {
  const { a, u, locale } = useI18n();
  const topic = a.topics.collatz;
  const t = RICH_EXPLORER[locale];

  const [seedInput, setSeedInput] = useState("27");
  const [seed, setSeed] = useState(27);
  const [showTree, setShowTree] = useState(true);
  const [treeDepth, setTreeDepth] = useState(8);

  const traj = useMemo(() => computeTrajectory(seed), [seed]);

  const tree = useMemo(
    () => (showTree ? buildInverseTree(treeDepth, 280) : null),
    [showTree, treeDepth],
  );
  const positioned = useMemo(() => (tree ? layoutRadial(tree, 60) : null), [tree]);

  // SVG sizing for trajectory.
  const TW = 900;
  const TH = 340;
  const padL = 56;
  const padR = 20;
  const padT = 24;
  const padB = 36;
  const innerW = TW - padL - padR;
  const innerH = TH - padT - padB;
  const stepsForX = Math.max(1, traj.steps);
  const yMaxLog = Math.log10(Math.max(10, traj.peak)) + 0.1;
  const xPx = (i: number) => padL + (i / stepsForX) * innerW;
  const yPx = (v: number) => padT + innerH - (Math.log10(Math.max(1, v)) / yMaxLog) * innerH;

  let trajPath = "";
  for (let i = 0; i < traj.values.length; i++) {
    trajPath += `${i === 0 ? "M" : "L"}${xPx(i).toFixed(2)},${yPx(traj.values[i]).toFixed(2)} `;
  }
  const yTicks: number[] = [];
  for (let p = 0; p <= Math.ceil(yMaxLog); p++) yTicks.push(p);

  // SVG sizing for tree.
  const treeBox = 720;
  const treeView = `${-treeBox / 2} ${-treeBox / 2} ${treeBox} ${treeBox}`;

  const applySeedInput = () => {
    const parsed = parseInt(seedInput, 10);
    if (Number.isFinite(parsed) && parsed >= 1 && parsed <= MAX_SEED) {
      setSeed(parsed);
    } else {
      setSeedInput(String(seed));
    }
  };

  return (
    <main className="flex min-h-screen flex-col pt-14">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_420px]">
        <div className="relative flex min-h-[60vh] flex-col gap-4 overflow-y-auto bg-ink-950 p-4 lg:min-h-[calc(100vh-3.5rem)] lg:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              {t.hudTrajectory(seed)}
            </div>
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
              n → n/2 or 3n + 1
            </div>
          </div>

          <div className="hairline overflow-hidden rounded-2xl border bg-ink-950">
            <svg
              viewBox={`0 0 ${TW} ${TH}`}
              className="block h-auto w-full"
              preserveAspectRatio="xMidYMid meet"
              role="img"
              aria-label={t.hudTrajectory(seed)}
            >
              <rect x={0} y={0} width={TW} height={TH} fill={palette.canvas.bg} />
              {yTicks.map((p) => (
                <g key={p}>
                  <line
                    x1={padL}
                    x2={TW - padR}
                    y1={yPx(Math.pow(10, p))}
                    y2={yPx(Math.pow(10, p))}
                    stroke={withAlpha(palette.canvas.muted, 0.15)}
                    strokeWidth={1}
                  />
                  <text
                    x={padL - 6}
                    y={yPx(Math.pow(10, p)) + 3}
                    textAnchor="end"
                    fill={palette.canvas.muted}
                    fontSize={10}
                    fontFamily="ui-monospace, monospace"
                  >
                    10^{p}
                  </text>
                </g>
              ))}
              <path
                d={trajPath}
                fill="none"
                stroke={withAlpha(palette.signal.amber, 0.85)}
                strokeWidth={1.4}
              />
              {traj.values.map((v, i) => (
                <circle key={i} cx={xPx(i)} cy={yPx(v)} r={1.6} fill={palette.signal.amber} />
              ))}
              {/* Peak marker */}
              <circle
                cx={xPx(traj.peakStep)}
                cy={yPx(traj.peak)}
                r={4.5}
                fill="none"
                stroke={palette.signal.cyan}
                strokeWidth={1.4}
              />
              <text
                x={xPx(traj.peakStep) + 8}
                y={yPx(traj.peak) - 6}
                fill={palette.signal.cyan}
                fontSize={11}
                fontFamily="ui-monospace, monospace"
              >
                {t.peakMarker(traj.peak, traj.peakStep)}
              </text>
              <text
                x={TW - padR}
                y={TH - 10}
                textAnchor="end"
                fill={palette.canvas.muted}
                fontSize={10}
                fontFamily="ui-monospace, monospace"
              >
                {t.axisStep(traj.steps)}
              </text>
              <text
                x={padL}
                y={padT - 8}
                fill={palette.canvas.muted}
                fontSize={10}
                fontFamily="ui-monospace, monospace"
              >
                log₁₀(value)
              </text>
            </svg>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <Stat label={t.statStartingN} value={String(seed)} />
            <Stat label={t.statStepsTo1} value={String(traj.steps)} />
            <Stat label={t.statPeakValue} value={traj.peak.toLocaleString()} />
            <Stat label={t.statPeakAtStep} value={String(traj.peakStep)} />
          </div>

          <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
            {t.hudTree(treeDepth, positioned ? positioned.length : null)}
          </div>
          <div className="hairline aspect-square max-h-[720px] overflow-hidden rounded-2xl border bg-ink-950">
            {positioned ? (
              <svg
                viewBox={treeView}
                className="block h-full w-full"
                preserveAspectRatio="xMidYMid meet"
                role="img"
                aria-label={t.hudTree(treeDepth, positioned.length)}
              >
                <rect
                  x={-treeBox / 2}
                  y={-treeBox / 2}
                  width={treeBox}
                  height={treeBox}
                  fill={palette.canvas.bg}
                />
                {positioned.map((p, i) =>
                  p.parent !== null ? (
                    <line
                      key={`l-${i}`}
                      x1={positioned[p.parent].x}
                      y1={positioned[p.parent].y}
                      x2={p.x}
                      y2={p.y}
                      stroke={withAlpha(palette.signal.amber, 0.35)}
                      strokeWidth={0.8}
                    />
                  ) : null,
                )}
                {positioned.map((p, i) => {
                  const onTraj = traj.values.includes(p.v);
                  const fill = onTraj ? palette.signal.cyan : palette.signal.amber;
                  const r = p.depth === 0 ? 6 : onTraj ? 3.5 : 2.4;
                  return (
                    <g key={`n-${i}`}>
                      <circle cx={p.x} cy={p.y} r={r} fill={fill} />
                      {p.depth <= 3 && (
                        <text
                          x={p.x + 6}
                          y={p.y - 6}
                          fill={palette.ink[100]}
                          fontSize={10}
                          fontFamily="ui-monospace, monospace"
                        >
                          {p.v}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            ) : (
              <div className="flex h-full w-full items-center justify-center font-mono text-xs text-ink-400">
                {t.treeHidden}
              </div>
            )}
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

          <div className="hairline space-y-4 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {t.seedLabel}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={MAX_SEED}
                value={seedInput}
                aria-label={t.seedLabel}
                onChange={(e) => setSeedInput(e.target.value)}
                onBlur={applySeedInput}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    applySeedInput();
                    (e.target as HTMLInputElement).blur();
                  }
                }}
                className="hairline flex-1 rounded-md border bg-ink-950/80 px-3 py-2 font-mono text-sm text-signal-amber focus:border-signal-amber/60 focus:outline-none"
              />
            </div>
            <input
              type="range"
              value={Math.min(seed, 10000)}
              min={1}
              max={10000}
              step={1}
              aria-label={t.seedLabel}
              onChange={(e) => {
                const v = parseInt(e.target.value, 10);
                setSeed(v);
                setSeedInput(String(v));
              }}
              className="w-full accent-signal-amber"
            />
            <div className="text-right font-mono text-[10px] text-ink-400">
              {t.sliderCaption(MAX_SEED.toLocaleString())}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {FAMOUS_SEEDS.map((n, i) => (
                <button
                  key={n}
                  onClick={() => {
                    setSeed(n);
                    setSeedInput(String(n));
                  }}
                  className={`rounded-md border px-3 py-2 text-left transition-colors ${
                    seed === n
                      ? "border-signal-amber/60 bg-signal-amber/10 text-signal-amber"
                      : "hairline text-ink-200 hover:border-signal-amber/40 hover:text-ink-100"
                  }`}
                >
                  <div className="font-mono text-xs">n = {n}</div>
                  <div className="mt-0.5 font-mono text-[10px] text-ink-400">
                    {t.famousSeeds[i]}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {t.statsHeading}
            </div>
            <dl className="grid grid-cols-2 gap-x-3 gap-y-2 font-mono text-xs">
              <dt className="text-ink-400">{t.steps}</dt>
              <dd className="text-right text-signal-amber">{traj.steps}</dd>
              <dt className="text-ink-400">{t.peakValue}</dt>
              <dd className="text-right text-signal-amber">{traj.peak.toLocaleString()}</dd>
              <dt className="text-ink-400">{t.peakStep}</dt>
              <dd className="text-right text-signal-amber">{traj.peakStep}</dd>
              <dt className="text-ink-400">{t.pathLength}</dt>
              <dd className="text-right text-signal-amber">{traj.values.length}</dd>
            </dl>
          </div>

          <div className="hairline space-y-4 border-b p-5">
            <label className="flex cursor-pointer items-center justify-between gap-3">
              <span className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                {t.showTree}
              </span>
              <input
                type="checkbox"
                checked={showTree}
                onChange={(e) => setShowTree(e.target.checked)}
                className="accent-signal-amber"
              />
            </label>
            <div className="space-y-2">
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                <span>{t.treeDepth}</span>
                <span className="text-signal-amber">{treeDepth}</span>
              </div>
              <input
                type="range"
                value={treeDepth}
                min={3}
                max={10}
                step={1}
                aria-label={t.treeDepth}
                onChange={(e) => setTreeDepth(parseInt(e.target.value, 10))}
                disabled={!showTree}
                className="w-full accent-signal-amber disabled:opacity-40"
              />
              <p className="font-mono text-[10px] leading-relaxed text-ink-400">{t.treeExplain}</p>
            </div>
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="hairline rounded-md border bg-ink-950/60 px-3 py-2">
      <div className="font-mono text-[9px] uppercase tracking-widest2 text-ink-400">{label}</div>
      <div className="mt-1 font-mono text-sm text-signal-amber">{value}</div>
    </div>
  );
}
