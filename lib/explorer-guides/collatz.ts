import type { ExplorerGuide } from "./types";

// Step counts and peaks quoted here (27: 111 steps, peak 9232 at step 77;
// 871: 178; 6171: 261; the 29-node tree at depth 10) were computed with the
// same rules as app/collatz/explorer/page.tsx; update both together.
const TRAJECTORY_EXCERPT = `function computeTrajectory(seed: number): TrajectoryStats {
  const values: number[] = [];
  let n = Math.max(1, Math.floor(seed));
  values.push(n);
  let peak = n;
  let peakStep = 0;
  let i = 0;
  while (n !== 1 && i < MAX_STEPS) {
    n = n % 2 === 0 ? n / 2 : 3 * n + 1;
    values.push(n);
    i++;
    if (n > peak) { peak = n; peakStep = i; }
  }
  return { values, steps: i, peak, peakStep };
}`;

export const COLLATZ_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Explore the Collatz conjecture: plot any hailstone sequence up to one million on a log scale, find its peak, and grow the inverse Collatz tree back from 1.",
    heading: "How this explorer works",
    intro:
      "The upper chart is the hailstone sequence of one starting number n. Each dot is one step of the Collatz rule, plotted from left to right, with the height showing the value on a logarithmic scale. The lower picture runs the same rule backwards: it starts at 1 and grows a tree of every number that reaches 1 within a few steps. Your seed's orbit lights up in cyan wherever it passes through that tree.",
    sections: [
      {
        heading: "One rule, one open question",
        paragraphs: [
          "The rule fits on a napkin. If n is even, halve it. If n is odd, triple it and add one. Repeat. Start at 6 and you get 6, 3, 10, 5, 16, 8, 4, 2, 1. Once you reach 1, the sequence would cycle through 4, 2, 1 forever, so the explorer stops there and counts the steps.",
          "The Collatz conjecture, named after Lothar Collatz who posed it in 1937, says that every positive integer eventually reaches 1. Computers have checked every starting value beyond 10^20 without finding a counterexample, yet nobody has a proof. The difficulty is that halving and tripling pull in opposite directions: on average an odd step multiplies by about 3/2 after the halving that must follow, while runs of even steps divide by powers of 2, and no one knows how to control the mix for every n.",
        ],
        formula:
          "T(n) = \\begin{cases} n/2 & n \\text{ even} \\\\ 3n + 1 & n \\text{ odd} \\end{cases}",
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "The number field accepts any seed from 1 to 1,000,000; press Enter or leave the field to apply it, and invalid entries snap back to the previous seed. The slider below it covers 1 to 10,000 for quick scrubbing. The page opens on n = 27, the classic surprise: a small number that takes 111 steps and climbs to 9232 (at step 77) before it finally falls.",
          "The four preset buttons are 27, 97, 871 and 6171. The last two are records: 871 needs 178 steps, more than any other start below 1000, and 6171 needs 261 steps, more than any other start below 10,000. The stats panel shows the step count, the peak value, the step at which the peak happens, and the path length (always one more than the step count, because the start is included).",
          "Show inverse tree toggles the lower picture, and Tree depth (3 to 10, default 8) sets how many backward steps are explored from 1.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "Nothing here animates. Both pictures are plain SVG recomputed with React's useMemo whenever the seed or the tree settings change, so the page renders the same with or without reduced motion. The trajectory function below is the whole forward computation. It is capped at 2000 steps as a safety net, but no seed in the allowed range comes close: the longest one below a million is 837,799 with 524 steps.",
          "The chart maps the step index linearly to the x axis and log10 of the value to the y axis, with grid lines at every power of ten. Without the log scale the 9232 peak of n = 27 would squash the rest of the path into a flat line along the bottom. A cyan ring marks the peak.",
          "The inverse tree is a breadth-first search from 1. Every node v always gets the predecessor 2v. It gets a second predecessor (v − 1)/3 only if v leaves remainder 4 when divided by 6, because that is exactly when (v − 1)/3 is an odd whole number; the code also skips v = 4 so the trivial 1, 4, 2, 1 loop does not reappear. The layout is radial: depth sets the distance from the centre, and each child receives a slice of its parent's angle proportional to how many leaves hang below it.",
        ],
        code: TRAJECTORY_EXCERPT,
      },
      {
        heading: "Why the tree stays thin",
        paragraphs: [
          "Backwards, the branching is sparse. Most nodes have only the doubling predecessor, so for the first few levels the tree is a straight line: 1, 2, 4, 8, 16. The first branch appears at 16, which can also be reached from 5. At the maximum depth of 10 the tree holds just 29 numbers, and the only odd ones besides 1 are 3, 5, 13, 21 and 85. The conjecture is equivalent to saying that this tree, grown without a depth limit, eventually contains every positive integer.",
        ],
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "27 against its neighbours",
        text: "Type 26, then 27, then 28. Seed 26 takes 10 steps and 28 takes 18, while 27 takes 111 and spikes to 9232. Nothing about 27 looks special until you run the rule.",
      },
      {
        title: "Powers of two fall straight down",
        text: "Enter 1024. The plot is a clean staircase of 10 halvings with the peak at step 0. Then try 1023, one less, which takes 62 steps and climbs far above its start.",
      },
      {
        title: "A path that lives inside the tree",
        text: "Set Tree depth to 9 and the seed to 13. Its orbit 13, 40, 20, 10, 5, 16, 8, 4, 2, 1 lies entirely in the tree, so every node on it glows cyan. Seed 85 does the same: it jumps to 256 and then halves all the way down.",
      },
      {
        title: "The record holder below a million",
        text: "Type 837799. It needs 524 steps and peaks at almost three billion, yet the log scale still fits the whole journey on one chart.",
      },
    ],
  },
  de: {
    metaDescription:
      "Die Collatz-Vermutung erkunden: Hagelbahnen bis eine Million auf Log-Skala zeichnen, den Gipfel finden und den inversen Collatz-Baum ab 1 wachsen lassen.",
    heading: "So funktioniert dieser Explorer",
    intro:
      "Das obere Diagramm zeigt die Hagelbahn einer einzigen Startzahl n. Jeder Punkt ist ein Schritt der Collatz-Regel, von links nach rechts aufgetragen, die Höhe zeigt den Wert auf einer logarithmischen Skala. Das untere Bild lässt dieselbe Regel rückwärts laufen: Es beginnt bei 1 und lässt einen Baum aus allen Zahlen wachsen, die in wenigen Schritten bei 1 ankommen. Wo die Bahn deiner Startzahl diesen Baum kreuzt, leuchtet sie cyan auf.",
    sections: [
      {
        heading: "Eine Regel, eine offene Frage",
        paragraphs: [
          "Die Regel passt auf einen Bierdeckel. Ist n gerade, halbiere es. Ist n ungerade, verdreifache es und addiere eins. Wiederhole das. Ab 6 ergibt sich 6, 3, 10, 5, 16, 8, 4, 2, 1. Bei 1 würde die Folge für immer durch 4, 2, 1 kreisen, deshalb hält der Explorer dort an und zählt die Schritte.",
          "Die Collatz-Vermutung, benannt nach Lothar Collatz, der sie 1937 formulierte, besagt, dass jede positive ganze Zahl irgendwann bei 1 landet. Computer haben jeden Startwert bis jenseits von 10^20 geprüft, ohne ein Gegenbeispiel zu finden, aber einen Beweis gibt es nicht. Das Problem: Halbieren und Verdreifachen ziehen in entgegengesetzte Richtungen. Ein ungerader Schritt samt der zwingend folgenden Halbierung multipliziert grob mit 3/2, Folgen gerader Schritte teilen durch Zweierpotenzen, und niemand weiß, wie man diese Mischung für jedes n in den Griff bekommt.",
        ],
        formula:
          "T(n) = \\begin{cases} n/2 & n \\text{ gerade} \\\\ 3n + 1 & n \\text{ ungerade} \\end{cases}",
      },
      {
        heading: "Was die Regler bewirken",
        paragraphs: [
          "Das Zahlenfeld nimmt jede Startzahl von 1 bis 1.000.000 an. Mit Enter oder beim Verlassen des Felds wird sie übernommen, ungültige Eingaben springen auf den vorherigen Wert zurück. Der Regler darunter deckt 1 bis 10.000 zum schnellen Durchscrollen ab. Die Seite startet mit n = 27, der klassischen Überraschung: eine kleine Zahl, die 111 Schritte braucht und bis 9232 klettert (bei Schritt 77), bevor sie endlich fällt.",
          "Die vier Schnellwahl-Knöpfe sind 27, 97, 871 und 6171. Die letzten beiden sind Rekorde: 871 braucht 178 Schritte, mehr als jede andere Startzahl unter 1000, und 6171 braucht 261 Schritte, mehr als jede andere unter 10.000. Das Statistikfeld zeigt Schrittzahl, Gipfelwert, den Schritt, an dem der Gipfel erreicht wird, und die Pfadlänge (immer eins mehr als die Schrittzahl, weil der Start mitzählt).",
          "«Inversen Baum zeigen» blendet das untere Bild ein und aus, und die Baumtiefe (3 bis 10, Standard 8) legt fest, wie viele Schritte rückwärts ab 1 erkundet werden.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Hier bewegt sich nichts. Beide Bilder sind schlichtes SVG, das React per useMemo neu berechnet, sobald sich Startzahl oder Baumeinstellungen ändern. Mit oder ohne reduzierte Bewegung sieht die Seite also gleich aus. Die Funktion unten ist die gesamte Vorwärtsrechnung. Sie ist zur Sicherheit bei 2000 Schritten gedeckelt, aber keine erlaubte Startzahl kommt auch nur in die Nähe: Die längste Bahn unter einer Million hat 837.799 mit 524 Schritten.",
          "Das Diagramm bildet den Schrittindex linear auf die x-Achse ab und den Zehnerlogarithmus des Werts auf die y-Achse, mit Gitterlinien bei jeder Zehnerpotenz. Ohne Log-Skala würde der Gipfel 9232 von n = 27 den Rest der Bahn zu einer flachen Linie am unteren Rand zerquetschen. Ein cyanfarbener Ring markiert den Gipfel.",
          "Der inverse Baum entsteht durch eine Breitensuche ab 1. Jeder Knoten v bekommt immer den Vorgänger 2v. Einen zweiten Vorgänger (v − 1)/3 bekommt er nur, wenn v bei Division durch 6 den Rest 4 lässt, denn genau dann ist (v − 1)/3 eine ungerade ganze Zahl. Der Code überspringt außerdem v = 4, damit die triviale Schleife 1, 4, 2, 1 nicht wieder auftaucht. Das Layout ist radial: Die Tiefe bestimmt den Abstand zur Mitte, und jedes Kind erhält einen Winkelanteil seines Elternknotens, proportional zur Zahl der Blätter darunter.",
        ],
        code: TRAJECTORY_EXCERPT,
      },
      {
        heading: "Warum der Baum so dünn bleibt",
        paragraphs: [
          "Rückwärts verzweigt sich wenig. Die meisten Knoten haben nur den Verdopplungs-Vorgänger, deshalb ist der Baum auf den ersten Ebenen eine gerade Linie: 1, 2, 4, 8, 16. Die erste Verzweigung kommt bei 16, das man auch von 5 aus erreicht. Bei der maximalen Tiefe 10 enthält der Baum gerade einmal 29 Zahlen, und die einzigen ungeraden außer 1 sind 3, 5, 13, 21 und 85. Die Vermutung ist gleichbedeutend damit, dass dieser Baum, ohne Tiefengrenze weitergezüchtet, irgendwann jede positive ganze Zahl enthält.",
        ],
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "27 gegen seine Nachbarn",
        text: "Gib 26 ein, dann 27, dann 28. Die 26 braucht 10 Schritte und die 28 braucht 18, die 27 dagegen 111 und schießt bis 9232 hoch. Man sieht der 27 nichts an, bis man die Regel laufen lässt.",
      },
      {
        title: "Zweierpotenzen fallen gerade nach unten",
        text: "Gib 1024 ein. Das Diagramm ist eine saubere Treppe aus 10 Halbierungen, der Gipfel liegt bei Schritt 0. Probier dann 1023, eins weniger: 62 Schritte, und die Bahn klettert weit über ihren Start.",
      },
      {
        title: "Eine Bahn, die ganz im Baum liegt",
        text: "Stell die Baumtiefe auf 9 und die Startzahl auf 13. Die Bahn 13, 40, 20, 10, 5, 16, 8, 4, 2, 1 liegt vollständig im Baum, jeder ihrer Knoten leuchtet cyan. Mit 85 klappt das auch: Die Zahl springt auf 256 und halbiert sich dann bis ganz nach unten.",
      },
      {
        title: "Der Rekordhalter unter einer Million",
        text: "Gib 837799 ein. Die Bahn braucht 524 Schritte und erreicht fast drei Milliarden, trotzdem passt die ganze Reise dank Log-Skala in ein Diagramm.",
      },
    ],
  },
  es: {
    metaDescription:
      "Explora la conjetura de Collatz: traza cualquier secuencia de granizo hasta un millón en escala logarítmica, halla su pico y cultiva el árbol inverso desde 1.",
    heading: "Cómo funciona este explorador",
    intro:
      "El gráfico superior es la secuencia de granizo de un único número inicial n. Cada punto es un paso de la regla de Collatz, dibujado de izquierda a derecha, y la altura indica el valor en escala logarítmica. La imagen inferior aplica la misma regla hacia atrás: parte de 1 y hace crecer un árbol con todos los números que llegan a 1 en pocos pasos. La órbita de tu semilla se ilumina en cian allí donde atraviesa ese árbol.",
    sections: [
      {
        heading: "Una regla, una pregunta abierta",
        paragraphs: [
          "La regla cabe en una servilleta. Si n es par, divídelo entre dos. Si n es impar, multiplícalo por tres y súmale uno. Repite. Empieza en 6 y obtienes 6, 3, 10, 5, 16, 8, 4, 2, 1. Una vez en 1, la secuencia daría vueltas por 4, 2, 1 para siempre, así que el explorador se detiene ahí y cuenta los pasos.",
          "La conjetura de Collatz, que lleva el nombre de Lothar Collatz, quien la planteó en 1937, afirma que todo entero positivo acaba llegando a 1. Los ordenadores han comprobado todos los valores iniciales hasta más allá de 10^20 sin encontrar un contraejemplo, pero nadie tiene una demostración. La dificultad está en que dividir entre dos y triplicar tiran en sentidos opuestos: en promedio, un paso impar multiplica por unos 3/2 una vez hecha la división que le sigue obligatoriamente, mientras que las rachas de pasos pares dividen entre potencias de 2, y nadie sabe cómo controlar esa mezcla para todo n.",
        ],
        formula:
          "T(n) = \\begin{cases} n/2 & n \\text{ par} \\\\ 3n + 1 & n \\text{ impar} \\end{cases}",
      },
      {
        heading: "Qué hacen los controles",
        paragraphs: [
          "El campo numérico acepta cualquier semilla de 1 a 1 000 000; pulsa Intro o sal del campo para aplicarla, y las entradas no válidas vuelven a la semilla anterior. El deslizador de debajo cubre de 1 a 10 000 para recorrer valores con rapidez. La página se abre con n = 27, la sorpresa clásica: un número pequeño que necesita 111 pasos y sube hasta 9232 (en el paso 77) antes de caer por fin.",
          "Los cuatro botones de preajuste son 27, 97, 871 y 6171. Los dos últimos son récords: 871 necesita 178 pasos, más que cualquier otro inicio por debajo de 1000, y 6171 necesita 261 pasos, más que cualquier otro inicio por debajo de 10 000. El panel de estadísticas muestra el número de pasos, el valor pico, el paso en el que se alcanza el pico y la longitud del camino (siempre uno más que el número de pasos, porque el inicio también cuenta).",
          "«Mostrar árbol inverso» muestra u oculta la imagen inferior, y «Profundidad del árbol» (de 3 a 10, por defecto 8) fija cuántos pasos hacia atrás se exploran desde 1.",
        ],
      },
      {
        heading: "Cómo está construido",
        paragraphs: [
          "Aquí no hay nada animado. Las dos imágenes son SVG puro que se recalcula con useMemo de React cada vez que cambian la semilla o los ajustes del árbol, de modo que la página se ve igual con o sin movimiento reducido. La función de trayectoria de abajo es todo el cálculo hacia delante. Tiene un tope de 2000 pasos como red de seguridad, pero ninguna semilla del rango permitido se acerca siquiera: la más larga por debajo de un millón es 837 799, con 524 pasos.",
          "El gráfico asigna linealmente el índice del paso al eje x y el log10 del valor al eje y, con líneas de cuadrícula en cada potencia de diez. Sin la escala logarítmica, el pico 9232 de n = 27 aplastaría el resto del camino en una línea plana pegada al borde inferior. Un anillo cian marca el pico.",
          "El árbol inverso es una búsqueda en anchura desde 1. Cada nodo v recibe siempre el predecesor 2v. Recibe un segundo predecesor (v − 1)/3 solo si v deja resto 4 al dividirlo entre 6, porque justo entonces (v − 1)/3 es un entero impar; el código además se salta v = 4 para que no reaparezca el bucle trivial 1, 4, 2, 1. La disposición es radial: la profundidad fija la distancia al centro, y cada hijo recibe una porción del ángulo de su padre proporcional al número de hojas que cuelgan de él.",
        ],
        code: TRAJECTORY_EXCERPT,
      },
      {
        heading: "Por qué el árbol se mantiene delgado",
        paragraphs: [
          "Hacia atrás, la ramificación es escasa. La mayoría de los nodos solo tiene el predecesor que se obtiene al duplicar, así que en los primeros niveles el árbol es una línea recta: 1, 2, 4, 8, 16. La primera rama aparece en 16, al que también se llega desde 5. Con la profundidad máxima de 10, el árbol contiene solo 29 números, y los únicos impares además de 1 son 3, 5, 13, 21 y 85. La conjetura equivale a decir que este árbol, si crece sin límite de profundidad, acaba conteniendo todos los enteros positivos.",
        ],
      },
    ],
    experimentsHeading: "Prueba esto",
    experiments: [
      {
        title: "27 frente a sus vecinos",
        text: "Escribe 26, luego 27, luego 28. La semilla 26 necesita 10 pasos y la 28 necesita 18, mientras que la 27 necesita 111 y se dispara hasta 9232. Nada en el 27 parece especial hasta que aplicas la regla.",
      },
      {
        title: "Las potencias de dos caen en picado",
        text: "Introduce 1024. El gráfico es una escalera limpia de 10 divisiones entre dos, con el pico en el paso 0. Prueba después con 1023, uno menos, que necesita 62 pasos y sube muy por encima de su inicio.",
      },
      {
        title: "Un camino que vive dentro del árbol",
        text: "Pon «Profundidad del árbol» en 9 y la semilla en 13. Su órbita 13, 40, 20, 10, 5, 16, 8, 4, 2, 1 está entera dentro del árbol, así que todos sus nodos brillan en cian. La semilla 85 hace lo mismo: salta a 256 y luego se va dividiendo entre dos hasta abajo.",
      },
      {
        title: "El récord por debajo de un millón",
        text: "Escribe 837799. Necesita 524 pasos y alcanza casi tres mil millones, y aun así la escala logarítmica mete todo el viaje en un solo gráfico.",
      },
    ],
  },
  fr: {
    metaDescription:
      "Explore la conjecture de Syracuse (Collatz) : trace toute suite jusqu'à un million en échelle logarithmique, repère son sommet et fais pousser l'arbre inverse.",
    heading: "Comment fonctionne cet explorateur",
    intro:
      "Le graphique du haut montre la suite de Syracuse (le vol) d'un seul nombre de départ n. Chaque point est une étape de la règle de Collatz, tracée de gauche à droite, et la hauteur indique la valeur sur une échelle logarithmique. L'image du bas applique la même règle à rebours : elle part de 1 et fait pousser un arbre de tous les nombres qui atteignent 1 en quelques étapes. L'orbite de ta graine s'allume en cyan partout où elle traverse cet arbre.",
    sections: [
      {
        heading: "Une règle, une question ouverte",
        paragraphs: [
          "La règle tient sur un coin de nappe. Si n est pair, divise-le par deux. Si n est impair, multiplie-le par trois et ajoute un. Recommence. En partant de 6, on obtient 6, 3, 10, 5, 16, 8, 4, 2, 1. Une fois à 1, la suite tournerait sans fin sur 4, 2, 1 : l'explorateur s'arrête donc là et compte les étapes.",
          "La conjecture de Collatz, du nom de Lothar Collatz qui l'a énoncée en 1937 et connue en français sous le nom de conjecture de Syracuse, affirme que tout entier strictement positif finit par atteindre 1. Les ordinateurs ont vérifié toutes les valeurs de départ jusqu'au-delà de 10^20 sans trouver de contre-exemple, et pourtant personne n'a de démonstration. La difficulté vient de ce que diviser par deux et tripler tirent dans des sens opposés : en moyenne, une étape impaire multiplie par environ 3/2 une fois faite la division qui la suit forcément, alors que les séries d'étapes paires divisent par des puissances de 2, et personne ne sait maîtriser ce mélange pour tout n.",
        ],
        formula:
          "T(n) = \\begin{cases} n/2 & n \\text{ pair} \\\\ 3n + 1 & n \\text{ impair} \\end{cases}",
      },
      {
        heading: "À quoi servent les commandes",
        paragraphs: [
          "Le champ numérique accepte n'importe quelle graine de 1 à 1\u00a0000\u00a0000 ; appuie sur Entrée ou quitte le champ pour la valider, et une saisie invalide revient à la graine précédente. Le curseur placé dessous couvre 1 à 10\u00a0000 pour balayer rapidement les valeurs. La page s'ouvre sur n = 27, la surprise classique : un petit nombre qui demande 111 étapes et grimpe jusqu'à 9\u00a0232 (à l'étape 77) avant de retomber enfin.",
          "Les quatre boutons de raccourci sont 27, 97, 871 et 6171. Les deux derniers sont des records : 871 demande 178 étapes, plus que tout autre départ inférieur à 1\u00a0000, et 6171 demande 261 étapes, plus que tout autre départ inférieur à 10\u00a0000. Le panneau de statistiques affiche le nombre d'étapes, la valeur du sommet, l'étape à laquelle le sommet est atteint et la longueur du chemin (toujours une de plus que le nombre d'étapes, puisque le départ est compté).",
          "« Afficher l'arbre inverse » affiche ou masque l'image du bas, et « Profondeur de l'arbre » (de 3 à 10, 8 par défaut) fixe le nombre d'étapes explorées à rebours depuis 1.",
        ],
      },
      {
        heading: "Comment c'est construit",
        paragraphs: [
          "Rien ne s'anime ici. Les deux images sont du SVG tout simple, recalculé avec le useMemo de React dès que la graine ou les réglages de l'arbre changent : la page a donc le même rendu avec ou sans réduction des animations. La fonction de trajectoire ci-dessous constitue tout le calcul dans le sens direct. Elle est plafonnée à 2\u00a0000 étapes par sécurité, mais aucune graine de la plage autorisée ne s'en approche : la plus longue en dessous d'un million est 837\u00a0799, avec 524 étapes.",
          "Le graphique associe linéairement l'indice de l'étape à l'axe des x et le log10 de la valeur à l'axe des y, avec des lignes de grille à chaque puissance de dix. Sans l'échelle logarithmique, le sommet 9\u00a0232 de n = 27 écraserait le reste du chemin en une ligne plate au ras du bord inférieur. Un anneau cyan marque le sommet.",
          "L'arbre inverse est un parcours en largeur à partir de 1. Chaque nœud v reçoit toujours le prédécesseur 2v. Il ne reçoit un second prédécesseur (v − 1)/3 que si v a pour reste 4 dans la division par 6, car c'est exactement dans ce cas que (v − 1)/3 est un entier impair ; le code écarte aussi v = 4 pour que la boucle triviale 1, 4, 2, 1 ne réapparaisse pas. La disposition est radiale : la profondeur fixe la distance au centre, et chaque enfant reçoit une part de l'angle de son parent proportionnelle au nombre de feuilles qui pendent sous lui.",
        ],
        code: TRAJECTORY_EXCERPT,
      },
      {
        heading: "Pourquoi l'arbre reste maigre",
        paragraphs: [
          "À rebours, les embranchements sont rares. La plupart des nœuds n'ont que le prédécesseur obtenu par doublement, si bien que sur les premiers niveaux l'arbre est une ligne droite : 1, 2, 4, 8, 16. Le premier embranchement apparaît en 16, que l'on atteint aussi depuis 5. À la profondeur maximale de 10, l'arbre ne contient que 29 nombres, et les seuls impairs en dehors de 1 sont 3, 5, 13, 21 et 85. La conjecture revient à dire que cet arbre, si on le laisse pousser sans limite de profondeur, finit par contenir tous les entiers strictement positifs.",
        ],
      },
    ],
    experimentsHeading: "À essayer",
    experiments: [
      {
        title: "27 face à ses voisins",
        text: "Tape 26, puis 27, puis 28. La graine 26 demande 10 étapes et la 28 en demande 18, alors que la 27 en demande 111 et bondit jusqu'à 9\u00a0232. Rien ne distingue 27 tant qu'on n'a pas appliqué la règle.",
      },
      {
        title: "Les puissances de deux tombent tout droit",
        text: "Saisis 1024. Le tracé est un escalier net de 10 divisions par deux, avec le sommet à l'étape 0. Essaie ensuite 1023, un de moins, qui demande 62 étapes et grimpe bien au-dessus de son départ.",
      },
      {
        title: "Un chemin qui vit dans l'arbre",
        text: "Règle « Profondeur de l'arbre » sur 9 et la graine sur 13. Son orbite 13, 40, 20, 10, 5, 16, 8, 4, 2, 1 est entièrement contenue dans l'arbre, donc chacun de ses nœuds s'allume en cyan. La graine 85 fait pareil : elle saute à 256 puis se divise par deux jusqu'en bas.",
      },
      {
        title: "Le détenteur du record sous le million",
        text: "Tape 837799. Il lui faut 524 étapes et son sommet frôle les trois milliards, et pourtant l'échelle logarithmique fait tenir tout le voyage sur un seul graphique.",
      },
    ],
  },
  it: {
    metaDescription:
      "Esplora la congettura di Collatz: traccia qualsiasi successione fino a un milione in scala logaritmica, trova il picco e fai crescere l'albero inverso da 1.",
    heading: "Come funziona questo esploratore",
    intro:
      "Il grafico in alto è la successione di grandine di un solo numero di partenza n. Ogni punto è un passo della regola di Collatz, tracciato da sinistra a destra, e l'altezza indica il valore su scala logaritmica. L'immagine in basso applica la stessa regola all'indietro: parte da 1 e fa crescere un albero con tutti i numeri che raggiungono 1 in pochi passi. L'orbita del tuo seme si accende di ciano ovunque attraversi quell'albero.",
    sections: [
      {
        heading: "Una regola, una domanda aperta",
        paragraphs: [
          "La regola sta su un tovagliolo. Se n è pari, dividilo per due. Se n è dispari, moltiplicalo per tre e aggiungi uno. Ripeti. Parti da 6 e ottieni 6, 3, 10, 5, 16, 8, 4, 2, 1. Una volta arrivata a 1, la successione girerebbe per sempre su 4, 2, 1, quindi l'esploratore si ferma lì e conta i passi.",
          "La congettura di Collatz, che prende il nome da Lothar Collatz, il quale la formulò nel 1937, afferma che ogni intero positivo prima o poi raggiunge 1. I computer hanno verificato tutti i valori di partenza fin oltre 10^20 senza trovare un controesempio, eppure nessuno ha una dimostrazione. La difficoltà è che dimezzare e triplicare tirano in direzioni opposte: in media un passo dispari moltiplica per circa 3/2 dopo il dimezzamento che deve seguirlo, mentre le serie di passi pari dividono per potenze di 2, e nessuno sa come tenere sotto controllo questa miscela per ogni n.",
        ],
        formula:
          "T(n) = \\begin{cases} n/2 & n \\text{ pari} \\\\ 3n + 1 & n \\text{ dispari} \\end{cases}",
      },
      {
        heading: "Che cosa fanno i controlli",
        paragraphs: [
          "Il campo numerico accetta qualsiasi seme da 1 a 1.000.000; premi Invio o esci dal campo per applicarlo, e i valori non validi tornano al seme precedente. Il cursore sottostante copre da 1 a 10.000 per scorrere in fretta. La pagina si apre su n = 27, la sorpresa classica: un numero piccolo che impiega 111 passi e sale fino a 9232 (al passo 77) prima di cadere finalmente.",
          "I quattro pulsanti dei preset sono 27, 97, 871 e 6171. Gli ultimi due sono record: 871 richiede 178 passi, più di qualsiasi altra partenza sotto 1000, e 6171 richiede 261 passi, più di qualsiasi altra partenza sotto 10.000. Il pannello delle statistiche mostra il numero di passi, il valore di picco, il passo in cui il picco viene raggiunto e la lunghezza del percorso (sempre uno in più del numero di passi, perché si conta anche la partenza).",
          "«Mostra l'albero inverso» mostra o nasconde l'immagine in basso, e «Profondità dell'albero» (da 3 a 10, predefinita 8) stabilisce quanti passi all'indietro vengono esplorati a partire da 1.",
        ],
      },
      {
        heading: "Com'è costruito",
        paragraphs: [
          "Qui non c'è nulla di animato. Entrambe le immagini sono semplice SVG, ricalcolato con useMemo di React ogni volta che cambiano il seme o le impostazioni dell'albero, quindi la pagina ha lo stesso aspetto con o senza movimento ridotto. La funzione di traiettoria qui sotto è l'intero calcolo in avanti. Ha un tetto di 2000 passi come rete di sicurezza, ma nessun seme dell'intervallo ammesso ci si avvicina: il più lungo sotto il milione è 837.799, con 524 passi.",
          "Il grafico associa linearmente l'indice del passo all'asse x e il log10 del valore all'asse y, con linee di griglia a ogni potenza di dieci. Senza la scala logaritmica, il picco 9232 di n = 27 schiaccerebbe il resto del percorso in una linea piatta lungo il bordo inferiore. Un anello ciano segna il picco.",
          "L'albero inverso è una visita in ampiezza a partire da 1. Ogni nodo v riceve sempre il predecessore 2v. Riceve un secondo predecessore (v − 1)/3 solo se v dà resto 4 nella divisione per 6, perché è esattamente allora che (v − 1)/3 è un intero dispari; il codice salta inoltre v = 4, così il ciclo banale 1, 4, 2, 1 non ricompare. La disposizione è radiale: la profondità fissa la distanza dal centro, e ogni figlio riceve una fetta dell'angolo del genitore proporzionale al numero di foglie che pendono sotto di esso.",
        ],
        code: TRAJECTORY_EXCERPT,
      },
      {
        heading: "Perché l'albero resta sottile",
        paragraphs: [
          "All'indietro le diramazioni sono rade. La maggior parte dei nodi ha solo il predecessore ottenuto raddoppiando, perciò nei primi livelli l'albero è una linea retta: 1, 2, 4, 8, 16. La prima diramazione compare a 16, che si raggiunge anche da 5. Alla profondità massima di 10 l'albero contiene appena 29 numeri, e gli unici dispari oltre a 1 sono 3, 5, 13, 21 e 85. La congettura equivale a dire che questo albero, fatto crescere senza limite di profondità, prima o poi contiene ogni intero positivo.",
        ],
      },
    ],
    experimentsHeading: "Prova così",
    experiments: [
      {
        title: "27 contro i suoi vicini",
        text: "Scrivi 26, poi 27, poi 28. Il seme 26 impiega 10 passi e il 28 ne impiega 18, mentre il 27 ne impiega 111 e schizza fino a 9232. Nulla nel 27 sembra speciale finché non applichi la regola.",
      },
      {
        title: "Le potenze di due cadono a piombo",
        text: "Inserisci 1024. Il grafico è una scala pulita di 10 dimezzamenti con il picco al passo 0. Poi prova 1023, uno in meno, che impiega 62 passi e sale molto al di sopra della partenza.",
      },
      {
        title: "Un percorso che vive dentro l'albero",
        text: "Imposta «Profondità dell'albero» su 9 e il seme su 13. La sua orbita 13, 40, 20, 10, 5, 16, 8, 4, 2, 1 sta tutta dentro l'albero, quindi ogni suo nodo si illumina di ciano. Il seme 85 fa lo stesso: salta a 256 e poi si dimezza fino in fondo.",
      },
      {
        title: "Il primatista sotto il milione",
        text: "Scrivi 837799. Gli servono 524 passi e tocca un picco di quasi tre miliardi, eppure la scala logaritmica fa stare tutto il viaggio in un solo grafico.",
      },
    ],
  },
  pt: {
    metaDescription:
      "Explora a conjetura de Collatz: traça qualquer sequência de granizo até um milhão em escala logarítmica, encontra o pico e faz crescer a árvore inversa desde 1.",
    heading: "Como funciona este explorador",
    intro:
      "O gráfico de cima é a sequência de granizo de um único número inicial n. Cada ponto é um passo da regra de Collatz, traçado da esquerda para a direita, e a altura mostra o valor numa escala logarítmica. A imagem de baixo aplica a mesma regra para trás: começa em 1 e faz crescer uma árvore com todos os números que chegam a 1 em poucos passos. A órbita da tua semente acende-se a ciano onde quer que atravesse essa árvore.",
    sections: [
      {
        heading: "Uma regra, uma pergunta em aberto",
        paragraphs: [
          "A regra cabe num guardanapo. Se n for par, divide-o por dois. Se n for ímpar, multiplica-o por três e soma um. Repete. Começa em 6 e obténs 6, 3, 10, 5, 16, 8, 4, 2, 1. Chegada a 1, a sequência ficaria a rodar por 4, 2, 1 para sempre, por isso o explorador para aí e conta os passos.",
          "A conjetura de Collatz, assim chamada por causa de Lothar Collatz, que a formulou em 1937, diz que todo o inteiro positivo acaba por chegar a 1. Os computadores verificaram todos os valores iniciais até para lá de 10^20 sem encontrar um contraexemplo, mas ninguém tem uma demonstração. A dificuldade é que dividir por dois e triplicar puxam em sentidos opostos: em média, um passo ímpar multiplica por cerca de 3/2 depois da divisão que tem de se lhe seguir, enquanto as sequências de passos pares dividem por potências de 2, e ninguém sabe controlar essa mistura para todo o n.",
        ],
        formula:
          "T(n) = \\begin{cases} n/2 & n \\text{ par} \\\\ 3n + 1 & n \\text{ ímpar} \\end{cases}",
      },
      {
        heading: "O que fazem os controlos",
        paragraphs: [
          "O campo numérico aceita qualquer semente de 1 a 1\u00a0000\u00a0000; carrega em Enter ou sai do campo para a aplicar, e as entradas inválidas voltam à semente anterior. O cursor por baixo cobre de 1 a 10\u00a0000 para percorrer valores depressa. A página abre em n = 27, a surpresa clássica: um número pequeno que precisa de 111 passos e sobe até 9232 (no passo 77) antes de finalmente cair.",
          "Os quatro botões de predefinição são 27, 97, 871 e 6171. Os dois últimos são recordes: 871 precisa de 178 passos, mais do que qualquer outro início abaixo de 1000, e 6171 precisa de 261 passos, mais do que qualquer outro início abaixo de 10\u00a0000. O painel de estatísticas mostra o número de passos, o valor de pico, o passo em que o pico acontece e o comprimento do caminho (sempre um a mais do que o número de passos, porque o início também conta).",
          "«Mostrar árvore inversa» mostra ou esconde a imagem de baixo, e «Profundidade da árvore» (de 3 a 10, 8 por omissão) define quantos passos para trás são explorados a partir de 1.",
        ],
      },
      {
        heading: "Como está construído",
        paragraphs: [
          "Aqui nada é animado. As duas imagens são SVG simples, recalculado com o useMemo do React sempre que a semente ou as definições da árvore mudam, pelo que a página fica igual com ou sem movimento reduzido. A função de trajetória abaixo é todo o cálculo no sentido direto. Está limitada a 2000 passos como rede de segurança, mas nenhuma semente do intervalo permitido se aproxima disso: a mais longa abaixo de um milhão é 837\u00a0799, com 524 passos.",
          "O gráfico faz corresponder linearmente o índice do passo ao eixo x e o log10 do valor ao eixo y, com linhas de grelha em cada potência de dez. Sem a escala logarítmica, o pico 9232 de n = 27 esmagaria o resto do caminho numa linha plana junto ao fundo. Um anel ciano assinala o pico.",
          "A árvore inversa é uma busca em largura a partir de 1. Cada nó v recebe sempre o predecessor 2v. Só recebe um segundo predecessor (v − 1)/3 se v der resto 4 na divisão por 6, porque é exatamente nesse caso que (v − 1)/3 é um inteiro ímpar; o código salta também v = 4, para que o ciclo trivial 1, 4, 2, 1 não reapareça. A disposição é radial: a profundidade define a distância ao centro, e cada filho recebe uma fatia do ângulo do pai proporcional ao número de folhas que dele pendem.",
        ],
        code: TRAJECTORY_EXCERPT,
      },
      {
        heading: "Porque é que a árvore se mantém fina",
        paragraphs: [
          "Para trás, a ramificação é esparsa. A maior parte dos nós só tem o predecessor obtido por duplicação, por isso nos primeiros níveis a árvore é uma linha reta: 1, 2, 4, 8, 16. O primeiro ramo aparece em 16, a que também se chega a partir de 5. Na profundidade máxima de 10, a árvore tem apenas 29 números, e os únicos ímpares além de 1 são 3, 5, 13, 21 e 85. A conjetura equivale a dizer que esta árvore, crescendo sem limite de profundidade, acaba por conter todos os inteiros positivos.",
        ],
      },
    ],
    experimentsHeading: "Experimenta isto",
    experiments: [
      {
        title: "27 contra os vizinhos",
        text: "Escreve 26, depois 27, depois 28. A semente 26 precisa de 10 passos e a 28 precisa de 18, enquanto a 27 precisa de 111 e dispara até 9232. Nada no 27 parece especial até aplicares a regra.",
      },
      {
        title: "As potências de dois caem a direito",
        text: "Introduz 1024. O gráfico é uma escada limpa de 10 divisões por dois, com o pico no passo 0. Experimenta depois 1023, um a menos, que precisa de 62 passos e sobe muito acima do início.",
      },
      {
        title: "Um caminho que vive dentro da árvore",
        text: "Põe «Profundidade da árvore» em 9 e a semente em 13. A sua órbita 13, 40, 20, 10, 5, 16, 8, 4, 2, 1 fica toda dentro da árvore, por isso todos os seus nós brilham a ciano. A semente 85 faz o mesmo: salta para 256 e depois vai-se dividindo por dois até ao fim.",
      },
      {
        title: "O recordista abaixo de um milhão",
        text: "Escreve 837799. Precisa de 524 passos e atinge um pico de quase três mil milhões, e mesmo assim a escala logarítmica faz caber a viagem toda num só gráfico.",
      },
    ],
  },
  sv: {
    metaDescription:
      "Utforska Collatz förmodan: rita vilken hagelstensföljd som helst upp till en miljon i logaritmisk skala, hitta toppen och låt det omvända trädet växa från 1.",
    heading: "Så fungerar den här utforskaren",
    intro:
      "Det övre diagrammet är hagelstensföljden för ett enda starttal n. Varje punkt är ett steg i Collatz regel, ritat från vänster till höger, och höjden visar värdet på en logaritmisk skala. Den nedre bilden kör samma regel baklänges: den börjar i 1 och låter ett träd växa fram av alla tal som når 1 inom några få steg. Ditt frös bana lyser i cyan överallt där den går genom trädet.",
    sections: [
      {
        heading: "En regel, en öppen fråga",
        paragraphs: [
          "Regeln får plats på en servett. Om n är jämnt, halvera det. Om n är udda, tredubbla det och lägg till ett. Upprepa. Börja på 6 så får du 6, 3, 10, 5, 16, 8, 4, 2, 1. Väl framme vid 1 skulle följden snurra runt 4, 2, 1 för alltid, så utforskaren stannar där och räknar stegen.",
          "Collatz förmodan, uppkallad efter Lothar Collatz som formulerade den 1937, säger att varje positivt heltal till slut når 1. Datorer har kontrollerat alla startvärden till bortom 10^20 utan att hitta ett motexempel, men ingen har ett bevis. Svårigheten är att halvering och tredubbling drar åt motsatta håll: i genomsnitt multiplicerar ett udda steg med ungefär 3/2 efter den halvering som måste följa, medan serier av jämna steg dividerar med potenser av 2, och ingen vet hur man får kontroll över blandningen för varje n.",
        ],
        formula:
          "T(n) = \\begin{cases} n/2 & n \\text{ jämnt} \\\\ 3n + 1 & n \\text{ udda} \\end{cases}",
      },
      {
        heading: "Vad reglagen gör",
        paragraphs: [
          "Talfältet tar emot vilket frö som helst från 1 till 1\u00a0000\u00a0000. Tryck på Enter eller lämna fältet för att använda det, och ogiltiga inmatningar hoppar tillbaka till det förra fröet. Skjutreglaget under täcker 1 till 10\u00a0000 för snabb bläddring. Sidan öppnas med n = 27, den klassiska överraskningen: ett litet tal som behöver 111 steg och klättrar till 9232 (vid steg 77) innan det äntligen faller.",
          "De fyra förvalsknapparna är 27, 97, 871 och 6171. De två sista är rekord: 871 behöver 178 steg, fler än något annat starttal under 1000, och 6171 behöver 261 steg, fler än något annat starttal under 10\u00a0000. Statistikpanelen visar antalet steg, toppvärdet, steget där toppen nås och banlängden (alltid ett mer än antalet steg, eftersom starten räknas med).",
          "”Visa omvänt träd” visar eller döljer den nedre bilden, och ”Träddjup” (3 till 10, standard 8) bestämmer hur många steg bakåt som utforskas från 1.",
        ],
      },
      {
        heading: "Hur den är byggd",
        paragraphs: [
          "Här finns ingenting som animeras. Båda bilderna är ren SVG som räknas om med Reacts useMemo varje gång fröet eller trädinställningarna ändras, så sidan ser likadan ut med eller utan minskad rörelse. Banfunktionen nedan är hela framåtberäkningen. Den har ett tak på 2000 steg som skyddsnät, men inget frö i det tillåtna intervallet kommer i närheten: det längsta under en miljon är 837\u00a0799 med 524 steg.",
          "Diagrammet avbildar stegindex linjärt på x-axeln och log10 av värdet på y-axeln, med rutnätslinjer vid varje tiopotens. Utan den logaritmiska skalan skulle toppen 9232 för n = 27 pressa ihop resten av banan till en platt linje längs nederkanten. En cyanfärgad ring markerar toppen.",
          "Det omvända trädet är en bredden-först-sökning från 1. Varje nod v får alltid föregångaren 2v. Den får en andra föregångare (v − 1)/3 bara om v ger resten 4 vid division med 6, eftersom det är precis då som (v − 1)/3 är ett udda heltal. Koden hoppar dessutom över v = 4 så att den triviala slingan 1, 4, 2, 1 inte dyker upp igen. Layouten är radiell: djupet bestämmer avståndet från mitten, och varje barn får en del av förälderns vinkel i proportion till hur många löv som hänger under det.",
        ],
        code: TRAJECTORY_EXCERPT,
      },
      {
        heading: "Varför trädet förblir tunt",
        paragraphs: [
          "Baklänges är förgreningarna glesa. De flesta noder har bara fördubblingsföregångaren, så under de första nivåerna är trädet en rak linje: 1, 2, 4, 8, 16. Den första förgreningen kommer vid 16, som också kan nås från 5. Vid maxdjupet 10 innehåller trädet bara 29 tal, och de enda udda förutom 1 är 3, 5, 13, 21 och 85. Förmodan är likvärdig med påståendet att det här trädet, om det får växa utan djupgräns, till slut innehåller varje positivt heltal.",
        ],
      },
    ],
    experimentsHeading: "Prova det här",
    experiments: [
      {
        title: "27 mot sina grannar",
        text: "Skriv 26, sedan 27, sedan 28. Fröet 26 behöver 10 steg och 28 behöver 18, medan 27 behöver 111 och skjuter upp till 9232. Ingenting med 27 ser speciellt ut förrän du kör regeln.",
      },
      {
        title: "Tvåpotenser faller rakt ner",
        text: "Skriv in 1024. Diagrammet är en ren trappa av 10 halveringar med toppen vid steg 0. Prova sedan 1023, ett mindre, som behöver 62 steg och klättrar långt över sin start.",
      },
      {
        title: "En bana som bor inne i trädet",
        text: "Ställ ”Träddjup” på 9 och fröet på 13. Dess bana 13, 40, 20, 10, 5, 16, 8, 4, 2, 1 ligger helt inne i trädet, så varje nod på den lyser i cyan. Fröet 85 gör likadant: det hoppar till 256 och halveras sedan hela vägen ner.",
      },
      {
        title: "Rekordhållaren under en miljon",
        text: "Skriv 837799. Det behöver 524 steg och når en topp på nästan tre miljarder, och ändå får den logaritmiska skalan plats med hela resan i ett enda diagram.",
      },
    ],
  },
  no: {
    metaDescription:
      "Utforsk Collatz-formodningen: Tegn enhver haglsteinsfølge opp til en million i logaritmisk skala, finn toppen og la det omvendte treet vokse fra 1.",
    heading: "Slik fungerer denne utforskeren",
    intro:
      "Det øverste diagrammet er haglsteinsfølgen til ett enkelt starttall n. Hvert punkt er ett trinn i Collatz-regelen, tegnet fra venstre mot høyre, og høyden viser verdien på en logaritmisk skala. Det nederste bildet kjører den samme regelen baklengs: Det starter i 1 og lar et tre vokse fram av alle tall som når 1 i løpet av noen få trinn. Banen til frøet ditt lyser i cyan overalt der den går gjennom treet.",
    sections: [
      {
        heading: "Én regel, ett åpent spørsmål",
        paragraphs: [
          "Regelen får plass på en serviett. Hvis n er et partall, halverer du det. Hvis n er et oddetall, tredobler du det og legger til én. Gjenta. Start på 6, og du får 6, 3, 10, 5, 16, 8, 4, 2, 1. Vel framme ved 1 ville følgen gått i ring gjennom 4, 2, 1 for alltid, så utforskeren stopper der og teller trinnene.",
          "Collatz-formodningen, oppkalt etter Lothar Collatz som formulerte den i 1937, sier at ethvert positivt heltall til slutt når 1. Datamaskiner har sjekket alle startverdier til forbi 10^20 uten å finne et moteksempel, men ingen har et bevis. Vanskeligheten er at halvering og tredobling trekker i hver sin retning: I gjennomsnitt multipliserer et oddetallstrinn med omtrent 3/2 etter halveringen som må følge, mens rekker av partallstrinn dividerer med potenser av 2, og ingen vet hvordan man får kontroll på blandingen for enhver n.",
        ],
        formula:
          "T(n) = \\begin{cases} n/2 & n \\text{ partall} \\\\ 3n + 1 & n \\text{ oddetall} \\end{cases}",
      },
      {
        heading: "Hva kontrollene gjør",
        paragraphs: [
          "Tallfeltet tar imot et hvilket som helst frø fra 1 til 1\u00a0000\u00a0000. Trykk Enter eller forlat feltet for å ta det i bruk, og ugyldige verdier hopper tilbake til det forrige frøet. Glidebryteren under dekker 1 til 10\u00a0000 for rask blaing. Siden åpner med n = 27, den klassiske overraskelsen: et lite tall som trenger 111 trinn og klatrer til 9232 (ved trinn 77) før det endelig faller.",
          "De fire forhåndsvalgknappene er 27, 97, 871 og 6171. De to siste er rekorder: 871 trenger 178 trinn, flere enn noe annet starttall under 1000, og 6171 trenger 261 trinn, flere enn noe annet starttall under 10\u00a0000. Statistikkpanelet viser antall trinn, toppverdien, trinnet der toppen nås, og banelengden (alltid én mer enn antall trinn, fordi starten telles med).",
          "«Vis omvendt tre» viser eller skjuler det nederste bildet, og «Tredybde» (3 til 10, standard 8) bestemmer hvor mange trinn bakover som utforskes fra 1.",
        ],
      },
      {
        heading: "Slik er den bygget",
        paragraphs: [
          "Ingenting her er animert. Begge bildene er ren SVG som regnes ut på nytt med Reacts useMemo hver gang frøet eller treinnstillingene endres, så siden ser lik ut med eller uten redusert bevegelse. Banefunksjonen nedenfor er hele beregningen framover. Den har et tak på 2000 trinn som sikkerhetsnett, men ingen frø i det tillatte området kommer i nærheten: Det lengste under en million er 837\u00a0799 med 524 trinn.",
          "Diagrammet avbilder trinnindeksen lineært på x-aksen og log10 av verdien på y-aksen, med rutenettlinjer ved hver tierpotens. Uten den logaritmiske skalaen ville toppen 9232 for n = 27 klemt resten av banen sammen til en flat linje langs bunnen. En cyanfarget ring markerer toppen.",
          "Det omvendte treet er et bredde-først-søk fra 1. Hver node v får alltid forgjengeren 2v. Den får en andre forgjenger (v − 1)/3 bare hvis v gir rest 4 ved divisjon med 6, for det er nettopp da (v − 1)/3 er et odde heltall. Koden hopper dessuten over v = 4, slik at den trivielle løkken 1, 4, 2, 1 ikke dukker opp igjen. Oppsettet er radialt: Dybden bestemmer avstanden fra sentrum, og hvert barn får en del av forelderens vinkel i forhold til hvor mange blader som henger under det.",
        ],
        code: TRAJECTORY_EXCERPT,
      },
      {
        heading: "Hvorfor treet holder seg tynt",
        paragraphs: [
          "Baklengs er forgreiningene få. De fleste noder har bare doblingsforgjengeren, så på de første nivåene er treet en rett linje: 1, 2, 4, 8, 16. Den første forgreiningen kommer ved 16, som også kan nås fra 5. Ved maksdybden 10 inneholder treet bare 29 tall, og de eneste oddetallene utenom 1 er 3, 5, 13, 21 og 85. Formodningen er ensbetydende med at dette treet, hvis det får vokse uten dybdegrense, til slutt inneholder ethvert positivt heltall.",
        ],
      },
    ],
    experimentsHeading: "Prøv dette",
    experiments: [
      {
        title: "27 mot naboene sine",
        text: "Skriv 26, så 27, så 28. Frøet 26 trenger 10 trinn og 28 trenger 18, mens 27 trenger 111 og skyter opp til 9232. Ingenting ved 27 ser spesielt ut før du kjører regelen.",
      },
      {
        title: "Toerpotenser faller rett ned",
        text: "Skriv inn 1024. Diagrammet er en ren trapp av 10 halveringer med toppen ved trinn 0. Prøv så 1023, én mindre, som trenger 62 trinn og klatrer langt over starten sin.",
      },
      {
        title: "En bane som bor inne i treet",
        text: "Sett «Tredybde» til 9 og frøet til 13. Banen 13, 40, 20, 10, 5, 16, 8, 4, 2, 1 ligger helt inne i treet, så hver node på den lyser i cyan. Frøet 85 gjør det samme: Det hopper til 256 og halveres så hele veien ned.",
      },
      {
        title: "Rekordholderen under en million",
        text: "Skriv 837799. Det trenger 524 trinn og når en topp på nesten tre milliarder, og likevel får den logaritmiske skalaen plass til hele reisen i ett diagram.",
      },
    ],
  },
};
