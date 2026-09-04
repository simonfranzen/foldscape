"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import type { Locale } from "@/lib/i18n/types";

const ACCENT = "text-signal-violet";
const N = 16; // 16 rows × 16 digit columns

// Explorer UI copy. The story page ships a fully localised bundle, so the
// interactive room follows the repo's RICH_EXPLORER convention (see
// app/mobius/explorer) instead of stranding de/fr/… users in an English room.
type ExplorerDict = {
  diagonalLabel: string;
  rowsWord: string;
  digitsWord: string;
  buildingLabel: string;
  diffPrefix: string;
  diffMid: string;
  flippedTo: string;
  flipWord: string;
  contradictionTitle: string;
  contradictionBody: string;
  transportLabel: string;
  stepLabel: string;
  playLabel: string;
  pauseLabel: string;
  resetLabel: string;
  speedLabel: string;
  sourceLabel: string;
  decimalLabel: string;
  binaryLabel: string;
  customLabel: string;
  reshuffleLabel: string;
  customHint: string;
  ruleLabel: string;
  swap56Label: string;
  swap56Hint: string;
  plusOneLabel: string;
  plusOneHint: string;
  binaryNote: string;
  legendLabel: string;
  legend1: string;
  legend2: string;
  legend3: string;
};

const RICH_EXPLORER: Record<Locale, ExplorerDict> = {
  en: {
    diagonalLabel: "Cantor diagonal",
    rowsWord: "rows",
    digitsWord: "digits",
    buildingLabel: "Building s · digit",
    diffPrefix: "s differs from r",
    diffMid: "in column",
    flippedTo: "flipped to",
    flipWord: "flip",
    contradictionTitle: "The contradiction",
    contradictionBody:
      " differs from every row of the listing in at least one digit, therefore it is not on the list. But s ∈ [0, 1] is a real number. Hover or focus any row to see where s disagrees with it. The listing was incomplete: ",
    transportLabel: "Transport",
    stepLabel: "Step",
    playLabel: "Play",
    pauseLabel: "Pause",
    resetLabel: "Reset",
    speedLabel: "Speed",
    sourceLabel: "Number source",
    decimalLabel: "Decimal",
    binaryLabel: "Binary",
    customLabel: "Custom",
    reshuffleLabel: "Re-shuffle the listing",
    customHint: "One decimal per line · digits after the dot are used",
    ruleLabel: "Digit-change rule",
    swap56Label: "Swap 5 ↔ 6",
    swap56Hint: "safe; never 0 or 9",
    plusOneLabel: "+1 mod 10",
    plusOneHint: "skip 0, 9 to avoid 0.999… ambiguity",
    binaryNote: "Binary mode ignores the rule above, digits flip 0 ↔ 1 automatically.",
    legendLabel: "Legend",
    legend1: "diagonal cell · used this step",
    legend2: "diagonal cell · already used",
    legend3: "digit of s (built below the table)",
  },
  de: {
    diagonalLabel: "Cantor-Diagonale",
    rowsWord: "Zeilen",
    digitsWord: "Ziffern",
    buildingLabel: "s bauen · Ziffer",
    diffPrefix: "s unterscheidet sich von r",
    diffMid: "in Spalte",
    flippedTo: "getauscht zu",
    flipWord: "tausche",
    contradictionTitle: "Der Widerspruch",
    contradictionBody:
      " unterscheidet sich von jeder Zeile der Liste in mindestens einer Ziffer, also steht es nicht auf der Liste. Aber s ∈ [0, 1] ist eine reelle Zahl. Fahr über eine Zeile oder fokussiere sie, um zu sehen, wo s ihr widerspricht. Die Liste war unvollständig: ",
    transportLabel: "Steuerung",
    stepLabel: "Schritt",
    playLabel: "Start",
    pauseLabel: "Pause",
    resetLabel: "Zurück",
    speedLabel: "Tempo",
    sourceLabel: "Zahlenquelle",
    decimalLabel: "Dezimal",
    binaryLabel: "Binär",
    customLabel: "Eigene",
    reshuffleLabel: "Liste neu mischen",
    customHint: "Eine Dezimalzahl pro Zeile · die Ziffern nach dem Komma werden genutzt",
    ruleLabel: "Ziffern-Tausch-Regel",
    swap56Label: "Tausch 5 ↔ 6",
    swap56Hint: "sicher; nie 0 oder 9",
    plusOneLabel: "+1 mod 10",
    plusOneHint: "0, 9 überspringen, gegen 0,999…-Mehrdeutigkeit",
    binaryNote: "Der Binärmodus ignoriert die Regel oben, Ziffern kippen automatisch 0 ↔ 1.",
    legendLabel: "Legende",
    legend1: "Diagonalzelle · in diesem Schritt genutzt",
    legend2: "Diagonalzelle · bereits genutzt",
    legend3: "Ziffer von s (unter der Tabelle gebaut)",
  },
  es: {
    diagonalLabel: "Diagonal de Cantor",
    rowsWord: "filas",
    digitsWord: "dígitos",
    buildingLabel: "Construyendo s · dígito",
    diffPrefix: "s difiere de r",
    diffMid: "en la columna",
    flippedTo: "cambiado a",
    flipWord: "cambiar",
    contradictionTitle: "La contradicción",
    contradictionBody:
      " difiere de cada fila de la lista en al menos un dígito, por tanto no está en la lista. Pero s ∈ [0, 1] es un número real. Pasa el ratón o enfoca cualquier fila para ver dónde s no concuerda con ella. La lista estaba incompleta: ",
    transportLabel: "Control",
    stepLabel: "Paso",
    playLabel: "Reproducir",
    pauseLabel: "Pausa",
    resetLabel: "Reiniciar",
    speedLabel: "Velocidad",
    sourceLabel: "Fuente de números",
    decimalLabel: "Decimal",
    binaryLabel: "Binario",
    customLabel: "Personal",
    reshuffleLabel: "Rebarajar la lista",
    customHint: "Un decimal por línea · se usan los dígitos tras el punto",
    ruleLabel: "Regla de cambio de dígito",
    swap56Label: "Cambiar 5 ↔ 6",
    swap56Hint: "seguro; nunca 0 ni 9",
    plusOneLabel: "+1 mod 10",
    plusOneHint: "salta 0, 9 para evitar la ambigüedad 0,999…",
    binaryNote:
      "El modo binario ignora la regla de arriba, los dígitos alternan 0 ↔ 1 automáticamente.",
    legendLabel: "Leyenda",
    legend1: "casilla diagonal · usada en este paso",
    legend2: "casilla diagonal · ya usada",
    legend3: "dígito de s (construido bajo la tabla)",
  },
  fr: {
    diagonalLabel: "Diagonale de Cantor",
    rowsWord: "lignes",
    digitsWord: "chiffres",
    buildingLabel: "Construction de s · chiffre",
    diffPrefix: "s diffère de r",
    diffMid: "en colonne",
    flippedTo: "changé en",
    flipWord: "changer",
    contradictionTitle: "La contradiction",
    contradictionBody:
      " diffère de chaque ligne de la liste par au moins un chiffre, donc il n'est pas dans la liste. Mais s ∈ [0, 1] est un nombre réel. Survole ou cible une ligne pour voir où s la contredit. La liste était incomplète : ",
    transportLabel: "Commandes",
    stepLabel: "Pas",
    playLabel: "Lecture",
    pauseLabel: "Pause",
    resetLabel: "Réinitialiser",
    speedLabel: "Vitesse",
    sourceLabel: "Source des nombres",
    decimalLabel: "Décimal",
    binaryLabel: "Binaire",
    customLabel: "Perso",
    reshuffleLabel: "Rebattre la liste",
    customHint: "Un décimal par ligne · les chiffres après la virgule sont utilisés",
    ruleLabel: "Règle de changement de chiffre",
    swap56Label: "Échange 5 ↔ 6",
    swap56Hint: "sûr ; jamais 0 ni 9",
    plusOneLabel: "+1 mod 10",
    plusOneHint: "saute 0, 9 pour éviter l'ambiguïté 0,999…",
    binaryNote:
      "Le mode binaire ignore la règle ci-dessus, les chiffres basculent 0 ↔ 1 automatiquement.",
    legendLabel: "Légende",
    legend1: "case diagonale · utilisée à ce pas",
    legend2: "case diagonale · déjà utilisée",
    legend3: "chiffre de s (construit sous le tableau)",
  },
  it: {
    diagonalLabel: "Diagonale di Cantor",
    rowsWord: "righe",
    digitsWord: "cifre",
    buildingLabel: "Costruzione di s · cifra",
    diffPrefix: "s differisce da r",
    diffMid: "nella colonna",
    flippedTo: "cambiato in",
    flipWord: "cambia",
    contradictionTitle: "La contraddizione",
    contradictionBody:
      " differisce da ogni riga della lista in almeno una cifra, quindi non è nella lista. Ma s ∈ [0, 1] è un numero reale. Passa il mouse o metti a fuoco una riga per vedere dove s la contraddice. La lista era incompleta: ",
    transportLabel: "Comandi",
    stepLabel: "Passo",
    playLabel: "Riproduci",
    pauseLabel: "Pausa",
    resetLabel: "Reimposta",
    speedLabel: "Velocità",
    sourceLabel: "Sorgente numeri",
    decimalLabel: "Decimale",
    binaryLabel: "Binario",
    customLabel: "Personale",
    reshuffleLabel: "Rimescola la lista",
    customHint: "Un decimale per riga · si usano le cifre dopo la virgola",
    ruleLabel: "Regola di cambio cifra",
    swap56Label: "Scambia 5 ↔ 6",
    swap56Hint: "sicuro; mai 0 né 9",
    plusOneLabel: "+1 mod 10",
    plusOneHint: "salta 0, 9 per evitare l'ambiguità 0,999…",
    binaryNote:
      "La modalità binaria ignora la regola sopra, le cifre passano 0 ↔ 1 automaticamente.",
    legendLabel: "Legenda",
    legend1: "cella diagonale · usata in questo passo",
    legend2: "cella diagonale · già usata",
    legend3: "cifra di s (costruita sotto la tabella)",
  },
  pt: {
    diagonalLabel: "Diagonal de Cantor",
    rowsWord: "linhas",
    digitsWord: "dígitos",
    buildingLabel: "A construir s · dígito",
    diffPrefix: "s difere de r",
    diffMid: "na coluna",
    flippedTo: "trocado para",
    flipWord: "trocar",
    contradictionTitle: "A contradição",
    contradictionBody:
      " difere de cada linha da lista em pelo menos um dígito, portanto não está na lista. Mas s ∈ [0, 1] é um número real. Passa o rato ou foca uma linha para ver onde s a contradiz. A lista estava incompleta: ",
    transportLabel: "Controlo",
    stepLabel: "Passo",
    playLabel: "Reproduzir",
    pauseLabel: "Pausa",
    resetLabel: "Reiniciar",
    speedLabel: "Velocidade",
    sourceLabel: "Fonte de números",
    decimalLabel: "Decimal",
    binaryLabel: "Binário",
    customLabel: "Personalizado",
    reshuffleLabel: "Baralhar a lista",
    customHint: "Um decimal por linha · usam-se os dígitos após o ponto",
    ruleLabel: "Regra de troca de dígito",
    swap56Label: "Trocar 5 ↔ 6",
    swap56Hint: "seguro; nunca 0 nem 9",
    plusOneLabel: "+1 mod 10",
    plusOneHint: "salta 0, 9 para evitar a ambiguidade 0,999…",
    binaryNote: "O modo binário ignora a regra acima, os dígitos alternam 0 ↔ 1 automaticamente.",
    legendLabel: "Legenda",
    legend1: "célula diagonal · usada neste passo",
    legend2: "célula diagonal · já usada",
    legend3: "dígito de s (construído sob a tabela)",
  },
  sv: {
    diagonalLabel: "Cantordiagonal",
    rowsWord: "rader",
    digitsWord: "siffror",
    buildingLabel: "Bygger s · siffra",
    diffPrefix: "s skiljer sig från r",
    diffMid: "i kolumn",
    flippedTo: "bytt till",
    flipWord: "byt",
    contradictionTitle: "Motsägelsen",
    contradictionBody:
      " skiljer sig från varje rad i listan i minst en siffra, därför står det inte på listan. Men s ∈ [0, 1] är ett reellt tal. Hovra eller fokusera en rad för att se var s avviker från den. Listan var ofullständig: ",
    transportLabel: "Kontroll",
    stepLabel: "Steg",
    playLabel: "Spela",
    pauseLabel: "Pausa",
    resetLabel: "Återställ",
    speedLabel: "Hastighet",
    sourceLabel: "Talkälla",
    decimalLabel: "Decimal",
    binaryLabel: "Binär",
    customLabel: "Egen",
    reshuffleLabel: "Blanda om listan",
    customHint: "Ett decimaltal per rad · siffrorna efter punkten används",
    ruleLabel: "Sifferbytesregel",
    swap56Label: "Byt 5 ↔ 6",
    swap56Hint: "säkert; aldrig 0 eller 9",
    plusOneLabel: "+1 mod 10",
    plusOneHint: "hoppa över 0, 9 för att undvika 0,999…-tvetydighet",
    binaryNote: "Binärläget ignorerar regeln ovan, siffror växlar 0 ↔ 1 automatiskt.",
    legendLabel: "Teckenförklaring",
    legend1: "diagonalcell · använd detta steg",
    legend2: "diagonalcell · redan använd",
    legend3: "siffra i s (byggd under tabellen)",
  },
  no: {
    diagonalLabel: "Cantordiagonal",
    rowsWord: "rader",
    digitsWord: "sifre",
    buildingLabel: "Bygger s · siffer",
    diffPrefix: "s skiller seg fra r",
    diffMid: "i kolonne",
    flippedTo: "byttet til",
    flipWord: "bytt",
    contradictionTitle: "Motsigelsen",
    contradictionBody:
      " skiller seg fra hver rad i listen i minst ett siffer, derfor står det ikke på listen. Men s ∈ [0, 1] er et reelt tall. Hold over eller fokuser en rad for å se hvor s avviker fra den. Listen var ufullstendig: ",
    transportLabel: "Kontroll",
    stepLabel: "Steg",
    playLabel: "Spill",
    pauseLabel: "Pause",
    resetLabel: "Nullstill",
    speedLabel: "Fart",
    sourceLabel: "Tallkilde",
    decimalLabel: "Desimal",
    binaryLabel: "Binær",
    customLabel: "Egen",
    reshuffleLabel: "Stokk listen på nytt",
    customHint: "Ett desimaltall per rad · sifrene etter punktumet brukes",
    ruleLabel: "Sifferbytteregel",
    swap56Label: "Bytt 5 ↔ 6",
    swap56Hint: "trygt; aldri 0 eller 9",
    plusOneLabel: "+1 mod 10",
    plusOneHint: "hopp over 0, 9 for å unngå 0,999…-tvetydighet",
    binaryNote: "Binærmodus ignorerer regelen over, sifre veksler 0 ↔ 1 automatisk.",
    legendLabel: "Tegnforklaring",
    legend1: "diagonalcelle · brukt dette steget",
    legend2: "diagonalcelle · allerede brukt",
    legend3: "siffer i s (bygd under tabellen)",
  },
};

type NumberSource = "decimal" | "binary" | "custom";
type FlipStrategy = "swap56" | "plusOne";

// Deterministic pseudo-random digit generator so re-renders during edits stay
// stable; reseeds when the user clicks "regenerate" or changes source.
function makeRng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

function buildRandomTable(
  rows: number,
  cols: number,
  source: NumberSource,
  seed: number,
): number[][] {
  const rng = makeRng(seed);
  const out: number[][] = [];
  for (let i = 0; i < rows; i++) {
    const row: number[] = [];
    for (let j = 0; j < cols; j++) {
      if (source === "binary") row.push(rng() < 0.5 ? 0 : 1);
      else row.push(Math.floor(rng() * 10));
    }
    out.push(row);
  }
  return out;
}

function parseCustomTable(
  text: string,
  rows: number,
  cols: number,
  source: NumberSource,
): number[][] {
  // Each non-empty line is interpreted as a decimal number in [0,1].
  // We take the digits after the decimal point. Missing digits are padded
  // with zeros. Extra lines beyond `rows` are ignored; missing lines are
  // padded with random rows.
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  const rng = makeRng(0xc0ffee);
  const out: number[][] = [];
  for (let i = 0; i < rows; i++) {
    const row: number[] = new Array(cols).fill(0);
    const line = lines[i];
    if (line) {
      // Extract digits after the decimal point (or just digits if no dot).
      let digitStr = "";
      const dot = line.indexOf(".");
      if (dot >= 0) {
        for (let k = dot + 1; k < line.length && digitStr.length < cols; k++) {
          const c = line.charCodeAt(k);
          if (c >= 48 && c <= 57) digitStr += line[k];
        }
      } else {
        for (let k = 0; k < line.length && digitStr.length < cols; k++) {
          const c = line.charCodeAt(k);
          if (c >= 48 && c <= 57) digitStr += line[k];
        }
      }
      for (let j = 0; j < cols; j++) {
        if (j < digitStr.length) {
          const d = digitStr.charCodeAt(j) - 48;
          row[j] = source === "binary" ? (d > 0 ? 1 : 0) : d;
        } else {
          row[j] = 0;
        }
      }
    } else {
      for (let j = 0; j < cols; j++) {
        row[j] = source === "binary" ? (rng() < 0.5 ? 0 : 1) : Math.floor(rng() * 10);
      }
    }
    out.push(row);
  }
  return out;
}

function flipDigit(d: number, strategy: FlipStrategy, source: NumberSource): number {
  if (source === "binary") return d === 0 ? 1 : 0;
  if (strategy === "swap56") {
    if (d === 5) return 6;
    if (d === 6) return 5;
    // For anything else, still produce something ≠ d that isn't 0 or 9.
    return d === 5 ? 6 : 5;
  }
  // +1 mod 10, skipping 0 and 9 (and equal-to-d)
  let next = (d + 1) % 10;
  for (let safety = 0; safety < 10; safety++) {
    if (next !== d && next !== 0 && next !== 9) return next;
    next = (next + 1) % 10;
  }
  return d === 0 ? 1 : 0;
}

export default function CantorExplorer() {
  const { a, u, locale } = useI18n();
  const topic = a.topics.cantor;
  const ex = RICH_EXPLORER[locale];

  const [source, setSource] = useState<NumberSource>("decimal");
  const [strategy, setStrategy] = useState<FlipStrategy>("swap56");
  const [customText, setCustomText] = useState<string>(
    [
      "0.31415926535897932",
      "0.27182818284590452",
      "0.14142135623730950",
      "0.16180339887498949",
      "0.69314718055994530",
      "0.57721566490153286",
      "0.91596559417721901",
      "0.20787957635076190",
      "0.66016181584686957",
      "0.26149721284764278",
      "0.28016949902386913",
      "0.30366300289873265",
      "0.35323637185499598",
      "0.41245403364312509",
      "0.48390077303618877",
      "0.56714329040978387",
    ].join("\n"),
  );
  const [seed, setSeed] = useState(1);

  const [step, setStep] = useState(0); // 0..N
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(700); // ms per step
  const [revealed, setRevealed] = useState(false);
  const [highlightRow, setHighlightRow] = useState<number>(-1);

  const table = useMemo<number[][]>(() => {
    if (source === "custom") return parseCustomTable(customText, N, N, "decimal");
    return buildRandomTable(N, N, source, seed);
  }, [source, customText, seed]);

  // Compute s digit by digit up to `step`.
  const sDigits = useMemo<number[]>(() => {
    const out: number[] = [];
    for (let i = 0; i < step; i++) {
      const d = table[i]?.[i] ?? 0;
      out.push(flipDigit(d, strategy, source));
    }
    return out;
  }, [step, table, strategy, source]);

  // Play loop
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setStep((s) => {
        if (s >= N) {
          setPlaying(false);
          setRevealed(true);
          return s;
        }
        // Reveal on the SAME tick that places the last digit (mirrors
        // stepOnce). Otherwise the contradiction panel only appears a full
        // interval later, and pausing in that window would strand it with
        // both transport buttons disabled.
        if (s + 1 >= N) {
          setRevealed(true);
          setPlaying(false);
        }
        return s + 1;
      });
    }, speed);
    return () => clearInterval(id);
  }, [playing, speed]);

  const reset = useCallback(() => {
    setStep(0);
    setPlaying(false);
    setRevealed(false);
    setHighlightRow(-1);
  }, []);

  const stepOnce = useCallback(() => {
    setStep((s) => {
      if (s >= N) {
        setRevealed(true);
        return s;
      }
      if (s + 1 >= N) setRevealed(true);
      return s + 1;
    });
  }, []);

  const regenerate = useCallback(() => {
    setSeed((x) => (x * 16807) % 2147483647 || 1);
    reset();
  }, [reset]);

  return (
    <main className="flex min-h-screen flex-col pt-14">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_420px]">
        {/* MAIN: diagonal table */}
        <div className="relative flex min-h-[60vh] flex-col gap-4 bg-ink-950 p-4 lg:min-h-[calc(100vh-3.5rem)] lg:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              {ex.diagonalLabel} · {N} {ex.rowsWord} × {N} {ex.digitsWord}
            </div>
            <div
              className={`glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}
            >
              s = 0.{sDigits.join("") || "…"}
            </div>
          </div>

          <div className="hairline flex-1 overflow-auto rounded-2xl border bg-ink-950 p-4">
            <table className="border-separate border-spacing-y-0.5 font-mono text-sm">
              <thead>
                <tr className="text-ink-400">
                  <th className="px-2 py-1 text-left text-[10px] uppercase tracking-widest">n</th>
                  <th className="px-2 py-1 text-left text-[10px] uppercase tracking-widest">rₙ</th>
                  {Array.from({ length: N }).map((_, j) => (
                    <th
                      key={j}
                      className="w-7 px-1 py-1 text-center text-[10px] uppercase tracking-widest"
                    >
                      {j + 1}
                    </th>
                  ))}
                  <th className="px-2 py-1 text-left text-[10px] uppercase tracking-widest">
                    vs s
                  </th>
                </tr>
              </thead>
              <tbody>
                {table.map((row, i) => {
                  const isPast = i < step;
                  const isCurrent = i === step - 1; // most recently flipped diagonal cell
                  const isPlanned = i === step; // next cell on deck (only visible mid-run)
                  const rowDim = i >= step ? "text-ink-300" : "text-ink-100";
                  return (
                    <tr
                      key={i}
                      className={`${rowDim} ${highlightRow === i ? "bg-signal-violet/10" : ""} ${
                        revealed
                          ? "focus:outline-none focus-visible:ring-1 focus-visible:ring-signal-violet/60"
                          : ""
                      }`}
                      // Keyboard parity for the mouse-only disagreement highlight:
                      // once revealed, each row is tabbable and focus mirrors hover.
                      tabIndex={revealed ? 0 : -1}
                      onMouseEnter={() => revealed && setHighlightRow(i)}
                      onMouseLeave={() => revealed && setHighlightRow(-1)}
                      onFocus={() => revealed && setHighlightRow(i)}
                      onBlur={() => revealed && setHighlightRow(-1)}
                    >
                      <td className="px-2 py-0.5 text-[10px] text-ink-500">{i + 1}</td>
                      <td className="px-2 py-0.5 text-[10px] text-ink-400">0.</td>
                      {row.map((d, j) => {
                        const onDiagonal = i === j;
                        let cls = "text-center px-1 py-0.5 w-7 transition-colors";
                        if (onDiagonal && isCurrent) {
                          cls += " bg-signal-amber/30 text-signal-amber rounded";
                        } else if (onDiagonal && isPast) {
                          cls += " bg-signal-amber/10 text-signal-amber rounded";
                        } else if (onDiagonal && isPlanned) {
                          cls +=
                            " bg-signal-amber/5 text-signal-amber/70 rounded ring-1 ring-signal-amber/40";
                        } else if (revealed && highlightRow === i && i === j) {
                          cls += " bg-signal-violet/30 text-signal-violet rounded";
                        }
                        return (
                          <td key={j} className={cls}>
                            {d}
                          </td>
                        );
                      })}
                      <td className="px-2 py-0.5 text-[10px] text-ink-400">
                        {isPast ? (
                          <span className={ACCENT}>
                            sₙ={sDigits[i]} ≠ {row[i]}
                          </span>
                        ) : isPlanned ? (
                          <span className="text-signal-amber/70">
                            {ex.flipWord} d{i + 1},{i + 1}
                          </span>
                        ) : (
                          <span className="text-ink-600">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Construction strip */}
          <div className="glass hairline space-y-3 rounded-2xl border p-5">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {ex.buildingLabel} {step} / {N}
            </div>
            <div className="break-all font-mono text-xl text-ink-100">
              <span className="text-ink-400">s = 0.</span>
              {sDigits.map((d, i) => (
                <span
                  key={i}
                  className={`${i === step - 1 ? "text-signal-amber" : "text-signal-violet"} ${i === step - 1 ? "animate-pulse" : ""}`}
                >
                  {d}
                </span>
              ))}
              {step < N && <span className="text-ink-600">…</span>}
            </div>
            {step > 0 && step <= N && (
              <p className="text-xs leading-relaxed text-ink-300">
                {ex.diffPrefix}
                <sub>{step}</sub> {ex.diffMid} {step}:
                <span className="text-signal-amber">
                  {" "}
                  d{step},{step} = {table[step - 1]?.[step - 1]}
                </span>
                <span className="text-ink-400"> → {ex.flippedTo} </span>
                <span className={ACCENT}>
                  s{step} = {sDigits[step - 1]}
                </span>
                .
              </p>
            )}
            {revealed && (
              <div className="rounded-md border border-signal-violet/40 bg-signal-violet/10 p-3 text-xs leading-relaxed text-ink-100">
                <div className={`mb-2 font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
                  {ex.contradictionTitle}
                </div>
                s = 0.<span className={ACCENT}>{sDigits.join("")}</span>
                {ex.contradictionBody}|ℝ| {">"} |ℕ|.
              </div>
            )}
          </div>
        </div>

        {/* SIDEBAR */}
        <aside className="hairline scrollbar-thin flex flex-col overflow-y-auto border-l bg-ink-900/40">
          <div className="hairline space-y-3 border-b p-6">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {topic.title}
            </div>
            <h1 className="math-italic text-3xl leading-tight text-ink-100">{topic.tagline}</h1>
            <p className="text-sm leading-relaxed text-ink-200">{topic.body}</p>
          </div>

          {/* Transport */}
          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {ex.transportLabel}
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={stepOnce}
                disabled={step >= N}
                className="hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-signal-violet/40 hover:text-signal-violet disabled:cursor-not-allowed disabled:opacity-30"
              >
                {ex.stepLabel}
              </button>
              <button
                onClick={() => setPlaying((p) => !p)}
                disabled={step >= N && !playing}
                className={`rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 transition-colors ${
                  playing
                    ? "border-signal-amber/60 bg-signal-amber/10 text-signal-amber"
                    : "hairline text-ink-200 hover:border-signal-violet/40 hover:text-signal-violet"
                } disabled:cursor-not-allowed disabled:opacity-30`}
              >
                {playing ? ex.pauseLabel : ex.playLabel}
              </button>
              <button
                onClick={reset}
                className="hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-signal-violet/40 hover:text-signal-violet"
              >
                {ex.resetLabel}
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest2 text-ink-400">
                <span>{ex.speedLabel}</span>
                <span>{speed} ms</span>
              </div>
              <input
                type="range"
                value={1500 - speed}
                min={0}
                max={1400}
                step={50}
                onChange={(e) => setSpeed(1500 - parseInt(e.target.value))}
                className="w-full accent-signal-violet"
                aria-label={ex.speedLabel}
              />
            </div>
          </div>

          {/* Number source */}
          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {ex.sourceLabel}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "decimal" as const, label: ex.decimalLabel },
                { id: "binary" as const, label: ex.binaryLabel },
                { id: "custom" as const, label: ex.customLabel },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setSource(opt.id);
                    reset();
                  }}
                  className={`rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 transition-colors ${
                    source === opt.id
                      ? "border-signal-violet/60 bg-signal-violet/10 text-signal-violet"
                      : "hairline text-ink-200 hover:border-signal-violet/40 hover:text-signal-violet"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {source !== "custom" ? (
              <button
                onClick={regenerate}
                className="hairline w-full rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-300 transition-colors hover:border-signal-violet/40 hover:text-signal-violet"
              >
                ↻ {ex.reshuffleLabel}
              </button>
            ) : (
              <div className="space-y-2">
                <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-400">
                  {ex.customHint}
                </div>
                <textarea
                  value={customText}
                  onChange={(e) => {
                    setCustomText(e.target.value);
                    reset();
                  }}
                  rows={8}
                  spellCheck={false}
                  aria-label={ex.customHint}
                  className="hairline w-full rounded-md border bg-ink-950 p-2 font-mono text-[11px] text-ink-100 focus:border-signal-violet/50 focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Strategy */}
          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {ex.ruleLabel}
            </div>
            <div className="grid grid-cols-1 gap-2">
              {[
                { id: "swap56" as const, label: ex.swap56Label, hint: ex.swap56Hint },
                {
                  id: "plusOne" as const,
                  label: ex.plusOneLabel,
                  hint: ex.plusOneHint,
                },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setStrategy(opt.id);
                    reset();
                  }}
                  className={`rounded-md border px-3 py-2 text-left transition-colors ${
                    strategy === opt.id
                      ? "border-signal-violet/60 bg-signal-violet/10 text-signal-violet"
                      : "hairline text-ink-200 hover:border-signal-violet/40 hover:text-signal-violet"
                  }`}
                >
                  <div className="font-mono text-xs">{opt.label}</div>
                  <div className="mt-0.5 font-mono text-[10px] text-ink-400">{opt.hint}</div>
                </button>
              ))}
            </div>
            {source === "binary" && (
              <p className="font-mono text-[10px] leading-relaxed text-ink-400">{ex.binaryNote}</p>
            )}
          </div>

          {/* Legend */}
          <div className="hairline space-y-2 border-b p-5 font-mono text-[10px] text-ink-300">
            <div className="mb-2 uppercase tracking-widest2 text-ink-400">{ex.legendLabel}</div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded bg-signal-amber/30" />
              {ex.legend1}
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded border border-signal-amber/40 bg-signal-amber/10" />
              {ex.legend2}
            </div>
            <div className="flex items-center gap-2">
              <span className={`inline-block h-3 w-3 rounded bg-signal-violet/30 ${ACCENT}`} />
              {ex.legend3}
            </div>
          </div>

          <div className="p-5">
            <Link
              href="/cantor"
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
