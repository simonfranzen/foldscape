import type { ExplorerGuide } from "./types";

// Numbers quoted here (120 x 70 torus, 1 to 60 gen/s with default 12, the
// 20-steps-per-frame cap, 25 % random density) match app/life/sandbox/page.tsx
// and lib/life/patterns.ts; update both together.
const STEP_EXCERPT = `function step(src: Grid, dst: Grid) {
  for (let y = 0; y < ROWS; y++) {
    const yN = (y - 1 + ROWS) % ROWS;   // wrap top edge to bottom
    const yS = (y + 1) % ROWS;
    for (let x = 0; x < COLS; x++) {
      const xW = (x - 1 + COLS) % COLS; // wrap left edge to right
      const xE = (x + 1) % COLS;
      const n =
        src[yN * COLS + xW] + src[yN * COLS + x] + src[yN * COLS + xE] +
        src[y * COLS + xW]  +                      src[y * COLS + xE]  +
        src[yS * COLS + xW] + src[yS * COLS + x] + src[yS * COLS + xE];
      const alive = src[y * COLS + x] === 1;
      dst[y * COLS + x] = alive ? (n === 2 || n === 3 ? 1 : 0) : n === 3 ? 1 : 0;
    }
  }
}`;

// The case labels inside the display formula are prose, so each locale passes
// its own words; the B3/S23 rule itself is the same everywhere.
const nextStateFormula = (when: string, otherwise: string) =>
  `s' = \\begin{cases} 1 & \\text{${when} } n = 3, \\\\ s & \\text{${when} } n = 2, \\\\ 0 & \\text{${otherwise}} \\end{cases}`;

export const LIFE_SANDBOX_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Draw cells, load gliders, the Gosper gun or the R-pentomino and run Conway's Game of Life on a 120 × 70 torus. Learn the rules and how the simulation is built.",
    heading: "How this sandbox works",
    intro:
      "The grid is a universe of 8400 cells, each either alive (a glowing dot) or dead (empty). Time moves in discrete generations, and in every generation all cells update at once according to the same tiny rule. There is no player and no randomness once you press play: whatever you draw or load is the entire input, and everything that follows is forced. The surprise of Conway's Game of Life is how much behaviour fits into such a rule: particles that travel, machines that build other particles, and patterns that churn for thousands of generations before they settle.",
    sections: [
      {
        heading: "The rule",
        paragraphs: [
          "John Horton Conway devised the game in 1970, and Martin Gardner made it famous in his Scientific American column that October. Each cell looks at its eight neighbours, the cells touching it horizontally, vertically and diagonally. A live cell with two or three live neighbours survives; with fewer it dies of loneliness, with more it dies of overcrowding. A dead cell with exactly three live neighbours comes alive. In the shorthand used for such rules this is B3/S23: born on 3, survives on 2 or 3.",
          "Written as a function of the current state s (1 for alive) and the neighbour count n, the next state is:",
        ],
        formula:
          "s' = \\begin{cases} 1 & \\text{if } n = 3, \\\\ s & \\text{if } n = 2, \\\\ 0 & \\text{otherwise.} \\end{cases}",
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "The sandbox opens paused, with a Gosper glider gun near the top left corner. Play starts the clock, Pause stops it, and Step advances exactly one generation (it is disabled while the simulation runs). The speed slider sets the rate from 1 to 60 generations per second, starting at 12.",
          "Click a cell to toggle it. The state you create with that first click decides what a drag does: if you switched a cell on, dragging paints live cells; if you switched one off, dragging erases. Drawing works while the simulation is running too. Random fills the board so that each cell is alive with probability 25 %, Clear empties it, and both reset the generation counter.",
          "The pattern buttons clear the board and place one classic pattern near the centre: the glider, the lightweight spaceship, the period-3 pulsar, the Gosper glider gun, and three long-lived seeds, the R-pentomino, the acorn and diehard. The colour buttons only change how live cells are painted. The badge at the top shows the generation, the number of live cells and their share of the 8400.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "The board is a single Uint8Array of 120 × 70 bytes, one byte per cell. Generation t + 1 is never computed in place, because a cell must see its neighbours as they were, not as they are being updated. Instead there are two arrays: step() reads from the current one, writes into the other, and then the two references are swapped. No memory is allocated while the game runs.",
          "The edges wrap around. The neighbour of a cell in the rightmost column is in the leftmost column, and the same holds for top and bottom, which turns the rectangle into the surface of a torus. That is why a glider leaving the bottom right reappears at the top left instead of vanishing.",
          "The clock uses requestAnimationFrame with a time accumulator: it adds up the real time since the last frame and runs as many generations as fit into it at the chosen speed, but never more than 20 per frame, so a slow device cannot get stuck catching up. Drawing is separate from simulation. All live cells are added to one canvas path of small circles and filled in one call with a soft glow, on a faint guide grid every ten cells. Nothing moves until you press Play, so the page stays still for people who prefer reduced motion.",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "A finite world always repeats",
        paragraphs: [
          "On an infinite plane the Gosper gun grows forever, emitting a new glider every 30 generations. On this board that cannot happen. A 120 × 70 torus has 2^8400 possible configurations, an enormous but finite number, and each one has exactly one successor. Sooner or later the sequence must revisit a configuration it has seen, and from then on it cycles forever. Every run here therefore ends in a still life, an oscillation, or a very long loop.",
          "The wrapping also changes the famous lifetimes. The R-pentomino's 1103 generations and the acorn's 5206 are measured on an unbounded plane. Here, the gliders they shed come back around and crash into the remaining debris, so the history you see differs from the textbook one. Diehard is small enough to stay unaffected: it disappears after 130 generations either way.",
        ],
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "Count to 130",
        text: "Load Diehard and press Step a few times to see it change, then press Play at 12 gen/s. It never repeats a shape, and at generation 130 the population counter drops to exactly 0.",
      },
      {
        title: "Measure a spaceship",
        text: "Load the lightweight spaceship and set the speed to 60. It moves two cells every four generations, so it crosses all 120 columns and returns to where it started after 240 generations. A glider needs far longer: moving one cell diagonally per four generations, it only returns to its exact starting cell after 3360 generations, because 840 is the smallest number divisible by both 120 and 70.",
      },
      {
        title: "Watch the gun overrun its own world",
        text: "Press Play on the starting glider gun. At first a neat stream of gliders leaves it every 30 generations. Keep watching as the stream wraps around the torus: sooner or later returning gliders run into the gun itself, and the clean machine breaks up into debris.",
      },
    ],
  },
  de: {
    metaDescription:
      "Zellen zeichnen, Gleiter, Gosper-Kanone oder R-Pentomino laden und Conways Game of Life auf einem 120 × 70 Torus laufen lassen, samt Regeln und Bauplan.",
    heading: "So funktioniert diese Sandbox",
    intro:
      "Das Gitter ist ein Universum aus 8400 Zellen, jede entweder lebendig (ein leuchtender Punkt) oder tot (leer). Die Zeit läuft in einzelnen Generationen, und in jeder Generation ändern sich alle Zellen gleichzeitig nach derselben winzigen Regel. Sobald du Play drückst, gibt es weder Spieler:innen noch Zufall: Was du zeichnest oder lädst, ist die gesamte Eingabe, und alles Weitere steht fest. Das Verblüffende an Conways Game of Life ist, wie viel Verhalten in so eine Regel passt: Teilchen, die wandern, Maschinen, die andere Teilchen erzeugen, und Muster, die Tausende Generationen lang brodeln, bevor sie zur Ruhe kommen.",
    sections: [
      {
        heading: "Die Regel",
        paragraphs: [
          "John Horton Conway erfand das Spiel 1970, berühmt wurde es durch Martin Gardners Kolumne in Scientific American im Oktober desselben Jahres. Jede Zelle betrachtet ihre acht Nachbarn, also alle Zellen, die sie waagerecht, senkrecht oder diagonal berühren. Eine lebende Zelle mit zwei oder drei lebenden Nachbarn überlebt; mit weniger stirbt sie an Einsamkeit, mit mehr an Überbevölkerung. Eine tote Zelle mit genau drei lebenden Nachbarn wird geboren. In der üblichen Kurzschreibweise heißt das B3/S23: geboren bei 3, überlebt bei 2 oder 3.",
          "Als Funktion des aktuellen Zustands s (1 für lebendig) und der Nachbarzahl n lautet der nächste Zustand:",
        ],
        formula:
          "s' = \\begin{cases} 1 & \\text{falls } n = 3, \\\\ s & \\text{falls } n = 2, \\\\ 0 & \\text{sonst.} \\end{cases}",
      },
      {
        heading: "Was die Bedienelemente tun",
        paragraphs: [
          "Die Sandbox startet pausiert, mit einer Gosper-Gleiterkanone nahe der linken oberen Ecke. Start startet die Uhr, Pause hält sie an, und Schritt rückt genau eine Generation vor (während die Simulation läuft, ist der Knopf gesperrt). Der Geschwindigkeitsregler stellt 1 bis 60 Generationen pro Sekunde ein, Startwert ist 12.",
          "Ein Klick auf eine Zelle schaltet sie um. Der Zustand, den dieser erste Klick erzeugt, legt fest, was Ziehen bewirkt: Hast du eine Zelle eingeschaltet, malst du beim Ziehen lebende Zellen, hast du eine ausgeschaltet, radierst du. Zeichnen funktioniert auch bei laufender Simulation. Zufall füllt das Brett so, dass jede Zelle mit Wahrscheinlichkeit 25 % lebt, Leeren räumt es ab, und beide setzen den Generationszähler zurück.",
          "Die Musterknöpfe leeren das Brett und setzen ein klassisches Muster in die Nähe der Mitte: den Gleiter, das leichte Raumschiff, den Pulsar mit Periode 3, die Gosper-Kanone und drei langlebige Startmuster, das R-Pentomino, die Eichel (Acorn) und Diehard. Die Farbknöpfe ändern nur, wie lebende Zellen gemalt werden. Die Anzeige oben zeigt Generation, Zahl der lebenden Zellen und ihren Anteil an den 8400.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Das Brett ist ein einziges Uint8Array mit 120 × 70 Bytes, ein Byte pro Zelle. Generation t + 1 wird nie an Ort und Stelle berechnet, denn eine Zelle muss ihre Nachbarn so sehen, wie sie waren, nicht wie sie gerade aktualisiert werden. Deshalb gibt es zwei Arrays: step() liest aus dem aktuellen, schreibt in das andere, danach werden die beiden Referenzen getauscht. Während das Spiel läuft, wird kein Speicher neu angelegt.",
          "Die Ränder sind verbunden. Der Nachbar einer Zelle in der rechten Spalte liegt in der linken Spalte, genauso oben und unten. Damit wird das Rechteck zur Oberfläche eines Torus. Deshalb taucht ein Gleiter, der unten rechts hinausläuft, oben links wieder auf, statt zu verschwinden.",
          "Die Uhr nutzt requestAnimationFrame mit einem Zeitakkumulator: Sie summiert die echte Zeit seit dem letzten Frame und rechnet so viele Generationen, wie bei der gewählten Geschwindigkeit hineinpassen, aber nie mehr als 20 pro Frame, damit ein langsames Gerät nicht beim Aufholen hängen bleibt. Zeichnen ist von der Simulation getrennt. Alle lebenden Zellen kommen in einen einzigen Canvas-Pfad aus kleinen Kreisen, der in einem Aufruf mit weichem Leuchten gefüllt wird, über einem zarten Hilfsgitter alle zehn Zellen. Bis du Start drückst, bewegt sich nichts, die Seite bleibt also ruhig für alle, die reduzierte Bewegung bevorzugen.",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "Eine endliche Welt wiederholt sich immer",
        paragraphs: [
          "In einer unendlichen Ebene wächst die Gosper-Kanone ewig und schickt alle 30 Generationen einen neuen Gleiter los. Auf diesem Brett geht das nicht. Ein 120 × 70 Torus hat 2^8400 mögliche Konfigurationen, eine riesige, aber endliche Zahl, und jede hat genau einen Nachfolger. Früher oder später muss die Folge also eine schon gesehene Konfiguration wieder treffen, und ab dann läuft sie für immer im Kreis. Jeder Lauf hier endet daher in einem Stillleben, einer Oszillation oder einer sehr langen Schleife.",
          "Das Umwickeln verändert auch die berühmten Lebensdauern. Die 1103 Generationen des R-Pentominos und die 5206 der Eichel gelten für eine unbegrenzte Ebene. Hier kommen die Gleiter, die sie ausstoßen, rundherum zurück und krachen in die übrigen Trümmer, deshalb sieht der Verlauf anders aus als im Lehrbuch. Diehard ist klein genug, um davon unberührt zu bleiben: Es verschwindet so oder so nach 130 Generationen.",
        ],
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Bis 130 zählen",
        text: "Lade Diehard und drück ein paar Mal auf Schritt, um die Veränderung zu sehen, dann Start bei 12 Gen/s. Keine Form wiederholt sich, und bei Generation 130 fällt der Populationszähler auf genau 0.",
      },
      {
        title: "Ein Raumschiff vermessen",
        text: "Lade das leichte Raumschiff und stell die Geschwindigkeit auf 60. Es bewegt sich zwei Zellen pro vier Generationen, durchquert also alle 120 Spalten und steht nach 240 Generationen wieder am Start. Ein Gleiter braucht viel länger: Mit einer Zelle diagonal pro vier Generationen kehrt er erst nach 3360 Generationen genau auf seine Startzelle zurück, weil 840 die kleinste Zahl ist, die durch 120 und 70 teilbar ist.",
      },
      {
        title: "Die Kanone überrennt ihre eigene Welt",
        text: "Drück Start bei der Gleiterkanone vom Start. Zuerst verlässt sie alle 30 Generationen ein sauberer Strom von Gleitern. Beobachte weiter, wie der Strom um den Torus herumläuft: Früher oder später prallen zurückkehrende Gleiter auf die Kanone selbst, und die saubere Maschine zerfällt in Trümmer.",
      },
    ],
  },
  es: {
    metaDescription:
      "Dibuja células, carga planeadores, el cañón de Gosper o el R-pentominó y ejecuta el juego de la vida de Conway en un toro de 120 × 70. Con reglas y código.",
    heading: "Cómo funciona este sandbox",
    intro:
      "La cuadrícula es un universo de 8400 células, cada una viva (un punto luminoso) o muerta (vacía). El tiempo avanza en generaciones discretas, y en cada generación todas las células se actualizan a la vez según la misma regla diminuta. No hay jugadores ni azar una vez que pulsas reproducir: lo que dibujas o cargas es toda la entrada, y todo lo que viene después está determinado. Lo sorprendente del juego de la vida de Conway es cuánto comportamiento cabe en una regla así: partículas que viajan, máquinas que fabrican otras partículas y patrones que bullen durante miles de generaciones antes de calmarse.",
    sections: [
      {
        heading: "La regla",
        paragraphs: [
          "John Horton Conway ideó el juego en 1970, y Martin Gardner lo hizo famoso en su columna de Scientific American en octubre de ese año. Cada célula mira a sus ocho vecinas, las células que la tocan en horizontal, en vertical y en diagonal. Una célula viva con dos o tres vecinas vivas sobrevive; con menos muere de soledad, con más muere de superpoblación. Una célula muerta con exactamente tres vecinas vivas cobra vida. En la notación abreviada que se usa para estas reglas, esto es B3/S23: nace con 3, sobrevive con 2 o 3.",
          "Escrito como función del estado actual s (1 si está viva) y del número de vecinas n, el estado siguiente es:",
        ],
        formula: nextStateFormula("si", "en otro caso."),
      },
      {
        heading: "Qué hacen los controles",
        paragraphs: [
          "El sandbox se abre en pausa, con un cañón de planeadores de Gosper cerca de la esquina superior izquierda. «Reproducir» pone en marcha el reloj, «Pausa» lo detiene y «Paso» avanza exactamente una generación (está desactivado mientras la simulación corre). El deslizador de velocidad fija el ritmo entre 1 y 60 generaciones por segundo y empieza en 12.",
          "Haz clic en una célula para cambiarla de estado. El estado que creas con ese primer clic decide qué hace el arrastre: si has encendido una célula, al arrastrar pintas células vivas; si has apagado una, al arrastrar borras. También puedes dibujar mientras la simulación está en marcha. «Aleatorio» llena el tablero de modo que cada célula esté viva con probabilidad del 25 %, «Limpiar» lo vacía, y ambos ponen a cero el contador de generaciones.",
          "Los botones de patrones vacían el tablero y colocan un patrón clásico cerca del centro: el planeador («Glider»), la nave ligera («Lightweight spaceship»), el púlsar de periodo 3, el cañón de planeadores de Gosper y tres semillas longevas, el R-pentominó, la bellota («Acorn») y Diehard. Los botones de color solo cambian cómo se pintan las células vivas. La etiqueta de arriba muestra la generación, el número de células vivas y su proporción respecto a las 8400.",
        ],
      },
      {
        heading: "Cómo está construido",
        paragraphs: [
          "El tablero es un único Uint8Array de 120 × 70 bytes, un byte por célula. La generación t + 1 nunca se calcula in situ, porque una célula tiene que ver a sus vecinas tal como estaban, no tal como están quedando al actualizarse. En su lugar hay dos arrays: step() lee del actual, escribe en el otro, y después se intercambian las dos referencias. No se reserva memoria mientras el juego corre.",
          "Los bordes se conectan entre sí. La vecina de una célula de la columna más a la derecha está en la columna más a la izquierda, y lo mismo vale para arriba y abajo, lo que convierte el rectángulo en la superficie de un toro. Por eso un planeador que sale por abajo a la derecha reaparece arriba a la izquierda en lugar de desaparecer.",
          "El reloj usa requestAnimationFrame con un acumulador de tiempo: suma el tiempo real transcurrido desde el último fotograma y ejecuta tantas generaciones como quepan en él a la velocidad elegida, pero nunca más de 20 por fotograma, para que un dispositivo lento no se quede atascado intentando ponerse al día. El dibujo va separado de la simulación. Todas las células vivas se añaden a un único trazado del lienzo hecho de pequeños círculos y se rellenan en una sola llamada con un resplandor suave, sobre una tenue cuadrícula de guía cada diez células. Nada se mueve hasta que pulsas «Reproducir», así que la página permanece quieta para quienes prefieren movimiento reducido.",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "Un mundo finito siempre se repite",
        paragraphs: [
          "En un plano infinito, el cañón de Gosper crece para siempre y emite un planeador nuevo cada 30 generaciones. En este tablero eso no puede ocurrir. Un toro de 120 × 70 tiene 2^8400 configuraciones posibles, un número enorme pero finito, y cada una tiene exactamente una sucesora. Tarde o temprano la secuencia tiene que volver a una configuración que ya ha visto, y desde ese momento entra en un ciclo para siempre. Por eso toda ejecución aquí acaba en una vida estática, en una oscilación o en un bucle muy largo.",
          "Que los bordes se conecten también cambia las famosas duraciones. Las 1103 generaciones del R-pentominó y las 5206 de la bellota están medidas en un plano sin límites. Aquí, los planeadores que sueltan dan la vuelta y chocan contra los restos que quedan, así que la historia que ves difiere de la de los libros. Diehard es lo bastante pequeño para no verse afectado: desaparece tras 130 generaciones en cualquier caso.",
        ],
      },
    ],
    experimentsHeading: "Prueba esto",
    experiments: [
      {
        title: "Cuenta hasta 130",
        text: "Carga «Diehard» y pulsa «Paso» unas cuantas veces para verlo cambiar; después pulsa «Reproducir» a 12 gen/s. Nunca repite una forma, y en la generación 130 el contador de población cae exactamente a 0.",
      },
      {
        title: "Mide una nave",
        text: "Carga «Lightweight spaceship», la nave ligera, y pon la velocidad en 60. Se mueve dos células cada cuatro generaciones, así que cruza las 120 columnas y vuelve al punto de partida tras 240 generaciones. Un planeador necesita mucho más: como avanza una célula en diagonal cada cuatro generaciones, solo regresa a su célula inicial exacta tras 3360 generaciones, porque 840 es el menor número divisible a la vez por 120 y por 70.",
      },
      {
        title: "Mira cómo el cañón arrasa su propio mundo",
        text: "Pulsa «Reproducir» con el cañón de planeadores del inicio. Al principio sale de él una ordenada corriente de planeadores, uno cada 30 generaciones. Sigue mirando mientras la corriente da la vuelta al toro: tarde o temprano los planeadores que regresan chocan con el propio cañón, y la máquina impecable se deshace en restos.",
      },
    ],
  },
  fr: {
    metaDescription:
      "Dessine des cellules, charge des planeurs, le canon de Gosper ou le R-pentomino et lance le jeu de la vie de Conway sur un tore de 120 × 70, règles comprises.",
    heading: "Comment fonctionne ce bac à sable",
    intro:
      "La grille est un univers de 8\u00a0400 cellules, chacune vivante (un point lumineux) ou morte (vide). Le temps avance par générations discrètes, et à chaque génération toutes les cellules se mettent à jour en même temps selon la même règle minuscule. Il n'y a ni joueur ni hasard une fois la lecture lancée : ce que tu dessines ou charges constitue toute l'entrée, et tout ce qui suit est imposé. La surprise du jeu de la vie de Conway, c'est la quantité de comportements qui tient dans une telle règle : des particules qui voyagent, des machines qui fabriquent d'autres particules, et des motifs qui bouillonnent pendant des milliers de générations avant de se stabiliser.",
    sections: [
      {
        heading: "La règle",
        paragraphs: [
          "John Horton Conway a imaginé le jeu en 1970, et Martin Gardner l'a rendu célèbre dans sa chronique du Scientific American en octobre de la même année. Chaque cellule regarde ses huit voisines, les cellules qui la touchent horizontalement, verticalement et en diagonale. Une cellule vivante qui a deux ou trois voisines vivantes survit ; avec moins elle meurt d'isolement, avec plus elle meurt de surpopulation. Une cellule morte qui a exactement trois voisines vivantes prend vie. Dans la notation abrégée utilisée pour ce genre de règles, cela s'écrit B3/S23 : naissance à 3, survie à 2 ou 3.",
          "Écrit comme une fonction de l'état courant s (1 pour vivante) et du nombre de voisines n, l'état suivant est :",
        ],
        formula: nextStateFormula("si", "sinon."),
      },
      {
        heading: "À quoi servent les commandes",
        paragraphs: [
          "Le bac à sable s'ouvre en pause, avec un canon à planeurs de Gosper près du coin supérieur gauche. « Lecture » lance l'horloge, « Pause » l'arrête et « Pas » avance d'exactement une génération (il est désactivé pendant que la simulation tourne). Le curseur de vitesse règle la cadence de 1 à 60 générations par seconde et démarre à 12.",
          "Clique sur une cellule pour la basculer. L'état que tu crées avec ce premier clic décide de l'effet du glisser : si tu as allumé une cellule, glisser peint des cellules vivantes ; si tu en as éteint une, glisser efface. Dessiner fonctionne aussi pendant que la simulation tourne. « Aléatoire » remplit le plateau de sorte que chaque cellule soit vivante avec une probabilité de 25 %, « Effacer » le vide, et les deux remettent à zéro le compteur de générations.",
          "Les boutons de motifs vident le plateau et placent un motif classique près du centre : le planeur (« Glider »), le vaisseau léger (« Lightweight spaceship »), le pulsar de période 3, le canon à planeurs de Gosper et trois graines à longue durée de vie, le R-pentomino, le gland (« Acorn ») et Diehard. Les boutons de couleur changent seulement la façon dont les cellules vivantes sont peintes. Le badge en haut affiche la génération, le nombre de cellules vivantes et leur part des 8\u00a0400.",
        ],
      },
      {
        heading: "Comment c'est construit",
        paragraphs: [
          "Le plateau est un unique Uint8Array de 120 × 70 octets, un octet par cellule. La génération t + 1 n'est jamais calculée sur place, parce qu'une cellule doit voir ses voisines telles qu'elles étaient, et non telles qu'elles sont en train d'être mises à jour. Il y a donc deux tableaux : step() lit dans le tableau courant, écrit dans l'autre, puis les deux références sont échangées. Aucune mémoire n'est allouée pendant que le jeu tourne.",
          "Les bords se rejoignent. La voisine d'une cellule de la colonne la plus à droite se trouve dans la colonne la plus à gauche, et il en va de même pour le haut et le bas, ce qui transforme le rectangle en surface d'un tore. C'est pourquoi un planeur qui sort en bas à droite réapparaît en haut à gauche au lieu de disparaître.",
          "L'horloge utilise requestAnimationFrame avec un accumulateur de temps : elle additionne le temps réel écoulé depuis la dernière image et exécute autant de générations qu'il peut en contenir à la vitesse choisie, mais jamais plus de 20 par image, pour qu'un appareil lent ne reste pas bloqué à rattraper son retard. Le dessin est séparé de la simulation. Toutes les cellules vivantes sont ajoutées à un seul tracé de canevas fait de petits cercles et remplies en un seul appel avec une lueur douce, sur une discrète grille de repère toutes les dix cellules. Rien ne bouge tant que tu n'as pas appuyé sur « Lecture », la page reste donc immobile pour les personnes qui préfèrent des animations réduites.",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "Un monde fini se répète toujours",
        paragraphs: [
          "Sur un plan infini, le canon de Gosper grandit indéfiniment en émettant un nouveau planeur toutes les 30 générations. Sur ce plateau, c'est impossible. Un tore de 120 × 70 possède 2^8400 configurations possibles, un nombre énorme mais fini, et chacune a exactement un successeur. Tôt ou tard, la suite doit repasser par une configuration déjà vue, et à partir de là elle boucle pour toujours. Chaque exécution ici se termine donc par une structure stable, une oscillation ou une très longue boucle.",
          "Le rebouclage modifie aussi les fameuses durées de vie. Les 1\u00a0103 générations du R-pentomino et les 5\u00a0206 du gland sont mesurées sur un plan sans bornes. Ici, les planeurs qu'ils libèrent font le tour et viennent percuter les débris restants, si bien que l'histoire que tu vois diffère de celle des manuels. Diehard est assez petit pour ne pas être affecté : il disparaît après 130 générations dans les deux cas.",
        ],
      },
    ],
    experimentsHeading: "À essayer",
    experiments: [
      {
        title: "Compte jusqu'à 130",
        text: "Charge « Diehard » et appuie quelques fois sur « Pas » pour le voir évoluer, puis appuie sur « Lecture » à 12 gen/s. Il ne répète jamais une forme, et à la génération 130 le compteur de population tombe exactement à 0.",
      },
      {
        title: "Mesure un vaisseau",
        text: "Charge « Lightweight spaceship », le vaisseau léger, et règle la vitesse sur 60. Il avance de deux cellules toutes les quatre générations, il traverse donc les 120 colonnes et revient à son point de départ après 240 générations. Un planeur met bien plus longtemps : en avançant d'une cellule en diagonale toutes les quatre générations, il ne retrouve sa cellule de départ exacte qu'après 3\u00a0360 générations, parce que 840 est le plus petit nombre divisible à la fois par 120 et par 70.",
      },
      {
        title: "Regarde le canon submerger son propre monde",
        text: "Appuie sur « Lecture » avec le canon à planeurs de départ. Au début, un flux bien net de planeurs en sort, un toutes les 30 générations. Continue d'observer pendant que le flux fait le tour du tore : tôt ou tard, des planeurs de retour heurtent le canon lui-même, et la belle machine se disloque en débris.",
      },
    ],
  },
  it: {
    metaDescription:
      "Disegna celle, carica alianti, il cannone di Gosper o l'R-pentomino e avvia il Gioco della vita di Conway su un toro 120 × 70. Con le regole e il codice.",
    heading: "Come funziona questa sandbox",
    intro:
      "La griglia è un universo di 8400 celle, ciascuna viva (un puntino luminoso) oppure morta (vuota). Il tempo procede per generazioni discrete, e a ogni generazione tutte le celle si aggiornano insieme secondo la stessa minuscola regola. Una volta avviata la riproduzione non ci sono giocatori né casualità: ciò che disegni o carichi è l'intero input, e tutto quello che segue è obbligato. La sorpresa del Gioco della vita di Conway è quanto comportamento stia dentro una regola simile: particelle che viaggiano, macchine che costruiscono altre particelle e configurazioni che ribollono per migliaia di generazioni prima di assestarsi.",
    sections: [
      {
        heading: "La regola",
        paragraphs: [
          "John Horton Conway ideò il gioco nel 1970, e Martin Gardner lo rese celebre nella sua rubrica su Scientific American nell'ottobre di quell'anno. Ogni cella guarda le sue otto vicine, le celle che la toccano in orizzontale, in verticale e in diagonale. Una cella viva con due o tre vicine vive sopravvive; con meno muore di solitudine, con più muore di sovraffollamento. Una cella morta con esattamente tre vicine vive prende vita. Nella notazione abbreviata usata per regole di questo tipo si scrive B3/S23: nasce con 3, sopravvive con 2 o 3.",
          "Scritto come funzione dello stato attuale s (1 per viva) e del numero di vicine n, lo stato successivo è:",
        ],
        formula: nextStateFormula("se", "altrimenti."),
      },
      {
        heading: "Che cosa fanno i controlli",
        paragraphs: [
          "La sandbox si apre in pausa, con un cannone di alianti di Gosper vicino all'angolo in alto a sinistra. «Riproduci» fa partire l'orologio, «Pausa» lo ferma e «Passo» avanza di una sola generazione (è disattivato mentre la simulazione è in corso). Il cursore della velocità imposta il ritmo da 1 a 60 generazioni al secondo e parte da 12.",
          "Fai clic su una cella per cambiarne lo stato. Lo stato che crei con quel primo clic decide che cosa fa il trascinamento: se hai acceso una cella, trascinando dipingi celle vive; se ne hai spenta una, trascinando cancelli. Si può disegnare anche mentre la simulazione è in corso. «Casuale» riempie il tavoliere in modo che ogni cella sia viva con probabilità del 25 %, «Svuota» lo libera, ed entrambi azzerano il contatore delle generazioni.",
          "I pulsanti degli schemi svuotano il tavoliere e collocano uno schema classico vicino al centro: l'aliante («Glider»), l'astronave leggera («Lightweight spaceship»), il pulsar di periodo 3, il cannone di alianti di Gosper e tre semi longevi, l'R-pentomino, la ghianda («Acorn») e Diehard. I pulsanti dei colori cambiano solo il modo in cui sono dipinte le celle vive. L'etichetta in alto mostra la generazione, il numero di celle vive e la loro quota sulle 8400.",
        ],
      },
      {
        heading: "Com'è costruita",
        paragraphs: [
          "Il tavoliere è un unico Uint8Array di 120 × 70 byte, un byte per cella. La generazione t + 1 non viene mai calcolata sul posto, perché una cella deve vedere le sue vicine com'erano, non come stanno diventando durante l'aggiornamento. Ci sono invece due array: step() legge da quello corrente, scrive nell'altro, e poi i due riferimenti vengono scambiati. Mentre il gioco gira non viene allocata memoria.",
          "I bordi si richiudono. La vicina di una cella nella colonna più a destra sta nella colonna più a sinistra, e lo stesso vale per alto e basso, il che trasforma il rettangolo nella superficie di un toro. Ecco perché un aliante che esce in basso a destra ricompare in alto a sinistra invece di svanire.",
          "L'orologio usa requestAnimationFrame con un accumulatore di tempo: somma il tempo reale trascorso dall'ultimo fotogramma ed esegue tante generazioni quante ce ne stanno alla velocità scelta, ma mai più di 20 per fotogramma, così un dispositivo lento non resta bloccato a rincorrere il ritardo. Il disegno è separato dalla simulazione. Tutte le celle vive vengono aggiunte a un unico tracciato canvas fatto di piccoli cerchi e riempite in una sola chiamata con un bagliore morbido, sopra una tenue griglia guida ogni dieci celle. Niente si muove finché non premi «Riproduci», quindi la pagina resta ferma per chi preferisce il movimento ridotto.",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "Un mondo finito si ripete sempre",
        paragraphs: [
          "Su un piano infinito il cannone di Gosper cresce per sempre, emettendo un nuovo aliante ogni 30 generazioni. Su questo tavoliere non può succedere. Un toro 120 × 70 ha 2^8400 configurazioni possibili, un numero enorme ma finito, e ciascuna ha esattamente una configurazione successiva. Prima o poi la sequenza deve tornare su una configurazione già vista, e da quel momento cicla per sempre. Ogni esecuzione qui finisce quindi in una natura morta, in un'oscillazione o in un ciclo lunghissimo.",
          "La chiusura dei bordi cambia anche le celebri durate. Le 1103 generazioni dell'R-pentomino e le 5206 della ghianda sono misurate su un piano illimitato. Qui gli alianti che rilasciano fanno il giro e si schiantano sui detriti rimasti, quindi la storia che vedi è diversa da quella dei manuali. Diehard è abbastanza piccolo da non risentirne: scompare dopo 130 generazioni in entrambi i casi.",
        ],
      },
    ],
    experimentsHeading: "Prova così",
    experiments: [
      {
        title: "Conta fino a 130",
        text: "Carica «Diehard» e premi «Passo» qualche volta per vederlo cambiare, poi premi «Riproduci» a 12 gen/s. Non ripete mai una forma, e alla generazione 130 il contatore della popolazione scende esattamente a 0.",
      },
      {
        title: "Misura un'astronave",
        text: "Carica «Lightweight spaceship», l'astronave leggera, e imposta la velocità a 60. Si sposta di due celle ogni quattro generazioni, quindi attraversa tutte le 120 colonne e torna al punto di partenza dopo 240 generazioni. A un aliante serve molto di più: muovendosi di una cella in diagonale ogni quattro generazioni, torna alla sua esatta cella di partenza solo dopo 3360 generazioni, perché 840 è il più piccolo numero divisibile sia per 120 sia per 70.",
      },
      {
        title: "Guarda il cannone travolgere il proprio mondo",
        text: "Premi «Riproduci» con il cannone di alianti iniziale. All'inizio ne esce un flusso ordinato di alianti, uno ogni 30 generazioni. Continua a guardare mentre il flusso fa il giro del toro: prima o poi gli alianti di ritorno finiscono contro il cannone stesso, e la macchina impeccabile si sgretola in detriti.",
      },
    ],
  },
  pt: {
    metaDescription:
      "Desenha células, carrega planadores, o canhão de Gosper ou o R-pentominó e corre o Jogo da Vida de Conway num toro de 120 × 70. Com as regras e o código.",
    heading: "Como funciona esta sandbox",
    intro:
      "A grelha é um universo de 8400 células, cada uma viva (um ponto luminoso) ou morta (vazia). O tempo avança em gerações discretas, e em cada geração todas as células se atualizam ao mesmo tempo segundo a mesma regra minúscula. Depois de iniciares a reprodução não há jogadores nem acaso: o que desenhas ou carregas é toda a entrada, e tudo o que se segue é forçado. A surpresa do Jogo da Vida de Conway é a quantidade de comportamento que cabe numa regra assim: partículas que viajam, máquinas que constroem outras partículas e padrões que fervilham durante milhares de gerações antes de assentarem.",
    sections: [
      {
        heading: "A regra",
        paragraphs: [
          "John Horton Conway concebeu o jogo em 1970, e Martin Gardner tornou-o famoso na sua coluna da Scientific American em outubro desse ano. Cada célula olha para as suas oito vizinhas, as células que lhe tocam na horizontal, na vertical e na diagonal. Uma célula viva com duas ou três vizinhas vivas sobrevive; com menos morre de solidão, com mais morre de sobrepopulação. Uma célula morta com exatamente três vizinhas vivas ganha vida. Na notação abreviada usada para este tipo de regras, isto é B3/S23: nasce com 3, sobrevive com 2 ou 3.",
          "Escrito como função do estado atual s (1 para viva) e do número de vizinhas n, o estado seguinte é:",
        ],
        formula: nextStateFormula("se", "caso contrário."),
      },
      {
        heading: "O que fazem os controlos",
        paragraphs: [
          "A sandbox abre em pausa, com um canhão de planadores de Gosper perto do canto superior esquerdo. «Reproduzir» põe o relógio a andar, «Pausa» para-o e «Passo» avança exatamente uma geração (fica desativado enquanto a simulação corre). O cursor de velocidade define o ritmo de 1 a 60 gerações por segundo e começa em 12.",
          "Clica numa célula para a alternar. O estado que crias com esse primeiro clique decide o que faz o arrastar: se ligaste uma célula, arrastar pinta células vivas; se desligaste uma, arrastar apaga. Também dá para desenhar com a simulação a correr. «Aleatório» enche o tabuleiro de modo que cada célula esteja viva com probabilidade de 25 %, «Limpar» esvazia-o, e ambos repõem a zero o contador de gerações.",
          "Os botões de padrões limpam o tabuleiro e colocam um padrão clássico perto do centro: o planador («Glider»), a nave leve («Lightweight spaceship»), o pulsar de período 3, o canhão de planadores de Gosper e três sementes de longa duração, o R-pentominó, a bolota («Acorn») e Diehard. Os botões de cor só mudam a forma como as células vivas são pintadas. A etiqueta no topo mostra a geração, o número de células vivas e a sua percentagem das 8400.",
        ],
      },
      {
        heading: "Como está construída",
        paragraphs: [
          "O tabuleiro é um único Uint8Array de 120 × 70 bytes, um byte por célula. A geração t + 1 nunca é calculada no próprio lugar, porque uma célula tem de ver as vizinhas como estavam, não como estão a ficar durante a atualização. Em vez disso há dois arrays: step() lê do atual, escreve no outro, e depois as duas referências são trocadas. Não é alocada memória enquanto o jogo corre.",
          "As margens dão a volta. A vizinha de uma célula na coluna mais à direita está na coluna mais à esquerda, e o mesmo vale para cima e para baixo, o que transforma o retângulo na superfície de um toro. É por isso que um planador que sai pelo canto inferior direito reaparece no canto superior esquerdo em vez de desaparecer.",
          "O relógio usa requestAnimationFrame com um acumulador de tempo: soma o tempo real desde o último fotograma e corre tantas gerações quantas couberem nele à velocidade escolhida, mas nunca mais de 20 por fotograma, para que um dispositivo lento não fique preso a tentar recuperar o atraso. O desenho está separado da simulação. Todas as células vivas são acrescentadas a um único caminho de canvas feito de pequenos círculos e preenchidas numa só chamada com um brilho suave, sobre uma ténue grelha de guia de dez em dez células. Nada se mexe até carregares em «Reproduzir», por isso a página fica parada para quem prefere movimento reduzido.",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "Um mundo finito repete-se sempre",
        paragraphs: [
          "Num plano infinito, o canhão de Gosper cresce para sempre, emitindo um novo planador a cada 30 gerações. Neste tabuleiro isso não pode acontecer. Um toro de 120 × 70 tem 2^8400 configurações possíveis, um número enorme mas finito, e cada uma tem exatamente uma sucessora. Mais cedo ou mais tarde, a sequência tem de revisitar uma configuração que já viu, e a partir daí entra em ciclo para sempre. Por isso, cada execução aqui acaba numa natureza-morta, numa oscilação ou num ciclo muito longo.",
          "O facto de as margens darem a volta também altera as famosas durações. As 1103 gerações do R-pentominó e as 5206 da bolota são medidas num plano ilimitado. Aqui, os planadores que eles libertam dão a volta e embatem nos destroços que restam, pelo que a história que vês difere da dos manuais. Diehard é suficientemente pequeno para não ser afetado: desaparece ao fim de 130 gerações em qualquer dos casos.",
        ],
      },
    ],
    experimentsHeading: "Experimenta isto",
    experiments: [
      {
        title: "Conta até 130",
        text: "Carrega «Diehard» e clica algumas vezes em «Passo» para o veres mudar, depois clica em «Reproduzir» a 12 gen/s. Nunca repete uma forma, e na geração 130 o contador de população cai exatamente para 0.",
      },
      {
        title: "Mede uma nave",
        text: "Carrega «Lightweight spaceship», a nave leve, e põe a velocidade em 60. Ela desloca-se duas células a cada quatro gerações, pelo que atravessa as 120 colunas e regressa ao ponto de partida ao fim de 240 gerações. Um planador precisa de muito mais: ao mover-se uma célula na diagonal a cada quatro gerações, só regressa à sua célula inicial exata ao fim de 3360 gerações, porque 840 é o menor número divisível por 120 e por 70.",
      },
      {
        title: "Vê o canhão a invadir o seu próprio mundo",
        text: "Clica em «Reproduzir» com o canhão de planadores inicial. A princípio sai dele um fluxo arrumado de planadores, um a cada 30 gerações. Continua a observar enquanto o fluxo dá a volta ao toro: mais cedo ou mais tarde, os planadores que regressam embatem no próprio canhão, e a máquina impecável desfaz-se em destroços.",
      },
    ],
  },
  sv: {
    metaDescription:
      "Rita celler, ladda glidare, Gospers kanon eller R-pentominon och kör Conways Game of Life på en torus med 120 × 70 celler. Lär dig reglerna och koden bakom.",
    heading: "Så fungerar den här sandlådan",
    intro:
      "Rutnätet är ett universum med 8400 celler, där varje cell antingen lever (en lysande prick) eller är död (tom). Tiden går i diskreta generationer, och i varje generation uppdateras alla celler samtidigt enligt samma lilla regel. Det finns ingen spelare och ingen slump när du väl har tryckt på spela: det du ritar eller laddar är hela inmatningen, och allt som följer är förutbestämt. Det överraskande med Conways Game of Life är hur mycket beteende som ryms i en sådan regel: partiklar som färdas, maskiner som bygger andra partiklar och mönster som sjuder i tusentals generationer innan de lugnar sig.",
    sections: [
      {
        heading: "Regeln",
        paragraphs: [
          "John Horton Conway tänkte ut spelet 1970, och Martin Gardner gjorde det berömt i sin spalt i Scientific American i oktober samma år. Varje cell tittar på sina åtta grannar, de celler som rör vid den vågrätt, lodrätt och diagonalt. En levande cell med två eller tre levande grannar överlever. Med färre dör den av ensamhet, med fler dör den av trängsel. En död cell med exakt tre levande grannar blir levande. I den kortform som används för sådana regler heter det B3/S23: föds vid 3, överlever vid 2 eller 3.",
          "Skrivet som en funktion av det nuvarande tillståndet s (1 för levande) och antalet grannar n blir nästa tillstånd:",
        ],
        formula: nextStateFormula("om", "annars."),
      },
      {
        heading: "Vad reglagen gör",
        paragraphs: [
          "Sandlådan öppnas pausad, med en Gospers glidarkanon nära det övre vänstra hörnet. ”Spela” startar klockan, ”Paus” stoppar den och ”Steg” går fram exakt en generation (knappen är avstängd medan simuleringen körs). Hastighetsreglaget ställer in takten från 1 till 60 generationer per sekund och börjar på 12.",
          "Klicka på en cell för att växla den. Tillståndet du skapar med det första klicket avgör vad ett drag gör: om du slog på en cell målar du levande celler när du drar, och om du slog av en suddar du. Det går att rita även medan simuleringen körs. ”Slump” fyller brädet så att varje cell lever med sannolikheten 25 %, ”Rensa” tömmer det, och båda nollställer generationsräknaren.",
          "Mönsterknapparna tömmer brädet och placerar ett klassiskt mönster nära mitten: glidaren (”Glider”), det lätta rymdskeppet (”Lightweight spaceship”), pulsaren med period 3, Gospers glidarkanon och tre långlivade frön, R-pentominon, ekollonet (”Acorn”) och Diehard. Färgknapparna ändrar bara hur levande celler målas. Märket högst upp visar generationen, antalet levande celler och deras andel av de 8400.",
        ],
      },
      {
        heading: "Hur den är byggd",
        paragraphs: [
          "Brädet är en enda Uint8Array på 120 × 70 byte, en byte per cell. Generation t + 1 beräknas aldrig på plats, eftersom en cell måste se sina grannar som de var och inte som de håller på att bli under uppdateringen. I stället finns två arrayer: step() läser från den aktuella, skriver till den andra, och sedan byter de två referenserna plats. Inget minne allokeras medan spelet körs.",
          "Kanterna går runt. Grannen till en cell i kolumnen längst till höger finns i kolumnen längst till vänster, och detsamma gäller uppåt och nedåt, vilket gör rektangeln till ytan av en torus. Därför dyker en glidare som lämnar nere till höger upp igen uppe till vänster i stället för att försvinna.",
          "Klockan använder requestAnimationFrame med en tidsackumulator: den lägger ihop den verkliga tiden sedan förra bildrutan och kör så många generationer som ryms i den vid vald hastighet, men aldrig fler än 20 per bildruta, så att en långsam enhet inte fastnar i att försöka komma ikapp. Ritningen är skild från simuleringen. Alla levande celler läggs till i en enda canvas-bana av små cirklar och fylls i ett enda anrop med ett mjukt sken, ovanpå ett svagt stödrutnät var tionde cell. Ingenting rör sig förrän du trycker på ”Spela”, så sidan står stilla för den som föredrar minskad rörelse.",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "En ändlig värld upprepar sig alltid",
        paragraphs: [
          "På ett oändligt plan växer Gospers kanon för evigt och skickar ut en ny glidare var 30:e generation. På det här brädet kan det inte hända. En torus med 120 × 70 celler har 2^8400 möjliga konfigurationer, ett enormt men ändligt antal, och var och en har exakt en efterföljare. Förr eller senare måste följden återvända till en konfiguration som den redan har sett, och från och med då går den runt i en cykel för alltid. Varje körning här slutar därför i ett stilleben, en oscillation eller en mycket lång slinga.",
          "Att kanterna går runt ändrar också de berömda livslängderna. R-pentominons 1103 generationer och ekollonets 5206 är uppmätta på ett obegränsat plan. Här kommer glidarna som de släpper ifrån sig runt igen och kraschar in i bråten som finns kvar, så historien du ser skiljer sig från lärobokens. Diehard är litet nog att inte påverkas: det försvinner efter 130 generationer i båda fallen.",
        ],
      },
    ],
    experimentsHeading: "Prova det här",
    experiments: [
      {
        title: "Räkna till 130",
        text: "Ladda ”Diehard” och tryck på ”Steg” några gånger för att se det förändras, och tryck sedan på ”Spela” vid 12 gen/s. Det upprepar aldrig en form, och vid generation 130 faller populationsräknaren till exakt 0.",
      },
      {
        title: "Mät ett rymdskepp",
        text: "Ladda ”Lightweight spaceship”, det lätta rymdskeppet, och ställ hastigheten på 60. Det rör sig två celler var fjärde generation, så det korsar alla 120 kolumner och är tillbaka där det började efter 240 generationer. En glidare behöver mycket längre tid: den rör sig en cell diagonalt var fjärde generation och är därför tillbaka i exakt sin startcell först efter 3360 generationer, eftersom 840 är det minsta tal som är delbart med både 120 och 70.",
      },
      {
        title: "Se kanonen köra över sin egen värld",
        text: "Tryck på ”Spela” med glidarkanonen från start. Till en början lämnar en prydlig ström av glidare den, en var 30:e generation. Fortsätt titta medan strömmen går varvet runt torusen: förr eller senare kör återvändande glidare in i själva kanonen, och den prydliga maskinen faller sönder i bråte.",
      },
    ],
  },
  no: {
    metaDescription:
      "Tegn celler, last inn glidere, Gospers kanon eller R-pentominoen og kjør Conways Game of Life på en torus med 120 × 70 celler. Lær reglene og koden bak.",
    heading: "Slik fungerer denne sandkassen",
    intro:
      "Rutenettet er et univers med 8400 celler, der hver celle enten lever (en lysende prikk) eller er død (tom). Tiden går i diskrete generasjoner, og i hver generasjon oppdateres alle cellene samtidig etter den samme lille regelen. Det finnes ingen spiller og ingen tilfeldighet når du først har trykket på «Spill»: Det du tegner eller laster inn, er de eneste inndataene, og alt som følger, er tvunget. Det overraskende med Conways Game of Life er hvor mye oppførsel som får plass i en slik regel: partikler som reiser, maskiner som bygger andre partikler, og mønstre som koker i tusenvis av generasjoner før de faller til ro.",
    sections: [
      {
        heading: "Regelen",
        paragraphs: [
          "John Horton Conway tenkte ut spillet i 1970, og Martin Gardner gjorde det berømt i spalten sin i Scientific American i oktober samme år. Hver celle ser på de åtte naboene sine, cellene som berører den vannrett, loddrett og diagonalt. En levende celle med to eller tre levende naboer overlever. Med færre dør den av ensomhet, med flere dør den av trengsel. En død celle med nøyaktig tre levende naboer blir levende. I kortformen som brukes for slike regler, heter dette B3/S23: fødes ved 3, overlever ved 2 eller 3.",
          "Skrevet som en funksjon av den nåværende tilstanden s (1 for levende) og antallet naboer n er neste tilstand:",
        ],
        formula: nextStateFormula("hvis", "ellers."),
      },
      {
        heading: "Hva kontrollene gjør",
        paragraphs: [
          "Sandkassen åpner i pause, med en Gospers gliderkanon nær øvre venstre hjørne. «Spill» starter klokken, «Pause» stopper den, og «Steg» går fram nøyaktig én generasjon (knappen er deaktivert mens simuleringen kjører). Glidebryteren for hastighet setter takten fra 1 til 60 generasjoner per sekund og starter på 12.",
          "Klikk på en celle for å veksle den. Tilstanden du lager med det første klikket, avgjør hva et drag gjør: Hvis du slo på en celle, maler du levende celler når du drar, og hvis du slo av en, visker du ut. Du kan også tegne mens simuleringen kjører. «Tilfeldig» fyller brettet slik at hver celle lever med sannsynlighet 25 %, «Tøm» tømmer det, og begge nullstiller generasjonstelleren.",
          "Mønsterknappene tømmer brettet og plasserer ett klassisk mønster nær midten: glideren («Glider»), det lette romskipet («Lightweight spaceship»), pulsaren med periode 3, Gospers gliderkanon og tre langlivede frø, R-pentominoen, eikenøtten («Acorn») og Diehard. Fargeknappene endrer bare hvordan levende celler males. Merket øverst viser generasjonen, antallet levende celler og andelen deres av de 8400.",
        ],
      },
      {
        heading: "Slik er den bygget",
        paragraphs: [
          "Brettet er ett enkelt Uint8Array på 120 × 70 byte, én byte per celle. Generasjon t + 1 regnes aldri ut på stedet, fordi en celle må se naboene sine slik de var, ikke slik de er i ferd med å bli under oppdateringen. I stedet finnes det to arrayer: step() leser fra den gjeldende, skriver til den andre, og så bytter de to referansene plass. Det allokeres ikke noe minne mens spillet kjører.",
          "Kantene går rundt. Naboen til en celle i kolonnen lengst til høyre ligger i kolonnen lengst til venstre, og det samme gjelder oppe og nede, noe som gjør rektangelet til overflaten av en torus. Derfor dukker en glider som forlater brettet nede til høyre, opp igjen oppe til venstre i stedet for å forsvinne.",
          "Klokken bruker requestAnimationFrame med en tidsakkumulator: Den legger sammen den virkelige tiden siden forrige bilde og kjører så mange generasjoner som får plass i den ved valgt hastighet, men aldri mer enn 20 per bilde, slik at en treg enhet ikke blir sittende fast i forsøket på å ta igjen etterslepet. Tegningen er atskilt fra simuleringen. Alle levende celler legges til i én enkelt tegnebane av små sirkler og fylles i ett kall med et mykt skjær, oppå et svakt hjelperutenett for hver tiende celle. Ingenting beveger seg før du trykker på «Spill», så siden står stille for dem som foretrekker redusert bevegelse.",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "En endelig verden gjentar seg alltid",
        paragraphs: [
          "På et uendelig plan vokser Gospers kanon for alltid og sender ut en ny glider hver 30. generasjon. På dette brettet kan ikke det skje. En torus med 120 × 70 celler har 2^8400 mulige konfigurasjoner, et enormt, men endelig antall, og hver av dem har nøyaktig én etterfølger. Før eller siden må følgen komme tilbake til en konfigurasjon den allerede har sett, og fra da av går den i syklus for alltid. Hver kjøring her ender derfor i et stilleben, en oscillasjon eller en svært lang sløyfe.",
          "At kantene går rundt, endrer også de berømte levetidene. R-pentominoens 1103 generasjoner og eikenøttens 5206 er målt på et ubegrenset plan. Her kommer gliderne de slipper fra seg, rundt igjen og krasjer inn i restene som er igjen, så historien du ser, avviker fra lærebokens. Diehard er liten nok til ikke å bli påvirket: Den forsvinner etter 130 generasjoner uansett.",
        ],
      },
    ],
    experimentsHeading: "Prøv dette",
    experiments: [
      {
        title: "Tell til 130",
        text: "Last inn «Diehard» og trykk på «Steg» noen ganger for å se den endre seg, og trykk så på «Spill» ved 12 gen/s. Den gjentar aldri en form, og ved generasjon 130 faller populasjonstelleren til nøyaktig 0.",
      },
      {
        title: "Mål et romskip",
        text: "Last inn «Lightweight spaceship», det lette romskipet, og sett hastigheten til 60. Det flytter seg to celler hver fjerde generasjon, så det krysser alle de 120 kolonnene og er tilbake der det startet etter 240 generasjoner. En glider trenger mye lengre tid: Den flytter seg én celle diagonalt hver fjerde generasjon og er derfor først tilbake i nøyaktig startcellen sin etter 3360 generasjoner, fordi 840 er det minste tallet som er delelig med både 120 og 70.",
      },
      {
        title: "Se kanonen overkjøre sin egen verden",
        text: "Trykk på «Spill» med gliderkanonen fra starten. Til å begynne med forlater en ryddig strøm av glidere den, én hver 30. generasjon. Fortsett å se på mens strømmen går rundt torusen: Før eller siden kjører glidere på vei tilbake inn i selve kanonen, og den ryddige maskinen går i oppløsning.",
      },
    ],
  },
};
