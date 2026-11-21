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
        formula: "x_{n+1} = r\\,x_n\\,(1 - x_n)",
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
        formula: "x_{n+1} = r\\,x_n\\,(1 - x_n)",
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
};
