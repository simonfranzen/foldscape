"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import type { Locale } from "@/lib/i18n/types";
import { useDpr } from "@/lib/hooks/useDpr";
import { palette } from "@/lib/visual/palette";

// --------------------------------------------------------------------------
// Königsberg Bridges Explorer
//
// Interactive bridge-walking. Four land masses (vertices) sit on a Canvas
// 2D map; bridges (edges) link them. The user picks a starting land mass
// and then clicks bridges to cross them. A bridge can be crossed iff:
//   (a) it is currently active (not removed),
//   (b) it is incident to the current land mass,
//   (c) it has not yet been visited.
// Visited bridges turn amber and grey out; the walk is shown as an amber
// path. If no legal move remains, we declare "Stuck!" and explain why.
//
// The sidebar:
//   - Start picker
//   - Toggle bridges (7 original + 3 hypothetical extras)
//   - Live degree counter for each vertex
//   - Eulerian indicator (path / circuit / neither)
//   - Reset walk
//   - Auto-solve: Hierholzer animation when the current graph is Eulerian
//
// All maths is recomputed in real time as bridges are toggled. No external
// state — pure React.
// --------------------------------------------------------------------------

type VertexId = "A" | "B" | "C" | "D";

interface VertexDef {
  id: VertexId;
  // Canvas coords (logical, in 800x500 space — we map to actual pixels).
  x: number;
  y: number;
  // Rough shape: rectangle (banks) or rounded blob (islands)
  shape: "bank-top" | "bank-bottom" | "island";
  // Sublabel kind so locale dict can supply the right translation per vertex.
  sublabel: "north-bank" | "south-bank" | "kneiphof" | "lomse";
}

interface BridgeDef {
  id: string;
  a: VertexId;
  b: VertexId;
  // Two control points for the curved bridge path in canvas coords.
  cx1: number;
  cy1: number;
  cx2: number;
  cy2: number;
  // Whether part of the original seven (just for labelling).
  original: boolean;
}

const VERTICES: VertexDef[] = [
  { id: "A", x: 400, y: 70, shape: "bank-top", sublabel: "north-bank" },
  { id: "B", x: 270, y: 250, shape: "island", sublabel: "kneiphof" },
  { id: "C", x: 530, y: 250, shape: "island", sublabel: "lomse" },
  { id: "D", x: 400, y: 430, shape: "bank-bottom", sublabel: "south-bank" },
];

// The seven historical bridges, with the canonical multiplicities (A-B: 2,
// A-C: 2, A-D: 1, B-D: 1, C-D: 1). Plus a B-C bridge (the "Honey Bridge")
// and a couple of hypothetical extras the user can toggle on.
const BRIDGES: BridgeDef[] = [
  // A-B: 2 bridges
  { id: "AB1", a: "A", b: "B", cx1: 320, cy1: 110, cx2: 240, cy2: 190, original: true },
  { id: "AB2", a: "A", b: "B", cx1: 380, cy1: 150, cx2: 310, cy2: 200, original: true },
  // A-C: 2 bridges
  { id: "AC1", a: "A", b: "C", cx1: 480, cy1: 110, cx2: 560, cy2: 190, original: true },
  { id: "AC2", a: "A", b: "C", cx1: 420, cy1: 150, cx2: 490, cy2: 200, original: true },
  // A-D: 1 bridge (the long one, drawn around the right side)
  { id: "AD", a: "A", b: "D", cx1: 720, cy1: 130, cx2: 720, cy2: 370, original: true },
  // B-D: 1 bridge
  { id: "BD", a: "B", b: "D", cx1: 240, cy1: 310, cx2: 320, cy2: 390, original: true },
  // C-D: 1 bridge
  { id: "CD", a: "C", b: "D", cx1: 560, cy1: 310, cx2: 480, cy2: 390, original: true },
  // Extras (off by default)
  { id: "BC", a: "B", b: "C", cx1: 350, cy1: 250, cx2: 450, cy2: 250, original: false },
  { id: "AD2", a: "A", b: "D", cx1: 80, cy1: 130, cx2: 80, cy2: 370, original: false },
  { id: "BC2", a: "B", b: "C", cx1: 350, cy1: 290, cx2: 450, cy2: 290, original: false },
];

const ORIGINAL_IDS = BRIDGES.filter((b) => b.original).map((b) => b.id);

// Logical canvas size — we'll map to device pixels in the render.
const CANVAS_W = 800;
const CANVAS_H = 500;

// --------------------------------------------------------------------------
// Per-locale strings for this explorer. Kept inline so the multi-locale
// prose lives next to the explorer it serves and doesn't fatten the shared
// i18n bundles.
// --------------------------------------------------------------------------

type RichExplorer = {
  // Top status bar
  bridgeWalkPrefix: string; // shown as "<prefix> <vertex letter>"
  statusNo: string;
  statusCircuit: string;
  statusPath: string;
  // Status / legend grid
  walkLabel: string;
  walkProgress: (visited: number, total: number) => string;
  walkComplete: string;
  parityLabel: string;
  paritySubDisconnected: string;
  paritySubOdd: (count: number) => string;
  paritySubZero: string;
  paritySubEnds: (a: string, b: string) => string;
  legendLabel: string;
  legendHint: string;
  // Stuck message
  stuckLabel: string;
  stuckHead: (v: string) => string;
  stuckReasonNone: (oddCount: number) => string;
  stuckReasonOther: string;
  // Sidebar — start picker
  startAt: string;
  currentlyAtPrefix: string; // shown as "<prefix> <vertex letter>"
  // Sidebar — degrees
  vertexDegrees: string;
  odd: string;
  even: string;
  degreeFootnote: string;
  // Sidebar — bridges
  bridges: string;
  originalOn: string;
  originalOff: string;
  extraOn: string;
  extraOff: string;
  bridgesFootnote: string;
  // Sidebar — actions
  resetWalk: string;
  autoEulerian: string;
  autoNotEulerian: string;
  autoHintEulerian: string;
  autoHintNotEulerian: string;
  // Sidebar — footer
  storyBack: string;
  // Canvas-drawn labels
  vertexNorthBank: string;
  vertexSouthBank: string;
  vertexKneiphof: string;
  vertexLomse: string;
  deg: string;
};

const EXPLORER: Record<Locale, RichExplorer> = {
  en: {
    bridgeWalkPrefix: "Bridge walk · currently at",
    statusNo: "Eulerian: no",
    statusCircuit: "Eulerian circuit",
    statusPath: "Eulerian path",
    walkLabel: "Walk",
    walkProgress: (v, t) => `${v} / ${t} bridges crossed`,
    walkComplete: "Complete walk — every bridge used exactly once.",
    parityLabel: "Parity",
    paritySubDisconnected: "Graph is disconnected",
    paritySubOdd: (n) => `${n} odd-degree vertices`,
    paritySubZero: "0 odd vertices — closed walk possible",
    paritySubEnds: (a, b) => `start at ${a}, end at ${b}`,
    legendLabel: "Legend",
    legendHint:
      "Click an amber bridge from your current vertex. Greyed dashed bridges are inactive.",
    stuckLabel: "Stuck!",
    stuckHead: (v) => `No unvisited bridge leaves ${v}. The walk cannot continue.`,
    stuckReasonNone: (n) =>
      `This graph has ${n} odd-degree vertices — Euler proved no Eulerian path can exist.`,
    stuckReasonOther: "Try a different starting vertex or change the bridge set.",
    startAt: "Start at",
    currentlyAtPrefix: "Currently at:",
    vertexDegrees: "Vertex degrees",
    odd: "odd",
    even: "even",
    degreeFootnote:
      "Eulerian path ⇔ at most two vertices have odd degree (and the graph is connected).",
    bridges: "Bridges",
    originalOn: "original ✓",
    originalOff: "original ✗",
    extraOn: "extra ✓",
    extraOff: "extra ✗",
    bridgesFootnote:
      "The seven historical bridges are on by default. Toggle them to see how the parity argument shifts. The Honey Bridge (BC) was built later — adding it changes everything.",
    resetWalk: "Reset walk",
    autoEulerian: "Auto-walk (Hierholzer)",
    autoNotEulerian: "Try a walk — show me where it fails",
    autoHintEulerian: "Animates Hierholzer's algorithm crossing every bridge exactly once.",
    autoHintNotEulerian:
      "Königsberg's seven bridges have no Eulerian path. Click to watch a greedy walk from the start and see it get stuck — that's the whole point of Euler's argument.",
    storyBack: "← Story",
    vertexNorthBank: "north bank",
    vertexSouthBank: "south bank",
    vertexKneiphof: "Kneiphof",
    vertexLomse: "Lomse",
    deg: "deg",
  },
  de: {
    bridgeWalkPrefix: "Brückenlauf · aktuell bei",
    statusNo: "Eulersch: nein",
    statusCircuit: "Eulerscher Kreis",
    statusPath: "Eulerscher Weg",
    walkLabel: "Lauf",
    walkProgress: (v, t) => `${v} / ${t} Brücken überquert`,
    walkComplete: "Vollständiger Lauf — jede Brücke genau einmal benutzt.",
    parityLabel: "Parität",
    paritySubDisconnected: "Graph ist unzusammenhängend",
    paritySubOdd: (n) => `${n} Knoten mit ungeradem Grad`,
    paritySubZero: "0 ungerade Knoten — geschlossener Lauf möglich",
    paritySubEnds: (a, b) => `Start bei ${a}, Ende bei ${b}`,
    legendLabel: "Legende",
    legendHint:
      "Klicke eine bernsteinfarbene Brücke vom aktuellen Knoten aus an. Grau gestrichelte Brücken sind inaktiv.",
    stuckLabel: "Festgefahren!",
    stuckHead: (v) => `Von ${v} aus führt keine unbenutzte Brücke weiter. Der Lauf endet hier.`,
    stuckReasonNone: (n) =>
      `Dieser Graph hat ${n} Knoten mit ungeradem Grad — Euler hat bewiesen, dass es keinen Eulerschen Weg geben kann.`,
    stuckReasonOther: "Probiere einen anderen Startknoten oder ändere die Brückenauswahl.",
    startAt: "Start bei",
    currentlyAtPrefix: "Aktuell bei:",
    vertexDegrees: "Knotengrade",
    odd: "ungerade",
    even: "gerade",
    degreeFootnote:
      "Eulerscher Weg ⇔ höchstens zwei Knoten haben ungeraden Grad (und der Graph ist zusammenhängend).",
    bridges: "Brücken",
    originalOn: "original ✓",
    originalOff: "original ✗",
    extraOn: "zusätzlich ✓",
    extraOff: "zusätzlich ✗",
    bridgesFootnote:
      "Die sieben historischen Brücken sind standardmäßig aktiv. Schalte sie um und beobachte, wie sich das Paritätsargument verschiebt. Die Honigbrücke (BC) wurde später gebaut — sie verändert alles.",
    resetWalk: "Lauf zurücksetzen",
    autoEulerian: "Auto-Lauf (Hierholzer)",
    autoNotEulerian: "Lauf versuchen — zeig mir, wo es scheitert",
    autoHintEulerian:
      "Animiert den Hierholzer-Algorithmus, der jede Brücke genau einmal überquert.",
    autoHintNotEulerian:
      "Die sieben Königsberger Brücken haben keinen Eulerschen Weg. Klicke, um einen gierigen Lauf vom Start zu sehen, der hängen bleibt — genau das ist Eulers Argument.",
    storyBack: "← Story",
    vertexNorthBank: "Nordufer",
    vertexSouthBank: "Südufer",
    vertexKneiphof: "Kneiphof",
    vertexLomse: "Lomse",
    deg: "Grad",
  },
  es: {
    bridgeWalkPrefix: "Recorrido de puentes · actualmente en",
    statusNo: "Euleriano: no",
    statusCircuit: "Circuito euleriano",
    statusPath: "Camino euleriano",
    walkLabel: "Recorrido",
    walkProgress: (v, t) => `${v} / ${t} puentes cruzados`,
    walkComplete: "Recorrido completo — cada puente usado exactamente una vez.",
    parityLabel: "Paridad",
    paritySubDisconnected: "El grafo está desconectado",
    paritySubOdd: (n) => `${n} vértices de grado impar`,
    paritySubZero: "0 vértices impares — recorrido cerrado posible",
    paritySubEnds: (a, b) => `empieza en ${a}, termina en ${b}`,
    legendLabel: "Leyenda",
    legendHint:
      "Haz clic en un puente ámbar desde tu vértice actual. Los puentes grises a trazos están inactivos.",
    stuckLabel: "¡Atascado!",
    stuckHead: (v) => `Ningún puente sin usar sale de ${v}. El recorrido no puede continuar.`,
    stuckReasonNone: (n) =>
      `Este grafo tiene ${n} vértices de grado impar — Euler demostró que no puede existir un camino euleriano.`,
    stuckReasonOther: "Prueba con otro vértice de inicio o cambia el conjunto de puentes.",
    startAt: "Empezar en",
    currentlyAtPrefix: "Actualmente en:",
    vertexDegrees: "Grados de los vértices",
    odd: "impar",
    even: "par",
    degreeFootnote:
      "Camino euleriano ⇔ a lo sumo dos vértices tienen grado impar (y el grafo es conexo).",
    bridges: "Puentes",
    originalOn: "original ✓",
    originalOff: "original ✗",
    extraOn: "extra ✓",
    extraOff: "extra ✗",
    bridgesFootnote:
      "Los siete puentes históricos están activos por defecto. Actívalos y desactívalos para ver cómo cambia el argumento de paridad. El Puente de la Miel (BC) se construyó después — añadirlo lo cambia todo.",
    resetWalk: "Reiniciar recorrido",
    autoEulerian: "Auto-recorrido (Hierholzer)",
    autoNotEulerian: "Intentar el recorrido — muéstrame dónde falla",
    autoHintEulerian:
      "Anima el algoritmo de Hierholzer cruzando cada puente exactamente una vez.",
    autoHintNotEulerian:
      "Los siete puentes de Königsberg no tienen camino euleriano. Haz clic para ver un recorrido voraz desde el inicio que se queda atascado — esa es la esencia del argumento de Euler.",
    storyBack: "← Historia",
    vertexNorthBank: "orilla norte",
    vertexSouthBank: "orilla sur",
    vertexKneiphof: "Kneiphof",
    vertexLomse: "Lomse",
    deg: "grado",
  },
  fr: {
    bridgeWalkPrefix: "Parcours des ponts · actuellement en",
    statusNo: "Eulérien : non",
    statusCircuit: "Circuit eulérien",
    statusPath: "Chemin eulérien",
    walkLabel: "Parcours",
    walkProgress: (v, t) => `${v} / ${t} ponts franchis`,
    walkComplete: "Parcours complet — chaque pont emprunté exactement une fois.",
    parityLabel: "Parité",
    paritySubDisconnected: "Le graphe n'est pas connexe",
    paritySubOdd: (n) => `${n} sommets de degré impair`,
    paritySubZero: "0 sommet impair — parcours fermé possible",
    paritySubEnds: (a, b) => `départ en ${a}, arrivée en ${b}`,
    legendLabel: "Légende",
    legendHint:
      "Clique sur un pont ambré depuis ton sommet courant. Les ponts gris en pointillés sont inactifs.",
    stuckLabel: "Bloqué !",
    stuckHead: (v) => `Aucun pont non visité ne part de ${v}. Le parcours ne peut continuer.`,
    stuckReasonNone: (n) =>
      `Ce graphe a ${n} sommets de degré impair — Euler a prouvé qu'aucun chemin eulérien ne peut exister.`,
    stuckReasonOther: "Essaie un autre sommet de départ ou change l'ensemble des ponts.",
    startAt: "Départ en",
    currentlyAtPrefix: "Actuellement en :",
    vertexDegrees: "Degrés des sommets",
    odd: "impair",
    even: "pair",
    degreeFootnote:
      "Chemin eulérien ⇔ au plus deux sommets ont un degré impair (et le graphe est connexe).",
    bridges: "Ponts",
    originalOn: "original ✓",
    originalOff: "original ✗",
    extraOn: "extra ✓",
    extraOff: "extra ✗",
    bridgesFootnote:
      "Les sept ponts historiques sont actifs par défaut. Active-les et désactive-les pour voir comment l'argument de parité bascule. Le Pont du Miel (BC) a été construit plus tard — l'ajouter change tout.",
    resetWalk: "Réinitialiser le parcours",
    autoEulerian: "Auto-parcours (Hierholzer)",
    autoNotEulerian: "Tenter un parcours — montre-moi où ça échoue",
    autoHintEulerian:
      "Anime l'algorithme de Hierholzer qui traverse chaque pont exactement une fois.",
    autoHintNotEulerian:
      "Les sept ponts de Königsberg n'ont pas de chemin eulérien. Clique pour voir un parcours glouton depuis le départ qui finit bloqué — c'est tout l'argument d'Euler.",
    storyBack: "← Récit",
    vertexNorthBank: "rive nord",
    vertexSouthBank: "rive sud",
    vertexKneiphof: "Kneiphof",
    vertexLomse: "Lomse",
    deg: "deg",
  },
  it: {
    bridgeWalkPrefix: "Percorso dei ponti · attualmente in",
    statusNo: "Euleriano: no",
    statusCircuit: "Circuito euleriano",
    statusPath: "Cammino euleriano",
    walkLabel: "Percorso",
    walkProgress: (v, t) => `${v} / ${t} ponti attraversati`,
    walkComplete: "Percorso completo — ogni ponte usato esattamente una volta.",
    parityLabel: "Parità",
    paritySubDisconnected: "Il grafo è sconnesso",
    paritySubOdd: (n) => `${n} vertici di grado dispari`,
    paritySubZero: "0 vertici dispari — percorso chiuso possibile",
    paritySubEnds: (a, b) => `parti da ${a}, arrivi a ${b}`,
    legendLabel: "Legenda",
    legendHint:
      "Clicca un ponte ambra dal tuo vertice corrente. I ponti grigi tratteggiati sono inattivi.",
    stuckLabel: "Bloccato!",
    stuckHead: (v) => `Nessun ponte non visitato esce da ${v}. Il percorso non può continuare.`,
    stuckReasonNone: (n) =>
      `Questo grafo ha ${n} vertici di grado dispari — Euler ha dimostrato che non può esistere un cammino euleriano.`,
    stuckReasonOther: "Prova un altro vertice di partenza o modifica l'insieme dei ponti.",
    startAt: "Parti da",
    currentlyAtPrefix: "Attualmente in:",
    vertexDegrees: "Gradi dei vertici",
    odd: "dispari",
    even: "pari",
    degreeFootnote:
      "Cammino euleriano ⇔ al più due vertici hanno grado dispari (e il grafo è connesso).",
    bridges: "Ponti",
    originalOn: "originale ✓",
    originalOff: "originale ✗",
    extraOn: "extra ✓",
    extraOff: "extra ✗",
    bridgesFootnote:
      "I sette ponti storici sono attivi di default. Attivali e disattivali per vedere come cambia l'argomento di parità. Il Ponte del Miele (BC) è stato costruito dopo — aggiungerlo cambia tutto.",
    resetWalk: "Reimposta percorso",
    autoEulerian: "Auto-percorso (Hierholzer)",
    autoNotEulerian: "Prova un percorso — mostrami dove fallisce",
    autoHintEulerian:
      "Anima l'algoritmo di Hierholzer che attraversa ogni ponte esattamente una volta.",
    autoHintNotEulerian:
      "I sette ponti di Königsberg non ammettono un cammino euleriano. Clicca per vedere un percorso goloso dal punto di partenza che si blocca — è esattamente l'argomento di Euler.",
    storyBack: "← Storia",
    vertexNorthBank: "riva nord",
    vertexSouthBank: "riva sud",
    vertexKneiphof: "Kneiphof",
    vertexLomse: "Lomse",
    deg: "grado",
  },
  pt: {
    bridgeWalkPrefix: "Percurso das pontes · atualmente em",
    statusNo: "Euleriano: não",
    statusCircuit: "Circuito euleriano",
    statusPath: "Caminho euleriano",
    walkLabel: "Percurso",
    walkProgress: (v, t) => `${v} / ${t} pontes atravessadas`,
    walkComplete: "Percurso completo — cada ponte usada exatamente uma vez.",
    parityLabel: "Paridade",
    paritySubDisconnected: "O grafo está desconectado",
    paritySubOdd: (n) => `${n} vértices de grau ímpar`,
    paritySubZero: "0 vértices ímpares — percurso fechado possível",
    paritySubEnds: (a, b) => `comece em ${a}, termine em ${b}`,
    legendLabel: "Legenda",
    legendHint:
      "Clica numa ponte âmbar a partir do teu vértice atual. Pontes cinzentas tracejadas estão inativas.",
    stuckLabel: "Encalhado!",
    stuckHead: (v) => `Nenhuma ponte não visitada sai de ${v}. O percurso não pode continuar.`,
    stuckReasonNone: (n) =>
      `Este grafo tem ${n} vértices de grau ímpar — Euler provou que não pode existir caminho euleriano.`,
    stuckReasonOther: "Tenta outro vértice de partida ou altera o conjunto de pontes.",
    startAt: "Começar em",
    currentlyAtPrefix: "Atualmente em:",
    vertexDegrees: "Graus dos vértices",
    odd: "ímpar",
    even: "par",
    degreeFootnote:
      "Caminho euleriano ⇔ no máximo dois vértices têm grau ímpar (e o grafo é conexo).",
    bridges: "Pontes",
    originalOn: "original ✓",
    originalOff: "original ✗",
    extraOn: "extra ✓",
    extraOff: "extra ✗",
    bridgesFootnote:
      "As sete pontes históricas estão ativas por defeito. Alterna-as para ver como o argumento de paridade muda. A Ponte do Mel (BC) foi construída mais tarde — adicioná-la muda tudo.",
    resetWalk: "Reiniciar percurso",
    autoEulerian: "Auto-percurso (Hierholzer)",
    autoNotEulerian: "Tentar um percurso — mostra-me onde falha",
    autoHintEulerian:
      "Anima o algoritmo de Hierholzer a atravessar cada ponte exatamente uma vez.",
    autoHintNotEulerian:
      "As sete pontes de Königsberg não têm caminho euleriano. Clica para ver um percurso ganancioso desde o início que fica encalhado — é o cerne do argumento de Euler.",
    storyBack: "← História",
    vertexNorthBank: "margem norte",
    vertexSouthBank: "margem sul",
    vertexKneiphof: "Kneiphof",
    vertexLomse: "Lomse",
    deg: "grau",
  },
  sv: {
    bridgeWalkPrefix: "Brovandring · just nu vid",
    statusNo: "Eulersk: nej",
    statusCircuit: "Eulerkrets",
    statusPath: "Eulerväg",
    walkLabel: "Vandring",
    walkProgress: (v, t) => `${v} / ${t} broar korsade`,
    walkComplete: "Fullständig vandring — varje bro använd exakt en gång.",
    parityLabel: "Paritet",
    paritySubDisconnected: "Grafen är osammanhängande",
    paritySubOdd: (n) => `${n} hörn med udda grad`,
    paritySubZero: "0 udda hörn — sluten vandring möjlig",
    paritySubEnds: (a, b) => `börja vid ${a}, sluta vid ${b}`,
    legendLabel: "Teckenförklaring",
    legendHint:
      "Klicka på en bärnstensfärgad bro från ditt nuvarande hörn. Gråa streckade broar är inaktiva.",
    stuckLabel: "Fast!",
    stuckHead: (v) => `Ingen oanvänd bro lämnar ${v}. Vandringen kan inte fortsätta.`,
    stuckReasonNone: (n) =>
      `Den här grafen har ${n} hörn med udda grad — Euler bevisade att ingen Eulerväg kan finnas.`,
    stuckReasonOther: "Prova ett annat starthörn eller ändra broarna.",
    startAt: "Börja vid",
    currentlyAtPrefix: "Just nu vid:",
    vertexDegrees: "Hörnens grader",
    odd: "udda",
    even: "jämn",
    degreeFootnote:
      "Eulerväg ⇔ högst två hörn har udda grad (och grafen är sammanhängande).",
    bridges: "Broar",
    originalOn: "original ✓",
    originalOff: "original ✗",
    extraOn: "extra ✓",
    extraOff: "extra ✗",
    bridgesFootnote:
      "De sju historiska broarna är på som standard. Slå av och på dem för att se hur paritetsargumentet förskjuts. Honungsbron (BC) byggdes senare — att lägga till den ändrar allt.",
    resetWalk: "Återställ vandring",
    autoEulerian: "Auto-vandring (Hierholzer)",
    autoNotEulerian: "Försök en vandring — visa var det går fel",
    autoHintEulerian: "Animerar Hierholzers algoritm som korsar varje bro exakt en gång.",
    autoHintNotEulerian:
      "Königsbergs sju broar har ingen Eulerväg. Klicka för att se en girig vandring från starten som fastnar — det är hela poängen med Eulers argument.",
    storyBack: "← Berättelse",
    vertexNorthBank: "norra stranden",
    vertexSouthBank: "södra stranden",
    vertexKneiphof: "Kneiphof",
    vertexLomse: "Lomse",
    deg: "grad",
  },
  no: {
    bridgeWalkPrefix: "Brovandring · nå ved",
    statusNo: "Eulersk: nei",
    statusCircuit: "Eulerkrets",
    statusPath: "Eulervei",
    walkLabel: "Vandring",
    walkProgress: (v, t) => `${v} / ${t} broer krysset`,
    walkComplete: "Fullført vandring — hver bro brukt nøyaktig én gang.",
    parityLabel: "Paritet",
    paritySubDisconnected: "Grafen er usammenhengende",
    paritySubOdd: (n) => `${n} hjørner med odde grad`,
    paritySubZero: "0 odde hjørner — lukket vandring mulig",
    paritySubEnds: (a, b) => `start ved ${a}, slutt ved ${b}`,
    legendLabel: "Tegnforklaring",
    legendHint:
      "Klikk en ravfarget bro fra hjørnet du står ved. Grå stiplede broer er inaktive.",
    stuckLabel: "Fastlåst!",
    stuckHead: (v) => `Ingen ubrukt bro går ut fra ${v}. Vandringen kan ikke fortsette.`,
    stuckReasonNone: (n) =>
      `Denne grafen har ${n} hjørner med odde grad — Euler beviste at ingen Eulervei kan finnes.`,
    stuckReasonOther: "Prøv et annet starthjørne eller endre brosettet.",
    startAt: "Start ved",
    currentlyAtPrefix: "Nå ved:",
    vertexDegrees: "Hjørnegrader",
    odd: "odde",
    even: "jevn",
    degreeFootnote:
      "Eulervei ⇔ høyst to hjørner har odde grad (og grafen er sammenhengende).",
    bridges: "Broer",
    originalOn: "original ✓",
    originalOff: "original ✗",
    extraOn: "ekstra ✓",
    extraOff: "ekstra ✗",
    bridgesFootnote:
      "De sju historiske broene er på som standard. Slå dem av og på for å se hvordan paritetsargumentet skifter. Honningbroen (BC) ble bygget senere — å legge den til endrer alt.",
    resetWalk: "Tilbakestill vandring",
    autoEulerian: "Auto-vandring (Hierholzer)",
    autoNotEulerian: "Prøv en vandring — vis meg hvor den feiler",
    autoHintEulerian: "Animerer Hierholzers algoritme som krysser hver bro nøyaktig én gang.",
    autoHintNotEulerian:
      "Königsbergs sju broer har ingen Eulervei. Klikk for å se en grådig vandring fra starten som setter seg fast — det er hele poenget med Eulers argument.",
    storyBack: "← Fortelling",
    vertexNorthBank: "nordbredden",
    vertexSouthBank: "sørbredden",
    vertexKneiphof: "Kneiphof",
    vertexLomse: "Lomse",
    deg: "grad",
  },
};

function vertexSublabel(v: VertexDef, dict: RichExplorer): string {
  switch (v.sublabel) {
    case "north-bank":
      return `${v.id} — ${dict.vertexNorthBank}`;
    case "south-bank":
      return `${v.id} — ${dict.vertexSouthBank}`;
    case "kneiphof":
      return `${v.id} — ${dict.vertexKneiphof}`;
    case "lomse":
      return `${v.id} — ${dict.vertexLomse}`;
  }
}

function curvePoint(
  b: BridgeDef,
  t: number,
  verts: Record<VertexId, VertexDef>,
): { x: number; y: number } {
  // Cubic Bezier from vert a -> b through cx1/cy1, cx2/cy2.
  const va = verts[b.a];
  const vb = verts[b.b];
  const mt = 1 - t;
  const x =
    mt * mt * mt * va.x + 3 * mt * mt * t * b.cx1 + 3 * mt * t * t * b.cx2 + t * t * t * vb.x;
  const y =
    mt * mt * mt * va.y + 3 * mt * mt * t * b.cy1 + 3 * mt * t * t * b.cy2 + t * t * t * vb.y;
  return { x, y };
}

function distSqToCurve(
  b: BridgeDef,
  px: number,
  py: number,
  verts: Record<VertexId, VertexDef>,
): number {
  let best = Infinity;
  for (let i = 0; i <= 24; i++) {
    const t = i / 24;
    const p = curvePoint(b, t, verts);
    const d = (p.x - px) ** 2 + (p.y - py) ** 2;
    if (d < best) best = d;
  }
  return best;
}

function computeDegrees(activeIds: Set<string>): Record<VertexId, number> {
  const deg: Record<VertexId, number> = { A: 0, B: 0, C: 0, D: 0 };
  for (const br of BRIDGES) {
    if (!activeIds.has(br.id)) continue;
    deg[br.a] += 1;
    deg[br.b] += 1;
  }
  return deg;
}

function isConnected(activeIds: Set<string>): boolean {
  // BFS over vertices that have at least one active edge. If every such
  // vertex is reachable from any other, we call the graph connected.
  const adj: Record<VertexId, VertexId[]> = { A: [], B: [], C: [], D: [] };
  for (const br of BRIDGES) {
    if (!activeIds.has(br.id)) continue;
    adj[br.a].push(br.b);
    adj[br.b].push(br.a);
  }
  const used: VertexId[] = (["A", "B", "C", "D"] as VertexId[]).filter((v) => adj[v].length > 0);
  if (used.length === 0) return true;
  const seen = new Set<VertexId>([used[0]]);
  const stack: VertexId[] = [used[0]];
  while (stack.length > 0) {
    const v = stack.pop()!;
    for (const n of adj[v]) {
      if (!seen.has(n)) {
        seen.add(n);
        stack.push(n);
      }
    }
  }
  return used.every((v) => seen.has(v));
}

type EulerStatus =
  | { kind: "circuit"; oddCount: 0 }
  | { kind: "path"; oddCount: 2; ends: [VertexId, VertexId] }
  | { kind: "none"; oddCount: number }
  | { kind: "disconnected" };

function classifyGraph(activeIds: Set<string>): EulerStatus {
  if (!isConnected(activeIds)) return { kind: "disconnected" };
  const deg = computeDegrees(activeIds);
  const odd: VertexId[] = (["A", "B", "C", "D"] as VertexId[]).filter((v) => deg[v] % 2 === 1);
  if (odd.length === 0) return { kind: "circuit", oddCount: 0 };
  if (odd.length === 2) return { kind: "path", oddCount: 2, ends: [odd[0], odd[1]] };
  return { kind: "none", oddCount: odd.length };
}

// Hierholzer's algorithm. Returns an ordered list of bridge ids forming an
// Eulerian path/circuit, or null if none exists.
function hierholzer(activeIds: Set<string>, status: EulerStatus): string[] | null {
  if (status.kind !== "circuit" && status.kind !== "path") return null;
  // Adjacency list of (neighbour, bridgeId).
  const adj: Record<VertexId, Array<{ to: VertexId; id: string }>> = { A: [], B: [], C: [], D: [] };
  for (const br of BRIDGES) {
    if (!activeIds.has(br.id)) continue;
    adj[br.a].push({ to: br.b, id: br.id });
    adj[br.b].push({ to: br.a, id: br.id });
  }
  const start: VertexId =
    status.kind === "path"
      ? status.ends[0]
      : ((["A", "B", "C", "D"] as VertexId[]).find((v) => adj[v].length > 0) ?? "A");
  const used = new Set<string>();
  const stack: VertexId[] = [start];
  const trail: VertexId[] = [];
  const trailEdges: string[] = [];
  // We'll record an edge each time we backtrack from a vertex; classic
  // Hierholzer trick.
  const edgeStack: string[] = [];
  while (stack.length > 0) {
    const v = stack[stack.length - 1];
    // Find any unused edge from v.
    const next = adj[v].find((e) => !used.has(e.id));
    if (next) {
      used.add(next.id);
      stack.push(next.to);
      edgeStack.push(next.id);
    } else {
      trail.push(stack.pop()!);
      const e = edgeStack.pop();
      if (e !== undefined) trailEdges.push(e);
    }
  }
  trailEdges.reverse();
  return trailEdges;
}

export default function KonigsbergExplorer() {
  const { a, u, locale } = useI18n();
  const topic = a.topics.konigsberg;
  const dict = EXPLORER[locale];
  const dpr = useDpr();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sizeRef = useRef<{ w: number; h: number; dpr: number }>({ w: 0, h: 0, dpr: 1 });

  const [activeIds, setActiveIds] = useState<Set<string>>(() => new Set(ORIGINAL_IDS));
  const [startVertex, setStartVertex] = useState<VertexId>("A");
  const [currentVertex, setCurrentVertex] = useState<VertexId>("A");
  const [walk, setWalk] = useState<string[]>([]); // ordered bridge ids
  const [stuck, setStuck] = useState<boolean>(false);
  const [auto, setAuto] = useState<{ trail: string[]; idx: number } | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);

  const vertsById = useMemo(() => {
    const m: Record<VertexId, VertexDef> = {
      A: VERTICES[0],
      B: VERTICES[1],
      C: VERTICES[2],
      D: VERTICES[3],
    };
    return m;
  }, []);

  const degrees = useMemo(() => computeDegrees(activeIds), [activeIds]);
  const status = useMemo(() => classifyGraph(activeIds), [activeIds]);

  // Reset the walk when the active graph or the start vertex changes.
  const resetWalk = useCallback(() => {
    setWalk([]);
    setStuck(false);
    setCurrentVertex(startVertex);
    setAuto(null);
  }, [startVertex]);

  useEffect(() => {
    resetWalk();
  }, [activeIds, startVertex, resetWalk]);

  // Determine if the walker is stuck (no legal moves from current vertex
  // among unvisited active bridges).
  useEffect(() => {
    if (auto !== null) return;
    if (walk.length === 0 && !stuck) {
      // At start; check if there is at least one bridge to walk.
      const hasMove = BRIDGES.some(
        (b) => activeIds.has(b.id) && (b.a === currentVertex || b.b === currentVertex),
      );
      if (!hasMove) setStuck(true);
      return;
    }
    const visited = new Set(walk);
    const hasMove = BRIDGES.some(
      (b) =>
        activeIds.has(b.id) &&
        !visited.has(b.id) &&
        (b.a === currentVertex || b.b === currentVertex),
    );
    if (!hasMove && walk.length < [...activeIds].length) setStuck(true);
  }, [walk, currentVertex, activeIds, auto, stuck]);

  // Auto-walk animation tick. When the trail is exhausted we release `auto`
  // so the stuck-detection effect can run — important for the greedy-walk
  // mode where the walk ends prematurely and we want the "Stuck!" message
  // to appear automatically.
  useEffect(() => {
    if (auto === null) return;
    if (auto.idx >= auto.trail.length) {
      const release = setTimeout(() => setAuto(null), 500);
      return () => clearTimeout(release);
    }
    const t = setTimeout(() => {
      const id = auto.trail[auto.idx];
      const br = BRIDGES.find((b) => b.id === id);
      if (!br) return;
      setWalk((w) => [...w, id]);
      setCurrentVertex((cv) => (br.a === cv ? br.b : br.a));
      setAuto((s) => (s === null ? null : { trail: s.trail, idx: s.idx + 1 }));
    }, 650);
    return () => clearTimeout(t);
  }, [auto]);

  // Greedy random walk used when the graph is NOT Eulerian. This is the
  // whole point of the Königsberg page — show the user that they get stuck,
  // not just disable the button. From the start vertex we pick any unused
  // incident bridge until none remain; the trail length will be < total
  // active bridges and the UI will display "stuck" after the animation.
  const greedyWalk = useCallback(
    (start: VertexId): string[] => {
      const adj: Record<VertexId, Array<{ to: VertexId; id: string }>> = {
        A: [], B: [], C: [], D: [],
      };
      for (const br of BRIDGES) {
        if (!activeIds.has(br.id)) continue;
        adj[br.a].push({ to: br.b, id: br.id });
        adj[br.b].push({ to: br.a, id: br.id });
      }
      const used = new Set<string>();
      const trail: string[] = [];
      let cur = start;
      while (true) {
        const candidates = adj[cur].filter((e) => !used.has(e.id));
        if (candidates.length === 0) break;
        const pick = candidates[Math.floor(Math.random() * candidates.length)];
        used.add(pick.id);
        trail.push(pick.id);
        cur = pick.to;
      }
      return trail;
    },
    [activeIds],
  );

  const startAutoSolve = useCallback(() => {
    const eulerianTrail = hierholzer(activeIds, status);
    if (eulerianTrail !== null) {
      const startV: VertexId = status.kind === "path" ? status.ends[0] : startVertex;
      setStartVertex(startV);
      setWalk([]);
      setStuck(false);
      setCurrentVertex(startV);
      setAuto({ trail: eulerianTrail, idx: 0 });
      return;
    }
    // Not Eulerian — show why by walking greedily until stuck.
    const trail = greedyWalk(startVertex);
    if (trail.length === 0) return;
    setWalk([]);
    setStuck(false);
    setCurrentVertex(startVertex);
    setAuto({ trail, idx: 0 });
  }, [activeIds, status, startVertex, greedyWalk]);

  const toggleBridge = useCallback((id: string) => {
    setActiveIds((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // --- Canvas drawing ----------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const render = () => {
      const cssW = canvas.clientWidth;
      const cssH = canvas.clientHeight;
      if (cssW === 0 || cssH === 0) return;
      const W = Math.floor(cssW * dpr);
      const H = Math.floor(cssH * dpr);
      canvas.width = W;
      canvas.height = H;
      sizeRef.current = { w: W, h: H, dpr };
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, W, H);

      // Background — schematic river and banks.
      const sx = W / CANVAS_W;
      const sy = H / CANVAS_H;
      ctx.fillStyle = palette.canvas.bg;
      ctx.fillRect(0, 0, W, H);

      // River bands
      ctx.fillStyle = "rgba(125,243,255,0.04)";
      ctx.fillRect(0, 160 * sy, W, 200 * sy);
      ctx.strokeStyle = "rgba(125,243,255,0.18)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, 180 * sy);
      ctx.bezierCurveTo(200 * sx, 170 * sy, 400 * sx, 190 * sy, 800 * sx, 180 * sy);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, 340 * sy);
      ctx.bezierCurveTo(200 * sx, 330 * sy, 400 * sx, 350 * sy, 800 * sx, 340 * sy);
      ctx.stroke();

      // Land masses
      for (const v of VERTICES) {
        const cx = v.x * sx;
        const cy = v.y * sy;
        const isCurrent = currentVertex === v.id;
        const isStart = startVertex === v.id;
        if (v.shape === "bank-top") {
          ctx.fillStyle = "rgba(138,144,164,0.16)";
          roundRect(ctx, 40 * sx, 10 * sy, 720 * sx, 120 * sy, 36 * sx);
          ctx.fill();
        } else if (v.shape === "bank-bottom") {
          ctx.fillStyle = "rgba(138,144,164,0.16)";
          roundRect(ctx, 40 * sx, 370 * sy, 720 * sx, 120 * sy, 36 * sx);
          ctx.fill();
        } else {
          // Island — rounded blob around vertex.
          ctx.fillStyle = "rgba(138,144,164,0.20)";
          ctx.beginPath();
          ctx.ellipse(cx, cy, 90 * sx, 55 * sy, 0, 0, Math.PI * 2);
          ctx.fill();
        }

        // Vertex disc
        ctx.beginPath();
        ctx.arc(cx, cy, 26 * Math.min(sx, sy), 0, Math.PI * 2);
        ctx.fillStyle = isCurrent
          ? "rgba(255,209,102,0.95)"
          : isStart
            ? "rgba(255,209,102,0.45)"
            : palette.canvas.bgAlt;
        ctx.fill();
        ctx.strokeStyle = palette.signal.amber;
        ctx.lineWidth = 1.8 * dpr;
        ctx.stroke();

        ctx.fillStyle = isCurrent ? palette.canvas.bgAlt : palette.signal.amber;
        ctx.font = `${20 * Math.min(sx, sy)}px ui-monospace, monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(v.id, cx, cy);

        ctx.fillStyle = palette.canvas.muted;
        ctx.font = `${11 * dpr}px ui-monospace, monospace`;
        ctx.fillText(vertexSublabel(v, dict), cx, cy + 50 * Math.min(sx, sy));
        ctx.fillText(`${dict.deg} ${degrees[v.id]}`, cx, cy + 66 * Math.min(sx, sy));
      }

      // Bridges
      const visited = new Set(walk);
      for (const br of BRIDGES) {
        const active = activeIds.has(br.id);
        const hit = visited.has(br.id);
        const isHover = hoverId === br.id;
        const va = vertsById[br.a];
        const vb = vertsById[br.b];

        ctx.beginPath();
        ctx.moveTo(va.x * sx, va.y * sy);
        ctx.bezierCurveTo(br.cx1 * sx, br.cy1 * sy, br.cx2 * sx, br.cy2 * sy, vb.x * sx, vb.y * sy);
        if (!active) {
          ctx.strokeStyle = "rgba(138,144,164,0.18)";
          ctx.setLineDash([6, 8]);
          ctx.lineWidth = 1.6 * dpr;
        } else if (hit) {
          ctx.strokeStyle = "rgba(255,209,102,0.35)";
          ctx.setLineDash([]);
          ctx.lineWidth = 2.4 * dpr;
        } else if (isHover) {
          ctx.strokeStyle = palette.signal.amber;
          ctx.setLineDash([]);
          ctx.lineWidth = 4 * dpr;
        } else {
          ctx.strokeStyle = "rgba(255,209,102,0.85)";
          ctx.setLineDash([]);
          ctx.lineWidth = 2.4 * dpr;
        }
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Walk overlay — small numbered markers showing the order.
      for (let i = 0; i < walk.length; i++) {
        const br = BRIDGES.find((b) => b.id === walk[i]);
        if (!br) continue;
        const m = curvePoint(br, 0.5, vertsById);
        ctx.beginPath();
        ctx.arc(m.x * sx, m.y * sy, 12 * dpr, 0, Math.PI * 2);
        ctx.fillStyle = palette.signal.amber;
        ctx.fill();
        ctx.fillStyle = palette.canvas.bgAlt;
        ctx.font = `bold ${11 * dpr}px ui-monospace, monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(String(i + 1), m.x * sx, m.y * sy);
      }
    };

    render();
    const ro = new ResizeObserver(render);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [activeIds, walk, currentVertex, startVertex, degrees, hoverId, vertsById, dict, dpr]);

  // --- Canvas click handler ----------------------------------------------
  const onCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (auto !== null) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const cssX = e.clientX - rect.left;
      const cssY = e.clientY - rect.top;
      const logicalX = (cssX / rect.width) * CANVAS_W;
      const logicalY = (cssY / rect.height) * CANVAS_H;

      // Find nearest active bridge curve.
      const visited = new Set(walk);
      let nearestId: string | null = null;
      let nearestD = Infinity;
      for (const br of BRIDGES) {
        if (!activeIds.has(br.id)) continue;
        if (visited.has(br.id)) continue;
        const d = distSqToCurve(br, logicalX, logicalY, vertsById);
        if (d < nearestD) {
          nearestD = d;
          nearestId = br.id;
        }
      }
      if (nearestId === null) return;
      if (nearestD > 30 * 30) return;
      const br = BRIDGES.find((b) => b.id === nearestId)!;
      if (br.a !== currentVertex && br.b !== currentVertex) return;
      const next = br.a === currentVertex ? br.b : br.a;
      setWalk((w) => [...w, br.id]);
      setCurrentVertex(next);
    },
    [auto, activeIds, walk, currentVertex, vertsById],
  );

  const onCanvasMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (auto !== null) {
        if (hoverId !== null) setHoverId(null);
        return;
      }
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const cssX = e.clientX - rect.left;
      const cssY = e.clientY - rect.top;
      const logicalX = (cssX / rect.width) * CANVAS_W;
      const logicalY = (cssY / rect.height) * CANVAS_H;
      const visited = new Set(walk);
      let nearestId: string | null = null;
      let nearestD = Infinity;
      for (const br of BRIDGES) {
        if (!activeIds.has(br.id)) continue;
        if (visited.has(br.id)) continue;
        if (br.a !== currentVertex && br.b !== currentVertex) continue;
        const d = distSqToCurve(br, logicalX, logicalY, vertsById);
        if (d < nearestD) {
          nearestD = d;
          nearestId = br.id;
        }
      }
      if (nearestId !== null && nearestD < 30 * 30) {
        if (hoverId !== nearestId) setHoverId(nearestId);
      } else if (hoverId !== null) {
        setHoverId(null);
      }
    },
    [auto, activeIds, walk, currentVertex, hoverId, vertsById],
  );

  const activeBridgeCount = activeIds.size;
  const visitedCount = walk.length;
  const allCrossed = visitedCount === activeBridgeCount && activeBridgeCount > 0;

  let statusLabel = dict.statusNo;
  let statusSub: string =
    status.kind === "disconnected"
      ? dict.paritySubDisconnected
      : dict.paritySubOdd(status.kind === "none" ? status.oddCount : 0);
  if (status.kind === "circuit") {
    statusLabel = dict.statusCircuit;
    statusSub = dict.paritySubZero;
  } else if (status.kind === "path") {
    statusLabel = dict.statusPath;
    statusSub = dict.paritySubEnds(status.ends[0], status.ends[1]);
  }

  return (
    <main className="flex min-h-screen flex-col pt-14">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_420px]">
        <div className="relative flex min-h-[60vh] flex-col gap-4 bg-ink-950 p-4 lg:min-h-[calc(100vh-3.5rem)] lg:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              {dict.bridgeWalkPrefix}{" "}
              <span className="text-signal-teal">{currentVertex}</span>
            </div>
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-teal">
              {statusLabel}
            </div>
          </div>

          <div className="hairline overflow-hidden rounded-2xl border bg-ink-950">
            {/* Logical canvas is 800×500. Without aspect-[8/5] the canvas
                stretched to whatever vertical space the flex column gave it,
                so bridges rendered tall and warped and the hit-curve maths
                drifted from where the user clicked. Pin the ratio. */}
            <canvas
              ref={canvasRef}
              className="block aspect-[8/5] w-full cursor-pointer"
              onClick={onCanvasClick}
              onMouseMove={onCanvasMove}
              onMouseLeave={() => setHoverId(null)}
            />
          </div>

          {/* Status / legend bar */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="glass hairline rounded-md border px-3 py-3 font-mono text-[10px] tracking-widest2 text-ink-200">
              <div className="uppercase text-signal-teal">{dict.walkLabel}</div>
              <div className="mt-1 text-ink-100">
                {dict.walkProgress(visitedCount, activeBridgeCount)}
              </div>
              {allCrossed && <div className="mt-1 text-signal-teal">{dict.walkComplete}</div>}
            </div>
            <div className="glass hairline rounded-md border px-3 py-3 font-mono text-[10px] tracking-widest2 text-ink-200">
              <div className="uppercase text-signal-teal">{dict.parityLabel}</div>
              <div className="mt-1 text-ink-100">{statusSub}</div>
            </div>
            <div className="glass hairline rounded-md border px-3 py-3 font-mono text-[10px] tracking-widest2 text-ink-200">
              <div className="uppercase text-signal-teal">{dict.legendLabel}</div>
              <div className="mt-1 text-ink-100">{dict.legendHint}</div>
            </div>
          </div>

          {stuck && !allCrossed && (
            <div className="glass hairline rounded-md border px-4 py-3 font-mono text-xs text-signal-teal">
              <div className="text-[10px] uppercase tracking-widest2">{dict.stuckLabel}</div>
              <div className="mt-1 text-ink-100">
                {dict.stuckHead(currentVertex)}{" "}
                {status.kind === "none"
                  ? dict.stuckReasonNone(status.oddCount)
                  : dict.stuckReasonOther}
              </div>
            </div>
          )}
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
              {dict.startAt}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {VERTICES.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setStartVertex(v.id)}
                  className={`rounded-md border py-2 font-mono text-sm transition-colors ${
                    startVertex === v.id
                      ? "border-signal-teal/60 bg-signal-teal/10 text-signal-teal"
                      : "hairline text-ink-200 hover:border-signal-teal/40 hover:text-ink-100"
                  }`}
                >
                  {v.id}
                </button>
              ))}
            </div>
            <div className="font-mono text-[10px] text-ink-400">
              {dict.currentlyAtPrefix}{" "}
              <span className="text-signal-teal">{currentVertex}</span>
            </div>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {dict.vertexDegrees}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {(["A", "B", "C", "D"] as VertexId[]).map((v) => {
                const odd = degrees[v] % 2 === 1;
                return (
                  <div
                    key={v}
                    className={`hairline rounded-md border py-2 text-center font-mono text-sm ${
                      odd ? "border-signal-teal/40 text-signal-teal" : "text-ink-100"
                    }`}
                  >
                    <div className="text-[10px] text-ink-400">{v}</div>
                    <div>{degrees[v]}</div>
                    <div className="text-[9px] uppercase text-ink-400">
                      {odd ? dict.odd : dict.even}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="font-mono text-[10px] leading-relaxed text-ink-400">
              {dict.degreeFootnote}
            </div>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {dict.bridges}
            </div>
            <div className="space-y-1">
              {BRIDGES.map((br) => {
                const on = activeIds.has(br.id);
                return (
                  <button
                    key={br.id}
                    onClick={() => toggleBridge(br.id)}
                    className={`flex w-full items-center justify-between rounded-md border px-3 py-2 font-mono text-xs transition-colors ${
                      on
                        ? "border-signal-teal/40 bg-signal-teal/5 text-signal-teal"
                        : "hairline text-ink-400 hover:text-ink-200"
                    }`}
                  >
                    <span>
                      {br.a} — {br.b} <span className="text-ink-500">· {br.id}</span>
                    </span>
                    <span className="text-[10px] uppercase tracking-widest2">
                      {br.original
                        ? on
                          ? dict.originalOn
                          : dict.originalOff
                        : on
                          ? dict.extraOn
                          : dict.extraOff}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="font-mono text-[10px] leading-relaxed text-ink-400">
              {dict.bridgesFootnote}
            </div>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <button
              onClick={resetWalk}
              className="hairline w-full rounded-md border py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-signal-teal/40 hover:text-signal-teal"
            >
              {dict.resetWalk}
            </button>
            <button
              onClick={startAutoSolve}
              className="w-full rounded-md border border-signal-teal/60 bg-signal-teal/10 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-teal transition-colors hover:bg-signal-teal/20"
            >
              {status.kind === "circuit" || status.kind === "path"
                ? dict.autoEulerian
                : dict.autoNotEulerian}
            </button>
            <div className="font-mono text-[10px] leading-relaxed text-ink-400">
              {status.kind === "circuit" || status.kind === "path"
                ? dict.autoHintEulerian
                : dict.autoHintNotEulerian}
            </div>
          </div>

          <div className="p-5">
            <Link
              href="/konigsberg"
              className="hairline mb-2 block w-full rounded-md border py-2 text-center font-mono text-[10px] uppercase tracking-widest2 text-ink-300 transition-colors hover:border-signal-teal/40 hover:text-signal-teal"
            >
              {dict.storyBack}
            </Link>
            <Link
              href="/"
              className="hairline block w-full rounded-md border py-2 text-center font-mono text-[10px] uppercase tracking-widest2 text-ink-300 transition-colors hover:border-signal-teal/40 hover:text-signal-teal"
            >
              {u.back}
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}

// Small helper for rounded rectangles on the canvas (banks).
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.lineTo(x + w - rr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
  ctx.lineTo(x + w, y + h - rr);
  ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
  ctx.lineTo(x + rr, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
  ctx.lineTo(x, y + rr);
  ctx.quadraticCurveTo(x, y, x + rr, y);
  ctx.closePath();
}
