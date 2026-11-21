import type { ExplorerGuide } from "./types";

// Step counts quoted here (9 steps from ι (ι (ι ι)) to K, 11 to S, the
// 5 to 200 step limit with default 40) match lib/iota/reduce.ts and
// app/iota/reducer/page.tsx; update both together.
const REDUCE_EXCERPT = `export function reduceOnce(t: Term): Term | null {
  // I x → x
  if (t.kind === "app" && t.f.kind === "sym" && t.f.name === "I") return t.x;
  // K x y → x
  if (t.kind === "app" && t.f.kind === "app" &&
      t.f.f.kind === "sym" && t.f.f.name === "K") return t.f.x;
  // S x y z → x z (y z)
  if (/* t is ((S x) y) z */) return app(app(x, z), app(y, z));
  // ι x → x S K
  if (t.kind === "app" && t.f.kind === "sym" && t.f.name === "i")
    return app(app(t.x, sym("S")), sym("K"));
  // no redex at the root: try the function side first, then the argument
  if (t.kind === "app") {
    const lf = reduceOnce(t.f);
    if (lf) return app(lf, t.x);
    const rx = reduceOnce(t.x);
    if (rx) return app(t.f, rx);
  }
  return null;
}`;

// Display formulas are shared by every locale, so they live here once.
const REDUCTION_RULES_FORMULA =
  "I\\,x \\to x \\qquad K\\,x\\,y \\to x \\qquad S\\,x\\,y\\,z \\to x\\,z\\,(y\\,z) \\qquad \\iota\\,x \\to x\\,S\\,K";

export const IOTA_REDUCER_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "An SKI and Iota combinator reducer in your browser: type a term, watch it rewrite step by step and rebuild K and S from the single combinator ι alone.",
    heading: "How this reducer works",
    intro:
      "The text field holds a term of combinatory logic, a programming language with no variables at all. Everything is built from a few combinators applied to each other. The list below the field is the reduction trace: each line is the previous one with exactly one rule applied, until no rule fits any more or the step limit is reached. The default example starts from nothing but the single combinator ι and, nine steps later, ends at K. That is the point of Iota: one symbol is enough to express every computable function.",
    sections: [
      {
        heading: "Four rewrite rules",
        paragraphs: [
          "Combinatory logic goes back to the 1920s, to Moses Schönfinkel and later Haskell Curry. It has three basic combinators. I returns its argument. K takes two arguments and keeps the first, throwing the second away. S takes three arguments and distributes the third over the first two. S and K alone are already Turing complete, and I is a convenience, because S K K behaves exactly like I.",
          "Iota, a language proposed by Chris Barker, goes one step further and uses a single combinator ι defined by ι x = x S K. Applied to itself it gives ι ι = S K (K K), which acts as the identity. Nest it deeper and K and S fall out, so anything written with S and K can be rewritten with ι alone. The rules the reducer uses are exactly the four in the sidebar:",
        ],
        formula: REDUCTION_RULES_FORMULA,
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "The expression field accepts S, K, I and ι; a lowercase i is read as ι, so you can type it on any keyboard. Spaces separate terms, and application associates to the left: S K K means (S K) K. Parentheses group the other way. There are no variables, so arguments are themselves combinators. A typo such as an unknown letter or a missing closing parenthesis shows a parser error below the field instead of a trace.",
          "The six examples load ready-made terms: I (S K) for the I rule, ι (ι (ι ι)) and ι (ι (ι (ι ι))) which rebuild K and S, S K K I and S K K (S K K) showing that S K K is the identity in disguise, and S I I (S K), which applies S K to itself. The step limit slider goes from 5 to 200, starting at 40. The badge in the corner says «normal form» when no rule applies any more and «ran out of steps» when the limit stopped the trace first.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "Every term is a binary tree. A leaf is one of the symbols S, K, I or ι, and an inner node is an application of a function to an argument. A small recursive descent parser turns the text into that tree, folding juxtaposition into left nested applications. The printer turns it back into text, adding parentheses only around an argument that is itself an application.",
          "Each step calls reduceOnce, which looks at the root first. If the root matches one of the four rules, that rule fires. Otherwise it recurses into the function side and only then into the argument. This is leftmost outermost reduction, also called normal order. The trace loop repeats until reduceOnce returns null (a normal form) or the step limit is reached. Everything is recomputed whenever you edit the text or move the slider; there is no animation, so nothing changes under reduced motion.",
          "Terms are copied, not shared. When S duplicates its third argument z, the tree really contains two copies of z, which is why some traces grow wider with every line.",
        ],
        code: REDUCE_EXCERPT,
      },
      {
        heading: "Why the order of reduction matters",
        paragraphs: [
          "Some terms never reach a normal form. The classic one is S I I (S I I): S I I x reduces to x x, so the term keeps reproducing itself and, without sharing, grows on every pass. Now put it inside K I (S I I (S I I)). A strategy that evaluates arguments first would get stuck in the infinite part forever. Normal order looks at the outermost K first, sees that its second argument will be discarded, and finishes in one step with I. For combinatory logic this is a theorem, not luck: if a term has a normal form at all, leftmost outermost reduction finds it.",
        ],
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "Rebuild K and S from ι",
        text: "Load «Recover K from ι» and read the nine steps down to K. Then load «Recover S from ι»: one more ι, eleven steps, and the result is S. Since S and K suffice for everything, so does ι.",
      },
      {
        title: "Find the hidden identity",
        text: "Type ι ι. Three steps later you get S K (K K). Now type S K (K K) S and see it return S after two more steps. Any term of the form S K y acts like I, whatever y is.",
      },
      {
        title: "Watch a term that never stops",
        text: "Type S I I (S I I) and raise the step limit to 200. The badge stays on «ran out of steps» and the lines get longer and longer, because every copy of S I I is stored separately.",
      },
      {
        title: "Let laziness win",
        text: "Type K I (S I I (S I I)). Even with the endless term inside, the trace ends after a single step with I, because K throws its second argument away before anyone looks at it.",
      },
    ],
  },
  de: {
    metaDescription:
      "Ein SKI- und Iota-Kombinator-Reduzierer im Browser: Term eingeben, Schritt für Schritt umschreiben lassen und K und S allein aus dem Kombinator ι gewinnen.",
    heading: "So funktioniert dieser Reduzierer",
    intro:
      "Im Textfeld steht ein Term der kombinatorischen Logik, einer Programmiersprache ganz ohne Variablen. Alles entsteht aus ein paar Kombinatoren, die aufeinander angewendet werden. Die Liste darunter ist die Reduktionsspur: Jede Zeile ist die vorige mit genau einer angewendeten Regel, bis keine Regel mehr passt oder das Schrittlimit erreicht ist. Das Standardbeispiel besteht nur aus dem Kombinator ι und landet nach neun Schritten bei K. Genau darum geht es bei Iota: Ein einziges Symbol reicht, um jede berechenbare Funktion auszudrücken.",
    sections: [
      {
        heading: "Vier Umschreiberegeln",
        paragraphs: [
          "Die kombinatorische Logik geht auf die 1920er Jahre zurück, auf Moses Schönfinkel und später Haskell Curry. Sie hat drei Grundkombinatoren. I gibt sein Argument zurück. K nimmt zwei Argumente, behält das erste und wirft das zweite weg. S nimmt drei Argumente und verteilt das dritte auf die ersten beiden. S und K allein sind schon Turing-vollständig, I ist nur Bequemlichkeit, denn S K K verhält sich genau wie I.",
          "Iota, eine von Chris Barker vorgeschlagene Sprache, geht noch einen Schritt weiter und kommt mit einem einzigen Kombinator ι aus, definiert durch ι x = x S K. Auf sich selbst angewendet ergibt sich ι ι = S K (K K), und das wirkt wie die Identität. Verschachtelst du tiefer, fallen K und S heraus, also lässt sich alles, was mit S und K geschrieben ist, auch nur mit ι schreiben. Der Reduzierer verwendet genau die vier Regeln aus der Seitenleiste:",
        ],
        formula: REDUCTION_RULES_FORMULA,
      },
      {
        heading: "Was die Bedienelemente tun",
        paragraphs: [
          "Das Ausdrucksfeld nimmt S, K, I und ι an; ein kleines i wird als ι gelesen, damit du es auf jeder Tastatur tippen kannst. Leerzeichen trennen Terme, und Anwendung ist linksassoziativ: S K K bedeutet (S K) K. Klammern gruppieren anders herum. Variablen gibt es nicht, Argumente sind also selbst Kombinatoren. Ein Tippfehler, etwa ein unbekannter Buchstabe oder eine fehlende schließende Klammer, zeigt unter dem Feld eine Fehlermeldung des Parsers statt einer Spur.",
          "Die sechs Beispiele laden fertige Terme: I (S K) für die I-Regel, ι (ι (ι ι)) und ι (ι (ι (ι ι))), die K und S zurückgewinnen, S K K I und S K K (S K K), die zeigen, dass S K K eine verkleidete Identität ist, und S I I (S K), das S K auf sich selbst anwendet. Der Regler für das Schrittlimit reicht von 5 bis 200 und startet bei 40. Das Abzeichen in der Ecke zeigt «Normalform», wenn keine Regel mehr greift, und «keine Schritte mehr», wenn das Limit die Spur vorher gestoppt hat.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Jeder Term ist ein Binärbaum. Ein Blatt ist eines der Symbole S, K, I oder ι, ein innerer Knoten die Anwendung einer Funktion auf ein Argument. Ein kleiner rekursiver Abstiegsparser macht aus dem Text diesen Baum und faltet nebeneinanderstehende Terme zu links verschachtelten Anwendungen. Die Ausgabe macht daraus wieder Text und setzt Klammern nur um ein Argument, das selbst eine Anwendung ist.",
          "Jeder Schritt ruft reduceOnce auf, das zuerst die Wurzel ansieht. Passt die Wurzel zu einer der vier Regeln, feuert diese. Sonst steigt die Funktion rekursiv in die Funktionsseite ab und erst danach ins Argument. Das ist Linksaußen-Reduktion, auch Normalordnung genannt. Die Schleife läuft, bis reduceOnce null liefert (eine Normalform) oder das Schrittlimit erreicht ist. Bei jeder Änderung am Text oder am Regler wird alles neu berechnet; es gibt keine Animation, bei reduzierter Bewegung ändert sich also nichts.",
          "Terme werden kopiert, nicht geteilt. Wenn S sein drittes Argument z verdoppelt, enthält der Baum wirklich zwei Kopien von z. Deshalb werden manche Spuren mit jeder Zeile breiter.",
        ],
        code: REDUCE_EXCERPT,
      },
      {
        heading: "Warum die Reihenfolge zählt",
        paragraphs: [
          "Manche Terme erreichen nie eine Normalform. Das klassische Beispiel ist S I I (S I I): S I I x wird zu x x, der Term reproduziert sich also ständig und wächst ohne Teilen bei jedem Durchgang. Steck ihn jetzt in K I (S I I (S I I)). Eine Strategie, die zuerst die Argumente auswertet, bliebe für immer im unendlichen Teil hängen. Die Normalordnung sieht zuerst das äußere K, merkt, dass das zweite Argument ohnehin weggeworfen wird, und ist nach einem Schritt mit I fertig. In der kombinatorischen Logik ist das kein Glück, sondern ein Satz: Wenn ein Term überhaupt eine Normalform hat, findet die Linksaußen-Reduktion sie.",
        ],
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "K und S aus ι zurückgewinnen",
        text: "Lade «Recover K from ι» und lies die neun Schritte bis K. Dann «Recover S from ι»: ein ι mehr, elf Schritte, und heraus kommt S. Weil S und K für alles reichen, reicht auch ι.",
      },
      {
        title: "Die versteckte Identität finden",
        text: "Tippe ι ι. Drei Schritte später steht da S K (K K). Tippe jetzt S K (K K) S und sieh zu, wie nach zwei weiteren Schritten S herauskommt. Jeder Term der Form S K y wirkt wie I, egal was y ist.",
      },
      {
        title: "Ein Term, der nie aufhört",
        text: "Tippe S I I (S I I) und schieb das Schrittlimit auf 200. Das Abzeichen bleibt bei «keine Schritte mehr», und die Zeilen werden immer länger, weil jede Kopie von S I I einzeln gespeichert wird.",
      },
      {
        title: "Faulheit gewinnt",
        text: "Tippe K I (S I I (S I I)). Obwohl der endlose Term darin steckt, endet die Spur nach einem einzigen Schritt mit I, weil K sein zweites Argument wegwirft, bevor es jemand ansieht.",
      },
    ],
  },
  es: {
    metaDescription:
      "Un reductor de combinadores SKI e Iota en tu navegador: escribe un término, míralo reescribirse paso a paso y reconstruye K y S solo con el combinador ι.",
    heading: "Cómo funciona este reductor",
    intro:
      "El campo de texto contiene un término de la lógica combinatoria, un lenguaje de programación sin ninguna variable. Todo se construye a partir de unos pocos combinadores aplicados unos a otros. La lista bajo el campo es la traza de reducción: cada línea es la anterior con exactamente una regla aplicada, hasta que ya no encaja ninguna regla o se alcanza el límite de pasos. El ejemplo por defecto parte únicamente del combinador ι y, nueve pasos después, termina en K. Esa es la gracia de Iota: un solo símbolo basta para expresar toda función computable.",
    sections: [
      {
        heading: "Cuatro reglas de reescritura",
        paragraphs: [
          "La lógica combinatoria se remonta a los años veinte del siglo pasado, a Moses Schönfinkel y más tarde a Haskell Curry. Tiene tres combinadores básicos. I devuelve su argumento. K toma dos argumentos y se queda con el primero, desechando el segundo. S toma tres argumentos y distribuye el tercero sobre los dos primeros. S y K por sí solos ya son Turing completos, e I es una comodidad, porque S K K se comporta exactamente igual que I.",
          "Iota, un lenguaje propuesto por Chris Barker, va un paso más allá y usa un único combinador ι definido por ι x = x S K. Aplicado a sí mismo da ι ι = S K (K K), que actúa como la identidad. Si lo anidas más, aparecen K y S, de modo que cualquier cosa escrita con S y K puede reescribirse solo con ι. Las reglas que usa el reductor son exactamente las cuatro de la barra lateral:",
        ],
        formula: REDUCTION_RULES_FORMULA,
      },
      {
        heading: "Qué hacen los controles",
        paragraphs: [
          "El campo de expresión acepta S, K, I y ι; una i minúscula se lee como ι, así que puedes escribirla con cualquier teclado. Los espacios separan los términos, y la aplicación asocia por la izquierda: S K K significa (S K) K. Los paréntesis agrupan en el otro sentido. No hay variables, de modo que los argumentos son a su vez combinadores. Una errata, como una letra desconocida o un paréntesis de cierre que falta, muestra un error del analizador bajo el campo en lugar de una traza.",
          "Los seis ejemplos cargan términos ya preparados: I (S K) para la regla de I, ι (ι (ι ι)) e ι (ι (ι (ι ι))), que reconstruyen K y S, S K K I y S K K (S K K), que muestran que S K K es la identidad disfrazada, y S I I (S K), que aplica S K a sí mismo. El deslizador «Límite de pasos» va de 5 a 200 y empieza en 40. La etiqueta de la esquina dice «forma normal» cuando ya no se aplica ninguna regla y «sin más pasos» cuando el límite ha detenido antes la traza.",
        ],
      },
      {
        heading: "Cómo está construido",
        paragraphs: [
          "Cada término es un árbol binario. Una hoja es uno de los símbolos S, K, I o ι, y un nodo interno es la aplicación de una función a un argumento. Un pequeño analizador descendente recursivo convierte el texto en ese árbol, plegando la yuxtaposición en aplicaciones anidadas por la izquierda. La función de impresión lo vuelve a convertir en texto y solo añade paréntesis alrededor de un argumento que es a su vez una aplicación.",
          "Cada paso llama a reduceOnce, que mira primero la raíz. Si la raíz coincide con una de las cuatro reglas, esa regla se dispara. Si no, desciende recursivamente por el lado de la función y solo después por el argumento. Esto es la reducción más externa por la izquierda, también llamada orden normal. El bucle de la traza se repite hasta que reduceOnce devuelve null (una forma normal) o se alcanza el límite de pasos. Todo se recalcula cada vez que editas el texto o mueves el deslizador; no hay animación, así que nada cambia con el movimiento reducido.",
          "Los términos se copian, no se comparten. Cuando S duplica su tercer argumento z, el árbol contiene de verdad dos copias de z, y por eso algunas trazas se ensanchan con cada línea.",
        ],
        code: REDUCE_EXCERPT,
      },
      {
        heading: "Por qué importa el orden de reducción",
        paragraphs: [
          "Algunos términos nunca alcanzan una forma normal. El clásico es S I I (S I I): S I I x se reduce a x x, así que el término no deja de reproducirse y, al no compartir nada, crece en cada pasada. Ahora mételo dentro de K I (S I I (S I I)). Una estrategia que evaluara primero los argumentos se quedaría atascada para siempre en la parte infinita. El orden normal mira primero la K más externa, ve que su segundo argumento va a descartarse y termina en un solo paso con I. Para la lógica combinatoria esto es un teorema, no una casualidad: si un término tiene forma normal, la reducción más externa por la izquierda la encuentra.",
        ],
      },
    ],
    experimentsHeading: "Prueba esto",
    experiments: [
      {
        title: "Reconstruye K y S a partir de ι",
        text: "Carga «Recover K from ι» y lee los nueve pasos hasta llegar a K. Después carga «Recover S from ι»: un ι más, once pasos, y el resultado es S. Como S y K bastan para todo, ι también.",
      },
      {
        title: "Encuentra la identidad escondida",
        text: "Escribe ι ι. Tres pasos después obtienes S K (K K). Ahora escribe S K (K K) S y verás que devuelve S tras dos pasos más. Cualquier término de la forma S K y actúa como I, sea cual sea y.",
      },
      {
        title: "Observa un término que nunca para",
        text: "Escribe S I I (S I I) y sube el límite de pasos a 200. La etiqueta se queda en «sin más pasos» y las líneas se hacen cada vez más largas, porque cada copia de S I I se guarda por separado.",
      },
      {
        title: "Deja que gane la pereza",
        text: "Escribe K I (S I I (S I I)). Incluso con el término interminable dentro, la traza acaba tras un único paso con I, porque K desecha su segundo argumento antes de que nadie lo mire.",
      },
    ],
  },
  fr: {
    metaDescription:
      "Un réducteur de combinateurs SKI et Iota dans ton navigateur : saisis un terme, regarde-le se réécrire pas à pas et reconstruis K et S avec le seul ι.",
    heading: "Comment fonctionne ce réducteur",
    intro:
      "Le champ de texte contient un terme de logique combinatoire, un langage de programmation sans la moindre variable. Tout est construit à partir de quelques combinateurs appliqués les uns aux autres. La liste sous le champ est la trace de réduction : chaque ligne est la précédente à laquelle on a appliqué exactement une règle, jusqu'à ce que plus aucune règle ne convienne ou que la limite d'étapes soit atteinte. L'exemple par défaut part du seul combinateur ι et, neuf étapes plus tard, aboutit à K. C'est tout l'intérêt d'Iota : un unique symbole suffit pour exprimer toute fonction calculable.",
    sections: [
      {
        heading: "Quatre règles de réécriture",
        paragraphs: [
          "La logique combinatoire remonte aux années 1920, à Moses Schönfinkel puis à Haskell Curry. Elle possède trois combinateurs de base. I renvoie son argument. K prend deux arguments et garde le premier en jetant le second. S prend trois arguments et distribue le troisième sur les deux premiers. S et K à eux seuls sont déjà Turing-complets, et I n'est qu'une commodité, puisque S K K se comporte exactement comme I.",
          "Iota, un langage proposé par Chris Barker, va un cran plus loin et utilise un unique combinateur ι défini par ι x = x S K. Appliqué à lui-même, il donne ι ι = S K (K K), qui agit comme l'identité. Imbrique-le davantage et K et S en sortent, de sorte que tout ce qui s'écrit avec S et K peut se réécrire avec ι seul. Les règles qu'utilise le réducteur sont exactement les quatre de la barre latérale :",
        ],
        formula: REDUCTION_RULES_FORMULA,
      },
      {
        heading: "À quoi servent les commandes",
        paragraphs: [
          "Le champ d'expression accepte S, K, I et ι ; un i minuscule est lu comme ι, tu peux donc le taper sur n'importe quel clavier. Les espaces séparent les termes, et l'application associe à gauche : S K K signifie (S K) K. Les parenthèses regroupent dans l'autre sens. Il n'y a pas de variables, les arguments sont donc eux-mêmes des combinateurs. Une faute de frappe, comme une lettre inconnue ou une parenthèse fermante manquante, affiche une erreur d'analyse sous le champ à la place d'une trace.",
          "Les six exemples chargent des termes tout prêts : I (S K) pour la règle de I, ι (ι (ι ι)) et ι (ι (ι (ι ι))) qui reconstruisent K et S, S K K I et S K K (S K K) qui montrent que S K K est l'identité déguisée, et S I I (S K), qui applique S K à lui-même. Le curseur « Limite d'étapes » va de 5 à 200 et démarre à 40. Le badge dans le coin indique « forme normale » quand plus aucune règle ne s'applique et « plus d'étapes » quand la limite a arrêté la trace avant.",
        ],
      },
      {
        heading: "Comment c'est construit",
        paragraphs: [
          "Chaque terme est un arbre binaire. Une feuille est l'un des symboles S, K, I ou ι, et un nœud interne est l'application d'une fonction à un argument. Un petit analyseur par descente récursive transforme le texte en cet arbre, en repliant la juxtaposition en applications imbriquées à gauche. La fonction d'affichage le retransforme en texte et n'ajoute des parenthèses qu'autour d'un argument qui est lui-même une application.",
          "Chaque étape appelle reduceOnce, qui regarde d'abord la racine. Si la racine correspond à l'une des quatre règles, cette règle se déclenche. Sinon, la fonction descend récursivement du côté de la fonction, et seulement ensuite dans l'argument. C'est la réduction la plus externe à gauche, aussi appelée ordre normal. La boucle de trace se répète jusqu'à ce que reduceOnce renvoie null (une forme normale) ou que la limite d'étapes soit atteinte. Tout est recalculé chaque fois que tu modifies le texte ou déplaces le curseur ; il n'y a pas d'animation, donc rien ne change avec la réduction des animations.",
          "Les termes sont copiés, pas partagés. Quand S duplique son troisième argument z, l'arbre contient réellement deux copies de z, et c'est pourquoi certaines traces s'élargissent à chaque ligne.",
        ],
        code: REDUCE_EXCERPT,
      },
      {
        heading: "Pourquoi l'ordre de réduction compte",
        paragraphs: [
          "Certains termes n'atteignent jamais de forme normale. Le grand classique est S I I (S I I) : S I I x se réduit en x x, le terme ne cesse donc de se reproduire et, faute de partage, grossit à chaque passage. Place-le maintenant à l'intérieur de K I (S I I (S I I)). Une stratégie qui évaluerait d'abord les arguments resterait coincée pour toujours dans la partie infinie. L'ordre normal regarde d'abord le K le plus externe, voit que son second argument sera jeté et termine en une étape avec I. Pour la logique combinatoire, c'est un théorème et non un coup de chance : si un terme possède une forme normale, la réduction la plus externe à gauche la trouve.",
        ],
      },
    ],
    experimentsHeading: "À essayer",
    experiments: [
      {
        title: "Reconstruis K et S à partir de ι",
        text: "Charge « Recover K from ι » et lis les neuf étapes jusqu'à K. Charge ensuite « Recover S from ι » : un ι de plus, onze étapes, et le résultat est S. Puisque S et K suffisent à tout, ι aussi.",
      },
      {
        title: "Trouve l'identité cachée",
        text: "Tape ι ι. Trois étapes plus tard, tu obtiens S K (K K). Tape maintenant S K (K K) S et regarde-le renvoyer S après deux étapes de plus. Tout terme de la forme S K y agit comme I, quel que soit y.",
      },
      {
        title: "Observe un terme qui ne s'arrête jamais",
        text: "Tape S I I (S I I) et monte la limite d'étapes à 200. Le badge reste sur « plus d'étapes » et les lignes s'allongent encore et encore, parce que chaque copie de S I I est stockée séparément.",
      },
      {
        title: "Laisse la paresse gagner",
        text: "Tape K I (S I I (S I I)). Même avec le terme sans fin à l'intérieur, la trace se termine après une seule étape sur I, parce que K jette son second argument avant que quiconque ne le regarde.",
      },
    ],
  },
  it: {
    metaDescription:
      "Un riduttore di combinatori SKI e Iota nel tuo browser: scrivi un termine, guardalo riscriversi passo dopo passo e ricostruisci K e S con il solo ι.",
    heading: "Come funziona questo riduttore",
    intro:
      "Il campo di testo contiene un termine della logica combinatoria, un linguaggio di programmazione del tutto privo di variabili. Tutto è costruito a partire da pochi combinatori applicati l'uno all'altro. L'elenco sotto il campo è la traccia di riduzione: ogni riga è la precedente con esattamente una regola applicata, finché nessuna regola è più applicabile o si raggiunge il limite di passi. L'esempio predefinito parte dal solo combinatore ι e, nove passi dopo, arriva a K. È questo il senso di Iota: un unico simbolo basta per esprimere ogni funzione calcolabile.",
    sections: [
      {
        heading: "Quattro regole di riscrittura",
        paragraphs: [
          "La logica combinatoria risale agli anni Venti del Novecento, a Moses Schönfinkel e poi a Haskell Curry. Ha tre combinatori di base. I restituisce il proprio argomento. K prende due argomenti e tiene il primo, buttando via il secondo. S prende tre argomenti e distribuisce il terzo sui primi due. S e K da soli sono già Turing-completi, e I è una comodità, perché S K K si comporta esattamente come I.",
          "Iota, un linguaggio proposto da Chris Barker, fa un passo in più e usa un unico combinatore ι definito da ι x = x S K. Applicato a sé stesso dà ι ι = S K (K K), che agisce come l'identità. Annidalo più in profondità e ne escono K e S, quindi tutto ciò che si scrive con S e K si può riscrivere con il solo ι. Le regole usate dal riduttore sono esattamente le quattro della barra laterale:",
        ],
        formula: REDUCTION_RULES_FORMULA,
      },
      {
        heading: "Che cosa fanno i controlli",
        paragraphs: [
          "Il campo dell'espressione accetta S, K, I e ι; una i minuscola viene letta come ι, così puoi digitarla con qualsiasi tastiera. Gli spazi separano i termini, e l'applicazione associa a sinistra: S K K significa (S K) K. Le parentesi raggruppano nell'altro verso. Non ci sono variabili, quindi gli argomenti sono a loro volta combinatori. Un refuso, come una lettera sconosciuta o una parentesi di chiusura mancante, mostra un errore del parser sotto il campo al posto della traccia.",
          "I sei esempi caricano termini già pronti: I (S K) per la regola di I, ι (ι (ι ι)) e ι (ι (ι (ι ι))) che ricostruiscono K e S, S K K I e S K K (S K K) che mostrano come S K K sia l'identità travestita, e S I I (S K), che applica S K a sé stesso. Il cursore «Limite di passi» va da 5 a 200 e parte da 40. L'etichetta nell'angolo dice «forma normale» quando nessuna regola è più applicabile e «passi esauriti» quando il limite ha fermato prima la traccia.",
        ],
      },
      {
        heading: "Com'è costruito",
        paragraphs: [
          "Ogni termine è un albero binario. Una foglia è uno dei simboli S, K, I o ι, e un nodo interno è l'applicazione di una funzione a un argomento. Un piccolo parser a discesa ricorsiva trasforma il testo in quell'albero, ripiegando la giustapposizione in applicazioni annidate a sinistra. La funzione di stampa lo ritrasforma in testo, aggiungendo parentesi solo attorno a un argomento che è a sua volta un'applicazione.",
          "Ogni passo chiama reduceOnce, che guarda prima la radice. Se la radice corrisponde a una delle quattro regole, scatta quella regola. Altrimenti scende ricorsivamente nel lato della funzione e solo dopo nell'argomento. È la riduzione più esterna a sinistra, detta anche ordine normale. Il ciclo della traccia si ripete finché reduceOnce restituisce null (una forma normale) o si raggiunge il limite di passi. Tutto viene ricalcolato ogni volta che modifichi il testo o sposti il cursore; non c'è animazione, quindi con il movimento ridotto non cambia nulla.",
          "I termini vengono copiati, non condivisi. Quando S duplica il suo terzo argomento z, l'albero contiene davvero due copie di z, ed è per questo che alcune tracce si allargano a ogni riga.",
        ],
        code: REDUCE_EXCERPT,
      },
      {
        heading: "Perché l'ordine di riduzione conta",
        paragraphs: [
          "Alcuni termini non raggiungono mai una forma normale. Quello classico è S I I (S I I): S I I x si riduce a x x, quindi il termine continua a riprodursi e, senza condivisione, cresce a ogni passata. Ora mettilo dentro K I (S I I (S I I)). Una strategia che valutasse prima gli argomenti resterebbe bloccata per sempre nella parte infinita. L'ordine normale guarda prima la K più esterna, vede che il suo secondo argomento verrà scartato e conclude in un passo con I. Per la logica combinatoria questo è un teorema, non fortuna: se un termine ha una forma normale, la riduzione più esterna a sinistra la trova.",
        ],
      },
    ],
    experimentsHeading: "Prova così",
    experiments: [
      {
        title: "Ricostruisci K e S a partire da ι",
        text: "Carica «Recover K from ι» e leggi i nove passi fino a K. Poi carica «Recover S from ι»: un ι in più, undici passi, e il risultato è S. Dato che S e K bastano per tutto, basta anche ι.",
      },
      {
        title: "Trova l'identità nascosta",
        text: "Scrivi ι ι. Tre passi dopo ottieni S K (K K). Ora scrivi S K (K K) S e guardalo restituire S dopo altri due passi. Qualsiasi termine della forma S K y agisce come I, qualunque sia y.",
      },
      {
        title: "Osserva un termine che non si ferma mai",
        text: "Scrivi S I I (S I I) e alza il limite di passi a 200. L'etichetta resta su «passi esauriti» e le righe diventano sempre più lunghe, perché ogni copia di S I I è memorizzata separatamente.",
      },
      {
        title: "Lascia vincere la pigrizia",
        text: "Scrivi K I (S I I (S I I)). Anche con il termine senza fine al suo interno, la traccia termina dopo un solo passo con I, perché K butta via il suo secondo argomento prima che qualcuno lo guardi.",
      },
    ],
  },
  pt: {
    metaDescription:
      "Um redutor de combinadores SKI e Iota no teu navegador: escreve um termo, vê-o reescrever-se passo a passo e reconstrói K e S apenas com o combinador ι.",
    heading: "Como funciona este redutor",
    intro:
      "O campo de texto contém um termo da lógica combinatória, uma linguagem de programação sem qualquer variável. Tudo é construído a partir de uns poucos combinadores aplicados uns aos outros. A lista por baixo do campo é o traço de redução: cada linha é a anterior com exatamente uma regra aplicada, até já não servir nenhuma regra ou até se atingir o limite de passos. O exemplo por omissão parte apenas do combinador ι e, nove passos depois, termina em K. É esse o interesse do Iota: um único símbolo chega para exprimir toda a função computável.",
    sections: [
      {
        heading: "Quatro regras de reescrita",
        paragraphs: [
          "A lógica combinatória remonta aos anos 1920, a Moses Schönfinkel e mais tarde a Haskell Curry. Tem três combinadores básicos. I devolve o seu argumento. K recebe dois argumentos e fica com o primeiro, deitando fora o segundo. S recebe três argumentos e distribui o terceiro pelos dois primeiros. S e K sozinhos já são Turing-completos, e I é uma comodidade, porque S K K se comporta exatamente como I.",
          "Iota, uma linguagem proposta por Chris Barker, vai um passo mais longe e usa um único combinador ι definido por ι x = x S K. Aplicado a si próprio dá ι ι = S K (K K), que atua como a identidade. Se o aninhares mais fundo, saem K e S, pelo que tudo o que se escreve com S e K pode ser reescrito só com ι. As regras que o redutor usa são exatamente as quatro da barra lateral:",
        ],
        formula: REDUCTION_RULES_FORMULA,
      },
      {
        heading: "O que fazem os controlos",
        paragraphs: [
          "O campo da expressão aceita S, K, I e ι; um i minúsculo é lido como ι, por isso podes escrevê-lo em qualquer teclado. Os espaços separam os termos, e a aplicação associa à esquerda: S K K significa (S K) K. Os parênteses agrupam no outro sentido. Não há variáveis, pelo que os argumentos são eles próprios combinadores. Uma gralha, como uma letra desconhecida ou um parêntese de fecho em falta, mostra um erro do analisador por baixo do campo em vez de um traço.",
          "Os seis exemplos carregam termos já prontos: I (S K) para a regra de I, ι (ι (ι ι)) e ι (ι (ι (ι ι))), que reconstroem K e S, S K K I e S K K (S K K), que mostram que S K K é a identidade disfarçada, e S I I (S K), que aplica S K a si próprio. O cursor «Limite de passos» vai de 5 a 200 e começa em 40. A etiqueta no canto diz «forma normal» quando já não se aplica nenhuma regra e «sem mais passos» quando o limite parou o traço primeiro.",
        ],
      },
      {
        heading: "Como está construído",
        paragraphs: [
          "Cada termo é uma árvore binária. Uma folha é um dos símbolos S, K, I ou ι, e um nó interno é a aplicação de uma função a um argumento. Um pequeno analisador descendente recursivo transforma o texto nessa árvore, dobrando a justaposição em aplicações aninhadas à esquerda. A função de impressão volta a transformá-la em texto, acrescentando parênteses apenas à volta de um argumento que seja ele próprio uma aplicação.",
          "Cada passo chama reduceOnce, que olha primeiro para a raiz. Se a raiz corresponder a uma das quatro regras, essa regra dispara. Caso contrário, desce recursivamente pelo lado da função e só depois pelo argumento. Esta é a redução mais externa à esquerda, também chamada ordem normal. O ciclo do traço repete-se até reduceOnce devolver null (uma forma normal) ou até se atingir o limite de passos. Tudo é recalculado sempre que editas o texto ou moves o cursor; não há animação, por isso nada muda com o movimento reduzido.",
          "Os termos são copiados, não partilhados. Quando S duplica o seu terceiro argumento z, a árvore contém mesmo duas cópias de z, e é por isso que alguns traços ficam mais largos a cada linha.",
        ],
        code: REDUCE_EXCERPT,
      },
      {
        heading: "Porque é que a ordem de redução importa",
        paragraphs: [
          "Alguns termos nunca chegam a uma forma normal. O clássico é S I I (S I I): S I I x reduz-se a x x, pelo que o termo não para de se reproduzir e, sem partilha, cresce a cada passagem. Agora mete-o dentro de K I (S I I (S I I)). Uma estratégia que avaliasse primeiro os argumentos ficaria presa para sempre na parte infinita. A ordem normal olha primeiro para o K mais externo, vê que o seu segundo argumento vai ser descartado e termina num só passo com I. Para a lógica combinatória isto é um teorema, não sorte: se um termo tem forma normal, a redução mais externa à esquerda encontra-a.",
        ],
      },
    ],
    experimentsHeading: "Experimenta isto",
    experiments: [
      {
        title: "Reconstrói K e S a partir de ι",
        text: "Carrega «Recover K from ι» e lê os nove passos até K. Depois carrega «Recover S from ι»: mais um ι, onze passos, e o resultado é S. Como S e K chegam para tudo, ι também chega.",
      },
      {
        title: "Encontra a identidade escondida",
        text: "Escreve ι ι. Três passos depois obténs S K (K K). Agora escreve S K (K K) S e vê-o devolver S ao fim de mais dois passos. Qualquer termo da forma S K y atua como I, seja qual for y.",
      },
      {
        title: "Observa um termo que nunca para",
        text: "Escreve S I I (S I I) e sobe o limite de passos para 200. A etiqueta fica em «sem mais passos» e as linhas ficam cada vez mais compridas, porque cada cópia de S I I é guardada em separado.",
      },
      {
        title: "Deixa a preguiça ganhar",
        text: "Escreve K I (S I I (S I I)). Mesmo com o termo interminável lá dentro, o traço acaba ao fim de um único passo com I, porque K deita fora o seu segundo argumento antes de alguém olhar para ele.",
      },
    ],
  },
  sv: {
    metaDescription:
      "En reducerare för SKI- och Iota-kombinatorer i webbläsaren: skriv en term, se den skrivas om steg för steg och bygg K och S av enbart kombinatorn ι.",
    heading: "Så fungerar den här reduceraren",
    intro:
      "Textfältet innehåller en term i kombinatorisk logik, ett programspråk helt utan variabler. Allt byggs av några få kombinatorer som appliceras på varandra. Listan under fältet är reduktionsspåret: varje rad är den föregående med exakt en regel tillämpad, tills ingen regel passar längre eller steggränsen nås. Standardexemplet börjar med ingenting annat än den enda kombinatorn ι och slutar nio steg senare i K. Det är poängen med Iota: en enda symbol räcker för att uttrycka varje beräkningsbar funktion.",
    sections: [
      {
        heading: "Fyra omskrivningsregler",
        paragraphs: [
          "Kombinatorisk logik går tillbaka till 1920-talet, till Moses Schönfinkel och senare Haskell Curry. Den har tre grundkombinatorer. I returnerar sitt argument. K tar två argument och behåller det första medan det andra kastas bort. S tar tre argument och fördelar det tredje över de två första. Redan S och K ensamma är Turingkompletta, och I är en bekvämlighet, eftersom S K K beter sig precis som I.",
          "Iota, ett språk som föreslogs av Chris Barker, går ett steg längre och använder en enda kombinator ι som definieras av ι x = x S K. Applicerad på sig själv ger den ι ι = S K (K K), som fungerar som identiteten. Nästla den djupare så faller K och S ut, och därmed kan allt som skrivs med S och K skrivas om med enbart ι. Reglerna som reduceraren använder är exakt de fyra i sidofältet:",
        ],
        formula: REDUCTION_RULES_FORMULA,
      },
      {
        heading: "Vad reglagen gör",
        paragraphs: [
          "Uttrycksfältet accepterar S, K, I och ι. Ett gement i läses som ι, så du kan skriva det på vilket tangentbord som helst. Mellanslag skiljer termer åt, och applikation är vänsterassociativ: S K K betyder (S K) K. Parenteser grupperar åt andra hållet. Det finns inga variabler, så argumenten är själva kombinatorer. Ett skrivfel, som en okänd bokstav eller en saknad slutparentes, visar ett parserfel under fältet i stället för ett spår.",
          "De sex exemplen laddar färdiga termer: I (S K) för I-regeln, ι (ι (ι ι)) och ι (ι (ι (ι ι))) som återskapar K och S, S K K I och S K K (S K K) som visar att S K K är identiteten i förklädnad, samt S I I (S K), som applicerar S K på sig självt. Reglaget ”Steggräns” går från 5 till 200 och börjar på 40. Märket i hörnet säger ”normalform” när ingen regel längre går att tillämpa och ”slut på steg” när gränsen stoppade spåret först.",
        ],
      },
      {
        heading: "Hur den är byggd",
        paragraphs: [
          "Varje term är ett binärt träd. Ett löv är en av symbolerna S, K, I eller ι, och en inre nod är en applikation av en funktion på ett argument. En liten parser med rekursiv nedstigning gör om texten till det trädet och viker ihop juxtaposition till vänsternästlade applikationer. Utskriftsfunktionen gör om trädet till text igen och sätter bara parenteser kring ett argument som självt är en applikation.",
          "Varje steg anropar reduceOnce, som först tittar på roten. Om roten matchar en av de fyra reglerna tillämpas den regeln. Annars går funktionen rekursivt in i funktionssidan och först därefter in i argumentet. Det här är reduktion längst till vänster och ytterst, även kallad normalordning. Spårloopen upprepas tills reduceOnce returnerar null (en normalform) eller steggränsen nås. Allt räknas om varje gång du redigerar texten eller flyttar reglaget. Det finns ingen animation, så ingenting ändras vid minskad rörelse.",
          "Termer kopieras, de delas inte. När S duplicerar sitt tredje argument z innehåller trädet verkligen två kopior av z, och därför blir vissa spår bredare för varje rad.",
        ],
        code: REDUCE_EXCERPT,
      },
      {
        heading: "Varför reduktionsordningen spelar roll",
        paragraphs: [
          "Vissa termer når aldrig en normalform. Den klassiska är S I I (S I I): S I I x reduceras till x x, så termen fortsätter att reproducera sig själv och växer, utan delning, för varje varv. Lägg den nu inuti K I (S I I (S I I)). En strategi som evaluerar argumenten först skulle fastna i den oändliga delen för alltid. Normalordning tittar först på det yttersta K, ser att dess andra argument kommer att kastas och blir klar på ett steg med I. För kombinatorisk logik är det här en sats och inte tur: om en term över huvud taget har en normalform, så hittar reduktion längst till vänster och ytterst den.",
        ],
      },
    ],
    experimentsHeading: "Prova det här",
    experiments: [
      {
        title: "Bygg K och S av ι",
        text: "Ladda ”Recover K from ι” och läs de nio stegen ner till K. Ladda sedan ”Recover S from ι”: ett ι till, elva steg, och resultatet är S. Eftersom S och K räcker till allt, gör ι det också.",
      },
      {
        title: "Hitta den dolda identiteten",
        text: "Skriv ι ι. Tre steg senare får du S K (K K). Skriv nu S K (K K) S och se den ge tillbaka S efter två steg till. Varje term av formen S K y fungerar som I, vad y än är.",
      },
      {
        title: "Se en term som aldrig stannar",
        text: "Skriv S I I (S I I) och höj steggränsen till 200. Märket står kvar på ”slut på steg” och raderna blir längre och längre, eftersom varje kopia av S I I lagras separat.",
      },
      {
        title: "Låt latheten vinna",
        text: "Skriv K I (S I I (S I I)). Trots den ändlösa termen inuti slutar spåret efter ett enda steg med I, eftersom K kastar bort sitt andra argument innan någon hinner titta på det.",
      },
    ],
  },
  no: {
    metaDescription:
      "En reduserer for SKI- og Iota-kombinatorer i nettleseren: Skriv en term, se den bli omskrevet steg for steg, og bygg K og S av kombinatoren ι alene.",
    heading: "Slik fungerer denne redusereren",
    intro:
      "Tekstfeltet inneholder en term i kombinatorisk logikk, et programmeringsspråk helt uten variabler. Alt bygges av noen få kombinatorer som anvendes på hverandre. Listen under feltet er reduksjonssporet: Hver linje er den forrige med nøyaktig én regel anvendt, helt til ingen regel passer lenger eller steggrensen er nådd. Standardeksempelet starter med ingenting annet enn den ene kombinatoren ι og ender ni steg senere i K. Det er poenget med Iota: Ett eneste symbol er nok til å uttrykke enhver beregnbar funksjon.",
    sections: [
      {
        heading: "Fire omskrivingsregler",
        paragraphs: [
          "Kombinatorisk logikk går tilbake til 1920-årene, til Moses Schönfinkel og senere Haskell Curry. Den har tre grunnkombinatorer. I returnerer argumentet sitt. K tar to argumenter og beholder det første, mens det andre kastes. S tar tre argumenter og fordeler det tredje over de to første. S og K alene er allerede Turing-komplette, og I er en bekvemmelighet, fordi S K K oppfører seg nøyaktig som I.",
          "Iota, et språk foreslått av Chris Barker, går ett skritt lenger og bruker én eneste kombinator ι, definert ved ι x = x S K. Anvendt på seg selv gir den ι ι = S K (K K), som virker som identiteten. Nøst den dypere, så faller K og S ut, og dermed kan alt som skrives med S og K, skrives om med ι alene. Reglene redusereren bruker, er nøyaktig de fire i sidefeltet:",
        ],
        formula: REDUCTION_RULES_FORMULA,
      },
      {
        heading: "Hva kontrollene gjør",
        paragraphs: [
          "Uttrykksfeltet godtar S, K, I og ι. En liten i leses som ι, så du kan skrive den på et hvilket som helst tastatur. Mellomrom skiller termer, og anvendelse er venstreassosiativ: S K K betyr (S K) K. Parenteser grupperer den andre veien. Det finnes ingen variabler, så argumentene er selv kombinatorer. En skrivefeil, som en ukjent bokstav eller en manglende sluttparentes, viser en parserfeil under feltet i stedet for et spor.",
          "De seks eksemplene laster inn ferdige termer: I (S K) for I-regelen, ι (ι (ι ι)) og ι (ι (ι (ι ι))) som gjenskaper K og S, S K K I og S K K (S K K) som viser at S K K er identiteten i forkledning, og S I I (S K), som anvender S K på seg selv. Glidebryteren «Steggrense» går fra 5 til 200 og starter på 40. Merket i hjørnet sier «normalform» når ingen regel lenger kan anvendes, og «tom for steg» når grensen stoppet sporet først.",
        ],
      },
      {
        heading: "Slik er den bygget",
        paragraphs: [
          "Hver term er et binært tre. Et blad er ett av symbolene S, K, I eller ι, og en indre node er en anvendelse av en funksjon på et argument. En liten rekursivt nedstigende parser gjør teksten om til det treet og bretter sammenstilling om til venstrenøstede anvendelser. Utskriftsfunksjonen gjør treet om til tekst igjen og setter bare parenteser rundt et argument som selv er en anvendelse.",
          "Hvert steg kaller reduceOnce, som først ser på roten. Hvis roten passer med en av de fire reglene, utløses den regelen. Ellers går funksjonen rekursivt inn i funksjonssiden og først deretter inn i argumentet. Dette er reduksjon lengst til venstre og ytterst, også kalt normal orden. Sporløkken gjentas til reduceOnce returnerer null (en normalform) eller steggrensen er nådd. Alt regnes ut på nytt hver gang du redigerer teksten eller flytter glidebryteren. Det finnes ingen animasjon, så ingenting endres ved redusert bevegelse.",
          "Termer kopieres, de deles ikke. Når S dupliserer det tredje argumentet sitt z, inneholder treet virkelig to kopier av z, og derfor blir noen spor bredere for hver linje.",
        ],
        code: REDUCE_EXCERPT,
      },
      {
        heading: "Hvorfor reduksjonsrekkefølgen betyr noe",
        paragraphs: [
          "Noen termer når aldri en normalform. Den klassiske er S I I (S I I): S I I x reduseres til x x, så termen fortsetter å reprodusere seg selv og vokser, uten deling, for hver runde. Legg den nå inni K I (S I I (S I I)). En strategi som evaluerer argumentene først, ville blitt sittende fast i den uendelige delen for alltid. Normal orden ser først på den ytterste K, ser at det andre argumentet kommer til å bli kastet, og er ferdig på ett steg med I. For kombinatorisk logikk er dette et teorem og ikke flaks: Hvis en term i det hele tatt har en normalform, finner reduksjon lengst til venstre og ytterst den.",
        ],
      },
    ],
    experimentsHeading: "Prøv dette",
    experiments: [
      {
        title: "Bygg K og S av ι",
        text: "Last inn «Recover K from ι» og les de ni stegene ned til K. Last så inn «Recover S from ι»: én ι til, elleve steg, og resultatet er S. Siden S og K er nok til alt, er ι det også.",
      },
      {
        title: "Finn den skjulte identiteten",
        text: "Skriv ι ι. Tre steg senere får du S K (K K). Skriv nå S K (K K) S og se at den gir tilbake S etter to steg til. Enhver term på formen S K y virker som I, uansett hva y er.",
      },
      {
        title: "Se en term som aldri stopper",
        text: "Skriv S I I (S I I) og øk steggrensen til 200. Merket blir stående på «tom for steg», og linjene blir lengre og lengre, fordi hver kopi av S I I lagres for seg.",
      },
      {
        title: "La latskapen vinne",
        text: "Skriv K I (S I I (S I I)). Selv med den endeløse termen inni slutter sporet etter ett eneste steg med I, fordi K kaster det andre argumentet sitt før noen rekker å se på det.",
      },
    ],
  },
};
