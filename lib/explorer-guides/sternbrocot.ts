import type { ExplorerGuide } from "./types";

// Paths, step numbers and continued fractions quoted here were produced by
// walk() and pathToCF() from app/[locale]/sternbrocot/explorer/page.tsx with
// the preset inputs and default depth 20 (range 4 to 60); update both together.
const WALK_EXCERPT = `// Sign of target − n/d; a typed fraction is compared in whole numbers.
const compare = (n: number, d: number): number => {
  if (target.ratio) return target.ratio.num * d - n * target.ratio.den;
  const val = n / d;
  return Math.abs(val - target.value) < 1e-15 ? 0 : target.value - val;
};
for (let i = 0; i < maxDepth; i++) {
  const c = compare(med_n, med_d);
  if (c === 0) break;
  if (c < 0) {
    hi_n = med_n; hi_d = med_d;
    out[out.length - 1].side = "L";
  } else {
    lo_n = med_n; lo_d = med_d;
    out[out.length - 1].side = "R";
  }
  med_n = lo_n + hi_n;   // the mediant of the two bounds
  med_d = lo_d + hi_d;
  if (med_d > 1e15) break;
  out.push({ num: med_n, den: med_d, side: null });
}`;

export const STERNBROCOT_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Walk the Stern-Brocot tree to any number: see its L/R path, the continued fraction it encodes and the best rational approximations, from φ to π and 355/113.",
    heading: "How this explorer works",
    intro:
      "Every positive fraction lives at exactly one place in a single infinite binary tree, the Stern-Brocot tree. Starting at 1/1 you can reach any of them by a sequence of left and right moves, where each move says whether the target is smaller or larger than the fraction you are standing on. This page performs that walk for a number you choose and prints three things: the string of L and R moves, the continued fraction those moves encode, and a table of the fractions visited on the way, together with how far each one is from the target.",
    sections: [
      {
        heading: "Mediants",
        paragraphs: [
          "The tree is built from one strange-looking operation. The mediant of two fractions a/b and c/d is (a + c)/(b + d): add the numerators, add the denominators. It is not the average, but it always lies strictly between the two. Start with 0/1 and 1/0, which plays the role of infinity, and insert their mediant 1/1. Then insert mediants between every pair of neighbours, level after level.",
          "Two facts make the result remarkable. Neighbouring fractions a/b < c/d in the construction always satisfy bc − ad = 1, and because of that every mediant is automatically in lowest terms. And every positive rational number appears, exactly once. Achille Brocot, a French clockmaker, used the tree to find gear ratios that approximate a desired value with small numbers of teeth, which is precisely what the walk on this page does.",
        ],
        formula: "\\frac{a}{b} < \\frac{a+c}{b+d} < \\frac{c}{d}, \\qquad bc - ad = 1",
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "Type any positive number into the target field, as a decimal or as a fraction such as 22/7. The page opens with the golden ratio φ, rounded to 1.61803399. The buttons below fill in φ, π, e and √2 with 12 decimal places, and 1/3, 2/3 and 22/7 as exact fractions.",
          "The depth slider, from 4 to 60 (default 20), caps the number of moves. The status line shows the target and how many fractions the walk visited; the path line shows the moves, ending with a dot. The table lists every visited fraction with its decimal value, its error and the move taken from it, so at depth 60 it has up to 61 rows.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "The walk keeps a lower bound and an upper bound, starting at 0/1 and 1/0, and the current fraction is always their mediant. If the target is smaller, the current fraction becomes the new upper bound and the move is L; otherwise it becomes the lower bound and the move is R. It stops when the fraction equals the target, when the denominator would exceed 10¹⁵, or when the depth limit is reached. For a target typed as a fraction p/q the comparison uses whole numbers only (it cross-multiplies), so it is exact; for a decimal, equal means within 10⁻¹⁵. Plain JavaScript numbers represent integers exactly up to about 9 · 10¹⁵, so the cap keeps every printed fraction exact.",
          "The continued fraction comes from run lengths: the moves always arrive in blocks such as RRR, then LLLLLLL, and the block lengths are the terms. A walk that begins with L belongs to a number below 1, so a leading 0 is added. When the walk lands exactly on the target, the last block is one move short of the final term, and the page adds that one back. Everything is recomputed from the input during rendering; nothing is animated.",
        ],
        code: WALK_EXCERPT,
      },
      {
        heading: "What the runs tell you",
        paragraphs: [
          "φ = [1; 1, 1, 1, …] has the path RLRLRL…, and the fractions it visits are ratios of consecutive Fibonacci numbers: 2/1, 3/2, 5/3, 8/5, up to 17711/10946 at depth 20. Because every block has length one, the walk changes direction as often as possible and closes in as slowly as possible. In a precise sense, made exact by Hurwitz's theorem, no irrational number is harder to approximate by fractions than φ.",
          "π is the opposite. Its path starts RRR, then seven L, fifteen R, one L, and then a very long run of R. That last run reflects the large term 292 in π = [3; 7, 15, 1, 292, …]: the next good fraction after 355/113 is far away, which is exactly why 355/113 is such an outstanding approximation. With 12 decimals and at most 60 moves, the page can only show the first 34 moves of that run.",
          "Fractions end their walk. The 1/3 button gives the path LL, stops at step 3 and prints [0; 3], and 22/7 stops at step 10 with [3; 7]. A finite decimal is an honest rational too, but a different one: type 0.333333333333, which is slightly less than 1/3, and the walk passes 1/3 at step 3, turns, and keeps going; at depth 60 the continued fraction reads [0; 3, 57].",
        ],
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "Fibonacci in disguise",
        text: "Keep the default golden ratio and read down the fraction column: 1/1, 2/1, 3/2, 5/3, 8/5, 13/8. Each numerator is the sum of the two before it, and the error shrinks by a factor of about 2.6 per step.",
      },
      {
        title: "Find 355/113",
        text: "Choose π and set the depth to 30, so the walk gets far enough. 22/7 appears at step 10 with an error of about 1.3 · 10⁻³, and 355/113 at step 26 with an error of about 2.7 · 10⁻⁷.",
      },
      {
        title: "Watch a walk end",
        text: "Type 0.75. The path is LRR and stops at 3/4, and the continued fraction is [0; 1, 3]. Then try 1.4142 with the depth at 60: after 41 moves the walk lands exactly on 7071/5000.",
      },
      {
        title: "The rhythm of √2",
        text: "Choose √2. The path settles into RLLRRLLRR…, so every term after the first is 2, and the table lists 3/2, 7/5, 17/12, 41/29 and 99/70, solutions of p² − 2q² = ±1.",
      },
    ],
  },
  de: {
    metaDescription:
      "Den Stern-Brocot-Baum bis zu jeder Zahl durchwandern: L/R-Pfad, Kettenbruch und beste rationale Näherungen ansehen, von φ über π bis 355/113.",
    heading: "So funktioniert dieser Explorer",
    intro:
      "Jeder positive Bruch hat genau einen Platz in einem einzigen unendlichen Binärbaum, dem Stern-Brocot-Baum. Von 1/1 aus erreichst du jeden davon durch eine Folge von Schritten nach links und rechts, wobei jeder Schritt sagt, ob das Ziel kleiner oder größer ist als der Bruch, auf dem du gerade stehst. Diese Seite geht diesen Weg für eine Zahl deiner Wahl und zeigt drei Dinge: die Folge der L- und R-Schritte, den Kettenbruch, den diese Schritte kodieren, und eine Tabelle der besuchten Brüche samt ihrem Abstand zum Ziel.",
    sections: [
      {
        heading: "Medianten",
        paragraphs: [
          "Der Baum entsteht aus einer seltsam aussehenden Operation. Die Mediante zweier Brüche a/b und c/d ist (a + c)/(b + d): Zähler addieren, Nenner addieren. Das ist nicht der Mittelwert, liegt aber immer echt zwischen den beiden. Beginne mit 0/1 und 1/0, das hier die Rolle von unendlich spielt, und füge ihre Mediante 1/1 ein. Dann fügst du zwischen allen Nachbarpaaren Medianten ein, Ebene für Ebene.",
          "Zwei Tatsachen machen das Ergebnis bemerkenswert. Benachbarte Brüche a/b < c/d der Konstruktion erfüllen immer bc − ad = 1, und deshalb ist jede Mediante automatisch vollständig gekürzt. Und jede positive rationale Zahl kommt vor, genau einmal. Achille Brocot, ein französischer Uhrmacher, suchte mit dem Baum Zahnradübersetzungen, die einen gewünschten Wert mit kleinen Zähnezahlen annähern, und genau das tut der Weg auf dieser Seite.",
        ],
        formula: "\\frac{a}{b} < \\frac{a+c}{b+d} < \\frac{c}{d}, \\qquad bc - ad = 1",
      },
      {
        heading: "Was die Regler bewirken",
        paragraphs: [
          "Tipp eine beliebige positive Zahl ins Zielfeld, als Dezimalzahl oder als Bruch wie 22/7. Die Seite startet mit dem goldenen Schnitt φ, gerundet auf 1.61803399 (das Eingabefeld versteht Punkt und Komma). Die Knöpfe darunter setzen φ, π, e und √2 mit 12 Nachkommastellen ein, 1/3, 2/3 und 22/7 als exakte Brüche.",
          "Der Tiefenregler von 4 bis 60 (voreingestellt 20) begrenzt die Zahl der Schritte. Die Statuszeile zeigt das Ziel und wie viele Brüche der Weg besucht hat; die Pfadzeile zeigt die Schritte und endet mit einem Punkt. Die Tabelle listet jeden besuchten Bruch mit Dezimalwert, Fehler und dem Schritt, der von ihm aus folgte, bei Tiefe 60 hat sie also bis zu 61 Zeilen.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Der Weg merkt sich eine untere und eine obere Schranke, anfangs 0/1 und 1/0, und der aktuelle Bruch ist immer ihre Mediante. Ist das Ziel kleiner, wird der aktuelle Bruch zur neuen oberen Schranke und der Schritt heißt L; sonst wird er zur unteren Schranke und der Schritt heißt R. Der Weg endet, wenn der Bruch dem Ziel gleicht, wenn der Nenner 10¹⁵ überschreiten würde oder wenn die Tiefengrenze erreicht ist. Bei einem Ziel, das als Bruch p/q eingegeben wurde, rechnet der Vergleich nur mit ganzen Zahlen (er multipliziert über Kreuz) und ist damit exakt; bei einer Dezimalzahl heißt gleich: bis auf 10⁻¹⁵. Gewöhnliche JavaScript-Zahlen stellen ganze Zahlen bis etwa 9 · 10¹⁵ exakt dar, die Grenze hält also jeden angezeigten Bruch exakt.",
          "Der Kettenbruch ergibt sich aus Lauflängen: Die Schritte kommen immer in Blöcken wie RRR, dann LLLLLLL, und die Blocklängen sind die Glieder. Ein Weg, der mit L beginnt, gehört zu einer Zahl unter 1, deshalb wird eine 0 vorangestellt. Landet der Weg genau auf dem Ziel, ist der letzte Block einen Schritt kürzer als das letzte Glied, und die Seite zählt diesen Schritt dazu. Alles wird beim Rendern aus der Eingabe neu berechnet; nichts ist animiert.",
        ],
        code: WALK_EXCERPT,
      },
      {
        heading: "Was die Läufe verraten",
        paragraphs: [
          "φ = [1; 1, 1, 1, …] hat den Pfad RLRLRL…, und die besuchten Brüche sind Quotienten aufeinanderfolgender Fibonacci-Zahlen: 2/1, 3/2, 5/3, 8/5, bis 17711/10946 bei Tiefe 20. Weil jeder Block die Länge eins hat, wechselt der Weg so oft wie möglich die Richtung und nähert sich so langsam wie möglich. In einem präzisen Sinn, den der Satz von Hurwitz exakt macht, lässt sich keine irrationale Zahl schlechter durch Brüche annähern als φ.",
          "π ist das Gegenteil. Sein Pfad beginnt mit RRR, dann sieben L, fünfzehn R, ein L und dann ein sehr langer Lauf aus R. Dieser letzte Lauf spiegelt das große Glied 292 in π = [3; 7, 15, 1, 292, …]: Der nächste gute Bruch nach 355/113 ist weit entfernt, und genau deshalb ist 355/113 eine so herausragende Näherung. Mit 12 Nachkommastellen und höchstens 60 Schritten zeigt die Seite nur die ersten 34 Schritte dieses Laufs.",
          "Brüche beenden ihren Weg. Der Knopf 1/3 ergibt den Pfad LL, hält in Schritt 3 und zeigt [0; 3], und 22/7 hält in Schritt 10 mit [3; 7]. Auch eine endliche Dezimalzahl ist eine ehrliche rationale Zahl, nur eine andere: Tipp 0.333333333333 ein, das ist etwas kleiner als 1/3, und der Weg passiert 1/3 in Schritt 3, biegt ab und läuft weiter; bei Tiefe 60 lautet der Kettenbruch [0; 3, 57].",
        ],
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Fibonacci in Verkleidung",
        text: "Lass den goldenen Schnitt stehen und lies die Bruchspalte von oben nach unten: 1/1, 2/1, 3/2, 5/3, 8/5, 13/8. Jeder Zähler ist die Summe der beiden davor, und der Fehler schrumpft pro Schritt etwa um den Faktor 2,6.",
      },
      {
        title: "355/113 finden",
        text: "Wähle π und stell die Tiefe auf 30, damit der Weg weit genug kommt. 22/7 erscheint in Schritt 10 mit einem Fehler von etwa 1,3 · 10⁻³, 355/113 in Schritt 26 mit einem Fehler von etwa 2,7 · 10⁻⁷.",
      },
      {
        title: "Einen Weg enden sehen",
        text: "Tipp 0.75 ein. Der Pfad ist LRR und hält bei 3/4, der Kettenbruch lautet [0; 1, 3]. Probier dann 1.4142 bei Tiefe 60: Nach 41 Schritten landet der Weg genau auf 7071/5000.",
      },
      {
        title: "Der Rhythmus von √2",
        text: "Wähle √2. Der Pfad pendelt sich auf RLLRRLLRR… ein, jedes Glied nach dem ersten ist also 2, und die Tabelle zeigt 3/2, 7/5, 17/12, 41/29 und 99/70, Lösungen von p² − 2q² = ±1.",
      },
    ],
  },
  es: {
    metaDescription:
      "Recorre el árbol de Stern-Brocot hasta cualquier número: mira su camino L/R, su fracción continua y las mejores aproximaciones racionales, de φ a π y 355/113.",
    heading: "Cómo funciona este explorador",
    intro:
      "Toda fracción positiva ocupa exactamente un lugar en un único árbol binario infinito, el árbol de Stern-Brocot. Partiendo de 1/1 puedes llegar a cualquiera de ellas con una sucesión de pasos a la izquierda y a la derecha, donde cada paso indica si el objetivo es menor o mayor que la fracción en la que estás. Esta página recorre ese camino para el número que elijas y muestra tres cosas: la cadena de pasos L y R, la fracción continua que esos pasos codifican y una tabla con las fracciones visitadas por el camino, junto con la distancia de cada una al objetivo.",
    sections: [
      {
        heading: "Mediantes",
        paragraphs: [
          "El árbol se construye con una sola operación de aspecto extraño. La mediante de dos fracciones a/b y c/d es (a + c)/(b + d): se suman los numeradores y se suman los denominadores. No es la media, pero siempre queda estrictamente entre las dos. Empieza con 0/1 y 1/0, que hace el papel de infinito, e inserta su mediante 1/1. Después inserta mediantes entre cada par de vecinas, nivel tras nivel.",
          "Dos hechos hacen que el resultado sea notable. Las fracciones vecinas a/b < c/d de la construcción cumplen siempre bc − ad = 1, y por eso toda mediante es automáticamente irreducible. Y todo número racional positivo aparece, exactamente una vez. Achille Brocot, un relojero francés, usó el árbol para encontrar relaciones de engranajes que aproximan un valor deseado con pocos dientes, que es precisamente lo que hace el recorrido de esta página.",
        ],
        formula: "\\frac{a}{b} < \\frac{a+c}{b+d} < \\frac{c}{d}, \\qquad bc - ad = 1",
      },
      {
        heading: "Qué hacen los controles",
        paragraphs: [
          "Escribe cualquier número positivo en el campo del objetivo, como decimal o como fracción, por ejemplo 22/7. La página se abre con el número áureo φ, redondeado a 1.61803399. Los botones de debajo introducen φ, π, e y √2 con 12 cifras decimales, y 1/3, 2/3 y 22/7 como fracciones exactas.",
          "El deslizador de profundidad, de 4 a 60 (por defecto 20), limita el número de pasos. La línea de estado muestra el objetivo y cuántas fracciones ha visitado el recorrido; la línea del camino muestra los pasos y termina con un punto. La tabla recoge cada fracción visitada con su valor decimal, su error y el paso que se dio desde ella, así que con profundidad 60 tiene hasta 61 filas.",
        ],
      },
      {
        heading: "Cómo está construido",
        paragraphs: [
          "El recorrido mantiene una cota inferior y una cota superior, que empiezan en 0/1 y 1/0, y la fracción actual es siempre su mediante. Si el objetivo es menor, la fracción actual pasa a ser la nueva cota superior y el paso es L; en caso contrario pasa a ser la cota inferior y el paso es R. Se detiene cuando la fracción es igual al objetivo, cuando el denominador superaría 10¹⁵ o cuando se alcanza el límite de profundidad. Para un objetivo escrito como fracción p/q la comparación usa solo números enteros (multiplica en cruz), así que es exacta; para un decimal, igual significa con una diferencia menor que 10⁻¹⁵. Los números ordinarios de JavaScript representan los enteros de forma exacta hasta unos 9 · 10¹⁵, de modo que el límite mantiene exacta cada fracción mostrada.",
          "La fracción continua sale de las longitudes de las rachas: los pasos llegan siempre en bloques como RRR, luego LLLLLLL, y las longitudes de los bloques son los términos. Un recorrido que empieza por L corresponde a un número menor que 1, así que se antepone un 0. Cuando el recorrido cae exactamente en el objetivo, al último bloque le falta un paso para igualar el último término, y la página se lo vuelve a sumar. Todo se recalcula a partir de la entrada durante el renderizado; nada está animado.",
        ],
        code: WALK_EXCERPT,
      },
      {
        heading: "Lo que cuentan las rachas",
        paragraphs: [
          "φ = [1; 1, 1, 1, …] tiene el camino RLRLRL…, y las fracciones que visita son cocientes de números de Fibonacci consecutivos: 2/1, 3/2, 5/3, 8/5, hasta 17711/10946 con profundidad 20. Como cada bloque tiene longitud uno, el recorrido cambia de dirección tan a menudo como es posible y se acerca tan despacio como es posible. En un sentido preciso, que el teorema de Hurwitz hace exacto, ningún número irracional es más difícil de aproximar con fracciones que φ.",
          "π es lo contrario. Su camino empieza con RRR, luego siete L, quince R, una L y después una racha muy larga de R. Esa última racha refleja el término grande 292 en π = [3; 7, 15, 1, 292, …]: la siguiente fracción buena después de 355/113 queda muy lejos, y justo por eso 355/113 es una aproximación tan sobresaliente. Con 12 decimales y 60 pasos como máximo, la página solo puede mostrar los primeros 34 pasos de esa racha.",
          "Las fracciones terminan su recorrido. El botón 1/3 da el camino LL, se detiene en el paso 3 y muestra [0; 3], y 22/7 se detiene en el paso 10 con [3; 7]. Un decimal finito también es un racional de pleno derecho, pero otro distinto: escribe 0.333333333333, que es un poco menor que 1/3, y el recorrido pasa por 1/3 en el paso 3, gira y sigue adelante; con profundidad 60 la fracción continua es [0; 3, 57].",
        ],
      },
    ],
    experimentsHeading: "Prueba esto",
    experiments: [
      {
        title: "Fibonacci disfrazado",
        text: "Deja el número áureo por defecto y lee la columna de fracciones de arriba abajo: 1/1, 2/1, 3/2, 5/3, 8/5, 13/8. Cada numerador es la suma de los dos anteriores, y el error se reduce en un factor de aproximadamente 2,6 por paso.",
      },
      {
        title: "Encuentra 355/113",
        text: "Elige π y pon la profundidad en 30, para que el recorrido llegue lo bastante lejos. 22/7 aparece en el paso 10 con un error de unos 1,3 · 10⁻³, y 355/113 en el paso 26 con un error de unos 2,7 · 10⁻⁷.",
      },
      {
        title: "Mira cómo termina un recorrido",
        text: "Escribe 0.75. El camino es LRR y se detiene en 3/4, y la fracción continua es [0; 1, 3]. Prueba después 1.4142 con la profundidad en 60: tras 41 pasos el recorrido cae exactamente en 7071/5000.",
      },
      {
        title: "El ritmo de √2",
        text: "Elige √2. El camino se estabiliza en RLLRRLLRR…, así que todos los términos después del primero valen 2, y la tabla muestra 3/2, 7/5, 17/12, 41/29 y 99/70, soluciones de p² − 2q² = ±1.",
      },
    ],
  },
  fr: {
    metaDescription:
      "Parcours l'arbre de Stern-Brocot jusqu'à n'importe quel nombre : chemin L/R, fraction continue et meilleures approximations rationnelles, de φ à π et 355/113.",
    heading: "Comment fonctionne cet explorateur",
    intro:
      "Chaque fraction positive occupe exactement une place dans un unique arbre binaire infini, l'arbre de Stern-Brocot. En partant de 1/1, tu peux atteindre n'importe laquelle par une suite de pas à gauche et à droite, chaque pas indiquant si la cible est plus petite ou plus grande que la fraction sur laquelle tu te trouves. Cette page effectue ce parcours pour le nombre de ton choix et affiche trois choses : la suite des pas L et R, la fraction continue que ces pas codent et un tableau des fractions visitées en chemin, avec l'écart de chacune à la cible.",
    sections: [
      {
        heading: "Médiantes",
        paragraphs: [
          "L'arbre se construit à partir d'une seule opération à l'allure étrange. La médiante de deux fractions a/b et c/d est (a + c)/(b + d) : on additionne les numérateurs, on additionne les dénominateurs. Ce n'est pas la moyenne, mais elle se trouve toujours strictement entre les deux. Pars de 0/1 et 1/0, qui joue le rôle de l'infini, et insère leur médiante 1/1. Insère ensuite des médiantes entre chaque paire de voisines, niveau après niveau.",
          "Deux faits rendent le résultat remarquable. Les fractions voisines a/b < c/d de la construction vérifient toujours bc − ad = 1, et c'est pourquoi chaque médiante est automatiquement irréductible. Et chaque nombre rationnel positif apparaît, exactement une fois. Achille Brocot, un horloger français, utilisait l'arbre pour trouver des rapports d'engrenages qui approchent une valeur voulue avec peu de dents, ce qui est précisément ce que fait le parcours de cette page.",
        ],
        formula: "\\frac{a}{b} < \\frac{a+c}{b+d} < \\frac{c}{d}, \\qquad bc - ad = 1",
      },
      {
        heading: "À quoi servent les commandes",
        paragraphs: [
          "Saisis n'importe quel nombre positif dans le champ de la cible, sous forme décimale ou sous forme de fraction, par exemple 22/7. La page s'ouvre sur le nombre d'or φ, arrondi à 1.61803399. Les boutons en dessous insèrent φ, π, e et √2 avec 12 décimales, et 1/3, 2/3 et 22/7 comme fractions exactes.",
          "Le curseur de profondeur, de 4 à 60 (20 par défaut), plafonne le nombre de pas. La ligne d'état indique la cible et le nombre de fractions visitées par le parcours ; la ligne du chemin montre les pas et se termine par un point. Le tableau donne chaque fraction visitée avec sa valeur décimale, son erreur et le pas effectué à partir d'elle, si bien qu'à la profondeur 60 il compte jusqu'à 61 lignes.",
        ],
      },
      {
        heading: "Comment c'est construit",
        paragraphs: [
          "Le parcours conserve une borne inférieure et une borne supérieure, au départ 0/1 et 1/0, et la fraction courante est toujours leur médiante. Si la cible est plus petite, la fraction courante devient la nouvelle borne supérieure et le pas est L ; sinon elle devient la borne inférieure et le pas est R. Il s'arrête quand la fraction est égale à la cible, quand le dénominateur dépasserait 10¹⁵ ou quand la limite de profondeur est atteinte. Pour une cible saisie comme fraction p/q, la comparaison n'utilise que des nombres entiers (elle fait le produit en croix) et elle est donc exacte ; pour un nombre décimal, égal signifie à 10⁻¹⁵ près. Les nombres ordinaires de JavaScript représentent les entiers exactement jusqu'à environ 9 · 10¹⁵, et le plafond garantit donc que chaque fraction affichée est exacte.",
          "La fraction continue vient des longueurs de plages : les pas arrivent toujours par blocs comme RRR, puis LLLLLLL, et les longueurs des blocs sont les termes. Un parcours qui commence par L correspond à un nombre inférieur à 1, on ajoute donc un 0 en tête. Quand le parcours tombe exactement sur la cible, il manque un pas au dernier bloc pour égaler le dernier terme, et la page le rajoute. Tout est recalculé à partir de la saisie au moment du rendu ; rien n'est animé.",
        ],
        code: WALK_EXCERPT,
      },
      {
        heading: "Ce que racontent les plages",
        paragraphs: [
          "φ = [1; 1, 1, 1, …] a pour chemin RLRLRL…, et les fractions qu'il visite sont des quotients de nombres de Fibonacci consécutifs : 2/1, 3/2, 5/3, 8/5, jusqu'à 17711/10946 à la profondeur 20. Comme chaque bloc est de longueur un, le parcours change de direction aussi souvent que possible et se rapproche aussi lentement que possible. En un sens précis, rendu exact par le théorème de Hurwitz, aucun nombre irrationnel n'est plus difficile à approcher par des fractions que φ.",
          "π est tout le contraire. Son chemin commence par RRR, puis sept L, quinze R, un L, puis une très longue plage de R. Cette dernière plage reflète le grand terme 292 dans π = [3; 7, 15, 1, 292, …] : la bonne fraction suivante après 355/113 est très loin, et c'est exactement pour cela que 355/113 est une approximation aussi exceptionnelle. Avec 12 décimales et 60 pas au plus, la page ne peut montrer que les 34 premiers pas de cette plage.",
          "Les fractions terminent leur parcours. Le bouton 1/3 donne le chemin LL, s'arrête au pas 3 et affiche [0; 3], et 22/7 s'arrête au pas 10 avec [3; 7]. Un nombre décimal fini est lui aussi un rationnel à part entière, mais un autre : saisis 0.333333333333, qui est légèrement inférieur à 1/3, et le parcours passe par 1/3 au pas 3, tourne et continue ; à la profondeur 60, la fraction continue s'écrit [0; 3, 57].",
        ],
      },
    ],
    experimentsHeading: "À essayer",
    experiments: [
      {
        title: "Fibonacci déguisé",
        text: "Garde le nombre d'or par défaut et lis la colonne des fractions de haut en bas : 1/1, 2/1, 3/2, 5/3, 8/5, 13/8. Chaque numérateur est la somme des deux précédents, et l'erreur diminue d'un facteur d'environ 2,6 à chaque pas.",
      },
      {
        title: "Trouve 355/113",
        text: "Choisis π et règle la profondeur sur 30, pour que le parcours aille assez loin. 22/7 apparaît au pas 10 avec une erreur d'environ 1,3 · 10⁻³, et 355/113 au pas 26 avec une erreur d'environ 2,7 · 10⁻⁷.",
      },
      {
        title: "Regarde un parcours s'arrêter",
        text: "Saisis 0.75. Le chemin est LRR et s'arrête à 3/4, et la fraction continue est [0; 1, 3]. Essaie ensuite 1.4142 avec la profondeur à 60 : après 41 pas, le parcours tombe exactement sur 7071/5000.",
      },
      {
        title: "Le rythme de √2",
        text: "Choisis √2. Le chemin se stabilise en RLLRRLLRR…, donc chaque terme après le premier vaut 2, et le tableau donne 3/2, 7/5, 17/12, 41/29 et 99/70, des solutions de p² − 2q² = ±1.",
      },
    ],
  },
  it: {
    metaDescription:
      "Percorri l'albero di Stern-Brocot fino a qualsiasi numero: cammino L/R, frazione continua e migliori approssimazioni razionali, da φ a π e 355/113.",
    heading: "Come funziona questo esploratore",
    intro:
      "Ogni frazione positiva occupa esattamente un posto in un unico albero binario infinito, l'albero di Stern-Brocot. Partendo da 1/1 puoi raggiungerne una qualsiasi con una sequenza di mosse a sinistra e a destra, dove ogni mossa dice se il bersaglio è minore o maggiore della frazione su cui ti trovi. Questa pagina compie quel cammino per un numero a tua scelta e mostra tre cose: la stringa di mosse L e R, la frazione continua che quelle mosse codificano e una tabella delle frazioni visitate lungo la strada, con la distanza di ciascuna dal bersaglio.",
    sections: [
      {
        heading: "Medianti",
        paragraphs: [
          "L'albero nasce da una sola operazione dall'aspetto strano. La mediante di due frazioni a/b e c/d è (a + c)/(b + d): si sommano i numeratori, si sommano i denominatori. Non è la media, ma sta sempre strettamente fra le due. Parti da 0/1 e 1/0, che fa la parte dell'infinito, e inserisci la loro mediante 1/1. Poi inserisci le medianti fra ogni coppia di vicine, livello dopo livello.",
          "Due fatti rendono notevole il risultato. Le frazioni vicine a/b < c/d della costruzione soddisfano sempre bc − ad = 1, e per questo ogni mediante è automaticamente ridotta ai minimi termini. E ogni numero razionale positivo compare, esattamente una volta. Achille Brocot, un orologiaio francese, usò l'albero per trovare rapporti di ingranaggi che approssimano un valore desiderato con pochi denti, che è proprio ciò che fa il cammino di questa pagina.",
        ],
        formula: "\\frac{a}{b} < \\frac{a+c}{b+d} < \\frac{c}{d}, \\qquad bc - ad = 1",
      },
      {
        heading: "Che cosa fanno i controlli",
        paragraphs: [
          "Scrivi un qualsiasi numero positivo nel campo del bersaglio, come decimale o come frazione, per esempio 22/7. La pagina si apre con la sezione aurea φ, arrotondata a 1.61803399. I pulsanti sotto inseriscono φ, π, e e √2 con 12 cifre decimali, e 1/3, 2/3 e 22/7 come frazioni esatte.",
          "Il cursore della profondità, da 4 a 60 (predefinito 20), limita il numero di mosse. La riga di stato mostra il bersaglio e quante frazioni ha visitato il cammino; la riga del cammino mostra le mosse e termina con un punto. La tabella elenca ogni frazione visitata con il suo valore decimale, il suo errore e la mossa fatta a partire da essa, quindi a profondità 60 ha fino a 61 righe.",
        ],
      },
      {
        heading: "Com'è costruito",
        paragraphs: [
          "Il cammino tiene un estremo inferiore e un estremo superiore, che partono da 0/1 e 1/0, e la frazione corrente è sempre la loro mediante. Se il bersaglio è minore, la frazione corrente diventa il nuovo estremo superiore e la mossa è L; altrimenti diventa l'estremo inferiore e la mossa è R. Si ferma quando la frazione è uguale al bersaglio, quando il denominatore supererebbe 10¹⁵ o quando si raggiunge il limite di profondità. Per un bersaglio scritto come frazione p/q il confronto usa solo numeri interi (moltiplica in croce), quindi è esatto; per un decimale, uguale significa a meno di 10⁻¹⁵. I normali numeri di JavaScript rappresentano gli interi in modo esatto fino a circa 9 · 10¹⁵, perciò il limite mantiene esatta ogni frazione mostrata.",
          "La frazione continua si ricava dalle lunghezze delle serie: le mosse arrivano sempre a blocchi come RRR, poi LLLLLLL, e le lunghezze dei blocchi sono i termini. Un cammino che inizia con L appartiene a un numero minore di 1, quindi si aggiunge uno 0 in testa. Quando il cammino arriva esattamente sul bersaglio, all'ultimo blocco manca una mossa rispetto all'ultimo termine, e la pagina la rimette. Tutto viene ricalcolato dall'input durante il rendering; niente è animato.",
        ],
        code: WALK_EXCERPT,
      },
      {
        heading: "Che cosa raccontano le serie",
        paragraphs: [
          "φ = [1; 1, 1, 1, …] ha il cammino RLRLRL…, e le frazioni che visita sono rapporti fra numeri di Fibonacci consecutivi: 2/1, 3/2, 5/3, 8/5, fino a 17711/10946 a profondità 20. Poiché ogni blocco ha lunghezza uno, il cammino cambia direzione il più spesso possibile e si avvicina il più lentamente possibile. In un senso preciso, reso esatto dal teorema di Hurwitz, nessun numero irrazionale è più difficile da approssimare con frazioni di φ.",
          "π è l'opposto. Il suo cammino inizia con RRR, poi sette L, quindici R, una L e poi una serie molto lunga di R. Quest'ultima serie riflette il grande termine 292 in π = [3; 7, 15, 1, 292, …]: la successiva frazione buona dopo 355/113 è molto lontana, ed è proprio per questo che 355/113 è un'approssimazione così straordinaria. Con 12 decimali e al massimo 60 mosse, la pagina può mostrare solo le prime 34 mosse di quella serie.",
          "Le frazioni concludono il loro cammino. Il pulsante 1/3 dà il cammino LL, si ferma al passo 3 e mostra [0; 3], e 22/7 si ferma al passo 10 con [3; 7]. Anche un decimale finito è un razionale a tutti gli effetti, ma un altro: scrivi 0.333333333333, che è leggermente minore di 1/3, e il cammino passa per 1/3 al passo 3, svolta e prosegue; a profondità 60 la frazione continua è [0; 3, 57].",
        ],
      },
    ],
    experimentsHeading: "Prova così",
    experiments: [
      {
        title: "Fibonacci travestito",
        text: "Tieni la sezione aurea predefinita e leggi la colonna delle frazioni dall'alto in basso: 1/1, 2/1, 3/2, 5/3, 8/5, 13/8. Ogni numeratore è la somma dei due precedenti, e l'errore si riduce di un fattore di circa 2,6 a ogni passo.",
      },
      {
        title: "Trova 355/113",
        text: "Scegli π e imposta la profondità a 30, così il cammino arriva abbastanza lontano. 22/7 compare al passo 10 con un errore di circa 1,3 · 10⁻³, e 355/113 al passo 26 con un errore di circa 2,7 · 10⁻⁷.",
      },
      {
        title: "Guarda un cammino finire",
        text: "Scrivi 0.75. Il cammino è LRR e si ferma a 3/4, e la frazione continua è [0; 1, 3]. Poi prova 1.4142 con la profondità a 60: dopo 41 mosse il cammino arriva esattamente su 7071/5000.",
      },
      {
        title: "Il ritmo di √2",
        text: "Scegli √2. Il cammino si assesta su RLLRRLLRR…, quindi ogni termine dopo il primo vale 2, e la tabella elenca 3/2, 7/5, 17/12, 41/29 e 99/70, soluzioni di p² − 2q² = ±1.",
      },
    ],
  },
  pt: {
    metaDescription:
      "Percorre a árvore de Stern-Brocot até qualquer número: vê o caminho L/R, a fração contínua e as melhores aproximações racionais, de φ a π e 355/113.",
    heading: "Como funciona este explorador",
    intro:
      "Cada fração positiva ocupa exatamente um lugar numa única árvore binária infinita, a árvore de Stern-Brocot. Partindo de 1/1 podes chegar a qualquer uma delas com uma sequência de passos para a esquerda e para a direita, em que cada passo diz se o alvo é menor ou maior do que a fração onde estás. Esta página faz esse percurso para um número à tua escolha e mostra três coisas: a cadeia de passos L e R, a fração contínua que esses passos codificam e uma tabela das frações visitadas pelo caminho, com a distância de cada uma ao alvo.",
    sections: [
      {
        heading: "Mediantes",
        paragraphs: [
          "A árvore constrói-se com uma única operação de aspeto estranho. A mediante de duas frações a/b e c/d é (a + c)/(b + d): somam-se os numeradores, somam-se os denominadores. Não é a média, mas fica sempre estritamente entre as duas. Começa com 0/1 e 1/0, que faz o papel de infinito, e insere a mediante 1/1. Depois insere mediantes entre cada par de vizinhas, nível após nível.",
          "Dois factos tornam o resultado notável. As frações vizinhas a/b < c/d da construção satisfazem sempre bc − ad = 1, e por isso cada mediante é automaticamente irredutível. E todo o número racional positivo aparece, exatamente uma vez. Achille Brocot, um relojoeiro francês, usou a árvore para encontrar relações de engrenagens que aproximam um valor desejado com poucos dentes, que é precisamente o que o percurso desta página faz.",
        ],
        formula: "\\frac{a}{b} < \\frac{a+c}{b+d} < \\frac{c}{d}, \\qquad bc - ad = 1",
      },
      {
        heading: "O que fazem os controlos",
        paragraphs: [
          "Escreve qualquer número positivo no campo do alvo, como decimal ou como fração, por exemplo 22/7. A página abre com a razão áurea φ, arredondada a 1.61803399. Os botões por baixo inserem φ, π, e e √2 com 12 casas decimais, e 1/3, 2/3 e 22/7 como frações exatas.",
          "O cursor da profundidade, de 4 a 60 (predefinição 20), limita o número de passos. A linha de estado mostra o alvo e quantas frações o percurso visitou; a linha do caminho mostra os passos e termina com um ponto. A tabela lista cada fração visitada com o seu valor decimal, o seu erro e o passo dado a partir dela, por isso com profundidade 60 tem até 61 linhas.",
        ],
      },
      {
        heading: "Como está construído",
        paragraphs: [
          "O percurso guarda um limite inferior e um limite superior, que começam em 0/1 e 1/0, e a fração atual é sempre a mediante dos dois. Se o alvo for menor, a fração atual passa a ser o novo limite superior e o passo é L; caso contrário passa a ser o limite inferior e o passo é R. Para quando a fração é igual ao alvo, quando o denominador ultrapassaria 10¹⁵ ou quando se atinge o limite de profundidade. Para um alvo escrito como fração p/q a comparação usa apenas números inteiros (multiplica em cruz), por isso é exata; para um decimal, igual significa a menos de 10⁻¹⁵. Os números normais de JavaScript representam os inteiros de forma exata até cerca de 9 · 10¹⁵, pelo que o limite mantém exata cada fração apresentada.",
          "A fração contínua vem dos comprimentos das sequências: os passos chegam sempre em blocos como RRR, depois LLLLLLL, e os comprimentos dos blocos são os termos. Um percurso que começa por L pertence a um número menor do que 1, por isso acrescenta-se um 0 no início. Quando o percurso cai exatamente no alvo, falta um passo ao último bloco para igualar o último termo, e a página volta a somá-lo. Tudo é recalculado a partir da entrada durante a renderização; nada é animado.",
        ],
        code: WALK_EXCERPT,
      },
      {
        heading: "O que as sequências revelam",
        paragraphs: [
          "φ = [1; 1, 1, 1, …] tem o caminho RLRLRL…, e as frações que visita são quocientes de números de Fibonacci consecutivos: 2/1, 3/2, 5/3, 8/5, até 17711/10946 com profundidade 20. Como cada bloco tem comprimento um, o percurso muda de direção tantas vezes quanto possível e aproxima-se tão devagar quanto possível. Num sentido preciso, tornado exato pelo teorema de Hurwitz, nenhum número irracional é mais difícil de aproximar por frações do que φ.",
          "π é o oposto. O seu caminho começa com RRR, depois sete L, quinze R, um L e depois uma sequência muito longa de R. Essa última sequência reflete o termo grande 292 em π = [3; 7, 15, 1, 292, …]: a próxima fração boa depois de 355/113 fica muito longe, e é exatamente por isso que 355/113 é uma aproximação tão extraordinária. Com 12 casas decimais e no máximo 60 passos, a página só consegue mostrar os primeiros 34 passos dessa sequência.",
          "As frações terminam o seu percurso. O botão 1/3 dá o caminho LL, para no passo 3 e mostra [0; 3], e 22/7 para no passo 10 com [3; 7]. Um decimal finito também é um racional de pleno direito, mas outro: escreve 0.333333333333, que é ligeiramente menor do que 1/3, e o percurso passa por 1/3 no passo 3, vira e continua; com profundidade 60 a fração contínua é [0; 3, 57].",
        ],
      },
    ],
    experimentsHeading: "Experimenta isto",
    experiments: [
      {
        title: "Fibonacci disfarçado",
        text: "Mantém a razão áurea predefinida e lê a coluna das frações de cima para baixo: 1/1, 2/1, 3/2, 5/3, 8/5, 13/8. Cada numerador é a soma dos dois anteriores, e o erro diminui por um fator de cerca de 2,6 a cada passo.",
      },
      {
        title: "Encontra 355/113",
        text: "Escolhe π e põe a profundidade em 30, para que o percurso chegue suficientemente longe. 22/7 aparece no passo 10 com um erro de cerca de 1,3 · 10⁻³, e 355/113 no passo 26 com um erro de cerca de 2,7 · 10⁻⁷.",
      },
      {
        title: "Vê um percurso terminar",
        text: "Escreve 0.75. O caminho é LRR e para em 3/4, e a fração contínua é [0; 1, 3]. Depois experimenta 1.4142 com a profundidade em 60: ao fim de 41 passos o percurso cai exatamente em 7071/5000.",
      },
      {
        title: "O ritmo de √2",
        text: "Escolhe √2. O caminho estabiliza em RLLRRLLRR…, por isso todos os termos depois do primeiro valem 2, e a tabela lista 3/2, 7/5, 17/12, 41/29 e 99/70, soluções de p² − 2q² = ±1.",
      },
    ],
  },
  sv: {
    metaDescription:
      "Vandra i Stern-Brocot-trädet till valfritt tal: se L/R-stigen, kedjebråket den kodar och de bästa rationella approximationerna, från φ till π och 355/113.",
    heading: "Så fungerar den här utforskaren",
    intro:
      "Varje positivt bråk har exakt en plats i ett enda oändligt binärt träd, Stern-Brocot-trädet. Från 1/1 kan du nå vilket som helst av dem med en följd av steg åt vänster och höger, där varje steg säger om målet är mindre eller större än bråket du står på. Den här sidan gör den vandringen för ett tal du väljer och visar tre saker: strängen av L- och R-steg, kedjebråket som stegen kodar och en tabell över bråken som besöks på vägen, tillsammans med hur långt vart och ett ligger från målet.",
    sections: [
      {
        heading: "Medianter",
        paragraphs: [
          "Trädet byggs med en enda operation som ser märklig ut. Medianten av två bråk a/b och c/d är (a + c)/(b + d): addera täljarna, addera nämnarna. Det är inte medelvärdet, men den ligger alltid strikt mellan de två. Börja med 0/1 och 1/0, som spelar rollen av oändligheten, och sätt in deras mediant 1/1. Sätt sedan in medianter mellan varje par av grannar, nivå för nivå.",
          "Två fakta gör resultatet anmärkningsvärt. Angränsande bråk a/b < c/d i konstruktionen uppfyller alltid bc − ad = 1, och därför är varje mediant automatiskt förkortad så långt det går. Och varje positivt rationellt tal förekommer, exakt en gång. Achille Brocot, en fransk urmakare, använde trädet för att hitta utväxlingar som approximerar ett önskat värde med få kuggar, och det är precis vad vandringen på den här sidan gör.",
        ],
        formula: "\\frac{a}{b} < \\frac{a+c}{b+d} < \\frac{c}{d}, \\qquad bc - ad = 1",
      },
      {
        heading: "Vad reglagen gör",
        paragraphs: [
          "Skriv vilket positivt tal som helst i målfältet, som decimaltal eller som ett bråk, till exempel 22/7. Sidan öppnas med gyllene snittet φ, avrundat till 1.61803399. Knapparna nedanför fyller i φ, π, e och √2 med 12 decimaler, och 1/3, 2/3 och 22/7 som exakta bråk.",
          "Djupreglaget, från 4 till 60 (standard 20), begränsar antalet steg. Statusraden visar målet och hur många bråk vandringen har besökt; stigraden visar stegen och slutar med en punkt. Tabellen listar varje besökt bråk med dess decimalvärde, dess fel och steget som togs därifrån, så vid djup 60 har den upp till 61 rader.",
        ],
      },
      {
        heading: "Hur den är byggd",
        paragraphs: [
          "Vandringen håller reda på en undre och en övre gräns, som börjar på 0/1 och 1/0, och det aktuella bråket är alltid deras mediant. Om målet är mindre blir det aktuella bråket den nya övre gränsen och steget är L; annars blir det den undre gränsen och steget är R. Den stannar när bråket är lika med målet, när nämnaren skulle överstiga 10¹⁵ eller när djupgränsen är nådd. För ett mål som skrivits som ett bråk p/q använder jämförelsen bara heltal (den korsmultiplicerar), så den är exakt; för ett decimaltal betyder lika att skillnaden är mindre än 10⁻¹⁵. Vanliga JavaScript-tal representerar heltal exakt upp till ungefär 9 · 10¹⁵, så gränsen håller varje utskrivet bråk exakt.",
          "Kedjebråket kommer från löplängder: stegen kommer alltid i block som RRR, sedan LLLLLLL, och blockens längder är termerna. En vandring som börjar med L hör till ett tal under 1, så en inledande nolla läggs till. När vandringen landar exakt på målet är det sista blocket ett steg kortare än den sista termen, och sidan lägger tillbaka det steget. Allt räknas om från inmatningen vid renderingen; ingenting är animerat.",
        ],
        code: WALK_EXCERPT,
      },
      {
        heading: "Vad sviterna berättar",
        paragraphs: [
          "φ = [1; 1, 1, 1, …] har stigen RLRLRL…, och bråken den besöker är kvoter av på varandra följande Fibonaccital: 2/1, 3/2, 5/3, 8/5, upp till 17\u00a0711/10\u00a0946 vid djup 20. Eftersom varje block har längden ett byter vandringen riktning så ofta som möjligt och närmar sig så långsamt som möjligt. I en precis mening, som Hurwitz sats gör exakt, är inget irrationellt tal svårare att approximera med bråk än φ.",
          "π är motsatsen. Dess stig börjar med RRR, sedan sju L, femton R, ett L och sedan en mycket lång svit av R. Den sista sviten speglar den stora termen 292 i π = [3; 7, 15, 1, 292, …]: nästa bra bråk efter 355/113 ligger långt bort, och det är precis därför 355/113 är en så enastående approximation. Med 12 decimaler och högst 60 steg kan sidan bara visa de första 34 stegen av den sviten.",
          "Bråk avslutar sin vandring. Knappen 1/3 ger stigen LL, stannar vid steg 3 och visar [0; 3], och 22/7 stannar vid steg 10 med [3; 7]. Ett ändligt decimaltal är också ett fullvärdigt rationellt tal, men ett annat: skriv 0.333333333333, som är något mindre än 1/3, så passerar vandringen 1/3 vid steg 3, vänder och fortsätter; vid djup 60 lyder kedjebråket [0; 3, 57].",
        ],
      },
    ],
    experimentsHeading: "Prova det här",
    experiments: [
      {
        title: "Fibonacci i förklädnad",
        text: "Behåll gyllene snittet som är förvalt och läs bråkkolumnen uppifrån och ned: 1/1, 2/1, 3/2, 5/3, 8/5, 13/8. Varje täljare är summan av de två föregående, och felet krymper med en faktor på ungefär 2,6 per steg.",
      },
      {
        title: "Hitta 355/113",
        text: "Välj π och ställ djupet på 30, så att vandringen kommer tillräckligt långt. 22/7 dyker upp vid steg 10 med ett fel på ungefär 1,3 · 10⁻³, och 355/113 vid steg 26 med ett fel på ungefär 2,7 · 10⁻⁷.",
      },
      {
        title: "Se en vandring ta slut",
        text: "Skriv 0.75. Stigen är LRR och stannar vid 3/4, och kedjebråket är [0; 1, 3]. Prova sedan 1.4142 med djupet på 60: efter 41 steg landar vandringen exakt på 7071/5000.",
      },
      {
        title: "Rytmen hos √2",
        text: "Välj √2. Stigen faller in i RLLRRLLRR…, så varje term efter den första är 2, och tabellen listar 3/2, 7/5, 17/12, 41/29 och 99/70, lösningar till p² − 2q² = ±1.",
      },
    ],
  },
  no: {
    metaDescription:
      "Gå gjennom Stern-Brocot-treet til et hvilket som helst tall: Se L/R-stien, kjedebrøken den koder og de beste rasjonale tilnærmingene, fra φ til π og 355/113.",
    heading: "Slik fungerer denne utforskeren",
    intro:
      "Hver positiv brøk har nøyaktig én plass i ett eneste uendelig binært tre, Stern-Brocot-treet. Fra 1/1 kan du nå hvilken som helst av dem med en rekke steg til venstre og høyre, der hvert steg sier om målet er mindre eller større enn brøken du står på. Denne siden går den veien for et tall du velger, og viser tre ting: strengen av L- og R-steg, kjedebrøken som stegene koder, og en tabell over brøkene som besøkes underveis, sammen med hvor langt hver av dem ligger fra målet.",
    sections: [
      {
        heading: "Medianter",
        paragraphs: [
          "Treet bygges med én eneste operasjon som ser merkelig ut. Medianten av to brøker a/b og c/d er (a + c)/(b + d): Legg sammen tellerne, legg sammen nevnerne. Det er ikke gjennomsnittet, men den ligger alltid strengt mellom de to. Begynn med 0/1 og 1/0, som spiller rollen som uendelig, og sett inn medianten deres, 1/1. Sett deretter inn medianter mellom hvert par av naboer, nivå for nivå.",
          "To fakta gjør resultatet bemerkelsesverdig. Nabobrøker a/b < c/d i konstruksjonen oppfyller alltid bc − ad = 1, og derfor er hver mediant automatisk forkortet så langt det går. Og hvert positivt rasjonalt tall forekommer, nøyaktig én gang. Achille Brocot, en fransk urmaker, brukte treet til å finne girforhold som tilnærmer en ønsket verdi med få tenner, og det er nettopp det vandringen på denne siden gjør.",
        ],
        formula: "\\frac{a}{b} < \\frac{a+c}{b+d} < \\frac{c}{d}, \\qquad bc - ad = 1",
      },
      {
        heading: "Hva kontrollene gjør",
        paragraphs: [
          "Skriv et hvilket som helst positivt tall i målfeltet, som desimaltall eller som en brøk, for eksempel 22/7. Siden åpner med det gylne snitt φ, avrundet til 1.61803399. Knappene under fyller inn φ, π, e og √2 med 12 desimaler, og 1/3, 2/3 og 22/7 som eksakte brøker.",
          "Glidebryteren for dybde, fra 4 til 60 (standard 20), begrenser antall steg. Statuslinjen viser målet og hvor mange brøker vandringen har besøkt; stilinjen viser stegene og slutter med et punktum. Tabellen lister hver besøkte brøk med desimalverdien, feilen og steget som ble tatt derfra, så ved dybde 60 har den opptil 61 rader.",
        ],
      },
      {
        heading: "Slik er den bygget",
        paragraphs: [
          "Vandringen holder på en nedre og en øvre grense, som starter på 0/1 og 1/0, og den gjeldende brøken er alltid medianten deres. Hvis målet er mindre, blir den gjeldende brøken den nye øvre grensen og steget er L; ellers blir den den nedre grensen og steget er R. Den stopper når brøken er lik målet, når nevneren ville overstige 10¹⁵, eller når dybdegrensen er nådd. For et mål skrevet som en brøk p/q bruker sammenligningen bare heltall (den kryssmultipliserer), så den er eksakt; for et desimaltall betyr lik at forskjellen er mindre enn 10⁻¹⁵. Vanlige JavaScript-tall representerer heltall eksakt opp til omtrent 9 · 10¹⁵, så grensen holder hver brøk som vises, eksakt.",
          "Kjedebrøken kommer fra løpelengder: Stegene kommer alltid i blokker som RRR, deretter LLLLLLL, og blokklengdene er leddene. En vandring som begynner med L, hører til et tall under 1, så en ledende 0 legges til. Når vandringen lander nøyaktig på målet, er den siste blokken ett steg kortere enn det siste leddet, og siden legger det steget til igjen. Alt regnes ut på nytt fra inndataene under rendringen; ingenting er animert.",
        ],
        code: WALK_EXCERPT,
      },
      {
        heading: "Hva løpene forteller",
        paragraphs: [
          "φ = [1; 1, 1, 1, …] har stien RLRLRL…, og brøkene den besøker, er forhold mellom påfølgende Fibonacci-tall: 2/1, 3/2, 5/3, 8/5, opp til 17711/10946 ved dybde 20. Fordi hver blokk har lengde én, skifter vandringen retning så ofte som mulig og nærmer seg så langsomt som mulig. I en presis forstand, som Hurwitz' teorem gjør eksakt, er ingen irrasjonale tall vanskeligere å tilnærme med brøker enn φ.",
          "π er det motsatte. Stien begynner med RRR, deretter sju L, femten R, én L og så et svært langt løp av R. Det siste løpet gjenspeiler det store leddet 292 i π = [3; 7, 15, 1, 292, …]: Den neste gode brøken etter 355/113 ligger langt unna, og det er nettopp derfor 355/113 er en så enestående tilnærming. Med 12 desimaler og høyst 60 steg kan siden bare vise de første 34 stegene av det løpet.",
          "Brøker avslutter vandringen sin. Knappen 1/3 gir stien LL, stopper på steg 3 og viser [0; 3], og 22/7 stopper på steg 10 med [3; 7]. Et endelig desimaltall er også et fullverdig rasjonalt tall, men et annet: Skriv 0,333333333333, som er litt mindre enn 1/3, så passerer vandringen 1/3 på steg 3, snur og fortsetter; ved dybde 60 lyder kjedebrøken [0; 3, 57].",
        ],
      },
    ],
    experimentsHeading: "Prøv dette",
    experiments: [
      {
        title: "Fibonacci i forkledning",
        text: "Behold det gylne snitt som står der fra før, og les brøkkolonnen ovenfra og ned: 1/1, 2/1, 3/2, 5/3, 8/5, 13/8. Hver teller er summen av de to foregående, og feilen krymper med en faktor på omtrent 2,6 per steg.",
      },
      {
        title: "Finn 355/113",
        text: "Velg π og sett dybden til 30, så vandringen kommer langt nok. 22/7 dukker opp på steg 10 med en feil på omtrent 1,3 · 10⁻³, og 355/113 på steg 26 med en feil på omtrent 2,7 · 10⁻⁷.",
      },
      {
        title: "Se en vandring ta slutt",
        text: "Skriv 0,75. Stien er LRR og stopper på 3/4, og kjedebrøken er [0; 1, 3]. Prøv deretter 1,4142 med dybden på 60: Etter 41 steg lander vandringen nøyaktig på 7071/5000.",
      },
      {
        title: "Rytmen til √2",
        text: "Velg √2. Stien faller til ro i RLLRRLLRR…, så hvert ledd etter det første er 2, og tabellen lister 3/2, 7/5, 17/12, 41/29 og 99/70, løsninger av p² − 2q² = ±1.",
      },
    ],
  },
};
