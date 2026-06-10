"use client";

import Link from "next/link";
import { StoryPageShell, StoryCard } from "@/components/StoryPageShell";
import { Reveal } from "@/components/Reveal";
import { useI18n } from "@/lib/i18n/context";
import { WangTileGrid } from "@/components/WangTileGrid";
import { WangAperiodicTiler } from "@/components/WangAperiodicTiler";
import { palette } from "@/lib/visual/palette";
import type { Locale } from "@/lib/i18n/types";
import type { StoryPage } from "@/lib/i18n/stories";

// Computation is cyan in the Cathedral's colour code.
const ACCENT = "text-signal-cyan";

// Edge-colour palette shared with the components.
const C = [palette.signal.cyan, palette.signal.violet, palette.signal.amber, palette.signal.rose];

// ─── Tiny inline tile diagram for the Encounter card 02 ──────────────────────
// A minimal valid 2×2 patch. The chosen tiles' shared edges agree.

function MiniTile({ nesw, size = 44 }: { nesw: [number, number, number, number]; size?: number }) {
  const s = size;
  const c = s / 2;
  const [n, e, sCol, w] = nesw;
  const tri = (a: [number, number], b: [number, number]) =>
    `M${c} ${c} L${a[0]} ${a[1]} L${b[0]} ${b[1]} Z`;
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} className="block">
      <path d={tri([0, 0], [s, 0])} fill={C[n]} />
      <path d={tri([s, 0], [s, s])} fill={C[e]} />
      <path d={tri([s, s], [0, s])} fill={C[sCol]} />
      <path d={tri([0, s], [0, 0])} fill={C[w]} />
      <rect
        x={0.5}
        y={0.5}
        width={s - 1}
        height={s - 1}
        fill="none"
        stroke="rgba(255,255,255,0.18)"
      />
    </svg>
  );
}

// Three tiles whose colour assignments admit exactly one 2×2 placement.
// Tile A: N=0 E=1 S=1 W=1
// Tile B: N=1 E=1 S=0 W=1
// Tile C: N=0 E=1 S=0 W=1
// 2×2:  [A B]   [C C]   — A.E=B.W=1, C.E=C.W=1, A.S=C.N=0 … etc.
// We just show A and B and a tiled 2×2 patch as a teaching diagram.
const TILE_A: [number, number, number, number] = [0, 1, 1, 1];
const TILE_B: [number, number, number, number] = [1, 1, 0, 1];
const TILE_C: [number, number, number, number] = [0, 1, 0, 1];

// ─── Rich story content per locale ───────────────────────────────────────────

type RichStory = {
  page: StoryPage;
  encounter: {
    pretitle: string;
    title: string;
    cards: Array<{ label: string; title: string; body: string }>;
    tryIt: string;
  };
  sections: Array<{ pretitle: string; title: string; body: string }>;
  closingTitle: string;
  closingBody: string;
  ctaLabel: string;
  tilingCaption: string;
  tilingHint: string;
  tilingPalette: string;
  tilingOk: string;
  tilingBad: string;
  tilingClear: string;
  tilingScore: (placed: number, valid: number) => string;
  aperiodicCaption: string;
  aperiodicHint: string;
  aperiodicSetLabel: string;
  aperiodicRandomize: string;
};

const en: RichStory = {
  page: {
    pretitle: "Topic · Computation",
    title: "Wang Tiles",
    tagline: "Squares with coloured edges that quietly carry any computation.",
    intro:
      "Hao Wang's 1961 puzzle — match the colours on touching edges — turned out to hide the halting problem inside a children's matching game. Below: the rules, the surprise, and two interactives that let you place tiles by hand and watch an aperiodic patch grow.",
    ctaInteractive: "→ Open the Explorer",
    sections: [],
  },
  encounter: {
    pretitle: "First encounter",
    title: "Match the edges. That's the whole game.",
    cards: [
      {
        label: "01",
        title: "The big idea",
        body: "Take a square. Paint each of its four edges a colour. That's a Wang tile. Place several side by side, but only where the edges that touch share a colour — north against south, east against west, with no rotations allowed. From that one rule, in a way nobody saw coming in 1961, you can encode any computation a machine can do.",
      },
      {
        label: "02",
        title: "A concrete example",
        body: "Three tiles, four edge colours. The bottom row is two copies of tile A; the top row is two copies of tile B. A's east edge matches A's west; B's east matches B's west; and A's north matches B's south. One small patch — and you have already discovered that some tile sets click together and others can't.",
      },
      {
        label: "03",
        title: "Why it matters",
        body: "In 1966 Robert Berger proved that no algorithm can decide, in general, whether a given Wang tile set tiles the plane. To do it he built a set of 20,426 tiles that tile only aperiodically — no translation of the pattern ever maps it back to itself. The line of work that followed shrank that record from 20,426 to 13 (Culik, 1996) to 11 (Jeandel–Rao, 2015) and lit the path to Penrose tilings and the modern aperiodic monotile.",
      },
    ],
    tryIt:
      "Below: place tiles yourself so every shared edge matches, then watch an 11- or 13-tile aperiodic set fill a region.",
  },
  sections: [
    {
      pretitle: "Section 01 · Wang's question",
      title: "Can you decide if a tile set tiles the plane?",
      body: "In 1961 the logician Hao Wang asked a deceptively concrete question: given a finite set of square tiles with coloured edges, is there an algorithm that decides whether copies of them (no rotations, no reflections) can be assembled into a tiling of the entire infinite plane? Wang's own conjecture said yes — and stronger, he believed every tile set that tiles the plane must admit some periodic tiling, a pattern that repeats by translation. If that were true, a finite check would settle the Domino Problem once and for all. The plane would yield to a finite calculation.",
    },
    {
      pretitle: "Section 02 · Berger's theorem",
      title: "Undecidable. And aperiodic tile sets exist.",
      body: "In 1966, Wang's student Robert Berger destroyed both halves of the conjecture in one stroke. He constructed a set of 20,426 Wang tiles that does tile the plane — but only aperiodically. No translation of any tiling using that set ever maps it back to itself. And he proved the Domino Problem is undecidable: no algorithm, no clever finite check, will tell you in general whether a tile set tiles the plane at all. A finite list of squares with coloured edges can be Turing-complete in disguise.",
    },
    {
      pretitle: "Section 03 · Encoding computation",
      title: "Turing machines, painted onto edges",
      body: "Berger's construction is a translation: take any Turing machine and produce a Wang tile set that tiles the upper half-plane if and only if the machine never halts on its blank input. Each row of tiles spells out one full machine configuration — the tape contents and the head position — and each row-to-row transition is forced by edge-matching to be exactly one step of the machine. The infinite tiling, if it exists, is the infinite computation. Asking «does this tile set tile?» becomes «does this machine run forever?» — and the latter is the halting problem, the oldest undecidable problem we know.",
    },
    {
      pretitle: "Section 04 · From 20,426 to 11",
      title: "Robinson, Culik, Jeandel–Rao",
      body: "Berger's 20,426 tiles were a proof, not a sculpture. The decades that followed were a hunt for the smallest aperiodic Wang set. Raphael Robinson got it down to 56 in 1971 with a cleaner hierarchical construction. In 1996 Jarkko Kari published 14, then Karel Culik II, building directly on Kari's ideas, found 13 the same year — a record that stood for nearly two decades. In 2015 Emmanuel Jeandel and Michaël Rao proved by exhaustive computer search that 11 is the true minimum: there is an aperiodic set of 11 Wang tiles, and no set of 10 or fewer can be aperiodic. The story has a finite answer, and it is 11.",
    },
    {
      pretitle: "Section 05 · Quasicrystals",
      title: "Penrose, Shechtman, and patterns that refuse to repeat",
      body: "In 1974 Roger Penrose published an aperiodic tiling using just two rhombi — a kinder, more geometric cousin of Berger's monsters. Ten years later, in 1984, Dan Shechtman observed sharp diffraction patterns with five-fold symmetry in a rapidly cooled aluminium-manganese alloy — physically forbidden for any periodic crystal. The structure he had found was a quasicrystal: matter arranged in an aperiodic pattern. Wang tiles had been the conceptual ancestor of both. A combinatorial game about coloured edges turned out to describe a phase of matter that won Shechtman the 2011 Nobel Prize in Chemistry.",
    },
    {
      pretitle: "Section 06 · The aperiodic monotile",
      title: "2023 — one tile is enough",
      body: "For more than half a century the open question was whether a single tile could force aperiodicity — an «einstein», from German ein Stein, one stone. In March 2023, David Smith, Joseph Myers, Craig Kaplan, and Chaim Goodman-Strauss announced the hat: a 13-sided polygon that tiles the plane only aperiodically, using reflections. Two months later the same team produced the spectre, an aperiodic monotile that needs no reflections. The chain that started with Wang's 1961 conjecture — through Berger's 20,426, Robinson's 56, Culik's 13, Jeandel–Rao's 11 — terminates, six decades later, at 1.",
    },
  ],
  closingTitle: "Place a tile. The plane decides.",
  closingBody:
    "The Explorer lets you switch between an explicitly periodic set and the aperiodic ones, watch the algorithm backtrack live when it paints itself into a corner, and zoom into any region of the growing patch. Everything you just read is one click away.",
  ctaLabel: "→ Open the Explorer",
  tilingCaption: "Interactive · place tiles, edges must match",
  tilingPalette: "Palette · 8 tiles",
  tilingHint:
    "Click a cell to cycle through eight tiles; click again past the last one to clear it. A red ring marks a tile whose edge disagrees with a neighbour. Try to fill the 3×3 with every shared edge matching — some configurations have many solutions, others none.",
  tilingOk: "Every edge matches.",
  tilingBad: "Some edges don't match.",
  tilingClear: "Clear",
  tilingScore: (placed, valid) => `${placed} placed · ${valid} valid`,
  aperiodicCaption: "Interactive · grow an aperiodic patch",
  aperiodicSetLabel: "Tile set",
  aperiodicRandomize: "New seed",
  aperiodicHint:
    "A randomised backtracking search fills the canvas, cell by cell, with tiles drawn from the chosen set. Whichever set you pick, the patch never settles into a small repeating block — that is what aperiodic means.",
};

const de: RichStory = {
  page: {
    pretitle: "Thema · Berechnung",
    title: "Wang-Kacheln",
    tagline: "Quadrate mit gefärbten Kanten, die heimlich jede Berechnung tragen.",
    intro:
      "Hao Wangs Puzzle von 1961 — passende Farben an berührenden Kanten — entpuppte sich als das Halteproblem in einem Kinderspiel. Unten: die Regeln, die Überraschung, und zwei Interaktionen, in denen du selbst Kacheln legst und einer aperiodischen Fläche beim Wachsen zusiehst.",
    ctaInteractive: "→ Explorer öffnen",
    sections: [],
  },
  encounter: {
    pretitle: "Erste Begegnung",
    title: "Kanten matchen. Das ist das ganze Spiel.",
    cards: [
      {
        label: "01",
        title: "Die große Idee",
        body: "Nimm ein Quadrat. Färbe jede der vier Kanten. Das ist eine Wang-Kachel. Leg mehrere nebeneinander, aber nur dort, wo sich berührende Kanten die Farbe teilen — Nord gegen Süd, Ost gegen West, ohne Drehungen. Aus dieser einen Regel lässt sich, auf eine Art, die 1961 niemand kommen sah, jede Berechnung kodieren, die eine Maschine ausführen kann.",
      },
      {
        label: "02",
        title: "Ein konkretes Beispiel",
        body: "Drei Kacheln, vier Kantenfarben. Untere Reihe: zwei Kopien von Kachel A. Obere Reihe: zwei Kopien von Kachel B. A.Ost passt zu A.West, B.Ost zu B.West, und A.Nord passt zu B.Süd. Ein kleiner Ausschnitt — und schon hast du entdeckt, dass manche Kachelsätze ineinandergreifen und andere nicht.",
      },
      {
        label: "03",
        title: "Warum es zählt",
        body: "1966 bewies Robert Berger, dass kein Algorithmus allgemein entscheiden kann, ob ein gegebener Wang-Kachelsatz die Ebene kachelt. Dafür baute er einen Satz aus 20 426 Kacheln, der die Ebene nur aperiodisch kachelt — keine Translation des Musters bildet es je auf sich selbst ab. Die Folgeforschung schrumpfte diesen Rekord von 20 426 auf 13 (Culik 1996) und 11 (Jeandel–Rao 2015) und ebnete den Weg zu Penrose-Mustern und zur modernen aperiodischen Monokachel.",
      },
    ],
    tryIt:
      "Unten: leg selbst Kacheln so, dass jede gemeinsame Kante passt, dann sieh einem 11- oder 13-Kacheln-Satz beim Füllen einer Fläche zu.",
  },
  sections: [
    {
      pretitle: "Abschnitt 01 · Wangs Frage",
      title: "Lässt sich entscheiden, ob ein Kachelsatz die Ebene kachelt?",
      body: "1961 stellte der Logiker Hao Wang eine täuschend konkrete Frage: Gibt es zu einem endlichen Satz quadratischer Kacheln mit gefärbten Kanten einen Algorithmus, der entscheidet, ob sich Kopien davon (ohne Drehungen, ohne Spiegelungen) zu einer Kachelung der gesamten unendlichen Ebene zusammenfügen lassen? Wangs eigene Vermutung war: ja — und stärker, jeder Kachelsatz, der die Ebene kachelt, müsse auch eine periodische Kachelung zulassen, ein Muster, das sich durch Translation wiederholt. Wäre das wahr, würde eine endliche Prüfung das Dominoproblem ein für alle Mal klären. Die Ebene würde einer endlichen Rechnung weichen.",
    },
    {
      pretitle: "Abschnitt 02 · Bergers Satz",
      title: "Unentscheidbar. Und aperiodische Kachelsätze existieren.",
      body: "1966 zerschlug Wangs Schüler Robert Berger beide Hälften der Vermutung in einem Zug. Er konstruierte einen Satz aus 20 426 Wang-Kacheln, der die Ebene tatsächlich kachelt — aber nur aperiodisch. Keine Translation einer Kachelung mit diesem Satz bildet sie je auf sich selbst ab. Und er bewies, dass das Dominoproblem unentscheidbar ist: kein Algorithmus, keine clevere endliche Prüfung kann allgemein sagen, ob ein Kachelsatz die Ebene überhaupt kachelt. Eine endliche Liste farbiger Quadrate kann verkappt Turing-vollständig sein.",
    },
    {
      pretitle: "Abschnitt 03 · Berechnung kodieren",
      title: "Turing-Maschinen, auf Kanten gemalt",
      body: "Bergers Konstruktion ist eine Übersetzung: nimm irgendeine Turing-Maschine und erzeuge daraus einen Wang-Kachelsatz, der die obere Halbebene genau dann kachelt, wenn die Maschine bei leerem Band nie hält. Jede Kachelreihe buchstabiert eine vollständige Maschinenkonfiguration — Bandinhalt und Kopfposition — und jeder Übergang von Reihe zu Reihe wird durch die Kantenfarben gezwungen, exakt ein Maschinenschritt zu sein. Die unendliche Kachelung, falls sie existiert, ist die unendliche Rechnung. Aus «kachelt dieser Satz?» wird «läuft diese Maschine ewig?» — und das ist das Halteproblem, das älteste bekannte unentscheidbare Problem.",
    },
    {
      pretitle: "Abschnitt 04 · Von 20 426 zu 11",
      title: "Robinson, Culik, Jeandel–Rao",
      body: "Bergers 20 426 Kacheln waren ein Beweis, keine Skulptur. Die folgenden Jahrzehnte waren eine Jagd nach dem kleinsten aperiodischen Wang-Satz. Raphael Robinson drückte ihn 1971 mit einer saubereren hierarchischen Konstruktion auf 56. 1996 veröffentlichte Jarkko Kari 14; Karel Culik II baute direkt auf Karis Ideen auf und fand im selben Jahr 13 — ein Rekord, der fast zwei Jahrzehnte hielt. 2015 bewiesen Emmanuel Jeandel und Michaël Rao per erschöpfender Computersuche, dass 11 das wahre Minimum ist: es gibt einen aperiodischen Satz aus 11 Wang-Kacheln, und keiner aus 10 oder weniger kann aperiodisch sein. Die Geschichte hat eine endliche Antwort, und sie heißt 11.",
    },
    {
      pretitle: "Abschnitt 05 · Quasikristalle",
      title: "Penrose, Shechtman und Muster, die sich weigern zu wiederholen",
      body: "1974 veröffentlichte Roger Penrose eine aperiodische Kachelung mit nur zwei Rauten — ein freundlicherer, geometrischerer Cousin von Bergers Monstern. Zehn Jahre später, 1984, beobachtete Dan Shechtman in einer schnell abgekühlten Aluminium-Mangan-Legierung scharfe Beugungsmuster mit fünfzähliger Symmetrie — für jeden periodischen Kristall physikalisch verboten. Die Struktur, die er gefunden hatte, war ein Quasikristall: Materie in einem aperiodischen Muster angeordnet. Wang-Kacheln waren der gedankliche Ahn von beidem. Ein kombinatorisches Spiel über gefärbte Kanten beschrieb plötzlich eine Phase der Materie, für die Shechtman 2011 den Nobelpreis für Chemie erhielt.",
    },
    {
      pretitle: "Abschnitt 06 · Die aperiodische Monokachel",
      title: "2023 — eine Kachel reicht",
      body: "Über ein halbes Jahrhundert war offen, ob eine einzige Kachel Aperiodizität erzwingen kann — ein «einstein», ein Stein. Im März 2023 verkündeten David Smith, Joseph Myers, Craig Kaplan und Chaim Goodman-Strauss den Hut: ein 13-eckiges Vieleck, das die Ebene nur aperiodisch kachelt, mit Spiegelungen. Zwei Monate später lieferte dasselbe Team den Spectre, eine aperiodische Monokachel ohne Spiegelungen. Die Kette, die mit Wangs Vermutung von 1961 begann — über Bergers 20 426, Robinsons 56, Culiks 13, Jeandel–Raos 11 — endet sechs Jahrzehnte später bei 1.",
    },
  ],
  closingTitle: "Leg eine Kachel. Die Ebene entscheidet.",
  closingBody:
    "Der Explorer lässt dich zwischen einem explizit periodischen und den aperiodischen Sätzen wechseln, dem Algorithmus live beim Backtracking zusehen, wenn er sich verläuft, und in jede Region der wachsenden Fläche zoomen. Alles, was du gerade gelesen hast, ist einen Klick entfernt.",
  ctaLabel: "→ Explorer öffnen",
  tilingCaption: "Interaktiv · Kacheln legen, Kanten müssen passen",
  tilingPalette: "Palette · 8 Kacheln",
  tilingHint:
    "Klick eine Zelle, um durch acht Kacheln zu schalten; nach der letzten wird sie wieder leer. Ein roter Ring markiert eine Kachel, deren Kante mit einem Nachbarn nicht übereinstimmt. Versuch, die 3×3 so zu füllen, dass jede gemeinsame Kante passt — manche Konfigurationen haben viele Lösungen, andere keine.",
  tilingOk: "Jede Kante passt.",
  tilingBad: "Einige Kanten passen nicht.",
  tilingClear: "Leeren",
  tilingScore: (placed, valid) => `${placed} gelegt · ${valid} gültig`,
  aperiodicCaption: "Interaktiv · aperiodische Fläche wachsen lassen",
  aperiodicSetLabel: "Kachelsatz",
  aperiodicRandomize: "Neuer Seed",
  aperiodicHint:
    "Eine randomisierte Backtracking-Suche füllt die Leinwand Zelle für Zelle mit Kacheln aus dem gewählten Satz. Egal welchen Satz du wählst, die Fläche fällt nie in einen kleinen sich wiederholenden Block — genau das heißt aperiodisch.",
};

const es: RichStory = {
  page: {
    pretitle: "Tema · Computación",
    title: "Teselas de Wang",
    tagline: "Cuadrados con aristas de colores que llevan, en silencio, cualquier cómputo.",
    intro:
      "El acertijo de Hao Wang de 1961 — encajar colores en las aristas que se tocan — escondía el problema de la parada dentro de un juego de niños. Abajo: las reglas, la sorpresa y dos interacciones para colocar teselas a mano y ver crecer un parche aperiódico.",
    ctaInteractive: "→ Abrir el Explorador",
    sections: [],
  },
  encounter: {
    pretitle: "Primer encuentro",
    title: "Encaja las aristas. Ese es todo el juego.",
    cards: [
      {
        label: "01",
        title: "La gran idea",
        body: "Toma un cuadrado. Pinta cada una de sus cuatro aristas. Esa es una tesela de Wang. Pon varias lado a lado, pero solo donde las aristas que se tocan comparten color — norte contra sur, este contra oeste, sin giros. De esa única regla, de un modo que en 1961 nadie vio venir, se puede codificar cualquier cómputo que una máquina sepa hacer.",
      },
      {
        label: "02",
        title: "Un ejemplo concreto",
        body: "Tres teselas, cuatro colores de arista. Fila de abajo: dos copias de la tesela A. Fila de arriba: dos copias de la tesela B. A.este encaja con A.oeste, B.este con B.oeste, y A.norte encaja con B.sur. Un pequeño parche — y ya descubriste que hay conjuntos que encajan y otros que no.",
      },
      {
        label: "03",
        title: "Por qué importa",
        body: "En 1966 Robert Berger demostró que ningún algoritmo decide, en general, si un conjunto dado de teselas de Wang tesela el plano. Para hacerlo construyó un conjunto de 20 426 teselas que tesela el plano solo de forma aperiódica — ninguna traslación del patrón lo deja invariante. Los trabajos siguientes redujeron el récord de 20 426 a 13 (Culik, 1996) y a 11 (Jeandel–Rao, 2015), y abrieron el camino a las teselaciones de Penrose y al moderno monotile aperiódico.",
      },
    ],
    tryIt:
      "Abajo: coloca tú mismo las teselas para que toda arista compartida encaje, y luego mira a un conjunto de 11 o 13 teselas aperiódicas llenar una región.",
  },
  sections: [
    {
      pretitle: "Sección 01 · La pregunta de Wang",
      title: "¿Se puede decidir si un conjunto tesela el plano?",
      body: "En 1961 el lógico Hao Wang planteó una pregunta engañosamente concreta: dado un conjunto finito de cuadrados con aristas coloreadas, ¿existe un algoritmo que decida si copias suyas (sin giros, sin reflexiones) se pueden ensamblar en una teselación de todo el plano infinito? La propia conjetura de Wang decía que sí — y más fuerte: todo conjunto que tesela el plano debe admitir alguna teselación periódica, un patrón que se repite por traslación. Si fuera cierto, una comprobación finita zanjaría el Problema del Dominó de una vez. El plano cedería ante un cálculo finito.",
    },
    {
      pretitle: "Sección 02 · El teorema de Berger",
      title: "Indecidible. Y existen conjuntos aperiódicos.",
      body: "En 1966 el discípulo de Wang, Robert Berger, derribó ambas mitades de la conjetura de un golpe. Construyó un conjunto de 20 426 teselas de Wang que sí tesela el plano — pero solo aperiódicamente. Ninguna traslación de una teselación con ese conjunto lo deja invariante. Y demostró que el Problema del Dominó es indecidible: ningún algoritmo, ninguna comprobación finita, dirá en general si un conjunto tesela el plano. Una lista finita de cuadrados coloreados puede ser Turing-completa disfrazada.",
    },
    {
      pretitle: "Sección 03 · Cómputo en la teselación",
      title: "Máquinas de Turing, pintadas en aristas",
      body: "La construcción de Berger es una traducción: toma una máquina de Turing y produce un conjunto de teselas de Wang que tesela el semiplano superior si y solo si la máquina nunca se detiene con cinta en blanco. Cada fila de teselas deletrea una configuración completa de la máquina — el contenido de la cinta y la posición del cabezal — y cada transición de fila a fila queda forzada por las aristas a ser exactamente un paso de la máquina. La teselación infinita, si existe, es el cómputo infinito. «¿Tesela este conjunto?» se vuelve «¿esta máquina corre para siempre?» — y eso es el problema de la parada.",
    },
    {
      pretitle: "Sección 04 · De 20 426 a 11",
      title: "Robinson, Culik, Jeandel–Rao",
      body: "Las 20 426 teselas de Berger eran demostración, no escultura. Las décadas siguientes fueron una caza del menor conjunto aperiódico. Raphael Robinson lo bajó a 56 en 1971 con una construcción jerárquica más limpia. En 1996 Jarkko Kari publicó 14; Karel Culik II, apoyándose directamente en las ideas de Kari, encontró 13 ese mismo año — un récord que se sostuvo casi dos décadas. En 2015 Emmanuel Jeandel y Michaël Rao demostraron por búsqueda computacional exhaustiva que 11 es el mínimo verdadero: hay un conjunto aperiódico de 11 teselas de Wang, y ninguno de 10 o menos puede serlo. La historia tiene respuesta finita, y es 11.",
    },
    {
      pretitle: "Sección 05 · Cuasicristales",
      title: "Penrose, Shechtman y patrones que se niegan a repetirse",
      body: "En 1974 Roger Penrose publicó una teselación aperiódica con apenas dos rombos — un primo más amable y geométrico de los monstruos de Berger. Diez años después, en 1984, Dan Shechtman observó patrones de difracción nítidos con simetría quíntuple en una aleación de aluminio-manganeso enfriada de golpe — físicamente prohibidos para cualquier cristal periódico. Lo que había encontrado era un cuasicristal: materia dispuesta en un patrón aperiódico. Las teselas de Wang fueron el ancestro conceptual de ambos. Un juego combinatorio sobre aristas coloreadas describía, de pronto, una fase de la materia que valió a Shechtman el Nobel de Química de 2011.",
    },
    {
      pretitle: "Sección 06 · El monotile aperiódico",
      title: "2023 — basta una tesela",
      body: "Durante más de medio siglo la pregunta abierta era si una sola tesela podía forzar la aperiodicidad — un «einstein», una piedra. En marzo de 2023, David Smith, Joseph Myers, Craig Kaplan y Chaim Goodman-Strauss anunciaron el «hat»: un polígono de 13 lados que tesela el plano solo aperiódicamente, usando reflexiones. Dos meses después el mismo equipo produjo el «spectre», un monotile aperiódico que no necesita reflexiones. La cadena que arrancó con la conjetura de Wang en 1961 — por las 20 426 de Berger, las 56 de Robinson, las 13 de Culik, las 11 de Jeandel–Rao — termina, seis décadas después, en 1.",
    },
  ],
  closingTitle: "Coloca una tesela. El plano decide.",
  closingBody:
    "El Explorador deja cambiar entre un conjunto explícitamente periódico y los aperiódicos, ver al algoritmo retroceder en vivo cuando se mete en un callejón, y hacer zoom en cualquier región del parche que crece. Todo lo que acabas de leer está a un clic.",
  ctaLabel: "→ Abrir el Explorador",
  tilingCaption: "Interactivo · coloca teselas, las aristas deben encajar",
  tilingPalette: "Paleta · 8 teselas",
  tilingHint:
    "Pulsa una celda para ciclar entre ocho teselas; otra pulsación más allá de la última la vacía. Un anillo rojo marca una tesela cuya arista no concuerda con la vecina. Intenta llenar el 3×3 con todas las aristas compartidas en acuerdo — algunas configuraciones tienen muchas soluciones, otras ninguna.",
  tilingOk: "Toda arista encaja.",
  tilingBad: "Hay aristas que no encajan.",
  tilingClear: "Vaciar",
  tilingScore: (placed, valid) => `${placed} colocadas · ${valid} válidas`,
  aperiodicCaption: "Interactivo · hacer crecer un parche aperiódico",
  aperiodicSetLabel: "Conjunto",
  aperiodicRandomize: "Nueva semilla",
  aperiodicHint:
    "Una búsqueda con retroceso aleatorizada llena el lienzo, celda a celda, con teselas del conjunto elegido. Sea cual sea el conjunto, el parche no se asienta nunca en un bloque pequeño que se repite — eso es lo que significa aperiódico.",
};

const fr: RichStory = {
  page: {
    pretitle: "Sujet · Calcul",
    title: "Tuiles de Wang",
    tagline: "Des carrés à bords colorés qui portent, en silence, n'importe quel calcul.",
    intro:
      "L'énigme de Hao Wang en 1961 — faire correspondre les couleurs des bords qui se touchent — cachait le problème de l'arrêt dans un jeu d'enfant. Ci-dessous : les règles, la surprise et deux interactions pour poser les tuiles soi-même et regarder grandir un pavage apériodique.",
    ctaInteractive: "→ Ouvrir l'Explorateur",
    sections: [],
  },
  encounter: {
    pretitle: "Première rencontre",
    title: "Fais correspondre les bords. C'est tout le jeu.",
    cards: [
      {
        label: "01",
        title: "L'idée centrale",
        body: "Prends un carré. Peins chacun de ses quatre bords. C'est une tuile de Wang. Pose-en plusieurs côte à côte, mais seulement là où les bords qui se touchent partagent la couleur — nord contre sud, est contre ouest, sans rotations. À partir de cette seule règle, d'une manière que personne n'a vue venir en 1961, on peut coder n'importe quel calcul qu'une machine sait faire.",
      },
      {
        label: "02",
        title: "Un exemple concret",
        body: "Trois tuiles, quatre couleurs de bord. Rangée du bas : deux copies de la tuile A. Rangée du haut : deux copies de la tuile B. A.est s'accorde avec A.ouest, B.est avec B.ouest, et A.nord avec B.sud. Un petit patch — et tu as déjà découvert que certains jeux de tuiles s'imbriquent et d'autres pas.",
      },
      {
        label: "03",
        title: "Pourquoi ça compte",
        body: "En 1966, Robert Berger a prouvé qu'aucun algorithme ne décide, en général, si un jeu donné de tuiles de Wang pave le plan. Pour le faire, il a construit un jeu de 20 426 tuiles qui ne pave le plan qu'apériodiquement — aucune translation du motif ne le ramène sur lui-même. La suite a fait chuter ce record de 20 426 à 13 (Culik, 1996), puis à 11 (Jeandel–Rao, 2015), et ouvert la route vers les pavages de Penrose et la monotile apériodique moderne.",
      },
    ],
    tryIt:
      "Ci-dessous : pose toi-même les tuiles pour que chaque bord partagé corresponde, puis regarde un jeu apériodique de 11 ou 13 tuiles remplir une région.",
  },
  sections: [
    {
      pretitle: "Section 01 · La question de Wang",
      title: "Peut-on décider si un jeu pave le plan ?",
      body: "En 1961, le logicien Hao Wang a posé une question trompeusement concrète : étant donné un jeu fini de tuiles carrées à bords colorés, existe-t-il un algorithme qui décide si des copies (sans rotations, sans réflexions) peuvent s'assembler en un pavage du plan infini tout entier ? La conjecture de Wang disait oui — et plus fort : tout jeu qui pave le plan doit admettre un pavage périodique, un motif qui se répète par translation. Si c'était vrai, une vérification finie réglerait le Problème du Domino une fois pour toutes. Le plan se laisserait dompter par un calcul fini.",
    },
    {
      pretitle: "Section 02 · Le théorème de Berger",
      title: "Indécidable. Et il existe des jeux apériodiques.",
      body: "En 1966, l'élève de Wang, Robert Berger, a fauché les deux moitiés de la conjecture d'un coup. Il a construit un jeu de 20 426 tuiles de Wang qui pave bel et bien le plan — mais seulement apériodiquement. Aucune translation d'un pavage par ce jeu ne le ramène sur lui-même. Et il a démontré que le Problème du Domino est indécidable : aucun algorithme, aucune vérification finie ne dira en général si un jeu pave le plan. Une liste finie de carrés colorés peut être Turing-complète, déguisée.",
    },
    {
      pretitle: "Section 03 · Coder un calcul",
      title: "Des machines de Turing peintes sur les bords",
      body: "La construction de Berger est une traduction : prends une machine de Turing, produis un jeu de tuiles de Wang qui pave le demi-plan supérieur si et seulement si la machine ne s'arrête jamais sur ruban vide. Chaque rangée de tuiles épelle une configuration complète de la machine — contenu du ruban et position de la tête — et chaque transition d'une rangée à la suivante est forcée par les couleurs des bords à être exactement un pas de la machine. Le pavage infini, s'il existe, est le calcul infini. « Ce jeu pave-t-il ? » devient « cette machine tourne-t-elle pour toujours ? » — c'est-à-dire le problème de l'arrêt.",
    },
    {
      pretitle: "Section 04 · De 20 426 à 11",
      title: "Robinson, Culik, Jeandel–Rao",
      body: "Les 20 426 tuiles de Berger étaient une preuve, pas une sculpture. Les décennies suivantes ont été une chasse au plus petit jeu apériodique. Raphael Robinson est tombé à 56 en 1971 avec une construction hiérarchique plus propre. En 1996, Jarkko Kari a publié 14 ; Karel Culik II, s'appuyant directement sur les idées de Kari, en a trouvé 13 la même année — un record qui a tenu près de vingt ans. En 2015, Emmanuel Jeandel et Michaël Rao ont prouvé par recherche informatique exhaustive que 11 est le vrai minimum : il existe un jeu apériodique de 11 tuiles de Wang, et aucun jeu de 10 ou moins ne peut l'être. L'histoire a une réponse finie, et c'est 11.",
    },
    {
      pretitle: "Section 05 · Quasicristaux",
      title: "Penrose, Shechtman et les motifs qui refusent de se répéter",
      body: "En 1974, Roger Penrose publie un pavage apériodique avec seulement deux losanges — un cousin plus aimable, plus géométrique, des monstres de Berger. Dix ans plus tard, en 1984, Dan Shechtman observe des figures de diffraction nettes à symétrie d'ordre cinq dans un alliage aluminium-manganèse trempé — physiquement interdites pour tout cristal périodique. Ce qu'il avait trouvé, c'était un quasicristal : de la matière disposée selon un motif apériodique. Les tuiles de Wang étaient l'ancêtre conceptuel des deux. Un jeu combinatoire sur des bords colorés décrivait soudain une phase de la matière qui a valu à Shechtman le Nobel de chimie 2011.",
    },
    {
      pretitle: "Section 06 · La monotile apériodique",
      title: "2023 — une seule tuile suffit",
      body: "Pendant plus d'un demi-siècle la question ouverte était de savoir si une seule tuile pouvait forcer l'apériodicité — un « einstein », une pierre. En mars 2023, David Smith, Joseph Myers, Craig Kaplan et Chaim Goodman-Strauss annoncent le « chapeau » : un polygone à 13 côtés qui ne pave le plan qu'apériodiquement, en utilisant des réflexions. Deux mois plus tard, la même équipe livre le « spectre », une monotile apériodique qui se passe de réflexion. La chaîne ouverte par la conjecture de Wang en 1961 — passant par les 20 426 de Berger, les 56 de Robinson, les 13 de Culik, les 11 de Jeandel–Rao — se termine, soixante ans plus tard, à 1.",
    },
  ],
  closingTitle: "Pose une tuile. Le plan tranche.",
  closingBody:
    "L'Explorateur permet de basculer entre un jeu explicitement périodique et les apériodiques, de voir l'algorithme rebrousser chemin en direct quand il se peint dans un coin, et de zoomer dans n'importe quelle région du patch en croissance. Tout ce que tu viens de lire est à un clic.",
  ctaLabel: "→ Ouvrir l'Explorateur",
  tilingCaption: "Interactif · pose les tuiles, les bords doivent s'accorder",
  tilingPalette: "Palette · 8 tuiles",
  tilingHint:
    "Clique une cellule pour passer en cycle parmi huit tuiles ; un clic au-delà de la dernière la vide. Un anneau rouge marque une tuile dont le bord ne s'accorde pas avec un voisin. Essaie de remplir le 3×3 avec tous les bords partagés en accord — certaines configurations ont beaucoup de solutions, d'autres aucune.",
  tilingOk: "Tous les bords s'accordent.",
  tilingBad: "Certains bords ne s'accordent pas.",
  tilingClear: "Vider",
  tilingScore: (placed, valid) => `${placed} posées · ${valid} valides`,
  aperiodicCaption: "Interactif · faire grandir un patch apériodique",
  aperiodicSetLabel: "Jeu de tuiles",
  aperiodicRandomize: "Nouvelle graine",
  aperiodicHint:
    "Une recherche avec retour arrière aléatoire remplit le canevas, cellule par cellule, avec les tuiles du jeu choisi. Quel que soit le jeu, le patch ne s'installe jamais dans un petit bloc qui se répète — c'est cela, apériodique.",
};

const it: RichStory = {
  page: {
    pretitle: "Tema · Computazione",
    title: "Tasselli di Wang",
    tagline: "Quadrati con bordi colorati che portano, in silenzio, qualsiasi calcolo.",
    intro:
      "L'indovinello di Hao Wang del 1961 — far combaciare i colori dei bordi che si toccano — nascondeva il problema della fermata in un gioco da bambini. Sotto: le regole, la sorpresa e due interazioni per posare i tasselli a mano e veder crescere una macchia aperiodica.",
    ctaInteractive: "→ Apri l'Esploratore",
    sections: [],
  },
  encounter: {
    pretitle: "Primo incontro",
    title: "Combina i bordi. È tutto il gioco.",
    cards: [
      {
        label: "01",
        title: "L'idea centrale",
        body: "Prendi un quadrato. Dipingi ognuno dei quattro bordi. È un tassello di Wang. Mettine diversi affiancati, ma solo dove i bordi che si toccano condividono il colore — nord contro sud, est contro ovest, niente rotazioni. Da quella sola regola, in un modo che nel 1961 nessuno vide arrivare, si può codificare qualsiasi calcolo che una macchina sappia fare.",
      },
      {
        label: "02",
        title: "Un esempio concreto",
        body: "Tre tasselli, quattro colori di bordo. Riga in basso: due copie del tassello A. Riga in alto: due copie del tassello B. A.est combacia con A.ovest, B.est con B.ovest, A.nord con B.sud. Una piccola pezza — e hai già scoperto che alcuni insiemi si incastrano, altri no.",
      },
      {
        label: "03",
        title: "Perché conta",
        body: "Nel 1966 Robert Berger dimostrò che nessun algoritmo decide, in generale, se un dato insieme di tasselli di Wang piastrella il piano. Per farlo costruì un insieme di 20 426 tasselli che piastrella il piano solo aperiodicamente — nessuna traslazione del motivo lo riporta su sé stesso. I lavori successivi ridussero il record da 20 426 a 13 (Culik, 1996) e a 11 (Jeandel–Rao, 2015), e aprirono la via ai mosaici di Penrose e al moderno monotile aperiodico.",
      },
    ],
    tryIt:
      "Sotto: posa tu stesso i tasselli in modo che ogni bordo condiviso combaci, poi guarda un insieme aperiodico da 11 o 13 tasselli riempire una regione.",
  },
  sections: [
    {
      pretitle: "Sezione 01 · La domanda di Wang",
      title: "Si può decidere se un insieme piastrella il piano?",
      body: "Nel 1961 il logico Hao Wang pose una domanda ingannevolmente concreta: dato un insieme finito di quadrati con bordi colorati, esiste un algoritmo che decide se copie di essi (senza rotazioni, senza riflessioni) si possono assemblare in un mosaico dell'intero piano infinito? La congettura stessa di Wang diceva sì — e di più: ogni insieme che piastrella il piano deve ammettere un mosaico periodico, un motivo che si ripete per traslazione. Se fosse vero, un controllo finito risolverebbe il Problema del Domino una volta per tutte. Il piano cederebbe a un calcolo finito.",
    },
    {
      pretitle: "Sezione 02 · Il teorema di Berger",
      title: "Indecidibile. E gli insiemi aperiodici esistono.",
      body: "Nel 1966 l'allievo di Wang, Robert Berger, abbatté entrambe le metà della congettura in un colpo solo. Costruì un insieme di 20 426 tasselli di Wang che piastrella davvero il piano — ma solo aperiodicamente. Nessuna traslazione di un mosaico con quell'insieme lo riporta su sé stesso. E dimostrò che il Problema del Domino è indecidibile: nessun algoritmo, nessun controllo finito, dirà in generale se un insieme piastrella il piano. Una lista finita di quadrati colorati può essere Turing-completa travestita.",
    },
    {
      pretitle: "Sezione 03 · Calcolo nel mosaico",
      title: "Macchine di Turing dipinte sui bordi",
      body: "La costruzione di Berger è una traduzione: prendi una macchina di Turing e produci un insieme di tasselli di Wang che piastrella il semipiano superiore se e solo se la macchina non si ferma mai su nastro vuoto. Ogni riga di tasselli scandisce una configurazione completa della macchina — contenuto del nastro e posizione della testa — e ogni passaggio da riga a riga è forzato dai bordi ad essere esattamente un passo della macchina. Il mosaico infinito, se esiste, è il calcolo infinito. « Questo insieme piastrella? » diventa « questa macchina gira per sempre? » — il problema della fermata.",
    },
    {
      pretitle: "Sezione 04 · Da 20 426 a 11",
      title: "Robinson, Culik, Jeandel–Rao",
      body: "I 20 426 tasselli di Berger erano una dimostrazione, non una scultura. I decenni seguenti furono una caccia al più piccolo insieme aperiodico. Raphael Robinson lo portò a 56 nel 1971 con una costruzione gerarchica più pulita. Nel 1996 Jarkko Kari pubblicò 14; Karel Culik II, appoggiandosi direttamente sulle idee di Kari, trovò 13 nello stesso anno — un record che tenne per quasi vent'anni. Nel 2015 Emmanuel Jeandel e Michaël Rao dimostrarono per ricerca esaustiva al calcolatore che 11 è il vero minimo: esiste un insieme aperiodico di 11 tasselli di Wang, e nessuno da 10 o meno può esserlo. La storia ha risposta finita, ed è 11.",
    },
    {
      pretitle: "Sezione 05 · Quasicristalli",
      title: "Penrose, Shechtman e i motivi che si rifiutano di ripetersi",
      body: "Nel 1974 Roger Penrose pubblicò un mosaico aperiodico con appena due rombi — un cugino più gentile e geometrico dei mostri di Berger. Dieci anni dopo, nel 1984, Dan Shechtman osservò figure di diffrazione nitide con simmetria pentagonale in una lega di alluminio-manganese temprata — fisicamente proibite per qualsiasi cristallo periodico. Quel che aveva trovato era un quasicristallo: materia disposta in un motivo aperiodico. I tasselli di Wang erano l'antenato concettuale di entrambi. Un gioco combinatorio sui bordi colorati descriveva all'improvviso una fase della materia che valse a Shechtman il Nobel per la chimica del 2011.",
    },
    {
      pretitle: "Sezione 06 · Il monotile aperiodico",
      title: "2023 — basta un tassello",
      body: "Per oltre mezzo secolo la domanda aperta era se un singolo tassello potesse forzare l'aperiodicità — un « einstein », una pietra. Nel marzo 2023, David Smith, Joseph Myers, Craig Kaplan e Chaim Goodman-Strauss annunciarono il « cappello »: un poligono a 13 lati che piastrella il piano solo aperiodicamente, usando riflessioni. Due mesi dopo lo stesso team produsse lo « spettro », un monotile aperiodico che non richiede riflessioni. La catena aperta dalla congettura di Wang nel 1961 — attraverso i 20 426 di Berger, i 56 di Robinson, i 13 di Culik, gli 11 di Jeandel–Rao — termina, sessant'anni dopo, a 1.",
    },
  ],
  closingTitle: "Posa un tassello. Il piano decide.",
  closingBody:
    "L'Esploratore lascia passare da un insieme esplicitamente periodico a quelli aperiodici, guardare l'algoritmo tornare indietro in diretta quando si dipinge in un angolo, e zoomare in qualsiasi regione della macchia che cresce. Tutto ciò che hai appena letto è a un clic.",
  ctaLabel: "→ Apri l'Esploratore",
  tilingCaption: "Interattivo · posa i tasselli, i bordi devono combaciare",
  tilingPalette: "Tavolozza · 8 tasselli",
  tilingHint:
    "Clicca una cella per scorrere otto tasselli; un clic oltre l'ultimo la svuota. Un anello rosso segna un tassello il cui bordo non concorda col vicino. Prova a riempire il 3×3 con tutti i bordi condivisi in accordo — certe configurazioni hanno molte soluzioni, altre nessuna.",
  tilingOk: "Ogni bordo combacia.",
  tilingBad: "Alcuni bordi non combaciano.",
  tilingClear: "Svuota",
  tilingScore: (placed, valid) => `${placed} posati · ${valid} validi`,
  aperiodicCaption: "Interattivo · far crescere una macchia aperiodica",
  aperiodicSetLabel: "Insieme",
  aperiodicRandomize: "Nuovo seme",
  aperiodicHint:
    "Una ricerca con backtracking randomizzato riempie la tela, cella per cella, coi tasselli dell'insieme scelto. Qualunque insieme scegli, la macchia non si assesta mai in un piccolo blocco che si ripete — è questo che vuol dire aperiodico.",
};

const pt: RichStory = {
  page: {
    pretitle: "Tópico · Computação",
    title: "Tijolos de Wang",
    tagline: "Quadrados com bordas coloridas que carregam, em silêncio, qualquer computação.",
    intro:
      "O quebra-cabeças de Hao Wang de 1961 — casar as cores das bordas que se tocam — escondia o problema da paragem dentro de um jogo de crianças. Abaixo: as regras, a surpresa e duas interações para colocar os tijolos à mão e ver crescer um remendo aperiódico.",
    ctaInteractive: "→ Abrir o Explorador",
    sections: [],
  },
  encounter: {
    pretitle: "Primeiro encontro",
    title: "Casa as bordas. É todo o jogo.",
    cards: [
      {
        label: "01",
        title: "A ideia central",
        body: "Pega num quadrado. Pinta cada uma das quatro bordas. É um tijolo de Wang. Põe vários lado a lado, mas só onde as bordas que se tocam partilham a cor — norte contra sul, este contra oeste, sem rotações. Dessa única regra, de um modo que ninguém viu vir em 1961, dá para codificar qualquer computação que uma máquina saiba fazer.",
      },
      {
        label: "02",
        title: "Um exemplo concreto",
        body: "Três tijolos, quatro cores de borda. Linha de baixo: duas cópias do tijolo A. Linha de cima: duas cópias do tijolo B. A.este casa com A.oeste, B.este com B.oeste, A.norte com B.sul. Um pequeno remendo — e já descobriste que há conjuntos que encaixam e outros que não.",
      },
      {
        label: "03",
        title: "Porque importa",
        body: "Em 1966 Robert Berger provou que nenhum algoritmo decide, em geral, se um conjunto dado de tijolos de Wang ladrilha o plano. Para isso construiu um conjunto de 20 426 tijolos que só ladrilha o plano aperiodicamente — nenhuma translação do padrão o devolve a si mesmo. O trabalho seguinte reduziu o recorde de 20 426 a 13 (Culik, 1996) e a 11 (Jeandel–Rao, 2015), e abriu o caminho aos mosaicos de Penrose e ao moderno monotile aperiódico.",
      },
    ],
    tryIt:
      "Abaixo: coloca tu mesmo os tijolos para que toda borda partilhada combine, e depois vê um conjunto aperiódico de 11 ou 13 tijolos a encher uma região.",
  },
  sections: [
    {
      pretitle: "Secção 01 · A pergunta de Wang",
      title: "Pode-se decidir se um conjunto ladrilha o plano?",
      body: "Em 1961 o lógico Hao Wang colocou uma pergunta enganadoramente concreta: dado um conjunto finito de quadrados com bordas coloridas, existe um algoritmo que decide se cópias deles (sem rotações, sem reflexões) se podem juntar num ladrilhamento de todo o plano infinito? A própria conjetura de Wang dizia que sim — e mais forte: todo conjunto que ladrilha o plano tem de admitir um ladrilhamento periódico, um padrão que se repete por translação. Se fosse verdade, uma verificação finita resolvia o Problema do Dominó de vez. O plano cederia a uma conta finita.",
    },
    {
      pretitle: "Secção 02 · O teorema de Berger",
      title: "Indecidível. E há conjuntos aperiódicos.",
      body: "Em 1966 o aluno de Wang, Robert Berger, derrubou ambas as metades da conjetura de uma vez. Construiu um conjunto de 20 426 tijolos de Wang que ladrilha o plano — mas só aperiodicamente. Nenhuma translação de um ladrilhamento com esse conjunto o devolve a si mesmo. E provou que o Problema do Dominó é indecidível: nenhum algoritmo, nenhuma verificação finita, dirá em geral se um conjunto ladrilha o plano. Uma lista finita de quadrados coloridos pode ser Turing-completa disfarçada.",
    },
    {
      pretitle: "Secção 03 · Computar com tijolos",
      title: "Máquinas de Turing pintadas nas bordas",
      body: "A construção de Berger é uma tradução: pega numa máquina de Turing e produz um conjunto de tijolos de Wang que ladrilha o semi-plano superior se e só se a máquina nunca pára na fita em branco. Cada linha de tijolos soletra uma configuração completa da máquina — conteúdo da fita e posição da cabeça — e cada transição de linha a linha é forçada pelas bordas a ser exatamente um passo da máquina. O ladrilhamento infinito, se existe, é a computação infinita. « Este conjunto ladrilha? » torna-se « esta máquina corre para sempre? » — e isso é o problema da paragem.",
    },
    {
      pretitle: "Secção 04 · De 20 426 a 11",
      title: "Robinson, Culik, Jeandel–Rao",
      body: "Os 20 426 tijolos de Berger eram demonstração, não escultura. As décadas seguintes foram uma caça ao menor conjunto aperiódico. Raphael Robinson chegou a 56 em 1971 com uma construção hierárquica mais limpa. Em 1996 Jarkko Kari publicou 14; Karel Culik II, apoiando-se directamente nas ideias de Kari, achou 13 no mesmo ano — um recorde que se manteve quase duas décadas. Em 2015, Emmanuel Jeandel e Michaël Rao provaram por busca computacional exaustiva que 11 é o verdadeiro mínimo: há um conjunto aperiódico de 11 tijolos de Wang, e nenhum de 10 ou menos o pode ser. A história tem resposta finita, e é 11.",
    },
    {
      pretitle: "Secção 05 · Quasicristais",
      title: "Penrose, Shechtman e padrões que se recusam a repetir",
      body: "Em 1974 Roger Penrose publicou um ladrilhamento aperiódico só com dois losangos — um primo mais gentil e geométrico dos monstros de Berger. Dez anos depois, em 1984, Dan Shechtman observou padrões de difracção nítidos com simetria quíntupla numa liga de alumínio-manganês temperada — fisicamente proibidos para qualquer cristal periódico. O que tinha encontrado era um quasicristal: matéria arranjada num padrão aperiódico. Os tijolos de Wang foram o ancestral conceptual de ambos. Um jogo combinatório sobre bordas coloridas descrevia, de súbito, uma fase da matéria que valeu a Shechtman o Nobel da Química de 2011.",
    },
    {
      pretitle: "Secção 06 · O monotile aperiódico",
      title: "2023 — um tijolo basta",
      body: "Durante mais de meio século a pergunta em aberto era se um único tijolo podia forçar aperiodicidade — um « einstein », uma pedra. Em março de 2023, David Smith, Joseph Myers, Craig Kaplan e Chaim Goodman-Strauss anunciaram o « chapéu »: um polígono de 13 lados que só ladrilha o plano aperiodicamente, usando reflexões. Dois meses depois a mesma equipa apresentou o « espectro », um monotile aperiódico que dispensa reflexões. A cadeia aberta pela conjetura de Wang em 1961 — passando pelos 20 426 de Berger, pelos 56 de Robinson, pelos 13 de Culik, pelos 11 de Jeandel–Rao — acaba, seis décadas depois, em 1.",
    },
  ],
  closingTitle: "Coloca um tijolo. O plano decide.",
  closingBody:
    "O Explorador deixa alternar entre um conjunto explicitamente periódico e os aperiódicos, ver o algoritmo a recuar em direto quando se pinta num canto, e ampliar qualquer região do remendo a crescer. Tudo o que acabaste de ler está a um clique.",
  ctaLabel: "→ Abrir o Explorador",
  tilingCaption: "Interativo · coloca tijolos, as bordas têm de casar",
  tilingPalette: "Paleta · 8 tijolos",
  tilingHint:
    "Clica numa célula para percorrer oito tijolos; um clique a seguir ao último esvazia-a. Um anel vermelho marca um tijolo cuja borda não concorda com a vizinha. Tenta encher o 3×3 com todas as bordas partilhadas em acordo — algumas configurações têm muitas soluções, outras nenhuma.",
  tilingOk: "Toda borda casa.",
  tilingBad: "Há bordas que não casam.",
  tilingClear: "Limpar",
  tilingScore: (placed, valid) => `${placed} colocados · ${valid} válidos`,
  aperiodicCaption: "Interativo · fazer crescer um remendo aperiódico",
  aperiodicSetLabel: "Conjunto",
  aperiodicRandomize: "Nova semente",
  aperiodicHint:
    "Uma busca com retrocesso aleatorizada enche a tela, célula a célula, com tijolos do conjunto escolhido. Seja qual for o conjunto, o remendo nunca assenta num bloco pequeno que se repete — é isso que quer dizer aperiódico.",
};

const sv: RichStory = {
  page: {
    pretitle: "Ämne · Beräkning",
    title: "Wang-plattor",
    tagline: "Kvadrater med färgade kanter som tyst bär vilken beräkning som helst.",
    intro:
      "Hao Wangs gåta från 1961 — matcha färgerna på kanter som möts — gömde halterproblemet i ett barnspel. Nedan: reglerna, överraskningen och två interaktioner där du lägger plattor själv och ser en aperiodisk yta växa fram.",
    ctaInteractive: "→ Öppna utforskaren",
    sections: [],
  },
  encounter: {
    pretitle: "Första mötet",
    title: "Matcha kanterna. Det är hela spelet.",
    cards: [
      {
        label: "01",
        title: "Den stora idén",
        body: "Ta en kvadrat. Måla var och en av de fyra kanterna. Det är en Wang-platta. Lägg flera bredvid varandra, men bara där kanterna som möts delar färg — nord mot syd, öst mot väst, utan rotationer. Ur den enda regeln kan man, på ett sätt ingen såg komma 1961, koda vilken beräkning som helst som en maskin kan utföra.",
      },
      {
        label: "02",
        title: "Ett konkret exempel",
        body: "Tre plattor, fyra kantfärger. Nedersta raden: två kopior av platta A. Översta raden: två kopior av platta B. A:s öst matchar A:s väst, B:s öst matchar B:s väst, och A:s nord matchar B:s syd. En liten lapp — och du har redan upptäckt att vissa plattuppsättningar klickar samman och andra inte.",
      },
      {
        label: "03",
        title: "Varför det spelar roll",
        body: "1966 bevisade Robert Berger att ingen algoritm i allmänhet kan avgöra om en given Wang-uppsättning täcker planet. För att göra det byggde han en uppsättning av 20 426 plattor som täcker planet bara aperiodiskt — ingen translation av mönstret avbildar det på sig självt. Den fortsatta forskningen krympte rekordet från 20 426 till 13 (Culik 1996) och 11 (Jeandel–Rao 2015), och öppnade vägen till Penrose-mönster och den moderna aperiodiska monoplattan.",
      },
    ],
    tryIt:
      "Nedan: lägg själv plattor så att varje delad kant stämmer, och se sedan en aperiodisk uppsättning med 11 eller 13 plattor fylla en yta.",
  },
  sections: [
    {
      pretitle: "Avsnitt 01 · Wangs fråga",
      title: "Kan man avgöra om en uppsättning täcker planet?",
      body: "1961 ställde logikern Hao Wang en bedrägligt konkret fråga: givet en ändlig uppsättning kvadratiska plattor med färgade kanter, finns det en algoritm som avgör om kopior av dem (utan rotationer, utan speglingar) kan fogas ihop till en täckning av hela det oändliga planet? Wangs egen förmodan sa ja — och starkare: varje uppsättning som täcker planet måste tillåta någon periodisk täckning, ett mönster som upprepas genom translation. Om det stämde skulle en ändlig kontroll lösa Dominoproblemet en gång för alla. Planet skulle falla för en ändlig beräkning.",
    },
    {
      pretitle: "Avsnitt 02 · Bergers sats",
      title: "Oavgörbart. Och aperiodiska uppsättningar finns.",
      body: "1966 slog Wangs elev Robert Berger sönder båda halvorna av förmodan i ett enda slag. Han konstruerade en uppsättning på 20 426 Wang-plattor som faktiskt täcker planet — men bara aperiodiskt. Ingen translation av en täckning med den uppsättningen avbildar den på sig själv. Och han bevisade att Dominoproblemet är oavgörbart: ingen algoritm, ingen smart ändlig kontroll, kan i allmänhet säga om en uppsättning täcker planet alls. En ändlig lista av färgade kvadrater kan vara Turing-fullständig i förklädnad.",
    },
    {
      pretitle: "Avsnitt 03 · Beräkning i mönstret",
      title: "Turingmaskiner målade på kanterna",
      body: "Bergers konstruktion är en översättning: ta vilken Turingmaskin som helst och producera en Wang-uppsättning som täcker det övre halvplanet om och endast om maskinen aldrig stannar på tom indata. Varje rad plattor stavar ut en hel maskinkonfiguration — bandets innehåll och huvudets position — och varje övergång från rad till rad tvingas av kantfärgerna att vara exakt ett maskinsteg. Den oändliga täckningen, om den finns, är den oändliga beräkningen. « Täcker den här uppsättningen? » blir « kör den här maskinen i evighet? » — och det är halterproblemet.",
    },
    {
      pretitle: "Avsnitt 04 · Från 20 426 till 11",
      title: "Robinson, Culik, Jeandel–Rao",
      body: "Bergers 20 426 plattor var ett bevis, inte en skulptur. Decennierna som följde var en jakt efter den minsta aperiodiska Wang-uppsättningen. Raphael Robinson tryckte ner den till 56 år 1971 med en renare hierarkisk konstruktion. 1996 publicerade Jarkko Kari 14; Karel Culik II byggde direkt på Karis idéer och hittade 13 samma år — ett rekord som höll i nästan två decennier. 2015 bevisade Emmanuel Jeandel och Michaël Rao genom uttömmande datorsökning att 11 är det sanna minimum: det finns en aperiodisk uppsättning av 11 Wang-plattor, och ingen uppsättning av 10 eller färre kan vara aperiodisk. Historien har ett ändligt svar, och det är 11.",
    },
    {
      pretitle: "Avsnitt 05 · Kvasikristaller",
      title: "Penrose, Shechtman och mönster som vägrar upprepa sig",
      body: "1974 publicerade Roger Penrose en aperiodisk täckning med bara två romber — en snällare, mer geometrisk kusin till Bergers monster. Tio år senare, 1984, observerade Dan Shechtman skarpa diffraktionsmönster med femfaldig symmetri i en snabbkyld aluminium-mangan-legering — fysiskt förbjudna för varje periodisk kristall. Det han hade hittat var en kvasikristall: materia ordnad i ett aperiodiskt mönster. Wang-plattorna var den begreppsmässiga förfadern till båda. Ett kombinatoriskt spel om färgade kanter beskrev plötsligt en fas av materia som gav Shechtman Nobelpriset i kemi 2011.",
    },
    {
      pretitle: "Avsnitt 06 · Den aperiodiska monoplattan",
      title: "2023 — en platta räcker",
      body: "I mer än ett halvt sekel var den öppna frågan om en enda platta kan tvinga aperiodicitet — en « einstein », en sten. I mars 2023 tillkännagav David Smith, Joseph Myers, Craig Kaplan och Chaim Goodman-Strauss « hatten »: en 13-sidig polygon som täcker planet bara aperiodiskt, med speglingar. Två månader senare levererade samma team « spöket », en aperiodisk monoplatta som klarar sig utan speglingar. Kedjan som Wangs förmodan från 1961 öppnade — genom Bergers 20 426, Robinsons 56, Culiks 13, Jeandel–Raos 11 — slutar, sex decennier senare, i 1.",
    },
  ],
  closingTitle: "Lägg en platta. Planet avgör.",
  closingBody:
    "Utforskaren låter dig växla mellan en uttryckligen periodisk uppsättning och de aperiodiska, se algoritmen backa i realtid när den målar in sig i ett hörn, och zooma in i vilken som helst region av den växande ytan. Allt du just läst är ett klick bort.",
  ctaLabel: "→ Öppna utforskaren",
  tilingCaption: "Interaktivt · lägg plattor, kanterna måste matcha",
  tilingPalette: "Palett · 8 plattor",
  tilingHint:
    "Klicka en cell för att stega genom åtta plattor; ett klick efter den sista tömmer den. En röd ring markerar en platta vars kant inte stämmer med grannen. Försök fylla 3×3:an så att varje delad kant matchar — vissa konfigurationer har många lösningar, andra inga.",
  tilingOk: "Alla kanter matchar.",
  tilingBad: "Vissa kanter matchar inte.",
  tilingClear: "Töm",
  tilingScore: (placed, valid) => `${placed} lagda · ${valid} giltiga`,
  aperiodicCaption: "Interaktivt · väx en aperiodisk lapp",
  aperiodicSetLabel: "Plattuppsättning",
  aperiodicRandomize: "Nytt frö",
  aperiodicHint:
    "En randomiserad backtracking-sökning fyller arbetsytan, cell för cell, med plattor ur den valda uppsättningen. Vilken uppsättning du än väljer slår sig lappen aldrig till ro i ett litet upprepande block — det är vad aperiodisk betyder.",
};

const no: RichStory = {
  page: {
    pretitle: "Tema · Beregning",
    title: "Wang-fliser",
    tagline: "Kvadrater med fargede kanter som stille bærer enhver beregning.",
    intro:
      "Hao Wangs gåte fra 1961 — match fargene på kantene som møtes — skjulte stoppproblemet i en barneleik. Under: reglene, overraskelsen og to interaksjoner der du legger fliser selv og ser en aperiodisk flate vokse fram.",
    ctaInteractive: "→ Åpne utforskeren",
    sections: [],
  },
  encounter: {
    pretitle: "Første møte",
    title: "Match kantene. Det er hele spillet.",
    cards: [
      {
        label: "01",
        title: "Den store idéen",
        body: "Ta en kvadrat. Mal hver av de fire kantene. Det er en Wang-flis. Legg flere ved siden av hverandre, men bare der kantene som møtes deler farge — nord mot sør, øst mot vest, uten rotasjoner. Fra den ene regelen kan man, på en måte ingen så komme i 1961, kode en hvilken som helst beregning en maskin kan gjøre.",
      },
      {
        label: "02",
        title: "Et konkret eksempel",
        body: "Tre fliser, fire kantfarger. Nederste rad: to kopier av flis A. Øverste rad: to kopier av flis B. A.øst matcher A.vest, B.øst matcher B.vest, og A.nord matcher B.sør. En liten lapp — og du har allerede oppdaget at noen flisesett klikker sammen og andre ikke.",
      },
      {
        label: "03",
        title: "Hvorfor det betyr noe",
        body: "I 1966 beviste Robert Berger at ingen algoritme generelt kan avgjøre om et gitt Wang-flisesett dekker planet. For å gjøre det bygde han et sett på 20 426 fliser som bare dekker planet aperiodisk — ingen translasjon av mønsteret avbilder det på seg selv. Den videre forskningen krympet rekorden fra 20 426 til 13 (Culik 1996) og 11 (Jeandel–Rao 2015), og åpnet veien til Penrose-mønstre og den moderne aperiodiske monoflisen.",
      },
    ],
    tryIt:
      "Under: legg selv fliser slik at hver delt kant stemmer, og se så et aperiodisk sett med 11 eller 13 fliser fylle en flate.",
  },
  sections: [
    {
      pretitle: "Avsnitt 01 · Wangs spørsmål",
      title: "Kan man avgjøre om et sett dekker planet?",
      body: "I 1961 stilte logikeren Hao Wang et bedragersk konkret spørsmål: gitt et endelig sett kvadratiske fliser med fargede kanter, finnes det en algoritme som avgjør om kopier av dem (uten rotasjoner, uten speilinger) kan settes sammen til en dekking av hele det uendelige planet? Wangs egen formodning sa ja — og sterkere: ethvert sett som dekker planet må tillate en periodisk dekking, et mønster som gjentar seg ved translasjon. Var det sant, ville en endelig sjekk avgjøre Dominoproblemet for godt. Planet ville falle for en endelig regning.",
    },
    {
      pretitle: "Avsnitt 02 · Bergers teorem",
      title: "Uavgjørbart. Og aperiodiske sett finnes.",
      body: "I 1966 raserte Wangs elev Robert Berger begge halvdeler av formodningen på én gang. Han konstruerte et sett på 20 426 Wang-fliser som faktisk dekker planet — men bare aperiodisk. Ingen translasjon av en dekking med det settet avbilder den på seg selv. Og han beviste at Dominoproblemet er uavgjørbart: ingen algoritme, ingen smart endelig sjekk, vil generelt si om et sett dekker planet i det hele tatt. En endelig liste fargede kvadrater kan være Turing-fullstendig i forkledning.",
    },
    {
      pretitle: "Avsnitt 03 · Beregning i mønsteret",
      title: "Turingmaskiner malt på kantene",
      body: "Bergers konstruksjon er en oversettelse: ta en hvilken som helst Turingmaskin og produser et Wang-flisesett som dekker det øvre halvplanet hvis og bare hvis maskinen aldri stopper på tom inndata. Hver rad fliser staver ut en hel maskinkonfigurasjon — båndinnholdet og hodeposisjonen — og hver overgang fra rad til rad tvinges av kantfargene til å være nøyaktig ett maskinsteg. Den uendelige dekkingen, om den finnes, er den uendelige beregningen. « Dekker dette settet? » blir « går denne maskinen for alltid? » — og det er stoppproblemet.",
    },
    {
      pretitle: "Avsnitt 04 · Fra 20 426 til 11",
      title: "Robinson, Culik, Jeandel–Rao",
      body: "Bergers 20 426 fliser var et bevis, ikke en skulptur. Tiårene som fulgte var en jakt på det minste aperiodiske Wang-settet. Raphael Robinson presset det ned til 56 i 1971 med en renere hierarkisk konstruksjon. I 1996 publiserte Jarkko Kari 14; Karel Culik II bygde direkte på Karis ideer og fant 13 samme år — en rekord som holdt i nesten to tiår. I 2015 beviste Emmanuel Jeandel og Michaël Rao ved uttømmende datasøk at 11 er det sanne minimum: det finnes et aperiodisk sett på 11 Wang-fliser, og intet sett på 10 eller færre kan være aperiodisk. Historien har et endelig svar, og det er 11.",
    },
    {
      pretitle: "Avsnitt 05 · Kvasikrystaller",
      title: "Penrose, Shechtman og mønstre som nekter å gjenta seg",
      body: "I 1974 publiserte Roger Penrose en aperiodisk dekking med bare to romber — en snillere, mer geometrisk fetter til Bergers monstre. Ti år senere, i 1984, observerte Dan Shechtman skarpe diffraksjonsmønstre med femfoldig symmetri i en hurtigkjølt aluminium-mangan-legering — fysisk forbudt for enhver periodisk krystall. Det han hadde funnet var en kvasikrystall: materie ordnet i et aperiodisk mønster. Wang-flisene var den begrepsmessige forfaren til begge. Et kombinatorisk spill om fargede kanter beskrev plutselig en fase av materien som ga Shechtman Nobelprisen i kjemi i 2011.",
    },
    {
      pretitle: "Avsnitt 06 · Den aperiodiske monoflisen",
      title: "2023 — én flis er nok",
      body: "I over et halvt århundre var det åpne spørsmålet om én enkelt flis kan tvinge fram aperiodisitet — en « einstein », en stein. I mars 2023 kunngjorde David Smith, Joseph Myers, Craig Kaplan og Chaim Goodman-Strauss « hatten »: en 13-kantet polygon som dekker planet bare aperiodisk, med speilinger. To måneder senere leverte samme team « spøkelset », en aperiodisk monoflis som klarer seg uten speilinger. Kjeden Wangs formodning åpnet i 1961 — gjennom Bergers 20 426, Robinsons 56, Culiks 13, Jeandel–Raos 11 — ender, seks tiår senere, i 1.",
    },
  ],
  closingTitle: "Legg en flis. Planet bestemmer.",
  closingBody:
    "Utforskeren lar deg veksle mellom et eksplisitt periodisk sett og de aperiodiske, se algoritmen rygge i sanntid når den maler seg inn i et hjørne, og zoome inn i en hvilken som helst region av den voksende flaten. Alt du nettopp leste er ett klikk unna.",
  ctaLabel: "→ Åpne utforskeren",
  tilingCaption: "Interaktivt · legg fliser, kantene må matche",
  tilingPalette: "Palett · 8 fliser",
  tilingHint:
    "Klikk en celle for å gå gjennom åtte fliser; et klikk forbi den siste tømmer den. En rød ring merker en flis hvis kant ikke stemmer med naboen. Prøv å fylle 3×3-en så hver delt kant matcher — noen konfigurasjoner har mange løsninger, andre ingen.",
  tilingOk: "Alle kanter matcher.",
  tilingBad: "Noen kanter matcher ikke.",
  tilingClear: "Tøm",
  tilingScore: (placed, valid) => `${placed} lagt · ${valid} gyldige`,
  aperiodicCaption: "Interaktivt · la en aperiodisk lapp vokse",
  aperiodicSetLabel: "Flisesett",
  aperiodicRandomize: "Nytt frø",
  aperiodicHint:
    "Et randomisert backtracking-søk fyller lerretet, celle for celle, med fliser fra det valgte settet. Uansett hvilket sett du velger, slår lappen seg aldri til ro i en liten blokk som gjentar seg — det er det aperiodisk betyr.",
};

const RICH_STORY: Record<Locale, RichStory> = {
  en,
  de,
  es,
  fr,
  it,
  pt,
  sv,
  no,
};

// ─── EncounterCard ───────────────────────────────────────────────────────────

function EncounterCard({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="glass hairline h-full space-y-3 rounded-2xl border p-6 transition-colors hover:border-signal-cyan/40">
      <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
        {label}
      </div>
      <h3 className="math-italic text-2xl leading-snug text-ink-100">{title}</h3>
      <div className="text-sm leading-relaxed text-ink-200">{children}</div>
    </div>
  );
}

// ─── The page ────────────────────────────────────────────────────────────────

export default function WangStory() {
  const { locale } = useI18n();
  const story = RICH_STORY[locale];
  const page = story.page;
  const [sec0, sec1, sec2, sec3, sec4, sec5] = story.sections;

  return (
    <StoryPageShell
      page={page}
      ctaHref="/wang/explorer"
      accent={ACCENT}
      borderAccent="border-signal-cyan/70"
      bgAccent="bg-signal-cyan/10"
      hoverAccent="hover:bg-signal-cyan/20"
      gradient="from-signal-cyan/10"
      formulaBadge="↑ ↓ ← →"
      formulaLatex={"\\uparrow \\;\\downarrow \\;\\leftarrow \\;\\rightarrow"}
      finalLabel={story.closingTitle}
    >
      {/* ── Encounter ───────────────────────────────────────────────────── */}
      <section className="mx-auto mb-32 max-w-5xl space-y-10">
        <div className="space-y-3 text-center">
          <Reveal>
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {story.encounter.pretitle}
            </div>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="math-italic text-4xl leading-tight md:text-5xl">
              {story.encounter.title}
            </h2>
          </Reveal>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {story.encounter.cards.map((card, i) => (
            <Reveal key={card.label} delay={120 + i * 100}>
              <EncounterCard label={card.label} title={card.title}>
                {i === 1 ? (
                  <>
                    <p>{card.body}</p>
                    <div className="hairline mt-4 space-y-3 rounded-md border bg-ink-950/60 p-4">
                      <div className="flex items-center justify-center gap-4">
                        <div className="flex flex-col items-center gap-1">
                          <MiniTile nesw={TILE_A} />
                          <div className="font-mono text-[10px] text-ink-400">A</div>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <MiniTile nesw={TILE_B} />
                          <div className="font-mono text-[10px] text-ink-400">B</div>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <MiniTile nesw={TILE_C} />
                          <div className="font-mono text-[10px] text-ink-400">C</div>
                        </div>
                      </div>
                      <div className="flex justify-center">
                        <div className="grid grid-cols-2 gap-px">
                          <MiniTile nesw={TILE_B} size={36} />
                          <MiniTile nesw={TILE_B} size={36} />
                          <MiniTile nesw={TILE_A} size={36} />
                          <MiniTile nesw={TILE_A} size={36} />
                        </div>
                      </div>
                      <div className="text-center font-mono text-[10px] text-ink-400">
                        valid 2×2
                      </div>
                    </div>
                  </>
                ) : (
                  <p>{card.body}</p>
                )}
              </EncounterCard>
            </Reveal>
          ))}
        </div>
        <Reveal delay={500}>
          <div className="text-center italic text-ink-300">{story.encounter.tryIt}</div>
        </Reveal>
      </section>

      {/* ── Section 01 — Wang's question ────────────────────────────────── */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec0!.pretitle}
          title={sec0!.title}
          body={sec0!.body}
          accent={ACCENT}
        />
      </section>

      {/* ── Section 02 — Berger's theorem ───────────────────────────────── */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec1!.pretitle}
          title={sec1!.title}
          body={sec1!.body}
          accent={ACCENT}
        />
        <Reveal delay={120}>
          <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-8 text-center">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              Berger · 1966
            </div>
            <div className="math-italic text-2xl leading-tight text-ink-100 md:text-3xl">
              Domino Problem ∈ undecidable
            </div>
            <p className="mx-auto max-w-xl text-sm leading-relaxed text-ink-300">
              No algorithm decides, in general, whether a finite Wang tile set tiles the plane. The
              proof reduces the halting problem to a tiling question.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ── INTERACTIVE 1 — Tile-matching playground ────────────────────── */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <Reveal delay={120}>
          <WangTileGrid
            caption={story.tilingCaption}
            hint={story.tilingHint}
            paletteLabel={story.tilingPalette}
            okLabel={story.tilingOk}
            badLabel={story.tilingBad}
            clearLabel={story.tilingClear}
            scoreLabel={story.tilingScore}
          />
        </Reveal>
      </section>

      {/* ── Section 03 — Encoding Turing machines ───────────────────────── */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec2!.pretitle}
          title={sec2!.title}
          body={sec2!.body}
          accent={ACCENT}
        />
      </section>

      {/* ── Section 04 — Shrinking the record ───────────────────────────── */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec3!.pretitle}
          title={sec3!.title}
          body={sec3!.body}
          accent={ACCENT}
        />
        <Reveal delay={120}>
          <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-6">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              Shrinking the aperiodic record
            </div>
            <table className="w-full font-mono text-sm">
              <thead className="hairline border-b text-ink-300">
                <tr>
                  <th className="px-2 py-2 text-left text-[10px] uppercase tracking-widest">
                    Year
                  </th>
                  <th className="px-2 py-2 text-left text-[10px] uppercase tracking-widest">
                    Author
                  </th>
                  <th className="px-2 py-2 text-right text-[10px] uppercase tracking-widest">
                    Tiles
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["1961", "Hao Wang — conjecture: none exist", "—"],
                  ["1966", "Robert Berger — first aperiodic set", "20,426"],
                  ["1971", "Raphael Robinson", "56"],
                  ["1996", "Jarkko Kari", "14"],
                  ["1996", "Karel Culik II", "13"],
                  ["2015", "Jeandel & Rao — proven minimum", "11"],
                ].map(([yr, who, n]) => (
                  <tr key={yr + who} className="border-b border-ink-700/30 last:border-0">
                    <td className="px-2 py-2 text-signal-cyan">{yr}</td>
                    <td className="px-2 py-2 text-ink-200">{who}</td>
                    <td className="px-2 py-2 text-right text-signal-amber">{n}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </section>

      {/* ── INTERACTIVE 2 — Aperiodic tiler ─────────────────────────────── */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <Reveal delay={120}>
          <WangAperiodicTiler
            caption={story.aperiodicCaption}
            randomizeLabel={story.aperiodicRandomize}
            setLabel={story.aperiodicSetLabel}
            hint={story.aperiodicHint}
          />
        </Reveal>
      </section>

      {/* ── Section 05 — Quasicrystals ──────────────────────────────────── */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec4!.pretitle}
          title={sec4!.title}
          body={sec4!.body}
          accent={ACCENT}
        />
      </section>

      {/* ── Section 06 — The aperiodic monotile ─────────────────────────── */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec5!.pretitle}
          title={sec5!.title}
          body={sec5!.body}
          accent={ACCENT}
        />
        <Reveal delay={120}>
          <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-8 text-center">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              Smith · Myers · Kaplan · Goodman-Strauss · 2023
            </div>
            <div className="math-italic text-5xl leading-tight text-ink-100 md:text-6xl">
              ein Stein · 1
            </div>
            <p className="mx-auto max-w-xl text-sm leading-relaxed text-ink-300">
              The «hat» (March 2023) tiles only aperiodically using reflections. The «spectre» (May
              2023) removes even that requirement.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ── Closing CTA — unified pattern ───────────────────────────────── */}
      <Reveal>
        <section className="glass hairline mx-auto mb-16 max-w-3xl space-y-6 rounded-3xl border p-10 text-center">
          <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
            {page.ctaInteractive}
          </div>
          <div className="math-italic shimmer-text text-3xl leading-tight md:text-5xl">
            {story.closingTitle}
          </div>
          <p className="leading-relaxed text-ink-200">{story.closingBody}</p>
          <Link
            href="/wang/explorer"
            className="inline-block rounded-full border border-signal-cyan/70 bg-signal-cyan/10 px-8 py-4 font-mono text-sm uppercase tracking-widest2 text-signal-cyan transition-colors hover:bg-signal-cyan/25"
          >
            {story.ctaLabel}
          </Link>
        </section>
      </Reveal>
    </StoryPageShell>
  );
}
