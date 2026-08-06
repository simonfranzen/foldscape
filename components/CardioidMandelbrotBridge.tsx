"use client";

import { useEffect, useRef, useState } from "react";
import { useDpr } from "@/lib/hooks/useDpr";
import { palette } from "@/lib/visual/palette";

// Inline demo for the cardioid story page. Renders the Mandelbrot set at low
// resolution with the main cardioid overlaid, and a slider that traces a dot
// around the cardioid boundary using the Douady–Hubbard parameterisation
// c(t) = (1/2) e^{it} − (1/4) e^{2it}.

interface Props {
  caption: string;
  paramLabel: string;
  hint: string;
}

const W_LOGICAL = 340;
const H_LOGICAL = 280;

export function CardioidMandelbrotBridge({ caption, paramLabel, hint }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tDeg, setTDeg] = useState(60);
  const mandelbrotCacheRef = useRef<ImageData | null>(null);
  const dpr = useDpr();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let cw = 0;
    let ch = 0;

    const renderMandelbrot = () => {
      const W = canvas.width;
      const H = canvas.height;
      const scale = Math.min(W, H) / 3.0;
      const reCenter = -0.55;
      const imCenter = 0;
      const maxIter = 48;
      const img = ctx.createImageData(W, H);
      const data = img.data;
      const cx = W / 2;
      const cy = H / 2;
      for (let py = 0; py < H; py++) {
        for (let px = 0; px < W; px++) {
          const cre = reCenter + (px - cx) / scale;
          const cim = imCenter + (py - cy) / scale;
          let x = 0;
          let y = 0;
          let it = 0;
          while (x * x + y * y < 4 && it < maxIter) {
            const xt = x * x - y * y + cre;
            y = 2 * x * y + cim;
            x = xt;
            it++;
          }
          const idx = (py * W + px) * 4;
          if (it === maxIter) {
            data[idx] = 5;
            data[idx + 1] = 6;
            data[idx + 2] = 14;
            data[idx + 3] = 255;
          } else {
            const v = it / maxIter;
            data[idx] = Math.floor(18 + v * 70);
            data[idx + 1] = Math.floor(10 + v * 25);
            data[idx + 2] = Math.floor(34 + v * 110);
            data[idx + 3] = 255;
          }
        }
      }
      mandelbrotCacheRef.current = img;
    };

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.fillStyle = palette.canvas.bg;
      ctx.fillRect(0, 0, W, H);

      if (mandelbrotCacheRef.current) {
        ctx.putImageData(mandelbrotCacheRef.current, 0, 0);
      }

      const scale = Math.min(W, H) / 3.0;
      const reCenter = -0.55;
      const imCenter = 0;
      const cx = W / 2;
      const cy = H / 2;

      // Overlay the Douady–Hubbard cardioid.
      ctx.strokeStyle = palette.signal.amber;
      ctx.lineWidth = 2 * dpr;
      ctx.beginPath();
      const steps = 360;
      for (let i = 0; i <= steps; i++) {
        const theta = (i / steps) * Math.PI * 2;
        const cre = 0.5 * Math.cos(theta) - 0.25 * Math.cos(2 * theta);
        const cim = 0.5 * Math.sin(theta) - 0.25 * Math.sin(2 * theta);
        const px = cx + (cre - reCenter) * scale;
        const py = cy + (cim - imCenter) * scale;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Trace arc from 0 up to the parameter t.
      const tMax = (tDeg / 360) * Math.PI * 2;
      ctx.strokeStyle = palette.signal.violet;
      ctx.lineWidth = 2.6 * dpr;
      ctx.beginPath();
      const arcSteps = Math.max(8, Math.floor((tDeg / 360) * 240));
      for (let i = 0; i <= arcSteps; i++) {
        const theta = (i / arcSteps) * tMax;
        const cre = 0.5 * Math.cos(theta) - 0.25 * Math.cos(2 * theta);
        const cim = 0.5 * Math.sin(theta) - 0.25 * Math.sin(2 * theta);
        const px = cx + (cre - reCenter) * scale;
        const py = cy + (cim - imCenter) * scale;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Current point.
      const theta = tMax;
      const cre = 0.5 * Math.cos(theta) - 0.25 * Math.cos(2 * theta);
      const cim = 0.5 * Math.sin(theta) - 0.25 * Math.sin(2 * theta);
      const px = cx + (cre - reCenter) * scale;
      const py = cy + (cim - imCenter) * scale;
      ctx.fillStyle = palette.signal.cyan;
      ctx.beginPath();
      ctx.arc(px, py, 4 * dpr, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = palette.canvas.bg;
      ctx.lineWidth = 1.4 * dpr;
      ctx.stroke();
    };

    const resize = () => {
      const nw = Math.floor(canvas.clientWidth * dpr);
      const nh = Math.floor(canvas.clientHeight * dpr);
      if (nw !== cw || nh !== ch) {
        canvas.width = nw;
        canvas.height = nh;
        cw = nw;
        ch = nh;
        renderMandelbrot();
      }
      draw();
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [tDeg, dpr]);

  return (
    <div className="hairline space-y-4 rounded-2xl border bg-ink-950/40 p-5">
      <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
        {caption}
      </div>
      <div className="grid grid-cols-1 items-center gap-5 md:grid-cols-12">
        <div className="flex justify-center md:col-span-7">
          <div
            className="hairline overflow-hidden rounded-xl border bg-ink-950"
            style={{ width: "100%", maxWidth: W_LOGICAL }}
          >
            <canvas
              ref={canvasRef}
              style={{ width: "100%", height: H_LOGICAL, display: "block" }}
              aria-label="Cardioid overlaid on the Mandelbrot main bulb"
            />
          </div>
        </div>
        <div className="space-y-4 md:col-span-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              <span>{paramLabel}</span>
              <span className="text-signal-amber">{tDeg}°</span>
            </div>
            <input
              type="range"
              min={0}
              max={360}
              step={1}
              value={tDeg}
              onChange={(e) => setTDeg(Number(e.target.value))}
              aria-label={paramLabel}
              className="w-full accent-signal-amber"
            />
            <div className="font-mono text-[10px] text-ink-400">
              c(t) = ½ e<sup>it</sup> − ¼ e<sup>2it</sup>
            </div>
          </div>
          <p className="text-[11px] leading-relaxed text-ink-300">{hint}</p>
        </div>
      </div>
    </div>
  );
}
