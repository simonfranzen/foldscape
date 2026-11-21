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
      "Ein Diffusionsmodell live im Browser trainieren sehen: Ein kleines MLP lernt Rauschen auf 2D-Daten vorherzusagen, DDPM-Wanderer entrauschen sich zur Datenform.",
    heading: "So funktioniert dieser Explorer",
    intro:
      "Auf diesem Canvas passieren zwei Dinge gleichzeitig. Im Hintergrund wird ein sehr kleines neuronales Netz darauf trainiert, Rauschen zu erkennen. Im Vordergrund starten rosafarbene Wanderer als Wolke aus reinem Gaußschen Rauschen und nutzen dieses Netz, um Schritt für Schritt zurück auf die cyanfarbenen Daten zu laufen. Sind sie angekommen, wird eine neue Wolke gezogen, und alles beginnt von vorn. So siehst du von Kohorte zu Kohorte, wie das Modell besser wird. Es ist dasselbe Rezept, das Bild-Diffusionsmodelle verwenden, nur geschrumpft von Millionen Pixeln auf zwei Koordinaten.",
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
          "Der Datensatz bestimmt die Zielform: zwei Monde (Standard), drei Gaußsche Cluster oder eine zweiarmige Spirale, jeweils mit 256 Punkten. Der Rauschplan wechselt zwischen einem linearen β-Fahrplan, bei dem das Rauschen pro Schritt gleichmäßig von 0,0001 auf 0,02 wächst, und dem Kosinus-Fahrplan für ᾱ (Standard), der das verbleibende Signal wie einen Viertelkosinus formt, also am Anfang und am Ende sanft abfallen lässt.",
          "Die Diffusionsschritte T reichen von 10 bis 120 in Fünferschritten, Standard ist 40. Änderst du Datensatz, Fahrplan oder T, wird das Netz verworfen und neu trainiert, denn ein Modell für einen Fahrplan versteht keinen anderen. Der Regler «Wanderer» (20 bis 400, Standard 160) ändert nur, wie viele Punkte gesampelt werden, das trainierte Modell bleibt. Pause friert Training und Sampling ein, «Modell zurücksetzen» startet das Training neu, ohne eine Einstellung zu ändern.",
          "Die Statusleiste zeigt einen laufenden Verlust, geglättet mit einem exponentiellen gleitenden Mittel, und einen Epochenzähler, der per Konvention alle 30 Mini-Batches weiterspringt.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Hier steckt keine Machine-Learning-Bibliothek dahinter. Das Netz ist von Hand in schlichtem TypeScript geschrieben: vier Eingänge (x, y sowie Sinus und Kosinus von πt/T als Zeiteinbettung), zwei versteckte Schichten mit je 32 Neuronen und GELU-Aktivierung, zwei Ausgänge. Die Gewichte liegen in Float32Arrays, starten mit He-Initialisierung aus einem Zufallsgenerator mit festem Seed und werden per handgeschriebener Backpropagation und Adam-Optimierer mit Lernrate 0,005 angepasst.",
          "Jeder Animationsframe rechnet sechs Mini-Batches mit je 48 Trainingsbeispielen und bewegt dann jeden Wanderer um zwei Rückwärtsschritte, mit dem Update unten. Das ist der übliche DDPM-Schritt mit der Posterior-Varianz als Rauschstärke. Alle 12 Frames wird das Netz auf einem 28 × 28-Gitter bei mittlerem Rauschniveau ausgewertet. Die Größe seiner Rauschvorhersage, invertiert und normiert, erscheint als zartes cyanfarbenes Leuchten. Wo das vorhergesagte Rauschen klein ist, sieht der Punkt schon wie Daten aus. Jeder Wanderer zieht eine Spur über acht Frames hinter sich her.",
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
        text: "Wechsle zu linearem β und senke T auf 10. Dann liegt ᾱ_T bei etwa 0,90, das Netz bekommt im Training also nie etwas zu sehen, das reinem Rauschen nahekommt. Vergleiche das Verhalten der Wanderer mit dem Kosinus-Fahrplan beim selben T.",
      },
      {
        title: "Lernen zwischen den Kohorten beobachten",
        text: "Drück «Modell zurücksetzen» beim Spiral-Datensatz und schau dir die ersten Kohorten an. Frühe Wanderer irren umher und verfehlen die Arme. Hat sich der Verlust eingependelt, zeichnet dieselbe Rückwärtskette die Spirale viel genauer nach.",
      },
      {
        title: "Mehr Schritte, feinerer Weg",
        text: "Bleib beim Kosinus-Fahrplan und stell T auf 120. Jede Kohorte braucht jetzt 60 statt 20 Frames, und die Spuren zeigen einen glatteren, allmählicheren Abstieg aus der Wolke auf die Monde.",
      },
      {
        title: "Die Cluster aufteilen",
        text: "Wähle «drei Cluster» und erhöhe «Wanderer» auf 400. Schätze, wie viele Wanderer in jedem Cluster landen. Ein gut trainiertes Modell verteilt sie ungefähr gleichmäßig, weil jeder Cluster in den Daten gleich viele Punkte hat.",
      },
    ],
  },
  es: {
    metaDescription:
      "Mira cómo se entrena un modelo de difusión en tu navegador: un MLP diminuto aprende a predecir ruido en datos 2D y los caminantes DDPM eliminan el ruido.",
    heading: "Cómo funciona este explorador",
    intro:
      "En este lienzo ocurren dos cosas a la vez. En segundo plano se entrena una red neuronal muy pequeña para reconocer ruido. En primer plano, unos caminantes de color rosa empiezan como una nube de puro ruido gaussiano y usan esa red, paso a paso, para volver caminando hasta los datos de color cian. Cuando llegan, se sortea una nube nueva y la caminata vuelve a empezar, así que ves cómo el mismo modelo mejora de una cohorte a la siguiente. Es la misma receta que usan los modelos de difusión de imágenes, reducida de millones de píxeles a dos coordenadas.",
    sections: [
      {
        heading: "Ruido hacia delante, aprendizaje hacia atrás",
        paragraphs: [
          "Un modelo de difusión se define mediante un proceso directo que nadie tiene que aprender: se toma un dato x₀ y se mezcla con ruido gaussiano ε en T pasos pequeños. El calendario ᾱ_t indica cuánto del original sobrevive en el paso t, de modo que una muestra ruidosa se puede generar de una sola vez con la fórmula de abajo. En el último paso, idealmente, no queda nada de los datos.",
          "La red ε_θ recibe el punto ruidoso x_t y el tiempo t, y su única tarea es adivinar qué ε se mezcló. La pérdida es simplemente la distancia al cuadrado entre la estimación y el ruido verdadero. Cuando adivina bien, el proceso se puede recorrer al revés: se parte de ruido puro, se resta poco a poco el ruido predicho, se vuelve a añadir una pequeña dosis de azar nuevo y se repite hasta t = 0. Esta cadena inversa es el muestreador DDPM (denoising diffusion probabilistic model).",
        ],
        formula:
          "x_t = \\sqrt{\\bar\\alpha_t}\\, x_0 + \\sqrt{1 - \\bar\\alpha_t}\\, \\varepsilon, \\qquad \\mathcal{L} = \\big\\lVert \\varepsilon - \\varepsilon_\\theta(x_t, t) \\big\\rVert^2",
      },
      {
        heading: "Qué hacen los controles",
        paragraphs: [
          "«Conjunto de datos» elige la forma objetivo: dos lunas (la opción por defecto), tres manchas gaussianas o una espiral de dos brazos. Cada una tiene 256 puntos. «Calendario de ruido» alterna entre un calendario lineal de β, en el que el ruido añadido por paso crece de manera uniforme de 0,0001 a 0,02, y el calendario coseno de ᾱ (por defecto), que da a la señal superviviente la forma de un cuarto de coseno para que caiga con suavidad al principio y al final.",
          "«Pasos de difusión T» va de 10 a 120 en saltos de 5, con 40 por defecto. Cambiar el conjunto de datos, el calendario o T descarta la red y entrena una nueva desde cero, porque un modelo entrenado para un calendario no entiende otro. «Caminantes» (de 20 a 400, por defecto 160) solo cambia cuántos puntos se muestrean y conserva el modelo entrenado. «Pausa» congela el entrenamiento y el muestreo, y «Reiniciar modelo» vuelve a empezar el entrenamiento sin tocar ningún ajuste.",
          "La franja de estado muestra una pérdida en curso, suavizada con una media móvil exponencial, y un contador de épocas que por convención avanza una vez cada 30 minilotes.",
        ],
      },
      {
        heading: "Cómo está construido",
        paragraphs: [
          "Aquí no hay ninguna biblioteca de aprendizaje automático. La red de score está escrita a mano en TypeScript puro: cuatro entradas (x, y, y el seno y el coseno de πt/T como codificación del tiempo), dos capas ocultas de 32 unidades con activaciones GELU y dos salidas. Los pesos viven en Float32Arrays, arrancan con inicialización de He a partir de un generador aleatorio con semilla fija y se actualizan con una retropropagación y un optimizador Adam escritos a mano, con tasa de aprendizaje 0,005.",
          "Cada fotograma de animación ejecuta seis minilotes de 48 ejemplos de entrenamiento y después mueve cada caminante dos pasos inversos con la actualización que se muestra abajo, que es el paso DDPM estándar con la varianza posterior como escala del ruido. Cada 12 fotogramas se evalúa la red en una cuadrícula de 28 × 28 en el nivel de ruido intermedio, y la magnitud de su predicción de ruido, invertida y normalizada, se pinta como el tenue resplandor cian. Donde el ruido predicho es pequeño, el punto ya parece un dato. Cada caminante conserva una estela de ocho fotogramas.",
          "Con el movimiento reducido activado, el bucle de animación no llega a arrancar. La red se entrena fuera de pantalla durante 1800 minilotes, el proceso inverso se ejecuta una vez desde el ruido hasta t = 0 y el lienzo muestra ese estado final como imagen fija. Cambiar un control produce una nueva imagen fija, y «Pausa» queda desactivado.",
        ],
        code: REVERSE_EXCERPT,
      },
      {
        heading: "Por qué el calendario lo decide todo",
        paragraphs: [
          "Las constantes lineales 0,0001 y 0,02 proceden de modelos de imágenes que usan alrededor de mil pasos. Con solo T = 40 pasos, multiplicar los cuarenta factores (1 − β) deja ᾱ_T ≈ 0,67, de modo que el ejemplo de entrenamiento más ruidoso conserva todavía cerca del 82 por ciento de la amplitud de su señal. El muestreador, en cambio, siempre parte de ruido puro, un estado que la red nunca vio durante el entrenamiento. El calendario coseno está construido para que ᾱ llegue prácticamente a cero en el último paso sea cual sea T, y por eso es aquí la opción por defecto. Subir T a 120 hace bajar el calendario lineal hasta ᾱ_T ≈ 0,30, mejor pero todavía lejos del ruido puro.",
        ],
      },
    ],
    experimentsHeading: "Prueba esto",
    experiments: [
      {
        title: "Rompe el calendario lineal",
        text: "Cambia a «β lineal» y baja T a 10. Aquí ᾱ_T vale alrededor de 0,90, así que el entrenamiento nunca le enseña a la red nada parecido al ruido puro. Fíjate en cómo se comportan los caminantes en comparación con el coseno para el mismo T.",
      },
      {
        title: "Observa el aprendizaje entre cohortes",
        text: "Pulsa «Reiniciar modelo» con el conjunto de datos de la espiral y observa las primeras cohortes. Los primeros caminantes deambulan y no aciertan con los brazos; cuando la pérdida se ha estabilizado, la misma cadena inversa traza la espiral con mucha más fidelidad.",
      },
      {
        title: "Más pasos, caminata más fina",
        text: "Mantén el coseno y pon T en 120. Ahora cada cohorte tarda 60 fotogramas en lugar de 20, y las estelas muestran un descenso más suave y gradual desde la nube hasta las lunas.",
      },
      {
        title: "Separa las manchas",
        text: "Elige «tres manchas» y sube los caminantes a 400. Cuenta a ojo cuántos caminantes acaban en cada mancha. Un modelo bien entrenado los reparte más o menos a partes iguales, porque los datos tienen el mismo número de puntos en cada grupo.",
      },
    ],
  },
  fr: {
    metaDescription:
      "Regarde un modèle de diffusion s'entraîner dans ton navigateur : un petit MLP apprend à prédire le bruit sur des données 2D et les marcheurs DDPM débruitent.",
    heading: "Comment fonctionne cet explorateur",
    intro:
      "Deux choses se passent en même temps sur ce canevas. En arrière-plan, un tout petit réseau de neurones s'entraîne à reconnaître le bruit. Au premier plan, des marcheurs roses partent d'un nuage de pur bruit gaussien et se servent de ce réseau, pas à pas, pour revenir vers les données en cyan. À leur arrivée, un nouveau nuage est tiré et la marche recommence : tu vois donc le même modèle s'améliorer d'une cohorte à la suivante. C'est la recette des modèles de diffusion d'images, réduite de millions de pixels à deux coordonnées.",
    sections: [
      {
        heading: "Le bruit à l'aller, l'apprentissage au retour",
        paragraphs: [
          "Un modèle de diffusion se définit par un processus direct que personne n'a besoin d'apprendre : on prend un point de données x₀ et on le mélange à du bruit gaussien ε en T petits pas. Le calendrier ᾱ_t indique quelle part de l'original subsiste au pas t, si bien qu'un échantillon bruité peut être produit d'un seul coup avec la formule ci-dessous. Au dernier pas, dans l'idéal, il ne reste rien des données.",
          "Le réseau ε_θ reçoit le point bruité x_t et le temps t, et son seul travail est de deviner quel ε a été ajouté. La perte est simplement le carré de la distance entre l'estimation et le vrai bruit. Une fois qu'il devine bien, on peut dérouler le processus à l'envers : partir de bruit pur, soustraire peu à peu le bruit prédit, réinjecter une petite dose de hasard neuf, et recommencer jusqu'à t = 0. Cette chaîne inverse est l'échantillonneur DDPM (denoising diffusion probabilistic model).",
        ],
        formula:
          "x_t = \\sqrt{\\bar\\alpha_t}\\, x_0 + \\sqrt{1 - \\bar\\alpha_t}\\, \\varepsilon, \\qquad \\mathcal{L} = \\big\\lVert \\varepsilon - \\varepsilon_\\theta(x_t, t) \\big\\rVert^2",
      },
      {
        heading: "À quoi servent les commandes",
        paragraphs: [
          "« Jeu de données » choisit la forme cible : deux lunes (le choix par défaut), trois amas gaussiens ou une spirale à deux bras. Chacune compte 256 points. « Calendrier de bruit » bascule entre un calendrier linéaire en β, où le bruit ajouté à chaque pas croît régulièrement de 0,0001 à 0,02, et le calendrier cosinus en ᾱ (par défaut), qui donne au signal restant la forme d'un quart de cosinus pour qu'il décroisse en douceur au début et à la fin.",
          "« Pas de diffusion T » va de 10 à 120 par incréments de 5, avec 40 par défaut. Changer le jeu de données, le calendrier ou T jette le réseau et en entraîne un nouveau à partir de zéro, car un modèle entraîné pour un calendrier n'en comprend pas un autre. « Marcheurs » (de 20 à 400, 160 par défaut) ne change que le nombre de points échantillonnés et conserve le modèle entraîné. « Pause » fige l'entraînement et l'échantillonnage, et « Réinitialiser le modèle » relance l'entraînement sans modifier aucun réglage.",
          "Le bandeau d'état affiche une perte courante, lissée par une moyenne mobile exponentielle, et un compteur d'époques qui, par convention, avance d'un cran tous les 30 mini-lots.",
        ],
      },
      {
        heading: "Comment c'est construit",
        paragraphs: [
          "Il n'y a ici aucune bibliothèque d'apprentissage automatique. Le réseau de score est écrit à la main en TypeScript pur : quatre entrées (x, y, ainsi que le sinus et le cosinus de πt/T comme encodage du temps), deux couches cachées de 32 unités avec des activations GELU, et deux sorties. Les poids sont stockés dans des Float32Array, démarrent avec une initialisation de He issue d'un générateur aléatoire à graine fixe, et sont mis à jour par une rétropropagation et un optimiseur Adam écrits à la main, avec un taux d'apprentissage de 0,005.",
          "Chaque image de l'animation exécute six mini-lots de 48 exemples d'entraînement, puis fait avancer chaque marcheur de deux pas inverses avec la mise à jour montrée ci-dessous, qui est le pas DDPM standard avec la variance a posteriori comme échelle de bruit. Toutes les 12 images, le réseau est évalué sur une grille de 28 × 28 au niveau de bruit médian, et l'amplitude de sa prédiction de bruit, inversée et normalisée, est peinte sous la forme d'une faible lueur cyan. Là où le bruit prédit est faible, le point ressemble déjà à une donnée. Chaque marcheur garde une traînée de huit images.",
          "Quand la réduction des animations est activée, la boucle d'animation ne démarre jamais. Le réseau s'entraîne hors écran pendant 1 800 mini-lots, le processus inverse s'exécute une fois du bruit jusqu'à t = 0, et le canevas montre cet état final sous forme d'image fixe. Modifier une commande produit une nouvelle image fixe, et « Pause » est désactivé.",
        ],
        code: REVERSE_EXCERPT,
      },
      {
        heading: "Pourquoi le calendrier décide de tout",
        paragraphs: [
          "Les constantes linéaires 0,0001 et 0,02 viennent de modèles d'images qui utilisent un millier de pas environ. Avec seulement T = 40 pas, le produit des quarante facteurs (1 − β) laisse ᾱ_T ≈ 0,67 : l'exemple d'entraînement le plus bruité conserve donc encore environ 82 pour cent de l'amplitude de son signal. L'échantillonneur, lui, part toujours de bruit pur, un état que le réseau n'a jamais vu pendant l'entraînement. Le calendrier cosinus est construit pour que ᾱ atteigne pratiquement zéro au dernier pas quel que soit T, et c'est pourquoi il est ici le choix par défaut. Porter T à 120 fait descendre le calendrier linéaire à ᾱ_T ≈ 0,30, ce qui est mieux mais reste loin du bruit pur.",
        ],
      },
    ],
    experimentsHeading: "À essayer",
    experiments: [
      {
        title: "Mets le calendrier linéaire en échec",
        text: "Passe à « β linéaire » et descends T à 10. Ici ᾱ_T vaut environ 0,90, donc l'entraînement ne montre jamais au réseau quoi que ce soit de proche du bruit pur. Observe le comportement des marcheurs par rapport au cosinus pour le même T.",
      },
      {
        title: "Regarde l'apprentissage d'une cohorte à l'autre",
        text: "Appuie sur « Réinitialiser le modèle » avec le jeu de données en spirale et regarde les premières cohortes. Les premiers marcheurs errent et manquent les bras ; une fois la perte stabilisée, la même chaîne inverse dessine la spirale bien plus fidèlement.",
      },
      {
        title: "Plus de pas, une marche plus fine",
        text: "Garde le cosinus et règle T sur 120. Chaque cohorte prend maintenant 60 images au lieu de 20, et les traînées montrent une descente plus lisse et plus progressive du nuage vers les lunes.",
      },
      {
        title: "Sépare les amas",
        text: "Choisis « trois amas » et monte les marcheurs à 400. Compte à peu près combien de marcheurs finissent dans chaque amas. Un modèle bien entraîné les répartit à peu près également, parce que les données ont le même nombre de points dans chaque groupe.",
      },
    ],
  },
  it: {
    metaDescription:
      "Guarda un modello di diffusione che si addestra nel browser: un piccolo MLP impara a predire il rumore su dati 2D e i camminatori DDPM tolgono il rumore.",
    heading: "Come funziona questo esploratore",
    intro:
      "Su questo canvas succedono due cose insieme. Sullo sfondo una rete neurale molto piccola viene addestrata a riconoscere il rumore. In primo piano dei camminatori rosa partono come una nube di puro rumore gaussiano e usano quella rete, passo dopo passo, per tornare sui dati color ciano. Quando arrivano viene estratta una nube nuova e la camminata ricomincia, così vedi lo stesso modello migliorare da una coorte all'altra. È la stessa ricetta dei modelli di diffusione per immagini, ridotta da milioni di pixel a due coordinate.",
    sections: [
      {
        heading: "Rumore in avanti, apprendimento all'indietro",
        paragraphs: [
          "Un modello di diffusione è definito da un processo in avanti che nessuno deve imparare: si prende un dato x₀ e lo si mescola con rumore gaussiano ε in T piccoli passi. Il calendario ᾱ_t dice quanto dell'originale sopravvive al passo t, quindi un campione rumoroso si può produrre in un colpo solo con la formula qui sotto. All'ultimo passo, idealmente, dei dati non resta nulla.",
          "La rete ε_θ riceve il punto rumoroso x_t e il tempo t, e il suo unico compito è indovinare quale ε è stato aggiunto. La perdita è semplicemente la distanza al quadrato tra la stima e il rumore vero. Quando indovina bene, il processo si può percorrere al contrario: si parte da rumore puro, si sottrae un po' alla volta il rumore predetto, si riaggiunge una piccola dose di casualità fresca e si ripete fino a t = 0. Questa catena inversa è il campionatore DDPM (denoising diffusion probabilistic model).",
        ],
        formula:
          "x_t = \\sqrt{\\bar\\alpha_t}\\, x_0 + \\sqrt{1 - \\bar\\alpha_t}\\, \\varepsilon, \\qquad \\mathcal{L} = \\big\\lVert \\varepsilon - \\varepsilon_\\theta(x_t, t) \\big\\rVert^2",
      },
      {
        heading: "Che cosa fanno i controlli",
        paragraphs: [
          "«Dataset» sceglie la forma bersaglio: due lune (la scelta predefinita), tre nuvole gaussiane o una spirale a due bracci. Ognuna contiene 256 punti. «Calendario di rumore» passa da un calendario lineare di β, in cui il rumore aggiunto a ogni passo cresce in modo uniforme da 0,0001 a 0,02, al calendario coseno di ᾱ (predefinito), che dà al segnale residuo la forma di un quarto di coseno, così che cali dolcemente all'inizio e alla fine.",
          "«Passi di diffusione T» va da 10 a 120 a passi di 5, con 40 come valore predefinito. Cambiare il dataset, il calendario o T butta via la rete e ne addestra una nuova da zero, perché un modello addestrato per un calendario non ne capisce un altro. «Camminatori» (da 20 a 400, predefinito 160) cambia solo quanti punti vengono campionati e mantiene il modello addestrato. «Pausa» congela addestramento e campionamento, e «Reset modello» fa ripartire l'addestramento senza toccare alcuna impostazione.",
          "La striscia di stato riporta una perdita corrente, smussata con una media mobile esponenziale, e un contatore di epoche che per convenzione scatta una volta ogni 30 mini-batch.",
        ],
      },
      {
        heading: "Com'è costruito",
        paragraphs: [
          "Qui non c'è nessuna libreria di machine learning. La rete di score è scritta a mano in semplice TypeScript: quattro ingressi (x, y, più seno e coseno di πt/T come codifica del tempo), due strati nascosti da 32 unità con attivazioni GELU e due uscite. I pesi stanno in Float32Array, partono con l'inizializzazione di He da un generatore casuale con seme fisso e vengono aggiornati da una retropropagazione e da un ottimizzatore Adam scritti a mano, con tasso di apprendimento 0,005.",
          "Ogni fotogramma dell'animazione esegue sei mini-batch da 48 esempi di addestramento, poi sposta ogni camminatore di due passi inversi con l'aggiornamento mostrato sotto, che è il passo DDPM standard con la varianza a posteriori come scala del rumore. Ogni 12 fotogrammi la rete viene valutata su una griglia 28 × 28 al livello di rumore intermedio, e l'ampiezza della sua predizione di rumore, invertita e normalizzata, viene dipinta come il tenue bagliore ciano. Dove il rumore predetto è piccolo, il punto assomiglia già a un dato. Ogni camminatore conserva una scia di otto fotogrammi.",
          "Con il movimento ridotto attivo, il ciclo di animazione non parte affatto. La rete si addestra fuori schermo per 1800 mini-batch, il processo inverso viene eseguito una volta dal rumore fino a t = 0, e il canvas mostra quello stato finale come immagine fissa. Cambiare un controllo produce una nuova immagine fissa, e «Pausa» è disattivato.",
        ],
        code: REVERSE_EXCERPT,
      },
      {
        heading: "Perché il calendario decide tutto",
        paragraphs: [
          "Le costanti lineari 0,0001 e 0,02 vengono da modelli per immagini che usano circa mille passi. Con soli T = 40 passi, moltiplicare tra loro i quaranta fattori (1 − β) lascia ᾱ_T ≈ 0,67, quindi l'esempio di addestramento più rumoroso conserva ancora circa l'82 per cento dell'ampiezza del suo segnale. Il campionatore, però, parte sempre da rumore puro, uno stato che la rete non ha mai visto durante l'addestramento. Il calendario coseno è costruito in modo che ᾱ arrivi praticamente a zero all'ultimo passo per qualsiasi T, ed è per questo che qui è il valore predefinito. Portare T a 120 fa scendere il calendario lineare a ᾱ_T ≈ 0,30: meglio, ma ancora lontano dal rumore puro.",
        ],
      },
    ],
    experimentsHeading: "Prova così",
    experiments: [
      {
        title: "Manda in crisi il calendario lineare",
        text: "Passa a «β lineare» e abbassa T a 10. Qui ᾱ_T vale circa 0,90, quindi l'addestramento non mostra mai alla rete nulla che somigli al rumore puro. Osserva come si comportano i camminatori rispetto al coseno con lo stesso T.",
      },
      {
        title: "Osserva l'apprendimento tra le coorti",
        text: "Premi «Reset modello» con il dataset a spirale e guarda le prime coorti. I primi camminatori vagano e mancano i bracci; quando la perdita si è assestata, la stessa catena inversa ricalca la spirale con molta più fedeltà.",
      },
      {
        title: "Più passi, camminata più fine",
        text: "Tieni il coseno e imposta T a 120. Ora ogni coorte impiega 60 fotogrammi invece di 20, e le scie mostrano una discesa più liscia e graduale dalla nube alle lune.",
      },
      {
        title: "Separa le nuvole",
        text: "Scegli «tre nuvole» e porta i camminatori a 400. Conta a occhio quanti camminatori finiscono in ciascuna nuvola. Un modello ben addestrato li divide più o meno in parti uguali, perché i dati hanno lo stesso numero di punti in ogni gruppo.",
      },
    ],
  },
  pt: {
    metaDescription:
      "Vê um modelo de difusão a treinar ao vivo no teu navegador: um MLP minúsculo aprende a prever ruído em dados 2D e os caminhantes DDPM removem o ruído.",
    heading: "Como funciona este explorador",
    intro:
      "Neste canvas acontecem duas coisas ao mesmo tempo. Em segundo plano, uma rede neuronal muito pequena está a ser treinada para reconhecer ruído. Em primeiro plano, caminhantes cor-de-rosa começam como uma nuvem de puro ruído gaussiano e usam essa rede, passo a passo, para regressar aos dados a ciano. Quando chegam, é sorteada uma nuvem nova e a caminhada recomeça, por isso vês o mesmo modelo a melhorar de uma coorte para a seguinte. É a mesma receita que os modelos de difusão de imagens usam, reduzida de milhões de píxeis para duas coordenadas.",
    sections: [
      {
        heading: "Ruído para a frente, aprendizagem para trás",
        paragraphs: [
          "Um modelo de difusão é definido por um processo direto que ninguém precisa de aprender: pega-se num ponto de dados x₀ e mistura-se com ruído gaussiano ε em T passos pequenos. O calendário ᾱ_t diz quanto do original sobrevive no passo t, pelo que uma amostra ruidosa pode ser produzida de uma só vez com a fórmula abaixo. No último passo, idealmente, não sobra nada dos dados.",
          "A rede ε_θ recebe o ponto ruidoso x_t e o tempo t, e a sua única tarefa é adivinhar que ε foi misturado. A perda é simplesmente o quadrado da distância entre o palpite e o ruído verdadeiro. Quando adivinha bem, o processo pode ser percorrido ao contrário: parte-se de ruído puro, subtrai-se aos poucos o ruído previsto, volta-se a juntar uma pequena dose de acaso fresco e repete-se até t = 0. Esta cadeia inversa é o amostrador DDPM (denoising diffusion probabilistic model).",
        ],
        formula:
          "x_t = \\sqrt{\\bar\\alpha_t}\\, x_0 + \\sqrt{1 - \\bar\\alpha_t}\\, \\varepsilon, \\qquad \\mathcal{L} = \\big\\lVert \\varepsilon - \\varepsilon_\\theta(x_t, t) \\big\\rVert^2",
      },
      {
        heading: "O que fazem os controlos",
        paragraphs: [
          "«Conjunto de dados» escolhe a forma alvo: duas luas (a opção por omissão), três manchas gaussianas ou uma espiral de dois braços. Cada uma tem 256 pontos. «Calendário de ruído» alterna entre um calendário linear de β, em que o ruído acrescentado por passo cresce uniformemente de 0,0001 a 0,02, e o calendário cosseno de ᾱ (por omissão), que dá ao sinal sobrevivente a forma de um quarto de cosseno, para que caia suavemente no início e no fim.",
          "«Passos de difusão T» vai de 10 a 120 em saltos de 5, com 40 por omissão. Mudar o conjunto de dados, o calendário ou T deita a rede fora e treina uma nova de raiz, porque um modelo treinado para um calendário não entende outro. «Caminhantes» (de 20 a 400, 160 por omissão) só muda quantos pontos são amostrados e mantém o modelo treinado. «Pausar» congela o treino e a amostragem, e «Reset do modelo» recomeça o treino sem alterar nenhuma definição.",
          "A faixa de estado apresenta uma perda corrente, suavizada com uma média móvel exponencial, e um contador de épocas que, por convenção, avança uma vez a cada 30 minilotes.",
        ],
      },
      {
        heading: "Como está construído",
        paragraphs: [
          "Aqui não há nenhuma biblioteca de aprendizagem automática. A rede de score está escrita à mão em TypeScript simples: quatro entradas (x, y, e o seno e o cosseno de πt/T como codificação do tempo), duas camadas ocultas de 32 unidades com ativações GELU e duas saídas. Os pesos vivem em Float32Arrays, arrancam com a inicialização de He a partir de um gerador aleatório com semente fixa e são atualizados por uma retropropagação e um otimizador Adam escritos à mão, com taxa de aprendizagem 0,005.",
          "Cada fotograma da animação corre seis minilotes de 48 exemplos de treino e depois move cada caminhante dois passos inversos com a atualização mostrada abaixo, que é o passo DDPM padrão com a variância a posteriori como escala do ruído. De 12 em 12 fotogramas, a rede é avaliada numa grelha de 28 × 28 no nível de ruído intermédio, e a magnitude da sua previsão de ruído, invertida e normalizada, é pintada como o ténue brilho ciano. Onde o ruído previsto é pequeno, o ponto já se parece com um dado. Cada caminhante mantém um rasto de oito fotogramas.",
          "Com o movimento reduzido ativado, o ciclo de animação nem chega a arrancar. A rede treina fora do ecrã durante 1800 minilotes, o processo inverso corre uma vez desde o ruído até t = 0, e o canvas mostra esse estado final como imagem fixa. Mudar um controlo produz uma nova imagem fixa, e «Pausar» fica desativado.",
        ],
        code: REVERSE_EXCERPT,
      },
      {
        heading: "Porque é que o calendário decide tudo",
        paragraphs: [
          "As constantes lineares 0,0001 e 0,02 vêm de modelos de imagens que usam cerca de mil passos. Com apenas T = 40 passos, multiplicar os quarenta fatores (1 − β) deixa ᾱ_T ≈ 0,67, pelo que o exemplo de treino mais ruidoso ainda conserva cerca de 82 por cento da amplitude do seu sinal. O amostrador, porém, parte sempre de ruído puro, um estado que a rede nunca viu durante o treino. O calendário cosseno está construído de modo que ᾱ chegue praticamente a zero no último passo para qualquer T, e é por isso que aqui é a opção por omissão. Subir T para 120 faz o calendário linear descer para ᾱ_T ≈ 0,30, melhor mas ainda longe do ruído puro.",
        ],
      },
    ],
    experimentsHeading: "Experimenta isto",
    experiments: [
      {
        title: "Leva o calendário linear ao limite",
        text: "Muda para «β linear» e baixa T para 10. Aqui ᾱ_T ronda 0,90, por isso o treino nunca mostra à rede nada parecido com ruído puro. Repara em como os caminhantes se comportam em comparação com o cosseno para o mesmo T.",
      },
      {
        title: "Observa a aprendizagem entre coortes",
        text: "Carrega em «Reset do modelo» com o conjunto de dados em espiral e observa as primeiras coortes. Os primeiros caminhantes vagueiam e falham os braços; depois de a perda estabilizar, a mesma cadeia inversa desenha a espiral com muito mais fidelidade.",
      },
      {
        title: "Mais passos, caminhada mais fina",
        text: "Mantém o cosseno e põe T em 120. Cada coorte demora agora 60 fotogramas em vez de 20, e os rastos mostram uma descida mais suave e gradual da nuvem para as luas.",
      },
      {
        title: "Separa as manchas",
        text: "Escolhe «três manchas» e sobe os caminhantes para 400. Conta por alto quantos caminhantes acabam em cada mancha. Um modelo bem treinado divide-os mais ou menos por igual, porque os dados têm o mesmo número de pontos em cada grupo.",
      },
    ],
  },
  sv: {
    metaDescription:
      "Se en diffusionsmodell tränas live i webbläsaren: ett litet MLP lär sig förutsäga brus på 2D-data, och DDPM-vandrare brusrensar sig från gaussiskt brus.",
    heading: "Så fungerar den här utforskaren",
    intro:
      "Två saker händer samtidigt på den här ytan. I bakgrunden tränas ett mycket litet neuralt nätverk att känna igen brus. I förgrunden börjar rosa vandrare som ett moln av rent gaussiskt brus och använder nätverket, steg för steg, för att gå tillbaka till de cyanfärgade datapunkterna. När de är framme dras ett nytt moln och vandringen börjar om, så du ser samma modell bli bättre från en kohort till nästa. Det är samma recept som diffusionsmodeller för bilder använder, krympt från miljontals pixlar till två koordinater.",
    sections: [
      {
        heading: "Brus framåt, lärande bakåt",
        paragraphs: [
          "En diffusionsmodell definieras av en framåtprocess som ingen behöver lära sig: ta en datapunkt x₀ och blanda den med gaussiskt brus ε i T små steg. Schemat ᾱ_t anger hur mycket av originalet som finns kvar vid steg t, så ett brusigt prov kan tas fram i ett enda slag med formeln nedan. Vid det sista steget ska det helst inte finnas något kvar av datapunkten.",
          "Nätverket ε_θ får den brusiga punkten x_t och tiden t, och dess enda uppgift är att gissa vilket ε som blandades in. Förlusten är helt enkelt det kvadrerade avståndet mellan gissningen och det sanna bruset. När det väl gissar bra kan man köra processen baklänges: börja från rent brus, dra bort det förutsagda bruset lite i taget, lägg tillbaka en liten mängd ny slump och upprepa tills t = 0. Den här omvända kedjan är DDPM-samplaren (denoising diffusion probabilistic model).",
        ],
        formula:
          "x_t = \\sqrt{\\bar\\alpha_t}\\, x_0 + \\sqrt{1 - \\bar\\alpha_t}\\, \\varepsilon, \\qquad \\mathcal{L} = \\big\\lVert \\varepsilon - \\varepsilon_\\theta(x_t, t) \\big\\rVert^2",
      },
      {
        heading: "Vad reglagen gör",
        paragraphs: [
          "”Dataset” väljer målformen: två månar (standard), tre gaussiska kluster eller en spiral med två armar. Var och en har 256 punkter. ”Brusschema” växlar mellan ett linjärt β-schema, där bruset som läggs till per steg växer jämnt från 0,0001 till 0,02, och kosinusschemat för ᾱ (standard), som formar den kvarvarande signalen som en kvarts kosinus så att den faller mjukt i början och i slutet.",
          "”Diffusionssteg T” går från 10 till 120 i steg om 5, med 40 som standard. Om du byter dataset, schema eller T kastas nätverket bort och ett nytt tränas från noll, eftersom en modell som tränats för ett schema inte förstår ett annat. ”Vandrare” (20 till 400, standard 160) ändrar bara hur många punkter som samplas och behåller den tränade modellen. ”Paus” fryser träning och sampling, och ”Återställ modellen” startar om träningen utan att ändra någon inställning.",
          "Statusraden visar en löpande förlust, utjämnad med ett exponentiellt glidande medelvärde, och en epokräknare som enligt konvention tickar fram en gång var 30:e minibatch.",
        ],
      },
      {
        heading: "Hur den är byggd",
        paragraphs: [
          "Här finns inget bibliotek för maskininlärning. Score-nätverket är skrivet för hand i ren TypeScript: fyra ingångar (x, y samt sinus och kosinus av πt/T som tidsinbäddning), två dolda lager med 32 enheter och GELU-aktivering, och två utgångar. Vikterna ligger i Float32Array, startar med He-initiering från en slumpgenerator med fast frö och uppdateras med handskriven backpropagation och en Adam-optimerare med inlärningshastighet 0,005.",
          "Varje animationsbildruta kör sex minibatcher med 48 träningsexempel och flyttar sedan varje vandrare två omvända steg med uppdateringen som visas nedan, vilket är det vanliga DDPM-steget med posteriorvariansen som brusskala. Var 12:e bildruta utvärderas nätverket på ett rutnät med 28 × 28 celler vid den mellersta brusnivån, och storleken på dess brusförutsägelse, inverterad och normaliserad, målas som det svaga cyanfärgade skenet. Där det förutsagda bruset är litet ser punkten redan ut som data. Varje vandrare behåller ett spår på åtta bildrutor.",
          "Med minskad rörelse aktiverad startar animationsslingan aldrig. Nätverket tränas utanför skärmen i 1800 minibatcher, den omvända processen körs en gång från brus ner till t = 0, och ytan visar det färdiga tillståndet som en stillbild. Om du ändrar ett reglage skapas en ny stillbild, och ”Paus” är inaktiverad.",
        ],
        code: REVERSE_EXCERPT,
      },
      {
        heading: "Varför schemat avgör allt",
        paragraphs: [
          "De linjära konstanterna 0,0001 och 0,02 kommer från bildmodeller som använder omkring tusen steg. Med bara T = 40 steg ger produkten av de fyrtio faktorerna (1 − β) ᾱ_T ≈ 0,67, så det brusigaste träningsexemplet behåller fortfarande ungefär 82 procent av sin signalamplitud. Samplaren börjar däremot alltid från rent brus, ett tillstånd som nätverket aldrig såg under träningen. Kosinusschemat är byggt så att ᾱ når i praktiken noll vid det sista steget för vilket T som helst, och därför är det standard här. Om T höjs till 120 sjunker det linjära schemat till ᾱ_T ≈ 0,30, bättre men fortfarande långt från rent brus.",
        ],
      },
    ],
    experimentsHeading: "Prova det här",
    experiments: [
      {
        title: "Knäck det linjära schemat",
        text: "Byt till ”linjär β” och sänk T till 10. Här är ᾱ_T ungefär 0,90, så träningen visar aldrig nätverket något som liknar rent brus. Se hur vandrarna beter sig jämfört med kosinus vid samma T.",
      },
      {
        title: "Se lärandet mellan kohorterna",
        text: "Tryck på ”Återställ modellen” med spiraldatasetet och titta på de första kohorterna. Tidiga vandrare irrar omkring och missar armarna. När förlusten har stabiliserats följer samma omvända kedja spiralen mycket mer troget.",
      },
      {
        title: "Fler steg, finare vandring",
        text: "Behåll kosinus och sätt T till 120. Varje kohort tar nu 60 bildrutor i stället för 20, och spåren visar en mjukare, mer gradvis nedstigning från molnet till månarna.",
      },
      {
        title: "Dela upp klustren",
        text: "Välj ”tre kluster” och höj vandrarna till 400. Räkna ungefär hur många vandrare som hamnar i varje kluster. En vältränad modell fördelar dem ungefär jämnt, eftersom datamängden har lika många punkter i varje kluster.",
      },
    ],
  },
  no: {
    metaDescription:
      "Se en diffusjonsmodell bli trent live i nettleseren: Et lite MLP lærer å forutsi støy på 2D-data, og DDPM-vandrere fjerner støyen fra en gaussisk sky.",
    heading: "Slik fungerer denne utforskeren",
    intro:
      "To ting skjer samtidig på dette lerretet. I bakgrunnen trenes et svært lite nevralt nettverk til å kjenne igjen støy. I forgrunnen starter rosa vandrere som en sky av ren gaussisk støy og bruker nettverket, steg for steg, til å gå tilbake til de cyanfargede dataene. Når de er framme, trekkes en ny sky, og vandringen begynner på nytt, så du ser den samme modellen bli bedre fra en kohort til den neste. Dette er den samme oppskriften som diffusjonsmodeller for bilder bruker, krympet fra millioner av piksler til to koordinater.",
    sections: [
      {
        heading: "Støy framover, læring bakover",
        paragraphs: [
          "En diffusjonsmodell er definert av en framoverprosess som ingen trenger å lære: Ta et datapunkt x₀ og bland det med gaussisk støy ε i T små steg. Planen ᾱ_t sier hvor mye av originalen som er igjen ved steg t, så en støyete prøve kan lages i ett jafs med formelen nedenfor. Ved det siste steget skal det ideelt sett ikke være noe igjen av dataene.",
          "Nettverket ε_θ får det støyete punktet x_t og tiden t, og den eneste jobben er å gjette hvilken ε som ble blandet inn. Tapet er ganske enkelt den kvadrerte avstanden mellom gjetningen og den sanne støyen. Når det gjetter godt, kan prosessen kjøres baklengs: Start fra ren støy, trekk fra den forutsagte støyen litt om gangen, legg tilbake en liten mengde fersk tilfeldighet, og gjenta til t = 0. Denne omvendte kjeden er DDPM-sampleren (denoising diffusion probabilistic model).",
        ],
        formula:
          "x_t = \\sqrt{\\bar\\alpha_t}\\, x_0 + \\sqrt{1 - \\bar\\alpha_t}\\, \\varepsilon, \\qquad \\mathcal{L} = \\big\\lVert \\varepsilon - \\varepsilon_\\theta(x_t, t) \\big\\rVert^2",
      },
      {
        heading: "Hva kontrollene gjør",
        paragraphs: [
          "«Datasett» velger målformen: to måner (standard), tre gaussiske klynger eller en spiral med to armer. Hver av dem har 256 punkter. «Støyplan» veksler mellom en lineær β-plan, der støyen som legges til per steg vokser jevnt fra 0,0001 til 0,02, og kosinusplanen for ᾱ (standard), som former det gjenværende signalet som en kvart kosinus, slik at det faller mykt i starten og mot slutten.",
          "«Diffusjonssteg T» går fra 10 til 120 i sprang på 5, med 40 som standard. Bytter du datasett, plan eller T, kastes nettverket og et nytt trenes fra bunnen av, fordi en modell som er trent for én plan, ikke forstår en annen. «Vandrere» (20 til 400, standard 160) endrer bare hvor mange punkter som trekkes, og beholder den trente modellen. «Pause» fryser trening og sampling, og «Tilbakestill modellen» starter treningen på nytt uten å endre noen innstilling.",
          "Statuslinjen viser et løpende tap, glattet med et eksponentielt glidende gjennomsnitt, og en epoketeller som etter konvensjon tikker én gang for hver 30. minibatch.",
        ],
      },
      {
        heading: "Slik er den bygget",
        paragraphs: [
          "Det finnes ikke noe maskinlæringsbibliotek her. Score-nettverket er skrevet for hånd i ren TypeScript: fire innganger (x, y samt sinus og kosinus av πt/T som tidsinnbygging), to skjulte lag med 32 enheter og GELU-aktivering, og to utganger. Vektene ligger i Float32Array, starter med He-initialisering fra en tilfeldighetsgenerator med fast frø og oppdateres med håndskrevet backpropagation og en Adam-optimerer med læringsrate 0,005.",
          "Hvert animasjonsbilde kjører seks minibatcher med 48 treningseksempler og flytter deretter hver vandrer to omvendte steg med oppdateringen som vises nedenfor, som er det vanlige DDPM-steget med posteriorvariansen som støyskala. I hvert 12. bilde evalueres nettverket på et rutenett med 28 × 28 celler ved det midterste støynivået, og størrelsen på støyprediksjonen, invertert og normalisert, males som det svake cyanfargede skjæret. Der den forutsagte støyen er liten, ser punktet allerede ut som data. Hver vandrer beholder et spor på åtte bilder.",
          "Med redusert bevegelse slått på starter animasjonsløkken aldri. Nettverket trenes utenfor skjermen i 1800 minibatcher, den omvendte prosessen kjøres én gang fra støy ned til t = 0, og lerretet viser den ferdige tilstanden som et stillbilde. Endrer du en kontroll, lages et nytt stillbilde, og «Pause» er deaktivert.",
        ],
        code: REVERSE_EXCERPT,
      },
      {
        heading: "Hvorfor planen avgjør alt",
        paragraphs: [
          "De lineære konstantene 0,0001 og 0,02 kommer fra bildemodeller som bruker rundt tusen steg. Med bare T = 40 steg gir produktet av de førti faktorene (1 − β) ᾱ_T ≈ 0,67, så det mest støyete treningseksempelet beholder fortsatt omtrent 82 prosent av signalamplituden. Sampleren starter derimot alltid fra ren støy, en tilstand nettverket aldri så under treningen. Kosinusplanen er bygget slik at ᾱ når praktisk talt null ved det siste steget for enhver T, og derfor er den standard her. Økes T til 120, synker den lineære planen til ᾱ_T ≈ 0,30, bedre, men fortsatt langt fra ren støy.",
        ],
      },
    ],
    experimentsHeading: "Prøv dette",
    experiments: [
      {
        title: "Knekk den lineære planen",
        text: "Bytt til «lineær β» og senk T til 10. Her er ᾱ_T omtrent 0,90, så treningen viser aldri nettverket noe som ligner ren støy. Se hvordan vandrerne oppfører seg sammenlignet med kosinus ved samme T.",
      },
      {
        title: "Se læringen mellom kohortene",
        text: "Trykk «Tilbakestill modellen» med spiraldatasettet og følg de første kohortene. Tidlige vandrere virrer rundt og bommer på armene. Når tapet har stabilisert seg, tegner den samme omvendte kjeden spiralen langt mer trofast.",
      },
      {
        title: "Flere steg, finere vandring",
        text: "Behold kosinus og sett T til 120. Hver kohort tar nå 60 bilder i stedet for 20, og sporene viser en jevnere, mer gradvis nedstigning fra skyen til månene.",
      },
      {
        title: "Skill klyngene",
        text: "Velg «tre klynger» og øk vandrerne til 400. Tell omtrent hvor mange vandrere som ender i hver klynge. En godt trent modell fordeler dem omtrent jevnt, fordi dataene har like mange punkter i hver klynge.",
      },
    ],
  },
};
