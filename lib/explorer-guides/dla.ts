import type { ExplorerGuide } from "./types";

// Constants quoted here (default 150 walkers, 4000 cap, stickiness 0.1 to 1,
// cell 2 to 8 px, the 1200-step reduced-motion warm-up) match
// app/dla/explorer/page.tsx; update both together.
const WALK_EXCERPT = `for (let i = live.length - 1; i >= 0; i--) {
  const w = live[i];
  let nx = w.x;
  let ny = w.y;
  const r = Math.random();
  if (r < 0.25) nx++;
  else if (r < 0.5) nx--;
  else if (r < 0.75) ny++;
  else ny--;
  // ...clamp to the grid, refuse to step onto frozen cells...
  if (grid[ny * gridW + nx] === 0) { w.x = nx; w.y = ny; }
  if (hasStuckNeighbour(w.x, w.y) && Math.random() < p.stickiness) {
    const idx = w.y * gridW + w.x;
    if (grid[idx] === 0) { grid[idx] = age; stuckCount++; }
    live.splice(i, 1);
  }
}`;

export const DLA_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Grow diffusion-limited aggregation live: random walkers stick to a seed and build fractal coral. Tune stickiness, walker count and seed shape on a square grid.",
    heading: "How this explorer works",
    intro:
      "Every bright cell on the canvas was once a wandering particle. Particles drift around the grid at random, one lattice step per frame, until they touch the growing cluster and freeze in place. Nobody tells the cluster to branch, yet within seconds it grows thin arms, the arms grow side arms, and the result looks like frost on a window or the branching of a river delta. The faint dots you see moving are the walkers still on their way.",
    sections: [
      {
        heading: "The idea: growth by random arrival",
        paragraphs: [
          "Diffusion-limited aggregation (DLA) was introduced by Thomas Witten and Leonard Sander in 1981. The rule is short: release a particle far away, let it do a random walk, and when it lands next to the cluster, attach it. Then release the next one. The name says what controls the speed: growth is limited by how fast particles diffuse to the surface, not by any chemistry at the surface.",
          "The branching comes from a screening effect. A random walker coming from outside is far more likely to bump into a tip that sticks out than to wander deep into a narrow gap between two arms. Tips therefore grow faster, which makes them stick out even more, while the fjords between them starve. Small random differences get amplified into the characteristic open, tree-like shape.",
          "That shape is a fractal. If you count the particles N inside a circle of radius R around the seed, you do not get the R² you would expect for a filled disc. For DLA in the plane, N grows roughly like R raised to a power of about 1.71, a fractal dimension between a line (1) and a filled area (2).",
        ],
        formula: "N(R) \\propto R^{D}, \\qquad D \\approx 1.71",
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "Seed decides where growth starts. Point puts a single frozen cell in the centre and launches walkers from a circle near the edge of the canvas. Line freezes the whole second row from the bottom and drops walkers in at the top edge, like a crystal growing upwards from a surface. Ring draws a closed circle with a radius of one third of the shorter side and spawns walkers uniformly inside it, so the coral grows inwards from the wall.",
          "Walkers / frame sets how many particles are wandering at the same time (10 to 1000, default 150, hard cap 4000). More walkers means faster growth, because every walker moves once per frame. Stickiness (0.1 to 1.0, default 1.0) is the probability that a walker next to the cluster actually freezes; otherwise it keeps walking. Cell size (2 to 8 pixels, default 3) sets the grid resolution: smaller cells give a finer, larger lattice. Changing the seed or the cell size restarts the simulation.",
          "The four presets combine these: Centre seed with 80 walkers, Centre fast with 300, Bottom line with 200 and Ring seed with 200, all with stickiness 1. The colour swatches only change the tint.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "The world is a Uint8Array with one byte per grid cell: 0 means empty, any other value means frozen. Walkers are a plain array of integer coordinates. Each frame tops the pool back up to the target count, then moves every walker one step left, right, up or down with equal probability. Walkers are clamped at the canvas border, and a step onto a frozen cell is refused, so particles can never tunnel through an arm.",
          "After moving, the walker checks its four direct neighbours (the von Neumann neighbourhood). If one of them is frozen and a random number falls below the stickiness, the cell freezes and the walker is removed. The frozen value also records when the cell attached: it rises by four every 60 frames, and older cells are drawn slightly dimmer than newer ones, so the outer growth glows a little brighter.",
          "With reduced motion enabled the loop does not animate. The page runs 1200 simulation steps at once, paints a single still frame and shows the resulting cluster size.",
        ],
        code: WALK_EXCERPT,
      },
      {
        heading: "Why stickiness changes the shape",
        paragraphs: [
          "At stickiness 1 the first contact is final, so particles freeze on the outermost tip they touch and the screening effect is at full strength. Lower stickiness gives a walker several chances to slide along the surface and wander further into the gaps before it attaches. The fjords fill in, the arms get thicker, and the cluster becomes more compact. In the limit of very low stickiness, growth is no longer limited by diffusion at all, and the shape approaches a blob.",
        ],
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "Thin versus thick coral",
        text: "Run the point seed with stickiness 1.0, then reset and run it with stickiness 0.15. Compare the two when they reach a similar size: the second has thicker arms and far fewer empty fjords.",
      },
      {
        title: "A forest from a surface",
        text: "Choose the Bottom line preset. Many small trees start along the floor, but soon a few tall ones shade the rest and only they keep growing. It is the same screening effect, now acting between neighbours.",
      },
      {
        title: "Inside-out growth",
        text: "Pick the Ring seed. Walkers start inside the circle, so the arms point towards the centre and compete for the shrinking empty space in the middle.",
      },
      {
        title: "Resolution and patience",
        text: "Set cell size to 2 and walkers to 1000. The lattice now has many more cells, and the cluster shows finer, more detailed branching. At cell size 8 the same rule produces a chunky, pixel-art coral.",
      },
    ],
  },
  de: {
    metaDescription:
      "Diffusionsbegrenzte Aggregation live wachsen lassen: Zufallswanderer haften am Keim und bauen fraktale Korallen. Haftung, Wanderer-Zahl und Keimform einstellen.",
    heading: "So funktioniert dieser Explorer",
    intro:
      "Jede leuchtende Zelle auf dem Canvas war einmal ein umherirrendes Teilchen. Die Teilchen wandern zufällig über das Gitter, einen Schritt pro Frame, bis sie den wachsenden Cluster berühren und dort erstarren. Niemand sagt dem Cluster, dass er sich verzweigen soll, und trotzdem wachsen ihm nach wenigen Sekunden dünne Arme, an den Armen Seitenarme, und das Ganze sieht aus wie Eisblumen am Fenster oder wie ein verästeltes Flussdelta. Die blassen Punkte, die sich bewegen, sind die Wanderer, die noch unterwegs sind.",
    sections: [
      {
        heading: "Die Idee: Wachstum durch zufällige Ankunft",
        paragraphs: [
          "Die diffusionsbegrenzte Aggregation (DLA) haben Thomas Witten und Leonard Sander 1981 eingeführt. Die Regel ist kurz: Lass ein Teilchen weit weg los, lass es zufällig wandern, und sobald es neben dem Cluster landet, hängst du es an. Dann kommt das nächste. Der Name verrät, was das Tempo bestimmt: Das Wachstum ist dadurch begrenzt, wie schnell Teilchen zur Oberfläche diffundieren, nicht durch irgendeine Chemie an der Oberfläche.",
          "Die Verästelung entsteht durch Abschirmung. Ein Zufallswanderer von außen stößt viel eher an eine herausragende Spitze, als dass er tief in einen schmalen Spalt zwischen zwei Armen hineinfindet. Spitzen wachsen deshalb schneller, ragen dadurch noch weiter heraus, und die Fjorde dazwischen verhungern. Kleine zufällige Unterschiede schaukeln sich zur typischen offenen, baumartigen Form auf.",
          "Diese Form ist ein Fraktal. Zählst du die Teilchen N in einem Kreis mit Radius R um den Keim, bekommst du nicht das R², das eine gefüllte Scheibe hätte. Für DLA in der Ebene wächst N ungefähr wie R hoch 1,71, eine fraktale Dimension zwischen Linie (1) und Fläche (2).",
        ],
        formula: "N(R) \\propto R^{D}, \\qquad D \\approx 1{,}71",
      },
      {
        heading: "Was die Regler bewirken",
        paragraphs: [
          "Der Keim legt fest, wo das Wachstum beginnt. «Punkt» setzt eine einzelne erstarrte Zelle in die Mitte und schickt Wanderer von einem Kreis nahe dem Canvasrand los. «Linie» lässt die ganze zweitunterste Zeile erstarren und setzt Wanderer an der Oberkante ein, wie ein Kristall, der von einer Fläche nach oben wächst. «Ring» zeichnet einen geschlossenen Kreis mit einem Drittel der kürzeren Seite als Radius und verteilt die Wanderer gleichmäßig in seinem Inneren, die Koralle wächst also von der Wand nach innen.",
          "«Wanderer / Frame» bestimmt, wie viele Teilchen gleichzeitig unterwegs sind (10 bis 1000, Standard 150, harte Grenze 4000). Mehr Wanderer heißt schnelleres Wachstum, weil jeder Wanderer pro Frame einen Schritt macht. Die Haftung (0,1 bis 1,0, Standard 1,0) ist die Wahrscheinlichkeit, dass ein Wanderer neben dem Cluster tatsächlich erstarrt, sonst läuft er weiter. Die Zellgröße (2 bis 8 Pixel, Standard 3) legt die Gitterauflösung fest: Kleinere Zellen ergeben ein feineres, größeres Gitter. Wenn du Keim oder Zellgröße änderst, startet die Simulation neu.",
          "Die vier Voreinstellungen kombinieren das: Mittelkeim mit 80 Wanderern, «Mitte · schnell» mit 300, Bodenlinie mit 200 und Ringkeim mit 200, alle mit Haftung 1. Die Farbfelder ändern nur den Farbton.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Die Welt ist ein Uint8Array mit einem Byte pro Gitterzelle: 0 heißt leer, jeder andere Wert heißt erstarrt. Die Wanderer sind ein schlichtes Array ganzzahliger Koordinaten. Jeder Frame füllt den Vorrat auf die Zielzahl auf und bewegt dann jeden Wanderer mit gleicher Wahrscheinlichkeit einen Schritt nach links, rechts, oben oder unten. Am Canvasrand bleiben Wanderer hängen, und ein Schritt auf eine erstarrte Zelle wird verweigert, damit kein Teilchen durch einen Arm hindurchtunneln kann.",
          "Nach dem Schritt prüft der Wanderer seine vier direkten Nachbarn (die Von-Neumann-Nachbarschaft). Ist einer davon erstarrt und liegt eine Zufallszahl unter der Haftung, erstarrt die Zelle und der Wanderer verschwindet. Der gespeicherte Wert hält auch fest, wann die Zelle angedockt hat: Er steigt alle 60 Frames um vier, und ältere Zellen werden etwas blasser gezeichnet als neuere, deshalb leuchtet das äußere Wachstum ein wenig heller.",
          "Ist reduzierte Bewegung eingestellt, wird nicht animiert. Die Seite rechnet 1200 Simulationsschritte auf einmal, zeichnet ein einziges Standbild und zeigt die erreichte Clustergröße an.",
        ],
        code: WALK_EXCERPT,
      },
      {
        heading: "Warum die Haftung die Form verändert",
        paragraphs: [
          "Bei Haftung 1 ist der erste Kontakt endgültig. Teilchen erstarren an der äußersten Spitze, die sie berühren, und die Abschirmung wirkt mit voller Kraft. Geringere Haftung gibt einem Wanderer mehrere Chancen, an der Oberfläche entlangzurutschen und tiefer in die Spalten zu wandern, bevor er andockt. Die Fjorde füllen sich, die Arme werden dicker, der Cluster wird kompakter. Bei sehr geringer Haftung ist das Wachstum gar nicht mehr durch Diffusion begrenzt, und die Form nähert sich einem Klumpen.",
        ],
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Dünne gegen dicke Koralle",
        text: "Lass den Punktkeim mit Haftung 1,0 wachsen, setz dann zurück und wiederhole es mit Haftung 0,15. Vergleiche beide bei ähnlicher Größe: Die zweite hat dickere Arme und viel weniger leere Fjorde.",
      },
      {
        title: "Ein Wald auf einer Fläche",
        text: "Wähle die Voreinstellung Bodenlinie. Am Boden starten viele kleine Bäumchen, aber bald beschatten ein paar hohe den Rest, und nur sie wachsen weiter. Das ist dieselbe Abschirmung, jetzt zwischen Nachbarn.",
      },
      {
        title: "Wachstum von außen nach innen",
        text: "Nimm den Ringkeim. Die Wanderer starten im Kreis, deshalb zeigen die Arme zur Mitte und konkurrieren um den schrumpfenden freien Raum im Zentrum.",
      },
      {
        title: "Auflösung und Geduld",
        text: "Stell die Zellgröße auf 2 und die Wanderer auf 1000. Das Gitter hat jetzt viel mehr Zellen, und der Cluster zeigt feinere, detailliertere Verästelungen. Bei Zellgröße 8 ergibt dieselbe Regel eine klobige Koralle im Pixel-Art-Look.",
      },
    ],
  },
};
