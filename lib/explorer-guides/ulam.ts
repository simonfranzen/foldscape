import type { ExplorerGuide } from "./types";

// Numbers quoted here (side 51 to 501 in steps of 2, default 251; prime counts
// 378, 6,320 and 22,115; the n < 600 highlight range; the ±40 diagonals of
// Euler's polynomial) were computed with buildSieve() and spiralCoord() from
// app/ulam/explorer/page.tsx; update both together.
const SPIRAL_EXCERPT = `// Spiral coordinate for n (1-indexed), centred at (0, 0).
function spiralCoord(n: number): [number, number] {
  if (n === 1) return [0, 0];
  // ring k contains numbers (2k-1)² + 1 .. (2k+1)²
  const k = Math.ceil((Math.sqrt(n) - 1) / 2);
  const sideLen = 2 * k;
  const off = n - ((2 * k - 1) * (2 * k - 1) + 1);
  let x = k, y = -(k - 1);
  if (off < sideLen) y += off;                     // up the right side
  else if (off < 2 * sideLen) { y += sideLen - 1; x -= off - sideLen + 1; }  // top
  else if (off < 3 * sideLen) { y = k - (off - 2 * sideLen + 1); x = -k; }  // left
  else { y = -k; x = -k + (off - 3 * sideLen + 1); }                       // bottom
  return [x, y];
}`;

// The six newer locales reuse the EN formula verbatim; only DE carries a
// localised \text{} label.
const EULER_FORMULA =
  "f(n) = n^2 - n + 41 \\text{ is prime for } n = 0, 1, \\dots, 40, \\qquad f(41) = 41^2";

export const ULAM_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Explore the Ulam spiral of primes: up to 251,001 numbers on a square spiral, prime-rich diagonals, and Euler's n² − n + 41 highlighted in place.",
    heading: "How this explorer works",
    intro:
      "Write 1 in the middle of a grid, 2 to its right, and keep counting in a square spiral, anticlockwise, ring after ring. Then mark only the primes. At the default size of 251 × 251 the grid holds 63,001 numbers, 6,320 of them prime, and the marks do not look like random dust: they line up along diagonals. Stanisław Ulam noticed this in 1963 while doodling during a talk. Part of the pattern has a simple explanation, and part of it is still an open problem.",
    sections: [
      {
        heading: "Why primes like diagonals",
        paragraphs: [
          "The first reason is parity. In this spiral a number is odd exactly when x + y is even, so odd and even numbers form a checkerboard. A diagonal step changes x + y by 0 or 2, which keeps the parity, so every diagonal line consists entirely of odd numbers or entirely of even ones. Since every prime except 2 is odd, half of all diagonals carry no primes at all (apart from the single 2), and the primes are forced onto the other half.",
          "The second reason is algebra. Walking along a diagonal ray, the numbers you meet are the values of a quadratic polynomial, for example 1, 9, 25, 49, … = (2n + 1)² on the ray running to the lower right of 1. Some quadratics can never be prime, because they factor or are always divisible by a small prime. Others avoid all small divisors and produce primes far more often than average. Hardy and Littlewood conjectured in 1923 exactly how often each quadratic should hit primes; nobody has proved that any quadratic produces infinitely many.",
        ],
        formula: EULER_FORMULA,
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "The grid side runs from 51 to 501 in steps of 2. It stays odd so that 1 sits in the exact centre cell, which is outlined in cyan. The header shows how many numbers the grid holds and how many of them are prime: 378 primes among 2,601 numbers at the smallest size, 22,115 among 251,001 at the largest.",
          "The highlight menu colours the primes that are values of a chosen quadratic in pink: Euler's n² − n + 41 (the default), n² + n + 17, n² + n + 11, 4n² − 2n + 41 and n², or switches highlighting off. Only primes are drawn, so a pink cell is always a prime value of the polynomial; values for n from 0 to 599 are checked.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "Primality comes from a sieve of Eratosthenes over a Uint8Array with one byte per number up to side² + 5, recomputed only when the grid size changes. Even at the largest size that is about a quarter of a million bytes and takes a few milliseconds.",
          "Placing a number does not require walking the spiral. Ring k around the centre holds the numbers from (2k − 1)² + 1 to (2k + 1)², because each ring ends with an odd square in its lower right corner. From n the code computes its ring with one square root, then its offset within the ring, and the offset tells which of the four sides it lies on and where. The function below is that closed form.",
          "The canvas is sized to the device pixel ratio and redrawn whenever the grid size, the highlight or the window size changes. Every prime is a filled square, amber or pink. The highlighted cells are stored in a Set of packed (x, y) keys, so the draw loop can check each prime in constant time. Nothing is animated, so a reduced-motion setting has nothing to switch off.",
        ],
        code: SPIRAL_EXCERPT,
      },
      {
        heading: "What the polynomials show",
        paragraphs: [
          "Euler's polynomial n² − n + 41 gives primes for the 41 consecutive values n = 0 to 40, and fails at n = 41, where it equals 41². n² + n + 17 is prime for n = 0 to 15 and n² + n + 11 for n = 0 to 9. 4n² − 2n + 41 is Euler's polynomial evaluated at 2n, so it picks every second value and is prime for n = 0 to 20.",
          "On the spiral, those guaranteed primes are scattered near the centre, because the constant 41 is larger than the inner rings. From n = 40 on, though, every value of Euler's polynomial lands on one of two diagonal lines that run from the lower left to the upper right, shifted 40 columns to either side of the diagonal through 1. Within the default grid about seven in ten of those later values are still prime, so the lines stay visibly pink. n² is the counterexample: no square is prime, so nothing turns pink at all.",
        ],
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "Measure how primes thin out",
        text: "Compare the smallest grid (378 primes among 2,601 numbers, about 14.5 percent) with the largest (22,115 among 251,001, about 8.8 percent). Both match the prime number theorem's estimate 1/(ln N − 1) to within a few tenths of a percent.",
      },
      {
        title: "Follow Euler's lines",
        text: "Keep Euler's polynomial selected at side 251. Ignore the pink cluster near the centre and look further out: two parallel pink diagonals run from the lower left to the upper right, 40 cells away from the centre on either side.",
      },
      {
        title: "Find the empty diagonal",
        text: "Select n² and start at the cyan centre cell. Follow the diagonal down and to the right: it holds 9, 25, 49 and every other odd square, so not a single cell on it is marked. That dark ray is the simplest prime-free diagonal there is.",
      },
      {
        title: "Zoom out",
        text: "Drag the side to 501. The grid now holds a quarter of a million numbers and the cells become tiny, but the diagonal streaks stand out more clearly than at small sizes, while the overall density keeps falling.",
      },
    ],
  },
  de: {
    metaDescription:
      "Die Ulam-Spirale der Primzahlen erkunden: bis zu 251.001 Zahlen auf einer Quadratspirale, primzahlreiche Diagonalen und Eulers n² − n + 41 hervorgehoben.",
    heading: "So funktioniert dieser Explorer",
    intro:
      "Schreib die 1 in die Mitte eines Gitters, die 2 rechts daneben, und zähl in einer quadratischen Spirale gegen den Uhrzeigersinn weiter, Ring für Ring. Dann markierst du nur die Primzahlen. In der Standardgröße von 251 × 251 enthält das Gitter 63.001 Zahlen, davon 6.320 Primzahlen, und die Markierungen sehen nicht aus wie zufälliger Staub: Sie reihen sich entlang von Diagonalen auf. Stanisław Ulam bemerkte das 1963, als er während eines Vortrags kritzelte. Ein Teil des Musters hat eine einfache Erklärung, ein anderer ist bis heute offen.",
    sections: [
      {
        heading: "Warum Primzahlen Diagonalen mögen",
        paragraphs: [
          "Der erste Grund ist die Parität. In dieser Spirale ist eine Zahl genau dann ungerade, wenn x + y gerade ist, gerade und ungerade Zahlen bilden also ein Schachbrett. Ein Diagonalschritt ändert x + y um 0 oder 2 und erhält damit die Parität. Jede Diagonale besteht also nur aus ungeraden oder nur aus geraden Zahlen. Weil jede Primzahl außer 2 ungerade ist, trägt die Hälfte aller Diagonalen überhaupt keine Primzahlen (bis auf die einzelne 2), und die Primzahlen müssen sich auf die andere Hälfte drängen.",
          "Der zweite Grund ist Algebra. Entlang eines diagonalen Strahls sind die Zahlen, denen du begegnest, Werte eines quadratischen Polynoms, zum Beispiel 1, 9, 25, 49, … = (2n + 1)² auf dem Strahl, der von der 1 nach rechts unten läuft. Manche quadratischen Polynome können nie prim sein, weil sie sich faktorisieren lassen oder immer durch eine kleine Primzahl teilbar sind. Andere meiden alle kleinen Teiler und liefern viel öfter Primzahlen als der Durchschnitt. Hardy und Littlewood vermuteten 1923, wie oft genau jedes Polynom Primzahlen treffen sollte; dass irgendein quadratisches Polynom unendlich viele liefert, hat noch niemand bewiesen.",
        ],
        formula:
          "f(n) = n^2 - n + 41 \\text{ ist prim für } n = 0, 1, \\dots, 40, \\qquad f(41) = 41^2",
      },
      {
        heading: "Was die Regler bewirken",
        paragraphs: [
          "Die Gitterseite reicht von 51 bis 501 in Zweierschritten. Sie bleibt ungerade, damit die 1 genau in der mittleren Zelle sitzt, die cyan umrandet ist. Die Kopfzeile zeigt, wie viele Zahlen das Gitter enthält und wie viele davon prim sind: 378 Primzahlen unter 2.601 Zahlen in der kleinsten Größe, 22.115 unter 251.001 in der größten.",
          "Das Hervorhebungsmenü färbt die Primzahlen rosa, die Werte eines gewählten Polynoms sind: Eulers n² − n + 41 (voreingestellt), n² + n + 17, n² + n + 11, 4n² − 2n + 41 und n², oder schaltet die Hervorhebung aus. Gezeichnet werden nur Primzahlen, eine rosa Zelle ist also immer ein primer Wert des Polynoms; geprüft werden die Werte für n von 0 bis 599.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Ob eine Zahl prim ist, liefert ein Sieb des Eratosthenes über ein Uint8Array mit einem Byte pro Zahl bis Seite² + 5, neu berechnet nur, wenn sich die Gittergröße ändert. Selbst in der größten Größe ist das etwa eine Viertelmillion Bytes und dauert ein paar Millisekunden.",
          "Um eine Zahl zu platzieren, muss niemand die Spirale ablaufen. Ring k um die Mitte enthält die Zahlen von (2k − 1)² + 1 bis (2k + 1)², weil jeder Ring mit einem ungeraden Quadrat in seiner rechten unteren Ecke endet. Aus n berechnet der Code mit einer Quadratwurzel den Ring, dann den Versatz innerhalb des Rings, und der Versatz verrät, auf welcher der vier Seiten die Zahl liegt und wo. Die Funktion unten ist diese geschlossene Formel.",
          "Das Canvas ist an die Pixeldichte des Geräts angepasst und wird neu gezeichnet, sobald sich Gittergröße, Hervorhebung oder Fenstergröße ändern. Jede Primzahl ist ein gefülltes Quadrat, bernsteinfarben oder rosa. Die hervorgehobenen Zellen liegen als gepackte (x, y)-Schlüssel in einem Set, so prüft die Zeichenschleife jede Primzahl in konstanter Zeit. Nichts ist animiert, eine Einstellung für reduzierte Bewegung hat hier also nichts abzuschalten.",
        ],
        code: SPIRAL_EXCERPT,
      },
      {
        heading: "Was die Polynome zeigen",
        paragraphs: [
          "Eulers Polynom n² − n + 41 liefert Primzahlen für die 41 aufeinanderfolgenden Werte n = 0 bis 40 und scheitert bei n = 41, wo es 41² ergibt. n² + n + 17 ist prim für n = 0 bis 15, n² + n + 11 für n = 0 bis 9. 4n² − 2n + 41 ist Eulers Polynom an der Stelle 2n, es greift also jeden zweiten Wert heraus und ist prim für n = 0 bis 20.",
          "Auf der Spirale liegen diese garantierten Primzahlen verstreut in der Nähe der Mitte, weil die Konstante 41 größer ist als die inneren Ringe. Ab n = 40 aber landet jeder Wert von Eulers Polynom auf einer von zwei Diagonalen, die von links unten nach rechts oben laufen, um 40 Spalten zu beiden Seiten der Diagonale durch die 1 verschoben. Im Standardgitter sind etwa sieben von zehn dieser späteren Werte noch prim, die Linien bleiben also sichtbar rosa. n² ist das Gegenbeispiel: Kein Quadrat ist prim, also wird überhaupt nichts rosa.",
        ],
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Messen, wie Primzahlen seltener werden",
        text: "Vergleiche das kleinste Gitter (378 Primzahlen unter 2.601 Zahlen, etwa 14,5 Prozent) mit dem größten (22.115 unter 251.001, etwa 8,8 Prozent). Beide treffen die Schätzung 1/(ln N − 1) aus dem Primzahlsatz bis auf wenige Zehntelprozent.",
      },
      {
        title: "Eulers Linien folgen",
        text: "Lass Eulers Polynom bei Seite 251 ausgewählt. Übersieh die rosa Häufung nahe der Mitte und schau weiter nach außen: Zwei parallele rosa Diagonalen laufen von links unten nach rechts oben, 40 Zellen auf beiden Seiten der Mitte.",
      },
      {
        title: "Die leere Diagonale finden",
        text: "Wähle n² und beginne bei der cyan umrandeten Mittelzelle. Folge der Diagonale nach rechts unten: Auf ihr liegen 9, 25, 49 und alle weiteren ungeraden Quadrate, keine einzige Zelle darauf ist markiert. Dieser dunkle Strahl ist die einfachste primzahlfreie Diagonale überhaupt.",
      },
      {
        title: "Herauszoomen",
        text: "Zieh die Seite auf 501. Das Gitter enthält jetzt eine Viertelmillion Zahlen und die Zellen werden winzig, aber die diagonalen Streifen treten deutlicher hervor als bei kleinen Größen, während die Gesamtdichte weiter sinkt.",
      },
    ],
  },
  es: {
    metaDescription:
      "Explora la espiral de Ulam de los números primos: hasta 251 001 números en una espiral cuadrada, diagonales ricas en primos y el n² − n + 41 de Euler.",
    heading: "Cómo funciona este explorador",
    intro:
      "Escribe el 1 en el centro de una cuadrícula, el 2 a su derecha, y sigue contando en una espiral cuadrada, en sentido antihorario, anillo tras anillo. Después marca solo los primos. Con el tamaño por defecto de 251 × 251 la cuadrícula contiene 63 001 números, de los cuales 6320 son primos, y las marcas no parecen polvo esparcido al azar: se alinean a lo largo de diagonales. Stanisław Ulam lo observó en 1963 mientras garabateaba durante una conferencia. Una parte del patrón tiene una explicación sencilla y otra parte sigue siendo un problema abierto.",
    sections: [
      {
        heading: "Por qué a los primos les gustan las diagonales",
        paragraphs: [
          "La primera razón es la paridad. En esta espiral un número es impar exactamente cuando x + y es par, de modo que pares e impares forman un tablero de ajedrez. Un paso en diagonal cambia x + y en 0 o en 2, lo que conserva la paridad, así que toda diagonal está formada solo por números impares o solo por números pares. Como todo primo salvo el 2 es impar, la mitad de las diagonales no lleva ningún primo (aparte del solitario 2) y los primos se ven obligados a repartirse en la otra mitad.",
          "La segunda razón es el álgebra. Al recorrer una semirrecta diagonal, los números que encuentras son los valores de un polinomio cuadrático, por ejemplo 1, 9, 25, 49, … = (2n + 1)² en la semirrecta que sale del 1 hacia abajo a la derecha. Algunos polinomios cuadráticos nunca pueden dar primos, porque se factorizan o porque siempre son divisibles por un primo pequeño. Otros esquivan todos los divisores pequeños y producen primos con mucha más frecuencia que la media. Hardy y Littlewood conjeturaron en 1923 con qué frecuencia exacta debería dar primos cada polinomio cuadrático; nadie ha demostrado que alguno de ellos produzca infinitos.",
        ],
        formula:
          "f(n) = n^2 - n + 41 \\text{ es primo para } n = 0, 1, \\dots, 40, \\qquad f(41) = 41^2",
      },
      {
        heading: "Qué hacen los controles",
        paragraphs: [
          "El lado de la cuadrícula va de 51 a 501 en pasos de 2. Se mantiene impar para que el 1 ocupe exactamente la celda central, que aparece con un borde cian. La cabecera muestra cuántos números contiene la cuadrícula y cuántos de ellos son primos: 378 primos entre 2601 números en el tamaño más pequeño, 22 115 entre 251 001 en el más grande.",
          "El menú de resaltado colorea de rosa los primos que son valores de un polinomio cuadrático elegido: el n² − n + 41 de Euler (la opción por defecto), n² + n + 17, n² + n + 11, 4n² − 2n + 41 y n², o bien desactiva el resaltado. Solo se dibujan los primos, así que una celda rosa es siempre un valor primo del polinomio; se comprueban los valores para n de 0 a 599.",
        ],
      },
      {
        heading: "Cómo está construido",
        paragraphs: [
          "La primalidad sale de una criba de Eratóstenes sobre un Uint8Array con un byte por número hasta lado² + 5, que solo se recalcula cuando cambia el tamaño de la cuadrícula. Incluso en el tamaño más grande son alrededor de un cuarto de millón de bytes y tarda unos pocos milisegundos.",
          "Para colocar un número no hace falta recorrer la espiral. El anillo k alrededor del centro contiene los números de (2k − 1)² + 1 a (2k + 1)², porque cada anillo termina con un cuadrado impar en su esquina inferior derecha. A partir de n el código calcula su anillo con una sola raíz cuadrada y después su desplazamiento dentro del anillo, y ese desplazamiento indica en cuál de los cuatro lados está y en qué posición. La función de abajo es esa fórmula cerrada.",
          "El lienzo se dimensiona según la densidad de píxeles del dispositivo y se redibuja cada vez que cambia el tamaño de la cuadrícula, el resaltado o el tamaño de la ventana. Cada primo es un cuadrado relleno, ámbar o rosa. Las celdas resaltadas se guardan en un Set de claves (x, y) empaquetadas, de modo que el bucle de dibujo puede comprobar cada primo en tiempo constante. No hay nada animado, así que el ajuste de movimiento reducido no tiene nada que desactivar.",
        ],
        code: SPIRAL_EXCERPT,
      },
      {
        heading: "Qué muestran los polinomios",
        paragraphs: [
          "El polinomio de Euler n² − n + 41 da primos para los 41 valores consecutivos n = 0 a 40 y falla en n = 41, donde vale 41². n² + n + 17 es primo para n = 0 a 15 y n² + n + 11 para n = 0 a 9. 4n² − 2n + 41 es el polinomio de Euler evaluado en 2n, así que toma uno de cada dos valores y es primo para n = 0 a 20.",
          "En la espiral, esos primos garantizados quedan dispersos cerca del centro, porque la constante 41 es mayor que los anillos interiores. A partir de n = 40, en cambio, cada valor del polinomio de Euler cae en una de dos rectas diagonales que van de abajo a la izquierda hacia arriba a la derecha, desplazadas 40 columnas a cada lado de la diagonal que pasa por el 1. Dentro de la cuadrícula por defecto, unos siete de cada diez de esos valores posteriores siguen siendo primos, así que las rectas se mantienen visiblemente rosas. n² es el contraejemplo: ningún cuadrado es primo, así que nada se vuelve rosa.",
        ],
      },
    ],
    experimentsHeading: "Prueba esto",
    experiments: [
      {
        title: "Mide cómo escasean los primos",
        text: "Compara la cuadrícula más pequeña (378 primos entre 2601 números, alrededor del 14,5 por ciento) con la más grande (22 115 entre 251 001, alrededor del 8,8 por ciento). Ambas coinciden con la estimación 1/(ln N − 1) del teorema de los números primos con un margen de unas pocas décimas de punto porcentual.",
      },
      {
        title: "Sigue las rectas de Euler",
        text: "Deja seleccionado el polinomio de Euler con lado 251. Ignora el cúmulo rosa cerca del centro y mira más hacia fuera: dos diagonales rosas paralelas van de abajo a la izquierda hacia arriba a la derecha, a 40 celdas del centro por cada lado.",
      },
      {
        title: "Encuentra la diagonal vacía",
        text: "Selecciona n² y empieza en la celda central de borde cian. Sigue la diagonal hacia abajo a la derecha: contiene 9, 25, 49 y todos los demás cuadrados impares, así que ni una sola de sus celdas está marcada. Esa semirrecta oscura es la diagonal sin primos más sencilla que existe.",
      },
      {
        title: "Aleja la vista",
        text: "Arrastra el lado hasta 501. La cuadrícula contiene ahora un cuarto de millón de números y las celdas se vuelven diminutas, pero las vetas diagonales destacan con más claridad que en los tamaños pequeños, mientras la densidad global sigue bajando.",
      },
    ],
  },
  fr: {
    metaDescription:
      "Explore la spirale d'Ulam des nombres premiers : jusqu'à 251\u00a0001 nombres sur une spirale carrée, des diagonales riches en premiers et le n² − n + 41 d'Euler.",
    heading: "Comment fonctionne cet explorateur",
    intro:
      "Écris 1 au centre d'une grille, 2 à sa droite, puis continue de compter en spirale carrée, dans le sens inverse des aiguilles d'une montre, anneau après anneau. Ensuite, ne marque que les nombres premiers. À la taille par défaut de 251 × 251, la grille contient 63\u00a0001 nombres, dont 6\u00a0320 premiers, et les marques ne ressemblent pas à une poussière aléatoire : elles s'alignent le long de diagonales. Stanisław Ulam l'a remarqué en 1963 en griffonnant pendant un exposé. Une partie du motif a une explication simple, une autre reste un problème ouvert.",
    sections: [
      {
        heading: "Pourquoi les nombres premiers aiment les diagonales",
        paragraphs: [
          "La première raison est la parité. Dans cette spirale, un nombre est impair exactement quand x + y est pair, si bien que pairs et impairs forment un damier. Un pas en diagonale change x + y de 0 ou de 2, ce qui conserve la parité : chaque diagonale est donc composée uniquement de nombres impairs ou uniquement de nombres pairs. Comme tout nombre premier sauf 2 est impair, la moitié des diagonales ne porte aucun nombre premier (à part le seul 2), et les premiers sont contraints de se serrer sur l'autre moitié.",
          "La seconde raison est l'algèbre. Le long d'une demi-droite diagonale, les nombres que tu croises sont les valeurs d'un polynôme du second degré, par exemple 1, 9, 25, 49, … = (2n + 1)² sur la demi-droite qui part de 1 vers le bas à droite. Certains polynômes du second degré ne peuvent jamais donner de nombre premier, parce qu'ils se factorisent ou sont toujours divisibles par un petit nombre premier. D'autres évitent tous les petits diviseurs et produisent des nombres premiers bien plus souvent que la moyenne. Hardy et Littlewood ont conjecturé en 1923 à quelle fréquence exacte chaque polynôme du second degré devrait tomber sur des nombres premiers ; personne n'a démontré que l'un d'eux en produit une infinité.",
        ],
        formula: EULER_FORMULA,
      },
      {
        heading: "À quoi servent les commandes",
        paragraphs: [
          "Le côté de la grille va de 51 à 501 par pas de 2. Il reste impair pour que 1 occupe exactement la case centrale, entourée de cyan. L'en-tête indique combien de nombres contient la grille et combien d'entre eux sont premiers : 378 nombres premiers parmi 2\u00a0601 nombres à la plus petite taille, 22\u00a0115 parmi 251\u00a0001 à la plus grande.",
          "Le menu de mise en évidence colore en rose les nombres premiers qui sont des valeurs d'un polynôme du second degré choisi : le n² − n + 41 d'Euler (choix par défaut), n² + n + 17, n² + n + 11, 4n² − 2n + 41 et n², ou bien désactive la mise en évidence. Seuls les nombres premiers sont dessinés, donc une case rose est toujours une valeur première du polynôme ; les valeurs sont testées pour n de 0 à 599.",
        ],
      },
      {
        heading: "Comment c'est construit",
        paragraphs: [
          "La primalité vient d'un crible d'Ératosthène sur un Uint8Array, avec un octet par nombre jusqu'à côté² + 5, recalculé uniquement quand la taille de la grille change. Même à la plus grande taille, cela représente environ un quart de million d'octets et prend quelques millisecondes.",
          "Placer un nombre n'oblige pas à parcourir la spirale. L'anneau k autour du centre contient les nombres de (2k − 1)² + 1 à (2k + 1)², parce que chaque anneau se termine par un carré impair dans son coin inférieur droit. À partir de n, le code calcule son anneau avec une seule racine carrée, puis son décalage dans l'anneau, et ce décalage indique sur lequel des quatre côtés il se trouve et à quel endroit. La fonction ci-dessous est cette formule close.",
          "Le canevas est dimensionné selon la densité de pixels de l'appareil et redessiné dès que la taille de la grille, la mise en évidence ou la taille de la fenêtre change. Chaque nombre premier est un carré plein, ambre ou rose. Les cases mises en évidence sont stockées dans un Set de clés (x, y) compactées, ce qui permet à la boucle de dessin de tester chaque nombre premier en temps constant. Rien n'est animé, le réglage de réduction des animations n'a donc rien à désactiver.",
        ],
        code: SPIRAL_EXCERPT,
      },
      {
        heading: "Ce que montrent les polynômes",
        paragraphs: [
          "Le polynôme d'Euler n² − n + 41 donne des nombres premiers pour les 41 valeurs consécutives n = 0 à 40 et échoue en n = 41, où il vaut 41². n² + n + 17 est premier pour n = 0 à 15 et n² + n + 11 pour n = 0 à 9. 4n² − 2n + 41 est le polynôme d'Euler évalué en 2n : il retient donc une valeur sur deux et est premier pour n = 0 à 20.",
          "Sur la spirale, ces nombres premiers garantis sont éparpillés près du centre, parce que la constante 41 est plus grande que les anneaux intérieurs. À partir de n = 40, en revanche, chaque valeur du polynôme d'Euler tombe sur l'une de deux droites diagonales qui vont du bas à gauche vers le haut à droite, décalées de 40 colonnes de part et d'autre de la diagonale passant par 1. Dans la grille par défaut, environ sept sur dix de ces valeurs ultérieures sont encore premières, si bien que les droites restent visiblement roses. n² est le contre-exemple : aucun carré n'est premier, donc rien ne devient rose.",
        ],
      },
    ],
    experimentsHeading: "À essayer",
    experiments: [
      {
        title: "Mesure la raréfaction des nombres premiers",
        text: "Compare la plus petite grille (378 nombres premiers parmi 2\u00a0601 nombres, environ 14,5 pour cent) à la plus grande (22\u00a0115 parmi 251\u00a0001, environ 8,8 pour cent). Les deux rejoignent l'estimation 1/(ln N − 1) du théorème des nombres premiers à quelques dixièmes de point de pourcentage près.",
      },
      {
        title: "Suis les droites d'Euler",
        text: "Garde le polynôme d'Euler sélectionné avec un côté de 251. Ignore l'amas rose près du centre et regarde plus loin : deux diagonales roses parallèles vont du bas à gauche vers le haut à droite, à 40 cases du centre de chaque côté.",
      },
      {
        title: "Trouve la diagonale vide",
        text: "Sélectionne n² et pars de la case centrale entourée de cyan. Suis la diagonale vers le bas à droite : elle contient 9, 25, 49 et tous les autres carrés impairs, donc pas une seule de ses cases n'est marquée. Cette demi-droite sombre est la diagonale sans nombre premier la plus simple qui soit.",
      },
      {
        title: "Prends du recul",
        text: "Fais glisser le côté jusqu'à 501. La grille contient maintenant un quart de million de nombres et les cases deviennent minuscules, mais les traînées diagonales ressortent plus nettement qu'aux petites tailles, tandis que la densité globale continue de baisser.",
      },
    ],
  },
  it: {
    metaDescription:
      "Esplora la spirale di Ulam dei numeri primi: fino a 251.001 numeri su una spirale quadrata, diagonali ricche di primi e il polinomio n² − n + 41 di Eulero.",
    heading: "Come funziona questo esploratore",
    intro:
      "Scrivi 1 al centro di una griglia, 2 alla sua destra, e continua a contare lungo una spirale quadrata, in senso antiorario, anello dopo anello. Poi segna soltanto i numeri primi. Alla dimensione predefinita di 251 × 251 la griglia contiene 63.001 numeri, di cui 6320 primi, e i segni non sembrano polvere sparsa a caso: si allineano lungo le diagonali. Stanisław Ulam se ne accorse nel 1963, scarabocchiando durante una conferenza. Una parte dello schema ha una spiegazione semplice, un'altra è ancora un problema aperto.",
    sections: [
      {
        heading: "Perché ai primi piacciono le diagonali",
        paragraphs: [
          "La prima ragione è la parità. In questa spirale un numero è dispari esattamente quando x + y è pari, quindi pari e dispari formano una scacchiera. Un passo in diagonale cambia x + y di 0 o di 2, il che conserva la parità, perciò ogni diagonale è fatta solo di numeri dispari o solo di numeri pari. Poiché ogni primo tranne 2 è dispari, metà delle diagonali non contiene alcun primo (a parte l'unico 2) e i primi sono costretti a stare nell'altra metà.",
          "La seconda ragione è l'algebra. Percorrendo una semiretta diagonale, i numeri che incontri sono i valori di un polinomio quadratico, per esempio 1, 9, 25, 49, … = (2n + 1)² sulla semiretta che parte da 1 verso il basso a destra. Alcuni polinomi quadratici non possono mai dare numeri primi, perché si fattorizzano o sono sempre divisibili per un primo piccolo. Altri evitano tutti i divisori piccoli e producono primi molto più spesso della media. Hardy e Littlewood congetturarono nel 1923 con quale frequenza esatta ogni polinomio quadratico dovrebbe incontrare numeri primi; nessuno ha dimostrato che anche uno solo ne produca infiniti.",
        ],
        formula: EULER_FORMULA,
      },
      {
        heading: "Che cosa fanno i controlli",
        paragraphs: [
          "Il lato della griglia va da 51 a 501 a passi di 2. Resta dispari perché l'1 occupi esattamente la cella centrale, che ha un contorno ciano. L'intestazione mostra quanti numeri contiene la griglia e quanti di essi sono primi: 378 primi su 2601 numeri alla dimensione minima, 22.115 su 251.001 alla massima.",
          "Il menu di evidenziazione colora di rosa i primi che sono valori di un polinomio quadratico scelto: n² − n + 41 di Eulero (l'impostazione predefinita), n² + n + 17, n² + n + 11, 4n² − 2n + 41 e n², oppure disattiva l'evidenziazione. Vengono disegnati solo i primi, quindi una cella rosa è sempre un valore primo del polinomio; si controllano i valori per n da 0 a 599.",
        ],
      },
      {
        heading: "Com'è costruito",
        paragraphs: [
          "La primalità viene da un crivello di Eratostene su un Uint8Array con un byte per numero fino a lato² + 5, ricalcolato solo quando cambia la dimensione della griglia. Anche alla dimensione massima si tratta di circa un quarto di milione di byte e di pochi millisecondi.",
          "Per collocare un numero non serve percorrere la spirale. L'anello k attorno al centro contiene i numeri da (2k − 1)² + 1 a (2k + 1)², perché ogni anello termina con un quadrato dispari nell'angolo in basso a destra. A partire da n il codice calcola il suo anello con una sola radice quadrata, poi il suo scostamento all'interno dell'anello, e lo scostamento dice su quale dei quattro lati si trova e in che punto. La funzione qui sotto è questa formula chiusa.",
          "Il canvas è dimensionato in base alla densità di pixel del dispositivo e viene ridisegnato ogni volta che cambiano la dimensione della griglia, l'evidenziazione o la dimensione della finestra. Ogni primo è un quadrato pieno, ambra o rosa. Le celle evidenziate sono conservate in un Set di chiavi (x, y) compattate, così il ciclo di disegno può controllare ogni primo in tempo costante. Non c'è nulla di animato, quindi l'impostazione di movimento ridotto non ha niente da disattivare.",
        ],
        code: SPIRAL_EXCERPT,
      },
      {
        heading: "Cosa mostrano i polinomi",
        paragraphs: [
          "Il polinomio di Eulero n² − n + 41 dà numeri primi per i 41 valori consecutivi n = 0 fino a 40 e fallisce per n = 41, dove vale 41². n² + n + 17 è primo per n = 0 fino a 15 e n² + n + 11 per n = 0 fino a 9. 4n² − 2n + 41 è il polinomio di Eulero valutato in 2n, quindi ne prende un valore ogni due ed è primo per n = 0 fino a 20.",
          "Sulla spirale questi primi garantiti sono sparsi vicino al centro, perché la costante 41 è più grande degli anelli interni. Da n = 40 in poi, però, ogni valore del polinomio di Eulero cade su una di due rette diagonali che vanno dal basso a sinistra verso l'alto a destra, spostate di 40 colonne da una parte e dall'altra della diagonale che passa per 1. Nella griglia predefinita circa sette su dieci di questi valori successivi sono ancora primi, così le rette restano visibilmente rosa. n² è il controesempio: nessun quadrato è primo, quindi niente diventa rosa.",
        ],
      },
    ],
    experimentsHeading: "Prova così",
    experiments: [
      {
        title: "Misura come si diradano i primi",
        text: "Confronta la griglia più piccola (378 primi su 2601 numeri, circa il 14,5 per cento) con la più grande (22.115 su 251.001, circa l'8,8 per cento). Entrambe concordano con la stima 1/(ln N − 1) del teorema dei numeri primi a meno di pochi decimi di punto percentuale.",
      },
      {
        title: "Segui le rette di Eulero",
        text: "Lascia selezionato il polinomio di Eulero con lato 251. Ignora l'ammasso rosa vicino al centro e guarda più all'esterno: due diagonali rosa parallele vanno dal basso a sinistra verso l'alto a destra, a 40 celle dal centro su ciascun lato.",
      },
      {
        title: "Trova la diagonale vuota",
        text: "Seleziona n² e parti dalla cella centrale con il contorno ciano. Segui la diagonale verso il basso a destra: contiene 9, 25, 49 e tutti gli altri quadrati dispari, quindi nemmeno una delle sue celle è segnata. Quella semiretta scura è la più semplice diagonale priva di primi che esista.",
      },
      {
        title: "Allarga lo sguardo",
        text: "Trascina il lato fino a 501. Ora la griglia contiene un quarto di milione di numeri e le celle diventano minuscole, ma le striature diagonali risaltano più chiaramente che alle dimensioni piccole, mentre la densità complessiva continua a calare.",
      },
    ],
  },
  pt: {
    metaDescription:
      "Explora a espiral de Ulam dos números primos: até 251\u00a0001 números numa espiral quadrada, diagonais ricas em primos e o n² − n + 41 de Euler em destaque.",
    heading: "Como funciona este explorador",
    intro:
      "Escreve o 1 no centro de uma grelha, o 2 à sua direita, e continua a contar numa espiral quadrada, no sentido contrário ao dos ponteiros do relógio, anel após anel. Depois marca apenas os primos. No tamanho predefinido de 251 × 251, a grelha contém 63\u00a0001 números, dos quais 6320 são primos, e as marcas não parecem poeira espalhada ao acaso: alinham-se ao longo de diagonais. Stanisław Ulam reparou nisto em 1963, enquanto rabiscava durante uma palestra. Uma parte do padrão tem uma explicação simples e outra parte continua a ser um problema em aberto.",
    sections: [
      {
        heading: "Porque é que os primos gostam de diagonais",
        paragraphs: [
          "A primeira razão é a paridade. Nesta espiral, um número é ímpar exatamente quando x + y é par, pelo que pares e ímpares formam um tabuleiro de xadrez. Um passo na diagonal altera x + y em 0 ou em 2, o que conserva a paridade, por isso cada diagonal é composta apenas por números ímpares ou apenas por números pares. Como todos os primos exceto o 2 são ímpares, metade das diagonais não tem primo nenhum (tirando o solitário 2) e os primos são obrigados a ficar na outra metade.",
          "A segunda razão é a álgebra. Ao percorrer uma semirreta diagonal, os números que encontras são os valores de um polinómio quadrático, por exemplo 1, 9, 25, 49, … = (2n + 1)² na semirreta que parte do 1 para baixo e para a direita. Alguns polinómios quadráticos nunca podem dar primos, porque se fatorizam ou são sempre divisíveis por um primo pequeno. Outros evitam todos os divisores pequenos e produzem primos com muito mais frequência do que a média. Hardy e Littlewood conjeturaram em 1923 com que frequência exata cada polinómio quadrático deveria acertar em primos; ninguém demonstrou que algum deles produz infinitos.",
        ],
        formula: EULER_FORMULA,
      },
      {
        heading: "O que fazem os controlos",
        paragraphs: [
          "O lado da grelha vai de 51 a 501 em passos de 2. Mantém-se ímpar para que o 1 fique exatamente na célula central, que tem um contorno ciano. O cabeçalho mostra quantos números a grelha contém e quantos deles são primos: 378 primos entre 2601 números no tamanho mais pequeno, 22\u00a0115 entre 251\u00a0001 no maior.",
          "O menu de destaque pinta de rosa os primos que são valores de um polinómio quadrático escolhido: o n² − n + 41 de Euler (a opção predefinida), n² + n + 17, n² + n + 11, 4n² − 2n + 41 e n², ou então desliga o destaque. Só os primos são desenhados, por isso uma célula rosa é sempre um valor primo do polinómio; são verificados os valores para n de 0 a 599.",
        ],
      },
      {
        heading: "Como está construído",
        paragraphs: [
          "A primalidade vem de um crivo de Eratóstenes sobre um Uint8Array com um byte por número até lado² + 5, recalculado apenas quando o tamanho da grelha muda. Mesmo no tamanho maior, são cerca de um quarto de milhão de bytes e demora poucos milissegundos.",
          "Para colocar um número não é preciso percorrer a espiral. O anel k em torno do centro contém os números de (2k − 1)² + 1 a (2k + 1)², porque cada anel termina com um quadrado ímpar no canto inferior direito. A partir de n, o código calcula o respetivo anel com uma única raiz quadrada, depois o deslocamento dentro do anel, e esse deslocamento indica em qual dos quatro lados o número está e em que posição. A função abaixo é essa fórmula fechada.",
          "O canvas é dimensionado de acordo com a densidade de píxeis do dispositivo e redesenhado sempre que muda o tamanho da grelha, o destaque ou o tamanho da janela. Cada primo é um quadrado preenchido, âmbar ou rosa. As células destacadas são guardadas num Set de chaves (x, y) compactadas, pelo que o ciclo de desenho consegue verificar cada primo em tempo constante. Nada é animado, por isso a definição de movimento reduzido não tem nada para desligar.",
        ],
        code: SPIRAL_EXCERPT,
      },
      {
        heading: "O que mostram os polinómios",
        paragraphs: [
          "O polinómio de Euler n² − n + 41 dá primos para os 41 valores consecutivos n = 0 a 40 e falha em n = 41, onde vale 41². n² + n + 17 é primo para n = 0 a 15 e n² + n + 11 para n = 0 a 9. 4n² − 2n + 41 é o polinómio de Euler calculado em 2n, por isso escolhe um valor em cada dois e é primo para n = 0 a 20.",
          "Na espiral, esses primos garantidos ficam dispersos perto do centro, porque a constante 41 é maior do que os anéis interiores. A partir de n = 40, porém, cada valor do polinómio de Euler cai numa de duas retas diagonais que vão de baixo, à esquerda, para cima, à direita, deslocadas 40 colunas para cada lado da diagonal que passa pelo 1. Na grelha predefinida, cerca de sete em cada dez desses valores posteriores ainda são primos, pelo que as retas se mantêm visivelmente rosa. n² é o contraexemplo: nenhum quadrado é primo, por isso nada fica rosa.",
        ],
      },
    ],
    experimentsHeading: "Experimenta isto",
    experiments: [
      {
        title: "Mede como os primos rareiam",
        text: "Compara a grelha mais pequena (378 primos entre 2601 números, cerca de 14,5 por cento) com a maior (22\u00a0115 entre 251\u00a0001, cerca de 8,8 por cento). Ambas coincidem com a estimativa 1/(ln N − 1) do teorema dos números primos, com uma diferença de poucas décimas de ponto percentual.",
      },
      {
        title: "Segue as retas de Euler",
        text: "Mantém o polinómio de Euler selecionado com lado 251. Ignora o aglomerado rosa perto do centro e olha mais para fora: duas diagonais rosa paralelas vão de baixo, à esquerda, para cima, à direita, a 40 células do centro de cada lado.",
      },
      {
        title: "Encontra a diagonal vazia",
        text: "Seleciona n² e começa na célula central de contorno ciano. Segue a diagonal para baixo e para a direita: contém 9, 25, 49 e todos os outros quadrados ímpares, por isso nem uma única célula está marcada. Essa semirreta escura é a diagonal sem primos mais simples que existe.",
      },
      {
        title: "Afasta a vista",
        text: "Arrasta o lado até 501. A grelha contém agora um quarto de milhão de números e as células ficam minúsculas, mas os riscos diagonais sobressaem com mais nitidez do que nos tamanhos pequenos, enquanto a densidade global continua a descer.",
      },
    ],
  },
  sv: {
    metaDescription:
      "Utforska Ulams spiral av primtal: upp till 251\u00a0001 tal i en kvadratisk spiral, primtalsrika diagonaler och Eulers n² − n + 41 markerat direkt i bilden.",
    heading: "Så fungerar den här utforskaren",
    intro:
      "Skriv 1 mitt i ett rutnät, 2 till höger om den, och fortsätt räkna i en kvadratisk spiral, moturs, varv efter varv. Markera sedan bara primtalen. I standardstorleken 251 × 251 rymmer rutnätet 63\u00a0001 tal, varav 6320 är primtal, och markeringarna ser inte ut som slumpmässigt damm: de radar upp sig längs diagonaler. Stanisław Ulam lade märke till det 1963 när han satt och klottrade under ett föredrag. En del av mönstret har en enkel förklaring, och en del är fortfarande ett öppet problem.",
    sections: [
      {
        heading: "Varför primtal gillar diagonaler",
        paragraphs: [
          "Det första skälet är paritet. I den här spiralen är ett tal udda precis när x + y är jämnt, så udda och jämna tal bildar ett schackbräde. Ett diagonalt steg ändrar x + y med 0 eller 2, vilket bevarar pariteten, så varje diagonal består enbart av udda tal eller enbart av jämna. Eftersom alla primtal utom 2 är udda bär hälften av diagonalerna inga primtal alls (bortsett från den ensamma tvåan), och primtalen tvingas in på den andra hälften.",
          "Det andra skälet är algebra. När du går längs en diagonal stråle är talen du möter värdena av ett andragradspolynom, till exempel 1, 9, 25, 49, … = (2n + 1)² på strålen som går nedåt till höger från 1. Vissa andragradspolynom kan aldrig ge primtal, eftersom de går att faktorisera eller alltid är delbara med ett litet primtal. Andra undviker alla små delare och ger primtal mycket oftare än genomsnittet. Hardy och Littlewood förmodade 1923 exakt hur ofta varje andragradspolynom borde träffa primtal; ingen har bevisat att något andragradspolynom ger oändligt många.",
        ],
        formula: EULER_FORMULA,
      },
      {
        heading: "Vad reglagen gör",
        paragraphs: [
          "Rutnätets sida går från 51 till 501 i steg om 2. Den förblir udda så att 1 hamnar exakt i mittrutan, som har en cyanfärgad ram. Rubrikraden visar hur många tal rutnätet rymmer och hur många av dem som är primtal: 378 primtal bland 2601 tal i den minsta storleken, 22\u00a0115 bland 251\u00a0001 i den största.",
          "Markeringsmenyn färgar de primtal rosa som är värden av ett valt andragradspolynom: Eulers n² − n + 41 (standard), n² + n + 17, n² + n + 11, 4n² − 2n + 41 och n², eller stänger av markeringen. Bara primtal ritas ut, så en rosa ruta är alltid ett primtalsvärde av polynomet; värdena för n från 0 till 599 kontrolleras.",
        ],
      },
      {
        heading: "Hur den är byggd",
        paragraphs: [
          "Om ett tal är ett primtal avgörs med Eratosthenes såll över en Uint8Array med en byte per tal upp till sida² + 5, och det räknas bara om när rutnätets storlek ändras. Även i den största storleken handlar det om ungefär en kvarts miljon byte och några få millisekunder.",
          "För att placera ett tal behöver man inte vandra längs spiralen. Ring k runt mitten innehåller talen från (2k − 1)² + 1 till (2k + 1)², eftersom varje ring slutar med en udda kvadrat i sitt nedre högra hörn. Utifrån n beräknar koden ringen med en enda kvadratrot och sedan förskjutningen inom ringen, och förskjutningen avgör vilken av de fyra sidorna talet ligger på och var. Funktionen nedan är den slutna formeln.",
          "Canvasen anpassas efter enhetens pixeltäthet och ritas om varje gång rutnätets storlek, markeringen eller fönstrets storlek ändras. Varje primtal är en fylld kvadrat, bärnstensfärgad eller rosa. De markerade rutorna lagras i ett Set av packade (x, y)-nycklar, så ritslingan kan kontrollera varje primtal på konstant tid. Ingenting är animerat, så en inställning för minskad rörelse har inget att stänga av.",
        ],
        code: SPIRAL_EXCERPT,
      },
      {
        heading: "Vad polynomen visar",
        paragraphs: [
          "Eulers polynom n² − n + 41 ger primtal för de 41 på varandra följande värdena n = 0 till 40 och misslyckas vid n = 41, där det blir 41². n² + n + 17 är ett primtal för n = 0 till 15 och n² + n + 11 för n = 0 till 9. 4n² − 2n + 41 är Eulers polynom beräknat i 2n, så det plockar ut vartannat värde och är ett primtal för n = 0 till 20.",
          "På spiralen ligger de garanterade primtalen utspridda nära mitten, eftersom konstanten 41 är större än de inre ringarna. Från n = 40 och framåt hamnar däremot varje värde av Eulers polynom på en av två diagonala linjer som går från nedre vänstra till övre högra hörnet, förskjutna 40 kolumner åt vardera hållet från diagonalen genom 1. Inom standardrutnätet är ungefär sju av tio av dessa senare värden fortfarande primtal, så linjerna förblir synligt rosa. n² är motexemplet: ingen kvadrat är ett primtal, så ingenting blir rosa.",
        ],
      },
    ],
    experimentsHeading: "Prova det här",
    experiments: [
      {
        title: "Mät hur primtalen glesnar",
        text: "Jämför det minsta rutnätet (378 primtal bland 2601 tal, ungefär 14,5 procent) med det största (22\u00a0115 bland 251\u00a0001, ungefär 8,8 procent). Båda stämmer med primtalssatsens uppskattning 1/(ln N − 1) på några tiondels procentenheter när.",
      },
      {
        title: "Följ Eulers linjer",
        text: "Låt Eulers polynom vara valt med sidan 251. Bortse från den rosa klungan nära mitten och titta längre ut: två parallella rosa diagonaler går från nedre vänstra till övre högra hörnet, 40 rutor från mitten på vardera sidan.",
      },
      {
        title: "Hitta den tomma diagonalen",
        text: "Välj n² och börja vid den cyaninramade mittrutan. Följ diagonalen nedåt till höger: på den ligger 9, 25, 49 och alla andra udda kvadrater, så inte en enda ruta på den är markerad. Den mörka strålen är den enklaste primtalsfria diagonal som finns.",
      },
      {
        title: "Zooma ut",
        text: "Dra sidan till 501. Rutnätet rymmer nu en kvarts miljon tal och rutorna blir pyttesmå, men de diagonala strimmorna framträder tydligare än i små storlekar, samtidigt som den totala tätheten fortsätter att sjunka.",
      },
    ],
  },
  no: {
    metaDescription:
      "Utforsk Ulam-spiralen av primtall: opptil 251\u00a0001 tall i en kvadratisk spiral, primtallsrike diagonaler og Eulers n² − n + 41 fremhevet rett i bildet.",
    heading: "Slik fungerer denne utforskeren",
    intro:
      "Skriv 1 midt i et rutenett, 2 til høyre for den, og fortsett å telle i en kvadratisk spiral, mot klokken, ring etter ring. Marker deretter bare primtallene. I standardstørrelsen 251 × 251 rommer rutenettet 63\u00a0001 tall, hvorav 6320 er primtall, og merkene ser ikke ut som tilfeldig støv: De stiller seg opp langs diagonaler. Stanisław Ulam la merke til dette i 1963 mens han satt og rablet under et foredrag. En del av mønsteret har en enkel forklaring, og en del er fortsatt et åpent problem.",
    sections: [
      {
        heading: "Hvorfor primtall liker diagonaler",
        paragraphs: [
          "Den første grunnen er paritet. I denne spiralen er et tall odde nøyaktig når x + y er et partall, så oddetall og partall danner et sjakkbrett. Et diagonalt steg endrer x + y med 0 eller 2, noe som bevarer pariteten, så hver diagonal består utelukkende av oddetall eller utelukkende av partall. Siden alle primtall unntatt 2 er odde, har halvparten av diagonalene ingen primtall i det hele tatt (bortsett fra det ene totallet), og primtallene tvinges over på den andre halvparten.",
          "Den andre grunnen er algebra. Når du går langs en diagonal stråle, er tallene du møter verdiene til et andregradspolynom, for eksempel 1, 9, 25, 49, … = (2n + 1)² på strålen som går nedover til høyre fra 1. Noen andregradspolynomer kan aldri gi primtall, fordi de lar seg faktorisere eller alltid er delelige med et lite primtall. Andre unngår alle små divisorer og gir primtall mye oftere enn gjennomsnittet. Hardy og Littlewood formodet i 1923 nøyaktig hvor ofte hvert andregradspolynom burde treffe primtall; ingen har bevist at noe andregradspolynom gir uendelig mange.",
        ],
        formula: EULER_FORMULA,
      },
      {
        heading: "Hva kontrollene gjør",
        paragraphs: [
          "Rutenettets side går fra 51 til 501 i steg på 2. Den forblir odde slik at 1 havner nøyaktig i midtruten, som har en cyanfarget ramme. Topplinjen viser hvor mange tall rutenettet rommer og hvor mange av dem som er primtall: 378 primtall blant 2601 tall i den minste størrelsen, 22\u00a0115 blant 251\u00a0001 i den største.",
          "Fremhevingsmenyen farger de primtallene rosa som er verdier av et valgt andregradspolynom: Eulers n² − n + 41 (standardvalget), n² + n + 17, n² + n + 11, 4n² − 2n + 41 og n², eller slår fremhevingen av. Bare primtall tegnes, så en rosa rute er alltid en primtallsverdi av polynomet; verdiene for n fra 0 til 599 blir sjekket.",
        ],
      },
      {
        heading: "Slik er den bygget",
        paragraphs: [
          "Om et tall er et primtall, avgjøres med Eratosthenes' sil over en Uint8Array med én byte per tall opp til side² + 5, og den regnes bare ut på nytt når størrelsen på rutenettet endres. Selv i den største størrelsen er det omtrent en kvart million byte, og det tar noen få millisekunder.",
          "For å plassere et tall trenger man ikke å gå langs spiralen. Ring k rundt midten inneholder tallene fra (2k − 1)² + 1 til (2k + 1)², fordi hver ring slutter med et odde kvadrattall i nedre høyre hjørne. Ut fra n beregner koden ringen med én enkelt kvadratrot og deretter forskyvningen innenfor ringen, og forskyvningen forteller hvilken av de fire sidene tallet ligger på, og hvor. Funksjonen nedenfor er denne lukkede formelen.",
          "Lerretet tilpasses enhetens pikseltetthet og tegnes på nytt hver gang størrelsen på rutenettet, fremhevingen eller vindusstørrelsen endres. Hvert primtall er et fylt kvadrat, ravgult eller rosa. De fremhevede rutene lagres i et Set av pakkede (x, y)-nøkler, så tegneløkken kan sjekke hvert primtall i konstant tid. Ingenting er animert, så en innstilling for redusert bevegelse har ingenting å slå av.",
        ],
        code: SPIRAL_EXCERPT,
      },
      {
        heading: "Hva polynomene viser",
        paragraphs: [
          "Eulers polynom n² − n + 41 gir primtall for de 41 påfølgende verdiene n = 0 til 40 og svikter ved n = 41, der det blir 41². n² + n + 17 er et primtall for n = 0 til 15 og n² + n + 11 for n = 0 til 9. 4n² − 2n + 41 er Eulers polynom beregnet i 2n, så det plukker ut annenhver verdi og er et primtall for n = 0 til 20.",
          "På spiralen ligger disse garanterte primtallene spredt nær midten, fordi konstanten 41 er større enn de indre ringene. Fra n = 40 og utover havner derimot hver verdi av Eulers polynom på en av to diagonale linjer som går fra nede til venstre til oppe til høyre, forskjøvet 40 kolonner til hver side av diagonalen gjennom 1. Innenfor standardrutenettet er omtrent sju av ti av disse senere verdiene fortsatt primtall, så linjene forblir synlig rosa. n² er moteksemplet: Ingen kvadrattall er primtall, så ingenting blir rosa.",
        ],
      },
    ],
    experimentsHeading: "Prøv dette",
    experiments: [
      {
        title: "Mål hvordan primtallene tynnes ut",
        text: "Sammenlign det minste rutenettet (378 primtall blant 2601 tall, omtrent 14,5 prosent) med det største (22\u00a0115 blant 251\u00a0001, omtrent 8,8 prosent). Begge stemmer med primtallsteoremets anslag 1/(ln N − 1) på noen få tideler av et prosentpoeng nær.",
      },
      {
        title: "Følg Eulers linjer",
        text: "La Eulers polynom være valgt med side 251. Se bort fra den rosa klyngen nær midten og se lenger ut: To parallelle rosa diagonaler går fra nede til venstre til oppe til høyre, 40 ruter fra midten på hver side.",
      },
      {
        title: "Finn den tomme diagonalen",
        text: "Velg n² og start i midtruten med cyanfarget ramme. Følg diagonalen nedover til høyre: På den ligger 9, 25, 49 og alle andre odde kvadrattall, så ikke en eneste rute på den er markert. Den mørke strålen er den enkleste primtallsfrie diagonalen som finnes.",
      },
      {
        title: "Zoom ut",
        text: "Dra siden til 501. Rutenettet rommer nå en kvart million tall, og rutene blir bitte små, men de diagonale stripene trer tydeligere fram enn i små størrelser, mens den samlede tettheten fortsetter å synke.",
      },
    ],
  },
};
