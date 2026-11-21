import type { ExplorerGuide } from "./types";

// Numbers quoted here (depth 1 to 7, default 5, branch length halving, root
// length a quarter of the shorter side, the 1.4 s slide with its 2x zoom) match
// app/banach/explorer/page.tsx; update both together.
const WALK_EXCERPT = `// 0 = a, 1 = a⁻¹, 2 = b, 3 = b⁻¹; INV pairs each with its inverse.
const INV = [1, 0, 3, 2] as const;
const SHRINK = 0.5;

const walk = (px, py, prevDir, first, len, d) => {
  if (d >= depth) return;
  for (let i = 0; i < 4; i++) {
    // Never step back along the inverse: words stay reduced.
    if (prevDir !== null && i === INV[prevDir]) continue;
    const nx = px + DIRS[i].dx * len;
    const ny = py + DIRS[i].dy * len;
    const firstLetter = first === null ? i : first;
    segs.push({ x1: px, y1: py, x2: nx, y2: ny, first: firstLetter, depth: d });
    walk(nx, ny, i, firstLetter, len * SHRINK, d + 1);
  }
};`;

const PIECES_FORMULA = "F_2 = W(a) \\sqcup a\\,W(a^{-1}) = W(b) \\sqcup b\\,W(b^{-1})";

export const BANACH_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "See the heart of the Banach-Tarski paradox: the free group F₂ drawn as a Cayley tree, split into four pieces, where one shifted piece becomes three.",
    heading: "How this explorer works",
    intro:
      "The branching cross is a map of a group, not a picture of a ball. Its centre is the identity, and every other dot is one way of combining two rotations a and b and their inverses. Coloured by the first letter of their word, the dots fall into four pieces. The surprise, and the engine of the Banach-Tarski paradox, is that one piece, moved by a single step, covers three of the four pieces plus the centre.",
    sections: [
      {
        heading: "Two rotations, no relations",
        paragraphs: [
          "Take two rotations of a sphere, a and b. Combining them gives words like ab, a⁻¹b⁻¹a or bbb. A letter next to its own inverse, as in abb⁻¹, cancels; what remains is a reduced word. For well-chosen rotations, different reduced words are always different rotations. The group they generate is then the free group on two generators, F₂. A classical choice is two rotations by the angle arccos(1/3) about perpendicular axes.",
          "Every element of F₂ except the identity starts with one of four letters. Write W(a) for all reduced words starting with a, and similarly W(a⁻¹), W(b), W(b⁻¹). Together with the identity e they split the whole group into five disjoint parts. Now multiply every word in W(a⁻¹) on the left by a. The leading a⁻¹ cancels, and what remains is every reduced word that does not start with a, including e. So one piece, shifted once, covers everything except W(a).",
        ],
        formula: PIECES_FORMULA,
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "Tree depth, from 1 to 7 (default 5), sets how many letters long the drawn words may be. Each new level multiplies the newest words by three, because every word can be extended by any letter except the inverse of its last one. At depth d the picture contains 2 · 3ᵈ − 1 dots: 485 at the default depth, 4373 at depth 7.",
          "The four buttons W(a), W(a⁻¹), W(b) and W(b⁻¹) highlight one piece and dim the rest; pressing the active one again clears the selection. Colours follow the generators: a points right, a⁻¹ left, b up, b⁻¹ down. Once a piece is selected, Show the trick slides it one step towards the centre and doubles its size on the way, the visual version of multiplying it by the inverse of its first letter, and a caption spells out the identity: W(g) shifted by g⁻¹ covers F₂ without W(g⁻¹).",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "The tree is drawn on a 2D canvas by a short recursive walk. From the centre it tries all four directions, skips the one that would undo the previous step (that would give a non-reduced word), and recurses with the branch length halved. Every segment remembers the first letter of its word, so colouring by piece needs no second pass. The root branch is a quarter of the canvas's shorter side; since lengths halve, the tree reaches at most twice that far and always fits.",
          "The trick is a transformation of the finished drawing, not a recomputation: every segment and dot of the highlighted piece shifts by one root length towards the inverse generator and is scaled by two about the centre, eased over 1.4 seconds. Only the edge that ends up between the centre and its neighbour keeps its length. The canvas redraws only when depth, selection, animation progress or size changes. If your system asks for reduced motion, the animation is skipped and the end state with its caption appears at once.",
        ],
        code: WALK_EXCERPT,
      },
      {
        heading: "From the tree to two balls",
        paragraphs: [
          "The animation needs one footnote. Branches are drawn half as long at every level so that the infinite tree fits on screen, and a piece that only slid would be half the size of the three subtrees it has to cover. So the explorer doubles the piece while it moves, and it lands exactly. The doubling belongs to the drawing, not to the mathematics: in the group there is no notion of size at all, only counting, and the tree has exponentially many words at each length. There is no way to give these pieces sizes that add up consistently, and that is what makes them paradoxical.",
          "Felix Hausdorff moved this onto the sphere in 1914: let F₂ act by rotations, use the Axiom of Choice to pick one point from every orbit, and carry the group's pieces over to the sphere. Banach and Tarski extended it to the solid ball in 1924, and Raphael Robinson showed in 1947 that five pieces are enough and fewer are not. In the plane nothing like this can happen with rigid motions alone, because the group of rigid motions of the plane is solvable and contains no free group on two generators. The paradox needs three dimensions.",
        ],
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "Watch one piece become three",
        text: "Keep depth at 5, select W(a⁻¹) and press Show the trick. The violet piece slides right and grows until its first node sits on the identity. Its branches now lie exactly on the pieces W(b), W(b⁻¹) and W(a⁻¹), one level short of the drawn depth: everything except W(a).",
      },
      {
        title: "Count the explosion",
        text: "Set depth to 1, then 2, 3 and so on. The number of newest words goes 4, 12, 36, 108, multiplying by three each time. In a flat grid the number of points at distance n grows only linearly; that exponential growth is what leaves room for a piece to contain copies of the rest.",
      },
      {
        title: "Two copies from four pieces",
        text: "Run the trick on W(a⁻¹): the shifted piece fills every arm except the one pointing right, and that missing arm is exactly W(a). Together they give back the entire group. Then run it on W(b⁻¹) and check that W(b) fills the gap. Four pieces, two full copies of F₂. That is the group version of one ball becoming two.",
      },
    ],
  },
  de: {
    metaDescription:
      "Das Herz des Banach-Tarski-Paradoxons: die freie Gruppe F₂ als Cayley-Baum, zerlegt in vier Stücke, von denen eines verschoben zu dreien wird.",
    heading: "So funktioniert dieser Explorer",
    intro:
      "Das verzweigte Kreuz ist eine Landkarte einer Gruppe, kein Bild einer Kugel. In der Mitte sitzt die Identität, und jeder andere Punkt ist eine Art, zwei Drehungen a und b samt ihren Inversen hintereinander auszuführen. Färbst du die Punkte nach dem Anfangsbuchstaben ihres Wortes, zerfallen sie in vier Stücke. Das Überraschende, und der Motor des Banach-Tarski-Paradoxons: Eines dieser Stücke, um einen einzigen Schritt verschoben, überdeckt drei der vier Stücke plus die Mitte.",
    sections: [
      {
        heading: "Zwei Drehungen, keine Relationen",
        paragraphs: [
          "Nimm zwei Drehungen einer Kugeloberfläche, a und b. Hintereinander ausgeführt ergeben sie Wörter wie ab, a⁻¹b⁻¹a oder bbb. Ein Buchstabe neben seinem eigenen Inversen, etwa in abb⁻¹, kürzt sich weg; was bleibt, heißt reduziertes Wort. Bei geschickt gewählten Drehungen sind verschiedene reduzierte Wörter immer verschiedene Drehungen. Die erzeugte Gruppe ist dann die freie Gruppe mit zwei Erzeugern, F₂. Eine klassische Wahl sind zwei Drehungen um den Winkel arccos(1/3) um zueinander senkrechte Achsen.",
          "Jedes Element von F₂ außer der Identität beginnt mit einem von vier Buchstaben. W(a) sind alle reduzierten Wörter, die mit a anfangen, entsprechend W(a⁻¹), W(b) und W(b⁻¹). Zusammen mit der Identität e zerlegen sie die ganze Gruppe in fünf disjunkte Teile. Multiplizierst du nun jedes Wort aus W(a⁻¹) von links mit a, kürzt sich das führende a⁻¹ weg. Übrig bleibt jedes reduzierte Wort, das nicht mit a beginnt, e eingeschlossen. Ein Stück, einmal verschoben, überdeckt also alles außer W(a).",
        ],
        formula: PIECES_FORMULA,
      },
      {
        heading: "Was die Regler bewirken",
        paragraphs: [
          "Die Baumtiefe von 1 bis 7 (Voreinstellung 5) legt fest, wie viele Buchstaben die gezeichneten Wörter höchstens haben. Jede neue Ebene verdreifacht die neuesten Wörter, weil sich jedes Wort um jeden Buchstaben verlängern lässt, nur nicht um das Inverse seines letzten. Bei Tiefe d enthält das Bild 2 · 3ᵈ − 1 Punkte: 485 bei der Voreinstellung, 4373 bei Tiefe 7.",
          "Die vier Knöpfe W(a), W(a⁻¹), W(b) und W(b⁻¹) heben ein Stück hervor und dimmen den Rest; ein zweiter Klick auf den aktiven Knopf hebt die Auswahl auf. Die Farben folgen den Erzeugern: a zeigt nach rechts, a⁻¹ nach links, b nach oben, b⁻¹ nach unten. Ist ein Stück gewählt, schiebt «Den Trick zeigen» es einen Schritt zur Mitte und verdoppelt dabei seine Größe, die sichtbare Fassung der Multiplikation mit dem Inversen seines Anfangsbuchstabens. Eine Beschriftung nennt die Identität dazu: W(g), verschoben um g⁻¹, überdeckt F₂ ohne W(g⁻¹).",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Der Baum entsteht auf einem 2D-Canvas durch einen kurzen rekursiven Lauf. Von der Mitte aus probiert er alle vier Richtungen, überspringt die, die den letzten Schritt rückgängig machen würde (das ergäbe ein nicht reduziertes Wort), und steigt mit halbierter Astlänge tiefer. Jedes Segment merkt sich den Anfangsbuchstaben seines Wortes, das Färben nach Stücken braucht also keinen zweiten Durchgang. Der Wurzelast ist ein Viertel der kürzeren Canvas-Seite. Weil sich die Längen halbieren, reicht der Baum höchstens doppelt so weit und passt immer.",
          "Der Trick ist eine Transformation der fertigen Zeichnung, keine Neuberechnung: Jedes Segment und jeder Punkt des gewählten Stücks wandert um eine Wurzelastlänge in Richtung des inversen Erzeugers und wird um die Mitte auf das Doppelte gestreckt, sanft beschleunigt und gebremst über 1,4 Sekunden. Nur die Kante, die am Ende zwischen der Mitte und ihrem Nachbarknoten liegt, behält ihre Länge. Das Canvas zeichnet nur neu, wenn sich Tiefe, Auswahl, Animationsfortschritt oder Größe ändern. Wünscht dein System reduzierte Bewegung, entfällt die Animation, und der Endzustand mit Beschriftung erscheint sofort.",
        ],
        code: WALK_EXCERPT,
      },
      {
        heading: "Vom Baum zu zwei Kugeln",
        paragraphs: [
          "Die Animation braucht eine Fußnote. Äste werden auf jeder Ebene halb so lang gezeichnet, damit der unendliche Baum auf den Bildschirm passt, und ein nur verschobenes Stück wäre halb so groß wie die drei Teilbäume, die es überdecken soll. Deshalb verdoppelt der Explorer das Stück, während es wandert, und es landet genau. Die Verdopplung gehört zur Zeichnung, nicht zur Mathematik: In der Gruppe gibt es überhaupt keine Größe, nur Abzählen, und der Baum hat zu jeder Länge exponentiell viele Wörter. Es gibt keine Möglichkeit, diesen Stücken Größen zu geben, die sich widerspruchsfrei addieren. Deshalb sind sie paradox.",
          "Felix Hausdorff übertrug das 1914 auf die Kugeloberfläche: F₂ wirkt durch Drehungen, das Auswahlaxiom wählt aus jeder Bahn einen Punkt, und die Stücke der Gruppe wandern auf die Sphäre. Banach und Tarski erweiterten das 1924 auf die volle Kugel, und Raphael Robinson zeigte 1947, dass fünf Stücke genügen und weniger nicht. In der Ebene ist so etwas allein mit starren Bewegungen unmöglich, weil die Gruppe ihrer starren Bewegungen auflösbar ist und keine freie Gruppe mit zwei Erzeugern enthält. Das Paradoxon braucht drei Dimensionen.",
        ],
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Aus einem Stück werden drei",
        text: "Lass die Tiefe auf 5, wähl W(a⁻¹) und drück «Den Trick zeigen». Das violette Stück gleitet nach rechts und wächst, bis sein erster Knoten auf der Identität sitzt. Seine Äste liegen jetzt genau auf den Stücken W(b), W(b⁻¹) und W(a⁻¹), eine Ebene kürzer als die gezeichnete Tiefe: alles außer W(a).",
      },
      {
        title: "Die Explosion zählen",
        text: "Stell die Tiefe auf 1, dann 2, 3 und so weiter. Die Zahl der neuesten Wörter geht 4, 12, 36, 108, jedes Mal mal drei. In einem flachen Gitter wächst die Zahl der Punkte im Abstand n nur linear. Erst dieses exponentielle Wachstum lässt Platz dafür, dass ein Stück Kopien des Rests enthält.",
      },
      {
        title: "Zwei Kopien aus vier Stücken",
        text: "Führ den Trick mit W(a⁻¹) aus: Das verschobene Stück füllt jeden Arm außer dem nach rechts, und genau dieser fehlende Arm ist W(a). Zusammen ergeben sie wieder die ganze Gruppe. Mach das Gleiche mit W(b⁻¹) und prüf, dass W(b) die Lücke füllt. Vier Stücke, zwei vollständige Kopien von F₂. Das ist die Gruppenfassung davon, dass aus einer Kugel zwei werden.",
      },
    ],
  },
  es: {
    metaDescription:
      "El corazón de la paradoja de Banach-Tarski: el grupo libre F₂ dibujado como árbol de Cayley y partido en cuatro piezas: una, desplazada, se convierte en tres.",
    heading: "Cómo funciona este explorador",
    intro:
      "La cruz ramificada es el mapa de un grupo, no el dibujo de una bola. Su centro es la identidad, y cada uno de los demás puntos es una manera de combinar dos rotaciones a y b y sus inversas. Coloreados según la primera letra de su palabra, los puntos se reparten en cuatro piezas. La sorpresa, y el motor de la paradoja de Banach-Tarski, es que una sola pieza, movida un único paso, cubre tres de las cuatro piezas más el centro.",
    sections: [
      {
        heading: "Dos rotaciones, ninguna relación",
        paragraphs: [
          "Toma dos rotaciones de una esfera, a y b. Al combinarlas salen palabras como ab, a⁻¹b⁻¹a o bbb. Una letra junto a su propia inversa, como en abb⁻¹, se cancela; lo que queda es una palabra reducida. Con rotaciones bien elegidas, palabras reducidas distintas son siempre rotaciones distintas. El grupo que generan es entonces el grupo libre con dos generadores, F₂. Una elección clásica son dos rotaciones de ángulo arccos(1/3) alrededor de ejes perpendiculares.",
          "Todo elemento de F₂ salvo la identidad empieza por una de cuatro letras. Llama W(a) al conjunto de todas las palabras reducidas que empiezan por a, y de forma análoga W(a⁻¹), W(b) y W(b⁻¹). Junto con la identidad e, dividen el grupo entero en cinco partes disjuntas. Ahora multiplica por la izquierda cada palabra de W(a⁻¹) por a. La a⁻¹ inicial se cancela, y lo que queda son todas las palabras reducidas que no empiezan por a, incluida e. Así que una pieza, desplazada una vez, lo cubre todo excepto W(a).",
        ],
        formula: PIECES_FORMULA,
      },
      {
        heading: "Qué hacen los controles",
        paragraphs: [
          "«Profundidad del árbol», de 1 a 7 (por defecto 5), fija cuántas letras pueden tener como máximo las palabras dibujadas. Cada nivel nuevo multiplica por tres las palabras más recientes, porque toda palabra puede alargarse con cualquier letra salvo la inversa de la última. A profundidad d, el dibujo contiene 2 · 3ᵈ − 1 puntos: 485 a la profundidad por defecto, 4373 a profundidad 7.",
          "Los cuatro botones W(a), W(a⁻¹), W(b) y W(b⁻¹) resaltan una pieza y atenúan el resto; al pulsar de nuevo el botón activo se quita la selección. Los colores siguen a los generadores: a apunta a la derecha, a⁻¹ a la izquierda, b hacia arriba, b⁻¹ hacia abajo. Con una pieza seleccionada, «Mostrar el truco» la desliza un paso hacia el centro y duplica su tamaño por el camino, la versión visual de multiplicarla por la inversa de su primera letra, y un rótulo enuncia la identidad: W(g) desplazada por g⁻¹ cubre F₂ sin W(g⁻¹).",
        ],
      },
      {
        heading: "Cómo está construido",
        paragraphs: [
          "El árbol se dibuja en un lienzo 2D mediante un breve recorrido recursivo. Desde el centro prueba las cuatro direcciones, se salta la que desharía el paso anterior (eso daría una palabra no reducida) y sigue recursivamente con la longitud de la rama reducida a la mitad. Cada segmento recuerda la primera letra de su palabra, así que colorear por piezas no requiere una segunda pasada. La rama raíz mide un cuarto del lado más corto del lienzo; como las longitudes se van dividiendo entre dos, el árbol llega como mucho al doble de esa distancia y siempre cabe.",
          "El truco es una transformación del dibujo ya terminado, no un nuevo cálculo: cada segmento y cada punto de la pieza resaltada se desplaza una longitud de raíz hacia el generador inverso y se escala al doble respecto al centro, con una aceleración y un frenado suaves a lo largo de 1,4 segundos. Solo la arista que acaba entre el centro y su vecino conserva su longitud. El lienzo se redibuja únicamente cuando cambian la profundidad, la selección, el avance de la animación o el tamaño. Si tu sistema pide movimiento reducido, la animación se omite y el estado final aparece de inmediato con su rótulo.",
        ],
        code: WALK_EXCERPT,
      },
      {
        heading: "Del árbol a dos bolas",
        paragraphs: [
          "La animación necesita una nota al pie. Las ramas se dibujan la mitad de largas en cada nivel para que el árbol infinito quepa en la pantalla, y una pieza que solo se deslizara tendría la mitad del tamaño de los tres subárboles que debe cubrir. Por eso el explorador duplica la pieza mientras se mueve, y encaja exactamente. La duplicación pertenece al dibujo, no a las matemáticas: en el grupo no existe ninguna noción de tamaño, solo de recuento, y el árbol tiene una cantidad exponencial de palabras de cada longitud. No hay manera de asignar a estas piezas tamaños que se sumen de forma coherente, y eso es lo que las hace paradójicas.",
          "Felix Hausdorff trasladó esto a la esfera en 1914: deja que F₂ actúe mediante rotaciones, usa el axioma de elección para escoger un punto de cada órbita y lleva las piezas del grupo a la esfera. Banach y Tarski lo extendieron a la bola maciza en 1924, y Raphael Robinson demostró en 1947 que bastan cinco piezas y que con menos no se puede. En el plano no puede ocurrir nada parecido solo con movimientos rígidos, porque el grupo de los movimientos rígidos del plano es resoluble y no contiene ningún grupo libre con dos generadores. La paradoja necesita tres dimensiones.",
        ],
      },
    ],
    experimentsHeading: "Prueba esto",
    experiments: [
      {
        title: "Mira cómo una pieza se vuelve tres",
        text: "Deja la profundidad en 5, selecciona W(a⁻¹) y pulsa «Mostrar el truco». La pieza violeta se desliza hacia la derecha y crece hasta que su primer nodo queda sobre la identidad. Sus ramas descansan ahora exactamente sobre las piezas W(b), W(b⁻¹) y W(a⁻¹), un nivel por debajo de la profundidad dibujada: todo excepto W(a).",
      },
      {
        title: "Cuenta la explosión",
        text: "Pon la profundidad en 1, luego en 2, en 3 y así sucesivamente. El número de palabras más recientes va 4, 12, 36, 108, multiplicándose por tres cada vez. En una cuadrícula plana, el número de puntos a distancia n crece solo linealmente; ese crecimiento exponencial es lo que deja sitio para que una pieza contenga copias del resto.",
      },
      {
        title: "Dos copias a partir de cuatro piezas",
        text: "Aplica el truco a W(a⁻¹): la pieza desplazada llena todos los brazos salvo el que apunta a la derecha, y ese brazo que falta es exactamente W(a). Juntas devuelven el grupo entero. Después aplícalo a W(b⁻¹) y comprueba que W(b) rellena el hueco. Cuatro piezas, dos copias completas de F₂. Esa es la versión para grupos de una bola que se convierte en dos.",
      },
    ],
  },
  fr: {
    metaDescription:
      "Le cœur du paradoxe de Banach-Tarski : le groupe libre F₂ dessiné en arbre de Cayley et découpé en quatre morceaux, dont un seul, décalé, en devient trois.",
    heading: "Comment fonctionne cet explorateur",
    intro:
      "La croix ramifiée est la carte d'un groupe, pas l'image d'une boule. Son centre est l'identité, et chaque autre point est une façon de combiner deux rotations a et b et leurs inverses. Coloriés selon la première lettre de leur mot, les points se répartissent en quatre morceaux. La surprise, et le moteur du paradoxe de Banach-Tarski, c'est qu'un seul morceau, déplacé d'un unique pas, recouvre trois des quatre morceaux plus le centre.",
    sections: [
      {
        heading: "Deux rotations, aucune relation",
        paragraphs: [
          "Prends deux rotations d'une sphère, a et b. En les combinant, on obtient des mots comme ab, a⁻¹b⁻¹a ou bbb. Une lettre placée à côté de son propre inverse, comme dans abb⁻¹, se simplifie ; ce qui reste est un mot réduit. Pour des rotations bien choisies, des mots réduits différents sont toujours des rotations différentes. Le groupe qu'elles engendrent est alors le groupe libre à deux générateurs, F₂. Un choix classique : deux rotations d'angle arccos(1/3) autour d'axes perpendiculaires.",
          "Tout élément de F₂, à part l'identité, commence par l'une de quatre lettres. Note W(a) l'ensemble des mots réduits qui commencent par a, et de même W(a⁻¹), W(b) et W(b⁻¹). Avec l'identité e, ils partagent le groupe entier en cinq parties disjointes. Multiplie maintenant à gauche par a chaque mot de W(a⁻¹). Le a⁻¹ initial se simplifie, et il reste tous les mots réduits qui ne commencent pas par a, e compris. Un seul morceau, décalé une fois, recouvre donc tout sauf W(a).",
        ],
        formula: PIECES_FORMULA,
      },
      {
        heading: "À quoi servent les commandes",
        paragraphs: [
          "« Profondeur de l'arbre », de 1 à 7 (5 par défaut), fixe le nombre maximal de lettres des mots dessinés. Chaque nouveau niveau multiplie par trois les mots les plus récents, car tout mot peut être prolongé par n'importe quelle lettre sauf l'inverse de sa dernière. À la profondeur d, l'image contient 2 · 3ᵈ − 1 points : 485 à la profondeur par défaut, 4\u00a0373 à la profondeur 7.",
          "Les quatre boutons W(a), W(a⁻¹), W(b) et W(b⁻¹) mettent un morceau en évidence et estompent le reste ; un nouvel appui sur le bouton actif annule la sélection. Les couleurs suivent les générateurs : a pointe vers la droite, a⁻¹ vers la gauche, b vers le haut, b⁻¹ vers le bas. Une fois un morceau sélectionné, « Montrer le tour » le fait glisser d'un pas vers le centre et double sa taille en chemin, version visuelle de sa multiplication par l'inverse de sa première lettre, et une légende énonce l'identité : W(g) décalé par g⁻¹ recouvre F₂ privé de W(g⁻¹).",
        ],
      },
      {
        heading: "Comment c'est construit",
        paragraphs: [
          "L'arbre est dessiné sur un canevas 2D par un court parcours récursif. Depuis le centre, il essaie les quatre directions, saute celle qui annulerait le pas précédent (cela donnerait un mot non réduit) et poursuit récursivement avec une longueur de branche divisée par deux. Chaque segment retient la première lettre de son mot, si bien que le coloriage par morceau ne demande aucun second passage. La branche racine mesure un quart du plus petit côté du canevas ; comme les longueurs sont divisées par deux à chaque fois, l'arbre s'étend au plus deux fois plus loin et tient toujours dans le cadre.",
          "Le tour est une transformation du dessin terminé, pas un nouveau calcul : chaque segment et chaque point du morceau mis en évidence se décale d'une longueur de racine vers le générateur inverse et subit un agrandissement de rapport deux par rapport au centre, avec un départ et une arrivée en douceur, sur 1,4 seconde. Seule l'arête qui finit entre le centre et son voisin garde sa longueur. Le canevas n'est redessiné que lorsque la profondeur, la sélection, l'avancement de l'animation ou la taille changent. Si ton système demande une réduction des animations, l'animation est sautée et l'état final apparaît aussitôt avec sa légende.",
        ],
        code: WALK_EXCERPT,
      },
      {
        heading: "De l'arbre à deux boules",
        paragraphs: [
          "L'animation appelle une note de bas de page. Les branches sont dessinées deux fois plus courtes à chaque niveau pour que l'arbre infini tienne à l'écran, et un morceau qui se contenterait de glisser ferait la moitié de la taille des trois sous-arbres qu'il doit recouvrir. L'explorateur double donc le morceau pendant son déplacement, et il se pose exactement. Ce doublement appartient au dessin, pas aux mathématiques : dans le groupe, il n'existe aucune notion de taille, seulement le dénombrement, et l'arbre compte un nombre exponentiel de mots de chaque longueur. Il est impossible d'attribuer à ces morceaux des tailles qui s'additionnent de façon cohérente, et c'est ce qui les rend paradoxaux.",
          "Felix Hausdorff a transporté cela sur la sphère en 1914 : on fait agir F₂ par rotations, on utilise l'axiome du choix pour prendre un point dans chaque orbite, et on reporte les morceaux du groupe sur la sphère. Banach et Tarski l'ont étendu à la boule pleine en 1924, et Raphael Robinson a montré en 1947 que cinq morceaux suffisent et qu'on ne peut pas faire avec moins. Dans le plan, rien de tel ne peut se produire avec les seuls déplacements rigides, car le groupe des déplacements rigides du plan est résoluble et ne contient aucun groupe libre à deux générateurs. Le paradoxe a besoin de trois dimensions.",
        ],
      },
    ],
    experimentsHeading: "À essayer",
    experiments: [
      {
        title: "Regarde un morceau en devenir trois",
        text: "Garde la profondeur à 5, sélectionne W(a⁻¹) et appuie sur « Montrer le tour ». Le morceau violet glisse vers la droite et grandit jusqu'à ce que son premier nœud se pose sur l'identité. Ses branches reposent maintenant exactement sur les morceaux W(b), W(b⁻¹) et W(a⁻¹), un niveau en deçà de la profondeur dessinée : tout sauf W(a).",
      },
      {
        title: "Compte l'explosion",
        text: "Règle la profondeur sur 1, puis 2, 3 et ainsi de suite. Le nombre de mots les plus récents vaut 4, 12, 36, 108 : il est multiplié par trois à chaque fois. Dans une grille plane, le nombre de points à distance n ne croît que linéairement ; c'est cette croissance exponentielle qui laisse à un morceau la place de contenir des copies du reste.",
      },
      {
        title: "Deux copies à partir de quatre morceaux",
        text: "Lance le tour sur W(a⁻¹) : le morceau décalé remplit tous les bras sauf celui qui pointe vers la droite, et ce bras manquant est exactement W(a). À eux deux, ils redonnent le groupe entier. Lance-le ensuite sur W(b⁻¹) et vérifie que W(b) comble le vide. Quatre morceaux, deux copies complètes de F₂. C'est la version, pour les groupes, d'une boule qui en devient deux.",
      },
    ],
  },
  it: {
    metaDescription:
      "Il cuore del paradosso di Banach-Tarski: il gruppo libero F₂ disegnato come albero di Cayley e diviso in quattro pezzi, dove un pezzo traslato diventa tre.",
    heading: "Come funziona questo esploratore",
    intro:
      "La croce ramificata è la mappa di un gruppo, non l'immagine di una palla. Il suo centro è l'identità, e ogni altro punto è un modo di combinare due rotazioni a e b e le loro inverse. Colorati secondo la prima lettera della loro parola, i punti si dividono in quattro pezzi. La sorpresa, e il motore del paradosso di Banach-Tarski, è che un solo pezzo, spostato di un unico passo, copre tre dei quattro pezzi più il centro.",
    sections: [
      {
        heading: "Due rotazioni, nessuna relazione",
        paragraphs: [
          "Prendi due rotazioni di una sfera, a e b. Combinandole si ottengono parole come ab, a⁻¹b⁻¹a o bbb. Una lettera accanto alla propria inversa, come in abb⁻¹, si cancella; ciò che resta è una parola ridotta. Per rotazioni scelte bene, parole ridotte diverse sono sempre rotazioni diverse. Il gruppo che generano è allora il gruppo libero su due generatori, F₂. Una scelta classica sono due rotazioni di angolo arccos(1/3) attorno ad assi perpendicolari.",
          "Ogni elemento di F₂ tranne l'identità comincia con una di quattro lettere. Chiama W(a) l'insieme di tutte le parole ridotte che cominciano con a, e allo stesso modo W(a⁻¹), W(b) e W(b⁻¹). Insieme all'identità e, dividono l'intero gruppo in cinque parti disgiunte. Ora moltiplica a sinistra per a ogni parola di W(a⁻¹). La a⁻¹ iniziale si cancella, e restano tutte le parole ridotte che non cominciano con a, compresa e. Quindi un pezzo, spostato una volta, copre tutto tranne W(a).",
        ],
        formula: PIECES_FORMULA,
      },
      {
        heading: "Che cosa fanno i controlli",
        paragraphs: [
          "«Profondità dell'albero», da 1 a 7 (predefinita 5), stabilisce quante lettere possono avere al massimo le parole disegnate. Ogni nuovo livello moltiplica per tre le parole più recenti, perché ogni parola può essere prolungata con qualsiasi lettera tranne l'inversa dell'ultima. Alla profondità d l'immagine contiene 2 · 3ᵈ − 1 punti: 485 alla profondità predefinita, 4373 alla profondità 7.",
          "I quattro pulsanti W(a), W(a⁻¹), W(b) e W(b⁻¹) evidenziano un pezzo e attenuano il resto; premendo di nuovo quello attivo la selezione si annulla. I colori seguono i generatori: a punta a destra, a⁻¹ a sinistra, b in alto, b⁻¹ in basso. Una volta selezionato un pezzo, «Mostra il trucco» lo fa scorrere di un passo verso il centro e ne raddoppia la dimensione lungo il tragitto, la versione visiva della moltiplicazione per l'inversa della sua prima lettera, e una didascalia enuncia l'identità: W(g) traslato di g⁻¹ copre F₂ senza W(g⁻¹).",
        ],
      },
      {
        heading: "Com'è costruito",
        paragraphs: [
          "L'albero è disegnato su un canvas 2D da una breve visita ricorsiva. Dal centro prova tutte e quattro le direzioni, salta quella che annullerebbe il passo precedente (darebbe una parola non ridotta) e prosegue ricorsivamente con la lunghezza del ramo dimezzata. Ogni segmento ricorda la prima lettera della propria parola, quindi colorare per pezzi non richiede una seconda passata. Il ramo radice è un quarto del lato più corto del canvas; poiché le lunghezze si dimezzano, l'albero arriva al massimo al doppio di quella distanza e ci sta sempre.",
          "Il trucco è una trasformazione del disegno finito, non un nuovo calcolo: ogni segmento e ogni punto del pezzo evidenziato si sposta di una lunghezza di radice verso il generatore inverso e viene scalato di un fattore due rispetto al centro, con partenza e arrivo morbidi nell'arco di 1,4 secondi. Solo lo spigolo che finisce tra il centro e il suo vicino mantiene la propria lunghezza. Il canvas viene ridisegnato solo quando cambiano la profondità, la selezione, l'avanzamento dell'animazione o le dimensioni. Se il tuo sistema chiede di ridurre il movimento, l'animazione viene saltata e lo stato finale compare subito con la sua didascalia.",
        ],
        code: WALK_EXCERPT,
      },
      {
        heading: "Dall'albero a due palle",
        paragraphs: [
          "L'animazione ha bisogno di una nota a piè di pagina. I rami sono disegnati lunghi la metà a ogni livello perché l'albero infinito stia sullo schermo, e un pezzo che si limitasse a scorrere sarebbe grande la metà dei tre sottoalberi che deve coprire. Per questo l'esploratore raddoppia il pezzo mentre si muove, e così atterra esattamente. Il raddoppio appartiene al disegno, non alla matematica: nel gruppo non esiste alcuna nozione di grandezza, solo il contare, e l'albero ha un numero esponenziale di parole per ogni lunghezza. Non c'è modo di assegnare a questi pezzi grandezze che si sommino in modo coerente, ed è questo a renderli paradossali.",
          "Felix Hausdorff portò tutto questo sulla sfera nel 1914: si fa agire F₂ per rotazioni, si usa l'assioma della scelta per prendere un punto da ogni orbita e si trasferiscono i pezzi del gruppo sulla sfera. Banach e Tarski lo estesero alla palla piena nel 1924, e Raphael Robinson dimostrò nel 1947 che cinque pezzi bastano e meno no. Nel piano niente del genere può accadere con i soli movimenti rigidi, perché il gruppo dei movimenti rigidi del piano è risolubile e non contiene alcun gruppo libero su due generatori. Il paradosso ha bisogno di tre dimensioni.",
        ],
      },
    ],
    experimentsHeading: "Prova così",
    experiments: [
      {
        title: "Guarda un pezzo diventare tre",
        text: "Lascia la profondità a 5, seleziona W(a⁻¹) e premi «Mostra il trucco». Il pezzo viola scorre verso destra e cresce finché il suo primo nodo non si posa sull'identità. I suoi rami ora giacciono esattamente sui pezzi W(b), W(b⁻¹) e W(a⁻¹), un livello in meno della profondità disegnata: tutto tranne W(a).",
      },
      {
        title: "Conta l'esplosione",
        text: "Imposta la profondità a 1, poi a 2, a 3 e così via. Il numero delle parole più recenti fa 4, 12, 36, 108, moltiplicandosi per tre ogni volta. In una griglia piana il numero di punti a distanza n cresce solo linearmente; è questa crescita esponenziale a lasciare spazio perché un pezzo contenga copie del resto.",
      },
      {
        title: "Due copie da quattro pezzi",
        text: "Esegui il trucco su W(a⁻¹): il pezzo traslato riempie ogni braccio tranne quello che punta a destra, e quel braccio mancante è esattamente W(a). Insieme restituiscono l'intero gruppo. Poi eseguilo su W(b⁻¹) e verifica che W(b) riempia il vuoto. Quattro pezzi, due copie complete di F₂. È la versione per i gruppi di una palla che diventa due.",
      },
    ],
  },
  pt: {
    metaDescription:
      "O coração do paradoxo de Banach-Tarski: o grupo livre F₂ desenhado como árvore de Cayley e dividido em quatro peças, em que uma peça deslocada se torna três.",
    heading: "Como funciona este explorador",
    intro:
      "A cruz ramificada é o mapa de um grupo, não a imagem de uma bola. O seu centro é a identidade, e cada um dos outros pontos é uma maneira de combinar duas rotações a e b e as suas inversas. Coloridos pela primeira letra da sua palavra, os pontos repartem-se por quatro peças. A surpresa, e o motor do paradoxo de Banach-Tarski, é que uma só peça, movida um único passo, cobre três das quatro peças mais o centro.",
    sections: [
      {
        heading: "Duas rotações, nenhuma relação",
        paragraphs: [
          "Toma duas rotações de uma esfera, a e b. Combinando-as obtêm-se palavras como ab, a⁻¹b⁻¹a ou bbb. Uma letra ao lado da sua própria inversa, como em abb⁻¹, cancela-se; o que sobra é uma palavra reduzida. Para rotações bem escolhidas, palavras reduzidas diferentes são sempre rotações diferentes. O grupo que elas geram é então o grupo livre com dois geradores, F₂. Uma escolha clássica são duas rotações de ângulo arccos(1/3) em torno de eixos perpendiculares.",
          "Todos os elementos de F₂, exceto a identidade, começam por uma de quatro letras. Chama W(a) ao conjunto de todas as palavras reduzidas que começam por a, e do mesmo modo W(a⁻¹), W(b) e W(b⁻¹). Juntamente com a identidade e, dividem o grupo inteiro em cinco partes disjuntas. Agora multiplica à esquerda por a cada palavra de W(a⁻¹). O a⁻¹ inicial cancela-se, e o que sobra são todas as palavras reduzidas que não começam por a, incluindo e. Portanto, uma peça, deslocada uma vez, cobre tudo exceto W(a).",
        ],
        formula: PIECES_FORMULA,
      },
      {
        heading: "O que fazem os controlos",
        paragraphs: [
          "«Profundidade da árvore», de 1 a 7 (predefinição 5), define quantas letras podem ter, no máximo, as palavras desenhadas. Cada novo nível multiplica por três as palavras mais recentes, porque qualquer palavra pode ser prolongada com qualquer letra exceto a inversa da última. À profundidade d, a imagem contém 2 · 3ᵈ − 1 pontos: 485 na profundidade predefinida, 4373 na profundidade 7.",
          "Os quatro botões W(a), W(a⁻¹), W(b) e W(b⁻¹) realçam uma peça e esbatem o resto; carregar de novo no botão ativo limpa a seleção. As cores seguem os geradores: a aponta para a direita, a⁻¹ para a esquerda, b para cima, b⁻¹ para baixo. Com uma peça selecionada, «Mostrar o truque» fá-la deslizar um passo em direção ao centro e duplica o seu tamanho pelo caminho, a versão visual de a multiplicar pela inversa da sua primeira letra, e uma legenda enuncia a identidade: W(g) deslocada por g⁻¹ cobre F₂ sem W(g⁻¹).",
        ],
      },
      {
        heading: "Como está construído",
        paragraphs: [
          "A árvore é desenhada num canvas 2D por um curto percurso recursivo. A partir do centro, experimenta as quatro direções, salta a que desfaria o passo anterior (isso daria uma palavra não reduzida) e prossegue recursivamente com o comprimento do ramo reduzido a metade. Cada segmento lembra-se da primeira letra da sua palavra, pelo que colorir por peças não exige uma segunda passagem. O ramo da raiz mede um quarto do lado mais curto do canvas; como os comprimentos se reduzem a metade, a árvore chega no máximo ao dobro dessa distância e cabe sempre.",
          "O truque é uma transformação do desenho já feito, não um novo cálculo: cada segmento e cada ponto da peça realçada desloca-se um comprimento de raiz em direção ao gerador inverso e é ampliado para o dobro em relação ao centro, com arranque e chegada suaves ao longo de 1,4 segundos. Só a aresta que acaba entre o centro e o seu vizinho mantém o comprimento. O canvas só é redesenhado quando mudam a profundidade, a seleção, o progresso da animação ou o tamanho. Se o teu sistema pedir movimento reduzido, a animação é saltada e o estado final aparece de imediato com a sua legenda.",
        ],
        code: WALK_EXCERPT,
      },
      {
        heading: "Da árvore a duas bolas",
        paragraphs: [
          "A animação precisa de uma nota de rodapé. Os ramos são desenhados com metade do comprimento em cada nível para que a árvore infinita caiba no ecrã, e uma peça que apenas deslizasse teria metade do tamanho das três subárvores que tem de cobrir. Por isso o explorador duplica a peça enquanto ela se move, e ela assenta exatamente. A duplicação pertence ao desenho, não à matemática: no grupo não existe qualquer noção de tamanho, apenas contagem, e a árvore tem um número exponencial de palavras de cada comprimento. Não há maneira de dar a estas peças tamanhos que se somem de forma coerente, e é isso que as torna paradoxais.",
          "Felix Hausdorff levou isto para a esfera em 1914: põe F₂ a atuar por rotações, usa o axioma da escolha para tirar um ponto de cada órbita e transporta as peças do grupo para a esfera. Banach e Tarski estenderam-no à bola maciça em 1924, e Raphael Robinson mostrou em 1947 que cinco peças chegam e menos não. No plano nada disto pode acontecer só com movimentos rígidos, porque o grupo dos movimentos rígidos do plano é resolúvel e não contém nenhum grupo livre com dois geradores. O paradoxo precisa de três dimensões.",
        ],
      },
    ],
    experimentsHeading: "Experimenta isto",
    experiments: [
      {
        title: "Vê uma peça tornar-se três",
        text: "Mantém a profundidade em 5, seleciona W(a⁻¹) e carrega em «Mostrar o truque». A peça violeta desliza para a direita e cresce até o seu primeiro nó ficar sobre a identidade. Os seus ramos assentam agora exatamente sobre as peças W(b), W(b⁻¹) e W(a⁻¹), um nível abaixo da profundidade desenhada: tudo exceto W(a).",
      },
      {
        title: "Conta a explosão",
        text: "Põe a profundidade em 1, depois em 2, em 3 e assim por diante. O número de palavras mais recentes vai 4, 12, 36, 108, multiplicando-se por três de cada vez. Numa grelha plana, o número de pontos à distância n cresce apenas linearmente; é esse crescimento exponencial que deixa espaço para uma peça conter cópias do resto.",
      },
      {
        title: "Duas cópias a partir de quatro peças",
        text: "Aplica o truque a W(a⁻¹): a peça deslocada preenche todos os braços exceto o que aponta para a direita, e esse braço em falta é exatamente W(a). Juntas devolvem o grupo inteiro. Depois aplica-o a W(b⁻¹) e confirma que W(b) preenche a lacuna. Quatro peças, duas cópias completas de F₂. É a versão para grupos de uma bola que se torna duas.",
      },
    ],
  },
  sv: {
    metaDescription:
      "Kärnan i Banach-Tarskis paradox: den fria gruppen F₂ ritad som ett Cayleyträd och delad i fyra bitar, där en enda förskjuten bit blir till tre.",
    heading: "Så fungerar den här utforskaren",
    intro:
      "Det förgrenade korset är en karta över en grupp, inte en bild av ett klot. Mitten är identiteten, och varje annan prick är ett sätt att kombinera två rotationer a och b och deras inverser. Färgade efter första bokstaven i sitt ord faller prickarna i fyra bitar. Överraskningen, och motorn i Banach-Tarskis paradox, är att en enda bit, flyttad ett enda steg, täcker tre av de fyra bitarna plus mitten.",
    sections: [
      {
        heading: "Två rotationer, inga relationer",
        paragraphs: [
          "Ta två rotationer av en sfär, a och b. Kombinerar du dem får du ord som ab, a⁻¹b⁻¹a eller bbb. En bokstav intill sin egen invers, som i abb⁻¹, tar ut sig; det som blir kvar är ett reducerat ord. För väl valda rotationer är olika reducerade ord alltid olika rotationer. Gruppen de genererar är då den fria gruppen med två generatorer, F₂. Ett klassiskt val är två rotationer med vinkeln arccos(1/3) kring vinkelräta axlar.",
          "Varje element i F₂ utom identiteten börjar med en av fyra bokstäver. Skriv W(a) för alla reducerade ord som börjar med a, och på samma sätt W(a⁻¹), W(b) och W(b⁻¹). Tillsammans med identiteten e delar de upp hela gruppen i fem disjunkta delar. Multiplicera nu varje ord i W(a⁻¹) från vänster med a. Det inledande a⁻¹ tar ut sig, och kvar blir alla reducerade ord som inte börjar med a, inklusive e. En bit, förskjuten en gång, täcker alltså allt utom W(a).",
        ],
        formula: PIECES_FORMULA,
      },
      {
        heading: "Vad reglagen gör",
        paragraphs: [
          "”Träddjup”, från 1 till 7 (standard 5), bestämmer hur många bokstäver de ritade orden högst får ha. Varje ny nivå tredubblar de nyaste orden, eftersom varje ord kan förlängas med vilken bokstav som helst utom inversen av den sista. Vid djup d innehåller bilden 2 · 3ᵈ − 1 prickar: 485 vid standarddjupet, 4373 vid djup 7.",
          "De fyra knapparna W(a), W(a⁻¹), W(b) och W(b⁻¹) lyfter fram en bit och tonar ned resten; trycker du på den aktiva knappen igen försvinner markeringen. Färgerna följer generatorerna: a pekar åt höger, a⁻¹ åt vänster, b uppåt, b⁻¹ nedåt. När en bit är vald låter ”Visa tricket” den glida ett steg mot mitten och fördubblar dess storlek på vägen, den visuella versionen av att multiplicera den med inversen av dess första bokstav, och en bildtext skriver ut identiteten: W(g) förskjuten med g⁻¹ täcker F₂ utan W(g⁻¹).",
        ],
      },
      {
        heading: "Hur den är byggd",
        paragraphs: [
          "Trädet ritas på en 2D-canvas av en kort rekursiv vandring. Från mitten prövar den alla fyra riktningarna, hoppar över den som skulle upphäva föregående steg (det skulle ge ett icke reducerat ord) och fortsätter rekursivt med halverad grenlängd. Varje segment minns första bokstaven i sitt ord, så färgläggningen per bit kräver ingen andra genomgång. Rotgrenen är en fjärdedel av canvasens kortaste sida; eftersom längderna halveras når trädet som mest dubbelt så långt och får alltid plats.",
          "Tricket är en transformation av den färdiga ritningen, inte en ny beräkning: varje segment och varje prick i den framlyfta biten flyttas en rotlängd mot den inversa generatorn och skalas med faktorn två kring mitten, med mjuk start och inbromsning under 1,4 sekunder. Bara kanten som hamnar mellan mitten och dess granne behåller sin längd. Canvasen ritas bara om när djup, markering, animationens förlopp eller storlek ändras. Om ditt system ber om minskad rörelse hoppas animationen över, och sluttillståndet med sin bildtext visas direkt.",
        ],
        code: WALK_EXCERPT,
      },
      {
        heading: "Från trädet till två klot",
        paragraphs: [
          "Animationen behöver en fotnot. Grenarna ritas hälften så långa på varje nivå för att det oändliga trädet ska få plats på skärmen, och en bit som bara gled skulle vara hälften så stor som de tre delträd den ska täcka. Därför fördubblar utforskaren biten medan den rör sig, och den landar exakt. Fördubblingen hör till ritningen, inte till matematiken: i gruppen finns inget storleksbegrepp alls, bara räkning, och trädet har exponentiellt många ord av varje längd. Det går inte att ge de här bitarna storlekar som adderas på ett motsägelsefritt sätt, och det är det som gör dem paradoxala.",
          "Felix Hausdorff flyttade detta till sfären 1914: låt F₂ verka genom rotationer, använd urvalsaxiomet för att välja en punkt ur varje bana och för över gruppens bitar till sfären. Banach och Tarski utvidgade det till det massiva klotet 1924, och Raphael Robinson visade 1947 att fem bitar räcker och färre inte gör det. I planet kan inget liknande hända med enbart stela rörelser, eftersom gruppen av planets stela rörelser är lösbar och inte innehåller någon fri grupp med två generatorer. Paradoxen behöver tre dimensioner.",
        ],
      },
    ],
    experimentsHeading: "Prova det här",
    experiments: [
      {
        title: "Se en bit bli tre",
        text: "Behåll djupet 5, välj W(a⁻¹) och tryck på ”Visa tricket”. Den violetta biten glider åt höger och växer tills dess första nod sitter på identiteten. Dess grenar ligger nu exakt på bitarna W(b), W(b⁻¹) och W(a⁻¹), en nivå kortare än det ritade djupet: allt utom W(a).",
      },
      {
        title: "Räkna explosionen",
        text: "Sätt djupet till 1, sedan 2, 3 och så vidare. Antalet nyaste ord går 4, 12, 36, 108 och tredubblas varje gång. I ett platt rutnät växer antalet punkter på avståndet n bara linjärt; det är den exponentiella tillväxten som lämnar utrymme för en bit att innehålla kopior av resten.",
      },
      {
        title: "Två kopior av fyra bitar",
        text: "Kör tricket på W(a⁻¹): den förskjutna biten fyller varje arm utom den som pekar åt höger, och den saknade armen är precis W(a). Tillsammans ger de tillbaka hela gruppen. Kör det sedan på W(b⁻¹) och kontrollera att W(b) fyller luckan. Fyra bitar, två fullständiga kopior av F₂. Det är gruppversionen av att ett klot blir två.",
      },
    ],
  },
  no: {
    metaDescription:
      "Kjernen i Banach-Tarski-paradokset: den frie gruppen F₂ tegnet som et Cayley-tre og delt i fire biter, der én enkelt forskjøvet bit blir til tre.",
    heading: "Slik fungerer denne utforskeren",
    intro:
      "Det forgrenede korset er et kart over en gruppe, ikke et bilde av en kule. Midten er identiteten, og hver av de andre prikkene er én måte å kombinere to rotasjoner a og b og inversene deres på. Farget etter første bokstav i ordet sitt faller prikkene i fire biter. Overraskelsen, og motoren i Banach-Tarski-paradokset, er at én bit, flyttet ett eneste steg, dekker tre av de fire bitene pluss midten.",
    sections: [
      {
        heading: "To rotasjoner, ingen relasjoner",
        paragraphs: [
          "Ta to rotasjoner av en kuleflate, a og b. Kombinerer du dem, får du ord som ab, a⁻¹b⁻¹a eller bbb. En bokstav ved siden av sin egen invers, som i abb⁻¹, faller bort; det som står igjen, er et redusert ord. For godt valgte rotasjoner er forskjellige reduserte ord alltid forskjellige rotasjoner. Gruppen de genererer, er da den frie gruppen med to generatorer, F₂. Et klassisk valg er to rotasjoner med vinkelen arccos(1/3) om akser som står vinkelrett på hverandre.",
          "Hvert element i F₂ unntatt identiteten begynner med én av fire bokstaver. Skriv W(a) for alle reduserte ord som begynner med a, og tilsvarende W(a⁻¹), W(b) og W(b⁻¹). Sammen med identiteten e deler de hele gruppen i fem disjunkte deler. Multipliser nå hvert ord i W(a⁻¹) fra venstre med a. Den innledende a⁻¹ faller bort, og igjen står alle reduserte ord som ikke begynner med a, inkludert e. Én bit, forskjøvet én gang, dekker altså alt unntatt W(a).",
        ],
        formula: PIECES_FORMULA,
      },
      {
        heading: "Hva kontrollene gjør",
        paragraphs: [
          "«Tredybde», fra 1 til 7 (standard 5), bestemmer hvor mange bokstaver de tegnede ordene høyst kan ha. Hvert nytt nivå tredobler de nyeste ordene, fordi hvert ord kan forlenges med hvilken som helst bokstav unntatt inversen av den siste. Ved dybde d inneholder bildet 2 · 3ᵈ − 1 prikker: 485 ved standarddybden, 4373 ved dybde 7.",
          "De fire knappene W(a), W(a⁻¹), W(b) og W(b⁻¹) fremhever én bit og demper resten; trykker du på den aktive knappen en gang til, fjernes valget. Fargene følger generatorene: a peker mot høyre, a⁻¹ mot venstre, b opp, b⁻¹ ned. Når en bit er valgt, lar «Vis trikset» den gli ett steg mot midten og dobler størrelsen underveis, den visuelle versjonen av å multiplisere den med inversen av første bokstav, og en bildetekst skriver ut identiteten: W(g) forskjøvet med g⁻¹ dekker F₂ uten W(g⁻¹).",
        ],
      },
      {
        heading: "Slik er den bygget",
        paragraphs: [
          "Treet tegnes på et 2D-lerret av en kort rekursiv vandring. Fra midten prøver den alle fire retningene, hopper over den som ville opphevet forrige steg (det ville gitt et ikke-redusert ord), og fortsetter rekursivt med halvert grenlengde. Hvert segment husker første bokstav i ordet sitt, så fargeleggingen etter bit trenger ingen ekstra gjennomgang. Rotgrenen er en firedel av den korteste siden av lerretet; siden lengdene halveres, når treet høyst dobbelt så langt og får alltid plass.",
          "Trikset er en transformasjon av den ferdige tegningen, ikke en ny beregning: Hvert segment og hver prikk i den fremhevede biten flyttes én rotlengde mot den inverse generatoren og skaleres med faktoren to om midten, med myk start og oppbremsing over 1,4 sekunder. Bare kanten som ender mellom midten og naboen, beholder lengden sin. Lerretet tegnes bare på nytt når dybde, valg, animasjonens fremdrift eller størrelse endres. Hvis systemet ditt ber om redusert bevegelse, hoppes animasjonen over, og sluttilstanden med bildeteksten vises med en gang.",
        ],
        code: WALK_EXCERPT,
      },
      {
        heading: "Fra treet til to kuler",
        paragraphs: [
          "Animasjonen trenger en fotnote. Grenene tegnes halvparten så lange på hvert nivå for at det uendelige treet skal få plass på skjermen, og en bit som bare gled, ville vært halvparten så stor som de tre deltrærne den skal dekke. Derfor dobler utforskeren biten mens den beveger seg, og den lander nøyaktig. Doblingen hører til tegningen, ikke til matematikken: I gruppen finnes det ikke noe størrelsesbegrep i det hele tatt, bare telling, og treet har eksponentielt mange ord av hver lengde. Det er umulig å gi disse bitene størrelser som summeres på en motsigelsesfri måte, og det er det som gjør dem paradoksale.",
          "Felix Hausdorff flyttet dette over på kuleflaten i 1914: La F₂ virke ved rotasjoner, bruk utvalgsaksiomet til å plukke ett punkt fra hver bane, og før gruppens biter over på kuleflaten. Banach og Tarski utvidet det til den massive kulen i 1924, og Raphael Robinson viste i 1947 at fem biter er nok og færre ikke er det. I planet kan ikke noe slikt skje med stive bevegelser alene, fordi gruppen av planets stive bevegelser er løsbar og ikke inneholder noen fri gruppe med to generatorer. Paradokset trenger tre dimensjoner.",
        ],
      },
    ],
    experimentsHeading: "Prøv dette",
    experiments: [
      {
        title: "Se én bit bli til tre",
        text: "Behold dybden på 5, velg W(a⁻¹) og trykk på «Vis trikset». Den fiolette biten glir mot høyre og vokser til den første noden sitter på identiteten. Grenene ligger nå nøyaktig på bitene W(b), W(b⁻¹) og W(a⁻¹), ett nivå kortere enn den tegnede dybden: alt unntatt W(a).",
      },
      {
        title: "Tell eksplosjonen",
        text: "Sett dybden til 1, så 2, 3 og så videre. Antallet nyeste ord går 4, 12, 36, 108 og tredobles hver gang. I et flatt rutenett vokser antallet punkter i avstand n bare lineært; det er den eksponentielle veksten som gir rom for at en bit kan inneholde kopier av resten.",
      },
      {
        title: "To kopier av fire biter",
        text: "Kjør trikset på W(a⁻¹): Den forskjøvne biten fyller hver arm unntatt den som peker mot høyre, og den manglende armen er nøyaktig W(a). Sammen gir de tilbake hele gruppen. Kjør det så på W(b⁻¹) og sjekk at W(b) fyller hullet. Fire biter, to fullstendige kopier av F₂. Det er gruppeversjonen av at én kule blir til to.",
      },
    ],
  },
};
