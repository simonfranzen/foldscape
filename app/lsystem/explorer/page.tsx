"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { useDpr } from "@/lib/hooks/useDpr";
import { palette } from "@/lib/visual/palette";

interface Preset {
  id: string;
  label: string;
  axiom: string;
  rules: Record<string, string>;
  angle: number;
  iterations: number;
  startAngle: number; // degrees, 0 = pointing right (along +x)
}

const PRESETS: Preset[] = [
  {
    id: "koch-curve",
    label: "Koch curve",
    axiom: "F",
    rules: { F: "F+F-F-F+F" },
    angle: 90,
    iterations: 4,
    startAngle: 0,
  },
  {
    id: "koch-snowflake",
    label: "Koch snowflake",
    axiom: "F++F++F",
    rules: { F: "F-F++F-F" },
    angle: 60,
    iterations: 4,
    startAngle: 0,
  },
  {
    id: "sierpinski-arrowhead",
    label: "Sierpiński arrowhead",
    axiom: "A",
    rules: { A: "B-A-B", B: "A+B+A" },
    angle: 60,
    iterations: 6,
    startAngle: 0,
  },
  {
    id: "sierpinski-triangle",
    label: "Sierpiński triangle",
    axiom: "F-G-G",
    rules: { F: "F-G+F+G-F", G: "GG" },
    angle: 120,
    iterations: 5,
    startAngle: 0,
  },
  {
    id: "dragon",
    label: "Dragon curve",
    axiom: "FX",
    rules: { X: "X+YF+", Y: "-FX-Y" },
    angle: 90,
    iterations: 12,
    startAngle: 0,
  },
  {
    id: "fractal-plant",
    label: "Fractal plant",
    axiom: "X",
    rules: { X: "F+[[X]-X]-F[-FX]+X", F: "FF" },
    angle: 25,
    iterations: 5,
    startAngle: -65,
  },
  {
    id: "hilbert",
    // Hilbert uses non-drawing state variables X/Y so only F draws; if X/Y
    // shared A/B's drawing role (as the arrowhead needs) the curve would fill
    // with spurious segments and stop being a Hilbert curve.
    label: "Hilbert curve",
    axiom: "X",
    rules: { X: "+YF-XFX-FY+", Y: "-XF+YFY+FX-" },
    angle: 90,
    iterations: 5,
    startAngle: 0,
  },
  {
    id: "levy-c",
    label: "Lévy C curve",
    axiom: "F",
    rules: { F: "+F--F+" },
    angle: 45,
    iterations: 10,
    startAngle: 0,
  },
];

const COLORS: Array<{ id: string; label: string; stroke: string; accentClass: string }> = [
  { id: "cyan", label: "Cyan", stroke: "rgba(125, 243, 255, 0.85)", accentClass: "bg-signal-cyan" },
  {
    id: "violet",
    label: "Violet",
    stroke: "rgba(179, 136, 255, 0.85)",
    accentClass: "bg-signal-violet",
  },
  {
    id: "amber",
    label: "Amber",
    stroke: "rgba(255, 209, 102, 0.85)",
    accentClass: "bg-signal-amber",
  },
  { id: "rose", label: "Rose", stroke: "rgba(255, 122, 182, 0.85)", accentClass: "bg-signal-rose" },
];

const MAX_STRING = 500_000;

function isDraw(ch: string): boolean {
  return ch === "F" || ch === "G" || ch === "A" || ch === "B";
}

function expand(axiom: string, rules: Record<string, string>, iterations: number): string {
  let s = axiom;
  for (let i = 0; i < iterations; i++) {
    let next = "";
    for (let j = 0; j < s.length; j++) {
      const ch = s[j];
      next += rules[ch] ?? ch;
      if (next.length > MAX_STRING) return next.slice(0, MAX_STRING);
    }
    s = next;
  }
  return s;
}

// Parse a free-form rules editor of the form "F=F+F-F-F+F\nX=..." into a map.
function parseRules(text: string): Record<string, string> {
  const out: Record<string, string> = {};
  const lines = text.split(/\r?\n/);
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    const eq = line.indexOf("=");
    if (eq <= 0) continue;
    const lhs = line.slice(0, eq).trim();
    const rhs = line.slice(eq + 1).trim();
    if (lhs.length !== 1) continue;
    out[lhs] = rhs;
  }
  return out;
}

function formatRules(rules: Record<string, string>): string {
  return Object.entries(rules)
    .map(([k, v]) => `${k} = ${v}`)
    .join("\n");
}

export default function LsystemExplorer() {
  const { a, u } = useI18n();
  const topic = a.topics.lsystem;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dpr = useDpr();

  const [presetId, setPresetId] = useState<string>(PRESETS[0].id);
  const preset = useMemo(() => PRESETS.find((p) => p.id === presetId) ?? PRESETS[0], [presetId]);

  const [iterations, setIterations] = useState<number>(preset.iterations);
  const [angle, setAngle] = useState<number>(preset.angle);
  const [axiom, setAxiom] = useState<string>(preset.axiom);
  const [rulesText, setRulesText] = useState<string>(formatRules(preset.rules));
  const [colorId, setColorId] = useState<string>("cyan");

  // When preset changes, sync all editable fields.
  useEffect(() => {
    setIterations(preset.iterations);
    setAngle(preset.angle);
    setAxiom(preset.axiom);
    setRulesText(formatRules(preset.rules));
  }, [preset]);

  const rules = useMemo(() => parseRules(rulesText), [rulesText]);

  // Generate the string.
  const generated = useMemo(
    () => expand(axiom, rules, Math.max(0, Math.min(iterations, 12))),
    [axiom, rules, iterations],
  );

  const truncated = generated.length >= MAX_STRING;

  // Stroke color
  const stroke = useMemo(
    () => COLORS.find((c) => c.id === colorId)?.stroke ?? COLORS[0].stroke,
    [colorId],
  );

  // Draw on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let raf = 0;

    const draw = () => {
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = palette.canvas.bg;
      ctx.fillRect(0, 0, W, H);

      // Background grid
      ctx.strokeStyle = "rgba(138,144,164,0.08)";
      ctx.lineWidth = 1;
      const step = 40;
      for (let gx = 0; gx <= W; gx += step) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, H);
        ctx.stroke();
      }
      for (let gy = 0; gy <= H; gy += step) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(W, gy);
        ctx.stroke();
      }

      if (!generated.length) return;

      const ang0 = (preset.startAngle * Math.PI) / 180;
      const da = (angle * Math.PI) / 180;

      // Pass 1: bounds
      let x = 0;
      let y = 0;
      let h = ang0;
      let minX = 0;
      let maxX = 0;
      let minY = 0;
      let maxY = 0;
      const stack: Array<[number, number, number]> = [];
      for (let i = 0; i < generated.length; i++) {
        const ch = generated[i];
        if (isDraw(ch)) {
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

      const pad = 24;
      const w = Math.max(maxX - minX, 1e-6);
      const ht = Math.max(maxY - minY, 1e-6);
      const sx = (W - pad * 2) / w;
      const sy = (H - pad * 2) / ht;
      const scale = Math.min(sx, sy);
      const ox = pad - minX * scale + (W - pad * 2 - w * scale) / 2;
      const oy = pad - minY * scale + (H - pad * 2 - ht * scale) / 2;

      // Pass 2: draw
      x = 0;
      y = 0;
      h = ang0;
      stack.length = 0;
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 1;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      for (let i = 0; i < generated.length; i++) {
        const ch = generated[i];
        if (isDraw(ch)) {
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

    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(draw);
    };
    schedule();
    const ro = new ResizeObserver(schedule);
    ro.observe(canvas);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [generated, angle, stroke, preset.startAngle, dpr]);

  return (
    <main className="flex min-h-screen flex-col pt-14">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_420px]">
        <div className="relative flex min-h-[60vh] flex-col gap-4 bg-ink-950 p-4 lg:min-h-[calc(100vh-3.5rem)] lg:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              {preset.label} · {iterations} iter · {angle}°
            </div>
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
              axiom → rewrite → turtle
            </div>
          </div>
          <div className="hairline flex-1 overflow-hidden rounded-2xl border bg-ink-950">
            <canvas
              ref={canvasRef}
              role="img"
              aria-label={`${preset.label}, ${iterations} iterations, ${angle} degrees`}
              className="block h-full w-full"
            />
          </div>
          <div className="grid grid-cols-2 gap-2 font-mono text-[10px] uppercase tracking-widest2 md:grid-cols-4">
            <div className="glass hairline rounded-md border px-3 py-2 text-ink-200">
              <span className="text-ink-400">steps · </span>
              <span className="text-signal-cyan">{iterations}</span>
            </div>
            <div className="glass hairline rounded-md border px-3 py-2 text-ink-200">
              <span className="text-ink-400">angle · </span>
              <span className="text-signal-cyan">{angle}°</span>
            </div>
            <div className="glass hairline rounded-md border px-3 py-2 text-ink-200">
              <span className="text-ink-400">string · </span>
              <span className="text-signal-cyan">{generated.length.toLocaleString()}</span>
            </div>
            <div className="glass hairline rounded-md border px-3 py-2 text-ink-200">
              <span className="text-ink-400">axiom · </span>
              <span className="break-all text-signal-cyan">{axiom}</span>
            </div>
          </div>
          {truncated && (
            <div className="glass rounded-md border border-signal-amber/40 px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
              String capped at {MAX_STRING.toLocaleString()} symbols — reduce iterations to see the
              full fractal
            </div>
          )}
        </div>

        <aside className="hairline scrollbar-thin flex flex-col overflow-y-auto border-l bg-ink-900/40">
          <div className="hairline space-y-3 border-b p-6">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
              {topic.title}
            </div>
            <h1 className="math-italic text-3xl leading-tight text-ink-100">{topic.tagline}</h1>
            <p className="text-sm leading-relaxed text-ink-200">{topic.body}</p>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Preset
            </div>
            <div className="grid grid-cols-2 gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPresetId(p.id)}
                  className={`rounded-md border px-3 py-2 text-left transition-colors ${
                    p.id === presetId
                      ? "border-signal-cyan/60 bg-signal-cyan/10 text-signal-cyan"
                      : "hairline text-ink-200 hover:border-signal-cyan/40 hover:text-ink-100"
                  }`}
                >
                  <div className="font-mono text-xs leading-tight">{p.label}</div>
                  <div className="mt-0.5 font-mono text-[10px] text-ink-400">
                    {p.iterations} iter · {p.angle}°
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="flex items-center justify-between">
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                Iterations
              </div>
              <div className="font-mono text-sm text-signal-cyan">{iterations}</div>
            </div>
            <input
              type="range"
              value={iterations}
              min={1}
              max={12}
              step={1}
              onChange={(e) => setIterations(parseInt(e.target.value, 10))}
              className="w-full accent-signal-cyan"
            />
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="flex items-center justify-between">
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                Angle
              </div>
              <div className="font-mono text-sm text-signal-cyan">{angle}°</div>
            </div>
            <input
              type="range"
              value={angle}
              min={15}
              max={120}
              step={1}
              onChange={(e) => setAngle(parseInt(e.target.value, 10))}
              className="w-full accent-signal-cyan"
            />
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Axiom
            </div>
            <input
              type="text"
              value={axiom}
              onChange={(e) => setAxiom(e.target.value)}
              spellCheck={false}
              className="hairline w-full rounded-md border bg-ink-950 px-3 py-2 font-mono text-sm text-ink-100 focus:border-signal-cyan/60 focus:outline-none"
            />
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Rules · one per line
            </div>
            <textarea
              value={rulesText}
              onChange={(e) => setRulesText(e.target.value)}
              spellCheck={false}
              rows={Math.max(2, Object.keys(rules).length + 1)}
              className="hairline w-full resize-none rounded-md border bg-ink-950 px-3 py-2 font-mono text-xs text-ink-100 focus:border-signal-cyan/60 focus:outline-none"
            />
            <div className="font-mono text-[10px] text-ink-400">
              Drawing: F G A B · turn: + − · branch: [ ]
            </div>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Colour
            </div>
            <div className="grid grid-cols-4 gap-2">
              {COLORS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setColorId(c.id)}
                  className={`flex flex-col items-center gap-2 rounded-md border px-2 py-2 transition-colors ${
                    c.id === colorId
                      ? "border-ink-200/60 bg-ink-200/5"
                      : "hairline hover:border-ink-200/40"
                  }`}
                  aria-label={c.label}
                >
                  <span className={`h-4 w-4 rounded-full ${c.accentClass}`} />
                  <span className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                    {c.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-5">
            <Link
              href="/lsystem"
              className="hairline block w-full rounded-md border py-2 text-center font-mono text-[10px] uppercase tracking-widest2 text-ink-300 transition-colors hover:border-signal-cyan/40 hover:text-signal-cyan"
            >
              {u.back}
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
