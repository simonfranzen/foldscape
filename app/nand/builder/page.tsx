"use client";

import Link from "next/link";
import { useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import type { Locale } from "@/lib/i18n/types";

// All gates expressed in terms of NAND.
const GATES: Record<
  string,
  {
    label: string;
    accent: string;
    // Active-output tint. Tailwind cannot alpha-modify `currentColor`
    // (`bg-current/10` compiles to nothing), so each gate names its own bg.
    bgActive: string;
    formula: string;
    eval: (a: number, b: number) => number;
    // Wiring: each entry is an intermediate NAND with its two inputs
    // referenced symbolically (a, b, n0, n1 …). The final output is the
    // result of the last entry.
    wires: Array<{ name: string; left: string; right: string }>;
  }
> = {
  NAND: {
    label: "NAND",
    accent: "text-signal-violet",
    bgActive: "bg-signal-violet/10",
    formula: "a ↑ b",
    eval: (a, b) => (a && b ? 0 : 1),
    wires: [{ name: "n0", left: "a", right: "b" }],
  },
  NOT: {
    label: "NOT a",
    accent: "text-signal-cyan",
    bgActive: "bg-signal-cyan/10",
    formula: "a ↑ a",
    eval: (a) => (a ? 0 : 1),
    wires: [{ name: "n0", left: "a", right: "a" }],
  },
  AND: {
    label: "AND",
    accent: "text-signal-amber",
    bgActive: "bg-signal-amber/10",
    formula: "(a ↑ b) ↑ (a ↑ b)",
    eval: (a, b) => (a && b ? 1 : 0),
    wires: [
      { name: "n0", left: "a", right: "b" },
      { name: "n1", left: "n0", right: "n0" },
    ],
  },
  OR: {
    label: "OR",
    accent: "text-signal-rose",
    bgActive: "bg-signal-rose/10",
    formula: "(a ↑ a) ↑ (b ↑ b)",
    eval: (a, b) => (a || b ? 1 : 0),
    wires: [
      { name: "n0", left: "a", right: "a" },
      { name: "n1", left: "b", right: "b" },
      { name: "n2", left: "n0", right: "n1" },
    ],
  },
  XOR: {
    label: "XOR",
    accent: "text-signal-violet",
    bgActive: "bg-signal-violet/10",
    formula: "(a ↑ (a ↑ b)) ↑ (b ↑ (a ↑ b))",
    eval: (a, b) => (a !== b ? 1 : 0),
    wires: [
      { name: "n0", left: "a", right: "b" },
      { name: "n1", left: "a", right: "n0" },
      { name: "n2", left: "b", right: "n0" },
      { name: "n3", left: "n1", right: "n2" },
    ],
  },
};

const ORDER = ["NAND", "NOT", "AND", "OR", "XOR"];

// Per-locale room strings. The builder room previously rendered every label in
// English; these mirror the localized copy the story page already ships.
type ExplorerStrings = {
  descriptions: Record<string, string>;
  inputs: string;
  output: string;
  internalNands: string;
  chooseGate: string;
  truthTable: string;
  rowHint: string;
  inputAria: (label: string) => string;
};

const RICH_EXPLORER: Record<Locale, ExplorerStrings> = {
  en: {
    descriptions: {
      NAND: "The primitive itself. 1 unless both inputs are 1.",
      NOT: "Both inputs of one NAND wired to the same signal.",
      AND: "Two NANDs in series: NAND, then NOT the result.",
      OR: "Invert each input, then NAND the inversions (De Morgan).",
      XOR: "Four NANDs, the canonical XOR construction.",
    },
    inputs: "Inputs",
    output: "Output",
    internalNands: "Internal NANDs",
    chooseGate: "Choose a gate",
    truthTable: "Truth table",
    rowHint: "The current input row is highlighted.",
    inputAria: (label) => `input ${label}`,
  },
  de: {
    descriptions: {
      NAND: "Das Primitiv selbst. 1, außer wenn beide Eingänge 1 sind.",
      NOT: "Beide Eingänge eines NAND auf dasselbe Signal gelegt.",
      AND: "Zwei NANDs in Reihe: NAND, dann das Ergebnis negieren.",
      OR: "Jeden Eingang invertieren, dann die Inversionen per NAND verknüpfen (De Morgan).",
      XOR: "Vier NANDs, die kanonische XOR-Konstruktion.",
    },
    inputs: "Eingänge",
    output: "Ausgang",
    internalNands: "Interne NANDs",
    chooseGate: "Gatter wählen",
    truthTable: "Wahrheitstabelle",
    rowHint: "Die aktuelle Eingabezeile ist hervorgehoben.",
    inputAria: (label) => `Eingang ${label}`,
  },
  es: {
    descriptions: {
      NAND: "El primitivo en sí. 1 salvo cuando ambas entradas son 1.",
      NOT: "Ambas entradas de un NAND conectadas a la misma señal.",
      AND: "Dos NAND en serie: NAND y luego negar el resultado.",
      OR: "Invertir cada entrada y luego combinarlas con un NAND (De Morgan).",
      XOR: "Cuatro NAND, la construcción canónica de XOR.",
    },
    inputs: "Entradas",
    output: "Salida",
    internalNands: "NAND internos",
    chooseGate: "Elige una puerta",
    truthTable: "Tabla de verdad",
    rowHint: "La fila de entrada actual está resaltada.",
    inputAria: (label) => `entrada ${label}`,
  },
  fr: {
    descriptions: {
      NAND: "La primitive elle-même. 1 sauf quand les deux entrées valent 1.",
      NOT: "Les deux entrées d'un NAND reliées au même signal.",
      AND: "Deux NAND en série : NAND, puis négation du résultat.",
      OR: "Inverser chaque entrée, puis combiner les inversions par un NAND (De Morgan).",
      XOR: "Quatre NAND, la construction canonique du XOR.",
    },
    inputs: "Entrées",
    output: "Sortie",
    internalNands: "NAND internes",
    chooseGate: "Choisis une porte",
    truthTable: "Table de vérité",
    rowHint: "La ligne d'entrée actuelle est surlignée.",
    inputAria: (label) => `entrée ${label}`,
  },
  it: {
    descriptions: {
      NAND: "La primitiva stessa. 1 tranne quando entrambi gli ingressi sono 1.",
      NOT: "Entrambi gli ingressi di un NAND collegati allo stesso segnale.",
      AND: "Due NAND in serie: NAND, poi negare il risultato.",
      OR: "Invertire ogni ingresso, poi combinare le inversioni con un NAND (De Morgan).",
      XOR: "Quattro NAND, la costruzione canonica dello XOR.",
    },
    inputs: "Ingressi",
    output: "Uscita",
    internalNands: "NAND interni",
    chooseGate: "Scegli una porta",
    truthTable: "Tabella di verità",
    rowHint: "La riga di ingresso corrente è evidenziata.",
    inputAria: (label) => `ingresso ${label}`,
  },
  pt: {
    descriptions: {
      NAND: "A primitiva em si. 1 exceto quando ambas as entradas são 1.",
      NOT: "Ambas as entradas de um NAND ligadas ao mesmo sinal.",
      AND: "Dois NAND em série: NAND e depois negar o resultado.",
      OR: "Inverter cada entrada e depois combinar as inversões com um NAND (De Morgan).",
      XOR: "Quatro NAND, a construção canónica do XOR.",
    },
    inputs: "Entradas",
    output: "Saída",
    internalNands: "NAND internos",
    chooseGate: "Escolhe uma porta",
    truthTable: "Tabela de verdade",
    rowHint: "A linha de entrada atual está destacada.",
    inputAria: (label) => `entrada ${label}`,
  },
  sv: {
    descriptions: {
      NAND: "Själva primitiven. 1 utom när båda ingångarna är 1.",
      NOT: "Båda ingångarna på en NAND kopplade till samma signal.",
      AND: "Två NAND i serie: NAND, sedan negera resultatet.",
      OR: "Invertera varje ingång, koppla sedan inversionerna genom en NAND (De Morgan).",
      XOR: "Fyra NAND, den kanoniska XOR-konstruktionen.",
    },
    inputs: "Ingångar",
    output: "Utgång",
    internalNands: "Interna NAND",
    chooseGate: "Välj en grind",
    truthTable: "Sanningstabell",
    rowHint: "Den aktuella ingångsraden är markerad.",
    inputAria: (label) => `ingång ${label}`,
  },
  no: {
    descriptions: {
      NAND: "Selve primitiven. 1 bortsett fra når begge inngangene er 1.",
      NOT: "Begge inngangene på en NAND koblet til samme signal.",
      AND: "To NAND i serie: NAND, deretter negere resultatet.",
      OR: "Inverter hver inngang, koble så inversjonene gjennom en NAND (De Morgan).",
      XOR: "Fire NAND, den kanoniske XOR-konstruksjonen.",
    },
    inputs: "Innganger",
    output: "Utgang",
    internalNands: "Interne NAND",
    chooseGate: "Velg en port",
    truthTable: "Sannhetstabell",
    rowHint: "Den gjeldende inngangsraden er uthevet.",
    inputAria: (label) => `inngang ${label}`,
  },
};

function evalWires(
  wires: Array<{ name: string; left: string; right: string }>,
  a: number,
  b: number,
): Record<string, number> {
  const vals: Record<string, number> = { a, b };
  for (const w of wires) {
    const l = vals[w.left];
    const r = vals[w.right];
    vals[w.name] = l && r ? 0 : 1;
  }
  return vals;
}

export default function NandBuilder() {
  const { a: atlas, u, locale } = useI18n();
  const topic = atlas.topics.nand;
  const strings = RICH_EXPLORER[locale];
  const [gate, setGate] = useState<keyof typeof GATES>("NAND");
  const [aBit, setABit] = useState(0);
  const [bBit, setBBit] = useState(0);

  const G = GATES[gate];
  const truth = [
    { a: 0, b: 0 },
    { a: 0, b: 1 },
    { a: 1, b: 0 },
    { a: 1, b: 1 },
  ].map((row) => ({ ...row, out: G.eval(row.a, row.b) }));
  const wireVals = evalWires(G.wires, aBit, bBit);
  const output = wireVals[G.wires[G.wires.length - 1].name];
  const nandCount = G.wires.length;

  return (
    <main className="flex min-h-screen flex-col pt-14">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_420px]">
        <div className="relative flex min-h-[60vh] flex-col space-y-8 bg-ink-950 p-8 lg:min-h-[calc(100vh-3.5rem)] lg:p-12">
          {/* Top HUD */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              gate · <span className={G.accent}>{G.label}</span> · {nandCount} NAND
              {nandCount > 1 ? "s" : ""}
            </div>
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-violet">
              {G.formula}
            </div>
          </div>

          {/* Big output display */}
          <div className="flex flex-1 flex-col items-center justify-center gap-8">
            <div className="space-y-2 text-center">
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                {strings.inputs}
              </div>
              <div className="flex items-center justify-center gap-6">
                <BitButton
                  label="a"
                  value={aBit}
                  onChange={setABit}
                  ariaLabel={strings.inputAria("a")}
                />
                <BitButton
                  label="b"
                  value={bBit}
                  onChange={setBBit}
                  ariaLabel={strings.inputAria("b")}
                />
              </div>
            </div>

            <div className="text-7xl text-ink-300">⇣</div>

            <div className="space-y-2 text-center">
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                {strings.output}
              </div>
              <div
                className={`math-italic flex h-24 w-24 items-center justify-center rounded-full border-2 text-5xl transition-colors ${
                  output
                    ? `${G.accent} ${G.bgActive} border-current`
                    : "border-ink-300/30 text-ink-200"
                }`}
                style={output ? { boxShadow: `0 0 40px 4px currentColor` } : undefined}
              >
                {output}
              </div>
            </div>

            {/* Intermediate wires */}
            {G.wires.length > 1 && (
              <div className="hairline w-full max-w-md space-y-2 rounded-2xl border bg-ink-950/40 p-4">
                <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                  {strings.internalNands}
                </div>
                <div className="space-y-1.5">
                  {G.wires.map((w) => (
                    <div
                      key={w.name}
                      className="flex items-center justify-between font-mono text-xs"
                    >
                      <span className="text-ink-200">
                        {w.name} = {w.left} ↑ {w.right}
                      </span>
                      <span className={wireVals[w.name] ? G.accent : "text-ink-400"}>
                        {wireVals[w.name]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
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

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {strings.chooseGate}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {ORDER.map((k) => {
                const g = GATES[k];
                const active = gate === k;
                return (
                  <button
                    key={k}
                    onClick={() => setGate(k as keyof typeof GATES)}
                    className={`rounded-md border p-3 text-left transition-colors ${
                      active
                        ? "border-signal-violet/60 bg-signal-violet/10"
                        : "hairline text-ink-200 hover:border-signal-violet/40 hover:text-ink-100"
                    }`}
                  >
                    <div className={`text-sm ${active ? g.accent : "text-ink-100"}`}>{g.label}</div>
                    <div className="mt-0.5 font-mono text-[10px] text-ink-400">
                      {g.wires.length} NAND{g.wires.length > 1 ? "s" : ""}
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="hairline border-t pt-2 text-xs leading-relaxed text-ink-300">
              {strings.descriptions[gate]}
            </p>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {strings.truthTable} · {G.label}
            </div>
            <table className="w-full text-center font-mono">
              <thead className="hairline border-b text-ink-300">
                <tr>
                  <th className="py-1 text-[11px]">a</th>
                  <th className="py-1 text-[11px]">b</th>
                  <th className={`py-1 text-[11px] ${G.accent}`}>out</th>
                </tr>
              </thead>
              <tbody className="text-sm text-ink-100">
                {truth.map((r, i) => {
                  const here = r.a === aBit && r.b === bBit;
                  return (
                    <tr
                      key={i}
                      className={`border-b border-ink-700/30 last:border-0 ${here ? "bg-signal-violet/5" : ""}`}
                    >
                      <td className="py-2">{r.a}</td>
                      <td className="py-2">{r.b}</td>
                      <td className={`py-2 ${r.out ? G.accent : "text-ink-400"}`}>{r.out}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className="text-[11px] text-ink-400">{strings.rowHint}</p>
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

function BitButton({
  label,
  value,
  onChange,
  ariaLabel,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  ariaLabel: string;
}) {
  return (
    <div className="space-y-2 text-center">
      <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">{label}</div>
      <button
        aria-label={ariaLabel}
        aria-pressed={value === 1}
        onClick={() => onChange(value ? 0 : 1)}
        className={`math-italic flex h-20 w-20 items-center justify-center rounded-full border-2 text-5xl transition-colors ${
          value
            ? "border-signal-amber/60 bg-signal-amber/10 text-signal-amber"
            : "border-ink-300/30 bg-ink-950 text-ink-300"
        }`}
        style={value ? { boxShadow: "0 0 30px 2px rgba(255,209,102,0.5)" } : undefined}
      >
        {value}
      </button>
    </div>
  );
}
