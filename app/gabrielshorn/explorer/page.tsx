"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";

const X_MIN = 1;
const LOG_X_MAX_MIN = Math.log10(1.5);
const LOG_X_MAX_MAX = Math.log10(1000);

// Simpson's rule with N subintervals (N even). Computes the exact lateral
// surface area integral A = 2π ∫₁^{xMax} (1/x) · √(1 + 1/x⁴) dx.
function surfaceArea(xMax: number, N = 2000): number {
  if (xMax <= X_MIN) return 0;
  const a = X_MIN;
  const b = xMax;
  const n = N % 2 === 0 ? N : N + 1;
  const h = (b - a) / n;
  const f = (x: number) => (1 / x) * Math.sqrt(1 + 1 / (x * x * x * x));
  let sum = f(a) + f(b);
  for (let i = 1; i < n; i++) {
    const x = a + i * h;
    sum += (i % 2 === 0 ? 2 : 4) * f(x);
  }
  return 2 * Math.PI * (h / 3) * sum;
}

// Display a number with 6 significant digits.
function sig6(x: number): string {
  if (!Number.isFinite(x)) return "∞";
  if (x === 0) return "0";
  return x.toPrecision(6);
}

export default function GabrielsHornExplorer() {
  const { a, u } = useI18n();
  const topic = a.topics.gabrielshorn;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [logXMax, setLogXMax] = useState<number>(Math.log10(10));
  const [epsilon, setEpsilon] = useState<number>(0.01);
  const [animate, setAnimate] = useState<boolean>(false);
  const [view, setView] = useState<"3d" | "2d">("3d");
  const [spin, setSpin] = useState<boolean>(true);
  const animRef = useRef<number | null>(null);

  // 3D rotation state.
  const yawRef = useRef(0.7);
  const pitchRef = useRef(0.25);
  const draggingRef = useRef(false);
  const lastRef = useRef({ x: 0, y: 0 });

  const xMax = Math.pow(10, logXMax);

  // Animate growth: smoothly cycle xMax through the slider range.
  useEffect(() => {
    if (!animate) {
      if (animRef.current !== null) {
        cancelAnimationFrame(animRef.current);
        animRef.current = null;
      }
      return;
    }
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setLogXMax((prev) => {
        const next = prev + dt * 0.25; // logarithmic units per second
        if (next > LOG_X_MAX_MAX) return LOG_X_MAX_MIN;
        return next;
      });
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => {
      if (animRef.current !== null) cancelAnimationFrame(animRef.current);
      animRef.current = null;
    };
  }, [animate]);

  // 2D side-view renderer.
  useEffect(() => {
    if (view !== "2d") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const render = () => {
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Background
      ctx.fillStyle = "#06070d";
      ctx.fillRect(0, 0, W, H);

      // Layout: leave a small left margin for the y-axis labels and a
      // bottom margin for the x-axis labels.
      const padL = 44;
      const padR = 16;
      const padT = 16;
      const padB = 28;
      const plotW = W - padL - padR;
      const plotH = H - padT - padB;

      // Mapping: x in [1, xMax] -> [padL, padL + plotW]; y in [-1, 1] -> [padT, padT + plotH]
      const toPx = (x: number) => padL + ((x - X_MIN) / (xMax - X_MIN)) * plotW;
      const toPy = (y: number) => padT + ((1 - y) / 2) * plotH;

      // Gridlines
      ctx.strokeStyle = "rgba(138,144,164,0.10)";
      ctx.lineWidth = 1;
      // Horizontal y-grid at -1, -0.5, 0, 0.5, 1
      const yTicks = [-1, -0.5, 0, 0.5, 1];
      ctx.beginPath();
      for (const y of yTicks) {
        const py = toPy(y);
        ctx.moveTo(padL, py);
        ctx.lineTo(padL + plotW, py);
      }
      ctx.stroke();

      // Vertical x-grid: choose ~6 logarithmically spaced ticks
      const xTicks: number[] = [];
      const decades = Math.log10(xMax);
      if (decades <= 1.5) {
        const step = Math.max(1, Math.round((xMax - 1) / 5));
        for (let v = 1; v <= xMax; v += step) xTicks.push(v);
        if (xTicks[xTicks.length - 1] !== xMax) xTicks.push(xMax);
      } else {
        for (let d = 0; d <= Math.floor(decades) + 1; d++) {
          const v = Math.pow(10, d);
          if (v >= 1 && v <= xMax) xTicks.push(v);
        }
        if (xTicks[xTicks.length - 1] !== xMax) xTicks.push(xMax);
      }
      ctx.beginPath();
      for (const v of xTicks) {
        const px = toPx(v);
        ctx.moveTo(px, padT);
        ctx.lineTo(px, padT + plotH);
      }
      ctx.stroke();

      // Axes
      ctx.strokeStyle = "rgba(138,144,164,0.45)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      // x-axis at y=0
      ctx.moveTo(padL, toPy(0));
      ctx.lineTo(padL + plotW, toPy(0));
      // y-axis at x = X_MIN
      ctx.moveTo(padL, padT);
      ctx.lineTo(padL, padT + plotH);
      ctx.stroke();

      // Axis labels
      ctx.fillStyle = "rgba(200,205,220,0.7)";
      ctx.font = "10px ui-monospace, monospace";
      for (const y of yTicks) {
        const py = toPy(y);
        ctx.fillText(y.toFixed(1), 6, py + 3);
      }
      for (const v of xTicks) {
        const px = toPx(v);
        const label = v >= 100 ? v.toExponential(0) : v.toFixed(v < 10 ? 1 : 0);
        ctx.fillText(label, px - 8, H - padB + 14);
      }

      // Build the horn boundary polyline (in plot coords).
      // Sample x logarithmically across [1, xMax] for visual fidelity.
      const SAMPLES = 600;
      type P = { x: number; yTop: number; yBot: number };
      const pts: P[] = new Array(SAMPLES + 1);
      const lx0 = Math.log(X_MIN);
      const lx1 = Math.log(xMax);
      for (let i = 0; i <= SAMPLES; i++) {
        const lx = lx0 + ((lx1 - lx0) * i) / SAMPLES;
        const x = Math.exp(lx);
        const y = 1 / x;
        pts[i] = { x, yTop: y, yBot: -y };
      }

      // Filled interior with a gradient ("paint").
      const grad = ctx.createLinearGradient(padL, toPy(1), padL, toPy(-1));
      grad.addColorStop(0, "rgba(255, 209, 102, 0.18)");
      grad.addColorStop(0.5, "rgba(255, 209, 102, 0.34)");
      grad.addColorStop(1, "rgba(255, 209, 102, 0.18)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(toPx(pts[0].x), toPy(pts[0].yTop));
      for (let i = 1; i <= SAMPLES; i++) ctx.lineTo(toPx(pts[i].x), toPy(pts[i].yTop));
      for (let i = SAMPLES; i >= 0; i--) ctx.lineTo(toPx(pts[i].x), toPy(pts[i].yBot));
      ctx.closePath();
      ctx.fill();

      // Boundary curves.
      ctx.strokeStyle = "rgba(255, 209, 102, 0.95)";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      for (let i = 0; i <= SAMPLES; i++) {
        const px = toPx(pts[i].x);
        const py = toPy(pts[i].yTop);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.beginPath();
      for (let i = 0; i <= SAMPLES; i++) {
        const px = toPx(pts[i].x);
        const py = toPy(pts[i].yBot);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Cap at the cutoff: a vertical line at x = xMax between -1/xMax and 1/xMax
      ctx.strokeStyle = "rgba(125, 243, 255, 0.7)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(toPx(xMax), toPy(1 / xMax));
      ctx.lineTo(toPx(xMax), toPy(-1 / xMax));
      ctx.stroke();

      // Cutoff label
      ctx.fillStyle = "#7df3ff";
      ctx.font = "11px ui-monospace, monospace";
      const cutLabel = `x_max = ${sig6(xMax)}`;
      const lblX = Math.min(toPx(xMax) - 6, padL + plotW - 110);
      ctx.fillText(cutLabel, Math.max(padL + 4, lblX), padT + 12);
    };

    render();
    const ro = new ResizeObserver(render);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [xMax, view]);

  // 3D mesh renderer (solid of revolution). Auto-spins; drag to rotate.
  useEffect(() => {
    if (view !== "3d") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
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

    // Parametric mesh: x ∈ [1, xMax] log-spaced, θ ∈ [0, 2π].
    const Nx = 56;
    const Nt = 36;
    const xs: number[] = [];
    const lnA = Math.log(1);
    const lnB = Math.log(xMax);
    for (let i = 0; i <= Nx; i++) {
      const t = i / Nx;
      xs.push(Math.exp(lnA + (lnB - lnA) * t));
    }

    // First full clear for crisp first frame.
    ctx.fillStyle = "#06070d";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      // Slight trail clear for motion blur.
      ctx.fillStyle = "rgba(6, 7, 13, 0.28)";
      ctx.fillRect(0, 0, W, H);

      const yaw = yawRef.current;
      const pitch = pitchRef.current;
      const cy = Math.cos(yaw);
      const sy = Math.sin(yaw);
      const cp = Math.cos(pitch);
      const sp = Math.sin(pitch);

      // Centre the horn in the canvas, scale so the horn fits.
      // For log-mapped xMax the visible body extent in projected x is ~ln(xMax)+1.
      const bodyExtent = Math.max(2, Math.log(xMax) + 2);
      const scale = Math.min(W / (bodyExtent + 2), H / 3.5);
      const ox = W * 0.22;
      const oy = H / 2;

      // 3D project: rotate yaw around y-axis, then pitch around x-axis.
      // We compress along x logarithmically so very long horns still fit.
      const project = (x: number, y: number, z: number): [number, number, number] => {
        const xc = Math.log(x); // log-compressed axial coordinate, 0 at x=1
        const xr = cy * xc + sy * z;
        const zr = -sy * xc + cy * z;
        const yr = cp * y - sp * zr;
        const zr2 = sp * y + cp * zr;
        const depth = 8 + zr2;
        const k = 8 / Math.max(0.2, depth);
        return [ox + xr * scale * k, oy - yr * scale * k, zr2];
      };

      // Rings (circular cross sections).
      const ringStep = Math.max(2, Math.floor(Nx / 20));
      for (let i = 0; i <= Nx; i += ringStep) {
        const x = xs[i];
        const r = 1 / x;
        ctx.lineWidth = 0.8 * dpr;
        ctx.beginPath();
        for (let j = 0; j <= Nt; j++) {
          const theta = (j / Nt) * Math.PI * 2;
          const y = r * Math.cos(theta);
          const z = r * Math.sin(theta);
          const [px, py] = project(x, y, z);
          if (j === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        const t = i / Nx;
        const cr = Math.floor(255 + (179 - 255) * t);
        const cg = Math.floor(209 + (136 - 209) * t);
        const cb = Math.floor(102 + (255 - 102) * t);
        ctx.strokeStyle = `rgba(${cr}, ${cg}, ${cb}, ${0.22 + 0.5 * (1 - t)})`;
        ctx.stroke();
      }

      // Longitudinal ribs.
      const ribs = 14;
      for (let j = 0; j < ribs; j++) {
        const theta = (j / ribs) * Math.PI * 2;
        ctx.lineWidth = 0.9 * dpr;
        ctx.beginPath();
        for (let i = 0; i <= Nx; i++) {
          const x = xs[i];
          const r = 1 / x;
          const y = r * Math.cos(theta);
          const z = r * Math.sin(theta);
          const [px, py] = project(x, y, z);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        const facing = Math.cos(theta + yaw);
        const alpha = 0.2 + 0.45 * Math.max(0, facing);
        ctx.strokeStyle = `rgba(255, 209, 102, ${alpha})`;
        ctx.stroke();
      }

      // Axis indicator (dashed pink, runs through center).
      ctx.strokeStyle = "rgba(255, 122, 182, 0.35)";
      ctx.lineWidth = 0.8 * dpr;
      ctx.setLineDash([4 * dpr, 4 * dpr]);
      ctx.beginPath();
      const [ax0, ay0] = project(1, 0, 0);
      const [ax1, ay1] = project(xMax, 0, 0);
      ctx.moveTo(ax0, ay0);
      ctx.lineTo(ax1, ay1);
      ctx.stroke();
      ctx.setLineDash([]);

      // Cap at the mouth (x = 1, disc of radius 1).
      ctx.strokeStyle = "rgba(255, 209, 102, 0.85)";
      ctx.lineWidth = 1.2 * dpr;
      ctx.beginPath();
      for (let j = 0; j <= 60; j++) {
        const theta = (j / 60) * Math.PI * 2;
        const y = Math.cos(theta);
        const z = Math.sin(theta);
        const [px, py] = project(1, y, z);
        if (j === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Cap at the cutoff x = xMax (radius 1/xMax) — cyan to match 2D mode.
      const rEnd = 1 / xMax;
      ctx.strokeStyle = "rgba(125, 243, 255, 0.9)";
      ctx.lineWidth = 1.4 * dpr;
      ctx.beginPath();
      for (let j = 0; j <= 60; j++) {
        const theta = (j / 60) * Math.PI * 2;
        const y = rEnd * Math.cos(theta);
        const z = rEnd * Math.sin(theta);
        const [px, py] = project(xMax, y, z);
        if (j === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Auto-spin if not dragging and spin is enabled.
      if (!draggingRef.current && spin) yawRef.current += 0.004;

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [xMax, view, spin]);

  // Window-level drag listeners (only active when view is 3D).
  useEffect(() => {
    if (view !== "3d") return;
    const onMove = (e: MouseEvent) => {
      if (!draggingRef.current) return;
      const dx = e.clientX - lastRef.current.x;
      const dy = e.clientY - lastRef.current.y;
      lastRef.current = { x: e.clientX, y: e.clientY };
      yawRef.current += dx * 0.01;
      pitchRef.current = Math.max(-0.9, Math.min(0.9, pitchRef.current + dy * 0.01));
    };
    const onUp = () => {
      draggingRef.current = false;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      draggingRef.current = false;
    };
  }, [view]);

  const onCanvasMouseDown = (e: React.MouseEvent) => {
    if (view !== "3d") return;
    draggingRef.current = true;
    lastRef.current = { x: e.clientX, y: e.clientY };
  };

  const resetRotation = () => {
    yawRef.current = 0.7;
    pitchRef.current = 0.25;
  };

  const V = Math.PI * (1 - 1 / xMax);
  const A = surfaceArea(xMax);
  const ALow = 2 * Math.PI * Math.log(xMax);
  const paintVol = A * epsilon;

  return (
    <main className="flex min-h-screen flex-col pt-14">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_420px]">
        <div className="relative flex min-h-[60vh] flex-col gap-4 bg-ink-950 p-4 lg:min-h-[calc(100vh-3.5rem)] lg:p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              {view === "3d"
                ? "Solid of revolution · drag to rotate"
                : "Side view · y = ±1/x  ·  x ∈ [1, x_max]"}
            </div>
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
              V → π · A → ∞
            </div>
          </div>
          <div className="hairline flex-1 overflow-hidden rounded-2xl border bg-ink-950">
            <canvas
              ref={canvasRef}
              className={`block h-full w-full ${view === "3d" ? "cursor-grab active:cursor-grabbing" : ""}`}
              onMouseDown={onCanvasMouseDown}
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
              View
            </div>
            <div className="flex items-center gap-2">
              <div className="hairline inline-flex overflow-hidden rounded-md border">
                <button
                  onClick={() => setView("3d")}
                  className={`px-3 py-1 font-mono text-[10px] uppercase tracking-widest2 transition-colors ${
                    view === "3d"
                      ? "bg-signal-amber/15 text-signal-amber"
                      : "text-ink-300 hover:text-ink-100"
                  }`}
                >
                  3D
                </button>
                <button
                  onClick={() => setView("2d")}
                  className={`hairline border-l px-3 py-1 font-mono text-[10px] uppercase tracking-widest2 transition-colors ${
                    view === "2d"
                      ? "bg-signal-amber/15 text-signal-amber"
                      : "text-ink-300 hover:text-ink-100"
                  }`}
                >
                  2D
                </button>
              </div>
              {view === "3d" && (
                <>
                  <button
                    onClick={() => setSpin((v) => !v)}
                    className={`rounded-md border px-3 py-1 font-mono text-[10px] uppercase tracking-widest2 transition-colors ${
                      spin
                        ? "border-signal-amber/60 bg-signal-amber/10 text-signal-amber"
                        : "hairline text-ink-200 hover:border-signal-amber/40 hover:text-ink-100"
                    }`}
                  >
                    {spin ? "Spin" : "Hold"}
                  </button>
                  <button
                    onClick={resetRotation}
                    className="hairline rounded-md border px-3 py-1 font-mono text-[10px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-signal-amber/40 hover:text-ink-100"
                  >
                    Reset
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="hairline space-y-4 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              x_max — cutoff (log scale)
            </div>
            <div className="flex items-center justify-between font-mono text-sm">
              <span className="text-signal-amber">{sig6(xMax)}</span>
              <button
                onClick={() => setAnimate((v) => !v)}
                className={`rounded-md border px-3 py-1 font-mono text-[10px] uppercase tracking-widest2 transition-colors ${
                  animate
                    ? "border-signal-amber/60 bg-signal-amber/10 text-signal-amber"
                    : "hairline text-ink-200 hover:border-signal-amber/40 hover:text-ink-100"
                }`}
              >
                {animate ? "Stop" : "Animate growth"}
              </button>
            </div>
            <input
              type="range"
              value={logXMax}
              min={LOG_X_MAX_MIN}
              max={LOG_X_MAX_MAX}
              step={0.001}
              onChange={(e) => setLogXMax(parseFloat(e.target.value))}
              className="w-full accent-signal-amber"
            />
            <div className="flex justify-between font-mono text-[10px] text-ink-400">
              <span>1.5</span>
              <span>10</span>
              <span>100</span>
              <span>1000</span>
            </div>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Live values
            </div>
            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 font-mono text-xs">
              <span className="text-ink-300">V (cut)</span>
              <span className="text-signal-amber">π · (1 − 1/x_max) = {sig6(V)}</span>

              <span className="text-ink-300">A (exact)</span>
              <span className="text-signal-amber">{sig6(A)}</span>

              <span className="text-ink-300">A ≥ 2π ln(x_max)</span>
              <span className="text-ink-200">{sig6(ALow)}</span>

              <span className="text-ink-300">V / π</span>
              <span className="text-ink-200">{sig6(V / Math.PI)}</span>
            </div>
            <p className="pt-2 text-[11px] leading-relaxed text-ink-400">
              As x_max → ∞: V → π (finite), A → ∞ (the harmonic integral diverges). The lower bound
              2π · ln(x_max) makes the divergence visible.
            </p>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Painter's paradox
            </div>
            <div className="flex items-center justify-between font-mono text-sm">
              <span className="text-ink-300">ε (paint thickness)</span>
              <span className="text-signal-amber">{sig6(epsilon)}</span>
            </div>
            <input
              type="range"
              value={epsilon}
              min={0.001}
              max={0.1}
              step={0.001}
              onChange={(e) => setEpsilon(parseFloat(e.target.value))}
              className="w-full accent-signal-amber"
            />
            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 font-mono text-xs">
              <span className="text-ink-300">Paint to coat at ε</span>
              <span className="text-signal-amber">A · ε = {sig6(paintVol)}</span>
              <span className="text-ink-300">Paint to fill (V)</span>
              <span className="text-ink-200">{sig6(V)}</span>
            </div>
            <p className="pt-1 text-[11px] leading-relaxed text-ink-400">
              Honest paint has nonzero thickness. Over an infinite surface that already costs
              infinite volume — and the paradox dissolves.
            </p>
          </div>

          <div className="p-5">
            <Link
              href="/gabrielshorn"
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
