"use client";

import Link from "@/components/LocaleLink";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { useDpr } from "@/lib/hooks/useDpr";
import { palette } from "@/lib/visual/palette";
import type { Locale } from "@/lib/i18n/types";
import { ExplorerGuideSection, ExplorerHelpButton } from "@/components/ExplorerGuide";
import { WANG_GUIDE } from "@/lib/explorer-guides/wang";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Tile {
  id: number;
  N: number;
  E: number;
  S: number;
  W: number;
}

type TileSetKey = "A" | "B" | "C";

interface TileSetDef {
  key: TileSetKey;
  tiles: Tile[];
}

// Choice point in the backtracking search.
interface Choice {
  // Domains as they were before this cell was filled, so an alternative can be
  // propagated from the same starting point.
  before: Int32Array;
  // Tile indices that survived the look-ahead here and are still untried.
  remaining: number[];
}

type Outcome = "searching" | "done" | "impossible" | "gaveUp";

// ─── Palette ─────────────────────────────────────────────────────────────────

const COLOURS = [
  palette.signal.cyan,
  palette.signal.violet,
  palette.signal.amber,
  palette.signal.rose,
] as const;
const COLOUR_NAMES = ["cyan", "violet", "amber", "rose"] as const;

// ─── Tile sets ───────────────────────────────────────────────────────────────

// Set A: simplest periodic 2-colour set. Five tiles, all checks work out.
const SET_A_TILES: Tile[] = [
  { id: 0, N: 0, E: 0, S: 0, W: 0 },
  { id: 1, N: 1, E: 1, S: 1, W: 1 },
  { id: 2, N: 0, E: 1, S: 0, W: 1 },
  { id: 3, N: 1, E: 0, S: 1, W: 0 },
  { id: 4, N: 0, E: 1, S: 1, W: 0 },
];

// Set B: 13 tiles in 4 colours, as many tiles as Culik's aperiodic set of 1996,
// but this list is NOT aperiodic: the 3 × 2 block of tiles 0 1 10 over 0 3 12
// matches itself on all four sides and repeats across the plane. Five of the
// 16 (north, west) colour pairs have no tile, so a search has to backtrack.
const SET_B_TILES: Tile[] = [
  { id: 0, N: 0, E: 1, S: 0, W: 2 },
  { id: 1, N: 0, E: 2, S: 1, W: 1 },
  { id: 2, N: 1, E: 1, S: 2, W: 2 },
  { id: 3, N: 1, E: 3, S: 0, W: 1 },
  { id: 4, N: 2, E: 2, S: 1, W: 3 },
  { id: 5, N: 2, E: 0, S: 3, W: 1 },
  { id: 6, N: 3, E: 1, S: 2, W: 0 },
  { id: 7, N: 0, E: 3, S: 2, W: 1 },
  { id: 8, N: 1, E: 0, S: 3, W: 2 },
  { id: 9, N: 2, E: 3, S: 0, W: 0 },
  { id: 10, N: 3, E: 2, S: 1, W: 2 },
  { id: 11, N: 3, E: 0, S: 0, W: 3 },
  { id: 12, N: 1, E: 2, S: 3, W: 3 },
];

// Set C: every 2-colour tile. 16 tiles. Guaranteed to tile, periodically.
function buildSetC(): Tile[] {
  const out: Tile[] = [];
  let id = 0;
  for (let n = 0; n < 2; n++)
    for (let e = 0; e < 2; e++)
      for (let s = 0; s < 2; s++)
        for (let w = 0; w < 2; w++) {
          out.push({ id: id++, N: n, E: e, S: s, W: w });
        }
  return out;
}

const SETS: Record<TileSetKey, TileSetDef> = {
  A: { key: "A", tiles: SET_A_TILES },
  B: { key: "B", tiles: SET_B_TILES },
  C: { key: "C", tiles: buildSetC() },
};

// ─── Localized UI strings ─────────────────────────────────────────────────────
// The explorer has many UI strings, so per repo convention it carries its own
// RICH_EXPLORER keyed by Locale rather than fattening the shared bundles.

interface ExplorerStrings {
  sets: Record<TileSetKey, { name: string; description: string }>;
  searchLabel: string;
  matchLabel: string;
  statPlaced: string;
  statBacktracks: string;
  statProgress: string;
  statStatus: string;
  statusComplete: string;
  statusImpossible: string;
  // Contains the placeholder {n} for the number of search steps spent.
  statusGaveUp: string;
  statusSearching: string;
  tileSetLabel: string;
  tilesUnit: string;
  gridSizeLabel: string;
  speedLabel: string;
  restartLabel: string;
  paletteLabel: string;
  edgeColoursLabel: string;
  canvasAria: string;
}

const RICH_EXPLORER: Record<Locale, ExplorerStrings> = {
  en: {
    sets: {
      A: {
        name: "Set A · periodic, 5 tiles",
        description: "Two colours, five tiles. Every placement is easy and the tiling is periodic.",
      },
      B: {
        name: "Set B · 4 colours, 13 tiles",
        description:
          "Four colours, 13 tiles, as many as Culik's aperiodic set of 1996. This set is not aperiodic (a 3 × 2 block repeats), but the search has to backtrack.",
      },
      C: {
        name: "Set C · all 2-colour tiles, 16",
        description:
          "Every combination of two colours on each edge. It always tiles, periodically.",
      },
    },
    searchLabel: "Tiling search",
    matchLabel: "↑ ↓ ← → match",
    statPlaced: "Placed",
    statBacktracks: "Backtracks",
    statProgress: "Progress",
    statStatus: "Status",
    statusComplete: "complete",
    statusImpossible: "no tiling exists (proved)",
    statusGaveUp: "gave up after {n} steps",
    statusSearching: "searching",
    tileSetLabel: "Tile set",
    tilesUnit: "tiles",
    gridSizeLabel: "Grid size",
    speedLabel: "Speed",
    restartLabel: "Restart",
    paletteLabel: "Show the tile palette",
    edgeColoursLabel: "Edge colours",
    canvasAria:
      "Backtracking search filling a grid with Wang tiles whose touching edges match by colour.",
  },
  de: {
    sets: {
      A: {
        name: "Satz A · periodisch, 5 Kacheln",
        description:
          "Zwei Farben, fünf Kacheln. Jede Platzierung ist leicht und die Kachelung ist periodisch.",
      },
      B: {
        name: "Satz B · 4 Farben, 13 Kacheln",
        description:
          "Vier Farben, 13 Kacheln, so viele wie Culiks aperiodischer Satz von 1996. Dieser Satz ist nicht aperiodisch (ein Block aus 3 × 2 Kacheln wiederholt sich), aber die Suche muss zurücksetzen.",
      },
      C: {
        name: "Satz C · alle 2-Farben-Kacheln, 16",
        description: "Jede Kombination zweier Farben pro Kante. Kachelt immer, periodisch.",
      },
    },
    searchLabel: "Kachelsuche",
    matchLabel: "↑ ↓ ← → passen",
    statPlaced: "Gelegt",
    statBacktracks: "Backtracks",
    statProgress: "Fortschritt",
    statStatus: "Status",
    statusComplete: "fertig",
    statusImpossible: "keine Kachelung möglich (bewiesen)",
    statusGaveUp: "nach {n} Schritten abgebrochen",
    statusSearching: "sucht",
    tileSetLabel: "Kachelsatz",
    tilesUnit: "Kacheln",
    gridSizeLabel: "Gittergröße",
    speedLabel: "Geschwindigkeit",
    restartLabel: "Neustart",
    paletteLabel: "Kachelpalette anzeigen",
    edgeColoursLabel: "Kantenfarben",
    canvasAria:
      "Backtracking-Suche, die ein Gitter mit Wang-Kacheln füllt, deren berührende Kanten farblich passen.",
  },
  es: {
    sets: {
      A: {
        name: "Conjunto A · periódico, 5 teselas",
        description:
          "Dos colores, cinco teselas. Cada colocación es fácil y la teselación es periódica.",
      },
      B: {
        name: "Conjunto B · 4 colores, 13 teselas",
        description:
          "Cuatro colores, 13 teselas, tantas como el conjunto aperiódico de Culik de 1996. Este conjunto no es aperiódico (un bloque de 3 × 2 se repite), pero la búsqueda tiene que retroceder.",
      },
      C: {
        name: "Conjunto C · todas las teselas de 2 colores, 16",
        description:
          "Cada combinación de dos colores en cada arista. Siempre tesela, de forma periódica.",
      },
    },
    searchLabel: "Búsqueda de teselación",
    matchLabel: "↑ ↓ ← → encajan",
    statPlaced: "Colocadas",
    statBacktracks: "Retrocesos",
    statProgress: "Progreso",
    statStatus: "Estado",
    statusComplete: "completo",
    statusImpossible: "no existe teselación (demostrado)",
    statusGaveUp: "abandonada tras {n} pasos",
    statusSearching: "buscando",
    tileSetLabel: "Conjunto de teselas",
    tilesUnit: "teselas",
    gridSizeLabel: "Tamaño de la malla",
    speedLabel: "Velocidad",
    restartLabel: "Reiniciar",
    paletteLabel: "Mostrar la paleta de teselas",
    edgeColoursLabel: "Colores de arista",
    canvasAria:
      "Búsqueda con retroceso que llena una malla con teselas de Wang cuyas aristas en contacto coinciden en color.",
  },
  fr: {
    sets: {
      A: {
        name: "Jeu A · périodique, 5 tuiles",
        description:
          "Deux couleurs, cinq tuiles. Chaque placement est facile et le pavage est périodique.",
      },
      B: {
        name: "Jeu B · 4 couleurs, 13 tuiles",
        description:
          "Quatre couleurs, 13 tuiles, autant que le jeu apériodique de Culik de 1996. Ce jeu n'est pas apériodique (un bloc de 3 × 2 se répète), mais la recherche doit revenir en arrière.",
      },
      C: {
        name: "Jeu C · toutes les tuiles à 2 couleurs, 16",
        description:
          "Toutes les combinaisons de deux couleurs par bord. Il pave toujours, de façon périodique.",
      },
    },
    searchLabel: "Recherche de pavage",
    matchLabel: "↑ ↓ ← → correspondent",
    statPlaced: "Placées",
    statBacktracks: "Retours",
    statProgress: "Progression",
    statStatus: "État",
    statusComplete: "terminé",
    statusImpossible: "aucun pavage possible (prouvé)",
    statusGaveUp: "abandon après {n} étapes",
    statusSearching: "recherche",
    tileSetLabel: "Jeu de tuiles",
    tilesUnit: "tuiles",
    gridSizeLabel: "Taille de la grille",
    speedLabel: "Vitesse",
    restartLabel: "Redémarrer",
    paletteLabel: "Afficher la palette de tuiles",
    edgeColoursLabel: "Couleurs de bord",
    canvasAria:
      "Recherche avec retour arrière remplissant une grille de tuiles de Wang dont les bords en contact correspondent par la couleur.",
  },
  it: {
    sets: {
      A: {
        name: "Insieme A · periodico, 5 tasselli",
        description:
          "Due colori, cinque tasselli. Ogni posa è facile e il rivestimento è periodico.",
      },
      B: {
        name: "Insieme B · 4 colori, 13 tasselli",
        description:
          "Quattro colori, 13 tasselli, quanti l'insieme aperiodico di Culik del 1996. Questo insieme non è aperiodico (un blocco 3 × 2 si ripete), ma la ricerca deve fare backtracking.",
      },
      C: {
        name: "Insieme C · tutti i tasselli a 2 colori, 16",
        description:
          "Ogni combinazione di due colori per bordo. Riveste sempre, in modo periodico.",
      },
    },
    searchLabel: "Ricerca del rivestimento",
    matchLabel: "↑ ↓ ← → combaciano",
    statPlaced: "Posati",
    statBacktracks: "Backtrack",
    statProgress: "Avanzamento",
    statStatus: "Stato",
    statusComplete: "completo",
    statusImpossible: "nessun rivestimento possibile (dimostrato)",
    statusGaveUp: "interrotta dopo {n} passi",
    statusSearching: "in ricerca",
    tileSetLabel: "Insieme di tasselli",
    tilesUnit: "tasselli",
    gridSizeLabel: "Dimensione griglia",
    speedLabel: "Velocità",
    restartLabel: "Riavvia",
    paletteLabel: "Mostra la tavolozza dei tasselli",
    edgeColoursLabel: "Colori di bordo",
    canvasAria:
      "Ricerca con backtracking che riempie una griglia con tasselli di Wang i cui bordi a contatto combaciano per colore.",
  },
  pt: {
    sets: {
      A: {
        name: "Conjunto A · periódico, 5 tijolos",
        description:
          "Duas cores, cinco tijolos. Cada colocação é fácil e o ladrilhamento é periódico.",
      },
      B: {
        name: "Conjunto B · 4 cores, 13 tijolos",
        description:
          "Quatro cores, 13 tijolos, tantos como o conjunto aperiódico de Culik de 1996. Este conjunto não é aperiódico (um bloco de 3 × 2 repete-se), mas a procura tem de recuar.",
      },
      C: {
        name: "Conjunto C · todos os tijolos de 2 cores, 16",
        description:
          "Cada combinação de duas cores por borda. Ladrilha sempre, de forma periódica.",
      },
    },
    searchLabel: "Procura de ladrilhamento",
    matchLabel: "↑ ↓ ← → combinam",
    statPlaced: "Colocados",
    statBacktracks: "Retrocessos",
    statProgress: "Progresso",
    statStatus: "Estado",
    statusComplete: "completo",
    statusImpossible: "não existe ladrilhamento (provado)",
    statusGaveUp: "desistiu após {n} passos",
    statusSearching: "a procurar",
    tileSetLabel: "Conjunto de tijolos",
    tilesUnit: "tijolos",
    gridSizeLabel: "Tamanho da grelha",
    speedLabel: "Velocidade",
    restartLabel: "Reiniciar",
    paletteLabel: "Mostrar a paleta de tijolos",
    edgeColoursLabel: "Cores de borda",
    canvasAria:
      "Procura com retrocesso a encher uma grelha com tijolos de Wang cujas bordas em contacto combinam na cor.",
  },
  sv: {
    sets: {
      A: {
        name: "Uppsättning A · periodisk, 5 plattor",
        description:
          "Två färger, fem plattor. Varje placering är enkel och täckningen är periodisk.",
      },
      B: {
        name: "Uppsättning B · 4 färger, 13 plattor",
        description:
          "Fyra färger, 13 plattor, lika många som Culiks aperiodiska uppsättning från 1996. Den här uppsättningen är inte aperiodisk (ett block på 3 × 2 upprepas), men sökningen måste backa.",
      },
      C: {
        name: "Uppsättning C · alla 2-färgsplattor, 16",
        description: "Varje kombination av två färger per kant. Täcker alltid, periodiskt.",
      },
    },
    searchLabel: "Täckningssökning",
    matchLabel: "↑ ↓ ← → matchar",
    statPlaced: "Lagda",
    statBacktracks: "Backningar",
    statProgress: "Framsteg",
    statStatus: "Status",
    statusComplete: "klar",
    statusImpossible: "ingen täckning möjlig (bevisat)",
    statusGaveUp: "avbröt efter {n} steg",
    statusSearching: "söker",
    tileSetLabel: "Plattuppsättning",
    tilesUnit: "plattor",
    gridSizeLabel: "Rutnätsstorlek",
    speedLabel: "Hastighet",
    restartLabel: "Starta om",
    paletteLabel: "Visa plattpaletten",
    edgeColoursLabel: "Kantfärger",
    canvasAria:
      "Backtracking-sökning som fyller ett rutnät med Wang-plattor vars kanter som möts matchar i färg.",
  },
  no: {
    sets: {
      A: {
        name: "Sett A · periodisk, 5 fliser",
        description: "To farger, fem fliser. Hver plassering er lett og dekkingen er periodisk.",
      },
      B: {
        name: "Sett B · 4 farger, 13 fliser",
        description:
          "Fire farger, 13 fliser, like mange som Culiks aperiodiske sett fra 1996. Dette settet er ikke aperiodisk (en blokk på 3 × 2 gjentas), men søket må rygge.",
      },
      C: {
        name: "Sett C · alle 2-fargersfliser, 16",
        description: "Hver kombinasjon av to farger per kant. Dekker alltid, periodisk.",
      },
    },
    searchLabel: "Dekkingssøk",
    matchLabel: "↑ ↓ ← → matcher",
    statPlaced: "Lagt",
    statBacktracks: "Tilbakespor",
    statProgress: "Framgang",
    statStatus: "Status",
    statusComplete: "ferdig",
    statusImpossible: "ingen dekking mulig (bevist)",
    statusGaveUp: "ga opp etter {n} steg",
    statusSearching: "søker",
    tileSetLabel: "Flisesett",
    tilesUnit: "fliser",
    gridSizeLabel: "Rutenettstørrelse",
    speedLabel: "Hastighet",
    restartLabel: "Start på nytt",
    paletteLabel: "Vis flispaletten",
    edgeColoursLabel: "Kantfarger",
    canvasAria:
      "Backtracking-søk som fyller et rutenett med Wang-fliser der kantene som møtes matcher i farge.",
  },
};

// ─── Search core ─────────────────────────────────────────────────────────────

// Per side and colour, the bitmask of tiles showing that colour on that side.
interface SideMasks {
  N: number[];
  E: number[];
  S: number[];
  W: number[];
}

function buildSideMasks(tiles: Tile[]): SideMasks {
  const masks: SideMasks = { N: [], E: [], S: [], W: [] };
  for (const side of ["N", "E", "S", "W"] as const) {
    for (let c = 0; c < COLOURS.length; c++) {
      let m = 0;
      tiles.forEach((t, i) => {
        if (t[side] === c) m |= 1 << i;
      });
      masks[side].push(m);
    }
  }
  return masks;
}

// Tiles a neighbour may still use when this cell is limited to `domain`:
// `out` is the side of this cell that faces the neighbour, `inn` the
// neighbour's side that touches it.
function supported(
  masks: SideMasks,
  domain: number,
  out: keyof SideMasks,
  inn: keyof SideMasks,
): number {
  let m = 0;
  for (let c = 0; c < COLOURS.length; c++) {
    if (domain & masks[out][c]) m |= masks[inn][c];
  }
  return m;
}

// Fix `cell` to `tileIdx` in a copy of `dom` and prune every other cell until
// all neighbouring domains support each other again (arc consistency). Returns
// null if some cell is left without any tile: that placement cannot be part of
// a tiling of this grid. Checking only the two already placed neighbours is
// not enough for Set B, whose dead ends show up many cells later.
function assign(
  dom: Int32Array,
  n: number,
  masks: SideMasks,
  cell: number,
  tileIdx: number,
): Int32Array | null {
  const d = dom.slice();
  d[cell] = 1 << tileIdx;
  const queue = [cell];
  const queued = new Uint8Array(d.length);
  queued[cell] = 1;
  const prune = (j: number, allowed: number): boolean => {
    const next = d[j] & allowed;
    if (next === d[j]) return true;
    if (next === 0) return false;
    d[j] = next;
    if (!queued[j]) {
      queued[j] = 1;
      queue.push(j);
    }
    return true;
  };
  while (queue.length > 0) {
    const i = queue.pop()!;
    queued[i] = 0;
    const di = d[i];
    const r = Math.floor(i / n);
    const c = i % n;
    if (c + 1 < n && !prune(i + 1, supported(masks, di, "E", "W"))) return null;
    if (c > 0 && !prune(i - 1, supported(masks, di, "W", "E"))) return null;
    if (r + 1 < n && !prune(i + n, supported(masks, di, "S", "N"))) return null;
    if (r > 0 && !prune(i - n, supported(masks, di, "N", "S"))) return null;
  }
  return d;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function WangExplorer() {
  const { a, u, locale } = useI18n();
  const topic = a.topics.wang;
  const ex = RICH_EXPLORER[locale];
  const dpr = useDpr();

  const [setKey, setSetKey] = useState<TileSetKey>("A");
  const [gridSize, setGridSize] = useState<number>(16);
  const [speed, setSpeed] = useState<number>(60); // placements per second
  const [restartTick, setRestartTick] = useState<number>(0);

  const [placedCount, setPlacedCount] = useState<number>(0);
  const [backtracks, setBacktracks] = useState<number>(0);
  const [outcome, setOutcome] = useState<Outcome>("searching");
  // Steps spent when the reduced-motion run hit its budget.
  const [stepsSpent, setStepsSpent] = useState<number>(0);
  // Honour prefers-reduced-motion: solve synchronously and draw once instead
  // of animating placement by placement (repo convention for canvases).
  const [reduceMotion, setReduceMotion] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // Stateful refs for the animation loop.
  const gridRef = useRef<(Tile | null)[]>([]);
  const domRef = useRef<Int32Array>(new Int32Array(0));
  const stackRef = useRef<Choice[]>([]);
  // Set once every alternative of every cell has been refuted.
  const exhaustedRef = useRef<boolean>(false);
  const rafRef = useRef<number | null>(null);
  const lastStepTimeRef = useRef<number>(0);
  const cellSizeRef = useRef<number>(0);

  const activeSet = SETS[setKey];

  const sideMasks = useMemo(() => buildSideMasks(activeSet.tiles), [activeSet]);

  // Helper: shuffle in place (Fisher-Yates).
  const shuffle = useCallback(<T,>(arr: T[]): T[] => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    return arr;
  }, []);

  // Draw the current grid state onto the canvas.
  const draw = useCallback(
    (cursorRow: number, cursorCol: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      if (canvas.width !== Math.floor(W * dpr) || canvas.height !== Math.floor(H * dpr)) {
        canvas.width = Math.floor(W * dpr);
        canvas.height = Math.floor(H * dpr);
      }
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = palette.canvas.bg;
      ctx.fillRect(0, 0, W, H);

      const n = gridSize;
      const cellSize = Math.floor(Math.min(W, H) / n);
      cellSizeRef.current = cellSize;
      const totalSize = cellSize * n;
      const offX = Math.floor((W - totalSize) / 2);
      const offY = Math.floor((H - totalSize) / 2);

      // Faint grid backdrop.
      ctx.fillStyle = "rgba(255,255,255,0.02)";
      ctx.fillRect(offX, offY, totalSize, totalSize);

      const grid = gridRef.current;
      for (let r = 0; r < n; r++) {
        for (let c = 0; c < n; c++) {
          const tile = grid[r * n + c] ?? null;
          const x = offX + c * cellSize;
          const y = offY + r * cellSize;
          if (!tile) {
            ctx.strokeStyle = "rgba(255,255,255,0.05)";
            ctx.lineWidth = 1;
            ctx.strokeRect(x + 0.5, y + 0.5, cellSize - 1, cellSize - 1);
            continue;
          }
          drawTileOnCanvas(ctx, x, y, cellSize, tile);
        }
      }

      // Highlight cursor cell.
      if (cursorRow >= 0 && cursorRow < n && cursorCol >= 0 && cursorCol < n && cellSize > 4) {
        const x = offX + cursorCol * cellSize;
        const y = offY + cursorRow * cellSize;
        ctx.strokeStyle = "rgba(179, 136, 255, 0.9)";
        ctx.lineWidth = 2;
        ctx.strokeRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
      }
    },
    [gridSize, dpr],
  );

  // Cells are filled from the bottom-right corner backwards, row by row. With
  // Set B this order needs a few hundred to a few thousand steps on every
  // offered size; started from the top-left corner the same search ran past
  // 200,000 steps in more than half of the test runs at 20 × 20.
  const cellAt = useCallback((k: number): number => gridSize * gridSize - 1 - k, [gridSize]);

  // The single search step. Returns true while still working.
  const step = useCallback((): boolean => {
    const grid = gridRef.current;
    const stack = stackRef.current;
    const n = gridSize;
    const tiles = activeSet.tiles;

    if (stack.length >= n * n) {
      // Done.
      return false;
    }
    const cell = cellAt(stack.length);
    const dom = domRef.current;

    // Candidates: tiles still in this cell's domain that also survive the
    // look-ahead across the rest of the grid.
    const candidates: number[] = [];
    for (let i = 0; i < tiles.length; i++) {
      if (dom[cell] & (1 << i) && assign(dom, n, sideMasks, cell, i)) candidates.push(i);
    }
    shuffle(candidates);

    if (candidates.length === 0) {
      // Backtrack: pop the top of the stack and try its next remaining choice.
      setBacktracks((b) => b + 1);
      while (stack.length > 0) {
        const top = stack[stack.length - 1];
        const topCell = cellAt(stack.length - 1);
        if (top.remaining.length > 0) {
          const nextIdx = top.remaining.shift()!;
          // Survived the look-ahead from `before` when it was listed, so
          // propagating it again cannot fail.
          domRef.current = assign(top.before, n, sideMasks, topCell, nextIdx) ?? top.before;
          grid[topCell] = tiles[nextIdx];
          return true;
        }
        grid[topCell] = null;
        stack.pop();
      }
      // Every alternative of every cell is refuted: no tiling of this grid exists.
      exhaustedRef.current = true;
      return false;
    }

    const firstIdx = candidates[0];
    domRef.current = assign(dom, n, sideMasks, cell, firstIdx) ?? dom;
    grid[cell] = tiles[firstIdx];
    stack.push({ before: dom, remaining: candidates.slice(1) });
    return true;
  }, [activeSet, gridSize, sideMasks, cellAt, shuffle]);

  // Reset state when set / size / restart / motion preference changes.
  useEffect(() => {
    const cells = gridSize * gridSize;
    gridRef.current = new Array<Tile | null>(cells).fill(null);
    domRef.current = new Int32Array(cells).fill((1 << activeSet.tiles.length) - 1);
    stackRef.current = [];
    exhaustedRef.current = false;
    setBacktracks(0);
    setOutcome("searching");
    lastStepTimeRef.current = 0;

    if (reduceMotion) {
      // Run the whole backtracking search in one synchronous pass and draw the
      // finished patch once, so the canvas never animates for reduced-motion users.
      // The budget only keeps this pass from freezing the page on a pathological
      // set; the offered sets finish far below it.
      const guardMax = cells * activeSet.tiles.length * 50;
      let working = true;
      let guard = 0;
      while (working && guard < guardMax) {
        working = step();
        guard++;
      }
      const stack = stackRef.current;
      setPlacedCount(stack.length);
      if (stack.length === cells) setOutcome("done");
      else if (exhaustedRef.current) setOutcome("impossible");
      else {
        setStepsSpent(guard);
        setOutcome("gaveUp");
      }
      draw(-1, -1); // -1 cursor: no highlight in the static render
      return;
    }

    setPlacedCount(0);
    draw(gridSize - 1, gridSize - 1);
  }, [setKey, gridSize, restartTick, reduceMotion, draw, step, activeSet]);

  // RAF loop. Skipped entirely under reduced motion (solved synchronously above)
  // and torn down once the search has finished, so it stops scheduling frames
  // instead of spinning forever.
  useEffect(() => {
    if (reduceMotion || outcome !== "searching") return;
    let cancelled = false;
    const loop = (t: number) => {
      if (cancelled) return;
      const interval = 1000 / Math.max(1, speed);
      const stepsThisFrame = Math.max(1, Math.floor((t - lastStepTimeRef.current) / interval));
      if (lastStepTimeRef.current === 0) lastStepTimeRef.current = t;
      if (t - lastStepTimeRef.current >= interval) {
        let working = true;
        for (let i = 0; i < stepsThisFrame && working; i++) {
          working = step();
        }
        lastStepTimeRef.current = t;
        const stack = stackRef.current;
        setPlacedCount(stack.length);
        if (!working) {
          // The animated search has no step budget, so it ends either with a
          // full grid or with a proof that none exists.
          setOutcome(stack.length === gridSize * gridSize ? "done" : "impossible");
        }
        // Next cell to fill, for highlighting; -1 once the grid is full.
        const next = working ? cellAt(stack.length) : -1;
        draw(next < 0 ? -1 : Math.floor(next / gridSize), next < 0 ? -1 : next % gridSize);
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelled = true;
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [step, speed, draw, gridSize, outcome, reduceMotion, cellAt]);

  // Re-render when the canvas resizes.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver(() => draw(-1, -1));
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [draw]);

  const totalCells = gridSize * gridSize;
  const progressPct = Math.min(100, (placedCount / totalCells) * 100);

  const paletteEntries = useMemo(
    () => COLOURS.map((hex, i) => ({ hex, name: COLOUR_NAMES[i] })),
    [],
  );

  return (
    <main className="flex min-h-screen flex-col pt-14">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_420px]">
        <div className="relative flex min-h-[60vh] flex-col gap-4 bg-ink-950 p-4 lg:min-h-[calc(100vh-3.5rem)] lg:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              {ex.searchLabel} · {ex.sets[setKey].name}
            </div>
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-violet">
              {ex.matchLabel}
            </div>
          </div>
          <div className="hairline relative flex-1 overflow-hidden rounded-2xl border bg-ink-950">
            <canvas
              ref={canvasRef}
              className="block h-full w-full"
              role="img"
              aria-label={ex.canvasAria}
            />
            <div className="pointer-events-none absolute right-3 top-3">
              <ExplorerHelpButton guide={WANG_GUIDE} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <Stat
              label={ex.statPlaced}
              value={`${placedCount} / ${totalCells}`}
              accent="text-signal-violet"
            />
            <Stat label={ex.statBacktracks} value={String(backtracks)} accent="text-signal-rose" />
            <Stat
              label={ex.statProgress}
              value={`${progressPct.toFixed(1)}%`}
              accent="text-signal-amber"
            />
            <Stat
              label={ex.statStatus}
              value={
                outcome === "done"
                  ? ex.statusComplete
                  : outcome === "impossible"
                    ? ex.statusImpossible
                    : outcome === "gaveUp"
                      ? ex.statusGaveUp.replace("{n}", String(stepsSpent))
                      : ex.statusSearching
              }
              accent={
                outcome === "done"
                  ? "text-signal-cyan"
                  : outcome === "searching"
                    ? "text-ink-200"
                    : "text-signal-rose"
              }
            />
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
              {ex.tileSetLabel}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(["A", "B", "C"] as TileSetKey[]).map((k) => (
                <button
                  key={k}
                  onClick={() => setSetKey(k)}
                  className={`rounded-md border px-3 py-2 text-center transition-colors ${
                    setKey === k
                      ? "border-signal-violet/60 bg-signal-violet/10 text-signal-violet"
                      : "hairline text-ink-200 hover:border-signal-violet/40 hover:text-ink-100"
                  }`}
                >
                  <div className="font-mono text-xs">Set {k}</div>
                  <div className="mt-0.5 font-mono text-[9px] text-ink-400">
                    {SETS[k].tiles.length} {ex.tilesUnit}
                  </div>
                </button>
              ))}
            </div>
            <p className="text-xs leading-relaxed text-ink-300">{ex.sets[setKey].description}</p>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="flex items-center justify-between">
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                {ex.gridSizeLabel}
              </div>
              <div className="font-mono text-xs text-signal-amber">
                {gridSize} × {gridSize}
              </div>
            </div>
            <input
              type="range"
              value={gridSize}
              min={4}
              max={24}
              step={1}
              onChange={(e) => setGridSize(parseInt(e.target.value))}
              aria-label={ex.gridSizeLabel}
              className="w-full accent-signal-amber"
            />
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="flex items-center justify-between">
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                {ex.speedLabel}
              </div>
              <div className="font-mono text-xs text-signal-amber">{speed} / s</div>
            </div>
            <input
              type="range"
              value={speed}
              min={1}
              max={400}
              step={1}
              onChange={(e) => setSpeed(parseInt(e.target.value))}
              aria-label={ex.speedLabel}
              className="w-full accent-signal-amber"
            />
          </div>

          <div className="hairline border-b p-5">
            <button
              onClick={() => setRestartTick((n) => n + 1)}
              className="w-full rounded-md border border-signal-violet/60 bg-signal-violet/10 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-violet transition-colors hover:bg-signal-violet/20"
            >
              {ex.restartLabel}
            </button>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {ex.paletteLabel}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {activeSet.tiles.map((t) => (
                <div key={t.id} className="flex flex-col items-center gap-1">
                  <TilePreview tile={t} size={56} />
                  <div className="font-mono text-[9px] text-ink-400">#{t.id}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {ex.edgeColoursLabel}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {paletteEntries.map((p, i) => (
                <div key={p.hex} className="flex items-center gap-2">
                  <span
                    className="hairline inline-block h-4 w-4 rounded-sm border"
                    style={{ background: p.hex }}
                  />
                  <span className="font-mono text-[10px] text-ink-300">
                    {i}: {p.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5">
            <Link
              href="/wang"
              className="hairline block w-full rounded-md border py-2 text-center font-mono text-[10px] uppercase tracking-widest2 text-ink-300 transition-colors hover:border-signal-violet/40 hover:text-signal-violet"
            >
              {u.back}
            </Link>
          </div>
        </aside>
      </div>
      <ExplorerGuideSection guide={WANG_GUIDE} storyHref="/wang" />
    </main>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function drawTileOnCanvas(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  tile: Tile,
) {
  const cx = x + size / 2;
  const cy = y + size / 2;
  // North
  ctx.fillStyle = COLOURS[tile.N];
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(x, y);
  ctx.lineTo(x + size, y);
  ctx.closePath();
  ctx.fill();
  // East
  ctx.fillStyle = COLOURS[tile.E];
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(x + size, y);
  ctx.lineTo(x + size, y + size);
  ctx.closePath();
  ctx.fill();
  // South
  ctx.fillStyle = COLOURS[tile.S];
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(x + size, y + size);
  ctx.lineTo(x, y + size);
  ctx.closePath();
  ctx.fill();
  // West
  ctx.fillStyle = COLOURS[tile.W];
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(x, y + size);
  ctx.lineTo(x, y);
  ctx.closePath();
  ctx.fill();

  if (size > 6) {
    ctx.strokeStyle = "rgba(0,0,0,0.35)";
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 0.5, y + 0.5, size - 1, size - 1);
  }
}

function TilePreview({ tile, size = 60 }: { tile: Tile; size?: number }) {
  const s = size;
  const c = s / 2;
  const tri = (a: [number, number], b: [number, number]) =>
    `M${c} ${c} L${a[0]} ${a[1]} L${b[0]} ${b[1]} Z`;
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} className="block">
      <path d={tri([0, 0], [s, 0])} fill={COLOURS[tile.N]} />
      <path d={tri([s, 0], [s, s])} fill={COLOURS[tile.E]} />
      <path d={tri([s, s], [0, s])} fill={COLOURS[tile.S]} />
      <path d={tri([0, s], [0, 0])} fill={COLOURS[tile.W]} />
      <rect x={0.5} y={0.5} width={s - 1} height={s - 1} fill="none" stroke="rgba(0,0,0,0.35)" />
    </svg>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="glass hairline rounded-md border px-3 py-2">
      <div className="font-mono text-[9px] uppercase tracking-widest2 text-ink-400">{label}</div>
      <div className={`font-mono text-sm ${accent}`}>{value}</div>
    </div>
  );
}
