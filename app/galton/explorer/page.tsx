"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";

interface Ball {
  x: number; // peg-grid x (0..rows)
  y: number; // peg-grid y (0..rows)
  px: number; // pixel position smoothed
  py: number;
  done: boolean;
  bin: number;
}

export default function GaltonExplorer() {
  const { a, u } = useI18n();
  const topic = a.topics.galton;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [rows, setRows] = useState(16);
  const [spawnRate, setSpawnRate] = useState(8);
  const [bias, setBias] = useState(0.5); // probability to go RIGHT
  const [showGaussian, setShowGaussian] = useState(true);
  const [running, setRunning] = useState(true);
  const [resetTick, setResetTick] = useState(0);
  const [totalLanded, setTotalLanded] = useState(0);

  const paramsRef = useRef({ spawnRate, bias, showGaussian, running });
  paramsRef.current = { spawnRate, bias, showGaussian, running };

  const histRef = useRef<number[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
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
      ctx.fillStyle = "#06070d";
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

      // simulate ball movement + spawn
      if (cfg.running) {
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
            ctx.strokeStyle = "#ff7ab6";
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
        `bins · ${histRef.current.reduce((a, c) => a + c, 0).toLocaleString()} landed`,
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
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [rows, resetTick]);

  return (
    <main className="flex min-h-screen flex-col pt-14">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_420px]">
        <div className="relative min-h-[60vh] bg-ink-950 lg:min-h-[calc(100vh-3.5rem)]">
          <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />
          <div className="pointer-events-none absolute left-4 right-4 top-4 flex items-start justify-between gap-3">
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              {rows} rows · p = {bias.toFixed(2)}
            </div>
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
              {totalLanded.toLocaleString()} balls
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

          <div className="hairline space-y-4 border-b p-5">
            <SliderRow
              label="Rows N"
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
              label="Spawn / frame"
              value={spawnRate}
              min={1}
              max={40}
              step={1}
              display={spawnRate.toString()}
              onChange={setSpawnRate}
            />
            <SliderRow
              label="Right-bias p"
              value={bias}
              min={0}
              max={1}
              step={0.01}
              display={bias.toFixed(2)}
              onChange={setBias}
            />
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <label className="flex cursor-pointer items-center gap-2 font-mono text-[11px] text-ink-300">
              <input
                type="checkbox"
                checked={showGaussian}
                onChange={(e) => setShowGaussian(e.target.checked)}
                className="accent-signal-cyan"
              />
              <span>Overlay 𝒩(Np, Np(1−p))</span>
            </label>
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
              {running ? "❚❚ Pause" : "▶ Play"}
            </button>
            <button
              onClick={() => setResetTick((t) => t + 1)}
              className="hairline hover:text-ink-50 w-full rounded-md border py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-ink-300/50"
            >
              ⟳ Clear histogram
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
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-signal-cyan"
      />
    </div>
  );
}
