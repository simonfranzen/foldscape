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

const MOBIUS_FORMULA =
  "\\big((R + v\\cos\\tfrac{ku}{2})\\cos u,\\; (R + v\\cos\\tfrac{ku}{2})\\sin u,\\; v\\sin\\tfrac{ku}{2}\\big)";

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
  es: {
    metaDescription:
      "Gira en 3D una banda de Möbius y una botella de Klein, añade medias vueltas, corta la banda a un tercio de su anchura y mira por qué las piezas quedan unidas.",
    heading: "Cómo funciona este explorador",
    intro:
      "La cinta del centro es una banda de Möbius: una tira con media vuelta cuyos extremos están pegados. Parece un lazo corriente, pero solo tiene una cara y un único borde. Recorre una vez la línea central y llegarás de nuevo a lo que parecía ser la otra cara.",
    sections: [
      {
        heading: "Una fórmula, muchas bandas",
        paragraphs: [
          "La banda se dibuja a partir de una parametrización. u recorre una vez la circunferencia central de radio R, v recorre la anchura de −w a w. Mientras u va de 0 a 2π, la sección transversal gira k·u/2, así que tras una vuelta completa ha girado k medias vueltas. Para k = 1, el segmento en u = 2π es el segmento inicial con los extremos invertidos, y al pegarlo consigo mismo aparece la superficie de una sola cara.",
          "Que el resultado tenga una sola cara depende únicamente de la paridad de k. Un k impar (1, 3, 5) da una banda no orientable; un k par (2, 4) da una banda de dos caras que topológicamente es un cilindro corriente. El borde cuenta una segunda historia: para k impar es una única curva cerrada, para k par son dos circunferencias separadas. Con una media vuelta ese único borde es un lazo sin anudar, con tres es un nudo de trébol, y con dos las dos circunferencias del borde están enlazadas una vez.",
        ],
        formula: MOBIUS_FORMULA,
      },
      {
        heading: "Qué hacen los controles",
        paragraphs: [
          "«Superficie» alterna entre la banda de Möbius y la botella de Klein. «Autorrotación» hace girar el modelo alrededor de su eje vertical a la velocidad elegida, de 0 a 1,5 radianes por segundo (por defecto 0,45); si tu sistema pide movimiento reducido, empieza desactivada. Arrastrar sobre el lienzo lo gira a mano en todo momento, unos 0,005 radianes por píxel.",
          "«Anchura w» es la semianchura de la banda, de 0,05 a 0,5 con un radio central de 1 (por defecto 0,32). «Número de medias vueltas» fija k entre 1 y 5. La razón de corte c, de 0 a 0,5, marca las dos líneas v = ±c·w: todo lo que queda más cerca de la línea central se vuelve ámbar, todo lo de fuera conserva el degradado de rojo a azul. «Abrir el corte» abre una rendija estrecha a lo largo de las líneas de corte, sin mover las piezas, para que veas cómo cuelgan unas de otras.",
          "Una nota sobre los preajustes: toda razón de corte mayor que cero es topológicamente el mismo experimento. En una banda con una media vuelta, las dos líneas v = c y v = −c son en realidad una sola curva, porque tras una vuelta v se convierte en −v. Cortar a lo largo de ella deja siempre una banda de Möbius más estrecha en el centro (ámbar) y una banda larga de dos caras a su alrededor, y las dos están enlazadas. El preajuste 1/3 es la versión clásica: tres anchuras iguales. El preajuste «línea central» es un experimento distinto: un único corte a lo largo de v = 0 que se cierra tras una vuelta. Deja una sola pieza, una banda de dos caras el doble de larga y con dos vueltas completas, dibujada aquí con una rendija fina. Las líneas de resultado bajo los preajustes valen para una media vuelta y se ocultan con otros valores.",
        ],
      },
      {
        heading: "Cómo está construido",
        paragraphs: [
          "Aquí no hay ninguna biblioteca 3D. La página muestrea la superficie en una malla (160 × 16 cuadriláteros para la banda, 120 × 36 para la botella de Klein), divide cada cuadrilátero en dos triángulos, gira los vértices alrededor de los ejes x, y, z y los proyecta sobre un lienzo 2D con una simple división de perspectiva. La cámara está a 4,5 unidades de distancia para la banda y a 6,5 para la botella. Después todos los triángulos se ordenan por su profundidad media y se pintan de atrás hacia delante: el algoritmo del pintor.",
          "El sombreado contiene la única decisión de diseño propia de este tema. Una superficie de una sola cara no tiene una normal coherente: sigue el vector normal una vez alrededor de una banda de Möbius y volverá apuntando en sentido contrario. Por eso el renderizador no puede decidir qué cara es la frontal. Ilumina cada triángulo con el valor absoluto del producto escalar entre su normal y la dirección de la luz, de modo que ambas caras reciben el mismo sombreado de Lambert. Solo cambia el fino contorno, claro u oscuro según el signo, y puedes ver cómo ese signo se invierte al seguir la banda.",
          "El color corre a lo largo de la banda y no de una cara a otra: rojo en u = 0, azul justo antes de 2π. El cambio brusco de color allí donde la banda se cierra solo marca dónde vuelve a empezar la parametrización; no es una propiedad de la superficie.",
        ],
        code: MOBIUS_EXCERPT,
      },
      {
        heading: "La botella de Klein",
        paragraphs: [
          "Pega dos bandas de Möbius por sus bordes y obtienes una botella de Klein: una superficie cerrada sin borde alguno y, aun así, con una sola cara. Igual que la banda, tiene característica de Euler 0. En cuatro dimensiones se puede construir sin que se toque a sí misma, pero en el espacio tridimensional corriente toda superficie cerrada de una sola cara tiene que atravesarse. El explorador usa la inmersión en forma de ocho con a = 2: una sección transversal en forma de ocho que se desplaza alrededor de una circunferencia mientras gira media revolución. La superficie se corta a sí misma a lo largo de la circunferencia de radio 2 en el plano z = 0.",
        ],
      },
    ],
    experimentsHeading: "Prueba esto",
    experiments: [
      {
        title: "Sigue el único borde",
        text: "Quédate con una media vuelta, desactiva «Autorrotación» y arrastra despacio. Recorre el borde exterior con la mirada: da dos vueltas antes de encontrarse consigo mismo. Con 2 medias vueltas hay dos bordes separados.",
      },
      {
        title: "El corte en tercios",
        text: "Pulsa el preajuste 1/3 y luego «Abrir el corte». El tercio central, de color ámbar, es una banda de Möbius más estrecha, la parte exterior es una sola banda larga, y no se pueden separar sin volver a cortar. Después pulsa «línea central»: la rendija da toda la vuelta y, sin embargo, la banda sigue siendo una sola pieza.",
      },
      {
        title: "Impar frente a par",
        text: "Recorre 1, 2, 3, 4 y 5 medias vueltas con la anchura en 0,5. 3 y 5 se comportan como 1 (una cara, un borde); 2 y 4 son cilindros de dos caras disfrazados.",
      },
      {
        title: "Encuentra la autointersección",
        text: "Cambia a la botella de Klein y baja la velocidad de giro a unos 0,15. Observa el centro de la figura: el tubo se atraviesa a sí mismo a lo largo de un anillo, el precio de mostrar un objeto de cuatro dimensiones en tres.",
      },
    ],
  },
  fr: {
    metaDescription:
      "Fais tourner en 3D un ruban de Möbius et une bouteille de Klein, ajoute des demi-tours, coupe le ruban au tiers et vois pourquoi les morceaux restent liés.",
    heading: "Comment fonctionne cet explorateur",
    intro:
      "Le ruban au centre est un ruban de Möbius : une bande avec un demi-tour dont les extrémités sont collées l'une à l'autre. Il ressemble à une boucle ordinaire, mais il n'a qu'une seule face et un seul bord. Parcours une fois la ligne médiane et tu reviens sur ce qui semblait être l'autre face.",
    sections: [
      {
        heading: "Une formule, de nombreuses bandes",
        paragraphs: [
          "Le ruban est tracé à partir d'une paramétrisation. u fait une fois le tour du cercle central de rayon R, v parcourt la largeur de −w à w. Quand u va de 0 à 2π, la section transversale tourne de k·u/2 : après un tour complet, elle a donc tourné de k demi-tours. Pour k = 1, le segment en u = 2π est le segment de départ retourné bout pour bout, et le recoller sur lui-même produit la surface à une seule face.",
          "Que le résultat ait une seule face ne dépend que de la parité de k. Un k impair (1, 3, 5) donne une bande non orientable ; un k pair (2, 4) donne une bande à deux faces qui est, topologiquement, un cylindre ordinaire. Le bord raconte une seconde histoire : pour k impair, c'est une seule courbe fermée, pour k pair, ce sont deux cercles distincts. Avec un demi-tour, ce bord unique est une boucle non nouée, avec trois, c'est un nœud de trèfle, et avec deux, les deux cercles du bord sont enlacés une fois.",
        ],
        formula: MOBIUS_FORMULA,
      },
      {
        heading: "À quoi servent les commandes",
        paragraphs: [
          "« Surface » bascule entre le ruban de Möbius et la bouteille de Klein. « Rotation auto » fait tourner le modèle autour de son axe vertical à la vitesse choisie, de 0 à 1,5 radian par seconde (0,45 par défaut) ; si ton système demande des animations réduites, elle est désactivée au départ. Faire glisser sur le canevas le fait tourner à la main à tout moment, d'environ 0,005 radian par pixel.",
          "« Largeur w » est la demi-largeur de la bande, de 0,05 à 0,5 pour un rayon central de 1 (0,32 par défaut). « Nombre de demi-tours » règle k de 1 à 5. Le ratio de coupe c, de 0 à 0,5, marque les deux lignes v = ±c·w : tout ce qui est plus proche de la ligne médiane devient ambre, tout ce qui est à l'extérieur garde le dégradé du rouge au bleu. « Ouvrir la coupe » ouvre une fente étroite le long des lignes de coupe, sans déplacer les morceaux, pour que tu voies comment ils tiennent ensemble.",
          "Un mot sur les préréglages : tout ratio de coupe supérieur à zéro est, topologiquement, la même expérience. Sur un ruban à un demi-tour, les deux lignes v = c et v = −c sont en réalité une seule courbe, car après un tour v devient −v. Couper le long de cette courbe laisse toujours un ruban de Möbius plus étroit au milieu (ambre) et une longue bande à deux faces autour, et les deux sont enlacés. Le préréglage 1/3 est la version classique : trois largeurs égales. Le préréglage « ligne médiane » est une autre expérience : une seule coupe le long de v = 0, qui se referme après un tour. Il reste un seul morceau, une bande à deux faces deux fois plus longue avec deux tours complets, dessinée ici avec une fente fine. Les lignes de résultat sous les préréglages valent pour un demi-tour et sont masquées pour les autres valeurs.",
        ],
      },
      {
        heading: "Comment c'est construit",
        paragraphs: [
          "Il n'y a ici aucune bibliothèque 3D. La page échantillonne la surface sur une grille (160 × 16 quadrilatères pour le ruban, 120 × 36 pour la bouteille de Klein), découpe chaque quadrilatère en deux triangles, fait tourner les sommets autour des axes x, y et z, puis les projette sur un canevas 2D par une simple division de perspective. La caméra se trouve à 4,5 unités pour le ruban et à 6,5 pour la bouteille. Tous les triangles sont ensuite triés selon leur profondeur moyenne et peints de l'arrière vers l'avant : c'est l'algorithme du peintre.",
          "L'ombrage contient la seule décision de conception propre à ce sujet. Une surface à une seule face n'a pas de normale cohérente : suis le vecteur normal une fois autour d'un ruban de Möbius et il revient en pointant dans l'autre sens. Le moteur de rendu ne peut donc pas décider quelle face est l'avant. Il éclaire chaque triangle avec la valeur absolue du produit scalaire entre sa normale et la direction de la lumière, si bien que les deux faces reçoivent le même ombrage de Lambert. Seul le fin contour change, clair ou sombre selon le signe, et tu peux voir ce signe basculer en suivant la bande.",
          "La couleur court le long de la bande et non d'une face à l'autre : rouge en u = 0, bleu juste avant 2π. Le changement de couleur brutal là où le ruban se referme marque seulement l'endroit où la paramétrisation recommence ; ce n'est pas une propriété de la surface.",
        ],
        code: MOBIUS_EXCERPT,
      },
      {
        heading: "La bouteille de Klein",
        paragraphs: [
          "Colle deux rubans de Möbius le long de leurs bords et tu obtiens une bouteille de Klein : une surface fermée sans aucun bord, et pourtant toujours à une seule face. Comme le ruban, elle a une caractéristique d'Euler égale à 0. En quatre dimensions, on peut la construire sans qu'elle se touche, mais dans l'espace ordinaire à trois dimensions, toute surface fermée à une seule face doit se traverser elle-même. L'explorateur utilise l'immersion en huit avec a = 2 : une section en forme de huit que l'on fait circuler autour d'un cercle pendant qu'elle tourne d'une demi-révolution. La surface se recoupe le long du cercle de rayon 2 dans le plan z = 0.",
        ],
      },
    ],
    experimentsHeading: "À essayer",
    experiments: [
      {
        title: "Suis le bord unique",
        text: "Garde un demi-tour, désactive « Rotation auto » et fais glisser lentement. Suis le bord extérieur des yeux : il fait deux fois le tour avant de se rejoindre. Avec 2 demi-tours, il y a deux bords distincts.",
      },
      {
        title: "La coupe en tiers",
        text: "Appuie sur le préréglage 1/3, puis sur « Ouvrir la coupe ». Le tiers central, de couleur ambre, est un ruban de Möbius plus étroit, la partie extérieure est une seule longue bande, et on ne peut pas les séparer sans couper à nouveau. Appuie ensuite sur « ligne médiane » : la fente fait tout le tour, et pourtant la bande reste d'un seul tenant.",
      },
      {
        title: "Impair contre pair",
        text: "Passe par 1, 2, 3, 4 et 5 demi-tours avec la largeur à 0,5. 3 et 5 se comportent comme 1 (une face, un bord) ; 2 et 4 sont des cylindres à deux faces déguisés.",
      },
      {
        title: "Trouve l'auto-intersection",
        text: "Passe à la bouteille de Klein et baisse la vitesse de rotation à environ 0,15. Observe le milieu de la forme : le tube se traverse lui-même le long d'un anneau, le prix à payer pour montrer un objet à quatre dimensions en trois dimensions.",
      },
    ],
  },
  it: {
    metaDescription:
      "Ruota in 3D un nastro di Möbius e una bottiglia di Klein, aggiungi mezzi giri, taglia il nastro a un terzo e scopri perché i due pezzi restano concatenati.",
    heading: "Come funziona questo esploratore",
    intro:
      "Il nastro al centro è un nastro di Möbius: una striscia con un mezzo giro le cui estremità sono incollate fra loro. Sembra un anello qualunque, ma ha una sola faccia e un solo bordo. Percorri una volta la linea centrale e ti ritrovi su quella che sembrava l'altra faccia.",
    sections: [
      {
        heading: "Una formula, tanti nastri",
        paragraphs: [
          "Il nastro è disegnato a partire da una parametrizzazione. u percorre una volta la circonferenza centrale di raggio R, v attraversa la larghezza da −w a w. Mentre u va da 0 a 2π, la sezione trasversale ruota di k·u/2, quindi dopo un giro completo ha compiuto k mezzi giri. Per k = 1 il segmento in u = 2π è il segmento di partenza capovolto, e incollandolo a sé stesso si ottiene la superficie a una sola faccia.",
          "Che il risultato abbia una sola faccia dipende soltanto dalla parità di k. Un k dispari (1, 3, 5) dà un nastro non orientabile; un k pari (2, 4) dà un nastro a due facce che topologicamente è un normale cilindro. Il bordo racconta una seconda storia: per k dispari è un'unica curva chiusa, per k pari sono due circonferenze separate. Con un mezzo giro quell'unico bordo è un anello non annodato, con tre è un nodo a trifoglio, e con due le due circonferenze del bordo sono concatenate una volta.",
        ],
        formula: MOBIUS_FORMULA,
      },
      {
        heading: "Che cosa fanno i controlli",
        paragraphs: [
          "«Superficie» passa dal nastro di Möbius alla bottiglia di Klein e viceversa. «Rotazione auto» fa ruotare il modello attorno al suo asse verticale alla velocità scelta, da 0 a 1,5 radianti al secondo (valore predefinito 0,45); se il tuo sistema chiede movimento ridotto, all'inizio è disattivata. Trascinando sul canvas lo ruoti a mano in qualsiasi momento, di circa 0,005 radianti per pixel.",
          "«Larghezza w» è la semilarghezza del nastro, da 0,05 a 0,5 con un raggio centrale pari a 1 (valore predefinito 0,32). «Numero di mezzi giri» imposta k da 1 a 5. Il rapporto di taglio c, da 0 a 0,5, segna le due linee v = ±c·w: tutto ciò che è più vicino alla linea centrale diventa ambra, tutto ciò che sta fuori conserva la sfumatura dal rosso al blu. «Apri il taglio» apre una fessura sottile lungo le linee di taglio, senza spostare i pezzi, così puoi vedere come restano agganciati.",
          "Una parola sui preset: ogni rapporto di taglio maggiore di zero è, topologicamente, lo stesso esperimento. Su un nastro con un mezzo giro le due linee v = c e v = −c sono in realtà un'unica curva, perché dopo un giro v diventa −v. Tagliando lungo questa curva restano sempre un nastro di Möbius più stretto al centro (ambra) e un lungo nastro a due facce attorno, e i due sono concatenati. Il preset 1/3 è la versione classica: tre larghezze uguali. Il preset «linea centrale» è un esperimento diverso: un unico taglio lungo v = 0 che si chiude dopo un giro. Resta un solo pezzo, un nastro a due facce lungo il doppio con due giri completi, qui disegnato con una fessura sottile. Le righe di risultato sotto i preset valgono per un mezzo giro e vengono nascoste per gli altri valori.",
        ],
      },
      {
        heading: "Com'è costruito",
        paragraphs: [
          "Qui non c'è nessuna libreria 3D. La pagina campiona la superficie su una griglia (160 × 16 quadrilateri per il nastro, 120 × 36 per la bottiglia di Klein), divide ogni quadrilatero in due triangoli, ruota i vertici attorno agli assi x, y e z e li proietta su un canvas 2D con una semplice divisione prospettica. La telecamera si trova a 4,5 unità di distanza per il nastro e a 6,5 per la bottiglia. Tutti i triangoli vengono poi ordinati in base alla profondità media e dipinti da dietro in avanti: è l'algoritmo del pittore.",
          "L'ombreggiatura contiene l'unica scelta progettuale specifica di questo argomento. Una superficie a una sola faccia non ha una normale coerente: segui il vettore normale per un giro lungo un nastro di Möbius e tornerà puntando nel verso opposto. Il renderer quindi non può decidere quale faccia sia quella anteriore. Illumina ogni triangolo con il valore assoluto del prodotto scalare tra la sua normale e la direzione della luce, così entrambe le facce ricevono la stessa ombreggiatura di Lambert. Cambia solo il contorno sottile, chiaro o scuro a seconda del segno, e puoi vedere quel segno invertirsi mentre segui il nastro.",
          "Il colore scorre lungo il nastro invece che da una faccia all'altra: rosso in u = 0, blu poco prima di 2π. Il brusco cambio di colore nel punto in cui il nastro si chiude indica soltanto dove ricomincia la parametrizzazione; non è una proprietà della superficie.",
        ],
        code: MOBIUS_EXCERPT,
      },
      {
        heading: "La bottiglia di Klein",
        paragraphs: [
          "Incolla due nastri di Möbius lungo i loro bordi e ottieni una bottiglia di Klein: una superficie chiusa del tutto priva di bordo, e comunque con una sola faccia. Come il nastro, ha caratteristica di Eulero 0. In quattro dimensioni la si può costruire senza che tocchi sé stessa, ma nel comune spazio tridimensionale ogni superficie chiusa a una sola faccia deve attraversarsi. L'esploratore usa l'immersione a otto con a = 2: una sezione a forma di otto fatta scorrere lungo una circonferenza mentre ruota di mezzo giro. La superficie interseca sé stessa lungo la circonferenza di raggio 2 nel piano z = 0.",
        ],
      },
    ],
    experimentsHeading: "Prova così",
    experiments: [
      {
        title: "Segui l'unico bordo",
        text: "Tieni un mezzo giro, disattiva «Rotazione auto» e trascina lentamente. Segui con gli occhi il bordo esterno: fa due giri prima di ricongiungersi a sé stesso. Con 2 mezzi giri ci sono due bordi separati.",
      },
      {
        title: "Il taglio in terzi",
        text: "Premi il preset 1/3, poi «Apri il taglio». Il terzo centrale color ambra è un nastro di Möbius più stretto, la parte esterna è un unico nastro lungo, e non si possono separare senza tagliare di nuovo. Poi premi «linea centrale»: la fessura fa tutto il giro, eppure il nastro resta in un pezzo solo.",
      },
      {
        title: "Dispari contro pari",
        text: "Passa in rassegna 1, 2, 3, 4 e 5 mezzi giri con la larghezza a 0,5. 3 e 5 si comportano come 1 (una faccia, un bordo); 2 e 4 sono cilindri a due facce sotto mentite spoglie.",
      },
      {
        title: "Trova l'autointersezione",
        text: "Passa alla bottiglia di Klein e abbassa la velocità di rotazione a circa 0,15. Osserva il centro della figura: il tubo attraversa sé stesso lungo un anello, il prezzo da pagare per mostrare un oggetto a quattro dimensioni in tre.",
      },
    ],
  },
  pt: {
    metaDescription:
      "Roda em 3D uma faixa de Möbius e uma garrafa de Klein, junta meias-voltas, corta a faixa a um terço da largura e vê porque é que as peças ficam entrelaçadas.",
    heading: "Como funciona este explorador",
    intro:
      "A fita ao centro é uma faixa de Möbius: uma tira com meia-volta cujas pontas estão coladas uma à outra. Parece um laço comum, mas tem apenas um lado e apenas um bordo. Percorre uma vez a linha central e chegas de novo ao que parecia ser a outra face.",
    sections: [
      {
        heading: "Uma fórmula, muitas faixas",
        paragraphs: [
          "A faixa é desenhada a partir de uma parametrização. u percorre uma vez a circunferência central de raio R, v percorre a largura de −w a w. Enquanto u vai de 0 a 2π, a secção transversal roda k·u/2, pelo que, depois de uma volta completa, rodou k meias-voltas. Para k = 1, o segmento em u = 2π é o segmento inicial com as pontas trocadas, e colá-lo a si próprio produz a superfície de um só lado.",
          "O resultado ter ou não um só lado depende apenas da paridade de k. Um k ímpar (1, 3, 5) dá uma faixa não orientável; um k par (2, 4) dá uma faixa de dois lados que, topologicamente, é um cilindro comum. O bordo conta uma segunda história: para k ímpar é uma única curva fechada, para k par são duas circunferências separadas. Com uma meia-volta, esse bordo único é um laço sem nó, com três é um nó de trevo, e com duas as duas circunferências do bordo estão entrelaçadas uma vez.",
        ],
        formula: MOBIUS_FORMULA,
      },
      {
        heading: "O que fazem os controlos",
        paragraphs: [
          "«Superfície» alterna entre a faixa de Möbius e a garrafa de Klein. «Rotação auto» faz rodar o modelo em torno do seu eixo vertical à velocidade escolhida, de 0 a 1,5 radianos por segundo (0,45 por omissão); se o teu sistema pedir movimento reduzido, começa desligada. Arrastar sobre o canvas roda o modelo à mão em qualquer momento, cerca de 0,005 radianos por píxel.",
          "«Largura w» é a meia-largura da faixa, de 0,05 a 0,5 com um raio central de 1 (0,32 por omissão). «Número de meias-voltas» define k de 1 a 5. A razão de corte c, de 0 a 0,5, marca as duas linhas v = ±c·w: tudo o que fica mais perto da linha central torna-se âmbar, tudo o que fica de fora mantém o gradiente de vermelho a azul. «Abrir o corte» abre uma fenda estreita ao longo das linhas de corte, sem mover as peças, para que vejas como ficam presas uma à outra.",
          "Uma nota sobre as predefinições: qualquer razão de corte acima de zero é, topologicamente, a mesma experiência. Numa faixa com uma meia-volta, as duas linhas v = c e v = −c são na verdade uma única curva, porque ao fim de uma volta v passa a −v. Cortar ao longo dela deixa sempre uma faixa de Möbius mais estreita no meio (âmbar) e uma faixa longa de dois lados à volta, e as duas ficam entrelaçadas. A predefinição 1/3 é a versão clássica: três larguras iguais. A predefinição «linha central» é uma experiência diferente: um único corte ao longo de v = 0 que se fecha ao fim de uma volta. Fica uma só peça, uma faixa de dois lados com o dobro do comprimento e duas voltas completas, aqui desenhada com uma fenda fina. As linhas de resultado por baixo das predefinições valem para uma meia-volta e ficam ocultas para outros valores.",
        ],
      },
      {
        heading: "Como está construído",
        paragraphs: [
          "Não há aqui nenhuma biblioteca 3D. A página amostra a superfície numa grelha (160 × 16 quadriláteros para a faixa, 120 × 36 para a garrafa de Klein), divide cada quadrilátero em dois triângulos, roda os vértices em torno dos eixos x, y e z e projeta-os num canvas 2D com uma simples divisão de perspetiva. A câmara está a 4,5 unidades de distância para a faixa e a 6,5 para a garrafa. Todos os triângulos são depois ordenados pela profundidade média e pintados de trás para a frente: é o algoritmo do pintor.",
          "O sombreamento contém a única decisão de desenho específica deste tema. Uma superfície de um só lado não tem uma normal coerente: segue o vetor normal uma vez à volta de uma faixa de Möbius e ele regressa a apontar no sentido oposto. Por isso o renderizador não consegue decidir qual é a face da frente. Ilumina cada triângulo com o valor absoluto do produto escalar entre a sua normal e a direção da luz, de modo que ambas as faces recebem o mesmo sombreamento de Lambert. Só o contorno fino muda, claro ou escuro consoante o sinal, e podes ver esse sinal inverter-se à medida que segues a faixa.",
          "A cor corre ao longo do comprimento e não de uma face para a outra: vermelho em u = 0, azul mesmo antes de 2π. A mudança brusca de cor no sítio onde a faixa se fecha marca apenas o ponto em que a parametrização recomeça; não é uma característica da superfície.",
        ],
        code: MOBIUS_EXCERPT,
      },
      {
        heading: "A garrafa de Klein",
        paragraphs: [
          "Cola duas faixas de Möbius pelos bordos e obténs uma garrafa de Klein: uma superfície fechada sem bordo nenhum e, ainda assim, com um só lado. Tal como a faixa, tem característica de Euler 0. Em quatro dimensões pode ser construída sem tocar em si própria, mas no espaço tridimensional comum toda a superfície fechada de um só lado tem de se atravessar. O explorador usa a imersão em forma de oito com a = 2: uma secção transversal em forma de oito levada à volta de uma circunferência enquanto roda meia revolução. A superfície cruza-se a si própria ao longo da circunferência de raio 2 no plano z = 0.",
        ],
      },
    ],
    experimentsHeading: "Experimenta isto",
    experiments: [
      {
        title: "Segue o bordo único",
        text: "Mantém uma meia-volta, desliga «Rotação auto» e arrasta devagar. Segue o bordo exterior com os olhos: dá duas voltas antes de se encontrar consigo próprio. Com 2 meias-voltas há dois bordos separados.",
      },
      {
        title: "O corte em terços",
        text: "Carrega na predefinição 1/3 e depois em «Abrir o corte». O terço central, em âmbar, é uma faixa de Möbius mais estreita, a parte exterior é uma única faixa longa, e não é possível separá-las sem cortar outra vez. Depois carrega em «linha central»: a fenda dá a volta toda e, mesmo assim, a faixa continua numa só peça.",
      },
      {
        title: "Ímpar contra par",
        text: "Percorre 1, 2, 3, 4 e 5 meias-voltas com a largura em 0,5. 3 e 5 comportam-se como 1 (um lado, um bordo); 2 e 4 são cilindros de dois lados disfarçados.",
      },
      {
        title: "Encontra a autointerseção",
        text: "Muda para a garrafa de Klein e baixa a velocidade de rotação para cerca de 0,15. Observa o meio da figura: o tubo atravessa-se a si próprio ao longo de um anel, o preço de mostrar um objeto de quatro dimensões em três.",
      },
    ],
  },
  sv: {
    metaDescription:
      "Vrid ett Möbiusband och en Kleinflaska i 3D, lägg till halvvarv, klipp bandet vid en tredjedel av bredden och se varför de två delarna förblir sammanlänkade.",
    heading: "Så fungerar den här utforskaren",
    intro:
      "Remsan i mitten är ett Möbiusband: ett band med ett halvvarvs vridning vars ändar är hoplimmade. Det ser ut som en vanlig ögla, men det har bara en sida och bara en kant. Följ mittlinjen ett varv, så kommer du tillbaka på det som såg ut att vara den andra sidan.",
    sections: [
      {
        heading: "En formel, många band",
        paragraphs: [
          "Bandet ritas utifrån en parametrisering. u löper ett varv runt mittcirkeln med radien R, v löper tvärs över bredden från −w till w. När u går från 0 till 2π vrids tvärsnittet med k·u/2, så efter ett helt varv har det vridits k halvvarv. För k = 1 är segmentet vid u = 2π startsegmentet vänt ände mot ände, och när det limmas ihop med sig självt uppstår den ensidiga ytan.",
          "Om resultatet är ensidigt beror bara på om k är udda eller jämnt. Udda k (1, 3, 5) ger ett icke-orienterbart band; jämnt k (2, 4) ger ett tvåsidigt band som topologiskt är en vanlig cylinder. Kanten berättar en andra historia: för udda k är den en enda sluten kurva, för jämnt k är den två separata cirklar. Med ett halvvarv är den enda kanten en oknuten ögla, med tre är den en treklöverknut, och med två är de två kantcirklarna länkade i varandra en gång.",
        ],
        formula: MOBIUS_FORMULA,
      },
      {
        heading: "Vad reglagen gör",
        paragraphs: [
          "”Yta” växlar mellan Möbiusbandet och Kleinflaskan. ”Auto-rotation” snurrar modellen kring dess lodräta axel med den valda hastigheten, från 0 till 1,5 radianer per sekund (standard 0,45); om ditt system ber om minskad rörelse är den avstängd från början. Genom att dra på canvasen kan du alltid vrida modellen för hand, ungefär 0,005 radianer per pixel.",
          "”Bredd w” är bandets halva bredd, från 0,05 till 0,5 med mittradien 1 (standard 0,32). ”Antal halvvarv” ställer in k från 1 till 5. Skärförhållandet c, från 0 till 0,5, markerar de två linjerna v = ±c·w: allt som ligger närmare mittlinjen än så blir bärnstensfärgat, allt utanför behåller toningen från rött till blått. ”Öppna snittet” öppnar en smal springa längs snittlinjerna, utan att flytta delarna, så att du ser hur de hänger ihop.",
          "Ett ord om förvalen: varje skärförhållande över noll är topologiskt samma experiment. På ett band med ett halvvarv är de två linjerna v = c och v = −c i själva verket en enda kurva, eftersom v övergår i −v efter ett varv. Ett snitt längs den lämnar alltid ett smalare Möbiusband i mitten (bärnstensfärgat) och ett långt tvåsidigt band runt omkring, och de två är sammanlänkade. Förvalet 1/3 är den klassiska varianten: tre lika breda remsor. Förvalet ”mittlinjen” är ett annat experiment: ett enda snitt längs v = 0 som sluter sig efter ett varv. Kvar blir en enda del, ett tvåsidigt band som är dubbelt så långt och har två hela varv, här ritat med en tunn springa. Resultatraderna under förvalen gäller för ett halvvarv och döljs för andra värden.",
        ],
      },
      {
        heading: "Hur den är byggd",
        paragraphs: [
          "Här finns inget 3D-bibliotek. Sidan samplar ytan på ett rutnät (160 × 16 fyrhörningar för bandet, 120 × 36 för Kleinflaskan), delar varje fyrhörning i två trianglar, roterar hörnen kring x-, y- och z-axeln och projicerar dem med en enkel perspektivdivision på en 2D-canvas. Kameran står 4,5 enheter bort för bandet och 6,5 för flaskan. Därefter sorteras alla trianglar efter sitt genomsnittliga djup och målas bakifrån och framåt, den så kallade målaralgoritmen.",
          "I skuggningen finns det enda designbeslutet som är specifikt för det här ämnet. En ensidig yta har ingen konsekvent normal: följ normalvektorn ett varv runt ett Möbiusband, så kommer den tillbaka och pekar åt andra hållet. Renderaren kan alltså inte avgöra vilken sida som är framsidan. Den belyser varje triangel med absolutbeloppet av skalärprodukten mellan dess normal och ljusriktningen, så att båda sidorna får samma Lambertskuggning. Bara den tunna konturen ändras, ljus eller mörk beroende på tecknet, och du kan se hur tecknet slår om när du följer bandet runt.",
          "Färgen löper längs bandet i stället för över sidorna: rött vid u = 0, blått strax före 2π. Det tvära färgbytet där bandet sluter sig markerar bara var parametriseringen börjar om; det är ingen egenskap hos ytan.",
        ],
        code: MOBIUS_EXCERPT,
      },
      {
        heading: "Kleinflaskan",
        paragraphs: [
          "Limma ihop två Möbiusband längs kanterna, så får du en Kleinflaska: en sluten yta helt utan rand, fortfarande med bara en sida. Liksom bandet har den Eulerkarakteristiken 0. I fyra dimensioner kan den byggas utan att röra vid sig själv, men i det vanliga tredimensionella rummet måste varje sluten ensidig yta gå igenom sig själv. Utforskaren använder den åttaformade immersionen med a = 2: ett tvärsnitt i form av en åtta som förs runt en cirkel medan det vrids ett halvt varv. Ytan skär sig själv längs cirkeln med radien 2 i planet z = 0.",
        ],
      },
    ],
    experimentsHeading: "Prova det här",
    experiments: [
      {
        title: "Följ den enda kanten",
        text: "Behåll ett halvvarv, stäng av ”Auto-rotation” och dra långsamt. Följ ytterkanten med blicken: den går två varv runt innan den möter sig själv. Med 2 halvvarv finns det två separata kanter.",
      },
      {
        title: "Snittet i tredjedelar",
        text: "Tryck på förvalet 1/3 och sedan på ”Öppna snittet”. Den bärnstensfärgade mittersta tredjedelen är ett smalare Möbiusband, den yttre delen är ett enda långt band, och de går inte att dra isär utan att klippa igen. Tryck sedan på ”mittlinjen”: springan går hela vägen runt, och ändå förblir bandet i ett stycke.",
      },
      {
        title: "Udda mot jämnt",
        text: "Stega igenom 1, 2, 3, 4 och 5 halvvarv med bredden på 0,5. 3 och 5 beter sig som 1 (en sida, en kant); 2 och 4 är förklädda tvåsidiga cylindrar.",
      },
      {
        title: "Hitta självskärningen",
        text: "Byt till Kleinflaskan och sänk rotationshastigheten till ungefär 0,15. Titta på figurens mitt: röret går igenom sig självt längs en ring, priset för att visa ett fyrdimensionellt objekt i tre dimensioner.",
      },
    ],
  },
  no: {
    metaDescription:
      "Roter et Möbiusbånd og en Kleinflaske i 3D, legg til halvomdreininger, klipp båndet ved en tredjedel av bredden og se hvorfor de to delene blir hengende sammen.",
    heading: "Slik fungerer denne utforskeren",
    intro:
      "Remsen i midten er et Möbiusbånd: et bånd med en halv vridning der endene er limt sammen. Det ser ut som en vanlig løkke, men det har bare én side og bare én kant. Følg midtlinjen én runde, og du kommer tilbake på det som så ut til å være den andre siden.",
    sections: [
      {
        heading: "Én formel, mange bånd",
        paragraphs: [
          "Båndet tegnes ut fra en parametrisering. u går én gang rundt midtsirkelen med radius R, v går på tvers av bredden fra −w til w. Når u går fra 0 til 2π, dreies tverrsnittet med k·u/2, så etter en hel runde har det dreid k halvomdreininger. For k = 1 er segmentet ved u = 2π startsegmentet snudd ende mot ende, og når det limes til seg selv, oppstår den énsidige flaten.",
          "Om resultatet er énsidig, avhenger bare av om k er oddetall eller partall. Odde k (1, 3, 5) gir et ikke-orienterbart bånd; jevn k (2, 4) gir et tosidig bånd som topologisk er en vanlig sylinder. Kanten forteller en historie til: For odde k er den én eneste lukket kurve, for jevn k er den to atskilte sirkler. Med én halvomdreining er den ene kanten en løkke uten knute, med tre er den en trekløverknute, og med to er de to kantsirklene lenket i hverandre én gang.",
        ],
        formula: MOBIUS_FORMULA,
      },
      {
        heading: "Hva kontrollene gjør",
        paragraphs: [
          "«Flate» veksler mellom Möbiusbåndet og Kleinflasken. «Auto-rotasjon» roterer modellen rundt den loddrette aksen med den valgte hastigheten, fra 0 til 1,5 radianer per sekund (standard 0,45); hvis systemet ditt ber om redusert bevegelse, er den slått av fra starten. Ved å dra på lerretet kan du alltid rotere modellen for hånd, omtrent 0,005 radianer per piksel.",
          "«Bredde w» er den halve bredden til båndet, fra 0,05 til 0,5 med en midtradius på 1 (standard 0,32). «Antall halvomdreininger» setter k fra 1 til 5. Kuttforholdet c, fra 0 til 0,5, markerer de to linjene v = ±c·w: Alt som ligger nærmere midtlinjen enn dette, blir ravfarget, alt utenfor beholder fargeovergangen fra rødt til blått. «Åpne kuttet» åpner en smal spalte langs kuttlinjene, uten å flytte delene, slik at du ser hvordan de henger sammen.",
          "Et ord om forhåndsvalgene: Ethvert kuttforhold over null er topologisk det samme eksperimentet. På et bånd med én halvomdreining er de to linjene v = c og v = −c egentlig én kurve, fordi v blir til −v etter én runde. Et kutt langs den etterlater alltid et smalere Möbiusbånd i midten (ravfarget) og ett langt tosidig bånd rundt, og de to er lenket sammen. Forhåndsvalget 1/3 er den klassiske varianten: tre like bredder. Forhåndsvalget «midtlinjen» er et annet eksperiment: ett enkelt kutt langs v = 0 som lukker seg etter én runde. Igjen blir én del, et tosidig bånd som er dobbelt så langt og har to hele omdreininger, her tegnet med en tynn spalte. Resultatlinjene under forhåndsvalgene gjelder for én halvomdreining og skjules for andre verdier.",
        ],
      },
      {
        heading: "Slik er den bygget",
        paragraphs: [
          "Her finnes det ikke noe 3D-bibliotek. Siden regner ut flaten i punktene på et rutenett (160 × 16 firkanter for båndet, 120 × 36 for Kleinflasken), deler hver firkant i to trekanter, roterer hjørnene rundt x-, y- og z-aksen og projiserer dem med en enkel perspektivdivisjon på et 2D-lerret. Kameraet står 4,5 enheter unna for båndet og 6,5 for flasken. Deretter sorteres alle trekantene etter gjennomsnittlig dybde og males bakfra og forover, den såkalte maleralgoritmen.",
          "I skyggeleggingen ligger det ene designvalget som er spesielt for dette temaet. En énsidig flate har ingen konsistent normal: Følg normalvektoren én runde rundt et Möbiusbånd, og den kommer tilbake og peker motsatt vei. Tegnekoden kan altså ikke avgjøre hvilken side som er forsiden. Den belyser hver trekant med absoluttverdien av skalarproduktet mellom normalen og lysretningen, slik at begge sidene får samme Lambert-skyggelegging. Bare den tynne konturen endrer seg, lys eller mørk avhengig av fortegnet, og du kan se fortegnet slå om når du følger båndet rundt.",
          "Fargen løper langs båndet i stedet for over sidene: rødt ved u = 0, blått like før 2π. Det brå fargeskiftet der båndet lukker seg, markerer bare hvor parametriseringen starter på nytt; det er ikke en egenskap ved flaten.",
        ],
        code: MOBIUS_EXCERPT,
      },
      {
        heading: "Kleinflasken",
        paragraphs: [
          "Lim to Möbiusbånd sammen langs kantene, og du får en Kleinflaske: en lukket flate helt uten rand, fortsatt med bare én side. I likhet med båndet har den Euler-karakteristikk 0. I fire dimensjoner kan den bygges uten å berøre seg selv, men i det vanlige tredimensjonale rommet må enhver lukket énsidig flate gå gjennom seg selv. Utforskeren bruker åttetallsimmersjonen med a = 2: et tverrsnitt formet som et åttetall som føres rundt en sirkel mens det dreies en halv omdreining. Flaten skjærer seg selv langs sirkelen med radius 2 i planet z = 0.",
        ],
      },
    ],
    experimentsHeading: "Prøv dette",
    experiments: [
      {
        title: "Følg den ene kanten",
        text: "Behold én halvomdreining, slå av «Auto-rotasjon» og dra sakte. Følg ytterkanten med øynene: Den går to ganger rundt før den møter seg selv. Med 2 halvomdreininger er det to atskilte kanter.",
      },
      {
        title: "Kuttet i tredjedeler",
        text: "Trykk på forhåndsvalget 1/3 og deretter på «Åpne kuttet». Den ravfargede midterste tredjedelen er et smalere Möbiusbånd, den ytre delen er ett langt bånd, og de kan ikke trekkes fra hverandre uten å klippe på nytt. Trykk så på «midtlinjen»: Spalten går hele veien rundt, og likevel forblir båndet i ett stykke.",
      },
      {
        title: "Oddetall mot partall",
        text: "Gå gjennom 1, 2, 3, 4 og 5 halvomdreininger med bredden på 0,5. 3 og 5 oppfører seg som 1 (én side, én kant); 2 og 4 er forkledde tosidige sylindere.",
      },
      {
        title: "Finn selvskjæringen",
        text: "Bytt til Kleinflasken og senk rotasjonshastigheten til omtrent 0,15. Se på midten av figuren: Røret går gjennom seg selv langs en ring, prisen for å vise et firedimensjonalt objekt i tre dimensjoner.",
      },
    ],
  },
};
