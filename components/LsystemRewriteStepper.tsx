"use client";

import { useEffect, useMemo, useState } from "react";

// A small interactive widget that shows an L-system axiom, its rewriting
// rules, and lets the visitor advance one generation at a time. The growing
// string is rendered character-by-character with a subtle fade-in so the
// "rewrite" feels like real growth, not just a text dump.

interface Preset {
  id: string;
  label: string;
  axiom: string;
  rules: Record<string, string>;
  note?: string;
}

const PRESETS: Preset[] = [
  {
    id: "algae",
    label: "Algae · A→AB, B→A",
    axiom: "A",
    rules: { A: "AB", B: "A" },
    note: "Lengths: 1, 2, 3, 5, 8, 13… — the Fibonacci sequence.",
  },
  {
    id: "sierpinski",
    label: "Sierpiński · F→F+F−F+F",
    axiom: "F-F-F",
    rules: { F: "F+F-F+F" },
    note: "Turn angle 60°. After a few steps a Sierpiński curve appears.",
  },
  {
    id: "koch",
    label: "Koch · F→F+F−F−F+F",
    axiom: "F",
    rules: { F: "F+F-F-F+F" },
    note: "Turn angle 90°. The classic Koch quadratic curve.",
  },
];

interface Props {
  caption: string;
  stepLabel: string;
  resetLabel: string;
  presetLabel: string;
  generationLabel: string;
  lengthLabel: string;
  axiomLabel: string;
  rulesLabel: string;
  noteLabel: string;
}

const MAX_LEN = 1200; // cap displayed string so we never blow up the DOM
const MAX_STEPS = 10;

function rewrite(s: string, rules: Record<string, string>): string {
  let out = "";
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    out += rules[ch] ?? ch;
    if (out.length > MAX_LEN * 2) break;
  }
  return out;
}

function colorFor(ch: string): string {
  switch (ch) {
    case "F":
    case "G":
      return "text-signal-cyan";
    case "A":
      return "text-signal-amber";
    case "B":
      return "text-signal-violet";
    case "+":
      return "text-signal-rose";
    case "-":
      return "text-signal-rose";
    case "[":
    case "]":
      return "text-ink-300";
    default:
      return "text-ink-100";
  }
}

export function LsystemRewriteStepper({
  caption,
  stepLabel,
  resetLabel,
  presetLabel,
  generationLabel,
  lengthLabel,
  axiomLabel,
  rulesLabel,
  noteLabel,
}: Props) {
  const [presetId, setPresetId] = useState<string>(PRESETS[0].id);
  const preset = useMemo(() => PRESETS.find((p) => p.id === presetId) ?? PRESETS[0], [presetId]);
  const [history, setHistory] = useState<string[]>([preset.axiom]);

  // When the preset changes, reset the history to its axiom.
  useEffect(() => {
    setHistory([preset.axiom]);
  }, [preset.axiom]);

  const current = history[history.length - 1];
  const generation = history.length - 1;
  const displayed = current.length > MAX_LEN ? current.slice(0, MAX_LEN) : current;
  const truncated = current.length > MAX_LEN;

  const onStep = () => {
    if (generation >= MAX_STEPS) return;
    const next = rewrite(current, preset.rules);
    setHistory((h) => [...h, next]);
  };
  const onReset = () => setHistory([preset.axiom]);

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

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="hairline space-y-2 rounded-md border bg-ink-950/50 p-4">
          <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
            {axiomLabel}
          </div>
          <div className="font-mono text-lg text-signal-amber">{preset.axiom}</div>
        </div>
        <div className="hairline space-y-2 rounded-md border bg-ink-950/50 p-4">
          <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
            {rulesLabel}
          </div>
          <ul className="space-y-1 font-mono text-sm text-ink-100">
            {Object.entries(preset.rules).map(([k, v]) => (
              <li key={k}>
                <span className="text-signal-amber">{k}</span>
                <span className="text-ink-400"> → </span>
                <span className="text-ink-100">{v}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="hairline min-h-[110px] rounded-md border bg-ink-950/70 p-4">
        <div className="mb-2 flex items-center justify-between">
          <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
            {generationLabel} · <span className="text-signal-amber">{generation}</span>
          </div>
          <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
            {lengthLabel} · <span className="text-signal-amber">{current.length}</span>
          </div>
        </div>
        <div key={generation} className="reveal-chars break-all font-mono text-sm leading-relaxed">
          {displayed.split("").map((ch, i) => (
            <span
              key={i}
              className={`inline-block ${colorFor(ch)}`}
              style={{
                animation: `lsysFade 320ms ease-out both`,
                animationDelay: `${Math.min(i, 240) * 4}ms`,
              }}
            >
              {ch}
            </span>
          ))}
          {truncated && <span className="text-ink-400"> … (+{current.length - MAX_LEN})</span>}
        </div>
      </div>

      {preset.note && (
        <div className="text-xs leading-relaxed text-ink-300">
          <span className="mr-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-400">
            {noteLabel}
          </span>
          {preset.note}
        </div>
      )}

      <div className="hairline flex flex-wrap items-center gap-3 border-t pt-2">
        <button
          type="button"
          onClick={onStep}
          disabled={generation >= MAX_STEPS}
          className="rounded-full border border-signal-amber/70 bg-signal-amber/10 px-5 py-2 font-mono text-[11px] uppercase tracking-widest2 text-signal-amber transition-colors hover:bg-signal-amber/20 disabled:cursor-not-allowed disabled:opacity-40"
        >
          → {stepLabel}
        </button>
        <button
          type="button"
          onClick={onReset}
          className="hairline rounded-full border px-5 py-2 font-mono text-[11px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-ink-300/50 hover:text-ink-100"
        >
          {resetLabel}
        </button>
      </div>

      <style jsx>{`
        @keyframes lsysFade {
          from {
            opacity: 0;
            transform: translateY(2px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
