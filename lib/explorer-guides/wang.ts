import type { ExplorerGuide } from "./types";

// Numbers quoted here (sets of 5, 13 and 16 tiles, grid 4 to 24 default 16,
// speed 1 to 400 default 60, the reduced-motion step budget, the edge pairs
// Set B covers, its periodic 3 × 2 block, typical backtrack and step counts)
// come from app/[locale]/wang/explorer/page.tsx and from running its step()
// logic offline; update both together.
const SEARCH_EXCERPT = `// Candidates: tiles still allowed here that also survive the look-ahead.
for (let i = 0; i < tiles.length; i++) {
  if (dom[cell] & (1 << i) && assign(dom, n, sideMasks, cell, i)) candidates.push(i);
}
shuffle(candidates);

if (candidates.length === 0) {
  // Backtrack: pop the top of the stack and try its next remaining choice.
  while (stack.length > 0) {
    const top = stack[stack.length - 1];
    const topCell = cellAt(stack.length - 1);
    if (top.remaining.length > 0) {
      const nextIdx = top.remaining.shift()!;
      domRef.current = assign(top.before, n, sideMasks, topCell, nextIdx) ?? top.before;
      grid[topCell] = tiles[nextIdx];
      return true;
    }
    grid[topCell] = null;
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
          "Set A has five tiles in two colours. Set B has 13 tiles in four colours, as many as Culik's aperiodic set, but it is not aperiodic: the block of tiles 0, 1, 10 above tiles 0, 3, 12 fits itself on all sides and repeats across the plane. It is here because it makes the search work hard. Set C contains all 16 tiles you can make with two colours. The palette in the sidebar shows every tile of the active set.",
          "The grid size runs from 4 × 4 to 24 × 24 (default 16 × 16) and the speed from 1 to 400 placements per second (default 60). Changing the set or the size, or pressing Restart, starts a fresh search on an empty grid. The counters under the canvas show filled cells, dead ends hit so far, progress and status.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "The search fills the grid backwards: it starts in the bottom-right corner, moves left along each row and then up. Every cell keeps a list of the tiles still possible there. To test a tile, the search places it tentatively and strikes from the neighbouring cells every tile that has lost its matching partner, then does the same for their neighbours until nothing changes (this is called arc consistency). If some cell is left with no tile at all, the candidate is dropped. The surviving candidates are shuffled with a Fisher-Yates shuffle; the first one is placed and the rest are kept on a stack as untried alternatives. The grid has hard borders and no wraparound.",
          "When a cell has no surviving candidate, the search backtracks: it replaces the most recent tile with that cell's next alternative, and if there is none it clears the cell and goes further back. Every such dead end increments the backtrack counter. If the stack empties, every arrangement has been ruled out and the status reads «no tiling exists (proved)». With the three sets offered here that never happens, because all of them tile the plane. An animation loop runs as many steps per frame as the speed requires and stops once the search has finished.",
          "With reduced motion enabled, the page runs the whole search at once and draws only the result. That run has a fixed budget of grid size² × number of tiles × 50 steps. If it ran out, the status would read «gave up after N steps» rather than claim a proof. In 3150 offline runs of Set B over all grid sizes the longest search took 4454 steps, while the smallest budget, at 4 × 4, is 10,400.",
        ],
        code: SEARCH_EXCERPT,
      },
      {
        heading: "Why some sets never backtrack",
        paragraphs: [
          "Inside the grid, every cell asks for one specific pair: because the search works backwards, a given bottom colour and a given right colour. If the set has a tile for every possible pair, the search can never get stuck. Set A has a tile for each of the four pairs with two colours, and Set C has four tiles for each, so both always finish without a single backtrack.",
          "Set B has four colours, so 16 possible pairs, but its 13 tiles cover only eight pairs of bottom and right colour. The look-ahead removes most dead ends before a tile is placed, but not all of them, so the search still has to back up. The direction matters a great deal: seen from the top-left, five pairs of top and left colour are missing, namely (0, 0), (0, 3), (1, 0), (2, 2) and (3, 1), and the same search started in that corner ran past 200,000 steps in more than half of our test runs at 20 × 20. From the bottom-right it needed at most a few thousand at every size.",
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
        text: "Choose Set B with a 12 × 12 grid and slow the speed to about 10. The violet outline marks the next cell, starting at the bottom right. Whenever no tile survives the look-ahead there, the cells before it change or clear and the backtrack counter goes up. A 12 × 12 grid typically finishes after about ten backtracks, occasionally after several dozen.",
      },
      {
        title: "A hard set that still finishes",
        text: "Keep Set B and set the grid to 24 × 24 at speed 400. Progress climbs and falls back many times in the lower rows and then runs through: in our test runs this took around 850 steps and 50 backtracks in the middle case, and never more than about 5000 steps. Restart reshuffles and produces a different tiling.",
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
          "Satz A hat fünf Kacheln in zwei Farben. Satz B hat 13 Kacheln in vier Farben, so viele wie Culiks aperiodischer Satz, ist aber nicht aperiodisch: Der Block aus den Kacheln 0, 1, 10 über den Kacheln 0, 3, 12 passt an allen Seiten an sich selbst und wiederholt sich über die ganze Ebene. Er ist dabei, weil die Suche sich an ihm anstrengen muss. Satz C enthält alle 16 Kacheln, die sich mit zwei Farben bilden lassen. Die Palette in der Seitenleiste zeigt jede Kachel des aktiven Satzes.",
          "Die Gittergröße reicht von 4 × 4 bis 24 × 24 (voreingestellt 16 × 16), die Geschwindigkeit von 1 bis 400 Platzierungen pro Sekunde (voreingestellt 60). Ein Wechsel von Satz oder Größe oder ein Klick auf Neustart beginnt eine frische Suche auf leerem Gitter. Die Zähler unter dem Canvas zeigen gefüllte Zellen, bisherige Sackgassen, Fortschritt und Status.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Die Suche füllt das Gitter rückwärts: Sie beginnt in der Ecke unten rechts, geht in jeder Zeile nach links und dann nach oben. Jede Zelle führt eine Liste der Kacheln, die dort noch möglich sind. Um eine Kachel zu prüfen, legt die Suche sie probeweise und streicht in den Nachbarzellen jede Kachel, die ihre passende Partnerin verloren hat, dann ebenso bei deren Nachbarinnen, bis sich nichts mehr ändert (das heißt Kantenkonsistenz). Bleibt irgendeine Zelle ganz ohne Kachel, fällt der Kandidat weg. Die übrigen Kandidaten werden mit einem Fisher-Yates-Shuffle gemischt; der erste wird gelegt, der Rest landet als noch nicht probierte Alternativen auf einem Stapel. Das Gitter hat feste Ränder ohne Umlauf.",
          "Hat eine Zelle keinen übrigen Kandidaten, setzt die Suche zurück: Sie ersetzt die zuletzt gelegte Kachel durch die nächste Alternative dieser Zelle, und gibt es keine, leert sie die Zelle und geht weiter zurück. Jede solche Sackgasse erhöht den Backtrack-Zähler. Wird der Stapel leer, ist jede Anordnung ausgeschlossen, und der Status lautet «keine Kachelung möglich (bewiesen)». Bei den drei angebotenen Sätzen passiert das nie, weil alle die Ebene kacheln. Eine Animationsschleife führt pro Frame so viele Schritte aus, wie die Geschwindigkeit verlangt, und hört auf, sobald die Suche beendet ist.",
          "Bei reduzierter Bewegung rechnet die Seite die ganze Suche auf einmal und zeichnet nur das Ergebnis. Dieser Lauf hat ein festes Budget von Gittergröße² × Kachelzahl × 50 Schritten. Wäre es aufgebraucht, hieße der Status «nach N Schritten abgebrochen», statt einen Beweis zu behaupten. In 3150 Testläufen mit Satz B über alle Gittergrößen brauchte die längste Suche 4454 Schritte, während das kleinste Budget, bei 4 × 4, bei 10.400 liegt.",
        ],
        code: SEARCH_EXCERPT,
      },
      {
        heading: "Warum manche Sätze nie zurücksetzen",
        paragraphs: [
          "Im Inneren des Gitters verlangt jede Zelle ein bestimmtes Paar: weil die Suche rückwärts arbeitet, eine gegebene Farbe unten und eine gegebene Farbe rechts. Hat der Satz für jedes mögliche Paar eine Kachel, kann die Suche nie stecken bleiben. Satz A hat für jedes der vier Paare mit zwei Farben eine Kachel, Satz C sogar vier, deshalb werden beide immer ohne ein einziges Backtracking fertig.",
          "Satz B hat vier Farben, also 16 mögliche Paare, aber seine 13 Kacheln decken nur acht Paare aus unterer und rechter Farbe ab. Die Vorausschau räumt die meisten Sackgassen weg, bevor eine Kachel gelegt wird, aber nicht alle, also muss die Suche trotzdem zurück. Die Richtung macht viel aus: Von oben links gesehen fehlen fünf Paare aus oberer und linker Farbe, nämlich (0, 0), (0, 3), (1, 0), (2, 2) und (3, 1), und dieselbe Suche lief von dieser Ecke aus bei 20 × 20 in mehr als der Hälfte unserer Testläufe über 200.000 Schritte hinaus. Von unten rechts brauchte sie bei jeder Größe höchstens ein paar tausend.",
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
        text: "Wähle Satz B mit einem 12 × 12-Gitter und senk die Geschwindigkeit auf etwa 10. Der violette Rahmen markiert die nächste Zelle und startet unten rechts. Übersteht dort keine Kachel die Vorausschau, wechseln oder leeren sich die Zellen davor, und der Backtrack-Zähler steigt. Typischerweise ist ein 12 × 12-Gitter nach etwa zehn Backtracks fertig, gelegentlich erst nach mehreren Dutzend.",
      },
      {
        title: "Ein harter Satz, der trotzdem fertig wird",
        text: "Bleib bei Satz B und stell das Gitter auf 24 × 24 bei Geschwindigkeit 400. Der Fortschritt steigt und fällt in den unteren Zeilen viele Male zurück und läuft dann durch: In unseren Testläufen waren das im mittleren Fall rund 850 Schritte und 50 Backtracks und nie mehr als etwa 5000 Schritte. Neustart mischt neu und liefert eine andere Kachelung.",
      },
      {
        title: "Zufällig und trotzdem periodisch",
        text: "Wähle Satz C bei 24 × 24. Das Ergebnis sieht aus wie zufälliges Rauschen und braucht kein Backtracking, trotzdem kachelt dieser Satz die Ebene ganz trivial periodisch: Er enthält die Kachel mit vier cyanfarbenen Kanten, und Kopien dieser einen Kachel allein wiederholen sich endlos.",
      },
    ],
  },
};
