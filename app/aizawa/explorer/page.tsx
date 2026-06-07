"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";

interface ParamSpec {
  label: string;
  min: number;
  max: number;
  step: number;
}

interface Attractor {
  id: string;
  label: string;
  params: number[];
  paramSpecs: ParamSpec[];
  step: number;
  dtMin: number;
  dtMax: number;
  scale: number;
  trailFade: number;
  step1: (x: number, y: number, z: number, p: number[], dt: number) => [number, number, number];
}

// Each attractor takes a parameter vector and integrates one Euler step.
const ATTRACTORS: Record<string, Attractor> = {
  aizawa: {
    id: "aizawa",
    label: "Aizawa",
    params: [0.95, 0.7, 0.6, 3.5, 0.25, 0.1],
    paramSpecs: [
      { label: "a", min: 0.5, max: 1.5, step: 0.005 },
      { label: "b", min: 0.3, max: 1.2, step: 0.005 },
      { label: "c", min: 0.2, max: 1.5, step: 0.005 },
      { label: "d", min: 2.0, max: 6.0, step: 0.01 },
      { label: "e", min: 0.1, max: 0.6, step: 0.005 },
      { label: "f", min: 0.0, max: 0.3, step: 0.005 },
    ],
    step: 0.01,
    dtMin: 0.005,
    dtMax: 0.02,
    scale: 180,
    trailFade: 0.04,
    step1: (x, y, z, p, dt) => {
      const [a, b, c, d, e, f] = p;
      const dx = (z - b) * x - d * y;
      const dy = d * x + (z - b) * y;
      const dz = c + a * z - (z * z * z) / 3 - (x * x + y * y) * (1 + e * z) + f * z * x * x * x;
      return [x + dx * dt, y + dy * dt, z + dz * dt];
    },
  },
  rossler: {
    id: "rossler",
    label: "Rössler",
    params: [0.2, 0.2, 5.7],
    paramSpecs: [
      { label: "a", min: 0.0, max: 0.5, step: 0.005 },
      { label: "b", min: 0.0, max: 1.0, step: 0.01 },
      { label: "c", min: 2.0, max: 10.0, step: 0.05 },
    ],
    step: 0.02,
    dtMin: 0.005,
    dtMax: 0.05,
    scale: 18,
    trailFade: 0.04,
    step1: (x, y, z, p, dt) => {
      const [a, b, c] = p;
      const dx = -y - z;
      const dy = x + a * y;
      const dz = b + z * (x - c);
      return [x + dx * dt, y + dy * dt, z + dz * dt];
    },
  },
  thomas: {
    id: "thomas",
    label: "Thomas",
    params: [0.208186],
    paramSpecs: [{ label: "b", min: 0.05, max: 0.5, step: 0.001 }],
    step: 0.05,
    dtMin: 0.01,
    dtMax: 0.1,
    scale: 80,
    trailFade: 0.05,
    step1: (x, y, z, p, dt) => {
      const [b] = p;
      const dx = Math.sin(y) - b * x;
      const dy = Math.sin(z) - b * y;
      const dz = Math.sin(x) - b * z;
      return [x + dx * dt, y + dy * dt, z + dz * dt];
    },
  },
  halvorsen: {
    id: "halvorsen",
    label: "Halvorsen",
    params: [1.4],
    paramSpecs: [{ label: "a", min: 0.5, max: 3.0, step: 0.01 }],
    step: 0.005,
    dtMin: 0.002,
    dtMax: 0.02,
    scale: 28,
    trailFade: 0.06,
    step1: (x, y, z, p, dt) => {
      const [a] = p;
      const dx = -a * x - 4 * y - 4 * z - y * y;
      const dy = -a * y - 4 * z - 4 * x - z * z;
      const dz = -a * z - 4 * x - 4 * y - x * x;
      return [x + dx * dt, y + dy * dt, z + dz * dt];
    },
  },
};

export default function AizawaExplorer() {
  const { a, u } = useI18n();
  const topic = a.topics.aizawa;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [attractorId, setAttractorId] = useState("aizawa");
  const [stepsPerFrame, setStepsPerFrame] = useState(2400);
  const [autoRotate, setAutoRotate] = useState(true);
  const [params, setParams] = useState<number[]>(ATTRACTORS.aizawa.params);
  const [dt, setDt] = useState<number>(ATTRACTORS.aizawa.step);
  const [resetTick, setResetTick] = useState(0);

  const stateRef = useRef({ attractor: ATTRACTORS.aizawa, params, stepsPerFrame, autoRotate, dt });
  stateRef.current = { attractor: ATTRACTORS[attractorId], params, stepsPerFrame, autoRotate, dt };

  // Drag-to-rotate
  const rotRef = useRef({ yaw: 0.6, pitch: 0.4, dragging: false, lx: 0, ly: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      canvas.width = Math.floor(canvas.clientWidth * dpr);
      canvas.height = Math.floor(canvas.clientHeight * dpr);
      ctx.fillStyle = "#06070d";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let x = 0.1,
      y = 0,
      z = 0;
    let raf = 0;

    const onDown = (e: MouseEvent) => {
      rotRef.current.dragging = true;
      rotRef.current.lx = e.clientX;
      rotRef.current.ly = e.clientY;
    };
    const onUp = () => {
      rotRef.current.dragging = false;
    };
    const onMove = (e: MouseEvent) => {
      if (!rotRef.current.dragging) return;
      rotRef.current.yaw += (e.clientX - rotRef.current.lx) * 0.005;
      rotRef.current.pitch += (e.clientY - rotRef.current.ly) * 0.005;
      rotRef.current.lx = e.clientX;
      rotRef.current.ly = e.clientY;
    };
    canvas.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("mousemove", onMove);

    const loop = () => {
      const cfg = stateRef.current;
      const { attractor, params, stepsPerFrame, autoRotate, dt } = cfg;
      // fade trail
      ctx.fillStyle = `rgba(5, 6, 10, ${attractor.trailFade})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (autoRotate) rotRef.current.yaw += 0.003;
      const cosY = Math.cos(rotRef.current.yaw);
      const sinY = Math.sin(rotRef.current.yaw);
      const cosP = Math.cos(rotRef.current.pitch);
      const sinP = Math.sin(rotRef.current.pitch);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const scale = attractor.scale * dpr;

      ctx.fillStyle = "rgba(255, 122, 182, 0.78)";
      const dotSize = 1.4 * dpr;

      for (let i = 0; i < stepsPerFrame; i++) {
        [x, y, z] = attractor.step1(x, y, z, params, dt);
        // 3D → 2D: rotate around Y then around X
        const rx = x * cosY - y * sinY;
        const rz = x * sinY + y * cosY;
        const ry = z * cosP - rz * sinP;
        const sx = cx + rx * scale;
        const sy = cy - ry * scale;
        // depth shade
        const depth = (z * sinP + (x * sinY + y * cosY) * cosP) / 4 + 0.5;
        const dc = Math.max(0.25, Math.min(1, depth));
        ctx.fillStyle = `rgba(255, 122, 182, ${0.25 + dc * 0.7})`;
        ctx.fillRect(sx - dotSize / 2, sy - dotSize / 2, dotSize, dotSize);
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("mousemove", onMove);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetTick]);

  const attractor = ATTRACTORS[attractorId];

  return (
    <main className="flex min-h-screen flex-col pt-14">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_420px]">
        <div className="relative min-h-[60vh] bg-ink-950 lg:min-h-[calc(100vh-3.5rem)]">
          <canvas
            ref={canvasRef}
            className="absolute inset-0 block h-full w-full cursor-grab active:cursor-grabbing"
          />
          <div className="pointer-events-none absolute left-4 right-4 top-4 flex items-start justify-between gap-3">
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              {attractor.label} · drag to rotate
            </div>
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-rose">
              {stepsPerFrame.toLocaleString()} steps/frame
            </div>
          </div>
        </div>

        <aside className="hairline scrollbar-thin flex flex-col overflow-y-auto border-l bg-ink-900/40">
          <div className="hairline space-y-3 border-b p-6">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-rose">
              {topic.title}
            </div>
            <h1 className="math-italic text-3xl leading-tight text-ink-100">{topic.tagline}</h1>
            <p className="text-sm leading-relaxed text-ink-200">{topic.body}</p>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Attractor
            </div>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(ATTRACTORS).map((at) => (
                <button
                  key={at.id}
                  onClick={() => {
                    setAttractorId(at.id);
                    setParams(at.params);
                    setDt(at.step);
                    setResetTick((t) => t + 1);
                  }}
                  className={`rounded-md border py-2 font-mono text-xs transition-colors ${
                    attractorId === at.id
                      ? "border-signal-rose/60 bg-signal-rose/10 text-signal-rose"
                      : "hairline text-ink-200 hover:border-signal-rose/40 hover:text-signal-rose"
                  }`}
                >
                  {at.label}
                </button>
              ))}
            </div>
          </div>

          <div className="hairline space-y-4 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Parameters
            </div>
            {params.map((value, i) => {
              const spec = attractor.paramSpecs[i];
              return (
                <ParamSlider
                  key={`${attractorId}-${i}`}
                  label={spec?.label ?? String.fromCharCode(97 + i)}
                  value={value}
                  min={spec?.min ?? 0}
                  max={spec?.max ?? 1}
                  step={spec?.step ?? 0.005}
                  onChange={(v) => {
                    const next = params.slice();
                    next[i] = v;
                    setParams(next);
                  }}
                />
              );
            })}
            <ParamSlider
              label="dt"
              value={dt}
              min={attractor.dtMin}
              max={attractor.dtMax}
              step={(attractor.dtMax - attractor.dtMin) / 200}
              onChange={setDt}
            />
            <button
              onClick={() => {
                setParams(attractor.params);
                setDt(attractor.step);
              }}
              className="hairline w-full rounded-md border py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-300 transition-colors hover:border-signal-rose/40 hover:text-signal-rose"
            >
              ⟲ Reset parameters
            </button>
          </div>

          <div className="hairline space-y-4 border-b p-5">
            <SliderRow
              label="Steps / frame"
              value={stepsPerFrame}
              min={200}
              max={6000}
              step={100}
              display={stepsPerFrame.toLocaleString()}
              onChange={setStepsPerFrame}
            />
            <button
              onClick={() => setAutoRotate((v) => !v)}
              className={`w-full rounded-md border py-2 font-mono text-[10px] uppercase tracking-widest2 transition-colors ${
                autoRotate
                  ? "border-signal-rose/60 bg-signal-rose/10 text-signal-rose"
                  : "hairline hover:text-ink-50 text-ink-200 hover:border-ink-300/50"
              }`}
            >
              {autoRotate ? "↻ Auto-rotate on" : "○ Auto-rotate off"}
            </button>
            <button
              onClick={() => setResetTick((t) => t + 1)}
              className="hairline hover:text-ink-50 w-full rounded-md border py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-ink-300/50"
            >
              ⟳ Clear & restart
            </button>
          </div>

          <div className="p-5">
            <Link
              href="/"
              className="hairline block w-full rounded-md border py-2 text-center font-mono text-[10px] uppercase tracking-widest2 text-ink-300 transition-colors hover:border-signal-rose/40 hover:text-signal-rose"
            >
              {u.back}
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}

function ParamSlider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between">
        <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">{label}</div>
        <div className="font-mono text-[10px] text-signal-rose">{value.toFixed(3)}</div>
      </div>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-signal-rose"
      />
    </div>
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
        className="w-full accent-signal-rose"
      />
    </div>
  );
}
