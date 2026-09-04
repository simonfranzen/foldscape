"use client";

import { useEffect, useRef } from "react";
import { useDpr } from "@/lib/hooks/useDpr";

// V(X) and A(X) as a function of X, plotted on a small canvas. V converges
// to π; A grows like 2π ln X, unbounded. Static plot — no controls. Used as
// a companion to the GabrielsHornRenderer.

interface Props {
  caption?: string;
  legendV?: string;
  legendA?: string;
  xMax?: number;
  canvasLabel?: string;
}

function volumeUpTo(X: number): number {
  return Math.PI * (1 - 1 / X);
}

// Surface lower bound — 2π ln X — already diverges, so we just plot that
// as the canonical "A grows" curve (the true A is larger but indistinguishable
// at this resolution).
function surfaceLowerBound(X: number): number {
  return 2 * Math.PI * Math.log(X);
}

export function GabrielsHornGrowGraph({
  caption,
  legendV,
  legendA,
  xMax = 50,
  canvasLabel,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dpr = useDpr();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const resize = () => {
      canvas.width = Math.floor(canvas.clientWidth * dpr);
      canvas.height = Math.floor(canvas.clientHeight * dpr);
      draw();
    };

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      const padL = 36 * dpr;
      const padR = 14 * dpr;
      const padT = 14 * dpr;
      const padB = 22 * dpr;
      const plotW = W - padL - padR;
      const plotH = H - padT - padB;

      // y-axis range: [0, ~ 2π ln(xMax) + a bit].
      const yMax = Math.max(2 * Math.PI * Math.log(xMax) * 1.05, Math.PI * 1.5);

      const xToPx = (x: number) => padL + ((x - 1) / (xMax - 1)) * plotW;
      const yToPx = (y: number) => padT + plotH - (y / yMax) * plotH;

      // Background grid
      ctx.strokeStyle = "rgba(255,255,255,0.05)";
      ctx.lineWidth = 1;
      for (let i = 0; i <= 4; i++) {
        const y = padT + (plotH * i) / 4;
        ctx.beginPath();
        ctx.moveTo(padL, y);
        ctx.lineTo(W - padR, y);
        ctx.stroke();
      }

      // π reference line (the asymptote for V).
      ctx.strokeStyle = "rgba(125,243,255,0.35)";
      ctx.setLineDash([4 * dpr, 4 * dpr]);
      ctx.lineWidth = 1 * dpr;
      ctx.beginPath();
      const piY = yToPx(Math.PI);
      ctx.moveTo(padL, piY);
      ctx.lineTo(W - padR, piY);
      ctx.stroke();
      ctx.setLineDash([]);

      // π label
      ctx.fillStyle = "rgba(125,243,255,0.7)";
      ctx.font = `${10 * dpr}px ui-monospace, monospace`;
      ctx.textAlign = "left";
      ctx.fillText("π", padL + 4 * dpr, piY - 4 * dpr);

      // Y axis labels (0 and yMax)
      ctx.fillStyle = "rgba(180,180,200,0.5)";
      ctx.font = `${9 * dpr}px ui-monospace, monospace`;
      ctx.textAlign = "right";
      ctx.fillText("0", padL - 4 * dpr, padT + plotH);
      ctx.fillText(yMax.toFixed(1), padL - 4 * dpr, padT + 8 * dpr);

      // X axis labels (1 and xMax)
      ctx.textAlign = "center";
      ctx.fillText("X = 1", padL, H - 4 * dpr);
      ctx.fillText(`X = ${xMax}`, W - padR, H - 4 * dpr);

      // Plot A(X) — diverges (rose)
      ctx.strokeStyle = "rgba(255,122,182,0.95)";
      ctx.lineWidth = 1.5 * dpr;
      ctx.beginPath();
      const NA = 400;
      for (let i = 0; i <= NA; i++) {
        const x = 1 + ((xMax - 1) * i) / NA;
        const a = surfaceLowerBound(x);
        const px = xToPx(x);
        const py = yToPx(a);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Plot V(X) — converges (cyan)
      ctx.strokeStyle = "rgba(125,243,255,0.95)";
      ctx.lineWidth = 1.6 * dpr;
      ctx.beginPath();
      for (let i = 0; i <= NA; i++) {
        const x = 1 + ((xMax - 1) * i) / NA;
        const v = volumeUpTo(x);
        const px = xToPx(x);
        const py = yToPx(v);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // End dots
      const xEnd = xMax;
      const vEnd = volumeUpTo(xEnd);
      const aEnd = surfaceLowerBound(xEnd);
      ctx.fillStyle = "rgba(125,243,255,1)";
      ctx.beginPath();
      ctx.arc(xToPx(xEnd), yToPx(vEnd), 2.6 * dpr, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(255,122,182,1)";
      ctx.beginPath();
      ctx.arc(xToPx(xEnd), yToPx(aEnd), 2.6 * dpr, 0, Math.PI * 2);
      ctx.fill();
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => {
      ro.disconnect();
    };
  }, [xMax, dpr]);

  return (
    <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-5 md:p-6">
      {caption && (
        <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-rose">
          {caption}
        </div>
      )}
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={
          canvasLabel ?? caption ?? "Plot of V(X) converging to π while A(X) grows without bound"
        }
        className="hairline h-[140px] w-full rounded-md border bg-ink-950/80"
      />
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-[10px] uppercase tracking-widest2">
        <span className="flex items-center gap-2 text-signal-cyan">
          <span className="inline-block h-0.5 w-3 rounded-sm bg-signal-cyan" />
          {legendV ?? "V(X) → π"}
        </span>
        <span className="flex items-center gap-2 text-signal-rose">
          <span className="inline-block h-0.5 w-3 rounded-sm bg-signal-rose" />
          {legendA ?? "A(X) → ∞"}
        </span>
      </div>
    </div>
  );
}
