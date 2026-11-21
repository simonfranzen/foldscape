"use client";

import Link from "@/components/LocaleLink";
import { useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import type { Locale } from "@/lib/i18n/types";
import { ExplorerGuideSection, ExplorerHelpButton } from "@/components/ExplorerGuide";
import { STERNBROCOT_GUIDE } from "@/lib/explorer-guides/sternbrocot";

interface PathStep {
  num: number;
  den: number;
  side: "L" | "R" | null;
}

// A target is either a real number known only as a float, or a fraction that
// was typed as p/q and can therefore be compared without rounding.
interface Target {
  value: number;
  ratio: { num: number; den: number } | null;
}

function parseTarget(input: string): Target {
  const m = /^\s*(\d+)\s*\/\s*(\d+)\s*$/.exec(input);
  if (m) {
    const num = parseInt(m[1], 10);
    const den = parseInt(m[2], 10);
    // The walk compares by cross-multiplying, and every product it forms is at
    // most num · den, so this bound keeps the comparison exact.
    const exact = num > 0 && den > 0 && num * den <= Number.MAX_SAFE_INTEGER;
    return { value: num / den, ratio: exact ? { num, den } : null };
  }
  return { value: parseFloat(input.replace(",", ".")), ratio: null };
}

// Walk the Stern-Brocot tree toward `target`. `exact` reports whether the
// last fraction of the path equals the target.
function walk(target: Target, maxDepth = 64): { path: PathStep[]; exact: boolean } {
  let lo_n = 0,
    lo_d = 1; // 0/1
  let hi_n = 1,
    hi_d = 0; // 1/0 = +∞
  const out: PathStep[] = [{ num: 1, den: 1, side: null }];
  let med_n = 1,
    med_d = 1;
  // Sign of target − n/d. Fractions are compared in whole numbers: a 12-digit
  // rounding of 1/3 is a different rational, and the walk would chase it past
  // 1/3 instead of stopping there.
  const compare = (n: number, d: number): number => {
    if (target.ratio) return target.ratio.num * d - n * target.ratio.den;
    const val = n / d;
    return Math.abs(val - target.value) < 1e-15 ? 0 : target.value - val;
  };
  for (let i = 0; i < maxDepth; i++) {
    const c = compare(med_n, med_d);
    if (c === 0) break;
    if (c < 0) {
      hi_n = med_n;
      hi_d = med_d;
      out[out.length - 1].side = "L";
    } else {
      lo_n = med_n;
      lo_d = med_d;
      out[out.length - 1].side = "R";
    }
    med_n = lo_n + hi_n;
    med_d = lo_d + hi_d;
    if (!Number.isFinite(med_n) || !Number.isFinite(med_d) || med_d > 1e15) break;
    out.push({ num: med_n, den: med_d, side: null });
  }
  const last = out[out.length - 1];
  return { path: out, exact: compare(last.num, last.den) === 0 };
}

// Convert the L/R path to the continued-fraction terms [a0, a1, a2, …].
function pathToCF(path: PathStep[], reachedExactly: boolean): number[] {
  // Run-length encode the moves. Each node's `side` is the move taken from it;
  // the terminal node carries side null and contributes no move.
  const runs: number[] = [];
  let run = 0;
  let prev: "L" | "R" | null = null;
  for (const p of path) {
    if (p.side === null) break;
    if (p.side === prev) {
      run++;
    } else {
      if (prev !== null) runs.push(run);
      prev = p.side;
      run = 1;
    }
  }
  if (prev !== null) runs.push(run);
  if (runs.length === 0) return path.length > 0 ? [path[0].num] : [];

  // A walk that opens with L means the target is below 1, so a0 = 0 and the run
  // lengths encode a1, a2, … (the CF of 1/target, mirrored). Opening with R
  // gives a0 = runs[0] directly, matching the CF of a number ≥ 1.
  const opensLeft = path[0]?.side === "L";
  const terms = opensLeft ? [0, ...runs] : [...runs];

  // Landing exactly on a rational leaves the final run one short of its CF term
  // (p/q run-length is a_k − 1). Bump it so the printed expression equals the
  // target rather than falling one convergent short.
  if (reachedExactly) terms[terms.length - 1] += 1;

  return terms;
}

// Render CF terms in the canonical "a0; a1, a2, …" bracket form.
function formatCF(cf: number[]): string {
  if (cf.length === 0) return "…";
  if (cf.length === 1) return `${cf[0]}`;
  return `${cf[0]}; ${cf.slice(1).join(", ")}`;
}

// Rational presets carry the fraction itself as input, so the walk can stop on
// them; irrational ones can only be entered as rounded decimals.
const PRESETS: Array<{ id: string; label: string; value: number; input?: string }> = [
  { id: "golden", label: "φ (golden ratio)", value: (1 + Math.sqrt(5)) / 2 },
  { id: "pi", label: "π", value: Math.PI },
  { id: "e", label: "e", value: Math.E },
  { id: "sqrt2", label: "√2", value: Math.SQRT2 },
  { id: "third", label: "1/3", value: 1 / 3, input: "1/3" },
  { id: "twothirds", label: "2/3", value: 2 / 3, input: "2/3" },
  { id: "frac227", label: "22/7", value: 22 / 7, input: "22/7" },
];

// --------------------------------------------------------------------------
// Localised explorer UI. Kept local to the explorer (the repo's RICH_* pattern)
// so the shared i18n bundles stay lean.
// --------------------------------------------------------------------------

type RichExplorer = {
  targetStatus: string;
  depthStatus: string;
  pathLabel: string;
  cfLabel: string;
  convergentsLabel: string;
  stepHead: string;
  fractionHead: string;
  decimalHead: string;
  errorHead: string;
  sideHead: string;
  targetLabel: string;
  targetHint: string;
  famousLabel: string;
  depthLabel: string;
};

const RICH_EXPLORER: Record<Locale, RichExplorer> = {
  en: {
    targetStatus: "Target",
    depthStatus: "Depth",
    pathLabel: "Path · L = smaller · R = larger",
    cfLabel: "Continued fraction · run-length encoding of the path",
    convergentsLabel: "Best rational approximations · the convergents along the walk",
    stepHead: "step",
    fractionHead: "fraction",
    decimalHead: "decimal",
    errorHead: "error",
    sideHead: "side",
    targetLabel: "Target",
    targetHint: "A decimal number or a fraction such as 22/7",
    famousLabel: "Famous numbers",
    depthLabel: "Depth",
  },
  de: {
    targetStatus: "Ziel",
    depthStatus: "Tiefe",
    pathLabel: "Pfad · L = kleiner · R = größer",
    cfLabel: "Kettenbruch · Lauflängenkodierung des Pfads",
    convergentsLabel: "Beste rationale Näherungen · die Konvergenten entlang des Gangs",
    stepHead: "Schritt",
    fractionHead: "Bruch",
    decimalHead: "Dezimal",
    errorHead: "Fehler",
    sideHead: "Seite",
    targetLabel: "Zielwert",
    targetHint: "Dezimalzahl oder Bruch wie 22/7",
    famousLabel: "Berühmte Zahlen",
    depthLabel: "Tiefe",
  },
  es: {
    targetStatus: "Objetivo",
    depthStatus: "Profundidad",
    pathLabel: "Camino · L = menor · R = mayor",
    cfLabel: "Fracción continua · codificación por longitud de tiradas del camino",
    convergentsLabel: "Mejores aproximaciones racionales · los convergentes del paseo",
    stepHead: "paso",
    fractionHead: "fracción",
    decimalHead: "decimal",
    errorHead: "error",
    sideHead: "lado",
    targetLabel: "Valor objetivo",
    targetHint: "Un número decimal o una fracción como 22/7",
    famousLabel: "Números famosos",
    depthLabel: "Profundidad",
  },
  fr: {
    targetStatus: "Cible",
    depthStatus: "Profondeur",
    pathLabel: "Chemin · L = plus petit · R = plus grand",
    cfLabel: "Fraction continue · codage par plages du chemin",
    convergentsLabel:
      "Meilleures approximations rationnelles · les convergents le long de la marche",
    stepHead: "pas",
    fractionHead: "fraction",
    decimalHead: "décimal",
    errorHead: "erreur",
    sideHead: "côté",
    targetLabel: "Valeur cible",
    targetHint: "Un nombre décimal ou une fraction comme 22/7",
    famousLabel: "Nombres célèbres",
    depthLabel: "Profondeur",
  },
  it: {
    targetStatus: "Bersaglio",
    depthStatus: "Profondità",
    pathLabel: "Cammino · L = minore · R = maggiore",
    cfLabel: "Frazione continua · codifica a lunghezza di serie del cammino",
    convergentsLabel: "Migliori approssimazioni razionali · i convergenti lungo il cammino",
    stepHead: "passo",
    fractionHead: "frazione",
    decimalHead: "decimale",
    errorHead: "errore",
    sideHead: "lato",
    targetLabel: "Valore bersaglio",
    targetHint: "Un numero decimale o una frazione come 22/7",
    famousLabel: "Numeri famosi",
    depthLabel: "Profondità",
  },
  pt: {
    targetStatus: "Alvo",
    depthStatus: "Profundidade",
    pathLabel: "Caminho · L = menor · R = maior",
    cfLabel: "Fração contínua · codificação por comprimento de corridas do caminho",
    convergentsLabel: "Melhores aproximações racionais · os convergentes ao longo do passeio",
    stepHead: "passo",
    fractionHead: "fração",
    decimalHead: "decimal",
    errorHead: "erro",
    sideHead: "lado",
    targetLabel: "Valor alvo",
    targetHint: "Um número decimal ou uma fração como 22/7",
    famousLabel: "Números famosos",
    depthLabel: "Profundidade",
  },
  sv: {
    targetStatus: "Mål",
    depthStatus: "Djup",
    pathLabel: "Stig · L = mindre · R = större",
    cfLabel: "Kedjebråk · körningslängdskodning av stigen",
    convergentsLabel: "Bästa rationella approximationer · konvergenterna längs vandringen",
    stepHead: "steg",
    fractionHead: "bråk",
    decimalHead: "decimal",
    errorHead: "fel",
    sideHead: "sida",
    targetLabel: "Målvärde",
    targetHint: "Ett decimaltal eller ett bråk som 22/7",
    famousLabel: "Berömda tal",
    depthLabel: "Djup",
  },
  no: {
    targetStatus: "Mål",
    depthStatus: "Dybde",
    pathLabel: "Sti · L = mindre · R = større",
    cfLabel: "Kjedebrøk · kjørelengdekoding av stien",
    convergentsLabel: "Beste rasjonale tilnærminger · konvergentene langs vandringen",
    stepHead: "trinn",
    fractionHead: "brøk",
    decimalHead: "desimal",
    errorHead: "feil",
    sideHead: "side",
    targetLabel: "Målverdi",
    targetHint: "Et desimaltall eller en brøk som 22/7",
    famousLabel: "Berømte tall",
    depthLabel: "Dybde",
  },
};

export default function SternbrocotExplorer() {
  const { a, u, locale } = useI18n();
  const topic = a.topics.sternbrocot;
  const rx = RICH_EXPLORER[locale];

  const [input, setInput] = useState<string>(((1 + Math.sqrt(5)) / 2).toFixed(8));
  const [depth, setDepth] = useState(20);

  const target = useMemo(() => parseTarget(input), [input]);
  const { path, exact } = useMemo(
    () =>
      Number.isFinite(target.value) && target.value > 0
        ? walk(target, depth)
        : { path: [], exact: false },
    [target, depth],
  );
  const cf = useMemo(() => pathToCF(path, exact), [path, exact]);

  return (
    <main className="flex min-h-screen flex-col pt-14">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_420px]">
        <div className="scrollbar-thin relative min-h-[60vh] overflow-y-auto bg-ink-950 p-4 lg:min-h-[calc(100vh-3.5rem)] lg:p-6">
          <div className="mx-auto max-w-3xl space-y-6">
            <div className="flex items-center justify-between gap-3">
              <div className="glass hairline rounded-md border px-4 py-3 font-mono text-xs text-ink-200">
                {rx.targetStatus}:{" "}
                <span className="text-signal-teal">
                  {target.ratio
                    ? `${target.ratio.num}/${target.ratio.den} ≈ ${target.value.toFixed(12)}`
                    : Number.isFinite(target.value)
                      ? target.value.toFixed(12)
                      : "…"}
                </span>
                <span className="mx-3 text-ink-500">·</span>
                {rx.depthStatus}: <span className="text-signal-teal">{path.length}</span>
              </div>
              <ExplorerHelpButton guide={STERNBROCOT_GUIDE} />
            </div>

            <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-5">
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-teal">
                {rx.pathLabel}
              </div>
              <div className="break-all font-mono text-sm leading-relaxed text-ink-100">
                {path.map((p) => p.side ?? "·").join("")}
              </div>
            </div>

            <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-5">
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-teal">
                {rx.cfLabel}
              </div>
              <div className="font-mono text-lg text-signal-amber">[{formatCF(cf)}]</div>
              <div className="font-mono text-[11px] leading-relaxed text-ink-400">
                = {cf.length > 0 ? cfExpr(cf) : "…"}
              </div>
            </div>

            <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-5">
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-teal">
                {rx.convergentsLabel}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full font-mono text-xs">
                  <thead className="hairline border-b text-ink-300">
                    <tr>
                      <th className="px-2 py-2 text-left text-[10px] uppercase tracking-widest">
                        {rx.stepHead}
                      </th>
                      <th className="px-2 py-2 text-left text-[10px] uppercase tracking-widest">
                        {rx.fractionHead}
                      </th>
                      <th className="px-2 py-2 text-left text-[10px] uppercase tracking-widest">
                        {rx.decimalHead}
                      </th>
                      <th className="px-2 py-2 text-left text-[10px] uppercase tracking-widest">
                        {rx.errorHead}
                      </th>
                      <th className="px-2 py-2 text-left text-[10px] uppercase tracking-widest">
                        {rx.sideHead}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {path.map((p, i) => {
                      const value = p.num / p.den;
                      const err = Math.abs(value - target.value);
                      const step = i + 1;
                      return (
                        <tr key={i} className="border-b border-ink-700/30 last:border-0">
                          <td className="px-2 py-1.5 text-ink-400">{step}</td>
                          <td className="px-2 py-1.5 text-signal-teal">
                            {p.num}/{p.den}
                          </td>
                          <td className="px-2 py-1.5 text-ink-200">{value.toFixed(10)}</td>
                          <td className="px-2 py-1.5 text-ink-300">{err.toExponential(2)}</td>
                          <td className="px-2 py-1.5 text-signal-amber">{p.side ?? "·"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <aside className="hairline scrollbar-thin flex flex-col overflow-y-auto border-l bg-ink-900/40">
          <div className="hairline space-y-3 border-b p-6">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-teal">
              {topic.title}
            </div>
            <h1 className="math-italic text-3xl leading-tight text-ink-100">{topic.tagline}</h1>
            <p className="text-sm leading-relaxed text-ink-200">{topic.body}</p>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {rx.targetLabel}
            </div>
            <input
              type="text"
              inputMode="decimal"
              value={input}
              aria-label={rx.targetLabel}
              onChange={(e) => setInput(e.target.value)}
              className="hairline w-full rounded-md border bg-ink-950 px-3 py-2 font-mono text-sm text-signal-teal"
            />
            <p className="text-xs leading-relaxed text-ink-400">{rx.targetHint}</p>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {rx.famousLabel}
            </div>
            <div className="grid grid-cols-1 gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setInput(p.input ?? p.value.toFixed(12))}
                  className="hairline rounded-md border px-3 py-2 text-left text-ink-200 transition-colors hover:border-signal-teal/40 hover:text-signal-teal"
                >
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span>{p.label}</span>
                    <span className="text-ink-400">{p.value.toFixed(6)}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="flex items-baseline justify-between">
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                {rx.depthLabel}
              </div>
              <div className="font-mono text-[10px] text-ink-400">{depth}</div>
            </div>
            <input
              type="range"
              value={depth}
              min={4}
              max={60}
              step={1}
              aria-label={rx.depthLabel}
              onChange={(e) => setDepth(parseInt(e.target.value))}
              className="w-full accent-signal-teal"
            />
          </div>

          <div className="p-5">
            <Link
              href="/"
              className="hairline block w-full rounded-md border py-2 text-center font-mono text-[10px] uppercase tracking-widest2 text-ink-300 transition-colors hover:border-signal-teal/40 hover:text-signal-teal"
            >
              {u.back}
            </Link>
          </div>
        </aside>
      </div>
      <ExplorerGuideSection guide={STERNBROCOT_GUIDE} storyHref="/sternbrocot" />
    </main>
  );
}

function cfExpr(cf: number[]): string {
  // Build "a0 + 1 / (a1 + 1 / (a2 + …))"
  if (cf.length === 0) return "";
  let s = cf[cf.length - 1].toString();
  for (let i = cf.length - 2; i >= 0; i--) {
    s = `${cf[i]} + 1/(${s})`;
  }
  return s;
}
