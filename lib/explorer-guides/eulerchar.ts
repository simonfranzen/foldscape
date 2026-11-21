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

// The same in every locale.
const CHI_FORMULA = "V - E + F = \\chi = 2 - 2g";

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
        formula: CHI_FORMULA,
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
        formula: CHI_FORMULA,
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
  es: {
    metaDescription:
      "Cuenta vértices, aristas y caras en poliedros que giran, un toro y una esfera subdividida, y descubre por qué la característica de Euler vale 2 o cae a 0.",
    heading: "Cómo funciona este explorador",
    intro:
      "Una figura gira en el centro del lienzo. Pulsa en orden los tres botones de paso y el explorador cuenta sus piezas por ti: primero se encienden las esquinas en ámbar, luego se trazan las aristas una tras otra y después las caras se rellenan con sombreado. El panel de la esquina lleva la cuenta, y cuando están los tres recuentos muestra la suma alternada V − E + F. Para toda figura que se puede deformar hasta una esfera, desde el tetraedro de cuatro caras hasta una esfera hecha de 320 triángulos, la respuesta es la misma: 2.",
    sections: [
      {
        heading: "Un número al que no le importan el tamaño ni la forma",
        paragraphs: [
          "Toma cualquier poliedro convexo, cuenta sus vértices V, sus aristas E y sus caras F, y calcula V − E + F. Un cubo da 8 − 12 + 6 = 2, un icosaedro 12 − 30 + 20 = 2, la forma del balón de fútbol 60 − 90 + 32 = 2. Leonhard Euler lo enunció en la década de 1750, y ese valor se llama hoy característica de Euler χ (ji).",
          "La razón de que nunca cambie es que χ es una propiedad de la superficie, no de cómo la cortas en piezas. Divide una cara en dos con una arista nueva entre esquinas existentes y tanto E como F suben en uno. Pon un vértice nuevo en medio de una arista y tanto V como E suben en uno. Todo refinamiento cambia la suma en cero. Lo que sí cambia χ es la topología: cada asa, o agujero que atraviesa la figura, la reduce en 2. Para una superficie cerrada y orientable con g asas vale la fórmula de abajo, así que una esfera tiene χ = 2 y un toro χ = 0.",
        ],
        formula: CHI_FORMULA,
      },
      {
        heading: "Qué hacen los controles",
        paragraphs: [
          "La lista «Poliedro» contiene once figuras predefinidas: los cinco sólidos platónicos, el tetraedro truncado, el cuboctaedro, el icosaedro truncado, una icosfera, un toro y un doble toro. Cada entrada muestra sus recuentos para que puedas compararlos de un vistazo. La página empieza con el cubo.",
          "«Contar vértices», «Contar aristas» y «Contar caras» ejecutan cada uno una etapa del recuento. Las figuras pequeñas revelan un elemento cada 60 milisegundos; las mallas grandes revelan por bloques cada 20 milisegundos y detienen la animación tras 200 elementos, escalando la cuenta hasta el número real para que no tengas que esperar 480 aristas una por una. «Mostrar todo» salta directamente al estado final, y «Restablecer» borra la cuenta. «Auto-rotación» hace girar la figura de forma continua; su deslizador de velocidad va de 0 a 2 (por defecto 0,6), y desactivar «Auto-rotación» congela la figura en su orientación actual. Si tu sistema pide movimiento reducido, la figura se queda quieta y «Auto-rotación» está desactivada, mientras que los pasos de recuento siguen funcionando.",
        ],
      },
      {
        heading: "Cómo está construido",
        paragraphs: [
          "No hay ninguna biblioteca 3D. Cada figura es una lista de coordenadas de vértices y una lista de caras, donde una cara es un ciclo de índices de vértices. La lista de aristas se deduce de las caras con la función de abajo, así que E nunca se escribe a mano: es lo que implican las caras, y los recuentos en pantalla son los recuentos reales de la malla. Los sólidos platónicos y arquimedianos usan sus coordenadas estándar (varias incluyen la proporción áurea), escaladas para caber en una esfera unidad.",
          "Cada fotograma rota todos los vértices alrededor del eje vertical y luego del horizontal, y los proyecta en perspectiva con la cámara a 3,2 unidades de distancia. Las caras se ordenan de lejos a cerca y se pintan en ese orden (el algoritmo del pintor), las caras que dan la espalda a la cámara se omiten, y cada cara visible se sombrea según el ángulo entre su normal y una dirección de luz fija, con un brillo mínimo para que nada quede del todo negro.",
          "La icosfera parte del icosaedro y divide cada triángulo en cuatro, dos veces, empujando los nuevos puntos medios hacia fuera hasta la esfera. El toro es una cuadrícula de 18 por 10 cuadriláteros enrollada en ambas direcciones.",
        ],
        code: EDGES_EXCERPT,
      },
      {
        heading: "Qué revelan los recuentos",
        paragraphs: [
          "Subdividir cada triángulo añade un vértice por cada arista antigua, convierte cada arista en dos más tres nuevas por cara, y cuadruplica las caras. Los cambios se cancelan, y por eso la icosfera acaba en 162 − 480 + 320 = 2, exactamente igual que el icosaedro del que salió. La cuadrícula del toro tiene tantos vértices como caras y el doble de aristas, así que da 180 − 360 + 180 = 0.",
          "El doble toro muestra lo que cuesta una segunda asa. Es una suma conexa: dos cuadrículas de toro de 14 por 8 cuadriláteros pierden cada una una cara (cada una baja a χ = −1), y los dos agujeros se pegan entre sí a lo largo de sus cuatro aristas de borde. Una circunferencia tiene χ = 0, así que pegar a lo largo de una no cambia nada: el resultado es −2, que coincide con 2 − 2·2. Los recuentos de la malla concuerdan: 220 − 444 + 222 = −2.",
          "La misma fórmula explica el balón de fútbol. Si un poliedro está hecho solo de pentágonos y hexágonos con tres caras en cada esquina, χ = 2 obliga a que haya exactamente 12 pentágonos, sea cual sea el número de hexágonos.",
        ],
      },
    ],
    experimentsHeading: "Prueba esto",
    experiments: [
      {
        title: "Parejas duales",
        text: "Cuenta el cubo (8, 12, 6) y luego el octaedro (6, 12, 8). V y F se intercambian mientras E se queda igual. El dodecaedro (20, 30, 12) y el icosaedro (12, 30, 20) forman otra pareja así.",
      },
      {
        title: "Refina sin cambiar χ",
        text: "Compara el icosaedro con la icosfera. La icosfera tiene más de diez veces más vértices, aristas y caras, y aun así las dos sumas dan 2. Desactiva «Auto-rotación» y fíjate en que las doce esquinas originales siguen estando donde se juntan cinco triángulos.",
      },
      {
        title: "Un asa cuesta dos",
        text: "Elige el toro y pulsa «Mostrar todo». La cuenta muestra 180 − 360 + 180 = 0. Cada vértice tiene cuatro aristas y cada cara tiene cuatro lados, y ese equilibrio es justo lo que produce una sola asa.",
      },
      {
        title: "Cuenta los pentágonos",
        text: "Escoge el icosaedro truncado y ejecuta la etapa de las caras. De las 32 caras, 12 son pentágonos y 20 son hexágonos. Intenta imaginar un balón cerrado de pentágonos y hexágonos, tres en cada esquina, con 11 o 13 pentágonos: χ = 2 lo descarta.",
      },
    ],
  },
  fr: {
    metaDescription:
      "Compte sommets, arêtes et faces sur des polyèdres en rotation, un tore et une sphère subdivisée, et vois pourquoi la caractéristique d'Euler vaut 2 ou 0.",
    heading: "Comment fonctionne cet explorateur",
    intro:
      "Une forme tourne au milieu du canevas. Appuie dans l'ordre sur les trois boutons d'étape et l'explorateur compte ses éléments pour toi : d'abord les sommets s'allument en ambre, puis les arêtes sont tracées l'une après l'autre, puis les faces se remplissent d'un ombrage. Le panneau dans le coin tient le compte, et quand les trois décomptes sont faits, il affiche la somme alternée V − E + F. Pour toute forme qui peut se déformer en sphère, du tétraèdre à quatre faces jusqu'à une sphère faite de 320 triangles, la réponse est la même : 2.",
    sections: [
      {
        heading: "Un nombre indifférent à la taille et à la forme",
        paragraphs: [
          "Prends n'importe quel polyèdre convexe, compte ses sommets V, ses arêtes E et ses faces F, puis calcule V − E + F. Un cube donne 8 − 12 + 6 = 2, un icosaèdre 12 − 30 + 20 = 2, la forme du ballon de football 60 − 90 + 32 = 2. Leonhard Euler l'a énoncé dans les années 1750, et cette valeur s'appelle aujourd'hui la caractéristique d'Euler χ (khi).",
          "Si elle ne change jamais, c'est que χ est une propriété de la surface, et non de la façon dont on la découpe. Coupe une face en deux par une nouvelle arête entre deux sommets existants : E et F augmentent chacun de un. Place un nouveau sommet au milieu d'une arête : V et E augmentent chacun de un. Tout raffinement modifie la somme de zéro. Ce qui change χ, c'est la topologie : chaque anse, ou trou traversant la forme, la fait baisser de 2. Pour une surface fermée orientable à g anses, la formule ci-dessous s'applique, si bien qu'une sphère a χ = 2 et un tore χ = 0.",
        ],
        formula: CHI_FORMULA,
      },
      {
        heading: "À quoi servent les commandes",
        paragraphs: [
          "La liste « Polyèdre » contient onze formes prédéfinies : les cinq solides de Platon, le tétraèdre tronqué, le cuboctaèdre, l'icosaèdre tronqué, une icosphère, un tore et un double tore. Chaque entrée affiche ses décomptes pour que tu puisses les comparer d'un coup d'œil. La page démarre sur le cube.",
          "« Compter les sommets », « Compter les arêtes » et « Compter les faces » lancent chacun une étape du décompte. Les petites formes révèlent un élément toutes les 60 millisecondes ; les grands maillages révèlent par paquets toutes les 20 millisecondes et arrêtent l'animation après 200 éléments, en ajustant le compteur au nombre réel pour que tu n'aies pas à attendre 480 arêtes une par une. « Tout afficher » saute directement à l'état final, et « Réinitialiser » efface le compte. « Rotation auto » fait tourner la forme en continu ; son curseur de vitesse va de 0 à 2 (0,6 par défaut), et désactiver « Rotation auto » fige la forme dans son orientation du moment. Si ton système demande la réduction des animations, la forme reste immobile et « Rotation auto » est désactivé, tandis que les étapes de décompte continuent de fonctionner.",
        ],
      },
      {
        heading: "Comment c'est construit",
        paragraphs: [
          "Il n'y a aucune bibliothèque 3D. Chaque forme est une liste de coordonnées de sommets et une liste de faces, une face étant un cycle d'indices de sommets. La liste des arêtes est déduite des faces par la fonction ci-dessous, donc E n'est jamais saisi à la main : c'est ce que les faces impliquent, et les décomptes à l'écran sont les vrais décomptes du maillage. Les solides de Platon et d'Archimède utilisent leurs coordonnées standard (plusieurs font intervenir le nombre d'or), mises à l'échelle pour tenir dans une sphère unité.",
          "Chaque image fait tourner tous les sommets autour de l'axe vertical puis de l'axe horizontal, et les projette en perspective avec la caméra à 3,2 unités de distance. Les faces sont triées de la plus lointaine à la plus proche et peintes dans cet ordre (l'algorithme du peintre), les faces tournées à l'opposé de la caméra sont ignorées, et chaque face visible est ombrée selon l'angle entre sa normale et une direction de lumière fixe, avec une luminosité minimale pour que rien ne devienne complètement noir.",
          "L'icosphère part de l'icosaèdre et découpe chaque triangle en quatre, deux fois de suite, en repoussant les nouveaux milieux sur la sphère. Le tore est une grille de 18 par 10 quadrilatères refermée sur elle-même dans les deux directions.",
        ],
        code: EDGES_EXCERPT,
      },
      {
        heading: "Ce que révèlent les décomptes",
        paragraphs: [
          "Subdiviser chaque triangle ajoute un sommet par ancienne arête, transforme chaque arête en deux auxquelles s'ajoutent trois nouvelles par face, et quadruple les faces. Les variations se compensent, et c'est pourquoi l'icosphère aboutit à 162 − 480 + 320 = 2, exactement comme l'icosaèdre dont elle est issue. La grille du tore a autant de sommets que de faces et deux fois plus d'arêtes, elle donne donc 180 − 360 + 180 = 0.",
          "Le double tore montre ce que coûte une seconde anse. C'est une somme connexe : deux grilles de tore de 14 par 8 quadrilatères perdent chacune une face (chacune tombe à χ = −1), et les deux trous sont recollés le long de leurs quatre arêtes de bord. Un cercle a χ = 0, donc recoller le long d'un cercle ne change rien : le résultat est −2, ce qui correspond à 2 − 2·2. Les décomptes du maillage sont d'accord : 220 − 444 + 222 = −2.",
          "La même formule explique le ballon de football. Si un polyèdre n'est fait que de pentagones et d'hexagones avec trois faces à chaque sommet, χ = 2 impose exactement 12 pentagones, quel que soit le nombre d'hexagones.",
        ],
      },
    ],
    experimentsHeading: "À essayer",
    experiments: [
      {
        title: "Paires duales",
        text: "Compte le cube (8, 12, 6), puis l'octaèdre (6, 12, 8). V et F s'échangent tandis que E reste identique. Le dodécaèdre (20, 30, 12) et l'icosaèdre (12, 30, 20) forment une autre paire de ce genre.",
      },
      {
        title: "Raffiner sans changer χ",
        text: "Compare l'icosaèdre et l'icosphère. L'icosphère a plus de dix fois plus de sommets, d'arêtes et de faces, et pourtant les deux sommes tombent sur 2. Désactive « Rotation auto » et regarde comment les douze sommets d'origine se trouvent toujours là où cinq triangles se rejoignent.",
      },
      {
        title: "Une anse coûte deux",
        text: "Choisis le tore et appuie sur « Tout afficher ». Le compteur affiche 180 − 360 + 180 = 0. Chaque sommet a quatre arêtes et chaque face a quatre côtés, et cet équilibre est exactement ce que produit une anse unique.",
      },
      {
        title: "Compte les pentagones",
        text: "Choisis l'icosaèdre tronqué et lance l'étape des faces. Sur les 32 faces, 12 sont des pentagones et 20 des hexagones. Essaie d'imaginer un ballon fermé de pentagones et d'hexagones, trois à chaque sommet, avec 11 ou 13 pentagones : χ = 2 l'interdit.",
      },
    ],
  },
  it: {
    metaDescription:
      "Conta vertici, spigoli e facce su poliedri che ruotano, un toro e una sfera suddivisa, e scopri perché la caratteristica di Eulero resta 2 o scende a 0.",
    heading: "Come funziona questo esploratore",
    intro:
      "Una forma ruota al centro del canvas. Premi in ordine i tre pulsanti di passo e l'esploratore conta i suoi pezzi al posto tuo: prima si accendono i vertici in ambra, poi gli spigoli vengono tracciati uno dopo l'altro, poi le facce si riempiono di ombreggiatura. Il pannello nell'angolo tiene il conto, e quando tutti e tre i conteggi sono pronti mostra la somma alternata V − E + F. Per ogni forma che si può deformare in una sfera, dal tetraedro a quattro facce fino a una sfera fatta di 320 triangoli, la risposta è la stessa: 2.",
    sections: [
      {
        heading: "Un numero che ignora dimensione e forma",
        paragraphs: [
          "Prendi un qualsiasi poliedro convesso, conta i suoi vertici V, gli spigoli E e le facce F, e calcola V − E + F. Un cubo dà 8 − 12 + 6 = 2, un icosaedro 12 − 30 + 20 = 2, la forma del pallone da calcio 60 − 90 + 32 = 2. Leonhard Euler lo enunciò negli anni Cinquanta del Settecento, e oggi quel valore si chiama caratteristica di Eulero χ (chi).",
          "Il motivo per cui non cambia mai è che χ è una proprietà della superficie, non del modo in cui la tagli a pezzi. Dividi una faccia in due con un nuovo spigolo tra vertici esistenti e sia E sia F aumentano di uno. Metti un nuovo vertice a metà di uno spigolo e sia V sia E aumentano di uno. Ogni raffinamento cambia la somma di zero. A cambiare χ è invece la topologia: ogni manico, cioè ogni buco che attraversa la forma, la abbassa di 2. Per una superficie chiusa e orientabile con g manici vale la formula qui sotto, quindi una sfera ha χ = 2 e un toro χ = 0.",
        ],
        formula: CHI_FORMULA,
      },
      {
        heading: "Che cosa fanno i controlli",
        paragraphs: [
          "L'elenco «Poliedro» contiene undici forme predefinite: i cinque solidi platonici, il tetraedro troncato, il cubottaedro, l'icosaedro troncato, un'icosfera, un toro e un doppio toro. Ogni voce mostra i suoi conteggi, così puoi confrontarli a colpo d'occhio. La pagina parte dal cubo.",
          "«Conta vertici», «Conta spigoli» e «Conta facce» eseguono ciascuno una fase del conteggio. Le forme piccole rivelano un elemento ogni 60 millisecondi; le mesh grandi rivelano a blocchi ogni 20 millisecondi e fermano l'animazione dopo 200 elementi, portando il conto al numero reale, così non devi aspettare 480 spigoli uno per uno. «Mostra tutto» salta direttamente allo stato finale, e «Reimposta» azzera il conto. «Rotazione auto» fa ruotare la forma in modo continuo; il suo cursore di velocità va da 0 a 2 (predefinito 0,6), e disattivare «Rotazione auto» blocca la forma nell'orientamento corrente. Se il tuo sistema chiede il movimento ridotto, la forma resta ferma e «Rotazione auto» è disattivata, mentre le fasi di conteggio continuano a funzionare.",
        ],
      },
      {
        heading: "Com'è costruito",
        paragraphs: [
          "Non c'è nessuna libreria 3D. Ogni forma è un elenco di coordinate dei vertici e un elenco di facce, dove una faccia è un ciclo di indici di vertici. L'elenco degli spigoli viene ricavato dalle facce con la funzione qui sotto, quindi E non è mai scritto a mano: è quello che le facce implicano, e i conteggi sullo schermo sono i conteggi reali della mesh. I solidi platonici e archimedei usano le loro coordinate standard (parecchie coinvolgono la sezione aurea), scalate per stare in una sfera unitaria.",
          "Ogni fotogramma ruota tutti i vertici attorno all'asse verticale e poi a quello orizzontale, e li proietta in prospettiva con la camera a 3,2 unità di distanza. Le facce vengono ordinate dalla più lontana alla più vicina e dipinte in quell'ordine (l'algoritmo del pittore), le facce rivolte dalla parte opposta alla camera vengono saltate, e ogni faccia visibile è ombreggiata in base all'angolo tra la sua normale e una direzione di luce fissa, con una luminosità minima perché nulla diventi completamente nero.",
          "L'icosfera parte dall'icosaedro e divide ogni triangolo in quattro, per due volte, spingendo i nuovi punti medi verso l'esterno fino alla sfera. Il toro è una griglia di 18 per 10 quadrilateri avvolta su sé stessa in entrambe le direzioni.",
        ],
        code: EDGES_EXCERPT,
      },
      {
        heading: "Che cosa rivelano i conteggi",
        paragraphs: [
          "Suddividere ogni triangolo aggiunge un vertice per ogni vecchio spigolo, trasforma ogni spigolo in due più tre nuovi per faccia, e quadruplica le facce. Le variazioni si annullano, ed ecco perché l'icosfera arriva a 162 − 480 + 320 = 2, esattamente come l'icosaedro da cui è nata. La griglia del toro ha tanti vertici quante facce e il doppio degli spigoli, quindi dà 180 − 360 + 180 = 0.",
          "Il doppio toro mostra quanto costa un secondo manico. È una somma connessa: due griglie toriche di 14 per 8 quadrilateri perdono ciascuna una faccia (ciascuna scende a χ = −1), e i due buchi vengono incollati lungo i loro quattro spigoli di bordo. Una circonferenza ha χ = 0, quindi incollare lungo una circonferenza non cambia nulla: il risultato è −2, in accordo con 2 − 2·2. I conteggi della mesh confermano: 220 − 444 + 222 = −2.",
          "La stessa formula spiega il pallone da calcio. Se un poliedro è fatto solo di pentagoni ed esagoni con tre facce in ogni vertice, χ = 2 impone esattamente 12 pentagoni, quanti che siano gli esagoni.",
        ],
      },
    ],
    experimentsHeading: "Da provare",
    experiments: [
      {
        title: "Coppie duali",
        text: "Conta il cubo (8, 12, 6), poi l'ottaedro (6, 12, 8). V e F si scambiano mentre E resta uguale. Il dodecaedro (20, 30, 12) e l'icosaedro (12, 30, 20) sono un'altra coppia di questo tipo.",
      },
      {
        title: "Raffina senza cambiare χ",
        text: "Confronta l'icosaedro con l'icosfera. L'icosfera ha più di dieci volte tanti vertici, spigoli e facce, eppure entrambe le somme danno 2. Disattiva «Rotazione auto» e osserva come i dodici vertici originali stiano ancora dove si incontrano cinque triangoli.",
      },
      {
        title: "Un manico costa due",
        text: "Scegli il toro e premi «Mostra tutto». Il conto mostra 180 − 360 + 180 = 0. Ogni vertice ha quattro spigoli e ogni faccia ha quattro lati, e questo equilibrio è esattamente ciò che produce un singolo manico.",
      },
      {
        title: "Conta i pentagoni",
        text: "Scegli l'icosaedro troncato ed esegui la fase delle facce. Delle 32 facce, 12 sono pentagoni e 20 sono esagoni. Prova a immaginare un pallone chiuso di pentagoni ed esagoni, tre in ogni vertice, con 11 o 13 pentagoni: χ = 2 lo esclude.",
      },
    ],
  },
  pt: {
    metaDescription:
      "Conta vértices, arestas e faces em poliedros a rodar, num toro e numa esfera subdividida, e vê porque a característica de Euler fica em 2 ou cai para 0.",
    heading: "Como funciona este explorador",
    intro:
      "Uma forma roda no meio da tela. Carrega por ordem nos três botões de passo e o explorador conta as peças por ti: primeiro acendem-se os vértices a âmbar, depois as arestas são traçadas uma a seguir à outra, depois as faces preenchem-se com sombreado. O painel no canto vai fazendo a conta, e quando as três contagens estão feitas mostra a soma alternada V − E + F. Para todas as formas que se podem deformar numa esfera, do tetraedro de quatro faces a uma esfera feita de 320 triângulos, a resposta é a mesma: 2.",
    sections: [
      {
        heading: "Um número que ignora tamanho e forma",
        paragraphs: [
          "Pega em qualquer poliedro convexo, conta os seus vértices V, arestas E e faces F, e calcula V − E + F. Um cubo dá 8 − 12 + 6 = 2, um icosaedro 12 − 30 + 20 = 2, a forma da bola de futebol 60 − 90 + 32 = 2. Leonhard Euler enunciou isto na década de 1750, e o valor chama-se hoje característica de Euler χ (qui).",
          "A razão de nunca mudar é que χ é uma propriedade da superfície, não da maneira como a cortas em peças. Divide uma face em duas com uma aresta nova entre vértices existentes e tanto E como F sobem um. Põe um vértice novo a meio de uma aresta e tanto V como E sobem um. Qualquer refinamento altera a soma em zero. O que muda χ é a topologia: cada asa, ou buraco que atravessa a forma, baixa-a em 2. Para uma superfície fechada e orientável com g asas vale a fórmula abaixo, pelo que uma esfera tem χ = 2 e um toro χ = 0.",
        ],
        formula: CHI_FORMULA,
      },
      {
        heading: "O que fazem os controlos",
        paragraphs: [
          "A lista «Poliedro» tem onze formas predefinidas: os cinco sólidos platónicos, o tetraedro truncado, o cuboctaedro, o icosaedro truncado, uma icosfera, um toro e um toro duplo. Cada entrada mostra as suas contagens para as poderes comparar num relance. A página começa no cubo.",
          "«Contar vértices», «Contar arestas» e «Contar faces» correm cada um uma etapa da contagem. As formas pequenas revelam um elemento a cada 60 milissegundos; as malhas grandes revelam em blocos a cada 20 milissegundos e param a animação ao fim de 200 elementos, ajustando a conta ao número verdadeiro para não ficares à espera de 480 arestas uma a uma. «Mostrar tudo» salta diretamente para o estado final, e «Reiniciar» limpa a conta. «Rotação auto» roda a forma continuamente; o seu cursor de velocidade vai de 0 a 2 (0,6 por omissão), e desligar «Rotação auto» congela a forma na orientação em que está. Se o teu sistema pedir movimento reduzido, a forma fica parada e «Rotação auto» fica desativada, enquanto as etapas de contagem continuam a funcionar.",
        ],
      },
      {
        heading: "Como está construído",
        paragraphs: [
          "Não há nenhuma biblioteca 3D. Cada forma é uma lista de coordenadas de vértices e uma lista de faces, em que uma face é um ciclo de índices de vértices. A lista de arestas é deduzida das faces pela função abaixo, pelo que E nunca é escrito à mão: é aquilo que as faces implicam, e as contagens no ecrã são as contagens verdadeiras da malha. Os sólidos platónicos e arquimedianos usam as suas coordenadas habituais (várias envolvem a razão de ouro), escaladas para caberem numa esfera unitária.",
          "Cada fotograma roda todos os vértices em torno do eixo vertical e depois do horizontal, e projeta-os em perspetiva com a câmara a 3,2 unidades de distância. As faces são ordenadas da mais distante para a mais próxima e pintadas por essa ordem (o algoritmo do pintor), as faces viradas para o lado oposto à câmara são ignoradas, e cada face visível é sombreada pelo ângulo entre a sua normal e uma direção de luz fixa, com um brilho mínimo para que nada fique completamente preto.",
          "A icosfera parte do icosaedro e divide cada triângulo em quatro, duas vezes, empurrando os novos pontos médios para fora até à esfera. O toro é uma grelha de 18 por 10 quadriláteros enrolada nas duas direções.",
        ],
        code: EDGES_EXCERPT,
      },
      {
        heading: "O que as contagens revelam",
        paragraphs: [
          "Subdividir cada triângulo acrescenta um vértice por cada aresta antiga, transforma cada aresta em duas mais três novas por face, e quadruplica as faces. As alterações anulam-se, e é por isso que a icosfera vai dar a 162 − 480 + 320 = 2, exatamente como o icosaedro de onde veio. A grelha do toro tem tantos vértices como faces e o dobro das arestas, por isso dá 180 − 360 + 180 = 0.",
          "O toro duplo mostra quanto custa uma segunda asa. É uma soma conexa: duas grelhas de toro de 14 por 8 quadriláteros perdem cada uma uma face (cada uma desce para χ = −1), e os dois buracos são colados ao longo das suas quatro arestas de fronteira. Uma circunferência tem χ = 0, por isso colar ao longo de uma não muda nada: o resultado é −2, de acordo com 2 − 2·2. As contagens da malha confirmam: 220 − 444 + 222 = −2.",
          "A mesma fórmula explica a bola de futebol. Se um poliedro for feito só de pentágonos e hexágonos com três faces em cada vértice, χ = 2 obriga a que haja exatamente 12 pentágonos, seja qual for o número de hexágonos.",
        ],
      },
    ],
    experimentsHeading: "Experimenta isto",
    experiments: [
      {
        title: "Pares duais",
        text: "Conta o cubo (8, 12, 6) e depois o octaedro (6, 12, 8). V e F trocam enquanto E fica igual. O dodecaedro (20, 30, 12) e o icosaedro (12, 30, 20) são outro par assim.",
      },
      {
        title: "Refinar sem mudar χ",
        text: "Compara o icosaedro com a icosfera. A icosfera tem mais de dez vezes mais vértices, arestas e faces, e no entanto as duas somas dão 2. Desliga «Rotação auto» e repara como os doze vértices originais continuam onde se encontram cinco triângulos.",
      },
      {
        title: "Uma asa custa dois",
        text: "Escolhe o toro e carrega em «Mostrar tudo». A conta mostra 180 − 360 + 180 = 0. Cada vértice tem quatro arestas e cada face tem quatro lados, e esse equilíbrio é exatamente o que uma única asa produz.",
      },
      {
        title: "Conta os pentágonos",
        text: "Escolhe o icosaedro truncado e corre a etapa das faces. Das 32 faces, 12 são pentágonos e 20 são hexágonos. Tenta imaginar uma bola fechada de pentágonos e hexágonos, três em cada vértice, com 11 ou 13 pentágonos: χ = 2 exclui essa hipótese.",
      },
    ],
  },
  sv: {
    metaDescription:
      "Räkna hörn, kanter och sidor på snurrande polyedrar, en torus och en uppdelad sfär, och se varför Eulerkarakteristiken V − E + F blir 2 eller faller till 0.",
    heading: "Så fungerar den här utforskaren",
    intro:
      "En form snurrar mitt på ytan. Tryck på de tre stegknapparna i tur och ordning, så räknar utforskaren delarna åt dig: först tänds hörnen i bärnsten, sedan ritas kanterna en efter en, och till sist fylls sidorna med skuggning. Panelen i hörnet håller räkningen, och när alla tre antalen är klara visar den den alternerande summan V − E + F. För varje form som kan deformeras till en sfär, från tetraedern med fyra sidor till en sfär av 320 trianglar, blir svaret detsamma: 2.",
    sections: [
      {
        heading: "Ett tal som struntar i storlek och form",
        paragraphs: [
          "Ta vilken konvex polyeder som helst, räkna dess hörn V, kanter E och sidor F och bilda V − E + F. En kub ger 8 − 12 + 6 = 2, en ikosaeder 12 − 30 + 20 = 2, fotbollsformen 60 − 90 + 32 = 2. Leonhard Euler formulerade detta på 1750-talet, och värdet kallas numera Eulerkarakteristiken χ (chi).",
          "Att den aldrig ändras beror på att χ är en egenskap hos ytan, inte hos sättet du delar upp den i bitar. Dela en sida i två med en ny kant mellan befintliga hörn, så ökar både E och F med ett. Sätt ett nytt hörn mitt på en kant, så ökar både V och E med ett. Varje förfining ändrar summan med noll. Det som faktiskt ändrar χ är topologin: varje handtag, alltså hål genom formen, sänker den med 2. För en sluten orienterbar yta med g handtag gäller formeln nedan, så en sfär har χ = 2 och en torus χ = 0.",
        ],
        formula: CHI_FORMULA,
      },
      {
        heading: "Vad reglagen gör",
        paragraphs: [
          "Listan ”Polyeder” innehåller elva förval: de fem platonska kropparna, den stympade tetraedern, kuboktaedern, den stympade ikosaedern, en ikosfär, en torus och en dubbeltorus. Varje post visar sina antal så att du kan jämföra dem med en blick. Sidan börjar med kuben.",
          "”Räkna hörn”, ”Räkna kanter” och ”Räkna sidor” kör var sitt räknesteg. Små former visar ett element var 60:e millisekund. Stora nät visar i klumpar var 20:e millisekund och stoppar animationen efter 200 element, och skalar upp räkningen till det verkliga antalet så att du slipper vänta på 480 kanter en i taget. ”Visa allt” hoppar direkt till det färdiga läget, och ”Återställ” nollställer räkningen. ”Auto-rotation” roterar formen kontinuerligt. Dess hastighetsreglage går från 0 till 2 (standard 0,6), och om du stänger av ”Auto-rotation” fryser formen i sin nuvarande orientering. Om ditt system begär reducerad rörelse står formen still och ”Auto-rotation” är inaktiverad, medan räknestegen fortsätter att fungera.",
        ],
      },
      {
        heading: "Hur den är byggd",
        paragraphs: [
          "Det finns inget 3D-bibliotek. Varje form är en lista med hörnkoordinater och en lista med sidor, där en sida är en cykel av hörnindex. Kantlistan härleds ur sidorna med funktionen nedan, så E skrivs aldrig in för hand: det är vad sidorna innebär, och antalen på skärmen är nätets verkliga antal. De platonska och arkimediska kropparna använder sina standardkoordinater (flera innehåller gyllene snittet), skalade så att de ryms i en enhetssfär.",
          "Varje bildruta roterar alla hörn kring den lodräta axeln och sedan den vågräta, och projicerar dem i perspektiv med kameran 3,2 enheter bort. Sidorna sorteras från fjärran till nära och målas i den ordningen (målaralgoritmen), sidor som är vända bort från kameran hoppas över, och varje synlig sida skuggas efter vinkeln mellan dess normal och en fast ljusriktning, med en lägsta ljusstyrka så att ingenting blir helt svart.",
          "Ikosfären utgår från ikosaedern och delar varje triangel i fyra, två gånger, och trycker ut de nya mittpunkterna till sfären. Torusen är ett rutnät av 18 gånger 10 fyrhörningar som är hoplindat i båda riktningarna.",
        ],
        code: EDGES_EXCERPT,
      },
      {
        heading: "Vad antalen avslöjar",
        paragraphs: [
          "Att dela upp varje triangel lägger till ett hörn per gammal kant, gör varje kant till två plus tre nya per sida, och fyrdubblar antalet sidor. Ändringarna tar ut varandra, och därför hamnar ikosfären på 162 − 480 + 320 = 2, precis som ikosaedern den kom ifrån. Torusens rutnät har lika många hörn som sidor och dubbelt så många kanter, så det ger 180 − 360 + 180 = 0.",
          "Dubbeltorusen visar vad ett andra handtag kostar. Den är en sammanhängande summa: två torusnät med 14 gånger 8 fyrhörningar förlorar var sin sida (vart och ett sjunker till χ = −1), och de två hålen limmas ihop längs sina fyra randkanter. En cirkel har χ = 0, så att limma längs en sådan ändrar ingenting: resultatet är −2, i enlighet med 2 − 2·2. Nätets antal stämmer: 220 − 444 + 222 = −2.",
          "Samma formel förklarar fotbollen. Om en polyeder bara består av femhörningar och sexhörningar med tre sidor i varje hörn, tvingar χ = 2 fram exakt 12 femhörningar, hur många sexhörningar det än finns.",
        ],
      },
    ],
    experimentsHeading: "Testa det här",
    experiments: [
      {
        title: "Duala par",
        text: "Räkna kuben (8, 12, 6) och sedan oktaedern (6, 12, 8). V och F byter plats medan E är oförändrat. Dodekaedern (20, 30, 12) och ikosaedern (12, 30, 20) är ett annat sådant par.",
      },
      {
        title: "Förfina utan att ändra χ",
        text: "Jämför ikosaedern med ikosfären. Ikosfären har mer än tio gånger så många hörn, kanter och sidor, och ändå landar båda summorna på 2. Stäng av ”Auto-rotation” och se hur de tolv ursprungliga hörnen fortfarande sitter där fem trianglar möts.",
      },
      {
        title: "Ett handtag kostar två",
        text: "Välj torusen och tryck på ”Visa allt”. Räkningen visar 180 − 360 + 180 = 0. Varje hörn har fyra kanter och varje sida har fyra kanter runt sig, och den balansen är precis vad ett enda handtag ger.",
      },
      {
        title: "Räkna femhörningarna",
        text: "Välj den stympade ikosaedern och kör steget för sidorna. Av de 32 sidorna är 12 femhörningar och 20 sexhörningar. Försök föreställa dig en sluten boll av femhörningar och sexhörningar, tre i varje hörn, med 11 eller 13 femhörningar: χ = 2 utesluter det.",
      },
    ],
  },
  no: {
    metaDescription:
      "Tell hjørner, kanter og flater på roterende polyedre, en torus og en oppdelt kule, og se hvorfor Euler-karakteristikken V − E + F blir 2 eller faller til 0.",
    heading: "Slik fungerer denne utforskeren",
    intro:
      "En form roterer midt på lerretet. Trykk på de tre stegknappene i rekkefølge, så teller utforskeren delene for deg: først lyser hjørnene opp i rav, så tegnes kantene én etter én, og til slutt fylles flatene med skyggelegging. Panelet i hjørnet fører regnskap, og når alle tre tellingene er inne, viser det den alternerende summen V − E + F. For enhver form som kan deformeres til en kule, fra tetraederet med fire flater til en kule laget av 320 trekanter, er svaret det samme: 2.",
    sections: [
      {
        heading: "Et tall som ikke bryr seg om størrelse og form",
        paragraphs: [
          "Ta et hvilket som helst konvekst polyeder, tell hjørnene V, kantene E og flatene F, og regn ut V − E + F. En terning gir 8 − 12 + 6 = 2, et ikosaeder 12 − 30 + 20 = 2, fotballformen 60 − 90 + 32 = 2. Leonhard Euler formulerte dette på 1750-tallet, og verdien kalles i dag Euler-karakteristikken χ (khi).",
          "Grunnen til at den aldri endrer seg, er at χ er en egenskap ved flaten, ikke ved hvordan du deler den opp i biter. Del en flate i to med en ny kant mellom eksisterende hjørner, og både E og F øker med én. Sett et nytt hjørne midt på en kant, og både V og E øker med én. Enhver forfining endrer summen med null. Det som derimot endrer χ, er topologien: hver hank, altså hvert hull gjennom formen, senker den med 2. For en lukket, orienterbar flate med g hanker gjelder formelen nedenfor, så en kule har χ = 2 og en torus χ = 0.",
        ],
        formula: CHI_FORMULA,
      },
      {
        heading: "Hva kontrollene gjør",
        paragraphs: [
          "Listen «Polyeder» inneholder elleve forhåndsvalg: de fem platonske legemene, det avstumpede tetraederet, kuboktaederet, det avstumpede ikosaederet, en ikosfære, en torus og en dobbeltorus. Hver oppføring viser tellingene sine, slik at du kan sammenligne dem med et blikk. Siden starter med terningen.",
          "«Tell hjørner», «Tell kanter» og «Tell flater» kjører hvert sitt telletrinn. Små former avdekker ett element hvert 60. millisekund. Store nett avdekker i klumper hvert 20. millisekund og stopper animasjonen etter 200 elementer, og skalerer tellingen opp til det sanne antallet, slik at du slipper å vente på 480 kanter én for én. «Vis alt» hopper rett til den ferdige tilstanden, og «Tilbakestill» nullstiller tellingen. «Auto-rotasjon» roterer formen kontinuerlig. Hastighetsglideren går fra 0 til 2 (standard 0,6), og slår du av «Auto-rotasjon», fryser formen i den orienteringen den har. Hvis systemet ditt ber om redusert bevegelse, står formen stille og «Auto-rotasjon» er deaktivert, mens telletrinnene fortsatt virker.",
        ],
      },
      {
        heading: "Hvordan den er bygget",
        paragraphs: [
          "Det finnes ikke noe 3D-bibliotek. Hver form er en liste med hjørnekoordinater og en liste med flater, der en flate er en sykel av hjørneindekser. Kantlisten utledes fra flatene med funksjonen nedenfor, så E skrives aldri inn for hånd: den er det flatene innebærer, og tellingene på skjermen er de sanne tellingene for nettet. De platonske og arkimediske legemene bruker standardkoordinatene sine (flere inneholder det gylne snitt), skalert slik at de får plass i en enhetskule.",
          "Hver bilderute roterer alle hjørnene om den loddrette aksen og deretter den vannrette, og projiserer dem i perspektiv med kameraet 3,2 enheter unna. Flatene sorteres fra fjern til nær og males i den rekkefølgen (maleralgoritmen), flater som vender bort fra kameraet, hoppes over, og hver synlige flate skyggelegges etter vinkelen mellom normalen og en fast lysretning, med en minste lysstyrke slik at ingenting blir helt svart.",
          "Ikosfæren starter fra ikosaederet og deler hver trekant i fire, to ganger, og skyver de nye midtpunktene ut på kula. Torusen er et rutenett av 18 ganger 10 firkanter som er viklet rundt i begge retninger.",
        ],
        code: EDGES_EXCERPT,
      },
      {
        heading: "Hva tellingene avslører",
        paragraphs: [
          "Å dele opp hver trekant legger til ett hjørne per gammel kant, gjør hver kant til to pluss tre nye per flate, og firedobler antall flater. Endringene opphever hverandre, og derfor ender ikosfæren på 162 − 480 + 320 = 2, akkurat som ikosaederet den kom fra. Rutenettet til torusen har like mange hjørner som flater og dobbelt så mange kanter, så det gir 180 − 360 + 180 = 0.",
          "Dobbeltorusen viser hva en ekstra hank koster. Den er en sammenhengende sum: to torusnett med 14 ganger 8 firkanter mister hver sin flate (hvert av dem faller til χ = −1), og de to hullene limes sammen langs de fire randkantene sine. En sirkel har χ = 0, så å lime langs en sirkel endrer ingenting: resultatet er −2, i samsvar med 2 − 2·2. Tellingene for nettet stemmer: 220 − 444 + 222 = −2.",
          "Den samme formelen forklarer fotballen. Hvis et polyeder bare består av femkanter og sekskanter med tre flater i hvert hjørne, tvinger χ = 2 fram nøyaktig 12 femkanter, uansett hvor mange sekskanter det er.",
        ],
      },
    ],
    experimentsHeading: "Prøv dette",
    experiments: [
      {
        title: "Duale par",
        text: "Tell terningen (8, 12, 6) og deretter oktaederet (6, 12, 8). V og F bytter plass, mens E er uendret. Dodekaederet (20, 30, 12) og ikosaederet (12, 30, 20) er et annet slikt par.",
      },
      {
        title: "Forfin uten å endre χ",
        text: "Sammenlign ikosaederet med ikosfæren. Ikosfæren har mer enn ti ganger så mange hjørner, kanter og flater, og likevel ender begge summene på 2. Slå av «Auto-rotasjon» og se hvordan de tolv opprinnelige hjørnene fortsatt sitter der fem trekanter møtes.",
      },
      {
        title: "En hank koster to",
        text: "Velg torusen og trykk «Vis alt». Tellingen viser 180 − 360 + 180 = 0. Hvert hjørne har fire kanter og hver flate har fire sider, og den balansen er nettopp det én enkelt hank gir.",
      },
      {
        title: "Tell femkantene",
        text: "Velg det avstumpede ikosaederet og kjør trinnet for flatene. Av de 32 flatene er 12 femkanter og 20 sekskanter. Prøv å forestille deg en lukket ball av femkanter og sekskanter, tre i hvert hjørne, med 11 eller 13 femkanter: χ = 2 utelukker det.",
      },
    ],
  },
};
