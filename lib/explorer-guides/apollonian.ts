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
        text: "Switch between (−1, 2, 2, 3) and (−6, 11, 14, 15) at depth 3 with labels on. The second packing is less symmetric, and its curvatures grow much faster: the largest at depth 3 is 1847 instead of 323.",
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
  es: {
    metaDescription:
      "Construye el tamiz de Apolonio círculo a círculo: elige un empaquetado entero, sube la profundidad y ve cómo el teorema de Descartes da curvaturas enteras.",
    heading: "Cómo funciona este explorador",
    intro:
      "Empieza con cuatro círculos que se tocan todos entre sí: uno grande por fuera y tres en su interior. Entre ellos quedan huecos triangulares de lados curvos, y en cada uno de esos huecos cabe exactamente un círculo que encaja a la perfección y toca sus tres lados. Coloca ese círculo y a su alrededor aparecen tres huecos más pequeños. Repite sin fin y obtienes el tamiz de Apolonio, un fractal hecho únicamente de círculos. El lienzo lo dibuja hasta la profundidad que elijas; sus etiquetas son curvaturas, los inversos de los radios.",
    sections: [
      {
        heading: "El teorema de los círculos de Descartes",
        paragraphs: [
          "Para cuatro círculos tangentes entre sí hay una única ecuación que relaciona sus curvaturas k = 1/r. Descartes la describió en 1643 en una carta a la princesa Isabel de Bohemia, y es la fórmula del recuadro ámbar que hay sobre el lienzo. El círculo exterior cuenta con signo negativo, porque los demás lo tocan desde dentro. Para el empaquetado por defecto eso da (−1 + 2 + 2 + 3)² = 36 y 2(1 + 4 + 4 + 9) = 36.",
          "Leído como ecuación para k₄, el teorema es cuadrático, así que dados tres círculos tangentes hay dos soluciones: los dos círculos que pueden tocar a los tres. Sus curvaturas suman 2(k₁ + k₂ + k₃). De ahí sale una regla sin ninguna raíz cuadrada: si ya conoces uno de los dos círculos, el otro tiene curvatura",
        ],
        formula: REFLECTION,
      },
      {
        heading: "Por qué cada círculo lleva un número entero",
        paragraphs: [
          "La regla de reflexión anterior solo usa sumas, duplicaciones y restas. Por eso, si las cuatro curvaturas iniciales son enteras, todo círculo que la recursión llegue a añadir tiene también curvatura entera. Los cinco preajustes son empaquetados enteros de este tipo. Activa los valores de curvatura y podrás comprobarlo: en el empaquetado (−1, 2, 2, 3) los primeros círculos nuevos tienen curvaturas 15, 6, 6 y 3, y la siguiente generación trae 38, 35, 23, 14, 11 y más. Qué enteros aparecen es una pregunta abierta y activa de la teoría de números.",
          "Para las posiciones hay una regla análoga. Lagarias, Mallows y Wilks demostraron que la misma fórmula funciona si multiplicas cada curvatura por el centro de su círculo, escrito como número complejo. El explorador usa esa versión compleja una sola vez, para colocar el cuarto círculo semilla, y la versión lineal para todo lo que viene después.",
        ],
        formula: DESCARTES,
      },
      {
        heading: "Qué hacen los controles",
        paragraphs: [
          "Los botones de preajuste eligen las cuatro curvaturas semilla. El primer número es siempre la curvatura negativa del círculo envolvente, y los otros tres pertenecen a los círculos de su interior. La vista se reescala para que el círculo exterior llene siempre el lienzo, sea cual sea su tamaño.",
          "La profundidad de recursión va de 0 a 8 y empieza en 4. La profundidad 0 rellena solo los cuatro huecos originales, lo que da 8 círculos. Cada nivel adicional triplica el número de círculos nuevos, de modo que la profundidad 4 muestra 488 y la profundidad 8 muestra 39 368 para el empaquetado por defecto. En los otros preajustes, algunos de los círculos más profundos quedan por debajo del radio de corte y se omiten, así que sus recuentos a profundidad 8 salen un poco más bajos.",
          "Las opciones de vista activan o desactivan los valores de curvatura (que solo se dibujan dentro de círculos con un radio superior a 14 píxeles), un sombreado de los huecos que siguen vacíos, el coloreado por curvatura y un margen más ancho cuando «Llenar el marco» está desactivado.",
        ],
      },
      {
        heading: "Cómo está construido",
        paragraphs: [
          "La semilla se coloca con geometría elemental: el círculo exterior está en el origen, el segundo lo toca sobre el eje x negativo, el tercero se obtiene intersecando dos condiciones de distancia y el cuarto sale del teorema de Descartes complejo. De los dos centros candidatos, el código se queda con el que mejor toca a los tres círculos padre.",
          "El crecimiento usa una pila explícita en lugar de recursión. Cada entrada describe un hueco mediante los tres círculos que lo delimitan más el cuarto círculo, situado al otro lado. Al reflejar ese cuarto círculo a través del hueco se obtiene el círculo nuevo, que a su vez divide el hueco en tres entradas nuevas. Los círculos con radio inferior a 0,00001 se descartan, y un límite estricto de 60 000 inserciones protege frente a entradas desbocadas.",
          "El dibujo se hace una sola vez cada vez que cambian los círculos o las opciones, no en un bucle de animación, así que no hay nada que frenar para el movimiento reducido. Los colores salen del logaritmo en base 10 de la curvatura: el tono recorre del rosa al violeta, pasando por el ámbar y el cian, a medida que los círculos encogen. Los círculos de menos de 0,4 píxeles en pantalla se omiten.",
        ],
        code: GAP_EXCERPT,
      },
    ],
    experimentsHeading: "Prueba esto",
    experiments: [
      {
        title: "Observa la primera generación",
        text: "Pon la profundidad en 0 y activa los valores de curvatura. Comprueba que los círculos nuevos cumplen 2(k₁ + k₂ + k₃) − k₄: el círculo pequeño entre −1, 2 y 2, opuesto al 3, tiene que ser 2·3 − 3 = 3, la imagen especular de su pareja.",
      },
      {
        title: "Descubre la ley de crecimiento",
        text: "Sube la profundidad paso a paso de 0 a 5 y lee el recuento: 8, 20, 56, 164, 488, 1460. Cada paso añade el triple de círculos que el anterior, porque cada hueco rellenado deja tres nuevos.",
      },
      {
        title: "Encuentra dónde se acaba el espacio",
        text: "Activa «Resaltar huecos triangulares» a profundidad 2 y luego sube la profundidad. El área sombreada encoge deprisa. En el límite se reduce a cero: el conjunto que queda tiene área nula, pero sigue siendo más que una curva, con una dimensión fractal de aproximadamente 1,3.",
      },
      {
        title: "Compara los empaquetados",
        text: "Alterna entre (−1, 2, 2, 3) y (−6, 11, 14, 15) a profundidad 3 con los valores activados. El segundo empaquetado es menos simétrico y sus curvaturas crecen mucho más rápido: la mayor a profundidad 3 es 1847 en lugar de 323.",
      },
    ],
  },
  fr: {
    metaDescription:
      "Baderne d'Apollonius, cercle par cercle : choisis un empilement entier, augmente la profondeur et vois le théorème de Descartes garder chaque courbure entière.",
    heading: "Comment fonctionne cet explorateur",
    intro:
      "Pars de quatre cercles qui se touchent tous mutuellement : un grand à l'extérieur et trois à l'intérieur. Entre eux se trouvent des interstices triangulaires aux côtés courbes, et chacun de ces interstices accueille exactement un cercle qui s'y ajuste parfaitement en touchant ses trois côtés. Place ce cercle, et trois interstices plus petits apparaissent autour de lui. Répète à l'infini et tu obtiens la baderne d'Apollonius, une fractale faite uniquement de cercles. Le canevas la dessine jusqu'à la profondeur que tu choisis ; ses étiquettes sont des courbures, c'est-à-dire les inverses des rayons.",
    sections: [
      {
        heading: "Le théorème des cercles de Descartes",
        paragraphs: [
          "Pour quatre cercles mutuellement tangents, une seule équation relie leurs courbures k = 1/r. Descartes l'a décrite en 1643 dans une lettre à la princesse Élisabeth de Bohême, et c'est la formule affichée dans l'encadré ambre au-dessus du canevas. Le cercle extérieur compte avec un signe négatif, parce que les autres le touchent de l'intérieur. Pour l'empilement par défaut, cela donne (−1 + 2 + 2 + 3)² = 36 et 2(1 + 4 + 4 + 9) = 36.",
          "Lu comme une équation en k₄, le théorème est quadratique : étant donné trois cercles tangents, il y a donc deux solutions, les deux cercles capables de toucher les trois. La somme de leurs courbures vaut 2(k₁ + k₂ + k₃). On en tire une règle sans aucune racine carrée : si tu connais déjà l'un des deux cercles, l'autre a pour courbure",
        ],
        formula: REFLECTION,
      },
      {
        heading: "Pourquoi chaque cercle porte un nombre entier",
        paragraphs: [
          "La règle de réflexion ci-dessus n'utilise que l'addition, le doublement et la soustraction. Si les quatre courbures de départ sont entières, chaque cercle que la récursion ajoutera a donc lui aussi une courbure entière. Les cinq préréglages sont tous des empilements entiers de ce type. Affiche les courbures et tu peux le vérifier : dans l'empilement (−1, 2, 2, 3), les premiers nouveaux cercles ont pour courbures 15, 6, 6 et 3, et la génération suivante apporte 38, 35, 23, 14, 11 et d'autres encore. Savoir quels entiers apparaissent est une question de recherche active en théorie des nombres.",
          "Il existe une règle analogue pour les positions. Lagarias, Mallows et Wilks ont montré que la même formule fonctionne si l'on multiplie chaque courbure par le centre de son cercle, écrit comme un nombre complexe. L'explorateur utilise cette version complexe une seule fois, pour placer le quatrième cercle germe, puis la version linéaire pour tout le reste.",
        ],
        formula: DESCARTES,
      },
      {
        heading: "À quoi servent les commandes",
        paragraphs: [
          "Les boutons d'empilement prédéfini choisissent les quatre courbures de départ. Le premier nombre est toujours la courbure négative du cercle englobant, les trois autres appartiennent aux cercles qu'il contient. La vue se remet à l'échelle pour que le cercle extérieur remplisse toujours le canevas, quelle que soit sa taille.",
          "La profondeur de récursion va de 0 à 8 et démarre à 4. La profondeur 0 ne remplit que les quatre interstices d'origine, ce qui donne 8 cercles. Chaque niveau supplémentaire triple le nombre de nouveaux cercles : la profondeur 4 en montre donc 488 et la profondeur 8 en montre 39 368 pour l'empilement par défaut. Pour les autres préréglages, quelques-uns des cercles les plus profonds passent sous le rayon de coupure et sont ignorés, si bien que leurs totaux à la profondeur 8 sont un peu plus faibles.",
          "Les options d'affichage activent ou désactivent les courbures (dessinées seulement dans les cercles dont le rayon dépasse 14 pixels), un ombrage des interstices encore vides, la coloration selon la courbure et une marge plus large quand « Remplir le cadre » est désactivé.",
        ],
      },
      {
        heading: "Comment c'est construit",
        paragraphs: [
          "Le germe est placé par de la géométrie élémentaire : le cercle extérieur est à l'origine, le deuxième le touche sur la partie négative de l'axe des x, le troisième s'obtient par l'intersection de deux conditions de distance, et le quatrième vient du théorème de Descartes complexe. Entre les deux centres candidats, le code garde celui qui touche le mieux les trois cercles parents.",
          "La croissance passe par une pile explicite plutôt que par la récursion. Chaque entrée décrit un interstice par ses trois cercles frontières, plus le quatrième cercle situé de l'autre côté. Réfléchir ce quatrième cercle à travers l'interstice donne le nouveau cercle, qui divise ensuite l'interstice en trois nouvelles entrées. Les cercles de rayon inférieur à 0,00001 sont écartés, et une limite stricte de 60 000 insertions protège contre les entrées qui s'emballent.",
          "Le dessin se fait une seule fois à chaque changement des cercles ou des options, pas dans une boucle d'animation : il n'y a donc rien à ralentir pour la réduction des animations. Les couleurs viennent du logarithme décimal de la courbure : la teinte passe du rose à l'ambre, puis au cyan et au violet à mesure que les cercles rapetissent. Les cercles de moins de 0,4 pixel à l'écran sont ignorés.",
        ],
        code: GAP_EXCERPT,
      },
    ],
    experimentsHeading: "À essayer",
    experiments: [
      {
        title: "Observe la première génération",
        text: "Règle la profondeur sur 0 et affiche les courbures. Vérifie que les nouveaux cercles suivent 2(k₁ + k₂ + k₃) − k₄ : le petit cercle entre −1, 2 et 2, à l'opposé du 3, doit valoir 2·3 − 3 = 3, l'image miroir de son partenaire.",
      },
      {
        title: "Vois la loi de croissance",
        text: "Augmente la profondeur pas à pas de 0 à 5 et lis le total : 8, 20, 56, 164, 488, 1 460. Chaque étape ajoute trois fois plus de cercles que la précédente, parce que chaque interstice rempli en laisse trois nouveaux.",
      },
      {
        title: "Trouve où la place vient à manquer",
        text: "Active « Mettre en évidence les interstices » à la profondeur 2, puis augmente la profondeur. La zone ombrée rétrécit vite. À la limite, elle se réduit à zéro : l'ensemble restant est d'aire nulle, mais il reste plus qu'une courbe, avec une dimension fractale d'environ 1,3.",
      },
      {
        title: "Compare les empilements",
        text: "Alterne entre (−1, 2, 2, 3) et (−6, 11, 14, 15) à la profondeur 3, courbures affichées. Le second empilement est moins symétrique, et ses courbures croissent beaucoup plus vite : la plus grande à la profondeur 3 vaut 1 847 au lieu de 323.",
      },
    ],
  },
  it: {
    metaDescription:
      "Guarnizione apolloniana, cerchio dopo cerchio: scegli un impacchettamento intero, aumenta la profondità e il teorema di Cartesio tiene intere le curvature.",
    heading: "Come funziona questo esploratore",
    intro:
      "Parti da quattro cerchi che si toccano tutti a vicenda: uno grande all'esterno e tre al suo interno. Tra di loro restano lacune triangolari dai lati curvi, e in ognuna di queste lacune c'è esattamente un cerchio che si incastra alla perfezione, toccandone tutti e tre i lati. Inserisci quel cerchio, e attorno a esso compaiono tre lacune più piccole. Ripeti all'infinito e ottieni la guarnizione apolloniana, un frattale fatto interamente di cerchi. Il canvas la disegna fino alla profondità che scegli; le sue etichette sono curvature, cioè i reciproci dei raggi.",
    sections: [
      {
        heading: "Il teorema dei cerchi di Cartesio",
        paragraphs: [
          "Per quattro cerchi mutuamente tangenti esiste un'unica equazione che lega le loro curvature k = 1/r. Cartesio la descrisse nel 1643 in una lettera alla principessa Elisabetta di Boemia, ed è la formula nell'etichetta ambra sopra il canvas. Il cerchio esterno conta con segno negativo, perché gli altri lo toccano dall'interno. Per l'impacchettamento predefinito questo dà (−1 + 2 + 2 + 3)² = 36 e 2(1 + 4 + 4 + 9) = 36.",
          "Letto come equazione in k₄, il teorema è quadratico, quindi dati tre cerchi tangenti ci sono due soluzioni: i due cerchi che possono toccarli tutti e tre. Le loro curvature sommate danno 2(k₁ + k₂ + k₃). Ne segue una regola senza alcuna radice quadrata: se conosci già uno dei due cerchi, l'altro ha curvatura",
        ],
        formula: REFLECTION,
      },
      {
        heading: "Perché ogni cerchio porta un numero intero",
        paragraphs: [
          "La regola di riflessione qui sopra usa solo addizioni, raddoppi e sottrazioni. Perciò, se le quattro curvature di partenza sono intere, anche ogni cerchio che la ricorsione aggiungerà ha curvatura intera. Tutti e cinque i preset sono impacchettamenti interi di questo tipo. Attiva «Mostra le curvature» e puoi verificarlo: nell'impacchettamento (−1, 2, 2, 3) i primi cerchi nuovi hanno curvature 15, 6, 6 e 3, e la generazione successiva porta 38, 35, 23, 14, 11 e altre ancora. Quali interi compaiano è una questione di ricerca attiva in teoria dei numeri.",
          "Per le posizioni esiste una regola corrispondente. Lagarias, Mallows e Wilks hanno dimostrato che la stessa formula funziona se moltiplichi ogni curvatura per il centro del suo cerchio, scritto come numero complesso. L'esploratore usa questa versione complessa una volta sola, per collocare il quarto cerchio seme, e la versione lineare per tutto il resto.",
        ],
        formula: DESCARTES,
      },
      {
        heading: "Che cosa fanno i controlli",
        paragraphs: [
          "I pulsanti di «Impacchettamento predefinito» scelgono le quattro curvature seme. Il primo numero è sempre la curvatura negativa del cerchio che racchiude gli altri, i restanti tre appartengono ai cerchi al suo interno. La vista si riscala in modo che il cerchio esterno riempia sempre il canvas, qualunque sia la sua dimensione.",
          "La profondità di ricorsione va da 0 a 8 e parte da 4. La profondità 0 riempie solo le quattro lacune originali, per un totale di 8 cerchi. Ogni livello in più triplica il numero di cerchi nuovi, quindi la profondità 4 ne mostra 488 e la profondità 8 ne mostra 39.368 per l'impacchettamento predefinito. Per gli altri preset alcuni dei cerchi più profondi scendono sotto il raggio di taglio e vengono saltati, così i loro conteggi a profondità 8 risultano un po' più bassi.",
          "Le opzioni di vista attivano o disattivano le etichette delle curvature (disegnate solo dentro i cerchi con raggio superiore a 14 pixel), un'ombreggiatura delle lacune ancora vuote, la colorazione per curvatura e un margine più ampio quando «Riempi il riquadro» è disattivato.",
        ],
      },
      {
        heading: "Com'è costruito",
        paragraphs: [
          "Il seme viene collocato con semplice geometria: il cerchio esterno sta nell'origine, il secondo lo tocca sul semiasse negativo delle x, il terzo si trova intersecando due condizioni di distanza e il quarto viene dal teorema di Cartesio complesso. Tra i due centri candidati, il codice tiene quello che tocca meglio tutti e tre i cerchi genitori.",
          "La crescita usa una pila esplicita al posto della ricorsione. Ogni voce descrive una lacuna tramite i tre cerchi che la delimitano, più il quarto cerchio sul lato opposto. Riflettendo quel quarto cerchio attraverso la lacuna si ottiene il cerchio nuovo, che poi divide la lacuna in tre nuove voci. I cerchi con raggio inferiore a 0,00001 vengono scartati, e un limite rigido di 60.000 inserimenti protegge da input fuori controllo.",
          "Il disegno avviene una volta sola ogni volta che cambiano i cerchi o le opzioni, non in un ciclo di animazione, quindi non c'è nulla da rallentare per il movimento ridotto. I colori derivano dal logaritmo in base 10 della curvatura: la tinta passa dal rosa all'ambra, poi al ciano e al viola man mano che i cerchi rimpiccioliscono. I cerchi sotto gli 0,4 pixel sullo schermo vengono saltati.",
        ],
        code: GAP_EXCERPT,
      },
    ],
    experimentsHeading: "Prova così",
    experiments: [
      {
        title: "Osserva la prima generazione",
        text: "Imposta la profondità a 0 e attiva «Mostra le curvature». Verifica che i cerchi nuovi seguano 2(k₁ + k₂ + k₃) − k₄: il cerchio piccolo tra −1, 2 e 2, opposto al 3, deve valere 2·3 − 3 = 3, l'immagine speculare del suo compagno.",
      },
      {
        title: "Scopri la legge di crescita",
        text: "Aumenta la profondità un passo alla volta da 0 a 5 e leggi il conteggio: 8, 20, 56, 164, 488, 1460. Ogni passo aggiunge il triplo dei cerchi del passo precedente, perché ogni lacuna riempita ne lascia tre nuove.",
      },
      {
        title: "Trova dove finisce lo spazio",
        text: "Attiva «Evidenzia le lacune triangolari» a profondità 2, poi aumenta la profondità. L'area ombreggiata si restringe in fretta. Al limite si riduce a zero: l'insieme che resta ha area nulla, ma è comunque più di una curva, con una dimensione frattale di circa 1,3.",
      },
      {
        title: "Confronta gli impacchettamenti",
        text: "Passa da (−1, 2, 2, 3) a (−6, 11, 14, 15) e viceversa a profondità 3, con le etichette attive. Le curvature del secondo impacchettamento crescono molto più in fretta: la più grande a profondità 3 è 1847 invece di 323.",
      },
    ],
  },
  pt: {
    metaDescription:
      "Constrói o empacotamento apoloniano círculo a círculo: escolhe sementes inteiras, sobe a profundidade e vê o teorema de Descartes manter curvaturas inteiras.",
    heading: "Como funciona este explorador",
    intro:
      "Começa com quatro círculos que se tocam todos entre si: um grande por fora e três dentro dele. Entre eles ficam lacunas triangulares de lados curvos, e em cada uma dessas lacunas cabe exatamente um círculo que encaixa na perfeição, tocando nos três lados. Coloca esse círculo, e aparecem três lacunas mais pequenas à volta dele. Repete para sempre e obténs o empacotamento apoloniano, também chamado junta apoloniana, um fractal feito inteiramente de círculos. O canvas desenha-o até à profundidade que escolheres; os seus rótulos são curvaturas, os inversos dos raios.",
    sections: [
      {
        heading: "O teorema dos círculos de Descartes",
        paragraphs: [
          "Para quatro círculos mutuamente tangentes existe uma única equação que liga as suas curvaturas k = 1/r. Descartes descreveu-a em 1643, numa carta à princesa Isabel da Boémia, e é a fórmula na caixa âmbar por cima do canvas. O círculo exterior conta com sinal negativo, porque os outros lhe tocam por dentro. Para o empacotamento predefinido isso dá (−1 + 2 + 2 + 3)² = 36 e 2(1 + 4 + 4 + 9) = 36.",
          "Lido como uma equação para k₄, o teorema é quadrático, pelo que, dados três círculos tangentes, há duas soluções: os dois círculos que conseguem tocar nos três. As suas curvaturas somam 2(k₁ + k₂ + k₃). Daí sai uma regra sem qualquer raiz quadrada: se já conheces um dos dois círculos, o outro tem curvatura",
        ],
        formula: REFLECTION,
      },
      {
        heading: "Porque é que cada círculo tem um número inteiro",
        paragraphs: [
          "A regra de reflexão acima usa apenas adição, duplicação e subtração. Assim, se as quatro curvaturas iniciais forem inteiras, todo o círculo que a recursão venha a acrescentar tem também curvatura inteira. As cinco predefinições são empacotamentos inteiros deste tipo. Ativa as curvaturas e podes confirmá-lo: no empacotamento (−1, 2, 2, 3) os primeiros círculos novos têm curvaturas 15, 6, 6 e 3, e a geração seguinte traz 38, 35, 23, 14, 11 e outras mais. Que inteiros aparecem é uma questão de investigação ativa em teoria dos números.",
          "Existe uma regra correspondente para as posições. Lagarias, Mallows e Wilks mostraram que a mesma fórmula funciona se multiplicares cada curvatura pelo centro do seu círculo, escrito como número complexo. O explorador usa essa versão complexa uma única vez, para posicionar o quarto círculo semente, e a versão linear para tudo o que vem depois.",
        ],
        formula: DESCARTES,
      },
      {
        heading: "O que fazem os controlos",
        paragraphs: [
          "Os botões de empacotamento predefinido escolhem as quatro curvaturas semente. O primeiro número é sempre a curvatura negativa do círculo envolvente, e os outros três pertencem aos círculos dentro dele. A vista é reescalada para que o círculo exterior preencha sempre o canvas, seja qual for o seu tamanho.",
          "A profundidade de recursão vai de 0 a 8 e começa em 4. A profundidade 0 preenche apenas as quatro lacunas originais, o que dá 8 círculos. Cada nível adicional triplica o número de círculos novos, de modo que a profundidade 4 mostra 488 e a profundidade 8 mostra 39 368 para o empacotamento predefinido. Nas outras predefinições, alguns dos círculos mais profundos ficam abaixo do raio de corte e são ignorados, pelo que as suas contagens à profundidade 8 ficam um pouco mais baixas.",
          "As opções de vista ligam e desligam as curvaturas (desenhadas apenas dentro de círculos com raio superior a 14 píxeis), um sombreado das lacunas que ainda estão vazias, a coloração por curvatura e uma margem mais larga quando «Preencher o quadro» está desligado.",
        ],
      },
      {
        heading: "Como está construído",
        paragraphs: [
          "A semente é posicionada com geometria simples: o círculo exterior fica na origem, o segundo toca-lhe no eixo x negativo, o terceiro encontra-se intersetando duas condições de distância e o quarto vem do teorema de Descartes complexo. Dos dois centros candidatos, o código fica com aquele que melhor toca nos três círculos progenitores.",
          "O crescimento usa uma pilha explícita em vez de recursão. Cada entrada descreve uma lacuna pelos três círculos que a delimitam, mais o quarto círculo do outro lado. Refletir esse quarto círculo através da lacuna dá o círculo novo, que por sua vez divide a lacuna em três novas entradas. Os círculos com raio inferior a 0,00001 são descartados, e um limite rígido de 60 000 inserções protege contra entradas descontroladas.",
          "O desenho acontece uma única vez sempre que os círculos ou as opções mudam, não num ciclo de animação, por isso não há nada a abrandar para o movimento reduzido. As cores vêm do logaritmo de base 10 da curvatura: o matiz vai do rosa ao violeta, passando pelo âmbar e pelo ciano, à medida que os círculos encolhem. Os círculos com menos de 0,4 píxeis no ecrã são ignorados.",
        ],
        code: GAP_EXCERPT,
      },
    ],
    experimentsHeading: "Experimenta isto",
    experiments: [
      {
        title: "Observa a primeira geração",
        text: "Põe a profundidade em 0 e ativa as curvaturas. Confirma que os círculos novos seguem 2(k₁ + k₂ + k₃) − k₄: o círculo pequeno entre −1, 2 e 2, oposto ao 3, tem de ser 2·3 − 3 = 3, a imagem espelhada do seu par.",
      },
      {
        title: "Vê a lei de crescimento",
        text: "Sobe a profundidade passo a passo de 0 a 5 e lê a contagem: 8, 20, 56, 164, 488, 1460. Cada passo acrescenta três vezes mais círculos do que o anterior, porque cada lacuna preenchida deixa três novas.",
      },
      {
        title: "Descobre onde o espaço acaba",
        text: "Ativa «Realçar as lacunas triangulares» à profundidade 2 e depois sobe a profundidade. A área sombreada encolhe depressa. No limite encolhe até zero: o conjunto que sobra tem área nula, mas ainda é mais do que uma curva, com uma dimensão fractal de cerca de 1,3.",
      },
      {
        title: "Compara os empacotamentos",
        text: "Alterna entre (−1, 2, 2, 3) e (−6, 11, 14, 15) à profundidade 3, com as curvaturas ativadas. O segundo empacotamento é menos simétrico e as suas curvaturas crescem muito mais depressa: a maior à profundidade 3 é 1847 em vez de 323.",
      },
    ],
  },
  sv: {
    metaDescription:
      "Bygg en apollonisk packning cirkel för cirkel: välj en heltalspackning, öka djupet och se hur Descartes sats håller varje krökning som ett heltal.",
    heading: "Så fungerar den här utforskaren",
    intro:
      "Börja med fyra cirklar som alla tangerar varandra: en stor ytterst och tre inuti den. Mellan dem finns krökta triangelglapp, och i varje sådant glapp finns exakt en cirkel som passar precis och tangerar alla tre sidorna. Lägg in den cirkeln, så uppstår tre mindre glapp runt den. Upprepa i all oändlighet och du får den apolloniska packningen, en fraktal som består enbart av cirklar. Ritytan visar den till det djup du väljer, och talen i cirklarna är krökningar, alltså radiernas inverser.",
    sections: [
      {
        heading: "Descartes sats om cirklar",
        paragraphs: [
          "För fyra cirklar som tangerar varandra finns en enda ekvation som knyter ihop deras krökningar k = 1/r. Descartes beskrev den 1643 i ett brev till prinsessan Elisabet av Böhmen, och det är formeln i den bärnstensfärgade rutan ovanför ritytan. Den yttre cirkeln räknas med negativt tecken, eftersom de andra cirklarna tangerar den från insidan. För standardpackningen ger det (−1 + 2 + 2 + 3)² = 36 och 2(1 + 4 + 4 + 9) = 36.",
          "Läst som en ekvation för k₄ är satsen kvadratisk, så för tre tangerande cirklar finns två lösningar: de två cirklar som kan tangera alla tre. Deras krökningar har summan 2(k₁ + k₂ + k₃). Det ger en regel helt utan kvadratrot: om du redan känner till den ena av de två cirklarna har den andra krökningen",
        ],
        formula: REFLECTION,
      },
      {
        heading: "Varför varje cirkel har ett heltal",
        paragraphs: [
          "Speglingsregeln ovan använder bara addition, fördubbling och subtraktion. Om de fyra startkrökningarna är heltal får därför varje cirkel som rekursionen någonsin lägger till också en heltalskrökning. Alla fem förvalen är sådana heltalspackningar. Slå på krökningsvärdena så kan du kontrollera det: i packningen (−1, 2, 2, 3) har de första nya cirklarna krökningarna 15, 6, 6 och 3, och nästa generation ger 38, 35, 23, 14, 11 och fler. Vilka heltal som dyker upp är en aktiv forskningsfråga inom talteorin.",
          "Det finns en motsvarande regel för lägena. Lagarias, Mallows och Wilks visade att samma formel fungerar om du multiplicerar varje krökning med cirkelns medelpunkt, skriven som ett komplext tal. Utforskaren använder den komplexa versionen en gång, för att placera den fjärde startcirkeln, och den linjära versionen för allt därefter.",
        ],
        formula: DESCARTES,
      },
      {
        heading: "Vad reglagen gör",
        paragraphs: [
          "Knapparna för fördefinierad packning väljer de fyra startkrökningarna. Det första talet är alltid den negativa krökningen hos den omslutande cirkeln, de tre andra hör till cirklarna inuti den. Vyn skalas om så att den yttre cirkeln alltid fyller ritytan, oavsett storlek.",
          "Rekursionsdjupet går från 0 till 8 och börjar på 4. Djup 0 fyller bara de fyra ursprungliga glappen, vilket ger 8 cirklar. Varje ytterligare nivå tredubblar antalet nya cirklar, så djup 4 visar 488 och djup 8 visar 39\u00a0368 för standardpackningen. För de andra förvalen hamnar några av de djupaste cirklarna under gränsradien och hoppas över, så deras antal vid djup 8 blir något lägre.",
          "Vyalternativen slår av och på krökningsvärdena (som bara ritas i cirklar med en radie över 14 pixlar), en skuggning av de glapp som fortfarande är tomma, färgning efter krökning och en bredare marginal när ”Fyll rutan” är av.",
        ],
      },
      {
        heading: "Hur den är byggd",
        paragraphs: [
          "Fröet placeras med vanlig geometri: den yttre cirkeln ligger i origo, den andra tangerar den på den negativa x-axeln, den tredje hittas genom att två avståndsvillkor skärs med varandra, och den fjärde kommer från Descartes sats i komplex form. Av två möjliga medelpunkter behåller koden den som bäst tangerar alla tre föräldracirklarna.",
          "Tillväxten sker med en explicit stack i stället för rekursion. Varje post beskriver ett glapp genom dess tre begränsande cirklar plus den fjärde cirkeln på andra sidan. När den fjärde cirkeln speglas genom glappet fås den nya cirkeln, som sedan delar glappet i tre nya poster. Cirklar med radie under 0,00001 kastas, och en hård gräns på 60\u00a0000 insättningar skyddar mot indata som skenar.",
          "Ritningen görs en gång varje gång cirklarna eller alternativen ändras, inte i en animationsslinga, så det finns inget att bromsa för minskad rörelse. Färgerna kommer från tiologaritmen av krökningen: nyansen sveper från rosa via bärnsten och cyan till violett när cirklarna krymper. Cirklar under 0,4 pixlar på skärmen hoppas över.",
        ],
        code: GAP_EXCERPT,
      },
    ],
    experimentsHeading: "Prova det här",
    experiments: [
      {
        title: "Titta på den första generationen",
        text: "Sätt djupet till 0 och slå på krökningsvärdena. Kontrollera att de nya cirklarna följer 2(k₁ + k₂ + k₃) − k₄: den lilla cirkeln mellan −1, 2 och 2, mittemot 3:an, måste vara 2·3 − 3 = 3, spegelbilden av sin partner.",
      },
      {
        title: "Se tillväxtlagen",
        text: "Stega djupet från 0 till 5 och läs av antalet: 8, 20, 56, 164, 488, 1460. Varje steg lägger till tre gånger så många cirklar som steget innan, eftersom varje fyllt glapp lämnar tre nya.",
      },
      {
        title: "Hitta var utrymmet tar slut",
        text: "Slå på ”Framhäv triangelglapp” vid djup 2 och öka sedan djupet. Den skuggade ytan krymper snabbt. I gränsen krymper den till noll: mängden som blir kvar har arean noll, men den är ändå mer än en kurva, med en fraktal dimension på ungefär 1,3.",
      },
      {
        title: "Jämför packningarna",
        text: "Växla mellan (−1, 2, 2, 3) och (−6, 11, 14, 15) vid djup 3 med värdena påslagna. Den andra packningens krökningar växer mycket snabbare: den största vid djup 3 är 1847 i stället för 323.",
      },
    ],
  },
  no: {
    metaDescription:
      "Bygg en apollonisk pakning sirkel for sirkel: Velg en heltallspakning, øk dybden og se hvordan Descartes' teorem holder hver krumning som et heltall.",
    heading: "Slik fungerer denne utforskeren",
    intro:
      "Start med fire sirkler som alle tangerer hverandre: én stor ytterst og tre inni den. Mellom dem ligger krumme trekantglipper, og i hver slik glippe finnes det nøyaktig én sirkel som passer akkurat og tangerer alle tre sidene. Legg inn den sirkelen, så oppstår tre mindre glipper rundt den. Gjenta i det uendelige, og du får den apolloniske pakningen, en fraktal som består utelukkende av sirkler. Lerretet tegner den til den dybden du velger, og tallene i sirklene er krumninger, altså de inverse av radiene.",
    sections: [
      {
        heading: "Descartes' sirkelteorem",
        paragraphs: [
          "For fire sirkler som tangerer hverandre, finnes det én enkelt ligning som knytter sammen krumningene k = 1/r. Descartes beskrev den i 1643 i et brev til prinsesse Elisabeth av Böhmen, og det er formelen i den ravfargede boksen over lerretet. Den ytre sirkelen teller med negativt fortegn, fordi de andre sirklene tangerer den fra innsiden. For standardpakningen gir det (−1 + 2 + 2 + 3)² = 36 og 2(1 + 4 + 4 + 9) = 36.",
          "Lest som en ligning for k₄ er teoremet kvadratisk, så for tre tangerende sirkler finnes det to løsninger: de to sirklene som kan tangere alle tre. Krumningene deres har summen 2(k₁ + k₂ + k₃). Det gir en regel helt uten kvadratrot: Hvis du allerede kjenner den ene av de to sirklene, har den andre krumningen",
        ],
        formula: REFLECTION,
      },
      {
        heading: "Hvorfor hver sirkel har et heltall",
        paragraphs: [
          "Speilingsregelen over bruker bare addisjon, dobling og subtraksjon. Hvis de fire startkrumningene er heltall, får derfor også hver sirkel som rekursjonen noen gang legger til, en heltallig krumning. Alle fem forhåndsvalgene er slike heltallspakninger. Slå på krumningsverdiene, så kan du kontrollere det: I pakningen (−1, 2, 2, 3) har de første nye sirklene krumningene 15, 6, 6 og 3, og neste generasjon gir 38, 35, 23, 14, 11 og flere. Hvilke heltall som dukker opp, er et aktivt forskningsspørsmål i tallteorien.",
          "Det finnes en tilsvarende regel for posisjonene. Lagarias, Mallows og Wilks viste at den samme formelen fungerer hvis du ganger hver krumning med sentrum i sirkelen, skrevet som et komplekst tall. Utforskeren bruker den komplekse versjonen én gang, for å plassere den fjerde frøsirkelen, og den lineære versjonen for alt etterpå.",
        ],
        formula: DESCARTES,
      },
      {
        heading: "Hva kontrollene gjør",
        paragraphs: [
          "Knappene for forhåndsvalgt pakning velger de fire startkrumningene. Det første tallet er alltid den negative krumningen til den omsluttende sirkelen, de tre andre hører til sirklene inni den. Visningen skaleres slik at den ytre sirkelen alltid fyller lerretet, uansett størrelse.",
          "Rekursjonsdybden går fra 0 til 8 og starter på 4. Dybde 0 fyller bare de fire opprinnelige glippene, noe som gir 8 sirkler. Hvert nivå til tredobler antallet nye sirkler, så dybde 4 viser 488 og dybde 8 viser 39\u00a0368 for standardpakningen. For de andre forhåndsvalgene havner noen av de dypeste sirklene under grenseradien og blir hoppet over, så antallet ved dybde 8 blir litt lavere der.",
          "Visningsvalgene slår av og på krumningsverdiene (som bare tegnes i sirkler med en radius over 14 piksler), en skyggelegging av glippene som fortsatt er tomme, farging etter krumning og en bredere marg når «Fyll rammen» er av.",
        ],
      },
      {
        heading: "Slik er den bygget",
        paragraphs: [
          "Frøet plasseres med enkel geometri: Den ytre sirkelen ligger i origo, den andre tangerer den på den negative x-aksen, den tredje finnes ved å skjære to avstandsbetingelser med hverandre, og den fjerde kommer fra Descartes' teorem i kompleks form. Av to mulige sentre beholder koden det som best tangerer alle tre foreldresirklene.",
          "Veksten bruker en eksplisitt stakk i stedet for rekursjon. Hver oppføring beskriver en glippe ved de tre sirklene som avgrenser den, pluss den fjerde sirkelen på den andre siden. Når den fjerde sirkelen speiles gjennom glippen, får du den nye sirkelen, som så deler glippen i tre nye oppføringer. Sirkler med radius under 0,00001 forkastes, og en hard grense på 60\u00a0000 innsettinger beskytter mot inndata som løper løpsk.",
          "Tegningen skjer én gang hver gang sirklene eller valgene endres, ikke i en animasjonsløkke, så det er ingenting å bremse for redusert bevegelse. Fargene kommer fra titallslogaritmen til krumningen: Fargetonen sveiper fra rosa via rav og cyan til fiolett etter hvert som sirklene krymper. Sirkler under 0,4 piksler på skjermen hoppes over.",
        ],
        code: GAP_EXCERPT,
      },
    ],
    experimentsHeading: "Prøv dette",
    experiments: [
      {
        title: "Se på den første generasjonen",
        text: "Sett dybden til 0 og slå på krumningsverdiene. Kontroller at de nye sirklene følger 2(k₁ + k₂ + k₃) − k₄: Den lille sirkelen mellom −1, 2 og 2, rett overfor 3-tallet, må være 2·3 − 3 = 3, speilbildet av partneren sin.",
      },
      {
        title: "Se vekstloven",
        text: "Øk dybden trinn for trinn fra 0 til 5 og les av antallet: 8, 20, 56, 164, 488, 1460. Hvert trinn legger til tre ganger så mange sirkler som trinnet før, fordi hver fylt glippe etterlater tre nye.",
      },
      {
        title: "Finn ut hvor plassen tar slutt",
        text: "Slå på «Uthev trekantglipp» ved dybde 2, og øk deretter dybden. Det skyggelagte området krymper raskt. I grensen krymper det til null: Mengden som blir igjen, har areal null, men den er likevel mer enn en kurve, med en fraktal dimensjon på omtrent 1,3.",
      },
      {
        title: "Sammenlign pakningene",
        text: "Bytt mellom (−1, 2, 2, 3) og (−6, 11, 14, 15) ved dybde 3 med verdiene slått på. Krumningene i den andre pakningen vokser mye raskere: Den største ved dybde 3 er 1847 i stedet for 323.",
      },
    ],
  },
};
