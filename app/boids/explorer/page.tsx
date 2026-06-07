"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";

type ColorKey = "cyan" | "violet" | "amber" | "rose";

const COLORS: Record<
  ColorKey,
  { rgb: string; tw: string; border: string; bg: string; swatch: string }
> = {
  cyan: {
    rgb: "125, 243, 255",
    tw: "text-signal-cyan",
    border: "border-signal-cyan/60",
    bg: "bg-signal-cyan/10",
    swatch: "bg-signal-cyan",
  },
  violet: {
    rgb: "179, 136, 255",
    tw: "text-signal-violet",
    border: "border-signal-violet/60",
    bg: "bg-signal-violet/10",
    swatch: "bg-signal-violet",
  },
  amber: {
    rgb: "255, 209, 102",
    tw: "text-signal-amber",
    border: "border-signal-amber/60",
    bg: "bg-signal-amber/10",
    swatch: "bg-signal-amber",
  },
  rose: {
    rgb: "255, 122, 182",
    tw: "text-signal-rose",
    border: "border-signal-rose/60",
    bg: "bg-signal-rose/10",
    swatch: "bg-signal-rose",
  },
};

export default function BoidsExplorer() {
  const { a, u } = useI18n();
  const topic = a.topics.boids;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Tunable parameters (state for the panel; mirrored to paramsRef for the rAF loop).
  const [count, setCount] = useState(220);
  const [wSep, setWSep] = useState(1.5);
  const [wAli, setWAli] = useState(1.0);
  const [wCoh, setWCoh] = useState(1.0);
  const [perception, setPerception] = useState(80);
  const [sepRadius, setSepRadius] = useState(25);
  const [maxSpeed, setMaxSpeed] = useState(4);
  const [wrap, setWrap] = useState(true);
  const [color, setColor] = useState<ColorKey>("cyan");
  const [running, setRunning] = useState(true);
  const [useSep, setUseSep] = useState(true);
  const [useAli, setUseAli] = useState(true);
  const [useCoh, setUseCoh] = useState(true);

  // Simulation state — Float32Array of [x, y, vx, vy] per boid.
  const boidsRef = useRef<Float32Array>(new Float32Array(0));
  const sizeRef = useRef({ w: 0, h: 0, dpr: 1 });

  // Live-tracked params so the rAF loop reads current values without restarting.
  const paramsRef = useRef({
    wSep,
    wAli,
    wCoh,
    perception,
    sepRadius,
    maxSpeed,
    wrap,
    color,
    running,
    useSep,
    useAli,
    useCoh,
  });
  useEffect(() => {
    paramsRef.current = {
      wSep,
      wAli,
      wCoh,
      perception,
      sepRadius,
      maxSpeed,
      wrap,
      color,
      running,
      useSep,
      useAli,
      useCoh,
    };
  }, [
    wSep,
    wAli,
    wCoh,
    perception,
    sepRadius,
    maxSpeed,
    wrap,
    color,
    running,
    useSep,
    useAli,
    useCoh,
  ]);

  const seedBoids = (n: number, w: number, h: number, dpr: number) => {
    const arr = new Float32Array(n * 4);
    for (let i = 0; i < n; i++) {
      const ang = Math.random() * Math.PI * 2;
      const speed = (1 + Math.random() * 2) * dpr;
      arr[i * 4] = Math.random() * w;
      arr[i * 4 + 1] = Math.random() * h;
      arr[i * 4 + 2] = Math.cos(ang) * speed;
      arr[i * 4 + 3] = Math.sin(ang) * speed;
    }
    return arr;
  };

  // Resize population when the count slider changes — preserve existing boids when growing.
  useEffect(() => {
    const { w, h, dpr } = sizeRef.current;
    if (w === 0 || h === 0) return;
    const prev = boidsRef.current;
    const prevN = prev.length / 4;
    if (count === prevN) return;
    const next = new Float32Array(count * 4);
    const keep = Math.min(prevN, count);
    next.set(prev.subarray(0, keep * 4), 0);
    for (let i = keep; i < count; i++) {
      const ang = Math.random() * Math.PI * 2;
      const speed = (1 + Math.random() * 2) * dpr;
      next[i * 4] = Math.random() * w;
      next[i * 4 + 1] = Math.random() * h;
      next[i * 4 + 2] = Math.cos(ang) * speed;
      next[i * 4 + 3] = Math.sin(ang) * speed;
    }
    boidsRef.current = next;
  }, [count]);

  const reset = () => {
    const { w, h, dpr } = sizeRef.current;
    if (w === 0 || h === 0) return;
    boidsRef.current = seedBoids(count, w, h, dpr);
  };

  const addCluster = () => {
    const { w, h, dpr } = sizeRef.current;
    if (w === 0 || h === 0) return;
    const extra = 30;
    const prev = boidsRef.current;
    const prevN = prev.length / 4;
    const newN = Math.min(prevN + extra, 500);
    const actual = newN - prevN;
    const next = new Float32Array(newN * 4);
    next.set(prev, 0);
    const cx = w / 2;
    const cy = h / 2;
    for (let i = 0; i < actual; i++) {
      const idx = (prevN + i) * 4;
      const ang = Math.random() * Math.PI * 2;
      const r = Math.random() * 30 * dpr;
      const vang = Math.random() * Math.PI * 2;
      next[idx] = cx + Math.cos(ang) * r;
      next[idx + 1] = cy + Math.sin(ang) * r;
      next[idx + 2] = Math.cos(vang) * 2 * dpr;
      next[idx + 3] = Math.sin(vang) * 2 * dpr;
    }
    boidsRef.current = next;
    setCount(newN);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = Math.floor(canvas.clientWidth * dpr);
      canvas.height = Math.floor(canvas.clientHeight * dpr);
      const w = canvas.width;
      const h = canvas.height;
      const prev = sizeRef.current;
      sizeRef.current = { w, h, dpr };
      // First sizing → seed.
      if (prev.w === 0 || prev.h === 0) {
        boidsRef.current = seedBoids(count, w, h, dpr);
      }
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let raf = 0;
    const step = () => {
      const p = paramsRef.current;
      const { w, h } = sizeRef.current;
      const boids = boidsRef.current;
      const n = boids.length / 4;

      // Fade-trail background — paint each frame so old triangles soften out.
      ctx.fillStyle = "rgba(5, 6, 10, 0.20)";
      ctx.fillRect(0, 0, w, h);

      if (p.running && n > 0) {
        const perR = p.perception * dpr;
        const sepR = p.sepRadius * dpr;
        const perR2 = perR * perR;
        const sepR2 = sepR * sepR;
        const maxV = p.maxSpeed * dpr;

        // Buffer for new velocities so updates use the same snapshot.
        const newV = new Float32Array(n * 2);

        for (let i = 0; i < n; i++) {
          const ix = boids[i * 4];
          const iy = boids[i * 4 + 1];
          const ivx = boids[i * 4 + 2];
          const ivy = boids[i * 4 + 3];

          let sepX = 0;
          let sepY = 0;
          let aliX = 0;
          let aliY = 0;
          let cohX = 0;
          let cohY = 0;
          let perCount = 0;
          let sepCount = 0;

          for (let j = 0; j < n; j++) {
            if (j === i) continue;
            const dx = boids[j * 4] - ix;
            const dy = boids[j * 4 + 1] - iy;
            const d2 = dx * dx + dy * dy;
            if (d2 > perR2 || d2 === 0) continue;
            perCount++;
            aliX += boids[j * 4 + 2];
            aliY += boids[j * 4 + 3];
            cohX += boids[j * 4];
            cohY += boids[j * 4 + 1];
            if (d2 < sepR2) {
              sepX += -dx / d2;
              sepY += -dy / d2;
              sepCount++;
            }
          }

          let ax = 0;
          let ay = 0;
          if (perCount > 0) {
            if (p.useAli) {
              const avgVX = aliX / perCount;
              const avgVY = aliY / perCount;
              ax += (avgVX - ivx) * p.wAli * 0.05;
              ay += (avgVY - ivy) * p.wAli * 0.05;
            }
            if (p.useCoh) {
              const avgPX = cohX / perCount;
              const avgPY = cohY / perCount;
              ax += ((avgPX - ix) / 100) * p.wCoh;
              ay += ((avgPY - iy) / 100) * p.wCoh;
            }
          }
          if (sepCount > 0 && p.useSep) {
            const sm = Math.hypot(sepX, sepY) || 1;
            ax += (sepX / sm) * p.wSep * 0.6;
            ay += (sepY / sm) * p.wSep * 0.6;
          }

          let nvx = ivx + ax;
          let nvy = ivy + ay;
          const spd = Math.hypot(nvx, nvy);
          if (spd > maxV) {
            nvx = (nvx / spd) * maxV;
            nvy = (nvy / spd) * maxV;
          } else if (spd < 0.1) {
            const a0 = Math.random() * Math.PI * 2;
            nvx = Math.cos(a0) * 0.5;
            nvy = Math.sin(a0) * 0.5;
          }
          newV[i * 2] = nvx;
          newV[i * 2 + 1] = nvy;
        }

        for (let i = 0; i < n; i++) {
          let vx = newV[i * 2];
          let vy = newV[i * 2 + 1];
          let x = boids[i * 4] + vx;
          let y = boids[i * 4 + 1] + vy;

          if (p.wrap) {
            if (x < 0) x += w;
            else if (x >= w) x -= w;
            if (y < 0) y += h;
            else if (y >= h) y -= h;
          } else {
            // Soft turn near edges, hard clamp at edges
            const margin = 30 * dpr;
            const turn = 0.4 * dpr;
            if (x < margin) vx += turn;
            else if (x > w - margin) vx -= turn;
            if (y < margin) vy += turn;
            else if (y > h - margin) vy -= turn;
            if (x < 0) {
              x = 0;
              vx = Math.abs(vx);
            } else if (x > w) {
              x = w;
              vx = -Math.abs(vx);
            }
            if (y < 0) {
              y = 0;
              vy = Math.abs(vy);
            } else if (y > h) {
              y = h;
              vy = -Math.abs(vy);
            }
          }

          boids[i * 4] = x;
          boids[i * 4 + 1] = y;
          boids[i * 4 + 2] = vx;
          boids[i * 4 + 3] = vy;
        }
      }

      // Render boids as small triangles aligned with velocity.
      const rgb = COLORS[p.color].rgb;
      ctx.fillStyle = `rgba(${rgb}, 0.95)`;
      const tri = 5 * dpr;
      for (let i = 0; i < n; i++) {
        const x = boids[i * 4];
        const y = boids[i * 4 + 1];
        const vx = boids[i * 4 + 2];
        const vy = boids[i * 4 + 3];
        const ang = Math.atan2(vy, vx);
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(ang);
        ctx.beginPath();
        ctx.moveTo(tri * 1.4, 0);
        ctx.lineTo(-tri * 0.7, tri * 0.6);
        ctx.lineTo(-tri * 0.7, -tri * 0.6);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
    // The rAF loop reads from refs, so it does not need to restart on param change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const c = COLORS[color];

  return (
    <main className="flex min-h-screen flex-col pt-14">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_420px]">
        <div className="relative min-h-[60vh] bg-ink-950 lg:min-h-[calc(100vh-3.5rem)]">
          <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />
          <div className="pointer-events-none absolute left-4 right-4 top-4 flex items-start justify-between gap-3">
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              n = {count} · sep {wSep.toFixed(1)} · ali {wAli.toFixed(1)} · coh {wCoh.toFixed(1)}
            </div>
            <div
              className={`glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 ${c.tw}`}
            >
              {wrap ? "torus" : "bounded"} · r = {perception}
            </div>
          </div>
        </div>

        <aside className="hairline scrollbar-thin flex flex-col overflow-y-auto border-l bg-ink-900/40">
          <div className="hairline space-y-3 border-b p-6">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${c.tw}`}>
              {topic.title}
            </div>
            <h1 className="math-italic text-3xl leading-tight text-ink-100">{topic.tagline}</h1>
            <p className="text-sm leading-relaxed text-ink-200">{topic.body}</p>
          </div>

          <div className="hairline space-y-4 border-b p-5">
            <Slider
              label="Boids"
              value={count}
              min={50}
              max={500}
              step={10}
              display={count.toString()}
              onChange={setCount}
            />
            <Slider
              label="Separation w"
              value={wSep}
              min={0}
              max={3}
              step={0.05}
              display={wSep.toFixed(2)}
              onChange={setWSep}
            />
            <Slider
              label="Alignment w"
              value={wAli}
              min={0}
              max={3}
              step={0.05}
              display={wAli.toFixed(2)}
              onChange={setWAli}
            />
            <Slider
              label="Cohesion w"
              value={wCoh}
              min={0}
              max={3}
              step={0.05}
              display={wCoh.toFixed(2)}
              onChange={setWCoh}
            />
          </div>

          <div className="hairline space-y-4 border-b p-5">
            <Slider
              label="Perception radius"
              value={perception}
              min={20}
              max={200}
              step={1}
              display={`${perception} px`}
              onChange={setPerception}
            />
            <Slider
              label="Separation radius"
              value={sepRadius}
              min={10}
              max={80}
              step={1}
              display={`${sepRadius} px`}
              onChange={setSepRadius}
            />
            <Slider
              label="Max speed"
              value={maxSpeed}
              min={1}
              max={8}
              step={0.1}
              display={maxSpeed.toFixed(1)}
              onChange={setMaxSpeed}
            />
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Active rules
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  ["Sep", useSep, setUseSep],
                  ["Ali", useAli, setUseAli],
                  ["Coh", useCoh, setUseCoh],
                ] as const
              ).map(([label, on, set]) => (
                <button
                  key={label}
                  onClick={() => set(!on)}
                  className={`rounded-md border py-2 font-mono text-[10px] uppercase tracking-widest transition-colors ${
                    on ? `${c.border} ${c.tw} ${c.bg}` : "hairline text-ink-500 hover:text-ink-200"
                  }`}
                >
                  {on ? "● " : "○ "}
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Edge behaviour
            </div>
            <button
              onClick={() => setWrap((v) => !v)}
              className={`w-full rounded-md border py-2 font-mono text-[10px] uppercase tracking-widest2 transition-colors ${
                wrap ? `${c.border} ${c.tw} ${c.bg}` : "hairline text-ink-300 hover:text-ink-100"
              }`}
            >
              {wrap ? "↻ Toroidal wrap" : "▦ Bounded"}
            </button>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Colour
            </div>
            <div className="grid grid-cols-4 gap-2">
              {(Object.keys(COLORS) as ColorKey[]).map((k) => (
                <button
                  key={k}
                  onClick={() => setColor(k)}
                  aria-label={k}
                  className={`flex flex-col items-center justify-center gap-1 rounded-md border py-2 transition-colors ${
                    color === k
                      ? `${COLORS[k].border} ${COLORS[k].bg}`
                      : "hairline hover:border-ink-300/50"
                  }`}
                >
                  <span className={`h-4 w-4 rounded-full ${COLORS[k].swatch}`} />
                  <span
                    className={`font-mono text-[9px] uppercase tracking-widest ${
                      color === k ? COLORS[k].tw : "text-ink-400"
                    }`}
                  >
                    {k}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="hairline space-y-2 border-b p-5">
            <button
              onClick={() => setRunning((v) => !v)}
              className={`w-full rounded-md border py-2 font-mono text-[11px] uppercase tracking-widest2 transition-colors ${
                running
                  ? "border-signal-rose/60 bg-signal-rose/10 text-signal-rose"
                  : `${c.border} ${c.tw} ${c.bg}`
              }`}
            >
              {running ? "❚❚ Pause" : "▶ Play"}
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={reset}
                className="hairline hover:text-ink-50 rounded-md border py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-ink-300/50"
              >
                ⟳ Reset
              </button>
              <button
                onClick={addCluster}
                className={`rounded-md border py-2 font-mono text-[10px] uppercase tracking-widest2 transition-colors ${c.border} ${c.tw} ${c.bg} hover:opacity-80`}
              >
                + Cluster
              </button>
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

function Slider({
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
