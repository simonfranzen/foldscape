"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import type { Locale } from "@/lib/i18n/types";

// --------------------------------------------------------------------------
// Toy-program halting simulator. The user picks one of six canned programs;
// the VM runs it step-by-step on a small tape. After N steps either the
// program has halted (we know: "halted at step k") or we cap it and report
// "still running after N steps, we cannot say if it ever halts." That cap
// is the point: any finite analyser eventually gives up, illustrating why
// the halting problem is undecidable.
//
// We use a tiny Brainfuck-style instruction set:
//   +  increment the cell under the pointer (wrap mod 256)
//   -  decrement the cell under the pointer (wrap mod 256)
//   >  move pointer right (wrap around tape)
//   <  move pointer left  (wrap around tape)
//   [  if cell == 0, jump past matching ]
//   ]  if cell != 0, jump back past matching [
// Anything else is ignored (comments are allowed).
//
// This is enough to write loops that obviously halt (count down a cell),
// loops that obviously don't (+++ in [ … ]), and a self-referential "do the
// opposite of what H says about me" toy that we wire up by hand below.
// --------------------------------------------------------------------------

const TAPE_SIZE = 32;
const MAX_STEPS_HARD_CAP = 100_000;
const STEP_CAP_SLIDER_MAX = 10_000; // keep the slider range manageable without hiding the hard cap
const DEFAULT_STEP_CAP = 2000;
const DEFAULT_SPEED = 40; // steps/sec
const MAX_STEPS_PER_FRAME = 500;

type HaltStatus = "running" | "halted" | "cap";

interface VMState {
  tape: Uint8Array;
  pointer: number;
  pc: number;
  step: number;
  status: HaltStatus;
}

// Language-independent program: id + source. All human-readable copy
// (label, description, truth) lives per-locale in RICH_EXPLORER below.
interface ProgramDef {
  id: string;
  code: string;
}

// Build a jump table once per program so [/] are O(1).
function buildJumpTable(code: string): Map<number, number> {
  const stack: number[] = [];
  const map = new Map<number, number>();
  for (let i = 0; i < code.length; i++) {
    if (code[i] === "[") stack.push(i);
    else if (code[i] === "]") {
      const open = stack.pop();
      if (open === undefined) continue; // unbalanced, treated as nop
      map.set(open, i);
      map.set(i, open);
    }
  }
  return map;
}

function freshState(): VMState {
  return {
    tape: new Uint8Array(TAPE_SIZE),
    pointer: 0,
    pc: 0,
    step: 0,
    status: "running",
  };
}

function stepVM(
  state: VMState,
  code: string,
  jumps: Map<number, number>,
  stepCap: number,
): VMState {
  if (state.status !== "running") return state;
  if (state.step >= stepCap) {
    return { ...state, status: "cap" };
  }
  if (state.pc >= code.length) {
    return { ...state, status: "halted" };
  }
  const instr = code[state.pc];
  // Copy the tape before touching it. stepVM runs inside setState updaters,
  // and React StrictMode invokes those twice in dev; mutating the previous
  // state's Uint8Array in place would apply every +/- twice. A per-call copy
  // (32 bytes) keeps the updater pure.
  const tape = state.tape.slice();
  let pointer = state.pointer;
  let pc = state.pc;
  switch (instr) {
    case "+":
      tape[pointer] = (tape[pointer] + 1) & 0xff;
      pc++;
      break;
    case "-":
      tape[pointer] = (tape[pointer] - 1) & 0xff;
      pc++;
      break;
    case ">":
      pointer = (pointer + 1) % TAPE_SIZE;
      pc++;
      break;
    case "<":
      pointer = (pointer - 1 + TAPE_SIZE) % TAPE_SIZE;
      pc++;
      break;
    case "[": {
      if (tape[pointer] === 0) {
        const j = jumps.get(pc);
        pc = j !== undefined ? j + 1 : pc + 1;
      } else {
        pc++;
      }
      break;
    }
    case "]": {
      if (tape[pointer] !== 0) {
        const j = jumps.get(pc);
        pc = j !== undefined ? j + 1 : pc + 1;
      } else {
        pc++;
      }
      break;
    }
    default:
      pc++;
      break;
  }
  const nextStep = state.step + 1;
  let status: HaltStatus = "running";
  if (pc >= code.length) status = "halted";
  return {
    tape,
    pointer,
    pc,
    step: nextStep,
    status,
  };
}

// Programs ----------------------------------------------------------------

// Increment forever: cell 0 is set to 1 to enter the loop, then we just keep
// incrementing cell 1 inside an unconditional loop on cell 0. Never halts.
const INCREMENT_FOREVER = "+[>+<]";

// Count to 100: cell 0 = 100, then decrement until zero. 100 iterations × a
// few inner steps. Halts.
const COUNT_TO_100 = "+".repeat(100) + "[-]";

// Collatz on 27 written in a "we cheat and just unroll" style would be
// huge, so instead we model the abstract Collatz dynamics in the renderer
// rather than the BF source. To keep the simulator honest, we provide a
// straight BF program that simply counts down from 111 (the number of
// real Collatz steps from 27 to 1) and halts. The description in the
// sidebar tells the truth: Collatz on 27 takes 111 steps.
const COLLATZ_27 = "+".repeat(111) + "[-]";

// Goldbach search: we don't actually compute Goldbach inside the VM (the
// number of primes you'd need to test makes it impossible in a few
// thousand steps). We instead model the *shape*: an outer loop that
// increments a counter forever, with a guard that would halt if the
// conjecture ever failed. Concretely we just loop forever, because as
// far as anyone has checked (up to 4 × 10^18), Goldbach holds. The
// status the user sees is identical to what real life gives us: still
// running, we don't know.
const GOLDBACH_SEARCH = "+[>+<]";

// Collatz on input: a generic search you'd never finish, same shape.
const COLLATZ_GENERIC = "+[>+<]";

// Self-referential diagonal. The trick in Turing's proof is that D(P)
// computes halts(P, P) and does the opposite. We can't write halts inside
// the VM (it doesn't exist!) so the program below simulates the *shape*:
// it sets cell 0 to a non-zero "halts says ⊤" value, enters a loop, and
// then never leaves. The point in the UI is to read the description and
// see why no inner content could ever make D consistent.
const DIAGONAL_D = "+[>+<]";

// Fixed order. The per-locale `programs` arrays in RICH_EXPLORER are
// index-matched to this list, so both stay in lockstep.
const PROGRAM_DEFS: ProgramDef[] = [
  { id: "increment-forever", code: INCREMENT_FOREVER },
  { id: "count-to-100", code: COUNT_TO_100 },
  { id: "goldbach", code: GOLDBACH_SEARCH },
  { id: "collatz-27", code: COLLATZ_27 },
  { id: "collatz-input", code: COLLATZ_GENERIC },
  { id: "diagonal-d", code: DIAGONAL_D },
];

// --------------------------------------------------------------------------
// Per-locale UI strings for the halting explorer. Kept inline (like the
// sibling explorers) so the translations live next to the controls they
// label instead of fattening the shared i18n bundles. Math notation
// (+[>+<], halts(P, x), n ↦ 3n+1, ⊤/⊥, powers of ten) is universal and
// stays untranslated inside the strings.
// --------------------------------------------------------------------------

interface ProgramCopy {
  label: string;
  description: string;
  truth: string; // what we actually know about its halting behaviour
}

interface RichExplorer {
  vmBadge: (cells: number) => string;
  program: string; // section + source header, the word "Program"
  groundTruth: string;
  tape: string;
  controls: string;
  stepLimit: string;
  speed: string;
  speedUnit: string;
  step: string;
  run: string;
  pause: string;
  reset: string;
  stepLimitAria: string;
  speedAria: string;
  capExplainer: string;
  statusHalted: (step: number) => string;
  statusCap: (step: number) => string;
  statusRunning: (step: number, cap: number) => string;
  programs: ProgramCopy[]; // index-matched to PROGRAM_DEFS
}

const RICH_EXPLORER: Record<Locale, RichExplorer> = {
  en: {
    vmBadge: (c) => `Toy VM · tape of ${c} cells · 8-bit values`,
    program: "Program",
    groundTruth: "Ground truth",
    tape: "Tape",
    controls: "Controls",
    stepLimit: "Step limit",
    speed: "Speed",
    speedUnit: "steps/sec",
    step: "Step",
    run: "Run",
    pause: "Pause",
    reset: "Reset",
    stepLimitAria: "Step limit",
    speedAria: "Speed in steps per second",
    capExplainer:
      "Any analyser must give up sooner or later. The cap is your analyser: when it fires, you cannot tell whether the program would eventually halt.",
    statusHalted: (s) => `halted at step ${s}`,
    statusCap: (s) => `still running after ${s} steps, we cannot say if it ever halts`,
    statusRunning: (s, cap) => `running · step ${s} / cap ${cap}`,
    programs: [
      {
        label: "Increment forever",
        description:
          "+[>+<] : cell 0 is set to 1, then the loop runs forever, ticking cell 1 up on every pass.",
        truth: "Trivially never halts.",
      },
      {
        label: "Count to 100",
        description: "Set cell 0 to 100, then [-] decrements it until zero and exits the loop.",
        truth: "Halts after exactly 301 instruction steps.",
      },
      {
        label: "Goldbach search",
        description:
          "For n = 4, 6, 8, … : halt if n is not the sum of two primes. As far as we have searched (up to 4·10¹⁸), Goldbach holds, so this loop keeps running.",
        truth: "Halts iff Goldbach's conjecture is false. Unknown.",
      },
      {
        label: "Collatz on 27",
        description:
          "Iterate n ↦ n/2 (even) or 3n+1 (odd), starting at 27. It really does come back to 1.",
        truth: "Halts after 111 real Collatz steps.",
      },
      {
        label: "Collatz on input",
        description:
          "Same map, arbitrary starting n. The orbit of every n ≤ 2⁶⁸ has been checked by computer and always reaches 1, but no proof in general.",
        truth: "Unknown in general. Open since 1937.",
      },
      {
        label: "Self-referential D",
        description:
          "Turing's diagonal: D(P) computes halts(P, P) and does the opposite. Feed D to itself and either answer of halts(D, D) contradicts the definition.",
        truth: "Cannot exist consistently. The proof of undecidability.",
      },
    ],
  },
  de: {
    vmBadge: (c) => `Mini-VM · Band mit ${c} Zellen · 8-Bit-Werte`,
    program: "Programm",
    groundTruth: "Was wir wissen",
    tape: "Band",
    controls: "Steuerung",
    stepLimit: "Schrittlimit",
    speed: "Geschwindigkeit",
    speedUnit: "Schritte/Sek.",
    step: "Schritt",
    run: "Los",
    pause: "Pause",
    reset: "Zurücksetzen",
    stepLimitAria: "Schrittlimit",
    speedAria: "Geschwindigkeit in Schritten pro Sekunde",
    capExplainer:
      "Jeder Analysator muss früher oder später aufgeben. Das Limit ist dein Analysator: Wenn es greift, kannst du nicht sagen, ob das Programm irgendwann hält.",
    statusHalted: (s) => `angehalten bei Schritt ${s}`,
    statusCap: (s) => `läuft noch nach ${s} Schritten, wir können nicht sagen, ob es je hält`,
    statusRunning: (s, cap) => `läuft · Schritt ${s} / Limit ${cap}`,
    programs: [
      {
        label: "Endlos hochzählen",
        description:
          "+[>+<] : Zelle 0 wird auf 1 gesetzt, dann läuft die Schleife endlos und zählt Zelle 1 bei jedem Durchlauf hoch.",
        truth: "Hält trivialerweise nie an.",
      },
      {
        label: "Bis 100 zählen",
        description:
          "Setze Zelle 0 auf 100, dann verringert [-] sie bis auf null und verlässt die Schleife.",
        truth: "Hält nach genau 301 Befehlsschritten an.",
      },
      {
        label: "Goldbach-Suche",
        description:
          "Für n = 4, 6, 8, … : halte an, wenn n nicht die Summe zweier Primzahlen ist. Soweit geprüft (bis 4·10¹⁸) gilt Goldbach, also läuft diese Schleife weiter.",
        truth: "Hält genau dann an, wenn Goldbachs Vermutung falsch ist. Unbekannt.",
      },
      {
        label: "Collatz für 27",
        description:
          "Iteriere n ↦ n/2 (gerade) oder 3n+1 (ungerade), Start bei 27. Es kehrt tatsächlich zu 1 zurück.",
        truth: "Hält nach 111 echten Collatz-Schritten an.",
      },
      {
        label: "Collatz für Eingabe",
        description:
          "Dieselbe Abbildung, beliebiger Startwert n. Die Bahn jedes n ≤ 2⁶⁸ wurde per Computer geprüft und erreicht stets 1, aber es gibt keinen allgemeinen Beweis.",
        truth: "Allgemein unbekannt. Offen seit 1937.",
      },
      {
        label: "Selbstbezügliches D",
        description:
          "Turings Diagonale: D(P) berechnet halts(P, P) und tut das Gegenteil. Füttere D mit sich selbst, und jede Antwort von halts(D, D) widerspricht der Definition.",
        truth: "Kann nicht widerspruchsfrei existieren. Der Beweis der Unentscheidbarkeit.",
      },
    ],
  },
  es: {
    vmBadge: (c) => `VM de juguete · cinta de ${c} celdas · valores de 8 bits`,
    program: "Programa",
    groundTruth: "Lo que sabemos",
    tape: "Cinta",
    controls: "Controles",
    stepLimit: "Límite de pasos",
    speed: "Velocidad",
    speedUnit: "pasos/s",
    step: "Paso",
    run: "Ejecutar",
    pause: "Pausa",
    reset: "Reiniciar",
    stepLimitAria: "Límite de pasos",
    speedAria: "Velocidad en pasos por segundo",
    capExplainer:
      "Todo analizador debe rendirse tarde o temprano. El límite es tu analizador: cuando salta, no puedes saber si el programa acabaría deteniéndose.",
    statusHalted: (s) => `detenido en el paso ${s}`,
    statusCap: (s) => `sigue ejecutándose tras ${s} pasos, no podemos saber si alguna vez se detiene`,
    statusRunning: (s, cap) => `en ejecución · paso ${s} / límite ${cap}`,
    programs: [
      {
        label: "Incrementar sin fin",
        description:
          "+[>+<] : la celda 0 se pone a 1, luego el bucle se ejecuta para siempre, incrementando la celda 1 en cada pasada.",
        truth: "Trivialmente nunca se detiene.",
      },
      {
        label: "Contar hasta 100",
        description: "Pon la celda 0 a 100, luego [-] la decrementa hasta cero y sale del bucle.",
        truth: "Se detiene tras exactamente 301 pasos de instrucción.",
      },
      {
        label: "Búsqueda de Goldbach",
        description:
          "Para n = 4, 6, 8, … : detente si n no es la suma de dos primos. Hasta donde hemos buscado (hasta 4·10¹⁸), Goldbach se cumple, así que este bucle sigue en marcha.",
        truth: "Se detiene si y solo si la conjetura de Goldbach es falsa. Desconocido.",
      },
      {
        label: "Collatz de 27",
        description:
          "Itera n ↦ n/2 (par) o 3n+1 (impar), empezando en 27. Realmente vuelve a 1.",
        truth: "Se detiene tras 111 pasos reales de Collatz.",
      },
      {
        label: "Collatz de una entrada",
        description:
          "El mismo mapa, n inicial arbitrario. La órbita de todo n ≤ 2⁶⁸ se ha verificado por ordenador y siempre llega a 1, pero no hay prueba general.",
        truth: "Desconocido en general. Abierto desde 1937.",
      },
      {
        label: "D autorreferencial",
        description:
          "La diagonal de Turing: D(P) calcula halts(P, P) y hace lo contrario. Dale D a sí mismo y cualquiera de las respuestas de halts(D, D) contradice la definición.",
        truth: "No puede existir de forma consistente. La prueba de la indecidibilidad.",
      },
    ],
  },
  fr: {
    vmBadge: (c) => `VM jouet · ruban de ${c} cellules · valeurs sur 8 bits`,
    program: "Programme",
    groundTruth: "Ce que l'on sait",
    tape: "Ruban",
    controls: "Commandes",
    stepLimit: "Limite de pas",
    speed: "Vitesse",
    speedUnit: "pas/s",
    step: "Pas",
    run: "Lancer",
    pause: "Pause",
    reset: "Réinitialiser",
    stepLimitAria: "Limite de pas",
    speedAria: "Vitesse en pas par seconde",
    capExplainer:
      "Tout analyseur finit par abandonner. La limite est votre analyseur : quand elle se déclenche, vous ne pouvez pas dire si le programme finirait par s'arrêter.",
    statusHalted: (s) => `arrêté au pas ${s}`,
    statusCap: (s) => `toujours en cours après ${s} pas, impossible de dire s'il s'arrête un jour`,
    statusRunning: (s, cap) => `en cours · pas ${s} / limite ${cap}`,
    programs: [
      {
        label: "Incrémenter sans fin",
        description:
          "+[>+<] : la cellule 0 est mise à 1, puis la boucle tourne indéfiniment en incrémentant la cellule 1 à chaque tour.",
        truth: "Ne s'arrête trivialement jamais.",
      },
      {
        label: "Compter jusqu'à 100",
        description:
          "Mettez la cellule 0 à 100, puis [-] la décrémente jusqu'à zéro et sort de la boucle.",
        truth: "S'arrête après exactement 301 pas d'instruction.",
      },
      {
        label: "Recherche de Goldbach",
        description:
          "Pour n = 4, 6, 8, … : s'arrêter si n n'est pas la somme de deux nombres premiers. Jusqu'où nous avons cherché (jusqu'à 4·10¹⁸), Goldbach tient, donc cette boucle continue.",
        truth: "S'arrête si et seulement si la conjecture de Goldbach est fausse. Inconnu.",
      },
      {
        label: "Collatz sur 27",
        description:
          "Itérez n ↦ n/2 (pair) ou 3n+1 (impair), en partant de 27. Cela revient bel et bien à 1.",
        truth: "S'arrête après 111 vrais pas de Collatz.",
      },
      {
        label: "Collatz sur une entrée",
        description:
          "La même application, n initial quelconque. L'orbite de tout n ≤ 2⁶⁸ a été vérifiée par ordinateur et atteint toujours 1, mais aucune preuve générale.",
        truth: "Inconnu en général. Ouvert depuis 1937.",
      },
      {
        label: "D autoréférentiel",
        description:
          "La diagonale de Turing : D(P) calcule halts(P, P) et fait l'inverse. Donnez D à lui-même et chacune des réponses de halts(D, D) contredit la définition.",
        truth: "Ne peut exister de façon cohérente. La preuve de l'indécidabilité.",
      },
    ],
  },
  it: {
    vmBadge: (c) => `VM giocattolo · nastro di ${c} celle · valori a 8 bit`,
    program: "Programma",
    groundTruth: "Ciò che sappiamo",
    tape: "Nastro",
    controls: "Controlli",
    stepLimit: "Limite di passi",
    speed: "Velocità",
    speedUnit: "passi/s",
    step: "Passo",
    run: "Avvia",
    pause: "Pausa",
    reset: "Reimposta",
    stepLimitAria: "Limite di passi",
    speedAria: "Velocità in passi al secondo",
    capExplainer:
      "Ogni analizzatore prima o poi deve arrendersi. Il limite è il tuo analizzatore: quando scatta, non puoi dire se il programma finirebbe per fermarsi.",
    statusHalted: (s) => `fermato al passo ${s}`,
    statusCap: (s) => `ancora in esecuzione dopo ${s} passi, non possiamo dire se si fermerà mai`,
    statusRunning: (s, cap) => `in esecuzione · passo ${s} / limite ${cap}`,
    programs: [
      {
        label: "Incrementa all'infinito",
        description:
          "+[>+<] : la cella 0 viene impostata a 1, poi il ciclo gira all'infinito, incrementando la cella 1 a ogni passaggio.",
        truth: "Banalmente non si ferma mai.",
      },
      {
        label: "Conta fino a 100",
        description: "Imposta la cella 0 a 100, poi [-] la decrementa fino a zero ed esce dal ciclo.",
        truth: "Si ferma dopo esattamente 301 passi di istruzione.",
      },
      {
        label: "Ricerca di Goldbach",
        description:
          "Per n = 4, 6, 8, … : fermati se n non è la somma di due primi. Fin dove abbiamo cercato (fino a 4·10¹⁸), Goldbach regge, quindi questo ciclo continua.",
        truth: "Si ferma se e solo se la congettura di Goldbach è falsa. Sconosciuto.",
      },
      {
        label: "Collatz su 27",
        description:
          "Itera n ↦ n/2 (pari) o 3n+1 (dispari), partendo da 27. Torna davvero a 1.",
        truth: "Si ferma dopo 111 veri passi di Collatz.",
      },
      {
        label: "Collatz su input",
        description:
          "La stessa mappa, n iniziale arbitrario. L'orbita di ogni n ≤ 2⁶⁸ è stata verificata al computer e raggiunge sempre 1, ma nessuna prova in generale.",
        truth: "Sconosciuto in generale. Aperto dal 1937.",
      },
      {
        label: "D autoreferenziale",
        description:
          "La diagonale di Turing: D(P) calcola halts(P, P) e fa il contrario. Dai D a sé stesso e qualunque risposta di halts(D, D) contraddice la definizione.",
        truth: "Non può esistere in modo coerente. La prova dell'indecidibilità.",
      },
    ],
  },
  pt: {
    vmBadge: (c) => `VM de brinquedo · fita de ${c} células · valores de 8 bits`,
    program: "Programa",
    groundTruth: "O que sabemos",
    tape: "Fita",
    controls: "Controlos",
    stepLimit: "Limite de passos",
    speed: "Velocidade",
    speedUnit: "passos/s",
    step: "Passo",
    run: "Executar",
    pause: "Pausa",
    reset: "Redefinir",
    stepLimitAria: "Limite de passos",
    speedAria: "Velocidade em passos por segundo",
    capExplainer:
      "Qualquer analisador tem de desistir mais cedo ou mais tarde. O limite é o seu analisador: quando dispara, não pode dizer se o programa acabaria por parar.",
    statusHalted: (s) => `parou no passo ${s}`,
    statusCap: (s) => `ainda em execução após ${s} passos, não podemos dizer se alguma vez para`,
    statusRunning: (s, cap) => `em execução · passo ${s} / limite ${cap}`,
    programs: [
      {
        label: "Incrementar sem fim",
        description:
          "+[>+<] : a célula 0 é definida como 1, depois o laço executa para sempre, incrementando a célula 1 a cada passagem.",
        truth: "Trivialmente nunca para.",
      },
      {
        label: "Contar até 100",
        description: "Defina a célula 0 como 100, depois [-] decrementa-a até zero e sai do laço.",
        truth: "Para após exatamente 301 passos de instrução.",
      },
      {
        label: "Busca de Goldbach",
        description:
          "Para n = 4, 6, 8, … : pare se n não for a soma de dois primos. Até onde procurámos (até 4·10¹⁸), Goldbach mantém-se, por isso este laço continua.",
        truth: "Para se e só se a conjetura de Goldbach for falsa. Desconhecido.",
      },
      {
        label: "Collatz de 27",
        description:
          "Itere n ↦ n/2 (par) ou 3n+1 (ímpar), começando em 27. Volta mesmo a 1.",
        truth: "Para após 111 passos reais de Collatz.",
      },
      {
        label: "Collatz de uma entrada",
        description:
          "O mesmo mapa, n inicial arbitrário. A órbita de todo n ≤ 2⁶⁸ foi verificada por computador e chega sempre a 1, mas não há prova geral.",
        truth: "Desconhecido em geral. Em aberto desde 1937.",
      },
      {
        label: "D autorreferencial",
        description:
          "A diagonal de Turing: D(P) calcula halts(P, P) e faz o contrário. Dê D a si mesmo e qualquer resposta de halts(D, D) contradiz a definição.",
        truth: "Não pode existir de forma consistente. A prova da indecidibilidade.",
      },
    ],
  },
  sv: {
    vmBadge: (c) => `Leksaks-VM · band med ${c} celler · 8-bitarsvärden`,
    program: "Program",
    groundTruth: "Vad vi vet",
    tape: "Band",
    controls: "Kontroller",
    stepLimit: "Steggräns",
    speed: "Hastighet",
    speedUnit: "steg/s",
    step: "Steg",
    run: "Kör",
    pause: "Paus",
    reset: "Återställ",
    stepLimitAria: "Steggräns",
    speedAria: "Hastighet i steg per sekund",
    capExplainer:
      "Varje analysator måste ge upp förr eller senare. Gränsen är din analysator: när den slår till kan du inte avgöra om programmet någonsin stannar.",
    statusHalted: (s) => `stannade vid steg ${s}`,
    statusCap: (s) => `kör fortfarande efter ${s} steg, vi kan inte säga om det någonsin stannar`,
    statusRunning: (s, cap) => `kör · steg ${s} / gräns ${cap}`,
    programs: [
      {
        label: "Räkna upp för evigt",
        description:
          "+[>+<] : cell 0 sätts till 1, sedan kör slingan för evigt och räknar upp cell 1 vid varje varv.",
        truth: "Stannar trivialt aldrig.",
      },
      {
        label: "Räkna till 100",
        description: "Sätt cell 0 till 100, sedan minskar [-] den till noll och lämnar slingan.",
        truth: "Stannar efter exakt 301 instruktionssteg.",
      },
      {
        label: "Goldbach-sökning",
        description:
          "För n = 4, 6, 8, … : stanna om n inte är summan av två primtal. Så långt vi har sökt (upp till 4·10¹⁸) håller Goldbach, så den här slingan fortsätter.",
        truth: "Stannar om och endast om Goldbachs förmodan är falsk. Okänt.",
      },
      {
        label: "Collatz på 27",
        description:
          "Iterera n ↦ n/2 (jämnt) eller 3n+1 (udda), med start på 27. Det återvänder faktiskt till 1.",
        truth: "Stannar efter 111 verkliga Collatz-steg.",
      },
      {
        label: "Collatz på indata",
        description:
          "Samma avbildning, godtyckligt start-n. Banan för varje n ≤ 2⁶⁸ har kontrollerats av dator och når alltid 1, men inget bevis i allmänhet.",
        truth: "Okänt i allmänhet. Öppet sedan 1937.",
      },
      {
        label: "Självrefererande D",
        description:
          "Turings diagonal: D(P) beräknar halts(P, P) och gör tvärtom. Mata D med sig själv, och vilket svar halts(D, D) än ger motsäger det definitionen.",
        truth: "Kan inte existera konsekvent. Beviset för oavgörbarhet.",
      },
    ],
  },
  no: {
    vmBadge: (c) => `Leke-VM · bånd med ${c} celler · 8-bits verdier`,
    program: "Program",
    groundTruth: "Hva vi vet",
    tape: "Bånd",
    controls: "Kontroller",
    stepLimit: "Steggrense",
    speed: "Hastighet",
    speedUnit: "steg/s",
    step: "Steg",
    run: "Kjør",
    pause: "Pause",
    reset: "Tilbakestill",
    stepLimitAria: "Steggrense",
    speedAria: "Hastighet i steg per sekund",
    capExplainer:
      "Enhver analysator må gi opp før eller siden. Grensen er analysatoren din: når den slår inn, kan du ikke si om programmet noen gang stopper.",
    statusHalted: (s) => `stoppet ved steg ${s}`,
    statusCap: (s) => `kjører fortsatt etter ${s} steg, vi kan ikke si om det noen gang stopper`,
    statusRunning: (s, cap) => `kjører · steg ${s} / grense ${cap}`,
    programs: [
      {
        label: "Tell opp for alltid",
        description:
          "+[>+<] : celle 0 settes til 1, deretter kjører løkken for alltid og teller opp celle 1 for hver runde.",
        truth: "Stopper trivielt aldri.",
      },
      {
        label: "Tell til 100",
        description: "Sett celle 0 til 100, deretter reduserer [-] den til null og forlater løkken.",
        truth: "Stopper etter nøyaktig 301 instruksjonssteg.",
      },
      {
        label: "Goldbach-søk",
        description:
          "For n = 4, 6, 8, … : stopp hvis n ikke er summen av to primtall. Så langt vi har søkt (opp til 4·10¹⁸), holder Goldbach, så denne løkken fortsetter.",
        truth: "Stopper hvis og bare hvis Goldbachs formodning er usann. Ukjent.",
      },
      {
        label: "Collatz på 27",
        description:
          "Iterer n ↦ n/2 (partall) eller 3n+1 (oddetall), med start på 27. Det vender faktisk tilbake til 1.",
        truth: "Stopper etter 111 virkelige Collatz-steg.",
      },
      {
        label: "Collatz på inndata",
        description:
          "Samme avbildning, vilkårlig start-n. Banen til hver n ≤ 2⁶⁸ er sjekket med datamaskin og når alltid 1, men uten generelt bevis.",
        truth: "Ukjent generelt. Åpent siden 1937.",
      },
      {
        label: "Selvrefererende D",
        description:
          "Turings diagonal: D(P) beregner halts(P, P) og gjør det motsatte. Gi D til seg selv, og uansett hva halts(D, D) svarer, motsier det definisjonen.",
        truth: "Kan ikke eksistere konsistent. Beviset for uavgjørbarhet.",
      },
    ],
  },
};

export default function HaltingExplorer() {
  const { a, u, locale } = useI18n();
  const topic = a.topics.halting;
  const rx = RICH_EXPLORER[locale];

  const [programId, setProgramId] = useState<string>(PROGRAM_DEFS[0].id);
  const programIndex = useMemo(() => {
    const i = PROGRAM_DEFS.findIndex((p) => p.id === programId);
    return i >= 0 ? i : 0;
  }, [programId]);
  const program = PROGRAM_DEFS[programIndex];
  const programCopy = rx.programs[programIndex];
  const jumps = useMemo(() => buildJumpTable(program.code), [program.code]);

  const [stepCap, setStepCap] = useState(DEFAULT_STEP_CAP);
  const [speed, setSpeed] = useState(DEFAULT_SPEED);
  const [running, setRunning] = useState(false);

  const [state, setState] = useState<VMState>(() => freshState());
  const stateRef = useRef(state);
  stateRef.current = state;

  const reset = useCallback(() => {
    setRunning(false);
    setState(freshState());
  }, []);

  // Reset when the user changes program: fresh tape, fresh PC.
  useEffect(() => {
    reset();
  }, [program.id, reset]);

  const stepOnce = useCallback(() => {
    setState((prev) => stepVM(prev, program.code, jumps, stepCap));
  }, [program.code, jumps, stepCap]);

  // Auto-run loop. We batch multiple VM steps per animation frame so that
  // the slider's upper end (200 steps/sec on a slow tape) still feels fast.
  useEffect(() => {
    if (!running) return;
    let cancelled = false;
    let acc = 0;
    let last = performance.now();
    const tick = (now: number) => {
      if (cancelled) return;
      const dt = now - last;
      last = now;
      acc += (dt / 1000) * speed;
      let steps = Math.floor(acc);
      acc -= steps;
      if (steps > MAX_STEPS_PER_FRAME) steps = MAX_STEPS_PER_FRAME;
      if (steps > 0) {
        setState((prev) => {
          let s = prev;
          for (let i = 0; i < steps; i++) {
            if (s.status !== "running") break;
            s = stepVM(s, program.code, jumps, stepCap);
          }
          if (s.status !== "running") {
            // Stop driving the loop once we know the answer (or hit the cap).
            setTimeout(() => setRunning(false), 0);
          }
          return s;
        });
      }
      raf = requestAnimationFrame(tick);
    };
    let raf = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [running, speed, program.code, jumps, stepCap]);

  const statusLine = (() => {
    if (state.status === "halted") {
      return rx.statusHalted(state.step);
    }
    if (state.status === "cap") {
      return rx.statusCap(state.step);
    }
    return rx.statusRunning(state.step, stepCap);
  })();

  const statusAccent = (() => {
    switch (state.status) {
      case "halted":
        return "text-signal-amber";
      case "cap":
        return "text-signal-rose";
      default:
        return "text-signal-cyan";
    }
  })();

  return (
    <main className="flex min-h-screen flex-col pt-14">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_420px]">
        <div className="relative flex min-h-[60vh] flex-col gap-4 bg-ink-950 p-4 lg:min-h-[calc(100vh-3.5rem)] lg:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              {rx.vmBadge(TAPE_SIZE)}
            </div>
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
              halts(P, x) ∈ {"{⊤, ⊥}"}
            </div>
          </div>

          {/* Program source */}
          <div className="hairline space-y-2 rounded-2xl border bg-ink-950 p-4">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {rx.program} · {programCopy.label}
            </div>
            <pre className="whitespace-pre-wrap break-all font-mono text-xs leading-relaxed text-ink-100 md:text-sm">
              {program.code.split("").map((ch, i) => (
                <span
                  key={i}
                  className={
                    i === state.pc && state.status === "running"
                      ? "rounded bg-signal-cyan/30 px-[2px] text-signal-cyan"
                      : ""
                  }
                >
                  {ch}
                </span>
              ))}
            </pre>
            <div className="text-xs leading-relaxed text-ink-300">{programCopy.description}</div>
            <div className="font-mono text-[11px] text-ink-400">
              {rx.groundTruth}: {programCopy.truth}
            </div>
          </div>

          {/* Tape view */}
          <div className="hairline flex-1 space-y-3 rounded-2xl border bg-ink-950 p-4">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {rx.tape}
            </div>
            <div className="md:grid-cols-16 grid grid-cols-8 gap-1">
              {Array.from(state.tape).map((cell, i) => {
                const isHead = i === state.pointer;
                return (
                  <div
                    key={i}
                    className={`rounded border py-2 text-center font-mono text-xs transition-colors ${
                      isHead
                        ? "border-signal-cyan/70 bg-signal-cyan/20 text-signal-cyan"
                        : cell === 0
                          ? "border-ink-700/40 bg-ink-900/40 text-ink-500"
                          : "border-signal-amber/40 bg-signal-amber/10 text-signal-amber"
                    }`}
                  >
                    <div className="text-[9px] text-ink-500">{i}</div>
                    <div>{cell}</div>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between pt-2 font-mono text-[11px] text-ink-300">
              <span>ptr = {state.pointer}</span>
              <span>pc = {state.pc}</span>
              <span className={statusAccent}>{statusLine}</span>
            </div>
          </div>
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
              {rx.program}
            </div>
            <div className="grid grid-cols-1 gap-2">
              {PROGRAM_DEFS.map((p, i) => {
                const copy = rx.programs[i];
                return (
                  <button
                    key={p.id}
                    onClick={() => setProgramId(p.id)}
                    className={`rounded-md border px-3 py-2 text-left transition-colors ${
                      p.id === program.id
                        ? "border-signal-cyan/60 bg-signal-cyan/10 text-signal-cyan"
                        : "hairline text-ink-200 hover:border-signal-cyan/40 hover:text-ink-100"
                    }`}
                  >
                    <div className="font-mono text-xs">{copy.label}</div>
                    <div className="mt-0.5 font-mono text-[10px] leading-snug text-ink-400">
                      {copy.truth}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {rx.controls}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={stepOnce}
                disabled={state.status !== "running"}
                className="hairline rounded-md border px-3 py-2 font-mono text-[11px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-signal-cyan/50 hover:text-signal-cyan disabled:opacity-40 disabled:hover:border-ink-700/50 disabled:hover:text-ink-200"
              >
                {rx.step}
              </button>
              <button
                onClick={() => setRunning((r) => !r)}
                disabled={state.status !== "running"}
                className={`rounded-md border px-3 py-2 font-mono text-[11px] uppercase tracking-widest2 transition-colors disabled:opacity-40 ${
                  running
                    ? "border-signal-rose/60 bg-signal-rose/10 text-signal-rose"
                    : "border-signal-cyan/60 bg-signal-cyan/10 text-signal-cyan hover:bg-signal-cyan/20"
                }`}
              >
                {running ? rx.pause : rx.run}
              </button>
              <button
                onClick={reset}
                className="hairline col-span-2 rounded-md border px-3 py-2 font-mono text-[11px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-signal-amber/50 hover:text-signal-amber"
              >
                {rx.reset}
              </button>
            </div>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {rx.stepLimit} · {stepCap}
            </div>
            <input
              type="range"
              aria-label={rx.stepLimitAria}
              value={stepCap}
              min={10}
              max={Math.min(MAX_STEPS_HARD_CAP, STEP_CAP_SLIDER_MAX)}
              step={10}
              onChange={(e) => setStepCap(parseInt(e.target.value))}
              className="w-full accent-signal-cyan"
            />
            <p className="text-[11px] leading-relaxed text-ink-400">{rx.capExplainer}</p>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {rx.speed} · {speed} {rx.speedUnit}
            </div>
            <input
              type="range"
              aria-label={rx.speedAria}
              value={speed}
              min={1}
              max={200}
              step={1}
              onChange={(e) => setSpeed(parseInt(e.target.value))}
              className="w-full accent-signal-amber"
            />
          </div>

          <div className="p-5">
            <Link
              href="/"
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
