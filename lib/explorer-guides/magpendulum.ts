import type { ExplorerGuide } from "./types";

// Numbers quoted here (dt = 0.02, 3000 steps, capture radius² 0.06 and
// speed² 0.005, 6 rows per frame, the slider defaults) match
// app/magpendulum/explorer/page.tsx; update both together.
const STEP_EXCERPT = `const dt = 0.02;
for (let step = 0; step < maxSteps; step++) {
  let ax = -gamma * vx - omega2 * x;
  let ay = -gamma * vy - omega2 * y;
  for (let i = 0; i < magnets.length; i++) {
    const dx = x - magnets[i].x;
    const dy = y - magnets[i].y;
    const r2 = dx * dx + dy * dy + h * h;
    const r3 = r2 * Math.sqrt(r2);
    ax -= (k * dx) / r3;
    ay -= (k * dy) / r3;
  }
  vx += ax * dt;  vy += ay * dt;  // velocity first,
  x += vx * dt;   y += vy * dt;   // then position
  // every 8 steps: captured if d² < 0.06 and v² < 0.005
}`;

export const MAGPENDULUM_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Magnetic pendulum basin map: every pixel is a full simulation of a pendulum over three magnets. Tune strength, damping and height and see fractal boundaries.",
    heading: "How this explorer works",
    intro:
      "Picture a pendulum bob hanging over a plate with three magnets set in a triangle. Pull it to some point, let go, and after a while it comes to rest over one of the magnets. The map colours every starting point by the magnet that finally catches it: rose, cyan or green. Big calm patches mean predictable behaviour. Where the colours braid into thin interleaved bands, a tiny change in where you let go decides the outcome. Every pixel is its own complete simulation.",
    sections: [
      {
        heading: "The model",
        paragraphs: [
          "The explorer flattens the pendulum into the plane: p = (x, y) is the position of the bob seen from above. Three forces act on it. Air resistance γ·ṗ slows it down, a spring term ω²·p pulls it back toward the centre (that is what gravity does for a real pendulum at small amplitudes), and each magnet pulls it toward itself with a force that falls off with distance.",
          "The bob does not touch the plate. It swings at height h above it, so the distance to a magnet is √(d² + h²) rather than d. That keeps the force finite directly over a magnet and is what makes the model behave sensibly. The magnets sit at the corners of an equilateral triangle of radius 1 around the centre, at (0, −1) and (±0.866, 0.5).",
        ],
        formula:
          "\\ddot{\\mathbf p} = -\\gamma\\,\\dot{\\mathbf p} - \\omega^2 \\mathbf p - \\sum_{i=1}^{3} \\frac{k\\,(\\mathbf p - \\mathbf m_i)}{\\left(|\\mathbf p - \\mathbf m_i|^2 + h^2\\right)^{3/2}}",
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "Magnet strength k (0.05 to 1.5, default 0.4) scales the pull of all three magnets. Damping γ (0.01 to 0.6, default 0.18) is the friction: low values let the bob fly past magnets many times before it settles, high values make it stop almost where it was aimed. Restoring ω² (0.05 to 2, default 0.5) is the stiffness of the pull back to the centre. Pendulum height h (0.05 to 0.6, default 0.18) sets how close the bob passes over the magnets; small h means sharp, strong pulls right above a magnet, large h smears the field out.",
          "View span (0.8 to 4, default 2.0) chooses the square of starting points, from −span to +span in both directions, so lowering it zooms in on the centre. Resolution (60 to 360 pixels per side, default 180) sets how many starting points are simulated. With shading on, each pixel is darkened by how long capture took: bright means caught quickly, dark means a long chaotic flight. Recompute runs the whole map again; any slider change does that automatically.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "Each pixel starts the bob at rest at the centre of that pixel's cell and integrates the equation with the semi-implicit Euler method at a fixed step of dt = 0.02: velocity is updated from the acceleration first, then position from the new velocity. That ordering is barely more expensive than plain Euler but keeps oscillations from gaining energy out of nothing, which is good enough here because the only result that matters is which magnet wins.",
          "Every eighth step the code checks whether the bob is within distance √0.06 ≈ 0.245 of a magnet and slower than √0.005 ≈ 0.07. If so, that magnet is the winner and the step count becomes the capture time. If 3000 steps pass without capture, or the numbers blow up, the nearest magnet is taken instead and the pixel gets the darkest shade.",
          "At the default resolution that is 32,400 trajectories of up to 3000 steps each, so the map is computed in slices of six rows per animation frame. The progress badge counts up while the image fills from top to bottom, and the browser stays responsive. Pixels go into an ImageData buffer at the chosen resolution, which is then scaled up without smoothing into the largest centred square of the canvas, so the triangle is never stretched. There is no ongoing animation: once the badge reads ready, the picture stays still.",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "Why the boundaries look fractal",
        paragraphs: [
          "Near the border between two colours, a trajectory passes close to a magnet without being caught, gets flung toward another one, and repeats. Each near miss stretches small differences in the starting point, so the closer you look at a boundary, the more thin bands of all three colours appear between the two. That is sensitive dependence on initial conditions, but here it is drawn as a map instead of a single wobbling curve. Note what the map is not: it does not mean the outcome is random. Each pixel is completely deterministic and gives the same answer every time; the trouble is that a slightly different pixel can give a different one.",
        ],
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "Calm it down",
        text: "Raise damping γ to 0.5. The bob loses its energy before it can visit more than one magnet, and the map turns into three large, almost clean wedges with simple borders. Then drop γ to 0.05 and watch the wedges dissolve into bands.",
      },
      {
        title: "Zoom into the centre",
        text: "Set the span to 0.8 and the resolution to 300. Around the centre, between the three magnets, the bands of colour wind into each other much more finely than the default view suggests.",
      },
      {
        title: "Lower the bob",
        text: "Reduce h from 0.18 to 0.08. The pull directly above each magnet becomes much stronger and sharper, near misses fling the bob harder, and the interleaved regions grow. Raising h to 0.5 softens everything again.",
      },
      {
        title: "Magnets too weak to hold",
        text: "Set k to 0.05 and ω² to 2. The spring now beats the magnets, so the bob tends to come to rest near the centre where no magnet can claim it. Capture never registers, the code falls back to the nearest magnet after 3000 steps, and with shading on the map turns dark.",
      },
    ],
  },
  de: {
    metaDescription:
      "Bassin-Karte des magnetischen Pendels: Jedes Pixel ist eine eigene Simulation über drei Magneten. Stärke, Dämpfung und Höhe ändern und fraktale Ränder sehen.",
    heading: "So funktioniert dieser Explorer",
    intro:
      "Stell dir ein Pendel vor, das über einer Platte mit drei Magneten im Dreieck hängt. Du ziehst es an eine Stelle, lässt los, und nach einer Weile kommt es über einem der Magneten zur Ruhe. Die Karte färbt jeden Startpunkt nach dem Magneten, der das Pendel am Ende einfängt: Rosa, Cyan oder Grün. Große ruhige Flächen bedeuten vorhersagbares Verhalten. Wo sich die Farben zu dünnen, ineinander verflochtenen Bändern verweben, entscheidet ein winziger Unterschied beim Loslassen über das Ergebnis. Jedes Pixel ist eine eigene, vollständige Simulation.",
    sections: [
      {
        heading: "Das Modell",
        paragraphs: [
          "Der Explorer drückt das Pendel in die Ebene: p = (x, y) ist die Position des Pendelkörpers von oben gesehen. Drei Kräfte wirken auf ihn. Luftwiderstand γ·ṗ bremst ihn, ein Federterm ω²·p zieht ihn zur Mitte zurück (das übernimmt bei einem echten Pendel mit kleiner Auslenkung die Schwerkraft), und jeder Magnet zieht ihn mit einer Kraft zu sich, die mit dem Abstand abnimmt.",
          "Das Pendel berührt die Platte nicht. Es schwingt in der Höhe h darüber, deshalb ist der Abstand zu einem Magneten √(d² + h²) statt d. So bleibt die Kraft direkt über einem Magneten endlich, und das Modell verhält sich vernünftig. Die Magneten sitzen an den Ecken eines gleichseitigen Dreiecks mit Radius 1 um die Mitte, bei (0, −1) und (±0,866, 0,5).",
        ],
        formula:
          "\\ddot{\\mathbf p} = -\\gamma\\,\\dot{\\mathbf p} - \\omega^2 \\mathbf p - \\sum_{i=1}^{3} \\frac{k\\,(\\mathbf p - \\mathbf m_i)}{\\left(|\\mathbf p - \\mathbf m_i|^2 + h^2\\right)^{3/2}}",
      },
      {
        heading: "Was die Regler bewirken",
        paragraphs: [
          "Die Magnetstärke k (0,05 bis 1,5, Standard 0,4) skaliert den Zug aller drei Magneten. Die Dämpfung γ (0,01 bis 0,6, Standard 0,18) ist die Reibung: Bei kleinen Werten fliegt das Pendel viele Male an den Magneten vorbei, bevor es zur Ruhe kommt, bei großen bleibt es fast dort stehen, wohin es gezielt war. Die Rückstellung ω² (0,05 bis 2, Standard 0,5) ist die Steifigkeit des Zugs zur Mitte. Die Pendelhöhe h (0,05 bis 0,6, Standard 0,18) legt fest, wie dicht das Pendel über die Magneten streicht; kleines h bedeutet scharfe, starke Kräfte direkt über einem Magneten, großes h verschmiert das Feld.",
          "Der Ausschnitt (0,8 bis 4, Standard 2,0) wählt das Quadrat der Startpunkte, von −span bis +span in beide Richtungen; kleinere Werte zoomen also auf die Mitte. Die Auflösung (60 bis 360 Pixel pro Seite, Standard 180) bestimmt, wie viele Startpunkte simuliert werden. Mit eingeschalteter Schattierung wird jedes Pixel nach der Einfangzeit abgedunkelt: hell heißt schnell gefangen, dunkel heißt langer, chaotischer Flug. «Neu berechnen» rechnet die ganze Karte noch einmal; jede Regleränderung tut das ohnehin automatisch.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Jedes Pixel startet das Pendel in Ruhe in der Mitte seiner Zelle und integriert die Gleichung mit dem semi-impliziten Euler-Verfahren bei festem Schritt dt = 0,02: Zuerst wird die Geschwindigkeit aus der Beschleunigung aktualisiert, dann die Position aus der neuen Geschwindigkeit. Diese Reihenfolge kostet kaum mehr als das einfache Euler-Verfahren, verhindert aber, dass Schwingungen aus dem Nichts Energie gewinnen. Das reicht hier, denn am Ende zählt nur, welcher Magnet gewinnt.",
          "Bei jedem achten Schritt prüft der Code, ob das Pendel näher als √0,06 ≈ 0,245 an einem Magneten und langsamer als √0,005 ≈ 0,07 ist. Dann ist dieser Magnet der Gewinner, und die Schrittzahl wird zur Einfangzeit. Vergehen 3000 Schritte ohne Einfang oder laufen die Zahlen aus dem Ruder, nimmt der Code den nächstgelegenen Magneten, und das Pixel bekommt die dunkelste Schattierung.",
          "Bei der Standardauflösung sind das 32.400 Bahnen mit je bis zu 3000 Schritten. Deshalb wird die Karte in Scheiben von sechs Zeilen pro Animationsframe berechnet. Die Fortschrittsanzeige zählt hoch, während sich das Bild von oben nach unten füllt, und der Browser bleibt bedienbar. Die Pixel landen in einem ImageData-Puffer in der gewählten Auflösung, der dann ohne Glättung in das größte zentrierte Quadrat des Canvas hochskaliert wird, damit das Dreieck nie verzerrt ist. Eine laufende Animation gibt es nicht: Sobald die Anzeige «bereit» meldet, steht das Bild still.",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "Warum die Ränder fraktal aussehen",
        paragraphs: [
          "Nahe der Grenze zwischen zwei Farben zieht eine Bahn dicht an einem Magneten vorbei, ohne gefangen zu werden, wird zu einem anderen geschleudert, und das wiederholt sich. Jeder Beinahe-Treffer vergrößert kleine Unterschiede im Startpunkt. Je genauer du auf eine Grenze schaust, desto mehr dünne Bänder aller drei Farben tauchen zwischen den beiden auf. Das ist die empfindliche Abhängigkeit von den Anfangsbedingungen, hier als Karte gezeichnet statt als einzelne zappelnde Kurve. Zufall ist es trotzdem nicht: Jedes Pixel ist vollständig deterministisch und liefert jedes Mal dieselbe Antwort. Das Problem ist nur, dass ein minimal anderes Pixel eine andere liefern kann.",
        ],
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Beruhige das Pendel",
        text: "Erhöhe die Dämpfung γ auf 0,5. Das Pendel verliert seine Energie, bevor es mehr als einen Magneten besuchen kann, und die Karte zerfällt in drei große, fast saubere Keile mit einfachen Grenzen. Senke γ dann auf 0,05 und sieh zu, wie sich die Keile in Bänder auflösen.",
      },
      {
        title: "In die Mitte zoomen",
        text: "Stell den Ausschnitt auf 0,8 und die Auflösung auf 300. Um die Mitte herum, zwischen den drei Magneten, winden sich die Farbbänder viel feiner ineinander, als die Standardansicht vermuten lässt.",
      },
      {
        title: "Das Pendel absenken",
        text: "Verringere h von 0,18 auf 0,08. Der Zug direkt über jedem Magneten wird viel stärker und schärfer, Beinahe-Treffer schleudern das Pendel heftiger, und die verflochtenen Bereiche wachsen. Hebst du h auf 0,5, wird alles wieder weicher.",
      },
      {
        title: "Zu schwache Magneten",
        text: "Stell k auf 0,05 und ω² auf 2. Jetzt ist die Feder stärker als die Magneten, und das Pendel kommt eher in der Mitte zur Ruhe, wo kein Magnet es beanspruchen kann. Ein Einfang wird nie registriert, nach 3000 Schritten greift der Code auf den nächstgelegenen Magneten zurück, und mit Schattierung wird die Karte dunkel.",
      },
    ],
  },
  es: {
    metaDescription:
      "Mapa de cuencas del péndulo magnético: cada píxel simula un péndulo sobre tres imanes. Ajusta fuerza, amortiguación y altura y mira los bordes fractales.",
    heading: "Cómo funciona este explorador",
    intro:
      "Imagina la bola de un péndulo colgada sobre una placa con tres imanes dispuestos en triángulo. La llevas hasta un punto, la sueltas y al cabo de un rato se detiene sobre uno de los imanes. El mapa colorea cada punto de partida según el imán que acaba atrapándola: rosa, cian o verde. Las grandes manchas tranquilas indican un comportamiento predecible. Donde los colores se trenzan en bandas finas y entrelazadas, un cambio minúsculo en el punto donde sueltas la bola decide el resultado. Cada píxel es una simulación completa por sí misma.",
    sections: [
      {
        heading: "El modelo",
        paragraphs: [
          "El explorador aplana el péndulo sobre el plano: p = (x, y) es la posición de la bola vista desde arriba. Sobre ella actúan tres fuerzas. La resistencia del aire γ·ṗ la frena, un término de muelle ω²·p tira de ella hacia el centro (eso es lo que hace la gravedad en un péndulo real con amplitudes pequeñas) y cada imán la atrae con una fuerza que disminuye con la distancia.",
          "La bola no toca la placa. Oscila a una altura h por encima de ella, de modo que la distancia a un imán es √(d² + h²) en lugar de d. Así la fuerza se mantiene finita justo encima de un imán, y eso es lo que hace que el modelo se comporte de forma razonable. Los imanes están en los vértices de un triángulo equilátero de radio 1 alrededor del centro, en (0; −1) y (±0,866; 0,5).",
        ],
        formula:
          "\\ddot{\\mathbf p} = -\\gamma\\,\\dot{\\mathbf p} - \\omega^2 \\mathbf p - \\sum_{i=1}^{3} \\frac{k\\,(\\mathbf p - \\mathbf m_i)}{\\left(|\\mathbf p - \\mathbf m_i|^2 + h^2\\right)^{3/2}}",
      },
      {
        heading: "Qué hacen los controles",
        paragraphs: [
          "«Fuerza del imán k» (de 0,05 a 1,5; por defecto 0,4) escala la atracción de los tres imanes. «Amortiguación γ» (de 0,01 a 0,6; por defecto 0,18) es el rozamiento: con valores bajos la bola pasa de largo junto a los imanes muchas veces antes de detenerse, con valores altos se para casi donde apuntaba. «Restauración ω²» (de 0,05 a 2; por defecto 0,5) es la rigidez de la fuerza que la devuelve al centro. «Altura del péndulo h» (de 0,05 a 0,6; por defecto 0,18) fija a qué distancia pasa la bola sobre los imanes; un h pequeño significa tirones fuertes y bruscos justo encima de un imán, un h grande difumina el campo.",
          "«Ventana ±» (de 0,8 a 4; por defecto 2,0) elige el cuadrado de puntos de partida, de −span a +span en ambas direcciones, así que al reducirla haces zoom sobre el centro. «Resolución» (de 60 a 360 píxeles por lado; por defecto 180) determina cuántos puntos de partida se simulan. Con «Sombrear por tiempo de captura» activado, cada píxel se oscurece según lo que tardó la captura: claro significa atrapada enseguida, oscuro significa un vuelo largo y caótico. «Recalcular» vuelve a calcular todo el mapa; cualquier cambio en un control lo hace automáticamente.",
        ],
      },
      {
        heading: "Cómo está construido",
        paragraphs: [
          "Cada píxel suelta la bola en reposo desde el centro de su celda e integra la ecuación con el método de Euler semiimplícito y un paso fijo de dt = 0,02: primero se actualiza la velocidad a partir de la aceleración y después la posición a partir de la nueva velocidad. Ese orden apenas cuesta más que el Euler simple, pero evita que las oscilaciones ganen energía de la nada, y aquí basta con eso porque el único resultado que importa es qué imán gana.",
          "Cada ocho pasos el código comprueba si la bola está a una distancia menor que √0,06 ≈ 0,245 de un imán y se mueve más despacio que √0,005 ≈ 0,07. Si es así, ese imán es el ganador y el número de pasos pasa a ser el tiempo de captura. Si transcurren 3000 pasos sin captura, o los números se disparan, se toma el imán más cercano y el píxel recibe el tono más oscuro.",
          "Con la resolución por defecto son 32 400 trayectorias de hasta 3000 pasos cada una, así que el mapa se calcula en franjas de seis filas por fotograma de animación. El indicador de progreso va subiendo mientras la imagen se llena de arriba abajo, y el navegador sigue respondiendo. Los píxeles van a un búfer ImageData con la resolución elegida, que luego se amplía sin suavizado hasta el mayor cuadrado centrado del canvas, de modo que el triángulo nunca se deforma. No hay ninguna animación continua: en cuanto el indicador dice «listo», la imagen se queda quieta.",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "Por qué los bordes parecen fractales",
        paragraphs: [
          "Cerca de la frontera entre dos colores, una trayectoria pasa junto a un imán sin quedar atrapada, sale lanzada hacia otro y la historia se repite. Cada uno de esos casi aciertos estira las pequeñas diferencias en el punto de partida, así que cuanto más de cerca miras una frontera, más bandas finas de los tres colores aparecen entre los dos. Eso es la dependencia sensible de las condiciones iniciales, pero aquí dibujada como un mapa en lugar de como una sola curva temblorosa. Fíjate en lo que el mapa no dice: no significa que el resultado sea aleatorio. Cada píxel es completamente determinista y da la misma respuesta todas las veces; el problema es que un píxel ligeramente distinto puede dar otra.",
        ],
      },
    ],
    experimentsHeading: "Prueba esto",
    experiments: [
      {
        title: "Cálmalo",
        text: "Sube la amortiguación γ a 0,5. La bola pierde su energía antes de poder visitar más de un imán, y el mapa se convierte en tres grandes cuñas casi limpias con fronteras sencillas. Después baja γ a 0,05 y observa cómo las cuñas se deshacen en bandas.",
      },
      {
        title: "Haz zoom en el centro",
        text: "Pon la ventana en 0,8 y la resolución en 300. Alrededor del centro, entre los tres imanes, las bandas de color se enroscan unas en otras con mucha más finura de lo que sugiere la vista por defecto.",
      },
      {
        title: "Baja la bola",
        text: "Reduce h de 0,18 a 0,08. La atracción justo encima de cada imán se vuelve mucho más fuerte y brusca, los casi aciertos lanzan la bola con más violencia y las regiones entrelazadas crecen. Subir h a 0,5 lo suaviza todo de nuevo.",
      },
      {
        title: "Imanes demasiado débiles para retener",
        text: "Pon k en 0,05 y ω² en 2. Ahora el muelle vence a los imanes, así que la bola tiende a detenerse cerca del centro, donde ningún imán puede reclamarla. La captura no llega a registrarse, el código recurre al imán más cercano tras 3000 pasos y, con el sombreado activado, el mapa se oscurece.",
      },
    ],
  },
  fr: {
    metaDescription:
      "Carte de bassins du pendule magnétique : chaque pixel simule un pendule au-dessus de trois aimants. Règle force, amortissement et hauteur, vois les fractales.",
    heading: "Comment fonctionne cet explorateur",
    intro:
      "Imagine la masse d'un pendule suspendue au-dessus d'une plaque portant trois aimants disposés en triangle. Tu l'écartes jusqu'à un point, tu la lâches, et au bout d'un moment elle s'immobilise au-dessus de l'un des aimants. La carte colore chaque point de départ selon l'aimant qui finit par la capturer : rose, cyan ou vert. Les grandes plages calmes signalent un comportement prévisible. Là où les couleurs se tressent en fines bandes entrelacées, un changement infime du point de lâcher décide de l'issue. Chaque pixel est à lui seul une simulation complète.",
    sections: [
      {
        heading: "Le modèle",
        paragraphs: [
          "L'explorateur aplatit le pendule dans le plan : p = (x, y) est la position de la masse vue de dessus. Trois forces agissent sur elle. La résistance de l'air γ·ṗ la freine, un terme de ressort ω²·p la ramène vers le centre (c'est le rôle de la gravité pour un vrai pendule aux petites amplitudes), et chaque aimant l'attire avec une force qui décroît avec la distance.",
          "La masse ne touche pas la plaque. Elle oscille à une hauteur h au-dessus d'elle, si bien que la distance à un aimant vaut √(d² + h²) et non d. La force reste ainsi finie juste au-dessus d'un aimant, et c'est ce qui rend le comportement du modèle raisonnable. Les aimants occupent les sommets d'un triangle équilatéral de rayon 1 autour du centre, en (0 ; −1) et (±0,866 ; 0,5).",
        ],
        formula:
          "\\ddot{\\mathbf p} = -\\gamma\\,\\dot{\\mathbf p} - \\omega^2 \\mathbf p - \\sum_{i=1}^{3} \\frac{k\\,(\\mathbf p - \\mathbf m_i)}{\\left(|\\mathbf p - \\mathbf m_i|^2 + h^2\\right)^{3/2}}",
      },
      {
        heading: "À quoi servent les réglages",
        paragraphs: [
          "« Force d'aimant k » (de 0,05 à 1,5 ; 0,4 par défaut) met à l'échelle l'attraction des trois aimants. « Amortissement γ » (de 0,01 à 0,6 ; 0,18 par défaut) est le frottement : avec de faibles valeurs, la masse passe de nombreuses fois à côté des aimants avant de s'arrêter, avec de fortes valeurs elle s'immobilise presque là où elle était lancée. « Rappel ω² » (de 0,05 à 2 ; 0,5 par défaut) est la raideur de la force qui la ramène au centre. « Hauteur du pendule h » (de 0,05 à 0,6 ; 0,18 par défaut) fixe à quelle distance la masse passe au-dessus des aimants ; un petit h donne des attractions fortes et brusques juste au-dessus d'un aimant, un grand h étale le champ.",
          "« Fenêtre ± » (de 0,8 à 4 ; 2,0 par défaut) choisit le carré des points de départ, de −span à +span dans les deux directions, si bien qu'en la réduisant tu zoomes sur le centre. « Résolution » (de 60 à 360 pixels par côté ; 180 par défaut) fixe le nombre de points de départ simulés. Quand « Ombrer par temps de capture » est activé, chaque pixel est assombri selon la durée de la capture : clair veut dire capturée rapidement, sombre veut dire un long vol chaotique. « Recalculer » relance le calcul de toute la carte ; toute modification d'un curseur le fait automatiquement.",
        ],
      },
      {
        heading: "Comment c'est construit",
        paragraphs: [
          "Chaque pixel lâche la masse au repos au centre de sa cellule et intègre l'équation par la méthode d'Euler semi-implicite avec un pas fixe dt = 0,02 : la vitesse est d'abord mise à jour à partir de l'accélération, puis la position à partir de la nouvelle vitesse. Cet ordre coûte à peine plus cher que l'Euler simple, mais empêche les oscillations de gagner de l'énergie à partir de rien, ce qui suffit ici, car le seul résultat qui compte est de savoir quel aimant l'emporte.",
          "Tous les huit pas, le code vérifie si la masse se trouve à une distance inférieure à √0,06 ≈ 0,245 d'un aimant et se déplace moins vite que √0,005 ≈ 0,07. Si c'est le cas, cet aimant est le vainqueur et le nombre de pas devient le temps de capture. Si 3000 pas s'écoulent sans capture, ou si les nombres explosent, c'est l'aimant le plus proche qui est retenu et le pixel reçoit la teinte la plus sombre.",
          "À la résolution par défaut, cela fait 32 400 trajectoires de 3000 pas au maximum chacune, et la carte est donc calculée par tranches de six lignes par image d'animation. L'indicateur de progression grimpe pendant que l'image se remplit de haut en bas, et le navigateur reste réactif. Les pixels sont écrits dans un tampon ImageData à la résolution choisie, qui est ensuite agrandi sans lissage dans le plus grand carré centré du canvas, de sorte que le triangle n'est jamais déformé. Il n'y a aucune animation permanente : dès que l'indicateur affiche « prêt », l'image ne bouge plus.",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "Pourquoi les frontières ont l'air fractales",
        paragraphs: [
          "Près de la frontière entre deux couleurs, une trajectoire frôle un aimant sans être capturée, se fait projeter vers un autre, et le scénario se répète. Chaque passage manqué de peu étire les petites différences du point de départ, si bien que plus tu regardes une frontière de près, plus de fines bandes des trois couleurs apparaissent entre les deux. C'est la sensibilité aux conditions initiales, mais dessinée ici sous forme de carte plutôt que comme une seule courbe tremblante. Remarque ce que la carte ne dit pas : elle ne signifie pas que le résultat est aléatoire. Chaque pixel est entièrement déterministe et donne la même réponse à chaque fois ; le problème est qu'un pixel légèrement différent peut en donner une autre.",
        ],
      },
    ],
    experimentsHeading: "À essayer",
    experiments: [
      {
        title: "Calme le jeu",
        text: "Monte l'amortissement γ à 0,5. La masse perd son énergie avant de pouvoir visiter plus d'un aimant, et la carte se transforme en trois grands secteurs presque nets aux frontières simples. Baisse ensuite γ à 0,05 et regarde les secteurs se dissoudre en bandes.",
      },
      {
        title: "Zoome sur le centre",
        text: "Règle la fenêtre sur 0,8 et la résolution sur 300. Autour du centre, entre les trois aimants, les bandes de couleur s'enroulent les unes dans les autres bien plus finement que la vue par défaut ne le laisse deviner.",
      },
      {
        title: "Abaisse la masse",
        text: "Réduis h de 0,18 à 0,08. L'attraction juste au-dessus de chaque aimant devient bien plus forte et plus brusque, les passages manqués de peu projettent la masse plus violemment, et les régions entrelacées s'étendent. En remontant h à 0,5, tout s'adoucit de nouveau.",
      },
      {
        title: "Des aimants trop faibles pour retenir",
        text: "Règle k sur 0,05 et ω² sur 2. Le ressort l'emporte désormais sur les aimants, et la masse a tendance à s'immobiliser près du centre, là où aucun aimant ne peut la revendiquer. La capture n'est jamais enregistrée, le code se rabat sur l'aimant le plus proche au bout de 3000 pas et, avec l'ombrage activé, la carte devient sombre.",
      },
    ],
  },
  it: {
    metaDescription:
      "Mappa di bacini del pendolo magnetico: ogni pixel simula un pendolo sopra tre magneti. Regola forza, smorzamento e altezza e osserva i confini frattali.",
    heading: "Come funziona questo esploratore",
    intro:
      "Immagina il peso di un pendolo appeso sopra una piastra con tre magneti disposti a triangolo. Lo sposti in un punto, lo lasci andare e dopo un po' si ferma sopra uno dei magneti. La mappa colora ogni punto di partenza in base al magnete che alla fine lo cattura: rosa, ciano o verde. Le grandi zone tranquille indicano un comportamento prevedibile. Dove i colori si intrecciano in bande sottili e alternate, una differenza minuscola nel punto di rilascio decide l'esito. Ogni pixel è una simulazione completa a sé.",
    sections: [
      {
        heading: "Il modello",
        paragraphs: [
          "L'esploratore schiaccia il pendolo sul piano: p = (x, y) è la posizione del peso vista dall'alto. Su di esso agiscono tre forze. La resistenza dell'aria γ·ṗ lo rallenta, un termine elastico ω²·p lo richiama verso il centro (è ciò che fa la gravità in un pendolo reale a piccole ampiezze) e ogni magnete lo attira con una forza che diminuisce con la distanza.",
          "Il peso non tocca la piastra. Oscilla a un'altezza h sopra di essa, quindi la distanza da un magnete è √(d² + h²) anziché d. In questo modo la forza resta finita proprio sopra un magnete, ed è questo che fa comportare il modello in modo sensato. I magneti si trovano ai vertici di un triangolo equilatero di raggio 1 intorno al centro, in (0; −1) e (±0,866; 0,5).",
        ],
        formula:
          "\\ddot{\\mathbf p} = -\\gamma\\,\\dot{\\mathbf p} - \\omega^2 \\mathbf p - \\sum_{i=1}^{3} \\frac{k\\,(\\mathbf p - \\mathbf m_i)}{\\left(|\\mathbf p - \\mathbf m_i|^2 + h^2\\right)^{3/2}}",
      },
      {
        heading: "Che cosa fanno i controlli",
        paragraphs: [
          "«Forza magnete k» (da 0,05 a 1,5; predefinito 0,4) scala l'attrazione di tutti e tre i magneti. «Smorzamento γ» (da 0,01 a 0,6; predefinito 0,18) è l'attrito: con valori bassi il peso sfreccia accanto ai magneti molte volte prima di fermarsi, con valori alti si arresta quasi dove era diretto. «Richiamo ω²» (da 0,05 a 2; predefinito 0,5) è la rigidità della forza che lo riporta al centro. «Altezza del pendolo h» (da 0,05 a 0,6; predefinito 0,18) stabilisce quanto vicino il peso passa sopra i magneti; un h piccolo significa attrazioni forti e brusche proprio sopra un magnete, un h grande sfuma il campo.",
          "«Finestra ±» (da 0,8 a 4; predefinito 2,0) sceglie il quadrato dei punti di partenza, da −span a +span in entrambe le direzioni, perciò riducendola ingrandisci il centro. «Risoluzione» (da 60 a 360 pixel per lato; predefinito 180) stabilisce quanti punti di partenza vengono simulati. Con «Ombreggia per tempo di cattura» attivo, ogni pixel viene scurito in base alla durata della cattura: chiaro significa catturato in fretta, scuro significa un lungo volo caotico. «Ricalcola» esegue di nuovo l'intera mappa; qualsiasi modifica a un cursore lo fa in automatico.",
        ],
      },
      {
        heading: "Come è costruito",
        paragraphs: [
          "Ogni pixel fa partire il peso da fermo dal centro della propria cella e integra l'equazione con il metodo di Eulero semi-implicito a passo fisso dt = 0,02: prima si aggiorna la velocità a partire dall'accelerazione, poi la posizione a partire dalla nuova velocità. Quest'ordine costa appena più dell'Eulero semplice, ma impedisce alle oscillazioni di guadagnare energia dal nulla, e qui tanto basta, perché l'unico risultato che conta è quale magnete vince.",
          "Ogni otto passi il codice controlla se il peso si trova a una distanza inferiore a √0,06 ≈ 0,245 da un magnete e si muove più lentamente di √0,005 ≈ 0,07. In tal caso quel magnete è il vincitore e il numero di passi diventa il tempo di cattura. Se trascorrono 3000 passi senza cattura, o se i numeri esplodono, si prende il magnete più vicino e il pixel riceve la tonalità più scura.",
          "Alla risoluzione predefinita sono 32 400 traiettorie da 3000 passi al massimo ciascuna, quindi la mappa viene calcolata a fette di sei righe per fotogramma di animazione. L'indicatore di avanzamento sale mentre l'immagine si riempie dall'alto verso il basso, e il browser resta reattivo. I pixel finiscono in un buffer ImageData alla risoluzione scelta, che viene poi ingrandito senza interpolazione nel più grande quadrato centrato del canvas, così il triangolo non risulta mai deformato. Non c'è alcuna animazione continua: appena l'indicatore segna «pronto», l'immagine resta ferma.",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "Perché i confini sembrano frattali",
        paragraphs: [
          "Vicino al confine tra due colori, una traiettoria sfiora un magnete senza farsi catturare, viene scagliata verso un altro e la storia si ripete. Ogni cattura mancata per un soffio amplifica le piccole differenze nel punto di partenza, perciò più da vicino guardi un confine, più bande sottili di tutti e tre i colori compaiono tra i due. È la dipendenza sensibile dalle condizioni iniziali, ma qui disegnata come una mappa anziché come una singola curva tremolante. Nota che cosa la mappa non dice: non significa che l'esito sia casuale. Ogni pixel è del tutto deterministico e dà ogni volta la stessa risposta; il guaio è che un pixel appena diverso può darne un'altra.",
        ],
      },
    ],
    experimentsHeading: "Prova così",
    experiments: [
      {
        title: "Calma le acque",
        text: "Alza lo smorzamento γ a 0,5. Il peso perde la sua energia prima di poter visitare più di un magnete, e la mappa si trasforma in tre grandi spicchi quasi puliti con confini semplici. Poi abbassa γ a 0,05 e guarda gli spicchi dissolversi in bande.",
      },
      {
        title: "Ingrandisci il centro",
        text: "Imposta la finestra su 0,8 e la risoluzione su 300. Intorno al centro, fra i tre magneti, le bande di colore si avvolgono l'una nell'altra in modo molto più fine di quanto lasci intuire la vista predefinita.",
      },
      {
        title: "Abbassa il peso",
        text: "Riduci h da 0,18 a 0,08. L'attrazione proprio sopra ogni magnete diventa molto più forte e brusca, le catture mancate scagliano il peso con più violenza e le regioni intrecciate crescono. Alzando h a 0,5 tutto si ammorbidisce di nuovo.",
      },
      {
        title: "Magneti troppo deboli per trattenere",
        text: "Imposta k su 0,05 e ω² su 2. Ora la molla batte i magneti, quindi il peso tende a fermarsi vicino al centro, dove nessun magnete può reclamarlo. La cattura non viene mai registrata, dopo 3000 passi il codice ripiega sul magnete più vicino e, con l'ombreggiatura attiva, la mappa diventa scura.",
      },
    ],
  },
  pt: {
    metaDescription:
      "Mapa de bacias do pêndulo magnético: cada píxel simula um pêndulo sobre três ímanes. Ajusta força, amortecimento e altura e vê as fronteiras fractais.",
    heading: "Como funciona este explorador",
    intro:
      "Imagina o peso de um pêndulo suspenso sobre uma placa com três ímanes dispostos em triângulo. Puxas o peso até um ponto, largas, e passado algum tempo ele fica em repouso sobre um dos ímanes. O mapa pinta cada ponto de partida com a cor do íman que acaba por o capturar: rosa, ciano ou verde. As grandes manchas calmas indicam comportamento previsível. Onde as cores se entrançam em faixas finas e intercaladas, uma alteração minúscula no ponto onde largas o peso decide o resultado. Cada píxel é, por si só, uma simulação completa.",
    sections: [
      {
        heading: "O modelo",
        paragraphs: [
          "O explorador achata o pêndulo no plano: p = (x, y) é a posição do peso visto de cima. Atuam sobre ele três forças. A resistência do ar γ·ṗ trava o movimento, um termo de mola ω²·p puxa o peso de volta para o centro (é o que a gravidade faz num pêndulo real com pequenas amplitudes) e cada íman atrai o peso com uma força que diminui com a distância.",
          "O peso não toca na placa. Oscila a uma altura h acima dela, pelo que a distância a um íman é √(d² + h²) em vez de d. Assim a força mantém-se finita mesmo por cima de um íman, e é isso que faz o modelo comportar-se de forma sensata. Os ímanes estão nos vértices de um triângulo equilátero de raio 1 em torno do centro, em (0; −1) e (±0,866; 0,5).",
        ],
        formula:
          "\\ddot{\\mathbf p} = -\\gamma\\,\\dot{\\mathbf p} - \\omega^2 \\mathbf p - \\sum_{i=1}^{3} \\frac{k\\,(\\mathbf p - \\mathbf m_i)}{\\left(|\\mathbf p - \\mathbf m_i|^2 + h^2\\right)^{3/2}}",
      },
      {
        heading: "O que fazem os controlos",
        paragraphs: [
          "«Força do íman k» (de 0,05 a 1,5; predefinição 0,4) escala a atração dos três ímanes. «Amortecimento γ» (de 0,01 a 0,6; predefinição 0,18) é o atrito: com valores baixos o peso passa muitas vezes ao lado dos ímanes antes de assentar, com valores altos para quase onde estava apontado. «Restauração ω²» (de 0,05 a 2; predefinição 0,5) é a rigidez da força que o puxa de volta ao centro. «Altura do pêndulo h» (de 0,05 a 0,6; predefinição 0,18) define a que distância o peso passa por cima dos ímanes; um h pequeno significa puxões fortes e bruscos mesmo por cima de um íman, um h grande esbate o campo.",
          "«Janela ±» (de 0,8 a 4; predefinição 2,0) escolhe o quadrado de pontos de partida, de −span a +span nas duas direções, pelo que ao reduzi-la aproximas o centro. «Resolução» (de 60 a 360 píxeis por lado; predefinição 180) define quantos pontos de partida são simulados. Com «Sombrear por tempo de captura» ligado, cada píxel é escurecido conforme o tempo que a captura demorou: claro significa capturado depressa, escuro significa um voo longo e caótico. «Recalcular» volta a calcular o mapa inteiro; qualquer alteração num controlo faz isso automaticamente.",
        ],
      },
      {
        heading: "Como está construído",
        paragraphs: [
          "Cada píxel larga o peso em repouso no centro da sua célula e integra a equação com o método de Euler semi-implícito, com um passo fixo de dt = 0,02: primeiro atualiza-se a velocidade a partir da aceleração, depois a posição a partir da nova velocidade. Esta ordem custa pouco mais do que o Euler simples, mas impede que as oscilações ganhem energia do nada, o que aqui é suficiente, porque o único resultado que interessa é qual dos ímanes ganha.",
          "De oito em oito passos, o código verifica se o peso está a uma distância inferior a √0,06 ≈ 0,245 de um íman e se move mais devagar do que √0,005 ≈ 0,07. Se assim for, esse íman é o vencedor e o número de passos passa a ser o tempo de captura. Se passarem 3000 passos sem captura, ou se os números dispararem, toma-se o íman mais próximo e o píxel recebe o tom mais escuro.",
          "Na resolução predefinida são 32 400 trajetórias com um máximo de 3000 passos cada, pelo que o mapa é calculado em fatias de seis linhas por fotograma de animação. O indicador de progresso vai subindo enquanto a imagem se preenche de cima para baixo, e o navegador continua a responder. Os píxeis vão para um buffer ImageData na resolução escolhida, que é depois ampliado sem suavização para o maior quadrado centrado do canvas, de modo que o triângulo nunca fica deformado. Não há nenhuma animação contínua: assim que o indicador mostra «pronto», a imagem fica parada.",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "Porque é que as fronteiras parecem fractais",
        paragraphs: [
          "Perto da fronteira entre duas cores, uma trajetória passa rente a um íman sem ser capturada, é atirada na direção de outro, e a história repete-se. Cada uma destas quase capturas estica as pequenas diferenças no ponto de partida, pelo que quanto mais de perto olhas para uma fronteira, mais faixas finas das três cores aparecem entre as duas. É a dependência sensível das condições iniciais, mas aqui desenhada como um mapa em vez de uma única curva a tremer. Repara no que o mapa não diz: não significa que o resultado seja aleatório. Cada píxel é completamente determinista e dá sempre a mesma resposta; o problema é que um píxel ligeiramente diferente pode dar outra.",
        ],
      },
    ],
    experimentsHeading: "Experimenta",
    experiments: [
      {
        title: "Acalma o pêndulo",
        text: "Sobe o amortecimento γ para 0,5. O peso perde a energia antes de conseguir visitar mais do que um íman, e o mapa transforma-se em três grandes cunhas quase limpas com fronteiras simples. Depois baixa γ para 0,05 e vê as cunhas desfazerem-se em faixas.",
      },
      {
        title: "Aproxima o centro",
        text: "Põe a janela em 0,8 e a resolução em 300. À volta do centro, entre os três ímanes, as faixas de cor enrolam-se umas nas outras de forma muito mais fina do que a vista predefinida deixa adivinhar.",
      },
      {
        title: "Baixa o peso",
        text: "Reduz h de 0,18 para 0,08. A atração mesmo por cima de cada íman torna-se muito mais forte e brusca, as quase capturas atiram o peso com mais violência e as regiões entrelaçadas crescem. Subir h para 0,5 volta a suavizar tudo.",
      },
      {
        title: "Ímanes demasiado fracos para segurar",
        text: "Põe k em 0,05 e ω² em 2. Agora a mola vence os ímanes, e o peso tende a ficar em repouso perto do centro, onde nenhum íman o consegue reclamar. A captura nunca chega a ser registada, o código recorre ao íman mais próximo ao fim de 3000 passos e, com o sombreado ligado, o mapa fica escuro.",
      },
    ],
  },
  sv: {
    metaDescription:
      "Bassängkarta för den magnetiska pendeln: varje pixel är en egen simulering över tre magneter. Ändra styrka, dämpning och höjd och se fraktala gränser.",
    heading: "Så fungerar den här utforskaren",
    intro:
      "Föreställ dig en pendelkula som hänger över en platta med tre magneter placerade i en triangel. Du drar den till en punkt, släpper, och efter en stund stannar den över en av magneterna. Kartan färgar varje startpunkt efter den magnet som till slut fångar kulan: rosa, cyan eller grönt. Stora lugna fält betyder förutsägbart beteende. Där färgerna flätas samman till tunna, omväxlande band avgör en pytteliten skillnad i var du släpper kulan hur det går. Varje pixel är en egen, fullständig simulering.",
    sections: [
      {
        heading: "Modellen",
        paragraphs: [
          "Utforskaren plattar till pendeln i planet: p = (x, y) är kulans läge sett uppifrån. Tre krafter verkar på den. Luftmotståndet γ·ṗ bromsar den, en fjäderterm ω²·p drar den tillbaka mot mitten (det är vad tyngdkraften gör för en verklig pendel vid små utslag), och varje magnet drar den till sig med en kraft som avtar med avståndet.",
          "Kulan rör inte vid plattan. Den svänger på höjden h ovanför den, så avståndet till en magnet är √(d² + h²) i stället för d. Det håller kraften ändlig rakt ovanför en magnet och är det som får modellen att bete sig rimligt. Magneterna sitter i hörnen på en liksidig triangel med radie 1 kring mitten, i (0; −1) och (±0,866; 0,5).",
        ],
        formula:
          "\\ddot{\\mathbf p} = -\\gamma\\,\\dot{\\mathbf p} - \\omega^2 \\mathbf p - \\sum_{i=1}^{3} \\frac{k\\,(\\mathbf p - \\mathbf m_i)}{\\left(|\\mathbf p - \\mathbf m_i|^2 + h^2\\right)^{3/2}}",
      },
      {
        heading: "Vad reglagen gör",
        paragraphs: [
          "”Magnetstyrka k” (0,05 till 1,5; standard 0,4) skalar dragkraften hos alla tre magneterna. ”Dämpning γ” (0,01 till 0,6; standard 0,18) är friktionen: med låga värden flyger kulan förbi magneterna många gånger innan den kommer till ro, med höga värden stannar den nästan där den siktades. ”Återföring ω²” (0,05 till 2; standard 0,5) är styvheten i kraften som drar tillbaka mot mitten. ”Pendelhöjd h” (0,05 till 0,6; standard 0,18) bestämmer hur nära kulan passerar över magneterna; litet h ger skarpa, starka ryck rakt ovanför en magnet, stort h smetar ut fältet.",
          "”Vy ±” (0,8 till 4; standard 2,0) väljer kvadraten av startpunkter, från −span till +span i båda riktningarna, så ett lägre värde zoomar in mot mitten. ”Upplösning” (60 till 360 pixlar per sida; standard 180) bestämmer hur många startpunkter som simuleras. Med ”Skugga efter infångningstid” påslaget mörkas varje pixel efter hur lång tid infångningen tog: ljust betyder snabbt fångad, mörkt betyder en lång, kaotisk färd. ”Räkna om” kör hela kartan en gång till; varje reglageändring gör det automatiskt.",
        ],
      },
      {
        heading: "Hur den är byggd",
        paragraphs: [
          "Varje pixel startar kulan i vila i mitten av sin cell och integrerar ekvationen med den semi-implicita Eulermetoden med fast steg dt = 0,02: först uppdateras hastigheten från accelerationen, sedan läget från den nya hastigheten. Den ordningen kostar knappt mer än vanlig Euler men hindrar svängningarna från att vinna energi ur tomma intet, och det räcker här eftersom det enda resultat som spelar roll är vilken magnet som vinner.",
          "Vart åttonde steg kontrollerar koden om kulan är närmare en magnet än √0,06 ≈ 0,245 och långsammare än √0,005 ≈ 0,07. I så fall är den magneten vinnaren, och antalet steg blir infångningstiden. Om 3000 steg går utan infångning, eller om talen skenar, väljs den närmaste magneten i stället och pixeln får den mörkaste nyansen.",
          "Med standardupplösningen blir det 32 400 banor på upp till 3000 steg vardera, så kartan beräknas i skivor om sex rader per animationsbildruta. Förloppsindikatorn räknar uppåt medan bilden fylls uppifrån och ned, och webbläsaren förblir responsiv. Pixlarna hamnar i en ImageData-buffert i den valda upplösningen, som sedan skalas upp utan utjämning till den största centrerade kvadraten på canvasen, så triangeln blir aldrig utdragen. Det finns ingen pågående animation: så fort indikatorn visar ”klar” står bilden still.",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "Varför gränserna ser fraktala ut",
        paragraphs: [
          "Nära gränsen mellan två färger passerar en bana tätt förbi en magnet utan att fångas, slungas mot en annan, och så upprepas det. Varje nära miss töjer ut små skillnader i startpunkten, så ju närmare du tittar på en gräns, desto fler tunna band i alla tre färgerna dyker upp mellan de två. Det är känsligt beroende av begynnelsevillkoren, men här ritat som en karta i stället för som en enda vinglande kurva. Lägg märke till vad kartan inte säger: den betyder inte att utfallet är slumpmässigt. Varje pixel är helt deterministisk och ger samma svar varje gång; problemet är att en aning annorlunda pixel kan ge ett annat.",
        ],
      },
    ],
    experimentsHeading: "Prova det här",
    experiments: [
      {
        title: "Lugna ner den",
        text: "Höj dämpningen γ till 0,5. Kulan förlorar sin energi innan den hinner besöka mer än en magnet, och kartan blir tre stora, nästan rena kilar med enkla gränser. Sänk sedan γ till 0,05 och se hur kilarna löses upp i band.",
      },
      {
        title: "Zooma in mot mitten",
        text: "Ställ vyn på 0,8 och upplösningen på 300. Kring mitten, mellan de tre magneterna, slingrar sig färgbanden in i varandra mycket finare än standardvyn antyder.",
      },
      {
        title: "Sänk kulan",
        text: "Minska h från 0,18 till 0,08. Dragkraften rakt ovanför varje magnet blir mycket starkare och skarpare, nära missar slungar kulan hårdare och de sammanflätade områdena växer. Höjer du h till 0,5 mjuknar allt igen.",
      },
      {
        title: "Magneter för svaga för att hålla kvar",
        text: "Ställ k på 0,05 och ω² på 2. Nu vinner fjädern över magneterna, så kulan kommer gärna till ro nära mitten där ingen magnet kan göra anspråk på den. Någon infångning registreras aldrig, koden faller tillbaka på närmaste magnet efter 3000 steg, och med skuggningen påslagen blir kartan mörk.",
      },
    ],
  },
  no: {
    metaDescription:
      "Bassengkart for den magnetiske pendelen: hver piksel er en egen simulering over tre magneter. Endre styrke, demping og høyde og se fraktale grenser.",
    heading: "Slik fungerer denne utforskeren",
    intro:
      "Se for deg en pendelkule som henger over en plate med tre magneter plassert i en trekant. Du trekker den til et punkt, slipper, og etter en stund faller den til ro over en av magnetene. Kartet farger hvert startpunkt etter magneten som til slutt fanger kulen: rosa, cyan eller grønt. Store rolige felt betyr forutsigbar oppførsel. Der fargene flettes sammen til tynne, vekslende bånd, avgjør en ørliten forskjell i hvor du slipper kulen hvordan det går. Hver piksel er en egen, fullstendig simulering.",
    sections: [
      {
        heading: "Modellen",
        paragraphs: [
          "Utforskeren flater pendelen ut i planet: p = (x, y) er posisjonen til kulen sett ovenfra. Tre krefter virker på den. Luftmotstanden γ·ṗ bremser den, et fjærledd ω²·p trekker den tilbake mot midten (det er det tyngdekraften gjør for en virkelig pendel ved små utslag), og hver magnet trekker den til seg med en kraft som avtar med avstanden.",
          "Kulen berører ikke platen. Den svinger i høyden h over den, så avstanden til en magnet er √(d² + h²) i stedet for d. Det holder kraften endelig rett over en magnet, og det er dette som får modellen til å oppføre seg fornuftig. Magnetene sitter i hjørnene av en likesidet trekant med radius 1 rundt midten, i (0; −1) og (±0,866; 0,5).",
        ],
        formula:
          "\\ddot{\\mathbf p} = -\\gamma\\,\\dot{\\mathbf p} - \\omega^2 \\mathbf p - \\sum_{i=1}^{3} \\frac{k\\,(\\mathbf p - \\mathbf m_i)}{\\left(|\\mathbf p - \\mathbf m_i|^2 + h^2\\right)^{3/2}}",
      },
      {
        heading: "Hva kontrollene gjør",
        paragraphs: [
          "«Magnetstyrke k» (0,05 til 1,5; standard 0,4) skalerer trekket fra alle tre magnetene. «Demping γ» (0,01 til 0,6; standard 0,18) er friksjonen: med lave verdier flyr kulen forbi magnetene mange ganger før den faller til ro, med høye verdier stopper den nesten der den ble siktet. «Tilbakestilling ω²» (0,05 til 2; standard 0,5) er stivheten i kraften som trekker tilbake mot midten. «Pendelhøyde h» (0,05 til 0,6; standard 0,18) bestemmer hvor nær kulen passerer over magnetene; liten h gir skarpe, sterke rykk rett over en magnet, stor h smører feltet utover.",
          "«Utsnitt ±» (0,8 til 4; standard 2,0) velger kvadratet av startpunkter, fra −span til +span i begge retninger, så en lavere verdi zoomer inn mot midten. «Oppløsning» (60 til 360 piksler per side; standard 180) bestemmer hvor mange startpunkter som simuleres. Med «Skyggelegg etter innfangingstid» slått på blir hver piksel gjort mørkere etter hvor lang tid innfangingen tok: lyst betyr raskt fanget, mørkt betyr en lang, kaotisk ferd. «Beregn på nytt» kjører hele kartet en gang til; enhver endring av en glidebryter gjør det automatisk.",
        ],
      },
      {
        heading: "Hvordan den er bygd",
        paragraphs: [
          "Hver piksel starter kulen i ro i midten av cellen sin og integrerer ligningen med den semi-implisitte Euler-metoden med fast steg dt = 0,02: først oppdateres farten ut fra akselerasjonen, deretter posisjonen ut fra den nye farten. Den rekkefølgen koster knapt mer enn vanlig Euler, men hindrer svingningene i å vinne energi ut av intet, og det holder her fordi det eneste resultatet som teller, er hvilken magnet som vinner.",
          "Hvert åttende steg sjekker koden om kulen er nærmere en magnet enn √0,06 ≈ 0,245 og langsommere enn √0,005 ≈ 0,07. I så fall er den magneten vinneren, og antall steg blir innfangingstiden. Går det 3000 steg uten innfanging, eller løper tallene løpsk, velges den nærmeste magneten i stedet, og pikselen får den mørkeste nyansen.",
          "Med standardoppløsningen blir det 32 400 baner på opptil 3000 steg hver, så kartet beregnes i skiver på seks rader per animasjonsbilde. Fremdriftsindikatoren teller oppover mens bildet fylles ovenfra og ned, og nettleseren forblir responsiv. Pikslene havner i en ImageData-buffer i den valgte oppløsningen, som deretter skaleres opp uten utjevning til det største sentrerte kvadratet på canvaset, så trekanten aldri blir strukket. Det finnes ingen løpende animasjon: så snart indikatoren viser «klar», står bildet stille.",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "Hvorfor grensene ser fraktale ut",
        paragraphs: [
          "Nær grensen mellom to farger passerer en bane tett forbi en magnet uten å bli fanget, slynges mot en annen, og så gjentar det seg. Hver nestenfangst strekker ut små forskjeller i startpunktet, så jo nærmere du ser på en grense, desto flere tynne bånd i alle tre fargene dukker opp mellom de to. Det er sensitiv avhengighet av startbetingelsene, men her tegnet som et kart i stedet for som én enkelt vinglende kurve. Legg merke til hva kartet ikke sier: det betyr ikke at utfallet er tilfeldig. Hver piksel er fullstendig deterministisk og gir samme svar hver gang; problemet er at en ørlite annerledes piksel kan gi et annet.",
        ],
      },
    ],
    experimentsHeading: "Prøv dette",
    experiments: [
      {
        title: "Ro den ned",
        text: "Øk dempingen γ til 0,5. Kulen mister energien før den rekker å besøke mer enn én magnet, og kartet blir til tre store, nesten rene kiler med enkle grenser. Senk deretter γ til 0,05 og se hvordan kilene løser seg opp i bånd.",
      },
      {
        title: "Zoom inn mot midten",
        text: "Sett utsnittet til 0,8 og oppløsningen til 300. Rundt midten, mellom de tre magnetene, snor fargebåndene seg inn i hverandre mye finere enn standardvisningen antyder.",
      },
      {
        title: "Senk kulen",
        text: "Reduser h fra 0,18 til 0,08. Trekket rett over hver magnet blir mye sterkere og skarpere, nestenfangster slynger kulen hardere, og de sammenflettede områdene vokser. Øker du h til 0,5, blir alt mykere igjen.",
      },
      {
        title: "Magneter som er for svake til å holde",
        text: "Sett k til 0,05 og ω² til 2. Nå vinner fjæren over magnetene, så kulen faller gjerne til ro nær midten, der ingen magnet kan gjøre krav på den. Innfangingen blir aldri registrert, koden faller tilbake på den nærmeste magneten etter 3000 steg, og med skyggeleggingen slått på blir kartet mørkt.",
      },
    ],
  },
};
