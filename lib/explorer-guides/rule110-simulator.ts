import type { ExplorerGuide } from "./types";

// Numbers quoted here (240 cells, 360 rows, seed density 0.45, edge seed at
// cell 238, speed 1 to 120 gen/s with default 20) match
// app/rule110/simulator/page.tsx; update both together.
const STEP_EXCERPT = `function step(row: Uint8Array, rule: number): Uint8Array {
  const n = row.length;
  const next = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    const l = row[(i - 1 + n) % n];   // wraps around: the row is a ring
    const c = row[i];
    const r = row[(i + 1) % n];
    const key = (l << 2) | (c << 1) | r;  // neighbourhood as 0..7
    next[i] = (rule >> key) & 1;          // bit "key" of the rule number
  }
  return next;
}`;

export const RULE110_SIMULATOR_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Run Rule 110 and all 256 elementary cellular automata live: pick a rule, seed and speed, and see how one byte of rules can produce Turing-complete behaviour.",
    heading: "How this simulator works",
    intro:
      "Each horizontal line of pixels is a row of 240 cells, each one either on or off. Every new generation is computed from the row before it and appended at the bottom, so the picture reads from top to bottom like a timeline: the oldest generation at the top, the present at the bottom. Once 360 generations are on screen, the oldest one scrolls away. A single fixed rule decides each cell by looking at only three cells: the cell itself and its two neighbours. Rule 110 is the most famous of these rules, because this purely local scribbling can, in principle, carry out any computation.",
    sections: [
      {
        heading: "Eight neighbourhoods, one byte",
        paragraphs: [
          "Three cells that are each on or off can form 2³ = 8 patterns. A rule simply says, for each of those eight patterns, whether the middle cell is on in the next generation. Eight yes or no answers make one byte, so there are exactly 2⁸ = 256 such rules, and Stephen Wolfram's numbering reads the byte as a binary number. Write the patterns from 111 down to 000 and note the answers: for Rule 110 they are 0, 1, 1, 0, 1, 1, 1, 0, which is 01101110 in binary, or 110. In words, a cell is off in the next step only if its neighbourhood was 111, 100 or 000.",
          "The HUD over the canvas shows the current rule in this binary form, and the formula below expresses the same lookup: the neighbourhood is read as a number k from 0 to 7, and the new state is bit k of the rule number.",
        ],
        formula:
          "s_i^{t+1} = \\left\\lfloor \\frac{N}{2^{\\,4 s_{i-1}^{t} + 2 s_i^{t} + s_{i+1}^{t}}} \\right\\rfloor \\bmod 2",
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "The eight buttons under «Famous rules» load rules with distinctive behaviour: 110, the chaotic Rule 30, Rule 90 (the Sierpiński triangle), the traffic model Rule 184, plus 54, 73, 150 and 22. The slider below reaches every rule from 0 to 255. Choosing a rule always restarts from the current seed, so you compare rules on the same starting row.",
          "The seed sets that starting row. «Single» switches on the one cell in the middle. «Edge» switches on the cell second from the right, which gives patterns that grow leftward, like Rule 110, almost the full width to develop. «Random» switches on each cell independently with probability 0.45.",
          "Play and pause do what they say; Step adds exactly one generation and only works while paused. «Clear» re-seeds the row and resets the generation counter. The speed slider runs from 1 to 120 generations per second, starting at 20, and the colour buttons only change how live cells are painted.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "Each generation is a Uint8Array of 240 cells, and the history is an array of those rows. Computing the next row takes one pass: for every cell the three neighbours are packed into a number from 0 to 7, and the new state is that bit of the rule number. The left and right ends are joined, so the row is really a ring and patterns that leave one side come back on the other.",
          "Timing is decoupled from the display. Every animation frame adds the elapsed time to an accumulator and appends as many generations as fit at the chosen speed, so 120 generations per second really are 120 even on a 60 Hz screen. After each frame the whole buffer is repainted on a 2D canvas, one filled rectangle per live cell, with the backing store sized to the device pixel ratio.",
          "If your system asks for reduced motion, the simulator does not start on its own: you see the seed as a still frame and can advance it with Step or press Play yourself. While paused, the animation loop is not running at all.",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "Why Rule 110 is special",
        paragraphs: [
          "Most rules die out, freeze or repeat. A few, like Rule 30, look like noise forever. Rule 110 sits in between: a regular, repeating background through which localised structures travel at different speeds and collide. Matthew Cook showed, in work published in 2004, that collisions of these gliders can emulate a cyclic tag system, and since such systems can simulate any Turing machine, Rule 110 is Turing-complete. Its mirror image, Rule 124, behaves the same with left and right swapped.",
        ],
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "Give Rule 110 room to grow",
        text: "Select Rule 110, choose the «edge» seed and set the speed to 60. The pattern spreads leftward one cell per generation. Look for the repeating background texture and the slanted structures that move through it and collide: those are the gliders Cook's proof uses as signals.",
      },
      {
        title: "A fractal from one cell",
        text: "Select Rule 90 with the «single» seed. Each cell becomes the XOR of its two neighbours, and a Sierpiński triangle appears. Around generation 120 its two edges meet on the far side of the 240-cell ring and the pattern begins to interfere with itself.",
      },
      {
        title: "Order and chaos side by side",
        text: "Select Rule 30 with the «single» seed. One side of the triangle settles into regular diagonal stripes while the other looks random, even though the rule is a single byte and nothing random is involved.",
      },
      {
        title: "Traffic jams that dissolve",
        text: "Select Rule 184 with the «random» seed. Read live cells as cars moving one cell to the right whenever the cell ahead is free. Jams drift backwards, to the left. Because the seed fills only about 45 percent of the road, fewer than half the cells, the jams usually dissolve until every car moves freely.",
      },
    ],
  },
  de: {
    metaDescription:
      "Regel 110 und alle 256 elementaren Zellularautomaten live: Regel, Startzeile und Tempo wählen und sehen, wie ein einziges Byte Turing-Vollständigkeit erzeugt.",
    heading: "So funktioniert dieser Simulator",
    intro:
      "Jede waagrechte Pixelzeile ist eine Reihe aus 240 Zellen, jede an oder aus. Jede neue Generation wird aus der vorherigen Zeile berechnet und unten angehängt, das Bild liest sich also von oben nach unten wie eine Zeitleiste: oben die älteste Generation, unten die Gegenwart. Sind 360 Generationen zu sehen, rollt die älteste aus dem Bild. Eine einzige feste Regel entscheidet über jede Zelle und schaut dabei nur auf drei Zellen: die Zelle selbst und ihre beiden Nachbarinnen. Regel 110 ist die berühmteste dieser Regeln, weil dieses rein lokale Gekritzel im Prinzip jede Berechnung ausführen kann.",
    sections: [
      {
        heading: "Acht Nachbarschaften, ein Byte",
        paragraphs: [
          "Drei Zellen, die jeweils an oder aus sind, bilden 2³ = 8 Muster. Eine Regel legt für jedes dieser acht Muster fest, ob die mittlere Zelle in der nächsten Generation an ist. Acht Ja-oder-Nein-Antworten ergeben ein Byte, es gibt also genau 2⁸ = 256 solcher Regeln, und die Nummerierung von Stephen Wolfram liest das Byte als Binärzahl. Schreib die Muster von 111 bis 000 auf und notiere die Antworten: Bei Regel 110 lauten sie 0, 1, 1, 0, 1, 1, 1, 0, binär 01101110, also 110. In Worten: Eine Zelle ist im nächsten Schritt nur dann aus, wenn ihre Nachbarschaft 111, 100 oder 000 war.",
          "Die Anzeige über dem Canvas zeigt die aktuelle Regel in dieser Binärform, und die Formel unten drückt dasselbe Nachschlagen aus: Die Nachbarschaft wird als Zahl k von 0 bis 7 gelesen, und der neue Zustand ist Bit k der Regelnummer.",
        ],
        formula:
          "s_i^{t+1} = \\left\\lfloor \\frac{N}{2^{\\,4 s_{i-1}^{t} + 2 s_i^{t} + s_{i+1}^{t}}} \\right\\rfloor \\bmod 2",
      },
      {
        heading: "Was die Regler bewirken",
        paragraphs: [
          "Die acht Knöpfe unter «Berühmte Regeln» laden Regeln mit markantem Verhalten: 110, die chaotische Regel 30, Regel 90 (das Sierpiński-Dreieck), das Verkehrsmodell Regel 184 sowie 54, 73, 150 und 22. Der Regler darunter erreicht jede Regel von 0 bis 255. Ein Regelwechsel startet immer neu mit der aktuellen Startzeile, so vergleichst du Regeln auf derselben Ausgangslage.",
          "Die Saat bestimmt diese Startzeile. «Einzeln» schaltet die eine Zelle in der Mitte an. «Rand» schaltet die zweite Zelle von rechts an; Muster, die nach links wachsen, wie Regel 110, haben so fast die ganze Breite Platz. «Zufällig» schaltet jede Zelle unabhängig mit Wahrscheinlichkeit 0,45 an.",
          "Start und Pause tun, was sie sagen; Schritt fügt genau eine Generation hinzu und funktioniert nur im Pausenmodus. «Leeren» setzt die Startzeile neu und den Generationszähler auf null. Der Regler für die Geschwindigkeit reicht von 1 bis 120 Generationen pro Sekunde, voreingestellt sind 20, und die Farbknöpfe ändern nur, wie lebende Zellen gemalt werden.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Jede Generation ist ein Uint8Array mit 240 Zellen, die Geschichte ein Array solcher Zeilen. Die nächste Zeile entsteht in einem Durchlauf: Für jede Zelle werden die drei Nachbarn zu einer Zahl von 0 bis 7 gepackt, und der neue Zustand ist dieses Bit der Regelnummer. Linkes und rechtes Ende sind verbunden, die Zeile ist also eigentlich ein Ring, und Muster, die auf einer Seite hinauslaufen, kommen auf der anderen zurück.",
          "Das Timing ist von der Anzeige entkoppelt. Jeder Animationsframe addiert die vergangene Zeit zu einem Akkumulator und hängt so viele Generationen an, wie beim gewählten Tempo hineinpassen. 120 Generationen pro Sekunde sind deshalb auch auf einem 60-Hz-Bildschirm wirklich 120. Nach jedem Frame wird der ganze Puffer auf ein 2D-Canvas gemalt, ein gefülltes Rechteck pro lebender Zelle, mit einer an die Pixeldichte des Geräts angepassten Auflösung.",
          "Wünscht dein System reduzierte Bewegung, startet der Simulator nicht von selbst: Du siehst die Startzeile als Standbild und kannst sie mit Schritt weiterschalten oder selbst auf Start drücken. Im Pausenmodus läuft die Animationsschleife überhaupt nicht.",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "Warum Regel 110 besonders ist",
        paragraphs: [
          "Die meisten Regeln sterben aus, erstarren oder wiederholen sich. Einige, wie Regel 30, sehen für immer nach Rauschen aus. Regel 110 liegt dazwischen: ein regelmäßiger, sich wiederholender Hintergrund, durch den lokale Strukturen mit verschiedenen Geschwindigkeiten wandern und zusammenstoßen. Matthew Cook zeigte in einer 2004 veröffentlichten Arbeit, dass Zusammenstöße dieser Gleiter ein zyklisches Tag-System nachbilden können. Weil solche Systeme jede Turingmaschine simulieren können, ist Regel 110 Turing-vollständig. Ihr Spiegelbild, Regel 124, verhält sich genauso, nur mit vertauschtem Links und Rechts.",
        ],
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Regel 110 Platz geben",
        text: "Wähle Regel 110, die Saat «Rand» und Geschwindigkeit 60. Das Muster breitet sich pro Generation eine Zelle nach links aus. Achte auf die sich wiederholende Hintergrundtextur und auf die schrägen Strukturen, die hindurchwandern und zusammenstoßen: Das sind die Gleiter, die Cooks Beweis als Signale nutzt.",
      },
      {
        title: "Ein Fraktal aus einer Zelle",
        text: "Wähle Regel 90 mit der Saat «einzeln». Jede Zelle wird zum XOR ihrer beiden Nachbarinnen, und ein Sierpiński-Dreieck erscheint. Um Generation 120 treffen sich seine beiden Ränder auf der anderen Seite des 240-Zellen-Rings, und das Muster beginnt, sich selbst zu stören.",
      },
      {
        title: "Ordnung und Chaos nebeneinander",
        text: "Wähle Regel 30 mit der Saat «einzeln». Eine Seite des Dreiecks ordnet sich zu regelmäßigen Diagonalstreifen, die andere sieht zufällig aus, obwohl die Regel nur ein Byte ist und nirgends Zufall im Spiel ist.",
      },
      {
        title: "Staus, die sich auflösen",
        text: "Wähle Regel 184 mit der Saat «zufällig». Lies lebende Zellen als Autos, die eine Zelle nach rechts fahren, sobald die Zelle vor ihnen frei ist. Staus wandern rückwärts, nach links. Weil die Saat nur etwa 45 Prozent der Straße füllt, also weniger als die Hälfte, lösen sich die Staus meist auf, bis jedes Auto frei fährt.",
      },
    ],
  },
  es: {
    metaDescription:
      "Ejecuta la Regla 110 y los 256 autómatas celulares elementales en vivo: elige regla, semilla y velocidad, y mira cómo un byte basta para ser Turing completo.",
    heading: "Cómo funciona este simulador",
    intro:
      "Cada línea horizontal de píxeles es una fila de 240 celdas, cada una encendida o apagada. Cada nueva generación se calcula a partir de la fila anterior y se añade abajo, de modo que la imagen se lee de arriba abajo como una línea de tiempo: la generación más antigua arriba, el presente abajo. Cuando hay 360 generaciones en pantalla, la más antigua desaparece por arriba. Una única regla fija decide cada celda mirando solo tres: la propia celda y sus dos vecinas. La Regla 110 es la más famosa de estas reglas, porque este garabateo puramente local puede, en principio, llevar a cabo cualquier cómputo.",
    sections: [
      {
        heading: "Ocho vecindades, un byte",
        paragraphs: [
          "Tres celdas que pueden estar encendidas o apagadas forman 2³ = 8 patrones. Una regla dice simplemente, para cada uno de esos ocho patrones, si la celda central estará encendida en la generación siguiente. Ocho respuestas de sí o no forman un byte, así que hay exactamente 2⁸ = 256 reglas de este tipo, y la numeración de Stephen Wolfram lee ese byte como un número binario. Escribe los patrones de 111 a 000 y anota las respuestas: para la Regla 110 son 0, 1, 1, 0, 1, 1, 1, 0, es decir, 01101110 en binario, o 110. Dicho con palabras, una celda queda apagada en el paso siguiente solo si su vecindad era 111, 100 o 000.",
          "El indicador sobre el lienzo muestra la regla actual en esa forma binaria, y la fórmula de abajo expresa la misma consulta: la vecindad se lee como un número k de 0 a 7, y el nuevo estado es el bit k del número de regla.",
        ],
        formula:
          "s_i^{t+1} = \\left\\lfloor \\frac{N}{2^{\\,4 s_{i-1}^{t} + 2 s_i^{t} + s_{i+1}^{t}}} \\right\\rfloor \\bmod 2",
      },
      {
        heading: "Qué hacen los controles",
        paragraphs: [
          "Los ocho botones bajo «Reglas célebres» cargan reglas con un comportamiento característico: la 110, la caótica Regla 30, la Regla 90 (el triángulo de Sierpiński), el modelo de tráfico de la Regla 184, además de la 54, la 73, la 150 y la 22. El deslizador de debajo alcanza cualquier regla de 0 a 255. Al elegir una regla, la simulación siempre vuelve a empezar desde la semilla actual, de modo que comparas las reglas sobre la misma fila inicial.",
          "La semilla fija esa fila inicial. Con «única» se enciende la celda del centro. Con «borde» se enciende la segunda celda por la derecha, lo que deja casi todo el ancho para que se desarrollen los patrones que crecen hacia la izquierda, como el de la Regla 110. Con «aleatoria» cada celda se enciende de forma independiente con probabilidad 0,45.",
          "Reproducir y Pausa hacen lo que dicen; Paso añade exactamente una generación y solo funciona en pausa. «Limpiar» vuelve a sembrar la fila y pone a cero el contador de generaciones. El deslizador de velocidad va de 1 a 120 generaciones por segundo y empieza en 20, y los botones de color solo cambian cómo se pintan las celdas vivas.",
        ],
      },
      {
        heading: "Cómo está construido",
        paragraphs: [
          "Cada generación es un Uint8Array de 240 celdas, y el historial es un array de esas filas. Calcular la fila siguiente requiere una sola pasada: para cada celda, las tres vecinas se empaquetan en un número de 0 a 7, y el nuevo estado es ese bit del número de regla. Los extremos izquierdo y derecho están unidos, así que la fila es en realidad un anillo y los patrones que salen por un lado vuelven a entrar por el otro.",
          "El ritmo está desacoplado de la pantalla. Cada fotograma de animación suma el tiempo transcurrido a un acumulador y añade tantas generaciones como quepan a la velocidad elegida, de modo que 120 generaciones por segundo son de verdad 120 incluso en una pantalla de 60 Hz. Después de cada fotograma se repinta todo el búfer en un lienzo 2D, un rectángulo relleno por celda viva, con una resolución interna ajustada a la densidad de píxeles del dispositivo.",
          "Si tu sistema pide movimiento reducido, el simulador no arranca por su cuenta: ves la semilla como imagen fija y puedes avanzarla con Paso o pulsar Reproducir tú mismo. En pausa, el bucle de animación no se ejecuta en absoluto.",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "Por qué la Regla 110 es especial",
        paragraphs: [
          "La mayoría de las reglas se extinguen, se congelan o se repiten. Unas pocas, como la Regla 30, parecen ruido para siempre. La Regla 110 queda en medio: un fondo regular y repetitivo por el que viajan estructuras localizadas a distintas velocidades y chocan entre sí. Matthew Cook demostró, en un trabajo publicado en 2004, que las colisiones de estos planeadores pueden emular un sistema de etiquetas cíclico, y como tales sistemas pueden simular cualquier máquina de Turing, la Regla 110 es Turing completa. Su imagen especular, la Regla 124, se comporta igual con izquierda y derecha intercambiadas.",
        ],
      },
    ],
    experimentsHeading: "Prueba esto",
    experiments: [
      {
        title: "Dale espacio a la Regla 110",
        text: "Selecciona la Regla 110, elige la semilla «borde» y pon la velocidad en 60. El patrón se extiende hacia la izquierda una celda por generación. Busca la textura de fondo que se repite y las estructuras inclinadas que la atraviesan y chocan: son los planeadores que la demostración de Cook usa como señales.",
      },
      {
        title: "Un fractal a partir de una celda",
        text: "Selecciona la Regla 90 con la semilla «única». Cada celda pasa a ser el XOR de sus dos vecinas, y aparece un triángulo de Sierpiński. Hacia la generación 120 sus dos bordes se encuentran al otro lado del anillo de 240 celdas y el patrón empieza a interferir consigo mismo.",
      },
      {
        title: "Orden y caos, lado a lado",
        text: "Selecciona la Regla 30 con la semilla «única». Un lado del triángulo se asienta en franjas diagonales regulares mientras el otro parece aleatorio, aunque la regla es un solo byte y no interviene ningún azar.",
      },
      {
        title: "Atascos que se disuelven",
        text: "Selecciona la Regla 184 con la semilla «aleatoria». Lee las celdas vivas como coches que avanzan una celda hacia la derecha siempre que la celda de delante esté libre. Los atascos se desplazan hacia atrás, a la izquierda. Como la semilla llena solo alrededor del 45 por ciento de la carretera, menos de la mitad de las celdas, los atascos suelen disolverse hasta que todos los coches circulan libremente.",
      },
    ],
  },
  fr: {
    metaDescription:
      "Lance la règle 110 et les 256 automates cellulaires élémentaires en direct : choisis règle, graine et vitesse, et vois un seul octet devenir Turing-complet.",
    heading: "Comment fonctionne ce simulateur",
    intro:
      "Chaque ligne horizontale de pixels est une rangée de 240 cellules, chacune allumée ou éteinte. Chaque nouvelle génération est calculée à partir de la rangée précédente et ajoutée en bas, si bien que l'image se lit de haut en bas comme une frise chronologique : la génération la plus ancienne en haut, le présent en bas. Dès que 360 générations sont à l'écran, la plus ancienne sort par le haut. Une seule règle fixe décide du sort de chaque cellule en ne regardant que trois cellules : la cellule elle-même et ses deux voisines. La règle 110 est la plus célèbre de ces règles, parce que ce gribouillage purement local peut, en principe, effectuer n'importe quel calcul.",
    sections: [
      {
        heading: "Huit voisinages, un octet",
        paragraphs: [
          "Trois cellules, chacune allumée ou éteinte, peuvent former 2³ = 8 motifs. Une règle dit simplement, pour chacun de ces huit motifs, si la cellule centrale sera allumée à la génération suivante. Huit réponses par oui ou par non font un octet : il existe donc exactement 2⁸ = 256 règles de ce type, et la numérotation de Stephen Wolfram lit cet octet comme un nombre binaire. Écris les motifs de 111 à 000 et note les réponses : pour la règle 110, ce sont 0, 1, 1, 0, 1, 1, 1, 0, soit 01101110 en binaire, c'est-à-dire 110. Autrement dit, une cellule n'est éteinte à l'étape suivante que si son voisinage était 111, 100 ou 000.",
          "L'affichage au-dessus du canevas montre la règle courante sous cette forme binaire, et la formule ci-dessous exprime la même consultation : le voisinage est lu comme un nombre k de 0 à 7, et le nouvel état est le bit k du numéro de la règle.",
        ],
        formula:
          "s_i^{t+1} = \\left\\lfloor \\frac{N}{2^{\\,4 s_{i-1}^{t} + 2 s_i^{t} + s_{i+1}^{t}}} \\right\\rfloor \\bmod 2",
      },
      {
        heading: "À quoi servent les commandes",
        paragraphs: [
          "Les huit boutons sous « Règles célèbres » chargent des règles au comportement caractéristique : la 110, la chaotique règle 30, la règle 90 (le triangle de Sierpiński), le modèle de trafic de la règle 184, ainsi que les règles 54, 73, 150 et 22. Le curseur situé en dessous atteint toutes les règles de 0 à 255. Choisir une règle relance toujours la simulation depuis la graine courante : tu compares ainsi les règles sur la même rangée de départ.",
          "La graine fixe cette rangée de départ. « unique » allume la seule cellule du milieu. « bord » allume la deuxième cellule en partant de la droite, ce qui laisse presque toute la largeur aux motifs qui poussent vers la gauche, comme celui de la règle 110. « aléatoire » allume chaque cellule indépendamment avec une probabilité de 0,45.",
          "Lecture et Pause font ce que leur nom indique ; Pas ajoute exactement une génération et ne fonctionne qu'en pause. « Effacer » réensemence la rangée et remet le compteur de générations à zéro. Le curseur de vitesse va de 1 à 120 générations par seconde, avec 20 au départ, et les boutons de couleur changent seulement la façon dont les cellules vivantes sont peintes.",
        ],
      },
      {
        heading: "Comment c'est construit",
        paragraphs: [
          "Chaque génération est un Uint8Array de 240 cellules, et l'historique est un tableau de ces rangées. Le calcul de la rangée suivante se fait en un seul passage : pour chaque cellule, les trois voisines sont regroupées en un nombre de 0 à 7, et le nouvel état est le bit correspondant du numéro de la règle. Les extrémités gauche et droite sont reliées : la rangée est donc en réalité un anneau, et les motifs qui sortent d'un côté reviennent par l'autre.",
          "Le rythme est découplé de l'affichage. Chaque image de l'animation ajoute le temps écoulé à un accumulateur et produit autant de générations que la vitesse choisie le permet, si bien que 120 générations par seconde en sont vraiment 120, même sur un écran à 60 Hz. Après chaque image, tout le tampon est repeint sur un canevas 2D, un rectangle plein par cellule vivante, avec une résolution interne adaptée à la densité de pixels de l'appareil.",
          "Si ton système demande une réduction des animations, le simulateur ne démarre pas tout seul : tu vois la graine sous forme d'image fixe et tu peux la faire avancer avec Pas ou appuyer toi-même sur Lecture. En pause, la boucle d'animation ne tourne pas du tout.",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "Pourquoi la règle 110 est particulière",
        paragraphs: [
          "La plupart des règles s'éteignent, se figent ou se répètent. Quelques-unes, comme la règle 30, ressemblent indéfiniment à du bruit. La règle 110 se situe entre les deux : un fond régulier et répétitif, traversé par des structures localisées qui se déplacent à des vitesses différentes et entrent en collision. Matthew Cook a montré, dans un travail publié en 2004, que les collisions de ces planeurs peuvent émuler un système de tague cyclique, et comme de tels systèmes peuvent simuler n'importe quelle machine de Turing, la règle 110 est Turing-complète. Son image miroir, la règle 124, se comporte de la même manière, gauche et droite échangées.",
        ],
      },
    ],
    experimentsHeading: "À essayer",
    experiments: [
      {
        title: "Laisse de la place à la règle 110",
        text: "Sélectionne la règle 110, choisis la graine « bord » et règle la vitesse sur 60. Le motif s'étend vers la gauche d'une cellule par génération. Repère la texture de fond qui se répète et les structures obliques qui la traversent et se percutent : ce sont les planeurs que la preuve de Cook utilise comme signaux.",
      },
      {
        title: "Une fractale à partir d'une cellule",
        text: "Sélectionne la règle 90 avec la graine « unique ». Chaque cellule devient le XOR de ses deux voisines, et un triangle de Sierpiński apparaît. Vers la génération 120, ses deux bords se rejoignent de l'autre côté de l'anneau de 240 cellules et le motif commence à interférer avec lui-même.",
      },
      {
        title: "Ordre et chaos côte à côte",
        text: "Sélectionne la règle 30 avec la graine « unique ». Un côté du triangle s'organise en bandes diagonales régulières tandis que l'autre semble aléatoire, alors que la règle tient en un seul octet et qu'aucun hasard n'intervient.",
      },
      {
        title: "Des bouchons qui se résorbent",
        text: "Sélectionne la règle 184 avec la graine « aléatoire ». Lis les cellules vivantes comme des voitures qui avancent d'une cellule vers la droite dès que la cellule devant elles est libre. Les bouchons reculent, vers la gauche. Comme la graine ne remplit qu'environ 45 pour cent de la route, soit moins de la moitié des cellules, les bouchons se résorbent le plus souvent jusqu'à ce que toutes les voitures roulent librement.",
      },
    ],
  },
  it: {
    metaDescription:
      "Esegui la Regola 110 e tutti i 256 automi cellulari elementari dal vivo: scegli regola, seme e velocità e guarda un solo byte diventare Turing-completo.",
    heading: "Come funziona questo simulatore",
    intro:
      "Ogni linea orizzontale di pixel è una riga di 240 celle, ciascuna accesa o spenta. Ogni nuova generazione viene calcolata dalla riga precedente e aggiunta in fondo, così l'immagine si legge dall'alto verso il basso come una linea del tempo: la generazione più vecchia in alto, il presente in basso. Quando sullo schermo ci sono 360 generazioni, la più vecchia scorre via. Un'unica regola fissa decide ogni cella guardandone solo tre: la cella stessa e le sue due vicine. La Regola 110 è la più famosa di queste regole, perché questo scarabocchiare puramente locale può, in linea di principio, eseguire qualsiasi calcolo.",
    sections: [
      {
        heading: "Otto intorni, un byte",
        paragraphs: [
          "Tre celle, ciascuna accesa o spenta, possono formare 2³ = 8 configurazioni. Una regola dice semplicemente, per ognuna di queste otto configurazioni, se la cella centrale sarà accesa nella generazione successiva. Otto risposte sì o no fanno un byte, quindi esistono esattamente 2⁸ = 256 regole di questo tipo, e la numerazione di Stephen Wolfram legge quel byte come un numero binario. Scrivi le configurazioni da 111 a 000 e annota le risposte: per la Regola 110 sono 0, 1, 1, 0, 1, 1, 1, 0, cioè 01101110 in binario, ovvero 110. A parole, una cella è spenta al passo successivo solo se il suo intorno era 111, 100 o 000.",
          "L'indicatore sopra il canvas mostra la regola attuale in questa forma binaria, e la formula qui sotto esprime la stessa consultazione: l'intorno viene letto come un numero k da 0 a 7, e il nuovo stato è il bit k del numero della regola.",
        ],
        formula:
          "s_i^{t+1} = \\left\\lfloor \\frac{N}{2^{\\,4 s_{i-1}^{t} + 2 s_i^{t} + s_{i+1}^{t}}} \\right\\rfloor \\bmod 2",
      },
      {
        heading: "A cosa servono i controlli",
        paragraphs: [
          "Gli otto pulsanti sotto «Regole celebri» caricano regole dal comportamento caratteristico: la 110, la caotica Regola 30, la Regola 90 (il triangolo di Sierpiński), il modello di traffico della Regola 184, più la 54, la 73, la 150 e la 22. Il cursore sottostante raggiunge ogni regola da 0 a 255. Scegliere una regola fa sempre ripartire la simulazione dal seme attuale, così confronti le regole sulla stessa riga iniziale.",
          "Il seme stabilisce quella riga iniziale. Con «singola» si accende la sola cella al centro. Con «bordo» si accende la seconda cella da destra, il che lascia quasi tutta la larghezza ai motivi che crescono verso sinistra, come quello della Regola 110. Con «casuale» ogni cella si accende in modo indipendente con probabilità 0,45.",
          "Riproduci e Pausa fanno quello che dicono; Passo aggiunge esattamente una generazione e funziona solo in pausa. «Svuota» semina di nuovo la riga e azzera il contatore delle generazioni. Il cursore della velocità va da 1 a 120 generazioni al secondo e parte da 20, mentre i pulsanti dei colori cambiano soltanto il modo in cui vengono dipinte le celle vive.",
        ],
      },
      {
        heading: "Com'è costruito",
        paragraphs: [
          "Ogni generazione è un Uint8Array di 240 celle, e la cronologia è un array di queste righe. Per calcolare la riga successiva basta una sola passata: per ogni cella le tre vicine vengono impacchettate in un numero da 0 a 7, e il nuovo stato è quel bit del numero della regola. Le estremità sinistra e destra sono unite, quindi la riga è in realtà un anello e i motivi che escono da un lato rientrano dall'altro.",
          "La temporizzazione è svincolata dallo schermo. Ogni fotogramma dell'animazione somma il tempo trascorso a un accumulatore e aggiunge tante generazioni quante ne entrano alla velocità scelta, così 120 generazioni al secondo sono davvero 120 anche su uno schermo a 60 Hz. Dopo ogni fotogramma l'intero buffer viene ridisegnato su un canvas 2D, un rettangolo pieno per ogni cella viva, con una risoluzione interna adattata alla densità di pixel del dispositivo.",
          "Se il tuo sistema chiede di ridurre il movimento, il simulatore non parte da solo: vedi il seme come immagine fissa e puoi farlo avanzare con Passo oppure premere Riproduci tu stesso. In pausa il ciclo di animazione non gira affatto.",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "Perché la Regola 110 è speciale",
        paragraphs: [
          "La maggior parte delle regole si estingue, si congela o si ripete. Alcune, come la Regola 30, sembrano rumore per sempre. La Regola 110 sta nel mezzo: uno sfondo regolare e ripetitivo attraverso cui strutture localizzate viaggiano a velocità diverse e si scontrano. Matthew Cook ha dimostrato, in un lavoro pubblicato nel 2004, che le collisioni di questi alianti possono emulare un sistema di tag ciclico, e poiché tali sistemi possono simulare qualsiasi macchina di Turing, la Regola 110 è Turing-completa. La sua immagine speculare, la Regola 124, si comporta allo stesso modo con sinistra e destra scambiate.",
        ],
      },
    ],
    experimentsHeading: "Prova così",
    experiments: [
      {
        title: "Dai spazio alla Regola 110",
        text: "Seleziona la Regola 110, scegli il seme «bordo» e imposta la velocità a 60. Il motivo si allarga verso sinistra di una cella per generazione. Cerca la trama di sfondo che si ripete e le strutture oblique che la attraversano e si scontrano: sono gli alianti che la dimostrazione di Cook usa come segnali.",
      },
      {
        title: "Un frattale da una sola cella",
        text: "Seleziona la Regola 90 con il seme «singola». Ogni cella diventa lo XOR delle sue due vicine, e compare un triangolo di Sierpiński. Intorno alla generazione 120 i suoi due bordi si incontrano sul lato opposto dell'anello di 240 celle e il motivo comincia a interferire con sé stesso.",
      },
      {
        title: "Ordine e caos fianco a fianco",
        text: "Seleziona la Regola 30 con il seme «singola». Un lato del triangolo si assesta in strisce diagonali regolari mentre l'altro sembra casuale, anche se la regola è un solo byte e il caso non c'entra per niente.",
      },
      {
        title: "Ingorghi che si sciolgono",
        text: "Seleziona la Regola 184 con il seme «casuale». Leggi le celle vive come automobili che avanzano di una cella verso destra ogni volta che la cella davanti è libera. Gli ingorghi arretrano, verso sinistra. Poiché il seme riempie solo il 45 per cento circa della strada, meno della metà delle celle, di solito gli ingorghi si sciolgono finché ogni auto viaggia liberamente.",
      },
    ],
  },
  pt: {
    metaDescription:
      "Corre a Regra 110 e os 256 autómatos celulares elementares ao vivo: escolhe regra, semente e velocidade e vê como um único byte chega a ser Turing-completo.",
    heading: "Como funciona este simulador",
    intro:
      "Cada linha horizontal de píxeis é uma fila de 240 células, cada uma ligada ou desligada. Cada nova geração é calculada a partir da fila anterior e acrescentada em baixo, pelo que a imagem se lê de cima para baixo como uma linha do tempo: a geração mais antiga em cima, o presente em baixo. Quando há 360 gerações no ecrã, a mais antiga sai de cena. Uma única regra fixa decide cada célula olhando apenas para três: a própria célula e as suas duas vizinhas. A Regra 110 é a mais famosa destas regras, porque este rabiscar puramente local consegue, em princípio, executar qualquer computação.",
    sections: [
      {
        heading: "Oito vizinhanças, um byte",
        paragraphs: [
          "Três células, cada uma ligada ou desligada, podem formar 2³ = 8 padrões. Uma regra diz simplesmente, para cada um desses oito padrões, se a célula do meio fica ligada na geração seguinte. Oito respostas de sim ou não fazem um byte, por isso existem exatamente 2⁸ = 256 regras deste tipo, e a numeração de Stephen Wolfram lê esse byte como um número binário. Escreve os padrões de 111 até 000 e anota as respostas: para a Regra 110 são 0, 1, 1, 0, 1, 1, 1, 0, ou seja, 01101110 em binário, isto é, 110. Por palavras, uma célula só fica desligada no passo seguinte se a sua vizinhança era 111, 100 ou 000.",
          "O indicador por cima do canvas mostra a regra atual nesta forma binária, e a fórmula abaixo exprime a mesma consulta: a vizinhança é lida como um número k de 0 a 7, e o novo estado é o bit k do número da regra.",
        ],
        formula:
          "s_i^{t+1} = \\left\\lfloor \\frac{N}{2^{\\,4 s_{i-1}^{t} + 2 s_i^{t} + s_{i+1}^{t}}} \\right\\rfloor \\bmod 2",
      },
      {
        heading: "O que fazem os controlos",
        paragraphs: [
          "Os oito botões sob «Regras célebres» carregam regras com um comportamento característico: a 110, a caótica Regra 30, a Regra 90 (o triângulo de Sierpiński), o modelo de tráfego da Regra 184, e ainda a 54, a 73, a 150 e a 22. O cursor por baixo alcança qualquer regra de 0 a 255. Escolher uma regra recomeça sempre a partir da semente atual, de modo que comparas as regras sobre a mesma fila inicial.",
          "A semente define essa fila inicial. Com «única» liga-se a célula do meio. Com «borda» liga-se a segunda célula a contar da direita, o que deixa quase toda a largura para os padrões que crescem para a esquerda, como o da Regra 110. Com «aleatória» cada célula é ligada de forma independente com probabilidade 0,45.",
          "Reproduzir e Pausa fazem o que dizem; Passo acrescenta exatamente uma geração e só funciona em pausa. «Limpar» volta a semear a fila e põe a zero o contador de gerações. O cursor de velocidade vai de 1 a 120 gerações por segundo e começa em 20, e os botões de cor mudam apenas a forma como as células vivas são pintadas.",
        ],
      },
      {
        heading: "Como está construído",
        paragraphs: [
          "Cada geração é um Uint8Array de 240 células, e o histórico é um array dessas filas. Calcular a fila seguinte exige uma única passagem: para cada célula, as três vizinhas são empacotadas num número de 0 a 7, e o novo estado é esse bit do número da regra. As extremidades esquerda e direita estão unidas, por isso a fila é na verdade um anel e os padrões que saem por um lado regressam pelo outro.",
          "A temporização está desacoplada do ecrã. Cada fotograma da animação soma o tempo decorrido a um acumulador e acrescenta tantas gerações quantas couberem à velocidade escolhida, de modo que 120 gerações por segundo são mesmo 120, até num ecrã de 60 Hz. Depois de cada fotograma, todo o buffer é redesenhado num canvas 2D, um retângulo preenchido por célula viva, com uma resolução interna ajustada à densidade de píxeis do dispositivo.",
          "Se o teu sistema pedir movimento reduzido, o simulador não arranca sozinho: vês a semente como imagem parada e podes avançá-la com Passo ou carregar tu em Reproduzir. Em pausa, o ciclo de animação não corre de todo.",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "Porque é que a Regra 110 é especial",
        paragraphs: [
          "A maioria das regras extingue-se, congela ou repete-se. Algumas, como a Regra 30, parecem ruído para sempre. A Regra 110 fica a meio caminho: um fundo regular e repetitivo pelo qual estruturas localizadas viajam a velocidades diferentes e colidem. Matthew Cook mostrou, num trabalho publicado em 2004, que as colisões destes planadores conseguem emular um sistema de etiquetas cíclico, e como tais sistemas conseguem simular qualquer máquina de Turing, a Regra 110 é Turing-completa. A sua imagem espelhada, a Regra 124, comporta-se da mesma maneira com esquerda e direita trocadas.",
        ],
      },
    ],
    experimentsHeading: "Experimenta",
    experiments: [
      {
        title: "Dá espaço à Regra 110",
        text: "Seleciona a Regra 110, escolhe a semente «borda» e põe a velocidade em 60. O padrão alastra para a esquerda uma célula por geração. Procura a textura de fundo que se repete e as estruturas inclinadas que a atravessam e colidem: são os planadores que a demonstração de Cook usa como sinais.",
      },
      {
        title: "Um fractal a partir de uma célula",
        text: "Seleciona a Regra 90 com a semente «única». Cada célula passa a ser o XOR das suas duas vizinhas, e surge um triângulo de Sierpiński. Por volta da geração 120, as suas duas arestas encontram-se do outro lado do anel de 240 células e o padrão começa a interferir consigo próprio.",
      },
      {
        title: "Ordem e caos lado a lado",
        text: "Seleciona a Regra 30 com a semente «única». Um lado do triângulo assenta em riscas diagonais regulares enquanto o outro parece aleatório, embora a regra seja um único byte e não haja nenhum acaso envolvido.",
      },
      {
        title: "Engarrafamentos que se dissolvem",
        text: "Seleciona a Regra 184 com a semente «aleatória». Lê as células vivas como carros que avançam uma célula para a direita sempre que a célula à frente está livre. Os engarrafamentos deslocam-se para trás, para a esquerda. Como a semente preenche apenas cerca de 45 por cento da estrada, menos de metade das células, os engarrafamentos costumam dissolver-se até todos os carros circularem livremente.",
      },
    ],
  },
  sv: {
    metaDescription:
      "Kör Regel 110 och alla 256 elementära cellulära automater live: välj regel, frö och hastighet och se hur en enda byte regler kan bli Turingkomplett.",
    heading: "Så fungerar simulatorn",
    intro:
      "Varje vågrät pixelrad är en rad med 240 celler, var och en antingen på eller av. Varje ny generation räknas fram ur raden före och läggs till längst ner, så bilden läses uppifrån och ner som en tidslinje: den äldsta generationen överst, nuet nederst. När 360 generationer syns på skärmen rullar den äldsta ut ur bild. En enda fast regel avgör varje cell genom att bara titta på tre celler: cellen själv och dess två grannar. Regel 110 är den mest berömda av de här reglerna, eftersom detta rent lokala klottrande i princip kan utföra vilken beräkning som helst.",
    sections: [
      {
        heading: "Åtta grannskap, en byte",
        paragraphs: [
          "Tre celler som var och en är på eller av kan bilda 2³ = 8 mönster. En regel säger helt enkelt, för vart och ett av de åtta mönstren, om mittencellen är på i nästa generation. Åtta ja- eller nej-svar blir en byte, så det finns exakt 2⁸ = 256 sådana regler, och Stephen Wolframs numrering läser byten som ett binärt tal. Skriv upp mönstren från 111 ner till 000 och notera svaren: för Regel 110 är de 0, 1, 1, 0, 1, 1, 1, 0, alltså 01101110 binärt, det vill säga 110. Med ord: en cell är av i nästa steg bara om dess grannskap var 111, 100 eller 000.",
          "Visningen ovanför canvasen visar den aktuella regeln i den här binära formen, och formeln nedan uttrycker samma uppslagning: grannskapet läses som ett tal k från 0 till 7, och det nya tillståndet är bit k i regelnumret.",
        ],
        formula:
          "s_i^{t+1} = \\left\\lfloor \\frac{N}{2^{\\,4 s_{i-1}^{t} + 2 s_i^{t} + s_{i+1}^{t}}} \\right\\rfloor \\bmod 2",
      },
      {
        heading: "Vad reglagen gör",
        paragraphs: [
          "De åtta knapparna under ”Berömda regler” laddar regler med utmärkande beteende: 110, den kaotiska Regel 30, Regel 90 (Sierpińskitriangeln), trafikmodellen Regel 184 samt 54, 73, 150 och 22. Reglaget under når varje regel från 0 till 255. När du väljer en regel startar simuleringen alltid om från det aktuella fröet, så du jämför reglerna på samma startrad.",
          "Fröet bestämmer den startraden. ”enkel” slår på den enda cellen i mitten. ”kant” slår på den andra cellen från höger, vilket ger mönster som växer åt vänster, som Regel 110, nästan hela bredden att utvecklas på. ”slumpmässig” slår på varje cell oberoende av de andra med sannolikheten 0,45.",
          "Spela och Paus gör vad de heter; Steg lägger till exakt en generation och fungerar bara i pausläge. ”Rensa” sår raden på nytt och nollställer generationsräknaren. Hastighetsreglaget går från 1 till 120 generationer per sekund och börjar på 20, och färgknapparna ändrar bara hur levande celler målas.",
        ],
      },
      {
        heading: "Så är den byggd",
        paragraphs: [
          "Varje generation är en Uint8Array med 240 celler, och historiken är en array av sådana rader. Nästa rad beräknas i ett enda svep: för varje cell packas de tre grannarna ihop till ett tal från 0 till 7, och det nya tillståndet är den biten i regelnumret. Vänster och höger ände sitter ihop, så raden är egentligen en ring, och mönster som lämnar ena sidan kommer tillbaka på den andra.",
          "Tidtagningen är frikopplad från skärmen. Varje animationsbildruta lägger den förflutna tiden till en ackumulator och lägger till så många generationer som ryms vid vald hastighet, så 120 generationer per sekund verkligen är 120 även på en skärm med 60 Hz. Efter varje bildruta målas hela bufferten om på en 2D-canvas, en fylld rektangel per levande cell, med en intern upplösning anpassad till enhetens pixeltäthet.",
          "Om ditt system ber om minskad rörelse startar simulatorn inte av sig själv: du ser fröet som en stillbild och kan stega fram det med Steg eller själv trycka på Spela. I pausläge körs animationsloopen inte alls.",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "Varför Regel 110 är speciell",
        paragraphs: [
          "De flesta regler dör ut, fryser eller upprepar sig. Några, som Regel 30, ser ut som brus i all evighet. Regel 110 ligger mittemellan: en regelbunden, upprepad bakgrund genom vilken lokala strukturer färdas med olika hastighet och kolliderar. Matthew Cook visade, i ett arbete som publicerades 2004, att kollisioner mellan dessa glidare kan efterlikna ett cykliskt tag-system, och eftersom sådana system kan simulera vilken Turingmaskin som helst är Regel 110 Turingkomplett. Dess spegelbild, Regel 124, beter sig likadant med vänster och höger ombytta.",
        ],
      },
    ],
    experimentsHeading: "Prova det här",
    experiments: [
      {
        title: "Ge Regel 110 plats att växa",
        text: "Välj Regel 110, välj fröet ”kant” och sätt hastigheten till 60. Mönstret breder ut sig åt vänster med en cell per generation. Leta efter den upprepade bakgrundstexturen och de sneda strukturerna som rör sig genom den och kolliderar: det är glidarna som Cooks bevis använder som signaler.",
      },
      {
        title: "En fraktal ur en enda cell",
        text: "Välj Regel 90 med fröet ”enkel”. Varje cell blir XOR av sina två grannar, och en Sierpińskitriangel växer fram. Kring generation 120 möts dess två kanter på andra sidan av ringen med 240 celler, och mönstret börjar störa sig självt.",
      },
      {
        title: "Ordning och kaos sida vid sida",
        text: "Välj Regel 30 med fröet ”enkel”. Ena sidan av triangeln lägger sig i regelbundna diagonala ränder medan den andra ser slumpmässig ut, trots att regeln är en enda byte och ingen slump är inblandad.",
      },
      {
        title: "Köer som löses upp",
        text: "Välj Regel 184 med fröet ”slumpmässig”. Läs levande celler som bilar som kör en cell åt höger så fort cellen framför är ledig. Köerna driver bakåt, åt vänster. Eftersom fröet bara fyller ungefär 45 procent av vägen, färre än hälften av cellerna, löses köerna oftast upp tills varje bil kör fritt.",
      },
    ],
  },
  no: {
    metaDescription:
      "Kjør Regel 110 og alle 256 elementære cellulære automater direkte: velg regel, frø og hastighet, og se hvordan én eneste byte kan bli Turing-komplett.",
    heading: "Slik fungerer simulatoren",
    intro:
      "Hver vannrette piksellinje er en rad med 240 celler, hver av dem enten på eller av. Hver ny generasjon regnes ut fra raden før og legges til nederst, så bildet leses ovenfra og ned som en tidslinje: den eldste generasjonen øverst, nåtiden nederst. Når 360 generasjoner er på skjermen, ruller den eldste ut av bildet. Én fast regel avgjør hver celle ved å se på bare tre celler: cellen selv og de to naboene. Regel 110 er den mest berømte av disse reglene, fordi denne rent lokale rablingen i prinsippet kan utføre en hvilken som helst beregning.",
    sections: [
      {
        heading: "Åtte nabolag, én byte",
        paragraphs: [
          "Tre celler som hver er på eller av, kan danne 2³ = 8 mønstre. En regel sier ganske enkelt, for hvert av de åtte mønstrene, om den midterste cellen er på i neste generasjon. Åtte ja- eller nei-svar blir én byte, så det finnes nøyaktig 2⁸ = 256 slike regler, og Stephen Wolframs nummerering leser byten som et binært tall. Skriv opp mønstrene fra 111 ned til 000 og noter svarene: for Regel 110 er de 0, 1, 1, 0, 1, 1, 1, 0, altså 01101110 binært, det vil si 110. Med ord: en celle er av i neste steg bare hvis nabolaget var 111, 100 eller 000.",
          "Visningen over lerretet viser den gjeldende regelen i denne binære formen, og formelen under uttrykker det samme oppslaget: nabolaget leses som et tall k fra 0 til 7, og den nye tilstanden er bit k i regelnummeret.",
        ],
        formula:
          "s_i^{t+1} = \\left\\lfloor \\frac{N}{2^{\\,4 s_{i-1}^{t} + 2 s_i^{t} + s_{i+1}^{t}}} \\right\\rfloor \\bmod 2",
      },
      {
        heading: "Hva kontrollene gjør",
        paragraphs: [
          "De åtte knappene under «Berømte regler» laster regler med særpreget oppførsel: 110, den kaotiske Regel 30, Regel 90 (Sierpiński-trekanten), trafikkmodellen Regel 184, pluss 54, 73, 150 og 22. Glidebryteren under når hver regel fra 0 til 255. Når du velger en regel, starter simuleringen alltid på nytt fra det gjeldende frøet, så du sammenligner reglene på samme startrad.",
          "Frøet bestemmer denne startraden. «enkel» slår på den ene cellen i midten. «kant» slår på den andre cellen fra høyre, noe som gir mønstre som vokser mot venstre, som Regel 110, nesten hele bredden å utvikle seg på. «tilfeldig» slår på hver celle uavhengig av de andre med sannsynlighet 0,45.",
          "Spill og Pause gjør det de sier; Steg legger til nøyaktig én generasjon og virker bare i pause. «Tøm» sår raden på nytt og nullstiller generasjonstelleren. Hastighetsbryteren går fra 1 til 120 generasjoner per sekund og starter på 20, og fargeknappene endrer bare hvordan levende celler males.",
        ],
      },
      {
        heading: "Slik er den bygget",
        paragraphs: [
          "Hver generasjon er en Uint8Array med 240 celler, og historikken er en array av slike rader. Neste rad beregnes i ett gjennomløp: for hver celle pakkes de tre naboene sammen til et tall fra 0 til 7, og den nye tilstanden er den biten i regelnummeret. Venstre og høyre ende er koblet sammen, så raden er egentlig en ring, og mønstre som går ut på den ene siden, kommer inn igjen på den andre.",
          "Tidsstyringen er frikoblet fra skjermen. Hver animasjonsrute legger den medgåtte tiden til en akkumulator og legger til så mange generasjoner som det er plass til ved valgt hastighet, så 120 generasjoner per sekund virkelig er 120, også på en skjerm med 60 Hz. Etter hver rute males hele bufferen på nytt på et 2D-lerret, ett fylt rektangel per levende celle, med en intern oppløsning tilpasset enhetens pikseltetthet.",
          "Hvis systemet ditt ber om redusert bevegelse, starter ikke simulatoren av seg selv: du ser frøet som et stillbilde og kan flytte det fram med Steg eller trykke på Spill selv. I pause kjører ikke animasjonsløkken i det hele tatt.",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "Hvorfor Regel 110 er spesiell",
        paragraphs: [
          "De fleste reglene dør ut, fryser eller gjentar seg. Noen få, som Regel 30, ser ut som støy for alltid. Regel 110 ligger midt imellom: en regelmessig, gjentatt bakgrunn som lokale strukturer beveger seg gjennom med ulik fart, og der de kolliderer. Matthew Cook viste, i et arbeid publisert i 2004, at kollisjoner mellom disse gliderne kan etterligne et syklisk tag-system, og siden slike systemer kan simulere en hvilken som helst Turing-maskin, er Regel 110 Turing-komplett. Speilbildet, Regel 124, oppfører seg likt med venstre og høyre byttet om.",
        ],
      },
    ],
    experimentsHeading: "Prøv dette",
    experiments: [
      {
        title: "Gi Regel 110 plass til å vokse",
        text: "Velg Regel 110, velg frøet «kant» og sett hastigheten til 60. Mønsteret brer seg mot venstre med én celle per generasjon. Se etter bakgrunnsteksturen som gjentar seg, og de skrå strukturene som beveger seg gjennom den og kolliderer: det er gliderne som Cooks bevis bruker som signaler.",
      },
      {
        title: "En fraktal fra én celle",
        text: "Velg Regel 90 med frøet «enkel». Hver celle blir XOR av de to naboene sine, og en Sierpiński-trekant kommer til syne. Rundt generasjon 120 møtes de to kantene på den andre siden av ringen med 240 celler, og mønsteret begynner å forstyrre seg selv.",
      },
      {
        title: "Orden og kaos side om side",
        text: "Velg Regel 30 med frøet «enkel». Den ene siden av trekanten faller til ro i regelmessige diagonale striper, mens den andre ser tilfeldig ut, selv om regelen er én eneste byte og ingen tilfeldighet er involvert.",
      },
      {
        title: "Køer som løser seg opp",
        text: "Velg Regel 184 med frøet «tilfeldig». Les levende celler som biler som kjører én celle mot høyre så snart cellen foran er ledig. Køene driver bakover, mot venstre. Fordi frøet bare fyller omtrent 45 prosent av veien, færre enn halvparten av cellene, løser køene seg som regel opp til hver bil kjører fritt.",
      },
    ],
  },
};
