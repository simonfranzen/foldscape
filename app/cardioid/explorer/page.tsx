"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { useDpr } from "@/lib/hooks/useDpr";
import { palette } from "@/lib/visual/palette";

type Mode = "cup" | "mandelbrot" | "rolling";

export default function CardioidExplorer() {
  const { a, u } = useI18n();
  const topic = a.topics.cardioid;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [mode, setMode] = useState<Mode>("cup");
  const [rayCount, setRayCount] = useState(120);
  const [showRays, setShowRays] = useState(true);
  const [showCardioid, setShowCardioid] = useState(true);
  const [rolling, _setRolling] = useState(true);
  const [running, setRunning] = useState(true);
  const dpr = useDpr();

  const tRef = useRef(0);
  const cfgRef = useRef({ mode, rayCount, showRays, showCardioid, rolling, running });
  cfgRef.current = { mode, rayCount, showRays, showCardioid, rolling, running };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;

    // Redraw bookkeeping: static modes (cup, mandelbrot) only repaint when
    // their inputs change, so we don't burn the CPU re-rendering a still image
    // every frame. `dirty` forces one repaint after a resize or mode switch.
    let lastSig = "";
    let dirty = true;

    // Cached Mandelbrot pixels, keyed on canvas size. The escape-time pass is
    // the expensive part; recompute it only when the size (its only input)
    // changes, then just putImageData on subsequent paints.
    let mandelData: ImageData | null = null;
    let mandelKey = "";

    const reduceMotion =
      typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;

    const resize = () => {
      canvas.width = Math.floor(canvas.clientWidth * dpr);
      canvas.height = Math.floor(canvas.clientHeight * dpr);
      dirty = true;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const drawCup = () => {
      const cfg = cfgRef.current;
      const W = canvas.width;
      const H = canvas.height;
      ctx.fillStyle = palette.canvas.bg;
      ctx.fillRect(0, 0, W, H);

      const cx = W / 2;
      const cy = H / 2;
      const R = Math.min(W, H) * 0.32;

      // cup wall
      ctx.strokeStyle = "rgba(125, 243, 255, 0.45)";
      ctx.lineWidth = 1.6 * dpr;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.stroke();

      // parallel rays from the right hit the inside of the cup
      if (cfg.showRays) {
        ctx.strokeStyle = "rgba(255, 209, 102, 0.20)";
        ctx.lineWidth = 0.6 * dpr;
        for (let i = 0; i < cfg.rayCount; i++) {
          // Light entering an open cup crosses the interior and reflects off
          // the FAR (left) hemisphere, phi ∈ (π/2, 3π/2) from +x axis. A ray at
          // height py = R sin(phi) enters from the right and its far-wall hit is
          // the left intersection at that same height.
          const phi = Math.PI / 2 + (i / cfg.rayCount) * Math.PI;
          const px = cx + R * Math.cos(phi);
          const py = cy + R * Math.sin(phi);
          // incoming horizontal ray from x=+inf moving in -x direction → entry from far right
          // Skip top/bottom near tangent
          if (Math.abs(Math.cos(phi)) < 0.02) continue;
          // entry: from x = +∞, y = py → start at far right edge of canvas
          ctx.beginPath();
          ctx.moveTo(W + 100, py);
          ctx.lineTo(px, py);
          // Reflected direction: reflect (-1, 0) about the inward normal (-cos phi, -sin phi)
          // Normal points inward = (-cos phi, -sin phi). Incident d = (-1, 0).
          // r = d - 2(d·n)n
          const nx = -Math.cos(phi);
          const ny = -Math.sin(phi);
          const dn = -1 * nx + 0 * ny;
          const rx = -1 - 2 * dn * nx;
          const ry = 0 - 2 * dn * ny;
          // Extend reflected ray inside the cup until it exits.
          const ex = px + rx * R * 2.5;
          const ey = py + ry * R * 2.5;
          ctx.lineTo(ex, ey);
          ctx.stroke();
        }
      }

      // The envelope: catacaustic = cardioid with cusp at (cx + R, cy), size R/2.
      if (cfg.showCardioid) {
        ctx.strokeStyle = palette.signal.amber;
        ctx.lineWidth = 2 * dpr;
        ctx.beginPath();
        // Parametric cardioid: take the parent circle of radius a = R/2 centred at cx, cy
        // rolling on circle of radius a. Trace cardioid with cusp at (cx + R, cy).
        // r(θ) = 2a (1 + cos θ), centred at (cx + R - 0, cy)? Use standard nephroid? Actually catacaustic of a circle for parallel rays is a nephroid (two cusps), NOT a cardioid.
        // For coffee cup the well-known curve from a point source on the rim is a cardioid.
        // For parallel rays it is a nephroid. Let's show both modes correctly.
        const a0 = R / 2;
        for (let i = 0; i <= 256; i++) {
          const t = (i / 256) * Math.PI * 2;
          // Nephroid: x = 3a cos t - a cos 3t, y = 3a sin t - a sin 3t (centred at origin)
          const px = cx + 3 * (a0 / 2) * Math.cos(t) - (a0 / 2) * Math.cos(3 * t);
          const py = cy + 3 * (a0 / 2) * Math.sin(t) - (a0 / 2) * Math.sin(3 * t);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.fillStyle = "rgba(255, 122, 182, 0.9)";
        ctx.font = `${10 * dpr}px ui-monospace, monospace`;
        ctx.fillText("nephroid (parallel rays)", 10 * dpr, H - 10 * dpr);
      }
    };

    const drawRolling = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.fillStyle = palette.canvas.bg;
      ctx.fillRect(0, 0, W, H);
      const cx = W / 2;
      const cy = H / 2;
      const a0 = Math.min(W, H) * 0.13;

      // fixed circle of radius a centred at (cx, cy)
      ctx.strokeStyle = "rgba(125, 243, 255, 0.45)";
      ctx.lineWidth = 1.4 * dpr;
      ctx.beginPath();
      ctx.arc(cx, cy, a0, 0, Math.PI * 2);
      ctx.stroke();

      // rolling circle traces a cardioid
      const t = tRef.current;
      const rollX = cx + 2 * a0 * Math.cos(t);
      const rollY = cy + 2 * a0 * Math.sin(t);
      ctx.strokeStyle = "rgba(179, 136, 255, 0.55)";
      ctx.beginPath();
      ctx.arc(rollX, rollY, a0, 0, Math.PI * 2);
      ctx.stroke();

      // trace point on rolling circle
      // Standard cardioid parameterisation: P = (cx + 2a cos t - a cos 2t, cy + 2a sin t - a sin 2t)
      const pts: Array<[number, number]> = [];
      const steps = 256;
      for (let i = 0; i <= steps; i++) {
        const s = (i / steps) * Math.PI * 2;
        pts.push([
          cx + 2 * a0 * Math.cos(s) - a0 * Math.cos(2 * s),
          cy + 2 * a0 * Math.sin(s) - a0 * Math.sin(2 * s),
        ]);
      }
      ctx.strokeStyle = palette.signal.amber;
      ctx.lineWidth = 2 * dpr;
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (const p of pts) ctx.lineTo(p[0], p[1]);
      ctx.stroke();

      // current tracing dot
      const px = cx + 2 * a0 * Math.cos(t) - a0 * Math.cos(2 * t);
      const py = cy + 2 * a0 * Math.sin(t) - a0 * Math.sin(2 * t);
      ctx.fillStyle = palette.signal.cyan;
      ctx.beginPath();
      ctx.arc(px, py, 3 * dpr, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawMandelbrot = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.fillStyle = palette.canvas.bg;
      ctx.fillRect(0, 0, W, H);

      // Render the Mandelbrot set quickly.
      const cx = W / 2;
      const cy = H / 2;
      const scale = Math.min(W, H) / 3.4;
      const reCenter = -0.55;
      const imCenter = 0;

      // Recompute the escape-time pixels only when the canvas size changes;
      // otherwise reuse the cached ImageData.
      const key = `${W}x${H}`;
      if (!mandelData || mandelKey !== key) {
        const maxIter = 40;
        const imgData = ctx.createImageData(W, H);
        const data = imgData.data;
        for (let py = 0; py < H; py++) {
          for (let px = 0; px < W; px++) {
            const cre = reCenter + (px - cx) / scale;
            const cim = imCenter + (py - cy) / scale;
            let x = 0,
              y = 0;
            let it = 0;
            while (x * x + y * y < 4 && it < maxIter) {
              const xt = x * x - y * y + cre;
              y = 2 * x * y + cim;
              x = xt;
              it++;
            }
            const idx = (py * W + px) * 4;
            if (it === maxIter) {
              data[idx] = 5;
              data[idx + 1] = 6;
              data[idx + 2] = 12;
            } else {
              const v = it / maxIter;
              data[idx] = Math.floor(20 + v * 80);
              data[idx + 1] = Math.floor(8 + v * 30);
              data[idx + 2] = Math.floor(30 + v * 100);
            }
            data[idx + 3] = 255;
          }
        }
        mandelData = imgData;
        mandelKey = key;
      }
      ctx.putImageData(mandelData, 0, 0);

      // Overlay the main cardioid in amber
      ctx.strokeStyle = palette.signal.amber;
      ctx.lineWidth = 2 * dpr;
      ctx.beginPath();
      const steps = 256;
      for (let i = 0; i <= steps; i++) {
        const theta = (i / steps) * Math.PI * 2;
        // c(t) = (1/2) e^{it} - (1/4) e^{2it}
        const cre = 0.5 * Math.cos(theta) - 0.25 * Math.cos(2 * theta);
        const cim = 0.5 * Math.sin(theta) - 0.25 * Math.sin(2 * theta);
        const px = cx + (cre - reCenter) * scale;
        const py = cy + (cim - imCenter) * scale;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    };

    const loop = () => {
      const cfg = cfgRef.current;
      const W = canvas.width;
      const H = canvas.height;
      const reduce = reduceMotion?.matches ?? false;

      if (cfg.mode === "rolling") {
        // Freeze the rolling animation to a single static frame under
        // prefers-reduced-motion (and while paused); otherwise advance t.
        const animating = cfg.running && cfg.rolling && !reduce;
        if (animating) {
          tRef.current = (tRef.current + 0.012) % (Math.PI * 2);
          drawRolling();
        } else {
          const sig = `rolling|${W}x${H}`;
          if (dirty || sig !== lastSig) {
            drawRolling();
            lastSig = sig;
            dirty = false;
          }
        }
      } else if (cfg.mode === "cup") {
        const sig = `cup|${W}x${H}|${cfg.rayCount}|${cfg.showRays}|${cfg.showCardioid}`;
        if (dirty || sig !== lastSig) {
          drawCup();
          lastSig = sig;
          dirty = false;
        }
      } else {
        const sig = `mandel|${W}x${H}`;
        if (dirty || sig !== lastSig) {
          drawMandelbrot();
          lastSig = sig;
          dirty = false;
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [dpr]);

  return (
    <main className="flex min-h-screen flex-col pt-14">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_420px]">
        <div className="relative min-h-[60vh] bg-ink-950 lg:min-h-[calc(100vh-3.5rem)]">
          <canvas
            ref={canvasRef}
            className="absolute inset-0 block h-full w-full"
            aria-label={
              mode === "cup"
                ? "Coffee cup optics: parallel rays reflecting off the far wall to a nephroid envelope"
                : mode === "rolling"
                  ? "A point on a rolling circle tracing a cardioid"
                  : "The Mandelbrot set with its main cardioid bulb outlined"
            }
          />
          <div className="pointer-events-none absolute left-4 right-4 top-4 flex items-start justify-between gap-3">
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              {mode === "cup"
                ? "Optics · parallel rays in a cup"
                : mode === "rolling"
                  ? "Rolling circle · cardioid trace"
                  : "Mandelbrot · main cardioid"}
            </div>
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
              r = 2a (1 − cos θ)
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

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              View
            </div>
            <div className="grid grid-cols-1 gap-2">
              {(
                [
                  { id: "cup", label: "Coffee cup", note: "rays + envelope" },
                  { id: "rolling", label: "Rolling circle", note: "cardioid traced" },
                  { id: "mandelbrot", label: "Mandelbrot bulb", note: "the heart of M" },
                ] as const
              ).map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`rounded-md border px-3 py-2 text-left transition-colors ${
                    mode === m.id
                      ? "border-signal-amber/60 bg-signal-amber/10 text-signal-amber"
                      : "hairline text-ink-200 hover:border-signal-amber/40 hover:text-signal-amber"
                  }`}
                >
                  <div className="font-mono text-xs">{m.label}</div>
                  <div className="mt-0.5 font-mono text-[10px] text-ink-400">{m.note}</div>
                </button>
              ))}
            </div>
          </div>

          {mode === "cup" && (
            <div className="hairline space-y-4 border-b p-5">
              <div className="space-y-1">
                <div className="flex items-baseline justify-between">
                  <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                    Rays
                  </div>
                  <div className="font-mono text-[10px] text-ink-400">{rayCount}</div>
                </div>
                <input
                  type="range"
                  value={rayCount}
                  min={20}
                  max={300}
                  step={2}
                  onChange={(e) => setRayCount(parseInt(e.target.value))}
                  aria-label="Number of rays"
                  className="w-full accent-signal-amber"
                />
              </div>
              <label className="flex cursor-pointer items-center gap-2 font-mono text-[11px] text-ink-300">
                <input
                  type="checkbox"
                  checked={showRays}
                  onChange={(e) => setShowRays(e.target.checked)}
                  className="accent-signal-amber"
                />
                <span>Show rays</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2 font-mono text-[11px] text-ink-300">
                <input
                  type="checkbox"
                  checked={showCardioid}
                  onChange={(e) => setShowCardioid(e.target.checked)}
                  className="accent-signal-amber"
                />
                <span>Show envelope (nephroid for parallel rays)</span>
              </label>
              <p className="font-mono text-[10px] leading-relaxed text-ink-400">
                Parallel rays give a nephroid (two cusps). A point source on the rim gives a
                cardioid.
              </p>
            </div>
          )}

          {mode === "rolling" && (
            <div className="hairline space-y-4 border-b p-5">
              <button
                onClick={() => setRunning((v) => !v)}
                className={`w-full rounded-md border py-2 font-mono text-[10px] uppercase tracking-widest2 transition-colors ${
                  running
                    ? "border-signal-rose/60 bg-signal-rose/10 text-signal-rose"
                    : "border-signal-amber/60 bg-signal-amber/10 text-signal-amber"
                }`}
              >
                {running ? "❚❚ Pause" : "▶ Roll"}
              </button>
              <p className="font-mono text-[10px] leading-relaxed text-ink-400">
                The dot is fixed on the outer rolling circle. Its trace is the cardioid.
              </p>
            </div>
          )}

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
