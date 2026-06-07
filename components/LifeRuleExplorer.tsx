"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";

// Side-by-side rule exploration. The same seed soup runs under any B/S rule
// the user picks. Default seed is a small random soup so divergence between
// rules is dramatic within a few generations.

const COLS = 36;
const ROWS = 28;

type Rule = { b: ReadonlySet<number>; s: ReadonlySet<number>; name: string; key: string };

export interface RulePreset {
  key: string;
  name: string;
  birth: number[];
  survive: number[];
}

const PRESETS: RulePreset[] = [
  { key: "gol", name: "Conway · B3/S23", birth: [3], survive: [2, 3] },
  { key: "high", name: "HighLife · B36/S23", birth: [3, 6], survive: [2, 3] },
  { key: "dnd", name: "Day & Night · B3678/S34678", birth: [3, 6, 7, 8], survive: [3, 4, 6, 7, 8] },
  { key: "seeds", name: "Seeds · B2/S", birth: [2], survive: [] },
];

function _ruleFromPreset(p: RulePreset): Rule {
  return { b: new Set(p.birth), s: new Set(p.survive), name: p.name, key: p.key };
}

function ruleString(r: Rule): string {
  const b = [...r.b].sort((a, c) => a - c).join("");
  const s = [...r.s].sort((a, c) => a - c).join("");
  return `B${b}/S${s}`;
}

function stepGrid(src: Uint8Array, dst: Uint8Array, r: Rule) {
  for (let y = 0; y < ROWS; y++) {
    const yN = (y - 1 + ROWS) % ROWS;
    const yS = (y + 1) % ROWS;
    for (let x = 0; x < COLS; x++) {
      const xW = (x - 1 + COLS) % COLS;
      const xE = (x + 1) % COLS;
      const n =
        src[yN * COLS + xW] +
        src[yN * COLS + x] +
        src[yN * COLS + xE] +
        src[y * COLS + xW] +
        src[y * COLS + xE] +
        src[yS * COLS + xW] +
        src[yS * COLS + x] +
        src[yS * COLS + xE];
      const alive = src[y * COLS + x] === 1;
      dst[y * COLS + x] = alive ? (r.s.has(n) ? 1 : 0) : r.b.has(n) ? 1 : 0;
    }
  }
}

// Deterministic 'random' seed so all panes start identical and resets are
// reproducible. Mulberry32 with a fixed seed value.
function mulberry32(a: number) {
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seedSoup(g: Uint8Array, seedVal: number, density = 0.32) {
  const rnd = mulberry32(seedVal);
  for (let i = 0; i < g.length; i++) g[i] = rnd() < density ? 1 : 0;
}

export interface LifeRuleExplorerLabels {
  title: string;
  caption: string;
  step: string;
  reset: string;
  playPause: string;
  pause: string;
  birth: string;
  survive: string;
  presetLabel: string;
}

const DEFAULT_LABELS: LifeRuleExplorerLabels = {
  title: "Rule explorer",
  caption: "Same starting soup, different rules.",
  step: "Step",
  reset: "Reset",
  playPause: "Play",
  pause: "Pause",
  birth: "Birth",
  survive: "Survive",
  presetLabel: "Preset",
};

interface Props {
  labels?: Partial<LifeRuleExplorerLabels>;
}

export function LifeRuleExplorer({ labels }: Props) {
  const L = { ...DEFAULT_LABELS, ...labels };
  const [preset, setPreset] = useState<RulePreset>(PRESETS[0]);
  const [birth, setBirth] = useState<Set<number>>(new Set(PRESETS[0].birth));
  const [survive, setSurvive] = useState<Set<number>>(new Set(PRESETS[0].survive));
  const [seedVal, setSeedVal] = useState(42);
  const [generation, setGeneration] = useState(0);
  const [running, setRunning] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const aRef = useRef<Uint8Array>(new Uint8Array(COLS * ROWS));
  const bRef = useRef<Uint8Array>(new Uint8Array(COLS * ROWS));

  const rule = useMemo<Rule>(
    () => ({ b: birth, s: survive, name: "", key: "custom" }),
    [birth, survive],
  );

  const reset = useCallback(() => {
    seedSoup(aRef.current, seedVal);
    setGeneration(0);
  }, [seedVal]);

  // Reset on rule change or seed change
  useEffect(() => {
    reset();
  }, [reset, preset.key]);

  // Draw
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth * dpr;
    const h = canvas.clientHeight * dpr;
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    const ctx = canvas.getContext("2d")!;
    const cellSize = Math.min(canvas.width / COLS, canvas.height / ROWS);
    const offX = (canvas.width - cellSize * COLS) / 2;
    const offY = (canvas.height - cellSize * ROWS) / 2;
    ctx.fillStyle = "#06070d";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const r = cellSize * 0.38;
    ctx.fillStyle = "#b388ff";
    ctx.shadowColor = "#b388ff";
    ctx.shadowBlur = cellSize * 0.9;
    ctx.beginPath();
    const g = aRef.current;
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        if (g[y * COLS + x]) {
          const cx = offX + x * cellSize + cellSize / 2;
          const cy = offY + y * cellSize + cellSize / 2;
          ctx.moveTo(cx + r, cy);
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
        }
      }
    }
    ctx.fill();
    ctx.shadowBlur = 0;
  }, []);

  // Animation
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tickMs = 1000 / 10;
    let acc = 0;
    const loop = (now: number) => {
      acc += now - last;
      last = now;
      if (running) {
        while (acc >= tickMs) {
          acc -= tickMs;
          stepGrid(aRef.current, bRef.current, rule);
          const tmp = aRef.current;
          aRef.current = bRef.current;
          bRef.current = tmp;
          setGeneration((g) => g + 1);
        }
      } else {
        acc = 0;
      }
      draw();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [running, rule, draw]);

  const stepOnce = () => {
    stepGrid(aRef.current, bRef.current, rule);
    const tmp = aRef.current;
    aRef.current = bRef.current;
    bRef.current = tmp;
    setGeneration((g) => g + 1);
    draw();
  };

  const onPresetChange = (p: RulePreset) => {
    setPreset(p);
    setBirth(new Set(p.birth));
    setSurvive(new Set(p.survive));
  };

  const toggle = (which: "b" | "s", n: number) => {
    if (which === "b") {
      const next = new Set(birth);
      if (next.has(n)) next.delete(n);
      else next.add(n);
      setBirth(next);
    } else {
      const next = new Set(survive);
      if (next.has(n)) next.delete(n);
      else next.add(n);
      setSurvive(next);
    }
    setGeneration(0);
    seedSoup(aRef.current, seedVal);
  };

  const newSeed = () => {
    const v = Math.floor(Math.random() * 1_000_000);
    setSeedVal(v);
    seedSoup(aRef.current, v);
    setGeneration(0);
  };

  const displayRule: Rule = { b: birth, s: survive, name: "", key: "" };

  return (
    <div className="hairline space-y-4 rounded-2xl border bg-ink-950/40 p-4 md:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="font-mono text-xs uppercase tracking-widest2 text-signal-violet">
          {ruleString(displayRule)}
        </div>
        <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
          gen {generation}
        </div>
      </div>
      <div className="hairline aspect-[36/28] w-full overflow-hidden rounded-md border bg-ink-950">
        <canvas ref={canvasRef} className="block h-full w-full" />
      </div>
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
            {L.presetLabel}
          </span>
          {PRESETS.map((p) => (
            <button
              key={p.key}
              onClick={() => onPresetChange(p)}
              className={`rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest2 transition-colors ${
                preset.key === p.key
                  ? "border-signal-violet/70 bg-signal-violet/10 text-signal-violet"
                  : "hairline text-ink-200 hover:border-ink-300/50"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          <ToggleRow
            label={L.birth}
            color="text-signal-cyan"
            active={birth}
            onToggle={(n) => toggle("b", n)}
          />
          <ToggleRow
            label={L.survive}
            color="text-signal-amber"
            active={survive}
            onToggle={(n) => toggle("s", n)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setRunning((r) => !r)}
            className="rounded-full border border-signal-violet/60 bg-signal-violet/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest2 text-signal-violet transition-colors hover:bg-signal-violet/20"
          >
            {running ? L.pause : L.playPause}
          </button>
          <button
            onClick={stepOnce}
            className="hairline rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-ink-300/50 hover:text-ink-100"
          >
            {L.step}
          </button>
          <button
            onClick={() => {
              reset();
            }}
            className="hairline rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-ink-300/50 hover:text-ink-100"
          >
            {L.reset}
          </button>
          <button
            onClick={newSeed}
            className="hairline rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-signal-rose/60 hover:text-signal-rose"
          >
            ↻ seed
          </button>
        </div>
      </div>
      <p className="text-[11px] leading-relaxed text-ink-300">{L.caption}</p>
    </div>
  );
}

function ToggleRow({
  label,
  color,
  active,
  onToggle,
}: {
  label: string;
  color: string;
  active: ReadonlySet<number>;
  onToggle: (n: number) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className={`font-mono text-[10px] uppercase tracking-widest2 ${color} w-16 shrink-0`}>
        {label}
      </span>
      <div className="flex flex-wrap gap-1">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((n) => {
          const on = active.has(n);
          return (
            <button
              key={n}
              onClick={() => onToggle(n)}
              className={`h-7 w-7 rounded-md border font-mono text-[11px] transition-colors ${
                on
                  ? `border-current ${color} bg-ink-950/80`
                  : "hairline text-ink-500 hover:text-ink-200"
              }`}
              aria-pressed={on}
              aria-label={`${label} ${n}`}
            >
              {n}
            </button>
          );
        })}
      </div>
    </div>
  );
}
