import type { ExplorerGuide } from "./types";

// Numbers quoted here (depth 0 to 10, default 6; 100 to 20000 points per frame,
// default 4000; 20 warm-up jumps; 60000-point reduced-motion batch; rows and
// generations 10 to 256 with defaults 64 and 96; 280 ms per subdivision level)
// match app/sierpinski/explorer/page.tsx; update both together.
const SUBDIVISION_EXCERPT = `function recurseSub(ctx, a, b, c, depth) {
  if (depth <= 0) {
    ctx.beginPath();
    ctx.moveTo(a[0], a[1]);
    ctx.lineTo(b[0], b[1]);
    ctx.lineTo(c[0], c[1]);
    ctx.closePath();
    ctx.fill();
    return;
  }
  const ab = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const bc = [(b[0] + c[0]) / 2, (b[1] + c[1]) / 2];
  const ca = [(c[0] + a[0]) / 2, (c[1] + a[1]) / 2];
  recurseSub(ctx, a, ab, ca, depth - 1);  // the middle triangle
  recurseSub(ctx, ab, b, bc, depth - 1);  // (ab, bc, ca) is never drawn
  recurseSub(ctx, ca, bc, c, depth - 1);
}`;

export const SIERPINSKI_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Draw the Sierpiński triangle four ways: recursive subdivision, the chaos game, Pascal's triangle mod 2 and Rule 90, and see why all four give the same fractal.",
    heading: "How this explorer works",
    intro:
      "The same shape is drawn here in four completely different ways: by cutting triangles out of a triangle, by a random walk, by the parity of binomial coefficients and by a one-dimensional cellular automaton. Switching modes changes the recipe, not the result. That four unrelated procedures land on the same fractal is the real point of this room.",
    sections: [
      {
        heading: "A triangle with holes at every scale",
        paragraphs: [
          "Start with a filled triangle and join the midpoints of its sides. That splits it into four smaller triangles; remove the middle one. Three half-size copies remain, and you repeat the step on each of them, forever. After n steps there are 3ⁿ triangles, each with sides 2ⁿ times shorter, so the remaining area is (3/4)ⁿ of the original and tends to zero. Wacław Sierpiński described the set in 1915.",
          "What survives is self-similar: it consists of exactly three copies of itself, each scaled by one half. For an ordinary filled triangle, halving the size gives four copies; for a line segment, two. Solving 2^d = 3 gives the fractal dimension d = log 3 / log 2, so the gasket is more than a curve and less than a surface.",
        ],
        formula:
          "A_n = \\left(\\tfrac{3}{4}\\right)^{n} A_0, \\qquad \\dim = \\frac{\\log 3}{\\log 2} \\approx 1.585",
      },
      {
        heading: "The four constructions and their controls",
        paragraphs: [
          "Subdivision draws the triangle at a chosen depth from 0 to 10, starting at 6. When you change the depth, the picture is rebuilt level by level, one level every 280 milliseconds. The counter shows 3^depth triangles, which is 59,049 at depth 10.",
          "The chaos game starts at the centre of the canvas, picks one of the three corners at random, jumps halfway towards it, plots a dot and repeats. The slider sets how many dots are plotted per animation frame, from 100 to 20,000 (default 4,000), and the counter shows the running total.",
          "Pascal mod 2 builds Pascal's triangle and fills a cell only where the binomial coefficient C(n, k) is odd. The slider sets the number of rows, from 10 to 256 (default 64). Rule 90 starts from a single live cell and makes each cell the XOR of its two neighbours in the row above; the slider sets the number of generations, again from 10 to 256 (default 96). The colour swatches recolour the drawing, and Restart runs the current construction again from scratch.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "Everything is drawn on a 2D canvas sized to the device pixel ratio and redrawn when it is resized. Subdivision is the recursive function below: it halves the three edges, recurses into the three corner triangles and fills a triangle only when the depth reaches zero, so the middle triangle at each level is simply never painted.",
          "The chaos game runs in an animation loop. Before anything is plotted it makes 20 warm-up jumps, then plots every point as a one-pixel rectangle in a semi-transparent colour, so regions that are visited more often grow brighter. Pascal mod 2 never computes a binomial coefficient: each row is built from the previous one with XOR, which is addition modulo 2. That is why 256 rows are instant, although C(255, 127) has 76 digits. Rule 90 uses a Uint8Array per generation that is 2 · generations − 1 cells wide, wide enough that the pattern never reaches the edge.",
          "With reduced motion enabled, subdivision jumps straight to the final depth, and the chaos game plots a single batch of 60,000 points at once and then stops. Pascal and Rule 90 are static drawings in any case.",
        ],
        code: SUBDIVISION_EXCERPT,
      },
      {
        heading: "Why the four pictures agree",
        paragraphs: [
          "The chaos game works because the gasket is the one set that is exactly covered by its three halved copies. Each jump applies one of the three maps «halve the distance to corner i». A point on the gasket stays on it, and a point off it gets twice as close with every jump. After the 20 warm-up jumps any starting error has shrunk by a factor of about a million, far below a pixel, so not a single dot lands in a hole.",
          "Pascal and Rule 90 agree because they are the same rule. Pascal's rule C(n, k) = C(n − 1, k − 1) + C(n − 1, k), read modulo 2, says that each entry is the XOR of the two entries above it, and that is Rule 90 with the cells spread out. Lucas's theorem then tells you exactly which cells are filled: C(n, k) is odd precisely when every binary digit of k is at most the matching digit of n. So row n has 2^s odd entries, where s is the number of ones in the binary expansion of n.",
        ],
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "Count the triangles",
        text: "In subdivision mode set the depth to 1, 2 and 3. You get 3, 9 and 27 triangles, covering 3/4, 9/16 and 27/64 of the original area. At depth 10 the 59,049 triangles cover less than 6 percent of it.",
      },
      {
        title: "Randomness that draws order",
        text: "Switch to the chaos game and drag the points per frame down to 100. In the first second the dots look like scattered noise, yet none of them falls into the large central hole. Then push it to 20,000.",
      },
      {
        title: "Find the powers of two",
        text: "In Pascal mod 2, set exactly 64 rows: the triangle is complete and its last row, row 63, is filled from end to end, because 63 is 111111 in binary. Now set 65 rows: the new row 64 has only its two end cells filled, the seed of the next, twice as large copy.",
      },
      {
        title: "Same triangle, different spacing",
        text: "Compare Pascal mod 2 with 64 rows and Rule 90 with 64 generations. The patterns match, except that Rule 90 uses twice as many columns and its live cells sit only on every second position, because each Pascal entry lands between the two cells it came from.",
      },
    ],
  },
  de: {
    metaDescription:
      "Das Sierpiński-Dreieck vierfach zeichnen: rekursive Teilung, Chaosspiel, Pascal mod 2 und Regel 90, und verstehen, warum alle dasselbe Fraktal liefern.",
    heading: "So funktioniert dieser Explorer",
    intro:
      "Dieselbe Form entsteht hier auf vier völlig verschiedene Arten: durch Herausschneiden von Dreiecken aus einem Dreieck, durch eine Zufallswanderung, durch die Parität von Binomialkoeffizienten und durch einen eindimensionalen Zellularautomaten. Der Moduswechsel ändert das Rezept, nicht das Ergebnis. Dass vier voneinander unabhängige Verfahren beim selben Fraktal landen, ist der eigentliche Witz dieses Raums.",
    sections: [
      {
        heading: "Ein Dreieck mit Löchern auf jeder Skala",
        paragraphs: [
          "Nimm ein gefülltes Dreieck und verbinde die Mittelpunkte seiner Seiten. Das zerlegt es in vier kleinere Dreiecke; das mittlere entfernst du. Übrig bleiben drei halb so große Kopien, und auf jede wendest du denselben Schritt an, immer weiter. Nach n Schritten gibt es 3ⁿ Dreiecke mit 2ⁿ-mal kürzeren Seiten, die verbleibende Fläche ist also (3/4)ⁿ der ursprünglichen und geht gegen null. Wacław Sierpiński beschrieb die Menge 1915.",
          "Was übrig bleibt, ist selbstähnlich: Es besteht aus genau drei Kopien seiner selbst, jede um die Hälfte verkleinert. Ein gewöhnliches gefülltes Dreieck zerfällt beim Halbieren in vier Kopien, eine Strecke in zwei. Löst man 2^d = 3, erhält man die fraktale Dimension d = log 3 / log 2. Das Dreieck ist also mehr als eine Kurve und weniger als eine Fläche.",
        ],
        formula:
          "A_n = \\left(\\tfrac{3}{4}\\right)^{n} A_0, \\qquad \\dim = \\frac{\\log 3}{\\log 2} \\approx 1{,}585",
      },
      {
        heading: "Die vier Konstruktionen und ihre Regler",
        paragraphs: [
          "Die Unterteilung zeichnet das Dreieck in einer wählbaren Tiefe von 0 bis 10, voreingestellt ist 6. Änderst du die Tiefe, baut sich das Bild Ebene für Ebene neu auf, alle 280 Millisekunden eine Ebene. Der Zähler zeigt 3^Tiefe Dreiecke, bei Tiefe 10 sind das 59.049.",
          "Das Chaosspiel startet in der Mitte des Canvas, wählt zufällig eine der drei Ecken, springt auf halbem Weg auf sie zu, setzt einen Punkt und wiederholt das. Der Regler legt fest, wie viele Punkte pro Animationsframe gezeichnet werden, von 100 bis 20.000 (voreingestellt 4.000), und der Zähler zeigt die laufende Summe.",
          "Pascal mod 2 baut das Pascalsche Dreieck auf und füllt eine Zelle nur dort, wo der Binomialkoeffizient C(n, k) ungerade ist. Der Regler legt die Zahl der Zeilen fest, von 10 bis 256 (voreingestellt 64). Regel 90 startet mit einer einzigen lebenden Zelle und macht jede Zelle zum XOR ihrer beiden Nachbarinnen in der Zeile darüber; der Regler bestimmt die Zahl der Generationen, ebenfalls von 10 bis 256 (voreingestellt 96). Die Farbfelder färben die Zeichnung um, und Neustart lässt die aktuelle Konstruktion von vorn laufen.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Alles wird auf ein 2D-Canvas gezeichnet, dessen Auflösung an die Pixeldichte des Geräts angepasst ist und das bei jeder Größenänderung neu zeichnet. Die Unterteilung ist die rekursive Funktion unten: Sie halbiert die drei Kanten, steigt in die drei Eckdreiecke hinab und füllt ein Dreieck erst, wenn die Tiefe null erreicht. Das mittlere Dreieck jeder Ebene wird also schlicht nie gemalt.",
          "Das Chaosspiel läuft in einer Animationsschleife. Bevor etwas gezeichnet wird, macht es 20 Aufwärmsprünge, dann setzt es jeden Punkt als Ein-Pixel-Rechteck in halbtransparenter Farbe, sodass oft besuchte Bereiche heller werden. Pascal mod 2 berechnet nie einen Binomialkoeffizienten: Jede Zeile entsteht per XOR aus der vorherigen, und XOR ist Addition modulo 2. Deshalb sind 256 Zeilen sofort fertig, obwohl C(255, 127) 76 Stellen hat. Regel 90 nutzt pro Generation ein Uint8Array mit 2 · Generationen − 1 Zellen, breit genug, dass das Muster nie den Rand erreicht.",
          "Bei reduzierter Bewegung springt die Unterteilung direkt auf die Zieltiefe, und das Chaosspiel zeichnet einmalig 60.000 Punkte auf einen Schlag und hört dann auf. Pascal und Regel 90 sind ohnehin statische Zeichnungen.",
        ],
        code: SUBDIVISION_EXCERPT,
      },
      {
        heading: "Warum alle vier Bilder übereinstimmen",
        paragraphs: [
          "Das Chaosspiel funktioniert, weil das Dreieck die einzige Menge ist, die von ihren drei halbierten Kopien exakt überdeckt wird. Jeder Sprung wendet eine der drei Abbildungen «halbiere den Abstand zur Ecke i» an. Ein Punkt auf dem Dreieck bleibt darauf, ein Punkt daneben kommt mit jedem Sprung doppelt so nah heran. Nach den 20 Aufwärmsprüngen ist jeder Startfehler um etwa den Faktor eine Million geschrumpft, weit unter ein Pixel, und kein einziger Punkt landet in einem Loch.",
          "Pascal und Regel 90 stimmen überein, weil sie dieselbe Regel sind. Die Pascal-Regel C(n, k) = C(n − 1, k − 1) + C(n − 1, k), modulo 2 gelesen, sagt: Jeder Eintrag ist das XOR der beiden Einträge darüber. Das ist Regel 90 mit auseinandergezogenen Zellen. Der Satz von Lucas verrät dann genau, welche Zellen gefüllt sind: C(n, k) ist genau dann ungerade, wenn jede Binärziffer von k höchstens so groß ist wie die entsprechende Ziffer von n. Zeile n hat deshalb 2^s ungerade Einträge, wobei s die Anzahl der Einsen in der Binärdarstellung von n ist.",
        ],
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Dreiecke zählen",
        text: "Stell in der Unterteilung die Tiefe auf 1, 2 und 3. Du bekommst 3, 9 und 27 Dreiecke, die 3/4, 9/16 und 27/64 der ursprünglichen Fläche bedecken. Bei Tiefe 10 bedecken die 59.049 Dreiecke weniger als 6 Prozent davon.",
      },
      {
        title: "Zufall, der Ordnung zeichnet",
        text: "Wechsle zum Chaosspiel und zieh die Punkte pro Frame auf 100 herunter. In der ersten Sekunde wirken die Punkte wie verstreutes Rauschen, und trotzdem fällt keiner in das große Loch in der Mitte. Schieb den Regler dann auf 20.000.",
      },
      {
        title: "Die Zweierpotenzen finden",
        text: "Stell bei Pascal mod 2 genau 64 Zeilen ein: Das Dreieck ist vollständig, und seine letzte Zeile, Zeile 63, ist von Ende zu Ende gefüllt, weil 63 binär 111111 ist. Stell nun 65 Zeilen ein: In der neuen Zeile 64 sind nur die beiden Endzellen gefüllt, der Keim der nächsten, doppelt so großen Kopie.",
      },
      {
        title: "Gleiches Dreieck, anderer Abstand",
        text: "Vergleiche Pascal mod 2 mit 64 Zeilen und Regel 90 mit 64 Generationen. Die Muster stimmen überein, nur hat Regel 90 doppelt so viele Spalten, und ihre lebenden Zellen sitzen nur auf jeder zweiten Position, weil jeder Pascal-Eintrag zwischen den beiden Zellen landet, aus denen er entsteht.",
      },
    ],
  },
};
