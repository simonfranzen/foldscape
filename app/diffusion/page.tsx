"use client";

import Link from "next/link";
import { StoryPageShell, StoryCard } from "@/components/StoryPageShell";
import { Reveal } from "@/components/Reveal";
import { useI18n } from "@/lib/i18n/context";
import { DiffusionSignatureHero } from "@/components/signature/DiffusionSignatureHero";
import { NoiseLadder } from "@/components/NoiseLadder";
import type { Locale } from "@/lib/i18n/types";
import type { StoryPage } from "@/lib/i18n/stories";

const ACCENT = "text-signal-coral";

// --------------------------------------------------------------------------
// Per-locale long-form content for the Diffusion story page. Authored
// inline in all eight site locales — keeps topic-specific prose next to
// the topic it describes, instead of fattening the shared i18n bundles.
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
  ladderCaption: string;
  ladderScrub: string;
  ladderPlay: string;
  ladderPause: string;
  ladderForward: string;
  ladderReverse: string;
  ladderStep: string;
  ladderHint: string;
  closingPretitle: string;
  closingTitle: string;
  closingBody: string;
  ctaLabel: string;
};

// ---------------- English ----------------
const en: RichStory = {
  page: {
    pretitle: "Topic · Chaos",
    title: "Denoising Diffusion Models",
    tagline: "Static, walked backwards into a picture.",
    intro:
      "Take a photograph, sprinkle in a little Gaussian noise, repeat a thousand times — the photograph turns into pure static. A diffusion model is a neural network trained to walk that process in reverse: given static, predict the slightly less-static version, then again, then again, until a fresh image appears. Stable Diffusion, Midjourney, DALL·E and Sora are all this same idea, scaled up with text-conditioning and a learned latent space.",
    ctaInteractive: "→ Open the Explorer",
  },
  encounter: {
    pretitle: "First encounter",
    title: "Static in. Image out.",
    cards: [
      {
        label: "01",
        title: "The big idea",
        body: "Diffusion treats image generation as denoising. The forward process is a Markov chain that gradually corrupts data into Gaussian noise; the reverse process is a learned chain that takes pure noise back to data. Train the reverse on enough images and it generalises — sample fresh noise, walk it back, get a brand-new picture that has never existed.",
      },
      {
        label: "02",
        title: "A concrete example",
        body: "Show a U-Net thousands of (image, noise-level, partially-noised-image) tuples and ask: which exact noise was added? Once it can guess the noise reliably at any level, you reverse the question — start from pure noise and subtract the prediction over a thousand small steps. What used to be static converges, frame by frame, into something coherent.",
      },
      {
        label: "03",
        title: "Why it matters",
        body: "Diffusion replaced GANs in 2022 as the dominant generative-image method because it trains stably, scales cleanly and accepts arbitrary conditioning. The same math now drives drug-design backbones, audio synthesis, video models and even climate downscaling — anything where you can imagine a process slowly destroying structure, you can imagine learning to run it the other way.",
      },
    ],
    tryIt:
      "Walk a tiny image into static and back. Train a toy denoiser on a 2D blob dataset and watch noise reorganise into structure.",
  },
  sections: [
    {
      pretitle: "Section 01 · The forward process",
      title: "How a picture turns into static",
      body: "Pick a noise schedule — a small sequence β₁ < β₂ < … < β_T of variances. At step t, replace each pixel by √(1−β_t)·x_{t−1} + √β_t·ε, where ε is fresh Gaussian noise. Iterated T = 1000 times, this drives every image to a sample of N(0, I): the original content is irrecoverably gone. A clean piece of algebra rolls the whole chain into a single closed form, q(x_t | x_0) = N(√ᾱ_t · x_0, (1−ᾱ_t) I), so you can jump straight to any noise level without simulating every step.",
    },
    {
      pretitle: "Section 02 · The reverse process",
      title: "Learning to undo noise, one step at a time",
      body: "The reverse chain p_θ(x_{t−1} | x_t) is what the network learns. Sohl-Dickstein (2015) showed that if the forward steps are small, the reverse steps are also Gaussian, so a neural net only has to learn their means and variances. Ho, Jain & Abbeel (2020) — the DDPM paper — simplified the loss to ‖ε − ε_θ(x_t, t)‖², i.e. predict the noise added to x_0. That reframing is what made diffusion practical: a tiny, clean regression target replaces a finicky variational bound.",
    },
    {
      pretitle: "Section 03 · Why a U-Net predicts noise",
      title: "Same shape in, same shape out",
      body: "The denoiser ε_θ has to read an image and output another image of the same dimensions, so the natural architecture is a U-Net: convolutional down-then-up, with skip connections that carry fine detail across the bottleneck. Time t and the text prompt enter as conditioning — sinusoidal time embeddings added to every block, cross-attention to a frozen text encoder for the prompt. The model never sees the clean image directly; it only learns to recognise and remove noise, and that turns out to be enough.",
    },
    {
      pretitle: "Section 04 · Sampling",
      title: "Climbing back from pure noise",
      body: "To generate, draw x_T ~ N(0, I) and iterate x_{t−1} = (1/√α_t) · (x_t − ((1−α_t)/√(1−ᾱ_t)) · ε_θ(x_t, t)) + σ_t · z. DDPM does this for all T steps; DDIM (Song 2020) collapses the chain into a deterministic ODE you can solve in 20–50 steps. Faster solvers — DPM-Solver, Heun, Euler — push generation under a second on a GPU. Each step is a small denoising correction; pile up enough of them and a coherent image emerges from the noise.",
    },
    {
      pretitle: "Section 05 · Classifier-free guidance & text-conditioning",
      title: "Steering the walk with a prompt",
      body: "Pure unconditional samples are blurry and uncontrolled. To follow a prompt, train the U-Net to take a text embedding c (from CLIP or T5) via cross-attention, randomly dropping the conditioning 10–20% of the time. At sample time use classifier-free guidance: ε̃ = ε_θ(x_t, ∅) + w · (ε_θ(x_t, c) − ε_θ(x_t, ∅)). The guidance scale w sharpens prompt alignment at the cost of diversity — w = 7.5 is the canonical Stable-Diffusion default. The same trick conditions on edges, depth maps, poses or other images for ControlNet.",
    },
    {
      pretitle: "Section 06 · From thermodynamics to Stable Diffusion",
      title: "A short, fast lineage",
      body: "Sohl-Dickstein and colleagues introduced the forward/reverse framework in 2015, framing it as non-equilibrium thermodynamics. Song & Ermon (2019) reached it from a different angle — score matching with Langevin dynamics — and proved the two views were equivalent up to a reparametrisation. Ho, Jain & Abbeel (2020) closed the loop with the noise-prediction loss and SOTA samples on CIFAR. Rombach et al. (2022) moved diffusion into the latent space of a VAE, slashing compute by 50× and producing Stable Diffusion. Seven years from thermodynamic curiosity to the image engine of the internet.",
    },
  ],
  ladderCaption: "Forward process · q(x_t | x_0)",
  ladderScrub: "Scrub through noise levels",
  ladderPlay: "▶ Play (walk forward then back)",
  ladderPause: "❚❚ Pause",
  ladderForward: "↦ Forward (clean → noise)",
  ladderReverse: "↤ Reverse (noise → clean)",
  ladderStep: "Diffusion step t",
  ladderHint:
    "At t=0 the image is the original. Each step multiplies signal by √(1−β) and folds in fresh Gaussian noise weighted by √β. By t=T the signal is gone and only noise remains. The reverse process is a neural network trained to walk this ladder upward from t=T back to t=0.",
  closingPretitle: "See the math in motion",
  closingTitle: "Train a tiny denoiser. Sample fresh data.",
  closingBody:
    "The Explorer trains a small score network on a 2D dataset, then samples by running the reverse chain from pure Gaussian noise. You can watch random points reorganise themselves onto the data manifold in real time — the same trick that turns static into images, on a scale you can read.",
  ctaLabel: "→ Open the Explorer",
};

// ---------------- Deutsch ----------------
const de: RichStory = {
  page: {
    pretitle: "Thema · Chaos",
    title: "Denoising-Diffusionsmodelle",
    tagline: "Bildrauschen, rückwärts zu einem Bild gelaufen.",
    intro:
      "Nimm ein Foto, mische ein wenig Gauß-Rauschen darunter, wiederhole tausendmal — und das Foto wird zu reinem Rauschen. Ein Diffusionsmodell ist ein neuronales Netz, das gelernt hat, diesen Prozess rückwärts zu gehen: gegeben Rauschen, sage die etwas weniger verrauschte Version voraus, und nochmal, und nochmal, bis ein frisches Bild entsteht. Stable Diffusion, Midjourney, DALL·E und Sora sind alle dieselbe Idee, hochskaliert mit Text-Konditionierung und einem gelernten Latentraum.",
    ctaInteractive: "→ Zum Explorer",
  },
  encounter: {
    pretitle: "Erste Begegnung",
    title: "Rauschen rein. Bild raus.",
    cards: [
      {
        label: "01",
        title: "Die große Idee",
        body: "Diffusion behandelt Bilderzeugung als Entrauschen. Der Vorwärtsprozess ist eine Markov-Kette, die Daten allmählich in Gauß-Rauschen zerstört; der Rückwärtsprozess ist eine gelernte Kette, die reines Rauschen wieder zu Daten macht. Trainiere die Rückwärtsrichtung an genügend Bildern und sie generalisiert — ziehe frisches Rauschen, laufe es zurück, erhalte ein nagelneues Bild, das es nie gab.",
      },
      {
        label: "02",
        title: "Ein konkretes Beispiel",
        body: "Zeige einem U-Net Tausende Tupel aus (Bild, Rauschstufe, teilweise verrauschtes Bild) und frage: welches Rauschen wurde hinzugefügt? Sobald es das Rauschen auf jeder Stufe verlässlich rät, kehrst du die Frage um — beginne bei reinem Rauschen und ziehe die Vorhersage in tausend kleinen Schritten ab. Was vorher Bildrauschen war, wird Bild für Bild zu etwas Kohärentem.",
      },
      {
        label: "03",
        title: "Warum es wichtig ist",
        body: "Diffusion löste 2022 die GANs als dominierende Methode der Bildgenerierung ab, weil sie stabil trainiert, sauber skaliert und beliebige Konditionierung akzeptiert. Dieselbe Mathematik treibt heute Wirkstoff-Backbones, Audio-Synthese, Videomodelle und sogar Klimasimulationen — überall, wo man sich einen Prozess vorstellen kann, der Struktur langsam zerstört, kann man lernen, ihn umzukehren.",
      },
    ],
    tryIt:
      "Lass ein kleines Bild zu Rauschen werden und zurück. Trainiere einen Spielzeug-Entrauscher auf einem 2D-Datensatz und beobachte, wie sich Rauschen zu Struktur ordnet.",
  },
  sections: [
    {
      pretitle: "Abschnitt 01 · Der Vorwärtsprozess",
      title: "Wie ein Bild zu Rauschen wird",
      body: "Wähle einen Rauschplan — eine kleine Folge β₁ < β₂ < … < β_T von Varianzen. Im Schritt t ersetze jeden Pixel durch √(1−β_t)·x_{t−1} + √β_t·ε, wobei ε frisches Gauß-Rauschen ist. T = 1000 Mal iteriert treibt das jedes Bild in eine Probe aus N(0, I): der ursprüngliche Inhalt ist unwiederbringlich weg. Eine saubere Algebra rollt die ganze Kette in eine geschlossene Form, q(x_t | x_0) = N(√ᾱ_t · x_0, (1−ᾱ_t) I), sodass du direkt zu jeder Rauschstufe springen kannst, ohne jeden Schritt zu simulieren.",
    },
    {
      pretitle: "Abschnitt 02 · Der Rückwärtsprozess",
      title: "Rauschen Schritt für Schritt rückgängig machen lernen",
      body: "Die Rückwärtskette p_θ(x_{t−1} | x_t) ist das, was das Netz lernt. Sohl-Dickstein (2015) zeigte, dass die Rückwärtsschritte ebenfalls gaußisch sind, wenn die Vorwärtsschritte klein genug sind, sodass ein Netz nur ihre Mittel und Varianzen lernen muss. Ho, Jain & Abbeel (2020) — die DDPM-Arbeit — vereinfachten den Verlust zu ‖ε − ε_θ(x_t, t)‖², also: sage das Rauschen voraus, das zu x_0 hinzugefügt wurde. Diese Umformulierung machte Diffusion erst praktikabel: ein winziges, klares Regressionsziel ersetzt eine widerspenstige Variationsschranke.",
    },
    {
      pretitle: "Abschnitt 03 · Warum ein U-Net Rauschen vorhersagt",
      title: "Gleiche Form rein, gleiche Form raus",
      body: "Der Entrauscher ε_θ muss ein Bild lesen und ein Bild derselben Dimensionen ausgeben, also ist die natürliche Architektur ein U-Net: faltend hinunter und wieder hinauf, mit Skip-Verbindungen, die feine Details über den Engpass tragen. Zeit t und der Text-Prompt kommen als Konditionierung herein — sinusförmige Zeit-Embeddings in jedem Block, Cross-Attention auf einen eingefrorenen Text-Encoder für den Prompt. Das Modell sieht das saubere Bild nie direkt; es lernt nur, Rauschen zu erkennen und zu entfernen, und das genügt.",
    },
    {
      pretitle: "Abschnitt 04 · Sampling",
      title: "Aus reinem Rauschen zurückklettern",
      body: "Zum Generieren ziehe x_T ~ N(0, I) und iteriere x_{t−1} = (1/√α_t) · (x_t − ((1−α_t)/√(1−ᾱ_t)) · ε_θ(x_t, t)) + σ_t · z. DDPM macht das für alle T Schritte; DDIM (Song 2020) kollabiert die Kette zu einer deterministischen ODE, die in 20–50 Schritten lösbar ist. Schnellere Solver — DPM-Solver, Heun, Euler — drücken die Generierung auf einer GPU unter eine Sekunde. Jeder Schritt ist eine kleine Entrausch-Korrektur; stapele genug davon und ein kohärentes Bild taucht aus dem Rauschen auf.",
    },
    {
      pretitle: "Abschnitt 05 · Classifier-Free Guidance & Text-Konditionierung",
      title: "Den Lauf mit einem Prompt lenken",
      body: "Reine unkonditionierte Proben sind unscharf und unkontrolliert. Um einem Prompt zu folgen, trainiere das U-Net so, dass es ein Text-Embedding c (aus CLIP oder T5) über Cross-Attention aufnimmt, wobei die Konditionierung in 10–20 % der Fälle weggelassen wird. Beim Sampling nutzt du Classifier-Free Guidance: ε̃ = ε_θ(x_t, ∅) + w · (ε_θ(x_t, c) − ε_θ(x_t, ∅)). Die Guidance-Skala w schärft die Prompt-Treue auf Kosten der Vielfalt — w = 7,5 ist der kanonische Stable-Diffusion-Standard. Derselbe Trick konditioniert über ControlNet auf Kanten, Tiefen, Posen oder andere Bilder.",
    },
    {
      pretitle: "Abschnitt 06 · Von der Thermodynamik zu Stable Diffusion",
      title: "Eine kurze, schnelle Ahnenreihe",
      body: "Sohl-Dickstein und Kolleg:innen führten den Vorwärts-/Rückwärtsrahmen 2015 ein und stellten ihn als Nichtgleichgewichts-Thermodynamik dar. Song & Ermon (2019) kamen aus einem anderen Winkel — Score-Matching mit Langevin-Dynamik — und bewiesen, dass beide Sichten bis auf Reparametrisierung äquivalent sind. Ho, Jain & Abbeel (2020) schlossen den Kreis mit dem Rauschvorhersage-Verlust und SOTA-Proben auf CIFAR. Rombach et al. (2022) verlagerten Diffusion in den Latentraum eines VAE, kürzten so den Rechenaufwand um den Faktor 50 und schufen Stable Diffusion. Sieben Jahre von der thermodynamischen Kuriosität zur Bildmaschine des Internets.",
    },
  ],
  ladderCaption: "Vorwärtsprozess · q(x_t | x_0)",
  ladderScrub: "Durch Rauschstufen scrollen",
  ladderPlay: "▶ Abspielen (vor und zurück)",
  ladderPause: "❚❚ Pause",
  ladderForward: "↦ Vorwärts (sauber → Rauschen)",
  ladderReverse: "↤ Rückwärts (Rauschen → sauber)",
  ladderStep: "Diffusionsschritt t",
  ladderHint:
    "Bei t=0 ist das Bild das Original. Jeder Schritt multipliziert das Signal mit √(1−β) und mischt frisches Gauß-Rauschen mit Gewicht √β unter. Bei t=T ist das Signal weg, es bleibt nur Rauschen. Der Rückwärtsprozess ist ein neuronales Netz, das gelernt hat, diese Leiter von t=T zurück zu t=0 zu steigen.",
  closingPretitle: "Sieh die Mathematik in Bewegung",
  closingTitle: "Trainiere einen winzigen Entrauscher. Ziehe frische Daten.",
  closingBody:
    "Der Explorer trainiert ein kleines Score-Netz auf einem 2D-Datensatz und zieht dann Proben, indem er die Rückwärtskette aus reinem Gauß-Rauschen laufen lässt. Du siehst in Echtzeit, wie sich zufällige Punkte auf die Datenmannigfaltigkeit ordnen — derselbe Trick, der Rauschen in Bilder verwandelt, auf einem Maßstab, den man lesen kann.",
  ctaLabel: "→ Zum Explorer",
};

// ---------------- Español ----------------
const es: RichStory = {
  page: {
    pretitle: "Tema · Caos",
    title: "Modelos de difusión por eliminación de ruido",
    tagline: "Ruido, caminado hacia atrás hasta volverse imagen.",
    intro:
      "Toma una fotografía, añádele un poco de ruido gaussiano, repítelo mil veces — la fotografía se vuelve estática pura. Un modelo de difusión es una red neuronal entrenada para recorrer ese proceso al revés: dado ruido, predecir la versión un poco menos ruidosa, y otra, y otra, hasta que aparece una imagen nueva. Stable Diffusion, Midjourney, DALL·E y Sora son la misma idea escalada con condicionamiento por texto y un espacio latente aprendido.",
    ctaInteractive: "→ Abrir el Explorador",
  },
  encounter: {
    pretitle: "Primer encuentro",
    title: "Ruido entra. Imagen sale.",
    cards: [
      {
        label: "01",
        title: "La idea grande",
        body: "La difusión trata la generación de imágenes como eliminación de ruido. El proceso directo es una cadena de Markov que corrompe los datos hasta ruido gaussiano; el proceso inverso es una cadena aprendida que devuelve ruido puro a datos. Entrena la inversa con suficientes imágenes y generaliza — muestrea ruido nuevo, recórrelo, obtén una imagen nunca vista.",
      },
      {
        label: "02",
        title: "Un ejemplo concreto",
        body: "Muestra a una U-Net miles de tuplas (imagen, nivel de ruido, imagen parcialmente ruidosa) y pregunta: ¿qué ruido exacto se añadió? Cuando lo adivina con fiabilidad a cualquier nivel, inviertes la pregunta — parte de ruido puro y resta la predicción en mil pequeños pasos. Lo que era estática converge, paso a paso, en algo coherente.",
      },
      {
        label: "03",
        title: "Por qué importa",
        body: "La difusión sustituyó a las GAN en 2022 como método dominante de generación de imágenes porque entrena de forma estable, escala con limpieza y acepta condicionamiento arbitrario. Las mismas matemáticas mueven hoy esqueletos de fármacos, síntesis de audio, modelos de vídeo e incluso downscaling climático — donde puedas imaginar un proceso que destruye estructura, puedes imaginar aprender a invertirlo.",
      },
    ],
    tryIt:
      "Convierte una imagen pequeña en ruido y vuelve atrás. Entrena un denoiser de juguete en datos 2D y mira el ruido reorganizarse en estructura.",
  },
  sections: [
    {
      pretitle: "Sección 01 · El proceso directo",
      title: "Cómo una imagen se vuelve ruido",
      body: "Elige un calendario de ruido — una pequeña secuencia β₁ < β₂ < … < β_T de varianzas. En el paso t, sustituye cada píxel por √(1−β_t)·x_{t−1} + √β_t·ε, donde ε es ruido gaussiano nuevo. Iterado T = 1000 veces, lleva cualquier imagen a una muestra de N(0, I): el contenido original desaparece sin remedio. Un poco de álgebra limpia condensa toda la cadena en una sola forma cerrada, q(x_t | x_0) = N(√ᾱ_t · x_0, (1−ᾱ_t) I), de modo que puedes saltar directamente a cualquier nivel de ruido sin simular cada paso.",
    },
    {
      pretitle: "Sección 02 · El proceso inverso",
      title: "Aprender a deshacer ruido, un paso cada vez",
      body: "La cadena inversa p_θ(x_{t−1} | x_t) es lo que aprende la red. Sohl-Dickstein (2015) mostró que si los pasos directos son pequeños, los pasos inversos también son gaussianos, de modo que una red sólo tiene que aprender sus medias y varianzas. Ho, Jain y Abbeel (2020) — el artículo DDPM — simplificaron la pérdida a ‖ε − ε_θ(x_t, t)‖², es decir, predecir el ruido añadido a x_0. Esa reformulación fue lo que hizo la difusión práctica: un objetivo de regresión minúsculo y limpio sustituye a una cota variacional caprichosa.",
    },
    {
      pretitle: "Sección 03 · Por qué una U-Net predice ruido",
      title: "La misma forma entra, la misma forma sale",
      body: "El denoiser ε_θ debe leer una imagen y emitir otra imagen de las mismas dimensiones, así que la arquitectura natural es una U-Net: convolucional bajando y subiendo, con conexiones residuales que llevan el detalle fino a través del cuello de botella. El tiempo t y el prompt textual entran como condicionamiento — embeddings sinusoidales de tiempo añadidos a cada bloque, cross-attention a un codificador de texto congelado para el prompt. El modelo nunca ve la imagen limpia directamente; sólo aprende a reconocer y a quitar ruido, y eso basta.",
    },
    {
      pretitle: "Sección 04 · Muestreo",
      title: "Subir de nuevo desde el ruido puro",
      body: "Para generar, saca x_T ~ N(0, I) e itera x_{t−1} = (1/√α_t) · (x_t − ((1−α_t)/√(1−ᾱ_t)) · ε_θ(x_t, t)) + σ_t · z. DDPM lo hace para los T pasos; DDIM (Song 2020) colapsa la cadena en una EDO determinista resoluble en 20–50 pasos. Los solvers más rápidos — DPM-Solver, Heun, Euler — bajan la generación de un segundo en una GPU. Cada paso es una pequeña corrección de denoising; apila suficientes y una imagen coherente emerge del ruido.",
    },
    {
      pretitle: "Sección 05 · Guidance sin clasificador y texto",
      title: "Guiar la caminata con un prompt",
      body: "Las muestras incondicionales puras son borrosas y descontroladas. Para seguir un prompt, entrena la U-Net para que reciba un embedding de texto c (de CLIP o T5) por cross-attention, soltando el condicionamiento en el 10–20 % de los casos. Al muestrear usa classifier-free guidance: ε̃ = ε_θ(x_t, ∅) + w · (ε_θ(x_t, c) − ε_θ(x_t, ∅)). La escala de guía w agudiza la fidelidad al prompt a costa de diversidad — w = 7,5 es el valor canónico de Stable Diffusion. El mismo truco condiciona a bordes, mapas de profundidad, poses u otras imágenes en ControlNet.",
    },
    {
      pretitle: "Sección 06 · De la termodinámica a Stable Diffusion",
      title: "Un linaje corto y veloz",
      body: "Sohl-Dickstein y colaboradores introdujeron el marco directo/inverso en 2015, planteándolo como termodinámica de no equilibrio. Song y Ermon (2019) llegaron desde otro ángulo — score matching con dinámica de Langevin — y probaron que ambas visiones son equivalentes salvo una reparametrización. Ho, Jain y Abbeel (2020) cerraron el círculo con la pérdida de predicción de ruido y muestras SOTA en CIFAR. Rombach et al. (2022) llevaron la difusión al espacio latente de un VAE, recortaron el cómputo 50× y crearon Stable Diffusion. Siete años de la curiosidad termodinámica al motor de imágenes de internet.",
    },
  ],
  ladderCaption: "Proceso directo · q(x_t | x_0)",
  ladderScrub: "Recorre los niveles de ruido",
  ladderPlay: "▶ Reproducir (avanzar y volver)",
  ladderPause: "❚❚ Pausar",
  ladderForward: "↦ Adelante (limpio → ruido)",
  ladderReverse: "↤ Atrás (ruido → limpio)",
  ladderStep: "Paso de difusión t",
  ladderHint:
    "En t=0 la imagen es la original. Cada paso multiplica la señal por √(1−β) y mezcla ruido gaussiano nuevo con peso √β. En t=T la señal desaparece y sólo queda ruido. El proceso inverso es una red neuronal entrenada para subir esta escalera de t=T a t=0.",
  closingPretitle: "Mira las matemáticas en movimiento",
  closingTitle: "Entrena un denoiser diminuto. Genera datos nuevos.",
  closingBody:
    "El Explorador entrena una pequeña red de score sobre un conjunto 2D y luego muestrea ejecutando la cadena inversa desde ruido gaussiano puro. Verás en tiempo real cómo los puntos aleatorios se reorganizan sobre la variedad de datos — el mismo truco que convierte estática en imágenes, a una escala que se puede leer.",
  ctaLabel: "→ Abrir el Explorador",
};

// ---------------- Français ----------------
const fr: RichStory = {
  page: {
    pretitle: "Sujet · Chaos",
    title: "Modèles de diffusion par débruitage",
    tagline: "Du bruit, parcouru à l'envers jusqu'à devenir image.",
    intro:
      "Prends une photographie, saupoudre un peu de bruit gaussien, répète mille fois — la photo devient pur grésillement. Un modèle de diffusion est un réseau neuronal entraîné à parcourir ce processus à l'envers : à partir du bruit, prédire la version un peu moins bruitée, encore, et encore, jusqu'à ce qu'une image inédite apparaisse. Stable Diffusion, Midjourney, DALL·E et Sora reposent tous sur cette même idée, mise à l'échelle avec un conditionnement texte et un espace latent appris.",
    ctaInteractive: "→ Ouvrir l'Explorer",
  },
  encounter: {
    pretitle: "Première rencontre",
    title: "Bruit en entrée. Image en sortie.",
    cards: [
      {
        label: "01",
        title: "L'idée centrale",
        body: "La diffusion traite la génération d'images comme un débruitage. Le processus direct est une chaîne de Markov qui corrompt progressivement les données en bruit gaussien ; le processus inverse est une chaîne apprise qui ramène le bruit pur vers les données. Entraîne l'inverse sur assez d'images et elle généralise — tire du bruit neuf, parcours-le à l'envers, et tu obtiens une image inédite qui n'a jamais existé.",
      },
      {
        label: "02",
        title: "Un exemple concret",
        body: "Montre à un U-Net des milliers de triplets (image, niveau de bruit, image partiellement bruitée) et demande : quel bruit exact a été ajouté ? Lorsqu'il devine ce bruit de façon fiable à tout niveau, inverse la question — pars du bruit pur et soustrais la prédiction sur mille petits pas. Ce qui était grésillement converge, pas à pas, vers quelque chose de cohérent.",
      },
      {
        label: "03",
        title: "Pourquoi cela compte",
        body: "La diffusion a remplacé les GAN en 2022 comme méthode dominante de génération d'images parce qu'elle s'entraîne de façon stable, monte en charge proprement et accepte tout conditionnement. Les mêmes mathématiques pilotent aujourd'hui les squelettes de protéines, la synthèse audio, les modèles vidéo et même le downscaling climatique — partout où l'on imagine un processus qui détruit lentement la structure, on peut imaginer apprendre à le renverser.",
      },
    ],
    tryIt:
      "Convertis une petite image en bruit et reviens en arrière. Entraîne un débruiteur jouet sur des données 2D et regarde le bruit se réorganiser en structure.",
  },
  sections: [
    {
      pretitle: "Section 01 · Le processus direct",
      title: "Comment une image devient du bruit",
      body: "Choisis un calendrier de bruit — une petite suite β₁ < β₂ < … < β_T de variances. À l'étape t, remplace chaque pixel par √(1−β_t)·x_{t−1} + √β_t·ε, où ε est un bruit gaussien neuf. Itéré T = 1000 fois, cela mène toute image vers un échantillon de N(0, I) : le contenu original est irrémédiablement perdu. Un peu d'algèbre roule la chaîne entière dans une seule forme close, q(x_t | x_0) = N(√ᾱ_t · x_0, (1−ᾱ_t) I), si bien que tu peux sauter directement à n'importe quel niveau de bruit sans simuler chaque étape.",
    },
    {
      pretitle: "Section 02 · Le processus inverse",
      title: "Apprendre à défaire le bruit, un pas à la fois",
      body: "La chaîne inverse p_θ(x_{t−1} | x_t) est ce que le réseau apprend. Sohl-Dickstein (2015) a montré que si les pas directs sont petits, les pas inverses sont eux aussi gaussiens, de sorte qu'un réseau n'a qu'à apprendre leurs moyennes et variances. Ho, Jain et Abbeel (2020) — le papier DDPM — ont simplifié la perte à ‖ε − ε_θ(x_t, t)‖², c'est-à-dire prédire le bruit ajouté à x_0. Cette reformulation a rendu la diffusion pratique : une cible de régression minuscule et propre remplace une borne variationnelle capricieuse.",
    },
    {
      pretitle: "Section 03 · Pourquoi un U-Net prédit le bruit",
      title: "Même forme en entrée, même forme en sortie",
      body: "Le débruiteur ε_θ doit lire une image et en produire une autre de mêmes dimensions, donc l'architecture naturelle est un U-Net : convolutionnel descendant puis montant, avec des connexions résiduelles qui transportent le détail fin par-dessus le goulot. Le temps t et le prompt textuel entrent comme conditionnement — embeddings sinusoïdaux de temps ajoutés à chaque bloc, attention croisée vers un encodeur de texte gelé pour le prompt. Le modèle ne voit jamais l'image propre directement ; il apprend seulement à reconnaître et à retirer le bruit, et cela suffit.",
    },
    {
      pretitle: "Section 04 · Échantillonnage",
      title: "Remonter depuis le bruit pur",
      body: "Pour générer, tire x_T ~ N(0, I) et itère x_{t−1} = (1/√α_t) · (x_t − ((1−α_t)/√(1−ᾱ_t)) · ε_θ(x_t, t)) + σ_t · z. DDPM le fait pour les T étapes ; DDIM (Song 2020) effondre la chaîne en une EDO déterministe résoluble en 20 à 50 étapes. Les solveurs plus rapides — DPM-Solver, Heun, Euler — passent la génération sous la seconde sur un GPU. Chaque pas est une petite correction de débruitage ; empile-en assez et une image cohérente émerge du bruit.",
    },
    {
      pretitle: "Section 05 · Classifier-free guidance & conditionnement texte",
      title: "Orienter la marche avec un prompt",
      body: "Les échantillons purement non conditionnés sont flous et incontrôlés. Pour suivre un prompt, entraîne le U-Net à recevoir un embedding texte c (CLIP ou T5) par attention croisée, en laissant tomber le conditionnement 10 à 20 % du temps. À l'échantillonnage, utilise la classifier-free guidance : ε̃ = ε_θ(x_t, ∅) + w · (ε_θ(x_t, c) − ε_θ(x_t, ∅)). L'échelle de guidance w aiguise la fidélité au prompt aux dépens de la diversité — w = 7,5 est la valeur canonique de Stable Diffusion. Le même truc conditionne sur des contours, des cartes de profondeur, des poses ou d'autres images dans ControlNet.",
    },
    {
      pretitle: "Section 06 · De la thermodynamique à Stable Diffusion",
      title: "Une lignée brève et rapide",
      body: "Sohl-Dickstein et ses collègues ont introduit le cadre direct/inverse en 2015, en le formulant comme thermodynamique hors équilibre. Song et Ermon (2019) y sont parvenus par un autre angle — score matching et dynamique de Langevin — et ont prouvé que les deux vues sont équivalentes à une reparamétrisation près. Ho, Jain et Abbeel (2020) ont bouclé la boucle avec la perte de prédiction de bruit et des échantillons SOTA sur CIFAR. Rombach et al. (2022) ont déplacé la diffusion dans l'espace latent d'un VAE, divisé le calcul par 50 et produit Stable Diffusion. Sept ans de la curiosité thermodynamique au moteur d'images de l'internet.",
    },
  ],
  ladderCaption: "Processus direct · q(x_t | x_0)",
  ladderScrub: "Parcours les niveaux de bruit",
  ladderPlay: "▶ Lire (aller puis revenir)",
  ladderPause: "❚❚ Pause",
  ladderForward: "↦ Avant (propre → bruit)",
  ladderReverse: "↤ Arrière (bruit → propre)",
  ladderStep: "Pas de diffusion t",
  ladderHint:
    "À t=0 l'image est l'originale. Chaque pas multiplie le signal par √(1−β) et ajoute du bruit gaussien neuf pondéré par √β. À t=T le signal a disparu et il ne reste que du bruit. Le processus inverse est un réseau neuronal entraîné à remonter cette échelle de t=T vers t=0.",
  closingPretitle: "Vois les maths en mouvement",
  closingTitle: "Entraîne un mini débruiteur. Échantillonne des données neuves.",
  closingBody:
    "L'Explorer entraîne un petit réseau de score sur un jeu de données 2D, puis échantillonne en faisant tourner la chaîne inverse depuis du bruit gaussien pur. Tu vois en temps réel des points aléatoires se réorganiser sur la variété des données — le même truc qui transforme le bruit en images, à une échelle lisible.",
  ctaLabel: "→ Ouvrir l'Explorer",
};

// ---------------- Italiano ----------------
const it: RichStory = {
  page: {
    pretitle: "Tema · Caos",
    title: "Modelli di diffusione con denoising",
    tagline: "Rumore, percorso al contrario fino a diventare immagine.",
    intro:
      "Prendi una fotografia, mescola un pizzico di rumore gaussiano, ripeti mille volte — la foto diventa puro fruscio. Un modello di diffusione è una rete neurale addestrata a percorrere quel processo all'indietro: dato rumore, predire la versione un po' meno rumorosa, e ancora, e ancora, finché un'immagine nuova compare. Stable Diffusion, Midjourney, DALL·E e Sora sono la stessa idea su larga scala, con condizionamento testuale e uno spazio latente appreso.",
    ctaInteractive: "→ Apri l'Explorer",
  },
  encounter: {
    pretitle: "Primo incontro",
    title: "Rumore in entrata. Immagine in uscita.",
    cards: [
      {
        label: "01",
        title: "L'idea grande",
        body: "La diffusione tratta la generazione di immagini come denoising. Il processo diretto è una catena di Markov che corrompe gradualmente i dati in rumore gaussiano; il processo inverso è una catena appresa che riporta rumore puro ai dati. Addestra l'inversa su abbastanza immagini e generalizza — campiona rumore nuovo, percorrilo all'indietro, ottieni un'immagine inedita.",
      },
      {
        label: "02",
        title: "Un esempio concreto",
        body: "Mostra a una U-Net migliaia di triple (immagine, livello di rumore, immagine parzialmente rumorosa) e chiedi: quale rumore esatto è stato aggiunto? Quando lo indovina con affidabilità a ogni livello, ribalti la domanda — parti da rumore puro e sottrai la predizione in mille piccoli passi. Ciò che era fruscio converge, passo dopo passo, in qualcosa di coerente.",
      },
      {
        label: "03",
        title: "Perché conta",
        body: "La diffusione ha sostituito le GAN nel 2022 come metodo dominante di generazione di immagini perché si addestra in modo stabile, scala con pulizia e accetta condizionamento arbitrario. La stessa matematica oggi guida scaffold di farmaci, sintesi audio, modelli video e perfino downscaling climatico — ovunque tu possa immaginare un processo che distrugge struttura, puoi immaginare di imparare a invertirlo.",
      },
    ],
    tryIt:
      "Trasforma una piccola immagine in rumore e torna indietro. Addestra un denoiser-giocattolo su dati 2D e guarda il rumore riorganizzarsi in struttura.",
  },
  sections: [
    {
      pretitle: "Sezione 01 · Il processo diretto",
      title: "Come un'immagine diventa rumore",
      body: "Scegli un calendario di rumore — una piccola successione β₁ < β₂ < … < β_T di varianze. Al passo t, sostituisci ogni pixel con √(1−β_t)·x_{t−1} + √β_t·ε, dove ε è rumore gaussiano nuovo. Iterato T = 1000 volte, porta ogni immagine a un campione di N(0, I): il contenuto originale è irrecuperabilmente perso. Un po' di algebra pulita avvolge l'intera catena in un'unica forma chiusa, q(x_t | x_0) = N(√ᾱ_t · x_0, (1−ᾱ_t) I), così puoi saltare direttamente a qualsiasi livello di rumore senza simulare ogni passo.",
    },
    {
      pretitle: "Sezione 02 · Il processo inverso",
      title: "Imparare a disfare il rumore, un passo per volta",
      body: "La catena inversa p_θ(x_{t−1} | x_t) è ciò che la rete impara. Sohl-Dickstein (2015) ha mostrato che se i passi diretti sono piccoli, anche i passi inversi sono gaussiani, quindi una rete deve solo imparare medie e varianze. Ho, Jain e Abbeel (2020) — l'articolo DDPM — hanno semplificato la perdita in ‖ε − ε_θ(x_t, t)‖², cioè predire il rumore aggiunto a x_0. Quella riformulazione ha reso la diffusione pratica: un obiettivo di regressione minuscolo e pulito sostituisce un limite variazionale capriccioso.",
    },
    {
      pretitle: "Sezione 03 · Perché una U-Net predice il rumore",
      title: "Stessa forma in ingresso, stessa forma in uscita",
      body: "Il denoiser ε_θ deve leggere un'immagine e restituire un'immagine delle stesse dimensioni, quindi l'architettura naturale è una U-Net: convoluzionale giù-su, con skip connections che portano i dettagli fini oltre il collo di bottiglia. Il tempo t e il prompt testuale entrano come condizionamento — embedding sinusoidali di tempo aggiunti a ogni blocco, cross-attention verso un encoder di testo congelato per il prompt. Il modello non vede mai l'immagine pulita direttamente; impara solo a riconoscere e a rimuovere il rumore, e basta.",
    },
    {
      pretitle: "Sezione 04 · Campionamento",
      title: "Risalire dal rumore puro",
      body: "Per generare, estrai x_T ~ N(0, I) e itera x_{t−1} = (1/√α_t) · (x_t − ((1−α_t)/√(1−ᾱ_t)) · ε_θ(x_t, t)) + σ_t · z. DDPM lo fa per tutti i T passi; DDIM (Song 2020) collassa la catena in un'ODE deterministica risolvibile in 20–50 passi. Solver più rapidi — DPM-Solver, Heun, Euler — portano la generazione sotto il secondo su GPU. Ogni passo è una piccola correzione di denoising; accumulane abbastanza e un'immagine coerente emerge dal rumore.",
    },
    {
      pretitle: "Sezione 05 · Classifier-free guidance & condizionamento testuale",
      title: "Guidare la camminata con un prompt",
      body: "I campioni puramente non condizionati sono sfocati e incontrollati. Per seguire un prompt, addestra la U-Net a ricevere un embedding testuale c (da CLIP o T5) tramite cross-attention, eliminando il condizionamento nel 10–20 % dei casi. Al campionamento usa la classifier-free guidance: ε̃ = ε_θ(x_t, ∅) + w · (ε_θ(x_t, c) − ε_θ(x_t, ∅)). La scala di guidance w affina l'aderenza al prompt a scapito della diversità — w = 7,5 è il valore canonico di Stable Diffusion. Lo stesso trucco condiziona su bordi, mappe di profondità, pose o altre immagini con ControlNet.",
    },
    {
      pretitle: "Sezione 06 · Dalla termodinamica a Stable Diffusion",
      title: "Una stirpe breve e veloce",
      body: "Sohl-Dickstein e colleghi hanno introdotto il quadro diretto/inverso nel 2015, presentandolo come termodinamica fuori equilibrio. Song ed Ermon (2019) sono arrivati da un altro angolo — score matching con dinamica di Langevin — e hanno dimostrato che le due viste sono equivalenti a meno di una riparametrizzazione. Ho, Jain e Abbeel (2020) hanno chiuso il cerchio con la perdita di predizione del rumore e campioni SOTA su CIFAR. Rombach et al. (2022) hanno spostato la diffusione nello spazio latente di un VAE, tagliando il calcolo di 50× e producendo Stable Diffusion. Sette anni dalla curiosità termodinamica al motore di immagini di internet.",
    },
  ],
  ladderCaption: "Processo diretto · q(x_t | x_0)",
  ladderScrub: "Scorri i livelli di rumore",
  ladderPlay: "▶ Riproduci (vai avanti e indietro)",
  ladderPause: "❚❚ Pausa",
  ladderForward: "↦ Avanti (pulito → rumore)",
  ladderReverse: "↤ Indietro (rumore → pulito)",
  ladderStep: "Passo di diffusione t",
  ladderHint:
    "A t=0 l'immagine è l'originale. Ogni passo moltiplica il segnale per √(1−β) e aggiunge rumore gaussiano nuovo con peso √β. A t=T il segnale è sparito e resta solo rumore. Il processo inverso è una rete neurale addestrata a salire questa scala da t=T fino a t=0.",
  closingPretitle: "Vedi la matematica in movimento",
  closingTitle: "Addestra un mini denoiser. Genera dati nuovi.",
  closingBody:
    "L'Explorer addestra una piccola rete di score su un dataset 2D, poi campiona eseguendo la catena inversa da rumore gaussiano puro. Vedi in tempo reale come punti casuali si riorganizzano sulla varietà dei dati — lo stesso trucco che trasforma rumore in immagini, a una scala leggibile.",
  ctaLabel: "→ Apri l'Explorer",
};

// ---------------- Português ----------------
const pt: RichStory = {
  page: {
    pretitle: "Tema · Caos",
    title: "Modelos de difusão por remoção de ruído",
    tagline: "Ruído, caminhado para trás até virar imagem.",
    intro:
      "Pega numa fotografia, polvilha um pouco de ruído gaussiano, repete mil vezes — a fotografia transforma-se em chuvisco puro. Um modelo de difusão é uma rede neuronal treinada para percorrer esse processo ao contrário: dado o ruído, prever a versão um pouco menos ruidosa, e mais uma, e mais uma, até surgir uma imagem nova. Stable Diffusion, Midjourney, DALL·E e Sora são todos a mesma ideia, em grande escala, com condicionamento por texto e um espaço latente aprendido.",
    ctaInteractive: "→ Abrir o Explorer",
  },
  encounter: {
    pretitle: "Primeiro encontro",
    title: "Ruído entra. Imagem sai.",
    cards: [
      {
        label: "01",
        title: "A ideia central",
        body: "A difusão trata a geração de imagens como remoção de ruído. O processo direto é uma cadeia de Markov que corrompe gradualmente os dados em ruído gaussiano; o processo inverso é uma cadeia aprendida que devolve ruído puro a dados. Treina a inversa em imagens suficientes e ela generaliza — amostra ruído novo, percorre-o ao contrário, obtém uma imagem que nunca existiu.",
      },
      {
        label: "02",
        title: "Um exemplo concreto",
        body: "Mostra a uma U-Net milhares de tuplos (imagem, nível de ruído, imagem parcialmente ruidosa) e pergunta: que ruído exato foi adicionado? Quando o adivinha de forma fiável em qualquer nível, inverte a pergunta — parte de ruído puro e subtrai a previsão em mil pequenos passos. O que era chuvisco converge, passo a passo, em algo coerente.",
      },
      {
        label: "03",
        title: "Porque importa",
        body: "A difusão substituiu as GAN em 2022 como método dominante de geração de imagens porque treina de forma estável, escala limpamente e aceita condicionamento arbitrário. A mesma matemática hoje move esqueletos de fármacos, síntese de áudio, modelos de vídeo e até downscaling climático — onde se possa imaginar um processo a destruir estrutura lentamente, pode-se imaginar aprender a invertê-lo.",
      },
    ],
    tryIt:
      "Transforma uma pequena imagem em ruído e regressa. Treina um denoiser de brincadeira em dados 2D e vê o ruído reorganizar-se em estrutura.",
  },
  sections: [
    {
      pretitle: "Secção 01 · O processo direto",
      title: "Como uma imagem se torna ruído",
      body: "Escolhe um calendário de ruído — uma pequena sequência β₁ < β₂ < … < β_T de variâncias. No passo t, substitui cada píxel por √(1−β_t)·x_{t−1} + √β_t·ε, em que ε é ruído gaussiano novo. Iterado T = 1000 vezes, leva qualquer imagem a uma amostra de N(0, I): o conteúdo original desapareceu sem remédio. Um pouco de álgebra limpa enrola toda a cadeia numa única forma fechada, q(x_t | x_0) = N(√ᾱ_t · x_0, (1−ᾱ_t) I), de modo que podes saltar diretamente para qualquer nível de ruído sem simular cada passo.",
    },
    {
      pretitle: "Secção 02 · O processo inverso",
      title: "Aprender a desfazer ruído, um passo de cada vez",
      body: "A cadeia inversa p_θ(x_{t−1} | x_t) é o que a rede aprende. Sohl-Dickstein (2015) mostrou que, se os passos diretos forem pequenos, os passos inversos também são gaussianos, pelo que uma rede só tem de aprender as suas médias e variâncias. Ho, Jain e Abbeel (2020) — o artigo DDPM — simplificaram a perda a ‖ε − ε_θ(x_t, t)‖², isto é, prever o ruído adicionado a x_0. Essa reformulação foi o que tornou a difusão prática: um alvo de regressão minúsculo e limpo substitui um limite variacional caprichoso.",
    },
    {
      pretitle: "Secção 03 · Porque uma U-Net prediz ruído",
      title: "A mesma forma entra, a mesma forma sai",
      body: "O denoiser ε_θ tem de ler uma imagem e produzir outra das mesmas dimensões, portanto a arquitetura natural é uma U-Net: convolucional a descer e a subir, com ligações de salto que carregam os detalhes finos sobre o gargalo. O tempo t e o prompt textual entram como condicionamento — embeddings sinusoidais de tempo somados a cada bloco, cross-attention para um codificador de texto congelado para o prompt. O modelo nunca vê a imagem limpa diretamente; só aprende a reconhecer e a remover ruído, e isso basta.",
    },
    {
      pretitle: "Secção 04 · Amostragem",
      title: "Subir de novo a partir do ruído puro",
      body: "Para gerar, retira x_T ~ N(0, I) e itera x_{t−1} = (1/√α_t) · (x_t − ((1−α_t)/√(1−ᾱ_t)) · ε_θ(x_t, t)) + σ_t · z. O DDPM fá-lo para os T passos; o DDIM (Song 2020) colapsa a cadeia numa EDO determinística resolúvel em 20–50 passos. Solvers mais rápidos — DPM-Solver, Heun, Euler — empurram a geração para menos de um segundo numa GPU. Cada passo é uma pequena correção de denoising; empilha o suficiente e uma imagem coerente emerge do ruído.",
    },
    {
      pretitle: "Secção 05 · Classifier-free guidance & condicionamento textual",
      title: "Orientar a caminhada com um prompt",
      body: "Amostras puramente não condicionadas são desfocadas e descontroladas. Para seguir um prompt, treina a U-Net a receber um embedding textual c (de CLIP ou T5) por cross-attention, largando o condicionamento em 10–20 % dos casos. Ao amostrar, usa classifier-free guidance: ε̃ = ε_θ(x_t, ∅) + w · (ε_θ(x_t, c) − ε_θ(x_t, ∅)). A escala de guidance w aguça a fidelidade ao prompt à custa de diversidade — w = 7,5 é o valor canónico do Stable Diffusion. O mesmo truque condiciona em bordas, mapas de profundidade, poses ou outras imagens no ControlNet.",
    },
    {
      pretitle: "Secção 06 · Da termodinâmica ao Stable Diffusion",
      title: "Uma linhagem curta e rápida",
      body: "Sohl-Dickstein e colegas introduziram o quadro direto/inverso em 2015, enquadrando-o como termodinâmica fora do equilíbrio. Song e Ermon (2019) chegaram lá por outro ângulo — score matching com dinâmica de Langevin — e provaram que as duas visões são equivalentes a menos de uma reparametrização. Ho, Jain e Abbeel (2020) fecharam o círculo com a perda de predição de ruído e amostras SOTA em CIFAR. Rombach et al. (2022) levaram a difusão para o espaço latente de um VAE, cortaram o cálculo em 50× e produziram o Stable Diffusion. Sete anos da curiosidade termodinâmica ao motor de imagens da internet.",
    },
  ],
  ladderCaption: "Processo direto · q(x_t | x_0)",
  ladderScrub: "Percorre os níveis de ruído",
  ladderPlay: "▶ Reproduzir (ir e voltar)",
  ladderPause: "❚❚ Pausa",
  ladderForward: "↦ Avançar (limpo → ruído)",
  ladderReverse: "↤ Recuar (ruído → limpo)",
  ladderStep: "Passo de difusão t",
  ladderHint:
    "Em t=0 a imagem é a original. Cada passo multiplica o sinal por √(1−β) e mistura ruído gaussiano novo com peso √β. Em t=T o sinal desapareceu e só fica ruído. O processo inverso é uma rede neuronal treinada para subir esta escada de t=T até t=0.",
  closingPretitle: "Vê a matemática em movimento",
  closingTitle: "Treina um denoiser minúsculo. Gera dados novos.",
  closingBody:
    "O Explorer treina uma pequena rede de score num conjunto 2D e depois amostra correndo a cadeia inversa a partir de ruído gaussiano puro. Vês em tempo real pontos aleatórios a reorganizarem-se sobre a variedade de dados — o mesmo truque que transforma ruído em imagens, a uma escala legível.",
  ctaLabel: "→ Abrir o Explorer",
};

// ---------------- Svenska ----------------
const sv: RichStory = {
  page: {
    pretitle: "Ämne · Kaos",
    title: "Diffusionsmodeller med brusborttagning",
    tagline: "Brus, gånget baklänges till en bild.",
    intro:
      "Ta ett fotografi, strö i lite gaussiskt brus, upprepa tusen gånger — fotografiet blir rent brus. En diffusionsmodell är ett neuralt nätverk som tränats att vandra den processen baklänges: givet brus, förutsäg den något mindre brusiga versionen, och en gång till, och en gång till, tills en helt ny bild dyker upp. Stable Diffusion, Midjourney, DALL·E och Sora är alla samma idé, uppskalad med textkonditionering och ett inlärt latentrum.",
    ctaInteractive: "→ Öppna Explorern",
  },
  encounter: {
    pretitle: "Första mötet",
    title: "Brus in. Bild ut.",
    cards: [
      {
        label: "01",
        title: "Den stora idén",
        body: "Diffusion behandlar bildgenerering som brusborttagning. Den framåtriktade processen är en Markovkedja som gradvis korrumperar data till gaussiskt brus; den bakåtriktade processen är en inlärd kedja som tar rent brus tillbaka till data. Träna den bakåtriktade på tillräckligt med bilder och den generaliserar — sampla nytt brus, vandra bakåt, få en helt ny bild som aldrig funnits.",
      },
      {
        label: "02",
        title: "Ett konkret exempel",
        body: "Visa ett U-Net tusentals tripler (bild, brusnivå, delvis brusig bild) och fråga: vilket exakt brus tillsattes? När det gissar bruset tillförlitligt på vilken nivå som helst, vänder du på frågan — börja med rent brus och dra av prediktionen i tusen små steg. Det som var brus konvergerar, ruta för ruta, mot något sammanhängande.",
      },
      {
        label: "03",
        title: "Varför det spelar roll",
        body: "Diffusion ersatte GAN 2022 som dominerande metod för bildgenerering eftersom den tränar stabilt, skalar rent och tar emot godtycklig konditionering. Samma matematik driver idag läkemedelsbackbones, ljudsyntes, videomodeller och till och med klimatnedskalning — överallt där man kan föreställa sig en process som långsamt förstör struktur kan man föreställa sig att lära sig köra den åt andra hållet.",
      },
    ],
    tryIt:
      "Vandra en liten bild till brus och tillbaka. Träna en leksaksbrusborttagare på 2D-data och se bruset omordna sig till struktur.",
  },
  sections: [
    {
      pretitle: "Avsnitt 01 · Den framåtriktade processen",
      title: "Hur en bild blir brus",
      body: "Välj ett brusschema — en liten följd β₁ < β₂ < … < β_T av varianser. I steg t, ersätt varje pixel med √(1−β_t)·x_{t−1} + √β_t·ε, där ε är nytt gaussiskt brus. Itererat T = 1000 gånger driver det varje bild till en sampel från N(0, I): det ursprungliga innehållet är oåterkalleligt borta. Lite ren algebra rullar hela kedjan till en enda sluten form, q(x_t | x_0) = N(√ᾱ_t · x_0, (1−ᾱ_t) I), så att du kan hoppa direkt till vilken brusnivå som helst utan att simulera varje steg.",
    },
    {
      pretitle: "Avsnitt 02 · Den bakåtriktade processen",
      title: "Lära sig ångra brus, ett steg i taget",
      body: "Bakåtkedjan p_θ(x_{t−1} | x_t) är vad nätet lär sig. Sohl-Dickstein (2015) visade att om framåtstegen är små är bakåtstegen också gaussiska, så ett nät behöver bara lära sig deras medel och varianser. Ho, Jain & Abbeel (2020) — DDPM-artikeln — förenklade förlusten till ‖ε − ε_θ(x_t, t)‖², det vill säga förutsäg bruset som tillsatts x_0. Den omformuleringen gjorde diffusion praktisk: ett pyttelitet, rent regressionsmål ersätter en krånglig variationsgräns.",
    },
    {
      pretitle: "Avsnitt 03 · Varför ett U-Net förutsäger brus",
      title: "Samma form in, samma form ut",
      body: "Brusborttagaren ε_θ måste läsa en bild och producera en bild av samma dimensioner, så den naturliga arkitekturen är ett U-Net: konvolutionellt nedåt och uppåt, med skip-anslutningar som bär fina detaljer över flaskhalsen. Tid t och textprompten kommer in som konditionering — sinusformade tidsembeddingar adderade i varje block, cross-attention mot en frusen textkodare för prompten. Modellen ser aldrig den rena bilden direkt; den lär sig bara känna igen och ta bort brus, och det räcker.",
    },
    {
      pretitle: "Avsnitt 04 · Sampling",
      title: "Klättra tillbaka från rent brus",
      body: "För att generera, dra x_T ~ N(0, I) och iterera x_{t−1} = (1/√α_t) · (x_t − ((1−α_t)/√(1−ᾱ_t)) · ε_θ(x_t, t)) + σ_t · z. DDPM gör det för alla T steg; DDIM (Song 2020) kollapsar kedjan till en deterministisk ODE som löses på 20–50 steg. Snabbare lösare — DPM-Solver, Heun, Euler — pressar generering under en sekund på en GPU. Varje steg är en liten brusborttagningskorrigering; stapla tillräckligt många och en sammanhängande bild dyker upp ur bruset.",
    },
    {
      pretitle: "Avsnitt 05 · Classifier-free guidance & textkonditionering",
      title: "Styra vandringen med en prompt",
      body: "Rent okonditionerade sampel är suddiga och okontrollerade. För att följa en prompt, träna U-Net att ta in en textembedding c (från CLIP eller T5) via cross-attention och släppa konditioneringen 10–20 % av tiden. Vid sampling används classifier-free guidance: ε̃ = ε_θ(x_t, ∅) + w · (ε_θ(x_t, c) − ε_θ(x_t, ∅)). Guidance-skalan w skärper prompttroheten på bekostnad av mångfald — w = 7,5 är Stable Diffusions kanoniska standardvärde. Samma trick konditionerar på kanter, djupkartor, poser eller andra bilder i ControlNet.",
    },
    {
      pretitle: "Avsnitt 06 · Från termodynamik till Stable Diffusion",
      title: "En kort, snabb släktlinje",
      body: "Sohl-Dickstein och kollegor introducerade ramverket framåt/bakåt 2015 och formulerade det som icke-jämviktstermodynamik. Song och Ermon (2019) nådde det från en annan vinkel — score-matching med Langevin-dynamik — och bevisade att de två synsätten är ekvivalenta så när som på en omparametrisering. Ho, Jain och Abbeel (2020) slöt cirkeln med brusprediktionsförlusten och SOTA-sampel på CIFAR. Rombach m.fl. (2022) flyttade diffusion in i en VAE:s latentrum, kapade beräkningen 50× och skapade Stable Diffusion. Sju år från termodynamisk kuriositet till internets bildmotor.",
    },
  ],
  ladderCaption: "Framåtprocess · q(x_t | x_0)",
  ladderScrub: "Bläddra genom brusnivåer",
  ladderPlay: "▶ Spela (framåt och tillbaka)",
  ladderPause: "❚❚ Paus",
  ladderForward: "↦ Framåt (ren → brus)",
  ladderReverse: "↤ Bakåt (brus → ren)",
  ladderStep: "Diffusionssteg t",
  ladderHint:
    "Vid t=0 är bilden originalet. Varje steg multiplicerar signalen med √(1−β) och blandar i nytt gaussiskt brus viktat med √β. Vid t=T är signalen borta och bara brus återstår. Bakåtprocessen är ett neuralt nät som tränats att klättra denna stege från t=T tillbaka till t=0.",
  closingPretitle: "Se matematiken i rörelse",
  closingTitle: "Träna en pytteliten brusborttagare. Sampla ny data.",
  closingBody:
    "Explorern tränar ett litet score-nät på ett 2D-dataset och samplar sedan genom att köra bakåtkedjan från rent gaussiskt brus. Du ser i realtid hur slumpmässiga punkter omorganiserar sig på datamångfalden — samma trick som förvandlar brus till bilder, i en skala du kan läsa.",
  ctaLabel: "→ Öppna Explorern",
};

// ---------------- Norsk ----------------
const no: RichStory = {
  page: {
    pretitle: "Tema · Kaos",
    title: "Diffusjonsmodeller med støyfjerning",
    tagline: "Støy, vandret baklengs til et bilde.",
    intro:
      "Ta et fotografi, strø på litt gaussisk støy, gjenta tusen ganger — fotografiet blir til ren snø. En diffusjonsmodell er et nevralt nettverk trent til å vandre den prosessen baklengs: gitt støy, forutsi den litt mindre støyete versjonen, og en gang til, og en gang til, til et nytt bilde dukker opp. Stable Diffusion, Midjourney, DALL·E og Sora er alle den samme idéen, oppskalert med tekstbetinging og et lært latentrom.",
    ctaInteractive: "→ Åpne Utforskeren",
  },
  encounter: {
    pretitle: "Første møte",
    title: "Støy inn. Bilde ut.",
    cards: [
      {
        label: "01",
        title: "Den store ideen",
        body: "Diffusjon behandler bildegenerering som støyfjerning. Den fremoverrettede prosessen er en Markov-kjede som gradvis korrumperer data til gaussisk støy; den bakoverrettede prosessen er en lært kjede som tar ren støy tilbake til data. Tren den bakoverrettede på nok bilder, og den generaliserer — sampl ny støy, vandre den baklengs, få et helt nytt bilde som aldri har eksistert.",
      },
      {
        label: "02",
        title: "Et konkret eksempel",
        body: "Vis et U-Net tusenvis av trippeller (bilde, støynivå, delvis støyete bilde) og spør: hvilken nøyaktig støy ble lagt til? Når den gjetter støyen pålitelig på hvilket nivå som helst, snur du spørsmålet — start fra ren støy og trekk fra prediksjonen i tusen små steg. Det som var snø konvergerer, bilderute for bilderute, til noe sammenhengende.",
      },
      {
        label: "03",
        title: "Hvorfor det betyr noe",
        body: "Diffusjon avløste GAN-ene i 2022 som dominerende metode for bildegenerering fordi den trener stabilt, skalerer rent og tar imot vilkårlig betinging. Den samme matematikken driver i dag medikament-backbones, lydsyntese, videomodeller og selv klimatnedskalering — overalt der du kan se for deg en prosess som sakte ødelegger struktur, kan du se for deg å lære den motsatt vei.",
      },
    ],
    tryIt:
      "Vandre et lite bilde til støy og tilbake. Tren en leketøys-støyfjerner på 2D-data og se støyen omorganisere seg til struktur.",
  },
  sections: [
    {
      pretitle: "Avsnitt 01 · Den fremoverrettede prosessen",
      title: "Hvordan et bilde blir til støy",
      body: "Velg en støyplan — en liten følge β₁ < β₂ < … < β_T av varianser. I steg t, erstatt hver piksel med √(1−β_t)·x_{t−1} + √β_t·ε, der ε er ny gaussisk støy. Iterert T = 1000 ganger driver det hvert bilde til en prøve fra N(0, I): det opprinnelige innholdet er uigjenkallelig borte. Litt ren algebra ruller hele kjeden inn i en enkelt lukket form, q(x_t | x_0) = N(√ᾱ_t · x_0, (1−ᾱ_t) I), slik at du kan hoppe direkte til ethvert støynivå uten å simulere hvert steg.",
    },
    {
      pretitle: "Avsnitt 02 · Den bakoverrettede prosessen",
      title: "Lære å oppheve støy, ett steg av gangen",
      body: "Bakoverkjeden p_θ(x_{t−1} | x_t) er det nettet lærer. Sohl-Dickstein (2015) viste at hvis fremoverstegene er små, er bakoverstegene også gaussiske, slik at et nett bare trenger å lære deres middelverdier og varianser. Ho, Jain & Abbeel (2020) — DDPM-artikkelen — forenklet tapet til ‖ε − ε_θ(x_t, t)‖², altså: forutsi støyen som ble lagt til x_0. Den omformuleringen gjorde diffusjon praktisk: et bittelite, rent regresjonsmål erstatter en krevende variasjonsgrense.",
    },
    {
      pretitle: "Avsnitt 03 · Hvorfor et U-Net forutsier støy",
      title: "Samme form inn, samme form ut",
      body: "Støyfjerneren ε_θ må lese et bilde og produsere et bilde av samme dimensjoner, så den naturlige arkitekturen er et U-Net: konvolusjonelt nedover og oppover, med skip-forbindelser som bærer fine detaljer over flaskehalsen. Tid t og tekstprompten kommer inn som betinging — sinusformede tids-embeddinger lagt til hver blokk, kryssoppmerksomhet mot en frossen tekstkoder for prompten. Modellen ser aldri det rene bildet direkte; den lærer bare å kjenne igjen og fjerne støy, og det er nok.",
    },
    {
      pretitle: "Avsnitt 04 · Sampling",
      title: "Klatre tilbake fra ren støy",
      body: "For å generere, trekk x_T ~ N(0, I) og iterer x_{t−1} = (1/√α_t) · (x_t − ((1−α_t)/√(1−ᾱ_t)) · ε_θ(x_t, t)) + σ_t · z. DDPM gjør det for alle T steg; DDIM (Song 2020) kollapser kjeden til en deterministisk ODE som løses på 20–50 steg. Raskere løsere — DPM-Solver, Heun, Euler — presser genereringen under ett sekund på en GPU. Hvert steg er en liten støyfjerningskorrigering; stable nok av dem og et sammenhengende bilde stiger ut av støyen.",
    },
    {
      pretitle: "Avsnitt 05 · Classifier-free guidance & tekstbetinging",
      title: "Styre vandringen med en prompt",
      body: "Rent ubetingede prøver er uskarpe og ukontrollerte. For å følge en prompt, tren U-Net til å ta inn en tekst-embedding c (fra CLIP eller T5) via kryssoppmerksomhet, og slipp betingingen 10–20 % av tiden. Ved sampling bruker du classifier-free guidance: ε̃ = ε_θ(x_t, ∅) + w · (ε_θ(x_t, c) − ε_θ(x_t, ∅)). Guidance-skalaen w skjerper prompttroheten på bekostning av mangfold — w = 7,5 er Stable Diffusions kanoniske standardverdi. Det samme trikset betinger på kanter, dybdekart, positurer eller andre bilder i ControlNet.",
    },
    {
      pretitle: "Avsnitt 06 · Fra termodynamikk til Stable Diffusion",
      title: "En kort, rask slektslinje",
      body: "Sohl-Dickstein og kolleger introduserte fremover-/bakover-rammeverket i 2015 og formulerte det som ikke-likevektstermodynamikk. Song og Ermon (2019) nådde det fra en annen vinkel — score-matching med Langevin-dynamikk — og beviste at de to synene er ekvivalente opp til en omparametrisering. Ho, Jain og Abbeel (2020) lukket sirkelen med støy-prediksjonstapet og SOTA-prøver på CIFAR. Rombach mfl. (2022) flyttet diffusjon inn i en VAEs latentrom, kuttet beregningen 50× og skapte Stable Diffusion. Sju år fra termodynamisk kuriositet til internettets bildemotor.",
    },
  ],
  ladderCaption: "Fremoverprosess · q(x_t | x_0)",
  ladderScrub: "Bla gjennom støynivåer",
  ladderPlay: "▶ Spill av (frem og tilbake)",
  ladderPause: "❚❚ Pause",
  ladderForward: "↦ Fremover (ren → støy)",
  ladderReverse: "↤ Bakover (støy → ren)",
  ladderStep: "Diffusjonssteg t",
  ladderHint:
    "Ved t=0 er bildet originalen. Hvert steg multipliserer signalet med √(1−β) og blander inn ny gaussisk støy vektet med √β. Ved t=T er signalet borte og bare støy gjenstår. Bakoverprosessen er et nevralt nett trent til å klatre denne stigen fra t=T tilbake til t=0.",
  closingPretitle: "Se matematikken i bevegelse",
  closingTitle: "Tren en bitteliten støyfjerner. Sampl ferske data.",
  closingBody:
    "Utforskeren trener et lite score-nett på et 2D-datasett, og sampler så ved å kjøre bakoverkjeden fra ren gaussisk støy. Du ser i sanntid hvordan tilfeldige punkter omorganiserer seg på datamangfoldigheten — det samme trikset som gjør støy til bilder, i en skala du kan lese.",
  ctaLabel: "→ Åpne Utforskeren",
};

const RICH_STORY: Record<Locale, RichStory> = { en, de, es, fr, it, pt, sv, no };

// --------------------------------------------------------------------------

export default function DiffusionStory() {
  const { locale } = useI18n();
  const story = RICH_STORY[locale];
  const page: StoryPage = { ...story.page, sections: [] };

  return (
    <StoryPageShell
      page={page}
      ctaHref="/diffusion/explorer"
      accent={ACCENT}
      borderAccent="border-signal-coral/70"
      bgAccent="bg-signal-coral/10"
      hoverAccent="hover:bg-signal-coral/20"
      gradient="from-signal-coral/10"
      formulaBadge="x_t = √(1−β)·x_{t−1} + √β·ε"
      formulaLatex={"x_t = \\sqrt{1-\\beta_t}\\,x_{t-1} + \\sqrt{\\beta_t}\\,\\epsilon"}
      finalLabel={story.closingTitle}
      signature={<DiffusionSignatureHero />}
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

      {/* Section 01 — forward process */}
      <section className="mx-auto mb-32 max-w-4xl">
        <StoryCard
          pretitle={story.sections[0].pretitle}
          title={story.sections[0].title}
          body={story.sections[0].body}
          accent={ACCENT}
        />
      </section>

      {/* INTERACTIVE — noise ladder (image scrubbed through t=0..T) */}
      <section className="mx-auto mb-32 max-w-4xl">
        <Reveal>
          <NoiseLadder
            caption={story.ladderCaption}
            scrubLabel={story.ladderScrub}
            playLabel={story.ladderPlay}
            pauseLabel={story.ladderPause}
            forwardLabel={story.ladderForward}
            reverseLabel={story.ladderReverse}
            stepLabel={story.ladderStep}
            hint={story.ladderHint}
          />
        </Reveal>
      </section>

      {/* Section 02 — reverse process */}
      <section className="mx-auto mb-32 max-w-4xl">
        <StoryCard
          pretitle={story.sections[1].pretitle}
          title={story.sections[1].title}
          body={story.sections[1].body}
          accent={ACCENT}
        />
      </section>

      {/* Section 03 — U-Net */}
      <section className="mx-auto mb-32 max-w-4xl">
        <StoryCard
          pretitle={story.sections[2].pretitle}
          title={story.sections[2].title}
          body={story.sections[2].body}
          accent={ACCENT}
        />
      </section>

      {/* Section 04 — sampling */}
      <section className="mx-auto mb-32 max-w-4xl">
        <StoryCard
          pretitle={story.sections[3].pretitle}
          title={story.sections[3].title}
          body={story.sections[3].body}
          accent={ACCENT}
        />
      </section>

      {/* Section 05 — CFG */}
      <section className="mx-auto mb-32 max-w-4xl">
        <StoryCard
          pretitle={story.sections[4].pretitle}
          title={story.sections[4].title}
          body={story.sections[4].body}
          accent={ACCENT}
        />
      </section>

      {/* Section 06 — lineage */}
      <section className="mx-auto mb-32 max-w-4xl space-y-8">
        <StoryCard
          pretitle={story.sections[5].pretitle}
          title={story.sections[5].title}
          body={story.sections[5].body}
          accent={ACCENT}
        />
        <Reveal delay={120}>
          <div className="hairline grid grid-cols-2 gap-3 rounded-2xl border bg-ink-950/40 p-6 text-center md:grid-cols-4">
            {[
              { y: "2015", who: "Sohl-Dickstein" },
              { y: "2019", who: "Song & Ermon" },
              { y: "2020", who: "Ho · Jain · Abbeel" },
              { y: "2022", who: "Rombach et al." },
            ].map((m) => (
              <div key={m.y} className="space-y-1">
                <div className={`math-italic text-2xl ${ACCENT}`}>{m.y}</div>
                <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                  {m.who}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
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
            href="/diffusion/explorer"
            className="inline-block rounded-full border border-signal-coral/70 bg-signal-coral/10 px-8 py-4 font-mono text-sm uppercase tracking-widest2 text-signal-coral transition-colors hover:bg-signal-coral/25"
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
    <div className="glass hairline h-full space-y-3 rounded-2xl border p-6 transition-colors hover:border-signal-coral/40">
      <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>{label}</div>
      <h3 className="math-italic text-2xl leading-snug text-ink-100">{title}</h3>
      <div className="text-sm leading-relaxed text-ink-200">{children}</div>
    </div>
  );
}
