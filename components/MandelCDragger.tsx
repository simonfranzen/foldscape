"use client";

import { useEffect, useRef, useState } from "react";
import { getDpr } from "@/lib/hooks/useDpr";
import { palette } from "@/lib/visual/palette";

// Interactive c-picker. The user drags a point on a small complex plane;
// the orbit of z₀ = 0 under zₙ₊₁ = zₙ² + c animates live, and the panel
// reports whether c is in the set (orbit bounded) or out (orbit escapes).

interface Props {
  label?: string;
  accent?: string; // tailwind text colour class
  initialC?: [number, number];
  bound?: number; // half-width of the complex plane in the canvas
  maxSteps?: number;
  speedMs?: number;
  showSilhouette?: boolean;
  // Localized status text. Defaults keep the component usable standalone.
  statusEscaped?: (n: number) => string;
  statusBounded?: (n: number) => string;
}

const ESCAPE_RADIUS = 2.0;
const PLOT_RADIUS = 4.5;

// Cheap silhouette test: is c likely in the Mandelbrot set?
// Used only to colour the background rough cardioid + period-2 bulb so
// the user has a visual hint of where they are dragging.
function quickInSet(cx: number, cy: number): boolean {
  // main cardioid
  const q = (cx - 0.25) * (cx - 0.25) + cy * cy;
  if (q * (q + (cx - 0.25)) < 0.25 * cy * cy) return true;
  // period-2 bulb on the left
  if ((cx + 1) * (cx + 1) + cy * cy < 0.0625) return true;
  return false;
}

export function MandelCDragger({
  label = "drag the dot · pick a c",
  accent = "text-signal-amber",
  initialC = [-0.745, 0.113],
  bound = 1.8,
  maxSteps = 200,
  speedMs = 80,
  showSilhouette = true,
  statusEscaped = (n) => `escaped @ ${n}`,
  statusBounded = (n) => `bounded · step ${n}`,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const cRef = useRef<[number, number]>(initialC);
  const draggingRef = useRef(false);
  const [tick, setTick] = useState(0);
  const [escaped, setEscaped] = useState(false);
  const [steps, setSteps] = useState(0);
  const [reduced, setReduced] = useState(false);

  // Honour prefers-reduced-motion: freeze the animation and draw one static
  // frame. Re-subscribe so a live preference change flips the mode.
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
    const onChange = () => setReduced(m.matches);
    m.addEventListener?.("change", onChange);
    return () => m.removeEventListener?.("change", onChange);
  }, []);

  // Coordinate helpers depend on canvas size at draw time; we compute them
  // inside the loop. Pointer handlers below need the inverse.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    let last = performance.now();
    let acc = 0;
    let stepIndex = 0;
    let orbit: Array<[number, number]> = [[0, 0]];
    let escapedLocal = false;

    const resize = () => {
      const dpr = getDpr();
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const W = () => canvas.clientWidth;
    const H = () => canvas.clientHeight;
    const px = (x: number) => W() / 2 + (x / bound) * (Math.min(W(), H()) / 2);
    const py = (y: number) => H() / 2 - (y / bound) * (Math.min(W(), H()) / 2);

    const restart = () => {
      orbit = [[0, 0]];
      stepIndex = 0;
      escapedLocal = false;
      setEscaped(false);
      setSteps(0);
    };

    const step = () => {
      if (escapedLocal) return;
      const c = cRef.current;
      const [zx, zy] = orbit[orbit.length - 1];
      const nx = zx * zx - zy * zy + c[0];
      const ny = 2 * zx * zy + c[1];
      const r = Math.hypot(nx, ny);
      orbit.push([nx, ny]);
      stepIndex++;
      setSteps(stepIndex);
      if (r > ESCAPE_RADIUS) {
        escapedLocal = true;
        setEscaped(true);
        // restart automatically after a brief moment
        window.setTimeout(restart, 900);
        return;
      }
      if (stepIndex >= maxSteps) {
        // bounded run finished — quick reset for visual rhythm
        window.setTimeout(restart, 600);
      }
    };

    const draw = () => {
      const w = W();
      const h = H();
      ctx.fillStyle = palette.canvas.bg;
      ctx.fillRect(0, 0, w, h);

      // soft silhouette of the set
      if (showSilhouette) {
        const size = 64;
        const img = ctx.createImageData(size, size);
        for (let yy = 0; yy < size; yy++) {
          for (let xx = 0; xx < size; xx++) {
            const cx = ((xx + 0.5) / size - 0.5) * 2 * bound;
            const cy = -((yy + 0.5) / size - 0.5) * 2 * bound;
            const i = (yy * size + xx) * 4;
            if (quickInSet(cx, cy)) {
              img.data[i] = 60;
              img.data[i + 1] = 50;
              img.data[i + 2] = 30;
              img.data[i + 3] = 90;
            } else {
              img.data[i + 3] = 0;
            }
          }
        }
        // draw via temp canvas to scale up
        const tmp = document.createElement("canvas");
        tmp.width = size;
        tmp.height = size;
        tmp.getContext("2d")!.putImageData(img, 0, 0);
        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(tmp, 0, 0, w, h);
      }

      // axes
      ctx.strokeStyle = "rgba(138,144,164,0.18)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.moveTo(w / 2, 0);
      ctx.lineTo(w / 2, h);
      ctx.stroke();

      // unit circle
      ctx.strokeStyle = "rgba(138,144,164,0.22)";
      ctx.beginPath();
      ctx.arc(px(0), py(0), (1 / bound) * (Math.min(w, h) / 2), 0, Math.PI * 2);
      ctx.stroke();

      // orbit polyline
      const grad = ctx.createLinearGradient(0, 0, w, 0);
      grad.addColorStop(0, "rgba(179, 136, 255, 0.0)");
      grad.addColorStop(1, escapedLocal ? "rgba(255, 90, 110, 0.95)" : "rgba(179, 136, 255, 0.95)");
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      for (let i = 0; i < orbit.length; i++) {
        const [x, y] = orbit[i];
        const sx = px(x);
        const sy = py(y);
        if (Math.abs(x) > PLOT_RADIUS || Math.abs(y) > PLOT_RADIUS) continue;
        if (i === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.stroke();

      // orbit dots
      for (let i = 0; i < orbit.length; i++) {
        const [x, y] = orbit[i];
        if (Math.abs(x) > PLOT_RADIUS || Math.abs(y) > PLOT_RADIUS) continue;
        const t = i / Math.max(1, orbit.length - 1);
        const hue = escapedLocal ? 350 + t * 20 : 200 + t * 100;
        ctx.fillStyle = `hsla(${hue}, 80%, ${55 + t * 20}%, ${0.4 + t * 0.6})`;
        ctx.beginPath();
        ctx.arc(px(x), py(y), 2 + t * 1.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // c marker
      const c = cRef.current;
      ctx.fillStyle = palette.signal.amber;
      ctx.beginPath();
      ctx.arc(px(c[0]), py(c[1]), 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,209,102,0.5)";
      ctx.beginPath();
      ctx.arc(px(c[0]), py(c[1]), 9, 0, Math.PI * 2);
      ctx.stroke();
      ctx.font = "11px ui-monospace, monospace";
      ctx.fillStyle = "rgba(230,232,240,0.85)";
      ctx.fillText("c", px(c[0]) + 10, py(c[1]) - 8);
    };

    // Reduced motion: run the whole orbit once (stopping at escape) and draw a
    // single static frame instead of the continuous animation.
    const renderStatic = () => {
      const c = cRef.current;
      orbit = [[0, 0]];
      escapedLocal = false;
      let esc = false;
      let n = 0;
      for (let k = 0; k < maxSteps; k++) {
        const [zx, zy] = orbit[orbit.length - 1];
        const nx = zx * zx - zy * zy + c[0];
        const ny = 2 * zx * zy + c[1];
        orbit.push([nx, ny]);
        n = k + 1;
        if (Math.hypot(nx, ny) > ESCAPE_RADIUS) {
          esc = true;
          break;
        }
      }
      escapedLocal = esc;
      setEscaped(esc);
      setSteps(n);
      draw();
    };

    // When c moves (pointer or keyboard) re-seed for the current mode.
    const applyC = () => {
      if (reduced) renderStatic();
      else restart();
    };

    resize();
    const ro = new ResizeObserver(() => {
      resize();
      if (reduced) renderStatic();
    });
    ro.observe(canvas);

    const loop = (now: number) => {
      acc += now - last;
      last = now;
      while (acc >= speedMs) {
        acc -= speedMs;
        step();
      }
      draw();
      raf = requestAnimationFrame(loop);
    };

    // pointer handling
    const toPlane = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const s = Math.min(rect.width, rect.height) / 2;
      const px2 = ((x - rect.width / 2) / s) * bound;
      const py2 = (-(y - rect.height / 2) / s) * bound;
      return [px2, py2] as [number, number];
    };
    const setC = (clientX: number, clientY: number) => {
      cRef.current = toPlane(clientX, clientY);
      applyC();
      setTick((t) => t + 1);
    };
    const onDown = (e: PointerEvent) => {
      draggingRef.current = true;
      canvas.setPointerCapture(e.pointerId);
      setC(e.clientX, e.clientY);
    };
    const onMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      setC(e.clientX, e.clientY);
    };
    const onUp = (e: PointerEvent) => {
      draggingRef.current = false;
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch {
        // pointer might already be released; safe to ignore.
      }
    };
    // Keyboard operability: arrow keys nudge c (Shift for a coarser step) so
    // the picker works without a pointer.
    const onKey = (e: KeyboardEvent) => {
      const nudge = (e.shiftKey ? 0.1 : 0.02) * bound;
      let [x, y] = cRef.current;
      if (e.key === "ArrowLeft") x -= nudge;
      else if (e.key === "ArrowRight") x += nudge;
      else if (e.key === "ArrowUp") y += nudge;
      else if (e.key === "ArrowDown") y -= nudge;
      else return;
      e.preventDefault();
      cRef.current = [x, y];
      applyC();
      setTick((t) => t + 1);
    };
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    canvas.addEventListener("keydown", onKey);

    if (reduced) {
      renderStatic();
    } else {
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      canvas.removeEventListener("keydown", onKey);
    };
  }, [bound, maxSteps, speedMs, showSilhouette, reduced]);

  const c = cRef.current;
  // re-render text on tick
  void tick;
  return (
    <div ref={wrapRef} className="hairline space-y-2 rounded-2xl border bg-ink-950/40 p-4">
      <div className={`font-mono text-[10px] uppercase tracking-widest2 ${accent}`}>{label}</div>
      <div className="hairline aspect-square w-full cursor-crosshair touch-none overflow-hidden rounded-md border bg-ink-950">
        <canvas
          ref={canvasRef}
          tabIndex={0}
          role="img"
          aria-label={label}
          className="block h-full w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-coral"
        />
      </div>
      <div className="flex items-center justify-between font-mono text-[10px] text-ink-300">
        <span>
          c = {c[0].toFixed(3)} {c[1] >= 0 ? "+" : "−"} {Math.abs(c[1]).toFixed(3)}i
        </span>
        <span className={escaped ? "text-signal-rose" : "text-signal-violet"}>
          {escaped ? statusEscaped(steps) : statusBounded(steps)}
        </span>
      </div>
    </div>
  );
}
