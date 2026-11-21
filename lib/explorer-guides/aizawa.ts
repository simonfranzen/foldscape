import type { ExplorerGuide } from "./types";

// Numbers quoted here (2400 steps per frame, dt 0.005 to 0.02, the 24000-step
// still image with a 600-step warm-up, the 0.04 trail fade) match
// app/aizawa/explorer/page.tsx; update both together.
const RK4_EXCERPT = `deriv: (x, y, z, p) => {
  const [a, b, c, d, e, f] = p;
  const dx = (z - b) * x - d * y;
  const dy = d * x + (z - b) * y;
  const dz = c + a * z - (z * z * z) / 3 - (x * x + y * y) * (1 + e * z) + f * z * x * x * x;
  return [dx, dy, dz];
},

function rk4Step(f, x, y, z, p, dt) {
  const h = 0.5 * dt;
  const k1 = f(x, y, z, p);
  const k2 = f(x + h * k1[0], y + h * k1[1], z + h * k1[2], p);
  const k3 = f(x + h * k2[0], y + h * k2[1], z + h * k2[2], p);
  const k4 = f(x + dt * k3[0], y + dt * k3[1], z + dt * k3[2], p);
  const w = dt / 6;
  return [
    x + w * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]),
    y + w * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]),
    z + w * (k1[2] + 2 * k2[2] + 2 * k3[2] + k4[2]),
  ];
}

// inside the frame loop, stepsPerFrame times:
[x, y, z] = rk4Step(attractor.deriv, x, y, z, params, dt);
guard(); // re-seed at (0.1, 0, 0) if a value stopped being finite`;

const AIZAWA_FORMULA =
  "\\begin{aligned} \\dot x &= (z - b)\\,x - d\\,y \\\\ \\dot y &= d\\,x + (z - b)\\,y \\\\ \\dot z &= c + a z - \\tfrac{z^3}{3} - (x^2 + y^2)(1 + e z) + f z x^3 \\end{aligned}";

const CYLINDER_FORMULA = "\\dot r = (z - b)\\,r, \\qquad \\dot\\theta = d";

export const AIZAWA_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Rotate the Aizawa attractor in 3D, tune all six parameters a to f, and compare it with Rössler, Thomas and Halvorsen. See why f is the key to its chaos.",
    heading: "How this explorer works",
    intro:
      "The cloud of rose dots is the path of a single point moving through three-dimensional space under the Aizawa equations. Every frame it advances a few thousand steps and leaves a dot at each one, while older dots fade. What builds up is a sphere-like shell wrapped around a vertical axis, with a thin tube running up through its middle. The point never repeats itself and never settles down, yet it never leaves that shape either: a strange attractor.",
    sections: [
      {
        heading: "Six parameters, three equations",
        paragraphs: [
          "The system has three coordinates and six constants. The defaults are a = 0.95, b = 0.7, c = 0.6, d = 3.5, e = 0.25 and f = 0.1, the values usually quoted for this attractor, and the reset button returns to exactly those. The third equation carries the nonlinear terms, including the small extra term f z x³.",
        ],
        formula: AIZAWA_FORMULA,
      },
      {
        heading: "Reading the equations in cylinder coordinates",
        paragraphs: [
          "The first two equations become much clearer if you describe x and y by a radius r and an angle θ around the z axis. Then they say exactly this: the point turns around the axis at constant angular speed d, and its distance from the axis grows while z is above b and shrinks while z is below b. So d is simply the spin rate, and b is the height of an invisible horizontal plane that separates outward motion from inward motion.",
          "Now look at the third equation with f = 0. Every term depends only on z and on x² + y² = r², not on the angle. The whole system is then rotationally symmetric: the angle just turns uniformly, and the interesting part reduces to two variables, r and z. A smooth two-dimensional system cannot be chaotic (that is the Poincaré-Bendixson theorem), so with f = 0 the orbit has to settle onto something regular, like a ring or a smooth torus. The tiny term f z x³ is what breaks the symmetry, because x³ depends on the angle. It is the reason this attractor is chaotic at all.",
        ],
        formula: CYLINDER_FORMULA,
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "The six parameter sliders cover a from 0.5 to 1.5, b from 0.3 to 1.2, c from 0.2 to 1.5, d from 2 to 6, e from 0.1 to 0.6 and f from 0 to 0.3. Changing a parameter does not restart the orbit: the point simply continues under the new rules, and you watch the old shape dissolve into the new one. The dt slider (0.005 to 0.02, default 0.01) sets the size of each integration step.",
          "Steps / frame runs from 200 to 6000 and starts at 2400. Drag the canvas to rotate the view, toggle auto-rotate to stop the slow spin, and use Clear & restart to wipe the canvas and send the point back to its starting position (0.1, 0, 0). The attractor buttons switch to Rössler, Thomas or Halvorsen with their own classic parameters.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "Everything runs in your browser on a 2D canvas. Like the Lorenz explorer, it integrates with the classical fourth-order Runge-Kutta method (RK4): four evaluations of the derivative per step, combined so that the error per step shrinks with the fifth power of dt. The simpler forward Euler method (one evaluation, multiply by dt, add) was not accurate enough here: at dt = 0.02 its Aizawa orbit collapsed onto a fixed point, and on the Halvorsen system it blew up. With RK4 the shape stays the same across the whole dt slider. A guard still re-seeds the point at (0.1, 0, 0) whenever a coordinate turns into NaN or infinity, so the canvas recovers instead of going blank.",
          "Each 3D point is turned into a pixel by two rotations, first around the vertical axis (yaw), then around the horizontal one (pitch), followed by a plain orthographic projection. A depth value sets each dot's opacity, so the near side reads brighter. The trail comes from painting the background colour over the whole canvas at 4 % opacity every frame, so old dots fade out over roughly a second. If your system asks for reduced motion, there is no animation at all: the explorer integrates 24000 steps at once, skips the first 600 so the transient does not show, draws a single frozen frame, and repaints it when you drag or move a slider.",
        ],
        code: RK4_EXCERPT,
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "Switch off the chaos with f",
        text: "Pull f all the way down to 0 and press Clear & restart. With the symmetry restored, the orbit can no longer be chaotic and settles onto a regular, rotationally symmetric shape. Then raise f back to 0.1.",
      },
      {
        title: "Move the dividing plane",
        text: "Slide b between 0.5 and 1.0. Since b is the height where outward drift turns into inward drift, the shape stretches and squeezes along the vertical axis. If the orbit escapes, use Clear & restart.",
      },
      {
        title: "Follow a single orbit",
        text: "Turn auto-rotate off and drop Steps / frame to 200. Now you can see the point spiralling around the axis, climbing the central tube and falling back onto the shell.",
      },
      {
        title: "Visit the relatives",
        text: "Switch to Rössler and lower c from 5.7 toward 2.5: the chaotic band simplifies into fewer and fewer loops. Then try Thomas with b near 0.05, where the point wanders through a whole lattice of cells instead of staying in one.",
      },
    ],
  },
  de: {
    metaDescription:
      "Den Aizawa-Attraktor in 3D drehen, die Parameter a bis f einstellen und mit Rössler, Thomas und Halvorsen vergleichen. Warum f der Schlüssel zum Chaos ist.",
    heading: "So funktioniert dieser Explorer",
    intro:
      "Die Wolke aus rosafarbenen Punkten ist die Bahn eines einzigen Punkts, der sich nach den Aizawa-Gleichungen durch den dreidimensionalen Raum bewegt. In jedem Frame rückt er ein paar tausend Schritte weiter und hinterlässt bei jedem einen Punkt, während ältere verblassen. So entsteht eine kugelartige Hülle um eine senkrechte Achse, durch deren Mitte eine dünne Röhre läuft. Der Punkt wiederholt sich nie und kommt nie zur Ruhe, verlässt diese Form aber auch nie: ein seltsamer Attraktor.",
    sections: [
      {
        heading: "Sechs Parameter, drei Gleichungen",
        paragraphs: [
          "Das System hat drei Koordinaten und sechs Konstanten. Voreingestellt sind a = 0,95, b = 0,7, c = 0,6, d = 3,5, e = 0,25 und f = 0,1, die üblichen Werte für diesen Attraktor; der Reset-Knopf stellt genau diese wieder her. In der dritten Gleichung stecken die nichtlinearen Terme, darunter der kleine Zusatzterm f z x³.",
        ],
        formula: AIZAWA_FORMULA,
      },
      {
        heading: "Die Gleichungen in Zylinderkoordinaten",
        paragraphs: [
          "Die ersten beiden Gleichungen werden viel klarer, wenn du x und y durch einen Radius r und einen Winkel θ um die z-Achse beschreibst. Dann sagen sie genau das: Der Punkt dreht sich mit konstanter Winkelgeschwindigkeit d um die Achse, und sein Abstand zur Achse wächst, solange z über b liegt, und schrumpft, solange z unter b liegt. d ist also schlicht die Drehgeschwindigkeit, und b ist die Höhe einer unsichtbaren waagerechten Ebene, die Bewegung nach außen von Bewegung nach innen trennt.",
          "Schau dir jetzt die dritte Gleichung mit f = 0 an. Jeder Term hängt nur von z und von x² + y² = r² ab, nicht vom Winkel. Das ganze System ist dann rotationssymmetrisch: Der Winkel dreht sich gleichmäßig weiter, und der spannende Teil schrumpft auf zwei Variablen, r und z. Ein glattes zweidimensionales System kann nicht chaotisch sein (das besagt der Satz von Poincaré-Bendixson), also muss die Bahn bei f = 0 auf etwas Regelmäßiges zulaufen, etwa einen Ring oder einen glatten Torus. Erst der winzige Term f z x³ bricht die Symmetrie, weil x³ vom Winkel abhängt. Er ist der Grund, warum dieser Attraktor überhaupt chaotisch ist.",
        ],
        formula: CYLINDER_FORMULA,
      },
      {
        heading: "Was die Regler bewirken",
        paragraphs: [
          "Die sechs Parameterregler reichen für a von 0,5 bis 1,5, für b von 0,3 bis 1,2, für c von 0,2 bis 1,5, für d von 2 bis 6, für e von 0,1 bis 0,6 und für f von 0 bis 0,3. Eine Parameteränderung startet die Bahn nicht neu: Der Punkt läuft einfach nach den neuen Regeln weiter, und du siehst, wie sich die alte Form in die neue auflöst. Der dt-Regler (0,005 bis 0,02, Standard 0,01) legt die Größe jedes Integrationsschritts fest.",
          "Schritte / Frame reicht von 200 bis 6000 und startet bei 2400. Zieh am Canvas, um die Ansicht zu drehen, schalte die Auto-Rotation ab, um das langsame Kreisen zu stoppen, und nutze «Löschen & neu starten», um das Bild zu leeren und den Punkt zurück auf (0,1, 0, 0) zu setzen. Über die Attraktor-Knöpfe wechselst du zu Rössler, Thomas oder Halvorsen mit ihren eigenen klassischen Parametern.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Alles läuft in deinem Browser auf einem 2D-Canvas. Wie der Lorenz-Explorer integriert er mit dem klassischen Runge-Kutta-Verfahren vierter Ordnung (RK4): vier Auswertungen der Ableitung pro Schritt, so kombiniert, dass der Fehler pro Schritt mit der fünften Potenz von dt schrumpft. Das einfachere explizite Euler-Verfahren (eine Auswertung, mit dt multiplizieren, addieren) war hier nicht genau genug: Bei dt = 0,02 fiel die Aizawa-Bahn damit auf einen Fixpunkt zusammen, und beim Halvorsen-System lief sie davon. Mit RK4 bleibt die Form über den ganzen dt-Regler gleich. Weiterhin setzt ein Wächter den Punkt auf (0,1, 0, 0) zurück, sobald eine Koordinate NaN oder unendlich wird. So erholt sich das Bild, statt leer zu bleiben.",
          "Jeder 3D-Punkt wird durch zwei Drehungen zu einem Pixel, zuerst um die senkrechte Achse (Gieren), dann um die waagerechte (Nicken), gefolgt von einer einfachen Parallelprojektion. Ein Tiefenwert bestimmt die Deckkraft jedes Punkts, die vordere Seite wirkt dadurch heller. Die Spur entsteht, weil jeder Frame die Hintergrundfarbe mit 4 % Deckkraft über das ganze Canvas legt; alte Punkte verblassen so in etwa einer Sekunde. Wünscht dein System reduzierte Bewegung, gibt es keine Animation: Der Explorer rechnet 24000 Schritte auf einmal, überspringt die ersten 600, damit der Einschwingvorgang nicht zu sehen ist, zeichnet ein einziges Standbild und aktualisiert es, wenn du ziehst oder einen Regler bewegst.",
        ],
        code: RK4_EXCERPT,
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Das Chaos mit f abschalten",
        text: "Zieh f ganz auf 0 und drück «Löschen & neu starten». Mit wiederhergestellter Symmetrie kann die Bahn nicht mehr chaotisch sein und läuft auf eine regelmäßige, rotationssymmetrische Form zu. Erhöhe f danach wieder auf 0,1.",
      },
      {
        title: "Die Trennebene verschieben",
        text: "Schieb b zwischen 0,5 und 1,0 hin und her. Weil b die Höhe ist, an der die Drift nach außen in eine Drift nach innen umschlägt, streckt und staucht sich die Form entlang der senkrechten Achse. Läuft die Bahn davon, hilft «Löschen & neu starten».",
      },
      {
        title: "Einer einzelnen Bahn folgen",
        text: "Schalte die Auto-Rotation ab und senke Schritte / Frame auf 200. Jetzt siehst du, wie der Punkt um die Achse kreist, die zentrale Röhre hinaufklettert und zurück auf die Hülle fällt.",
      },
      {
        title: "Die Verwandtschaft besuchen",
        text: "Wechsle zu Rössler und senke c von 5,7 in Richtung 2,5: Das chaotische Band vereinfacht sich zu immer weniger Schleifen. Probier danach Thomas mit b nahe 0,05. Dort wandert der Punkt durch ein ganzes Gitter von Zellen, statt in einer zu bleiben.",
      },
    ],
  },
  es: {
    metaDescription:
      "Gira el atractor de Aizawa en 3D, ajusta sus seis parámetros, de a a f, y compáralo con Rössler, Thomas y Halvorsen. Descubre por qué f es la clave del caos.",
    heading: "Cómo funciona este explorador",
    intro:
      "La nube de puntos rosados es la trayectoria de un único punto que se mueve por el espacio tridimensional siguiendo las ecuaciones de Aizawa. En cada fotograma avanza unos miles de pasos y deja un punto en cada uno, mientras los más antiguos se desvanecen. Lo que se va formando es una envoltura casi esférica alrededor de un eje vertical, con un tubo fino que la atraviesa por el centro. El punto nunca se repite ni llega a detenerse, pero tampoco abandona esa forma: es un atractor extraño.",
    sections: [
      {
        heading: "Seis parámetros, tres ecuaciones",
        paragraphs: [
          "El sistema tiene tres coordenadas y seis constantes. Los valores por defecto son a = 0,95, b = 0,7, c = 0,6, d = 3,5, e = 0,25 y f = 0,1, los que suelen citarse para este atractor, y el botón de restablecer vuelve exactamente a ellos. La tercera ecuación contiene los términos no lineales, incluido el pequeño término adicional f z x³.",
        ],
        formula: AIZAWA_FORMULA,
      },
      {
        heading: "Las ecuaciones en coordenadas cilíndricas",
        paragraphs: [
          "Las dos primeras ecuaciones se entienden mucho mejor si describes x e y mediante un radio r y un ángulo θ alrededor del eje z. Entonces dicen exactamente esto: el punto gira alrededor del eje con velocidad angular constante d, y su distancia al eje crece mientras z está por encima de b y decrece mientras z está por debajo de b. Así que d es sencillamente la velocidad de giro, y b es la altura de un plano horizontal invisible que separa el movimiento hacia fuera del movimiento hacia dentro.",
          "Mira ahora la tercera ecuación con f = 0. Cada término depende solo de z y de x² + y² = r², no del ángulo. Todo el sistema tiene entonces simetría de rotación: el ángulo simplemente avanza de manera uniforme, y la parte interesante se reduce a dos variables, r y z. Un sistema bidimensional suave no puede ser caótico (es lo que afirma el teorema de Poincaré-Bendixson), de modo que con f = 0 la órbita tiene que acabar sobre algo regular, como un anillo o un toro liso. El diminuto término f z x³ es el que rompe la simetría, porque x³ depende del ángulo. Es la razón de que este atractor sea caótico.",
        ],
        formula: CYLINDER_FORMULA,
      },
      {
        heading: "Qué hacen los controles",
        paragraphs: [
          "Los seis deslizadores de parámetros cubren a de 0,5 a 1,5, b de 0,3 a 1,2, c de 0,2 a 1,5, d de 2 a 6, e de 0,1 a 0,6 y f de 0 a 0,3. Cambiar un parámetro no reinicia la órbita: el punto sigue adelante con las nuevas reglas, y tú ves cómo la forma antigua se disuelve en la nueva. El deslizador dt (de 0,005 a 0,02, por defecto 0,01) fija el tamaño de cada paso de integración.",
          "«Pasos / fotograma» va de 200 a 6000 y empieza en 2400. Arrastra el lienzo para girar la vista, desactiva la autorrotación para detener el giro lento y usa «Borrar y reiniciar» para limpiar el lienzo y devolver el punto a su posición inicial (0,1; 0; 0). Los botones de atractor cambian a Rössler, Thomas o Halvorsen con sus propios parámetros clásicos.",
        ],
      },
      {
        heading: "Cómo está construido",
        paragraphs: [
          "Todo se ejecuta en tu navegador sobre un lienzo 2D. Igual que el explorador de Lorenz, integra con el método clásico de Runge-Kutta de cuarto orden (RK4): cuatro evaluaciones de la derivada por paso, combinadas de forma que el error por paso disminuye con la quinta potencia de dt. El método de Euler explícito, más simple (una evaluación, multiplicar por dt, sumar), no era lo bastante preciso aquí: con dt = 0,02 su órbita de Aizawa colapsaba sobre un punto fijo, y en el sistema de Halvorsen divergía. Con RK4 la forma se mantiene igual en todo el recorrido del deslizador dt. Aun así, una salvaguarda vuelve a colocar el punto en (0,1; 0; 0) cada vez que una coordenada se convierte en NaN o en infinito, de modo que el lienzo se recupera en lugar de quedarse en blanco.",
          "Cada punto 3D se convierte en un píxel mediante dos rotaciones, primero alrededor del eje vertical (guiñada) y después alrededor del horizontal (cabeceo), seguidas de una simple proyección ortográfica. Un valor de profundidad fija la opacidad de cada punto, así que el lado cercano se ve más brillante. La estela surge de pintar el color de fondo sobre todo el lienzo con un 4 % de opacidad en cada fotograma, con lo que los puntos antiguos se apagan en más o menos un segundo. Si tu sistema pide movimiento reducido, no hay ninguna animación: el explorador integra 24 000 pasos de una vez, se salta los primeros 600 para que no se vea el transitorio, dibuja un único fotograma fijo y lo repinta cuando arrastras o mueves un deslizador.",
        ],
        code: RK4_EXCERPT,
      },
    ],
    experimentsHeading: "Prueba esto",
    experiments: [
      {
        title: "Apaga el caos con f",
        text: "Baja f del todo hasta 0 y pulsa «Borrar y reiniciar». Con la simetría restaurada, la órbita ya no puede ser caótica y se asienta sobre una forma regular con simetría de rotación. Después vuelve a subir f hasta 0,1.",
      },
      {
        title: "Mueve el plano divisorio",
        text: "Desliza b entre 0,5 y 1,0. Como b es la altura a la que la deriva hacia fuera se convierte en deriva hacia dentro, la forma se estira y se comprime a lo largo del eje vertical. Si la órbita se escapa, usa «Borrar y reiniciar».",
      },
      {
        title: "Sigue una sola órbita",
        text: "Desactiva la autorrotación y baja «Pasos / fotograma» a 200. Ahora puedes ver cómo el punto gira en espiral alrededor del eje, sube por el tubo central y vuelve a caer sobre la envoltura.",
      },
      {
        title: "Visita a los parientes",
        text: "Cambia a Rössler y baja c desde 5,7 hacia 2,5: la banda caótica se simplifica en cada vez menos bucles. Luego prueba Thomas con b cerca de 0,05, donde el punto vaga por toda una red de celdas en lugar de quedarse en una sola.",
      },
    ],
  },
  fr: {
    metaDescription:
      "Fais tourner l'attracteur d'Aizawa en 3D, règle ses six paramètres a à f et compare-le à Rössler, Thomas et Halvorsen. Découvre pourquoi f est la clé du chaos.",
    heading: "Comment fonctionne cet explorateur",
    intro:
      "Le nuage de points roses est la trajectoire d'un seul point qui se déplace dans l'espace à trois dimensions en suivant les équations d'Aizawa. À chaque image, il avance de quelques milliers de pas et laisse un point à chacun d'eux, tandis que les plus anciens s'estompent. Ce qui se dessine peu à peu est une coque presque sphérique enroulée autour d'un axe vertical, traversée en son centre par un tube étroit. Le point ne repasse jamais par le même chemin et ne s'arrête jamais, mais il ne quitte jamais cette forme non plus : c'est un attracteur étrange.",
    sections: [
      {
        heading: "Six paramètres, trois équations",
        paragraphs: [
          "Le système a trois coordonnées et six constantes. Les valeurs par défaut sont a = 0,95 ; b = 0,7 ; c = 0,6 ; d = 3,5 ; e = 0,25 et f = 0,1, celles que l'on cite habituellement pour cet attracteur, et le bouton de réinitialisation y revient exactement. La troisième équation porte les termes non linéaires, dont le petit terme supplémentaire f z x³.",
        ],
        formula: AIZAWA_FORMULA,
      },
      {
        heading: "Lire les équations en coordonnées cylindriques",
        paragraphs: [
          "Les deux premières équations deviennent bien plus claires si tu décris x et y par un rayon r et un angle θ autour de l'axe z. Elles disent alors exactement ceci : le point tourne autour de l'axe à la vitesse angulaire constante d, et sa distance à l'axe augmente tant que z est au-dessus de b et diminue tant que z est en dessous de b. Autrement dit, d est simplement la vitesse de rotation, et b est la hauteur d'un plan horizontal invisible qui sépare le mouvement vers l'extérieur du mouvement vers l'intérieur.",
          "Regarde maintenant la troisième équation avec f = 0. Chaque terme ne dépend que de z et de x² + y² = r², pas de l'angle. Le système entier est alors invariant par rotation : l'angle tourne simplement de façon uniforme, et la partie intéressante se réduit à deux variables, r et z. Un système lisse à deux dimensions ne peut pas être chaotique (c'est le théorème de Poincaré-Bendixson), donc avec f = 0 l'orbite doit finir sur quelque chose de régulier, comme un anneau ou un tore lisse. C'est le minuscule terme f z x³ qui brise la symétrie, parce que x³ dépend de l'angle. C'est grâce à lui que cet attracteur est chaotique.",
        ],
        formula: CYLINDER_FORMULA,
      },
      {
        heading: "À quoi servent les commandes",
        paragraphs: [
          "Les six curseurs de paramètres couvrent a de 0,5 à 1,5 ; b de 0,3 à 1,2 ; c de 0,2 à 1,5 ; d de 2 à 6 ; e de 0,1 à 0,6 et f de 0 à 0,3. Modifier un paramètre ne relance pas l'orbite : le point continue simplement selon les nouvelles règles, et tu vois l'ancienne forme se dissoudre dans la nouvelle. Le curseur dt (de 0,005 à 0,02 ; 0,01 par défaut) fixe la taille de chaque pas d'intégration.",
          "« Pas / image » va de 200 à 6\u00a0000 et démarre à 2\u00a0400. Fais glisser le canevas pour faire tourner la vue, désactive la rotation auto pour arrêter la lente rotation, et utilise « Effacer et redémarrer » pour vider le canevas et renvoyer le point à sa position de départ (0,1 ; 0 ; 0). Les boutons d'attracteur passent à Rössler, Thomas ou Halvorsen avec leurs propres paramètres classiques.",
        ],
      },
      {
        heading: "Comment c'est construit",
        paragraphs: [
          "Tout s'exécute dans ton navigateur, sur un canevas 2D. Comme l'explorateur de Lorenz, il intègre avec la méthode classique de Runge-Kutta d'ordre quatre (RK4) : quatre évaluations de la dérivée par pas, combinées de sorte que l'erreur par pas diminue comme la puissance cinquième de dt. La méthode d'Euler explicite, plus simple (une évaluation, on multiplie par dt, on additionne), n'était pas assez précise ici : avec dt = 0,02, son orbite d'Aizawa s'effondrait sur un point fixe, et sur le système de Halvorsen elle divergeait. Avec RK4, la forme reste la même sur toute la course du curseur dt. Un garde-fou replace tout de même le point en (0,1 ; 0 ; 0) dès qu'une coordonnée devient NaN ou infinie, si bien que le canevas se rétablit au lieu de rester vide.",
          "Chaque point 3D devient un pixel par deux rotations, d'abord autour de l'axe vertical (lacet), puis autour de l'axe horizontal (tangage), suivies d'une simple projection orthographique. Une valeur de profondeur règle l'opacité de chaque point, ce qui rend la face proche plus lumineuse. La traînée vient du fait que la couleur de fond est repeinte sur tout le canevas avec 4 % d'opacité à chaque image, de sorte que les anciens points s'effacent en une seconde environ. Si ton système demande de réduire les animations, il n'y a aucune animation : l'explorateur intègre 24\u00a0000 pas d'un coup, saute les 600 premiers pour que le régime transitoire n'apparaisse pas, dessine une seule image figée et la repeint quand tu fais glisser la vue ou déplaces un curseur.",
        ],
        code: RK4_EXCERPT,
      },
    ],
    experimentsHeading: "À essayer",
    experiments: [
      {
        title: "Éteins le chaos avec f",
        text: "Descends f jusqu'à 0 et appuie sur « Effacer et redémarrer ». La symétrie étant rétablie, l'orbite ne peut plus être chaotique et se pose sur une forme régulière, invariante par rotation. Remonte ensuite f à 0,1.",
      },
      {
        title: "Déplace le plan de séparation",
        text: "Fais varier b entre 0,5 et 1,0. Comme b est la hauteur à laquelle la dérive vers l'extérieur devient une dérive vers l'intérieur, la forme s'étire et se comprime le long de l'axe vertical. Si l'orbite s'échappe, utilise « Effacer et redémarrer ».",
      },
      {
        title: "Suis une seule orbite",
        text: "Désactive la rotation auto et descends « Pas / image » à 200. Tu peux maintenant voir le point tourner en spirale autour de l'axe, grimper dans le tube central et retomber sur la coque.",
      },
      {
        title: "Rends visite aux cousins",
        text: "Passe à Rössler et abaisse c de 5,7 vers 2,5 : la bande chaotique se simplifie en boucles de moins en moins nombreuses. Essaie ensuite Thomas avec b proche de 0,05, où le point erre à travers tout un réseau de cellules au lieu de rester dans une seule.",
      },
    ],
  },
  it: {
    metaDescription:
      "Ruota l'attrattore di Aizawa in 3D, regola i sei parametri da a a f e confrontalo con Rössler, Thomas e Halvorsen. Scopri perché f è la chiave del caos.",
    heading: "Come funziona questo esploratore",
    intro:
      "La nuvola di punti rosa è il percorso di un solo punto che si muove nello spazio tridimensionale seguendo le equazioni di Aizawa. A ogni fotogramma avanza di qualche migliaio di passi e lascia un punto a ciascuno, mentre quelli più vecchi svaniscono. Quello che prende forma è un guscio quasi sferico avvolto attorno a un asse verticale, con un tubo sottile che lo attraversa al centro. Il punto non si ripete mai e non si ferma mai, eppure non lascia mai quella forma: è un attrattore strano.",
    sections: [
      {
        heading: "Sei parametri, tre equazioni",
        paragraphs: [
          "Il sistema ha tre coordinate e sei costanti. I valori predefiniti sono a = 0,95, b = 0,7, c = 0,6, d = 3,5, e = 0,25 e f = 0,1, quelli di solito citati per questo attrattore, e il pulsante di ripristino torna esattamente a questi. La terza equazione contiene i termini non lineari, compreso il piccolo termine aggiuntivo f z x³.",
        ],
        formula: AIZAWA_FORMULA,
      },
      {
        heading: "Leggere le equazioni in coordinate cilindriche",
        paragraphs: [
          "Le prime due equazioni diventano molto più chiare se descrivi x e y con un raggio r e un angolo θ attorno all'asse z. Allora dicono esattamente questo: il punto gira attorno all'asse con velocità angolare costante d, e la sua distanza dall'asse cresce finché z è sopra b e diminuisce finché z è sotto b. Quindi d è semplicemente la velocità di rotazione, e b è l'altezza di un piano orizzontale invisibile che separa il moto verso l'esterno dal moto verso l'interno.",
          "Ora guarda la terza equazione con f = 0. Ogni termine dipende solo da z e da x² + y² = r², non dall'angolo. L'intero sistema ha allora simmetria di rotazione: l'angolo avanza in modo uniforme, e la parte interessante si riduce a due variabili, r e z. Un sistema liscio in due dimensioni non può essere caotico (lo dice il teorema di Poincaré-Bendixson), quindi con f = 0 l'orbita deve assestarsi su qualcosa di regolare, come un anello o un toro liscio. È il minuscolo termine f z x³ a rompere la simmetria, perché x³ dipende dall'angolo. È il motivo per cui questo attrattore è caotico.",
        ],
        formula: CYLINDER_FORMULA,
      },
      {
        heading: "Che cosa fanno i controlli",
        paragraphs: [
          "I sei cursori dei parametri coprono a da 0,5 a 1,5, b da 0,3 a 1,2, c da 0,2 a 1,5, d da 2 a 6, e da 0,1 a 0,6 e f da 0 a 0,3. Cambiare un parametro non fa ripartire l'orbita: il punto prosegue semplicemente con le nuove regole, e tu vedi la vecchia forma dissolversi in quella nuova. Il cursore dt (da 0,005 a 0,02, predefinito 0,01) stabilisce l'ampiezza di ogni passo di integrazione.",
          "«Passi / frame» va da 200 a 6000 e parte da 2400. Trascina il canvas per ruotare la vista, disattiva la rotazione automatica per fermare il lento giro e usa «Cancella e riavvia» per ripulire il canvas e riportare il punto alla posizione iniziale (0,1; 0; 0). I pulsanti degli attrattori passano a Rössler, Thomas o Halvorsen con i loro parametri classici.",
        ],
      },
      {
        heading: "Com'è costruito",
        paragraphs: [
          "Tutto gira nel tuo browser su un canvas 2D. Come l'esploratore di Lorenz, integra con il metodo classico di Runge-Kutta del quarto ordine (RK4): quattro valutazioni della derivata per passo, combinate in modo che l'errore per passo si riduca con la quinta potenza di dt. Il più semplice metodo di Eulero esplicito (una valutazione, si moltiplica per dt, si somma) qui non era abbastanza accurato: con dt = 0,02 la sua orbita di Aizawa collassava su un punto fisso, e sul sistema di Halvorsen divergeva. Con RK4 la forma resta la stessa lungo tutto il cursore dt. Una protezione riporta comunque il punto in (0,1; 0; 0) ogni volta che una coordinata diventa NaN o infinita, così il canvas si riprende invece di restare vuoto.",
          "Ogni punto 3D diventa un pixel attraverso due rotazioni, prima attorno all'asse verticale (imbardata), poi attorno a quello orizzontale (beccheggio), seguite da una semplice proiezione ortografica. Un valore di profondità regola l'opacità di ogni punto, così il lato vicino appare più luminoso. La scia nasce dal fatto che a ogni fotogramma il colore di sfondo viene steso su tutto il canvas con il 4 % di opacità, per cui i punti vecchi svaniscono in circa un secondo. Se il tuo sistema chiede di ridurre il movimento, non c'è alcuna animazione: l'esploratore integra 24.000 passi in una volta, salta i primi 600 perché il transitorio non si veda, disegna un unico fotogramma fisso e lo ridisegna quando trascini o sposti un cursore.",
        ],
        code: RK4_EXCERPT,
      },
    ],
    experimentsHeading: "Prova così",
    experiments: [
      {
        title: "Spegni il caos con f",
        text: "Porta f fino a 0 e premi «Cancella e riavvia». Con la simmetria ripristinata, l'orbita non può più essere caotica e si assesta su una forma regolare, simmetrica per rotazione. Poi riporta f a 0,1.",
      },
      {
        title: "Sposta il piano di separazione",
        text: "Fai scorrere b tra 0,5 e 1,0. Poiché b è l'altezza a cui la deriva verso l'esterno diventa deriva verso l'interno, la forma si allunga e si schiaccia lungo l'asse verticale. Se l'orbita scappa, usa «Cancella e riavvia».",
      },
      {
        title: "Segui una singola orbita",
        text: "Disattiva la rotazione automatica e abbassa «Passi / frame» a 200. Ora puoi vedere il punto che gira a spirale attorno all'asse, risale il tubo centrale e ricade sul guscio.",
      },
      {
        title: "Fai visita ai parenti",
        text: "Passa a Rössler e abbassa c da 5,7 verso 2,5: la banda caotica si semplifica in sempre meno anelli. Poi prova Thomas con b vicino a 0,05, dove il punto vaga attraverso un intero reticolo di celle invece di restare in una sola.",
      },
    ],
  },
  pt: {
    metaDescription:
      "Roda o atrator de Aizawa em 3D, ajusta os seis parâmetros, de a a f, e compara-o com Rössler, Thomas e Halvorsen. Descobre porque é que f é a chave do caos.",
    heading: "Como funciona este explorador",
    intro:
      "A nuvem de pontos rosados é o percurso de um único ponto que se move pelo espaço tridimensional segundo as equações de Aizawa. Em cada fotograma avança alguns milhares de passos e deixa um ponto em cada um, enquanto os mais antigos se vão desvanecendo. O que se forma é uma casca quase esférica em torno de um eixo vertical, com um tubo fino que a atravessa pelo meio. O ponto nunca se repete e nunca sossega, mas também nunca abandona essa forma: é um atrator estranho.",
    sections: [
      {
        heading: "Seis parâmetros, três equações",
        paragraphs: [
          "O sistema tem três coordenadas e seis constantes. Os valores predefinidos são a = 0,95, b = 0,7, c = 0,6, d = 3,5, e = 0,25 e f = 0,1, os que costumam ser citados para este atrator, e o botão «Redefinir parâmetros» repõe exatamente esses valores. A terceira equação contém os termos não lineares, incluindo o pequeno termo adicional f z x³.",
        ],
        formula: AIZAWA_FORMULA,
      },
      {
        heading: "Ler as equações em coordenadas cilíndricas",
        paragraphs: [
          "As duas primeiras equações ficam muito mais claras se descreveres x e y através de um raio r e de um ângulo θ em torno do eixo z. Dizem então exatamente isto: o ponto roda em torno do eixo com velocidade angular constante d, e a sua distância ao eixo cresce enquanto z está acima de b e diminui enquanto z está abaixo de b. Ou seja, d é simplesmente a velocidade de rotação, e b é a altura de um plano horizontal invisível que separa o movimento para fora do movimento para dentro.",
          "Olha agora para a terceira equação com f = 0. Cada termo depende apenas de z e de x² + y² = r², não do ângulo. O sistema inteiro tem então simetria de rotação: o ângulo limita-se a avançar de modo uniforme, e a parte interessante reduz-se a duas variáveis, r e z. Um sistema suave a duas dimensões não pode ser caótico (é o que diz o teorema de Poincaré-Bendixson), portanto com f = 0 a órbita tem de assentar em algo regular, como um anel ou um toro liso. É o minúsculo termo f z x³ que quebra a simetria, porque x³ depende do ângulo. É a razão pela qual este atrator é caótico.",
        ],
        formula: CYLINDER_FORMULA,
      },
      {
        heading: "O que fazem os controlos",
        paragraphs: [
          "Os seis cursores de parâmetros cobrem a de 0,5 a 1,5, b de 0,3 a 1,2, c de 0,2 a 1,5, d de 2 a 6, e de 0,1 a 0,6 e f de 0 a 0,3. Alterar um parâmetro não reinicia a órbita: o ponto continua simplesmente segundo as novas regras, e tu vês a forma antiga dissolver-se na nova. O cursor dt (de 0,005 a 0,02, predefinido 0,01) define o tamanho de cada passo de integração.",
          "«Passos / fotograma» vai de 200 a 6000 e começa em 2400. Arrasta o canvas para rodar a vista, desliga a rotação automática para parar a rotação lenta e usa «Limpar e reiniciar» para apagar o canvas e mandar o ponto de volta à posição inicial (0,1; 0; 0). Os botões de atrator mudam para Rössler, Thomas ou Halvorsen com os seus próprios parâmetros clássicos.",
        ],
      },
      {
        heading: "Como está construído",
        paragraphs: [
          "Tudo corre no teu navegador, num canvas 2D. Tal como o explorador de Lorenz, integra com o método clássico de Runge-Kutta de quarta ordem (RK4): quatro avaliações da derivada por passo, combinadas de modo que o erro por passo diminui com a quinta potência de dt. O método de Euler explícito, mais simples (uma avaliação, multiplicar por dt, somar), não era suficientemente preciso aqui: com dt = 0,02 a sua órbita de Aizawa colapsava num ponto fixo, e no sistema de Halvorsen divergia. Com RK4 a forma mantém-se igual em todo o cursor dt. Ainda assim, uma salvaguarda volta a colocar o ponto em (0,1; 0; 0) sempre que uma coordenada se torna NaN ou infinita, para que o canvas recupere em vez de ficar vazio.",
          "Cada ponto 3D torna-se um píxel através de duas rotações, primeiro em torno do eixo vertical (guinada), depois em torno do horizontal (arfagem), seguidas de uma simples projeção ortográfica. Um valor de profundidade define a opacidade de cada ponto, pelo que o lado mais próximo parece mais brilhante. O rasto resulta de pintar a cor de fundo sobre todo o canvas com 4 % de opacidade em cada fotograma, e assim os pontos antigos desaparecem em cerca de um segundo. Se o teu sistema pedir movimento reduzido, não há qualquer animação: o explorador integra 24\u00a0000 passos de uma vez, salta os primeiros 600 para que o regime transitório não se veja, desenha um único fotograma fixo e volta a desenhá-lo quando arrastas ou moves um cursor.",
        ],
        code: RK4_EXCERPT,
      },
    ],
    experimentsHeading: "Experimenta isto",
    experiments: [
      {
        title: "Desliga o caos com f",
        text: "Leva f até 0 e carrega em «Limpar e reiniciar». Com a simetria reposta, a órbita já não pode ser caótica e assenta numa forma regular, com simetria de rotação. Depois volta a subir f para 0,1.",
      },
      {
        title: "Desloca o plano divisor",
        text: "Desliza b entre 0,5 e 1,0. Como b é a altura a que a deriva para fora se transforma em deriva para dentro, a forma estica-se e comprime-se ao longo do eixo vertical. Se a órbita escapar, usa «Limpar e reiniciar».",
      },
      {
        title: "Segue uma única órbita",
        text: "Desliga a rotação automática e baixa «Passos / fotograma» para 200. Agora consegues ver o ponto a espiralar em torno do eixo, a subir pelo tubo central e a cair de novo sobre a casca.",
      },
      {
        title: "Visita os parentes",
        text: "Muda para Rössler e baixa c de 5,7 em direção a 2,5: a faixa caótica simplifica-se em cada vez menos laços. Depois experimenta Thomas com b perto de 0,05, onde o ponto vagueia por toda uma rede de células em vez de ficar numa só.",
      },
    ],
  },
  sv: {
    metaDescription:
      "Rotera Aizawa-attraktorn i 3D, justera alla sex parametrar a till f och jämför med Rössler, Thomas och Halvorsen. Se varför f är nyckeln till dess kaos.",
    heading: "Så fungerar den här utforskaren",
    intro:
      "Molnet av rosa prickar är banan för en enda punkt som rör sig genom det tredimensionella rummet enligt Aizawas ekvationer. I varje bildruta går den några tusen steg framåt och lämnar en prick vid varje steg, medan äldre prickar bleknar. Det som växer fram är ett klotliknande skal kring en lodrät axel, med ett tunt rör som löper upp genom mitten. Punkten upprepar sig aldrig och kommer aldrig till ro, men den lämnar heller aldrig den formen: en sällsam attraktor.",
    sections: [
      {
        heading: "Sex parametrar, tre ekvationer",
        paragraphs: [
          "Systemet har tre koordinater och sex konstanter. Standardvärdena är a = 0,95; b = 0,7; c = 0,6; d = 3,5; e = 0,25 och f = 0,1, de värden som brukar anges för den här attraktorn, och återställningsknappen går tillbaka till exakt dem. Den tredje ekvationen innehåller de ickelinjära termerna, bland annat den lilla extra termen f z x³.",
        ],
        formula: AIZAWA_FORMULA,
      },
      {
        heading: "Ekvationerna i cylinderkoordinater",
        paragraphs: [
          "De två första ekvationerna blir mycket tydligare om du beskriver x och y med en radie r och en vinkel θ kring z-axeln. Då säger de precis detta: punkten snurrar kring axeln med konstant vinkelhastighet d, och dess avstånd till axeln växer så länge z ligger över b och krymper så länge z ligger under b. Alltså är d helt enkelt rotationshastigheten, och b är höjden på ett osynligt vågrätt plan som skiljer rörelse utåt från rörelse inåt.",
          "Titta nu på den tredje ekvationen med f = 0. Varje term beror bara på z och på x² + y² = r², inte på vinkeln. Hela systemet är då rotationssymmetriskt: vinkeln vrids bara jämnt vidare, och den intressanta delen krymper till två variabler, r och z. Ett slätt tvådimensionellt system kan inte vara kaotiskt (det är Poincaré-Bendixsons sats), så med f = 0 måste banan slå sig till ro på något regelbundet, till exempel en ring eller en slät torus. Det är den pyttelilla termen f z x³ som bryter symmetrin, eftersom x³ beror på vinkeln. Den är skälet till att attraktorn över huvud taget är kaotisk.",
        ],
        formula: CYLINDER_FORMULA,
      },
      {
        heading: "Vad reglagen gör",
        paragraphs: [
          "De sex parameterreglagen täcker a från 0,5 till 1,5; b från 0,3 till 1,2; c från 0,2 till 1,5; d från 2 till 6; e från 0,1 till 0,6 och f från 0 till 0,3. Att ändra en parameter startar inte om banan: punkten fortsätter bara enligt de nya reglerna, och du ser den gamla formen lösas upp i den nya. Reglaget dt (0,005 till 0,02, standard 0,01) bestämmer storleken på varje integrationssteg.",
          "”Steg / bildruta” går från 200 till 6000 och börjar på 2400. Dra i ritytan för att rotera vyn, slå av autorotationen för att stoppa det långsamma snurrandet och använd ”Rensa och starta om” för att tömma ritytan och skicka tillbaka punkten till startpositionen (0,1; 0; 0). Attraktorknapparna byter till Rössler, Thomas eller Halvorsen med sina egna klassiska parametrar.",
        ],
      },
      {
        heading: "Hur den är byggd",
        paragraphs: [
          "Allt körs i din webbläsare på en 2D-canvas. Precis som Lorenz-utforskaren integrerar den med den klassiska Runge-Kutta-metoden av fjärde ordningen (RK4): fyra beräkningar av derivatan per steg, kombinerade så att felet per steg krymper med femte potensen av dt. Den enklare explicita Eulermetoden (en beräkning, multiplicera med dt, addera) var inte tillräckligt noggrann här: vid dt = 0,02 föll dess Aizawa-bana ihop till en fixpunkt, och på Halvorsen-systemet skenade den iväg. Med RK4 förblir formen densamma över hela dt-reglaget. Ett skydd sätter ändå tillbaka punkten på (0,1; 0; 0) så fort en koordinat blir NaN eller oändlig, så att ritytan hämtar sig i stället för att bli tom.",
          "Varje 3D-punkt blir en pixel genom två rotationer, först kring den lodräta axeln (girning), sedan kring den vågräta (tippning), följt av en vanlig ortografisk projektion. Ett djupvärde bestämmer varje pricks opacitet, så att den närmaste sidan ser ljusare ut. Spåret uppstår genom att bakgrundsfärgen målas över hela ritytan med 4 % opacitet i varje bildruta, så att gamla prickar tonar bort på ungefär en sekund. Om ditt system ber om minskad rörelse finns ingen animation alls: utforskaren integrerar 24\u00a0000 steg på en gång, hoppar över de första 600 så att insvängningsförloppet inte syns, ritar en enda fryst bild och ritar om den när du drar eller flyttar ett reglage.",
        ],
        code: RK4_EXCERPT,
      },
    ],
    experimentsHeading: "Prova det här",
    experiments: [
      {
        title: "Stäng av kaoset med f",
        text: "Dra ner f hela vägen till 0 och tryck på ”Rensa och starta om”. När symmetrin är återställd kan banan inte längre vara kaotisk, och den lägger sig på en regelbunden, rotationssymmetrisk form. Höj sedan f till 0,1 igen.",
      },
      {
        title: "Flytta skiljeplanet",
        text: "Dra b mellan 0,5 och 1,0. Eftersom b är höjden där driften utåt övergår i drift inåt sträcks och trycks formen ihop längs den lodräta axeln. Om banan sticker iväg använder du ”Rensa och starta om”.",
      },
      {
        title: "Följ en enda bana",
        text: "Slå av autorotationen och sänk ”Steg / bildruta” till 200. Nu kan du se hur punkten går i spiral kring axeln, klättrar uppför det centrala röret och faller tillbaka på skalet.",
      },
      {
        title: "Hälsa på släktingarna",
        text: "Byt till Rössler och sänk c från 5,7 mot 2,5: det kaotiska bandet förenklas till allt färre öglor. Prova sedan Thomas med b nära 0,05, där punkten vandrar genom ett helt gitter av celler i stället för att stanna i en enda.",
      },
    ],
  },
  no: {
    metaDescription:
      "Roter Aizawa-attraktoren i 3D, juster alle seks parametere fra a til f og sammenlign med Rössler, Thomas og Halvorsen. Se hvorfor f er nøkkelen til kaoset.",
    heading: "Slik fungerer denne utforskeren",
    intro:
      "Skyen av rosa prikker er banen til ett enkelt punkt som beveger seg gjennom det tredimensjonale rommet etter Aizawa-ligningene. I hvert bilde går det noen tusen steg framover og legger igjen en prikk ved hvert steg, mens eldre prikker blekner. Det som bygger seg opp, er et kulelignende skall rundt en loddrett akse, med et tynt rør som går opp gjennom midten. Punktet gjentar seg aldri og faller aldri til ro, men det forlater heller aldri denne formen: en merkelig attraktor.",
    sections: [
      {
        heading: "Seks parametere, tre ligninger",
        paragraphs: [
          "Systemet har tre koordinater og seks konstanter. Standardverdiene er a = 0,95, b = 0,7, c = 0,6, d = 3,5, e = 0,25 og f = 0,1, verdiene som vanligvis oppgis for denne attraktoren, og nullstillingsknappen går tilbake til nettopp disse. Den tredje ligningen inneholder de ikke-lineære leddene, blant dem det lille ekstraleddet f z x³.",
        ],
        formula: AIZAWA_FORMULA,
      },
      {
        heading: "Ligningene i sylinderkoordinater",
        paragraphs: [
          "De to første ligningene blir mye klarere hvis du beskriver x og y med en radius r og en vinkel θ rundt z-aksen. Da sier de akkurat dette: Punktet dreier rundt aksen med konstant vinkelhastighet d, og avstanden til aksen vokser så lenge z ligger over b, og krymper så lenge z ligger under b. Altså er d rett og slett rotasjonshastigheten, og b er høyden til et usynlig vannrett plan som skiller bevegelse utover fra bevegelse innover.",
          "Se nå på den tredje ligningen med f = 0. Hvert ledd avhenger bare av z og av x² + y² = r², ikke av vinkelen. Hele systemet er da rotasjonssymmetrisk: Vinkelen dreier bare jevnt videre, og den interessante delen krymper til to variabler, r og z. Et glatt todimensjonalt system kan ikke være kaotisk (det er Poincaré-Bendixsons teorem), så med f = 0 må banen falle til ro på noe regelmessig, som en ring eller en glatt torus. Det er det bitte lille leddet f z x³ som bryter symmetrien, fordi x³ avhenger av vinkelen. Det er grunnen til at denne attraktoren i det hele tatt er kaotisk.",
        ],
        formula: CYLINDER_FORMULA,
      },
      {
        heading: "Hva kontrollene gjør",
        paragraphs: [
          "De seks parameterglidebryterne dekker a fra 0,5 til 1,5, b fra 0,3 til 1,2, c fra 0,2 til 1,5, d fra 2 til 6, e fra 0,1 til 0,6 og f fra 0 til 0,3. Å endre en parameter starter ikke banen på nytt: Punktet fortsetter bare etter de nye reglene, og du ser den gamle formen løse seg opp i den nye. Glidebryteren dt (0,005 til 0,02, standard 0,01) bestemmer størrelsen på hvert integrasjonssteg.",
          "«Steg / bilde» går fra 200 til 6000 og starter på 2400. Dra i lerretet for å rotere visningen, slå av autorotasjonen for å stoppe den langsomme dreiningen, og bruk «Tøm og start på nytt» for å tømme lerretet og sende punktet tilbake til startposisjonen (0,1; 0; 0). Attraktorknappene bytter til Rössler, Thomas eller Halvorsen med sine egne klassiske parametere.",
        ],
      },
      {
        heading: "Slik er den bygget",
        paragraphs: [
          "Alt kjører i nettleseren din på et 2D-lerret. I likhet med Lorenz-utforskeren integrerer den med den klassiske Runge-Kutta-metoden av fjerde orden (RK4): fire beregninger av den deriverte per steg, kombinert slik at feilen per steg krymper med femte potens av dt. Den enklere eksplisitte Euler-metoden (én beregning, gang med dt, legg til) var ikke nøyaktig nok her: Ved dt = 0,02 falt Aizawa-banen sammen til et fikspunkt, og på Halvorsen-systemet løp den løpsk. Med RK4 holder formen seg lik over hele dt-glidebryteren. En sikring setter likevel punktet tilbake til (0,1; 0; 0) hver gang en koordinat blir NaN eller uendelig, slik at lerretet henter seg inn i stedet for å bli tomt.",
          "Hvert 3D-punkt blir til en piksel gjennom to rotasjoner, først rundt den loddrette aksen (giring), så rundt den vannrette (stamping), fulgt av en enkel ortografisk projeksjon. En dybdeverdi bestemmer opasiteten til hver prikk, slik at den nærmeste siden ser lysere ut. Sporet kommer av at bakgrunnsfargen males over hele lerretet med 4 % opasitet i hvert bilde, slik at gamle prikker toner ut i løpet av omtrent ett sekund. Hvis systemet ditt ber om redusert bevegelse, er det ingen animasjon i det hele tatt: Utforskeren integrerer 24\u00a0000 steg på én gang, hopper over de første 600 slik at innsvingningsforløpet ikke vises, tegner ett enkelt fryst bilde og tegner det på nytt når du drar eller flytter en glidebryter.",
        ],
        code: RK4_EXCERPT,
      },
    ],
    experimentsHeading: "Prøv dette",
    experiments: [
      {
        title: "Slå av kaoset med f",
        text: "Dra f helt ned til 0 og trykk på «Tøm og start på nytt». Når symmetrien er gjenopprettet, kan banen ikke lenger være kaotisk, og den faller til ro på en regelmessig, rotasjonssymmetrisk form. Øk deretter f tilbake til 0,1.",
      },
      {
        title: "Flytt skilleplanet",
        text: "Skyv b mellom 0,5 og 1,0. Siden b er høyden der driften utover går over i drift innover, strekkes og klemmes formen langs den loddrette aksen. Hvis banen stikker av, bruker du «Tøm og start på nytt».",
      },
      {
        title: "Følg én enkelt bane",
        text: "Slå av autorotasjonen og senk «Steg / bilde» til 200. Nå kan du se punktet gå i spiral rundt aksen, klatre opp det sentrale røret og falle tilbake på skallet.",
      },
      {
        title: "Besøk slektningene",
        text: "Bytt til Rössler og senk c fra 5,7 mot 2,5: Det kaotiske båndet forenkles til stadig færre sløyfer. Prøv så Thomas med b nær 0,05, der punktet vandrer gjennom et helt gitter av celler i stedet for å bli i én.",
      },
    ],
  },
};
