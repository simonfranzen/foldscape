import type { ExplorerGuide } from "./types";

// Numbers quoted here (speed 100 to 50,000 with default 1500, the 2,000,000
// point budget, 200,000 points for reduced motion, the fern probabilities)
// match app/chaosgame/explorer/page.tsx; update both together.
const LOOP_EXCERPT = `for (let i = 0; i < batch; i++) {
  let pick: number;
  let attempts = 0;
  do {
    pick = (Math.random() * n) | 0;
    attempts++;
    if (attempts > 64) break;
  } while (isForbidden(pick, hist, n, restriction));

  x = x + ratio * (vx[pick] - x);
  y = y + ratio * (vy[pick] - y);

  hist.unshift(pick);
  if (hist.length > 2) hist.pop();
  ctx.fillRect(x, y, 1, 1);
}`;

export const CHAOSGAME_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Play the chaos game live: set vertices, jump ratio and restriction rules and watch the Sierpinski triangle or Barnsley fern emerge from purely random jumps.",
    heading: "How this explorer works",
    intro:
      "Every dot on the canvas comes from one rule applied over and over: choose a corner of the polygon at random and jump part of the way towards it. Nothing in the rule mentions triangles inside triangles, yet after a few thousand jumps the Sierpinski triangle is unmistakable. The randomness only decides the order in which the picture fills in; the shape is fixed by the corners and the jump ratio. Michael Barnsley gave this game its name.",
    sections: [
      {
        heading: "The rule",
        paragraphs: [
          "Place n vertices v₁ to vₙ on a regular polygon and start anywhere. At each step pick a vertex vᵢ and move the current point p a fraction r of the way towards it. With r = 0.5 you land exactly halfway. Each move is a contraction that shrinks the plane by the factor 1 − r towards its vertex. The set made of shrunken copies of itself under these maps is the attractor of an iterated function system, and the random walk traces it out.",
          "The starting point does not matter. Every jump shrinks the distance to the attractor by the factor 1 − r, so with r = 0.5 an initial error of a whole canvas is below a pixel after about ten jumps.",
        ],
        formula: "p_{k+1} = p_k + r\\,(v_i - p_k), \\qquad i \\text{ chosen at random}",
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "Vertices n runs from 3 to 8, the jump ratio r from 0.1 to 0.9. With Auto magic ratio on, r is set to the value at which the n shrunken copies just touch without overlapping: 0.5 for the triangle and the square, about 0.618 (one over the golden ratio) for the pentagon, 2/3 for the hexagon and about 0.7071 (one over the square root of 2) for the octagon. Moving the slider by hand switches this off.",
          "Restriction changes which vertex may be chosen next, based on the previous choice. No repeat forbids picking the same vertex twice in a row. No neighbour forbids the two vertices next to the last one. No opposite forbids the vertex directly across, or, for odd n, the two vertices that are almost across. This one-step memory carves holes into shapes that would otherwise be solid.",
          "Speed sets how many points are added per frame, from 100 to 50,000, starting at 1500. The four presets load a triangle with r = 0.5, a square with r = 0.5 and no repeat, a pentagon with its magic ratio, and Barnsley's fern. Clear wipes the canvas, as does any change of rule, speed or colour.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "The vertices sit on a circle that fills the canvas minus a 24-pixel margin, first vertex at the top. Each frame runs a tight loop: draw a random vertex, reject it if the restriction forbids it (giving up after 64 attempts, so a rule that forbids everything cannot freeze the page), jump, remember the choice and plot a single pixel with a slightly transparent fill. Because the dots are translucent, often visited places grow brighter.",
          "The fern uses the same machinery with four affine maps instead of n vertex jumps. Each map is a matrix plus a shift, chosen with probabilities 1, 85, 7 and 7 percent: the rare one squashes everything onto the stem, the common one copies the whole fern slightly smaller and higher up, and the other two produce the lowest left and right fronds.",
          "After two million points the loop stops, since the picture cannot get any denser. The counter refreshes about ten times per second. If your system asks for reduced motion, there is no animation: 200,000 points are computed at once and the finished picture is drawn in a single frame.",
        ],
        code: LOOP_EXCERPT,
      },
      {
        heading: "Why the magic ratio is magic",
        paragraphs: [
          "Below the magic ratio the copies overlap and smear towards a filled region; above it they drift apart into dust. At exactly the magic value the copies kiss, edge to edge or corner to corner, and the result is a clean self-similar fractal. For the square something special happens: the magic ratio 0.5 makes the four copies tile the square perfectly, so the plain chaos game just fills it with uniform noise. That is why the square preset adds the no repeat rule.",
        ],
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "Break the triangle into dust",
        text: "Load the triangle preset and drag r from 0.5 up to 0.6. The three copies separate and the Sierpinski triangle falls apart into ever finer clusters. At 0.4 the gaps close and the triangle is nearly solid.",
      },
      {
        title: "A rule that leaves no choice",
        text: "Set n = 3 and choose No neighbour. In a triangle every other vertex is a neighbour, so the walk can only pick the same corner again. All the points pile up in one vertex and the canvas stays almost empty.",
      },
      {
        title: "Turn a square into a line",
        text: "Set n = 4 with r = 0.5 and choose No neighbour. Only the same vertex or the opposite one is allowed, so the walk is trapped on one diagonal. Then compare No opposite and No repeat.",
      },
      {
        title: "Watch the fern grow",
        text: "Choose the Barnsley fern preset and set Speed to 100. The upper fern sharpens fastest because 85 percent of all jumps land in it. The two lowest fronds each receive only 7 percent of the points, and the main stem just 1 percent, so it stays faint the longest.",
      },
    ],
  },
  de: {
    metaDescription:
      "Das Chaosspiel live: Ecken, Sprungverhältnis und Regeln wählen und zusehen, wie aus Zufallssprüngen das Sierpinski-Dreieck oder der Barnsley-Farn wächst.",
    heading: "So funktioniert dieser Explorer",
    intro:
      "Jeder Punkt auf der Zeichenfläche stammt aus einer einzigen Regel, die immer wieder angewendet wird: Wähle zufällig eine Ecke des Vielecks und spring ein Stück auf sie zu. Die Regel erwähnt keine Dreiecke in Dreiecken, und trotzdem ist nach ein paar tausend Sprüngen das Sierpinski-Dreieck unverkennbar. Der Zufall entscheidet nur, in welcher Reihenfolge sich das Bild füllt; die Form legen Ecken und Sprungverhältnis fest. Den Namen Chaosspiel hat Michael Barnsley geprägt.",
    sections: [
      {
        heading: "Die Regel",
        paragraphs: [
          "Setz n Ecken v₁ bis vₙ auf ein regelmäßiges Vieleck und starte irgendwo. In jedem Schritt wählst du eine Ecke vᵢ und bewegst den aktuellen Punkt p um den Anteil r auf sie zu. Bei r = 0,5 landest du genau in der Mitte. Jeder dieser n Züge ist eine Kontraktion: Er staucht die ganze Ebene um den Faktor 1 − r auf seine Ecke zusammen. Eine Menge, die aus verkleinerten Kopien ihrer selbst unter wenigen Kontraktionen besteht, heißt Attraktor eines iterierten Funktionensystems, und die Zufallswanderung besucht ihn mit Wahrscheinlichkeit eins.",
          "Der Startpunkt spielt keine Rolle. Jeder Sprung verkleinert den Abstand zum Attraktor um den Faktor 1 − r. Bei r = 0,5 ist ein Anfangsfehler von einer ganzen Bildbreite nach etwa zehn Sprüngen kleiner als ein Pixel.",
        ],
        formula: "p_{k+1} = p_k + r\\,(v_i - p_k), \\qquad i \\text{ zufällig gewählt}",
      },
      {
        heading: "Was die Regler bewirken",
        paragraphs: [
          "«Ecken n» reicht von 3 bis 8, das Sprungverhältnis r von 0,1 bis 0,9. Ist «Magisches Verhältnis automatisch» aktiv, wird r auf den Wert gesetzt, bei dem sich die n verkleinerten Kopien des Vielecks gerade berühren, ohne sich zu überlappen: 0,5 für Dreieck und Quadrat, etwa 0,618 (eins durch den Goldenen Schnitt) für das Fünfeck, 2/3 für das Sechseck und etwa 0,7071 (eins durch Wurzel 2) für das Achteck. Bewegst du den Regler von Hand, schaltet sich das ab.",
          "«Einschränkung» legt fest, welche Ecke als Nächstes erlaubt ist, abhängig von der vorigen Wahl. «Keine Wiederholung» verbietet, dieselbe Ecke zweimal hintereinander zu wählen. «Kein Nachbar» verbietet die beiden Ecken neben der letzten. «Kein Gegenüber» verbietet die direkt gegenüberliegende Ecke, bei ungeradem n die beiden, die fast gegenüber liegen. Dieses Gedächtnis von einem Schritt schneidet Löcher in Formen, die sonst gefüllt wären.",
          "«Geschwindigkeit» bestimmt, wie viele Punkte pro Animationsbild dazukommen, von 100 bis 50.000, Startwert 1500. Die vier Voreinstellungen laden ein Dreieck mit r = 0,5, ein Quadrat mit r = 0,5 und «Keine Wiederholung», ein Fünfeck mit seinem magischen Verhältnis und Barnsleys Farn. «Leeren» löscht die Fläche, ebenso jede Änderung an Regel, Geschwindigkeit oder Farbe, damit der Zähler immer zum Bild passt.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Die Ecken liegen auf einem Kreis, der die Zeichenfläche bis auf einen Rand von 24 Pixeln ausfüllt, die erste Ecke oben. Jedes Bild durchläuft eine enge Schleife: zufällige Ecke ziehen, verwerfen, falls die Einschränkung sie verbietet (nach 64 Versuchen wird aufgegeben, damit eine Regel, die alles verbietet, die Seite nicht einfriert), springen, die Wahl merken und ein einzelnes Pixel mit leicht transparenter Farbe setzen. Weil die Punkte durchscheinend sind, werden oft besuchte Stellen heller.",
          "Der Farn nutzt dieselbe Mechanik mit vier affinen Abbildungen statt n Eckensprüngen. Jede Abbildung ist eine Matrix plus Verschiebung und wird mit den Wahrscheinlichkeiten 1, 85, 7 und 7 Prozent gewählt: Die seltene staucht alles auf den Stiel, die häufige kopiert den ganzen Farn etwas kleiner und weiter oben, die beiden anderen erzeugen die untersten Wedel links und rechts.",
          "Nach zwei Millionen Punkten ist der Attraktor so dicht, wie er werden kann, und die Schleife hört auf, statt endlos weiterzurechnen. Der Punktzähler wird etwa zehnmal pro Sekunde aktualisiert, nicht in jedem Bild. Wünscht dein System reduzierte Bewegung, gibt es keine Animation: 200.000 Punkte werden auf einmal berechnet und das fertige Bild in einem einzigen Frame gezeichnet.",
        ],
        code: LOOP_EXCERPT,
      },
      {
        heading: "Warum das magische Verhältnis magisch ist",
        paragraphs: [
          "Unterhalb des magischen Verhältnisses überlappen sich die n Kopien und verschmieren zu einer fast gefüllten Fläche. Oberhalb driften sie auseinander, und der Attraktor zerfällt in einzelne Staubwolken. Genau beim magischen Wert berühren sich die Kopien, Kante an Kante oder Ecke an Ecke, und es entsteht ein sauberes selbstähnliches Fraktal. Beim Quadrat passiert etwas Besonderes: Mit dem magischen Wert 0,5 kacheln die vier Kopien das Quadrat lückenlos, das einfache Chaosspiel füllt es also nur mit gleichmäßigem Rauschen. Deshalb nutzt die Quadrat-Voreinstellung zusätzlich «Keine Wiederholung».",
        ],
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Das Dreieck in Staub zerlegen",
        text: "Lade die Dreieck-Voreinstellung und zieh r von 0,5 auf 0,6. Die drei Kopien trennen sich, und das Sierpinski-Dreieck zerfällt in immer feinere Grüppchen. Zieh r auf 0,4, und die Lücken schließen sich, bis das Dreieck fast voll ist.",
      },
      {
        title: "Eine Regel ohne Wahl",
        text: "Stell n = 3 ein und wähle «Kein Nachbar». Im Dreieck ist jede andere Ecke ein Nachbar, die Wanderung kann also nur dieselbe Ecke erneut wählen. Alle Punkte landen in einer einzigen Ecke, und die Fläche bleibt fast leer.",
      },
      {
        title: "Aus dem Quadrat wird eine Linie",
        text: "Stell n = 4 mit r = 0,5 ein und wähle «Kein Nachbar». Erlaubt sind nur dieselbe oder die gegenüberliegende Ecke, die Wanderung ist also auf einer Diagonale gefangen. Vergleich danach «Kein Gegenüber» und «Keine Wiederholung».",
      },
      {
        title: "Dem Farn beim Wachsen zusehen",
        text: "Wähle die Voreinstellung Barnsley-Farn und stell die Geschwindigkeit auf 100. Der obere Farn wird am schnellsten scharf, weil 85 Prozent aller Sprünge in ihm landen. Die beiden untersten Wedel bekommen jeweils nur 7 Prozent der Punkte, der Hauptstiel gerade 1 Prozent, deshalb bleibt er am längsten blass.",
      },
    ],
  },
};
