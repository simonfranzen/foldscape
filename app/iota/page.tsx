"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { Reveal } from "@/components/Reveal";
import { StoryCard } from "@/components/StoryPageShell";
import { IotaReducerMini } from "@/components/IotaReducerMini";
import { IotaKSPlayground } from "@/components/IotaKSPlayground";
import type { Locale } from "@/lib/i18n/types";

const ACCENT = "text-signal-cyan";

// --------------------------------------------------------------------------
// Rich, per-locale story content for the Iota page. The base hero
// (pretitle/title/tagline/intro/CTA) still comes from the shared stories.ts;
// everything below the hero is authored inline so the page can tell a long
// story without churning the shared i18n bundles.
// --------------------------------------------------------------------------

type RichStory = {
  encounter: {
    pretitle: string;
    title: string;
    cards: Array<{ label: string; title: string; body: string }>;
    tryIt: string;
  };
  sections: Array<{ pretitle: string; title: string; body: string }>;
  reducerCaption: string;
  reducerPretitle: string;
  reducerTitle: string;
  reducerBody: string;
  ksCaption: string;
  ksPretitle: string;
  ksTitle: string;
  ksBody: string;
  ksLabels: {
    kHeading: string;
    sHeading: string;
    kBody: string;
    sBody: string;
    kResult: string;
    sResult: string;
    inputX: string;
    inputY: string;
    inputZ: string;
  };
  ksDefinitions: {
    kShort: string;
    sShort: string;
  };
  closingPretitle: string;
  closingTitle: string;
  closingBody: string;
  ctaLabel: string;
  // Localized chrome for the inline mini-reducer (IotaReducerMini).
  reducerLabels: {
    customExpression: string;
    stepStatus: string;
    normalForm: string;
    stepLimit: string;
    done: string;
    reducing: string;
    next: string;
    parseError: string;
    reset: string;
    back: string;
    step: string;
    toEnd: string;
    ruleIntro: string;
    ruleThen: string;
    ruleAnd: string;
    ruleOrder: string;
  };
  // Prose/labels for the explainer asides that used to be hardcoded English.
  explainers: {
    everyComputable: string;
    lambdaCaption: string;
    abstraction: string;
    abstractionDesc: string;
    application: string;
    applicationDesc: string;
    combinatorPre: string;
    combinatorEmph: string;
    combinatorPost: string;
    kLabel: string;
    sLabel: string;
    barkerLine1: string;
    barkerLine2: string;
    kCaption: string;
    kAnn: [string, string, string, string, string];
    kNotePre: string;
    kNoteLink: string;
    kNotePost: string;
    sCaption: string;
    sAnn: [string, string, string, string];
    sNotePre: string;
    sNoteLink: string;
    sNotePost: string;
    chainCaption: string;
    chainAnn: [string, string, string, string, string];
    chainNotePre: string;
    chainNoteEmph: string;
  };
};

// --------------------------------------------------------------------------
// English
// --------------------------------------------------------------------------
const en: RichStory = {
  encounter: {
    pretitle: "First encounter",
    title: "One symbol. Every program.",
    cards: [
      {
        label: "01",
        title: "The big idea",
        body: "One tiny symbol — ℩ (iota) — is enough to encode any computer program that has ever been written, or ever could be. Like NAND for hardware, but for computation itself: a single primitive from which the rest is just rearrangement.",
      },
      {
        label: "02",
        title: "A concrete example",
        body: "Iota is defined by one rule: ℩x = xSK, where S and K are the two famous combinators. From a small nest of iotas — ℩(℩(℩℩)) — you can recover K (the constant function). One layer deeper, ℩(℩(℩(℩℩))), you recover S (the substitution function). And once you have S and K, every computable function follows.",
      },
      {
        label: "03",
        title: "Why it matters",
        body: "This is a proof that Turing-completeness can be reached with ONE primitive operation. It threads logic, computer science and the philosophy of mind: can thought itself be reduced to a single symbol?",
      },
    ],
    tryIt: "Below: drive the reducer, watch K and S do their job, and rebuild them from scratch.",
  },
  sections: [
    {
      pretitle: "Section 01 · Background",
      title: "Lambda calculus and closed terms",
      body: "In the 1930s Alonzo Church invented the λ-calculus to study what “computable” really meant. Functions are written as λx.M and applied by substitution. A combinator is a closed λ-term: it has no free variables — everything it needs comes through its arguments. Combinators are pure plumbing. Church and Curry showed that the λ-calculus is exactly as powerful as a Turing machine; combinators give us that power without variables.",
    },
    {
      pretitle: "Section 02 · Schönfinkel, 1924",
      title: "The S and K combinators",
      body: "Moses Schönfinkel, in a 1924 paper that pre-dated Church, found that two combinators are enough. K x y = x throws its second argument away (the constant function). S x y z = x z (y z) takes three arguments, feeds the third to both of the first two, and applies one result to the other (substitution with sharing). These two rewrite rules together can encode every λ-term, every recursive function, every Turing-machine program.",
    },
    {
      pretitle: "Section 03 · Barker, 2001",
      title: "Enter Iota",
      body: "In 2001 the linguist and logician Chris Barker asked: how far can we push this? Schönfinkel needed two combinators. Can one suffice? He defined ℩ ≡ λx. x S K — “apply your argument to S and to K, in that order.” That's the whole language: one symbol, one rule. Parentheses are typography, not extra primitives. And yet, as we'll now see, this single rule contains S and K as derived terms — and therefore everything.",
    },
    {
      pretitle: "Section 04 · Deriving K",
      title: "A small nest of iotas gives K",
      body: "Take ℩(℩(℩℩)). Each outer iota fires the rule ℩x = xSK: the outermost peels off as (℩(℩ι)) S K, then again, and again. After a few S- and K-reductions the dust settles on the bare combinator K. The leftmost-outermost trace runs about nine steps from start to finish — a short chain, all bookkeeping. From four strokes of one symbol, the constant function falls out.",
    },
    {
      pretitle: "Section 05 · Deriving S",
      title: "A deeper nest gives S",
      body: "Now apply iota to a three-deep nest of iotas: ℩(℩(℩(℩℩))). Each outer iota fires the rule ℩x = xSK and pushes another S K onto the spine. After a handful of reduction steps, the leftover terms cancel against one another through S- and K-reductions, and what stays is the bare combinator S. The whole derivation is a few lines of bookkeeping — but the consequence is that S can be expressed in iotas alone.",
    },
    {
      pretitle: "Section 06 · Turing-completeness",
      title: "From one symbol to everything computable",
      body: "Curry and Feys' Combinatory Logic (1958) is a long book whose central theorem is short: every λ-term can be translated into a term built from S and K alone. Combine that with what we just did — iota produces S and iota produces K — and the chain is complete. Anything a Turing machine, a Python program, or a human mathematician can compute, iota can encode. The price is brutal blow-up in length; the payoff is conceptual. Iota stands behind functional programming, type theory, proof assistants, and every implementation of ML-style languages as the ultimate minimal model.",
    },
  ],
  reducerCaption: "Interactive · step-by-step reducer",
  reducerPretitle: "Try it · the reducer",
  reducerTitle: "Watch a derivation unfold",
  reducerBody:
    "Pick a famous derivation (ι (ι (ι ι)) → K, or ι (ι (ι (ι ι))) → S), or type your own expression. Press Step to apply one reduction; the new term replaces the old. The reducer follows leftmost-outermost order — exactly the strategy the textbooks use.",
  ksCaption: "Interactive · K and S playground",
  ksPretitle: "Try it · K and S",
  ksTitle: "Feel what K and S actually do",
  ksBody:
    "Before they get tangled up in iotas, K and S are just plain functions. K throws its second argument away. S applies its first two arguments to a shared third. Type any three values; the panel shows you the symbolic result on the right.",
  ksLabels: {
    kHeading: "K — the constant function",
    sHeading: "S — the substitution function",
    kBody: "Hand K any two values and it keeps the first while dropping the second on the floor.",
    sBody:
      "S takes three arguments and rewrites them as x z (y z): both x and y are applied to the shared input z.",
    kResult: "K (x, y) = x",
    sResult: "S (x, y, z) = x z (y z)",
    inputX: "x",
    inputY: "y",
    inputZ: "z",
  },
  ksDefinitions: {
    kShort: "Drop the second argument; keep the first.",
    sShort: "Feed z to both x and y; apply the results.",
  },
  closingPretitle: "Take it further",
  closingTitle: "Open the Reducer.",
  closingBody:
    "The Reducer lets you type any SKI or iota expression and watch it rewrite, step by step, to its normal form when one exists. The famous derivations are pre-loaded; the rest is yours to discover.",
  ctaLabel: "→ Open the Reducer",
  reducerLabels: {
    customExpression: "custom expression (overrides preset)",
    stepStatus: "step",
    normalForm: "normal form",
    stepLimit: "step limit",
    done: "done",
    reducing: "reducing…",
    next: "next",
    parseError: "parse error",
    reset: "reset",
    back: "back",
    step: "step",
    toEnd: "to end",
    ruleIntro: "Reduction rule applied at each step:",
    ruleThen: "then",
    ruleAnd: "and",
    ruleOrder: "leftmost-outermost",
  },
  explainers: {
    everyComputable: "every computable function",
    lambdaCaption: "λ-calculus · the two moves",
    abstraction: "abstraction",
    abstractionDesc: "a function from x to M",
    application: "application",
    applicationDesc: "apply M to N",
    combinatorPre: "A combinator is a λ-term with ",
    combinatorEmph: "no free variables",
    combinatorPost: ". It carries no context, only structure.",
    kLabel: "K · the constant",
    sLabel: "S · substitution-with-sharing",
    barkerLine1: "One symbol. One rewrite rule:",
    barkerLine2: "The rest of computation falls out as a corollary.",
    kCaption: "ι (ι (ι ι)) · the K derivation",
    kAnn: [
      "outer ι fires, x = ι (ι ι)",
      "and again",
      "and again",
      "now S-reductions take over",
      "only K left",
    ],
    kNotePre: "The exact chain depends on the reduction strategy; the ",
    kNoteLink: "full Reducer",
    kNotePost: " uses leftmost-outermost and lands on K in a small handful of steps.",
    sCaption: "ι (ι (ι (ι ι))) · the S derivation",
    sAnn: [
      "outermost ι fires",
      "repeat on the next layer",
      "several S and K reductions later …",
      "bare combinator S falls out",
    ],
    sNotePre:
      "Five iotas, no other primitives, and S appears. Plug the same expression into the ",
    sNoteLink: "Reducer",
    sNotePost: " and walk every step.",
    chainCaption: "the chain · written out",
    chainAnn: [
      "one symbol, one rule",
      "both derivable from ι",
      "Curry & Feys, 1958",
      "Kleene, 1936",
      "Church-Turing thesis",
    ],
    chainNotePre:
      "The last three arrows are textbook results; the first is Barker's contribution. The composition is the proof that ",
    chainNoteEmph: "ι alone is Turing-complete",
  },
};

// --------------------------------------------------------------------------
// German
// --------------------------------------------------------------------------
const de: RichStory = {
  encounter: {
    pretitle: "Erste Begegnung",
    title: "Ein Symbol. Jedes Programm.",
    cards: [
      {
        label: "01",
        title: "Die große Idee",
        body: "Ein einziges winziges Zeichen — ℩ (Iota) — reicht, um jedes Computerprogramm zu codieren, das je geschrieben wurde oder werden könnte. Wie NAND für die Hardware, nur für die Berechnung selbst: ein einziges Primitiv, alles andere ist Umsortieren.",
      },
      {
        label: "02",
        title: "Ein konkretes Beispiel",
        body: "Iota ist durch eine Regel definiert: ℩x = xSK, wobei S und K die berühmten Kombinatoren sind. Aus einer kleinen Iota-Schachtelung — ℩(℩(℩℩)) — gewinnt man K (die Konstantenfunktion) zurück. Eine Schicht tiefer, ℩(℩(℩(℩℩))), erhält man S (die Substitutionsfunktion). Und mit S und K folgt jede berechenbare Funktion.",
      },
      {
        label: "03",
        title: "Warum es zählt",
        body: "Das ist der Beweis, dass Turing-Vollständigkeit mit EINER einzigen Grundoperation erreichbar ist. Es verbindet Logik, Informatik und Philosophie des Geistes: lässt sich Denken auf ein einziges Symbol reduzieren?",
      },
    ],
    tryIt:
      "Unten: führ den Reduzierer, beobachte K und S bei der Arbeit, und bau sie von Grund auf neu.",
  },
  sections: [
    {
      pretitle: "Abschnitt 01 · Hintergrund",
      title: "Lambda-Kalkül und geschlossene Terme",
      body: "In den 1930ern erfand Alonzo Church den λ-Kalkül, um zu klären, was „berechenbar“ eigentlich heißt. Funktionen schreibt man als λx.M und wendet sie per Substitution an. Ein Kombinator ist ein geschlossener λ-Term: keine freien Variablen — alles, was er braucht, kommt über seine Argumente. Kombinatoren sind reine Verdrahtung. Church und Curry zeigten, dass der λ-Kalkül exakt so mächtig ist wie eine Turing-Maschine; Kombinatoren geben uns diese Mächtigkeit ohne Variablen.",
    },
    {
      pretitle: "Abschnitt 02 · Schönfinkel, 1924",
      title: "Die Kombinatoren S und K",
      body: "Moses Schönfinkel zeigte 1924, noch vor Church, dass zwei Kombinatoren reichen. K x y = x wirft sein zweites Argument weg (die Konstantenfunktion). S x y z = x z (y z) nimmt drei Argumente, gibt das dritte beiden ersten und wendet eines auf das andere an (Substitution mit Teilen). Mit diesen beiden Regeln lässt sich jeder λ-Term, jede rekursive Funktion, jedes Turing-Maschinen-Programm codieren.",
    },
    {
      pretitle: "Abschnitt 03 · Barker, 2001",
      title: "Auftritt Iota",
      body: "2001 fragte der Linguist und Logiker Chris Barker: wie weit kann man das treiben? Schönfinkel brauchte zwei Kombinatoren. Reicht einer? Er definierte ℩ ≡ λx. x S K — „wende dein Argument auf S an, dann auf K.“ Das ist die ganze Sprache: ein Symbol, eine Regel. Klammern sind Typografie, kein zusätzliches Primitiv. Und doch enthält diese eine Regel S und K als abgeleitete Terme — und damit alles.",
    },
    {
      pretitle: "Abschnitt 04 · K herleiten",
      title: "Eine kleine Iota-Schachtelung ergibt K",
      body: "Nimm ℩(℩(℩℩)). Jedes äußere Iota feuert die Regel ℩x = xSK: das äußerste schält sich als (℩(℩ι)) S K ab, dann noch einmal, dann noch einmal. Nach ein paar S- und K-Reduktionen bleibt am Ende der nackte Kombinator K übrig. Die Linksaußen-Spur läuft etwa neun Schritte von Anfang bis Ende — eine kurze Kette, alles Buchhaltung. Aus vier Strichen eines einzigen Symbols fällt die Konstantenfunktion heraus.",
    },
    {
      pretitle: "Abschnitt 05 · S herleiten",
      title: "Eine tiefere Schachtelung ergibt S",
      body: "Jetzt wende Iota auf eine dreifach geschachtelte Iota-Folge an: ℩(℩(℩(℩℩))). Jedes äußere Iota feuert die Regel ℩x = xSK und schiebt noch ein S K aufs Rückgrat. Nach ein paar Reduktionsschritten kürzen sich die übrigen Terme durch S- und K-Reduktionen gegenseitig weg, und übrig bleibt der nackte Kombinator S. Die ganze Herleitung füllt ein paar Zeilen — die Konsequenz: S lässt sich ausschließlich in Iotas ausdrücken.",
    },
    {
      pretitle: "Abschnitt 06 · Turing-Vollständigkeit",
      title: "Von einem Symbol zu allem Berechenbaren",
      body: "Currys und Feys' Combinatory Logic (1958) ist ein langes Buch mit einem kurzen Hauptsatz: jeder λ-Term lässt sich in einen Term übersetzen, der nur aus S und K besteht. Kombiniert mit dem, was wir gerade gemacht haben — Iota erzeugt S, Iota erzeugt K — ist die Kette geschlossen. Alles, was eine Turing-Maschine, ein Python-Programm oder ein Mensch berechnen kann, lässt sich in Iota codieren. Der Preis ist eine brutale Längenexplosion; der Gewinn ist konzeptionell. Iota steht hinter funktionaler Programmierung, Typtheorie, Beweisassistenten und jeder Implementierung von ML-artigen Sprachen als ultimatives Minimalmodell.",
    },
  ],
  reducerCaption: "Interaktiv · Schritt-für-Schritt-Reduzierer",
  reducerPretitle: "Probier es · der Reduzierer",
  reducerTitle: "Sieh einer Herleitung beim Entfalten zu",
  reducerBody:
    "Wähl eine berühmte Herleitung (ι (ι (ι ι)) → K oder ι (ι (ι (ι ι))) → S) oder tipp deinen eigenen Ausdruck ein. Schritt drücken wendet eine Reduktion an; der neue Term ersetzt den alten. Der Reduzierer folgt der Linksaußen-Reihenfolge — genau die Strategie der Lehrbücher.",
  ksCaption: "Interaktiv · K- und S-Spielwiese",
  ksPretitle: "Probier es · K und S",
  ksTitle: "Spür, was K und S wirklich tun",
  ksBody:
    "Bevor sie sich in Iotas verheddern, sind K und S einfach Funktionen. K wirft sein zweites Argument weg. S wendet die ersten beiden Argumente auf ein geteiltes drittes an. Tipp drei Werte ein; rechts erscheint das symbolische Ergebnis.",
  ksLabels: {
    kHeading: "K — die Konstantenfunktion",
    sHeading: "S — die Substitutionsfunktion",
    kBody: "Gibst du K zwei Werte, behält es den ersten und lässt den zweiten einfach fallen.",
    sBody:
      "S nimmt drei Argumente und schreibt sie als x z (y z) um: x und y werden beide auf den geteilten Wert z angewendet.",
    kResult: "K (x, y) = x",
    sResult: "S (x, y, z) = x z (y z)",
    inputX: "x",
    inputY: "y",
    inputZ: "z",
  },
  ksDefinitions: {
    kShort: "Lass das zweite Argument fallen; behalte das erste.",
    sShort: "Füttere z sowohl in x als auch in y; wende die Ergebnisse an.",
  },
  closingPretitle: "Geh weiter",
  closingTitle: "Öffne den Reduzierer.",
  closingBody:
    "Der Reduzierer lässt dich jeden SKI- oder Iota-Ausdruck tippen und schreibt ihn Schritt für Schritt in die Normalform um, wann immer es eine gibt. Die berühmten Herleitungen sind vorgeladen; den Rest entdeckst du selbst.",
  ctaLabel: "→ Öffne den Reduzierer",
  reducerLabels: {
    customExpression: "eigener Ausdruck (überschreibt Vorlage)",
    stepStatus: "Schritt",
    normalForm: "Normalform",
    stepLimit: "Schrittlimit",
    done: "fertig",
    reducing: "reduziert…",
    next: "weiter",
    parseError: "Parse-Fehler",
    reset: "Zurücksetzen",
    back: "zurück",
    step: "Schritt",
    toEnd: "ans Ende",
    ruleIntro: "In jedem Schritt angewandte Reduktionsregel:",
    ruleThen: "dann",
    ruleAnd: "und",
    ruleOrder: "Linksaußen",
  },
  explainers: {
    everyComputable: "jede berechenbare Funktion",
    lambdaCaption: "λ-Kalkül · die zwei Züge",
    abstraction: "Abstraktion",
    abstractionDesc: "eine Funktion von x nach M",
    application: "Anwendung",
    applicationDesc: "wende M auf N an",
    combinatorPre: "Ein Kombinator ist ein λ-Term mit ",
    combinatorEmph: "keinen freien Variablen",
    combinatorPost: ". Er trägt keinen Kontext, nur Struktur.",
    kLabel: "K · die Konstante",
    sLabel: "S · Substitution-mit-Teilen",
    barkerLine1: "Ein Symbol. Eine Umschreiberegel:",
    barkerLine2: "Der Rest der Berechnung folgt als Korollar.",
    kCaption: "ι (ι (ι ι)) · die K-Herleitung",
    kAnn: [
      "äußeres ι feuert, x = ι (ι ι)",
      "und nochmal",
      "und nochmal",
      "jetzt übernehmen die S-Reduktionen",
      "nur noch K übrig",
    ],
    kNotePre: "Die genaue Kette hängt von der Reduktionsstrategie ab; der ",
    kNoteLink: "vollständige Reduzierer",
    kNotePost: " nutzt Linksaußen und landet in wenigen Schritten bei K.",
    sCaption: "ι (ι (ι (ι ι))) · die S-Herleitung",
    sAnn: [
      "äußerstes ι feuert",
      "auf der nächsten Schicht wiederholen",
      "einige S- und K-Reduktionen später …",
      "der nackte Kombinator S fällt heraus",
    ],
    sNotePre:
      "Fünf Iotas, keine weiteren Primitive, und S erscheint. Gib denselben Ausdruck in den ",
    sNoteLink: "Reduzierer",
    sNotePost: " ein und geh jeden Schritt durch.",
    chainCaption: "die Kette · ausgeschrieben",
    chainAnn: [
      "ein Symbol, eine Regel",
      "beide aus ι herleitbar",
      "Curry & Feys, 1958",
      "Kleene, 1936",
      "Church-Turing-These",
    ],
    chainNotePre:
      "Die letzten drei Pfeile sind Lehrbuchresultate; der erste ist Barkers Beitrag. Die Komposition ist der Beweis, dass ",
    chainNoteEmph: "ι allein Turing-vollständig ist",
  },
};

// --------------------------------------------------------------------------
// Spanish
// --------------------------------------------------------------------------
const es: RichStory = {
  encounter: {
    pretitle: "Primer encuentro",
    title: "Un símbolo. Todo programa.",
    cards: [
      {
        label: "01",
        title: "La gran idea",
        body: "Un único símbolo diminuto — ℩ (iota) — basta para codificar cualquier programa de ordenador que se haya escrito o pueda escribirse. Como NAND para el hardware, pero para la computación misma: una sola primitiva, todo lo demás es reordenamiento.",
      },
      {
        label: "02",
        title: "Un ejemplo concreto",
        body: "Iota se define por una regla: ℩x = xSK, donde S y K son los famosos combinadores. De un pequeño anidamiento de iotas — ℩(℩(℩℩)) — recuperas K (la función constante). Una capa más adentro, ℩(℩(℩(℩℩))), recuperas S (la función de sustitución). Y con S y K se obtiene cualquier función computable.",
      },
      {
        label: "03",
        title: "Por qué importa",
        body: "Esto demuestra que la Turing-completitud se alcanza con UNA sola operación primitiva. Enlaza lógica, ciencias de la computación y filosofía de la mente: ¿puede reducirse el pensamiento a un único símbolo?",
      },
    ],
    tryIt: "Abajo: maneja el reductor, observa a K y S trabajando y reconstrúyelos desde cero.",
  },
  sections: [
    {
      pretitle: "Sección 01 · Antecedentes",
      title: "Cálculo lambda y términos cerrados",
      body: "En los años 1930 Alonzo Church inventó el cálculo λ para estudiar qué significa realmente “computable”. Las funciones se escriben λx.M y se aplican por sustitución. Un combinador es un λ-término cerrado: no tiene variables libres — todo lo que necesita le llega por sus argumentos. Los combinadores son fontanería pura. Church y Curry mostraron que el cálculo λ es exactamente tan potente como una máquina de Turing; los combinadores nos dan esa potencia sin variables.",
    },
    {
      pretitle: "Sección 02 · Schönfinkel, 1924",
      title: "Los combinadores S y K",
      body: "Moses Schönfinkel, en un artículo de 1924 anterior a Church, descubrió que bastan dos combinadores. K x y = x tira su segundo argumento (la función constante). S x y z = x z (y z) toma tres argumentos, da el tercero a los dos primeros, y aplica un resultado al otro (sustitución con compartición). Estas dos reglas codifican todo λ-término, toda función recursiva, todo programa de máquina de Turing.",
    },
    {
      pretitle: "Sección 03 · Barker, 2001",
      title: "Entra Iota",
      body: "En 2001 el lingüista y lógico Chris Barker preguntó: ¿hasta dónde se puede llevar esto? Schönfinkel necesitaba dos combinadores. ¿Basta con uno? Definió ℩ ≡ λx. x S K — “aplica tu argumento a S y luego a K”. Ese es todo el lenguaje: un símbolo, una regla. Los paréntesis son tipografía, no una primitiva extra. Y, sin embargo, esta regla contiene a S y a K como términos derivados — y por tanto, todo.",
    },
    {
      pretitle: "Sección 04 · Derivar K",
      title: "Un pequeño anidamiento de iotas da K",
      body: "Toma ℩(℩(℩℩)). Cada iota externo dispara la regla ℩x = xSK: el más externo se desprende como (℩(℩ι)) S K, luego otra vez, y otra. Tras unas pocas reducciones S y K, queda el combinador desnudo K. La traza más-a-la-izquierda recorre unos nueve pasos de principio a fin — una cadena corta, pura contabilidad. De cuatro trazos de un solo símbolo cae la función constante.",
    },
    {
      pretitle: "Sección 05 · Derivar S",
      title: "Un anidamiento más profundo da S",
      body: "Aplica iota a un anidamiento triple de iotas: ℩(℩(℩(℩℩))). Cada iota externo dispara la regla ℩x = xSK y empuja otro S K al espinazo. Tras unos pocos pasos de reducción, los términos restantes se cancelan entre sí mediante reducciones S y K, y queda el combinador desnudo S. Toda la derivación cabe en unas pocas líneas de contabilidad — y la consecuencia es que S se puede expresar solo con iotas.",
    },
    {
      pretitle: "Sección 06 · Turing-completitud",
      title: "De un símbolo a todo lo computable",
      body: "Combinatory Logic (1958) de Curry y Feys es un libro largo cuyo teorema central es corto: todo λ-término puede traducirse a un término construido solo con S y K. Combina eso con lo que acabamos de hacer — iota produce S e iota produce K — y la cadena queda completa. Cualquier cosa que una máquina de Turing, un programa de Python o una matemática humana puedan calcular, iota lo puede codificar. El precio es una explosión brutal de longitud; la ganancia es conceptual. Iota está detrás de la programación funcional, la teoría de tipos, los asistentes de prueba y toda implementación de lenguajes tipo ML como el modelo mínimo definitivo.",
    },
  ],
  reducerCaption: "Interactivo · reductor paso a paso",
  reducerPretitle: "Pruébalo · el reductor",
  reducerTitle: "Ve una derivación desplegándose",
  reducerBody:
    "Elige una derivación famosa (ι (ι (ι ι)) → K, o ι (ι (ι (ι ι))) → S), o escribe tu propia expresión. Pulsa Paso para aplicar una reducción; el término nuevo sustituye al anterior. El reductor sigue el orden más-a-la-izquierda — exactamente la estrategia de los libros.",
  ksCaption: "Interactivo · campo de juego K y S",
  ksPretitle: "Pruébalo · K y S",
  ksTitle: "Siente qué hacen realmente K y S",
  ksBody:
    "Antes de enredarse con iotas, K y S son simplemente funciones. K tira su segundo argumento. S aplica sus dos primeros argumentos a un tercer valor compartido. Escribe tres valores; el panel muestra el resultado simbólico a la derecha.",
  ksLabels: {
    kHeading: "K — la función constante",
    sHeading: "S — la función de sustitución",
    kBody: "Dale a K dos valores cualesquiera: se queda con el primero y deja caer el segundo.",
    sBody:
      "S toma tres argumentos y los reescribe como x z (y z): x e y se aplican al valor compartido z.",
    kResult: "K (x, y) = x",
    sResult: "S (x, y, z) = x z (y z)",
    inputX: "x",
    inputY: "y",
    inputZ: "z",
  },
  ksDefinitions: {
    kShort: "Descarta el segundo argumento; quédate con el primero.",
    sShort: "Pasa z tanto a x como a y; aplica los resultados.",
  },
  closingPretitle: "Lleva esto más lejos",
  closingTitle: "Abre el Reductor.",
  closingBody:
    "El Reductor te permite escribir cualquier expresión SKI o iota y verla reescribirse, paso a paso, hasta su forma normal cuando existe. Las derivaciones famosas vienen precargadas; lo demás está por descubrir.",
  ctaLabel: "→ Abre el Reductor",
  reducerLabels: {
    customExpression: "expresión propia (anula el preajuste)",
    stepStatus: "paso",
    normalForm: "forma normal",
    stepLimit: "límite de pasos",
    done: "listo",
    reducing: "reduciendo…",
    next: "siguiente",
    parseError: "error de análisis",
    reset: "reiniciar",
    back: "atrás",
    step: "Paso",
    toEnd: "al final",
    ruleIntro: "Regla de reducción aplicada en cada paso:",
    ruleThen: "luego",
    ruleAnd: "y",
    ruleOrder: "más-a-la-izquierda",
  },
  explainers: {
    everyComputable: "toda función computable",
    lambdaCaption: "cálculo λ · los dos movimientos",
    abstraction: "abstracción",
    abstractionDesc: "una función de x a M",
    application: "aplicación",
    applicationDesc: "aplica M a N",
    combinatorPre: "Un combinador es un λ-término ",
    combinatorEmph: "sin variables libres",
    combinatorPost: ". No lleva contexto, solo estructura.",
    kLabel: "K · la constante",
    sLabel: "S · sustitución-con-compartición",
    barkerLine1: "Un símbolo. Una regla de reescritura:",
    barkerLine2: "El resto de la computación se sigue como corolario.",
    kCaption: "ι (ι (ι ι)) · la derivación de K",
    kAnn: [
      "el ι externo dispara, x = ι (ι ι)",
      "y otra vez",
      "y otra vez",
      "ahora toman el relevo las reducciones S",
      "solo queda K",
    ],
    kNotePre: "La cadena exacta depende de la estrategia de reducción; el ",
    kNoteLink: "Reductor completo",
    kNotePost: " usa más-a-la-izquierda y aterriza en K en unos pocos pasos.",
    sCaption: "ι (ι (ι (ι ι))) · la derivación de S",
    sAnn: [
      "el ι más externo dispara",
      "repite en la siguiente capa",
      "varias reducciones S y K después …",
      "el combinador desnudo S sale",
    ],
    sNotePre:
      "Cinco iotas, ninguna otra primitiva, y aparece S. Introduce la misma expresión en el ",
    sNoteLink: "Reductor",
    sNotePost: " y recorre cada paso.",
    chainCaption: "la cadena · escrita",
    chainAnn: [
      "un símbolo, una regla",
      "ambos derivables de ι",
      "Curry & Feys, 1958",
      "Kleene, 1936",
      "tesis de Church-Turing",
    ],
    chainNotePre:
      "Las tres últimas flechas son resultados de manual; la primera es la aportación de Barker. La composición es la prueba de que ",
    chainNoteEmph: "ι por sí solo es Turing-completo",
  },
};

// --------------------------------------------------------------------------
// French
// --------------------------------------------------------------------------
const fr: RichStory = {
  encounter: {
    pretitle: "Première rencontre",
    title: "Un symbole. Tout programme.",
    cards: [
      {
        label: "01",
        title: "L'idée centrale",
        body: "Un seul minuscule symbole — ℩ (iota) — suffit à encoder n'importe quel programme informatique jamais écrit, ou qui pourrait jamais l'être. Comme NAND pour le matériel, mais pour le calcul lui-même : une seule primitive, tout le reste n'est que réarrangement.",
      },
      {
        label: "02",
        title: "Un exemple concret",
        body: "Iota est défini par une règle : ℩x = xSK, où S et K sont les fameux combinateurs. À partir d'un petit emboîtement d'iotas — ℩(℩(℩℩)) — on retrouve K (la fonction constante). Une couche plus profond, ℩(℩(℩(℩℩))), on retrouve S (la fonction de substitution). Et avec S et K, toute fonction calculable suit.",
      },
      {
        label: "03",
        title: "Pourquoi ça compte",
        body: "C'est la preuve que la Turing-complétude est atteinte avec UNE seule opération primitive. Cela relie logique, informatique et philosophie de l'esprit : la pensée peut-elle se réduire à un seul symbole ?",
      },
    ],
    tryIt:
      "En dessous : pilote le réducteur, regarde K et S à l'œuvre, et reconstruis-les à partir de rien.",
  },
  sections: [
    {
      pretitle: "Section 01 · Contexte",
      title: "Lambda-calcul et termes clos",
      body: "Dans les années 1930, Alonzo Church inventa le λ-calcul pour étudier ce que « calculable » voulait vraiment dire. Les fonctions s'écrivent λx.M et s'appliquent par substitution. Un combinateur est un λ-terme clos : pas de variables libres — tout ce dont il a besoin arrive par ses arguments. Les combinateurs sont pure tuyauterie. Church et Curry ont montré que le λ-calcul a exactement la puissance d'une machine de Turing ; les combinateurs nous donnent cette puissance sans variables.",
    },
    {
      pretitle: "Section 02 · Schönfinkel, 1924",
      title: "Les combinateurs S et K",
      body: "Moses Schönfinkel, dans un article de 1924 antérieur à Church, a trouvé que deux combinateurs suffisent. K x y = x jette son second argument (la fonction constante). S x y z = x z (y z) prend trois arguments, donne le troisième aux deux premiers et applique l'un au résultat de l'autre (substitution avec partage). Ces deux règles encodent tout λ-terme, toute fonction récursive, tout programme de machine de Turing.",
    },
    {
      pretitle: "Section 03 · Barker, 2001",
      title: "Iota entre en scène",
      body: "En 2001 le linguiste et logicien Chris Barker a demandé : jusqu'où peut-on pousser ? Schönfinkel avait besoin de deux combinateurs. Un seul peut-il suffire ? Il a défini ℩ ≡ λx. x S K — « applique ton argument à S, puis à K ». C'est tout le langage : un symbole, une règle. Les parenthèses ne sont que typographie, pas une primitive de plus. Et pourtant, cette unique règle contient S et K comme termes dérivés — donc tout.",
    },
    {
      pretitle: "Section 04 · Dériver K",
      title: "Un petit emboîtement d'iotas donne K",
      body: "Prends ℩(℩(℩℩)). Chaque iota externe déclenche la règle ℩x = xSK : le plus externe s'écaille en (℩(℩ι)) S K, puis encore, et encore. Après quelques réductions S et K, il reste le combinateur nu K. La trace la-plus-à-gauche tient en environ neuf étapes du début à la fin — une chaîne courte, pure comptabilité. De quatre traits d'un seul symbole tombe la fonction constante.",
    },
    {
      pretitle: "Section 05 · Dériver S",
      title: "Un emboîtement plus profond donne S",
      body: "Applique maintenant iota à un emboîtement triple d'iotas : ℩(℩(℩(℩℩))). Chaque iota externe déclenche la règle ℩x = xSK et pose un nouveau S K sur l'épine dorsale. Après une poignée d'étapes de réduction, les termes restants s'annulent par réductions S et K, et il reste le combinateur nu S. Toute la dérivation tient en quelques lignes de comptabilité — et la conséquence : S s'exprime uniquement en iotas.",
    },
    {
      pretitle: "Section 06 · Turing-complétude",
      title: "D'un symbole à tout le calculable",
      body: "Combinatory Logic (1958) de Curry et Feys est un livre long dont le théorème central est court : tout λ-terme peut être traduit en un terme construit uniquement à partir de S et K. Combine cela avec ce qu'on vient de faire — iota produit S et iota produit K — et la chaîne est complète. Tout ce qu'une machine de Turing, un programme Python ou un humain mathématicien peut calculer, iota peut l'encoder. Le prix est une explosion brutale de longueur ; le gain est conceptuel. Iota se tient derrière la programmation fonctionnelle, la théorie des types, les assistants de preuve et toute implémentation de langage à la ML, comme modèle minimal ultime.",
    },
  ],
  reducerCaption: "Interactif · réducteur pas à pas",
  reducerPretitle: "Essaie · le réducteur",
  reducerTitle: "Regarde une dérivation se dérouler",
  reducerBody:
    "Choisis une dérivation célèbre (ι (ι (ι ι)) → K, ou ι (ι (ι (ι ι))) → S), ou tape ta propre expression. Appuie sur Étape pour appliquer une réduction ; le nouveau terme remplace l'ancien. Le réducteur suit l'ordre la-plus-à-gauche — exactement la stratégie des manuels.",
  ksCaption: "Interactif · terrain de jeu K et S",
  ksPretitle: "Essaie · K et S",
  ksTitle: "Ressens ce que font vraiment K et S",
  ksBody:
    "Avant de s'emmêler dans les iotas, K et S sont simplement des fonctions. K jette son second argument. S applique ses deux premiers arguments à une troisième valeur partagée. Tape trois valeurs ; le panneau affiche le résultat symbolique à droite.",
  ksLabels: {
    kHeading: "K — la fonction constante",
    sHeading: "S — la fonction de substitution",
    kBody: "Donne à K deux valeurs : il garde la première et laisse tomber la seconde.",
    sBody:
      "S prend trois arguments et les réécrit en x z (y z) : x et y sont appliqués à l'entrée partagée z.",
    kResult: "K (x, y) = x",
    sResult: "S (x, y, z) = x z (y z)",
    inputX: "x",
    inputY: "y",
    inputZ: "z",
  },
  ksDefinitions: {
    kShort: "Laisse tomber le second argument ; garde le premier.",
    sShort: "Passe z à la fois à x et à y ; applique les résultats.",
  },
  closingPretitle: "Va plus loin",
  closingTitle: "Ouvre le Réducteur.",
  closingBody:
    "Le Réducteur te laisse taper n'importe quelle expression SKI ou iota et la voir se réécrire, pas à pas, jusqu'à sa forme normale quand elle existe. Les dérivations célèbres sont pré-chargées ; le reste t'appartient.",
  ctaLabel: "→ Ouvre le Réducteur",
  reducerLabels: {
    customExpression: "expression personnalisée (remplace le préréglage)",
    stepStatus: "étape",
    normalForm: "forme normale",
    stepLimit: "limite d'étapes",
    done: "terminé",
    reducing: "réduction…",
    next: "suivant",
    parseError: "erreur d'analyse",
    reset: "réinitialiser",
    back: "retour",
    step: "Étape",
    toEnd: "à la fin",
    ruleIntro: "Règle de réduction appliquée à chaque étape :",
    ruleThen: "puis",
    ruleAnd: "et",
    ruleOrder: "la-plus-à-gauche",
  },
  explainers: {
    everyComputable: "toute fonction calculable",
    lambdaCaption: "λ-calcul · les deux mouvements",
    abstraction: "abstraction",
    abstractionDesc: "une fonction de x vers M",
    application: "application",
    applicationDesc: "applique M à N",
    combinatorPre: "Un combinateur est un λ-terme ",
    combinatorEmph: "sans variables libres",
    combinatorPost: ". Il ne porte aucun contexte, seulement de la structure.",
    kLabel: "K · la constante",
    sLabel: "S · substitution-avec-partage",
    barkerLine1: "Un symbole. Une règle de réécriture :",
    barkerLine2: "Le reste du calcul en découle comme corollaire.",
    kCaption: "ι (ι (ι ι)) · la dérivation de K",
    kAnn: [
      "le ι externe se déclenche, x = ι (ι ι)",
      "et encore",
      "et encore",
      "les réductions S prennent le relais",
      "il ne reste que K",
    ],
    kNotePre: "La chaîne exacte dépend de la stratégie de réduction ; le ",
    kNoteLink: "Réducteur complet",
    kNotePost: " suit la-plus-à-gauche et atterrit sur K en quelques étapes.",
    sCaption: "ι (ι (ι (ι ι))) · la dérivation de S",
    sAnn: [
      "le ι le plus externe se déclenche",
      "répète sur la couche suivante",
      "plusieurs réductions S et K plus tard …",
      "le combinateur nu S apparaît",
    ],
    sNotePre:
      "Cinq iotas, aucune autre primitive, et S apparaît. Mets la même expression dans le ",
    sNoteLink: "Réducteur",
    sNotePost: " et parcours chaque étape.",
    chainCaption: "la chaîne · écrite",
    chainAnn: [
      "un symbole, une règle",
      "les deux dérivables de ι",
      "Curry & Feys, 1958",
      "Kleene, 1936",
      "thèse de Church-Turing",
    ],
    chainNotePre:
      "Les trois dernières flèches sont des résultats de manuel ; la première est la contribution de Barker. La composition est la preuve que ",
    chainNoteEmph: "ι seul est Turing-complet",
  },
};

// --------------------------------------------------------------------------
// Italian
// --------------------------------------------------------------------------
const it: RichStory = {
  encounter: {
    pretitle: "Primo incontro",
    title: "Un simbolo. Ogni programma.",
    cards: [
      {
        label: "01",
        title: "L'idea centrale",
        body: "Un solo, minuscolo simbolo — ℩ (iota) — basta a codificare qualunque programma per computer mai scritto, o mai scrivibile. Come NAND per l'hardware, ma per la computazione stessa: una sola primitiva, tutto il resto è solo riarrangiamento.",
      },
      {
        label: "02",
        title: "Un esempio concreto",
        body: "Iota è definito da una regola: ℩x = xSK, dove S e K sono i famosi combinatori. Da un piccolo annidamento di iote — ℩(℩(℩℩)) — recuperi K (la funzione costante). Uno strato più in profondità, ℩(℩(℩(℩℩))), ottieni S (la funzione di sostituzione). E con S e K segue ogni funzione calcolabile.",
      },
      {
        label: "03",
        title: "Perché conta",
        body: "È la dimostrazione che la Turing-completezza si raggiunge con UNA sola operazione primitiva. Lega logica, informatica e filosofia della mente: si può ridurre il pensiero a un solo simbolo?",
      },
    ],
    tryIt: "Sotto: pilota il riduttore, osserva K e S all'opera, e ricostruiscili da zero.",
  },
  sections: [
    {
      pretitle: "Sezione 01 · Contesto",
      title: "Lambda-calcolo e termini chiusi",
      body: "Negli anni '30 Alonzo Church inventò il λ-calcolo per studiare cosa significasse davvero “calcolabile”. Le funzioni si scrivono λx.M e si applicano per sostituzione. Un combinatore è un λ-termine chiuso: nessuna variabile libera — tutto ciò che gli serve arriva attraverso gli argomenti. I combinatori sono pura tubatura. Church e Curry mostrarono che il λ-calcolo è esattamente potente quanto una macchina di Turing; i combinatori ci danno questa potenza senza variabili.",
    },
    {
      pretitle: "Sezione 02 · Schönfinkel, 1924",
      title: "I combinatori S e K",
      body: "Moses Schönfinkel, in un articolo del 1924 anteriore a Church, scoprì che bastano due combinatori. K x y = x butta via il secondo argomento (la funzione costante). S x y z = x z (y z) prende tre argomenti, dà il terzo ai primi due e applica un risultato all'altro (sostituzione con condivisione). Queste due regole codificano ogni λ-termine, ogni funzione ricorsiva, ogni programma di macchina di Turing.",
    },
    {
      pretitle: "Sezione 03 · Barker, 2001",
      title: "Entra Iota",
      body: "Nel 2001 il linguista e logico Chris Barker si chiese: fin dove si può spingere? Schönfinkel aveva bisogno di due combinatori. Ne basta uno? Definì ℩ ≡ λx. x S K — “applica il tuo argomento a S e poi a K”. Ecco l'intero linguaggio: un simbolo, una regola. Le parentesi sono tipografia, non una primitiva in più. Eppure questa unica regola contiene S e K come termini derivati — e quindi tutto.",
    },
    {
      pretitle: "Sezione 04 · Derivare K",
      title: "Un piccolo annidamento di iote dà K",
      body: "Prendi ℩(℩(℩℩)). Ogni iota esterno fa scattare la regola ℩x = xSK: il più esterno si stacca come (℩(℩ι)) S K, poi di nuovo, e di nuovo. Dopo poche riduzioni S e K resta il combinatore nudo K. La traccia più-a-sinistra corre per circa nove passi dall'inizio alla fine — una catena breve, pura contabilità. Da quattro tratti di un solo simbolo cade fuori la funzione costante.",
    },
    {
      pretitle: "Sezione 05 · Derivare S",
      title: "Un annidamento più profondo dà S",
      body: "Ora applica iota a un annidamento triplo di iote: ℩(℩(℩(℩℩))). Ogni iota esterno fa scattare la regola ℩x = xSK e spinge un altro S K sulla spina dorsale. Dopo una manciata di passi di riduzione i termini residui si cancellano fra loro tramite riduzioni S e K, e resta il combinatore nudo S. Tutta la derivazione sta in poche righe di contabilità — e la conseguenza è che S si esprime usando solo iote.",
    },
    {
      pretitle: "Sezione 06 · Turing-completezza",
      title: "Da un simbolo a tutto il calcolabile",
      body: "Combinatory Logic (1958) di Curry e Feys è un libro lungo il cui teorema centrale è breve: ogni λ-termine può essere tradotto in un termine costruito solo con S e K. Unito a ciò che abbiamo appena fatto — iota produce S e iota produce K — la catena è completa. Tutto ciò che una macchina di Turing, un programma Python o una matematica umana possono calcolare, iota lo può codificare. Il prezzo è un'esplosione brutale di lunghezza; il guadagno è concettuale. Iota sta dietro alla programmazione funzionale, alla teoria dei tipi, agli assistenti di prova e a ogni implementazione di linguaggi alla ML, come modello minimo definitivo.",
    },
  ],
  reducerCaption: "Interattivo · riduttore passo-passo",
  reducerPretitle: "Provalo · il riduttore",
  reducerTitle: "Guarda una derivazione che si svolge",
  reducerBody:
    "Scegli una derivazione famosa (ι (ι (ι ι)) → K, o ι (ι (ι (ι ι))) → S), o digita la tua espressione. Premi Passo per applicare una riduzione; il nuovo termine sostituisce il precedente. Il riduttore segue l'ordine più-a-sinistra — esattamente la strategia dei manuali.",
  ksCaption: "Interattivo · campo giochi K e S",
  ksPretitle: "Provalo · K e S",
  ksTitle: "Senti cosa fanno davvero K e S",
  ksBody:
    "Prima di impigliarsi negli iota, K e S sono semplicemente funzioni. K butta via il secondo argomento. S applica i primi due argomenti a un terzo valore condiviso. Digita tre valori; il pannello mostra il risultato simbolico a destra.",
  ksLabels: {
    kHeading: "K — la funzione costante",
    sHeading: "S — la funzione di sostituzione",
    kBody: "Dai a K due valori qualsiasi: tiene il primo e lascia cadere il secondo.",
    sBody:
      "S prende tre argomenti e li riscrive come x z (y z): x e y si applicano entrambi al valore condiviso z.",
    kResult: "K (x, y) = x",
    sResult: "S (x, y, z) = x z (y z)",
    inputX: "x",
    inputY: "y",
    inputZ: "z",
  },
  ksDefinitions: {
    kShort: "Scarta il secondo argomento; tieni il primo.",
    sShort: "Passa z sia a x che a y; applica i risultati.",
  },
  closingPretitle: "Vai oltre",
  closingTitle: "Apri il Riduttore.",
  closingBody:
    "Il Riduttore ti lascia digitare qualunque espressione SKI o iota e la riscrive, passo dopo passo, fino alla forma normale quando esiste. Le derivazioni famose sono precaricate; il resto è da scoprire.",
  ctaLabel: "→ Apri il Riduttore",
  reducerLabels: {
    customExpression: "espressione personalizzata (sovrascrive il preset)",
    stepStatus: "passo",
    normalForm: "forma normale",
    stepLimit: "limite di passi",
    done: "fatto",
    reducing: "riduzione…",
    next: "successivo",
    parseError: "errore di analisi",
    reset: "reimposta",
    back: "indietro",
    step: "Passo",
    toEnd: "alla fine",
    ruleIntro: "Regola di riduzione applicata a ogni passo:",
    ruleThen: "poi",
    ruleAnd: "e",
    ruleOrder: "più-a-sinistra",
  },
  explainers: {
    everyComputable: "ogni funzione calcolabile",
    lambdaCaption: "λ-calcolo · le due mosse",
    abstraction: "astrazione",
    abstractionDesc: "una funzione da x a M",
    application: "applicazione",
    applicationDesc: "applica M a N",
    combinatorPre: "Un combinatore è un λ-termine ",
    combinatorEmph: "senza variabili libere",
    combinatorPost: ". Non porta contesto, solo struttura.",
    kLabel: "K · la costante",
    sLabel: "S · sostituzione-con-condivisione",
    barkerLine1: "Un simbolo. Una regola di riscrittura:",
    barkerLine2: "Il resto della computazione segue come corollario.",
    kCaption: "ι (ι (ι ι)) · la derivazione di K",
    kAnn: [
      "il ι esterno scatta, x = ι (ι ι)",
      "e di nuovo",
      "e di nuovo",
      "ora subentrano le riduzioni S",
      "resta solo K",
    ],
    kNotePre: "La catena esatta dipende dalla strategia di riduzione; il ",
    kNoteLink: "Riduttore completo",
    kNotePost: " usa più-a-sinistra e atterra su K in pochi passi.",
    sCaption: "ι (ι (ι (ι ι))) · la derivazione di S",
    sAnn: [
      "il ι più esterno scatta",
      "ripeti sullo strato successivo",
      "diverse riduzioni S e K dopo …",
      "il combinatore nudo S salta fuori",
    ],
    sNotePre:
      "Cinque iote, nessun'altra primitiva, e appare S. Inserisci la stessa espressione nel ",
    sNoteLink: "Riduttore",
    sNotePost: " e percorri ogni passo.",
    chainCaption: "la catena · scritta",
    chainAnn: [
      "un simbolo, una regola",
      "entrambi derivabili da ι",
      "Curry & Feys, 1958",
      "Kleene, 1936",
      "tesi di Church-Turing",
    ],
    chainNotePre:
      "Le ultime tre frecce sono risultati da manuale; la prima è il contributo di Barker. La composizione è la prova che ",
    chainNoteEmph: "ι da solo è Turing-completo",
  },
};

// --------------------------------------------------------------------------
// Portuguese
// --------------------------------------------------------------------------
const pt: RichStory = {
  encounter: {
    pretitle: "Primeiro encontro",
    title: "Um símbolo. Qualquer programa.",
    cards: [
      {
        label: "01",
        title: "A grande ideia",
        body: "Um único e minúsculo símbolo — ℩ (iota) — basta para codificar qualquer programa de computador que já tenha sido escrito, ou possa vir a ser. Como o NAND para o hardware, mas para a própria computação: uma única primitiva, todo o resto é só reorganização.",
      },
      {
        label: "02",
        title: "Um exemplo concreto",
        body: "Iota define-se por uma regra: ℩x = xSK, onde S e K são os famosos combinadores. De um pequeno aninhamento de iotas — ℩(℩(℩℩)) — recuperas K (a função constante). Uma camada mais funda, ℩(℩(℩(℩℩))), obténs S (a função de substituição). E a partir de S e K segue qualquer função computável.",
      },
      {
        label: "03",
        title: "Por que importa",
        body: "É a prova de que a Turing-completude se alcança com UMA operação primitiva. Liga lógica, ciência da computação e filosofia da mente: pode o pensamento ser reduzido a um único símbolo?",
      },
    ],
    tryIt: "Abaixo: pilota o redutor, vê o K e o S a trabalhar, e reconstrói-os a partir do zero.",
  },
  sections: [
    {
      pretitle: "Secção 01 · Contexto",
      title: "Cálculo lambda e termos fechados",
      body: "Nos anos 1930 Alonzo Church inventou o cálculo λ para estudar o que “computável” realmente significava. As funções escrevem-se λx.M e aplicam-se por substituição. Um combinador é um λ-termo fechado: sem variáveis livres — tudo o que precisa chega pelos argumentos. Combinadores são canalização pura. Church e Curry mostraram que o cálculo λ é exatamente tão potente quanto uma máquina de Turing; os combinadores dão-nos essa potência sem variáveis.",
    },
    {
      pretitle: "Secção 02 · Schönfinkel, 1924",
      title: "Os combinadores S e K",
      body: "Moses Schönfinkel, num artigo de 1924 anterior a Church, descobriu que bastam dois combinadores. K x y = x deita fora o segundo argumento (a função constante). S x y z = x z (y z) pega em três argumentos, dá o terceiro aos dois primeiros e aplica um resultado ao outro (substituição com partilha). Estas duas regras codificam todo λ-termo, toda função recursiva, todo programa de máquina de Turing.",
    },
    {
      pretitle: "Secção 03 · Barker, 2001",
      title: "Entra o Iota",
      body: "Em 2001 o linguista e lógico Chris Barker perguntou: até onde se pode levar isto? Schönfinkel precisava de dois combinadores. Bastará um? Definiu ℩ ≡ λx. x S K — “aplica o teu argumento a S e depois a K”. É toda a linguagem: um símbolo, uma regra. Os parênteses são tipografia, não uma primitiva extra. E, no entanto, esta única regra contém S e K como termos derivados — e portanto tudo.",
    },
    {
      pretitle: "Secção 04 · Derivar K",
      title: "Um pequeno aninhamento de iotas dá K",
      body: "Toma ℩(℩(℩℩)). Cada iota externo dispara a regra ℩x = xSK: o mais externo descasca-se como (℩(℩ι)) S K, depois outra vez, e outra. Após algumas reduções S e K, fica o combinador nu K. O traço mais-à-esquerda corre cerca de nove passos do início ao fim — uma cadeia curta, pura contabilidade. De quatro pinceladas de um só símbolo cai a função constante.",
    },
    {
      pretitle: "Secção 05 · Derivar S",
      title: "Um aninhamento mais profundo dá S",
      body: "Agora aplica iota a um aninhamento triplo de iotas: ℩(℩(℩(℩℩))). Cada iota externo dispara a regra ℩x = xSK e empurra outro S K para a espinha. Após uns passos de redução, os termos restantes cancelam-se através de reduções S e K, e fica o combinador nu S. Toda a derivação cabe em algumas linhas de contabilidade — e a consequência é que S se exprime usando só iotas.",
    },
    {
      pretitle: "Secção 06 · Turing-completude",
      title: "De um símbolo a tudo o que é computável",
      body: "Combinatory Logic (1958) de Curry e Feys é um livro longo cujo teorema central é curto: todo λ-termo pode ser traduzido num termo construído apenas com S e K. Junta isto ao que acabámos de fazer — iota produz S e iota produz K — e a cadeia fecha-se. Tudo o que uma máquina de Turing, um programa Python ou uma matemática humana possam calcular, iota pode codificar. O preço é uma explosão brutal de comprimento; o ganho é conceptual. Iota está por trás da programação funcional, da teoria de tipos, dos assistentes de prova e de toda a implementação de linguagens à ML, como o modelo mínimo definitivo.",
    },
  ],
  reducerCaption: "Interativo · redutor passo a passo",
  reducerPretitle: "Experimenta · o redutor",
  reducerTitle: "Vê uma derivação a desenrolar-se",
  reducerBody:
    "Escolhe uma derivação famosa (ι (ι (ι ι)) → K, ou ι (ι (ι (ι ι))) → S), ou escreve a tua expressão. Prime Passo para aplicar uma redução; o novo termo substitui o anterior. O redutor segue a ordem mais-à-esquerda — exatamente a estratégia dos manuais.",
  ksCaption: "Interativo · campo de jogos K e S",
  ksPretitle: "Experimenta · K e S",
  ksTitle: "Sente o que K e S realmente fazem",
  ksBody:
    "Antes de se enredarem em iotas, K e S são simplesmente funções. K deita fora o segundo argumento. S aplica os dois primeiros argumentos a um terceiro valor partilhado. Escreve três valores; o painel mostra o resultado simbólico à direita.",
  ksLabels: {
    kHeading: "K — a função constante",
    sHeading: "S — a função de substituição",
    kBody: "Dá a K dois valores quaisquer: fica com o primeiro e deixa cair o segundo.",
    sBody:
      "S pega em três argumentos e reescreve-os como x z (y z): x e y são ambos aplicados ao valor partilhado z.",
    kResult: "K (x, y) = x",
    sResult: "S (x, y, z) = x z (y z)",
    inputX: "x",
    inputY: "y",
    inputZ: "z",
  },
  ksDefinitions: {
    kShort: "Descarta o segundo argumento; mantém o primeiro.",
    sShort: "Passa z tanto a x como a y; aplica os resultados.",
  },
  closingPretitle: "Leva mais longe",
  closingTitle: "Abre o Redutor.",
  closingBody:
    "O Redutor deixa-te escrever qualquer expressão SKI ou iota e vê-la reescrever-se, passo a passo, até à sua forma normal quando existe. As derivações famosas estão precarregadas; o resto é por descobrir.",
  ctaLabel: "→ Abre o Redutor",
  reducerLabels: {
    customExpression: "expressão própria (substitui a predefinição)",
    stepStatus: "passo",
    normalForm: "forma normal",
    stepLimit: "limite de passos",
    done: "concluído",
    reducing: "a reduzir…",
    next: "seguinte",
    parseError: "erro de análise",
    reset: "repor",
    back: "voltar",
    step: "Passo",
    toEnd: "até ao fim",
    ruleIntro: "Regra de redução aplicada em cada passo:",
    ruleThen: "depois",
    ruleAnd: "e",
    ruleOrder: "mais-à-esquerda",
  },
  explainers: {
    everyComputable: "toda função computável",
    lambdaCaption: "cálculo λ · os dois movimentos",
    abstraction: "abstração",
    abstractionDesc: "uma função de x para M",
    application: "aplicação",
    applicationDesc: "aplica M a N",
    combinatorPre: "Um combinador é um λ-termo ",
    combinatorEmph: "sem variáveis livres",
    combinatorPost: ". Não carrega contexto, apenas estrutura.",
    kLabel: "K · a constante",
    sLabel: "S · substituição-com-partilha",
    barkerLine1: "Um símbolo. Uma regra de reescrita:",
    barkerLine2: "O resto da computação decorre como corolário.",
    kCaption: "ι (ι (ι ι)) · a derivação de K",
    kAnn: [
      "o ι externo dispara, x = ι (ι ι)",
      "e outra vez",
      "e outra vez",
      "agora as reduções S assumem",
      "só resta K",
    ],
    kNotePre: "A cadeia exata depende da estratégia de redução; o ",
    kNoteLink: "Redutor completo",
    kNotePost: " usa mais-à-esquerda e aterra em K em poucos passos.",
    sCaption: "ι (ι (ι (ι ι))) · a derivação de S",
    sAnn: [
      "o ι mais externo dispara",
      "repete na camada seguinte",
      "várias reduções S e K depois …",
      "o combinador nu S surge",
    ],
    sNotePre:
      "Cinco iotas, nenhuma outra primitiva, e S aparece. Coloca a mesma expressão no ",
    sNoteLink: "Redutor",
    sNotePost: " e percorre cada passo.",
    chainCaption: "a cadeia · escrita",
    chainAnn: [
      "um símbolo, uma regra",
      "ambos deriváveis de ι",
      "Curry & Feys, 1958",
      "Kleene, 1936",
      "tese de Church-Turing",
    ],
    chainNotePre:
      "As três últimas setas são resultados de manual; a primeira é o contributo de Barker. A composição é a prova de que ",
    chainNoteEmph: "ι sozinho é Turing-completo",
  },
};

// --------------------------------------------------------------------------
// Swedish
// --------------------------------------------------------------------------
const sv: RichStory = {
  encounter: {
    pretitle: "Första mötet",
    title: "En symbol. Varje program.",
    cards: [
      {
        label: "01",
        title: "Den stora idén",
        body: "En enda liten symbol — ℩ (iota) — räcker för att koda vilket datorprogram som helst som någonsin skrivits, eller någonsin kan skrivas. Som NAND för hårdvara, fast för själva beräkningen: en enda primitiv, allt annat är bara omflyttning.",
      },
      {
        label: "02",
        title: "Ett konkret exempel",
        body: "Iota definieras av en regel: ℩x = xSK, där S och K är de berömda kombinatorerna. Från en liten nästning av iota — ℩(℩(℩℩)) — får du tillbaka K (den konstanta funktionen). Ett lager djupare, ℩(℩(℩(℩℩))), får du S (substitutionsfunktionen). Och med S och K följer varje beräkningsbar funktion.",
      },
      {
        label: "03",
        title: "Varför det spelar roll",
        body: "Det är beviset att Turing-komplethet kan nås med EN enda primitiv operation. Det knyter ihop logik, datavetenskap och medvetandefilosofi: kan tanken själv reduceras till en enda symbol?",
      },
    ],
    tryIt: "Nedanför: kör reduceraren, se K och S i arbete, och bygg upp dem från grunden.",
  },
  sections: [
    {
      pretitle: "Avsnitt 01 · Bakgrund",
      title: "Lambdakalkyl och slutna termer",
      body: "På 1930-talet uppfann Alonzo Church λ-kalkylen för att studera vad ”beräkningsbart” egentligen betyder. Funktioner skrivs λx.M och tillämpas genom substitution. En kombinator är en sluten λ-term: inga fria variabler — allt den behöver kommer via argumenten. Kombinatorer är ren ledningsdragning. Church och Curry visade att λ-kalkylen är exakt lika mäktig som en Turingmaskin; kombinatorer ger oss den makten utan variabler.",
    },
    {
      pretitle: "Avsnitt 02 · Schönfinkel, 1924",
      title: "Kombinatorerna S och K",
      body: "Moses Schönfinkel upptäckte 1924, före Church, att två kombinatorer räcker. K x y = x kastar bort sitt andra argument (den konstanta funktionen). S x y z = x z (y z) tar tre argument, ger det tredje till båda de första, och tillämpar det ena resultatet på det andra (substitution med delning). Dessa två regler kodar varje λ-term, varje rekursiv funktion, varje Turingmaskinsprogram.",
    },
    {
      pretitle: "Avsnitt 03 · Barker, 2001",
      title: "In kommer Iota",
      body: "2001 frågade lingvisten och logikern Chris Barker: hur långt kan man driva det? Schönfinkel behövde två kombinatorer. Räcker det med en? Han definierade ℩ ≡ λx. x S K — ”tillämpa ditt argument på S och sedan på K”. Det är hela språket: en symbol, en regel. Parenteser är typografi, inte en extra primitiv. Ändå innehåller denna enda regel S och K som härledda termer — och därmed allt.",
    },
    {
      pretitle: "Avsnitt 04 · Härleda K",
      title: "En liten nästning av iota ger K",
      body: "Ta ℩(℩(℩℩)). Varje yttre iota avfyrar regeln ℩x = xSK: det yttersta skalas av som (℩(℩ι)) S K, sedan igen, och igen. Efter några S- och K-reduktioner ligger den nakna kombinatorn K kvar. Det vänstermest-yttersta spåret går runt nio steg från början till slut — en kort kedja, ren bokföring. Ur fyra streck av en enda symbol faller den konstanta funktionen ut.",
    },
    {
      pretitle: "Avsnitt 05 · Härleda S",
      title: "Ett djupare bo ger S",
      body: "Tillämpa nu iota på ett tre nivåer djupt bo av iota: ℩(℩(℩(℩℩))). Varje yttre iota avfyrar regeln ℩x = xSK och knuffar ännu ett S K på ryggraden. Efter en handfull reduktionssteg kancellerar de återstående termerna varandra genom S- och K-reduktioner, och kvar blir den nakna kombinatorn S. Hela härledningen ryms på några rader bokföring — och slutsatsen är att S kan uttryckas enbart i iota.",
    },
    {
      pretitle: "Avsnitt 06 · Turing-komplethet",
      title: "Från en symbol till allt beräkningsbart",
      body: "Curry och Feys Combinatory Logic (1958) är en lång bok vars centrala sats är kort: varje λ-term kan översättas till en term byggd enbart av S och K. Lägg samman det med vad vi just gjort — iota producerar S och iota producerar K — och kedjan är sluten. Allt en Turingmaskin, ett Python-program eller en mänsklig matematiker kan beräkna, kan iota koda. Priset är en brutal längdexplosion; vinsten är begreppslig. Iota står bakom funktionell programmering, typteori, bevisassistenter och varje implementation av ML-liknande språk som den ultimata minimala modellen.",
    },
  ],
  reducerCaption: "Interaktiv · steg-för-steg-reducerare",
  reducerPretitle: "Prova · reduceraren",
  reducerTitle: "Se en härledning veckla ut sig",
  reducerBody:
    "Välj en berömd härledning (ι (ι (ι ι)) → K, eller ι (ι (ι (ι ι))) → S), eller skriv ditt eget uttryck. Tryck Steg för att tillämpa en reduktion; den nya termen ersätter den gamla. Reduceraren följer vänstermest-yttersta ordning — exakt strategin från läroböckerna.",
  ksCaption: "Interaktiv · K- och S-lekplats",
  ksPretitle: "Prova · K och S",
  ksTitle: "Känn vad K och S faktiskt gör",
  ksBody:
    "Innan de trasslar in sig i iota är K och S helt enkelt funktioner. K kastar bort sitt andra argument. S tillämpar sina två första argument på ett delat tredje. Skriv in tre värden; panelen visar det symboliska resultatet till höger.",
  ksLabels: {
    kHeading: "K — den konstanta funktionen",
    sHeading: "S — substitutionsfunktionen",
    kBody: "Ge K två värden: det behåller det första och låter det andra falla bort.",
    sBody:
      "S tar tre argument och skriver om dem som x z (y z): både x och y tillämpas på det delade värdet z.",
    kResult: "K (x, y) = x",
    sResult: "S (x, y, z) = x z (y z)",
    inputX: "x",
    inputY: "y",
    inputZ: "z",
  },
  ksDefinitions: {
    kShort: "Släpp det andra argumentet; behåll det första.",
    sShort: "Mata z till både x och y; tillämpa resultaten.",
  },
  closingPretitle: "Gå vidare",
  closingTitle: "Öppna Reduceraren.",
  closingBody:
    "Reduceraren låter dig skriva vilket SKI- eller iota-uttryck som helst och se det skrivas om, steg för steg, till sin normalform när en sådan finns. De berömda härledningarna är förladdade; resten är ditt att upptäcka.",
  ctaLabel: "→ Öppna Reduceraren",
  reducerLabels: {
    customExpression: "eget uttryck (åsidosätter förvalet)",
    stepStatus: "steg",
    normalForm: "normalform",
    stepLimit: "steggräns",
    done: "klar",
    reducing: "reducerar…",
    next: "nästa",
    parseError: "tolkningsfel",
    reset: "återställ",
    back: "tillbaka",
    step: "Steg",
    toEnd: "till slutet",
    ruleIntro: "Reduktionsregel som tillämpas vid varje steg:",
    ruleThen: "sedan",
    ruleAnd: "och",
    ruleOrder: "vänstermest-yttersta",
  },
  explainers: {
    everyComputable: "varje beräkningsbar funktion",
    lambdaCaption: "λ-kalkyl · de två dragen",
    abstraction: "abstraktion",
    abstractionDesc: "en funktion från x till M",
    application: "applikation",
    applicationDesc: "tillämpa M på N",
    combinatorPre: "En kombinator är en λ-term ",
    combinatorEmph: "utan fria variabler",
    combinatorPost: ". Den bär ingen kontext, bara struktur.",
    kLabel: "K · konstanten",
    sLabel: "S · substitution-med-delning",
    barkerLine1: "En symbol. En omskrivningsregel:",
    barkerLine2: "Resten av beräkningen följer som en följdsats.",
    kCaption: "ι (ι (ι ι)) · K-härledningen",
    kAnn: [
      "yttre ι avfyras, x = ι (ι ι)",
      "och igen",
      "och igen",
      "nu tar S-reduktionerna över",
      "bara K kvar",
    ],
    kNotePre: "Den exakta kedjan beror på reduktionsstrategin; den ",
    kNoteLink: "fullständiga Reduceraren",
    kNotePost: " använder vänstermest-yttersta och landar på K på en handfull steg.",
    sCaption: "ι (ι (ι (ι ι))) · S-härledningen",
    sAnn: [
      "yttersta ι avfyras",
      "upprepa på nästa lager",
      "flera S- och K-reduktioner senare …",
      "den nakna kombinatorn S faller ut",
    ],
    sNotePre: "Fem iota, inga andra primitiver, och S dyker upp. Mata in samma uttryck i ",
    sNoteLink: "Reduceraren",
    sNotePost: " och gå igenom varje steg.",
    chainCaption: "kedjan · utskriven",
    chainAnn: [
      "en symbol, en regel",
      "båda härledbara ur ι",
      "Curry & Feys, 1958",
      "Kleene, 1936",
      "Church-Turing-tesen",
    ],
    chainNotePre:
      "De tre sista pilarna är läroboksresultat; den första är Barkers bidrag. Kompositionen är beviset för att ",
    chainNoteEmph: "ι ensam är Turing-komplett",
  },
};

// --------------------------------------------------------------------------
// Norwegian
// --------------------------------------------------------------------------
const no: RichStory = {
  encounter: {
    pretitle: "Første møte",
    title: "Ett symbol. Hvert program.",
    cards: [
      {
        label: "01",
        title: "Den store idéen",
        body: "Ett eneste lite symbol — ℩ (iota) — er nok til å kode ethvert dataprogram som er skrevet, eller noensinne kan skrives. Som NAND for maskinvare, men for selve beregningen: én primitiv, alt annet er bare omrokering.",
      },
      {
        label: "02",
        title: "Et konkret eksempel",
        body: "Iota er definert ved én regel: ℩x = xSK, der S og K er de berømte kombinatorene. Fra en liten nøsting av iota — ℩(℩(℩℩)) — får du tilbake K (den konstante funksjonen). Ett lag dypere, ℩(℩(℩(℩℩))), får du S (substitusjonsfunksjonen). Og med S og K følger enhver beregnbar funksjon.",
      },
      {
        label: "03",
        title: "Hvorfor det betyr noe",
        body: "Det er beviset på at Turing-fullstendighet kan nås med ÉN primitiv operasjon. Det binder sammen logikk, informatikk og bevissthetsfilosofi: kan tanken selv reduseres til ett eneste symbol?",
      },
    ],
    tryIt: "Under: kjør reduseren, se K og S i arbeid, og bygg dem opp fra bunnen.",
  },
  sections: [
    {
      pretitle: "Avsnitt 01 · Bakgrunn",
      title: "Lambdakalkyl og lukkede termer",
      body: "På 1930-tallet fant Alonzo Church opp λ-kalkylen for å studere hva «beregnbart» egentlig betyr. Funksjoner skrives λx.M og anvendes ved substitusjon. En kombinator er en lukket λ-term: ingen frie variabler — alt den trenger kommer via argumentene. Kombinatorer er ren rørlegging. Church og Curry viste at λ-kalkylen er nøyaktig like mektig som en Turingmaskin; kombinatorer gir oss den kraften uten variabler.",
    },
    {
      pretitle: "Avsnitt 02 · Schönfinkel, 1924",
      title: "Kombinatorene S og K",
      body: "Moses Schönfinkel oppdaget i 1924, før Church, at to kombinatorer holder. K x y = x kaster det andre argumentet (den konstante funksjonen). S x y z = x z (y z) tar tre argumenter, gir det tredje til de to første, og anvender det ene resultatet på det andre (substitusjon med deling). Disse to reglene koder enhver λ-term, enhver rekursiv funksjon, ethvert Turingmaskinprogram.",
    },
    {
      pretitle: "Avsnitt 03 · Barker, 2001",
      title: "Inn kommer Iota",
      body: "I 2001 spurte lingvisten og logikeren Chris Barker: hvor langt kan man drive det? Schönfinkel trengte to kombinatorer. Holder det med én? Han definerte ℩ ≡ λx. x S K — «anvend argumentet ditt på S og deretter på K». Det er hele språket: ett symbol, én regel. Parenteser er typografi, ikke en ekstra primitiv. Likevel inneholder denne ene regelen S og K som avledede termer — og dermed alt.",
    },
    {
      pretitle: "Avsnitt 04 · Utlede K",
      title: "En liten nøsting av iota gir K",
      body: "Ta ℩(℩(℩℩)). Hvert ytre iota fyrer av regelen ℩x = xSK: det ytterste skreller av som (℩(℩ι)) S K, så igjen, og igjen. Etter noen få S- og K-reduksjoner ligger den nakne kombinatoren K igjen. Det venstre-ytterste sporet løper rundt ni steg fra start til slutt — en kort kjede, ren bokføring. Av fire streker av ett symbol faller den konstante funksjonen ut.",
    },
    {
      pretitle: "Avsnitt 05 · Utlede S",
      title: "En dypere nøsting gir S",
      body: "Anvend nå iota på et tre nivåer dypt iota-rede: ℩(℩(℩(℩℩))). Hvert ytre iota fyrer av regelen ℩x = xSK og dytter enda et S K på ryggraden. Etter en håndfull reduksjonssteg kanselerer de gjenværende termene hverandre gjennom S- og K-reduksjoner, og igjen står den nakne kombinatoren S. Hele utledningen får plass på noen linjer bokføring — og konsekvensen er at S kan uttrykkes utelukkende med iota.",
    },
    {
      pretitle: "Avsnitt 06 · Turing-fullstendighet",
      title: "Fra ett symbol til alt beregnbart",
      body: "Curry og Feys' Combinatory Logic (1958) er en lang bok hvis sentrale teorem er kort: enhver λ-term kan oversettes til en term bygget bare av S og K. Kombinert med det vi nettopp gjorde — iota produserer S og iota produserer K — er kjeden lukket. Alt en Turingmaskin, et Python-program eller en menneskelig matematiker kan beregne, kan iota kode. Prisen er en brutal lengdeeksplosjon; gevinsten er begrepsmessig. Iota står bak funksjonell programmering, typeteori, bevisassistenter og enhver implementasjon av ML-lignende språk som den ultimate minimale modellen.",
    },
  ],
  reducerCaption: "Interaktiv · trinn-for-trinn-reduser",
  reducerPretitle: "Prøv · reduseren",
  reducerTitle: "Se en utledning folde seg ut",
  reducerBody:
    "Velg en berømt utledning (ι (ι (ι ι)) → K, eller ι (ι (ι (ι ι))) → S), eller skriv ditt eget uttrykk. Trykk Steg for å anvende én reduksjon; den nye termen erstatter den gamle. Reduseren følger venstre-ytterste rekkefølge — nøyaktig strategien fra lærebøkene.",
  ksCaption: "Interaktiv · K- og S-lekeplass",
  ksPretitle: "Prøv · K og S",
  ksTitle: "Føl hva K og S faktisk gjør",
  ksBody:
    "Før de floker seg inn i iota er K og S rett og slett funksjoner. K kaster det andre argumentet. S anvender de to første argumentene på en delt tredje. Skriv tre verdier; panelet viser det symbolske resultatet til høyre.",
  ksLabels: {
    kHeading: "K — den konstante funksjonen",
    sHeading: "S — substitusjonsfunksjonen",
    kBody: "Gi K to verdier: det beholder det første og lar det andre falle bort.",
    sBody:
      "S tar tre argumenter og skriver dem om som x z (y z): både x og y anvendes på den delte verdien z.",
    kResult: "K (x, y) = x",
    sResult: "S (x, y, z) = x z (y z)",
    inputX: "x",
    inputY: "y",
    inputZ: "z",
  },
  ksDefinitions: {
    kShort: "Slipp det andre argumentet; behold det første.",
    sShort: "Mat z til både x og y; bruk resultatene.",
  },
  closingPretitle: "Gå videre",
  closingTitle: "Åpne Reduseren.",
  closingBody:
    "Reduseren lar deg skrive hvilket som helst SKI- eller iota-uttrykk og se det skrives om, steg for steg, til normalform når den finnes. De berømte utledningene er forhåndslastet; resten er ditt å oppdage.",
  ctaLabel: "→ Åpne Reduseren",
  reducerLabels: {
    customExpression: "eget uttrykk (overstyrer forvalget)",
    stepStatus: "steg",
    normalForm: "normalform",
    stepLimit: "steggrense",
    done: "ferdig",
    reducing: "reduserer…",
    next: "neste",
    parseError: "tolkefeil",
    reset: "nullstill",
    back: "tilbake",
    step: "Steg",
    toEnd: "til slutten",
    ruleIntro: "Reduksjonsregel anvendt ved hvert steg:",
    ruleThen: "så",
    ruleAnd: "og",
    ruleOrder: "venstre-ytterste",
  },
  explainers: {
    everyComputable: "enhver beregnbar funksjon",
    lambdaCaption: "λ-kalkyle · de to trekkene",
    abstraction: "abstraksjon",
    abstractionDesc: "en funksjon fra x til M",
    application: "anvendelse",
    applicationDesc: "anvend M på N",
    combinatorPre: "En kombinator er en λ-term ",
    combinatorEmph: "uten frie variabler",
    combinatorPost: ". Den bærer ingen kontekst, bare struktur.",
    kLabel: "K · konstanten",
    sLabel: "S · substitusjon-med-deling",
    barkerLine1: "Ett symbol. Én omskrivingsregel:",
    barkerLine2: "Resten av beregningen følger som et korollar.",
    kCaption: "ι (ι (ι ι)) · K-utledningen",
    kAnn: [
      "ytre ι fyrer av, x = ι (ι ι)",
      "og igjen",
      "og igjen",
      "nå tar S-reduksjonene over",
      "bare K igjen",
    ],
    kNotePre: "Den nøyaktige kjeden avhenger av reduksjonsstrategien; den ",
    kNoteLink: "fullstendige Reduseren",
    kNotePost: " bruker venstre-ytterste og lander på K på en håndfull steg.",
    sCaption: "ι (ι (ι (ι ι))) · S-utledningen",
    sAnn: [
      "ytterste ι fyrer av",
      "gjenta på neste lag",
      "flere S- og K-reduksjoner senere …",
      "den nakne kombinatoren S faller ut",
    ],
    sNotePre: "Fem iota, ingen andre primitiver, og S dukker opp. Legg det samme uttrykket inn i ",
    sNoteLink: "Reduseren",
    sNotePost: " og gå gjennom hvert steg.",
    chainCaption: "kjeden · skrevet ut",
    chainAnn: [
      "ett symbol, én regel",
      "begge utledbare fra ι",
      "Curry & Feys, 1958",
      "Kleene, 1936",
      "Church-Turing-tesen",
    ],
    chainNotePre:
      "De tre siste pilene er læreboksresultater; den første er Barkers bidrag. Komposisjonen er beviset på at ",
    chainNoteEmph: "ι alene er Turing-fullstendig",
  },
};

const RICH_STORY: Record<Locale, RichStory> = { en, de, es, fr, it, pt, sv, no };

// --------------------------------------------------------------------------

export default function IotaStory() {
  const { locale, s, u } = useI18n();
  const page = s.pages.iota;
  const story = RICH_STORY[locale];
  const e = story.explainers;
  const [sec0, sec1, sec2, sec3, sec4, sec5] = story.sections;

  return (
    <main className="relative isolate min-h-screen px-6 pb-32 pt-24">
      <div className="grid-bg pointer-events-none fixed inset-0 -z-10 opacity-30" />
      <div className="from-signal-cyan/12 pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b via-transparent to-ink-950" />

      {/* Hero — canonical pretitle/title/tagline/intro/CTA + formula badge */}
      <section className="mx-auto mb-32 max-w-5xl space-y-7 text-center">
        <Reveal>
          <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
            {page.pretitle}
          </div>
        </Reveal>
        <Reveal delay={120}>
          <h1 className="math-italic text-6xl leading-[0.95] tracking-tight md:text-8xl">
            {page.title}
          </h1>
        </Reveal>
        <Reveal delay={250}>
          <p className="math-italic text-2xl leading-snug text-ink-200 md:text-3xl">
            {page.tagline}
          </p>
        </Reveal>
        <Reveal delay={380}>
          <p className="mx-auto max-w-2xl leading-relaxed text-ink-200">{page.intro}</p>
        </Reveal>
        <Reveal delay={500}>
          <div className="flex flex-col items-center justify-center gap-3 pt-2 md:flex-row">
            <Link
              href="/iota/reducer"
              className="rounded-full border border-signal-cyan/70 bg-signal-cyan/10 px-6 py-3 font-mono text-xs uppercase tracking-widest2 text-signal-cyan transition-colors hover:bg-signal-cyan/20"
            >
              {page.ctaInteractive}
            </Link>
            <Link
              href="/"
              className="hairline rounded-full border px-6 py-3 font-mono text-xs uppercase tracking-widest2 text-ink-200 transition-colors hover:border-ink-300/50 hover:text-ink-100"
            >
              {u.back}
            </Link>
          </div>
        </Reveal>
        <Reveal delay={620}>
          <div className="hairline float-gentle mx-auto mt-6 max-w-md rounded-md border bg-ink-950/60 p-3 font-mono text-base text-ink-100">
            ι x = x S K
          </div>
        </Reveal>
      </section>

      {/* Encounter — three approachable cards */}
      <section className="mx-auto mb-32 max-w-5xl space-y-10">
        <div className="space-y-3 text-center">
          <Reveal>
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {story.encounter.pretitle}
            </div>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="math-italic text-4xl leading-tight md:text-5xl">
              {story.encounter.title}
            </h2>
          </Reveal>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {story.encounter.cards.map((card, i) => (
            <Reveal key={card.label} delay={120 + i * 100}>
              <EncounterCard label={card.label} title={card.title}>
                {i === 1 ? (
                  <>
                    <p>{card.body}</p>
                    <div className="hairline mt-4 space-y-1 rounded-md border bg-ink-950/60 p-3 font-mono text-[11px] text-ink-100">
                      <div>
                        ι (ι (ι ι)) · → <span className="text-signal-cyan">K</span>
                      </div>
                      <div>
                        ι (ι (ι (ι ι))) · → <span className="text-signal-cyan">S</span>
                      </div>
                      <div>
                        S + K · →{" "}
                        <span className="text-signal-amber">{e.everyComputable}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <p>{card.body}</p>
                )}
              </EncounterCard>
            </Reveal>
          ))}
        </div>
        <Reveal delay={500}>
          <div className="text-center italic text-ink-300">{story.encounter.tryIt}</div>
        </Reveal>
      </section>

      {/* Section 01 · lambda calculus + closed terms */}
      <section className="mx-auto mb-32 max-w-4xl space-y-8">
        <StoryCard pretitle={sec0.pretitle} title={sec0.title} body={sec0.body} accent={ACCENT} />
        <Reveal delay={120}>
          <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-6">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {e.lambdaCaption}
            </div>
            <div className="grid grid-cols-1 gap-3 font-mono text-sm md:grid-cols-2">
              <div className="hairline space-y-1 rounded-md border bg-ink-950/60 p-3">
                <div className={`text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
                  {e.abstraction}
                </div>
                <div className="text-ink-100">λx. M</div>
                <div className="text-[11px] text-ink-400">{e.abstractionDesc}</div>
              </div>
              <div className="hairline space-y-1 rounded-md border bg-ink-950/60 p-3">
                <div className={`text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
                  {e.application}
                </div>
                <div className="text-ink-100">(M N)</div>
                <div className="text-[11px] text-ink-400">{e.applicationDesc}</div>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-ink-300">
              {e.combinatorPre}
              <span className={ACCENT}>{e.combinatorEmph}</span>
              {e.combinatorPost}
            </p>
          </div>
        </Reveal>
      </section>

      {/* Section 02 · S and K */}
      <section className="mx-auto mb-32 max-w-4xl space-y-8">
        <StoryCard pretitle={sec1.pretitle} title={sec1.title} body={sec1.body} accent={ACCENT} />
        <Reveal delay={120}>
          <div className="hairline grid grid-cols-1 gap-4 rounded-2xl border bg-ink-950/40 p-6 md:grid-cols-2">
            <div className="hairline space-y-2 rounded-md border bg-ink-950/60 p-4">
              <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
                {e.kLabel}
              </div>
              <div className="font-mono text-base text-ink-100">K x y = x</div>
              <div className="font-mono text-[11px] text-ink-300">≡ λx. λy. x</div>
              <p className="text-xs leading-relaxed text-ink-400">{story.ksDefinitions.kShort}</p>
            </div>
            <div className="hairline space-y-2 rounded-md border bg-ink-950/60 p-4">
              <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
                {e.sLabel}
              </div>
              <div className="font-mono text-base text-ink-100">S x y z = x z (y z)</div>
              <div className="font-mono text-[11px] text-ink-300">≡ λx. λy. λz. x z (y z)</div>
              <p className="text-xs leading-relaxed text-ink-400">{story.ksDefinitions.sShort}</p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* INTERACTIVE 1 · K and S playground */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <Reveal>
          <div className="space-y-2 text-center">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {story.ksPretitle}
            </div>
            <h2 className="math-italic text-3xl leading-tight md:text-4xl">{story.ksTitle}</h2>
            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-ink-200">{story.ksBody}</p>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <IotaKSPlayground caption={story.ksCaption} labels={story.ksLabels} />
        </Reveal>
      </section>

      {/* Section 03 · Iota arrives */}
      <section className="mx-auto mb-32 max-w-4xl space-y-8">
        <StoryCard pretitle={sec2.pretitle} title={sec2.title} body={sec2.body} accent={ACCENT} />
        <Reveal delay={120}>
          <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-8 text-center">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              Barker, 2001
            </div>
            <div className="math-italic text-3xl leading-tight text-ink-100 md:text-4xl">
              ℩ ≡ λx. x S K
            </div>
            <p className="mx-auto max-w-xl text-sm leading-relaxed text-ink-300">
              {e.barkerLine1}{" "}
              <span className="font-mono text-signal-cyan">ι x → x S K</span>. {e.barkerLine2}
            </p>
          </div>
        </Reveal>
      </section>

      {/* Section 04 · derive K */}
      <section className="mx-auto mb-32 max-w-4xl space-y-8">
        <StoryCard pretitle={sec3.pretitle} title={sec3.title} body={sec3.body} accent={ACCENT} />
        <Reveal delay={120}>
          <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-6">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {e.kCaption}
            </div>
            <pre className="hairline overflow-x-auto rounded-md border bg-ink-950/60 p-4 font-mono text-xs leading-relaxed text-ink-100 md:text-sm">
              {`ι (ι (ι ι))
  → (ι (ι ι)) S K       — ${e.kAnn[0]}
  → (ι ι) S K S K       — ${e.kAnn[1]}
  → ι S K S K S K       — ${e.kAnn[2]}
  → S S K K S K S K     — ${e.kAnn[3]}
  → S K (K K) S K S K
  → K S (K K S) K S K
  → S K S K
  → K K (S K)
  → K                   — ${e.kAnn[4]}`}
            </pre>
            <p className="text-xs leading-relaxed text-ink-400">
              {e.kNotePre}
              <Link
                href="/iota/reducer"
                className={`underline decoration-signal-cyan/40 hover:${ACCENT}`}
              >
                {e.kNoteLink}
              </Link>
              {e.kNotePost}
            </p>
          </div>
        </Reveal>
      </section>

      {/* Section 05 · derive S */}
      <section className="mx-auto mb-32 max-w-4xl space-y-8">
        <StoryCard pretitle={sec4.pretitle} title={sec4.title} body={sec4.body} accent={ACCENT} />
        <Reveal delay={120}>
          <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-6">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {e.sCaption}
            </div>
            <pre className="hairline overflow-x-auto rounded-md border bg-ink-950/60 p-4 font-mono text-xs leading-relaxed text-ink-100 md:text-sm">
              {`ι (ι (ι (ι ι)))
  → (ι (ι (ι ι))) S K     — ${e.sAnn[0]}
  → (ι (ι ι)) S K S K     — ${e.sAnn[1]}
  → …   ${e.sAnn[2]}
  → S                     — ${e.sAnn[3]}`}
            </pre>
            <p className="text-xs leading-relaxed text-ink-400">
              {e.sNotePre}
              <Link
                href="/iota/reducer"
                className={`underline decoration-signal-cyan/40 hover:${ACCENT}`}
              >
                {e.sNoteLink}
              </Link>
              {e.sNotePost}
            </p>
          </div>
        </Reveal>
      </section>

      {/* INTERACTIVE 2 · the step-by-step reducer */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <Reveal>
          <div className="space-y-2 text-center">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {story.reducerPretitle}
            </div>
            <h2 className="math-italic text-3xl leading-tight md:text-4xl">{story.reducerTitle}</h2>
            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-ink-200">
              {story.reducerBody}
            </p>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <IotaReducerMini caption={story.reducerCaption} labels={story.reducerLabels} />
        </Reveal>
      </section>

      {/* Section 06 · Turing-completeness */}
      <section className="mx-auto mb-32 max-w-4xl space-y-8">
        <StoryCard pretitle={sec5.pretitle} title={sec5.title} body={sec5.body} accent={ACCENT} />
        <Reveal delay={120}>
          <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-6">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {e.chainCaption}
            </div>
            <pre className="hairline overflow-x-auto rounded-md border bg-ink-950/60 p-4 font-mono text-xs leading-relaxed text-ink-100 md:text-sm">
              {`ι             — ${e.chainAnn[0]}
  ⇒ S, K       — ${e.chainAnn[1]}
  ⇒ λ-calculus — ${e.chainAnn[2]}
  ⇒ recursive  — ${e.chainAnn[3]}
  ⇒ Turing     — ${e.chainAnn[4]}`}
            </pre>
            <p className="text-xs leading-relaxed text-ink-400">
              {e.chainNotePre}
              <span className={ACCENT}>{e.chainNoteEmph}</span>.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Closing CTA */}
      <Reveal>
        <section className="glass hairline mx-auto max-w-3xl space-y-6 rounded-3xl border p-10 text-center">
          <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
            {story.closingPretitle}
          </div>
          <div className="math-italic shimmer-text text-3xl leading-tight md:text-5xl">
            {story.closingTitle}
          </div>
          <p className="leading-relaxed text-ink-200">{story.closingBody}</p>
          <Link
            href="/iota/reducer"
            className="inline-block rounded-full border border-signal-cyan/70 bg-signal-cyan/10 px-8 py-4 font-mono text-sm uppercase tracking-widest2 text-signal-cyan transition-colors hover:bg-signal-cyan/25"
          >
            {story.ctaLabel}
          </Link>
        </section>
      </Reveal>
    </main>
  );
}

// --------------------------------------------------------------------------

function EncounterCard({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="glass hairline h-full space-y-3 rounded-2xl border p-6 transition-colors hover:border-signal-cyan/40">
      <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>{label}</div>
      <h3 className="math-italic text-2xl leading-snug text-ink-100">{title}</h3>
      <div className="text-sm leading-relaxed text-ink-200">{children}</div>
    </div>
  );
}
