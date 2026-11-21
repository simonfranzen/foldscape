import type { ExplorerGuide } from "./types";

// Numbers quoted here (depth 1 to 7, default 5, branch length halving, root
// length a quarter of the shorter side, the 1.4 s slide with its 2x zoom) match
// app/banach/explorer/page.tsx; update both together.
const WALK_EXCERPT = `// 0 = a, 1 = a⁻¹, 2 = b, 3 = b⁻¹; INV pairs each with its inverse.
const INV = [1, 0, 3, 2] as const;
const SHRINK = 0.5;

const walk = (px, py, prevDir, first, len, d) => {
  if (d >= depth) return;
  for (let i = 0; i < 4; i++) {
    // Never step back along the inverse: words stay reduced.
    if (prevDir !== null && i === INV[prevDir]) continue;
    const nx = px + DIRS[i].dx * len;
    const ny = py + DIRS[i].dy * len;
    const firstLetter = first === null ? i : first;
    segs.push({ x1: px, y1: py, x2: nx, y2: ny, first: firstLetter, depth: d });
    walk(nx, ny, i, firstLetter, len * SHRINK, d + 1);
  }
};`;

export const BANACH_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "See the heart of the Banach-Tarski paradox: the free group F₂ drawn as a Cayley tree, split into four pieces, where one shifted piece becomes three.",
    heading: "How this explorer works",
    intro:
      "The branching cross is a map of a group, not a picture of a ball. Its centre is the identity, and every other dot is one way of combining two rotations a and b and their inverses. Coloured by the first letter of their word, the dots fall into four pieces. The surprise, and the engine of the Banach-Tarski paradox, is that one piece, moved by a single step, covers three of the four pieces plus the centre.",
    sections: [
      {
        heading: "Two rotations, no relations",
        paragraphs: [
          "Take two rotations of a sphere, a and b. Combining them gives words like ab, a⁻¹b⁻¹a or bbb. A letter next to its own inverse, as in abb⁻¹, cancels; what remains is a reduced word. For well-chosen rotations, different reduced words are always different rotations. The group they generate is then the free group on two generators, F₂. A classical choice is two rotations by the angle arccos(1/3) about perpendicular axes.",
          "Every element of F₂ except the identity starts with one of four letters. Write W(a) for all reduced words starting with a, and similarly W(a⁻¹), W(b), W(b⁻¹). Together with the identity e they split the whole group into five disjoint parts. Now multiply every word in W(a⁻¹) on the left by a. The leading a⁻¹ cancels, and what remains is every reduced word that does not start with a, including e. So one piece, shifted once, covers everything except W(a).",
        ],
        formula: "F_2 = W(a) \\sqcup a\\,W(a^{-1}) = W(b) \\sqcup b\\,W(b^{-1})",
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "Tree depth, from 1 to 7 (default 5), sets how many letters long the drawn words may be. Each new level multiplies the newest words by three, because every word can be extended by any letter except the inverse of its last one. At depth d the picture contains 2 · 3ᵈ − 1 dots: 485 at the default depth, 4373 at depth 7.",
          "The four buttons W(a), W(a⁻¹), W(b) and W(b⁻¹) highlight one piece and dim the rest; pressing the active one again clears the selection. Colours follow the generators: a points right, a⁻¹ left, b up, b⁻¹ down. Once a piece is selected, Show the trick slides it one step towards the centre and doubles its size on the way, the visual version of multiplying it by the inverse of its first letter, and a caption spells out the identity: W(g) shifted by g⁻¹ covers F₂ without W(g⁻¹).",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "The tree is drawn on a 2D canvas by a short recursive walk. From the centre it tries all four directions, skips the one that would undo the previous step (that would give a non-reduced word), and recurses with the branch length halved. Every segment remembers the first letter of its word, so colouring by piece needs no second pass. The root branch is a quarter of the canvas's shorter side; since lengths halve, the tree reaches at most twice that far and always fits.",
          "The trick is a transformation of the finished drawing, not a recomputation: every segment and dot of the highlighted piece shifts by one root length towards the inverse generator and is scaled by two about the centre, eased over 1.4 seconds. Only the edge that ends up between the centre and its neighbour keeps its length. The canvas redraws only when depth, selection, animation progress or size changes. If your system asks for reduced motion, the animation is skipped and the end state with its caption appears at once.",
        ],
        code: WALK_EXCERPT,
      },
      {
        heading: "From the tree to two balls",
        paragraphs: [
          "The animation needs one footnote. Branches are drawn half as long at every level so that the infinite tree fits on screen, and a piece that only slid would be half the size of the three subtrees it has to cover. So the explorer doubles the piece while it moves, and it lands exactly. The doubling belongs to the drawing, not to the mathematics: in the group there is no notion of size at all, only counting, and the tree has exponentially many words at each length. There is no way to give these pieces sizes that add up consistently, and that is what makes them paradoxical.",
          "Felix Hausdorff moved this onto the sphere in 1914: let F₂ act by rotations, use the Axiom of Choice to pick one point from every orbit, and carry the group's pieces over to the sphere. Banach and Tarski extended it to the solid ball in 1924, and Raphael Robinson showed in 1947 that five pieces are enough and fewer are not. In the plane nothing like this can happen with rigid motions alone, because the group of rigid motions of the plane is solvable and contains no free group on two generators. The paradox needs three dimensions.",
        ],
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "Watch one piece become three",
        text: "Keep depth at 5, select W(a⁻¹) and press Show the trick. The violet piece slides right and grows until its first node sits on the identity. Its branches now lie exactly on the pieces W(b), W(b⁻¹) and W(a⁻¹), one level short of the drawn depth: everything except W(a).",
      },
      {
        title: "Count the explosion",
        text: "Set depth to 1, then 2, 3 and so on. The number of newest words goes 4, 12, 36, 108, multiplying by three each time. In a flat grid the number of points at distance n grows only linearly; that exponential growth is what leaves room for a piece to contain copies of the rest.",
      },
      {
        title: "Two copies from four pieces",
        text: "Run the trick on W(a⁻¹): the shifted piece fills every arm except the one pointing right, and that missing arm is exactly W(a). Together they give back the entire group. Then run it on W(b⁻¹) and check that W(b) fills the gap. Four pieces, two full copies of F₂. That is the group version of one ball becoming two.",
      },
    ],
  },
  de: {
    metaDescription:
      "Das Herz des Banach-Tarski-Paradoxons: die freie Gruppe F₂ als Cayley-Baum, zerlegt in vier Stücke, von denen eines verschoben zu dreien wird.",
    heading: "So funktioniert dieser Explorer",
    intro:
      "Das verzweigte Kreuz ist eine Landkarte einer Gruppe, kein Bild einer Kugel. In der Mitte sitzt die Identität, und jeder andere Punkt ist eine Art, zwei Drehungen a und b samt ihren Inversen hintereinander auszuführen. Färbst du die Punkte nach dem Anfangsbuchstaben ihres Wortes, zerfallen sie in vier Stücke. Das Überraschende, und der Motor des Banach-Tarski-Paradoxons: Eines dieser Stücke, um einen einzigen Schritt verschoben, überdeckt drei der vier Stücke plus die Mitte.",
    sections: [
      {
        heading: "Zwei Drehungen, keine Relationen",
        paragraphs: [
          "Nimm zwei Drehungen einer Kugeloberfläche, a und b. Hintereinander ausgeführt ergeben sie Wörter wie ab, a⁻¹b⁻¹a oder bbb. Ein Buchstabe neben seinem eigenen Inversen, etwa in abb⁻¹, kürzt sich weg; was bleibt, heißt reduziertes Wort. Bei geschickt gewählten Drehungen sind verschiedene reduzierte Wörter immer verschiedene Drehungen. Die erzeugte Gruppe ist dann die freie Gruppe mit zwei Erzeugern, F₂. Eine klassische Wahl sind zwei Drehungen um den Winkel arccos(1/3) um zueinander senkrechte Achsen.",
          "Jedes Element von F₂ außer der Identität beginnt mit einem von vier Buchstaben. W(a) sind alle reduzierten Wörter, die mit a anfangen, entsprechend W(a⁻¹), W(b) und W(b⁻¹). Zusammen mit der Identität e zerlegen sie die ganze Gruppe in fünf disjunkte Teile. Multiplizierst du nun jedes Wort aus W(a⁻¹) von links mit a, kürzt sich das führende a⁻¹ weg. Übrig bleibt jedes reduzierte Wort, das nicht mit a beginnt, e eingeschlossen. Ein Stück, einmal verschoben, überdeckt also alles außer W(a).",
        ],
        formula: "F_2 = W(a) \\sqcup a\\,W(a^{-1}) = W(b) \\sqcup b\\,W(b^{-1})",
      },
      {
        heading: "Was die Regler bewirken",
        paragraphs: [
          "Die Baumtiefe von 1 bis 7 (Voreinstellung 5) legt fest, wie viele Buchstaben die gezeichneten Wörter höchstens haben. Jede neue Ebene verdreifacht die neuesten Wörter, weil sich jedes Wort um jeden Buchstaben verlängern lässt, nur nicht um das Inverse seines letzten. Bei Tiefe d enthält das Bild 2 · 3ᵈ − 1 Punkte: 485 bei der Voreinstellung, 4373 bei Tiefe 7.",
          "Die vier Knöpfe W(a), W(a⁻¹), W(b) und W(b⁻¹) heben ein Stück hervor und dimmen den Rest; ein zweiter Klick auf den aktiven Knopf hebt die Auswahl auf. Die Farben folgen den Erzeugern: a zeigt nach rechts, a⁻¹ nach links, b nach oben, b⁻¹ nach unten. Ist ein Stück gewählt, schiebt «Den Trick zeigen» es einen Schritt zur Mitte und verdoppelt dabei seine Größe, die sichtbare Fassung der Multiplikation mit dem Inversen seines Anfangsbuchstabens. Eine Beschriftung nennt die Identität dazu: W(g), verschoben um g⁻¹, überdeckt F₂ ohne W(g⁻¹).",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Der Baum entsteht auf einem 2D-Canvas durch einen kurzen rekursiven Lauf. Von der Mitte aus probiert er alle vier Richtungen, überspringt die, die den letzten Schritt rückgängig machen würde (das ergäbe ein nicht reduziertes Wort), und steigt mit halbierter Astlänge tiefer. Jedes Segment merkt sich den Anfangsbuchstaben seines Wortes, das Färben nach Stücken braucht also keinen zweiten Durchgang. Der Wurzelast ist ein Viertel der kürzeren Canvas-Seite. Weil sich die Längen halbieren, reicht der Baum höchstens doppelt so weit und passt immer.",
          "Der Trick ist eine Transformation der fertigen Zeichnung, keine Neuberechnung: Jedes Segment und jeder Punkt des gewählten Stücks wandert um eine Wurzelastlänge in Richtung des inversen Erzeugers und wird um die Mitte auf das Doppelte gestreckt, sanft beschleunigt und gebremst über 1,4 Sekunden. Nur die Kante, die am Ende zwischen der Mitte und ihrem Nachbarknoten liegt, behält ihre Länge. Das Canvas zeichnet nur neu, wenn sich Tiefe, Auswahl, Animationsfortschritt oder Größe ändern. Wünscht dein System reduzierte Bewegung, entfällt die Animation, und der Endzustand mit Beschriftung erscheint sofort.",
        ],
        code: WALK_EXCERPT,
      },
      {
        heading: "Vom Baum zu zwei Kugeln",
        paragraphs: [
          "Die Animation braucht eine Fußnote. Äste werden auf jeder Ebene halb so lang gezeichnet, damit der unendliche Baum auf den Bildschirm passt, und ein nur verschobenes Stück wäre halb so groß wie die drei Teilbäume, die es überdecken soll. Deshalb verdoppelt der Explorer das Stück, während es wandert, und es landet genau. Die Verdopplung gehört zur Zeichnung, nicht zur Mathematik: In der Gruppe gibt es überhaupt keine Größe, nur Abzählen, und der Baum hat zu jeder Länge exponentiell viele Wörter. Es gibt keine Möglichkeit, diesen Stücken Größen zu geben, die sich widerspruchsfrei addieren. Deshalb sind sie paradox.",
          "Felix Hausdorff übertrug das 1914 auf die Kugeloberfläche: F₂ wirkt durch Drehungen, das Auswahlaxiom wählt aus jeder Bahn einen Punkt, und die Stücke der Gruppe wandern auf die Sphäre. Banach und Tarski erweiterten das 1924 auf die volle Kugel, und Raphael Robinson zeigte 1947, dass fünf Stücke genügen und weniger nicht. In der Ebene ist so etwas allein mit starren Bewegungen unmöglich, weil die Gruppe ihrer starren Bewegungen auflösbar ist und keine freie Gruppe mit zwei Erzeugern enthält. Das Paradoxon braucht drei Dimensionen.",
        ],
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Aus einem Stück werden drei",
        text: "Lass die Tiefe auf 5, wähl W(a⁻¹) und drück «Den Trick zeigen». Das violette Stück gleitet nach rechts und wächst, bis sein erster Knoten auf der Identität sitzt. Seine Äste liegen jetzt genau auf den Stücken W(b), W(b⁻¹) und W(a⁻¹), eine Ebene kürzer als die gezeichnete Tiefe: alles außer W(a).",
      },
      {
        title: "Die Explosion zählen",
        text: "Stell die Tiefe auf 1, dann 2, 3 und so weiter. Die Zahl der neuesten Wörter geht 4, 12, 36, 108, jedes Mal mal drei. In einem flachen Gitter wächst die Zahl der Punkte im Abstand n nur linear. Erst dieses exponentielle Wachstum lässt Platz dafür, dass ein Stück Kopien des Rests enthält.",
      },
      {
        title: "Zwei Kopien aus vier Stücken",
        text: "Führ den Trick mit W(a⁻¹) aus: Das verschobene Stück füllt jeden Arm außer dem nach rechts, und genau dieser fehlende Arm ist W(a). Zusammen ergeben sie wieder die ganze Gruppe. Mach das Gleiche mit W(b⁻¹) und prüf, dass W(b) die Lücke füllt. Vier Stücke, zwei vollständige Kopien von F₂. Das ist die Gruppenfassung davon, dass aus einer Kugel zwei werden.",
      },
    ],
  },
};
