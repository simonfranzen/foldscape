import type { ExplorerGuide } from "./types";

// Numbers quoted here (160 points, 48 x 48 grid, loss threshold 0.02 over the
// last 12 updates, at most 12 updates per frame, 320-point loss history)
// match app/backprop/explorer/page.tsx; update both together.
const BACKWARD_EXCERPT = `// Output layer (sigmoid + MSE).
deltas[L - 1] = [(yhat - y) * aL[0] * (1 - aL[0])];
// Hidden layers (tanh).
for (let l = L - 2; l >= 0; l--) {
  const d = new Array(layer.W.length);
  for (let i = 0; i < layer.W.length; i++) {
    let s = 0;
    for (let k = 0; k < nextLayer.W.length; k++) {
      s += nextLayer.W[k][i] * nextDelta[k];
    }
    d[i] = s * dtanh(aL2[i]);   // dtanh(a) = 1 - a*a
  }
  deltas[l] = d;
}
// later: gW[l][i][j] += d[i] * input[j]; then W -= lr * gW / n`;

const DELTA_FORMULA =
  "\\delta^{(l)} = \\big(W^{(l+1)\\top} \\delta^{(l+1)}\\big) \\odot \\big(1 - a^{(l)} \\odot a^{(l)}\\big), \\qquad \\frac{\\partial \\mathcal{L}}{\\partial W^{(l)}} = \\delta^{(l)} \\, a^{(l-1)\\top}";

export const BACKPROP_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Train a tiny neural network in your browser with backpropagation: watch the decision boundary bend around XOR, two moons and a circle as the loss falls.",
    heading: "How this explorer works",
    intro:
      "The coloured square is the input plane of a small neural network, from −1 to 1 in both directions. Every dot is a training example: amber for class 1, cyan for class 0. The soft background shows what the network currently believes at each point, and faint white specks trace the line where it is exactly undecided. Press play and backpropagation nudges the weights with every update until that belief matches the data.",
    sections: [
      {
        heading: "The chain rule, run backwards",
        paragraphs: [
          "A network is a chain of simple functions. Each layer takes a weighted sum of its inputs plus a bias and squashes it: tanh in the hidden layers, the logistic sigmoid at the single output, so ŷ lies between 0 and 1. The loss for one example is ½(ŷ − y)².",
          "To improve, every weight needs to know how the loss would change if it moved a little. Backpropagation answers that for all weights in one sweep: it computes an error signal δ at the output and passes it back layer by layer. Each hidden neuron sums the δ values of the neurons it feeds, weighted by the connections, and multiplies by the slope of its own activation. A weight's gradient is then its δ times the input it saw on the forward pass. The idea was written down by Seppo Linnainmaa in 1970 and became the standard way to train networks after the 1986 paper by Rumelhart, Hinton and Williams.",
        ],
        formula: DELTA_FORMULA,
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "Topology chooses the shape: 2 → 3 → 1 has 13 parameters, the default 2 → 4 → 4 → 1 has 37, and 3 → 8 → 8 → 1 has 113 plus a third input, the product x·y. Toy task switches between XOR (four corner blobs, opposite corners share a class), two interlocking moons, and a disc of radius 0.55 inside a square.",
          "Learning rate η scales every update, from 0.01 to 1 (default 0.3). Batch size, 1 to 64 (default 16), is how many of the 160 points go into one update: the points are shuffled, cut into batches, and the averaged gradient of each batch is applied. Updates / second, 5 to 240 (default 60), is the update rate. Step ×1 applies exactly one update. Reset draws fresh weights from a new seed and keeps the data.",
          "The badge shows two counters. Update counts the mini-batch steps; epoch counts completed passes over all 160 points, so with batch 16 one epoch is exactly ten updates, and the data is reshuffled for the next pass. Accuracy is measured on all 160 points after every update, with 0.5 as the threshold.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "There is no machine learning library here. The network is a list of layers, each a weight matrix of nested arrays plus a bias vector. The forward pass caches every layer's input and activation, exactly what the backward pass needs. Initial weights come from a small linear congruential generator, scaled by √(2 / (fan-in + fan-out)) in the spirit of Xavier initialisation, so a seed always gives the same starting network. The data has a fixed seed too, which is why the dots stay put on reset.",
          "The heatmap evaluates the network on a 48 × 48 grid whenever the weights change and blends amber and cyan by the output. Wherever the output crosses 0.5 between a cell and its right or lower neighbour, a small boundary dot is drawn. Training runs inside requestAnimationFrame with as many updates as elapsed time and the speed slider ask for. Fractions are carried over to the next frame, so 5 updates per second really means one every 0.2 seconds. The limit is twelve per frame, so a background tab does not try to catch up all at once. The loss chart keeps the last 320 batch losses.",
          "Nothing animates on its own: the canvas redraws only when the weights change, and they change only after you press play or step.",
        ],
        code: BACKWARD_EXCERPT,
      },
      {
        heading: "Why the x·y feature is a shortcut",
        paragraphs: [
          "XOR is the textbook problem a single neuron cannot solve, because no straight line separates the two diagonals. The hidden layer has to invent a coordinate in which the classes become separable. The 3 → 8 → 8 → 1 topology hands that coordinate over: for XOR the sign of x·y already decides the label. Compare XOR with and without that feature and you see what hidden layers are for: they build features.",
        ],
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "Overshoot the valley",
        text: "On two moons with 2 → 4 → 4 → 1, set η to 1.0 and batch size 1. The loss curve turns jagged, because each update follows a single point. Drop η to 0.1 and raise the batch to 64: slower, but smooth.",
      },
      {
        title: "Give XOR the answer",
        text: "Run XOR on 2 → 3 → 1 and note how many updates it needs for full accuracy. Then switch to 3 → 8 → 8 → 1. With x·y as an input the corners are usually separated much sooner.",
      },
      {
        title: "Same data, different luck",
        text: "On the circle task with 2 → 3 → 1, reset a few times and train each run. Different seeds can land on visibly different boundaries. Each tanh neuron contributes one soft ridge along a straight line, so three are just enough to enclose a region, and their arrangement depends on where they started.",
      },
      {
        title: "Watch one update at a time",
        text: "With batch size 64, press step ×1 repeatedly from a fresh reset. Early updates move the whole surface; later ones mostly shift the boundary near misclassified points, where δ is still large.",
      },
    ],
  },
  de: {
    metaDescription:
      "Trainiere ein kleines neuronales Netz per Backpropagation im Browser und sieh zu, wie sich die Entscheidungsgrenze um XOR, zwei Monde und einen Kreis legt.",
    heading: "So funktioniert dieser Explorer",
    intro:
      "Das farbige Quadrat ist die Eingabeebene eines kleinen neuronalen Netzes, von −1 bis 1 in beide Richtungen. Jeder Punkt ist ein Trainingsbeispiel: Bernstein für Klasse 1, Cyan für Klasse 0. Der weiche Hintergrund zeigt, was das Netz an jeder Stelle gerade glaubt, und feine weiße Pünktchen markieren die Linie, an der es genau unentschieden ist. Drück auf «los», und Backpropagation stupst die Gewichte bei jedem Update an, bis diese Einschätzung zu den Daten passt.",
    sections: [
      {
        heading: "Die Kettenregel, rückwärts gerechnet",
        paragraphs: [
          "Ein Netz ist eine Kette einfacher Funktionen. Jede Schicht bildet eine gewichtete Summe ihrer Eingaben plus einen Bias und staucht sie: mit tanh in den versteckten Schichten, mit der logistischen Sigmoidfunktion am einzigen Ausgang, also liegt ŷ zwischen 0 und 1. Der Verlust für ein Beispiel ist ½(ŷ − y)².",
          "Um besser zu werden, muss jedes Gewicht wissen, wie sich der Verlust ändern würde, wenn es sich ein wenig bewegt. Backpropagation beantwortet das für alle Gewichte in einem Durchgang: Es berechnet ein Fehlersignal δ am Ausgang und reicht es Schicht für Schicht zurück. Jedes versteckte Neuron summiert die δ-Werte der Neuronen, die es speist, gewichtet mit den Verbindungen, und multipliziert mit der Steigung seiner eigenen Aktivierung. Der Gradient eines Gewichts ist dann sein δ mal die Eingabe, die es im Vorwärtsdurchlauf gesehen hat. Seppo Linnainmaa hat die Idee 1970 aufgeschrieben, zum Standardverfahren für das Training von Netzen wurde sie nach dem Artikel von Rumelhart, Hinton und Williams aus dem Jahr 1986.",
        ],
        formula: DELTA_FORMULA,
      },
      {
        heading: "Was die Regler bewirken",
        paragraphs: [
          "Die Topologie legt die Form fest: 2 → 3 → 1 hat 13 Parameter, die Voreinstellung 2 → 4 → 4 → 1 hat 37, und 3 → 8 → 8 → 1 hat 113 und dazu einen dritten Eingang, das Produkt x·y. Die Spielaufgabe wechselt zwischen XOR (vier Wolken in den Ecken, gegenüberliegende Ecken teilen sich eine Klasse), zwei verschränkten Monden und einer Kreisscheibe mit Radius 0,55 in einem Quadrat.",
          "Die Lernrate η skaliert jedes Update, von 0,01 bis 1 (Voreinstellung 0,3). Die Batchgröße, 1 bis 64 (Voreinstellung 16), sagt, wie viele der 160 Punkte in ein Update eingehen: Die Punkte werden gemischt, in Batches geschnitten, und der gemittelte Gradient jedes Batches wird angewendet. Updates / Sekunde, 5 bis 240 (Voreinstellung 60), ist die Update-Rate. Schritt ×1 führt genau ein Update aus. Zurücksetzen würfelt neue Gewichte mit neuem Seed und behält die Daten.",
          "Die Anzeige führt zwei Zähler. «Update» zählt die Mini-Batch-Schritte, «Epoche» die abgeschlossenen Durchläufe durch alle 160 Punkte. Bei Batchgröße 16 besteht eine Epoche also aus genau zehn Updates, und für den nächsten Durchlauf wird neu gemischt. Die Genauigkeit wird nach jedem Update auf allen 160 Punkten gemessen, mit 0,5 als Schwelle.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Hier steckt keine Machine-Learning-Bibliothek drin. Das Netz ist eine Liste von Schichten, jede eine Gewichtsmatrix aus verschachtelten Arrays plus ein Bias-Vektor. Der Vorwärtsdurchlauf merkt sich Eingabe und Aktivierung jeder Schicht, genau das, was der Rückwärtsdurchlauf braucht. Die Startgewichte kommen aus einem kleinen linearen Kongruenzgenerator, im Geist der Xavier-Initialisierung mit √(2 / (fan-in + fan-out)) skaliert, derselbe Seed liefert also dasselbe Startnetz. Auch die Daten haben einen festen Seed, deshalb bleiben die Punkte beim Zurücksetzen liegen.",
          "Die Heatmap wertet das Netz bei jeder Gewichtsänderung auf einem Raster von 48 × 48 Zellen aus und mischt Bernstein und Cyan nach der Ausgabe. Wo die Ausgabe zwischen einer Zelle und ihrer rechten oder unteren Nachbarin die 0,5 kreuzt, erscheint ein kleiner Grenzpunkt. Das Training läuft in requestAnimationFrame mit so vielen Updates, wie vergangene Zeit und Tempo-Regler verlangen. Bruchteile wandern in den nächsten Frame, 5 Updates pro Sekunde heißt also wirklich eines alle 0,2 Sekunden. Die Obergrenze liegt bei zwölf pro Frame, damit ein Hintergrund-Tab nicht alles auf einmal nachholt. Die Verlustkurve behält die letzten 320 Batch-Verluste.",
          "Von selbst bewegt sich nichts: Das Canvas zeichnet nur neu, wenn sich die Gewichte ändern, und die ändern sich nur nach «los» oder «Schritt ×1».",
        ],
        code: BACKWARD_EXCERPT,
      },
      {
        heading: "Warum das x·y-Merkmal eine Abkürzung ist",
        paragraphs: [
          "XOR ist das Lehrbuchproblem, das ein einzelnes Neuron nicht lösen kann, weil keine Gerade die beiden Diagonalen trennt. Die versteckte Schicht muss eine Koordinate erfinden, in der die Klassen trennbar werden. Die Topologie 3 → 8 → 8 → 1 schenkt sie dem Netz: Bei XOR entscheidet schon das Vorzeichen von x·y über das Label. Vergleich XOR mit und ohne dieses Merkmal, und du siehst, wofür versteckte Schichten da sind: Sie bauen Merkmale.",
        ],
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Übers Tal hinausschießen",
        text: "Stell bei den zwei Monden mit 2 → 4 → 4 → 1 η auf 1,0 und die Batchgröße auf 1. Die Verlustkurve wird zackig, weil jedes Update einem einzigen Punkt folgt. Senk η auf 0,1 und erhöh die Batchgröße auf 64: langsamer, aber glatt.",
      },
      {
        title: "XOR die Lösung verraten",
        text: "Trainiere XOR mit 2 → 3 → 1 und merk dir, wie viele Updates es bis zur vollen Genauigkeit braucht. Wechsle dann zu 3 → 8 → 8 → 1. Mit x·y als Eingabe sind die Ecken meist deutlich schneller getrennt.",
      },
      {
        title: "Gleiche Daten, anderes Glück",
        text: "Setz bei der Kreisaufgabe mit 2 → 3 → 1 ein paar Mal zurück und trainiere jeden Lauf. Verschiedene Seeds können bei sichtbar verschiedenen Grenzen landen. Jedes tanh-Neuron steuert einen weichen Grat entlang einer Geraden bei. Drei davon reichen gerade, um ein Gebiet einzuschließen, und wie sie liegen, hängt davon ab, wo sie gestartet sind.",
      },
      {
        title: "Ein Update nach dem anderen",
        text: "Drück bei Batchgröße 64 direkt nach dem Zurücksetzen mehrmals auf Schritt ×1. Die ersten Updates verschieben die ganze Fläche, spätere bewegen die Grenze vor allem nahe falsch eingeordneter Punkte, wo δ noch groß ist.",
      },
    ],
  },
  es: {
    metaDescription:
      "Entrena una pequeña red neuronal con retropropagación en tu navegador y mira cómo la frontera de decisión se ciñe a XOR, dos lunas y un círculo.",
    heading: "Cómo funciona este explorador",
    intro:
      "El cuadrado de colores es el plano de entrada de una pequeña red neuronal, de −1 a 1 en ambas direcciones. Cada punto es un ejemplo de entrenamiento: ámbar para la clase 1, cian para la clase 0. El fondo difuminado muestra lo que la red cree en este momento en cada punto, y unas tenues motas blancas trazan la línea donde está exactamente indecisa. Pulsa «ir» y la retropropagación empuja un poco los pesos con cada actualización, hasta que esa creencia coincide con los datos.",
    sections: [
      {
        heading: "La regla de la cadena, recorrida hacia atrás",
        paragraphs: [
          "Una red es una cadena de funciones sencillas. Cada capa toma una suma ponderada de sus entradas más un sesgo y la comprime: con tanh en las capas ocultas y con la sigmoide logística en la única salida, de modo que ŷ queda entre 0 y 1. La pérdida de un ejemplo es ½(ŷ − y)².",
          "Para mejorar, cada peso necesita saber cómo cambiaría la pérdida si se moviera un poco. La retropropagación responde a eso para todos los pesos de una sola pasada: calcula una señal de error δ en la salida y la devuelve capa por capa. Cada neurona oculta suma los valores δ de las neuronas a las que alimenta, ponderados por las conexiones, y multiplica por la pendiente de su propia activación. El gradiente de un peso es entonces su δ por la entrada que vio en la pasada hacia delante. Seppo Linnainmaa dejó escrita la idea en 1970, y se convirtió en la forma estándar de entrenar redes tras el artículo de Rumelhart, Hinton y Williams de 1986.",
        ],
        formula: DELTA_FORMULA,
      },
      {
        heading: "Qué hacen los controles",
        paragraphs: [
          "«Topología de la red» elige la forma: 2 → 3 → 1 tiene 13 parámetros, la opción por defecto 2 → 4 → 4 → 1 tiene 37, y 3 → 8 → 8 → 1 tiene 113 más una tercera entrada, el producto x·y. «Tarea de juguete» cambia entre XOR (cuatro nubes en las esquinas, las esquinas opuestas comparten clase), dos lunas entrelazadas y un disco de radio 0,55 dentro de un cuadrado.",
          "La tasa de aprendizaje η escala cada actualización, de 0,01 a 1 (por defecto 0,3). El tamaño de lote, de 1 a 64 (por defecto 16), indica cuántos de los 160 puntos entran en una actualización: los puntos se barajan, se cortan en lotes y se aplica el gradiente promediado de cada lote. «Actualizaciones / segundo», de 5 a 240 (por defecto 60), es el ritmo de actualización. «paso ×1» aplica exactamente una actualización. «reiniciar» sortea pesos nuevos a partir de una semilla nueva y conserva los datos.",
          "El indicador muestra dos contadores. «actualización» cuenta los pasos de minilote; «Época» cuenta las pasadas completas por los 160 puntos, así que con un lote de 16 una época son exactamente diez actualizaciones, y los datos se vuelven a barajar para la pasada siguiente. La precisión se mide sobre los 160 puntos después de cada actualización, con 0,5 como umbral.",
        ],
      },
      {
        heading: "Cómo está construido",
        paragraphs: [
          "Aquí no hay ninguna biblioteca de aprendizaje automático. La red es una lista de capas, cada una con una matriz de pesos hecha de arrays anidados más un vector de sesgos. La pasada hacia delante guarda la entrada y la activación de cada capa, justo lo que necesita la pasada hacia atrás. Los pesos iniciales salen de un pequeño generador congruencial lineal, escalados por √(2 / (fan-in + fan-out)) en el espíritu de la inicialización de Xavier, de modo que una semilla da siempre la misma red de partida. Los datos también tienen una semilla fija, y por eso los puntos no se mueven al reiniciar.",
          "El mapa de calor evalúa la red en una cuadrícula de 48 × 48 cada vez que cambian los pesos y mezcla ámbar y cian según la salida. Allí donde la salida cruza 0,5 entre una celda y su vecina de la derecha o de abajo, se dibuja un pequeño punto de frontera. El entrenamiento corre dentro de requestAnimationFrame con tantas actualizaciones como pidan el tiempo transcurrido y el deslizador de velocidad. Las fracciones pasan al fotograma siguiente, así que 5 actualizaciones por segundo significa de verdad una cada 0,2 segundos. El límite es de doce por fotograma, para que una pestaña en segundo plano no intente recuperar todo de golpe. La gráfica de pérdida conserva las últimas 320 pérdidas de lote.",
          "Nada se anima por su cuenta: el lienzo solo se redibuja cuando cambian los pesos, y estos solo cambian después de que pulses «ir» o «paso ×1».",
        ],
        code: BACKWARD_EXCERPT,
      },
      {
        heading: "Por qué la característica x·y es un atajo",
        paragraphs: [
          "XOR es el problema de manual que una sola neurona no puede resolver, porque ninguna recta separa las dos diagonales. La capa oculta tiene que inventar una coordenada en la que las clases se vuelvan separables. La topología 3 → 8 → 8 → 1 le regala esa coordenada: en XOR, el signo de x·y ya decide la etiqueta. Compara XOR con y sin esa característica y verás para qué sirven las capas ocultas: construyen características.",
        ],
      },
    ],
    experimentsHeading: "Prueba esto",
    experiments: [
      {
        title: "Pasarse de largo en el valle",
        text: "En las dos lunas con 2 → 4 → 4 → 1, pon η en 1,0 y el tamaño de lote en 1. La curva de pérdida se vuelve dentada, porque cada actualización sigue a un único punto. Baja η a 0,1 y sube el lote a 64: más lento, pero suave.",
      },
      {
        title: "Dale la respuesta a XOR",
        text: "Entrena XOR con 2 → 3 → 1 y fíjate en cuántas actualizaciones necesita para alcanzar la precisión total. Después cambia a 3 → 8 → 8 → 1. Con x·y como entrada, las esquinas suelen quedar separadas mucho antes.",
      },
      {
        title: "Mismos datos, distinta suerte",
        text: "En la tarea del círculo con 2 → 3 → 1, reinicia unas cuantas veces y entrena cada intento. Semillas distintas pueden acabar en fronteras visiblemente diferentes. Cada neurona tanh aporta una cresta suave a lo largo de una recta, así que tres bastan justo para encerrar una región, y su disposición depende de dónde empezaron.",
      },
      {
        title: "Observa las actualizaciones de una en una",
        text: "Con tamaño de lote 64, pulsa «paso ×1» varias veces justo después de reiniciar. Las primeras actualizaciones mueven toda la superficie; las posteriores desplazan sobre todo la frontera cerca de los puntos mal clasificados, donde δ sigue siendo grande.",
      },
    ],
  },
  fr: {
    metaDescription:
      "Entraîne un petit réseau de neurones par rétropropagation dans ton navigateur et regarde la frontière de décision épouser XOR, deux lunes et un cercle.",
    heading: "Comment fonctionne cet explorateur",
    intro:
      "Le carré coloré est le plan d'entrée d'un petit réseau de neurones, de −1 à 1 dans les deux directions. Chaque point est un exemple d'entraînement : ambre pour la classe 1, cyan pour la classe 0. Le fond estompé montre ce que le réseau croit en ce moment en chaque point, et de fines mouchetures blanches tracent la ligne où il est exactement indécis. Appuie sur « go » et la rétropropagation ajuste légèrement les poids à chaque mise à jour, jusqu'à ce que cette croyance colle aux données.",
    sections: [
      {
        heading: "La règle de dérivation en chaîne, parcourue à rebours",
        paragraphs: [
          "Un réseau est une chaîne de fonctions simples. Chaque couche prend une somme pondérée de ses entrées, y ajoute un biais et l'écrase : avec tanh dans les couches cachées, avec la sigmoïde logistique à l'unique sortie, si bien que ŷ se situe entre 0 et 1. La perte pour un exemple vaut ½(ŷ − y)².",
          "Pour s'améliorer, chaque poids doit savoir comment la perte changerait s'il bougeait un peu. La rétropropagation répond à cette question pour tous les poids en un seul passage : elle calcule un signal d'erreur δ à la sortie et le fait remonter couche par couche. Chaque neurone caché additionne les valeurs δ des neurones qu'il alimente, pondérées par les connexions, puis multiplie par la pente de sa propre activation. Le gradient d'un poids est alors son δ multiplié par l'entrée qu'il a vue lors de la passe avant. L'idée a été formulée par Seppo Linnainmaa en 1970 et s'est imposée comme la méthode standard pour entraîner les réseaux après l'article de Rumelhart, Hinton et Williams en 1986.",
        ],
        formula: DELTA_FORMULA,
      },
      {
        heading: "À quoi servent les commandes",
        paragraphs: [
          "« Topologie du réseau » choisit la forme : 2 → 3 → 1 compte 13 paramètres, le réglage par défaut 2 → 4 → 4 → 1 en compte 37, et 3 → 8 → 8 → 1 en compte 113, avec en plus une troisième entrée, le produit x·y. « Tâche jouet » permet de passer de XOR (quatre nuages dans les coins, les coins opposés partagent une classe) à deux lunes imbriquées ou à un disque de rayon 0,55 dans un carré.",
          "Le taux d'apprentissage η met à l'échelle chaque mise à jour, de 0,01 à 1 (0,3 par défaut). La taille du lot, de 1 à 64 (16 par défaut), indique combien des 160 points entrent dans une mise à jour : les points sont mélangés, découpés en lots, et le gradient moyen de chaque lot est appliqué. « Mises à jour / seconde », de 5 à 240 (60 par défaut), fixe la cadence des mises à jour. « pas ×1 » applique exactement une mise à jour. « réinitialiser » tire de nouveaux poids à partir d'une nouvelle graine et conserve les données.",
          "Le badge affiche deux compteurs. « mise à jour » compte les pas de mini-lot ; « Époque » compte les passages complets sur les 160 points, donc avec un lot de 16 une époque correspond exactement à dix mises à jour, et les données sont mélangées de nouveau pour le passage suivant. La précision est mesurée sur les 160 points après chaque mise à jour, avec 0,5 comme seuil.",
        ],
      },
      {
        heading: "Comment c'est construit",
        paragraphs: [
          "Il n'y a ici aucune bibliothèque d'apprentissage automatique. Le réseau est une liste de couches, chacune formée d'une matrice de poids en tableaux imbriqués et d'un vecteur de biais. La passe avant garde en mémoire l'entrée et l'activation de chaque couche, exactement ce dont la passe arrière a besoin. Les poids initiaux proviennent d'un petit générateur congruentiel linéaire, mis à l'échelle par √(2 / (fan-in + fan-out)) dans l'esprit de l'initialisation de Xavier, de sorte qu'une graine donne toujours le même réseau de départ. Les données ont elles aussi une graine fixe, c'est pourquoi les points ne bougent pas quand tu réinitialises.",
          "La carte de chaleur évalue le réseau sur une grille de 48 × 48 à chaque changement des poids et mélange ambre et cyan selon la sortie. Partout où la sortie franchit 0,5 entre une cellule et sa voisine de droite ou du dessous, un petit point de frontière est dessiné. L'entraînement tourne dans requestAnimationFrame, avec autant de mises à jour que le temps écoulé et le curseur de vitesse en demandent. Les fractions sont reportées sur l'image suivante, donc 5 mises à jour par seconde signifie vraiment une toutes les 0,2 seconde. La limite est de douze par image, pour qu'un onglet en arrière-plan n'essaie pas de tout rattraper d'un coup. Le graphique de la perte conserve les 320 dernières pertes de lot.",
          "Rien ne s'anime tout seul : le canevas n'est redessiné que lorsque les poids changent, et ils ne changent qu'après un appui sur « go » ou sur « pas ×1 ».",
        ],
        code: BACKWARD_EXCERPT,
      },
      {
        heading: "Pourquoi la caractéristique x·y est un raccourci",
        paragraphs: [
          "XOR est le problème d'école qu'un neurone seul ne peut pas résoudre, car aucune droite ne sépare les deux diagonales. La couche cachée doit inventer une coordonnée dans laquelle les classes deviennent séparables. La topologie 3 → 8 → 8 → 1 lui offre cette coordonnée : pour XOR, le signe de x·y décide déjà de l'étiquette. Compare XOR avec et sans cette caractéristique et tu verras à quoi servent les couches cachées : elles construisent des caractéristiques.",
        ],
      },
    ],
    experimentsHeading: "À essayer",
    experiments: [
      {
        title: "Dépasse la vallée",
        text: "Sur les deux lunes avec 2 → 4 → 4 → 1, règle η sur 1,0 et la taille du lot sur 1. La courbe de perte devient hachée, parce que chaque mise à jour suit un seul point. Baisse η à 0,1 et monte le lot à 64 : plus lent, mais lisse.",
      },
      {
        title: "Souffle la réponse à XOR",
        text: "Lance XOR sur 2 → 3 → 1 et note combien de mises à jour il lui faut pour atteindre une précision totale. Passe ensuite à 3 → 8 → 8 → 1. Avec x·y en entrée, les coins sont en général séparés bien plus tôt.",
      },
      {
        title: "Mêmes données, autre chance",
        text: "Sur la tâche du cercle avec 2 → 3 → 1, réinitialise plusieurs fois et entraîne chaque essai. Des graines différentes peuvent aboutir à des frontières visiblement différentes. Chaque neurone tanh apporte une crête douce le long d'une droite, si bien que trois suffisent tout juste à enfermer une région, et leur disposition dépend de leur point de départ.",
      },
      {
        title: "Une mise à jour à la fois",
        text: "Avec une taille de lot de 64, appuie plusieurs fois sur « pas ×1 » juste après une réinitialisation. Les premières mises à jour déplacent toute la surface ; les suivantes décalent surtout la frontière près des points mal classés, là où δ est encore grand.",
      },
    ],
  },
  it: {
    metaDescription:
      "Allena una piccola rete neurale con la retropropagazione nel browser e guarda la frontiera decisionale piegarsi attorno a XOR, due lune e un cerchio.",
    heading: "Come funziona questo esploratore",
    intro:
      "Il quadrato colorato è il piano di ingresso di una piccola rete neurale, da −1 a 1 in entrambe le direzioni. Ogni punto è un esempio di addestramento: ambra per la classe 1, ciano per la classe 0. Lo sfondo sfumato mostra che cosa la rete crede in questo momento in ogni punto, e deboli puntini bianchi tracciano la linea su cui è esattamente indecisa. Premi «via» e la retropropagazione ritocca i pesi a ogni aggiornamento, finché quella convinzione non coincide con i dati.",
    sections: [
      {
        heading: "La regola della catena, percorsa all'indietro",
        paragraphs: [
          "Una rete è una catena di funzioni semplici. Ogni strato prende una somma pesata dei suoi ingressi più un bias e la schiaccia: con tanh negli strati nascosti, con la sigmoide logistica nell'unica uscita, così ŷ sta tra 0 e 1. La perdita per un esempio è ½(ŷ − y)².",
          "Per migliorare, ogni peso deve sapere come cambierebbe la perdita se si spostasse di poco. La retropropagazione risponde per tutti i pesi in un'unica passata: calcola un segnale di errore δ all'uscita e lo rimanda indietro strato dopo strato. Ogni neurone nascosto somma i valori δ dei neuroni che alimenta, pesati dalle connessioni, e moltiplica per la pendenza della propria attivazione. Il gradiente di un peso è allora il suo δ per l'ingresso che ha visto nella passata in avanti. L'idea fu messa per iscritto da Seppo Linnainmaa nel 1970 e divenne il modo standard di addestrare le reti dopo l'articolo di Rumelhart, Hinton e Williams del 1986.",
        ],
        formula: DELTA_FORMULA,
      },
      {
        heading: "Che cosa fanno i controlli",
        paragraphs: [
          "«Topologia della rete» sceglie la forma: 2 → 3 → 1 ha 13 parametri, quella predefinita 2 → 4 → 4 → 1 ne ha 37, e 3 → 8 → 8 → 1 ne ha 113 più un terzo ingresso, il prodotto x·y. «Compito giocattolo» passa da XOR (quattro nuvole negli angoli, gli angoli opposti condividono la classe) a due lune intrecciate e a un disco di raggio 0,55 dentro un quadrato.",
          "Il tasso di apprendimento η scala ogni aggiornamento, da 0,01 a 1 (predefinito 0,3). La dimensione del batch, da 1 a 64 (predefinita 16), dice quanti dei 160 punti entrano in un aggiornamento: i punti vengono mescolati, tagliati in batch, e si applica il gradiente medio di ciascun batch. «Aggiornamenti / secondo», da 5 a 240 (predefinito 60), è il ritmo degli aggiornamenti. «passo ×1» applica esattamente un aggiornamento. «azzera» estrae nuovi pesi da un nuovo seme e mantiene i dati.",
          "L'etichetta mostra due contatori. «aggiornamento» conta i passi di mini-batch; «Epoca» conta le passate complete su tutti i 160 punti, quindi con un batch di 16 un'epoca equivale esattamente a dieci aggiornamenti, e i dati vengono rimescolati per la passata successiva. L'accuratezza è misurata su tutti i 160 punti dopo ogni aggiornamento, con 0,5 come soglia.",
        ],
      },
      {
        heading: "Com'è costruito",
        paragraphs: [
          "Qui non c'è nessuna libreria di machine learning. La rete è una lista di strati, ciascuno con una matrice dei pesi fatta di array annidati più un vettore dei bias. La passata in avanti tiene da parte l'ingresso e l'attivazione di ogni strato, esattamente ciò che serve alla passata all'indietro. I pesi iniziali vengono da un piccolo generatore lineare congruenziale, scalati di √(2 / (fan-in + fan-out)) nello spirito dell'inizializzazione di Xavier, così un seme dà sempre la stessa rete di partenza. Anche i dati hanno un seme fisso, ed è per questo che i punti restano fermi quando azzeri.",
          "La mappa di calore valuta la rete su una griglia 48 × 48 ogni volta che i pesi cambiano e mescola ambra e ciano in base all'uscita. Ovunque l'uscita attraversi 0,5 tra una cella e la sua vicina di destra o di sotto, viene disegnato un piccolo punto di frontiera. L'addestramento gira dentro requestAnimationFrame con tanti aggiornamenti quanti ne chiedono il tempo trascorso e il cursore della velocità. Le frazioni vengono riportate al fotogramma successivo, quindi 5 aggiornamenti al secondo significa davvero uno ogni 0,2 secondi. Il limite è di dodici per fotogramma, così una scheda in background non cerca di recuperare tutto in una volta. Il grafico della perdita conserva le ultime 320 perdite di batch.",
          "Niente si anima da solo: il canvas viene ridisegnato solo quando i pesi cambiano, e cambiano solo dopo che hai premuto «via» o «passo ×1».",
        ],
        code: BACKWARD_EXCERPT,
      },
      {
        heading: "Perché la caratteristica x·y è una scorciatoia",
        paragraphs: [
          "XOR è il problema da manuale che un singolo neurone non può risolvere, perché nessuna retta separa le due diagonali. Lo strato nascosto deve inventare una coordinata in cui le classi diventino separabili. La topologia 3 → 8 → 8 → 1 gli consegna quella coordinata: per XOR il segno di x·y decide già l'etichetta. Confronta XOR con e senza quella caratteristica e vedrai a che cosa servono gli strati nascosti: costruiscono caratteristiche.",
        ],
      },
    ],
    experimentsHeading: "Prova così",
    experiments: [
      {
        title: "Scavalca la valle",
        text: "Sulle due lune con 2 → 4 → 4 → 1, imposta η a 1,0 e la dimensione del batch a 1. La curva della perdita diventa frastagliata, perché ogni aggiornamento segue un solo punto. Abbassa η a 0,1 e porta il batch a 64: più lento, ma liscio.",
      },
      {
        title: "Suggerisci la risposta a XOR",
        text: "Addestra XOR con 2 → 3 → 1 e osserva quanti aggiornamenti servono per l'accuratezza piena. Poi passa a 3 → 8 → 8 → 1. Con x·y come ingresso, di solito gli angoli vengono separati molto prima.",
      },
      {
        title: "Stessi dati, fortuna diversa",
        text: "Nel compito del cerchio con 2 → 3 → 1, azzera qualche volta e addestra ogni tentativo. Semi diversi possono approdare a frontiere visibilmente diverse. Ogni neurone tanh contribuisce con una cresta morbida lungo una retta, quindi tre bastano appena per racchiudere una regione, e la loro disposizione dipende da dove sono partiti.",
      },
      {
        title: "Guarda un aggiornamento alla volta",
        text: "Con dimensione del batch 64, premi più volte «passo ×1» subito dopo aver azzerato. I primi aggiornamenti spostano l'intera superficie; quelli successivi spostano soprattutto la frontiera vicino ai punti classificati male, dove δ è ancora grande.",
      },
    ],
  },
  pt: {
    metaDescription:
      "Treina uma pequena rede neuronal com retropropagação no teu navegador e vê a fronteira de decisão moldar-se a XOR, a duas luas e a um círculo.",
    heading: "Como funciona este explorador",
    intro:
      "O quadrado colorido é o plano de entrada de uma pequena rede neuronal, de −1 a 1 em ambas as direções. Cada ponto é um exemplo de treino: âmbar para a classe 1, ciano para a classe 0. O fundo esbatido mostra aquilo em que a rede acredita neste momento em cada ponto, e umas ténues pintas brancas traçam a linha onde ela está exatamente indecisa. Carrega em «ir» e a retropropagação ajusta ligeiramente os pesos a cada atualização, até essa crença coincidir com os dados.",
    sections: [
      {
        heading: "A regra da cadeia, percorrida de trás para a frente",
        paragraphs: [
          "Uma rede é uma cadeia de funções simples. Cada camada toma uma soma ponderada das suas entradas mais um viés e comprime-a: com tanh nas camadas ocultas, com a sigmoide logística na única saída, pelo que ŷ fica entre 0 e 1. A perda para um exemplo é ½(ŷ − y)².",
          "Para melhorar, cada peso precisa de saber como mudaria a perda se ele se movesse um pouco. A retropropagação responde a isso para todos os pesos de uma só passagem: calcula um sinal de erro δ na saída e devolve-o camada a camada. Cada neurónio oculto soma os valores δ dos neurónios que alimenta, ponderados pelas ligações, e multiplica pelo declive da sua própria ativação. O gradiente de um peso é então o seu δ vezes a entrada que viu na passagem para a frente. A ideia foi posta por escrito por Seppo Linnainmaa em 1970 e tornou-se a forma padrão de treinar redes depois do artigo de Rumelhart, Hinton e Williams de 1986.",
        ],
        formula: DELTA_FORMULA,
      },
      {
        heading: "O que fazem os controlos",
        paragraphs: [
          "«Topologia da rede» escolhe a forma: 2 → 3 → 1 tem 13 parâmetros, a predefinição 2 → 4 → 4 → 1 tem 37, e 3 → 8 → 8 → 1 tem 113 mais uma terceira entrada, o produto x·y. «Tarefa de brincadeira» alterna entre XOR (quatro nuvens nos cantos, cantos opostos partilham a classe), duas luas entrelaçadas e um disco de raio 0,55 dentro de um quadrado.",
          "A taxa de aprendizagem η escala cada atualização, de 0,01 a 1 (predefinição 0,3). O tamanho do lote, de 1 a 64 (predefinição 16), indica quantos dos 160 pontos entram numa atualização: os pontos são baralhados, cortados em lotes, e aplica-se o gradiente médio de cada lote. «Atualizações / segundo», de 5 a 240 (predefinição 60), é o ritmo de atualização. «passo ×1» aplica exatamente uma atualização. «reiniciar» sorteia novos pesos a partir de uma nova semente e mantém os dados.",
          "O indicador mostra dois contadores. «atualização» conta os passos de minilote; «Época» conta as passagens completas pelos 160 pontos, pelo que com um lote de 16 uma época são exatamente dez atualizações, e os dados voltam a ser baralhados para a passagem seguinte. A precisão é medida em todos os 160 pontos depois de cada atualização, com 0,5 como limiar.",
        ],
      },
      {
        heading: "Como está construído",
        paragraphs: [
          "Aqui não há nenhuma biblioteca de aprendizagem automática. A rede é uma lista de camadas, cada uma com uma matriz de pesos feita de arrays aninhados mais um vetor de vieses. A passagem para a frente guarda a entrada e a ativação de cada camada, exatamente aquilo de que a passagem para trás precisa. Os pesos iniciais vêm de um pequeno gerador congruencial linear, escalados por √(2 / (fan-in + fan-out)) no espírito da inicialização de Xavier, pelo que uma semente dá sempre a mesma rede de partida. Os dados também têm uma semente fixa, e é por isso que os pontos ficam no sítio quando reinicias.",
          "O mapa de calor avalia a rede numa grelha de 48 × 48 sempre que os pesos mudam e mistura âmbar e ciano de acordo com a saída. Onde quer que a saída cruze 0,5 entre uma célula e a sua vizinha da direita ou de baixo, é desenhado um pequeno ponto de fronteira. O treino corre dentro de requestAnimationFrame com tantas atualizações quantas o tempo decorrido e o cursor de velocidade pedirem. As frações transitam para o fotograma seguinte, pelo que 5 atualizações por segundo significa mesmo uma a cada 0,2 segundos. O limite é de doze por fotograma, para que um separador em segundo plano não tente recuperar tudo de uma vez. O gráfico da perda guarda as últimas 320 perdas de lote.",
          "Nada se anima sozinho: o canvas só é redesenhado quando os pesos mudam, e eles só mudam depois de carregares em «ir» ou em «passo ×1».",
        ],
        code: BACKWARD_EXCERPT,
      },
      {
        heading: "Porque é que a característica x·y é um atalho",
        paragraphs: [
          "XOR é o problema de manual que um único neurónio não consegue resolver, porque nenhuma reta separa as duas diagonais. A camada oculta tem de inventar uma coordenada na qual as classes se tornem separáveis. A topologia 3 → 8 → 8 → 1 entrega-lhe essa coordenada: em XOR, o sinal de x·y já decide a etiqueta. Compara XOR com e sem essa característica e vês para que servem as camadas ocultas: constroem características.",
        ],
      },
    ],
    experimentsHeading: "Experimenta isto",
    experiments: [
      {
        title: "Passa para lá do vale",
        text: "Nas duas luas com 2 → 4 → 4 → 1, põe η em 1,0 e o tamanho do lote em 1. A curva da perda fica serrilhada, porque cada atualização segue um único ponto. Baixa η para 0,1 e sobe o lote para 64: mais lento, mas suave.",
      },
      {
        title: "Dá a resposta ao XOR",
        text: "Treina XOR com 2 → 3 → 1 e repara em quantas atualizações precisa para chegar à precisão total. Depois muda para 3 → 8 → 8 → 1. Com x·y como entrada, os cantos costumam ficar separados muito mais cedo.",
      },
      {
        title: "Os mesmos dados, outra sorte",
        text: "Na tarefa do círculo com 2 → 3 → 1, reinicia algumas vezes e treina cada tentativa. Sementes diferentes podem ir parar a fronteiras visivelmente diferentes. Cada neurónio tanh contribui com uma crista suave ao longo de uma reta, pelo que três chegam à justa para fechar uma região, e a sua disposição depende de onde começaram.",
      },
      {
        title: "Observa uma atualização de cada vez",
        text: "Com tamanho do lote 64, carrega várias vezes em «passo ×1» logo depois de reiniciar. As primeiras atualizações movem a superfície inteira; as posteriores deslocam sobretudo a fronteira perto dos pontos mal classificados, onde δ ainda é grande.",
      },
    ],
  },
  sv: {
    metaDescription:
      "Träna ett litet neuralt nätverk med backpropagation i webbläsaren och se beslutsgränsen böja sig kring XOR, två månar och en cirkel medan förlusten sjunker.",
    heading: "Så fungerar den här utforskaren",
    intro:
      "Den färgade kvadraten är inmatningsplanet för ett litet neuralt nätverk, från −1 till 1 i båda riktningarna. Varje prick är ett träningsexempel: bärnsten för klass 1, cyan för klass 0. Den mjuka bakgrunden visar vad nätverket just nu tror i varje punkt, och svaga vita prickar följer linjen där det är exakt obestämt. Tryck på ”kör” så knuffar backpropagation vikterna lite vid varje uppdatering, tills den uppfattningen stämmer med data.",
    sections: [
      {
        heading: "Kedjeregeln, körd baklänges",
        paragraphs: [
          "Ett nätverk är en kedja av enkla funktioner. Varje lager tar en viktad summa av sina indata plus en bias och trycker ihop den: med tanh i de dolda lagren och med den logistiska sigmoidfunktionen vid den enda utgången, så att ŷ hamnar mellan 0 och 1. Förlusten för ett exempel är ½(ŷ − y)².",
          "För att bli bättre måste varje vikt veta hur förlusten skulle ändras om den flyttade sig en aning. Backpropagation besvarar det för alla vikter i ett enda svep: den beräknar en felsignal δ vid utgången och skickar den bakåt lager för lager. Varje dold neuron summerar δ-värdena från de neuroner den matar, viktade med kopplingarna, och multiplicerar med lutningen hos sin egen aktivering. En vikts gradient är sedan dess δ gånger det ingångsvärde den såg i framåtpasset. Idén skrevs ned av Seppo Linnainmaa 1970 och blev standardsättet att träna nätverk efter artikeln av Rumelhart, Hinton och Williams från 1986.",
        ],
        formula: DELTA_FORMULA,
      },
      {
        heading: "Vad reglagen gör",
        paragraphs: [
          "”Nätverkstopologi” väljer formen: 2 → 3 → 1 har 13 parametrar, standardvalet 2 → 4 → 4 → 1 har 37, och 3 → 8 → 8 → 1 har 113 plus en tredje ingång, produkten x·y. ”Leksaksuppgift” växlar mellan XOR (fyra moln i hörnen, motsatta hörn delar klass), två månar som griper in i varandra och en skiva med radie 0,55 inuti en kvadrat.",
          "Inlärningshastigheten η skalar varje uppdatering, från 0,01 till 1 (standard 0,3). Batchstorleken, 1 till 64 (standard 16), anger hur många av de 160 punkterna som går in i en uppdatering: punkterna blandas, delas upp i batcher, och den genomsnittliga gradienten för varje batch tillämpas. ”Uppdateringar / sekund”, 5 till 240 (standard 60), är uppdateringstakten. ”steg ×1” gör exakt en uppdatering. ”återställ” drar nya vikter från ett nytt frö och behåller datamängden.",
          "Märket visar två räknare. ”uppdatering” räknar minibatchstegen, ”Epok” räknar avslutade varv genom alla 160 punkter. Med batchstorlek 16 är en epok alltså exakt tio uppdateringar, och datamängden blandas om inför nästa varv. Träffsäkerheten mäts på alla 160 punkter efter varje uppdatering, med 0,5 som tröskel.",
        ],
      },
      {
        heading: "Hur den är byggd",
        paragraphs: [
          "Här finns inget maskininlärningsbibliotek. Nätverket är en lista av lager, vart och ett en viktmatris av nästlade arrayer plus en biasvektor. Framåtpasset sparar varje lagers indata och aktivering, precis det som bakåtpasset behöver. Startvikterna kommer från en liten linjär kongruensgenerator, skalade med √(2 / (fan-in + fan-out)) i Xavier-initieringens anda, så ett frö ger alltid samma startnätverk. Även datamängden har ett fast frö, och därför ligger prickarna kvar när du återställer.",
          "Värmekartan utvärderar nätverket på ett rutnät om 48 × 48 varje gång vikterna ändras och blandar bärnsten och cyan efter utsignalen. Överallt där utsignalen korsar 0,5 mellan en cell och dess granne till höger eller nedanför ritas en liten gränsprick. Träningen körs i requestAnimationFrame med så många uppdateringar som den förflutna tiden och hastighetsreglaget begär. Bråkdelar förs över till nästa bildruta, så 5 uppdateringar per sekund betyder verkligen en var 0,2 sekund. Gränsen är tolv per bildruta, så att en flik i bakgrunden inte försöker ta igen allt på en gång. Förlustdiagrammet behåller de senaste 320 batchförlusterna.",
          "Ingenting rör sig av sig självt: canvasen ritas bara om när vikterna ändras, och de ändras bara efter att du har tryckt på ”kör” eller ”steg ×1”.",
        ],
        code: BACKWARD_EXCERPT,
      },
      {
        heading: "Varför särdraget x·y är en genväg",
        paragraphs: [
          "XOR är läroboksproblemet som en ensam neuron inte kan lösa, eftersom ingen rät linje skiljer de två diagonalerna åt. Det dolda lagret måste uppfinna en koordinat där klasserna blir separerbara. Topologin 3 → 8 → 8 → 1 ger bort den koordinaten: för XOR avgör tecknet på x·y redan etiketten. Jämför XOR med och utan det särdraget så ser du vad dolda lager är till för: de bygger särdrag.",
        ],
      },
    ],
    experimentsHeading: "Prova det här",
    experiments: [
      {
        title: "Skjut över dalen",
        text: "Välj två månar med 2 → 4 → 4 → 1 och sätt η till 1,0 och batchstorleken till 1. Förlustkurvan blir taggig, eftersom varje uppdatering följer en enda punkt. Sänk η till 0,1 och höj batchen till 64: långsammare, men jämnt.",
      },
      {
        title: "Ge XOR svaret",
        text: "Kör XOR med 2 → 3 → 1 och lägg märke till hur många uppdateringar som krävs för full träffsäkerhet. Byt sedan till 3 → 8 → 8 → 1. Med x·y som indata brukar hörnen skiljas åt mycket tidigare.",
      },
      {
        title: "Samma data, annan tur",
        text: "Välj cirkeluppgiften med 2 → 3 → 1, återställ några gånger och träna varje omgång. Olika frön kan landa i synligt olika gränser. Varje tanh-neuron bidrar med en mjuk ås längs en rät linje, så tre räcker precis för att stänga in ett område, och hur de ligger beror på var de började.",
      },
      {
        title: "Följ en uppdatering i taget",
        text: "Med batchstorlek 64 trycker du upprepade gånger på ”steg ×1” direkt efter en återställning. Tidiga uppdateringar flyttar hela ytan, senare flyttar mest gränsen nära felklassade punkter, där δ fortfarande är stort.",
      },
    ],
  },
  no: {
    metaDescription:
      "Tren et lite nevralt nettverk med backpropagation i nettleseren, og se beslutningsgrensen bøye seg rundt XOR, to måner og en sirkel mens tapet faller.",
    heading: "Slik fungerer denne utforskeren",
    intro:
      "Den fargede firkanten er inndataplanet til et lite nevralt nettverk, fra −1 til 1 i begge retninger. Hver prikk er et treningseksempel: rav for klasse 1, cyan for klasse 0. Den myke bakgrunnen viser hva nettverket tror akkurat nå i hvert punkt, og svake hvite prikker følger linjen der det er nøyaktig uavgjort. Trykk på «start», så dytter backpropagation litt på vektene for hver oppdatering, helt til den oppfatningen stemmer med dataene.",
    sections: [
      {
        heading: "Kjerneregelen, kjørt baklengs",
        paragraphs: [
          "Et nettverk er en kjede av enkle funksjoner. Hvert lag tar en vektet sum av inndataene sine pluss en bias og klemmer den sammen: med tanh i de skjulte lagene og med den logistiske sigmoidfunksjonen i den ene utgangen, slik at ŷ ligger mellom 0 og 1. Tapet for ett eksempel er ½(ŷ − y)².",
          "For å bli bedre må hver vekt vite hvordan tapet ville endret seg hvis den flyttet seg litt. Backpropagation svarer på det for alle vektene i ett sveip: Den beregner et feilsignal δ i utgangen og sender det bakover lag for lag. Hvert skjulte nevron summerer δ-verdiene til nevronene det mater, vektet med forbindelsene, og multipliserer med stigningen til sin egen aktivering. Gradienten til en vekt er da dens δ ganger inndataene den så i foroverpasseringen. Ideen ble skrevet ned av Seppo Linnainmaa i 1970 og ble standardmåten å trene nettverk på etter artikkelen til Rumelhart, Hinton og Williams fra 1986.",
        ],
        formula: DELTA_FORMULA,
      },
      {
        heading: "Hva kontrollene gjør",
        paragraphs: [
          "«Nettverkstopologi» velger formen: 2 → 3 → 1 har 13 parametere, standardvalget 2 → 4 → 4 → 1 har 37, og 3 → 8 → 8 → 1 har 113 pluss en tredje inngang, produktet x·y. «Leketøysoppgave» bytter mellom XOR (fire skyer i hjørnene, motsatte hjørner deler klasse), to måner som griper inn i hverandre, og en skive med radius 0,55 inne i et kvadrat.",
          "Læringsraten η skalerer hver oppdatering, fra 0,01 til 1 (standard 0,3). Batchstørrelsen, 1 til 64 (standard 16), er hvor mange av de 160 punktene som går inn i én oppdatering: Punktene stokkes, deles i batcher, og den gjennomsnittlige gradienten for hver batch brukes. «Oppdateringer / sekund», 5 til 240 (standard 60), er oppdateringstakten. «steg ×1» utfører nøyaktig én oppdatering. «tilbakestill» trekker nye vekter fra et nytt frø og beholder dataene.",
          "Merket viser to tellere. «oppdatering» teller minibatchstegene, «Epoke» teller fullførte runder gjennom alle de 160 punktene. Med batchstørrelse 16 er én epoke altså nøyaktig ti oppdateringer, og dataene stokkes på nytt før neste runde. Treffsikkerheten måles på alle de 160 punktene etter hver oppdatering, med 0,5 som terskel.",
        ],
      },
      {
        heading: "Slik er den bygget",
        paragraphs: [
          "Her finnes det ikke noe maskinlæringsbibliotek. Nettverket er en liste av lag, hvert med en vektmatrise av nestede arrayer pluss en biasvektor. Foroverpasseringen tar vare på inndataene og aktiveringen til hvert lag, akkurat det bakoverpasseringen trenger. Startvektene kommer fra en liten lineær kongruensgenerator, skalert med √(2 / (fan-in + fan-out)) i Xavier-initialiseringens ånd, så ett frø gir alltid det samme startnettverket. Dataene har også et fast frø, og derfor blir prikkene liggende når du tilbakestiller.",
          "Varmekartet evaluerer nettverket på et rutenett på 48 × 48 hver gang vektene endres, og blander rav og cyan etter utdataene. Overalt der utdataene krysser 0,5 mellom en celle og naboen til høyre eller nedenfor, tegnes en liten grenseprikk. Treningen kjører i requestAnimationFrame med så mange oppdateringer som den medgåtte tiden og hastighetsglidebryteren ber om. Brøkdeler tas med til neste bilde, så 5 oppdateringer per sekund betyr virkelig én hvert 0,2 sekund. Grensen er tolv per bilde, slik at en fane i bakgrunnen ikke prøver å ta igjen alt på én gang. Tapsdiagrammet beholder de siste 320 batchtapene.",
          "Ingenting beveger seg av seg selv: Lerretet tegnes bare på nytt når vektene endres, og de endres bare etter at du har trykket på «start» eller «steg ×1».",
        ],
        code: BACKWARD_EXCERPT,
      },
      {
        heading: "Hvorfor egenskapen x·y er en snarvei",
        paragraphs: [
          "XOR er lærebokproblemet som ett enkelt nevron ikke kan løse, fordi ingen rett linje skiller de to diagonalene. Det skjulte laget må finne opp en koordinat der klassene lar seg skille. Topologien 3 → 8 → 8 → 1 gir bort den koordinaten: For XOR avgjør fortegnet til x·y allerede merkelappen. Sammenlign XOR med og uten den egenskapen, så ser du hva skjulte lag er til for: De bygger egenskaper.",
        ],
      },
    ],
    experimentsHeading: "Prøv dette",
    experiments: [
      {
        title: "Skyt over dalen",
        text: "Velg to måner med 2 → 4 → 4 → 1, og sett η til 1,0 og batchstørrelsen til 1. Tapskurven blir hakkete, fordi hver oppdatering følger ett enkelt punkt. Senk η til 0,1 og øk batchen til 64: tregere, men jevnt.",
      },
      {
        title: "Gi XOR svaret",
        text: "Kjør XOR med 2 → 3 → 1 og legg merke til hvor mange oppdateringer som trengs for full treffsikkerhet. Bytt så til 3 → 8 → 8 → 1. Med x·y som inndata blir hjørnene som regel skilt mye tidligere.",
      },
      {
        title: "Samme data, annen flaks",
        text: "Velg sirkeloppgaven med 2 → 3 → 1, tilbakestill noen ganger og tren hver runde. Ulike frø kan lande på synlig forskjellige grenser. Hvert tanh-nevron bidrar med én myk rygg langs en rett linje, så tre er akkurat nok til å stenge inne et område, og hvordan de ligger, avhenger av hvor de startet.",
      },
      {
        title: "Følg én oppdatering om gangen",
        text: "Med batchstørrelse 64 trykker du gjentatte ganger på «steg ×1» rett etter en tilbakestilling. Tidlige oppdateringer flytter hele flaten, senere flytter mest grensen nær feilklassifiserte punkter, der δ fortsatt er stor.",
      },
    ],
  },
};
