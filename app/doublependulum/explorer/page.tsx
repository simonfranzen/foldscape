"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";

interface PendulumState {
  th1: number;
  th2: number;
  w1: number;
  w2: number;
}

interface Params {
  m1: number;
  m2: number;
  L1: number; // px (used both for drawing and as the length parameter in the ODE)
  L2: number;
  g: number;
}

// Derivatives for the double pendulum (standard form, e.g. Wikipedia).
// Returns [th1', th2', w1', w2'].
function deriv(s: PendulumState, p: Params): [number, number, number, number] {
  const { th1, th2, w1, w2 } = s;
  const { m1, m2, L1, L2, g } = p;
  const d = th1 - th2;
  const sinD = Math.sin(d);
  const cosD = Math.cos(d);
  const den = 2 * m1 + m2 - m2 * Math.cos(2 * th1 - 2 * th2);

  const a1 =
    (-g * (2 * m1 + m2) * Math.sin(th1) -
      m2 * g * Math.sin(th1 - 2 * th2) -
      2 * sinD * m2 * (w2 * w2 * L2 + w1 * w1 * L1 * cosD)) /
    (L1 * den);

  const a2 =
    (2 *
      sinD *
      (w1 * w1 * L1 * (m1 + m2) + g * (m1 + m2) * Math.cos(th1) + w2 * w2 * L2 * m2 * cosD)) /
    (L2 * den);

  return [w1, w2, a1, a2];
}

function rk4Step(s: PendulumState, p: Params, dt: number): PendulumState {
  const add = (
    base: PendulumState,
    k: [number, number, number, number],
    h: number,
  ): PendulumState => ({
    th1: base.th1 + k[0] * h,
    th2: base.th2 + k[1] * h,
    w1: base.w1 + k[2] * h,
    w2: base.w2 + k[3] * h,
  });

  const k1 = deriv(s, p);
  const k2 = deriv(add(s, k1, dt / 2), p);
  const k3 = deriv(add(s, k2, dt / 2), p);
  const k4 = deriv(add(s, k3, dt), p);

  return {
    th1: s.th1 + (dt / 6) * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]),
    th2: s.th2 + (dt / 6) * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]),
    w1: s.w1 + (dt / 6) * (k1[2] + 2 * k2[2] + 2 * k3[2] + k4[2]),
    w2: s.w2 + (dt / 6) * (k1[3] + 2 * k2[3] + 2 * k3[3] + k4[3]),
  };
}

// Total mechanical energy of the system. Pivot at y=0, gravity downward; positions
// y₁ = -L₁ cos θ₁,  y₂ = y₁ - L₂ cos θ₂. Take +y as up so PE = m g y.
function energy(s: PendulumState, p: Params): number {
  const { th1, th2, w1, w2 } = s;
  const { m1, m2, L1, L2, g } = p;
  const v1sq = L1 * L1 * w1 * w1;
  const v2sq = L1 * L1 * w1 * w1 + L2 * L2 * w2 * w2 + 2 * L1 * L2 * w1 * w2 * Math.cos(th1 - th2);
  const T = 0.5 * m1 * v1sq + 0.5 * m2 * v2sq;
  const y1 = -L1 * Math.cos(th1);
  const y2 = y1 - L2 * Math.cos(th2);
  const V = m1 * g * y1 + m2 * g * y2;
  return T + V;
}

export default function DoublePendulumExplorer() {
  const { a, u } = useI18n();
  const topic = a.topics.doublependulum;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sliders / controls
  const [m1, setM1] = useState(1);
  const [m2, setM2] = useState(1);
  const [L1, setL1] = useState(120);
  const [L2, setL2] = useState(120);
  // g is in px/s² because L is in pixels — both must share the same length
  // unit, otherwise the natural period 2π√(L/g) blows up. With L≈120 px,
  // g≈1000 px/s² gives a ~2.2 s pendulum period, which reads as a real pendulum.
  const [g, setG] = useState(1000);
  const [initTh1, setInitTh1] = useState(Math.PI / 2);
  const [initTh2, setInitTh2] = useState(Math.PI / 2);
  const [dt, setDt] = useState(0.005);
  // Wall-clock speed multiplier. 1.0 ≈ real time (matches the story sim),
  // higher = faster, lower = slow-motion. Translated to steps/frame below
  // via `targetSimSecPerFrame = (1/60) * speed`.
  const [speed, setSpeed] = useState(1.0);
  const [running, setRunning] = useState(true);
  const [showGhost, setShowGhost] = useState(true);
  const [trailLen, setTrailLen] = useState(800);

  // Display readouts (sampled from refs each frame)
  const [readout, setReadout] = useState({
    th1deg: 0,
    th2deg: 0,
    energyVal: 0,
    divergence: 0,
  });
  // Flash a hint when the integrator blows up and we auto-reset.
  const [blowupHint, setBlowupHint] = useState(false);
  // A bumpable counter we use to force the simulator effect to reinitialise
  // when the user presses "Reset".
  const [resetTick, setResetTick] = useState(0);

  // Simulation state in refs to avoid re-renders during the animation loop.
  const mainRef = useRef<PendulumState>({ th1: 0, th2: 0, w1: 0, w2: 0 });
  const ghostRef = useRef<PendulumState>({ th1: 0, th2: 0, w1: 0, w2: 0 });

  // Trails: ring buffers of canvas positions (x,y) for the lower bob.
  const mainTrailRef = useRef<Float32Array>(new Float32Array(0));
  const ghostTrailRef = useRef<Float32Array>(new Float32Array(0));
  const trailHeadRef = useRef(0);
  const trailCapRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = Math.floor(canvas.clientWidth * dpr);
      canvas.height = Math.floor(canvas.clientHeight * dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // (Re)initialise simulation state on (re)mount and when params/reset change.
    mainRef.current = { th1: initTh1, th2: initTh2, w1: 0, w2: 0 };
    ghostRef.current = { th1: initTh1 + 1e-6, th2: initTh2, w1: 0, w2: 0 };

    const cap = Math.max(50, Math.floor(trailLen));
    trailCapRef.current = cap;
    mainTrailRef.current = new Float32Array(cap * 2);
    ghostTrailRef.current = new Float32Array(cap * 2);
    trailHeadRef.current = 0;
    // Mark all trail slots as "empty" by using NaN sentinels.
    for (let i = 0; i < cap * 2; i++) {
      mainTrailRef.current[i] = Number.NaN;
      ghostTrailRef.current[i] = Number.NaN;
    }

    let raf = 0;
    let frameCounter = 0;

    const params: Params = { m1, m2, L1, L2, g };

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;

      // Background with subtle motion-trail dim (so the rods don't smear).
      ctx.fillStyle = "rgb(5, 6, 10)";
      ctx.fillRect(0, 0, W, H);

      // Integration: many small RK4 steps per frame for smoothness.
      if (running) {
        const targetSimSecPerFrame = (1 / 60) * speed;
        const steps = Math.max(1, Math.round(targetSimSecPerFrame / dt));
        for (let i = 0; i < steps; i++) {
          mainRef.current = rk4Step(mainRef.current, params, dt);
          if (showGhost) {
            ghostRef.current = rk4Step(ghostRef.current, params, dt);
          }
        }
        // Numerical blow-up guard: reset to initial state if the integrator
        // produces NaN or absurd angular velocities. Common at extreme IC.
        const m = mainRef.current;
        const g2 = ghostRef.current;
        const bad =
          !Number.isFinite(m.th1) ||
          !Number.isFinite(m.th2) ||
          !Number.isFinite(m.w1) ||
          !Number.isFinite(m.w2) ||
          Math.abs(m.w1) > 100 ||
          Math.abs(m.w2) > 100 ||
          !Number.isFinite(g2.th1) ||
          !Number.isFinite(g2.th2) ||
          !Number.isFinite(g2.w1) ||
          !Number.isFinite(g2.w2) ||
          Math.abs(g2.w1) > 100 ||
          Math.abs(g2.w2) > 100;
        if (bad) {
          mainRef.current = { th1: initTh1, th2: initTh2, w1: 0, w2: 0 };
          ghostRef.current = { th1: initTh1 + 1e-6, th2: initTh2, w1: 0, w2: 0 };
          // Clear trails so the reset doesn't leave a streak from the blow-up.
          const tcap = trailCapRef.current;
          for (let i = 0; i < tcap * 2; i++) {
            mainTrailRef.current[i] = Number.NaN;
            ghostTrailRef.current[i] = Number.NaN;
          }
          setBlowupHint(true);
          window.setTimeout(() => setBlowupHint(false), 1800);
        }
      }

      // World → screen mapping. Origin at top centre, y grows downward.
      const cx = W / 2;
      const cy = H * 0.35;
      const scale = dpr; // L1/L2 are already in CSS px

      const mPos = (s: PendulumState) => {
        const x1 = cx + L1 * scale * Math.sin(s.th1);
        const y1 = cy + L1 * scale * Math.cos(s.th1);
        const x2 = x1 + L2 * scale * Math.sin(s.th2);
        const y2 = y1 + L2 * scale * Math.cos(s.th2);
        return { x1, y1, x2, y2 };
      };

      const mainPos = mPos(mainRef.current);
      const ghostPos = mPos(ghostRef.current);

      // Record trail position for the lower bob (ring buffer).
      const cap = trailCapRef.current;
      if (running && cap > 0) {
        const h = trailHeadRef.current;
        mainTrailRef.current[h * 2] = mainPos.x2;
        mainTrailRef.current[h * 2 + 1] = mainPos.y2;
        ghostTrailRef.current[h * 2] = ghostPos.x2;
        ghostTrailRef.current[h * 2 + 1] = ghostPos.y2;
        trailHeadRef.current = (h + 1) % cap;
      }

      // Draw main trail (rose, fading from old → faint to new → bright).
      const drawTrail = (buf: Float32Array, r: number, gC: number, bC: number) => {
        const head = trailHeadRef.current;
        for (let i = 0; i < cap; i++) {
          const idx = ((head + i) % cap) * 2;
          const x = buf[idx];
          const y = buf[idx + 1];
          if (Number.isNaN(x)) continue;
          const t = i / cap; // 0 = oldest, 1 = newest
          const alpha = 0.05 + 0.55 * t;
          ctx.fillStyle = `rgba(${r}, ${gC}, ${bC}, ${alpha})`;
          ctx.fillRect(x - dpr, y - dpr, 2 * dpr, 2 * dpr);
        }
      };

      if (showGhost) {
        // cyan ghost trail behind so it doesn't dominate
        drawTrail(ghostTrailRef.current, 92, 222, 235);
      }
      // rose main trail
      drawTrail(mainTrailRef.current, 244, 114, 182);

      // Draw ghost rods/bobs first (so the main pendulum sits on top).
      const drawRig = (
        pos: { x1: number; y1: number; x2: number; y2: number },
        rodColor: string,
        bobColor: string,
        bobAlpha: number,
      ) => {
        ctx.strokeStyle = rodColor;
        ctx.lineWidth = 1.5 * dpr;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(pos.x1, pos.y1);
        ctx.lineTo(pos.x2, pos.y2);
        ctx.stroke();

        const r1 = 4 * dpr + Math.sqrt(m1) * 3 * dpr;
        const r2 = 4 * dpr + Math.sqrt(m2) * 3 * dpr;

        ctx.fillStyle = bobColor;
        ctx.globalAlpha = bobAlpha;
        ctx.beginPath();
        ctx.arc(pos.x1, pos.y1, r1, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(pos.x2, pos.y2, r2, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      };

      if (showGhost) {
        drawRig(ghostPos, "rgba(125, 211, 252, 0.35)", "rgba(125, 211, 252, 0.55)", 1);
      }
      drawRig(mainPos, "rgba(214, 220, 235, 0.85)", "rgba(244, 114, 182, 0.95)", 1);

      // Pivot dot
      ctx.fillStyle = "rgba(214, 220, 235, 1)";
      ctx.beginPath();
      ctx.arc(cx, cy, 3 * dpr, 0, Math.PI * 2);
      ctx.fill();

      // Sample readouts ~10 times per second
      frameCounter++;
      if (frameCounter % 6 === 0) {
        const s = mainRef.current;
        const ghost = ghostRef.current;
        const dx = mainPos.x2 - ghostPos.x2;
        const dy = mainPos.y2 - ghostPos.y2;
        // Convert pixel distance back to "world" units (CSS px) by dividing by dpr.
        const div = Math.sqrt(dx * dx + dy * dy) / dpr;
        setReadout({
          th1deg: ((s.th1 * 180) / Math.PI) % 360,
          th2deg: ((s.th2 * 180) / Math.PI) % 360,
          energyVal: energy(s, params),
          divergence: showGhost ? div : 0,
        });
        // touch ghost state to avoid an unused-binding lint if showGhost is false
        void ghost;
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
    // We intentionally re-run the whole effect when any of these change so
    // that the simulation reinitialises cleanly.
  }, [m1, m2, L1, L2, g, dt, speed, initTh1, initTh2, trailLen, running, showGhost, resetTick]);

  const handleReset = () => {
    setResetTick((n) => n + 1);
  };

  return (
    <main className="flex min-h-screen flex-col pt-14">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_420px]">
        <div className="relative min-h-[60vh] bg-ink-950 lg:min-h-[calc(100vh-3.5rem)]">
          <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />
          <div className="pointer-events-none absolute left-4 right-4 top-4 flex items-start justify-between gap-3">
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              θ₁ = {readout.th1deg.toFixed(1)}° · θ₂ = {readout.th2deg.toFixed(1)}°
            </div>
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-coral">
              E = {readout.energyVal.toFixed(2)}
              {showGhost ? ` · Δ = ${readout.divergence.toFixed(2)} px` : ""}
            </div>
          </div>
          {blowupHint && (
            <div className="glass pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-md border border-signal-amber/60 px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
              Numerical blow-up — resetting
            </div>
          )}
        </div>

        <aside className="hairline scrollbar-thin flex flex-col overflow-y-auto border-l bg-ink-900/40">
          <div className="hairline space-y-3 border-b p-6">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-coral">
              {topic.title}
            </div>
            <h1 className="math-italic text-3xl leading-tight text-ink-100">{topic.tagline}</h1>
            <p className="text-sm leading-relaxed text-ink-200">{topic.body}</p>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              m₁ — upper mass
            </div>
            <input
              type="range"
              value={m1}
              min={0.5}
              max={2}
              step={0.05}
              onChange={(e) => setM1(parseFloat(e.target.value))}
              className="w-full accent-signal-coral"
            />
            <div className="text-right font-mono text-[10px] text-ink-400">{m1.toFixed(2)}</div>

            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              m₂ — lower mass
            </div>
            <input
              type="range"
              value={m2}
              min={0.5}
              max={2}
              step={0.05}
              onChange={(e) => setM2(parseFloat(e.target.value))}
              className="w-full accent-signal-coral"
            />
            <div className="text-right font-mono text-[10px] text-ink-400">{m2.toFixed(2)}</div>

            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              L₁ — upper rod (px)
            </div>
            <input
              type="range"
              value={L1}
              min={40}
              max={200}
              step={1}
              onChange={(e) => setL1(parseFloat(e.target.value))}
              className="w-full accent-signal-coral"
            />
            <div className="text-right font-mono text-[10px] text-ink-400">{L1.toFixed(0)}</div>

            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              L₂ — lower rod (px)
            </div>
            <input
              type="range"
              value={L2}
              min={40}
              max={200}
              step={1}
              onChange={(e) => setL2(parseFloat(e.target.value))}
              className="w-full accent-signal-coral"
            />
            <div className="text-right font-mono text-[10px] text-ink-400">{L2.toFixed(0)}</div>

            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              g — gravity (px/s²)
            </div>
            <input
              type="range"
              value={g}
              min={200}
              max={2400}
              step={20}
              onChange={(e) => setG(parseFloat(e.target.value))}
              className="w-full accent-signal-coral"
            />
            <div className="text-right font-mono text-[10px] text-ink-400">{g.toFixed(0)}</div>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              θ₁ initial
            </div>
            <input
              type="range"
              value={initTh1}
              min={-Math.PI}
              max={Math.PI}
              step={0.01}
              onChange={(e) => setInitTh1(parseFloat(e.target.value))}
              className="w-full accent-signal-cyan"
            />
            <div className="text-right font-mono text-[10px] text-ink-400">
              {((initTh1 * 180) / Math.PI).toFixed(1)}°
            </div>
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              θ₂ initial
            </div>
            <input
              type="range"
              value={initTh2}
              min={-Math.PI}
              max={Math.PI}
              step={0.01}
              onChange={(e) => setInitTh2(parseFloat(e.target.value))}
              className="w-full accent-signal-cyan"
            />
            <div className="text-right font-mono text-[10px] text-ink-400">
              {((initTh2 * 180) / Math.PI).toFixed(1)}°
            </div>
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Speed (× real time)
            </div>
            <input
              type="range"
              value={speed}
              min={0.1}
              max={3}
              step={0.05}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="w-full accent-signal-cyan"
            />
            <div className="text-right font-mono text-[10px] text-ink-400">{speed.toFixed(2)}×</div>
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Time step dt
            </div>
            <input
              type="range"
              value={dt}
              min={0.001}
              max={0.02}
              step={0.0005}
              onChange={(e) => setDt(parseFloat(e.target.value))}
              className="w-full accent-signal-cyan"
            />
            <div className="text-right font-mono text-[10px] text-ink-400">{dt.toFixed(4)}</div>
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Trail length
            </div>
            <input
              type="range"
              value={trailLen}
              min={200}
              max={2000}
              step={10}
              onChange={(e) => setTrailLen(parseInt(e.target.value, 10))}
              className="w-full accent-signal-cyan"
            />
            <div className="text-right font-mono text-[10px] text-ink-400">{trailLen}</div>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setRunning((v) => !v)}
                className={`rounded-md border py-2 font-mono text-[11px] uppercase tracking-widest2 transition-colors ${
                  running
                    ? "border-signal-coral/60 bg-signal-coral/10 text-signal-coral"
                    : "border-signal-amber/60 bg-signal-amber/10 text-signal-amber"
                }`}
              >
                {running ? "❚❚ Pause" : "▶ Play"}
              </button>
              <button
                onClick={handleReset}
                className="hairline rounded-md border py-2 font-mono text-[11px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-signal-coral/40 hover:text-signal-coral"
              >
                ⟳ Reset
              </button>
            </div>
            <button
              onClick={() => setShowGhost((v) => !v)}
              className={`w-full rounded-md border py-2 font-mono text-[11px] uppercase tracking-widest2 transition-colors ${
                showGhost
                  ? "border-signal-cyan/60 bg-signal-cyan/10 text-signal-cyan"
                  : "hairline text-ink-300 hover:text-ink-100"
              }`}
            >
              {showGhost ? "Ghost twin · on" : "Ghost twin · off"}
            </button>
          </div>

          <div className="hairline space-y-2 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Readout
            </div>
            <div className="space-y-1 font-mono text-[11px] text-ink-200">
              <div>θ₁ = {readout.th1deg.toFixed(2)}°</div>
              <div>θ₂ = {readout.th2deg.toFixed(2)}°</div>
              <div>energy = {readout.energyVal.toFixed(3)}</div>
              <div>
                divergence = {showGhost ? `${readout.divergence.toFixed(3)} px` : "— (ghost off)"}
              </div>
            </div>
          </div>

          <div className="p-5">
            <Link
              href="/doublependulum"
              className="hairline block w-full rounded-md border py-2 text-center font-mono text-[10px] uppercase tracking-widest2 text-ink-300 transition-colors hover:border-signal-coral/40 hover:text-signal-coral"
            >
              {u.back}
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
