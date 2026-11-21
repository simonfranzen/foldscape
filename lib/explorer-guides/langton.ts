import type { ExplorerGuide } from "./types";

// Numbers quoted here (800 steps per frame by default, 1 to 5000, cell size 2
// to 10 px, the 40 x 40 minimum grid, the 30-step counter throttle) match
// app/langton/explorer/page.tsx; update both together.
const STEP_EXCERPT = `const stepOnce = () => {
  const idx = ay * gridW + ax;
  const c = grid[idx];
  const turn = rule[c]; // 'R' or 'L'
  if (turn === "R") dir = (dir + 1) & 3;
  else dir = (dir + 3) & 3;
  const next = (c + 1) % nColors;
  grid[idx] = next;
  drawCell(ax, ay, COLOR_PALETTE[next % COLOR_PALETTE.length]);
  // move, wrapping around the edges (torus)
  if (dir === 0) ay = (ay - 1 + gridH) % gridH;
  else if (dir === 1) ax = (ax + 1) % gridW;
  else if (dir === 2) ay = (ay + 1) % gridH;
  else ax = (ax - 1 + gridW) % gridW;
};`;

export const LANGTON_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Run Langton's ant live: watch the chaos turn into a 104-step highway near step 10 000, try multi-colour turmite rules like RLR and LLRR and see how it is coded.",
    heading: "How this explorer works",
    intro:
      "The white square is the ant. It sits on a grid of cells that all start empty, and it follows one rule: look at the colour under you, turn left or right depending on that colour, change the colour, step forward. Nothing else happens. Yet the picture goes through three very different phases: a small symmetric start, a long stretch of apparent chaos, and then, suddenly, perfect order.",
    sections: [
      {
        heading: "The rule, written as a string",
        paragraphs: [
          "Christopher Langton described the ant in 1986. In its classic form there are two colours. On an empty cell the ant turns right, on a coloured cell it turns left, and in both cases it flips the colour of the cell before moving on. The explorer writes this as the rule string RL: the first letter is the turn on colour 0, the second the turn on colour 1.",
          "That notation generalises at once. A rule with n letters uses n colours, and every visit advances a cell to the next colour in the cycle. RLR has three colours, LLRR four, and so on. These generalised ants are often called turmites.",
        ],
        formula:
          "\\text{state}(c) \\mapsto c + 1 \\bmod n, \\qquad \\text{heading} \\mapsto \\text{heading} \\pm 90^\\circ \\text{ according to letter } c",
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "The rule buttons switch the preset and restart from an empty grid. The label above the canvas shows the active rule and its number of colours, the counter on the right shows how many steps the ant has taken.",
          "Steps per frame runs from 1 to 5000 and starts at 800. At around 60 frames per second the default already means tens of thousands of steps per second, so the classic ant reaches its highway within a fraction of a second. To actually watch the chaotic phase, drop the slider to 10 or 20. At 10 steps per frame the ant needs roughly a quarter of a minute to reach step 10 000.",
          "Cell size sets how many CSS pixels one grid cell covers, from 2 to 10, starting at 4. Changing it restarts the run, because the grid has to be rebuilt. Play and Pause freeze the ant without losing anything, Reset clears the grid and puts the ant back in the centre, facing north.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "The grid is a single Uint8Array with one byte per cell, holding the colour index. Its size is the canvas size divided by the cell size, but never smaller than 40 by 40 cells. The ant itself is just three numbers: its column, its row and a direction from 0 to 3 for north, east, south and west. Turning right adds one to the direction, turning left adds three, and a bitwise AND with 3 keeps the result in range without a modulo.",
          "Drawing is incremental. A step changes exactly one cell, so the step function paints exactly that one cell and nothing else; the canvas is never cleared between frames. That is why thousands of steps per frame stay cheap. The white head is drawn on top after the batch and repainted with the real cell colour at the start of the next frame.",
          "The step counter in the overlay is React state, but it is only updated when at least 30 new steps have happened. If your system asks for reduced motion, the explorer starts paused and waits for you to press Play.",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "Why the edges matter",
        paragraphs: [
          "The grid wraps around: an ant leaving on the right comes back on the left, and the same for top and bottom. Mathematically the board is a torus. On an infinite plane the classic ant's highway would run forever, and it is known that its path is always unbounded. On a torus the highway eventually wraps around and runs into the debris the ant left earlier, and the motion turns irregular again, sometimes until a new highway forms.",
          "There is a deeper consequence. The torus has finitely many cells, each with finitely many colours, and the ant has finitely many positions and headings. A deterministic system with finitely many states must eventually repeat itself exactly. So every run in this explorer is, strictly speaking, periodic. The period is just astronomically long for any grid you can see.",
        ],
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "Catch the highway forming",
        text: "Choose the classic RL rule, set steps per frame to 10 and press Reset. Watch the counter: for a long time the blob grows without any visible plan, and shortly after step 10 000 a narrow diagonal stripe starts to leave it. That stripe repeats the same 104 steps over and over and moves two cells per cycle.",
      },
      {
        title: "Let the highway crash",
        text: "Keep RL, set the cell size to 10 and steps per frame to 5000. The grid is now small, so the highway wraps around the edge quickly and hits the old pattern. Watch the order break down into chaos again.",
      },
      {
        title: "Compare symmetric and chaotic growth",
        text: "Run LLRR for a while, then RLR. LLRR keeps a mirror symmetry as it grows, a property shared by rules built from pairs of equal letters. RLR grows into an irregular blob with no highway in sight.",
      },
      {
        title: "Twelve colours, one triangle",
        text: "Pick RRLLLRLLLRRR with a cell size of 2. The ant builds a filled triangle that keeps growing and slowly drifts across the grid, an orderly shape that comes from a rule string that looks completely arbitrary.",
      },
    ],
  },
  de: {
    metaDescription:
      "Langtons Ameise live: sieh zu, wie das Chaos nahe Schritt 10 000 in eine Autobahn mit 104er-Zyklus kippt, teste Turmiten wie RLR und LLRR, lies den Code dazu.",
    heading: "So funktioniert dieser Explorer",
    intro:
      "Das weiße Quadrat ist die Ameise. Sie sitzt auf einem Gitter aus Zellen, die anfangs alle leer sind, und folgt genau einer Regel: Schau auf die Farbe unter dir, dreh dich je nach Farbe nach links oder rechts, ändere die Farbe, geh einen Schritt vor. Mehr passiert nicht. Trotzdem durchläuft das Bild drei völlig verschiedene Phasen: einen kleinen symmetrischen Anfang, eine lange Strecke scheinbaren Chaos und dann, ganz plötzlich, perfekte Ordnung.",
    sections: [
      {
        heading: "Die Regel als Zeichenkette",
        paragraphs: [
          "Christopher Langton beschrieb die Ameise 1986. In der klassischen Form gibt es zwei Farben. Auf einer leeren Zelle dreht sich die Ameise nach rechts, auf einer gefärbten nach links, und in beiden Fällen kippt sie die Farbe der Zelle, bevor sie weiterläuft. Der Explorer schreibt das als Regel RL: Der erste Buchstabe ist die Drehung auf Farbe 0, der zweite die auf Farbe 1.",
          "Diese Schreibweise lässt sich sofort verallgemeinern. Eine Regel mit n Buchstaben verwendet n Farben, und jeder Besuch schaltet eine Zelle zur nächsten Farbe im Zyklus weiter. RLR hat drei Farben, LLRR vier und so weiter. Solche verallgemeinerten Ameisen heißen oft Turmiten.",
        ],
        formula:
          "\\text{Zustand}(c) \\mapsto c + 1 \\bmod n, \\qquad \\text{Richtung} \\mapsto \\text{Richtung} \\pm 90^\\circ \\text{ je nach Buchstabe } c",
      },
      {
        heading: "Was die Regler bewirken",
        paragraphs: [
          "Die Regel-Knöpfe wechseln die Voreinstellung und starten auf einem leeren Gitter neu. Das Etikett über dem Canvas zeigt die aktive Regel und ihre Farbanzahl, der Zähler rechts die Zahl der bisherigen Schritte.",
          "«Schritte / Frame» reicht von 1 bis 5000 und startet bei 800. Bei rund 60 Frames pro Sekunde bedeutet schon der Standardwert Zehntausende Schritte pro Sekunde, die klassische Ameise erreicht ihre Autobahn also in Sekundenbruchteilen. Willst du die chaotische Phase wirklich sehen, stell den Regler auf 10 oder 20. Bei 10 Schritten pro Frame braucht die Ameise etwa eine Viertelminute bis Schritt 10 000.",
          "«Zellgröße» legt fest, wie viele CSS-Pixel eine Zelle einnimmt, von 2 bis 10, voreingestellt sind 4. Eine Änderung startet den Lauf neu, weil das Gitter neu aufgebaut werden muss. Play und Pause frieren die Ameise ein, ohne etwas zu verlieren. Reset leert das Gitter und setzt die Ameise mit Blick nach Norden zurück in die Mitte.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Das Gitter ist ein einziges Uint8Array mit einem Byte pro Zelle, das den Farbindex speichert. Seine Größe ergibt sich aus Canvasgröße geteilt durch Zellgröße, aber nie weniger als 40 mal 40 Zellen. Die Ameise selbst besteht nur aus drei Zahlen: Spalte, Zeile und eine Richtung von 0 bis 3 für Norden, Osten, Süden und Westen. Rechts drehen addiert eins, links drehen addiert drei, und ein bitweises AND mit 3 hält das Ergebnis im Bereich, ganz ohne Modulo.",
          "Gezeichnet wird inkrementell. Ein Schritt ändert genau eine Zelle, also malt die Schrittfunktion genau diese eine Zelle und sonst nichts; das Canvas wird zwischen den Frames nie gelöscht. Deshalb bleiben Tausende Schritte pro Frame billig. Der weiße Kopf wird nach jedem Schub obendrauf gezeichnet und zu Beginn des nächsten Frames mit der echten Zellfarbe übermalt.",
          "Der Schrittzähler im Overlay ist React-State, wird aber nur aktualisiert, wenn mindestens 30 neue Schritte passiert sind. Wünscht dein System reduzierte Bewegung, startet der Explorer pausiert und wartet, bis du Play drückst.",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "Warum die Ränder zählen",
        paragraphs: [
          "Das Gitter ist an den Rändern verklebt: Wer rechts hinausläuft, kommt links wieder herein, ebenso oben und unten. Mathematisch ist das Spielfeld ein Torus. Auf einer unendlichen Ebene liefe die Autobahn der klassischen Ameise ewig weiter, und es ist bewiesen, dass ihr Weg immer unbeschränkt ist. Auf dem Torus wickelt sich die Autobahn irgendwann herum und stößt auf die Trümmer, die die Ameise früher hinterlassen hat. Dann wird die Bewegung wieder unregelmäßig, manchmal so lange, bis sich eine neue Autobahn bildet.",
          "Daraus folgt noch etwas Tieferes. Der Torus hat endlich viele Zellen mit endlich vielen Farben, und die Ameise hat endlich viele Positionen und Richtungen. Ein deterministisches System mit endlich vielen Zuständen muss sich irgendwann exakt wiederholen. Jeder Lauf in diesem Explorer ist also streng genommen periodisch. Die Periode ist nur für jedes sichtbare Gitter astronomisch lang.",
        ],
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Die Autobahn entstehen sehen",
        text: "Wähl die klassische Regel RL, stell «Schritte / Frame» auf 10 und drück Reset. Behalte den Zähler im Blick: Lange wächst der Fleck ohne erkennbaren Plan, und kurz nach Schritt 10 000 löst sich ein schmaler diagonaler Streifen. Er wiederholt immer dieselben 104 Schritte und rückt pro Zyklus zwei Zellen weiter.",
      },
      {
        title: "Die Autobahn crashen lassen",
        text: "Bleib bei RL, stell die Zellgröße auf 10 und die Schritte pro Frame auf 5000. Das Gitter ist jetzt klein, die Autobahn wickelt sich schnell über den Rand und trifft auf das alte Muster. Beobachte, wie die Ordnung wieder in Chaos zerfällt.",
      },
      {
        title: "Symmetrisch gegen chaotisch",
        text: "Lass erst LLRR eine Weile laufen, dann RLR. LLRR behält beim Wachsen eine Spiegelsymmetrie, eine Eigenschaft von Regeln, die aus Paaren gleicher Buchstaben bestehen. RLR wächst zu einem unregelmäßigen Fleck, ohne dass eine Autobahn in Sicht wäre.",
      },
      {
        title: "Zwölf Farben, ein Dreieck",
        text: "Nimm RRLLLRLLLRRR mit Zellgröße 2. Die Ameise baut ein gefülltes Dreieck, das immer weiter wächst und langsam über das Gitter wandert. Eine geordnete Form aus einer Regel, die völlig willkürlich aussieht.",
      },
    ],
  },
};
