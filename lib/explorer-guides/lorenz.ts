import type { ExplorerGuide } from "./types";

// Numbers quoted here (24.74, 13.93, the 800-step warm-up, the 6000-point
// trail) match app/lorenz/explorer/page.tsx; update both together.
const RK4_EXCERPT = `const f = (x, y, z) => [
  sigma * (y - x),
  x * (rho - z) - y,
  x * y - beta * z,
];

// One classical Runge-Kutta step of size dt
const [k1x, k1y, k1z] = f(x, y, z);
const [k2x, k2y, k2z] = f(x + 0.5*dt*k1x, y + 0.5*dt*k1y, z + 0.5*dt*k1z);
const [k3x, k3y, k3z] = f(x + 0.5*dt*k2x, y + 0.5*dt*k2y, z + 0.5*dt*k2z);
const [k4x, k4y, k4z] = f(x + dt*k3x, y + dt*k3y, z + dt*k3z);
x += (dt / 6) * (k1x + 2*k2x + 2*k3x + k4x);  // same for y and z`;

const LORENZ_FORMULA =
  "\\dot x = \\sigma (y - x), \\quad \\dot y = x(\\rho - z) - y, \\quad \\dot z = xy - \\beta z";

export const LORENZ_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Play with the Lorenz attractor live: change σ, ρ and β, watch the butterfly appear at ρ ≈ 24.74, and see how the RK4 simulation behind it is built.",
    heading: "How this explorer works",
    intro:
      "The glowing curve is a single point moving through three-dimensional space according to the Lorenz equations. Every frame the simulation advances it a little further and leaves a fading trail behind, so what looks like a drawing is really the recent history of one trajectory. It never repeats and never settles, yet it never leaves the butterfly-shaped region either. That combination is what mathematicians call a strange attractor.",
    sections: [
      {
        heading: "The three equations",
        paragraphs: [
          "Edward Lorenz wrote these equations in 1963 as a drastically simplified model of air rising and falling in a layer heated from below. x stands for the strength of the convection roll, y and z for temperature differences inside it. The model is tiny: three variables, two products, nothing random. Lorenz noticed that rounding a starting value from six to three decimals produced a completely different forecast after a while, and that observation became the starting point of chaos theory.",
        ],
        formula: LORENZ_FORMULA,
      },
      {
        heading: "What the sliders do",
        paragraphs: [
          "σ (sigma) is the Prandtl number, the ratio between how fast the fluid smooths out motion and how fast it smooths out heat. ρ (rho) is the Rayleigh number, how strongly the layer is heated. β (beta) encodes the geometry of the convection cell. The classic values Lorenz used are σ = 10, ρ = 28 and β = 8/3; the reset button returns to exactly those.",
          "ρ is the slider with the most drama. Below ρ = 1 every trajectory falls into the origin: the fluid is at rest. Above 1 two new equilibrium points appear, one in the centre of each wing, and for moderate ρ the point simply spirals into one of them. Around ρ ≈ 13.93 trajectories start switching between the wings before they settle, and at ρ ≈ 24.74 both equilibria lose their stability. From there on nothing can settle and the butterfly is permanent.",
          "That threshold is not a guess. For σ = 10 and β = 8/3 it follows from the formula ρ = σ(σ + β + 3) / (σ − β − 1). It also explains a quieter effect: if you push σ below β + 1, the denominator turns negative and the two equilibria stay stable no matter how far you raise ρ.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "The simulation runs entirely in your browser on a 2D canvas. It integrates the equations with the classical fourth-order Runge-Kutta method (RK4), which evaluates the right-hand side four times per step and combines the slopes. Compared with the naive Euler method, RK4 stays accurate with much larger steps, which matters when you want twelve steps per animation frame on a phone.",
          "Each new position goes into a ring buffer of 6000 points stored in a Float32Array, so memory stays constant no matter how long the page runs. Points are coloured by age, from warm amber for the newest to violet for the oldest, and every frame paints a semi-transparent layer over the canvas, which produces the soft motion trail. The projection buttons choose which two of the three coordinates are drawn: XZ shows the familiar butterfly, XY the view from above, YZ the view from the side.",
          "Changing σ, ρ or β restarts the trajectory at (0.1, 0, 0), so you always see the same initial condition evolve under new rules. If your system asks for reduced motion, the animation is replaced by one still image: the simulation runs 800 warm-up steps to land on the attractor, then integrates the full trail at once and draws it a single time.",
        ],
        code: RK4_EXCERPT,
      },
      {
        heading: "Why the time step matters",
        paragraphs: [
          "The dt slider sets the size of each integration step. A smaller dt makes the curve smoother and slower, a larger one faster and coarser. Here is the twist: in a chaotic system even the tiny numerical error of RK4 grows exponentially, roughly doubling every 0.8 time units for the classic parameters. Two runs with different dt therefore follow different paths after a short while, even though both are correct pictures of the attractor. The shape is reliable; the exact route is not. That is Lorenz's original discovery, reproduced by your own browser.",
        ],
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "Watch the butterfly being born",
        text: "Set ρ to 20 and wait until the curve settles into a spiral. Then raise ρ slowly past 24 and 25. Somewhere around 24.74 the spiral stops closing in and the trajectory begins to jump between the wings for good.",
      },
      {
        title: "Switch off the chaos with σ",
        text: "Keep ρ at 28 and lower σ to 3. The equilibria are stable again and the point spirals into one wing. Raise σ back above 4 and the butterfly returns.",
      },
      {
        title: "Let the fluid rest",
        text: "Pull ρ below 1. All motion dies out and the point slides into the origin, the state in which the heated layer does not convect at all.",
      },
      {
        title: "See the same orbit from three sides",
        text: "With the classic values, switch between XZ, XY and YZ. It is the same set of points every time; only the camera changes. The view from above (XY) makes the two lobes look almost like a figure eight.",
      },
    ],
  },
  de: {
    metaDescription:
      "Den Lorenz-Attraktor live erkunden: σ, ρ und β verändern, den Schmetterling bei ρ ≈ 24,74 entstehen sehen und nachlesen, wie die RK4-Simulation gebaut ist.",
    heading: "So funktioniert dieser Explorer",
    intro:
      "Die leuchtende Kurve ist ein einzelner Punkt, der sich nach den Lorenz-Gleichungen durch den dreidimensionalen Raum bewegt. Mit jedem Frame rückt die Simulation ihn ein Stück weiter und hinterlässt eine verblassende Spur. Was wie eine Zeichnung aussieht, ist also die jüngste Geschichte einer einzigen Bahn. Sie wiederholt sich nie und kommt nie zur Ruhe, verlässt aber auch nie das schmetterlingsförmige Gebiet. Genau diese Kombination nennen Mathematiker:innen einen seltsamen Attraktor.",
    sections: [
      {
        heading: "Die drei Gleichungen",
        paragraphs: [
          "Edward Lorenz schrieb diese Gleichungen 1963 als stark vereinfachtes Modell für Luft, die in einer von unten beheizten Schicht auf- und absteigt. x steht für die Stärke der Konvektionswalze, y und z für Temperaturunterschiede darin. Das Modell ist winzig: drei Variablen, zwei Produkte, kein Zufall. Lorenz bemerkte, dass ein von sechs auf drei Nachkommastellen gerundeter Startwert nach einiger Zeit eine völlig andere Vorhersage lieferte. Aus dieser Beobachtung wurde die Chaostheorie.",
        ],
        formula: LORENZ_FORMULA,
      },
      {
        heading: "Was die Regler bewirken",
        paragraphs: [
          "σ (Sigma) ist die Prandtl-Zahl, das Verhältnis, wie schnell die Flüssigkeit Bewegung und wie schnell sie Wärme ausgleicht. ρ (Rho) ist die Rayleigh-Zahl, also wie stark die Schicht beheizt wird. β (Beta) beschreibt die Geometrie der Konvektionszelle. Lorenz verwendete σ = 10, ρ = 28 und β = 8/3; der Reset-Knopf stellt genau diese Werte wieder her.",
          "Am spannendsten ist ρ. Unter ρ = 1 fällt jede Bahn in den Ursprung: Die Flüssigkeit ruht. Oberhalb von 1 entstehen zwei neue Gleichgewichtspunkte, je einer in der Mitte eines Flügels, und bei mittlerem ρ spiralt der Punkt einfach in einen davon hinein. Ab etwa ρ ≈ 13,93 wechseln die Bahnen eine Weile zwischen den Flügeln, bevor sie sich festlegen, und bei ρ ≈ 24,74 verlieren beide Gleichgewichte ihre Stabilität. Ab dann kann nichts mehr zur Ruhe kommen, und der Schmetterling bleibt.",
          "Dieser Schwellenwert ist nicht geschätzt. Für σ = 10 und β = 8/3 folgt er aus der Formel ρ = σ(σ + β + 3) / (σ − β − 1). Sie erklärt auch einen leiseren Effekt: Schiebst du σ unter β + 1, wird der Nenner negativ, und die beiden Gleichgewichte bleiben stabil, egal wie weit du ρ erhöhst.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Die Simulation läuft vollständig in deinem Browser auf einem 2D-Canvas. Sie integriert die Gleichungen mit dem klassischen Runge-Kutta-Verfahren vierter Ordnung (RK4), das die rechte Seite pro Schritt viermal auswertet und die Steigungen kombiniert. Im Vergleich zum naiven Euler-Verfahren bleibt RK4 auch bei viel größeren Schritten genau. Das zählt, wenn zwölf Schritte pro Animationsframe auf einem Smartphone laufen sollen.",
          "Jede neue Position landet in einem Ringpuffer mit 6000 Punkten in einem Float32Array, der Speicher bleibt also konstant, egal wie lange die Seite läuft. Die Punkte sind nach Alter eingefärbt, von warmem Bernstein für die neuesten bis Violett für die ältesten, und jeder Frame legt eine halbtransparente Schicht über das Canvas. Daraus entsteht die weiche Bewegungsspur. Die Projektionsknöpfe wählen, welche zwei der drei Koordinaten gezeichnet werden: XZ zeigt den bekannten Schmetterling, XY die Ansicht von oben, YZ die von der Seite.",
          "Wenn du σ, ρ oder β änderst, startet die Bahn neu bei (0,1, 0, 0). So siehst du immer denselben Anfangszustand unter neuen Regeln. Wünscht dein System reduzierte Bewegung, ersetzt ein Standbild die Animation: Die Simulation rechnet 800 Aufwärmschritte, um auf dem Attraktor zu landen, integriert dann die ganze Spur auf einmal und zeichnet sie ein einziges Mal.",
        ],
        code: RK4_EXCERPT,
      },
      {
        heading: "Warum der Zeitschritt zählt",
        paragraphs: [
          "Der dt-Regler legt die Größe jedes Integrationsschritts fest. Ein kleineres dt macht die Kurve glatter und langsamer, ein größeres schneller und gröber. Der Clou: In einem chaotischen System wächst selbst der winzige Rechenfehler von RK4 exponentiell, bei den klassischen Parametern verdoppelt er sich ungefähr alle 0,8 Zeiteinheiten. Zwei Läufe mit unterschiedlichem dt folgen deshalb nach kurzer Zeit verschiedenen Wegen, obwohl beide korrekte Bilder des Attraktors sind. Die Form ist verlässlich, der genaue Weg nicht. Das ist Lorenz' ursprüngliche Entdeckung, nachgestellt von deinem eigenen Browser.",
        ],
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Die Geburt des Schmetterlings",
        text: "Stell ρ auf 20 und warte, bis die Kurve in eine Spirale übergeht. Erhöhe ρ dann langsam über 24 und 25. Irgendwo um 24,74 zieht sich die Spirale nicht mehr zusammen, und die Bahn springt dauerhaft zwischen den Flügeln hin und her.",
      },
      {
        title: "Das Chaos mit σ abschalten",
        text: "Lass ρ auf 28 und senke σ auf 3. Die Gleichgewichte sind wieder stabil, und der Punkt spiralt in einen Flügel. Hebst du σ wieder über 4, kehrt der Schmetterling zurück.",
      },
      {
        title: "Die Flüssigkeit zur Ruhe bringen",
        text: "Zieh ρ unter 1. Jede Bewegung erstirbt, und der Punkt gleitet in den Ursprung, den Zustand, in dem die beheizte Schicht gar nicht konvektiert.",
      },
      {
        title: "Dieselbe Bahn von drei Seiten",
        text: "Wechsle bei den klassischen Werten zwischen XZ, XY und YZ. Es sind jedes Mal dieselben Punkte, nur die Kamera ändert sich. Von oben (XY) sehen die beiden Flügel fast wie eine Acht aus.",
      },
    ],
  },
  es: {
    metaDescription:
      "Explora el atractor de Lorenz en vivo: cambia σ, ρ y β, mira nacer la mariposa en ρ ≈ 24,74 y descubre cómo está hecha la simulación RK4 que la dibuja.",
    heading: "Cómo funciona este explorador",
    intro:
      "La curva luminosa es un único punto que se mueve por el espacio tridimensional siguiendo las ecuaciones de Lorenz. En cada fotograma la simulación lo hace avanzar un poco más y deja tras él una estela que se desvanece, así que lo que parece un dibujo es en realidad la historia reciente de una sola trayectoria. Nunca se repite y nunca se detiene, pero tampoco abandona jamás la región con forma de mariposa. Esa combinación es lo que en matemáticas se llama un atractor extraño.",
    sections: [
      {
        heading: "Las tres ecuaciones",
        paragraphs: [
          "Edward Lorenz escribió estas ecuaciones en 1963 como un modelo drásticamente simplificado del aire que sube y baja en una capa calentada desde abajo. x representa la intensidad del rollo de convección, y y z las diferencias de temperatura en su interior. El modelo es diminuto: tres variables, dos productos, nada de azar. Lorenz observó que redondear un valor inicial de seis a tres decimales producía, al cabo de un rato, un pronóstico completamente distinto, y esa observación fue el punto de partida de la teoría del caos.",
        ],
        formula: LORENZ_FORMULA,
      },
      {
        heading: "Qué hacen los controles",
        paragraphs: [
          "σ (sigma) es el número de Prandtl, la relación entre la rapidez con que el fluido suaviza el movimiento y la rapidez con que suaviza el calor. ρ (rho) es el número de Rayleigh, es decir, con cuánta fuerza se calienta la capa. β (beta) codifica la geometría de la celda de convección. Los valores clásicos que usó Lorenz son σ = 10, ρ = 28 y β = 8/3; el botón de reinicio vuelve exactamente a ellos.",
          "ρ es el control con más dramatismo. Por debajo de ρ = 1 toda trayectoria cae al origen: el fluido está en reposo. Por encima de 1 aparecen dos nuevos puntos de equilibrio, uno en el centro de cada ala, y para valores moderados de ρ el punto simplemente cae en espiral hacia uno de ellos. En torno a ρ ≈ 13,93 las trayectorias empiezan a saltar entre las alas antes de asentarse, y en ρ ≈ 24,74 ambos equilibrios pierden su estabilidad. A partir de ahí nada puede asentarse y la mariposa es permanente.",
          "Ese umbral no es una estimación. Para σ = 10 y β = 8/3 se deduce de la fórmula ρ = σ(σ + β + 3) / (σ − β − 1). También explica un efecto más discreto: si bajas σ por debajo de β + 1, el denominador se vuelve negativo y los dos equilibrios siguen siendo estables por mucho que subas ρ.",
        ],
      },
      {
        heading: "Cómo está hecho",
        paragraphs: [
          "La simulación se ejecuta por completo en tu navegador, sobre un canvas 2D. Integra las ecuaciones con el método clásico de Runge-Kutta de cuarto orden (RK4), que evalúa el lado derecho cuatro veces por paso y combina las pendientes. Frente al ingenuo método de Euler, RK4 sigue siendo preciso con pasos mucho mayores, algo que importa cuando quieres doce pasos por fotograma de animación en un móvil.",
          "Cada nueva posición entra en un búfer circular de 6000 puntos guardado en un Float32Array, de modo que la memoria permanece constante por mucho tiempo que la página lleve abierta. Los puntos se colorean según su edad, desde un ámbar cálido para los más recientes hasta el violeta para los más antiguos, y cada fotograma pinta una capa semitransparente sobre el canvas, lo que produce la suave estela de movimiento. Los botones de proyección eligen cuáles dos de las tres coordenadas se dibujan: XZ muestra la mariposa de siempre, XY la vista desde arriba, YZ la vista lateral.",
          "Al cambiar σ, ρ o β, la trayectoria vuelve a empezar en (0,1; 0; 0), así que siempre ves evolucionar la misma condición inicial bajo reglas nuevas. Si tu sistema pide movimiento reducido, la animación se sustituye por una imagen fija: la simulación ejecuta 800 pasos de calentamiento para llegar al atractor, integra después toda la estela de una vez y la dibuja una sola vez.",
        ],
        code: RK4_EXCERPT,
      },
      {
        heading: "Por qué importa el paso temporal",
        paragraphs: [
          "El control dt fija el tamaño de cada paso de integración. Un dt menor hace la curva más suave y más lenta; uno mayor, más rápida y más tosca. Y aquí viene lo curioso: en un sistema caótico incluso el minúsculo error numérico de RK4 crece exponencialmente y, con los parámetros clásicos, se duplica más o menos cada 0,8 unidades de tiempo. Por eso dos ejecuciones con dt distintos siguen caminos diferentes al poco rato, aunque ambas sean imágenes correctas del atractor. La forma es fiable; la ruta exacta, no. Es el descubrimiento original de Lorenz, reproducido por tu propio navegador.",
        ],
      },
    ],
    experimentsHeading: "Prueba esto",
    experiments: [
      {
        title: "Mira nacer la mariposa",
        text: "Pon ρ en 20 y espera a que la curva se asiente en una espiral. Después sube ρ despacio hasta pasar de 24 y de 25. En algún punto cerca de 24,74 la espiral deja de cerrarse y la trayectoria empieza a saltar entre las alas para siempre.",
      },
      {
        title: "Apaga el caos con σ",
        text: "Deja ρ en 28 y baja σ a 3. Los equilibrios vuelven a ser estables y el punto cae en espiral hacia un ala. Sube σ otra vez por encima de 4 y la mariposa regresa.",
      },
      {
        title: "Deja reposar el fluido",
        text: "Lleva ρ por debajo de 1. Todo movimiento se extingue y el punto se desliza hasta el origen, el estado en el que la capa calentada no presenta convección alguna.",
      },
      {
        title: "La misma órbita desde tres lados",
        text: "Con los valores clásicos, alterna entre XZ, XY e YZ. Es siempre el mismo conjunto de puntos; solo cambia la cámara. Vistos desde arriba (XY), los dos lóbulos casi parecen un ocho.",
      },
    ],
  },
  fr: {
    metaDescription:
      "Explore l'attracteur de Lorenz en direct : modifie σ, ρ et β, regarde le papillon naître vers ρ ≈ 24,74 et découvre comment est faite la simulation RK4.",
    heading: "Comment fonctionne cet explorateur",
    intro:
      "La courbe lumineuse est un point unique qui se déplace dans l'espace à trois dimensions en suivant les équations de Lorenz. À chaque image, la simulation le fait avancer un peu et laisse derrière lui une traînée qui s'estompe : ce qui ressemble à un dessin est en réalité l'histoire récente d'une seule trajectoire. Elle ne se répète jamais et ne s'arrête jamais, et pourtant elle ne quitte jamais la région en forme de papillon. C'est cette combinaison que les mathématiciennes et mathématiciens appellent un attracteur étrange.",
    sections: [
      {
        heading: "Les trois équations",
        paragraphs: [
          "Edward Lorenz a écrit ces équations en 1963 comme un modèle radicalement simplifié de l'air qui monte et descend dans une couche chauffée par le bas. x représente l'intensité du rouleau de convection, y et z des différences de température à l'intérieur. Le modèle est minuscule : trois variables, deux produits, aucun hasard. Lorenz a remarqué qu'arrondir une valeur initiale de six à trois décimales donnait, au bout d'un moment, une prévision complètement différente, et cette observation est devenue le point de départ de la théorie du chaos.",
        ],
        formula: LORENZ_FORMULA,
      },
      {
        heading: "À quoi servent les curseurs",
        paragraphs: [
          "σ (sigma) est le nombre de Prandtl, le rapport entre la vitesse à laquelle le fluide lisse le mouvement et celle à laquelle il lisse la chaleur. ρ (rho) est le nombre de Rayleigh, c'est-à-dire l'intensité du chauffage de la couche. β (bêta) encode la géométrie de la cellule de convection. Les valeurs classiques utilisées par Lorenz sont σ = 10, ρ = 28 et β = 8/3 ; le bouton de réinitialisation revient exactement à celles-ci.",
          "ρ est le curseur le plus spectaculaire. En dessous de ρ = 1, toute trajectoire tombe dans l'origine : le fluide est au repos. Au-dessus de 1, deux nouveaux points d'équilibre apparaissent, un au centre de chaque aile, et pour des valeurs modérées de ρ le point s'enroule simplement en spirale vers l'un d'eux. Vers ρ ≈ 13,93, les trajectoires commencent à passer d'une aile à l'autre avant de se fixer, et à ρ ≈ 24,74 les deux équilibres perdent leur stabilité. À partir de là, plus rien ne peut se fixer et le papillon est permanent.",
          "Ce seuil n'est pas une estimation. Pour σ = 10 et β = 8/3, il découle de la formule ρ = σ(σ + β + 3) / (σ − β − 1). Elle explique aussi un effet plus discret : si tu fais descendre σ sous β + 1, le dénominateur devient négatif et les deux équilibres restent stables, aussi loin que tu pousses ρ.",
        ],
      },
      {
        heading: "Comment c'est construit",
        paragraphs: [
          "La simulation tourne entièrement dans ton navigateur, sur un canvas 2D. Elle intègre les équations avec la méthode classique de Runge-Kutta d'ordre quatre (RK4), qui évalue le membre de droite quatre fois par pas et combine les pentes. Comparée à la méthode d'Euler, plus naïve, RK4 reste précise avec des pas bien plus grands, ce qui compte quand on veut douze pas par image d'animation sur un téléphone.",
          "Chaque nouvelle position entre dans un tampon circulaire de 6000 points stocké dans un Float32Array, si bien que la mémoire reste constante quelle que soit la durée d'exécution de la page. Les points sont colorés selon leur âge, d'un ambre chaud pour les plus récents au violet pour les plus anciens, et chaque image peint une couche semi-transparente sur le canvas, ce qui produit la douce traînée de mouvement. Les boutons de projection choisissent lesquelles des trois coordonnées sont dessinées, deux à la fois : XZ montre le papillon bien connu, XY la vue de dessus, YZ la vue de côté.",
          "Modifier σ, ρ ou β relance la trajectoire en (0,1 ; 0 ; 0) : tu vois donc toujours la même condition initiale évoluer sous de nouvelles règles. Si ton système demande une réduction des animations, l'animation est remplacée par une image fixe : la simulation effectue 800 pas d'échauffement pour rejoindre l'attracteur, puis intègre toute la traînée d'un coup et la dessine une seule fois.",
        ],
        code: RK4_EXCERPT,
      },
      {
        heading: "Pourquoi le pas de temps compte",
        paragraphs: [
          "Le curseur dt règle la taille de chaque pas d'intégration. Un dt plus petit rend la courbe plus lisse et plus lente, un dt plus grand la rend plus rapide et plus grossière. Et voici le plus surprenant : dans un système chaotique, même la minuscule erreur numérique de RK4 croît de façon exponentielle et double à peu près toutes les 0,8 unité de temps pour les paramètres classiques. Deux exécutions avec des dt différents suivent donc des chemins différents au bout de peu de temps, alors que toutes deux sont des images correctes de l'attracteur. La forme est fiable ; l'itinéraire exact ne l'est pas. C'est la découverte originale de Lorenz, reproduite par ton propre navigateur.",
        ],
      },
    ],
    experimentsHeading: "À essayer",
    experiments: [
      {
        title: "Regarde naître le papillon",
        text: "Règle ρ sur 20 et attends que la courbe se stabilise en spirale. Augmente ensuite ρ lentement au-delà de 24 puis de 25. Quelque part vers 24,74, la spirale cesse de se resserrer et la trajectoire se met à sauter d'une aile à l'autre pour de bon.",
      },
      {
        title: "Éteins le chaos avec σ",
        text: "Garde ρ à 28 et abaisse σ à 3. Les équilibres redeviennent stables et le point s'enroule en spirale dans une aile. Remonte σ au-dessus de 4 et le papillon revient.",
      },
      {
        title: "Laisse le fluide se reposer",
        text: "Fais passer ρ sous 1. Tout mouvement s'éteint et le point glisse vers l'origine, l'état dans lequel la couche chauffée ne présente aucune convection.",
      },
      {
        title: "La même orbite vue de trois côtés",
        text: "Avec les valeurs classiques, passe de XZ à XY puis à YZ. C'est chaque fois le même ensemble de points ; seule la caméra change. Vus de dessus (XY), les deux lobes ressemblent presque à un huit.",
      },
    ],
  },
  it: {
    metaDescription:
      "Esplora l'attrattore di Lorenz dal vivo: cambia σ, ρ e β, guarda nascere la farfalla a ρ ≈ 24,74 e scopri com'è costruita la simulazione RK4 che la disegna.",
    heading: "Come funziona questo esploratore",
    intro:
      "La curva luminosa è un unico punto che si muove nello spazio tridimensionale seguendo le equazioni di Lorenz. A ogni fotogramma la simulazione lo fa avanzare di un altro po' e lascia dietro di sé una scia che svanisce, quindi quello che sembra un disegno è in realtà la storia recente di una sola traiettoria. Non si ripete mai e non si ferma mai, eppure non esce mai dalla regione a forma di farfalla. È questa combinazione che in matematica si chiama attrattore strano.",
    sections: [
      {
        heading: "Le tre equazioni",
        paragraphs: [
          "Edward Lorenz scrisse queste equazioni nel 1963 come modello drasticamente semplificato dell'aria che sale e scende in uno strato riscaldato dal basso. x rappresenta l'intensità del rullo di convezione, y e z le differenze di temperatura al suo interno. Il modello è minuscolo: tre variabili, due prodotti, niente di casuale. Lorenz notò che arrotondare un valore iniziale da sei a tre decimali produceva, dopo un po', una previsione completamente diversa, e quell'osservazione divenne il punto di partenza della teoria del caos.",
        ],
        formula: LORENZ_FORMULA,
      },
      {
        heading: "Che cosa fanno i cursori",
        paragraphs: [
          "σ (sigma) è il numero di Prandtl, il rapporto tra la rapidità con cui il fluido attenua il moto e quella con cui attenua il calore. ρ (rho) è il numero di Rayleigh, cioè quanto intensamente viene riscaldato lo strato. β (beta) codifica la geometria della cella di convezione. I valori classici usati da Lorenz sono σ = 10, ρ = 28 e β = 8/3; il pulsante di ripristino torna esattamente a quelli.",
          "ρ è il cursore più spettacolare. Sotto ρ = 1 ogni traiettoria cade nell'origine: il fluido è in quiete. Sopra 1 compaiono due nuovi punti di equilibrio, uno al centro di ciascuna ala, e per valori moderati di ρ il punto scende semplicemente a spirale verso uno dei due. Intorno a ρ ≈ 13,93 le traiettorie cominciano a passare da un'ala all'altra prima di assestarsi, e a ρ ≈ 24,74 entrambi gli equilibri perdono la stabilità. Da lì in poi nulla può assestarsi e la farfalla è permanente.",
          "Quella soglia non è una stima. Per σ = 10 e β = 8/3 deriva dalla formula ρ = σ(σ + β + 3) / (σ − β − 1). Spiega anche un effetto più discreto: se porti σ sotto β + 1, il denominatore diventa negativo e i due equilibri restano stabili per quanto tu alzi ρ.",
        ],
      },
      {
        heading: "Com'è costruito",
        paragraphs: [
          "La simulazione gira interamente nel tuo browser su un canvas 2D. Integra le equazioni con il classico metodo di Runge-Kutta del quarto ordine (RK4), che valuta il secondo membro quattro volte per passo e combina le pendenze. Rispetto all'ingenuo metodo di Eulero, RK4 resta preciso con passi molto più grandi, il che conta quando vuoi dodici passi per fotogramma di animazione su un telefono.",
          "Ogni nuova posizione finisce in un buffer circolare di 6000 punti memorizzato in un Float32Array, così la memoria resta costante per quanto a lungo la pagina rimanga aperta. I punti sono colorati in base all'età, da un ambra caldo per i più recenti al viola per i più vecchi, e ogni fotogramma stende sul canvas uno strato semitrasparente, da cui nasce la morbida scia di movimento. I pulsanti di proiezione scelgono quali due delle tre coordinate vengono disegnate: XZ mostra la farfalla che tutti conoscono, XY la vista dall'alto, YZ la vista di lato.",
          "Cambiare σ, ρ o β fa ripartire la traiettoria da (0,1; 0; 0), quindi vedi sempre la stessa condizione iniziale evolvere sotto regole nuove. Se il tuo sistema chiede di ridurre il movimento, l'animazione è sostituita da un'immagine fissa: la simulazione esegue 800 passi di riscaldamento per arrivare sull'attrattore, poi integra l'intera scia in una volta e la disegna una volta sola.",
        ],
        code: RK4_EXCERPT,
      },
      {
        heading: "Perché il passo temporale conta",
        paragraphs: [
          "Il cursore dt imposta la dimensione di ogni passo di integrazione. Un dt più piccolo rende la curva più liscia e più lenta, uno più grande la rende più veloce e più grossolana. E qui sta il bello: in un sistema caotico perfino il minuscolo errore numerico di RK4 cresce in modo esponenziale e, con i parametri classici, raddoppia all'incirca ogni 0,8 unità di tempo. Due esecuzioni con dt diversi seguono perciò percorsi diversi dopo poco tempo, anche se entrambe sono immagini corrette dell'attrattore. La forma è affidabile; il percorso esatto no. È la scoperta originale di Lorenz, riprodotta dal tuo stesso browser.",
        ],
      },
    ],
    experimentsHeading: "Prova così",
    experiments: [
      {
        title: "Guarda nascere la farfalla",
        text: "Imposta ρ a 20 e aspetta che la curva si assesti in una spirale. Poi alza lentamente ρ oltre 24 e 25. Da qualche parte intorno a 24,74 la spirale smette di stringersi e la traiettoria comincia a saltare tra le ali per sempre.",
      },
      {
        title: "Spegni il caos con σ",
        text: "Tieni ρ a 28 e abbassa σ a 3. Gli equilibri tornano stabili e il punto scende a spirale in un'ala. Riporta σ sopra 4 e la farfalla ritorna.",
      },
      {
        title: "Lascia riposare il fluido",
        text: "Porta ρ sotto 1. Ogni movimento si spegne e il punto scivola nell'origine, lo stato in cui lo strato riscaldato non presenta alcuna convezione.",
      },
      {
        title: "La stessa orbita da tre lati",
        text: "Con i valori classici, passa da XZ a XY e a YZ. È ogni volta lo stesso insieme di punti; cambia solo la telecamera. Visti dall'alto (XY), i due lobi sembrano quasi un otto.",
      },
    ],
  },
  pt: {
    metaDescription:
      "Explora o atrator de Lorenz ao vivo: altera σ, ρ e β, vê a borboleta nascer em ρ ≈ 24,74 e descobre como é construída a simulação RK4 que a desenha.",
    heading: "Como funciona este explorador",
    intro:
      "A curva luminosa é um único ponto que se move pelo espaço tridimensional de acordo com as equações de Lorenz. A cada fotograma a simulação fá-lo avançar mais um pouco e deixa atrás dele um rasto que se desvanece, por isso o que parece um desenho é na verdade a história recente de uma só trajetória. Nunca se repete e nunca assenta, mas também nunca sai da região em forma de borboleta. É a esta combinação que a matemática chama um atrator estranho.",
    sections: [
      {
        heading: "As três equações",
        paragraphs: [
          "Edward Lorenz escreveu estas equações em 1963 como um modelo drasticamente simplificado do ar que sobe e desce numa camada aquecida por baixo. x representa a intensidade do rolo de convecção, y e z as diferenças de temperatura no seu interior. O modelo é minúsculo: três variáveis, dois produtos, nada de aleatório. Lorenz reparou que arredondar um valor inicial de seis para três casas decimais produzia, passado algum tempo, uma previsão completamente diferente, e essa observação tornou-se o ponto de partida da teoria do caos.",
        ],
        formula: LORENZ_FORMULA,
      },
      {
        heading: "O que fazem os controlos",
        paragraphs: [
          "σ (sigma) é o número de Prandtl, a razão entre a rapidez com que o fluido suaviza o movimento e a rapidez com que suaviza o calor. ρ (ró) é o número de Rayleigh, ou seja, a intensidade com que a camada é aquecida. β (beta) codifica a geometria da célula de convecção. Os valores clássicos usados por Lorenz são σ = 10, ρ = 28 e β = 8/3; o botão de reposição regressa exatamente a eles.",
          "ρ é o controlo mais dramático. Abaixo de ρ = 1 todas as trajetórias caem na origem: o fluido está em repouso. Acima de 1 surgem dois novos pontos de equilíbrio, um no centro de cada asa, e para valores moderados de ρ o ponto limita-se a descer em espiral para um deles. Por volta de ρ ≈ 13,93 as trajetórias começam a alternar entre as asas antes de assentarem, e em ρ ≈ 24,74 ambos os equilíbrios perdem a estabilidade. A partir daí nada consegue assentar e a borboleta é permanente.",
          "Esse limiar não é um palpite. Para σ = 10 e β = 8/3 resulta da fórmula ρ = σ(σ + β + 3) / (σ − β − 1). Ela explica também um efeito mais discreto: se levares σ abaixo de β + 1, o denominador fica negativo e os dois equilíbrios mantêm-se estáveis por mais que aumentes ρ.",
        ],
      },
      {
        heading: "Como é construído",
        paragraphs: [
          "A simulação corre inteiramente no teu navegador, num canvas 2D. Integra as equações com o método clássico de Runge-Kutta de quarta ordem (RK4), que avalia o lado direito quatro vezes por passo e combina os declives. Comparado com o ingénuo método de Euler, o RK4 mantém-se preciso com passos muito maiores, o que conta quando se querem doze passos por fotograma de animação num telemóvel.",
          "Cada nova posição entra num buffer circular de 6000 pontos guardado num Float32Array, pelo que a memória se mantém constante por muito tempo que a página esteja aberta. Os pontos são coloridos pela idade, de um âmbar quente para os mais recentes até ao violeta para os mais antigos, e cada fotograma pinta uma camada semitransparente sobre o canvas, o que produz o suave rasto de movimento. Os botões de projeção escolhem quais duas das três coordenadas são desenhadas: XZ mostra a borboleta conhecida, XY a vista de cima, YZ a vista de lado.",
          "Alterar σ, ρ ou β reinicia a trajetória em (0,1; 0; 0), por isso vês sempre a mesma condição inicial a evoluir sob regras novas. Se o teu sistema pedir movimento reduzido, a animação é substituída por uma imagem fixa: a simulação executa 800 passos de aquecimento para chegar ao atrator, depois integra todo o rasto de uma vez e desenha-o uma única vez.",
        ],
        code: RK4_EXCERPT,
      },
      {
        heading: "Porque é que o passo temporal importa",
        paragraphs: [
          "O controlo dt define o tamanho de cada passo de integração. Um dt menor torna a curva mais suave e mais lenta, um maior torna-a mais rápida e mais grosseira. E aqui está a reviravolta: num sistema caótico, até o minúsculo erro numérico do RK4 cresce exponencialmente e, com os parâmetros clássicos, duplica mais ou menos a cada 0,8 unidades de tempo. Duas execuções com dt diferentes seguem por isso caminhos diferentes ao fim de pouco tempo, embora ambas sejam imagens corretas do atrator. A forma é fiável; o percurso exato não. É a descoberta original de Lorenz, reproduzida pelo teu próprio navegador.",
        ],
      },
    ],
    experimentsHeading: "Experimenta isto",
    experiments: [
      {
        title: "Vê a borboleta nascer",
        text: "Põe ρ em 20 e espera até a curva assentar numa espiral. Depois aumenta ρ devagar para lá de 24 e de 25. Algures perto de 24,74 a espiral deixa de se fechar e a trajetória começa a saltar entre as asas de vez.",
      },
      {
        title: "Desliga o caos com σ",
        text: "Mantém ρ em 28 e baixa σ para 3. Os equilíbrios voltam a ser estáveis e o ponto desce em espiral para uma asa. Volta a subir σ acima de 4 e a borboleta regressa.",
      },
      {
        title: "Deixa o fluido repousar",
        text: "Puxa ρ para baixo de 1. Todo o movimento se extingue e o ponto desliza para a origem, o estado em que a camada aquecida não apresenta convecção nenhuma.",
      },
      {
        title: "A mesma órbita vista de três lados",
        text: "Com os valores clássicos, alterna entre XZ, XY e YZ. É sempre o mesmo conjunto de pontos; só a câmara muda. Vistos de cima (XY), os dois lóbulos quase parecem um oito.",
      },
    ],
  },
  sv: {
    metaDescription:
      "Utforska Lorenzattraktorn live: ändra σ, ρ och β, se fjärilen födas vid ρ ≈ 24,74 och läs hur RK4-simuleringen bakom kurvan är uppbyggd, steg för steg.",
    heading: "Så fungerar den här utforskaren",
    intro:
      "Den lysande kurvan är en enda punkt som rör sig genom det tredimensionella rummet enligt Lorenz ekvationer. För varje bildruta flyttar simuleringen fram den en liten bit och lämnar ett bleknande spår efter sig, så det som ser ut som en teckning är egentligen den senaste historien för en enda bana. Den upprepar sig aldrig och kommer aldrig till ro, men den lämnar heller aldrig det fjärilsformade området. Den kombinationen är vad matematiker kallar en sällsam attraktor.",
    sections: [
      {
        heading: "De tre ekvationerna",
        paragraphs: [
          "Edward Lorenz skrev ner ekvationerna 1963 som en kraftigt förenklad modell av luft som stiger och sjunker i ett skikt som värms underifrån. x står för konvektionsrullens styrka, y och z för temperaturskillnader inuti den. Modellen är pytteliten: tre variabler, två produkter, ingen slump. Lorenz märkte att ett startvärde som avrundats från sex till tre decimaler efter en stund gav en helt annan prognos, och den iakttagelsen blev startpunkten för kaosteorin.",
        ],
        formula: LORENZ_FORMULA,
      },
      {
        heading: "Vad reglagen gör",
        paragraphs: [
          "σ (sigma) är Prandtltalet, förhållandet mellan hur snabbt vätskan jämnar ut rörelse och hur snabbt den jämnar ut värme. ρ (rho) är Rayleightalet, alltså hur kraftigt skiktet värms. β (beta) beskriver konvektionscellens geometri. De klassiska värden som Lorenz använde är σ = 10, ρ = 28 och β = 8/3; återställningsknappen går tillbaka till exakt dem.",
          "ρ är reglaget med mest dramatik. Under ρ = 1 faller varje bana in i origo: vätskan är i vila. Över 1 uppstår två nya jämviktspunkter, en mitt i varje vinge, och för måttliga ρ går punkten helt enkelt i spiral in mot en av dem. Kring ρ ≈ 13,93 börjar banorna växla mellan vingarna innan de slår sig till ro, och vid ρ ≈ 24,74 förlorar båda jämviktslägena sin stabilitet. Därifrån kan ingenting komma till ro och fjärilen är permanent.",
          "Det tröskelvärdet är ingen gissning. För σ = 10 och β = 8/3 följer det av formeln ρ = σ(σ + β + 3) / (σ − β − 1). Den förklarar också en mer lågmäld effekt: om du drar σ under β + 1 blir nämnaren negativ och de två jämviktslägena förblir stabila hur högt du än höjer ρ.",
        ],
      },
      {
        heading: "Hur den är byggd",
        paragraphs: [
          "Simuleringen körs helt och hållet i din webbläsare på en 2D-canvas. Den integrerar ekvationerna med den klassiska Runge-Kutta-metoden av fjärde ordningen (RK4), som utvärderar högerledet fyra gånger per steg och väger samman lutningarna. Jämfört med den naiva Eulermetoden förblir RK4 noggrann med mycket större steg, vilket spelar roll när man vill ha tolv steg per animationsruta på en mobil.",
          "Varje ny position hamnar i en ringbuffert med 6000 punkter som lagras i en Float32Array, så minnesåtgången är konstant hur länge sidan än körs. Punkterna färgas efter ålder, från varm bärnsten för de nyaste till violett för de äldsta, och varje bildruta målar ett halvgenomskinligt lager över canvasen, vilket ger det mjuka rörelsespåret. Projektionsknapparna väljer vilka två av de tre koordinaterna som ritas: XZ visar den välbekanta fjärilen, XY vyn ovanifrån, YZ vyn från sidan.",
          "När du ändrar σ, ρ eller β startar banan om i (0,1; 0; 0), så du ser alltid samma begynnelsevillkor utvecklas under nya regler. Om ditt system ber om minskad rörelse ersätts animationen av en stillbild: simuleringen kör 800 uppvärmningssteg för att landa på attraktorn, integrerar sedan hela spåret på en gång och ritar det en enda gång.",
        ],
        code: RK4_EXCERPT,
      },
      {
        heading: "Varför tidssteget spelar roll",
        paragraphs: [
          "Reglaget dt bestämmer storleken på varje integrationssteg. Ett mindre dt gör kurvan jämnare och långsammare, ett större gör den snabbare och grövre. Här kommer det oväntade: i ett kaotiskt system växer till och med RK4:s pyttelilla numeriska fel exponentiellt och fördubblas ungefär var 0,8:e tidsenhet för de klassiska parametrarna. Två körningar med olika dt följer därför olika vägar efter en kort stund, trots att båda är korrekta bilder av attraktorn. Formen går att lita på, den exakta vägen gör det inte. Det är Lorenz ursprungliga upptäckt, återskapad av din egen webbläsare.",
        ],
      },
    ],
    experimentsHeading: "Prova det här",
    experiments: [
      {
        title: "Se fjärilen födas",
        text: "Ställ ρ på 20 och vänta tills kurvan lägger sig i en spiral. Höj sedan ρ långsamt förbi 24 och 25. Någonstans kring 24,74 slutar spiralen att dra ihop sig och banan börjar hoppa mellan vingarna för gott.",
      },
      {
        title: "Stäng av kaoset med σ",
        text: "Låt ρ stå på 28 och sänk σ till 3. Jämviktslägena är stabila igen och punkten går i spiral in i en vinge. Höj σ över 4 igen och fjärilen kommer tillbaka.",
      },
      {
        title: "Låt vätskan vila",
        text: "Dra ρ under 1. All rörelse dör ut och punkten glider in i origo, tillståndet där det uppvärmda skiktet inte har någon konvektion alls.",
      },
      {
        title: "Samma bana från tre håll",
        text: "Växla mellan XZ, XY och YZ med de klassiska värdena. Det är samma punktmängd varje gång; bara kameran ändras. Ovanifrån (XY) ser de två loberna nästan ut som en åtta.",
      },
    ],
  },
  no: {
    metaDescription:
      "Utforsk Lorenz-attraktoren direkte: endre σ, ρ og β, se sommerfuglen bli til ved ρ ≈ 24,74, og les hvordan RK4-simuleringen bak kurven er bygget opp.",
    heading: "Slik fungerer denne utforskeren",
    intro:
      "Den lysende kurven er ett enkelt punkt som beveger seg gjennom det tredimensjonale rommet etter Lorenz-ligningene. For hvert bilde flytter simuleringen det litt videre og etterlater et spor som blekner, så det som ser ut som en tegning, er egentlig den nyeste historien til én eneste bane. Den gjentar seg aldri og faller aldri til ro, men den forlater heller aldri det sommerfuglformede området. Den kombinasjonen er det matematikere kaller en merkelig attraktor.",
    sections: [
      {
        heading: "De tre ligningene",
        paragraphs: [
          "Edward Lorenz skrev disse ligningene i 1963 som en drastisk forenklet modell av luft som stiger og synker i et lag som varmes opp nedenfra. x står for styrken på konveksjonsrullen, y og z for temperaturforskjeller inne i den. Modellen er bitte liten: tre variabler, to produkter, ingenting tilfeldig. Lorenz la merke til at en startverdi avrundet fra seks til tre desimaler etter en stund ga et helt annet varsel, og den observasjonen ble utgangspunktet for kaosteorien.",
        ],
        formula: LORENZ_FORMULA,
      },
      {
        heading: "Hva glidebryterne gjør",
        paragraphs: [
          "σ (sigma) er Prandtl-tallet, forholdet mellom hvor raskt væsken jevner ut bevegelse og hvor raskt den jevner ut varme. ρ (rho) er Rayleigh-tallet, altså hvor kraftig laget varmes opp. β (beta) beskriver geometrien til konveksjonscellen. De klassiske verdiene Lorenz brukte, er σ = 10, ρ = 28 og β = 8/3; tilbakestillingsknappen går tilbake til nøyaktig disse.",
          "ρ er glidebryteren med mest dramatikk. Under ρ = 1 faller hver bane inn i origo: væsken er i ro. Over 1 oppstår to nye likevektspunkter, ett midt i hver vinge, og for moderate ρ går punktet ganske enkelt i spiral inn mot ett av dem. Rundt ρ ≈ 13,93 begynner banene å veksle mellom vingene før de faller til ro, og ved ρ ≈ 24,74 mister begge likevektene stabiliteten. Derfra kan ingenting falle til ro, og sommerfuglen er permanent.",
          "Den terskelen er ingen gjetning. For σ = 10 og β = 8/3 følger den av formelen ρ = σ(σ + β + 3) / (σ − β − 1). Den forklarer også en mer lavmælt effekt: Hvis du skyver σ under β + 1, blir nevneren negativ, og de to likevektene forblir stabile uansett hvor høyt du øker ρ.",
        ],
      },
      {
        heading: "Hvordan den er bygget",
        paragraphs: [
          "Simuleringen kjører i sin helhet i nettleseren din på et 2D-canvas. Den integrerer ligningene med den klassiske Runge-Kutta-metoden av fjerde orden (RK4), som evaluerer høyresiden fire ganger per steg og kombinerer stigningene. Sammenlignet med den naive Euler-metoden holder RK4 seg nøyaktig med mye større steg, og det teller når man vil ha tolv steg per animasjonsbilde på en mobil.",
          "Hver ny posisjon går inn i en ringbuffer med 6000 punkter lagret i en Float32Array, så minnebruken er konstant uansett hvor lenge siden kjører. Punktene farges etter alder, fra varm rav for de nyeste til fiolett for de eldste, og hvert bilde maler et halvgjennomsiktig lag over canvaset, noe som gir det myke bevegelsessporet. Projeksjonsknappene velger hvilke to av de tre koordinatene som tegnes: XZ viser den velkjente sommerfuglen, XY utsikten ovenfra, YZ utsikten fra siden.",
          "Når du endrer σ, ρ eller β, starter banen på nytt i (0,1; 0; 0), så du ser alltid den samme startbetingelsen utvikle seg under nye regler. Hvis systemet ditt ber om redusert bevegelse, erstattes animasjonen av et stillbilde: Simuleringen kjører 800 oppvarmingssteg for å lande på attraktoren, integrerer deretter hele sporet på én gang og tegner det én eneste gang.",
        ],
        code: RK4_EXCERPT,
      },
      {
        heading: "Hvorfor tidssteget betyr noe",
        paragraphs: [
          "Glidebryteren dt bestemmer størrelsen på hvert integrasjonssteg. En mindre dt gjør kurven jevnere og langsommere, en større gjør den raskere og grovere. Her kommer vrien: I et kaotisk system vokser selv den bitte lille numeriske feilen i RK4 eksponentielt, og med de klassiske parameterne dobles den omtrent hver 0,8 tidsenhet. To kjøringer med ulik dt følger derfor ulike veier etter kort tid, selv om begge er korrekte bilder av attraktoren. Formen er til å stole på, den nøyaktige ruten er det ikke. Det er Lorenz' opprinnelige oppdagelse, gjenskapt av din egen nettleser.",
        ],
      },
    ],
    experimentsHeading: "Prøv dette",
    experiments: [
      {
        title: "Se sommerfuglen bli født",
        text: "Sett ρ til 20 og vent til kurven legger seg i en spiral. Øk deretter ρ sakte forbi 24 og 25. Et sted rundt 24,74 slutter spiralen å trekke seg sammen, og banen begynner å hoppe mellom vingene for godt.",
      },
      {
        title: "Slå av kaoset med σ",
        text: "La ρ stå på 28 og senk σ til 3. Likevektene er stabile igjen, og punktet går i spiral inn i én vinge. Hev σ over 4 igjen, og sommerfuglen kommer tilbake.",
      },
      {
        title: "La væsken hvile",
        text: "Dra ρ under 1. All bevegelse dør ut, og punktet glir inn i origo, tilstanden der det oppvarmede laget ikke har noen konveksjon i det hele tatt.",
      },
      {
        title: "Samme bane fra tre sider",
        text: "Veksle mellom XZ, XY og YZ med de klassiske verdiene. Det er den samme punktmengden hver gang; bare kameraet endrer seg. Sett ovenfra (XY) ser de to lobene nesten ut som et åttetall.",
      },
    ],
  },
};
