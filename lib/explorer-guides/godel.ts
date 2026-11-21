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

// Display formulas are shared by every locale, so they live here once.
const ENCODING_FORMULA =
  "\\ulcorner \\varphi \\urcorner = 2^{c_1} \\cdot 3^{c_2} \\cdot 5^{c_3} \\cdots p_k^{c_k}";
const G_SENTENCE_FORMULA =
  "G \\;\\Leftrightarrow\\; \\neg\\,\\exists y\\;\\mathrm{Prov}(y,\\ulcorner G \\urcorner)";

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
        formula: ENCODING_FORMULA,
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
        formula: G_SENTENCE_FORMULA,
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
        formula: ENCODING_FORMULA,
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
        formula: G_SENTENCE_FORMULA,
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
  es: {
    metaDescription:
      "El teorema de incompletitud de Gödel paso a paso: codifica fórmulas como números de Gödel, construye la frase «No soy demostrable» y sigue ambas ramas.",
    heading: "Cómo funciona este explorador",
    intro:
      "Esta sala recorre en cuatro pasos el núcleo del primer teorema de incompletitud de Gödel. Primero, cada símbolo de un pequeño lenguaje aritmético recibe un número. Después, una fórmula entera se empaqueta en un único número natural mediante potencias de primos. El paso tres usa ese truco para construir una sentencia G que habla de su propia demostrabilidad, y el paso cuatro pregunta qué ocurre si G es demostrable y qué ocurre si no lo es. Aquí nada es una metáfora: los números de la pantalla se calculan de forma exacta en tu navegador, y la lógica es la misma que Gödel publicó en 1931.",
    sections: [
      {
        heading: "Convertir fórmulas en números",
        paragraphs: [
          "El alfabeto del paso uno tiene once símbolos, cada uno con un código fijo: ¬ es 1, ∨ es 2, ∀ es 3, ∃ es 4, = es 5, el numeral 0 es 6, el sucesor S es 7, + es 8, los paréntesis son 9 y 10, y la variable x es 11. Una fórmula es una cadena finita de estos símbolos, así que se convierte en una lista finita de códigos c₁, c₂, …, cₖ.",
          "Para comprimir esa lista en un solo número, el código i-ésimo pasa a ser el exponente del i-ésimo primo. Como todo número natural tiene exactamente una factorización en primos, siempre puedes volver a leer la lista a partir del producto. Por eso todos los códigos empiezan en 1 y no en 0: un exponente 0 haría invisible un símbolo en la factorización.",
        ],
        formula: ENCODING_FORMULA,
      },
      {
        heading: "Qué hacen los controles",
        paragraphs: [
          "La barra lateral tiene dos partes. «Recorre la demostración» te lleva por los cuatro pasos: «Paso» avanza uno (se detiene en el paso 4) y «Reiniciar» vuelve al alfabeto.",
          "«Prueba una fórmula» ofrece cuatro fórmulas: 0 = 0 (verdadera), 0 = S0 (falsa, porque S0 es el número 1), ¬(0 = 0) y ∀x (0 = 0). Si eliges una mientras estás en el paso uno, saltas directamente al paso dos, donde cada símbolo aparece con su código y su primo, seguido del producto de potencias de primos y del número de Gödel resultante. Las cuatro fórmulas tienen 3, 4, 6 y 7 símbolos, y sus números crecen desde 243 000 000 para 0 = 0 hasta un número de 31 cifras para ¬(0 = 0) y uno de 42 cifras para ∀x (0 = 0). La verdad no interviene en la codificación: la falsa 0 = S0 recibe un número con la misma facilidad que la verdadera 0 = 0.",
        ],
      },
      {
        heading: "Cómo está construido",
        paragraphs: [
          "El explorador es React sin más, sin lienzo y sin bucle de animación, así que no hay nada que frenar para el movimiento reducido. Los cuatro pasos son componentes de panel independientes, y una sola variable de estado decide cuál se monta. Las fórmulas se guardan como listas de tokens, y cada token se busca en la tabla del alfabeto para obtener su código.",
          "El número de Gödel se calcula con BigInt de JavaScript, porque los números de coma flotante corrientes dejan de representar enteros exactos por encima de 2⁵³ y aquí los productos superan ese límite enseguida. Los diez primos más pequeños están escritos directamente en el código, lo que basta para la fórmula más larga que se ofrece.",
          "En el paso tres, el recuadro bajo ⌜G⌝ no muestra el número de la propia G. El verdadero ⌜G⌝ codifica una sentencia que contiene todo un predicado de demostrabilidad formalizado; es un número natural bien definido, pero demasiado largo para escribirlo. El recuadro lo dice y muestra, a modo de comparación, el número ⌜φ⌝ de la fórmula que has seleccionado.",
        ],
        code: GODEL_NUMBER_EXCERPT,
      },
      {
        heading: "De los números a la autorreferencia",
        paragraphs: [
          "En cuanto las fórmulas son números, los enunciados sobre fórmulas se vuelven enunciados sobre números. «y es el código de una demostración válida de la fórmula con código x» se convierte en una relación aritmética Prov(y, x) que el propio sistema puede expresar. El lema diagonal dice entonces: para toda propiedad P(x) existe una sentencia G que es demostrablemente equivalente a P(⌜G⌝). Si tomas como P(x) «ningún y demuestra x», obtienes la sentencia de la pantalla.",
          "El paso cuatro desarrolla los dos casos. Si el sistema S demuestra G, esa demostración tiene un código n. S puede comprobarla y demuestra así que algún y es una demostración de G, que es exactamente la negación de G. S demostraría una sentencia y su negación, y un S consistente nunca hace eso. Por tanto, un S consistente no demuestra G, y entonces lo que G dice es verdad. G es un enunciado verdadero de la aritmética que S no puede demostrar. La incompletitud exige además que S no demuestre ¬G. La demostración original de Gödel lo obtiene de la ω-consistencia, una hipótesis más fuerte que la consistencia; la sentencia modificada de Rosser (1936) se las arregla con la consistencia a secas. Formalizar este mismo argumento dentro de S da el segundo teorema: un sistema consistente y lo bastante potente para la aritmética no puede demostrar su propia consistencia.",
        ],
        formula: G_SENTENCE_FORMULA,
      },
    ],
    experimentsHeading: "Prueba esto",
    experiments: [
      {
        title: "Decodifica un número a mano",
        text: "Selecciona 0 = 0 y fíjate en 243 000 000. Divide entre 2 hasta que no puedas más: seis veces, así que el primer símbolo tiene el código 6, el numeral 0. Luego divide entre 3 (cinco veces, código 5, el signo igual) y entre 5 (seis veces, otra vez 0). Has recuperado la fórmula a partir del número y nada más.",
      },
      {
        title: "Lo verdadero y lo falso reciben números por igual",
        text: "Compara 0 = 0 con 0 = S0. El símbolo adicional S añade un factor 5⁷ y desplaza el 0 final al primo 7, de modo que el número crece hasta 142 943 535 000 000. Codificar es pura sintaxis; que una fórmula sea verdadera es otra cuestión.",
      },
      {
        title: "Mira cómo se dispara la longitud",
        text: "Recorre ¬(0 = 0) y ∀x (0 = 0). Añadir tres o cuatro símbolos convierte un número de nueve cifras en uno de 31 y en otro de 42. Imagina ahora el tamaño de ⌜G⌝, cuya fórmula contiene una definición completa de demostración.",
      },
      {
        title: "Sigue las dos ramas",
        text: "Ve al paso cuatro y lee la Rama A y la Rama B una al lado de la otra. Pregúntate qué hipótesis necesita cada rama. La Rama A solo necesita la consistencia para descartar una demostración de G. En la Rama B es donde vive la incompletitud, y hace falta algo más para descartar también una demostración de ¬G.",
      },
    ],
  },
  fr: {
    metaDescription:
      "Le théorème d'incomplétude de Gödel pas à pas : code des formules en nombres de Gödel, bâtis l'énoncé « Je ne suis pas prouvable » et suis les deux branches.",
    heading: "Comment fonctionne cet explorateur",
    intro:
      "Cette salle parcourt en quatre étapes le cœur du premier théorème d'incomplétude de Gödel. D'abord, chaque symbole d'un petit langage arithmétique reçoit un numéro. Ensuite, une formule entière est empaquetée dans un seul entier naturel à l'aide de puissances de nombres premiers. L'étape trois se sert de cette astuce pour construire un énoncé G qui parle de sa propre prouvabilité, et l'étape quatre demande ce qui se passe si G est prouvable et ce qui se passe s'il ne l'est pas. Rien ici n'est une métaphore : les nombres affichés sont calculés exactement dans ton navigateur, et la logique est celle que Gödel a publiée en 1931.",
    sections: [
      {
        heading: "Transformer des formules en nombres",
        paragraphs: [
          "L'alphabet de l'étape un compte onze symboles, chacun doté d'un code fixe : ¬ vaut 1, ∨ vaut 2, ∀ vaut 3, ∃ vaut 4, = vaut 5, le chiffre 0 vaut 6, le successeur S vaut 7, + vaut 8, les parenthèses valent 9 et 10, et la variable x vaut 11. Une formule est une suite finie de ces symboles, elle devient donc une liste finie de codes c₁, c₂, …, cₖ.",
          "Pour faire tenir cette liste dans un seul nombre, le i-ième code devient l'exposant du i-ième nombre premier. Comme tout entier naturel possède exactement une décomposition en facteurs premiers, tu peux toujours relire la liste à partir du produit. C'est pourquoi tous les codes commencent à 1 et non à 0 : un exposant 0 rendrait un symbole invisible dans la décomposition.",
        ],
        formula: ENCODING_FORMULA,
      },
      {
        heading: "À quoi servent les commandes",
        paragraphs: [
          "La barre latérale comporte deux parties. « Parcourir la preuve » te fait passer par les quatre étapes : « Étape » avance d'un cran (et s'arrête à l'étape 4), « Réinitialiser » revient à l'alphabet.",
          "« Essayer une formule » propose quatre formules : 0 = 0 (vraie), 0 = S0 (fausse, puisque S0 est le nombre 1), ¬(0 = 0) et ∀x (0 = 0). En choisir une pendant que tu es à l'étape un te fait sauter directement à l'étape deux, où chaque symbole est listé avec son code et son nombre premier, suivi du produit des puissances de nombres premiers et du nombre de Gödel obtenu. Les quatre formules comptent 3, 4, 6 et 7 symboles, et leurs nombres vont de 243\u00a0000\u00a0000 pour 0 = 0 à un nombre de 31 chiffres pour ¬(0 = 0) et un de 42 chiffres pour ∀x (0 = 0). La vérité ne joue aucun rôle dans le codage : la formule fausse 0 = S0 reçoit un nombre aussi facilement que la formule vraie 0 = 0.",
        ],
      },
      {
        heading: "Comment c'est construit",
        paragraphs: [
          "L'explorateur est du React tout simple, sans canevas ni boucle d'animation, il n'y a donc rien à ralentir pour la réduction des animations. Les quatre étapes sont des composants de panneau distincts, et une seule variable d'état décide lequel est monté. Les formules sont stockées sous forme de listes de jetons, et chaque jeton est recherché dans la table de l'alphabet pour trouver son code.",
          "Le nombre de Gödel est calculé avec le type BigInt de JavaScript, car les nombres à virgule flottante ordinaires ne représentent plus exactement les entiers au-delà de 2⁵³ et les produits dépassent vite cette limite ici. Les dix plus petits nombres premiers sont écrits en dur, ce qui suffit pour la plus longue formule proposée.",
          "À l'étape trois, l'encadré sous ⌜G⌝ n'affiche pas le nombre de G lui-même. Le véritable ⌜G⌝ code un énoncé qui contient tout un prédicat de prouvabilité formalisé ; c'est un entier naturel bien déterminé, mais beaucoup trop long pour être écrit. L'encadré le dit et montre, à titre de comparaison, le nombre ⌜φ⌝ de la formule que tu as sélectionnée.",
        ],
        code: GODEL_NUMBER_EXCERPT,
      },
      {
        heading: "Des nombres à l'autoréférence",
        paragraphs: [
          "Dès que les formules sont des nombres, les affirmations sur les formules deviennent des affirmations sur les nombres. « y est le code d'une preuve valide de la formule de code x » se transforme en une relation arithmétique Prov(y, x) que le système lui-même peut exprimer. Le lemme diagonal dit alors : pour toute propriété P(x), il existe un énoncé G qui est, de façon prouvable, équivalent à P(⌜G⌝). En prenant pour P(x) « aucun y ne prouve x », on obtient l'énoncé affiché à l'écran.",
          "L'étape quatre déroule les deux cas. Si le système S prouve G, cette preuve a un code n. S peut la vérifier et prouve ainsi qu'un certain y est une preuve de G, ce qui est exactement la négation de G. S prouverait un énoncé et sa négation, ce qu'un S cohérent ne fait jamais. Un S cohérent ne prouve donc pas G, et alors ce que dit G est vrai. G est un énoncé vrai de l'arithmétique que S ne peut pas prouver. L'incomplétude exige aussi que S ne prouve pas ¬G. La preuve originale de Gödel tire cela de l'ω-cohérence, une hypothèse plus forte que la cohérence ; l'énoncé modifié de Rosser (1936) se contente de la simple cohérence. Formaliser ce même argument à l'intérieur de S donne le second théorème : un système cohérent et assez puissant pour l'arithmétique ne peut pas prouver sa propre cohérence.",
        ],
        formula: G_SENTENCE_FORMULA,
      },
    ],
    experimentsHeading: "À essayer",
    experiments: [
      {
        title: "Décode un nombre à la main",
        text: "Sélectionne 0 = 0 et regarde 243\u00a0000\u00a0000. Divise par 2 tant que c'est possible : six fois, donc le premier symbole a le code 6, le chiffre 0. Divise ensuite par 3 (cinq fois, code 5, le signe égal) puis par 5 (six fois, de nouveau 0). Tu as retrouvé la formule à partir du nombre seul.",
      },
      {
        title: "Le vrai et le faux reçoivent des nombres de la même façon",
        text: "Compare 0 = 0 et 0 = S0. Le symbole supplémentaire S ajoute un facteur 5⁷ et décale le 0 final sur le nombre premier 7, si bien que le nombre grimpe à 142\u00a0943\u00a0535\u00a0000\u00a0000. Le codage est pure syntaxe ; savoir si une formule est vraie est une autre question.",
      },
      {
        title: "Regarde la longueur exploser",
        text: "Parcours ¬(0 = 0) et ∀x (0 = 0). Ajouter trois ou quatre symboles transforme un nombre à neuf chiffres en un nombre à 31 chiffres et un autre à 42 chiffres. Imagine alors la taille de ⌜G⌝, dont la formule contient une définition complète de la notion de preuve.",
      },
      {
        title: "Suis les deux branches",
        text: "Va à l'étape quatre et lis la Branche A et la Branche B côte à côte. Demande-toi de quelle hypothèse chaque branche a besoin. La Branche A n'a besoin que de la cohérence pour exclure une preuve de G. C'est dans la Branche B que loge l'incomplétude, et il lui faut un peu plus pour exclure aussi une preuve de ¬G.",
      },
    ],
  },
  it: {
    metaDescription:
      "Il teorema di incompletezza di Gödel passo passo: codifica le formule come numeri di Gödel, costruisci l'enunciato «Non sono dimostrabile» e segui i due rami.",
    heading: "Come funziona questo esploratore",
    intro:
      "Questa stanza percorre in quattro passi il nucleo del primo teorema di incompletezza di Gödel. Per prima cosa ogni simbolo di un piccolo linguaggio aritmetico riceve un numero. Poi un'intera formula viene impacchettata in un unico numero naturale usando potenze di primi. Il passo tre sfrutta questo trucco per costruire un enunciato G che parla della propria dimostrabilità, e il passo quattro chiede che cosa succede se G è dimostrabile e che cosa succede se non lo è. Qui niente è una metafora: i numeri sullo schermo sono calcolati in modo esatto nel tuo browser, e la logica è la stessa che Gödel pubblicò nel 1931.",
    sections: [
      {
        heading: "Trasformare le formule in numeri",
        paragraphs: [
          "L'alfabeto del passo uno ha undici simboli, ciascuno con un codice fisso: ¬ è 1, ∨ è 2, ∀ è 3, ∃ è 4, = è 5, il numerale 0 è 6, il successore S è 7, + è 8, le parentesi sono 9 e 10, e la variabile x è 11. Una formula è una stringa finita di questi simboli, quindi diventa una lista finita di codici c₁, c₂, …, cₖ.",
          "Per comprimere quella lista in un solo numero, l'i-esimo codice diventa l'esponente dell'i-esimo numero primo. Poiché ogni numero naturale ha esattamente una fattorizzazione in primi, puoi sempre rileggere la lista a partire dal prodotto. Ecco perché tutti i codici partono da 1 e non da 0: un esponente 0 renderebbe un simbolo invisibile nella fattorizzazione.",
        ],
        formula: ENCODING_FORMULA,
      },
      {
        heading: "Che cosa fanno i controlli",
        paragraphs: [
          "La barra laterale ha due parti. «Percorri la dimostrazione» ti guida attraverso i quattro passi: «Passo» avanza di uno (si ferma al passo 4) e «Reimposta» torna all'alfabeto.",
          "«Prova una formula» offre quattro formule: 0 = 0 (vera), 0 = S0 (falsa, perché S0 è il numero 1), ¬(0 = 0) e ∀x (0 = 0). Se ne scegli una mentre sei al passo uno, salti subito al passo due, dove ogni simbolo è elencato con il suo codice e il suo primo, seguito dal prodotto delle potenze di primi e dal numero di Gödel che ne risulta. Le quattro formule hanno 3, 4, 6 e 7 simboli, e i loro numeri crescono da 243 000 000 per 0 = 0 fino a un numero di 31 cifre per ¬(0 = 0) e a uno di 42 cifre per ∀x (0 = 0). La verità non ha alcun ruolo nella codifica: la falsa 0 = S0 riceve un numero con la stessa facilità della vera 0 = 0.",
        ],
      },
      {
        heading: "Com'è costruito",
        paragraphs: [
          "L'esploratore è semplice React, senza canvas e senza ciclo di animazione, quindi non c'è nulla da rallentare per il movimento ridotto. I quattro passi sono componenti pannello separati, e una sola variabile di stato decide quale viene montato. Le formule sono memorizzate come liste di token, e ogni token viene cercato nella tabella dell'alfabeto per trovarne il codice.",
          "Il numero di Gödel è calcolato con BigInt di JavaScript, perché i normali numeri in virgola mobile non rappresentano più esattamente gli interi sopra 2⁵³ e qui i prodotti superano in fretta quella soglia. I dieci primi più piccoli sono scritti direttamente nel codice, il che basta per la formula più lunga tra quelle proposte.",
          "Al passo tre, il riquadro sotto ⌜G⌝ non stampa il numero di G stesso. Il vero ⌜G⌝ codifica un enunciato che contiene un intero predicato di dimostrabilità formalizzato; è un numero naturale ben definito, ma troppo lungo per essere scritto per esteso. Il riquadro lo dice e mostra, per confronto, il numero ⌜φ⌝ della formula che hai selezionato.",
        ],
        code: GODEL_NUMBER_EXCERPT,
      },
      {
        heading: "Dai numeri all'autoriferimento",
        paragraphs: [
          "Una volta che le formule sono numeri, le affermazioni sulle formule diventano affermazioni sui numeri. «y è il codice di una dimostrazione valida della formula di codice x» si trasforma in una relazione aritmetica Prov(y, x) che il sistema stesso è in grado di esprimere. Il lemma diagonale dice allora: per ogni proprietà P(x) esiste un enunciato G che è dimostrabilmente equivalente a P(⌜G⌝). Scegliendo come P(x) «nessun y dimostra x» si ottiene l'enunciato sullo schermo.",
          "Il passo quattro sviluppa entrambi i casi. Se il sistema S dimostra G, quella dimostrazione ha un codice n. S può verificarla e quindi dimostra che un certo y è una dimostrazione di G, che è esattamente la negazione di G. S dimostrerebbe un enunciato e la sua negazione, e un S coerente non lo fa mai. Dunque un S coerente non dimostra G, e allora ciò che G dice è vero. G è un enunciato vero dell'aritmetica che S non può dimostrare. L'incompletezza richiede inoltre che S non dimostri ¬G. La dimostrazione originale di Gödel lo ricava dalla ω-coerenza, un'ipotesi più forte della coerenza; l'enunciato modificato di Rosser (1936) se la cava con la sola coerenza. Formalizzare proprio questo argomento all'interno di S dà il secondo teorema: un sistema coerente e abbastanza potente per l'aritmetica non può dimostrare la propria coerenza.",
        ],
        formula: G_SENTENCE_FORMULA,
      },
    ],
    experimentsHeading: "Prova così",
    experiments: [
      {
        title: "Decodifica un numero a mano",
        text: "Seleziona 0 = 0 e guarda 243 000 000. Dividi per 2 finché puoi: sei volte, quindi il primo simbolo ha codice 6, il numerale 0. Poi dividi per 3 (cinque volte, codice 5, il segno di uguale) e per 5 (sei volte, di nuovo 0). Hai ricostruito la formula a partire dal solo numero.",
      },
      {
        title: "Vero e falso ricevono numeri allo stesso modo",
        text: "Confronta 0 = 0 con 0 = S0. Il simbolo in più S aggiunge un fattore 5⁷ e sposta lo 0 finale sul primo 7, così il numero cresce fino a 142 943 535 000 000. La codifica è pura sintassi; se una formula sia vera è un'altra questione.",
      },
      {
        title: "Guarda la lunghezza esplodere",
        text: "Percorri ¬(0 = 0) e ∀x (0 = 0). Aggiungere tre o quattro simboli trasforma un numero di nove cifre in uno di 31 e in uno di 42. Poi immagina le dimensioni di ⌜G⌝, la cui formula contiene una definizione completa di dimostrazione.",
      },
      {
        title: "Segui entrambi i rami",
        text: "Vai al passo quattro e leggi il Ramo A e il Ramo B uno accanto all'altro. Chiediti di quale ipotesi ha bisogno ciascun ramo. Al Ramo A basta la coerenza per escludere una dimostrazione di G. È nel Ramo B che abita l'incompletezza, e gli serve qualcosa in più per escludere anche una dimostrazione di ¬G.",
      },
    ],
  },
  pt: {
    metaDescription:
      "O teorema da incompletude de Gödel passo a passo: codifica fórmulas como números de Gödel, constrói a frase «Não sou demonstrável» e segue os dois ramos.",
    heading: "Como funciona este explorador",
    intro:
      "Esta sala percorre em quatro passos o núcleo do primeiro teorema da incompletude de Gödel. Primeiro, cada símbolo de uma pequena linguagem aritmética recebe um número. Depois, uma fórmula inteira é empacotada num único número natural com potências de primos. O passo três usa esse truque para construir uma frase G que fala da sua própria demonstrabilidade, e o passo quatro pergunta o que acontece se G for demonstrável e o que acontece se não for. Nada aqui é metáfora: os números no ecrã são calculados de forma exata no teu navegador, e a lógica é a mesma que Gödel publicou em 1931.",
    sections: [
      {
        heading: "Transformar fórmulas em números",
        paragraphs: [
          "O alfabeto do passo um tem onze símbolos, cada um com um código fixo: ¬ é 1, ∨ é 2, ∀ é 3, ∃ é 4, = é 5, o numeral 0 é 6, o sucessor S é 7, + é 8, os parênteses são 9 e 10, e a variável x é 11. Uma fórmula é uma cadeia finita destes símbolos, pelo que se torna uma lista finita de códigos c₁, c₂, …, cₖ.",
          "Para espremer essa lista num só número, o i-ésimo código passa a ser o expoente do i-ésimo primo. Como todo o número natural tem exatamente uma fatorização em primos, podes sempre voltar a ler a lista a partir do produto. É por isso que todos os códigos começam em 1 e não em 0: um expoente 0 tornaria um símbolo invisível na fatorização.",
        ],
        formula: ENCODING_FORMULA,
      },
      {
        heading: "O que fazem os controlos",
        paragraphs: [
          "A barra lateral tem duas partes. «Percorrer a prova» leva-te pelos quatro passos: «Passo» avança um (para no passo 4) e «Reiniciar» volta ao alfabeto.",
          "«Experimenta uma fórmula» oferece quatro fórmulas: 0 = 0 (verdadeira), 0 = S0 (falsa, porque S0 é o número 1), ¬(0 = 0) e ∀x (0 = 0). Se escolheres uma enquanto estás no passo um, saltas diretamente para o passo dois, onde cada símbolo aparece com o seu código e o seu primo, seguido do produto de potências de primos e do número de Gödel resultante. As quatro fórmulas têm 3, 4, 6 e 7 símbolos, e os seus números crescem de 243\u00a0000\u00a0000 para 0 = 0 até um número de 31 algarismos para ¬(0 = 0) e um de 42 algarismos para ∀x (0 = 0). A verdade não tem qualquer papel na codificação: a falsa 0 = S0 recebe um número com a mesma facilidade que a verdadeira 0 = 0.",
        ],
      },
      {
        heading: "Como está construído",
        paragraphs: [
          "O explorador é React simples, sem canvas e sem ciclo de animação, por isso não há nada para abrandar no modo de movimento reduzido. Os quatro passos são componentes de painel separados, e uma única variável de estado decide qual deles é montado. As fórmulas são guardadas como listas de tokens, e cada token é procurado na tabela do alfabeto para encontrar o seu código.",
          "O número de Gödel é calculado com BigInt de JavaScript, porque os números de vírgula flutuante comuns deixam de representar inteiros exatos acima de 2⁵³ e os produtos aqui ultrapassam esse limite rapidamente. Os dez primos mais pequenos estão escritos diretamente no código, o que chega para a fórmula mais longa disponível.",
          "No passo três, a caixa por baixo de ⌜G⌝ não mostra o número da própria G. O verdadeiro ⌜G⌝ codifica uma frase que contém todo um predicado de demonstrabilidade formalizado; é um número natural bem definido, mas demasiado longo para ser escrito. A caixa diz isso mesmo e mostra, para comparação, o número ⌜φ⌝ da fórmula que selecionaste.",
        ],
        code: GODEL_NUMBER_EXCERPT,
      },
      {
        heading: "Dos números à autorreferência",
        paragraphs: [
          "Assim que as fórmulas são números, as afirmações sobre fórmulas tornam-se afirmações sobre números. «y é o código de uma prova válida da fórmula com código x» transforma-se numa relação aritmética Prov(y, x) que o próprio sistema consegue exprimir. O lema diagonal diz então: para toda a propriedade P(x) existe uma frase G que é demonstravelmente equivalente a P(⌜G⌝). Escolhendo para P(x) «nenhum y prova x», obtém-se a frase no ecrã.",
          "O passo quatro desenvolve os dois casos. Se o sistema S prova G, essa prova tem um código n. S consegue verificá-la e assim prova que algum y é uma prova de G, o que é exatamente a negação de G. S provaria uma frase e a sua negação, e um S consistente nunca o faz. Logo, um S consistente não prova G, e então aquilo que G diz é verdade. G é uma afirmação verdadeira da aritmética que S não consegue provar. A incompletude exige ainda que S não prove ¬G. A prova original de Gödel obtém isso da ω-consistência, uma hipótese mais forte do que a consistência; a frase modificada de Rosser (1936) arranja-se apenas com a consistência. Formalizar este mesmo argumento dentro de S dá o segundo teorema: um sistema consistente e suficientemente forte para a aritmética não consegue provar a sua própria consistência.",
        ],
        formula: G_SENTENCE_FORMULA,
      },
    ],
    experimentsHeading: "Experimenta isto",
    experiments: [
      {
        title: "Descodifica um número à mão",
        text: "Seleciona 0 = 0 e olha para 243\u00a0000\u00a0000. Divide por 2 até não dar mais: seis vezes, logo o primeiro símbolo tem o código 6, o numeral 0. Depois divide por 3 (cinco vezes, código 5, o sinal de igual) e por 5 (seis vezes, outra vez 0). Recuperaste a fórmula só a partir do número.",
      },
      {
        title: "Verdadeiro e falso recebem números da mesma maneira",
        text: "Compara 0 = 0 com 0 = S0. O símbolo extra S acrescenta um fator 5⁷ e empurra o 0 final para o primo 7, pelo que o número cresce para 142\u00a0943\u00a0535\u00a0000\u00a0000. Codificar é pura sintaxe; se uma fórmula é verdadeira é outra questão.",
      },
      {
        title: "Vê o comprimento a explodir",
        text: "Percorre ¬(0 = 0) e ∀x (0 = 0). Acrescentar três ou quatro símbolos transforma um número de nove algarismos num de 31 e noutro de 42. Imagina agora o tamanho de ⌜G⌝, cuja fórmula contém uma definição completa de prova.",
      },
      {
        title: "Segue os dois ramos",
        text: "Vai ao passo quatro e lê o Ramo A e o Ramo B lado a lado. Pergunta-te de que hipótese precisa cada ramo. O Ramo A só precisa da consistência para excluir uma prova de G. É no Ramo B que mora a incompletude, e ele precisa de um pouco mais para excluir também uma prova de ¬G.",
      },
    ],
  },
  sv: {
    metaDescription:
      "Gödels ofullständighetssats steg för steg: koda formler som Gödeltal med primtalspotenser, bygg satsen ”Jag är inte bevisbar” och följ båda grenarna.",
    heading: "Så fungerar den här utforskaren",
    intro:
      "Det här rummet går igenom kärnan i Gödels första ofullständighetssats i fyra steg. Först får varje symbol i ett litet aritmetiskt språk ett nummer. Sedan packas en hel formel in i ett enda naturligt tal med hjälp av primtalspotenser. Steg tre använder det tricket för att bygga en sats G som talar om sin egen bevisbarhet, och steg fyra frågar vad som händer om G är bevisbar och vad som händer om den inte är det. Ingenting här är en metafor: talen på skärmen beräknas exakt i din webbläsare, och logiken är densamma som Gödel publicerade 1931.",
    sections: [
      {
        heading: "Att göra formler till tal",
        paragraphs: [
          "Alfabetet i steg ett har elva symboler, var och en med en fast kod: ¬ är 1, ∨ är 2, ∀ är 3, ∃ är 4, = är 5, siffran 0 är 6, efterföljaren S är 7, + är 8, parenteserna är 9 och 10, och variabeln x är 11. En formel är en ändlig sträng av de här symbolerna, så den blir en ändlig lista av koder c₁, c₂, …, cₖ.",
          "För att pressa in den listan i ett enda tal blir den i:te koden exponent till det i:te primtalet. Eftersom varje naturligt tal har exakt en primtalsfaktorisering kan du alltid läsa ut listan ur produkten igen. Därför börjar alla koder på 1 och inte på 0: en exponent 0 skulle göra en symbol osynlig i faktoriseringen.",
        ],
        formula: ENCODING_FORMULA,
      },
      {
        heading: "Vad reglagen gör",
        paragraphs: [
          "Sidofältet har två delar. ”Gå igenom beviset” tar dig genom de fyra stegen: ”Steg” går ett steg framåt (och stannar vid steg 4), ”Återställ” hoppar tillbaka till alfabetet.",
          "”Pröva en formel” erbjuder fyra formler: 0 = 0 (sann), 0 = S0 (falsk, eftersom S0 är talet 1), ¬(0 = 0) och ∀x (0 = 0). Väljer du en av dem medan du är på steg ett hoppar du direkt till steg två, där varje symbol listas med sin kod och sitt primtal, följt av produkten av primtalspotenser och det Gödeltal som blir resultatet. De fyra formlerna har 3, 4, 6 och 7 symboler, och deras tal växer från 243\u00a0000\u00a0000 för 0 = 0 till ett 31-siffrigt tal för ¬(0 = 0) och ett 42-siffrigt för ∀x (0 = 0). Sanning spelar ingen roll för kodningen: den falska 0 = S0 får ett tal lika lätt som den sanna 0 = 0.",
        ],
      },
      {
        heading: "Hur den är byggd",
        paragraphs: [
          "Utforskaren är vanlig React utan canvas och utan animationsslinga, så det finns inget att bromsa för minskad rörelse. De fyra stegen är separata panelkomponenter, och en enda tillståndsvariabel avgör vilken som visas. Formlerna lagras som tokenlistor, och varje token slås upp i alfabetstabellen för att hitta dess kod.",
          "Gödeltalet beräknas med JavaScripts BigInt, eftersom vanliga flyttal inte längre återger heltal exakt över 2⁵³ och produkterna här snabbt växer förbi den gränsen. De tio minsta primtalen är hårdkodade, vilket räcker för den längsta formeln som erbjuds.",
          "I steg tre skriver rutan under ⌜G⌝ inte ut G:s eget tal. Det verkliga ⌜G⌝ kodar en sats som innehåller ett helt formaliserat bevisbarhetspredikat. Det är ett bestämt naturligt tal, men alldeles för långt för att skrivas ut. Rutan säger det och visar som jämförelse talet ⌜φ⌝ för den formel du har valt.",
        ],
        code: GODEL_NUMBER_EXCERPT,
      },
      {
        heading: "Från tal till självreferens",
        paragraphs: [
          "När formler väl är tal blir påståenden om formler till påståenden om tal. ”y är koden för ett giltigt bevis av formeln med kod x” blir en aritmetisk relation Prov(y, x) som systemet självt kan uttrycka. Diagonallemmat säger då: för varje egenskap P(x) finns en sats G som bevisbart är ekvivalent med P(⌜G⌝). Väljer man P(x) som ”inget y bevisar x” får man satsen på skärmen.",
          "Steg fyra spelar igenom båda fallen. Om systemet S bevisar G har det beviset en kod n. S kan kontrollera det och bevisar därmed att något y är ett bevis för G, vilket är exakt negationen av G. S skulle bevisa en sats och dess negation, och det gör ett motsägelsefritt S aldrig. Alltså bevisar ett motsägelsefritt S inte G, och då är det G säger sant. G är ett sant aritmetiskt påstående som S inte kan bevisa. Ofullständigheten kräver också att S inte bevisar ¬G. Gödels ursprungliga bevis får det ur ω-konsistens, ett starkare antagande än motsägelsefrihet. Rossers modifierade sats (1936) klarar sig med enbart motsägelsefrihet. Att formalisera just det här argumentet inuti S ger den andra satsen: ett motsägelsefritt system som är starkt nog för aritmetik kan inte bevisa sin egen motsägelsefrihet.",
        ],
        formula: G_SENTENCE_FORMULA,
      },
    ],
    experimentsHeading: "Prova det här",
    experiments: [
      {
        title: "Avkoda ett tal för hand",
        text: "Välj 0 = 0 och titta på 243\u00a0000\u00a0000. Dela med 2 tills det inte går längre: sex gånger, så den första symbolen har kod 6, siffran 0. Dela sedan med 3 (fem gånger, kod 5, likhetstecknet) och med 5 (sex gånger, 0 igen). Du har återskapat formeln ur enbart talet.",
      },
      {
        title: "Sant och falskt får tal på samma sätt",
        text: "Jämför 0 = 0 med 0 = S0. Den extra symbolen S lägger till en faktor 5⁷ och flyttar den sista nollan till primtalet 7, så talet växer till 142\u00a0943\u00a0535\u00a0000\u00a0000. Kodning är ren syntax. Om en formel är sann är en annan fråga.",
      },
      {
        title: "Se längden explodera",
        text: "Stega igenom ¬(0 = 0) och ∀x (0 = 0). Tre eller fyra symboler till gör ett niosiffrigt tal till ett 31-siffrigt och ett 42-siffrigt. Föreställ dig sedan storleken på ⌜G⌝, vars formel innehåller en fullständig definition av bevis.",
      },
      {
        title: "Följ båda grenarna",
        text: "Gå till steg fyra och läs Gren A och Gren B sida vid sida. Fråga dig vilket antagande varje gren behöver. Gren A behöver bara motsägelsefrihet för att utesluta ett bevis för G. Det är i Gren B som ofullständigheten bor, och den behöver lite mer för att också utesluta ett bevis för ¬G.",
      },
    ],
  },
  no: {
    metaDescription:
      "Gödels ufullstendighetsteorem steg for steg: Kod formler som Gödel-tall med primtallspotenser, bygg setningen «Jeg er ikke bevisbar» og følg begge grenene.",
    heading: "Slik fungerer denne utforskeren",
    intro:
      "Dette rommet går gjennom kjernen i Gödels første ufullstendighetsteorem i fire steg. Først får hvert symbol i et lite aritmetisk språk et nummer. Deretter pakkes en hel formel inn i ett eneste naturlig tall ved hjelp av primtallspotenser. Steg tre bruker det trikset til å bygge en setning G som snakker om sin egen bevisbarhet, og steg fire spør hva som skjer hvis G er bevisbar, og hva som skjer hvis den ikke er det. Ingenting her er en metafor: Tallene på skjermen regnes ut eksakt i nettleseren din, og logikken er den samme som Gödel publiserte i 1931.",
    sections: [
      {
        heading: "Å gjøre formler om til tall",
        paragraphs: [
          "Alfabetet i steg én har elleve symboler, hvert med en fast kode: ¬ er 1, ∨ er 2, ∀ er 3, ∃ er 4, = er 5, sifferet 0 er 6, etterfølgeren S er 7, + er 8, parentesene er 9 og 10, og variabelen x er 11. En formel er en endelig streng av disse symbolene, så den blir en endelig liste av koder c₁, c₂, …, cₖ.",
          "For å presse den listen inn i ett enkelt tall blir den i-te koden eksponenten til det i-te primtallet. Siden hvert naturlig tall har nøyaktig én primtallsfaktorisering, kan du alltid lese listen ut av produktet igjen. Derfor starter alle kodene på 1 og ikke på 0: En eksponent 0 ville gjort et symbol usynlig i faktoriseringen.",
        ],
        formula: ENCODING_FORMULA,
      },
      {
        heading: "Hva kontrollene gjør",
        paragraphs: [
          "Sidefeltet har to deler. «Gå gjennom beviset» tar deg gjennom de fire stegene: «Steg» går ett steg fram (og stopper ved steg 4), «Nullstill» hopper tilbake til alfabetet.",
          "«Prøv en formel» tilbyr fire formler: 0 = 0 (sann), 0 = S0 (falsk, siden S0 er tallet 1), ¬(0 = 0) og ∀x (0 = 0). Velger du en av dem mens du er på steg én, hopper du rett til steg to, der hvert symbol står oppført med koden sin og primtallet sitt, fulgt av produktet av primtallspotenser og det ferdige Gödel-tallet. De fire formlene har 3, 4, 6 og 7 symboler, og tallene deres vokser fra 243\u00a0000\u00a0000 for 0 = 0 til et 31-sifret tall for ¬(0 = 0) og et 42-sifret for ∀x (0 = 0). Sannhet spiller ingen rolle i kodingen: Den usanne 0 = S0 får et tall like lett som den sanne 0 = 0.",
        ],
      },
      {
        heading: "Slik er den bygget",
        paragraphs: [
          "Utforskeren er ren React uten lerret og uten animasjonsløkke, så det er ingenting å bremse for redusert bevegelse. De fire stegene er egne panelkomponenter, og én enkelt tilstandsvariabel avgjør hvilken som vises. Formlene er lagret som tokenlister, og hvert token slås opp i alfabettabellen for å finne koden.",
          "Gödel-tallet regnes ut med BigInt i JavaScript, fordi vanlige flyttall ikke lenger gjengir heltall eksakt over 2⁵³, og produktene her vokser raskt forbi den grensen. De ti minste primtallene er hardkodet, og det holder for den lengste formelen som tilbys.",
          "I steg tre skriver ikke boksen under ⌜G⌝ ut G sitt eget tall. Det virkelige ⌜G⌝ koder en setning som inneholder et helt formalisert bevisbarhetspredikat. Det er et bestemt naturlig tall, men altfor langt til å skrives ut. Boksen sier nettopp det og viser til sammenligning tallet ⌜φ⌝ for formelen du har valgt.",
        ],
        code: GODEL_NUMBER_EXCERPT,
      },
      {
        heading: "Fra tall til selvreferanse",
        paragraphs: [
          "Når formler først er tall, blir påstander om formler til påstander om tall. «y er koden til et gyldig bevis for formelen med kode x» blir en aritmetisk relasjon Prov(y, x) som systemet selv kan uttrykke. Diagonallemmaet sier da: For enhver egenskap P(x) finnes det en setning G som er bevisbart ekvivalent med P(⌜G⌝). Velger man P(x) som «ingen y beviser x», får man setningen på skjermen.",
          "Steg fire spiller gjennom begge tilfellene. Hvis systemet S beviser G, har det beviset en kode n. S kan kontrollere det og beviser dermed at en eller annen y er et bevis for G, og det er nøyaktig negasjonen av G. S ville bevist en setning og negasjonen av den, og det gjør et motsigelsesfritt S aldri. Altså beviser ikke et motsigelsesfritt S setningen G, og da er det G sier, sant. G er en sann aritmetisk påstand som S ikke kan bevise. Ufullstendighet krever dessuten at S ikke beviser ¬G. Gödels opprinnelige bevis får det fra ω-konsistens, en sterkere antakelse enn motsigelsesfrihet. Rossers modifiserte setning (1936) klarer seg med ren motsigelsesfrihet. Å formalisere nettopp dette argumentet inne i S gir det andre teoremet: Et motsigelsesfritt system som er sterkt nok for aritmetikk, kan ikke bevise sin egen motsigelsesfrihet.",
        ],
        formula: G_SENTENCE_FORMULA,
      },
    ],
    experimentsHeading: "Prøv dette",
    experiments: [
      {
        title: "Dekod et tall for hånd",
        text: "Velg 0 = 0 og se på 243\u00a0000\u00a0000. Del på 2 så lenge det går: seks ganger, så det første symbolet har kode 6, sifferet 0. Del så på 3 (fem ganger, kode 5, likhetstegnet) og på 5 (seks ganger, 0 igjen). Du har hentet formelen tilbake fra tallet alene.",
      },
      {
        title: "Sant og usant får tall på samme måte",
        text: "Sammenlign 0 = 0 med 0 = S0. Det ekstra symbolet S legger til en faktor 5⁷ og flytter den siste nullen til primtallet 7, så tallet vokser til 142\u00a0943\u00a0535\u00a0000\u00a0000. Koding er ren syntaks. Om en formel er sann, er et annet spørsmål.",
      },
      {
        title: "Se lengden eksplodere",
        text: "Gå gjennom ¬(0 = 0) og ∀x (0 = 0). Tre eller fire symboler til gjør et nisifret tall om til et 31-sifret og et 42-sifret. Forestill deg så størrelsen på ⌜G⌝, der formelen inneholder en fullstendig definisjon av bevis.",
      },
      {
        title: "Følg begge grenene",
        text: "Gå til steg fire og les Gren A og Gren B side om side. Spør deg selv hvilken antakelse hver gren trenger. Gren A trenger bare motsigelsesfrihet for å utelukke et bevis for G. Det er i Gren B ufullstendigheten bor, og den trenger litt mer for også å utelukke et bevis for ¬G.",
      },
    ],
  },
};
