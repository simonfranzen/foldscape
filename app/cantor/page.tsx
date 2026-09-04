"use client";

import Link from "next/link";
import { StoryPageShell, StoryCard } from "@/components/StoryPageShell";
import { Reveal } from "@/components/Reveal";
import { useI18n } from "@/lib/i18n/context";
import { CantorDiagonalDemo } from "@/components/CantorDiagonalDemo";
import { CantorPowerSetTower } from "@/components/CantorPowerSetTower";
import type { Locale } from "@/lib/i18n/types";
import type { StoryPage } from "@/lib/i18n/stories";

const ACCENT = "text-signal-rose";

// --------------------------------------------------------------------------
// Cantor's Diagonal Argument — long-form story page. Canonical hero
// (pretitle/title/tagline/intro/cta) lives in RICH_STORY[locale].page so the
// whole 8-locale bundle is editable from this single file. Six body
// sections, three encounter cards, and the captions for the two inline
// interactive widgets are authored here as well.
// --------------------------------------------------------------------------

type RichStory = {
  page: Omit<StoryPage, "sections">;
  encounter: {
    pretitle: string;
    title: string;
    cards: Array<{ label: string; title: string; body: string }>;
    tryIt: string;
  };
  sections: Array<{ pretitle: string; title: string; body: string }>;
  closingPretitle: string;
  closingTitle: string;
  closingBody: string;
  ctaLabel: string;
  // CantorDiagonalDemo labels
  diagonalCaption: string;
  diagonalRows: string;
  diagonalRandomise: string;
  diagonalConstructed: string;
  diagonalHint: string;
  diagonalRule: string;
  diagonalRowLabel: string;
  diagonalDiagonalLabel: string;
  // CantorPowerSetTower labels
  towerCaption: string;
  towerHint: string;
  towerExpandHint: string;
  towerOf: string;
  towerHierarchy: string;
  towerRungs: Array<{ pretty: string; note: string }>;
  // Section 04 continuum card
  continuumTitle: string;
  continuumBody: string;
  // Section 05 CH-independence table
  chTitle: string;
  chYear: string;
  chWho: string;
  chResult: string;
  chRows: Array<{ year: string; who: string; result: string }>;
  chFootnote: string;
};

// ---------------- English ----------------
const en: RichStory = {
  page: {
    pretitle: "Topic · Paradox",
    title: "Cantor's Diagonal",
    tagline: "Infinity comes in sizes.",
    intro:
      "Georg Cantor's 1891 diagonal argument is the cleanest proof in mathematics that some infinities are strictly larger than others. List the reals between 0 and 1 however you like; then read straight down the diagonal and build a number nobody listed. Cantor 1874, 1891 — the moment set theory left the nursery.",
    ctaInteractive: "→ Open the Explorer",
  },
  encounter: {
    pretitle: "First encounter",
    title: "Some infinities are bigger than others.",
    cards: [
      {
        label: "01",
        title: "The big idea",
        body: "Infinity is not one thing. ℵ₀ counts the naturals 1, 2, 3, …; the real line carries a strictly larger infinity. Cantor turned the gut feeling «the line is denser than the integers» into a proof.",
      },
      {
        label: "02",
        title: "A concrete example",
        body: "Suppose you list reals in [0,1] as r₁ = 0.1415…, r₂ = 0.2718…, r₃ = 0.5772…, and so on. Walk down the diagonal — pick a different digit at each step — and you have a real that disagrees with every row by construction.",
      },
      {
        label: "03",
        title: "Why it matters",
        body: "Cantor's argument seeded modern set theory, exposed Russell's paradox a decade later, and gave Gödel and Turing the diagonal trick that drives incompleteness and the halting problem. Modern logic stands on it.",
      },
    ],
    tryIt: "Below: build the missing real by hand, then climb the tower of ever-larger infinities.",
  },
  sections: [
    {
      pretitle: "Section 01 · Counting ℕ",
      title: "ℵ₀, the size of 1, 2, 3, …",
      body: "The naturals are the smallest infinite set. Their size is named ℵ₀ — aleph-null — and any set you can label with naturals (the integers, the rationals, all finite strings) has the same size. Countable means «small enough to enumerate».",
    },
    {
      pretitle: "Section 02 · Suppose you could list all reals",
      title: "Any ordering at all — Cantor doesn't mind",
      body: "Assume, for contradiction, the reals in [0,1] are countable: a sequence r₁, r₂, r₃, … containing every real exactly once. The order is yours to choose. Write each row as a decimal expansion 0.d_{n,1} d_{n,2} d_{n,3} … and lay them down as an infinite table.",
    },
    {
      pretitle: "Section 03 · Diagonalise",
      title: "Differ from every row by one digit",
      body: "Read straight down the diagonal: d_{1,1}, d_{2,2}, d_{3,3}, …. Build a new real s whose n-th digit s_n differs from d_{n,n} for every n. A safe recipe swaps each digit for one that isn't 0 or 9 (avoiding the 0.999… = 1.000… ambiguity). By construction s ≠ r_n at the n-th decimal, for every n — yet s is a perfectly good real in [0,1].",
    },
    {
      pretitle: "Section 04 · The reals are uncountable",
      title: "|ℝ| = 2^ℵ₀ = c > ℵ₀",
      body: "The list was supposed to contain every real, and we just built one it missed. The assumption collapses: no enumeration of the reals can be complete. The reals have cardinality c = 2^ℵ₀, strictly larger than ℵ₀. A new kind of infinity, hand-delivered.",
    },
    {
      pretitle: "Section 05 · The continuum hypothesis",
      title: "Is there a size between ℵ₀ and c?",
      body: "Cantor (1878) asked whether any cardinality lives strictly between ℵ₀ and c. Gödel (1940) showed CH cannot be disproved from ZFC; Cohen (1963, Fields medal 1966) showed CH cannot be proved from ZFC. The question is independent of the axioms — formally undecidable, and yet the question remains.",
    },
    {
      pretitle: "Section 06 · The hierarchy",
      title: "ℵ₀ < 2^ℵ₀ < 2^(2^ℵ₀) < ⋯ forever",
      body: "Cantor's theorem says |𝒫(X)| > |X| for every set X — the power set is always strictly larger. Iterating gives an unending ladder of ever-larger infinities: ℵ₀, 2^ℵ₀, 2^(2^ℵ₀), … There is no biggest one.",
    },
  ],
  closingPretitle: "Take it further",
  closingTitle: "Open the Explorer.",
  closingBody:
    "Pick your own listing of reals, watch the diagonal pull a new number out of it, and toggle the digit-swap rule. The contradiction is alive on screen.",
  ctaLabel: "→ Open the Explorer",
  diagonalCaption: "Interactive · the diagonal by hand",
  diagonalRows: "Rows",
  diagonalRandomise: "Randomise list",
  diagonalConstructed: "Constructed real",
  diagonalHint:
    "The amber cells are the digits Cantor reads down the diagonal. The rose row beneath is the new real s — each digit chosen so s differs from row n at the n-th place. No matter which list you tried, s is not in it.",
  diagonalRule: "Rule:",
  diagonalRowLabel: "r",
  diagonalDiagonalLabel: "diagonal digits",
  towerCaption: "Interactive · the tower of infinities",
  towerHint:
    "Cantor's theorem: every set is strictly smaller than its power set. Iterating gives an unending ladder. Click a rung to read what it is.",
  towerExpandHint: "Click any rung to expand.",
  towerOf: "= power set of",
  towerHierarchy: "Hierarchy:",
  towerRungs: [
    {
      pretty: "the naturals · ℕ",
      note: "Aleph-null. The smallest infinity — the size of every countable set.",
    },
    {
      pretty: "the reals · ℝ",
      note: "The continuum c. Cantor 1891 showed this is strictly larger than ℵ₀.",
    },
    {
      pretty: "𝒫(ℝ)",
      note: "Functions ℝ → {0,1}. The power set of the reals — strictly larger again.",
    },
    { pretty: "𝒫(𝒫(ℝ))", note: "And so on. Each level dwarfs the one below." },
    {
      pretty: "𝒫³(ℝ)",
      note: "Three power-set steps over ℝ. The names are still finite; the sizes already aren't.",
    },
    { pretty: "𝒫⁴(ℝ)", note: "Iterate the same rule forever. There is no top floor." },
    { pretty: "𝒫⁵(ℝ)", note: "The cardinals beyond ℵ₀ are themselves an uncountable hierarchy." },
    {
      pretty: "⋯ forever",
      note: "Cantor's theorem guarantees: no matter how high you climb, |𝒫(X)| > |X|.",
    },
  ],
  continuumTitle: "Cardinality of the continuum",
  continuumBody:
    "Strictly larger than ℵ₀, the size of the naturals. The first uncountable infinity mathematics actually hands you.",
  chTitle: "Independence of CH from ZFC",
  chYear: "Year",
  chWho: "Who",
  chResult: "Result",
  chRows: [
    {
      year: "1878",
      who: "Cantor",
      result: "Asks whether any size lives strictly between ℵ₀ and c.",
    },
    { year: "1891", who: "Cantor", result: "Diagonal argument: |ℝ| > |ℕ|." },
    {
      year: "1940",
      who: "Gödel",
      result: "CH cannot be disproved from ZFC (constructible universe L).",
    },
    {
      year: "1963",
      who: "Cohen",
      result: "CH cannot be proved from ZFC (forcing). Fields medal 1966.",
    },
  ],
  chFootnote: "The continuum hypothesis is independent of ZFC: the axioms simply don't decide it.",
};

// ---------------- Deutsch ----------------
const de: RichStory = {
  page: {
    pretitle: "Thema · Paradox",
    title: "Cantors Diagonale",
    tagline: "Unendlichkeit gibt es in Größen.",
    intro:
      "Georg Cantors Diagonalargument von 1891 ist der sauberste Beweis der Mathematik, dass manche Unendlichkeiten strikt größer sind als andere. Liste die reellen Zahlen zwischen 0 und 1 wie du willst — entlang der Diagonale baust du eine Zahl, die niemand gelistet hat. Cantor 1874, 1891 — der Moment, in dem die Mengenlehre die Kinderstube verließ.",
    ctaInteractive: "→ Zum Explorer",
  },
  encounter: {
    pretitle: "Erste Begegnung",
    title: "Manche Unendlichkeiten sind größer als andere.",
    cards: [
      {
        label: "01",
        title: "Die große Idee",
        body: "Unendlichkeit ist nicht eine Sache. ℵ₀ zählt die natürlichen Zahlen 1, 2, 3, …; die reelle Gerade trägt eine strikt größere Unendlichkeit. Cantor machte aus dem Bauchgefühl «die Gerade ist dichter als die Ganzen» einen Beweis.",
      },
      {
        label: "02",
        title: "Ein konkretes Beispiel",
        body: "Liste die reellen Zahlen in [0,1] etwa als r₁ = 0,1415…, r₂ = 0,2718…, r₃ = 0,5772…, und so weiter. Wander die Diagonale entlang und wähl jedes Mal eine andere Ziffer — und du hast eine reelle Zahl, die sich von jeder Zeile per Konstruktion unterscheidet.",
      },
      {
        label: "03",
        title: "Warum es zählt",
        body: "Cantors Argument legte den Grund moderner Mengenlehre, machte zehn Jahre später Russells Paradox sichtbar und gab Gödel und Turing den Diagonaltrick, der Unvollständigkeit und Halteproblem antreibt. Auf ihm steht die moderne Logik.",
      },
    ],
    tryIt:
      "Unten: bau die fehlende Zahl selbst, dann steig die Leiter immer größerer Unendlichkeiten hinauf.",
  },
  sections: [
    {
      pretitle: "Abschnitt 01 · ℕ zählen",
      title: "ℵ₀, die Größe von 1, 2, 3, …",
      body: "Die natürlichen Zahlen sind die kleinste unendliche Menge. Ihre Größe heißt ℵ₀ — aleph-null — und jede Menge, die du mit den Natürlichen abzählen kannst (die Ganzen, die Rationalen, alle endlichen Wörter), hat dieselbe Größe. Abzählbar heißt: klein genug zum Aufzählen.",
    },
    {
      pretitle: "Abschnitt 02 · Nimm an, du listest alle reellen Zahlen",
      title: "Egal in welcher Reihenfolge",
      body: "Wir nehmen widerspruchshalber an, die reellen Zahlen in [0,1] seien abzählbar: eine Folge r₁, r₂, r₃, …, in der jede reelle Zahl genau einmal vorkommt. Die Reihenfolge bestimmst du. Schreib jede Zeile als Dezimalentwicklung 0,d_{n,1} d_{n,2} d_{n,3} … und leg sie als unendliche Tabelle aus.",
    },
    {
      pretitle: "Abschnitt 03 · Diagonalisieren",
      title: "Unterschied zu jeder Zeile in einer Stelle",
      body: "Lies entlang der Diagonale: d_{1,1}, d_{2,2}, d_{3,3}, …. Bau eine neue reelle Zahl s, deren n-te Ziffer s_n sich von d_{n,n} unterscheidet — für jedes n. Ein sicherer Trick: tausch jede Ziffer gegen eine, die nicht 0 oder 9 ist (um die Mehrdeutigkeit 0,999… = 1,000… zu vermeiden). Per Konstruktion gilt s ≠ r_n an der n-ten Stelle — und doch ist s eine vollkommen reguläre reelle Zahl in [0,1].",
    },
    {
      pretitle: "Abschnitt 04 · Die Reellen sind überabzählbar",
      title: "|ℝ| = 2^ℵ₀ = c > ℵ₀",
      body: "Die Liste sollte jede reelle Zahl enthalten, und wir haben gerade eine gebaut, die ihr entging. Die Annahme bricht zusammen: keine Aufzählung der reellen Zahlen kann vollständig sein. Die Reellen haben Mächtigkeit c = 2^ℵ₀, strikt größer als ℵ₀. Eine neue Art von Unendlichkeit, frisch ausgeliefert.",
    },
    {
      pretitle: "Abschnitt 05 · Die Kontinuumshypothese",
      title: "Gibt es eine Größe zwischen ℵ₀ und c?",
      body: "Cantor fragte (1878), ob irgendeine Mächtigkeit strikt zwischen ℵ₀ und c liegt. Gödel (1940) zeigte: CH lässt sich aus ZFC nicht widerlegen; Cohen (1963, Fields-Medaille 1966) zeigte: CH lässt sich aus ZFC nicht beweisen. Die Frage ist unabhängig von den Axiomen — formell unentscheidbar, und doch bleibt sie stehen.",
    },
    {
      pretitle: "Abschnitt 06 · Die Hierarchie",
      title: "ℵ₀ < 2^ℵ₀ < 2^(2^ℵ₀) < ⋯ für immer",
      body: "Cantors Satz sagt: |𝒫(X)| > |X| für jede Menge X — die Potenzmenge ist immer strikt größer. Iterieren liefert eine endlose Leiter immer größerer Unendlichkeiten: ℵ₀, 2^ℵ₀, 2^(2^ℵ₀), … Es gibt keine größte.",
    },
  ],
  closingPretitle: "Geh weiter",
  closingTitle: "Öffne den Explorer.",
  closingBody:
    "Wähl deine eigene Liste reeller Zahlen, sieh die Diagonale eine neue herausziehen und schalte die Ziffern-Tausch-Regel um. Der Widerspruch lebt auf dem Bildschirm.",
  ctaLabel: "→ Zum Explorer",
  diagonalCaption: "Interaktiv · die Diagonale per Hand",
  diagonalRows: "Zeilen",
  diagonalRandomise: "Liste mischen",
  diagonalConstructed: "Konstruierte reelle Zahl",
  diagonalHint:
    "Die bernsteinfarbenen Felder sind die Ziffern, die Cantor entlang der Diagonale liest. Die rosa Zeile darunter ist die neue reelle Zahl s — jede Ziffer so gewählt, dass s sich von Zeile n an der n-ten Stelle unterscheidet. Egal welche Liste du probierst, s ist nicht darin.",
  diagonalRule: "Regel:",
  diagonalRowLabel: "r",
  diagonalDiagonalLabel: "Diagonalziffern",
  towerCaption: "Interaktiv · der Turm der Unendlichkeiten",
  towerHint:
    "Cantors Satz: jede Menge ist strikt kleiner als ihre Potenzmenge. Iterieren liefert eine endlose Leiter. Klick eine Sprosse, um zu lesen, was sie ist.",
  towerExpandHint: "Klick eine Sprosse, um sie auszuklappen.",
  towerOf: "= Potenzmenge von",
  towerHierarchy: "Hierarchie:",
  towerRungs: [
    {
      pretty: "die Natürlichen · ℕ",
      note: "Aleph-null. Die kleinste Unendlichkeit — die Größe jeder abzählbaren Menge.",
    },
    {
      pretty: "die Reellen · ℝ",
      note: "Das Kontinuum c. Cantor 1891 zeigte: strikt größer als ℵ₀.",
    },
    {
      pretty: "𝒫(ℝ)",
      note: "Funktionen ℝ → {0,1}. Die Potenzmenge der Reellen, wieder strikt größer.",
    },
    { pretty: "𝒫(𝒫(ℝ))", note: "Und so weiter. Jede Stufe lässt die vorherige verschwinden." },
    {
      pretty: "𝒫³(ℝ)",
      note: "Drei Potenzmengen-Schritte über ℝ. Die Namen sind noch endlich; die Größen längst nicht mehr.",
    },
    { pretty: "𝒫⁴(ℝ)", note: "Iterier dieselbe Regel für immer. Es gibt kein oberstes Stockwerk." },
    {
      pretty: "𝒫⁵(ℝ)",
      note: "Die Kardinalzahlen jenseits von ℵ₀ bilden selbst eine überabzählbare Hierarchie.",
    },
    {
      pretty: "⋯ für immer",
      note: "Cantors Satz garantiert: egal wie hoch du steigst, |𝒫(X)| > |X|.",
    },
  ],
  continuumTitle: "Mächtigkeit des Kontinuums",
  continuumBody:
    "Strikt größer als ℵ₀, die Größe der Natürlichen. Die erste überabzählbare Unendlichkeit, die die Mathematik dir tatsächlich in die Hand gibt.",
  chTitle: "Unabhängigkeit von CH von ZFC",
  chYear: "Jahr",
  chWho: "Wer",
  chResult: "Ergebnis",
  chRows: [
    { year: "1878", who: "Cantor", result: "Fragt, ob eine Größe strikt zwischen ℵ₀ und c liegt." },
    { year: "1891", who: "Cantor", result: "Diagonalargument: |ℝ| > |ℕ|." },
    {
      year: "1940",
      who: "Gödel",
      result: "CH lässt sich aus ZFC nicht widerlegen (konstruierbares Universum L).",
    },
    {
      year: "1963",
      who: "Cohen",
      result: "CH lässt sich aus ZFC nicht beweisen (Forcing). Fields-Medaille 1966.",
    },
  ],
  chFootnote:
    "Die Kontinuumshypothese ist unabhängig von ZFC: die Axiome entscheiden sie schlicht nicht.",
};

// ---------------- Español ----------------
const es: RichStory = {
  page: {
    pretitle: "Tema · Paradoja",
    title: "La diagonal de Cantor",
    tagline: "El infinito viene en tamaños.",
    intro:
      "El argumento diagonal de 1891 de Georg Cantor es la prueba más limpia en matemáticas de que algunos infinitos son estrictamente mayores que otros. Lista los reales entre 0 y 1 como quieras; baja por la diagonal y construye un número que nadie listó. Cantor 1874, 1891 — el momento en que la teoría de conjuntos salió de la cuna.",
    ctaInteractive: "→ Abrir el Explorador",
  },
  encounter: {
    pretitle: "Primer encuentro",
    title: "Algunos infinitos son mayores que otros.",
    cards: [
      {
        label: "01",
        title: "La gran idea",
        body: "El infinito no es una sola cosa. ℵ₀ cuenta los naturales 1, 2, 3, …; la recta real lleva un infinito estrictamente mayor. Cantor convirtió la intuición «la recta es más densa que los enteros» en una demostración.",
      },
      {
        label: "02",
        title: "Un ejemplo concreto",
        body: "Supón que listas los reales en [0,1] como r₁ = 0,1415…, r₂ = 0,2718…, r₃ = 0,5772…, y así sucesivamente. Baja por la diagonal eligiendo un dígito distinto en cada paso y tendrás un real que difiere de cada fila por construcción.",
      },
      {
        label: "03",
        title: "Por qué importa",
        body: "El argumento de Cantor sembró la teoría de conjuntos moderna, hizo aflorar la paradoja de Russell una década después y dio a Gödel y Turing el truco diagonal que mueve la incompletitud y el problema de la parada. La lógica moderna se apoya en él.",
      },
    ],
    tryIt:
      "Abajo: construye el real que falta a mano y sube luego la torre de infinitos cada vez mayores.",
  },
  sections: [
    {
      pretitle: "Sección 01 · Contar ℕ",
      title: "ℵ₀, el tamaño de 1, 2, 3, …",
      body: "Los naturales son el conjunto infinito más pequeño. Su tamaño se llama ℵ₀ — aleph cero — y todo conjunto que puedas etiquetar con naturales (los enteros, los racionales, las cadenas finitas) tiene el mismo tamaño. Numerable significa «lo bastante pequeño para enumerarse».",
    },
    {
      pretitle: "Sección 02 · Supón que pudieras listar todos los reales",
      title: "El orden lo eliges tú",
      body: "Supón, por contradicción, que los reales en [0,1] son numerables: una sucesión r₁, r₂, r₃, … que contiene cada real exactamente una vez. El orden lo eliges tú. Escribe cada fila como expansión decimal 0,d_{n,1} d_{n,2} d_{n,3} … y dispónlas como una tabla infinita.",
    },
    {
      pretitle: "Sección 03 · Diagonalizar",
      title: "Diferir de cada fila en un dígito",
      body: "Baja por la diagonal: d_{1,1}, d_{2,2}, d_{3,3}, …. Construye un nuevo real s cuyo n-ésimo dígito s_n sea distinto de d_{n,n} para todo n. Una receta segura: cambia cada dígito por otro que no sea 0 ni 9 (para esquivar la ambigüedad 0,999… = 1,000…). Por construcción s ≠ r_n en el n-ésimo decimal, para todo n — y aun así s es un real perfectamente bueno en [0,1].",
    },
    {
      pretitle: "Sección 04 · Los reales son no numerables",
      title: "|ℝ| = 2^ℵ₀ = c > ℵ₀",
      body: "Se suponía que la lista contenía todos los reales, y acabamos de construir uno que se saltó. La hipótesis cae: ninguna enumeración de los reales puede ser completa. Los reales tienen cardinalidad c = 2^ℵ₀, estrictamente mayor que ℵ₀. Un nuevo tipo de infinito, servido en bandeja.",
    },
    {
      pretitle: "Sección 05 · La hipótesis del continuo",
      title: "¿Hay un tamaño entre ℵ₀ y c?",
      body: "Cantor (1878) preguntó si alguna cardinalidad vive estrictamente entre ℵ₀ y c. Gödel (1940) mostró que CH no se puede refutar desde ZFC; Cohen (1963, medalla Fields 1966) mostró que CH no se puede probar desde ZFC. La pregunta es independiente de los axiomas — formalmente indecidible — y, aun así, sigue ahí.",
    },
    {
      pretitle: "Sección 06 · La jerarquía",
      title: "ℵ₀ < 2^ℵ₀ < 2^(2^ℵ₀) < ⋯ para siempre",
      body: "El teorema de Cantor dice |𝒫(X)| > |X| para todo conjunto X — el conjunto de partes es siempre estrictamente mayor. Iterando se obtiene una escalera sin fin de infinitos cada vez mayores: ℵ₀, 2^ℵ₀, 2^(2^ℵ₀), … No hay un máximo.",
    },
  ],
  closingPretitle: "Ve más lejos",
  closingTitle: "Abre el Explorador.",
  closingBody:
    "Elige tu propio listado de reales, mira cómo la diagonal saca un número nuevo y alterna la regla de cambio de dígito. La contradicción está viva en pantalla.",
  ctaLabel: "→ Abrir el Explorador",
  diagonalCaption: "Interactivo · la diagonal a mano",
  diagonalRows: "Filas",
  diagonalRandomise: "Mezclar lista",
  diagonalConstructed: "Real construido",
  diagonalHint:
    "Las casillas ámbar son los dígitos que Cantor lee bajando por la diagonal. La fila rosa de abajo es el nuevo real s — cada dígito elegido para que s difiera de la fila n en la n-ésima posición. No importa qué lista probaras, s no está en ella.",
  diagonalRule: "Regla:",
  diagonalRowLabel: "r",
  diagonalDiagonalLabel: "dígitos diagonales",
  towerCaption: "Interactivo · la torre de infinitos",
  towerHint:
    "Teorema de Cantor: todo conjunto es estrictamente menor que su conjunto de partes. Iterando se obtiene una escalera sin fin. Haz clic en un peldaño para leer qué es.",
  towerExpandHint: "Haz clic en cualquier peldaño para desplegarlo.",
  towerOf: "= partes de",
  towerHierarchy: "Jerarquía:",
  towerRungs: [
    {
      pretty: "los naturales · ℕ",
      note: "Aleph cero. El infinito más pequeño — el tamaño de todo conjunto numerable.",
    },
    { pretty: "los reales · ℝ", note: "El continuo c. Cantor 1891: estrictamente mayor que ℵ₀." },
    {
      pretty: "𝒫(ℝ)",
      note: "Funciones ℝ → {0,1}. El conjunto de partes de los reales — otra vez estrictamente mayor.",
    },
    { pretty: "𝒫(𝒫(ℝ))", note: "Y así sucesivamente. Cada nivel empequeñece al anterior." },
    {
      pretty: "𝒫³(ℝ)",
      note: "Tres pasos de partes sobre ℝ. Los nombres aún son finitos; los tamaños ya no.",
    },
    { pretty: "𝒫⁴(ℝ)", note: "Itera la misma regla para siempre. No hay último piso." },
    {
      pretty: "𝒫⁵(ℝ)",
      note: "Los cardinales más allá de ℵ₀ forman ellos mismos una jerarquía no numerable.",
    },
    {
      pretty: "⋯ para siempre",
      note: "El teorema de Cantor garantiza: por alto que subas, |𝒫(X)| > |X|.",
    },
  ],
  continuumTitle: "Cardinalidad del continuo",
  continuumBody:
    "Estrictamente mayor que ℵ₀, el tamaño de los naturales. El primer infinito no numerable que las matemáticas te entregan de verdad.",
  chTitle: "Independencia de CH respecto de ZFC",
  chYear: "Año",
  chWho: "Quién",
  chResult: "Resultado",
  chRows: [
    {
      year: "1878",
      who: "Cantor",
      result: "Pregunta si algún tamaño vive estrictamente entre ℵ₀ y c.",
    },
    { year: "1891", who: "Cantor", result: "Argumento diagonal: |ℝ| > |ℕ|." },
    {
      year: "1940",
      who: "Gödel",
      result: "CH no puede refutarse desde ZFC (universo construible L).",
    },
    {
      year: "1963",
      who: "Cohen",
      result: "CH no puede probarse desde ZFC (forcing). Medalla Fields 1966.",
    },
  ],
  chFootnote:
    "La hipótesis del continuo es independiente de ZFC: los axiomas simplemente no la deciden.",
};

// ---------------- Français ----------------
const fr: RichStory = {
  page: {
    pretitle: "Sujet · Paradoxe",
    title: "La diagonale de Cantor",
    tagline: "L'infini a des tailles.",
    intro:
      "L'argument diagonal de 1891 de Georg Cantor est la preuve la plus nette en mathématiques que certaines infinités sont strictement plus grandes que d'autres. Énumère les réels entre 0 et 1 comme tu veux ; descends la diagonale et construis un nombre que personne n'a listé. Cantor 1874, 1891 — le moment où la théorie des ensembles a quitté l'enfance.",
    ctaInteractive: "→ Ouvrir l'Explorateur",
  },
  encounter: {
    pretitle: "Première rencontre",
    title: "Certaines infinités sont plus grandes que d'autres.",
    cards: [
      {
        label: "01",
        title: "L'idée centrale",
        body: "L'infini n'est pas une seule chose. ℵ₀ compte les naturels 1, 2, 3, … ; la droite réelle porte une infinité strictement plus grande. Cantor a transformé l'intuition «la droite est plus dense que les entiers» en démonstration.",
      },
      {
        label: "02",
        title: "Un exemple concret",
        body: "Suppose que tu listes les réels de [0,1] comme r₁ = 0,1415…, r₂ = 0,2718…, r₃ = 0,5772…, et ainsi de suite. Descends la diagonale en choisissant un chiffre différent à chaque pas et tu obtiens un réel qui désaccorde avec chaque ligne par construction.",
      },
      {
        label: "03",
        title: "Pourquoi ça compte",
        body: "L'argument de Cantor a semé la théorie des ensembles moderne, exposé le paradoxe de Russell dix ans plus tard et donné à Gödel et Turing l'astuce diagonale qui anime l'incomplétude et le problème de l'arrêt. La logique moderne s'y appuie.",
      },
    ],
    tryIt:
      "Ci-dessous : construis le réel manquant à la main, puis grimpe la tour d'infinités toujours plus grandes.",
  },
  sections: [
    {
      pretitle: "Section 01 · Compter ℕ",
      title: "ℵ₀, la taille de 1, 2, 3, …",
      body: "Les naturels sont le plus petit ensemble infini. Leur taille s'appelle ℵ₀ — aleph-zéro — et tout ensemble que tu peux étiqueter avec les naturels (les entiers, les rationnels, les chaînes finies) a la même taille. Dénombrable veut dire «assez petit pour être énuméré».",
    },
    {
      pretitle: "Section 02 · Suppose que tu listes tous les réels",
      title: "Dans l'ordre que tu veux",
      body: "Suppose, par l'absurde, que les réels de [0,1] soient dénombrables : une suite r₁, r₂, r₃, … contenant chaque réel exactement une fois. L'ordre est à toi. Écris chaque ligne comme un développement décimal 0,d_{n,1} d_{n,2} d_{n,3} … et range-les en tableau infini.",
    },
    {
      pretitle: "Section 03 · Diagonaliser",
      title: "Différer de chaque ligne d'un chiffre",
      body: "Lis le long de la diagonale : d_{1,1}, d_{2,2}, d_{3,3}, …. Construis un nouveau réel s dont le n-ième chiffre s_n diffère de d_{n,n} pour tout n. Une recette sûre : remplace chaque chiffre par un autre qui n'est ni 0 ni 9 (pour éviter l'ambiguïté 0,999… = 1,000…). Par construction s ≠ r_n au n-ième décimal, pour tout n — et pourtant s est un réel parfaitement valable de [0,1].",
    },
    {
      pretitle: "Section 04 · Les réels sont indénombrables",
      title: "|ℝ| = 2^ℵ₀ = c > ℵ₀",
      body: "La liste était censée contenir tous les réels, et on vient d'en construire un qu'elle a manqué. L'hypothèse s'effondre : aucune énumération des réels ne peut être complète. Les réels ont cardinalité c = 2^ℵ₀, strictement plus grande que ℵ₀. Une nouvelle espèce d'infini, livrée à domicile.",
    },
    {
      pretitle: "Section 05 · L'hypothèse du continu",
      title: "Existe-t-il une taille entre ℵ₀ et c ?",
      body: "Cantor (1878) demanda si une cardinalité vit strictement entre ℵ₀ et c. Gödel (1940) montra que CH ne peut être réfutée depuis ZFC ; Cohen (1963, médaille Fields 1966) montra que CH ne peut être démontrée depuis ZFC. La question est indépendante des axiomes — formellement indécidable, et pourtant la question demeure.",
    },
    {
      pretitle: "Section 06 · La hiérarchie",
      title: "ℵ₀ < 2^ℵ₀ < 2^(2^ℵ₀) < ⋯ pour toujours",
      body: "Le théorème de Cantor dit |𝒫(X)| > |X| pour tout ensemble X — l'ensemble des parties est toujours strictement plus grand. En itérant, on obtient une échelle sans fin d'infinités toujours plus grandes : ℵ₀, 2^ℵ₀, 2^(2^ℵ₀), … Il n'y a pas de plus grande.",
    },
  ],
  closingPretitle: "Aller plus loin",
  closingTitle: "Ouvre l'Explorateur.",
  closingBody:
    "Choisis ta propre liste de réels, regarde la diagonale en extraire un nouveau et bascule la règle d'échange de chiffres. La contradiction vit à l'écran.",
  ctaLabel: "→ Ouvrir l'Explorateur",
  diagonalCaption: "Interactif · la diagonale à la main",
  diagonalRows: "Lignes",
  diagonalRandomise: "Mélanger la liste",
  diagonalConstructed: "Réel construit",
  diagonalHint:
    "Les cases ambre sont les chiffres que Cantor lit le long de la diagonale. La ligne rose en dessous est le nouveau réel s — chaque chiffre choisi pour que s diffère de la ligne n à la n-ième position. Quelle que soit la liste essayée, s n'y est pas.",
  diagonalRule: "Règle :",
  diagonalRowLabel: "r",
  diagonalDiagonalLabel: "chiffres diagonaux",
  towerCaption: "Interactif · la tour des infinités",
  towerHint:
    "Théorème de Cantor : tout ensemble est strictement plus petit que son ensemble des parties. En itérant, on obtient une échelle sans fin. Clique un barreau pour lire ce qu'il est.",
  towerExpandHint: "Clique sur n'importe quel barreau pour le déplier.",
  towerOf: "= parties de",
  towerHierarchy: "Hiérarchie :",
  towerRungs: [
    {
      pretty: "les naturels · ℕ",
      note: "Aleph-zéro. La plus petite infinité — la taille de tout ensemble dénombrable.",
    },
    { pretty: "les réels · ℝ", note: "Le continu c. Cantor 1891 : strictement plus grand que ℵ₀." },
    {
      pretty: "𝒫(ℝ)",
      note: "Fonctions ℝ → {0,1}. L'ensemble des parties des réels — encore strictement plus grand.",
    },
    { pretty: "𝒫(𝒫(ℝ))", note: "Et ainsi de suite. Chaque niveau écrase celui d'en dessous." },
    {
      pretty: "𝒫³(ℝ)",
      note: "Trois passages à l'ensemble des parties au-dessus de ℝ. Les noms restent finis ; les tailles non.",
    },
    { pretty: "𝒫⁴(ℝ)", note: "Itère la même règle pour toujours. Pas d'étage supérieur." },
    {
      pretty: "𝒫⁵(ℝ)",
      note: "Les cardinaux au-delà de ℵ₀ forment eux-mêmes une hiérarchie indénombrable.",
    },
    {
      pretty: "⋯ pour toujours",
      note: "Le théorème de Cantor garantit : aussi haut que tu montes, |𝒫(X)| > |X|.",
    },
  ],
  continuumTitle: "Cardinalité du continu",
  continuumBody:
    "Strictement plus grande que ℵ₀, la taille des naturels. La première infinité indénombrable que les mathématiques te livrent vraiment.",
  chTitle: "Indépendance de CH vis-à-vis de ZFC",
  chYear: "Année",
  chWho: "Qui",
  chResult: "Résultat",
  chRows: [
    { year: "1878", who: "Cantor", result: "Demande si une taille vit strictement entre ℵ₀ et c." },
    { year: "1891", who: "Cantor", result: "Argument diagonal : |ℝ| > |ℕ|." },
    {
      year: "1940",
      who: "Gödel",
      result: "CH ne peut être réfutée depuis ZFC (univers constructible L).",
    },
    {
      year: "1963",
      who: "Cohen",
      result: "CH ne peut être démontrée depuis ZFC (forcing). Médaille Fields 1966.",
    },
  ],
  chFootnote:
    "L'hypothèse du continu est indépendante de ZFC : les axiomes ne la décident tout simplement pas.",
};

// ---------------- Italiano ----------------
const it: RichStory = {
  page: {
    pretitle: "Tema · Paradosso",
    title: "La diagonale di Cantor",
    tagline: "L'infinito ha taglie diverse.",
    intro:
      "L'argomento diagonale del 1891 di Georg Cantor è la dimostrazione più pulita in matematica del fatto che alcuni infiniti sono strettamente più grandi di altri. Elenca i reali tra 0 e 1 come vuoi; scendi lungo la diagonale e costruisci un numero che nessuno ha elencato. Cantor 1874, 1891 — il momento in cui la teoria degli insiemi è uscita dalla nursery.",
    ctaInteractive: "→ Apri l'Esploratore",
  },
  encounter: {
    pretitle: "Primo incontro",
    title: "Alcuni infiniti sono più grandi di altri.",
    cards: [
      {
        label: "01",
        title: "L'idea centrale",
        body: "L'infinito non è una sola cosa. ℵ₀ conta i naturali 1, 2, 3, …; la retta reale porta un infinito strettamente più grande. Cantor ha trasformato l'intuizione «la retta è più densa degli interi» in dimostrazione.",
      },
      {
        label: "02",
        title: "Un esempio concreto",
        body: "Supponi di elencare i reali in [0,1] come r₁ = 0,1415…, r₂ = 0,2718…, r₃ = 0,5772…, e così via. Scendi lungo la diagonale scegliendo a ogni passo una cifra diversa e ottieni un reale che, per costruzione, differisce da ogni riga.",
      },
      {
        label: "03",
        title: "Perché conta",
        body: "L'argomento di Cantor ha posto le fondamenta della teoria degli insiemi moderna, fatto emergere il paradosso di Russell dieci anni dopo e dato a Gödel e Turing il trucco diagonale che alimenta incompletezza e problema della fermata. La logica moderna ci si appoggia.",
      },
    ],
    tryIt:
      "Sotto: costruisci il reale mancante a mano, poi sali la torre di infiniti sempre più grandi.",
  },
  sections: [
    {
      pretitle: "Sezione 01 · Contare ℕ",
      title: "ℵ₀, la taglia di 1, 2, 3, …",
      body: "I naturali sono il più piccolo insieme infinito. La loro taglia si chiama ℵ₀ — aleph-zero — e ogni insieme etichettabile con i naturali (gli interi, i razionali, le stringhe finite) ha la stessa taglia. Numerabile vuol dire «abbastanza piccolo da essere elencato».",
    },
    {
      pretitle: "Sezione 02 · Supponi di elencare tutti i reali",
      title: "Nell'ordine che vuoi",
      body: "Supponi, per assurdo, che i reali in [0,1] siano numerabili: una successione r₁, r₂, r₃, … che contiene ogni reale esattamente una volta. L'ordine è tuo. Scrivi ogni riga come sviluppo decimale 0,d_{n,1} d_{n,2} d_{n,3} … e disponile come tabella infinita.",
    },
    {
      pretitle: "Sezione 03 · Diagonalizzare",
      title: "Differire da ogni riga in una cifra",
      body: "Leggi lungo la diagonale: d_{1,1}, d_{2,2}, d_{3,3}, …. Costruisci un nuovo reale s la cui n-esima cifra s_n differisca da d_{n,n} per ogni n. Una ricetta sicura: sostituisci ogni cifra con un'altra che non sia 0 né 9 (per evitare l'ambiguità 0,999… = 1,000…). Per costruzione s ≠ r_n alla n-esima cifra, per ogni n — eppure s è un reale del tutto regolare in [0,1].",
    },
    {
      pretitle: "Sezione 04 · I reali sono non numerabili",
      title: "|ℝ| = 2^ℵ₀ = c > ℵ₀",
      body: "L'elenco doveva contenere ogni reale, e ne abbiamo appena costruito uno che gli è sfuggito. L'ipotesi crolla: nessuna enumerazione dei reali può essere completa. I reali hanno cardinalità c = 2^ℵ₀, strettamente maggiore di ℵ₀. Una nuova specie di infinito, consegnata a domicilio.",
    },
    {
      pretitle: "Sezione 05 · L'ipotesi del continuo",
      title: "Esiste una taglia tra ℵ₀ e c?",
      body: "Cantor (1878) chiese se una cardinalità vivesse strettamente tra ℵ₀ e c. Gödel (1940) mostrò che CH non può essere confutata in ZFC; Cohen (1963, medaglia Fields 1966) mostrò che CH non può essere dimostrata in ZFC. La domanda è indipendente dagli assiomi — formalmente indecidibile — e nonostante questo resta lì.",
    },
    {
      pretitle: "Sezione 06 · La gerarchia",
      title: "ℵ₀ < 2^ℵ₀ < 2^(2^ℵ₀) < ⋯ per sempre",
      body: "Il teorema di Cantor dice |𝒫(X)| > |X| per ogni insieme X — l'insieme delle parti è sempre strettamente più grande. Iterando si ottiene una scala senza fine di infiniti sempre più grandi: ℵ₀, 2^ℵ₀, 2^(2^ℵ₀), … Non c'è un massimo.",
    },
  ],
  closingPretitle: "Vai oltre",
  closingTitle: "Apri l'Esploratore.",
  closingBody:
    "Scegli il tuo elenco di reali, guarda la diagonale tirar fuori un nuovo numero e cambia la regola di scambio cifra. La contraddizione vive sullo schermo.",
  ctaLabel: "→ Apri l'Esploratore",
  diagonalCaption: "Interattivo · la diagonale a mano",
  diagonalRows: "Righe",
  diagonalRandomise: "Mescola lista",
  diagonalConstructed: "Reale costruito",
  diagonalHint:
    "Le caselle ambra sono le cifre che Cantor legge scendendo lungo la diagonale. La riga rosa sotto è il nuovo reale s — ogni cifra scelta perché s differisca dalla riga n alla n-esima posizione. Qualunque elenco tu provi, s non c'è.",
  diagonalRule: "Regola:",
  diagonalRowLabel: "r",
  diagonalDiagonalLabel: "cifre diagonali",
  towerCaption: "Interattivo · la torre degli infiniti",
  towerHint:
    "Teorema di Cantor: ogni insieme è strettamente più piccolo del suo insieme delle parti. Iterando si ottiene una scala senza fine. Clicca un piolo per leggerne il significato.",
  towerExpandHint: "Clicca un qualsiasi piolo per aprirlo.",
  towerOf: "= parti di",
  towerHierarchy: "Gerarchia:",
  towerRungs: [
    {
      pretty: "i naturali · ℕ",
      note: "Aleph-zero. L'infinito più piccolo — la taglia di ogni insieme numerabile.",
    },
    { pretty: "i reali · ℝ", note: "Il continuo c. Cantor 1891: strettamente più grande di ℵ₀." },
    {
      pretty: "𝒫(ℝ)",
      note: "Funzioni ℝ → {0,1}. L'insieme delle parti dei reali — di nuovo strettamente più grande.",
    },
    { pretty: "𝒫(𝒫(ℝ))", note: "E così via. Ogni livello fa impallidire il precedente." },
    {
      pretty: "𝒫³(ℝ)",
      note: "Tre passi di parti sopra ℝ. I nomi sono ancora finiti; le taglie non più.",
    },
    { pretty: "𝒫⁴(ℝ)", note: "Itera la stessa regola per sempre. Non c'è ultimo piano." },
    {
      pretty: "𝒫⁵(ℝ)",
      note: "I cardinali oltre ℵ₀ formano essi stessi una gerarchia non numerabile.",
    },
    {
      pretty: "⋯ per sempre",
      note: "Il teorema di Cantor garantisce: a qualunque altezza, |𝒫(X)| > |X|.",
    },
  ],
  continuumTitle: "Cardinalità del continuo",
  continuumBody:
    "Strettamente maggiore di ℵ₀, la taglia dei naturali. Il primo infinito non numerabile che la matematica ti consegna davvero.",
  chTitle: "Indipendenza di CH da ZFC",
  chYear: "Anno",
  chWho: "Chi",
  chResult: "Risultato",
  chRows: [
    { year: "1878", who: "Cantor", result: "Chiede se una taglia viva strettamente tra ℵ₀ e c." },
    { year: "1891", who: "Cantor", result: "Argomento diagonale: |ℝ| > |ℕ|." },
    {
      year: "1940",
      who: "Gödel",
      result: "CH non può essere confutata in ZFC (universo costruibile L).",
    },
    {
      year: "1963",
      who: "Cohen",
      result: "CH non può essere dimostrata in ZFC (forcing). Medaglia Fields 1966.",
    },
  ],
  chFootnote:
    "L'ipotesi del continuo è indipendente da ZFC: gli assiomi semplicemente non la decidono.",
};

// ---------------- Português ----------------
const pt: RichStory = {
  page: {
    pretitle: "Tópico · Paradoxo",
    title: "A diagonal de Cantor",
    tagline: "O infinito tem tamanhos.",
    intro:
      "O argumento diagonal de 1891 de Georg Cantor é a prova mais limpa em matemática de que alguns infinitos são estritamente maiores que outros. Lista os reais entre 0 e 1 como quiseres; desce pela diagonal e constrói um número que ninguém listou. Cantor 1874, 1891 — o momento em que a teoria dos conjuntos saiu do berço.",
    ctaInteractive: "→ Abrir o Explorador",
  },
  encounter: {
    pretitle: "Primeiro encontro",
    title: "Alguns infinitos são maiores que outros.",
    cards: [
      {
        label: "01",
        title: "A ideia central",
        body: "O infinito não é uma única coisa. ℵ₀ conta os naturais 1, 2, 3, …; a recta real carrega um infinito estritamente maior. Cantor transformou a intuição «a recta é mais densa que os inteiros» em demonstração.",
      },
      {
        label: "02",
        title: "Um exemplo concreto",
        body: "Supõe que listas os reais em [0,1] como r₁ = 0,1415…, r₂ = 0,2718…, r₃ = 0,5772…, e por aí fora. Desce pela diagonal escolhendo um dígito diferente em cada passo e tens um real que, por construção, discorda de cada linha.",
      },
      {
        label: "03",
        title: "Porque importa",
        body: "O argumento de Cantor semeou a teoria dos conjuntos moderna, fez emergir o paradoxo de Russell uma década depois e deu a Gödel e Turing o truque diagonal que move a incompletude e o problema da paragem. A lógica moderna apoia-se nele.",
      },
    ],
    tryIt:
      "Abaixo: constrói o real em falta à mão e sobe depois a torre de infinitos cada vez maiores.",
  },
  sections: [
    {
      pretitle: "Secção 01 · Contar ℕ",
      title: "ℵ₀, o tamanho de 1, 2, 3, …",
      body: "Os naturais são o menor conjunto infinito. O seu tamanho chama-se ℵ₀ — aleph-zero — e qualquer conjunto etiquetável com naturais (os inteiros, os racionais, as cadeias finitas) tem o mesmo tamanho. Numerável quer dizer «pequeno o suficiente para se enumerar».",
    },
    {
      pretitle: "Secção 02 · Supõe que pudesses listar todos os reais",
      title: "Na ordem que quiseres",
      body: "Supõe, por absurdo, que os reais em [0,1] são numeráveis: uma sucessão r₁, r₂, r₃, … contendo cada real exactamente uma vez. A ordem é tua. Escreve cada linha como expansão decimal 0,d_{n,1} d_{n,2} d_{n,3} … e dispõe-nas como tabela infinita.",
    },
    {
      pretitle: "Secção 03 · Diagonalizar",
      title: "Diferir de cada linha num dígito",
      body: "Lê pela diagonal: d_{1,1}, d_{2,2}, d_{3,3}, …. Constrói um novo real s cujo n-ésimo dígito s_n difira de d_{n,n} para todo n. Receita segura: troca cada dígito por outro que não seja 0 nem 9 (para evitar a ambiguidade 0,999… = 1,000…). Por construção s ≠ r_n na n-ésima casa decimal, para todo n — mas s é um real perfeitamente bem comportado em [0,1].",
    },
    {
      pretitle: "Secção 04 · Os reais são não-numeráveis",
      title: "|ℝ| = 2^ℵ₀ = c > ℵ₀",
      body: "A lista devia conter cada real e acabámos de construir um que lhe escapou. A hipótese cai: nenhuma enumeração dos reais pode estar completa. Os reais têm cardinalidade c = 2^ℵ₀, estritamente maior que ℵ₀. Uma nova espécie de infinito, entregue em mão.",
    },
    {
      pretitle: "Secção 05 · A hipótese do contínuo",
      title: "Existe um tamanho entre ℵ₀ e c?",
      body: "Cantor (1878) perguntou se alguma cardinalidade vive estritamente entre ℵ₀ e c. Gödel (1940) mostrou que CH não pode ser refutada em ZFC; Cohen (1963, medalha Fields 1966) mostrou que CH não pode ser provada em ZFC. A pergunta é independente dos axiomas — formalmente indecidível — e ainda assim continua aberta.",
    },
    {
      pretitle: "Secção 06 · A hierarquia",
      title: "ℵ₀ < 2^ℵ₀ < 2^(2^ℵ₀) < ⋯ para sempre",
      body: "O teorema de Cantor diz |𝒫(X)| > |X| para todo conjunto X — o conjunto das partes é sempre estritamente maior. Iterando obtém-se uma escada sem fim de infinitos cada vez maiores: ℵ₀, 2^ℵ₀, 2^(2^ℵ₀), … Não há um maior.",
    },
  ],
  closingPretitle: "Vai mais longe",
  closingTitle: "Abre o Explorador.",
  closingBody:
    "Escolhe a tua lista de reais, vê a diagonal puxar dela um novo número e troca a regra de troca de dígito. A contradição vive no ecrã.",
  ctaLabel: "→ Abrir o Explorador",
  diagonalCaption: "Interactivo · a diagonal à mão",
  diagonalRows: "Linhas",
  diagonalRandomise: "Baralhar lista",
  diagonalConstructed: "Real construído",
  diagonalHint:
    "As células âmbar são os dígitos que Cantor lê descendo pela diagonal. A linha rosa por baixo é o novo real s — cada dígito escolhido para que s difira da linha n na n-ésima posição. Qualquer que seja a lista experimentada, s não está nela.",
  diagonalRule: "Regra:",
  diagonalRowLabel: "r",
  diagonalDiagonalLabel: "dígitos diagonais",
  towerCaption: "Interactivo · a torre dos infinitos",
  towerHint:
    "Teorema de Cantor: todo conjunto é estritamente menor que o seu conjunto das partes. Iterando obtém-se uma escada sem fim. Clica num degrau para ler o que é.",
  towerExpandHint: "Clica em qualquer degrau para o abrir.",
  towerOf: "= partes de",
  towerHierarchy: "Hierarquia:",
  towerRungs: [
    {
      pretty: "os naturais · ℕ",
      note: "Aleph-zero. O infinito mais pequeno — o tamanho de todo conjunto numerável.",
    },
    { pretty: "os reais · ℝ", note: "O contínuo c. Cantor 1891: estritamente maior que ℵ₀." },
    {
      pretty: "𝒫(ℝ)",
      note: "Funções ℝ → {0,1}. O conjunto das partes dos reais — de novo estritamente maior.",
    },
    { pretty: "𝒫(𝒫(ℝ))", note: "E assim por diante. Cada nível faz o anterior parecer pequeno." },
    {
      pretty: "𝒫³(ℝ)",
      note: "Três passos de partes sobre ℝ. Os nomes ainda são finitos; os tamanhos já não.",
    },
    { pretty: "𝒫⁴(ℝ)", note: "Itera a mesma regra para sempre. Não há último andar." },
    {
      pretty: "𝒫⁵(ℝ)",
      note: "Os cardinais para lá de ℵ₀ formam eles próprios uma hierarquia não-numerável.",
    },
    {
      pretty: "⋯ para sempre",
      note: "O teorema de Cantor garante: por mais alto que subas, |𝒫(X)| > |X|.",
    },
  ],
  continuumTitle: "Cardinalidade do contínuo",
  continuumBody:
    "Estritamente maior que ℵ₀, o tamanho dos naturais. O primeiro infinito não-numerável que a matemática realmente te entrega.",
  chTitle: "Independência de CH em relação a ZFC",
  chYear: "Ano",
  chWho: "Quem",
  chResult: "Resultado",
  chRows: [
    {
      year: "1878",
      who: "Cantor",
      result: "Pergunta se algum tamanho vive estritamente entre ℵ₀ e c.",
    },
    { year: "1891", who: "Cantor", result: "Argumento diagonal: |ℝ| > |ℕ|." },
    {
      year: "1940",
      who: "Gödel",
      result: "CH não pode ser refutada em ZFC (universo construtível L).",
    },
    {
      year: "1963",
      who: "Cohen",
      result: "CH não pode ser provada em ZFC (forcing). Medalha Fields 1966.",
    },
  ],
  chFootnote:
    "A hipótese do contínuo é independente de ZFC: os axiomas simplesmente não a decidem.",
};

// ---------------- Svenska ----------------
const sv: RichStory = {
  page: {
    pretitle: "Ämne · Paradox",
    title: "Cantors diagonal",
    tagline: "Oändligheten finns i storlekar.",
    intro:
      "Georg Cantors diagonalargument från 1891 är det renaste beviset i matematiken på att vissa oändligheter är strikt större än andra. Räkna upp de reella talen mellan 0 och 1 hur du vill — gå längs diagonalen och bygg ett tal ingen räknade upp. Cantor 1874, 1891 — ögonblicket då mängdläran lämnade barnkammaren.",
    ctaInteractive: "→ Öppna Utforskaren",
  },
  encounter: {
    pretitle: "Första mötet",
    title: "Vissa oändligheter är större än andra.",
    cards: [
      {
        label: "01",
        title: "Den stora idén",
        body: "Oändligheten är inte en sak. ℵ₀ räknar de naturliga talen 1, 2, 3, …; den reella linjen bär en strikt större oändlighet. Cantor förvandlade magkänslan «linjen är tätare än heltalen» till ett bevis.",
      },
      {
        label: "02",
        title: "Ett konkret exempel",
        body: "Anta att du räknar upp de reella i [0,1] som r₁ = 0,1415…, r₂ = 0,2718…, r₃ = 0,5772…, och så vidare. Gå längs diagonalen och välj en annan siffra i varje steg — du har ett reellt tal som per konstruktion skiljer sig från varje rad.",
      },
      {
        label: "03",
        title: "Varför det spelar roll",
        body: "Cantors argument grundlade modern mängdlära, blottlade Russells paradox tio år senare och gav Gödel och Turing det diagonaltrick som driver ofullständigheten och stoppproblemet. Modern logik vilar på det.",
      },
    ],
    tryIt:
      "Nedan: bygg det saknade reella talet för hand, klättra sedan i tornet av allt större oändligheter.",
  },
  sections: [
    {
      pretitle: "Avsnitt 01 · Räkna ℕ",
      title: "ℵ₀, storleken på 1, 2, 3, …",
      body: "De naturliga talen är den minsta oändliga mängden. Storleken heter ℵ₀ — alef-noll — och varje mängd som kan namnges med naturliga tal (heltal, rationella, ändliga strängar) har samma storlek. Uppräknelig betyder «liten nog att räkna upp».",
    },
    {
      pretitle: "Avsnitt 02 · Anta att du kunde räkna upp alla reella",
      title: "I vilken ordning du vill",
      body: "Anta, för motsägelse, att de reella i [0,1] är uppräkneliga: en följd r₁, r₂, r₃, … som innehåller varje reellt tal exakt en gång. Ordningen är din. Skriv varje rad som decimalutveckling 0,d_{n,1} d_{n,2} d_{n,3} … och lägg dem som en oändlig tabell.",
    },
    {
      pretitle: "Avsnitt 03 · Diagonalisera",
      title: "Skilj dig från varje rad i en siffra",
      body: "Läs längs diagonalen: d_{1,1}, d_{2,2}, d_{3,3}, …. Bygg ett nytt reellt tal s vars n-te siffra s_n skiljer sig från d_{n,n} för varje n. Säkert recept: byt varje siffra mot en som inte är 0 eller 9 (för att undvika tvetydigheten 0,999… = 1,000…). Per konstruktion gäller s ≠ r_n vid n-te decimalen, för varje n — och ändå är s ett alldeles vanligt reellt tal i [0,1].",
    },
    {
      pretitle: "Avsnitt 04 · De reella är överuppräkneliga",
      title: "|ℝ| = 2^ℵ₀ = c > ℵ₀",
      body: "Listan skulle innehålla varje reellt tal, och vi byggde just ett den missade. Antagandet faller: ingen uppräkning av de reella kan vara komplett. De reella har kardinalitet c = 2^ℵ₀, strikt större än ℵ₀. En ny sorts oändlighet, levererad till dörren.",
    },
    {
      pretitle: "Avsnitt 05 · Kontinuumhypotesen",
      title: "Finns en storlek mellan ℵ₀ och c?",
      body: "Cantor (1878) frågade om någon kardinalitet bor strikt mellan ℵ₀ och c. Gödel (1940) visade att CH inte kan motbevisas i ZFC; Cohen (1963, Fieldsmedaljen 1966) visade att CH inte kan bevisas i ZFC. Frågan är oberoende av axiomen — formellt oavgörbar, och ändå står frågan kvar.",
    },
    {
      pretitle: "Avsnitt 06 · Hierarkin",
      title: "ℵ₀ < 2^ℵ₀ < 2^(2^ℵ₀) < ⋯ för alltid",
      body: "Cantors sats säger |𝒫(X)| > |X| för varje mängd X — potensmängden är alltid strikt större. Iterera och du får en oändlig stege av allt större oändligheter: ℵ₀, 2^ℵ₀, 2^(2^ℵ₀), … Det finns ingen största.",
    },
  ],
  closingPretitle: "Gå vidare",
  closingTitle: "Öppna Utforskaren.",
  closingBody:
    "Välj din egen uppräkning av reella tal, se diagonalen plocka fram ett nytt ur den och växla siffrans bytesregel. Motsägelsen lever på skärmen.",
  ctaLabel: "→ Öppna Utforskaren",
  diagonalCaption: "Interaktivt · diagonalen för hand",
  diagonalRows: "Rader",
  diagonalRandomise: "Blanda listan",
  diagonalConstructed: "Konstruerat reellt",
  diagonalHint:
    "De bärnstensfärgade cellerna är siffrorna Cantor läser längs diagonalen. Den rosa raden under är det nya reella talet s — varje siffra vald så att s skiljer sig från rad n vid n-te platsen. Vilken lista du än prövade — s står inte i den.",
  diagonalRule: "Regel:",
  diagonalRowLabel: "r",
  diagonalDiagonalLabel: "diagonalsiffror",
  towerCaption: "Interaktivt · tornet av oändligheter",
  towerHint:
    "Cantors sats: varje mängd är strikt mindre än sin potensmängd. Iterera och du får en oändlig stege. Klicka en pinne för att läsa vad den är.",
  towerExpandHint: "Klicka vilken pinne som helst för att öppna den.",
  towerOf: "= potensmängd av",
  towerHierarchy: "Hierarki:",
  towerRungs: [
    {
      pretty: "de naturliga · ℕ",
      note: "Alef-noll. Den minsta oändligheten — storleken på varje uppräknelig mängd.",
    },
    { pretty: "de reella · ℝ", note: "Kontinuum c. Cantor 1891: strikt större än ℵ₀." },
    {
      pretty: "𝒫(ℝ)",
      note: "Funktioner ℝ → {0,1}. Potensmängden av de reella — åter strikt större.",
    },
    { pretty: "𝒫(𝒫(ℝ))", note: "Och så vidare. Varje nivå får den under att se liten ut." },
    {
      pretty: "𝒫³(ℝ)",
      note: "Tre potensmängdssteg över ℝ. Namnen är fortfarande ändliga; storlekarna inte längre.",
    },
    { pretty: "𝒫⁴(ℝ)", note: "Iterera samma regel för alltid. Det finns ingen översta våning." },
    { pretty: "𝒫⁵(ℝ)", note: "Kardinaltalen bortom ℵ₀ utgör själva en överuppräknelig hierarki." },
    {
      pretty: "⋯ för alltid",
      note: "Cantors sats garanterar: hur högt du än klättrar, |𝒫(X)| > |X|.",
    },
  ],
  continuumTitle: "Kontinuumets kardinalitet",
  continuumBody:
    "Strikt större än ℵ₀, storleken på de naturliga talen. Den första överuppräkneliga oändligheten som matematiken faktiskt räcker dig.",
  chTitle: "CH:s oberoende av ZFC",
  chYear: "År",
  chWho: "Vem",
  chResult: "Resultat",
  chRows: [
    { year: "1878", who: "Cantor", result: "Frågar om någon storlek bor strikt mellan ℵ₀ och c." },
    { year: "1891", who: "Cantor", result: "Diagonalargument: |ℝ| > |ℕ|." },
    {
      year: "1940",
      who: "Gödel",
      result: "CH kan inte motbevisas i ZFC (konstruerbara universum L).",
    },
    {
      year: "1963",
      who: "Cohen",
      result: "CH kan inte bevisas i ZFC (forcing). Fieldsmedaljen 1966.",
    },
  ],
  chFootnote: "Kontinuumhypotesen är oberoende av ZFC: axiomen avgör den helt enkelt inte.",
};

// ---------------- Norsk ----------------
const no: RichStory = {
  page: {
    pretitle: "Tema · Paradoks",
    title: "Cantors diagonal",
    tagline: "Uendeligheten finnes i størrelser.",
    intro:
      "Georg Cantors diagonalargument fra 1891 er det reneste beviset i matematikken på at noen uendeligheter er strengt større enn andre. Tell opp de reelle tallene mellom 0 og 1 som du vil — gå langs diagonalen og bygg et tall ingen telte. Cantor 1874, 1891 — øyeblikket mengdelæren forlot barnekammeret.",
    ctaInteractive: "→ Åpne Utforskeren",
  },
  encounter: {
    pretitle: "Første møte",
    title: "Noen uendeligheter er større enn andre.",
    cards: [
      {
        label: "01",
        title: "Den store ideen",
        body: "Uendelighet er ikke én ting. ℵ₀ teller de naturlige tallene 1, 2, 3, …; den reelle linja bærer en strengt større uendelighet. Cantor gjorde magefølelsen «linja er tettere enn heltallene» til et bevis.",
      },
      {
        label: "02",
        title: "Et konkret eksempel",
        body: "Anta at du teller opp de reelle i [0,1] som r₁ = 0,1415…, r₂ = 0,2718…, r₃ = 0,5772…, og så videre. Gå langs diagonalen og velg et annet siffer i hvert steg — så har du et reelt tall som ved konstruksjon avviker fra hver rad.",
      },
      {
        label: "03",
        title: "Hvorfor det betyr noe",
        body: "Cantors argument la grunnen for moderne mengdelære, fikk Russells paradoks fram et tiår senere og ga Gödel og Turing det diagonaltrikset som driver ufullstendigheten og stoppeproblemet. Moderne logikk hviler på det.",
      },
    ],
    tryIt:
      "Under: bygg det manglende reelle tallet for hånd, så klatre tårnet av stadig større uendeligheter.",
  },
  sections: [
    {
      pretitle: "Avsnitt 01 · Telle ℕ",
      title: "ℵ₀, størrelsen til 1, 2, 3, …",
      body: "De naturlige tallene er den minste uendelige mengden. Størrelsen heter ℵ₀ — alef-null — og enhver mengde du kan merke med naturlige tall (heltallene, de rasjonelle, alle endelige strenger) har samme størrelse. Tellbar betyr «liten nok til å telles opp».",
    },
    {
      pretitle: "Avsnitt 02 · Anta at du kunne telle alle reelle",
      title: "I hvilken rekkefølge du vil",
      body: "Anta, for motsigelse, at de reelle i [0,1] er tellbare: en følge r₁, r₂, r₃, … som inneholder hvert reelt tall nøyaktig én gang. Rekkefølgen er din. Skriv hver rad som desimalutvikling 0,d_{n,1} d_{n,2} d_{n,3} … og legg dem ut som en uendelig tabell.",
    },
    {
      pretitle: "Avsnitt 03 · Diagonalisere",
      title: "Skill deg fra hver rad i ett siffer",
      body: "Les langs diagonalen: d_{1,1}, d_{2,2}, d_{3,3}, …. Bygg et nytt reelt tall s der n-te siffer s_n avviker fra d_{n,n} for hver n. Sikker oppskrift: bytt hvert siffer mot et som ikke er 0 eller 9 (for å unngå tvetydigheten 0,999… = 1,000…). Ved konstruksjon gjelder s ≠ r_n ved n-te desimal, for hver n — likevel er s et helt vanlig reelt tall i [0,1].",
    },
    {
      pretitle: "Avsnitt 04 · De reelle er overtellbare",
      title: "|ℝ| = 2^ℵ₀ = c > ℵ₀",
      body: "Listen skulle inneholde hvert reelt tall, og vi bygde nettopp ett den gikk glipp av. Antakelsen brister: ingen opptelling av de reelle kan være fullstendig. De reelle har kardinalitet c = 2^ℵ₀, strengt større enn ℵ₀. En ny slags uendelighet, levert på døra.",
    },
    {
      pretitle: "Avsnitt 05 · Kontinuumshypotesen",
      title: "Finnes en størrelse mellom ℵ₀ og c?",
      body: "Cantor (1878) spurte om noen kardinalitet bor strengt mellom ℵ₀ og c. Gödel (1940) viste at CH ikke kan motbevises i ZFC; Cohen (1963, Fields-medaljen 1966) viste at CH ikke kan bevises i ZFC. Spørsmålet er uavhengig av aksiomene — formelt uavgjørbart, og likevel står spørsmålet.",
    },
    {
      pretitle: "Avsnitt 06 · Hierarkiet",
      title: "ℵ₀ < 2^ℵ₀ < 2^(2^ℵ₀) < ⋯ for alltid",
      body: "Cantors teorem sier |𝒫(X)| > |X| for hver mengde X — potensmengden er alltid strengt større. Iterer, og du får en uendelig stige av stadig større uendeligheter: ℵ₀, 2^ℵ₀, 2^(2^ℵ₀), … Det finnes ingen største.",
    },
  ],
  closingPretitle: "Gå videre",
  closingTitle: "Åpne Utforskeren.",
  closingBody:
    "Velg din egen liste av reelle tall, se diagonalen trekke ut et nytt og bytt sifferbytteregelen. Motsigelsen lever på skjermen.",
  ctaLabel: "→ Åpne Utforskeren",
  diagonalCaption: "Interaktivt · diagonalen for hånd",
  diagonalRows: "Rader",
  diagonalRandomise: "Stokk listen",
  diagonalConstructed: "Konstruert reelt",
  diagonalHint:
    "De ravgule cellene er sifrene Cantor leser langs diagonalen. Den rosa raden under er det nye reelle tallet s — hvert siffer valgt så s avviker fra rad n i n-te posisjon. Uansett hvilken liste du prøvde, s er ikke i den.",
  diagonalRule: "Regel:",
  diagonalRowLabel: "r",
  diagonalDiagonalLabel: "diagonalsifre",
  towerCaption: "Interaktivt · tårnet av uendeligheter",
  towerHint:
    "Cantors teorem: enhver mengde er strengt mindre enn sin potensmengde. Iterer, og du får en uendelig stige. Klikk et trinn for å lese hva det er.",
  towerExpandHint: "Klikk hvilket som helst trinn for å åpne det.",
  towerOf: "= potensmengde av",
  towerHierarchy: "Hierarki:",
  towerRungs: [
    {
      pretty: "de naturlige · ℕ",
      note: "Alef-null. Den minste uendeligheten — størrelsen til hver tellbar mengde.",
    },
    { pretty: "de reelle · ℝ", note: "Kontinuumet c. Cantor 1891: strengt større enn ℵ₀." },
    {
      pretty: "𝒫(ℝ)",
      note: "Funksjoner ℝ → {0,1}. Potensmengden av de reelle — igjen strengt større.",
    },
    { pretty: "𝒫(𝒫(ℝ))", note: "Og slik videre. Hvert nivå dverger det under." },
    {
      pretty: "𝒫³(ℝ)",
      note: "Tre potensmengde-steg over ℝ. Navnene er ennå endelige; størrelsene ikke lenger.",
    },
    {
      pretty: "𝒫⁴(ℝ)",
      note: "Iterer den samme regelen for alltid. Det finnes ingen øverste etasje.",
    },
    { pretty: "𝒫⁵(ℝ)", note: "Kardinaltallene utover ℵ₀ utgjør selv et overtellbart hierarki." },
    {
      pretty: "⋯ for alltid",
      note: "Cantors teorem garanterer: uansett hvor høyt du klatrer, |𝒫(X)| > |X|.",
    },
  ],
  continuumTitle: "Kontinuumets kardinalitet",
  continuumBody:
    "Strengt større enn ℵ₀, størrelsen til de naturlige tallene. Den første overtellbare uendeligheten matematikken faktisk rekker deg.",
  chTitle: "CH-uavhengighet av ZFC",
  chYear: "År",
  chWho: "Hvem",
  chResult: "Resultat",
  chRows: [
    { year: "1878", who: "Cantor", result: "Spør om noen størrelse bor strengt mellom ℵ₀ og c." },
    { year: "1891", who: "Cantor", result: "Diagonalargument: |ℝ| > |ℕ|." },
    {
      year: "1940",
      who: "Gödel",
      result: "CH kan ikke motbevises i ZFC (konstruerbart univers L).",
    },
    {
      year: "1963",
      who: "Cohen",
      result: "CH kan ikke bevises i ZFC (forcing). Fields-medaljen 1966.",
    },
  ],
  chFootnote: "Kontinuumshypotesen er uavhengig av ZFC: aksiomene avgjør den ganske enkelt ikke.",
};

const RICH_STORY: Record<Locale, RichStory> = { en, de, es, fr, it, pt, sv, no };

// --------------------------------------------------------------------------

export default function CantorStory() {
  const { locale } = useI18n();
  const story = RICH_STORY[locale];
  // The shared StoryPage shape includes a `sections` array that the shell
  // never reads (we render our own sections below). Inject an empty list
  // to satisfy the type.
  const page: StoryPage = { ...story.page, sections: [] };
  const [sec0, sec1, sec2, sec3, sec4, sec5] = story.sections;

  return (
    <StoryPageShell
      page={page}
      ctaHref="/cantor/explorer"
      accent={ACCENT}
      borderAccent="border-signal-rose/70"
      bgAccent="bg-signal-rose/10"
      hoverAccent="hover:bg-signal-rose/20"
      gradient="from-signal-rose/10"
      formulaBadge="|ℝ| = 2^ℵ₀ > ℵ₀"
      formulaLatex={"|\\mathbb{R}| \\;=\\; 2^{\\aleph_0} \\;>\\; \\aleph_0"}
      finalLabel={story.closingTitle}
    >
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
              <div className="glass hairline h-full space-y-3 rounded-2xl border p-6 transition-colors hover:border-signal-rose/40">
                <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-rose">
                  {card.label}
                </div>
                <h3 className="math-italic text-2xl leading-snug text-ink-100">{card.title}</h3>
                <p className="text-sm leading-relaxed text-ink-200">{card.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={500}>
          <div className="text-center italic text-ink-300">{story.encounter.tryIt}</div>
        </Reveal>
      </section>

      {/* Section 01 — Counting ℕ */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec0!.pretitle}
          title={sec0!.title}
          body={sec0!.body}
          accent={ACCENT}
        />
      </section>

      {/* Section 02 — Suppose you could list */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec1!.pretitle}
          title={sec1!.title}
          body={sec1!.body}
          accent={ACCENT}
        />
      </section>

      {/* Section 03 — Diagonalise + INTERACTIVE 1 */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec2!.pretitle}
          title={sec2!.title}
          body={sec2!.body}
          accent={ACCENT}
        />
        <Reveal delay={120}>
          <CantorDiagonalDemo
            caption={story.diagonalCaption}
            rowsLabel={story.diagonalRows}
            randomiseLabel={story.diagonalRandomise}
            constructedLabel={story.diagonalConstructed}
            hint={story.diagonalHint}
            ruleLabel={story.diagonalRule}
            rowLabel={story.diagonalRowLabel}
            diagonalLabel={story.diagonalDiagonalLabel}
          />
        </Reveal>
      </section>

      {/* Section 04 — Reals are uncountable */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec3!.pretitle}
          title={sec3!.title}
          body={sec3!.body}
          accent={ACCENT}
        />
        <Reveal delay={120}>
          <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-8 text-center">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {story.continuumTitle}
            </div>
            <div className="math-italic text-5xl text-ink-100 md:text-6xl">|ℝ| = 2^ℵ₀ = c</div>
            <p className="mx-auto max-w-xl text-sm leading-relaxed text-ink-300">
              {story.continuumBody}
            </p>
          </div>
        </Reveal>
      </section>

      {/* Section 05 — Continuum hypothesis */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec4!.pretitle}
          title={sec4!.title}
          body={sec4!.body}
          accent={ACCENT}
        />
        <Reveal delay={120}>
          <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-6">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {story.chTitle}
            </div>
            <table className="w-full font-mono text-sm">
              <thead className="hairline border-b text-ink-300">
                <tr>
                  <th className="px-2 py-2 text-left text-[10px] uppercase tracking-widest">
                    {story.chYear}
                  </th>
                  <th className="px-2 py-2 text-left text-[10px] uppercase tracking-widest">
                    {story.chWho}
                  </th>
                  <th className="px-2 py-2 text-left text-[10px] uppercase tracking-widest">
                    {story.chResult}
                  </th>
                </tr>
              </thead>
              <tbody>
                {story.chRows.map((row) => (
                  <tr key={row.year} className="border-b border-ink-700/30 last:border-0">
                    <td className="px-2 py-2 text-signal-rose">{row.year}</td>
                    <td className="px-2 py-2 text-ink-200">{row.who}</td>
                    <td className="px-2 py-2 text-ink-300">{row.result}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="pt-2 text-xs leading-relaxed text-ink-400">{story.chFootnote}</p>
          </div>
        </Reveal>
      </section>

      {/* Section 06 — The hierarchy + INTERACTIVE 2 */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec5!.pretitle}
          title={sec5!.title}
          body={sec5!.body}
          accent={ACCENT}
        />
        <Reveal delay={120}>
          <CantorPowerSetTower
            caption={story.towerCaption}
            hint={story.towerHint}
            expandHint={story.towerExpandHint}
            rungs={story.towerRungs}
            ofLabel={story.towerOf}
            hierarchyLabel={story.towerHierarchy}
          />
        </Reveal>
      </section>

      {/* Closing CTA */}
      <Reveal>
        <section className="glass hairline mx-auto mb-16 max-w-3xl space-y-6 rounded-3xl border p-10 text-center">
          <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
            {story.closingPretitle}
          </div>
          <div className="math-italic shimmer-text text-3xl leading-tight md:text-5xl">
            {story.closingTitle}
          </div>
          <p className="leading-relaxed text-ink-200">{story.closingBody}</p>
          <Link
            href="/cantor/explorer"
            className="inline-block rounded-full border border-signal-rose/70 bg-signal-rose/10 px-8 py-4 font-mono text-sm uppercase tracking-widest2 text-signal-rose transition-colors hover:bg-signal-rose/25"
          >
            {story.ctaLabel}
          </Link>
        </section>
      </Reveal>
    </StoryPageShell>
  );
}
