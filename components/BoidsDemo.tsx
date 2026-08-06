"use client";

import { useEffect, useRef, useState } from "react";
import { getDpr } from "@/lib/hooks/useDpr";
import { palette } from "@/lib/visual/palette";

// rgba() from a palette hex so the canvas shares tokens instead of re-encoding
// channel values inline.
const rgba = (hex: string, alpha: number) => {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

interface Props {
  count?: number;
  className?: string;
  // Label for the reset button. Defaults to EN; pass a locale-aware string
  // from the story page (e.g. "Neu starten" in DE).
  resetLabel?: string;
  // Accessible description of the canvas. Pass a locale-aware string.
  ariaLabel?: string;
}

export function BoidsDemo({
  count = 120,
  className = "",
  resetLabel = "Restart",
  ariaLabel = "Boids flocking animation",
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // Freeze the swarm for motion-sensitive users (CLAUDE.md: per-component
  // canvases check the media query and freeze).
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener?.("change", on);
    return () => mq.removeEventListener?.("change", on);
  }, []);
  // Bumping this tears down + restarts the simulation effect — flocks
  // re-seed from random positions so the user can watch the swarm form
  // from scratch.
  const [resetTick, setResetTick] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let dpr = getDpr();

    const resize = () => {
      dpr = getDpr();
      canvas.width = Math.floor(canvas.clientWidth * dpr);
      canvas.height = Math.floor(canvas.clientHeight * dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // ResizeObserver misses a pure DPR change (browser zoom, moving to a
    // monitor with a different devicePixelRatio), so watch it explicitly and
    // re-subscribe with the new DPR each time (a fixed MQ matches only one).
    let mq: MediaQueryList | null = null;
    const onDprChange = () => {
      resize();
      mq?.removeEventListener?.("change", onDprChange);
      mq = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
      mq.addEventListener?.("change", onDprChange);
    };
    mq = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
    mq.addEventListener?.("change", onDprChange);

    // Float32Array layout: [x, y, vx, vy] × count. Faster than object array
    // and lets the per-frame inner loop stay in cache.
    const boids = new Float32Array(count * 4);
    const seed = () => {
      const W = canvas.width;
      const H = canvas.height;
      for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2;
        const speed = (1.5 + Math.random() * 1.5) * dpr;
        boids[i * 4] = Math.random() * W;
        boids[i * 4 + 1] = Math.random() * H;
        boids[i * 4 + 2] = Math.cos(a) * speed;
        boids[i * 4 + 3] = Math.sin(a) * speed;
      }
    };
    seed();

    // Tuned for a watchable demo: lonely boids find each other, form
    // several sub-flocks, those streams cross and split — NOT one big ball.
    // Key levers:
    //   PERCEPTION small relative to canvas → multiple independent clusters
    //   W_COH weak relative to W_SEP        → flocks stay loose, don't collapse
    //   W_ALI moderate                       → recognisable streams
    const PERCEPTION = 56; // css px — neighbour radius for ali + coh
    const AVOIDANCE = 24; // css px — separation kicks in here
    const MAX_SPEED = 2.6; // css px / frame
    const MIN_SPEED = 1.5;
    const W_SEP = 0.22; // ↑ from 0.12 — keeps flocks loose
    const W_ALI = 0.05; // ≈ same
    const W_COH = 0.0006; // ↓ from 0.0012 — prevents collapse to one ball

    const step = () => {
      const W = canvas.width;
      const H = canvas.height;
      const halfW = W / 2;
      const halfH = H / 2;
      const perception = PERCEPTION * dpr;
      const avoidance = AVOIDANCE * dpr;
      const perception2 = perception * perception;
      const avoidance2 = avoidance * avoidance;
      const maxSpeed = MAX_SPEED * dpr;
      const minSpeed = MIN_SPEED * dpr;

      for (let i = 0; i < count; i++) {
        const ix = boids[i * 4];
        const iy = boids[i * 4 + 1];
        const ivx = boids[i * 4 + 2];
        const ivy = boids[i * 4 + 3];

        let sepX = 0,
          sepY = 0;
        let aliX = 0,
          aliY = 0;
        let cohX = 0,
          cohY = 0;
        let n = 0;

        for (let j = 0; j < count; j++) {
          if (j === i) continue;
          // Toroidal-wrapped displacement: shortest vector from i to j
          // around the torus, not raw screen-space distance. Without this
          // boids systematically clump toward the screen mean as they wrap.
          let dx = boids[j * 4] - ix;
          let dy = boids[j * 4 + 1] - iy;
          if (dx > halfW) dx -= W;
          else if (dx < -halfW) dx += W;
          if (dy > halfH) dy -= H;
          else if (dy < -halfH) dy += H;
          const d2 = dx * dx + dy * dy;
          if (d2 > perception2 || d2 < 0.0001) continue;
          aliX += boids[j * 4 + 2];
          aliY += boids[j * 4 + 3];
          cohX += dx;
          cohY += dy;
          n++;
          if (d2 < avoidance2) {
            const inv = 1 / d2;
            sepX -= dx * inv;
            sepY -= dy * inv;
          }
        }

        let nvx = ivx;
        let nvy = ivy;

        if (n > 0) {
          // Alignment: steer velocity toward neighbours' average heading.
          aliX = aliX / n - ivx;
          aliY = aliY / n - ivy;
          // Cohesion: steer position toward neighbours' centroid (already
          // expressed as a torus-aware mean displacement).
          cohX = cohX / n;
          cohY = cohY / n;
          nvx += aliX * W_ALI + cohX * W_COH;
          nvy += aliY * W_ALI + cohY * W_COH;
        }
        // Separation always applied — it's the only thing keeping a dense
        // cluster from collapsing to a point.
        nvx += sepX * W_SEP;
        nvy += sepY * W_SEP;

        // Speed clamp + floor.
        const sp = Math.hypot(nvx, nvy);
        if (sp > maxSpeed) {
          nvx = (nvx / sp) * maxSpeed;
          nvy = (nvy / sp) * maxSpeed;
        } else if (sp < minSpeed) {
          if (sp > 0.0001) {
            nvx = (nvx / sp) * minSpeed;
            nvy = (nvy / sp) * minSpeed;
          } else {
            const a = Math.random() * Math.PI * 2;
            nvx = Math.cos(a) * minSpeed;
            nvy = Math.sin(a) * minSpeed;
          }
        }

        // Position update + toroidal wrap.
        let nx = ix + nvx;
        let ny = iy + nvy;
        if (nx < 0) nx += W;
        else if (nx >= W) nx -= W;
        if (ny < 0) ny += H;
        else if (ny >= H) ny -= H;

        boids[i * 4] = nx;
        boids[i * 4 + 1] = ny;
        boids[i * 4 + 2] = nvx;
        boids[i * 4 + 3] = nvy;
      }
    };

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      // Soft fade — gives motion trails without ghosting permanently.
      ctx.fillStyle = rgba(palette.ink[950], 0.25);
      ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = rgba(palette.signal.cyan, 0.92);
      const size = 2.8 * dpr;
      for (let i = 0; i < count; i++) {
        const x = boids[i * 4];
        const y = boids[i * 4 + 1];
        const vx = boids[i * 4 + 2];
        const vy = boids[i * 4 + 3];
        const a = Math.atan2(vy, vx);
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(a) * size * 2.4, y + Math.sin(a) * size * 2.4);
        ctx.lineTo(x + Math.cos(a + 2.5) * size, y + Math.sin(a + 2.5) * size);
        ctx.lineTo(x + Math.cos(a - 2.5) * size, y + Math.sin(a - 2.5) * size);
        ctx.closePath();
        ctx.fill();
      }
    };

    const loop = () => {
      step();
      draw();
      raf = requestAnimationFrame(loop);
    };

    if (reduced) {
      // Reduced motion: settle to a representative frame and draw it once, no
      // rAF loop — the swarm is frozen mid-flock instead of swirling forever.
      for (let k = 0; k < 400; k++) step();
      ctx.fillStyle = palette.ink[950];
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      draw();
    } else {
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mq?.removeEventListener?.("change", onDprChange);
    };
  }, [count, resetTick, reduced]);

  return (
    <div className={`relative ${className}`}>
      <canvas ref={canvasRef} className="block h-full w-full" role="img" aria-label={ariaLabel} />
      <button
        type="button"
        onClick={() => setResetTick((n) => n + 1)}
        className="hairline glass absolute right-3 top-3 rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-signal-cyan/60 hover:text-signal-cyan"
      >
        ↻ {resetLabel}
      </button>
    </div>
  );
}
