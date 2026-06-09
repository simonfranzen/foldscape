"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import type { Locale } from "@/lib/i18n/types";

// --------------------------------------------------------------------------
// Diffusion Explorer — a 2D denoising trainer + sampler that runs the
// moment the page loads. The visitor walks into a scene already in
// motion: a small score MLP ε_θ : R² × [0,1] → R² is being trained, a
// learned score field is painted as a heatmap behind the data, and a
// fresh cohort of walkers is being denoised from pure Gaussian noise
// onto the toy data manifold. The sampling loops; the training keeps
// improving the field. The DDPM loss is
//
//   L = E_{x₀,t,ε}  ‖ ε  −  ε_θ( √ᾱ_t · x₀ + √(1−ᾱ_t) · ε,  t ) ‖²
//
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
  pauseButton: string;
  resumeButton: string;
  resetModelButton: string;
  legendData: string;
  legendSamples: string;
  legendTrails: string;
  legendField: string;
  // Live status — three independent counters joined into one line.
  statusFmt: (epoch: number, loss: number, sStep: number, sTotal: number) => string;
  // Tiny phase labels under the canvas that update as sampling progresses.
  whatNowLabel: string;
  whatNowTrainingEarly: string;
  whatNowNoise: string;
  whatNowMoving: string;
  whatNowConverged: string;
  whatYouSeeLabel: string;
  whatYouSeeP1: string;
  whatYouSeeP2: string;
};

const EXPLORER: Record<Locale, RichExplorer> = {
  en: {
    topicTitle: "Topic · Diffusion",
    topicTagline: "A score network learns the data field, walkers walk back from noise.",
    topicBody:
      "Training and sampling start the moment the page loads. A small MLP keeps improving its noise prediction in the background; rose walkers continuously denoise themselves from a Gaussian cloud onto the data manifold, restart, and do it again. Switch dataset, schedule or T at any moment — the chain reorganises live.",
    scatterBadge: "2D toy diffusion · live",
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
    samplesLabel: "Walkers",
    samplesUnit: "points",
    pauseButton: "❚❚ Pause",
    resumeButton: "▶ Resume",
    resetModelButton: "↺ Reset model (retrain from scratch)",
    legendData: "data distribution",
    legendSamples: "generated samples",
    legendTrails: "reverse-process trail",
    legendField: "learned score field",
    statusFmt: (e, l, s, S) =>
      `epoch ${e} · loss ${l.toFixed(3)} · sampling step ${s}/${S}`,
    whatNowLabel: "What you should see right now",
    whatNowTrainingEarly:
      "the denoiser is still learning the field — walkers wander before snapping",
    whatNowNoise: "the walkers are still pure noise from N(0, I)",
    whatNowMoving: "the walkers are starting to clump along the data",
    whatNowConverged: "the walkers have collapsed onto the data manifold",
    whatYouSeeLabel: "Reading the canvas",
    whatYouSeeP1:
      "Cyan dots: the toy data distribution. The denoiser sees only noised copies of these during training — it never memorises positions; it learns the local 'which way is in?' field.",
    whatYouSeeP2:
      "Rose dots: walkers drawn from pure 2D Gaussian noise and pushed T steps backward through the learned reverse chain, leaving fading trails behind them. Faint blue under-glow: the magnitude of −ε_θ at mid-noise — the score field the walkers ride down.",
  },
  de: {
    topicTitle: "Thema · Diffusion",
    topicTagline: "Ein Score-Netz lernt das Datenfeld, Wanderer laufen aus Rauschen zurück.",
    topicBody:
      "Training und Sampling starten, sobald die Seite lädt. Ein kleiner MLP verbessert im Hintergrund laufend seine Rauschvorhersage; rosa Wanderer entrauschen sich kontinuierlich aus einer Gauß-Wolke auf die Datenmannigfaltigkeit, starten neu und tun es wieder. Wechsle Datensatz, Schedule oder T jederzeit — die Kette ordnet sich live neu.",
    scatterBadge: "2D-Spielzeug-Diffusion · live",
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
    samplesLabel: "Wanderer",
    samplesUnit: "Punkte",
    pauseButton: "❚❚ Pause",
    resumeButton: "▶ Weiter",
    resetModelButton: "↺ Modell zurücksetzen (neu trainieren)",
    legendData: "Datenverteilung",
    legendSamples: "erzeugte Proben",
    legendTrails: "Rückwärts-Pfade",
    legendField: "gelerntes Score-Feld",
    statusFmt: (e, l, s, S) =>
      `Epoche ${e} · Verlust ${l.toFixed(3)} · Sampling-Schritt ${s}/${S}`,
    whatNowLabel: "Was du gerade sehen solltest",
    whatNowTrainingEarly:
      "der Entrauscher lernt das Feld noch — die Wanderer irren, bevor sie einrasten",
    whatNowNoise: "die Wanderer sind noch reines Rauschen aus N(0, I)",
    whatNowMoving: "die Wanderer beginnen, sich an den Daten zu sammeln",
    whatNowConverged: "die Wanderer sind auf der Datenmannigfaltigkeit gelandet",
    whatYouSeeLabel: "Die Leinwand lesen",
    whatYouSeeP1:
      "Cyan-Punkte: die Spielzeug-Datenverteilung. Der Entrauscher sieht nur verrauschte Kopien davon im Training — er merkt sich keine Positionen, sondern lernt das lokale „wo ist innen?\"-Feld.",
    whatYouSeeP2:
      "Rosa-Punkte: Wanderer aus reinem 2D-Gauß-Rauschen, T Schritte rückwärts durch die gelernte Kette geschoben, mit verblassenden Pfaden. Schwacher blauer Schein: die Stärke von −ε_θ bei mittlerem Rauschen — das Score-Feld, an dem die Wanderer hinabrutschen.",
  },
  es: {
    topicTitle: "Tema · Difusión",
    topicTagline: "Una red de score aprende el campo, los caminantes regresan desde el ruido.",
    topicBody:
      "Entrenamiento y muestreo arrancan en cuanto carga la página. Un MLP pequeño mejora sin parar su predicción de ruido en segundo plano; caminantes rosa se desruidan continuamente desde una nube gaussiana hasta la variedad de datos, reinician y vuelven a hacerlo. Cambia conjunto, calendario o T en cualquier momento — la cadena se reorganiza en vivo.",
    scatterBadge: "difusión 2D · en vivo",
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
    samplesLabel: "Caminantes",
    samplesUnit: "puntos",
    pauseButton: "❚❚ Pausa",
    resumeButton: "▶ Reanudar",
    resetModelButton: "↺ Reiniciar modelo (reentrenar)",
    legendData: "distribución de datos",
    legendSamples: "muestras generadas",
    legendTrails: "rastro del proceso inverso",
    legendField: "campo de score aprendido",
    statusFmt: (e, l, s, S) =>
      `época ${e} · pérdida ${l.toFixed(3)} · paso de muestreo ${s}/${S}`,
    whatNowLabel: "Lo que deberías ver ahora mismo",
    whatNowTrainingEarly:
      "el denoiser aún está aprendiendo el campo — los caminantes vagan antes de fijarse",
    whatNowNoise: "los caminantes son aún ruido puro de N(0, I)",
    whatNowMoving: "los caminantes empiezan a aglutinarse cerca de los datos",
    whatNowConverged: "los caminantes han colapsado sobre la variedad de datos",
    whatYouSeeLabel: "Leer el lienzo",
    whatYouSeeP1:
      "Puntos cian: la distribución de datos. El denoiser sólo ve copias ruidosas durante el entrenamiento — no memoriza posiciones; aprende el campo local de «¿hacia dónde está el interior?».",
    whatYouSeeP2:
      "Puntos rosa: caminantes tomados de ruido gaussiano 2D puro y empujados T pasos hacia atrás por la cadena aprendida, dejando estelas que se desvanecen. Resplandor azul tenue: la magnitud de −ε_θ a ruido medio — el campo de score por el que descienden.",
  },
  fr: {
    topicTitle: "Sujet · Diffusion",
    topicTagline: "Un réseau de score apprend le champ, des marcheurs reviennent du bruit.",
    topicBody:
      "Entraînement et échantillonnage démarrent dès le chargement. Un petit MLP affine sans cesse sa prédiction de bruit en arrière-plan ; des marcheurs roses se débruitent en continu depuis un nuage gaussien jusqu'à la variété des données, redémarrent et recommencent. Change de jeu, de calendrier ou de T à tout moment — la chaîne se réorganise en direct.",
    scatterBadge: "diffusion 2D · en direct",
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
    samplesLabel: "Marcheurs",
    samplesUnit: "points",
    pauseButton: "❚❚ Pause",
    resumeButton: "▶ Reprendre",
    resetModelButton: "↺ Réinitialiser le modèle (ré-entraîner)",
    legendData: "distribution des données",
    legendSamples: "échantillons générés",
    legendTrails: "trace du processus inverse",
    legendField: "champ de score appris",
    statusFmt: (e, l, s, S) =>
      `époque ${e} · perte ${l.toFixed(3)} · pas d'échantillonnage ${s}/${S}`,
    whatNowLabel: "Ce que tu devrais voir maintenant",
    whatNowTrainingEarly:
      "le débruiteur apprend encore le champ — les marcheurs errent avant de s'accrocher",
    whatNowNoise: "les marcheurs sont encore du bruit pur de N(0, I)",
    whatNowMoving: "les marcheurs commencent à se regrouper près des données",
    whatNowConverged: "les marcheurs ont collapsé sur la variété des données",
    whatYouSeeLabel: "Lire le canevas",
    whatYouSeeP1:
      "Points cyan : la distribution des données jouet. Le débruiteur ne les voit (bruités) que pendant l'entraînement — il ne mémorise pas les positions ; il apprend le champ local du « par où est l'intérieur ? ».",
    whatYouSeeP2:
      "Points roses : marcheurs tirés de bruit gaussien 2D pur, poussés T pas à l'envers par la chaîne apprise, laissant des traînées qui s'estompent. Halo bleu pâle : la magnitude de −ε_θ à bruit moyen — le champ de score qu'ils dévalent.",
  },
  it: {
    topicTitle: "Tema · Diffusione",
    topicTagline: "Una rete di score impara il campo, dei camminatori tornano dal rumore.",
    topicBody:
      "Addestramento e campionamento partono appena la pagina carica. Un piccolo MLP continua a migliorare la sua predizione del rumore in background; camminatori rosa si denoisificano di continuo da una nube gaussiana fino alla varietà dei dati, ripartono e lo rifanno. Cambia dataset, calendario o T quando vuoi — la catena si riorganizza dal vivo.",
    scatterBadge: "diffusione 2D · live",
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
    samplesLabel: "Camminatori",
    samplesUnit: "punti",
    pauseButton: "❚❚ Pausa",
    resumeButton: "▶ Riprendi",
    resetModelButton: "↺ Reset modello (ri-addestra)",
    legendData: "distribuzione dei dati",
    legendSamples: "campioni generati",
    legendTrails: "scia del processo inverso",
    legendField: "campo di score appreso",
    statusFmt: (e, l, s, S) =>
      `epoca ${e} · perdita ${l.toFixed(3)} · passo di sampling ${s}/${S}`,
    whatNowLabel: "Cosa dovresti vedere ora",
    whatNowTrainingEarly:
      "il denoiser sta ancora imparando il campo — i camminatori vagano prima di agganciarsi",
    whatNowNoise: "i camminatori sono ancora rumore puro da N(0, I)",
    whatNowMoving: "i camminatori cominciano ad addensarsi vicino ai dati",
    whatNowConverged: "i camminatori sono collassati sulla varietà dei dati",
    whatYouSeeLabel: "Leggere la tela",
    whatYouSeeP1:
      "Punti ciano: la distribuzione giocattolo. Il denoiser li vede solo (rumorosi) durante l'addestramento — non memorizza posizioni; impara il campo locale del «da che parte sta dentro?».",
    whatYouSeeP2:
      "Punti rosa: camminatori presi da rumore gaussiano 2D puro e spinti T passi indietro lungo la catena appresa, lasciando scie sbiadite. Bagliore blu tenue: la magnitudine di −ε_θ a rumore medio — il campo di score lungo cui scivolano.",
  },
  pt: {
    topicTitle: "Tema · Difusão",
    topicTagline: "Uma rede de score aprende o campo, caminhantes voltam do ruído.",
    topicBody:
      "Treino e amostragem arrancam assim que a página carrega. Um pequeno MLP continua a melhorar a sua previsão de ruído em segundo plano; caminhantes rosa removem ruído sem parar a partir de uma nuvem gaussiana até à variedade dos dados, reiniciam e voltam a fazê-lo. Troca de conjunto, calendário ou T a qualquer momento — a cadeia reorganiza-se em direto.",
    scatterBadge: "difusão 2D · em direto",
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
    samplesLabel: "Caminhantes",
    samplesUnit: "pontos",
    pauseButton: "❚❚ Pausar",
    resumeButton: "▶ Retomar",
    resetModelButton: "↺ Reset do modelo (re-treinar)",
    legendData: "distribuição dos dados",
    legendSamples: "amostras geradas",
    legendTrails: "rasto do processo inverso",
    legendField: "campo de score aprendido",
    statusFmt: (e, l, s, S) =>
      `época ${e} · perda ${l.toFixed(3)} · passo de amostragem ${s}/${S}`,
    whatNowLabel: "O que deves estar a ver agora",
    whatNowTrainingEarly:
      "o denoiser ainda está a aprender o campo — os caminhantes vagueiam antes de prender",
    whatNowNoise: "os caminhantes ainda são ruído puro de N(0, I)",
    whatNowMoving: "os caminhantes começam a aglomerar-se junto aos dados",
    whatNowConverged: "os caminhantes colapsaram sobre a variedade dos dados",
    whatYouSeeLabel: "Ler a tela",
    whatYouSeeP1:
      "Pontos ciano: a distribuição de dados de brincadeira. O denoiser só os vê (ruidosos) durante o treino — não memoriza posições; aprende o campo local de «para que lado fica dentro?».",
    whatYouSeeP2:
      "Pontos rosa: caminhantes tirados de ruído gaussiano 2D puro e empurrados T passos para trás pela cadeia aprendida, deixando rastos que se esbatem. Brilho azul ténue: a magnitude de −ε_θ a ruído médio — o campo de score por onde descem.",
  },
  sv: {
    topicTitle: "Ämne · Diffusion",
    topicTagline: "Ett score-nät lär fältet, vandrare går tillbaka från brus.",
    topicBody:
      "Träning och sampling startar i samma stund som sidan laddas. Ett litet MLP fortsätter förbättra sin brusprediktion i bakgrunden; rosa vandrare brusrensar sig oavbrutet från ett gaussiskt moln in på datamångfalden, startar om och gör det igen. Byt dataset, schema eller T när som helst — kedjan organiserar om sig i realtid.",
    scatterBadge: "2D-diffusion · live",
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
    samplesLabel: "Vandrare",
    samplesUnit: "punkter",
    pauseButton: "❚❚ Paus",
    resumeButton: "▶ Återuppta",
    resetModelButton: "↺ Återställ modellen (träna om)",
    legendData: "datafördelning",
    legendSamples: "genererade sampel",
    legendTrails: "spår från bakåtprocessen",
    legendField: "lärt score-fält",
    statusFmt: (e, l, s, S) =>
      `epok ${e} · förlust ${l.toFixed(3)} · samplingssteg ${s}/${S}`,
    whatNowLabel: "Det du borde se just nu",
    whatNowTrainingEarly:
      "brusborttagaren lär sig fortfarande fältet — vandrarna ströar innan de fastnar",
    whatNowNoise: "vandrarna är fortfarande rent brus från N(0, I)",
    whatNowMoving: "vandrarna börjar klumpa sig kring datan",
    whatNowConverged: "vandrarna har kollapsat på datamångfalden",
    whatYouSeeLabel: "Läsa duken",
    whatYouSeeP1:
      "Cyanprickar: leksaksdatafördelningen. Brusborttagaren ser dem bara (brusiga) under träning — den memorerar inte positioner; den lär sig det lokala 'åt vilket håll är inåt?'-fältet.",
    whatYouSeeP2:
      "Rosa prickar: vandrare dragna från rent 2D-gaussiskt brus och puttade T steg bakåt genom den lärda kedjan, med tonande spår. Svagt blått sken: magnituden av −ε_θ vid medelbrus — score-fältet de glider ned för.",
  },
  no: {
    topicTitle: "Tema · Diffusjon",
    topicTagline: "Et score-nett lærer feltet, vandrere går tilbake fra støy.",
    topicBody:
      "Trening og sampling starter i det siden lastes. Et lite MLP fortsetter å forbedre støyprediksjonen i bakgrunnen; rosa vandrere fjerner støy uavbrutt fra en gaussisk sky inn på datamangfoldigheten, starter på nytt og gjør det igjen. Bytt datasett, plan eller T når du vil — kjeden omorganiserer seg live.",
    scatterBadge: "2D-diffusjon · live",
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
    samplesLabel: "Vandrere",
    samplesUnit: "punkter",
    pauseButton: "❚❚ Pause",
    resumeButton: "▶ Gjenoppta",
    resetModelButton: "↺ Tilbakestill modellen (tren på nytt)",
    legendData: "datafordeling",
    legendSamples: "genererte prøver",
    legendTrails: "spor fra bakoverprosessen",
    legendField: "lært score-felt",
    statusFmt: (e, l, s, S) =>
      `epoke ${e} · tap ${l.toFixed(3)} · samplingssteg ${s}/${S}`,
    whatNowLabel: "Det du burde se nå",
    whatNowTrainingEarly:
      "støyfjerneren lærer fortsatt feltet — vandrerne driver før de fester seg",
    whatNowNoise: "vandrerne er fortsatt ren støy fra N(0, I)",
    whatNowMoving: "vandrerne begynner å klumpe seg nær dataene",
    whatNowConverged: "vandrerne har kollapset på datamangfoldigheten",
    whatYouSeeLabel: "Lese lerretet",
    whatYouSeeP1:
      "Cyan-prikker: leketøys-datafordelingen. Støyfjerneren ser dem kun (støyete) under trening — den memorerer ikke posisjoner; den lærer det lokale 'hvilken vei er innover?'-feltet.",
    whatYouSeeP2:
      "Rosa prikker: vandrere trukket fra ren 2D-gaussisk støy og dyttet T steg bakover gjennom den lærte kjeden, med falmende spor. Svakt blått skjær: størrelsen av −ε_θ ved middels støy — score-feltet de glir nedover.",
  },
};

// --------------------------------------------------------------------------
// Tiny MLP score network ε_θ(x, t) with 2 hidden layers, GELU activations,
// and Adam optimiser. Input is (x, y, sin(t·π), cos(t·π)) — 4 features.
// Output is the 2D noise estimate.
// --------------------------------------------------------------------------

const IN_DIM = 4;
const HID = 32;
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
  const c = Math.sqrt(2 / Math.PI);
  const z3 = z * z * z;
  const inner = c * (z + 0.044715 * z3);
  const t = Math.tanh(inner);
  const sech2 = 1 - t * t;
  return 0.5 * (1 + t) + 0.5 * z * sech2 * c * (1 + 3 * 0.044715 * z * z);
}

function forward(
  net: MLP,
  inp: Float32Array,
): {
  h1: Float32Array;
  a1: Float32Array;
  h2: Float32Array;
  a2: Float32Array;
  out: Float32Array;
} {
  const h1 = new Float32Array(HID);
  for (let i = 0; i < HID; i++) {
    let s = net.b1[i];
    for (let j = 0; j < IN_DIM; j++) s += net.W1[i * IN_DIM + j] * inp[j];
    h1[i] = s;
  }
  const a1 = new Float32Array(HID);
  for (let i = 0; i < HID; i++) a1[i] = gelu(h1[i]);
  const h2 = new Float32Array(HID);
  for (let i = 0; i < HID; i++) {
    let s = net.b2[i];
    for (let j = 0; j < HID; j++) s += net.W2[i * HID + j] * a1[j];
    h2[i] = s;
  }
  const a2 = new Float32Array(HID);
  for (let i = 0; i < HID; i++) a2[i] = gelu(h2[i]);
  const out = new Float32Array(OUT_DIM);
  for (let i = 0; i < OUT_DIM; i++) {
    let s = net.b3[i];
    for (let j = 0; j < HID; j++) s += net.W3[i * HID + j] * a2[j];
    out[i] = s;
  }
  return { h1, a1, h2, a2, out };
}

function backward(
  net: MLP,
  inp: Float32Array,
  fwd: ReturnType<typeof forward>,
  dOut: Float32Array,
  grads: {
    gW1: Float32Array;
    gb1: Float32Array;
    gW2: Float32Array;
    gb2: Float32Array;
    gW3: Float32Array;
    gb3: Float32Array;
  },
) {
  const da2 = new Float32Array(HID);
  for (let i = 0; i < OUT_DIM; i++) {
    grads.gb3[i] += dOut[i];
    for (let j = 0; j < HID; j++) {
      grads.gW3[i * HID + j] += dOut[i] * fwd.a2[j];
      da2[j] += dOut[i] * net.W3[i * HID + j];
    }
  }
  const dh2 = new Float32Array(HID);
  for (let i = 0; i < HID; i++) dh2[i] = da2[i] * geluPrime(fwd.h2[i]);
  const da1 = new Float32Array(HID);
  for (let i = 0; i < HID; i++) {
    grads.gb2[i] += dh2[i];
    for (let j = 0; j < HID; j++) {
      grads.gW2[i * HID + j] += dh2[i] * fwd.a1[j];
      da1[j] += dh2[i] * net.W2[i * HID + j];
    }
  }
  const dh1 = new Float32Array(HID);
  for (let i = 0; i < HID; i++) dh1[i] = da1[i] * geluPrime(fwd.h1[i]);
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
// Score-field heatmap — sample −ε_θ(x, t_mid) on a coarse grid. Magnitude
// is mapped to alpha and painted as a cyan glow behind everything so the
// visitor can SEE the field the model has carved out.
// --------------------------------------------------------------------------

const FIELD_GRID = 28; // 28×28 cells = 784 forward passes per refresh (cheap)

function buildField(net: MLP, schedule: { alphaBar: Float32Array }, T: number): Float32Array {
  const out = new Float32Array(FIELD_GRID * FIELD_GRID);
  // mid-noise level — where the field is most informative.
  const tMid = Math.floor(T / 2);
  const tn = (tMid + 1) / T;
  const sinT = Math.sin(Math.PI * tn);
  const cosT = Math.cos(Math.PI * tn);
  const inp = new Float32Array(IN_DIM);
  inp[2] = sinT;
  inp[3] = cosT;
  let maxMag = 1e-6;
  for (let gy = 0; gy < FIELD_GRID; gy++) {
    for (let gx = 0; gx < FIELD_GRID; gx++) {
      const x = -2.5 + (5 * gx) / (FIELD_GRID - 1);
      const y = -2.5 + (5 * gy) / (FIELD_GRID - 1);
      inp[0] = x;
      inp[1] = y;
      const o = forward(net, inp).out;
      const m = Math.hypot(o[0], o[1]);
      out[gy * FIELD_GRID + gx] = m;
      if (m > maxMag) maxMag = m;
    }
  }
  // Normalise so the brightest cell is ~1. We invert it (small magnitude =
  // high density region in score-matching) so data-manifold areas light up.
  for (let i = 0; i < out.length; i++) {
    out[i] = 1 - Math.min(1, out[i] / maxMag);
  }
  return out;
}

// --------------------------------------------------------------------------
// Component
// --------------------------------------------------------------------------

const DATA_N = 256;
const TRAIL_LEN = 8;

export default function DiffusionExplorer() {
  const { u, locale } = useI18n();
  const x = EXPLORER[locale];

  const [dataset, setDataset] = useState<DatasetKind>("moons");
  const [schedule, setSchedule] = useState<Schedule>("cosine");
  const [steps, setSteps] = useState(40);
  const [numSamples, setNumSamples] = useState(160);
  const [paused, setPaused] = useState(false);

  // Live status numbers — these are React state because they drive the
  // visible counter strip; updated on every animation tick (rAF).
  const [epoch, setEpoch] = useState(0);
  const [loss, setLoss] = useState(0);
  const [sampStep, setSampStep] = useState(0);

  // Canvas refs and persistent state held outside React so the training loop
  // and animation can mutate without triggering re-renders for every frame.
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const netRef = useRef<MLP | null>(null);
  const adamRef = useRef<AdamState | null>(null);
  const schedRef = useRef<ReturnType<typeof buildSchedule> | null>(null);
  const dataRef = useRef<Float32Array | null>(null);
  const samplesRef = useRef<Float32Array | null>(null);
  const trailsRef = useRef<Float32Array[] | null>(null);
  const fieldRef = useRef<Float32Array | null>(null);
  const fieldFrameRef = useRef(0); // how many redraws since last field refresh
  const rngRef = useRef(makeRng(0xc0ffee));
  // sampling cursor — counts down from steps-1 to 0, then resets to steps-1
  // with a fresh noise cloud (the loop the visitor watches).
  const sampCursorRef = useRef<number>(0);
  // Latest epoch counters for the rAF loop (kept in refs to avoid stale closures).
  const epochRef = useRef(0);
  const lossRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const pausedRef = useRef(false);
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  // Reduced motion — when set, freeze the rAF loop on a single static frame
  // (training still runs a tiny bit so the heatmap forms, but no continuous
  // animation).
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
    const h = (e: MediaQueryListEvent) => setReduced(e.matches);
    m.addEventListener?.("change", h);
    return () => m.removeEventListener?.("change", h);
  }, []);

  // -------- (re)initialise everything for the current configuration --------
  // Called on mount, on dataset/schedule/steps change, and from "Reset model".
  const initEverything = () => {
    const r = makeRng(0xc0ffee ^ dataset.length ^ steps);
    dataRef.current = sampleDataset(dataset, DATA_N, r);
    schedRef.current = buildSchedule(steps, schedule);
    netRef.current = makeMLP(makeRng(0xbeef + steps));
    adamRef.current = makeAdam(netRef.current);
    fieldRef.current = null;
    fieldFrameRef.current = 0;
    // Fresh walker cloud from N(0, I).
    const xs = new Float32Array(numSamples * 2);
    for (let i = 0; i < numSamples * 2; i++) xs[i] = randn(rngRef.current);
    samplesRef.current = xs;
    trailsRef.current = Array.from({ length: TRAIL_LEN }, () => new Float32Array(xs));
    sampCursorRef.current = steps - 1;
    epochRef.current = 0;
    lossRef.current = 0;
    setEpoch(0);
    setLoss(0);
    setSampStep(steps - 1);
  };

  // Rebuild on first mount and whenever the dataset/schedule/steps change.
  useEffect(() => {
    initEverything();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataset, schedule, steps]);

  // Rebuild the walker cloud (only) when the walker count slider moves.
  useEffect(() => {
    const xs = new Float32Array(numSamples * 2);
    for (let i = 0; i < numSamples * 2; i++) xs[i] = randn(rngRef.current);
    samplesRef.current = xs;
    trailsRef.current = Array.from({ length: TRAIL_LEN }, () => new Float32Array(xs));
    sampCursorRef.current = steps - 1;
    setSampStep(steps - 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numSamples]);

  // -------- one mini-batch of training. Called several times per frame. --
  const trainMiniBatch = (BATCH = 64): number => {
    const net = netRef.current;
    const adam = adamRef.current;
    const sched = schedRef.current;
    const data = dataRef.current;
    if (!net || !adam || !sched || !data) return 0;
    const N = data.length / 2;
    const lr = 5e-3;
    const rng = rngRef.current;
    const inp = new Float32Array(IN_DIM);
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
    return lossSum / BATCH;
  };

  // -------- one reverse-process step on every walker. Counts down to t=0
  // and then refreshes the cloud from N(0, I) so the loop is continuous. -
  const sampleOneStep = () => {
    const net = netRef.current;
    const sched = schedRef.current;
    const xs = samplesRef.current;
    if (!net || !sched || !xs) return;
    const rng = rngRef.current;
    let t = sampCursorRef.current;
    if (t < 0) {
      // restart with fresh Gaussian noise so the visitor keeps seeing the
      // collapse-from-noise moment.
      for (let i = 0; i < xs.length; i++) xs[i] = randn(rng);
      const tr = trailsRef.current!;
      for (let k = 0; k < tr.length; k++) tr[k] = new Float32Array(xs);
      sampCursorRef.current = steps - 1;
      t = steps - 1;
    }
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
    const inp = new Float32Array(IN_DIM);
    for (let i = 0; i < numSamples; i++) {
      inp[0] = xs[i * 2];
      inp[1] = xs[i * 2 + 1];
      inp[2] = sinT;
      inp[3] = cosT;
      const out = forward(net, inp).out;
      const meanX = (1 / sqrtA) * (xs[i * 2] - coef * out[0]);
      const meanY = (1 / sqrtA) * (xs[i * 2 + 1] - coef * out[1]);
      const noiseX = t === 0 ? 0 : randn(rng);
      const noiseY = t === 0 ? 0 : randn(rng);
      xs[i * 2] = meanX + sigma * noiseX;
      xs[i * 2 + 1] = meanY + sigma * noiseY;
    }
    const tr = trailsRef.current!;
    for (let k = tr.length - 1; k > 0; k--) tr[k] = tr[k - 1];
    tr[0] = new Float32Array(xs);
    sampCursorRef.current = t - 1;
  };

  // -------- the persistent rAF loop. Trains in the background and runs the
  // reverse process so the visitor always walks into a scene in motion. ---
  useEffect(() => {
    let cancelled = false;
    const tick = () => {
      if (cancelled) return;
      if (!pausedRef.current) {
        // Run ~6 mini-batches per frame so the loss visibly drops in a few
        // seconds. After ~30 batches we tick the visible epoch counter.
        for (let b = 0; b < 6; b++) {
          const l = trainMiniBatch(48);
          // Smooth running loss for stability (EMA).
          lossRef.current = lossRef.current === 0 ? l : 0.9 * lossRef.current + 0.1 * l;
        }
        // 30 mini-batches per "epoch" by visible counter convention.
        const bumpEvery = 30;
        epochRef.current += 6 / bumpEvery;
        // Push counters to React state at most once per frame.
        setEpoch(Math.floor(epochRef.current));
        setLoss(lossRef.current);

        // Reverse step on every walker (or twice per frame for snappier feel).
        for (let s = 0; s < 2; s++) sampleOneStep();
        setSampStep(Math.max(0, sampCursorRef.current + 1));

        // Refresh the field heatmap every ~12 frames (cheap; ~770 forwards).
        fieldFrameRef.current += 1;
        if (fieldFrameRef.current % 12 === 0 && netRef.current && schedRef.current) {
          fieldRef.current = buildField(netRef.current, schedRef.current, steps);
        }
      }
      drawAll();
      rafRef.current = requestAnimationFrame(tick);
    };
    if (!reduced) {
      rafRef.current = requestAnimationFrame(tick);
    } else {
      // Reduced motion — paint once with the initial random net so the
      // visitor still sees the data and a noise cloud (no animation).
      drawAll();
    }
    return () => {
      cancelled = true;
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, steps, schedule]);

  // -------- drawing --------
  const drawAll = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = canvas.clientWidth;
    const H = canvas.clientHeight;
    if (W === 0 || H === 0) return;
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = "#06070d";
    ctx.fillRect(0, 0, W, H);

    // World-to-screen: data coords roughly in [-2.5, 2.5]² → window.
    const cx = W / 2;
    const cy = H / 2;
    const scale = Math.min(W, H) / 6;
    const project = (px: number, py: number): [number, number] => [
      cx + px * scale,
      cy - py * scale,
    ];

    // -------- score-field heatmap (under everything) --------
    const field = fieldRef.current;
    if (field) {
      const cellW = (5 * scale) / (FIELD_GRID - 1); // 5 world-units across
      for (let gy = 0; gy < FIELD_GRID; gy++) {
        for (let gx = 0; gx < FIELD_GRID; gx++) {
          const wx = -2.5 + (5 * gx) / (FIELD_GRID - 1);
          const wy = -2.5 + (5 * gy) / (FIELD_GRID - 1);
          const [sx, sy] = project(wx, wy);
          const v = field[gy * FIELD_GRID + gx];
          // gamma curve so the field reads as a soft glow rather than blocks
          const a = Math.pow(v, 2.2) * 0.42;
          if (a < 0.02) continue;
          ctx.fillStyle = `rgba(125, 243, 255, ${a})`;
          ctx.beginPath();
          ctx.arc(sx, sy, cellW * 0.65, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Grid (light, above the field so cells stay legible)
    ctx.strokeStyle = "rgba(138,144,164,0.05)";
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

    // Data cloud (cyan)
    const data = dataRef.current;
    if (data) {
      ctx.fillStyle = "rgba(125, 243, 255, 0.75)";
      for (let i = 0; i < data.length; i += 2) {
        const [px, py] = project(data[i], data[i + 1]);
        ctx.beginPath();
        ctx.arc(px, py, 2.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Sample trails — render as thin fading lines so the user sees the
    // walker collapse from noise onto the manifold as a streak, not a dot.
    const trails = trailsRef.current;
    if (trails) {
      for (let k = 1; k < trails.length; k++) {
        const a = (1 - k / trails.length) * 0.18;
        ctx.strokeStyle = `rgba(255, 122, 182, ${a})`;
        ctx.lineWidth = 1.1;
        const cur = trails[k - 1];
        const prev = trails[k];
        const n = Math.min(cur.length, prev.length) / 2;
        ctx.beginPath();
        for (let i = 0; i < n; i++) {
          const [px1, py1] = project(prev[i * 2], prev[i * 2 + 1]);
          const [px2, py2] = project(cur[i * 2], cur[i * 2 + 1]);
          ctx.moveTo(px1, py1);
          ctx.lineTo(px2, py2);
        }
        ctx.stroke();
      }
    }

    // Current walker positions (rose, bright)
    const samples = samplesRef.current;
    if (samples) {
      ctx.fillStyle = "rgba(255, 122, 182, 0.95)";
      for (let i = 0; i < samples.length; i += 2) {
        const [px, py] = project(samples[i], samples[i + 1]);
        ctx.beginPath();
        ctx.arc(px, py, 2.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  // Resize observer — keeps the canvas painted at the right DPR.
  useEffect(() => {
    const ro = new ResizeObserver(() => drawAll());
    if (canvasRef.current) ro.observe(canvasRef.current);
    return () => ro.disconnect();
     
  }, []);

  // -------- phase caption ("what you should see right now") --------
  // The caption updates based on how far the current walker cohort has
  // collapsed and how trained the net is, so the visitor sees the demo
  // narrate itself.
  let phaseCaption = x.whatNowNoise;
  const sCursor = sampCursorRef.current;
  const sPct = sCursor < 0 ? 0 : 1 - sCursor / Math.max(1, steps - 1); // 0=just noise, 1=converged
  if (epoch < 4) {
    phaseCaption = x.whatNowTrainingEarly;
  } else if (sPct < 0.2) {
    phaseCaption = x.whatNowNoise;
  } else if (sPct < 0.75) {
    phaseCaption = x.whatNowMoving;
  } else {
    phaseCaption = x.whatNowConverged;
  }

  return (
    <main className="flex min-h-screen flex-col pt-14">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_420px]">
        {/* Canvas pane */}
        <div className="relative flex min-h-[60vh] flex-col gap-3 bg-ink-950 p-4 lg:min-h-[calc(100vh-3.5rem)] lg:p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              {x.scatterBadge}
            </div>
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-coral">
              {x.formulaBadge}
            </div>
          </div>

          {/* Live status — the strip that visibly ticks. */}
          <div className="hairline flex flex-wrap items-center justify-between gap-3 rounded-md border bg-ink-950/60 px-4 py-2 font-mono text-[11px] text-ink-200">
            <span className="text-signal-coral">
              {x.statusFmt(epoch, loss, sampStep, steps)}
            </span>
            <span className="text-[10px] uppercase tracking-widest2 text-ink-400">
              {x.whatNowLabel}: <span className="text-ink-100">{phaseCaption}</span>
            </span>
          </div>

          <div className="hairline min-h-[520px] flex-1 overflow-hidden rounded-2xl border bg-ink-950">
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
            <span className="flex items-center gap-2">
              <span
                className="inline-block h-2 w-2 rounded-full opacity-50"
                style={{ background: "rgb(125, 243, 255)" }}
              />
              {x.legendField}
            </span>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="hairline scrollbar-thin flex flex-col overflow-y-auto border-l bg-ink-900/40">
          <div className="hairline space-y-3 border-b p-6">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-coral">
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
                        ? "border-signal-coral/60 bg-signal-coral/10 text-signal-coral"
                        : "hairline text-ink-200 hover:border-signal-coral/40 hover:text-ink-100"
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
                        ? "border-signal-coral/60 bg-signal-coral/10 text-signal-coral"
                        : "hairline text-ink-200 hover:border-signal-coral/40 hover:text-ink-100"
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
              <span className="text-signal-coral">{steps}</span>
              <span className="text-[10px] text-ink-400">{x.stepsUnit}</span>
            </div>
            <input
              type="range"
              min={10}
              max={120}
              step={5}
              value={steps}
              onChange={(e) => setSteps(parseInt(e.target.value, 10))}
              className="w-full accent-signal-coral"
            />
          </div>

          {/* Walkers slider */}
          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {x.samplesLabel}
            </div>
            <div className="flex items-center justify-between font-mono text-sm">
              <span className="text-signal-coral">{numSamples}</span>
              <span className="text-[10px] text-ink-400">{x.samplesUnit}</span>
            </div>
            <input
              type="range"
              min={20}
              max={400}
              step={10}
              value={numSamples}
              onChange={(e) => setNumSamples(parseInt(e.target.value, 10))}
              className="w-full accent-signal-coral"
            />
          </div>

          {/* Pause + reset buttons (no train/sample buttons — both run live) */}
          <div className="hairline space-y-3 border-b p-5">
            <button
              onClick={() => setPaused((p) => !p)}
              className={`w-full rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 transition-colors ${
                paused
                  ? "border-signal-coral/60 bg-signal-coral/10 text-signal-coral hover:bg-signal-coral/20"
                  : "border-signal-cyan/60 bg-signal-cyan/10 text-signal-cyan hover:bg-signal-cyan/20"
              }`}
            >
              {paused ? x.resumeButton : x.pauseButton}
            </button>
            <button
              onClick={initEverything}
              className="hairline w-full rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-300 transition-colors hover:border-signal-coral/40 hover:text-signal-coral"
            >
              {x.resetModelButton}
            </button>
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
              className="hairline block w-full rounded-md border py-2 text-center font-mono text-[10px] uppercase tracking-widest2 text-ink-300 transition-colors hover:border-signal-coral/40 hover:text-signal-coral"
            >
              {u.back}
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
