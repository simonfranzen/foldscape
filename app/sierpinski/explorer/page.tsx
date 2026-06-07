"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";

type Mode = "subdivision" | "chaos" | "pascal" | "rule90";

interface ModeDef {
  id: Mode;
  label: string;
  short: string;
  badge: string;
}

const MODES: ModeDef[] = [
  {
    id: "subdivision",
    label: "Subdivision",
    short: "Recursive subdivision",
    badge: "remove the centre, recurse",
  },
  { id: "chaos", label: "Chaos game", short: "Random halving walk", badge: "p ← p + ½ · (vᵢ − p)" },
  {
    id: "pascal",
    label: "Pascal mod 2",
    short: "Odd binomial coefficients",
    badge: "C(n, k) mod 2",
  },
  {
    id: "rule90",
    label: "Rule 90",
    short: "Single-cell cellular automaton",
    badge: "next = left ⊕ right",
  },
];

interface DotColor {
  id: "violet" | "cyan" | "amber" | "rose";
  label: string;
  css: string;
  solid: string;
  soft: string;
}

const COLORS: DotColor[] = [
  {
    id: "violet",
    label: "violet",
    css: "bg-signal-violet",
    solid: "rgba(168, 132, 255, 0.92)",
    soft: "rgba(168, 132, 255, 0.55)",
  },
  {
    id: "cyan",
    label: "cyan",
    css: "bg-signal-cyan",
    solid: "rgba(125, 243, 255, 0.92)",
    soft: "rgba(125, 243, 255, 0.55)",
  },
  {
    id: "amber",
    label: "amber",
    css: "bg-signal-amber",
    solid: "rgba(255, 209, 102, 0.95)",
    soft: "rgba(255, 209, 102, 0.55)",
  },
  {
    id: "rose",
    label: "rose",
    css: "bg-signal-rose",
    solid: "rgba(255, 122, 182, 0.92)",
    soft: "rgba(255, 122, 182, 0.55)",
  },
];

export default function SierpinskiExplorer() {
  const { a, u } = useI18n();
  const topic = a.topics.sierpinski;

  const [mode, setMode] = useState<Mode>("subdivision");
  const [depth, setDepth] = useState(6);
  const [pointsPerFrame, setPointsPerFrame] = useState(4000);
  const [rows, setRows] = useState(64);
  const [gens, setGens] = useState(96);
  const [colorId, setColorId] = useState<DotColor["id"]>("violet");
  const [restartTick, setRestartTick] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const totalPointsRef = useRef(0);
  const [totalPoints, setTotalPoints] = useState(0);

  const color = COLORS.find((c) => c.id === colorId) ?? COLORS[0];
  const activeMode = MODES.find((m) => m.id === mode) ?? MODES[0];

  // Subdivision: animated depth growing 0 → depth, then settle.
  // Chaos game: continuous accumulation.
  // Pascal & Rule 90: static draw.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let raf = 0;
    let cancelled = false;
    totalPointsRef.current = 0;
    setTotalPoints(0);

    const sizeCanvas = () => {
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(W * dpr));
      canvas.height = Math.max(1, Math.floor(H * dpr));
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#06070d";
      ctx.fillRect(0, 0, W, H);
      return ctx;
    };

    const ctx = sizeCanvas();
    if (!ctx) return;

    if (mode === "subdivision") {
      // Animate depth from 0 up to current `depth`
      let current = 0;
      const step = () => {
        if (cancelled) return;
        const W = canvas.clientWidth;
        const H = canvas.clientHeight;
        const c2 = canvas.getContext("2d");
        if (!c2) return;
        c2.setTransform(dpr, 0, 0, dpr, 0, 0);
        c2.fillStyle = "#06070d";
        c2.fillRect(0, 0, W, H);
        c2.fillStyle = color.solid;
        const [v0, v1, v2] = triangleVertices(W, H);
        recurseSub(c2, v0, v1, v2, current);
        if (current < depth) {
          current += 1;
          raf = window.setTimeout(() => {
            raf = requestAnimationFrame(step);
          }, 280) as unknown as number;
        }
      };
      step();
      const ro = new ResizeObserver(() => {
        const c2 = sizeCanvas();
        if (!c2) return;
        c2.fillStyle = color.solid;
        const W = canvas.clientWidth;
        const H = canvas.clientHeight;
        const [v0, v1, v2] = triangleVertices(W, H);
        recurseSub(c2, v0, v1, v2, depth);
      });
      ro.observe(canvas);
      return () => {
        cancelled = true;
        cancelAnimationFrame(raf);
        clearTimeout(raf);
        ro.disconnect();
      };
    }

    if (mode === "chaos") {
      const W0 = canvas.clientWidth;
      const H0 = canvas.clientHeight;
      // draw faint triangle outline
      const verts0 = triangleVertices(W0, H0);
      ctx.strokeStyle = "rgba(168,132,255,0.22)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(verts0[0][0], verts0[0][1]);
      ctx.lineTo(verts0[1][0], verts0[1][1]);
      ctx.lineTo(verts0[2][0], verts0[2][1]);
      ctx.closePath();
      ctx.stroke();
      ctx.fillStyle = "rgba(168,132,255,0.5)";
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(verts0[i][0], verts0[i][1], 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      let x = W0 / 2;
      let y = H0 / 2;
      // burn-in (off-screen iterations)
      for (let i = 0; i < 20; i++) {
        const v = verts0[(Math.random() * 3) | 0];
        x = (x + v[0]) / 2;
        y = (y + v[1]) / 2;
      }

      let lastReport = 0;
      const tick = () => {
        if (cancelled) return;
        const c2 = canvas.getContext("2d");
        if (!c2) return;
        const W = canvas.clientWidth;
        const H = canvas.clientHeight;
        const verts = triangleVertices(W, H);
        c2.fillStyle = color.soft;
        for (let i = 0; i < pointsPerFrame; i++) {
          const v = verts[(Math.random() * 3) | 0];
          x = (x + v[0]) / 2;
          y = (y + v[1]) / 2;
          c2.fillRect(x, y, 1, 1);
        }
        totalPointsRef.current += pointsPerFrame;
        const now = performance.now();
        if (now - lastReport > 120) {
          lastReport = now;
          setTotalPoints(totalPointsRef.current);
        }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);

      const ro = new ResizeObserver(() => {
        const c2 = sizeCanvas();
        if (!c2) return;
        const W = canvas.clientWidth;
        const H = canvas.clientHeight;
        x = W / 2;
        y = H / 2;
        const verts = triangleVertices(W, H);
        c2.strokeStyle = "rgba(168,132,255,0.22)";
        c2.lineWidth = 1;
        c2.beginPath();
        c2.moveTo(verts[0][0], verts[0][1]);
        c2.lineTo(verts[1][0], verts[1][1]);
        c2.lineTo(verts[2][0], verts[2][1]);
        c2.closePath();
        c2.stroke();
      });
      ro.observe(canvas);

      return () => {
        cancelled = true;
        cancelAnimationFrame(raf);
        ro.disconnect();
      };
    }

    if (mode === "pascal") {
      const render = () => {
        const c2 = sizeCanvas();
        if (!c2) return;
        c2.fillStyle = color.solid;
        drawPascalMod2(c2, canvas.clientWidth, canvas.clientHeight, rows);
      };
      render();
      const ro = new ResizeObserver(render);
      ro.observe(canvas);
      return () => {
        cancelled = true;
        ro.disconnect();
      };
    }

    if (mode === "rule90") {
      const render = () => {
        const c2 = sizeCanvas();
        if (!c2) return;
        c2.fillStyle = color.solid;
        drawRule90(c2, canvas.clientWidth, canvas.clientHeight, gens);
      };
      render();
      const ro = new ResizeObserver(render);
      ro.observe(canvas);
      return () => {
        cancelled = true;
        ro.disconnect();
      };
    }
  }, [mode, depth, pointsPerFrame, rows, gens, color.solid, color.soft, restartTick]);

  return (
    <main className="flex min-h-screen flex-col pt-14">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_420px]">
        <div className="relative flex min-h-[60vh] flex-col gap-4 bg-ink-950 p-4 lg:min-h-[calc(100vh-3.5rem)] lg:p-6">
          <div className="flex flex-wrap items-center gap-2">
            {MODES.map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 transition-colors ${
                  mode === m.id
                    ? "border-signal-violet/60 bg-signal-violet/10 text-signal-violet"
                    : "hairline text-ink-200 hover:border-signal-violet/40 hover:text-signal-violet"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              {activeMode.short}
            </div>
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-violet">
              {activeMode.badge}
            </div>
          </div>

          <div className="hairline flex-1 overflow-hidden rounded-2xl border bg-ink-950">
            <canvas ref={canvasRef} className="block h-full w-full" />
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              {mode === "subdivision" && `depth ${depth} · ${3 ** depth} triangles`}
              {mode === "chaos" && `${totalPoints.toLocaleString()} points`}
              {mode === "pascal" && `${rows} rows · C(n,k) mod 2`}
              {mode === "rule90" && `${gens} generations`}
            </div>
            <button
              onClick={() => setRestartTick((t) => t + 1)}
              className="hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-signal-violet/40 hover:text-signal-violet"
            >
              Restart
            </button>
          </div>
        </div>

        <aside className="hairline scrollbar-thin flex flex-col overflow-y-auto border-l bg-ink-900/40">
          <div className="hairline space-y-3 border-b p-6">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-violet">
              {topic.title}
            </div>
            <h1 className="math-italic text-3xl leading-tight text-ink-100">{topic.tagline}</h1>
            <p className="text-sm leading-relaxed text-ink-200">{topic.body}</p>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Construction
            </div>
            <div className="grid grid-cols-2 gap-2">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`rounded-md border px-3 py-2 text-left transition-colors ${
                    mode === m.id
                      ? "border-signal-violet/60 bg-signal-violet/10 text-signal-violet"
                      : "hairline text-ink-200 hover:border-signal-violet/40 hover:text-signal-violet"
                  }`}
                >
                  <div className="font-mono text-xs">{m.label}</div>
                  <div className="mt-0.5 font-mono text-[10px] text-ink-400">{m.short}</div>
                </button>
              ))}
            </div>
          </div>

          {mode === "subdivision" && (
            <div className="hairline space-y-3 border-b p-5">
              <div className="flex items-center justify-between">
                <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                  Depth
                </div>
                <div className="font-mono text-sm text-signal-violet">{depth}</div>
              </div>
              <input
                type="range"
                value={depth}
                min={0}
                max={10}
                step={1}
                onChange={(e) => setDepth(parseInt(e.target.value))}
                className="w-full accent-signal-violet"
              />
              <p className="font-mono text-[10px] text-ink-400">
                3^depth triangles at the limit · centre always removed.
              </p>
            </div>
          )}

          {mode === "chaos" && (
            <div className="hairline space-y-3 border-b p-5">
              <div className="flex items-center justify-between">
                <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                  Points / frame
                </div>
                <div className="font-mono text-sm text-signal-violet">
                  {pointsPerFrame.toLocaleString()}
                </div>
              </div>
              <input
                type="range"
                value={pointsPerFrame}
                min={100}
                max={20000}
                step={100}
                onChange={(e) => setPointsPerFrame(parseInt(e.target.value))}
                className="w-full accent-signal-violet"
              />
              <p className="font-mono text-[10px] text-ink-400">
                Jump halfway to a random vertex; plot; repeat.
              </p>
            </div>
          )}

          {mode === "pascal" && (
            <div className="hairline space-y-3 border-b p-5">
              <div className="flex items-center justify-between">
                <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                  Rows
                </div>
                <div className="font-mono text-sm text-signal-violet">{rows}</div>
              </div>
              <input
                type="range"
                value={rows}
                min={10}
                max={256}
                step={1}
                onChange={(e) => setRows(parseInt(e.target.value))}
                className="w-full accent-signal-violet"
              />
              <p className="font-mono text-[10px] text-ink-400">
                Black where C(n, k) is odd · Lucas&apos;s theorem.
              </p>
            </div>
          )}

          {mode === "rule90" && (
            <div className="hairline space-y-3 border-b p-5">
              <div className="flex items-center justify-between">
                <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                  Generations
                </div>
                <div className="font-mono text-sm text-signal-violet">{gens}</div>
              </div>
              <input
                type="range"
                value={gens}
                min={10}
                max={256}
                step={1}
                onChange={(e) => setGens(parseInt(e.target.value))}
                className="w-full accent-signal-violet"
              />
              <p className="font-mono text-[10px] text-ink-400">
                Each cell = XOR of its two neighbours · seed = one cell.
              </p>
            </div>
          )}

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Cell colour
            </div>
            <div className="flex items-center gap-2">
              {COLORS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setColorId(c.id)}
                  aria-label={c.label}
                  className={`h-8 w-8 rounded-md border transition-transform ${c.css} ${
                    colorId === c.id ? "scale-110 border-ink-100" : "border-ink-700 hover:scale-105"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <button
              onClick={() => setRestartTick((t) => t + 1)}
              className="block w-full rounded-md border border-signal-violet/40 bg-signal-violet/10 py-2 text-center font-mono text-[10px] uppercase tracking-widest2 text-signal-violet transition-colors hover:bg-signal-violet/20"
            >
              Restart {activeMode.label}
            </button>
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

// --- drawing helpers ---

function triangleVertices(
  W: number,
  H: number,
): [[number, number], [number, number], [number, number]] {
  const margin = 16;
  const w = W - 2 * margin;
  const h = H - 2 * margin;
  const side = Math.min(w, h * (2 / Math.sqrt(3)));
  const triH = side * (Math.sqrt(3) / 2);
  const cx = W / 2;
  const offY = margin + (h - triH) / 2;
  return [
    [cx, offY],
    [cx - side / 2, offY + triH],
    [cx + side / 2, offY + triH],
  ];
}

function recurseSub(
  ctx: CanvasRenderingContext2D,
  a: [number, number],
  b: [number, number],
  c: [number, number],
  depth: number,
) {
  if (depth <= 0) {
    ctx.beginPath();
    ctx.moveTo(a[0], a[1]);
    ctx.lineTo(b[0], b[1]);
    ctx.lineTo(c[0], c[1]);
    ctx.closePath();
    ctx.fill();
    return;
  }
  const ab: [number, number] = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const bc: [number, number] = [(b[0] + c[0]) / 2, (b[1] + c[1]) / 2];
  const ca: [number, number] = [(c[0] + a[0]) / 2, (c[1] + a[1]) / 2];
  recurseSub(ctx, a, ab, ca, depth - 1);
  recurseSub(ctx, ab, b, bc, depth - 1);
  recurseSub(ctx, ca, bc, c, depth - 1);
}

function drawPascalMod2(ctx: CanvasRenderingContext2D, W: number, H: number, rows: number) {
  const margin = 10;
  const cellW = (W - 2 * margin) / rows;
  const cellH = (H - 2 * margin) / rows;
  const cell = Math.max(1, Math.min(cellW, cellH));
  const totalW = cell * rows;
  const totalH = cell * rows;
  const ox = (W - totalW) / 2;
  const oy = (H - totalH) / 2;
  let row: number[] = [1];
  for (let r = 0; r < rows; r++) {
    const rowOffsetX = ox + ((rows - r - 1) * cell) / 2;
    for (let k = 0; k <= r; k++) {
      if (row[k] === 1) {
        const size = Math.max(1, cell - 0.5);
        ctx.fillRect(rowOffsetX + k * cell, oy + r * cell, size, size);
      }
    }
    const next: number[] = new Array(r + 2).fill(0);
    for (let k = 0; k <= r + 1; k++) {
      const left = k === 0 ? 0 : row[k - 1];
      const right = k > r ? 0 : row[k];
      next[k] = left ^ right;
    }
    row = next;
  }
}

function drawRule90(ctx: CanvasRenderingContext2D, W: number, H: number, gens: number) {
  const width = gens * 2 - 1;
  const margin = 10;
  const cellW = (W - 2 * margin) / width;
  const cellH = (H - 2 * margin) / gens;
  const cell = Math.max(1, Math.min(cellW, cellH));
  const totalW = cell * width;
  const totalH = cell * gens;
  const ox = (W - totalW) / 2;
  const oy = (H - totalH) / 2;
  let cells = new Uint8Array(width);
  cells[(width - 1) >> 1] = 1;
  for (let g = 0; g < gens; g++) {
    for (let i = 0; i < width; i++) {
      if (cells[i] === 1) {
        const size = Math.max(1, cell - 0.5);
        ctx.fillRect(ox + i * cell, oy + g * cell, size, size);
      }
    }
    const next = new Uint8Array(width);
    for (let i = 0; i < width; i++) {
      const left = i === 0 ? 0 : cells[i - 1];
      const right = i === width - 1 ? 0 : cells[i + 1];
      next[i] = left ^ right;
    }
    cells = next;
  }
}
