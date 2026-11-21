import type { ExplorerGuide } from "./types";

// Numbers quoted here (120 x 70 torus, 1 to 60 gen/s with default 12, the
// 20-steps-per-frame cap, 25 % random density) match app/life/sandbox/page.tsx
// and lib/life/patterns.ts; update both together.
const STEP_EXCERPT = `function step(src: Grid, dst: Grid) {
  for (let y = 0; y < ROWS; y++) {
    const yN = (y - 1 + ROWS) % ROWS;   // wrap top edge to bottom
    const yS = (y + 1) % ROWS;
    for (let x = 0; x < COLS; x++) {
      const xW = (x - 1 + COLS) % COLS; // wrap left edge to right
      const xE = (x + 1) % COLS;
      const n =
        src[yN * COLS + xW] + src[yN * COLS + x] + src[yN * COLS + xE] +
        src[y * COLS + xW]  +                      src[y * COLS + xE]  +
        src[yS * COLS + xW] + src[yS * COLS + x] + src[yS * COLS + xE];
      const alive = src[y * COLS + x] === 1;
      dst[y * COLS + x] = alive ? (n === 2 || n === 3 ? 1 : 0) : n === 3 ? 1 : 0;
    }
  }
}`;

export const LIFE_SANDBOX_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Draw cells, load gliders, the Gosper gun or the R-pentomino and run Conway's Game of Life on a 120 × 70 torus. Learn the rules and how the simulation is built.",
    heading: "How this sandbox works",
    intro:
      "The grid is a universe of 8400 cells, each either alive (a glowing dot) or dead (empty). Time moves in discrete generations, and in every generation all cells update at once according to the same tiny rule. There is no player and no randomness once you press play: whatever you draw or load is the entire input, and everything that follows is forced. The surprise of Conway's Game of Life is how much behaviour fits into such a rule: particles that travel, machines that build other particles, and patterns that churn for thousands of generations before they settle.",
    sections: [
      {
        heading: "The rule",
        paragraphs: [
          "John Horton Conway devised the game in 1970, and Martin Gardner made it famous in his Scientific American column that October. Each cell looks at its eight neighbours, the cells touching it horizontally, vertically and diagonally. A live cell with two or three live neighbours survives; with fewer it dies of loneliness, with more it dies of overcrowding. A dead cell with exactly three live neighbours comes alive. In the shorthand used for such rules this is B3/S23: born on 3, survives on 2 or 3.",
          "Written as a function of the current state s (1 for alive) and the neighbour count n, the next state is:",
        ],
        formula:
          "s' = \\begin{cases} 1 & \\text{if } n = 3, \\\\ s & \\text{if } n = 2, \\\\ 0 & \\text{otherwise.} \\end{cases}",
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "The sandbox opens paused, with a Gosper glider gun near the top left corner. Play starts the clock, Pause stops it, and Step advances exactly one generation (it is disabled while the simulation runs). The speed slider sets the rate from 1 to 60 generations per second, starting at 12.",
          "Click a cell to toggle it. The state you create with that first click decides what a drag does: if you switched a cell on, dragging paints live cells; if you switched one off, dragging erases. Drawing works while the simulation is running too. Random fills the board so that each cell is alive with probability 25 %, Clear empties it, and both reset the generation counter.",
          "The pattern buttons clear the board and place one classic pattern near the centre: the glider, the lightweight spaceship, the period-3 pulsar, the Gosper glider gun, and three long-lived seeds, the R-pentomino, the acorn and diehard. The colour buttons only change how live cells are painted. The badge at the top shows the generation, the number of live cells and their share of the 8400.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "The board is a single Uint8Array of 120 × 70 bytes, one byte per cell. Generation t + 1 is never computed in place, because a cell must see its neighbours as they were, not as they are being updated. Instead there are two arrays: step() reads from the current one, writes into the other, and then the two references are swapped. No memory is allocated while the game runs.",
          "The edges wrap around. The neighbour of a cell in the rightmost column is in the leftmost column, and the same holds for top and bottom, which turns the rectangle into the surface of a torus. That is why a glider leaving the bottom right reappears at the top left instead of vanishing.",
          "The clock uses requestAnimationFrame with a time accumulator: it adds up the real time since the last frame and runs as many generations as fit into it at the chosen speed, but never more than 20 per frame, so a slow device cannot get stuck catching up. Drawing is separate from simulation. All live cells are added to one canvas path of small circles and filled in one call with a soft glow, on a faint guide grid every ten cells. Nothing moves until you press Play, so the page stays still for people who prefer reduced motion.",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "A finite world always repeats",
        paragraphs: [
          "On an infinite plane the Gosper gun grows forever, emitting a new glider every 30 generations. On this board that cannot happen. A 120 × 70 torus has 2^8400 possible configurations, an enormous but finite number, and each one has exactly one successor. Sooner or later the sequence must revisit a configuration it has seen, and from then on it cycles forever. Every run here therefore ends in a still life, an oscillation, or a very long loop.",
          "The wrapping also changes the famous lifetimes. The R-pentomino's 1103 generations and the acorn's 5206 are measured on an unbounded plane. Here, the gliders they shed come back around and crash into the remaining debris, so the history you see differs from the textbook one. Diehard is small enough to stay unaffected: it disappears after 130 generations either way.",
        ],
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "Count to 130",
        text: "Load Diehard and press Step a few times to see it change, then press Play at 12 gen/s. It never repeats a shape, and at generation 130 the population counter drops to exactly 0.",
      },
      {
        title: "Measure a spaceship",
        text: "Load the lightweight spaceship and set the speed to 60. It moves two cells every four generations, so it crosses all 120 columns and returns to where it started after 240 generations. A glider needs far longer: moving one cell diagonally per four generations, it only returns to its exact starting cell after 3360 generations, because 840 is the smallest number divisible by both 120 and 70.",
      },
      {
        title: "Watch the gun overrun its own world",
        text: "Press Play on the starting glider gun. At first a neat stream of gliders leaves it every 30 generations. Keep watching as the stream wraps around the torus: sooner or later returning gliders run into the gun itself, and the clean machine breaks up into debris.",
      },
    ],
  },
  de: {
    metaDescription:
      "Zellen zeichnen, Gleiter, Gosper-Kanone oder R-Pentomino laden und Conways Game of Life auf einem 120 × 70 Torus laufen lassen, samt Regeln und Bauplan.",
    heading: "So funktioniert diese Sandbox",
    intro:
      "Das Gitter ist ein Universum aus 8400 Zellen, jede entweder lebendig (ein leuchtender Punkt) oder tot (leer). Die Zeit läuft in einzelnen Generationen, und in jeder Generation ändern sich alle Zellen gleichzeitig nach derselben winzigen Regel. Sobald du Play drückst, gibt es weder Spieler:innen noch Zufall: Was du zeichnest oder lädst, ist die gesamte Eingabe, und alles Weitere steht fest. Das Verblüffende an Conways Game of Life ist, wie viel Verhalten in so eine Regel passt: Teilchen, die wandern, Maschinen, die andere Teilchen erzeugen, und Muster, die Tausende Generationen lang brodeln, bevor sie zur Ruhe kommen.",
    sections: [
      {
        heading: "Die Regel",
        paragraphs: [
          "John Horton Conway erfand das Spiel 1970, berühmt wurde es durch Martin Gardners Kolumne in Scientific American im Oktober desselben Jahres. Jede Zelle betrachtet ihre acht Nachbarn, also alle Zellen, die sie waagerecht, senkrecht oder diagonal berühren. Eine lebende Zelle mit zwei oder drei lebenden Nachbarn überlebt; mit weniger stirbt sie an Einsamkeit, mit mehr an Überbevölkerung. Eine tote Zelle mit genau drei lebenden Nachbarn wird geboren. In der üblichen Kurzschreibweise heißt das B3/S23: geboren bei 3, überlebt bei 2 oder 3.",
          "Als Funktion des aktuellen Zustands s (1 für lebendig) und der Nachbarzahl n lautet der nächste Zustand:",
        ],
        formula:
          "s' = \\begin{cases} 1 & \\text{falls } n = 3, \\\\ s & \\text{falls } n = 2, \\\\ 0 & \\text{sonst.} \\end{cases}",
      },
      {
        heading: "Was die Bedienelemente tun",
        paragraphs: [
          "Die Sandbox startet pausiert, mit einer Gosper-Gleiterkanone nahe der linken oberen Ecke. Play startet die Uhr, Pause hält sie an, und Schritt rückt genau eine Generation vor (während die Simulation läuft, ist der Knopf gesperrt). Der Geschwindigkeitsregler stellt 1 bis 60 Generationen pro Sekunde ein, Startwert ist 12.",
          "Ein Klick auf eine Zelle schaltet sie um. Der Zustand, den dieser erste Klick erzeugt, legt fest, was Ziehen bewirkt: Hast du eine Zelle eingeschaltet, malst du beim Ziehen lebende Zellen, hast du eine ausgeschaltet, radierst du. Zeichnen funktioniert auch bei laufender Simulation. Zufall füllt das Brett so, dass jede Zelle mit Wahrscheinlichkeit 25 % lebt, Leeren räumt es ab, und beide setzen den Generationszähler zurück.",
          "Die Musterknöpfe leeren das Brett und setzen ein klassisches Muster in die Nähe der Mitte: den Gleiter, das leichte Raumschiff, den Pulsar mit Periode 3, die Gosper-Kanone und drei langlebige Startmuster, das R-Pentomino, die Eichel (Acorn) und Diehard. Die Farbknöpfe ändern nur, wie lebende Zellen gemalt werden. Die Anzeige oben zeigt Generation, Zahl der lebenden Zellen und ihren Anteil an den 8400.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Das Brett ist ein einziges Uint8Array mit 120 × 70 Bytes, ein Byte pro Zelle. Generation t + 1 wird nie an Ort und Stelle berechnet, denn eine Zelle muss ihre Nachbarn so sehen, wie sie waren, nicht wie sie gerade aktualisiert werden. Deshalb gibt es zwei Arrays: step() liest aus dem aktuellen, schreibt in das andere, danach werden die beiden Referenzen getauscht. Während das Spiel läuft, wird kein Speicher neu angelegt.",
          "Die Ränder sind verbunden. Der Nachbar einer Zelle in der rechten Spalte liegt in der linken Spalte, genauso oben und unten. Damit wird das Rechteck zur Oberfläche eines Torus. Deshalb taucht ein Gleiter, der unten rechts hinausläuft, oben links wieder auf, statt zu verschwinden.",
          "Die Uhr nutzt requestAnimationFrame mit einem Zeitakkumulator: Sie summiert die echte Zeit seit dem letzten Frame und rechnet so viele Generationen, wie bei der gewählten Geschwindigkeit hineinpassen, aber nie mehr als 20 pro Frame, damit ein langsames Gerät nicht beim Aufholen hängen bleibt. Zeichnen ist von der Simulation getrennt. Alle lebenden Zellen kommen in einen einzigen Canvas-Pfad aus kleinen Kreisen, der in einem Aufruf mit weichem Leuchten gefüllt wird, über einem zarten Hilfsgitter alle zehn Zellen. Bis du Play drückst, bewegt sich nichts, die Seite bleibt also ruhig für alle, die reduzierte Bewegung bevorzugen.",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "Eine endliche Welt wiederholt sich immer",
        paragraphs: [
          "In einer unendlichen Ebene wächst die Gosper-Kanone ewig und schickt alle 30 Generationen einen neuen Gleiter los. Auf diesem Brett geht das nicht. Ein 120 × 70 Torus hat 2^8400 mögliche Konfigurationen, eine riesige, aber endliche Zahl, und jede hat genau einen Nachfolger. Früher oder später muss die Folge also eine schon gesehene Konfiguration wieder treffen, und ab dann läuft sie für immer im Kreis. Jeder Lauf hier endet daher in einem Stillleben, einer Oszillation oder einer sehr langen Schleife.",
          "Das Umwickeln verändert auch die berühmten Lebensdauern. Die 1103 Generationen des R-Pentominos und die 5206 der Eichel gelten für eine unbegrenzte Ebene. Hier kommen die Gleiter, die sie ausstoßen, rundherum zurück und krachen in die übrigen Trümmer, deshalb sieht der Verlauf anders aus als im Lehrbuch. Diehard ist klein genug, um davon unberührt zu bleiben: Es verschwindet so oder so nach 130 Generationen.",
        ],
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Bis 130 zählen",
        text: "Lade Diehard und drück ein paar Mal auf Schritt, um die Veränderung zu sehen, dann Play bei 12 Gen/s. Keine Form wiederholt sich, und bei Generation 130 fällt der Populationszähler auf genau 0.",
      },
      {
        title: "Ein Raumschiff vermessen",
        text: "Lade das leichte Raumschiff und stell die Geschwindigkeit auf 60. Es bewegt sich zwei Zellen pro vier Generationen, durchquert also alle 120 Spalten und steht nach 240 Generationen wieder am Start. Ein Gleiter braucht viel länger: Mit einer Zelle diagonal pro vier Generationen kehrt er erst nach 3360 Generationen genau auf seine Startzelle zurück, weil 840 die kleinste Zahl ist, die durch 120 und 70 teilbar ist.",
      },
      {
        title: "Die Kanone überrennt ihre eigene Welt",
        text: "Drück Play bei der Gleiterkanone vom Start. Zuerst verlässt sie alle 30 Generationen ein sauberer Strom von Gleitern. Beobachte weiter, wie der Strom um den Torus herumläuft: Früher oder später prallen zurückkehrende Gleiter auf die Kanone selbst, und die saubere Maschine zerfällt in Trümmer.",
      },
    ],
  },
};
