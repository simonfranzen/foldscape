"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import type { Locale } from "@/lib/i18n/types";

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
  { kind: "sat" } | { kind: "conflict" } | { kind: "unit"; lit: Lit } | { kind: "open" };

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
    while (
      trail.length &&
      (trail[trail.length - 1].reason === "unit" || trail[trail.length - 1].flipped)
    ) {
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
    trail = [
      ...trail,
      { v: d.v, value: flippedVal, reason: "decide", flipped: true, level: d.level },
    ];
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
  return {
    assignment: a,
    trail,
    level,
    status: "running",
    action: { type: "decide", v, value: true, level },
  };
}

const litText = (l: Lit, p: Preset) => (l.neg ? "¬" : "") + p.vars[l.v];

// --------------------------------------------------------------------------
// Per-locale UI strings for the DPLL explorer. Kept inline (the repo's
// RICH_EXPLORER pattern, see app/eulerchar/explorer) so every control, legend
// entry, tooltip and narration line is translated next to where it is used
// rather than leaking English into seven localized pages.
// --------------------------------------------------------------------------
type RichExplorer = {
  presets: Record<string, string>;
  vars: string;
  clauses: string;
  decisions: string;
  propagations: string;
  statusSat: string;
  statusUnsat: string;
  statusSolving: string;
  assignment: string;
  formulaUnderAssignment: string;
  formula: string;
  controls: string;
  speed: string;
  stepsPerSecond: string;
  speedLabel: string;
  step: string;
  play: string;
  pause: string;
  reset: string;
  clauseColour: string;
  searchPath: string;
  legendSatisfied: string;
  legendUnit: string;
  legendConflict: string;
  legendOpen: string;
  legendDecision: string;
  legendPropagation: string;
  tipSatisfied: string;
  tipConflict: string;
  tipUnit: string;
  tipOpen: string;
  tipPropagation: string;
  tipDecision: (level: number) => string;
  trailEmpty: string;
  story: string;
  narrateStart: string;
  narrateDecide: (v: string, level: number) => string;
  narrateUnit: (clause: number, v: string, value: boolean) => string;
  narrateBacktrack: (clause: number, v: string, value: boolean) => string;
  narrateSat: string;
  narrateUnsat: string;
};

const RICH_EXPLORER: Record<Locale, RichExplorer> = {
  en: {
    presets: {
      sat: "Satisfiable: forces a backtrack",
      unsat: "Unsatisfiable: every assignment ruled out",
      big: "Satisfiable: five variables",
    },
    vars: "vars",
    clauses: "clauses",
    decisions: "decisions",
    propagations: "propagations",
    statusSat: "⊨ SATISFIABLE",
    statusUnsat: "⊭ UNSATISFIABLE",
    statusSolving: "solving…",
    assignment: "Assignment",
    formulaUnderAssignment: "Formula · each clause under the current assignment",
    formula: "Formula",
    controls: "Controls",
    speed: "Speed",
    stepsPerSecond: "steps/s",
    speedLabel: "Steps per second",
    step: "Step",
    play: "Play",
    pause: "Pause",
    reset: "Reset",
    clauseColour: "Clause colour",
    searchPath: "Search path",
    legendSatisfied: "satisfied",
    legendUnit: "unit: one literal forced",
    legendConflict: "conflict: all false",
    legendOpen: "open: undecided",
    legendDecision: "▼ decision · ⤺ flipped",
    legendPropagation: "unit propagation",
    tipSatisfied: "satisfied",
    tipConflict: "conflict: all literals false",
    tipUnit: "unit: one literal forced",
    tipOpen: "open",
    tipPropagation: "unit propagation",
    tipDecision: (level) => `decision · level ${level}`,
    trailEmpty: "(empty)",
    story: "← Story",
    narrateStart:
      "Pick a formula and press Step. The solver decides a variable, propagates the forced consequences, and backtracks out of every contradiction.",
    narrateDecide: (v, level) =>
      `Decision: no clause forces anything, so guess ${v} = true and open decision level ${level}.`,
    narrateUnit: (clause, v, value) =>
      `Unit propagation: clause ${clause} has one literal left, forcing ${v} = ${value ? "true" : "false"}.`,
    narrateBacktrack: (clause, v, value) =>
      `Conflict in clause ${clause}: every literal is false. Backtrack and flip the last open decision: ${v} = ${value ? "true" : "false"}.`,
    narrateSat:
      "Every variable is assigned and every clause is satisfied: the formula is SATISFIABLE. The assignment is a certificate anyone can check in one pass.",
    narrateUnsat:
      "Backtracking ran past the root: every branch ends in conflict. The formula is UNSATISFIABLE, and the search just proved it, the hard direction.",
  },
  de: {
    presets: {
      sat: "Erfüllbar: erzwingt ein Backtracking",
      unsat: "Unerfüllbar: jede Belegung ausgeschlossen",
      big: "Erfüllbar: fünf Variablen",
    },
    vars: "Variablen",
    clauses: "Klauseln",
    decisions: "Entscheidungen",
    propagations: "Propagationen",
    statusSat: "⊨ ERFÜLLBAR",
    statusUnsat: "⊭ UNERFÜLLBAR",
    statusSolving: "löse…",
    assignment: "Belegung",
    formulaUnderAssignment: "Formel · jede Klausel unter der aktuellen Belegung",
    formula: "Formel",
    controls: "Steuerung",
    speed: "Tempo",
    stepsPerSecond: "Schritte/s",
    speedLabel: "Schritte pro Sekunde",
    step: "Schritt",
    play: "Los",
    pause: "Pause",
    reset: "Zurücksetzen",
    clauseColour: "Klauselfarbe",
    searchPath: "Suchpfad",
    legendSatisfied: "erfüllt",
    legendUnit: "Unit: ein Literal erzwungen",
    legendConflict: "Konflikt: alle falsch",
    legendOpen: "offen: unentschieden",
    legendDecision: "▼ Entscheidung · ⤺ umgekippt",
    legendPropagation: "Unit-Propagation",
    tipSatisfied: "erfüllt",
    tipConflict: "Konflikt: alle Literale falsch",
    tipUnit: "Unit: ein Literal erzwungen",
    tipOpen: "offen",
    tipPropagation: "Unit-Propagation",
    tipDecision: (level) => `Entscheidung · Ebene ${level}`,
    trailEmpty: "(leer)",
    story: "← Zur Story",
    narrateStart:
      "Wähle eine Formel und drücke Schritt. Der Solver entscheidet eine Variable, propagiert die erzwungenen Konsequenzen und setzt aus jedem Widerspruch zurück.",
    narrateDecide: (v, level) =>
      `Entscheidung: Keine Klausel erzwingt etwas, also rate ${v} = wahr und öffne Entscheidungsebene ${level}.`,
    narrateUnit: (clause, v, value) =>
      `Unit-Propagation: Klausel ${clause} hat nur noch ein Literal, das ${v} = ${value ? "wahr" : "falsch"} erzwingt.`,
    narrateBacktrack: (clause, v, value) =>
      `Konflikt in Klausel ${clause}: Jedes Literal ist falsch. Setze zurück und kippe die letzte offene Entscheidung: ${v} = ${value ? "wahr" : "falsch"}.`,
    narrateSat:
      "Jede Variable ist belegt und jede Klausel erfüllt: Die Formel ist ERFÜLLBAR. Die Belegung ist ein Zertifikat, das jede:r in einem Durchgang prüfen kann.",
    narrateUnsat:
      "Das Backtracking lief über die Wurzel hinaus: Jeder Zweig endet im Konflikt. Die Formel ist UNERFÜLLBAR, und die Suche hat es gerade bewiesen, die schwere Richtung.",
  },
  es: {
    presets: {
      sat: "Satisfacible: fuerza un retroceso",
      unsat: "Insatisfacible: toda asignación descartada",
      big: "Satisfacible: cinco variables",
    },
    vars: "vars",
    clauses: "cláusulas",
    decisions: "decisiones",
    propagations: "propagaciones",
    statusSat: "⊨ SATISFACIBLE",
    statusUnsat: "⊭ INSATISFACIBLE",
    statusSolving: "resolviendo…",
    assignment: "Asignación",
    formulaUnderAssignment: "Fórmula · cada cláusula bajo la asignación actual",
    formula: "Fórmula",
    controls: "Controles",
    speed: "Velocidad",
    stepsPerSecond: "pasos/s",
    speedLabel: "Pasos por segundo",
    step: "Paso",
    play: "Reproducir",
    pause: "Pausa",
    reset: "Reiniciar",
    clauseColour: "Color de cláusula",
    searchPath: "Ruta de búsqueda",
    legendSatisfied: "satisfecha",
    legendUnit: "unitaria: un literal forzado",
    legendConflict: "conflicto: todos falsos",
    legendOpen: "abierta: indecisa",
    legendDecision: "▼ decisión · ⤺ volteada",
    legendPropagation: "propagación unitaria",
    tipSatisfied: "satisfecha",
    tipConflict: "conflicto: todos los literales falsos",
    tipUnit: "unitaria: un literal forzado",
    tipOpen: "abierta",
    tipPropagation: "propagación unitaria",
    tipDecision: (level) => `decisión · nivel ${level}`,
    trailEmpty: "(vacío)",
    story: "← Historia",
    narrateStart:
      "Elige una fórmula y pulsa Paso. El solver decide una variable, propaga las consecuencias forzadas y retrocede de cada contradicción.",
    narrateDecide: (v, level) =>
      `Decisión: ninguna cláusula fuerza nada, así que supón ${v} = verdadero y abre el nivel de decisión ${level}.`,
    narrateUnit: (clause, v, value) =>
      `Propagación unitaria: a la cláusula ${clause} le queda un literal, forzando ${v} = ${value ? "verdadero" : "falso"}.`,
    narrateBacktrack: (clause, v, value) =>
      `Conflicto en la cláusula ${clause}: todos los literales son falsos. Retrocede y voltea la última decisión abierta: ${v} = ${value ? "verdadero" : "falso"}.`,
    narrateSat:
      "Cada variable está asignada y cada cláusula satisfecha: la fórmula es SATISFACIBLE. La asignación es un certificado que cualquiera comprueba en una pasada.",
    narrateUnsat:
      "El retroceso pasó de la raíz: toda rama acaba en conflicto. La fórmula es INSATISFACIBLE, y la búsqueda acaba de probarlo, la dirección difícil.",
  },
  fr: {
    presets: {
      sat: "Satisfaisable : force un retour arrière",
      unsat: "Insatisfaisable : toute affectation écartée",
      big: "Satisfaisable : cinq variables",
    },
    vars: "vars",
    clauses: "clauses",
    decisions: "décisions",
    propagations: "propagations",
    statusSat: "⊨ SATISFAISABLE",
    statusUnsat: "⊭ INSATISFAISABLE",
    statusSolving: "résolution…",
    assignment: "Affectation",
    formulaUnderAssignment: "Formule · chaque clause sous l'affectation actuelle",
    formula: "Formule",
    controls: "Commandes",
    speed: "Vitesse",
    stepsPerSecond: "pas/s",
    speedLabel: "Pas par seconde",
    step: "Pas",
    play: "Lecture",
    pause: "Pause",
    reset: "Réinitialiser",
    clauseColour: "Couleur de clause",
    searchPath: "Chemin de recherche",
    legendSatisfied: "satisfaite",
    legendUnit: "unitaire : un littéral forcé",
    legendConflict: "conflit : tous faux",
    legendOpen: "ouverte : indécise",
    legendDecision: "▼ décision · ⤺ inversée",
    legendPropagation: "propagation unitaire",
    tipSatisfied: "satisfaite",
    tipConflict: "conflit : tous les littéraux faux",
    tipUnit: "unitaire : un littéral forcé",
    tipOpen: "ouverte",
    tipPropagation: "propagation unitaire",
    tipDecision: (level) => `décision · niveau ${level}`,
    trailEmpty: "(vide)",
    story: "← Récit",
    narrateStart:
      "Choisis une formule et presse Pas. Le solveur décide une variable, propage les conséquences forcées et rebrousse chemin à chaque contradiction.",
    narrateDecide: (v, level) =>
      `Décision : aucune clause n'impose rien, alors devine ${v} = vrai et ouvre le niveau de décision ${level}.`,
    narrateUnit: (clause, v, value) =>
      `Propagation unitaire : il reste un littéral à la clause ${clause}, forçant ${v} = ${value ? "vrai" : "faux"}.`,
    narrateBacktrack: (clause, v, value) =>
      `Conflit dans la clause ${clause} : tous les littéraux sont faux. Rebrousse chemin et inverse la dernière décision ouverte : ${v} = ${value ? "vrai" : "faux"}.`,
    narrateSat:
      "Chaque variable est affectée et chaque clause satisfaite : la formule est SATISFAISABLE. L'affectation est un certificat que chacun vérifie en un passage.",
    narrateUnsat:
      "Le retour arrière a dépassé la racine : chaque branche finit en conflit. La formule est INSATISFAISABLE, et la recherche vient de le prouver, la direction difficile.",
  },
  it: {
    presets: {
      sat: "Soddisfacibile: forza un backtracking",
      unsat: "Insoddisfacibile: ogni assegnamento escluso",
      big: "Soddisfacibile: cinque variabili",
    },
    vars: "var",
    clauses: "clausole",
    decisions: "decisioni",
    propagations: "propagazioni",
    statusSat: "⊨ SODDISFACIBILE",
    statusUnsat: "⊭ INSODDISFACIBILE",
    statusSolving: "risolvo…",
    assignment: "Assegnamento",
    formulaUnderAssignment: "Formula · ogni clausola sotto l'assegnamento attuale",
    formula: "Formula",
    controls: "Controlli",
    speed: "Velocità",
    stepsPerSecond: "passi/s",
    speedLabel: "Passi al secondo",
    step: "Passo",
    play: "Avvia",
    pause: "Pausa",
    reset: "Azzera",
    clauseColour: "Colore della clausola",
    searchPath: "Percorso di ricerca",
    legendSatisfied: "soddisfatta",
    legendUnit: "unitaria: un letterale forzato",
    legendConflict: "conflitto: tutti falsi",
    legendOpen: "aperta: indecisa",
    legendDecision: "▼ decisione · ⤺ ribaltata",
    legendPropagation: "propagazione unitaria",
    tipSatisfied: "soddisfatta",
    tipConflict: "conflitto: tutti i letterali falsi",
    tipUnit: "unitaria: un letterale forzato",
    tipOpen: "aperta",
    tipPropagation: "propagazione unitaria",
    tipDecision: (level) => `decisione · livello ${level}`,
    trailEmpty: "(vuoto)",
    story: "← Racconto",
    narrateStart:
      "Scegli una formula e premi Passo. Il solver decide una variabile, propaga le conseguenze forzate e torna indietro da ogni contraddizione.",
    narrateDecide: (v, level) =>
      `Decisione: nessuna clausola forza nulla, quindi indovina ${v} = vero e apri il livello di decisione ${level}.`,
    narrateUnit: (clause, v, value) =>
      `Propagazione unitaria: alla clausola ${clause} resta un letterale, forzando ${v} = ${value ? "vero" : "falso"}.`,
    narrateBacktrack: (clause, v, value) =>
      `Conflitto nella clausola ${clause}: ogni letterale è falso. Torna indietro e ribalta l'ultima decisione aperta: ${v} = ${value ? "vero" : "falso"}.`,
    narrateSat:
      "Ogni variabile è assegnata e ogni clausola soddisfatta: la formula è SODDISFACIBILE. L'assegnamento è un certificato che chiunque verifica in un passaggio.",
    narrateUnsat:
      "Il backtracking è andato oltre la radice: ogni ramo finisce in conflitto. La formula è INSODDISFACIBILE, e la ricerca l'ha appena dimostrato, la direzione difficile.",
  },
  pt: {
    presets: {
      sat: "Satisfazível: força um retrocesso",
      unsat: "Insatisfazível: toda atribuição descartada",
      big: "Satisfazível: cinco variáveis",
    },
    vars: "vars",
    clauses: "cláusulas",
    decisions: "decisões",
    propagations: "propagações",
    statusSat: "⊨ SATISFAZÍVEL",
    statusUnsat: "⊭ INSATISFAZÍVEL",
    statusSolving: "a resolver…",
    assignment: "Atribuição",
    formulaUnderAssignment: "Fórmula · cada cláusula sob a atribuição atual",
    formula: "Fórmula",
    controls: "Controlos",
    speed: "Velocidade",
    stepsPerSecond: "passos/s",
    speedLabel: "Passos por segundo",
    step: "Passo",
    play: "Reproduzir",
    pause: "Pausa",
    reset: "Reiniciar",
    clauseColour: "Cor da cláusula",
    searchPath: "Caminho de busca",
    legendSatisfied: "satisfeita",
    legendUnit: "unitária: um literal forçado",
    legendConflict: "conflito: todos falsos",
    legendOpen: "aberta: indecisa",
    legendDecision: "▼ decisão · ⤺ invertida",
    legendPropagation: "propagação unitária",
    tipSatisfied: "satisfeita",
    tipConflict: "conflito: todos os literais falsos",
    tipUnit: "unitária: um literal forçado",
    tipOpen: "aberta",
    tipPropagation: "propagação unitária",
    tipDecision: (level) => `decisão · nível ${level}`,
    trailEmpty: "(vazio)",
    story: "← História",
    narrateStart:
      "Escolhe uma fórmula e carrega em Passo. O solver decide uma variável, propaga as consequências forçadas e recua de cada contradição.",
    narrateDecide: (v, level) =>
      `Decisão: nenhuma cláusula força nada, então adivinha ${v} = verdadeiro e abre o nível de decisão ${level}.`,
    narrateUnit: (clause, v, value) =>
      `Propagação unitária: à cláusula ${clause} resta um literal, forçando ${v} = ${value ? "verdadeiro" : "falso"}.`,
    narrateBacktrack: (clause, v, value) =>
      `Conflito na cláusula ${clause}: cada literal é falso. Recua e inverte a última decisão aberta: ${v} = ${value ? "verdadeiro" : "falso"}.`,
    narrateSat:
      "Cada variável está atribuída e cada cláusula satisfeita: a fórmula é SATISFAZÍVEL. A atribuição é um certificado que qualquer pessoa verifica numa passagem.",
    narrateUnsat:
      "O retrocesso passou da raiz: cada ramo acaba em conflito. A fórmula é INSATISFAZÍVEL, e a busca acabou de o provar, a direção difícil.",
  },
  sv: {
    presets: {
      sat: "Satisfierbar: tvingar fram en backtrack",
      unsat: "Osatisfierbar: varje tilldelning utesluten",
      big: "Satisfierbar: fem variabler",
    },
    vars: "var",
    clauses: "klausuler",
    decisions: "beslut",
    propagations: "propageringar",
    statusSat: "⊨ SATISFIERBAR",
    statusUnsat: "⊭ OSATISFIERBAR",
    statusSolving: "löser…",
    assignment: "Tilldelning",
    formulaUnderAssignment: "Formel · varje klausul under den aktuella tilldelningen",
    formula: "Formel",
    controls: "Kontroller",
    speed: "Hastighet",
    stepsPerSecond: "steg/s",
    speedLabel: "Steg per sekund",
    step: "Steg",
    play: "Spela",
    pause: "Paus",
    reset: "Återställ",
    clauseColour: "Klausulfärg",
    searchPath: "Sökväg",
    legendSatisfied: "satisfierad",
    legendUnit: "enhet: en literal tvingad",
    legendConflict: "konflikt: alla falska",
    legendOpen: "öppen: obestämd",
    legendDecision: "▼ beslut · ⤺ vänd",
    legendPropagation: "enhetspropagering",
    tipSatisfied: "satisfierad",
    tipConflict: "konflikt: alla literaler falska",
    tipUnit: "enhet: en literal tvingad",
    tipOpen: "öppen",
    tipPropagation: "enhetspropagering",
    tipDecision: (level) => `beslut · nivå ${level}`,
    trailEmpty: "(tomt)",
    story: "← Berättelse",
    narrateStart:
      "Välj en formel och tryck Steg. Lösaren beslutar en variabel, propagerar de tvingade följderna och backar ur varje motsägelse.",
    narrateDecide: (v, level) =>
      `Beslut: ingen klausul tvingar något, så gissa ${v} = sant och öppna beslutsnivå ${level}.`,
    narrateUnit: (clause, v, value) =>
      `Enhetspropagering: klausul ${clause} har en literal kvar, vilket tvingar ${v} = ${value ? "sant" : "falskt"}.`,
    narrateBacktrack: (clause, v, value) =>
      `Konflikt i klausul ${clause}: varje literal är falsk. Backa och vänd det senaste öppna beslutet: ${v} = ${value ? "sant" : "falskt"}.`,
    narrateSat:
      "Varje variabel är tilldelad och varje klausul satisfierad: formeln är SATISFIERBAR. Tilldelningen är ett certifikat som vem som helst kontrollerar i ett svep.",
    narrateUnsat:
      "Backtrackningen gick förbi roten: varje gren slutar i konflikt. Formeln är OSATISFIERBAR, och sökningen bevisade det just, den svåra riktningen.",
  },
  no: {
    presets: {
      sat: "Oppfyllbar: tvinger fram en backtrack",
      unsat: "Uoppfyllbar: hver tildeling utelukket",
      big: "Oppfyllbar: fem variabler",
    },
    vars: "var",
    clauses: "klausuler",
    decisions: "beslutninger",
    propagations: "propageringer",
    statusSat: "⊨ OPPFYLLBAR",
    statusUnsat: "⊭ UOPPFYLLBAR",
    statusSolving: "løser…",
    assignment: "Tildeling",
    formulaUnderAssignment: "Formel · hver klausul under den gjeldende tildelingen",
    formula: "Formel",
    controls: "Kontroller",
    speed: "Hastighet",
    stepsPerSecond: "steg/s",
    speedLabel: "Steg per sekund",
    step: "Steg",
    play: "Spill",
    pause: "Pause",
    reset: "Nullstill",
    clauseColour: "Klausulfarge",
    searchPath: "Søkesti",
    legendSatisfied: "oppfylt",
    legendUnit: "enhet: én literal tvunget",
    legendConflict: "konflikt: alle usanne",
    legendOpen: "åpen: ubestemt",
    legendDecision: "▼ beslutning · ⤺ vendt",
    legendPropagation: "enhetspropagering",
    tipSatisfied: "oppfylt",
    tipConflict: "konflikt: alle literaler usanne",
    tipUnit: "enhet: én literal tvunget",
    tipOpen: "åpen",
    tipPropagation: "enhetspropagering",
    tipDecision: (level) => `beslutning · nivå ${level}`,
    trailEmpty: "(tomt)",
    story: "← Fortelling",
    narrateStart:
      "Velg en formel og trykk Steg. Løseren beslutter en variabel, propagerer de tvungne følgene og går tilbake fra hver motsigelse.",
    narrateDecide: (v, level) =>
      `Beslutning: ingen klausul tvinger noe, så gjett ${v} = sann og åpne beslutningsnivå ${level}.`,
    narrateUnit: (clause, v, value) =>
      `Enhetspropagering: klausul ${clause} har én literal igjen, som tvinger ${v} = ${value ? "sann" : "usann"}.`,
    narrateBacktrack: (clause, v, value) =>
      `Konflikt i klausul ${clause}: hver literal er usann. Gå tilbake og vend den siste åpne beslutningen: ${v} = ${value ? "sann" : "usann"}.`,
    narrateSat:
      "Hver variabel er tildelt og hver klausul oppfylt: formelen er OPPFYLLBAR. Tildelingen er et sertifikat som hvem som helst kan sjekke i ett gjennomløp.",
    narrateUnsat:
      "Backtrackingen gikk forbi roten: hver gren ender i konflikt. Formelen er UOPPFYLLBAR, og søket beviste det nettopp, den vanskelige retningen.",
  },
};

export default function SatExplorer() {
  const { a: atlas, u, locale } = useI18n();
  const topic = atlas.topics.sat;
  const tr = RICH_EXPLORER[locale];

  const [presetId, setPresetId] = useState("sat");
  const preset = useMemo(() => PRESETS.find((x) => x.id === presetId)!, [presetId]);
  const [state, setState] = useState<State>(() => initState(preset));
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(3); // steps per second

  // Reset synchronously when the preset changes (React's store-previous-value
  // pattern) so no frame paints the new formula against the old assignment.
  // An effect-based reset runs after paint and flashes stale solver state.
  const [prevPresetId, setPrevPresetId] = useState(presetId);
  if (presetId !== prevPresetId) {
    setPrevPresetId(presetId);
    setState(initState(preset));
    setPlaying(false);
  }

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

  const narration = describe(state.action, preset, tr);

  return (
    <main className="flex min-h-screen flex-col pt-14">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_420px]">
        {/* Main view */}
        <div className="relative flex min-h-[60vh] flex-col gap-5 bg-ink-950 p-4 lg:min-h-[calc(100vh-3.5rem)] lg:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              CNF · {preset.vars.length} {tr.vars} · {preset.clauses.length} {tr.clauses}
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
                ? tr.statusSat
                : state.status === "unsat"
                  ? tr.statusUnsat
                  : tr.statusSolving}
            </div>
          </div>

          {/* Current assignment */}
          <div className="hairline rounded-2xl border bg-ink-950/60 p-4">
            <div className="mb-3 font-mono text-[10px] uppercase tracking-widest2 text-ink-400">
              {tr.assignment}
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
              {tr.formulaUnderAssignment}
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
                          ? tr.tipSatisfied
                          : st.kind === "conflict"
                            ? tr.tipConflict
                            : st.kind === "unit"
                              ? tr.tipUnit
                              : tr.tipOpen
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
              {tr.searchPath} · {decisions} {tr.decisions} · {props} {tr.propagations}
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {state.trail.length === 0 && (
                <span className="font-mono text-[11px] text-ink-500">{tr.trailEmpty}</span>
              )}
              {state.trail.map((t, i) => (
                <span
                  key={i}
                  className={`rounded-md border px-2 py-1 font-mono text-[11px] ${
                    t.reason === "decide"
                      ? "border-signal-violet/50 bg-signal-violet/10 text-signal-violet"
                      : "border-signal-cyan/40 bg-signal-cyan/10 text-signal-cyan"
                  }`}
                  title={t.reason === "decide" ? tr.tipDecision(t.level) : tr.tipPropagation}
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
              {tr.formula}
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
                  <div className="font-mono text-xs">{tr.presets[p.id]}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {tr.controls}
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
                {tr.step}
              </button>
              <button
                onClick={() => setPlaying(true)}
                disabled={state.status !== "running" || playing}
                className="hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-ink-200 hover:border-signal-violet/50 hover:text-signal-violet disabled:opacity-40"
              >
                {tr.play}
              </button>
              <button
                onClick={() => setPlaying(false)}
                disabled={!playing}
                className="hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-ink-200 hover:border-signal-violet/50 hover:text-signal-violet disabled:opacity-40"
              >
                {tr.pause}
              </button>
              <button
                onClick={reset}
                className="hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-ink-200 hover:border-signal-rose/50 hover:text-signal-rose"
              >
                {tr.reset}
              </button>
            </div>
          </div>

          {/* Speed */}
          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {tr.speed}
            </div>
            <div className="flex items-center justify-between font-mono text-sm">
              <span className="text-signal-violet">
                {speed} {tr.stepsPerSecond}
              </span>
            </div>
            <input
              type="range"
              value={speed}
              min={1}
              max={12}
              step={1}
              aria-label={tr.speedLabel}
              onChange={(e) => setSpeed(parseInt(e.target.value))}
              className="w-full accent-signal-violet"
            />
          </div>

          {/* Legend */}
          <div className="hairline space-y-2 border-b p-5 font-mono text-[10px] text-ink-200">
            <div className="uppercase tracking-widest2 text-ink-300">{tr.clauseColour}</div>
            <Legend swatch="bg-signal-teal/30 border-signal-teal/60" label={tr.legendSatisfied} />
            <Legend swatch="bg-signal-amber/20 border-signal-amber/60" label={tr.legendUnit} />
            <Legend swatch="bg-signal-rose/20 border-signal-rose/70" label={tr.legendConflict} />
            <Legend swatch="bg-ink-900 border-ink-500/40" label={tr.legendOpen} />
            <div className="pt-2 uppercase tracking-widest2 text-ink-300">{tr.searchPath}</div>
            <Legend
              swatch="bg-signal-violet/20 border-signal-violet/60"
              label={tr.legendDecision}
            />
            <Legend swatch="bg-signal-cyan/20 border-signal-cyan/50" label={tr.legendPropagation} />
          </div>

          <div className="p-5">
            <Link
              href="/sat"
              className="hairline mb-2 block w-full rounded-md border py-2 text-center font-mono text-[10px] uppercase tracking-widest2 text-ink-300 transition-colors hover:border-signal-violet/40 hover:text-signal-violet"
            >
              {tr.story}
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

function describe(action: Action, p: Preset, tr: RichExplorer): string {
  switch (action.type) {
    case "start":
      return tr.narrateStart;
    case "decide":
      return tr.narrateDecide(p.vars[action.v], action.level);
    case "unit":
      return tr.narrateUnit(action.clause + 1, p.vars[action.v], action.value);
    case "backtrack":
      return tr.narrateBacktrack(action.clause + 1, p.vars[action.v], action.value);
    case "sat":
      return tr.narrateSat;
    case "unsat":
      return tr.narrateUnsat;
  }
}
