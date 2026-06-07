"use client";

import { useEffect, useMemo, useRef, useState } from "react";

// Small canvas renderer that draws an L-system via a turtle path. The
// visitor picks one of three pre-canned classics and slides the iteration
// depth (1..8). The render is capped so iteration overflow can't freeze the
// page on weak devices.

interface Preset {
  id: string;
  label: string;
  axiom: string;
  rules: Record<string, string>;
  angle: number; // degrees per +/-
  startAngle: number; // degrees, 0 = facing right
  defaultIter: number;
  maxIter: number;
  stroke: string;
}

const PRESETS: Preset[] = [
  {
    id: "dragon",
    label: "Dragon curve",
    axiom: "FX",
    rules: { X: "X+YF+", Y: "-FX-Y" },
    angle: 90,
    startAngle: 0,
    defaultIter: 10,
    maxIter: 14,
    stroke: "rgba(125, 243, 255, 0.85)",
  },
  {
    id: "hilbert",
    label: "Hilbert curve",
    axiom: "A",
    rules: { A: "+BF-AFA-FB+", B: "-AF+BFB+FA-" },
    angle: 90,
    startAngle: 0,
    defaultIter: 5,
    maxIter: 7,
    stroke: "rgba(179, 136, 255, 0.85)",
  },
  {
    id: "koch-snowflake",
    label: "Koch snowflake",
    axiom: "F++F++F",
    rules: { F: "F-F++F-F" },
    angle: 60,
    startAngle: 0,
    defaultIter: 4,
    maxIter: 6,
    stroke: "rgba(255, 209, 102, 0.9)",
  },
];

const STRING_CAP = 200_000;

function expand(axiom: string, rules: Record<string, string>, iterations: number): string {
  let s = axiom;
  for (let i = 0; i < iterations; i++) {
    let next = "";
    for (let j = 0; j < s.length; j++) {
      const ch = s[j];
      next += rules[ch] ?? ch;
      if (next.length > STRING_CAP) return next;
    }
    s = next;
    if (s.length > STRING_CAP) return s;
  }
  return s;
}

interface Props {
  caption: string;
  presetLabel: string;
  depthLabel: string;
  axiomLabel: string;
  rulesLabel: string;
  angleLabel: string;
}

export function LsystemTurtleRenderer({
  caption,
  presetLabel,
  depthLabel,
  axiomLabel,
  rulesLabel,
  angleLabel,
}: Props) {
  const [presetId, setPresetId] = useState<string>(PRESETS[0].id);
  const preset = useMemo(() => PRESETS.find((p) => p.id === presetId) ?? PRESETS[0], [presetId]);
  const [iter, setIter] = useState<number>(preset.defaultIter);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Reset iteration whenever the preset changes.
  useEffect(() => {
    setIter(preset.defaultIter);
  }, [preset.defaultIter, preset.id]);

  // Clamp iter to the preset's max.
  const clampedIter = Math.min(iter, preset.maxIter);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const draw = () => {
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      if (W === 0 || H === 0) return;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#06070d";
      ctx.fillRect(0, 0, W, H);

      const str = expand(preset.axiom, preset.rules, clampedIter);
      const ang0 = (preset.startAngle * Math.PI) / 180;
      const da = (preset.angle * Math.PI) / 180;

      // Pass 1: bounds.
      let x = 0;
      let y = 0;
      let h = ang0;
      let minX = 0;
      let maxX = 0;
      let minY = 0;
      let maxY = 0;
      const stack: Array<[number, number, number]> = [];
      for (let i = 0; i < str.length; i++) {
        const ch = str[i];
        if (ch === "F" || ch === "G" || ch === "A" || ch === "B") {
          x += Math.cos(h);
          y += Math.sin(h);
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        } else if (ch === "+") {
          h += da;
        } else if (ch === "-") {
          h -= da;
        } else if (ch === "[") {
          stack.push([x, y, h]);
        } else if (ch === "]") {
          const popped = stack.pop();
          if (popped) {
            x = popped[0];
            y = popped[1];
            h = popped[2];
          }
        }
      }

      const pad = 14;
      const sx = (W - pad * 2) / Math.max(maxX - minX, 1e-6);
      const sy = (H - pad * 2) / Math.max(maxY - minY, 1e-6);
      const scale = Math.min(sx, sy);
      const ox = pad - minX * scale + (W - pad * 2 - (maxX - minX) * scale) / 2;
      const oy = pad - minY * scale + (H - pad * 2 - (maxY - minY) * scale) / 2;

      // Pass 2: draw.
      x = 0;
      y = 0;
      h = ang0;
      stack.length = 0;
      ctx.strokeStyle = preset.stroke;
      ctx.lineWidth = 0.9;
      ctx.lineCap = "round";
      ctx.beginPath();
      for (let i = 0; i < str.length; i++) {
        const ch = str[i];
        if (ch === "F" || ch === "G" || ch === "A" || ch === "B") {
          const nx = x + Math.cos(h);
          const ny = y + Math.sin(h);
          ctx.moveTo(ox + x * scale, oy + y * scale);
          ctx.lineTo(ox + nx * scale, oy + ny * scale);
          x = nx;
          y = ny;
        } else if (ch === "+") {
          h += da;
        } else if (ch === "-") {
          h -= da;
        } else if (ch === "[") {
          stack.push([x, y, h]);
        } else if (ch === "]") {
          const popped = stack.pop();
          if (popped) {
            x = popped[0];
            y = popped[1];
            h = popped[2];
          }
        }
      }
      ctx.stroke();
    };

    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [preset, clampedIter]);

  return (
    <div className="hairline glass space-y-5 rounded-2xl border p-6 md:p-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
          {caption}
        </div>
        <div className="flex items-center gap-2">
          <label className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
            {presetLabel}
          </label>
          <select
            value={presetId}
            onChange={(e) => setPresetId(e.target.value)}
            className="hairline rounded-md border bg-ink-950/70 px-2 py-1 font-mono text-[11px] text-ink-100 focus:border-signal-amber/60 focus:outline-none"
          >
            {PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-12">
        <div className="md:col-span-7">
          <div className="hairline aspect-square overflow-hidden rounded-2xl border bg-ink-950">
            <canvas ref={canvasRef} className="block h-full w-full" />
          </div>
        </div>

        <div className="space-y-3 md:col-span-5">
          <div className="hairline space-y-1 rounded-md border bg-ink-950/50 p-3">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {axiomLabel}
            </div>
            <div className="break-all font-mono text-sm text-signal-amber">{preset.axiom}</div>
          </div>
          <div className="hairline space-y-1 rounded-md border bg-ink-950/50 p-3">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {rulesLabel}
            </div>
            <ul className="space-y-1 font-mono text-xs text-ink-100">
              {Object.entries(preset.rules).map(([k, v]) => (
                <li key={k}>
                  <span className="text-signal-amber">{k}</span>
                  <span className="text-ink-400"> → </span>
                  <span className="break-all text-ink-100">{v}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="hairline space-y-1 rounded-md border bg-ink-950/50 p-3">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {angleLabel}
            </div>
            <div className="font-mono text-sm text-ink-100">{preset.angle}°</div>
          </div>

          <div className="hairline space-y-2 rounded-md border bg-ink-950/50 p-3">
            <div className="flex items-center justify-between">
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                {depthLabel}
              </div>
              <div className="font-mono text-sm text-signal-amber">{clampedIter}</div>
            </div>
            <input
              type="range"
              min={1}
              max={preset.maxIter}
              step={1}
              value={clampedIter}
              onChange={(e) => setIter(parseInt(e.target.value, 10))}
              className="w-full accent-signal-amber"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
