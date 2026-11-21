import type { ExplorerGuide } from "./types";

// Circle counts quoted here (8 at depth 0, 488 at depth 4, 39368 at depth 8
// for (−1, 2, 2, 3)) follow from growGasket in app/apollonian/explorer/page.tsx
// (4 + 2·(3^(d+1) − 1) circles before the radius cutoff); update both together.
const GAP_EXCERPT = `function reflectThrough(a: Circle, b: Circle, c: Circle, d: Circle): Circle {
  const k = 2 * (a.k + b.k + c.k) - d.k;
  const numX = 2 * (a.k * a.x + b.k * b.x + c.k * c.x) - d.k * d.x;
  const numY = 2 * (a.k * a.y + b.k * b.y + c.k * c.y) - d.k * d.y;
  return { x: numX / k, y: numY / k, r: 1 / Math.abs(k), k };
}

while (stack.length > 0 && inserted < HARD_LIMIT) {
  const g = stack.pop()!;
  const e = reflectThrough(g.a, g.b, g.c, g.opp);
  if (e.r < 1e-5) continue;
  out.push(e);
  if (g.depth >= maxDepth) continue;
  stack.push({ a: g.a, b: g.b, c: e, opp: g.c, depth: g.depth + 1 });
  stack.push({ a: g.b, b: g.c, c: e, opp: g.a, depth: g.depth + 1 });
  stack.push({ a: g.a, b: g.c, c: e, opp: g.b, depth: g.depth + 1 });
}`;

const DESCARTES = "(k_1 + k_2 + k_3 + k_4)^2 = 2\\,(k_1^2 + k_2^2 + k_3^2 + k_4^2)";
const REFLECTION = "k_4' = 2\\,(k_1 + k_2 + k_3) - k_4";

export const APOLLONIAN_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Build an Apollonian gasket circle by circle: pick an integer packing, raise the depth and watch Descartes' circle theorem keep every curvature an integer.",
    heading: "How this explorer works",
    intro:
      "Start with four circles that all touch each other: one large circle on the outside and three inside it. Between them sit curved triangular gaps, and every such gap has exactly one circle that fits snugly inside, touching all three of its sides. Put that circle in, and three smaller gaps appear around it. Repeat forever and you get the Apollonian gasket, a fractal made entirely of circles. The canvas draws this up to the depth you choose; its labels are curvatures, the reciprocals of the radii.",
    sections: [
      {
        heading: "Descartes' circle theorem",
        paragraphs: [
          "For four mutually tangent circles there is a single equation linking their curvatures k = 1/r. Descartes described it in a letter to Princess Elisabeth of Bohemia in 1643, and it is the formula in the amber badge above the canvas. The outer circle counts with a negative sign, because the other circles touch it from the inside. For the default packing that gives (−1 + 2 + 2 + 3)² = 36 and 2(1 + 4 + 4 + 9) = 36.",
          "Read as an equation for k₄, the theorem is quadratic, so given three tangent circles there are two solutions: the two circles that can touch all three. Their curvatures add up to 2(k₁ + k₂ + k₃). That gives a rule without any square root: if you already know one of the two circles, the other one has curvature",
        ],
        formula: REFLECTION,
      },
      {
        heading: "Why every circle has a whole number",
        paragraphs: [
          "The reflection rule above uses only addition, doubling and subtraction. So if the four starting curvatures are integers, every circle the recursion ever adds has an integer curvature too. All five presets are such integer packings. Turn on the curvature labels and you can check it: in the (−1, 2, 2, 3) packing the first new circles have curvatures 15, 6, 6 and 3, and the next generation brings 38, 35, 23, 14, 11 and more. Which integers show up is an active question in number theory.",
          "There is a matching rule for positions. Lagarias, Mallows and Wilks showed that the same formula works if you multiply each curvature by the centre of its circle, written as a complex number. The explorer uses that complex version once, to place the fourth seed circle, and the linear version for everything after.",
        ],
        formula: DESCARTES,
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "The preset buttons choose the four seed curvatures. The first number is always the negative curvature of the enclosing circle, the other three belong to the circles inside it. The view rescales so the outer circle always fills the canvas, whatever its size.",
          "Recursion depth runs from 0 to 8 and starts at 4. Depth 0 fills only the four original gaps, giving 8 circles. Every further level triples the number of new circles, so depth 4 shows 488 and depth 8 shows 39368 for the default packing. For the other presets a few of the deepest circles fall below the cutoff radius and are skipped, so their counts at depth 8 come out a little lower.",
          "The view options toggle the curvature labels (only drawn inside circles with a radius above 14 pixels), a shading of the gaps that are still empty, colouring by curvature, and a wider margin when Fill frame is off.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "The seed is placed with plain geometry: the outer circle sits at the origin, the second circle touches it on the negative x axis, the third is found by intersecting two distance conditions, and the fourth comes from the complex Descartes theorem. Of two candidate centres, the code keeps the one that best touches all three parents.",
          "Growth is an explicit stack instead of recursion. Each entry describes one gap by its three bounding circles plus the fourth circle on the far side. Reflecting that fourth circle through the gap gives the new circle, which then splits the gap into three new entries. Circles with radius below 0.00001 are dropped, and a hard limit of 60000 insertions guards against runaway input.",
          "Drawing happens once whenever the circles or options change, not in an animation loop, so there is nothing to slow down for reduced motion. Colours come from the base-10 logarithm of the curvature: the hue sweeps from rose through amber and cyan to violet as circles shrink. Circles under 0.4 pixels on screen are skipped.",
        ],
        code: GAP_EXCERPT,
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "Watch the first generation",
        text: "Set the depth to 0 and switch on the curvature labels. Check that the new circles follow 2(k₁ + k₂ + k₃) − k₄: the small circle between −1, 2 and 2 opposite the 3 must be 2·3 − 3 = 3, the mirror image of its partner.",
      },
      {
        title: "See the growth law",
        text: "Step the depth from 0 to 5 and read the count: 8, 20, 56, 164, 488, 1460. Each step adds three times as many circles as the step before, because every filled gap leaves three new ones.",
      },
      {
        title: "Find where space runs out",
        text: "Turn on Highlight triangle gaps at depth 2, then raise the depth. The shaded area shrinks quickly. In the limit it shrinks to zero: the leftover set has zero area, but it is still more than a curve, with a fractal dimension of about 1.3.",
      },
      {
        title: "Compare the packings",
        text: "Switch between (−1, 2, 2, 3) and (−6, 11, 14, 15) at depth 3 with labels on. The second packing's curvatures grow much faster: the largest at depth 3 is 1847 instead of 323.",
      },
    ],
  },
  de: {
    metaDescription:
      "Apollonische Kreispackung Kreis für Kreis bauen: ganzzahlige Packung wählen, Tiefe erhöhen und sehen, wie der Satz von Descartes jede Krümmung ganzzahlig hält.",
    heading: "So funktioniert dieser Explorer",
    intro:
      "Am Anfang stehen vier Kreise, die sich alle gegenseitig berühren: ein großer außen und drei darin. Zwischen ihnen liegen krummlinige Dreieckslücken, und in jede dieser Lücken passt genau ein Kreis, der alle drei Seiten berührt. Setzt du ihn hinein, entstehen um ihn herum drei kleinere Lücken. Wiederholst du das ohne Ende, erhältst du das Apollonische Netz, auch Apollonische Dichtung genannt, ein Fraktal, das nur aus Kreisen besteht. Das Canvas zeigt diesen Prozess bis zur gewählten Tiefe, und die angezeigten Zahlen sind die Krümmungen der Kreise, also die Kehrwerte ihrer Radien.",
    sections: [
      {
        heading: "Der Satz von Descartes",
        paragraphs: [
          "Für vier Kreise, die sich paarweise berühren, verbindet eine einzige Gleichung ihre Krümmungen k = 1/r. Descartes beschrieb sie 1643 in einem Brief an Prinzessin Elisabeth von Böhmen, und sie steht im bernsteinfarbenen Kästchen über dem Canvas. Der äußere Kreis zählt negativ, weil die anderen ihn von innen berühren. Für die Standardpackung ergibt das (−1 + 2 + 2 + 3)² = 36 und 2(1 + 4 + 4 + 9) = 36.",
          "Als Gleichung für k₄ gelesen ist der Satz quadratisch, zu drei sich berührenden Kreisen gibt es also zwei Lösungen: die beiden Kreise, die alle drei berühren können. Ihre Krümmungen ergeben zusammen 2(k₁ + k₂ + k₃). Daraus folgt eine Regel ganz ohne Wurzel: Kennst du einen der beiden Kreise schon, hat der andere die Krümmung",
        ],
        formula: REFLECTION,
      },
      {
        heading: "Warum jeder Kreis eine ganze Zahl trägt",
        paragraphs: [
          "Die Spiegelungsregel oben braucht nur Addition, Verdoppeln und Subtraktion. Sind die vier Startkrümmungen ganze Zahlen, hat deshalb auch jeder Kreis, den die Rekursion jemals hinzufügt, eine ganzzahlige Krümmung. Alle fünf Voreinstellungen sind solche ganzzahligen Packungen. Schalte die Krümmungswerte ein und prüf es nach: In der Packung (−1, 2, 2, 3) haben die ersten neuen Kreise die Krümmungen 15, 6, 6 und 3, die nächste Generation bringt 38, 35, 23, 14, 11 und weitere. Welche ganzen Zahlen dabei vorkommen, ist ein aktives Thema der Zahlentheorie.",
          "Für die Lage der Kreise gibt es eine passende Regel. Lagarias, Mallows und Wilks zeigten, dass dieselbe Formel gilt, wenn du jede Krümmung mit dem Mittelpunkt ihres Kreises als komplexe Zahl multiplizierst. Der Explorer nutzt diese komplexe Version einmal, um den vierten Keimkreis zu platzieren, und danach nur noch die lineare.",
        ],
        formula: DESCARTES,
      },
      {
        heading: "Was die Regler bewirken",
        paragraphs: [
          "Die Packungsknöpfe wählen die vier Startkrümmungen. Die erste Zahl ist immer die negative Krümmung des umschließenden Kreises, die anderen drei gehören zu den Kreisen darin. Die Ansicht skaliert so, dass der äußere Kreis immer das Canvas füllt, egal wie groß er ist.",
          "Die Rekursionstiefe reicht von 0 bis 8 und startet bei 4. Tiefe 0 füllt nur die vier ursprünglichen Lücken, das ergibt 8 Kreise. Jede weitere Stufe verdreifacht die Zahl der neuen Kreise, Tiefe 4 zeigt also 488 und Tiefe 8 sogar 39368 Kreise für die Standardpackung. Bei den anderen Voreinstellungen fallen einige der tiefsten Kreise unter den Mindestradius und werden übersprungen, dort liegt die Zahl bei Tiefe 8 etwas niedriger.",
          "Die Ansichtsoptionen schalten die Krümmungswerte (nur in Kreisen mit mehr als 14 Pixeln Radius), eine Schattierung der noch leeren Lücken, die Färbung nach Krümmung und einen breiteren Rand, wenn «Bild füllen» aus ist.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Der Keim wird mit einfacher Geometrie platziert: Der äußere Kreis liegt im Ursprung, der zweite berührt ihn auf der negativen x-Achse, der dritte ergibt sich aus zwei Abstandsbedingungen, und der vierte kommt aus dem komplexen Satz von Descartes. Von zwei möglichen Mittelpunkten behält der Code den, der alle drei Elternkreise am besten berührt.",
          "Das Wachstum läuft über einen expliziten Stapel statt über Rekursion. Jeder Eintrag beschreibt eine Lücke durch ihre drei Randkreise plus den vierten Kreis auf der anderen Seite. Spiegelt man diesen vierten Kreis durch die Lücke, entsteht der neue Kreis, der die Lücke in drei neue Einträge teilt. Kreise mit einem Radius unter 0,00001 werden verworfen, und eine harte Grenze von 60000 Einfügungen schützt vor ausufernden Eingaben.",
          "Gezeichnet wird einmal, wenn sich Kreise oder Optionen ändern, nicht in einer Animationsschleife. Für reduzierte Bewegung muss deshalb nichts gebremst werden. Die Farben kommen aus dem Zehnerlogarithmus der Krümmung und wandern von Rosa über Bernstein und Cyan zu Violett, je kleiner die Kreise werden. Kreise unter 0,4 Pixeln werden übersprungen.",
        ],
        code: GAP_EXCERPT,
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Die erste Generation beobachten",
        text: "Stell die Tiefe auf 0 und schalte die Krümmungswerte ein. Prüf, dass die neuen Kreise der Regel 2(k₁ + k₂ + k₃) − k₄ folgen: Der kleine Kreis zwischen −1, 2 und 2 gegenüber der 3 muss 2·3 − 3 = 3 sein, das Spiegelbild seines Partners.",
      },
      {
        title: "Das Wachstumsgesetz sehen",
        text: "Erhöhe die Tiefe schrittweise von 0 auf 5 und lies die Anzahl ab: 8, 20, 56, 164, 488, 1460. Jeder Schritt fügt dreimal so viele Kreise hinzu wie der vorige, weil jede gefüllte Lücke drei neue hinterlässt.",
      },
      {
        title: "Wo der Platz ausgeht",
        text: "Schalte bei Tiefe 2 «Dreieckslücken hervorheben» ein und erhöhe dann die Tiefe. Die schattierte Fläche schrumpft schnell. Im Grenzwert schrumpft sie auf null: Die übrig bleibende Menge hat keinen Flächeninhalt, ist aber trotzdem mehr als eine Kurve, mit einer fraktalen Dimension von etwa 1,3.",
      },
      {
        title: "Packungen vergleichen",
        text: "Wechsle bei Tiefe 3 mit eingeschalteten Werten zwischen (−1, 2, 2, 3) und (−6, 11, 14, 15). Die zweite Packung ist weniger symmetrisch, und ihre Krümmungen wachsen viel schneller: Die größte bei Tiefe 3 ist 1847 statt 323.",
      },
    ],
  },
};
