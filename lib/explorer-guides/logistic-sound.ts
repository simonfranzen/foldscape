import type { ExplorerGuide } from "./types";

// Numbers quoted here (pitch ranges, 10 iterates per second, the 0.08 s
// decay, the snap values, A major from A2) match app/logistic/sound/page.tsx;
// update both together.
const SONIFY_EXCERPT = `let x = rNow * xRef.current * (1 - xRef.current);
if (!isFinite(x) || x < 0 || x > 1) x = Math.random() * 0.5 + 0.25;
xRef.current = x;

// Map x in [0, 1] onto the pitch range in log-frequency
const logFmin = Math.log(pr.min);
const logFmax = Math.log(pr.max);
let freq = Math.exp(logFmin + (logFmax - logFmin) * x);
if (quantizeRef.current) freq = snapToScale(freq);
refs.osc.frequency.setTargetAtTime(freq, t, 0.01);

// Soft pluck: quick rise then decay on the voice gain
g.linearRampToValueAtTime(1.0, t + 0.005);
g.setTargetAtTime(0.0, t + 0.01, 0.08);`;

// Display formulas are shared by every locale, so they live here once.
const MAP_FORMULA = "x_{n+1} = r\\,x_n\\,(1 - x_n)";

export const LOGISTIC_SOUND_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Hear the logistic map: every iterate becomes a tone, so period doubling sounds like one note splitting into 2, 4 and 8 before chaos dissolves into noise.",
    heading: "How the sound lab works",
    intro:
      "This room turns the logistic map into music. A single value x is iterated over and over with the rule below, and every new value becomes a short plucked tone: low x gives a low note, high x a high one. The dots scrolling across the upper panel are the last 200 values, newest on the right, and the strip at the bottom shows where the current growth rate r sits relative to the famous landmarks.",
    sections: [
      {
        heading: "Why the map has a melody",
        paragraphs: [
          "The logistic map is the simplest model of a population that grows when it is small and shrinks when it is crowded. Its long-term behaviour depends only on r. For r below 3 the orbit settles on the fixed point x* = 1 − 1/r, and you hear one note repeated. At r = 3 that fixed point becomes unstable and the orbit alternates between two values: a two-note trill. At r = 1 + √6 ≈ 3.4495 the trill splits into a four-note figure, a little later into eight, and the doublings crowd together until they accumulate at r∞ ≈ 3.5699, the onset of chaos.",
          "Beyond that point most values of r produce an orbit that never repeats. The pitches scatter, and what was a tune becomes something closer to rain on a roof. The largest window of order inside the chaos begins at r = 1 + √8 ≈ 3.8284 with a stable cycle of three values, which you hear as a clear three-note riff.",
        ],
        formula: MAP_FORMULA,
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "Start audio creates the sound engine; browsers only allow audio after a click, so the lab is silent until you press it. Master gain runs from 0 to 0.4 (default 0.2). Growth rate r spans 2.5 to 4 in steps of 0.0005 and starts at 3.7, inside the chaos. The five snap buttons jump to 3.0, 3.5 (a clean four-note cycle), 3.56995, 3.83 (the three-note cycle) and 3.9.",
          "Auto-sweep moves r steadily from its current value up to 4 and then wraps back to 2.5; Sweep duration (30 to 240 seconds, default 120) sets how long one full pass from 2.5 to 4 takes. Iteration rate sets the tempo, from 2 to 40 tones per second, default 10. Pitch range chooses how x is spread across frequencies: 220 to 440 Hz (one octave), 220 to 880 Hz (two octaves, the default), 110 to 880 Hz (three) or 55 to 1760 Hz (five). Quantize snaps each tone to the nearest note of A major rooted at A2 (110 Hz). Sound source picks the oscillator waveform: sine (the default), triangle, sawtooth or square.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "Everything runs in your browser with the Web Audio API and two 2D canvases. A single oscillator feeds a voice gain node, which feeds a master gain node and then the speakers. A requestAnimationFrame loop keeps time: whenever enough milliseconds have passed for the chosen iteration rate, it computes the next iterate, appends it to a 200-value history and retunes the oscillator. At most 50 iterates are processed per frame, so a tab that was throttled in the background does not fire hundreds of catch-up notes at once.",
          "The mapping from x to pitch is logarithmic, because that is how we hear: equal steps in x become equal musical intervals, not equal steps in hertz. Each tone is shaped like a soft pluck. The voice gain ramps to full in 5 milliseconds and then decays exponentially with a time constant of 0.08 seconds, while the frequency glides to its new value with a time constant of 0.01 seconds. If rounding ever pushes x outside the interval from 0 to 1, it is reset to a random value between 0.25 and 0.75 so the sound never gets stuck.",
          "Quantize compares each tone in log-frequency with a precomputed table of A major notes above 110 Hz and picks the closest. If your system asks for reduced motion, the chart stops scrolling. It shows a still frame instead: the 200 values the orbit settles on for the current r, repainted when r changes (at most once a second during auto-sweep). The sound is unaffected and only plays after you start it.",
        ],
        code: SONIFY_EXCERPT,
      },
      {
        heading: "Hearing what you cannot see",
        paragraphs: [
          "Ears are very good at detecting repetition. A four-note pattern is obvious in sound long before it is obvious in a cloud of dots, and the moment a cycle breaks into chaos is easy to hear as the loss of a beat. Quantization changes the character but not the structure: periodic orbits become recognisable melodies, while chaotic stretches turn into random walks through the A major scale.",
        ],
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "Listen to the whole cascade",
        text: "Start audio, press the snap button labelled 3 and switch on auto-sweep with the default 120 seconds. The single note splits into a trill, then a four-note pattern, then blurs into noise before 3.57. Listen for the sudden three-note riff near 3.83.",
      },
      {
        title: "Hear intermittency",
        text: "Press the 3.83 snap for the clean three-note riff, then move the slider down to 3.8280, a hair below the window's edge at 1 + √8 ≈ 3.8284. Now the riff plays for a while, breaks into a burst of chaos and returns.",
      },
      {
        title: "Find the true thresholds",
        text: "Press the 3.5 snap for a clean four-note figure, then move the slider to 3.449, just below the exact doubling point 1 + √6 ≈ 3.4495: the orbit slowly settles on two tones instead of four. At 3.56 you hear eight.",
      },
      {
        title: "Make chaos musical",
        text: "Set r to 3.9, the pitch range to 55 to 1760 Hz, the source to triangle and switch on quantize. With the iteration rate at 6 you get a never-repeating melody in A major. Drop r to 3.2 and it locks into two notes.",
      },
    ],
  },
  de: {
    metaDescription:
      "Die logistische Abbildung hören: Jede Iteration wird zum Ton, und Periodenverdopplung klingt wie ein Ton, der sich in 2, 4 und 8 teilt, bevor Chaos ihn auflöst.",
    heading: "So funktioniert das Klanglabor",
    intro:
      "Dieser Raum macht aus der logistischen Abbildung Musik. Ein einzelner Wert x wird immer wieder nach der Regel unten iteriert, und jeder neue Wert erklingt als kurzer gezupfter Ton: Ein kleines x ergibt einen tiefen Ton, ein großes x einen hohen. Die Punkte, die oben durchs Bild wandern, sind die letzten 200 Werte, der neueste rechts. Der Streifen unten zeigt, wo die aktuelle Wachstumsrate r im Verhältnis zu den bekannten Wegmarken liegt.",
    sections: [
      {
        heading: "Warum die Abbildung eine Melodie hat",
        paragraphs: [
          "Die logistische Abbildung ist das einfachste Modell einer Population, die wächst, solange sie klein ist, und schrumpft, wenn es eng wird. Ihr Langzeitverhalten hängt nur von r ab. Für r unter 3 kommt die Bahn auf dem Fixpunkt x* = 1 − 1/r zur Ruhe, und du hörst einen Ton, immer wieder. Bei r = 3 wird dieser Fixpunkt instabil, und die Bahn wechselt zwischen zwei Werten: ein Triller aus zwei Tönen. Bei r = 1 + √6 ≈ 3,4495 teilt sich der Triller in eine Figur aus vier Tönen, etwas später in acht, und die Verdopplungen drängen sich zusammen, bis sie sich bei r∞ ≈ 3,5699 häufen, dem Beginn des Chaos.",
          "Dahinter erzeugen die meisten r-Werte eine Bahn, die sich nie wiederholt. Die Tonhöhen streuen, und aus der Melodie wird eher so etwas wie Regen auf dem Dach. Das größte Fenster der Ordnung mitten im Chaos beginnt bei r = 1 + √8 ≈ 3,8284 mit einem stabilen Zyklus aus drei Werten, den du als klares Riff aus drei Tönen hörst.",
        ],
        formula: MAP_FORMULA,
      },
      {
        heading: "Was die Regler bewirken",
        paragraphs: [
          "«Ton starten» erzeugt die Klangmaschine. Browser erlauben Ton erst nach einem Klick, deshalb bleibt das Labor still, bis du drückst. Die Gesamtlautstärke reicht von 0 bis 0,4 (Standard 0,2). Die Wachstumsrate r läuft von 2,5 bis 4 in Schritten von 0,0005 und startet bei 3,7, mitten im Chaos. Die fünf Sprungknöpfe führen zu 3,0, 3,5 (ein sauberer Zyklus aus vier Tönen), 3,56995, 3,83 (der Zyklus aus drei Tönen) und 3,9.",
          "«r automatisch durchfahren» schiebt r gleichmäßig vom aktuellen Wert bis 4 und springt dann zurück auf 2,5. «Dauer eines Durchlaufs» (30 bis 240 Sekunden, Standard 120) legt fest, wie lange ein ganzer Durchlauf von 2,5 bis 4 dauert. Die Iterationsrate bestimmt das Tempo, von 2 bis 40 Tönen pro Sekunde, Standard 10. Der Tonumfang wählt, wie x auf die Frequenzen verteilt wird: 220 bis 440 Hz (eine Oktave), 220 bis 880 Hz (zwei Oktaven, voreingestellt), 110 bis 880 Hz (drei) oder 55 bis 1760 Hz (fünf). «Auf Dur-Tonleiter einrasten» legt jeden Ton auf den nächsten Ton von A-Dur, mit Grundton A2 (110 Hz). Die Klangquelle wählt die Wellenform des Oszillators: Sinus (Standard), Dreieck, Sägezahn oder Rechteck.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Alles läuft in deinem Browser mit der Web Audio API und zwei 2D-Canvas-Flächen. Ein einzelner Oszillator speist einen Gain-Knoten für die Stimme, der in einen Master-Gain und dann in die Lautsprecher führt. Eine requestAnimationFrame-Schleife hält den Takt: Sobald für die gewählte Rate genug Millisekunden vergangen sind, berechnet sie die nächste Iteration, hängt sie an einen Verlauf mit 200 Werten und stimmt den Oszillator um. Pro Frame werden höchstens 50 Iterationen verarbeitet, damit ein im Hintergrund ausgebremster Tab nicht Hunderte nachgeholter Töne auf einmal abfeuert.",
          "Die Zuordnung von x zur Tonhöhe ist logarithmisch, weil wir so hören: Gleiche Schritte in x werden zu gleichen musikalischen Intervallen, nicht zu gleichen Schritten in Hertz. Jeder Ton ist wie ein weiches Zupfen geformt. Der Gain der Stimme steigt in 5 Millisekunden auf voll und klingt dann exponentiell mit einer Zeitkonstante von 0,08 Sekunden ab, während die Frequenz mit einer Zeitkonstante von 0,01 Sekunden zum neuen Wert gleitet. Schiebt eine Rundung x je aus dem Intervall von 0 bis 1, wird es auf einen zufälligen Wert zwischen 0,25 und 0,75 gesetzt, damit der Klang nie hängen bleibt.",
          "Das Einrasten vergleicht jeden Ton in logarithmischer Frequenz mit einer vorberechneten Tabelle der A-Dur-Töne ab 110 Hz und nimmt den nächstgelegenen. Wünscht dein System reduzierte Bewegung, scrollt das Diagramm nicht mehr. Es zeigt stattdessen ein Standbild: die 200 Werte, auf die sich die Bahn beim aktuellen r einpendelt, neu gezeichnet, wenn sich r ändert (beim automatischen Durchfahren höchstens einmal pro Sekunde). Der Klang bleibt unverändert und spielt erst, wenn du ihn startest.",
        ],
        code: SONIFY_EXCERPT,
      },
      {
        heading: "Hören, was man nicht sieht",
        paragraphs: [
          "Ohren erkennen Wiederholungen ausgesprochen gut. Ein Muster aus vier Tönen ist im Klang sofort da, lange bevor es in einer Punktwolke auffällt, und der Moment, in dem ein Zyklus ins Chaos kippt, ist als verlorener Rhythmus leicht zu hören. Das Einrasten ändert den Charakter, nicht die Struktur: Periodische Bahnen werden zu erkennbaren Melodien, chaotische Abschnitte zu Zufallswegen durch die A-Dur-Tonleiter.",
        ],
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Die ganze Kaskade hören",
        text: "Starte den Ton, drück den Sprungknopf 3 und schalte «r automatisch durchfahren» mit den voreingestellten 120 Sekunden ein. Der einzelne Ton teilt sich in einen Triller, dann in eine Figur aus vier Tönen und verschwimmt vor 3,57 zu Rauschen. Achte auf das plötzliche Riff aus drei Tönen bei etwa 3,83.",
      },
      {
        title: "Intermittenz hören",
        text: "Drück den Sprungknopf 3.83 für das saubere Riff aus drei Tönen und schieb den Regler dann hinunter auf 3,8280, haarscharf unter den Rand des Fensters bei 1 + √8 ≈ 3,8284. Jetzt spielt das Riff eine Weile, bricht in einen chaotischen Schauer aus und kehrt zurück.",
      },
      {
        title: "Die echten Schwellen finden",
        text: "Drück den Sprungknopf 3.5 für eine saubere Figur aus vier Tönen und zieh den Regler dann auf 3,449, knapp unter den exakten Verdopplungspunkt 1 + √6 ≈ 3,4495: Die Bahn pendelt sich langsam auf zwei statt vier Töne ein. Bei 3,56 hörst du acht.",
      },
      {
        title: "Chaos musikalisch machen",
        text: "Stell r auf 3,9, den Tonumfang auf 55 bis 1760 Hz, die Klangquelle auf Dreieck und schalte «Auf Dur-Tonleiter einrasten» ein. Mit einer Iterationsrate von 6 entsteht eine Melodie in A-Dur, die sich nie wiederholt. Senk r auf 3,2, und sie rastet auf zwei Töne ein.",
      },
    ],
  },
  es: {
    metaDescription:
      "Escucha el mapa logístico: cada iteración es un tono, y la duplicación de periodo suena como una nota que se parte en 2, 4 y 8 antes del caos.",
    heading: "Cómo funciona el laboratorio de sonido",
    intro:
      "Esta sala convierte el mapa logístico en música. Un único valor x se itera una y otra vez con la regla de abajo, y cada valor nuevo se convierte en un breve tono pulsado: un x bajo da una nota grave, un x alto una aguda. Los puntos que se desplazan por el panel superior son los últimos 200 valores, con el más reciente a la derecha, y la franja inferior muestra dónde se sitúa la tasa de crecimiento r actual respecto a los puntos de referencia famosos.",
    sections: [
      {
        heading: "Por qué el mapa tiene melodía",
        paragraphs: [
          "El mapa logístico es el modelo más simple de una población que crece cuando es pequeña y mengua cuando está apiñada. Su comportamiento a largo plazo depende solo de r. Para r por debajo de 3, la órbita se asienta en el punto fijo x* = 1 − 1/r, y oyes una sola nota repetida. En r = 3 ese punto fijo se vuelve inestable y la órbita alterna entre dos valores: un trino de dos notas. En r = 1 + √6 ≈ 3,4495 el trino se divide en una figura de cuatro notas, algo después en una de ocho, y las duplicaciones se van apretando hasta acumularse en r∞ ≈ 3,5699, el inicio del caos.",
          "Más allá de ese punto, la mayoría de los valores de r producen una órbita que nunca se repite. Las alturas se dispersan, y lo que era una melodía se convierte en algo más parecido a la lluvia sobre un tejado. La mayor ventana de orden dentro del caos empieza en r = 1 + √8 ≈ 3,8284 con un ciclo estable de tres valores, que oyes como un riff nítido de tres notas.",
        ],
        formula: MAP_FORMULA,
      },
      {
        heading: "Qué hacen los controles",
        paragraphs: [
          "«start audio» crea el motor de sonido; los navegadores solo permiten audio después de un clic, así que el laboratorio está en silencio hasta que lo pulsas. «Master gain» (el volumen general) va de 0 a 0,4 (0,2 por defecto). «Growth rate r» (la tasa de crecimiento) abarca de 2,5 a 4 en pasos de 0,0005 y empieza en 3,7, dentro del caos. Los cinco botones de salto llevan a 3,0; 3,5 (un ciclo limpio de cuatro notas); 3,56995; 3,83 (el ciclo de tres notas) y 3,9.",
          "«Auto-sweep r» mueve r de forma constante desde su valor actual hasta 4 y luego vuelve a empezar en 2,5; «Sweep duration» (de 30 a 240 segundos, 120 por defecto) fija cuánto dura una pasada completa de 2,5 a 4. «Iteration rate» marca el tempo, de 2 a 40 tonos por segundo, 10 por defecto. «Pitch range» elige cómo se reparte x entre las frecuencias: de 220 a 440 Hz (una octava), de 220 a 880 Hz (dos octavas, el valor por defecto), de 110 a 880 Hz (tres) o de 55 a 1760 Hz (cinco). «Quantize to major scale» ajusta cada tono a la nota más cercana de la mayor con raíz en la2 (A2, 110 Hz). «Sound source» elige la forma de onda del oscilador: senoidal («sine», por defecto), triangular («triangle»), diente de sierra («sawtooth») o cuadrada («square»).",
        ],
      },
      {
        heading: "Cómo está construido",
        paragraphs: [
          "Todo corre en tu navegador con la Web Audio API y dos lienzos 2D. Un único oscilador alimenta un nodo de ganancia de voz, que alimenta un nodo de ganancia general y después los altavoces. Un bucle de requestAnimationFrame lleva el compás: cada vez que han pasado suficientes milisegundos para la tasa de iteración elegida, calcula la siguiente iteración, la añade a un historial de 200 valores y reafina el oscilador. Se procesan como mucho 50 iteraciones por fotograma, para que una pestaña que estuvo ralentizada en segundo plano no dispare de golpe cientos de notas atrasadas.",
          "La correspondencia entre x y la altura es logarítmica, porque así es como oímos: pasos iguales en x se convierten en intervalos musicales iguales, no en pasos iguales en hercios. Cada tono tiene la forma de un pulsado suave. La ganancia de voz sube al máximo en 5 milisegundos y luego decae exponencialmente con una constante de tiempo de 0,08 segundos, mientras que la frecuencia se desliza hacia su nuevo valor con una constante de tiempo de 0,01 segundos. Si alguna vez el redondeo saca a x del intervalo de 0 a 1, se reinicia a un valor aleatorio entre 0,25 y 0,75 para que el sonido nunca se quede atascado.",
          "La cuantización compara cada tono, en frecuencia logarítmica, con una tabla precalculada de notas de la mayor por encima de 110 Hz y elige la más cercana. Si tu sistema pide movimiento reducido, el gráfico deja de desplazarse. En su lugar muestra una imagen fija: los 200 valores en los que se asienta la órbita para el r actual, que se repinta cuando r cambia (como mucho una vez por segundo durante el barrido automático). El sonido no se ve afectado y solo suena después de que lo inicies.",
        ],
        code: SONIFY_EXCERPT,
      },
      {
        heading: "Oír lo que no se puede ver",
        paragraphs: [
          "El oído es muy bueno detectando repeticiones. Un patrón de cuatro notas es evidente en el sonido mucho antes de serlo en una nube de puntos, y el momento en que un ciclo se rompe en caos se oye con facilidad como la pérdida de un pulso. La cuantización cambia el carácter, pero no la estructura: las órbitas periódicas se vuelven melodías reconocibles, mientras que los tramos caóticos se convierten en paseos aleatorios por la escala de la mayor.",
        ],
      },
    ],
    experimentsHeading: "Prueba esto",
    experiments: [
      {
        title: "Escucha la cascada entera",
        text: "Inicia el audio, pulsa el botón de salto rotulado «3» y activa «Auto-sweep r» con los 120 segundos por defecto. La nota única se divide en un trino, luego en un patrón de cuatro notas, y después se difumina en ruido antes de 3,57. Atento al repentino riff de tres notas cerca de 3,83.",
      },
      {
        title: "Oye la intermitencia",
        text: "Pulsa el botón de salto «3.83» para el riff limpio de tres notas y luego baja el deslizador a 3,8280, un pelo por debajo del borde de la ventana en 1 + √8 ≈ 3,8284. Ahora el riff suena un rato, estalla en una ráfaga de caos y regresa.",
      },
      {
        title: "Encuentra los umbrales verdaderos",
        text: "Pulsa el botón de salto «3.5» para una figura limpia de cuatro notas y luego lleva el deslizador a 3,449, justo por debajo del punto exacto de duplicación 1 + √6 ≈ 3,4495: la órbita se asienta poco a poco en dos tonos en lugar de cuatro. En 3,56 oyes ocho.",
      },
      {
        title: "Haz musical el caos",
        text: "Pon r en 3,9, el rango de alturas en 55 a 1760 Hz, la fuente en «triangle» y activa «Quantize to major scale». Con la tasa de iteración en 6 obtienes una melodía en la mayor que nunca se repite. Baja r a 3,2 y se queda fija en dos notas.",
      },
    ],
  },
  fr: {
    metaDescription:
      "Écoute la suite logistique : chaque itéré devient un son, et le doublement de période s'entend comme une note qui se scinde en 2, 4 puis 8 avant le chaos.",
    heading: "Comment fonctionne le labo sonore",
    intro:
      "Cette salle transforme la suite logistique en musique. Une seule valeur x est itérée encore et encore avec la règle ci-dessous, et chaque nouvelle valeur devient un bref son pincé : un x faible donne une note grave, un x élevé une note aiguë. Les points qui défilent dans le panneau du haut sont les 200 dernières valeurs, la plus récente à droite, et la bande du bas montre où se situe le taux de croissance r actuel par rapport aux repères célèbres.",
    sections: [
      {
        heading: "Pourquoi la suite a une mélodie",
        paragraphs: [
          "La suite logistique est le modèle le plus simple d'une population qui croît quand elle est petite et diminue quand elle est à l'étroit. Son comportement à long terme ne dépend que de r. Pour r inférieur à 3, l'orbite se stabilise sur le point fixe x* = 1 − 1/r, et tu entends une seule note répétée. En r = 3, ce point fixe devient instable et l'orbite alterne entre deux valeurs : un trille de deux notes. En r = 1 + √6 ≈ 3,4495, le trille se scinde en une figure de quatre notes, un peu plus loin en huit, et les doublements se resserrent jusqu'à s'accumuler en r∞ ≈ 3,5699, le début du chaos.",
          "Au-delà de ce point, la plupart des valeurs de r produisent une orbite qui ne se répète jamais. Les hauteurs s'éparpillent, et ce qui était un air devient quelque chose de plus proche de la pluie sur un toit. La plus grande fenêtre d'ordre à l'intérieur du chaos commence en r = 1 + √8 ≈ 3,8284 avec un cycle stable de trois valeurs, que tu entends comme un riff bien net de trois notes.",
        ],
        formula: MAP_FORMULA,
      },
      {
        heading: "À quoi servent les commandes",
        paragraphs: [
          "« start audio » crée le moteur sonore ; les navigateurs n'autorisent le son qu'après un clic, le labo reste donc silencieux tant que tu n'as pas appuyé. « Master gain » (le volume général) va de 0 à 0,4 (0,2 par défaut). « Growth rate r » (le taux de croissance) couvre 2,5 à 4 par pas de 0,0005 et démarre à 3,7, en plein chaos. Les cinq boutons de saut mènent à 3,0 ; 3,5 (un cycle bien net de quatre notes) ; 3,56995 ; 3,83 (le cycle de trois notes) et 3,9.",
          "« Auto-sweep r » fait avancer r régulièrement de sa valeur actuelle jusqu'à 4, puis repart de 2,5 ; « Sweep duration » (de 30 à 240 secondes, 120 par défaut) fixe la durée d'un passage complet de 2,5 à 4. « Iteration rate » règle le tempo, de 2 à 40 sons par seconde, 10 par défaut. « Pitch range » choisit la façon dont x est réparti sur les fréquences : de 220 à 440 Hz (une octave), de 220 à 880 Hz (deux octaves, la valeur par défaut), de 110 à 880 Hz (trois) ou de 55 à 1 760 Hz (cinq). « Quantize to major scale » cale chaque son sur la note la plus proche de la gamme de la majeur, à partir du la1 (A2, 110 Hz). « Sound source » choisit la forme d'onde de l'oscillateur : sinusoïdale (« sine », par défaut), triangulaire (« triangle »), en dents de scie (« sawtooth ») ou carrée (« square »).",
        ],
      },
      {
        heading: "Comment c'est construit",
        paragraphs: [
          "Tout tourne dans ton navigateur avec l'API Web Audio et deux canevas 2D. Un unique oscillateur alimente un nœud de gain de voix, qui alimente un nœud de gain général puis les haut-parleurs. Une boucle requestAnimationFrame bat la mesure : chaque fois qu'assez de millisecondes se sont écoulées pour la cadence d'itération choisie, elle calcule l'itéré suivant, l'ajoute à un historique de 200 valeurs et réaccorde l'oscillateur. Au plus 50 itérés sont traités par image, pour qu'un onglet ralenti en arrière-plan ne lâche pas d'un coup des centaines de notes de rattrapage.",
          "La correspondance entre x et la hauteur est logarithmique, parce que c'est ainsi que nous entendons : des pas égaux en x deviennent des intervalles musicaux égaux, et non des pas égaux en hertz. Chaque son a la forme d'un pincement doux. Le gain de voix monte au maximum en 5 millisecondes puis décroît exponentiellement avec une constante de temps de 0,08 seconde, tandis que la fréquence glisse vers sa nouvelle valeur avec une constante de temps de 0,01 seconde. Si jamais un arrondi pousse x hors de l'intervalle de 0 à 1, il est réinitialisé à une valeur aléatoire entre 0,25 et 0,75 pour que le son ne reste jamais bloqué.",
          "La quantification compare chaque son, en fréquence logarithmique, à une table précalculée des notes de la majeur au-dessus de 110 Hz et retient la plus proche. Si ton système demande une réduction des animations, le graphique cesse de défiler. Il affiche à la place une image fixe : les 200 valeurs sur lesquelles l'orbite se stabilise pour le r actuel, redessinées quand r change (au plus une fois par seconde pendant le balayage automatique). Le son n'est pas affecté et ne joue qu'une fois que tu l'as lancé.",
        ],
        code: SONIFY_EXCERPT,
      },
      {
        heading: "Entendre ce qu'on ne peut pas voir",
        paragraphs: [
          "L'oreille est très douée pour repérer les répétitions. Un motif de quatre notes saute aux oreilles bien avant de sauter aux yeux dans un nuage de points, et l'instant où un cycle bascule dans le chaos s'entend facilement comme la perte d'une pulsation. La quantification change le caractère mais pas la structure : les orbites périodiques deviennent des mélodies reconnaissables, tandis que les passages chaotiques se transforment en marches aléatoires dans la gamme de la majeur.",
        ],
      },
    ],
    experimentsHeading: "À essayer",
    experiments: [
      {
        title: "Écoute toute la cascade",
        text: "Lance le son, appuie sur le bouton de saut marqué « 3 » et active « Auto-sweep r » avec les 120 secondes par défaut. La note unique se scinde en un trille, puis en un motif de quatre notes, puis se brouille en bruit avant 3,57. Guette le riff soudain de trois notes vers 3,83.",
      },
      {
        title: "Entends l'intermittence",
        text: "Appuie sur le bouton de saut « 3.83 » pour le riff bien net de trois notes, puis descends le curseur à 3,8280, un cheveu en dessous du bord de la fenêtre en 1 + √8 ≈ 3,8284. Le riff joue alors un moment, éclate en une bouffée de chaos, puis revient.",
      },
      {
        title: "Trouve les vrais seuils",
        text: "Appuie sur le bouton de saut « 3.5 » pour une figure bien nette de quatre notes, puis amène le curseur à 3,449, juste en dessous du point de doublement exact 1 + √6 ≈ 3,4495 : l'orbite se stabilise lentement sur deux sons au lieu de quatre. À 3,56, tu en entends huit.",
      },
      {
        title: "Rends le chaos musical",
        text: "Règle r sur 3,9, la plage de hauteurs sur 55 à 1 760 Hz, la source sur « triangle » et active « Quantize to major scale ». Avec la cadence d'itération à 6, tu obtiens une mélodie en la majeur qui ne se répète jamais. Descends r à 3,2 et elle se verrouille sur deux notes.",
      },
    ],
  },
  it: {
    metaDescription:
      "Ascolta la mappa logistica: ogni iterazione diventa un suono, e il raddoppio del periodo si sente come una nota che si divide in 2, 4 e 8 prima del caos.",
    heading: "Come funziona il laboratorio sonoro",
    intro:
      "Questa stanza trasforma la mappa logistica in musica. Un unico valore x viene iterato più e più volte con la regola qui sotto, e ogni nuovo valore diventa un breve suono pizzicato: un x basso dà una nota grave, un x alto una acuta. I puntini che scorrono nel pannello superiore sono gli ultimi 200 valori, con il più recente a destra, e la striscia in basso mostra dove si trova l'attuale tasso di crescita r rispetto ai punti di riferimento più noti.",
    sections: [
      {
        heading: "Perché la mappa ha una melodia",
        paragraphs: [
          "La mappa logistica è il modello più semplice di una popolazione che cresce quando è piccola e si riduce quando è affollata. Il suo comportamento a lungo termine dipende solo da r. Per r minore di 3 l'orbita si assesta sul punto fisso x* = 1 − 1/r, e senti una sola nota ripetuta. In r = 3 quel punto fisso diventa instabile e l'orbita alterna tra due valori: un trillo di due note. In r = 1 + √6 ≈ 3,4495 il trillo si divide in una figura di quattro note, poco dopo in una di otto, e i raddoppi si infittiscono fino ad accumularsi in r∞ ≈ 3,5699, l'inizio del caos.",
          "Oltre quel punto, la maggior parte dei valori di r produce un'orbita che non si ripete mai. Le altezze si sparpagliano, e quello che era un motivo diventa qualcosa di più simile alla pioggia su un tetto. La più grande finestra d'ordine dentro il caos comincia in r = 1 + √8 ≈ 3,8284 con un ciclo stabile di tre valori, che senti come un nitido riff di tre note.",
        ],
        formula: MAP_FORMULA,
      },
      {
        heading: "Che cosa fanno i controlli",
        paragraphs: [
          "«start audio» crea il motore sonoro; i browser consentono l'audio solo dopo un clic, quindi il laboratorio resta in silenzio finché non lo premi. «Master gain» (il volume generale) va da 0 a 0,4 (predefinito 0,2). «Growth rate r» (il tasso di crescita) copre da 2,5 a 4 a passi di 0,0005 e parte da 3,7, dentro il caos. I cinque pulsanti di salto portano a 3,0, 3,5 (un ciclo pulito di quattro note), 3,56995, 3,83 (il ciclo di tre note) e 3,9.",
          "«Auto-sweep r» sposta r in modo costante dal valore attuale fino a 4 e poi ricomincia da 2,5; «Sweep duration» (da 30 a 240 secondi, predefinito 120) stabilisce quanto dura un passaggio completo da 2,5 a 4. «Iteration rate» imposta il tempo, da 2 a 40 suoni al secondo, predefinito 10. «Pitch range» sceglie come x viene distribuito sulle frequenze: da 220 a 440 Hz (un'ottava), da 220 a 880 Hz (due ottave, il valore predefinito), da 110 a 880 Hz (tre) oppure da 55 a 1760 Hz (cinque). «Quantize to major scale» aggancia ogni suono alla nota più vicina di la maggiore, con fondamentale la1 (A2, 110 Hz). «Sound source» sceglie la forma d'onda dell'oscillatore: sinusoidale («sine», predefinita), triangolare («triangle»), a dente di sega («sawtooth») o quadra («square»).",
        ],
      },
      {
        heading: "Com'è costruito",
        paragraphs: [
          "Tutto gira nel tuo browser con la Web Audio API e due canvas 2D. Un unico oscillatore alimenta un nodo di guadagno della voce, che alimenta un nodo di guadagno generale e poi gli altoparlanti. Un ciclo requestAnimationFrame tiene il tempo: ogni volta che sono passati abbastanza millisecondi per la frequenza di iterazione scelta, calcola l'iterazione successiva, la aggiunge a una cronologia di 200 valori e riaccorda l'oscillatore. Vengono elaborate al massimo 50 iterazioni per fotogramma, così una scheda rallentata in background non spara tutte insieme centinaia di note arretrate.",
          "La corrispondenza tra x e altezza è logaritmica, perché è così che sentiamo: passi uguali in x diventano intervalli musicali uguali, non passi uguali in hertz. Ogni suono ha la forma di un pizzicato morbido. Il guadagno della voce sale al massimo in 5 millisecondi e poi decade esponenzialmente con una costante di tempo di 0,08 secondi, mentre la frequenza scivola verso il nuovo valore con una costante di tempo di 0,01 secondi. Se mai un arrotondamento spinge x fuori dall'intervallo da 0 a 1, viene reimpostato a un valore casuale tra 0,25 e 0,75, così il suono non si blocca mai.",
          "La quantizzazione confronta ogni suono, in frequenza logaritmica, con una tabella precalcolata delle note di la maggiore sopra i 110 Hz e sceglie la più vicina. Se il tuo sistema richiede movimento ridotto, il grafico smette di scorrere. Mostra invece un fermo immagine: i 200 valori su cui l'orbita si assesta per l'r attuale, ridipinti quando r cambia (al massimo una volta al secondo durante la scansione automatica). Il suono non ne risente e parte solo dopo che lo hai avviato.",
        ],
        code: SONIFY_EXCERPT,
      },
      {
        heading: "Sentire ciò che non si vede",
        paragraphs: [
          "Le orecchie sono bravissime a cogliere le ripetizioni. Un motivo di quattro note è evidente nel suono molto prima di esserlo in una nuvola di puntini, e il momento in cui un ciclo si rompe nel caos si sente facilmente come la perdita di una pulsazione. La quantizzazione cambia il carattere ma non la struttura: le orbite periodiche diventano melodie riconoscibili, mentre i tratti caotici si trasformano in passeggiate casuali lungo la scala di la maggiore.",
        ],
      },
    ],
    experimentsHeading: "Prova così",
    experiments: [
      {
        title: "Ascolta l'intera cascata",
        text: "Avvia l'audio, premi il pulsante di salto con l'etichetta «3» e attiva «Auto-sweep r» con i 120 secondi predefiniti. La nota singola si divide in un trillo, poi in un motivo di quattro note, poi sfuma in rumore prima di 3,57. Tendi l'orecchio per l'improvviso riff di tre note vicino a 3,83.",
      },
      {
        title: "Senti l'intermittenza",
        text: "Premi il pulsante di salto «3.83» per il riff pulito di tre note, poi abbassa il cursore a 3,8280, un soffio sotto il bordo della finestra in 1 + √8 ≈ 3,8284. Ora il riff suona per un po', esplode in una raffica di caos e ritorna.",
      },
      {
        title: "Trova le soglie vere",
        text: "Premi il pulsante di salto «3.5» per una figura pulita di quattro note, poi porta il cursore a 3,449, appena sotto il punto esatto di raddoppio 1 + √6 ≈ 3,4495: l'orbita si assesta lentamente su due suoni invece di quattro. A 3,56 ne senti otto.",
      },
      {
        title: "Rendi musicale il caos",
        text: "Imposta r a 3,9, l'estensione delle altezze da 55 a 1760 Hz, la sorgente su «triangle» e attiva «Quantize to major scale». Con la frequenza di iterazione a 6 ottieni una melodia in la maggiore che non si ripete mai. Abbassa r a 3,2 e si blocca su due note.",
      },
    ],
  },
  pt: {
    metaDescription:
      "Ouve o mapa logístico: cada iteração torna-se um som, e a duplicação de período soa como uma nota que se divide em 2, 4 e 8 antes de o caos se tornar ruído.",
    heading: "Como funciona o laboratório de som",
    intro:
      "Esta sala transforma o mapa logístico em música. Um único valor x é iterado vezes sem conta com a regra abaixo, e cada novo valor torna-se um som curto e dedilhado: um x baixo dá uma nota grave, um x alto uma aguda. Os pontos que deslizam pelo painel de cima são os últimos 200 valores, com o mais recente à direita, e a faixa em baixo mostra onde fica a taxa de crescimento r atual em relação aos marcos famosos.",
    sections: [
      {
        heading: "Porque é que o mapa tem melodia",
        paragraphs: [
          "O mapa logístico é o modelo mais simples de uma população que cresce quando é pequena e encolhe quando está apinhada. O seu comportamento a longo prazo depende apenas de r. Para r abaixo de 3, a órbita assenta no ponto fixo x* = 1 − 1/r, e ouves uma só nota repetida. Em r = 3 esse ponto fixo torna-se instável e a órbita alterna entre dois valores: um trilo de duas notas. Em r = 1 + √6 ≈ 3,4495 o trilo divide-se numa figura de quatro notas, um pouco depois numa de oito, e as duplicações vão-se apertando até se acumularem em r∞ ≈ 3,5699, o início do caos.",
          "Para lá desse ponto, a maioria dos valores de r produz uma órbita que nunca se repete. As alturas dispersam-se, e o que era uma melodia passa a ser algo mais parecido com chuva num telhado. A maior janela de ordem dentro do caos começa em r = 1 + √8 ≈ 3,8284 com um ciclo estável de três valores, que ouves como um riff nítido de três notas.",
        ],
        formula: MAP_FORMULA,
      },
      {
        heading: "O que fazem os controlos",
        paragraphs: [
          "«start audio» cria o motor de som; os navegadores só permitem áudio depois de um clique, por isso o laboratório fica em silêncio até carregares. «Master gain» (o volume geral) vai de 0 a 0,4 (0,2 por omissão). «Growth rate r» (a taxa de crescimento) cobre de 2,5 a 4 em passos de 0,0005 e começa em 3,7, dentro do caos. Os cinco botões de salto levam a 3,0; 3,5 (um ciclo limpo de quatro notas); 3,56995; 3,83 (o ciclo de três notas) e 3,9.",
          "«Auto-sweep r» move r a ritmo constante do valor atual até 4 e depois recomeça em 2,5; «Sweep duration» (de 30 a 240 segundos, 120 por omissão) define quanto demora uma passagem completa de 2,5 a 4. «Iteration rate» define o andamento, de 2 a 40 sons por segundo, 10 por omissão. «Pitch range» escolhe como x é distribuído pelas frequências: de 220 a 440 Hz (uma oitava), de 220 a 880 Hz (duas oitavas, o valor por omissão), de 110 a 880 Hz (três) ou de 55 a 1760 Hz (cinco). «Quantize to major scale» encaixa cada som na nota mais próxima de lá maior, com tónica em A2 (110 Hz). «Sound source» escolhe a forma de onda do oscilador: sinusoidal («sine», por omissão), triangular («triangle»), dente de serra («sawtooth») ou quadrada («square»).",
        ],
      },
      {
        heading: "Como está construído",
        paragraphs: [
          "Tudo corre no teu navegador com a Web Audio API e dois canvas 2D. Um único oscilador alimenta um nó de ganho de voz, que alimenta um nó de ganho geral e depois as colunas. Um ciclo de requestAnimationFrame marca o tempo: sempre que passam milissegundos suficientes para a taxa de iteração escolhida, calcula a iteração seguinte, acrescenta-a a um histórico de 200 valores e reafina o oscilador. São processadas no máximo 50 iterações por fotograma, para que um separador que esteve abrandado em segundo plano não dispare de uma vez centenas de notas em atraso.",
          "A correspondência entre x e a altura é logarítmica, porque é assim que ouvimos: passos iguais em x tornam-se intervalos musicais iguais, não passos iguais em hertz. Cada som tem a forma de um dedilhado suave. O ganho de voz sobe ao máximo em 5 milissegundos e depois decai exponencialmente com uma constante de tempo de 0,08 segundos, enquanto a frequência desliza para o novo valor com uma constante de tempo de 0,01 segundos. Se algum arredondamento empurrar x para fora do intervalo de 0 a 1, ele é reposto num valor aleatório entre 0,25 e 0,75, para que o som nunca fique preso.",
          "A quantização compara cada som, em frequência logarítmica, com uma tabela pré-calculada de notas de lá maior acima de 110 Hz e escolhe a mais próxima. Se o teu sistema pedir movimento reduzido, o gráfico deixa de deslizar. Em vez disso mostra uma imagem parada: os 200 valores em que a órbita assenta para o r atual, repintados quando r muda (no máximo uma vez por segundo durante o varrimento automático). O som não é afetado e só toca depois de o iniciares.",
        ],
        code: SONIFY_EXCERPT,
      },
      {
        heading: "Ouvir o que não se consegue ver",
        paragraphs: [
          "Os ouvidos são muito bons a detetar repetição. Um padrão de quatro notas é óbvio no som muito antes de o ser numa nuvem de pontos, e o momento em que um ciclo se desfaz em caos ouve-se facilmente como a perda de uma pulsação. A quantização muda o carácter mas não a estrutura: as órbitas periódicas tornam-se melodias reconhecíveis, enquanto os troços caóticos se transformam em passeios aleatórios pela escala de lá maior.",
        ],
      },
    ],
    experimentsHeading: "Experimenta isto",
    experiments: [
      {
        title: "Ouve a cascata inteira",
        text: "Inicia o áudio, carrega no botão de salto com a etiqueta «3» e liga «Auto-sweep r» com os 120 segundos por omissão. A nota única divide-se num trilo, depois num padrão de quatro notas, e a seguir dissolve-se em ruído antes de 3,57. Fica à escuta do súbito riff de três notas perto de 3,83.",
      },
      {
        title: "Ouve a intermitência",
        text: "Carrega no botão de salto «3.83» para o riff limpo de três notas e depois desce o cursor para 3,8280, um nadinha abaixo da margem da janela em 1 + √8 ≈ 3,8284. Agora o riff toca durante um bocado, rebenta numa rajada de caos e regressa.",
      },
      {
        title: "Encontra os limiares verdadeiros",
        text: "Carrega no botão de salto «3.5» para uma figura limpa de quatro notas e depois leva o cursor para 3,449, logo abaixo do ponto exato de duplicação 1 + √6 ≈ 3,4495: a órbita assenta lentamente em dois sons em vez de quatro. Em 3,56 ouves oito.",
      },
      {
        title: "Torna o caos musical",
        text: "Põe r em 3,9, a gama de alturas em 55 a 1760 Hz, a fonte em «triangle» e liga «Quantize to major scale». Com a taxa de iteração em 6 obténs uma melodia em lá maior que nunca se repete. Desce r para 3,2 e ela fixa-se em duas notas.",
      },
    ],
  },
  sv: {
    metaDescription:
      "Hör den logistiska avbildningen: varje iteration blir en ton, så periodfördubbling låter som en ton som delar sig i 2, 4 och 8 innan kaoset blir brus.",
    heading: "Så fungerar ljudlabbet",
    intro:
      "Det här rummet gör musik av den logistiska avbildningen. Ett enda värde x itereras om och om igen med regeln nedan, och varje nytt värde blir en kort knäppt ton: lågt x ger en låg ton, högt x en hög. Prickarna som rullar över den övre panelen är de senaste 200 värdena, med det nyaste till höger, och remsan längst ner visar var den aktuella tillväxttakten r ligger i förhållande till de berömda riktmärkena.",
    sections: [
      {
        heading: "Varför avbildningen har en melodi",
        paragraphs: [
          "Den logistiska avbildningen är den enklaste modellen av en population som växer när den är liten och krymper när det blir trångt. Dess beteende på lång sikt beror bara på r. För r under 3 stannar banan på fixpunkten x* = 1 − 1/r, och du hör en enda ton som upprepas. Vid r = 3 blir fixpunkten instabil och banan växlar mellan två värden: en drill på två toner. Vid r = 1 + √6 ≈ 3,4495 delar sig drillen i en figur på fyra toner, lite senare i åtta, och fördubblingarna trängs ihop tills de hopar sig vid r∞ ≈ 3,5699, kaosets början.",
          "Bortom den punkten ger de flesta värden på r en bana som aldrig upprepar sig. Tonhöjderna sprids ut, och det som var en melodi blir något som mer liknar regn mot ett tak. Det största fönstret av ordning inne i kaoset börjar vid r = 1 + √8 ≈ 3,8284 med en stabil cykel av tre värden, som du hör som ett tydligt riff på tre toner.",
        ],
        formula: MAP_FORMULA,
      },
      {
        heading: "Vad reglagen gör",
        paragraphs: [
          "”start audio” skapar ljudmotorn. Webbläsare tillåter ljud först efter ett klick, så labbet är tyst tills du trycker. ”Master gain” (huvudvolymen) går från 0 till 0,4 (standard 0,2). ”Growth rate r” (tillväxttakten) sträcker sig från 2,5 till 4 i steg om 0,0005 och börjar på 3,7, inne i kaoset. De fem hoppknapparna leder till 3,0; 3,5 (en ren cykel på fyra toner); 3,56995; 3,83 (cykeln på tre toner) och 3,9.",
          "”Auto-sweep r” flyttar r i jämn takt från det aktuella värdet upp till 4 och börjar sedan om från 2,5. ”Sweep duration” (30 till 240 sekunder, standard 120) bestämmer hur lång tid ett helt svep från 2,5 till 4 tar. ”Iteration rate” sätter tempot, från 2 till 40 toner per sekund, standard 10. ”Pitch range” väljer hur x fördelas över frekvenserna: 220 till 440 Hz (en oktav), 220 till 880 Hz (två oktaver, standard), 110 till 880 Hz (tre) eller 55 till 1760 Hz (fem). ”Quantize to major scale” låser varje ton till närmaste ton i A-dur med grundton A2 (110 Hz). ”Sound source” väljer oscillatorns vågform: sinus (”sine”, standard), triangel (”triangle”), sågtand (”sawtooth”) eller fyrkant (”square”).",
        ],
      },
      {
        heading: "Hur det är byggt",
        paragraphs: [
          "Allt körs i din webbläsare med Web Audio API och två 2D-canvasar. En enda oscillator matar en förstärkningsnod för stämman, som matar en nod för huvudvolymen och sedan högtalarna. En requestAnimationFrame-loop håller takten: varje gång tillräckligt många millisekunder har gått för den valda iterationstakten räknar den ut nästa iteration, lägger till den i en historik med 200 värden och stämmer om oscillatorn. Högst 50 iterationer behandlas per bildruta, så att en flik som har strypts i bakgrunden inte avfyrar hundratals eftersläpande toner på en gång.",
          "Avbildningen från x till tonhöjd är logaritmisk, eftersom det är så vi hör: lika stora steg i x blir lika stora musikaliska intervall, inte lika stora steg i hertz. Varje ton är formad som en mjuk knäppning. Stämmans förstärkning stiger till fullt på 5 millisekunder och avklingar sedan exponentiellt med en tidskonstant på 0,08 sekunder, medan frekvensen glider till sitt nya värde med en tidskonstant på 0,01 sekunder. Om avrundning någon gång knuffar x utanför intervallet från 0 till 1 återställs det till ett slumpmässigt värde mellan 0,25 och 0,75, så att ljudet aldrig fastnar.",
          "Kvantiseringen jämför varje ton i logaritmisk frekvens med en förberäknad tabell över tonerna i A-dur ovanför 110 Hz och väljer den närmaste. Om ditt system ber om minskad rörelse slutar diagrammet att rulla. Det visar i stället en stillbild: de 200 värden som banan stannar på för det aktuella r, omritade när r ändras (högst en gång per sekund under det automatiska svepet). Ljudet påverkas inte och spelas först när du har startat det.",
        ],
        code: SONIFY_EXCERPT,
      },
      {
        heading: "Att höra det man inte kan se",
        paragraphs: [
          "Öron är mycket bra på att upptäcka upprepning. Ett mönster på fyra toner är uppenbart i ljud långt innan det är uppenbart i ett moln av prickar, och ögonblicket då en cykel brister ut i kaos är lätt att höra som en tappad puls. Kvantiseringen ändrar karaktären men inte strukturen: periodiska banor blir igenkännliga melodier, medan kaotiska partier blir slumpvandringar genom A-durskalan.",
        ],
      },
    ],
    experimentsHeading: "Prova det här",
    experiments: [
      {
        title: "Lyssna på hela kaskaden",
        text: "Starta ljudet, tryck på hoppknappen märkt ”3” och slå på ”Auto-sweep r” med standardvärdet 120 sekunder. Den enda tonen delar sig i en drill, sedan i ett mönster på fyra toner, och suddas därefter ut till brus före 3,57. Lyssna efter det plötsliga riffet på tre toner nära 3,83.",
      },
      {
        title: "Hör intermittens",
        text: "Tryck på hoppknappen ”3.83” för det rena riffet på tre toner och dra sedan ner reglaget till 3,8280, en hårsmån under fönstrets kant vid 1 + √8 ≈ 3,8284. Nu spelas riffet en stund, bryter ut i en skur av kaos och kommer tillbaka.",
      },
      {
        title: "Hitta de verkliga trösklarna",
        text: "Tryck på hoppknappen ”3.5” för en ren figur på fyra toner och flytta sedan reglaget till 3,449, strax under den exakta fördubblingspunkten 1 + √6 ≈ 3,4495: banan stannar långsamt på två toner i stället för fyra. Vid 3,56 hör du åtta.",
      },
      {
        title: "Gör kaoset musikaliskt",
        text: "Ställ r på 3,9, tonomfånget på 55 till 1760 Hz, källan på ”triangle” och slå på ”Quantize to major scale”. Med iterationstakten på 6 får du en melodi i A-dur som aldrig upprepar sig. Sänk r till 3,2 så låser den sig på två toner.",
      },
    ],
  },
  no: {
    metaDescription:
      "Hør den logistiske avbildningen: Hver iterasjon blir en tone, så periodedobling høres ut som en tone som deler seg i 2, 4 og 8 før kaoset blir til støy.",
    heading: "Slik fungerer denne lydlaben",
    intro:
      "Dette rommet gjør den logistiske avbildningen om til musikk. Én enkelt verdi x itereres om og om igjen med regelen nedenfor, og hver nye verdi blir en kort, klimpret tone: Lav x gir en dyp tone, høy x en lys. Prikkene som ruller over det øvre panelet, er de siste 200 verdiene, med den nyeste til høyre, og stripen nederst viser hvor den gjeldende vekstraten r ligger i forhold til de berømte landemerkene.",
    sections: [
      {
        heading: "Hvorfor avbildningen har en melodi",
        paragraphs: [
          "Den logistiske avbildningen er den enkleste modellen av en populasjon som vokser når den er liten, og krymper når det blir trangt. Oppførselen på lang sikt avhenger bare av r. For r under 3 faller banen til ro på fikspunktet x* = 1 − 1/r, og du hører én tone som gjentas. Ved r = 3 blir fikspunktet ustabilt, og banen veksler mellom to verdier: en trille på to toner. Ved r = 1 + √6 ≈ 3,4495 deler trillen seg i en figur på fire toner, litt senere i åtte, og doblingene trenger seg sammen til de hoper seg opp ved r∞ ≈ 3,5699, starten på kaoset.",
          "Bortenfor det punktet gir de fleste verdier av r en bane som aldri gjentar seg. Tonehøydene spres utover, og det som var en melodi, blir noe som ligner mer på regn mot et tak. Det største vinduet av orden inne i kaoset starter ved r = 1 + √8 ≈ 3,8284 med en stabil sykel av tre verdier, som du hører som et tydelig riff på tre toner.",
        ],
        formula: MAP_FORMULA,
      },
      {
        heading: "Hva kontrollene gjør",
        paragraphs: [
          "«start audio» oppretter lydmotoren. Nettlesere tillater lyd først etter et klikk, så laben er stille til du trykker. «Master gain» (hovedvolumet) går fra 0 til 0,4 (standard 0,2). «Growth rate r» (vekstraten) spenner fra 2,5 til 4 i steg på 0,0005 og starter på 3,7, inne i kaoset. De fem hoppknappene fører til 3,0; 3,5 (en ren sykel på fire toner); 3,56995; 3,83 (sykelen på tre toner) og 3,9.",
          "«Auto-sweep r» flytter r jevnt fra den gjeldende verdien opp til 4 og begynner så på nytt fra 2,5. «Sweep duration» (30 til 240 sekunder, standard 120) bestemmer hvor lang tid ett helt sveip fra 2,5 til 4 tar. «Iteration rate» setter tempoet, fra 2 til 40 toner per sekund, standard 10. «Pitch range» velger hvordan x fordeles over frekvensene: 220 til 440 Hz (én oktav), 220 til 880 Hz (to oktaver, standard), 110 til 880 Hz (tre) eller 55 til 1760 Hz (fem). «Quantize to major scale» låser hver tone til nærmeste tone i A-dur med grunntone A2 (110 Hz). «Sound source» velger bølgeformen til oscillatoren: sinus («sine», standard), trekant («triangle»), sagtann («sawtooth») eller firkant («square»).",
        ],
      },
      {
        heading: "Slik er den bygget",
        paragraphs: [
          "Alt kjører i nettleseren din med Web Audio API og to 2D-lerreter. Én enkelt oscillator mater en forsterkningsnode for stemmen, som mater en node for hovedvolumet og deretter høyttalerne. En requestAnimationFrame-løkke holder takten: Hver gang det har gått nok millisekunder for den valgte iterasjonsraten, regner den ut neste iterasjon, legger den til i en historikk på 200 verdier og stemmer om oscillatoren. Høyst 50 iterasjoner behandles per bilde, slik at en fane som har vært strupet i bakgrunnen, ikke fyrer av hundrevis av etterslepende toner på én gang.",
          "Avbildningen fra x til tonehøyde er logaritmisk, fordi det er slik vi hører: Like store steg i x blir like store musikalske intervaller, ikke like store steg i hertz. Hver tone er formet som et mykt klimpr. Forsterkningen til stemmen stiger til fullt på 5 millisekunder og dør deretter ut eksponentielt med en tidskonstant på 0,08 sekunder, mens frekvensen glir til den nye verdien med en tidskonstant på 0,01 sekunder. Hvis avrunding noen gang dytter x utenfor intervallet fra 0 til 1, tilbakestilles den til en tilfeldig verdi mellom 0,25 og 0,75, slik at lyden aldri setter seg fast.",
          "Kvantiseringen sammenligner hver tone i logaritmisk frekvens med en forhåndsberegnet tabell over tonene i A-dur over 110 Hz og velger den nærmeste. Hvis systemet ditt ber om redusert bevegelse, slutter diagrammet å rulle. Det viser i stedet et stillbilde: de 200 verdiene banen faller til ro på for gjeldende r, tegnet på nytt når r endres (høyst én gang i sekundet under det automatiske sveipet). Lyden påvirkes ikke og spilles først når du har startet den.",
        ],
        code: SONIFY_EXCERPT,
      },
      {
        heading: "Å høre det man ikke kan se",
        paragraphs: [
          "Ører er svært gode til å oppdage gjentakelse. Et mønster på fire toner er åpenbart i lyd lenge før det er åpenbart i en sky av prikker, og øyeblikket da en sykel bryter sammen i kaos, er lett å høre som en tapt puls. Kvantiseringen endrer karakteren, men ikke strukturen: Periodiske baner blir gjenkjennelige melodier, mens kaotiske strekk blir til tilfeldige vandringer gjennom A-durskalaen.",
        ],
      },
    ],
    experimentsHeading: "Prøv dette",
    experiments: [
      {
        title: "Lytt til hele kaskaden",
        text: "Start lyden, trykk på hoppknappen merket «3» og slå på «Auto-sweep r» med standardverdien 120 sekunder. Den ene tonen deler seg i en trille, så i et mønster på fire toner, og viskes deretter ut til støy før 3,57. Lytt etter det plutselige riffet på tre toner nær 3,83.",
      },
      {
        title: "Hør intermittens",
        text: "Trykk på hoppknappen «3.83» for det rene riffet på tre toner, og dra så glidebryteren ned til 3,8280, en hårsbredd under kanten av vinduet ved 1 + √8 ≈ 3,8284. Nå spilles riffet en stund, bryter ut i en byge av kaos og kommer tilbake.",
      },
      {
        title: "Finn de virkelige tersklene",
        text: "Trykk på hoppknappen «3.5» for en ren figur på fire toner, og flytt så glidebryteren til 3,449, like under det eksakte doblingspunktet 1 + √6 ≈ 3,4495: Banen faller langsomt til ro på to toner i stedet for fire. Ved 3,56 hører du åtte.",
      },
      {
        title: "Gjør kaoset musikalsk",
        text: "Sett r til 3,9, toneomfanget til 55 til 1760 Hz, kilden til «triangle» og slå på «Quantize to major scale». Med iterasjonsraten på 6 får du en melodi i A-dur som aldri gjentar seg. Senk r til 3,2, så låser den seg på to toner.",
      },
    ],
  },
};
