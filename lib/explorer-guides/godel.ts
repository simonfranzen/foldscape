import type { ExplorerGuide } from "./types";

// The symbol codes, primes and Gödel numbers quoted here (243 000 000 for
// 0 = 0, the 42-digit number for ∀x (0 = 0)) match ALPHABET, PRIMES and
// godelNumber in app/godel/explorer/page.tsx; update both together.
const GODEL_NUMBER_EXCERPT = `const PRIMES = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n];

// Gödel number of a token sequence: the product of p_i ^ code_i.
// BigInt, because even "0 = S0" pushes past 10^10.
function godelNumber(tokens: string[]): bigint {
  let n = 1n;
  for (let i = 0; i < tokens.length; i++) {
    const code = lookupCode(tokens[i]);
    let factor = 1n;
    for (let k = 0; k < code; k++) factor *= PRIMES[i] ?? 2n;
    n *= factor;
  }
  return n;
}`;

export const GODEL_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Step through Gödel's incompleteness theorem: encode formulas as prime-power Gödel numbers, build the sentence «I am not provable» and follow both branches.",
    heading: "How this explorer works",
    intro:
      "This room walks through the core of Gödel's first incompleteness theorem in four steps. First every symbol of a small arithmetic language gets a number. Then a whole formula is packed into one natural number using prime powers. Step three uses that trick to build a sentence G that talks about its own provability, and step four asks what happens if G is provable and what happens if it is not. Nothing here is a metaphor: the numbers on screen are computed exactly in your browser, and the logic is the same one Gödel published in 1931.",
    sections: [
      {
        heading: "Turning formulas into numbers",
        paragraphs: [
          "The alphabet in step one has eleven symbols, each with a fixed code: ¬ is 1, ∨ is 2, ∀ is 3, ∃ is 4, = is 5, the numeral 0 is 6, the successor S is 7, + is 8, the parentheses are 9 and 10, and the variable x is 11. A formula is a finite string of these symbols, so it becomes a finite list of codes c₁, c₂, …, cₖ.",
          "To squeeze that list into a single number, the i-th code becomes the exponent of the i-th prime. Because every natural number has exactly one prime factorisation, you can always read the list back out of the product. That is why all codes start at 1 and not at 0: an exponent of 0 would make a symbol invisible in the factorisation.",
        ],
        formula:
          "\\ulcorner \\varphi \\urcorner = 2^{c_1} \\cdot 3^{c_2} \\cdot 5^{c_3} \\cdots p_k^{c_k}",
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "The sidebar has two parts. «Walk through the proof» moves you through the four steps: Step advances by one (it stops at step 4) and Reset jumps back to the alphabet.",
          "«Try a formula» offers four formulas: 0 = 0 (true), 0 = S0 (false, since S0 is the number 1), ¬(0 = 0) and ∀x (0 = 0). Picking one while you are on step one jumps straight to step two, where each symbol is listed with its code and its prime, followed by the product of prime powers and the resulting Gödel number. The four formulas have 3, 4, 6 and 7 symbols, and their numbers grow from 243 000 000 for 0 = 0 to a 31-digit number for ¬(0 = 0) and a 42-digit one for ∀x (0 = 0). Truth plays no role in the encoding: the false 0 = S0 gets a number just as easily as the true 0 = 0.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "The explorer is plain React with no canvas and no animation loop, so there is nothing to slow down for reduced motion. The four steps are separate panel components, and a single state variable decides which one is mounted. The formulas are stored as token lists, and each token is looked up in the alphabet table to find its code.",
          "The Gödel number is computed with JavaScript BigInt, because ordinary floating point numbers lose exact integers above 2⁵³ and the products here outgrow that quickly. The ten smallest primes are hard-coded, which is enough for the longest formula on offer.",
          "In step three the box under ⌜G⌝ does not print G's own number. The real ⌜G⌝ encodes a sentence that contains a whole formalised provability predicate; it is a definite natural number, but far too long to write out. The box says so and shows, for comparison, the number ⌜φ⌝ of the formula you selected.",
        ],
        code: GODEL_NUMBER_EXCERPT,
      },
      {
        heading: "From numbers to self-reference",
        paragraphs: [
          "Once formulas are numbers, statements about formulas become statements about numbers. «y is the code of a valid proof of the formula with code x» turns into an arithmetic relation Prov(y, x) that the system itself can express. The diagonal lemma then says: for every property P(x) there is a sentence G that is provably equivalent to P(⌜G⌝). Choosing P(x) as «no y proves x» gives the sentence on screen.",
          "Step four plays out both cases. If the system S proves G, that proof has a code n. S can check it and so proves that some y is a proof of G, which is exactly the negation of G. S would prove a sentence and its negation, and a consistent S never does. So a consistent S does not prove G, and then what G says is true. G is a true statement of arithmetic that S cannot prove. Incompleteness also requires that S does not prove ¬G. Gödel's original proof gets that from ω-consistency, a stronger assumption than consistency; Rosser's modified sentence (1936) manages with plain consistency. Formalising this very argument inside S gives the second theorem: a consistent system strong enough for arithmetic cannot prove its own consistency.",
        ],
        formula:
          "G \\;\\Leftrightarrow\\; \\neg\\,\\exists y\\;\\mathrm{Prov}(y,\\ulcorner G \\urcorner)",
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "Decode a number by hand",
        text: "Select 0 = 0 and look at 243 000 000. Divide by 2 until you cannot: six times, so the first symbol has code 6, the numeral 0. Then divide by 3 (five times, code 5, the equals sign) and by 5 (six times, 0 again). You have recovered the formula from the number alone.",
      },
      {
        title: "True and false get numbers alike",
        text: "Compare 0 = 0 with 0 = S0. The extra symbol S adds a factor 5⁷ and shifts the final 0 to the prime 7, so the number grows to 142 943 535 000 000. Encoding is pure syntax; whether a formula is true is a separate question.",
      },
      {
        title: "Watch the length explode",
        text: "Step through ¬(0 = 0) and ∀x (0 = 0). Adding three or four symbols turns a nine-digit number into a 31-digit and a 42-digit one. Then imagine the size of ⌜G⌝, whose formula contains a full definition of proof.",
      },
      {
        title: "Follow both branches",
        text: "Go to step four and read Branch A and Branch B side by side. Ask yourself which assumption each branch needs. Branch A only needs consistency to rule out a proof of G. Branch B is where incompleteness lives, and it needs a little more to rule out a proof of ¬G as well.",
      },
    ],
  },
  de: {
    metaDescription:
      "Gödels Unvollständigkeitssatz Schritt für Schritt: Formeln als Primzahlpotenzen codieren, den Satz «Ich bin nicht beweisbar» bauen und beide Fälle prüfen.",
    heading: "So funktioniert dieser Explorer",
    intro:
      "Dieser Raum führt in vier Schritten durch den Kern von Gödels erstem Unvollständigkeitssatz. Zuerst bekommt jedes Symbol einer kleinen Arithmetiksprache eine Nummer. Dann wird eine ganze Formel mit Hilfe von Primzahlpotenzen in eine einzige natürliche Zahl verpackt. Schritt drei nutzt diesen Trick, um einen Satz G zu bauen, der über seine eigene Beweisbarkeit spricht, und Schritt vier fragt, was passiert, wenn G beweisbar ist, und was, wenn nicht. Nichts davon ist eine Metapher: Die Zahlen auf dem Bildschirm werden in deinem Browser exakt berechnet, und die Logik ist dieselbe, die Gödel 1931 veröffentlicht hat.",
    sections: [
      {
        heading: "Aus Formeln werden Zahlen",
        paragraphs: [
          "Das Alphabet in Schritt eins hat elf Symbole mit festen Codes: ¬ ist 1, ∨ ist 2, ∀ ist 3, ∃ ist 4, = ist 5, die Ziffer 0 ist 6, der Nachfolger S ist 7, + ist 8, die Klammern sind 9 und 10, die Variable x ist 11. Eine Formel ist eine endliche Kette dieser Symbole, also wird sie zu einer endlichen Liste von Codes c₁, c₂, …, cₖ.",
          "Um diese Liste in eine einzige Zahl zu pressen, wird der i-te Code zum Exponenten der i-ten Primzahl. Weil jede natürliche Zahl genau eine Primfaktorzerlegung hat, lässt sich die Liste aus dem Produkt immer wieder herauslesen. Deshalb beginnen alle Codes bei 1 und nicht bei 0: Ein Exponent 0 würde ein Symbol in der Zerlegung unsichtbar machen.",
        ],
        formula:
          "\\ulcorner \\varphi \\urcorner = 2^{c_1} \\cdot 3^{c_2} \\cdot 5^{c_3} \\cdots p_k^{c_k}",
      },
      {
        heading: "Was die Bedienelemente tun",
        paragraphs: [
          "Die Seitenleiste hat zwei Teile. «Durch den Beweis gehen» führt dich durch die vier Schritte: «Schritt» geht eins weiter (bei Schritt 4 ist Schluss), «Zurücksetzen» springt zurück zum Alphabet.",
          "Unter «Eine Formel ausprobieren» stehen vier Formeln: 0 = 0 (wahr), 0 = S0 (falsch, denn S0 ist die Zahl 1), ¬(0 = 0) und ∀x (0 = 0). Wählst du eine davon in Schritt eins, springt der Explorer direkt zu Schritt zwei. Dort steht jedes Symbol mit seinem Code und seiner Primzahl, darunter das Produkt der Primzahlpotenzen und die fertige Gödelzahl. Die vier Formeln haben 3, 4, 6 und 7 Symbole, und ihre Zahlen wachsen von 243 000 000 für 0 = 0 bis zu einer 31-stelligen Zahl für ¬(0 = 0) und einer 42-stelligen für ∀x (0 = 0). Wahrheit spielt beim Codieren keine Rolle: Das falsche 0 = S0 bekommt genauso leicht eine Nummer wie das wahre 0 = 0.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Der Explorer ist reines React ohne Canvas und ohne Animationsschleife, für reduzierte Bewegung muss also nichts gebremst werden. Die vier Schritte sind eigene Panel-Komponenten, und eine einzige Zustandsvariable entscheidet, welche davon angezeigt wird. Die Formeln liegen als Tokenlisten vor, und jedes Token wird in der Alphabettabelle nachgeschlagen, um seinen Code zu finden.",
          "Die Gödelzahl wird mit BigInt berechnet, weil gewöhnliche Gleitkommazahlen ganze Zahlen oberhalb von 2⁵³ nicht mehr exakt darstellen und die Produkte hier schnell darüber hinauswachsen. Die zehn kleinsten Primzahlen sind fest hinterlegt, das reicht für die längste angebotene Formel.",
          "In Schritt drei druckt das Feld unter ⌜G⌝ nicht die Zahl von G selbst. Das echte ⌜G⌝ codiert einen Satz, der ein komplettes formalisiertes Beweisbarkeitsprädikat enthält; es ist eine bestimmte natürliche Zahl, aber viel zu lang zum Ausschreiben. Das Feld sagt das auch und zeigt zum Vergleich die Zahl ⌜φ⌝ der Formel, die du ausgewählt hast.",
        ],
        code: GODEL_NUMBER_EXCERPT,
      },
      {
        heading: "Von Zahlen zur Selbstbezüglichkeit",
        paragraphs: [
          "Sobald Formeln Zahlen sind, werden Aussagen über Formeln zu Aussagen über Zahlen. «y ist der Code eines gültigen Beweises der Formel mit Code x» wird zu einer arithmetischen Relation Prov(y, x), die das System selbst ausdrücken kann. Das Diagonal-Lemma sagt dann: Zu jeder Eigenschaft P(x) gibt es einen Satz G, der beweisbar äquivalent zu P(⌜G⌝) ist. Mit P(x) als «kein y beweist x» entsteht der Satz auf dem Bildschirm.",
          "Schritt vier spielt beide Fälle durch. Beweist das System S den Satz G, dann hat dieser Beweis einen Code n. S kann ihn nachprüfen und beweist damit, dass es ein y gibt, das G beweist, also genau die Verneinung von G. S würde einen Satz und seine Verneinung beweisen, und das tut ein widerspruchsfreies S nie. Ein widerspruchsfreies S beweist G also nicht, und dann stimmt genau, was G behauptet. G ist eine wahre Aussage der Arithmetik, die S nicht beweisen kann. Zur Unvollständigkeit gehört außerdem, dass S auch ¬G nicht beweist. Gödels ursprünglicher Beweis folgert das aus der ω-Konsistenz, einer stärkeren Annahme als Widerspruchsfreiheit; Rossers abgewandelter Satz (1936) kommt mit bloßer Widerspruchsfreiheit aus. Formalisiert man genau dieses Argument innerhalb von S, folgt der zweite Satz: Ein widerspruchsfreies System, das stark genug für Arithmetik ist, kann seine eigene Widerspruchsfreiheit nicht beweisen.",
        ],
        formula:
          "G \\;\\Leftrightarrow\\; \\neg\\,\\exists y\\;\\mathrm{Prov}(y,\\ulcorner G \\urcorner)",
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Eine Zahl von Hand decodieren",
        text: "Wähle 0 = 0 und sieh dir 243 000 000 an. Teile durch 2, solange es geht: sechsmal, also hat das erste Symbol den Code 6, die Ziffer 0. Dann durch 3 (fünfmal, Code 5, das Gleichheitszeichen) und durch 5 (sechsmal, wieder 0). Du hast die Formel allein aus der Zahl zurückgewonnen.",
      },
      {
        title: "Wahr und falsch werden gleich codiert",
        text: "Vergleiche 0 = 0 mit 0 = S0. Das zusätzliche S bringt einen Faktor 5⁷ und schiebt die letzte 0 auf die Primzahl 7, die Zahl wächst auf 142 943 535 000 000. Codieren ist reine Syntax; ob eine Formel wahr ist, ist eine andere Frage.",
      },
      {
        title: "Sieh die Länge explodieren",
        text: "Geh ¬(0 = 0) und ∀x (0 = 0) durch. Drei oder vier Symbole mehr machen aus einer neunstelligen Zahl eine 31-stellige und eine 42-stellige. Stell dir dann vor, wie groß ⌜G⌝ ist, dessen Formel eine vollständige Definition von «Beweis» enthält.",
      },
      {
        title: "Beide Zweige verfolgen",
        text: "Geh zu Schritt vier und lies Zweig A und Zweig B nebeneinander. Frag dich, welche Annahme jeder Zweig braucht. Zweig A braucht nur Widerspruchsfreiheit, um einen Beweis von G auszuschließen. In Zweig B wohnt die Unvollständigkeit, und er braucht etwas mehr, um auch einen Beweis von ¬G auszuschließen.",
      },
    ],
  },
};
