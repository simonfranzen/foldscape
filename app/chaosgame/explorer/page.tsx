"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import type { Locale } from "@/lib/i18n/types";
import { useDpr } from "@/lib/hooks/useDpr";
import { palette } from "@/lib/visual/palette";

type Restriction = "none" | "norepeat" | "noneighbour" | "noopposite";

interface DotColor {
  id: string;
  css: string; // for swatch
  draw: string; // canvas fillStyle (slightly translucent)
}

// Derive the canvas draw colours from the shared palette so the swatch and the
// dots it paints stay the same violet/cyan/amber/rose (no drifting rgba
// literals that silently disagree with the signal-* tokens).
function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const COLORS: DotColor[] = [
  { id: "cyan", css: "bg-signal-cyan", draw: hexToRgba(palette.signal.cyan, 0.55) },
  { id: "violet", css: "bg-signal-violet", draw: hexToRgba(palette.signal.violet, 0.55) },
  { id: "amber", css: "bg-signal-amber", draw: hexToRgba(palette.signal.amber, 0.55) },
  { id: "rose", css: "bg-signal-rose", draw: hexToRgba(palette.signal.rose, 0.55) },
];

const OUTLINE = hexToRgba(palette.signal.cyan, 0.18);
const VERTEX = hexToRgba(palette.signal.cyan, 0.6);

// Magic jump ratio for a regular n-gon. The update is p' = p + r·(v − p), so
// each map's sub-copy shrinks by sₙ = 1/(2·(1 + Σ_{k=1..⌊n/4⌋} cos(2πk/n))),
// and the ratio that makes the copies just kiss (a clean self-similar
// attractor, not a filled polygon) is rₙ = 1 − sₙ: 0.5, 0.5, 1/φ, 2/3, 0.692,
// 1/√2 for n = 3..8. The old 1/(1+2cos(π/n)) was only correct at n = 3.
function magicRatio(n: number): number {
  let sum = 0;
  for (let k = 1; k <= Math.floor(n / 4); k++) {
    sum += Math.cos((2 * Math.PI * k) / n);
  }
  const s = 1 / (2 * (1 + sum));
  return 1 - s;
}

interface Preset {
  id: "triangle" | "square" | "pentagon" | "fern";
  n: number; // 0 == fern
  restriction: Restriction;
  ratio: number | null; // null = use magic
}

const PRESETS: Preset[] = [
  { id: "triangle", n: 3, restriction: "none", ratio: 0.5 },
  { id: "square", n: 4, restriction: "norepeat", ratio: 0.5 },
  { id: "pentagon", n: 5, restriction: "none", ratio: null },
  { id: "fern", n: 0, restriction: "none", ratio: null },
];

// --------------------------------------------------------------------------
// Per-locale UI strings for the chaos-game explorer. Kept inline so the
// translations sit next to the controls they label instead of fattening the
// shared i18n bundles (the repo's RICH_EXPLORER convention).
// --------------------------------------------------------------------------

type RichExplorer = {
  chaosGame: string;
  barnsleyFern: string;
  presetLabels: Record<Preset["id"], string>;
  fernNote: string;
  presets: string;
  verticesN: string;
  fern: string;
  jumpRatio: string;
  autoMagic: string;
  restriction: string;
  restrictions: Record<Restriction, string>;
  speed: string;
  dotColour: string;
  colours: Record<string, string>;
  clear: string;
  points: string;
  canvasLabel: string;
};

const RICH_EXPLORER: Record<Locale, RichExplorer> = {
  en: {
    chaosGame: "Chaos game",
    barnsleyFern: "Barnsley fern · 4-map IFS",
    presetLabels: {
      triangle: "Triangle",
      square: "Square (no-repeat)",
      pentagon: "Pentagon",
      fern: "Barnsley fern",
    },
    fernNote: "IFS · 4 affine maps",
    presets: "Presets",
    verticesN: "Vertices n",
    fern: "fern",
    jumpRatio: "Jump ratio r",
    autoMagic: "Auto magic ratio",
    restriction: "Restriction",
    restrictions: {
      none: "None",
      norepeat: "No repeat",
      noneighbour: "No neighbour",
      noopposite: "No opposite",
    },
    speed: "Speed · points/frame",
    dotColour: "Dot colour",
    colours: { cyan: "cyan", violet: "violet", amber: "amber", rose: "rose" },
    clear: "Clear",
    points: "points",
    canvasLabel: "Chaos game canvas rendering the fractal attractor",
  },
  de: {
    chaosGame: "Chaosspiel",
    barnsleyFern: "Barnsley-Farn · IFS mit 4 Abbildungen",
    presetLabels: {
      triangle: "Dreieck",
      square: "Quadrat (ohne Wiederholung)",
      pentagon: "Fünfeck",
      fern: "Barnsley-Farn",
    },
    fernNote: "IFS · 4 affine Abbildungen",
    presets: "Voreinstellungen",
    verticesN: "Ecken n",
    fern: "Farn",
    jumpRatio: "Sprungverhältnis r",
    autoMagic: "Magisches Verhältnis automatisch",
    restriction: "Einschränkung",
    restrictions: {
      none: "Keine",
      norepeat: "Keine Wiederholung",
      noneighbour: "Kein Nachbar",
      noopposite: "Kein Gegenüber",
    },
    speed: "Geschwindigkeit · Punkte/Bild",
    dotColour: "Punktfarbe",
    colours: { cyan: "Cyan", violet: "Violett", amber: "Bernstein", rose: "Rosé" },
    clear: "Leeren",
    points: "Punkte",
    canvasLabel: "Chaosspiel-Zeichenfläche mit dem fraktalen Attraktor",
  },
  es: {
    chaosGame: "Juego del caos",
    barnsleyFern: "Helecho de Barnsley · IFS de 4 mapas",
    presetLabels: {
      triangle: "Triángulo",
      square: "Cuadrado (sin repetir)",
      pentagon: "Pentágono",
      fern: "Helecho de Barnsley",
    },
    fernNote: "IFS · 4 mapas afines",
    presets: "Preajustes",
    verticesN: "Vértices n",
    fern: "helecho",
    jumpRatio: "Razón de salto r",
    autoMagic: "Razón mágica automática",
    restriction: "Restricción",
    restrictions: {
      none: "Ninguna",
      norepeat: "Sin repetir",
      noneighbour: "Sin vecino",
      noopposite: "Sin opuesto",
    },
    speed: "Velocidad · puntos/fotograma",
    dotColour: "Color de punto",
    colours: { cyan: "cian", violet: "violeta", amber: "ámbar", rose: "rosa" },
    clear: "Borrar",
    points: "puntos",
    canvasLabel: "Lienzo del juego del caos que dibuja el atractor fractal",
  },
  fr: {
    chaosGame: "Jeu du chaos",
    barnsleyFern: "Fougère de Barnsley · IFS à 4 applications",
    presetLabels: {
      triangle: "Triangle",
      square: "Carré (sans répétition)",
      pentagon: "Pentagone",
      fern: "Fougère de Barnsley",
    },
    fernNote: "IFS · 4 applications affines",
    presets: "Préréglages",
    verticesN: "Sommets n",
    fern: "fougère",
    jumpRatio: "Ratio de saut r",
    autoMagic: "Ratio magique auto",
    restriction: "Restriction",
    restrictions: {
      none: "Aucune",
      norepeat: "Sans répétition",
      noneighbour: "Sans voisin",
      noopposite: "Sans opposé",
    },
    speed: "Vitesse · points/image",
    dotColour: "Couleur des points",
    colours: { cyan: "cyan", violet: "violet", amber: "ambre", rose: "rose" },
    clear: "Effacer",
    points: "points",
    canvasLabel: "Zone de dessin du jeu du chaos affichant l'attracteur fractal",
  },
  it: {
    chaosGame: "Gioco del caos",
    barnsleyFern: "Felce di Barnsley · IFS a 4 mappe",
    presetLabels: {
      triangle: "Triangolo",
      square: "Quadrato (senza ripetizione)",
      pentagon: "Pentagono",
      fern: "Felce di Barnsley",
    },
    fernNote: "IFS · 4 mappe affini",
    presets: "Preimpostazioni",
    verticesN: "Vertici n",
    fern: "felce",
    jumpRatio: "Rapporto di salto r",
    autoMagic: "Rapporto magico automatico",
    restriction: "Restrizione",
    restrictions: {
      none: "Nessuna",
      norepeat: "Senza ripetizione",
      noneighbour: "Nessun vicino",
      noopposite: "Nessun opposto",
    },
    speed: "Velocità · punti/fotogramma",
    dotColour: "Colore dei punti",
    colours: { cyan: "ciano", violet: "viola", amber: "ambra", rose: "rosa" },
    clear: "Pulisci",
    points: "punti",
    canvasLabel: "Tela del gioco del caos che disegna l'attrattore frattale",
  },
  pt: {
    chaosGame: "Jogo do caos",
    barnsleyFern: "Samambaia de Barnsley · IFS de 4 mapas",
    presetLabels: {
      triangle: "Triângulo",
      square: "Quadrado (sem repetir)",
      pentagon: "Pentágono",
      fern: "Samambaia de Barnsley",
    },
    fernNote: "IFS · 4 mapas afins",
    presets: "Predefinições",
    verticesN: "Vértices n",
    fern: "samambaia",
    jumpRatio: "Razão de salto r",
    autoMagic: "Razão mágica automática",
    restriction: "Restrição",
    restrictions: {
      none: "Nenhuma",
      norepeat: "Sem repetir",
      noneighbour: "Sem vizinho",
      noopposite: "Sem oposto",
    },
    speed: "Velocidade · pontos/quadro",
    dotColour: "Cor do ponto",
    colours: { cyan: "ciano", violet: "violeta", amber: "âmbar", rose: "rosa" },
    clear: "Limpar",
    points: "pontos",
    canvasLabel: "Tela do jogo do caos que desenha o atrator fractal",
  },
  sv: {
    chaosGame: "Kaosspelet",
    barnsleyFern: "Barnsleys ormbunke · IFS med 4 avbildningar",
    presetLabels: {
      triangle: "Triangel",
      square: "Kvadrat (utan upprepning)",
      pentagon: "Femhörning",
      fern: "Barnsleys ormbunke",
    },
    fernNote: "IFS · 4 affina avbildningar",
    presets: "Förval",
    verticesN: "Hörn n",
    fern: "ormbunke",
    jumpRatio: "Hoppkvot r",
    autoMagic: "Magisk kvot automatiskt",
    restriction: "Begränsning",
    restrictions: {
      none: "Ingen",
      norepeat: "Ingen upprepning",
      noneighbour: "Ingen granne",
      noopposite: "Ingen motsatt",
    },
    speed: "Hastighet · punkter/bildruta",
    dotColour: "Punktfärg",
    colours: { cyan: "cyan", violet: "violett", amber: "bärnsten", rose: "rosa" },
    clear: "Rensa",
    points: "punkter",
    canvasLabel: "Rityta för kaosspelet som visar den fraktala attraktorn",
  },
  no: {
    chaosGame: "Kaosspillet",
    barnsleyFern: "Barnsleys bregne · IFS med 4 avbildninger",
    presetLabels: {
      triangle: "Trekant",
      square: "Kvadrat (uten gjentakelse)",
      pentagon: "Femkant",
      fern: "Barnsleys bregne",
    },
    fernNote: "IFS · 4 affine avbildninger",
    presets: "Forhåndsvalg",
    verticesN: "Hjørner n",
    fern: "bregne",
    jumpRatio: "Hoppforhold r",
    autoMagic: "Magisk kvot automatisk",
    restriction: "Begrensning",
    restrictions: {
      none: "Ingen",
      norepeat: "Ingen gjentakelse",
      noneighbour: "Ingen nabo",
      noopposite: "Ingen motsatt",
    },
    speed: "Hastighet · punkter/bilde",
    dotColour: "Punktfarge",
    colours: { cyan: "cyan", violet: "fiolett", amber: "ravgul", rose: "rosa" },
    clear: "Tøm",
    points: "punkter",
    canvasLabel: "Tegneflate for kaosspillet som viser den fraktale attraktoren",
  },
};

// Barnsley fern affine maps, applied to (x, y).
// Each entry: [a, b, c, d, e, f] meaning x' = a*x + b*y + e, y' = c*x + d*y + f.
// Probabilities: 0.01, 0.85, 0.07, 0.07.
const FERN_MAPS: Array<[number, number, number, number, number, number]> = [
  [0.0, 0.0, 0.0, 0.16, 0.0, 0.0],
  [0.85, 0.04, -0.04, 0.85, 0.0, 1.6],
  [0.2, -0.26, 0.23, 0.22, 0.0, 1.6],
  [-0.15, 0.28, 0.26, 0.24, 0.0, 0.44],
];
const FERN_CUMULATIVE = [0.01, 0.86, 0.93, 1.0];

function pickFernMap(): number {
  const r = Math.random();
  for (let i = 0; i < FERN_CUMULATIVE.length; i++) {
    if (r < FERN_CUMULATIVE[i]) return i;
  }
  return FERN_CUMULATIVE.length - 1;
}

export default function ChaosGameExplorer() {
  const { a, u, locale } = useI18n();
  const topic = a.topics.chaosgame;
  const tx = RICH_EXPLORER[locale];
  const dpr = useDpr();
  const uid = useId();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // controls
  const [n, setN] = useState(3);
  const [restriction, setRestriction] = useState<Restriction>("none");
  const [autoMagic, setAutoMagic] = useState(true);
  const [ratio, setRatio] = useState(0.5);
  // Default speed: 8000 was effectively "image appears instantly", losing
  // the IFS "drawing itself" feeling. 1500 lets the eye follow how the
  // fractal accumulates over a few seconds. Slider still goes up to 50k.
  const [speed, setSpeed] = useState(1500);
  const [colorId, setColorId] = useState("cyan");
  const [mode, setMode] = useState<"polygon" | "fern">("polygon");
  const [totalPoints, setTotalPoints] = useState(0);
  const [clearTick, setClearTick] = useState(0); // bump to clear canvas
  const [reduceMotion, setReduceMotion] = useState(false);

  // refs for animation loop (avoid re-renders per frame)
  const posRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const historyRef = useRef<number[]>([]);
  const countRef = useRef(0);
  const lastReportRef = useRef(0);

  // Track prefers-reduced-motion live (re-subscribe so an OS toggle takes
  // effect without a reload), matching the rest of the repo's canvases.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // sync magic ratio when n changes and autoMagic is on
  useEffect(() => {
    if (mode === "polygon" && autoMagic) {
      setRatio(parseFloat(magicRatio(n).toFixed(4)));
    }
  }, [n, autoMagic, mode]);

  // restart-on-change: clear canvas and counters whenever the rule changes
  useEffect(() => {
    countRef.current = 0;
    lastReportRef.current = 0;
    setTotalPoints(0);
    historyRef.current = [];
    posRef.current = { x: 0, y: 0 };
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = palette.canvas.bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
    // speed/colorId are included so changing them resets the counter too: the
    // main effect re-runs (and wipes the canvas via sizeCanvas) on those deps,
    // and without this the label would keep a stale total over a blank picture.
  }, [n, ratio, restriction, mode, clearTick, speed, colorId]);

  // main animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const sizeCanvas = () => {
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(W * dpr));
      canvas.height = Math.max(1, Math.floor(H * dpr));
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = palette.canvas.bg;
      ctx.fillRect(0, 0, W, H);
      // Sketch the polygon outline for context
      if (mode === "polygon") {
        const { vx, vy } = polygonLayout(n, W, H);
        ctx.strokeStyle = OUTLINE;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i < n; i++) {
          const xx = vx[i];
          const yy = vy[i];
          if (i === 0) ctx.moveTo(xx, yy);
          else ctx.lineTo(xx, yy);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.fillStyle = VERTEX;
        for (let i = 0; i < n; i++) {
          ctx.beginPath();
          ctx.arc(vx[i], vy[i], 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };
    sizeCanvas();
    const ro = new ResizeObserver(sizeCanvas);
    ro.observe(canvas);

    const ctx = canvas.getContext("2d");
    if (!ctx) return () => ro.disconnect();

    const fillStyle = COLORS.find((c) => c.id === colorId)?.draw ?? COLORS[0].draw;

    // Draw `batch` points, advancing the shared position/history refs. Reused by
    // the live loop and the reduced-motion static frame so both agree.
    const drawBatch = (batch: number) => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.fillStyle = fillStyle;

      if (mode === "fern") {
        // map fern world (x ≈ [-3,3], y ≈ [0,10]) into canvas
        const margin = 14;
        const sx = (w - 2 * margin) / 6; // x range 6
        const sy = (h - 2 * margin) / 10; // y range 10
        const scale = Math.min(sx, sy);
        const ox = w / 2;
        const oy = h - margin;

        let { x, y } = posRef.current;
        for (let i = 0; i < batch; i++) {
          const m = pickFernMap();
          const map = FERN_MAPS[m];
          const nx = map[0] * x + map[1] * y + map[4];
          const ny = map[2] * x + map[3] * y + map[5];
          x = nx;
          y = ny;
          const px = ox + x * scale;
          const py = oy - y * scale;
          ctx.fillRect(px, py, 1, 1);
        }
        posRef.current = { x, y };
      } else {
        const { vx, vy } = polygonLayout(n, w, h);
        let { x, y } = posRef.current;
        if (x === 0 && y === 0) {
          x = w / 2;
          y = h / 2;
        }
        const hist = historyRef.current;
        for (let i = 0; i < batch; i++) {
          let pick: number;
          let attempts = 0;
          do {
            pick = (Math.random() * n) | 0;
            attempts++;
            if (attempts > 64) break;
          } while (isForbidden(pick, hist, n, restriction));

          x = x + ratio * (vx[pick] - x);
          y = y + ratio * (vy[pick] - y);

          hist.unshift(pick);
          if (hist.length > 2) hist.pop();

          ctx.fillRect(x, y, 1, 1);
        }
        posRef.current = { x, y };
      }
      countRef.current += batch;
    };

    // Reduced motion: render one complete settled frame, never animate.
    if (reduceMotion) {
      drawBatch(200_000);
      setTotalPoints(countRef.current);
      return () => ro.disconnect();
    }

    // Point budget: stop once the attractor is fully dense so we don't
    // re-render React state 60×/s forever.
    const BUDGET = 2_000_000;

    let raf = 0;
    const tick = () => {
      drawBatch(speed);
      // throttle the React state update to ~10/s
      const now = performance.now();
      if (now - lastReportRef.current > 100) {
        lastReportRef.current = now;
        setTotalPoints(countRef.current);
      }
      if (countRef.current >= BUDGET) {
        setTotalPoints(countRef.current); // settled — flush the final count
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [n, ratio, restriction, mode, speed, colorId, clearTick, dpr, reduceMotion]);

  const handlePreset = (p: Preset) => {
    if (p.id === "fern") {
      setMode("fern");
      setN(0);
      setRestriction("none");
      // Initialise fern starting position
      posRef.current = { x: 0, y: 0 };
    } else {
      setMode("polygon");
      setN(p.n);
      setRestriction(p.restriction);
      setAutoMagic(p.ratio === null);
      if (p.ratio !== null) setRatio(p.ratio);
      else setRatio(parseFloat(magicRatio(p.n).toFixed(4)));
    }
    setClearTick((t) => t + 1);
  };

  const handleNChange = (nv: number) => {
    setMode("polygon");
    setN(nv);
  };

  return (
    <main className="flex min-h-screen flex-col pt-14">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_420px]">
        <div className="relative flex min-h-[60vh] flex-col gap-4 bg-ink-950 p-4 lg:min-h-[calc(100vh-3.5rem)] lg:p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              {mode === "fern"
                ? tx.barnsleyFern
                : `${tx.chaosGame} · n = ${n} · r = ${ratio.toFixed(4)} · ${tx.restrictions[restriction]}`}
            </div>
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
              p ← p + r · (vᵢ − p)
            </div>
          </div>
          <div className="hairline flex-1 overflow-hidden rounded-2xl border bg-ink-950">
            <canvas
              ref={canvasRef}
              role="img"
              aria-label={tx.canvasLabel}
              className="block h-full w-full"
            />
          </div>
          <div className="flex items-center justify-between gap-3">
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              {totalPoints.toLocaleString()} {tx.points}
            </div>
            <button
              onClick={() => setClearTick((t) => t + 1)}
              className="hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-signal-cyan/40 hover:text-signal-cyan"
            >
              {tx.clear}
            </button>
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
              {tx.presets}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handlePreset(p)}
                  className="hairline rounded-md border px-3 py-2 text-left text-ink-200 transition-colors hover:border-signal-cyan/40 hover:text-signal-cyan"
                >
                  <div className="font-mono text-xs">{tx.presetLabels[p.id]}</div>
                  {p.id === "fern" ? (
                    <div className="mt-0.5 font-mono text-[10px] text-ink-400">{tx.fernNote}</div>
                  ) : null}
                </button>
              ))}
            </div>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="flex items-center justify-between">
              <label
                htmlFor={`${uid}-vertices`}
                className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300"
              >
                {tx.verticesN}
              </label>
              <div className="font-mono text-sm text-signal-cyan">
                {mode === "fern" ? tx.fern : n}
              </div>
            </div>
            <input
              id={`${uid}-vertices`}
              type="range"
              aria-label={tx.verticesN}
              value={mode === "fern" ? 3 : n}
              min={3}
              max={8}
              step={1}
              disabled={mode === "fern"}
              onChange={(e) => handleNChange(parseInt(e.target.value))}
              className="w-full accent-signal-cyan disabled:opacity-40"
            />
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="flex items-center justify-between">
              <label
                htmlFor={`${uid}-ratio`}
                className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300"
              >
                {tx.jumpRatio}
              </label>
              <div className="font-mono text-sm text-signal-amber">{ratio.toFixed(4)}</div>
            </div>
            <input
              id={`${uid}-ratio`}
              type="range"
              aria-label={tx.jumpRatio}
              value={ratio}
              min={0.1}
              max={0.9}
              step={0.001}
              disabled={mode === "fern"}
              onChange={(e) => {
                setAutoMagic(false);
                setRatio(parseFloat(e.target.value));
              }}
              className="w-full accent-signal-amber disabled:opacity-40"
            />
            <label className="flex cursor-pointer items-center gap-2 font-mono text-[11px] text-ink-300">
              <input
                type="checkbox"
                checked={autoMagic}
                disabled={mode === "fern"}
                onChange={(e) => setAutoMagic(e.target.checked)}
                className="accent-signal-cyan"
              />
              <span>{tx.autoMagic} · rₙ = 1 − sₙ</span>
            </label>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {tx.restriction}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(["none", "norepeat", "noneighbour", "noopposite"] as const).map((rid) => {
                const active = restriction === rid && mode !== "fern";
                return (
                  <button
                    key={rid}
                    onClick={() => {
                      setMode("polygon");
                      setRestriction(rid);
                    }}
                    disabled={mode === "fern"}
                    aria-pressed={active}
                    className={`rounded-md border px-3 py-2 text-left transition-colors disabled:opacity-40 ${
                      active
                        ? "border-signal-cyan/60 bg-signal-cyan/10 text-signal-cyan"
                        : "hairline text-ink-200 hover:border-signal-cyan/40 hover:text-signal-cyan"
                    }`}
                  >
                    <div className="font-mono text-xs">{tx.restrictions[rid]}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="flex items-center justify-between">
              <label
                htmlFor={`${uid}-speed`}
                className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300"
              >
                {tx.speed}
              </label>
              <div className="font-mono text-sm text-signal-amber">{speed.toLocaleString()}</div>
            </div>
            <input
              id={`${uid}-speed`}
              type="range"
              aria-label={tx.speed}
              value={speed}
              min={100}
              max={50000}
              step={100}
              onChange={(e) => setSpeed(parseInt(e.target.value))}
              className="w-full accent-signal-amber"
            />
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {tx.dotColour}
            </div>
            <div className="flex items-center gap-2">
              {COLORS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setColorId(c.id)}
                  aria-label={tx.colours[c.id]}
                  aria-pressed={colorId === c.id}
                  className={`h-8 w-8 rounded-md border transition-transform ${c.css} ${
                    colorId === c.id ? "scale-110 border-ink-100" : "border-ink-700 hover:scale-105"
                  }`}
                />
              ))}
            </div>
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

// --- helpers ---

function polygonLayout(n: number, W: number, H: number): { vx: number[]; vy: number[] } {
  const margin = 24;
  const cx = W / 2;
  const cy = H / 2;
  const R = Math.min(W, H) / 2 - margin;
  const vx: number[] = [];
  const vy: number[] = [];
  for (let i = 0; i < n; i++) {
    const theta = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    vx.push(cx + R * Math.cos(theta));
    vy.push(cy + R * Math.sin(theta));
  }
  return { vx, vy };
}

function isForbidden(
  pick: number,
  history: number[],
  n: number,
  restriction: Restriction,
): boolean {
  if (restriction === "none" || history.length === 0) return false;
  const last = history[0];
  if (restriction === "norepeat") {
    return pick === last;
  }
  if (restriction === "noneighbour") {
    const diff = (((pick - last) % n) + n) % n;
    return diff === 1 || diff === n - 1;
  }
  if (restriction === "noopposite") {
    if (n % 2 === 0) {
      return pick === (last + n / 2) % n;
    }
    // odd n: forbid the two "almost-opposite" vertices
    const half = (n - 1) / 2;
    return pick === (last + half) % n || pick === (last + half + 1) % n;
  }
  return false;
}
