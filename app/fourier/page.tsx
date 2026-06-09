"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { StoryPageShell, StoryCard } from "@/components/StoryPageShell";
import { Reveal } from "@/components/Reveal";
import { FourierHarmonicBuilder } from "@/components/FourierHarmonicBuilder";
import { FourierSpectrumPlay } from "@/components/FourierSpectrumPlay";
import type { Locale } from "@/lib/i18n/types";

const ACCENT = "text-signal-teal";

type RichStory = {
  encounter: {
    pretitle: string;
    title: string;
    cards: Array<{ label: string; title: string; body: string }>;
    tryIt: string;
  };
  sections: Array<{ pretitle: string; title: string; body: string }>;
  closingTitle: string;
  closingBody: string;
  ctaLabel: string;
  // Inline labels for visual captions / mini-cards
  labels: {
    builderCaption: string;
    spectrumCaption: string;
    pianoCodeCaption: string;
    gibbsCaption: string;
    fftCaption: string;
    uncertaintyCaption: string;
    applicationsCaption: string;
    applicationsLead: string;
    apps: Array<{ what: string; how: string }>;
    duality: { time: string; freq: string };
    fftRow: { naive: string; fft: string; speedup: string };
  };
};

// English — full prose, anchor for tone.
const en: RichStory = {
  encounter: {
    pretitle: "First encounter",
    title: "Every wobble is a stack of pure tones",
    cards: [
      {
        label: "01",
        title: "The big idea",
        body: "Every wobble you can imagine — a violin note, a heartbeat trace, a photograph's edges, the radio in your pocket — is secretly a stack of pure sine waves added together. Change the recipe of sines and you change the sound, the image, the signal. That single fact is the Fourier transform.",
      },
      {
        label: "02",
        title: "A concrete example",
        body: "Press middle-C on a piano. The string vibrates at 261.6 Hz (the fundamental), and at the same time it vibrates at 523.3 Hz, 785 Hz, 1046.5 Hz — integer multiples called harmonics, each with its own loudness. That mix of overtones is what makes the piano sound like a piano and not a flute, even though the note has the same name.",
      },
      {
        label: "03",
        title: "Why it matters",
        body: "JPEG and MP3 throw away the harmonics your eyes and ears can't notice. MRI scanners measure frequency-space samples directly and reconstruct your body from them. Wi-Fi and 5G pack data onto thousands of sine carriers in parallel. The same one fact stands underneath all of it.",
      },
    ],
    tryIt: "Below: build a square wave by hand, then sculpt a sound by dragging sliders.",
  },
  sections: [
    {
      pretitle: "Step one · The decomposition principle",
      title: "Any reasonable signal = a sum of sines",
      body: "A periodic function f(t), under mild conditions (Dirichlet, 1829), can be written as a sum over discrete frequencies: f(t) = Σₖ aₖ sin(kωt + φₖ). The frequencies are integer multiples of one fundamental ω; the amplitudes aₖ and phases φₖ are uniquely determined by f. The space of well-behaved signals splits into independent sine-shaped axes, and analysing a signal means writing it in that basis.",
    },
    {
      pretitle: "Step two · Building a square wave",
      title: "Sharp corners are the hardest part",
      body: "A square wave is the cleanest test of the principle: pure +1 and −1, with infinitely sharp jumps. Its Fourier series is 4/π · Σ sin((2k−1)·2πt)/(2k−1), summed over k = 1, 2, 3, … At one harmonic the answer is a single rolling sine. At three, the corners begin to appear. At seven, you can read it as a square — except for a stubborn 8.95% overshoot at every edge. That overshoot never disappears: Gibbs proved in 1899 that at a jump discontinuity the partial sums always overshoot by exactly this constant, however many harmonics you add. The corner is the cost of representing 'instant' in a basis of smooth waves.",
    },
    {
      pretitle: "Step three · Time-domain ↔ Frequency-domain",
      title: "Two windows onto the same signal",
      body: "The Fourier transform is a change of coordinates. The same signal has two equivalent representations: a graph against time (the waveform you'd see on an oscilloscope) and a graph against frequency (the spectrum you'd see on an analyser). A spectrogram slides a short window along the recording, takes the spectrum inside each window, and stacks them — turning a melody into a glowing piano-roll of frequency-vs-time. Sliders here let you sculpt one and watch the other rebuild itself live.",
    },
    {
      pretitle: "Step four · Continuous, discrete, and the FFT",
      title: "The algorithm that made everything fast",
      body: "On paper the transform is an integral, f̂(ξ) = ∫ f(t) e^(−2πi ξ t) dt — defined for any integrable function. On a computer we work with samples and the discrete Fourier transform: N input numbers, N output frequencies. Naïvely that costs N² multiplications — for a 4-second CD recording (≈ 200 000 samples) about 40 billion. In 1965 Cooley and Tukey rediscovered (Gauss already had it in 1805) a recursive trick that brings the cost down to N log N — about 3 million for the same recording. Without that single algorithm there would be no real-time MP3, no JPEG, no smartphone radio, no medical imaging as we know it.",
    },
    {
      pretitle: "Step five · The uncertainty principle",
      title: "A signal can't be sharp in both worlds at once",
      body: "Squeeze a signal into a narrow time window and its Fourier transform necessarily smears across many frequencies — and vice versa. Make the variance in time σ_t and the variance in frequency σ_f. They satisfy σ_t · σ_f ≥ 1/(4π) (or, with the angular convention, σ_t · σ_ω ≥ 1/2), and the bound is reached only by the Gaussian function — which is, beautifully, its own Fourier transform. Multiply both sides by ℏ and you have Heisenberg's position-momentum uncertainty: the quantum principle is the same inequality in a different guise. Time and frequency are dual coordinates, and the trade-off between them is mathematics, not engineering.",
    },
    {
      pretitle: "Step six · Cultural impact",
      title: "Every camera, every microphone, every Wi-Fi packet",
      body: "Almost every signal humans store, transmit, or process today passes through a Fourier transform on the way. The camera in your phone runs a discrete cosine transform on every 8×8 block before saving the JPEG. The microphone driver does a thousand short-time FFTs per second on your voice. The Wi-Fi chip uses OFDM, breaking each packet into thousands of carrier frequencies that are turned back into bits with one inverse FFT per symbol. MRI machines literally collect samples in frequency-space — k-space — and apply an inverse Fourier transform to make the image of you. One theorem, three centuries old, holds the modern world together.",
    },
  ],
  closingTitle: "Open the Explorer",
  closingBody:
    "Add harmonics one at a time, watch a square wave emerge, sweep the phase and listen to the spectrum.",
  ctaLabel: "→ Open the Explorer",
  labels: {
    builderCaption: "Harmonic builder · pick a target, raise N",
    spectrumCaption: "Spectrum play · drag the bars, hear the sum",
    pianoCodeCaption: "Middle-C, additive synthesis",
    gibbsCaption: "Gibbs overshoot ≈ 8.95%",
    fftCaption: "Cooley–Tukey, 1965",
    uncertaintyCaption: "Heisenberg dual",
    applicationsCaption: "Where you meet it",
    applicationsLead:
      "The same theorem, wearing different clothes in every corner of modern technology.",
    apps: [
      { what: "MP3", how: "psychoacoustic mask" },
      { what: "JPEG", how: "8×8 DCT blocks" },
      { what: "MRI", how: "k-space → image" },
      { what: "Wi-Fi / 5G", how: "OFDM carriers" },
    ],
    duality: { time: "Time domain", freq: "Frequency domain" },
    fftRow: { naive: "N² · naïve DFT", fft: "N log N · FFT", speedup: "speed-up" },
  },
};

// German
const de: RichStory = {
  encounter: {
    pretitle: "Erste Begegnung",
    title: "Jede Schwingung ist ein Stapel reiner Töne",
    cards: [
      {
        label: "01",
        title: "Die zentrale Idee",
        body: "Jede Schwingung, die du dir vorstellen kannst — ein Geigenton, eine EKG-Spur, die Kanten eines Fotos, das Funksignal in deiner Tasche — ist heimlich ein Stapel reiner Sinuswellen, übereinandergelegt. Ändere das Rezept der Sinusse, und du änderst Klang, Bild, Signal. Diese eine Tatsache ist die Fourier-Transformation.",
      },
      {
        label: "02",
        title: "Ein konkretes Beispiel",
        body: "Drücke das mittlere C auf einem Klavier. Die Saite schwingt mit 261,6 Hz (Grundton), gleichzeitig aber auch mit 523,3 Hz, 785 Hz, 1046,5 Hz — ganzzahlige Vielfache, sogenannte Obertöne, jeder mit seiner eigenen Lautstärke. Genau diese Mischung macht, dass das Klavier nach Klavier klingt und nicht nach Flöte — obwohl der Ton den gleichen Namen trägt.",
      },
      {
        label: "03",
        title: "Warum es zählt",
        body: "JPEG und MP3 werfen die Obertöne weg, die Auge und Ohr nicht bemerken. MRT-Scanner messen direkt Stichproben im Frequenzraum und rekonstruieren daraus den Körper. WLAN und 5G stapeln Daten parallel auf Tausende Sinusträger. Hinter allem steht dieselbe eine Tatsache.",
      },
    ],
    tryIt: "Unten: bau eine Rechteckwelle von Hand, dann forme einen Klang mit Reglern.",
  },
  sections: [
    {
      pretitle: "Schritt eins · Das Zerlegungsprinzip",
      title: "Jedes vernünftige Signal = eine Summe von Sinüssen",
      body: "Eine periodische Funktion f(t) lässt sich unter milden Bedingungen (Dirichlet, 1829) als Summe über diskrete Frequenzen schreiben: f(t) = Σₖ aₖ sin(kωt + φₖ). Die Frequenzen sind ganzzahlige Vielfache einer Grundkreisfrequenz ω; Amplituden aₖ und Phasen φₖ sind durch f eindeutig festgelegt. Der Raum der gutartigen Signale zerfällt in unabhängige sinusförmige Achsen, und ein Signal zu analysieren heißt, es in dieser Basis aufzuschreiben.",
    },
    {
      pretitle: "Schritt zwei · Eine Rechteckwelle bauen",
      title: "Scharfe Kanten sind das Schwerste",
      body: "Eine Rechteckwelle ist der sauberste Test des Prinzips: reines +1 und −1, mit unendlich scharfen Sprüngen. Ihre Fourier-Reihe ist 4/π · Σ sin((2k−1)·2πt)/(2k−1), summiert über k = 1, 2, 3, … Bei einer Harmonischen ist die Antwort eine einzelne Sinuswelle. Bei drei beginnen die Ecken aufzutauchen. Bei sieben kann man es als Rechteck lesen — bis auf einen hartnäckigen Überschwinger von 8,95 % an jeder Kante. Dieser Überschwinger verschwindet nie: Gibbs bewies 1899, dass an jeder Sprungstelle die Partialsummen immer um exakt diese Konstante überschießen, egal wie viele Harmonische man addiert. Die Ecke ist der Preis dafür, 'sofort' in einer Basis glatter Wellen darzustellen.",
    },
    {
      pretitle: "Schritt drei · Zeitbereich ↔ Frequenzbereich",
      title: "Zwei Fenster auf dasselbe Signal",
      body: "Die Fourier-Transformation ist ein Koordinatenwechsel. Dasselbe Signal hat zwei gleichwertige Darstellungen: ein Graph gegen die Zeit (die Wellenform auf einem Oszilloskop) und ein Graph gegen die Frequenz (das Spektrum auf einem Analyser). Ein Spektrogramm schiebt ein kurzes Fenster über die Aufnahme, nimmt in jedem Fenster das Spektrum und stapelt sie — eine Melodie wird zu einer leuchtenden Klavierrolle aus Frequenz und Zeit. Mit den Reglern hier formst du eine Seite und siehst die andere live mitlaufen.",
    },
    {
      pretitle: "Schritt vier · Kontinuierlich, diskret und die FFT",
      title: "Der Algorithmus, der alles schnell gemacht hat",
      body: "Auf dem Papier ist die Transformation ein Integral, f̂(ξ) = ∫ f(t) e^(−2πi ξ t) dt — für jede integrierbare Funktion definiert. Im Rechner arbeitet man mit Stichproben und der diskreten Fourier-Transformation: N Eingabezahlen, N Ausgabefrequenzen. Naiv kostet das N² Multiplikationen — für eine 4-Sekunden-CD-Aufnahme (≈ 200 000 Samples) etwa 40 Milliarden. 1965 entdeckten Cooley und Tukey (Gauß hatte es 1805 schon) einen rekursiven Trick, der die Kosten auf N log N drückt — etwa 3 Millionen für dieselbe Aufnahme. Ohne diesen einen Algorithmus gäbe es kein Echtzeit-MP3, kein JPEG, kein Smartphone-Funk, keine medizinische Bildgebung in heutiger Form.",
    },
    {
      pretitle: "Schritt fünf · Die Unschärferelation",
      title: "Ein Signal kann nicht in beiden Welten scharf sein",
      body: "Pferche ein Signal in ein schmales Zeitfenster, und seine Fourier-Transformierte verteilt sich zwangsläufig auf viele Frequenzen — und umgekehrt. Sei σ_t die Streuung in der Zeit und σ_f die Streuung in der Frequenz. Es gilt σ_t · σ_f ≥ 1/(4π) (oder, mit der Winkelkonvention, σ_t · σ_ω ≥ 1/2), und Gleichheit erreicht allein die Gauß-Funktion — die, schön genug, ihre eigene Fourier-Transformierte ist. Multipliziere beide Seiten mit ℏ und du hast Heisenbergs Orts-Impuls-Ungleichung: das Quantenprinzip ist dieselbe Ungleichung in anderer Gestalt. Zeit und Frequenz sind duale Koordinaten, und der Handel zwischen ihnen ist Mathematik, nicht Ingenieurskunst.",
    },
    {
      pretitle: "Schritt sechs · Kultureller Einfluss",
      title: "Jede Kamera, jedes Mikrofon, jedes WLAN-Paket",
      body: "Fast jedes Signal, das Menschen heute speichern, übertragen oder verarbeiten, läuft auf seinem Weg durch eine Fourier-Transformation. Die Kamera in deinem Telefon rechnet eine diskrete Kosinus-Transformation auf jedem 8×8-Block, bevor das JPEG geschrieben wird. Der Mikrofontreiber führt tausend Kurzzeit-FFTs pro Sekunde auf deiner Stimme aus. Der WLAN-Chip nutzt OFDM, bricht jedes Paket in Tausende Trägerfrequenzen und gewinnt mit je einer inversen FFT pro Symbol die Bits zurück. MRT-Geräte sammeln buchstäblich Stichproben im Frequenzraum — k-Raum — und wenden eine inverse Fourier-Transformation an, um dein Bild zu erzeugen. Ein Theorem, drei Jahrhunderte alt, hält die moderne Welt zusammen.",
    },
  ],
  closingTitle: "Explorer öffnen",
  closingBody:
    "Füge Harmonische einzeln hinzu, sieh die Rechteckwelle entstehen, drehe die Phase und höre das Spektrum.",
  ctaLabel: "→ Explorer öffnen",
  labels: {
    builderCaption: "Harmonischer Baukasten · Ziel wählen, N erhöhen",
    spectrumCaption: "Spektrum-Spiel · Balken ziehen, Summe hören",
    pianoCodeCaption: "Mittleres C, additive Synthese",
    gibbsCaption: "Gibbs-Überschwinger ≈ 8,95 %",
    fftCaption: "Cooley–Tukey, 1965",
    uncertaintyCaption: "Heisenberg-Dual",
    applicationsCaption: "Wo du ihr begegnest",
    applicationsLead:
      "Dasselbe Theorem in unterschiedlicher Kleidung, in jeder Ecke moderner Technik.",
    apps: [
      { what: "MP3", how: "psychoakustische Maske" },
      { what: "JPEG", how: "8×8-DCT-Blöcke" },
      { what: "MRT", how: "k-Raum → Bild" },
      { what: "WLAN / 5G", how: "OFDM-Träger" },
    ],
    duality: { time: "Zeitbereich", freq: "Frequenzbereich" },
    fftRow: { naive: "N² · naive DFT", fft: "N log N · FFT", speedup: "Beschleunigung" },
  },
};

// Spanish
const es: RichStory = {
  encounter: {
    pretitle: "Primer encuentro",
    title: "Toda vibración es un apilado de tonos puros",
    cards: [
      {
        label: "01",
        title: "La gran idea",
        body: "Cada vibración que puedas imaginar — una nota de violín, el trazo de un latido, los bordes de una fotografía, la radio en tu bolsillo — es en secreto un apilado de ondas sinusoidales puras sumadas. Cambia la receta de senos y cambias el sonido, la imagen, la señal. Ese único hecho es la transformada de Fourier.",
      },
      {
        label: "02",
        title: "Un ejemplo concreto",
        body: "Pulsa el do central de un piano. La cuerda vibra a 261,6 Hz (la fundamental) y al mismo tiempo a 523,3 Hz, 785 Hz, 1046,5 Hz — múltiplos enteros llamados armónicos, cada uno con su propio volumen. Esa mezcla de sobretonos es lo que hace que un piano suene a piano y no a flauta, aunque la nota se llame igual.",
      },
      {
        label: "03",
        title: "Por qué importa",
        body: "JPEG y MP3 descartan los armónicos que ojos y oídos no notan. Los escáneres de RM miden directamente muestras en el espacio de frecuencias y reconstruyen tu cuerpo a partir de ellas. Wi-Fi y 5G empaquetan datos en miles de portadoras sinusoidales en paralelo. El mismo único hecho está debajo de todo.",
      },
    ],
    tryIt: "Abajo: construye una onda cuadrada a mano y luego esculpe un sonido moviendo barras.",
  },
  sections: [
    {
      pretitle: "Paso uno · El principio de descomposición",
      title: "Cualquier señal razonable = una suma de senos",
      body: "Una función periódica f(t), bajo condiciones suaves (Dirichlet, 1829), se escribe como suma sobre frecuencias discretas: f(t) = Σₖ aₖ sin(kωt + φₖ). Las frecuencias son múltiplos enteros de una fundamental ω; las amplitudes aₖ y fases φₖ quedan determinadas por f. El espacio de señales bien portadas se parte en ejes independientes con forma de seno, y analizar una señal es escribirla en esa base.",
    },
    {
      pretitle: "Paso dos · Construir una onda cuadrada",
      title: "Las esquinas afiladas son lo más difícil",
      body: "La onda cuadrada es la prueba más limpia del principio: +1 y −1 puros, con saltos infinitamente afilados. Su serie de Fourier es 4/π · Σ sin((2k−1)·2πt)/(2k−1), sumada sobre k = 1, 2, 3, … Con un armónico la respuesta es un seno solitario. Con tres empiezan a aparecer las esquinas. Con siete ya se lee como cuadrada — salvo por un sobreimpulso del 8,95 % que se aferra a cada borde. Ese exceso no desaparece nunca: Gibbs demostró en 1899 que en una discontinuidad las sumas parciales rebasan justo esa constante, sumes los armónicos que sumes. La esquina es el precio de representar lo 'instantáneo' en una base de ondas suaves.",
    },
    {
      pretitle: "Paso tres · Dominio del tiempo ↔ dominio de la frecuencia",
      title: "Dos ventanas a la misma señal",
      body: "La transformada de Fourier es un cambio de coordenadas. La misma señal tiene dos representaciones equivalentes: una contra el tiempo (la forma de onda en un osciloscopio) y otra contra la frecuencia (el espectro en un analizador). Un espectrograma desliza una ventana corta sobre la grabación, toma el espectro dentro de cada ventana y los apila — convirtiendo una melodía en un piano-roll brillante de frecuencia y tiempo. Las barras de abajo te dejan esculpir una y ver la otra reconstruirse en vivo.",
    },
    {
      pretitle: "Paso cuatro · Continua, discreta y la FFT",
      title: "El algoritmo que lo hizo todo rápido",
      body: "Sobre el papel la transformada es una integral, f̂(ξ) = ∫ f(t) e^(−2πi ξ t) dt, definida para cualquier función integrable. En un ordenador se trabaja con muestras y la transformada discreta: N entradas, N frecuencias. Ingenuamente cuesta N² multiplicaciones — para 4 segundos de un CD (≈ 200 000 muestras) son unos 40 mil millones. En 1965 Cooley y Tukey redescubrieron (Gauss ya lo tenía en 1805) un truco recursivo que baja el coste a N log N — unos 3 millones para la misma grabación. Sin ese único algoritmo no existiría el MP3 en tiempo real, ni JPEG, ni radio en el móvil, ni la imagen médica como la conocemos.",
    },
    {
      pretitle: "Paso cinco · El principio de incertidumbre",
      title: "Una señal no puede ser afilada en ambos mundos",
      body: "Aprieta una señal en una ventana temporal estrecha y su transformada se desparrama por muchas frecuencias — y al revés. Llama σ_t a la dispersión en el tiempo y σ_f a la dispersión en la frecuencia. Se cumple σ_t · σ_f ≥ 1/(4π) (o, en convención angular, σ_t · σ_ω ≥ 1/2), y la igualdad la alcanza solo la gaussiana — que, hermosamente, es su propia transformada de Fourier. Multiplica ambos lados por ℏ y tienes la desigualdad posición-momento de Heisenberg: el principio cuántico es la misma desigualdad disfrazada. Tiempo y frecuencia son coordenadas duales, y el compromiso entre ambas es matemática, no ingeniería.",
    },
    {
      pretitle: "Paso seis · Impacto cultural",
      title: "Cada cámara, cada micrófono, cada paquete Wi-Fi",
      body: "Casi toda señal que hoy almacenamos, transmitimos o procesamos pasa por una transformada de Fourier. La cámara de tu teléfono aplica una transformada coseno discreta a cada bloque 8×8 antes de escribir el JPEG. El driver del micrófono hace mil FFT cortas por segundo sobre tu voz. El chip Wi-Fi usa OFDM, parte cada paquete en miles de portadoras y recupera los bits con una FFT inversa por símbolo. Las máquinas de RM recogen literalmente muestras en el espacio de frecuencias — el espacio k — y aplican una transformada inversa para fabricar tu imagen. Un teorema, de tres siglos, sostiene el mundo moderno.",
    },
  ],
  closingTitle: "Abre el Explorador",
  closingBody:
    "Añade armónicos uno a uno, mira aparecer la onda cuadrada, gira la fase y escucha el espectro.",
  ctaLabel: "→ Abrir el Explorador",
  labels: {
    builderCaption: "Constructor armónico · elige diana, sube N",
    spectrumCaption: "Juego de espectro · arrastra las barras, oye la suma",
    pianoCodeCaption: "Do central, síntesis aditiva",
    gibbsCaption: "Sobreimpulso de Gibbs ≈ 8,95 %",
    fftCaption: "Cooley–Tukey, 1965",
    uncertaintyCaption: "Dual de Heisenberg",
    applicationsCaption: "Dónde te la encuentras",
    applicationsLead: "El mismo teorema con distintas ropas en cada rincón de la tecnología.",
    apps: [
      { what: "MP3", how: "máscara psicoacústica" },
      { what: "JPEG", how: "bloques DCT 8×8" },
      { what: "RM", how: "espacio k → imagen" },
      { what: "Wi-Fi / 5G", how: "portadoras OFDM" },
    ],
    duality: { time: "Dominio del tiempo", freq: "Dominio de la frecuencia" },
    fftRow: { naive: "N² · DFT ingenua", fft: "N log N · FFT", speedup: "aceleración" },
  },
};

// French
const fr: RichStory = {
  encounter: {
    pretitle: "Première rencontre",
    title: "Chaque oscillation est une pile de tons purs",
    cards: [
      {
        label: "01",
        title: "L'idée centrale",
        body: "Chaque oscillation imaginable — une note de violon, un tracé cardiaque, les contours d'une photo, la radio dans votre poche — est en secret une pile d'ondes sinusoïdales pures superposées. Changez la recette des sinus et vous changez le son, l'image, le signal. Ce seul fait est la transformée de Fourier.",
      },
      {
        label: "02",
        title: "Un exemple concret",
        body: "Appuyez sur le do central d'un piano. La corde vibre à 261,6 Hz (la fondamentale), et en même temps à 523,3 Hz, 785 Hz, 1046,5 Hz — des multiples entiers appelés harmoniques, chacun avec son propre volume. Ce mélange est ce qui donne au piano son timbre de piano, pas de flûte, même si la note porte le même nom.",
      },
      {
        label: "03",
        title: "Pourquoi cela compte",
        body: "JPEG et MP3 jettent les harmoniques que l'œil et l'oreille ne remarquent pas. Les IRM mesurent directement des échantillons dans l'espace des fréquences et reconstruisent votre corps à partir de là. Wi-Fi et 5G empilent les données sur des milliers de porteuses sinusoïdales en parallèle. Le même fait unique est en dessous de tout.",
      },
    ],
    tryIt: "Ci-dessous : construisez une onde carrée à la main, puis sculptez un son aux curseurs.",
  },
  sections: [
    {
      pretitle: "Étape un · Le principe de décomposition",
      title: "Tout signal raisonnable = une somme de sinus",
      body: "Une fonction périodique f(t), sous des conditions douces (Dirichlet, 1829), s'écrit comme somme sur des fréquences discrètes : f(t) = Σₖ aₖ sin(kωt + φₖ). Les fréquences sont des multiples entiers d'une fondamentale ω ; les amplitudes aₖ et les phases φₖ sont uniquement déterminées par f. L'espace des signaux raisonnables se décompose en axes sinusoïdaux indépendants, et analyser un signal, c'est l'écrire dans cette base.",
    },
    {
      pretitle: "Étape deux · Construire une onde carrée",
      title: "Les coins nets sont le plus dur",
      body: "L'onde carrée est l'épreuve la plus propre du principe : +1 et −1 purs, avec des sauts infiniment nets. Sa série de Fourier est 4/π · Σ sin((2k−1)·2πt)/(2k−1), sommée sur k = 1, 2, 3, … À un harmonique, la réponse est un seul sinus qui roule. À trois, les coins commencent à apparaître. À sept, on lit déjà du carré — sauf un dépassement obstiné de 8,95 % à chaque bord. Ce dépassement ne disparaît jamais : Gibbs a prouvé en 1899 qu'en une discontinuité les sommes partielles dépassent exactement de cette constante, peu importe le nombre d'harmoniques. Le coin est le prix de représenter 'l'instant' dans une base d'ondes lisses.",
    },
    {
      pretitle: "Étape trois · Domaine temporel ↔ domaine fréquentiel",
      title: "Deux fenêtres sur le même signal",
      body: "La transformée de Fourier est un changement de coordonnées. Le même signal possède deux représentations équivalentes : un graphe contre le temps (la forme d'onde sur un oscilloscope) et un graphe contre la fréquence (le spectre sur un analyseur). Un spectrogramme glisse une courte fenêtre le long de l'enregistrement, prend le spectre dans chacune et les empile — transformant une mélodie en piano-roll lumineux de fréquence et de temps. Les curseurs ici vous laissent sculpter l'un et voir l'autre se reconstruire en direct.",
    },
    {
      pretitle: "Étape quatre · Continue, discrète et la FFT",
      title: "L'algorithme qui a tout rendu rapide",
      body: "Sur le papier la transformée est une intégrale, f̂(ξ) = ∫ f(t) e^(−2πi ξ t) dt — définie pour toute fonction intégrable. À l'ordinateur, on travaille avec des échantillons et la transformée discrète : N entrées, N fréquences. Naïvement cela coûte N² multiplications — pour 4 secondes de CD (≈ 200 000 échantillons), environ 40 milliards. En 1965 Cooley et Tukey ont redécouvert (Gauss l'avait déjà en 1805) une astuce récursive qui ramène le coût à N log N — environ 3 millions pour le même enregistrement. Sans ce seul algorithme, pas de MP3 temps réel, pas de JPEG, pas de radio dans le smartphone, pas d'imagerie médicale telle que nous la connaissons.",
    },
    {
      pretitle: "Étape cinq · Le principe d'incertitude",
      title: "Un signal ne peut être net dans les deux mondes",
      body: "Comprimez un signal dans une fenêtre temporelle étroite et sa transformée s'étale forcément sur de nombreuses fréquences — et inversement. Soient σ_t l'écart-type en temps et σ_f l'écart-type en fréquence. On a σ_t · σ_f ≥ 1/(4π) (ou, en convention angulaire, σ_t · σ_ω ≥ 1/2), et l'égalité n'est atteinte que par la gaussienne — qui, élégamment, est sa propre transformée. Multipliez les deux côtés par ℏ et vous tenez l'inégalité position-impulsion de Heisenberg : le principe quantique est la même inégalité dans un autre habit. Temps et fréquence sont des coordonnées duales, et leur compromis est de la mathématique, pas de l'ingénierie.",
    },
    {
      pretitle: "Étape six · Impact culturel",
      title: "Chaque caméra, chaque micro, chaque paquet Wi-Fi",
      body: "Presque tout signal que nous stockons, transmettons ou traitons aujourd'hui passe par une transformée de Fourier. La caméra de votre téléphone applique une transformée en cosinus discrète à chaque bloc 8×8 avant d'écrire le JPEG. Le pilote du micro fait mille FFT courtes par seconde sur votre voix. La puce Wi-Fi utilise OFDM, casse chaque paquet en milliers de porteuses, et récupère les bits par une FFT inverse par symbole. Les IRM collectent littéralement des échantillons dans l'espace des fréquences — l'espace k — et appliquent une transformée inverse pour fabriquer votre image. Un théorème, vieux de trois siècles, soutient le monde moderne.",
    },
  ],
  closingTitle: "Ouvrir l'Explorateur",
  closingBody:
    "Ajoutez les harmoniques une à une, regardez l'onde carrée apparaître, balayez la phase et écoutez le spectre.",
  ctaLabel: "→ Ouvrir l'Explorateur",
  labels: {
    builderCaption: "Constructeur harmonique · choisissez la cible, montez N",
    spectrumCaption: "Jeu de spectre · tirez les barres, entendez la somme",
    pianoCodeCaption: "Do central, synthèse additive",
    gibbsCaption: "Dépassement de Gibbs ≈ 8,95 %",
    fftCaption: "Cooley–Tukey, 1965",
    uncertaintyCaption: "Dual de Heisenberg",
    applicationsCaption: "Où vous la rencontrez",
    applicationsLead: "Le même théorème en habits différents à chaque coin de la technologie.",
    apps: [
      { what: "MP3", how: "masque psychoacoustique" },
      { what: "JPEG", how: "blocs DCT 8×8" },
      { what: "IRM", how: "espace k → image" },
      { what: "Wi-Fi / 5G", how: "porteuses OFDM" },
    ],
    duality: { time: "Domaine temporel", freq: "Domaine fréquentiel" },
    fftRow: { naive: "N² · DFT naïve", fft: "N log N · FFT", speedup: "accélération" },
  },
};

// Italian
const it: RichStory = {
  encounter: {
    pretitle: "Primo incontro",
    title: "Ogni oscillazione è una pila di toni puri",
    cards: [
      {
        label: "01",
        title: "L'idea centrale",
        body: "Ogni oscillazione che puoi immaginare — una nota di violino, un tracciato cardiaco, i bordi di una foto, la radio in tasca — è in segreto una pila di onde sinusoidali pure sommate. Cambia la ricetta dei seni e cambi il suono, l'immagine, il segnale. Questo unico fatto è la trasformata di Fourier.",
      },
      {
        label: "02",
        title: "Un esempio concreto",
        body: "Premi il do centrale di un pianoforte. La corda vibra a 261,6 Hz (la fondamentale) e contemporaneamente a 523,3 Hz, 785 Hz, 1046,5 Hz — multipli interi detti armoniche, ciascuna con il proprio volume. Quel mix di sovratoni è ciò che fa suonare il pianoforte da pianoforte e non da flauto, anche se la nota ha lo stesso nome.",
      },
      {
        label: "03",
        title: "Perché conta",
        body: "JPEG e MP3 buttano via le armoniche che occhi e orecchie non notano. Le risonanze magnetiche misurano direttamente campioni nello spazio delle frequenze e ricostruiscono il corpo da lì. Wi-Fi e 5G impilano dati su migliaia di portanti sinusoidali in parallelo. Lo stesso unico fatto sta sotto tutto.",
      },
    ],
    tryIt: "Sotto: costruisci un'onda quadra a mano, poi scolpisci un suono trascinando i cursori.",
  },
  sections: [
    {
      pretitle: "Passo uno · Il principio di decomposizione",
      title: "Ogni segnale ragionevole = una somma di seni",
      body: "Una funzione periodica f(t), sotto condizioni miti (Dirichlet, 1829), si scrive come somma su frequenze discrete: f(t) = Σₖ aₖ sin(kωt + φₖ). Le frequenze sono multipli interi di una fondamentale ω; ampiezze aₖ e fasi φₖ sono univocamente determinate da f. Lo spazio dei segnali ben fatti si scompone in assi sinusoidali indipendenti, e analizzare un segnale significa scriverlo in quella base.",
    },
    {
      pretitle: "Passo due · Costruire un'onda quadra",
      title: "Gli spigoli affilati sono la parte più dura",
      body: "L'onda quadra è la prova più pulita del principio: +1 e −1 puri, con salti infinitamente affilati. La sua serie di Fourier è 4/π · Σ sin((2k−1)·2πt)/(2k−1), sommata su k = 1, 2, 3, … Con un'armonica la risposta è un singolo seno che rotola. Con tre, gli angoli iniziano a comparire. Con sette si legge già come quadra — tranne un ostinato sovrasbalzo dell'8,95 % a ogni bordo. Questo sovrasbalzo non sparisce mai: Gibbs dimostrò nel 1899 che a una discontinuità le somme parziali superano esattamente di questa costante, qualunque numero di armoniche si sommi. L'angolo è il prezzo per rappresentare l'istante in una base di onde lisce.",
    },
    {
      pretitle: "Passo tre · Dominio del tempo ↔ dominio delle frequenze",
      title: "Due finestre sullo stesso segnale",
      body: "La trasformata di Fourier è un cambio di coordinate. Lo stesso segnale ha due rappresentazioni equivalenti: un grafico contro il tempo (la forma d'onda su un oscilloscopio) e uno contro la frequenza (lo spettro su un analizzatore). Uno spettrogramma fa scorrere una finestra breve lungo la registrazione, prende lo spettro in ciascuna e le impila — trasformando una melodia in un piano-roll luminoso di frequenza-tempo. I cursori qui ti lasciano scolpire una rappresentazione e vedere l'altra ricostruirsi in tempo reale.",
    },
    {
      pretitle: "Passo quattro · Continua, discreta e la FFT",
      title: "L'algoritmo che ha reso tutto veloce",
      body: "Sulla carta la trasformata è un integrale, f̂(ξ) = ∫ f(t) e^(−2πi ξ t) dt — definita per ogni funzione integrabile. Al computer si lavora con campioni e con la trasformata discreta: N ingressi, N frequenze. Ingenuamente costa N² moltiplicazioni — per 4 secondi di CD (≈ 200 000 campioni) circa 40 miliardi. Nel 1965 Cooley e Tukey hanno riscoperto (Gauss l'aveva già nel 1805) un trucco ricorsivo che porta il costo a N log N — circa 3 milioni per la stessa registrazione. Senza quel singolo algoritmo non esisterebbero MP3 in tempo reale, JPEG, radio dello smartphone, imaging medico così com'è.",
    },
    {
      pretitle: "Passo cinque · Il principio di indeterminazione",
      title: "Un segnale non può essere affilato in entrambi i mondi",
      body: "Stringi un segnale in una finestra temporale stretta e la sua trasformata si spalmare necessariamente su molte frequenze — e viceversa. Siano σ_t la dispersione nel tempo e σ_f la dispersione in frequenza. Vale σ_t · σ_f ≥ 1/(4π) (oppure, in convenzione angolare, σ_t · σ_ω ≥ 1/2), e l'uguaglianza è raggiunta solo dalla gaussiana — che, splendidamente, è la propria trasformata di Fourier. Moltiplica entrambi i lati per ℏ e ottieni la disuguaglianza posizione-impulso di Heisenberg: il principio quantistico è la stessa disuguaglianza in un altro abito. Tempo e frequenza sono coordinate duali, e il compromesso fra loro è matematica, non ingegneria.",
    },
    {
      pretitle: "Passo sei · Impatto culturale",
      title: "Ogni fotocamera, ogni microfono, ogni pacchetto Wi-Fi",
      body: "Quasi ogni segnale che oggi memorizziamo, trasmettiamo o elaboriamo passa per una trasformata di Fourier. La fotocamera del telefono applica una trasformata coseno discreta a ogni blocco 8×8 prima di scrivere il JPEG. Il driver del microfono fa mille FFT brevi al secondo sulla tua voce. Il chip Wi-Fi usa OFDM, spezza ogni pacchetto in migliaia di portanti e recupera i bit con una FFT inversa per simbolo. Le macchine MRI raccolgono letteralmente campioni nello spazio delle frequenze — lo spazio k — e applicano una trasformata inversa per fabbricare la tua immagine. Un teorema, vecchio di tre secoli, tiene insieme il mondo moderno.",
    },
  ],
  closingTitle: "Apri l'Explorer",
  closingBody:
    "Aggiungi armoniche una alla volta, guarda emergere l'onda quadra, spazza la fase e ascolta lo spettro.",
  ctaLabel: "→ Apri l'Explorer",
  labels: {
    builderCaption: "Costruttore armonico · scegli il bersaglio, alza N",
    spectrumCaption: "Gioco di spettro · trascina le barre, ascolta la somma",
    pianoCodeCaption: "Do centrale, sintesi additiva",
    gibbsCaption: "Sovrasbalzo di Gibbs ≈ 8,95 %",
    fftCaption: "Cooley–Tukey, 1965",
    uncertaintyCaption: "Duale di Heisenberg",
    applicationsCaption: "Dove la incontri",
    applicationsLead: "Lo stesso teorema con abiti diversi in ogni angolo della tecnologia.",
    apps: [
      { what: "MP3", how: "maschera psicoacustica" },
      { what: "JPEG", how: "blocchi DCT 8×8" },
      { what: "MRI", how: "spazio k → immagine" },
      { what: "Wi-Fi / 5G", how: "portanti OFDM" },
    ],
    duality: { time: "Dominio del tempo", freq: "Dominio delle frequenze" },
    fftRow: { naive: "N² · DFT ingenua", fft: "N log N · FFT", speedup: "accelerazione" },
  },
};

// Portuguese
const pt: RichStory = {
  encounter: {
    pretitle: "Primeiro encontro",
    title: "Toda oscilação é uma pilha de tons puros",
    cards: [
      {
        label: "01",
        title: "A ideia central",
        body: "Toda oscilação que você possa imaginar — uma nota de violino, um traçado cardíaco, as bordas de uma fotografia, o rádio no seu bolso — é secretamente uma pilha de ondas senoidais puras somadas. Mude a receita de senos e você muda o som, a imagem, o sinal. Esse único fato é a transformada de Fourier.",
      },
      {
        label: "02",
        title: "Um exemplo concreto",
        body: "Aperte o dó central de um piano. A corda vibra a 261,6 Hz (a fundamental) e ao mesmo tempo a 523,3 Hz, 785 Hz, 1046,5 Hz — múltiplos inteiros chamados harmônicos, cada um com seu próprio volume. Essa mistura de sobretons é o que faz o piano soar como piano e não como flauta, mesmo que a nota tenha o mesmo nome.",
      },
      {
        label: "03",
        title: "Por que importa",
        body: "JPEG e MP3 jogam fora os harmônicos que olhos e ouvidos não notam. Aparelhos de RM medem diretamente amostras no espaço de frequências e reconstroem o seu corpo a partir delas. Wi-Fi e 5G empilham dados sobre milhares de portadoras senoidais em paralelo. O mesmo único fato está embaixo de tudo.",
      },
    ],
    tryIt: "Abaixo: construa uma onda quadrada à mão, depois esculpa um som arrastando barras.",
  },
  sections: [
    {
      pretitle: "Passo um · O princípio da decomposição",
      title: "Qualquer sinal razoável = uma soma de senos",
      body: "Uma função periódica f(t), sob condições brandas (Dirichlet, 1829), escreve-se como soma sobre frequências discretas: f(t) = Σₖ aₖ sin(kωt + φₖ). As frequências são múltiplos inteiros de uma fundamental ω; amplitudes aₖ e fases φₖ ficam unicamente determinadas por f. O espaço dos sinais bem comportados decompõe-se em eixos senoidais independentes, e analisar um sinal é escrevê-lo nessa base.",
    },
    {
      pretitle: "Passo dois · Construir uma onda quadrada",
      title: "Cantos afiados são a parte mais difícil",
      body: "A onda quadrada é o teste mais limpo do princípio: +1 e −1 puros, com saltos infinitamente afiados. A sua série de Fourier é 4/π · Σ sin((2k−1)·2πt)/(2k−1), somada sobre k = 1, 2, 3, … Com um harmônico a resposta é um único seno rolando. Com três, os cantos começam a aparecer. Com sete já se lê como quadrada — exceto por um teimoso sobressinal de 8,95 % em cada borda. Esse sobressinal nunca desaparece: Gibbs provou em 1899 que numa descontinuidade as somas parciais ultrapassam exatamente essa constante, somando quantos harmônicos se queira. O canto é o preço de representar 'o instante' numa base de ondas suaves.",
    },
    {
      pretitle: "Passo três · Domínio do tempo ↔ domínio da frequência",
      title: "Duas janelas para o mesmo sinal",
      body: "A transformada de Fourier é uma mudança de coordenadas. O mesmo sinal tem duas representações equivalentes: um gráfico contra o tempo (a forma de onda no osciloscópio) e um gráfico contra a frequência (o espectro num analisador). Um espectrograma desliza uma janela curta pela gravação, toma o espectro em cada uma e as empilha — transformando uma melodia num piano-roll brilhante de frequência-tempo. As barras aqui deixam você esculpir uma representação e ver a outra se reconstruir ao vivo.",
    },
    {
      pretitle: "Passo quatro · Contínua, discreta e a FFT",
      title: "O algoritmo que tornou tudo rápido",
      body: "No papel a transformada é uma integral, f̂(ξ) = ∫ f(t) e^(−2πi ξ t) dt — definida para qualquer função integrável. No computador trabalha-se com amostras e a transformada discreta: N entradas, N frequências. Ingênuamente custa N² multiplicações — para 4 segundos de CD (≈ 200 000 amostras) cerca de 40 bilhões. Em 1965 Cooley e Tukey redescobriram (Gauss já tinha em 1805) um truque recursivo que baixa o custo para N log N — cerca de 3 milhões para a mesma gravação. Sem esse único algoritmo não existiria MP3 em tempo real, nem JPEG, nem rádio do celular, nem imagem médica como conhecemos.",
    },
    {
      pretitle: "Passo cinco · O princípio da incerteza",
      title: "Um sinal não pode ser afiado nos dois mundos",
      body: "Aperte um sinal numa janela temporal estreita e sua transformada se espalha necessariamente por muitas frequências — e vice-versa. Sejam σ_t o desvio no tempo e σ_f o desvio em frequência. Vale σ_t · σ_f ≥ 1/(4π) (ou, em convenção angular, σ_t · σ_ω ≥ 1/2), e a igualdade só é alcançada pela gaussiana — que, lindamente, é sua própria transformada. Multiplique ambos os lados por ℏ e obtém a desigualdade posição-momento de Heisenberg: o princípio quântico é a mesma desigualdade em outra roupa. Tempo e frequência são coordenadas duais, e o trade-off entre elas é matemática, não engenharia.",
    },
    {
      pretitle: "Passo seis · Impacto cultural",
      title: "Cada câmera, cada microfone, cada pacote Wi-Fi",
      body: "Quase todo sinal que hoje armazenamos, transmitimos ou processamos passa por uma transformada de Fourier. A câmera do seu telefone aplica uma transformada cosseno discreta a cada bloco 8×8 antes de gravar o JPEG. O driver do microfone faz mil FFTs curtas por segundo sobre sua voz. O chip Wi-Fi usa OFDM, quebra cada pacote em milhares de portadoras e recupera os bits com uma FFT inversa por símbolo. Aparelhos de RM literalmente coletam amostras no espaço de frequências — o espaço k — e aplicam uma transformada inversa para fabricar a sua imagem. Um teorema, com três séculos, sustenta o mundo moderno.",
    },
  ],
  closingTitle: "Abrir o Explorer",
  closingBody:
    "Adicione harmônicos um a um, veja a onda quadrada surgir, varra a fase e ouça o espectro.",
  ctaLabel: "→ Abrir o Explorer",
  labels: {
    builderCaption: "Construtor harmônico · escolha o alvo, aumente N",
    spectrumCaption: "Jogo de espectro · arraste as barras, ouça a soma",
    pianoCodeCaption: "Dó central, síntese aditiva",
    gibbsCaption: "Sobressinal de Gibbs ≈ 8,95 %",
    fftCaption: "Cooley–Tukey, 1965",
    uncertaintyCaption: "Dual de Heisenberg",
    applicationsCaption: "Onde você a encontra",
    applicationsLead: "O mesmo teorema vestido de forma diferente em cada canto da tecnologia.",
    apps: [
      { what: "MP3", how: "máscara psicoacústica" },
      { what: "JPEG", how: "blocos DCT 8×8" },
      { what: "RM", how: "espaço k → imagem" },
      { what: "Wi-Fi / 5G", how: "portadoras OFDM" },
    ],
    duality: { time: "Domínio do tempo", freq: "Domínio da frequência" },
    fftRow: { naive: "N² · DFT ingênua", fft: "N log N · FFT", speedup: "aceleração" },
  },
};

// Swedish
const sv: RichStory = {
  encounter: {
    pretitle: "Första mötet",
    title: "Varje svängning är en stapel rena toner",
    cards: [
      {
        label: "01",
        title: "Den stora idén",
        body: "Varje svängning du kan tänka dig — en violinton, en EKG-kurva, kanterna i ett foto, radion i din ficka — är i hemlighet en stapel rena sinusvågor lagda ovanpå varandra. Ändra receptet av sinus och du ändrar ljudet, bilden, signalen. Det enda faktumet är Fouriertransformen.",
      },
      {
        label: "02",
        title: "Ett konkret exempel",
        body: "Tryck på mellan-C på ett piano. Strängen svänger med 261,6 Hz (grundtonen) och samtidigt med 523,3 Hz, 785 Hz, 1046,5 Hz — heltalsmultipler som kallas övertoner, var och en med egen styrka. Just den blandningen är vad som gör att ett piano låter som ett piano och inte en flöjt, även om noten heter samma.",
      },
      {
        label: "03",
        title: "Varför det spelar roll",
        body: "JPEG och MP3 slänger de övertoner som ögon och öron inte märker. MRI-skanners mäter direkt prover i frekvensrummet och rekonstruerar kroppen från dem. Wi-Fi och 5G packar data på tusentals sinus-bärvågor parallellt. Samma enda faktum ligger under allt.",
      },
    ],
    tryIt: "Nedan: bygg en fyrkantsvåg för hand, forma sedan ett ljud genom att dra i reglagen.",
  },
  sections: [
    {
      pretitle: "Steg ett · Dekompositionsprincipen",
      title: "Varje rimlig signal = en summa av sinus",
      body: "En periodisk funktion f(t), under milda villkor (Dirichlet, 1829), kan skrivas som en summa över diskreta frekvenser: f(t) = Σₖ aₖ sin(kωt + φₖ). Frekvenserna är heltalsmultipler av en grundfrekvens ω; amplituderna aₖ och faserna φₖ bestäms entydigt av f. Rymden av väluppfostrade signaler delar upp sig i oberoende sinusformade axlar, och att analysera en signal är att skriva den i den basen.",
    },
    {
      pretitle: "Steg två · Bygg en fyrkantsvåg",
      title: "Skarpa hörn är det svåraste",
      body: "Fyrkantsvågen är det renaste testet på principen: rena +1 och −1 med oändligt skarpa hopp. Dess Fourierserie är 4/π · Σ sin((2k−1)·2πt)/(2k−1), summerad över k = 1, 2, 3, … Med en överton är svaret en ensam rullande sinus. Med tre börjar hörnen synas. Med sju kan man läsa fyrkant — utom en envis översläng på 8,95 % vid varje kant. Den övre översvängningen försvinner aldrig: Gibbs bevisade 1899 att vid ett hopp överskjuter partialsummorna alltid exakt denna konstant, hur många övertoner man än lägger till. Hörnet är priset för att representera 'ögonblickligt' i en bas av släta vågor.",
    },
    {
      pretitle: "Steg tre · Tidsdomän ↔ frekvensdomän",
      title: "Två fönster mot samma signal",
      body: "Fouriertransformen är ett koordinatbyte. Samma signal har två likvärdiga representationer: en kurva mot tiden (vågformen på ett oscilloskop) och en kurva mot frekvensen (spektrumet på en analysator). Ett spektrogram glider ett kort fönster längs inspelningen, tar spektrumet i varje fönster och staplar dem — och förvandlar en melodi till ett glödande piano-roll av frekvens mot tid. Reglagen här låter dig skulptera den ena och se den andra bygga om sig live.",
    },
    {
      pretitle: "Steg fyra · Kontinuerlig, diskret och FFT",
      title: "Algoritmen som gjorde allt snabbt",
      body: "På papper är transformen en integral, f̂(ξ) = ∫ f(t) e^(−2πi ξ t) dt — definierad för varje integrerbar funktion. På dator jobbar man med prover och den diskreta transformen: N inmatningar, N frekvenser. Naivt kostar det N² multiplikationer — för en 4-sekunders CD-inspelning (≈ 200 000 prover) ungefär 40 miljarder. 1965 återupptäckte Cooley och Tukey (Gauss hade det redan 1805) ett rekursivt trick som drar ner kostnaden till N log N — ungefär 3 miljoner för samma inspelning. Utan den enda algoritmen skulle vi inte ha realtids-MP3, JPEG, smartphone-radio eller medicinsk bildgivning som vi känner den.",
    },
    {
      pretitle: "Steg fem · Osäkerhetsprincipen",
      title: "En signal kan inte vara skarp i båda världar",
      body: "Pressa in en signal i ett smalt tidsfönster och dess Fouriertransform breder nödvändigtvis ut sig över många frekvenser — och vice versa. Låt σ_t vara spridningen i tid och σ_f spridningen i frekvens. Det gäller σ_t · σ_f ≥ 1/(4π) (eller, i vinkelkonvention, σ_t · σ_ω ≥ 1/2), och likhet nås bara av gaussfunktionen — som, vackert nog, är sin egen Fouriertransform. Multiplicera båda leden med ℏ och du har Heisenbergs läges-rörelsemängdsolikhet: kvantprincipen är samma olikhet i annan kostym. Tid och frekvens är duala koordinater, och kompromissen mellan dem är matematik, inte teknik.",
    },
    {
      pretitle: "Steg sex · Kulturell betydelse",
      title: "Varje kamera, varje mikrofon, varje Wi-Fi-paket",
      body: "Nästan varje signal vi lagrar, sänder eller bearbetar idag passerar en Fouriertransform på vägen. Kameran i din telefon kör en diskret kosinustransform på varje 8×8-block innan JPEG:n skrivs. Mikrofondrivrutinen gör tusen korta FFT:er per sekund på din röst. Wi-Fi-chippet använder OFDM, bryter varje paket i tusentals bärvågor och får tillbaka bitarna med en invers FFT per symbol. MRI-maskiner samlar bokstavligen prover i frekvensrymden — k-rummet — och tillämpar en invers Fouriertransform för att skapa bilden av dig. Ett teorem, tre sekler gammalt, håller den moderna världen samman.",
    },
  ],
  closingTitle: "Öppna Utforskaren",
  closingBody:
    "Lägg till övertoner en i taget, se fyrkantsvågen växa fram, svep fasen och lyssna på spektrumet.",
  ctaLabel: "→ Öppna Utforskaren",
  labels: {
    builderCaption: "Övertonsbyggare · välj mål, höj N",
    spectrumCaption: "Spektrumlek · dra staplarna, hör summan",
    pianoCodeCaption: "Mellan-C, additiv syntes",
    gibbsCaption: "Gibbs översläng ≈ 8,95 %",
    fftCaption: "Cooley–Tukey, 1965",
    uncertaintyCaption: "Heisenberg-dualen",
    applicationsCaption: "Där du möter den",
    applicationsLead: "Samma teorem i olika kläder i varje hörn av modern teknik.",
    apps: [
      { what: "MP3", how: "psykoakustisk mask" },
      { what: "JPEG", how: "8×8 DCT-block" },
      { what: "MRI", how: "k-rum → bild" },
      { what: "Wi-Fi / 5G", how: "OFDM-bärvågor" },
    ],
    duality: { time: "Tidsdomän", freq: "Frekvensdomän" },
    fftRow: { naive: "N² · naiv DFT", fft: "N log N · FFT", speedup: "snabbare" },
  },
};

// Norwegian
const no: RichStory = {
  encounter: {
    pretitle: "Første møte",
    title: "Hver svingning er en stabel av rene toner",
    cards: [
      {
        label: "01",
        title: "Den store ideen",
        body: "Hver svingning du kan tenke deg — en fiolinton, en EKG-kurve, kantene i et fotografi, radioen i lommen — er hemmelig en stabel av rene sinusbølger lagt oppå hverandre. Endre oppskriften på sinusene, og du endrer lyden, bildet, signalet. Det ene faktumet er Fouriertransformasjonen.",
      },
      {
        label: "02",
        title: "Et konkret eksempel",
        body: "Trykk på midt-C på et piano. Strengen svinger med 261,6 Hz (grunntonen) og samtidig med 523,3 Hz, 785 Hz, 1046,5 Hz — heltallsmultipler kalt overtoner, hver med sin egen styrke. Akkurat den blandingen er det som gjør at et piano høres ut som et piano og ikke en fløyte, selv om noten heter det samme.",
      },
      {
        label: "03",
        title: "Hvorfor det betyr noe",
        body: "JPEG og MP3 kaster overtonene øynene og ørene ikke merker. MR-skannere måler direkte prøver i frekvensrommet og rekonstruerer kroppen din ut fra dem. Wi-Fi og 5G stabler data på tusenvis av sinus-bærebølger parallelt. Samme ene faktum ligger under alt.",
      },
    ],
    tryIt:
      "Nedenfor: bygg en firkantbølge for hånd, og form deretter en lyd ved å dra glidebrytere.",
  },
  sections: [
    {
      pretitle: "Trinn én · Dekomposisjonsprinsippet",
      title: "Ethvert rimelig signal = en sum av sinuser",
      body: "En periodisk funksjon f(t) kan, under milde betingelser (Dirichlet, 1829), skrives som en sum over diskrete frekvenser: f(t) = Σₖ aₖ sin(kωt + φₖ). Frekvensene er heltallsmultipler av en grunnfrekvens ω; amplitudene aₖ og fasene φₖ er entydig bestemt av f. Rommet av veloppdragne signaler deler seg i uavhengige sinusformede akser, og å analysere et signal er å skrive det i den basen.",
    },
    {
      pretitle: "Trinn to · Bygg en firkantbølge",
      title: "Skarpe hjørner er det vanskeligste",
      body: "Firkantbølgen er den reneste testen på prinsippet: ren +1 og −1 med uendelig skarpe hopp. Dens Fourierrekke er 4/π · Σ sin((2k−1)·2πt)/(2k−1), summert over k = 1, 2, 3, … Med én overtone er svaret en enslig rullende sinus. Med tre begynner hjørnene å dukke opp. Med sju kan du lese det som firkant — bortsett fra et seigt oversving på 8,95 % ved hver kant. Det oversvinget forsvinner aldri: Gibbs beviste i 1899 at ved et hopp overskyter delsummene alltid akkurat denne konstanten, uansett hvor mange overtoner du legger til. Hjørnet er prisen for å representere 'øyeblikket' i en base av glatte bølger.",
    },
    {
      pretitle: "Trinn tre · Tidsdomene ↔ frekvensdomene",
      title: "To vinduer mot samme signal",
      body: "Fouriertransformasjonen er et koordinatskifte. Samme signal har to likeverdige representasjoner: en graf mot tid (bølgeformen på et oscilloskop) og en graf mot frekvens (spekteret på en analysator). Et spektrogram skyver et kort vindu langs opptaket, tar spekteret i hvert vindu og stabler dem — gjør en melodi om til en lysende piano-roll av frekvens mot tid. Glidebryterne her lar deg skulpturere den ene og se den andre bygges opp live.",
    },
    {
      pretitle: "Trinn fire · Kontinuerlig, diskret og FFT",
      title: "Algoritmen som gjorde alt raskt",
      body: "På papiret er transformasjonen et integral, f̂(ξ) = ∫ f(t) e^(−2πi ξ t) dt — definert for enhver integrerbar funksjon. På datamaskin jobber man med prøver og den diskrete transformasjonen: N inndata, N frekvenser. Naivt koster det N² multiplikasjoner — for et 4-sekunders CD-opptak (≈ 200 000 prøver) omtrent 40 milliarder. I 1965 gjenoppdaget Cooley og Tukey (Gauss hadde det allerede i 1805) et rekursivt triks som senker kostnaden til N log N — omtrent 3 millioner for samme opptak. Uten den ene algoritmen ville det ikke vært sanntids-MP3, JPEG, smarttelefon-radio eller medisinsk bildebehandling slik vi kjenner den.",
    },
    {
      pretitle: "Trinn fem · Uskarphetsrelasjonen",
      title: "Et signal kan ikke være skarpt i begge verdener",
      body: "Press et signal inn i et smalt tidsvindu, og Fouriertransformasjonen sprer seg nødvendigvis over mange frekvenser — og omvendt. La σ_t være spredningen i tid og σ_f spredningen i frekvens. Det gjelder σ_t · σ_f ≥ 1/(4π) (eller, i vinkelkonvensjon, σ_t · σ_ω ≥ 1/2), og likhet oppnås kun av gaussfunksjonen — som, vakkert nok, er sin egen Fouriertransformasjon. Multipliser begge sider med ℏ, og du har Heisenbergs posisjons-bevegelsesmengdeulikhet: kvanteprinsippet er samme ulikhet i annen drakt. Tid og frekvens er duale koordinater, og avveiningen mellom dem er matematikk, ikke ingeniørkunst.",
    },
    {
      pretitle: "Trinn seks · Kulturell innflytelse",
      title: "Hvert kamera, hver mikrofon, hver Wi-Fi-pakke",
      body: "Nesten hvert signal vi lagrer, sender eller behandler i dag passerer en Fouriertransformasjon på veien. Kameraet i telefonen din kjører en diskret cosinustransform på hvert 8×8-blokk før JPEG-en skrives. Mikrofondriveren gjør tusen korte FFT-er i sekundet på stemmen din. Wi-Fi-brikken bruker OFDM, deler hver pakke i tusenvis av bærebølger og henter bitene tilbake med én invers FFT per symbol. MR-maskiner samler bokstavelig talt prøver i frekvensrommet — k-rommet — og bruker en invers Fouriertransformasjon for å lage bildet av deg. Ett teorem, tre århundrer gammelt, holder den moderne verden sammen.",
    },
  ],
  closingTitle: "Åpne Utforskeren",
  closingBody:
    "Legg til overtoner én etter én, se firkantbølgen vokse fram, sveip fasen og hør spekteret.",
  ctaLabel: "→ Åpne Utforskeren",
  labels: {
    builderCaption: "Overtone-bygger · velg mål, øk N",
    spectrumCaption: "Spekterlek · dra stolpene, hør summen",
    pianoCodeCaption: "Midt-C, additiv syntese",
    gibbsCaption: "Gibbs-oversving ≈ 8,95 %",
    fftCaption: "Cooley–Tukey, 1965",
    uncertaintyCaption: "Heisenberg-dualen",
    applicationsCaption: "Der du møter den",
    applicationsLead: "Samme teorem i ulike klær i hvert hjørne av moderne teknologi.",
    apps: [
      { what: "MP3", how: "psykoakustisk maske" },
      { what: "JPEG", how: "8×8 DCT-blokker" },
      { what: "MR", how: "k-rom → bilde" },
      { what: "Wi-Fi / 5G", how: "OFDM-bærebølger" },
    ],
    duality: { time: "Tidsdomene", freq: "Frekvensdomene" },
    fftRow: { naive: "N² · naiv DFT", fft: "N log N · FFT", speedup: "akselerasjon" },
  },
};

const RICH_STORY: Record<Locale, RichStory> = {
  en,
  de,
  es,
  fr,
  it,
  pt,
  sv,
  no,
};

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

export default function FourierStory() {
  const { locale, s } = useI18n();
  const page = s.pages.fourier;
  const story = RICH_STORY[locale];
  const [sec0, sec1, sec2, sec3, sec4, sec5] = story.sections;

  return (
    <StoryPageShell
      page={page}
      ctaHref="/fourier/explorer"
      accent={ACCENT}
      borderAccent="border-signal-teal/70"
      bgAccent="bg-signal-teal/10"
      hoverAccent="hover:bg-signal-teal/20"
      gradient="from-signal-teal/10"
      formulaBadge="f̂(ξ) = ∫ f(t) e^(−2πi ξ t) dt"
      formulaLatex={"\\hat{f}(\\xi) = \\int_{-\\infty}^{\\infty} f(t)\\, e^{-2\\pi i \\xi t}\\, dt"}
      finalLabel={s.storyLabels.stepIntoIt}
    >
      {/* First encounter — for laypeople */}
      <section className="mx-auto mb-32 max-w-5xl space-y-10">
        <Reveal>
          <div className="space-y-3 text-center">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {story.encounter.pretitle}
            </div>
            <h2 className="math-italic text-4xl leading-tight md:text-5xl">
              {story.encounter.title}
            </h2>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-3">
            <EncounterCard
              label={story.encounter.cards[0].label}
              title={story.encounter.cards[0].title}
            >
              {story.encounter.cards[0].body}
            </EncounterCard>
            <EncounterCard
              label={story.encounter.cards[1].label}
              title={story.encounter.cards[1].title}
            >
              <p>{story.encounter.cards[1].body}</p>
              <div className="hairline mt-4 space-y-1 rounded-md border bg-ink-950/60 p-3 font-mono text-[11px] text-ink-100">
                <div className={`font-mono text-[9px] uppercase tracking-widest2 ${ACCENT} pb-1`}>
                  {story.labels.pianoCodeCaption}
                </div>
                <div>
                  261.6 Hz <span className="text-ink-400">·</span>{" "}
                  <span className="text-signal-teal">1.00</span>
                </div>
                <div>
                  523.3 Hz <span className="text-ink-400">·</span>{" "}
                  <span className="text-signal-teal">0.45</span>
                </div>
                <div>
                  785.0 Hz <span className="text-ink-400">·</span>{" "}
                  <span className="text-signal-teal">0.28</span>
                </div>
                <div>
                  1046.5 Hz <span className="text-ink-400">·</span>{" "}
                  <span className="text-signal-teal">0.18</span>
                </div>
                <div className="pt-1 text-ink-400">Σ aₖ sin(2π · k · 261.6 · t)</div>
              </div>
            </EncounterCard>
            <EncounterCard
              label={story.encounter.cards[2].label}
              title={story.encounter.cards[2].title}
            >
              {story.encounter.cards[2].body}
            </EncounterCard>
          </div>
        </Reveal>
        <Reveal delay={240}>
          <div className="text-center italic text-ink-300">{story.encounter.tryIt}</div>
        </Reveal>
      </section>

      {/* Section 1 — Decomposition principle */}
      <section className="mx-auto mb-32 max-w-4xl space-y-8">
        <StoryCard {...sec0} accent={ACCENT} />
        <Reveal delay={120}>
          <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-6 text-center">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              Fourier series
            </div>
            <div className="math-italic text-2xl leading-tight text-ink-100 md:text-3xl">
              f(t) = Σₖ aₖ sin(kωt + φₖ)
            </div>
            <p className="mx-auto max-w-xl text-sm leading-relaxed text-ink-300">
              Each k is one independent axis. The amplitudes aₖ are the coordinates of the signal in
              that basis; the phases φₖ shift each axis along itself.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Section 2 — Square wave + Harmonic Builder (INTERACTIVE) */}
      <section className="mx-auto mb-32 max-w-4xl space-y-8">
        <StoryCard {...sec1} accent={ACCENT} />
        <Reveal delay={120}>
          <FourierHarmonicBuilder caption={story.labels.builderCaption} />
        </Reveal>
        <Reveal delay={200}>
          <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-6 text-center">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {story.labels.gibbsCaption}
            </div>
            <div className="math-italic text-2xl leading-tight text-ink-100">
              max overshoot / jump = (2/π) ∫₀^π sinc(x) dx − 1 ≈ 0.08949
            </div>
            <p className="mx-auto max-w-xl text-xs leading-relaxed text-ink-300">
              The constant is exact and independent of N. Sharpness in time costs spread in
              frequency — the next section makes that trade-off into a law.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Section 3 — Time ↔ Frequency duality + Spectrum Play (INTERACTIVE) */}
      <section className="mx-auto mb-32 max-w-4xl space-y-8">
        <StoryCard {...sec2} accent={ACCENT} />
        <Reveal delay={120}>
          <FourierSpectrumPlay caption={story.labels.spectrumCaption} />
        </Reveal>
        <Reveal delay={200}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="hairline space-y-2 rounded-2xl border bg-ink-950/40 p-5">
              <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
                {story.labels.duality.time}
              </div>
              <pre className="font-mono text-sm text-ink-100">
                {`f(t) =  amplitude
        vs. time`}
              </pre>
              <p className="text-xs text-ink-300">What an oscilloscope or a microphone records.</p>
            </div>
            <div className="hairline space-y-2 rounded-2xl border bg-ink-950/40 p-5">
              <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
                {story.labels.duality.freq}
              </div>
              <pre className="font-mono text-sm text-ink-100">
                {`f̂(ξ) = amplitude
        vs. frequency`}
              </pre>
              <p className="text-xs text-ink-300">
                What a spectrum analyser or your inner ear sees.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Section 4 — Continuous vs discrete + FFT */}
      <section className="mx-auto mb-32 max-w-4xl space-y-8">
        <StoryCard {...sec3} accent={ACCENT} />
        <Reveal delay={120}>
          <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-6">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {story.labels.fftCaption}
            </div>
            <table className="w-full font-mono text-sm">
              <thead className="hairline border-b text-ink-300">
                <tr>
                  <th className="px-2 py-2 text-left text-[10px] uppercase tracking-widest">N</th>
                  <th className="px-2 py-2 text-left text-[10px] uppercase tracking-widest">
                    {story.labels.fftRow.naive}
                  </th>
                  <th className="px-2 py-2 text-left text-[10px] uppercase tracking-widest">
                    {story.labels.fftRow.fft}
                  </th>
                  <th className="px-2 py-2 text-right text-[10px] uppercase tracking-widest">
                    {story.labels.fftRow.speedup}
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["1 024", "1.05 × 10⁶", "1.02 × 10⁴", "≈ 100×"],
                  ["65 536", "4.29 × 10⁹", "1.05 × 10⁶", "≈ 4 000×"],
                  ["1 048 576", "1.10 × 10¹²", "2.10 × 10⁷", "≈ 50 000×"],
                ].map(([n, naive, fft, sp]) => (
                  <tr key={n} className="border-b border-ink-700/30 last:border-0">
                    <td className="math-italic px-2 py-2 text-base text-ink-100">{n}</td>
                    <td className="px-2 py-2 text-ink-200">{naive}</td>
                    <td className="px-2 py-2 text-signal-teal">{fft}</td>
                    <td className="px-2 py-2 text-right text-ink-300">{sp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="pt-2 text-xs leading-relaxed text-ink-400">
              The FFT is not faster mathematics — it is the same DFT, computed by reusing every
              partial product instead of redoing it. The exponent changes from 2 to 1, and the world
              of real-time signal processing opens up.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Section 5 — Uncertainty principle */}
      <section className="mx-auto mb-32 max-w-4xl space-y-8">
        <StoryCard {...sec4} accent={ACCENT} />
        <Reveal delay={120}>
          <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-6 text-center">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {story.labels.uncertaintyCaption}
            </div>
            <div className="math-italic text-3xl leading-tight text-ink-100 md:text-4xl">
              σ_t · σ_ω ≥ ½
            </div>
            <div className="text-base italic text-ink-300">
              Multiply by ℏ. Read the same inequality.
            </div>
            <div className="math-italic text-2xl leading-tight text-signal-teal md:text-3xl">
              σ_x · σ_p ≥ ℏ / 2
            </div>
            <p className="mx-auto max-w-xl pt-2 text-xs leading-relaxed text-ink-300">
              The Gaussian minimises both. Position and momentum are Fourier duals, and the quantum
              bound is the same theorem on a different axis.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Section 6 — Cultural impact */}
      <section className="mx-auto mb-32 max-w-4xl space-y-8">
        <StoryCard {...sec5} accent={ACCENT} />
        <Reveal delay={120}>
          <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-6">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {story.labels.applicationsCaption}
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-ink-300">
              {story.labels.applicationsLead}
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2 md:grid-cols-4">
              {story.labels.apps.map((app) => (
                <div
                  key={app.what}
                  className="hairline rounded-md border bg-ink-950/60 p-3 text-center"
                >
                  <div className="math-italic text-xl text-ink-100">{app.what}</div>
                  <div className="mt-1 font-mono text-[10px] text-ink-400">{app.how}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* Closing CTA — glass card, matches /apollonian closing pattern */}
      <Reveal>
        <section className="glass hairline mx-auto mt-16 max-w-4xl space-y-6 rounded-3xl border p-10 text-center md:p-14">
          <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
            {s.storyLabels.stepIntoIt}
          </div>
          <h2 className="math-italic text-4xl leading-tight md:text-6xl">{story.closingTitle}</h2>
          <p className="mx-auto max-w-2xl leading-relaxed text-ink-200">{story.closingBody}</p>
          <div className="pt-2">
            <Link
              href="/fourier/explorer"
              className="inline-block rounded-full border border-signal-teal/70 bg-signal-teal/10 px-8 py-4 font-mono text-sm uppercase tracking-widest2 text-signal-teal transition-colors hover:bg-signal-teal/20"
            >
              {story.ctaLabel}
            </Link>
          </div>
        </section>
      </Reveal>
    </StoryPageShell>
  );
}
