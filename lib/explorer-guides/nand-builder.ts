import type { ExplorerGuide } from "./types";

// Gate wirings and NAND counts quoted here match the GATES table in
// app/nand/builder/page.tsx; update both together.
const NAND_EXCERPT = `XOR: {
  formula: "(a ↑ (a ↑ b)) ↑ (b ↑ (a ↑ b))",
  eval: (a, b) => (a !== b ? 1 : 0),
  wires: [
    { name: "n0", left: "a",  right: "b"  },
    { name: "n1", left: "a",  right: "n0" },
    { name: "n2", left: "b",  right: "n0" },
    { name: "n3", left: "n1", right: "n2" },
  ],
},

// Every wire is a NAND of two earlier signals
for (const w of wires) {
  vals[w.name] = vals[w.left] && vals[w.right] ? 0 : 1;
}`;

export const NAND_BUILDER_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Build NOT, AND, OR and XOR from NAND gates alone, flip the inputs and watch every internal wire. See why NAND is functionally complete and how XOR needs four.",
    heading: "How this builder works",
    intro:
      "Every gate on this page is made of one single kind of part: the NAND gate. It outputs 0 only when both of its inputs are 1, and 1 in every other case. That sounds too modest to be useful, yet any Boolean function at all can be wired from NAND gates and nothing else. The builder shows five gates built this way, lets you flip the two inputs, and displays the value on every internal wire, so you can follow the signal through the circuit instead of taking the truth table on trust.",
    sections: [
      {
        heading: "Why one gate is enough",
        paragraphs: [
          "A set of logic gates is called functionally complete when every Boolean function can be expressed with it. AND, OR and NOT together are complete, because any truth table can be written as an OR of AND terms, one term per row that outputs 1. So it is enough to show that NAND can imitate those three. That is exactly the chain this builder walks through: NOT first, then AND, then OR.",
          "The arrow ↑ is a common notation for NAND. Wire both inputs of one NAND to the same signal and you get NOT, because a ↑ a is 0 exactly when a is 1. Put a NOT behind a NAND and the double negation leaves AND. OR uses De Morgan's law: a or b is the same as not (not a and not b), which is a NAND of the two inverted inputs.",
        ],
        formula:
          "\\neg a = a \\uparrow a, \\quad a \\land b = (a \\uparrow b) \\uparrow (a \\uparrow b), \\quad a \\lor b = (a \\uparrow a) \\uparrow (b \\uparrow b)",
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "The panel on the right lists the five gates with their NAND counts: NAND itself (1), NOT (1), AND (2), OR (3) and XOR (4). Pick one, and the header shows its formula written purely with ↑. The two large circles labelled a and b are the inputs; click or tap them to toggle between 0 and 1. Both start at 0. The output circle below lights up in the gate's colour when the result is 1.",
          "For every gate with more than one NAND, a box titled Internal NANDs lists each intermediate wire, for example n0 = a ↑ b, together with its current value. The truth table in the sidebar shows all four input combinations for the selected gate and highlights the row that matches your current inputs. NOT ignores input b completely, which the table makes visible: its two halves are identical.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "Each gate is a small data record. Besides the label and colour it carries a list of wires, and each wire is a NAND whose two inputs refer by name to a, b or an earlier wire. Evaluation is a single pass in order: start with the values of a and b, compute each wire as a NAND of two values already known, and read the output from the last wire. Because wires may only refer backwards, the circuit can never contain a loop, and one pass is always enough.",
          "The truth table is deliberately computed another way. Every gate also has a direct formula such as a !== b for XOR, and the table is filled from that formula, while the output circle and the internal wires come from the NAND wiring. If the wiring were wrong, the highlighted table row and the output circle would disagree. There is no animation and no canvas here, only React state and plain markup, so the page works the same with reduced motion; the colour fades are ordinary CSS transitions that the site shortens globally when your system asks for less motion.",
        ],
        code: NAND_EXCERPT,
      },
      {
        heading: "Inside the XOR",
        paragraphs: [
          "XOR is the most interesting circuit on the list. A naive construction from the formula (a and not b) or (b and not a) would cost far more than four NANDs. The trick is that the first NAND, n0 = a ↑ b, is shared. n1 = a ↑ n0 is 0 only when a is 1 and b is 0, n2 = b ↑ n0 is 0 only when b is 1 and a is 0, and the final NAND of the two outputs 1 exactly when one of them is 0. Four gates is the minimum for XOR from two-input NANDs.",
          "That shared n0 matters in practice too. It is the inverted AND of the two inputs, so adding one more NAND as an inverter gives a ∧ b. XOR delivers the sum bit and AND the carry bit of a half adder, the circuit that adds two single bits, and with the shared wire the whole half adder needs only five NAND gates.",
        ],
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "Watch De Morgan at work",
        text: "Select OR and set both inputs to 0. n0 and n1 (the two inverted inputs) are both 1, so the final NAND gives 0. Flip either input to 1 and one inversion drops to 0, which is enough to make the output 1.",
      },
      {
        title: "Catch the XOR canceling out",
        text: "Select XOR and set a = 1, b = 1. n0 drops to 0, which forces both n1 and n2 to 1, and the last NAND outputs 0. Now set b back to 0 and see n1 become the only wire that changes to 0.",
      },
      {
        title: "Spot the double negation",
        text: "Select AND and step through all four input rows. n1 is always the opposite of n0: the second NAND is nothing but a NOT gate with both inputs tied to n0.",
      },
      {
        title: "Count the cost",
        text: "Compare the NAND counts in the list: 1, 1, 2, 3, 4. Then ask yourself how many NANDs a NOR gate would need. NOR is just OR followed by NOT, so four is enough.",
      },
    ],
  },
  de: {
    metaDescription:
      "NOT, AND, OR und XOR nur aus NAND-Gattern bauen, Eingänge umschalten, jede Leitung verfolgen und sehen, warum NAND funktional vollständig ist.",
    heading: "So funktioniert dieser Baukasten",
    intro:
      "Jedes Gatter auf dieser Seite besteht aus einer einzigen Art von Bauteil: dem NAND-Gatter. Es gibt nur dann 0 aus, wenn beide Eingänge 1 sind, und in jedem anderen Fall 1. Das klingt zu bescheiden, um nützlich zu sein, und trotzdem lässt sich jede beliebige boolesche Funktion allein aus NAND-Gattern verdrahten. Der Baukasten zeigt fünf so gebaute Gatter, du kannst die beiden Eingänge umschalten und siehst den Wert auf jeder internen Leitung. So verfolgst du das Signal durch die Schaltung, statt der Wahrheitstabelle einfach zu glauben.",
    sections: [
      {
        heading: "Warum ein Gatter genügt",
        paragraphs: [
          "Eine Menge von Logikgattern heißt funktional vollständig, wenn sich damit jede boolesche Funktion ausdrücken lässt. AND, OR und NOT zusammen sind vollständig, denn jede Wahrheitstabelle lässt sich als OR von AND-Termen schreiben, ein Term pro Zeile mit Ausgabe 1. Es reicht also zu zeigen, dass NAND diese drei nachbauen kann. Genau diese Kette geht der Baukasten durch: erst NOT, dann AND, dann OR.",
          "Der Pfeil ↑ ist eine gängige Schreibweise für NAND. Legst du beide Eingänge eines NAND auf dasselbe Signal, bekommst du NOT, denn a ↑ a ist genau dann 0, wenn a gleich 1 ist. Setzt du ein NOT hinter ein NAND, bleibt nach der doppelten Verneinung AND übrig. OR nutzt das Gesetz von De Morgan: a oder b ist dasselbe wie nicht (nicht a und nicht b), also ein NAND der beiden invertierten Eingänge.",
        ],
        formula:
          "\\neg a = a \\uparrow a, \\quad a \\land b = (a \\uparrow b) \\uparrow (a \\uparrow b), \\quad a \\lor b = (a \\uparrow a) \\uparrow (b \\uparrow b)",
      },
      {
        heading: "Was die Bedienelemente tun",
        paragraphs: [
          "Die Leiste rechts listet die fünf Gatter mit ihrer NAND-Zahl: NAND selbst (1), NOT (1), AND (2), OR (3) und XOR (4). Wählst du eines aus, zeigt die Kopfzeile seine Formel, geschrieben nur mit ↑. Die beiden großen Kreise a und b sind die Eingänge, ein Klick oder Tipp schaltet sie zwischen 0 und 1 um. Beide starten bei 0. Der Ausgangskreis darunter leuchtet in der Farbe des Gatters, wenn das Ergebnis 1 ist.",
          "Bei jedem Gatter mit mehr als einem NAND listet ein Kasten «Interne NANDs» jede Zwischenleitung auf, zum Beispiel n0 = a ↑ b, zusammen mit ihrem aktuellen Wert. Die Wahrheitstabelle in der Seitenleiste zeigt alle vier Eingabekombinationen für das gewählte Gatter und hebt die Zeile hervor, die zu deinen aktuellen Eingängen passt. NOT ignoriert den Eingang b vollständig, und die Tabelle macht das sichtbar: Ihre beiden Hälften sind gleich.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Jedes Gatter ist ein kleiner Datensatz. Neben Bezeichnung und Farbe enthält er eine Liste von Leitungen, und jede Leitung ist ein NAND, dessen zwei Eingänge per Namen auf a, b oder eine frühere Leitung verweisen. Ausgewertet wird in einem einzigen Durchlauf der Reihe nach: Mit den Werten von a und b beginnen, jede Leitung als NAND zweier schon bekannter Werte berechnen und den Ausgang an der letzten Leitung ablesen. Weil Leitungen nur nach hinten verweisen dürfen, kann die Schaltung nie eine Schleife enthalten, und ein Durchlauf reicht immer.",
          "Die Wahrheitstabelle wird absichtlich auf anderem Weg berechnet. Jedes Gatter hat zusätzlich eine direkte Formel, etwa a !== b für XOR, und daraus wird die Tabelle gefüllt, während Ausgangskreis und interne Leitungen aus der NAND-Verdrahtung stammen. Wäre die Verdrahtung falsch, würden die hervorgehobene Tabellenzeile und der Ausgangskreis einander widersprechen. Es gibt hier keine Animation und kein Canvas, nur React-State und schlichtes Markup, die Seite verhält sich bei reduzierter Bewegung also genauso. Die Farbübergänge sind gewöhnliche CSS-Transitions, die die Seite global verkürzt, wenn dein System weniger Bewegung wünscht.",
        ],
        code: NAND_EXCERPT,
      },
      {
        heading: "Ein Blick ins XOR",
        paragraphs: [
          "XOR ist die spannendste Schaltung der Liste. Ein naiver Aufbau nach der Formel (a und nicht b) oder (b und nicht a) würde deutlich mehr als vier NANDs kosten. Der Trick: Das erste NAND, n0 = a ↑ b, wird geteilt. n1 = a ↑ n0 ist nur dann 0, wenn a gleich 1 und b gleich 0 ist, n2 = b ↑ n0 nur dann, wenn b gleich 1 und a gleich 0 ist, und das letzte NAND gibt genau dann 1 aus, wenn eines der beiden 0 ist. Vier Gatter sind das Minimum für XOR aus NANDs mit zwei Eingängen.",
          "Das geteilte n0 zählt auch in der Praxis. Es ist das negierte AND der beiden Eingänge, mit einem weiteren NAND als Inverter erhältst du also a ∧ b. XOR liefert das Summenbit und AND das Übertragsbit eines Halbaddierers, der Schaltung, die zwei einzelne Bits addiert. Dank der geteilten Leitung braucht der ganze Halbaddierer nur fünf NAND-Gatter.",
        ],
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "De Morgan bei der Arbeit",
        text: "Wähl OR und setz beide Eingänge auf 0. n0 und n1 (die beiden invertierten Eingänge) sind beide 1, also liefert das letzte NAND 0. Schalte einen der Eingänge auf 1, und eine Inversion fällt auf 0. Das reicht schon für Ausgang 1.",
      },
      {
        title: "Das XOR hebt sich auf",
        text: "Wähl XOR und setz a = 1, b = 1. n0 fällt auf 0, das zwingt n1 und n2 auf 1, und das letzte NAND gibt 0 aus. Stell b dann wieder auf 0 und sieh zu, wie n1 als einzige Leitung auf 0 wechselt.",
      },
      {
        title: "Die doppelte Verneinung entdecken",
        text: "Wähl AND und geh alle vier Eingabezeilen durch. n1 ist immer das Gegenteil von n0: Das zweite NAND ist nichts anderes als ein NOT-Gatter, dessen beide Eingänge an n0 hängen.",
      },
      {
        title: "Die Kosten zählen",
        text: "Vergleich die NAND-Zahlen in der Liste: 1, 1, 2, 3, 4. Überleg dann, wie viele NANDs ein NOR-Gatter bräuchte. NOR ist einfach OR mit einem NOT dahinter, vier reichen also.",
      },
    ],
  },
};
