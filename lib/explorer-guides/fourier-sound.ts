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

// The same in every locale.
const SERIES_FORMULA = "s(t) = \\sum_{k=1}^{N} a_k \\sin(2\\pi k f t)";

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
        formula: SERIES_FORMULA,
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
        formula: SERIES_FORMULA,
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
  es: {
    metaDescription:
      "Escucha una serie de Fourier: hasta 32 armónicos forman tonos cuadrados, de sierra, triangulares y de pulso en tu navegador, con osciloscopio en vivo.",
    heading: "Cómo funciona este laboratorio de sonido",
    intro:
      "Esta sala convierte la serie de Fourier en sonido. Cada armónico es un oscilador real que funciona en tu navegador, afinado a un múltiplo entero de la frecuencia base, y el tono que oyes es su suma. El lienzo superior es un osciloscopio que muestra la señal de audio real, y el inferior muestra la receta de amplitudes que está sonando. Cambia la receta y oirás cambiar el timbre mientras la altura se queda donde está.",
    sections: [
      {
        heading: "La altura viene de la fundamental, el color de los armónicos",
        paragraphs: [
          "Un tono musical estable se repite muchas veces por segundo. La idea de Fourier dice que cualquier señal repetitiva de ese tipo es una suma de ondas senoidales a la frecuencia de repetición f y a sus múltiplos enteros 2f, 3f, 4f y así sucesivamente. La más grave, la fundamental, fija en gran medida la altura que oyes. Las intensidades relativas de las demás, los armónicos o parciales, fijan el color del sonido, y por eso es fácil distinguir una flauta de un violín que tocan la misma nota.",
          "Las recetas de aquí son las series de Fourier clásicas. La onda cuadrada usa solo armónicos impares con amplitudes que decaen como 1/k, lo que le da un sonido hueco que a menudo se compara con el de un clarinete. El diente de sierra usa todos los armónicos, que también decaen como 1/k, y suena brillante y zumbón. La triangular usa armónicos impares que decaen como 1/k², así que sus parciales altos se apagan enseguida y suena suave, cercana a un seno puro. El pulso pasa un cuarto de cada periodo en su nivel alto; sus amplitudes siguen sin(πk/4)/k, de modo que falta uno de cada cuatro armónicos.",
        ],
        formula: SERIES_FORMULA,
      },
      {
        heading: "Qué hacen los controles",
        paragraphs: [
          "«start audio» crea el motor de sonido; los navegadores solo permiten que una página suene después de que hagas clic en algo, así que antes no se oye nada. «Master gain» (de 0 a 0,4, por defecto 0,2) fija el volumen general. «Base frequency» va de 55 a 880 Hz, por defecto 220 Hz, el la que está por debajo del do central.",
          "«Target wave» elige la receta: cuadrada («Square», la opción por defecto), diente de sierra («Sawtooth»), triangular («Triangle») o un pulso del 25 % («Pulse 25%»). «Harmonics» fija cuántos parciales están activos, de 1 a 32, con atajos para 1, 3, 8 y 24; con 1 oyes un seno puro sea cual sea el objetivo. «Partial amplitudes» muestra los ocho primeros coeficientes. En modo «auto» siguen al objetivo; cambia a «custom» y cada uno recibe un deslizador de −1,3 a 1,3. En modo «custom» solo suenan estos ocho parciales: todo lo que queda por encima de k = 8 se silencia, aunque «Harmonics» esté más alto.",
          "«Sweep frequency» desliza la fundamental entre 110 y 660 Hz siguiendo un seno lento con un periodo de cinco segundos, y toda la pila de armónicos se mueve con ella.",
        ],
      },
      {
        heading: "Cómo está construido",
        paragraphs: [
          "Al pulsar el inicio se construye un grafo de Web Audio: para cada uno de los 32 armónicos, un OscillatorNode de seno y otro de coseno, cada uno con su propio GainNode, todos conectados a una ganancia maestra y a un AnalyserNode. Los 64 osciladores funcionan de manera continua; los inactivos simplemente tienen ganancia 0. Cada cambio pasa por la actualización de abajo. Las amplitudes se dividen entre la suma de sus valores absolutos. Los parciales están enganchados en fase y pueden alcanzar todos su máximo en el mismo instante, y con este escalado incluso ese caso extremo se mantiene dentro del intervalo de −1 a 1, de modo que ninguna receta ni ninguna posición de los deslizadores puede saturar. Todos los cambios usan setTargetAtTime con una constante de tiempo de 0,04 segundos, que suaviza los escalones convirtiéndolos en deslizamientos cortos y evita los chasquidos.",
          "Como todos los osciladores se deslizan con la misma constante de tiempo, el parcial k se mantiene exactamente en k veces la fundamental incluso mientras la frecuencia se mueve, así que la pila sigue siendo armónica durante los barridos. Al detener el audio, la ganancia maestra se desvanece hasta el silencio y el contexto de audio se cierra un momento después.",
          "El osciloscopio lee 2048 muestras en el dominio del tiempo del analizador en cada fotograma de animación y dibuja unos dos periodos y medio de la fundamental. El gráfico de barras de debajo se dibuja a partir de la receta de coeficientes, no se mide en el audio: las barras cian son coeficientes positivos y las rosas, negativos. Si tu sistema pide movimiento reducido, el trazo en vivo se sustituye por una forma de onda fija calculada a partir de la receta, que solo se redibuja cuando cambias algo.",
        ],
        code: AUDIO_EXCERPT,
      },
      {
        heading: "Por qué la fase apenas se oye",
        paragraphs: [
          "La cuadrada, el diente de sierra y la triangular se pueden escribir solo con senos. El pulso no: centrado en t = 0 tiene simetría especular, y su serie está formada por cosenos. Por eso cada armónico tiene un gemelo coseno, y la receta del pulso suena con ellos. Pon las mismas amplitudes en senos y la curva cambia por completo, con picos afilados y sin niveles planos. Aun así, como tono estable sonaría casi igual para la mayoría de los oídos, porque nuestra audición presta mucha atención a qué frecuencias están presentes y con qué intensidad, y mucha menos a cómo se alinean sus fases. El diente de sierra te permite comprobarlo: invierte los signos de sus parciales pares y la rampa ascendente pasa a ser descendente, sin que cambie ninguna amplitud.",
        ],
      },
    ],
    experimentsHeading: "Prueba esto",
    experiments: [
      {
        title: "Construye una onda cuadrada de oído",
        text: "Elige «Square», inicia el audio y pulsa 1: un seno puro, parecido a una flauta. Luego pulsa 3, 8 y 24. La altura no cambia nunca, pero cada paso añade armónicos impares y el tono se vuelve más hueco y nasal, mientras el trazo del osciloscopio se aplana hasta formar un cuadrado.",
      },
      {
        title: "El mismo sonido, otra forma",
        text: "Elige «Sawtooth» con 8 armónicos y cambia a «custom». Los deslizadores k2, k4, k6 y k8 son negativos: arrástralos a 0,32; 0,16; 0,11 y 0,08, los mismos tamaños con signo más. La rampa del osciloscopio ahora baja en lugar de subir. Escucha si notas alguna diferencia en el sonido.",
      },
      {
        title: "Quita la fundamental",
        text: "Elige «Sawtooth», pon «Harmonics» en 8, cambia «Partial amplitudes» a «custom» y arrastra k1 a 0. El tono se vuelve más delgado, pero la mayoría de quienes escuchan sigue oyendo la misma altura, porque los parciales que quedan en 2f, 3f y superiores siguen repitiéndose al ritmo de f.",
      },
      {
        title: "Esculpe un tono sin impares",
        text: "Elige «Sawtooth», cambia al modo «custom» con 8 armónicos, pon k1, k3, k5 y k7 en 0 y conserva los parciales pares. La pila restante 2f, 4f, 6f, 8f es a su vez una serie armónica sobre 2f, así que la altura sube una octava.",
      },
    ],
  },
  fr: {
    metaDescription:
      "Écoute une série de Fourier : jusqu'à 32 harmoniques construisent des sons carrés, en dents de scie, triangulaires et à impulsions, avec oscilloscope.",
    heading: "Comment fonctionne ce laboratoire sonore",
    intro:
      "Cette salle transforme la série de Fourier en son. Chaque harmonique est un véritable oscillateur qui tourne dans ton navigateur, accordé sur un multiple entier de la fréquence de base, et le son que tu entends est leur somme. Le canevas du haut est un oscilloscope qui montre le signal audio réel, celui du bas montre la recette d'amplitudes en cours de lecture. Change la recette et tu entends le timbre changer alors que la hauteur ne bouge pas.",
    sections: [
      {
        heading: "La hauteur vient de la fondamentale, la couleur des harmoniques",
        paragraphs: [
          "Un son musical stable se répète de nombreuses fois par seconde. L'idée de Fourier dit que tout signal répétitif de ce genre est une somme d'ondes sinusoïdales à la fréquence de répétition f et à ses multiples entiers 2f, 3f, 4f et ainsi de suite. La plus grave, la fondamentale, fixe pour l'essentiel la hauteur que tu entends. Les intensités relatives des autres, les harmoniques ou partiels, fixent la couleur du son, et c'est pourquoi une flûte et un violon jouant la même note se distinguent facilement.",
          "Les recettes proposées ici sont les séries de Fourier classiques. L'onde carrée n'utilise que les harmoniques impaires, avec des amplitudes qui décroissent en 1/k, ce qui lui donne un son creux souvent comparé à celui d'une clarinette. La dent de scie utilise toutes les harmoniques, elles aussi en 1/k, et sonne brillante et bourdonnante. Le triangle utilise les harmoniques impaires en 1/k², si bien que ses partiels aigus s'éteignent vite et qu'il sonne doux, proche d'une sinusoïde pure. L'impulsion passe un quart de chaque période à son niveau haut ; ses amplitudes suivent sin(πk/4)/k, donc une harmonique sur quatre manque.",
        ],
        formula: SERIES_FORMULA,
      },
      {
        heading: "À quoi servent les commandes",
        paragraphs: [
          "« start audio » crée le moteur sonore ; les navigateurs n'autorisent une page à émettre du son qu'après un clic, donc rien ne joue avant. « Master gain » (de 0 à 0,4 ; 0,2 par défaut) règle le volume général. « Base frequency » va de 55 à 880 Hz, 220 Hz par défaut, le la situé sous le do central.",
          "« Target wave » choisit la recette : carré (« Square », le choix par défaut), dent de scie (« Sawtooth »), triangle (« Triangle ») ou une impulsion à 25 % (« Pulse 25% »). « Harmonics » fixe le nombre de partiels actifs, de 1 à 32, avec des raccourcis pour 1, 3, 8 et 24 ; à 1, tu entends une sinusoïde pure quelle que soit la cible. « Partial amplitudes » affiche les huit premiers coefficients. En mode « auto », ils suivent la cible ; passe à « custom » et chacun reçoit un curseur de −1,3 à 1,3. En mode « custom », seuls ces huit partiels sonnent : tout ce qui dépasse k = 8 est réduit au silence, même si « Harmonics » est réglé plus haut.",
          "« Sweep frequency » fait glisser la fondamentale entre 110 et 660 Hz selon une sinusoïde lente d'une période de cinq secondes, et tout l'empilement d'harmoniques se déplace avec elle.",
        ],
      },
      {
        heading: "Comment c'est construit",
        paragraphs: [
          "Appuyer sur le démarrage construit un graphe Web Audio : pour chacune des 32 harmoniques, un OscillatorNode en sinus et un en cosinus, chacun avec son propre GainNode, tous reliés à un gain maître et à un AnalyserNode. Les 64 oscillateurs tournent en permanence ; les inactifs ont simplement un gain de 0. Chaque changement passe par la mise à jour ci-dessous. Les amplitudes sont divisées par la somme de leurs valeurs absolues. Les partiels sont verrouillés en phase et peuvent tous atteindre leur maximum au même instant, et avec cette mise à l'échelle même ce pire cas reste dans l'intervalle de −1 à 1, si bien qu'aucune recette ni aucun réglage de curseur ne peut saturer. Tous les changements utilisent setTargetAtTime avec une constante de temps de 0,04 seconde, ce qui adoucit les marches en courts glissements et évite les clics.",
          "Comme tous les oscillateurs glissent avec la même constante de temps, le partiel k reste exactement à k fois la fondamentale même pendant que la fréquence bouge : l'empilement reste donc harmonique pendant les balayages. L'arrêt fait descendre le gain maître jusqu'au silence et ferme le contexte audio un instant plus tard.",
          "L'oscilloscope lit 2 048 échantillons temporels de l'analyseur à chaque image de l'animation et trace environ deux périodes et demie de la fondamentale. Le diagramme en barres placé dessous est dessiné à partir de la recette de coefficients, et non mesuré sur l'audio : les barres cyan sont des coefficients positifs, les barres roses des coefficients négatifs. Si ton système demande la réduction des animations, la trace en direct est remplacée par une forme d'onde fixe calculée à partir de la recette, redessinée uniquement quand tu changes quelque chose.",
        ],
        code: AUDIO_EXCERPT,
      },
      {
        heading: "Pourquoi la phase s'entend si mal",
        paragraphs: [
          "Le carré, la dent de scie et le triangle peuvent s'écrire uniquement avec des sinus. Pas l'impulsion : centrée sur t = 0, elle est symétrique comme dans un miroir, et sa série est faite de cosinus. C'est pourquoi chaque harmonique a un jumeau en cosinus, et la recette de l'impulsion joue sur ceux-là. Mets les mêmes amplitudes sur des sinus et la courbe change du tout au tout, avec des pics aigus et plus aucun palier. Pourtant, en son tenu, elle sonnerait presque pareil pour la plupart des oreilles, parce que notre ouïe prête une grande attention aux fréquences présentes et à leur intensité, et bien moins à la façon dont leurs phases s'alignent. La dent de scie te permet de le vérifier : inverse le signe de ses partiels pairs et la rampe montante devient descendante, sans qu'aucune amplitude change.",
        ],
      },
    ],
    experimentsHeading: "À essayer",
    experiments: [
      {
        title: "Construis une onde carrée à l'oreille",
        text: "Choisis « Square », démarre l'audio et appuie sur 1 : une sinusoïde pure, proche d'une flûte. Appuie ensuite sur 3, 8 et 24. La hauteur ne change jamais, mais chaque étape ajoute des harmoniques impaires et le son devient plus creux et plus nasillard, pendant que la trace de l'oscilloscope s'aplatit en créneau.",
      },
      {
        title: "Même son, autre forme",
        text: "Choisis « Sawtooth » avec 8 harmoniques et passe à « custom ». Les curseurs k2, k4, k6 et k8 sont négatifs : amène-les à 0,32 ; 0,16 ; 0,11 et 0,08, les mêmes grandeurs avec un signe plus. La rampe de l'oscilloscope descend maintenant au lieu de monter. Écoute s'il y a une différence dans le son.",
      },
      {
        title: "Retire la fondamentale",
        text: "Choisis « Sawtooth », règle « Harmonics » sur 8, passe « Partial amplitudes » en « custom » et amène k1 à 0. Le son s'amincit, et pourtant la plupart des gens entendent toujours la même hauteur, parce que les partiels restants à 2f, 3f et au-delà se répètent encore au rythme de f.",
      },
      {
        title: "Sculpte un son sans harmoniques impaires",
        text: "Choisis « Sawtooth », puis passe en mode « custom » avec 8 harmoniques, mets k1, k3, k5 et k7 à 0 et garde les partiels pairs. L'empilement restant 2f, 4f, 6f, 8f est lui-même une série harmonique sur 2f, donc la hauteur grimpe d'une octave.",
      },
    ],
  },
  it: {
    metaDescription:
      "Ascolta una serie di Fourier: fino a 32 armoniche costruiscono suoni a onda quadra, dente di sega, triangolare e a impulso, con oscilloscopio dal vivo.",
    heading: "Come funziona questo laboratorio sonoro",
    intro:
      "Questa stanza trasforma la serie di Fourier in suono. Ogni armonica è un vero oscillatore che gira nel tuo browser, accordato su un multiplo intero della frequenza di base, e il suono che senti è la loro somma. Il canvas in alto è un oscilloscopio che mostra il segnale audio reale, quello in basso mostra la ricetta di ampiezze in riproduzione. Cambia la ricetta e senti cambiare il timbro mentre l'altezza resta dov'è.",
    sections: [
      {
        heading: "L'altezza dalla fondamentale, il colore dalle armoniche",
        paragraphs: [
          "Un suono musicale stabile si ripete molte volte al secondo. L'intuizione di Fourier dice che ogni segnale ripetitivo di questo tipo è una somma di onde sinusoidali alla frequenza di ripetizione f e ai suoi multipli interi 2f, 3f, 4f e così via. La più bassa, la fondamentale, stabilisce in gran parte l'altezza che senti. Le intensità relative delle altre, le armoniche o parziali, stabiliscono il colore del suono, ed è per questo che un flauto e un violino che suonano la stessa nota si distinguono facilmente.",
          "Le ricette qui sono le classiche serie di Fourier. L'onda quadra usa solo armoniche dispari con ampiezze che calano come 1/k, il che le dà un suono cavo spesso paragonato a quello di un clarinetto. Il dente di sega usa tutte le armoniche, anch'esse in calo come 1/k, e suona brillante e ronzante. La triangolare usa armoniche dispari che calano come 1/k², quindi i suoi parziali alti svaniscono in fretta e suona morbida, vicina a una sinusoide pura. L'impulso passa un quarto di ogni periodo al livello alto; le sue ampiezze seguono sin(πk/4)/k, quindi manca un'armonica ogni quattro.",
        ],
        formula: SERIES_FORMULA,
      },
      {
        heading: "Che cosa fanno i controlli",
        paragraphs: [
          "«start audio» crea il motore sonoro; i browser permettono a una pagina di emettere suoni solo dopo un tuo clic, quindi prima non si sente nulla. «Master gain» (da 0 a 0,4, predefinito 0,2) imposta il volume generale. «Base frequency» va da 55 a 880 Hz, predefinito 220 Hz, il la sotto il do centrale.",
          "«Target wave» sceglie la ricetta: quadra («Square», la scelta predefinita), dente di sega («Sawtooth»), triangolare («Triangle») o un impulso al 25 % («Pulse 25%»). «Harmonics» stabilisce quanti parziali sono attivi, da 1 a 32, con scorciatoie per 1, 3, 8 e 24; con 1 senti una sinusoide pura qualunque sia il bersaglio. «Partial amplitudes» mostra i primi otto coefficienti. In modalità «auto» seguono il bersaglio; passa a «custom» e ciascuno riceve un cursore da −1,3 a 1,3. In modalità «custom» suonano solo questi otto parziali: tutto ciò che sta sopra k = 8 viene silenziato, anche se «Harmonics» è impostato più in alto.",
          "«Sweep frequency» fa scivolare la fondamentale tra 110 e 660 Hz seguendo una sinusoide lenta con un periodo di cinque secondi, e l'intera pila di armoniche la segue.",
        ],
      },
      {
        heading: "Com'è costruito",
        paragraphs: [
          "Premendo l'avvio si costruisce un grafo Web Audio: per ciascuna delle 32 armoniche un OscillatorNode seno e uno coseno, ognuno con il proprio GainNode, tutti collegati a un guadagno master e a un AnalyserNode. Tutti i 64 oscillatori girano di continuo; quelli inattivi hanno semplicemente guadagno 0. Ogni modifica passa per l'aggiornamento qui sotto. Le ampiezze vengono divise per la somma dei loro valori assoluti. I parziali sono agganciati in fase e possono raggiungere tutti il picco nello stesso istante, e con questa scalatura anche quel caso peggiore resta nell'intervallo da −1 a 1, quindi nessuna ricetta e nessuna posizione dei cursori può andare in clipping. Tutte le modifiche usano setTargetAtTime con una costante di tempo di 0,04 secondi, che ammorbidisce i gradini in brevi scivolamenti ed evita i clic.",
          "Poiché ogni oscillatore scivola con la stessa costante di tempo, il parziale k resta esattamente a k volte la fondamentale anche mentre la frequenza si muove, quindi la pila rimane armonica durante le scansioni. L'arresto porta il master al silenzio in dissolvenza e chiude il contesto audio un attimo dopo.",
          "L'oscilloscopio legge 2048 campioni nel dominio del tempo dall'analizzatore a ogni fotogramma dell'animazione e disegna circa due periodi e mezzo della fondamentale. Il grafico a barre sottostante è disegnato a partire dalla ricetta dei coefficienti, non misurato sull'audio: le barre ciano sono coefficienti positivi, quelle rosa negativi. Se il tuo sistema chiede il movimento ridotto, la traccia dal vivo è sostituita da una forma d'onda fissa calcolata dalla ricetta, ridisegnata solo quando cambi qualcosa.",
        ],
        code: AUDIO_EXCERPT,
      },
      {
        heading: "Perché la fase si sente così poco",
        paragraphs: [
          "Quadra, dente di sega e triangolare si possono scrivere con i soli seni. L'impulso no: centrato su t = 0 ha simmetria speculare, e la sua serie è fatta di coseni. Ecco perché ogni armonica ha un gemello coseno, e la ricetta dell'impulso suona su quelli. Metti le stesse ampiezze sui seni e la curva cambia completamente, con punte acuminate e nessun livello piatto. Eppure come suono tenuto risulterebbe quasi identico per la maggior parte delle orecchie, perché il nostro udito presta molta attenzione a quali frequenze sono presenti e a quanto sono intense, e molta meno a come si allineano le loro fasi. Il dente di sega ti permette di verificarlo: inverti i segni dei suoi parziali pari e la rampa in salita diventa in discesa, senza che cambi alcuna ampiezza.",
        ],
      },
    ],
    experimentsHeading: "Prova così",
    experiments: [
      {
        title: "Costruisci un'onda quadra a orecchio",
        text: "Scegli «Square», avvia l'audio e premi 1: una sinusoide pura, simile a un flauto. Poi premi 3, 8 e 24. L'altezza non cambia mai, ma ogni passo aggiunge armoniche dispari e il suono diventa più cavo e nasale, mentre la traccia dell'oscilloscopio si appiattisce in un'onda quadra.",
      },
      {
        title: "Stesso suono, forma diversa",
        text: "Scegli «Sawtooth» con 8 armoniche e passa a «custom». I cursori k2, k4, k6 e k8 sono negativi: trascinali a 0,32, 0,16, 0,11 e 0,08, le stesse grandezze con il segno più. La rampa sull'oscilloscopio ora scende invece di salire. Ascolta se cambia qualcosa nel suono.",
      },
      {
        title: "Togli la fondamentale",
        text: "Scegli «Sawtooth», imposta «Harmonics» a 8, porta «Partial amplitudes» su «custom» e trascina k1 a 0. Il suono si assottiglia, eppure la maggior parte di chi ascolta sente ancora la stessa altezza, perché i parziali rimasti a 2f, 3f e oltre continuano a ripetersi al ritmo di f.",
      },
      {
        title: "Scolpisci un suono senza dispari",
        text: "Scegli «Sawtooth», poi passa alla modalità «custom» con 8 armoniche, imposta k1, k3, k5 e k7 a 0 e tieni i parziali pari. La pila rimasta 2f, 4f, 6f, 8f è a sua volta una serie armonica su 2f, quindi l'altezza sale di un'ottava.",
      },
    ],
  },
  pt: {
    metaDescription:
      "Ouve uma série de Fourier: até 32 harmónicos constroem sons de onda quadrada, dente de serra, triangular e de impulso no navegador, com osciloscópio ao vivo.",
    heading: "Como funciona este laboratório de som",
    intro:
      "Esta sala transforma a série de Fourier em som. Cada harmónico é um oscilador verdadeiro a correr no teu navegador, afinado para um múltiplo inteiro da frequência base, e o som que ouves é a soma de todos. O canvas de cima é um osciloscópio que mostra o sinal de áudio real, o de baixo mostra a receita de amplitudes que está a tocar. Muda a receita e ouves o timbre mudar enquanto a altura fica onde está.",
    sections: [
      {
        heading: "A altura vem da fundamental, a cor vem dos harmónicos",
        paragraphs: [
          "Um som musical estável repete-se muitas vezes por segundo. A ideia de Fourier diz que qualquer sinal repetitivo deste género é uma soma de ondas sinusoidais na frequência de repetição f e nos seus múltiplos inteiros 2f, 3f, 4f e assim por diante. A mais grave, a fundamental, define em grande parte a altura que ouves. As intensidades relativas das outras, os harmónicos ou parciais, definem a cor do som, e é por isso que é fácil distinguir uma flauta de um violino a tocar a mesma nota.",
          "As receitas aqui são as séries de Fourier clássicas. A onda quadrada usa só harmónicos ímpares com amplitudes que decaem como 1/k, o que lhe dá um som oco, muitas vezes comparado ao de um clarinete. O dente de serra usa todos os harmónicos, também a decair como 1/k, e soa brilhante, com um zumbido. A triangular usa harmónicos ímpares que decaem como 1/k², pelo que os parciais mais altos se apagam depressa e soa suave, próxima de um seno puro. O impulso passa um quarto de cada período no nível alto; as suas amplitudes seguem sen(πk/4)/k, por isso falta um harmónico em cada quatro.",
        ],
        formula: SERIES_FORMULA,
      },
      {
        heading: "O que fazem os controlos",
        paragraphs: [
          "«start audio» cria o motor de som; os navegadores só deixam uma página fazer som depois de clicares em alguma coisa, por isso antes disso nada toca. «Master gain» (de 0 a 0,4, 0,2 por omissão) define o volume geral. «Base frequency» vai de 55 a 880 Hz, 220 Hz por omissão, o lá abaixo do dó central.",
          "«Target wave» escolhe a receita: quadrada («Square», a opção por omissão), dente de serra («Sawtooth»), triangular («Triangle») ou um impulso de 25 % («Pulse 25%»). «Harmonics» define quantos parciais estão ativos, de 1 a 32, com atalhos para 1, 3, 8 e 24; com 1 ouves um seno puro seja qual for o alvo. «Partial amplitudes» mostra os primeiros oito coeficientes. No modo «auto» seguem o alvo; muda para «custom» e cada um recebe um cursor de −1,3 a 1,3. No modo «custom» só soam estes oito parciais: tudo o que está acima de k = 8 é silenciado, mesmo com «Harmonics» mais alto.",
          "«Sweep frequency» faz deslizar a fundamental entre 110 e 660 Hz segundo um seno lento com um período de cinco segundos, e toda a pilha de harmónicos se move com ela.",
        ],
      },
      {
        heading: "Como está construído",
        paragraphs: [
          "Carregar em «start audio» constrói um grafo Web Audio: para cada um dos 32 harmónicos, um OscillatorNode de seno e outro de cosseno, cada um com o seu próprio GainNode, todos ligados a um ganho principal e a um AnalyserNode. Os 64 osciladores correm continuamente; os inativos têm simplesmente ganho 0. Todas as alterações passam pela atualização abaixo. As amplitudes são divididas pela soma dos seus valores absolutos. Os parciais estão sincronizados em fase e podem atingir todos o pico no mesmo instante, e com esta escala até esse pior caso fica dentro do intervalo de −1 a 1, pelo que nenhuma receita e nenhuma posição dos cursores pode saturar. Todas as alterações usam setTargetAtTime com uma constante de tempo de 0,04 segundos, que suaviza os degraus em deslizamentos curtos e evita estalidos.",
          "Como todos os osciladores deslizam com a mesma constante de tempo, o parcial k fica exatamente em k vezes a fundamental mesmo enquanto a frequência se move, por isso a pilha mantém-se harmónica durante os varrimentos. Parar faz o ganho principal desvanecer até ao silêncio e fecha o contexto de áudio um momento depois.",
          "O osciloscópio lê 2048 amostras no domínio do tempo do analisador em cada fotograma da animação e desenha cerca de dois períodos e meio da fundamental. O gráfico de barras por baixo é desenhado a partir da receita de coeficientes, não medido no áudio: as barras ciano são coeficientes positivos, as cor-de-rosa são negativos. Se o teu sistema pedir movimento reduzido, o traço ao vivo é substituído por uma forma de onda fixa calculada a partir da receita, redesenhada só quando mudas alguma coisa.",
        ],
        code: AUDIO_EXCERPT,
      },
      {
        heading: "Porque é que a fase quase não se ouve",
        paragraphs: [
          "A quadrada, o dente de serra e a triangular podem escrever-se só com senos. O impulso não: centrado em t = 0 tem simetria de espelho, e a sua série é feita de cossenos. É por isso que cada harmónico tem um gémeo cosseno, e a receita do impulso toca nesses. Põe as mesmas amplitudes em senos e a curva muda por completo, com picos aguçados e sem patamares. No entanto, como som sustentado soaria quase igual para a maioria dos ouvidos, porque a nossa audição dá muita atenção às frequências que estão presentes e à sua intensidade, e muito menos à maneira como as fases se alinham. O dente de serra permite-te testar isto: inverte os sinais dos seus parciais pares e a rampa ascendente passa a descendente, sem que nenhuma amplitude mude.",
        ],
      },
    ],
    experimentsHeading: "Experimenta isto",
    experiments: [
      {
        title: "Constrói uma onda quadrada de ouvido",
        text: "Escolhe «Square», inicia o áudio e carrega em 1: um seno puro, parecido com uma flauta. Depois carrega em 3, 8 e 24. A altura nunca muda, mas cada passo acrescenta harmónicos ímpares e o som fica mais oco e anasalado, enquanto o traço do osciloscópio se achata até formar um quadrado.",
      },
      {
        title: "O mesmo som, outra forma",
        text: "Escolhe «Sawtooth» com 8 harmónicos e muda para «custom». Os cursores k2, k4, k6 e k8 são negativos: arrasta-os para 0,32, 0,16, 0,11 e 0,08, os mesmos tamanhos com sinal de mais. A rampa no osciloscópio agora desce em vez de subir. Ouve se há alguma diferença no som.",
      },
      {
        title: "Tira a fundamental",
        text: "Escolhe «Sawtooth», põe «Harmonics» em 8, muda «Partial amplitudes» para «custom» e arrasta k1 para 0. O som fica mais fino, mas a maioria das pessoas continua a ouvir a mesma altura, porque os parciais que restam em 2f, 3f e acima continuam a repetir-se ao ritmo de f.",
      },
      {
        title: "Esculpe um som sem ímpares",
        text: "Escolhe «Sawtooth», depois muda para o modo «custom» com 8 harmónicos, põe k1, k3, k5 e k7 em 0 e mantém os parciais pares. A pilha que resta, 2f, 4f, 6f, 8f, é ela própria uma série harmónica sobre 2f, por isso a altura sobe uma oitava.",
      },
    ],
  },
  sv: {
    metaDescription:
      "Lyssna på en Fourierserie: upp till 32 övertoner bygger fyrkants-, sågtands-, triangel- och pulstoner i webbläsaren, med oscilloskop live och egna deltoner.",
    heading: "Så fungerar det här ljudlabbet",
    intro:
      "Det här rummet gör Fourierserien till ljud. Varje överton är en riktig oscillator som körs i din webbläsare, stämd till en hel multipel av basfrekvensen, och tonen du hör är summan av dem. Den övre ytan är ett oscilloskop som visar den faktiska ljudsignalen, den nedre visar amplitudreceptet som spelas. Ändra receptet, så hör du klangfärgen ändras medan tonhöjden ligger kvar.",
    sections: [
      {
        heading: "Tonhöjd från grundtonen, färg från övertonerna",
        paragraphs: [
          "En stadig musikalisk ton upprepar sig många gånger per sekund. Fouriers insikt säger att varje sådan upprepad signal är en summa av sinusvågor vid upprepningsfrekvensen f och dess hela multipler 2f, 3f, 4f och så vidare. Den lägsta, grundtonen, bestämmer till största delen tonhöjden du hör. De övrigas relativa styrkor, övertonerna eller deltonerna, bestämmer ljudets färg, och det är därför det är lätt att skilja en flöjt från en fiol som spelar samma ton.",
          "Recepten här är de klassiska Fourierserierna. Fyrkantsvågen använder bara udda övertoner med amplituder som avtar som 1/k, vilket ger den en ihålig klang som ofta jämförs med en klarinett. Sågtandsvågen använder alla övertoner, som också avtar som 1/k, och låter ljus och surrande. Triangelvågen använder udda övertoner som avtar som 1/k², så dess högre deltoner klingar av snabbt och den låter mjuk, nära en ren sinuston. Pulsen tillbringar en fjärdedel av varje period på sin höga nivå. Dess amplituder följer sin(πk/4)/k, så var fjärde överton saknas.",
        ],
        formula: SERIES_FORMULA,
      },
      {
        heading: "Vad reglagen gör",
        paragraphs: [
          "”start audio” skapar ljudmotorn. Webbläsare låter en sida ge ifrån sig ljud först efter att du har klickat på något, så ingenting spelas före det. ”Master gain” (0 till 0,4, standard 0,2) anger den totala volymen. ”Base frequency” går från 55 till 880 Hz, standard 220 Hz, a under ettstrukna c.",
          "”Target wave” väljer receptet: fyrkant (”Square”, standard), sågtand (”Sawtooth”), triangel (”Triangle”) eller en puls på 25 % (”Pulse 25%”). ”Harmonics” anger hur många deltoner som är aktiva, från 1 till 32, med genvägar för 1, 3, 8 och 24. Vid 1 hör du en ren sinuston oavsett mål. ”Partial amplitudes” visar de åtta första koefficienterna. I läget ”auto” följer de målet. Byt till ”custom”, så får var och en ett reglage från −1,3 till 1,3. I läget ”custom” ljuder bara dessa åtta deltoner: allt över k = 8 tystas, även om ”Harmonics” står högre.",
          "”Sweep frequency” låter grundtonen glida mellan 110 och 660 Hz i en långsam sinus med en period på fem sekunder, och hela övertonsstapeln följer med.",
        ],
      },
      {
        heading: "Hur det är byggt",
        paragraphs: [
          "När du trycker på start byggs en Web Audio-graf: för var och en av de 32 övertonerna en OscillatorNode för sinus och en för cosinus, var och en med sin egen GainNode, som alla matar en huvudförstärkning och en AnalyserNode. Alla 64 oscillatorerna går hela tiden. De inaktiva har helt enkelt förstärkningen 0. Varje ändring går genom uppdateringen nedan. Amplituderna divideras med summan av sina absolutbelopp. Deltonerna är faslåsta och kan alla nå sin topp i samma ögonblick, och med den här skalningen håller sig även det värsta fallet inom intervallet −1 till 1, så inget recept och ingen reglageinställning kan klippa. Alla ändringar använder setTargetAtTime med en tidskonstant på 0,04 sekunder, vilket jämnar ut steg till korta glidningar och undviker klick.",
          "Eftersom varje oscillator glider med samma tidskonstant ligger delton k kvar på exakt k gånger grundtonen även medan frekvensen rör sig, så stapeln förblir harmonisk under svepen. När du stoppar tonas huvudförstärkningen ner till tystnad och ljudkontexten stängs ett ögonblick senare.",
          "Oscilloskopet läser 2048 sampel i tidsdomänen från analysatorn varje animationsbildruta och ritar ungefär två och en halv perioder av grundtonen. Stapeldiagrammet under ritas utifrån koefficientreceptet, det mäts inte ur ljudet: cyanfärgade staplar är positiva koefficienter, rosa är negativa. Om ditt system begär minskad rörelse ersätts den levande kurvan av en stillastående vågform som beräknas ur receptet och bara ritas om när du ändrar något.",
        ],
        code: AUDIO_EXCERPT,
      },
      {
        heading: "Varför fasen är svår att höra",
        paragraphs: [
          "Fyrkant, sågtand och triangel kan skrivas med enbart sinustermer. Det kan inte pulsen: centrerad kring t = 0 är den spegelsymmetrisk, och dess serie består av cosinustermer. Därför har varje överton en cosinustvilling, och pulsreceptet spelas på dem. Lägg samma amplituder på sinus i stället, så ändras kurvan helt, med vassa spikar och inga platta nivåer. Ändå skulle den som stadig ton låta nästan likadant för de flesta öron, eftersom vår hörsel är mycket uppmärksam på vilka frekvenser som finns och hur starka de är, och betydligt mindre på hur deras faser ligger i förhållande till varandra. Sågtanden låter dig pröva det: byt tecken på dess jämna deltoner, så blir den stigande rampen en fallande, utan att någon amplitud ändras.",
        ],
      },
    ],
    experimentsHeading: "Prova det här",
    experiments: [
      {
        title: "Bygg en fyrkantsvåg på gehör",
        text: "Välj ”Square”, starta ljudet och tryck på 1: en ren, flöjtlik sinuston. Tryck sedan på 3, 8 och 24. Tonhöjden ändras aldrig, men varje steg lägger till udda övertoner och tonen blir mer ihålig och nasal, medan oscilloskopets kurva plattas till en fyrkant.",
      },
      {
        title: "Samma ljud, annan form",
        text: "Välj ”Sawtooth” med 8 övertoner och byt till ”custom”. Reglagen k2, k4, k6 och k8 är negativa: dra dem till 0,32; 0,16; 0,11 och 0,08, samma storlekar med plustecken. Rampen på oscilloskopet faller nu i stället för att stiga. Lyssna efter någon skillnad i ljudet.",
      },
      {
        title: "Ta bort grundtonen",
        text: "Välj ”Sawtooth”, sätt ”Harmonics” till 8, ställ ”Partial amplitudes” på ”custom” och dra k1 till 0. Tonen blir tunnare, men de flesta som lyssnar hör ändå samma tonhöjd, eftersom de återstående deltonerna vid 2f, 3f och uppåt fortfarande upprepar sig i takten f.",
      },
      {
        title: "Forma en ton utan udda deltoner",
        text: "Välj ”Sawtooth”, byt sedan till läget ”custom” med 8 övertoner, sätt k1, k3, k5 och k7 till 0 och behåll de jämna deltonerna. Den återstående stapeln 2f, 4f, 6f, 8f är själv en övertonsserie på 2f, så tonhöjden hoppar upp en oktav.",
      },
    ],
  },
  no: {
    metaDescription:
      "Hør en Fourier-rekke: Opptil 32 overtoner bygger firkant-, sagtann-, trekant- og pulstoner i nettleseren, med oscilloskop i sanntid og egne deltoner.",
    heading: "Slik fungerer denne lydlaben",
    intro:
      "Dette rommet gjør Fourier-rekken om til lyd. Hver overtone er en ekte oscillator som kjører i nettleseren din, stemt til et helt multiplum av grunnfrekvensen, og tonen du hører, er summen av dem. Det øverste lerretet er et oscilloskop som viser det faktiske lydsignalet, det nederste viser amplitudeoppskriften som spilles. Endre oppskriften, og du hører klangfargen endre seg mens tonehøyden blir liggende.",
    sections: [
      {
        heading: "Tonehøyde fra grunntonen, farge fra overtonene",
        paragraphs: [
          "En jevn musikalsk tone gjentar seg selv mange ganger i sekundet. Fouriers innsikt sier at ethvert slikt gjentatt signal er en sum av sinusbølger ved gjentakelsesfrekvensen f og de hele multiplene 2f, 3f, 4f og så videre. Den laveste, grunntonen, bestemmer for det meste tonehøyden du hører. De relative styrkene til de andre, overtonene eller deltonene, bestemmer fargen på lyden, og derfor er det lett å skille en fløyte fra en fiolin som spiller samme tone.",
          "Oppskriftene her er de klassiske Fourier-rekkene. Firkantbølgen bruker bare odde overtoner med amplituder som avtar som 1/k, noe som gir den en hul klang som ofte sammenlignes med en klarinett. Sagtannbølgen bruker alle overtonene, som også avtar som 1/k, og låter lys og summende. Trekantbølgen bruker odde overtoner som avtar som 1/k², så de høye deltonene dør raskt ut, og den låter myk, nær en ren sinustone. Pulsen tilbringer en fjerdedel av hver periode på det høye nivået. Amplitudene følger sin(πk/4)/k, så hver fjerde overtone mangler.",
        ],
        formula: SERIES_FORMULA,
      },
      {
        heading: "Hva kontrollene gjør",
        paragraphs: [
          "«start audio» oppretter lydmotoren. Nettlesere lar en side lage lyd først etter at du har klikket på noe, så ingenting spilles før det. «Master gain» (0 til 0,4, standard 0,2) setter det samlede volumet. «Base frequency» går fra 55 til 880 Hz, standard 220 Hz, a-en under enstrøken c.",
          "«Target wave» velger oppskriften: firkant («Square», standard), sagtann («Sawtooth»), trekant («Triangle») eller en puls på 25 % («Pulse 25%»). «Harmonics» bestemmer hvor mange deltoner som er aktive, fra 1 til 32, med snarveier for 1, 3, 8 og 24. Ved 1 hører du en ren sinustone uansett mål. «Partial amplitudes» viser de åtte første koeffisientene. I modusen «auto» følger de målet. Bytt til «custom», og hver av dem får en glidebryter fra −1,3 til 1,3. I modusen «custom» lyder bare disse åtte deltonene: Alt over k = 8 dempes helt, selv om «Harmonics» står høyere.",
          "«Sweep frequency» lar grunntonen gli mellom 110 og 660 Hz i en langsom sinus med en periode på fem sekunder, og hele overtonestabelen følger med.",
        ],
      },
      {
        heading: "Slik er den bygget",
        paragraphs: [
          "Når du trykker start, bygges en Web Audio-graf: for hver av de 32 overtonene en OscillatorNode for sinus og en for cosinus, hver med sin egen GainNode, som alle mater en hovedforsterkning og en AnalyserNode. Alle de 64 oscillatorene går kontinuerlig. De inaktive har rett og slett forsterkning 0. Hver endring går gjennom oppdateringen nedenfor. Amplitudene deles på summen av absoluttverdiene sine. Deltonene er faselåst og kan alle nå toppen i samme øyeblikk, og med denne skaleringen holder selv det verste tilfellet seg innenfor intervallet fra −1 til 1, så ingen oppskrift og ingen glidebryterinnstilling kan klippe. Alle endringer bruker setTargetAtTime med en tidskonstant på 0,04 sekunder, noe som jevner ut trinn til korte glidninger og unngår klikk.",
          "Fordi hver oscillator glir med den samme tidskonstanten, blir deltone k liggende på nøyaktig k ganger grunntonen også mens frekvensen beveger seg, så stabelen forblir harmonisk under sveipene. Når du stopper, tones hovedforsterkningen ned til stillhet, og lydkonteksten lukkes et øyeblikk senere.",
          "Oscilloskopet leser 2048 sampler i tidsdomenet fra analysatoren for hvert animasjonsbilde og tegner omtrent to og en halv periode av grunntonen. Søylediagrammet under tegnes ut fra koeffisientoppskriften, det måles ikke fra lyden: Cyanfargede søyler er positive koeffisienter, rosa er negative. Hvis systemet ditt ber om redusert bevegelse, erstattes den levende kurven av en stillestående bølgeform som regnes ut fra oppskriften og bare tegnes på nytt når du endrer noe.",
        ],
        code: AUDIO_EXCERPT,
      },
      {
        heading: "Hvorfor fasen er vanskelig å høre",
        paragraphs: [
          "Firkant, sagtann og trekant kan skrives med bare sinusledd. Det kan ikke pulsen: Sentrert om t = 0 er den speilsymmetrisk, og rekken består av cosinusledd. Derfor har hver overtone en cosinustvilling, og pulsoppskriften spilles på dem. Legg de samme amplitudene på sinus i stedet, og kurven endrer seg fullstendig, med skarpe pigger og ingen flate nivåer. Likevel ville den som jevn tone låte nesten likt for de fleste ører, fordi hørselen vår følger nøye med på hvilke frekvenser som er til stede og hvor sterke de er, og langt mindre på hvordan fasene ligger i forhold til hverandre. Sagtannen lar deg teste dette: Snu fortegnene på de jevne deltonene, og den stigende rampen blir en fallende, uten at noen amplitude endres.",
        ],
      },
    ],
    experimentsHeading: "Prøv dette",
    experiments: [
      {
        title: "Bygg en firkantbølge på gehør",
        text: "Velg «Square», start lyden og trykk 1: en ren, fløyteaktig sinustone. Trykk så 3, 8 og 24. Tonehøyden endrer seg aldri, men hvert steg legger til odde overtoner, og tonen blir hulere og mer nasal, mens kurven på oscilloskopet flater ut til en firkant.",
      },
      {
        title: "Samme lyd, annen form",
        text: "Velg «Sawtooth» med 8 overtoner og bytt til «custom». Glidebryterne k2, k4, k6 og k8 er negative: Dra dem til 0,32; 0,16; 0,11 og 0,08, de samme størrelsene med plusstegn. Rampen på oscilloskopet faller nå i stedet for å stige. Lytt etter om lyden blir annerledes.",
      },
      {
        title: "Fjern grunntonen",
        text: "Velg «Sawtooth», sett «Harmonics» til 8, bytt «Partial amplitudes» til «custom» og dra k1 til 0. Tonen blir tynnere, men de fleste som lytter, hører fortsatt den samme tonehøyden, fordi de gjenværende deltonene ved 2f, 3f og oppover fremdeles gjentar seg i takten f.",
      },
      {
        title: "Form en tone uten odde deltoner",
        text: "Velg «Sawtooth», bytt så til modusen «custom» med 8 overtoner, sett k1, k3, k5 og k7 til 0 og behold de jevne deltonene. Den gjenværende stabelen 2f, 4f, 6f, 8f er selv en overtonerekke på 2f, så tonehøyden hopper opp en oktav.",
      },
    ],
  },
};
