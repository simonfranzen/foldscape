import type { ExplorerGuide } from "./types";

// Numbers quoted here (defaults 90°/90°, L = 120 px, g = 1000 px/s², dt 0.005,
// the 1e-6 rad ghost offset, ~18 s until the twins separate by 10 px, energy
// drift at dt 0.02) match app/doublependulum/explorer/page.tsx and were
// checked by running the same RK4 code; update both together.
const DERIV_EXCERPT = `function deriv(s: PendulumState, p: Params) {
  const { th1, th2, w1, w2 } = s;
  const { m1, m2, L1, L2, g } = p;
  const d = th1 - th2;
  const den = 2 * m1 + m2 - m2 * Math.cos(2 * th1 - 2 * th2);
  const a1 =
    (-g * (2 * m1 + m2) * Math.sin(th1) -
      m2 * g * Math.sin(th1 - 2 * th2) -
      2 * Math.sin(d) * m2 * (w2 * w2 * L2 + w1 * w1 * L1 * Math.cos(d))) /
    (L1 * den);
  const a2 =
    (2 * Math.sin(d) *
      (w1 * w1 * L1 * (m1 + m2) + g * (m1 + m2) * Math.cos(th1) +
        w2 * w2 * L2 * m2 * Math.cos(d))) /
    (L2 * den);
  return [w1, w2, a1, a2];
}`;

// Total energy; the same expression in every locale.
const ENERGY_FORMULA =
  "E = \\tfrac12 (m_1 + m_2) L_1^2 \\omega_1^2 + \\tfrac12 m_2 L_2^2 \\omega_2^2 + m_2 L_1 L_2 \\omega_1 \\omega_2 \\cos(\\theta_1 - \\theta_2) - (m_1 + m_2) g L_1 \\cos\\theta_1 - m_2 g L_2 \\cos\\theta_2";

export const DOUBLE_PENDULUM_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Simulate a chaotic double pendulum live: set masses, rod lengths, gravity and start angles, and watch a ghost twin offset by 0.000001 rad drift away.",
    heading: "How this explorer works",
    intro:
      "Two rigid rods, two point masses, one pivot, gravity, and no friction. That is the whole system on the canvas, and for small swings it behaves like an ordinary pendulum. Release it from higher up and the lower arm starts to flip over, whirl and pause in ways that never quite repeat. The rose trail traces the lower mass. The pale blue copy behind it, the ghost twin, starts at almost exactly the same position and shows how quickly almost the same becomes completely different.",
    sections: [
      {
        heading: "Simple parts, chaotic whole",
        paragraphs: [
          "The state of the double pendulum is four numbers: the two angles θ₁ and θ₂ measured from straight down, and the two angular velocities ω₁ and ω₂. The equations of motion follow from the Lagrangian, kinetic energy minus potential energy, written in those angles. Because the second rod hangs from a moving point, the two angles are coupled through terms with cos(θ₁ − θ₂), and that coupling is what makes the motion chaotic at higher energies.",
          "Without friction the total energy below cannot change, and that is the only conserved quantity the system has in general. With four state variables and one conservation law, there is room for chaos, and for large enough swings it appears: tiny differences in the start grow roughly exponentially until the two motions have nothing in common.",
        ],
        formula: ENERGY_FORMULA,
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "m₁ and m₂ set the two masses (0.5 to 2, both 1 by default); the bobs grow with the square root of their mass. L₁ and L₂ are the rod lengths in pixels (40 to 200, default 120). Gravity g runs from 200 to 2400 px/s², default 1000. Lengths and gravity share the pixel unit on purpose: a simple pendulum of 120 px under 1000 px/s² would swing with a period of about 2.2 seconds, so the motion reads like a real pendulum of the same proportions.",
          "θ₁ initial and θ₂ initial set the release angles (−180° to 180°); both start at 90°, with both rods horizontal and pointing the same way. Changing any physical value or start angle restarts the motion from rest. Speed scales simulated time against wall-clock time from 0.1× to 3×. Time step dt (0.001 to 0.02, default 0.005) is the size of one integration step. Trail length keeps the last 200 to 2000 positions of the lower bob.",
          "The ghost twin starts with θ₁ larger by one millionth of a radian. The readout shows both angles, the total energy E, and Δ, the distance in pixels between the two lower bobs.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "The function below returns the time derivatives of the four state variables, in the standard closed form for two point masses on massless rods. It is integrated with the classical fourth-order Runge-Kutta method. Each animation frame measures the real time elapsed since the last one (capped at 0.05 s so a background tab does not jump), multiplies it by the speed, and runs as many RK4 steps of size dt as fit, carrying any remainder to the next frame. That keeps the motion at the same pace on 60 Hz and 120 Hz screens.",
          "The main pendulum and the ghost are integrated side by side with the same steps. Both trails are ring buffers in Float32Arrays, with NaN marking empty slots, and are drawn as small squares that fade from old to new. If any angle or velocity becomes non-finite or an angular velocity exceeds 100 rad/s, a guard resets both pendulums and shows a short notice. With reduced motion enabled, the simulation starts paused and shows a still frame; the Play button starts it when you want.",
        ],
        code: DERIV_EXCERPT,
      },
      {
        heading: "Reading the energy readout",
        paragraphs: [
          "Energy is the honesty check for the integrator. With the default start the pendulum is released from rest with both masses at pivot height, so E starts at exactly 0 and should stay there. At dt = 0.005 it stays within about one unit over a minute, out of a natural scale of hundreds of thousands. RK4 does not conserve energy exactly, though, and at dt = 0.02 the drift grows to hundreds of units within the first minute. Δ tells a different story: it grows because of chaos, not because of numerical error, and it does so even when E is perfectly steady.",
        ],
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "Count the seconds of agreement",
        text: "Keep every default and watch Δ. For the first stretch it reads 0.00 px; after roughly 15 to 20 seconds the ghost visibly separates, and soon the two pendulums move independently.",
      },
      {
        title: "Find the calm region",
        text: "Set both start angles to 20°. The motion is a gentle, regular wobble, and the ghost stays glued to the main pendulum for as long as you care to watch. Try 45° for both: still no visible separation within a minute.",
      },
      {
        title: "Push the integrator",
        text: "Return to the defaults, then raise dt to 0.02. The motion looks similar, but the energy readout now wanders by hundreds of units instead of staying near 0. Lower dt to 0.001 and E holds still to two decimals.",
      },
      {
        title: "Start from the top",
        text: "Set θ₁ to 180° and θ₂ to 90°. The upper rod starts balanced straight up, with far more energy than the default. The lower arm flips over repeatedly, and Δ climbs past 10 px after only about ten seconds.",
      },
    ],
  },
  de: {
    metaDescription:
      "Chaotisches Doppelpendel live: Massen, Stablängen, Schwerkraft und Startwinkel einstellen und sehen, wie ein um 0,000001 rad versetzter Zwilling abdriftet.",
    heading: "So funktioniert dieser Explorer",
    intro:
      "Zwei starre Stäbe, zwei Punktmassen, ein Aufhängepunkt, Schwerkraft und keine Reibung. Mehr steckt nicht im System auf dem Canvas, und bei kleinen Ausschlägen benimmt es sich wie ein gewöhnliches Pendel. Lässt du es weiter oben los, beginnt der untere Arm sich zu überschlagen, zu wirbeln und innezuhalten, ohne sich je genau zu wiederholen. Die rosa Spur zeichnet die untere Masse nach. Die blassblaue Kopie dahinter, der Geisterzwilling, startet fast exakt an derselben Stelle und zeigt, wie schnell aus fast gleich etwas völlig anderes wird.",
    sections: [
      {
        heading: "Einfache Teile, chaotisches Ganzes",
        paragraphs: [
          "Der Zustand des Doppelpendels besteht aus vier Zahlen: den Winkeln θ₁ und θ₂, gemessen von der Senkrechten nach unten, und den Winkelgeschwindigkeiten ω₁ und ω₂. Die Bewegungsgleichungen folgen aus der Lagrange-Funktion, also kinetischer minus potenzieller Energie, ausgedrückt in diesen Winkeln. Weil der zweite Stab an einem bewegten Punkt hängt, sind die Winkel über Terme mit cos(θ₁ − θ₂) gekoppelt, und genau diese Kopplung macht die Bewegung bei höherer Energie chaotisch.",
          "Ohne Reibung kann sich die Gesamtenergie unten nicht ändern, und im Allgemeinen ist sie die einzige Erhaltungsgröße des Systems. Vier Zustandsgrößen und nur ein Erhaltungssatz lassen Platz für Chaos, und bei genügend großen Ausschlägen tritt es auf: Winzige Unterschiede im Start wachsen ungefähr exponentiell, bis die beiden Bewegungen nichts mehr miteinander zu tun haben.",
        ],
        formula: ENERGY_FORMULA,
      },
      {
        heading: "Was die Regler bewirken",
        paragraphs: [
          "m₁ und m₂ legen die beiden Massen fest (0,5 bis 2, beide standardmäßig 1), die Kugeln wachsen mit der Wurzel ihrer Masse. L₁ und L₂ sind die Stablängen in Pixeln (40 bis 200, Standard 120). Die Schwerkraft g reicht von 200 bis 2400 px/s², Standard 1000. Längen und Schwerkraft teilen sich absichtlich die Einheit Pixel: Ein einfaches Pendel von 120 px unter 1000 px/s² hätte eine Periode von etwa 2,2 Sekunden, die Bewegung wirkt also wie bei einem echten Pendel derselben Proportionen.",
          "Die Startwinkel θ₁ und θ₂ bestimmen die Auslenkung beim Loslassen (−180° bis 180°). Beide starten bei 90°, beide Stäbe liegen also waagrecht in dieselbe Richtung. Jede Änderung eines physikalischen Werts oder Startwinkels startet die Bewegung neu aus der Ruhe. Das Tempo skaliert die simulierte Zeit gegenüber der Uhrzeit von 0,1× bis 3×. Der Zeitschritt dt (0,001 bis 0,02, Standard 0,005) ist die Größe eines Integrationsschritts. Die Spurlänge hält die letzten 200 bis 2000 Positionen der unteren Kugel fest.",
          "Der Geisterzwilling startet mit einem um ein Millionstel Radiant größeren θ₁. Die Anzeige zeigt beide Winkel, die Gesamtenergie E und Δ, den Abstand der beiden unteren Kugeln in Pixeln.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Die Funktion unten liefert die Zeitableitungen der vier Zustandsgrößen, in der üblichen geschlossenen Form für zwei Punktmassen an masselosen Stäben. Integriert wird mit dem klassischen Runge-Kutta-Verfahren vierter Ordnung. Jeder Animationsframe misst die seit dem letzten Frame vergangene echte Zeit (gedeckelt bei 0,05 s, damit ein Tab im Hintergrund keinen Sprung macht), multipliziert sie mit dem Tempo und rechnet so viele RK4-Schritte der Größe dt, wie hineinpassen. Der Rest wird in den nächsten Frame übertragen. So läuft die Bewegung auf 60-Hz- und 120-Hz-Bildschirmen gleich schnell.",
          "Hauptpendel und Geist werden Seite an Seite mit denselben Schritten integriert. Beide Spuren sind Ringpuffer in Float32Arrays, NaN markiert leere Plätze, und sie werden als kleine Quadrate gezeichnet, die von alt nach neu heller werden. Wird ein Winkel oder eine Geschwindigkeit nicht endlich oder überschreitet eine Winkelgeschwindigkeit 100 rad/s, setzt ein Wächter beide Pendel zurück und blendet kurz einen Hinweis ein. Ist reduzierte Bewegung eingestellt, startet die Simulation pausiert mit einem Standbild. Der Start-Knopf setzt sie in Gang, wenn du willst.",
        ],
        code: DERIV_EXCERPT,
      },
      {
        heading: "Die Energieanzeige lesen",
        paragraphs: [
          "Die Energie ist die Ehrlichkeitsprobe für den Integrator. Beim Standardstart wird das Pendel aus der Ruhe losgelassen, beide Massen auf Höhe des Aufhängepunkts, deshalb beginnt E bei genau 0 und sollte dort bleiben. Bei dt = 0,005 bleibt es über eine Minute innerhalb von etwa einer Einheit, bei einer natürlichen Größenordnung von Hunderttausenden. RK4 erhält die Energie aber nicht exakt, und bei dt = 0,02 wächst die Abweichung schon in der ersten Minute auf Hunderte Einheiten. Δ erzählt etwas anderes: Es wächst wegen des Chaos, nicht wegen Rechenfehlern, und das auch dann, wenn E völlig ruhig bleibt.",
        ],
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Die Sekunden der Einigkeit zählen",
        text: "Lass alle Standardwerte stehen und beobachte Δ. Zuerst steht dort 0,00 px. Nach etwa 15 bis 20 Sekunden trennt sich der Geist sichtbar, und bald bewegen sich die beiden Pendel unabhängig voneinander.",
      },
      {
        title: "Die ruhige Zone finden",
        text: "Stell beide Startwinkel auf 20°. Die Bewegung ist ein sanftes, regelmäßiges Wackeln, und der Geist klebt am Hauptpendel, so lange du zuschauen magst. Probier 45° für beide: Auch dann trennt sich innerhalb einer Minute nichts sichtbar.",
      },
      {
        title: "Den Integrator fordern",
        text: "Geh zurück zu den Standardwerten und erhöhe dt auf 0,02. Die Bewegung sieht ähnlich aus, aber die Energieanzeige schwankt jetzt um Hunderte Einheiten, statt nahe 0 zu bleiben. Senk dt auf 0,001, und E steht auf zwei Nachkommastellen still.",
      },
      {
        title: "Von ganz oben starten",
        text: "Stell θ₁ auf 180° und θ₂ auf 90°. Der obere Stab startet senkrecht nach oben balanciert, mit viel mehr Energie als beim Standard. Der untere Arm überschlägt sich immer wieder, und Δ überschreitet schon nach etwa zehn Sekunden 10 px.",
      },
    ],
  },
  es: {
    metaDescription:
      "Simula en vivo un péndulo doble caótico: ajusta masas, longitudes, gravedad y ángulos iniciales, y mira alejarse a un gemelo desplazado 0,000001 rad.",
    heading: "Cómo funciona este explorador",
    intro:
      "Dos varillas rígidas, dos masas puntuales, un pivote, gravedad y nada de rozamiento. Ese es todo el sistema que hay en el lienzo, y para oscilaciones pequeñas se comporta como un péndulo corriente. Suéltalo desde más arriba y el brazo inferior empieza a dar la vuelta, a girar y a detenerse de maneras que nunca se repiten del todo. La estela rosa sigue a la masa inferior. La copia azul pálido que va detrás, el gemelo fantasma, arranca casi exactamente en la misma posición y muestra lo rápido que casi lo mismo se convierte en algo completamente distinto.",
    sections: [
      {
        heading: "Piezas simples, conjunto caótico",
        paragraphs: [
          "El estado del péndulo doble son cuatro números: los dos ángulos θ₁ y θ₂ medidos desde la vertical hacia abajo, y las dos velocidades angulares ω₁ y ω₂. Las ecuaciones del movimiento salen del lagrangiano, energía cinética menos energía potencial, escrito en esos ángulos. Como la segunda varilla cuelga de un punto que se mueve, los dos ángulos quedan acoplados mediante términos con cos(θ₁ − θ₂), y ese acoplamiento es lo que vuelve caótico el movimiento a energías altas.",
          "Sin rozamiento, la energía total de abajo no puede cambiar, y esa es la única cantidad conservada que tiene el sistema en general. Con cuatro variables de estado y una sola ley de conservación hay sitio para el caos, y con oscilaciones lo bastante grandes aparece: diferencias diminutas en el arranque crecen de forma aproximadamente exponencial hasta que los dos movimientos no tienen nada en común.",
        ],
        formula: ENERGY_FORMULA,
      },
      {
        heading: "Qué hacen los controles",
        paragraphs: [
          "m₁ y m₂ fijan las dos masas (de 0,5 a 2, ambas 1 por defecto); las bolas crecen con la raíz cuadrada de su masa. L₁ y L₂ son las longitudes de las varillas en píxeles (de 40 a 200, por defecto 120). La gravedad g va de 200 a 2400 px/s², por defecto 1000. Longitudes y gravedad comparten a propósito el píxel como unidad: un péndulo simple de 120 px bajo 1000 px/s² oscilaría con un periodo de unos 2,2 segundos, así que el movimiento se lee como el de un péndulo real de las mismas proporciones.",
          "«θ₁ inicial» y «θ₂ inicial» fijan los ángulos de salida (de −180° a 180°); ambos empiezan en 90°, con las dos varillas horizontales y apuntando hacia el mismo lado. Cambiar cualquier valor físico o ángulo inicial reinicia el movimiento desde el reposo. «Velocidad» escala el tiempo simulado respecto al tiempo real, de 0,1× a 3×. «Paso de tiempo dt» (de 0,001 a 0,02, por defecto 0,005) es el tamaño de un paso de integración. «Longitud de traza» conserva las últimas 200 a 2000 posiciones de la bola inferior.",
          "El gemelo fantasma arranca con un θ₁ mayor en una millonésima de radián. La lectura muestra ambos ángulos, la energía total E y Δ, la distancia en píxeles entre las dos bolas inferiores.",
        ],
      },
      {
        heading: "Cómo está construido",
        paragraphs: [
          "La función de abajo devuelve las derivadas temporales de las cuatro variables de estado, en la forma cerrada habitual para dos masas puntuales sobre varillas sin masa. Se integra con el método clásico de Runge-Kutta de cuarto orden. Cada fotograma de animación mide el tiempo real transcurrido desde el anterior (limitado a 0,05 s para que una pestaña en segundo plano no dé un salto), lo multiplica por la velocidad y ejecuta tantos pasos RK4 de tamaño dt como quepan, dejando el resto para el fotograma siguiente. Así el movimiento mantiene el mismo ritmo en pantallas de 60 Hz y de 120 Hz.",
          "El péndulo principal y el fantasma se integran en paralelo con los mismos pasos. Las dos estelas son búferes circulares en Float32Arrays, con NaN para marcar los huecos vacíos, y se dibujan como cuadraditos que se desvanecen de lo antiguo a lo nuevo. Si algún ángulo o velocidad deja de ser finito o una velocidad angular supera los 100 rad/s, una salvaguarda reinicia los dos péndulos y muestra un aviso breve. Con el movimiento reducido activado, la simulación arranca en pausa y muestra un fotograma fijo; el botón «Reproducir» la pone en marcha cuando quieras.",
        ],
        code: DERIV_EXCERPT,
      },
      {
        heading: "Cómo leer la energía",
        paragraphs: [
          "La energía es la prueba de honestidad del integrador. Con el arranque por defecto, el péndulo se suelta desde el reposo con las dos masas a la altura del pivote, así que E empieza exactamente en 0 y debería quedarse ahí. Con dt = 0,005 se mantiene dentro de más o menos una unidad a lo largo de un minuto, frente a una escala natural de cientos de miles. RK4, sin embargo, no conserva la energía de forma exacta, y con dt = 0,02 la deriva crece hasta cientos de unidades en el primer minuto. Δ cuenta otra historia: crece por el caos, no por el error numérico, y lo hace incluso cuando E está perfectamente estable.",
        ],
      },
    ],
    experimentsHeading: "Prueba esto",
    experiments: [
      {
        title: "Cuenta los segundos de acuerdo",
        text: "Deja todos los valores por defecto y observa Δ. Durante el primer tramo marca 0,00 px; tras unos 15 a 20 segundos el fantasma se separa a ojos vistas, y pronto los dos péndulos se mueven cada uno por su cuenta.",
      },
      {
        title: "Encuentra la zona tranquila",
        text: "Pon los dos ángulos iniciales en 20°. El movimiento es un vaivén suave y regular, y el fantasma sigue pegado al péndulo principal todo el tiempo que te apetezca mirar. Prueba con 45° en ambos: sigue sin haber separación visible en un minuto.",
      },
      {
        title: "Exige al integrador",
        text: "Vuelve a los valores por defecto y sube dt a 0,02. El movimiento se parece, pero la lectura de energía ahora vaga cientos de unidades en lugar de quedarse cerca de 0. Baja dt a 0,001 y E se mantiene quieta hasta el segundo decimal.",
      },
      {
        title: "Empieza desde arriba",
        text: "Pon θ₁ en 180° y θ₂ en 90°. La varilla superior arranca en equilibrio apuntando recta hacia arriba, con mucha más energía que por defecto. El brazo inferior da vueltas una y otra vez, y Δ supera los 10 px tras solo unos diez segundos.",
      },
    ],
  },
  fr: {
    metaDescription:
      "Simule en direct un double pendule chaotique : règle masses, longueurs, gravité et angles de départ, et regarde dériver un jumeau décalé de 0,000001 rad.",
    heading: "Comment fonctionne cet explorateur",
    intro:
      "Deux tiges rigides, deux masses ponctuelles, un pivot, la gravité, et aucun frottement. Voilà tout le système présent sur le canevas, et pour de petites oscillations il se comporte comme un pendule ordinaire. Lâche-le de plus haut et le bras inférieur se met à basculer, à tournoyer et à marquer des pauses d'une façon qui ne se répète jamais tout à fait. La traînée rose suit la masse inférieure. La copie bleu pâle derrière elle, le jumeau fantôme, part presque exactement de la même position et montre à quelle vitesse presque pareil devient complètement différent.",
    sections: [
      {
        heading: "Des pièces simples, un tout chaotique",
        paragraphs: [
          "L'état du double pendule tient en quatre nombres : les deux angles θ₁ et θ₂ mesurés à partir de la verticale descendante, et les deux vitesses angulaires ω₁ et ω₂. Les équations du mouvement découlent du lagrangien, énergie cinétique moins énergie potentielle, écrit avec ces angles. Comme la seconde tige est suspendue à un point mobile, les deux angles sont couplés par des termes en cos(θ₁ − θ₂), et c'est ce couplage qui rend le mouvement chaotique aux énergies élevées.",
          "Sans frottement, l'énergie totale ci-dessous ne peut pas changer, et c'est la seule quantité conservée que le système possède en général. Avec quatre variables d'état et une seule loi de conservation, il y a de la place pour le chaos, et pour des oscillations assez amples il apparaît : d'infimes différences au départ croissent de façon à peu près exponentielle jusqu'à ce que les deux mouvements n'aient plus rien en commun.",
        ],
        formula: ENERGY_FORMULA,
      },
      {
        heading: "À quoi servent les commandes",
        paragraphs: [
          "m₁ et m₂ fixent les deux masses (de 0,5 à 2, toutes deux à 1 par défaut) ; les boules grossissent comme la racine carrée de leur masse. L₁ et L₂ sont les longueurs des tiges en pixels (de 40 à 200, 120 par défaut). La gravité g va de 200 à 2 400 px/s², 1 000 par défaut. Longueurs et gravité partagent volontairement le pixel comme unité : un pendule simple de 120 px soumis à 1 000 px/s² oscillerait avec une période d'environ 2,2 secondes, si bien que le mouvement se lit comme celui d'un vrai pendule de mêmes proportions.",
          "« θ₁ initial » et « θ₂ initial » fixent les angles de lâcher (de −180° à 180°) ; tous deux démarrent à 90°, les deux tiges à l'horizontale et pointant du même côté. Modifier une valeur physique ou un angle de départ relance le mouvement à partir du repos. « Vitesse » règle le rapport entre temps simulé et temps réel, de 0,1× à 3×. « Pas de temps dt » (de 0,001 à 0,02 ; 0,005 par défaut) est la taille d'un pas d'intégration. « Longueur de traînée » conserve les 200 à 2 000 dernières positions de la boule inférieure.",
          "Le jumeau fantôme démarre avec un θ₁ plus grand d'un millionième de radian. L'affichage indique les deux angles, l'énergie totale E et Δ, la distance en pixels entre les deux boules inférieures.",
        ],
      },
      {
        heading: "Comment c'est construit",
        paragraphs: [
          "La fonction ci-dessous renvoie les dérivées temporelles des quatre variables d'état, sous la forme close habituelle pour deux masses ponctuelles sur des tiges sans masse. Elle est intégrée par la méthode classique de Runge-Kutta d'ordre quatre. Chaque image de l'animation mesure le temps réel écoulé depuis la précédente (plafonné à 0,05 s pour qu'un onglet en arrière-plan ne fasse pas de bond), le multiplie par la vitesse et exécute autant de pas RK4 de taille dt qu'il en tient, en reportant le reste sur l'image suivante. Le mouvement garde ainsi la même allure sur des écrans à 60 Hz et à 120 Hz.",
          "Le pendule principal et le fantôme sont intégrés côte à côte avec les mêmes pas. Les deux traînées sont des tampons circulaires dans des Float32Array, où NaN marque les emplacements vides, et sont dessinées sous forme de petits carrés qui s'estompent de l'ancien vers le récent. Si un angle ou une vitesse cesse d'être fini, ou si une vitesse angulaire dépasse 100 rad/s, un garde-fou réinitialise les deux pendules et affiche un court message. Quand la réduction des animations est activée, la simulation démarre en pause et montre une image fixe ; le bouton « Lecture » la lance quand tu veux.",
        ],
        code: DERIV_EXCERPT,
      },
      {
        heading: "Lire l'affichage de l'énergie",
        paragraphs: [
          "L'énergie est le test d'honnêteté de l'intégrateur. Avec le départ par défaut, le pendule est lâché au repos, les deux masses à la hauteur du pivot : E vaut donc exactement 0 au début et devrait y rester. Avec dt = 0,005, elle reste à environ une unité près pendant une minute, pour une échelle naturelle de plusieurs centaines de milliers. RK4 ne conserve toutefois pas l'énergie exactement, et avec dt = 0,02 la dérive atteint des centaines d'unités dès la première minute. Δ raconte une autre histoire : il croît à cause du chaos, pas de l'erreur numérique, et il le fait même quand E est parfaitement stable.",
        ],
      },
    ],
    experimentsHeading: "À essayer",
    experiments: [
      {
        title: "Compte les secondes d'accord",
        text: "Garde toutes les valeurs par défaut et surveille Δ. Au début, il affiche 0,00 px ; après 15 à 20 secondes environ, le fantôme se sépare visiblement, et bientôt les deux pendules bougent indépendamment.",
      },
      {
        title: "Trouve la zone calme",
        text: "Règle les deux angles de départ sur 20°. Le mouvement est un balancement doux et régulier, et le fantôme reste collé au pendule principal aussi longtemps que tu voudras regarder. Essaie 45° pour les deux : toujours aucune séparation visible en une minute.",
      },
      {
        title: "Pousse l'intégrateur dans ses retranchements",
        text: "Reviens aux valeurs par défaut, puis monte dt à 0,02. Le mouvement a l'air semblable, mais l'énergie affichée vagabonde maintenant de plusieurs centaines d'unités au lieu de rester près de 0. Descends dt à 0,001 et E ne bouge plus à deux décimales près.",
      },
      {
        title: "Pars du sommet",
        text: "Règle θ₁ sur 180° et θ₂ sur 90°. La tige supérieure démarre en équilibre, dressée à la verticale, avec bien plus d'énergie que par défaut. Le bras inférieur bascule à répétition, et Δ dépasse 10 px au bout d'une dizaine de secondes seulement.",
      },
    ],
  },
  it: {
    metaDescription:
      "Simula dal vivo un doppio pendolo caotico: regola masse, lunghezze, gravità e angoli iniziali, e guarda allontanarsi un gemello spostato di 0,000001 rad.",
    heading: "Come funziona questo esploratore",
    intro:
      "Due aste rigide, due masse puntiformi, un perno, la gravità e nessun attrito. Il sistema sul canvas è tutto qui, e per piccole oscillazioni si comporta come un pendolo qualunque. Lascialo andare da più in alto e il braccio inferiore comincia a ribaltarsi, a vorticare e a fermarsi in modi che non si ripetono mai del tutto. La scia rosa segue la massa inferiore. La copia azzurro pallido alle sue spalle, il gemello fantasma, parte quasi esattamente dalla stessa posizione e mostra quanto in fretta quasi uguale diventi completamente diverso.",
    sections: [
      {
        heading: "Parti semplici, insieme caotico",
        paragraphs: [
          "Lo stato del doppio pendolo è fatto di quattro numeri: i due angoli θ₁ e θ₂ misurati dalla verticale verso il basso e le due velocità angolari ω₁ e ω₂. Le equazioni del moto derivano dalla lagrangiana, energia cinetica meno energia potenziale, scritta in quegli angoli. Poiché la seconda asta è appesa a un punto che si muove, i due angoli sono accoppiati da termini con cos(θ₁ − θ₂), ed è questo accoppiamento a rendere caotico il moto alle energie più alte.",
          "Senza attrito l'energia totale qui sotto non può cambiare, ed è l'unica quantità conservata che il sistema possiede in generale. Con quattro variabili di stato e una sola legge di conservazione c'è spazio per il caos, e per oscillazioni abbastanza ampie il caos compare: differenze minuscole alla partenza crescono in modo all'incirca esponenziale finché i due moti non hanno più nulla in comune.",
        ],
        formula: ENERGY_FORMULA,
      },
      {
        heading: "Che cosa fanno i controlli",
        paragraphs: [
          "m₁ e m₂ impostano le due masse (da 0,5 a 2, entrambe 1 per impostazione predefinita); le sfere crescono con la radice quadrata della loro massa. L₁ e L₂ sono le lunghezze delle aste in pixel (da 40 a 200, predefinito 120). La gravità g va da 200 a 2400 px/s², predefinito 1000. Lunghezze e gravità condividono di proposito il pixel come unità: un pendolo semplice di 120 px sotto 1000 px/s² oscillerebbe con un periodo di circa 2,2 secondi, quindi il moto si legge come quello di un pendolo reale con le stesse proporzioni.",
          "«θ₁ iniziale» e «θ₂ iniziale» impostano gli angoli di rilascio (da −180° a 180°); entrambi partono da 90°, con le due aste orizzontali e rivolte dalla stessa parte. Cambiare un qualsiasi valore fisico o angolo iniziale fa ripartire il moto da fermo. «Velocità» scala il tempo simulato rispetto al tempo reale da 0,1× a 3×. «Passo temporale dt» (da 0,001 a 0,02, predefinito 0,005) è l'ampiezza di un passo di integrazione. «Lunghezza scia» conserva le ultime posizioni della sfera inferiore, da 200 a 2000.",
          "Il gemello fantasma parte con un θ₁ più grande di un milionesimo di radiante. La lettura mostra entrambi gli angoli, l'energia totale E e Δ, la distanza in pixel tra le due sfere inferiori.",
        ],
      },
      {
        heading: "Com'è costruito",
        paragraphs: [
          "La funzione qui sotto restituisce le derivate temporali delle quattro variabili di stato, nella forma chiusa standard per due masse puntiformi su aste prive di massa. Viene integrata con il metodo classico di Runge-Kutta del quarto ordine. Ogni fotogramma dell'animazione misura il tempo reale trascorso dal precedente (limitato a 0,05 s perché una scheda in background non faccia un salto), lo moltiplica per la velocità ed esegue tanti passi RK4 di ampiezza dt quanti ce ne stanno, riportando l'eventuale resto al fotogramma successivo. Così il moto tiene lo stesso ritmo su schermi a 60 Hz e a 120 Hz.",
          "Il pendolo principale e il fantasma vengono integrati fianco a fianco con gli stessi passi. Entrambe le scie sono buffer circolari in Float32Array, con NaN a segnare le posizioni vuote, e sono disegnate come quadratini che sfumano dal vecchio al nuovo. Se un angolo o una velocità smette di essere finito, o una velocità angolare supera i 100 rad/s, una protezione reimposta entrambi i pendoli e mostra un breve avviso. Con il movimento ridotto attivo, la simulazione parte in pausa e mostra un fotogramma fisso; il pulsante «Play» la avvia quando vuoi.",
        ],
        code: DERIV_EXCERPT,
      },
      {
        heading: "Come leggere il valore dell'energia",
        paragraphs: [
          "L'energia è la prova di onestà dell'integratore. Con la partenza predefinita il pendolo viene rilasciato da fermo con entrambe le masse all'altezza del perno, quindi E parte esattamente da 0 e lì dovrebbe restare. Con dt = 0,005 resta entro circa un'unità nell'arco di un minuto, su una scala naturale di centinaia di migliaia. RK4 però non conserva l'energia in modo esatto, e con dt = 0,02 la deriva cresce fino a centinaia di unità entro il primo minuto. Δ racconta un'altra storia: cresce per via del caos, non dell'errore numerico, e lo fa anche quando E è perfettamente stabile.",
        ],
      },
    ],
    experimentsHeading: "Prova così",
    experiments: [
      {
        title: "Conta i secondi di accordo",
        text: "Lascia tutti i valori predefiniti e osserva Δ. Nel primo tratto segna 0,00 px; dopo circa 15 o 20 secondi il fantasma si separa visibilmente, e presto i due pendoli si muovono in modo indipendente.",
      },
      {
        title: "Trova la zona tranquilla",
        text: "Imposta entrambi gli angoli iniziali a 20°. Il moto è un dondolio dolce e regolare, e il fantasma resta incollato al pendolo principale per tutto il tempo che hai voglia di guardare. Prova 45° per entrambi: ancora nessuna separazione visibile entro un minuto.",
      },
      {
        title: "Metti alla prova l'integratore",
        text: "Torna ai valori predefiniti, poi alza dt a 0,02. Il moto sembra simile, ma il valore dell'energia ora vaga di centinaia di unità invece di restare vicino a 0. Abbassa dt a 0,001 ed E resta ferma fino alla seconda cifra decimale.",
      },
      {
        title: "Parti dall'alto",
        text: "Imposta θ₁ a 180° e θ₂ a 90°. L'asta superiore parte in equilibrio dritta verso l'alto, con molta più energia rispetto ai valori predefiniti. Il braccio inferiore si ribalta più volte, e Δ supera i 10 px dopo appena una decina di secondi.",
      },
    ],
  },
  pt: {
    metaDescription:
      "Simula ao vivo um pêndulo duplo caótico: ajusta massas, comprimentos, gravidade e ângulos iniciais, e vê afastar-se um fantasma desviado 0,000001 rad.",
    heading: "Como funciona este explorador",
    intro:
      "Duas hastes rígidas, duas massas pontuais, um pivô, gravidade e nenhum atrito. É este o sistema todo que está no canvas, e para oscilações pequenas comporta-se como um pêndulo vulgar. Larga-o de mais alto e o braço inferior começa a dar a volta, a rodopiar e a parar de maneiras que nunca se repetem por completo. O rasto cor-de-rosa segue a massa inferior. A cópia azul-pálida atrás dela, o gémeo fantasma, começa quase exatamente na mesma posição e mostra a rapidez com que quase igual se torna completamente diferente.",
    sections: [
      {
        heading: "Peças simples, conjunto caótico",
        paragraphs: [
          "O estado do pêndulo duplo são quatro números: os dois ângulos θ₁ e θ₂ medidos a partir da vertical para baixo, e as duas velocidades angulares ω₁ e ω₂. As equações do movimento resultam do lagrangiano, energia cinética menos energia potencial, escrito nesses ângulos. Como a segunda haste está pendurada num ponto que se move, os dois ângulos ficam acoplados por termos com cos(θ₁ − θ₂), e é esse acoplamento que torna o movimento caótico a energias mais altas.",
          "Sem atrito, a energia total abaixo não pode mudar, e essa é a única grandeza conservada que o sistema tem em geral. Com quatro variáveis de estado e uma só lei de conservação há espaço para o caos, e para oscilações suficientemente grandes ele aparece: diferenças minúsculas no arranque crescem de forma aproximadamente exponencial até os dois movimentos não terem nada em comum.",
        ],
        formula: ENERGY_FORMULA,
      },
      {
        heading: "O que fazem os controlos",
        paragraphs: [
          "m₁ e m₂ definem as duas massas (de 0,5 a 2, ambas 1 por omissão); as esferas crescem com a raiz quadrada da sua massa. L₁ e L₂ são os comprimentos das hastes em píxeis (de 40 a 200, 120 por omissão). A gravidade g vai de 200 a 2400 px/s², 1000 por omissão. Comprimentos e gravidade partilham de propósito o píxel como unidade: um pêndulo simples de 120 px sob 1000 px/s² oscilaria com um período de cerca de 2,2 segundos, pelo que o movimento se lê como o de um pêndulo real com as mesmas proporções.",
          "«θ₁ inicial» e «θ₂ inicial» definem os ângulos de largada (de −180° a 180°); ambos começam em 90°, com as duas hastes na horizontal e a apontar para o mesmo lado. Mudar qualquer valor físico ou ângulo inicial recomeça o movimento a partir do repouso. «Velocidade» escala o tempo simulado em relação ao tempo real, de 0,1× a 3×. «Passo de tempo dt» (de 0,001 a 0,02, 0,005 por omissão) é o tamanho de um passo de integração. «Comprimento da trilha» guarda as últimas 200 a 2000 posições da esfera inferior.",
          "O gémeo fantasma começa com um θ₁ maior num milionésimo de radiano. A leitura mostra os dois ângulos, a energia total E e Δ, a distância em píxeis entre as duas esferas inferiores.",
        ],
      },
      {
        heading: "Como está construído",
        paragraphs: [
          "A função abaixo devolve as derivadas temporais das quatro variáveis de estado, na forma fechada habitual para duas massas pontuais em hastes sem massa. É integrada com o método clássico de Runge-Kutta de quarta ordem. Cada fotograma da animação mede o tempo real decorrido desde o anterior (limitado a 0,05 s para que um separador em segundo plano não dê um salto), multiplica-o pela velocidade e corre tantos passos RK4 de tamanho dt quantos couberem, passando o resto para o fotograma seguinte. Assim o movimento mantém o mesmo ritmo em ecrãs de 60 Hz e de 120 Hz.",
          "O pêndulo principal e o fantasma são integrados lado a lado com os mesmos passos. Os dois rastos são buffers circulares em Float32Arrays, com NaN a marcar as posições vazias, e são desenhados como pequenos quadrados que se desvanecem do antigo para o novo. Se algum ângulo ou velocidade deixar de ser finito, ou se uma velocidade angular ultrapassar 100 rad/s, uma salvaguarda repõe os dois pêndulos e mostra um aviso curto. Com o movimento reduzido ativado, a simulação começa em pausa e mostra um fotograma fixo; o botão «Tocar» põe-na a andar quando quiseres.",
        ],
        code: DERIV_EXCERPT,
      },
      {
        heading: "Como ler o valor da energia",
        paragraphs: [
          "A energia é o teste de honestidade do integrador. Com o arranque por omissão, o pêndulo é largado do repouso com as duas massas à altura do pivô, por isso E começa exatamente em 0 e deveria lá ficar. Com dt = 0,005 mantém-se dentro de cerca de uma unidade ao longo de um minuto, numa escala natural de centenas de milhares. O RK4, porém, não conserva a energia de forma exata, e com dt = 0,02 a deriva cresce para centenas de unidades no primeiro minuto. Δ conta outra história: cresce por causa do caos, não do erro numérico, e fá-lo mesmo quando E está perfeitamente estável.",
        ],
      },
    ],
    experimentsHeading: "Experimenta isto",
    experiments: [
      {
        title: "Conta os segundos de acordo",
        text: "Mantém todos os valores por omissão e observa Δ. No primeiro troço marca 0,00 px; passados uns 15 a 20 segundos o fantasma separa-se visivelmente, e em breve os dois pêndulos movem-se de forma independente.",
      },
      {
        title: "Encontra a zona calma",
        text: "Põe os dois ângulos iniciais em 20°. O movimento é um baloiçar suave e regular, e o fantasma fica colado ao pêndulo principal durante o tempo que te apetecer olhar. Experimenta 45° nos dois: continua sem separação visível num minuto.",
      },
      {
        title: "Puxa pelo integrador",
        text: "Volta aos valores por omissão e depois sobe dt para 0,02. O movimento parece semelhante, mas a leitura da energia vagueia agora centenas de unidades em vez de ficar perto de 0. Baixa dt para 0,001 e E fica parada até à segunda casa decimal.",
      },
      {
        title: "Começa lá de cima",
        text: "Põe θ₁ em 180° e θ₂ em 90°. A haste superior começa em equilíbrio a apontar a direito para cima, com muito mais energia do que por omissão. O braço inferior dá a volta repetidamente, e Δ passa dos 10 px ao fim de apenas uns dez segundos.",
      },
    ],
  },
  sv: {
    metaDescription:
      "Simulera en kaotisk dubbelpendel live: ställ in massor, stånglängder, gravitation och startvinklar, och se en spöktvilling förskjuten 0,000001 rad driva bort.",
    heading: "Så fungerar den här utforskaren",
    intro:
      "Två stela stänger, två punktmassor, en upphängningspunkt, gravitation och ingen friktion. Det är hela systemet på ytan, och vid små utslag beter det sig som en vanlig pendel. Släpp det högre upp, så börjar den undre armen slå runt, virvla och stanna upp på sätt som aldrig riktigt upprepas. Det rosa spåret följer den undre massan. Den blekblå kopian bakom den, spöktvillingen, startar i nästan exakt samma läge och visar hur snabbt nästan samma blir helt olika.",
    sections: [
      {
        heading: "Enkla delar, kaotisk helhet",
        paragraphs: [
          "Dubbelpendelns tillstånd är fyra tal: de två vinklarna θ₁ och θ₂, mätta från rakt nedåt, och de två vinkelhastigheterna ω₁ och ω₂. Rörelseekvationerna följer av Lagrangefunktionen, kinetisk energi minus potentiell energi, uttryckt i dessa vinklar. Eftersom den andra stången hänger i en punkt som rör sig kopplas de två vinklarna samman genom termer med cos(θ₁ − θ₂), och det är den kopplingen som gör rörelsen kaotisk vid högre energier.",
          "Utan friktion kan den totala energin nedan inte ändras, och det är den enda bevarade storhet som systemet har i allmänhet. Med fyra tillståndsvariabler och en enda bevarandelag finns det plats för kaos, och vid tillräckligt stora utslag dyker det upp: pyttesmå skillnader i starten växer ungefär exponentiellt tills de två rörelserna inte har något gemensamt.",
        ],
        formula: ENERGY_FORMULA,
      },
      {
        heading: "Vad reglagen gör",
        paragraphs: [
          "m₁ och m₂ anger de två massorna (0,5 till 2, båda 1 som standard). Kulorna växer med kvadratroten ur sin massa. L₁ och L₂ är stånglängderna i pixlar (40 till 200, standard 120). Gravitationen g går från 200 till 2400 px/s², standard 1000. Längder och gravitation delar med flit pixeln som enhet: en enkel pendel på 120 px under 1000 px/s² skulle svänga med en period på ungefär 2,2 sekunder, så rörelsen ser ut som hos en verklig pendel med samma proportioner.",
          "”θ₁ start” och ”θ₂ start” anger släppvinklarna (−180° till 180°). Båda börjar på 90°, med båda stängerna vågräta och pekande åt samma håll. Om du ändrar något fysikaliskt värde eller en startvinkel börjar rörelsen om från vila. ”Hastighet” skalar simulerad tid mot verklig tid från 0,1× till 3×. ”Tidssteg dt” (0,001 till 0,02, standard 0,005) är storleken på ett integrationssteg. ”Spårlängd” behåller de senaste 200 till 2000 lägena för den undre kulan.",
          "Spöktvillingen startar med ett θ₁ som är en miljondels radian större. Avläsningen visar båda vinklarna, den totala energin E och Δ, avståndet i pixlar mellan de två undre kulorna.",
        ],
      },
      {
        heading: "Hur den är byggd",
        paragraphs: [
          "Funktionen nedan returnerar tidsderivatorna av de fyra tillståndsvariablerna, på den vanliga slutna formen för två punktmassor på masslösa stänger. Den integreras med den klassiska Runge-Kutta-metoden av fjärde ordningen. Varje animationsbildruta mäter den verkliga tid som gått sedan den förra (med ett tak på 0,05 s så att en flik i bakgrunden inte gör ett hopp), multiplicerar den med hastigheten och kör så många RK4-steg av storleken dt som får plats, och tar med resten till nästa bildruta. Det håller rörelsen i samma takt på skärmar med 60 Hz och 120 Hz.",
          "Huvudpendeln och spöket integreras sida vid sida med samma steg. Båda spåren är ringbuffertar i Float32Array, där NaN markerar tomma platser, och ritas som små kvadrater som tonar från gammalt till nytt. Om någon vinkel eller hastighet slutar vara ändlig eller om en vinkelhastighet överstiger 100 rad/s återställer en spärr båda pendlarna och visar ett kort meddelande. Med minskad rörelse aktiverad startar simuleringen pausad och visar en stillbild. Knappen ”Spela” sätter igång den när du vill.",
        ],
        code: DERIV_EXCERPT,
      },
      {
        heading: "Att läsa av energin",
        paragraphs: [
          "Energin är integratorns ärlighetstest. Med standardstarten släpps pendeln från vila med båda massorna i höjd med upphängningspunkten, så E börjar på exakt 0 och borde stanna där. Vid dt = 0,005 håller den sig inom ungefär en enhet under en minut, mot en naturlig skala på hundratusentals. RK4 bevarar dock inte energin exakt, och vid dt = 0,02 växer driften till hundratals enheter inom den första minuten. Δ berättar en annan historia: det växer på grund av kaos, inte numeriska fel, och det gör det även när E är helt stabil.",
        ],
      },
    ],
    experimentsHeading: "Prova det här",
    experiments: [
      {
        title: "Räkna sekunderna av samstämmighet",
        text: "Behåll alla standardvärden och håll ögonen på Δ. Den första stunden visar den 0,00 px. Efter ungefär 15 till 20 sekunder skiljer sig spöket synligt, och snart rör sig de två pendlarna oberoende av varandra.",
      },
      {
        title: "Hitta det lugna området",
        text: "Ställ båda startvinklarna på 20°. Rörelsen är ett mjukt, regelbundet gungande, och spöket sitter som klistrat vid huvudpendeln så länge du orkar titta. Prova 45° för båda: fortfarande ingen synlig skillnad inom en minut.",
      },
      {
        title: "Pressa integratorn",
        text: "Gå tillbaka till standardvärdena och höj sedan dt till 0,02. Rörelsen ser likartad ut, men energiavläsningen vandrar nu hundratals enheter i stället för att ligga nära 0. Sänk dt till 0,001 så står E still med två decimalers noggrannhet.",
      },
      {
        title: "Starta från toppen",
        text: "Ställ θ₁ på 180° och θ₂ på 90°. Den övre stången börjar balanserad rakt upp, med betydligt mer energi än i standardläget. Den undre armen slår runt gång på gång, och Δ klättrar förbi 10 px efter bara ungefär tio sekunder.",
      },
    ],
  },
  no: {
    metaDescription:
      "Simuler en kaotisk dobbeltpendel live: Still inn masser, stanglengder, tyngdekraft og startvinkler, og se en tvilling forskjøvet 0,000001 rad drive bort.",
    heading: "Slik fungerer denne utforskeren",
    intro:
      "To stive stenger, to punktmasser, ett opphengspunkt, tyngdekraft og ingen friksjon. Det er hele systemet på lerretet, og ved små utslag oppfører det seg som en vanlig pendel. Slipp det høyere oppe, og den nedre armen begynner å slå rundt, virvle og stanse opp på måter som aldri helt gjentar seg. Det rosa sporet følger den nedre massen. Den blekblå kopien bak den, spøkelsestvillingen, starter i nesten nøyaktig samme posisjon og viser hvor fort nesten det samme blir noe helt annet.",
    sections: [
      {
        heading: "Enkle deler, kaotisk helhet",
        paragraphs: [
          "Tilstanden til dobbeltpendelen er fire tall: de to vinklene θ₁ og θ₂, målt fra rett ned, og de to vinkelhastighetene ω₁ og ω₂. Bevegelsesligningene følger av Lagrange-funksjonen, kinetisk energi minus potensiell energi, skrevet med disse vinklene. Fordi den andre stangen henger i et punkt som beveger seg, kobles de to vinklene sammen gjennom ledd med cos(θ₁ − θ₂), og det er denne koblingen som gjør bevegelsen kaotisk ved høyere energier.",
          "Uten friksjon kan ikke den totale energien nedenfor endre seg, og det er den eneste bevarte størrelsen systemet har generelt. Med fire tilstandsvariabler og én bevaringslov er det rom for kaos, og ved store nok utslag dukker det opp: Ørsmå forskjeller i starten vokser omtrent eksponentielt til de to bevegelsene ikke har noe til felles.",
        ],
        formula: ENERGY_FORMULA,
      },
      {
        heading: "Hva kontrollene gjør",
        paragraphs: [
          "m₁ og m₂ setter de to massene (0,5 til 2, begge 1 som standard). Kulene vokser med kvadratroten av massen. L₁ og L₂ er stanglengdene i piksler (40 til 200, standard 120). Tyngdekraften g går fra 200 til 2400 px/s², standard 1000. Lengder og tyngdekraft deler med vilje pikselen som enhet: En enkel pendel på 120 px under 1000 px/s² ville svingt med en periode på omtrent 2,2 sekunder, så bevegelsen ser ut som hos en virkelig pendel med de samme proporsjonene.",
          "«θ₁ start» og «θ₂ start» setter slippvinklene (−180° til 180°). Begge starter på 90°, med begge stengene vannrette og pekende samme vei. Endrer du en fysisk verdi eller en startvinkel, starter bevegelsen på nytt fra ro. «Fart» skalerer simulert tid mot virkelig tid fra 0,1× til 3×. «Tidssteg dt» (0,001 til 0,02, standard 0,005) er størrelsen på ett integrasjonssteg. «Sporlengde» beholder de siste 200 til 2000 posisjonene til den nedre kulen.",
          "Spøkelsestvillingen starter med en θ₁ som er en milliondels radian større. Avlesningen viser begge vinklene, den totale energien E og Δ, avstanden i piksler mellom de to nedre kulene.",
        ],
      },
      {
        heading: "Slik er den bygget",
        paragraphs: [
          "Funksjonen nedenfor returnerer de tidsderiverte av de fire tilstandsvariablene, på den vanlige lukkede formen for to punktmasser på masseløse stenger. Den integreres med den klassiske Runge-Kutta-metoden av fjerde orden. Hvert animasjonsbilde måler den virkelige tiden som har gått siden den forrige (med et tak på 0,05 s, slik at en fane i bakgrunnen ikke gjør et hopp), multipliserer den med farten og kjører så mange RK4-steg av størrelse dt som det er plass til, og tar med resten til neste bilde. Det holder bevegelsen i samme tempo på skjermer med 60 Hz og 120 Hz.",
          "Hovedpendelen og spøkelset integreres side om side med de samme stegene. Begge sporene er ringbuffere i Float32Array, der NaN markerer tomme plasser, og tegnes som små kvadrater som toner fra gammelt til nytt. Hvis en vinkel eller hastighet slutter å være endelig, eller en vinkelhastighet overstiger 100 rad/s, tilbakestiller en sperre begge pendlene og viser en kort melding. Med redusert bevegelse slått på starter simuleringen i pause og viser et stillbilde. Knappen «Spill» setter den i gang når du vil.",
        ],
        code: DERIV_EXCERPT,
      },
      {
        heading: "Å lese av energien",
        paragraphs: [
          "Energien er ærlighetstesten for integratoren. Med standardstarten slippes pendelen fra ro med begge massene i høyde med opphengspunktet, så E starter på nøyaktig 0 og burde bli der. Ved dt = 0,005 holder den seg innenfor omtrent én enhet i løpet av et minutt, mot en naturlig skala på hundretusener. RK4 bevarer likevel ikke energien eksakt, og ved dt = 0,02 vokser driften til hundrevis av enheter i løpet av det første minuttet. Δ forteller en annen historie: Den vokser på grunn av kaos, ikke numeriske feil, og det gjør den selv når E er helt stabil.",
        ],
      },
    ],
    experimentsHeading: "Prøv dette",
    experiments: [
      {
        title: "Tell sekundene med enighet",
        text: "Behold alle standardverdiene og følg med på Δ. Den første stunden viser den 0,00 px. Etter omtrent 15 til 20 sekunder skiller spøkelset seg synlig ut, og snart beveger de to pendlene seg uavhengig av hverandre.",
      },
      {
        title: "Finn det rolige området",
        text: "Sett begge startvinklene til 20°. Bevegelsen er en myk, regelmessig vugging, og spøkelset sitter som limt til hovedpendelen så lenge du gidder å se på. Prøv 45° for begge: fortsatt ingen synlig forskjell i løpet av et minutt.",
      },
      {
        title: "Press integratoren",
        text: "Gå tilbake til standardverdiene, og øk så dt til 0,02. Bevegelsen ser lik ut, men energiavlesningen vandrer nå hundrevis av enheter i stedet for å holde seg nær 0. Senk dt til 0,001, og E står stille med to desimalers nøyaktighet.",
      },
      {
        title: "Start fra toppen",
        text: "Sett θ₁ til 180° og θ₂ til 90°. Den øvre stangen starter balansert rett opp, med langt mer energi enn i standardoppsettet. Den nedre armen slår rundt gang på gang, og Δ klatrer forbi 10 px etter bare rundt ti sekunder.",
      },
    ],
  },
};
