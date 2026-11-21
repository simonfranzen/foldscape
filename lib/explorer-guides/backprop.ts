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
        formula:
          "\\delta^{(l)} = \\big(W^{(l+1)\\top} \\delta^{(l+1)}\\big) \\odot \\big(1 - a^{(l)} \\odot a^{(l)}\\big), \\qquad \\frac{\\partial \\mathcal{L}}{\\partial W^{(l)}} = \\delta^{(l)} \\, a^{(l-1)\\top}",
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "Topology chooses the shape: 2 → 3 → 1 has 13 parameters, the default 2 → 4 → 4 → 1 has 37, and 3 → 8 → 8 → 1 has 113 plus a third input, the product x·y. Toy task switches between XOR (four corner blobs, opposite corners share a class), two interlocking moons, and a disc of radius 0.55 inside a square.",
          "Learning rate η scales every update, from 0.01 to 1 (default 0.3). Batch size, 1 to 64 (default 16), is how many of the 160 points go into one update: the points are shuffled, cut into batches, and the averaged gradient of each batch is applied. Updates per second, 5 to 240 (default 60), is the update rate. Step ×1 applies exactly one update. Reset draws fresh weights from a new seed and keeps the data.",
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
        formula:
          "\\delta^{(l)} = \\big(W^{(l+1)\\top} \\delta^{(l+1)}\\big) \\odot \\big(1 - a^{(l)} \\odot a^{(l)}\\big), \\qquad \\frac{\\partial \\mathcal{L}}{\\partial W^{(l)}} = \\delta^{(l)} \\, a^{(l-1)\\top}",
      },
      {
        heading: "Was die Regler bewirken",
        paragraphs: [
          "Die Topologie legt die Form fest: 2 → 3 → 1 hat 13 Parameter, die Voreinstellung 2 → 4 → 4 → 1 hat 37, und 3 → 8 → 8 → 1 hat 113 und dazu einen dritten Eingang, das Produkt x·y. Die Spielaufgabe wechselt zwischen XOR (vier Wolken in den Ecken, gegenüberliegende Ecken teilen sich eine Klasse), zwei verschränkten Monden und einer Kreisscheibe mit Radius 0,55 in einem Quadrat.",
          "Die Lernrate η skaliert jedes Update, von 0,01 bis 1 (Voreinstellung 0,3). Die Batchgröße, 1 bis 64 (Voreinstellung 16), sagt, wie viele der 160 Punkte in ein Update eingehen: Die Punkte werden gemischt, in Batches geschnitten, und der gemittelte Gradient jedes Batches wird angewendet. Updates pro Sekunde, 5 bis 240 (Voreinstellung 60), ist die Update-Rate. Schritt ×1 führt genau ein Update aus. Zurücksetzen würfelt neue Gewichte mit neuem Seed und behält die Daten.",
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
};
