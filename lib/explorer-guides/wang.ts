import type { ExplorerGuide } from "./types";

// Numbers quoted here (sets of 5, 13 and 16 tiles, grid 4 to 24 default 16,
// speed 1 to 400 default 60, the reduced-motion step budget, the edge pairs
// Set B covers, its periodic 3 × 2 block, typical backtrack and step counts)
// come from app/[locale]/wang/explorer/page.tsx and from running its step()
// logic offline; update both together.
const SEARCH_EXCERPT = `// Candidates: tiles still allowed here that also survive the look-ahead.
for (let i = 0; i < tiles.length; i++) {
  if (dom[cell] & (1 << i) && assign(dom, n, sideMasks, cell, i)) candidates.push(i);
}
shuffle(candidates);

if (candidates.length === 0) {
  // Backtrack: pop the top of the stack and try its next remaining choice.
  while (stack.length > 0) {
    const top = stack[stack.length - 1];
    const topCell = cellAt(stack.length - 1);
    if (top.remaining.length > 0) {
      const nextIdx = top.remaining.shift()!;
      domRef.current = assign(top.before, n, sideMasks, topCell, nextIdx) ?? top.before;
      grid[topCell] = tiles[nextIdx];
      return true;
    }
    grid[topCell] = null;
    stack.pop();
  }
}`;

const MATCH_FORMULA = "S(t_{r,c}) = N(t_{r+1,c}), \\qquad E(t_{r,c}) = W(t_{r,c+1})";

export const WANG_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Watch a backtracking search lay Wang tiles edge to edge: compare three tile sets, see why some never get stuck, and how the domino problem became undecidable.",
    heading: "How this explorer works",
    intro:
      "Each square tile has a colour on each of its four edges, and tiles may only touch where their colours match: the bottom of a tile must equal the top of the tile below it, its right edge the left edge of its neighbour. Tiles cannot be rotated or reflected. The canvas shows a search filling a square grid under these rules, one tile at a time, backing up at every dead end.",
    sections: [
      {
        heading: "Wang's question",
        paragraphs: [
          "In 1961 the logician Hao Wang asked whether there is an algorithm that decides, for any finite set of such tiles, whether copies of them can cover the entire infinite plane. He conjectured that every set that tiles the plane can also tile it periodically, which would have given such an algorithm. In 1966 his student Robert Berger proved both wrong. There are aperiodic tile sets, which tile the plane but only without any repetition, and Berger showed that the general question is undecidable, because tiles can be designed to imitate the run of a Turing machine. Berger's set had 20,426 tiles; later work brought the record down to 13 (Karel Culik, 1996) and finally 11 (Jeandel and Rao, 2015).",
          "A useful fact connects the infinite question to this finite grid: a tile set covers the whole plane exactly when it can fill every n × n square. So if an exhaustive search ever proves that some square cannot be filled, the set can never tile the plane. Success on a finite square, on the other hand, proves nothing on its own.",
        ],
        formula: MATCH_FORMULA,
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "Set A has five tiles in two colours. Set B has 13 tiles in four colours, as many as Culik's aperiodic set, but it is not aperiodic: the block of tiles 0, 1, 10 above tiles 0, 3, 12 fits itself on all sides and repeats across the plane. It is here because it makes the search work hard. Set C contains all 16 tiles you can make with two colours. The palette in the sidebar shows every tile of the active set.",
          "The grid size runs from 4 × 4 to 24 × 24 (default 16 × 16) and the speed from 1 to 400 placements per second (default 60). Changing the set or the size, or pressing Restart, starts a fresh search on an empty grid. The counters under the canvas show filled cells, dead ends hit so far, progress and status.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "The search fills the grid backwards: it starts in the bottom-right corner, moves left along each row and then up. Every cell keeps a list of the tiles still possible there. To test a tile, the search places it tentatively and strikes from the neighbouring cells every tile that has lost its matching partner, then does the same for their neighbours until nothing changes (this is called arc consistency). If some cell is left with no tile at all, the candidate is dropped. The surviving candidates are shuffled with a Fisher-Yates shuffle; the first one is placed and the rest are kept on a stack as untried alternatives. The grid has hard borders and no wraparound.",
          "When a cell has no surviving candidate, the search backtracks: it replaces the most recent tile with that cell's next alternative, and if there is none it clears the cell and goes further back. Every such dead end increments the backtrack counter. If the stack empties, every arrangement has been ruled out and the status reads «no tiling exists (proved)». With the three sets offered here that never happens, because all of them tile the plane. An animation loop runs as many steps per frame as the speed requires and stops once the search has finished.",
          "With reduced motion enabled, the page runs the whole search at once and draws only the result. That run has a fixed budget of grid size² × number of tiles × 50 steps. If it ran out, the status would read «gave up after N steps» rather than claim a proof. In 3150 offline runs of Set B over all grid sizes the longest search took 4454 steps, while the smallest budget, at 4 × 4, is 10,400.",
        ],
        code: SEARCH_EXCERPT,
      },
      {
        heading: "Why some sets never backtrack",
        paragraphs: [
          "Inside the grid, every cell asks for one specific pair: because the search works backwards, a given bottom colour and a given right colour. If the set has a tile for every possible pair, the search can never get stuck. Set A has a tile for each of the four pairs with two colours, and Set C has four tiles for each, so both always finish without a single backtrack.",
          "Set B has four colours, so 16 possible pairs, but its 13 tiles cover only eight pairs of bottom and right colour. The look-ahead removes most dead ends before a tile is placed, but not all of them, so the search still has to back up. The direction matters a great deal: seen from the top-left, five pairs of top and left colour are missing, namely (0, 0), (0, 3), (1, 0), (2, 2) and (3, 1), and the same search started in that corner ran past 200,000 steps in more than half of our test runs at 20 × 20. From the bottom-right it needed at most a few thousand at every size.",
        ],
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "A search that never hesitates",
        text: "Choose Set A, a 24 × 24 grid and speed 400. The backtrack counter stays at zero all the way to 576 placed tiles, because every pair of bottom and right colours has a matching tile.",
      },
      {
        title: "Watch a dead end",
        text: "Choose Set B with a 12 × 12 grid and slow the speed to about 10. The violet outline marks the next cell, starting at the bottom right. Whenever no tile survives the look-ahead there, the cells before it change or clear and the backtrack counter goes up. A 12 × 12 grid typically finishes after about ten backtracks, occasionally after several dozen.",
      },
      {
        title: "A hard set that still finishes",
        text: "Keep Set B and set the grid to 24 × 24 at speed 400. Progress climbs and falls back many times in the lower rows and then runs through: in our test runs this took around 850 steps and 50 backtracks in the middle case, and never more than about 5000 steps. Restart reshuffles and produces a different tiling.",
      },
      {
        title: "Randomness that is still periodic",
        text: "Choose Set C at 24 × 24. The result looks like random noise and needs no backtracking, yet this set trivially tiles the plane periodically: it contains the tile with four cyan edges, and copies of that one tile alone repeat forever.",
      },
    ],
  },
  de: {
    metaDescription:
      "Einer Backtracking-Suche beim Legen von Wang-Kacheln zusehen: drei Kachelsätze vergleichen und verstehen, warum das Dominoproblem unentscheidbar ist.",
    heading: "So funktioniert dieser Explorer",
    intro:
      "Jede quadratische Kachel hat an jeder ihrer vier Kanten eine Farbe, und Kacheln dürfen sich nur dort berühren, wo die Farben übereinstimmen: Die Unterkante einer Kachel muss zur Oberkante der Kachel darunter passen, ihre rechte Kante zur linken Kante der Nachbarin. Drehen und Spiegeln ist verboten. Das Canvas zeigt eine Suche, die ein quadratisches Gitter nach diesen Regeln füllt, Kachel für Kachel, und an jeder Sackgasse zurückgeht.",
    sections: [
      {
        heading: "Wangs Frage",
        paragraphs: [
          "1961 fragte der Logiker Hao Wang, ob es einen Algorithmus gibt, der für jede endliche Menge solcher Kacheln entscheidet, ob ihre Kopien die ganze unendliche Ebene bedecken können. Er vermutete, dass jeder Satz, der die Ebene kachelt, das auch periodisch kann, und das hätte einen solchen Algorithmus geliefert. 1966 widerlegte sein Doktorand Robert Berger beides. Es gibt aperiodische Kachelsätze, die die Ebene nur ohne jede Wiederholung bedecken, und Berger zeigte, dass die allgemeine Frage unentscheidbar ist, weil sich Kacheln so entwerfen lassen, dass sie den Lauf einer Turingmaschine nachahmen. Bergers Satz hatte 20.426 Kacheln; spätere Arbeiten drückten den Rekord auf 13 (Karel Culik, 1996) und schließlich auf 11 (Jeandel und Rao, 2015).",
          "Eine nützliche Tatsache verbindet die unendliche Frage mit diesem endlichen Gitter: Ein Kachelsatz bedeckt die ganze Ebene genau dann, wenn er jedes n × n-Quadrat füllen kann. Beweist eine vollständige Suche also, dass sich ein Quadrat nicht füllen lässt, kann der Satz die Ebene niemals kacheln. Erfolg auf einem endlichen Quadrat beweist dagegen für sich genommen nichts.",
        ],
        formula: MATCH_FORMULA,
      },
      {
        heading: "Was die Regler bewirken",
        paragraphs: [
          "Satz A hat fünf Kacheln in zwei Farben. Satz B hat 13 Kacheln in vier Farben, so viele wie Culiks aperiodischer Satz, ist aber nicht aperiodisch: Der Block aus den Kacheln 0, 1, 10 über den Kacheln 0, 3, 12 passt an allen Seiten an sich selbst und wiederholt sich über die ganze Ebene. Er ist dabei, weil die Suche sich an ihm anstrengen muss. Satz C enthält alle 16 Kacheln, die sich mit zwei Farben bilden lassen. Die Palette in der Seitenleiste zeigt jede Kachel des aktiven Satzes.",
          "Die Gittergröße reicht von 4 × 4 bis 24 × 24 (voreingestellt 16 × 16), die Geschwindigkeit von 1 bis 400 Platzierungen pro Sekunde (voreingestellt 60). Ein Wechsel von Satz oder Größe oder ein Klick auf Neustart beginnt eine frische Suche auf leerem Gitter. Die Zähler unter dem Canvas zeigen gefüllte Zellen, bisherige Sackgassen, Fortschritt und Status.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Die Suche füllt das Gitter rückwärts: Sie beginnt in der Ecke unten rechts, geht in jeder Zeile nach links und dann nach oben. Jede Zelle führt eine Liste der Kacheln, die dort noch möglich sind. Um eine Kachel zu prüfen, legt die Suche sie probeweise und streicht in den Nachbarzellen jede Kachel, die ihre passende Partnerin verloren hat, dann ebenso bei deren Nachbarinnen, bis sich nichts mehr ändert (das heißt Kantenkonsistenz). Bleibt irgendeine Zelle ganz ohne Kachel, fällt der Kandidat weg. Die übrigen Kandidaten werden mit einem Fisher-Yates-Shuffle gemischt; der erste wird gelegt, der Rest landet als noch nicht probierte Alternativen auf einem Stapel. Das Gitter hat feste Ränder ohne Umlauf.",
          "Hat eine Zelle keinen übrigen Kandidaten, setzt die Suche zurück: Sie ersetzt die zuletzt gelegte Kachel durch die nächste Alternative dieser Zelle, und gibt es keine, leert sie die Zelle und geht weiter zurück. Jede solche Sackgasse erhöht den Backtrack-Zähler. Wird der Stapel leer, ist jede Anordnung ausgeschlossen, und der Status lautet «keine Kachelung möglich (bewiesen)». Bei den drei angebotenen Sätzen passiert das nie, weil alle die Ebene kacheln. Eine Animationsschleife führt pro Frame so viele Schritte aus, wie die Geschwindigkeit verlangt, und hört auf, sobald die Suche beendet ist.",
          "Bei reduzierter Bewegung rechnet die Seite die ganze Suche auf einmal und zeichnet nur das Ergebnis. Dieser Lauf hat ein festes Budget von Gittergröße² × Kachelzahl × 50 Schritten. Wäre es aufgebraucht, hieße der Status «nach N Schritten abgebrochen», statt einen Beweis zu behaupten. In 3150 Testläufen mit Satz B über alle Gittergrößen brauchte die längste Suche 4454 Schritte, während das kleinste Budget, bei 4 × 4, bei 10.400 liegt.",
        ],
        code: SEARCH_EXCERPT,
      },
      {
        heading: "Warum manche Sätze nie zurücksetzen",
        paragraphs: [
          "Im Inneren des Gitters verlangt jede Zelle ein bestimmtes Paar: weil die Suche rückwärts arbeitet, eine gegebene Farbe unten und eine gegebene Farbe rechts. Hat der Satz für jedes mögliche Paar eine Kachel, kann die Suche nie stecken bleiben. Satz A hat für jedes der vier Paare mit zwei Farben eine Kachel, Satz C sogar vier, deshalb werden beide immer ohne ein einziges Backtracking fertig.",
          "Satz B hat vier Farben, also 16 mögliche Paare, aber seine 13 Kacheln decken nur acht Paare aus unterer und rechter Farbe ab. Die Vorausschau räumt die meisten Sackgassen weg, bevor eine Kachel gelegt wird, aber nicht alle, also muss die Suche trotzdem zurück. Die Richtung macht viel aus: Von oben links gesehen fehlen fünf Paare aus oberer und linker Farbe, nämlich (0, 0), (0, 3), (1, 0), (2, 2) und (3, 1), und dieselbe Suche lief von dieser Ecke aus bei 20 × 20 in mehr als der Hälfte unserer Testläufe über 200.000 Schritte hinaus. Von unten rechts brauchte sie bei jeder Größe höchstens ein paar tausend.",
        ],
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Eine Suche ohne Zögern",
        text: "Wähle Satz A, ein 24 × 24-Gitter und Geschwindigkeit 400. Der Backtrack-Zähler bleibt bis zur 576. Kachel bei null, weil es für jedes Paar aus unterer und rechter Farbe eine passende Kachel gibt.",
      },
      {
        title: "Eine Sackgasse beobachten",
        text: "Wähle Satz B mit einem 12 × 12-Gitter und senk die Geschwindigkeit auf etwa 10. Der violette Rahmen markiert die nächste Zelle und startet unten rechts. Übersteht dort keine Kachel die Vorausschau, wechseln oder leeren sich die Zellen davor, und der Backtrack-Zähler steigt. Typischerweise ist ein 12 × 12-Gitter nach etwa zehn Backtracks fertig, gelegentlich erst nach mehreren Dutzend.",
      },
      {
        title: "Ein harter Satz, der trotzdem fertig wird",
        text: "Bleib bei Satz B und stell das Gitter auf 24 × 24 bei Geschwindigkeit 400. Der Fortschritt steigt und fällt in den unteren Zeilen viele Male zurück und läuft dann durch: In unseren Testläufen waren das im mittleren Fall rund 850 Schritte und 50 Backtracks und nie mehr als etwa 5000 Schritte. Neustart mischt neu und liefert eine andere Kachelung.",
      },
      {
        title: "Zufällig und trotzdem periodisch",
        text: "Wähle Satz C bei 24 × 24. Das Ergebnis sieht aus wie zufälliges Rauschen und braucht kein Backtracking, trotzdem kachelt dieser Satz die Ebene ganz trivial periodisch: Er enthält die Kachel mit vier cyanfarbenen Kanten, und Kopien dieser einen Kachel allein wiederholen sich endlos.",
      },
    ],
  },
  es: {
    metaDescription:
      "Mira cómo una búsqueda con retroceso coloca teselas de Wang: compara tres conjuntos y descubre por qué el problema del dominó resultó ser indecidible.",
    heading: "Cómo funciona este explorador",
    intro:
      "Cada tesela cuadrada tiene un color en cada uno de sus cuatro lados, y las teselas solo pueden tocarse donde sus colores coinciden: el lado inferior de una tesela debe ser igual al lado superior de la que tiene debajo, y su lado derecho al lado izquierdo de su vecina. Las teselas no se pueden girar ni reflejar. El lienzo muestra una búsqueda que rellena una cuadrícula cuadrada con estas reglas, tesela a tesela, retrocediendo en cada callejón sin salida.",
    sections: [
      {
        heading: "La pregunta de Wang",
        paragraphs: [
          "En 1961 el lógico Hao Wang preguntó si existe un algoritmo que decida, para cualquier conjunto finito de teselas de este tipo, si con copias de ellas se puede cubrir todo el plano infinito. Conjeturó que todo conjunto que tesela el plano puede hacerlo también de forma periódica, lo que habría proporcionado ese algoritmo. En 1966 su estudiante Robert Berger demostró que ambas cosas eran falsas. Existen conjuntos de teselas aperiódicos, que teselan el plano pero solo sin repetición alguna, y Berger demostró que la pregunta general es indecidible, porque se pueden diseñar teselas que imiten la ejecución de una máquina de Turing. El conjunto de Berger tenía 20 426 teselas; trabajos posteriores bajaron el récord a 13 (Karel Culik, 1996) y finalmente a 11 (Jeandel y Rao, 2015).",
          "Un hecho útil conecta la pregunta infinita con esta cuadrícula finita: un conjunto de teselas cubre todo el plano exactamente cuando puede rellenar cualquier cuadrado n × n. Así que, si una búsqueda exhaustiva llega a demostrar que algún cuadrado no se puede rellenar, el conjunto nunca podrá teselar el plano. El éxito en un cuadrado finito, en cambio, no demuestra nada por sí solo.",
        ],
        formula: MATCH_FORMULA,
      },
      {
        heading: "Qué hacen los controles",
        paragraphs: [
          "El Conjunto A tiene cinco teselas en dos colores. El Conjunto B tiene 13 teselas en cuatro colores, tantas como el conjunto aperiódico de Culik, pero no es aperiódico: el bloque formado por las teselas 0, 1, 10 encima de las teselas 0, 3, 12 encaja consigo mismo por todos los lados y se repite por todo el plano. Está aquí porque obliga a la búsqueda a trabajar duro. El Conjunto C contiene las 16 teselas que se pueden formar con dos colores. La paleta de la barra lateral muestra todas las teselas del conjunto activo.",
          "El tamaño de la malla va de 4 × 4 a 24 × 24 (por defecto 16 × 16) y la velocidad de 1 a 400 colocaciones por segundo (por defecto 60). Al cambiar de conjunto o de tamaño, o al pulsar «Reiniciar», empieza una búsqueda nueva sobre una cuadrícula vacía. Los contadores bajo el lienzo muestran las celdas rellenas, los callejones sin salida encontrados hasta el momento, el progreso y el estado.",
        ],
      },
      {
        heading: "Cómo está construido",
        paragraphs: [
          "La búsqueda rellena la cuadrícula hacia atrás: empieza en la esquina inferior derecha, avanza hacia la izquierda por cada fila y después sube. Cada celda guarda una lista de las teselas que todavía son posibles en ella. Para probar una tesela, la búsqueda la coloca provisionalmente y tacha de las celdas vecinas toda tesela que haya perdido a su pareja compatible, y luego hace lo mismo con las vecinas de estas hasta que nada cambia (esto se llama consistencia de arco). Si alguna celda se queda sin ninguna tesela, la candidata se descarta. Las candidatas que sobreviven se barajan con el algoritmo de Fisher-Yates; la primera se coloca y las demás se guardan en una pila como alternativas sin probar. La cuadrícula tiene bordes rígidos y no se enrolla sobre sí misma.",
          "Cuando una celda no tiene ninguna candidata superviviente, la búsqueda retrocede: sustituye la tesela más reciente por la siguiente alternativa de esa celda y, si no queda ninguna, vacía la celda y retrocede más. Cada uno de estos callejones sin salida incrementa el contador de retrocesos. Si la pila se vacía, todas las disposiciones han quedado descartadas y el estado indica «no existe teselación (demostrado)». Con los tres conjuntos que se ofrecen aquí eso no ocurre nunca, porque todos teselan el plano. Un bucle de animación ejecuta tantos pasos por fotograma como exija la velocidad y se detiene en cuanto la búsqueda termina.",
          "Con el movimiento reducido activado, la página ejecuta toda la búsqueda de una vez y dibuja solo el resultado. Esa ejecución tiene un presupuesto fijo de tamaño de la malla² × número de teselas × 50 pasos. Si se agotara, el estado indicaría «abandonada tras N pasos» en lugar de afirmar una demostración. En 3150 ejecuciones fuera de línea del Conjunto B con todos los tamaños de malla, la búsqueda más larga necesitó 4454 pasos, mientras que el presupuesto más pequeño, el de 4 × 4, es de 10 400.",
        ],
        code: SEARCH_EXCERPT,
      },
      {
        heading: "Por qué algunos conjuntos nunca retroceden",
        paragraphs: [
          "Dentro de la cuadrícula, cada celda pide un par concreto: como la búsqueda trabaja hacia atrás, un color inferior dado y un color derecho dado. Si el conjunto tiene una tesela para cada par posible, la búsqueda nunca puede atascarse. El Conjunto A tiene una tesela para cada uno de los cuatro pares con dos colores, y el Conjunto C tiene cuatro para cada uno, así que ambos terminan siempre sin un solo retroceso.",
          "El Conjunto B tiene cuatro colores, es decir, 16 pares posibles, pero sus 13 teselas cubren solo ocho pares de color inferior y derecho. La anticipación elimina la mayoría de los callejones sin salida antes de colocar una tesela, pero no todos, así que la búsqueda tiene que retroceder de todos modos. La dirección importa mucho: vistos desde la esquina superior izquierda faltan cinco pares de color superior e izquierdo, a saber (0, 0), (0, 3), (1, 0), (2, 2) y (3, 1), y la misma búsqueda iniciada en esa esquina superó los 200 000 pasos en más de la mitad de nuestras ejecuciones de prueba con 20 × 20. Desde la esquina inferior derecha necesitó como mucho unos pocos miles en todos los tamaños.",
        ],
      },
    ],
    experimentsHeading: "Prueba esto",
    experiments: [
      {
        title: "Una búsqueda que nunca duda",
        text: "Elige el Conjunto A, una malla de 24 × 24 y velocidad 400. El contador de retrocesos se queda en cero hasta las 576 teselas colocadas, porque para cada par de color inferior y derecho hay una tesela que encaja.",
      },
      {
        title: "Observa un callejón sin salida",
        text: "Elige el Conjunto B con una malla de 12 × 12 y baja la velocidad a unos 10. El contorno violeta marca la siguiente celda, empezando abajo a la derecha. Cada vez que ninguna tesela sobrevive allí a la anticipación, las celdas anteriores cambian o se vacían y el contador de retrocesos sube. Una malla de 12 × 12 suele terminar tras unos diez retrocesos, y de vez en cuando tras varias decenas.",
      },
      {
        title: "Un conjunto difícil que aun así termina",
        text: "Sigue con el Conjunto B y pon la malla en 24 × 24 con velocidad 400. El progreso sube y vuelve a caer muchas veces en las filas inferiores y después avanza de un tirón: en nuestras ejecuciones de prueba esto llevó unos 850 pasos y 50 retrocesos en el caso mediano, y nunca más de unos 5000 pasos. «Reiniciar» vuelve a barajar y produce una teselación distinta.",
      },
      {
        title: "Un azar que sigue siendo periódico",
        text: "Elige el Conjunto C con 24 × 24. El resultado parece ruido aleatorio y no necesita ningún retroceso, y sin embargo este conjunto tesela el plano de forma periódica de manera trivial: contiene la tesela con los cuatro lados cian, y las copias de esa única tesela se repiten sin fin.",
      },
    ],
  },
  fr: {
    metaDescription:
      "Regarde une recherche par retour arrière poser des tuiles de Wang : compare trois jeux de tuiles et découvre pourquoi le problème du domino est indécidable.",
    heading: "Comment fonctionne cet explorateur",
    intro:
      "Chaque tuile carrée porte une couleur sur chacun de ses quatre bords, et deux tuiles ne peuvent se toucher que là où leurs couleurs coïncident : le bas d'une tuile doit être identique au haut de la tuile du dessous, son bord droit au bord gauche de sa voisine. Les tuiles ne peuvent être ni tournées ni retournées. Le canevas montre une recherche qui remplit une grille carrée selon ces règles, une tuile à la fois, en revenant en arrière à chaque impasse.",
    sections: [
      {
        heading: "La question de Wang",
        paragraphs: [
          "En 1961, le logicien Hao Wang a demandé s'il existe un algorithme qui décide, pour tout ensemble fini de telles tuiles, si des copies de celles-ci peuvent recouvrir tout le plan infini. Il a conjecturé que tout jeu qui pave le plan peut aussi le paver périodiquement, ce qui aurait fourni un tel algorithme. En 1966, son étudiant Robert Berger a prouvé que les deux idées étaient fausses. Il existe des jeux de tuiles apériodiques, qui pavent le plan mais seulement sans aucune répétition, et Berger a montré que la question générale est indécidable, car on peut concevoir des tuiles qui imitent l'exécution d'une machine de Turing. Le jeu de Berger comptait 20\u00a0426 tuiles ; des travaux ultérieurs ont abaissé le record à 13 (Karel Culik, 1996) puis à 11 (Jeandel et Rao, 2015).",
          "Un fait utile relie la question infinie à cette grille finie : un jeu de tuiles recouvre tout le plan exactement quand il peut remplir chaque carré n × n. Donc, si une recherche exhaustive prouve un jour qu'un certain carré ne peut pas être rempli, le jeu ne pourra jamais paver le plan. La réussite sur un carré fini, en revanche, ne prouve rien à elle seule.",
        ],
        formula: MATCH_FORMULA,
      },
      {
        heading: "À quoi servent les commandes",
        paragraphs: [
          "Le Jeu A comporte cinq tuiles en deux couleurs. Le Jeu B comporte 13 tuiles en quatre couleurs, autant que le jeu apériodique de Culik, mais il n'est pas apériodique : le bloc des tuiles 0, 1, 10 au-dessus des tuiles 0, 3, 12 s'emboîte avec lui-même sur tous les côtés et se répète sur tout le plan. Il est là parce qu'il donne du fil à retordre à la recherche. Le Jeu C contient les 16 tuiles que l'on peut former avec deux couleurs. La palette de la barre latérale montre toutes les tuiles du jeu actif.",
          "La taille de la grille va de 4 × 4 à 24 × 24 (16 × 16 par défaut) et la vitesse de 1 à 400 poses par seconde (60 par défaut). Changer de jeu ou de taille, ou appuyer sur « Redémarrer », lance une nouvelle recherche sur une grille vide. Les compteurs sous le canevas indiquent les cases remplies, les impasses rencontrées jusque-là, la progression et l'état.",
        ],
      },
      {
        heading: "Comment c'est construit",
        paragraphs: [
          "La recherche remplit la grille à rebours : elle commence dans le coin inférieur droit, avance vers la gauche le long de chaque ligne, puis remonte. Chaque case tient une liste des tuiles encore possibles à cet endroit. Pour tester une tuile, la recherche la pose à titre provisoire et raye des cases voisines toute tuile qui a perdu sa partenaire compatible, puis fait de même pour leurs voisines jusqu'à ce que plus rien ne change (c'est ce qu'on appelle la cohérence d'arc). Si une case se retrouve sans aucune tuile, la candidate est écartée. Les candidates restantes sont mélangées par un mélange de Fisher-Yates ; la première est posée et les autres sont gardées sur une pile comme alternatives non essayées. La grille a des bords fixes, sans repliement.",
          "Quand une case n'a plus aucune candidate, la recherche revient en arrière : elle remplace la tuile la plus récente par l'alternative suivante de cette case et, s'il n'y en a plus, elle vide la case et recule encore. Chacune de ces impasses incrémente le compteur de retours. Si la pile se vide, tous les arrangements ont été exclus et l'état affiche « aucun pavage possible (prouvé) ». Avec les trois jeux proposés ici, cela n'arrive jamais, car tous pavent le plan. Une boucle d'animation exécute autant d'étapes par image que la vitesse l'exige et s'arrête dès que la recherche est terminée.",
          "Quand la réduction des animations est activée, la page exécute toute la recherche d'un coup et ne dessine que le résultat. Cette exécution dispose d'un budget fixe de taille de la grille² × nombre de tuiles × 50 étapes. S'il était épuisé, l'état afficherait « abandon après N étapes » au lieu de prétendre à une preuve. Sur 3\u00a0150 exécutions hors ligne du Jeu B pour toutes les tailles de grille, la recherche la plus longue a pris 4\u00a0454 étapes, alors que le plus petit budget, celui du 4 × 4, est de 10\u00a0400.",
        ],
        code: SEARCH_EXCERPT,
      },
      {
        heading: "Pourquoi certains jeux ne reviennent jamais en arrière",
        paragraphs: [
          "À l'intérieur de la grille, chaque case réclame une paire précise : comme la recherche travaille à rebours, une couleur du bas donnée et une couleur de droite donnée. Si le jeu possède une tuile pour chaque paire possible, la recherche ne peut jamais se bloquer. Le Jeu A a une tuile pour chacune des quatre paires à deux couleurs, et le Jeu C en a quatre pour chacune : tous deux terminent donc toujours sans un seul retour en arrière.",
          "Le Jeu B a quatre couleurs, donc 16 paires possibles, mais ses 13 tuiles ne couvrent que huit paires de couleurs du bas et de droite. L'anticipation élimine la plupart des impasses avant qu'une tuile ne soit posée, mais pas toutes, si bien que la recherche doit tout de même reculer. Le sens compte énormément : vues depuis le coin supérieur gauche, cinq paires de couleurs du haut et de gauche manquent, à savoir (0, 0), (0, 3), (1, 0), (2, 2) et (3, 1), et la même recherche lancée depuis ce coin a dépassé 200\u00a0000 étapes dans plus de la moitié de nos essais en 20 × 20. Depuis le coin inférieur droit, il lui en a fallu au plus quelques milliers, quelle que soit la taille.",
        ],
      },
    ],
    experimentsHeading: "À essayer",
    experiments: [
      {
        title: "Une recherche qui n'hésite jamais",
        text: "Choisis le Jeu A, une grille 24 × 24 et la vitesse 400. Le compteur de retours reste à zéro jusqu'aux 576 tuiles posées, parce que chaque paire de couleurs du bas et de droite a une tuile qui convient.",
      },
      {
        title: "Observe une impasse",
        text: "Choisis le Jeu B avec une grille 12 × 12 et ralentis la vitesse à environ 10. Le contour violet marque la prochaine case, en partant d'en bas à droite. Chaque fois qu'aucune tuile n'y survit à l'anticipation, les cases précédentes changent ou se vident et le compteur de retours augmente. Une grille 12 × 12 se termine en général après une dizaine de retours, parfois après plusieurs dizaines.",
      },
      {
        title: "Un jeu difficile qui aboutit quand même",
        text: "Garde le Jeu B et passe la grille à 24 × 24 avec la vitesse 400. La progression monte et retombe de nombreuses fois dans les lignes du bas, puis file jusqu'au bout : dans nos essais, cela a demandé environ 850 étapes et 50 retours dans le cas médian, et jamais plus de 5\u00a0000 étapes environ. « Redémarrer » mélange à nouveau et produit un pavage différent.",
      },
      {
        title: "Un hasard qui reste périodique",
        text: "Choisis le Jeu C en 24 × 24. Le résultat ressemble à du bruit aléatoire et ne demande aucun retour en arrière, et pourtant ce jeu pave trivialement le plan de façon périodique : il contient la tuile aux quatre bords cyan, et des copies de cette seule tuile se répètent à l'infini.",
      },
    ],
  },
  it: {
    metaDescription:
      "Guarda una ricerca con backtracking posare tasselli di Wang: confronta tre insiemi di tasselli e scopri perché il problema del domino è indecidibile.",
    heading: "Come funziona questo esploratore",
    intro:
      "Ogni tassello quadrato ha un colore su ciascuno dei suoi quattro lati, e i tasselli possono toccarsi solo dove i colori coincidono: il lato inferiore di un tassello deve essere uguale al lato superiore di quello sottostante, il suo lato destro al lato sinistro del vicino. I tasselli non si possono ruotare né riflettere. Il canvas mostra una ricerca che riempie una griglia quadrata secondo queste regole, un tassello alla volta, tornando indietro a ogni vicolo cieco.",
    sections: [
      {
        heading: "La domanda di Wang",
        paragraphs: [
          "Nel 1961 il logico Hao Wang si chiese se esista un algoritmo che decida, per qualunque insieme finito di tasselli di questo tipo, se le loro copie possano ricoprire l'intero piano infinito. Congetturò che ogni insieme che tassella il piano possa tassellarlo anche in modo periodico, il che avrebbe fornito un tale algoritmo. Nel 1966 il suo studente Robert Berger dimostrò che entrambe le idee erano sbagliate. Esistono insiemi di tasselli aperiodici, che tassellano il piano ma solo senza alcuna ripetizione, e Berger mostrò che la domanda generale è indecidibile, perché si possono progettare tasselli che imitano l'esecuzione di una macchina di Turing. L'insieme di Berger aveva 20.426 tasselli; lavori successivi hanno abbassato il record a 13 (Karel Culik, 1996) e infine a 11 (Jeandel e Rao, 2015).",
          "Un fatto utile collega la domanda infinita a questa griglia finita: un insieme di tasselli ricopre tutto il piano esattamente quando riesce a riempire ogni quadrato n × n. Quindi, se una ricerca esaustiva dimostra che un certo quadrato non può essere riempito, l'insieme non potrà mai tassellare il piano. Il successo su un quadrato finito, invece, da solo non dimostra nulla.",
        ],
        formula: MATCH_FORMULA,
      },
      {
        heading: "Che cosa fanno i controlli",
        paragraphs: [
          "L'Insieme A ha cinque tasselli in due colori. L'Insieme B ha 13 tasselli in quattro colori, tanti quanti l'insieme aperiodico di Culik, ma non è aperiodico: il blocco dei tasselli 0, 1, 10 sopra i tasselli 0, 3, 12 combacia con sé stesso su tutti i lati e si ripete su tutto il piano. È qui perché mette a dura prova la ricerca. L'Insieme C contiene tutti i 16 tasselli che si possono costruire con due colori. La tavolozza nella barra laterale mostra ogni tassello dell'insieme attivo.",
          "La dimensione della griglia va da 4 × 4 a 24 × 24 (predefinita 16 × 16) e la velocità da 1 a 400 pose al secondo (predefinita 60). Cambiare insieme o dimensione, oppure premere «Riavvia», fa partire una nuova ricerca su una griglia vuota. I contatori sotto il canvas mostrano le celle riempite, i vicoli ciechi incontrati finora, l'avanzamento e lo stato.",
        ],
      },
      {
        heading: "Com'è costruito",
        paragraphs: [
          "La ricerca riempie la griglia a ritroso: parte dall'angolo in basso a destra, procede verso sinistra lungo ogni riga e poi sale. Ogni cella tiene un elenco dei tasselli ancora possibili in quel punto. Per mettere alla prova un tassello, la ricerca lo posa provvisoriamente e cancella dalle celle vicine ogni tassello che ha perso il proprio compagno compatibile, poi fa lo stesso con le loro vicine finché non cambia più nulla (si chiama consistenza d'arco). Se qualche cella resta senza alcun tassello, il candidato viene scartato. I candidati sopravvissuti vengono mescolati con l'algoritmo di Fisher-Yates; il primo viene posato e gli altri sono conservati su una pila come alternative non ancora provate. La griglia ha bordi rigidi e non si richiude su sé stessa.",
          "Quando una cella non ha alcun candidato superstite, la ricerca fa backtracking: sostituisce il tassello più recente con l'alternativa successiva di quella cella e, se non ce ne sono, svuota la cella e torna ancora più indietro. Ognuno di questi vicoli ciechi incrementa il contatore dei backtrack. Se la pila si svuota, ogni disposizione è stata esclusa e lo stato riporta «nessun rivestimento possibile (dimostrato)». Con i tre insiemi proposti qui non succede mai, perché tutti tassellano il piano. Un ciclo di animazione esegue tanti passi per fotogramma quanti ne richiede la velocità e si ferma appena la ricerca è terminata.",
          "Con il movimento ridotto attivo, la pagina esegue l'intera ricerca in una volta sola e disegna soltanto il risultato. Questa esecuzione ha un budget fisso di dimensione della griglia² × numero di tasselli × 50 passi. Se si esaurisse, lo stato riporterebbe «interrotta dopo N passi» invece di vantare una dimostrazione. In 3150 esecuzioni offline dell'Insieme B su tutte le dimensioni della griglia, la ricerca più lunga ha richiesto 4454 passi, mentre il budget più piccolo, quello del 4 × 4, è di 10.400.",
        ],
        code: SEARCH_EXCERPT,
      },
      {
        heading: "Perché alcuni insiemi non tornano mai indietro",
        paragraphs: [
          "All'interno della griglia ogni cella chiede una coppia precisa: poiché la ricerca lavora a ritroso, un dato colore inferiore e un dato colore destro. Se l'insieme ha un tassello per ogni coppia possibile, la ricerca non può mai bloccarsi. L'Insieme A ha un tassello per ciascuna delle quattro coppie con due colori, e l'Insieme C ne ha quattro per ciascuna, quindi entrambi finiscono sempre senza un solo backtrack.",
          "L'Insieme B ha quattro colori, quindi 16 coppie possibili, ma i suoi 13 tasselli coprono solo otto coppie di colore inferiore e destro. La previsione in avanti elimina la maggior parte dei vicoli ciechi prima che un tassello venga posato, ma non tutti, così la ricerca deve comunque tornare indietro. La direzione conta moltissimo: viste dall'angolo in alto a sinistra mancano cinque coppie di colore superiore e sinistro, cioè (0, 0), (0, 3), (1, 0), (2, 2) e (3, 1), e la stessa ricerca avviata da quell'angolo ha superato i 200.000 passi in più della metà delle nostre prove su 20 × 20. Dall'angolo in basso a destra ne ha richiesti al massimo poche migliaia a ogni dimensione.",
        ],
      },
    ],
    experimentsHeading: "Prova così",
    experiments: [
      {
        title: "Una ricerca che non esita mai",
        text: "Scegli l'Insieme A, una griglia 24 × 24 e velocità 400. Il contatore dei backtrack resta a zero fino ai 576 tasselli posati, perché per ogni coppia di colore inferiore e destro c'è un tassello che combacia.",
      },
      {
        title: "Osserva un vicolo cieco",
        text: "Scegli l'Insieme B con una griglia 12 × 12 e rallenta la velocità a circa 10. Il contorno viola indica la cella successiva, a partire da in basso a destra. Ogni volta che lì nessun tassello sopravvive alla previsione in avanti, le celle precedenti cambiano o si svuotano e il contatore dei backtrack sale. Una griglia 12 × 12 di solito termina dopo una decina di backtrack, ogni tanto dopo diverse decine.",
      },
      {
        title: "Un insieme difficile che arriva comunque in fondo",
        text: "Resta sull'Insieme B e porta la griglia a 24 × 24 con velocità 400. L'avanzamento sale e ricade molte volte nelle righe inferiori e poi arriva fino in fondo: nelle nostre prove sono serviti circa 850 passi e 50 backtrack nel caso mediano, e mai più di 5000 passi circa. «Riavvia» rimescola e produce una tassellatura diversa.",
      },
      {
        title: "Una casualità che resta periodica",
        text: "Scegli l'Insieme C a 24 × 24. Il risultato sembra rumore casuale e non richiede alcun backtracking, eppure questo insieme tassella banalmente il piano in modo periodico: contiene il tassello con quattro lati ciano, e le copie di quel solo tassello si ripetono all'infinito.",
      },
    ],
  },
  pt: {
    metaDescription:
      "Vê uma busca com retrocesso colocar tijolos de Wang lado a lado: compara três conjuntos e percebe porque é que o problema do dominó é indecidível.",
    heading: "Como funciona este explorador",
    intro:
      "Cada tijolo quadrado tem uma cor em cada um dos seus quatro lados, e os tijolos só se podem tocar onde as cores coincidem: o lado de baixo de um tijolo tem de ser igual ao lado de cima do tijolo que fica por baixo, e o lado direito igual ao lado esquerdo do vizinho. Os tijolos não podem ser rodados nem refletidos. O canvas mostra uma busca a preencher uma grelha quadrada segundo estas regras, um tijolo de cada vez, recuando em cada beco sem saída.",
    sections: [
      {
        heading: "A pergunta de Wang",
        paragraphs: [
          "Em 1961, o lógico Hao Wang perguntou se existe um algoritmo que decida, para qualquer conjunto finito de tijolos deste tipo, se cópias deles conseguem cobrir todo o plano infinito. Conjeturou que qualquer conjunto que ladrilha o plano também o consegue ladrilhar de forma periódica, o que teria dado esse algoritmo. Em 1966, o seu aluno Robert Berger provou que ambas as ideias estavam erradas. Existem conjuntos de tijolos aperiódicos, que ladrilham o plano mas apenas sem qualquer repetição, e Berger mostrou que a pergunta geral é indecidível, porque é possível desenhar tijolos que imitam a execução de uma máquina de Turing. O conjunto de Berger tinha 20\u00a0426 tijolos; trabalhos posteriores baixaram o recorde para 13 (Karel Culik, 1996) e por fim para 11 (Jeandel e Rao, 2015).",
          "Um facto útil liga a pergunta infinita a esta grelha finita: um conjunto de tijolos cobre o plano inteiro exatamente quando consegue preencher qualquer quadrado n × n. Assim, se uma busca exaustiva alguma vez provar que um certo quadrado não pode ser preenchido, o conjunto nunca poderá ladrilhar o plano. Já o sucesso num quadrado finito, por si só, não prova nada.",
        ],
        formula: MATCH_FORMULA,
      },
      {
        heading: "O que fazem os controlos",
        paragraphs: [
          "O Conjunto A tem cinco tijolos em duas cores. O Conjunto B tem 13 tijolos em quatro cores, tantos como o conjunto aperiódico de Culik, mas não é aperiódico: o bloco dos tijolos 0, 1, 10 por cima dos tijolos 0, 3, 12 encaixa em si próprio por todos os lados e repete-se por todo o plano. Está aqui porque dá muito trabalho à busca. O Conjunto C contém todos os 16 tijolos que se podem formar com duas cores. A paleta na barra lateral mostra todos os tijolos do conjunto ativo.",
          "O tamanho da grelha vai de 4 × 4 a 24 × 24 (predefinição 16 × 16) e a velocidade de 1 a 400 colocações por segundo (predefinição 60). Mudar de conjunto ou de tamanho, ou carregar em «Reiniciar», inicia uma busca nova numa grelha vazia. Os contadores por baixo do canvas mostram as células preenchidas, os becos sem saída encontrados até ao momento, o progresso e o estado.",
        ],
      },
      {
        heading: "Como está construído",
        paragraphs: [
          "A busca preenche a grelha de trás para a frente: começa no canto inferior direito, avança para a esquerda ao longo de cada linha e depois sobe. Cada célula guarda uma lista dos tijolos que ainda são possíveis ali. Para testar um tijolo, a busca coloca-o provisoriamente e risca das células vizinhas todos os tijolos que perderam o parceiro compatível, fazendo depois o mesmo com as vizinhas destas até nada mudar (chama-se a isto consistência de arco). Se alguma célula ficar sem tijolo nenhum, o candidato é descartado. Os candidatos sobreviventes são baralhados com o algoritmo de Fisher-Yates; o primeiro é colocado e os restantes ficam guardados numa pilha como alternativas por experimentar. A grelha tem margens rígidas e não dá a volta.",
          "Quando uma célula não tem nenhum candidato sobrevivente, a busca recua: substitui o tijolo mais recente pela alternativa seguinte dessa célula e, se não houver nenhuma, esvazia a célula e recua ainda mais. Cada um destes becos sem saída incrementa o contador de retrocessos. Se a pilha ficar vazia, todas as disposições foram excluídas e o estado indica «não existe ladrilhamento (provado)». Com os três conjuntos aqui disponíveis isso nunca acontece, porque todos ladrilham o plano. Um ciclo de animação executa tantos passos por fotograma quantos a velocidade exigir e para assim que a busca termina.",
          "Com o movimento reduzido ativado, a página executa a busca inteira de uma só vez e desenha apenas o resultado. Essa execução tem um orçamento fixo de tamanho da grelha² × número de tijolos × 50 passos. Se se esgotasse, o estado indicaria «desistiu após N passos» em vez de afirmar uma prova. Em 3150 execuções offline do Conjunto B com todos os tamanhos de grelha, a busca mais longa demorou 4454 passos, enquanto o orçamento mais pequeno, o de 4 × 4, é de 10\u00a0400.",
        ],
        code: SEARCH_EXCERPT,
      },
      {
        heading: "Porque é que alguns conjuntos nunca recuam",
        paragraphs: [
          "Dentro da grelha, cada célula pede um par específico: como a busca trabalha de trás para a frente, uma dada cor de baixo e uma dada cor da direita. Se o conjunto tiver um tijolo para cada par possível, a busca nunca pode ficar presa. O Conjunto A tem um tijolo para cada um dos quatro pares com duas cores, e o Conjunto C tem quatro para cada um, por isso ambos terminam sempre sem um único retrocesso.",
          "O Conjunto B tem quatro cores, portanto 16 pares possíveis, mas os seus 13 tijolos cobrem apenas oito pares de cor de baixo e da direita. A antecipação elimina a maior parte dos becos sem saída antes de um tijolo ser colocado, mas não todos, pelo que a busca tem mesmo de recuar. A direção importa muito: vistos a partir do canto superior esquerdo, faltam cinco pares de cor de cima e da esquerda, nomeadamente (0, 0), (0, 3), (1, 0), (2, 2) e (3, 1), e a mesma busca iniciada nesse canto ultrapassou os 200\u00a0000 passos em mais de metade das nossas execuções de teste em 20 × 20. A partir do canto inferior direito, precisou no máximo de alguns milhares em todos os tamanhos.",
        ],
      },
    ],
    experimentsHeading: "Experimenta isto",
    experiments: [
      {
        title: "Uma busca que nunca hesita",
        text: "Escolhe o Conjunto A, uma grelha de 24 × 24 e velocidade 400. O contador de retrocessos fica em zero até aos 576 tijolos colocados, porque para cada par de cor de baixo e da direita há um tijolo que encaixa.",
      },
      {
        title: "Observa um beco sem saída",
        text: "Escolhe o Conjunto B com uma grelha de 12 × 12 e reduz a velocidade para cerca de 10. O contorno violeta marca a célula seguinte, começando em baixo, à direita. Sempre que nenhum tijolo sobrevive ali à antecipação, as células anteriores mudam ou esvaziam-se e o contador de retrocessos sobe. Uma grelha de 12 × 12 costuma terminar ao fim de uns dez retrocessos, e de vez em quando ao fim de várias dezenas.",
      },
      {
        title: "Um conjunto difícil que termina na mesma",
        text: "Mantém o Conjunto B e põe a grelha em 24 × 24 com velocidade 400. O progresso sobe e volta a cair muitas vezes nas linhas de baixo e depois segue até ao fim: nas nossas execuções de teste, isto levou cerca de 850 passos e 50 retrocessos no caso mediano, e nunca mais de cerca de 5000 passos. «Reiniciar» volta a baralhar e produz um ladrilhamento diferente.",
      },
      {
        title: "Um acaso que continua a ser periódico",
        text: "Escolhe o Conjunto C em 24 × 24. O resultado parece ruído aleatório e não precisa de nenhum retrocesso, e no entanto este conjunto ladrilha trivialmente o plano de forma periódica: contém o tijolo com os quatro lados ciano, e cópias desse único tijolo repetem-se para sempre.",
      },
    ],
  },
  sv: {
    metaDescription:
      "Se en sökning med backtracking lägga Wang-plattor kant i kant: jämför tre uppsättningar plattor och förstå varför dominoproblemet är oavgörbart.",
    heading: "Så fungerar den här utforskaren",
    intro:
      "Varje kvadratisk platta har en färg på var och en av sina fyra kanter, och plattor får bara ligga intill varandra där färgerna stämmer överens: underkanten på en platta måste vara lika med överkanten på plattan under, och dess högerkant lika med grannens vänsterkant. Plattorna får varken vridas eller speglas. Canvasen visar en sökning som fyller ett kvadratiskt rutnät enligt de här reglerna, en platta i taget, och som backar vid varje återvändsgränd.",
    sections: [
      {
        heading: "Wangs fråga",
        paragraphs: [
          "År 1961 frågade logikern Hao Wang om det finns en algoritm som för varje ändlig mängd sådana plattor avgör om kopior av dem kan täcka hela det oändliga planet. Han förmodade att varje uppsättning som täcker planet också kan täcka det periodiskt, vilket skulle ha gett en sådan algoritm. År 1966 visade hans doktorand Robert Berger att båda antagandena var fel. Det finns aperiodiska uppsättningar plattor, som täcker planet men bara utan någon som helst upprepning, och Berger visade att den allmänna frågan är oavgörbar, eftersom plattor kan utformas så att de efterliknar körningen av en Turingmaskin. Bergers uppsättning hade 20\u00a0426 plattor; senare arbeten pressade rekordet till 13 (Karel Culik, 1996) och till slut 11 (Jeandel och Rao, 2015).",
          "Ett användbart faktum knyter den oändliga frågan till det här ändliga rutnätet: en uppsättning plattor täcker hela planet precis när den kan fylla varje kvadrat med n × n rutor. Om en uttömmande sökning någon gång bevisar att en viss kvadrat inte går att fylla kan uppsättningen alltså aldrig täcka planet. Att lyckas med en ändlig kvadrat bevisar däremot ingenting i sig.",
        ],
        formula: MATCH_FORMULA,
      },
      {
        heading: "Vad reglagen gör",
        paragraphs: [
          "Uppsättning A har fem plattor i två färger. Uppsättning B har 13 plattor i fyra färger, lika många som Culiks aperiodiska uppsättning, men den är inte aperiodisk: blocket med plattorna 0, 1, 10 ovanför plattorna 0, 3, 12 passar mot sig självt på alla sidor och upprepas över hela planet. Den finns med eftersom den får sökningen att arbeta hårt. Uppsättning C innehåller alla 16 plattor som går att göra med två färger. Paletten i sidofältet visar varje platta i den aktiva uppsättningen.",
          "Rutnätsstorleken går från 4 × 4 till 24 × 24 (standard 16 × 16) och hastigheten från 1 till 400 läggningar per sekund (standard 60). Om du byter uppsättning eller storlek, eller trycker på ”Starta om”, börjar en ny sökning på ett tomt rutnät. Räknarna under canvasen visar fyllda rutor, återvändsgränder hittills, framsteg och status.",
        ],
      },
      {
        heading: "Hur den är byggd",
        paragraphs: [
          "Sökningen fyller rutnätet baklänges: den börjar i nedre högra hörnet, går åt vänster längs varje rad och sedan uppåt. Varje ruta håller en lista över de plattor som fortfarande är möjliga där. För att pröva en platta lägger sökningen den på försök och stryker från grannrutorna varje platta som har förlorat sin passande partner, och gör sedan samma sak för deras grannar tills ingenting längre ändras (det kallas bågkonsistens). Om någon ruta blir helt utan plattor stryks kandidaten. De kandidater som klarar sig blandas med en Fisher-Yates-blandning; den första läggs och resten sparas på en stack som oprövade alternativ. Rutnätet har fasta kanter och går inte runt.",
          "När en ruta inte har någon kandidat kvar backar sökningen: den byter ut den senast lagda plattan mot den rutans nästa alternativ, och finns det inget tömmer den rutan och går ännu längre tillbaka. Varje sådan återvändsgränd ökar räknaren för backningar. Om stacken töms har varje arrangemang uteslutits, och statusen lyder ”ingen täckning möjlig (bevisat)”. Med de tre uppsättningar som erbjuds här händer det aldrig, eftersom alla täcker planet. En animationsslinga kör så många steg per bildruta som hastigheten kräver och stannar när sökningen är klar.",
          "Med minskad rörelse aktiverad kör sidan hela sökningen på en gång och ritar bara resultatet. Den körningen har en fast budget på rutnätsstorlek² × antal plattor × 50 steg. Om den tog slut skulle statusen lyda ”avbröt efter N steg” i stället för att påstå ett bevis. I 3150 offlinekörningar av Uppsättning B över alla rutnätsstorlekar tog den längsta sökningen 4454 steg, medan den minsta budgeten, vid 4 × 4, är 10\u00a0400.",
        ],
        code: SEARCH_EXCERPT,
      },
      {
        heading: "Varför vissa uppsättningar aldrig backar",
        paragraphs: [
          "Inne i rutnätet kräver varje ruta ett bestämt par: eftersom sökningen arbetar baklänges, en given färg nedtill och en given färg till höger. Om uppsättningen har en platta för varje möjligt par kan sökningen aldrig köra fast. Uppsättning A har en platta för vart och ett av de fyra paren med två färger, och Uppsättning C har fyra för varje, så båda blir alltid klara utan en enda backning.",
          "Uppsättning B har fyra färger, alltså 16 möjliga par, men dess 13 plattor täcker bara åtta par av färg nedtill och till höger. Förhandskontrollen tar bort de flesta återvändsgränder innan en platta läggs, men inte alla, så sökningen måste ändå backa. Riktningen spelar stor roll: sett från övre vänstra hörnet saknas fem par av färg upptill och till vänster, nämligen (0, 0), (0, 3), (1, 0), (2, 2) och (3, 1), och samma sökning startad i det hörnet gick förbi 200\u00a0000 steg i mer än hälften av våra testkörningar vid 20 × 20. Från nedre högra hörnet behövde den som mest några tusen i varje storlek.",
        ],
      },
    ],
    experimentsHeading: "Prova det här",
    experiments: [
      {
        title: "En sökning som aldrig tvekar",
        text: "Välj Uppsättning A, ett rutnät på 24 × 24 och hastighet 400. Räknaren för backningar står kvar på noll hela vägen till 576 lagda plattor, eftersom varje par av färg nedtill och till höger har en passande platta.",
      },
      {
        title: "Se en återvändsgränd",
        text: "Välj Uppsättning B med ett rutnät på 12 × 12 och sänk hastigheten till ungefär 10. Den violetta ramen markerar nästa ruta och börjar längst ned till höger. Varje gång ingen platta klarar förhandskontrollen där ändras eller töms rutorna före den, och räknaren för backningar går upp. Ett rutnät på 12 × 12 blir oftast klart efter ungefär tio backningar, ibland efter flera dussin.",
      },
      {
        title: "En svår uppsättning som ändå blir klar",
        text: "Behåll Uppsättning B och ställ rutnätet på 24 × 24 med hastighet 400. Framstegen stiger och faller tillbaka många gånger i de nedre raderna och går sedan hela vägen: i våra testkörningar tog det omkring 850 steg och 50 backningar i medianfallet, och aldrig mer än ungefär 5000 steg. ”Starta om” blandar på nytt och ger en annan täckning.",
      },
      {
        title: "Slump som ändå är periodisk",
        text: "Välj Uppsättning C vid 24 × 24. Resultatet ser ut som slumpmässigt brus och kräver ingen backning, och ändå täcker den här uppsättningen trivialt planet periodiskt: den innehåller plattan med fyra cyanfärgade kanter, och kopior av enbart den plattan upprepas i all oändlighet.",
      },
    ],
  },
  no: {
    metaDescription:
      "Se et søk med tilbakesporing legge Wang-fliser kant i kant: Sammenlign tre flissett og forstå hvorfor dominoproblemet viste seg å være uavgjørbart.",
    heading: "Slik fungerer denne utforskeren",
    intro:
      "Hver kvadratiske flis har en farge på hver av de fire kantene sine, og fliser kan bare ligge inntil hverandre der fargene stemmer overens: Underkanten av en flis må være lik overkanten av flisen under, og høyrekanten lik venstrekanten til naboen. Flisene kan verken roteres eller speiles. Lerretet viser et søk som fyller et kvadratisk rutenett etter disse reglene, én flis om gangen, og som rygger ved hver blindvei.",
    sections: [
      {
        heading: "Wangs spørsmål",
        paragraphs: [
          "I 1961 spurte logikeren Hao Wang om det finnes en algoritme som for enhver endelig mengde slike fliser avgjør om kopier av dem kan dekke hele det uendelige planet. Han formodet at ethvert sett som dekker planet, også kan dekke det periodisk, noe som ville ha gitt en slik algoritme. I 1966 viste studenten hans, Robert Berger, at begge deler var feil. Det finnes aperiodiske flissett, som dekker planet, men bare uten noen som helst gjentakelse, og Berger viste at det generelle spørsmålet er uavgjørbart, fordi fliser kan utformes slik at de etterligner kjøringen av en Turing-maskin. Bergers sett hadde 20\u00a0426 fliser; senere arbeider presset rekorden ned til 13 (Karel Culik, 1996) og til slutt 11 (Jeandel og Rao, 2015).",
          "Et nyttig faktum knytter det uendelige spørsmålet til dette endelige rutenettet: Et flissett dekker hele planet nøyaktig når det kan fylle ethvert kvadrat på n × n ruter. Hvis et uttømmende søk noen gang beviser at et bestemt kvadrat ikke kan fylles, kan settet altså aldri dekke planet. At det lykkes på et endelig kvadrat, beviser derimot ingenting alene.",
        ],
        formula: MATCH_FORMULA,
      },
      {
        heading: "Hva kontrollene gjør",
        paragraphs: [
          "Sett A har fem fliser i to farger. Sett B har 13 fliser i fire farger, like mange som Culiks aperiodiske sett, men det er ikke aperiodisk: Blokken med flisene 0, 1, 10 over flisene 0, 3, 12 passer mot seg selv på alle sider og gjentar seg over hele planet. Det er med fordi det får søket til å jobbe hardt. Sett C inneholder alle de 16 flisene som kan lages med to farger. Paletten i sidefeltet viser hver flis i det aktive settet.",
          "Rutenettstørrelsen går fra 4 × 4 til 24 × 24 (standard 16 × 16) og hastigheten fra 1 til 400 plasseringer per sekund (standard 60). Hvis du bytter sett eller størrelse, eller trykker på «Start på nytt», begynner et nytt søk på et tomt rutenett. Tellerne under lerretet viser fylte ruter, blindveier så langt, framgang og status.",
        ],
      },
      {
        heading: "Slik er den bygget",
        paragraphs: [
          "Søket fyller rutenettet baklengs: Det starter i nedre høyre hjørne, går mot venstre langs hver rad og deretter oppover. Hver rute holder en liste over flisene som fortsatt er mulige der. For å teste en flis legger søket den på prøve og stryker fra naborutene hver flis som har mistet sin passende partner, og gjør så det samme for naboene deres til ingenting endrer seg lenger (dette kalles buekonsistens). Hvis en rute står igjen helt uten fliser, forkastes kandidaten. Kandidatene som overlever, stokkes med en Fisher-Yates-stokking; den første legges, og resten lagres på en stakk som uprøvde alternativer. Rutenettet har faste kanter og går ikke rundt.",
          "Når en rute ikke har noen kandidat igjen, sporer søket tilbake: Det bytter ut den sist lagte flisen med rutens neste alternativ, og finnes det ingen, tømmer det ruten og går enda lenger tilbake. Hver slik blindvei øker telleren for tilbakespor. Hvis stakken blir tom, er alle oppstillinger utelukket, og statusen lyder «ingen dekking mulig (bevist)». Med de tre settene som tilbys her, skjer det aldri, fordi alle dekker planet. En animasjonsløkke kjører så mange steg per bilde som hastigheten krever, og stopper når søket er ferdig.",
          "Med redusert bevegelse slått på kjører siden hele søket på én gang og tegner bare resultatet. Den kjøringen har et fast budsjett på rutenettstørrelse² × antall fliser × 50 steg. Hvis det gikk tomt, ville statusen lyde «ga opp etter N steg» i stedet for å påstå et bevis. I 3150 frakoblede kjøringer av Sett B over alle rutenettstørrelser tok det lengste søket 4454 steg, mens det minste budsjettet, ved 4 × 4, er 10\u00a0400.",
        ],
        code: SEARCH_EXCERPT,
      },
      {
        heading: "Hvorfor noen sett aldri sporer tilbake",
        paragraphs: [
          "Inne i rutenettet krever hver rute ett bestemt par: fordi søket jobber baklengs, en gitt farge nederst og en gitt farge til høyre. Hvis settet har en flis for hvert mulige par, kan søket aldri kjøre seg fast. Sett A har en flis for hvert av de fire parene med to farger, og Sett C har fire for hvert, så begge blir alltid ferdige uten et eneste tilbakespor.",
          "Sett B har fire farger, altså 16 mulige par, men de 13 flisene dekker bare åtte par av farge nederst og til høyre. Forhåndssjekken fjerner de fleste blindveiene før en flis legges, men ikke alle, så søket må likevel rygge. Retningen betyr mye: Sett fra øvre venstre hjørne mangler fem par av farge øverst og til venstre, nemlig (0, 0), (0, 3), (1, 0), (2, 2) og (3, 1), og det samme søket startet i det hjørnet gikk forbi 200\u00a0000 steg i mer enn halvparten av testkjøringene våre ved 20 × 20. Fra nedre høyre hjørne trengte det på det meste noen få tusen i hver størrelse.",
        ],
      },
    ],
    experimentsHeading: "Prøv dette",
    experiments: [
      {
        title: "Et søk som aldri nøler",
        text: "Velg Sett A, et rutenett på 24 × 24 og hastighet 400. Telleren for tilbakespor står på null helt fram til 576 lagte fliser, fordi hvert par av farge nederst og til høyre har en flis som passer.",
      },
      {
        title: "Se en blindvei",
        text: "Velg Sett B med et rutenett på 12 × 12 og senk hastigheten til omtrent 10. Den fiolette rammen markerer neste rute og starter nederst til høyre. Hver gang ingen flis overlever forhåndssjekken der, endres eller tømmes rutene foran, og telleren for tilbakespor går opp. Et rutenett på 12 × 12 blir vanligvis ferdig etter omtrent ti tilbakespor, av og til etter flere dusin.",
      },
      {
        title: "Et vanskelig sett som likevel blir ferdig",
        text: "Behold Sett B og sett rutenettet til 24 × 24 med hastighet 400. Framgangen stiger og faller tilbake mange ganger i de nederste radene og går så helt gjennom: I testkjøringene våre tok dette rundt 850 steg og 50 tilbakespor i mediantilfellet, og aldri mer enn omtrent 5000 steg. «Start på nytt» stokker om og gir en annen flislegging.",
      },
      {
        title: "Tilfeldighet som likevel er periodisk",
        text: "Velg Sett C ved 24 × 24. Resultatet ser ut som tilfeldig støy og krever ingen tilbakesporing, og likevel dekker dette settet trivielt planet periodisk: Det inneholder flisen med fire cyanfargede kanter, og kopier av bare den ene flisen gjentar seg i det uendelige.",
      },
    ],
  },
};
