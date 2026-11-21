import type { ExplorerGuide } from "./types";

// Constants quoted here (default 150 walkers, 4000 cap, stickiness 0.1 to 1,
// cell 2 to 8 px, the 1200-step reduced-motion warm-up) match
// app/dla/explorer/page.tsx; update both together.
const WALK_EXCERPT = `for (let i = live.length - 1; i >= 0; i--) {
  const w = live[i];
  let nx = w.x;
  let ny = w.y;
  const r = Math.random();
  if (r < 0.25) nx++;
  else if (r < 0.5) nx--;
  else if (r < 0.75) ny++;
  else ny--;
  // ...clamp to the grid, refuse to step onto frozen cells...
  if (grid[ny * gridW + nx] === 0) { w.x = nx; w.y = ny; }
  if (hasStuckNeighbour(w.x, w.y) && Math.random() < p.stickiness) {
    const idx = w.y * gridW + w.x;
    if (grid[idx] === 0) { grid[idx] = age; stuckCount++; }
    live.splice(i, 1);
  }
}`;

// Same law as the EN formula, with the decimal comma the other locales use.
const DIMENSION_FORMULA_COMMA = "N(R) \\propto R^{D}, \\qquad D \\approx 1{,}71";

export const DLA_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Grow diffusion-limited aggregation live: random walkers stick to a seed and build fractal coral. Tune stickiness, walker count and seed shape on a square grid.",
    heading: "How this explorer works",
    intro:
      "Every bright cell on the canvas was once a wandering particle. Particles drift around the grid at random, one lattice step per frame, until they touch the growing cluster and freeze in place. Nobody tells the cluster to branch, yet within seconds it grows thin arms, the arms grow side arms, and the result looks like frost on a window or the branching of a river delta. The faint dots you see moving are the walkers still on their way.",
    sections: [
      {
        heading: "The idea: growth by random arrival",
        paragraphs: [
          "Diffusion-limited aggregation (DLA) was introduced by Thomas Witten and Leonard Sander in 1981. The rule is short: release a particle far away, let it do a random walk, and when it lands next to the cluster, attach it. Then release the next one. The name says what controls the speed: growth is limited by how fast particles diffuse to the surface, not by any chemistry at the surface.",
          "The branching comes from a screening effect. A random walker coming from outside is far more likely to bump into a tip that sticks out than to wander deep into a narrow gap between two arms. Tips therefore grow faster, which makes them stick out even more, while the fjords between them starve. Small random differences get amplified into the characteristic open, tree-like shape.",
          "That shape is a fractal. If you count the particles N inside a circle of radius R around the seed, you do not get the R² you would expect for a filled disc. For DLA in the plane, N grows roughly like R raised to a power of about 1.71, a fractal dimension between a line (1) and a filled area (2).",
        ],
        formula: "N(R) \\propto R^{D}, \\qquad D \\approx 1.71",
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "Seed decides where growth starts. Point puts a single frozen cell in the centre and launches walkers from a circle near the edge of the canvas. Line freezes the whole second row from the bottom and drops walkers in at the top edge, like a crystal growing upwards from a surface. Ring draws a closed circle with a radius of one third of the shorter side and spawns walkers uniformly inside it, so the coral grows inwards from the wall.",
          "Walkers / frame sets how many particles are wandering at the same time (10 to 1000, default 150, hard cap 4000). More walkers means faster growth, because every walker moves once per frame. Stickiness (0.1 to 1.0, default 1.0) is the probability that a walker next to the cluster actually freezes; otherwise it keeps walking. Cell size (2 to 8 pixels, default 3) sets the grid resolution: smaller cells give a finer, larger lattice. Changing the seed or the cell size restarts the simulation.",
          "The four presets combine these: Centre seed with 80 walkers, Centre fast with 300, Bottom line with 200 and Ring seed with 200, all with stickiness 1. The colour swatches only change the tint.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "The world is a Uint8Array with one byte per grid cell: 0 means empty, any other value means frozen. Walkers are a plain array of integer coordinates. Each frame tops the pool back up to the target count, then moves every walker one step left, right, up or down with equal probability. Walkers are clamped at the canvas border, and a step onto a frozen cell is refused, so particles can never tunnel through an arm.",
          "After moving, the walker checks its four direct neighbours (the von Neumann neighbourhood). If one of them is frozen and a random number falls below the stickiness, the cell freezes and the walker is removed. The frozen value also records when the cell attached: it rises by four every 60 frames, and older cells are drawn slightly dimmer than newer ones, so the outer growth glows a little brighter.",
          "With reduced motion enabled the loop does not animate. The page runs 1200 simulation steps at once, paints a single still frame and shows the resulting cluster size.",
        ],
        code: WALK_EXCERPT,
      },
      {
        heading: "Why stickiness changes the shape",
        paragraphs: [
          "At stickiness 1 the first contact is final, so particles freeze on the outermost tip they touch and the screening effect is at full strength. Lower stickiness gives a walker several chances to slide along the surface and wander further into the gaps before it attaches. The fjords fill in, the arms get thicker, and the cluster becomes more compact. In the limit of very low stickiness, growth is no longer limited by diffusion at all, and the shape approaches a blob.",
        ],
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "Thin versus thick coral",
        text: "Run the point seed with stickiness 1.0, then reset and run it with stickiness 0.15. Compare the two when they reach a similar size: the second has thicker arms and far fewer empty fjords.",
      },
      {
        title: "A forest from a surface",
        text: "Choose the Bottom line preset. Many small trees start along the floor, but soon a few tall ones shade the rest and only they keep growing. It is the same screening effect, now acting between neighbours.",
      },
      {
        title: "Inside-out growth",
        text: "Pick the Ring seed. Walkers start inside the circle, so the arms point towards the centre and compete for the shrinking empty space in the middle.",
      },
      {
        title: "Resolution and patience",
        text: "Set cell size to 2 and walkers to 1000. The lattice now has many more cells, and the cluster shows finer, more detailed branching. At cell size 8 the same rule produces a chunky, pixel-art coral.",
      },
    ],
  },
  de: {
    metaDescription:
      "Diffusionsbegrenzte Aggregation live wachsen lassen: Zufallswanderer haften am Keim und bauen fraktale Korallen. Haftung, Wanderer-Zahl und Keimform einstellen.",
    heading: "So funktioniert dieser Explorer",
    intro:
      "Jede leuchtende Zelle auf dem Canvas war einmal ein umherirrendes Teilchen. Die Teilchen wandern zufällig über das Gitter, einen Schritt pro Frame, bis sie den wachsenden Cluster berühren und dort erstarren. Niemand sagt dem Cluster, dass er sich verzweigen soll, und trotzdem wachsen ihm nach wenigen Sekunden dünne Arme, an den Armen Seitenarme, und das Ganze sieht aus wie Eisblumen am Fenster oder wie ein verästeltes Flussdelta. Die blassen Punkte, die sich bewegen, sind die Wanderer, die noch unterwegs sind.",
    sections: [
      {
        heading: "Die Idee: Wachstum durch zufällige Ankunft",
        paragraphs: [
          "Die diffusionsbegrenzte Aggregation (DLA) haben Thomas Witten und Leonard Sander 1981 eingeführt. Die Regel ist kurz: Lass ein Teilchen weit weg los, lass es zufällig wandern, und sobald es neben dem Cluster landet, hängst du es an. Dann kommt das nächste. Der Name verrät, was das Tempo bestimmt: Das Wachstum ist dadurch begrenzt, wie schnell Teilchen zur Oberfläche diffundieren, nicht durch irgendeine Chemie an der Oberfläche.",
          "Die Verästelung entsteht durch Abschirmung. Ein Zufallswanderer von außen stößt viel eher an eine herausragende Spitze, als dass er tief in einen schmalen Spalt zwischen zwei Armen hineinfindet. Spitzen wachsen deshalb schneller, ragen dadurch noch weiter heraus, und die Fjorde dazwischen verhungern. Kleine zufällige Unterschiede schaukeln sich zur typischen offenen, baumartigen Form auf.",
          "Diese Form ist ein Fraktal. Zählst du die Teilchen N in einem Kreis mit Radius R um den Keim, bekommst du nicht das R², das eine gefüllte Scheibe hätte. Für DLA in der Ebene wächst N ungefähr wie R hoch 1,71, eine fraktale Dimension zwischen Linie (1) und Fläche (2).",
        ],
        formula: "N(R) \\propto R^{D}, \\qquad D \\approx 1{,}71",
      },
      {
        heading: "Was die Regler bewirken",
        paragraphs: [
          "Der Keim legt fest, wo das Wachstum beginnt. «Punkt» setzt eine einzelne erstarrte Zelle in die Mitte und schickt Wanderer von einem Kreis nahe dem Canvasrand los. «Linie» lässt die ganze zweitunterste Zeile erstarren und setzt Wanderer an der Oberkante ein, wie ein Kristall, der von einer Fläche nach oben wächst. «Ring» zeichnet einen geschlossenen Kreis mit einem Drittel der kürzeren Seite als Radius und verteilt die Wanderer gleichmäßig in seinem Inneren, die Koralle wächst also von der Wand nach innen.",
          "«Wanderer / Frame» bestimmt, wie viele Teilchen gleichzeitig unterwegs sind (10 bis 1000, Standard 150, harte Grenze 4000). Mehr Wanderer heißt schnelleres Wachstum, weil jeder Wanderer pro Frame einen Schritt macht. Die Haftung (0,1 bis 1,0, Standard 1,0) ist die Wahrscheinlichkeit, dass ein Wanderer neben dem Cluster tatsächlich erstarrt, sonst läuft er weiter. Die Zellgröße (2 bis 8 Pixel, Standard 3) legt die Gitterauflösung fest: Kleinere Zellen ergeben ein feineres, größeres Gitter. Wenn du Keim oder Zellgröße änderst, startet die Simulation neu.",
          "Die vier Voreinstellungen kombinieren das: Mittelkeim mit 80 Wanderern, «Mitte · schnell» mit 300, Bodenlinie mit 200 und Ringkeim mit 200, alle mit Haftung 1. Die Farbfelder ändern nur den Farbton.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Die Welt ist ein Uint8Array mit einem Byte pro Gitterzelle: 0 heißt leer, jeder andere Wert heißt erstarrt. Die Wanderer sind ein schlichtes Array ganzzahliger Koordinaten. Jeder Frame füllt den Vorrat auf die Zielzahl auf und bewegt dann jeden Wanderer mit gleicher Wahrscheinlichkeit einen Schritt nach links, rechts, oben oder unten. Am Canvasrand bleiben Wanderer hängen, und ein Schritt auf eine erstarrte Zelle wird verweigert, damit kein Teilchen durch einen Arm hindurchtunneln kann.",
          "Nach dem Schritt prüft der Wanderer seine vier direkten Nachbarn (die Von-Neumann-Nachbarschaft). Ist einer davon erstarrt und liegt eine Zufallszahl unter der Haftung, erstarrt die Zelle und der Wanderer verschwindet. Der gespeicherte Wert hält auch fest, wann die Zelle angedockt hat: Er steigt alle 60 Frames um vier, und ältere Zellen werden etwas blasser gezeichnet als neuere, deshalb leuchtet das äußere Wachstum ein wenig heller.",
          "Ist reduzierte Bewegung eingestellt, wird nicht animiert. Die Seite rechnet 1200 Simulationsschritte auf einmal, zeichnet ein einziges Standbild und zeigt die erreichte Clustergröße an.",
        ],
        code: WALK_EXCERPT,
      },
      {
        heading: "Warum die Haftung die Form verändert",
        paragraphs: [
          "Bei Haftung 1 ist der erste Kontakt endgültig. Teilchen erstarren an der äußersten Spitze, die sie berühren, und die Abschirmung wirkt mit voller Kraft. Geringere Haftung gibt einem Wanderer mehrere Chancen, an der Oberfläche entlangzurutschen und tiefer in die Spalten zu wandern, bevor er andockt. Die Fjorde füllen sich, die Arme werden dicker, der Cluster wird kompakter. Bei sehr geringer Haftung ist das Wachstum gar nicht mehr durch Diffusion begrenzt, und die Form nähert sich einem Klumpen.",
        ],
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Dünne gegen dicke Koralle",
        text: "Lass den Punktkeim mit Haftung 1,0 wachsen, setz dann zurück und wiederhole es mit Haftung 0,15. Vergleiche beide bei ähnlicher Größe: Die zweite hat dickere Arme und viel weniger leere Fjorde.",
      },
      {
        title: "Ein Wald auf einer Fläche",
        text: "Wähle die Voreinstellung Bodenlinie. Am Boden starten viele kleine Bäumchen, aber bald beschatten ein paar hohe den Rest, und nur sie wachsen weiter. Das ist dieselbe Abschirmung, jetzt zwischen Nachbarn.",
      },
      {
        title: "Wachstum von außen nach innen",
        text: "Nimm den Ringkeim. Die Wanderer starten im Kreis, deshalb zeigen die Arme zur Mitte und konkurrieren um den schrumpfenden freien Raum im Zentrum.",
      },
      {
        title: "Auflösung und Geduld",
        text: "Stell die Zellgröße auf 2 und die Wanderer auf 1000. Das Gitter hat jetzt viel mehr Zellen, und der Cluster zeigt feinere, detailliertere Verästelungen. Bei Zellgröße 8 ergibt dieselbe Regel eine klobige Koralle im Pixel-Art-Look.",
      },
    ],
  },
  es: {
    metaDescription:
      "Haz crecer en vivo la agregación limitada por difusión: caminantes aleatorios se pegan a una semilla y forman coral fractal. Ajusta adherencia y semilla.",
    heading: "Cómo funciona este explorador",
    intro:
      "Cada celda brillante del lienzo fue antes una partícula errante. Las partículas vagan al azar por la cuadrícula, un paso de retícula por fotograma, hasta que tocan el cúmulo en crecimiento y se quedan congeladas en el sitio. Nadie le dice al cúmulo que se ramifique y, sin embargo, en cuestión de segundos le salen brazos finos, a los brazos les salen brazos laterales, y el resultado recuerda a la escarcha en una ventana o a las ramificaciones de un delta fluvial. Los puntos tenues que ves moverse son los caminantes que aún están de camino.",
    sections: [
      {
        heading: "La idea: crecer por llegadas al azar",
        paragraphs: [
          "La agregación limitada por difusión (DLA, por sus siglas en inglés) fue introducida por Thomas Witten y Leonard Sander en 1981. La regla es breve: suelta una partícula lejos, deja que haga un paseo aleatorio y, cuando aterrice junto al cúmulo, pégala. Luego suelta la siguiente. El nombre dice qué controla la velocidad: el crecimiento está limitado por la rapidez con que las partículas se difunden hasta la superficie, no por ninguna química en la superficie.",
          "La ramificación nace de un efecto de apantallamiento. Un caminante aleatorio que llega desde fuera tiene muchas más probabilidades de tropezar con una punta que sobresale que de adentrarse en un hueco estrecho entre dos brazos. Por eso las puntas crecen más deprisa, lo que hace que sobresalgan todavía más, mientras los fiordos que quedan entre ellas pasan hambre. Pequeñas diferencias aleatorias se amplifican hasta dar la característica forma abierta y arbórea.",
          "Esa forma es un fractal. Si cuentas las partículas N dentro de un círculo de radio R alrededor de la semilla, no obtienes el R² que cabría esperar de un disco relleno. Para la DLA en el plano, N crece aproximadamente como R elevado a una potencia cercana a 1,71, una dimensión fractal entre la de una línea (1) y la de un área rellena (2).",
        ],
        formula: DIMENSION_FORMULA_COMMA,
      },
      {
        heading: "Qué hacen los controles",
        paragraphs: [
          "«Semilla» decide dónde empieza el crecimiento. «punto» coloca una sola celda congelada en el centro y lanza los caminantes desde un círculo cercano al borde del lienzo. «línea» congela toda la segunda fila empezando por abajo y deja caer los caminantes por el borde superior, como un cristal que crece hacia arriba desde una superficie. «anillo» dibuja un círculo cerrado con un radio de un tercio del lado más corto y genera los caminantes de manera uniforme en su interior, de modo que el coral crece hacia dentro desde la pared.",
          "«Caminantes / cuadro» fija cuántas partículas deambulan a la vez (de 10 a 1000, por defecto 150, tope absoluto 4000). Más caminantes significa un crecimiento más rápido, porque cada caminante se mueve una vez por fotograma. «Adherencia» (de 0,1 a 1,0, por defecto 1,0) es la probabilidad de que un caminante situado junto al cúmulo se congele de verdad; si no, sigue caminando. «Tamaño de celda» (de 2 a 8 píxeles, por defecto 3) fija la resolución de la cuadrícula: celdas más pequeñas dan una retícula más fina y más grande. Cambiar la semilla o el tamaño de celda reinicia la simulación.",
          "Los cuatro preajustes combinan todo esto: «Semilla central» con 80 caminantes, «Centro · rápido» con 300, «Línea inferior» con 200 y «Semilla anillo» con 200, todos con adherencia 1. Las muestras de color solo cambian el tono.",
        ],
      },
      {
        heading: "Cómo está construido",
        paragraphs: [
          "El mundo es un Uint8Array con un byte por celda de la cuadrícula: 0 significa vacía y cualquier otro valor significa congelada. Los caminantes son un simple array de coordenadas enteras. Cada fotograma rellena la reserva hasta la cantidad objetivo y después mueve cada caminante un paso a la izquierda, a la derecha, arriba o abajo con la misma probabilidad. Los caminantes quedan retenidos en el borde del lienzo, y un paso hacia una celda congelada se rechaza, así que las partículas nunca pueden atravesar un brazo por efecto túnel.",
          "Después de moverse, el caminante revisa sus cuatro vecinos directos (la vecindad de von Neumann). Si uno de ellos está congelado y un número aleatorio queda por debajo de la adherencia, la celda se congela y el caminante se elimina. El valor congelado registra además cuándo se unió la celda: sube cuatro unidades cada 60 fotogramas, y las celdas más antiguas se dibujan un poco más apagadas que las nuevas, de modo que el crecimiento exterior brilla algo más.",
          "Con el movimiento reducido activado, el bucle no se anima. La página ejecuta 1200 pasos de simulación de una vez, pinta un único fotograma fijo y muestra el tamaño del cúmulo resultante.",
        ],
        code: WALK_EXCERPT,
      },
      {
        heading: "Por qué la adherencia cambia la forma",
        paragraphs: [
          "Con adherencia 1 el primer contacto es definitivo, así que las partículas se congelan en la punta más exterior que tocan y el efecto de apantallamiento actúa con toda su fuerza. Una adherencia menor da al caminante varias oportunidades de deslizarse por la superficie y adentrarse más en los huecos antes de unirse. Los fiordos se rellenan, los brazos engordan y el cúmulo se vuelve más compacto. En el límite de una adherencia muy baja, el crecimiento deja por completo de estar limitado por la difusión, y la forma se acerca a una mancha.",
        ],
      },
    ],
    experimentsHeading: "Prueba esto",
    experiments: [
      {
        title: "Coral fino frente a coral grueso",
        text: "Ejecuta la semilla «punto» con adherencia 1,0, luego reinicia y ejecútala con adherencia 0,15. Compara los dos cuando alcancen un tamaño parecido: el segundo tiene brazos más gruesos y muchos menos fiordos vacíos.",
      },
      {
        title: "Un bosque desde una superficie",
        text: "Elige el preajuste «Línea inferior». Muchos arbolitos arrancan a lo largo del suelo, pero pronto unos pocos altos dan sombra al resto y solo ellos siguen creciendo. Es el mismo efecto de apantallamiento, que ahora actúa entre vecinos.",
      },
      {
        title: "Crecimiento de fuera hacia dentro",
        text: "Escoge «Semilla anillo». Los caminantes empiezan dentro del círculo, así que los brazos apuntan hacia el centro y compiten por el espacio vacío, cada vez menor, que queda en medio.",
      },
      {
        title: "Resolución y paciencia",
        text: "Pon el tamaño de celda en 2 y los caminantes en 1000. La retícula tiene ahora muchas más celdas, y el cúmulo muestra una ramificación más fina y detallada. Con tamaño de celda 8, la misma regla produce un coral tosco, de aspecto pixelado.",
      },
    ],
  },
  fr: {
    metaDescription:
      "Fais pousser en direct une agrégation limitée par diffusion : des marcheurs aléatoires se collent à une graine et bâtissent un corail fractal à régler.",
    heading: "Comment fonctionne cet explorateur",
    intro:
      "Chaque cellule lumineuse du canevas a d'abord été une particule errante. Les particules dérivent au hasard sur la grille, un pas de réseau par image, jusqu'à toucher l'amas en croissance et se figer sur place. Personne ne dit à l'amas de se ramifier, et pourtant, en quelques secondes, il lui pousse des bras fins, puis des bras latéraux sur ces bras, et le résultat évoque le givre sur une vitre ou les ramifications d'un delta. Les points pâles que tu vois bouger sont les marcheurs encore en route.",
    sections: [
      {
        heading: "L'idée : croître au hasard des arrivées",
        paragraphs: [
          "L'agrégation limitée par diffusion (DLA, d'après le sigle anglais) a été introduite par Thomas Witten et Leonard Sander en 1981. La règle est courte : lâche une particule au loin, laisse-la faire une marche aléatoire et, quand elle arrive au contact de l'amas, accroche-la. Puis lâche la suivante. Le nom dit ce qui commande la vitesse : la croissance est limitée par la rapidité avec laquelle les particules diffusent jusqu'à la surface, et non par une quelconque chimie à la surface.",
          "La ramification vient d'un effet d'écran. Un marcheur aléatoire venu de l'extérieur a bien plus de chances de heurter une pointe qui dépasse que de s'enfoncer dans un interstice étroit entre deux bras. Les pointes croissent donc plus vite, ce qui les fait dépasser encore davantage, tandis que les fjords qui les séparent sont affamés. De petites différences dues au hasard s'amplifient jusqu'à donner cette forme ouverte, arborescente, si caractéristique.",
          "Cette forme est une fractale. Si tu comptes les particules N à l'intérieur d'un cercle de rayon R autour de la graine, tu n'obtiens pas le R² attendu pour un disque plein. Pour la DLA dans le plan, N croît à peu près comme R élevé à une puissance d'environ 1,71, une dimension fractale comprise entre celle d'une ligne (1) et celle d'une surface pleine (2).",
        ],
        formula: DIMENSION_FORMULA_COMMA,
      },
      {
        heading: "À quoi servent les commandes",
        paragraphs: [
          "« Graine » décide de l'endroit où la croissance démarre. « point » place une seule cellule figée au centre et lance les marcheurs depuis un cercle proche du bord du canevas. « ligne » fige toute la deuxième rangée en partant du bas et fait entrer les marcheurs par le bord supérieur, comme un cristal qui pousse vers le haut à partir d'une surface. « anneau » trace un cercle fermé dont le rayon vaut un tiers du plus petit côté et fait apparaître les marcheurs uniformément à l'intérieur, si bien que le corail pousse vers l'intérieur depuis la paroi.",
          "« Marcheurs / image » fixe le nombre de particules qui errent en même temps (de 10 à 1000, 150 par défaut, plafond absolu de 4000). Plus de marcheurs, c'est une croissance plus rapide, puisque chaque marcheur bouge une fois par image. « Adhérence » (de 0,1 à 1,0, 1,0 par défaut) est la probabilité qu'un marcheur voisin de l'amas se fige réellement ; sinon, il continue de marcher. « Taille de cellule » (de 2 à 8 pixels, 3 par défaut) fixe la résolution de la grille : des cellules plus petites donnent un réseau plus fin et plus grand. Changer la graine ou la taille de cellule relance la simulation.",
          "Les quatre préréglages combinent ces paramètres : « Graine centrale » avec 80 marcheurs, « Centre · rapide » avec 300, « Ligne du bas » avec 200 et « Graine anneau » avec 200, tous avec une adhérence de 1. Les pastilles de couleur ne changent que la teinte.",
        ],
      },
      {
        heading: "Comment c'est construit",
        paragraphs: [
          "Le monde est un Uint8Array avec un octet par cellule de la grille : 0 signifie vide, toute autre valeur signifie figée. Les marcheurs sont un simple tableau de coordonnées entières. Chaque image complète la réserve jusqu'au nombre visé, puis déplace chaque marcheur d'un pas à gauche, à droite, en haut ou en bas avec la même probabilité. Les marcheurs sont retenus au bord du canevas, et un pas vers une cellule figée est refusé : les particules ne peuvent donc jamais traverser un bras.",
          "Après son déplacement, le marcheur examine ses quatre voisins directs (le voisinage de von Neumann). Si l'un d'eux est figé et qu'un nombre aléatoire tombe sous l'adhérence, la cellule se fige et le marcheur est retiré. La valeur figée enregistre aussi le moment où la cellule s'est attachée : elle augmente de quatre toutes les 60 images, et les cellules plus anciennes sont dessinées un peu plus sombres que les récentes, de sorte que la croissance extérieure brille un peu plus.",
          "Quand la réduction des animations est activée, la boucle ne s'anime pas. La page exécute 1200 pas de simulation d'un coup, peint une seule image fixe et affiche la taille de l'amas obtenu.",
        ],
        code: WALK_EXCERPT,
      },
      {
        heading: "Pourquoi l'adhérence change la forme",
        paragraphs: [
          "Avec une adhérence de 1, le premier contact est définitif : les particules se figent sur la pointe la plus extérieure qu'elles touchent et l'effet d'écran joue à plein. Une adhérence plus faible donne au marcheur plusieurs occasions de glisser le long de la surface et de s'aventurer plus loin dans les interstices avant de s'attacher. Les fjords se comblent, les bras s'épaississent et l'amas devient plus compact. À la limite d'une adhérence très faible, la croissance n'est plus du tout limitée par la diffusion, et la forme tend vers une masse arrondie.",
        ],
      },
    ],
    experimentsHeading: "À essayer",
    experiments: [
      {
        title: "Corail fin contre corail épais",
        text: "Lance la graine « point » avec une adhérence de 1,0, puis réinitialise et relance-la avec une adhérence de 0,15. Compare les deux quand ils atteignent une taille semblable : le second a des bras plus épais et bien moins de fjords vides.",
      },
      {
        title: "Une forêt sur une surface",
        text: "Choisis le préréglage « Ligne du bas ». De nombreux petits arbres démarrent le long du sol, mais bientôt quelques grands font de l'ombre aux autres et sont les seuls à continuer de pousser. C'est le même effet d'écran, qui agit cette fois entre voisins.",
      },
      {
        title: "Une croissance de l'extérieur vers l'intérieur",
        text: "Prends « Graine anneau ». Les marcheurs partent de l'intérieur du cercle, donc les bras pointent vers le centre et se disputent l'espace vide qui rétrécit au milieu.",
      },
      {
        title: "Résolution et patience",
        text: "Règle la taille de cellule sur 2 et les marcheurs sur 1000. Le réseau compte maintenant beaucoup plus de cellules, et l'amas montre une ramification plus fine et plus détaillée. Avec une taille de cellule de 8, la même règle produit un corail massif, façon pixel art.",
      },
    ],
  },
  it: {
    metaDescription:
      "Fai crescere dal vivo l'aggregazione limitata dalla diffusione: camminatori casuali si attaccano a un seme e formano un corallo frattale. Regola l'aderenza.",
    heading: "Come funziona questo esploratore",
    intro:
      "Ogni cella luminosa del canvas è stata una particella vagante. Le particelle si spostano a caso sulla griglia, un passo di reticolo per fotogramma, finché toccano l'ammasso in crescita e si congelano sul posto. Nessuno dice all'ammasso di ramificarsi, eppure in pochi secondi gli spuntano bracci sottili, sui bracci spuntano bracci laterali, e il risultato ricorda la brina su una finestra o le ramificazioni del delta di un fiume. I puntini tenui che vedi muoversi sono i camminatori ancora in viaggio.",
    sections: [
      {
        heading: "L'idea: crescere per arrivi casuali",
        paragraphs: [
          "L'aggregazione limitata dalla diffusione (DLA, dalla sigla inglese) è stata introdotta da Thomas Witten e Leonard Sander nel 1981. La regola è breve: rilascia una particella lontano, lasciale fare una passeggiata aleatoria e, quando atterra accanto all'ammasso, attaccala. Poi rilascia la successiva. Il nome dice che cosa governa la velocità: la crescita è limitata dalla rapidità con cui le particelle diffondono fino alla superficie, non da una qualche chimica sulla superficie.",
          "La ramificazione nasce da un effetto di schermatura. Un camminatore casuale che arriva da fuori ha molte più probabilità di urtare una punta sporgente che di inoltrarsi in una stretta fessura tra due bracci. Le punte quindi crescono più in fretta, il che le fa sporgere ancora di più, mentre i fiordi tra l'una e l'altra restano a secco. Piccole differenze casuali si amplificano fino alla caratteristica forma aperta, simile a un albero.",
          "Quella forma è un frattale. Se conti le particelle N dentro un cerchio di raggio R attorno al seme, non ottieni l'R² che ti aspetteresti da un disco pieno. Per la DLA nel piano, N cresce all'incirca come R elevato a una potenza di circa 1,71, una dimensione frattale compresa tra quella di una linea (1) e quella di un'area piena (2).",
        ],
        formula: DIMENSION_FORMULA_COMMA,
      },
      {
        heading: "Che cosa fanno i controlli",
        paragraphs: [
          "«Seme» decide dove comincia la crescita. «punto» mette una sola cella congelata al centro e lancia i camminatori da un cerchio vicino al bordo del canvas. «linea» congela l'intera seconda riga dal basso e fa entrare i camminatori dal bordo superiore, come un cristallo che cresce verso l'alto da una superficie. «anello» disegna un cerchio chiuso con raggio pari a un terzo del lato più corto e genera i camminatori in modo uniforme al suo interno, così il corallo cresce verso l'interno a partire dalla parete.",
          "«Camminatori / frame» stabilisce quante particelle vagano contemporaneamente (da 10 a 1000, predefinito 150, limite massimo 4000). Più camminatori significa crescita più veloce, perché ogni camminatore si muove una volta per fotogramma. «Aderenza» (da 0,1 a 1,0, predefinito 1,0) è la probabilità che un camminatore accanto all'ammasso si congeli davvero; altrimenti continua a camminare. «Dimensione cella» (da 2 a 8 pixel, predefinito 3) fissa la risoluzione della griglia: celle più piccole danno un reticolo più fine e più grande. Cambiare il seme o la dimensione della cella fa ripartire la simulazione.",
          "I quattro preset combinano queste scelte: «Seme centrale» con 80 camminatori, «Centro · veloce» con 300, «Linea inferiore» con 200 e «Seme ad anello» con 200, tutti con aderenza 1. I campioni di colore cambiano solo la tinta.",
        ],
      },
      {
        heading: "Com'è costruito",
        paragraphs: [
          "Il mondo è un Uint8Array con un byte per ogni cella della griglia: 0 significa vuota, qualsiasi altro valore significa congelata. I camminatori sono un semplice array di coordinate intere. Ogni fotogramma riporta la riserva al numero desiderato, poi muove ogni camminatore di un passo a sinistra, a destra, in alto o in basso con uguale probabilità. I camminatori vengono trattenuti al bordo del canvas, e un passo su una cella congelata viene rifiutato, quindi le particelle non possono mai attraversare un braccio per effetto tunnel.",
          "Dopo essersi mosso, il camminatore controlla i suoi quattro vicini diretti (l'intorno di von Neumann). Se uno di loro è congelato e un numero casuale cade sotto l'aderenza, la cella si congela e il camminatore viene rimosso. Il valore congelato registra anche quando la cella si è attaccata: sale di quattro ogni 60 fotogrammi, e le celle più vecchie vengono disegnate leggermente più spente di quelle nuove, così la crescita esterna brilla un po' di più.",
          "Con il movimento ridotto attivo il ciclo non viene animato. La pagina esegue 1200 passi di simulazione in una volta, dipinge un solo fotogramma fisso e mostra la dimensione dell'ammasso risultante.",
        ],
        code: WALK_EXCERPT,
      },
      {
        heading: "Perché l'aderenza cambia la forma",
        paragraphs: [
          "Con aderenza 1 il primo contatto è definitivo, quindi le particelle si congelano sulla punta più esterna che toccano e l'effetto di schermatura è al massimo. Un'aderenza più bassa dà al camminatore più occasioni di scivolare lungo la superficie e di spingersi più a fondo nelle fessure prima di attaccarsi. I fiordi si riempiono, i bracci si ispessiscono e l'ammasso diventa più compatto. Al limite di un'aderenza molto bassa la crescita non è più affatto limitata dalla diffusione, e la forma si avvicina a una macchia tondeggiante.",
        ],
      },
    ],
    experimentsHeading: "Da provare",
    experiments: [
      {
        title: "Corallo sottile contro corallo spesso",
        text: "Avvia il seme «punto» con aderenza 1,0, poi resetta e avvialo con aderenza 0,15. Confronta i due quando raggiungono una dimensione simile: il secondo ha bracci più spessi e molti meno fiordi vuoti.",
      },
      {
        title: "Una foresta da una superficie",
        text: "Scegli il preset «Linea inferiore». Lungo il fondo partono tanti alberelli, ma presto pochi alberi alti fanno ombra agli altri e solo loro continuano a crescere. È lo stesso effetto di schermatura, che ora agisce tra vicini.",
      },
      {
        title: "Crescita da fuori verso dentro",
        text: "Scegli «Seme ad anello». I camminatori partono dentro il cerchio, quindi i bracci puntano verso il centro e si contendono lo spazio vuoto che si restringe nel mezzo.",
      },
      {
        title: "Risoluzione e pazienza",
        text: "Imposta la dimensione della cella a 2 e i camminatori a 1000. Ora il reticolo ha molte più celle, e l'ammasso mostra ramificazioni più fini e dettagliate. Con dimensione 8 la stessa regola produce un corallo tozzo, in stile pixel art.",
      },
    ],
  },
  pt: {
    metaDescription:
      "Faz crescer ao vivo a agregação limitada por difusão: caminhantes aleatórios colam-se a uma semente e constroem coral fractal. Ajusta aderência e semente.",
    heading: "Como funciona este explorador",
    intro:
      "Cada célula brilhante da tela já foi uma partícula errante. As partículas deambulam ao acaso pela grelha, um passo de rede por fotograma, até tocarem no agregado em crescimento e ficarem congeladas no lugar. Ninguém diz ao agregado para se ramificar e, no entanto, em poucos segundos crescem-lhe braços finos, aos braços crescem braços laterais, e o resultado lembra a geada numa janela ou as ramificações do delta de um rio. Os pontos ténues que vês a mexer são os caminhantes que ainda vêm a caminho.",
    sections: [
      {
        heading: "A ideia: crescer por chegadas ao acaso",
        paragraphs: [
          "A agregação limitada por difusão (DLA, da sigla inglesa) foi introduzida por Thomas Witten e Leonard Sander em 1981. A regra é curta: larga uma partícula longe, deixa-a fazer um passeio aleatório e, quando ela aterrar junto ao agregado, cola-a. Depois larga a seguinte. O nome diz o que controla a velocidade: o crescimento é limitado pela rapidez com que as partículas se difundem até à superfície, e não por qualquer química na superfície.",
          "A ramificação vem de um efeito de blindagem. Um caminhante aleatório que chega de fora tem muito mais probabilidade de esbarrar numa ponta saliente do que de se embrenhar numa fenda estreita entre dois braços. Por isso as pontas crescem mais depressa, o que as torna ainda mais salientes, enquanto os fiordes entre elas passam fome. Pequenas diferenças aleatórias são amplificadas até darem a característica forma aberta, em árvore.",
          "Essa forma é um fractal. Se contares as partículas N dentro de um círculo de raio R em torno da semente, não obténs o R² que seria de esperar de um disco cheio. Para a DLA no plano, N cresce aproximadamente como R elevado a uma potência de cerca de 1,71, uma dimensão fractal entre a de uma linha (1) e a de uma área cheia (2).",
        ],
        formula: DIMENSION_FORMULA_COMMA,
      },
      {
        heading: "O que fazem os controlos",
        paragraphs: [
          "«Semente» decide onde começa o crescimento. «ponto» põe uma única célula congelada no centro e lança os caminhantes a partir de um círculo junto ao limite da tela. «linha» congela toda a segunda fila a contar de baixo e larga os caminhantes pela margem superior, como um cristal que cresce para cima a partir de uma superfície. «anel» desenha um círculo fechado com raio igual a um terço do lado mais curto e gera os caminhantes uniformemente no seu interior, pelo que o coral cresce para dentro a partir da parede.",
          "«Caminhantes / quadro» define quantas partículas deambulam ao mesmo tempo (de 10 a 1000, 150 por omissão, limite absoluto 4000). Mais caminhantes significa crescimento mais rápido, porque cada caminhante se move uma vez por fotograma. «Aderência» (de 0,1 a 1,0, 1,0 por omissão) é a probabilidade de um caminhante junto ao agregado congelar de facto; caso contrário, continua a caminhar. «Tamanho da célula» (de 2 a 8 píxeis, 3 por omissão) define a resolução da grelha: células mais pequenas dão uma rede mais fina e maior. Mudar a semente ou o tamanho da célula reinicia a simulação.",
          "As quatro predefinições combinam tudo isto: «Semente central» com 80 caminhantes, «Centro · rápido» com 300, «Linha inferior» com 200 e «Semente anel» com 200, todas com aderência 1. As amostras de cor só mudam a tonalidade.",
        ],
      },
      {
        heading: "Como está construído",
        paragraphs: [
          "O mundo é um Uint8Array com um byte por célula da grelha: 0 significa vazia, qualquer outro valor significa congelada. Os caminhantes são um simples array de coordenadas inteiras. Cada fotograma repõe a reserva até ao número pretendido e depois move cada caminhante um passo para a esquerda, para a direita, para cima ou para baixo com igual probabilidade. Os caminhantes ficam retidos no limite da tela, e um passo para uma célula congelada é recusado, pelo que as partículas nunca conseguem atravessar um braço por efeito de túnel.",
          "Depois de se mover, o caminhante verifica os seus quatro vizinhos diretos (a vizinhança de von Neumann). Se um deles estiver congelado e um número aleatório ficar abaixo da aderência, a célula congela e o caminhante é removido. O valor congelado regista também quando a célula se ligou: sobe quatro unidades a cada 60 fotogramas, e as células mais antigas são desenhadas um pouco mais apagadas do que as mais recentes, pelo que o crescimento exterior brilha um pouco mais.",
          "Com o movimento reduzido ativado, o ciclo não é animado. A página corre 1200 passos de simulação de uma vez, pinta um único fotograma fixo e mostra o tamanho do agregado resultante.",
        ],
        code: WALK_EXCERPT,
      },
      {
        heading: "Porque é que a aderência muda a forma",
        paragraphs: [
          "Com aderência 1, o primeiro contacto é definitivo, por isso as partículas congelam na ponta mais exterior em que tocam e o efeito de blindagem está na força máxima. Uma aderência mais baixa dá ao caminhante várias oportunidades de deslizar ao longo da superfície e de se embrenhar mais nas fendas antes de se ligar. Os fiordes enchem-se, os braços engrossam e o agregado torna-se mais compacto. No limite de uma aderência muito baixa, o crescimento deixa por completo de ser limitado pela difusão, e a forma aproxima-se de uma mancha arredondada.",
        ],
      },
    ],
    experimentsHeading: "Experimenta isto",
    experiments: [
      {
        title: "Coral fino contra coral grosso",
        text: "Corre a semente «ponto» com aderência 1,0, depois repõe e corre-a com aderência 0,15. Compara os dois quando chegarem a um tamanho parecido: o segundo tem braços mais grossos e muito menos fiordes vazios.",
      },
      {
        title: "Uma floresta a partir de uma superfície",
        text: "Escolhe a predefinição «Linha inferior». Muitas árvores pequenas arrancam ao longo do chão, mas em breve algumas altas fazem sombra às restantes e só elas continuam a crescer. É o mesmo efeito de blindagem, agora a atuar entre vizinhos.",
      },
      {
        title: "Crescimento de fora para dentro",
        text: "Escolhe «Semente anel». Os caminhantes começam dentro do círculo, por isso os braços apontam para o centro e disputam o espaço vazio, cada vez menor, que resta no meio.",
      },
      {
        title: "Resolução e paciência",
        text: "Põe o tamanho da célula em 2 e os caminhantes em 1000. A rede tem agora muito mais células, e o agregado mostra uma ramificação mais fina e mais detalhada. Com tamanho de célula 8, a mesma regra produz um coral atarracado, ao estilo de pixel art.",
      },
    ],
  },
  sv: {
    metaDescription:
      "Låt diffusionsbegränsad aggregation växa live: slumpvandrare fastnar på ett frö och bygger fraktal korall. Justera klibbighet, antal vandrare och fröform.",
    heading: "Så fungerar den här utforskaren",
    intro:
      "Varje lysande cell på ytan var en gång en kringirrande partikel. Partiklarna driver slumpmässigt över rutnätet, ett gittersteg per bildruta, tills de rör vid det växande klustret och fryser fast på stället. Ingen säger åt klustret att förgrena sig, och ändå får det inom några sekunder tunna armar, armarna får sidoarmar, och resultatet liknar frost på en fönsterruta eller förgreningarna i ett floddelta. De svaga prickarna som rör sig är vandrarna som fortfarande är på väg.",
    sections: [
      {
        heading: "Idén: tillväxt genom slumpvis ankomst",
        paragraphs: [
          "Diffusionsbegränsad aggregation (DLA) introducerades av Thomas Witten och Leonard Sander 1981. Regeln är kort: släpp en partikel långt bort, låt den göra en slumpvandring, och när den hamnar intill klustret fäster du den. Släpp sedan nästa. Namnet säger vad som styr farten: tillväxten begränsas av hur snabbt partiklarna diffunderar till ytan, inte av någon kemi vid ytan.",
          "Förgreningen kommer av en skärmningseffekt. En slumpvandrare som kommer utifrån stöter mycket hellre emot en spets som sticker ut än letar sig djupt in i en trång springa mellan två armar. Spetsarna växer därför snabbare, vilket får dem att sticka ut ännu mer, medan fjordarna mellan dem svälter. Små slumpmässiga skillnader förstärks till den typiska öppna, trädlika formen.",
          "Den formen är en fraktal. Om du räknar partiklarna N inom en cirkel med radien R kring fröet får du inte det R² som du skulle vänta dig av en fylld skiva. För DLA i planet växer N ungefär som R upphöjt till omkring 1,71, en fraktal dimension mellan en linje (1) och en fylld yta (2).",
        ],
        formula: DIMENSION_FORMULA_COMMA,
      },
      {
        heading: "Vad reglagen gör",
        paragraphs: [
          "”Frö” avgör var tillväxten börjar. ”punkt” lägger en enda frusen cell i mitten och skickar ut vandrare från en cirkel nära ytans kant. ”linje” fryser hela den näst nedersta raden och släpper in vandrare vid överkanten, som en kristall som växer uppåt från en yta. ”ring” ritar en sluten cirkel med en radie på en tredjedel av den kortare sidan och skapar vandrare jämnt fördelade inuti den, så korallen växer inåt från väggen.",
          "”Vandrare / bildruta” anger hur många partiklar som irrar omkring samtidigt (10 till 1000, standard 150, hårt tak 4000). Fler vandrare ger snabbare tillväxt, eftersom varje vandrare rör sig en gång per bildruta. ”Klibbighet” (0,1 till 1,0, standard 1,0) är sannolikheten att en vandrare intill klustret verkligen fryser fast. Annars vandrar den vidare. ”Cellstorlek” (2 till 8 pixlar, standard 3) anger rutnätets upplösning: mindre celler ger ett finare och större gitter. Om du byter frö eller cellstorlek startar simuleringen om.",
          "De fyra förinställningarna kombinerar detta: ”Mittfrö” med 80 vandrare, ”Mitten · snabbt” med 300, ”Bottenlinje” med 200 och ”Ringfrö” med 200, alla med klibbighet 1. Färgrutorna ändrar bara färgtonen.",
        ],
      },
      {
        heading: "Hur den är byggd",
        paragraphs: [
          "Världen är en Uint8Array med en byte per cell i rutnätet: 0 betyder tom, alla andra värden betyder frusen. Vandrarna är en vanlig array med heltalskoordinater. Varje bildruta fyller på förrådet till målantalet och flyttar sedan varje vandrare ett steg åt vänster, höger, uppåt eller nedåt med lika sannolikhet. Vandrarna hålls kvar vid ytans kant, och ett steg in på en frusen cell nekas, så partiklarna kan aldrig tunnla genom en arm.",
          "Efter förflyttningen kontrollerar vandraren sina fyra direkta grannar (von Neumann-grannskapet). Om någon av dem är frusen och ett slumptal hamnar under klibbigheten fryser cellen och vandraren tas bort. Det frusna värdet registrerar också när cellen fäste: det stiger med fyra var 60:e bildruta, och äldre celler ritas något mattare än nyare, så den yttre tillväxten lyser lite starkare.",
          "Med reducerad rörelse aktiverad animeras inte slingan. Sidan kör 1200 simuleringssteg på en gång, målar en enda stillbild och visar den resulterande klusterstorleken.",
        ],
        code: WALK_EXCERPT,
      },
      {
        heading: "Varför klibbigheten ändrar formen",
        paragraphs: [
          "Vid klibbighet 1 är den första kontakten slutgiltig, så partiklarna fryser fast på den yttersta spets de rör vid och skärmningseffekten verkar med full styrka. Lägre klibbighet ger en vandrare flera chanser att glida längs ytan och vandra längre in i springorna innan den fäster. Fjordarna fylls igen, armarna blir tjockare och klustret blir mer kompakt. I gränsfallet med mycket låg klibbighet begränsas tillväxten inte längre av diffusion över huvud taget, och formen närmar sig en klump.",
        ],
      },
    ],
    experimentsHeading: "Testa det här",
    experiments: [
      {
        title: "Tunn mot tjock korall",
        text: "Kör fröet ”punkt” med klibbighet 1,0, återställ sedan och kör det med klibbighet 0,15. Jämför de två när de har nått ungefär samma storlek: den andra har tjockare armar och betydligt färre tomma fjordar.",
      },
      {
        title: "En skog från en yta",
        text: "Välj förinställningen ”Bottenlinje”. Många små träd börjar växa längs golvet, men snart skuggar några höga resten och bara de fortsätter att växa. Det är samma skärmningseffekt, som nu verkar mellan grannar.",
      },
      {
        title: "Tillväxt utifrån och in",
        text: "Välj ”Ringfrö”. Vandrarna startar inne i cirkeln, så armarna pekar mot mitten och konkurrerar om det krympande tomrummet där.",
      },
      {
        title: "Upplösning och tålamod",
        text: "Sätt cellstorleken till 2 och vandrarna till 1000. Gittret har nu många fler celler, och klustret visar finare och mer detaljerade förgreningar. Med cellstorlek 8 ger samma regel en klumpig korall i pixelkonststil.",
      },
    ],
  },
  no: {
    metaDescription:
      "La diffusjonsbegrenset aggregering vokse live: tilfeldige vandrere fester seg til et frø og bygger fraktal korall. Juster klebrighet, vandrere og frøform.",
    heading: "Slik fungerer denne utforskeren",
    intro:
      "Hver lysende celle på lerretet var en gang en omflakkende partikkel. Partiklene driver tilfeldig rundt på rutenettet, ett gittersteg per bilderute, helt til de berører klyngen som vokser, og fryser fast på stedet. Ingen ber klyngen om å forgreine seg, og likevel får den i løpet av sekunder tynne armer, armene får sidearmer, og resultatet ligner rim på en vindusrute eller forgreiningene i et elvedelta. De svake prikkene du ser bevege seg, er vandrerne som fortsatt er underveis.",
    sections: [
      {
        heading: "Ideen: vekst ved tilfeldig ankomst",
        paragraphs: [
          "Diffusjonsbegrenset aggregering (DLA) ble innført av Thomas Witten og Leonard Sander i 1981. Regelen er kort: slipp en partikkel langt unna, la den gå en tilfeldig vandring, og når den lander inntil klyngen, fester du den. Slipp så den neste. Navnet sier hva som styrer farten: veksten er begrenset av hvor raskt partiklene diffunderer til overflaten, ikke av noen kjemi ved overflaten.",
          "Forgreiningen kommer av en skjermingseffekt. En tilfeldig vandrer som kommer utenfra, støter mye lettere på en spiss som stikker ut, enn den finner veien dypt inn i en trang sprekk mellom to armer. Spissene vokser derfor raskere, noe som får dem til å stikke enda lenger ut, mens fjordene mellom dem sulter. Små tilfeldige forskjeller forsterkes til den typiske åpne, trelignende formen.",
          "Den formen er en fraktal. Teller du partiklene N innenfor en sirkel med radius R rundt frøet, får du ikke den R² du ville ventet av en fylt skive. For DLA i planet vokser N omtrent som R opphøyd i rundt 1,71, en fraktal dimensjon mellom en linje (1) og en fylt flate (2).",
        ],
        formula: DIMENSION_FORMULA_COMMA,
      },
      {
        heading: "Hva kontrollene gjør",
        paragraphs: [
          "«Frø» avgjør hvor veksten starter. «punkt» legger én frossen celle i midten og sender ut vandrere fra en sirkel nær kanten av lerretet. «linje» fryser hele den nest nederste raden og slipper inn vandrere ved overkanten, som en krystall som vokser oppover fra en flate. «ring» tegner en lukket sirkel med radius lik en tredjedel av den korteste siden og lager vandrere jevnt fordelt inni den, så korallen vokser innover fra veggen.",
          "«Vandrere / ramme» bestemmer hvor mange partikler som vandrer samtidig (10 til 1000, standard 150, absolutt tak 4000). Flere vandrere gir raskere vekst, fordi hver vandrer flytter seg én gang per bilderute. «Klebrighet» (0,1 til 1,0, standard 1,0) er sannsynligheten for at en vandrer inntil klyngen faktisk fryser fast. Ellers går den videre. «Cellestørrelse» (2 til 8 piksler, standard 3) bestemmer oppløsningen på rutenettet: mindre celler gir et finere og større gitter. Bytter du frø eller cellestørrelse, starter simuleringen på nytt.",
          "De fire forhåndsinnstillingene kombinerer dette: «Sentrum-frø» med 80 vandrere, «Sentrum · rask» med 300, «Bunnlinje» med 200 og «Ringfrø» med 200, alle med klebrighet 1. Fargeprøvene endrer bare fargetonen.",
        ],
      },
      {
        heading: "Hvordan den er bygget",
        paragraphs: [
          "Verden er en Uint8Array med én byte per celle i rutenettet: 0 betyr tom, alle andre verdier betyr frossen. Vandrerne er en vanlig array med heltallskoordinater. Hver bilderute fyller opp beholdningen til målantallet og flytter deretter hver vandrer ett steg til venstre, til høyre, opp eller ned med lik sannsynlighet. Vandrerne holdes igjen ved kanten av lerretet, og et steg inn på en frossen celle avvises, så partiklene kan aldri tunnelere gjennom en arm.",
          "Etter flyttingen sjekker vandreren de fire direkte naboene sine (von Neumann-nabolaget). Hvis en av dem er frossen og et tilfeldig tall havner under klebrigheten, fryser cellen og vandreren fjernes. Den frosne verdien registrerer også når cellen festet seg: den stiger med fire for hver 60. bilderute, og eldre celler tegnes litt mattere enn nyere, så den ytre veksten lyser litt sterkere.",
          "Med redusert bevegelse slått på animeres ikke løkken. Siden kjører 1200 simuleringssteg på én gang, maler ett enkelt stillbilde og viser den resulterende klyngestørrelsen.",
        ],
        code: WALK_EXCERPT,
      },
      {
        heading: "Hvorfor klebrigheten endrer formen",
        paragraphs: [
          "Ved klebrighet 1 er den første kontakten endelig, så partiklene fryser fast på den ytterste spissen de berører, og skjermingseffekten virker med full styrke. Lavere klebrighet gir en vandrer flere sjanser til å gli langs overflaten og vandre lenger inn i sprekkene før den fester seg. Fjordene fylles igjen, armene blir tykkere, og klyngen blir mer kompakt. I grensen for svært lav klebrighet er veksten ikke lenger begrenset av diffusjon i det hele tatt, og formen nærmer seg en klump.",
        ],
      },
    ],
    experimentsHeading: "Prøv dette",
    experiments: [
      {
        title: "Tynn mot tykk korall",
        text: "Kjør frøet «punkt» med klebrighet 1,0, nullstill så og kjør det med klebrighet 0,15. Sammenlign de to når de har nådd omtrent samme størrelse: den andre har tykkere armer og langt færre tomme fjorder.",
      },
      {
        title: "En skog fra en flate",
        text: "Velg forhåndsinnstillingen «Bunnlinje». Mange små trær starter langs gulvet, men snart skygger noen få høye for resten, og bare de fortsetter å vokse. Det er den samme skjermingseffekten, som nå virker mellom naboer.",
      },
      {
        title: "Vekst utenfra og inn",
        text: "Velg «Ringfrø». Vandrerne starter inne i sirkelen, så armene peker mot sentrum og konkurrerer om det krympende tomrommet i midten.",
      },
      {
        title: "Oppløsning og tålmodighet",
        text: "Sett cellestørrelsen til 2 og vandrerne til 1000. Gitteret har nå mange flere celler, og klyngen viser finere og mer detaljerte forgreininger. Med cellestørrelse 8 gir den samme regelen en klumpete korall i pikselkunststil.",
      },
    ],
  },
};
