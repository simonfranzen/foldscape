"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { Info } from "@/components/Info";
import { useDpr } from "@/lib/hooks/useDpr";
import { palette } from "@/lib/visual/palette";
import type { Locale } from "@/lib/i18n/types";

const WIDTH = 240;
const HEIGHT = 360;

type Seed = "single" | "random" | "edge";

const FAMOUS_RULES: Array<{ rule: number; label: string }> = [
  { rule: 110, label: "Rule 110" },
  { rule: 30, label: "Rule 30" },
  { rule: 90, label: "Rule 90" },
  { rule: 184, label: "Rule 184" },
  { rule: 54, label: "Rule 54" },
  { rule: 73, label: "Rule 73" },
  { rule: 150, label: "Rule 150" },
  { rule: 22, label: "Rule 22" },
];

// Local per-locale UI copy for the simulator room. The atlas card (title/
// tagline/body) and the shared control labels still come from a.* / u.life.*;
// everything below is authored here so the whole panel reads in one language.
type ExplorerCopy = {
  famousRules: string;
  famousInfo: string;
  customRule: string;
  seed: string;
  seedSingle: string;
  seedEdge: string;
  seedRandom: string;
  ruleFormula: string;
  hudAutomaton: string;
  cellsLabel: string;
  hudFlow: string;
  canvasAria: string;
  ruleSliderAria: string;
  speedSliderAria: string;
  notes: Record<number, string>;
};

const RICH_EXPLORER: Record<Locale, ExplorerCopy> = {
  en: {
    famousRules: "Famous rules",
    famousInfo:
      "Out of 256 elementary rules, only a handful produce non-trivial behaviour. These eight are the most discussed.",
    customRule: "Custom rule",
    seed: "Seed",
    seedSingle: "single",
    seedEdge: "edge",
    seedRandom: "random",
    ruleFormula: "rule N · bit k of N = next state of pattern k",
    hudAutomaton: "elementary CA",
    cellsLabel: "cells",
    hudFlow: "toroidal · time flows downward",
    canvasAria: "Elementary cellular automaton, rule {r}",
    ruleSliderAria: "Rule number 0 to 255",
    speedSliderAria: "Speed in generations per second",
    notes: {
      110: "Turing-complete (Cook)",
      30: "Chaotic, used as RNG",
      90: "Sierpiński triangle",
      184: "Traffic flow model",
      54: "Class IV, local structures",
      73: "Strange small-scale order",
      150: "XOR, perfect symmetry",
      22: "Aperiodic, class III",
    },
  },
  de: {
    famousRules: "Berühmte Regeln",
    famousInfo:
      "Von 256 elementaren Regeln erzeugt nur eine Handvoll nicht-triviales Verhalten. Diese acht werden am meisten diskutiert.",
    customRule: "Eigene Regel",
    seed: "Saat",
    seedSingle: "einzeln",
    seedEdge: "Rand",
    seedRandom: "zufällig",
    ruleFormula: "Regel N · Bit k von N = nächster Zustand von Muster k",
    hudAutomaton: "elementarer CA",
    cellsLabel: "Zellen",
    hudFlow: "toroidal · Zeit fließt nach unten",
    canvasAria: "Elementarer Zellularautomat, Regel {r}",
    ruleSliderAria: "Regelnummer 0 bis 255",
    speedSliderAria: "Geschwindigkeit in Generationen pro Sekunde",
    notes: {
      110: "Turing-vollständig (Cook)",
      30: "Chaotisch, als RNG genutzt",
      90: "Sierpiński-Dreieck",
      184: "Verkehrsflussmodell",
      54: "Klasse IV, lokale Strukturen",
      73: "Seltsame kleinräumige Ordnung",
      150: "XOR, perfekte Symmetrie",
      22: "Aperiodisch, Klasse III",
    },
  },
  es: {
    famousRules: "Reglas célebres",
    famousInfo:
      "De las 256 reglas elementales, solo un puñado produce comportamiento no trivial. Estas ocho son las más discutidas.",
    customRule: "Regla personalizada",
    seed: "Semilla",
    seedSingle: "única",
    seedEdge: "borde",
    seedRandom: "aleatoria",
    ruleFormula: "regla N · bit k de N = siguiente estado del patrón k",
    hudAutomaton: "CA elemental",
    cellsLabel: "celdas",
    hudFlow: "toroidal · el tiempo fluye hacia abajo",
    canvasAria: "Autómata celular elemental, regla {r}",
    ruleSliderAria: "Número de regla 0 a 255",
    speedSliderAria: "Velocidad en generaciones por segundo",
    notes: {
      110: "Turing-completa (Cook)",
      30: "Caótica, usada como RNG",
      90: "Triángulo de Sierpiński",
      184: "Modelo de flujo de tráfico",
      54: "Clase IV, estructuras locales",
      73: "Orden extraño a pequeña escala",
      150: "XOR, simetría perfecta",
      22: "Aperiódica, clase III",
    },
  },
  fr: {
    famousRules: "Règles célèbres",
    famousInfo:
      "Sur 256 règles élémentaires, seule une poignée produit un comportement non trivial. Ces huit sont les plus discutées.",
    customRule: "Règle personnalisée",
    seed: "Graine",
    seedSingle: "unique",
    seedEdge: "bord",
    seedRandom: "aléatoire",
    ruleFormula: "règle N · bit k de N = état suivant du motif k",
    hudAutomaton: "CA élémentaire",
    cellsLabel: "cellules",
    hudFlow: "toroïdal · le temps s'écoule vers le bas",
    canvasAria: "Automate cellulaire élémentaire, règle {r}",
    ruleSliderAria: "Numéro de règle 0 à 255",
    speedSliderAria: "Vitesse en générations par seconde",
    notes: {
      110: "Turing-complète (Cook)",
      30: "Chaotique, utilisée comme RNG",
      90: "Triangle de Sierpiński",
      184: "Modèle de flux de trafic",
      54: "Classe IV, structures locales",
      73: "Ordre étrange à petite échelle",
      150: "XOR, symétrie parfaite",
      22: "Apériodique, classe III",
    },
  },
  it: {
    famousRules: "Regole celebri",
    famousInfo:
      "Delle 256 regole elementari, solo una manciata produce comportamento non banale. Queste otto sono le più discusse.",
    customRule: "Regola personalizzata",
    seed: "Seme",
    seedSingle: "singola",
    seedEdge: "bordo",
    seedRandom: "casuale",
    ruleFormula: "regola N · bit k di N = stato successivo del motivo k",
    hudAutomaton: "CA elementare",
    cellsLabel: "celle",
    hudFlow: "toroidale · il tempo scorre verso il basso",
    canvasAria: "Automa cellulare elementare, regola {r}",
    ruleSliderAria: "Numero di regola da 0 a 255",
    speedSliderAria: "Velocità in generazioni al secondo",
    notes: {
      110: "Turing-completa (Cook)",
      30: "Caotica, usata come RNG",
      90: "Triangolo di Sierpiński",
      184: "Modello di flusso del traffico",
      54: "Classe IV, strutture locali",
      73: "Strano ordine su piccola scala",
      150: "XOR, simmetria perfetta",
      22: "Aperiodica, classe III",
    },
  },
  pt: {
    famousRules: "Regras célebres",
    famousInfo:
      "Das 256 regras elementares, apenas um punhado produz comportamento não trivial. Estas oito são as mais discutidas.",
    customRule: "Regra personalizada",
    seed: "Semente",
    seedSingle: "única",
    seedEdge: "borda",
    seedRandom: "aleatória",
    ruleFormula: "regra N · bit k de N = próximo estado do padrão k",
    hudAutomaton: "AC elementar",
    cellsLabel: "células",
    hudFlow: "toroidal · o tempo flui para baixo",
    canvasAria: "Autómato celular elementar, regra {r}",
    ruleSliderAria: "Número da regra 0 a 255",
    speedSliderAria: "Velocidade em gerações por segundo",
    notes: {
      110: "Turing-completa (Cook)",
      30: "Caótica, usada como RNG",
      90: "Triângulo de Sierpiński",
      184: "Modelo de fluxo de tráfego",
      54: "Classe IV, estruturas locais",
      73: "Ordem estranha à pequena escala",
      150: "XOR, simetria perfeita",
      22: "Aperiódica, classe III",
    },
  },
  sv: {
    famousRules: "Berömda regler",
    famousInfo:
      "Av 256 elementära regler ger bara en handfull icke-trivialt beteende. Dessa åtta diskuteras mest.",
    customRule: "Egen regel",
    seed: "Frö",
    seedSingle: "enkel",
    seedEdge: "kant",
    seedRandom: "slumpmässig",
    ruleFormula: "regel N · bit k av N = nästa tillstånd för mönster k",
    hudAutomaton: "elementär CA",
    cellsLabel: "celler",
    hudFlow: "toroidal · tiden flödar nedåt",
    canvasAria: "Elementär cellulär automat, regel {r}",
    ruleSliderAria: "Regelnummer 0 till 255",
    speedSliderAria: "Hastighet i generationer per sekund",
    notes: {
      110: "Turing-komplett (Cook)",
      30: "Kaotisk, används som RNG",
      90: "Sierpiński-triangel",
      184: "Trafikflödesmodell",
      54: "Klass IV, lokala strukturer",
      73: "Märklig ordning i liten skala",
      150: "XOR, perfekt symmetri",
      22: "Aperiodisk, klass III",
    },
  },
  no: {
    famousRules: "Berømte regler",
    famousInfo:
      "Av 256 elementære regler gir bare en håndfull ikke-triviell oppførsel. Disse åtte diskuteres mest.",
    customRule: "Egen regel",
    seed: "Frø",
    seedSingle: "enkel",
    seedEdge: "kant",
    seedRandom: "tilfeldig",
    ruleFormula: "regel N · bit k av N = neste tilstand for mønster k",
    hudAutomaton: "elementær CA",
    cellsLabel: "celler",
    hudFlow: "toroidal · tiden flyter nedover",
    canvasAria: "Elementær cellulær automat, regel {r}",
    ruleSliderAria: "Regelnummer 0 til 255",
    speedSliderAria: "Hastighet i generasjoner per sekund",
    notes: {
      110: "Turing-komplett (Cook)",
      30: "Kaotisk, brukt som RNG",
      90: "Sierpiński-trekant",
      184: "Trafikkflytmodell",
      54: "Klasse IV, lokale strukturer",
      73: "Merkelig orden i liten skala",
      150: "XOR, perfekt symmetri",
      22: "Aperiodisk, klasse III",
    },
  },
};

function seedRow(width: number, kind: Seed): Uint8Array {
  const row = new Uint8Array(width);
  if (kind === "single") row[Math.floor(width / 2)] = 1;
  else if (kind === "edge") row[width - 2] = 1;
  else for (let i = 0; i < width; i++) row[i] = Math.random() < 0.45 ? 1 : 0;
  return row;
}

function step(row: Uint8Array, rule: number): Uint8Array {
  const n = row.length;
  const next = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    const l = row[(i - 1 + n) % n];
    const c = row[i];
    const r = row[(i + 1) % n];
    const key = (l << 2) | (c << 1) | r;
    next[i] = (rule >> key) & 1;
  }
  return next;
}

export default function Rule110Simulator() {
  const { a, u, locale } = useI18n();
  const topic = a.topics.rule110;
  const ex = RICH_EXPLORER[locale];
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dpr = useDpr();
  const [rule, setRule] = useState(110);
  const [seed, setSeed] = useState<Seed>("single");
  const [running, setRunning] = useState(true);
  const [speed, setSpeed] = useState(20);
  const [colourKey, setColourKey] = useState<"cyan" | "violet" | "amber" | "rose">("cyan");
  const [generation, setGeneration] = useState(0);

  // grid is stored as rolling rows of size HEIGHT, but each frame we redraw
  // the whole canvas from the current rolling buffer.
  const gridRef = useRef<Uint8Array[]>([]);
  const lastRef = useRef<number>(0);
  const accRef = useRef<number>(0);

  const reset = () => {
    gridRef.current = [seedRow(WIDTH, seed)];
    setGeneration(0);
  };

  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed]);

  // Honour prefers-reduced-motion: don't autoplay on load. Applied in an effect
  // (not the initial state) so server and client first render agree on hydration.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRunning(false);
    }
  }, []);

  // Paint the current rolling buffer. Floor the backing-store size so it never
  // mismatches the CSS box on fractional-DPR displays (which would reallocate
  // the canvas every frame).
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = Math.floor(canvas.clientWidth * dpr);
    const H = Math.floor(canvas.clientHeight * dpr);
    if (W < 4 || H < 4) return;
    if (canvas.width !== W || canvas.height !== H) {
      canvas.width = W;
      canvas.height = H;
    }
    const colour = {
      cyan: palette.signal.cyan,
      violet: palette.signal.violet,
      amber: palette.signal.amber,
      rose: palette.signal.rose,
    }[colourKey];
    const grid = gridRef.current;
    const cellW = W / WIDTH;
    const cellH = H / HEIGHT;
    ctx.fillStyle = palette.ink[950];
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = colour;
    const rows = grid.length;
    const offY = (HEIGHT - rows) * cellH;
    for (let y = 0; y < rows; y++) {
      const row = grid[y];
      const yPx = offY + y * cellH;
      for (let x = 0; x < WIDTH; x++) {
        if (row[x]) {
          ctx.fillRect(x * cellW, yPx, cellW + 0.5, cellH + 0.5);
        }
      }
    }
  }, [colourKey, dpr]);

  // Animation: only spins the rAF loop while running, so a paused (incl.
  // reduced-motion) simulator sits idle instead of redrawing 60x a second.
  useEffect(() => {
    if (!running) {
      draw();
      return;
    }
    let raf = 0;
    const tick = (now: number) => {
      accRef.current += (now - lastRef.current) / 1000;
      lastRef.current = now;
      const dt = 1 / speed;
      // Count every generation appended this frame; the HUD counter must track
      // rows actually added, not frames drawn (they differ above the refresh rate).
      let n = 0;
      while (accRef.current >= dt) {
        accRef.current -= dt;
        const grid = gridRef.current;
        const next = step(grid[grid.length - 1], rule);
        grid.push(next);
        if (grid.length > HEIGHT) grid.shift();
        n++;
      }
      if (n) setGeneration((g) => g + n);
      draw();
      raf = requestAnimationFrame(tick);
    };
    lastRef.current = performance.now();
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running, speed, rule, draw]);

  // Repaint the static frame when the buffer changes while paused (manual step,
  // reset, seed or rule switch, colour change).
  useEffect(() => {
    if (!running) draw();
  }, [generation, rule, seed, running, draw]);

  const handleStep = () => {
    const grid = gridRef.current;
    const next = step(grid[grid.length - 1], rule);
    grid.push(next);
    if (grid.length > HEIGHT) grid.shift();
    setGeneration((g) => g + 1);
  };

  const binary = useMemo(() => rule.toString(2).padStart(8, "0"), [rule]);

  return (
    <main className="flex min-h-screen flex-col pt-14">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_420px]">
        <div className="relative min-h-[60vh] select-none bg-ink-950 lg:min-h-[calc(100vh-3.5rem)]">
          <canvas
            ref={canvasRef}
            role="img"
            aria-label={ex.canvasAria.replace("{r}", String(rule))}
            className="absolute inset-0 block h-full w-full"
          />
          <div className="pointer-events-none absolute left-4 right-4 top-4 flex items-start justify-between gap-3">
            <div className="glass hairline pointer-events-auto flex items-center gap-3 rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              <span>rule {rule}</span>
              <span className="text-ink-400">·</span>
              <span>0b{binary}</span>
              <span className="text-ink-400">·</span>
              <span>gen {generation}</span>
            </div>
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
              {ex.hudAutomaton} · {WIDTH} {ex.cellsLabel}
            </div>
          </div>
          <div className="glass hairline pointer-events-none absolute bottom-4 left-4 rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
            {ex.hudFlow}
          </div>
        </div>

        <aside className="hairline scrollbar-thin flex flex-col overflow-y-auto border-l bg-ink-900/40">
          <div className="hairline space-y-3 border-b p-6">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
              {topic.title}
            </div>
            <h1 className="math-italic text-3xl leading-tight text-ink-100">{topic.tagline}</h1>
            <p className="text-sm leading-relaxed text-ink-200">{topic.body}</p>
            <div className="hairline rounded-md border bg-ink-950/60 p-3 font-mono text-xs text-ink-100">
              {ex.ruleFormula}
            </div>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {ex.famousRules}
              <Info side="bottom">{ex.famousInfo}</Info>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {FAMOUS_RULES.map((r) => (
                <button
                  key={r.rule}
                  onClick={() => {
                    setRule(r.rule);
                    reset();
                  }}
                  className={`rounded-md border px-3 py-2 text-left transition-colors ${
                    rule === r.rule
                      ? "border-signal-cyan/60 bg-signal-cyan/10 text-signal-cyan"
                      : "hairline text-ink-200 hover:border-signal-cyan/40 hover:text-ink-100"
                  }`}
                >
                  <div className="text-sm">{r.label}</div>
                  <div className="mt-0.5 font-mono text-[10px] text-ink-400">
                    {ex.notes[r.rule]}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {ex.customRule}
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <span className="font-mono text-[10px] text-signal-cyan">{rule}</span>
                <span className="font-mono text-[10px] text-ink-400">0b{binary}</span>
              </div>
              <input
                type="range"
                value={rule}
                min={0}
                max={255}
                step={1}
                onChange={(e) => {
                  setRule(parseInt(e.target.value));
                  reset();
                }}
                aria-label={ex.ruleSliderAria}
                className="w-full accent-signal-cyan"
              />
            </div>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {ex.seed}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(["single", "edge", "random"] as Seed[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setSeed(s)}
                  className={`rounded-md border py-2 font-mono text-[10px] uppercase tracking-widest transition-colors ${
                    seed === s
                      ? "border-signal-cyan/60 bg-signal-cyan/10 text-signal-cyan"
                      : "hairline text-ink-300 hover:text-ink-100"
                  }`}
                >
                  {s === "single" ? ex.seedSingle : s === "edge" ? ex.seedEdge : ex.seedRandom}
                </button>
              ))}
            </div>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {u.life.controls}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setRunning((v) => !v)}
                className={`rounded-md border py-2 font-mono text-[11px] uppercase tracking-widest2 transition-colors ${
                  running
                    ? "border-signal-rose/60 bg-signal-rose/10 text-signal-rose"
                    : "border-signal-cyan/60 bg-signal-cyan/10 text-signal-cyan"
                }`}
              >
                {running ? `❚❚ ${u.life.pause}` : `▶ ${u.life.play}`}
              </button>
              <button
                onClick={handleStep}
                disabled={running}
                className="hairline rounded-md border py-2 font-mono text-[11px] uppercase tracking-widest2 text-ink-200 transition-colors hover:text-ink-100 disabled:opacity-40"
              >
                {u.life.step}
              </button>
              <button
                onClick={reset}
                className="hairline col-span-2 rounded-md border py-2 font-mono text-[11px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-signal-rose/40 hover:text-signal-rose"
              >
                ○ {u.life.clear}
              </button>
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                  {u.life.speed}
                </span>
                <span className="font-mono text-[10px] text-signal-cyan">{speed} gen/s</span>
              </div>
              <input
                type="range"
                value={speed}
                min={1}
                max={120}
                step={1}
                onChange={(e) => setSpeed(parseInt(e.target.value))}
                aria-label={ex.speedSliderAria}
                className="w-full accent-signal-cyan"
              />
            </div>
          </div>

          <div className="hairline border-b p-5">
            <div className="mb-3 font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {u.life.cellColour}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {(["cyan", "violet", "amber", "rose"] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setColourKey(c)}
                  className={`rounded-md border py-2 font-mono text-[10px] uppercase tracking-widest transition-colors ${
                    colourKey === c
                      ? `border-signal-${c}/60 text-signal-${c} bg-signal-${c}/10`
                      : "hairline text-ink-300 hover:text-ink-100"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
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
