import type { ExplorerGuide } from "./types";

// Numbers quoted here (defaults d = 60 px and ℓ = 50 px, ℓ range 0.2d to 1.5d,
// d range 40 to 120, 240 drawn needles, a sample every 25 drops, the π ± 0.8
// plot band) match app/buffon/explorer/page.tsx; update both together.
const DROP_EXCERPT = `// Sample the centre over a whole number of line periods,
// so y mod d is uniform.
const rows = Math.max(1, Math.floor(H / d));
const yRange = rows * d;
for (let i = 0; i < n; i++) {
  const x = Math.random() * W;
  const y = Math.random() * yRange;
  const angle = Math.random() * Math.PI;
  // Crosses iff |yWithinStrip - d/2| + (l/2)·sin(angle) > d/2
  const yMod = ((y % d) + d) % d;
  const cross = Math.abs(yMod - d / 2) + (len / 2) * Math.sin(angle) > d / 2;
  totalRef.current += 1;
  if (cross) crossRef.current += 1;
}
const est = (2 * len * totalRef.current) / (d * crossRef.current);`;

// Only the word inside \\text{} is localised (as DE already does); the maths is shared.
const crossingFormula = (label: string) =>
  `P(\\text{${label}}) = \\frac{2\\ell}{\\pi d} \\quad\\Longrightarrow\\quad \\pi \\approx \\frac{2\\ell\\, n}{d\\, k}`;

export const BUFFON_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Estimate π with Buffon's needle: drop thousands of needles on parallel lines, change needle length and spacing, and watch the running estimate converge.",
    heading: "How this explorer works",
    intro:
      "The upper panel is a floor with parallel lines, and every drop throws a needle onto it at a random position and a random angle. Needles that touch a line light up amber, the others stay grey. Count how often a needle crosses a line, divide, and π appears out of nowhere. The lower panel plots the running estimate against the number of needles, so you can watch randomness slowly turn into a constant.",
    sections: [
      {
        heading: "Why a needle knows about π",
        paragraphs: [
          "The question goes back to Georges-Louis Leclerc, Comte de Buffon, in the 18th century: if a needle of length ℓ falls on a floor ruled with parallel lines a distance d apart, and ℓ is at most d, what is the chance that it crosses a line? Only two numbers matter. One is the distance from the needle's centre to the nearest line, uniform between 0 and d/2. The other is the angle θ between needle and lines, uniform between 0 and π. The needle crosses when its half-length projected onto the vertical, (ℓ/2) sin θ, is longer than that distance.",
          "Averaging over all positions and angles turns this into an integral of sin θ, and that integral is where π enters. The result is a probability of 2ℓ/(πd). Turn it around and you get an estimator: after n drops with k crossings, π ≈ 2ℓn/(dk). That is exactly the formula in the corner of the canvas.",
        ],
        formula:
          "P(\\text{cross}) = \\frac{2\\ell}{\\pi d} \\quad\\Longrightarrow\\quad \\pi \\approx \\frac{2\\ell\\, n}{d\\, k}",
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "Line spacing d runs from 40 to 120 px, default 60. Needle length ℓ is tied to the spacing and runs from 0.2d to 1.5d, default 50 px; the label always shows the ratio ℓ/d. Changing either one clears all counts, because the estimator applies the current ℓ and d to the totals, and mixing drops from different settings would bias it for good.",
          "Drop 1 000 and Drop 10 000 throw a batch at once. Auto drop keeps throwing every animation frame at the chosen rate, from 1 to 500 needles per frame, default 40. The stats panel shows drops, crossings, the estimate to six decimals and its relative error in percent. Clear starts over with the same settings.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "Each drop draws three random numbers: x, y and an angle in [0, π). The crossing test does not search for nearby lines. It reduces y modulo d to find where the centre sits inside its strip, then checks whether the distance to the strip's middle plus the projected half-length exceeds d/2. That is the same condition as in the derivation, just written without a case distinction.",
          "One detail keeps the estimate honest. The canvas height is rarely a whole multiple of d, and drawing y uniformly over the full height would make some positions within a strip slightly more likely than others. The code therefore samples y only over a whole number of strips. The x coordinate plays no role in the test; it only spreads the needles across the picture.",
          "Counts live in refs rather than React state, so a batch of 10,000 needles triggers only one re-render. Only the most recent 240 needles are kept in a ring buffer for drawing, which keeps the picture readable after a million drops. Every 25 drops the current estimate is recorded, up to 1,200 samples, and the plot shows them inside a band of π ± 0.8 with a dashed reference line at the true value. Nothing moves on its own: auto drop is off by default, so the page is still until you start throwing. If your system asks for reduced motion, auto drop keeps sampling at the full rate but refreshes the picture, the plot and the numbers only twice a second.",
        ],
        code: DROP_EXCERPT,
      },
      {
        heading: "Slow convergence and long needles",
        paragraphs: [
          "The estimate wanders a lot. With the default ℓ = 50 and d = 60, its standard deviation is roughly 3/√n, so after 10,000 needles you can expect an error of about 0.03, and every additional correct digit costs about a hundred times as many needles. Among needles no longer than the spacing, ℓ = d gives the smallest spread. That square-root law is shared by all Monte Carlo methods, which is why Buffon's needle is a beautiful idea but a poor way to compute π. A famous 1901 experiment by Mario Lazzarini reported 355/113 from 3,408 needles, a result far too good for this spread and widely believed to have been tuned.",
          "Once ℓ exceeds d, the panel shows a note and the estimate drifts away from π. A long needle can cross two lines, but it is still counted only once, and the probability of at least one crossing is smaller than 2ℓ/(πd). The expected number of crossings, counted with multiplicity, stays exactly 2ℓ/(πd) for any length, so the bias comes purely from counting events instead of intersections. At ℓ = 1.5d the estimate settles near 3.85 instead of 3.14.",
        ],
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "Feel the noise",
        text: "Press Drop 1 000 a few times, clearing in between. The estimates scatter between roughly 3.0 and 3.3. Then press Drop 10 000 and notice that the scatter shrinks only by about a factor of three, not ten.",
      },
      {
        title: "The best needle",
        text: "Keep d at 60 and set ℓ to 60, so the ratio reads 1.00. Run auto drop at 500 per frame and compare the wobble of the plot with a run at ℓ = 15. The short needle crosses rarely, and its estimate jumps around much more.",
      },
      {
        title: "Watch the bias appear",
        text: "Set ℓ to 1.5d (90 px at d = 60) and switch on auto drop. The curve does not approach the dashed π line but levels off around 3.85. Lower ℓ back to 60 and it returns to π.",
      },
      {
        title: "Only the ratio matters",
        text: "Try d = 40 with ℓ = 30, then d = 120 with ℓ = 90. Both have ℓ/d = 0.75 and the same crossing probability of about 0.48, so after many drops the two estimates behave alike even though the pictures look very different.",
      },
    ],
  },
  de: {
    metaDescription:
      "π schätzen mit Buffons Nadel: Tausende Nadeln auf parallele Linien werfen, Länge und Abstand ändern und zusehen, wie die laufende Schätzung gegen π strebt.",
    heading: "So funktioniert dieser Explorer",
    intro:
      "Das obere Feld ist ein Boden mit parallelen Linien, und jeder Wurf lässt eine Nadel an zufälliger Stelle und in zufälligem Winkel darauf fallen. Nadeln, die eine Linie berühren, leuchten bernsteinfarben, die anderen bleiben grau. Zählst du, wie oft eine Nadel eine Linie kreuzt, und teilst geeignet, taucht π wie aus dem Nichts auf. Das untere Feld zeichnet die laufende Schätzung gegen die Zahl der Nadeln, so siehst du, wie sich Zufall langsam in eine Konstante verwandelt.",
    sections: [
      {
        heading: "Woher die Nadel π kennt",
        paragraphs: [
          "Die Frage stammt von Georges-Louis Leclerc, Comte de Buffon, aus dem 18. Jahrhundert: Eine Nadel der Länge ℓ fällt auf einen Boden mit parallelen Linien im Abstand d, und ℓ ist höchstens d. Wie wahrscheinlich kreuzt sie eine Linie? Es kommt nur auf zwei Zahlen an. Die eine ist der Abstand vom Nadelmittelpunkt zur nächsten Linie, gleichverteilt zwischen 0 und d/2. Die andere ist der Winkel θ zwischen Nadel und Linien, gleichverteilt zwischen 0 und π. Die Nadel kreuzt, wenn ihre senkrecht projizierte halbe Länge, (ℓ/2) sin θ, größer ist als dieser Abstand.",
          "Mittelt man über alle Lagen und Winkel, wird daraus ein Integral über sin θ, und genau dort kommt π ins Spiel. Heraus kommt die Wahrscheinlichkeit 2ℓ/(πd). Dreht man sie um, erhält man einen Schätzer: Nach n Würfen mit k Kreuzungen ist π ≈ 2ℓn/(dk). Das ist die Formel in der Ecke des Canvas.",
        ],
        formula:
          "P(\\text{Kreuzung}) = \\frac{2\\ell}{\\pi d} \\quad\\Longrightarrow\\quad \\pi \\approx \\frac{2\\ell\\, n}{d\\, k}",
      },
      {
        heading: "Was die Regler bewirken",
        paragraphs: [
          "Der Linienabstand d reicht von 40 bis 120 px, Standard 60. Die Nadellänge ℓ hängt am Abstand und reicht von 0,2d bis 1,5d, Standard 50 px; die Beschriftung zeigt immer das Verhältnis ℓ/d. Jede Änderung an einem der beiden setzt die Zählung zurück, denn der Schätzer wendet das aktuelle ℓ und d auf die Summen an. Würfe aus verschiedenen Einstellungen zu mischen, würde ihn dauerhaft verzerren.",
          "«1 000 werfen» und «10 000 werfen» werfen einen Stapel auf einmal. Der Auto-Wurf wirft in jedem Animationsframe weiter, mit einer Rate von 1 bis 500 Nadeln pro Frame, Standard 40. Die Statistik zeigt Würfe, Kreuzungen, die Schätzung auf sechs Nachkommastellen und den relativen Fehler in Prozent. «Zurücksetzen» beginnt mit denselben Einstellungen von vorn.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Jeder Wurf zieht drei Zufallszahlen: x, y und einen Winkel in [0, π). Der Kreuzungstest sucht keine benachbarten Linien. Er reduziert y modulo d, um die Lage des Mittelpunkts in seinem Streifen zu finden, und prüft dann, ob der Abstand zur Streifenmitte plus die projizierte halbe Länge größer als d/2 ist. Das ist dieselbe Bedingung wie in der Herleitung, nur ohne Fallunterscheidung geschrieben.",
          "Ein Detail hält die Schätzung ehrlich. Die Höhe des Canvas ist selten ein ganzzahliges Vielfaches von d, und ein gleichverteiltes y über die volle Höhe würde manche Lagen innerhalb eines Streifens leicht bevorzugen. Deshalb zieht der Code y nur über eine ganze Anzahl von Streifen. Die x-Koordinate spielt für den Test keine Rolle, sie verteilt die Nadeln nur über das Bild.",
          "Die Zähler liegen in Refs statt im React-State, sodass ein Stapel von 10.000 Nadeln nur ein einziges Re-Rendering auslöst. Gezeichnet werden nur die letzten 240 Nadeln aus einem Ringpuffer, damit das Bild auch nach einer Million Würfen lesbar bleibt. Alle 25 Würfe wird die aktuelle Schätzung notiert, bis zu 1.200 Messpunkte, und der Plot zeigt sie in einem Band von π ± 0,8 mit einer gestrichelten Linie beim wahren Wert. Von selbst bewegt sich nichts: Der Auto-Wurf ist standardmäßig aus, die Seite bleibt still, bis du zu werfen beginnst. Wünscht dein System reduzierte Bewegung, wirft der Auto-Wurf mit voller Rate weiter, aktualisiert Bild, Kurve und Zahlen aber nur zweimal pro Sekunde.",
        ],
        code: DROP_EXCERPT,
      },
      {
        heading: "Langsame Konvergenz und lange Nadeln",
        paragraphs: [
          "Die Schätzung schwankt stark. Mit den Standardwerten ℓ = 50 und d = 60 liegt ihre Standardabweichung bei etwa 3/√n. Nach 10.000 Nadeln ist also ein Fehler um 0,03 zu erwarten, und jede weitere richtige Stelle kostet ungefähr hundertmal so viele Nadeln. Unter den Nadeln, die nicht länger als der Abstand sind, streut ℓ = d am wenigsten. Dieses Wurzelgesetz teilen alle Monte-Carlo-Verfahren, deshalb ist Buffons Nadel eine wunderschöne Idee, aber ein schlechter Weg, π zu berechnen. Mario Lazzarini berichtete 1901 von 355/113 aus 3.408 Nadeln, ein Ergebnis, das für diese Streuung viel zu gut ist und allgemein als zurechtgelegt gilt.",
          "Sobald ℓ größer als d wird, erscheint ein Hinweis, und die Schätzung entfernt sich von π. Eine lange Nadel kann zwei Linien kreuzen, zählt aber nur einmal, und die Wahrscheinlichkeit für mindestens eine Kreuzung ist kleiner als 2ℓ/(πd). Die erwartete Zahl der Kreuzungen, mit Vielfachheit gezählt, bleibt für jede Länge genau 2ℓ/(πd). Die Verzerrung entsteht also nur, weil Ereignisse statt Schnittpunkte gezählt werden. Bei ℓ = 1,5d pendelt sich die Schätzung bei etwa 3,85 statt 3,14 ein.",
        ],
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Das Rauschen spüren",
        text: "Drück ein paarmal «1 000 werfen» und setz dazwischen zurück. Die Schätzungen streuen etwa zwischen 3,0 und 3,3. Drück dann «10 000 werfen»: Die Streuung schrumpft nur ungefähr um den Faktor drei, nicht um zehn.",
      },
      {
        title: "Die beste Nadel",
        text: "Lass d bei 60 und stell ℓ auf 60, das Verhältnis zeigt dann 1,00. Lass den Auto-Wurf mit 500 pro Frame laufen und vergleiche das Zittern der Kurve mit einem Lauf bei ℓ = 15. Die kurze Nadel kreuzt selten, und ihre Schätzung springt deutlich stärker.",
      },
      {
        title: "Der Verzerrung zusehen",
        text: "Stell ℓ auf 1,5d (90 px bei d = 60) und schalte den Auto-Wurf ein. Die Kurve nähert sich nicht der gestrichelten π-Linie, sondern pendelt sich um 3,85 ein. Senkst du ℓ wieder auf 60, kehrt sie zu π zurück.",
      },
      {
        title: "Nur das Verhältnis zählt",
        text: "Probier d = 40 mit ℓ = 30 und danach d = 120 mit ℓ = 90. Beide haben ℓ/d = 0,75 und dieselbe Kreuzungswahrscheinlichkeit von etwa 0,48. Nach vielen Würfen verhalten sich die Schätzungen gleich, obwohl die Bilder ganz verschieden aussehen.",
      },
    ],
  },
  es: {
    metaDescription:
      "Estima π con la aguja de Buffon: lanza miles de agujas sobre líneas paralelas, cambia su longitud y la separación, y mira cómo converge la estimación.",
    heading: "Cómo funciona este explorador",
    intro:
      "El panel superior es un suelo con líneas paralelas, y cada lanzamiento arroja sobre él una aguja en una posición aleatoria y con un ángulo aleatorio. Las agujas que tocan una línea se iluminan en ámbar, las demás se quedan grises. Cuenta cuántas veces una aguja cruza una línea, divide, y π aparece de la nada. El panel inferior representa la estimación en curso frente al número de agujas, para que veas cómo el azar se convierte poco a poco en una constante.",
    sections: [
      {
        heading: "Por qué una aguja sabe de π",
        paragraphs: [
          "La pregunta se remonta a Georges-Louis Leclerc, conde de Buffon, en el siglo XVIII: si una aguja de longitud ℓ cae sobre un suelo rayado con líneas paralelas separadas una distancia d, y ℓ es como mucho d, ¿qué probabilidad hay de que cruce una línea? Solo importan dos números. Uno es la distancia del centro de la aguja a la línea más cercana, uniforme entre 0 y d/2. El otro es el ángulo θ entre la aguja y las líneas, uniforme entre 0 y π. La aguja cruza cuando su media longitud proyectada sobre la vertical, (ℓ/2) sin θ, es mayor que esa distancia.",
          "Al promediar sobre todas las posiciones y todos los ángulos, esto se convierte en una integral de sin θ, y por esa integral entra π. El resultado es una probabilidad de 2ℓ/(πd). Dale la vuelta y obtienes un estimador: tras n lanzamientos con k cruces, π ≈ 2ℓn/(dk). Esa es exactamente la fórmula que aparece en la esquina del lienzo.",
        ],
        formula: crossingFormula("cruce"),
      },
      {
        heading: "Qué hacen los controles",
        paragraphs: [
          "«Separación de líneas d» va de 40 a 120 px, 60 por defecto. «Longitud de aguja ℓ» está ligada a la separación y va de 0,2d a 1,5d, 50 px por defecto; la etiqueta muestra siempre el cociente ℓ/d. Cambiar cualquiera de las dos borra todos los recuentos, porque el estimador aplica los valores actuales de ℓ y d a los totales, y mezclar lanzamientos de ajustes distintos lo sesgaría para siempre.",
          "«Lanzar 1 000» y «Lanzar 10 000» arrojan un lote de una vez. «Caída automática» sigue lanzando en cada fotograma de animación al ritmo elegido, de 1 a 500 agujas por fotograma, 40 por defecto. El panel de estadísticas muestra las caídas, los cruces, la estimación con seis decimales y su error relativo en porcentaje. «Limpiar» empieza de nuevo con los mismos ajustes.",
        ],
      },
      {
        heading: "Cómo está construido",
        paragraphs: [
          "Cada lanzamiento sortea tres números aleatorios: x, y y un ángulo en [0, π). La prueba de cruce no busca líneas cercanas. Reduce y módulo d para saber dónde queda el centro dentro de su franja y luego comprueba si la distancia al medio de la franja más la media longitud proyectada supera d/2. Es la misma condición que en la deducción, solo que escrita sin distinción de casos.",
          "Un detalle mantiene honesta la estimación. La altura del lienzo rara vez es un múltiplo entero de d, y sortear y de forma uniforme sobre toda la altura haría que algunas posiciones dentro de una franja fueran ligeramente más probables que otras. Por eso el código muestrea y solo sobre un número entero de franjas. La coordenada x no interviene en la prueba; solo reparte las agujas por la imagen.",
          "Los recuentos viven en refs y no en el estado de React, así que un lote de 10 000 agujas provoca un único renderizado. Para dibujar solo se guardan las 240 agujas más recientes en un búfer circular, lo que mantiene la imagen legible después de un millón de lanzamientos. Cada 25 lanzamientos se registra la estimación actual, hasta 1200 muestras, y la gráfica las muestra dentro de una banda de π ± 0,8 con una línea de referencia discontinua en el valor verdadero. Nada se mueve por sí solo: la caída automática está desactivada por defecto, así que la página permanece quieta hasta que empiezas a lanzar. Si tu sistema pide movimiento reducido, la caída automática sigue muestreando a pleno ritmo, pero actualiza la imagen, la gráfica y los números solo dos veces por segundo.",
        ],
        code: DROP_EXCERPT,
      },
      {
        heading: "Convergencia lenta y agujas largas",
        paragraphs: [
          "La estimación vaga mucho. Con los valores por defecto ℓ = 50 y d = 60, su desviación típica es aproximadamente 3/√n, de modo que tras 10 000 agujas cabe esperar un error de unos 0,03, y cada cifra correcta adicional cuesta unas cien veces más agujas. Entre las agujas que no superan la separación, ℓ = d da la menor dispersión. Esa ley de la raíz cuadrada la comparten todos los métodos de Montecarlo, y por eso la aguja de Buffon es una idea preciosa pero una mala manera de calcular π. Un famoso experimento de Mario Lazzarini, de 1901, comunicó 355/113 a partir de 3408 agujas, un resultado demasiado bueno para esta dispersión y que en general se considera amañado.",
          "En cuanto ℓ supera d, el panel muestra una nota y la estimación se aleja de π. Una aguja larga puede cruzar dos líneas, pero aun así se cuenta una sola vez, y la probabilidad de al menos un cruce es menor que 2ℓ/(πd). El número esperado de cruces, contados con multiplicidad, sigue siendo exactamente 2ℓ/(πd) para cualquier longitud, así que el sesgo viene únicamente de contar sucesos en lugar de intersecciones. Con ℓ = 1,5d la estimación se estabiliza cerca de 3,85 en vez de 3,14.",
        ],
      },
    ],
    experimentsHeading: "Prueba esto",
    experiments: [
      {
        title: "Siente el ruido",
        text: "Pulsa «Lanzar 1 000» unas cuantas veces, limpiando entre una y otra. Las estimaciones se dispersan más o menos entre 3,0 y 3,3. Después pulsa «Lanzar 10 000» y fíjate en que la dispersión se reduce solo en un factor de unos tres, no de diez.",
      },
      {
        title: "La mejor aguja",
        text: "Deja d en 60 y pon ℓ en 60, de modo que el cociente marque 1,00. Activa la caída automática a 500 por fotograma y compara el temblor de la gráfica con una tanda a ℓ = 15. La aguja corta cruza pocas veces y su estimación salta mucho más.",
      },
      {
        title: "Mira aparecer el sesgo",
        text: "Pon ℓ en 1,5d (90 px con d = 60) y activa la caída automática. La curva no se acerca a la línea discontinua de π, sino que se estabiliza en torno a 3,85. Baja ℓ de nuevo a 60 y vuelve a π.",
      },
      {
        title: "Solo importa el cociente",
        text: "Prueba d = 40 con ℓ = 30 y luego d = 120 con ℓ = 90. En ambos casos ℓ/d = 0,75 y la probabilidad de cruce es la misma, alrededor de 0,48, así que tras muchos lanzamientos las dos estimaciones se comportan igual aunque las imágenes sean muy distintas.",
      },
    ],
  },
  fr: {
    metaDescription:
      "Estime π avec l'aiguille de Buffon : lance des milliers d'aiguilles sur des lignes parallèles, change longueur et espacement, et regarde l'estimation converger.",
    heading: "Comment fonctionne cet explorateur",
    intro:
      "Le panneau du haut est un plancher rayé de lignes parallèles, et chaque lancer y jette une aiguille à une position aléatoire et sous un angle aléatoire. Les aiguilles qui touchent une ligne s'allument en ambre, les autres restent grises. Compte combien de fois une aiguille croise une ligne, divise, et π surgit de nulle part. Le panneau du bas trace l'estimation courante en fonction du nombre d'aiguilles : tu peux ainsi regarder le hasard se transformer lentement en constante.",
    sections: [
      {
        heading: "Pourquoi une aiguille connaît π",
        paragraphs: [
          "La question remonte à Georges-Louis Leclerc, comte de Buffon, au XVIIIe siècle : si une aiguille de longueur ℓ tombe sur un plancher rayé de lignes parallèles espacées d'une distance d, et que ℓ vaut au plus d, quelle est la probabilité qu'elle croise une ligne ? Seuls deux nombres comptent. L'un est la distance entre le centre de l'aiguille et la ligne la plus proche, uniforme entre 0 et d/2. L'autre est l'angle θ entre l'aiguille et les lignes, uniforme entre 0 et π. L'aiguille croise une ligne lorsque sa demi-longueur projetée sur la verticale, (ℓ/2) sin θ, dépasse cette distance.",
          "En moyennant sur toutes les positions et tous les angles, on obtient une intégrale de sin θ, et c'est par cette intégrale que π entre en scène. Le résultat est une probabilité de 2ℓ/(πd). Retourne la formule et tu obtiens un estimateur : après n lancers dont k croisements, π ≈ 2ℓn/(dk). C'est exactement la formule affichée dans le coin du canevas.",
        ],
        formula: crossingFormula("croisement"),
      },
      {
        heading: "À quoi servent les commandes",
        paragraphs: [
          "« Espacement des lignes d » va de 40 à 120 px, 60 par défaut. « Longueur d'aiguille ℓ » est liée à l'espacement et va de 0,2d à 1,5d (50 px par défaut) ; le libellé affiche toujours le rapport ℓ/d. Modifier l'un ou l'autre efface tous les compteurs, car l'estimateur applique les valeurs actuelles de ℓ et de d aux totaux, et mélanger des lancers issus de réglages différents le biaiserait définitivement.",
          "« Lancer 1 000 » et « Lancer 10 000 » jettent un lot d'un seul coup. « Lancer auto » continue de lancer à chaque image d'animation à la cadence choisie, de 1 à 500 aiguilles par image, 40 par défaut. Le panneau de statistiques affiche les lancers, les croisements, l'estimation à six décimales et son erreur relative en pourcentage. « Effacer » repart de zéro avec les mêmes réglages.",
        ],
      },
      {
        heading: "Comment c'est construit",
        paragraphs: [
          "Chaque lancer tire trois nombres aléatoires : x, y et un angle dans [0, π). Le test de croisement ne cherche pas les lignes voisines. Il réduit y modulo d pour savoir où se trouve le centre à l'intérieur de sa bande, puis vérifie si la distance au milieu de la bande, augmentée de la demi-longueur projetée, dépasse d/2. C'est la même condition que dans le calcul ci-dessus, simplement écrite sans distinction de cas.",
          "Un détail garantit l'honnêteté de l'estimation. La hauteur du canevas est rarement un multiple entier de d, et tirer y uniformément sur toute la hauteur rendrait certaines positions à l'intérieur d'une bande légèrement plus probables que d'autres. Le code n'échantillonne donc y que sur un nombre entier de bandes. La coordonnée x ne joue aucun rôle dans le test ; elle ne sert qu'à répartir les aiguilles sur l'image.",
          "Les compteurs vivent dans des refs plutôt que dans l'état React, si bien qu'un lot de 10 000 aiguilles ne déclenche qu'un seul nouveau rendu. Seules les 240 aiguilles les plus récentes sont conservées dans un tampon circulaire pour le dessin, ce qui garde l'image lisible après un million de lancers. Tous les 25 lancers, l'estimation courante est enregistrée, jusqu'à 1 200 échantillons, et le graphique les montre dans une bande de π ± 0,8 avec une ligne de référence en pointillés à la vraie valeur. Rien ne bouge tout seul : le lancer automatique est désactivé par défaut, la page reste donc immobile tant que tu ne commences pas à lancer. Si ton système demande une réduction des animations, le lancer automatique continue d'échantillonner à pleine cadence, mais ne rafraîchit l'image, le graphique et les nombres que deux fois par seconde.",
        ],
        code: DROP_EXCERPT,
      },
      {
        heading: "Convergence lente et longues aiguilles",
        paragraphs: [
          "L'estimation vagabonde beaucoup. Avec les valeurs par défaut ℓ = 50 et d = 60, son écart type vaut environ 3/√n : après 10 000 aiguilles, tu peux donc t'attendre à une erreur d'environ 0,03, et chaque chiffre exact supplémentaire coûte environ cent fois plus d'aiguilles. Parmi les aiguilles qui ne dépassent pas l'espacement, ℓ = d donne la plus faible dispersion. Cette loi en racine carrée est commune à toutes les méthodes de Monte-Carlo, et c'est pourquoi l'aiguille de Buffon est une belle idée mais un piètre moyen de calculer π. Une célèbre expérience de Mario Lazzarini, en 1901, a annoncé 355/113 à partir de 3 408 aiguilles, un résultat bien trop bon pour cette dispersion et que l'on pense généralement arrangé.",
          "Dès que ℓ dépasse d, le panneau affiche une note et l'estimation s'éloigne de π. Une longue aiguille peut croiser deux lignes, mais elle n'est tout de même comptée qu'une fois, et la probabilité d'au moins un croisement est inférieure à 2ℓ/(πd). Le nombre attendu de croisements, comptés avec multiplicité, reste exactement 2ℓ/(πd) quelle que soit la longueur : le biais vient donc uniquement du fait de compter des événements plutôt que des intersections. Pour ℓ = 1,5d, l'estimation se stabilise près de 3,85 au lieu de 3,14.",
        ],
      },
    ],
    experimentsHeading: "À essayer",
    experiments: [
      {
        title: "Ressens le bruit",
        text: "Appuie plusieurs fois sur « Lancer 1 000 », en effaçant entre deux essais. Les estimations se dispersent à peu près entre 3,0 et 3,3. Appuie ensuite sur « Lancer 10 000 » et remarque que la dispersion ne diminue que d'un facteur trois environ, et non dix.",
      },
      {
        title: "La meilleure aiguille",
        text: "Garde d à 60 et règle ℓ sur 60, pour que le rapport affiche 1,00. Lance le mode automatique à 500 par image et compare le tremblement du graphique avec un essai à ℓ = 15. L'aiguille courte croise rarement, et son estimation saute beaucoup plus.",
      },
      {
        title: "Regarde le biais apparaître",
        text: "Règle ℓ sur 1,5d (90 px pour d = 60) et active le lancer automatique. La courbe ne s'approche pas de la ligne pointillée de π, elle se stabilise autour de 3,85. Ramène ℓ à 60 et elle revient vers π.",
      },
      {
        title: "Seul le rapport compte",
        text: "Essaie d = 40 avec ℓ = 30, puis d = 120 avec ℓ = 90. Dans les deux cas ℓ/d = 0,75 et la probabilité de croisement est la même, environ 0,48 : après de nombreux lancers, les deux estimations se comportent donc de la même façon, même si les images sont très différentes.",
      },
    ],
  },
  it: {
    metaDescription:
      "Stima π con l'ago di Buffon: lancia migliaia di aghi su linee parallele, cambia lunghezza dell'ago e distanza tra le linee e guarda la stima convergere.",
    heading: "Come funziona questo esploratore",
    intro:
      "Il pannello in alto è un pavimento con linee parallele, e ogni lancio vi getta sopra un ago in una posizione casuale e con un angolo casuale. Gli aghi che toccano una linea si accendono color ambra, gli altri restano grigi. Conta quante volte un ago incrocia una linea, dividi, e π salta fuori dal nulla. Il pannello in basso traccia la stima corrente in funzione del numero di aghi, così puoi guardare il caso trasformarsi lentamente in una costante.",
    sections: [
      {
        heading: "Perché un ago conosce π",
        paragraphs: [
          "La domanda risale a Georges-Louis Leclerc, conte di Buffon, nel XVIII secolo: se un ago di lunghezza ℓ cade su un pavimento rigato da linee parallele a distanza d l'una dall'altra, e ℓ è al massimo d, qual è la probabilità che incroci una linea? Contano solo due numeri. Uno è la distanza dal centro dell'ago alla linea più vicina, uniforme tra 0 e d/2. L'altro è l'angolo θ tra l'ago e le linee, uniforme tra 0 e π. L'ago incrocia una linea quando la sua semilunghezza proiettata sulla verticale, (ℓ/2) sin θ, è maggiore di quella distanza.",
          "Facendo la media su tutte le posizioni e tutti gli angoli si ottiene un integrale di sin θ, ed è da quell'integrale che entra π. Il risultato è una probabilità pari a 2ℓ/(πd). Rovesciala e ottieni uno stimatore: dopo n lanci con k incroci, π ≈ 2ℓn/(dk). È esattamente la formula nell'angolo del canvas.",
        ],
        formula: crossingFormula("incrocio"),
      },
      {
        heading: "Che cosa fanno i controlli",
        paragraphs: [
          "«Distanza tra le linee d» va da 40 a 120 px, predefinita 60. «Lunghezza dell'ago ℓ» è legata alla distanza e va da 0,2d a 1,5d, predefinita 50 px; l'etichetta mostra sempre il rapporto ℓ/d. Modificare una delle due azzera tutti i conteggi, perché lo stimatore applica i valori attuali di ℓ e d ai totali, e mescolare lanci fatti con impostazioni diverse lo distorcerebbe per sempre.",
          "«Lancia 1 000» e «Lancia 10 000» gettano un lotto in un colpo solo. «Lancio automatico» continua a lanciare a ogni fotogramma dell'animazione al ritmo scelto, da 1 a 500 aghi per fotogramma, predefinito 40. Il pannello delle statistiche mostra i lanci, gli incroci, la stima con sei decimali e il suo errore relativo in percentuale.",
        ],
      },
      {
        heading: "Com'è costruito",
        paragraphs: [
          "Ogni lancio estrae tre numeri casuali: x, y e un angolo in [0, π). Il test di incrocio non va a cercare le linee vicine. Riduce y modulo d per trovare dove sta il centro all'interno della sua striscia, poi controlla se la distanza dal centro della striscia più la semilunghezza proiettata supera d/2.",
          "Un dettaglio mantiene onesta la stima. L'altezza del canvas è raramente un multiplo intero di d, ed estrarre y in modo uniforme su tutta l'altezza renderebbe alcune posizioni all'interno di una striscia leggermente più probabili di altre. Per questo il codice campiona y solo su un numero intero di strisce. La coordinata x non ha alcun ruolo nel test; serve soltanto a distribuire gli aghi nell'immagine.",
          "I conteggi stanno in ref anziché nello stato di React, quindi un lotto di 10.000 aghi provoca un solo nuovo rendering. Per il disegno si conservano in un buffer circolare solo i 240 aghi più recenti, il che mantiene leggibile l'immagine anche dopo un milione di lanci. Ogni 25 lanci viene registrata la stima corrente, fino a 1200 campioni, e il grafico li mostra dentro una fascia di π ± 0,8 con una linea di riferimento tratteggiata sul valore vero. Niente si muove da solo: il lancio automatico è spento per impostazione predefinita, quindi la pagina resta ferma finché non cominci a lanciare. Se il tuo sistema chiede di ridurre il movimento, il lancio automatico continua a campionare a pieno ritmo ma aggiorna l'immagine, il grafico e i numeri solo due volte al secondo.",
        ],
        code: DROP_EXCERPT,
      },
      {
        heading: "Convergenza lenta e aghi lunghi",
        paragraphs: [
          "La stima vaga parecchio. Con i valori predefiniti ℓ = 50 e d = 60, la sua deviazione standard è circa 3/√n, quindi dopo 10.000 aghi puoi aspettarti un errore di circa 0,03, e ogni cifra corretta in più costa circa cento volte tanti aghi. Tra gli aghi non più lunghi della distanza tra le linee, ℓ = d dà la dispersione più piccola. Questa legge della radice quadrata è comune a tutti i metodi Monte Carlo. Un famoso esperimento di Mario Lazzarini del 1901 riportò 355/113 a partire da 3408 aghi, un risultato fin troppo buono per questa dispersione e che si ritiene comunemente aggiustato.",
          "Non appena ℓ supera d, il pannello mostra una nota e la stima si allontana da π. Un ago lungo può incrociare due linee, ma viene comunque contato una volta sola, e la probabilità di almeno un incrocio è minore di 2ℓ/(πd). Il numero atteso di incroci, contati con molteplicità, resta esattamente 2ℓ/(πd) per qualsiasi lunghezza, quindi la distorsione nasce soltanto dal contare eventi anziché intersezioni. Con ℓ = 1,5d la stima si assesta vicino a 3,85 invece che a 3,14.",
        ],
      },
    ],
    experimentsHeading: "Prova così",
    experiments: [
      {
        title: "Senti il rumore",
        text: "Premi «Lancia 1 000» qualche volta, azzerando tra una prova e l'altra. Le stime si sparpagliano all'incirca tra 3,0 e 3,3. Poi premi «Lancia 10 000» e nota che la dispersione si riduce solo di un fattore tre circa, non dieci.",
      },
      {
        title: "L'ago migliore",
        text: "Tieni d a 60 e imposta ℓ a 60, così il rapporto segna 1,00. Avvia il lancio automatico a 500 per fotogramma e confronta il tremolio del grafico con una prova a ℓ = 15. L'ago corto incrocia di rado e la sua stima salta molto di più.",
      },
      {
        title: "Guarda comparire la distorsione",
        text: "Imposta ℓ a 1,5d (90 px con d = 60) e accendi il lancio automatico. La curva non si avvicina alla linea tratteggiata di π, ma si assesta intorno a 3,85. Riporta ℓ a 60 e torna verso π.",
      },
      {
        title: "Conta solo il rapporto",
        text: "Prova d = 40 con ℓ = 30, poi d = 120 con ℓ = 90. In entrambi i casi ℓ/d = 0,75 e la probabilità di incrocio è la stessa, circa 0,48, quindi dopo molti lanci le due stime si comportano allo stesso modo anche se le immagini sono molto diverse.",
      },
    ],
  },
  pt: {
    metaDescription:
      "Estima π com a agulha de Buffon: lança milhares de agulhas sobre linhas paralelas, muda o comprimento e o espaçamento e vê a estimativa convergir.",
    heading: "Como funciona este explorador",
    intro:
      "O painel de cima é um chão com linhas paralelas, e cada lançamento atira para lá uma agulha numa posição aleatória e com um ângulo aleatório. As agulhas que tocam numa linha acendem-se a âmbar, as outras ficam cinzentas. Conta quantas vezes uma agulha cruza uma linha, divide, e π aparece do nada. O painel de baixo traça a estimativa corrente em função do número de agulhas, para que possas ver o acaso transformar-se lentamente numa constante.",
    sections: [
      {
        heading: "Porque é que uma agulha conhece π",
        paragraphs: [
          "A pergunta remonta a Georges-Louis Leclerc, conde de Buffon, no século XVIII: se uma agulha de comprimento ℓ cair num chão riscado com linhas paralelas a uma distância d umas das outras, e ℓ for no máximo d, qual é a probabilidade de cruzar uma linha? Só dois números importam. Um é a distância do centro da agulha à linha mais próxima, uniforme entre 0 e d/2. O outro é o ângulo θ entre a agulha e as linhas, uniforme entre 0 e π. A agulha cruza uma linha quando o seu meio comprimento projetado na vertical, (ℓ/2) sen θ, é maior do que essa distância.",
          "Fazendo a média sobre todas as posições e todos os ângulos, isto transforma-se num integral de sen θ, e é por esse integral que π entra. O resultado é uma probabilidade de 2ℓ/(πd). Vira-a ao contrário e obténs um estimador: depois de n lançamentos com k cruzamentos, π ≈ 2ℓn/(dk). É exatamente a fórmula que está no canto do canvas.",
        ],
        formula: crossingFormula("cruzamento"),
      },
      {
        heading: "O que fazem os controlos",
        paragraphs: [
          "«Espaçamento das linhas d» vai de 40 a 120 px, 60 por omissão. «Comprimento da agulha ℓ» está preso ao espaçamento e vai de 0,2d a 1,5d, 50 px por omissão; a etiqueta mostra sempre a razão ℓ/d. Alterar qualquer um dos dois limpa todas as contagens, porque o estimador aplica os valores atuais de ℓ e d aos totais, e misturar lançamentos de configurações diferentes iria enviesá-lo de vez.",
          "«Lançar 1 000» e «Lançar 10 000» atiram um lote de uma só vez. «Lançamento automático» continua a lançar em cada fotograma de animação ao ritmo escolhido, de 1 a 500 agulhas por fotograma, 40 por omissão. O painel de estatísticas mostra os lançamentos, os cruzamentos, a estimativa com seis casas decimais e o seu erro relativo em percentagem. «Limpar» recomeça do zero com as mesmas definições.",
        ],
      },
      {
        heading: "Como está construído",
        paragraphs: [
          "Cada lançamento sorteia três números aleatórios: x, y e um ângulo em [0, π). O teste de cruzamento não procura linhas próximas. Reduz y módulo d para saber onde fica o centro dentro da sua faixa e depois verifica se a distância ao meio da faixa, somada ao meio comprimento projetado, ultrapassa d/2. É a mesma condição da dedução, apenas escrita sem distinção de casos.",
          "Há um pormenor que mantém a estimativa honesta. A altura do canvas raramente é um múltiplo inteiro de d, e sortear y uniformemente em toda a altura tornaria algumas posições dentro de uma faixa ligeiramente mais prováveis do que outras. Por isso o código amostra y apenas sobre um número inteiro de faixas. A coordenada x não tem qualquer papel no teste; serve só para espalhar as agulhas pela imagem.",
          "As contagens vivem em refs e não no estado do React, pelo que um lote de 10 000 agulhas desencadeia uma única nova renderização. Para o desenho guardam-se apenas as 240 agulhas mais recentes num buffer circular, o que mantém a imagem legível depois de um milhão de lançamentos. A cada 25 lançamentos regista-se a estimativa atual, até 1200 amostras, e o gráfico mostra-as dentro de uma banda de π ± 0,8 com uma linha de referência tracejada no valor verdadeiro. Nada se move sozinho: o lançamento automático está desligado por omissão, por isso a página fica parada até começares a lançar. Se o teu sistema pedir movimento reduzido, o lançamento automático continua a amostrar ao ritmo máximo, mas atualiza a imagem, o gráfico e os números apenas duas vezes por segundo.",
        ],
        code: DROP_EXCERPT,
      },
      {
        heading: "Convergência lenta e agulhas compridas",
        paragraphs: [
          "A estimativa vagueia bastante. Com os valores predefinidos ℓ = 50 e d = 60, o seu desvio padrão é aproximadamente 3/√n, pelo que depois de 10 000 agulhas podes esperar um erro de cerca de 0,03, e cada algarismo correto adicional custa cerca de cem vezes mais agulhas. Entre as agulhas que não são mais compridas do que o espaçamento, ℓ = d dá a menor dispersão. Essa lei da raiz quadrada é partilhada por todos os métodos de Monte Carlo, e é por isso que a agulha de Buffon é uma bela ideia mas uma má maneira de calcular π. Uma famosa experiência de Mario Lazzarini, em 1901, relatou 355/113 a partir de 3408 agulhas, um resultado bom demais para esta dispersão e que em geral se acredita ter sido arranjado.",
          "Assim que ℓ ultrapassa d, o painel mostra uma nota e a estimativa afasta-se de π. Uma agulha comprida pode cruzar duas linhas, mas continua a ser contada uma só vez, e a probabilidade de pelo menos um cruzamento é menor do que 2ℓ/(πd). O número esperado de cruzamentos, contados com multiplicidade, mantém-se exatamente 2ℓ/(πd) para qualquer comprimento, pelo que o enviesamento vem apenas de contar acontecimentos em vez de interseções. Com ℓ = 1,5d a estimativa estabiliza perto de 3,85 em vez de 3,14.",
        ],
      },
    ],
    experimentsHeading: "Experimenta isto",
    experiments: [
      {
        title: "Sente o ruído",
        text: "Carrega em «Lançar 1 000» algumas vezes, limpando entre cada tentativa. As estimativas dispersam-se mais ou menos entre 3,0 e 3,3. Depois carrega em «Lançar 10 000» e repara que a dispersão encolhe apenas por um fator de cerca de três, não dez.",
      },
      {
        title: "A melhor agulha",
        text: "Mantém d em 60 e põe ℓ em 60, para que a razão marque 1,00. Liga o lançamento automático a 500 por fotograma e compara a tremura do gráfico com uma corrida a ℓ = 15. A agulha curta cruza raramente e a sua estimativa salta muito mais.",
      },
      {
        title: "Vê o enviesamento aparecer",
        text: "Põe ℓ em 1,5d (90 px com d = 60) e liga o lançamento automático. A curva não se aproxima da linha tracejada de π, antes estabiliza em torno de 3,85. Baixa ℓ de novo para 60 e ela regressa a π.",
      },
      {
        title: "Só a razão importa",
        text: "Experimenta d = 40 com ℓ = 30 e depois d = 120 com ℓ = 90. Em ambos os casos ℓ/d = 0,75 e a probabilidade de cruzamento é a mesma, cerca de 0,48, por isso depois de muitos lançamentos as duas estimativas comportam-se da mesma maneira, embora as imagens sejam muito diferentes.",
      },
    ],
  },
  sv: {
    metaDescription:
      "Skatta π med Buffons nål: släpp tusentals nålar på parallella linjer, ändra nållängd och linjeavstånd och se den löpande skattningen konvergera.",
    heading: "Så fungerar den här utforskaren",
    intro:
      "Den övre panelen är ett golv med parallella linjer, och varje släpp kastar en nål på det på en slumpmässig plats och i en slumpmässig vinkel. Nålar som nuddar en linje lyser bärnstensgult, de andra förblir grå. Räkna hur ofta en nål korsar en linje, dividera, och π dyker upp från ingenstans. Den nedre panelen ritar den löpande skattningen mot antalet nålar, så att du kan se slumpen långsamt förvandlas till en konstant.",
    sections: [
      {
        heading: "Varför en nål känner till π",
        paragraphs: [
          "Frågan går tillbaka till Georges-Louis Leclerc, greve av Buffon, på 1700-talet: om en nål med längden ℓ faller på ett golv med parallella linjer på avståndet d från varandra, och ℓ är högst d, hur stor är chansen att den korsar en linje? Bara två tal spelar roll. Det ena är avståndet från nålens mittpunkt till närmaste linje, likformigt fördelat mellan 0 och d/2. Det andra är vinkeln θ mellan nålen och linjerna, likformigt fördelad mellan 0 och π. Nålen korsar en linje när dess halva längd projicerad på vertikalen, (ℓ/2) sin θ, är längre än det avståndet.",
          "Om man tar medelvärdet över alla lägen och vinklar blir detta en integral av sin θ, och det är genom den integralen som π kommer in. Resultatet är sannolikheten 2ℓ/(πd). Vänd på den och du får en skattare: efter n släpp med k korsningar är π ≈ 2ℓn/(dk). Det är precis formeln i hörnet av ritytan.",
        ],
        formula: crossingFormula("korsning"),
      },
      {
        heading: "Vad reglagen gör",
        paragraphs: [
          "”Linjeavstånd d” går från 40 till 120 px, standard 60. ”Nållängd ℓ” är knuten till avståndet och går från 0,2d till 1,5d, standard 50 px. Etiketten visar alltid kvoten ℓ/d. Om du ändrar något av dem nollställs alla räknare, eftersom skattaren tillämpar aktuella ℓ och d på totalsummorna, och att blanda släpp från olika inställningar skulle ge den ett bestående systematiskt fel.",
          "”Släpp 1 000” och ”Släpp 10 000” kastar en hel omgång på en gång. ”Autosläpp” fortsätter att kasta i varje animationsbildruta i vald takt, från 1 till 500 nålar per bildruta, standard 40. Statistikpanelen visar släpp, korsningar, skattningen med sex decimaler och dess relativa fel i procent.",
        ],
      },
      {
        heading: "Hur den är byggd",
        paragraphs: [
          "Varje släpp drar tre slumptal: x, y och en vinkel i [0, π). Korsningstestet letar inte efter linjer i närheten. Det reducerar y modulo d för att ta reda på var mittpunkten ligger i sin remsa och kontrollerar sedan om avståndet till remsans mitt plus den projicerade halva längden överstiger d/2.",
          "En detalj håller skattningen ärlig. Ritytans höjd är sällan en hel multipel av d, och att dra y likformigt över hela höjden skulle göra vissa lägen inom en remsa något sannolikare än andra. Koden drar därför y bara över ett helt antal remsor. x-koordinaten spelar ingen roll i testet, den sprider bara ut nålarna över bilden.",
          "Räknarna ligger i refs i stället för i React-state, så en omgång på 10\u00a0000 nålar utlöser bara en enda omrendering. Bara de 240 senaste nålarna sparas i en ringbuffert för uppritning, vilket håller bilden läsbar efter en miljon släpp. Var 25:e släpp sparas den aktuella skattningen, upp till 1200 mätpunkter, och diagrammet visar dem inom ett band på π ± 0,8 med en streckad referenslinje vid det sanna värdet. Ingenting rör sig av sig självt: autosläpp är avstängt som standard, så sidan står stilla tills du börjar kasta. Om ditt system ber om minskad rörelse fortsätter autosläpp att sampla i full takt men uppdaterar bilden, diagrammet och siffrorna bara två gånger i sekunden.",
        ],
        code: DROP_EXCERPT,
      },
      {
        heading: "Långsam konvergens och långa nålar",
        paragraphs: [
          "Skattningen vandrar omkring en hel del. Med standardvärdena ℓ = 50 och d = 60 är dess standardavvikelse ungefär 3/√n, så efter 10\u00a0000 nålar kan du räkna med ett fel på omkring 0,03, och varje ytterligare korrekt siffra kostar ungefär hundra gånger så många nålar. Bland nålar som inte är längre än linjeavståndet ger ℓ = d minst spridning. Den kvadratrotslagen delas av alla Monte Carlo-metoder. I ett berömt experiment från 1901 rapporterade Mario Lazzarini 355/113 utifrån 3408 nålar, ett resultat som är alldeles för bra för den här spridningen och som allmänt anses vara tillrättalagt.",
          "Så snart ℓ överstiger d visar panelen en anmärkning och skattningen glider bort från π. En lång nål kan korsa två linjer men räknas ändå bara en gång, och sannolikheten för minst en korsning är mindre än 2ℓ/(πd). Det förväntade antalet korsningar, räknade med multiplicitet, förblir exakt 2ℓ/(πd) för alla längder, så det systematiska felet kommer enbart av att man räknar händelser i stället för skärningspunkter. Vid ℓ = 1,5d lägger sig skattningen nära 3,85 i stället för 3,14.",
        ],
      },
    ],
    experimentsHeading: "Prova det här",
    experiments: [
      {
        title: "Känn på bruset",
        text: "Tryck på ”Släpp 1 000” några gånger och rensa däremellan. Skattningarna sprider sig ungefär mellan 3,0 och 3,3. Tryck sedan på ”Släpp 10 000” och lägg märke till att spridningen bara krymper med ungefär en faktor tre, inte tio.",
      },
      {
        title: "Den bästa nålen",
        text: "Låt d stå på 60 och sätt ℓ till 60, så att kvoten visar 1,00. Kör autosläpp med 500 per bildruta och jämför hur diagrammet darrar med en körning vid ℓ = 15. Den korta nålen korsar sällan, och dess skattning hoppar mycket mer.",
      },
      {
        title: "Se det systematiska felet dyka upp",
        text: "Sätt ℓ till 1,5d (90 px vid d = 60) och slå på autosläpp. Kurvan närmar sig inte den streckade π-linjen utan planar ut kring 3,85. Sänk ℓ till 60 igen så återvänder den till π.",
      },
      {
        title: "Bara kvoten spelar roll",
        text: "Prova d = 40 med ℓ = 30 och sedan d = 120 med ℓ = 90. Båda har ℓ/d = 0,75 och samma korsningssannolikhet på ungefär 0,48, så efter många släpp beter sig de två skattningarna likadant trots att bilderna ser helt olika ut.",
      },
    ],
  },
  no: {
    metaDescription:
      "Estimer π med Buffons nål: Slipp tusenvis av nåler på parallelle linjer, endre nålelengde og linjeavstand og se det løpende estimatet konvergere mot π.",
    heading: "Slik fungerer denne utforskeren",
    intro:
      "Det øvre panelet er et gulv med parallelle linjer, og hvert slipp kaster en nål på det på et tilfeldig sted og i en tilfeldig vinkel. Nåler som berører en linje, lyser ravgult, de andre forblir grå. Tell hvor ofte en nål krysser en linje, del, og π dukker opp fra ingensteds. Det nedre panelet tegner det løpende estimatet mot antall nåler, slik at du kan se tilfeldighet langsomt bli til en konstant.",
    sections: [
      {
        heading: "Hvorfor en nål kjenner til π",
        paragraphs: [
          "Spørsmålet går tilbake til Georges-Louis Leclerc, greve av Buffon, på 1700-tallet: Hvis en nål med lengde ℓ faller på et gulv med parallelle linjer i avstand d fra hverandre, og ℓ er høyst d, hvor stor er sjansen for at den krysser en linje? Bare to tall betyr noe. Det ene er avstanden fra nålens midtpunkt til nærmeste linje, uniformt fordelt mellom 0 og d/2. Det andre er vinkelen θ mellom nålen og linjene, uniformt fordelt mellom 0 og π. Nålen krysser en linje når den halve lengden projisert på vertikalen, (ℓ/2) sin θ, er lengre enn denne avstanden.",
          "Tar man gjennomsnittet over alle posisjoner og vinkler, blir dette et integral av sin θ, og det er gjennom dette integralet π kommer inn. Resultatet er sannsynligheten 2ℓ/(πd). Snu den om, og du får en estimator: Etter n slipp med k kryssinger er π ≈ 2ℓn/(dk). Det er nettopp formelen i hjørnet av lerretet.",
        ],
        formula: crossingFormula("kryssing"),
      },
      {
        heading: "Hva kontrollene gjør",
        paragraphs: [
          "«Linjeavstand d» går fra 40 til 120 px, standard 60. «Nålelengde ℓ» er knyttet til avstanden og går fra 0,2d til 1,5d, standard 50 px. Etiketten viser alltid forholdet ℓ/d. Endrer du en av dem, nullstilles alle tellinger, fordi estimatoren bruker gjeldende ℓ og d på totalene, og å blande slipp fra ulike innstillinger ville gi den en varig skjevhet.",
          "«Slipp 1 000» og «Slipp 10 000» kaster en hel bunke på én gang. «Autoslipp» fortsetter å kaste i hvert animasjonsbilde i valgt takt, fra 1 til 500 nåler per bilde, standard 40. Statistikkpanelet viser slipp, kryssinger, estimatet med seks desimaler og den relative feilen i prosent. «Tøm» begynner forfra med de samme innstillingene.",
        ],
      },
      {
        heading: "Slik er den bygget",
        paragraphs: [
          "Hvert slipp trekker tre tilfeldige tall: x, y og en vinkel i [0, π). Kryssingstesten leter ikke etter linjer i nærheten. Den reduserer y modulo d for å finne hvor midtpunktet ligger i stripen sin, og sjekker deretter om avstanden til midten av stripen pluss den projiserte halve lengden overstiger d/2. Det er den samme betingelsen som i utledningen, bare skrevet uten å skille mellom tilfeller.",
          "Én detalj holder estimatet ærlig. Høyden på lerretet er sjelden et helt multiplum av d, og å trekke y uniformt over hele høyden ville gjøre noen posisjoner i en stripe litt mer sannsynlige enn andre. Koden trekker derfor y bare over et helt antall striper. x-koordinaten spiller ingen rolle i testen, den sprer bare nålene utover bildet.",
          "Tellingene ligger i refs i stedet for i React-state, så en bunke på 10\u00a0000 nåler utløser bare én ny rendring. Bare de 240 nyeste nålene tas vare på i en ringbuffer for tegning, noe som holder bildet lesbart etter en million slipp. For hvert 25. slipp lagres det gjeldende estimatet, opptil 1200 målepunkter, og plottet viser dem innenfor et bånd på π ± 0,8 med en stiplet referanselinje ved den sanne verdien. Ingenting beveger seg av seg selv: Autoslipp er av som standard, så siden står stille til du begynner å kaste. Hvis systemet ditt ber om redusert bevegelse, fortsetter autoslipp å kaste i full takt, men oppdaterer bildet, plottet og tallene bare to ganger i sekundet.",
        ],
        code: DROP_EXCERPT,
      },
      {
        heading: "Langsom konvergens og lange nåler",
        paragraphs: [
          "Estimatet vandrer mye rundt. Med standardverdiene ℓ = 50 og d = 60 er standardavviket omtrent 3/√n, så etter 10\u00a0000 nåler kan du vente en feil på rundt 0,03, og hvert ekstra riktige siffer koster omtrent hundre ganger så mange nåler. Blant nåler som ikke er lengre enn linjeavstanden, gir ℓ = d minst spredning. Denne kvadratrotloven er felles for alle Monte Carlo-metoder. Et berømt eksperiment av Mario Lazzarini fra 1901 rapporterte 355/113 ut fra 3408 nåler, et resultat som er altfor godt for denne spredningen, og som de fleste mener var tilrettelagt.",
          "Så snart ℓ overstiger d, viser panelet en merknad, og estimatet driver bort fra π. En lang nål kan krysse to linjer, men telles likevel bare én gang, og sannsynligheten for minst én kryssing er mindre enn 2ℓ/(πd). Det forventede antallet kryssinger, talt med multiplisitet, forblir nøyaktig 2ℓ/(πd) for enhver lengde, så skjevheten kommer utelukkende av at man teller hendelser i stedet for skjæringspunkter. Ved ℓ = 1,5d legger estimatet seg nær 3,85 i stedet for 3,14.",
        ],
      },
    ],
    experimentsHeading: "Prøv dette",
    experiments: [
      {
        title: "Kjenn på støyen",
        text: "Trykk på «Slipp 1 000» noen ganger, og tøm mellom hver gang. Estimatene sprer seg omtrent mellom 3,0 og 3,3. Trykk deretter på «Slipp 10 000» og legg merke til at spredningen bare krymper med omtrent en faktor tre, ikke ti.",
      },
      {
        title: "Den beste nålen",
        text: "La d stå på 60 og sett ℓ til 60, slik at forholdet viser 1,00. Kjør autoslipp med 500 per bilde og sammenlign hvor mye plottet skjelver, med en kjøring ved ℓ = 15. Den korte nålen krysser sjelden, og estimatet hopper mye mer.",
      },
      {
        title: "Se skjevheten dukke opp",
        text: "Sett ℓ til 1,5d (90 px ved d = 60) og slå på autoslipp. Kurven nærmer seg ikke den stiplede π-linjen, men flater ut rundt 3,85. Senk ℓ tilbake til 60, så vender den tilbake til π.",
      },
      {
        title: "Bare forholdet teller",
        text: "Prøv d = 40 med ℓ = 30 og deretter d = 120 med ℓ = 90. Begge har ℓ/d = 0,75 og samme kryssingssannsynlighet på omtrent 0,48, så etter mange slipp oppfører de to estimatene seg likt selv om bildene ser helt forskjellige ut.",
      },
    ],
  },
};
