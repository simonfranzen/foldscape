import type { ExplorerGuide } from "./types";

// Numbers quoted here (200 × 200 grid, D_a = 0.16 and D_b = 0.08, slider
// ranges, the seven presets and their 1500-step ramp, 20 seed blotches of
// radius 3 to 5, the radius-5 centred seed, gain 3.5, 6000 reduced-motion
// steps) match app/[locale]/turingpattern/explorer/page.tsx; update both together.
const EULER_EXCERPT = `// 5-point Laplacian with toroidal wrap, then one explicit Euler step (dt = 1)
const lapA = aCur[row + xL] + aCur[row + xR] + aCur[rowU + x] + aCur[rowD + x] - 4 * aC;
const lapB = bCur[row + xL] + bCur[row + xR] + bCur[rowU + x] + bCur[rowD + x] - 4 * bC;
const abb = aC * bC * bC;
let aN = aC + (p.Da * lapA - abb + F * (1 - aC));
let bN = bC + (p.Db * lapB + abb - (F + k) * bC);
if (aN < 0) aN = 0;
else if (aN > 1) aN = 1;
if (bN < 0) bN = 0;
else if (bN > 1) bN = 1;
aNext[i] = aN;
bNext[i] = bN;`;

export const TURINGPATTERN_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Grow Turing patterns live with the Gray-Scott reaction-diffusion model: tune feed and kill rates to get spots, mazes, worms and dividing cells.",
    heading: "How this explorer works",
    intro:
      "The glowing field is a 200 × 200 grid holding two virtual chemicals. One of them, a, is fed in everywhere. The other, b, consumes a to make more of itself and is slowly removed. Both spread to neighbouring cells, a twice as fast as b. The picture is bright where b is concentrated. From a few random blotches, these simple rules grow spots, stripes, labyrinths or cells that divide, and which of these you get depends mostly on two numbers.",
    sections: [
      {
        heading: "Turing's idea and the Gray-Scott model",
        paragraphs: [
          "In 1952 Alan Turing published «The Chemical Basis of Morphogenesis». His surprising claim was that diffusion, which normally smooths everything out, can create pattern: if two reacting substances spread at different speeds, a perfectly uniform mixture can become unstable and break up into a regular structure. The essential ingredients are a substance that amplifies itself locally and an inhibiting effect that reaches further.",
          "The Gray-Scott model is one of the simplest systems with this behaviour. Its reaction is a + 2b → 3b: wherever b is present it converts a into more b, which is the term ab² below. The feed rate F pulls a back towards 1, as if fresh a were pumped in, and also drains b; the kill rate k removes b on top of that. John Pearson mapped this system in 1993 and found a whole zoo of patterns in a small window of F and k, the zoo the presets come from.",
        ],
        formula:
          "\\frac{\\partial a}{\\partial t} = D_a \\nabla^2 a - a b^2 + F(1-a), \\qquad \\frac{\\partial b}{\\partial t} = D_b \\nabla^2 b + a b^2 - (F+k)\\, b",
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "The seven presets set F and k: Spots (0.025, 0.06), Mitosis (0.0367, 0.0649), Maze (0.029, 0.057), Worms (0.046, 0.065), Holes (0.039, 0.058), Solitons (0.03, 0.062) and Coral (0.0545, 0.0625). A preset does not clear the grid. It glides F and k to the new pair over 1500 simulation steps, because a sudden jump makes dense patterns such as the maze die out everywhere at once. This way the current pattern reorganises itself under the new rules.",
          "The sliders act at once. F runs from 0 to 0.1 and k from 0 to 0.08, both in steps of 0.0005. D_a, the diffusion rate of a, runs from 0.05 to 0.25 (default 0.16), and D_b from 0.02 to 0.12 (default 0.08). «Reset random» clears the grid and drops 20 soft blotches of radius 3 to 5 cells at random places; «Reset centered» drops a single blotch of radius 5 in the middle. The speed slider sets how many simulation steps run per animation frame, from 1 to 20 (default 8), next to a Play/Pause button and four colour maps.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "The state lives in four Float32Arrays: the current and the next values of a and b. Each simulation step reads the current arrays and writes the next ones, then the two pairs swap roles, so no memory is allocated while it runs. The Laplacian, which measures how much a cell differs from its four neighbours, uses the classic five-point stencil, and the grid wraps around at the edges, so the field is really a torus with no borders.",
          "Time advances with explicit Euler steps of size 1, and both concentrations are clamped to the range from 0 to 1. Seeds use soft values (a around 0.5, b around 0.25, with a little noise) rather than hard jumps from 0 to 1, because a sharp edge creates a huge Laplacian that would make the integration blow up within a few steps. They are also small on purpose: a soft disc of radius 6 or more burns out from its middle, and with the Mitosis values it vanishes completely.",
          "To paint a frame, b is multiplied by 3.5, clamped, and looked up in a 256-entry colour table, then written into a 200 × 200 ImageData and scaled up with pixelated rendering. If your system asks for reduced motion, the page computes 6000 steps without drawing them and shows a single still image; pressing a preset or reset button computes a new still.",
        ],
        code: EULER_EXCERPT,
      },
      {
        heading: "Why the diffusion sliders matter",
        paragraphs: [
          "With the default values a spreads twice as fast as b. A growing patch of b uses up a in its surroundings, and because a diffuses quickly, that shortage reaches well beyond the patch itself. New patches cannot form inside the depleted halo, so patches keep a typical distance from each other. This is Turing's local activation and long-range inhibition, and it is why spots end up roughly evenly spaced.",
          "There is also a numerical reason for the range of D_a. For an explicit Euler step on this grid, diffusion alone stays stable only while 4 · D · dt ≤ 1. With dt = 1 that means D ≤ 0.25, which is exactly where the D_a slider ends.",
        ],
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "Watch spots multiply",
        text: "Choose Mitosis and press «Reset random». The blotches break up into spots, and the spots keep stretching and splitting in two. At the default speed there are well over a hundred of them within a minute or so.",
      },
      {
        title: "Morph one pattern into another",
        text: "Start with Spots and let the dots fill the grid. Then click Maze without resetting. Because presets keep the field, you can watch neighbouring dots reach towards each other and fuse into winding corridors. Click Spots again and the corridors break back up into dots.",
      },
      {
        title: "Starve the pattern",
        text: "From the Spots preset, drag k slowly up towards 0.075. The spots shrink and eventually vanish, leaving a dark field: b is now removed faster than the reaction can replace it, and the uniform state without b is the only one left.",
      },
      {
        title: "Break Turing's condition",
        text: "From the Spots preset, lower D_a until it equals D_b at 0.08. Turing's analysis says that without a difference in diffusion speeds the uniform state cannot destabilise on its own, and here the spots indeed fade away. Raise D_a back to 0.16 and press «Reset random» to bring them back.",
      },
    ],
  },
  de: {
    metaDescription:
      "Turing-Muster live wachsen lassen mit dem Gray-Scott-Modell der Reaktion und Diffusion: Zufuhr- und Abbaurate einstellen für Punkte, Labyrinthe und Zellteilung.",
    heading: "So funktioniert dieser Explorer",
    intro:
      "Das leuchtende Feld ist ein Gitter aus 200 × 200 Zellen mit zwei virtuellen Chemikalien. Die eine, a, wird überall nachgefüllt. Die andere, b, verbraucht a, um sich selbst zu vermehren, und wird langsam abgebaut. Beide breiten sich in Nachbarzellen aus, a doppelt so schnell wie b. Hell ist das Bild dort, wo viel b ist. Aus ein paar zufälligen Flecken wachsen mit diesen einfachen Regeln Punkte, Streifen, Labyrinthe oder Zellen, die sich teilen, und was davon entsteht, hängt vor allem von zwei Zahlen ab.",
    sections: [
      {
        heading: "Turings Idee und das Gray-Scott-Modell",
        paragraphs: [
          "1952 veröffentlichte Alan Turing «The Chemical Basis of Morphogenesis». Seine überraschende Behauptung: Diffusion, die normalerweise alles glättet, kann Muster erzeugen. Breiten sich zwei reagierende Stoffe unterschiedlich schnell aus, kann eine vollkommen gleichmäßige Mischung instabil werden und in eine regelmäßige Struktur zerfallen. Die Zutaten sind ein Stoff, der sich lokal selbst verstärkt, und eine hemmende Wirkung, die weiter reicht.",
          "Das Gray-Scott-Modell ist eines der einfachsten Systeme mit diesem Verhalten. Seine Reaktion ist a + 2b → 3b: Wo b vorhanden ist, wandelt es a in weiteres b um, das ist der Term ab² unten. Die Zufuhrrate F zieht a zurück in Richtung 1, als würde frisches a hineingepumpt, und spült zugleich b aus; die Abbaurate k entfernt b zusätzlich. John Pearson kartierte dieses System 1993 und fand in einem kleinen Fenster von F und k einen ganzen Zoo von Mustern, aus dem die Voreinstellungen stammen.",
        ],
        formula:
          "\\frac{\\partial a}{\\partial t} = D_a \\nabla^2 a - a b^2 + F(1-a), \\qquad \\frac{\\partial b}{\\partial t} = D_b \\nabla^2 b + a b^2 - (F+k)\\, b",
      },
      {
        heading: "Was die Regler bewirken",
        paragraphs: [
          "Die sieben Voreinstellungen setzen F und k: Punkte (0,025, 0,06), Mitose (0,0367, 0,0649), Labyrinth (0,029, 0,057), Würmer (0,046, 0,065), Löcher (0,039, 0,058), Solitonen (0,03, 0,062) und Koralle (0,0545, 0,0625). Eine Voreinstellung leert das Gitter nicht. Sie führt F und k über 1500 Simulationsschritte zum neuen Wertepaar, weil ein plötzlicher Sprung dichte Muster wie das Labyrinth überall zugleich absterben lässt. So ordnet sich das aktuelle Muster unter den neuen Regeln um.",
          "Die Regler wirken sofort. F reicht von 0 bis 0,1 und k von 0 bis 0,08, beide in Schritten von 0,0005. D_a, die Diffusionsrate von a, reicht von 0,05 bis 0,25 (voreingestellt 0,16), D_b von 0,02 bis 0,12 (voreingestellt 0,08). «Neustart zufällig» leert das Gitter und setzt 20 weiche Flecken mit 3 bis 5 Zellen Radius an zufällige Stellen; «Neustart mittig» setzt einen einzelnen Fleck mit Radius 5 in die Mitte. Der Geschwindigkeitsregler bestimmt, wie viele Simulationsschritte pro Animationsframe laufen, von 1 bis 20 (voreingestellt 8), daneben gibt es einen Knopf für Start und Pause und vier Farbskalen.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Der Zustand steckt in vier Float32Arrays: den aktuellen und den nächsten Werten von a und b. Jeder Simulationsschritt liest die aktuellen Arrays und schreibt die nächsten, danach tauschen die Paare die Rollen, während des Laufs wird also kein Speicher angelegt. Der Laplace-Operator, der misst, wie stark eine Zelle von ihren vier Nachbarinnen abweicht, nutzt die klassische Fünf-Punkte-Schablone, und das Gitter ist an den Rändern verbunden. Das Feld ist also eigentlich ein Torus ohne Ränder.",
          "Die Zeit schreitet in expliziten Euler-Schritten der Größe 1 voran, und beide Konzentrationen werden auf den Bereich von 0 bis 1 begrenzt. Die Startflecken haben weiche Werte (a um 0,5, b um 0,25, mit etwas Rauschen) statt harter Sprünge von 0 auf 1, weil eine scharfe Kante einen riesigen Laplace-Wert erzeugt, der die Integration binnen weniger Schritte explodieren ließe. Sie sind außerdem absichtlich klein: Eine weiche Scheibe ab Radius 6 brennt von der Mitte her aus, und mit den Werten von Mitose verschwindet sie ganz.",
          "Für jedes Bild wird b mit 3,5 multipliziert, begrenzt und in einer Farbtabelle mit 256 Einträgen nachgeschlagen, dann in ein ImageData mit 200 × 200 Pixeln geschrieben und pixelig hochskaliert. Wünscht dein System reduzierte Bewegung, rechnet die Seite 6000 Schritte, ohne sie zu zeichnen, und zeigt ein einziges Standbild; ein Klick auf eine Voreinstellung oder einen Neustart berechnet ein neues.",
        ],
        code: EULER_EXCERPT,
      },
      {
        heading: "Warum die Diffusionsregler zählen",
        paragraphs: [
          "Mit den Standardwerten breitet sich a doppelt so schnell aus wie b. Ein wachsender Fleck aus b verbraucht a in seiner Umgebung, und weil a schnell diffundiert, reicht dieser Mangel weit über den Fleck hinaus. Im ausgezehrten Hof können keine neuen Flecken entstehen, deshalb halten Flecken einen typischen Abstand zueinander. Das ist Turings lokale Aktivierung mit weitreichender Hemmung, und deshalb liegen Punkte am Ende ungefähr gleichmäßig verteilt.",
          "Für den Bereich von D_a gibt es außerdem einen numerischen Grund. Bei einem expliziten Euler-Schritt auf diesem Gitter bleibt die Diffusion allein nur stabil, solange 4 · D · dt ≤ 1 gilt. Mit dt = 1 heißt das D ≤ 0,25, und genau dort endet der Regler für D_a.",
        ],
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Punkte vermehren sich",
        text: "Wähle Mitose und drück «Neustart zufällig». Die Flecken zerfallen in Punkte, und die Punkte strecken sich und teilen sich immer wieder. Bei der voreingestellten Geschwindigkeit sind es nach etwa einer Minute weit über hundert.",
      },
      {
        title: "Ein Muster ins andere verwandeln",
        text: "Starte mit Punkte und lass die Punkte das Gitter füllen. Klick dann ohne Neustart auf Labyrinth. Weil Voreinstellungen das Feld behalten, siehst du, wie benachbarte Punkte aufeinander zuwachsen und zu gewundenen Gängen verschmelzen. Klick wieder auf Punkte, und die Gänge zerfallen zurück in Punkte.",
      },
      {
        title: "Das Muster aushungern",
        text: "Zieh k ausgehend von der Voreinstellung Punkte langsam in Richtung 0,075. Die Punkte schrumpfen und verschwinden schließlich, zurück bleibt ein dunkles Feld: b wird jetzt schneller entfernt, als die Reaktion es ersetzen kann, und übrig bleibt nur der gleichförmige Zustand ohne b.",
      },
      {
        title: "Turings Bedingung brechen",
        text: "Senke D_a ausgehend von der Voreinstellung Punkte, bis es mit 0,08 gleich D_b ist. Nach Turings Analyse kann der gleichförmige Zustand ohne Unterschied in den Diffusionsgeschwindigkeiten nicht von selbst instabil werden, und tatsächlich verblassen die Punkte hier. Stell D_a zurück auf 0,16 und drück «Neustart zufällig», um sie zurückzuholen.",
      },
    ],
  },
};
