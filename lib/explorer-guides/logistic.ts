import type { ExplorerGuide } from "./types";

// Numbers quoted here (701 columns, 300 skipped and 200 drawn iterates, the
// slider ranges and defaults, the preset r values) match
// app/logistic/explorer/page.tsx; update both together.
const BIFURCATION_EXCERPT = `const NR = 700;      // r columns across the canvas
const skip = 300;    // transient iterates thrown away
const drawN = 200;   // iterates plotted per column
for (let i = 0; i <= NR; i++) {
  const rr = BIFURCATION_R_MIN + (i / NR) * (BIFURCATION_R_MAX - BIFURCATION_R_MIN);
  let x = 0.5;
  for (let k = 0; k < skip; k++) x = rr * x * (1 - x);
  for (let k = 0; k < drawN; k++) {
    x = rr * x * (1 - x);
    ctx.fillRect((i / NR) * W, (1 - x) * H, dot, dot);
  }
}
bifCacheRef.current = ctx.getImageData(0, 0, W, H);`;

// Same formula as the EN one, with the interval written for locales that use
// a decimal comma (2,5 instead of 2.5).
const MAP_FORMULA_DECIMAL_COMMA =
  "x_{n+1} = r\\,x_n\\,(1 - x_n), \\qquad x_n \\in [0, 1],\\; r \\in [2{,}5;\\, 4]";

export const LOGISTIC_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Explore the logistic map bifurcation diagram: drag r from 2.5 to 4, watch period doubling turn into chaos, and see the time series and code behind every point.",
    heading: "How this explorer works",
    intro:
      "The large pink picture is the bifurcation diagram of the logistic map. Each thin vertical column belongs to one value of the growth rate r, and the dots in that column are the values the map keeps visiting once it has forgotten where it started. Where the column shows one dot, the system settles on a single value; two dots mean it alternates; a smeared band means it never repeats. The cyan line marks the r you have chosen, and the amber chart below shows the actual sequence of values for that r, one iteration after another.",
    sections: [
      {
        heading: "One line of arithmetic",
        paragraphs: [
          "The rule is the discrete form of logistic growth. Read x as the fraction of a habitat that is occupied, between 0 and 1. Next generation's fraction is r times this year's fraction times the room that is still free. Small populations grow, crowded ones shrink, and r sets how hard the population overshoots. Robert May made this map famous in a 1976 article in Nature, precisely to show that such a simple rule can behave in very complicated ways.",
          "For r between 1 and 3 every orbit is pulled to the fixed point x* = 1 − 1/r. At r = 3 that point becomes unstable and a stable 2-cycle takes over. At r = 1 + √6 ≈ 3.4495 the 2-cycle doubles into a 4-cycle, then into 8, 16 and so on, each doubling arriving sooner than the last. The gaps shrink by a factor that approaches Feigenbaum's constant δ ≈ 4.6692, and the doublings pile up at r∞ ≈ 3.5699. Beyond that point most values of r give chaos.",
        ],
        formula: "x_{n+1} = r\\,x_n\\,(1 - x_n), \\qquad x_n \\in [0, 1],\\; r \\in [2.5, 4]",
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "Growth rate r runs from 2.5 to 4 in steps of 0.0005 and starts at 3.7, in the chaotic region. The eight preset buttons jump to landmarks: 2.5 (calm fixed point at 0.6), 3.0 (the first bifurcation), 3.45 (just past the birth of the 4-cycle), 3.56995 (the onset of chaos), 3.7 (deep chaos), 3.83 (inside the period-3 window, a clean 3-cycle), 3.9 (chaos again) and 4.0 (full chaos, where the orbit covers the whole interval).",
          "x₀ is the starting value, from 0.001 to 0.999, default 0.2. Burn-in (0 to 2000, default 200) is how many iterations are computed and thrown away before the time series starts, and Show (20 to 1000, default 200) is how many are drawn after that. Setting burn-in to 0 lets you watch the transient: how the orbit wanders before it falls onto its attractor.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "Both pictures are drawn on plain 2D canvases, without any animation loop. The bifurcation diagram is the expensive part: 701 columns of r, each starting from x = 0.5, iterating 300 times to discard the transient and then plotting the next 200 values as small semi-transparent dots. That is roughly 350,000 evaluations of the map, so the result is stored once as ImageData and only recomputed when the canvas changes size or the screen's pixel density changes.",
          "Moving the r slider does not touch that work. It restores the cached image with putImageData and draws the cyan cursor and its label on top, which is cheap enough to follow your finger. The time series is recomputed from scratch on every change of r, x₀, burn-in or Show: it iterates the map, joins the values with a line and marks each one with a dot. Nothing moves on its own, so reduced motion changes nothing here.",
        ],
        code: BIFURCATION_EXCERPT,
      },
      {
        heading: "Reading the diagram honestly",
        paragraphs: [
          "Near every bifurcation point the branches look thick and fuzzy instead of sharp. That is not a rendering bug. At the exact moment a cycle loses stability, orbits approach it extremely slowly, so 300 discarded iterations are not enough to land on it. Mathematicians call this critical slowing down, and the diagram shows it as smudges at r = 3 and around 3.45.",
          "Inside the chaotic band you will also see thin white stripes. These are periodic windows, ranges of r where order briefly returns. The widest one starts at r = 1 + √8 ≈ 3.8284 with a stable 3-cycle, which then period doubles into 6, 12 and 24 before chaos returns. By a theorem of Li and Yorke, a map like this that has a cycle of period 3 also has cycles of every other period.",
        ],
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "Catch intermittency",
        text: "Press the 3.83 preset and set Show to 1000: a clean 3-cycle. Now move r down to 3.8280, a hair below the window's edge at 3.8284. The orbit spends stretches of a few dozen steps almost repeating three values, then bursts into chaos, then calms down again.",
      },
      {
        title: "Test sensitive dependence",
        text: "At r = 4.0 note the shape of the time series, then move x₀ by a single step, from 0.200 to 0.201. After 200 burn-in iterations the two pictures have nothing in common. Repeat at r = 3.2 and nothing changes at all, because every start ends on the same 2-cycle.",
      },
      {
        title: "Watch the slowing down",
        text: "Set r to 3.0, burn-in to 0 and Show to 1000. The orbit zigzags around 0.667 and closes in painfully slowly. Move r to 2.8 and it settles within a few dozen steps.",
      },
      {
        title: "Count the doublings",
        text: "With burn-in at 2000, step r through 3.2, 3.5 and 3.56. The time series repeats every 2, 4 and 8 iterations. Each new period lives on a range of r roughly 4.7 times narrower than the one before, which is Feigenbaum's δ at work.",
      },
    ],
  },
  de: {
    metaDescription:
      "Bifurkationsdiagramm der logistischen Abbildung erkunden: r von 2,5 bis 4 ziehen, Periodenverdopplung ins Chaos kippen sehen, Zeitreihe und Code verstehen.",
    heading: "So funktioniert dieser Explorer",
    intro:
      "Das große rosafarbene Bild ist das Bifurkationsdiagramm der logistischen Abbildung. Jede schmale senkrechte Spalte gehört zu einem Wert der Wachstumsrate r, und die Punkte darin sind die Werte, die die Abbildung immer wieder besucht, sobald sie ihren Startwert vergessen hat. Ein Punkt in der Spalte heißt: Das System kommt auf einem Wert zur Ruhe. Zwei Punkte heißen: Es pendelt. Ein verschmiertes Band heißt: Es wiederholt sich nie. Die cyanfarbene Linie markiert dein gewähltes r, und die bernsteinfarbene Kurve darunter zeigt die tatsächliche Folge der Werte für dieses r, Iteration für Iteration.",
    sections: [
      {
        heading: "Eine Zeile Arithmetik",
        paragraphs: [
          "Die Regel ist die diskrete Form des logistischen Wachstums. Lies x als den Anteil eines Lebensraums, der besetzt ist, zwischen 0 und 1. Der Anteil der nächsten Generation ist r mal der heutige Anteil mal der Platz, der noch frei ist. Kleine Populationen wachsen, überfüllte schrumpfen, und r bestimmt, wie heftig die Population über das Ziel hinausschießt. Robert May machte diese Abbildung 1976 mit einem Artikel in Nature bekannt, gerade um zu zeigen, dass so eine einfache Regel sehr kompliziertes Verhalten erzeugen kann.",
          "Für r zwischen 1 und 3 läuft jede Bahn auf den Fixpunkt x* = 1 − 1/r zu. Bei r = 3 wird dieser Punkt instabil, und ein stabiler 2-Zyklus übernimmt. Bei r = 1 + √6 ≈ 3,4495 verdoppelt sich der 2-Zyklus zu einem 4-Zyklus, dann zu 8, 16 und so weiter, wobei jede Verdopplung früher kommt als die vorige. Die Abstände schrumpfen um einen Faktor, der gegen Feigenbaums Konstante δ ≈ 4,6692 strebt, und die Verdopplungen häufen sich bei r∞ ≈ 3,5699. Dahinter liefern die meisten r-Werte Chaos.",
        ],
        formula: MAP_FORMULA_DECIMAL_COMMA,
      },
      {
        heading: "Was die Regler bewirken",
        paragraphs: [
          "Die Wachstumsrate r reicht von 2,5 bis 4 in Schritten von 0,0005 und startet bei 3,7, mitten im chaotischen Bereich. Die acht Voreinstellungen springen zu Wegmarken: 2,5 (ruhiger Fixpunkt bei 0,6), 3,0 (die erste Bifurkation), 3,45 (knapp nach der Geburt des 4-Zyklus), 3,56995 (Beginn des Chaos), 3,7 (tiefes Chaos), 3,83 (im Periode-3-Fenster, ein sauberer 3-Zyklus), 3,9 (wieder Chaos) und 4,0 (volles Chaos, die Bahn überdeckt das ganze Intervall).",
          "x₀ ist der Startwert, von 0,001 bis 0,999, voreingestellt auf 0,2. Einschwingen (0 bis 2000, Standard 200) legt fest, wie viele Iterationen berechnet und verworfen werden, bevor die Zeitreihe beginnt. Anzeigen (20 bis 1000, Standard 200) bestimmt, wie viele danach gezeichnet werden. Mit Einschwingen auf 0 siehst du den Übergang: wie die Bahn herumirrt, bevor sie auf ihren Attraktor fällt.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Beide Bilder entstehen auf einfachen 2D-Canvas-Flächen, ganz ohne Animationsschleife. Teuer ist das Bifurkationsdiagramm: 701 Spalten für r, jede startet bei x = 0,5, iteriert 300-mal, um den Übergang zu verwerfen, und zeichnet dann die nächsten 200 Werte als kleine halbtransparente Punkte. Das sind ungefähr 350.000 Auswertungen der Abbildung. Deshalb wird das Ergebnis einmal als ImageData gespeichert und nur neu berechnet, wenn sich die Größe des Canvas oder die Pixeldichte des Bildschirms ändert.",
          "Der r-Regler rührt diese Arbeit nicht an. Er stellt das gespeicherte Bild per putImageData wieder her und zeichnet nur den cyanfarbenen Cursor samt Beschriftung darüber. Das ist billig genug, um deinem Finger zu folgen. Die Zeitreihe wird bei jeder Änderung von r, x₀, Einschwingen oder Anzeigen komplett neu berechnet: Sie iteriert die Abbildung, verbindet die Werte mit einer Linie und markiert jeden mit einem Punkt. Weil sich nichts von selbst bewegt, sieht die Seite mit reduzierter Bewegung genauso aus.",
        ],
        code: BIFURCATION_EXCERPT,
      },
      {
        heading: "Das Diagramm richtig lesen",
        paragraphs: [
          "In der Nähe jedes Bifurkationspunkts wirken die Äste dick und unscharf statt scharf. Das ist kein Darstellungsfehler. Genau dort, wo ein Zyklus seine Stabilität verliert, nähern sich die Bahnen ihm extrem langsam, und 300 verworfene Iterationen reichen nicht, um anzukommen. Mathematiker:innen nennen das kritische Verlangsamung, und im Diagramm zeigt sie sich als Schlieren bei r = 3 und um 3,45.",
          "Im chaotischen Band entdeckst du außerdem dünne weiße Streifen. Das sind periodische Fenster, Bereiche von r, in denen kurz wieder Ordnung herrscht. Das breiteste beginnt bei r = 1 + √8 ≈ 3,8284 mit einem stabilen 3-Zyklus, der sich zu 6, 12 und 24 verdoppelt, bevor das Chaos zurückkehrt. Nach einem Satz von Li und Yorke hat eine solche Abbildung, sobald sie einen Zyklus der Periode 3 besitzt, auch Zyklen jeder anderen Periode.",
        ],
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Intermittenz einfangen",
        text: "Drück die Voreinstellung 3,83 und stell Anzeigen auf 1000: ein sauberer 3-Zyklus. Schieb r dann hinunter auf 3,8280, haarscharf unter den Rand des Fensters bei 3,8284. Die Bahn wiederholt ein paar Dutzend Schritte lang fast genau drei Werte, bricht dann chaotisch aus und beruhigt sich wieder.",
      },
      {
        title: "Empfindliche Abhängigkeit testen",
        text: "Merk dir bei r = 4,0 die Form der Zeitreihe und verschiebe x₀ dann um einen einzigen Schritt, von 0,200 auf 0,201. Nach 200 Iterationen Einschwingen haben die beiden Bilder nichts mehr gemeinsam. Wiederhole das bei r = 3,2, und nichts ändert sich, weil jeder Start auf demselben 2-Zyklus endet.",
      },
      {
        title: "Die Verlangsamung sehen",
        text: "Stell r auf 3,0, Einschwingen auf 0 und Anzeigen auf 1000. Die Bahn zackt um 0,667 herum und nähert sich quälend langsam. Bei r = 2,8 kommt sie nach wenigen Dutzend Schritten zur Ruhe.",
      },
      {
        title: "Die Verdopplungen zählen",
        text: "Setz Einschwingen auf 2000 und geh r über 3,2, 3,5 und 3,56 durch. Die Zeitreihe wiederholt sich alle 2, 4 und 8 Iterationen. Jede neue Periode lebt auf einem r-Bereich, der etwa 4,7-mal schmaler ist als der vorige. Genau da wirkt Feigenbaums δ.",
      },
    ],
  },
  es: {
    metaDescription:
      "Explora el diagrama de bifurcación del mapa logístico: mueve r de 2,5 a 4, mira cómo la duplicación de periodo lleva al caos y lee el código.",
    heading: "Cómo funciona este explorador",
    intro:
      "La gran imagen rosa es el diagrama de bifurcación del mapa logístico. Cada fina columna vertical corresponde a un valor de la tasa de crecimiento r, y los puntos de esa columna son los valores que el mapa sigue visitando una vez que ha olvidado dónde empezó. Donde la columna muestra un punto, el sistema se asienta en un único valor; dos puntos significan que alterna; una banda difuminada significa que nunca se repite. La línea cian marca el r que has elegido, y el gráfico ámbar de abajo muestra la sucesión real de valores para ese r, una iteración tras otra.",
    sections: [
      {
        heading: "Una línea de aritmética",
        paragraphs: [
          "La regla es la forma discreta del crecimiento logístico. Lee x como la fracción de un hábitat que está ocupada, entre 0 y 1. La fracción de la generación siguiente es r por la fracción de este año por el espacio que aún queda libre. Las poblaciones pequeñas crecen, las apiñadas menguan, y r fija con cuánta fuerza la población se pasa de largo. Robert May hizo famoso este mapa en un artículo de 1976 en Nature, precisamente para mostrar que una regla tan simple puede comportarse de maneras muy complicadas.",
          "Para r entre 1 y 3, toda órbita es atraída hacia el punto fijo x* = 1 − 1/r. En r = 3 ese punto se vuelve inestable y toma el relevo un ciclo estable de periodo 2. En r = 1 + √6 ≈ 3,4495 el 2-ciclo se duplica en un 4-ciclo, luego en 8, 16 y así sucesivamente, y cada duplicación llega antes que la anterior. Los intervalos se encogen en un factor que tiende a la constante de Feigenbaum δ ≈ 4,6692, y las duplicaciones se acumulan en r∞ ≈ 3,5699. Más allá de ese punto, la mayoría de los valores de r dan caos.",
        ],
        formula: MAP_FORMULA_DECIMAL_COMMA,
      },
      {
        heading: "Qué hacen los controles",
        paragraphs: [
          "«Tasa de crecimiento r» va de 2,5 a 4 en pasos de 0,0005 y empieza en 3,7, en la región caótica. Los ocho botones de preajuste saltan a puntos de referencia: 2,5 (punto fijo tranquilo en 0,6); 3,0 (la primera bifurcación); 3,45 (justo después del nacimiento del 4-ciclo); 3,56995 (el inicio del caos); 3,7 (caos profundo); 3,83 (dentro de la ventana de periodo 3, un 3-ciclo limpio); 3,9 (caos otra vez) y 4,0 (caos total, donde la órbita cubre todo el intervalo).",
          "x₀ es el valor inicial, de 0,001 a 0,999, con 0,2 por defecto. «Calentamiento» (de 0 a 2000, 200 por defecto) es el número de iteraciones que se calculan y se desechan antes de que empiece la serie temporal, y «Mostrar» (de 20 a 1000, 200 por defecto) es cuántas se dibujan después. Poner el calentamiento a 0 te deja ver el transitorio: cómo vaga la órbita antes de caer sobre su atractor.",
        ],
      },
      {
        heading: "Cómo está construido",
        paragraphs: [
          "Las dos imágenes se dibujan en lienzos 2D corrientes, sin ningún bucle de animación. El diagrama de bifurcación es la parte costosa: 701 columnas de r, cada una partiendo de x = 0,5, que itera 300 veces para descartar el transitorio y luego dibuja los 200 valores siguientes como pequeños puntos semitransparentes. Son unas 350 000 evaluaciones del mapa, así que el resultado se guarda una sola vez como ImageData y solo se recalcula cuando el lienzo cambia de tamaño o cambia la densidad de píxeles de la pantalla.",
          "Mover el deslizador de r no toca ese trabajo. Restaura la imagen guardada con putImageData y dibuja encima el cursor cian y su etiqueta, lo que sale lo bastante barato como para seguir a tu dedo. La serie temporal se recalcula desde cero con cada cambio de r, x₀, «Calentamiento» o «Mostrar»: itera el mapa, une los valores con una línea y marca cada uno con un punto. Nada se mueve por sí solo, así que el movimiento reducido no cambia nada aquí.",
        ],
        code: BIFURCATION_EXCERPT,
      },
      {
        heading: "Leer el diagrama con honestidad",
        paragraphs: [
          "Cerca de cada punto de bifurcación las ramas se ven gruesas y borrosas en lugar de nítidas. No es un fallo del dibujo. En el momento exacto en que un ciclo pierde la estabilidad, las órbitas se acercan a él con extrema lentitud, así que 300 iteraciones descartadas no bastan para llegar hasta él. En matemáticas esto se llama ralentización crítica, y el diagrama la muestra como manchas en r = 3 y en torno a 3,45.",
          "Dentro de la banda caótica verás también finas franjas blancas. Son ventanas periódicas, intervalos de r donde el orden regresa por un momento. La más ancha empieza en r = 1 + √8 ≈ 3,8284 con un 3-ciclo estable, que luego duplica su periodo a 6, 12 y 24 antes de que vuelva el caos. Por un teorema de Li y Yorke, un mapa como este que tiene un ciclo de periodo 3 tiene también ciclos de todos los demás periodos.",
        ],
      },
    ],
    experimentsHeading: "Prueba esto",
    experiments: [
      {
        title: "Caza la intermitencia",
        text: "Pulsa el botón de preajuste 3,83 y pon «Mostrar» en 1000: un 3-ciclo limpio. Ahora baja r a 3,8280, un pelo por debajo del borde de la ventana en 3,8284. La órbita pasa tramos de unas pocas decenas de pasos repitiendo casi tres valores, luego estalla en caos y después vuelve a calmarse.",
      },
      {
        title: "Pon a prueba la dependencia sensible",
        text: "En r = 4,0 fíjate en la forma de la serie temporal y luego mueve x₀ un solo paso, de 0,200 a 0,201. Tras 200 iteraciones de calentamiento, las dos imágenes no tienen nada en común. Repítelo en r = 3,2 y no cambia absolutamente nada, porque todo comienzo acaba en el mismo 2-ciclo.",
      },
      {
        title: "Observa la ralentización",
        text: "Pon r en 3,0, «Calentamiento» en 0 y «Mostrar» en 1000. La órbita zigzaguea alrededor de 0,667 y se va cerrando con una lentitud exasperante. Lleva r a 2,8 y se asienta en unas pocas decenas de pasos.",
      },
      {
        title: "Cuenta las duplicaciones",
        text: "Con «Calentamiento» en 2000, lleva r por 3,2; 3,5 y 3,56. La serie temporal se repite cada 2, 4 y 8 iteraciones. Cada periodo nuevo vive en un intervalo de r unas 4,7 veces más estrecho que el anterior, y eso es la δ de Feigenbaum en acción.",
      },
    ],
  },
  fr: {
    metaDescription:
      "Explore le diagramme de bifurcation de la suite logistique : fais glisser r de 2,5 à 4, regarde le doublement de période mener au chaos et lis le code.",
    heading: "Comment fonctionne cet explorateur",
    intro:
      "La grande image rose est le diagramme de bifurcation de la suite logistique. Chaque fine colonne verticale correspond à une valeur du taux de croissance r, et les points de cette colonne sont les valeurs que la suite continue de visiter une fois qu'elle a oublié d'où elle est partie. Là où la colonne montre un point, le système se stabilise sur une seule valeur ; deux points signifient qu'il alterne ; une bande étalée signifie qu'il ne se répète jamais. La ligne cyan marque le r que tu as choisi, et le graphique ambré en dessous montre la véritable suite de valeurs pour ce r, une itération après l'autre.",
    sections: [
      {
        heading: "Une ligne d'arithmétique",
        paragraphs: [
          "La règle est la forme discrète de la croissance logistique. Lis x comme la fraction d'un habitat qui est occupée, entre 0 et 1. La fraction de la génération suivante vaut r fois la fraction de cette année fois la place encore libre. Les petites populations croissent, les populations à l'étroit diminuent, et r fixe la force avec laquelle la population dépasse la cible. Robert May a rendu cette suite célèbre dans un article paru en 1976 dans Nature, précisément pour montrer qu'une règle aussi simple peut se comporter de façon très compliquée.",
          "Pour r compris entre 1 et 3, toute orbite est attirée vers le point fixe x* = 1 − 1/r. En r = 3, ce point devient instable et un cycle stable de période 2 prend le relais. En r = 1 + √6 ≈ 3,4495, le 2-cycle se dédouble en un 4-cycle, puis en 8, 16 et ainsi de suite, chaque doublement arrivant plus tôt que le précédent. Les intervalles rétrécissent d'un facteur qui tend vers la constante de Feigenbaum δ ≈ 4,6692, et les doublements s'accumulent en r∞ ≈ 3,5699. Au-delà de ce point, la plupart des valeurs de r donnent du chaos.",
        ],
        formula: MAP_FORMULA_DECIMAL_COMMA,
      },
      {
        heading: "À quoi servent les commandes",
        paragraphs: [
          "« Taux de croissance r » va de 2,5 à 4 par pas de 0,0005 et démarre à 3,7, dans la région chaotique. Les huit boutons de préréglage sautent vers des repères : 2,5 (point fixe calme en 0,6), 3,0 (la première bifurcation), 3,45 (juste après la naissance du 4-cycle), 3,56995 (le début du chaos), 3,7 (chaos profond), 3,83 (dans la fenêtre de période 3, un 3-cycle bien net), 3,9 (de nouveau le chaos) et 4,0 (chaos total, où l'orbite couvre tout l'intervalle).",
          "x₀ est la valeur de départ, de 0,001 à 0,999 (0,2 par défaut). « Rodage » (de 0 à 2\u00a0000, 200 par défaut) est le nombre d'itérations calculées puis jetées avant que la série temporelle ne commence, et « Afficher » (de 20 à 1\u00a0000, 200 par défaut) le nombre d'itérations dessinées ensuite. Mettre le rodage à 0 te laisse observer le régime transitoire : la façon dont l'orbite erre avant de tomber sur son attracteur.",
        ],
      },
      {
        heading: "Comment c'est construit",
        paragraphs: [
          "Les deux images sont dessinées sur de simples canevas 2D, sans aucune boucle d'animation. Le diagramme de bifurcation est la partie coûteuse : 701 colonnes de r, chacune partant de x = 0,5, itérant 300 fois pour écarter le régime transitoire puis traçant les 200 valeurs suivantes sous forme de petits points semi-transparents. Cela fait environ 350\u00a0000 évaluations de la fonction, le résultat est donc stocké une fois pour toutes en ImageData et n'est recalculé que lorsque le canevas change de taille ou que la densité de pixels de l'écran change.",
          "Déplacer le curseur de r ne touche pas à ce travail. L'image en cache est restaurée avec putImageData, puis le curseur cyan et son étiquette sont dessinés par-dessus, ce qui est assez léger pour suivre ton doigt. La série temporelle est recalculée de zéro à chaque changement de r, de x₀, de « Rodage » ou d'« Afficher » : elle itère la fonction, relie les valeurs par une ligne et marque chacune d'un point. Rien ne bouge tout seul, la réduction des animations ne change donc rien ici.",
        ],
        code: BIFURCATION_EXCERPT,
      },
      {
        heading: "Lire le diagramme honnêtement",
        paragraphs: [
          "Près de chaque point de bifurcation, les branches paraissent épaisses et floues plutôt que nettes. Ce n'est pas un défaut d'affichage. À l'instant précis où un cycle perd sa stabilité, les orbites s'en approchent extrêmement lentement, si bien que 300 itérations écartées ne suffisent pas pour l'atteindre. Les mathématiques appellent cela le ralentissement critique, et le diagramme le montre sous forme de bavures en r = 3 et autour de 3,45.",
          "À l'intérieur de la bande chaotique, tu verras aussi de fines rayures blanches. Ce sont des fenêtres périodiques, des plages de r où l'ordre revient brièvement. La plus large commence en r = 1 + √8 ≈ 3,8284 avec un 3-cycle stable, dont la période double ensuite en 6, 12 et 24 avant le retour du chaos. D'après un théorème de Li et Yorke, une fonction comme celle-ci qui possède un cycle de période 3 possède aussi des cycles de toutes les autres périodes.",
        ],
      },
    ],
    experimentsHeading: "À essayer",
    experiments: [
      {
        title: "Surprends l'intermittence",
        text: "Appuie sur le préréglage 3,83 et règle « Afficher » sur 1\u00a0000 : un 3-cycle bien net. Descends maintenant r à 3,8280, un cheveu en dessous du bord de la fenêtre en 3,8284. L'orbite passe des séquences de quelques dizaines de pas à répéter presque trois valeurs, puis éclate en chaos, puis se calme de nouveau.",
      },
      {
        title: "Teste la sensibilité aux conditions initiales",
        text: "En r = 4,0, note la forme de la série temporelle, puis déplace x₀ d'un seul cran, de 0,200 à 0,201. Après 200 itérations de rodage, les deux images n'ont plus rien en commun. Recommence en r = 3,2 et rien ne change du tout, parce que tout départ aboutit au même 2-cycle.",
      },
      {
        title: "Observe le ralentissement",
        text: "Règle r sur 3,0, « Rodage » sur 0 et « Afficher » sur 1\u00a0000. L'orbite zigzague autour de 0,667 et se resserre avec une lenteur pénible. Passe r à 2,8 et elle se stabilise en quelques dizaines de pas.",
      },
      {
        title: "Compte les doublements",
        text: "Avec « Rodage » à 2\u00a0000, fais passer r par 3,2 ; 3,5 et 3,56. La série temporelle se répète toutes les 2, 4 et 8 itérations. Chaque nouvelle période vit sur une plage de r environ 4,7 fois plus étroite que la précédente, et c'est le δ de Feigenbaum à l'œuvre.",
      },
    ],
  },
  it: {
    metaDescription:
      "Esplora il diagramma di biforcazione della mappa logistica: trascina r da 2,5 a 4, guarda il raddoppio del periodo portare al caos e leggi il codice.",
    heading: "Come funziona questo esploratore",
    intro:
      "La grande immagine rosa è il diagramma di biforcazione della mappa logistica. Ogni sottile colonna verticale appartiene a un valore del tasso di crescita r, e i puntini in quella colonna sono i valori che la mappa continua a visitare una volta dimenticato da dove è partita. Dove la colonna mostra un puntino, il sistema si assesta su un unico valore; due puntini significano che alterna; una banda sfumata significa che non si ripete mai. La linea ciano segna l'r che hai scelto, e il grafico ambra qui sotto mostra l'effettiva successione di valori per quell'r, un'iterazione dopo l'altra.",
    sections: [
      {
        heading: "Una riga di aritmetica",
        paragraphs: [
          "La regola è la forma discreta della crescita logistica. Leggi x come la frazione occupata di un habitat, tra 0 e 1. La frazione della generazione successiva è r per la frazione di quest'anno per lo spazio ancora libero. Le popolazioni piccole crescono, quelle affollate si riducono, e r stabilisce con quanta forza la popolazione va oltre il segno. Robert May rese famosa questa mappa in un articolo del 1976 su Nature, proprio per mostrare che una regola tanto semplice può comportarsi in modi molto complicati.",
          "Per r compreso tra 1 e 3 ogni orbita è attratta dal punto fisso x* = 1 − 1/r. In r = 3 quel punto diventa instabile e subentra un ciclo stabile di periodo 2. In r = 1 + √6 ≈ 3,4495 il 2-ciclo si sdoppia in un 4-ciclo, poi in 8, 16 e così via, e ogni raddoppio arriva prima del precedente. Gli intervalli si restringono di un fattore che tende alla costante di Feigenbaum δ ≈ 4,6692, e i raddoppi si accumulano in r∞ ≈ 3,5699. Oltre quel punto, la maggior parte dei valori di r dà caos.",
        ],
        formula: MAP_FORMULA_DECIMAL_COMMA,
      },
      {
        heading: "Che cosa fanno i controlli",
        paragraphs: [
          "«Tasso di crescita r» va da 2,5 a 4 a passi di 0,0005 e parte da 3,7, nella regione caotica. Gli otto pulsanti dei preset saltano a punti di riferimento: 2,5 (punto fisso tranquillo in 0,6), 3,0 (la prima biforcazione), 3,45 (subito dopo la nascita del 4-ciclo), 3,56995 (l'inizio del caos), 3,7 (caos profondo), 3,83 (dentro la finestra di periodo 3, un 3-ciclo pulito), 3,9 (di nuovo caos) e 4,0 (caos pieno, dove l'orbita copre l'intero intervallo).",
          "x₀ è il valore iniziale, da 0,001 a 0,999, predefinito 0,2. «Assestamento» (da 0 a 2000, predefinito 200) è il numero di iterazioni calcolate e scartate prima che cominci la serie temporale, e «Mostra» (da 20 a 1000, predefinito 200) è quante ne vengono disegnate dopo. Impostare l'assestamento a 0 ti fa osservare il transitorio: come l'orbita vaga prima di cadere sul suo attrattore.",
        ],
      },
      {
        heading: "Com'è costruito",
        paragraphs: [
          "Entrambe le immagini sono disegnate su semplici canvas 2D, senza alcun ciclo di animazione. Il diagramma di biforcazione è la parte costosa: 701 colonne di r, ciascuna a partire da x = 0,5, che itera 300 volte per scartare il transitorio e poi traccia i 200 valori successivi come piccoli puntini semitrasparenti. Sono circa 350.000 valutazioni della mappa, quindi il risultato viene salvato una volta sola come ImageData e ricalcolato soltanto quando il canvas cambia dimensione o cambia la densità di pixel dello schermo.",
          "Muovere il cursore di r non tocca quel lavoro. Ripristina l'immagine in cache con putImageData e ci disegna sopra il cursore ciano con la sua etichetta, il che costa abbastanza poco da seguire il tuo dito. La serie temporale viene ricalcolata da capo a ogni modifica di r, x₀, «Assestamento» o «Mostra»: itera la mappa, unisce i valori con una linea e segna ciascuno con un puntino. Niente si muove da solo, quindi qui il movimento ridotto non cambia nulla.",
        ],
        code: BIFURCATION_EXCERPT,
      },
      {
        heading: "Leggere il diagramma con onestà",
        paragraphs: [
          "Vicino a ogni punto di biforcazione i rami appaiono spessi e sfocati invece che netti. Non è un difetto del disegno. Nel momento esatto in cui un ciclo perde stabilità, le orbite gli si avvicinano con estrema lentezza, quindi 300 iterazioni scartate non bastano per raggiungerlo. In matematica questo si chiama rallentamento critico, e il diagramma lo mostra come sbavature in r = 3 e intorno a 3,45.",
          "Dentro la banda caotica vedrai anche sottili strisce bianche. Sono finestre periodiche, intervalli di r in cui l'ordine ritorna per un attimo. La più larga comincia in r = 1 + √8 ≈ 3,8284 con un 3-ciclo stabile, che poi raddoppia il periodo in 6, 12 e 24 prima che torni il caos. Per un teorema di Li e Yorke, una mappa come questa che ha un ciclo di periodo 3 ha anche cicli di ogni altro periodo.",
        ],
      },
    ],
    experimentsHeading: "Prova così",
    experiments: [
      {
        title: "Cattura l'intermittenza",
        text: "Premi il preset 3,83 e imposta «Mostra» a 1000: un 3-ciclo pulito. Ora abbassa r a 3,8280, un soffio sotto il bordo della finestra in 3,8284. L'orbita passa tratti di qualche decina di passi a ripetere quasi tre valori, poi esplode nel caos, poi si calma di nuovo.",
      },
      {
        title: "Metti alla prova la dipendenza sensibile",
        text: "In r = 4,0 osserva la forma della serie temporale, poi sposta x₀ di un solo scatto, da 0,200 a 0,201. Dopo 200 iterazioni di assestamento le due immagini non hanno più nulla in comune. Ripeti in r = 3,2 e non cambia assolutamente niente, perché ogni partenza finisce sullo stesso 2-ciclo.",
      },
      {
        title: "Osserva il rallentamento",
        text: "Imposta r a 3,0, «Assestamento» a 0 e «Mostra» a 1000. L'orbita zigzaga attorno a 0,667 e si stringe con una lentezza esasperante. Porta r a 2,8 e si assesta in poche decine di passi.",
      },
      {
        title: "Conta i raddoppi",
        text: "Con «Assestamento» a 2000, fai passare r per 3,2, 3,5 e 3,56. La serie temporale si ripete ogni 2, 4 e 8 iterazioni. Ogni nuovo periodo vive su un intervallo di r circa 4,7 volte più stretto del precedente, ed è la δ di Feigenbaum all'opera.",
      },
    ],
  },
  pt: {
    metaDescription:
      "Explora o diagrama de bifurcação do mapa logístico: arrasta r de 2,5 a 4, vê a duplicação de período transformar-se em caos e lê o código por trás.",
    heading: "Como funciona este explorador",
    intro:
      "A grande imagem cor-de-rosa é o diagrama de bifurcação do mapa logístico. Cada coluna vertical fina pertence a um valor da taxa de crescimento r, e os pontos dessa coluna são os valores que o mapa continua a visitar depois de ter esquecido onde começou. Onde a coluna mostra um ponto, o sistema assenta num único valor; dois pontos significam que alterna; uma faixa esborratada significa que nunca se repete. A linha ciano marca o r que escolheste, e o gráfico âmbar em baixo mostra a sequência real de valores para esse r, uma iteração após outra.",
    sections: [
      {
        heading: "Uma linha de aritmética",
        paragraphs: [
          "A regra é a forma discreta do crescimento logístico. Lê x como a fração ocupada de um habitat, entre 0 e 1. A fração da geração seguinte é r vezes a fração deste ano vezes o espaço que ainda está livre. As populações pequenas crescem, as apinhadas encolhem, e r define com que força a população ultrapassa o alvo. Robert May tornou este mapa famoso num artigo de 1976 na Nature, precisamente para mostrar que uma regra tão simples pode comportar-se de formas muito complicadas.",
          "Para r entre 1 e 3, todas as órbitas são atraídas para o ponto fixo x* = 1 − 1/r. Em r = 3 esse ponto torna-se instável e um ciclo estável de período 2 toma o seu lugar. Em r = 1 + √6 ≈ 3,4495 o ciclo de período 2 duplica para um de período 4, depois para 8, 16 e assim por diante, com cada duplicação a chegar mais cedo do que a anterior. Os intervalos encolhem por um fator que tende para a constante de Feigenbaum δ ≈ 4,6692, e as duplicações acumulam-se em r∞ ≈ 3,5699. Para lá desse ponto, a maioria dos valores de r dá caos.",
        ],
        formula: MAP_FORMULA_DECIMAL_COMMA,
      },
      {
        heading: "O que fazem os controlos",
        paragraphs: [
          "«Taxa de crescimento r» vai de 2,5 a 4 em passos de 0,0005 e começa em 3,7, na região caótica. Os oito botões de predefinição saltam para marcos: 2,5 (ponto fixo calmo em 0,6); 3,0 (a primeira bifurcação); 3,45 (logo a seguir ao nascimento do ciclo de período 4); 3,56995 (o início do caos); 3,7 (caos profundo); 3,83 (dentro da janela de período 3, um ciclo de período 3 limpo); 3,9 (caos outra vez) e 4,0 (caos total, onde a órbita cobre todo o intervalo).",
          "x₀ é o valor inicial, de 0,001 a 0,999, 0,2 por omissão. «Aquecimento» (de 0 a 2000, 200 por omissão) é o número de iterações calculadas e deitadas fora antes de a série temporal começar, e «Mostrar» (de 20 a 1000, 200 por omissão) é quantas são desenhadas depois disso. Pôr o aquecimento a 0 deixa-te ver o transitório: como a órbita vagueia antes de cair no seu atrator.",
        ],
      },
      {
        heading: "Como está construído",
        paragraphs: [
          "As duas imagens são desenhadas em canvas 2D simples, sem qualquer ciclo de animação. O diagrama de bifurcação é a parte cara: 701 colunas de r, cada uma a partir de x = 0,5, que itera 300 vezes para descartar o transitório e depois desenha os 200 valores seguintes como pequenos pontos semitransparentes. São cerca de 350\u00a0000 avaliações do mapa, pelo que o resultado é guardado uma única vez como ImageData e só é recalculado quando o canvas muda de tamanho ou a densidade de píxeis do ecrã se altera.",
          "Mover o cursor de r não toca nesse trabalho. Repõe a imagem em cache com putImageData e desenha por cima o marcador ciano e a sua etiqueta, o que é barato o suficiente para acompanhar o teu dedo. A série temporal é recalculada de raiz a cada alteração de r, x₀, «Aquecimento» ou «Mostrar»: itera o mapa, une os valores com uma linha e marca cada um com um ponto. Nada se move sozinho, por isso o movimento reduzido não muda nada aqui.",
        ],
        code: BIFURCATION_EXCERPT,
      },
      {
        heading: "Ler o diagrama com honestidade",
        paragraphs: [
          "Perto de cada ponto de bifurcação, os ramos parecem grossos e difusos em vez de nítidos. Não é um defeito do desenho. No momento exato em que um ciclo perde a estabilidade, as órbitas aproximam-se dele com extrema lentidão, pelo que 300 iterações descartadas não chegam para lá aterrar. Em matemática chama-se a isto abrandamento crítico, e o diagrama mostra-o como borrões em r = 3 e por volta de 3,45.",
          "Dentro da faixa caótica verás também finas riscas brancas. São janelas periódicas, intervalos de r onde a ordem regressa por instantes. A mais larga começa em r = 1 + √8 ≈ 3,8284 com um ciclo estável de período 3, que depois duplica o período para 6, 12 e 24 antes de o caos voltar. Por um teorema de Li e Yorke, um mapa como este que tenha um ciclo de período 3 tem também ciclos de todos os outros períodos.",
        ],
      },
    ],
    experimentsHeading: "Experimenta isto",
    experiments: [
      {
        title: "Apanha a intermitência",
        text: "Carrega no botão de predefinição 3,83 e põe «Mostrar» em 1000: um ciclo de período 3 limpo. Agora desce r para 3,8280, um nadinha abaixo da margem da janela em 3,8284. A órbita passa troços de algumas dezenas de passos quase a repetir três valores, depois rebenta em caos, depois acalma outra vez.",
      },
      {
        title: "Testa a dependência sensível",
        text: "Em r = 4,0 repara na forma da série temporal e depois move x₀ um único passo, de 0,200 para 0,201. Ao fim de 200 iterações de aquecimento, as duas imagens não têm nada em comum. Repete em r = 3,2 e não muda rigorosamente nada, porque todos os começos acabam no mesmo ciclo de período 2.",
      },
      {
        title: "Observa o abrandamento",
        text: "Põe r em 3,0, «Aquecimento» em 0 e «Mostrar» em 1000. A órbita ziguezagueia à volta de 0,667 e vai-se fechando com uma lentidão penosa. Passa r para 2,8 e ela assenta em poucas dezenas de passos.",
      },
      {
        title: "Conta as duplicações",
        text: "Com «Aquecimento» em 2000, leva r por 3,2; 3,5 e 3,56. A série temporal repete-se a cada 2, 4 e 8 iterações. Cada novo período vive num intervalo de r cerca de 4,7 vezes mais estreito do que o anterior, e isso é o δ de Feigenbaum em ação.",
      },
    ],
  },
  sv: {
    metaDescription:
      "Utforska bifurkationsdiagrammet för den logistiska avbildningen: dra r från 2,5 till 4, se periodfördubbling bli kaos och läs koden bakom varje punkt.",
    heading: "Så fungerar den här utforskaren",
    intro:
      "Den stora rosa bilden är bifurkationsdiagrammet för den logistiska avbildningen. Varje tunn lodrät kolumn hör till ett värde på tillväxttakten r, och prickarna i kolumnen är de värden som avbildningen fortsätter att besöka när den väl har glömt var den började. Där kolumnen visar en prick stannar systemet på ett enda värde. Två prickar betyder att det växlar, och ett utsmetat band betyder att det aldrig upprepar sig. Den cyanfärgade linjen markerar det r du har valt, och det bärnstensfärgade diagrammet nedanför visar den faktiska följden av värden för det r:et, en iteration i taget.",
    sections: [
      {
        heading: "En rad aritmetik",
        paragraphs: [
          "Regeln är den diskreta formen av logistisk tillväxt. Läs x som den andel av en livsmiljö som är upptagen, mellan 0 och 1. Nästa generations andel är r gånger årets andel gånger det utrymme som fortfarande är ledigt. Små populationer växer, trånga krymper, och r bestämmer hur kraftigt populationen skjuter över målet. Robert May gjorde den här avbildningen berömd i en artikel i Nature 1976, just för att visa att en så enkel regel kan bete sig på mycket komplicerade sätt.",
          "För r mellan 1 och 3 dras varje bana mot fixpunkten x* = 1 − 1/r. Vid r = 3 blir den punkten instabil och en stabil 2-cykel tar över. Vid r = 1 + √6 ≈ 3,4495 fördubblas 2-cykeln till en 4-cykel, sedan till 8, 16 och så vidare, och varje fördubbling kommer tidigare än den förra. Avstånden krymper med en faktor som närmar sig Feigenbaums konstant δ ≈ 4,6692, och fördubblingarna hopar sig vid r∞ ≈ 3,5699. Bortom den punkten ger de flesta värden på r kaos.",
        ],
        formula: MAP_FORMULA_DECIMAL_COMMA,
      },
      {
        heading: "Vad reglagen gör",
        paragraphs: [
          "”Tillväxttakt r” går från 2,5 till 4 i steg om 0,0005 och börjar på 3,7, i det kaotiska området. De åtta förvalsknapparna hoppar till riktmärken: 2,5 (lugn fixpunkt vid 0,6); 3,0 (den första bifurkationen); 3,45 (strax efter 4-cykelns födelse); 3,56995 (kaosets början); 3,7 (djupt kaos); 3,83 (inne i period-3-fönstret, en ren 3-cykel); 3,9 (kaos igen) och 4,0 (fullt kaos, där banan täcker hela intervallet).",
          "x₀ är startvärdet, från 0,001 till 0,999, med 0,2 som standard. ”Inkörning” (0 till 2000, standard 200) är hur många iterationer som beräknas och kastas innan tidsserien börjar, och ”Visa” (20 till 1000, standard 200) är hur många som ritas därefter. Sätter du inkörningen till 0 får du se transienten: hur banan irrar omkring innan den faller ner på sin attraktor.",
        ],
      },
      {
        heading: "Hur den är byggd",
        paragraphs: [
          "Båda bilderna ritas på vanliga 2D-canvasar, utan någon animationsslinga. Bifurkationsdiagrammet är den dyra delen: 701 kolumner av r, som var och en startar från x = 0,5, itererar 300 gånger för att göra sig av med transienten och sedan ritar de följande 200 värdena som små halvgenomskinliga prickar. Det blir ungefär 350\u00a0000 evalueringar av avbildningen, så resultatet sparas en gång som ImageData och räknas bara om när canvasen ändrar storlek eller skärmens pixeltäthet ändras.",
          "Att flytta r-reglaget rör inte det arbetet. Den cachade bilden återställs med putImageData, och den cyanfärgade markören och dess etikett ritas ovanpå, vilket är billigt nog för att följa ditt finger. Tidsserien räknas om från början vid varje ändring av r, x₀, ”Inkörning” eller ”Visa”: den itererar avbildningen, binder ihop värdena med en linje och markerar vart och ett med en prick. Ingenting rör sig av sig självt, så minskad rörelse ändrar ingenting här.",
        ],
        code: BIFURCATION_EXCERPT,
      },
      {
        heading: "Att läsa diagrammet ärligt",
        paragraphs: [
          "Nära varje bifurkationspunkt ser grenarna tjocka och luddiga ut i stället för skarpa. Det är inget renderingsfel. I exakt det ögonblick då en cykel förlorar sin stabilitet närmar sig banorna den extremt långsamt, så 300 kastade iterationer räcker inte för att landa på den. Inom matematiken kallas detta kritisk inbromsning, och diagrammet visar det som kladd vid r = 3 och omkring 3,45.",
          "Inne i det kaotiska bandet ser du också tunna vita ränder. De är periodiska fönster, intervall av r där ordningen tillfälligt återvänder. Det bredaste börjar vid r = 1 + √8 ≈ 3,8284 med en stabil 3-cykel, som sedan periodfördubblas till 6, 12 och 24 innan kaoset kommer tillbaka. Enligt en sats av Li och Yorke har en avbildning som den här, om den har en cykel med period 3, också cykler med varje annan period.",
        ],
      },
    ],
    experimentsHeading: "Prova det här",
    experiments: [
      {
        title: "Fånga intermittensen",
        text: "Tryck på förvalet 3,83 och ställ ”Visa” på 1000: en ren 3-cykel. Flytta nu ner r till 3,8280, en hårsmån under fönstrets kant vid 3,8284. Banan ägnar sträckor på några dussin steg åt att nästan upprepa tre värden, bryter sedan ut i kaos och lugnar sig sedan igen.",
      },
      {
        title: "Testa känsligheten för begynnelsevillkoren",
        text: "Lägg märke till tidsseriens form vid r = 4,0 och flytta sedan x₀ ett enda steg, från 0,200 till 0,201. Efter 200 iterationers inkörning har de två bilderna ingenting gemensamt. Upprepa vid r = 3,2 så ändras ingenting alls, eftersom varje start slutar på samma 2-cykel.",
      },
      {
        title: "Se inbromsningen",
        text: "Ställ r på 3,0, ”Inkörning” på 0 och ”Visa” på 1000. Banan sicksackar kring 0,667 och närmar sig plågsamt långsamt. Flytta r till 2,8 så stannar den av inom några dussin steg.",
      },
      {
        title: "Räkna fördubblingarna",
        text: "Med ”Inkörning” på 2000, stega r genom 3,2; 3,5 och 3,56. Tidsserien upprepar sig var 2:a, 4:e och 8:e iteration. Varje ny period lever på ett intervall av r som är ungefär 4,7 gånger smalare än det föregående, och det är Feigenbaums δ i arbete.",
      },
    ],
  },
  no: {
    metaDescription:
      "Utforsk bifurkasjonsdiagrammet for den logistiske avbildningen: Dra r fra 2,5 til 4, se periodedobling bli til kaos, og les koden bak hvert punkt.",
    heading: "Slik fungerer denne utforskeren",
    intro:
      "Det store rosa bildet er bifurkasjonsdiagrammet for den logistiske avbildningen. Hver tynne loddrette kolonne hører til én verdi av vekstraten r, og prikkene i kolonnen er verdiene avbildningen fortsetter å besøke når den først har glemt hvor den startet. Der kolonnen viser én prikk, faller systemet til ro på én enkelt verdi. To prikker betyr at det veksler, og et utsmurt bånd betyr at det aldri gjentar seg. Den cyanfargede linjen markerer den r-en du har valgt, og det ravgule diagrammet nedenfor viser den faktiske følgen av verdier for den r-en, én iterasjon om gangen.",
    sections: [
      {
        heading: "Én linje aritmetikk",
        paragraphs: [
          "Regelen er den diskrete formen av logistisk vekst. Les x som andelen av et leveområde som er opptatt, mellom 0 og 1. Andelen i neste generasjon er r ganger årets andel ganger plassen som fortsatt er ledig. Små populasjoner vokser, trange krymper, og r bestemmer hvor kraftig populasjonen skyter over målet. Robert May gjorde denne avbildningen berømt i en artikkel i Nature i 1976, nettopp for å vise at en så enkel regel kan oppføre seg på svært kompliserte måter.",
          "For r mellom 1 og 3 trekkes hver bane mot fikspunktet x* = 1 − 1/r. Ved r = 3 blir det punktet ustabilt, og en stabil 2-sykel tar over. Ved r = 1 + √6 ≈ 3,4495 dobles 2-sykelen til en 4-sykel, deretter til 8, 16 og så videre, og hver dobling kommer tidligere enn den forrige. Avstandene krymper med en faktor som nærmer seg Feigenbaums konstant δ ≈ 4,6692, og doblingene hoper seg opp ved r∞ ≈ 3,5699. Bortenfor det punktet gir de fleste verdier av r kaos.",
        ],
        formula: MAP_FORMULA_DECIMAL_COMMA,
      },
      {
        heading: "Hva kontrollene gjør",
        paragraphs: [
          "«Vekstrate r» går fra 2,5 til 4 i steg på 0,0005 og starter på 3,7, i det kaotiske området. De åtte forhåndsvalgknappene hopper til landemerker: 2,5 (rolig fikspunkt ved 0,6); 3,0 (den første bifurkasjonen); 3,45 (like etter at 4-sykelen blir til); 3,56995 (starten på kaoset); 3,7 (dypt kaos); 3,83 (inne i periode-3-vinduet, en ren 3-sykel); 3,9 (kaos igjen) og 4,0 (fullt kaos, der banen dekker hele intervallet).",
          "x₀ er startverdien, fra 0,001 til 0,999, med 0,2 som standard. «Innkjøring» (0 til 2000, standard 200) er hvor mange iterasjoner som regnes ut og kastes før tidsserien begynner, og «Vis» (20 til 1000, standard 200) er hvor mange som tegnes etterpå. Setter du innkjøringen til 0, får du se transienten: hvordan banen vandrer rundt før den faller ned på attraktoren sin.",
        ],
      },
      {
        heading: "Slik er den bygget",
        paragraphs: [
          "Begge bildene tegnes på vanlige 2D-lerreter, uten noen animasjonsløkke. Bifurkasjonsdiagrammet er den dyre delen: 701 kolonner av r, som hver starter fra x = 0,5, itererer 300 ganger for å kvitte seg med transienten og deretter tegner de neste 200 verdiene som små halvgjennomsiktige prikker. Det blir omtrent 350\u00a0000 evalueringer av avbildningen, så resultatet lagres én gang som ImageData og regnes bare ut på nytt når lerretet endrer størrelse eller pikseltettheten på skjermen endres.",
          "Å flytte glidebryteren for r rører ikke det arbeidet. Det mellomlagrede bildet gjenopprettes med putImageData, og den cyanfargede markøren og etiketten tegnes oppå, noe som er billig nok til å følge fingeren din. Tidsserien regnes ut helt på nytt ved hver endring av r, x₀, «Innkjøring» eller «Vis»: Den itererer avbildningen, binder verdiene sammen med en linje og markerer hver av dem med en prikk. Ingenting beveger seg av seg selv, så redusert bevegelse endrer ingenting her.",
        ],
        code: BIFURCATION_EXCERPT,
      },
      {
        heading: "Å lese diagrammet ærlig",
        paragraphs: [
          "Nær hvert bifurkasjonspunkt ser grenene tykke og uklare ut i stedet for skarpe. Det er ingen tegnefeil. I nøyaktig det øyeblikket en sykel mister stabiliteten, nærmer banene seg den ekstremt langsomt, så 300 kastede iterasjoner er ikke nok til å lande på den. I matematikken kalles dette kritisk nedbremsing, og diagrammet viser det som flekker ved r = 3 og rundt 3,45.",
          "Inne i det kaotiske båndet ser du også tynne hvite striper. Det er periodiske vinduer, intervaller av r der ordenen kortvarig vender tilbake. Det bredeste starter ved r = 1 + √8 ≈ 3,8284 med en stabil 3-sykel, som deretter periodedobles til 6, 12 og 24 før kaoset kommer tilbake. Ifølge et teorem av Li og Yorke har en avbildning som denne, hvis den har en sykel med periode 3, også sykler med enhver annen periode.",
        ],
      },
    ],
    experimentsHeading: "Prøv dette",
    experiments: [
      {
        title: "Fang intermittensen",
        text: "Trykk på forhåndsvalget 3,83 og sett «Vis» til 1000: en ren 3-sykel. Flytt nå r ned til 3,8280, en hårsbredd under kanten av vinduet ved 3,8284. Banen bruker strekninger på noen titalls steg på nesten å gjenta tre verdier, bryter så ut i kaos og roer seg deretter igjen.",
      },
      {
        title: "Test følsomheten for startverdier",
        text: "Legg merke til formen på tidsserien ved r = 4,0, og flytt så x₀ ett enkelt steg, fra 0,200 til 0,201. Etter 200 iterasjoner med innkjøring har de to bildene ingenting til felles. Gjenta ved r = 3,2, så endrer ingenting seg i det hele tatt, fordi hver start ender på den samme 2-sykelen.",
      },
      {
        title: "Se nedbremsingen",
        text: "Sett r til 3,0, «Innkjøring» til 0 og «Vis» til 1000. Banen går i sikksakk rundt 0,667 og nærmer seg pinefullt langsomt. Flytt r til 2,8, så faller den til ro innen noen titalls steg.",
      },
      {
        title: "Tell doblingene",
        text: "Med «Innkjøring» på 2000, la r gå gjennom 3,2; 3,5 og 3,56. Tidsserien gjentar seg hver 2., 4. og 8. iterasjon. Hver ny periode lever på et intervall av r som er omtrent 4,7 ganger smalere enn det forrige, og det er Feigenbaums δ i arbeid.",
      },
    ],
  },
};
