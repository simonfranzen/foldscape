import type { ExplorerGuide } from "./types";

// Counts quoted here (10 seed triangles, 340 half-tiles at depth 4, 2330 at
// depth 6, the 1440 / 890 ratio) follow from the substitution rules in
// app/penrose/explorer/page.tsx; update both together.
const DEFLATE_EXCERPT = `function inflate(tris) {
  const out = [];
  for (const tr of tris) {
    if (tr.t === 0) {                       // thin half (36° apex)
      const P = add(tr.a, scale(sub(tr.b, tr.a), 1 / PHI));
      out.push({ t: 0, a: tr.c, b: P, c: tr.b });
      out.push({ t: 1, a: P, b: tr.c, c: tr.a });
    } else {                                // thick half (108° apex)
      const Q = add(tr.b, scale(sub(tr.a, tr.b), 1 / PHI));
      const R = add(tr.b, scale(sub(tr.c, tr.b), 1 / PHI));
      out.push({ t: 1, a: R, b: tr.c, c: tr.a });
      out.push({ t: 1, a: Q, b: R, c: tr.b });
      out.push({ t: 0, a: R, b: Q, c: tr.a });
    }
  }
  return out;
}`;

export const PENROSE_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Grow a Penrose tiling by deflation: thick and thin rhombi, Robinson triangles, and a thick to thin ratio that converges to the golden ratio φ as you go deeper.",
    heading: "How this explorer works",
    intro:
      "The pattern on the canvas is a Penrose rhombus tiling, often called P3. It uses only two tiles, a thick rhombus and a thin one, both with the same edge length. Together they can cover the entire plane, but never periodically: there is no way to shift the whole pattern so that it lands on itself. The explorer starts from a small ring of triangles and repeatedly cuts every triangle into smaller ones according to a fixed rule, and the tiling grows out of that subdivision.",
    sections: [
      {
        heading: "Two rhombi, two triangles",
        paragraphs: [
          "The thick rhombus has angles of 72° and 108°, the thin one 36° and 144°. Cut each in half along its axis of symmetry and you get the two Robinson triangles the code actually works with. Halving the thin rhombus along its short diagonal gives a triangle with a 36° apex and two 72° base angles. Halving the thick rhombus along its long diagonal gives a triangle with a 108° apex and two 36° base angles. In both, the two equal sides are rhombus edges, and in both, the ratio between the long and the short side is the golden ratio φ.",
          "Roger Penrose found aperiodic tile sets of this kind in the 1970s. Without extra rules the two rhombi could also tile periodically, so the true Penrose tiling comes with matching rules on the edges that forbid every periodic arrangement. Subdivision sidesteps the problem: every tiling produced by repeatedly deflating the triangles automatically obeys those rules.",
        ],
        formula:
          "\\varphi = \\frac{1+\\sqrt{5}}{2} \\approx 1.618, \\qquad \\varphi^2 = \\varphi + 1",
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "Deflation depth runs from 0 to 6 and starts at 4. Depth 0 is the seed: ten thin half triangles with their apex at the centre, together forming a decagon. Every step replaces each thin half by two smaller triangles and each thick half by three, all scaled down by a factor of φ, so the whole disc stays the same size while the tiles get smaller. The total number of half triangles goes 10, 20, 50, 130, 340, 890, 2330, growing by roughly φ² ≈ 2.618 per step.",
          "Seed rotation turns the starting decagon from 0° to 360°. The seed alternates the orientation of neighbouring triangles, so it has fivefold symmetry, and rotating by 72° gives exactly the same picture. The mode buttons switch between Rhombi, where mirrored half triangles are glued back into full rhombi (thick violet, thin rose), and Half triangles, which shows the same subdivision one level lower (thick halves violet, thin halves amber). The display toggles hide outlines or colours. The centre button resets the rotation to 0°.",
          "Matching markers draws small arrowheads on two opposite sides of every rhombus, amber for thick and cyan for thin, with one single and one double head each. They are a simplified visual hint at the idea of edge decorations, not a complete set of Penrose matching rules.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "Every half triangle is stored as three complex numbers A, B, C plus a type flag: 0 for the thin half, 1 for the thick half. A is always the apex between the two equal sides. Deflation needs nothing but points that divide an edge in the golden ratio, which is what the expression A + (B − A) / φ computes.",
          "To show rhombi, the code pairs up triangles that share their base B C. It keys each triangle by the midpoint of B C rounded to six decimals, and when two triangles of the same type meet on the same key it forms the rhombus with the fourth vertex B + C − A, the reflection of the apex across the base. Halves left over at the rim of the disc are reflected the same way, so the boundary looks clean, which is why the rhombus counter is slightly more than half the triangle count.",
          "Drawing uses a 2D canvas scaled so the unit disc fills about 95 percent of the shorter side (minus a small margin), followed by a soft radial vignette. Nothing is animated: the canvas redraws only when you change a control or resize the window, so the page behaves the same with reduced motion enabled.",
        ],
        code: DEFLATE_EXCERPT,
      },
      {
        heading: "Where the golden ratio comes from",
        paragraphs: [
          "Count what one step does. A thin half becomes one thin and one thick half; a thick half becomes one thin and two thick halves. Starting from ten thin halves, the counts are ten times consecutive Fibonacci numbers: 10 and 0, then 10 and 10, 20 and 30, 50 and 80, and so on. The ratio of thick to thin therefore approaches φ: (1, φ) is the direction of the dominant eigenvector of the substitution matrix, whose eigenvalue is φ². Because φ is irrational, no repeating block of tiles could ever produce this ratio, which gives a neat argument for why the tiling cannot be periodic.",
        ],
        formula:
          "\\begin{pmatrix} n_{\\text{thin}} \\\\ n_{\\text{thick}} \\end{pmatrix} \\mapsto \\begin{pmatrix} 1 & 1 \\\\ 1 & 2 \\end{pmatrix} \\begin{pmatrix} n_{\\text{thin}} \\\\ n_{\\text{thick}} \\end{pmatrix}",
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "Watch the ratio converge",
        text: "Switch to Half triangles and step the depth from 1 to 6. The ratio reads 1, 1.5, 1.6, 1.6154, 1.6176 and finally 1.6180 at depth 6, where there are 1440 thick and 890 thin halves.",
      },
      {
        title: "Find the fivefold symmetry",
        text: "Set the depth to 3 and the rotation to 72°. The picture is identical to 0°.",
      },
      {
        title: "Strip away the colour",
        text: "At depth 5, switch colours off and leave only the outlines. Without the violet and rose hints, look for the five-pointed stars made of thick rhombi. The same small patches recur all over the disc, but never on a regular grid.",
      },
      {
        title: "See the seed",
        text: "Set the depth to 0 in Rhombi mode. The ten seed triangles are each reflected outward into a thin rhombus, and the counter shows 10 thin and 0 thick.",
      },
    ],
  },
  de: {
    metaDescription:
      "Penrose-Parkettierung per Deflation wachsen lassen: dicke und dünne Rhomben, Robinson-Dreiecke und ein Verhältnis, das gegen den goldenen Schnitt φ strebt.",
    heading: "So funktioniert dieser Explorer",
    intro:
      "Das Muster auf dem Canvas ist eine Penrose-Rhombenparkettierung, oft P3 genannt. Sie kommt mit nur zwei Kacheln aus, einem dicken und einem dünnen Rhombus mit gleicher Kantenlänge. Zusammen können sie die ganze Ebene bedecken, aber niemals periodisch: Es gibt keine Verschiebung, die das gesamte Muster auf sich selbst abbildet. Der Explorer beginnt mit einem kleinen Ring aus Dreiecken und zerschneidet jedes Dreieck immer wieder nach einer festen Regel in kleinere. Aus dieser Unterteilung wächst die Parkettierung.",
    sections: [
      {
        heading: "Zwei Rhomben, zwei Dreiecke",
        paragraphs: [
          "Der dicke Rhombus hat Winkel von 72° und 108°, der dünne 36° und 144°. Halbierst du beide entlang ihrer Symmetrieachse, erhältst du die zwei Robinson-Dreiecke, mit denen der Code tatsächlich rechnet. Der dünne Rhombus, entlang der kurzen Diagonale halbiert, ergibt ein Dreieck mit 36° an der Spitze und zwei Basiswinkeln von 72°. Der dicke Rhombus, entlang der langen Diagonale halbiert, ergibt ein Dreieck mit 108° an der Spitze und zwei Basiswinkeln von 36°. In beiden sind die zwei gleich langen Seiten Rhombuskanten, und in beiden ist das Verhältnis von langer zu kurzer Seite der goldene Schnitt φ.",
          "Roger Penrose fand aperiodische Kachelsätze dieser Art in den 1970er-Jahren. Ohne Zusatzregeln könnten die beiden Rhomben auch periodisch parkettieren, deshalb gehören zur echten Penrose-Parkettierung Anlegeregeln an den Kanten, die jede periodische Anordnung verbieten. Die Unterteilung umgeht dieses Problem: Jede Parkettierung, die durch wiederholte Deflation der Dreiecke entsteht, hält diese Regeln automatisch ein.",
        ],
        formula:
          "\\varphi = \\frac{1+\\sqrt{5}}{2} \\approx 1{,}618, \\qquad \\varphi^2 = \\varphi + 1",
      },
      {
        heading: "Was die Regler bewirken",
        paragraphs: [
          "Die Deflationstiefe reicht von 0 bis 6 und startet bei 4. Tiefe 0 ist der Keim: zehn dünne Halbdreiecke mit der Spitze im Mittelpunkt, die zusammen ein Zehneck bilden. Jeder Schritt ersetzt jede dünne Hälfte durch zwei kleinere Dreiecke und jede dicke durch drei, alle um den Faktor φ verkleinert. Die Scheibe bleibt also gleich groß, während die Kacheln schrumpfen. Die Gesamtzahl der Halbdreiecke lautet 10, 20, 50, 130, 340, 890, 2330 und wächst pro Schritt ungefähr um φ² ≈ 2,618.",
          "Die Keim-Drehung dreht das Ausgangszehneck von 0° bis 360°. Benachbarte Keimdreiecke sind abwechselnd gespiegelt, der Keim hat deshalb fünfzählige Symmetrie, und eine Drehung um 72° ergibt exakt dasselbe Bild. Die Modusknöpfe wechseln zwischen Rhomben, bei denen gespiegelte Halbdreiecke wieder zu ganzen Rhomben zusammengesetzt werden (dick violett, dünn rosa), und Halbdreiecken, die dieselbe Unterteilung eine Ebene tiefer zeigen (dicke Hälften violett, dünne bernstein). Die Anzeigeschalter blenden Umrisse oder Farben aus. Der Zentrieren-Knopf setzt die Drehung auf 0° zurück.",
          "Die Anlegemarken zeichnen kleine Pfeilspitzen auf zwei gegenüberliegende Seiten jedes Rhombus, bernstein für dicke und cyan für dünne, jeweils eine einfache und eine doppelte. Sie sind ein vereinfachter visueller Hinweis auf die Idee der Kantenmarkierung, kein vollständiger Satz von Penrose-Anlegeregeln.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Jedes Halbdreieck ist als drei komplexe Zahlen A, B, C plus ein Typ gespeichert: 0 für die dünne Hälfte, 1 für die dicke. A ist immer die Spitze zwischen den beiden gleich langen Seiten. Für die Deflation braucht es nur Punkte, die eine Kante im goldenen Schnitt teilen, genau das berechnet der Ausdruck A + (B − A) / φ.",
          "Für die Rhomben sucht der Code Dreieckspaare, die sich ihre Basis B C teilen. Er ordnet jedes Dreieck dem Mittelpunkt von B C zu, gerundet auf sechs Nachkommastellen. Treffen zwei Dreiecke gleichen Typs auf denselben Schlüssel, entsteht der Rhombus mit der vierten Ecke B + C − A, der Spiegelung der Spitze an der Basis. Übrig gebliebene Hälften am Rand der Scheibe werden genauso gespiegelt, damit der Rand sauber aussieht. Deshalb liegt der Rhombenzähler etwas über der Hälfte der Dreieckszahl.",
          "Gezeichnet wird auf einem 2D-Canvas, so skaliert, dass die Einheitsscheibe etwa 95 Prozent der kürzeren Seite füllt (abzüglich eines kleinen Rands), darüber eine weiche radiale Vignette. Nichts ist animiert: Das Canvas zeichnet nur neu, wenn du einen Regler änderst oder das Fenster seine Größe wechselt. Mit reduzierter Bewegung verhält sich die Seite also genauso.",
        ],
        code: DEFLATE_EXCERPT,
      },
      {
        heading: "Woher der goldene Schnitt kommt",
        paragraphs: [
          "Zähl nach, was ein Schritt bewirkt. Eine dünne Hälfte wird zu einer dünnen und einer dicken, eine dicke zu einer dünnen und zwei dicken. Ausgehend von zehn dünnen Hälften sind die Anzahlen das Zehnfache aufeinanderfolgender Fibonacci-Zahlen: 10 und 0, dann 10 und 10, 20 und 30, 50 und 80 und so weiter. Das Verhältnis von dick zu dünn strebt deshalb gegen φ: (1, φ) ist die Richtung des dominanten Eigenvektors der Substitutionsmatrix, ihr Eigenwert ist φ². Weil φ irrational ist, könnte kein sich wiederholender Kachelblock dieses Verhältnis erzeugen. Das ist ein eleganter Grund, warum die Parkettierung nicht periodisch sein kann.",
        ],
        formula:
          "\\begin{pmatrix} n_{\\text{dünn}} \\\\ n_{\\text{dick}} \\end{pmatrix} \\mapsto \\begin{pmatrix} 1 & 1 \\\\ 1 & 2 \\end{pmatrix} \\begin{pmatrix} n_{\\text{dünn}} \\\\ n_{\\text{dick}} \\end{pmatrix}",
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Das Verhältnis konvergieren sehen",
        text: "Wechsle zu Halbdreiecken und erhöhe die Tiefe schrittweise von 1 bis 6. Das Verhältnis zeigt 1, 1,5, 1,6, 1,6154, 1,6176 und schließlich 1,6180 bei Tiefe 6, wo es 1440 dicke und 890 dünne Hälften gibt.",
      },
      {
        title: "Die fünfzählige Symmetrie finden",
        text: "Stell die Tiefe auf 3 und die Drehung auf 72°. Das Bild ist identisch mit 0°.",
      },
      {
        title: "Die Farbe weglassen",
        text: "Schalte bei Tiefe 5 die Farben aus und lass nur die Umrisse stehen. Such ohne die violetten und rosa Hinweise nach fünfzackigen Sternen aus dicken Rhomben. Dieselben kleinen Ausschnitte kehren überall auf der Scheibe wieder, aber nie in einem regelmäßigen Raster.",
      },
      {
        title: "Den Keim ansehen",
        text: "Stell im Rhomben-Modus die Tiefe auf 0. Die zehn Keimdreiecke werden jeweils nach außen zu einem dünnen Rhombus gespiegelt, der Zähler zeigt 10 dünne und 0 dicke.",
      },
    ],
  },
};
