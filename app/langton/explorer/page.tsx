"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { useDpr } from "@/lib/hooks/useDpr";
import { palette } from "@/lib/visual/palette";
import type { Locale } from "@/lib/i18n/types";

// Preset rule strings, each character (R=right, L=left) is the turn taken on
// one colour. Classic Langton's ant is "RL". Labels and notes follow the
// standard multi-colour turmite taxonomy (Propp / Wikipedia): RLR grows
// chaotically, LLRR grows symmetrically, LRRRRRLLR fills a square around
// itself, RRLLLRLLLRRR builds a filled triangle that grows and moves.
interface RulePreset {
  id: string;
  rule: string;
}

const PRESETS: RulePreset[] = [
  { id: "RL", rule: "RL" },
  { id: "RLR", rule: "RLR" },
  { id: "LLRR", rule: "LLRR" },
  { id: "LRRRRRLLR", rule: "LRRRRRLLR" },
  { id: "RRLLLRLLLRRR", rule: "RRLLLRLLLRRR" },
];

// Localised UI for the explorer. Kept inline (local RICH-style record keyed by
// Locale), mirroring the story page's RICH_STORY pattern.
type PresetCopy = { label: string; note: string };
interface ExplorerUi {
  presets: Record<string, PresetCopy>;
  ruleHeading: string;
  stepsPerFrame: string;
  cellSize: string;
  play: string;
  pause: string;
  reset: string;
  colours: string;
  stepLabel: string;
  canvasLabel: string;
}

const EXPLORER_UI: Record<Locale, ExplorerUi> = {
  en: {
    presets: {
      RL: { label: "Classic", note: "highway ≈ step 10 000" },
      RLR: { label: "Chaotic", note: "grows chaotically" },
      LLRR: { label: "Symmetric", note: "grows symmetrically" },
      LRRRRRLLR: { label: "Filled square", note: "fills a square around itself" },
      RRLLLRLLLRRR: { label: "Triangle", note: "filled triangle, grows and moves" },
    },
    ruleHeading: "Rule",
    stepsPerFrame: "Steps / frame",
    cellSize: "Cell size (px)",
    play: "Play",
    pause: "Pause",
    reset: "Reset",
    colours: "colours",
    stepLabel: "step",
    canvasLabel: "Langton's ant simulation",
  },
  de: {
    presets: {
      RL: { label: "Klassisch", note: "Autobahn ≈ Schritt 10 000" },
      RLR: { label: "Chaotisch", note: "wächst chaotisch" },
      LLRR: { label: "Symmetrisch", note: "wächst symmetrisch" },
      LRRRRRLLR: { label: "Gefülltes Quadrat", note: "füllt ein Quadrat um sich" },
      RRLLLRLLLRRR: { label: "Dreieck", note: "gefülltes Dreieck, wächst und wandert" },
    },
    ruleHeading: "Regel",
    stepsPerFrame: "Schritte / Frame",
    cellSize: "Zellgröße (px)",
    play: "Play",
    pause: "Pause",
    reset: "Reset",
    colours: "Farben",
    stepLabel: "Schritt",
    canvasLabel: "Simulation von Langtons Ameise",
  },
  es: {
    presets: {
      RL: { label: "Clásica", note: "autopista ≈ paso 10 000" },
      RLR: { label: "Caótica", note: "crece caóticamente" },
      LLRR: { label: "Simétrica", note: "crece simétricamente" },
      LRRRRRLLR: { label: "Cuadrado relleno", note: "rellena un cuadrado a su alrededor" },
      RRLLLRLLLRRR: { label: "Triángulo", note: "triángulo relleno, crece y se desplaza" },
    },
    ruleHeading: "Regla",
    stepsPerFrame: "Pasos / fotograma",
    cellSize: "Tamaño de celda (px)",
    play: "Play",
    pause: "Pausa",
    reset: "Reiniciar",
    colours: "colores",
    stepLabel: "paso",
    canvasLabel: "simulación de la hormiga de Langton",
  },
  fr: {
    presets: {
      RL: { label: "Classique", note: "autoroute ≈ pas 10 000" },
      RLR: { label: "Chaotique", note: "croît de façon chaotique" },
      LLRR: { label: "Symétrique", note: "croît symétriquement" },
      LRRRRRLLR: { label: "Carré rempli", note: "remplit un carré autour d'elle" },
      RRLLLRLLLRRR: { label: "Triangle", note: "triangle rempli, croît et se déplace" },
    },
    ruleHeading: "Règle",
    stepsPerFrame: "Pas / image",
    cellSize: "Taille de cellule (px)",
    play: "Lecture",
    pause: "Pause",
    reset: "Réinit.",
    colours: "couleurs",
    stepLabel: "pas",
    canvasLabel: "simulation de la fourmi de Langton",
  },
  it: {
    presets: {
      RL: { label: "Classica", note: "autostrada ≈ passo 10 000" },
      RLR: { label: "Caotica", note: "cresce in modo caotico" },
      LLRR: { label: "Simmetrica", note: "cresce simmetricamente" },
      LRRRRRLLR: { label: "Quadrato pieno", note: "riempie un quadrato attorno a sé" },
      RRLLLRLLLRRR: { label: "Triangolo", note: "triangolo pieno, cresce e si sposta" },
    },
    ruleHeading: "Regola",
    stepsPerFrame: "Passi / frame",
    cellSize: "Dimensione cella (px)",
    play: "Play",
    pause: "Pausa",
    reset: "Reset",
    colours: "colori",
    stepLabel: "passo",
    canvasLabel: "simulazione della formica di Langton",
  },
  pt: {
    presets: {
      RL: { label: "Clássica", note: "autoestrada ≈ passo 10 000" },
      RLR: { label: "Caótica", note: "cresce caoticamente" },
      LLRR: { label: "Simétrica", note: "cresce simetricamente" },
      LRRRRRLLR: { label: "Quadrado preenchido", note: "preenche um quadrado à sua volta" },
      RRLLLRLLLRRR: { label: "Triângulo", note: "triângulo preenchido, cresce e desloca-se" },
    },
    ruleHeading: "Regra",
    stepsPerFrame: "Passos / frame",
    cellSize: "Tamanho da célula (px)",
    play: "Play",
    pause: "Pausa",
    reset: "Repor",
    colours: "cores",
    stepLabel: "passo",
    canvasLabel: "simulação da formiga de Langton",
  },
  sv: {
    presets: {
      RL: { label: "Klassisk", note: "motorväg ≈ steg 10 000" },
      RLR: { label: "Kaotisk", note: "växer kaotiskt" },
      LLRR: { label: "Symmetrisk", note: "växer symmetriskt" },
      LRRRRRLLR: { label: "Fylld kvadrat", note: "fyller en kvadrat runt sig" },
      RRLLLRLLLRRR: { label: "Triangel", note: "fylld triangel, växer och rör sig" },
    },
    ruleHeading: "Regel",
    stepsPerFrame: "Steg / bildruta",
    cellSize: "Cellstorlek (px)",
    play: "Spela",
    pause: "Paus",
    reset: "Återställ",
    colours: "färger",
    stepLabel: "steg",
    canvasLabel: "simulering av Langtons myra",
  },
  no: {
    presets: {
      RL: { label: "Klassisk", note: "motorvei ≈ steg 10 000" },
      RLR: { label: "Kaotisk", note: "vokser kaotisk" },
      LLRR: { label: "Symmetrisk", note: "vokser symmetrisk" },
      LRRRRRLLR: { label: "Fylt kvadrat", note: "fyller en kvadrat rundt seg" },
      RRLLLRLLLRRR: { label: "Trekant", note: "fylt trekant, vokser og flytter seg" },
    },
    ruleHeading: "Regel",
    stepsPerFrame: "Steg / bilde",
    cellSize: "Cellestørrelse (px)",
    play: "Spill",
    pause: "Pause",
    reset: "Nullstill",
    colours: "farger",
    stepLabel: "steg",
    canvasLabel: "simulering av Langtons maur",
  },
};

const COLOR_PALETTE = [
  palette.canvas.bg,    // 0 = empty (background)
  palette.signal.violet,
  palette.signal.cyan,
  palette.signal.amber,
  palette.signal.rose,
  "#a0e89a", // soft green
  "#c4c6d0", // grey
  "#ff9a55", // orange
  "#9a8cff", // pale violet
  "#7afdd6", // mint
  "#ffe28a", // sand
  "#ff6b9b", // hot rose
  "#8ddfff", // sky
];

export default function LangtonExplorer() {
  const { a, u, locale } = useI18n();
  const topic = a.topics.langton;
  const ux = EXPLORER_UI[locale];
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dpr = useDpr();

  const [ruleId, setRuleId] = useState("RL");
  const [stepsPerFrame, setStepsPerFrame] = useState(800);
  const [cell, setCell] = useState(4);
  const [running, setRunning] = useState(true);
  const [stepCount, setStepCount] = useState(0);
  const [resetTick, setResetTick] = useState(0);

  const paramsRef = useRef({ stepsPerFrame, running });
  paramsRef.current = { stepsPerFrame, running };

  // Respect prefers-reduced-motion: do not auto-play a continuous canvas
  // animation. Play stays available as an explicit opt-in. (Repo convention.)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRunning(false);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;

    const cellPx = cell * dpr;

    const rule = ruleId;
    const nColors = rule.length;

    let gridW = 0;
    let gridH = 0;
    let grid = new Uint8Array(0);
    let ax = 0;
    let ay = 0;
    let dir = 0; // 0=N 1=E 2=S 3=W
    let total = 0;

    const drawCell = (x: number, y: number, color: string) => {
      ctx.fillStyle = color;
      ctx.fillRect(x * cellPx, y * cellPx, cellPx, cellPx);
    };

    // Repaint the whole canvas from the grid state (used after a real resize so
    // the accumulated trail survives instead of being wiped).
    const paintAll = () => {
      ctx.fillStyle = palette.canvas.bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (let y = 0; y < gridH; y++) {
        for (let x = 0; x < gridW; x++) {
          const c = grid[y * gridW + x];
          if (c !== 0) drawCell(x, y, COLOR_PALETTE[c % COLOR_PALETTE.length]);
        }
      }
    };

    const reseed = () => {
      gridW = Math.max(40, Math.floor(canvas.width / cellPx));
      gridH = Math.max(40, Math.floor(canvas.height / cellPx));
      grid = new Uint8Array(gridW * gridH);
      ax = Math.floor(gridW / 2);
      ay = Math.floor(gridH / 2);
      dir = 0;
      total = 0;
      ctx.fillStyle = palette.canvas.bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    // Grow/shrink the grid to a new canvas size, preserving existing cells and
    // clamping the ant into bounds, then repaint.
    const refit = () => {
      const newW = Math.max(40, Math.floor(canvas.width / cellPx));
      const newH = Math.max(40, Math.floor(canvas.height / cellPx));
      if (newW === gridW && newH === gridH) {
        paintAll();
        return;
      }
      const next = new Uint8Array(newW * newH);
      const copyW = Math.min(gridW, newW);
      const copyH = Math.min(gridH, newH);
      for (let y = 0; y < copyH; y++) {
        for (let x = 0; x < copyW; x++) next[y * newW + x] = grid[y * gridW + x];
      }
      grid = next;
      gridW = newW;
      gridH = newH;
      ax = Math.min(ax, gridW - 1);
      ay = Math.min(ay, gridH - 1);
      paintAll();
    };

    // Assign width/height only when it actually changed, assigning either
    // clears the bitmap even to the same value. Returns whether a change happened.
    const resize = () => {
      const w = Math.floor(canvas.clientWidth * dpr);
      const h = Math.floor(canvas.clientHeight * dpr);
      let changed = false;
      if (canvas.width !== w) {
        canvas.width = w;
        changed = true;
      }
      if (canvas.height !== h) {
        canvas.height = h;
        changed = true;
      }
      return changed;
    };
    resize();
    reseed();

    // The first observe callback fires right after reseed(); resize() reports no
    // change there, so the fresh background fill is not wiped.
    const ro = new ResizeObserver(() => {
      if (resize()) refit();
    });
    ro.observe(canvas);

    const stepOnce = () => {
      // wrap to torus
      const idx = ay * gridW + ax;
      const c = grid[idx];
      const turn = rule[c]; // 'R' or 'L'
      if (turn === "R") dir = (dir + 1) & 3;
      else dir = (dir + 3) & 3;
      const next = (c + 1) % nColors;
      grid[idx] = next;
      drawCell(ax, ay, COLOR_PALETTE[next % COLOR_PALETTE.length]);
      // move
      if (dir === 0) ay = (ay - 1 + gridH) % gridH;
      else if (dir === 1) ax = (ax + 1) % gridW;
      else if (dir === 2) ay = (ay + 1) % gridH;
      else ax = (ax - 1 + gridW) % gridW;
      total++;
    };

    let lastReport = 0;
    const drawHead = () => {
      ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
      ctx.fillRect(ax * cellPx, ay * cellPx, cellPx, cellPx);
    };

    const loop = () => {
      const p = paramsRef.current;
      if (p.running) {
        // re-paint where the head was last frame so the trail is clean
        const idx = ay * gridW + ax;
        drawCell(ax, ay, COLOR_PALETTE[grid[idx] % COLOR_PALETTE.length]);
        for (let i = 0; i < p.stepsPerFrame; i++) stepOnce();
        drawHead();
      } else {
        drawHead();
      }
      if (total - lastReport > 30) {
        setStepCount(total);
        lastReport = total;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [ruleId, cell, resetTick, dpr]);

  return (
    <main className="flex min-h-screen flex-col pt-14">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_420px]">
        <div className="relative min-h-[60vh] bg-ink-950 lg:min-h-[calc(100vh-3.5rem)]">
          <canvas
            ref={canvasRef}
            role="img"
            aria-label={`${ux.canvasLabel} (${ruleId})`}
            className="absolute inset-0 block h-full w-full"
          />
          <div className="pointer-events-none absolute left-4 right-4 top-4 flex items-start justify-between gap-3">
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              rule = {ruleId} · {ruleId.length} {ux.colours}
            </div>
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
              {ux.stepLabel} {stepCount.toLocaleString()}
            </div>
          </div>
        </div>

        <aside className="hairline scrollbar-thin flex flex-col overflow-y-auto border-l bg-ink-900/40">
          <div className="hairline space-y-3 border-b p-6">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
              {topic.title}
            </div>
            <h1 className="math-italic text-3xl leading-tight text-ink-100">{topic.tagline}</h1>
            <p className="text-sm leading-relaxed text-ink-200">{topic.body}</p>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {ux.ruleHeading}
            </div>
            <div className="grid grid-cols-1 gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setRuleId(p.id);
                    setResetTick((t) => t + 1);
                  }}
                  className={`rounded-md border px-3 py-2 text-left transition-colors ${
                    ruleId === p.id
                      ? "border-signal-cyan/60 bg-signal-cyan/10 text-signal-cyan"
                      : "hairline text-ink-200 hover:border-signal-cyan/40 hover:text-signal-cyan"
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span>{ux.presets[p.id].label}</span>
                    <span className="opacity-60">{p.rule}</span>
                  </div>
                  <div className="mt-0.5 font-mono text-[10px] text-ink-400">
                    {ux.presets[p.id].note}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="hairline space-y-4 border-b p-5">
            <SliderRow
              label={ux.stepsPerFrame}
              value={stepsPerFrame}
              min={1}
              max={5000}
              step={1}
              display={stepsPerFrame.toLocaleString()}
              onChange={setStepsPerFrame}
            />
            <SliderRow
              label={ux.cellSize}
              value={cell}
              min={2}
              max={10}
              step={1}
              display={`${cell}px`}
              onChange={(v) => {
                setCell(v);
                setResetTick((t) => t + 1);
              }}
            />
          </div>

          <div className="hairline space-y-2 border-b p-5">
            <button
              onClick={() => setRunning((v) => !v)}
              className={`w-full rounded-md border py-2 font-mono text-[11px] uppercase tracking-widest2 transition-colors ${
                running
                  ? "border-signal-rose/60 bg-signal-rose/10 text-signal-rose"
                  : "border-signal-cyan/60 bg-signal-cyan/10 text-signal-cyan"
              }`}
            >
              {running ? `❚❚ ${ux.pause}` : `▶ ${ux.play}`}
            </button>
            <button
              onClick={() => setResetTick((t) => t + 1)}
              className="hairline hover:text-ink-50 w-full rounded-md border py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-ink-300/50"
            >
              ⟳ {ux.reset}
            </button>
          </div>

          <div className="p-5">
            <Link
              href="/"
              className="hairline block w-full rounded-md border py-2 text-center font-mono text-[10px] uppercase tracking-widest2 text-ink-300 transition-colors hover:border-signal-cyan/40 hover:text-signal-cyan"
            >
              {u.back}
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between">
        <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">{label}</div>
        <div className="font-mono text-[10px] text-ink-400">{display}</div>
      </div>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        aria-label={label}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-signal-cyan"
      />
    </div>
  );
}
