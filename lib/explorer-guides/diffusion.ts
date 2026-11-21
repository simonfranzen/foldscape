import type { ExplorerGuide } from "./types";

// Constants quoted here (32 hidden units, lr 5e-3, 6 batches of 48 per frame,
// 2 reverse steps per frame, 28×28 field, linear β 1e-4 to 0.02, ᾱ_T ≈ 0.67
// at T = 40, 1800 off-screen batches under reduced motion) match app/diffusion/explorer/page.tsx; update both together.
const REVERSE_EXCERPT = `const ab = sched.alphaBar[t];
const abPrev = t === 0 ? 1 : sched.alphaBar[t - 1];
const a = sched.alpha[t];
const b = sched.beta[t];
const coef = (1 - a) / Math.sqrt(1 - ab);
const sigma = t === 0 ? 0 : Math.sqrt(((1 - abPrev) / (1 - ab)) * b);
for (let i = 0; i < numSamples; i++) {
  inp[0] = xs[i * 2];
  inp[1] = xs[i * 2 + 1];
  const out = forward(net, inp).out;          // predicted noise ε_θ
  const meanX = (1 / Math.sqrt(a)) * (xs[i * 2] - coef * out[0]);
  const meanY = (1 / Math.sqrt(a)) * (xs[i * 2 + 1] - coef * out[1]);
  xs[i * 2] = meanX + sigma * (t === 0 ? 0 : randn(rng));
  xs[i * 2 + 1] = meanY + sigma * (t === 0 ? 0 : randn(rng));
}`;

export const DIFFUSION_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Watch a diffusion model train live in your browser: a tiny MLP learns to predict noise on 2D data and DDPM walkers denoise from Gaussian noise onto the shape.",
    heading: "How this explorer works",
    intro:
      "Two things happen at once on this canvas. In the background a very small neural network is being trained to recognise noise. In the foreground, rose-coloured walkers start as a cloud of pure Gaussian noise and use that network, step by step, to walk back onto the cyan data. When they arrive, a fresh cloud is drawn and the walk starts again, so you watch the same model get better from one cohort to the next. This is the same recipe that image diffusion models use, shrunk from millions of pixels to two coordinates.",
    sections: [
      {
        heading: "Noise forward, learning backward",
        paragraphs: [
          "A diffusion model is defined by a forward process that nobody needs to learn: take a data point x₀ and blend it with Gaussian noise ε in T small steps. The schedule ᾱ_t says how much of the original survives at step t, so a noisy sample can be produced in one shot with the formula below. At the last step, ideally, nothing of the data is left.",
          "The network ε_θ gets the noisy point x_t and the time t, and its only job is to guess which ε was mixed in. The loss is simply the squared distance between the guess and the true noise. Once it guesses well, you can run the process backwards: start from pure noise, subtract the predicted noise a little at a time, add back a small amount of fresh randomness, and repeat until t = 0. This reverse chain is the DDPM sampler (denoising diffusion probabilistic model).",
        ],
        formula:
          "x_t = \\sqrt{\\bar\\alpha_t}\\, x_0 + \\sqrt{1 - \\bar\\alpha_t}\\, \\varepsilon, \\qquad \\mathcal{L} = \\big\\lVert \\varepsilon - \\varepsilon_\\theta(x_t, t) \\big\\rVert^2",
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "Dataset picks the target shape: two moons (the default), three Gaussian blobs, or a two-armed spiral. Each holds 256 points. Noise schedule switches between a linear β schedule, where the noise added per step grows evenly from 0.0001 to 0.02, and the cosine ᾱ schedule (the default), which shapes the surviving signal like a quarter cosine so it falls gently at the start and the end.",
          "Diffusion steps T runs from 10 to 120 in steps of 5, default 40. Changing the dataset, the schedule or T throws the network away and trains a new one from scratch, because a model trained for one schedule does not understand another. Walkers (20 to 400, default 160) only changes how many points are sampled; it keeps the trained model. Pause freezes training and sampling, and Reset model restarts training without changing any setting.",
          "The status strip reports a running loss, smoothed with an exponential moving average, and an epoch counter that by convention ticks once every 30 mini-batches.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "There is no machine-learning library here. The score network is written by hand in plain TypeScript: four inputs (x, y, and sin and cos of πt/T as a time embedding), two hidden layers of 32 units with GELU activations, and two outputs. Weights live in Float32Arrays, start with He initialisation from a seeded random generator, and are updated by a hand-written backpropagation and Adam optimiser with learning rate 0.005.",
          "Every animation frame runs six mini-batches of 48 training examples, then moves every walker two reverse steps with the update shown below, which is the standard DDPM step with the posterior variance as noise scale. Every 12 frames the network is evaluated on a 28 × 28 grid at the middle noise level, and the magnitude of its noise prediction, inverted and normalised, is painted as the faint cyan glow. Where the predicted noise is small, the point already looks like data. Each walker keeps an eight-frame trail.",
          "With reduced motion enabled, the animation loop never starts. The network trains off screen for 1,800 mini-batches, the reverse process runs once from noise down to t = 0, and the canvas shows that finished state as a still image. Changing a control produces a new still image, and Pause is disabled.",
        ],
        code: REVERSE_EXCERPT,
      },
      {
        heading: "Why the schedule decides everything",
        paragraphs: [
          "The linear constants 0.0001 and 0.02 come from image models that use around a thousand steps. With only T = 40 steps, multiplying the forty (1 − β) factors together leaves ᾱ_T ≈ 0.67, so the most noisy training example still keeps about 82 percent of its signal amplitude. The sampler, however, always starts from pure noise, a state the network never saw during training. The cosine schedule is built so that ᾱ reaches essentially zero at the last step for any T, which is why it is the default here. Raising T to 120 brings the linear schedule down to ᾱ_T ≈ 0.30, better but still far from pure noise.",
        ],
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "Break the linear schedule",
        text: "Switch to linear β and drop T to 10. Here ᾱ_T is about 0.90, so training never shows the network anything close to pure noise. Watch how the walkers behave compared with cosine at the same T.",
      },
      {
        title: "Watch learning between cohorts",
        text: "Press Reset model with the spiral dataset and watch the first few cohorts. Early walkers wander and miss the arms; after the loss has settled, the same reverse chain traces the spiral much more faithfully.",
      },
      {
        title: "More steps, finer walk",
        text: "Keep cosine and set T to 120. Each cohort now takes 60 frames instead of 20, and the trails show a smoother, more gradual descent from the cloud onto the moons.",
      },
      {
        title: "Separate the blobs",
        text: "Choose three blobs and raise walkers to 400. Count roughly how many walkers end up in each blob. A well-trained model splits them about evenly, because the data has the same number of points in each cluster.",
      },
    ],
  },
  de: {
    metaDescription:
      "Ein Diffusionsmodell live im Browser trainieren sehen: Ein kleines MLP lernt Rauschen auf 2D-Daten vorherzusagen, DDPM-Walker entrauschen sich zur Datenform.",
    heading: "So funktioniert dieser Explorer",
    intro:
      "Auf diesem Canvas passieren zwei Dinge gleichzeitig. Im Hintergrund wird ein sehr kleines neuronales Netz darauf trainiert, Rauschen zu erkennen. Im Vordergrund starten rosafarbene Walker als Wolke aus reinem Gaußschen Rauschen und nutzen dieses Netz, um Schritt für Schritt zurück auf die cyanfarbenen Daten zu laufen. Sind sie angekommen, wird eine neue Wolke gezogen, und alles beginnt von vorn. So siehst du von Kohorte zu Kohorte, wie das Modell besser wird. Es ist dasselbe Rezept, das Bild-Diffusionsmodelle verwenden, nur geschrumpft von Millionen Pixeln auf zwei Koordinaten.",
    sections: [
      {
        heading: "Rauschen vorwärts, Lernen rückwärts",
        paragraphs: [
          "Ein Diffusionsmodell beruht auf einem Vorwärtsprozess, den niemand lernen muss: Man nimmt einen Datenpunkt x₀ und mischt ihn in T kleinen Schritten mit Gaußschem Rauschen ε. Der Fahrplan ᾱ_t gibt an, wie viel vom Original bei Schritt t noch übrig ist, deshalb lässt sich eine verrauschte Probe mit der Formel unten in einem Rutsch erzeugen. Im letzten Schritt ist im Idealfall nichts mehr von den Daten zu sehen.",
          "Das Netz ε_θ bekommt den verrauschten Punkt x_t und die Zeit t, und seine einzige Aufgabe ist zu raten, welches ε beigemischt wurde. Der Verlust ist einfach der quadrierte Abstand zwischen Schätzung und echtem Rauschen. Rät es gut, kann man den Prozess umdrehen: Man startet bei reinem Rauschen, zieht das vorhergesagte Rauschen in kleinen Portionen ab, gibt etwas frischen Zufall dazu und wiederholt das bis t = 0. Diese Rückwärtskette ist der DDPM-Sampler (denoising diffusion probabilistic model).",
        ],
        formula:
          "x_t = \\sqrt{\\bar\\alpha_t}\\, x_0 + \\sqrt{1 - \\bar\\alpha_t}\\, \\varepsilon, \\qquad \\mathcal{L} = \\big\\lVert \\varepsilon - \\varepsilon_\\theta(x_t, t) \\big\\rVert^2",
      },
      {
        heading: "Was die Regler bewirken",
        paragraphs: [
          "Der Datensatz bestimmt die Zielform: zwei Monde (Standard), drei Gaußsche Klumpen oder eine zweiarmige Spirale, jeweils mit 256 Punkten. Der Rauschfahrplan wechselt zwischen einem linearen β-Fahrplan, bei dem das Rauschen pro Schritt gleichmäßig von 0,0001 auf 0,02 wächst, und dem Kosinus-Fahrplan für ᾱ (Standard), der das verbleibende Signal wie einen Viertelkosinus formt, also am Anfang und am Ende sanft abfallen lässt.",
          "Die Diffusionsschritte T reichen von 10 bis 120 in Fünferschritten, Standard ist 40. Änderst du Datensatz, Fahrplan oder T, wird das Netz verworfen und neu trainiert, denn ein Modell für einen Fahrplan versteht keinen anderen. Die Walker-Zahl (20 bis 400, Standard 160) ändert nur, wie viele Punkte gesampelt werden, das trainierte Modell bleibt. Pause friert Training und Sampling ein, «Modell zurücksetzen» startet das Training neu, ohne eine Einstellung zu ändern.",
          "Die Statusleiste zeigt einen laufenden Verlust, geglättet mit einem exponentiellen gleitenden Mittel, und einen Epochenzähler, der per Konvention alle 30 Mini-Batches weiterspringt.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Hier steckt keine Machine-Learning-Bibliothek dahinter. Das Netz ist von Hand in schlichtem TypeScript geschrieben: vier Eingänge (x, y sowie Sinus und Kosinus von πt/T als Zeiteinbettung), zwei versteckte Schichten mit je 32 Neuronen und GELU-Aktivierung, zwei Ausgänge. Die Gewichte liegen in Float32Arrays, starten mit He-Initialisierung aus einem Zufallsgenerator mit festem Seed und werden per handgeschriebener Backpropagation und Adam-Optimierer mit Lernrate 0,005 angepasst.",
          "Jeder Animationsframe rechnet sechs Mini-Batches mit je 48 Trainingsbeispielen und bewegt dann jeden Walker um zwei Rückwärtsschritte, mit dem Update unten. Das ist der übliche DDPM-Schritt mit der Posterior-Varianz als Rauschstärke. Alle 12 Frames wird das Netz auf einem 28 × 28-Gitter bei mittlerem Rauschniveau ausgewertet. Die Größe seiner Rauschvorhersage, invertiert und normiert, erscheint als zartes cyanfarbenes Leuchten. Wo das vorhergesagte Rauschen klein ist, sieht der Punkt schon wie Daten aus. Jeder Walker zieht eine Spur über acht Frames hinter sich her.",
          "Ist reduzierte Bewegung eingestellt, startet die Animationsschleife gar nicht. Das Netz trainiert unsichtbar 1800 Mini-Batches lang, der Rückwärtsprozess läuft einmal vom Rauschen bis t = 0, und das Canvas zeigt diesen fertigen Zustand als Standbild. Änderst du einen Regler, entsteht ein neues Standbild, und die Pause ist deaktiviert.",
        ],
        code: REVERSE_EXCERPT,
      },
      {
        heading: "Warum der Fahrplan alles entscheidet",
        paragraphs: [
          "Die linearen Konstanten 0,0001 und 0,02 stammen aus Bildmodellen mit rund tausend Schritten. Bei nur T = 40 Schritten bleibt nach Multiplikation der vierzig Faktoren (1 − β) ein ᾱ_T ≈ 0,67 übrig. Selbst das am stärksten verrauschte Trainingsbeispiel behält also etwa 82 Prozent seiner Signalamplitude. Der Sampler startet aber immer bei reinem Rauschen, einem Zustand, den das Netz im Training nie gesehen hat. Der Kosinus-Fahrplan ist so gebaut, dass ᾱ im letzten Schritt für jedes T praktisch null erreicht, deshalb ist er hier voreingestellt. Mit T = 120 sinkt der lineare Fahrplan auf ᾱ_T ≈ 0,30, besser, aber immer noch weit weg von reinem Rauschen.",
        ],
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Den linearen Fahrplan an seine Grenze bringen",
        text: "Wechsle zu linearem β und senke T auf 10. Dann liegt ᾱ_T bei etwa 0,90, das Netz bekommt im Training also nie etwas zu sehen, das reinem Rauschen nahekommt. Vergleiche das Verhalten der Walker mit dem Kosinus-Fahrplan beim selben T.",
      },
      {
        title: "Lernen zwischen den Kohorten beobachten",
        text: "Drück «Modell zurücksetzen» beim Spiral-Datensatz und schau dir die ersten Kohorten an. Frühe Walker irren umher und verfehlen die Arme. Hat sich der Verlust eingependelt, zeichnet dieselbe Rückwärtskette die Spirale viel genauer nach.",
      },
      {
        title: "Mehr Schritte, feinerer Weg",
        text: "Bleib beim Kosinus-Fahrplan und stell T auf 120. Jede Kohorte braucht jetzt 60 statt 20 Frames, und die Spuren zeigen einen glatteren, allmählicheren Abstieg aus der Wolke auf die Monde.",
      },
      {
        title: "Die Klumpen aufteilen",
        text: "Wähle drei Klumpen und erhöhe die Walker auf 400. Schätze, wie viele Walker in jedem Klumpen landen. Ein gut trainiertes Modell verteilt sie ungefähr gleichmäßig, weil jeder Klumpen in den Daten gleich viele Punkte hat.",
      },
    ],
  },
};
