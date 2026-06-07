"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import type { Locale } from "@/lib/i18n/types";

// --------------------------------------------------------------------------
// Diffusion Explorer — a 2D denoising trainer + sampler.
//
// We build a tiny score network ε_θ : R² × [0,1] → R² that predicts the
// noise added to a clean 2D point at noise level t. The dataset is one of
// three small synthetic toy distributions (two-moons, three Gaussian blobs,
// or a swiss spiral). Train with the DDPM loss:
//
//   L = E_{x₀,t,ε}  ‖ ε  −  ε_θ( √ᾱ_t · x₀ + √(1−ᾱ_t) · ε,  t ) ‖²
//
// Sample by running the reverse chain from x_T ~ N(0, I) back to t=0.
// Everything lives in plain JS — no TensorFlow.js, no library.
// --------------------------------------------------------------------------

type DatasetKind = "moons" | "blobs" | "spiral";
type Schedule = "linear" | "cosine";

// --------------------------------------------------------------------------
// Per-locale UI strings. Kept inline so the multi-locale prose lives next
// to the explorer it serves and doesn't fatten the shared i18n bundles.
// --------------------------------------------------------------------------

type RichExplorer = {
  topicTitle: string;
  topicTagline: string;
  topicBody: string;
  scatterBadge: string;
  formulaBadge: string;
  datasetLabel: string;
  datasetMoons: string;
  datasetBlobs: string;
  datasetSpiral: string;
  scheduleLabel: string;
  scheduleLinear: string;
  scheduleCosine: string;
  stepsLabel: string;
  stepsUnit: string;
  samplesLabel: string;
  samplesUnit: string;
  trainButton: string;
  trainingButton: string;
  sampleButton: string;
  resetButton: string;
  legendData: string;
  legendSamples: string;
  legendTrails: string;
  trainStatus: (epoch: number, loss: number) => string;
  trainIdle: string;
  trainDone: (loss: number) => string;
  whatYouSeeLabel: string;
  whatYouSeeP1: string;
  whatYouSeeP2: string;
};

const EXPLORER: Record<Locale, RichExplorer> = {
  en: {
    topicTitle: "Topic · Diffusion",
    topicTagline: "Train a tiny denoiser, then sample fresh data from pure noise.",
    topicBody:
      "A small MLP learns to predict the noise added to a clean 2D point at any noise level. Once trained, it can walk pure Gaussian noise back onto the data manifold — the same trick that turns static into Stable Diffusion images, miniaturised so the whole process fits on screen.",
    scatterBadge: "2D toy diffusion",
    formulaBadge: "ε_θ(x_t, t) ≈ ε",
    datasetLabel: "Dataset",
    datasetMoons: "two moons",
    datasetBlobs: "three blobs",
    datasetSpiral: "swiss spiral",
    scheduleLabel: "Noise schedule",
    scheduleLinear: "linear β",
    scheduleCosine: "cosine ᾱ",
    stepsLabel: "Diffusion steps T",
    stepsUnit: "steps",
    samplesLabel: "Samples to draw",
    samplesUnit: "points",
    trainButton: "▶ Train denoiser",
    trainingButton: "❚❚ Training…",
    sampleButton: "✦ Sample from noise",
    resetButton: "↺ Reset",
    legendData: "data distribution",
    legendSamples: "generated samples",
    legendTrails: "reverse-process trail",
    trainStatus: (e, l) => `epoch ${e} · loss ${l.toFixed(4)}`,
    trainIdle: "Press Train to fit the score network on the chosen dataset.",
    trainDone: (l) => `done · final loss ${l.toFixed(4)} · press Sample to generate`,
    whatYouSeeLabel: "What you are seeing",
    whatYouSeeP1:
      "Cyan dots: a fixed sample drawn from the toy data distribution. The denoiser only ever sees these (noised) during training — it never memorises positions; it learns the local 'which way is in?' field.",
    whatYouSeeP2:
      "Rose dots: fresh samples drawn from pure 2D Gaussian noise and walked T steps backward through the reverse chain. With enough training, the walkers concentrate on the same manifold as the data — diffusion in miniature.",
  },
  de: {
    topicTitle: "Thema · Diffusion",
    topicTagline: "Trainiere einen winzigen Entrauscher und ziehe frische Daten aus reinem Rauschen.",
    topicBody:
      "Ein kleiner MLP lernt, das Rauschen vorherzusagen, das einem sauberen 2D-Punkt auf jeder Stufe hinzugefügt wurde. Einmal trainiert, kann er reines Gauß-Rauschen zurück auf die Datenmannigfaltigkeit laufen lassen — derselbe Trick, der Bildrauschen in Stable-Diffusion-Bilder verwandelt, miniaturisiert, sodass der ganze Vorgang auf den Bildschirm passt.",
    scatterBadge: "2D-Spielzeug-Diffusion",
    formulaBadge: "ε_θ(x_t, t) ≈ ε",
    datasetLabel: "Datensatz",
    datasetMoons: "zwei Monde",
    datasetBlobs: "drei Cluster",
    datasetSpiral: "Schweizer Spirale",
    scheduleLabel: "Rauschplan",
    scheduleLinear: "linear β",
    scheduleCosine: "kosinus ᾱ",
    stepsLabel: "Diffusionsschritte T",
    stepsUnit: "Schritte",
    samplesLabel: "Anzahl Stichproben",
    samplesUnit: "Punkte",
    trainButton: "▶ Entrauscher trainieren",
    trainingButton: "❚❚ Trainiert…",
    sampleButton: "✦ Aus Rauschen ziehen",
    resetButton: "↺ Zurücksetzen",
    legendData: "Datenverteilung",
    legendSamples: "erzeugte Proben",
    legendTrails: "Rückwärts-Pfade",
    trainStatus: (e, l) => `Epoche ${e} · Verlust ${l.toFixed(4)}`,
    trainIdle: "Drücke Trainieren, um das Score-Netz auf den Datensatz anzupassen.",
    trainDone: (l) => `fertig · Endverlust ${l.toFixed(4)} · drücke Ziehen, um zu generieren`,
    whatYouSeeLabel: "Was du siehst",
    whatYouSeeP1:
      "Cyan-Punkte: eine feste Stichprobe aus der Spielzeug-Datenverteilung. Der Entrauscher sieht diese nur (verrauscht) während des Trainings — er merkt sich keine Positionen, sondern lernt das lokale „wo ist innen?\"-Feld.",
    whatYouSeeP2:
      "Rosa-Punkte: frische Proben aus reinem 2D-Gauß-Rauschen, durch T Schritte rückwärts durch die Kette gelaufen. Mit ausreichend Training sammeln sich die Wanderer auf derselben Mannigfaltigkeit wie die Daten — Diffusion en miniature.",
  },
  es: {
    topicTitle: "Tema · Difusión",
    topicTagline: "Entrena un denoiser diminuto y luego genera datos nuevos a partir de ruido puro.",
    topicBody:
      "Un MLP pequeño aprende a predecir el ruido añadido a un punto 2D limpio en cualquier nivel. Una vez entrenado, puede caminar ruido gaussiano puro de vuelta a la variedad de los datos — el mismo truco que convierte estática en imágenes de Stable Diffusion, en miniatura para que todo el proceso quepa en pantalla.",
    scatterBadge: "difusión 2D de juguete",
    formulaBadge: "ε_θ(x_t, t) ≈ ε",
    datasetLabel: "Conjunto de datos",
    datasetMoons: "dos lunas",
    datasetBlobs: "tres manchas",
    datasetSpiral: "espiral suiza",
    scheduleLabel: "Calendario de ruido",
    scheduleLinear: "β lineal",
    scheduleCosine: "ᾱ coseno",
    stepsLabel: "Pasos de difusión T",
    stepsUnit: "pasos",
    samplesLabel: "Muestras a generar",
    samplesUnit: "puntos",
    trainButton: "▶ Entrenar denoiser",
    trainingButton: "❚❚ Entrenando…",
    sampleButton: "✦ Muestrear desde ruido",
    resetButton: "↺ Reiniciar",
    legendData: "distribución de datos",
    legendSamples: "muestras generadas",
    legendTrails: "rastro del proceso inverso",
    trainStatus: (e, l) => `época ${e} · pérdida ${l.toFixed(4)}`,
    trainIdle: "Pulsa Entrenar para ajustar la red de score al conjunto elegido.",
    trainDone: (l) => `listo · pérdida final ${l.toFixed(4)} · pulsa Muestrear para generar`,
    whatYouSeeLabel: "Lo que estás viendo",
    whatYouSeeP1:
      "Puntos cian: una muestra fija extraída de la distribución de datos de juguete. El denoiser sólo las ve (ruidosas) durante el entrenamiento — no memoriza posiciones; aprende el campo local de «¿hacia dónde está el interior?».",
    whatYouSeeP2:
      "Puntos rosa: muestras nuevas extraídas de ruido gaussiano 2D puro y caminadas T pasos hacia atrás por la cadena inversa. Con suficiente entrenamiento, los caminantes se concentran en la misma variedad que los datos — difusión en miniatura.",
  },
  fr: {
    topicTitle: "Sujet · Diffusion",
    topicTagline: "Entraîne un débruiteur minuscule puis échantillonne des données neuves depuis du bruit pur.",
    topicBody:
      "Un petit MLP apprend à prédire le bruit ajouté à un point 2D propre à n'importe quel niveau. Une fois entraîné, il peut ramener du bruit gaussien pur vers la variété des données — le même truc qui transforme le grésillement en images Stable Diffusion, miniaturisé pour tenir à l'écran.",
    scatterBadge: "diffusion 2D jouet",
    formulaBadge: "ε_θ(x_t, t) ≈ ε",
    datasetLabel: "Jeu de données",
    datasetMoons: "deux lunes",
    datasetBlobs: "trois amas",
    datasetSpiral: "spirale suisse",
    scheduleLabel: "Calendrier de bruit",
    scheduleLinear: "β linéaire",
    scheduleCosine: "ᾱ cosinus",
    stepsLabel: "Pas de diffusion T",
    stepsUnit: "pas",
    samplesLabel: "Échantillons à tirer",
    samplesUnit: "points",
    trainButton: "▶ Entraîner le débruiteur",
    trainingButton: "❚❚ Entraînement…",
    sampleButton: "✦ Échantillonner depuis le bruit",
    resetButton: "↺ Réinitialiser",
    legendData: "distribution des données",
    legendSamples: "échantillons générés",
    legendTrails: "trace du processus inverse",
    trainStatus: (e, l) => `époque ${e} · perte ${l.toFixed(4)}`,
    trainIdle: "Appuie sur Entraîner pour ajuster le réseau de score au jeu choisi.",
    trainDone: (l) => `terminé · perte finale ${l.toFixed(4)} · appuie sur Échantillonner pour générer`,
    whatYouSeeLabel: "Ce que tu vois",
    whatYouSeeP1:
      "Points cyan : un échantillon fixe tiré de la distribution de données jouet. Le débruiteur ne les voit (bruités) que pendant l'entraînement — il ne mémorise pas les positions ; il apprend le champ local du « par où est l'intérieur ? ».",
    whatYouSeeP2:
      "Points roses : échantillons frais tirés de bruit gaussien 2D pur et parcourus T pas à l'envers par la chaîne inverse. Avec assez d'entraînement, les marcheurs se concentrent sur la même variété que les données — diffusion en miniature.",
  },
  it: {
    topicTitle: "Tema · Diffusione",
    topicTagline: "Addestra un denoiser minuscolo, poi campiona dati nuovi da rumore puro.",
    topicBody:
      "Un piccolo MLP impara a predire il rumore aggiunto a un punto 2D pulito a qualsiasi livello. Una volta addestrato, può percorrere rumore gaussiano puro all'indietro fino alla varietà dei dati — lo stesso trucco che trasforma il fruscio nelle immagini di Stable Diffusion, in miniatura, tutto in una schermata.",
    scatterBadge: "diffusione 2D giocattolo",
    formulaBadge: "ε_θ(x_t, t) ≈ ε",
    datasetLabel: "Dataset",
    datasetMoons: "due lune",
    datasetBlobs: "tre nuvole",
    datasetSpiral: "spirale svizzera",
    scheduleLabel: "Calendario di rumore",
    scheduleLinear: "β lineare",
    scheduleCosine: "ᾱ coseno",
    stepsLabel: "Passi di diffusione T",
    stepsUnit: "passi",
    samplesLabel: "Campioni da estrarre",
    samplesUnit: "punti",
    trainButton: "▶ Addestra denoiser",
    trainingButton: "❚❚ Addestramento…",
    sampleButton: "✦ Campiona dal rumore",
    resetButton: "↺ Reset",
    legendData: "distribuzione dei dati",
    legendSamples: "campioni generati",
    legendTrails: "scia del processo inverso",
    trainStatus: (e, l) => `epoca ${e} · perdita ${l.toFixed(4)}`,
    trainIdle: "Premi Addestra per adattare la rete di score al dataset scelto.",
    trainDone: (l) => `fatto · perdita finale ${l.toFixed(4)} · premi Campiona per generare`,
    whatYouSeeLabel: "Ciò che stai vedendo",
    whatYouSeeP1:
      "Punti ciano: un campione fisso preso dalla distribuzione giocattolo. Il denoiser li vede solo (rumorosi) durante l'addestramento — non memorizza posizioni; impara il campo locale del «da che parte sta dentro?».",
    whatYouSeeP2:
      "Punti rosa: campioni nuovi presi da rumore gaussiano 2D puro e percorsi T passi all'indietro lungo la catena inversa. Con abbastanza addestramento, i camminatori si concentrano sulla stessa varietà dei dati — diffusione in miniatura.",
  },
  pt: {
    topicTitle: "Tema · Difusão",
    topicTagline: "Treina um denoiser minúsculo, depois amostra dados novos a partir de ruído puro.",
    topicBody:
      "Um pequeno MLP aprende a prever o ruído adicionado a um ponto 2D limpo em qualquer nível. Uma vez treinado, pode caminhar ruído gaussiano puro de volta à variedade dos dados — o mesmo truque que transforma chuvisco em imagens Stable Diffusion, em miniatura, com todo o processo a caber no ecrã.",
    scatterBadge: "difusão 2D de brincadeira",
    formulaBadge: "ε_θ(x_t, t) ≈ ε",
    datasetLabel: "Conjunto de dados",
    datasetMoons: "duas luas",
    datasetBlobs: "três manchas",
    datasetSpiral: "espiral suíça",
    scheduleLabel: "Calendário de ruído",
    scheduleLinear: "β linear",
    scheduleCosine: "ᾱ cosseno",
    stepsLabel: "Passos de difusão T",
    stepsUnit: "passos",
    samplesLabel: "Amostras a gerar",
    samplesUnit: "pontos",
    trainButton: "▶ Treinar denoiser",
    trainingButton: "❚❚ A treinar…",
    sampleButton: "✦ Amostrar a partir de ruído",
    resetButton: "↺ Reiniciar",
    legendData: "distribuição dos dados",
    legendSamples: "amostras geradas",
    legendTrails: "rasto do processo inverso",
    trainStatus: (e, l) => `época ${e} · perda ${l.toFixed(4)}`,
    trainIdle: "Carrega em Treinar para ajustar a rede de score ao conjunto escolhido.",
    trainDone: (l) => `pronto · perda final ${l.toFixed(4)} · carrega em Amostrar para gerar`,
    whatYouSeeLabel: "O que estás a ver",
    whatYouSeeP1:
      "Pontos ciano: uma amostra fixa retirada da distribuição de dados de brincadeira. O denoiser só os vê (ruidosos) durante o treino — não memoriza posições; aprende o campo local de «para que lado fica dentro?».",
    whatYouSeeP2:
      "Pontos rosa: amostras novas tiradas de ruído gaussiano 2D puro e percorridas T passos para trás pela cadeia inversa. Com treino suficiente, os caminhantes concentram-se na mesma variedade dos dados — difusão em miniatura.",
  },
  sv: {
    topicTitle: "Ämne · Diffusion",
    topicTagline: "Träna en pytteliten brusborttagare, sampla sedan färska data ur rent brus.",
    topicBody:
      "Ett litet MLP lär sig att förutsäga bruset som tillsattes en ren 2D-punkt på vilken nivå som helst. Väl tränat kan det vandra rent gaussiskt brus tillbaka till datamångfalden — samma trick som förvandlar brus till Stable Diffusion-bilder, i miniformat så att hela processen ryms på skärmen.",
    scatterBadge: "2D-leksaksdiffusion",
    formulaBadge: "ε_θ(x_t, t) ≈ ε",
    datasetLabel: "Dataset",
    datasetMoons: "två månar",
    datasetBlobs: "tre kluster",
    datasetSpiral: "schweizisk spiral",
    scheduleLabel: "Brusschema",
    scheduleLinear: "linjär β",
    scheduleCosine: "kosinus ᾱ",
    stepsLabel: "Diffusionssteg T",
    stepsUnit: "steg",
    samplesLabel: "Antal sampel",
    samplesUnit: "punkter",
    trainButton: "▶ Träna brusborttagare",
    trainingButton: "❚❚ Tränar…",
    sampleButton: "✦ Sampla från brus",
    resetButton: "↺ Återställ",
    legendData: "datafördelning",
    legendSamples: "genererade sampel",
    legendTrails: "spår från bakåtprocessen",
    trainStatus: (e, l) => `epok ${e} · förlust ${l.toFixed(4)}`,
    trainIdle: "Tryck Träna för att passa score-nätet på det valda datasetet.",
    trainDone: (l) => `klart · slutförlust ${l.toFixed(4)} · tryck Sampla för att generera`,
    whatYouSeeLabel: "Det du ser",
    whatYouSeeP1:
      "Cyanprickar: ett fast sampel draget från leksaksdatafördelningen. Brusborttagaren ser dem bara (brusiga) under träning — den minns inte positioner; den lär sig det lokala 'åt vilket håll är inåt?'-fältet.",
    whatYouSeeP2:
      "Rosa prickar: färska sampel dragna från rent 2D-gaussiskt brus och vandrade T steg bakåt genom kedjan. Med tillräcklig träning samlas vandrarna på samma mångfald som datan — diffusion i miniatyr.",
  },
  no: {
    topicTitle: "Tema · Diffusjon",
    topicTagline: "Tren en bitteliten støyfjerner, og sampl deretter ferske data fra ren støy.",
    topicBody:
      "Et lite MLP lærer å forutsi støyen som ble lagt til et rent 2D-punkt på et hvilket som helst nivå. Når det er trent, kan det vandre ren gaussisk støy tilbake til datamangfoldigheten — det samme trikset som gjør snø om til Stable Diffusion-bilder, i miniatyr så hele prosessen får plass på skjermen.",
    scatterBadge: "2D-leketøysdiffusjon",
    formulaBadge: "ε_θ(x_t, t) ≈ ε",
    datasetLabel: "Datasett",
    datasetMoons: "to måner",
    datasetBlobs: "tre klynger",
    datasetSpiral: "sveitsisk spiral",
    scheduleLabel: "Støyplan",
    scheduleLinear: "lineær β",
    scheduleCosine: "kosinus ᾱ",
    stepsLabel: "Diffusjonssteg T",
    stepsUnit: "steg",
    samplesLabel: "Antall prøver",
    samplesUnit: "punkter",
    trainButton: "▶ Tren støyfjerner",
    trainingButton: "❚❚ Trener…",
    sampleButton: "✦ Sampl fra støy",
    resetButton: "↺ Nullstill",
    legendData: "datafordeling",
    legendSamples: "genererte prøver",
    legendTrails: "spor fra bakoverprosessen",
    trainStatus: (e, l) => `epoke ${e} · tap ${l.toFixed(4)}`,
    trainIdle: "Trykk Tren for å tilpasse score-nettet på det valgte datasettet.",
    trainDone: (l) => `ferdig · sluttap ${l.toFixed(4)} · trykk Sampl for å generere`,
    whatYouSeeLabel: "Det du ser",
    whatYouSeeP1:
      "Cyan-prikker: en fast prøve trukket fra leketøys-datafordelingen. Støyfjerneren ser dem kun (støyete) under trening — den memorerer ikke posisjoner; den lærer det lokale 'hvilken vei er innover?'-feltet.",
    whatYouSeeP2:
      "Rosa prikker: ferske prøver trukket fra ren 2D-gaussisk støy og vandret T steg bakover gjennom kjeden. Med nok trening samler vandrerne seg på samme mangfoldighet som dataene — diffusjon i miniatyr.",
  },
};

// --------------------------------------------------------------------------
// Tiny MLP score network ε_θ(x, t) with 2 hidden layers, GELU activations,
// and Adam optimiser. Input is (x, y, sin(t·π), cos(t·π)) — 4 features.
// Output is the 2D noise estimate.
// --------------------------------------------------------------------------

const IN_DIM = 4;
const HID = 24;
const OUT_DIM = 2;

interface MLP {
  W1: Float32Array; // HID × IN_DIM
  b1: Float32Array; // HID
  W2: Float32Array; // HID × HID
  b2: Float32Array; // HID
  W3: Float32Array; // OUT_DIM × HID
  b3: Float32Array; // OUT_DIM
}

// Adam moments — first (m) and second (v) for every parameter array.
interface AdamState {
  mW1: Float32Array;
  vW1: Float32Array;
  mb1: Float32Array;
  vb1: Float32Array;
  mW2: Float32Array;
  vW2: Float32Array;
  mb2: Float32Array;
  vb2: Float32Array;
  mW3: Float32Array;
  vW3: Float32Array;
  mb3: Float32Array;
  vb3: Float32Array;
  step: number;
}

function makeRng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randn(rng: () => number): number {
  // Box-Muller
  const u1 = Math.max(1e-9, rng());
  const u2 = rng();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

function makeMLP(rng: () => number): MLP {
  // He initialisation for GELU/ReLU-like activations.
  const init = (rows: number, cols: number) => {
    const out = new Float32Array(rows * cols);
    const scale = Math.sqrt(2 / cols);
    for (let i = 0; i < out.length; i++) out[i] = randn(rng) * scale;
    return out;
  };
  return {
    W1: init(HID, IN_DIM),
    b1: new Float32Array(HID),
    W2: init(HID, HID),
    b2: new Float32Array(HID),
    W3: init(OUT_DIM, HID),
    b3: new Float32Array(OUT_DIM),
  };
}

function makeAdam(net: MLP): AdamState {
  const z = (n: number) => new Float32Array(n);
  return {
    mW1: z(net.W1.length),
    vW1: z(net.W1.length),
    mb1: z(net.b1.length),
    vb1: z(net.b1.length),
    mW2: z(net.W2.length),
    vW2: z(net.W2.length),
    mb2: z(net.b2.length),
    vb2: z(net.b2.length),
    mW3: z(net.W3.length),
    vW3: z(net.W3.length),
    mb3: z(net.b3.length),
    vb3: z(net.b3.length),
    step: 0,
  };
}

// GELU approximation (tanh-form) and its derivative.
function gelu(z: number): number {
  return (
    0.5 *
    z *
    (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (z + 0.044715 * z * z * z)))
  );
}
function geluPrime(z: number): number {
  // Numerically stable derivative of the tanh-approx GELU.
  const c = Math.sqrt(2 / Math.PI);
  const z3 = z * z * z;
  const inner = c * (z + 0.044715 * z3);
  const t = Math.tanh(inner);
  const sech2 = 1 - t * t;
  return 0.5 * (1 + t) + 0.5 * z * sech2 * c * (1 + 3 * 0.044715 * z * z);
}

// Forward pass over a single (x, t) pair. Returns caches used by backward.
function forward(
  net: MLP,
  inp: Float32Array, // length IN_DIM
): {
  h1: Float32Array; // pre-activation
  a1: Float32Array; // post-activation
  h2: Float32Array;
  a2: Float32Array;
  out: Float32Array;
} {
  // Layer 1
  const h1 = new Float32Array(HID);
  for (let i = 0; i < HID; i++) {
    let s = net.b1[i];
    for (let j = 0; j < IN_DIM; j++) s += net.W1[i * IN_DIM + j] * inp[j];
    h1[i] = s;
  }
  const a1 = new Float32Array(HID);
  for (let i = 0; i < HID; i++) a1[i] = gelu(h1[i]);
  // Layer 2
  const h2 = new Float32Array(HID);
  for (let i = 0; i < HID; i++) {
    let s = net.b2[i];
    for (let j = 0; j < HID; j++) s += net.W2[i * HID + j] * a1[j];
    h2[i] = s;
  }
  const a2 = new Float32Array(HID);
  for (let i = 0; i < HID; i++) a2[i] = gelu(h2[i]);
  // Output layer (linear)
  const out = new Float32Array(OUT_DIM);
  for (let i = 0; i < OUT_DIM; i++) {
    let s = net.b3[i];
    for (let j = 0; j < HID; j++) s += net.W3[i * HID + j] * a2[j];
    out[i] = s;
  }
  return { h1, a1, h2, a2, out };
}

// Accumulate gradients into `grad` buffers from a single sample.
function backward(
  net: MLP,
  inp: Float32Array,
  fwd: ReturnType<typeof forward>,
  dOut: Float32Array, // dL/dout, length OUT_DIM
  grads: {
    gW1: Float32Array;
    gb1: Float32Array;
    gW2: Float32Array;
    gb2: Float32Array;
    gW3: Float32Array;
    gb3: Float32Array;
  },
) {
  // dW3, db3, da2
  const da2 = new Float32Array(HID);
  for (let i = 0; i < OUT_DIM; i++) {
    grads.gb3[i] += dOut[i];
    for (let j = 0; j < HID; j++) {
      grads.gW3[i * HID + j] += dOut[i] * fwd.a2[j];
      da2[j] += dOut[i] * net.W3[i * HID + j];
    }
  }
  // through GELU at layer 2
  const dh2 = new Float32Array(HID);
  for (let i = 0; i < HID; i++) dh2[i] = da2[i] * geluPrime(fwd.h2[i]);
  // dW2, db2, da1
  const da1 = new Float32Array(HID);
  for (let i = 0; i < HID; i++) {
    grads.gb2[i] += dh2[i];
    for (let j = 0; j < HID; j++) {
      grads.gW2[i * HID + j] += dh2[i] * fwd.a1[j];
      da1[j] += dh2[i] * net.W2[i * HID + j];
    }
  }
  // through GELU at layer 1
  const dh1 = new Float32Array(HID);
  for (let i = 0; i < HID; i++) dh1[i] = da1[i] * geluPrime(fwd.h1[i]);
  // dW1, db1
  for (let i = 0; i < HID; i++) {
    grads.gb1[i] += dh1[i];
    for (let j = 0; j < IN_DIM; j++) {
      grads.gW1[i * IN_DIM + j] += dh1[i] * inp[j];
    }
  }
}

function adamStep(
  param: Float32Array,
  grad: Float32Array,
  m: Float32Array,
  v: Float32Array,
  lr: number,
  step: number,
  beta1 = 0.9,
  beta2 = 0.999,
  eps = 1e-8,
) {
  const bc1 = 1 - Math.pow(beta1, step);
  const bc2 = 1 - Math.pow(beta2, step);
  for (let i = 0; i < param.length; i++) {
    m[i] = beta1 * m[i] + (1 - beta1) * grad[i];
    v[i] = beta2 * v[i] + (1 - beta2) * grad[i] * grad[i];
    const mh = m[i] / bc1;
    const vh = v[i] / bc2;
    param[i] -= (lr * mh) / (Math.sqrt(vh) + eps);
  }
}

// --------------------------------------------------------------------------
// Noise schedules — return arrays of α_t and ᾱ_t for t = 1..T (index 0 = t=1).
// --------------------------------------------------------------------------

function buildSchedule(T: number, kind: Schedule): {
  alpha: Float32Array;
  alphaBar: Float32Array;
  beta: Float32Array;
} {
  const alpha = new Float32Array(T);
  const alphaBar = new Float32Array(T);
  const beta = new Float32Array(T);
  if (kind === "linear") {
    const bMin = 0.0001;
    const bMax = 0.02;
    let acc = 1;
    for (let t = 0; t < T; t++) {
      const b = bMin + ((bMax - bMin) * t) / Math.max(1, T - 1);
      beta[t] = b;
      alpha[t] = 1 - b;
      acc *= alpha[t];
      alphaBar[t] = acc;
    }
  } else {
    // Nichol & Dhariwal (2021) cosine schedule.
    const s = 0.008;
    const f = (t: number) => Math.cos(((t / T + s) / (1 + s)) * (Math.PI / 2)) ** 2;
    const f0 = f(0);
    let prev = 1;
    for (let t = 0; t < T; t++) {
      const ab = f(t + 1) / f0;
      alphaBar[t] = Math.max(1e-5, Math.min(0.9999, ab));
      const a = alphaBar[t] / prev;
      alpha[t] = Math.max(1e-5, Math.min(0.9999, a));
      beta[t] = 1 - alpha[t];
      prev = alphaBar[t];
    }
  }
  return { alpha, alphaBar, beta };
}

// --------------------------------------------------------------------------
// Toy 2D datasets — sampled in screen-ish coordinates centred at (0,0),
// roughly in [-2, 2]² so they sit cleanly inside the canvas window.
// --------------------------------------------------------------------------

function sampleDataset(kind: DatasetKind, n: number, rng: () => number): Float32Array {
  const out = new Float32Array(n * 2);
  for (let i = 0; i < n; i++) {
    let x = 0;
    let y = 0;
    if (kind === "moons") {
      const upper = i % 2 === 0;
      const t = rng() * Math.PI;
      if (upper) {
        x = Math.cos(t) - 0.5;
        y = Math.sin(t) - 0.25;
      } else {
        x = 1 - Math.cos(t) - 0.5;
        y = 1 - Math.sin(t) - 0.75;
      }
      // tighten and jitter
      x *= 1.4;
      y *= 1.4;
      x += randn(rng) * 0.06;
      y += randn(rng) * 0.06;
    } else if (kind === "blobs") {
      const k = i % 3;
      const centres = [
        [-1.2, -0.8],
        [1.2, -0.6],
        [0, 1.1],
      ];
      const [cx, cy] = centres[k];
      x = cx + randn(rng) * 0.22;
      y = cy + randn(rng) * 0.22;
    } else {
      // swiss spiral
      const t = rng() * 3.5 + 0.8;
      const r = t * 0.4;
      const sign = i % 2 === 0 ? 1 : -1;
      x = sign * r * Math.cos(t);
      y = sign * r * Math.sin(t);
      x += randn(rng) * 0.05;
      y += randn(rng) * 0.05;
    }
    out[i * 2] = x;
    out[i * 2 + 1] = y;
  }
  return out;
}

// --------------------------------------------------------------------------
// Component
// --------------------------------------------------------------------------

const DATA_N = 256;

export default function DiffusionExplorer() {
  const { u, locale } = useI18n();
  const x = EXPLORER[locale];

  const [dataset, setDataset] = useState<DatasetKind>("moons");
  const [schedule, setSchedule] = useState<Schedule>("cosine");
  const [steps, setSteps] = useState(40);
  const [numSamples, setNumSamples] = useState(160);
  const [training, setTraining] = useState(false);
  const [trainStatus, setTrainStatus] = useState<string>(x.trainIdle);
  const [trained, setTrained] = useState(false);

  // Canvas refs and persistent state held outside React so the training loop
  // and animation can mutate without triggering re-renders for every frame.
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const netRef = useRef<MLP | null>(null);
  const dataRef = useRef<Float32Array | null>(null);
  const samplesRef = useRef<Float32Array | null>(null); // current sample positions (N×2)
  const trailsRef = useRef<Float32Array[] | null>(null); // history of sample positions (recent first)
  const trainAbort = useRef(false);
  const sampleRaf = useRef<number | null>(null);
  const rngRef = useRef(makeRng(0xC0FFEE));

  // Build the dataset whenever the kind changes. Stable seed so refreshes
  // keep the same point cloud — comparisons stay meaningful.
  useEffect(() => {
    const r = makeRng(0xC0FFEE ^ dataset.length);
    dataRef.current = sampleDataset(dataset, DATA_N, r);
    samplesRef.current = null;
    trailsRef.current = null;
    setTrainStatus(x.trainIdle);
    setTrained(false);
    netRef.current = null;
    drawAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataset]);

  // Reset language-dependent status string when the locale changes.
  useEffect(() => {
    if (!trained && !training) setTrainStatus(x.trainIdle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  // -------- training loop --------
  const trainAsync = async () => {
    if (training) return;
    trainAbort.current = false;
    setTraining(true);
    setTrained(false);
    const net = makeMLP(makeRng(0xBEEF));
    netRef.current = net;
    const adam = makeAdam(net);
    const sched = buildSchedule(steps, schedule);
    const data = dataRef.current!;
    const N = data.length / 2;
    const lr = 4e-3;
    const BATCH = 64;
    const EPOCHS = 40;
    const ITERS_PER_EPOCH = 30;
    const rng = rngRef.current;
    const inp = new Float32Array(IN_DIM);
    let lastLoss = 0;
    for (let epoch = 1; epoch <= EPOCHS; epoch++) {
      if (trainAbort.current) break;
      let epochLoss = 0;
      for (let it = 0; it < ITERS_PER_EPOCH; it++) {
        const grads = {
          gW1: new Float32Array(net.W1.length),
          gb1: new Float32Array(net.b1.length),
          gW2: new Float32Array(net.W2.length),
          gb2: new Float32Array(net.b2.length),
          gW3: new Float32Array(net.W3.length),
          gb3: new Float32Array(net.b3.length),
        };
        let lossSum = 0;
        for (let b = 0; b < BATCH; b++) {
          // pick random data point and random timestep
          const idx = Math.floor(rng() * N);
          const x0x = data[idx * 2];
          const x0y = data[idx * 2 + 1];
          const t = Math.floor(rng() * steps);
          const sa = Math.sqrt(sched.alphaBar[t]);
          const sb = Math.sqrt(1 - sched.alphaBar[t]);
          const eX = randn(rng);
          const eY = randn(rng);
          const xtX = sa * x0x + sb * eX;
          const xtY = sa * x0y + sb * eY;
          // input features: (x, y, sin(πt/T), cos(πt/T))
          const tn = (t + 1) / steps;
          inp[0] = xtX;
          inp[1] = xtY;
          inp[2] = Math.sin(Math.PI * tn);
          inp[3] = Math.cos(Math.PI * tn);
          const fwd = forward(net, inp);
          const eHatX = fwd.out[0];
          const eHatY = fwd.out[1];
          const dX = eHatX - eX;
          const dY = eHatY - eY;
          lossSum += dX * dX + dY * dY;
          const dOut = new Float32Array(2);
          // dL/d(out) = 2(out − ε) / BATCH  (mean-squared loss, mean over batch)
          dOut[0] = (2 * dX) / BATCH;
          dOut[1] = (2 * dY) / BATCH;
          backward(net, inp, fwd, dOut, grads);
        }
        adam.step += 1;
        adamStep(net.W1, grads.gW1, adam.mW1, adam.vW1, lr, adam.step);
        adamStep(net.b1, grads.gb1, adam.mb1, adam.vb1, lr, adam.step);
        adamStep(net.W2, grads.gW2, adam.mW2, adam.vW2, lr, adam.step);
        adamStep(net.b2, grads.gb2, adam.mb2, adam.vb2, lr, adam.step);
        adamStep(net.W3, grads.gW3, adam.mW3, adam.vW3, lr, adam.step);
        adamStep(net.b3, grads.gb3, adam.mb3, adam.vb3, lr, adam.step);
        epochLoss += lossSum / BATCH;
      }
      lastLoss = epochLoss / ITERS_PER_EPOCH;
      setTrainStatus(x.trainStatus(epoch, lastLoss));
      // Yield to the browser so the UI can paint between epochs.
      await new Promise<void>((res) => setTimeout(res, 0));
    }
    setTraining(false);
    setTrained(true);
    setTrainStatus(x.trainDone(lastLoss));
  };

  // -------- sampler (animated reverse process) --------
  const sampleAsync = () => {
    if (!netRef.current) return;
    if (sampleRaf.current !== null) cancelAnimationFrame(sampleRaf.current);
    const net = netRef.current;
    const sched = buildSchedule(steps, schedule);
    const rng = rngRef.current;
    // Initialise sample positions ~ N(0, I), scaled to roughly the data extent.
    const xs = new Float32Array(numSamples * 2);
    for (let i = 0; i < numSamples * 2; i++) xs[i] = randn(rng);
    samplesRef.current = xs;
    // Trails: keep last few positions per sample for a fading streak.
    const TRAIL_LEN = 6;
    trailsRef.current = Array.from({ length: TRAIL_LEN }, () => new Float32Array(xs));
    let t = steps - 1;
    const inp = new Float32Array(IN_DIM);
    const stepOnce = () => {
      if (t < 0) return false;
      const ab = sched.alphaBar[t];
      const abPrev = t === 0 ? 1 : sched.alphaBar[t - 1];
      const a = sched.alpha[t];
      const b = sched.beta[t];
      const tn = (t + 1) / steps;
      const sinT = Math.sin(Math.PI * tn);
      const cosT = Math.cos(Math.PI * tn);
      const sqrtA = Math.sqrt(a);
      const sqrtOneMinusAb = Math.sqrt(1 - ab);
      const coef = (1 - a) / sqrtOneMinusAb;
      const sigma = t === 0 ? 0 : Math.sqrt(((1 - abPrev) / (1 - ab)) * b);
      for (let i = 0; i < numSamples; i++) {
        inp[0] = xs[i * 2];
        inp[1] = xs[i * 2 + 1];
        inp[2] = sinT;
        inp[3] = cosT;
        const fwd = forward(net, inp);
        const eHatX = fwd.out[0];
        const eHatY = fwd.out[1];
        const meanX = (1 / sqrtA) * (xs[i * 2] - coef * eHatX);
        const meanY = (1 / sqrtA) * (xs[i * 2 + 1] - coef * eHatY);
        const noiseX = t === 0 ? 0 : randn(rng);
        const noiseY = t === 0 ? 0 : randn(rng);
        xs[i * 2] = meanX + sigma * noiseX;
        xs[i * 2 + 1] = meanY + sigma * noiseY;
      }
      // push to trail buffer (rotate)
      const tr = trailsRef.current!;
      for (let k = tr.length - 1; k > 0; k--) tr[k] = tr[k - 1];
      tr[0] = new Float32Array(xs);
      t -= 1;
      return true;
    };
    const tick = () => {
      // run ~3 reverse steps per animation frame so the user sees the walk.
      for (let k = 0; k < 3; k++) stepOnce();
      drawAll();
      if (t >= 0) {
        sampleRaf.current = requestAnimationFrame(tick);
      } else {
        sampleRaf.current = null;
      }
    };
    sampleRaf.current = requestAnimationFrame(tick);
  };

  const resetSampler = () => {
    if (sampleRaf.current !== null) cancelAnimationFrame(sampleRaf.current);
    sampleRaf.current = null;
    samplesRef.current = null;
    trailsRef.current = null;
    drawAll();
  };

  // -------- drawing --------
  const drawAll = () => {
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
    ctx.fillStyle = "#06070d";
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = "rgba(138,144,164,0.06)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 12; i++) {
      const xg = (i / 12) * W;
      const yg = (i / 12) * H;
      ctx.beginPath();
      ctx.moveTo(xg, 0);
      ctx.lineTo(xg, H);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, yg);
      ctx.lineTo(W, yg);
      ctx.stroke();
    }

    // World-to-screen: data coords roughly in [-2.5, 2.5]² → window.
    const cx = W / 2;
    const cy = H / 2;
    const scale = Math.min(W, H) / 6;
    const project = (px: number, py: number): [number, number] => [
      cx + px * scale,
      cy - py * scale,
    ];

    // Data cloud (cyan)
    const data = dataRef.current;
    if (data) {
      ctx.fillStyle = "rgba(125, 243, 255, 0.55)";
      for (let i = 0; i < data.length; i += 2) {
        const [px, py] = project(data[i], data[i + 1]);
        ctx.beginPath();
        ctx.arc(px, py, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Sample trails (fading)
    const trails = trailsRef.current;
    if (trails) {
      for (let k = trails.length - 1; k >= 1; k--) {
        const buf = trails[k];
        const alpha = 0.06 + 0.18 * (1 - k / trails.length);
        ctx.fillStyle = `rgba(255, 122, 182, ${alpha})`;
        for (let i = 0; i < buf.length; i += 2) {
          const [px, py] = project(buf[i], buf[i + 1]);
          ctx.beginPath();
          ctx.arc(px, py, 1.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Current sample positions (rose, brighter)
    const samples = samplesRef.current;
    if (samples) {
      ctx.fillStyle = "rgba(255, 122, 182, 0.95)";
      for (let i = 0; i < samples.length; i += 2) {
        const [px, py] = project(samples[i], samples[i + 1]);
        ctx.beginPath();
        ctx.arc(px, py, 2.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  // Initial paint + on resize
  useEffect(() => {
    drawAll();
    const ro = new ResizeObserver(() => drawAll());
    if (canvasRef.current) ro.observe(canvasRef.current);
    return () => ro.disconnect();
  }, []);

  // Redraw when toggles change (dataset already handled in its own effect)
  useEffect(() => {
    drawAll();
  }, [schedule, steps, numSamples]);

  // Cleanup
  useEffect(() => {
    return () => {
      trainAbort.current = true;
      if (sampleRaf.current !== null) cancelAnimationFrame(sampleRaf.current);
    };
  }, []);

  return (
    <main className="flex min-h-screen flex-col pt-14">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_420px]">
        {/* Canvas pane */}
        <div className="relative flex min-h-[60vh] flex-col gap-4 bg-ink-950 p-4 lg:min-h-[calc(100vh-3.5rem)] lg:p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              {x.scatterBadge}
            </div>
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-rose">
              {x.formulaBadge}
            </div>
          </div>
          <div className="hairline flex-1 overflow-hidden rounded-2xl border bg-ink-950">
            <canvas ref={canvasRef} className="block h-full w-full" />
          </div>
          <div className="glass hairline flex flex-wrap items-center gap-4 rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
            <span className="flex items-center gap-2">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ background: "rgb(125, 243, 255)" }}
              />
              {x.legendData}
            </span>
            <span className="flex items-center gap-2">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ background: "rgb(255, 122, 182)" }}
              />
              {x.legendSamples}
            </span>
            <span className="flex items-center gap-2">
              <span
                className="inline-block h-2 w-2 rounded-full opacity-40"
                style={{ background: "rgb(255, 122, 182)" }}
              />
              {x.legendTrails}
            </span>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="hairline scrollbar-thin flex flex-col overflow-y-auto border-l bg-ink-900/40">
          <div className="hairline space-y-3 border-b p-6">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-rose">
              {x.topicTitle}
            </div>
            <h1 className="math-italic text-3xl leading-tight text-ink-100">{x.topicTagline}</h1>
            <p className="text-sm leading-relaxed text-ink-200">{x.topicBody}</p>
          </div>

          {/* Dataset picker */}
          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {x.datasetLabel}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  ["moons", x.datasetMoons],
                  ["blobs", x.datasetBlobs],
                  ["spiral", x.datasetSpiral],
                ] as Array<[DatasetKind, string]>
              ).map(([k, label]) => {
                const active = dataset === k;
                return (
                  <button
                    key={k}
                    onClick={() => setDataset(k)}
                    className={`rounded-md border px-2 py-2 font-mono text-[10px] uppercase tracking-widest2 transition-colors ${
                      active
                        ? "border-signal-rose/60 bg-signal-rose/10 text-signal-rose"
                        : "hairline text-ink-200 hover:border-signal-rose/40 hover:text-ink-100"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Schedule */}
          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {x.scheduleLabel}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  ["linear", x.scheduleLinear],
                  ["cosine", x.scheduleCosine],
                ] as Array<[Schedule, string]>
              ).map(([k, label]) => {
                const active = schedule === k;
                return (
                  <button
                    key={k}
                    onClick={() => setSchedule(k)}
                    className={`rounded-md border px-2 py-2 font-mono text-[10px] uppercase tracking-widest2 transition-colors ${
                      active
                        ? "border-signal-rose/60 bg-signal-rose/10 text-signal-rose"
                        : "hairline text-ink-200 hover:border-signal-rose/40 hover:text-ink-100"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Steps slider */}
          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {x.stepsLabel}
            </div>
            <div className="flex items-center justify-between font-mono text-sm">
              <span className="text-signal-rose">{steps}</span>
              <span className="text-[10px] text-ink-400">{x.stepsUnit}</span>
            </div>
            <input
              type="range"
              min={10}
              max={120}
              step={5}
              value={steps}
              onChange={(e) => setSteps(parseInt(e.target.value, 10))}
              className="w-full accent-signal-rose"
            />
          </div>

          {/* Samples slider */}
          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {x.samplesLabel}
            </div>
            <div className="flex items-center justify-between font-mono text-sm">
              <span className="text-signal-rose">{numSamples}</span>
              <span className="text-[10px] text-ink-400">{x.samplesUnit}</span>
            </div>
            <input
              type="range"
              min={20}
              max={400}
              step={10}
              value={numSamples}
              onChange={(e) => setNumSamples(parseInt(e.target.value, 10))}
              className="w-full accent-signal-rose"
            />
          </div>

          {/* Train + sample buttons */}
          <div className="hairline space-y-3 border-b p-5">
            <button
              onClick={trainAsync}
              disabled={training}
              className={`w-full rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 transition-colors ${
                training
                  ? "cursor-not-allowed border-ink-700/40 text-ink-500"
                  : "border-signal-rose/60 bg-signal-rose/10 text-signal-rose hover:bg-signal-rose/20"
              }`}
            >
              {training ? x.trainingButton : x.trainButton}
            </button>
            <button
              onClick={sampleAsync}
              disabled={!trained || training}
              className={`w-full rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 transition-colors ${
                !trained || training
                  ? "cursor-not-allowed border-ink-700/40 text-ink-500"
                  : "border-signal-cyan/60 bg-signal-cyan/10 text-signal-cyan hover:bg-signal-cyan/20"
              }`}
            >
              {x.sampleButton}
            </button>
            <button
              onClick={resetSampler}
              className="hairline w-full rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-300 transition-colors hover:border-signal-rose/40 hover:text-signal-rose"
            >
              {x.resetButton}
            </button>
            <p className="font-mono text-[11px] leading-relaxed text-ink-300">{trainStatus}</p>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {x.whatYouSeeLabel}
            </div>
            <p className="text-[12px] leading-relaxed text-ink-200">{x.whatYouSeeP1}</p>
            <p className="text-[12px] leading-relaxed text-ink-200">{x.whatYouSeeP2}</p>
          </div>

          <div className="p-5">
            <Link
              href="/diffusion"
              className="hairline block w-full rounded-md border py-2 text-center font-mono text-[10px] uppercase tracking-widest2 text-ink-300 transition-colors hover:border-signal-rose/40 hover:text-signal-rose"
            >
              {u.back}
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
