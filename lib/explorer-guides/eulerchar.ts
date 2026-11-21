import type { ExplorerGuide } from "./types";

// Counts quoted here (cube 8/12/6, icosphere 162/480/320, torus 180/360/180,
// the double torus 220/444/222 as a connected sum of two 14×8 tori, the
// 200-element reveal cap) follow from the builders in lib/eulerchar/meshes.ts
// and from app/eulerchar/explorer/page.tsx; update them together.
const EDGES_EXCERPT = `// Derive an edge list from a face list: every adjacent pair of vertices
// in a face is an edge, deduplicated so that {a, b} == {b, a}.
function edgesFromFaces(faces: ReadonlyArray<ReadonlyArray<number>>) {
  const seen = new Set<string>();
  const out: Array<readonly [number, number]> = [];
  for (const face of faces) {
    for (let i = 0; i < face.length; i++) {
      const a = face[i];
      const b = face[(i + 1) % face.length];
      const key = a < b ? \`\${a}-\${b}\` : \`\${b}-\${a}\`;
      if (!seen.has(key)) {
        seen.add(key);
        out.push(a < b ? [a, b] : [b, a]);
      }
    }
  }
  return out;
}`;

export const EULERCHAR_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Count vertices, edges and faces on spinning polyhedra, a torus and a subdivided sphere, and see why the Euler characteristic V − E + F stays 2 or drops to 0.",
    heading: "How this explorer works",
    intro:
      "A shape spins in the middle of the canvas. Press the three step buttons in order and the explorer counts its pieces for you: first the corners light up in amber, then the edges are traced one after another, then the faces fill in with shading. The panel in the corner keeps a running tally, and when all three counts are in, it shows the alternating sum V − E + F. For every shape that is deformable into a sphere, from the four-faced tetrahedron to a sphere made of 320 triangles, the answer is the same: 2.",
    sections: [
      {
        heading: "A number that ignores size and shape",
        paragraphs: [
          "Take any convex polyhedron, count its vertices V, edges E and faces F, and form V − E + F. A cube gives 8 − 12 + 6 = 2, an icosahedron 12 − 30 + 20 = 2, the soccer-ball shape 60 − 90 + 32 = 2. Leonhard Euler stated this in the 1750s, and the value is now called the Euler characteristic χ (chi).",
          "The reason it never changes is that χ is a property of the surface, not of how you cut it into pieces. Split a face in two with a new edge between existing corners and both E and F go up by one. Put a new vertex in the middle of an edge and both V and E go up by one. Every refinement changes the sum by zero. What does change χ is topology: each handle, or hole through the shape, lowers it by 2. For a closed orientable surface with g handles the formula below holds, so a sphere has χ = 2 and a torus χ = 0.",
        ],
        formula: "V - E + F = \\chi = 2 - 2g",
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "The Polyhedron list holds eleven presets: the five Platonic solids, the truncated tetrahedron, the cuboctahedron, the truncated icosahedron, an icosphere, a torus and a double torus. Each entry shows its counts so you can compare them at a glance. The page starts on the cube.",
          "Count vertices, Count edges and Count faces each run one counting stage. Small shapes reveal one element every 60 milliseconds; large meshes reveal in chunks every 20 milliseconds and stop the animation after 200 elements, scaling the tally up to the true count so you are not waiting for 480 edges one by one. Reveal all jumps straight to the finished state, and Reset clears the tally. Auto-spin rotates the shape continuously; its speed slider runs from 0 to 2 (default 0.6), and switching Auto-spin off freezes the shape in its current orientation. If your system asks for reduced motion, the shape stays still and Auto-spin is disabled, while the counting steps keep working.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "There is no 3D library. Each shape is a list of vertex coordinates and a list of faces, where a face is a cycle of vertex indices. The edge list is derived from the faces by the function below, so E is never typed in by hand: it is whatever the faces imply, and the counts on screen are the true counts of the mesh. The Platonic and Archimedean solids use their standard coordinates (several involve the golden ratio), scaled to fit a unit sphere.",
          "Every frame rotates all vertices about the vertical axis and then the horizontal axis, and projects them in perspective with the camera 3.2 units away. Faces are sorted from far to near and painted in that order (the painter's algorithm), faces turned away from the camera are skipped, and each visible face is shaded by the angle between its normal and a fixed light direction, with a minimum brightness so nothing goes completely black.",
          "The icosphere starts from the icosahedron and splits every triangle into four, twice, pushing the new midpoints out onto the sphere. The torus is a grid of 18 by 10 quadrilaterals wrapped around in both directions.",
        ],
        code: EDGES_EXCERPT,
      },
      {
        heading: "What the counts reveal",
        paragraphs: [
          "Subdividing every triangle adds one vertex per old edge, turns each edge into two plus three new ones per face, and quadruples the faces. The changes cancel, which is why the icosphere lands on 162 − 480 + 320 = 2, exactly like the icosahedron it came from. The torus grid has as many vertices as faces and twice as many edges, so it gives 180 − 360 + 180 = 0.",
          "The double-torus preset shows what a second handle costs. It is a connected sum: two torus grids of 14 by 8 quadrilaterals each lose one face (each drops to χ = −1), and the two holes are glued together along their four boundary edges. A circle has χ = 0, so gluing along one changes nothing: the result is −2, matching 2 − 2·2. The mesh counts agree: 220 − 444 + 222 = −2.",
          "The same formula explains the soccer ball. If a polyhedron is made only of pentagons and hexagons with three faces at every corner, χ = 2 forces exactly 12 pentagons, however many hexagons there are.",
        ],
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "Dual pairs",
        text: "Count the cube (8, 12, 6), then the octahedron (6, 12, 8). V and F swap while E stays the same. The dodecahedron (20, 30, 12) and icosahedron (12, 30, 20) are another such pair.",
      },
      {
        title: "Refine without changing χ",
        text: "Compare the icosahedron with the icosphere. The icosphere has more than ten times as many vertices, edges and faces, yet both sums land on 2. Turn Auto-spin off and look at how the original twelve corners still sit where five triangles meet.",
      },
      {
        title: "A handle costs two",
        text: "Pick the torus and press Reveal all. The tally shows 180 − 360 + 180 = 0. Every vertex has four edges and every face has four sides, and that balance is exactly what a single handle produces.",
      },
      {
        title: "Count the pentagons",
        text: "Choose the truncated icosahedron and run the face stage. Of the 32 faces, 12 are pentagons and 20 are hexagons. Try to imagine a closed ball of pentagons and hexagons, three at each corner, with 11 or 13 pentagons: χ = 2 rules it out.",
      },
    ],
  },
  de: {
    metaDescription:
      "Ecken, Kanten und Flächen an rotierenden Polyedern, einem Torus und einer Ikosphäre zählen und sehen, warum die Euler-Charakteristik V − E + F bei 2 bleibt.",
    heading: "So funktioniert dieser Explorer",
    intro:
      "In der Mitte des Canvas dreht sich eine Form. Drückst du die drei Schritt-Knöpfe der Reihe nach, zählt der Explorer ihre Teile für dich: Zuerst leuchten die Ecken bernsteinfarben auf, dann werden die Kanten eine nach der anderen nachgezogen, schließlich füllen sich die Flächen mit Schattierung. Das Feld in der Ecke führt eine laufende Strichliste, und sind alle drei Zahlen da, zeigt es die Wechselsumme V − E + F. Für jede Form, die sich zu einer Kugel verformen lässt, vom Tetraeder mit vier Flächen bis zur Kugel aus 320 Dreiecken, ist das Ergebnis dasselbe: 2.",
    sections: [
      {
        heading: "Eine Zahl, der Größe und Form egal sind",
        paragraphs: [
          "Nimm ein beliebiges konvexes Polyeder, zähle Ecken V, Kanten E und Flächen F und bilde V − E + F. Der Würfel ergibt 8 − 12 + 6 = 2, das Ikosaeder 12 − 30 + 20 = 2, die Fußballform 60 − 90 + 32 = 2. Leonhard Euler formulierte das in den 1750er-Jahren, und der Wert heißt heute Euler-Charakteristik χ (Chi).",
          "Sie ändert sich nie, weil χ eine Eigenschaft der Fläche ist und nicht davon abhängt, wie man sie in Stücke schneidet. Teilst du eine Fläche durch eine neue Kante zwischen vorhandenen Ecken, steigen E und F um eins. Setzt du eine neue Ecke mitten auf eine Kante, steigen V und E um eins. Jede Verfeinerung ändert die Summe um null. Was χ verändert, ist die Topologie: Jeder Henkel, also jedes Loch durch die Form, senkt den Wert um 2. Für eine geschlossene orientierbare Fläche mit g Henkeln gilt die Formel unten, eine Kugel hat also χ = 2 und ein Torus χ = 0.",
        ],
        formula: "V - E + F = \\chi = 2 - 2g",
      },
      {
        heading: "Was die Regler bewirken",
        paragraphs: [
          "Die Polyederliste enthält elf Voreinstellungen: die fünf platonischen Körper, das abgestumpfte Tetraeder, das Kuboktaeder, das abgestumpfte Ikosaeder, eine Ikosphäre, einen Torus und einen Doppeltorus. Jeder Eintrag zeigt seine Zahlen, damit du sie auf einen Blick vergleichen kannst. Die Seite startet mit dem Würfel.",
          "«Ecken zählen», «Kanten zählen» und «Flächen zählen» starten je eine Zählstufe. Kleine Formen zeigen alle 60 Millisekunden ein neues Element. Große Netze zeigen alle 20 Millisekunden einen ganzen Schwung und beenden die Animation nach 200 Elementen, die Strichliste wird dabei auf die echte Zahl hochgerechnet, damit du nicht auf 480 einzelne Kanten warten musst. «Alles zeigen» springt direkt zum fertigen Zustand, «Zurücksetzen» leert die Liste. «Auto-Rotation» lässt die Form kreisen, der Geschwindigkeitsregler reicht von 0 bis 2 (Standard 0,6), und schaltest du sie aus, bleibt die Form in ihrer aktuellen Lage stehen. Verlangt dein System reduzierte Bewegung, steht die Form still und die Auto-Rotation ist deaktiviert, die Zählschritte funktionieren weiter.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Eine 3D-Bibliothek gibt es nicht. Jede Form ist eine Liste von Eckkoordinaten und eine Liste von Flächen, wobei eine Fläche ein Zyklus von Eckindizes ist. Die Kantenliste wird mit der Funktion unten aus den Flächen abgeleitet, E wird also nie von Hand eingetragen: Es ist genau das, was die Flächen ergeben, und die Zahlen auf dem Bildschirm sind die echten Zahlen des Netzes. Die platonischen und archimedischen Körper verwenden ihre Standardkoordinaten (bei einigen steckt der Goldene Schnitt darin), skaliert auf eine Einheitskugel.",
          "In jedem Frame werden alle Ecken um die senkrechte und dann um die waagrechte Achse gedreht und perspektivisch projiziert, die Kamera steht 3,2 Einheiten entfernt. Die Flächen werden von hinten nach vorn sortiert und in dieser Reihenfolge gemalt (Maleralgorithmus), Flächen mit der Rückseite zur Kamera werden übersprungen, und jede sichtbare Fläche wird nach dem Winkel zwischen ihrer Normalen und einer festen Lichtrichtung schattiert, mit einer Mindesthelligkeit, damit nichts ganz schwarz wird.",
          "Die Ikosphäre entsteht aus dem Ikosaeder, indem jedes Dreieck zweimal hintereinander in vier geteilt wird. Die neuen Mittelpunkte werden dabei auf die Kugel hinausgeschoben. Der Torus ist ein Gitter aus 18 mal 10 Vierecken, das in beide Richtungen ringsum geschlossen ist.",
        ],
        code: EDGES_EXCERPT,
      },
      {
        heading: "Was die Zahlen verraten",
        paragraphs: [
          "Beim Unterteilen kommt pro alter Kante eine Ecke dazu, jede Kante wird zu zwei, pro Fläche entstehen drei neue Kanten, und die Zahl der Flächen vervierfacht sich. Die Änderungen heben sich auf, deshalb landet die Ikosphäre bei 162 − 480 + 320 = 2, genau wie das Ikosaeder, aus dem sie entstanden ist. Das Torusgitter hat so viele Ecken wie Flächen und doppelt so viele Kanten, ergibt also 180 − 360 + 180 = 0.",
          "Die Voreinstellung Doppeltorus zeigt, was ein zweiter Henkel kostet. Sie ist eine zusammenhängende Summe: Zwei Torusgitter aus je 14 mal 8 Vierecken verlieren je eine Fläche (jedes sinkt auf χ = −1), und die beiden Löcher werden entlang ihrer vier Randkanten verklebt. Ein Kreis hat χ = 0, das Kleben entlang eines Kreises ändert also nichts: Das Ergebnis ist −2, passend zu 2 − 2·2. Das Netz zählt genau das: 220 − 444 + 222 = −2.",
          "Dieselbe Formel erklärt den Fußball. Besteht ein Polyeder nur aus Fünf- und Sechsecken, und treffen an jeder Ecke drei Flächen zusammen, erzwingt χ = 2 genau 12 Fünfecke, egal wie viele Sechsecke es gibt.",
        ],
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Duale Paare",
        text: "Zähle den Würfel (8, 12, 6), dann das Oktaeder (6, 12, 8). V und F tauschen die Plätze, E bleibt gleich. Dodekaeder (20, 30, 12) und Ikosaeder (12, 30, 20) sind ein weiteres solches Paar.",
      },
      {
        title: "Verfeinern, ohne χ zu ändern",
        text: "Vergleiche das Ikosaeder mit der Ikosphäre. Die Ikosphäre hat mehr als zehnmal so viele Ecken, Kanten und Flächen, trotzdem landen beide Summen bei 2. Schalte die Drehung aus und schau, wie die ursprünglichen zwölf Ecken immer noch dort sitzen, wo fünf Dreiecke zusammentreffen.",
      },
      {
        title: "Ein Henkel kostet zwei",
        text: "Wähle den Torus und drück «Alles zeigen». Die Strichliste zeigt 180 − 360 + 180 = 0. Jede Ecke hat vier Kanten und jede Fläche vier Seiten, und genau dieses Gleichgewicht erzeugt ein einzelner Henkel.",
      },
      {
        title: "Zähl die Fünfecke",
        text: "Nimm das abgestumpfte Ikosaeder und lass die Flächenstufe laufen. Von den 32 Flächen sind 12 Fünfecke und 20 Sechsecke. Versuch dir einen geschlossenen Ball aus Fünf- und Sechsecken mit drei Flächen an jeder Ecke vorzustellen, der 11 oder 13 Fünfecke hat: χ = 2 schließt das aus.",
      },
    ],
  },
};
