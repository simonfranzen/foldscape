"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import type { Locale } from "@/lib/i18n/types";

// --------------------------------------------------------------------------
// Backprop Explorer — hand-rolled multilayer perceptron trainer in the
// browser. Tanh-hidden, sigmoid output, MSE loss. No tensorflow.js. Three
// toy tasks (XOR, two moons, circle vs square), three topologies
// (2-3-1, 2-4-4-1, 3-8-8-1 — though we always use 2D inputs; the 3-8-8-1
// option just gives you a bigger first layer with three-feature inputs:
// x, y, x*y). Live decision-boundary heatmap + loss curve, hyperparameter
// sliders. The whole training loop is ~80 lines of plain JS — exactly what
// the story page promises.
// --------------------------------------------------------------------------

type Topology = "2-3-1" | "2-4-4-1" | "3-8-8-1";
type Task = "xor" | "moons" | "circle";

// ---------- per-locale UI strings ----------

type RichExplorer = {
  topologyLabel: string;
  topologyOptions: Record<Topology, string>;
  taskLabel: string;
  taskOptions: Record<Task, string>;
  learningRate: string;
  batchSize: string;
  epochs: string;
  trainingBadge: string;
  pausedBadge: string;
  convergedBadge: string;
  initBadge: string;
  play: string;
  pause: string;
  step: string;
  reset: string;
  lossLabel: string;
  epochLabel: string;
  accuracyLabel: string;
  decisionLabel: string;
  decisionHint: string;
  whatYouSeeLabel: string;
  whatYouSeeInit: string;
  whatYouSeeTraining: string;
  whatYouSeeConverged: string;
};

const E: Record<Locale, RichExplorer> = {
  en: {
    topologyLabel: "Network topology",
    topologyOptions: {
      "2-3-1": "2 → 3 → 1  (smallest that learns XOR)",
      "2-4-4-1": "2 → 4 → 4 → 1  (two hidden layers)",
      "3-8-8-1": "3 → 8 → 8 → 1  (with x·y feature)",
    },
    taskLabel: "Toy task",
    taskOptions: {
      xor: "XOR — four corners",
      moons: "Two moons — interlocked crescents",
      circle: "Circle vs square — radial split",
    },
    learningRate: "Learning rate η",
    batchSize: "Batch size",
    epochs: "Epochs / second",
    trainingBadge: "Training",
    pausedBadge: "Paused",
    convergedBadge: "Converged",
    initBadge: "Initial weights",
    play: "▶ play",
    pause: "❚❚ pause",
    step: "step ×1",
    reset: "↺ reset",
    lossLabel: "Loss",
    epochLabel: "Epoch",
    accuracyLabel: "Accuracy",
    decisionLabel: "Decision boundary",
    decisionHint:
      "Amber = net says class 1, cyan = class 0. Watch the regions warp as the loss falls.",
    whatYouSeeLabel: "What you are seeing",
    whatYouSeeInit:
      "Random weights. The decision surface is a smooth, almost meaningless gradient — the network has no idea what the task is yet. Click play and watch backprop reshape the surface to match the data.",
    whatYouSeeTraining:
      "Each epoch processes the whole training set once. The chain rule, run backward through every layer, gives each weight its share of the blame for the current loss; the optimiser then nudges each weight downhill. The visible decision boundary is the level set ŷ = 0.5 of the network's output.",
    whatYouSeeConverged:
      "Loss has plateaued. The decision boundary now traces the structure of the task — corners for XOR, an interlocking S for two moons, a circle for the radial split. The network has memorised a smooth function that fits the training points and generalises to nearby ones.",
  },
  de: {
    topologyLabel: "Netz-Topologie",
    topologyOptions: {
      "2-3-1": "2 → 3 → 1  (kleinstes, das XOR lernt)",
      "2-4-4-1": "2 → 4 → 4 → 1  (zwei versteckte Schichten)",
      "3-8-8-1": "3 → 8 → 8 → 1  (mit x·y-Feature)",
    },
    taskLabel: "Spielaufgabe",
    taskOptions: {
      xor: "XOR — vier Ecken",
      moons: "Zwei Monde — verschränkte Sicheln",
      circle: "Kreis gegen Quadrat — radialer Schnitt",
    },
    learningRate: "Lernrate η",
    batchSize: "Batchgröße",
    epochs: "Epochen / Sekunde",
    trainingBadge: "Trainiert",
    pausedBadge: "Pausiert",
    convergedBadge: "Konvergiert",
    initBadge: "Anfangsgewichte",
    play: "▶ los",
    pause: "❚❚ Pause",
    step: "Schritt ×1",
    reset: "↺ zurücksetzen",
    lossLabel: "Verlust",
    epochLabel: "Epoche",
    accuracyLabel: "Genauigkeit",
    decisionLabel: "Entscheidungsgrenze",
    decisionHint:
      "Bernstein = Netz sagt Klasse 1, Zyan = Klasse 0. Schau zu, wie sich die Bereiche verformen, während der Verlust fällt.",
    whatYouSeeLabel: "Was du siehst",
    whatYouSeeInit:
      "Zufällige Gewichte. Die Entscheidungsoberfläche ist ein weicher, fast bedeutungsloser Verlauf — das Netz weiß noch nicht, worum es geht. Drücke „los« und sieh zu, wie Backprop die Oberfläche an die Daten anpasst.",
    whatYouSeeTraining:
      "Jede Epoche verarbeitet einmal den ganzen Trainingsdatensatz. Die Kettenregel, rückwärts durch jede Schicht gelaufen, gibt jedem Gewicht seinen Anteil am aktuellen Verlust; der Optimierer schiebt jedes Gewicht dann bergab. Die sichtbare Entscheidungsgrenze ist die Niveaumenge ŷ = 0,5 der Netzausgabe.",
    whatYouSeeConverged:
      "Der Verlust hat ein Plateau erreicht. Die Entscheidungsgrenze zeichnet jetzt die Struktur der Aufgabe nach — Ecken bei XOR, ein verschränktes S bei den zwei Monden, ein Kreis beim radialen Schnitt. Das Netz hat eine glatte Funktion gelernt, die zu den Trainingspunkten passt und auf benachbarte verallgemeinert.",
  },
  es: {
    topologyLabel: "Topología de la red",
    topologyOptions: {
      "2-3-1": "2 → 3 → 1  (el mínimo que aprende XOR)",
      "2-4-4-1": "2 → 4 → 4 → 1  (dos capas ocultas)",
      "3-8-8-1": "3 → 8 → 8 → 1  (con feature x·y)",
    },
    taskLabel: "Tarea de juguete",
    taskOptions: {
      xor: "XOR — cuatro esquinas",
      moons: "Dos lunas — crecientes entrelazados",
      circle: "Círculo vs cuadrado — corte radial",
    },
    learningRate: "Tasa de aprendizaje η",
    batchSize: "Tamaño de lote",
    epochs: "Épocas / segundo",
    trainingBadge: "Entrenando",
    pausedBadge: "En pausa",
    convergedBadge: "Convergida",
    initBadge: "Pesos iniciales",
    play: "▶ ir",
    pause: "❚❚ pausa",
    step: "paso ×1",
    reset: "↺ reiniciar",
    lossLabel: "Pérdida",
    epochLabel: "Época",
    accuracyLabel: "Precisión",
    decisionLabel: "Frontera de decisión",
    decisionHint:
      "Ámbar = la red dice clase 1, cian = clase 0. Mira las regiones deformarse mientras cae la pérdida.",
    whatYouSeeLabel: "Lo que estás viendo",
    whatYouSeeInit:
      "Pesos aleatorios. La superficie de decisión es un degradado suave y casi sin sentido — la red aún no sabe cuál es la tarea. Pulsa ir y mira a backprop remodelar la superficie hacia los datos.",
    whatYouSeeTraining:
      "Cada época procesa el conjunto de entrenamiento una vez. La regla de la cadena, recorrida hacia atrás por cada capa, le da a cada peso su parte de culpa por la pérdida actual; el optimizador empuja cada peso cuesta abajo. La frontera visible es el conjunto de nivel ŷ = 0,5 de la salida.",
    whatYouSeeConverged:
      "La pérdida se ha estabilizado. La frontera traza ahora la estructura de la tarea — esquinas para XOR, una S entrelazada para las dos lunas, un círculo para el corte radial. La red ha memorizado una función suave que ajusta los puntos de entrenamiento y generaliza a los vecinos.",
  },
  fr: {
    topologyLabel: "Topologie du réseau",
    topologyOptions: {
      "2-3-1": "2 → 3 → 1  (le minimum qui apprend XOR)",
      "2-4-4-1": "2 → 4 → 4 → 1  (deux couches cachées)",
      "3-8-8-1": "3 → 8 → 8 → 1  (avec feature x·y)",
    },
    taskLabel: "Tâche jouet",
    taskOptions: {
      xor: "XOR — quatre coins",
      moons: "Deux lunes — croissants entrelacés",
      circle: "Cercle vs carré — coupe radiale",
    },
    learningRate: "Taux d'apprentissage η",
    batchSize: "Taille du lot",
    epochs: "Époques / seconde",
    trainingBadge: "Entraînement",
    pausedBadge: "En pause",
    convergedBadge: "Convergé",
    initBadge: "Poids initiaux",
    play: "▶ go",
    pause: "❚❚ pause",
    step: "pas ×1",
    reset: "↺ réinitialiser",
    lossLabel: "Perte",
    epochLabel: "Époque",
    accuracyLabel: "Précision",
    decisionLabel: "Frontière de décision",
    decisionHint:
      "Ambre = le réseau dit classe 1, cyan = classe 0. Regarde les régions se déformer pendant que la perte baisse.",
    whatYouSeeLabel: "Ce que tu vois",
    whatYouSeeInit:
      "Poids aléatoires. La surface de décision est un dégradé doux et presque dénué de sens — le réseau ne sait pas encore de quoi il s'agit. Clique sur go et regarde la rétropropagation remodeler la surface vers les données.",
    whatYouSeeTraining:
      "Chaque époque parcourt l'ensemble d'entraînement une fois. La règle de la chaîne, remontée à l'envers par chaque couche, donne à chaque poids sa part de blâme pour la perte courante ; l'optimiseur pousse alors chaque poids vers le bas. La frontière visible est l'ensemble de niveau ŷ = 0,5 de la sortie.",
    whatYouSeeConverged:
      "La perte a atteint un plateau. La frontière trace maintenant la structure de la tâche — des coins pour XOR, un S entrelacé pour les deux lunes, un cercle pour la coupe radiale. Le réseau a mémorisé une fonction lisse qui ajuste les points d'entraînement et généralise aux voisins.",
  },
  it: {
    topologyLabel: "Topologia della rete",
    topologyOptions: {
      "2-3-1": "2 → 3 → 1  (il minimo che impara XOR)",
      "2-4-4-1": "2 → 4 → 4 → 1  (due strati nascosti)",
      "3-8-8-1": "3 → 8 → 8 → 1  (con feature x·y)",
    },
    taskLabel: "Compito giocattolo",
    taskOptions: {
      xor: "XOR — quattro angoli",
      moons: "Due lune — falci intrecciate",
      circle: "Cerchio vs quadrato — taglio radiale",
    },
    learningRate: "Tasso di apprendimento η",
    batchSize: "Dimensione del batch",
    epochs: "Epoche / secondo",
    trainingBadge: "In allenamento",
    pausedBadge: "In pausa",
    convergedBadge: "Convergita",
    initBadge: "Pesi iniziali",
    play: "▶ via",
    pause: "❚❚ pausa",
    step: "passo ×1",
    reset: "↺ azzera",
    lossLabel: "Perdita",
    epochLabel: "Epoca",
    accuracyLabel: "Accuratezza",
    decisionLabel: "Frontiera decisionale",
    decisionHint:
      "Ambra = la rete dice classe 1, ciano = classe 0. Guarda le regioni deformarsi mentre la perdita cala.",
    whatYouSeeLabel: "Ciò che stai vedendo",
    whatYouSeeInit:
      "Pesi casuali. La superficie decisionale è un gradiente morbido e quasi privo di senso — la rete non sa ancora qual è il compito. Premi via e guarda la backprop rimodellare la superficie verso i dati.",
    whatYouSeeTraining:
      "Ogni epoca attraversa una volta l'intero set di allenamento. La regola della catena, percorsa all'indietro in ogni strato, dà a ciascun peso la sua quota di colpa per la perdita attuale; l'ottimizzatore spinge poi ciascun peso in discesa. La frontiera visibile è l'insieme di livello ŷ = 0,5 dell'uscita.",
    whatYouSeeConverged:
      "La perdita ha raggiunto un plateau. La frontiera traccia ora la struttura del compito — angoli per XOR, una S intrecciata per le due lune, un cerchio per il taglio radiale. La rete ha memorizzato una funzione liscia che si adatta ai punti di allenamento e generalizza ai vicini.",
  },
  pt: {
    topologyLabel: "Topologia da rede",
    topologyOptions: {
      "2-3-1": "2 → 3 → 1  (o mínimo que aprende XOR)",
      "2-4-4-1": "2 → 4 → 4 → 1  (duas camadas escondidas)",
      "3-8-8-1": "3 → 8 → 8 → 1  (com feature x·y)",
    },
    taskLabel: "Tarefa de brincadeira",
    taskOptions: {
      xor: "XOR — quatro cantos",
      moons: "Duas luas — crescentes entrelaçados",
      circle: "Círculo vs quadrado — corte radial",
    },
    learningRate: "Taxa de aprendizagem η",
    batchSize: "Tamanho do lote",
    epochs: "Épocas / segundo",
    trainingBadge: "A treinar",
    pausedBadge: "Em pausa",
    convergedBadge: "Convergiu",
    initBadge: "Pesos iniciais",
    play: "▶ ir",
    pause: "❚❚ pausa",
    step: "passo ×1",
    reset: "↺ reiniciar",
    lossLabel: "Perda",
    epochLabel: "Época",
    accuracyLabel: "Precisão",
    decisionLabel: "Fronteira de decisão",
    decisionHint:
      "Âmbar = a rede diz classe 1, ciano = classe 0. Olha para as regiões deformarem-se enquanto a perda cai.",
    whatYouSeeLabel: "O que estás a ver",
    whatYouSeeInit:
      "Pesos aleatórios. A superfície de decisão é um gradiente suave e quase sem sentido — a rede ainda não sabe qual é a tarefa. Carrega em ir e observa a backprop remodelar a superfície até aos dados.",
    whatYouSeeTraining:
      "Cada época percorre uma vez o conjunto de treino. A regra da cadeia, percorrida para trás por cada camada, dá a cada peso a sua quota de culpa pela perda atual; o optimizador empurra então cada peso a descer. A fronteira visível é o conjunto de nível ŷ = 0,5 da saída.",
    whatYouSeeConverged:
      "A perda atingiu um planalto. A fronteira traça agora a estrutura da tarefa — cantos para XOR, um S entrelaçado para as duas luas, um círculo para o corte radial. A rede memorizou uma função suave que se ajusta aos pontos de treino e generaliza para os vizinhos.",
  },
  sv: {
    topologyLabel: "Nätverkstopologi",
    topologyOptions: {
      "2-3-1": "2 → 3 → 1  (det minsta som lär sig XOR)",
      "2-4-4-1": "2 → 4 → 4 → 1  (två dolda lager)",
      "3-8-8-1": "3 → 8 → 8 → 1  (med x·y-feature)",
    },
    taskLabel: "Leksaksuppgift",
    taskOptions: {
      xor: "XOR — fyra hörn",
      moons: "Två månar — hopflätade halvmånar",
      circle: "Cirkel vs kvadrat — radiell delning",
    },
    learningRate: "Inlärningshastighet η",
    batchSize: "Batchstorlek",
    epochs: "Epoker / sekund",
    trainingBadge: "Tränar",
    pausedBadge: "Pausad",
    convergedBadge: "Konvergerat",
    initBadge: "Initialvikter",
    play: "▶ kör",
    pause: "❚❚ paus",
    step: "steg ×1",
    reset: "↺ återställ",
    lossLabel: "Förlust",
    epochLabel: "Epok",
    accuracyLabel: "Träffsäkerhet",
    decisionLabel: "Beslutsgräns",
    decisionHint:
      "Bärnsten = nätet säger klass 1, cyan = klass 0. Se hur områdena förvrids medan förlusten faller.",
    whatYouSeeLabel: "Det du ser",
    whatYouSeeInit:
      "Slumpvis valda vikter. Beslutsytan är en mjuk, nästan meningslös gradient — nätet vet inte vad uppgiften går ut på än. Tryck kör och se backprop omforma ytan mot datan.",
    whatYouSeeTraining:
      "Varje epok går igenom hela träningsmängden en gång. Kedjeregeln, gången baklänges genom varje lager, ger varje vikt sin andel av skulden för det aktuella tapet; optimeraren knuffar sedan varje vikt nedåt. Den synliga beslutsgränsen är nivåmängden ŷ = 0,5 av utgången.",
    whatYouSeeConverged:
      "Förlusten har planat ut. Beslutsgränsen följer nu uppgiftens struktur — hörn för XOR, ett hopflätat S för de två månarna, en cirkel för den radiella delningen. Nätet har lärt sig en slät funktion som passar träningspunkterna och generaliserar till närliggande.",
  },
  no: {
    topologyLabel: "Nettverkstopologi",
    topologyOptions: {
      "2-3-1": "2 → 3 → 1  (det minste som lærer XOR)",
      "2-4-4-1": "2 → 4 → 4 → 1  (to skjulte lag)",
      "3-8-8-1": "3 → 8 → 8 → 1  (med x·y-feature)",
    },
    taskLabel: "Leketøysoppgave",
    taskOptions: {
      xor: "XOR — fire hjørner",
      moons: "To måner — sammenflettede halvmåner",
      circle: "Sirkel vs firkant — radiell deling",
    },
    learningRate: "Læringsrate η",
    batchSize: "Batchstørrelse",
    epochs: "Epoker / sekund",
    trainingBadge: "Trener",
    pausedBadge: "Pauset",
    convergedBadge: "Konvergert",
    initBadge: "Startvekter",
    play: "▶ start",
    pause: "❚❚ pause",
    step: "steg ×1",
    reset: "↺ tilbakestill",
    lossLabel: "Tap",
    epochLabel: "Epoke",
    accuracyLabel: "Treffsikkerhet",
    decisionLabel: "Beslutningsgrense",
    decisionHint:
      "Rav = nettet sier klasse 1, cyan = klasse 0. Se hvordan områdene forvrenges mens tapet faller.",
    whatYouSeeLabel: "Det du ser",
    whatYouSeeInit:
      "Tilfeldige vekter. Beslutningsoverflaten er en myk, nesten meningsløs gradient — nettet vet ikke ennå hva oppgaven er. Trykk start og se backprop omforme overflaten mot dataene.",
    whatYouSeeTraining:
      "Hver epoke går gjennom hele treningsdatasettet én gang. Kjerneregelen, gått baklengs gjennom hvert lag, gir hver vekt sin andel av skylda for det nåværende tapet; optimaliseringen skyver så hver vekt nedover. Den synlige beslutningsgrensen er nivåmengden ŷ = 0,5 av utgangen.",
    whatYouSeeConverged:
      "Tapet har nådd et platå. Beslutningsgrensen tegner nå oppgavens struktur — hjørner for XOR, en sammenflettet S for de to månene, en sirkel for den radielle delingen. Nettet har lært en glatt funksjon som passer treningspunktene og generaliserer til naboene.",
  },
};

// ---------- Net + training loop ----------

interface Layer {
  W: number[][]; // shape: [out][in]
  b: number[]; // shape: [out]
  // Per-layer caches reused on the backward pass.
  lastInput?: number[];
  lastZ?: number[];
  lastA?: number[];
}

interface Net {
  layers: Layer[];
  topology: Topology;
}

const TOPOLOGY_SIZES: Record<Topology, number[]> = {
  "2-3-1": [2, 3, 1],
  "2-4-4-1": [2, 4, 4, 1],
  "3-8-8-1": [3, 8, 8, 1],
};

// xavier-ish init with a tiny LCG so resets are reproducible by seed.
function makeNet(topology: Topology, seed: number): Net {
  let s = seed || 1;
  const rand = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return ((s & 0xffff) / 0x10000) * 2 - 1;
  };
  const sizes = TOPOLOGY_SIZES[topology];
  const layers: Layer[] = [];
  for (let l = 0; l < sizes.length - 1; l++) {
    const inN = sizes[l];
    const outN = sizes[l + 1];
    const scale = Math.sqrt(2 / (inN + outN));
    const W: number[][] = Array.from({ length: outN }, () =>
      Array.from({ length: inN }, () => rand() * scale * 1.3),
    );
    const b: number[] = Array.from({ length: outN }, () => rand() * 0.1);
    layers.push({ W, b });
  }
  return { layers, topology };
}

// tanh hidden, sigmoid output. Pure JS, no allocations in the hot loop where
// we can avoid them.
const tanh = (z: number) => Math.tanh(z);
const dtanh = (a: number) => 1 - a * a;
const sig = (z: number) => 1 / (1 + Math.exp(-z));

function forward(net: Net, x: number[]): number {
  let a = x;
  for (let l = 0; l < net.layers.length; l++) {
    const layer = net.layers[l];
    const isLast = l === net.layers.length - 1;
    const z = new Array(layer.W.length);
    const out = new Array(layer.W.length);
    for (let i = 0; i < layer.W.length; i++) {
      let zi = layer.b[i];
      const row = layer.W[i];
      for (let j = 0; j < row.length; j++) zi += row[j] * a[j];
      z[i] = zi;
      out[i] = isLast ? sig(zi) : tanh(zi);
    }
    layer.lastInput = a;
    layer.lastZ = z;
    layer.lastA = out;
    a = out;
  }
  return a[0];
}

// One SGD update on a mini-batch. Returns mean batch loss.
function trainBatch(net: Net, batch: Array<{ x: number[]; y: number }>, lr: number): number {
  // Accumulate gradients across the batch.
  const L = net.layers.length;
  const gW: number[][][] = net.layers.map((ly) =>
    ly.W.map((row) => row.map(() => 0)),
  );
  const gb: number[][] = net.layers.map((ly) => ly.b.map(() => 0));

  let lossSum = 0;
  for (const { x, y } of batch) {
    const yhat = forward(net, x);
    lossSum += 0.5 * (yhat - y) * (yhat - y);

    // Backward pass.
    // delta[l] = ∂L / ∂z[l] for each unit in layer l.
    const deltas: number[][] = new Array(L);
    // Output layer (sigmoid + MSE).
    const last = net.layers[L - 1];
    const aL = last.lastA!;
    deltas[L - 1] = [(yhat - y) * aL[0] * (1 - aL[0])];
    // Hidden layers (tanh).
    for (let l = L - 2; l >= 0; l--) {
      const layer = net.layers[l];
      const nextLayer = net.layers[l + 1];
      const nextDelta = deltas[l + 1];
      const aL2 = layer.lastA!;
      const d = new Array(layer.W.length);
      for (let i = 0; i < layer.W.length; i++) {
        let s = 0;
        for (let k = 0; k < nextLayer.W.length; k++) {
          s += nextLayer.W[k][i] * nextDelta[k];
        }
        d[i] = s * dtanh(aL2[i]);
      }
      deltas[l] = d;
    }
    // Accumulate gradients
    for (let l = 0; l < L; l++) {
      const layer = net.layers[l];
      const input = layer.lastInput!;
      const d = deltas[l];
      for (let i = 0; i < layer.W.length; i++) {
        gb[l][i] += d[i];
        for (let j = 0; j < layer.W[i].length; j++) {
          gW[l][i][j] += d[i] * input[j];
        }
      }
    }
  }

  // Apply averaged gradients.
  const n = batch.length;
  for (let l = 0; l < L; l++) {
    const layer = net.layers[l];
    for (let i = 0; i < layer.W.length; i++) {
      layer.b[i] -= (lr * gb[l][i]) / n;
      for (let j = 0; j < layer.W[i].length; j++) {
        layer.W[i][j] -= (lr * gW[l][i][j]) / n;
      }
    }
  }

  return lossSum / n;
}

// ---------- Toy datasets ----------

function pseudoRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return (s >>> 0) / 0x100000000;
  };
}

function makeDataset(
  task: Task,
  topology: Topology,
  n = 160,
  seed = 7,
): Array<{ x: number[]; y: number }> {
  const r = pseudoRandom(seed);
  const out: Array<{ x: number[]; y: number }> = [];
  // Inputs in [-1, 1] × [-1, 1].
  const featurize = (x: number, y: number): number[] => {
    if (topology === "3-8-8-1") return [x, y, x * y];
    return [x, y];
  };
  if (task === "xor") {
    // Four blobs at the corners (centred at ±0.6 with σ≈0.18).
    for (let i = 0; i < n; i++) {
      const cx = r() < 0.5 ? -0.6 : 0.6;
      const cy = r() < 0.5 ? -0.6 : 0.6;
      const px = cx + (r() - 0.5) * 0.35;
      const py = cy + (r() - 0.5) * 0.35;
      const label = (cx * cy < 0 ? 1 : 0) as 0 | 1;
      out.push({ x: featurize(px, py), y: label });
    }
  } else if (task === "moons") {
    // sklearn-style two-moons.
    for (let i = 0; i < n; i++) {
      const top = r() < 0.5;
      const t = r() * Math.PI;
      let px: number;
      let py: number;
      if (top) {
        px = Math.cos(t) * 0.7 - 0.25;
        py = Math.sin(t) * 0.7 - 0.15;
      } else {
        px = 1 - Math.cos(t) * 0.7 - 0.75;
        py = -Math.sin(t) * 0.7 + 0.15;
      }
      px += (r() - 0.5) * 0.12;
      py += (r() - 0.5) * 0.12;
      out.push({ x: featurize(px, py), y: top ? 1 : 0 });
    }
  } else {
    // Circle inside square: label 1 if r < 0.5, else 0.
    for (let i = 0; i < n; i++) {
      const px = r() * 1.7 - 0.85;
      const py = r() * 1.7 - 0.85;
      const rad = Math.hypot(px, py);
      const label = rad < 0.55 ? 1 : 0;
      out.push({ x: featurize(px, py), y: label });
    }
  }
  return out;
}

// ---------- Component ----------

const GRID_RES = 48; // decision-boundary resolution.
const CONVERGED_LOSS = 0.02;

export default function BackpropExplorer() {
  const { u, locale, a } = useI18n();
  const x = E[locale];
  // Atlas card copy for the side panel.
  const topic = a.topics.backprop ?? {
    title: "Backpropagation",
    tagline: "Gradient descent on a chain rule",
    body: "",
  };

  const [topology, setTopology] = useState<Topology>("2-4-4-1");
  const [task, setTask] = useState<Task>("xor");
  const [lr, setLr] = useState(0.3);
  const [batchSize, setBatchSize] = useState(16);
  const [epsPerSec, setEpsPerSec] = useState(60);
  const [running, setRunning] = useState(false);

  const seedRef = useRef(1);
  const netRef = useRef<Net>(makeNet(topology, seedRef.current));
  const datasetRef = useRef(makeDataset(task, topology));
  const [tick, setTick] = useState(0);
  const [losses, setLosses] = useState<number[]>([]);
  const [epoch, setEpoch] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const lastFrameRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);

  // Rebuild network whenever topology or seed changes; rebuild dataset
  // whenever task or topology (because feature length depends on topology).
  const reset = useCallback(() => {
    seedRef.current = ((seedRef.current * 7 + 31) >>> 0) || 1;
    netRef.current = makeNet(topology, seedRef.current);
    datasetRef.current = makeDataset(task, topology, 160, 7);
    setLosses([]);
    setEpoch(0);
    setAccuracy(0);
    setTick((t) => t + 1);
  }, [topology, task]);

  useEffect(() => {
    // Whenever topology or task changes, force a fresh net + dataset.
    reset();
  }, [reset]);

  // Training step: one batch.
  const stepOnce = useCallback(() => {
    const ds = datasetRef.current;
    const net = netRef.current;
    // Sample a random mini-batch with replacement.
    const batch: Array<{ x: number[]; y: number }> = [];
    for (let i = 0; i < batchSize; i++) {
      batch.push(ds[Math.floor(Math.random() * ds.length)]);
    }
    const loss = trainBatch(net, batch, lr);

    setLosses((ls) => {
      const merged = [...ls, loss];
      return merged.length > 320 ? merged.slice(-320) : merged;
    });
    setEpoch((e) => e + 1);

    // Accuracy across the whole dataset (cheap — ≤ 160 forward passes).
    let correct = 0;
    for (const { x: xi, y: yi } of ds) {
      const yh = forward(net, xi);
      if ((yh > 0.5 ? 1 : 0) === yi) correct++;
    }
    setAccuracy(correct / ds.length);
    setTick((t) => t + 1);
  }, [batchSize, lr]);

  // rAF training loop.
  useEffect(() => {
    if (!running) return;
    let alive = true;
    const tickFn = (now: number) => {
      if (!alive) return;
      const last = lastFrameRef.current || now;
      const dt = (now - last) / 1000;
      // How many epochs we should run this frame to hit epsPerSec.
      let need = Math.max(1, Math.round(dt * epsPerSec));
      // Cap so a long-paused tab doesn't pile up.
      need = Math.min(need, 12);
      for (let i = 0; i < need; i++) stepOnce();
      lastFrameRef.current = now;
      rafRef.current = requestAnimationFrame(tickFn);
    };
    rafRef.current = requestAnimationFrame(tickFn);
    return () => {
      alive = false;
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      lastFrameRef.current = 0;
    };
  }, [running, stepOnce, epsPerSec]);

  // Decision-boundary canvas render.
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = canvas.clientWidth;
    const H = canvas.clientHeight;
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Background.
    ctx.fillStyle = "#06070d";
    ctx.fillRect(0, 0, W, H);

    // Build a low-resolution heatmap by sampling the net on a grid.
    const cellW = W / GRID_RES;
    const cellH = H / GRID_RES;
    const net = netRef.current;
    const featurize = (px: number, py: number): number[] =>
      topology === "3-8-8-1" ? [px, py, px * py] : [px, py];

    for (let gy = 0; gy < GRID_RES; gy++) {
      for (let gx = 0; gx < GRID_RES; gx++) {
        const px = (gx / (GRID_RES - 1)) * 2 - 1;
        const py = (gy / (GRID_RES - 1)) * 2 - 1;
        const o = forward(net, featurize(px, py));
        // Class 1 = amber #ffd166, class 0 = cyan #7df3ff.
        const r1 = 255 * o + 125 * (1 - o);
        const g1 = 209 * o + 243 * (1 - o);
        const b1 = 102 * o + 255 * (1 - o);
        ctx.fillStyle = `rgba(${r1 | 0}, ${g1 | 0}, ${b1 | 0}, 0.35)`;
        ctx.fillRect(gx * cellW, gy * cellH, cellW + 1, cellH + 1);
      }
    }

    // Decision boundary line at ŷ = 0.5: re-sample at fine grid, draw
    // contour by squared marker. Cheap version — colour cells where the
    // boundary crosses by checking sign changes vs neighbours.
    ctx.strokeStyle = "rgba(20, 23, 36, 0.55)";
    ctx.lineWidth = 1.2;
    for (let gy = 0; gy < GRID_RES - 1; gy++) {
      for (let gx = 0; gx < GRID_RES - 1; gx++) {
        const px = (gx / (GRID_RES - 1)) * 2 - 1;
        const py = (gy / (GRID_RES - 1)) * 2 - 1;
        const pxN = ((gx + 1) / (GRID_RES - 1)) * 2 - 1;
        const pyN = ((gy + 1) / (GRID_RES - 1)) * 2 - 1;
        const a00 = forward(net, featurize(px, py));
        const a10 = forward(net, featurize(pxN, py));
        const a01 = forward(net, featurize(px, pyN));
        if ((a00 - 0.5) * (a10 - 0.5) < 0 || (a00 - 0.5) * (a01 - 0.5) < 0) {
          ctx.fillStyle = "rgba(234, 236, 243, 0.7)";
          ctx.fillRect(gx * cellW + cellW * 0.4, gy * cellH + cellH * 0.4, 1.4, 1.4);
        }
      }
    }

    // Draw training points.
    const ds = datasetRef.current;
    for (const { x: xi, y: yi } of ds) {
      const px = ((xi[0] + 1) / 2) * W;
      const py = ((xi[1] + 1) / 2) * H;
      ctx.beginPath();
      ctx.arc(px, py, 3.2, 0, Math.PI * 2);
      ctx.fillStyle = yi === 1 ? "rgba(255,209,102,0.95)" : "rgba(125,243,255,0.95)";
      ctx.fill();
      ctx.strokeStyle = "rgba(6,7,13,0.9)";
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }
  }, [tick, topology, task]);

  // Loss chart.
  const lossPath = useMemo(() => {
    if (losses.length < 2) return "";
    const W = 380;
    const H = 90;
    const maxL = Math.max(0.05, ...losses);
    return losses
      .map((l, i) => {
        const px = (i / Math.max(1, losses.length - 1)) * W;
        const py = H - (l / maxL) * (H - 6) - 3;
        return `${i === 0 ? "M" : "L"} ${px.toFixed(1)} ${py.toFixed(1)}`;
      })
      .join(" ");
  }, [losses]);

  // Status indicator.
  const minRecentLoss = losses.length > 4 ? Math.min(...losses.slice(-12)) : 1;
  const status: "init" | "training" | "converged" | "paused" =
    epoch === 0
      ? "init"
      : !running
        ? "paused"
        : minRecentLoss < CONVERGED_LOSS
          ? "converged"
          : "training";
  const statusBadge =
    status === "init"
      ? x.initBadge
      : status === "paused"
        ? x.pausedBadge
        : status === "converged"
          ? x.convergedBadge
          : x.trainingBadge;
  const statusColor =
    status === "converged"
      ? "text-signal-teal"
      : status === "training"
        ? "text-signal-cyan"
        : "text-ink-300";
  const whatYouSee =
    status === "init" || status === "paused"
      ? x.whatYouSeeInit
      : status === "converged"
        ? x.whatYouSeeConverged
        : x.whatYouSeeTraining;

  return (
    <main className="flex min-h-screen flex-col pt-14">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_440px]">
        <div className="relative flex min-h-[60vh] flex-col gap-4 bg-ink-950 p-4 lg:min-h-[calc(100vh-3.5rem)] lg:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              {x.decisionLabel} · {x.taskOptions[task]}
            </div>
            <div
              className={`glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 ${statusColor}`}
            >
              {statusBadge} · {x.epochLabel} {epoch} · {x.accuracyLabel} {(accuracy * 100).toFixed(0)}%
            </div>
          </div>
          <div className="hairline relative flex-1 overflow-hidden rounded-2xl border bg-ink-950">
            <canvas ref={canvasRef} className="block h-full w-full" />
          </div>
          <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
            {x.decisionHint}
          </div>

          {/* Loss chart, always visible below the boundary. */}
          <div className="hairline rounded-2xl border bg-ink-950/60 p-4">
            <div className="mb-2 flex items-baseline justify-between">
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-teal">
                {x.lossLabel}
              </div>
              <div className="font-mono text-[10px] text-ink-400">
                {losses.length > 0 ? losses[losses.length - 1].toFixed(4) : "—"}
              </div>
            </div>
            <svg
              viewBox="0 0 380 90"
              preserveAspectRatio="none"
              className="block h-20 w-full"
              role="img"
              aria-label="Training loss curve"
            >
              <line x1="0" y1="87" x2="380" y2="87" stroke="rgba(138,144,164,0.3)" />
              {lossPath && (
                <path d={lossPath} fill="none" stroke="#ffd166" strokeWidth="1.4" />
              )}
            </svg>
          </div>
        </div>

        <aside className="hairline scrollbar-thin flex flex-col overflow-y-auto border-l bg-ink-900/40">
          <div className="hairline space-y-3 border-b p-6">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-teal">
              {topic.title}
            </div>
            <h1 className="math-italic text-3xl leading-tight text-ink-100">{topic.tagline}</h1>
            {topic.body && (
              <p className="text-sm leading-relaxed text-ink-200">{topic.body}</p>
            )}
          </div>

          {/* Topology */}
          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {x.topologyLabel}
            </div>
            <div className="grid grid-cols-1 gap-2">
              {(Object.keys(TOPOLOGY_SIZES) as Topology[]).map((t) => {
                const active = topology === t;
                return (
                  <button
                    key={t}
                    onClick={() => setTopology(t)}
                    className={`rounded-md border px-3 py-2 text-left font-mono text-[11px] transition-colors ${
                      active
                        ? "border-signal-teal/60 bg-signal-teal/10 text-signal-teal"
                        : "hairline text-ink-200 hover:border-signal-teal/40 hover:text-ink-100"
                    }`}
                  >
                    {x.topologyOptions[t]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Task */}
          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {x.taskLabel}
            </div>
            <div className="grid grid-cols-1 gap-2">
              {(Object.keys(x.taskOptions) as Task[]).map((t) => {
                const active = task === t;
                return (
                  <button
                    key={t}
                    onClick={() => setTask(t)}
                    className={`rounded-md border px-3 py-2 text-left font-mono text-[11px] transition-colors ${
                      active
                        ? "border-signal-teal/60 bg-signal-teal/10 text-signal-teal"
                        : "hairline text-ink-200 hover:border-signal-teal/40 hover:text-ink-100"
                    }`}
                  >
                    {x.taskOptions[t]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sliders */}
          <div className="hairline space-y-5 border-b p-5">
            <SliderRow
              label={x.learningRate}
              value={lr}
              display={lr.toFixed(2)}
              min={0.01}
              max={1.0}
              step={0.01}
              onChange={setLr}
            />
            <SliderRow
              label={x.batchSize}
              value={batchSize}
              display={`${batchSize}`}
              min={1}
              max={64}
              step={1}
              onChange={(v) => setBatchSize(Math.round(v))}
            />
            <SliderRow
              label={x.epochs}
              value={epsPerSec}
              display={`${epsPerSec}`}
              min={5}
              max={240}
              step={5}
              onChange={(v) => setEpsPerSec(Math.round(v))}
            />
          </div>

          {/* Controls */}
          <div className="hairline grid grid-cols-2 gap-2 border-b p-5">
            <button
              onClick={() => setRunning((r) => !r)}
              className="rounded-md border border-signal-teal/60 bg-signal-teal/10 px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-teal transition-colors hover:bg-signal-teal/20"
            >
              {running ? x.pause : x.play}
            </button>
            <button
              onClick={stepOnce}
              className="hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200 transition-colors hover:text-ink-100"
            >
              {x.step}
            </button>
            <button
              onClick={reset}
              className="hairline col-span-2 rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200 transition-colors hover:text-ink-100"
            >
              {x.reset}
            </button>
          </div>

          {/* What you're seeing */}
          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {x.whatYouSeeLabel}
            </div>
            <p className="text-[12px] leading-relaxed text-ink-200">{whatYouSee}</p>
          </div>

          <div className="p-5">
            <Link
              href="/backprop"
              className="hairline block w-full rounded-md border py-2 text-center font-mono text-[10px] uppercase tracking-widest2 text-ink-300 transition-colors hover:border-signal-teal/40 hover:text-signal-teal"
            >
              {u.back}
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}

function SliderRow({
  label,
  value,
  display,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between">
        <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">{label}</div>
        <div className="font-mono text-[11px] text-signal-teal">{display}</div>
      </div>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-signal-teal"
      />
    </div>
  );
}
