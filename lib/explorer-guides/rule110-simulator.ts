import type { ExplorerGuide } from "./types";

// Numbers quoted here (240 cells, 360 rows, seed density 0.45, edge seed at
// cell 238, speed 1 to 120 gen/s with default 20) match
// app/rule110/simulator/page.tsx; update both together.
const STEP_EXCERPT = `function step(row: Uint8Array, rule: number): Uint8Array {
  const n = row.length;
  const next = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    const l = row[(i - 1 + n) % n];   // wraps around: the row is a ring
    const c = row[i];
    const r = row[(i + 1) % n];
    const key = (l << 2) | (c << 1) | r;  // neighbourhood as 0..7
    next[i] = (rule >> key) & 1;          // bit "key" of the rule number
  }
  return next;
}`;

export const RULE110_SIMULATOR_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Run Rule 110 and all 256 elementary cellular automata live: pick a rule, seed and speed, and see how one byte of rules can produce Turing-complete behaviour.",
    heading: "How this simulator works",
    intro:
      "Each horizontal line of pixels is a row of 240 cells, each one either on or off. Every new generation is computed from the row before it and appended at the bottom, so the picture reads from top to bottom like a timeline: the oldest generation at the top, the present at the bottom. Once 360 generations are on screen, the oldest one scrolls away. A single fixed rule decides each cell by looking at only three cells: the cell itself and its two neighbours. Rule 110 is the most famous of these rules, because this purely local scribbling can, in principle, carry out any computation.",
    sections: [
      {
        heading: "Eight neighbourhoods, one byte",
        paragraphs: [
          "Three cells that are each on or off can form 2³ = 8 patterns. A rule simply says, for each of those eight patterns, whether the middle cell is on in the next generation. Eight yes or no answers make one byte, so there are exactly 2⁸ = 256 such rules, and Stephen Wolfram's numbering reads the byte as a binary number. Write the patterns from 111 down to 000 and note the answers: for Rule 110 they are 0, 1, 1, 0, 1, 1, 1, 0, which is 01101110 in binary, or 110. In words, a cell is off in the next step only if its neighbourhood was 111, 100 or 000.",
          "The HUD over the canvas shows the current rule in this binary form, and the formula below expresses the same lookup: the neighbourhood is read as a number k from 0 to 7, and the new state is bit k of the rule number.",
        ],
        formula:
          "s_i^{t+1} = \\left\\lfloor \\frac{N}{2^{\\,4 s_{i-1}^{t} + 2 s_i^{t} + s_{i+1}^{t}}} \\right\\rfloor \\bmod 2",
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "The eight buttons under «Famous rules» load rules with distinctive behaviour: 110, the chaotic Rule 30, Rule 90 (the Sierpiński triangle), the traffic model Rule 184, plus 54, 73, 150 and 22. The slider below reaches every rule from 0 to 255. Choosing a rule always restarts from the current seed, so you compare rules on the same starting row.",
          "The seed sets that starting row. «Single» switches on the one cell in the middle. «Edge» switches on the cell second from the right, which gives patterns that grow leftward, like Rule 110, almost the full width to develop. «Random» switches on each cell independently with probability 0.45.",
          "Play and pause do what they say; Step adds exactly one generation and only works while paused. «Clear» re-seeds the row and resets the generation counter. The speed slider runs from 1 to 120 generations per second, starting at 20, and the colour buttons only change how live cells are painted.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "Each generation is a Uint8Array of 240 cells, and the history is an array of those rows. Computing the next row takes one pass: for every cell the three neighbours are packed into a number from 0 to 7, and the new state is that bit of the rule number. The left and right ends are joined, so the row is really a ring and patterns that leave one side come back on the other.",
          "Timing is decoupled from the display. Every animation frame adds the elapsed time to an accumulator and appends as many generations as fit at the chosen speed, so 120 generations per second really are 120 even on a 60 Hz screen. After each frame the whole buffer is repainted on a 2D canvas, one filled rectangle per live cell, with the backing store sized to the device pixel ratio.",
          "If your system asks for reduced motion, the simulator does not start on its own: you see the seed as a still frame and can advance it with Step or press Play yourself. While paused, the animation loop is not running at all.",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "Why Rule 110 is special",
        paragraphs: [
          "Most rules die out, freeze or repeat. A few, like Rule 30, look like noise forever. Rule 110 sits in between: a regular, repeating background through which localised structures travel at different speeds and collide. Matthew Cook showed, in work published in 2004, that collisions of these gliders can emulate a cyclic tag system, and since such systems can simulate any Turing machine, Rule 110 is Turing-complete. Its mirror image, Rule 124, behaves the same with left and right swapped.",
        ],
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "Give Rule 110 room to grow",
        text: "Select Rule 110, choose the «edge» seed and set the speed to 60. The pattern spreads leftward one cell per generation. Look for the repeating background texture and the slanted structures that move through it and collide: those are the gliders Cook's proof uses as signals.",
      },
      {
        title: "A fractal from one cell",
        text: "Select Rule 90 with the «single» seed. Each cell becomes the XOR of its two neighbours, and a Sierpiński triangle appears. Around generation 120 its two edges meet on the far side of the 240-cell ring and the pattern begins to interfere with itself.",
      },
      {
        title: "Order and chaos side by side",
        text: "Select Rule 30 with the «single» seed. One side of the triangle settles into regular diagonal stripes while the other looks random, even though the rule is a single byte and nothing random is involved.",
      },
      {
        title: "Traffic jams that dissolve",
        text: "Select Rule 184 with the «random» seed. Read live cells as cars moving one cell to the right whenever the cell ahead is free. Jams drift backwards, to the left. Because the seed fills only about 45 percent of the road, fewer than half the cells, the jams usually dissolve until every car moves freely.",
      },
    ],
  },
  de: {
    metaDescription:
      "Regel 110 und alle 256 elementaren Zellularautomaten live: Regel, Startzeile und Tempo wählen und sehen, wie ein einziges Byte Turing-Vollständigkeit erzeugt.",
    heading: "So funktioniert dieser Simulator",
    intro:
      "Jede waagrechte Pixelzeile ist eine Reihe aus 240 Zellen, jede an oder aus. Jede neue Generation wird aus der vorherigen Zeile berechnet und unten angehängt, das Bild liest sich also von oben nach unten wie eine Zeitleiste: oben die älteste Generation, unten die Gegenwart. Sind 360 Generationen zu sehen, rollt die älteste aus dem Bild. Eine einzige feste Regel entscheidet über jede Zelle und schaut dabei nur auf drei Zellen: die Zelle selbst und ihre beiden Nachbarinnen. Regel 110 ist die berühmteste dieser Regeln, weil dieses rein lokale Gekritzel im Prinzip jede Berechnung ausführen kann.",
    sections: [
      {
        heading: "Acht Nachbarschaften, ein Byte",
        paragraphs: [
          "Drei Zellen, die jeweils an oder aus sind, bilden 2³ = 8 Muster. Eine Regel legt für jedes dieser acht Muster fest, ob die mittlere Zelle in der nächsten Generation an ist. Acht Ja-oder-Nein-Antworten ergeben ein Byte, es gibt also genau 2⁸ = 256 solcher Regeln, und die Nummerierung von Stephen Wolfram liest das Byte als Binärzahl. Schreib die Muster von 111 bis 000 auf und notiere die Antworten: Bei Regel 110 lauten sie 0, 1, 1, 0, 1, 1, 1, 0, binär 01101110, also 110. In Worten: Eine Zelle ist im nächsten Schritt nur dann aus, wenn ihre Nachbarschaft 111, 100 oder 000 war.",
          "Die Anzeige über dem Canvas zeigt die aktuelle Regel in dieser Binärform, und die Formel unten drückt dasselbe Nachschlagen aus: Die Nachbarschaft wird als Zahl k von 0 bis 7 gelesen, und der neue Zustand ist Bit k der Regelnummer.",
        ],
        formula:
          "s_i^{t+1} = \\left\\lfloor \\frac{N}{2^{\\,4 s_{i-1}^{t} + 2 s_i^{t} + s_{i+1}^{t}}} \\right\\rfloor \\bmod 2",
      },
      {
        heading: "Was die Regler bewirken",
        paragraphs: [
          "Die acht Knöpfe unter «Berühmte Regeln» laden Regeln mit markantem Verhalten: 110, die chaotische Regel 30, Regel 90 (das Sierpiński-Dreieck), das Verkehrsmodell Regel 184 sowie 54, 73, 150 und 22. Der Regler darunter erreicht jede Regel von 0 bis 255. Ein Regelwechsel startet immer neu mit der aktuellen Startzeile, so vergleichst du Regeln auf derselben Ausgangslage.",
          "Die Saat bestimmt diese Startzeile. «Einzeln» schaltet die eine Zelle in der Mitte an. «Rand» schaltet die zweite Zelle von rechts an; Muster, die nach links wachsen, wie Regel 110, haben so fast die ganze Breite Platz. «Zufällig» schaltet jede Zelle unabhängig mit Wahrscheinlichkeit 0,45 an.",
          "Start und Pause tun, was sie sagen; Schritt fügt genau eine Generation hinzu und funktioniert nur im Pausenmodus. «Leeren» setzt die Startzeile neu und den Generationszähler auf null. Der Regler für die Geschwindigkeit reicht von 1 bis 120 Generationen pro Sekunde, voreingestellt sind 20, und die Farbknöpfe ändern nur, wie lebende Zellen gemalt werden.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Jede Generation ist ein Uint8Array mit 240 Zellen, die Geschichte ein Array solcher Zeilen. Die nächste Zeile entsteht in einem Durchlauf: Für jede Zelle werden die drei Nachbarn zu einer Zahl von 0 bis 7 gepackt, und der neue Zustand ist dieses Bit der Regelnummer. Linkes und rechtes Ende sind verbunden, die Zeile ist also eigentlich ein Ring, und Muster, die auf einer Seite hinauslaufen, kommen auf der anderen zurück.",
          "Das Timing ist von der Anzeige entkoppelt. Jeder Animationsframe addiert die vergangene Zeit zu einem Akkumulator und hängt so viele Generationen an, wie beim gewählten Tempo hineinpassen. 120 Generationen pro Sekunde sind deshalb auch auf einem 60-Hz-Bildschirm wirklich 120. Nach jedem Frame wird der ganze Puffer auf ein 2D-Canvas gemalt, ein gefülltes Rechteck pro lebender Zelle, mit einer an die Pixeldichte des Geräts angepassten Auflösung.",
          "Wünscht dein System reduzierte Bewegung, startet der Simulator nicht von selbst: Du siehst die Startzeile als Standbild und kannst sie mit Schritt weiterschalten oder selbst auf Start drücken. Im Pausenmodus läuft die Animationsschleife überhaupt nicht.",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "Warum Regel 110 besonders ist",
        paragraphs: [
          "Die meisten Regeln sterben aus, erstarren oder wiederholen sich. Einige, wie Regel 30, sehen für immer nach Rauschen aus. Regel 110 liegt dazwischen: ein regelmäßiger, sich wiederholender Hintergrund, durch den lokale Strukturen mit verschiedenen Geschwindigkeiten wandern und zusammenstoßen. Matthew Cook zeigte in einer 2004 veröffentlichten Arbeit, dass Zusammenstöße dieser Gleiter ein zyklisches Tag-System nachbilden können. Weil solche Systeme jede Turingmaschine simulieren können, ist Regel 110 Turing-vollständig. Ihr Spiegelbild, Regel 124, verhält sich genauso, nur mit vertauschtem Links und Rechts.",
        ],
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Regel 110 Platz geben",
        text: "Wähle Regel 110, die Saat «Rand» und Geschwindigkeit 60. Das Muster breitet sich pro Generation eine Zelle nach links aus. Achte auf die sich wiederholende Hintergrundtextur und auf die schrägen Strukturen, die hindurchwandern und zusammenstoßen: Das sind die Gleiter, die Cooks Beweis als Signale nutzt.",
      },
      {
        title: "Ein Fraktal aus einer Zelle",
        text: "Wähle Regel 90 mit der Saat «einzeln». Jede Zelle wird zum XOR ihrer beiden Nachbarinnen, und ein Sierpiński-Dreieck erscheint. Um Generation 120 treffen sich seine beiden Ränder auf der anderen Seite des 240-Zellen-Rings, und das Muster beginnt, sich selbst zu stören.",
      },
      {
        title: "Ordnung und Chaos nebeneinander",
        text: "Wähle Regel 30 mit der Saat «einzeln». Eine Seite des Dreiecks ordnet sich zu regelmäßigen Diagonalstreifen, die andere sieht zufällig aus, obwohl die Regel nur ein Byte ist und nirgends Zufall im Spiel ist.",
      },
      {
        title: "Staus, die sich auflösen",
        text: "Wähle Regel 184 mit der Saat «zufällig». Lies lebende Zellen als Autos, die eine Zelle nach rechts fahren, sobald die Zelle vor ihnen frei ist. Staus wandern rückwärts, nach links. Weil die Saat nur etwa 45 Prozent der Straße füllt, also weniger als die Hälfte, lösen sich die Staus meist auf, bis jedes Auto frei fährt.",
      },
    ],
  },
};
