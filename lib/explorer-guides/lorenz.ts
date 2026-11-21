import type { ExplorerGuide } from "./types";

// Numbers quoted here (24.74, 13.93, the 800-step warm-up, the 6000-point
// trail) match app/lorenz/explorer/page.tsx; update both together.
const RK4_EXCERPT = `const f = (x, y, z) => [
  sigma * (y - x),
  x * (rho - z) - y,
  x * y - beta * z,
];

// One classical Runge-Kutta step of size dt
const [k1x, k1y, k1z] = f(x, y, z);
const [k2x, k2y, k2z] = f(x + 0.5*dt*k1x, y + 0.5*dt*k1y, z + 0.5*dt*k1z);
const [k3x, k3y, k3z] = f(x + 0.5*dt*k2x, y + 0.5*dt*k2y, z + 0.5*dt*k2z);
const [k4x, k4y, k4z] = f(x + dt*k3x, y + dt*k3y, z + dt*k3z);
x += (dt / 6) * (k1x + 2*k2x + 2*k3x + k4x);  // same for y and z`;

export const LORENZ_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Play with the Lorenz attractor live: change σ, ρ and β, watch the butterfly appear at ρ ≈ 24.74, and see how the RK4 simulation behind it is built.",
    heading: "How this explorer works",
    intro:
      "The glowing curve is a single point moving through three-dimensional space according to the Lorenz equations. Every frame the simulation advances it a little further and leaves a fading trail behind, so what looks like a drawing is really the recent history of one trajectory. It never repeats and never settles, yet it never leaves the butterfly-shaped region either. That combination is what mathematicians call a strange attractor.",
    sections: [
      {
        heading: "The three equations",
        paragraphs: [
          "Edward Lorenz wrote these equations in 1963 as a drastically simplified model of air rising and falling in a layer heated from below. x stands for the strength of the convection roll, y and z for temperature differences inside it. The model is tiny: three variables, two products, nothing random. Lorenz noticed that rounding a starting value from six to three decimals produced a completely different forecast after a while, and that observation became the starting point of chaos theory.",
        ],
        formula:
          "\\dot x = \\sigma (y - x), \\quad \\dot y = x(\\rho - z) - y, \\quad \\dot z = xy - \\beta z",
      },
      {
        heading: "What the sliders do",
        paragraphs: [
          "σ (sigma) is the Prandtl number, the ratio between how fast the fluid smooths out motion and how fast it smooths out heat. ρ (rho) is the Rayleigh number, how strongly the layer is heated. β (beta) encodes the geometry of the convection cell. The classic values Lorenz used are σ = 10, ρ = 28 and β = 8/3; the reset button returns to exactly those.",
          "ρ is the slider with the most drama. Below ρ = 1 every trajectory falls into the origin: the fluid is at rest. Above 1 two new equilibrium points appear, one in the centre of each wing, and for moderate ρ the point simply spirals into one of them. Around ρ ≈ 13.93 trajectories start switching between the wings before they settle, and at ρ ≈ 24.74 both equilibria lose their stability. From there on nothing can settle and the butterfly is permanent.",
          "That threshold is not a guess. For σ = 10 and β = 8/3 it follows from the formula ρ = σ(σ + β + 3) / (σ − β − 1). It also explains a quieter effect: if you push σ below β + 1, the denominator turns negative and the two equilibria stay stable no matter how far you raise ρ.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "The simulation runs entirely in your browser on a 2D canvas. It integrates the equations with the classical fourth-order Runge-Kutta method (RK4), which evaluates the right-hand side four times per step and combines the slopes. Compared with the naive Euler method, RK4 stays accurate with much larger steps, which matters when you want twelve steps per animation frame on a phone.",
          "Each new position goes into a ring buffer of 6000 points stored in a Float32Array, so memory stays constant no matter how long the page runs. Points are coloured by age, from warm amber for the newest to violet for the oldest, and every frame paints a semi-transparent layer over the canvas, which produces the soft motion trail. The projection buttons choose which two of the three coordinates are drawn: XZ shows the familiar butterfly, XY the view from above, YZ the view from the side.",
          "Changing σ, ρ or β restarts the trajectory at (0.1, 0, 0), so you always see the same initial condition evolve under new rules. If your system asks for reduced motion, the animation is replaced by one still image: the simulation runs 800 warm-up steps to land on the attractor, then integrates the full trail at once and draws it a single time.",
        ],
        code: RK4_EXCERPT,
      },
      {
        heading: "Why the time step matters",
        paragraphs: [
          "The dt slider sets the size of each integration step. A smaller dt makes the curve smoother and slower, a larger one faster and coarser. Here is the twist: in a chaotic system even the tiny numerical error of RK4 grows exponentially, roughly doubling every 0.8 time units for the classic parameters. Two runs with different dt therefore follow different paths after a short while, even though both are correct pictures of the attractor. The shape is reliable; the exact route is not. That is Lorenz's original discovery, reproduced by your own browser.",
        ],
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "Watch the butterfly being born",
        text: "Set ρ to 20 and wait until the curve settles into a spiral. Then raise ρ slowly past 24 and 25. Somewhere around 24.74 the spiral stops closing in and the trajectory begins to jump between the wings for good.",
      },
      {
        title: "Switch off the chaos with σ",
        text: "Keep ρ at 28 and lower σ to 3. The equilibria are stable again and the point spirals into one wing. Raise σ back above 4 and the butterfly returns.",
      },
      {
        title: "Let the fluid rest",
        text: "Pull ρ below 1. All motion dies out and the point slides into the origin, the state in which the heated layer does not convect at all.",
      },
      {
        title: "See the same orbit from three sides",
        text: "With the classic values, switch between XZ, XY and YZ. It is the same set of points every time; only the camera changes. The view from above (XY) makes the two lobes look almost like a figure eight.",
      },
    ],
  },
  de: {
    metaDescription:
      "Den Lorenz-Attraktor live erkunden: σ, ρ und β verändern, den Schmetterling bei ρ ≈ 24,74 entstehen sehen und nachlesen, wie die RK4-Simulation gebaut ist.",
    heading: "So funktioniert dieser Explorer",
    intro:
      "Die leuchtende Kurve ist ein einzelner Punkt, der sich nach den Lorenz-Gleichungen durch den dreidimensionalen Raum bewegt. Mit jedem Frame rückt die Simulation ihn ein Stück weiter und hinterlässt eine verblassende Spur. Was wie eine Zeichnung aussieht, ist also die jüngste Geschichte einer einzigen Bahn. Sie wiederholt sich nie und kommt nie zur Ruhe, verlässt aber auch nie das schmetterlingsförmige Gebiet. Genau diese Kombination nennen Mathematiker:innen einen seltsamen Attraktor.",
    sections: [
      {
        heading: "Die drei Gleichungen",
        paragraphs: [
          "Edward Lorenz schrieb diese Gleichungen 1963 als stark vereinfachtes Modell für Luft, die in einer von unten beheizten Schicht auf- und absteigt. x steht für die Stärke der Konvektionswalze, y und z für Temperaturunterschiede darin. Das Modell ist winzig: drei Variablen, zwei Produkte, kein Zufall. Lorenz bemerkte, dass ein von sechs auf drei Nachkommastellen gerundeter Startwert nach einiger Zeit eine völlig andere Vorhersage lieferte. Aus dieser Beobachtung wurde die Chaostheorie.",
        ],
        formula:
          "\\dot x = \\sigma (y - x), \\quad \\dot y = x(\\rho - z) - y, \\quad \\dot z = xy - \\beta z",
      },
      {
        heading: "Was die Regler bewirken",
        paragraphs: [
          "σ (Sigma) ist die Prandtl-Zahl, das Verhältnis, wie schnell die Flüssigkeit Bewegung und wie schnell sie Wärme ausgleicht. ρ (Rho) ist die Rayleigh-Zahl, also wie stark die Schicht beheizt wird. β (Beta) beschreibt die Geometrie der Konvektionszelle. Lorenz verwendete σ = 10, ρ = 28 und β = 8/3; der Reset-Knopf stellt genau diese Werte wieder her.",
          "Am spannendsten ist ρ. Unter ρ = 1 fällt jede Bahn in den Ursprung: Die Flüssigkeit ruht. Oberhalb von 1 entstehen zwei neue Gleichgewichtspunkte, je einer in der Mitte eines Flügels, und bei mittlerem ρ spiralt der Punkt einfach in einen davon hinein. Ab etwa ρ ≈ 13,93 wechseln die Bahnen eine Weile zwischen den Flügeln, bevor sie sich festlegen, und bei ρ ≈ 24,74 verlieren beide Gleichgewichte ihre Stabilität. Ab dann kann nichts mehr zur Ruhe kommen, und der Schmetterling bleibt.",
          "Dieser Schwellenwert ist nicht geschätzt. Für σ = 10 und β = 8/3 folgt er aus der Formel ρ = σ(σ + β + 3) / (σ − β − 1). Sie erklärt auch einen leiseren Effekt: Schiebst du σ unter β + 1, wird der Nenner negativ, und die beiden Gleichgewichte bleiben stabil, egal wie weit du ρ erhöhst.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Die Simulation läuft vollständig in deinem Browser auf einem 2D-Canvas. Sie integriert die Gleichungen mit dem klassischen Runge-Kutta-Verfahren vierter Ordnung (RK4), das die rechte Seite pro Schritt viermal auswertet und die Steigungen kombiniert. Im Vergleich zum naiven Euler-Verfahren bleibt RK4 auch bei viel größeren Schritten genau. Das zählt, wenn zwölf Schritte pro Animationsframe auf einem Smartphone laufen sollen.",
          "Jede neue Position landet in einem Ringpuffer mit 6000 Punkten in einem Float32Array, der Speicher bleibt also konstant, egal wie lange die Seite läuft. Die Punkte sind nach Alter eingefärbt, von warmem Bernstein für die neuesten bis Violett für die ältesten, und jeder Frame legt eine halbtransparente Schicht über das Canvas. Daraus entsteht die weiche Bewegungsspur. Die Projektionsknöpfe wählen, welche zwei der drei Koordinaten gezeichnet werden: XZ zeigt den bekannten Schmetterling, XY die Ansicht von oben, YZ die von der Seite.",
          "Wenn du σ, ρ oder β änderst, startet die Bahn neu bei (0,1, 0, 0). So siehst du immer denselben Anfangszustand unter neuen Regeln. Wünscht dein System reduzierte Bewegung, ersetzt ein Standbild die Animation: Die Simulation rechnet 800 Aufwärmschritte, um auf dem Attraktor zu landen, integriert dann die ganze Spur auf einmal und zeichnet sie ein einziges Mal.",
        ],
        code: RK4_EXCERPT,
      },
      {
        heading: "Warum der Zeitschritt zählt",
        paragraphs: [
          "Der dt-Regler legt die Größe jedes Integrationsschritts fest. Ein kleineres dt macht die Kurve glatter und langsamer, ein größeres schneller und gröber. Der Clou: In einem chaotischen System wächst selbst der winzige Rechenfehler von RK4 exponentiell, bei den klassischen Parametern verdoppelt er sich ungefähr alle 0,8 Zeiteinheiten. Zwei Läufe mit unterschiedlichem dt folgen deshalb nach kurzer Zeit verschiedenen Wegen, obwohl beide korrekte Bilder des Attraktors sind. Die Form ist verlässlich, der genaue Weg nicht. Das ist Lorenz' ursprüngliche Entdeckung, nachgestellt von deinem eigenen Browser.",
        ],
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Die Geburt des Schmetterlings",
        text: "Stell ρ auf 20 und warte, bis die Kurve in eine Spirale übergeht. Erhöhe ρ dann langsam über 24 und 25. Irgendwo um 24,74 zieht sich die Spirale nicht mehr zusammen, und die Bahn springt dauerhaft zwischen den Flügeln hin und her.",
      },
      {
        title: "Das Chaos mit σ abschalten",
        text: "Lass ρ auf 28 und senke σ auf 3. Die Gleichgewichte sind wieder stabil, und der Punkt spiralt in einen Flügel. Hebst du σ wieder über 4, kehrt der Schmetterling zurück.",
      },
      {
        title: "Die Flüssigkeit zur Ruhe bringen",
        text: "Zieh ρ unter 1. Jede Bewegung erstirbt, und der Punkt gleitet in den Ursprung, den Zustand, in dem die beheizte Schicht gar nicht konvektiert.",
      },
      {
        title: "Dieselbe Bahn von drei Seiten",
        text: "Wechsle bei den klassischen Werten zwischen XZ, XY und YZ. Es sind jedes Mal dieselben Punkte, nur die Kamera ändert sich. Von oben (XY) sehen die beiden Flügel fast wie eine Acht aus.",
      },
    ],
  },
};
