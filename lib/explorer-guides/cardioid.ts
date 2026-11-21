import type { ExplorerGuide } from "./types";

// Numbers quoted here (ray slider 20 to 300, default 120, 40 iterations,
// 0.012 rad per frame, the 1/2 and 1/4 coefficients) match
// app/cardioid/explorer/page.tsx; update both together.
const REFLECT_EXCERPT = `// Rays enter from the right and hit the far (left) wall
const phi = Math.PI / 2 + (i / cfg.rayCount) * Math.PI;
const px = cx + R * Math.cos(phi);
const py = cy + R * Math.sin(phi);
ctx.moveTo(W + 100, py);
ctx.lineTo(px, py);

// Mirror the direction d = (-1, 0) in the inward normal n
const nx = -Math.cos(phi);
const ny = -Math.sin(phi);
const dn = -1 * nx + 0 * ny;
const rx = -1 - 2 * dn * nx;   // r = d - 2(d·n)n
const ry = 0 - 2 * dn * ny;
ctx.lineTo(px + rx * R * 2.5, py + ry * R * 2.5);`;

const BULB_FORMULA = "c(t) = \\tfrac12 e^{it} - \\tfrac14 e^{2it}, \\qquad 0 \\le t < 2\\pi";

export const CARDIOID_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Explore the cardioid three ways: light reflected in a coffee cup, a circle rolling around a circle, and the main bulb of the Mandelbrot set, with the maths.",
    heading: "How this explorer works",
    intro:
      "The cardioid is the heart-shaped curve with a single cusp. It turns up in surprisingly unrelated places: in the bright pattern light draws on the surface of a cup, in the path of a point on a wheel rolling around another wheel, and as the largest region of the Mandelbrot set. The three buttons on the right switch between these scenes, each built from a different construction.",
    sections: [
      {
        heading: "One curve, three constructions",
        paragraphs: [
          "In polar coordinates, with the cusp at the origin, the cardioid is r = 2a(1 − cos θ). The Rolling circle view builds it mechanically: a fixed circle of radius a sits in the middle, a second circle of the same radius rolls around its outside without slipping, and a point marked on the rolling circle traces the curve. Because both radii are equal, the point touches the fixed circle exactly once per lap, and that touch is the cusp.",
          "As a parametrised curve the rolling construction gives x = 2a cos t − a cos 2t and y = 2a sin t − a sin 2t. The Mandelbrot boundary is the same expression with a = 1/4 in complex form, which is why the amber outline in the third view sits exactly on the edge of the set.",
        ],
        formula: BULB_FORMULA,
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "Coffee cup draws a circular mirror (the cup wall seen from above) and sends parallel rays in from the right. The Rays slider sets how many, from 20 to 300 in steps of 2, starting at 120. Each ray reflects off the far wall, and where reflected rays crowd together they form a bright envelope called a caustic. Show rays and Show envelope toggle the two layers independently.",
          "There is an honest twist, and the panel says so: for parallel light such as sunlight, the envelope is not a cardioid but a nephroid, a related curve with two cusps. The page draws the full nephroid; the half on the far side is the caustic of these rays, the mirror half belongs to light from the left. A true cardioid appears when the light source sits on the rim of the cup. Both curves are epicycloids, which is why the bright line in a real mug often looks heart-like.",
          "Rolling circle animates the construction and has one button, Pause or Roll. Mandelbrot bulb shows the set with the exact cardioid laid on top.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "Everything is drawn on one 2D canvas scaled to your screen's pixel density. For the cup, each ray is placed at an angle φ on the far half of the circle and reflected with the mirror formula r = d − 2(d·n)n, where d is the incoming direction and n the inward normal. Rays that would only graze the wall are skipped. The envelope is drawn from the nephroid's own equation, not computed from the rays, and you can see the rays pile up along it.",
          "The rolling view advances its parameter by 0.012 radians per frame, so one lap takes a little over 500 frames, about nine seconds at 60 Hz. The Mandelbrot view runs the escape-time algorithm per pixel: iterate z ↦ z² + c from z = 0 for up to 40 steps, stopping once |z| exceeds 2. Pixels that never escape are near-black, the rest shaded violet by how fast they left. Those pixels are cached and only recomputed when the canvas changes size.",
          "The still views only repaint when an input changes. If your system asks for reduced motion, the rolling circle is frozen in a single static frame.",
        ],
        code: REFLECT_EXCERPT,
      },
      {
        heading: "Why the Mandelbrot set has a cardioid",
        paragraphs: [
          "The main body of the Mandelbrot set is exactly the set of c for which z ↦ z² + c has an attracting fixed point. A fixed point satisfies z = z² + c and attracts when the derivative 2z has modulus below 1. Write 2z = μ with |μ| < 1; then c = μ/2 − μ²/4, and letting μ run around the unit circle traces precisely the formula above. At the cusp, c = 1/4, the multiplier is exactly 1 and the two fixed points merge. Touching the cardioid at c = −3/4 sits a perfect disc of radius 1/4 centred at −1: the parameters with an attracting cycle of period 2.",
        ],
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "Let the caustic appear from nothing",
        text: "In Coffee cup, untick Show envelope and set Rays to 20. Then drag slowly up to 300: the crossings condense into a bright curve with a sharp point halfway between wall and centre, although the curve itself is not drawn.",
      },
      {
        title: "Catch the cusp",
        text: "Open Rolling circle and pause when the cyan dot reaches the point where the circles touch. There the dot is momentarily at rest, which is why the curve has a cusp instead of a smooth turn.",
      },
      {
        title: "Find the edge of stability",
        text: "In Mandelbrot bulb, follow the amber line: inside it every orbit settles on a single point. On the left it touches the round bulb at c = −3/4, where the fixed point gives way to a cycle of period 2.",
      },
      {
        title: "Compare the two hearts",
        text: "Flip between Rolling circle and Mandelbrot bulb. The amber curves are the same shape at different scales: the Mandelbrot outline is the rolling cardioid with a = 1/4, cusp on the right in both.",
      },
    ],
  },
  de: {
    metaDescription:
      "Die Kardioide auf drei Wegen erkunden: als Lichtspiegelung in der Kaffeetasse, als Bahn eines rollenden Kreises und als Hauptkörper der Mandelbrot-Menge.",
    heading: "So funktioniert dieser Explorer",
    intro:
      "Die Kardioide ist die herzförmige Kurve mit einer einzigen Spitze. Sie taucht an erstaunlich verschiedenen Stellen auf: im hellen Muster, das Licht auf die Oberfläche einer Tasse zeichnet, in der Bahn eines Punkts auf einem Rad, das um ein anderes Rad rollt, und als größtes Gebiet der Mandelbrot-Menge. Mit den drei Knöpfen rechts wechselst du zwischen diesen Szenen, jede aus einer anderen Konstruktion gebaut.",
    sections: [
      {
        heading: "Eine Kurve, drei Konstruktionen",
        paragraphs: [
          "In Polarkoordinaten, mit der Spitze im Ursprung, lautet die Kardioide r = 2a(1 − cos θ). Die Ansicht «Rollender Kreis» baut sie mechanisch: In der Mitte liegt ein fester Kreis mit Radius a, ein zweiter Kreis mit gleichem Radius rollt außen ohne Rutschen um ihn herum, und ein markierter Punkt auf dem rollenden Kreis zeichnet die Kurve. Weil beide Radien gleich sind, berührt der Punkt den festen Kreis genau einmal pro Runde. Diese Berührung ist die Spitze.",
          "Als parametrisierte Kurve ergibt die Rollkonstruktion x = 2a cos t − a cos 2t und y = 2a sin t − a sin 2t. Der Rand der Mandelbrot-Menge verwendet denselben Ausdruck mit a = 1/4 in komplexer Schreibweise. Deshalb liegt die bernsteinfarbene Linie in der dritten Ansicht exakt auf dem Rand der Menge.",
        ],
        formula: BULB_FORMULA,
      },
      {
        heading: "Was die Regler bewirken",
        paragraphs: [
          "«Kaffeetasse» zeichnet einen kreisförmigen Spiegel (die Tassenwand von oben gesehen) und schickt parallele Lichtstrahlen von rechts hinein. Der Regler «Strahlen» legt fest, wie viele gezeichnet werden, von 20 bis 300 in Zweierschritten, Startwert 120. Jeder Strahl wird an der gegenüberliegenden Wand reflektiert, und wo sich reflektierte Strahlen drängen, entsteht eine helle Hüllkurve, eine sogenannte Kaustik. «Strahlen zeigen» und «Hüllkurve zeigen» schalten die beiden Ebenen unabhängig voneinander.",
          "Es gibt eine ehrliche Wendung, und das Panel sagt sie auch: Bei parallelem Licht wie Sonnenlicht ist die Hüllkurve keine Kardioide, sondern eine Nephroide, eine verwandte Kurve mit zwei Spitzen. Gezeichnet wird die vollständige Nephroide; die Hälfte auf der abgewandten Seite ist die Kaustik dieser Strahlen, die gespiegelte Hälfte gehört zu Licht von links. Eine echte Kardioide bekommst du erst, wenn die Lichtquelle direkt auf dem Tassenrand sitzt. Beide Kurven sind Epizykloiden, darum wirkt die helle Linie in einem echten Becher oft herzförmig.",
          "«Rollender Kreis» animiert die Konstruktion und hat einen einzigen Knopf zum Pausieren und Weiterrollen. «Mandelbrot-Knospe» zeigt die Menge mit der exakten Kardioide darübergelegt.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Alles entsteht auf einem einzigen 2D-Canvas, das an die Pixeldichte deines Bildschirms angepasst ist. Für die Tasse wird jeder Strahl über einen Winkel φ auf der abgewandten Kreishälfte platziert und mit der Spiegelformel r = d − 2(d·n)n reflektiert, wobei d die Einfallsrichtung und n die nach innen zeigende Normale ist. Strahlen, die die Wand nur streifen würden, werden übersprungen. Die Hüllkurve wird aus der Gleichung der Nephroide gezeichnet, nicht aus den Strahlen berechnet, und man sieht, wie sich die Strahlen dort stapeln.",
          "Die Rollansicht erhöht ihren Parameter um 0,012 Radiant pro Frame. Eine Runde dauert also gut 500 Frames, etwa neun Sekunden auf einem 60-Hz-Bildschirm. Die Mandelbrot-Ansicht rechnet für jedes Pixel den Escape-Time-Algorithmus: z ↦ z² + c ab z = 0 bis zu 40 Mal iterieren und abbrechen, sobald |z| größer als 2 wird. Pixel, die nie entkommen, werden fast schwarz, die übrigen violett schattiert, je nachdem wie schnell sie davonliefen. Diese Pixel werden zwischengespeichert und nur neu berechnet, wenn sich die Größe der Zeichenfläche ändert.",
          "Die ruhenden Ansichten zeichnen nur neu, wenn sich eine Eingabe ändert. Wünscht dein System reduzierte Bewegung, bleibt der rollende Kreis in einem einzigen Standbild stehen.",
        ],
        code: REFLECT_EXCERPT,
      },
      {
        heading: "Warum die Mandelbrot-Menge eine Kardioide enthält",
        paragraphs: [
          "Der Hauptkörper der Mandelbrot-Menge ist genau die Menge der Parameter c, für die z ↦ z² + c einen anziehenden Fixpunkt hat. Ein Fixpunkt erfüllt z = z² + c, und er zieht an, wenn die Ableitung 2z einen Betrag kleiner als 1 hat. Schreib 2z = μ mit |μ| < 1, dann ist c = μ/2 − μ²/4. Lässt du μ um den Einheitskreis laufen, entsteht genau die Formel oben. An der Spitze, c = 1/4, ist der Multiplikator genau 1, und die beiden Fixpunkte verschmelzen. Bei c = −3/4 berührt die Kardioide eine exakte Kreisscheibe mit Radius 1/4 um −1: die Parameter mit einem anziehenden Zyklus der Periode 2.",
        ],
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Die Kaustik aus dem Nichts entstehen lassen",
        text: "Schalte bei «Kaffeetasse» «Hüllkurve zeigen» aus und stell «Strahlen» auf 20. Zieh dann langsam bis 300: Die Kreuzungen verdichten sich zu einer hellen Kurve mit scharfer Spitze auf halbem Weg zwischen Wand und Mitte, obwohl die Kurve selbst nicht gezeichnet wird.",
      },
      {
        title: "Die Spitze erwischen",
        text: "Öffne «Rollender Kreis» und pausiere, wenn der cyanfarbene Punkt die Stelle erreicht, an der sich die beiden Kreise berühren. In diesem Moment steht der Punkt kurz still, und genau deshalb hat die Kurve dort eine scharfe Spitze statt einer runden Wende.",
      },
      {
        title: "Die Stabilitätsgrenze finden",
        text: "Wechsle zu «Mandelbrot-Knospe» und folge der bernsteinfarbenen Linie. Innerhalb davon kommt jede Bahn in einem einzigen Punkt zur Ruhe. Schau nach links, wo die Linie an die runde Knospe stößt: Dieser Berührpunkt ist c = −3/4, wo der Fixpunkt einem Zyklus der Periode 2 Platz macht.",
      },
      {
        title: "Die beiden Herzen vergleichen",
        text: "Wechsle zwischen «Rollender Kreis» und «Mandelbrot-Knospe». Die bernsteinfarbenen Kurven haben dieselbe Form in unterschiedlicher Größe: Der Mandelbrot-Umriss ist die Rollkreis-Kardioide mit a = 1/4, und in beiden Ansichten sitzt die Spitze rechts.",
      },
    ],
  },
  es: {
    metaDescription:
      "Explora la cardioide de tres maneras: la luz reflejada en una taza de café, un círculo que rueda sobre otro y el bulbo principal del conjunto de Mandelbrot.",
    heading: "Cómo funciona este explorador",
    intro:
      "La cardioide es la curva con forma de corazón y una sola cúspide. Aparece en lugares sorprendentemente distintos: en el dibujo brillante que la luz traza sobre la superficie de una taza, en la trayectoria de un punto de una rueda que gira alrededor de otra y como la región más grande del conjunto de Mandelbrot. Los tres botones de la derecha cambian entre estas escenas, cada una construida de una manera diferente.",
    sections: [
      {
        heading: "Una curva, tres construcciones",
        paragraphs: [
          "En coordenadas polares, con la cúspide en el origen, la cardioide es r = 2a(1 − cos θ). La vista «Rolling circle» la construye de forma mecánica: en el centro hay un círculo fijo de radio a, un segundo círculo del mismo radio rueda por fuera sin deslizar y un punto marcado en el círculo que rueda traza la curva. Como los dos radios son iguales, el punto toca el círculo fijo exactamente una vez por vuelta, y ese contacto es la cúspide.",
          "Como curva parametrizada, la construcción por rodadura da x = 2a cos t − a cos 2t e y = 2a sin t − a sin 2t. El borde del conjunto de Mandelbrot es la misma expresión con a = 1/4 en forma compleja, y por eso el contorno ámbar de la tercera vista cae exactamente sobre el borde del conjunto.",
        ],
        formula: BULB_FORMULA,
      },
      {
        heading: "Qué hacen los controles",
        paragraphs: [
          "«Coffee cup» dibuja un espejo circular (la pared de la taza vista desde arriba) y lanza rayos paralelos desde la derecha. El deslizador «Rays» fija cuántos, de 20 a 300 en pasos de 2, empezando en 120. Cada rayo se refleja en la pared del fondo, y allí donde los rayos reflejados se amontonan forman una envolvente brillante llamada cáustica. «Show rays» y «Show envelope» activan o desactivan las dos capas por separado.",
          "Hay un giro que conviene decir con honestidad, y el panel lo dice: con luz paralela, como la del sol, la envolvente no es una cardioide sino una nefroide, una curva emparentada con dos cúspides. La página dibuja la nefroide completa; la mitad del lado del fondo es la cáustica de estos rayos, la mitad simétrica corresponde a luz que llega desde la izquierda. Una cardioide auténtica aparece cuando la fuente de luz está en el borde de la taza. Ambas curvas son epicicloides, y por eso la línea brillante de una taza real suele parecer un corazón.",
          "«Rolling circle» anima la construcción y tiene un solo botón, «Pause» o «Roll». «Mandelbrot bulb» muestra el conjunto con la cardioide exacta superpuesta.",
        ],
      },
      {
        heading: "Cómo está construido",
        paragraphs: [
          "Todo se dibuja en un único lienzo 2D ajustado a la densidad de píxeles de tu pantalla. Para la taza, cada rayo se coloca en un ángulo φ sobre la mitad del fondo del círculo y se refleja con la fórmula del espejo r = d − 2(d·n)n, donde d es la dirección de llegada y n la normal hacia dentro. Los rayos que solo rozarían la pared se omiten. La envolvente se dibuja a partir de la ecuación de la propia nefroide, no se calcula a partir de los rayos, y puedes ver cómo los rayos se acumulan a lo largo de ella.",
          "La vista de rodadura avanza su parámetro 0,012 radianes por fotograma, así que una vuelta dura algo más de 500 fotogramas, unos nueve segundos a 60 Hz. La vista de Mandelbrot ejecuta el algoritmo de tiempo de escape en cada píxel: itera z ↦ z² + c desde z = 0 hasta 40 pasos y se detiene en cuanto |z| supera 2. Los píxeles que nunca escapan quedan casi negros, el resto se tiñe de violeta según lo rápido que se fueron. Esos píxeles se guardan en caché y solo se recalculan cuando el lienzo cambia de tamaño.",
          "Las vistas fijas solo se repintan cuando cambia alguna entrada. Si tu sistema pide movimiento reducido, el círculo rodante queda congelado en un único fotograma estático.",
        ],
        code: REFLECT_EXCERPT,
      },
      {
        heading: "Por qué el conjunto de Mandelbrot tiene una cardioide",
        paragraphs: [
          "El cuerpo principal del conjunto de Mandelbrot es exactamente el conjunto de los c para los que z ↦ z² + c tiene un punto fijo atractor. Un punto fijo cumple z = z² + c y atrae cuando la derivada 2z tiene módulo menor que 1. Escribe 2z = μ con |μ| < 1; entonces c = μ/2 − μ²/4, y al hacer que μ recorra la circunferencia unidad se traza precisamente la fórmula de arriba. En la cúspide, c = 1/4, el multiplicador vale exactamente 1 y los dos puntos fijos se funden. Tocando la cardioide en c = −3/4 hay un disco perfecto de radio 1/4 centrado en −1: los parámetros con un ciclo atractor de periodo 2.",
        ],
      },
    ],
    experimentsHeading: "Prueba esto",
    experiments: [
      {
        title: "Haz que la cáustica surja de la nada",
        text: "En «Coffee cup», desmarca «Show envelope» y pon «Rays» en 20. Luego arrastra despacio hasta 300: los cruces se condensan en una curva brillante con una punta afilada a medio camino entre la pared y el centro, aunque la curva en sí no esté dibujada.",
      },
      {
        title: "Atrapa la cúspide",
        text: "Abre «Rolling circle» y pausa cuando el punto cian llegue al lugar donde los círculos se tocan. Ahí el punto está en reposo por un instante, y por eso la curva tiene una cúspide en lugar de un giro suave.",
      },
      {
        title: "Encuentra el límite de la estabilidad",
        text: "En «Mandelbrot bulb», sigue la línea ámbar: dentro de ella toda órbita acaba en un único punto. A la izquierda toca el bulbo redondo en c = −3/4, donde el punto fijo deja paso a un ciclo de periodo 2.",
      },
      {
        title: "Compara los dos corazones",
        text: "Alterna entre «Rolling circle» y «Mandelbrot bulb». Las curvas ámbar tienen la misma forma a escalas distintas: el contorno de Mandelbrot es la cardioide de rodadura con a = 1/4, con la cúspide a la derecha en ambas.",
      },
    ],
  },
  fr: {
    metaDescription:
      "Explore la cardioïde de trois façons : la lumière réfléchie dans une tasse de café, un cercle qui roule sur un autre et le bulbe principal de Mandelbrot.",
    heading: "Comment fonctionne cet explorateur",
    intro:
      "La cardioïde est la courbe en forme de cœur qui n'a qu'un seul point de rebroussement. Elle surgit dans des endroits étonnamment éloignés les uns des autres : dans le motif lumineux que la lumière dessine à la surface d'une tasse, dans la trajectoire d'un point d'une roue qui roule autour d'une autre, et comme la plus grande région de l'ensemble de Mandelbrot. Les trois boutons à droite permettent de passer d'une scène à l'autre, chacune reposant sur une construction différente.",
    sections: [
      {
        heading: "Une courbe, trois constructions",
        paragraphs: [
          "En coordonnées polaires, avec le point de rebroussement à l'origine, la cardioïde s'écrit r = 2a(1 − cos θ). La vue « Rolling circle » la construit mécaniquement : un cercle fixe de rayon a se trouve au centre, un second cercle de même rayon roule sans glisser sur son pourtour, et un point marqué sur le cercle qui roule trace la courbe. Comme les deux rayons sont égaux, le point touche le cercle fixe exactement une fois par tour, et ce contact est le point de rebroussement.",
          "Comme courbe paramétrée, la construction par roulement donne x = 2a cos t − a cos 2t et y = 2a sin t − a sin 2t. La frontière de l'ensemble de Mandelbrot est la même expression avec a = 1/4 sous forme complexe, et c'est pourquoi le contour ambre de la troisième vue se pose exactement sur le bord de l'ensemble.",
        ],
        formula: BULB_FORMULA,
      },
      {
        heading: "À quoi servent les commandes",
        paragraphs: [
          "« Coffee cup » dessine un miroir circulaire (la paroi de la tasse vue du dessus) et y envoie des rayons parallèles depuis la droite. Le curseur « Rays » règle leur nombre, de 20 à 300 par pas de 2, avec 120 au départ. Chaque rayon se réfléchit sur la paroi du fond, et là où les rayons réfléchis se resserrent, ils forment une enveloppe lumineuse appelée caustique. « Show rays » et « Show envelope » affichent ou masquent les deux couches indépendamment.",
          "Il y a une nuance qu'il faut avouer, et le panneau le fait : pour une lumière parallèle comme celle du soleil, l'enveloppe n'est pas une cardioïde mais une néphroïde, une courbe apparentée à deux points de rebroussement. La page dessine la néphroïde entière ; la moitié du côté du fond est la caustique de ces rayons, la moitié symétrique correspond à une lumière venant de la gauche. Une vraie cardioïde apparaît quand la source lumineuse se trouve sur le bord de la tasse. Les deux courbes sont des épicycloïdes, et c'est pourquoi la ligne brillante au fond d'un vrai mug ressemble souvent à un cœur.",
          "« Rolling circle » anime la construction et n'a qu'un bouton, « Pause » ou « Roll ». « Mandelbrot bulb » montre l'ensemble avec la cardioïde exacte posée par-dessus.",
        ],
      },
      {
        heading: "Comment c'est construit",
        paragraphs: [
          "Tout est dessiné sur un seul canevas 2D adapté à la densité de pixels de ton écran. Pour la tasse, chaque rayon est placé à un angle φ sur la moitié du cercle située au fond, puis réfléchi avec la formule du miroir r = d − 2(d·n)n, où d est la direction d'incidence et n la normale dirigée vers l'intérieur. Les rayons qui ne feraient que frôler la paroi sont ignorés. L'enveloppe est tracée à partir de l'équation de la néphroïde elle-même, elle n'est pas calculée à partir des rayons, et tu peux voir les rayons s'accumuler le long de cette courbe.",
          "La vue du cercle roulant fait avancer son paramètre de 0,012 radian par image, si bien qu'un tour dure un peu plus de 500 images, soit environ neuf secondes à 60 Hz. La vue de Mandelbrot exécute l'algorithme du temps d'échappement pour chaque pixel : on itère z ↦ z² + c à partir de z = 0 pendant 40 étapes au plus, en s'arrêtant dès que |z| dépasse 2. Les pixels qui ne s'échappent jamais sont presque noirs, les autres sont teintés de violet selon la vitesse à laquelle ils sont partis. Ces pixels sont mis en cache et ne sont recalculés que lorsque le canevas change de taille.",
          "Les vues fixes ne sont redessinées que lorsqu'une entrée change. Si ton système demande de réduire les animations, le cercle roulant est figé en une seule image statique.",
        ],
        code: REFLECT_EXCERPT,
      },
      {
        heading: "Pourquoi l'ensemble de Mandelbrot contient une cardioïde",
        paragraphs: [
          "Le corps principal de l'ensemble de Mandelbrot est exactement l'ensemble des c pour lesquels z ↦ z² + c possède un point fixe attractif. Un point fixe vérifie z = z² + c et il attire lorsque la dérivée 2z est de module inférieur à 1. Pose 2z = μ avec |μ| < 1 ; alors c = μ/2 − μ²/4, et faire parcourir le cercle unité à μ trace précisément la formule ci-dessus. Au point de rebroussement, c = 1/4, le multiplicateur vaut exactement 1 et les deux points fixes fusionnent. Tangent à la cardioïde en c = −3/4 se trouve un disque parfait de rayon 1/4 centré en −1 : les paramètres qui possèdent un cycle attractif de période 2.",
        ],
      },
    ],
    experimentsHeading: "À essayer",
    experiments: [
      {
        title: "Fais surgir la caustique de nulle part",
        text: "Dans « Coffee cup », décoche « Show envelope » et règle « Rays » sur 20. Fais ensuite glisser lentement jusqu'à 300 : les croisements se condensent en une courbe lumineuse dotée d'une pointe aiguë à mi-chemin entre la paroi et le centre, alors que la courbe elle-même n'est pas dessinée.",
      },
      {
        title: "Attrape le point de rebroussement",
        text: "Ouvre « Rolling circle » et mets en pause quand le point cyan atteint l'endroit où les cercles se touchent. À cet instant le point est momentanément immobile, et c'est pourquoi la courbe présente un rebroussement au lieu d'un virage en douceur.",
      },
      {
        title: "Trouve la limite de la stabilité",
        text: "Dans « Mandelbrot bulb », suis la ligne ambre : à l'intérieur, chaque orbite se stabilise sur un seul point. À gauche, elle touche le bulbe rond en c = −3/4, là où le point fixe cède la place à un cycle de période 2.",
      },
      {
        title: "Compare les deux cœurs",
        text: "Passe de « Rolling circle » à « Mandelbrot bulb » et inversement. Les courbes ambre ont la même forme à des échelles différentes : le contour de Mandelbrot est la cardioïde du cercle roulant avec a = 1/4, le point de rebroussement à droite dans les deux cas.",
      },
    ],
  },
  it: {
    metaDescription:
      "Esplora la cardioide in tre modi: la luce riflessa in una tazza di caffè, un cerchio che rotola su un altro e il bulbo principale dell'insieme di Mandelbrot.",
    heading: "Come funziona questo esploratore",
    intro:
      "La cardioide è la curva a forma di cuore con una sola cuspide. Compare in luoghi sorprendentemente diversi: nel disegno luminoso che la luce traccia sulla superficie di una tazza, nella traiettoria di un punto su una ruota che rotola attorno a un'altra e come regione più grande dell'insieme di Mandelbrot. I tre pulsanti a destra passano da una scena all'altra, ognuna ottenuta con una costruzione diversa.",
    sections: [
      {
        heading: "Una curva, tre costruzioni",
        paragraphs: [
          "In coordinate polari, con la cuspide nell'origine, la cardioide è r = 2a(1 − cos θ). La vista «Rolling circle» la costruisce meccanicamente: al centro c'è un cerchio fisso di raggio a, un secondo cerchio dello stesso raggio gli rotola attorno all'esterno senza strisciare e un punto segnato sul cerchio che rotola traccia la curva. Poiché i due raggi sono uguali, il punto tocca il cerchio fisso esattamente una volta per giro, e quel contatto è la cuspide.",
          "Come curva parametrica, la costruzione per rotolamento dà x = 2a cos t − a cos 2t e y = 2a sin t − a sin 2t. Il bordo dell'insieme di Mandelbrot è la stessa espressione con a = 1/4 in forma complessa, ed è per questo che il contorno ambra della terza vista cade esattamente sul bordo dell'insieme.",
        ],
        formula: BULB_FORMULA,
      },
      {
        heading: "Che cosa fanno i controlli",
        paragraphs: [
          "«Coffee cup» disegna uno specchio circolare (la parete della tazza vista dall'alto) e vi manda raggi paralleli da destra. Il cursore «Rays» ne imposta il numero, da 20 a 300 a passi di 2, partendo da 120. Ogni raggio si riflette sulla parete opposta, e dove i raggi riflessi si addensano formano un inviluppo luminoso chiamato caustica. «Show rays» e «Show envelope» attivano e disattivano i due livelli in modo indipendente.",
          "C'è un colpo di scena da ammettere con onestà, e il pannello lo dice: con luce parallela, come quella del sole, l'inviluppo non è una cardioide ma una nefroide, una curva imparentata con due cuspidi. La pagina disegna la nefroide intera; la metà sul lato opposto è la caustica di questi raggi, la metà speculare appartiene alla luce che arriva da sinistra. Una vera cardioide compare quando la sorgente luminosa si trova sul bordo della tazza. Entrambe le curve sono epicicloidi, ed è per questo che la linea luminosa in una tazza vera sembra spesso un cuore.",
          "«Rolling circle» anima la costruzione e ha un solo pulsante, «Pause» oppure «Roll». «Mandelbrot bulb» mostra l'insieme con la cardioide esatta sovrapposta.",
        ],
      },
      {
        heading: "Com'è costruito",
        paragraphs: [
          "Tutto è disegnato su un unico canvas 2D adattato alla densità di pixel del tuo schermo. Per la tazza, ogni raggio viene collocato a un angolo φ sulla metà opposta del cerchio e riflesso con la formula dello specchio r = d − 2(d·n)n, dove d è la direzione di arrivo e n la normale rivolta verso l'interno. I raggi che sfiorerebbero soltanto la parete vengono saltati. L'inviluppo è tracciato a partire dall'equazione della nefroide stessa, non calcolato dai raggi, e puoi vedere i raggi accumularsi lungo di esso.",
          "La vista del rotolamento fa avanzare il suo parametro di 0,012 radianti per fotogramma, quindi un giro dura poco più di 500 fotogrammi, circa nove secondi a 60 Hz. La vista di Mandelbrot esegue per ogni pixel l'algoritmo del tempo di fuga: itera z ↦ z² + c da z = 0 per un massimo di 40 passi e si ferma appena |z| supera 2. I pixel che non fuggono mai sono quasi neri, gli altri sono sfumati di viola in base alla velocità con cui se ne sono andati. Questi pixel vengono messi in cache e ricalcolati solo quando il canvas cambia dimensione.",
          "Le viste statiche vengono ridisegnate solo quando cambia un valore in ingresso. Se il tuo sistema chiede di ridurre il movimento, il cerchio che rotola resta fermo in un unico fotogramma statico.",
        ],
        code: REFLECT_EXCERPT,
      },
      {
        heading: "Perché l'insieme di Mandelbrot ha una cardioide",
        paragraphs: [
          "Il corpo principale dell'insieme di Mandelbrot è esattamente l'insieme dei c per cui z ↦ z² + c ha un punto fisso attrattivo. Un punto fisso soddisfa z = z² + c e attrae quando la derivata 2z ha modulo minore di 1. Scrivi 2z = μ con |μ| < 1; allora c = μ/2 − μ²/4, e facendo percorrere a μ la circonferenza unitaria si traccia proprio la formula qui sopra. Nella cuspide, c = 1/4, il moltiplicatore vale esattamente 1 e i due punti fissi si fondono. A contatto con la cardioide in c = −3/4 c'è un disco perfetto di raggio 1/4 centrato in −1: i parametri con un ciclo attrattivo di periodo 2.",
        ],
      },
    ],
    experimentsHeading: "Prova così",
    experiments: [
      {
        title: "Fai comparire la caustica dal nulla",
        text: "In «Coffee cup», togli la spunta a «Show envelope» e imposta «Rays» su 20. Poi trascina lentamente fino a 300: gli incroci si condensano in una curva luminosa con una punta aguzza a metà strada tra la parete e il centro, anche se la curva in sé non è disegnata.",
      },
      {
        title: "Cogli la cuspide",
        text: "Apri «Rolling circle» e metti in pausa quando il punto ciano raggiunge il luogo in cui i cerchi si toccano. Lì il punto è fermo per un istante, ed è per questo che la curva ha una cuspide invece di una svolta dolce.",
      },
      {
        title: "Trova il confine della stabilità",
        text: "In «Mandelbrot bulb», segui la linea ambra: al suo interno ogni orbita si assesta su un unico punto. A sinistra tocca il bulbo rotondo in c = −3/4, dove il punto fisso cede il posto a un ciclo di periodo 2.",
      },
      {
        title: "Confronta i due cuori",
        text: "Passa da «Rolling circle» a «Mandelbrot bulb» e viceversa. Le curve ambra hanno la stessa forma a scale diverse: il contorno di Mandelbrot è la cardioide del rotolamento con a = 1/4, con la cuspide a destra in entrambe.",
      },
    ],
  },
  pt: {
    metaDescription:
      "Explora a cardioide de três maneiras: a luz refletida numa chávena de café, um círculo que rola sobre outro e o bolbo principal do conjunto de Mandelbrot.",
    heading: "Como funciona este explorador",
    intro:
      "A cardioide é a curva em forma de coração com uma única cúspide. Aparece em lugares surpreendentemente diferentes: no desenho brilhante que a luz traça na superfície de uma chávena, na trajetória de um ponto de uma roda que rola em torno de outra e como a maior região do conjunto de Mandelbrot. Os três botões à direita alternam entre essas cenas, cada uma obtida por uma construção diferente.",
    sections: [
      {
        heading: "Uma curva, três construções",
        paragraphs: [
          "Em coordenadas polares, com a cúspide na origem, a cardioide é r = 2a(1 − cos θ). A vista «Rolling circle» constrói-a mecanicamente: no centro fica um círculo fixo de raio a, um segundo círculo com o mesmo raio rola por fora dele sem deslizar e um ponto marcado no círculo que rola traça a curva. Como os dois raios são iguais, o ponto toca no círculo fixo exatamente uma vez por volta, e esse toque é a cúspide.",
          "Como curva parametrizada, a construção por rolamento dá x = 2a cos t − a cos 2t e y = 2a sen t − a sen 2t. A fronteira do conjunto de Mandelbrot é a mesma expressão com a = 1/4 em forma complexa, e é por isso que o contorno âmbar da terceira vista fica exatamente sobre a fronteira do conjunto.",
        ],
        formula: BULB_FORMULA,
      },
      {
        heading: "O que fazem os controlos",
        paragraphs: [
          "«Coffee cup» desenha um espelho circular (a parede da chávena vista de cima) e envia raios paralelos a partir da direita. O cursor «Rays» define quantos, de 20 a 300 em passos de 2, começando em 120. Cada raio reflete-se na parede do fundo, e onde os raios refletidos se aglomeram formam uma envolvente brilhante chamada cáustica. «Show rays» e «Show envelope» ligam e desligam as duas camadas de forma independente.",
          "Há uma reviravolta que convém admitir, e o painel admite-a: para luz paralela, como a do sol, a envolvente não é uma cardioide, mas sim uma nefroide, uma curva aparentada com duas cúspides. A página desenha a nefroide inteira; a metade do lado do fundo é a cáustica desses raios, a metade espelhada pertence à luz que vem da esquerda. Uma verdadeira cardioide aparece quando a fonte de luz fica no rebordo da chávena. As duas curvas são epicicloides, e é por isso que a linha brilhante numa caneca real costuma parecer um coração.",
          "«Rolling circle» anima a construção e tem um único botão, «Pause» ou «Roll». «Mandelbrot bulb» mostra o conjunto com a cardioide exata sobreposta.",
        ],
      },
      {
        heading: "Como está construído",
        paragraphs: [
          "Tudo é desenhado num único canvas 2D ajustado à densidade de píxeis do teu ecrã. Para a chávena, cada raio é posicionado num ângulo φ na metade do fundo do círculo e refletido com a fórmula do espelho r = d − 2(d·n)n, em que d é a direção de chegada e n a normal voltada para dentro. Os raios que apenas roçariam a parede são ignorados. A envolvente é desenhada a partir da equação da própria nefroide, e não calculada a partir dos raios, e consegues ver os raios a acumularem-se ao longo dela.",
          "A vista do rolamento avança o seu parâmetro 0,012 radianos por fotograma, de modo que uma volta leva pouco mais de 500 fotogramas, cerca de nove segundos a 60 Hz. A vista de Mandelbrot executa o algoritmo de tempo de escape em cada píxel: itera z ↦ z² + c a partir de z = 0 durante 40 passos no máximo e para assim que |z| ultrapassa 2. Os píxeis que nunca escapam ficam quase pretos, os restantes são tingidos de violeta conforme a rapidez com que saíram. Esses píxeis ficam em cache e só são recalculados quando o canvas muda de tamanho.",
          "As vistas estáticas só são redesenhadas quando alguma entrada muda. Se o teu sistema pedir movimento reduzido, o círculo que rola fica congelado num único fotograma estático.",
        ],
        code: REFLECT_EXCERPT,
      },
      {
        heading: "Porque é que o conjunto de Mandelbrot tem uma cardioide",
        paragraphs: [
          "O corpo principal do conjunto de Mandelbrot é exatamente o conjunto dos c para os quais z ↦ z² + c tem um ponto fixo atrativo. Um ponto fixo satisfaz z = z² + c e atrai quando a derivada 2z tem módulo menor que 1. Escreve 2z = μ com |μ| < 1; então c = μ/2 − μ²/4, e fazer μ percorrer o círculo unitário traça precisamente a fórmula acima. Na cúspide, c = 1/4, o multiplicador vale exatamente 1 e os dois pontos fixos fundem-se. A tocar na cardioide em c = −3/4 há um disco perfeito de raio 1/4 centrado em −1: os parâmetros com um ciclo atrativo de período 2.",
        ],
      },
    ],
    experimentsHeading: "Experimenta isto",
    experiments: [
      {
        title: "Faz a cáustica surgir do nada",
        text: "Em «Coffee cup», desmarca «Show envelope» e põe «Rays» em 20. Depois arrasta devagar até 300: os cruzamentos condensam-se numa curva brilhante com uma ponta aguda a meio caminho entre a parede e o centro, embora a curva em si não esteja desenhada.",
      },
      {
        title: "Apanha a cúspide",
        text: "Abre «Rolling circle» e põe em pausa quando o ponto ciano chegar ao lugar onde os círculos se tocam. Ali o ponto fica em repouso por um instante, e é por isso que a curva tem uma cúspide em vez de uma viragem suave.",
      },
      {
        title: "Encontra o limite da estabilidade",
        text: "Em «Mandelbrot bulb», segue a linha âmbar: dentro dela todas as órbitas assentam num único ponto. À esquerda toca no bolbo redondo em c = −3/4, onde o ponto fixo dá lugar a um ciclo de período 2.",
      },
      {
        title: "Compara os dois corações",
        text: "Alterna entre «Rolling circle» e «Mandelbrot bulb». As curvas âmbar têm a mesma forma em escalas diferentes: o contorno de Mandelbrot é a cardioide do rolamento com a = 1/4, com a cúspide à direita nas duas.",
      },
    ],
  },
  sv: {
    metaDescription:
      "Utforska kardioiden på tre sätt: som ljusreflex i en kaffekopp, som en cirkel som rullar runt en annan och som Mandelbrotmängdens huvudkropp, med matematiken.",
    heading: "Så fungerar den här utforskaren",
    intro:
      "Kardioiden är den hjärtformade kurvan med en enda spets. Den dyker upp på förvånansvärt olika ställen: i det ljusa mönster som ljuset ritar på ytan i en kopp, i banan för en punkt på ett hjul som rullar runt ett annat hjul och som det största området i Mandelbrotmängden. De tre knapparna till höger växlar mellan de här scenerna, som var och en bygger på sin egen konstruktion.",
    sections: [
      {
        heading: "En kurva, tre konstruktioner",
        paragraphs: [
          "I polära koordinater, med spetsen i origo, är kardioiden r = 2a(1 − cos θ). Vyn ”Rolling circle” bygger den mekaniskt: i mitten ligger en fast cirkel med radien a, en andra cirkel med samma radie rullar runt dess utsida utan att glida, och en markerad punkt på den rullande cirkeln ritar kurvan. Eftersom de två radierna är lika stora rör punkten vid den fasta cirkeln exakt en gång per varv, och den beröringen är spetsen.",
          "Som parametriserad kurva ger rullkonstruktionen x = 2a cos t − a cos 2t och y = 2a sin t − a sin 2t. Mandelbrotmängdens rand är samma uttryck med a = 1/4 i komplex form, och därför ligger den bärnstensfärgade konturen i den tredje vyn exakt på mängdens kant.",
        ],
        formula: BULB_FORMULA,
      },
      {
        heading: "Vad reglagen gör",
        paragraphs: [
          "”Coffee cup” ritar en cirkelformad spegel (koppens vägg sedd uppifrån) och skickar in parallella strålar från höger. Reglaget ”Rays” bestämmer hur många, från 20 till 300 i steg om 2, med 120 som startvärde. Varje stråle reflekteras mot den bortre väggen, och där de reflekterade strålarna trängs ihop bildar de en ljus höljekurva som kallas kaustika. ”Show rays” och ”Show envelope” slår av och på de två lagren oberoende av varandra.",
          "Här finns en ärlig knorr, och panelen säger det själv: för parallellt ljus, som solljus, är höljekurvan inte en kardioid utan en nefroid, en besläktad kurva med två spetsar. Sidan ritar hela nefroiden; halvan på den bortre sidan är de här strålarnas kaustika, den speglade halvan hör till ljus från vänster. En äkta kardioid uppstår när ljuskällan sitter på koppens kant. Båda kurvorna är epicykloider, och därför ser den ljusa linjen i en riktig mugg ofta hjärtformad ut.",
          "”Rolling circle” animerar konstruktionen och har en enda knapp, ”Pause” eller ”Roll”. ”Mandelbrot bulb” visar mängden med den exakta kardioiden lagd ovanpå.",
        ],
      },
      {
        heading: "Hur den är byggd",
        paragraphs: [
          "Allt ritas på en enda 2D-canvas som är skalad efter din skärms pixeltäthet. För koppen placeras varje stråle vid en vinkel φ på cirkelns bortre halva och reflekteras med spegelformeln r = d − 2(d·n)n, där d är den infallande riktningen och n den inåtriktade normalen. Strålar som bara skulle snudda vid väggen hoppas över. Höljekurvan ritas utifrån nefroidens egen ekvation, den räknas inte fram ur strålarna, och du kan se hur strålarna hopar sig längs den.",
          "Rullvyn flyttar fram sin parameter med 0,012 radianer per bildruta, så ett varv tar lite över 500 bildrutor, ungefär nio sekunder vid 60 Hz. Mandelbrotvyn kör flykttidsalgoritmen för varje pixel: iterera z ↦ z² + c från z = 0 i upp till 40 steg och avbryt så snart |z| överstiger 2. Pixlar som aldrig flyr blir nästan svarta, resten tonas i violett efter hur fort de försvann. De här pixlarna cachas och räknas bara om när ritytan ändrar storlek.",
          "De stillastående vyerna ritas bara om när en inmatning ändras. Om ditt system ber om minskad rörelse fryses den rullande cirkeln i en enda statisk bild.",
        ],
        code: REFLECT_EXCERPT,
      },
      {
        heading: "Varför Mandelbrotmängden har en kardioid",
        paragraphs: [
          "Mandelbrotmängdens huvudkropp är exakt mängden av de c för vilka z ↦ z² + c har en attraherande fixpunkt. En fixpunkt uppfyller z = z² + c och attraherar när derivatan 2z har ett belopp under 1. Skriv 2z = μ med |μ| < 1; då är c = μ/2 − μ²/4, och när μ får löpa runt enhetscirkeln ritas precis formeln ovan. I spetsen, c = 1/4, är multiplikatorn exakt 1 och de två fixpunkterna smälter samman. I c = −3/4 tangeras kardioiden av en perfekt cirkelskiva med radien 1/4 och medelpunkt i −1: parametrarna med en attraherande cykel med period 2.",
        ],
      },
    ],
    experimentsHeading: "Prova det här",
    experiments: [
      {
        title: "Låt kaustikan uppstå ur intet",
        text: "I ”Coffee cup” bockar du ur ”Show envelope” och ställer ”Rays” på 20. Dra sedan långsamt upp till 300: korsningarna förtätas till en ljus kurva med en skarp spets halvvägs mellan väggen och mitten, trots att själva kurvan inte är ritad.",
      },
      {
        title: "Fånga spetsen",
        text: "Öppna ”Rolling circle” och pausa när den cyanfärgade punkten når stället där cirklarna rör vid varandra. Där står punkten stilla ett ögonblick, och det är därför kurvan har en spets i stället för en mjuk sväng.",
      },
      {
        title: "Hitta stabilitetens gräns",
        text: "I ”Mandelbrot bulb” följer du den bärnstensfärgade linjen: innanför den stannar varje bana upp i en enda punkt. Till vänster rör den vid den runda knoppen i c = −3/4, där fixpunkten lämnar plats åt en cykel med period 2.",
      },
      {
        title: "Jämför de två hjärtana",
        text: "Växla mellan ”Rolling circle” och ”Mandelbrot bulb”. De bärnstensfärgade kurvorna har samma form i olika skala: Mandelbrotkonturen är rullkardioiden med a = 1/4, med spetsen till höger i båda.",
      },
    ],
  },
  no: {
    metaDescription:
      "Utforsk kardioiden på tre måter: som lysrefleks i en kaffekopp, som en sirkel som ruller rundt en annen og som Mandelbrotmengdens hovedkropp, med matematikken.",
    heading: "Slik fungerer denne utforskeren",
    intro:
      "Kardioiden er den hjerteformede kurven med én enkelt spiss. Den dukker opp på overraskende forskjellige steder: i det lyse mønsteret lyset tegner på overflaten i en kopp, i banen til et punkt på et hjul som ruller rundt et annet hjul, og som det største området i Mandelbrotmengden. De tre knappene til høyre bytter mellom disse scenene, som hver er bygd på sin egen konstruksjon.",
    sections: [
      {
        heading: "Én kurve, tre konstruksjoner",
        paragraphs: [
          "I polarkoordinater, med spissen i origo, er kardioiden r = 2a(1 − cos θ). Visningen «Rolling circle» bygger den mekanisk: I midten ligger en fast sirkel med radius a, en annen sirkel med samme radius ruller rundt utsiden uten å gli, og et merket punkt på den rullende sirkelen tegner kurven. Fordi de to radiene er like, berører punktet den faste sirkelen nøyaktig én gang per runde, og den berøringen er spissen.",
          "Som parametrisert kurve gir rullekonstruksjonen x = 2a cos t − a cos 2t og y = 2a sin t − a sin 2t. Randen til Mandelbrotmengden er det samme uttrykket med a = 1/4 på kompleks form, og derfor ligger det ravgule omrisset i den tredje visningen nøyaktig på kanten av mengden.",
        ],
        formula: BULB_FORMULA,
      },
      {
        heading: "Hva kontrollene gjør",
        paragraphs: [
          "«Coffee cup» tegner et sirkelformet speil (koppveggen sett ovenfra) og sender parallelle stråler inn fra høyre. Glidebryteren «Rays» bestemmer hvor mange, fra 20 til 300 i steg på 2, med 120 som startverdi. Hver stråle reflekteres fra den bortre veggen, og der de reflekterte strålene klumper seg sammen, danner de en lys innhyllingskurve som kalles en kaustikk. «Show rays» og «Show envelope» slår de to lagene av og på uavhengig av hverandre.",
          "Her er det en ærlig vri, og panelet sier det selv: For parallelt lys, som sollys, er innhyllingskurven ikke en kardioide, men en nefroide, en beslektet kurve med to spisser. Siden tegner hele nefroiden; halvdelen på den bortre siden er kaustikken til disse strålene, den speilvendte halvdelen hører til lys fra venstre. En ekte kardioide oppstår når lyskilden sitter på kanten av koppen. Begge kurvene er episykloider, og derfor ser den lyse linjen i et ekte krus ofte hjerteformet ut.",
          "«Rolling circle» animerer konstruksjonen og har én knapp, «Pause» eller «Roll». «Mandelbrot bulb» viser mengden med den eksakte kardioiden lagt oppå.",
        ],
      },
      {
        heading: "Slik er den bygget",
        paragraphs: [
          "Alt tegnes på ett 2D-lerret som er skalert etter pikseltettheten på skjermen din. For koppen plasseres hver stråle ved en vinkel φ på den bortre halvdelen av sirkelen og reflekteres med speilformelen r = d − 2(d·n)n, der d er innfallsretningen og n normalen som peker innover. Stråler som bare ville streife veggen, hoppes over. Innhyllingskurven tegnes ut fra nefroidens egen ligning, den beregnes ikke fra strålene, og du kan se hvordan strålene hoper seg opp langs den.",
          "Rullevisningen flytter parameteren sin fram med 0,012 radianer per bilde, så én runde tar litt over 500 bilder, omtrent ni sekunder ved 60 Hz. Mandelbrotvisningen kjører rømningstidsalgoritmen for hver piksel: Iterer z ↦ z² + c fra z = 0 i opptil 40 steg, og stopp så snart |z| blir større enn 2. Piksler som aldri rømmer, blir nesten svarte, resten får en fiolett tone etter hvor fort de forsvant. Disse pikslene mellomlagres og beregnes bare på nytt når lerretet endrer størrelse.",
          "De stillestående visningene tegnes bare på nytt når en inndataverdi endres. Hvis systemet ditt ber om redusert bevegelse, fryses den rullende sirkelen i ett enkelt statisk bilde.",
        ],
        code: REFLECT_EXCERPT,
      },
      {
        heading: "Hvorfor Mandelbrotmengden har en kardioide",
        paragraphs: [
          "Hovedkroppen i Mandelbrotmengden er nøyaktig mengden av de c der z ↦ z² + c har et tiltrekkende fikspunkt. Et fikspunkt oppfyller z = z² + c, og det tiltrekker når den deriverte 2z har absoluttverdi under 1. Skriv 2z = μ med |μ| < 1; da er c = μ/2 − μ²/4, og når μ løper rundt enhetssirkelen, tegnes nettopp formelen over. I spissen, c = 1/4, er multiplikatoren nøyaktig 1, og de to fikspunktene smelter sammen. I c = −3/4 tangeres kardioiden av en perfekt sirkelskive med radius 1/4 og sentrum i −1: parameterne med en tiltrekkende sykel med periode 2.",
        ],
      },
    ],
    experimentsHeading: "Prøv dette",
    experiments: [
      {
        title: "La kaustikken oppstå av ingenting",
        text: "I «Coffee cup» fjerner du haken ved «Show envelope» og setter «Rays» til 20. Dra så sakte opp til 300: Kryssingene fortettes til en lys kurve med en skarp spiss halvveis mellom veggen og midten, selv om selve kurven ikke er tegnet.",
      },
      {
        title: "Fang spissen",
        text: "Åpne «Rolling circle» og sett på pause når det cyanfargede punktet når stedet der sirklene berører hverandre. Der står punktet stille et øyeblikk, og det er derfor kurven har en spiss i stedet for en myk sving.",
      },
      {
        title: "Finn grensen for stabilitet",
        text: "I «Mandelbrot bulb» følger du den ravgule linjen: Innenfor den faller hver bane til ro i ett enkelt punkt. Til venstre berører den den runde knoppen i c = −3/4, der fikspunktet viker plassen for en sykel med periode 2.",
      },
      {
        title: "Sammenlign de to hjertene",
        text: "Bytt mellom «Rolling circle» og «Mandelbrot bulb». De ravgule kurvene har samme form i ulik skala: Mandelbrotomrisset er rullekardioiden med a = 1/4, med spissen til høyre i begge.",
      },
    ],
  },
};
