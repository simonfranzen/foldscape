"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import type { Locale } from "@/lib/i18n/types";
import { useDpr } from "@/lib/hooks/useDpr";
import { palette } from "@/lib/visual/palette";

type Mode = "subdivision" | "chaos" | "pascal" | "rule90";

const MODE_IDS: Mode[] = ["subdivision", "chaos", "pascal", "rule90"];

type ModeStrings = { label: string; short: string; badge: string };

// --------------------------------------------------------------------------
// Per-locale UI strings for the explorer. Mode labels, control labels and
// hints all live here so the interactive room reads in the visitor's language,
// matching the RICH_EXPLORER pattern used by the other explorers in the repo.
// --------------------------------------------------------------------------
type RichExplorer = {
  construction: string;
  cellColour: string;
  restart: string;
  depth: string;
  pointsPerFrame: string;
  rows: string;
  generations: string;
  depthHint: string;
  chaosHint: string;
  pascalHint: string;
  rule90Hint: string;
  trianglesUnit: string;
  pointsUnit: string;
  rowsUnit: string;
  generationsUnit: string;
  modes: Record<Mode, ModeStrings>;
};

const RICH_EXPLORER: Record<Locale, RichExplorer> = {
  en: {
    construction: "Construction",
    cellColour: "Cell colour",
    restart: "Restart",
    depth: "Depth",
    pointsPerFrame: "Points / frame",
    rows: "Rows",
    generations: "Generations",
    depthHint: "3^depth triangles at the limit · centre always removed.",
    chaosHint: "Jump halfway to a random vertex; plot; repeat.",
    pascalHint: "Filled where C(n, k) is odd · Lucas's theorem.",
    rule90Hint: "Each cell = XOR of its two neighbours · seed = one cell.",
    trianglesUnit: "triangles",
    pointsUnit: "points",
    rowsUnit: "rows",
    generationsUnit: "generations",
    modes: {
      subdivision: {
        label: "Subdivision",
        short: "Recursive subdivision",
        badge: "remove the centre, recurse",
      },
      chaos: { label: "Chaos game", short: "Random halving walk", badge: "p ← p + ½ · (vᵢ − p)" },
      pascal: { label: "Pascal mod 2", short: "Odd binomial coefficients", badge: "C(n, k) mod 2" },
      rule90: {
        label: "Rule 90",
        short: "Single-cell cellular automaton",
        badge: "next = left ⊕ right",
      },
    },
  },
  de: {
    construction: "Konstruktion",
    cellColour: "Zellfarbe",
    restart: "Neustart",
    depth: "Tiefe",
    pointsPerFrame: "Punkte / Frame",
    rows: "Zeilen",
    generations: "Generationen",
    depthHint: "3^Tiefe Dreiecke im Grenzwert · Mitte immer entfernt.",
    chaosHint: "Halb zu einer zufälligen Ecke springen; zeichnen; wiederholen.",
    pascalHint: "Gefüllt, wo C(n, k) ungerade ist · Satz von Lucas.",
    rule90Hint: "Jede Zelle = XOR ihrer zwei Nachbarn · Start = eine Zelle.",
    trianglesUnit: "Dreiecke",
    pointsUnit: "Punkte",
    rowsUnit: "Zeilen",
    generationsUnit: "Generationen",
    modes: {
      subdivision: {
        label: "Unterteilung",
        short: "Rekursive Unterteilung",
        badge: "Mitte entfernen, rekursiv",
      },
      chaos: {
        label: "Chaosspiel",
        short: "Zufällige Halbierungswanderung",
        badge: "p ← p + ½ · (vᵢ − p)",
      },
      pascal: {
        label: "Pascal mod 2",
        short: "Ungerade Binomialkoeffizienten",
        badge: "C(n, k) mod 2",
      },
      rule90: {
        label: "Regel 90",
        short: "Zellularautomat mit einer Zelle",
        badge: "next = left ⊕ right",
      },
    },
  },
  es: {
    construction: "Construcción",
    cellColour: "Color de celda",
    restart: "Reiniciar",
    depth: "Profundidad",
    pointsPerFrame: "Puntos / fotograma",
    rows: "Filas",
    generations: "Generaciones",
    depthHint: "3^profundidad triángulos en el límite · centro siempre eliminado.",
    chaosHint: "Salta a mitad hacia un vértice aleatorio; dibuja; repite.",
    pascalHint: "Relleno donde C(n, k) es impar · teorema de Lucas.",
    rule90Hint: "Cada celda = XOR de sus dos vecinos · semilla = una celda.",
    trianglesUnit: "triángulos",
    pointsUnit: "puntos",
    rowsUnit: "filas",
    generationsUnit: "generaciones",
    modes: {
      subdivision: {
        label: "Subdivisión",
        short: "Subdivisión recursiva",
        badge: "quita el centro, recursión",
      },
      chaos: {
        label: "Juego del Caos",
        short: "Paseo de mitades aleatorio",
        badge: "p ← p + ½ · (vᵢ − p)",
      },
      pascal: {
        label: "Pascal mod 2",
        short: "Coeficientes binomiales impares",
        badge: "C(n, k) mod 2",
      },
      rule90: {
        label: "Regla 90",
        short: "Autómata celular de una célula",
        badge: "next = left ⊕ right",
      },
    },
  },
  fr: {
    construction: "Construction",
    cellColour: "Couleur de cellule",
    restart: "Redémarrer",
    depth: "Profondeur",
    pointsPerFrame: "Points / image",
    rows: "Lignes",
    generations: "Générations",
    depthHint: "3^profondeur triangles à la limite · centre toujours enlevé.",
    chaosHint: "Saute à mi-chemin vers un sommet aléatoire ; trace ; répète.",
    pascalHint: "Rempli là où C(n, k) est impair · théorème de Lucas.",
    rule90Hint: "Chaque cellule = XOR de ses deux voisines · graine = une cellule.",
    trianglesUnit: "triangles",
    pointsUnit: "points",
    rowsUnit: "lignes",
    generationsUnit: "générations",
    modes: {
      subdivision: {
        label: "Subdivision",
        short: "Subdivision récursive",
        badge: "enlève le centre, récursion",
      },
      chaos: {
        label: "Jeu du Chaos",
        short: "Marche aléatoire par moitié",
        badge: "p ← p + ½ · (vᵢ − p)",
      },
      pascal: {
        label: "Pascal mod 2",
        short: "Coefficients binomiaux impairs",
        badge: "C(n, k) mod 2",
      },
      rule90: {
        label: "Règle 90",
        short: "Automate cellulaire à une cellule",
        badge: "next = left ⊕ right",
      },
    },
  },
  it: {
    construction: "Costruzione",
    cellColour: "Colore cella",
    restart: "Riavvia",
    depth: "Profondità",
    pointsPerFrame: "Punti / frame",
    rows: "Righe",
    generations: "Generazioni",
    depthHint: "3^profondità triangoli al limite · centro sempre rimosso.",
    chaosHint: "Salta a metà verso un vertice casuale; traccia; ripeti.",
    pascalHint: "Pieno dove C(n, k) è dispari · teorema di Lucas.",
    rule90Hint: "Ogni cella = XOR dei suoi due vicini · seme = una cella.",
    trianglesUnit: "triangoli",
    pointsUnit: "punti",
    rowsUnit: "righe",
    generationsUnit: "generazioni",
    modes: {
      subdivision: {
        label: "Suddivisione",
        short: "Suddivisione ricorsiva",
        badge: "togli il centro, ricorri",
      },
      chaos: {
        label: "Gioco del Caos",
        short: "Passeggiata casuale a metà",
        badge: "p ← p + ½ · (vᵢ − p)",
      },
      pascal: {
        label: "Pascal mod 2",
        short: "Coefficienti binomiali dispari",
        badge: "C(n, k) mod 2",
      },
      rule90: {
        label: "Regola 90",
        short: "Automa cellulare a una cella",
        badge: "next = left ⊕ right",
      },
    },
  },
  pt: {
    construction: "Construção",
    cellColour: "Cor da célula",
    restart: "Reiniciar",
    depth: "Profundidade",
    pointsPerFrame: "Pontos / frame",
    rows: "Linhas",
    generations: "Gerações",
    depthHint: "3^profundidade triângulos no limite · centro sempre removido.",
    chaosHint: "Salta a meio para um vértice aleatório; desenha; repete.",
    pascalHint: "Preenchido onde C(n, k) é ímpar · teorema de Lucas.",
    rule90Hint: "Cada célula = XOR dos seus dois vizinhos · semente = uma célula.",
    trianglesUnit: "triângulos",
    pointsUnit: "pontos",
    rowsUnit: "linhas",
    generationsUnit: "gerações",
    modes: {
      subdivision: {
        label: "Subdivisão",
        short: "Subdivisão recursiva",
        badge: "tira o centro, recursão",
      },
      chaos: {
        label: "Jogo do Caos",
        short: "Passeio aleatório a meio",
        badge: "p ← p + ½ · (vᵢ − p)",
      },
      pascal: {
        label: "Pascal mod 2",
        short: "Coeficientes binomiais ímpares",
        badge: "C(n, k) mod 2",
      },
      rule90: {
        label: "Regra 90",
        short: "Autómato celular de uma célula",
        badge: "next = left ⊕ right",
      },
    },
  },
  sv: {
    construction: "Konstruktion",
    cellColour: "Cellfärg",
    restart: "Starta om",
    depth: "Djup",
    pointsPerFrame: "Punkter / bildruta",
    rows: "Rader",
    generations: "Generationer",
    depthHint: "3^djup trianglar i gränsen · mitten alltid borttagen.",
    chaosHint: "Hoppa halvvägs mot ett slumpmässigt hörn; rita; upprepa.",
    pascalHint: "Fylld där C(n, k) är udda · Lucas sats.",
    rule90Hint: "Varje cell = XOR av sina två grannar · frö = en cell.",
    trianglesUnit: "trianglar",
    pointsUnit: "punkter",
    rowsUnit: "rader",
    generationsUnit: "generationer",
    modes: {
      subdivision: {
        label: "Uppdelning",
        short: "Rekursiv uppdelning",
        badge: "ta bort mitten, rekursivt",
      },
      chaos: {
        label: "Kaosspelet",
        short: "Slumpartad halveringsvandring",
        badge: "p ← p + ½ · (vᵢ − p)",
      },
      pascal: {
        label: "Pascal mod 2",
        short: "Udda binomialkoefficienter",
        badge: "C(n, k) mod 2",
      },
      rule90: {
        label: "Regel 90",
        short: "Cellulär automat med en cell",
        badge: "next = left ⊕ right",
      },
    },
  },
  no: {
    construction: "Konstruksjon",
    cellColour: "Cellefarge",
    restart: "Start på nytt",
    depth: "Dybde",
    pointsPerFrame: "Punkter / bilde",
    rows: "Rader",
    generations: "Generasjoner",
    depthHint: "3^dybde trekanter i grensen · midten alltid fjernet.",
    chaosHint: "Hopp halvveis mot et tilfeldig hjørne; tegn; gjenta.",
    pascalHint: "Fylt der C(n, k) er odde · Lucas' sats.",
    rule90Hint: "Hver celle = XOR av sine to naboer · frø = én celle.",
    trianglesUnit: "trekanter",
    pointsUnit: "punkter",
    rowsUnit: "rader",
    generationsUnit: "generasjoner",
    modes: {
      subdivision: {
        label: "Oppdeling",
        short: "Rekursiv oppdeling",
        badge: "fjern midten, rekursivt",
      },
      chaos: {
        label: "Kaosspillet",
        short: "Tilfeldig halveringsvandring",
        badge: "p ← p + ½ · (vᵢ − p)",
      },
      pascal: {
        label: "Pascal mod 2",
        short: "Odde binomialkoeffisienter",
        badge: "C(n, k) mod 2",
      },
      rule90: {
        label: "Regel 90",
        short: "Cellulær automat med én celle",
        badge: "next = left ⊕ right",
      },
    },
  },
};

// Build an rgba() string from a palette hex token so canvas colours stay in
// sync with the Tailwind signal-* swatch classes (e.g. bg-signal-violet)
// instead of drifting via hand-written literals.
function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

const VIOLET_OUTLINE = hexToRgba(palette.signal.violet, 0.22);
const VIOLET_VERTEX = hexToRgba(palette.signal.violet, 0.5);

interface DotColor {
  id: "violet" | "cyan" | "amber" | "rose";
  label: string;
  css: string;
  solid: string;
  soft: string;
}

const COLORS: DotColor[] = [
  {
    id: "violet",
    label: "violet",
    css: "bg-signal-violet",
    solid: hexToRgba(palette.signal.violet, 0.92),
    soft: hexToRgba(palette.signal.violet, 0.55),
  },
  {
    id: "cyan",
    label: "cyan",
    css: "bg-signal-cyan",
    solid: hexToRgba(palette.signal.cyan, 0.92),
    soft: hexToRgba(palette.signal.cyan, 0.55),
  },
  {
    id: "amber",
    label: "amber",
    css: "bg-signal-amber",
    solid: hexToRgba(palette.signal.amber, 0.95),
    soft: hexToRgba(palette.signal.amber, 0.55),
  },
  {
    id: "rose",
    label: "rose",
    css: "bg-signal-rose",
    solid: hexToRgba(palette.signal.rose, 0.92),
    soft: hexToRgba(palette.signal.rose, 0.55),
  },
];

export default function SierpinskiExplorer() {
  const { a, u, locale } = useI18n();
  const topic = a.topics.sierpinski;
  const ex = RICH_EXPLORER[locale];

  const [mode, setMode] = useState<Mode>("subdivision");
  const [depth, setDepth] = useState(6);
  const [pointsPerFrame, setPointsPerFrame] = useState(4000);
  const [rows, setRows] = useState(64);
  const [gens, setGens] = useState(96);
  const [colorId, setColorId] = useState<DotColor["id"]>("violet");
  const [restartTick, setRestartTick] = useState(0);

  const dpr = useDpr();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const totalPointsRef = useRef(0);
  const [totalPoints, setTotalPoints] = useState(0);

  const color = COLORS.find((c) => c.id === colorId) ?? COLORS[0];
  const activeMode = ex.modes[mode];

  // Subdivision: animated depth growing 0 → depth, then settle.
  // Chaos game: continuous accumulation.
  // Pascal & Rule 90: static draw.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let raf = 0;
    let cancelled = false;
    totalPointsRef.current = 0;
    setTotalPoints(0);

    const sizeCanvas = () => {
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(W * dpr));
      canvas.height = Math.max(1, Math.floor(H * dpr));
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = palette.canvas.bg;
      ctx.fillRect(0, 0, W, H);
      return ctx;
    };

    const ctx = sizeCanvas();
    if (!ctx) return;

    if (mode === "subdivision") {
      // Reduced motion: jump straight to the final gasket, no depth growth.
      const reduce = prefersReducedMotion();
      // Animate depth from 0 up to current `depth`.
      let current = reduce ? depth : 0;
      const drawCurrent = () => {
        const W = canvas.clientWidth;
        const H = canvas.clientHeight;
        const c2 = canvas.getContext("2d");
        if (!c2) return;
        c2.setTransform(dpr, 0, 0, dpr, 0, 0);
        c2.fillStyle = palette.canvas.bg;
        c2.fillRect(0, 0, W, H);
        c2.fillStyle = color.solid;
        const [v0, v1, v2] = triangleVertices(W, H);
        recurseSub(c2, v0, v1, v2, current);
      };
      drawCurrent();
      if (!reduce) {
        const step = () => {
          if (cancelled) return;
          if (current < depth) {
            current += 1;
            drawCurrent();
            raf = window.setTimeout(() => {
              raf = requestAnimationFrame(step);
            }, 280) as unknown as number;
          }
        };
        raf = window.setTimeout(() => {
          raf = requestAnimationFrame(step);
        }, 280) as unknown as number;
      }
      const ro = new ResizeObserver(() => {
        // Resize the backing store, then redraw at the animation's *current*
        // depth (not the target) so a resize mid-build does not flash the
        // finished fractal before the build-up continues.
        sizeCanvas();
        drawCurrent();
      });
      ro.observe(canvas);
      return () => {
        cancelled = true;
        cancelAnimationFrame(raf);
        clearTimeout(raf);
        ro.disconnect();
      };
    }

    if (mode === "chaos") {
      const reduce = prefersReducedMotion();
      const W0 = canvas.clientWidth;
      const H0 = canvas.clientHeight;
      // draw faint triangle outline
      const verts0 = triangleVertices(W0, H0);
      const drawFrame = (c2: CanvasRenderingContext2D, verts: typeof verts0) => {
        c2.strokeStyle = VIOLET_OUTLINE;
        c2.lineWidth = 1;
        c2.beginPath();
        c2.moveTo(verts[0][0], verts[0][1]);
        c2.lineTo(verts[1][0], verts[1][1]);
        c2.lineTo(verts[2][0], verts[2][1]);
        c2.closePath();
        c2.stroke();
        c2.fillStyle = VIOLET_VERTEX;
        for (let i = 0; i < 3; i++) {
          c2.beginPath();
          c2.arc(verts[i][0], verts[i][1], 2.5, 0, Math.PI * 2);
          c2.fill();
        }
      };
      drawFrame(ctx, verts0);

      let x = W0 / 2;
      let y = H0 / 2;
      // burn-in (off-screen iterations)
      for (let i = 0; i < 20; i++) {
        const v = verts0[(Math.random() * 3) | 0];
        x = (x + v[0]) / 2;
        y = (y + v[1]) / 2;
      }

      // Reduced motion: plot one fixed batch synchronously, no rAF loop.
      if (reduce) {
        const BATCH = 60000;
        ctx.fillStyle = color.soft;
        for (let i = 0; i < BATCH; i++) {
          const v = verts0[(Math.random() * 3) | 0];
          x = (x + v[0]) / 2;
          y = (y + v[1]) / 2;
          ctx.fillRect(x, y, 1, 1);
        }
        totalPointsRef.current = BATCH;
        setTotalPoints(BATCH);
        return () => {
          cancelled = true;
        };
      }

      let lastReport = 0;
      const tick = () => {
        if (cancelled) return;
        const c2 = canvas.getContext("2d");
        if (!c2) return;
        const W = canvas.clientWidth;
        const H = canvas.clientHeight;
        const verts = triangleVertices(W, H);
        c2.fillStyle = color.soft;
        for (let i = 0; i < pointsPerFrame; i++) {
          const v = verts[(Math.random() * 3) | 0];
          x = (x + v[0]) / 2;
          y = (y + v[1]) / 2;
          c2.fillRect(x, y, 1, 1);
        }
        totalPointsRef.current += pointsPerFrame;
        const now = performance.now();
        if (now - lastReport > 120) {
          lastReport = now;
          setTotalPoints(totalPointsRef.current);
        }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);

      const ro = new ResizeObserver(() => {
        const c2 = sizeCanvas();
        if (!c2) return;
        const W = canvas.clientWidth;
        const H = canvas.clientHeight;
        x = W / 2;
        y = H / 2;
        drawFrame(c2, triangleVertices(W, H));
      });
      ro.observe(canvas);

      return () => {
        cancelled = true;
        cancelAnimationFrame(raf);
        ro.disconnect();
      };
    }

    if (mode === "pascal") {
      const render = () => {
        const c2 = sizeCanvas();
        if (!c2) return;
        c2.fillStyle = color.solid;
        drawPascalMod2(c2, canvas.clientWidth, canvas.clientHeight, rows);
      };
      render();
      const ro = new ResizeObserver(render);
      ro.observe(canvas);
      return () => {
        cancelled = true;
        ro.disconnect();
      };
    }

    if (mode === "rule90") {
      const render = () => {
        const c2 = sizeCanvas();
        if (!c2) return;
        c2.fillStyle = color.solid;
        drawRule90(c2, canvas.clientWidth, canvas.clientHeight, gens);
      };
      render();
      const ro = new ResizeObserver(render);
      ro.observe(canvas);
      return () => {
        cancelled = true;
        ro.disconnect();
      };
    }
  }, [mode, depth, pointsPerFrame, rows, gens, color.solid, color.soft, restartTick, dpr]);

  return (
    <main className="flex min-h-screen flex-col pt-14">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_420px]">
        <div className="relative flex min-h-[60vh] flex-col gap-4 bg-ink-950 p-4 lg:min-h-[calc(100vh-3.5rem)] lg:p-6">
          <div className="flex flex-wrap items-center gap-2">
            {MODE_IDS.map((id) => (
              <button
                key={id}
                onClick={() => setMode(id)}
                className={`rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 transition-colors ${
                  mode === id
                    ? "border-signal-violet/60 bg-signal-violet/10 text-signal-violet"
                    : "hairline text-ink-200 hover:border-signal-violet/40 hover:text-signal-violet"
                }`}
              >
                {ex.modes[id].label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              {activeMode.short}
            </div>
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-violet">
              {activeMode.badge}
            </div>
          </div>

          <div className="hairline flex-1 overflow-hidden rounded-2xl border bg-ink-950">
            <canvas
              ref={canvasRef}
              className="block h-full w-full"
              role="img"
              aria-label={`${ex.construction}: ${activeMode.label}`}
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              {mode === "subdivision" &&
                `${ex.depth} ${depth} · ${3 ** depth} ${ex.trianglesUnit}`}
              {mode === "chaos" && `${totalPoints.toLocaleString()} ${ex.pointsUnit}`}
              {mode === "pascal" && `${rows} ${ex.rowsUnit} · C(n,k) mod 2`}
              {mode === "rule90" && `${gens} ${ex.generationsUnit}`}
            </div>
            <button
              onClick={() => setRestartTick((t) => t + 1)}
              className="hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-signal-violet/40 hover:text-signal-violet"
            >
              {ex.restart}
            </button>
          </div>
        </div>

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
              {ex.construction}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {MODE_IDS.map((id) => (
                <button
                  key={id}
                  onClick={() => setMode(id)}
                  className={`rounded-md border px-3 py-2 text-left transition-colors ${
                    mode === id
                      ? "border-signal-violet/60 bg-signal-violet/10 text-signal-violet"
                      : "hairline text-ink-200 hover:border-signal-violet/40 hover:text-signal-violet"
                  }`}
                >
                  <div className="font-mono text-xs">{ex.modes[id].label}</div>
                  <div className="mt-0.5 font-mono text-[10px] text-ink-400">{ex.modes[id].short}</div>
                </button>
              ))}
            </div>
          </div>

          {mode === "subdivision" && (
            <div className="hairline space-y-3 border-b p-5">
              <div className="flex items-center justify-between">
                <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                  {ex.depth}
                </div>
                <div className="font-mono text-sm text-signal-violet">{depth}</div>
              </div>
              <input
                type="range"
                value={depth}
                min={0}
                max={10}
                step={1}
                onChange={(e) => setDepth(parseInt(e.target.value))}
                aria-label={ex.depth}
                className="w-full accent-signal-violet"
              />
              <p className="font-mono text-[10px] text-ink-400">{ex.depthHint}</p>
            </div>
          )}

          {mode === "chaos" && (
            <div className="hairline space-y-3 border-b p-5">
              <div className="flex items-center justify-between">
                <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                  {ex.pointsPerFrame}
                </div>
                <div className="font-mono text-sm text-signal-violet">
                  {pointsPerFrame.toLocaleString()}
                </div>
              </div>
              <input
                type="range"
                value={pointsPerFrame}
                min={100}
                max={20000}
                step={100}
                onChange={(e) => setPointsPerFrame(parseInt(e.target.value))}
                aria-label={ex.pointsPerFrame}
                className="w-full accent-signal-violet"
              />
              <p className="font-mono text-[10px] text-ink-400">{ex.chaosHint}</p>
            </div>
          )}

          {mode === "pascal" && (
            <div className="hairline space-y-3 border-b p-5">
              <div className="flex items-center justify-between">
                <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                  {ex.rows}
                </div>
                <div className="font-mono text-sm text-signal-violet">{rows}</div>
              </div>
              <input
                type="range"
                value={rows}
                min={10}
                max={256}
                step={1}
                onChange={(e) => setRows(parseInt(e.target.value))}
                aria-label={ex.rows}
                className="w-full accent-signal-violet"
              />
              <p className="font-mono text-[10px] text-ink-400">{ex.pascalHint}</p>
            </div>
          )}

          {mode === "rule90" && (
            <div className="hairline space-y-3 border-b p-5">
              <div className="flex items-center justify-between">
                <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                  {ex.generations}
                </div>
                <div className="font-mono text-sm text-signal-violet">{gens}</div>
              </div>
              <input
                type="range"
                value={gens}
                min={10}
                max={256}
                step={1}
                onChange={(e) => setGens(parseInt(e.target.value))}
                aria-label={ex.generations}
                className="w-full accent-signal-violet"
              />
              <p className="font-mono text-[10px] text-ink-400">{ex.rule90Hint}</p>
            </div>
          )}

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {ex.cellColour}
            </div>
            <div className="flex items-center gap-2">
              {COLORS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setColorId(c.id)}
                  aria-label={c.label}
                  className={`h-8 w-8 rounded-md border transition-transform ${c.css} ${
                    colorId === c.id ? "scale-110 border-ink-100" : "border-ink-700 hover:scale-105"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <button
              onClick={() => setRestartTick((t) => t + 1)}
              className="block w-full rounded-md border border-signal-violet/40 bg-signal-violet/10 py-2 text-center font-mono text-[10px] uppercase tracking-widest2 text-signal-violet transition-colors hover:bg-signal-violet/20"
            >
              {ex.restart} {activeMode.label}
            </button>
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

// --- drawing helpers ---

function triangleVertices(
  W: number,
  H: number,
): [[number, number], [number, number], [number, number]] {
  const margin = 16;
  const w = W - 2 * margin;
  const h = H - 2 * margin;
  const side = Math.min(w, h * (2 / Math.sqrt(3)));
  const triH = side * (Math.sqrt(3) / 2);
  const cx = W / 2;
  const offY = margin + (h - triH) / 2;
  return [
    [cx, offY],
    [cx - side / 2, offY + triH],
    [cx + side / 2, offY + triH],
  ];
}

function recurseSub(
  ctx: CanvasRenderingContext2D,
  a: [number, number],
  b: [number, number],
  c: [number, number],
  depth: number,
) {
  if (depth <= 0) {
    ctx.beginPath();
    ctx.moveTo(a[0], a[1]);
    ctx.lineTo(b[0], b[1]);
    ctx.lineTo(c[0], c[1]);
    ctx.closePath();
    ctx.fill();
    return;
  }
  const ab: [number, number] = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const bc: [number, number] = [(b[0] + c[0]) / 2, (b[1] + c[1]) / 2];
  const ca: [number, number] = [(c[0] + a[0]) / 2, (c[1] + a[1]) / 2];
  recurseSub(ctx, a, ab, ca, depth - 1);
  recurseSub(ctx, ab, b, bc, depth - 1);
  recurseSub(ctx, ca, bc, c, depth - 1);
}

function drawPascalMod2(ctx: CanvasRenderingContext2D, W: number, H: number, rows: number) {
  const margin = 10;
  const cellW = (W - 2 * margin) / rows;
  const cellH = (H - 2 * margin) / rows;
  const cell = Math.max(1, Math.min(cellW, cellH));
  const totalW = cell * rows;
  const totalH = cell * rows;
  const ox = (W - totalW) / 2;
  const oy = (H - totalH) / 2;
  let row: number[] = [1];
  for (let r = 0; r < rows; r++) {
    const rowOffsetX = ox + ((rows - r - 1) * cell) / 2;
    for (let k = 0; k <= r; k++) {
      if (row[k] === 1) {
        const size = Math.max(1, cell - 0.5);
        ctx.fillRect(rowOffsetX + k * cell, oy + r * cell, size, size);
      }
    }
    const next: number[] = new Array(r + 2).fill(0);
    for (let k = 0; k <= r + 1; k++) {
      const left = k === 0 ? 0 : row[k - 1];
      const right = k > r ? 0 : row[k];
      next[k] = left ^ right;
    }
    row = next;
  }
}

function drawRule90(ctx: CanvasRenderingContext2D, W: number, H: number, gens: number) {
  const width = gens * 2 - 1;
  const margin = 10;
  const cellW = (W - 2 * margin) / width;
  const cellH = (H - 2 * margin) / gens;
  const cell = Math.max(1, Math.min(cellW, cellH));
  const totalW = cell * width;
  const totalH = cell * gens;
  const ox = (W - totalW) / 2;
  const oy = (H - totalH) / 2;
  let cells = new Uint8Array(width);
  cells[(width - 1) >> 1] = 1;
  for (let g = 0; g < gens; g++) {
    for (let i = 0; i < width; i++) {
      if (cells[i] === 1) {
        const size = Math.max(1, cell - 0.5);
        ctx.fillRect(ox + i * cell, oy + g * cell, size, size);
      }
    }
    const next = new Uint8Array(width);
    for (let i = 0; i < width; i++) {
      const left = i === 0 ? 0 : cells[i - 1];
      const right = i === width - 1 ? 0 : cells[i + 1];
      next[i] = left ^ right;
    }
    cells = next;
  }
}
