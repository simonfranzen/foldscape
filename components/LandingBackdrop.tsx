"use client";

import { useEffect, useRef } from "react";

// Fourier-style harmonic interference: a handful of sine waves with different
// frequencies, amplitudes and phase-drift rates, composited additively. Smooth,
// continuous motion — no pixel grid, no per-frame discretisation jank.

type Harmonic = {
  freq: number; // cycles across the canvas width
  amp: number; // 0..1, fraction of half-height
  phase: number; // current phase
  phaseRate: number; // radians per second
  yOffset: number; // -1..1, fraction of half-height
  color: string; // rgb stroke
  width: number; // line width in css px
};

const HARMONICS: Harmonic[] = [
  {
    freq: 1.0,
    amp: 0.32,
    phase: 0.0,
    phaseRate: 0.18,
    yOffset: -0.72,
    color: "125, 243, 255",
    width: 1.4,
  }, // cyan, top
  {
    freq: 1.7,
    amp: 0.26,
    phase: 1.3,
    phaseRate: -0.22,
    yOffset: -0.42,
    color: "179, 136, 255",
    width: 1.2,
  }, // violet, upper
  {
    freq: 2.4,
    amp: 0.22,
    phase: 2.7,
    phaseRate: 0.27,
    yOffset: -0.18,
    color: "255, 209, 102",
    width: 1.0,
  }, // amber, mid-upper
  {
    freq: 3.3,
    amp: 0.22,
    phase: 0.9,
    phaseRate: -0.31,
    yOffset: 0.22,
    color: "255, 122, 158",
    width: 0.9,
  }, // rose, mid-lower
  {
    freq: 5.1,
    amp: 0.2,
    phase: 2.1,
    phaseRate: 0.36,
    yOffset: 0.48,
    color: "125, 243, 255",
    width: 0.8,
  }, // cyan harmonic
  {
    freq: 7.7,
    amp: 0.14,
    phase: 1.7,
    phaseRate: -0.42,
    yOffset: 0.74,
    color: "179, 136, 255",
    width: 0.7,
  }, // violet harmonic, bottom
];

export function LandingBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true })!;
    let raf = 0;
    let lastT = performance.now();
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(canvas.clientWidth * dpr);
      canvas.height = Math.floor(canvas.clientHeight * dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - lastT) / 1000);
      lastT = now;

      const W = canvas.width;
      const H = canvas.height;
      const midY = H / 2;
      const halfH = H / 2;

      // Soft trail: fade previous frame instead of clearing — gives waves a
      // glowing afterimage without smearing the layout below.
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(5, 6, 10, 0.12)";
      ctx.fillRect(0, 0, W, H);

      // Slow lateral drift makes the whole field breathe.
      const tDrift = now / 1000;
      const xDrift = Math.sin(tDrift * 0.08) * W * 0.08;

      ctx.globalCompositeOperation = "lighter";

      // One sample every ~3 css pixels — plenty for smooth curves.
      const sampleStep = Math.max(2, Math.floor(3 * dpr));
      const samples = Math.ceil(W / sampleStep) + 1;

      for (const h of HARMONICS) {
        if (!reducedMotion) h.phase += h.phaseRate * dt;
        const baseY = midY + h.yOffset * halfH * 0.6;
        const amp = h.amp * halfH * 0.55;
        const k = (h.freq * Math.PI * 2) / W;

        ctx.beginPath();
        for (let i = 0; i < samples; i++) {
          const x = i * sampleStep;
          // Amplitude envelope: gentle taper at the edges so waves fade in/out
          // rather than slamming the canvas border.
          const u = x / W;
          const env = Math.sin(Math.PI * u);
          const y = baseY + Math.sin((x + xDrift) * k + h.phase) * amp * env;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(${h.color}, 0.42)`;
        ctx.lineWidth = h.width * dpr;
        ctx.shadowColor = `rgba(${h.color}, 0.45)`;
        ctx.shadowBlur = 7 * dpr;
        ctx.stroke();
      }

      ctx.shadowBlur = 0;
      ctx.globalCompositeOperation = "source-over";

      // Vignette to settle the edges into the page bg.
      const grad = ctx.createRadialGradient(
        W / 2,
        H / 2,
        H * 0.15,
        W / 2,
        H / 2,
        Math.max(W, H) * 0.65,
      );
      grad.addColorStop(0, "rgba(5, 6, 10, 0)");
      grad.addColorStop(1, "rgba(5, 6, 10, 0.85)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />;
}
