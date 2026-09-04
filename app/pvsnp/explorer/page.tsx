"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import type { Locale } from "@/lib/i18n/types";
import { palette } from "@/lib/visual/palette";

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
  // Either a literal i18n string (when locale-agnostic, e.g. on init) or an
  // action descriptor that the render step interpolates into the active locale.
  lastAction: ActionDescriptor;
  finalAssign: Assignment | null;
}

// Locale-independent action descriptors emitted by `step` / `backtrack`. The
// component renders them via the active RichExplorer dict so the verdict /
// action line stays translated.
type ActionDescriptor =
  | { kind: "ready" }
  | { kind: "sat"; depth: number }
  | { kind: "conflict" }
  | { kind: "unit"; variable: number; value: boolean }
  | { kind: "pure"; variable: number; value: boolean }
  | { kind: "noVars" }
  | { kind: "branch"; variable: number; value: boolean; depth: number }
  | { kind: "backtrack"; variable: number; value: boolean; depth: number }
  | { kind: "unsat" };

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
    const value = a.get(v) ?? false;
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
      const value = a.get(v) ?? false;
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
// Preset instances — `id` is the stable lookup key into RichExplorer.presets.
// `numVars` and `formula` are locale-agnostic; only the label/description
// strings get translated downstream.
// ---------------------------------------------------------------------------

type PresetId = "trivial" | "unsat-all" | "phase" | "pigeon" | "verify";

interface Preset {
  id: PresetId;
  numVars: number;
  formula: Formula;
  verifyAssignment?: Assignment;
}

const PRESETS: Preset[] = [
  {
    id: "trivial",
    numVars: 3,
    formula: [
      [1, 2, 3],
      [-1, 2, -3],
    ],
  },
  {
    id: "unsat-all",
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
    lastAction: { kind: "ready" },
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
  let lastAction: ActionDescriptor = prev.lastAction;

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
      lastAction: { kind: "sat", depth: stack.length },
      finalAssign: assign,
      startedAt,
      elapsedMs: performance.now() - startedAt,
    };
  }

  // 2) If a clause is falsified → conflict → backtrack.
  if (verdictNow === "unsat") {
    tree[currentNodeId].status = "conflict";
    conflicts++;
    lastAction = { kind: "conflict" };
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
    lastAction = { kind: "unit", variable: v, value: val };
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
    lastAction = { kind: "pure", variable: v, value: val };
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
    lastAction = { kind: "noVars" };
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
  lastAction = { kind: "branch", variable: branchVar, value: firstValue, depth: stack.length };

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
  lastAction: ActionDescriptor,
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
        lastAction: {
          kind: "backtrack",
          variable: top.variable,
          value: newVal,
          depth: stack.length,
        },
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
  void lastAction; // intentionally dropped — the final UNSAT action overrides.
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
    lastAction: { kind: "unsat" },
    startedAt,
    elapsedMs: performance.now() - startedAt,
    finalAssign: null,
  };
}

// ---------------------------------------------------------------------------
// Per-locale strings for the explorer UI. Kept inline so the multi-locale
// prose lives next to the explorer it serves and doesn't fatten the shared
// i18n bundles.
// ---------------------------------------------------------------------------

type RichExplorer = {
  // header strips
  headerModeVerify: string;
  headerModeSolve: string;
  // clause display
  formulaTitle: string;
  // assignment row
  candidateAssignment: string;
  partialAssignment: string;
  toggleHint: string;
  // verdict panel
  verifierOutput: string;
  currentNode: string;
  verifierSatisfied: string;
  verifierFalsified: string;
  verifierIncomplete: string;
  verifierFootnote: string;
  verdictLabel: string;
  // search tree
  searchTreeTitle: (depth: number) => string;
  // sidebar — presets
  presetsTitle: string;
  presets: Record<
    PresetId,
    {
      label: string;
      description: string;
    }
  >;
  // sidebar — random generator
  randomTitle: string;
  varsLabel: (n: number) => string;
  clausesLabel: (m: number) => string;
  seedLabel: (s: number) => string;
  ratioLabel: (mn: string) => string;
  generateRandom: string;
  // sidebar — speed + controls
  speedLabel: (s: number) => string;
  btnStep: string;
  btnRun: string;
  btnPause: string;
  btnReset: string;
  // sidebar — stats
  solverStats: string;
  statElapsed: string;
  statBranches: string;
  statUnitProp: string;
  statPureLit: string;
  statConflicts: string;
  statDepth: string;
  statVerdict: string;
  foundPrefix: string;
  // mode toggle
  modeLabel: string;
  modeSolve: string;
  modeVerify: string;
  modeFootnote: string;
  // verdict / action line (rendered from ActionDescriptor)
  actionReady: string;
  actionSat: (depth: number) => string;
  actionConflict: string;
  actionUnit: (variable: number, value: boolean) => string;
  actionPure: (variable: number, value: boolean) => string;
  actionNoVars: string;
  actionBranch: (variable: number, value: boolean, depth: number) => string;
  actionBacktrack: (variable: number, value: boolean, depth: number) => string;
  actionUnsat: string;
  // search-tree legend
  legendOpen: string;
  legendExplored: string;
  legendConflict: string;
  legendSat: string;
};

// Tiny helper — "T"/"F" universal across locales.
const tf = (v: boolean) => (v ? "T" : "F");

const EXPLORER: Record<Locale, RichExplorer> = {
  en: {
    headerModeVerify: "Verify mode · O(m) check",
    headerModeSolve: "DPLL search · 3-SAT",
    formulaTitle: "Formula φ — conjunction of clauses",
    candidateAssignment: "Candidate assignment",
    partialAssignment: "Partial assignment",
    toggleHint: "Click variables to toggle T → F → unset.",
    verifierOutput: "Verifier output",
    currentNode: "Current node",
    verifierSatisfied: "✓ SATISFIED — every clause evaluates to true.",
    verifierFalsified: "✗ FALSIFIED — at least one clause is broken.",
    verifierIncomplete: "… incomplete — some variables unassigned.",
    verifierFootnote:
      "Verification scans the m clauses once and checks each in O(1). Total work: O(m) — independent of the search space. This is what puts the problem in NP.",
    verdictLabel: "verdict",
    searchTreeTitle: (depth) => `DPLL search tree · depth = ${depth}`,
    presetsTitle: "Preset 3-SAT instance",
    presets: {
      trivial: {
        label: "Trivially SAT",
        description: "3 vars, 2 clauses. The solver finds it on the first descent.",
      },
      "unsat-all": {
        label: "All 8 clauses on 3 vars — UNSAT",
        description: "Every clause of length 3 on {x1,x2,x3}. No assignment can satisfy them all.",
      },
      phase: {
        label: "Phase-transition · m/n ≈ 4.26",
        description: "Random 3-SAT at the critical clause/variable density. Hardest known regime.",
      },
      pigeon: {
        label: "Pigeonhole · 4 pigeons → 3 holes",
        description:
          "Encodes the pigeonhole principle. Famously requires exponential resolution proofs — DPLL will sweat.",
      },
      verify: {
        label: "Verify-only · a 4-var SAT instance with a candidate",
        description:
          "Don't search. Plug the candidate assignment in and read off — this is the O(m) verifier that makes the problem NP.",
      },
    },
    randomTitle: "Random 3-SAT",
    varsLabel: (n) => `Variables n = ${n}`,
    clausesLabel: (m) => `Clauses m = ${m}`,
    seedLabel: (s) => `Seed = ${s}`,
    ratioLabel: (mn) => `m / n = ${mn} · phase transition ≈ 4.26`,
    generateRandom: "Generate random",
    speedLabel: (s) => `Speed · ${s} steps/s`,
    btnStep: "Step",
    btnRun: "Run",
    btnPause: "Pause",
    btnReset: "Reset",
    solverStats: "Solver stats",
    statElapsed: "elapsed",
    statBranches: "branches",
    statUnitProp: "unit-prop",
    statPureLit: "pure-lit",
    statConflicts: "conflicts",
    statDepth: "depth",
    statVerdict: "verdict",
    foundPrefix: "Found:",
    modeLabel: "Mode",
    modeSolve: "Solve",
    modeVerify: "Verify",
    modeFootnote:
      "Solve runs DPLL (potentially exponential). Verify just plugs an assignment into m clauses — that's the O(m) certificate that makes 3-SAT lie in NP.",
    actionReady: "Ready.",
    actionSat: (depth) => `SAT — assignment found at depth ${depth}.`,
    actionConflict: "Conflict — backtracking.",
    actionUnit: (v, val) => `Unit propagate · x${v} := ${tf(val)}`,
    actionPure: (v, val) => `Pure literal · x${v} := ${tf(val)}`,
    actionNoVars: "No vars left, still unsatisfied → backtrack.",
    actionBranch: (v, val, d) => `Branch · x${v} := ${tf(val)}  (depth ${d})`,
    actionBacktrack: (v, val, d) => `Backtrack · x${v} := ${tf(val)}  (depth ${d})`,
    actionUnsat: "UNSAT — search tree exhausted.",
    legendOpen: "open / unexplored",
    legendExplored: "explored",
    legendConflict: "conflict",
    legendSat: "SAT",
  },
  de: {
    headerModeVerify: "Verifizier-Modus · O(m)-Prüfung",
    headerModeSolve: "DPLL-Suche · 3-SAT",
    formulaTitle: "Formel φ — Konjunktion von Klauseln",
    candidateAssignment: "Kandidaten-Belegung",
    partialAssignment: "Partielle Belegung",
    toggleHint: "Klicke Variablen, um T → F → unbelegt zu schalten.",
    verifierOutput: "Verifizier-Ausgabe",
    currentNode: "Aktueller Knoten",
    verifierSatisfied: "✓ ERFÜLLT — jede Klausel ist wahr.",
    verifierFalsified: "✗ FALSIFIZIERT — mindestens eine Klausel ist verletzt.",
    verifierIncomplete: "… unvollständig — einige Variablen sind unbelegt.",
    verifierFootnote:
      "Die Verifikation läuft einmal über die m Klauseln und prüft jede in O(1). Gesamtaufwand: O(m) — unabhängig vom Suchraum. Genau das setzt das Problem in NP.",
    verdictLabel: "Urteil",
    searchTreeTitle: (depth) => `DPLL-Suchbaum · Tiefe = ${depth}`,
    presetsTitle: "Voreingestellte 3-SAT-Instanz",
    presets: {
      trivial: {
        label: "Trivial erfüllbar",
        description: "3 Variablen, 2 Klauseln. Der Solver findet sie beim ersten Abstieg.",
      },
      "unsat-all": {
        label: "Alle 8 Klauseln auf 3 Variablen — UNSAT",
        description:
          "Jede Klausel der Länge 3 auf {x1,x2,x3}. Keine Belegung kann sie alle erfüllen.",
      },
      phase: {
        label: "Phasenübergang · m/n ≈ 4.26",
        description:
          "Zufälliges 3-SAT bei kritischer Klausel-/Variablendichte. Härtestes bekanntes Regime.",
      },
      pigeon: {
        label: "Schubfach · 4 Tauben → 3 Löcher",
        description:
          "Kodiert das Schubfachprinzip. Berühmt für exponentielle Resolutionsbeweise — DPLL wird schwitzen.",
      },
      verify: {
        label: "Nur verifizieren · 4-Variablen-SAT-Instanz mit Kandidat",
        description:
          "Nicht suchen. Setze die Kandidaten-Belegung ein und lies ab — das ist der O(m)-Verifizierer, der das Problem in NP packt.",
      },
    },
    randomTitle: "Zufälliges 3-SAT",
    varsLabel: (n) => `Variablen n = ${n}`,
    clausesLabel: (m) => `Klauseln m = ${m}`,
    seedLabel: (s) => `Seed = ${s}`,
    ratioLabel: (mn) => `m / n = ${mn} · Phasenübergang ≈ 4.26`,
    generateRandom: "Zufällig erzeugen",
    speedLabel: (s) => `Geschwindigkeit · ${s} Schritte/s`,
    btnStep: "Schritt",
    btnRun: "Lauf",
    btnPause: "Pause",
    btnReset: "Zurücksetzen",
    solverStats: "Solver-Statistik",
    statElapsed: "Dauer",
    statBranches: "Verzweigungen",
    statUnitProp: "Unit-Prop",
    statPureLit: "Pure-Lit",
    statConflicts: "Konflikte",
    statDepth: "Tiefe",
    statVerdict: "Urteil",
    foundPrefix: "Gefunden:",
    modeLabel: "Modus",
    modeSolve: "Lösen",
    modeVerify: "Verifizieren",
    modeFootnote:
      "«Lösen» fährt DPLL (potenziell exponentiell). «Verifizieren» steckt nur eine Belegung in m Klauseln — das ist das O(m)-Zertifikat, das 3-SAT in NP legt.",
    actionReady: "Bereit.",
    actionSat: (depth) => `SAT — Belegung gefunden bei Tiefe ${depth}.`,
    actionConflict: "Konflikt — Backtracking.",
    actionUnit: (v, val) => `Unit-Propagation · x${v} := ${tf(val)}`,
    actionPure: (v, val) => `Reines Literal · x${v} := ${tf(val)}`,
    actionNoVars: "Keine Variablen mehr, noch unerfüllt → Backtrack.",
    actionBranch: (v, val, d) => `Verzweigung · x${v} := ${tf(val)}  (Tiefe ${d})`,
    actionBacktrack: (v, val, d) => `Backtrack · x${v} := ${tf(val)}  (Tiefe ${d})`,
    actionUnsat: "UNSAT — Suchbaum erschöpft.",
    legendOpen: "offen / unerforscht",
    legendExplored: "erforscht",
    legendConflict: "Konflikt",
    legendSat: "SAT",
  },
  es: {
    headerModeVerify: "Modo verificación · comprobación O(m)",
    headerModeSolve: "Búsqueda DPLL · 3-SAT",
    formulaTitle: "Fórmula φ — conjunción de cláusulas",
    candidateAssignment: "Asignación candidata",
    partialAssignment: "Asignación parcial",
    toggleHint: "Pulsa las variables para alternar T → F → sin asignar.",
    verifierOutput: "Salida del verificador",
    currentNode: "Nodo actual",
    verifierSatisfied: "✓ SATISFECHA — toda cláusula es verdadera.",
    verifierFalsified: "✗ FALSIFICADA — al menos una cláusula falla.",
    verifierIncomplete: "… incompleta — algunas variables sin asignar.",
    verifierFootnote:
      "La verificación recorre las m cláusulas una vez y comprueba cada una en O(1). Trabajo total: O(m) — independiente del espacio de búsqueda. Esto es lo que pone el problema en NP.",
    verdictLabel: "veredicto",
    searchTreeTitle: (depth) => `Árbol de búsqueda DPLL · profundidad = ${depth}`,
    presetsTitle: "Instancia 3-SAT prefijada",
    presets: {
      trivial: {
        label: "Trivialmente SAT",
        description: "3 variables, 2 cláusulas. El solver la encuentra en el primer descenso.",
      },
      "unsat-all": {
        label: "Las 8 cláusulas sobre 3 variables — UNSAT",
        description:
          "Toda cláusula de longitud 3 sobre {x1,x2,x3}. Ninguna asignación las satisface a todas.",
      },
      phase: {
        label: "Transición de fase · m/n ≈ 4.26",
        description:
          "3-SAT aleatorio a la densidad crítica cláusulas/variables. El régimen más duro conocido.",
      },
      pigeon: {
        label: "Palomar · 4 palomas → 3 huecos",
        description:
          "Codifica el principio del palomar. Famoso por requerir pruebas de resolución exponenciales — DPLL sudará.",
      },
      verify: {
        label: "Sólo verificar · instancia SAT de 4 variables con candidato",
        description:
          "Sin buscar. Mete la asignación candidata y lee — éste es el verificador O(m) que mete el problema en NP.",
      },
    },
    randomTitle: "3-SAT aleatorio",
    varsLabel: (n) => `Variables n = ${n}`,
    clausesLabel: (m) => `Cláusulas m = ${m}`,
    seedLabel: (s) => `Semilla = ${s}`,
    ratioLabel: (mn) => `m / n = ${mn} · transición de fase ≈ 4.26`,
    generateRandom: "Generar aleatorio",
    speedLabel: (s) => `Velocidad · ${s} pasos/s`,
    btnStep: "Paso",
    btnRun: "Ejecutar",
    btnPause: "Pausa",
    btnReset: "Reiniciar",
    solverStats: "Estadísticas del solver",
    statElapsed: "tiempo",
    statBranches: "ramas",
    statUnitProp: "unit-prop",
    statPureLit: "lit-puro",
    statConflicts: "conflictos",
    statDepth: "profundidad",
    statVerdict: "veredicto",
    foundPrefix: "Encontrado:",
    modeLabel: "Modo",
    modeSolve: "Resolver",
    modeVerify: "Verificar",
    modeFootnote:
      "«Resolver» lanza DPLL (potencialmente exponencial). «Verificar» sólo mete una asignación en m cláusulas — ése es el certificado O(m) que mete a 3-SAT en NP.",
    actionReady: "Listo.",
    actionSat: (depth) => `SAT — asignación hallada a profundidad ${depth}.`,
    actionConflict: "Conflicto — retrocediendo.",
    actionUnit: (v, val) => `Propagación unitaria · x${v} := ${tf(val)}`,
    actionPure: (v, val) => `Literal puro · x${v} := ${tf(val)}`,
    actionNoVars: "No quedan variables y sigue insatisfecha → retroceder.",
    actionBranch: (v, val, d) => `Rama · x${v} := ${tf(val)}  (profundidad ${d})`,
    actionBacktrack: (v, val, d) => `Retroceso · x${v} := ${tf(val)}  (profundidad ${d})`,
    actionUnsat: "UNSAT — árbol de búsqueda agotado.",
    legendOpen: "abierto / sin explorar",
    legendExplored: "explorado",
    legendConflict: "conflicto",
    legendSat: "SAT",
  },
  fr: {
    headerModeVerify: "Mode vérification · contrôle O(m)",
    headerModeSolve: "Recherche DPLL · 3-SAT",
    formulaTitle: "Formule φ — conjonction de clauses",
    candidateAssignment: "Affectation candidate",
    partialAssignment: "Affectation partielle",
    toggleHint: "Cliquez les variables pour basculer T → F → non assigné.",
    verifierOutput: "Sortie du vérificateur",
    currentNode: "Nœud actuel",
    verifierSatisfied: "✓ SATISFAITE — chaque clause est vraie.",
    verifierFalsified: "✗ FALSIFIÉE — au moins une clause est cassée.",
    verifierIncomplete: "… incomplète — certaines variables non assignées.",
    verifierFootnote:
      "La vérification parcourt les m clauses une fois et contrôle chacune en O(1). Travail total : O(m) — indépendant de l'espace de recherche. C'est ce qui place le problème dans NP.",
    verdictLabel: "verdict",
    searchTreeTitle: (depth) => `Arbre de recherche DPLL · profondeur = ${depth}`,
    presetsTitle: "Instance 3-SAT prédéfinie",
    presets: {
      trivial: {
        label: "Trivialement SAT",
        description: "3 variables, 2 clauses. Le solveur la trouve dès la première descente.",
      },
      "unsat-all": {
        label: "Les 8 clauses sur 3 variables — UNSAT",
        description:
          "Toute clause de longueur 3 sur {x1,x2,x3}. Aucune affectation ne peut toutes les satisfaire.",
      },
      phase: {
        label: "Transition de phase · m/n ≈ 4.26",
        description:
          "3-SAT aléatoire à la densité critique clauses/variables. Le régime le plus difficile connu.",
      },
      pigeon: {
        label: "Tiroirs · 4 pigeons → 3 trous",
        description:
          "Code le principe des tiroirs. Connu pour exiger des preuves de résolution exponentielles — DPLL va transpirer.",
      },
      verify: {
        label: "Vérification seule · instance SAT à 4 variables avec candidat",
        description:
          "Pas de recherche. Branchez l'affectation candidate et lisez — c'est le vérificateur O(m) qui place le problème dans NP.",
      },
    },
    randomTitle: "3-SAT aléatoire",
    varsLabel: (n) => `Variables n = ${n}`,
    clausesLabel: (m) => `Clauses m = ${m}`,
    seedLabel: (s) => `Graine = ${s}`,
    ratioLabel: (mn) => `m / n = ${mn} · transition de phase ≈ 4.26`,
    generateRandom: "Générer aléatoirement",
    speedLabel: (s) => `Vitesse · ${s} pas/s`,
    btnStep: "Pas",
    btnRun: "Lancer",
    btnPause: "Pause",
    btnReset: "Réinitialiser",
    solverStats: "Stats du solveur",
    statElapsed: "écoulé",
    statBranches: "branches",
    statUnitProp: "unit-prop",
    statPureLit: "lit-pur",
    statConflicts: "conflits",
    statDepth: "profondeur",
    statVerdict: "verdict",
    foundPrefix: "Trouvé :",
    modeLabel: "Mode",
    modeSolve: "Résoudre",
    modeVerify: "Vérifier",
    modeFootnote:
      "« Résoudre » lance DPLL (potentiellement exponentiel). « Vérifier » branche juste une affectation dans m clauses — c'est le certificat O(m) qui place 3-SAT dans NP.",
    actionReady: "Prêt.",
    actionSat: (depth) => `SAT — affectation trouvée à la profondeur ${depth}.`,
    actionConflict: "Conflit — retour arrière.",
    actionUnit: (v, val) => `Propagation unitaire · x${v} := ${tf(val)}`,
    actionPure: (v, val) => `Littéral pur · x${v} := ${tf(val)}`,
    actionNoVars: "Plus de variables, toujours non satisfaite → retour arrière.",
    actionBranch: (v, val, d) => `Branche · x${v} := ${tf(val)}  (profondeur ${d})`,
    actionBacktrack: (v, val, d) => `Retour · x${v} := ${tf(val)}  (profondeur ${d})`,
    actionUnsat: "UNSAT — arbre de recherche épuisé.",
    legendOpen: "ouvert / inexploré",
    legendExplored: "exploré",
    legendConflict: "conflit",
    legendSat: "SAT",
  },
  it: {
    headerModeVerify: "Modalità verifica · controllo O(m)",
    headerModeSolve: "Ricerca DPLL · 3-SAT",
    formulaTitle: "Formula φ — congiunzione di clausole",
    candidateAssignment: "Assegnazione candidata",
    partialAssignment: "Assegnazione parziale",
    toggleHint: "Clicca le variabili per alternare T → F → non assegnata.",
    verifierOutput: "Output del verificatore",
    currentNode: "Nodo corrente",
    verifierSatisfied: "✓ SODDISFATTA — ogni clausola è vera.",
    verifierFalsified: "✗ FALSIFICATA — almeno una clausola è infranta.",
    verifierIncomplete: "… incompleta — alcune variabili non assegnate.",
    verifierFootnote:
      "La verifica scorre le m clausole una volta e controlla ciascuna in O(1). Lavoro totale: O(m) — indipendente dallo spazio di ricerca. È ciò che pone il problema in NP.",
    verdictLabel: "verdetto",
    searchTreeTitle: (depth) => `Albero di ricerca DPLL · profondità = ${depth}`,
    presetsTitle: "Istanza 3-SAT preimpostata",
    presets: {
      trivial: {
        label: "Banalmente SAT",
        description: "3 variabili, 2 clausole. Il solver la trova alla prima discesa.",
      },
      "unsat-all": {
        label: "Tutte le 8 clausole su 3 variabili — UNSAT",
        description:
          "Ogni clausola di lunghezza 3 su {x1,x2,x3}. Nessuna assegnazione le soddisfa tutte.",
      },
      phase: {
        label: "Transizione di fase · m/n ≈ 4.26",
        description:
          "3-SAT casuale alla densità critica clausole/variabili. Il regime più difficile noto.",
      },
      pigeon: {
        label: "Cassetti · 4 piccioni → 3 buchi",
        description:
          "Codifica il principio dei cassetti. Notoriamente richiede dimostrazioni di risoluzione esponenziali — DPLL suderà.",
      },
      verify: {
        label: "Solo verifica · istanza SAT a 4 variabili con candidato",
        description:
          "Niente ricerca. Inserisci l'assegnazione candidata e leggi — è il verificatore O(m) che mette il problema in NP.",
      },
    },
    randomTitle: "3-SAT casuale",
    varsLabel: (n) => `Variabili n = ${n}`,
    clausesLabel: (m) => `Clausole m = ${m}`,
    seedLabel: (s) => `Seed = ${s}`,
    ratioLabel: (mn) => `m / n = ${mn} · transizione di fase ≈ 4.26`,
    generateRandom: "Genera casuale",
    speedLabel: (s) => `Velocità · ${s} passi/s`,
    btnStep: "Passo",
    btnRun: "Avvia",
    btnPause: "Pausa",
    btnReset: "Reset",
    solverStats: "Statistiche del solver",
    statElapsed: "trascorso",
    statBranches: "rami",
    statUnitProp: "unit-prop",
    statPureLit: "lit-puro",
    statConflicts: "conflitti",
    statDepth: "profondità",
    statVerdict: "verdetto",
    foundPrefix: "Trovato:",
    modeLabel: "Modalità",
    modeSolve: "Risolvi",
    modeVerify: "Verifica",
    modeFootnote:
      "«Risolvi» avvia DPLL (potenzialmente esponenziale). «Verifica» inserisce solo un'assegnazione in m clausole — è il certificato O(m) che pone 3-SAT in NP.",
    actionReady: "Pronto.",
    actionSat: (depth) => `SAT — assegnazione trovata a profondità ${depth}.`,
    actionConflict: "Conflitto — backtracking.",
    actionUnit: (v, val) => `Propagazione unitaria · x${v} := ${tf(val)}`,
    actionPure: (v, val) => `Letterale puro · x${v} := ${tf(val)}`,
    actionNoVars: "Niente più variabili, ancora insoddisfatta → backtrack.",
    actionBranch: (v, val, d) => `Ramo · x${v} := ${tf(val)}  (profondità ${d})`,
    actionBacktrack: (v, val, d) => `Backtrack · x${v} := ${tf(val)}  (profondità ${d})`,
    actionUnsat: "UNSAT — albero di ricerca esaurito.",
    legendOpen: "aperto / inesplorato",
    legendExplored: "esplorato",
    legendConflict: "conflitto",
    legendSat: "SAT",
  },
  pt: {
    headerModeVerify: "Modo verificação · verificação O(m)",
    headerModeSolve: "Busca DPLL · 3-SAT",
    formulaTitle: "Fórmula φ — conjunção de cláusulas",
    candidateAssignment: "Atribuição candidata",
    partialAssignment: "Atribuição parcial",
    toggleHint: "Clique nas variáveis para alternar T → F → não atribuída.",
    verifierOutput: "Saída do verificador",
    currentNode: "Nó actual",
    verifierSatisfied: "✓ SATISFEITA — toda cláusula é verdadeira.",
    verifierFalsified: "✗ FALSIFICADA — pelo menos uma cláusula falha.",
    verifierIncomplete: "… incompleta — algumas variáveis sem atribuição.",
    verifierFootnote:
      "A verificação percorre as m cláusulas uma vez e verifica cada uma em O(1). Trabalho total: O(m) — independente do espaço de busca. É isso que põe o problema em NP.",
    verdictLabel: "veredicto",
    searchTreeTitle: (depth) => `Árvore de busca DPLL · profundidade = ${depth}`,
    presetsTitle: "Instância 3-SAT predefinida",
    presets: {
      trivial: {
        label: "Trivialmente SAT",
        description: "3 variáveis, 2 cláusulas. O solver encontra-a na primeira descida.",
      },
      "unsat-all": {
        label: "Todas as 8 cláusulas sobre 3 variáveis — UNSAT",
        description:
          "Toda cláusula de comprimento 3 sobre {x1,x2,x3}. Nenhuma atribuição as satisfaz todas.",
      },
      phase: {
        label: "Transição de fase · m/n ≈ 4.26",
        description:
          "3-SAT aleatório à densidade crítica cláusulas/variáveis. O regime mais difícil conhecido.",
      },
      pigeon: {
        label: "Casas dos pombos · 4 pombos → 3 casas",
        description:
          "Codifica o princípio das casas dos pombos. Famoso por exigir provas de resolução exponenciais — DPLL vai suar.",
      },
      verify: {
        label: "Só verificar · instância SAT de 4 variáveis com candidato",
        description:
          "Sem buscar. Mete a atribuição candidata e lê — é o verificador O(m) que põe o problema em NP.",
      },
    },
    randomTitle: "3-SAT aleatório",
    varsLabel: (n) => `Variáveis n = ${n}`,
    clausesLabel: (m) => `Cláusulas m = ${m}`,
    seedLabel: (s) => `Semente = ${s}`,
    ratioLabel: (mn) => `m / n = ${mn} · transição de fase ≈ 4.26`,
    generateRandom: "Gerar aleatório",
    speedLabel: (s) => `Velocidade · ${s} passos/s`,
    btnStep: "Passo",
    btnRun: "Executar",
    btnPause: "Pausa",
    btnReset: "Reiniciar",
    solverStats: "Estatísticas do solver",
    statElapsed: "decorrido",
    statBranches: "ramos",
    statUnitProp: "unit-prop",
    statPureLit: "lit-puro",
    statConflicts: "conflitos",
    statDepth: "profundidade",
    statVerdict: "veredicto",
    foundPrefix: "Encontrado:",
    modeLabel: "Modo",
    modeSolve: "Resolver",
    modeVerify: "Verificar",
    modeFootnote:
      "«Resolver» lança DPLL (potencialmente exponencial). «Verificar» mete apenas uma atribuição em m cláusulas — é o certificado O(m) que põe 3-SAT em NP.",
    actionReady: "Pronto.",
    actionSat: (depth) => `SAT — atribuição encontrada à profundidade ${depth}.`,
    actionConflict: "Conflito — retrocedendo.",
    actionUnit: (v, val) => `Propagação unitária · x${v} := ${tf(val)}`,
    actionPure: (v, val) => `Literal puro · x${v} := ${tf(val)}`,
    actionNoVars: "Sem variáveis, ainda insatisfeita → retroceder.",
    actionBranch: (v, val, d) => `Ramo · x${v} := ${tf(val)}  (profundidade ${d})`,
    actionBacktrack: (v, val, d) => `Retrocesso · x${v} := ${tf(val)}  (profundidade ${d})`,
    actionUnsat: "UNSAT — árvore de busca esgotada.",
    legendOpen: "aberto / inexplorado",
    legendExplored: "explorado",
    legendConflict: "conflito",
    legendSat: "SAT",
  },
  sv: {
    headerModeVerify: "Verifieringsläge · O(m)-kontroll",
    headerModeSolve: "DPLL-sökning · 3-SAT",
    formulaTitle: "Formel φ — konjunktion av klausuler",
    candidateAssignment: "Kandidattilldelning",
    partialAssignment: "Partiell tilldelning",
    toggleHint: "Klicka på variabler för att växla T → F → otilldelad.",
    verifierOutput: "Verifierarens utdata",
    currentNode: "Aktuell nod",
    verifierSatisfied: "✓ UPPFYLLD — varje klausul är sann.",
    verifierFalsified: "✗ FALSIFIERAD — minst en klausul är trasig.",
    verifierIncomplete: "… ofullständig — vissa variabler är otilldelade.",
    verifierFootnote:
      "Verifieringen sveper de m klausulerna en gång och kollar var och en i O(1). Totalt arbete: O(m) — oberoende av sökrymden. Det är detta som placerar problemet i NP.",
    verdictLabel: "utslag",
    searchTreeTitle: (depth) => `DPLL-sökträd · djup = ${depth}`,
    presetsTitle: "Förvald 3-SAT-instans",
    presets: {
      trivial: {
        label: "Trivialt SAT",
        description: "3 variabler, 2 klausuler. Lösaren hittar den vid första nedstigning.",
      },
      "unsat-all": {
        label: "Alla 8 klausuler på 3 variabler — UNSAT",
        description:
          "Varje klausul av längd 3 på {x1,x2,x3}. Ingen tilldelning kan uppfylla dem alla.",
      },
      phase: {
        label: "Fasövergång · m/n ≈ 4.26",
        description:
          "Slumpmässig 3-SAT vid kritisk klausul/variabel-täthet. Det svåraste kända regimet.",
      },
      pigeon: {
        label: "Lådprincip · 4 duvor → 3 hål",
        description:
          "Kodar lådprincipen. Berömt för att kräva exponentiella resolutionsbevis — DPLL får svettas.",
      },
      verify: {
        label: "Endast verifiera · 4-variabel-SAT-instans med kandidat",
        description:
          "Ingen sökning. Stoppa in kandidattilldelningen och läs av — detta är O(m)-verifieraren som placerar problemet i NP.",
      },
    },
    randomTitle: "Slumpmässig 3-SAT",
    varsLabel: (n) => `Variabler n = ${n}`,
    clausesLabel: (m) => `Klausuler m = ${m}`,
    seedLabel: (s) => `Frö = ${s}`,
    ratioLabel: (mn) => `m / n = ${mn} · fasövergång ≈ 4.26`,
    generateRandom: "Generera slumpmässig",
    speedLabel: (s) => `Hastighet · ${s} steg/s`,
    btnStep: "Steg",
    btnRun: "Kör",
    btnPause: "Paus",
    btnReset: "Återställ",
    solverStats: "Lösarstatistik",
    statElapsed: "förflutet",
    statBranches: "grenar",
    statUnitProp: "unit-prop",
    statPureLit: "ren-lit",
    statConflicts: "konflikter",
    statDepth: "djup",
    statVerdict: "utslag",
    foundPrefix: "Hittad:",
    modeLabel: "Läge",
    modeSolve: "Lös",
    modeVerify: "Verifiera",
    modeFootnote:
      "«Lös» kör DPLL (potentiellt exponentiell). «Verifiera» stoppar bara in en tilldelning i m klausuler — det är O(m)-certifikatet som placerar 3-SAT i NP.",
    actionReady: "Klar.",
    actionSat: (depth) => `SAT — tilldelning funnen på djup ${depth}.`,
    actionConflict: "Konflikt — backtrackar.",
    actionUnit: (v, val) => `Unit-propagering · x${v} := ${tf(val)}`,
    actionPure: (v, val) => `Rent literal · x${v} := ${tf(val)}`,
    actionNoVars: "Inga variabler kvar, fortfarande ouppfylld → backtrack.",
    actionBranch: (v, val, d) => `Gren · x${v} := ${tf(val)}  (djup ${d})`,
    actionBacktrack: (v, val, d) => `Backtrack · x${v} := ${tf(val)}  (djup ${d})`,
    actionUnsat: "UNSAT — sökträdet uttömt.",
    legendOpen: "öppen / outforskad",
    legendExplored: "utforskad",
    legendConflict: "konflikt",
    legendSat: "SAT",
  },
  no: {
    headerModeVerify: "Verifiseringsmodus · O(m)-sjekk",
    headerModeSolve: "DPLL-søk · 3-SAT",
    formulaTitle: "Formel φ — konjunksjon av klausuler",
    candidateAssignment: "Kandidat-tilordning",
    partialAssignment: "Delvis tilordning",
    toggleHint: "Klikk på variabler for å veksle T → F → uten verdi.",
    verifierOutput: "Verifiserer-utdata",
    currentNode: "Gjeldende node",
    verifierSatisfied: "✓ OPPFYLT — hver klausul er sann.",
    verifierFalsified: "✗ FALSIFISERT — minst én klausul er brutt.",
    verifierIncomplete: "… ufullstendig — noen variabler er uten verdi.",
    verifierFootnote:
      "Verifiseringen går gjennom de m klausulene én gang og sjekker hver i O(1). Totalarbeid: O(m) — uavhengig av søkerommet. Det er det som plasserer problemet i NP.",
    verdictLabel: "dom",
    searchTreeTitle: (depth) => `DPLL-søketre · dybde = ${depth}`,
    presetsTitle: "Forhåndsdefinert 3-SAT-instans",
    presets: {
      trivial: {
        label: "Trivielt SAT",
        description: "3 variabler, 2 klausuler. Løseren finner den ved første nedstigning.",
      },
      "unsat-all": {
        label: "Alle 8 klausuler på 3 variabler — UNSAT",
        description:
          "Hver klausul av lengde 3 på {x1,x2,x3}. Ingen tilordning kan oppfylle dem alle.",
      },
      phase: {
        label: "Faseovergang · m/n ≈ 4.26",
        description:
          "Tilfeldig 3-SAT ved kritisk klausul/variabel-tetthet. Det vanskeligste kjente regimet.",
      },
      pigeon: {
        label: "Skuffeprinsipp · 4 duer → 3 hull",
        description:
          "Koder skuffeprinsippet. Berømt for å kreve eksponentielle resolusjonsbevis — DPLL vil svette.",
      },
      verify: {
        label: "Kun verifiser · 4-variabel-SAT-instans med kandidat",
        description:
          "Ingen søking. Putt inn kandidat-tilordningen og les av — dette er O(m)-verifisereren som plasserer problemet i NP.",
      },
    },
    randomTitle: "Tilfeldig 3-SAT",
    varsLabel: (n) => `Variabler n = ${n}`,
    clausesLabel: (m) => `Klausuler m = ${m}`,
    seedLabel: (s) => `Frø = ${s}`,
    ratioLabel: (mn) => `m / n = ${mn} · faseovergang ≈ 4.26`,
    generateRandom: "Generer tilfeldig",
    speedLabel: (s) => `Fart · ${s} steg/s`,
    btnStep: "Steg",
    btnRun: "Kjør",
    btnPause: "Pause",
    btnReset: "Tilbakestill",
    solverStats: "Løser-statistikk",
    statElapsed: "forløpt",
    statBranches: "grener",
    statUnitProp: "unit-prop",
    statPureLit: "ren-lit",
    statConflicts: "konflikter",
    statDepth: "dybde",
    statVerdict: "dom",
    foundPrefix: "Funnet:",
    modeLabel: "Modus",
    modeSolve: "Løs",
    modeVerify: "Verifiser",
    modeFootnote:
      "«Løs» kjører DPLL (potensielt eksponentielt). «Verifiser» setter bare inn en tilordning i m klausuler — det er O(m)-sertifikatet som plasserer 3-SAT i NP.",
    actionReady: "Klar.",
    actionSat: (depth) => `SAT — tilordning funnet på dybde ${depth}.`,
    actionConflict: "Konflikt — backtracker.",
    actionUnit: (v, val) => `Unit-propagering · x${v} := ${tf(val)}`,
    actionPure: (v, val) => `Rent literal · x${v} := ${tf(val)}`,
    actionNoVars: "Ingen variabler igjen, fortsatt uoppfylt → backtrack.",
    actionBranch: (v, val, d) => `Gren · x${v} := ${tf(val)}  (dybde ${d})`,
    actionBacktrack: (v, val, d) => `Backtrack · x${v} := ${tf(val)}  (dybde ${d})`,
    actionUnsat: "UNSAT — søketreet uttømt.",
    legendOpen: "åpen / uutforsket",
    legendExplored: "utforsket",
    legendConflict: "konflikt",
    legendSat: "SAT",
  },
};

// Render an action descriptor through the active dict.
function renderAction(dict: RichExplorer, a: ActionDescriptor): string {
  switch (a.kind) {
    case "ready":
      return dict.actionReady;
    case "sat":
      return dict.actionSat(a.depth);
    case "conflict":
      return dict.actionConflict;
    case "unit":
      return dict.actionUnit(a.variable, a.value);
    case "pure":
      return dict.actionPure(a.variable, a.value);
    case "noVars":
      return dict.actionNoVars;
    case "branch":
      return dict.actionBranch(a.variable, a.value, a.depth);
    case "backtrack":
      return dict.actionBacktrack(a.variable, a.value, a.depth);
    case "unsat":
      return dict.actionUnsat;
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

// UI defaults / limits — surfaced as consts so they're easy to tune.
const DEFAULT_SPEED = 8; // steps per second
const MIN_INTERVAL_MS = 15; // floor on the setInterval period
const DEFAULT_N = 5; // random-generator variable count default
const DEFAULT_M = 20; // random-generator clause count default
const DEFAULT_SEED = 1;
const MAX_N = 12;
const MAX_M = 50;
const MAX_SEED = 999;
const MAX_SPEED = 60;

type Mode = "solve" | "verify";

export default function PvsNPExplorer() {
  const { a, u, locale } = useI18n();
  const topic = a.topics.pvsnp;
  const dict = EXPLORER[locale];

  const [mode, setMode] = useState<Mode>("solve");
  const [presetId, setPresetId] = useState<string>("trivial");
  const [n, setN] = useState(DEFAULT_N);
  const [m, setM] = useState(DEFAULT_M);
  const [seed, setSeed] = useState(DEFAULT_SEED);
  const [speed, setSpeed] = useState(DEFAULT_SPEED);
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
    const interval = Math.max(MIN_INTERVAL_MS, 1000 / Math.max(1, speed));
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
              {mode === "verify" ? dict.headerModeVerify : dict.headerModeSolve}
            </div>
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
              n = {activeVars} · m = {formulaToShow.length}
            </div>
          </div>

          {/* Clause display */}
          <div className="hairline rounded-2xl border bg-ink-950/60 p-4 md:p-5">
            <div className="mb-3 font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {dict.formulaTitle}
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
                        ? "text-signal-cyan border-signal-cyan/60 bg-signal-cyan/10"
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
                        const value = has ? (liveAssign.get(v) ?? false) : null;
                        const litTrue = has ? (lit > 0 ? value : !value) : null;
                        const litColor =
                          litTrue === true
                            ? "text-signal-amber"
                            : litTrue === false
                              ? "text-signal-cyan/80 line-through"
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
              {mode === "verify" ? dict.candidateAssignment : dict.partialAssignment}
            </div>
            <div className="flex flex-wrap gap-2 font-mono text-sm">
              {Array.from({ length: activeVars }, (_, i) => i + 1).map((v) => {
                const has = liveAssign.has(v);
                const value = has ? liveAssign.get(v)! : null;
                const tone = !has
                  ? "border-ink-700/60 bg-ink-950/40 text-ink-300"
                  : value
                    ? "border-signal-amber/50 bg-signal-amber/10 text-signal-amber"
                    : "border-signal-cyan/50 bg-signal-cyan/10 text-signal-cyan";
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
              <div className="mt-3 font-mono text-[11px] text-ink-400">{dict.toggleHint}</div>
            )}
          </div>

          {/* Verdict panel */}
          <div className="hairline rounded-2xl border bg-ink-950/60 p-4 md:p-5">
            <div className="mb-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {mode === "verify" ? dict.verifierOutput : dict.currentNode}
            </div>
            {mode === "verify" ? (
              <div className="space-y-2">
                <div
                  className={`font-mono text-lg ${
                    verifyResult.overall === "sat"
                      ? "text-signal-amber"
                      : verifyResult.overall === "unsat"
                        ? "text-signal-cyan"
                        : "text-ink-200"
                  }`}
                >
                  {verifyResult.overall === "sat"
                    ? dict.verifierSatisfied
                    : verifyResult.overall === "unsat"
                      ? dict.verifierFalsified
                      : dict.verifierIncomplete}
                </div>
                <div className="text-xs leading-relaxed text-ink-300">{dict.verifierFootnote}</div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="font-mono text-sm text-ink-100">
                  {renderAction(dict, state.lastAction)}
                </div>
                <div className="font-mono text-xs text-ink-400">
                  {dict.verdictLabel} ={" "}
                  <span
                    className={
                      state.verdict === "sat"
                        ? "text-signal-amber"
                        : state.verdict === "unsat"
                          ? "text-signal-cyan"
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
                {dict.searchTreeTitle(state.stack.length)}
              </div>
              <SearchTree state={state} dict={dict} />
            </div>
          )}
        </div>

        {/* SIDEBAR */}
        <aside className="hairline scrollbar-thin flex flex-col overflow-y-auto border-l bg-ink-900/40">
          {/* Topic header */}
          <div className="hairline space-y-3 border-b p-6">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
              {topic.title}
            </div>
            <h1 className="math-italic text-3xl leading-tight text-ink-100">{topic.tagline}</h1>
            <p className="text-sm leading-relaxed text-ink-200">{topic.body}</p>
          </div>

          {/* Preset picker */}
          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {dict.presetsTitle}
            </div>
            <div className="space-y-2">
              {PRESETS.map((p) => {
                const txt = dict.presets[p.id];
                return (
                  <button
                    key={p.id}
                    onClick={() => loadPreset(p)}
                    className={`w-full rounded-md border px-3 py-2 text-left transition-colors ${
                      presetId === p.id
                        ? "border-signal-cyan/60 bg-signal-cyan/10 text-signal-cyan"
                        : "hairline text-ink-200 hover:border-signal-cyan/40 hover:text-ink-100"
                    }`}
                  >
                    <div className="font-mono text-xs">{txt.label}</div>
                    <div className="mt-0.5 font-mono text-[10px] leading-snug text-ink-400">
                      {txt.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Random generator */}
          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {dict.randomTitle}
            </div>
            <div className="font-mono text-[10px] text-ink-300">{dict.varsLabel(n)}</div>
            <input
              type="range"
              value={n}
              min={3}
              max={MAX_N}
              step={1}
              onChange={(e) => setN(parseInt(e.target.value))}
              className="w-full accent-signal-cyan"
            />
            <div className="font-mono text-[10px] text-ink-300">{dict.clausesLabel(m)}</div>
            <input
              type="range"
              value={m}
              min={3}
              max={MAX_M}
              step={1}
              onChange={(e) => setM(parseInt(e.target.value))}
              className="w-full accent-signal-cyan"
            />
            <div className="font-mono text-[10px] text-ink-300">{dict.seedLabel(seed)}</div>
            <input
              type="range"
              value={seed}
              min={1}
              max={MAX_SEED}
              step={1}
              onChange={(e) => setSeed(parseInt(e.target.value))}
              className="w-full accent-signal-amber"
            />
            <div className="font-mono text-[10px] text-ink-400">
              {dict.ratioLabel((m / n).toFixed(2))}
            </div>
            <button
              onClick={loadRandom}
              className="w-full rounded-md border border-signal-cyan/50 bg-signal-cyan/10 py-2 font-mono text-[11px] uppercase tracking-widest2 text-signal-cyan transition-colors hover:bg-signal-cyan/20"
            >
              {dict.generateRandom}
            </button>
          </div>

          {/* Speed + controls */}
          {mode === "solve" && (
            <div className="hairline space-y-3 border-b p-5">
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                {dict.speedLabel(speed)}
              </div>
              <input
                type="range"
                value={speed}
                min={1}
                max={MAX_SPEED}
                step={1}
                onChange={(e) => setSpeed(parseInt(e.target.value))}
                className="w-full accent-signal-amber"
              />
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleStep}
                  disabled={state.verdict === "sat" || state.verdict === "unsat"}
                  className="hairline rounded-md border py-2 font-mono text-[11px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-signal-cyan/40 hover:text-signal-cyan disabled:opacity-30"
                >
                  {dict.btnStep}
                </button>
                <button
                  onClick={() => setRunning((r) => !r)}
                  disabled={state.verdict === "sat" || state.verdict === "unsat"}
                  className="rounded-md border border-signal-cyan/50 bg-signal-cyan/10 py-2 font-mono text-[11px] uppercase tracking-widest2 text-signal-cyan transition-colors hover:bg-signal-cyan/20 disabled:opacity-30"
                >
                  {running ? dict.btnPause : dict.btnRun}
                </button>
                <button
                  onClick={handleReset}
                  className="hairline col-span-2 rounded-md border py-2 font-mono text-[11px] uppercase tracking-widest2 text-ink-300 transition-colors hover:border-ink-300/50"
                >
                  {dict.btnReset}
                </button>
              </div>
            </div>
          )}

          {/* Stats */}
          {mode === "solve" && (
            <div className="hairline space-y-2 border-b p-5 font-mono text-xs">
              <div className="mb-1 font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                {dict.solverStats}
              </div>
              <StatRow label={dict.statElapsed} value={`${state.elapsedMs.toFixed(1)} ms`} />
              <StatRow label={dict.statBranches} value={`${state.branches}`} />
              <StatRow label={dict.statUnitProp} value={`${state.unitProps}`} />
              <StatRow label={dict.statPureLit} value={`${state.pureLits}`} />
              <StatRow label={dict.statConflicts} value={`${state.conflicts}`} />
              <StatRow label={dict.statDepth} value={`${state.stack.length}`} />
              <StatRow
                label={dict.statVerdict}
                value={state.verdict}
                accent={
                  state.verdict === "sat"
                    ? "text-signal-amber"
                    : state.verdict === "unsat"
                      ? "text-signal-cyan"
                      : "text-ink-200"
                }
              />
              {state.finalAssign &&
                (() => {
                  const fa = state.finalAssign;
                  return (
                    <div className="mt-2 text-[10px] leading-relaxed text-ink-300">
                      {dict.foundPrefix}{" "}
                      {Array.from({ length: activeVars }, (_, i) => i + 1)
                        .map((v) => `x${v}=${fa.get(v) ? "T" : fa.get(v) === false ? "F" : "?"}`)
                        .join(", ")}
                    </div>
                  );
                })()}
            </div>
          )}

          {/* Verify-mode toggle */}
          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {dict.modeLabel}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setMode("solve")}
                className={`rounded-md border px-2 py-1.5 font-mono text-[11px] uppercase tracking-widest2 transition-colors ${
                  mode === "solve"
                    ? "border-signal-cyan/60 bg-signal-cyan/10 text-signal-cyan"
                    : "hairline text-ink-300 hover:text-ink-100"
                }`}
              >
                {dict.modeSolve}
              </button>
              <button
                onClick={() => setMode("verify")}
                className={`rounded-md border px-2 py-1.5 font-mono text-[11px] uppercase tracking-widest2 transition-colors ${
                  mode === "verify"
                    ? "border-signal-amber/60 bg-signal-amber/10 text-signal-amber"
                    : "hairline text-ink-300 hover:text-ink-100"
                }`}
              >
                {dict.modeVerify}
              </button>
            </div>
            <p className="text-[10px] leading-relaxed text-ink-400">{dict.modeFootnote}</p>
          </div>

          <div className="p-5">
            <Link
              href="/pvsnp"
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

function SearchTree({ state, dict }: { state: SolverState; dict: RichExplorer }) {
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
              ? palette.signal.amber
              : node.status === "conflict"
                ? palette.signal.rose
                : node.status === "explored"
                  ? "rgba(138,144,164,0.35)"
                  : palette.signal.cyan;
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
        <Legend swatch={palette.signal.cyan} label={dict.legendOpen} />
        <Legend swatch="rgba(138,144,164,0.7)" label={dict.legendExplored} />
        <Legend swatch={palette.signal.rose} label={dict.legendConflict} />
        <Legend swatch={palette.signal.amber} label={dict.legendSat} />
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
