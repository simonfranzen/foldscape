import type { ExplorerGuide } from "./types";

// Numbers quoted here (default weights 1.5 / 1.0 / 1.0, radii 80 and 25 px,
// the 0.05, 1/100 and 0.6 gains, the 500-boid cap, the 30 px edge margin)
// match app/boids/explorer/page.tsx; update both together.
const STEER_EXCERPT = `if (d2 > perR2 || d2 === 0) continue;
perCount++;
aliX += boids[j * 4 + 2];      // sum neighbour velocities
aliY += boids[j * 4 + 3];
cohX += dx;                    // sum displacements to neighbours
cohY += dy;
if (d2 < sepR2) {              // too close: push away, 1/distance weighted
  sepX += -dx / d2;
  sepY += -dy / d2;
  sepCount++;
}
// after the neighbour loop:
ax += (aliX / perCount - ivx) * p.wAli * 0.05;
ax += (cohX / perCount / 100) * p.wCoh;
ax += (sepX / Math.hypot(sepX, sepY)) * p.wSep * 0.6 * dpr;`;

const BOIDS_FORMULA =
  "\\vec v_i \\leftarrow \\vec v_i + w_s\\,\\vec a_{\\text{sep}} + w_a\\,\\vec a_{\\text{ali}} + w_c\\,\\vec a_{\\text{coh}}, \\qquad |\\vec v_i| \\le v_{\\max}";

export const BOIDS_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Tune Craig Reynolds' boids live: weight separation, alignment and cohesion, change the perception radius and watch a flock emerge from three local rules.",
    heading: "How this explorer works",
    intro:
      "Every small triangle on the canvas is a boid, a simulated bird that knows nothing about the flock as a whole. It only looks at the boids within a fixed radius around it and adjusts its velocity a little every frame. There is no leader, no target and no shared plan. Still, within a few seconds the scattered triangles line up into streams, merge into swarms and swirl around each other. The flock is not programmed anywhere; it emerges from the interactions.",
    sections: [
      {
        heading: "Three rules, nothing more",
        paragraphs: [
          "Craig Reynolds introduced boids in a paper presented at SIGGRAPH in 1987. Each boid follows three steering rules. Separation: move away from neighbours that are too close. Alignment: turn towards the average heading of the neighbours. Cohesion: move towards the average position of the neighbours. Each rule produces a small acceleration, the three are added with adjustable weights, and the sum changes the velocity.",
          "None of the rules mentions the flock. They only refer to what a single boid can see, which is why the model is a standard example of emergence: global order from purely local decisions. Switch off any one of the three and the collective behaviour changes in a characteristic way, which the experiments below let you see directly.",
        ],
        formula: BOIDS_FORMULA,
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "The three weight sliders scale the rules from 0 to 3. The defaults are separation 1.5, alignment 1.0 and cohesion 1.0; separation starts a bit stronger so the flock does not collapse into a single dot. The Active rules buttons switch a rule off entirely. For the motion that is the same as a weight of zero, but the toggle keeps your tuned weight, so one click brings it back.",
          "Perception radius (20 to 200 px, default 80) decides how far a boid can see. Separation radius (10 to 80 px, default 25) is the personal space inside which the push-away rule kicks in. Only boids that are already within the perception radius count for separation, so a separation radius larger than the perception radius has no extra effect. Max speed (1 to 8, default 4) caps the length of every velocity vector.",
          "The population slider ranges from 50 to 500 boids, default 220. + Cluster drops 30 new boids into a small disc in the centre with random headings, up to the same cap of 500. Reset scatters the current number of boids over the canvas with random positions and speeds. Edge behaviour switches between a torus, where a boid leaving on the right re-enters on the left, and a bounded box with walls.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "All boids live in one Float32Array with four numbers per boid: x, y, vx and vy. Each animation frame compares every boid with every other boid, which costs n squared distance checks: about 48,000 at the default 220 boids and about 250,000 at 500. That is cheap enough for a modern browser without a spatial grid. The new velocities go into a separate buffer first, so every boid reacts to the same snapshot of the flock rather than to neighbours that have already moved.",
          "Separation sums the vectors pointing away from close neighbours, each divided by the squared distance, so the nearest neighbour dominates. The sum is then normalised, which means separation always has the same strength no matter how many boids crowd in. Alignment steers 5 percent of the way towards the neighbours' mean velocity per frame, cohesion adds one hundredth of the mean offset to the neighbours. If a boid ever stalls below a tiny speed, it gets a random kick so it cannot freeze in place.",
          "In torus mode, distances are measured the short way around the edges. Without that, two boids on opposite sides of a seam would look a full screen apart and the flock would tear every time it crossed the border. In bounded mode, boids within 30 px of a wall are nudged inwards and reflected if they still hit it. Each boid is drawn as a triangle rotated to its velocity, over a translucent fill that leaves short motion trails. If your system asks for reduced motion, the simulation starts paused and shows one crisp frame; Play opts in to the animation.",
        ],
        code: STEER_EXCERPT,
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "Remove the glue",
        text: "Switch off Coh and keep the other two. Boids still line up with their neighbours, but nothing pulls groups together, so the flock dissolves into loose parallel streams that drift apart.",
      },
      {
        title: "A traffic jam without alignment",
        text: "Switch off Ali and raise cohesion to 2. Boids gather into tight, buzzing clumps that wobble around their centre but have no common direction. Turn alignment back on and the clumps start travelling.",
      },
      {
        title: "Short-sighted birds",
        text: "Lower the perception radius to 25 px. Each boid sees only its immediate neighbours, so you get many small flocks that pass through each other. Push it to 200 px and the whole population soon moves as one huge swarm.",
      },
      {
        title: "Crowd control",
        text: "Set separation to 0 and press + Cluster a few times. The boids collapse onto almost the same point. Raise separation to 3 and the cluster explodes into an evenly spaced lattice that still flies together.",
      },
    ],
  },
  de: {
    metaDescription:
      "Boids nach Craig Reynolds live steuern: Separation, Ausrichtung und Kohäsion gewichten, den Sichtradius ändern und sehen, wie aus drei Regeln ein Schwarm wird.",
    heading: "So funktioniert dieser Explorer",
    intro:
      "Jedes kleine Dreieck auf dem Canvas ist ein Boid, ein simulierter Vogel, der vom Schwarm als Ganzem nichts weiß. Er schaut nur auf die Boids in einem festen Radius um sich herum und passt seine Geschwindigkeit in jedem Frame ein wenig an. Es gibt keine Anführung, kein Ziel und keinen gemeinsamen Plan. Trotzdem ordnen sich die verstreuten Dreiecke nach wenigen Sekunden zu Strömen, verschmelzen zu Schwärmen und umkreisen einander. Der Schwarm ist nirgends programmiert, er entsteht aus den Wechselwirkungen.",
    sections: [
      {
        heading: "Drei Regeln, mehr nicht",
        paragraphs: [
          "Craig Reynolds stellte Boids 1987 in einem Paper auf der SIGGRAPH vor. Jeder Boid folgt drei Steuerregeln. Separation: weg von Nachbarn, die zu nah sind. Ausrichtung: in die durchschnittliche Flugrichtung der Nachbarn drehen. Kohäsion: zur durchschnittlichen Position der Nachbarn hin. Jede Regel erzeugt eine kleine Beschleunigung, die drei werden mit einstellbaren Gewichten addiert, und die Summe verändert die Geschwindigkeit.",
          "Keine der Regeln erwähnt den Schwarm. Sie beziehen sich nur auf das, was ein einzelner Boid sieht. Deshalb ist das Modell ein Paradebeispiel für Emergenz: globale Ordnung aus rein lokalen Entscheidungen. Schaltest du eine der drei Regeln ab, ändert sich das Verhalten des Schwarms auf typische Weise, und genau das kannst du unten in den Experimenten beobachten.",
        ],
        formula: BOIDS_FORMULA,
      },
      {
        heading: "Was die Regler bewirken",
        paragraphs: [
          "Die drei Gewichtsregler skalieren die Regeln von 0 bis 3. Voreingestellt sind Separation 1,5, Ausrichtung 1,0 und Kohäsion 1,0. Die Separation startet etwas stärker, damit der Schwarm nicht zu einem einzigen Punkt zusammenfällt. Mit den Knöpfen unter «Active rules» schaltest du eine Regel ganz ab. Auf die Bewegung wirkt das wie Gewicht null, aber du kommst mit einem Klick zu deinem eingestellten Gewicht zurück.",
          "Der Wahrnehmungsradius («Perception radius», 20 bis 200 px, Standard 80) legt fest, wie weit ein Boid sieht. Der Separationsradius («Separation radius», 10 bis 80 px, Standard 25) ist der persönliche Abstand, ab dem die Ausweichregel greift. Für die Separation zählen nur Boids, die schon im Wahrnehmungsradius liegen; ein Separationsradius größer als der Wahrnehmungsradius bringt also nichts zusätzlich. Die Höchstgeschwindigkeit («Max speed», 1 bis 8, Standard 4) begrenzt die Länge jedes Geschwindigkeitsvektors.",
          "Die Population reicht von 50 bis 500 Boids, Standard 220. «+ Cluster» setzt 30 neue Boids mit zufälligen Richtungen in eine kleine Scheibe in der Mitte, bis zur selben Obergrenze von 500. «Reset» verteilt die aktuelle Anzahl neu mit zufälligen Positionen und Geschwindigkeiten. Beim Randverhalten («Edge behaviour») wählst du zwischen einem Torus, auf dem ein Boid, der rechts hinausfliegt, links wieder auftaucht, und einer Box mit Wänden.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Alle Boids stecken in einem einzigen Float32Array mit vier Zahlen pro Boid: x, y, vx und vy. In jedem Frame wird jeder Boid mit jedem anderen verglichen, das sind n² Abstandsprüfungen: rund 48.000 bei den voreingestellten 220 Boids und rund 250.000 bei 500. Das schafft ein moderner Browser auch ohne räumliches Gitter. Die neuen Geschwindigkeiten landen zuerst in einem eigenen Puffer, damit alle Boids auf denselben Schnappschuss des Schwarms reagieren und nicht auf Nachbarn, die sich schon bewegt haben.",
          "Die Separation summiert die Vektoren weg von nahen Nachbarn, jeweils geteilt durch das Abstandsquadrat, sodass der nächste Nachbar dominiert. Danach wird die Summe normiert: Die Separation wirkt also immer gleich stark, egal wie viele Boids sich drängen. Die Ausrichtung steuert pro Frame 5 Prozent des Wegs zur mittleren Geschwindigkeit der Nachbarn, die Kohäsion addiert ein Hundertstel des mittleren Abstands zu ihnen. Fällt ein Boid unter eine winzige Geschwindigkeit, bekommt er einen zufälligen Schubs, damit er nicht einfriert.",
          "Im Torus-Modus werden Abstände auf dem kurzen Weg über die Ränder gemessen. Sonst lägen zwei Boids auf beiden Seiten einer Kante scheinbar einen ganzen Bildschirm auseinander, und der Schwarm würde bei jedem Grenzübertritt zerreißen. Im begrenzten Modus werden Boids, die einer Wand näher als 30 px kommen, nach innen gelenkt und notfalls reflektiert. Jeder Boid ist ein Dreieck in Flugrichtung, gezeichnet über eine halbtransparente Fläche, die kurze Bewegungsspuren hinterlässt. Wünscht dein System reduzierte Bewegung, startet die Simulation pausiert mit einem scharfen Standbild; mit «Play» schaltest du die Animation bewusst ein.",
        ],
        code: STEER_EXCERPT,
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Den Klebstoff entfernen",
        text: "Schalte «Coh» ab und lass die anderen beiden an. Die Boids richten sich weiter nach ihren Nachbarn aus, aber nichts hält Gruppen zusammen. Der Schwarm löst sich in lockere, parallele Ströme auf, die auseinanderdriften.",
      },
      {
        title: "Stau ohne Ausrichtung",
        text: "Schalte «Ali» ab und erhöhe die Kohäsion auf 2. Die Boids sammeln sich zu dichten, zappelnden Klumpen, die um ihr Zentrum wackeln, aber keine gemeinsame Richtung haben. Schaltest du die Ausrichtung wieder ein, setzen sich die Klumpen in Bewegung.",
      },
      {
        title: "Kurzsichtige Vögel",
        text: "Senke den Wahrnehmungsradius auf 25 px. Jeder Boid sieht nur seine direkten Nachbarn, und es entstehen viele kleine Schwärme, die durcheinander hindurchfliegen. Bei 200 px bewegt sich bald die ganze Population als ein riesiger Schwarm.",
      },
      {
        title: "Gedränge steuern",
        text: "Stell die Separation auf 0 und drück ein paarmal «+ Cluster». Die Boids fallen fast auf denselben Punkt zusammen. Erhöhst du die Separation auf 3, platzt der Haufen zu einem gleichmäßig verteilten Gitter auf, das trotzdem gemeinsam weiterfliegt.",
      },
    ],
  },
  es: {
    metaDescription:
      "Ajusta en vivo los boids de Craig Reynolds: pondera separación, alineación y cohesión, cambia el radio de percepción y mira surgir una bandada de tres reglas.",
    heading: "Cómo funciona este explorador",
    intro:
      "Cada triangulito del lienzo es un boid, un pájaro simulado que no sabe nada de la bandada en su conjunto. Solo mira a los boids que están dentro de un radio fijo a su alrededor y ajusta un poco su velocidad en cada fotograma. No hay líder, ni objetivo, ni plan común. Aun así, en pocos segundos los triángulos dispersos se alinean en corrientes, se funden en enjambres y giran unos alrededor de otros. La bandada no está programada en ninguna parte: emerge de las interacciones.",
    sections: [
      {
        heading: "Tres reglas, nada más",
        paragraphs: [
          "Craig Reynolds presentó los boids en un artículo expuesto en SIGGRAPH en 1987. Cada boid sigue tres reglas de dirección. Separación: aléjate de los vecinos que están demasiado cerca. Alineación: gira hacia el rumbo medio de los vecinos. Cohesión: muévete hacia la posición media de los vecinos. Cada regla produce una pequeña aceleración, las tres se suman con pesos ajustables y la suma modifica la velocidad.",
          "Ninguna de las reglas menciona la bandada. Solo se refieren a lo que un boid individual puede ver, y por eso el modelo es un ejemplo clásico de emergencia: orden global a partir de decisiones puramente locales. Desactiva cualquiera de las tres y el comportamiento colectivo cambia de una forma característica, algo que los experimentos de más abajo te permiten ver directamente.",
        ],
        formula: BOIDS_FORMULA,
      },
      {
        heading: "Qué hacen los controles",
        paragraphs: [
          "Los tres deslizadores de peso («Separation w», «Alignment w» y «Cohesion w») escalan las reglas de 0 a 3. Los valores por defecto son separación 1,5, alineación 1,0 y cohesión 1,0; la separación empieza un poco más fuerte para que la bandada no se colapse en un solo punto. Los botones de «Active rules» desactivan una regla por completo. Para el movimiento equivale a un peso de cero, pero el botón conserva el peso que habías ajustado, así que un clic lo recupera.",
          "El radio de percepción («Perception radius», de 20 a 200 px, 80 por defecto) decide hasta dónde ve un boid. El radio de separación («Separation radius», de 10 a 80 px, 25 por defecto) es el espacio personal dentro del cual actúa la regla de apartarse. Para la separación solo cuentan los boids que ya están dentro del radio de percepción, de modo que un radio de separación mayor que el de percepción no tiene ningún efecto adicional. La velocidad máxima («Max speed», de 1 a 8, 4 por defecto) limita la longitud de cada vector de velocidad.",
          "El deslizador de población va de 50 a 500 boids, 220 por defecto. «+ Cluster» suelta 30 boids nuevos con rumbos aleatorios en un pequeño disco en el centro, hasta el mismo tope de 500. «Reset» reparte el número actual de boids por el lienzo con posiciones y velocidades aleatorias. «Edge behaviour» alterna entre un toro, donde un boid que sale por la derecha vuelve a entrar por la izquierda, y una caja cerrada con paredes.",
        ],
      },
      {
        heading: "Cómo está construido",
        paragraphs: [
          "Todos los boids viven en un único Float32Array con cuatro números por boid: x, y, vx y vy. Cada fotograma de animación compara cada boid con todos los demás, lo que cuesta n al cuadrado comprobaciones de distancia: unas 48 000 con los 220 boids por defecto y unas 250 000 con 500. Eso es lo bastante barato para un navegador moderno sin necesidad de una rejilla espacial. Las nuevas velocidades se escriben primero en un búfer aparte, de modo que cada boid reacciona a la misma instantánea de la bandada y no a vecinos que ya se han movido.",
          "La separación suma los vectores que apuntan en sentido contrario a los vecinos cercanos, cada uno dividido por la distancia al cuadrado, así que domina el vecino más próximo. Después la suma se normaliza, lo que significa que la separación tiene siempre la misma intensidad por muchos boids que se apiñen. La alineación recorre en cada fotograma un 5 por ciento del camino hacia la velocidad media de los vecinos, y la cohesión añade una centésima del desplazamiento medio hacia ellos. Si un boid llega a quedarse por debajo de una velocidad minúscula, recibe un empujón aleatorio para que no pueda quedarse clavado en el sitio.",
          "En modo toro, las distancias se miden por el camino corto a través de los bordes. Sin eso, dos boids a ambos lados de una costura parecerían estar a una pantalla entera de distancia y la bandada se rasgaría cada vez que cruzara el borde. En modo acotado, los boids que están a menos de 30 px de una pared reciben un empujoncito hacia dentro y rebotan si aun así la tocan. Cada boid se dibuja como un triángulo girado según su velocidad, sobre un relleno translúcido que deja breves estelas de movimiento. Si tu sistema pide movimiento reducido, la simulación arranca en pausa y muestra un único fotograma nítido; con «Play» activas la animación por decisión propia.",
        ],
        code: STEER_EXCERPT,
      },
    ],
    experimentsHeading: "Prueba esto",
    experiments: [
      {
        title: "Quita el pegamento",
        text: "Desactiva «Coh» y deja las otras dos. Los boids siguen alineándose con sus vecinos, pero nada mantiene unidos a los grupos, así que la bandada se deshace en corrientes paralelas y sueltas que se van separando.",
      },
      {
        title: "Un atasco sin alineación",
        text: "Desactiva «Ali» y sube la cohesión a 2. Los boids se juntan en grumos apretados y zumbones que se tambalean alrededor de su centro, pero no tienen una dirección común. Vuelve a activar la alineación y los grumos echan a andar.",
      },
      {
        title: "Pájaros miopes",
        text: "Baja el radio de percepción a 25 px. Cada boid ve solo a sus vecinos inmediatos, de modo que obtienes muchas bandadas pequeñas que se atraviesan unas a otras. Súbelo a 200 px y pronto toda la población se mueve como un único enjambre enorme.",
      },
      {
        title: "Control de multitudes",
        text: "Pon la separación en 0 y pulsa «+ Cluster» unas cuantas veces. Los boids se colapsan casi sobre el mismo punto. Sube la separación a 3 y el cúmulo estalla en una retícula de espaciado uniforme que sigue volando unida.",
      },
    ],
  },
  fr: {
    metaDescription:
      "Règle en direct les boids de Craig Reynolds : dose séparation, alignement et cohésion, change le rayon de perception et regarde une nuée naître de trois règles.",
    heading: "Comment fonctionne cet explorateur",
    intro:
      "Chaque petit triangle du canevas est un boid, un oiseau simulé qui ignore tout de la nuée dans son ensemble. Il ne regarde que les boids situés dans un rayon fixe autour de lui et ajuste un peu sa vitesse à chaque image. Il n'y a ni chef, ni cible, ni plan commun. Pourtant, en quelques secondes, les triangles éparpillés s'alignent en courants, fusionnent en essaims et tourbillonnent les uns autour des autres. La nuée n'est programmée nulle part : elle émerge des interactions.",
    sections: [
      {
        heading: "Trois règles, rien de plus",
        paragraphs: [
          "Craig Reynolds a introduit les boids dans un article présenté au SIGGRAPH en 1987. Chaque boid suit trois règles de pilotage. Séparation : s'éloigner des voisins trop proches. Alignement : s'orienter vers le cap moyen des voisins. Cohésion : se diriger vers la position moyenne des voisins. Chaque règle produit une petite accélération, les trois sont additionnées avec des poids réglables, et la somme modifie la vitesse.",
          "Aucune de ces règles ne mentionne la nuée. Elles ne portent que sur ce qu'un boid isolé peut voir, et c'est pourquoi le modèle est un exemple classique d'émergence : un ordre global issu de décisions purement locales. Désactive n'importe laquelle des trois et le comportement collectif change d'une manière caractéristique, que les expériences ci-dessous te permettent d'observer directement.",
        ],
        formula: BOIDS_FORMULA,
      },
      {
        heading: "À quoi servent les commandes",
        paragraphs: [
          "Les trois curseurs de poids (« Separation w », « Alignment w » et « Cohesion w ») font varier les règles de 0 à 3. Les valeurs par défaut sont 1,5 pour la séparation, 1,0 pour l'alignement et 1,0 pour la cohésion ; la séparation démarre un peu plus fort pour que la nuée ne s'effondre pas en un seul point. Les boutons « Active rules » désactivent complètement une règle. Pour le mouvement, cela revient à un poids nul, mais le bouton conserve le poids que tu avais réglé : un clic suffit pour le retrouver.",
          "Le rayon de perception (« Perception radius », de 20 à 200 px, 80 par défaut) fixe la distance à laquelle un boid peut voir. Le rayon de séparation (« Separation radius », de 10 à 80 px, 25 par défaut) est l'espace personnel à l'intérieur duquel la règle de répulsion se déclenche. Seuls les boids déjà situés dans le rayon de perception comptent pour la séparation, si bien qu'un rayon de séparation plus grand que le rayon de perception n'apporte rien de plus. La vitesse maximale (« Max speed », de 1 à 8, 4 par défaut) plafonne la longueur de chaque vecteur vitesse.",
          "Le curseur de population va de 50 à 500 boids, 220 par défaut. « + Cluster » dépose 30 nouveaux boids, avec des caps aléatoires, dans un petit disque au centre, jusqu'au même plafond de 500. « Reset » disperse le nombre actuel de boids sur le canevas avec des positions et des vitesses aléatoires. « Edge behaviour » bascule entre un tore, où un boid qui sort à droite rentre à gauche, et une boîte fermée par des murs.",
        ],
      },
      {
        heading: "Comment c'est construit",
        paragraphs: [
          "Tous les boids vivent dans un seul Float32Array, avec quatre nombres par boid : x, y, vx et vy. À chaque image d'animation, chaque boid est comparé à tous les autres, ce qui coûte n au carré tests de distance : environ 48\u00a0000 avec les 220 boids par défaut et environ 250\u00a0000 avec 500. C'est assez léger pour un navigateur moderne, sans grille spatiale. Les nouvelles vitesses sont d'abord écrites dans un tampon séparé, de sorte que chaque boid réagit au même instantané de la nuée et non à des voisins qui ont déjà bougé.",
          "La séparation additionne les vecteurs qui s'éloignent des voisins proches, chacun divisé par le carré de la distance, si bien que le voisin le plus proche domine. La somme est ensuite normalisée, ce qui signifie que la séparation a toujours la même intensité, quel que soit le nombre de boids qui se pressent. L'alignement parcourt à chaque image 5 pour cent du chemin vers la vitesse moyenne des voisins, la cohésion ajoute un centième du décalage moyen vers les voisins. Si un boid tombe un jour sous une vitesse minuscule, il reçoit une impulsion aléatoire pour ne pas rester figé sur place.",
          "En mode tore, les distances sont mesurées par le plus court chemin à travers les bords. Sans cela, deux boids de part et d'autre d'une couture sembleraient séparés d'un écran entier et la nuée se déchirerait chaque fois qu'elle franchit la bordure. En mode borné, les boids situés à moins de 30 px d'un mur sont poussés vers l'intérieur, puis réfléchis s'ils le touchent quand même. Chaque boid est dessiné comme un triangle orienté selon sa vitesse, par-dessus un fond translucide qui laisse de courtes traînées de mouvement. Si ton système demande une réduction des animations, la simulation démarre en pause et affiche une seule image nette ; « Play » te permet de lancer l'animation si tu le souhaites.",
        ],
        code: STEER_EXCERPT,
      },
    ],
    experimentsHeading: "À essayer",
    experiments: [
      {
        title: "Enlève la colle",
        text: "Désactive « Coh » et garde les deux autres. Les boids continuent de s'aligner sur leurs voisins, mais plus rien ne rapproche les groupes : la nuée se dissout en courants parallèles et lâches qui s'écartent peu à peu.",
      },
      {
        title: "Un embouteillage sans alignement",
        text: "Désactive « Ali » et monte la cohésion à 2. Les boids se rassemblent en amas serrés et bourdonnants qui oscillent autour de leur centre, sans direction commune. Réactive l'alignement et les amas se mettent en route.",
      },
      {
        title: "Des oiseaux myopes",
        text: "Baisse le rayon de perception à 25 px. Chaque boid ne voit que ses voisins immédiats, et tu obtiens de nombreuses petites nuées qui se traversent les unes les autres. Pousse-le à 200 px et toute la population se déplace bientôt comme un seul essaim géant.",
      },
      {
        title: "Gestion de foule",
        text: "Règle la séparation sur 0 et appuie plusieurs fois sur « + Cluster ». Les boids s'effondrent presque sur le même point. Monte la séparation à 3 et l'amas éclate en un réseau régulièrement espacé qui continue de voler groupé.",
      },
    ],
  },
  it: {
    metaDescription:
      "Regola dal vivo i boid di Craig Reynolds: dosa separazione, allineamento e coesione, cambia il raggio di percezione e guarda uno stormo nascere da tre regole.",
    heading: "Come funziona questo esploratore",
    intro:
      "Ogni triangolino sul canvas è un boid, un uccello simulato che non sa nulla dello stormo nel suo insieme. Guarda soltanto i boid che si trovano entro un raggio fisso intorno a sé e a ogni fotogramma corregge un poco la propria velocità. Non c'è una guida, non c'è una meta, non c'è un piano condiviso. Eppure nel giro di pochi secondi i triangoli sparsi si allineano in correnti, si fondono in sciami e vorticano gli uni intorno agli altri. Lo stormo non è programmato da nessuna parte: emerge dalle interazioni.",
    sections: [
      {
        heading: "Tre regole, nient'altro",
        paragraphs: [
          "Craig Reynolds introdusse i boid in un articolo presentato al SIGGRAPH nel 1987. Ogni boid segue tre regole di sterzata. Separazione: allontanati dai vicini troppo ravvicinati. Allineamento: ruota verso la direzione media dei vicini. Coesione: muoviti verso la posizione media dei vicini. Ogni regola produce una piccola accelerazione, le tre vengono sommate con pesi regolabili e la somma modifica la velocità.",
          "Nessuna delle regole nomina lo stormo. Riguardano soltanto ciò che un singolo boid riesce a vedere, ed è per questo che il modello è un esempio classico di emergenza: ordine globale da decisioni puramente locali. Disattiva una qualsiasi delle tre e il comportamento collettivo cambia in modo caratteristico, come puoi vedere direttamente con gli esperimenti qui sotto.",
        ],
        formula: BOIDS_FORMULA,
      },
      {
        heading: "Che cosa fanno i controlli",
        paragraphs: [
          "I tre cursori dei pesi («Separation w», «Alignment w» e «Cohesion w») scalano le regole da 0 a 3. I valori predefiniti sono separazione 1,5, allineamento 1,0 e coesione 1,0; la separazione parte un po' più forte perché lo stormo non collassi in un unico punto. I pulsanti sotto «Active rules» spengono del tutto una regola. Per il moto equivale a un peso pari a zero, ma il pulsante conserva il peso che avevi regolato, quindi basta un clic per ripristinarlo.",
          "Il raggio di percezione («Perception radius», da 20 a 200 px, predefinito 80) stabilisce fin dove vede un boid. Il raggio di separazione («Separation radius», da 10 a 80 px, predefinito 25) è lo spazio personale entro cui scatta la regola di allontanamento. Per la separazione contano solo i boid che sono già dentro il raggio di percezione, quindi un raggio di separazione più grande di quello di percezione non ha alcun effetto in più. La velocità massima («Max speed», da 1 a 8, predefinita 4) limita la lunghezza di ogni vettore velocità.",
          "Il cursore della popolazione va da 50 a 500 boid, predefinito 220. «+ Cluster» rilascia 30 nuovi boid con direzioni casuali in un piccolo disco al centro, fino allo stesso tetto di 500. «Reset» sparpaglia sul canvas il numero attuale di boid con posizioni e velocità casuali. «Edge behaviour» passa da un toro, dove un boid che esce a destra rientra da sinistra, a una scatola chiusa da pareti.",
        ],
      },
      {
        heading: "Com'è costruito",
        paragraphs: [
          "Tutti i boid vivono in un unico Float32Array con quattro numeri per boid: x, y, vx e vy. A ogni fotogramma dell'animazione ogni boid viene confrontato con tutti gli altri, il che costa n al quadrato controlli di distanza: circa 48.000 con i 220 boid predefiniti e circa 250.000 con 500. Per un browser moderno è abbastanza leggero anche senza una griglia spaziale. Le nuove velocità finiscono prima in un buffer separato, così ogni boid reagisce alla stessa istantanea dello stormo e non a vicini che si sono già mossi.",
          "La separazione somma i vettori che puntano in direzione opposta ai vicini troppo ravvicinati, ciascuno diviso per il quadrato della distanza, per cui domina quello più vicino. La somma viene poi normalizzata, il che significa che la separazione ha sempre la stessa intensità, per quanti boid si accalchino. L'allineamento sterza a ogni fotogramma del 5 per cento verso la velocità media dei vicini, la coesione aggiunge un centesimo dello scostamento medio verso i vicini. Se un boid scende sotto una velocità minuscola, riceve una spinta casuale perché non resti bloccato sul posto.",
          "In modalità toro le distanze si misurano lungo la via più breve attraverso i bordi. Altrimenti due boid ai lati opposti di una cucitura sembrerebbero lontani un intero schermo e lo stormo si strapperebbe ogni volta che attraversa il confine. In modalità limitata i boid a meno di 30 px da una parete vengono sospinti verso l'interno e, se la toccano lo stesso, riflessi. Ogni boid è disegnato come un triangolo ruotato secondo la sua velocità, sopra un riempimento traslucido che lascia brevi scie di movimento. Se il tuo sistema chiede di ridurre il movimento, la simulazione parte in pausa e mostra un solo fotogramma nitido; con «Play» scegli tu di avviare l'animazione.",
        ],
        code: STEER_EXCERPT,
      },
    ],
    experimentsHeading: "Prova così",
    experiments: [
      {
        title: "Togli la colla",
        text: "Spegni «Coh» e lascia le altre due. I boid continuano ad allinearsi con i vicini, ma nulla tiene insieme i gruppi, così lo stormo si scioglie in correnti parallele e rade che si allontanano l'una dall'altra.",
      },
      {
        title: "Un ingorgo senza allineamento",
        text: "Spegni «Ali» e porta la coesione a 2. I boid si raccolgono in grumi fitti e ronzanti che oscillano intorno al proprio centro ma non hanno una direzione comune. Riaccendi l'allineamento e i grumi si mettono in viaggio.",
      },
      {
        title: "Uccelli miopi",
        text: "Abbassa il raggio di percezione a 25 px. Ogni boid vede solo i vicini immediati, e ottieni tanti piccoli stormi che si attraversano a vicenda. Portalo a 200 px e presto l'intera popolazione si muove come un unico sciame enorme.",
      },
      {
        title: "Gestire la calca",
        text: "Metti la separazione a 0 e premi qualche volta «+ Cluster». I boid collassano quasi sullo stesso punto. Alza la separazione a 3 e il grappolo esplode in un reticolo a spaziatura uniforme che continua a volare unito.",
      },
    ],
  },
  pt: {
    metaDescription:
      "Afina ao vivo os boids de Craig Reynolds: pondera separação, alinhamento e coesão, muda o raio de perceção e vê um bando emergir de três regras locais.",
    heading: "Como funciona este explorador",
    intro:
      "Cada pequeno triângulo no canvas é um boid, uma ave simulada que nada sabe sobre o bando como um todo. Olha apenas para os boids que estão dentro de um raio fixo à sua volta e ajusta um pouco a velocidade em cada fotograma. Não há líder, nem alvo, nem plano comum. Mesmo assim, em poucos segundos os triângulos dispersos alinham-se em correntes, fundem-se em enxames e rodopiam uns em torno dos outros. O bando não está programado em lado nenhum: emerge das interações.",
    sections: [
      {
        heading: "Três regras, nada mais",
        paragraphs: [
          "Craig Reynolds apresentou os boids num artigo levado à SIGGRAPH em 1987. Cada boid segue três regras de direção. Separação: afasta-te dos vizinhos que estão demasiado perto. Alinhamento: vira-te para o rumo médio dos vizinhos. Coesão: move-te em direção à posição média dos vizinhos. Cada regra produz uma pequena aceleração, as três somam-se com pesos ajustáveis e a soma altera a velocidade.",
          "Nenhuma das regras menciona o bando. Referem-se apenas ao que um único boid consegue ver, e é por isso que o modelo é um exemplo clássico de emergência: ordem global a partir de decisões puramente locais. Desliga qualquer uma das três e o comportamento coletivo muda de uma forma característica, que as experiências abaixo te deixam ver diretamente.",
        ],
        formula: BOIDS_FORMULA,
      },
      {
        heading: "O que fazem os controlos",
        paragraphs: [
          "Os três cursores de peso («Separation w», «Alignment w» e «Cohesion w») escalam as regras de 0 a 3. Os valores predefinidos são separação 1,5, alinhamento 1,0 e coesão 1,0; a separação começa um pouco mais forte para que o bando não colapse num único ponto. Os botões de «Active rules» desligam uma regra por completo. Para o movimento é o mesmo que um peso zero, mas o botão guarda o peso que tinhas afinado, por isso basta um clique para o recuperar.",
          "O raio de perceção («Perception radius», de 20 a 200 px, 80 por omissão) decide até onde um boid consegue ver. O raio de separação («Separation radius», de 10 a 80 px, 25 por omissão) é o espaço pessoal dentro do qual a regra de afastamento entra em ação. Para a separação só contam os boids que já estão dentro do raio de perceção, pelo que um raio de separação maior do que o de perceção não tem qualquer efeito adicional. A velocidade máxima («Max speed», de 1 a 8, 4 por omissão) limita o comprimento de cada vetor velocidade.",
          "O cursor da população vai de 50 a 500 boids, 220 por omissão. «+ Cluster» larga 30 novos boids com rumos aleatórios num pequeno disco ao centro, até ao mesmo limite de 500. «Reset» espalha o número atual de boids pelo canvas com posições e velocidades aleatórias. «Edge behaviour» alterna entre um toro, em que um boid que sai pela direita volta a entrar pela esquerda, e uma caixa fechada com paredes.",
        ],
      },
      {
        heading: "Como está construído",
        paragraphs: [
          "Todos os boids vivem num único Float32Array com quatro números por boid: x, y, vx e vy. Cada fotograma de animação compara cada boid com todos os outros, o que custa n ao quadrado verificações de distância: cerca de 48\u00a0000 com os 220 boids predefinidos e cerca de 250\u00a0000 com 500. É suficientemente leve para um navegador moderno, sem grelha espacial. As novas velocidades vão primeiro para um buffer separado, para que cada boid reaja ao mesmo instantâneo do bando e não a vizinhos que já se moveram.",
          "A separação soma os vetores que apontam para longe dos vizinhos próximos, cada um dividido pelo quadrado da distância, de modo que o vizinho mais próximo domina. A soma é depois normalizada, o que significa que a separação tem sempre a mesma intensidade, por muitos boids que se amontoem. O alinhamento percorre em cada fotograma 5 por cento do caminho até à velocidade média dos vizinhos, a coesão acrescenta um centésimo do desvio médio em relação aos vizinhos. Se um boid alguma vez cair abaixo de uma velocidade minúscula, recebe um empurrão aleatório para não ficar parado no sítio.",
          "No modo toro, as distâncias medem-se pelo caminho mais curto através das margens. Sem isso, dois boids em lados opostos de uma costura pareceriam estar a um ecrã inteiro de distância e o bando rasgar-se-ia sempre que atravessasse a fronteira. No modo limitado, os boids a menos de 30 px de uma parede são empurrados para dentro e refletidos se ainda assim lhe tocarem. Cada boid é desenhado como um triângulo rodado segundo a sua velocidade, sobre um preenchimento translúcido que deixa curtos rastos de movimento. Se o teu sistema pedir movimento reduzido, a simulação arranca em pausa e mostra um único fotograma nítido; com «Play» escolhes ativar a animação.",
        ],
        code: STEER_EXCERPT,
      },
    ],
    experimentsHeading: "Experimenta isto",
    experiments: [
      {
        title: "Tira a cola",
        text: "Desliga «Coh» e mantém as outras duas. Os boids continuam a alinhar-se com os vizinhos, mas nada junta os grupos, por isso o bando dissolve-se em correntes paralelas e soltas que se vão afastando.",
      },
      {
        title: "Um engarrafamento sem alinhamento",
        text: "Desliga «Ali» e sobe a coesão para 2. Os boids juntam-se em aglomerados apertados e irrequietos que oscilam em torno do seu centro, mas sem direção comum. Volta a ligar o alinhamento e os aglomerados põem-se a caminho.",
      },
      {
        title: "Aves míopes",
        text: "Baixa o raio de perceção para 25 px. Cada boid vê apenas os vizinhos imediatos, e obténs muitos bandos pequenos que passam uns pelos outros. Leva-o até 200 px e em breve toda a população se move como um único enxame enorme.",
      },
      {
        title: "Controlo de multidões",
        text: "Põe a separação em 0 e carrega algumas vezes em «+ Cluster». Os boids colapsam quase sobre o mesmo ponto. Sobe a separação para 3 e o aglomerado explode numa rede de espaçamento uniforme que continua a voar em conjunto.",
      },
    ],
  },
  sv: {
    metaDescription:
      "Styr Craig Reynolds boids i realtid: vikta separation, inriktning och sammanhållning, ändra synradien och se en flock växa fram ur tre lokala regler.",
    heading: "Så fungerar den här utforskaren",
    intro:
      "Varje liten triangel på ritytan är en boid, en simulerad fågel som inte vet något om flocken som helhet. Den tittar bara på de boids som finns inom en fast radie runt den och justerar sin hastighet en aning i varje bildruta. Det finns ingen ledare, inget mål och ingen gemensam plan. Ändå ordnar sig de utspridda trianglarna inom några sekunder i strömmar, smälter samman till svärmar och virvlar runt varandra. Flocken är inte programmerad någonstans, den uppstår ur samspelet.",
    sections: [
      {
        heading: "Tre regler, inget mer",
        paragraphs: [
          "Craig Reynolds introducerade boids i en artikel som presenterades på SIGGRAPH 1987. Varje boid följer tre styrregler. Separation: rör dig bort från grannar som är för nära. Inriktning: vrid dig mot grannarnas genomsnittliga kurs. Sammanhållning: rör dig mot grannarnas genomsnittliga position. Varje regel ger en liten acceleration, de tre adderas med justerbara vikter och summan ändrar hastigheten.",
          "Ingen av reglerna nämner flocken. De handlar bara om det som en enskild boid kan se, och därför är modellen ett standardexempel på emergens: global ordning ur rent lokala beslut. Stäng av vilken som helst av de tre och det kollektiva beteendet ändras på ett karakteristiskt sätt, vilket du kan se direkt i experimenten nedan.",
        ],
        formula: BOIDS_FORMULA,
      },
      {
        heading: "Vad reglagen gör",
        paragraphs: [
          "De tre viktreglagen (”Separation w”, ”Alignment w” och ”Cohesion w”) skalar reglerna från 0 till 3. Standardvärdena är separation 1,5; inriktning 1,0 och sammanhållning 1,0. Separationen börjar lite starkare så att flocken inte faller ihop till en enda punkt. Knapparna under ”Active rules” stänger av en regel helt. För rörelsen är det samma sak som vikten noll, men knappen behåller den vikt du har ställt in, så ett klick tar dig tillbaka.",
          "Synradien (”Perception radius”, 20 till 200 px, standard 80) avgör hur långt en boid kan se. Separationsradien (”Separation radius”, 10 till 80 px, standard 25) är det personliga utrymme där regeln om att vika undan slår till. Bara boids som redan ligger inom synradien räknas för separationen, så en separationsradie som är större än synradien ger ingen extra effekt. Maxfarten (”Max speed”, 1 till 8, standard 4) begränsar längden på varje hastighetsvektor.",
          "Populationsreglaget går från 50 till 500 boids, standard 220. ”+ Cluster” släpper 30 nya boids med slumpmässiga kurser i en liten skiva i mitten, upp till samma tak på 500. ”Reset” sprider ut det aktuella antalet boids över ritytan med slumpmässiga positioner och hastigheter. ”Edge behaviour” växlar mellan en torus, där en boid som lämnar ytan till höger kommer in igen till vänster, och en avgränsad låda med väggar.",
        ],
      },
      {
        heading: "Hur den är byggd",
        paragraphs: [
          "Alla boids ligger i en enda Float32Array med fyra tal per boid: x, y, vx och vy. I varje animationsbildruta jämförs varje boid med alla andra, vilket kostar n i kvadrat avståndskontroller: ungefär 48\u00a0000 med standardvärdet 220 boids och ungefär 250\u00a0000 med 500. Det är billigt nog för en modern webbläsare utan något rumsligt rutnät. De nya hastigheterna skrivs först till en separat buffert, så att varje boid reagerar på samma ögonblicksbild av flocken och inte på grannar som redan har flyttat sig.",
          "Separationen summerar vektorerna som pekar bort från nära grannar, var och en dividerad med avståndet i kvadrat, så att den närmaste grannen dominerar. Summan normeras sedan, vilket betyder att separationen alltid är lika stark oavsett hur många boids som trängs. Inriktningen styr 5 procent av vägen mot grannarnas medelhastighet per bildruta, sammanhållningen lägger till en hundradel av den genomsnittliga förskjutningen till grannarna. Om en boid någon gång hamnar under en pytteliten fart får den en slumpmässig knuff så att den inte kan frysa fast.",
          "I torusläget mäts avstånd den korta vägen över kanterna. Utan det skulle två boids på var sin sida om en söm se ut att ligga en hel skärm isär, och flocken skulle slitas sönder varje gång den korsade kanten. I det avgränsade läget knuffas boids som är närmare en vägg än 30 px inåt och reflekteras om de ändå träffar den. Varje boid ritas som en triangel vriden efter sin hastighet, över en halvgenomskinlig fyllning som lämnar korta rörelsespår. Om ditt system ber om minskad rörelse startar simuleringen pausad och visar en enda skarp bild. Med ”Play” väljer du själv att slå på animationen.",
        ],
        code: STEER_EXCERPT,
      },
    ],
    experimentsHeading: "Prova det här",
    experiments: [
      {
        title: "Ta bort limmet",
        text: "Stäng av ”Coh” och behåll de andra två. Boids rättar sig fortfarande efter sina grannar, men inget drar ihop grupperna, så flocken löses upp i glesa parallella strömmar som glider isär.",
      },
      {
        title: "En trafikstockning utan inriktning",
        text: "Stäng av ”Ali” och höj sammanhållningen till 2. Boids samlas i täta, surrande klungor som vinglar runt sin mittpunkt men saknar gemensam riktning. Slå på inriktningen igen och klungorna börjar färdas.",
      },
      {
        title: "Närsynta fåglar",
        text: "Sänk synradien till 25 px. Varje boid ser bara sina närmaste grannar, så du får många små flockar som passerar genom varandra. Dra upp den till 200 px och snart rör sig hela populationen som en enda jättesvärm.",
      },
      {
        title: "Håll ordning på trängseln",
        text: "Sätt separationen till 0 och tryck på ”+ Cluster” några gånger. Boids faller ihop på nästan samma punkt. Höj separationen till 3 och klungan exploderar till ett jämnt fördelat gitter som fortfarande flyger tillsammans.",
      },
    ],
  },
  no: {
    metaDescription:
      "Styr Craig Reynolds' boids direkte: Vekt separasjon, innretting og samhold, endre synsradien og se en flokk vokse fram av tre enkle, lokale regler.",
    heading: "Slik fungerer denne utforskeren",
    intro:
      "Hver lille trekant på lerretet er en boid, en simulert fugl som ikke vet noe om flokken som helhet. Den ser bare på boidene innenfor en fast radius rundt seg og justerer farten sin litt i hvert bilde. Det finnes ingen leder, ikke noe mål og ingen felles plan. Likevel ordner de spredte trekantene seg i løpet av få sekunder i strømmer, smelter sammen til svermer og virvler rundt hverandre. Flokken er ikke programmert noe sted, den oppstår av samspillet.",
    sections: [
      {
        heading: "Tre regler, ikke noe mer",
        paragraphs: [
          "Craig Reynolds introduserte boids i en artikkel som ble presentert på SIGGRAPH i 1987. Hver boid følger tre styreregler. Separasjon: Beveg deg bort fra naboer som er for nær. Innretting: Drei mot naboenes gjennomsnittlige kurs. Samhold: Beveg deg mot naboenes gjennomsnittlige posisjon. Hver regel gir en liten akselerasjon, de tre legges sammen med justerbare vekter, og summen endrer hastigheten.",
          "Ingen av reglene nevner flokken. De handler bare om det en enkelt boid kan se, og derfor er modellen et standardeksempel på emergens: global orden ut av rent lokale beslutninger. Slå av hvilken som helst av de tre, og den kollektive oppførselen endrer seg på en karakteristisk måte, noe du kan se direkte i eksperimentene nedenfor.",
        ],
        formula: BOIDS_FORMULA,
      },
      {
        heading: "Hva kontrollene gjør",
        paragraphs: [
          "De tre vektglidebryterne («Separation w», «Alignment w» og «Cohesion w») skalerer reglene fra 0 til 3. Standardverdiene er separasjon 1,5, innretting 1,0 og samhold 1,0. Separasjonen starter litt sterkere, slik at flokken ikke kollapser til ett enkelt punkt. Knappene under «Active rules» slår en regel helt av. For bevegelsen er det det samme som vekten null, men knappen tar vare på vekten du har stilt inn, så ett klikk henter den tilbake.",
          "Synsradien («Perception radius», 20 til 200 px, standard 80) avgjør hvor langt en boid kan se. Separasjonsradien («Separation radius», 10 til 80 px, standard 25) er det personlige rommet der regelen om å vike unna slår inn. Bare boider som allerede er innenfor synsradien, teller for separasjonen, så en separasjonsradius som er større enn synsradien, gir ingen ekstra effekt. Maksfarten («Max speed», 1 til 8, standard 4) begrenser lengden på hver hastighetsvektor.",
          "Populasjonsglidebryteren går fra 50 til 500 boider, standard 220. «+ Cluster» slipper 30 nye boider med tilfeldige kurser i en liten skive i midten, opp til det samme taket på 500. «Reset» sprer det gjeldende antallet boider utover lerretet med tilfeldige posisjoner og hastigheter. «Edge behaviour» veksler mellom en torus, der en boid som forlater flaten til høyre, kommer inn igjen til venstre, og en avgrenset boks med vegger.",
        ],
      },
      {
        heading: "Slik er den bygget",
        paragraphs: [
          "Alle boidene ligger i én enkelt Float32Array med fire tall per boid: x, y, vx og vy. I hvert animasjonsbilde sammenlignes hver boid med alle de andre, noe som koster n i andre avstandssjekker: omtrent 48\u00a0000 med standardverdien 220 boider og omtrent 250\u00a0000 med 500. Det er billig nok for en moderne nettleser uten noe romlig rutenett. De nye hastighetene skrives først til en egen buffer, slik at hver boid reagerer på det samme øyeblikksbildet av flokken og ikke på naboer som allerede har flyttet seg.",
          "Separasjonen summerer vektorene som peker bort fra nære naboer, hver av dem delt på kvadratet av avstanden, slik at den nærmeste naboen dominerer. Summen normaliseres deretter, noe som betyr at separasjonen alltid er like sterk uansett hvor mange boider som trenger seg sammen. Innrettingen styrer 5 prosent av veien mot naboenes gjennomsnittshastighet per bilde, samholdet legger til en hundredel av den gjennomsnittlige forskyvningen til naboene. Hvis en boid noen gang havner under en bitte liten fart, får den et tilfeldig dytt slik at den ikke kan fryse fast.",
          "I torusmodus måles avstander den korte veien over kantene. Uten det ville to boider på hver sin side av en søm se ut til å ligge en hel skjerm fra hverandre, og flokken ville revne hver gang den krysset kanten. I avgrenset modus dyttes boider som er nærmere en vegg enn 30 px, innover og reflekteres hvis de likevel treffer den. Hver boid tegnes som en trekant dreid etter hastigheten sin, over en halvgjennomsiktig fylling som etterlater korte bevegelsesspor. Hvis systemet ditt ber om redusert bevegelse, starter simuleringen på pause og viser ett skarpt bilde. Med «Play» velger du selv å slå på animasjonen.",
        ],
        code: STEER_EXCERPT,
      },
    ],
    experimentsHeading: "Prøv dette",
    experiments: [
      {
        title: "Fjern limet",
        text: "Slå av «Coh» og behold de to andre. Boidene retter seg fortsatt inn etter naboene, men ingenting trekker gruppene sammen, så flokken løser seg opp i løse, parallelle strømmer som glir fra hverandre.",
      },
      {
        title: "En trafikkork uten innretting",
        text: "Slå av «Ali» og øk samholdet til 2. Boidene samler seg i tette, summende klynger som vagger rundt midtpunktet sitt, men mangler felles retning. Slå på innrettingen igjen, og klyngene begynner å reise.",
      },
      {
        title: "Nærsynte fugler",
        text: "Senk synsradien til 25 px. Hver boid ser bare de nærmeste naboene, så du får mange små flokker som passerer gjennom hverandre. Skyv den opp til 200 px, og snart beveger hele populasjonen seg som én enorm sverm.",
      },
      {
        title: "Hold styr på trengselen",
        text: "Sett separasjonen til 0 og trykk på «+ Cluster» noen ganger. Boidene kollapser på nesten samme punkt. Øk separasjonen til 3, og klyngen eksploderer til et jevnt fordelt gitter som fortsatt flyr sammen.",
      },
    ],
  },
};
