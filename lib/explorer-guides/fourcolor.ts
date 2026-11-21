import type { ExplorerGuide } from "./types";

// Behaviour quoted here (Voronoi maps with Lloyd relaxation, MRV backtracking,
// region counts 5 to 80, 8 to 400 ms per step, neighbours need 3 shared pixel
// pairs, the preset region counts and
// the EN and DE control labels from RICH_EXPLORER) matches
// app/fourcolor/explorer/page.tsx and lib/fourcolor/map.ts; update them
// together.
const SOLVER_EXCERPT = `function recurse(): boolean {
  if (steps.length > STEP_CAP) return false;
  const i = pickNext();              // fewest colours left, ties: most neighbours
  if (i === -1) return true;         // every region coloured
  const used = new Set<number>();
  for (const j of adj[i]) {
    if (colours[j] !== -1) used.add(colours[j]);
  }
  for (let c = 0; c < 4; c++) {
    if (used.has(c)) continue;
    colours[i] = c;
    steps.push({ cell: i, colour: c });
    if (recurse()) return true;
    colours[i] = -1;                 // dead end: undo and try the next colour
    steps.push({ cell: i, colour: -1 });
    backtracks++;
  }
  return false;
}`;

export const FOURCOLOR_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Watch the four colour theorem at work: generate random planar maps and see a backtracking solver colour every region with four colours, step by step.",
    heading: "How this explorer works",
    intro:
      "The canvas shows a map: a plane cut into regions that share borders, each labelled with a number. The explorer generates it, works out which regions touch, and then colours it with four colours so that no two neighbours ever share a colour. You can watch that colouring happen one decision at a time, including the moments when the solver changes its mind. The four colour theorem promises it will always succeed, however the map is drawn.",
    sections: [
      {
        heading: "Four colours are always enough",
        paragraphs: [
          "Francis Guthrie noticed in 1852 that four colours seemed to suffice for any map in which neighbouring countries must differ, as long as each country is one connected piece and touching at a single corner point does not count as sharing a border. Turning that observation into a theorem took more than a century. Alfred Kempe published a proof in 1879 that was found to be flawed in 1890, although the argument was still strong enough to prove that five colours always suffice.",
          "Kenneth Appel and Wolfgang Haken finally proved the four colour theorem in 1976, with a computer checking a large set of unavoidable configurations. A simpler computer proof followed in 1997, and in 2005 Georges Gonthier verified the whole argument in the Coq proof assistant.",
          "In graph language, every region becomes a vertex and every shared border an edge. The result is a planar graph, and the theorem says its chromatic number χ is at most 4. That is what the badge above the canvas means.",
        ],
        formula: "\\chi(G) \\le 4 \\quad \\text{for every planar graph } G",
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "The preset list chooses how many regions the map has and how evenly they are shaped. Random Voronoi starts with 30 or 60 cells. Three presets fix the count at 48, 16 and 54 regions, as many as there are contiguous US states, German states and UN member states in Africa. Only the numbers are borrowed: these are random maps with that many cells and extra smoothing, not real borders. Stress test places six regions in a tight ring, all meeting at one point in the centre, and six more around them, without smoothing, to create a crowded neighbourhood. Generate random moves to the next random seed and draws a new map; the seed in the top badge makes every map reproducible.",
          "Number of regions (5 to 80) sets the cell count directly; moving it on any other preset switches back to a random Voronoi map. The palette swatches can be clicked to pick your own colours.",
          "In the Auto-colourer panel, Step applies one decision, Run replays them all at the chosen speed (8 to 400 milliseconds per step, default 60), Auto jumps straight to the finished colouring, and Reset colouring returns every region to grey. The counters show how many regions are coloured, how many backtracks the solver needed, and the total number of steps.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "The map is a Voronoi diagram: random seed points are placed in the canvas and every pixel belongs to its nearest seed. A few rounds of Lloyd relaxation, which move each seed to the centre of its own cell and recompute, make the regions rounder and more even. A final full-resolution pass assigns every pixel. Seeds come from a small deterministic random generator, so seed 1 always gives the same map at a given canvas size.",
          "Adjacency is read directly from the pixels: the code scans every horizontal and vertical pair of neighbouring pixels, and whenever their labels differ, that pair is counted for the two regions. Regions are neighbours once they share at least three such pairs, so cells that only meet at a corner are not linked.",
          "The colouring is a backtracking search with the most-constrained-variable heuristic. At each step it picks the uncoloured region with the fewest colours still allowed, breaking ties by the number of neighbours, and tries colours in a fixed order. The whole search runs once when the map is created and is recorded as a list of assign and undo steps; the animation simply replays that list. Nothing moves until you press Run, so the page behaves the same with reduced motion.",
        ],
        code: SOLVER_EXCERPT,
      },
      {
        heading: "Why the solver rarely backtracks",
        paragraphs: [
          "Proving that four colours always work is hard; finding a colouring for one particular map usually is not. Euler's formula limits a planar graph with V vertices to at most 3V − 6 edges, so the average region has fewer than six neighbours and there is always some region with five or fewer. Combined with the habit of colouring the most constrained region first, dead ends are rare. On most random maps the backtrack counter stays at 0, and when it is not, it is typically a handful.",
        ],
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "Watch a dead end",
        text: "Choose Random Voronoi (60 cells), press Generate random until the backtracks counter shows a non-zero value, then set the speed to 300 ms and press Run. Look for regions that receive a colour and later turn grey again: each of those is one undo step.",
      },
      {
        title: "Count the neighbours",
        text: "Push Number of regions to 80 and read the edges and max deg badges. The edge count always stays below three times the number of regions, as Euler's formula requires for any planar map.",
      },
      {
        title: "Corners do not count",
        text: "On the stress test, six regions meet at a single point in the middle. Press Auto and look at their colours: with only four colours for six regions, at least two of them must match, and those two are never side by side. Meeting at a corner is not a border, which is exactly the exception in Guthrie's rule.",
      },
      {
        title: "Step by hand",
        text: "Pick the preset with 16 regions and click Step repeatedly. Before each click, guess which region the solver will choose next: it will be one with the fewest options left, often the one with the most already coloured neighbours.",
      },
    ],
  },
  de: {
    metaDescription:
      "Den Vierfarbensatz in Aktion sehen: zufällige ebene Landkarten erzeugen und zuschauen, wie ein Backtracking-Löser jede Region mit vier Farben einfärbt.",
    heading: "So funktioniert dieser Explorer",
    intro:
      "Das Canvas zeigt eine Landkarte: eine Ebene, die in Regionen mit gemeinsamen Grenzen zerlegt ist, jede mit einer Nummer. Der Explorer erzeugt die Karte, ermittelt, welche Regionen sich berühren, und färbt sie dann mit vier Farben so, dass zwei Nachbarn nie dieselbe Farbe haben. Du kannst dabei Entscheidung für Entscheidung zusehen, auch in den Momenten, in denen der Löser umdenkt. Der Vierfarbensatz garantiert, dass das immer gelingt, egal wie die Karte gezeichnet ist.",
    sections: [
      {
        heading: "Vier Farben reichen immer",
        paragraphs: [
          "Francis Guthrie fiel 1852 auf, dass vier Farben für jede Landkarte zu genügen scheinen, auf der benachbarte Länder verschieden gefärbt sein müssen, solange jedes Land ein zusammenhängendes Stück ist und eine Berührung in nur einem Eckpunkt nicht als gemeinsame Grenze zählt. Aus dieser Beobachtung einen Satz zu machen, dauerte mehr als ein Jahrhundert. Alfred Kempe veröffentlichte 1879 einen Beweis, der sich 1890 als fehlerhaft herausstellte. Sein Argument reichte aber immerhin für den Beweis, dass fünf Farben immer genügen.",
          "Kenneth Appel und Wolfgang Haken bewiesen den Vierfarbensatz schließlich 1976, wobei ein Computer eine große Menge unvermeidbarer Konfigurationen prüfte. 1997 folgte ein einfacherer Computerbeweis, und 2005 verifizierte Georges Gonthier das gesamte Argument im Beweisassistenten Coq.",
          "In der Sprache der Graphentheorie wird jede Region zu einem Knoten und jede gemeinsame Grenze zu einer Kante. Das Ergebnis ist ein planarer Graph, und der Satz besagt, dass seine chromatische Zahl χ höchstens 4 ist. Genau das bedeutet das Abzeichen über dem Canvas.",
        ],
        formula: "\\chi(G) \\le 4 \\quad \\text{für jeden planaren Graphen } G",
      },
      {
        heading: "Was die Regler bewirken",
        paragraphs: [
          "Die Liste der Voreinstellungen bestimmt, wie viele Regionen die Karte hat und wie gleichmäßig sie geformt sind. «Zufälliges Voronoi» startet mit 30 oder 60 Zellen. Drei Voreinstellungen legen die Zahl auf 48, 16 und 54 Regionen fest, so viele, wie es US-Staaten ohne Alaska und Hawaii, deutsche Bundesländer und UN-Mitgliedstaaten in Afrika gibt. Übernommen sind nur die Zahlen: Es sind Zufallskarten mit so vielen Zellen und zusätzlicher Glättung, keine echten Grenzen. Der Stresstest setzt sechs Regionen in einen engen Ring, die sich alle in einem Punkt in der Mitte treffen, und sechs weitere darum herum, ohne Glättung, damit eine dicht gedrängte Nachbarschaft entsteht. «Neue Zufallskarte» springt zum nächsten Zufalls-Seed und zeichnet eine neue Karte. Der Seed im oberen Abzeichen macht jede Karte reproduzierbar.",
          "«Anzahl Regionen» (5 bis 80) legt die Zahl der Zellen direkt fest. Bewegst du den Regler bei einer anderen Voreinstellung, wechselt die Karte zurück zu «Zufälliges Voronoi». Die Farbfelder lassen sich anklicken, um eigene Farben zu wählen.",
          "Im Bereich «Auto-Färber» wendet «Schritt» eine einzelne Entscheidung an, «Start» spielt alle im gewählten Tempo ab (8 bis 400 Millisekunden pro Schritt, Standard 60), «Auto» springt direkt zur fertigen Färbung, und «Färbung zurücksetzen» macht alle Regionen wieder grau. Die Zähler zeigen, wie viele Regionen gefärbt sind, wie oft der Löser zurückgehen musste und wie viele Schritte es insgesamt sind.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Die Karte ist ein Voronoi-Diagramm: Zufällige Startpunkte werden auf dem Canvas verteilt, und jedes Pixel gehört zum nächstgelegenen Punkt. Einige Runden Lloyd-Relaxation, bei denen jeder Punkt in die Mitte seiner eigenen Zelle wandert und alles neu berechnet wird, machen die Regionen runder und gleichmäßiger. Ein letzter Durchgang in voller Auflösung ordnet dann jedes Pixel zu. Die Startpunkte stammen aus einem kleinen deterministischen Zufallsgenerator, Seed 1 ergibt bei gleicher Canvasgröße also immer dieselbe Karte.",
          "Die Nachbarschaften werden direkt aus den Pixeln abgelesen: Der Code durchläuft jedes waagrechte und senkrechte Paar benachbarter Pixel, und wo sich ihre Zuordnung unterscheidet, wird das Paar für die beiden Regionen gezählt. Nachbarn sind zwei Regionen ab drei solchen Paaren, Zellen, die sich nur in einer Ecke treffen, werden also nicht verbunden.",
          "Die Färbung ist eine Backtracking-Suche mit der Heuristik der am stärksten eingeschränkten Variable. In jedem Schritt wählt sie die ungefärbte Region mit den wenigsten noch erlaubten Farben, bei Gleichstand die mit den meisten Nachbarn, und probiert die Farben in fester Reihenfolge. Die ganze Suche läuft einmal beim Erzeugen der Karte und wird als Liste von Zuweisungs- und Rücknahmeschritten gespeichert, die Animation spielt diese Liste nur ab. Bevor du «Start» drückst, bewegt sich nichts, die Seite verhält sich mit reduzierter Bewegung also genauso.",
        ],
        code: SOLVER_EXCERPT,
      },
      {
        heading: "Warum der Löser selten zurückgeht",
        paragraphs: [
          "Zu beweisen, dass vier Farben immer reichen, ist schwer. Eine Färbung für eine bestimmte Karte zu finden, ist es meistens nicht. Die Eulersche Polyederformel begrenzt einen planaren Graphen mit V Knoten auf höchstens 3V − 6 Kanten. Im Schnitt hat eine Region also weniger als sechs Nachbarn, und es gibt immer eine Region mit fünf oder weniger. Zusammen mit der Gewohnheit, die am stärksten eingeschränkte Region zuerst zu färben, sind Sackgassen selten. Auf den meisten Zufallskarten bleibt der Zähler «Rücknahmen» bei 0, und wenn nicht, sind es meist nur eine Handvoll.",
        ],
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Eine Sackgasse beobachten",
        text: "Wähle «Zufälliges Voronoi (60 Zellen)» und drück «Neue Zufallskarte», bis der Zähler «Rücknahmen» einen Wert über null zeigt. Stell dann das Tempo auf 300 ms und drück «Start». Achte auf Regionen, die eine Farbe bekommen und später wieder grau werden: Jede davon ist ein Rücknahmeschritt.",
      },
      {
        title: "Die Nachbarn zählen",
        text: "Schieb die Zahl der Regionen auf 80 und lies die Abzeichen «Kanten» und «max. Grad». Die Kantenzahl bleibt immer unter dem Dreifachen der Regionenzahl, so wie es die Eulersche Formel für jede ebene Karte verlangt.",
      },
      {
        title: "Ecken zählen nicht",
        text: "Beim Stresstest treffen sich sechs Regionen in einem einzigen Punkt in der Mitte. Drück «Auto» und schau auf ihre Farben: Bei nur vier Farben für sechs Regionen müssen mindestens zwei gleich sein, und diese beiden liegen nie nebeneinander. Eine Berührung in einer Ecke ist keine Grenze, das ist genau die Ausnahme in Guthries Regel.",
      },
      {
        title: "Schritt für Schritt von Hand",
        text: "Nimm die Voreinstellung mit 16 Regionen und klick wiederholt auf «Schritt». Rate vor jedem Klick, welche Region der Löser als Nächstes wählt: Es ist eine mit den wenigsten verbleibenden Möglichkeiten, oft die mit den meisten schon gefärbten Nachbarn.",
      },
    ],
  },
};
