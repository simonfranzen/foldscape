"use client";

import { useEffect, useRef } from "react";

// Tiny static (or slowly drifting) Mandelbrot render. Used inside the story
// page for the "Why the picture is infinite" section without needing the full
// WebGL pipeline.

interface Props {
  center?: [number, number];
  scale?: number;
  maxIter?: number;
  className?: string;
}

export function MandelMini({
  center = [-0.6, 0],
  scale = 1.4,
  maxIter = 120,
  className = "",
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const render = () => {
      const targetW = Math.floor(canvas.clientWidth * dpr);
      const targetH = Math.floor(canvas.clientHeight * dpr);
      if (targetW < 4 || targetH < 4) {
        // Layout not ready yet — wait a frame
        raf = requestAnimationFrame(render);
        return;
      }
      if (canvas.width !== targetW) canvas.width = targetW;
      if (canvas.height !== targetH) canvas.height = targetH;
      const W = canvas.width;
      const H = canvas.height;
      const image = ctx.createImageData(W, H);
      const data = image.data;
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const cx = center[0] + ((x - W / 2) / H) * (2 * scale);
          const cy = center[1] - ((y - H / 2) / H) * (2 * scale);
          let zx = 0;
          let zy = 0;
          let i = 0;
          for (; i < maxIter; i++) {
            const r2 = zx * zx + zy * zy;
            if (r2 > 256) break;
            const nzx = zx * zx - zy * zy + cx;
            zy = 2 * zx * zy + cy;
            zx = nzx;
          }
          const idx = (y * W + x) * 4;
          if (i >= maxIter) {
            data[idx] = 8;
            data[idx + 1] = 7;
            data[idx + 2] = 14;
          } else {
            const log_zn = 0.5 * Math.log(zx * zx + zy * zy);
            const nu = Math.log(log_zn / Math.LN2) / Math.LN2;
            const smooth = i + 1 - nu;
            const t = (smooth * 0.04) % 1;
            // IQ aurora-ish palette
            const r = 0.42 + 0.55 * Math.cos(6.28318 * (1.0 * t + 0.65));
            const g = 0.4 + 0.5 * Math.cos(6.28318 * (0.85 * t + 0.85));
            const b = 0.55 + 0.55 * Math.cos(6.28318 * (0.55 * t + 0.2));
            data[idx] = Math.max(0, Math.min(255, r * 255));
            data[idx + 1] = Math.max(0, Math.min(255, g * 255));
            data[idx + 2] = Math.max(0, Math.min(255, b * 255));
          }
          data[idx + 3] = 255;
        }
      }
      ctx.putImageData(image, 0, 0);
    };

    raf = requestAnimationFrame(render);
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(render);
    });
    ro.observe(canvas);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [center, scale, maxIter]);

  return <canvas ref={canvasRef} className={`block ${className}`} />;
}
