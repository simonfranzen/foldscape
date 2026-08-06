"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { useDpr } from "@/lib/hooks/useDpr";
import { palette } from "@/lib/visual/palette";
import type { Locale } from "@/lib/i18n/types";

const PALETTE = [
  palette.canvas.bg, // residue 0 = empty
  palette.signal.amber, // 1
  palette.signal.cyan, // 2
  palette.signal.violet, // 3
  palette.signal.rose, // 4
  "#a0e89a", // 5
  "#ff9a55", // 6
  "#c4c6d0", // 7
  "#8ddfff", // 8
  "#ffe28a", // 9
  "#ff6b9b", // 10
  "#7afdd6", // 11
];

// Map a residue to a swatch colour. Index 0 (background) is reserved for the
// "divisible by p" blank, so a NONZERO residue must never land there: if a
// nonzero residue equals PALETTE.length (e.g. residue 12 with a 12-entry
// palette for p = 13), a plain `r % PALETTE.length` would wrap to 0 and draw
// the cell as background. Cycle nonzero residues through indices 1..len-1.
const colourFor = (r: number) => (r === 0 ? PALETTE[0] : PALETTE[1 + ((r - 1) % (PALETTE.length - 1))]);

// Localized sidebar/overlay copy — the atlas bundle already localizes
// title/tagline/body, so these six strings need their own per-locale map.
type ExplorerCopy = {
  modulusLabel: string;
  modulusHint: string;
  rowsLabel: string;
  rowsHint: string;
  rowsUnit: string;
  legendLabel: string;
  canvasLabel: string;
};

const RICH_EXPLORER: Record<Locale, ExplorerCopy> = {
  en: {
    modulusLabel: "Modulus p",
    modulusHint: "Primes give clean gaskets (Kummer's theorem).",
    rowsLabel: "Rows",
    rowsHint: "More rows = finer fractal detail.",
    rowsUnit: "rows",
    legendLabel: "Residue legend",
    canvasLabel: "Pascal's triangle coloured modulo",
  },
  de: {
    modulusLabel: "Modulus p",
    modulusHint: "Primzahlen geben saubere Siebe (Satz von Kummer).",
    rowsLabel: "Zeilen",
    rowsHint: "Mehr Zeilen = feinere Fraktaldetails.",
    rowsUnit: "Zeilen",
    legendLabel: "Rest-Legende",
    canvasLabel: "Pascalsches Dreieck gefärbt modulo",
  },
  es: {
    modulusLabel: "Módulo p",
    modulusHint: "Los primos dan tamices limpios (teorema de Kummer).",
    rowsLabel: "Filas",
    rowsHint: "Más filas = detalle fractal más fino.",
    rowsUnit: "filas",
    legendLabel: "Leyenda de residuos",
    canvasLabel: "Triángulo de Pascal coloreado módulo",
  },
  fr: {
    modulusLabel: "Module p",
    modulusHint: "Les premiers donnent des tamis nets (théorème de Kummer).",
    rowsLabel: "Lignes",
    rowsHint: "Plus de lignes = détail fractal plus fin.",
    rowsUnit: "lignes",
    legendLabel: "Légende des résidus",
    canvasLabel: "Triangle de Pascal coloré modulo",
  },
  it: {
    modulusLabel: "Modulo p",
    modulusHint: "I primi danno setacci netti (teorema di Kummer).",
    rowsLabel: "Righe",
    rowsHint: "Più righe = dettaglio frattale più fine.",
    rowsUnit: "righe",
    legendLabel: "Legenda dei resti",
    canvasLabel: "Triangolo di Pascal colorato modulo",
  },
  pt: {
    modulusLabel: "Módulo p",
    modulusHint: "Os primos dão peneiros limpos (teorema de Kummer).",
    rowsLabel: "Linhas",
    rowsHint: "Mais linhas = detalhe fractal mais fino.",
    rowsUnit: "linhas",
    legendLabel: "Legenda de resíduos",
    canvasLabel: "Triângulo de Pascal colorido módulo",
  },
  sv: {
    modulusLabel: "Modul p",
    modulusHint: "Primtal ger rena silar (Kummers sats).",
    rowsLabel: "Rader",
    rowsHint: "Fler rader = finare fraktaldetalj.",
    rowsUnit: "rader",
    legendLabel: "Restförklaring",
    canvasLabel: "Pascals triangel färgad modulo",
  },
  no: {
    modulusLabel: "Modulus p",
    modulusHint: "Primtall gir rene siler (Kummers teorem).",
    rowsLabel: "Rader",
    rowsHint: "Flere rader = finere fraktaldetalj.",
    rowsUnit: "rader",
    legendLabel: "Rest-forklaring",
    canvasLabel: "Pascals trekant farget modulo",
  },
};

export default function PascalmodExplorer() {
  const { a, u, locale } = useI18n();
  const topic = a.topics.pascalmod;
  const ex = RICH_EXPLORER[locale];
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dpr = useDpr();

  const [modulus, setModulus] = useState(2);
  const [rows, setRows] = useState(256);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      const W = canvas.clientWidth * dpr;
      const H = canvas.clientHeight * dpr;
      canvas.width = Math.floor(W);
      canvas.height = Math.floor(H);
      ctx.fillStyle = palette.canvas.bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Triangle bounding box
      const maxRow = rows;
      const cellSize = Math.min(canvas.width / maxRow, (canvas.height * 1.05) / maxRow);
      const triBaseW = maxRow * cellSize;
      const triH = maxRow * cellSize * 0.92;
      const offsetX = (canvas.width - triBaseW) / 2;
      const offsetY = (canvas.height - triH) / 2;

      // Generate rows incrementally storing residues only
      let prev = new Uint8Array(1);
      prev[0] = 1;
      for (let n = 0; n < maxRow; n++) {
        const len = n + 1;
        for (let k = 0; k < len; k++) {
          const r = prev[k];
          if (r !== 0) {
            const x = offsetX + (maxRow - n) * (cellSize / 2) + k * cellSize;
            const y = offsetY + n * cellSize * 0.92;
            ctx.fillStyle = colourFor(r);
            ctx.fillRect(x, y, cellSize, cellSize);
          }
        }
        // build next
        const next = new Uint8Array(len + 1);
        next[0] = 1 % modulus;
        next[len] = 1 % modulus;
        for (let k = 0; k < len - 1; k++) {
          next[k + 1] = (prev[k] + prev[k + 1]) % modulus;
        }
        prev = next;
      }

    };

    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [modulus, rows, dpr]);

  return (
    <main className="flex min-h-screen flex-col pt-14">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_420px]">
        <div className="relative min-h-[60vh] bg-ink-950 lg:min-h-[calc(100vh-3.5rem)]">
          <canvas
            ref={canvasRef}
            role="img"
            aria-label={`${ex.canvasLabel} ${modulus}`}
            className="absolute inset-0 block h-full w-full"
          />
          <div className="pointer-events-none absolute left-4 right-4 top-4 flex items-start justify-between gap-3">
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              C(n, k) mod {modulus} · {rows} {ex.rowsUnit}
            </div>
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
              {modulus === 2 ? "Sierpiński" : `${modulus}-gasket`}
            </div>
          </div>
        </div>

        <aside className="hairline scrollbar-thin flex flex-col overflow-y-auto border-l bg-ink-900/40">
          <div className="hairline space-y-3 border-b p-6">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
              {topic.title}
            </div>
            <h1 className="math-italic text-3xl leading-tight text-ink-100">{topic.tagline}</h1>
            <p className="text-sm leading-relaxed text-ink-200">{topic.body}</p>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {ex.modulusLabel}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[2, 3, 5, 7, 11, 13, 17, 19, 23].map((p) => (
                <button
                  key={p}
                  onClick={() => setModulus(p)}
                  aria-pressed={modulus === p}
                  className={`rounded-md border py-2 font-mono text-xs transition-colors ${
                    modulus === p
                      ? "border-signal-amber/60 bg-signal-amber/10 text-signal-amber"
                      : "hairline text-ink-200 hover:border-signal-amber/40 hover:text-signal-amber"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <p className="font-mono text-[10px] text-ink-400">{ex.modulusHint}</p>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="flex items-baseline justify-between">
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                {ex.rowsLabel}
              </div>
              <div className="font-mono text-[10px] text-ink-400">{rows}</div>
            </div>
            <input
              type="range"
              value={rows}
              min={16}
              max={512}
              step={8}
              onChange={(e) => setRows(parseInt(e.target.value))}
              aria-label={ex.rowsLabel}
              className="w-full accent-signal-amber"
            />
            <p className="font-mono text-[10px] text-ink-400">{ex.rowsHint}</p>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {ex.legendLabel}
            </div>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: modulus }, (_, i) => i).map((i) => (
                <div
                  key={i}
                  className="hairline flex items-center gap-1.5 rounded-md border px-2 py-1"
                >
                  <span className="h-3 w-3 rounded-sm" style={{ background: colourFor(i) }} />
                  <span className="font-mono text-[10px] text-ink-300">{i}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5">
            <Link
              href="/"
              className="hairline block w-full rounded-md border py-2 text-center font-mono text-[10px] uppercase tracking-widest2 text-ink-300 transition-colors hover:border-signal-amber/40 hover:text-signal-amber"
            >
              {u.back}
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
