import type { ExplorerGuide } from "./types";

// Numbers quoted here (defaults 90°/90°, L = 120 px, g = 1000 px/s², dt 0.005,
// the 1e-6 rad ghost offset, ~18 s until the twins separate by 10 px, energy
// drift at dt 0.02) match app/doublependulum/explorer/page.tsx and were
// checked by running the same RK4 code; update both together.
const DERIV_EXCERPT = `function deriv(s: PendulumState, p: Params) {
  const { th1, th2, w1, w2 } = s;
  const { m1, m2, L1, L2, g } = p;
  const d = th1 - th2;
  const den = 2 * m1 + m2 - m2 * Math.cos(2 * th1 - 2 * th2);
  const a1 =
    (-g * (2 * m1 + m2) * Math.sin(th1) -
      m2 * g * Math.sin(th1 - 2 * th2) -
      2 * Math.sin(d) * m2 * (w2 * w2 * L2 + w1 * w1 * L1 * Math.cos(d))) /
    (L1 * den);
  const a2 =
    (2 * Math.sin(d) *
      (w1 * w1 * L1 * (m1 + m2) + g * (m1 + m2) * Math.cos(th1) +
        w2 * w2 * L2 * m2 * Math.cos(d))) /
    (L2 * den);
  return [w1, w2, a1, a2];
}`;

export const DOUBLE_PENDULUM_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Simulate a chaotic double pendulum live: set masses, rod lengths, gravity and start angles, and watch a ghost twin offset by 0.000001 rad drift away.",
    heading: "How this explorer works",
    intro:
      "Two rigid rods, two point masses, one pivot, gravity, and no friction. That is the whole system on the canvas, and for small swings it behaves like an ordinary pendulum. Release it from higher up and the lower arm starts to flip over, whirl and pause in ways that never quite repeat. The rose trail traces the lower mass. The pale blue copy behind it, the ghost twin, starts at almost exactly the same position and shows how quickly almost the same becomes completely different.",
    sections: [
      {
        heading: "Simple parts, chaotic whole",
        paragraphs: [
          "The state of the double pendulum is four numbers: the two angles θ₁ and θ₂ measured from straight down, and the two angular velocities ω₁ and ω₂. The equations of motion follow from the Lagrangian, kinetic energy minus potential energy, written in those angles. Because the second rod hangs from a moving point, the two angles are coupled through terms with cos(θ₁ − θ₂), and that coupling is what makes the motion chaotic at higher energies.",
          "Without friction the total energy below cannot change, and that is the only conserved quantity the system has in general. With four state variables and one conservation law, there is room for chaos, and for large enough swings it appears: tiny differences in the start grow roughly exponentially until the two motions have nothing in common.",
        ],
        formula:
          "E = \\tfrac12 (m_1 + m_2) L_1^2 \\omega_1^2 + \\tfrac12 m_2 L_2^2 \\omega_2^2 + m_2 L_1 L_2 \\omega_1 \\omega_2 \\cos(\\theta_1 - \\theta_2) - (m_1 + m_2) g L_1 \\cos\\theta_1 - m_2 g L_2 \\cos\\theta_2",
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "m₁ and m₂ set the two masses (0.5 to 2, both 1 by default); the bobs grow with the square root of their mass. L₁ and L₂ are the rod lengths in pixels (40 to 200, default 120). Gravity g runs from 200 to 2400 px/s², default 1000. Lengths and gravity share the pixel unit on purpose: a simple pendulum of 120 px under 1000 px/s² would swing with a period of about 2.2 seconds, so the motion reads like a real pendulum of the same proportions.",
          "θ₁ initial and θ₂ initial set the release angles (−180° to 180°); both start at 90°, with both rods horizontal and pointing the same way. Changing any physical value or start angle restarts the motion from rest. Speed scales simulated time against wall-clock time from 0.1× to 3×. Time step dt (0.001 to 0.02, default 0.005) is the size of one integration step. Trail length keeps the last 200 to 2000 positions of the lower bob.",
          "The ghost twin starts with θ₁ larger by one millionth of a radian. The readout shows both angles, the total energy E, and Δ, the distance in pixels between the two lower bobs.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "The function below returns the time derivatives of the four state variables, in the standard closed form for two point masses on massless rods. It is integrated with the classical fourth-order Runge-Kutta method. Each animation frame measures the real time elapsed since the last one (capped at 0.05 s so a background tab does not jump), multiplies it by the speed, and runs as many RK4 steps of size dt as fit, carrying any remainder to the next frame. That keeps the motion at the same pace on 60 Hz and 120 Hz screens.",
          "The main pendulum and the ghost are integrated side by side with the same steps. Both trails are ring buffers in Float32Arrays, with NaN marking empty slots, and are drawn as small squares that fade from old to new. If any angle or velocity becomes non-finite or an angular velocity exceeds 100 rad/s, a guard resets both pendulums and shows a short notice. With reduced motion enabled, the simulation starts paused and shows a still frame; the Play button starts it when you want.",
        ],
        code: DERIV_EXCERPT,
      },
      {
        heading: "Reading the energy readout",
        paragraphs: [
          "Energy is the honesty check for the integrator. With the default start the pendulum is released from rest with both masses at pivot height, so E starts at exactly 0 and should stay there. At dt = 0.005 it stays within about one unit over a minute, out of a natural scale of hundreds of thousands. RK4 does not conserve energy exactly, though, and at dt = 0.02 the drift grows to hundreds of units within the first minute. Δ tells a different story: it grows because of chaos, not because of numerical error, and it does so even when E is perfectly steady.",
        ],
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "Count the seconds of agreement",
        text: "Keep every default and watch Δ. For the first stretch it reads 0.00 px; after roughly 15 to 20 seconds the ghost visibly separates, and soon the two pendulums move independently.",
      },
      {
        title: "Find the calm region",
        text: "Set both start angles to 20°. The motion is a gentle, regular wobble, and the ghost stays glued to the main pendulum for as long as you care to watch. Try 45° for both: still no visible separation within a minute.",
      },
      {
        title: "Push the integrator",
        text: "Return to the defaults, then raise dt to 0.02. The motion looks similar, but the energy readout now wanders by hundreds of units instead of staying near 0. Lower dt to 0.001 and E holds still to two decimals.",
      },
      {
        title: "Start from the top",
        text: "Set θ₁ to 180° and θ₂ to 90°. The upper rod starts balanced straight up, with far more energy than the default. The lower arm flips over repeatedly, and Δ climbs past 10 px after only about ten seconds.",
      },
    ],
  },
  de: {
    metaDescription:
      "Chaotisches Doppelpendel live: Massen, Stablängen, Schwerkraft und Startwinkel einstellen und sehen, wie ein um 0,000001 rad versetzter Zwilling abdriftet.",
    heading: "So funktioniert dieser Explorer",
    intro:
      "Zwei starre Stäbe, zwei Punktmassen, ein Aufhängepunkt, Schwerkraft und keine Reibung. Mehr steckt nicht im System auf dem Canvas, und bei kleinen Ausschlägen benimmt es sich wie ein gewöhnliches Pendel. Lässt du es weiter oben los, beginnt der untere Arm sich zu überschlagen, zu wirbeln und innezuhalten, ohne sich je genau zu wiederholen. Die rosa Spur zeichnet die untere Masse nach. Die blassblaue Kopie dahinter, der Geisterzwilling, startet fast exakt an derselben Stelle und zeigt, wie schnell aus fast gleich etwas völlig anderes wird.",
    sections: [
      {
        heading: "Einfache Teile, chaotisches Ganzes",
        paragraphs: [
          "Der Zustand des Doppelpendels besteht aus vier Zahlen: den Winkeln θ₁ und θ₂, gemessen von der Senkrechten nach unten, und den Winkelgeschwindigkeiten ω₁ und ω₂. Die Bewegungsgleichungen folgen aus der Lagrange-Funktion, also kinetischer minus potenzieller Energie, ausgedrückt in diesen Winkeln. Weil der zweite Stab an einem bewegten Punkt hängt, sind die Winkel über Terme mit cos(θ₁ − θ₂) gekoppelt, und genau diese Kopplung macht die Bewegung bei höherer Energie chaotisch.",
          "Ohne Reibung kann sich die Gesamtenergie unten nicht ändern, und im Allgemeinen ist sie die einzige Erhaltungsgröße des Systems. Vier Zustandsgrößen und nur ein Erhaltungssatz lassen Platz für Chaos, und bei genügend großen Ausschlägen tritt es auf: Winzige Unterschiede im Start wachsen ungefähr exponentiell, bis die beiden Bewegungen nichts mehr miteinander zu tun haben.",
        ],
        formula:
          "E = \\tfrac12 (m_1 + m_2) L_1^2 \\omega_1^2 + \\tfrac12 m_2 L_2^2 \\omega_2^2 + m_2 L_1 L_2 \\omega_1 \\omega_2 \\cos(\\theta_1 - \\theta_2) - (m_1 + m_2) g L_1 \\cos\\theta_1 - m_2 g L_2 \\cos\\theta_2",
      },
      {
        heading: "Was die Regler bewirken",
        paragraphs: [
          "m₁ und m₂ legen die beiden Massen fest (0,5 bis 2, beide standardmäßig 1), die Kugeln wachsen mit der Wurzel ihrer Masse. L₁ und L₂ sind die Stablängen in Pixeln (40 bis 200, Standard 120). Die Schwerkraft g reicht von 200 bis 2400 px/s², Standard 1000. Längen und Schwerkraft teilen sich absichtlich die Einheit Pixel: Ein einfaches Pendel von 120 px unter 1000 px/s² hätte eine Periode von etwa 2,2 Sekunden, die Bewegung wirkt also wie bei einem echten Pendel derselben Proportionen.",
          "Die Startwinkel θ₁ und θ₂ bestimmen die Auslenkung beim Loslassen (−180° bis 180°). Beide starten bei 90°, beide Stäbe liegen also waagrecht in dieselbe Richtung. Jede Änderung eines physikalischen Werts oder Startwinkels startet die Bewegung neu aus der Ruhe. Das Tempo skaliert die simulierte Zeit gegenüber der Uhrzeit von 0,1× bis 3×. Der Zeitschritt dt (0,001 bis 0,02, Standard 0,005) ist die Größe eines Integrationsschritts. Die Spurlänge hält die letzten 200 bis 2000 Positionen der unteren Kugel fest.",
          "Der Geisterzwilling startet mit einem um ein Millionstel Radiant größeren θ₁. Die Anzeige zeigt beide Winkel, die Gesamtenergie E und Δ, den Abstand der beiden unteren Kugeln in Pixeln.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Die Funktion unten liefert die Zeitableitungen der vier Zustandsgrößen, in der üblichen geschlossenen Form für zwei Punktmassen an masselosen Stäben. Integriert wird mit dem klassischen Runge-Kutta-Verfahren vierter Ordnung. Jeder Animationsframe misst die seit dem letzten Frame vergangene echte Zeit (gedeckelt bei 0,05 s, damit ein Tab im Hintergrund keinen Sprung macht), multipliziert sie mit dem Tempo und rechnet so viele RK4-Schritte der Größe dt, wie hineinpassen. Der Rest wird in den nächsten Frame übertragen. So läuft die Bewegung auf 60-Hz- und 120-Hz-Bildschirmen gleich schnell.",
          "Hauptpendel und Geist werden Seite an Seite mit denselben Schritten integriert. Beide Spuren sind Ringpuffer in Float32Arrays, NaN markiert leere Plätze, und sie werden als kleine Quadrate gezeichnet, die von alt nach neu heller werden. Wird ein Winkel oder eine Geschwindigkeit nicht endlich oder überschreitet eine Winkelgeschwindigkeit 100 rad/s, setzt ein Wächter beide Pendel zurück und blendet kurz einen Hinweis ein. Ist reduzierte Bewegung eingestellt, startet die Simulation pausiert mit einem Standbild. Der Start-Knopf setzt sie in Gang, wenn du willst.",
        ],
        code: DERIV_EXCERPT,
      },
      {
        heading: "Die Energieanzeige lesen",
        paragraphs: [
          "Die Energie ist die Ehrlichkeitsprobe für den Integrator. Beim Standardstart wird das Pendel aus der Ruhe losgelassen, beide Massen auf Höhe des Aufhängepunkts, deshalb beginnt E bei genau 0 und sollte dort bleiben. Bei dt = 0,005 bleibt es über eine Minute innerhalb von etwa einer Einheit, bei einer natürlichen Größenordnung von Hunderttausenden. RK4 erhält die Energie aber nicht exakt, und bei dt = 0,02 wächst die Abweichung schon in der ersten Minute auf Hunderte Einheiten. Δ erzählt etwas anderes: Es wächst wegen des Chaos, nicht wegen Rechenfehlern, und das auch dann, wenn E völlig ruhig bleibt.",
        ],
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Die Sekunden der Einigkeit zählen",
        text: "Lass alle Standardwerte stehen und beobachte Δ. Zuerst steht dort 0,00 px. Nach etwa 15 bis 20 Sekunden trennt sich der Geist sichtbar, und bald bewegen sich die beiden Pendel unabhängig voneinander.",
      },
      {
        title: "Die ruhige Zone finden",
        text: "Stell beide Startwinkel auf 20°. Die Bewegung ist ein sanftes, regelmäßiges Wackeln, und der Geist klebt am Hauptpendel, so lange du zuschauen magst. Probier 45° für beide: Auch dann trennt sich innerhalb einer Minute nichts sichtbar.",
      },
      {
        title: "Den Integrator fordern",
        text: "Geh zurück zu den Standardwerten und erhöhe dt auf 0,02. Die Bewegung sieht ähnlich aus, aber die Energieanzeige schwankt jetzt um Hunderte Einheiten, statt nahe 0 zu bleiben. Senk dt auf 0,001, und E steht auf zwei Nachkommastellen still.",
      },
      {
        title: "Von ganz oben starten",
        text: "Stell θ₁ auf 180° und θ₂ auf 90°. Der obere Stab startet senkrecht nach oben balanciert, mit viel mehr Energie als beim Standard. Der untere Arm überschlägt sich immer wieder, und Δ überschreitet schon nach etwa zehn Sekunden 10 px.",
      },
    ],
  },
};
