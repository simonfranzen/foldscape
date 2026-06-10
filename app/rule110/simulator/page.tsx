"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { Info } from "@/components/Info";
import { useDpr } from "@/lib/hooks/useDpr";
import { palette } from "@/lib/visual/palette";

const WIDTH = 240;
const HEIGHT = 360;

type Seed = "single" | "random" | "edge";

const FAMOUS_RULES = [
  { rule: 110, label: "Rule 110", note: "Turing-complete (Cook)" },
  { rule: 30, label: "Rule 30", note: "Chaotic, used as RNG" },
  { rule: 90, label: "Rule 90", note: "Sierpiński triangle" },
  { rule: 184, label: "Rule 184", note: "Traffic flow model" },
  { rule: 54, label: "Rule 54", note: "Class IV — local structures" },
  { rule: 73, label: "Rule 73", note: "Strange small-scale order" },
  { rule: 150, label: "Rule 150", note: "XOR — perfect symmetry" },
  { rule: 22, label: "Rule 22", note: "Aperiodic, class III" },
];

function seedRow(width: number, kind: Seed): Uint8Array {
  const row = new Uint8Array(width);
  if (kind === "single") row[Math.floor(width / 2)] = 1;
  else if (kind === "edge") row[width - 2] = 1;
  else for (let i = 0; i < width; i++) row[i] = Math.random() < 0.45 ? 1 : 0;
  return row;
}

function step(row: Uint8Array, rule: number): Uint8Array {
  const n = row.length;
  const next = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    const l = row[(i - 1 + n) % n];
    const c = row[i];
    const r = row[(i + 1) % n];
    const key = (l << 2) | (c << 1) | r;
    next[i] = (rule >> key) & 1;
  }
  return next;
}

export default function Rule110Simulator() {
  const { a, u } = useI18n();
  const topic = a.topics.rule110;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dpr = useDpr();
  const [rule, setRule] = useState(110);
  const [seed, setSeed] = useState<Seed>("single");
  const [running, setRunning] = useState(true);
  const [speed, setSpeed] = useState(20);
  const [colourKey, setColourKey] = useState<"cyan" | "violet" | "amber" | "rose">("cyan");
  const [generation, setGeneration] = useState(0);

  // grid is stored as rolling rows of size HEIGHT, but each frame we redraw
  // the whole canvas from the current rolling buffer.
  const gridRef = useRef<Uint8Array[]>([]);
  const lastRef = useRef<number>(0);
  const accRef = useRef<number>(0);

  const reset = () => {
    gridRef.current = [seedRow(WIDTH, seed)];
    setGeneration(0);
  };

  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed]);

  // Drawing
  useEffect(() => {
    let raf = 0;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;;
    const colour = {
      cyan: palette.signal.cyan,
      violet: palette.signal.violet,
      amber: palette.signal.amber,
      rose: palette.signal.rose,
    }[colourKey];

    const draw = () => {
      const W = canvas.clientWidth * dpr;
      const H = canvas.clientHeight * dpr;
      if (canvas.width !== W || canvas.height !== H) {
        canvas.width = W;
        canvas.height = H;
      }
      const grid = gridRef.current;
      const cellW = W / WIDTH;
      const cellH = H / HEIGHT;
      ctx.fillStyle = palette.ink[950];
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = colour;
      const rows = grid.length;
      const offY = (HEIGHT - rows) * cellH;
      for (let y = 0; y < rows; y++) {
        const row = grid[y];
        const yPx = offY + y * cellH;
        for (let x = 0; x < WIDTH; x++) {
          if (row[x]) {
            ctx.fillRect(x * cellW, yPx, cellW + 0.5, cellH + 0.5);
          }
        }
      }
    };

    const tick = (now: number) => {
      if (running) {
        accRef.current += (now - lastRef.current) / 1000;
      }
      lastRef.current = now;
      const dt = 1 / speed;
      let advanced = false;
      while (accRef.current >= dt) {
        accRef.current -= dt;
        const grid = gridRef.current;
        const next = step(grid[grid.length - 1], rule);
        grid.push(next);
        if (grid.length > HEIGHT) grid.shift();
        advanced = true;
      }
      if (advanced) setGeneration((g) => g + 1);
      draw();
      raf = requestAnimationFrame(tick);
    };

    lastRef.current = performance.now();
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [rule, speed, running, colourKey, dpr]);

  const handleStep = () => {
    const grid = gridRef.current;
    const next = step(grid[grid.length - 1], rule);
    grid.push(next);
    if (grid.length > HEIGHT) grid.shift();
    setGeneration((g) => g + 1);
  };

  const binary = useMemo(() => rule.toString(2).padStart(8, "0"), [rule]);

  return (
    <main className="flex min-h-screen flex-col pt-14">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_420px]">
        <div className="relative min-h-[60vh] select-none bg-ink-950 lg:min-h-[calc(100vh-3.5rem)]">
          <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />
          <div className="pointer-events-none absolute left-4 right-4 top-4 flex items-start justify-between gap-3">
            <div className="glass hairline pointer-events-auto flex items-center gap-3 rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              <span>rule {rule}</span>
              <span className="text-ink-400">·</span>
              <span>0b{binary}</span>
              <span className="text-ink-400">·</span>
              <span>gen {generation}</span>
            </div>
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
              elementary CA · {WIDTH} cells
            </div>
          </div>
          <div className="glass hairline pointer-events-none absolute bottom-4 left-4 rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
            toroidal · time flows downward
          </div>
        </div>

        <aside className="hairline scrollbar-thin flex flex-col overflow-y-auto border-l bg-ink-900/40">
          <div className="hairline space-y-3 border-b p-6">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
              {topic.title}
            </div>
            <h1 className="math-italic text-3xl leading-tight text-ink-100">{topic.tagline}</h1>
            <p className="text-sm leading-relaxed text-ink-200">{topic.body}</p>
            <div className="hairline rounded-md border bg-ink-950/60 p-3 font-mono text-xs text-ink-100">
              rule N · bit k of N = next state of pattern k
            </div>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Famous rules
              <Info side="bottom">
                Out of 256 elementary rules, only a handful produce non-trivial behaviour. These
                eight are the most discussed.
              </Info>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {FAMOUS_RULES.map((r) => (
                <button
                  key={r.rule}
                  onClick={() => {
                    setRule(r.rule);
                    reset();
                  }}
                  className={`rounded-md border px-3 py-2 text-left transition-colors ${
                    rule === r.rule
                      ? "border-signal-cyan/60 bg-signal-cyan/10 text-signal-cyan"
                      : "hairline text-ink-200 hover:border-signal-cyan/40 hover:text-ink-100"
                  }`}
                >
                  <div className="text-sm">{r.label}</div>
                  <div className="mt-0.5 font-mono text-[10px] text-ink-400">{r.note}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Custom rule
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <span className="font-mono text-[10px] text-signal-cyan">{rule}</span>
                <span className="font-mono text-[10px] text-ink-400">0b{binary}</span>
              </div>
              <input
                type="range"
                value={rule}
                min={0}
                max={255}
                step={1}
                onChange={(e) => {
                  setRule(parseInt(e.target.value));
                  reset();
                }}
                className="w-full accent-signal-cyan"
              />
            </div>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Seed
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(["single", "edge", "random"] as Seed[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setSeed(s)}
                  className={`rounded-md border py-2 font-mono text-[10px] uppercase tracking-widest transition-colors ${
                    seed === s
                      ? "border-signal-cyan/60 bg-signal-cyan/10 text-signal-cyan"
                      : "hairline text-ink-300 hover:text-ink-100"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {u.life.controls}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setRunning((v) => !v)}
                className={`rounded-md border py-2 font-mono text-[11px] uppercase tracking-widest2 transition-colors ${
                  running
                    ? "border-signal-rose/60 bg-signal-rose/10 text-signal-rose"
                    : "border-signal-cyan/60 bg-signal-cyan/10 text-signal-cyan"
                }`}
              >
                {running ? `❚❚ ${u.life.pause}` : `▶ ${u.life.play}`}
              </button>
              <button
                onClick={handleStep}
                disabled={running}
                className="hairline rounded-md border py-2 font-mono text-[11px] uppercase tracking-widest2 text-ink-200 transition-colors hover:text-ink-100 disabled:opacity-40"
              >
                {u.life.step}
              </button>
              <button
                onClick={reset}
                className="hairline col-span-2 rounded-md border py-2 font-mono text-[11px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-signal-rose/40 hover:text-signal-rose"
              >
                ○ {u.life.clear}
              </button>
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                  {u.life.speed}
                </span>
                <span className="font-mono text-[10px] text-signal-cyan">{speed} gen/s</span>
              </div>
              <input
                type="range"
                value={speed}
                min={1}
                max={120}
                step={1}
                onChange={(e) => setSpeed(parseInt(e.target.value))}
                className="w-full accent-signal-cyan"
              />
            </div>
          </div>

          <div className="hairline border-b p-5">
            <div className="mb-3 font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {u.life.cellColour}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {(["cyan", "violet", "amber", "rose"] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setColourKey(c)}
                  className={`rounded-md border py-2 font-mono text-[10px] uppercase tracking-widest transition-colors ${
                    colourKey === c
                      ? `border-signal-${c}/60 text-signal-${c} bg-signal-${c}/10`
                      : "hairline text-ink-300 hover:text-ink-100"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
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
