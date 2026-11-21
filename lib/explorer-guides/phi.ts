import type { ExplorerGuide } from "./types";

// Numbers quoted here (depth 3 to 14, ratios n = 2 to 20, the angle slider
// 137.4° to 137.6° in steps of 0.0005°, 50 to 2000 seeds, defaults 10, 12,
// golden angle and 800) match app/phi/explorer/page.tsx; update both together.
const SUNFLOWER_EXCERPT = `const R = Math.min(W, H) / 2 - 20;      // disc radius in px
const c = R / Math.sqrt(count);          // outermost seed lands on the rim
const alpha = (angleDeg * Math.PI) / 180;

for (let n = 1; n <= count; n++) {
  const r = c * Math.sqrt(n);            // equal area per seed
  const theta = n * alpha;               // turn by α for every new seed
  const x = cx + r * Math.cos(theta);
  const y = cy + r * Math.sin(theta);
  const size = Math.max(1.2, c * 0.45);
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fill();
}`;

export const PHI_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Explore the golden ratio φ ≈ 1.618 in three views: a spiral of Fibonacci squares, Fibonacci ratios closing in on φ, and a sunflower built on the golden angle.",
    heading: "How this explorer works",
    intro:
      "The golden ratio φ = (1 + √5)/2 ≈ 1.618 turns up in three places here, each in its own panel. The spiral panel builds a rectangle out of squares whose sides are Fibonacci numbers. The ratios panel plots how fast consecutive Fibonacci numbers divide out to φ. The sunflower panel places seeds one after another, each turned by a fixed angle, and shows why one particular angle, the golden angle of about 137.5°, packs them better than any other.",
    sections: [
      {
        heading: "One number, three faces",
        paragraphs: [
          "φ is the positive solution of x² = x + 1. That single equation explains most of its tricks. Dividing by x gives φ = 1 + 1/φ, so 1/φ ≈ 0.618 has the same digits after the decimal point, and multiplying by φ gives φ² = φ + 1 ≈ 2.618. The other solution, ψ = (1 − √5)/2 ≈ −0.618, is the quiet partner that shows up in error terms.",
          "The Fibonacci numbers 1, 1, 2, 3, 5, 8, 13 obey the same rule in discrete form: each is the sum of the two before. Binet's formula below makes the link exact. Because |ψ| is smaller than 1, the ψⁿ term shrinks to nothing and Fₙ is simply the nearest whole number to φⁿ/√5. That is why the ratio of neighbours tends to φ.",
        ],
        formula:
          "\\varphi = \\frac{1+\\sqrt5}{2}, \\qquad F_n = \\frac{\\varphi^n - \\psi^n}{\\sqrt5}, \\qquad \\frac{F_{n+1}}{F_n} \\to \\varphi",
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "Spiral: the depth slider chooses how many squares to draw, from 3 to 14 (default 10). The sides are F₁ to Fₙ, so the two smallest squares both have side 1 and the largest at depth 14 has side 377. Together they always form an Fₙ by Fₙ₊₁ rectangle, and the status bar prints its aspect ratio: 89/55 ≈ 1.61818182 at the default depth.",
          "Ratios: the n slider sets how many ratios Fₙ₊₁/Fₙ to plot, from 2 to 20 (default 12), against a dashed line at φ on a vertical axis from 1.0 to 2.5. The first values zigzag wildly (1, 2, 1.5, 1.667, 1.6), then the curve flattens onto the line. Odd n land below φ, even n above, and each error is about 0.382 times the previous one in size, which is ψ². By n = 20 the ratio 10946/6765 is off by less than 10⁻⁸.",
          "Sunflower: the divergence angle slider covers only 137.4° to 137.6°, in steps of 0.0005°, because everything interesting happens in that narrow window. The seed count slider goes from 50 to 2000 (default 800). The snap button restores the exact golden angle, 360°/φ² ≈ 137.5078°.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "Each panel is a plain 2D canvas that redraws whenever a slider moves or the panel is resized. Canvases are scaled by the device pixel ratio so lines stay crisp, and nothing animates, so there is no motion to reduce: every frame is a still picture of the current settings.",
          "The spiral is built square by square. The first square sits at the origin; each next one is attached to the growing bounding rectangle on the left, top, right and bottom in turn, spanning the full side it touches. Every square's arc is centred on the corner it shares with both neighbours, which is what makes the quarter circles meet without kinks, and the code flips arc endpoints where needed so a single path traces the whole spiral.",
          "The sunflower uses Vogel's model from 1979. Seed n sits at angle n·α and radius c·√n. The square root is the important part: the area of a disc grows with the square of its radius, so placing seeds at √n gives each one the same share of area and keeps the head evenly filled from centre to rim. The constant c is chosen so the last seed lands on the edge of the disc.",
        ],
        code: SUNFLOWER_EXCERPT,
      },
      {
        heading: "Why the golden angle wins",
        paragraphs: [
          "If the angle is a simple fraction of a full turn, say p/q, then every q-th seed lands on the same ray and the head splits into q straight spokes with empty wedges in between. Any rational fraction does this eventually; close approximations to a rational just take longer and bend the spokes into spiral arms. The best angle is the one that is hardest to approximate by fractions, and in a precise sense that is φ: its continued fraction is 1 + 1/(1 + 1/(1 + …)), all ones, the slowest converging expansion there is. Its best approximations are ratios of Fibonacci numbers, which is why real sunflowers and pine cones show 34 and 55 or 55 and 89 spirals, and not, say, 40 and 60.",
        ],
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "Land on a fraction",
        text: "In the sunflower panel set the seed count to 2000 and drag the angle to exactly 137.5000°. That is 55/144 of a full turn, so the seeds line up into 144 straight spokes. Press snap and the spokes dissolve into an even field.",
      },
      {
        title: "Nudge off the golden angle",
        text: "Press snap, then move the slider to 137.52°, only about a hundredth of a degree away. Curved spiral arms appear, clearest near the rim, where the small error has been added up over the most seeds.",
      },
      {
        title: "Count the overshoot",
        text: "In the ratios panel set n to 6 and read the values: 1, 2, 1.5, 1.667, 1.6, 1.625. Each one crosses φ, and the distance shrinks by roughly 0.38 per step. Push n to 20 and the last points become indistinguishable from the dashed line.",
      },
      {
        title: "Grow the golden rectangle",
        text: "In the spiral panel step the depth from 3 to 14 and watch the ratio in the status bar: 1.5, 1.667, 1.6, then closer and closer to 1.6180339887. At depth 14 the rectangle is 377 by 610, and its ratio matches φ to five decimal places.",
      },
    ],
  },
  de: {
    metaDescription:
      "Den goldenen Schnitt φ ≈ 1,618 in drei Ansichten erkunden: Spirale aus Fibonacci-Quadraten, Fibonacci-Verhältnisse auf dem Weg zu φ und eine Sonnenblume.",
    heading: "So funktioniert dieser Explorer",
    intro:
      "Der goldene Schnitt φ = (1 + √5)/2 ≈ 1,618 taucht hier an drei Stellen auf, jede in einer eigenen Ansicht. Die Spirale baut ein Rechteck aus Quadraten, deren Seiten Fibonacci-Zahlen sind. Die Verhältnisse zeigen, wie schnell sich benachbarte Fibonacci-Zahlen zu φ teilen. Die Sonnenblume setzt Samen nacheinander, jeden um einen festen Winkel gedreht, und zeigt, warum ein ganz bestimmter Winkel, der goldene Winkel von etwa 137,5°, sie besser packt als jeder andere.",
    sections: [
      {
        heading: "Eine Zahl, drei Gesichter",
        paragraphs: [
          "φ ist die positive Lösung von x² = x + 1. Diese eine Gleichung erklärt die meisten ihrer Eigenheiten. Teilt man durch x, erhält man φ = 1 + 1/φ, also hat 1/φ ≈ 0,618 dieselben Nachkommastellen. Multipliziert man mit φ, ergibt sich φ² = φ + 1 ≈ 2,618. Die andere Lösung, ψ = (1 − √5)/2 ≈ −0,618, ist die stille Partnerin, die in den Fehlertermen auftaucht.",
          "Die Fibonacci-Zahlen 1, 1, 2, 3, 5, 8, 13 gehorchen derselben Regel in diskreter Form: Jede ist die Summe der beiden vorherigen. Die Formel von Binet unten macht den Zusammenhang exakt. Weil |ψ| kleiner als 1 ist, verschwindet der Term ψⁿ, und Fₙ ist einfach die ganze Zahl, die φⁿ/√5 am nächsten liegt. Deshalb strebt das Verhältnis benachbarter Glieder gegen φ.",
        ],
        formula:
          "\\varphi = \\frac{1+\\sqrt5}{2}, \\qquad F_n = \\frac{\\varphi^n - \\psi^n}{\\sqrt5}, \\qquad \\frac{F_{n+1}}{F_n} \\to \\varphi",
      },
      {
        heading: "Was die Regler bewirken",
        paragraphs: [
          "Spirale: Der Tiefenregler wählt, wie viele Quadrate gezeichnet werden, von 3 bis 14 (Standard 10). Die Seiten sind F₁ bis Fₙ, die beiden kleinsten Quadrate haben also beide die Seite 1, das größte bei Tiefe 14 die Seite 377. Zusammen bilden sie immer ein Rechteck aus Fₙ mal Fₙ₊₁, und die Statusleiste zeigt dessen Seitenverhältnis: 89/55 ≈ 1,61818182 bei der Standardtiefe.",
          "Verhältnisse: Der n-Regler legt fest, wie viele Verhältnisse Fₙ₊₁/Fₙ gezeichnet werden, von 2 bis 20 (Standard 12), vor einer gestrichelten Linie bei φ auf einer senkrechten Achse von 1,0 bis 2,5. Die ersten Werte springen wild hin und her (1, 2, 1,5, 1,667, 1,6), dann legt sich die Kurve auf die Linie. Ungerade n liegen unter φ, gerade darüber, und jeder Fehler ist ungefähr 0,382 mal so groß wie der vorige, das ist ψ². Bei n = 20 weicht 10946/6765 um weniger als 10⁻⁸ ab.",
          "Sonnenblume: Der Regler für den Divergenzwinkel reicht nur von 137,4° bis 137,6°, in Schritten von 0,0005°, weil alles Spannende in diesem schmalen Fenster passiert. Die Samenanzahl reicht von 50 bis 2000 (Standard 800). Der Snap-Knopf stellt den exakten goldenen Winkel wieder her, 360°/φ² ≈ 137,5078°.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Jede Ansicht ist ein schlichtes 2D-Canvas, das neu zeichnet, sobald sich ein Regler bewegt oder die Größe ändert. Die Canvases sind an das Pixelverhältnis des Geräts angepasst, damit Linien scharf bleiben. Nichts ist animiert, es gibt also keine Bewegung, die man reduzieren müsste: Jedes Bild ist ein Standbild der aktuellen Einstellungen.",
          "Die Spirale entsteht Quadrat für Quadrat. Das erste liegt im Ursprung, jedes weitere wird abwechselnd links, oben, rechts und unten an das wachsende Rechteck angesetzt und überspannt die ganze Seite, an der es anliegt. Der Bogen jedes Quadrats hat seinen Mittelpunkt in der Ecke, die es mit beiden Nachbarn teilt. Dadurch treffen sich die Viertelkreise ohne Knick, und der Code vertauscht bei Bedarf Anfang und Ende der Bögen, damit ein einziger Pfad die ganze Spirale nachzeichnet.",
          "Die Sonnenblume folgt dem Modell von Vogel aus dem Jahr 1979. Samen n sitzt beim Winkel n·α und beim Radius c·√n. Entscheidend ist die Wurzel: Die Fläche einer Scheibe wächst mit dem Quadrat des Radius, also bekommt bei √n jeder Samen denselben Flächenanteil, und der Blütenkopf bleibt von der Mitte bis zum Rand gleichmäßig gefüllt. Die Konstante c ist so gewählt, dass der letzte Samen genau auf dem Rand der Scheibe landet.",
        ],
        code: SUNFLOWER_EXCERPT,
      },
      {
        heading: "Warum der goldene Winkel gewinnt",
        paragraphs: [
          "Ist der Winkel ein einfacher Bruchteil einer vollen Drehung, etwa p/q, dann landet jeder q-te Samen auf demselben Strahl, und der Kopf zerfällt in q gerade Speichen mit leeren Keilen dazwischen. Jeder rationale Bruch tut das irgendwann, gute Näherungen an einen Bruch brauchen nur länger und biegen die Speichen zu Spiralarmen. Der beste Winkel ist der, der sich am schlechtesten durch Brüche annähern lässt, und in einem präzisen Sinn ist das φ: Sein Kettenbruch ist 1 + 1/(1 + 1/(1 + …)), lauter Einsen, die am langsamsten konvergierende Entwicklung überhaupt. Seine besten Näherungen sind Verhältnisse von Fibonacci-Zahlen. Deshalb zeigen echte Sonnenblumen und Kiefernzapfen 34 und 55 oder 55 und 89 Spiralen, und nicht etwa 40 und 60.",
        ],
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Auf einem Bruch landen",
        text: "Stell in der Sonnenblume die Samenanzahl auf 2000 und zieh den Winkel auf genau 137,5000°. Das sind 55/144 einer vollen Drehung, die Samen reihen sich also zu 144 geraden Speichen auf. Drück auf Snap, und die Speichen lösen sich in ein gleichmäßiges Feld auf.",
      },
      {
        title: "Ein Hauch neben dem goldenen Winkel",
        text: "Drück auf Snap und schieb den Regler dann auf 137,52°, nur etwa ein hundertstel Grad daneben. Gebogene Spiralarme erscheinen, am deutlichsten am Rand, wo sich der kleine Fehler über die meisten Samen aufsummiert hat.",
      },
      {
        title: "Das Überschießen zählen",
        text: "Stell in den Verhältnissen n auf 6 und lies die Werte ab: 1, 2, 1,5, 1,667, 1,6, 1,625. Jeder Wert springt über φ hinweg, und der Abstand schrumpft pro Schritt um etwa den Faktor 0,38. Schieb n auf 20, und die letzten Punkte sind von der gestrichelten Linie nicht mehr zu unterscheiden.",
      },
      {
        title: "Das goldene Rechteck wachsen lassen",
        text: "Erhöhe in der Spirale die Tiefe schrittweise von 3 auf 14 und beobachte das Verhältnis in der Statusleiste: 1,5, 1,667, 1,6, dann immer näher an 1,6180339887. Bei Tiefe 14 misst das Rechteck 377 mal 610, und sein Verhältnis stimmt auf fünf Nachkommastellen mit φ überein.",
      },
    ],
  },
};
