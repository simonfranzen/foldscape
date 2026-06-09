"use client";

import Link from "next/link";
import { StoryPageShell, StoryCard } from "@/components/StoryPageShell";
import { Reveal } from "@/components/Reveal";
import { useI18n } from "@/lib/i18n/context";
import { BackpropMiniNet } from "@/components/BackpropMiniNet";
import { BackpropSignatureHero } from "@/components/signature/BackpropSignatureHero";
import type { Locale } from "@/lib/i18n/types";
import type { StoryPage } from "@/lib/i18n/stories";

const ACCENT = "text-signal-teal";

// --------------------------------------------------------------------------
// Inline RichStory: hero + encounter cards + six narrative sections +
// captions for the inline BackpropMiniNet + closing CTA. All 8 site
// locales authored here so the prose doesn't bleed into the shared bundle.
// --------------------------------------------------------------------------

type RichStory = {
  page: Omit<StoryPage, "sections">;
  encounter: {
    pretitle: string;
    title: string;
    cards: Array<{ label: string; title: string; body: string }>;
    tryIt: string;
  };
  sections: Array<{ pretitle: string; title: string; body: string }>;
  miniCaption: string;
  miniStep: string;
  miniTrain: string;
  miniReset: string;
  miniLossLabel: string;
  miniStepCounter: string;
  miniHint: string;
  miniLayerLabels: [string, string, string];
  closingPretitle: string;
  closingTitle: string;
  closingBody: string;
  ctaLabel: string;
};

// ---------------- English ----------------
const en: RichStory = {
  page: {
    pretitle: "Topic · Analysis",
    title: "Backpropagation",
    tagline: "One algorithm, calculus walked backwards, every neural network you've ever heard of.",
    intro:
      "Show a network a picture; it guesses. Measure how wrong the guess was; that number is the loss. Backprop walks the chain rule backwards through every layer to ask, for each one of the millions of weights, the same question: if I had nudged you up a tiny bit, would the loss have gone up or down? Then it nudges every weight in the direction that lowers the loss. Repeat a billion times. That single trick is GPT, AlphaFold, image generators, speech recognition — the entire modern AI boom on one mathematical idea.",
    ctaInteractive: "→ Open the Explorer",
  },
  encounter: {
    pretitle: "First encounter",
    title: "Calculus, walked backwards through a network.",
    cards: [
      {
        label: "01",
        title: "The big idea",
        body: "A neural network is a giant differentiable function from input to output, with millions of dials (weights) inside. Pick any output mistake, and the chain rule tells you exactly which dials to turn, in which direction, by how much. Backpropagation is that calculation, implemented as one efficient pass from the output back to the input. Every weight learns from every example, simultaneously.",
      },
      {
        label: "02",
        title: "A concrete example",
        body: "You want a net that outputs 1 for the XOR of two bits and 0 otherwise. Start with random weights — the net guesses garbage. Compare guess to truth, get a loss. Backprop tells each weight: 'lower yourself by 0.03', 'raise yourself by 0.11', and so on. After a few hundred such mini-corrections, the same network outputs 0.98 instead of 0.4, and 0.02 instead of 0.6. It has learned the rule no single neuron could ever encode alone.",
      },
      {
        label: "03",
        title: "Why it matters",
        body: "Backprop is almost embarrassingly simple — it is high-school chain rule plus the discipline to evaluate it once, layer by layer. But every modern AI system is the same algorithm at a different scale. From 1986's tiny networks to 2026's trillion-parameter models, nothing about the update rule has changed. The hardware grew, the data grew, the network grew. The math stayed.",
      },
    ],
    tryIt: "Train a tiny 2-2-1 network on XOR right here, step by step.",
  },
  sections: [
    {
      pretitle: "Section 01 · The problem",
      title: "Why a network needs to learn",
      body: "A neural network is just a stack of linear maps separated by simple nonlinearities like sigmoid or ReLU. With the right weights it can approximate any function — that is the universal approximation theorem. The catch is the words 'with the right weights'. For any nontrivial task, the right weights are sitting in a million-dimensional haystack and no amount of analytical work will find them. They have to be learned from examples: shown an input, shown the desired output, allowed to adjust. Backpropagation is the adjustment rule that makes this possible at scale.",
    },
    {
      pretitle: "Section 02 · The forward pass",
      title: "What the network thinks the answer is",
      body: "Feed the input vector x into the first layer. Each neuron computes a weighted sum of its inputs, adds a bias, and pushes the result through its activation function. The outputs of layer 1 become the inputs of layer 2; the outputs of layer 2 become the inputs of layer 3; and so on. By the time you reach the output layer, the network has produced its current guess ŷ. No learning yet — just a long chain of multiplications and additions. The forward pass is fast and embarrassingly parallel; on a GPU it is one matrix multiply per layer.",
    },
    {
      pretitle: "Section 03 · The loss",
      title: "How wrong it was",
      body: "Compare the network's guess ŷ to the truth y and collapse the comparison into a single number L — the loss. For regression, L is the squared error (ŷ − y)². For classification, L is the cross-entropy −Σy·log ŷ. The loss is a scalar function of every weight in the network: change any weight, and L changes. The whole goal of training is to find weights that make L small. We cannot solve that minimisation directly — the landscape has too many dimensions — but we can compute the slope of L with respect to each weight, and follow it downhill.",
    },
    {
      pretitle: "Section 04 · The chain rule, walked backwards",
      title: "How a tiny nudge propagates",
      body: "The loss depends on the output, the output depends on the last layer's weights and its inputs, and those inputs depend on the previous layer's weights, recursively all the way to the input. The chain rule says: multiply the local derivatives along the path. Backprop is the bookkeeping that does this efficiently — one pass from the output back to the input, reusing each layer's already-computed activations and gradients. The result, for every weight w in the network, is ∂L/∂w: how much the loss would change if you nudged w by an infinitesimal amount. Linnainmaa wrote this down in a Finnish master's thesis in 1970; Rumelhart, Hinton and Williams gave it the modern form and the name in 1986.",
    },
    {
      pretitle: "Section 05 · The update",
      title: "Gradient descent — one tiny step downhill",
      body: "Once you have ∂L/∂w for every weight, the update is straightforward: w ← w − η ∂L/∂w. Here η is the learning rate, a small positive number — typically 10⁻³ to 10⁻¹. Each step nudges every weight in the direction that locally lowers the loss, by an amount proportional to that direction's steepness. Do this once per mini-batch of examples, run for thousands of epochs, and the network's loss falls from random-guess (around 0.7 in nats for classification) down to near-zero. The landscape it descends is famously non-convex — full of saddles, plateaus, narrow ravines — but in practice gradient descent (plus its momentum-based cousins Adam and RMSProp) finds usable minima with reliability that still puzzles theorists.",
    },
    {
      pretitle: "Section 06 · From this to GPT",
      title: "Scaling the same algorithm",
      body: "The 1986 paper trained nets with a few hundred weights to recognise simple shapes. GPT-4 has on the order of a trillion. Nothing about the chain rule changed. What changed is the substrate: GPUs and TPUs make each forward and backward pass a stack of tensor contractions that can run at hundreds of teraflops; mixed-precision arithmetic, gradient checkpointing, ZeRO sharding, and a dozen other tricks let you fit huge models into finite memory; and the data, scraped from the open internet, finally became plentiful enough to justify the parameter count. Same algorithm, four orders of magnitude more compute. That is the whole story of the deep-learning revolution — backprop, just scaled.",
    },
  ],
  miniCaption: "Mini-net · 2 inputs → 2 hidden → 1 output · learning XOR",
  miniStep: "Step ×1",
  miniTrain: "Train ×200",
  miniReset: "↺ reset",
  miniLossLabel: "Loss",
  miniStepCounter: "Steps",
  miniHint:
    "Edge thickness encodes |w|, amber means positive, cyan negative. Click Step a few times to see weights drift; Train ×200 watches the loss collapse from ~0.25 toward zero as the four XOR predictions snap into 0/1. Reset re-randomises and you can race the same descent again.",
  miniLayerLabels: ["input", "hidden", "output"],
  closingPretitle: "See it train",
  closingTitle: "Open the Explorer.",
  closingBody:
    "The Explorer lets you choose a network topology, pick a toy task (XOR, two moons, circle-vs-square), drag the learning rate, and watch the decision boundary form in real time. The same algorithm that powers every transformer, training inside your browser tab.",
  ctaLabel: "→ Open the Explorer",
};

// ---------------- Deutsch ----------------
const de: RichStory = {
  page: {
    pretitle: "Thema · Analysis",
    title: "Backpropagation",
    tagline:
      "Ein Algorithmus — Analysis rückwärts gelaufen — und jedes neuronale Netz, von dem du je gehört hast.",
    intro:
      "Zeig einem Netz ein Bild; es rät. Miss, wie falsch der Tipp war; diese Zahl ist der Verlust. Backprop läuft die Kettenregel rückwärts durch jede Schicht und stellt zu jedem der Millionen Gewichte dieselbe Frage: hätte ich dich ein winziges Stück hochgeschoben, wäre der Verlust gestiegen oder gesunken? Dann verschiebt es jedes Gewicht in die Richtung, die den Verlust senkt. Eine Milliarde Mal. Dieser eine Trick ist GPT, AlphaFold, Bildgeneratoren, Spracherkennung — der gesamte moderne KI-Boom auf einer mathematischen Idee.",
    ctaInteractive: "→ Zum Explorer",
  },
  encounter: {
    pretitle: "Erste Begegnung",
    title: "Analysis, rückwärts durch ein Netzwerk gelaufen.",
    cards: [
      {
        label: "01",
        title: "Die große Idee",
        body: "Ein neuronales Netz ist eine riesige differenzierbare Funktion von Eingabe zu Ausgabe, mit Millionen Stellschrauben (Gewichten) im Inneren. Nimm einen beliebigen Ausgabefehler, und die Kettenregel sagt dir genau, welche Schrauben du drehen sollst, in welche Richtung, um wie viel. Backpropagation ist genau diese Rechnung, umgesetzt als ein effizienter Durchlauf von der Ausgabe zurück zur Eingabe. Jedes Gewicht lernt aus jedem Beispiel, gleichzeitig.",
      },
      {
        label: "02",
        title: "Ein konkretes Beispiel",
        body: "Du willst ein Netz, das beim XOR zweier Bits eine 1 ausgibt und sonst eine 0. Starte mit zufälligen Gewichten — das Netz rät Müll. Vergleiche Tipp mit Wahrheit, berechne den Verlust. Backprop sagt jedem Gewicht: „senke dich um 0,03“, „erhöhe dich um 0,11“, und so weiter. Nach ein paar hundert solcher Mini-Korrekturen gibt das Netz 0,98 statt 0,4 aus und 0,02 statt 0,6. Es hat die Regel gelernt, die kein einzelnes Neuron je allein kodieren könnte.",
      },
      {
        label: "03",
        title: "Warum es wichtig ist",
        body: "Backprop ist fast peinlich einfach — Schulmathematik (Kettenregel) plus die Disziplin, sie genau einmal Schicht für Schicht auszuwerten. Aber jedes moderne KI-System ist derselbe Algorithmus auf anderer Skala. Von den winzigen Netzen von 1986 zu den Billionen-Parameter-Modellen von 2026 hat sich an der Update-Regel nichts geändert. Die Hardware ist gewachsen, die Daten sind gewachsen, das Netz ist gewachsen. Die Mathematik blieb.",
      },
    ],
    tryIt: "Trainiere hier ein winziges 2-2-1-Netz auf XOR, Schritt für Schritt.",
  },
  sections: [
    {
      pretitle: "Abschnitt 01 · Das Problem",
      title: "Warum ein Netz lernen muss",
      body: "Ein neuronales Netz ist nur ein Stapel linearer Abbildungen, getrennt durch einfache Nichtlinearitäten wie Sigmoid oder ReLU. Mit den richtigen Gewichten kann es jede Funktion approximieren — das ist der universelle Approximationssatz. Der Haken steckt in „mit den richtigen Gewichten“. Für jede nichttriviale Aufgabe liegen die richtigen Gewichte in einem millionendimensionalen Heuhaufen, und keine analytische Arbeit findet sie. Sie müssen aus Beispielen gelernt werden: eine Eingabe zeigen, die gewünschte Ausgabe zeigen, Anpassung zulassen. Backpropagation ist die Anpassungsregel, die das im großen Maßstab ermöglicht.",
    },
    {
      pretitle: "Abschnitt 02 · Der Vorwärtsdurchlauf",
      title: "Was das Netz für die Antwort hält",
      body: "Füttere den Eingabevektor x in die erste Schicht. Jedes Neuron berechnet eine gewichtete Summe seiner Eingaben, addiert einen Bias und schickt das Ergebnis durch seine Aktivierungsfunktion. Die Ausgaben von Schicht 1 werden zu den Eingaben von Schicht 2; die von Schicht 2 zu denen von Schicht 3; und so weiter. Erreichst du die Ausgabeschicht, hat das Netz seinen aktuellen Tipp ŷ produziert. Noch kein Lernen — nur eine lange Kette von Multiplikationen und Additionen. Der Vorwärtsdurchlauf ist schnell und peinlich parallel; auf einer GPU ist er eine Matrixmultiplikation pro Schicht.",
    },
    {
      pretitle: "Abschnitt 03 · Der Verlust",
      title: "Wie falsch das war",
      body: "Vergleiche den Tipp ŷ mit der Wahrheit y und kondensiere den Vergleich auf eine einzige Zahl L — den Verlust. Bei Regression ist L der quadratische Fehler (ŷ − y)². Bei Klassifikation ist L die Kreuzentropie −Σy·log ŷ. Der Verlust ist eine skalare Funktion jedes Gewichts im Netz: änderst du irgendein Gewicht, ändert sich L. Das ganze Ziel des Trainings ist, Gewichte zu finden, die L klein machen. Diese Minimierung können wir nicht direkt lösen — die Landschaft hat zu viele Dimensionen — aber wir können die Steigung von L bezüglich jedes Gewichts berechnen und ihr bergab folgen.",
    },
    {
      pretitle: "Abschnitt 04 · Die Kettenregel, rückwärts",
      title: "Wie sich ein winziger Schub fortpflanzt",
      body: "Der Verlust hängt von der Ausgabe ab, die Ausgabe von den Gewichten der letzten Schicht und ihren Eingaben, jene Eingaben von den Gewichten der vorletzten Schicht — rekursiv bis zurück zur Eingabe. Die Kettenregel sagt: multipliziere die lokalen Ableitungen entlang des Pfades. Backprop ist die Buchhaltung, die das effizient erledigt — ein Durchlauf von der Ausgabe zurück zur Eingabe, jede Schicht nutzt ihre bereits berechneten Aktivierungen und Gradienten wieder. Das Ergebnis ist für jedes Gewicht w im Netz ∂L/∂w: wie viel sich der Verlust ändern würde, wenn du w um einen infinitesimalen Betrag verschiebst. Linnainmaa schrieb das 1970 in einer finnischen Masterarbeit auf; Rumelhart, Hinton und Williams gaben ihm 1986 die moderne Form und den Namen.",
    },
    {
      pretitle: "Abschnitt 05 · Das Update",
      title: "Gradientenabstieg — ein winziger Schritt bergab",
      body: "Hast du ∂L/∂w für jedes Gewicht, ist das Update geradeaus: w ← w − η ∂L/∂w. η ist die Lernrate, eine kleine positive Zahl — typisch 10⁻³ bis 10⁻¹. Jeder Schritt schiebt jedes Gewicht in die Richtung, die den Verlust lokal senkt, proportional zur Steilheit dieser Richtung. Tu das einmal pro Mini-Batch von Beispielen, lass es tausende Epochen laufen, und der Verlust des Netzes fällt vom Zufallsraten (etwa 0,7 nats bei Klassifikation) auf nahezu null. Die Landschaft, durch die es absteigt, ist berüchtigt nichtkonvex — voller Sättel, Plateaus und enger Schluchten — aber in der Praxis findet Gradientenabstieg (samt seinen impulsbasierten Verwandten Adam und RMSProp) brauchbare Minima mit einer Verlässlichkeit, die Theoretiker:innen bis heute rätseln lässt.",
    },
    {
      pretitle: "Abschnitt 06 · Von hier zu GPT",
      title: "Denselben Algorithmus skalieren",
      body: "Das Paper von 1986 trainierte Netze mit ein paar hundert Gewichten, um einfache Formen zu erkennen. GPT-4 hat in der Größenordnung von einer Billion. An der Kettenregel hat sich nichts geändert. Was sich geändert hat, ist das Substrat: GPUs und TPUs machen aus jedem Vor- und Rückwärtsdurchlauf einen Stapel von Tensorkontraktionen, der mit hunderten Teraflops laufen kann; gemischte Präzision, Gradient-Checkpointing, ZeRO-Sharding und ein Dutzend weiterer Tricks lassen riesige Modelle in endlichen Speicher passen; und die Daten, aus dem offenen Internet zusammengekratzt, wurden endlich reichlich genug, um die Parameterzahl zu rechtfertigen. Derselbe Algorithmus, vier Größenordnungen mehr Rechenkraft. Das ist die ganze Geschichte der Deep-Learning-Revolution — Backprop, einfach skaliert.",
    },
  ],
  miniCaption: "Mini-Netz · 2 Eingaben → 2 versteckt → 1 Ausgabe · lernt XOR",
  miniStep: "Schritt ×1",
  miniTrain: "Trainiere ×200",
  miniReset: "↺ zurücksetzen",
  miniLossLabel: "Verlust",
  miniStepCounter: "Schritte",
  miniHint:
    "Kantendicke kodiert |w|, Bernstein steht für positiv, Zyan für negativ. Klicke ein paar Mal auf Schritt, um zu sehen, wie die Gewichte driften; Trainiere ×200 zeigt, wie der Verlust von etwa 0,25 gegen null kollabiert, während die vier XOR-Vorhersagen auf 0/1 einrasten. Zurücksetzen randomisiert neu, und du kannst denselben Abstieg noch einmal sehen.",
  miniLayerLabels: ["Eingabe", "versteckt", "Ausgabe"],
  closingPretitle: "Schau zu beim Trainieren",
  closingTitle: "Öffne den Explorer.",
  closingBody:
    "Der Explorer lässt dich eine Netztopologie wählen, eine Spielaufgabe (XOR, zwei Monde, Kreis-gegen-Quadrat), die Lernrate ziehen und in Echtzeit zusehen, wie die Entscheidungsgrenze entsteht. Derselbe Algorithmus, der jeden Transformer antreibt, trainiert in deinem Browser-Tab.",
  ctaLabel: "→ Zum Explorer",
};

// ---------------- Español ----------------
const es: RichStory = {
  page: {
    pretitle: "Tema · Análisis",
    title: "Retropropagación",
    tagline: "Un algoritmo — cálculo recorrido al revés — y todas las redes neuronales que existen.",
    intro:
      "Muéstrale una imagen a una red; adivina. Mide cuán equivocada estuvo; ese número es la pérdida. Backprop recorre la regla de la cadena hacia atrás por cada capa y le pregunta a cada uno de los millones de pesos lo mismo: si te hubiera empujado un poquito hacia arriba, ¿la pérdida habría subido o bajado? Luego mueve cada peso en la dirección que la baja. Repite mil millones de veces. Ese único truco es GPT, AlphaFold, los generadores de imágenes, el reconocimiento de voz — todo el boom moderno de la IA sobre una idea matemática.",
    ctaInteractive: "→ Abrir el Explorador",
  },
  encounter: {
    pretitle: "Primer encuentro",
    title: "Cálculo, recorrido al revés por una red.",
    cards: [
      {
        label: "01",
        title: "La idea central",
        body: "Una red neuronal es una función diferenciable enorme, de entrada a salida, con millones de mandos (los pesos) dentro. Toma cualquier error de salida, y la regla de la cadena te dice exactamente qué mandos girar, en qué dirección, cuánto. La retropropagación es ese cálculo, implementado como una sola pasada eficiente desde la salida hasta la entrada. Cada peso aprende de cada ejemplo, a la vez.",
      },
      {
        label: "02",
        title: "Un ejemplo concreto",
        body: "Quieres una red que dé 1 con el XOR de dos bits y 0 en otro caso. Empieza con pesos al azar — la red devuelve basura. Compara la respuesta con la verdad, calcula la pérdida. Backprop le dice a cada peso: «bájate 0,03», «súbete 0,11», y así. Tras unos cientos de mini-correcciones, la misma red devuelve 0,98 en vez de 0,4 y 0,02 en vez de 0,6. Ha aprendido la regla que ninguna neurona aislada podría codificar.",
      },
      {
        label: "03",
        title: "Por qué importa",
        body: "Backprop es casi vergonzosamente sencillo — la regla de la cadena de bachillerato más la disciplina de evaluarla una sola vez, capa por capa. Pero todo sistema moderno de IA es el mismo algoritmo a otra escala. De las redes diminutas de 1986 a los modelos de billones de parámetros de 2026, la regla de actualización no ha cambiado. Creció el hardware, crecieron los datos, creció la red. La matemática se quedó.",
      },
    ],
    tryIt: "Entrena aquí mismo una red 2-2-1 sobre XOR, paso a paso.",
  },
  sections: [
    {
      pretitle: "Sección 01 · El problema",
      title: "Por qué una red necesita aprender",
      body: "Una red neuronal es solo una pila de aplicaciones lineales separadas por no linealidades sencillas como sigmoide o ReLU. Con los pesos adecuados puede aproximar cualquier función — es el teorema de aproximación universal. La trampa está en «los pesos adecuados». Para cualquier tarea no trivial, esos pesos viven en un pajar de millones de dimensiones y ninguna cantidad de trabajo analítico los encontrará. Hay que aprenderlos de ejemplos: mostrar una entrada, mostrar la salida deseada, permitir el ajuste. La retropropagación es la regla de ajuste que hace posible eso a escala.",
    },
    {
      pretitle: "Sección 02 · El pase hacia adelante",
      title: "Lo que la red cree que es la respuesta",
      body: "Mete el vector de entrada x en la primera capa. Cada neurona calcula una suma ponderada de sus entradas, suma un sesgo y pasa el resultado por su función de activación. Las salidas de la capa 1 son las entradas de la 2; las de la 2, de la 3; y así. Al llegar a la capa de salida, la red ha producido su tipi actual ŷ. Aún no hay aprendizaje — solo una larga cadena de multiplicaciones y sumas. El pase hacia adelante es rápido y vergonzosamente paralelo; en una GPU es una multiplicación de matrices por capa.",
    },
    {
      pretitle: "Sección 03 · La pérdida",
      title: "Cuán equivocada estuvo",
      body: "Compara el tipi ŷ con la verdad y, y reduce la comparación a un solo número L — la pérdida. En regresión, L es el error cuadrático (ŷ − y)². En clasificación, L es la entropía cruzada −Σy·log ŷ. La pérdida es una función escalar de cada peso de la red: cambia cualquier peso y L cambia. Todo el objetivo del entrenamiento es encontrar pesos que hagan L pequeño. Esa minimización no la sabemos resolver directamente — el paisaje tiene demasiadas dimensiones — pero podemos calcular la pendiente de L respecto a cada peso y seguirla cuesta abajo.",
    },
    {
      pretitle: "Sección 04 · La regla de la cadena, hacia atrás",
      title: "Cómo se propaga un empujón diminuto",
      body: "La pérdida depende de la salida, la salida de los pesos de la última capa y sus entradas, esas entradas de los pesos de la capa previa, recursivamente hasta la entrada. La regla de la cadena dice: multiplica las derivadas locales a lo largo del camino. Backprop es la contabilidad que hace eso eficiente — una pasada desde la salida hacia la entrada, reutilizando las activaciones y gradientes ya calculados en cada capa. El resultado, para cada peso w, es ∂L/∂w: cuánto cambiaría L si empujaras w una cantidad infinitesimal. Linnainmaa lo escribió en una tesis de máster finlandesa en 1970; Rumelhart, Hinton y Williams le dieron la forma moderna y el nombre en 1986.",
    },
    {
      pretitle: "Sección 05 · La actualización",
      title: "Descenso de gradiente — un pasito cuesta abajo",
      body: "Con ∂L/∂w para cada peso, la actualización es directa: w ← w − η ∂L/∂w. Aquí η es la tasa de aprendizaje, un número positivo pequeño — típicamente 10⁻³ a 10⁻¹. Cada paso desplaza cada peso en la dirección que baja la pérdida localmente, en cantidad proporcional a la pendiente. Hazlo una vez por mini-lote de ejemplos, ejecútalo durante miles de épocas y la pérdida cae desde el azar (cerca de 0,7 nats en clasificación) hasta casi cero. El paisaje por el que desciende es famoso por ser no convexo — lleno de sillas, mesetas, barrancos estrechos — pero en la práctica el descenso de gradiente (junto con sus primos con momento Adam y RMSProp) encuentra mínimos útiles con una fiabilidad que aún desconcierta a los teóricos.",
    },
    {
      pretitle: "Sección 06 · De aquí a GPT",
      title: "Escalar el mismo algoritmo",
      body: "El artículo de 1986 entrenaba redes con unos cientos de pesos para reconocer formas sencillas. GPT-4 tiene del orden de un billón. Nada cambió en la regla de la cadena. Cambió el sustrato: GPUs y TPUs convierten cada pase, hacia adelante y hacia atrás, en una pila de contracciones tensoriales que corren a cientos de teraflops; precisión mixta, checkpointing de gradientes, sharding ZeRO y una docena de trucos más permiten meter modelos enormes en memoria finita; y los datos, raspados de internet abierto, por fin se hicieron abundantes para justificar los parámetros. Mismo algoritmo, cuatro órdenes de magnitud más cómputo. Esa es toda la historia de la revolución del aprendizaje profundo — backprop, simplemente a escala.",
    },
  ],
  miniCaption: "Mini-red · 2 entradas → 2 ocultas → 1 salida · aprendiendo XOR",
  miniStep: "Paso ×1",
  miniTrain: "Entrenar ×200",
  miniReset: "↺ reiniciar",
  miniLossLabel: "Pérdida",
  miniStepCounter: "Pasos",
  miniHint:
    "El grosor de cada arista codifica |w|, ámbar es positivo, cian negativo. Pulsa Paso varias veces para ver los pesos moverse; Entrenar ×200 muestra cómo la pérdida cae de ~0,25 hacia cero a medida que las cuatro predicciones del XOR se ajustan a 0/1. Reiniciar vuelve a aleatorizar y puedes correr el mismo descenso de nuevo.",
  miniLayerLabels: ["entrada", "oculta", "salida"],
  closingPretitle: "Velo entrenar",
  closingTitle: "Abre el Explorador.",
  closingBody:
    "El Explorador te deja elegir una topología de red, una tarea de juguete (XOR, dos lunas, círculo-vs-cuadrado), arrastrar la tasa de aprendizaje y mirar la frontera de decisión formarse en tiempo real. El mismo algoritmo que alimenta cada transformer, entrenando en una pestaña de tu navegador.",
  ctaLabel: "→ Abrir el Explorador",
};

// ---------------- Français ----------------
const fr: RichStory = {
  page: {
    pretitle: "Sujet · Analyse",
    title: "Rétropropagation",
    tagline:
      "Un algorithme — l'analyse remontée à l'envers — et tous les réseaux de neurones que tu connais.",
    intro:
      "Montre une image à un réseau ; il devine. Mesure à quel point il s'est trompé ; ce nombre est la perte. La rétropropagation remonte la règle de la chaîne à l'envers à travers chaque couche pour poser à chacun des millions de poids la même question : si je t'avais poussé un tout petit peu vers le haut, la perte aurait-elle monté ou baissé ? Puis elle pousse chaque poids dans la direction qui baisse la perte. Répète un milliard de fois. Ce seul tour, c'est GPT, AlphaFold, les générateurs d'images, la reconnaissance vocale — tout l'essor moderne de l'IA sur une seule idée mathématique.",
    ctaInteractive: "→ Ouvrir l'Explorer",
  },
  encounter: {
    pretitle: "Première rencontre",
    title: "L'analyse, remontée à l'envers à travers un réseau.",
    cards: [
      {
        label: "01",
        title: "L'idée centrale",
        body: "Un réseau de neurones est une grande fonction différentiable, de l'entrée à la sortie, avec des millions de molettes (les poids) à l'intérieur. Prends n'importe quelle erreur de sortie : la règle de la chaîne te dit exactement quelles molettes tourner, dans quel sens, de combien. La rétropropagation est ce calcul, implémenté en une seule passe efficace de la sortie vers l'entrée. Chaque poids apprend de chaque exemple, en même temps.",
      },
      {
        label: "02",
        title: "Un exemple concret",
        body: "Tu veux un réseau qui sort 1 pour le XOR de deux bits et 0 sinon. Démarre avec des poids aléatoires — le réseau renvoie n'importe quoi. Compare la sortie à la vérité, calcule la perte. Backprop dit à chaque poids : « baisse-toi de 0,03 », « monte-toi de 0,11 », etc. Après quelques centaines de mini-corrections, le même réseau renvoie 0,98 au lieu de 0,4 et 0,02 au lieu de 0,6. Il a appris la règle qu'aucun neurone seul ne saurait encoder.",
      },
      {
        label: "03",
        title: "Pourquoi cela compte",
        body: "La rétropropagation est presque embarrassante de simplicité — la règle de la chaîne du lycée plus la discipline de l'évaluer une fois, couche par couche. Mais chaque système moderne d'IA, c'est le même algorithme à une autre échelle. Des minuscules réseaux de 1986 aux modèles à mille milliards de paramètres de 2026, la règle de mise à jour n'a pas changé. Le matériel a grandi, les données ont grandi, le réseau a grandi. La mathématique est restée.",
      },
    ],
    tryIt: "Entraîne ici même un mini-réseau 2-2-1 sur XOR, pas à pas.",
  },
  sections: [
    {
      pretitle: "Section 01 · Le problème",
      title: "Pourquoi un réseau doit apprendre",
      body: "Un réseau de neurones n'est qu'un empilement d'applications linéaires séparées par des non-linéarités simples comme sigmoïde ou ReLU. Avec les bons poids il peut approcher n'importe quelle fonction — c'est le théorème d'approximation universelle. Le piège est dans « les bons poids ». Pour toute tâche non triviale, ces poids vivent dans une botte de foin à plusieurs millions de dimensions et aucun travail analytique ne les y trouvera. Ils doivent être appris à partir d'exemples : montre une entrée, montre la sortie souhaitée, autorise l'ajustement. La rétropropagation est la règle d'ajustement qui rend cela possible à grande échelle.",
    },
    {
      pretitle: "Section 02 · La passe avant",
      title: "Ce que le réseau croit être la réponse",
      body: "Injecte le vecteur d'entrée x dans la première couche. Chaque neurone calcule une somme pondérée de ses entrées, ajoute un biais et fait passer le résultat dans sa fonction d'activation. Les sorties de la couche 1 deviennent les entrées de la couche 2 ; celles de la 2, les entrées de la 3 ; et ainsi de suite. Arrivé à la couche de sortie, le réseau a produit sa prédiction actuelle ŷ. Pas encore d'apprentissage — juste une longue chaîne de multiplications et d'additions. La passe avant est rapide et embarrassamment parallèle ; sur un GPU c'est une multiplication matricielle par couche.",
    },
    {
      pretitle: "Section 03 · La perte",
      title: "À quel point il s'est trompé",
      body: "Compare la prédiction ŷ à la vérité y et réduis la comparaison à un seul nombre L — la perte. En régression, L est l'erreur quadratique (ŷ − y)². En classification, L est l'entropie croisée −Σy·log ŷ. La perte est une fonction scalaire de chaque poids du réseau : change un poids quelconque, L change. Tout le but de l'entraînement est de trouver des poids qui rendent L petit. On ne sait pas résoudre cette minimisation directement — le paysage a trop de dimensions — mais on sait calculer la pente de L par rapport à chaque poids, et la suivre vers le bas.",
    },
    {
      pretitle: "Section 04 · La règle de la chaîne, à l'envers",
      title: "Comment un infime poussée se propage",
      body: "La perte dépend de la sortie, la sortie dépend des poids de la dernière couche et de ses entrées, ces entrées dépendent des poids de la couche précédente, récursivement jusqu'à l'entrée. La règle de la chaîne dit : multiplie les dérivées locales le long du chemin. Backprop est la comptabilité qui fait cela efficacement — une passe de la sortie vers l'entrée, réutilisant les activations et les gradients déjà calculés à chaque couche. Le résultat, pour chaque poids w, est ∂L/∂w : de combien la perte changerait si tu poussais w d'une quantité infinitésimale. Linnainmaa l'a écrit dans un mémoire de master finlandais en 1970 ; Rumelhart, Hinton et Williams lui ont donné sa forme moderne et son nom en 1986.",
    },
    {
      pretitle: "Section 05 · La mise à jour",
      title: "Descente de gradient — un tout petit pas vers le bas",
      body: "Une fois ∂L/∂w connu pour chaque poids, la mise à jour est directe : w ← w − η ∂L/∂w. Ici η est le taux d'apprentissage, un petit nombre positif — typiquement 10⁻³ à 10⁻¹. Chaque pas pousse chaque poids dans la direction qui baisse la perte localement, d'une quantité proportionnelle à la pente. Fais-le une fois par mini-lot d'exemples, fais-le tourner pendant des milliers d'époques et la perte du réseau tombe du tirage au sort (environ 0,7 nats en classification) à presque zéro. Le paysage qu'elle descend est célèbrement non convexe — plein de selles, de plateaux, de ravins étroits — mais en pratique la descente de gradient (et ses cousins à momentum Adam et RMSProp) trouve des minima utilisables avec une fiabilité qui intrigue encore les théoriciens.",
    },
    {
      pretitle: "Section 06 · D'ici à GPT",
      title: "Mettre le même algorithme à l'échelle",
      body: "L'article de 1986 entraînait des réseaux à quelques centaines de poids pour reconnaître des formes simples. GPT-4 en a de l'ordre de mille milliards. Rien n'a changé dans la règle de la chaîne. Ce qui a changé, c'est le substrat : GPUs et TPUs font de chaque passe avant et arrière une pile de contractions tensorielles qui peut tourner à des centaines de téraflops ; précision mixte, gradient checkpointing, sharding ZeRO et une douzaine d'autres astuces font tenir d'énormes modèles dans une mémoire finie ; et les données, raclées sur Internet ouvert, sont enfin devenues assez abondantes pour justifier le nombre de paramètres. Même algorithme, quatre ordres de grandeur de calcul en plus. Voilà toute l'histoire de la révolution du deep learning — backprop, simplement à l'échelle.",
    },
  ],
  miniCaption: "Mini-réseau · 2 entrées → 2 cachés → 1 sortie · apprend XOR",
  miniStep: "Pas ×1",
  miniTrain: "Entraîner ×200",
  miniReset: "↺ réinitialiser",
  miniLossLabel: "Perte",
  miniStepCounter: "Pas",
  miniHint:
    "L'épaisseur d'une arête encode |w|, ambre pour positif, cyan pour négatif. Clique sur Pas plusieurs fois pour voir les poids dériver ; Entraîner ×200 fait s'effondrer la perte de ~0,25 vers zéro tandis que les quatre prédictions XOR s'enclenchent vers 0/1. Réinitialiser tire de nouveaux poids et tu peux relancer la même descente.",
  miniLayerLabels: ["entrée", "cachée", "sortie"],
  closingPretitle: "Vois-le s'entraîner",
  closingTitle: "Ouvre l'Explorateur.",
  closingBody:
    "L'Explorateur te laisse choisir une topologie de réseau, une tâche jouet (XOR, deux lunes, cercle-vs-carré), faire glisser le taux d'apprentissage et regarder la frontière de décision se former en temps réel. Le même algorithme qui anime chaque transformer, en train de s'entraîner dans ton onglet de navigateur.",
  ctaLabel: "→ Ouvrir l'Explorateur",
};

// ---------------- Italiano ----------------
const it: RichStory = {
  page: {
    pretitle: "Tema · Analisi",
    title: "Retropropagazione",
    tagline:
      "Un algoritmo — analisi percorsa al contrario — e ogni rete neurale di cui tu abbia mai sentito parlare.",
    intro:
      "Mostra un'immagine a una rete; tira a indovinare. Misura quanto sbaglia; quel numero è la perdita. Backprop ripercorre la regola della catena all'indietro attraverso ogni strato e a ciascuno dei milioni di pesi pone la stessa domanda: se ti avessi spinto un po' verso l'alto, la perdita sarebbe salita o scesa? Poi sposta ogni peso nella direzione che la abbassa. Ripeti un miliardo di volte. Quell'unico trucco è GPT, AlphaFold, i generatori di immagini, il riconoscimento vocale — tutto il boom moderno dell'IA su un'unica idea matematica.",
    ctaInteractive: "→ Apri l'Explorer",
  },
  encounter: {
    pretitle: "Primo incontro",
    title: "Analisi, percorsa al contrario in una rete.",
    cards: [
      {
        label: "01",
        title: "L'idea grande",
        body: "Una rete neurale è una funzione differenziabile enorme, da input a output, con milioni di manopole (i pesi) dentro. Prendi un errore di uscita qualunque: la regola della catena ti dice esattamente quali manopole girare, in quale direzione, di quanto. La retropropagazione è quel calcolo, implementato come un'unica passata efficiente dall'uscita all'ingresso. Ogni peso impara da ogni esempio, contemporaneamente.",
      },
      {
        label: "02",
        title: "Un esempio concreto",
        body: "Vuoi una rete che emetta 1 per lo XOR di due bit e 0 altrimenti. Parti con pesi casuali — la rete sputa spazzatura. Confronta tentativo con verità, ottieni la perdita. Backprop dice a ogni peso: «abbassati di 0,03», «alzati di 0,11», e così via. Dopo qualche centinaia di mini-correzioni la stessa rete emette 0,98 invece di 0,4 e 0,02 invece di 0,6. Ha imparato la regola che nessun singolo neurone potrebbe mai codificare da solo.",
      },
      {
        label: "03",
        title: "Perché conta",
        body: "Backprop è quasi imbarazzantemente semplice — la regola della catena del liceo più la disciplina di valutarla una volta sola, strato per strato. Eppure ogni sistema moderno di IA è lo stesso algoritmo a un'altra scala. Dalle reti minuscole del 1986 ai modelli con un trilione di parametri del 2026 la regola di aggiornamento non è cambiata. È cresciuto l'hardware, sono cresciuti i dati, è cresciuta la rete. La matematica è rimasta.",
      },
    ],
    tryIt: "Allena qui una piccola rete 2-2-1 sullo XOR, passo dopo passo.",
  },
  sections: [
    {
      pretitle: "Sezione 01 · Il problema",
      title: "Perché una rete deve imparare",
      body: "Una rete neurale è solo una pila di mappe lineari separate da semplici non linearità come sigmoide o ReLU. Con i pesi giusti può approssimare qualsiasi funzione — è il teorema di approssimazione universale. La fregatura sta nelle parole «con i pesi giusti». Per qualsiasi compito non banale quei pesi sono sepolti in un pagliaio a milioni di dimensioni e nessun lavoro analitico li troverà. Devono essere imparati dagli esempi: mostra un ingresso, mostra l'uscita desiderata, permetti l'aggiustamento. La retropropagazione è la regola di aggiustamento che rende tutto ciò possibile su grande scala.",
    },
    {
      pretitle: "Sezione 02 · La passata in avanti",
      title: "Cosa la rete pensa sia la risposta",
      body: "Inietta il vettore di input x nel primo strato. Ogni neurone calcola una somma pesata dei suoi ingressi, aggiunge un bias, fa passare il risultato attraverso la sua funzione di attivazione. Le uscite dello strato 1 diventano gli ingressi dello strato 2; quelle dello strato 2, gli ingressi dello strato 3; e così via. Arrivato allo strato di uscita, la rete ha prodotto la sua attuale previsione ŷ. Nessun apprendimento ancora — solo una lunga catena di moltiplicazioni e addizioni. La passata in avanti è veloce e imbarazzantemente parallela; su GPU è una moltiplicazione di matrici per strato.",
    },
    {
      pretitle: "Sezione 03 · La perdita",
      title: "Quanto ha sbagliato",
      body: "Confronta la previsione ŷ con la verità y e riduci il confronto a un singolo numero L — la perdita. In regressione, L è l'errore quadratico (ŷ − y)². In classificazione, L è l'entropia incrociata −Σy·log ŷ. La perdita è una funzione scalare di ogni peso della rete: cambia un peso qualunque e L cambia. L'intero obiettivo dell'allenamento è trovare pesi che rendano L piccolo. Quella minimizzazione non sappiamo risolverla direttamente — il paesaggio ha troppe dimensioni — ma sappiamo calcolare la pendenza di L rispetto a ogni peso e seguirla in discesa.",
    },
    {
      pretitle: "Sezione 04 · La regola della catena, al contrario",
      title: "Come si propaga una spinta infinitesima",
      body: "La perdita dipende dall'uscita, l'uscita dai pesi dell'ultimo strato e dai suoi ingressi, e quegli ingressi dai pesi dello strato precedente — ricorsivamente fino all'ingresso. La regola della catena dice: moltiplica le derivate locali lungo il percorso. Backprop è la contabilità che lo fa in modo efficiente — un'unica passata dall'uscita all'ingresso, riutilizzando attivazioni e gradienti già calcolati a ogni strato. Il risultato, per ogni peso w, è ∂L/∂w: di quanto cambierebbe la perdita se spostassi w di una quantità infinitesima. Linnainmaa lo scrisse in una tesi di master finlandese del 1970; Rumelhart, Hinton e Williams gli diedero forma moderna e nome nel 1986.",
    },
    {
      pretitle: "Sezione 05 · L'aggiornamento",
      title: "Discesa del gradiente — un passettino in discesa",
      body: "Una volta avuto ∂L/∂w per ogni peso, l'aggiornamento è immediato: w ← w − η ∂L/∂w. Qui η è il tasso di apprendimento, un piccolo numero positivo — tipicamente 10⁻³ a 10⁻¹. Ogni passo sposta ogni peso nella direzione che localmente abbassa la perdita, di una quantità proporzionale alla pendenza. Fallo una volta per mini-batch di esempi, lascia girare per migliaia di epoche e la perdita della rete scende dal tiro a indovinare (intorno a 0,7 nats in classificazione) fino quasi a zero. Il paesaggio in cui discende è notoriamente non convesso — pieno di selle, altipiani, gole strette — ma in pratica la discesa del gradiente (e i suoi cugini con momento Adam e RMSProp) trova minimi utilizzabili con un'affidabilità che ancora oggi sconcerta i teorici.",
    },
    {
      pretitle: "Sezione 06 · Da qui a GPT",
      title: "Scalare lo stesso algoritmo",
      body: "L'articolo del 1986 allenava reti con qualche centinaio di pesi a riconoscere forme semplici. GPT-4 ne ha dell'ordine di mille miliardi. Nulla è cambiato nella regola della catena. È cambiato il substrato: GPU e TPU fanno di ogni passata avanti e indietro una pila di contrazioni tensoriali che può girare a centinaia di teraflops; precisione mista, gradient checkpointing, sharding ZeRO e una dozzina di altri trucchi permettono di far stare modelli enormi in memoria finita; e i dati, raschiati da internet aperto, sono finalmente diventati abbondanti per giustificare il numero di parametri. Stesso algoritmo, quattro ordini di grandezza in più di calcolo. È tutta qui la storia della rivoluzione del deep learning — backprop, semplicemente scalato.",
    },
  ],
  miniCaption: "Mini-rete · 2 ingressi → 2 nascosti → 1 uscita · impara XOR",
  miniStep: "Passo ×1",
  miniTrain: "Allena ×200",
  miniReset: "↺ azzera",
  miniLossLabel: "Perdita",
  miniStepCounter: "Passi",
  miniHint:
    "Lo spessore di un arco codifica |w|, ambra significa positivo, ciano negativo. Clicca Passo qualche volta per vedere i pesi spostarsi; Allena ×200 mostra la perdita collassare da ~0,25 verso zero mentre le quattro previsioni XOR si incastrano su 0/1. Azzera rilancia i pesi e puoi correre di nuovo la stessa discesa.",
  miniLayerLabels: ["ingresso", "nascosto", "uscita"],
  closingPretitle: "Vedilo allenarsi",
  closingTitle: "Apri l'Esploratore.",
  closingBody:
    "L'Esploratore ti lascia scegliere una topologia di rete, un compito giocattolo (XOR, due lune, cerchio-vs-quadrato), trascinare il tasso di apprendimento e guardare la frontiera decisionale formarsi in tempo reale. Lo stesso algoritmo che alimenta ogni transformer, in allenamento nel tuo browser.",
  ctaLabel: "→ Apri l'Esploratore",
};

// ---------------- Português ----------------
const pt: RichStory = {
  page: {
    pretitle: "Tema · Análise",
    title: "Retropropagação",
    tagline:
      "Um algoritmo — cálculo percorrido ao contrário — e todas as redes neuronais que já ouviste falar.",
    intro:
      "Mostra uma imagem a uma rede; ela adivinha. Mede quão errada esteve; esse número é a perda. A retropropagação percorre a regra da cadeia para trás através de cada camada e faz a cada um dos milhões de pesos a mesma pergunta: se eu te tivesse empurrado um nadinha para cima, a perda teria subido ou descido? Depois empurra cada peso na direcção que a baixa. Repete mil milhões de vezes. Esse único truque é GPT, AlphaFold, geradores de imagens, reconhecimento de voz — todo o boom moderno da IA sobre uma única ideia matemática.",
    ctaInteractive: "→ Abrir o Explorer",
  },
  encounter: {
    pretitle: "Primeiro encontro",
    title: "Cálculo, percorrido ao contrário por uma rede.",
    cards: [
      {
        label: "01",
        title: "A ideia central",
        body: "Uma rede neuronal é uma função diferenciável enorme, da entrada à saída, com milhões de manípulos (os pesos) lá dentro. Toma qualquer erro de saída: a regra da cadeia diz-te exactamente que manípulos rodar, em que sentido, em que quantidade. A retropropagação é esse cálculo, implementado como uma única passagem eficiente da saída até à entrada. Cada peso aprende com cada exemplo, em simultâneo.",
      },
      {
        label: "02",
        title: "Um exemplo concreto",
        body: "Queres uma rede que devolva 1 para o XOR de dois bits e 0 caso contrário. Começa com pesos aleatórios — a rede devolve lixo. Compara palpite com verdade, calcula a perda. A backprop diz a cada peso: «baixa-te 0,03», «sobe 0,11», e por aí fora. Após algumas centenas de mini-correcções, a mesma rede devolve 0,98 em vez de 0,4 e 0,02 em vez de 0,6. Aprendeu a regra que nenhum neurónio sozinho conseguiria codificar.",
      },
      {
        label: "03",
        title: "Porque importa",
        body: "Backprop é quase embaraçosamente simples — a regra da cadeia do secundário mais a disciplina de a avaliar uma vez, camada a camada. Mas todo sistema moderno de IA é o mesmo algoritmo a outra escala. Das redes diminutas de 1986 aos modelos com biliões de parâmetros de 2026, a regra de actualização não mudou. O hardware cresceu, os dados cresceram, a rede cresceu. A matemática ficou.",
      },
    ],
    tryIt: "Treina aqui mesmo uma rede 2-2-1 sobre XOR, passo a passo.",
  },
  sections: [
    {
      pretitle: "Secção 01 · O problema",
      title: "Por que uma rede precisa de aprender",
      body: "Uma rede neuronal é apenas uma pilha de aplicações lineares separadas por não linearidades simples como sigmóide ou ReLU. Com os pesos certos pode aproximar qualquer função — é o teorema da aproximação universal. A armadilha está em «os pesos certos». Para qualquer tarefa não trivial esses pesos estão num palheiro com milhões de dimensões e nenhum trabalho analítico os encontrará. Têm de ser aprendidos a partir de exemplos: mostra uma entrada, mostra a saída desejada, permite o ajuste. A retropropagação é a regra de ajuste que torna isso possível em escala.",
    },
    {
      pretitle: "Secção 02 · A passagem para a frente",
      title: "O que a rede pensa ser a resposta",
      body: "Empurra o vector de entrada x para a primeira camada. Cada neurónio calcula uma soma ponderada das suas entradas, soma um viés e faz passar o resultado pela sua função de activação. As saídas da camada 1 tornam-se as entradas da camada 2; as da 2, as entradas da 3; e por aí fora. Ao chegar à camada de saída, a rede produziu o seu palpite actual ŷ. Ainda sem aprendizagem — apenas uma longa cadeia de multiplicações e somas. A passagem para a frente é rápida e embaraçosamente paralela; numa GPU é uma multiplicação de matrizes por camada.",
    },
    {
      pretitle: "Secção 03 · A perda",
      title: "Quão errada esteve",
      body: "Compara o palpite ŷ com a verdade y e colapsa a comparação num único número L — a perda. Em regressão, L é o erro quadrático (ŷ − y)². Em classificação, L é a entropia cruzada −Σy·log ŷ. A perda é uma função escalar de cada peso da rede: muda um peso qualquer e L muda. Todo o objectivo do treino é encontrar pesos que tornem L pequeno. Essa minimização não sabemos resolver directamente — a paisagem tem demasiadas dimensões — mas sabemos calcular o declive de L em relação a cada peso e segui-lo a descer.",
    },
    {
      pretitle: "Secção 04 · A regra da cadeia, ao contrário",
      title: "Como um empurrãozinho se propaga",
      body: "A perda depende da saída, a saída depende dos pesos da última camada e das suas entradas, essas entradas dependem dos pesos da camada anterior, recursivamente até à entrada. A regra da cadeia diz: multiplica as derivadas locais ao longo do caminho. A backprop é a contabilidade que faz isso de forma eficiente — uma passagem da saída para a entrada, reutilizando as activações e os gradientes já calculados em cada camada. O resultado, para cada peso w, é ∂L/∂w: quanto a perda mudaria se empurrasses w uma quantidade infinitesimal. Linnainmaa escreveu isto numa tese de mestrado finlandesa em 1970; Rumelhart, Hinton e Williams deram-lhe a forma moderna e o nome em 1986.",
    },
    {
      pretitle: "Secção 05 · A actualização",
      title: "Descida do gradiente — um passinho a descer",
      body: "Tendo ∂L/∂w para cada peso, a actualização é directa: w ← w − η ∂L/∂w. Aqui η é a taxa de aprendizagem, um número positivo pequeno — tipicamente 10⁻³ a 10⁻¹. Cada passo empurra cada peso na direcção que baixa a perda localmente, numa quantidade proporcional ao declive. Faz isso uma vez por mini-lote de exemplos, deixa correr durante milhares de épocas e a perda da rede cai do palpite aleatório (cerca de 0,7 nats em classificação) até quase zero. A paisagem por onde desce é célebre por ser não convexa — cheia de selas, planaltos, desfiladeiros estreitos — mas na prática a descida do gradiente (com os seus primos com momento Adam e RMSProp) encontra mínimos úteis com uma fiabilidade que ainda hoje intriga os teóricos.",
    },
    {
      pretitle: "Secção 06 · Daqui ao GPT",
      title: "Escalar o mesmo algoritmo",
      body: "O artigo de 1986 treinava redes com algumas centenas de pesos para reconhecer formas simples. O GPT-4 tem da ordem de um bilião. Nada mudou na regra da cadeia. O que mudou foi o substrato: GPUs e TPUs transformam cada passagem para a frente e para trás numa pilha de contracções tensoriais que pode correr a centenas de teraflops; precisão mista, gradient checkpointing, sharding ZeRO e uma dúzia de outros truques permitem caber modelos enormes em memória finita; e os dados, raspados da internet aberta, finalmente ficaram abundantes para justificar a contagem de parâmetros. Mesmo algoritmo, quatro ordens de grandeza a mais de computação. É toda esta a história da revolução do deep learning — backprop, simplesmente em escala.",
    },
  ],
  miniCaption: "Mini-rede · 2 entradas → 2 escondidas → 1 saída · a aprender XOR",
  miniStep: "Passo ×1",
  miniTrain: "Treinar ×200",
  miniReset: "↺ reiniciar",
  miniLossLabel: "Perda",
  miniStepCounter: "Passos",
  miniHint:
    "A espessura de cada aresta codifica |w|, âmbar significa positivo, ciano negativo. Carrega em Passo algumas vezes para ver os pesos a deslizar; Treinar ×200 mostra a perda a colapsar de ~0,25 para zero enquanto as quatro previsões XOR encaixam em 0/1. Reiniciar volta a aleatorizar e podes correr a mesma descida outra vez.",
  miniLayerLabels: ["entrada", "escondida", "saída"],
  closingPretitle: "Vê-a a treinar",
  closingTitle: "Abre o Explorador.",
  closingBody:
    "O Explorador deixa-te escolher uma topologia de rede, uma tarefa de brincadeira (XOR, duas luas, círculo-vs-quadrado), arrastar a taxa de aprendizagem e ver a fronteira de decisão formar-se em tempo real. O mesmo algoritmo que alimenta cada transformer, a treinar dentro do separador do teu navegador.",
  ctaLabel: "→ Abrir o Explorador",
};

// ---------------- Svenska ----------------
const sv: RichStory = {
  page: {
    pretitle: "Ämne · Analys",
    title: "Backpropagation",
    tagline:
      "En algoritm — kalkyl gången baklänges — och varje neuralt nätverk du någonsin hört talas om.",
    intro:
      "Visa en bild för ett nätverk; det gissar. Mät hur fel gissningen var; det talet är förlusten. Backprop går kedjeregeln baklänges genom varje lager och frågar var och en av miljoner vikter samma sak: om jag hade knuffat dig uppåt en aning, hade förlusten gått upp eller ner? Sedan knuffar den varje vikt i den riktning som sänker förlusten. Upprepa en miljard gånger. Det enda tricket är GPT, AlphaFold, bildgeneratorer, taligenkänning — hela den moderna AI-explosionen på en enda matematisk idé.",
    ctaInteractive: "→ Öppna Explorern",
  },
  encounter: {
    pretitle: "Första mötet",
    title: "Kalkyl, gången baklänges genom ett nätverk.",
    cards: [
      {
        label: "01",
        title: "Den stora idén",
        body: "Ett neuralt nätverk är en jättelik deriverbar funktion från ingång till utgång, med miljoner rattar (vikterna) inuti. Tag ett godtyckligt utdatafel: kedjeregeln säger exakt vilka rattar du ska vrida, åt vilket håll, hur mycket. Backpropagation är just den beräkningen, implementerad som en effektiv passering från utgång tillbaka till ingång. Varje vikt lär sig från varje exempel, samtidigt.",
      },
      {
        label: "02",
        title: "Ett konkret exempel",
        body: "Du vill ha ett nät som ger 1 för XOR av två bitar och 0 annars. Starta med slumpvis valda vikter — nätet returnerar skräp. Jämför gissning med sanning, beräkna förlusten. Backprop säger till varje vikt: «sänk dig med 0,03», «höj dig med 0,11», och så vidare. Efter några hundra sådana minikorrigeringar ger samma nät 0,98 i stället för 0,4 och 0,02 i stället för 0,6. Det har lärt sig en regel som ingen enskild neuron kan koda ensam.",
      },
      {
        label: "03",
        title: "Varför det spelar roll",
        body: "Backprop är nästan pinsamt enkelt — gymnasiets kedjeregel plus disciplinen att utvärdera den exakt en gång, lager för lager. Men varje modernt AI-system är samma algoritm på en annan skala. Från de pyttesmå näten 1986 till modellerna med biljoner parametrar 2026 har uppdateringsregeln inte ändrats. Hårdvaran växte, datan växte, nätet växte. Matematiken stannade.",
      },
    ],
    tryIt: "Träna ett pyttelitet 2-2-1-nätverk på XOR här, steg för steg.",
  },
  sections: [
    {
      pretitle: "Avsnitt 01 · Problemet",
      title: "Varför ett nätverk måste lära sig",
      body: "Ett neuralt nätverk är bara en stapel linjära avbildningar separerade av enkla icke-linjäriteter som sigmoid eller ReLU. Med rätt vikter kan det approximera vilken funktion som helst — det är den universella approximationsteoremet. Haken sitter i «med rätt vikter». För varje icke-trivial uppgift ligger de rätta vikterna i en höstack med miljoner dimensioner, och inget analytiskt arbete hittar dem. De måste läras från exempel: visa en ingång, visa den önskade utgången, tillåt justering. Backpropagation är justeringsregeln som gör detta möjligt i stor skala.",
    },
    {
      pretitle: "Avsnitt 02 · Den framåtriktade passeringen",
      title: "Vad nätverket tror är svaret",
      body: "Mata ingångsvektorn x in i första lagret. Varje neuron räknar en viktad summa av sina ingångar, lägger till en bias och skickar resultatet genom sin aktiveringsfunktion. Utgångarna från lager 1 blir ingångarna till lager 2; från 2, ingångarna till 3; och så vidare. När du når utgångslagret har nätet producerat sin aktuella gissning ŷ. Ingen inlärning ännu — bara en lång kedja av multiplikationer och additioner. Den framåtriktade passeringen är snabb och pinsamt parallell; på en GPU är det en matrismultiplikation per lager.",
    },
    {
      pretitle: "Avsnitt 03 · Förlusten",
      title: "Hur fel det var",
      body: "Jämför gissningen ŷ med sanningen y och kondensera jämförelsen till ett enda tal L — förlusten. Vid regression är L kvadratfelet (ŷ − y)². Vid klassificering är L korsentropin −Σy·log ŷ. Förlusten är en skalär funktion av varje vikt i nätet: ändra någon vikt och L ändras. Hela målet med träning är att hitta vikter som gör L litet. Den minimeringen kan vi inte lösa direkt — landskapet har för många dimensioner — men vi kan räkna ut lutningen av L med avseende på varje vikt och följa den nedåt.",
    },
    {
      pretitle: "Avsnitt 04 · Kedjeregeln, baklänges",
      title: "Hur en liten knuff fortplantar sig",
      body: "Förlusten beror på utgången, utgången beror på sista lagrets vikter och dess ingångar, och de ingångarna beror på det föregående lagrets vikter — rekursivt hela vägen till ingången. Kedjeregeln säger: multiplicera de lokala derivatorna längs vägen. Backprop är bokföringen som gör det effektivt — en passering från utgång tillbaka till ingång där varje lagers redan beräknade aktiveringar och gradienter återanvänds. Resultatet, för varje vikt w, är ∂L/∂w: hur mycket förlusten skulle ändras om du knuffade w en infinitesimal mängd. Linnainmaa skrev ner detta i en finsk masteruppsats 1970; Rumelhart, Hinton och Williams gav det modern form och namn 1986.",
    },
    {
      pretitle: "Avsnitt 05 · Uppdateringen",
      title: "Gradientnedstigning — ett pyttesteg utför",
      body: "Med ∂L/∂w för varje vikt är uppdateringen rättfram: w ← w − η ∂L/∂w. Här är η inlärningshastigheten, ett litet positivt tal — typiskt 10⁻³ till 10⁻¹. Varje steg knuffar varje vikt i den riktning som lokalt sänker förlusten, med en mängd proportionell mot lutningen. Gör det en gång per minibatch av exempel, kör tusentals epoker och nätets förlust faller från slumpgissning (omkring 0,7 nats vid klassificering) ned till nära noll. Landskapet det nedstiger är ökänt icke-konvext — fullt av sadlar, platåer, smala raviner — men i praktiken hittar gradientnedstigning (och dess momentumkusiner Adam och RMSProp) användbara minima med en tillförlitlighet som ännu förbryllar teoretiker.",
    },
    {
      pretitle: "Avsnitt 06 · Härifrån till GPT",
      title: "Att skala samma algoritm",
      body: "1986 års artikel tränade nätverk med några hundra vikter för att känna igen enkla former. GPT-4 har i storleksordningen en biljon. Inget har ändrats i kedjeregeln. Det som har ändrats är substratet: GPU:er och TPU:er gör varje framåt- och bakåtpassering till en stapel tensorkontraktioner som kan köra på hundratals teraflops; blandad precision, gradient checkpointing, ZeRO-sharding och ett dussin andra knep gör att enorma modeller får plats i ändligt minne; och datan, skrapad från det öppna nätet, blev äntligen riklig nog att motivera parameterantalet. Samma algoritm, fyra storleksordningar mer beräkning. Det är hela historien om djupinlärningsrevolutionen — backprop, bara i skala.",
    },
  ],
  miniCaption: "Mini-nät · 2 ingångar → 2 dolda → 1 utgång · lär sig XOR",
  miniStep: "Steg ×1",
  miniTrain: "Träna ×200",
  miniReset: "↺ återställ",
  miniLossLabel: "Förlust",
  miniStepCounter: "Steg",
  miniHint:
    "Kanttjocklek kodar |w|, bärnsten betyder positiv, cyan negativ. Klicka Steg några gånger för att se vikterna driva; Träna ×200 ser förlusten kollapsa från ~0,25 mot noll medan de fyra XOR-prediktionerna snäpper in på 0/1. Återställ slumpar om vikterna och du kan köra samma nedstigning igen.",
  miniLayerLabels: ["ingång", "dold", "utgång"],
  closingPretitle: "Se den träna",
  closingTitle: "Öppna Utforskaren.",
  closingBody:
    "Utforskaren låter dig välja nätverkstopologi, en leksaksuppgift (XOR, två månar, cirkel-mot-kvadrat), dra i inlärningshastigheten och se beslutsgränsen formas i realtid. Samma algoritm som driver varje transformer, i träning inne i din webbläsarflik.",
  ctaLabel: "→ Öppna Utforskaren",
};

// ---------------- Norsk ----------------
const no: RichStory = {
  page: {
    pretitle: "Tema · Analyse",
    title: "Backpropagation",
    tagline:
      "Én algoritme — kalkulus gått baklengs — og hvert nevralt nettverk du noensinne har hørt om.",
    intro:
      "Vis et nettverk et bilde; det gjetter. Mål hvor feil gjetningen var; det tallet er tapet. Backprop går kjerneregelen baklengs gjennom hvert lag og stiller hver av millioner av vekter det samme spørsmålet: hadde jeg skjøvet deg en bitteliten bit oppover, ville tapet steget eller sunket? Så skyver den hver vekt i den retningen som senker tapet. Gjenta en milliard ganger. Det ene trikset er GPT, AlphaFold, bildegeneratorer, talegjenkjenning — hele den moderne AI-eksplosjonen på én matematisk idé.",
    ctaInteractive: "→ Åpne Utforskeren",
  },
  encounter: {
    pretitle: "Første møte",
    title: "Kalkulus, gått baklengs gjennom et nettverk.",
    cards: [
      {
        label: "01",
        title: "Den store ideen",
        body: "Et nevralt nettverk er en kjempestor deriverbar funksjon fra inngang til utgang, med millioner av rattskruer (vektene) inni. Ta en hvilken som helst utgangsfeil: kjerneregelen sier nøyaktig hvilke rattskruer du skal vri, i hvilken retning, hvor mye. Backpropagation er den beregningen, implementert som én effektiv passering fra utgang tilbake til inngang. Hver vekt lærer fra hvert eksempel, samtidig.",
      },
      {
        label: "02",
        title: "Et konkret eksempel",
        body: "Du vil ha et nett som gir 1 for XOR av to bit og 0 ellers. Start med tilfeldige vekter — nettet returnerer søppel. Sammenlign gjetning med sannhet, regn ut tapet. Backprop sier til hver vekt: «senk deg med 0,03», «øk deg med 0,11», og så videre. Etter noen hundre slike minikorreksjoner gir samme nett 0,98 i stedet for 0,4 og 0,02 i stedet for 0,6. Det har lært en regel ingen enkelt nevron kunne kodet alene.",
      },
      {
        label: "03",
        title: "Hvorfor det betyr noe",
        body: "Backprop er nesten pinlig enkelt — videregåendes kjerneregel pluss disiplinen til å evaluere den én gang, lag for lag. Men hvert moderne AI-system er samme algoritme på en annen skala. Fra de bittesmå nettene i 1986 til billion-parameter-modellene i 2026 har oppdateringsregelen ikke endret seg. Maskinvaren vokste, dataen vokste, nettet vokste. Matematikken ble stående.",
      },
    ],
    tryIt: "Tren et bittelite 2-2-1-nettverk på XOR her, steg for steg.",
  },
  sections: [
    {
      pretitle: "Avsnitt 01 · Problemet",
      title: "Hvorfor et nettverk må lære",
      body: "Et nevralt nettverk er bare en stabel av lineære avbildninger atskilt av enkle ikke-lineariteter som sigmoid eller ReLU. Med de rette vektene kan det approksimere enhver funksjon — det er det universelle approksimasjonsteoremet. Haken ligger i «med de rette vektene». For enhver ikke-triviell oppgave ligger de rette vektene i en høystakk med millioner av dimensjoner, og ikke noe analytisk arbeid finner dem. De må læres fra eksempler: vis en inngang, vis den ønskede utgangen, tillat justering. Backpropagation er justeringsregelen som gjør dette mulig i stor skala.",
    },
    {
      pretitle: "Avsnitt 02 · Forover-passet",
      title: "Hva nettverket tror er svaret",
      body: "Mat inngangsvektoren x inn i første lag. Hvert nevron regner en vektet sum av sine inngangar, legger til en bias og sender resultatet gjennom sin aktiveringsfunksjon. Utgangene fra lag 1 blir inngangene til lag 2; fra 2, inngangene til 3; og så videre. Når du når utgangslaget har nettet produsert sin nåværende gjetning ŷ. Ingen læring enda — bare en lang kjede av multiplikasjoner og addisjoner. Forover-passet er raskt og pinlig parallelt; på en GPU er det en matrisemultiplikasjon per lag.",
    },
    {
      pretitle: "Avsnitt 03 · Tapet",
      title: "Hvor feil det var",
      body: "Sammenlign gjetningen ŷ med sannheten y, og kollaps sammenligningen til ett enkelt tall L — tapet. Ved regresjon er L kvadratfeilen (ŷ − y)². Ved klassifisering er L kryssentropien −Σy·log ŷ. Tapet er en skalar funksjon av hver vekt i nettet: endre en vekt og L endrer seg. Hele målet med treningen er å finne vekter som gjør L liten. Den minimeringen kan vi ikke løse direkte — landskapet har for mange dimensjoner — men vi kan regne ut stigningen til L med hensyn til hver vekt og følge den nedover.",
    },
    {
      pretitle: "Avsnitt 04 · Kjerneregelen, baklengs",
      title: "Hvordan en bitteliten dytt forplanter seg",
      body: "Tapet avhenger av utgangen, utgangen av siste lags vekter og inngangene til det laget, og de inngangene av forrige lags vekter — rekursivt helt til inngangen. Kjerneregelen sier: multipliser de lokale deriverte langs banen. Backprop er regnskapet som gjør dette effektivt — én passering fra utgang tilbake til inngang som gjenbruker hvert lags allerede beregnede aktiveringer og gradienter. Resultatet, for hver vekt w, er ∂L/∂w: hvor mye tapet ville endret seg om du skjøv w en infinitesimal mengde. Linnainmaa skrev dette ned i en finsk masteroppgave i 1970; Rumelhart, Hinton og Williams ga det moderne form og navn i 1986.",
    },
    {
      pretitle: "Avsnitt 05 · Oppdateringen",
      title: "Gradientnedstigning — ett bittelite steg nedover",
      body: "Når du har ∂L/∂w for hver vekt er oppdateringen rett fram: w ← w − η ∂L/∂w. Her er η læringsraten, et lite positivt tall — typisk 10⁻³ til 10⁻¹. Hvert steg skyver hver vekt i retningen som lokalt senker tapet, med en mengde proporsjonal med stigningen. Gjør dette én gang per minibatch av eksempler, la det gå i tusenvis av epoker, og nettets tap faller fra tilfeldig gjetning (rundt 0,7 nats ved klassifisering) ned mot null. Landskapet det stiger ned i er beryktet ikke-konveks — fullt av saler, platåer, trange juv — men i praksis finner gradientnedstigning (og dens momentum-fettere Adam og RMSProp) brukbare minima med en pålitelighet som fortsatt forundrer teoretikere.",
    },
    {
      pretitle: "Avsnitt 06 · Herfra til GPT",
      title: "Å skalere samme algoritme",
      body: "Artikkelen fra 1986 trente nett med noen hundre vekter til å gjenkjenne enkle former. GPT-4 har i størrelsesorden én billion. Ingenting i kjerneregelen er endret. Det som er endret er substratet: GPU-er og TPU-er gjør hvert forover- og bakover-pass til en stabel av tensorkontraksjoner som kan kjøre på hundretalls teraflops; blandet presisjon, gradient checkpointing, ZeRO-sharding og et dusin andre triks gjør at enorme modeller får plass i endelig minne; og dataen, skrapt fra det åpne internett, ble endelig rikelig nok til å rettferdiggjøre parameterantallet. Samme algoritme, fire størrelsesordener mer beregning. Det er hele historien om dyp-læringsrevolusjonen — backprop, bare i skala.",
    },
  ],
  miniCaption: "Mini-nett · 2 inngangar → 2 skjulte → 1 utgang · lærer XOR",
  miniStep: "Steg ×1",
  miniTrain: "Tren ×200",
  miniReset: "↺ tilbakestill",
  miniLossLabel: "Tap",
  miniStepCounter: "Steg",
  miniHint:
    "Kanttykkelse koder |w|, rav betyr positiv, cyan negativ. Klikk Steg noen ganger for å se vektene drive; Tren ×200 ser tapet kollapse fra ~0,25 mot null mens de fire XOR-prediksjonene snapper inn på 0/1. Tilbakestill slumper om vektene og du kan kjøre samme nedstigning igjen.",
  miniLayerLabels: ["inngang", "skjult", "utgang"],
  closingPretitle: "Se den trene",
  closingTitle: "Åpne Utforskeren.",
  closingBody:
    "Utforskeren lar deg velge en nettverkstopologi, en leketøysoppgave (XOR, to måner, sirkel-mot-firkant), dra i læringsraten og se beslutningsgrensen formes i sanntid. Samme algoritme som driver hver transformer, i trening inne i nettleserfanen din.",
  ctaLabel: "→ Åpne Utforskeren",
};

const RICH_STORY: Record<Locale, RichStory> = { en, de, es, fr, it, pt, sv, no };

// --------------------------------------------------------------------------

export default function BackpropStory() {
  const { locale } = useI18n();
  const story = RICH_STORY[locale];
  const page: StoryPage = { ...story.page, sections: [] };

  return (
    <StoryPageShell
      page={page}
      ctaHref="/backprop/explorer"
      accent={ACCENT}
      borderAccent="border-signal-teal/70"
      bgAccent="bg-signal-teal/10"
      hoverAccent="hover:bg-signal-teal/20"
      gradient="from-signal-teal/10"
      formulaBadge="w ← w − η∇w L"
      formulaLatex={"w \\leftarrow w - \\eta\\,\\nabla_{w}L"}
      finalLabel={story.closingTitle}
      signature={<BackpropSignatureHero />}
    >
      {/* Encounter — three approachable cards */}
      <section className="mx-auto mb-32 max-w-5xl space-y-10">
        <div className="space-y-3 text-center">
          <Reveal>
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {story.encounter.pretitle}
            </div>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="math-italic text-4xl leading-tight md:text-5xl">
              {story.encounter.title}
            </h2>
          </Reveal>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {story.encounter.cards.map((card, i) => (
            <Reveal key={card.label} delay={120 + i * 100}>
              <EncounterCard label={card.label} title={card.title}>
                <p>{card.body}</p>
              </EncounterCard>
            </Reveal>
          ))}
        </div>
        <Reveal delay={500}>
          <div className="text-center italic text-ink-300">{story.encounter.tryIt}</div>
        </Reveal>
      </section>

      {/* Section 01 — Why a network needs to learn */}
      <section className="mx-auto mb-32 max-w-4xl">
        <StoryCard
          pretitle={story.sections[0].pretitle}
          title={story.sections[0].title}
          body={story.sections[0].body}
          accent={ACCENT}
        />
      </section>

      {/* Section 02 — Forward pass */}
      <section className="mx-auto mb-32 max-w-4xl">
        <StoryCard
          pretitle={story.sections[1].pretitle}
          title={story.sections[1].title}
          body={story.sections[1].body}
          accent={ACCENT}
        />
      </section>

      {/* Section 03 — Loss */}
      <section className="mx-auto mb-32 max-w-4xl">
        <StoryCard
          pretitle={story.sections[2].pretitle}
          title={story.sections[2].title}
          body={story.sections[2].body}
          accent={ACCENT}
        />
      </section>

      {/* Section 04 — Chain rule backwards */}
      <section className="mx-auto mb-32 max-w-4xl">
        <StoryCard
          pretitle={story.sections[3].pretitle}
          title={story.sections[3].title}
          body={story.sections[3].body}
          accent={ACCENT}
        />
      </section>

      {/* INTERACTIVE — tiny 2-2-1 net training XOR */}
      <section className="mx-auto mb-32 max-w-4xl">
        <Reveal>
          <BackpropMiniNet
            caption={story.miniCaption}
            stepLabel={story.miniStep}
            trainLabel={story.miniTrain}
            resetLabel={story.miniReset}
            lossLabel={story.miniLossLabel}
            stepCounterLabel={story.miniStepCounter}
            hint={story.miniHint}
            layerLabels={story.miniLayerLabels}
          />
        </Reveal>
      </section>

      {/* Section 05 — Gradient descent */}
      <section className="mx-auto mb-32 max-w-4xl space-y-8">
        <StoryCard
          pretitle={story.sections[4].pretitle}
          title={story.sections[4].title}
          body={story.sections[4].body}
          accent={ACCENT}
        />
        <Reveal delay={120}>
          <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-8 text-center">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              Rumelhart · Hinton · Williams · 1986
            </div>
            <div className="math-italic text-3xl text-ink-100 md:text-4xl">
              w ← w − η ∇<sub>w</sub> L
            </div>
            <p className="mx-auto max-w-xl text-sm leading-relaxed text-ink-300">
              The single update rule that, scaled four orders of magnitude, became every modern
              neural network. Linnainmaa wrote the bookkeeping down first, in a 1970 Finnish
              master's thesis.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Section 06 — Scaling to GPT */}
      <section className="mx-auto mb-32 max-w-4xl">
        <StoryCard
          pretitle={story.sections[5].pretitle}
          title={story.sections[5].title}
          body={story.sections[5].body}
          accent={ACCENT}
        />
      </section>

      {/* Closing CTA */}
      <Reveal>
        <section className="glass hairline mx-auto mt-16 max-w-3xl space-y-6 rounded-3xl border p-10 text-center">
          <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
            {story.closingPretitle}
          </div>
          <div className="math-italic shimmer-text text-3xl leading-tight md:text-5xl">
            {story.closingTitle}
          </div>
          <p className="leading-relaxed text-ink-200">{story.closingBody}</p>
          <Link
            href="/backprop/explorer"
            className="inline-block rounded-full border border-signal-teal/70 bg-signal-teal/10 px-8 py-4 font-mono text-sm uppercase tracking-widest2 text-signal-teal transition-colors hover:bg-signal-teal/25"
          >
            {story.ctaLabel}
          </Link>
        </section>
      </Reveal>
    </StoryPageShell>
  );
}

function EncounterCard({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="glass hairline h-full space-y-3 rounded-2xl border p-6 transition-colors hover:border-signal-teal/40">
      <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>{label}</div>
      <h3 className="math-italic text-2xl leading-snug text-ink-100">{title}</h3>
      <div className="text-sm leading-relaxed text-ink-200">{children}</div>
    </div>
  );
}
