"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import type { Locale } from "@/lib/i18n/types";
import { useDpr } from "@/lib/hooks/useDpr";
import { palette } from "@/lib/visual/palette";

const TAU = Math.PI * 2;

const SPECIAL_ANGLES: Array<{ theta: number; label: string; z: string }> = [
  { theta: 0, label: "0", z: "1" },
  { theta: Math.PI / 2, label: "π/2", z: "i" },
  { theta: Math.PI, label: "π", z: "−1" },
  { theta: (3 * Math.PI) / 2, label: "3π/2", z: "−i" },
  { theta: TAU, label: "2π", z: "1" },
];

// --------------------------------------------------------------------------
// Per-locale UI strings for the explorer. Kept inline (the repo's RICH_EXPLORER
// pattern) so every control label, caption and aria-name is translated next to
// its use instead of leaking English into the other seven locales.
// --------------------------------------------------------------------------
type RichExplorer = {
  planeCaption: string;
  stripCaption: string;
  angleLabel: string;
  play: string;
  pause: string;
  reset: string;
  speedLabel: string;
  identityTitle: string;
  identityBody: string;
  ariaAngle: string;
  ariaSpeed: string;
  ariaPlane: string;
  ariaStrip: string;
};

const RICH_EXPLORER: Record<Locale, RichExplorer> = {
  en: {
    planeCaption: "Complex plane · unit circle",
    stripCaption: "cos θ and sin θ · θ ∈ [0, 2π]",
    angleLabel: "Angle θ",
    play: "▶ Play",
    pause: "❚❚ Pause",
    reset: "⟳ Reset",
    speedLabel: "Speed · rad/s",
    identityTitle: "The identity moment",
    identityBody: "At θ = π the point lands exactly at z = −1. Adding 1 gives 0:",
    ariaAngle: "angle theta",
    ariaSpeed: "animation speed in radians per second",
    ariaPlane: "complex plane with the point e^(i theta) on the unit circle",
    ariaStrip: "cos theta and sin theta plotted over 0 to 2 pi",
  },
  de: {
    planeCaption: "Komplexe Ebene · Einheitskreis",
    stripCaption: "cos θ und sin θ · θ ∈ [0, 2π]",
    angleLabel: "Winkel θ",
    play: "▶ Start",
    pause: "❚❚ Pause",
    reset: "⟳ Zurücksetzen",
    speedLabel: "Geschwindigkeit · rad/s",
    identityTitle: "Der Moment der Identität",
    identityBody: "Bei θ = π landet der Punkt genau auf z = −1. Addiert man 1, ergibt sich 0:",
    ariaAngle: "Winkel Theta",
    ariaSpeed: "Animationsgeschwindigkeit in Radiant pro Sekunde",
    ariaPlane: "Komplexe Ebene mit dem Punkt e^(i Theta) auf dem Einheitskreis",
    ariaStrip: "cos Theta und sin Theta aufgetragen über 0 bis 2 pi",
  },
  es: {
    planeCaption: "Plano complejo · círculo unidad",
    stripCaption: "cos θ y sin θ · θ ∈ [0, 2π]",
    angleLabel: "Ángulo θ",
    play: "▶ Reproducir",
    pause: "❚❚ Pausa",
    reset: "⟳ Reiniciar",
    speedLabel: "Velocidad · rad/s",
    identityTitle: "El momento de la identidad",
    identityBody: "En θ = π el punto cae exactamente en z = −1. Al sumar 1 se obtiene 0:",
    ariaAngle: "ángulo theta",
    ariaSpeed: "velocidad de la animación en radianes por segundo",
    ariaPlane: "plano complejo con el punto e^(i theta) en el círculo unidad",
    ariaStrip: "cos theta y sin theta representados de 0 a 2 pi",
  },
  fr: {
    planeCaption: "Plan complexe · cercle unité",
    stripCaption: "cos θ et sin θ · θ ∈ [0, 2π]",
    angleLabel: "Angle θ",
    play: "▶ Lecture",
    pause: "❚❚ Pause",
    reset: "⟳ Réinitialiser",
    speedLabel: "Vitesse · rad/s",
    identityTitle: "Le moment de l'identité",
    identityBody: "À θ = π le point tombe exactement sur z = −1. En ajoutant 1 on obtient 0 :",
    ariaAngle: "angle thêta",
    ariaSpeed: "vitesse de l'animation en radians par seconde",
    ariaPlane: "plan complexe avec le point e^(i thêta) sur le cercle unité",
    ariaStrip: "cos thêta et sin thêta tracés de 0 à 2 pi",
  },
  it: {
    planeCaption: "Piano complesso · cerchio unitario",
    stripCaption: "cos θ e sin θ · θ ∈ [0, 2π]",
    angleLabel: "Angolo θ",
    play: "▶ Avvia",
    pause: "❚❚ Pausa",
    reset: "⟳ Reimposta",
    speedLabel: "Velocità · rad/s",
    identityTitle: "Il momento dell'identità",
    identityBody: "A θ = π il punto cade esattamente su z = −1. Aggiungendo 1 si ottiene 0:",
    ariaAngle: "angolo theta",
    ariaSpeed: "velocità dell'animazione in radianti al secondo",
    ariaPlane: "piano complesso con il punto e^(i theta) sul cerchio unitario",
    ariaStrip: "cos theta e sin theta tracciati da 0 a 2 pi",
  },
  pt: {
    planeCaption: "Plano complexo · círculo unitário",
    stripCaption: "cos θ e sin θ · θ ∈ [0, 2π]",
    angleLabel: "Ângulo θ",
    play: "▶ Reproduzir",
    pause: "❚❚ Pausa",
    reset: "⟳ Repor",
    speedLabel: "Velocidade · rad/s",
    identityTitle: "O momento da identidade",
    identityBody: "Em θ = π o ponto cai exatamente em z = −1. Somando 1 obtém-se 0:",
    ariaAngle: "ângulo teta",
    ariaSpeed: "velocidade da animação em radianos por segundo",
    ariaPlane: "plano complexo com o ponto e^(i teta) no círculo unitário",
    ariaStrip: "cos teta e sin teta traçados de 0 a 2 pi",
  },
  sv: {
    planeCaption: "Komplexa planet · enhetscirkeln",
    stripCaption: "cos θ och sin θ · θ ∈ [0, 2π]",
    angleLabel: "Vinkel θ",
    play: "▶ Spela",
    pause: "❚❚ Paus",
    reset: "⟳ Återställ",
    speedLabel: "Hastighet · rad/s",
    identityTitle: "Identitetens ögonblick",
    identityBody: "Vid θ = π hamnar punkten exakt på z = −1. Adderar man 1 blir det 0:",
    ariaAngle: "vinkel theta",
    ariaSpeed: "animeringshastighet i radianer per sekund",
    ariaPlane: "komplexa planet med punkten e^(i theta) på enhetscirkeln",
    ariaStrip: "cos theta och sin theta uppritade över 0 till 2 pi",
  },
  no: {
    planeCaption: "Det komplekse planet · enhetssirkelen",
    stripCaption: "cos θ og sin θ · θ ∈ [0, 2π]",
    angleLabel: "Vinkel θ",
    play: "▶ Spill",
    pause: "❚❚ Pause",
    reset: "⟳ Nullstill",
    speedLabel: "Fart · rad/s",
    identityTitle: "Identitetens øyeblikk",
    identityBody: "Ved θ = π lander punktet nøyaktig på z = −1. Legger man til 1, blir det 0:",
    ariaAngle: "vinkel theta",
    ariaSpeed: "animasjonsfart i radianer per sekund",
    ariaPlane: "det komplekse planet med punktet e^(i theta) på enhetssirkelen",
    ariaStrip: "cos theta og sin theta tegnet over 0 til 2 pi",
  },
};

export default function EulerExplorer() {
  const { a, u, locale } = useI18n();
  const topic = a.topics.euler;
  const rx = RICH_EXPLORER[locale];
  const planeRef = useRef<HTMLCanvasElement | null>(null);
  const stripRef = useRef<HTMLCanvasElement | null>(null);
  const dpr = useDpr();

  const [theta, setTheta] = useState(0);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(0.6); // radians per second
  // Tick — incremented when Reset is pressed, used to clear the trail
  const [resetTick, setResetTick] = useState(0);

  const thetaRef = useRef(theta);
  thetaRef.current = theta;
  const speedRef = useRef(speed);
  speedRef.current = speed;

  // Animate θ only while running. The loop is gated on `running` so a paused
  // explorer schedules no frames at all. dt is clamped and θ is wrapped with a
  // modulo so a background-tab frame gap (rAF halts while hidden, then fires
  // once with the whole elapsed duration) can't fling θ far outside [0, 2π].
  useEffect(() => {
    if (!running) return;
    let raf = 0;
    let prev = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - prev) / 1000, 0.05);
      prev = now;
      const next = thetaRef.current + speedRef.current * dt;
      setTheta(((next % TAU) + TAU) % TAU);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running]);

  // Complex plane canvas
  useEffect(() => {
    const canvas = planeRef.current;
    if (!canvas) return;

    const render = () => {
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      // Only resize the backing store when it actually changed — reassigning
      // canvas.width/height every frame would reallocate the bitmap needlessly.
      const bw = Math.floor(W * dpr);
      const bh = Math.floor(H * dpr);
      if (canvas.width !== bw || canvas.height !== bh) {
        canvas.width = bw;
        canvas.height = bh;
      }
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = palette.canvas.bg;
      ctx.fillRect(0, 0, W, H);

      const cx = W / 2;
      const cy = H / 2;
      const R = Math.min(W, H) * 0.36;

      // Grid (faint)
      ctx.strokeStyle = "rgba(138,144,164,0.08)";
      ctx.lineWidth = 1;
      const gridStep = R / 2;
      for (let gx = cx - 4 * gridStep; gx <= W; gx += gridStep) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, H);
        ctx.stroke();
      }
      for (let gy = cy - 4 * gridStep; gy <= H; gy += gridStep) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(W, gy);
        ctx.stroke();
      }

      // Axes
      ctx.strokeStyle = "rgba(200, 205, 220, 0.45)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(0, cy);
      ctx.lineTo(W, cy);
      ctx.moveTo(cx, 0);
      ctx.lineTo(cx, H);
      ctx.stroke();

      // Axis labels
      ctx.fillStyle = "rgba(200, 205, 220, 0.65)";
      ctx.font = "11px ui-monospace, monospace";
      ctx.fillText("Re", W - 22, cy - 6);
      ctx.fillText("Im", cx + 6, 14);

      // Tick labels at ±1
      ctx.fillStyle = "rgba(138,144,164,0.7)";
      ctx.fillText("1", cx + R + 4, cy - 4);
      ctx.fillText("−1", cx - R - 18, cy - 4);
      ctx.fillText("i", cx + 6, cy - R + 2);
      ctx.fillText("−i", cx + 6, cy + R + 12);

      // Unit circle
      ctx.strokeStyle = "rgba(255, 209, 102, 0.35)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, TAU);
      ctx.stroke();

      // Trail — the swept arc from 0 → θ
      const t = thetaRef.current;
      ctx.strokeStyle = "rgba(255, 209, 102, 0.85)";
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      // canvas y is inverted, so we draw the arc clockwise on screen but
      // counter-clockwise in math coords by negating the angle
      ctx.arc(cx, cy, R, 0, -t, true);
      ctx.stroke();

      // Radius line from origin to point
      const px = cx + R * Math.cos(t);
      const py = cy - R * Math.sin(t);
      ctx.strokeStyle = "rgba(125, 243, 255, 0.85)";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(px, py);
      ctx.stroke();

      // Projection lines to axes (cos, sin)
      ctx.strokeStyle = "rgba(255, 122, 182, 0.35)";
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px, cy);
      ctx.moveTo(px, py);
      ctx.lineTo(cx, py);
      ctx.stroke();
      ctx.setLineDash([]);

      // The moving point — extra glow when at θ = π (the identity moment)
      const distFromPi = Math.abs(((t - Math.PI + Math.PI * 3) % TAU) - Math.PI);
      const atPi = distFromPi < 0.02;
      const glowR = atPi ? 16 : 8;
      const grad = ctx.createRadialGradient(px, py, 0, px, py, glowR);
      grad.addColorStop(0, atPi ? "rgba(255, 122, 182, 0.95)" : "rgba(255, 209, 102, 0.95)");
      grad.addColorStop(1, "rgba(255, 209, 102, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(px, py, glowR, 0, TAU);
      ctx.fill();
      ctx.fillStyle = atPi ? palette.signal.rose : palette.signal.amber;
      ctx.beginPath();
      ctx.arc(px, py, 4, 0, TAU);
      ctx.fill();

      // Labels overlay: θ in radians + degrees, cos, sin
      const cosT = Math.cos(t);
      const sinT = Math.sin(t);
      const lines = [
        `θ = ${t.toFixed(3)} rad  ·  ${((t * 180) / Math.PI).toFixed(1)}°`,
        `cos θ = ${cosT.toFixed(4)}`,
        `sin θ = ${sinT.toFixed(4)}`,
        `z = e^(iθ) = ${cosT.toFixed(3)} ${sinT >= 0 ? "+" : "−"} ${Math.abs(sinT).toFixed(3)} i`,
      ];
      ctx.fillStyle = "rgba(5, 6, 10, 0.7)";
      ctx.fillRect(12, H - 92, 290, 80);
      ctx.fillStyle = atPi ? palette.signal.rose : palette.signal.amber;
      ctx.font = "12px ui-monospace, monospace";
      for (let i = 0; i < lines.length; i++) {
        ctx.fillStyle =
          i === 0 ? (atPi ? palette.signal.rose : palette.signal.amber) : "rgba(225, 228, 240, 0.9)";
        ctx.fillText(lines[i], 20, H - 70 + i * 16);
      }

      // Big "Euler's identity moment" banner when at θ = π
      if (atPi) {
        ctx.fillStyle = "rgba(255, 122, 182, 0.12)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = palette.signal.rose;
        ctx.font = "bold 18px ui-monospace, monospace";
        const msg = "e^(iπ) + 1 = 0";
        const mw = ctx.measureText(msg).width;
        ctx.fillText(msg, cx - mw / 2, 32);
      }
    };

    render();
    // Re-render on size change; the θ dependency below repaints on every angle
    // change, so no perpetual rAF loop is needed (idle explorer draws nothing).
    const ro = new ResizeObserver(render);
    ro.observe(canvas);

    return () => {
      ro.disconnect();
    };
  }, [theta, resetTick, dpr]);

  // Strip canvas — cos θ and sin θ over [0, 2π]
  useEffect(() => {
    const canvas = stripRef.current;
    if (!canvas) return;

    const render = () => {
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      // Only resize when the backing store actually changed (see plane canvas).
      const bw = Math.floor(W * dpr);
      const bh = Math.floor(H * dpr);
      if (canvas.width !== bw || canvas.height !== bh) {
        canvas.width = bw;
        canvas.height = bh;
      }
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = palette.canvas.bg;
      ctx.fillRect(0, 0, W, H);

      const padL = 28;
      const padR = 12;
      const padT = 12;
      const padB = 18;
      const innerW = W - padL - padR;
      const innerH = H - padT - padB;
      const midY = padT + innerH / 2;

      // Zero axis
      ctx.strokeStyle = "rgba(200, 205, 220, 0.35)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padL, midY);
      ctx.lineTo(padL + innerW, midY);
      ctx.stroke();

      // Vertical gridlines at 0, π/2, π, 3π/2, 2π
      ctx.strokeStyle = "rgba(138,144,164,0.18)";
      ctx.fillStyle = "rgba(138,144,164,0.7)";
      ctx.font = "10px ui-monospace, monospace";
      const ticks: Array<[number, string]> = [
        [0, "0"],
        [Math.PI / 2, "π/2"],
        [Math.PI, "π"],
        [(3 * Math.PI) / 2, "3π/2"],
        [TAU, "2π"],
      ];
      for (const [v, label] of ticks) {
        const x = padL + (v / TAU) * innerW;
        ctx.beginPath();
        ctx.moveTo(x, padT);
        ctx.lineTo(x, padT + innerH);
        ctx.stroke();
        ctx.fillText(label, x - 8, H - 4);
      }

      // ±1 labels
      ctx.fillText("1", 6, padT + 8);
      ctx.fillText("0", 6, midY + 4);
      ctx.fillText("−1", 2, padT + innerH);

      const samples = 240;
      const plot = (fn: (x: number) => number, stroke: string) => {
        ctx.strokeStyle = stroke;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        for (let i = 0; i <= samples; i++) {
          const tt = (i / samples) * TAU;
          const x = padL + (tt / TAU) * innerW;
          const y = midY - fn(tt) * (innerH / 2);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      };
      // cos θ — amber
      plot(Math.cos, "rgba(255, 209, 102, 0.9)");
      // sin θ — cyan
      plot(Math.sin, "rgba(125, 243, 255, 0.9)");

      // Cursor at current θ
      const t = thetaRef.current;
      const cxLine = padL + (t / TAU) * innerW;
      ctx.strokeStyle = "rgba(255, 122, 182, 0.85)";
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(cxLine, padT);
      ctx.lineTo(cxLine, padT + innerH);
      ctx.stroke();
      // Dots on each curve at θ
      ctx.fillStyle = palette.signal.amber;
      ctx.beginPath();
      ctx.arc(cxLine, midY - Math.cos(t) * (innerH / 2), 3, 0, TAU);
      ctx.fill();
      ctx.fillStyle = palette.signal.cyan;
      ctx.beginPath();
      ctx.arc(cxLine, midY - Math.sin(t) * (innerH / 2), 3, 0, TAU);
      ctx.fill();

      // Legend
      ctx.fillStyle = "rgba(255, 209, 102, 0.9)";
      ctx.fillText("cos θ", padL + 6, padT + 12);
      ctx.fillStyle = "rgba(125, 243, 255, 0.9)";
      ctx.fillText("sin θ", padL + 54, padT + 12);
    };

    render();
    const ro = new ResizeObserver(render);
    ro.observe(canvas);

    return () => {
      ro.disconnect();
    };
  }, [theta, resetTick, dpr]);

  const reset = () => {
    setTheta(0);
    setResetTick((n) => n + 1);
  };

  return (
    <main className="flex min-h-screen flex-col pt-14">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_420px]">
        <div className="relative flex min-h-[60vh] flex-col gap-4 bg-ink-950 p-4 lg:min-h-[calc(100vh-3.5rem)] lg:p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              {rx.planeCaption}
            </div>
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-teal">
              e^(iθ) = cos θ + i sin θ
            </div>
          </div>
          <div className="hairline flex-1 overflow-hidden rounded-2xl border bg-ink-950">
            <canvas
              ref={planeRef}
              className="block h-full w-full"
              role="img"
              aria-label={rx.ariaPlane}
            />
          </div>
          <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
            {rx.stripCaption}
          </div>
          <div className="hairline h-40 overflow-hidden rounded-2xl border bg-ink-950">
            <canvas
              ref={stripRef}
              className="block h-full w-full"
              role="img"
              aria-label={rx.ariaStrip}
            />
          </div>
        </div>

        <aside className="hairline scrollbar-thin flex flex-col overflow-y-auto border-l bg-ink-900/40">
          <div className="hairline space-y-3 border-b p-6">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-teal">
              {topic.title}
            </div>
            <h1 className="math-italic text-3xl leading-tight text-ink-100">{topic.tagline}</h1>
            <p className="text-sm leading-relaxed text-ink-200">{topic.body}</p>
          </div>

          <div className="hairline space-y-4 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {rx.angleLabel}
            </div>
            <div className="flex items-center justify-between font-mono text-sm">
              <span className="text-signal-teal">{theta.toFixed(3)} rad</span>
              <span className="text-ink-300">{((theta * 180) / Math.PI).toFixed(1)}°</span>
            </div>
            <input
              type="range"
              value={theta}
              min={0}
              max={TAU}
              step={0.01}
              onChange={(e) => setTheta(parseFloat(e.target.value))}
              className="w-full accent-signal-teal"
              aria-label={rx.ariaAngle}
            />
            <div className="grid grid-cols-5 gap-2">
              {SPECIAL_ANGLES.map((a2) => {
                const active = Math.abs(theta - a2.theta) < 0.02;
                return (
                  <button
                    key={a2.label}
                    onClick={() => setTheta(a2.theta)}
                    className={`rounded-md border px-1 py-2 text-center transition-colors ${
                      active
                        ? "border-signal-teal/60 bg-signal-teal/10 text-signal-teal"
                        : "hairline text-ink-200 hover:border-signal-teal/40 hover:text-ink-100"
                    }`}
                  >
                    <div className="font-mono text-[11px]">{a2.label}</div>
                    <div className="mt-0.5 font-mono text-[9px] text-ink-400">z = {a2.z}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="flex gap-2">
              <button
                onClick={() => setRunning((v) => !v)}
                className={`flex-1 rounded-md border py-2 font-mono text-[11px] uppercase tracking-widest2 transition-colors ${
                  running
                    ? "border-signal-rose/60 bg-signal-rose/10 text-signal-rose"
                    : "border-signal-teal/60 bg-signal-teal/10 text-signal-teal"
                }`}
              >
                {running ? rx.pause : rx.play}
              </button>
              <button
                onClick={reset}
                className="hairline flex-1 rounded-md border py-2 font-mono text-[11px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-signal-teal/40 hover:text-signal-teal"
              >
                {rx.reset}
              </button>
            </div>
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {rx.speedLabel}
            </div>
            <input
              type="range"
              value={speed}
              min={0.05}
              max={3}
              step={0.05}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="w-full accent-signal-teal"
              aria-label={rx.ariaSpeed}
            />
            <div className="text-right font-mono text-[10px] text-ink-400">
              {speed.toFixed(2)} rad/s
            </div>
          </div>

          <div className="hairline space-y-2 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {rx.identityTitle}
            </div>
            <p className="text-sm leading-relaxed text-ink-200">
              {rx.identityBody}
              <span className="mt-2 block font-mono text-signal-teal">e^(iπ) + 1 = 0</span>
            </p>
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
