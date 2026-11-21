import type { ExplorerGuide } from "./types";

// Numbers quoted here (2400 steps per frame, dt 0.005 to 0.02, the 24000-step
// still image with a 600-step warm-up, the 0.04 trail fade) match
// app/aizawa/explorer/page.tsx; update both together.
const RK4_EXCERPT = `deriv: (x, y, z, p) => {
  const [a, b, c, d, e, f] = p;
  const dx = (z - b) * x - d * y;
  const dy = d * x + (z - b) * y;
  const dz = c + a * z - (z * z * z) / 3 - (x * x + y * y) * (1 + e * z) + f * z * x * x * x;
  return [dx, dy, dz];
},

function rk4Step(f, x, y, z, p, dt) {
  const h = 0.5 * dt;
  const k1 = f(x, y, z, p);
  const k2 = f(x + h * k1[0], y + h * k1[1], z + h * k1[2], p);
  const k3 = f(x + h * k2[0], y + h * k2[1], z + h * k2[2], p);
  const k4 = f(x + dt * k3[0], y + dt * k3[1], z + dt * k3[2], p);
  const w = dt / 6;
  return [
    x + w * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]),
    y + w * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]),
    z + w * (k1[2] + 2 * k2[2] + 2 * k3[2] + k4[2]),
  ];
}

// inside the frame loop, stepsPerFrame times:
[x, y, z] = rk4Step(attractor.deriv, x, y, z, params, dt);
guard(); // re-seed at (0.1, 0, 0) if a value stopped being finite`;

const AIZAWA_FORMULA =
  "\\begin{aligned} \\dot x &= (z - b)\\,x - d\\,y \\\\ \\dot y &= d\\,x + (z - b)\\,y \\\\ \\dot z &= c + a z - \\tfrac{z^3}{3} - (x^2 + y^2)(1 + e z) + f z x^3 \\end{aligned}";

const CYLINDER_FORMULA = "\\dot r = (z - b)\\,r, \\qquad \\dot\\theta = d";

export const AIZAWA_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Rotate the Aizawa attractor in 3D, tune all six parameters a to f, and compare it with Rössler, Thomas and Halvorsen. See why f is the key to its chaos.",
    heading: "How this explorer works",
    intro:
      "The cloud of rose dots is the path of a single point moving through three-dimensional space under the Aizawa equations. Every frame it advances a few thousand steps and leaves a dot at each one, while older dots fade. What builds up is a sphere-like shell wrapped around a vertical axis, with a thin tube running up through its middle. The point never repeats itself and never settles down, yet it never leaves that shape either: a strange attractor.",
    sections: [
      {
        heading: "Six parameters, three equations",
        paragraphs: [
          "The system has three coordinates and six constants. The defaults are a = 0.95, b = 0.7, c = 0.6, d = 3.5, e = 0.25 and f = 0.1, the values usually quoted for this attractor, and the reset button returns to exactly those. The third equation carries the nonlinear terms, including the small extra term f z x³.",
        ],
        formula: AIZAWA_FORMULA,
      },
      {
        heading: "Reading the equations in cylinder coordinates",
        paragraphs: [
          "The first two equations become much clearer if you describe x and y by a radius r and an angle θ around the z axis. Then they say exactly this: the point turns around the axis at constant angular speed d, and its distance from the axis grows while z is above b and shrinks while z is below b. So d is simply the spin rate, and b is the height of an invisible horizontal plane that separates outward motion from inward motion.",
          "Now look at the third equation with f = 0. Every term depends only on z and on x² + y² = r², not on the angle. The whole system is then rotationally symmetric: the angle just turns uniformly, and the interesting part reduces to two variables, r and z. A smooth two-dimensional system cannot be chaotic (that is the Poincaré-Bendixson theorem), so with f = 0 the orbit has to settle onto something regular, like a ring or a smooth torus. The tiny term f z x³ is what breaks the symmetry, because x³ depends on the angle. It is the reason this attractor is chaotic at all.",
        ],
        formula: CYLINDER_FORMULA,
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "The six parameter sliders cover a from 0.5 to 1.5, b from 0.3 to 1.2, c from 0.2 to 1.5, d from 2 to 6, e from 0.1 to 0.6 and f from 0 to 0.3. Changing a parameter does not restart the orbit: the point simply continues under the new rules, and you watch the old shape dissolve into the new one. The dt slider (0.005 to 0.02, default 0.01) sets the size of each integration step.",
          "Steps per frame runs from 200 to 6000 and starts at 2400. Drag the canvas to rotate the view, toggle auto-rotate to stop the slow spin, and use Clear & restart to wipe the canvas and send the point back to its starting position (0.1, 0, 0). The attractor buttons switch to Rössler, Thomas or Halvorsen with their own classic parameters.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "Everything runs in your browser on a 2D canvas. Like the Lorenz explorer, it integrates with the classical fourth-order Runge-Kutta method (RK4): four evaluations of the derivative per step, combined so that the error per step shrinks with the fifth power of dt. The simpler forward Euler method (one evaluation, multiply by dt, add) was not accurate enough here: at dt = 0.02 its Aizawa orbit collapsed onto a fixed point, and on the Halvorsen system it blew up. With RK4 the shape stays the same across the whole dt slider. A guard still re-seeds the point at (0.1, 0, 0) whenever a coordinate turns into NaN or infinity, so the canvas recovers instead of going blank.",
          "Each 3D point is turned into a pixel by two rotations, first around the vertical axis (yaw), then around the horizontal one (pitch), followed by a plain orthographic projection. A depth value sets each dot's opacity, so the near side reads brighter. The trail comes from painting the background colour over the whole canvas at 4 % opacity every frame, so old dots fade out over roughly a second. If your system asks for reduced motion, there is no animation at all: the explorer integrates 24000 steps at once, skips the first 600 so the transient does not show, draws a single frozen frame, and repaints it when you drag or move a slider.",
        ],
        code: RK4_EXCERPT,
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "Switch off the chaos with f",
        text: "Pull f all the way down to 0 and press Clear & restart. With the symmetry restored, the orbit can no longer be chaotic and settles onto a regular, rotationally symmetric shape. Then raise f back to 0.1.",
      },
      {
        title: "Move the dividing plane",
        text: "Slide b between 0.5 and 1.0. Since b is the height where outward drift turns into inward drift, the shape stretches and squeezes along the vertical axis. If the orbit escapes, use Clear & restart.",
      },
      {
        title: "Follow a single orbit",
        text: "Turn auto-rotate off and drop steps per frame to 200. Now you can see the point spiralling around the axis, climbing the central tube and falling back onto the shell.",
      },
      {
        title: "Visit the relatives",
        text: "Switch to Rössler and lower c from 5.7 toward 2.5: the chaotic band simplifies into fewer and fewer loops. Then try Thomas with b near 0.05, where the point wanders through a whole lattice of cells instead of staying in one.",
      },
    ],
  },
  de: {
    metaDescription:
      "Den Aizawa-Attraktor in 3D drehen, die Parameter a bis f einstellen und mit Rössler, Thomas und Halvorsen vergleichen. Warum f der Schlüssel zum Chaos ist.",
    heading: "So funktioniert dieser Explorer",
    intro:
      "Die Wolke aus rosafarbenen Punkten ist die Bahn eines einzigen Punkts, der sich nach den Aizawa-Gleichungen durch den dreidimensionalen Raum bewegt. In jedem Frame rückt er ein paar tausend Schritte weiter und hinterlässt bei jedem einen Punkt, während ältere verblassen. So entsteht eine kugelartige Hülle um eine senkrechte Achse, durch deren Mitte eine dünne Röhre läuft. Der Punkt wiederholt sich nie und kommt nie zur Ruhe, verlässt diese Form aber auch nie: ein seltsamer Attraktor.",
    sections: [
      {
        heading: "Sechs Parameter, drei Gleichungen",
        paragraphs: [
          "Das System hat drei Koordinaten und sechs Konstanten. Voreingestellt sind a = 0,95, b = 0,7, c = 0,6, d = 3,5, e = 0,25 und f = 0,1, die üblichen Werte für diesen Attraktor; der Reset-Knopf stellt genau diese wieder her. In der dritten Gleichung stecken die nichtlinearen Terme, darunter der kleine Zusatzterm f z x³.",
        ],
        formula: AIZAWA_FORMULA,
      },
      {
        heading: "Die Gleichungen in Zylinderkoordinaten",
        paragraphs: [
          "Die ersten beiden Gleichungen werden viel klarer, wenn du x und y durch einen Radius r und einen Winkel θ um die z-Achse beschreibst. Dann sagen sie genau das: Der Punkt dreht sich mit konstanter Winkelgeschwindigkeit d um die Achse, und sein Abstand zur Achse wächst, solange z über b liegt, und schrumpft, solange z unter b liegt. d ist also schlicht die Drehgeschwindigkeit, und b ist die Höhe einer unsichtbaren waagerechten Ebene, die Bewegung nach außen von Bewegung nach innen trennt.",
          "Schau dir jetzt die dritte Gleichung mit f = 0 an. Jeder Term hängt nur von z und von x² + y² = r² ab, nicht vom Winkel. Das ganze System ist dann rotationssymmetrisch: Der Winkel dreht sich gleichmäßig weiter, und der spannende Teil schrumpft auf zwei Variablen, r und z. Ein glattes zweidimensionales System kann nicht chaotisch sein (das besagt der Satz von Poincaré-Bendixson), also muss die Bahn bei f = 0 auf etwas Regelmäßiges zulaufen, etwa einen Ring oder einen glatten Torus. Erst der winzige Term f z x³ bricht die Symmetrie, weil x³ vom Winkel abhängt. Er ist der Grund, warum dieser Attraktor überhaupt chaotisch ist.",
        ],
        formula: CYLINDER_FORMULA,
      },
      {
        heading: "Was die Regler bewirken",
        paragraphs: [
          "Die sechs Parameterregler reichen für a von 0,5 bis 1,5, für b von 0,3 bis 1,2, für c von 0,2 bis 1,5, für d von 2 bis 6, für e von 0,1 bis 0,6 und für f von 0 bis 0,3. Eine Parameteränderung startet die Bahn nicht neu: Der Punkt läuft einfach nach den neuen Regeln weiter, und du siehst, wie sich die alte Form in die neue auflöst. Der dt-Regler (0,005 bis 0,02, Standard 0,01) legt die Größe jedes Integrationsschritts fest.",
          "Schritte pro Frame reicht von 200 bis 6000 und startet bei 2400. Zieh am Canvas, um die Ansicht zu drehen, schalte die Auto-Rotation ab, um das langsame Kreisen zu stoppen, und nutze «Löschen & neu starten», um das Bild zu leeren und den Punkt zurück auf (0,1, 0, 0) zu setzen. Über die Attraktor-Knöpfe wechselst du zu Rössler, Thomas oder Halvorsen mit ihren eigenen klassischen Parametern.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Alles läuft in deinem Browser auf einem 2D-Canvas. Wie der Lorenz-Explorer integriert er mit dem klassischen Runge-Kutta-Verfahren vierter Ordnung (RK4): vier Auswertungen der Ableitung pro Schritt, so kombiniert, dass der Fehler pro Schritt mit der fünften Potenz von dt schrumpft. Das einfachere explizite Euler-Verfahren (eine Auswertung, mit dt multiplizieren, addieren) war hier nicht genau genug: Bei dt = 0,02 fiel die Aizawa-Bahn damit auf einen Fixpunkt zusammen, und beim Halvorsen-System lief sie davon. Mit RK4 bleibt die Form über den ganzen dt-Regler gleich. Weiterhin setzt ein Wächter den Punkt auf (0,1, 0, 0) zurück, sobald eine Koordinate NaN oder unendlich wird. So erholt sich das Bild, statt leer zu bleiben.",
          "Jeder 3D-Punkt wird durch zwei Drehungen zu einem Pixel, zuerst um die senkrechte Achse (Gieren), dann um die waagerechte (Nicken), gefolgt von einer einfachen Parallelprojektion. Ein Tiefenwert bestimmt die Deckkraft jedes Punkts, die vordere Seite wirkt dadurch heller. Die Spur entsteht, weil jeder Frame die Hintergrundfarbe mit 4 % Deckkraft über das ganze Canvas legt; alte Punkte verblassen so in etwa einer Sekunde. Wünscht dein System reduzierte Bewegung, gibt es keine Animation: Der Explorer rechnet 24000 Schritte auf einmal, überspringt die ersten 600, damit der Einschwingvorgang nicht zu sehen ist, zeichnet ein einziges Standbild und aktualisiert es, wenn du ziehst oder einen Regler bewegst.",
        ],
        code: RK4_EXCERPT,
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Das Chaos mit f abschalten",
        text: "Zieh f ganz auf 0 und drück «Löschen & neu starten». Mit wiederhergestellter Symmetrie kann die Bahn nicht mehr chaotisch sein und läuft auf eine regelmäßige, rotationssymmetrische Form zu. Erhöhe f danach wieder auf 0,1.",
      },
      {
        title: "Die Trennebene verschieben",
        text: "Schieb b zwischen 0,5 und 1,0 hin und her. Weil b die Höhe ist, an der die Drift nach außen in eine Drift nach innen umschlägt, streckt und staucht sich die Form entlang der senkrechten Achse. Läuft die Bahn davon, hilft «Löschen & neu starten».",
      },
      {
        title: "Einer einzelnen Bahn folgen",
        text: "Schalte die Auto-Rotation ab und senke die Schritte pro Frame auf 200. Jetzt siehst du, wie der Punkt um die Achse kreist, die zentrale Röhre hinaufklettert und zurück auf die Hülle fällt.",
      },
      {
        title: "Die Verwandtschaft besuchen",
        text: "Wechsle zu Rössler und senke c von 5,7 in Richtung 2,5: Das chaotische Band vereinfacht sich zu immer weniger Schleifen. Probier danach Thomas mit b nahe 0,05. Dort wandert der Punkt durch ein ganzes Gitter von Zellen, statt in einer zu bleiben.",
      },
    ],
  },
};
