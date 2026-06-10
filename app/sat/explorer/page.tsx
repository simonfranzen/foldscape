"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n/context";

// ── DPLL solver, stepped and visualised ────────────────────────────────────
// A literal is a variable index plus a sign. A clause is a disjunction of
// literals. Each call to step() performs exactly one DPLL action — unit
// propagation, a conflict-driven backtrack, a decision, or termination — so
// the reader watches the search tree grow and collapse one move at a time.
// Backtracking is chronological (plain DPLL), which is what makes the
// exponential worst case legible without conflict-driven clause learning.

type Lit = { v: number; neg: boolean };
type Clause = Lit[];
type Val = boolean | null;

interface Preset {
  id: string;
  label: string;
  vars: string[];
  clauses: Clause[];
}

const P = (v: number) => ({ v, neg: false });
const N = (v: number) => ({ v, neg: true });

const PRESETS: Preset[] = [
  {
    id: "sat",
    label: "Satisfiable · forces a backtrack",
    vars: ["a", "b", "c", "d"],
    clauses: [
      [N(0), P(1)], // ¬a ∨ b
      [N(0), N(1)], // ¬a ∨ ¬b   (a ⇒ b and a ⇒ ¬b — so a must be false)
      [P(0), P(2)], // a ∨ c
      [N(2), P(3)], // ¬c ∨ d
      [P(2), N(3)], // c ∨ ¬d
      [P(0), P(3)], // a ∨ d
    ],
  },
  {
    id: "unsat",
    label: "Unsatisfiable · every assignment ruled out",
    vars: ["a", "b", "c"],
    clauses: [
      [P(0), P(1), P(2)],
      [P(0), P(1), N(2)],
      [P(0), N(1), P(2)],
      [P(0), N(1), N(2)],
      [N(0), P(1), P(2)],
      [N(0), P(1), N(2)],
      [N(0), N(1), P(2)],
      [N(0), N(1), N(2)],
    ],
  },
  {
    id: "big",
    label: "Satisfiable · five variables",
    vars: ["a", "b", "c", "d", "e"],
    clauses: [
      [P(0), P(1)],
      [N(0), P(2)],
      [N(1), P(2)],
      [N(2), P(3), P(4)],
      [N(3), N(4)],
      [P(0), N(2), P(4)],
      [N(0), N(3)],
    ],
  },
];

type TrailEntry = {
  v: number;
  value: boolean;
  reason: "decide" | "unit";
  flipped: boolean;
  level: number;
};

type Status = "running" | "sat" | "unsat";

type Action =
  | { type: "decide"; v: number; value: boolean; level: number }
  | { type: "unit"; v: number; value: boolean; clause: number }
  | { type: "backtrack"; v: number; value: boolean; clause: number }
  | { type: "sat" }
  | { type: "unsat" }
  | { type: "start" };

interface State {
  assignment: Val[];
  trail: TrailEntry[];
  level: number;
  status: Status;
  action: Action;
}

const litVal = (l: Lit, a: Val[]): Val => (a[l.v] === null ? null : l.neg ? !a[l.v] : a[l.v]);

type ClauseStatus =
  | { kind: "sat" }
  | { kind: "conflict" }
  | { kind: "unit"; lit: Lit }
  | { kind: "open" };

function clauseStatus(c: Clause, a: Val[]): ClauseStatus {
  const unassigned: Lit[] = [];
  for (const l of c) {
    const v = litVal(l, a);
    if (v === true) return { kind: "sat" };
    if (v === null) unassigned.push(l);
  }
  if (unassigned.length === 0) return { kind: "conflict" };
  if (unassigned.length === 1) return { kind: "unit", lit: unassigned[0] };
  return { kind: "open" };
}

function initState(p: Preset): State {
  return {
    assignment: p.vars.map(() => null),
    trail: [],
    level: 0,
    status: "running",
    action: { type: "start" },
  };
}

// One DPLL move. Pure: returns the next State.
function step(p: Preset, s: State): State {
  if (s.status !== "running") return s;
  const a = [...s.assignment];
  let trail = [...s.trail];

  // 1. Conflict → chronological backtrack.
  const conflictIdx = p.clauses.findIndex((c) => clauseStatus(c, a).kind === "conflict");
  if (conflictIdx >= 0) {
    // Undo propagations and already-flipped decisions back to the last open decision.
    while (trail.length && (trail[trail.length - 1].reason === "unit" || trail[trail.length - 1].flipped)) {
      a[trail[trail.length - 1].v] = null;
      trail = trail.slice(0, -1);
    }
    if (trail.length === 0) {
      return { assignment: a, trail, level: 0, status: "unsat", action: { type: "unsat" } };
    }
    const d = trail[trail.length - 1];
    trail = trail.slice(0, -1);
    const flippedVal = !d.value;
    a[d.v] = flippedVal;
    trail = [...trail, { v: d.v, value: flippedVal, reason: "decide", flipped: true, level: d.level }];
    return {
      assignment: a,
      trail,
      level: d.level,
      status: "running",
      action: { type: "backtrack", v: d.v, value: flippedVal, clause: conflictIdx },
    };
  }

  // 2. Unit propagation.
  const unitIdx = p.clauses.findIndex((c) => clauseStatus(c, a).kind === "unit");
  if (unitIdx >= 0) {
    const st = clauseStatus(p.clauses[unitIdx], a) as { kind: "unit"; lit: Lit };
    const l = st.lit;
    const value = !l.neg;
    a[l.v] = value;
    trail = [...trail, { v: l.v, value, reason: "unit", flipped: false, level: s.level }];
    return {
      assignment: a,
      trail,
      level: s.level,
      status: "running",
      action: { type: "unit", v: l.v, value, clause: unitIdx },
    };
  }

  // 3. All variables assigned → satisfied.
  if (a.every((v) => v !== null)) {
    return { assignment: a, trail, level: s.level, status: "sat", action: { type: "sat" } };
  }

  // 4. Decide the first unassigned variable (true first).
  const v = a.findIndex((x) => x === null);
  const level = s.level + 1;
  a[v] = true;
  trail = [...trail, { v, value: true, reason: "decide", flipped: false, level }];
  return { assignment: a, trail, level, status: "running", action: { type: "decide", v, value: true, level } };
}

const litText = (l: Lit, p: Preset) => (l.neg ? "¬" : "") + p.vars[l.v];

export default function SatExplorer() {
  const { a: atlas, u } = useI18n();
  const topic = atlas.topics.sat;

  const [presetId, setPresetId] = useState("sat");
  const preset = useMemo(() => PRESETS.find((x) => x.id === presetId)!, [presetId]);
  const [state, setState] = useState<State>(() => initState(preset));
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(3); // steps per second

  // Reset whenever the preset changes.
  useEffect(() => {
    setPlaying(false);
    setState(initState(preset));
  }, [preset]);

  // Play loop — recreated each step so the closure sees fresh state.
  useEffect(() => {
    if (!playing) return;
    if (state.status !== "running") {
      setPlaying(false);
      return;
    }
    const id = setInterval(() => setState((s) => step(preset, s)), 1000 / Math.max(1, speed));
    return () => clearInterval(id);
  }, [playing, speed, state, preset]);

  const advance = () => setState((s) => step(preset, s));
  const reset = () => {
    setPlaying(false);
    setState(initState(preset));
  };

  const statuses = preset.clauses.map((c) => clauseStatus(c, state.assignment));
  const decisions = state.trail.filter((t) => t.reason === "decide").length;
  const props = state.trail.filter((t) => t.reason === "unit").length;

  const narration = describe(state.action, preset);

  return (
    <main className="flex min-h-screen flex-col pt-14">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_420px]">
        {/* Main view */}
        <div className="relative flex min-h-[60vh] flex-col gap-5 bg-ink-950 p-4 lg:min-h-[calc(100vh-3.5rem)] lg:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              CNF · {preset.vars.length} vars · {preset.clauses.length} clauses
            </div>
            <div
              className={`glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 ${
                state.status === "sat"
                  ? "text-signal-teal"
                  : state.status === "unsat"
                    ? "text-signal-rose"
                    : "text-signal-violet"
              }`}
            >
              {state.status === "sat"
                ? "⊨ SATISFIABLE"
                : state.status === "unsat"
                  ? "⊭ UNSATISFIABLE"
                  : "solving…"}
            </div>
          </div>

          {/* Current assignment */}
          <div className="hairline rounded-2xl border bg-ink-950/60 p-4">
            <div className="mb-3 font-mono text-[10px] uppercase tracking-widest2 text-ink-400">
              Assignment
            </div>
            <div className="flex flex-wrap gap-2">
              {preset.vars.map((name, i) => {
                const val = state.assignment[i];
                return (
                  <div
                    key={name}
                    className={`flex items-center gap-2 rounded-md border px-3 py-1.5 font-mono text-sm ${
                      val === true
                        ? "border-signal-teal/60 bg-signal-teal/10 text-signal-teal"
                        : val === false
                          ? "border-ink-500/50 bg-ink-900/60 text-ink-200"
                          : "hairline text-ink-500"
                    }`}
                  >
                    <span className="text-base">{name}</span>
                    <span className="opacity-60">=</span>
                    <span className="font-bold">{val === null ? "?" : val ? "T" : "F"}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Clauses */}
          <div className="hairline flex-1 overflow-auto rounded-2xl border bg-ink-950/60 p-4">
            <div className="mb-3 font-mono text-[10px] uppercase tracking-widest2 text-ink-400">
              Formula · each clause under the current assignment
            </div>
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2.5">
              {preset.clauses.map((clause, j) => {
                const st = statuses[j];
                const border =
                  st.kind === "sat"
                    ? "border-signal-teal/60 bg-signal-teal/10"
                    : st.kind === "conflict"
                      ? "border-signal-rose/70 bg-signal-rose/15"
                      : st.kind === "unit"
                        ? "border-signal-amber/60 bg-signal-amber/10"
                        : "hairline";
                return (
                  <span key={j} className="flex items-center gap-1.5">
                    <span
                      className={`inline-flex items-center rounded-md border px-2.5 py-1.5 font-mono text-sm ${border}`}
                      title={
                        st.kind === "sat"
                          ? "satisfied"
                          : st.kind === "conflict"
                            ? "conflict — all literals false"
                            : st.kind === "unit"
                              ? "unit — one literal forced"
                              : "open"
                      }
                    >
                      <span className="text-ink-500">(</span>
                      {clause.map((l, k) => {
                        const v = litVal(l, state.assignment);
                        return (
                          <span key={k}>
                            <span
                              className={
                                v === true
                                  ? "text-signal-teal"
                                  : v === false
                                    ? "text-ink-600 line-through"
                                    : "text-ink-200"
                              }
                            >
                              {litText(l, preset)}
                            </span>
                            {k < clause.length - 1 && <span className="text-ink-600"> ∨ </span>}
                          </span>
                        );
                      })}
                      <span className="text-ink-500">)</span>
                    </span>
                    {j < preset.clauses.length - 1 && (
                      <span className="font-mono text-sm text-ink-600">∧</span>
                    )}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Decision trail */}
          <div className="hairline rounded-2xl border bg-ink-950/60 p-4">
            <div className="mb-3 font-mono text-[10px] uppercase tracking-widest2 text-ink-400">
              Search path · {decisions} decisions · {props} propagations
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {state.trail.length === 0 && (
                <span className="font-mono text-[11px] text-ink-500">— empty —</span>
              )}
              {state.trail.map((t, i) => (
                <span
                  key={i}
                  className={`rounded-md border px-2 py-1 font-mono text-[11px] ${
                    t.reason === "decide"
                      ? "border-signal-violet/50 bg-signal-violet/10 text-signal-violet"
                      : "border-signal-cyan/40 bg-signal-cyan/10 text-signal-cyan"
                  }`}
                  title={t.reason === "decide" ? `decision · level ${t.level}` : "unit propagation"}
                >
                  {preset.vars[t.v]}={t.value ? "T" : "F"}
                  {t.reason === "decide" ? (t.flipped ? " ⤺" : " ▼") : ""}
                </span>
              ))}
            </div>
          </div>

          {/* Narration */}
          <div
            className={`rounded-md border px-4 py-3 font-mono text-xs leading-relaxed ${
              state.status === "sat"
                ? "border-signal-teal/50 bg-signal-teal/10 text-ink-100"
                : state.status === "unsat"
                  ? "border-signal-rose/50 bg-signal-rose/10 text-ink-100"
                  : "hairline text-ink-300"
            }`}
          >
            {narration}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="hairline scrollbar-thin flex flex-col overflow-y-auto border-l bg-ink-900/40">
          <div className="hairline space-y-3 border-b p-6">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-violet">
              {topic.title}
            </div>
            <h1 className="math-italic text-3xl leading-tight text-ink-100">{topic.tagline}</h1>
            <p className="text-sm leading-relaxed text-ink-200">{topic.body}</p>
          </div>

          {/* Formula picker */}
          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Formula
            </div>
            <div className="grid grid-cols-1 gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPresetId(p.id)}
                  className={`rounded-md border px-3 py-2 text-left transition-colors ${
                    presetId === p.id
                      ? "border-signal-violet/60 bg-signal-violet/10 text-signal-violet"
                      : "hairline text-ink-200 hover:border-signal-violet/40 hover:text-ink-100"
                  }`}
                >
                  <div className="font-mono text-xs">{p.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Controls
            </div>
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => {
                  setPlaying(false);
                  advance();
                }}
                disabled={state.status !== "running"}
                className="hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-ink-200 hover:border-signal-violet/50 hover:text-signal-violet disabled:opacity-40"
              >
                Step
              </button>
              <button
                onClick={() => setPlaying(true)}
                disabled={state.status !== "running" || playing}
                className="hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-ink-200 hover:border-signal-violet/50 hover:text-signal-violet disabled:opacity-40"
              >
                Play
              </button>
              <button
                onClick={() => setPlaying(false)}
                disabled={!playing}
                className="hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-ink-200 hover:border-signal-violet/50 hover:text-signal-violet disabled:opacity-40"
              >
                Pause
              </button>
              <button
                onClick={reset}
                className="hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-ink-200 hover:border-signal-rose/50 hover:text-signal-rose"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Speed */}
          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">Speed</div>
            <div className="flex items-center justify-between font-mono text-sm">
              <span className="text-signal-violet">{speed} steps/s</span>
            </div>
            <input
              type="range"
              value={speed}
              min={1}
              max={12}
              step={1}
              onChange={(e) => setSpeed(parseInt(e.target.value))}
              className="w-full accent-signal-violet"
            />
          </div>

          {/* Legend */}
          <div className="hairline space-y-2 border-b p-5 font-mono text-[10px] text-ink-200">
            <div className="uppercase tracking-widest2 text-ink-300">Clause colour</div>
            <Legend swatch="bg-signal-teal/30 border-signal-teal/60" label="satisfied" />
            <Legend swatch="bg-signal-amber/20 border-signal-amber/60" label="unit — one literal forced" />
            <Legend swatch="bg-signal-rose/20 border-signal-rose/70" label="conflict — all false" />
            <Legend swatch="bg-ink-900 border-ink-500/40" label="open — undecided" />
            <div className="pt-2 uppercase tracking-widest2 text-ink-300">Search path</div>
            <Legend swatch="bg-signal-violet/20 border-signal-violet/60" label="▼ decision · ⤺ flipped" />
            <Legend swatch="bg-signal-cyan/20 border-signal-cyan/50" label="unit propagation" />
          </div>

          <div className="p-5">
            <Link
              href="/sat"
              className="hairline mb-2 block w-full rounded-md border py-2 text-center font-mono text-[10px] uppercase tracking-widest2 text-ink-300 transition-colors hover:border-signal-violet/40 hover:text-signal-violet"
            >
              ← Story
            </Link>
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

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`inline-block h-3 w-3 rounded-sm border ${swatch}`} />
      {label}
    </div>
  );
}

function describe(action: Action, p: Preset): string {
  switch (action.type) {
    case "start":
      return "Pick a formula and press Step. The solver decides a variable, propagates the forced consequences, and backtracks out of every contradiction.";
    case "decide":
      return `Decision: no clause forces anything, so guess ${p.vars[action.v]} = true and open decision level ${action.level}.`;
    case "unit":
      return `Unit propagation: clause ${action.clause + 1} has one literal left, forcing ${p.vars[action.v]} = ${action.value ? "true" : "false"}.`;
    case "backtrack":
      return `Conflict in clause ${action.clause + 1} — every literal is false. Backtrack and flip the last open decision: ${p.vars[action.v]} = ${action.value ? "true" : "false"}.`;
    case "sat":
      return "Every variable is assigned and every clause is satisfied — the formula is SATISFIABLE. The assignment is a certificate anyone can check in one pass.";
    case "unsat":
      return "Backtracking ran past the root: every branch ends in conflict. The formula is UNSATISFIABLE — and the search just proved it, the hard direction.";
  }
}
