"use client";

import { useEffect, useRef, useState } from "react";
import { useDpr } from "@/lib/hooks/useDpr";
import { palette } from "@/lib/visual/palette";

// Static demonstration of the De Moivre–Laplace convergence: binomial PMF
// (cyan bars) with the matching Gaussian density (violet curve) for any N
// from 4 to 40. Slide N up — the bars stop being a staircase and start
// being a bell.

interface Props {
  caption?: string;
  nLabel?: string;
  hint?: string;
  legendBinomial?: string;
  legendNormal?: string;
}

// log of binomial coefficient via log-gamma — avoids overflow for N up to 40.
const LOG_FACT: number[] = [];
function logFact(n: number): number {
  if (LOG_FACT[n] !== undefined) return LOG_FACT[n];
  let s = 0;
  for (let i = 2; i <= n; i++) s += Math.log(i);
  LOG_FACT[n] = s;
  return s;
}

function binomialPMF(N: number, k: number, p = 0.5): number {
  if (k < 0 || k > N) return 0;
  const logC = logFact(N) - logFact(k) - logFact(N - k);
  return Math.exp(logC + k * Math.log(p) + (N - k) * Math.log(1 - p));
}

export function GaltonNormalOverlay({
  caption,
  nLabel = "N",
  hint,
  legendBinomial = "binomial",
  legendNormal = "normal",
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dpr = useDpr();
  const [N, setN] = useState(10);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = Math.floor(canvas.clientWidth * dpr);
      canvas.height = Math.floor(canvas.clientHeight * dpr);
      draw();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    function draw() {
      const W = canvas!.width;
      const H = canvas!.height;
      const margin = 26 * dpr;
      const plotW = W - margin * 2;
      const plotH = H - margin * 2;

      ctx!.fillStyle = palette.canvas.bg;
      ctx!.fillRect(0, 0, W, H);

      // baseline
      ctx!.strokeStyle = "rgba(232, 234, 242, 0.12)";
      ctx!.lineWidth = 1;
      ctx!.beginPath();
      ctx!.moveTo(margin, H - margin);
      ctx!.lineTo(W - margin, H - margin);
      ctx!.stroke();

      // compute PMF and matching normal
      const pmf: number[] = [];
      let maxP = 0;
      for (let k = 0; k <= N; k++) {
        const p = binomialPMF(N, k);
        pmf.push(p);
        if (p > maxP) maxP = p;
      }
      const mu = N / 2;
      const sigma2 = N / 4;
      const sigma = Math.sqrt(sigma2);
      // Continuous normal density value at k → multiply by 1 (bin width) to
      // compare against PMF mass directly.
      const normalAt = (x: number) =>
        (1 / Math.sqrt(2 * Math.PI * sigma2)) * Math.exp(-((x - mu) * (x - mu)) / (2 * sigma2));
      const normalPeak = normalAt(mu);
      const scaleMax = Math.max(maxP, normalPeak) * 1.08;

      // binomial bars — cyan
      const binW = plotW / (N + 1);
      for (let k = 0; k <= N; k++) {
        const x = margin + k * binW;
        const h = (pmf[k]! / scaleMax) * plotH;
        ctx!.fillStyle = "rgba(125, 243, 255, 0.78)";
        ctx!.fillRect(x + binW * 0.12, H - margin - h, binW * 0.76, h);
      }

      // normal curve — violet
      ctx!.strokeStyle = palette.signal.violet;
      ctx!.lineWidth = 1.8 * dpr;
      ctx!.beginPath();
      const steps = 240;
      for (let i = 0; i <= steps; i++) {
        const k = (i / steps) * N;
        const y = normalAt(k);
        // map k to canvas: bar center for k is margin + (k + 0.5) * binW
        const px = margin + (k + 0.5) * binW;
        const py = H - margin - (y / scaleMax) * plotH;
        if (i === 0) ctx!.moveTo(px, py);
        else ctx!.lineTo(px, py);
      }
      ctx!.stroke();

      // mu marker — amber
      const muPx = margin + (mu + 0.5) * binW;
      ctx!.strokeStyle = "rgba(255, 209, 102, 0.5)";
      ctx!.setLineDash([3 * dpr, 4 * dpr]);
      ctx!.lineWidth = 1 * dpr;
      ctx!.beginPath();
      ctx!.moveTo(muPx, margin);
      ctx!.lineTo(muPx, H - margin);
      ctx!.stroke();
      ctx!.setLineDash([]);

      // labels
      ctx!.fillStyle = "rgba(232, 234, 242, 0.55)";
      ctx!.font = `${9 * dpr}px ui-monospace, monospace`;
      ctx!.fillText(`μ = N/2 = ${mu}`, margin, margin - 6 * dpr);
      ctx!.fillText(`σ = √(N/4) = ${sigma.toFixed(2)}`, margin + 100 * dpr, margin - 6 * dpr);
    }

    draw();
    return () => ro.disconnect();
  }, [N, dpr]);

  return (
    <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-5 md:p-6">
      {caption && (
        <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
          {caption}
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="hairline mx-auto block h-[260px] w-full max-w-[420px] rounded-md border bg-ink-950/80"
      />
      <div className="flex items-center justify-center gap-5 pt-1 font-mono text-[10px] uppercase tracking-widest2">
        <span className="flex items-center gap-2 text-ink-300">
          <span className="inline-block h-3 w-3 rounded-sm bg-signal-cyan/80" />
          {legendBinomial}
        </span>
        <span className="flex items-center gap-2 text-ink-300">
          <span className="inline-block h-[2px] w-3 bg-signal-violet" />
          {legendNormal}
        </span>
      </div>
      <div className="space-y-1 pt-1">
        <div className="flex items-baseline justify-between">
          <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
            {nLabel}
          </div>
          <div className="font-mono text-[10px] text-signal-cyan">{N}</div>
        </div>
        <input
          type="range"
          min={4}
          max={40}
          step={1}
          value={N}
          onChange={(e) => setN(parseInt(e.target.value))}
          className="w-full accent-signal-cyan"
        />
      </div>
      {hint && <p className="text-[11px] leading-relaxed text-ink-400">{hint}</p>}
    </div>
  );
}
