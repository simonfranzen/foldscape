import type { ExplorerGuide } from "./types";

// Numbers quoted here (sets of 5, 13 and 16 tiles, grid 4 to 24 default 16,
// speed 1 to 400 default 60, the reduced-motion step budget, the five missing
// edge pairs of Set B, typical backtrack counts) come from
// app/wang/explorer/page.tsx and from running its step() logic offline;
// update both together.
const SEARCH_EXCERPT = `// Compatible tiles: only the neighbours above and to the left are fixed.
for (let i = 0; i < tiles.length; i++) {
  const t = tiles[i];
  if (above && t.N !== above.S) continue;
  if (left && t.W !== left.E) continue;
  out.push(i);
}

if (candidates.length === 0) {
  // Backtrack: clear the top of the stack and try its next remaining choice.
  while (stack.length > 0) {
    const top = stack[stack.length - 1];
    grid[top.row][top.col] = null;
    if (top.remaining.length > 0) {
      grid[top.row][top.col] = tiles[top.remaining.shift()];
      break;
    }
    stack.pop();
  }
}`;

export const WANG_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Watch a backtracking search lay Wang tiles edge to edge: compare three tile sets, see why some never get stuck, and how the domino problem became undecidable.",
    heading: "How this explorer works",
    intro:
      "Each square tile has a colour on each of its four edges, and tiles may only touch where their colours match: the bottom of a tile must equal the top of the tile below it, its right edge the left edge of its neighbour. Tiles cannot be rotated or reflected. The canvas shows a search filling a square grid under these rules, one tile at a time, backing up at every dead end.",
    sections: [
      {
        heading: "Wang's question",
        paragraphs: [
          "In 1961 the logician Hao Wang asked whether there is an algorithm that decides, for any finite set of such tiles, whether copies of them can cover the entire infinite plane. He conjectured that every set that tiles the plane can also tile it periodically, which would have given such an algorithm. In 1966 his student Robert Berger proved both wrong. There are aperiodic tile sets, which tile the plane but only without any repetition, and Berger showed that the general question is undecidable, because tiles can be designed to imitate the run of a Turing machine. Berger's set had 20,426 tiles; later work brought the record down to 13 (Karel Culik, 1996) and finally 11 (Jeandel and Rao, 2015).",
          "A useful fact connects the infinite question to this finite grid: a tile set covers the whole plane exactly when it can fill every n × n square. So if an exhaustive search ever proves that some square cannot be filled, the set can never tile the plane. Success on a finite square, on the other hand, proves nothing on its own.",
        ],
        formula: "S(t_{r,c}) = N(t_{r+1,c}), \\qquad E(t_{r,c}) = W(t_{r,c+1})",
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "Set A has five tiles in two colours. Set B has 13 tiles in four colours, built in the spirit of the Kari-Culik constructions to make the search work hard; the code itself makes no claim that this exact list is aperiodic. Set C contains all 16 tiles you can make with two colours. The palette in the sidebar shows every tile of the active set.",
          "The grid size runs from 4 × 4 to 24 × 24 (default 16 × 16) and the speed from 1 to 400 placements per second (default 60). Changing the set or the size, or pressing Restart, starts a fresh search on an empty grid. The counters under the canvas show filled cells, dead ends hit so far, progress and status.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "The search fills the grid in reading order, row by row, left to right. For each cell it lists the tiles whose top matches the bottom of the tile above and whose left edge matches the right edge of the tile to the left. The grid has hard borders and no wraparound, so cells in the first row or column face only one constraint. The candidates are shuffled with a Fisher-Yates shuffle; the first one is placed and the rest are pushed onto a stack as untried alternatives for that cell.",
          "When a cell has no candidate, the search backtracks: it clears the most recent cell and places that cell's next alternative, and if there is none it pops further back. Every such dead end increments the backtrack counter. If the stack empties, no arrangement exists and the status reads «no tiling found». An animation loop runs as many steps per frame as the speed requires and stops once the search has finished.",
          "With reduced motion enabled, the page runs the whole search at once and draws only the result. That run has a fixed budget of grid size² × number of tiles × 50 steps, so in this mode «no tiling found» can also mean that the budget ran out.",
        ],
        code: SEARCH_EXCERPT,
      },
      {
        heading: "Why some sets never backtrack",
        paragraphs: [
          "Inside the grid, every cell asks for one specific pair: a given top colour and a given left colour. If the set has a tile for every possible pair, the search can never get stuck. Set A has a tile for each of the four pairs with two colours, and Set C has four tiles for each, so both always finish without a single backtrack.",
          "Set B has four colours, so 16 possible pairs, but only 13 tiles, and two pairs are covered twice. That leaves five pairs with no matching tile at all: top and left colours (0, 0), (0, 3), (1, 0), (2, 2) and (3, 1). Whenever earlier choices produce one of them, the search has to back up. Because backtracking is chronological, an early bad choice is only undone after every continuation of it has been tried, which on larger grids can take practically forever.",
        ],
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "A search that never hesitates",
        text: "Choose Set A, a 24 × 24 grid and speed 400. The backtrack counter stays at zero all the way to 576 placed tiles, because every top and left pair has a matching tile.",
      },
      {
        title: "Watch a dead end",
        text: "Choose Set B with an 8 × 8 grid and slow the speed to about 10. Whenever the violet outline marking the next cell reaches one of the five missing pairs, cells clear behind it and the backtrack counter jumps. Typically an 8 × 8 grid finishes after somewhere between a few dozen and a couple of thousand backtracks.",
      },
      {
        title: "When backtracking explodes",
        text: "Keep Set B and set the grid to 16 × 16 at speed 400. Progress climbs and collapses again and again and often never completes, because an early mistake can only be repaired after everything that follows it has been exhausted. Restart reshuffles.",
      },
      {
        title: "Randomness that is still periodic",
        text: "Choose Set C at 24 × 24. The result looks like random noise and needs no backtracking, yet this set trivially tiles the plane periodically: it contains the tile with four cyan edges, and copies of that one tile alone repeat forever.",
      },
    ],
  },
  de: {
    metaDescription:
      "Einer Backtracking-Suche beim Legen von Wang-Kacheln zusehen: drei Kachelsätze vergleichen und verstehen, warum das Dominoproblem unentscheidbar ist.",
    heading: "So funktioniert dieser Explorer",
    intro:
      "Jede quadratische Kachel hat an jeder ihrer vier Kanten eine Farbe, und Kacheln dürfen sich nur dort berühren, wo die Farben übereinstimmen: Die Unterkante einer Kachel muss zur Oberkante der Kachel darunter passen, ihre rechte Kante zur linken Kante der Nachbarin. Drehen und Spiegeln ist verboten. Das Canvas zeigt eine Suche, die ein quadratisches Gitter nach diesen Regeln füllt, Kachel für Kachel, und an jeder Sackgasse zurückgeht.",
    sections: [
      {
        heading: "Wangs Frage",
        paragraphs: [
          "1961 fragte der Logiker Hao Wang, ob es einen Algorithmus gibt, der für jede endliche Menge solcher Kacheln entscheidet, ob ihre Kopien die ganze unendliche Ebene bedecken können. Er vermutete, dass jeder Satz, der die Ebene kachelt, das auch periodisch kann, und das hätte einen solchen Algorithmus geliefert. 1966 widerlegte sein Doktorand Robert Berger beides. Es gibt aperiodische Kachelsätze, die die Ebene nur ohne jede Wiederholung bedecken, und Berger zeigte, dass die allgemeine Frage unentscheidbar ist, weil sich Kacheln so entwerfen lassen, dass sie den Lauf einer Turingmaschine nachahmen. Bergers Satz hatte 20.426 Kacheln; spätere Arbeiten drückten den Rekord auf 13 (Karel Culik, 1996) und schließlich auf 11 (Jeandel und Rao, 2015).",
          "Eine nützliche Tatsache verbindet die unendliche Frage mit diesem endlichen Gitter: Ein Kachelsatz bedeckt die ganze Ebene genau dann, wenn er jedes n × n-Quadrat füllen kann. Beweist eine vollständige Suche also, dass sich ein Quadrat nicht füllen lässt, kann der Satz die Ebene niemals kacheln. Erfolg auf einem endlichen Quadrat beweist dagegen für sich genommen nichts.",
        ],
        formula: "S(t_{r,c}) = N(t_{r+1,c}), \\qquad E(t_{r,c}) = W(t_{r,c+1})",
      },
      {
        heading: "Was die Regler bewirken",
        paragraphs: [
          "Satz A hat fünf Kacheln in zwei Farben. Satz B hat 13 Kacheln in vier Farben, gebaut im Geist der Konstruktionen von Kari und Culik, damit die Suche sich anstrengen muss; der Code selbst behauptet nicht, dass genau diese Liste aperiodisch ist. Satz C enthält alle 16 Kacheln, die sich mit zwei Farben bilden lassen. Die Palette in der Seitenleiste zeigt jede Kachel des aktiven Satzes.",
          "Die Gittergröße reicht von 4 × 4 bis 24 × 24 (voreingestellt 16 × 16), die Geschwindigkeit von 1 bis 400 Platzierungen pro Sekunde (voreingestellt 60). Ein Wechsel von Satz oder Größe oder ein Klick auf Neustart beginnt eine frische Suche auf leerem Gitter. Die Zähler unter dem Canvas zeigen gefüllte Zellen, bisherige Sackgassen, Fortschritt und Status.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Die Suche füllt das Gitter in Leserichtung, Zeile für Zeile, von links nach rechts. Für jede Zelle sammelt sie die Kacheln, deren Oberkante zur Unterkante der Kachel darüber passt und deren linke Kante zur rechten Kante der Kachel links davon. Das Gitter hat feste Ränder ohne Umlauf, Zellen in der ersten Zeile oder Spalte haben also nur eine Bedingung. Die Kandidaten werden mit einem Fisher-Yates-Shuffle gemischt; der erste wird gelegt, der Rest landet als noch nicht probierte Alternativen für diese Zelle auf einem Stapel.",
          "Hat eine Zelle keinen Kandidaten, setzt die Suche zurück: Sie leert die zuletzt belegte Zelle und legt dort deren nächste Alternative, und gibt es keine, geht sie weiter zurück. Jede solche Sackgasse erhöht den Backtrack-Zähler. Wird der Stapel leer, gibt es keine Anordnung, und der Status lautet «keine Kachelung gefunden». Eine Animationsschleife führt pro Frame so viele Schritte aus, wie die Geschwindigkeit verlangt, und hört auf, sobald die Suche beendet ist.",
          "Bei reduzierter Bewegung rechnet die Seite die ganze Suche auf einmal und zeichnet nur das Ergebnis. Dieser Lauf hat ein festes Budget von Gittergröße² × Kachelzahl × 50 Schritten, in diesem Modus kann «keine Kachelung gefunden» also auch heißen, dass das Budget aufgebraucht ist.",
        ],
        code: SEARCH_EXCERPT,
      },
      {
        heading: "Warum manche Sätze nie zurücksetzen",
        paragraphs: [
          "Im Inneren des Gitters verlangt jede Zelle ein bestimmtes Paar: eine gegebene Farbe oben und eine gegebene Farbe links. Hat der Satz für jedes mögliche Paar eine Kachel, kann die Suche nie stecken bleiben. Satz A hat für jedes der vier Paare mit zwei Farben eine Kachel, Satz C sogar vier, deshalb werden beide immer ohne ein einziges Backtracking fertig.",
          "Satz B hat vier Farben, also 16 mögliche Paare, aber nur 13 Kacheln, und zwei Paare sind doppelt abgedeckt. Damit bleiben fünf Paare ganz ohne passende Kachel: Farbe oben und links (0, 0), (0, 3), (1, 0), (2, 2) und (3, 1). Sobald frühere Entscheidungen eines davon erzeugen, muss die Suche zurück. Weil das Backtracking chronologisch ist, wird eine frühe schlechte Wahl erst rückgängig gemacht, wenn jede ihrer Fortsetzungen probiert wurde, und das kann auf größeren Gittern praktisch ewig dauern.",
        ],
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Eine Suche ohne Zögern",
        text: "Wähle Satz A, ein 24 × 24-Gitter und Geschwindigkeit 400. Der Backtrack-Zähler bleibt bis zur 576. Kachel bei null, weil es für jedes Paar aus oberer und linker Farbe eine passende Kachel gibt.",
      },
      {
        title: "Eine Sackgasse beobachten",
        text: "Wähle Satz B mit einem 8 × 8-Gitter und senk die Geschwindigkeit auf etwa 10. Trifft der violette Rahmen, der die nächste Zelle markiert, auf eines der fünf fehlenden Paare, leeren sich Zellen hinter ihm, und der Backtrack-Zähler springt. Typischerweise ist ein 8 × 8-Gitter nach einigen Dutzend bis ein paar tausend Backtracks fertig.",
      },
      {
        title: "Wenn das Backtracking explodiert",
        text: "Bleib bei Satz B und stell das Gitter auf 16 × 16 bei Geschwindigkeit 400. Der Fortschritt steigt und bricht immer wieder ein und wird oft nie fertig, weil sich ein früher Fehler erst reparieren lässt, wenn alles, was darauf folgt, erschöpft ist. Neustart mischt neu.",
      },
      {
        title: "Zufällig und trotzdem periodisch",
        text: "Wähle Satz C bei 24 × 24. Das Ergebnis sieht aus wie zufälliges Rauschen und braucht kein Backtracking, trotzdem kachelt dieser Satz die Ebene ganz trivial periodisch: Er enthält die Kachel mit vier cyanfarbenen Kanten, und Kopien dieser einen Kachel allein wiederholen sich endlos.",
      },
    ],
  },
};
