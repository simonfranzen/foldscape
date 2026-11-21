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
        formula:
          "I\\,x \\to x \\qquad K\\,x\\,y \\to x \\qquad S\\,x\\,y\\,z \\to x\\,z\\,(y\\,z) \\qquad \\iota\\,x \\to x\\,S\\,K",
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
        formula:
          "I\\,x \\to x \\qquad K\\,x\\,y \\to x \\qquad S\\,x\\,y\\,z \\to x\\,z\\,(y\\,z) \\qquad \\iota\\,x \\to x\\,S\\,K",
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
        text: "Lade das Beispiel, das K aus ι gewinnt, und lies die neun Schritte bis K. Dann das für S: ein ι mehr, elf Schritte, und heraus kommt S. Weil S und K für alles reichen, reicht auch ι.",
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
};
