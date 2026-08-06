"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { useDpr } from "@/lib/hooks/useDpr";
import { palette } from "@/lib/visual/palette";
import type { Locale } from "@/lib/i18n/types";

interface Ball {
  x: number; // peg-grid x (0..rows)
  y: number; // peg-grid y (0..rows)
  px: number; // pixel position smoothed
  py: number;
  done: boolean;
  bin: number;
}

// Binomial PMF C(n, k) p^k (1-p)^{n-k}, log form for stability up to n = 40.
// p is clamped off the 0/1 endpoints so an extreme bias slider never hits log(0).
function binomPMF(n: number, k: number, p: number): number {
  const q = Math.min(Math.max(p, 1e-9), 1 - 1e-9);
  let logC = 0;
  for (let i = 1; i <= k; i++) logC += Math.log((n - k + i) / i);
  return Math.exp(logC + k * Math.log(q) + (n - k) * Math.log(1 - q));
}

// Explorer UI copy per locale. The story page carries a full RICH_STORY, so the
// interactive room it links to must speak every locale too, not just English.
type ExplorerStrings = {
  rowsLabel: string;
  spawnLabel: string;
  biasLabel: string;
  overlayLabel: string;
  pause: string;
  play: string;
  clear: string;
  rowsUnit: string;
  ballsUnit: string;
  binsWord: string;
  landedWord: string;
  canvasLabel: string;
};

const RICH_EXPLORER: Record<Locale, ExplorerStrings> = {
  en: {
    rowsLabel: "Rows N",
    spawnLabel: "Spawn / step",
    biasLabel: "Right-bias p",
    overlayLabel: "Overlay 𝒩(Np, Np(1−p))",
    pause: "❚❚ Pause",
    play: "▶ Play",
    clear: "⟳ Clear histogram",
    rowsUnit: "rows",
    ballsUnit: "balls",
    binsWord: "bins",
    landedWord: "landed",
    canvasLabel: "Galton board simulation: balls fall through pegs and fill a histogram.",
  },
  de: {
    rowsLabel: "Reihen N",
    spawnLabel: "Spawn / Schritt",
    biasLabel: "Rechts-Bias p",
    overlayLabel: "Überlagerung 𝒩(Np, Np(1−p))",
    pause: "❚❚ Pause",
    play: "▶ Start",
    clear: "⟳ Histogramm leeren",
    rowsUnit: "Reihen",
    ballsUnit: "Kugeln",
    binsWord: "Fächer",
    landedWord: "gelandet",
    canvasLabel: "Galton-Brett-Simulation: Kugeln fallen durch Stifte und füllen ein Histogramm.",
  },
  es: {
    rowsLabel: "Filas N",
    spawnLabel: "Spawn / paso",
    biasLabel: "Sesgo derecha p",
    overlayLabel: "Superponer 𝒩(Np, Np(1−p))",
    pause: "❚❚ Pausa",
    play: "▶ Reproducir",
    clear: "⟳ Limpiar histograma",
    rowsUnit: "filas",
    ballsUnit: "bolas",
    binsWord: "casillas",
    landedWord: "caídas",
    canvasLabel: "Simulación del tablero de Galton: las bolas caen entre clavos y llenan un histograma.",
  },
  fr: {
    rowsLabel: "Rangées N",
    spawnLabel: "Spawn / pas",
    biasLabel: "Biais droite p",
    overlayLabel: "Superposer 𝒩(Np, Np(1−p))",
    pause: "❚❚ Pause",
    play: "▶ Lecture",
    clear: "⟳ Effacer l'histogramme",
    rowsUnit: "rangées",
    ballsUnit: "billes",
    binsWord: "casiers",
    landedWord: "tombées",
    canvasLabel: "Simulation de la planche de Galton : les billes tombent entre les clous et remplissent un histogramme.",
  },
  it: {
    rowsLabel: "File N",
    spawnLabel: "Spawn / passo",
    biasLabel: "Bias a destra p",
    overlayLabel: "Sovrapponi 𝒩(Np, Np(1−p))",
    pause: "❚❚ Pausa",
    play: "▶ Riproduci",
    clear: "⟳ Pulisci istogramma",
    rowsUnit: "file",
    ballsUnit: "palline",
    binsWord: "vaschette",
    landedWord: "cadute",
    canvasLabel: "Simulazione della macchina di Galton: le palline cadono tra i chiodi e riempiono un istogramma.",
  },
  pt: {
    rowsLabel: "Filas N",
    spawnLabel: "Spawn / passo",
    biasLabel: "Viés à direita p",
    overlayLabel: "Sobrepor 𝒩(Np, Np(1−p))",
    pause: "❚❚ Pausa",
    play: "▶ Reproduzir",
    clear: "⟳ Limpar histograma",
    rowsUnit: "filas",
    ballsUnit: "bolas",
    binsWord: "casas",
    landedWord: "caídas",
    canvasLabel: "Simulação da placa de Galton: as bolas caem entre os pinos e enchem um histograma.",
  },
  sv: {
    rowsLabel: "Rader N",
    spawnLabel: "Spawn / steg",
    biasLabel: "Högerbias p",
    overlayLabel: "Överlagra 𝒩(Np, Np(1−p))",
    pause: "❚❚ Paus",
    play: "▶ Spela",
    clear: "⟳ Rensa histogram",
    rowsUnit: "rader",
    ballsUnit: "kulor",
    binsWord: "fack",
    landedWord: "landade",
    canvasLabel: "Galtonbräde-simulering: kulor faller mellan pinnar och fyller ett histogram.",
  },
  no: {
    rowsLabel: "Rader N",
    spawnLabel: "Spawn / steg",
    biasLabel: "Høyrebias p",
    overlayLabel: "Overlegg 𝒩(Np, Np(1−p))",
    pause: "❚❚ Pause",
    play: "▶ Spill",
    clear: "⟳ Tøm histogram",
    rowsUnit: "rader",
    ballsUnit: "kuler",
    binsWord: "båser",
    landedWord: "landet",
    canvasLabel: "Galton-brett-simulering: kuler faller mellom pinner og fyller et histogram.",
  },
};

export default function GaltonExplorer() {
  const { a, u, locale } = useI18n();
  const topic = a.topics.galton;
  const tx = RICH_EXPLORER[locale];
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dpr = useDpr();

  // The draw loop reads locale-dependent labels through a ref so switching
  // language never has to tear down and rebuild the animation.
  const txRef = useRef(tx);
  txRef.current = tx;

  // Honour prefers-reduced-motion: freeze the board on the exact binomial for
  // the current N and p instead of autoplaying an endless spawn loop.
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
    const h = (e: MediaQueryListEvent) => setReduced(e.matches);
    m.addEventListener?.("change", h);
    return () => m.removeEventListener?.("change", h);
  }, []);

  const [rows, setRows] = useState(16);
  // Default + slider max trimmed for the same reason as the inline sim:
  // spawn=8 with rows=16 saturates weaker laptops; 2 lets the user watch the
  // distribution build, the slider still goes up to 12 for who wants speed.
  const [spawnRate, setSpawnRate] = useState(2);
  const [bias, setBias] = useState(0.5); // probability to go RIGHT
  const [showGaussian, setShowGaussian] = useState(true);
  const [running, setRunning] = useState(true);
  const [resetTick, setResetTick] = useState(0);
  const [totalLanded, setTotalLanded] = useState(0);

  const paramsRef = useRef({ spawnRate, bias, showGaussian, running });
  paramsRef.current = { spawnRate, bias, showGaussian, running };

  const histRef = useRef<number[]>([]);

  // Reduced motion implies no autoplay: reflect that in the Play/Pause control.
  useEffect(() => {
    if (reduced) setRunning(false);
  }, [reduced]);

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

    histRef.current = new Array(rows + 1).fill(0);
    setTotalLanded(0);
    let balls: Ball[] = [];
    let landed = 0;
    // Reduced motion: pre-fill the histogram with the exact binomial for the
    // current N and p, then draw a single static frame (no rAF loop below).
    if (reduced) {
      const total = 5000;
      let sum = 0;
      for (let k = 0; k <= rows; k++) {
        const c = Math.round(binomPMF(rows, k, paramsRef.current.bias) * total);
        histRef.current[k] = c;
        sum += c;
      }
      landed = sum;
      setTotalLanded(sum);
    }
    // Sub-frame-rate fall: balls advance one row only every STEP_EVERY frames so
    // the eye can follow a single path through N rows (~1.5s at N=22 instead of
    // ~0.37s). Keep this gate — do not "optimise" by moving b.y++ back per-frame.
    const STEP_EVERY = 4;
    let frame = 0;

    const layout = () => {
      const W = canvas.width;
      const H = canvas.height;
      const margin = 30 * dpr;
      const histH = 160 * dpr;
      const pegAreaH = H - histH - margin * 2;
      const pegAreaW = W - margin * 2;
      // peg spacing
      const dx = Math.min(pegAreaW / (rows + 2), pegAreaH / (rows + 2));
      const cx = W / 2;
      const top = margin;
      return { W, H, cx, top, dx, histTop: H - histH - margin, histH, margin };
    };

    const draw = () => {
      const cfg = paramsRef.current;
      const { W, H, cx, top, dx, histTop, histH, margin: _margin } = layout();
      ctx.fillStyle = palette.canvas.bg;
      ctx.fillRect(0, 0, W, H);

      // pegs
      ctx.fillStyle = "rgba(125, 243, 255, 0.5)";
      for (let r = 0; r < rows; r++) {
        const y = top + (r + 1) * dx;
        for (let i = 0; i <= r; i++) {
          const x = cx + (i - r / 2) * dx;
          ctx.beginPath();
          ctx.arc(x, y, 2 * dpr, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // bins guide lines
      ctx.strokeStyle = "rgba(232, 234, 242, 0.1)";
      ctx.lineWidth = 1;
      const binW = dx;
      const binsStart = cx - ((rows + 1) / 2) * binW;
      for (let i = 0; i <= rows + 1; i++) {
        const x = binsStart + i * binW;
        ctx.beginPath();
        ctx.moveTo(x, histTop);
        ctx.lineTo(x, histTop + histH);
        ctx.stroke();
      }

      // simulate ball movement + spawn — physics gated to every 4th frame.
      // Reduced motion never spawns; the pre-filled histogram stands in.
      if (cfg.running && !reduced) {
        frame++;
        if (frame % STEP_EVERY === 0) {
          // spawn
          for (let i = 0; i < cfg.spawnRate; i++) {
            balls.push({ x: 0, y: 0, px: cx, py: top, done: false, bin: 0 });
          }
          // step each ball
          for (const b of balls) {
            if (b.done) continue;
            if (b.y < rows) {
              const goRight = Math.random() < cfg.bias;
              b.y++;
              b.x += goRight ? 0.5 : -0.5; // x is left-right offset from centre
              // target pixel
              const tx = cx + b.x * dx;
              const ty = top + b.y * dx;
              // smooth animate (snap mostly for performance)
              b.px = tx;
              b.py = ty;
              if (b.y === rows) {
                b.done = true;
                // bin index = b.x + rows/2 → integer
                b.bin = Math.round(b.x + rows / 2);
                if (b.bin < 0) b.bin = 0;
                else if (b.bin > rows) b.bin = rows;
                histRef.current[b.bin]++;
                landed++;
              }
            }
          }
        }
      }

      // draw moving balls
      ctx.fillStyle = "rgba(255, 209, 102, 0.85)";
      for (const b of balls) {
        if (b.done) continue;
        ctx.beginPath();
        ctx.arc(b.px, b.py, 2.4 * dpr, 0, Math.PI * 2);
        ctx.fill();
      }

      // remove done balls after some delay (immediate; counter already incremented)
      balls = balls.filter((b) => !b.done);

      // histogram
      const max = Math.max(1, ...histRef.current);
      for (let i = 0; i <= rows; i++) {
        const x = binsStart + i * binW;
        const h = (histRef.current[i] / max) * histH * 0.9;
        ctx.fillStyle = "rgba(125, 243, 255, 0.75)";
        ctx.fillRect(x + binW * 0.1, histTop + histH - h, binW * 0.8, h);
      }

      // gaussian overlay
      if (cfg.showGaussian) {
        const total = histRef.current.reduce((a, c) => a + c, 0);
        if (total > 20) {
          const mu = rows * cfg.bias;
          const sigma2 = rows * cfg.bias * (1 - cfg.bias);
          if (sigma2 > 0.0001) {
            ctx.strokeStyle = palette.signal.rose;
            ctx.lineWidth = 1.6 * dpr;
            ctx.beginPath();
            const steps = 200;
            for (let i = 0; i <= steps; i++) {
              const k = (i / steps) * rows;
              const p =
                (1 / Math.sqrt(2 * Math.PI * sigma2)) * Math.exp(-((k - mu) ** 2) / (2 * sigma2));
              const expected = p * total; // expected count at k
              const x = binsStart + k * binW + binW * 0.5;
              const h = (expected / max) * histH * 0.9;
              const y = histTop + histH - h;
              if (i === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }
            ctx.stroke();
          }
        }
      }

      // separator label
      ctx.fillStyle = "rgba(232, 234, 242, 0.45)";
      ctx.font = `${10 * dpr}px ui-monospace, monospace`;
      ctx.fillText(
        `${txRef.current.binsWord} · ${histRef.current
          .reduce((a, c) => a + c, 0)
          .toLocaleString()} ${txRef.current.landedWord}`,
        10 * dpr,
        histTop - 8 * dpr,
      );
    };

    let lastReport = 0;
    const loop = () => {
      draw();
      if (landed - lastReport > 50) {
        setTotalLanded(landed);
        lastReport = landed;
      }
      raf = requestAnimationFrame(loop);
    };
    // Reduced motion: draw one static frame and stop; otherwise run the loop.
    if (reduced) draw();
    else raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [rows, resetTick, dpr, reduced]);

  return (
    <main className="flex min-h-screen flex-col pt-14">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_420px]">
        <div className="relative min-h-[60vh] bg-ink-950 lg:min-h-[calc(100vh-3.5rem)]">
          <canvas
            ref={canvasRef}
            role="img"
            aria-label={tx.canvasLabel}
            className="absolute inset-0 block h-full w-full"
          />
          <div className="pointer-events-none absolute left-4 right-4 top-4 flex items-start justify-between gap-3">
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              {rows} {tx.rowsUnit} · p = {bias.toFixed(2)}
            </div>
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-teal">
              {totalLanded.toLocaleString()} {tx.ballsUnit}
            </div>
          </div>
        </div>

        <aside className="hairline scrollbar-thin flex flex-col overflow-y-auto border-l bg-ink-900/40">
          <div className="hairline space-y-3 border-b p-6">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-teal">
              {topic.title}
            </div>
            <h1 className="math-italic text-3xl leading-tight text-ink-100">{topic.tagline}</h1>
            <p className="text-sm leading-relaxed text-ink-200">{topic.body}</p>
          </div>

          <div className="hairline space-y-4 border-b p-5">
            <SliderRow
              label={tx.rowsLabel}
              value={rows}
              min={4}
              max={40}
              step={1}
              display={rows.toString()}
              onChange={(v) => {
                setRows(v);
                setResetTick((t) => t + 1);
              }}
            />
            <SliderRow
              label={tx.spawnLabel}
              value={spawnRate}
              min={1}
              max={12}
              step={1}
              display={spawnRate.toString()}
              onChange={setSpawnRate}
            />
            <SliderRow
              label={tx.biasLabel}
              value={bias}
              min={0}
              max={1}
              step={0.01}
              display={bias.toFixed(2)}
              // Clearing on bias change stops the Gaussian overlay from fitting a
              // mixture of counts sampled under different p values.
              onChange={(v) => {
                setBias(v);
                setResetTick((t) => t + 1);
              }}
            />
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <label className="flex cursor-pointer items-center gap-2 font-mono text-[11px] text-ink-300">
              <input
                type="checkbox"
                checked={showGaussian}
                onChange={(e) => setShowGaussian(e.target.checked)}
                className="accent-signal-teal"
              />
              <span>{tx.overlayLabel}</span>
            </label>
          </div>

          <div className="hairline space-y-2 border-b p-5">
            <button
              onClick={() => setRunning((v) => !v)}
              className={`w-full rounded-md border py-2 font-mono text-[11px] uppercase tracking-widest2 transition-colors ${
                running
                  ? "border-signal-rose/60 bg-signal-rose/10 text-signal-rose"
                  : "border-signal-teal/60 bg-signal-teal/10 text-signal-teal"
              }`}
            >
              {running ? tx.pause : tx.play}
            </button>
            <button
              onClick={() => setResetTick((t) => t + 1)}
              className="hairline hover:text-ink-50 w-full rounded-md border py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-ink-300/50"
            >
              {tx.clear}
            </button>
          </div>

          <div className="p-5">
            <Link
              href="/"
              className="hairline block w-full rounded-md border py-2 text-center font-mono text-[10px] uppercase tracking-widest2 text-ink-300 transition-colors hover:border-signal-teal/40 hover:text-signal-teal"
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
        className="w-full accent-signal-teal"
      />
    </div>
  );
}
