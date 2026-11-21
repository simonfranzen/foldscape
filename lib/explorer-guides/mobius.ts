import type { ExplorerGuide } from "./types";

// Numbers quoted here (R = 1, default width 0.32, 160 × 16 and 120 × 36
// quads, camera distance 4.5 / 6.5) match
// app/mobius/explorer/page.tsx; update both together.
const MOBIUS_EXCERPT = `// k half-twists, centre radius R, v in [-w, w], u in [0, 2π)
function mobiusPoint(u, v, k, R) {
  const twist = (k * u) / 2;
  const x = (R + v * Math.cos(twist)) * Math.cos(u);
  const y = (R + v * Math.cos(twist)) * Math.sin(u);
  const z = v * Math.sin(twist);
  return [x, y, z];
}

// Per triangle, in camera space: both faces are lit
const n = norm(cross(sub(r1, r0), sub(r2, r0)));
const ldot = dot(n, light);
const shade = 0.18 + 0.82 * Math.abs(ldot);

tris.sort((p, q) => q.z - p.z); // painter's algorithm, far first`;

export const MOBIUS_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Rotate a Möbius strip and a Klein bottle in 3D, add half-twists, cut the strip at a third of its width and see why the two pieces stay linked together.",
    heading: "How this explorer works",
    intro:
      "The ribbon in the middle is a Möbius strip: a band with one half-twist whose ends are glued together. It looks like an ordinary loop, but it has only one side and only one edge. Walk once along the centre line and you arrive back on what seemed to be the other face.",
    sections: [
      {
        heading: "One formula, many bands",
        paragraphs: [
          "The strip is drawn from a parametrisation. u runs once around the centre circle of radius R, v runs across the width from −w to w. As u goes from 0 to 2π, the cross-section rotates by k·u/2, so after a full lap it has turned by k half-turns. For k = 1 the segment at u = 2π is the starting segment flipped end to end, and gluing it to itself produces the one-sided surface.",
          "Whether the result is one-sided depends only on the parity of k. Odd k (1, 3, 5) gives a non-orientable band; even k (2, 4) gives a two-sided band that is topologically an ordinary cylinder. The edge tells a second story: for odd k it is a single closed curve, for even k it is two separate circles. With one half-twist that single edge is an unknotted loop, with three it is a trefoil knot, and with two the two edge circles are linked once.",
        ],
        formula:
          "\\big((R + v\\cos\\tfrac{ku}{2})\\cos u,\\; (R + v\\cos\\tfrac{ku}{2})\\sin u,\\; v\\sin\\tfrac{ku}{2}\\big)",
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "Surface switches between the Möbius strip and the Klein bottle. Auto-spin rotates the model around its vertical axis at the chosen speed, from 0 to 1.5 radians per second (default 0.45); if your system asks for reduced motion, it starts switched off. Dragging on the canvas rotates it by hand at all times, about 0.005 radians per pixel.",
          "Width w is the half-width of the band, from 0.05 to 0.5 with a centre radius of 1 (default 0.32). Number of half-twists sets k from 1 to 5. The cut ratio c, from 0 to 0.5, marks the two lines v = ±c·w: everything closer to the centre line than that turns amber, everything outside keeps the red to blue gradient. Open the cut opens a narrow slit along the cut lines, without moving the pieces, so you can see how they hang together.",
          "A word on the presets: every cut ratio above zero is topologically the same experiment. On a strip with one half-twist the two lines v = c and v = −c are really one curve, because after one lap v turns into −v. Cutting along it always leaves a thinner Möbius strip in the middle (amber) and one long two-sided band around it, and the two are linked. The preset 1/3 is the classic version: three equal widths. The centre line preset is a different experiment: a single cut along v = 0 that closes after one lap. It leaves one piece, a two-sided band twice as long with two full twists, drawn here with a thin slit. The result lines under the presets hold for one half-twist and are hidden for other values.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "There is no 3D library here. The page samples the surface on a grid (160 × 16 quads for the strip, 120 × 36 for the Klein bottle), splits every quad into two triangles, rotates the corners around the x, y and z axes, and projects them with a simple perspective divide onto a 2D canvas. The camera sits 4.5 units away for the strip and 6.5 for the bottle. All triangles are then sorted by their average depth and painted from back to front, the painter's algorithm.",
          "The shading contains the one design decision that is specific to this topic. A one-sided surface has no consistent normal: follow the normal vector once around a Möbius strip and it comes back pointing the other way. So the renderer cannot decide which face is the front. It lights each triangle with the absolute value of the dot product between its normal and the light direction, so both faces get the same Lambert shading. Only the thin outline changes, light or dark depending on the sign, and you can watch that sign flip as you follow the band around.",
          "Colour runs along the length instead of across the faces: red at u = 0, blue just before 2π. The hard colour change where the strip closes only marks where the parametrisation starts again; it is not a feature of the surface.",
        ],
        code: MOBIUS_EXCERPT,
      },
      {
        heading: "The Klein bottle",
        paragraphs: [
          "Glue two Möbius strips together along their edges and you get a Klein bottle: a closed surface with no boundary at all, still with only one side. Like the strip it has Euler characteristic 0. In four dimensions it can be built without touching itself, but in ordinary three-dimensional space every closed one-sided surface must pass through itself. The explorer uses the figure-eight immersion with a = 2: a figure-eight cross-section swept around a circle while turning by half a revolution. The surface crosses itself along the circle of radius 2 in the plane z = 0.",
        ],
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "Follow the single edge",
        text: "Keep one half-twist, turn auto-spin off and drag slowly. Trace the outer rim with your eyes: it runs around twice before it meets itself. With 2 half-twists there are two separate rims.",
      },
      {
        title: "The cut into thirds",
        text: "Press the 1/3 preset, then Open the cut. The amber middle third is a thinner Möbius strip, the outer part is one long band, and they cannot be pulled apart without cutting again. Then press centre line: the slit runs all the way around, yet the band stays in one piece.",
      },
      {
        title: "Odd versus even",
        text: "Step through 1, 2, 3, 4 and 5 half-twists with the width at 0.5. 3 and 5 behave like 1 (one side, one edge); 2 and 4 are two-sided cylinders in disguise.",
      },
      {
        title: "Find the self-intersection",
        text: "Switch to the Klein bottle and lower the spin speed to about 0.15. Watch the middle of the shape: the tube passes through itself along a ring, the price for showing a four-dimensional object in three dimensions.",
      },
    ],
  },
  de: {
    metaDescription:
      "Möbius-Band und Klein-Flasche in 3D drehen, Halbdrehungen hinzufügen, das Band bei einem Drittel schneiden und sehen, warum die Teile verkettet bleiben.",
    heading: "So funktioniert dieser Explorer",
    intro:
      "Das Band in der Mitte ist ein Möbius-Band: ein Streifen mit einer halben Drehung, dessen Enden zusammengeklebt sind. Es sieht aus wie eine gewöhnliche Schlaufe, hat aber nur eine Seite und nur eine Kante. Lauf einmal die Mittellinie entlang, und du kommst auf der scheinbar anderen Seite wieder an.",
    sections: [
      {
        heading: "Eine Formel, viele Bänder",
        paragraphs: [
          "Das Band entsteht aus einer Parametrisierung. u läuft einmal um den Mittelkreis mit Radius R, v quer über die Breite von −w bis w. Während u von 0 bis 2π wächst, dreht sich der Querschnitt um k·u/2, nach einer vollen Runde also um k halbe Umdrehungen. Bei k = 1 ist das Segment bei u = 2π das Anfangssegment, nur umgedreht, und wenn man beide verklebt, entsteht die einseitige Fläche.",
          "Ob das Ergebnis einseitig ist, hängt nur davon ab, ob k gerade ist. Ungerades k (1, 3, 5) liefert ein nicht orientierbares Band, gerades k (2, 4) ein zweiseitiges, das topologisch ein gewöhnlicher Zylinder ist. Die Kante erzählt noch etwas: Bei ungeradem k ist sie eine einzige geschlossene Kurve, bei geradem k sind es zwei getrennte Kreise. Mit einer Halbdrehung ist diese eine Kante unverknotet, mit drei ist sie ein Kleeblattknoten, und mit zwei sind die beiden Kantenkreise einmal miteinander verschlungen.",
        ],
        formula:
          "\\big((R + v\\cos\\tfrac{ku}{2})\\cos u,\\; (R + v\\cos\\tfrac{ku}{2})\\sin u,\\; v\\sin\\tfrac{ku}{2}\\big)",
      },
      {
        heading: "Was die Regler bewirken",
        paragraphs: [
          "«Fläche» wechselt zwischen Möbius-Band und Klein-Flasche. Die Auto-Rotation dreht das Modell um seine senkrechte Achse, mit 0 bis 1,5 Radiant pro Sekunde (Standard 0,45); wünscht dein System reduzierte Bewegung, ist sie anfangs aus. Ziehen auf dem Canvas dreht es jederzeit von Hand, etwa 0,005 Radiant pro Pixel.",
          "Die Breite w ist die halbe Breite des Bands, von 0,05 bis 0,5 bei einem Mittelradius von 1 (Standard 0,32). «Anzahl Halbdrehungen» setzt k von 1 bis 5. Das Schnittverhältnis c von 0 bis 0,5 markiert die beiden Linien v = ±c·w: Alles, was näher an der Mittellinie liegt, wird bernsteinfarben, alles außerhalb behält den Verlauf von Rot nach Blau. «Schnitt öffnen» öffnet entlang der Schnittlinien einen schmalen Spalt, ohne die Teile zu verschieben, damit du siehst, wie sie zusammenhängen.",
          "Ein Hinweis zu den Voreinstellungen: Jedes Schnittverhältnis über null ist topologisch dasselbe Experiment. Auf einem Band mit einer Halbdrehung sind die Linien v = c und v = −c in Wahrheit eine einzige Kurve, denn nach einer Runde wird aus v gerade −v. Ein Schnitt entlang dieser Kurve lässt immer ein schmaleres Möbius-Band in der Mitte (bernsteinfarben) und ein langes zweiseitiges Band drumherum übrig, und beide sind ineinander verhakt. Die Voreinstellung 1/3 ist die klassische Variante mit drei gleich breiten Streifen. Die Voreinstellung «Mittellinie» ist ein anderes Experiment: ein einziger Schnitt entlang v = 0, der sich nach einer Runde schließt. Übrig bleibt ein Stück, ein zweiseitiges, doppelt so langes Band mit zwei vollen Drehungen, hier mit einem schmalen Spalt gezeichnet. Die Ergebniszeilen unter den Voreinstellungen gelten für eine Halbdrehung und werden bei anderen Werten ausgeblendet.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Hier steckt keine 3D-Bibliothek dahinter. Die Seite tastet die Fläche auf einem Gitter ab (160 × 16 Vierecke für das Band, 120 × 36 für die Flasche), teilt jedes Viereck in zwei Dreiecke, dreht die Ecken um die x-, y- und z-Achse und projiziert sie mit einer einfachen perspektivischen Division auf ein 2D-Canvas. Die Kamera steht beim Band 4,5 Einheiten entfernt, bei der Flasche 6,5. Danach werden alle Dreiecke nach ihrer mittleren Tiefe sortiert und von hinten nach vorn gemalt, der Maleralgorithmus.",
          "In der Schattierung steckt die eine Entscheidung, die typisch für dieses Thema ist. Eine einseitige Fläche hat keine durchgehende Normale: Folgst du dem Normalenvektor einmal um das Möbius-Band, zeigt er am Ende in die Gegenrichtung. Der Renderer kann also nicht entscheiden, welche Seite vorne ist. Er beleuchtet jedes Dreieck mit dem Betrag des Skalarprodukts aus Normale und Lichtrichtung, beide Seiten bekommen also dieselbe Lambert-Schattierung. Nur die feine Umrisslinie ist je nach Vorzeichen hell oder dunkel, und du kannst zusehen, wie dieses Vorzeichen entlang des Bands umkippt.",
          "Die Farbe verläuft entlang der Länge statt über die Seiten: Rot bei u = 0, Blau kurz vor 2π. Dort, wo sich das Band schließt, siehst du deshalb einen harten Farbwechsel. Diese Naht markiert nur, wo die Parametrisierung neu beginnt, sie ist keine Eigenschaft der Fläche.",
        ],
        code: MOBIUS_EXCERPT,
      },
      {
        heading: "Die Klein-Flasche",
        paragraphs: [
          "Klebst du zwei Möbius-Bänder entlang ihrer Kanten zusammen, entsteht eine Klein-Flasche: eine geschlossene Fläche ganz ohne Rand und trotzdem mit nur einer Seite. Wie das Band hat sie die Euler-Charakteristik 0. Im vierdimensionalen Raum lässt sie sich bauen, ohne sich selbst zu berühren, im gewöhnlichen dreidimensionalen Raum muss jede geschlossene einseitige Fläche sich aber selbst durchdringen. Der Explorer nutzt die sogenannte Achter-Immersion mit a = 2: Ein Querschnitt in Form einer Acht wird um einen Kreis geführt und dreht sich dabei um eine halbe Umdrehung. Die Fläche schneidet sich selbst entlang des Kreises mit Radius 2 in der Ebene z = 0.",
        ],
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Der einzigen Kante folgen",
        text: "Bleib bei einer Halbdrehung, schalte die Auto-Rotation aus und zieh langsam. Folge dem äußeren Rand mit den Augen: Er läuft zweimal herum, bevor er sich wieder trifft. Mit 2 Halbdrehungen gibt es zwei getrennte Ränder.",
      },
      {
        title: "Der Schnitt in Drittel",
        text: "Drück die Voreinstellung 1/3 und dann «Schnitt öffnen». Das bernsteinfarbene mittlere Drittel ist ein schmaleres Möbius-Band, der äußere Teil ein langes Band, und die beiden lassen sich nicht trennen, ohne noch einmal zu schneiden. Drück danach «Mittellinie»: Der Spalt läuft einmal ganz herum, und trotzdem bleibt das Band ein Stück.",
      },
      {
        title: "Ungerade gegen gerade",
        text: "Geh bei Breite 0,5 nacheinander 1, 2, 3, 4 und 5 Halbdrehungen durch. 3 und 5 verhalten sich wie 1 (eine Seite, eine Kante), 2 und 4 sind verkleidete zweiseitige Zylinder.",
      },
      {
        title: "Die Selbstdurchdringung finden",
        text: "Wechsle zur Klein-Flasche und senk die Geschwindigkeit auf etwa 0,15. Beobachte die Mitte der Form: Die Röhre läuft entlang eines Rings durch sich selbst hindurch, der Preis dafür, ein vierdimensionales Objekt in drei Dimensionen zu zeigen.",
      },
    ],
  },
};
