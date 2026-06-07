"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";

// ---------------------------------------------------------------------------
// P vs NP Explorer — a small DPLL-style 3-SAT solver, animated.
//
// We represent a CNF formula as Clause[] where Clause is an array of signed
// integers: +k means literal x_k, -k means ¬x_k. Variables are 1-indexed so
// that the sign carries the polarity. An "assignment" is Map<var, bool>.
//
// The solver runs as an explicit stack of search "frames" so we can advance
// one step at a time and animate the tree. Each frame corresponds to a node
// in the DPLL search tree. We record the tree as we go for visual replay.
// ---------------------------------------------------------------------------

type Clause = number[];
type Formula = Clause[];
type Assignment = Map<number, boolean>;

// A tentative branching decision pushed onto the search stack.
interface Frame {
  variable: number; // variable we are branching on
  triedFirst: boolean; // have we tried "true" yet?
  triedSecond: boolean; // have we tried "false" yet?
  firstValue: boolean; // which polarity we try first
  snapshotAssign: Array<[number, boolean]>; // assignment to restore on backtrack
}

interface TreeNode {
  id: number;
  parent: number | null;
  depth: number;
  variable: number | null; // null = root
  value: boolean | null; // value chosen on the edge from parent
  status: "open" | "conflict" | "sat" | "explored";
}

type Verdict = "running" | "sat" | "unsat" | "idle";

interface SolverState {
  formula: Formula;
  numVars: number;
  assign: Assignment;
  stack: Frame[];
  tree: TreeNode[];
  currentNodeId: number;
  verdict: Verdict;
  branches: number;
  unitProps: number;
  pureLits: number;
  conflicts: number;
  startedAt: number; // performance.now()
  elapsedMs: number;
  lastAction: string;
  finalAssign: Assignment | null;
}

// ---------------------------------------------------------------------------
// Pure helpers — CNF evaluation, unit propagation, pure-literal elim
// ---------------------------------------------------------------------------

function evalClauseUnderAssign(clause: Clause, a: Assignment): "sat" | "unsat" | "open" {
  let allFalse = true;
  for (const lit of clause) {
    const v = Math.abs(lit);
    if (!a.has(v)) {
      allFalse = false;
      continue;
    }
    const value = a.get(v)!;
    const lit_true = lit > 0 ? value : !value;
    if (lit_true) return "sat";
  }
  return allFalse ? "unsat" : "open";
}

function evalFormula(formula: Formula, a: Assignment): "sat" | "unsat" | "open" {
  let allSat = true;
  for (const c of formula) {
    const r = evalClauseUnderAssign(c, a);
    if (r === "unsat") return "unsat";
    if (r === "open") allSat = false;
  }
  return allSat ? "sat" : "open";
}

// Find one unit clause: a clause where exactly one literal is unassigned and
// no literal is satisfied. Returns the forced literal or null.
function findUnit(formula: Formula, a: Assignment): number | null {
  for (const c of formula) {
    let unassigned: number | null = null;
    let satisfied = false;
    let unassignedCount = 0;
    for (const lit of c) {
      const v = Math.abs(lit);
      if (!a.has(v)) {
        unassigned = lit;
        unassignedCount++;
        if (unassignedCount > 1) break;
        continue;
      }
      const value = a.get(v)!;
      if (lit > 0 ? value : !value) {
        satisfied = true;
        break;
      }
    }
    if (!satisfied && unassignedCount === 1 && unassigned !== null) {
      return unassigned;
    }
  }
  return null;
}

// Find a pure literal: a variable that appears only in one polarity across
// still-open clauses. Returns the literal or null.
function findPure(formula: Formula, a: Assignment): number | null {
  const polarity = new Map<number, { pos: boolean; neg: boolean }>();
  for (const c of formula) {
    if (evalClauseUnderAssign(c, a) === "sat") continue;
    for (const lit of c) {
      const v = Math.abs(lit);
      if (a.has(v)) continue;
      const slot = polarity.get(v) ?? { pos: false, neg: false };
      if (lit > 0) slot.pos = true;
      else slot.neg = true;
      polarity.set(v, slot);
    }
  }
  for (const [v, p] of polarity) {
    if (p.pos && !p.neg) return v;
    if (p.neg && !p.pos) return -v;
  }
  return null;
}

// Choose next branching variable — lowest-indexed unassigned variable.
function chooseBranchVar(numVars: number, a: Assignment): number | null {
  for (let v = 1; v <= numVars; v++) {
    if (!a.has(v)) return v;
  }
  return null;
}

function cloneAssignSnapshot(a: Assignment): Array<[number, boolean]> {
  return Array.from(a.entries());
}

function restoreAssign(a: Assignment, snap: Array<[number, boolean]>): void {
  a.clear();
  for (const [k, v] of snap) a.set(k, v);
}

// ---------------------------------------------------------------------------
// Preset instances
// ---------------------------------------------------------------------------

interface Preset {
  id: string;
  label: string;
  description: string;
  numVars: number;
  formula: Formula;
  verifyAssignment?: Assignment;
}

const PRESETS: Preset[] = [
  {
    id: "trivial",
    label: "Trivially SAT",
    description: "3 vars, 2 clauses. The solver finds it on the first descent.",
    numVars: 3,
    formula: [
      [1, 2, 3],
      [-1, 2, -3],
    ],
  },
  {
    id: "unsat-all",
    label: "All 8 clauses on 3 vars — UNSAT",
    description: "Every clause of length 3 on {x1,x2,x3}. No assignment can satisfy them all.",
    numVars: 3,
    formula: [
      [1, 2, 3],
      [1, 2, -3],
      [1, -2, 3],
      [1, -2, -3],
      [-1, 2, 3],
      [-1, 2, -3],
      [-1, -2, 3],
      [-1, -2, -3],
    ],
  },
  {
    id: "phase",
    label: "Phase-transition · m/n ≈ 4.26",
    description: "Random 3-SAT at the critical clause/variable density. Hardest known regime.",
    numVars: 7,
    formula: [
      [1, -2, 3],
      [-1, 4, 5],
      [2, -4, 6],
      [-3, -5, 7],
      [1, 5, -6],
      [-2, 3, -7],
      [4, -5, 7],
      [-1, -3, 6],
      [2, 4, -7],
      [-4, -6, 7],
      [1, -2, -5],
      [3, 5, -6],
      [-1, 2, 7],
      [-3, 4, -7],
      [1, -4, 6],
      [-2, -5, -6],
      [3, -5, 7],
      [-1, 5, 6],
      [2, -3, -4],
      [-6, -7, 1],
      [3, 4, -5],
      [-1, -2, 7],
      [4, 6, -7],
      [-3, 5, -7],
      [1, 2, -4],
      [-2, 6, 7],
      [-1, 3, -6],
      [4, 5, 6],
      [-2, -4, 7],
      [1, -3, -7],
    ],
  },
  {
    id: "pigeon",
    label: "Pigeonhole · 4 pigeons → 3 holes",
    description:
      "Encodes the pigeonhole principle. Famously requires exponential resolution proofs — DPLL will sweat.",
    numVars: 12, // x_{ij} for pigeon i ∈ 1..4, hole j ∈ 1..3 → var = (i-1)*3 + j
    formula: ((): Formula => {
      const v = (i: number, j: number) => (i - 1) * 3 + j;
      const cls: Formula = [];
      // Each pigeon i goes in some hole.
      for (let i = 1; i <= 4; i++) {
        cls.push([v(i, 1), v(i, 2), v(i, 3)]);
      }
      // No two pigeons share a hole.
      for (let j = 1; j <= 3; j++) {
        for (let i1 = 1; i1 <= 4; i1++) {
          for (let i2 = i1 + 1; i2 <= 4; i2++) {
            cls.push([-v(i1, j), -v(i2, j)]);
          }
        }
      }
      return cls;
    })(),
  },
  {
    id: "verify",
    label: "Verify-only · a 4-var SAT instance with a candidate",
    description:
      "Don't search. Plug the candidate assignment in and read off — this is the O(m) verifier that makes the problem NP.",
    numVars: 4,
    formula: [
      [1, -2, 3],
      [-1, 2, 4],
      [2, 3, -4],
      [-1, -3, -4],
      [1, 2, -3],
      [-2, 3, 4],
    ],
    verifyAssignment: new Map([
      [1, true],
      [2, true],
      [3, false],
      [4, true],
    ]),
  },
];

// ---------------------------------------------------------------------------
// Random 3-SAT generator
// ---------------------------------------------------------------------------

function randomFormula(n: number, m: number, seed: number): Formula {
  // Mulberry32 PRNG so results are repeatable per seed.
  let s = seed >>> 0;
  const rand = (): number => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const cls: Formula = [];
  for (let i = 0; i < m; i++) {
    const chosen = new Set<number>();
    const clause: Clause = [];
    while (chosen.size < 3 && chosen.size < n) {
      const v = 1 + Math.floor(rand() * n);
      if (chosen.has(v)) continue;
      chosen.add(v);
      const sign = rand() < 0.5 ? -1 : 1;
      clause.push(sign * v);
    }
    cls.push(clause);
  }
  return cls;
}

// ---------------------------------------------------------------------------
// Initial solver state
// ---------------------------------------------------------------------------

function makeInitialState(formula: Formula, numVars: number): SolverState {
  return {
    formula,
    numVars,
    assign: new Map(),
    stack: [],
    tree: [
      {
        id: 0,
        parent: null,
        depth: 0,
        variable: null,
        value: null,
        status: "open",
      },
    ],
    currentNodeId: 0,
    verdict: "idle",
    branches: 0,
    unitProps: 0,
    pureLits: 0,
    conflicts: 0,
    startedAt: 0,
    elapsedMs: 0,
    lastAction: "Ready.",
    finalAssign: null,
  };
}

// ---------------------------------------------------------------------------
// One DPLL step. Returns a *new* SolverState (we deep-clone what we mutate so
// React sees a fresh object every tick).
// ---------------------------------------------------------------------------

function step(prev: SolverState): SolverState {
  if (prev.verdict === "sat" || prev.verdict === "unsat") return prev;

  // Deep-ish clone of the mutable fields.
  const assign: Assignment = new Map(prev.assign);
  const stack: Frame[] = prev.stack.map((f) => ({
    variable: f.variable,
    triedFirst: f.triedFirst,
    triedSecond: f.triedSecond,
    firstValue: f.firstValue,
    snapshotAssign: [...f.snapshotAssign],
  }));
  const tree: TreeNode[] = prev.tree.map((n) => ({ ...n }));
  let { branches, unitProps, pureLits, conflicts, currentNodeId } = prev;
  let lastAction = prev.lastAction;

  const startedAt = prev.startedAt === 0 ? performance.now() : prev.startedAt;
  const verdictNow = evalFormula(prev.formula, assign);

  // 1) If the current partial assignment satisfies the formula → SAT.
  if (verdictNow === "sat") {
    tree[currentNodeId].status = "sat";
    return {
      ...prev,
      assign,
      stack,
      tree,
      verdict: "sat",
      lastAction: `SAT — assignment found at depth ${stack.length}.`,
      finalAssign: assign,
      startedAt,
      elapsedMs: performance.now() - startedAt,
    };
  }

  // 2) If a clause is falsified → conflict → backtrack.
  if (verdictNow === "unsat") {
    tree[currentNodeId].status = "conflict";
    conflicts++;
    lastAction = "Conflict — backtracking.";
    return backtrack(
      prev,
      assign,
      stack,
      tree,
      currentNodeId,
      branches,
      unitProps,
      pureLits,
      conflicts,
      lastAction,
      startedAt,
    );
  }

  // 3) Try unit propagation.
  const unit = findUnit(prev.formula, assign);
  if (unit !== null) {
    const v = Math.abs(unit);
    const val = unit > 0;
    assign.set(v, val);
    unitProps++;
    lastAction = `Unit propagate · x${v} := ${val ? "T" : "F"}`;
    return {
      ...prev,
      assign,
      stack,
      tree,
      currentNodeId,
      branches,
      unitProps,
      pureLits,
      conflicts,
      verdict: "running",
      lastAction,
      startedAt,
      elapsedMs: performance.now() - startedAt,
    };
  }

  // 4) Try pure-literal elimination.
  const pure = findPure(prev.formula, assign);
  if (pure !== null) {
    const v = Math.abs(pure);
    const val = pure > 0;
    assign.set(v, val);
    pureLits++;
    lastAction = `Pure literal · x${v} := ${val ? "T" : "F"}`;
    return {
      ...prev,
      assign,
      stack,
      tree,
      currentNodeId,
      branches,
      unitProps,
      pureLits,
      conflicts,
      verdict: "running",
      lastAction,
      startedAt,
      elapsedMs: performance.now() - startedAt,
    };
  }

  // 5) Branch on the next unassigned variable.
  const branchVar = chooseBranchVar(prev.numVars, assign);
  if (branchVar === null) {
    // No more variables; partial = full but formula isn't sat (would have been
    // caught above). Treat as conflict and backtrack.
    tree[currentNodeId].status = "conflict";
    conflicts++;
    lastAction = "No vars left, still unsatisfied → backtrack.";
    return backtrack(
      prev,
      assign,
      stack,
      tree,
      currentNodeId,
      branches,
      unitProps,
      pureLits,
      conflicts,
      lastAction,
      startedAt,
    );
  }

  const firstValue = true; // try true first
  const snapshot = cloneAssignSnapshot(assign);
  stack.push({
    variable: branchVar,
    triedFirst: true,
    triedSecond: false,
    firstValue,
    snapshotAssign: snapshot,
  });
  assign.set(branchVar, firstValue);
  branches++;
  const newNode: TreeNode = {
    id: tree.length,
    parent: currentNodeId,
    depth: stack.length,
    variable: branchVar,
    value: firstValue,
    status: "open",
  };
  tree.push(newNode);
  tree[currentNodeId].status = "explored";
  currentNodeId = newNode.id;
  lastAction = `Branch · x${branchVar} := ${firstValue ? "T" : "F"}  (depth ${stack.length})`;

  return {
    ...prev,
    assign,
    stack,
    tree,
    currentNodeId,
    branches,
    unitProps,
    pureLits,
    conflicts,
    verdict: "running",
    lastAction,
    startedAt,
    elapsedMs: performance.now() - startedAt,
  };
}

function backtrack(
  prev: SolverState,
  assign: Assignment,
  stack: Frame[],
  tree: TreeNode[],
  currentNodeId: number,
  branches: number,
  unitProps: number,
  pureLits: number,
  conflicts: number,
  lastAction: string,
  startedAt: number,
): SolverState {
  // Pop frames until we find one with an untried branch.
  while (stack.length > 0) {
    const top = stack[stack.length - 1];
    if (!top.triedSecond) {
      // Flip and try the other polarity.
      restoreAssign(assign, top.snapshotAssign);
      const newVal = !top.firstValue;
      top.triedSecond = true;
      assign.set(top.variable, newVal);
      const parentNode = tree[currentNodeId].parent;
      const branchParent = parentNode === null ? 0 : parentNode;
      const newNode: TreeNode = {
        id: tree.length,
        parent: branchParent,
        depth: stack.length,
        variable: top.variable,
        value: newVal,
        status: "open",
      };
      tree.push(newNode);
      currentNodeId = newNode.id;
      branches++;
      return {
        ...prev,
        assign,
        stack,
        tree,
        currentNodeId,
        branches,
        unitProps,
        pureLits,
        conflicts,
        verdict: "running",
        lastAction: `Backtrack · x${top.variable} := ${newVal ? "T" : "F"}  (depth ${stack.length})`,
        startedAt,
        elapsedMs: performance.now() - startedAt,
      };
    }
    // Both polarities tried — pop and keep going.
    stack.pop();
    const parentNode = tree[currentNodeId].parent;
    if (parentNode !== null) currentNodeId = parentNode;
  }
  // Stack exhausted → UNSAT.
  return {
    ...prev,
    assign,
    stack,
    tree,
    currentNodeId,
    branches,
    unitProps,
    pureLits,
    conflicts,
    verdict: "unsat",
    lastAction: "UNSAT — search tree exhausted.",
    startedAt,
    elapsedMs: performance.now() - startedAt,
    finalAssign: null,
  };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

type Mode = "solve" | "verify";

export default function PvsNPExplorer() {
  const { a, u } = useI18n();
  const topic = a.topics.pvsnp;

  const [mode, setMode] = useState<Mode>("solve");
  const [presetId, setPresetId] = useState<string>("trivial");
  const [n, setN] = useState(5);
  const [m, setM] = useState(20);
  const [seed, setSeed] = useState(1);
  const [speed, setSpeed] = useState(8); // steps/sec
  const [running, setRunning] = useState(false);

  // Active formula state
  const [activeFormula, setActiveFormula] = useState<Formula>(PRESETS[0].formula);
  const [activeVars, setActiveVars] = useState<number>(PRESETS[0].numVars);

  // Solver state
  const [state, setState] = useState<SolverState>(() =>
    makeInitialState(PRESETS[0].formula, PRESETS[0].numVars),
  );

  // Verify-mode assignment (used when mode = "verify")
  const [verifyAssign, setVerifyAssign] = useState<Assignment>(() => new Map());

  // ----- preset / formula loading -----
  const loadPreset = useCallback((p: Preset) => {
    setActiveFormula(p.formula);
    setActiveVars(p.numVars);
    setPresetId(p.id);
    setState(makeInitialState(p.formula, p.numVars));
    setRunning(false);
    if (p.verifyAssignment) {
      setMode("verify");
      setVerifyAssign(new Map(p.verifyAssignment));
    } else if (p.id !== "verify") {
      setMode("solve");
    }
  }, []);

  const loadRandom = useCallback(() => {
    const f = randomFormula(n, m, seed);
    setActiveFormula(f);
    setActiveVars(n);
    setPresetId("random");
    setState(makeInitialState(f, n));
    setRunning(false);
    setMode("solve");
  }, [n, m, seed]);

  // ----- run loop -----
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    if (!running) return;
    const interval = Math.max(15, 1000 / Math.max(1, speed));
    const id = window.setInterval(() => {
      const s = stateRef.current;
      if (s.verdict === "sat" || s.verdict === "unsat") {
        setRunning(false);
        return;
      }
      setState(step(s));
    }, interval);
    return () => window.clearInterval(id);
  }, [running, speed]);

  const handleStep = useCallback(() => {
    setState((s) => step(s));
  }, []);
  const handleReset = useCallback(() => {
    setState(makeInitialState(activeFormula, activeVars));
    setRunning(false);
  }, [activeFormula, activeVars]);

  // ----- verify-mode evaluation -----
  const verifyResult = useMemo((): {
    overall: "sat" | "unsat" | "open";
    perClause: Array<"sat" | "unsat" | "open">;
  } => {
    const per = activeFormula.map((c) => evalClauseUnderAssign(c, verifyAssign));
    let overall: "sat" | "unsat" | "open" = "sat";
    for (const r of per) {
      if (r === "unsat") {
        overall = "unsat";
        break;
      }
      if (r === "open") overall = "open";
    }
    return { overall, perClause: per };
  }, [activeFormula, verifyAssign]);

  // ----- clause render (with per-literal colouring) -----
  const liveAssign = mode === "verify" ? verifyAssign : state.assign;
  const formulaToShow = activeFormula;

  // Render
  return (
    <main className="flex min-h-screen flex-col pt-14">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_420px]">
        <div className="relative flex min-h-[60vh] flex-col gap-4 overflow-y-auto bg-ink-950 p-4 lg:min-h-[calc(100vh-3.5rem)] lg:p-6">
          {/* Header strips */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              {mode === "verify" ? "Verify mode · O(m) check" : "DPLL search · 3-SAT"}
            </div>
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-rose">
              n = {activeVars} · m = {formulaToShow.length}
            </div>
          </div>

          {/* Clause display */}
          <div className="hairline rounded-2xl border bg-ink-950/60 p-4 md:p-5">
            <div className="mb-3 font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Formula φ — conjunction of clauses
            </div>
            <div className="flex flex-wrap gap-x-2 gap-y-2 font-mono text-sm leading-relaxed md:text-base">
              {formulaToShow
                .map((clause, ci) => {
                  const r =
                    mode === "verify"
                      ? verifyResult.perClause[ci]
                      : evalClauseUnderAssign(clause, liveAssign);
                  const color =
                    r === "sat"
                      ? "text-signal-amber border-signal-amber/40 bg-signal-amber/5"
                      : r === "unsat"
                        ? "text-signal-rose border-signal-rose/60 bg-signal-rose/10"
                        : "text-ink-200 border-ink-700/60 bg-ink-950/40";
                  return (
                    <span
                      key={ci}
                      className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 ${color}`}
                    >
                      <span className="text-[10px] opacity-60">c{ci + 1}</span>
                      <span>(</span>
                      {clause.map((lit, li) => {
                        const v = Math.abs(lit);
                        const has = liveAssign.has(v);
                        const value = has ? liveAssign.get(v)! : null;
                        const litTrue = has ? (lit > 0 ? value! : !value!) : null;
                        const litColor =
                          litTrue === true
                            ? "text-signal-amber"
                            : litTrue === false
                              ? "text-signal-rose/80 line-through"
                              : "text-ink-100";
                        return (
                          <span key={li} className={litColor}>
                            {li > 0 ? <span className="mx-0.5 text-ink-500">∨</span> : null}
                            {lit < 0 ? "¬" : ""}x<sub>{v}</sub>
                          </span>
                        );
                      })}
                      <span>)</span>
                    </span>
                  );
                })
                .reduce<React.ReactNode[]>((acc, el, i) => {
                  if (i > 0)
                    acc.push(
                      <span key={`and-${i}`} className="px-0.5 text-ink-500">
                        ∧
                      </span>,
                    );
                  acc.push(el);
                  return acc;
                }, [])}
            </div>
          </div>

          {/* Assignment row */}
          <div className="hairline rounded-2xl border bg-ink-950/60 p-4 md:p-5">
            <div className="mb-3 font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {mode === "verify" ? "Candidate assignment" : "Partial assignment"}
            </div>
            <div className="flex flex-wrap gap-2 font-mono text-sm">
              {Array.from({ length: activeVars }, (_, i) => i + 1).map((v) => {
                const has = liveAssign.has(v);
                const value = has ? liveAssign.get(v)! : null;
                const tone = !has
                  ? "border-ink-700/60 bg-ink-950/40 text-ink-300"
                  : value
                    ? "border-signal-amber/50 bg-signal-amber/10 text-signal-amber"
                    : "border-signal-rose/50 bg-signal-rose/10 text-signal-rose";
                if (mode === "verify") {
                  return (
                    <button
                      key={v}
                      onClick={() => {
                        const next = new Map(verifyAssign);
                        if (!next.has(v)) next.set(v, true);
                        else if (next.get(v) === true) next.set(v, false);
                        else next.delete(v);
                        setVerifyAssign(next);
                      }}
                      className={`rounded-md border px-3 py-1.5 transition-colors ${tone} hover:border-ink-300/60`}
                    >
                      x<sub>{v}</sub> = {has ? (value ? "T" : "F") : "?"}
                    </button>
                  );
                }
                return (
                  <span key={v} className={`rounded-md border px-3 py-1.5 ${tone}`}>
                    x<sub>{v}</sub> = {has ? (value ? "T" : "F") : "?"}
                  </span>
                );
              })}
            </div>
            {mode === "verify" && (
              <div className="mt-3 font-mono text-[11px] text-ink-400">
                Click variables to toggle T → F → unset.
              </div>
            )}
          </div>

          {/* Verdict panel */}
          <div className="hairline rounded-2xl border bg-ink-950/60 p-4 md:p-5">
            <div className="mb-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {mode === "verify" ? "Verifier output" : "Current node"}
            </div>
            {mode === "verify" ? (
              <div className="space-y-2">
                <div
                  className={`font-mono text-lg ${
                    verifyResult.overall === "sat"
                      ? "text-signal-amber"
                      : verifyResult.overall === "unsat"
                        ? "text-signal-rose"
                        : "text-ink-200"
                  }`}
                >
                  {verifyResult.overall === "sat"
                    ? "✓ SATISFIED — every clause evaluates to true."
                    : verifyResult.overall === "unsat"
                      ? "✗ FALSIFIED — at least one clause is broken."
                      : "… incomplete — some variables unassigned."}
                </div>
                <div className="text-xs leading-relaxed text-ink-300">
                  Verification scans the m clauses once and checks each in O(1). Total work: O(m) —
                  independent of the search space. This is what puts the problem in NP.
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="font-mono text-sm text-ink-100">{state.lastAction}</div>
                <div className="font-mono text-xs text-ink-400">
                  verdict ={" "}
                  <span
                    className={
                      state.verdict === "sat"
                        ? "text-signal-amber"
                        : state.verdict === "unsat"
                          ? "text-signal-rose"
                          : "text-ink-200"
                    }
                  >
                    {state.verdict}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Search-tree visualisation */}
          {mode === "solve" && (
            <div className="hairline min-h-[260px] flex-1 rounded-2xl border bg-ink-950/60 p-4 md:p-5">
              <div className="mb-3 font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                DPLL search tree · depth = {state.stack.length}
              </div>
              <SearchTree state={state} />
            </div>
          )}
        </div>

        {/* SIDEBAR */}
        <aside className="hairline scrollbar-thin flex flex-col overflow-y-auto border-l bg-ink-900/40">
          {/* Topic header */}
          <div className="hairline space-y-3 border-b p-6">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-rose">
              {topic.title}
            </div>
            <h1 className="math-italic text-3xl leading-tight text-ink-100">{topic.tagline}</h1>
            <p className="text-sm leading-relaxed text-ink-200">{topic.body}</p>
          </div>

          {/* Preset picker */}
          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Preset 3-SAT instance
            </div>
            <div className="space-y-2">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => loadPreset(p)}
                  className={`w-full rounded-md border px-3 py-2 text-left transition-colors ${
                    presetId === p.id
                      ? "border-signal-rose/60 bg-signal-rose/10 text-signal-rose"
                      : "hairline text-ink-200 hover:border-signal-rose/40 hover:text-ink-100"
                  }`}
                >
                  <div className="font-mono text-xs">{p.label}</div>
                  <div className="mt-0.5 font-mono text-[10px] leading-snug text-ink-400">
                    {p.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Random generator */}
          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Random 3-SAT
            </div>
            <div className="font-mono text-[10px] text-ink-300">Variables n = {n}</div>
            <input
              type="range"
              value={n}
              min={3}
              max={12}
              step={1}
              onChange={(e) => setN(parseInt(e.target.value))}
              className="w-full accent-signal-rose"
            />
            <div className="font-mono text-[10px] text-ink-300">Clauses m = {m}</div>
            <input
              type="range"
              value={m}
              min={3}
              max={50}
              step={1}
              onChange={(e) => setM(parseInt(e.target.value))}
              className="w-full accent-signal-rose"
            />
            <div className="font-mono text-[10px] text-ink-300">Seed = {seed}</div>
            <input
              type="range"
              value={seed}
              min={1}
              max={999}
              step={1}
              onChange={(e) => setSeed(parseInt(e.target.value))}
              className="w-full accent-signal-amber"
            />
            <div className="font-mono text-[10px] text-ink-400">
              m / n = {(m / n).toFixed(2)} · phase transition ≈ 4.26
            </div>
            <button
              onClick={loadRandom}
              className="w-full rounded-md border border-signal-rose/50 bg-signal-rose/10 py-2 font-mono text-[11px] uppercase tracking-widest2 text-signal-rose transition-colors hover:bg-signal-rose/20"
            >
              Generate random
            </button>
          </div>

          {/* Speed + controls */}
          {mode === "solve" && (
            <div className="hairline space-y-3 border-b p-5">
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                Speed · {speed} steps/s
              </div>
              <input
                type="range"
                value={speed}
                min={1}
                max={60}
                step={1}
                onChange={(e) => setSpeed(parseInt(e.target.value))}
                className="w-full accent-signal-amber"
              />
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleStep}
                  disabled={state.verdict === "sat" || state.verdict === "unsat"}
                  className="hairline rounded-md border py-2 font-mono text-[11px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-signal-rose/40 hover:text-signal-rose disabled:opacity-30"
                >
                  Step
                </button>
                <button
                  onClick={() => setRunning((r) => !r)}
                  disabled={state.verdict === "sat" || state.verdict === "unsat"}
                  className="rounded-md border border-signal-rose/50 bg-signal-rose/10 py-2 font-mono text-[11px] uppercase tracking-widest2 text-signal-rose transition-colors hover:bg-signal-rose/20 disabled:opacity-30"
                >
                  {running ? "Pause" : "Run"}
                </button>
                <button
                  onClick={handleReset}
                  className="hairline col-span-2 rounded-md border py-2 font-mono text-[11px] uppercase tracking-widest2 text-ink-300 transition-colors hover:border-ink-300/50"
                >
                  Reset
                </button>
              </div>
            </div>
          )}

          {/* Stats */}
          {mode === "solve" && (
            <div className="hairline space-y-2 border-b p-5 font-mono text-xs">
              <div className="mb-1 font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                Solver stats
              </div>
              <StatRow label="elapsed" value={`${state.elapsedMs.toFixed(1)} ms`} />
              <StatRow label="branches" value={`${state.branches}`} />
              <StatRow label="unit-prop" value={`${state.unitProps}`} />
              <StatRow label="pure-lit" value={`${state.pureLits}`} />
              <StatRow label="conflicts" value={`${state.conflicts}`} />
              <StatRow label="depth" value={`${state.stack.length}`} />
              <StatRow
                label="verdict"
                value={state.verdict}
                accent={
                  state.verdict === "sat"
                    ? "text-signal-amber"
                    : state.verdict === "unsat"
                      ? "text-signal-rose"
                      : "text-ink-200"
                }
              />
              {state.finalAssign && (
                <div className="mt-2 text-[10px] leading-relaxed text-ink-300">
                  Found:{" "}
                  {Array.from({ length: activeVars }, (_, i) => i + 1)
                    .map(
                      (v) =>
                        `x${v}=${state.finalAssign!.get(v) ? "T" : state.finalAssign!.get(v) === false ? "F" : "?"}`,
                    )
                    .join(", ")}
                </div>
              )}
            </div>
          )}

          {/* Verify-mode toggle */}
          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Mode
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setMode("solve")}
                className={`rounded-md border px-2 py-1.5 font-mono text-[11px] uppercase tracking-widest2 transition-colors ${
                  mode === "solve"
                    ? "border-signal-rose/60 bg-signal-rose/10 text-signal-rose"
                    : "hairline text-ink-300 hover:text-ink-100"
                }`}
              >
                Solve
              </button>
              <button
                onClick={() => setMode("verify")}
                className={`rounded-md border px-2 py-1.5 font-mono text-[11px] uppercase tracking-widest2 transition-colors ${
                  mode === "verify"
                    ? "border-signal-amber/60 bg-signal-amber/10 text-signal-amber"
                    : "hairline text-ink-300 hover:text-ink-100"
                }`}
              >
                Verify
              </button>
            </div>
            <p className="text-[10px] leading-relaxed text-ink-400">
              Solve runs DPLL (potentially exponential). Verify just plugs an assignment into m
              clauses — that's the O(m) certificate that makes 3-SAT lie in NP.
            </p>
          </div>

          <div className="p-5">
            <Link
              href="/pvsnp"
              className="hairline block w-full rounded-md border py-2 text-center font-mono text-[10px] uppercase tracking-widest2 text-ink-300 transition-colors hover:border-signal-rose/40 hover:text-signal-rose"
            >
              {u.back}
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}

function StatRow({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="flex justify-between gap-3 text-[11px]">
      <span className="text-[10px] uppercase tracking-widest2 text-ink-400">{label}</span>
      <span className={accent ?? "text-ink-100"}>{value}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Search-tree SVG renderer
// ---------------------------------------------------------------------------

function SearchTree({ state }: { state: SolverState }) {
  // Lay nodes out by (depth, sibling order within depth).
  const layout = useMemo(() => {
    const byDepth = new Map<number, TreeNode[]>();
    for (const n of state.tree) {
      const arr = byDepth.get(n.depth) ?? [];
      arr.push(n);
      byDepth.set(n.depth, arr);
    }
    const maxDepth = Math.max(...state.tree.map((n) => n.depth));
    const maxWidth = Math.max(...Array.from(byDepth.values()).map((a) => a.length));

    const W = Math.max(360, maxWidth * 36);
    const H = Math.max(180, (maxDepth + 1) * 60);

    const positions = new Map<number, { x: number; y: number }>();
    for (const [depth, nodes] of byDepth) {
      const sorted = [...nodes].sort((a, b) => a.id - b.id);
      for (let i = 0; i < sorted.length; i++) {
        const xFrac = (i + 1) / (sorted.length + 1);
        positions.set(sorted[i].id, {
          x: xFrac * W,
          y: 24 + depth * ((H - 24) / Math.max(1, maxDepth + 1)),
        });
      }
    }
    return { W, H, positions, maxDepth };
  }, [state.tree]);

  const { W, H, positions } = layout;

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minHeight: 240, maxHeight: 360 }}>
        {/* Edges */}
        {state.tree.map((node) => {
          if (node.parent === null) return null;
          const a = positions.get(node.parent);
          const b = positions.get(node.id);
          if (!a || !b) return null;
          return (
            <line
              key={`e-${node.id}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="rgba(138,144,164,0.45)"
              strokeWidth={1}
            />
          );
        })}
        {/* Nodes */}
        {state.tree.map((node) => {
          const p = positions.get(node.id);
          if (!p) return null;
          const isCurrent = node.id === state.currentNodeId;
          const fill =
            node.status === "sat"
              ? "#ffd166"
              : node.status === "conflict"
                ? "#ff7ab6"
                : node.status === "explored"
                  ? "rgba(138,144,164,0.35)"
                  : "#7df3ff";
          const stroke = isCurrent ? "#ffffff" : "rgba(255,255,255,0.25)";
          const r = isCurrent ? 8 : 5;
          return (
            <g key={`n-${node.id}`}>
              <circle
                cx={p.x}
                cy={p.y}
                r={r}
                fill={fill}
                stroke={stroke}
                strokeWidth={isCurrent ? 2 : 1}
              />
              {node.variable !== null && (
                <text
                  x={p.x + 8}
                  y={p.y - 4}
                  fontSize={9}
                  fontFamily="ui-monospace, monospace"
                  fill="#cfd2dc"
                >
                  x{node.variable}={node.value ? "T" : "F"}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <div className="mt-2 flex flex-wrap gap-3 font-mono text-[10px] text-ink-400">
        <Legend swatch="#7df3ff" label="open / unexplored" />
        <Legend swatch="rgba(138,144,164,0.7)" label="explored" />
        <Legend swatch="#ff7ab6" label="conflict" />
        <Legend swatch="#ffd166" label="SAT" />
      </div>
    </div>
  );
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: swatch }} />
      {label}
    </span>
  );
}
