import type { ExplorerGuide } from "./types";

// Numbers quoted here (200 x 200 grid, 100 states, k1/k2 range 1..8, g range
// 1..60, presets, speed default 1) match app/bzr/explorer/page.tsx; update
// both together.
const STEP_EXCERPT = `if (s === ILL) {
  next[idx] = 0;            // ill cells recover in one step
  continue;
}
// a = infected neighbours, b = ill neighbours,
// sum = states of all eight neighbours (healthy ones add 0)
if (s === 0) {
  const v = Math.floor(a / k1) + Math.floor(b / k2);
  next[idx] = v >= ILL ? ILL : v;
} else {
  const v = Math.floor((sum + s) / (a + b + 1)) + g;
  next[idx] = v >= ILL ? ILL : v;
}`;

// The case label is the only translated part of the update rule.
const hodgepodgeFormula = (otherwise: string) =>
  `s_{t+1} = \\begin{cases} 0 & s_t = 99 \\\\ \\lfloor a/k_1 \\rfloor + \\lfloor b/k_2 \\rfloor & s_t = 0 \\\\ \\lfloor \\tfrac{S}{a+b+1} \\rfloor + g & \\text{${otherwise}} \\end{cases}`;

export const BZR_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Grow Belousov-Zhabotinsky spirals in a hodgepodge cellular automaton: tune k₁, k₂ and g on a 200 × 200 grid and see how the excitable medium is coded.",
    heading: "How this explorer works",
    intro:
      "The field is a grid of 200 by 200 cells, each holding a whole number between 0 and 99. Every frame all cells look at their eight neighbours and update at the same time, following three short rules. Nothing diffuses, yet with the default settings the noise organises itself within a few hundred iterations into rotating spirals that look strikingly like the Belousov-Zhabotinsky reaction in a Petri dish. The spirals belong to excitable media in general, not to one set of molecules.",
    sections: [
      {
        heading: "Healthy, infected, ill",
        paragraphs: [
          "The rule is known as the hodgepodge machine, a cellular automaton described by Martin Gerhardt and Heike Schuster as a toy model of an oscillating chemical reaction. It borrows the vocabulary of an epidemic. State 0 is healthy, the top state 99 is ill, and everything in between is infected to some degree. A healthy cell catches the infection from its neighbours, an infected cell gets steadily worse, and an ill cell recovers completely in a single step and becomes healthy again.",
          "That loop (rest, rising excitation, collapse, rest) is the same cycle a patch of BZ solution runs through: the catalyst sits in its reduced state, a threshold is crossed, oxidation runs away, and the system resets. Because every cell drags its neighbours along, the cycle becomes a travelling wave. Wherever a wavefront breaks, its free end curls up, and that curl is the spiral.",
        ],
        formula:
          "s_{t+1} = \\begin{cases} 0 & s_t = 99 \\\\ \\lfloor a/k_1 \\rfloor + \\lfloor b/k_2 \\rfloor & s_t = 0 \\\\ \\lfloor \\tfrac{S}{a+b+1} \\rfloor + g & \\text{otherwise} \\end{cases}",
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "In the formula, a counts infected neighbours, b counts ill neighbours and S is the sum of the states of the cell and its eight neighbours, so an infected cell moves to the average of all sick cells around it, ill ones included, plus g. Results above 99 are capped at 99. k₁ (infected weight, 1 to 8) divides the infected count when a healthy cell decides whether to catch the infection; k₂ (ill weight, 1 to 8) does the same for ill neighbours. With k₁ = k₂ = 8 a healthy cell only reacts when all eight neighbours are infected or all eight are ill.",
          "g (reaction rate, 1 to 60) is how much an infected cell worsens per step on top of the local average. It sets the length of the excited phase: a cell needs roughly 99 / g steps to climb from first infection to ill. In test runs from a random start the average was 3.7 steps with g = 28 and a little over 8 with g = 12.",
          "The four presets are Classic spirals (k₁ = 3, k₂ = 3, g = 28, the default), Tight scrolls (3, 2, 36), Target rings (2, 2, 40) and Turbulent (3, 3, 40). Restart fills the grid with uniform random states; Seed broken wave starts from an empty grid with a half-line of ill cells flanked by rows at states 60 and 20, a deliberate broken wavefront that sends out waves in a mirror-symmetric pattern. Speed sets how many generations run per animation frame, from 1 to 8.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "The grid is a Uint8Array of 40 000 bytes, one byte per cell, and a second array of the same size receives the next generation. After each step the two references are swapped, so no memory is allocated while the animation runs. The edges wrap around (the grid is a torus), so waves leaving on the right come back on the left.",
          "Drawing uses a 100-entry RGBA lookup table built once per colour map. Each frame copies four bytes per cell from the table into an ImageData buffer and puts it onto a 200 by 200 canvas, which CSS scales up with pixelated rendering so each cell stays a crisp square. The default speed is one generation per frame on purpose: at higher rates the colour fronts can flicker fast enough to be uncomfortable. If your system asks for reduced motion, the loop is never started and you see a single still frame; Restart and Seed broken wave repaint that frame.",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "Why spirals win",
        paragraphs: [
          "A spiral is a self-sustaining wave source. Its tip keeps rotating around a small core, sending a new wavefront out on every turn, and nothing outside has to feed it. Expanding rings, by contrast, need a cell that keeps firing in the centre. Colliding wavefronts annihilate each other, so the source that fires more often pushes the collision line further and further away from itself and gradually takes over the territory.",
        ],
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "A broken wave",
        text: "Choose Classic spirals and press Seed broken wave. A lens of wavefronts spreads from the line, wraps around the edges, and after roughly 300 iterations the whole grid is covered with spirals, arranged mirror-symmetrically because the seed is symmetric.",
      },
      {
        title: "Stretch the excited phase",
        text: "Keep k₁ = k₂ = 3, set g to 12 and restart. The bands of colour are wider, because each cell spends more steps climbing towards the ill state, and spirals take much longer to appear (in test runs sometimes more than 1500 iterations). At g = 6 no spirals formed at all: large patches flash almost in unison.",
      },
      {
        title: "Make the medium stubborn",
        text: "Set k₁ and k₂ to 4 or more, keep g = 28 and restart from random. Healthy cells now need at least four infected or four ill neighbours before they react. In test runs no wave survived: the whole field was healthy, and stayed dark, within 50 iterations.",
      },
      {
        title: "Rings or turbulence",
        text: "Load Target rings (k₁ = 2, k₂ = 2, g = 40) and restart from random. In test runs the field settled into a stable pattern of concentric rings around many centres. Then load Turbulent: raising k₁ and k₂ to 3 at the same g gave a restless, fine-grained field with no lasting structure.",
      },
    ],
  },
  de: {
    metaDescription:
      "Belousov-Zhabotinsky-Spiralen im Hodgepodge-Zellularautomaten: k₁, k₂ und g auf einem 200 × 200 Gitter einstellen und sehen, wie das Modell gebaut ist.",
    heading: "So funktioniert dieser Explorer",
    intro:
      "Das Feld ist ein Gitter aus 200 mal 200 Zellen, und jede speichert eine ganze Zahl zwischen 0 und 99. In jedem Frame schauen alle Zellen gleichzeitig auf ihre acht Nachbarinnen und folgen drei kurzen Regeln. Nichts diffundiert, und trotzdem ordnet sich das Rauschen mit den Voreinstellungen innerhalb von ein paar hundert Iterationen zu rotierenden Spiralen, die der Belousov-Zhabotinsky-Reaktion in der Petrischale verblüffend ähneln. Die Spiralen gehören zu erregbaren Medien ganz allgemein, nicht zu einer bestimmten Mischung von Molekülen.",
    sections: [
      {
        heading: "Gesund, infiziert, krank",
        paragraphs: [
          "Die Regel heißt Hodgepodge-Maschine, ein Zellularautomat, den Martin Gerhardt und Heike Schuster als Spielzeugmodell einer oszillierenden chemischen Reaktion beschrieben haben. Sie leiht sich die Sprache einer Epidemie. Zustand 0 ist gesund, der höchste Zustand 99 ist krank, alles dazwischen ist mehr oder weniger infiziert. Eine gesunde Zelle steckt sich bei ihren Nachbarinnen an, eine infizierte wird stetig kränker, und eine kranke Zelle erholt sich in einem einzigen Schritt vollständig und ist wieder gesund.",
          "Dieser Kreislauf (Ruhe, steigende Erregung, Zusammenbruch, Ruhe) ist derselbe, den ein Fleck BZ-Lösung durchläuft: Der Katalysator liegt reduziert vor, eine Schwelle wird überschritten, die Oxidation geht durch, und das System setzt sich zurück. Weil jede Zelle ihre Nachbarschaft mitzieht, wird aus dem Kreislauf eine wandernde Welle. Wo eine Wellenfront reißt, rollt sich ihr freies Ende ein, und diese Einrollung ist die Spirale.",
        ],
        formula:
          "s_{t+1} = \\begin{cases} 0 & s_t = 99 \\\\ \\lfloor a/k_1 \\rfloor + \\lfloor b/k_2 \\rfloor & s_t = 0 \\\\ \\lfloor \\tfrac{S}{a+b+1} \\rfloor + g & \\text{sonst} \\end{cases}",
      },
      {
        heading: "Was die Regler bewirken",
        paragraphs: [
          "In der Formel zählt a die infizierten und b die kranken Nachbarinnen, S ist die Summe der Zustände der Zelle und ihrer acht Nachbarinnen. Eine infizierte Zelle springt also auf den Mittelwert aller nicht gesunden Zellen um sie herum, die kranken eingeschlossen, plus g. Ergebnisse über 99 werden auf 99 gekappt. k₁ (Gewicht der Infizierten, 1 bis 8) teilt die Zahl der infizierten Nachbarinnen, wenn eine gesunde Zelle entscheidet, ob sie sich ansteckt; k₂ (Gewicht der Kranken, 1 bis 8) macht dasselbe für die kranken. Bei k₁ = k₂ = 8 reagiert eine gesunde Zelle erst, wenn alle acht Nachbarinnen infiziert oder alle acht krank sind.",
          "g (Reaktionsrate, 1 bis 60) gibt an, wie viel kränker eine infizierte Zelle pro Schritt zusätzlich zum lokalen Mittelwert wird. Damit legt g die Dauer der Erregung fest: Eine Zelle braucht ungefähr 99 / g Schritte von der ersten Ansteckung bis zum Kranksein. In Testläufen mit zufälligem Start waren es im Mittel 3,7 Schritte bei g = 28 und etwas über 8 bei g = 12.",
          "Die vier Presets sind Classic spirals (k₁ = 3, k₂ = 3, g = 28, die Voreinstellung), Tight scrolls (3, 2, 36), Target rings (2, 2, 40) und Turbulent (3, 3, 40). Restart füllt das Gitter mit gleichverteilten Zufallszuständen. Seed broken wave startet dagegen mit einem leeren Gitter und einer Halbgeraden aus kranken Zellen, flankiert von Reihen mit den Zuständen 60 und 20: eine absichtlich gerissene Wellenfront, die Wellen in einem spiegelsymmetrischen Muster aussendet. Speed legt fest, wie viele Generationen pro Animationsframe laufen, von 1 bis 8.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Das Gitter ist ein Uint8Array mit 40 000 Bytes, ein Byte pro Zelle, und ein zweites Array derselben Größe nimmt die nächste Generation auf. Nach jedem Schritt werden die beiden Referenzen getauscht, während der Animation wird also kein Speicher angelegt. Die Ränder sind verbunden (das Gitter ist ein Torus), Wellen, die rechts hinauslaufen, kommen also links wieder herein.",
          "Gezeichnet wird über eine RGBA-Tabelle mit 100 Einträgen, die pro Farbskala einmal berechnet wird. Jeder Frame kopiert vier Bytes pro Zelle aus der Tabelle in einen ImageData-Puffer und legt ihn auf ein 200 mal 200 Pixel großes Canvas, das CSS mit pixeliger Darstellung hochskaliert, damit jede Zelle ein scharfes Quadrat bleibt. Die Voreinstellung von einer Generation pro Frame ist Absicht: Bei höheren Raten können die Farbfronten so schnell flackern, dass es unangenehm wird. Wünscht dein System reduzierte Bewegung, startet die Schleife gar nicht, und du siehst ein einzelnes Standbild; Restart und Seed broken wave zeichnen es neu.",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "Warum Spiralen gewinnen",
        paragraphs: [
          "Eine Spirale ist eine Wellenquelle, die sich selbst erhält. Ihre Spitze kreist um einen kleinen Kern und schickt bei jeder Umdrehung eine neue Front los, ohne dass von außen etwas nachhelfen muss. Wachsende Ringe brauchen dagegen eine Zelle in der Mitte, die immer wieder zündet. Prallen zwei Fronten zusammen, löschen sie sich gegenseitig aus. Die Quelle, die öfter zündet, schiebt die Kollisionslinie deshalb immer weiter von sich weg und erobert nach und nach das Gebiet.",
        ],
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Eine gerissene Welle",
        text: "Wähle Classic spirals und drück Seed broken wave. Von der Linie breitet sich eine Linse aus Wellenfronten aus, läuft über die Ränder, und nach rund 300 Iterationen ist das ganze Gitter mit Spiralen bedeckt, spiegelsymmetrisch angeordnet, weil der Startzustand symmetrisch ist.",
      },
      {
        title: "Die Erregung strecken",
        text: "Lass k₁ = k₂ = 3, stell g auf 12 und starte neu. Die Farbbänder sind breiter, weil jede Zelle mehr Schritte braucht, um krank zu werden, und Spiralen entstehen viel später (in Testläufen teils erst nach mehr als 1500 Iterationen). Bei g = 6 bildeten sich gar keine Spiralen: Große Flecken blinken fast im Gleichtakt.",
      },
      {
        title: "Ein störrisches Medium",
        text: "Stell k₁ und k₂ auf 4 oder mehr, lass g = 28 und starte zufällig neu. Gesunde Zellen brauchen jetzt mindestens vier infizierte oder vier kranke Nachbarinnen, bevor sie reagieren. In Testläufen überlebte keine Welle: Nach höchstens 50 Iterationen war das ganze Feld gesund und blieb dunkel.",
      },
      {
        title: "Ringe oder Turbulenz",
        text: "Lade Target rings (k₁ = 2, k₂ = 2, g = 40) und starte zufällig neu. In Testläufen stellte sich ein stabiles Muster aus konzentrischen Ringen um viele Zentren ein. Lade danach Turbulent: Mit k₁ und k₂ auf 3 bei gleichem g entstand ein unruhiges, feinkörniges Feld ohne bleibende Struktur.",
      },
    ],
  },
  es: {
    metaDescription:
      "Haz crecer espirales de Belousov-Zhabotinsky en un autómata celular hodgepodge: ajusta k₁, k₂ y g en una cuadrícula de 200 × 200 y mira cómo está programado.",
    heading: "Cómo funciona este explorador",
    intro:
      "El campo es una cuadrícula de 200 por 200 células, y cada una guarda un número entero entre 0 y 99. En cada fotograma todas las células miran a sus ocho vecinas y se actualizan a la vez, siguiendo tres reglas breves. Nada se difunde y, sin embargo, con los ajustes por defecto el ruido se organiza en unos pocos cientos de iteraciones en espirales giratorias que se parecen de forma asombrosa a la reacción de Belousov-Zhabotinsky en una placa de Petri. Las espirales son propias de los medios excitables en general, no de un conjunto concreto de moléculas.",
    sections: [
      {
        heading: "Sana, infectada, enferma",
        paragraphs: [
          "La regla se conoce como máquina hodgepodge, un autómata celular que Martin Gerhardt y Heike Schuster describieron como modelo de juguete de una reacción química oscilante. Toma prestado el vocabulario de una epidemia. El estado 0 es sano, el estado más alto, 99, es enfermo, y todo lo que queda en medio está infectado en mayor o menor grado. Una célula sana se contagia de sus vecinas, una célula infectada empeora sin pausa, y una célula enferma se recupera por completo en un solo paso y vuelve a estar sana.",
          "Ese bucle (reposo, excitación creciente, colapso, reposo) es el mismo ciclo que recorre una porción de disolución BZ: el catalizador está en su estado reducido, se cruza un umbral, la oxidación se dispara y el sistema se reinicia. Como cada célula arrastra a sus vecinas, el ciclo se convierte en una onda viajera. Allí donde un frente de onda se rompe, su extremo libre se enrosca, y ese rizo es la espiral.",
        ],
        formula: hodgepodgeFormula("en otro caso"),
      },
      {
        heading: "Qué hacen los controles",
        paragraphs: [
          "En la fórmula, a cuenta las vecinas infectadas, b las vecinas enfermas y S es la suma de los estados de la célula y de sus ocho vecinas, de modo que una célula infectada pasa a la media de todas las células no sanas que la rodean, enfermas incluidas, más g. Los resultados por encima de 99 se recortan a 99. k₁ («infected weight», de 1 a 8) divide el número de infectadas cuando una célula sana decide si se contagia; k₂ («ill weight», de 1 a 8) hace lo mismo con las vecinas enfermas. Con k₁ = k₂ = 8, una célula sana solo reacciona cuando sus ocho vecinas están infectadas o las ocho están enfermas.",
          "g («reaction rate», de 1 a 60) indica cuánto empeora una célula infectada en cada paso, además de la media local. Fija la duración de la fase excitada: una célula necesita unos 99 / g pasos para subir desde el primer contagio hasta el estado enfermo. En ejecuciones de prueba con inicio aleatorio, la media fue de 3,7 pasos con g = 28 y de algo más de 8 con g = 12.",
          "Los cuatro preajustes son «Classic spirals» (k₁ = 3, k₂ = 3, g = 28, el valor por defecto), «Tight scrolls» (3, 2, 36), «Target rings» (2, 2, 40) y «Turbulent» (3, 3, 40). «Restart» llena la cuadrícula de estados aleatorios uniformes; «Seed broken wave» parte de una cuadrícula vacía con una semirrecta de células enfermas flanqueada por filas en los estados 60 y 20, un frente de onda roto a propósito que emite ondas en un patrón con simetría especular. «Speed» fija cuántas generaciones se calculan por fotograma de animación, de 1 a 8.",
        ],
      },
      {
        heading: "Cómo está construido",
        paragraphs: [
          "La cuadrícula es un Uint8Array de 40 000 bytes, un byte por célula, y un segundo array del mismo tamaño recibe la generación siguiente. Tras cada paso se intercambian las dos referencias, así que no se reserva memoria mientras corre la animación. Los bordes están conectados (la cuadrícula es un toro), de modo que las ondas que salen por la derecha vuelven a entrar por la izquierda.",
          "Para dibujar se usa una tabla de consulta RGBA de 100 entradas que se construye una vez por cada mapa de colores. Cada fotograma copia cuatro bytes por célula de la tabla a un búfer ImageData y lo coloca en un lienzo de 200 por 200, que el CSS amplía con renderizado pixelado para que cada célula siga siendo un cuadrado nítido. La velocidad por defecto es de una generación por fotograma a propósito: a ritmos mayores, los frentes de color pueden parpadear tan deprisa que resulta molesto. Si tu sistema pide movimiento reducido, el bucle no llega a arrancar y ves un único fotograma fijo; «Restart» y «Seed broken wave» vuelven a pintar ese fotograma.",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "Por qué ganan las espirales",
        paragraphs: [
          "Una espiral es una fuente de ondas que se sostiene sola. Su punta sigue girando alrededor de un núcleo pequeño y lanza un nuevo frente de onda en cada vuelta, sin que nada de fuera tenga que alimentarla. Los anillos en expansión, en cambio, necesitan en el centro una célula que se dispare una y otra vez. Los frentes de onda que chocan se aniquilan entre sí, así que la fuente que dispara más a menudo empuja la línea de choque cada vez más lejos de sí misma y poco a poco se queda con el territorio.",
        ],
      },
    ],
    experimentsHeading: "Prueba esto",
    experiments: [
      {
        title: "Una onda rota",
        text: "Elige «Classic spirals» y pulsa «Seed broken wave». Desde la línea se extiende una lente de frentes de onda que da la vuelta por los bordes, y tras unas 300 iteraciones toda la cuadrícula queda cubierta de espirales, dispuestas con simetría especular porque la semilla es simétrica.",
      },
      {
        title: "Alarga la fase excitada",
        text: "Mantén k₁ = k₂ = 3, pon g en 12 y reinicia. Las bandas de color son más anchas, porque cada célula pasa más pasos subiendo hacia el estado enfermo, y las espirales tardan mucho más en aparecer (en ejecuciones de prueba, a veces más de 1500 iteraciones). Con g = 6 no se formó ninguna espiral: grandes manchas destellan casi al unísono.",
      },
      {
        title: "Vuelve terco el medio",
        text: "Pon k₁ y k₂ en 4 o más, mantén g = 28 y reinicia desde un estado aleatorio. Ahora las células sanas necesitan al menos cuatro vecinas infectadas o cuatro enfermas antes de reaccionar. En ejecuciones de prueba no sobrevivió ninguna onda: en menos de 50 iteraciones todo el campo estaba sano y se quedó oscuro.",
      },
      {
        title: "Anillos o turbulencia",
        text: "Carga «Target rings» (k₁ = 2, k₂ = 2, g = 40) y reinicia desde un estado aleatorio. En ejecuciones de prueba el campo se asentó en un patrón estable de anillos concéntricos alrededor de muchos centros. Carga después «Turbulent»: subir k₁ y k₂ a 3 con el mismo g dio un campo inquieto y de grano fino, sin estructura duradera.",
      },
    ],
  },
  fr: {
    metaDescription:
      "Fais naître des spirales de Belousov-Zhabotinsky dans un automate cellulaire hodgepodge : règle k₁, k₂ et g sur une grille 200 × 200 et découvre son code.",
    heading: "Comment fonctionne cet explorateur",
    intro:
      "Le champ est une grille de 200 cellules sur 200, chacune contenant un nombre entier compris entre 0 et 99. À chaque image, toutes les cellules regardent leurs huit voisines et se mettent à jour en même temps, selon trois règles très courtes. Rien ne diffuse, et pourtant, avec les réglages par défaut, le bruit s'organise en quelques centaines d'itérations en spirales tournantes qui ressemblent de façon frappante à la réaction de Belousov-Zhabotinsky dans une boîte de Petri. Les spirales appartiennent aux milieux excitables en général, pas à un jeu de molécules particulier.",
    sections: [
      {
        heading: "Saine, infectée, malade",
        paragraphs: [
          "Cette règle est connue sous le nom de machine hodgepodge, un automate cellulaire que Martin Gerhardt et Heike Schuster ont décrit comme modèle jouet d'une réaction chimique oscillante. Elle emprunte le vocabulaire d'une épidémie. L'état 0 est sain, l'état le plus élevé, 99, est malade, et tout ce qui se trouve entre les deux est plus ou moins infecté. Une cellule saine attrape l'infection auprès de ses voisines, une cellule infectée voit son état s'aggraver régulièrement, et une cellule malade guérit complètement en un seul pas et redevient saine.",
          "Cette boucle (repos, excitation croissante, effondrement, repos) est le cycle que parcourt une portion de solution BZ : le catalyseur se trouve dans son état réduit, un seuil est franchi, l'oxydation s'emballe, puis le système se réinitialise. Comme chaque cellule entraîne ses voisines, le cycle devient une onde progressive. Partout où un front d'onde se brise, son extrémité libre s'enroule, et cet enroulement, c'est la spirale.",
        ],
        formula: hodgepodgeFormula("sinon"),
      },
      {
        heading: "À quoi servent les commandes",
        paragraphs: [
          "Dans la formule, a compte les voisines infectées, b les voisines malades, et S est la somme des états de la cellule et de ses huit voisines : une cellule infectée passe donc à la moyenne de toutes les cellules non saines qui l'entourent, malades comprises, plus g. Les résultats supérieurs à 99 sont plafonnés à 99. k₁ (« infected weight », de 1 à 8) divise le nombre de voisines infectées quand une cellule saine décide si elle attrape l'infection ; k₂ (« ill weight », de 1 à 8) fait de même pour les voisines malades. Avec k₁ = k₂ = 8, une cellule saine ne réagit que si ses huit voisines sont infectées ou si toutes les huit sont malades.",
          "g (« reaction rate », de 1 à 60) indique de combien l'état d'une cellule infectée s'aggrave à chaque pas, en plus de la moyenne locale. Il fixe la durée de la phase excitée : il faut à une cellule environ 99 / g pas pour grimper de la première infection à l'état malade. Lors d'essais à partir d'un état aléatoire, la moyenne était de 3,7 pas avec g = 28 et d'un peu plus de 8 avec g = 12.",
          "Les quatre préréglages sont « Classic spirals » (k₁ = 3, k₂ = 3, g = 28, la valeur par défaut), « Tight scrolls » (3, 2, 36), « Target rings » (2, 2, 40) et « Turbulent » (3, 3, 40). « Restart » remplit la grille d'états aléatoires uniformes ; « Seed broken wave » part d'une grille vide avec une demi-droite de cellules malades, bordée de rangées dans les états 60 et 20, un front d'onde volontairement brisé qui émet des ondes selon un motif à symétrie miroir. « Speed » fixe le nombre de générations calculées par image d'animation, de 1 à 8.",
        ],
      },
      {
        heading: "Comment c'est construit",
        paragraphs: [
          "La grille est un Uint8Array de 40 000 octets, un octet par cellule, et un second tableau de même taille reçoit la génération suivante. Après chaque pas, les deux références sont échangées, si bien qu'aucune mémoire n'est allouée pendant l'animation. Les bords se rejoignent (la grille est un tore) : les ondes qui sortent à droite reviennent par la gauche.",
          "Le dessin s'appuie sur une table de correspondance RGBA de 100 entrées, construite une fois par palette de couleurs. Chaque image copie quatre octets par cellule depuis la table vers un tampon ImageData et le pose sur un canevas de 200 sur 200, que le CSS agrandit avec un rendu pixellisé pour que chaque cellule reste un carré net. La vitesse par défaut est volontairement d'une génération par image : à des cadences plus élevées, les fronts colorés peuvent clignoter assez vite pour devenir désagréables. Si ton système demande une réduction des animations, la boucle n'est jamais lancée et tu vois une seule image fixe ; « Restart » et « Seed broken wave » redessinent cette image.",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "Pourquoi les spirales l'emportent",
        paragraphs: [
          "Une spirale est une source d'ondes qui s'entretient toute seule. Sa pointe tourne sans cesse autour d'un petit cœur et envoie un nouveau front d'onde à chaque tour, sans que rien d'extérieur ait besoin de l'alimenter. Les anneaux en expansion, eux, ont besoin d'une cellule qui se déclenche encore et encore au centre. Les fronts d'onde qui se rencontrent s'annihilent : la source qui se déclenche le plus souvent repousse donc la ligne de collision toujours plus loin d'elle et s'empare peu à peu du territoire.",
        ],
      },
    ],
    experimentsHeading: "À essayer",
    experiments: [
      {
        title: "Une onde brisée",
        text: "Choisis « Classic spirals » et appuie sur « Seed broken wave ». Une lentille de fronts d'onde s'étend à partir de la ligne, fait le tour par les bords, et après environ 300 itérations toute la grille est couverte de spirales, disposées en symétrie miroir parce que la configuration de départ est symétrique.",
      },
      {
        title: "Allonge la phase excitée",
        text: "Garde k₁ = k₂ = 3, règle g sur 12 et relance. Les bandes de couleur sont plus larges, car chaque cellule met plus de pas à grimper vers l'état malade, et les spirales mettent bien plus longtemps à apparaître (lors des essais, parfois plus de 1 500 itérations). Avec g = 6, aucune spirale ne s'est formée : de grandes plages clignotent presque à l'unisson.",
      },
      {
        title: "Rends le milieu récalcitrant",
        text: "Règle k₁ et k₂ sur 4 ou plus, garde g = 28 et relance à partir d'un état aléatoire. Les cellules saines ont maintenant besoin d'au moins quatre voisines infectées ou quatre voisines malades avant de réagir. Lors des essais, aucune onde n'a survécu : en moins de 50 itérations, tout le champ était sain et il est resté sombre.",
      },
      {
        title: "Anneaux ou turbulence",
        text: "Charge « Target rings » (k₁ = 2, k₂ = 2, g = 40) et relance à partir d'un état aléatoire. Lors des essais, le champ s'est stabilisé en un motif d'anneaux concentriques autour de nombreux centres. Charge ensuite « Turbulent » : en passant k₁ et k₂ à 3 pour le même g, on obtient un champ agité, à grain fin, sans structure durable.",
      },
    ],
  },
  it: {
    metaDescription:
      "Spirali di Belousov-Zhabotinsky in un automa cellulare hodgepodge: regola k₁, k₂ e g su una griglia 200 × 200 e scopri com'è programmato il mezzo eccitabile.",
    heading: "Come funziona questo esploratore",
    intro:
      "Il campo è una griglia di 200 per 200 celle, ognuna delle quali contiene un numero intero compreso tra 0 e 99. A ogni fotogramma tutte le celle guardano le otto vicine e si aggiornano nello stesso istante, seguendo tre regole brevi. Nulla si diffonde, eppure con le impostazioni predefinite il rumore si organizza nel giro di qualche centinaio di iterazioni in spirali rotanti che somigliano in modo sorprendente alla reazione di Belousov-Zhabotinsky in una capsula di Petri. Le spirali appartengono ai mezzi eccitabili in generale, non a un particolare insieme di molecole.",
    sections: [
      {
        heading: "Sana, infetta, malata",
        paragraphs: [
          "La regola è nota come macchina hodgepodge, un automa cellulare che Martin Gerhardt e Heike Schuster hanno descritto come modello giocattolo di una reazione chimica oscillante. Prende in prestito il vocabolario di un'epidemia. Lo stato 0 è sano, lo stato più alto, 99, è malato, e tutto ciò che sta in mezzo è infetto in qualche misura. Una cella sana prende l'infezione dalle vicine, una cella infetta peggiora costantemente, e una cella malata guarisce del tutto in un solo passo e torna sana.",
          "Questo ciclo (riposo, eccitazione crescente, crollo, riposo) è lo stesso che percorre una porzione di soluzione BZ: il catalizzatore si trova nello stato ridotto, viene superata una soglia, l'ossidazione parte a valanga e il sistema si azzera. Poiché ogni cella trascina con sé le vicine, il ciclo diventa un'onda viaggiante. Ovunque un fronte d'onda si spezzi, la sua estremità libera si arriccia, e quel ricciolo è la spirale.",
        ],
        formula: hodgepodgeFormula("altrimenti"),
      },
      {
        heading: "Che cosa fanno i controlli",
        paragraphs: [
          "Nella formula, a conta le vicine infette, b le vicine malate e S è la somma degli stati della cella e delle sue otto vicine: una cella infetta passa quindi alla media di tutte le celle non sane che la circondano, malate comprese, più g. I risultati superiori a 99 vengono limitati a 99. k₁ («infected weight», da 1 a 8) divide il numero delle infette quando una cella sana decide se prendere l'infezione; k₂ («ill weight», da 1 a 8) fa lo stesso per le vicine malate. Con k₁ = k₂ = 8 una cella sana reagisce solo quando tutte e otto le vicine sono infette oppure tutte e otto sono malate.",
          "g («reaction rate», da 1 a 60) indica di quanto peggiora una cella infetta a ogni passo, oltre alla media locale. Stabilisce la durata della fase eccitata: a una cella servono circa 99 / g passi per salire dalla prima infezione allo stato malato. Nelle prove con partenza casuale la media è stata di 3,7 passi con g = 28 e di poco più di 8 con g = 12.",
          "I quattro preset sono «Classic spirals» (k₁ = 3, k₂ = 3, g = 28, quello predefinito), «Tight scrolls» (3, 2, 36), «Target rings» (2, 2, 40) e «Turbulent» (3, 3, 40). «Restart · random» riempie la griglia di stati casuali uniformi; «Seed broken wave» parte da una griglia vuota con una semiretta di celle malate affiancata da righe negli stati 60 e 20, un fronte d'onda spezzato di proposito che emette onde in una configurazione a simmetria speculare. «Speed» stabilisce quante generazioni vengono calcolate per ogni fotogramma dell'animazione, da 1 a 8.",
        ],
      },
      {
        heading: "Com'è costruito",
        paragraphs: [
          "La griglia è un Uint8Array di 40.000 byte, un byte per cella, e un secondo array della stessa dimensione riceve la generazione successiva. Dopo ogni passo i due riferimenti vengono scambiati, così durante l'animazione non viene allocata memoria. I bordi sono collegati (la griglia è un toro), perciò le onde che escono a destra rientrano da sinistra.",
          "Il disegno usa una tabella di ricerca RGBA di 100 voci, costruita una volta per ogni mappa di colori. Ogni fotogramma copia quattro byte per cella dalla tabella in un buffer ImageData e lo mette su un canvas di 200 per 200, che il CSS ingrandisce con resa a pixel netti, in modo che ogni cella resti un quadrato nitido. La velocità predefinita è volutamente di una generazione per fotogramma: a ritmi più alti i fronti di colore possono sfarfallare così in fretta da risultare fastidiosi. Se il tuo sistema chiede di ridurre il movimento, il ciclo non viene mai avviato e vedi un unico fotogramma fermo; «Restart · random» e «Seed broken wave» ridisegnano quel fotogramma.",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "Perché vincono le spirali",
        paragraphs: [
          "Una spirale è una sorgente di onde che si autoalimenta. La sua punta continua a ruotare attorno a un piccolo nucleo e a ogni giro lancia un nuovo fronte d'onda, senza che nulla dall'esterno debba alimentarla. Gli anelli in espansione, invece, hanno bisogno di una cella al centro che continui ad attivarsi. I fronti d'onda che si scontrano si annichilano a vicenda, quindi la sorgente che si attiva più spesso spinge la linea di collisione sempre più lontano da sé e a poco a poco conquista il territorio.",
        ],
      },
    ],
    experimentsHeading: "Prova così",
    experiments: [
      {
        title: "Un'onda spezzata",
        text: "Scegli «Classic spirals» e premi «Seed broken wave». Dalla linea si allarga una lente di fronti d'onda che fa il giro passando per i bordi, e dopo circa 300 iterazioni l'intera griglia è coperta di spirali, disposte in simmetria speculare perché la configurazione iniziale è simmetrica.",
      },
      {
        title: "Allunga la fase eccitata",
        text: "Tieni k₁ = k₂ = 3, porta g a 12 e riavvia. Le bande di colore sono più larghe, perché ogni cella impiega più passi a salire verso lo stato malato, e le spirali ci mettono molto di più a comparire (nelle prove a volte oltre 1500 iterazioni). Con g = 6 non si è formata alcuna spirale: grandi chiazze lampeggiano quasi all'unisono.",
      },
      {
        title: "Rendi il mezzo testardo",
        text: "Porta k₁ e k₂ a 4 o più, tieni g = 28 e riavvia da uno stato casuale. Ora le celle sane hanno bisogno di almeno quattro vicine infette o quattro malate prima di reagire. Nelle prove nessuna onda è sopravvissuta: entro 50 iterazioni l'intero campo era sano ed è rimasto scuro.",
      },
      {
        title: "Anelli o turbolenza",
        text: "Carica «Target rings» (k₁ = 2, k₂ = 2, g = 40) e riavvia da uno stato casuale. Nelle prove il campo si è assestato in una configurazione stabile di anelli concentrici attorno a molti centri. Poi carica «Turbulent»: portare k₁ e k₂ a 3 con lo stesso g ha dato un campo irrequieto, a grana fine, senza strutture durature.",
      },
    ],
  },
  pt: {
    metaDescription:
      "Faz crescer espirais de Belousov-Zhabotinsky num autómato celular hodgepodge: ajusta k₁, k₂ e g numa grelha de 200 × 200 e vê como o modelo está programado.",
    heading: "Como funciona este explorador",
    intro:
      "O campo é uma grelha de 200 por 200 células, e cada uma guarda um número inteiro entre 0 e 99. Em cada fotograma, todas as células olham para as suas oito vizinhas e atualizam-se ao mesmo tempo, seguindo três regras curtas. Nada se difunde e, no entanto, com os valores predefinidos o ruído organiza-se em poucas centenas de iterações em espirais rotativas que se parecem de forma impressionante com a reação de Belousov-Zhabotinsky numa placa de Petri. As espirais pertencem aos meios excitáveis em geral, não a um conjunto específico de moléculas.",
    sections: [
      {
        heading: "Saudável, infetada, doente",
        paragraphs: [
          "A regra é conhecida como máquina hodgepodge, um autómato celular que Martin Gerhardt e Heike Schuster descreveram como modelo de brincar de uma reação química oscilante. Vai buscar o vocabulário a uma epidemia. O estado 0 é saudável, o estado mais alto, 99, é doente, e tudo o que fica no meio está infetado em maior ou menor grau. Uma célula saudável apanha a infeção das vizinhas, uma célula infetada piora continuamente, e uma célula doente recupera por completo num único passo e volta a ficar saudável.",
          "Esse ciclo (repouso, excitação crescente, colapso, repouso) é o mesmo que uma porção de solução BZ percorre: o catalisador está no estado reduzido, um limiar é ultrapassado, a oxidação dispara e o sistema reinicia-se. Como cada célula arrasta as vizinhas consigo, o ciclo torna-se uma onda progressiva. Onde quer que uma frente de onda se quebre, a sua extremidade livre enrola-se, e esse caracol é a espiral.",
        ],
        formula: hodgepodgeFormula("caso contrário"),
      },
      {
        heading: "O que fazem os controlos",
        paragraphs: [
          "Na fórmula, a conta as vizinhas infetadas, b as vizinhas doentes e S é a soma dos estados da célula e das suas oito vizinhas, pelo que uma célula infetada passa para a média de todas as células não saudáveis à sua volta, doentes incluídas, mais g. Os resultados acima de 99 são limitados a 99. k₁ («infected weight», de 1 a 8) divide o número de infetadas quando uma célula saudável decide se apanha a infeção; k₂ («ill weight», de 1 a 8) faz o mesmo para as vizinhas doentes. Com k₁ = k₂ = 8, uma célula saudável só reage quando as oito vizinhas estão infetadas ou as oito estão doentes.",
          "g («reaction rate», de 1 a 60) indica quanto piora uma célula infetada em cada passo, para além da média local. Define a duração da fase excitada: uma célula precisa de cerca de 99 / g passos para subir da primeira infeção até ao estado doente. Em execuções de teste com início aleatório, a média foi de 3,7 passos com g = 28 e de pouco mais de 8 com g = 12.",
          "As quatro predefinições são «Classic spirals» (k₁ = 3, k₂ = 3, g = 28, a predefinida), «Tight scrolls» (3, 2, 36), «Target rings» (2, 2, 40) e «Turbulent» (3, 3, 40). «Restart» enche a grelha de estados aleatórios uniformes; «Seed broken wave» parte de uma grelha vazia com uma semirreta de células doentes ladeada por filas nos estados 60 e 20, uma frente de onda quebrada de propósito que emite ondas num padrão com simetria de espelho. «Speed» define quantas gerações são calculadas por fotograma de animação, de 1 a 8.",
        ],
      },
      {
        heading: "Como está construído",
        paragraphs: [
          "A grelha é um Uint8Array de 40 000 bytes, um byte por célula, e um segundo array do mesmo tamanho recebe a geração seguinte. Depois de cada passo as duas referências são trocadas, por isso não se reserva memória enquanto a animação corre. As margens estão ligadas (a grelha é um toro), pelo que as ondas que saem pela direita voltam a entrar pela esquerda.",
          "O desenho usa uma tabela de consulta RGBA com 100 entradas, construída uma vez por cada mapa de cores. Cada fotograma copia quatro bytes por célula da tabela para um buffer ImageData e coloca-o num canvas de 200 por 200, que o CSS amplia com renderização pixelizada para que cada célula continue a ser um quadrado nítido. A velocidade predefinida é de uma geração por fotograma de propósito: a ritmos mais altos, as frentes de cor podem tremeluzir tão depressa que se torna desconfortável. Se o teu sistema pedir movimento reduzido, o ciclo nunca chega a arrancar e vês um único fotograma parado; «Restart» e «Seed broken wave» voltam a pintar esse fotograma.",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "Porque ganham as espirais",
        paragraphs: [
          "Uma espiral é uma fonte de ondas que se sustenta a si própria. A sua ponta continua a rodar em torno de um pequeno núcleo e lança uma nova frente de onda a cada volta, sem que nada de fora tenha de a alimentar. Os anéis em expansão, pelo contrário, precisam de uma célula no centro que dispare vezes sem conta. As frentes de onda que colidem aniquilam-se uma à outra, por isso a fonte que dispara mais vezes empurra a linha de colisão para cada vez mais longe de si e, aos poucos, toma conta do território.",
        ],
      },
    ],
    experimentsHeading: "Experimenta isto",
    experiments: [
      {
        title: "Uma onda quebrada",
        text: "Escolhe «Classic spirals» e carrega em «Seed broken wave». Uma lente de frentes de onda espalha-se a partir da linha, dá a volta pelas margens, e ao fim de cerca de 300 iterações toda a grelha está coberta de espirais, dispostas com simetria de espelho porque a configuração inicial é simétrica.",
      },
      {
        title: "Estica a fase excitada",
        text: "Mantém k₁ = k₂ = 3, põe g em 12 e reinicia. As faixas de cor são mais largas, porque cada célula passa mais passos a subir até ao estado doente, e as espirais demoram muito mais a aparecer (em execuções de teste, por vezes mais de 1500 iterações). Com g = 6 não se formou nenhuma espiral: grandes manchas piscam quase em uníssono.",
      },
      {
        title: "Torna o meio teimoso",
        text: "Põe k₁ e k₂ em 4 ou mais, mantém g = 28 e reinicia a partir de um estado aleatório. Agora as células saudáveis precisam de pelo menos quatro vizinhas infetadas ou quatro doentes antes de reagirem. Em execuções de teste nenhuma onda sobreviveu: em menos de 50 iterações todo o campo estava saudável e ficou escuro.",
      },
      {
        title: "Anéis ou turbulência",
        text: "Carrega «Target rings» (k₁ = 2, k₂ = 2, g = 40) e reinicia a partir de um estado aleatório. Em execuções de teste, o campo estabilizou num padrão de anéis concêntricos em torno de muitos centros. Depois carrega «Turbulent»: subir k₁ e k₂ para 3 com o mesmo g deu um campo inquieto, de grão fino, sem estrutura duradoura.",
      },
    ],
  },
  sv: {
    metaDescription:
      "Låt Belousov-Zhabotinskij-spiraler växa fram i en cellulär automat av hodgepodge-typ: ställ in k₁, k₂ och g på ett rutnät med 200 × 200 celler och se koden.",
    heading: "Så fungerar den här utforskaren",
    intro:
      "Fältet är ett rutnät med 200 gånger 200 celler, och varje cell innehåller ett heltal mellan 0 och 99. I varje bildruta tittar alla celler på sina åtta grannar och uppdateras samtidigt enligt tre korta regler. Ingenting diffunderar, och ändå organiserar sig bruset med standardinställningarna inom några hundra iterationer till roterande spiraler som är slående lika Belousov-Zhabotinskij-reaktionen i en petriskål. Spiralerna hör till excitabla medier i allmänhet, inte till en viss uppsättning molekyler.",
    sections: [
      {
        heading: "Frisk, smittad, sjuk",
        paragraphs: [
          "Regeln kallas hodgepodge-maskinen, en cellulär automat som Martin Gerhardt och Heike Schuster beskrev som en leksaksmodell av en oscillerande kemisk reaktion. Den lånar ordförrådet från en epidemi. Tillstånd 0 är friskt, det högsta tillståndet 99 är sjukt, och allt däremellan är mer eller mindre smittat. En frisk cell blir smittad av sina grannar, en smittad cell blir stadigt sämre, och en sjuk cell tillfrisknar helt i ett enda steg och blir frisk igen.",
          "Den slingan (vila, stigande excitation, kollaps, vila) är samma cykel som en fläck BZ-lösning går igenom: katalysatorn befinner sig i sitt reducerade tillstånd, en tröskel passeras, oxidationen skenar och systemet återställs. Eftersom varje cell drar med sig sina grannar blir cykeln en vandrande våg. Överallt där en vågfront bryts rullar den fria änden ihop sig, och den krökningen är spiralen.",
        ],
        formula: hodgepodgeFormula("annars"),
      },
      {
        heading: "Vad reglagen gör",
        paragraphs: [
          "I formeln räknar a de smittade grannarna och b de sjuka, och S är summan av tillstånden hos cellen och dess åtta grannar. En smittad cell går alltså till medelvärdet av alla icke friska celler omkring sig, de sjuka inräknade, plus g. Resultat över 99 kapas till 99. k₁ (”infected weight”, 1 till 8) delar antalet smittade när en frisk cell avgör om den ska bli smittad, och k₂ (”ill weight”, 1 till 8) gör samma sak för sjuka grannar. Med k₁ = k₂ = 8 reagerar en frisk cell bara när alla åtta grannar är smittade eller alla åtta är sjuka.",
          "g (”reaction rate”, 1 till 60) är hur mycket sämre en smittad cell blir per steg utöver det lokala medelvärdet. Det bestämmer hur lång den exciterade fasen är: en cell behöver ungefär 99 / g steg för att klättra från första smittan till sjuk. I testkörningar från en slumpmässig start var medelvärdet 3,7 steg med g = 28 och lite över 8 med g = 12.",
          "De fyra förvalen är ”Classic spirals” (k₁ = 3, k₂ = 3, g = 28, standardvalet), ”Tight scrolls” (3, 2, 36), ”Target rings” (2, 2, 40) och ”Turbulent” (3, 3, 40). ”Restart” fyller rutnätet med likformigt slumpade tillstånd. ”Seed broken wave” utgår från ett tomt rutnät med en halvlinje av sjuka celler, kantad av rader i tillstånden 60 och 20: en avsiktligt bruten vågfront som sänder ut vågor i ett spegelsymmetriskt mönster. ”Speed” anger hur många generationer som körs per animationsbildruta, från 1 till 8.",
        ],
      },
      {
        heading: "Hur den är byggd",
        paragraphs: [
          "Rutnätet är en Uint8Array på 40\u00a0000 byte, en byte per cell, och en andra array av samma storlek tar emot nästa generation. Efter varje steg byter de två referenserna plats, så inget minne allokeras medan animationen går. Kanterna sitter ihop (rutnätet är en torus), så vågor som går ut till höger kommer tillbaka in från vänster.",
          "Ritningen använder en RGBA-uppslagstabell med 100 poster som byggs en gång per färgskala. Varje bildruta kopierar fyra byte per cell från tabellen till en ImageData-buffert och lägger den på en canvas på 200 gånger 200 pixlar, som CSS skalar upp med pixlad rendering så att varje cell förblir en skarp kvadrat. Standardhastigheten är med flit en generation per bildruta: vid högre takt kan färgfronterna flimra så snabbt att det blir obehagligt. Om ditt system ber om minskad rörelse startas slingan aldrig och du ser en enda stillbild. ”Restart” och ”Seed broken wave” ritar om den bilden.",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "Varför spiralerna vinner",
        paragraphs: [
          "En spiral är en vågkälla som håller sig själv vid liv. Spetsen fortsätter att rotera kring en liten kärna och skickar ut en ny vågfront för varje varv, utan att något utifrån behöver mata den. Växande ringar behöver däremot en cell i mitten som tänder om och om igen. Vågfronter som kolliderar utplånar varandra, så den källa som tänder oftast skjuter kollisionslinjen allt längre bort från sig och tar gradvis över territoriet.",
        ],
      },
    ],
    experimentsHeading: "Prova det här",
    experiments: [
      {
        title: "En bruten våg",
        text: "Välj ”Classic spirals” och tryck på ”Seed broken wave”. En lins av vågfronter breder ut sig från linjen och går runt via kanterna, och efter ungefär 300 iterationer är hela rutnätet täckt av spiraler, spegelsymmetriskt ordnade eftersom startmönstret är symmetriskt.",
      },
      {
        title: "Dra ut den exciterade fasen",
        text: "Behåll k₁ = k₂ = 3, sätt g till 12 och starta om. Färgbanden är bredare, eftersom varje cell behöver fler steg för att klättra mot det sjuka tillståndet, och det dröjer mycket längre innan spiraler dyker upp (i testkörningar ibland mer än 1500 iterationer). Vid g = 6 bildades inga spiraler alls: stora fläckar blinkar nästan i takt.",
      },
      {
        title: "Gör mediet envist",
        text: "Sätt k₁ och k₂ till 4 eller mer, behåll g = 28 och starta om från ett slumpat läge. Friska celler behöver nu minst fyra smittade eller fyra sjuka grannar innan de reagerar. I testkörningar överlevde ingen våg: inom 50 iterationer var hela fältet friskt, och det förblev mörkt.",
      },
      {
        title: "Ringar eller turbulens",
        text: "Ladda ”Target rings” (k₁ = 2, k₂ = 2, g = 40) och starta om från ett slumpat läge. I testkörningar stabiliserades fältet i ett mönster av koncentriska ringar kring många centrum. Ladda sedan ”Turbulent”: när k₁ och k₂ höjdes till 3 med samma g blev resultatet ett oroligt, finkornigt fält utan bestående struktur.",
      },
    ],
  },
  no: {
    metaDescription:
      "La Belousov-Zhabotinskij-spiraler vokse i en hodgepodge-automat: Still inn k₁, k₂ og g på 200 × 200 celler og se hvordan det eksiterbare mediet er kodet.",
    heading: "Slik fungerer denne utforskeren",
    intro:
      "Feltet er et rutenett med 200 ganger 200 celler, og hver celle inneholder et heltall mellom 0 og 99. I hvert bilde ser alle cellene på de åtte naboene sine og oppdateres samtidig etter tre korte regler. Ingenting diffunderer, og likevel organiserer støyen seg med standardinnstillingene i løpet av noen hundre iterasjoner til roterende spiraler som ligner påfallende på Belousov-Zhabotinskij-reaksjonen i en petriskål. Spiralene hører til eksiterbare medier generelt, ikke til ett bestemt sett med molekyler.",
    sections: [
      {
        heading: "Frisk, smittet, syk",
        paragraphs: [
          "Regelen er kjent som hodgepodge-maskinen, en cellulær automat som Martin Gerhardt og Heike Schuster beskrev som en leketøysmodell av en oscillerende kjemisk reaksjon. Den låner ordforrådet fra en epidemi. Tilstand 0 er frisk, den høyeste tilstanden 99 er syk, og alt imellom er smittet i større eller mindre grad. En frisk celle blir smittet av naboene sine, en smittet celle blir stadig verre, og en syk celle blir helt frisk igjen i ett eneste steg.",
          "Den sløyfen (hvile, stigende eksitasjon, kollaps, hvile) er den samme syklusen som en flekk BZ-løsning går gjennom: Katalysatoren er i redusert tilstand, en terskel passeres, oksidasjonen løper løpsk, og systemet nullstilles. Fordi hver celle drar naboene med seg, blir syklusen til en vandrende bølge. Overalt der en bølgefront brytes, krøller den frie enden seg sammen, og den krøllen er spiralen.",
        ],
        formula: hodgepodgeFormula("ellers"),
      },
      {
        heading: "Hva kontrollene gjør",
        paragraphs: [
          "I formelen teller a de smittede naboene og b de syke, og S er summen av tilstandene til cellen og de åtte naboene. En smittet celle går altså til gjennomsnittet av alle celler rundt seg som ikke er friske, de syke medregnet, pluss g. Resultater over 99 kappes til 99. k₁ («infected weight», 1 til 8) deler antallet smittede når en frisk celle avgjør om den blir smittet, og k₂ («ill weight», 1 til 8) gjør det samme for syke naboer. Med k₁ = k₂ = 8 reagerer en frisk celle bare når alle åtte naboene er smittet eller alle åtte er syke.",
          "g («reaction rate», 1 til 60) er hvor mye verre en smittet celle blir per steg, i tillegg til det lokale gjennomsnittet. Den bestemmer lengden på den eksiterte fasen: En celle trenger omtrent 99 / g steg for å klatre fra første smitte til syk. I testkjøringer fra en tilfeldig start var gjennomsnittet 3,7 steg med g = 28 og litt over 8 med g = 12.",
          "De fire forhåndsvalgene er «Classic spirals» (k₁ = 3, k₂ = 3, g = 28, standardvalget), «Tight scrolls» (3, 2, 36), «Target rings» (2, 2, 40) og «Turbulent» (3, 3, 40). «Restart» fyller rutenettet med uniformt tilfeldige tilstander. «Seed broken wave» starter fra et tomt rutenett med en halvlinje av syke celler, flankert av rader i tilstandene 60 og 20: en bølgefront som er brutt med vilje og sender ut bølger i et speilsymmetrisk mønster. «Speed» bestemmer hvor mange generasjoner som kjøres per animasjonsbilde, fra 1 til 8.",
        ],
      },
      {
        heading: "Slik er den bygget",
        paragraphs: [
          "Rutenettet er en Uint8Array på 40\u00a0000 byte, én byte per celle, og en annen array av samme størrelse tar imot neste generasjon. Etter hvert steg bytter de to referansene plass, så det blir ikke allokert noe minne mens animasjonen går. Kantene henger sammen (rutenettet er en torus), så bølger som går ut til høyre, kommer inn igjen fra venstre.",
          "Tegningen bruker en RGBA-oppslagstabell med 100 oppføringer som bygges én gang per fargekart. Hvert bilde kopierer fire byte per celle fra tabellen til en ImageData-buffer og legger den på et lerret på 200 ganger 200 piksler, som CSS skalerer opp med pikselert gjengivelse slik at hver celle forblir et skarpt kvadrat. Standardfarten er med vilje én generasjon per bilde: Ved høyere takt kan fargefrontene flimre så raskt at det blir ubehagelig. Hvis systemet ditt ber om redusert bevegelse, startes sløyfen aldri, og du ser ett enkelt stillbilde. «Restart» og «Seed broken wave» tegner det bildet på nytt.",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "Hvorfor spiralene vinner",
        paragraphs: [
          "En spiral er en bølgekilde som holder seg selv i gang. Spissen fortsetter å rotere rundt en liten kjerne og sender ut en ny bølgefront for hver omdreining, uten at noe utenfra trenger å mate den. Ringer som utvider seg, trenger derimot en celle i midten som fyrer igjen og igjen. Bølgefronter som kolliderer, utsletter hverandre, så den kilden som fyrer oftest, skyver kollisjonslinjen stadig lenger bort fra seg og tar gradvis over territoriet.",
        ],
      },
    ],
    experimentsHeading: "Prøv dette",
    experiments: [
      {
        title: "En brutt bølge",
        text: "Velg «Classic spirals» og trykk på «Seed broken wave». En linse av bølgefronter brer seg ut fra linjen og går rundt via kantene, og etter omtrent 300 iterasjoner er hele rutenettet dekket av spiraler, speilsymmetrisk ordnet fordi startmønsteret er symmetrisk.",
      },
      {
        title: "Strekk den eksiterte fasen",
        text: "Behold k₁ = k₂ = 3, sett g til 12 og start på nytt. Fargebåndene er bredere, fordi hver celle bruker flere steg på å klatre mot den syke tilstanden, og det tar mye lengre tid før spiralene dukker opp (i testkjøringer noen ganger mer enn 1500 iterasjoner). Med g = 6 ble det ikke dannet noen spiraler i det hele tatt: Store flekker blinker nesten i takt.",
      },
      {
        title: "Gjør mediet sta",
        text: "Sett k₁ og k₂ til 4 eller mer, behold g = 28 og start på nytt fra en tilfeldig tilstand. Friske celler trenger nå minst fire smittede eller fire syke naboer før de reagerer. I testkjøringer overlevde ingen bølge: Innen 50 iterasjoner var hele feltet friskt, og det forble mørkt.",
      },
      {
        title: "Ringer eller turbulens",
        text: "Last inn «Target rings» (k₁ = 2, k₂ = 2, g = 40) og start på nytt fra en tilfeldig tilstand. I testkjøringer falt feltet til ro i et stabilt mønster av konsentriske ringer rundt mange sentre. Last deretter inn «Turbulent»: Å øke k₁ og k₂ til 3 med samme g ga et urolig, finkornet felt uten varig struktur.",
      },
    ],
  },
};
