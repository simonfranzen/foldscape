import type { ExplorerGuide } from "./types";

// Numbers quoted here (200 x 200 grid, 100 states, k1/k2 range 1..8, g range
// 1..60, presets, speed default 1) match app/bzr/explorer/page.tsx; update
// both together.
const STEP_EXCERPT = `if (s === ILL) {
  next[idx] = 0;            // ill cells recover in one step
  continue;
}
// a = infected neighbours, b = ill neighbours,
// sum = states of all eight neighbours (healthy ones add 0)
if (s === 0) {
  const v = Math.floor(a / k1) + Math.floor(b / k2);
  next[idx] = v >= ILL ? ILL : v;
} else {
  const v = Math.floor((sum + s) / (a + b + 1)) + g;
  next[idx] = v >= ILL ? ILL : v;
}`;

export const BZR_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Grow Belousov-Zhabotinsky spirals in a hodgepodge cellular automaton: tune k₁, k₂ and g on a 200 × 200 grid and see how the excitable medium is coded.",
    heading: "How this explorer works",
    intro:
      "The field is a grid of 200 by 200 cells, each holding a whole number between 0 and 99. Every frame all cells look at their eight neighbours and update at the same time, following three short rules. Nothing diffuses, yet with the default settings the noise organises itself within a few hundred iterations into rotating spirals that look strikingly like the Belousov-Zhabotinsky reaction in a Petri dish. The spirals belong to excitable media in general, not to one set of molecules.",
    sections: [
      {
        heading: "Healthy, infected, ill",
        paragraphs: [
          "The rule is known as the hodgepodge machine, a cellular automaton described by Martin Gerhardt and Heike Schuster as a toy model of an oscillating chemical reaction. It borrows the vocabulary of an epidemic. State 0 is healthy, the top state 99 is ill, and everything in between is infected to some degree. A healthy cell catches the infection from its neighbours, an infected cell gets steadily worse, and an ill cell recovers completely in a single step and becomes healthy again.",
          "That loop (rest, rising excitation, collapse, rest) is the same cycle a patch of BZ solution runs through: the catalyst sits in its reduced state, a threshold is crossed, oxidation runs away, and the system resets. Because every cell drags its neighbours along, the cycle becomes a travelling wave. Wherever a wavefront breaks, its free end curls up, and that curl is the spiral.",
        ],
        formula:
          "s_{t+1} = \\begin{cases} 0 & s_t = 99 \\\\ \\lfloor a/k_1 \\rfloor + \\lfloor b/k_2 \\rfloor & s_t = 0 \\\\ \\lfloor \\tfrac{S}{a+b+1} \\rfloor + g & \\text{otherwise} \\end{cases}",
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "In the formula, a counts infected neighbours, b counts ill neighbours and S is the sum of the states of the cell and its eight neighbours, so an infected cell moves to the average of all sick cells around it, ill ones included, plus g. Results above 99 are capped at 99. k₁ (infected weight, 1 to 8) divides the infected count when a healthy cell decides whether to catch the infection; k₂ (ill weight, 1 to 8) does the same for ill neighbours. With k₁ = k₂ = 8 a healthy cell only reacts when all eight neighbours are infected or all eight are ill.",
          "g (reaction rate, 1 to 60) is how much an infected cell worsens per step on top of the local average. It sets the length of the excited phase: a cell needs roughly 99 / g steps to climb from first infection to ill. In test runs from a random start the average was 3.7 steps with g = 28 and a little over 8 with g = 12.",
          "The four presets are Classic spirals (k₁ = 3, k₂ = 3, g = 28, the default), Tight scrolls (3, 2, 36), Target rings (2, 2, 40) and Turbulent (3, 3, 40). Restart fills the grid with uniform random states; Seed broken wave starts from an empty grid with a half-line of ill cells flanked by rows at states 60 and 20, a deliberate broken wavefront that sends out waves in a mirror-symmetric pattern. Speed sets how many generations run per animation frame, from 1 to 8.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "The grid is a Uint8Array of 40 000 bytes, one byte per cell, and a second array of the same size receives the next generation. After each step the two references are swapped, so no memory is allocated while the animation runs. The edges wrap around (the grid is a torus), so waves leaving on the right come back on the left.",
          "Drawing uses a 100-entry RGBA lookup table built once per colour map. Each frame copies four bytes per cell from the table into an ImageData buffer and puts it onto a 200 by 200 canvas, which CSS scales up with pixelated rendering so each cell stays a crisp square. The default speed is one generation per frame on purpose: at higher rates the colour fronts can flicker fast enough to be uncomfortable. If your system asks for reduced motion, the loop is never started and you see a single still frame; Restart and Seed spiral repaint that frame.",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "Why spirals win",
        paragraphs: [
          "A spiral is a self-sustaining wave source. Its tip keeps rotating around a small core, sending a new wavefront out on every turn, and nothing outside has to feed it. Expanding rings, by contrast, need a cell that keeps firing in the centre. Colliding wavefronts annihilate each other, so the source that fires more often pushes the collision line further and further away from itself and gradually takes over the territory.",
        ],
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "A broken wave",
        text: "Choose Classic spirals and press Seed broken wave. A lens of wavefronts spreads from the line, wraps around the edges, and after roughly 300 iterations the whole grid is covered with spirals, arranged mirror-symmetrically because the seed is symmetric.",
      },
      {
        title: "Stretch the excited phase",
        text: "Keep k₁ = k₂ = 3, set g to 12 and restart. The bands of colour are wider, because each cell spends more steps climbing towards the ill state, and spirals take much longer to appear (in test runs sometimes more than 1500 iterations). At g = 6 no spirals formed at all: large patches flash almost in unison.",
      },
      {
        title: "Make the medium stubborn",
        text: "Set k₁ and k₂ to 4 or more, keep g = 28 and restart from random. Healthy cells now need at least four infected or four ill neighbours before they react. In test runs no wave survived: the whole field was healthy, and stayed dark, within 50 iterations.",
      },
      {
        title: "Rings or turbulence",
        text: "Load Target rings (k₁ = 2, k₂ = 2, g = 40) and restart from random. In test runs the field settled into a stable pattern of concentric rings around many centres. Then load Turbulent: raising k₁ and k₂ to 3 at the same g gave a restless, fine-grained field with no lasting structure.",
      },
    ],
  },
  de: {
    metaDescription:
      "Belousov-Zhabotinsky-Spiralen im Hodgepodge-Zellularautomaten: k₁, k₂ und g auf einem 200 × 200 Gitter einstellen und sehen, wie das Modell gebaut ist.",
    heading: "So funktioniert dieser Explorer",
    intro:
      "Das Feld ist ein Gitter aus 200 mal 200 Zellen, und jede speichert eine ganze Zahl zwischen 0 und 99. In jedem Frame schauen alle Zellen gleichzeitig auf ihre acht Nachbarinnen und folgen drei kurzen Regeln. Nichts diffundiert, und trotzdem ordnet sich das Rauschen mit den Voreinstellungen innerhalb von ein paar hundert Iterationen zu rotierenden Spiralen, die der Belousov-Zhabotinsky-Reaktion in der Petrischale verblüffend ähneln. Die Spiralen gehören zu erregbaren Medien ganz allgemein, nicht zu einer bestimmten Mischung von Molekülen.",
    sections: [
      {
        heading: "Gesund, infiziert, krank",
        paragraphs: [
          "Die Regel heißt Hodgepodge-Maschine, ein Zellularautomat, den Martin Gerhardt und Heike Schuster als Spielzeugmodell einer oszillierenden chemischen Reaktion beschrieben haben. Sie leiht sich die Sprache einer Epidemie. Zustand 0 ist gesund, der höchste Zustand 99 ist krank, alles dazwischen ist mehr oder weniger infiziert. Eine gesunde Zelle steckt sich bei ihren Nachbarinnen an, eine infizierte wird stetig kränker, und eine kranke Zelle erholt sich in einem einzigen Schritt vollständig und ist wieder gesund.",
          "Dieser Kreislauf (Ruhe, steigende Erregung, Zusammenbruch, Ruhe) ist derselbe, den ein Fleck BZ-Lösung durchläuft: Der Katalysator liegt reduziert vor, eine Schwelle wird überschritten, die Oxidation geht durch, und das System setzt sich zurück. Weil jede Zelle ihre Nachbarschaft mitzieht, wird aus dem Kreislauf eine wandernde Welle. Wo eine Wellenfront reißt, rollt sich ihr freies Ende ein, und diese Einrollung ist die Spirale.",
        ],
        formula:
          "s_{t+1} = \\begin{cases} 0 & s_t = 99 \\\\ \\lfloor a/k_1 \\rfloor + \\lfloor b/k_2 \\rfloor & s_t = 0 \\\\ \\lfloor \\tfrac{S}{a+b+1} \\rfloor + g & \\text{sonst} \\end{cases}",
      },
      {
        heading: "Was die Regler bewirken",
        paragraphs: [
          "In der Formel zählt a die infizierten und b die kranken Nachbarinnen, S ist die Summe der Zustände der Zelle und ihrer acht Nachbarinnen. Eine infizierte Zelle springt also auf den Mittelwert aller nicht gesunden Zellen um sie herum, die kranken eingeschlossen, plus g. Ergebnisse über 99 werden auf 99 gekappt. k₁ (Gewicht der Infizierten, 1 bis 8) teilt die Zahl der infizierten Nachbarinnen, wenn eine gesunde Zelle entscheidet, ob sie sich ansteckt; k₂ (Gewicht der Kranken, 1 bis 8) macht dasselbe für die kranken. Bei k₁ = k₂ = 8 reagiert eine gesunde Zelle erst, wenn alle acht Nachbarinnen infiziert oder alle acht krank sind.",
          "g (Reaktionsrate, 1 bis 60) gibt an, wie viel kränker eine infizierte Zelle pro Schritt zusätzlich zum lokalen Mittelwert wird. Damit legt g die Dauer der Erregung fest: Eine Zelle braucht ungefähr 99 / g Schritte von der ersten Ansteckung bis zum Kranksein. In Testläufen mit zufälligem Start waren es im Mittel 3,7 Schritte bei g = 28 und etwas über 8 bei g = 12.",
          "Die vier Presets sind Classic spirals (k₁ = 3, k₂ = 3, g = 28, die Voreinstellung), Tight scrolls (3, 2, 36), Target rings (2, 2, 40) und Turbulent (3, 3, 40). Restart füllt das Gitter mit gleichverteilten Zufallszuständen. Seed broken wave startet dagegen mit einem leeren Gitter und einer Halbgeraden aus kranken Zellen, flankiert von Reihen mit den Zuständen 60 und 20: eine absichtlich gerissene Wellenfront, die Wellen in einem spiegelsymmetrischen Muster aussendet. Speed legt fest, wie viele Generationen pro Animationsframe laufen, von 1 bis 8.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Das Gitter ist ein Uint8Array mit 40 000 Bytes, ein Byte pro Zelle, und ein zweites Array derselben Größe nimmt die nächste Generation auf. Nach jedem Schritt werden die beiden Referenzen getauscht, während der Animation wird also kein Speicher angelegt. Die Ränder sind verbunden (das Gitter ist ein Torus), Wellen, die rechts hinauslaufen, kommen also links wieder herein.",
          "Gezeichnet wird über eine RGBA-Tabelle mit 100 Einträgen, die pro Farbskala einmal berechnet wird. Jeder Frame kopiert vier Bytes pro Zelle aus der Tabelle in einen ImageData-Puffer und legt ihn auf ein 200 mal 200 Pixel großes Canvas, das CSS mit pixeliger Darstellung hochskaliert, damit jede Zelle ein scharfes Quadrat bleibt. Die Voreinstellung von einer Generation pro Frame ist Absicht: Bei höheren Raten können die Farbfronten so schnell flackern, dass es unangenehm wird. Wünscht dein System reduzierte Bewegung, startet die Schleife gar nicht, und du siehst ein einzelnes Standbild; Restart und Seed spiral zeichnen es neu.",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "Warum Spiralen gewinnen",
        paragraphs: [
          "Eine Spirale ist eine Wellenquelle, die sich selbst erhält. Ihre Spitze kreist um einen kleinen Kern und schickt bei jeder Umdrehung eine neue Front los, ohne dass von außen etwas nachhelfen muss. Wachsende Ringe brauchen dagegen eine Zelle in der Mitte, die immer wieder zündet. Prallen zwei Fronten zusammen, löschen sie sich gegenseitig aus. Die Quelle, die öfter zündet, schiebt die Kollisionslinie deshalb immer weiter von sich weg und erobert nach und nach das Gebiet.",
        ],
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Eine gerissene Welle",
        text: "Wähle Classic spirals und drück Seed broken wave. Von der Linie breitet sich eine Linse aus Wellenfronten aus, läuft über die Ränder, und nach rund 300 Iterationen ist das ganze Gitter mit Spiralen bedeckt, spiegelsymmetrisch angeordnet, weil der Startzustand symmetrisch ist.",
      },
      {
        title: "Die Erregung strecken",
        text: "Lass k₁ = k₂ = 3, stell g auf 12 und starte neu. Die Farbbänder sind breiter, weil jede Zelle mehr Schritte braucht, um krank zu werden, und Spiralen entstehen viel später (in Testläufen teils erst nach mehr als 1500 Iterationen). Bei g = 6 bildeten sich gar keine Spiralen: Große Flecken blinken fast im Gleichtakt.",
      },
      {
        title: "Ein störrisches Medium",
        text: "Stell k₁ und k₂ auf 4 oder mehr, lass g = 28 und starte zufällig neu. Gesunde Zellen brauchen jetzt mindestens vier infizierte oder vier kranke Nachbarinnen, bevor sie reagieren. In Testläufen überlebte keine Welle: Nach höchstens 50 Iterationen war das ganze Feld gesund und blieb dunkel.",
      },
      {
        title: "Ringe oder Turbulenz",
        text: "Lade Target rings (k₁ = 2, k₂ = 2, g = 40) und starte zufällig neu. In Testläufen stellte sich ein stabiles Muster aus konzentrischen Ringen um viele Zentren ein. Lade danach Turbulent: Mit k₁ und k₂ auf 3 bei gleichem g entstand ein unruhiges, feinkörniges Feld ohne bleibende Struktur.",
      },
    ],
  },
};
