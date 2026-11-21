import type { ExplorerGuide } from "./types";

// Numbers quoted here (800 steps per frame by default, 1 to 5000, cell size 2
// to 10 px, the 40 x 40 minimum grid, the 30-step counter throttle) match
// app/langton/explorer/page.tsx; update both together.
const STEP_EXCERPT = `const stepOnce = () => {
  const idx = ay * gridW + ax;
  const c = grid[idx];
  const turn = rule[c]; // 'R' or 'L'
  if (turn === "R") dir = (dir + 1) & 3;
  else dir = (dir + 3) & 3;
  const next = (c + 1) % nColors;
  grid[idx] = next;
  drawCell(ax, ay, COLOR_PALETTE[next % COLOR_PALETTE.length]);
  // move, wrapping around the edges (torus)
  if (dir === 0) ay = (ay - 1 + gridH) % gridH;
  else if (dir === 1) ax = (ax + 1) % gridW;
  else if (dir === 2) ay = (ay + 1) % gridH;
  else ax = (ax - 1 + gridW) % gridW;
};`;

// The labels inside the display formula are prose, so each locale passes its
// own words; the update rule itself is the same everywhere.
const ruleFormula = (state: string, heading: string, accordingTo: string) =>
  `\\text{${state}}(c) \\mapsto c + 1 \\bmod n, \\qquad \\text{${heading}} \\mapsto \\text{${heading}} \\pm 90^\\circ \\text{ ${accordingTo} } c`;

export const LANGTON_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Run Langton's ant live: watch the chaos turn into a 104-step highway near step 10 000, try multi-colour turmite rules like RLR and LLRR and see how it is coded.",
    heading: "How this explorer works",
    intro:
      "The white square is the ant. It sits on a grid of cells that all start empty, and it follows one rule: look at the colour under you, turn left or right depending on that colour, change the colour, step forward. Nothing else happens. Yet the picture goes through three very different phases: a small symmetric start, a long stretch of apparent chaos, and then, suddenly, perfect order.",
    sections: [
      {
        heading: "The rule, written as a string",
        paragraphs: [
          "Christopher Langton described the ant in 1986. In its classic form there are two colours. On an empty cell the ant turns right, on a coloured cell it turns left, and in both cases it flips the colour of the cell before moving on. The explorer writes this as the rule string RL: the first letter is the turn on colour 0, the second the turn on colour 1.",
          "That notation generalises at once. A rule with n letters uses n colours, and every visit advances a cell to the next colour in the cycle. RLR has three colours, LLRR four, and so on. These generalised ants are often called turmites.",
        ],
        formula:
          "\\text{state}(c) \\mapsto c + 1 \\bmod n, \\qquad \\text{heading} \\mapsto \\text{heading} \\pm 90^\\circ \\text{ according to letter } c",
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "The rule buttons switch the preset and restart from an empty grid. The label above the canvas shows the active rule and its number of colours, the counter on the right shows how many steps the ant has taken.",
          "Steps / frame runs from 1 to 5000 and starts at 800. At around 60 frames per second the default already means tens of thousands of steps per second, so the classic ant reaches its highway within a fraction of a second. To actually watch the chaotic phase, drop the slider to 10 or 20. At 10 steps per frame the ant needs roughly a quarter of a minute to reach step 10 000.",
          "Cell size sets how many CSS pixels one grid cell covers, from 2 to 10, starting at 4. Changing it restarts the run, because the grid has to be rebuilt. Play and Pause freeze the ant without losing anything, Reset clears the grid and puts the ant back in the centre, facing north.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "The grid is a single Uint8Array with one byte per cell, holding the colour index. Its size is the canvas size divided by the cell size, but never smaller than 40 by 40 cells. The ant itself is just three numbers: its column, its row and a direction from 0 to 3 for north, east, south and west. Turning right adds one to the direction, turning left adds three, and a bitwise AND with 3 keeps the result in range without a modulo.",
          "Drawing is incremental. A step changes exactly one cell, so the step function paints exactly that one cell and nothing else; the canvas is never cleared between frames. That is why thousands of steps per frame stay cheap. The white head is drawn on top after the batch and repainted with the real cell colour at the start of the next frame.",
          "The step counter in the overlay is React state, but it is only updated when at least 30 new steps have happened. If your system asks for reduced motion, the explorer starts paused and waits for you to press Play.",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "Why the edges matter",
        paragraphs: [
          "The grid wraps around: an ant leaving on the right comes back on the left, and the same for top and bottom. Mathematically the board is a torus. On an infinite plane the classic ant's highway would run forever, and it is known that its path is always unbounded. On a torus the highway eventually wraps around and runs into the debris the ant left earlier, and the motion turns irregular again, sometimes until a new highway forms.",
          "There is a deeper consequence. The torus has finitely many cells, each with finitely many colours, and the ant has finitely many positions and headings. A deterministic system with finitely many states must eventually repeat itself exactly. So every run in this explorer is, strictly speaking, periodic. The period is just astronomically long for any grid you can see.",
        ],
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "Catch the highway forming",
        text: "Choose the classic RL rule, set Steps / frame to 10 and press Reset. Watch the counter: for a long time the blob grows without any visible plan, and shortly after step 10 000 a narrow diagonal stripe starts to leave it. That stripe repeats the same 104 steps over and over and moves two cells per cycle.",
      },
      {
        title: "Let the highway crash",
        text: "Keep RL, set the cell size to 10 and Steps / frame to 5000. The grid is now small, so the highway wraps around the edge quickly and hits the old pattern. Watch the order break down into chaos again.",
      },
      {
        title: "Compare symmetric and chaotic growth",
        text: "Run LLRR for a while, then RLR. LLRR keeps a mirror symmetry as it grows, a property shared by rules built from pairs of equal letters. RLR grows into an irregular blob with no highway in sight.",
      },
      {
        title: "Twelve colours, one triangle",
        text: "Pick RRLLLRLLLRRR with a cell size of 2. The ant builds a filled triangle that keeps growing and slowly drifts across the grid, an orderly shape that comes from a rule string that looks completely arbitrary.",
      },
    ],
  },
  de: {
    metaDescription:
      "Langtons Ameise live: sieh zu, wie das Chaos nahe Schritt 10 000 in eine Autobahn mit 104er-Zyklus kippt, teste Turmiten wie RLR und LLRR, lies den Code dazu.",
    heading: "So funktioniert dieser Explorer",
    intro:
      "Das weiße Quadrat ist die Ameise. Sie sitzt auf einem Gitter aus Zellen, die anfangs alle leer sind, und folgt genau einer Regel: Schau auf die Farbe unter dir, dreh dich je nach Farbe nach links oder rechts, ändere die Farbe, geh einen Schritt vor. Mehr passiert nicht. Trotzdem durchläuft das Bild drei völlig verschiedene Phasen: einen kleinen symmetrischen Anfang, eine lange Strecke scheinbaren Chaos und dann, ganz plötzlich, perfekte Ordnung.",
    sections: [
      {
        heading: "Die Regel als Zeichenkette",
        paragraphs: [
          "Christopher Langton beschrieb die Ameise 1986. In der klassischen Form gibt es zwei Farben. Auf einer leeren Zelle dreht sich die Ameise nach rechts, auf einer gefärbten nach links, und in beiden Fällen kippt sie die Farbe der Zelle, bevor sie weiterläuft. Der Explorer schreibt das als Regel RL: Der erste Buchstabe ist die Drehung auf Farbe 0, der zweite die auf Farbe 1.",
          "Diese Schreibweise lässt sich sofort verallgemeinern. Eine Regel mit n Buchstaben verwendet n Farben, und jeder Besuch schaltet eine Zelle zur nächsten Farbe im Zyklus weiter. RLR hat drei Farben, LLRR vier und so weiter. Solche verallgemeinerten Ameisen heißen oft Turmiten.",
        ],
        formula:
          "\\text{Zustand}(c) \\mapsto c + 1 \\bmod n, \\qquad \\text{Richtung} \\mapsto \\text{Richtung} \\pm 90^\\circ \\text{ je nach Buchstabe } c",
      },
      {
        heading: "Was die Regler bewirken",
        paragraphs: [
          "Die Regel-Knöpfe wechseln die Voreinstellung und starten auf einem leeren Gitter neu. Das Etikett über dem Canvas zeigt die aktive Regel und ihre Farbanzahl, der Zähler rechts die Zahl der bisherigen Schritte.",
          "«Schritte / Frame» reicht von 1 bis 5000 und startet bei 800. Bei rund 60 Frames pro Sekunde bedeutet schon der Standardwert Zehntausende Schritte pro Sekunde, die klassische Ameise erreicht ihre Autobahn also in Sekundenbruchteilen. Willst du die chaotische Phase wirklich sehen, stell den Regler auf 10 oder 20. Bei 10 Schritten pro Frame braucht die Ameise etwa eine Viertelminute bis Schritt 10 000.",
          "«Zellgröße» legt fest, wie viele CSS-Pixel eine Zelle einnimmt, von 2 bis 10, voreingestellt sind 4. Eine Änderung startet den Lauf neu, weil das Gitter neu aufgebaut werden muss. Play und Pause frieren die Ameise ein, ohne etwas zu verlieren. Reset leert das Gitter und setzt die Ameise mit Blick nach Norden zurück in die Mitte.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Das Gitter ist ein einziges Uint8Array mit einem Byte pro Zelle, das den Farbindex speichert. Seine Größe ergibt sich aus Canvasgröße geteilt durch Zellgröße, aber nie weniger als 40 mal 40 Zellen. Die Ameise selbst besteht nur aus drei Zahlen: Spalte, Zeile und eine Richtung von 0 bis 3 für Norden, Osten, Süden und Westen. Rechts drehen addiert eins, links drehen addiert drei, und ein bitweises AND mit 3 hält das Ergebnis im Bereich, ganz ohne Modulo.",
          "Gezeichnet wird inkrementell. Ein Schritt ändert genau eine Zelle, also malt die Schrittfunktion genau diese eine Zelle und sonst nichts; das Canvas wird zwischen den Frames nie gelöscht. Deshalb bleiben Tausende Schritte pro Frame billig. Der weiße Kopf wird nach jedem Schub obendrauf gezeichnet und zu Beginn des nächsten Frames mit der echten Zellfarbe übermalt.",
          "Der Schrittzähler im Overlay ist React-State, wird aber nur aktualisiert, wenn mindestens 30 neue Schritte passiert sind. Wünscht dein System reduzierte Bewegung, startet der Explorer pausiert und wartet, bis du Play drückst.",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "Warum die Ränder zählen",
        paragraphs: [
          "Das Gitter ist an den Rändern verklebt: Wer rechts hinausläuft, kommt links wieder herein, ebenso oben und unten. Mathematisch ist das Spielfeld ein Torus. Auf einer unendlichen Ebene liefe die Autobahn der klassischen Ameise ewig weiter, und es ist bewiesen, dass ihr Weg immer unbeschränkt ist. Auf dem Torus wickelt sich die Autobahn irgendwann herum und stößt auf die Trümmer, die die Ameise früher hinterlassen hat. Dann wird die Bewegung wieder unregelmäßig, manchmal so lange, bis sich eine neue Autobahn bildet.",
          "Daraus folgt noch etwas Tieferes. Der Torus hat endlich viele Zellen mit endlich vielen Farben, und die Ameise hat endlich viele Positionen und Richtungen. Ein deterministisches System mit endlich vielen Zuständen muss sich irgendwann exakt wiederholen. Jeder Lauf in diesem Explorer ist also streng genommen periodisch. Die Periode ist nur für jedes sichtbare Gitter astronomisch lang.",
        ],
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Die Autobahn entstehen sehen",
        text: "Wähl die klassische Regel RL, stell «Schritte / Frame» auf 10 und drück Reset. Behalte den Zähler im Blick: Lange wächst der Fleck ohne erkennbaren Plan, und kurz nach Schritt 10 000 löst sich ein schmaler diagonaler Streifen. Er wiederholt immer dieselben 104 Schritte und rückt pro Zyklus zwei Zellen weiter.",
      },
      {
        title: "Die Autobahn crashen lassen",
        text: "Bleib bei RL, stell die Zellgröße auf 10 und «Schritte / Frame» auf 5000. Das Gitter ist jetzt klein, die Autobahn wickelt sich schnell über den Rand und trifft auf das alte Muster. Beobachte, wie die Ordnung wieder in Chaos zerfällt.",
      },
      {
        title: "Symmetrisch gegen chaotisch",
        text: "Lass erst LLRR eine Weile laufen, dann RLR. LLRR behält beim Wachsen eine Spiegelsymmetrie, eine Eigenschaft von Regeln, die aus Paaren gleicher Buchstaben bestehen. RLR wächst zu einem unregelmäßigen Fleck, ohne dass eine Autobahn in Sicht wäre.",
      },
      {
        title: "Zwölf Farben, ein Dreieck",
        text: "Nimm RRLLLRLLLRRR mit Zellgröße 2. Die Ameise baut ein gefülltes Dreieck, das immer weiter wächst und langsam über das Gitter wandert. Eine geordnete Form aus einer Regel, die völlig willkürlich aussieht.",
      },
    ],
  },
  es: {
    metaDescription:
      "La hormiga de Langton en vivo: mira el caos volverse una autopista de 104 pasos cerca del paso 10 000 y prueba reglas multicolor como RLR y LLRR.",
    heading: "Cómo funciona este explorador",
    intro:
      "El cuadrado blanco es la hormiga. Está sobre una cuadrícula de celdas que empiezan todas vacías, y sigue una sola regla: mira el color que tienes debajo, gira a la izquierda o a la derecha según ese color, cambia el color, da un paso adelante. No ocurre nada más. Y aun así la imagen pasa por tres fases muy distintas: un pequeño comienzo simétrico, un largo tramo de caos aparente y luego, de repente, un orden perfecto.",
    sections: [
      {
        heading: "La regla, escrita como una cadena",
        paragraphs: [
          "Christopher Langton describió la hormiga en 1986. En su forma clásica hay dos colores. Sobre una celda vacía la hormiga gira a la derecha, sobre una celda coloreada gira a la izquierda, y en ambos casos invierte el color de la celda antes de seguir. El explorador lo escribe como la cadena de regla RL: la primera letra es el giro sobre el color 0, la segunda el giro sobre el color 1.",
          "Esa notación se generaliza de inmediato. Una regla con n letras usa n colores, y cada visita hace avanzar la celda al siguiente color del ciclo. RLR tiene tres colores, LLRR cuatro, y así sucesivamente. A estas hormigas generalizadas se las suele llamar turmitas.",
        ],
        formula: ruleFormula("estado", "rumbo", "según la letra"),
      },
      {
        heading: "Qué hacen los controles",
        paragraphs: [
          "Los botones de regla cambian el preajuste y reinician desde una cuadrícula vacía. La etiqueta sobre el lienzo muestra la regla activa y su número de colores, y el contador de la derecha muestra cuántos pasos ha dado la hormiga.",
          "«Pasos / fotograma» va de 1 a 5000 y empieza en 800. A unos 60 fotogramas por segundo, el valor por defecto ya supone decenas de miles de pasos por segundo, así que la hormiga clásica llega a su autopista en una fracción de segundo. Para ver de verdad la fase caótica, baja el deslizador a 10 o 20. Con 10 pasos por fotograma, la hormiga necesita más o menos un cuarto de minuto para llegar al paso 10 000.",
          "«Tamaño de celda» fija cuántos píxeles CSS ocupa una celda de la cuadrícula, de 2 a 10, empezando en 4. Cambiarlo reinicia la ejecución, porque hay que reconstruir la cuadrícula. «Play» y «Pausa» congelan la hormiga sin perder nada, y «Reiniciar» vacía la cuadrícula y devuelve la hormiga al centro, mirando al norte.",
        ],
      },
      {
        heading: "Cómo está construido",
        paragraphs: [
          "La cuadrícula es un único Uint8Array con un byte por celda, que guarda el índice de color. Su tamaño es el tamaño del lienzo dividido entre el tamaño de celda, pero nunca menor de 40 por 40 celdas. La hormiga en sí son solo tres números: su columna, su fila y una dirección de 0 a 3 para norte, este, sur y oeste. Girar a la derecha suma uno a la dirección, girar a la izquierda suma tres, y un AND bit a bit con 3 mantiene el resultado dentro del rango sin necesidad de un módulo.",
          "El dibujo es incremental. Un paso cambia exactamente una celda, así que la función de paso pinta exactamente esa celda y nada más; el lienzo nunca se borra entre fotogramas. Por eso miles de pasos por fotograma siguen saliendo baratos. La cabeza blanca se dibuja encima después de cada lote y se repinta con el color real de la celda al comienzo del fotograma siguiente.",
          "El contador de pasos superpuesto es estado de React, pero solo se actualiza cuando han ocurrido al menos 30 pasos nuevos. Si tu sistema pide movimiento reducido, el explorador arranca en pausa y espera a que pulses «Play».",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "Por qué importan los bordes",
        paragraphs: [
          "La cuadrícula se cierra sobre sí misma: una hormiga que sale por la derecha vuelve a entrar por la izquierda, y lo mismo arriba y abajo. Matemáticamente, el tablero es un toro. En un plano infinito, la autopista de la hormiga clásica seguiría para siempre, y se sabe que su trayectoria nunca está acotada. En un toro, la autopista acaba dando la vuelta y choca con los restos que la hormiga dejó antes, y el movimiento se vuelve irregular de nuevo, a veces hasta que se forma una autopista nueva.",
          "Hay una consecuencia más profunda. El toro tiene un número finito de celdas, cada una con un número finito de colores, y la hormiga tiene un número finito de posiciones y rumbos. Un sistema determinista con un número finito de estados tiene que acabar repitiéndose exactamente. Así que cada ejecución de este explorador es, en rigor, periódica. Solo que el periodo es astronómicamente largo para cualquier cuadrícula que puedas ver.",
        ],
      },
    ],
    experimentsHeading: "Prueba esto",
    experiments: [
      {
        title: "Pilla la autopista en plena formación",
        text: "Elige la regla clásica RL, pon «Pasos / fotograma» en 10 y pulsa «Reiniciar». Fíjate en el contador: durante mucho tiempo la mancha crece sin ningún plan visible, y poco después del paso 10 000 empieza a salir de ella una franja diagonal estrecha. Esa franja repite una y otra vez los mismos 104 pasos y avanza dos celdas por ciclo.",
      },
      {
        title: "Haz que la autopista se estrelle",
        text: "Sigue con RL, pon el tamaño de celda en 10 y «Pasos / fotograma» en 5000. Ahora la cuadrícula es pequeña, así que la autopista da la vuelta por el borde enseguida y choca con el patrón antiguo. Mira cómo el orden vuelve a deshacerse en caos.",
      },
      {
        title: "Compara el crecimiento simétrico y el caótico",
        text: "Ejecuta LLRR un rato y luego RLR. LLRR conserva una simetría especular mientras crece, una propiedad que comparten las reglas formadas por pares de letras iguales. RLR crece hasta formar una mancha irregular sin ninguna autopista a la vista.",
      },
      {
        title: "Doce colores, un triángulo",
        text: "Escoge RRLLLRLLLRRR con un tamaño de celda de 2. La hormiga construye un triángulo relleno que no deja de crecer y se desplaza despacio por la cuadrícula, una forma ordenada que sale de una cadena de regla que parece completamente arbitraria.",
      },
    ],
  },
  fr: {
    metaDescription:
      "La fourmi de Langton en direct : regarde le chaos devenir une autoroute de 104 pas vers le pas 10\u00a0000 et essaie des règles multicolores comme RLR et LLRR.",
    heading: "Comment fonctionne cet explorateur",
    intro:
      "Le carré blanc, c'est la fourmi. Elle se trouve sur une grille de cellules toutes vides au départ, et elle suit une seule règle : regarde la couleur sous toi, tourne à gauche ou à droite selon cette couleur, change la couleur, avance d'un pas. Il ne se passe rien d'autre. Et pourtant l'image traverse trois phases très différentes : un petit début symétrique, une longue période de chaos apparent, puis, soudain, un ordre parfait.",
    sections: [
      {
        heading: "La règle, écrite comme une chaîne",
        paragraphs: [
          "Christopher Langton a décrit la fourmi en 1986. Dans sa forme classique, il y a deux couleurs. Sur une cellule vide, la fourmi tourne à droite, sur une cellule colorée elle tourne à gauche, et dans les deux cas elle inverse la couleur de la cellule avant de repartir. L'explorateur écrit cela sous la forme de la chaîne de règle RL : la première lettre est le virage sur la couleur 0, la seconde le virage sur la couleur 1.",
          "Cette notation se généralise aussitôt. Une règle de n lettres utilise n couleurs, et chaque visite fait passer une cellule à la couleur suivante du cycle. RLR a trois couleurs, LLRR quatre, et ainsi de suite. On appelle souvent ces fourmis généralisées des turmites.",
        ],
        formula: ruleFormula("état", "cap", "selon la lettre"),
      },
      {
        heading: "À quoi servent les commandes",
        paragraphs: [
          "Les boutons de règle changent de préréglage et repartent d'une grille vide. L'étiquette au-dessus du canevas indique la règle active et son nombre de couleurs, le compteur à droite indique combien de pas la fourmi a effectués.",
          "« Pas / image » va de 1 à 5\u00a0000 et démarre à 800. À environ 60 images par seconde, la valeur par défaut représente déjà des dizaines de milliers de pas par seconde, si bien que la fourmi classique atteint son autoroute en une fraction de seconde. Pour vraiment observer la phase chaotique, descends le curseur à 10 ou 20. À 10 pas par image, il faut à la fourmi à peu près un quart de minute pour atteindre le pas 10\u00a0000.",
          "« Taille de cellule » fixe le nombre de pixels CSS que couvre une cellule de la grille, de 2 à 10, avec 4 au départ. La modifier relance la simulation, car la grille doit être reconstruite. « Lecture » et « Pause » figent la fourmi sans rien perdre, « Réinit. » vide la grille et replace la fourmi au centre, tournée vers le nord.",
        ],
      },
      {
        heading: "Comment c'est construit",
        paragraphs: [
          "La grille est un unique Uint8Array avec un octet par cellule, qui contient l'indice de couleur. Sa taille est celle du canevas divisée par la taille de cellule, mais jamais inférieure à 40 sur 40 cellules. La fourmi elle-même se résume à trois nombres : sa colonne, sa ligne et une direction de 0 à 3 pour nord, est, sud et ouest. Tourner à droite ajoute un à la direction, tourner à gauche ajoute trois, et un ET bit à bit avec 3 maintient le résultat dans l'intervalle sans modulo.",
          "Le dessin est incrémental. Un pas modifie exactement une cellule, donc la fonction de pas peint exactement cette cellule et rien d'autre ; le canevas n'est jamais effacé entre deux images. C'est pourquoi des milliers de pas par image restent peu coûteux. La tête blanche est dessinée par-dessus après chaque lot, puis repeinte avec la vraie couleur de la cellule au début de l'image suivante.",
          "Le compteur de pas en surimpression est un état React, mais il n'est mis à jour que lorsqu'au moins 30 nouveaux pas ont eu lieu. Si ton système demande une réduction des animations, l'explorateur démarre en pause et attend que tu appuies sur « Lecture ».",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "Pourquoi les bords comptent",
        paragraphs: [
          "La grille se referme sur elle-même : une fourmi qui sort par la droite revient par la gauche, et de même en haut et en bas. Mathématiquement, le plateau est un tore. Sur un plan infini, l'autoroute de la fourmi classique se prolongerait sans fin, et l'on sait que sa trajectoire est toujours non bornée. Sur un tore, l'autoroute finit par faire le tour et percute les débris que la fourmi a laissés plus tôt, et le mouvement redevient irrégulier, parfois jusqu'à ce qu'une nouvelle autoroute se forme.",
          "Il y a une conséquence plus profonde. Le tore a un nombre fini de cellules, chacune avec un nombre fini de couleurs, et la fourmi a un nombre fini de positions et de caps. Un système déterministe doté d'un nombre fini d'états doit finir par se répéter exactement. Chaque exécution dans cet explorateur est donc, à strictement parler, périodique. La période est simplement astronomiquement longue pour toute grille que tu peux voir.",
        ],
      },
    ],
    experimentsHeading: "À essayer",
    experiments: [
      {
        title: "Surprends l'autoroute en train de se former",
        text: "Choisis la règle classique RL, règle « Pas / image » sur 10 et appuie sur « Réinit. ». Surveille le compteur : pendant longtemps la tache grossit sans plan visible, et peu après le pas 10\u00a0000 une étroite bande diagonale commence à s'en détacher. Cette bande répète sans cesse les mêmes 104 pas et avance de deux cellules par cycle.",
      },
      {
        title: "Envoie l'autoroute dans le décor",
        text: "Garde RL, règle la taille de cellule sur 10 et « Pas / image » sur 5\u00a0000. La grille est maintenant petite, l'autoroute fait donc vite le tour par le bord et heurte l'ancien motif. Regarde l'ordre se défaire de nouveau en chaos.",
      },
      {
        title: "Compare croissance symétrique et croissance chaotique",
        text: "Fais tourner LLRR un moment, puis RLR. LLRR conserve une symétrie miroir en grandissant, une propriété que partagent les règles formées de paires de lettres identiques. RLR grossit en une tache irrégulière, sans autoroute en vue.",
      },
      {
        title: "Douze couleurs, un triangle",
        text: "Prends RRLLLRLLLRRR avec une taille de cellule de 2. La fourmi construit un triangle plein qui ne cesse de grandir et dérive lentement sur la grille, une forme ordonnée issue d'une chaîne de règle qui paraît complètement arbitraire.",
      },
    ],
  },
  it: {
    metaDescription:
      "La formica di Langton dal vivo: guarda il caos diventare un'autostrada di 104 passi intorno al passo 10.000 e prova regole multicolore come RLR e LLRR.",
    heading: "Come funziona questo esploratore",
    intro:
      "Il quadrato bianco è la formica. Sta su una griglia di celle che all'inizio sono tutte vuote, e segue un'unica regola: guarda il colore sotto di te, gira a sinistra o a destra a seconda di quel colore, cambia il colore, fai un passo avanti. Non succede nient'altro. Eppure l'immagine attraversa tre fasi molto diverse: un piccolo inizio simmetrico, un lungo tratto di caos apparente e poi, all'improvviso, un ordine perfetto.",
    sections: [
      {
        heading: "La regola, scritta come stringa",
        paragraphs: [
          "Christopher Langton descrisse la formica nel 1986. Nella forma classica i colori sono due. Su una cella vuota la formica gira a destra, su una cella colorata gira a sinistra, e in entrambi i casi inverte il colore della cella prima di proseguire. L'esploratore scrive tutto questo come la stringa di regola RL: la prima lettera è la svolta sul colore 0, la seconda la svolta sul colore 1.",
          "Questa notazione si generalizza subito. Una regola di n lettere usa n colori, e ogni visita fa avanzare una cella al colore successivo del ciclo. RLR ha tre colori, LLRR quattro, e così via. Queste formiche generalizzate sono spesso chiamate turmiti.",
        ],
        formula: ruleFormula("stato", "direzione", "secondo la lettera"),
      },
      {
        heading: "Che cosa fanno i controlli",
        paragraphs: [
          "I pulsanti delle regole cambiano il preset e ripartono da una griglia vuota. L'etichetta sopra il canvas mostra la regola attiva e il suo numero di colori, il contatore a destra mostra quanti passi ha fatto la formica.",
          "«Passi / frame» va da 1 a 5000 e parte da 800. A circa 60 fotogrammi al secondo, il valore predefinito significa già decine di migliaia di passi al secondo, quindi la formica classica raggiunge la sua autostrada in una frazione di secondo. Per osservare davvero la fase caotica, abbassa il cursore a 10 o 20. A 10 passi per fotogramma, alla formica serve all'incirca un quarto di minuto per arrivare al passo 10.000.",
          "«Dimensione cella» imposta quanti pixel CSS copre una cella della griglia, da 2 a 10, partendo da 4. Cambiarla fa ripartire la simulazione, perché la griglia va ricostruita. «Play» e «Pausa» congelano la formica senza perdere nulla, «Reset» svuota la griglia e rimette la formica al centro, rivolta a nord.",
        ],
      },
      {
        heading: "Com'è costruito",
        paragraphs: [
          "La griglia è un unico Uint8Array con un byte per cella, che contiene l'indice del colore. La sua dimensione è quella del canvas divisa per la dimensione della cella, ma mai inferiore a 40 per 40 celle. La formica in sé è fatta di soli tre numeri: la colonna, la riga e una direzione da 0 a 3 per nord, est, sud e ovest. Girare a destra aggiunge uno alla direzione, girare a sinistra aggiunge tre, e un AND bit a bit con 3 mantiene il risultato nell'intervallo senza bisogno del modulo.",
          "Il disegno è incrementale. Un passo cambia esattamente una cella, quindi la funzione di passo dipinge esattamente quella cella e nient'altro; il canvas non viene mai cancellato tra un fotogramma e l'altro. Ecco perché migliaia di passi per fotogramma restano poco costosi. La testa bianca viene disegnata sopra dopo ogni blocco di passi e ridipinta con il vero colore della cella all'inizio del fotogramma successivo.",
          "Il contatore dei passi in sovrimpressione è stato di React, ma viene aggiornato solo quando sono avvenuti almeno 30 nuovi passi. Se il tuo sistema richiede movimento ridotto, l'esploratore parte in pausa e aspetta che tu prema «Play».",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "Perché i bordi contano",
        paragraphs: [
          "La griglia si richiude su sé stessa: una formica che esce a destra rientra da sinistra, e lo stesso vale per alto e basso. Matematicamente il tavoliere è un toro. Su un piano infinito l'autostrada della formica classica proseguirebbe per sempre, ed è noto che la sua traiettoria è sempre illimitata. Su un toro l'autostrada prima o poi fa il giro e va a sbattere contro i detriti che la formica ha lasciato in precedenza, e il moto torna irregolare, a volte finché non si forma una nuova autostrada.",
          "C'è una conseguenza più profonda. Il toro ha un numero finito di celle, ciascuna con un numero finito di colori, e la formica ha un numero finito di posizioni e direzioni. Un sistema deterministico con un numero finito di stati deve prima o poi ripetersi esattamente. Quindi ogni esecuzione in questo esploratore è, a rigore, periodica. Il periodo è solo astronomicamente lungo per qualunque griglia tu possa vedere.",
        ],
      },
    ],
    experimentsHeading: "Prova così",
    experiments: [
      {
        title: "Cogli l'autostrada mentre si forma",
        text: "Scegli la regola classica RL, imposta «Passi / frame» a 10 e premi «Reset». Tieni d'occhio il contatore: per molto tempo la macchia cresce senza alcun piano visibile, e poco dopo il passo 10.000 comincia a uscirne una stretta striscia diagonale. Quella striscia ripete di continuo gli stessi 104 passi e avanza di due celle per ciclo.",
      },
      {
        title: "Fai schiantare l'autostrada",
        text: "Resta su RL, imposta la dimensione della cella a 10 e «Passi / frame» a 5000. Ora la griglia è piccola, quindi l'autostrada fa presto il giro oltre il bordo e colpisce il vecchio disegno. Guarda l'ordine sfaldarsi di nuovo nel caos.",
      },
      {
        title: "Confronta crescita simmetrica e crescita caotica",
        text: "Fai girare LLRR per un po', poi RLR. LLRR mantiene una simmetria speculare mentre cresce, una proprietà condivisa dalle regole costruite con coppie di lettere uguali. RLR cresce in una macchia irregolare senza autostrade in vista.",
      },
      {
        title: "Dodici colori, un triangolo",
        text: "Scegli RRLLLRLLLRRR con una dimensione della cella di 2. La formica costruisce un triangolo pieno che continua a crescere e si sposta lentamente sulla griglia, una forma ordinata che nasce da una stringa di regola dall'aria del tutto arbitraria.",
      },
    ],
  },
  pt: {
    metaDescription:
      "A formiga de Langton ao vivo: vê o caos tornar-se uma autoestrada de 104 passos perto do passo 10\u00a0000 e experimenta regras multicolores como RLR e LLRR.",
    heading: "Como funciona este explorador",
    intro:
      "O quadrado branco é a formiga. Está numa grelha de células que começam todas vazias, e segue uma única regra: olha para a cor que tens por baixo, vira à esquerda ou à direita consoante essa cor, muda a cor, dá um passo em frente. Não acontece mais nada. E, no entanto, a imagem passa por três fases muito diferentes: um pequeno início simétrico, um longo período de caos aparente e depois, de repente, ordem perfeita.",
    sections: [
      {
        heading: "A regra, escrita como uma cadeia",
        paragraphs: [
          "Christopher Langton descreveu a formiga em 1986. Na forma clássica há duas cores. Numa célula vazia a formiga vira à direita, numa célula colorida vira à esquerda, e em ambos os casos inverte a cor da célula antes de seguir em frente. O explorador escreve isto como a cadeia de regra RL: a primeira letra é a viragem na cor 0, a segunda a viragem na cor 1.",
          "Essa notação generaliza-se de imediato. Uma regra com n letras usa n cores, e cada visita faz a célula avançar para a cor seguinte do ciclo. RLR tem três cores, LLRR quatro, e assim por diante. Estas formigas generalizadas são muitas vezes chamadas turmites.",
        ],
        formula: ruleFormula("estado", "rumo", "segundo a letra"),
      },
      {
        heading: "O que fazem os controlos",
        paragraphs: [
          "Os botões de regra mudam a predefinição e recomeçam a partir de uma grelha vazia. A etiqueta por cima do canvas mostra a regra ativa e o seu número de cores, o contador à direita mostra quantos passos a formiga já deu.",
          "«Passos / fotograma» vai de 1 a 5000 e começa em 800. A cerca de 60 fotogramas por segundo, o valor por omissão já significa dezenas de milhares de passos por segundo, pelo que a formiga clássica chega à sua autoestrada numa fração de segundo. Para veres mesmo a fase caótica, baixa o cursor para 10 ou 20. Com 10 passos por fotograma, a formiga precisa de mais ou menos um quarto de minuto para chegar ao passo 10\u00a0000.",
          "«Tamanho da célula» define quantos píxeis CSS ocupa uma célula da grelha, de 2 a 10, começando em 4. Alterá-lo recomeça a execução, porque a grelha tem de ser reconstruída. «Play» e «Pausa» congelam a formiga sem perder nada, «Repor» limpa a grelha e volta a pôr a formiga no centro, virada para norte.",
        ],
      },
      {
        heading: "Como está construído",
        paragraphs: [
          "A grelha é um único Uint8Array com um byte por célula, que guarda o índice da cor. O seu tamanho é o tamanho do canvas dividido pelo tamanho da célula, mas nunca inferior a 40 por 40 células. A formiga em si são apenas três números: a coluna, a linha e uma direção de 0 a 3 para norte, este, sul e oeste. Virar à direita soma um à direção, virar à esquerda soma três, e um AND bit a bit com 3 mantém o resultado dentro do intervalo sem ser preciso um módulo.",
          "O desenho é incremental. Um passo altera exatamente uma célula, por isso a função de passo pinta exatamente essa célula e mais nada; o canvas nunca é limpo entre fotogramas. É por isso que milhares de passos por fotograma continuam a sair baratos. A cabeça branca é desenhada por cima depois de cada lote e repintada com a cor verdadeira da célula no início do fotograma seguinte.",
          "O contador de passos sobreposto é estado do React, mas só é atualizado quando tiverem ocorrido pelo menos 30 passos novos. Se o teu sistema pedir movimento reduzido, o explorador arranca em pausa e espera que carregues em «Play».",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "Porque é que as margens importam",
        paragraphs: [
          "A grelha fecha-se sobre si mesma: uma formiga que sai pela direita volta a entrar pela esquerda, e o mesmo em cima e em baixo. Matematicamente, o tabuleiro é um toro. Num plano infinito, a autoestrada da formiga clássica continuaria para sempre, e sabe-se que a sua trajetória é sempre ilimitada. Num toro, a autoestrada acaba por dar a volta e embate nos destroços que a formiga deixou antes, e o movimento volta a ficar irregular, por vezes até se formar uma nova autoestrada.",
          "Há uma consequência mais profunda. O toro tem um número finito de células, cada uma com um número finito de cores, e a formiga tem um número finito de posições e rumos. Um sistema determinista com um número finito de estados tem de acabar por se repetir exatamente. Por isso, cada execução neste explorador é, em rigor, periódica. O período é só astronomicamente longo para qualquer grelha que consigas ver.",
        ],
      },
    ],
    experimentsHeading: "Experimenta isto",
    experiments: [
      {
        title: "Apanha a autoestrada a formar-se",
        text: "Escolhe a regra clássica RL, põe «Passos / fotograma» em 10 e carrega em «Repor». Observa o contador: durante muito tempo a mancha cresce sem qualquer plano visível, e pouco depois do passo 10\u00a0000 uma faixa diagonal estreita começa a sair dela. Essa faixa repete vezes sem conta os mesmos 104 passos e avança duas células por ciclo.",
      },
      {
        title: "Deixa a autoestrada despistar-se",
        text: "Mantém RL, põe o tamanho da célula em 10 e «Passos / fotograma» em 5000. A grelha é agora pequena, por isso a autoestrada dá depressa a volta pela margem e embate no padrão antigo. Vê a ordem a desfazer-se outra vez em caos.",
      },
      {
        title: "Compara o crescimento simétrico e o caótico",
        text: "Corre LLRR durante algum tempo e depois RLR. LLRR mantém uma simetria de espelho à medida que cresce, uma propriedade partilhada pelas regras construídas com pares de letras iguais. RLR cresce numa mancha irregular, sem autoestrada à vista.",
      },
      {
        title: "Doze cores, um triângulo",
        text: "Escolhe RRLLLRLLLRRR com um tamanho de célula de 2. A formiga constrói um triângulo cheio que não para de crescer e desliza lentamente pela grelha, uma forma ordenada que nasce de uma cadeia de regra que parece completamente arbitrária.",
      },
    ],
  },
  sv: {
    metaDescription:
      "Langtons myra i realtid: se kaoset övergå i en motorväg på 104 steg nära steg 10\u00a0000, testa flerfärgsregler som RLR och LLRR och se hur den är kodad.",
    heading: "Så fungerar den här utforskaren",
    intro:
      "Den vita kvadraten är myran. Den står på ett rutnät av celler som alla är tomma från början, och den följer en enda regel: titta på färgen under dig, sväng vänster eller höger beroende på färgen, byt färgen, ta ett steg framåt. Inget annat händer. Ändå går bilden igenom tre mycket olika faser: en liten symmetrisk början, en lång sträcka av skenbart kaos och sedan, plötsligt, perfekt ordning.",
    sections: [
      {
        heading: "Regeln, skriven som en sträng",
        paragraphs: [
          "Christopher Langton beskrev myran 1986. I den klassiska formen finns det två färger. På en tom cell svänger myran höger, på en färgad cell svänger den vänster, och i båda fallen byter den cellens färg innan den går vidare. Utforskaren skriver detta som regelsträngen RL: den första bokstaven är svängen på färg 0, den andra svängen på färg 1.",
          "Den notationen går genast att generalisera. En regel med n bokstäver använder n färger, och varje besök flyttar en cell till nästa färg i cykeln. RLR har tre färger, LLRR fyra, och så vidare. De här generaliserade myrorna kallas ofta turmiter.",
        ],
        formula: ruleFormula("tillstånd", "riktning", "enligt bokstav"),
      },
      {
        heading: "Vad reglagen gör",
        paragraphs: [
          "Regelknapparna byter förval och startar om från ett tomt rutnät. Etiketten ovanför canvasen visar den aktiva regeln och dess antal färger, och räknaren till höger visar hur många steg myran har tagit.",
          "”Steg / bildruta” går från 1 till 5000 och börjar på 800. Vid ungefär 60 bildrutor per sekund innebär redan standardvärdet tiotusentals steg per sekund, så den klassiska myran når sin motorväg på en bråkdel av en sekund. Vill du faktiskt se den kaotiska fasen drar du ner reglaget till 10 eller 20. Vid 10 steg per bildruta behöver myran ungefär en kvarts minut för att nå steg 10\u00a0000.",
          "”Cellstorlek” bestämmer hur många CSS-pixlar en cell i rutnätet täcker, från 2 till 10, med 4 från början. Ändrar du den startar körningen om, eftersom rutnätet måste byggas upp på nytt. ”Spela” och ”Paus” fryser myran utan att något går förlorat, ”Återställ” tömmer rutnätet och ställer myran i mitten igen, vänd mot norr.",
        ],
      },
      {
        heading: "Hur den är byggd",
        paragraphs: [
          "Rutnätet är en enda Uint8Array med en byte per cell, som innehåller färgindexet. Dess storlek är canvasens storlek delad med cellstorleken, men aldrig mindre än 40 gånger 40 celler. Själva myran är bara tre tal: dess kolumn, dess rad och en riktning från 0 till 3 för norr, öster, söder och väster. En högersväng lägger ett till riktningen, en vänstersväng lägger till tre, och ett bitvis OCH med 3 håller resultatet inom intervallet utan någon modulo.",
          "Ritningen är inkrementell. Ett steg ändrar exakt en cell, så stegfunktionen målar exakt den cellen och inget annat. Canvasen rensas aldrig mellan bildrutorna. Därför förblir tusentals steg per bildruta billiga. Det vita huvudet ritas ovanpå efter varje omgång och målas över med cellens riktiga färg i början av nästa bildruta.",
          "Stegräknaren i överlägget är React-tillstånd, men den uppdateras bara när minst 30 nya steg har tagits. Om ditt system ber om minskad rörelse startar utforskaren pausad och väntar på att du trycker på ”Spela”.",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "Varför kanterna spelar roll",
        paragraphs: [
          "Rutnätet går runt: en myra som lämnar till höger kommer tillbaka till vänster, och likadant uppåt och nedåt. Matematiskt är brädet en torus. På ett oändligt plan skulle den klassiska myrans motorväg fortsätta för evigt, och man vet att dess bana alltid är obegränsad. På en torus går motorvägen till slut runt och kör in i bråten som myran lämnade tidigare, och rörelsen blir oregelbunden igen, ibland tills en ny motorväg bildas.",
          "Det finns en djupare följd. Torusen har ändligt många celler, var och en med ändligt många färger, och myran har ändligt många positioner och riktningar. Ett deterministiskt system med ändligt många tillstånd måste förr eller senare upprepa sig exakt. Varje körning i den här utforskaren är alltså, strängt taget, periodisk. Perioden är bara astronomiskt lång för varje rutnät du kan se.",
        ],
      },
    ],
    experimentsHeading: "Prova det här",
    experiments: [
      {
        title: "Fånga motorvägen när den bildas",
        text: "Välj den klassiska regeln RL, ställ ”Steg / bildruta” på 10 och tryck på ”Återställ”. Håll ögonen på räknaren: länge växer klumpen utan någon synlig plan, och strax efter steg 10\u00a0000 börjar en smal diagonal remsa lämna den. Remsan upprepar samma 104 steg om och om igen och flyttar sig två celler per cykel.",
      },
      {
        title: "Låt motorvägen krascha",
        text: "Behåll RL, ställ cellstorleken på 10 och ”Steg / bildruta” på 5000. Rutnätet är nu litet, så motorvägen går snabbt runt kanten och träffar det gamla mönstret. Se hur ordningen faller sönder i kaos igen.",
      },
      {
        title: "Jämför symmetrisk och kaotisk tillväxt",
        text: "Kör LLRR en stund och sedan RLR. LLRR behåller en spegelsymmetri medan den växer, en egenskap som delas av regler byggda av par av lika bokstäver. RLR växer till en oregelbunden klump utan någon motorväg i sikte.",
      },
      {
        title: "Tolv färger, en triangel",
        text: "Välj RRLLLRLLLRRR med cellstorlek 2. Myran bygger en fylld triangel som fortsätter att växa och långsamt driver över rutnätet, en ordnad form som kommer ur en regelsträng som ser helt godtycklig ut.",
      },
    ],
  },
  no: {
    metaDescription:
      "Langtons maur i sanntid: Se kaoset gå over i en motorvei på 104 steg nær steg 10\u00a0000, prøv flerfargeregler som RLR og LLRR, og se hvordan den er kodet.",
    heading: "Slik fungerer denne utforskeren",
    intro:
      "Den hvite firkanten er mauren. Den står på et rutenett av celler som alle er tomme i starten, og den følger én regel: Se på fargen under deg, sving til venstre eller høyre avhengig av fargen, bytt fargen, ta ett steg fram. Ingenting annet skjer. Likevel går bildet gjennom tre svært ulike faser: en liten symmetrisk start, en lang strekning med tilsynelatende kaos, og så, plutselig, perfekt orden.",
    sections: [
      {
        heading: "Regelen, skrevet som en streng",
        paragraphs: [
          "Christopher Langton beskrev mauren i 1986. I den klassiske formen finnes det to farger. På en tom celle svinger mauren til høyre, på en farget celle svinger den til venstre, og i begge tilfeller bytter den fargen på cellen før den går videre. Utforskeren skriver dette som regelstrengen RL: Den første bokstaven er svingen på farge 0, den andre svingen på farge 1.",
          "Den notasjonen lar seg straks generalisere. En regel med n bokstaver bruker n farger, og hvert besøk flytter en celle til neste farge i syklusen. RLR har tre farger, LLRR fire, og så videre. Disse generaliserte maurene kalles ofte turmitter.",
        ],
        formula: ruleFormula("tilstand", "retning", "etter bokstav"),
      },
      {
        heading: "Hva kontrollene gjør",
        paragraphs: [
          "Regelknappene bytter forhåndsvalg og starter på nytt fra et tomt rutenett. Etiketten over lerretet viser den aktive regelen og antall farger, og telleren til høyre viser hvor mange steg mauren har tatt.",
          "«Steg / bilde» går fra 1 til 5000 og starter på 800. Ved rundt 60 bilder per sekund betyr allerede standardverdien titusenvis av steg per sekund, så den klassiske mauren når motorveien sin på en brøkdel av et sekund. Vil du faktisk se den kaotiske fasen, drar du glidebryteren ned til 10 eller 20. Ved 10 steg per bilde trenger mauren omtrent et kvart minutt for å nå steg 10\u00a0000.",
          "«Cellestørrelse» bestemmer hvor mange CSS-piksler én celle i rutenettet dekker, fra 2 til 10, med 4 som start. Endrer du den, starter kjøringen på nytt, fordi rutenettet må bygges opp igjen. «Spill» og «Pause» fryser mauren uten at noe går tapt, «Nullstill» tømmer rutenettet og setter mauren tilbake i midten, vendt mot nord.",
        ],
      },
      {
        heading: "Slik er den bygget",
        paragraphs: [
          "Rutenettet er ett enkelt Uint8Array med én byte per celle, som holder fargeindeksen. Størrelsen er lerretsstørrelsen delt på cellestørrelsen, men aldri mindre enn 40 ganger 40 celler. Selve mauren er bare tre tall: kolonnen, raden og en retning fra 0 til 3 for nord, øst, sør og vest. En høyresving legger én til retningen, en venstresving legger til tre, og en bitvis OG med 3 holder resultatet innenfor området uten modulo.",
          "Tegningen er inkrementell. Et steg endrer nøyaktig én celle, så stegfunksjonen maler nøyaktig den cellen og ingenting annet. Lerretet tømmes aldri mellom bildene. Derfor forblir tusenvis av steg per bilde billige. Det hvite hodet tegnes oppå etter hver bunke og males over med cellens virkelige farge i starten av neste bilde.",
          "Stegtelleren i overlegget er React-tilstand, men den oppdateres bare når minst 30 nye steg har skjedd. Hvis systemet ditt ber om redusert bevegelse, starter utforskeren i pause og venter på at du trykker på «Spill».",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "Hvorfor kantene betyr noe",
        paragraphs: [
          "Rutenettet går rundt: En maur som forlater brettet til høyre, kommer tilbake til venstre, og det samme gjelder oppe og nede. Matematisk er brettet en torus. På et uendelig plan ville motorveien til den klassiske mauren fortsatt for alltid, og man vet at banen dens alltid er ubegrenset. På en torus går motorveien til slutt rundt og kjører inn i restene mauren la igjen tidligere, og bevegelsen blir uregelmessig igjen, noen ganger helt til en ny motorvei dannes.",
          "Det finnes en dypere konsekvens. Torusen har endelig mange celler, hver med endelig mange farger, og mauren har endelig mange posisjoner og retninger. Et deterministisk system med endelig mange tilstander må før eller siden gjenta seg selv nøyaktig. Hver kjøring i denne utforskeren er altså, strengt tatt, periodisk. Perioden er bare astronomisk lang for ethvert rutenett du kan se.",
        ],
      },
    ],
    experimentsHeading: "Prøv dette",
    experiments: [
      {
        title: "Fang motorveien idet den dannes",
        text: "Velg den klassiske regelen RL, sett «Steg / bilde» til 10 og trykk på «Nullstill». Følg med på telleren: Lenge vokser klumpen uten noen synlig plan, og like etter steg 10\u00a0000 begynner en smal diagonal stripe å forlate den. Stripen gjentar de samme 104 stegene om og om igjen og flytter seg to celler per syklus.",
      },
      {
        title: "La motorveien krasje",
        text: "Behold RL, sett cellestørrelsen til 10 og «Steg / bilde» til 5000. Rutenettet er nå lite, så motorveien går raskt rundt kanten og treffer det gamle mønsteret. Se hvordan ordenen bryter sammen i kaos igjen.",
      },
      {
        title: "Sammenlign symmetrisk og kaotisk vekst",
        text: "Kjør LLRR en stund, og deretter RLR. LLRR beholder en speilsymmetri mens den vokser, en egenskap som deles av regler bygd av par med like bokstaver. RLR vokser til en uregelmessig klump uten noen motorvei i sikte.",
      },
      {
        title: "Tolv farger, én trekant",
        text: "Velg RRLLLRLLLRRR med cellestørrelse 2. Mauren bygger en fylt trekant som fortsetter å vokse og sakte driver over rutenettet, en ordnet form som kommer fra en regelstreng som ser helt vilkårlig ut.",
      },
    ],
  },
};
