import type { ExplorerGuide } from "./types";

// Numbers quoted here (ray slider 20 to 300, default 120, 40 iterations,
// 0.012 rad per frame, the 1/2 and 1/4 coefficients) match
// app/cardioid/explorer/page.tsx; update both together.
const REFLECT_EXCERPT = `// Rays enter from the right and hit the far (left) wall
const phi = Math.PI / 2 + (i / cfg.rayCount) * Math.PI;
const px = cx + R * Math.cos(phi);
const py = cy + R * Math.sin(phi);
ctx.moveTo(W + 100, py);
ctx.lineTo(px, py);

// Mirror the direction d = (-1, 0) in the inward normal n
const nx = -Math.cos(phi);
const ny = -Math.sin(phi);
const dn = -1 * nx + 0 * ny;
const rx = -1 - 2 * dn * nx;   // r = d - 2(d·n)n
const ry = 0 - 2 * dn * ny;
ctx.lineTo(px + rx * R * 2.5, py + ry * R * 2.5);`;

export const CARDIOID_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Explore the cardioid three ways: light reflected in a coffee cup, a circle rolling around a circle, and the main bulb of the Mandelbrot set, with the maths.",
    heading: "How this explorer works",
    intro:
      "The cardioid is the heart-shaped curve with a single cusp. It turns up in surprisingly unrelated places: in the bright pattern light draws on the surface of a cup, in the path of a point on a wheel rolling around another wheel, and as the largest region of the Mandelbrot set. The three buttons on the right switch between these scenes, each built from a different construction.",
    sections: [
      {
        heading: "One curve, three constructions",
        paragraphs: [
          "In polar coordinates, with the cusp at the origin, the cardioid is r = 2a(1 − cos θ). The Rolling circle view builds it mechanically: a fixed circle of radius a sits in the middle, a second circle of the same radius rolls around its outside without slipping, and a point marked on the rolling circle traces the curve. Because both radii are equal, the point touches the fixed circle exactly once per lap, and that touch is the cusp.",
          "As a parametrised curve the rolling construction gives x = 2a cos t − a cos 2t and y = 2a sin t − a sin 2t. The Mandelbrot boundary is the same expression with a = 1/4 in complex form, which is why the amber outline in the third view sits exactly on the edge of the set.",
        ],
        formula: "c(t) = \\tfrac12 e^{it} - \\tfrac14 e^{2it}, \\qquad 0 \\le t < 2\\pi",
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "Coffee cup draws a circular mirror (the cup wall seen from above) and sends parallel rays in from the right. The Rays slider sets how many, from 20 to 300 in steps of 2, starting at 120. Each ray reflects off the far wall, and where reflected rays crowd together they form a bright envelope called a caustic. Show rays and Show envelope toggle the two layers independently.",
          "There is an honest twist, and the panel says so: for parallel light such as sunlight, the envelope is not a cardioid but a nephroid, a related curve with two cusps. The page draws the full nephroid; the half on the far side is the caustic of these rays, the mirror half belongs to light from the left. A true cardioid appears when the light source sits on the rim of the cup. Both curves are epicycloids, which is why the bright line in a real mug often looks heart-like.",
          "Rolling circle animates the construction and has one button, Pause or Roll. Mandelbrot bulb shows the set with the exact cardioid laid on top.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "Everything is drawn on one 2D canvas scaled to your screen's pixel density. For the cup, each ray is placed at an angle φ on the far half of the circle and reflected with the mirror formula r = d − 2(d·n)n, where d is the incoming direction and n the inward normal. Rays that would only graze the wall are skipped. The envelope is drawn from the nephroid's own equation, not computed from the rays, and you can see the rays pile up along it.",
          "The rolling view advances its parameter by 0.012 radians per frame, so one lap takes a little over 500 frames, about nine seconds at 60 Hz. The Mandelbrot view runs the escape-time algorithm per pixel: iterate z ↦ z² + c from z = 0 for up to 40 steps, stopping once |z| exceeds 2. Pixels that never escape are near-black, the rest shaded violet by how fast they left. Those pixels are cached and only recomputed when the canvas changes size.",
          "The still views only repaint when an input changes. If your system asks for reduced motion, the rolling circle is frozen in a single static frame.",
        ],
        code: REFLECT_EXCERPT,
      },
      {
        heading: "Why the Mandelbrot set has a cardioid",
        paragraphs: [
          "The main body of the Mandelbrot set is exactly the set of c for which z ↦ z² + c has an attracting fixed point. A fixed point satisfies z = z² + c and attracts when the derivative 2z has modulus below 1. Write 2z = μ with |μ| < 1; then c = μ/2 − μ²/4, and letting μ run around the unit circle traces precisely the formula above. At the cusp, c = 1/4, the multiplier is exactly 1 and the two fixed points merge. Touching the cardioid at c = −3/4 sits a perfect disc of radius 1/4 centred at −1: the parameters with an attracting cycle of period 2.",
        ],
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "Let the caustic appear from nothing",
        text: "In Coffee cup, untick Show envelope and set Rays to 20. Then drag slowly up to 300: the crossings condense into a bright curve with a sharp point halfway between wall and centre, although the curve itself is not drawn.",
      },
      {
        title: "Catch the cusp",
        text: "Open Rolling circle and pause when the cyan dot reaches the point where the circles touch. There the dot is momentarily at rest, which is why the curve has a cusp instead of a smooth turn.",
      },
      {
        title: "Find the edge of stability",
        text: "In Mandelbrot bulb, follow the amber line: inside it every orbit settles on a single point. On the left it touches the round bulb at c = −3/4, where the fixed point gives way to a cycle of period 2.",
      },
      {
        title: "Compare the two hearts",
        text: "Flip between Rolling circle and Mandelbrot bulb. The amber curves are the same shape at different scales: the Mandelbrot outline is the rolling cardioid with a = 1/4, cusp on the right in both.",
      },
    ],
  },
  de: {
    metaDescription:
      "Die Kardioide auf drei Wegen erkunden: als Lichtspiegelung in der Kaffeetasse, als Bahn eines rollenden Kreises und als Hauptkörper der Mandelbrot-Menge.",
    heading: "So funktioniert dieser Explorer",
    intro:
      "Die Kardioide ist die herzförmige Kurve mit einer einzigen Spitze. Sie taucht an erstaunlich verschiedenen Stellen auf: im hellen Muster, das Licht auf die Oberfläche einer Tasse zeichnet, in der Bahn eines Punkts auf einem Rad, das um ein anderes Rad rollt, und als größtes Gebiet der Mandelbrot-Menge. Mit den drei Knöpfen rechts wechselst du zwischen diesen Szenen, jede aus einer anderen Konstruktion gebaut.",
    sections: [
      {
        heading: "Eine Kurve, drei Konstruktionen",
        paragraphs: [
          "In Polarkoordinaten, mit der Spitze im Ursprung, lautet die Kardioide r = 2a(1 − cos θ). Die Ansicht «Rollender Kreis» baut sie mechanisch: In der Mitte liegt ein fester Kreis mit Radius a, ein zweiter Kreis mit gleichem Radius rollt außen ohne Rutschen um ihn herum, und ein markierter Punkt auf dem rollenden Kreis zeichnet die Kurve. Weil beide Radien gleich sind, berührt der Punkt den festen Kreis genau einmal pro Runde. Diese Berührung ist die Spitze.",
          "Als parametrisierte Kurve ergibt die Rollkonstruktion x = 2a cos t − a cos 2t und y = 2a sin t − a sin 2t. Der Rand der Mandelbrot-Menge verwendet denselben Ausdruck mit a = 1/4 in komplexer Schreibweise. Deshalb liegt die bernsteinfarbene Linie in der dritten Ansicht exakt auf dem Rand der Menge.",
        ],
        formula: "c(t) = \\tfrac12 e^{it} - \\tfrac14 e^{2it}, \\qquad 0 \\le t < 2\\pi",
      },
      {
        heading: "Was die Regler bewirken",
        paragraphs: [
          "«Kaffeetasse» zeichnet einen kreisförmigen Spiegel (die Tassenwand von oben gesehen) und schickt parallele Lichtstrahlen von rechts hinein. Der Regler «Strahlen» legt fest, wie viele gezeichnet werden, von 20 bis 300 in Zweierschritten, Startwert 120. Jeder Strahl wird an der gegenüberliegenden Wand reflektiert, und wo sich reflektierte Strahlen drängen, entsteht eine helle Hüllkurve, eine sogenannte Kaustik. «Strahlen zeigen» und «Hüllkurve zeigen» schalten die beiden Ebenen unabhängig voneinander.",
          "Es gibt eine ehrliche Wendung, und das Panel sagt sie auch: Bei parallelem Licht wie Sonnenlicht ist die Hüllkurve keine Kardioide, sondern eine Nephroide, eine verwandte Kurve mit zwei Spitzen. Gezeichnet wird die vollständige Nephroide; die Hälfte auf der abgewandten Seite ist die Kaustik dieser Strahlen, die gespiegelte Hälfte gehört zu Licht von links. Eine echte Kardioide bekommst du erst, wenn die Lichtquelle direkt auf dem Tassenrand sitzt. Beide Kurven sind Epizykloiden, darum wirkt die helle Linie in einem echten Becher oft herzförmig.",
          "«Rollender Kreis» animiert die Konstruktion und hat einen einzigen Knopf zum Pausieren und Weiterrollen. «Mandelbrot-Knospe» zeigt die Menge mit der exakten Kardioide darübergelegt.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Alles entsteht auf einem einzigen 2D-Canvas, das an die Pixeldichte deines Bildschirms angepasst ist. Für die Tasse wird jeder Strahl über einen Winkel φ auf der abgewandten Kreishälfte platziert und mit der Spiegelformel r = d − 2(d·n)n reflektiert, wobei d die Einfallsrichtung und n die nach innen zeigende Normale ist. Strahlen, die die Wand nur streifen würden, werden übersprungen. Die Hüllkurve wird aus der Gleichung der Nephroide gezeichnet, nicht aus den Strahlen berechnet, und man sieht, wie sich die Strahlen dort stapeln.",
          "Die Rollansicht erhöht ihren Parameter um 0,012 Radiant pro Frame. Eine Runde dauert also gut 500 Frames, etwa neun Sekunden auf einem 60-Hz-Bildschirm. Die Mandelbrot-Ansicht rechnet für jedes Pixel den Escape-Time-Algorithmus: z ↦ z² + c ab z = 0 bis zu 40 Mal iterieren und abbrechen, sobald |z| größer als 2 wird. Pixel, die nie entkommen, werden fast schwarz, die übrigen violett schattiert, je nachdem wie schnell sie davonliefen. Diese Pixel werden zwischengespeichert und nur neu berechnet, wenn sich die Größe der Zeichenfläche ändert.",
          "Die ruhenden Ansichten zeichnen nur neu, wenn sich eine Eingabe ändert. Wünscht dein System reduzierte Bewegung, bleibt der rollende Kreis in einem einzigen Standbild stehen.",
        ],
        code: REFLECT_EXCERPT,
      },
      {
        heading: "Warum die Mandelbrot-Menge eine Kardioide enthält",
        paragraphs: [
          "Der Hauptkörper der Mandelbrot-Menge ist genau die Menge der Parameter c, für die z ↦ z² + c einen anziehenden Fixpunkt hat. Ein Fixpunkt erfüllt z = z² + c, und er zieht an, wenn die Ableitung 2z einen Betrag kleiner als 1 hat. Schreib 2z = μ mit |μ| < 1, dann ist c = μ/2 − μ²/4. Lässt du μ um den Einheitskreis laufen, entsteht genau die Formel oben. An der Spitze, c = 1/4, ist der Multiplikator genau 1, und die beiden Fixpunkte verschmelzen. Bei c = −3/4 berührt die Kardioide eine exakte Kreisscheibe mit Radius 1/4 um −1: die Parameter mit einem anziehenden Zyklus der Periode 2.",
        ],
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Die Kaustik aus dem Nichts entstehen lassen",
        text: "Schalte bei «Kaffeetasse» «Hüllkurve zeigen» aus und stell «Strahlen» auf 20. Zieh dann langsam bis 300: Die Kreuzungen verdichten sich zu einer hellen Kurve mit scharfer Spitze auf halbem Weg zwischen Wand und Mitte, obwohl die Kurve selbst nicht gezeichnet wird.",
      },
      {
        title: "Die Spitze erwischen",
        text: "Öffne «Rollender Kreis» und pausiere, wenn der cyanfarbene Punkt die Stelle erreicht, an der sich die beiden Kreise berühren. In diesem Moment steht der Punkt kurz still, und genau deshalb hat die Kurve dort eine scharfe Spitze statt einer runden Wende.",
      },
      {
        title: "Die Stabilitätsgrenze finden",
        text: "Wechsle zu «Mandelbrot-Knospe» und folge der bernsteinfarbenen Linie. Innerhalb davon kommt jede Bahn in einem einzigen Punkt zur Ruhe. Schau nach links, wo die Linie an die runde Knospe stößt: Dieser Berührpunkt ist c = −3/4, wo der Fixpunkt einem Zyklus der Periode 2 Platz macht.",
      },
      {
        title: "Die beiden Herzen vergleichen",
        text: "Wechsle zwischen «Rollender Kreis» und «Mandelbrot-Knospe». Die bernsteinfarbenen Kurven haben dieselbe Form in unterschiedlicher Größe: Der Mandelbrot-Umriss ist die Rollkreis-Kardioide mit a = 1/4, und in beiden Ansichten sitzt die Spitze rechts.",
      },
    ],
  },
};
