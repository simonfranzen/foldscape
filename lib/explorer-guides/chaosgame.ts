import type { ExplorerGuide } from "./types";

// Numbers quoted here (speed 100 to 50,000 with default 1500, the 2,000,000
// point budget, 200,000 points for reduced motion, the fern probabilities)
// match app/chaosgame/explorer/page.tsx; update both together.
const LOOP_EXCERPT = `for (let i = 0; i < batch; i++) {
  let pick: number;
  let attempts = 0;
  do {
    pick = (Math.random() * n) | 0;
    attempts++;
    if (attempts > 64) break;
  } while (isForbidden(pick, hist, n, restriction));

  x = x + ratio * (vx[pick] - x);
  y = y + ratio * (vy[pick] - y);

  hist.unshift(pick);
  if (hist.length > 2) hist.pop();
  ctx.fillRect(x, y, 1, 1);
}`;

export const CHAOSGAME_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Play the chaos game live: set vertices, jump ratio and restriction rules and watch the Sierpinski triangle or Barnsley fern emerge from purely random jumps.",
    heading: "How this explorer works",
    intro:
      "Every dot on the canvas comes from one rule applied over and over: choose a corner of the polygon at random and jump part of the way towards it. Nothing in the rule mentions triangles inside triangles, yet after a few thousand jumps the Sierpinski triangle is unmistakable. The randomness only decides the order in which the picture fills in; the shape is fixed by the corners and the jump ratio. Michael Barnsley gave this game its name.",
    sections: [
      {
        heading: "The rule",
        paragraphs: [
          "Place n vertices v₁ to vₙ on a regular polygon and start anywhere. At each step pick a vertex vᵢ and move the current point p a fraction r of the way towards it. With r = 0.5 you land exactly halfway. Each move is a contraction that shrinks the plane by the factor 1 − r towards its vertex. The set made of shrunken copies of itself under these maps is the attractor of an iterated function system, and the random walk traces it out.",
          "The starting point does not matter. Every jump shrinks the distance to the attractor by the factor 1 − r, so with r = 0.5 an initial error of a whole canvas is below a pixel after about ten jumps.",
        ],
        formula: "p_{k+1} = p_k + r\\,(v_i - p_k), \\qquad i \\text{ chosen at random}",
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "Vertices n runs from 3 to 8, the jump ratio r from 0.1 to 0.9. With Auto magic ratio on, r is set to the value at which the n shrunken copies just touch without overlapping: 0.5 for the triangle and the square, about 0.618 (one over the golden ratio) for the pentagon, 2/3 for the hexagon and about 0.7071 (one over the square root of 2) for the octagon. Moving the slider by hand switches this off.",
          "Restriction changes which vertex may be chosen next, based on the previous choice. No repeat forbids picking the same vertex twice in a row. No neighbour forbids the two vertices next to the last one. No opposite forbids the vertex directly across, or, for odd n, the two vertices that are almost across. This one-step memory carves holes into shapes that would otherwise be solid.",
          "Speed sets how many points are added per frame, from 100 to 50,000, starting at 1500. The four presets load a triangle with r = 0.5, a square with r = 0.5 and no repeat, a pentagon with its magic ratio, and Barnsley's fern. Clear wipes the canvas, as does any change of rule, speed or colour, so the counter always matches the picture.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "The vertices sit on a circle that fills the canvas minus a 24-pixel margin, first vertex at the top. Each frame runs a tight loop: draw a random vertex, reject it if the restriction forbids it (giving up after 64 attempts, so a rule that forbids everything cannot freeze the page), jump, remember the choice and plot a single pixel with a slightly transparent fill. Because the dots are translucent, often visited places grow brighter.",
          "The fern uses the same machinery with four affine maps instead of n vertex jumps. Each map is a matrix plus a shift, chosen with probabilities 1, 85, 7 and 7 percent: the rare one squashes everything onto the stem, the common one copies the whole fern slightly smaller and higher up, and the other two produce the lowest left and right fronds.",
          "After two million points the loop stops, since the picture cannot get any denser. The counter refreshes about ten times per second. If your system asks for reduced motion, there is no animation: 200,000 points are computed at once and the finished picture is drawn in a single frame.",
        ],
        code: LOOP_EXCERPT,
      },
      {
        heading: "Why the magic ratio is magic",
        paragraphs: [
          "Below the magic ratio the copies overlap and smear towards a filled region; above it they drift apart into dust. At exactly the magic value the copies kiss, edge to edge or corner to corner, and the result is a clean self-similar fractal. For the square something special happens: the magic ratio 0.5 makes the four copies tile the square perfectly, so the plain chaos game just fills it with uniform noise. That is why the square preset adds the no repeat rule.",
        ],
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "Break the triangle into dust",
        text: "Load the triangle preset and drag r from 0.5 up to 0.6. The three copies separate and the Sierpinski triangle falls apart into ever finer clusters. At 0.4 the gaps close and the triangle is nearly solid.",
      },
      {
        title: "A rule that leaves no choice",
        text: "Set n = 3 and choose No neighbour. In a triangle every other vertex is a neighbour, so the walk can only pick the same corner again. All the points pile up in one vertex and the canvas stays almost empty.",
      },
      {
        title: "Turn a square into a line",
        text: "Set n = 4 with r = 0.5 and choose No neighbour. Only the same vertex or the opposite one is allowed, so the walk is trapped on one diagonal. Then compare No opposite and No repeat.",
      },
      {
        title: "Watch the fern grow",
        text: "Choose the Barnsley fern preset and set Speed to 100. The upper fern sharpens fastest because 85 percent of all jumps land in it. The two lowest fronds each receive only 7 percent of the points, and the main stem just 1 percent, so it stays faint the longest.",
      },
    ],
  },
  de: {
    metaDescription:
      "Das Chaosspiel live: Ecken, Sprungverhältnis und Regeln wählen und zusehen, wie aus Zufallssprüngen das Sierpinski-Dreieck oder der Barnsley-Farn wächst.",
    heading: "So funktioniert dieser Explorer",
    intro:
      "Jeder Punkt auf der Zeichenfläche stammt aus einer einzigen Regel, die immer wieder angewendet wird: Wähle zufällig eine Ecke des Vielecks und spring ein Stück auf sie zu. Die Regel erwähnt keine Dreiecke in Dreiecken, und trotzdem ist nach ein paar tausend Sprüngen das Sierpinski-Dreieck unverkennbar. Der Zufall entscheidet nur, in welcher Reihenfolge sich das Bild füllt; die Form legen Ecken und Sprungverhältnis fest. Den Namen Chaosspiel hat Michael Barnsley geprägt.",
    sections: [
      {
        heading: "Die Regel",
        paragraphs: [
          "Setz n Ecken v₁ bis vₙ auf ein regelmäßiges Vieleck und starte irgendwo. In jedem Schritt wählst du eine Ecke vᵢ und bewegst den aktuellen Punkt p um den Anteil r auf sie zu. Bei r = 0,5 landest du genau in der Mitte. Jeder dieser n Züge ist eine Kontraktion: Er staucht die ganze Ebene um den Faktor 1 − r auf seine Ecke zusammen. Eine Menge, die aus verkleinerten Kopien ihrer selbst unter wenigen Kontraktionen besteht, heißt Attraktor eines iterierten Funktionensystems, und die Zufallswanderung besucht ihn mit Wahrscheinlichkeit eins.",
          "Der Startpunkt spielt keine Rolle. Jeder Sprung verkleinert den Abstand zum Attraktor um den Faktor 1 − r. Bei r = 0,5 ist ein Anfangsfehler von einer ganzen Bildbreite nach etwa zehn Sprüngen kleiner als ein Pixel.",
        ],
        formula: "p_{k+1} = p_k + r\\,(v_i - p_k), \\qquad i \\text{ zufällig gewählt}",
      },
      {
        heading: "Was die Regler bewirken",
        paragraphs: [
          "«Ecken n» reicht von 3 bis 8, das Sprungverhältnis r von 0,1 bis 0,9. Ist «Magisches Verhältnis automatisch» aktiv, wird r auf den Wert gesetzt, bei dem sich die n verkleinerten Kopien des Vielecks gerade berühren, ohne sich zu überlappen: 0,5 für Dreieck und Quadrat, etwa 0,618 (eins durch den Goldenen Schnitt) für das Fünfeck, 2/3 für das Sechseck und etwa 0,7071 (eins durch Wurzel 2) für das Achteck. Bewegst du den Regler von Hand, schaltet sich das ab.",
          "«Einschränkung» legt fest, welche Ecke als Nächstes erlaubt ist, abhängig von der vorigen Wahl. «Keine Wiederholung» verbietet, dieselbe Ecke zweimal hintereinander zu wählen. «Kein Nachbar» verbietet die beiden Ecken neben der letzten. «Kein Gegenüber» verbietet die direkt gegenüberliegende Ecke, bei ungeradem n die beiden, die fast gegenüber liegen. Dieses Gedächtnis von einem Schritt schneidet Löcher in Formen, die sonst gefüllt wären.",
          "«Geschwindigkeit» bestimmt, wie viele Punkte pro Animationsbild dazukommen, von 100 bis 50.000, Startwert 1500. Die vier Voreinstellungen laden ein Dreieck mit r = 0,5, ein Quadrat mit r = 0,5 und «Keine Wiederholung», ein Fünfeck mit seinem magischen Verhältnis und Barnsleys Farn. «Leeren» löscht die Fläche, ebenso jede Änderung an Regel, Geschwindigkeit oder Farbe, damit der Zähler immer zum Bild passt.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Die Ecken liegen auf einem Kreis, der die Zeichenfläche bis auf einen Rand von 24 Pixeln ausfüllt, die erste Ecke oben. Jedes Bild durchläuft eine enge Schleife: zufällige Ecke ziehen, verwerfen, falls die Einschränkung sie verbietet (nach 64 Versuchen wird aufgegeben, damit eine Regel, die alles verbietet, die Seite nicht einfriert), springen, die Wahl merken und ein einzelnes Pixel mit leicht transparenter Farbe setzen. Weil die Punkte durchscheinend sind, werden oft besuchte Stellen heller.",
          "Der Farn nutzt dieselbe Mechanik mit vier affinen Abbildungen statt n Eckensprüngen. Jede Abbildung ist eine Matrix plus Verschiebung und wird mit den Wahrscheinlichkeiten 1, 85, 7 und 7 Prozent gewählt: Die seltene staucht alles auf den Stiel, die häufige kopiert den ganzen Farn etwas kleiner und weiter oben, die beiden anderen erzeugen die untersten Wedel links und rechts.",
          "Nach zwei Millionen Punkten ist der Attraktor so dicht, wie er werden kann, und die Schleife hört auf, statt endlos weiterzurechnen. Der Punktzähler wird etwa zehnmal pro Sekunde aktualisiert, nicht in jedem Bild. Wünscht dein System reduzierte Bewegung, gibt es keine Animation: 200.000 Punkte werden auf einmal berechnet und das fertige Bild in einem einzigen Frame gezeichnet.",
        ],
        code: LOOP_EXCERPT,
      },
      {
        heading: "Warum das magische Verhältnis magisch ist",
        paragraphs: [
          "Unterhalb des magischen Verhältnisses überlappen sich die n Kopien und verschmieren zu einer fast gefüllten Fläche. Oberhalb driften sie auseinander, und der Attraktor zerfällt in einzelne Staubwolken. Genau beim magischen Wert berühren sich die Kopien, Kante an Kante oder Ecke an Ecke, und es entsteht ein sauberes selbstähnliches Fraktal. Beim Quadrat passiert etwas Besonderes: Mit dem magischen Wert 0,5 kacheln die vier Kopien das Quadrat lückenlos, das einfache Chaosspiel füllt es also nur mit gleichmäßigem Rauschen. Deshalb nutzt die Quadrat-Voreinstellung zusätzlich «Keine Wiederholung».",
        ],
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Das Dreieck in Staub zerlegen",
        text: "Lade die Dreieck-Voreinstellung und zieh r von 0,5 auf 0,6. Die drei Kopien trennen sich, und das Sierpinski-Dreieck zerfällt in immer feinere Grüppchen. Zieh r auf 0,4, und die Lücken schließen sich, bis das Dreieck fast voll ist.",
      },
      {
        title: "Eine Regel ohne Wahl",
        text: "Stell n = 3 ein und wähle «Kein Nachbar». Im Dreieck ist jede andere Ecke ein Nachbar, die Wanderung kann also nur dieselbe Ecke erneut wählen. Alle Punkte landen in einer einzigen Ecke, und die Fläche bleibt fast leer.",
      },
      {
        title: "Aus dem Quadrat wird eine Linie",
        text: "Stell n = 4 mit r = 0,5 ein und wähle «Kein Nachbar». Erlaubt sind nur dieselbe oder die gegenüberliegende Ecke, die Wanderung ist also auf einer Diagonale gefangen. Vergleich danach «Kein Gegenüber» und «Keine Wiederholung».",
      },
      {
        title: "Dem Farn beim Wachsen zusehen",
        text: "Wähle die Voreinstellung Barnsley-Farn und stell die Geschwindigkeit auf 100. Der obere Farn wird am schnellsten scharf, weil 85 Prozent aller Sprünge in ihm landen. Die beiden untersten Wedel bekommen jeweils nur 7 Prozent der Punkte, der Hauptstiel gerade 1 Prozent, deshalb bleibt er am längsten blass.",
      },
    ],
  },
  es: {
    metaDescription:
      "Juega al juego del caos en vivo: elige vértices, razón de salto y reglas, y mira cómo surgen el triángulo de Sierpiński o el helecho de Barnsley del puro azar.",
    heading: "Cómo funciona este explorador",
    intro:
      "Cada punto del lienzo sale de una sola regla aplicada una y otra vez: elige al azar un vértice del polígono y salta parte del camino hacia él. Nada en la regla habla de triángulos dentro de triángulos y, sin embargo, tras unos pocos miles de saltos el triángulo de Sierpiński es inconfundible. El azar solo decide el orden en que se rellena la imagen; la forma queda fijada por los vértices y la razón de salto. Fue Michael Barnsley quien dio nombre a este juego.",
    sections: [
      {
        heading: "La regla",
        paragraphs: [
          "Coloca n vértices, de v₁ a vₙ, en un polígono regular y empieza en cualquier sitio. En cada paso elige un vértice vᵢ y mueve el punto actual p una fracción r del camino hacia él. Con r = 0,5 caes justo a la mitad. Cada movimiento es una contracción que encoge el plano por el factor 1 − r hacia su vértice. El conjunto formado por copias encogidas de sí mismo bajo estas aplicaciones es el atractor de un sistema de funciones iteradas, y el paseo aleatorio lo va dibujando.",
          "El punto de partida no importa. Cada salto reduce la distancia al atractor por el factor 1 − r, de modo que con r = 0,5 un error inicial de todo un lienzo queda por debajo de un píxel tras unos diez saltos.",
        ],
        formula: "p_{k+1} = p_k + r\\,(v_i - p_k), \\qquad i \\text{ elegido al azar}",
      },
      {
        heading: "Qué hacen los controles",
        paragraphs: [
          "«Vértices n» va de 3 a 8, la razón de salto r de 0,1 a 0,9. Con «Razón mágica automática» activada, r toma el valor con el que las n copias encogidas se tocan justo sin solaparse: 0,5 para el triángulo y el cuadrado, aproximadamente 0,618 (uno entre el número áureo) para el pentágono, 2/3 para el hexágono y aproximadamente 0,7071 (uno entre la raíz cuadrada de 2) para el octógono. Si mueves el deslizador a mano, esto se desactiva.",
          "«Restricción» cambia qué vértice puede elegirse a continuación, en función de la elección anterior. «Sin repetir» prohíbe elegir el mismo vértice dos veces seguidas. «Sin vecino» prohíbe los dos vértices contiguos al último. «Sin opuesto» prohíbe el vértice situado justo enfrente o, si n es impar, los dos vértices que están casi enfrente. Esta memoria de un solo paso abre huecos en formas que de otro modo serían macizas.",
          "«Velocidad» fija cuántos puntos se añaden por fotograma, de 100 a 50 000, empezando en 1500. Los cuatro preajustes cargan un triángulo con r = 0,5, un cuadrado con r = 0,5 y «Sin repetir», un pentágono con su razón mágica y el helecho de Barnsley. «Borrar» limpia el lienzo, igual que cualquier cambio de regla, velocidad o color, de modo que el contador siempre coincide con la imagen.",
        ],
      },
      {
        heading: "Cómo está construido",
        paragraphs: [
          "Los vértices se sitúan sobre una circunferencia que ocupa el lienzo salvo un margen de 24 píxeles, con el primer vértice arriba. Cada fotograma ejecuta un bucle muy ajustado: sortea un vértice, lo rechaza si la restricción lo prohíbe (y se rinde tras 64 intentos, para que una regla que lo prohíbe todo no pueda congelar la página), salta, recuerda la elección y pinta un único píxel con un relleno ligeramente transparente. Como los puntos son translúcidos, los lugares más visitados se vuelven más brillantes.",
          "El helecho usa la misma maquinaria con cuatro aplicaciones afines en lugar de n saltos hacia vértices. Cada aplicación es una matriz más un desplazamiento, elegida con probabilidades del 1, 85, 7 y 7 por ciento: la menos frecuente lo aplasta todo sobre el tallo, la más frecuente copia el helecho entero algo más pequeño y más arriba, y las otras dos producen las frondas inferiores izquierda y derecha.",
          "Tras dos millones de puntos el bucle se detiene, porque la imagen ya no puede hacerse más densa. El contador se actualiza unas diez veces por segundo. Si tu sistema pide movimiento reducido, no hay animación: se calculan 200 000 puntos de una vez y la imagen terminada se dibuja en un único fotograma.",
        ],
        code: LOOP_EXCERPT,
      },
      {
        heading: "Por qué la razón mágica es mágica",
        paragraphs: [
          "Por debajo de la razón mágica las copias se solapan y se emborronan hacia una región rellena; por encima se separan hasta quedar en polvo. Justo en el valor mágico las copias se besan, lado con lado o esquina con esquina, y el resultado es un fractal autosemejante limpio. Con el cuadrado pasa algo especial: la razón mágica 0,5 hace que las cuatro copias teselen el cuadrado a la perfección, así que el juego del caos sin más solo lo rellena de ruido uniforme. Por eso el preajuste del cuadrado añade la regla «Sin repetir».",
        ],
      },
    ],
    experimentsHeading: "Prueba esto",
    experiments: [
      {
        title: "Reduce el triángulo a polvo",
        text: "Carga el preajuste «Triángulo» y arrastra r de 0,5 a 0,6. Las tres copias se separan y el triángulo de Sierpiński se deshace en cúmulos cada vez más finos. En 0,4 los huecos se cierran y el triángulo queda casi macizo.",
      },
      {
        title: "Una regla que no deja elección",
        text: "Pon n = 3 y elige «Sin vecino». En un triángulo cualquier otro vértice es vecino, así que el paseo solo puede volver a elegir la misma esquina. Todos los puntos se amontonan en un vértice y el lienzo queda casi vacío.",
      },
      {
        title: "Convierte un cuadrado en una línea",
        text: "Pon n = 4 con r = 0,5 y elige «Sin vecino». Solo se permite el mismo vértice o el opuesto, así que el paseo queda atrapado en una diagonal. Compara después «Sin opuesto» y «Sin repetir».",
      },
      {
        title: "Mira crecer el helecho",
        text: "Elige el preajuste «Helecho de Barnsley» y pon «Velocidad» en 100. La parte superior del helecho se define antes porque el 85 por ciento de los saltos cae en ella. Las dos frondas inferiores reciben solo un 7 por ciento de los puntos cada una, y el tallo principal apenas un 1 por ciento, así que es lo que más tarda en verse.",
      },
    ],
  },
  fr: {
    metaDescription:
      "Joue au jeu du chaos en direct : règle sommets, ratio de saut et restrictions, et vois naître le triangle de Sierpiński ou la fougère de Barnsley du hasard.",
    heading: "Comment fonctionne cet explorateur",
    intro:
      "Chaque point du canevas provient d'une seule règle appliquée encore et encore : choisis au hasard un sommet du polygone et saute d'une partie du chemin dans sa direction. Rien dans la règle ne parle de triangles dans des triangles, et pourtant, après quelques milliers de sauts, le triangle de Sierpiński est reconnaissable entre tous. Le hasard ne décide que de l'ordre dans lequel l'image se remplit ; la forme est fixée par les sommets et le ratio de saut. C'est Michael Barnsley qui a donné son nom à ce jeu.",
    sections: [
      {
        heading: "La règle",
        paragraphs: [
          "Place n sommets, de v₁ à vₙ, sur un polygone régulier et pars de n'importe où. À chaque étape, choisis un sommet vᵢ et déplace le point courant p d'une fraction r du chemin vers lui. Avec r = 0,5, tu arrives exactement à mi-chemin. Chaque déplacement est une contraction qui rétrécit le plan d'un facteur 1 − r vers son sommet. L'ensemble formé de copies rétrécies de lui-même par ces applications est l'attracteur d'un système de fonctions itérées, et la marche aléatoire le dessine peu à peu.",
          "Le point de départ n'a aucune importance. Chaque saut réduit la distance à l'attracteur d'un facteur 1 − r, si bien qu'avec r = 0,5 une erreur initiale de tout un canevas passe sous le pixel après une dizaine de sauts.",
        ],
        formula: "p_{k+1} = p_k + r\\,(v_i - p_k), \\qquad i \\text{ choisi au hasard}",
      },
      {
        heading: "À quoi servent les commandes",
        paragraphs: [
          "« Sommets n » va de 3 à 8, le ratio de saut r de 0,1 à 0,9. Quand « Ratio magique auto » est activé, r prend la valeur pour laquelle les n copies rétrécies se touchent tout juste sans se chevaucher : 0,5 pour le triangle et le carré, environ 0,618 (l'inverse du nombre d'or) pour le pentagone, 2/3 pour l'hexagone et environ 0,7071 (l'inverse de la racine carrée de 2) pour l'octogone. Déplacer le curseur à la main désactive ce réglage.",
          "« Restriction » modifie le sommet qui peut être choisi ensuite, en fonction du choix précédent. « Sans répétition » interdit de choisir deux fois de suite le même sommet. « Sans voisin » interdit les deux sommets voisins du dernier. « Sans opposé » interdit le sommet situé juste en face ou, pour n impair, les deux sommets qui sont presque en face. Cette mémoire d'un seul coup creuse des trous dans des formes qui seraient pleines autrement.",
          "« Vitesse » règle le nombre de points ajoutés par image, de 100 à 50\u00a0000, avec 1\u00a0500 au départ. Les quatre préréglages chargent un triangle avec r = 0,5, un carré avec r = 0,5 et « Sans répétition », un pentagone avec son ratio magique, et la fougère de Barnsley. « Effacer » vide le canevas, tout comme n'importe quel changement de règle, de vitesse ou de couleur, si bien que le compteur correspond toujours à l'image.",
        ],
      },
      {
        heading: "Comment c'est construit",
        paragraphs: [
          "Les sommets sont posés sur un cercle qui remplit le canevas à une marge de 24 pixels près, le premier sommet en haut. Chaque image exécute une boucle serrée : tirer un sommet au hasard, le rejeter si la restriction l'interdit (en abandonnant après 64 tentatives, pour qu'une règle qui interdit tout ne puisse pas figer la page), sauter, mémoriser le choix et tracer un unique pixel avec un remplissage légèrement transparent. Comme les points sont translucides, les endroits souvent visités deviennent plus lumineux.",
          "La fougère utilise la même mécanique avec quatre applications affines au lieu de n sauts vers des sommets. Chaque application est une matrice plus une translation, choisie avec des probabilités de 1, 85, 7 et 7 pour cent : la plus rare écrase tout sur la tige, la plus fréquente recopie la fougère entière un peu plus petite et un peu plus haut, et les deux autres produisent les frondes les plus basses, à gauche et à droite.",
          "Au bout de deux millions de points, la boucle s'arrête, puisque l'image ne peut plus devenir plus dense. Le compteur se met à jour une dizaine de fois par seconde. Si ton système demande de réduire les animations, il n'y a pas d'animation : 200\u00a0000 points sont calculés d'un coup et l'image terminée est dessinée en une seule fois.",
        ],
        code: LOOP_EXCERPT,
      },
      {
        heading: "Pourquoi le ratio magique est magique",
        paragraphs: [
          "En dessous du ratio magique, les copies se chevauchent et s'étalent jusqu'à former une région pleine ; au-dessus, elles s'écartent et se dispersent en poussière. À la valeur magique exacte, les copies s'effleurent, côté contre côté ou coin contre coin, et le résultat est une fractale autosimilaire bien nette. Pour le carré, il se passe quelque chose de particulier : le ratio magique 0,5 fait que les quatre copies pavent parfaitement le carré, si bien que le jeu du chaos ordinaire ne fait que le remplir d'un bruit uniforme. C'est pourquoi le préréglage du carré ajoute la règle « Sans répétition ».",
        ],
      },
    ],
    experimentsHeading: "À essayer",
    experiments: [
      {
        title: "Réduis le triangle en poussière",
        text: "Charge le préréglage « Triangle » et fais passer r de 0,5 à 0,6. Les trois copies se séparent et le triangle de Sierpiński se défait en amas de plus en plus fins. À 0,4, les vides se referment et le triangle est presque plein.",
      },
      {
        title: "Une règle qui ne laisse aucun choix",
        text: "Règle n = 3 et choisis « Sans voisin ». Dans un triangle, tout autre sommet est un voisin, donc la marche ne peut que reprendre le même coin. Tous les points s'entassent sur un seul sommet et le canevas reste presque vide.",
      },
      {
        title: "Transforme un carré en ligne",
        text: "Règle n = 4 avec r = 0,5 et choisis « Sans voisin ». Seuls le même sommet ou le sommet opposé sont autorisés, donc la marche reste prisonnière d'une diagonale. Compare ensuite « Sans opposé » et « Sans répétition ».",
      },
      {
        title: "Regarde pousser la fougère",
        text: "Choisis le préréglage « Fougère de Barnsley » et règle « Vitesse » sur 100. Le haut de la fougère se précise le plus vite, car 85 pour cent des sauts y atterrissent. Les deux frondes les plus basses ne reçoivent chacune que 7 pour cent des points, et la tige principale seulement 1 pour cent, si bien qu'elle reste pâle le plus longtemps.",
      },
    ],
  },
  it: {
    metaDescription:
      "Gioca al gioco del caos dal vivo: scegli vertici, rapporto di salto e regole e guarda nascere il triangolo di Sierpiński o la felce di Barnsley dal puro caso.",
    heading: "Come funziona questo esploratore",
    intro:
      "Ogni punto sul canvas nasce da un'unica regola applicata più e più volte: scegli a caso un vertice del poligono e salta per una parte del tragitto verso di esso. Nulla nella regola parla di triangoli dentro triangoli, eppure dopo qualche migliaio di salti il triangolo di Sierpiński è inconfondibile. Il caso decide soltanto l'ordine in cui l'immagine si riempie; la forma è fissata dai vertici e dal rapporto di salto. È stato Michael Barnsley a dare il nome a questo gioco.",
    sections: [
      {
        heading: "La regola",
        paragraphs: [
          "Disponi n vertici, da v₁ a vₙ, su un poligono regolare e parti da un punto qualsiasi. A ogni passo scegli un vertice vᵢ e sposta il punto corrente p di una frazione r del tragitto verso di esso. Con r = 0,5 arrivi esattamente a metà strada. Ogni mossa è una contrazione che rimpicciolisce il piano del fattore 1 − r verso il proprio vertice. L'insieme formato da copie rimpicciolite di sé stesso sotto queste mappe è l'attrattore di un sistema di funzioni iterate, e la passeggiata casuale lo disegna a poco a poco.",
          "Il punto di partenza non conta. Ogni salto riduce la distanza dall'attrattore del fattore 1 − r, quindi con r = 0,5 un errore iniziale grande quanto l'intero canvas scende sotto il pixel dopo una decina di salti.",
        ],
        formula: "p_{k+1} = p_k + r\\,(v_i - p_k), \\qquad i \\text{ scelto a caso}",
      },
      {
        heading: "Che cosa fanno i controlli",
        paragraphs: [
          "«Vertici n» va da 3 a 8, il rapporto di salto r da 0,1 a 0,9. Con «Rapporto magico automatico» attivo, r assume il valore per cui le n copie rimpicciolite si toccano appena senza sovrapporsi: 0,5 per il triangolo e il quadrato, circa 0,618 (uno diviso la sezione aurea) per il pentagono, 2/3 per l'esagono e circa 0,7071 (uno diviso la radice quadrata di 2) per l'ottagono. Se muovi il cursore a mano, l'opzione si disattiva.",
          "«Restrizione» cambia quale vertice può essere scelto al passo successivo, in base alla scelta precedente. «Senza ripetizione» vieta di scegliere lo stesso vertice due volte di fila. «Nessun vicino» vieta i due vertici accanto all'ultimo. «Nessun opposto» vieta il vertice direttamente di fronte oppure, per n dispari, i due vertici che stanno quasi di fronte. Questa memoria di un solo passo scava buchi in forme che altrimenti sarebbero piene.",
          "«Velocità» imposta quanti punti vengono aggiunti per fotogramma, da 100 a 50.000, partendo da 1500. I quattro preset caricano un triangolo con r = 0,5, un quadrato con r = 0,5 e «Senza ripetizione», un pentagono con il suo rapporto magico e la felce di Barnsley. «Pulisci» svuota il canvas, come fa qualsiasi cambio di regola, velocità o colore, così il contatore corrisponde sempre all'immagine.",
        ],
      },
      {
        heading: "Com'è costruito",
        paragraphs: [
          "I vertici stanno su una circonferenza che riempie il canvas a meno di un margine di 24 pixel, con il primo vertice in alto. Ogni fotogramma esegue un ciclo serrato: estrae un vertice a caso, lo scarta se la restrizione lo vieta (rinunciando dopo 64 tentativi, così una regola che vieta tutto non può bloccare la pagina), salta, ricorda la scelta e disegna un singolo pixel con un riempimento leggermente trasparente. Poiché i punti sono traslucidi, i luoghi visitati più spesso diventano più luminosi.",
          "La felce usa lo stesso meccanismo con quattro mappe affini al posto degli n salti verso i vertici. Ogni mappa è una matrice più una traslazione, scelta con probabilità dell'1, dell'85, del 7 e del 7 per cento: quella rara schiaccia tutto sullo stelo, quella comune copia l'intera felce un po' più piccola e più in alto, e le altre due producono le fronde più basse a sinistra e a destra.",
          "Dopo due milioni di punti il ciclo si ferma, perché l'immagine non può diventare più densa. Il contatore si aggiorna circa dieci volte al secondo. Se il tuo sistema chiede di ridurre il movimento, non c'è alcuna animazione: 200.000 punti vengono calcolati in una volta sola e l'immagine finita è disegnata in un unico fotogramma.",
        ],
        code: LOOP_EXCERPT,
      },
      {
        heading: "Perché il rapporto magico è magico",
        paragraphs: [
          "Sotto il rapporto magico le copie si sovrappongono e si impastano fino a formare una regione piena; sopra si allontanano e si sbriciolano in polvere. Esattamente al valore magico le copie si sfiorano, lato contro lato o angolo contro angolo, e il risultato è un frattale autosimile pulito. Per il quadrato succede qualcosa di speciale: con il rapporto magico 0,5 le quattro copie tassellano perfettamente il quadrato, quindi il semplice gioco del caos lo riempie solo di rumore uniforme. Per questo il preset del quadrato aggiunge la regola «Senza ripetizione».",
        ],
      },
    ],
    experimentsHeading: "Prova così",
    experiments: [
      {
        title: "Riduci il triangolo in polvere",
        text: "Carica il preset «Triangolo» e trascina r da 0,5 fino a 0,6. Le tre copie si separano e il triangolo di Sierpiński si sfalda in grappoli sempre più fini. A 0,4 i vuoti si chiudono e il triangolo è quasi pieno.",
      },
      {
        title: "Una regola che non lascia scelta",
        text: "Imposta n = 3 e scegli «Nessun vicino». In un triangolo ogni altro vertice è un vicino, quindi la passeggiata può solo scegliere di nuovo lo stesso angolo. Tutti i punti si ammucchiano in un vertice e il canvas resta quasi vuota.",
      },
      {
        title: "Trasforma un quadrato in una linea",
        text: "Imposta n = 4 con r = 0,5 e scegli «Nessun vicino». Sono ammessi solo lo stesso vertice o quello opposto, quindi la passeggiata resta intrappolata su una diagonale. Poi confronta «Nessun opposto» e «Senza ripetizione».",
      },
      {
        title: "Guarda crescere la felce",
        text: "Scegli il preset «Felce di Barnsley» e imposta «Velocità» su 100. La parte alta della felce si definisce per prima, perché l'85 per cento di tutti i salti finisce lì. Le due fronde più basse ricevono ciascuna solo il 7 per cento dei punti, e lo stelo principale appena l'1 per cento, quindi resta sbiadito più a lungo.",
      },
    ],
  },
  pt: {
    metaDescription:
      "Joga o jogo do caos ao vivo: ajusta vértices, razão de salto e regras e vê o triângulo de Sierpinski ou o feto de Barnsley surgirem de saltos ao acaso.",
    heading: "Como funciona este explorador",
    intro:
      "Cada ponto no canvas vem de uma única regra aplicada repetidas vezes: escolhe ao acaso um vértice do polígono e salta parte do caminho na direção dele. Nada na regra fala de triângulos dentro de triângulos e, mesmo assim, depois de alguns milhares de saltos o triângulo de Sierpinski é inconfundível. O acaso decide apenas a ordem em que a imagem se preenche; a forma é fixada pelos vértices e pela razão de salto. Foi Michael Barnsley quem deu nome a este jogo.",
    sections: [
      {
        heading: "A regra",
        paragraphs: [
          "Coloca n vértices, de v₁ a vₙ, num polígono regular e começa em qualquer lugar. A cada passo, escolhe um vértice vᵢ e move o ponto atual p uma fração r do caminho até ele. Com r = 0,5 ficas exatamente a meio caminho. Cada movimento é uma contração que encolhe o plano pelo fator 1 − r em direção ao seu vértice. O conjunto formado por cópias encolhidas de si mesmo sob estas aplicações é o atrator de um sistema de funções iteradas, e o passeio aleatório vai desenhando esse conjunto.",
          "O ponto de partida não importa. Cada salto reduz a distância ao atrator pelo fator 1 − r, de modo que, com r = 0,5, um erro inicial do tamanho do canvas inteiro fica abaixo de um píxel depois de uns dez saltos.",
        ],
        formula: "p_{k+1} = p_k + r\\,(v_i - p_k), \\qquad i \\text{ escolhido ao acaso}",
      },
      {
        heading: "O que fazem os controlos",
        paragraphs: [
          "«Vértices n» vai de 3 a 8, a razão de salto r de 0,1 a 0,9. Com «Razão mágica automática» ativada, r assume o valor em que as n cópias encolhidas apenas se tocam, sem se sobreporem: 0,5 para o triângulo e o quadrado, cerca de 0,618 (um a dividir pela razão áurea) para o pentágono, 2/3 para o hexágono e cerca de 0,7071 (um a dividir pela raiz quadrada de 2) para o octógono. Mover o cursor à mão desativa essa opção.",
          "«Restrição» altera o vértice que pode ser escolhido a seguir, com base na escolha anterior. «Sem repetir» proíbe escolher o mesmo vértice duas vezes seguidas. «Sem vizinho» proíbe os dois vértices ao lado do último. «Sem oposto» proíbe o vértice diretamente em frente ou, para n ímpar, os dois vértices que ficam quase em frente. Esta memória de um único passo abre buracos em formas que, de outro modo, seriam sólidas.",
          "«Velocidade» define quantos pontos são acrescentados por fotograma, de 100 a 50\u00a0000, começando em 1500. As quatro predefinições carregam um triângulo com r = 0,5, um quadrado com r = 0,5 e «Sem repetir», um pentágono com a sua razão mágica e o feto de Barnsley. «Limpar» apaga o canvas, tal como qualquer mudança de regra, velocidade ou cor, pelo que o contador corresponde sempre à imagem.",
        ],
      },
      {
        heading: "Como está construído",
        paragraphs: [
          "Os vértices ficam sobre um círculo que preenche o canvas, menos uma margem de 24 píxeis, com o primeiro vértice no topo. Cada fotograma executa um ciclo apertado: sorteia um vértice, rejeita o sorteio se a restrição o proibir (desistindo após 64 tentativas, para que uma regra que proíbe tudo não consiga bloquear a página), salta, guarda a escolha e pinta um único píxel com um preenchimento ligeiramente transparente. Como os pontos são translúcidos, os lugares mais visitados ficam mais claros.",
          "O feto usa o mesmo mecanismo com quatro aplicações afins em vez de n saltos em direção aos vértices. Cada aplicação é uma matriz mais um deslocamento, escolhida com probabilidades de 1, 85, 7 e 7 por cento: a rara achata tudo sobre o caule, a comum copia o feto inteiro um pouco mais pequeno e mais acima, e as outras duas produzem as frondes mais baixas, à esquerda e à direita.",
          "Depois de dois milhões de pontos o ciclo para, já que a imagem não pode ficar mais densa. O contador é atualizado cerca de dez vezes por segundo. Se o teu sistema pedir movimento reduzido, não há animação: 200\u00a0000 pontos são calculados de uma vez e a imagem final é desenhada num único fotograma.",
        ],
        code: LOOP_EXCERPT,
      },
      {
        heading: "Porque é que a razão mágica é mágica",
        paragraphs: [
          "Abaixo da razão mágica, as cópias sobrepõem-se e esbatem-se em direção a uma região preenchida; acima dela, afastam-se e desfazem-se em poeira. Exatamente no valor mágico as cópias beijam-se, lado com lado ou canto com canto, e o resultado é um fractal autossemelhante limpo. Com o quadrado acontece algo especial: a razão mágica 0,5 faz as quatro cópias pavimentarem o quadrado na perfeição, pelo que o jogo do caos simples apenas o preenche com ruído uniforme. É por isso que a predefinição do quadrado acrescenta a regra «Sem repetir».",
        ],
      },
    ],
    experimentsHeading: "Experimenta isto",
    experiments: [
      {
        title: "Desfaz o triângulo em poeira",
        text: "Carrega a predefinição «Triângulo» e arrasta r de 0,5 até 0,6. As três cópias separam-se e o triângulo de Sierpinski desfaz-se em aglomerados cada vez mais finos. Com r = 0,4 as lacunas fecham-se e o triângulo fica quase sólido.",
      },
      {
        title: "Uma regra que não deixa escolha",
        text: "Põe n = 3 e escolhe «Sem vizinho». Num triângulo, qualquer outro vértice é vizinho, pelo que o passeio só pode escolher de novo o mesmo canto. Todos os pontos se amontoam num vértice e o canvas fica quase vazio.",
      },
      {
        title: "Transforma um quadrado numa linha",
        text: "Põe n = 4 com r = 0,5 e escolhe «Sem vizinho». Só são permitidos o mesmo vértice ou o oposto, pelo que o passeio fica preso numa diagonal. Depois compara «Sem oposto» e «Sem repetir».",
      },
      {
        title: "Vê o feto crescer",
        text: "Escolhe a predefinição «Feto de Barnsley» e põe «Velocidade» em 100. A parte de cima do feto ganha nitidez mais depressa porque 85 por cento de todos os saltos caem nela. As duas frondes mais baixas recebem apenas 7 por cento dos pontos cada uma, e o caule principal só 1 por cento, por isso é o que fica ténue durante mais tempo.",
      },
    ],
  },
  sv: {
    metaDescription:
      "Spela kaosspelet live: välj hörn, hoppkvot och begränsningar och se hur Sierpiński-triangeln eller Barnsleys ormbunke växer fram ur helt slumpmässiga hopp.",
    heading: "Så fungerar den här utforskaren",
    intro:
      "Varje prick på ritytan kommer från en enda regel som tillämpas om och om igen: välj ett av månghörningens hörn på måfå och hoppa en del av vägen mot det. Ingenting i regeln nämner trianglar inuti trianglar, och ändå går Sierpiński-triangeln inte att ta miste på efter några tusen hopp. Slumpen avgör bara i vilken ordning bilden fylls i; formen bestäms av hörnen och hoppkvoten. Det var Michael Barnsley som gav spelet dess namn.",
    sections: [
      {
        heading: "Regeln",
        paragraphs: [
          "Placera n hörn, v₁ till vₙ, på en regelbunden månghörning och börja var som helst. I varje steg väljer du ett hörn vᵢ och flyttar den aktuella punkten p andelen r av vägen mot det. Med r = 0,5 hamnar du exakt halvvägs. Varje drag är en kontraktion som krymper planet med faktorn 1 − r in mot sitt hörn. Den mängd som består av krympta kopior av sig själv under de här avbildningarna är attraktorn till ett itererat funktionssystem, och slumpvandringen ritar upp den.",
          "Startpunkten spelar ingen roll. Varje hopp krymper avståndet till attraktorn med faktorn 1 − r, så med r = 0,5 är ett startfel på en hel rityta mindre än en pixel efter ungefär tio hopp.",
        ],
        formula: "p_{k+1} = p_k + r\\,(v_i - p_k), \\qquad i \\text{ väljs slumpmässigt}",
      },
      {
        heading: "Vad reglagen gör",
        paragraphs: [
          "”Hörn n” går från 3 till 8, hoppkvoten r från 0,1 till 0,9. När ”Magisk kvot automatiskt” är på sätts r till det värde där de n krympta kopiorna precis rör vid varandra utan att överlappa: 0,5 för triangeln och kvadraten, ungefär 0,618 (ett genom gyllene snittet) för femhörningen, 2/3 för sexhörningen och ungefär 0,7071 (ett genom roten ur 2) för åttahörningen. Flyttar du reglaget för hand stängs det här av.",
          "”Begränsning” ändrar vilket hörn som får väljas härnäst, utifrån det föregående valet. ”Ingen upprepning” förbjuder att samma hörn väljs två gånger i rad. ”Ingen granne” förbjuder de två hörnen intill det senaste. ”Ingen motsatt” förbjuder hörnet rakt över eller, för udda n, de två hörn som ligger nästan rakt över. Det här minnet på ett enda steg karvar hål i former som annars skulle vara fyllda.",
          "”Hastighet” bestämmer hur många punkter som läggs till per bildruta, från 100 till 50\u00a0000, med 1500 som startvärde. De fyra förvalen laddar en triangel med r = 0,5, en kvadrat med r = 0,5 och ”Ingen upprepning”, en femhörning med sin magiska kvot och Barnsleys ormbunke. ”Rensa” tömmer ritytan, och det gör också varje ändring av regel, hastighet eller färg, så att räknaren alltid stämmer med bilden.",
        ],
      },
      {
        heading: "Hur den är byggd",
        paragraphs: [
          "Hörnen ligger på en cirkel som fyller ritytan så när som på en marginal på 24 pixlar, med det första hörnet överst. Varje bildruta kör en snäv slinga: dra ett slumpmässigt hörn, förkasta det om begränsningen förbjuder det (och ge upp efter 64 försök, så att en regel som förbjuder allt inte kan frysa sidan), hoppa, kom ihåg valet och rita en enda pixel med en lätt genomskinlig fyllning. Eftersom prickarna är halvgenomskinliga blir ofta besökta ställen ljusare.",
          "Ormbunken använder samma maskineri med fyra affina avbildningar i stället för n hopp mot hörn. Varje avbildning är en matris plus en förskjutning och väljs med sannolikheterna 1, 85, 7 och 7 procent: den sällsynta trycker ihop allt till stjälken, den vanliga kopierar hela ormbunken lite mindre och högre upp, och de två andra ger de nedersta bladen till vänster och höger.",
          "Efter två miljoner punkter stannar slingan, eftersom bilden inte kan bli tätare. Räknaren uppdateras ungefär tio gånger per sekund. Om ditt system ber om minskad rörelse blir det ingen animation: 200\u00a0000 punkter räknas ut på en gång och den färdiga bilden ritas i en enda bildruta.",
        ],
        code: LOOP_EXCERPT,
      },
      {
        heading: "Varför den magiska kvoten är magisk",
        paragraphs: [
          "Under den magiska kvoten överlappar kopiorna och smetas ut mot ett fyllt område; över den glider de isär till damm. Exakt vid det magiska värdet kysser kopiorna varandra, kant mot kant eller hörn mot hörn, och resultatet är en ren självlik fraktal. För kvadraten händer något särskilt: med den magiska kvoten 0,5 täcker de fyra kopiorna kvadraten perfekt, så det vanliga kaosspelet fyller den bara med jämnt brus. Därför lägger kvadratförvalet till regeln ”Ingen upprepning”.",
        ],
      },
    ],
    experimentsHeading: "Prova det här",
    experiments: [
      {
        title: "Slå sönder triangeln till damm",
        text: "Ladda förvalet ”Triangel” och dra r från 0,5 upp till 0,6. De tre kopiorna skiljs åt och Sierpiński-triangeln faller isär i allt finare klungor. Vid 0,4 sluts luckorna och triangeln är nästan helt fylld.",
      },
      {
        title: "En regel som inte lämnar något val",
        text: "Ställ in n = 3 och välj ”Ingen granne”. I en triangel är vartenda annat hörn en granne, så vandringen kan bara välja samma hörn igen. Alla punkter hamnar i ett enda hörn och ritytan förblir nästan tom.",
      },
      {
        title: "Gör en linje av en kvadrat",
        text: "Ställ in n = 4 med r = 0,5 och välj ”Ingen granne”. Bara samma hörn eller det motsatta är tillåtet, så vandringen blir instängd på en diagonal. Jämför sedan ”Ingen motsatt” och ”Ingen upprepning”.",
      },
      {
        title: "Se ormbunken växa",
        text: "Välj förvalet ”Barnsleys ormbunke” och ställ ”Hastighet” på 100. Den övre delen av ormbunken blir skarp snabbast eftersom 85 procent av alla hopp landar där. De två nedersta bladen får bara 7 procent av punkterna var, och huvudstjälken bara 1 procent, så den förblir blek längst.",
      },
    ],
  },
  no: {
    metaDescription:
      "Spill kaosspillet live: Velg hjørner, hoppforhold og begrensninger, og se Sierpiński-trekanten eller Barnsleys bregne vokse fram av helt tilfeldige hopp.",
    heading: "Slik fungerer denne utforskeren",
    intro:
      "Hver prikk på lerretet kommer fra én regel som brukes om og om igjen: Velg et tilfeldig hjørne i mangekanten og hopp en del av veien mot det. Ingenting i regelen nevner trekanter inni trekanter, og likevel er Sierpiński-trekanten ikke til å ta feil av etter noen tusen hopp. Tilfeldighetene avgjør bare rekkefølgen bildet fylles i; formen er bestemt av hjørnene og hoppforholdet. Det var Michael Barnsley som ga spillet navnet.",
    sections: [
      {
        heading: "Regelen",
        paragraphs: [
          "Plasser n hjørner, v₁ til vₙ, på en regulær mangekant og start hvor som helst. I hvert steg velger du et hjørne vᵢ og flytter det gjeldende punktet p andelen r av veien mot det. Med r = 0,5 lander du nøyaktig halvveis. Hvert trekk er en kontraksjon som krymper planet med faktoren 1 − r inn mot hjørnet sitt. Mengden som består av krympede kopier av seg selv under disse avbildningene, er attraktoren til et iterert funksjonssystem, og den tilfeldige vandringen tegner den opp.",
          "Startpunktet spiller ingen rolle. Hvert hopp krymper avstanden til attraktoren med faktoren 1 − r, så med r = 0,5 er en startfeil på et helt lerret under én piksel etter omtrent ti hopp.",
        ],
        formula: "p_{k+1} = p_k + r\\,(v_i - p_k), \\qquad i \\text{ velges tilfeldig}",
      },
      {
        heading: "Hva kontrollene gjør",
        paragraphs: [
          "«Hjørner n» går fra 3 til 8, hoppforholdet r fra 0,1 til 0,9. Når «Magisk forhold automatisk» er på, settes r til verdien der de n krympede kopiene så vidt berører hverandre uten å overlappe: 0,5 for trekanten og kvadratet, omtrent 0,618 (én delt på det gylne snitt) for femkanten, 2/3 for sekskanten og omtrent 0,7071 (én delt på kvadratroten av 2) for åttekanten. Flytter du glidebryteren for hånd, slås dette av.",
          "«Begrensning» endrer hvilket hjørne som kan velges neste gang, ut fra det forrige valget. «Ingen gjentakelse» forbyr å velge samme hjørne to ganger på rad. «Ingen nabo» forbyr de to hjørnene ved siden av det siste. «Ingen motsatt» forbyr hjørnet rett overfor eller, for odde n, de to hjørnene som ligger nesten rett overfor. Dette minnet på ett enkelt steg skjærer hull i former som ellers ville vært fylte.",
          "«Hastighet» bestemmer hvor mange punkter som legges til per bilde, fra 100 til 50\u00a0000, med 1500 som startverdi. De fire forhåndsvalgene laster en trekant med r = 0,5, et kvadrat med r = 0,5 og «Ingen gjentakelse», en femkant med sitt magiske forhold og Barnsleys bregne. «Tøm» visker ut lerretet, og det gjør også enhver endring av regel, hastighet eller farge, slik at telleren alltid stemmer med bildet.",
        ],
      },
      {
        heading: "Slik er den bygget",
        paragraphs: [
          "Hjørnene ligger på en sirkel som fyller lerretet bortsett fra en marg på 24 piksler, med det første hjørnet øverst. Hvert bilde kjører en tett løkke: Trekk et tilfeldig hjørne, forkast det hvis begrensningen forbyr det (og gi opp etter 64 forsøk, slik at en regel som forbyr alt, ikke kan fryse siden), hopp, husk valget og tegn én enkelt piksel med en svakt gjennomsiktig fyllfarge. Fordi prikkene er halvgjennomsiktige, blir ofte besøkte steder lysere.",
          "Bregnen bruker det samme maskineriet med fire affine avbildninger i stedet for n hopp mot hjørner. Hver avbildning er en matrise pluss en forskyvning og velges med sannsynlighetene 1, 85, 7 og 7 prosent: Den sjeldne klemmer alt sammen på stilken, den vanlige kopierer hele bregnen litt mindre og høyere opp, og de to andre lager de nederste bladene til venstre og høyre.",
          "Etter to millioner punkter stopper løkken, siden bildet ikke kan bli tettere. Telleren oppdateres omtrent ti ganger i sekundet. Hvis systemet ditt ber om redusert bevegelse, er det ingen animasjon: 200\u00a0000 punkter beregnes på én gang, og det ferdige bildet tegnes i ett enkelt bilde.",
        ],
        code: LOOP_EXCERPT,
      },
      {
        heading: "Hvorfor det magiske forholdet er magisk",
        paragraphs: [
          "Under det magiske forholdet overlapper kopiene og smøres ut mot et fylt område; over det glir de fra hverandre og blir til støv. Nøyaktig ved den magiske verdien kysser kopiene hverandre, kant mot kant eller hjørne mot hjørne, og resultatet er en ren selvlik fraktal. For kvadratet skjer det noe spesielt: Med det magiske forholdet 0,5 dekker de fire kopiene kvadratet perfekt, så det vanlige kaosspillet fyller det bare med jevn støy. Derfor legger forhåndsvalget for kvadratet til regelen «Ingen gjentakelse».",
        ],
      },
    ],
    experimentsHeading: "Prøv dette",
    experiments: [
      {
        title: "Knus trekanten til støv",
        text: "Last forhåndsvalget «Trekant» og dra r fra 0,5 opp til 0,6. De tre kopiene skiller lag, og Sierpiński-trekanten faller fra hverandre i stadig finere klynger. Ved 0,4 lukkes hullene, og trekanten er nesten helt fylt.",
      },
      {
        title: "En regel som ikke gir noe valg",
        text: "Sett n = 3 og velg «Ingen nabo». I en trekant er begge de andre hjørnene naboer, så vandringen kan bare velge det samme hjørnet igjen. Alle punktene hoper seg opp i ett hjørne, og lerretet forblir nesten tom.",
      },
      {
        title: "Gjør et kvadrat om til en linje",
        text: "Sett n = 4 med r = 0,5 og velg «Ingen nabo». Bare det samme hjørnet eller det motsatte er tillatt, så vandringen er fanget på én diagonal. Sammenlign deretter «Ingen motsatt» og «Ingen gjentakelse».",
      },
      {
        title: "Se bregnen vokse",
        text: "Velg forhåndsvalget «Barnsleys bregne» og sett «Hastighet» til 100. Den øvre delen av bregnen blir skarp raskest fordi 85 prosent av alle hoppene lander der. De to nederste bladene får bare 7 prosent av punktene hver, og hovedstilken bare 1 prosent, så den forblir blek lengst.",
      },
    ],
  },
};
