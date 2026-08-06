"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { useDpr } from "@/lib/hooks/useDpr";
import { palette } from "@/lib/visual/palette";
import type { Locale } from "@/lib/i18n/types";

type Projection = "xz" | "xy" | "yz";

// Localized control-panel strings. The rest of the page (topic.title/tagline/
// body, u.back) is already localized; these labels used to be English literals
// shown to every locale.
type ExplorerStrings = {
  sigmaLabel: string;
  rhoLabel: string;
  betaLabel: string;
  dtLabel: string;
  projectionLabel: string;
  classicPreset: string;
  pauseLabel: string;
  playLabel: string;
  canvasLabel: string;
};

const RICH_EXPLORER: Record<Locale, ExplorerStrings> = {
  en: {
    sigmaLabel: "σ · Prandtl",
    rhoLabel: "ρ · Rayleigh",
    betaLabel: "β · geometry",
    dtLabel: "Time step dt",
    projectionLabel: "Projection",
    classicPreset: "⟳ Classic chaos · 10 / 28 / 8⁄3",
    pauseLabel: "❚❚ Pause",
    playLabel: "▶ Play",
    canvasLabel: "Live Lorenz attractor, integrated in real time",
  },
  de: {
    sigmaLabel: "σ · Prandtl",
    rhoLabel: "ρ · Rayleigh",
    betaLabel: "β · Geometrie",
    dtLabel: "Zeitschritt dt",
    projectionLabel: "Projektion",
    classicPreset: "⟳ Klassisches Chaos · 10 / 28 / 8⁄3",
    pauseLabel: "❚❚ Pause",
    playLabel: "▶ Start",
    canvasLabel: "Live-Lorenz-Attraktor, in Echtzeit integriert",
  },
  es: {
    sigmaLabel: "σ · Prandtl",
    rhoLabel: "ρ · Rayleigh",
    betaLabel: "β · geometría",
    dtLabel: "Paso temporal dt",
    projectionLabel: "Proyección",
    classicPreset: "⟳ Caos clásico · 10 / 28 / 8⁄3",
    pauseLabel: "❚❚ Pausa",
    playLabel: "▶ Reproducir",
    canvasLabel: "Atractor de Lorenz en vivo, integrado en tiempo real",
  },
  fr: {
    sigmaLabel: "σ · Prandtl",
    rhoLabel: "ρ · Rayleigh",
    betaLabel: "β · géométrie",
    dtLabel: "Pas de temps dt",
    projectionLabel: "Projection",
    classicPreset: "⟳ Chaos classique · 10 / 28 / 8⁄3",
    pauseLabel: "❚❚ Pause",
    playLabel: "▶ Lecture",
    canvasLabel: "Attracteur de Lorenz en direct, intégré en temps réel",
  },
  it: {
    sigmaLabel: "σ · Prandtl",
    rhoLabel: "ρ · Rayleigh",
    betaLabel: "β · geometria",
    dtLabel: "Passo temporale dt",
    projectionLabel: "Proiezione",
    classicPreset: "⟳ Caos classico · 10 / 28 / 8⁄3",
    pauseLabel: "❚❚ Pausa",
    playLabel: "▶ Play",
    canvasLabel: "Attrattore di Lorenz dal vivo, integrato in tempo reale",
  },
  pt: {
    sigmaLabel: "σ · Prandtl",
    rhoLabel: "ρ · Rayleigh",
    betaLabel: "β · geometria",
    dtLabel: "Passo temporal dt",
    projectionLabel: "Projeção",
    classicPreset: "⟳ Caos clássico · 10 / 28 / 8⁄3",
    pauseLabel: "❚❚ Pausa",
    playLabel: "▶ Tocar",
    canvasLabel: "Atrator de Lorenz ao vivo, integrado em tempo real",
  },
  sv: {
    sigmaLabel: "σ · Prandtl",
    rhoLabel: "ρ · Rayleigh",
    betaLabel: "β · geometri",
    dtLabel: "Tidssteg dt",
    projectionLabel: "Projektion",
    classicPreset: "⟳ Klassiskt kaos · 10 / 28 / 8⁄3",
    pauseLabel: "❚❚ Paus",
    playLabel: "▶ Spela",
    canvasLabel: "Live Lorenz-attraktor, integrerad i realtid",
  },
  no: {
    sigmaLabel: "σ · Prandtl",
    rhoLabel: "ρ · Rayleigh",
    betaLabel: "β · geometri",
    dtLabel: "Tidssteg dt",
    projectionLabel: "Projeksjon",
    classicPreset: "⟳ Klassisk kaos · 10 / 28 / 8⁄3",
    pauseLabel: "❚❚ Pause",
    playLabel: "▶ Spill",
    canvasLabel: "Live Lorenz-attraktor, integrert i sanntid",
  },
};

const BG_FADE = (() => {
  const n = parseInt(palette.canvas.bg.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, 0.18)`;
})();

export default function LorenzExplorer() {
  const { a, u, locale } = useI18n();
  const topic = a.topics.lorenz;
  const tx = RICH_EXPLORER[locale];
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [sigma, setSigma] = useState(10);
  const [rho, setRho] = useState(28);
  const [beta, setBeta] = useState(8 / 3);
  const [dt, setDt] = useState(0.005);
  const [running, setRunning] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [projection, setProjection] = useState<Projection>("xz");
  const dpr = useDpr();

  // Mutable simulation state held in refs so we don't re-allocate on each render
  const stateRef = useRef({ x: 0.1, y: 0, z: 0 });
  const pointsRef = useRef<Float32Array>(new Float32Array(0));
  const headRef = useRef(0);
  const TRAIL = 6000;

  useEffect(() => {
    pointsRef.current = new Float32Array(TRAIL * 3);
    headRef.current = 0;
  }, []);

  // Track prefers-reduced-motion and re-subscribe so a system-setting change
  // swaps between the animated loop and a single static frame.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(m.matches);
    on();
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);

  // Reset trajectory when params change
  useEffect(() => {
    stateRef.current = { x: 0.1, y: 0, z: 0 };
    pointsRef.current = new Float32Array(TRAIL * 3);
    headRef.current = 0;
  }, [sigma, rho, beta]);

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

    // RK4 step
    const f = (x: number, y: number, z: number) => [
      sigma * (y - x),
      x * (rho - z) - y,
      x * y - beta * z,
    ];

    const stepRK4 = () => {
      const { x, y, z } = stateRef.current;
      const [k1x, k1y, k1z] = f(x, y, z);
      const [k2x, k2y, k2z] = f(x + 0.5 * dt * k1x, y + 0.5 * dt * k1y, z + 0.5 * dt * k1z);
      const [k3x, k3y, k3z] = f(x + 0.5 * dt * k2x, y + 0.5 * dt * k2y, z + 0.5 * dt * k2z);
      const [k4x, k4y, k4z] = f(x + dt * k3x, y + dt * k3y, z + dt * k3z);
      stateRef.current = {
        x: x + (dt / 6) * (k1x + 2 * k2x + 2 * k3x + k4x),
        y: y + (dt / 6) * (k1y + 2 * k2y + 2 * k3y + k4y),
        z: z + (dt / 6) * (k1z + 2 * k2z + 2 * k3z + k4z),
      };
    };

    const integrateStore = () => {
      stepRK4();
      const idx = headRef.current * 3;
      pointsRef.current[idx] = stateRef.current.x;
      pointsRef.current[idx + 1] = stateRef.current.y;
      pointsRef.current[idx + 2] = stateRef.current.z;
      headRef.current = (headRef.current + 1) % TRAIL;
    };

    const renderScene = () => {
      const W = canvas.width;
      const H = canvas.height;

      // Project + draw
      const pickXY = (i: number) => {
        const x = pointsRef.current[i * 3];
        const y = pointsRef.current[i * 3 + 1];
        const z = pointsRef.current[i * 3 + 2];
        if (projection === "xz") return [x, z];
        if (projection === "xy") return [x, y];
        return [y, z];
      };

      // Auto-fit bounds (we know rough Lorenz scale)
      const scale = Math.min(W, H) / 70;
      const cx = W / 2;
      const cy = projection === "xy" ? H / 2 : H * 0.7;
      const dot = 1.6 * dpr; // DPR-scaled so the trail keeps its weight on retina

      for (let i = 0; i < TRAIL; i++) {
        const a2 = pointsRef.current[i * 3 + 1];
        if (a2 === 0 && pointsRef.current[i * 3] === 0 && pointsRef.current[i * 3 + 2] === 0)
          continue;
        const [u2, v] = pickXY(i);
        const age = (TRAIL + i - headRef.current) % TRAIL;
        const t = age / TRAIL;
        // amber → cyan → violet gradient with age
        const r = Math.round(255 * (1 - t) + 125 * t);
        const g = Math.round(209 * (1 - t) + 200 * t);
        const b = Math.round(102 * (1 - t) + 255 * t);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.25 + 0.7 * (1 - t)})`;
        ctx.fillRect(cx + u2 * scale, cy - v * scale, dot, dot);
      }
    };

    // Reduced motion: pre-integrate a full trajectory and render one static
    // frame, skipping the rAF loop. Slider changes rebuild this effect.
    if (reduced) {
      ctx.fillStyle = palette.canvas.bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      stateRef.current = { x: 0.1, y: 0, z: 0 };
      pointsRef.current = new Float32Array(TRAIL * 3);
      headRef.current = 0;
      for (let i = 0; i < 800; i++) stepRK4(); // warm up onto the attractor
      for (let i = 0; i < TRAIL; i++) integrateStore();
      renderScene();
      return () => {
        ro.disconnect();
      };
    }

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.fillStyle = BG_FADE; // motion trail
      ctx.fillRect(0, 0, W, H);

      if (running) {
        for (let i = 0; i < 12; i++) integrateStore();
      }

      renderScene();
      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [sigma, rho, beta, dt, running, projection, dpr, reduced]);

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
              σ = {sigma.toFixed(1)} · ρ = {rho.toFixed(1)} · β = {beta.toFixed(3)}
            </div>
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
              {tx.projectionLabel} · {projection.toUpperCase()}
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
            <label
              htmlFor="lorenz-sigma"
              className="block font-mono text-[10px] uppercase tracking-widest2 text-ink-300"
            >
              {tx.sigmaLabel}
            </label>
            <input
              id="lorenz-sigma"
              type="range"
              value={sigma}
              min={1}
              max={20}
              step={0.1}
              onChange={(e) => setSigma(parseFloat(e.target.value))}
              className="w-full accent-signal-amber"
            />
            <label
              htmlFor="lorenz-rho"
              className="block font-mono text-[10px] uppercase tracking-widest2 text-ink-300"
            >
              {tx.rhoLabel}
            </label>
            <input
              id="lorenz-rho"
              type="range"
              value={rho}
              min={0}
              max={60}
              step={0.1}
              onChange={(e) => setRho(parseFloat(e.target.value))}
              className="w-full accent-signal-amber"
            />
            <label
              htmlFor="lorenz-beta"
              className="block font-mono text-[10px] uppercase tracking-widest2 text-ink-300"
            >
              {tx.betaLabel}
            </label>
            <input
              id="lorenz-beta"
              type="range"
              value={beta}
              min={0.5}
              max={6}
              step={0.01}
              onChange={(e) => setBeta(parseFloat(e.target.value))}
              className="w-full accent-signal-amber"
            />
            <button
              onClick={() => {
                setSigma(10);
                setRho(28);
                setBeta(8 / 3);
              }}
              className="hairline mt-2 w-full rounded-md border py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-signal-amber/40 hover:text-signal-amber"
            >
              {tx.classicPreset}
            </button>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <label
              htmlFor="lorenz-dt"
              className="block font-mono text-[10px] uppercase tracking-widest2 text-ink-300"
            >
              {tx.dtLabel}
            </label>
            <input
              id="lorenz-dt"
              type="range"
              value={dt}
              min={0.001}
              max={0.02}
              step={0.0005}
              onChange={(e) => setDt(parseFloat(e.target.value))}
              className="w-full accent-signal-cyan"
            />
            <div className="text-right font-mono text-[10px] text-ink-400">{dt.toFixed(4)}</div>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {tx.projectionLabel}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(["xz", "xy", "yz"] as Projection[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setProjection(p)}
                  className={`rounded-md border py-2 font-mono text-[10px] uppercase tracking-widest transition-colors ${
                    projection === p
                      ? "border-signal-amber/60 bg-signal-amber/10 text-signal-amber"
                      : "hairline text-ink-300 hover:text-ink-100"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="hairline border-b p-5">
            <button
              onClick={() => setRunning((v) => !v)}
              disabled={reduced}
              className={`w-full rounded-md border py-2 font-mono text-[11px] uppercase tracking-widest2 transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                running
                  ? "border-signal-coral/60 bg-signal-coral/10 text-signal-coral"
                  : "border-signal-amber/60 bg-signal-amber/10 text-signal-amber"
              }`}
            >
              {running ? tx.pauseLabel : tx.playLabel}
            </button>
          </div>

          <div className="p-5">
            <Link
              href="/"
              className="hairline block w-full rounded-md border py-2 text-center font-mono text-[10px] uppercase tracking-widest2 text-ink-300 transition-colors hover:border-signal-violet/40 hover:text-signal-violet"
            >
              {u.back}
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
