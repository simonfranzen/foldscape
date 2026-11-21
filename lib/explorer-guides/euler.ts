import type { ExplorerGuide } from "./types";

// Numbers quoted here (speed 0.05 to 3 rad/s, default 0.6, the 0.02 rad
// window around π, the 0.05 s frame clamp) match
// app/euler/explorer/page.tsx; update both together.
const TICK_EXCERPT = `useEffect(() => {
  if (!running) return;
  let raf = 0;
  let prev = performance.now();
  const tick = (now: number) => {
    const dt = Math.min((now - prev) / 1000, 0.05);
    prev = now;
    const next = thetaRef.current + speedRef.current * dt;
    setTheta(((next % TAU) + TAU) % TAU);
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}, [running]);

// in the renderer: the point e^(iθ), with canvas y pointing down
const px = cx + R * Math.cos(t);
const py = cy - R * Math.sin(t);`;

export const EULER_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "See Euler's formula e^(iθ) = cos θ + i sin θ move: drag the angle around the unit circle, watch cos and sin trace their waves, and land on e^(iπ) + 1 = 0.",
    heading: "How this explorer works",
    intro:
      "The large canvas is the complex plane, with the real numbers running left to right and the imaginary numbers running up. The bright point is e^(iθ) for the current angle θ. As θ grows, the point travels counter-clockwise around the circle of radius 1, the arc it has swept is drawn in amber, and dashed lines drop from the point to both axes. The strip below plots cos θ and sin θ over one full turn, with a cursor at the current angle: the circle and the two waves are one and the same motion.",
    sections: [
      {
        heading: "One formula, three readings",
        paragraphs: [
          "Euler's formula says that raising e to an imaginary power produces a point on the unit circle. The real part of e^(iθ) is cos θ and the imaginary part is sin θ. Leonhard Euler published it in his Introductio in analysin infinitorum in 1748, and one way to see why it holds is to put iθ into the power series of the exponential function. The powers of i cycle through i, −1, −i, 1, so the even terms collect into the series for cos θ and the odd terms into i times the series for sin θ.",
          "A second reading is about motion. The derivative of e^(iθ) with respect to θ is i·e^(iθ), and multiplying by i rotates a complex number by a quarter turn. So the velocity of the point is always at right angles to its position and always of length 1. A point that moves at unit speed and always sideways to its own radius can only go round in a circle, and θ is exactly the distance travelled along it.",
          "The third reading is the famous special case. At θ = π the point has travelled half the circle and sits at −1, so e^(iπ) + 1 = 0, an equation that links e, i, π, 1 and 0.",
        ],
        formula: "e^{i\\theta} = \\cos\\theta + i \\sin\\theta, \\qquad e^{i\\pi} + 1 = 0",
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "The Angle θ slider runs from 0 to 2π in steps of 0.01 radians. The five buttons below jump to the quarter turns 0, π/2, π, 3π/2 and 2π, labelled with where the point lands: 1, i, −1, −i and 1 again. The overlay in the corner of the plane shows θ, cos θ, sin θ and the point written as a + bi.",
          "Play animates θ at a constant angular speed, set by the Speed slider from 0.05 to 3 radians per second (default 0.6, so a full turn takes about 10.5 seconds). When θ passes 2π it wraps back to 0. Reset sets θ to 0 again. Whenever θ is within 0.02 radians of π, the point turns rose, the plane gets a faint rose wash, and the banner e^(iπ) + 1 = 0 appears at the top.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "Both pictures are 2D canvases sized to the device pixel ratio. There is no permanent animation loop: each canvas redraws only when θ, the canvas size or the reset counter changes, which means an idle page draws nothing at all.",
          "The animation loop exists only while Play is active. Each frame it measures the time since the previous frame, caps it at 0.05 seconds so returning to a background tab does not fling the point around, adds speed times elapsed time to θ, and wraps the result into the range from 0 to 2π. Because the page opens paused and only moves when you press Play, there is nothing to switch off for reduced motion; dragging the slider works the same either way.",
          "The renderer converts θ to screen coordinates with one cosine and one sine. The minus sign on the y coordinate is the only subtle part: canvas y points down, mathematical y points up.",
        ],
        code: TICK_EXCERPT,
      },
      {
        heading: "Why angles are measured in radians here",
        paragraphs: [
          "The formula only works this neatly when θ is in radians, where one radian is the angle whose arc on the unit circle has length 1. That is why θ is also the length of the amber arc: at θ = π the arc is half the circumference of a circle with radius 1, which is π. Measure the angle in degrees instead and the formula picks up an awkward factor of π/180 in the exponent.",
        ],
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "Catch the identity moment",
        text: "Set the speed to 0.05 and press Play from θ = 0. After about a minute the point reaches π, the plane flashes rose and the banner stays up for almost a second. At the default 0.6 the same window passes in a blink.",
      },
      {
        title: "Read cos and sin off the circle",
        text: "Drag θ slowly from 0 to π/2. On the plane the point rises and moves left; in the strip the cyan sin curve climbs to 1 while the amber cos curve falls to 0. At π/2 the overlay shows z = 0.000 + 1.000 i, which is i.",
      },
      {
        title: "Find where cos equals sin",
        text: "Move the slider to about 0.785 radians, or 45 degrees. The point sits on the diagonal, both dashed lines have the same length, and the readout shows cos θ and sin θ both near 0.7071, which is 1/√2.",
      },
      {
        title: "Multiply by i with a quarter turn",
        text: "Click the buttons in order: 0, π/2, π, 3π/2, 2π. Each click adds π/2 to θ, which multiplies the point by e^(iπ/2) = i. The landing points 1, i, −1, −i, 1 are exactly the powers of i.",
      },
    ],
  },
  de: {
    metaDescription:
      "Eulersche Formel e^(iθ) = cos θ + i sin θ in Bewegung: den Winkel über den Einheitskreis ziehen, cos- und sin-Wellen sehen und bei e^(iπ) + 1 = 0 landen.",
    heading: "So funktioniert dieser Explorer",
    intro:
      "Das große Canvas ist die komplexe Ebene: Die reellen Zahlen laufen von links nach rechts, die imaginären nach oben. Der leuchtende Punkt ist e^(iθ) für den aktuellen Winkel θ. Wächst θ, wandert der Punkt gegen den Uhrzeigersinn über den Kreis mit Radius 1, der überstrichene Bogen wird in Bernstein gezeichnet, und gestrichelte Linien fallen vom Punkt auf beide Achsen. Der Streifen darunter zeigt cos θ und sin θ über eine volle Umdrehung, mit einem Cursor beim aktuellen Winkel. So siehst du den Kreis und die beiden Wellen als ein und dieselbe Bewegung.",
    sections: [
      {
        heading: "Eine Formel, drei Lesarten",
        paragraphs: [
          "Die Eulersche Formel besagt: Hebt man e in eine imaginäre Potenz, landet man auf dem Einheitskreis. Der Realteil von e^(iθ) ist cos θ, der Imaginärteil sin θ. Leonhard Euler veröffentlichte sie 1748 in seiner Introductio in analysin infinitorum. Warum sie stimmt, sieht man, wenn man iθ in die Potenzreihe der Exponentialfunktion einsetzt. Die Potenzen von i laufen zyklisch durch i, −1, −i, 1, deshalb sammeln sich die geraden Glieder zur Reihe für cos θ und die ungeraden zu i mal der Reihe für sin θ.",
          "Die zweite Lesart handelt von Bewegung. Die Ableitung von e^(iθ) nach θ ist i·e^(iθ), und Multiplizieren mit i dreht eine komplexe Zahl um eine Vierteldrehung. Die Geschwindigkeit des Punkts steht also immer senkrecht auf seiner Position und hat immer die Länge 1. Ein Punkt, der sich mit Tempo 1 und stets quer zu seinem eigenen Radius bewegt, kann nur im Kreis laufen, und θ ist genau die Strecke, die er dabei zurücklegt.",
          "Die dritte Lesart ist der berühmte Spezialfall. Bei θ = π hat der Punkt den halben Kreis zurückgelegt und sitzt bei −1, also gilt e^(iπ) + 1 = 0, eine Gleichung, die e, i, π, 1 und 0 verbindet.",
        ],
        formula: "e^{i\\theta} = \\cos\\theta + i \\sin\\theta, \\qquad e^{i\\pi} + 1 = 0",
      },
      {
        heading: "Was die Regler bewirken",
        paragraphs: [
          "Der Regler «Winkel θ» läuft von 0 bis 2π in Schritten von 0,01 Radiant, die Anzeige darüber zeigt den Wert in Radiant und Grad. Die fünf Knöpfe darunter springen zu den Vierteldrehungen 0, π/2, π, 3π/2 und 2π, beschriftet mit dem Landepunkt: 1, i, −1, −i und wieder 1. Die Einblendung in der Ecke der Ebene zeigt θ, cos θ, sin θ und den Punkt in der Form a + bi.",
          "Start animiert θ mit konstanter Winkelgeschwindigkeit, einstellbar mit dem Geschwindigkeitsregler von 0,05 bis 3 Radiant pro Sekunde (Standard 0,6, eine volle Umdrehung dauert also etwa 10,5 Sekunden). Überschreitet θ den Wert 2π, springt es zurück auf 0. Zurücksetzen stellt θ wieder auf 0. Sobald θ weniger als 0,02 Radiant von π entfernt ist, wird der Punkt rosa, die Ebene bekommt einen zarten rosa Schleier, und oben erscheint das Banner e^(iπ) + 1 = 0.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Beide Bilder sind 2D-Canvas-Flächen in der Pixeldichte des Geräts. Eine Dauerschleife gibt es nicht: Jedes Canvas zeichnet nur neu, wenn sich θ, die Größe oder der Reset-Zähler ändert, eine ruhende Seite zeichnet also gar nichts.",
          "Die Animationsschleife existiert nur, solange Start aktiv ist. In jedem Frame misst sie die Zeit seit dem vorigen Frame, deckelt sie bei 0,05 Sekunden, damit der Punkt nach der Rückkehr in einen Hintergrund-Tab nicht wegspringt, addiert Geschwindigkeit mal Zeit zu θ und bringt das Ergebnis zurück in den Bereich von 0 bis 2π. Weil die Seite pausiert startet und sich erst bewegt, wenn du Start drückst, muss für reduzierte Bewegung nichts abgeschaltet werden. Der Regler funktioniert in beiden Fällen gleich.",
          "Der Renderer rechnet θ mit einem Kosinus und einem Sinus in Bildschirmkoordinaten um. Die einzige Feinheit ist das Minuszeichen bei y: Auf dem Canvas zeigt y nach unten, in der Mathematik nach oben.",
        ],
        code: TICK_EXCERPT,
      },
      {
        heading: "Warum hier in Radiant gemessen wird",
        paragraphs: [
          "Die Formel ist nur dann so elegant, wenn θ in Radiant angegeben ist. Ein Radiant ist der Winkel, dessen Bogen auf dem Einheitskreis die Länge 1 hat. Deshalb ist θ auch die Länge des Bernsteinbogens: Bei θ = π ist der Bogen der halbe Umfang eines Kreises mit Radius 1, also π. Misst du den Winkel in Grad, schleppt die Formel einen unschönen Faktor π/180 im Exponenten mit.",
        ],
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Den Moment der Identität erwischen",
        text: "Stell die Geschwindigkeit auf 0,05 und drück Start bei θ = 0. Nach etwa einer Minute erreicht der Punkt π, die Ebene leuchtet rosa auf, und das Banner bleibt fast eine Sekunde stehen. Bei der Standardgeschwindigkeit 0,6 ist dasselbe Fenster im Nu vorbei.",
      },
      {
        title: "cos und sin am Kreis ablesen",
        text: "Zieh θ langsam von 0 bis π/2. In der Ebene steigt der Punkt und wandert nach links, im Streifen klettert die cyanfarbene sin-Kurve auf 1, während die bernsteinfarbene cos-Kurve auf 0 fällt. Bei π/2 zeigt die Einblendung z = 0.000 + 1.000 i, also i.",
      },
      {
        title: "Finde, wo cos gleich sin ist",
        text: "Schieb den Regler auf etwa 0,785 Radiant, also 45 Grad. Der Punkt liegt auf der Diagonalen, beide gestrichelten Linien sind gleich lang, und die Anzeige zeigt für cos θ und sin θ jeweils etwa 0,7071, das ist 1/√2.",
      },
      {
        title: "Mal i ist eine Vierteldrehung",
        text: "Klick die Knöpfe der Reihe nach: 0, π/2, π, 3π/2, 2π. Jeder Klick addiert π/2 zu θ und multipliziert den Punkt damit mit e^(iπ/2) = i. Die Landepunkte 1, i, −1, −i, 1 sind genau die Potenzen von i.",
      },
    ],
  },
};
