import type { ExplorerGuide } from "./types";

// Behaviour quoted here (a sine and a cosine oscillator per harmonic, 64 in
// all, gains divided by the sum of absolute amplitudes, 0.04 s smoothing, base
// 55 to 880 Hz, sweep 110 to 660 Hz at 0.2 Hz, eight custom partials with
// everything above k = 8 silenced, a 25 % pulse on cosines, a spectrum drawn
// from the recipe, a computed still waveform under reduced motion, the EN and
// DE control labels from RICH_EXPLORER) matches app/fourier/sound/page.tsx and
// lib/fourier/soundRecipes.ts; update them together.
const AUDIO_EXCERPT = `// partialGains: amplitude of each partial, divided by the sum of all |a_k|
const amps: number[] = [];
let total = 0;
for (let k = 1; k <= MAX_HARMONICS; k++) {
  const a = k <= harmonics ? partialAmplitude(wave, k, custom, customs) : 0;
  amps.push(a);
  total += Math.abs(a);
}
const gains = total > 0 ? amps.map((a) => a / total) : amps;

const cosine = usesCosine(w);
for (let i = 0; i < voicesRef.current.length; i++) {
  const v = voicesRef.current[i];
  const freq = base * (i + 1);
  v.sin.frequency.setTargetAtTime(freq, now, tc);
  v.cos.frequency.setTargetAtTime(freq, now, tc);
  v.sinGain.gain.setTargetAtTime(cosine ? 0 : gains[i], now, tc);
  v.cosGain.gain.setTargetAtTime(cosine ? gains[i] : 0, now, tc);
}`;

export const FOURIER_SOUND_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Hear a Fourier series: up to 32 harmonics build square, sawtooth, triangle and pulse tones in your browser, with a live oscilloscope and custom partials.",
    heading: "How this sound lab works",
    intro:
      "This room turns the Fourier series into sound. Each harmonic is a real oscillator running in your browser, tuned to a whole multiple of the base frequency, and the tone you hear is their sum. The upper canvas is an oscilloscope showing the actual audio signal, the lower one shows the amplitude recipe that is being played. Change the recipe and you hear the timbre change while the pitch stays put.",
    sections: [
      {
        heading: "Pitch from the fundamental, colour from the harmonics",
        paragraphs: [
          "A steady musical tone repeats itself many times per second. Fourier's insight says that any such repeating signal is a sum of sine waves at the repetition frequency f and its whole multiples 2f, 3f, 4f and so on. The lowest one, the fundamental, mostly sets the pitch you hear. The relative strengths of the others, the harmonics or partials, set the colour of the sound, which is why a flute and a violin playing the same note are easy to tell apart.",
          "The recipes here are the classic Fourier series. The square wave uses only odd harmonics with amplitudes falling like 1/k, which gives it a hollow sound often compared to a clarinet. The sawtooth uses all harmonics, also falling like 1/k, and sounds bright and buzzy. The triangle uses odd harmonics falling like 1/k², so its upper partials fade quickly and it sounds soft, close to a pure sine. The pulse spends a quarter of each period on its high level; its amplitudes follow sin(πk/4)/k, so every fourth harmonic is missing.",
        ],
        formula: "s(t) = \\sum_{k=1}^{N} a_k \\sin(2\\pi k f t)",
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "Start audio creates the sound engine; browsers only allow a page to make sound after you click something, so nothing plays before that. Master gain (0 to 0.4, default 0.2) sets the overall volume. Base frequency runs from 55 to 880 Hz, default 220 Hz, the A below middle C.",
          "Target wave picks the recipe: square (the default), sawtooth, triangle or a 25 % pulse. Harmonics sets how many partials are active, from 1 to 32, with shortcuts for 1, 3, 8 and 24; at 1 you hear a pure sine whatever the target. Partial amplitudes shows the first eight coefficients. In auto mode they follow the target; switch to custom and each one gets a slider from −1.3 to 1.3. In custom mode only these eight partials sound: everything above k = 8 is silenced, even with Harmonics set higher.",
          "Sweep frequency glides the fundamental between 110 and 660 Hz in a slow sine with a period of five seconds, and the whole harmonic stack moves with it.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "Pressing start builds a Web Audio graph: for each of the 32 harmonics a sine and a cosine OscillatorNode, each with its own GainNode, all feeding a master gain and an AnalyserNode. All 64 oscillators run continuously; inactive ones simply have gain 0. Every change goes through the update below. The amplitudes are divided by the sum of their absolute values. The partials are phase-locked and can all peak at the same instant, and with this scaling even that worst case stays within the range from −1 to 1, so no recipe and no slider setting can clip. All changes use setTargetAtTime with a time constant of 0.04 seconds, which smooths steps into short glides and avoids clicks.",
          "Because every oscillator glides with the same time constant, partial k stays at exactly k times the fundamental even while the frequency moves, so the stack stays harmonic during sweeps. Stopping fades the master to silence and closes the audio context a moment later.",
          "The oscilloscope reads 2048 time-domain samples from the analyser every animation frame and draws about two and a half periods of the fundamental. The bar chart below it is drawn from the coefficient recipe, not measured from the audio: cyan bars are positive coefficients, rose bars negative ones. If your system asks for reduced motion, the live trace is replaced by a still waveform computed from the recipe, redrawn only when you change something.",
        ],
        code: AUDIO_EXCERPT,
      },
      {
        heading: "Why phase is hard to hear",
        paragraphs: [
          "Square, sawtooth and triangle can be written with sines alone. The pulse cannot: centred on t = 0 it is mirror-symmetric, and its series consists of cosines. That is why every harmonic has a cosine twin, and the pulse recipe plays on those. Put the same amplitudes on sines instead and the curve changes completely, with sharp spikes and no flat levels. Yet as a steady tone it would sound almost the same to most ears, because our hearing pays close attention to which frequencies are present and how strong they are, and far less to how their phases line up. The sawtooth lets you test this: flip the signs of its even partials and the rising ramp becomes a falling one, without any amplitude changing.",
        ],
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "Build a square wave by ear",
        text: "Choose square, start audio and press 1: a pure, flute-like sine. Then press 3, 8 and 24. The pitch never changes, but each step adds odd harmonics and the tone becomes more hollow and reedy, while the oscilloscope trace flattens into a square.",
      },
      {
        title: "Same sound, different shape",
        text: "Choose the sawtooth with 8 harmonics and switch to custom. The sliders k2, k4, k6 and k8 are negative: drag them to 0.32, 0.16, 0.11 and 0.08, the same sizes with a plus sign. The ramp on the oscilloscope now falls instead of rising. Listen for any difference in the sound.",
      },
      {
        title: "Remove the fundamental",
        text: "Choose the sawtooth, set Harmonics to 8, switch partial amplitudes to custom and drag k1 to 0. The tone gets thinner, yet most listeners still hear the same pitch, because the remaining partials at 2f, 3f and up still repeat at the rate of f.",
      },
      {
        title: "Sculpt an odd-free tone",
        text: "Choose the sawtooth, then switch to custom mode with 8 harmonics, set k1, k3, k5 and k7 to 0 and keep the even partials. The remaining stack 2f, 4f, 6f, 8f is itself a harmonic series on 2f, so the pitch jumps up by an octave.",
      },
    ],
  },
  de: {
    metaDescription:
      "Eine Fourier-Reihe hören: Bis zu 32 Harmonische ergeben im Browser Rechteck-, Sägezahn-, Dreieck- und Pulsklänge, mit Live-Oszilloskop und eigenen Teiltönen.",
    heading: "So funktioniert dieses Klanglabor",
    intro:
      "Dieser Raum macht aus der Fourier-Reihe Klang. Jede Harmonische ist ein echter Oszillator in deinem Browser, gestimmt auf ein ganzzahliges Vielfaches der Grundfrequenz, und was du hörst, ist ihre Summe. Das obere Canvas ist ein Oszilloskop mit dem tatsächlichen Audiosignal, das untere zeigt das Amplitudenrezept, das gerade gespielt wird. Änderst du das Rezept, hörst du die Klangfarbe wechseln, während die Tonhöhe bleibt.",
    sections: [
      {
        heading: "Tonhöhe aus dem Grundton, Farbe aus den Obertönen",
        paragraphs: [
          "Ein gleichmäßiger Ton wiederholt sich viele Male pro Sekunde. Nach Fourier ist jedes solche sich wiederholende Signal eine Summe von Sinuswellen mit der Wiederholfrequenz f und ihren ganzzahligen Vielfachen 2f, 3f, 4f und so weiter. Die tiefste, der Grundton, bestimmt im Wesentlichen die Tonhöhe, die du hörst. Das Stärkeverhältnis der übrigen, der Harmonischen oder Teiltöne, bestimmt die Klangfarbe. Deshalb lassen sich Flöte und Geige auf demselben Ton leicht unterscheiden.",
          "Die Rezepte hier sind die klassischen Fourier-Reihen. Die Rechteckwelle nutzt nur ungerade Harmonische, deren Amplituden wie 1/k fallen, und klingt hohl, oft mit einer Klarinette verglichen. Der Sägezahn nutzt alle Harmonischen, ebenfalls mit 1/k, und klingt hell und schnarrend. Das Dreieck nutzt ungerade Harmonische, die wie 1/k² fallen. Seine oberen Teiltöne verblassen schnell, es klingt weich und fast wie ein reiner Sinus. Der Puls verbringt ein Viertel jeder Periode auf seinem hohen Pegel. Seine Amplituden folgen sin(πk/4)/k, jede vierte Harmonische fehlt also.",
        ],
        formula: "s(t) = \\sum_{k=1}^{N} a_k \\sin(2\\pi k f t)",
      },
      {
        heading: "Was die Regler bewirken",
        paragraphs: [
          "«Audio starten» erzeugt die Klangmaschine. Browser erlauben einer Seite erst nach einem Klick, Töne abzuspielen, vorher ist also nichts zu hören. «Gesamtlautstärke» (0 bis 0,4, Standard 0,2) regelt die Gesamtlautstärke. Die Grundfrequenz reicht von 55 bis 880 Hz, Standard ist 220 Hz, das A unter dem eingestrichenen C.",
          "«Zielwelle» wählt das Rezept: Rechteck (Standard), Sägezahn, Dreieck oder einen Puls mit 25 % Tastgrad. «Harmonische» legt fest, wie viele Teiltöne aktiv sind, von 1 bis 32, mit Abkürzungen für 1, 3, 8 und 24. Bei 1 hörst du einen reinen Sinus, egal welches Ziel gewählt ist. «Teiltonamplituden» zeigt die ersten acht Koeffizienten. Im Modus «auto» folgen sie dem Ziel, im Modus «eigene» bekommt jeder einen Regler von −1,3 bis 1,3. Im Modus «eigene» klingen nur diese acht Teiltöne: Alles oberhalb von k = 8 ist stumm, auch wenn «Harmonische» höher steht.",
          "«Frequenz-Sweep» lässt den Grundton in einem langsamen Sinus mit fünf Sekunden Periode zwischen 110 und 660 Hz gleiten, und der ganze Obertonstapel wandert mit.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Der Start baut einen Web-Audio-Graphen: für jede der 32 Harmonischen einen Sinus- und einen Kosinus-OscillatorNode mit je einem eigenen GainNode, die alle in eine Gesamtlautstärke und einen AnalyserNode münden. Alle 64 Oszillatoren laufen ständig, inaktive haben einfach die Lautstärke 0. Jede Änderung läuft durch das Update unten. Die Amplituden werden durch die Summe ihrer Beträge geteilt. Die Teiltöne sind phasenstarr und können alle im selben Moment ihr Maximum erreichen, und mit dieser Skalierung bleibt selbst dieser ungünstigste Fall im Bereich von −1 bis 1. Kein Rezept und keine Reglerstellung kann also übersteuern. Alle Änderungen nutzen setTargetAtTime mit einer Zeitkonstante von 0,04 Sekunden. Das glättet Sprünge zu kurzen Übergängen und verhindert Knackser.",
          "Weil jeder Oszillator mit derselben Zeitkonstante gleitet, bleibt Teilton k auch während einer Frequenzänderung genau beim k-Fachen des Grundtons, der Stapel bleibt beim Sweep also harmonisch. Beim Stoppen wird die Gesamtlautstärke ausgeblendet und der Audiokontext kurz danach geschlossen.",
          "Das Oszilloskop liest in jedem Animationsframe 2048 Samples aus dem Analyser und zeichnet etwa zweieinhalb Perioden des Grundtons. Das Balkendiagramm darunter wird aus dem Koeffizientenrezept gezeichnet und nicht aus dem Audiosignal gemessen: Cyanfarbene Balken sind positive Koeffizienten, rosa Balken negative. Verlangt dein System reduzierte Bewegung, ersetzt eine stehende, aus dem Rezept berechnete Wellenform die Live-Kurve. Sie wird nur neu gezeichnet, wenn du etwas änderst.",
        ],
        code: AUDIO_EXCERPT,
      },
      {
        heading: "Warum man die Phase kaum hört",
        paragraphs: [
          "Rechteck, Sägezahn und Dreieck lassen sich allein mit Sinuswellen schreiben. Der Puls nicht: Um t = 0 zentriert ist er spiegelsymmetrisch, und seine Reihe besteht aus Kosinuswellen. Deshalb hat jede Harmonische einen Kosinus-Zwilling, und das Puls-Rezept spielt auf diesen. Legst du dieselben Amplituden stattdessen auf Sinuswellen, ändert sich die Kurve völlig, mit scharfen Spitzen und ohne flache Pegel. Als gleichmäßiger Ton klänge sie für die meisten Ohren trotzdem fast gleich. Unser Gehör achtet genau darauf, welche Frequenzen wie stark vorhanden sind, und viel weniger darauf, wie ihre Phasen zueinander liegen. Am Sägezahn kannst du das prüfen: Drehst du die Vorzeichen seiner geraden Teiltöne um, wird aus der steigenden Rampe eine fallende, ohne dass sich eine Amplitude ändert.",
        ],
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Eine Rechteckwelle nach Gehör bauen",
        text: "Wähle das Rechteck, starte den Ton und drück 1: ein reiner, flötenartiger Sinus. Drück dann 3, 8 und 24. Die Tonhöhe ändert sich nie, aber jeder Schritt fügt ungerade Harmonische hinzu, der Ton wird hohler und näselnder, und die Kurve auf dem Oszilloskop flacht zu einem Rechteck ab.",
      },
      {
        title: "Gleicher Klang, andere Form",
        text: "Wähle den Sägezahn mit 8 Harmonischen und schalte auf «eigene». Die Regler k2, k4, k6 und k8 stehen im Minus: Zieh sie auf 0,32, 0,16, 0,11 und 0,08, also dieselben Beträge mit Pluszeichen. Die Rampe auf dem Oszilloskop fällt jetzt, statt zu steigen. Hörst du einen Unterschied im Klang?",
      },
      {
        title: "Den Grundton entfernen",
        text: "Wähle den Sägezahn, stell die Harmonischen auf 8, schalte die Teiltonamplituden auf «eigene» und zieh k1 auf 0. Der Ton wird dünner, trotzdem hören die meisten Menschen dieselbe Tonhöhe, denn die übrigen Teiltöne bei 2f, 3f und darüber wiederholen sich immer noch im Takt von f.",
      },
      {
        title: "Einen Ton ohne ungerade Teiltöne formen",
        text: "Wähle den Sägezahn, wechsle dann bei 8 Harmonischen in den Modus «eigene», setz k1, k3, k5 und k7 auf 0 und lass die geraden Teiltöne stehen. Der verbleibende Stapel 2f, 4f, 6f, 8f ist selbst eine Obertonreihe über 2f, die Tonhöhe springt also eine Oktave nach oben.",
      },
    ],
  },
};
