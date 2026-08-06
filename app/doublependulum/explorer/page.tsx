"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { useDpr } from "@/lib/hooks/useDpr";
import type { Locale } from "@/lib/i18n/types";

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

// Localised control-panel strings. The story page ships a full 8-locale
// RICH_STORY; the explorer mirrors that with a local RICH_EXPLORER so a German
// or French visitor does not meet an all-English panel. New keys must be filled
// for every locale (no EN fallback leaking under a non-en key).
type ExplorerStrings = {
  canvasLabel: string;
  m1: string;
  m2: string;
  l1: string;
  l2: string;
  g: string;
  th1: string;
  th2: string;
  speed: string;
  dt: string;
  trail: string;
  pause: string;
  play: string;
  reset: string;
  ghostOn: string;
  ghostOff: string;
  readout: string;
  energyWord: string;
  divergenceWord: string;
  ghostOffShort: string;
  blowup: string;
};

const RICH_EXPLORER: Record<Locale, ExplorerStrings> = {
  en: {
    canvasLabel: "Live double pendulum with an optional ghost twin",
    m1: "m₁ · upper mass",
    m2: "m₂ · lower mass",
    l1: "L₁ · upper rod (px)",
    l2: "L₂ · lower rod (px)",
    g: "g · gravity (px/s²)",
    th1: "θ₁ initial",
    th2: "θ₂ initial",
    speed: "Speed (× real time)",
    dt: "Time step dt",
    trail: "Trail length",
    pause: "❚❚ Pause",
    play: "▶ Play",
    reset: "⟳ Reset",
    ghostOn: "Ghost twin · on",
    ghostOff: "Ghost twin · off",
    readout: "Readout",
    energyWord: "energy",
    divergenceWord: "divergence",
    ghostOffShort: "(ghost off)",
    blowup: "Numerical blow-up, resetting",
  },
  de: {
    canvasLabel: "Live-Doppelpendel mit optionalem Geisterzwilling",
    m1: "m₁ · obere Masse",
    m2: "m₂ · untere Masse",
    l1: "L₁ · oberer Stab (px)",
    l2: "L₂ · unterer Stab (px)",
    g: "g · Schwerkraft (px/s²)",
    th1: "θ₁ Startwinkel",
    th2: "θ₂ Startwinkel",
    speed: "Tempo (× Echtzeit)",
    dt: "Zeitschritt dt",
    trail: "Spurlänge",
    pause: "❚❚ Pause",
    play: "▶ Start",
    reset: "⟳ Zurück",
    ghostOn: "Geisterzwilling · an",
    ghostOff: "Geisterzwilling · aus",
    readout: "Anzeige",
    energyWord: "Energie",
    divergenceWord: "Divergenz",
    ghostOffShort: "(Geist aus)",
    blowup: "Numerischer Überlauf, wird zurückgesetzt",
  },
  es: {
    canvasLabel: "Péndulo doble en vivo con un gemelo fantasma opcional",
    m1: "m₁ · masa superior",
    m2: "m₂ · masa inferior",
    l1: "L₁ · varilla superior (px)",
    l2: "L₂ · varilla inferior (px)",
    g: "g · gravedad (px/s²)",
    th1: "θ₁ inicial",
    th2: "θ₂ inicial",
    speed: "Velocidad (× tiempo real)",
    dt: "Paso de tiempo dt",
    trail: "Longitud de traza",
    pause: "❚❚ Pausa",
    play: "▶ Reproducir",
    reset: "⟳ Reiniciar",
    ghostOn: "Gemelo fantasma · sí",
    ghostOff: "Gemelo fantasma · no",
    readout: "Lectura",
    energyWord: "energía",
    divergenceWord: "divergencia",
    ghostOffShort: "(sin fantasma)",
    blowup: "Desbordamiento numérico, reiniciando",
  },
  fr: {
    canvasLabel: "Pendule double en direct avec un jumeau fantôme optionnel",
    m1: "m₁ · masse supérieure",
    m2: "m₂ · masse inférieure",
    l1: "L₁ · tige supérieure (px)",
    l2: "L₂ · tige inférieure (px)",
    g: "g · gravité (px/s²)",
    th1: "θ₁ initial",
    th2: "θ₂ initial",
    speed: "Vitesse (× temps réel)",
    dt: "Pas de temps dt",
    trail: "Longueur de traînée",
    pause: "❚❚ Pause",
    play: "▶ Lecture",
    reset: "⟳ Réinit.",
    ghostOn: "Jumeau fantôme · activé",
    ghostOff: "Jumeau fantôme · désactivé",
    readout: "Affichage",
    energyWord: "énergie",
    divergenceWord: "divergence",
    ghostOffShort: "(sans fantôme)",
    blowup: "Explosion numérique, réinitialisation",
  },
  it: {
    canvasLabel: "Pendolo doppio dal vivo con un gemello fantasma opzionale",
    m1: "m₁ · massa superiore",
    m2: "m₂ · massa inferiore",
    l1: "L₁ · asta superiore (px)",
    l2: "L₂ · asta inferiore (px)",
    g: "g · gravità (px/s²)",
    th1: "θ₁ iniziale",
    th2: "θ₂ iniziale",
    speed: "Velocità (× tempo reale)",
    dt: "Passo temporale dt",
    trail: "Lunghezza scia",
    pause: "❚❚ Pausa",
    play: "▶ Play",
    reset: "⟳ Reset",
    ghostOn: "Gemello fantasma · on",
    ghostOff: "Gemello fantasma · off",
    readout: "Lettura",
    energyWord: "energia",
    divergenceWord: "divergenza",
    ghostOffShort: "(senza fantasma)",
    blowup: "Overflow numerico, ripristino",
  },
  pt: {
    canvasLabel: "Pêndulo duplo ao vivo com um gêmeo fantasma opcional",
    m1: "m₁ · massa superior",
    m2: "m₂ · massa inferior",
    l1: "L₁ · haste superior (px)",
    l2: "L₂ · haste inferior (px)",
    g: "g · gravidade (px/s²)",
    th1: "θ₁ inicial",
    th2: "θ₂ inicial",
    speed: "Velocidade (× tempo real)",
    dt: "Passo de tempo dt",
    trail: "Comprimento da trilha",
    pause: "❚❚ Pausa",
    play: "▶ Tocar",
    reset: "⟳ Reset",
    ghostOn: "Gêmeo fantasma · sim",
    ghostOff: "Gêmeo fantasma · não",
    readout: "Leitura",
    energyWord: "energia",
    divergenceWord: "divergência",
    ghostOffShort: "(sem fantasma)",
    blowup: "Estouro numérico, reiniciando",
  },
  sv: {
    canvasLabel: "Dubbelpendel live med en valfri spöktvilling",
    m1: "m₁ · övre massa",
    m2: "m₂ · undre massa",
    l1: "L₁ · övre stång (px)",
    l2: "L₂ · undre stång (px)",
    g: "g · gravitation (px/s²)",
    th1: "θ₁ start",
    th2: "θ₂ start",
    speed: "Hastighet (× realtid)",
    dt: "Tidssteg dt",
    trail: "Spårlängd",
    pause: "❚❚ Paus",
    play: "▶ Spela",
    reset: "⟳ Återställ",
    ghostOn: "Spöktvilling · på",
    ghostOff: "Spöktvilling · av",
    readout: "Avläsning",
    energyWord: "energi",
    divergenceWord: "divergens",
    ghostOffShort: "(spöke av)",
    blowup: "Numeriskt överslag, återställer",
  },
  no: {
    canvasLabel: "Dobbeltpendel live med en valgfri spøkelsestvilling",
    m1: "m₁ · øvre masse",
    m2: "m₂ · nedre masse",
    l1: "L₁ · øvre stang (px)",
    l2: "L₂ · nedre stang (px)",
    g: "g · tyngdekraft (px/s²)",
    th1: "θ₁ start",
    th2: "θ₂ start",
    speed: "Fart (× sanntid)",
    dt: "Tidssteg dt",
    trail: "Sporlengde",
    pause: "❚❚ Pause",
    play: "▶ Spill",
    reset: "⟳ Nullstill",
    ghostOn: "Spøkelsestvilling · på",
    ghostOff: "Spøkelsestvilling · av",
    readout: "Avlesning",
    energyWord: "energi",
    divergenceWord: "divergens",
    ghostOffShort: "(spøkelse av)",
    blowup: "Numerisk overflyt, nullstiller",
  },
};

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

// Fresh trail ring buffer with NaN sentinels marking empty slots.
function newTrail(cap: number): Float32Array {
  const t = new Float32Array(cap * 2);
  t.fill(Number.NaN);
  return t;
}

export default function DoublePendulumExplorer() {
  const { a, u, locale } = useI18n();
  const topic = a.topics.doublependulum;
  const ex = RICH_EXPLORER[locale] ?? RICH_EXPLORER.en;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dpr = useDpr();

  // Sliders / controls
  const [m1, setM1] = useState(1);
  const [m2, setM2] = useState(1);
  const [L1, setL1] = useState(120);
  const [L2, setL2] = useState(120);
  // g is in px/s² because L is in pixels, so both must share the same length
  // unit, otherwise the natural period 2π√(L/g) blows up. With L≈120 px,
  // g≈1000 px/s² gives a ~2.2 s pendulum period, which reads as a real pendulum.
  const [g, setG] = useState(1000);
  const [initTh1, setInitTh1] = useState(Math.PI / 2);
  const [initTh2, setInitTh2] = useState(Math.PI / 2);
  const [dt, setDt] = useState(0.005);
  // Wall-clock speed multiplier. 1.0 ≈ real time (matches the story sim),
  // higher = faster, lower = slow-motion. The rAF loop advances by real
  // elapsed time × speed and carries the fractional remainder, so even the
  // slow end of the slider integrates correctly at any display refresh rate.
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
  // A bumpable counter we use to force the simulator to reinitialise
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

  // Playback controls and physical params mirrored into refs so the single
  // rAF loop can read live values without being torn down and restarted.
  // Reading `running`/`showGhost`/`speed` from refs is what makes Pause freeze
  // the sim instead of snapping it back to the initial pose (a separate effect,
  // keyed on physical params + resetTick, is the only thing that re-seeds it).
  const runningRef = useRef(running);
  const showGhostRef = useRef(showGhost);
  const speedRef = useRef(speed);
  const trailLenRef = useRef(trailLen);
  const paramsRef = useRef({ m1, m2, L1, L2, g, dt, initTh1, initTh2 });

  useEffect(() => {
    runningRef.current = running;
  }, [running]);
  useEffect(() => {
    showGhostRef.current = showGhost;
  }, [showGhost]);
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);
  useEffect(() => {
    paramsRef.current = { m1, m2, L1, L2, g, dt, initTh1, initTh2 };
  }, [m1, m2, L1, L2, g, dt, initTh1, initTh2]);

  // Respect prefers-reduced-motion: start paused and render a single static
  // frame; Play stays available as an explicit opt-in.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRunning(false);
    }
  }, []);

  // Re-seed the physics on the physical parameters, the initial angles, and
  // Reset only. Playback controls (running, speed, ghost, trail length) are
  // deliberately absent so they never wipe the run in progress.
  useEffect(() => {
    mainRef.current = { th1: initTh1, th2: initTh2, w1: 0, w2: 0 };
    ghostRef.current = { th1: initTh1 + 1e-6, th2: initTh2, w1: 0, w2: 0 };
    const cap = Math.max(50, Math.floor(trailLenRef.current));
    trailCapRef.current = cap;
    mainTrailRef.current = newTrail(cap);
    ghostTrailRef.current = newTrail(cap);
    trailHeadRef.current = 0;
  }, [m1, m2, L1, L2, g, initTh1, initTh2, resetTick]);

  // Trail-length changes only resize the ring buffer; the physics (and the
  // accumulated divergence) are left untouched.
  useEffect(() => {
    trailLenRef.current = trailLen;
    const cap = Math.max(50, Math.floor(trailLen));
    trailCapRef.current = cap;
    mainTrailRef.current = newTrail(cap);
    ghostTrailRef.current = newTrail(cap);
    trailHeadRef.current = 0;
  }, [trailLen]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = Math.floor(canvas.clientWidth * dpr);
      canvas.height = Math.floor(canvas.clientHeight * dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let raf = 0;
    let frameCounter = 0;
    // Advance by real elapsed time × speed, carrying the fractional remainder,
    // so the sim runs at the labelled rate on 60 Hz and 120 Hz displays and the
    // slow end of the Speed slider is actually reachable at any dt.
    let last = performance.now();
    let acc = 0;

    const draw = (now: number) => {
      const p = paramsRef.current;
      const params: Params = { m1: p.m1, m2: p.m2, L1: p.L1, L2: p.L2, g: p.g };
      const dtStep = p.dt;
      const W = canvas.width;
      const H = canvas.height;

      // Background with subtle motion-trail dim (so the rods don't smear).
      ctx.fillStyle = "rgb(5, 6, 10)";
      ctx.fillRect(0, 0, W, H);

      // Integration: many small RK4 steps per frame for smoothness.
      if (runningRef.current) {
        // Clamp the frame delta so a backgrounded tab does not integrate a huge
        // jump on return.
        const dtReal = Math.min((now - last) / 1000, 0.05);
        acc += dtReal * speedRef.current;
        let steps = Math.floor(acc / dtStep);
        const maxSteps = 2000;
        if (steps > maxSteps) {
          steps = maxSteps;
          acc = 0;
        } else {
          acc -= steps * dtStep;
        }
        for (let i = 0; i < steps; i++) {
          mainRef.current = rk4Step(mainRef.current, params, dtStep);
          if (showGhostRef.current) {
            ghostRef.current = rk4Step(ghostRef.current, params, dtStep);
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
          mainRef.current = { th1: p.initTh1, th2: p.initTh2, w1: 0, w2: 0 };
          ghostRef.current = { th1: p.initTh1 + 1e-6, th2: p.initTh2, w1: 0, w2: 0 };
          // Clear trails so the reset doesn't leave a streak from the blow-up.
          const tcap = trailCapRef.current;
          for (let i = 0; i < tcap * 2; i++) {
            mainTrailRef.current[i] = Number.NaN;
            ghostTrailRef.current[i] = Number.NaN;
          }
          acc = 0;
          setBlowupHint(true);
          window.setTimeout(() => setBlowupHint(false), 1800);
        }
      }
      last = now;

      // World → screen mapping. Origin at top centre, y grows downward.
      const cx = W / 2;
      const cy = H * 0.35;
      const scale = dpr; // L1/L2 are already in CSS px

      const mPos = (s: PendulumState) => {
        const x1 = cx + p.L1 * scale * Math.sin(s.th1);
        const y1 = cy + p.L1 * scale * Math.cos(s.th1);
        const x2 = x1 + p.L2 * scale * Math.sin(s.th2);
        const y2 = y1 + p.L2 * scale * Math.cos(s.th2);
        return { x1, y1, x2, y2 };
      };

      const mainPos = mPos(mainRef.current);
      const ghostPos = mPos(ghostRef.current);
      const ghostOn = showGhostRef.current;

      // Record trail position for the lower bob (ring buffer). Only while
      // running, otherwise a paused sim erodes the trail with frozen samples.
      const cap = trailCapRef.current;
      if (runningRef.current && cap > 0) {
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

      if (ghostOn) {
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

        const r1 = 4 * dpr + Math.sqrt(p.m1) * 3 * dpr;
        const r2 = 4 * dpr + Math.sqrt(p.m2) * 3 * dpr;

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

      if (ghostOn) {
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
        const dx = mainPos.x2 - ghostPos.x2;
        const dy = mainPos.y2 - ghostPos.y2;
        // Convert pixel distance back to "world" units (CSS px) by dividing by dpr.
        const div = Math.sqrt(dx * dx + dy * dy) / dpr;
        setReadout({
          th1deg: ((s.th1 * 180) / Math.PI) % 360,
          th2deg: ((s.th2 * 180) / Math.PI) % 360,
          energyVal: energy(s, params),
          divergence: ghostOn ? div : 0,
        });
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
    // The loop reads params/playback state from refs, so it only needs to be
    // rebuilt when the device pixel ratio changes.
  }, [dpr]);

  const handleReset = () => {
    setResetTick((n) => n + 1);
  };

  return (
    <main className="flex min-h-screen flex-col pt-14">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_420px]">
        <div className="relative min-h-[60vh] bg-ink-950 lg:min-h-[calc(100vh-3.5rem)]">
          <canvas
            ref={canvasRef}
            role="img"
            aria-label={ex.canvasLabel}
            className="absolute inset-0 block h-full w-full"
          />
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
              {ex.blowup}
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
              {ex.m1}
            </div>
            <input
              type="range"
              value={m1}
              min={0.5}
              max={2}
              step={0.05}
              onChange={(e) => setM1(parseFloat(e.target.value))}
              aria-label={ex.m1}
              className="w-full accent-signal-coral"
            />
            <div className="text-right font-mono text-[10px] text-ink-400">{m1.toFixed(2)}</div>

            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {ex.m2}
            </div>
            <input
              type="range"
              value={m2}
              min={0.5}
              max={2}
              step={0.05}
              onChange={(e) => setM2(parseFloat(e.target.value))}
              aria-label={ex.m2}
              className="w-full accent-signal-coral"
            />
            <div className="text-right font-mono text-[10px] text-ink-400">{m2.toFixed(2)}</div>

            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {ex.l1}
            </div>
            <input
              type="range"
              value={L1}
              min={40}
              max={200}
              step={1}
              onChange={(e) => setL1(parseFloat(e.target.value))}
              aria-label={ex.l1}
              className="w-full accent-signal-coral"
            />
            <div className="text-right font-mono text-[10px] text-ink-400">{L1.toFixed(0)}</div>

            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {ex.l2}
            </div>
            <input
              type="range"
              value={L2}
              min={40}
              max={200}
              step={1}
              onChange={(e) => setL2(parseFloat(e.target.value))}
              aria-label={ex.l2}
              className="w-full accent-signal-coral"
            />
            <div className="text-right font-mono text-[10px] text-ink-400">{L2.toFixed(0)}</div>

            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {ex.g}
            </div>
            <input
              type="range"
              value={g}
              min={200}
              max={2400}
              step={20}
              onChange={(e) => setG(parseFloat(e.target.value))}
              aria-label={ex.g}
              className="w-full accent-signal-coral"
            />
            <div className="text-right font-mono text-[10px] text-ink-400">{g.toFixed(0)}</div>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {ex.th1}
            </div>
            <input
              type="range"
              value={initTh1}
              min={-Math.PI}
              max={Math.PI}
              step={0.01}
              onChange={(e) => setInitTh1(parseFloat(e.target.value))}
              aria-label={ex.th1}
              className="w-full accent-signal-cyan"
            />
            <div className="text-right font-mono text-[10px] text-ink-400">
              {((initTh1 * 180) / Math.PI).toFixed(1)}°
            </div>
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {ex.th2}
            </div>
            <input
              type="range"
              value={initTh2}
              min={-Math.PI}
              max={Math.PI}
              step={0.01}
              onChange={(e) => setInitTh2(parseFloat(e.target.value))}
              aria-label={ex.th2}
              className="w-full accent-signal-cyan"
            />
            <div className="text-right font-mono text-[10px] text-ink-400">
              {((initTh2 * 180) / Math.PI).toFixed(1)}°
            </div>
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {ex.speed}
            </div>
            <input
              type="range"
              value={speed}
              min={0.1}
              max={3}
              step={0.05}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              aria-label={ex.speed}
              className="w-full accent-signal-cyan"
            />
            <div className="text-right font-mono text-[10px] text-ink-400">{speed.toFixed(2)}×</div>
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {ex.dt}
            </div>
            <input
              type="range"
              value={dt}
              min={0.001}
              max={0.02}
              step={0.0005}
              onChange={(e) => setDt(parseFloat(e.target.value))}
              aria-label={ex.dt}
              className="w-full accent-signal-cyan"
            />
            <div className="text-right font-mono text-[10px] text-ink-400">{dt.toFixed(4)}</div>
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {ex.trail}
            </div>
            <input
              type="range"
              value={trailLen}
              min={200}
              max={2000}
              step={10}
              onChange={(e) => setTrailLen(parseInt(e.target.value, 10))}
              aria-label={ex.trail}
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
                {running ? ex.pause : ex.play}
              </button>
              <button
                onClick={handleReset}
                className="hairline rounded-md border py-2 font-mono text-[11px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-signal-coral/40 hover:text-signal-coral"
              >
                {ex.reset}
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
              {showGhost ? ex.ghostOn : ex.ghostOff}
            </button>
          </div>

          <div className="hairline space-y-2 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {ex.readout}
            </div>
            <div className="space-y-1 font-mono text-[11px] text-ink-200">
              <div>θ₁ = {readout.th1deg.toFixed(2)}°</div>
              <div>θ₂ = {readout.th2deg.toFixed(2)}°</div>
              <div>
                {ex.energyWord} = {readout.energyVal.toFixed(3)}
              </div>
              <div>
                {ex.divergenceWord} ={" "}
                {showGhost ? `${readout.divergence.toFixed(3)} px` : ex.ghostOffShort}
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
