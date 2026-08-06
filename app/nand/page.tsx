"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { Reveal } from "@/components/Reveal";
import { StoryCard } from "@/components/StoryPageShell";
import { NandTruthTable } from "@/components/NandTruthTable";
import { NandGateBuilder } from "@/components/NandGateBuilder";
import type { Locale } from "@/lib/i18n/types";

const ACCENT = "text-signal-violet";

// --------------------------------------------------------------------------
// Rich, per-locale story content. The hero (pretitle/title/tagline/intro/CTA)
// still comes from the shared stories.ts. Everything below the hero is
// authored inline so this page can tell a longer story without touching the
// shared i18n bundles.
// --------------------------------------------------------------------------

type RichStory = {
  encounter: {
    pretitle: string;
    title: string;
    cards: Array<{ label: string; title: string; body: string }>;
    tryIt: string;
  };
  sections: Array<{ pretitle: string; title: string; body: string }>;
  truthTable: {
    caption: string;
    labels: {
      a: string;
      b: string;
      nand: string;
      nota: string;
      and: string;
      or: string;
      xor: string;
      hint: string;
      flip: string;
    };
  };
  builder: {
    caption: string;
    labels: {
      not: string;
      and: string;
      or: string;
      xor: string;
      countOne: string;
      countN: (n: number) => string;
      description: { NOT: string; AND: string; OR: string; XOR: string };
      // Accessible name for the whole circuit SVG (localized per gate + count).
      circuit: (target: string, n: number) => string;
    };
  };
  intuitionLabel: string;
  intuitionBody: string;
  notLabel: string;
  notBody: string;
  notFormula: string;
  completenessLabel: string;
  completenessBody: string;
  completenessRows: Array<{ set: string; complete: boolean; note: string }>;
  completenessYes: string;
  completenessNo: string;
  hardwareLabel: string;
  hardwareIntro: string;
  hardwareRows: Array<{ gate: string; transistors: number; note: string }>;
  hardwareHead: { gate: string; t: string; note: string };
  hardwareFoot: string;
  otherLabel: string;
  otherBody: string;
  otherFormulaNor: string;
  otherFormulaNand: string;
  otherCardNand: string;
  otherCardNor: string;
  closingPretitle: string;
  closingTitle: string;
  closingBody: string;
  closingCta: string;
};

const en: RichStory = {
  encounter: {
    pretitle: "First encounter",
    title: "One gate. Every computer.",
    cards: [
      {
        label: "01",
        title: "The big idea",
        body: "One tiny logic gate is enough to build every computer ever made. NAND — short for 'not-and' — outputs 0 only when both inputs are 1. Wire enough of them together, and you can compute anything that any other digital circuit can compute. Sheffer proved this in 1913, and modern chips still run on it.",
      },
      {
        label: "02",
        title: "A concrete example",
        body: "NAND is just AND with the answer flipped. Look at the truth table: only one row is 0 (when both inputs are 1); the other three are 1. From that single fact: NOT a = a NAND a. Wire two NANDs and you get AND. Three give OR. Four give XOR. Everything else is composition.",
      },
      {
        label: "03",
        title: "Why it matters",
        body: "Modern CPUs are physically a sea of NAND gates etched into silicon — billions of them, identical, in tidy rows. The complexity of a processor is not in the parts but in the wiring. Pick the right primitive, and everything becomes assembly.",
      },
    ],
    tryIt: "Below: flip the bits, watch the gates rewire, build the universe yourself.",
  },
  sections: [
    {
      pretitle: "Section 01 · The single gate",
      title: "AND, but reversed",
      body: "The Sheffer stroke a ↑ b takes two binary inputs and returns one binary output. It outputs 1 in three of the four possible cases — only when both inputs are 1 does it output 0. That is literally the definition: a ↑ b = ¬(a ∧ b). The little arrow is sometimes called the Sheffer stroke, sometimes drawn as a bar (a | b). It is the same operation in every notation.",
    },
    {
      pretitle: "Section 02 · Building NOT",
      title: "One gate, both inputs tied",
      body: "The first miracle is NOT. Take a single NAND and wire the same signal a into both of its inputs. The result is a ↑ a = ¬(a ∧ a) = ¬a. One gate, no extras. From that moment on, anything you can build from AND, OR, and NOT — which is everything in classical logic — you can build from NAND alone, because NAND already gives you the AND part and now you have the NOT.",
    },
    {
      pretitle: "Section 03 · AND, OR, XOR",
      title: "Two, three, four gates",
      body: "AND is two NANDs: first compute a ↑ b, then negate the result with one more NAND (tied inputs). OR follows from De Morgan: a ∨ b = ¬(¬a ∧ ¬b), which is exactly (a ↑ a) ↑ (b ↑ b) — three NANDs. XOR needs four, arranged like a tiny diamond. Once you see the pattern, every Boolean function becomes a directed acyclic graph of identical NAND cells. There is no other building block.",
    },
    {
      pretitle: "Section 04 · Functional completeness",
      title: "Why one gate is enough",
      body: "A set of Boolean operators is functionally complete if every Boolean function can be expressed using only those operators. {AND, OR, NOT} is complete — that is the standard textbook fact. {AND, OR} alone is not: you can never produce NOT from AND and OR. {NAND} alone is complete because it can produce NOT (by tying inputs) and AND (by negating its own output), and {AND, NOT} is already enough. Inductively: any Boolean function has a normal form built from AND, OR, NOT; rewrite each of those in NANDs; you are done.",
    },
    {
      pretitle: "Section 05 · Hardware reality",
      title: "Why silicon loves NAND",
      body: "CMOS — the technology behind essentially every modern chip — implements NAND with only four transistors: two p-type pull-ups in parallel, two n-type pull-downs in series. AND needs six (a NAND followed by an inverter), OR needs six as well. Every gate is cheaper as a NAND, and a NAND output can drive other NANDs without extra buffering. Photolithography then tiles billions of identical NAND cells across a wafer. The CPU you are reading this on is, at the transistor level, an ocean of NANDs.",
    },
    {
      pretitle: "Section 06 · Other complete singletons",
      title: "NOR, the Peirce arrow",
      body: "NAND is not alone in being alone-sufficient. Charles Sanders Peirce had already noticed, in an unpublished 1880 manuscript, that NOR — written a ↓ b = ¬(a ∨ b) — is also functionally complete by itself. Sheffer rediscovered the NAND version in 1913 and published. These two are the only binary Boolean operators with this property: every other binary operator needs help. The Apollo Guidance Computer was built entirely from NOR gates; the chip in your pocket runs on NANDs. Two ways to build a universe.",
    },
  ],
  truthTable: {
    caption: "Truth-table playground · click a row",
    labels: {
      a: "a",
      b: "b",
      nand: "a ↑ b",
      nota: "¬a",
      and: "a ∧ b",
      or: "a ∨ b",
      xor: "a ⊕ b",
      hint: "all four classical gates, derived from NAND alone.",
      flip: "Click a row to highlight it.",
    },
  },
  builder: {
    caption: "Gate-composition canvas · pick a target",
    labels: {
      not: "NOT",
      and: "AND",
      or: "OR",
      xor: "XOR",
      countOne: "1 NAND gate.",
      countN: (n: number) => `${n} NAND gates.`,
      circuit: (target, n) => `Circuit: ${target} built from ${n} NAND gate${n > 1 ? "s" : ""}`,
      description: {
        NOT: "Tie both inputs of a single NAND to a.",
        AND: "NAND, then NAND-with-tied-inputs (= NOT). Two gates.",
        OR: "Two NOTs, fed into a NAND. Three gates.",
        XOR: "A diamond: NAND fans out into two more, joined by a final NAND. Four gates.",
      },
    },
  },
  intuitionLabel: "Intuition",
  intuitionBody:
    "Think of a NAND gate as a tiny suspicious guard. It only refuses (outputs 0) when both witnesses agree (a = 1 and b = 1). Any other testimony — a disagreement, a silence — and it nods through with a 1. That single distrust, repeated, is enough to compute anything.",
  notLabel: "NOT, in one gate",
  notBody:
    "Tie the two inputs of a single NAND together and feed both with the same wire a. The gate sees (a, a). If a = 1, both inputs are 1, output is 0 = ¬a. If a = 0, at least one input is 0, output is 1 = ¬a. One gate, both branches verified.",
  notFormula: "¬a  =  a ↑ a",
  completenessLabel: "Functional completeness",
  completenessBody:
    "A set of Boolean operators is functionally complete if every truth table on n inputs can be realised with a circuit using only those operators. Some sets work, some do not.",
  completenessRows: [
    { set: "{NAND}", complete: true, note: "alone-complete · Sheffer 1913" },
    { set: "{NOR}", complete: true, note: "alone-complete · Peirce 1880 (unpublished)" },
    { set: "{AND, OR, NOT}", complete: true, note: "the textbook basis" },
    { set: "{AND, NOT}", complete: true, note: "OR via De Morgan: ¬(¬a ∧ ¬b)" },
    { set: "{OR, NOT}", complete: true, note: "AND via De Morgan: ¬(¬a ∨ ¬b)" },
    { set: "{AND, OR}", complete: false, note: "no way to flip a 1 to a 0 — needs NOT" },
    { set: "{XOR, AND}", complete: true, note: "Zhegalkin / algebraic normal form" },
    { set: "{XOR}", complete: false, note: "only linear functions reachable" },
  ],
  completenessYes: "complete",
  completenessNo: "not complete",
  hardwareLabel: "CMOS transistor counts",
  hardwareIntro:
    "Modern chips are CMOS — pairs of n-type and p-type transistors that pull the output high or low. NAND is the cheapest two-input gate to build.",
  hardwareRows: [
    { gate: "NAND", transistors: 4, note: "2 PMOS in parallel + 2 NMOS in series" },
    { gate: "NOR", transistors: 4, note: "2 PMOS in series + 2 NMOS in parallel" },
    { gate: "NOT", transistors: 2, note: "1 PMOS + 1 NMOS (CMOS inverter)" },
    { gate: "AND", transistors: 6, note: "NAND + inverter" },
    { gate: "OR", transistors: 6, note: "NOR + inverter" },
    {
      gate: "XOR",
      transistors: 12,
      note: "complex-gate (AOI) design; 16 as 4 NANDs, fewer with pass-transistor tricks",
    },
  ],
  hardwareHead: { gate: "gate", t: "transistors", note: "build" },
  hardwareFoot:
    "Because NAND is cheap and alone-complete, ASIC tools often synthesise an entire circuit into NAND2 cells before placement-and-routing. The chip is, literally, a sea of NANDs.",
  otherLabel: "The two alone-complete gates",
  otherBody:
    "NAND and NOR are the only binary Boolean operators that are each, on their own, functionally complete. NOR was first noted by Charles Sanders Peirce in a manuscript dated 1880 (published posthumously). NAND was published by Henry Sheffer in 1913, who showed it could replace the entire system of Principia Mathematica's primitives. Russell and Whitehead added a note about it in the second edition.",
  otherFormulaNor: "a ↓ b  =  ¬(a ∨ b)",
  otherFormulaNand: "a ↑ b  =  ¬(a ∧ b)",
  otherCardNand: "NAND · the chip's choice",
  otherCardNor: "NOR · Apollo's choice",
  closingPretitle: "Take it further",
  closingTitle: "Open the Builder.",
  closingBody:
    "The Builder lets you pick a target gate and watch its NAND skeleton appear, transistor by transistor. Wire your own circuits and see them reduce to a forest of identical strokes.",
  closingCta: "→ Open the Builder",
};

const de: RichStory = {
  encounter: {
    pretitle: "Erste Begegnung",
    title: "Ein Gatter. Jeder Computer.",
    cards: [
      {
        label: "01",
        title: "Die große Idee",
        body: 'Ein einziges winziges Logikgatter genügt, um jeden je gebauten Computer zu konstruieren. NAND — kurz für „nicht-und" — gibt nur dann 0 aus, wenn beide Eingänge 1 sind. Verdrahte genug davon, und du kannst alles berechnen, was irgendein anderer digitaler Schaltkreis berechnen kann. Sheffer bewies das 1913, und moderne Chips laufen noch heute darauf.',
      },
      {
        label: "02",
        title: "Ein konkretes Beispiel",
        body: "NAND ist einfach AND mit umgedrehter Antwort. Schau die Wahrheitstafel an: nur eine Zeile ist 0 (wenn beide Eingänge 1 sind), die anderen drei sind 1. Aus dieser einen Tatsache folgt alles: NOT a = a NAND a. Zwei NANDs ergeben AND. Drei ergeben OR. Vier ergeben XOR. Der Rest ist Komposition.",
      },
      {
        label: "03",
        title: "Warum es zählt",
        body: "Moderne CPUs sind physisch ein Meer aus NAND-Gattern, in Silizium geätzt — Milliarden davon, identisch, in ordentlichen Reihen. Die Komplexität eines Prozessors steckt nicht in den Teilen, sondern in der Verdrahtung. Wähle das richtige Primitiv, und alles wird zur Montage.",
      },
    ],
    tryIt: "Unten: kipp die Bits, sieh die Gatter sich neu verdrahten, bau selbst das Universum.",
  },
  sections: [
    {
      pretitle: "Abschnitt 01 · Das eine Gatter",
      title: "AND, nur umgedreht",
      body: "Der Sheffer-Strich a ↑ b nimmt zwei binäre Eingänge und liefert einen binären Ausgang. Drei der vier möglichen Fälle ergeben 1 — nur wenn beide Eingänge 1 sind, gibt er 0 aus. Genau das ist die Definition: a ↑ b = ¬(a ∧ b). Der kleine Pfeil heißt manchmal Sheffer-Strich, manchmal wird er als Balken geschrieben (a | b). In jeder Notation dieselbe Operation.",
    },
    {
      pretitle: "Abschnitt 02 · NOT bauen",
      title: "Ein Gatter, beide Eingänge gekoppelt",
      body: "Das erste Wunder ist NOT. Nimm ein einzelnes NAND und führe dasselbe Signal a in beide Eingänge. Das Ergebnis ist a ↑ a = ¬(a ∧ a) = ¬a. Ein Gatter, ohne Zugabe. Von da an ist alles, was du aus AND, OR und NOT bauen kannst — also alles in der klassischen Logik —, auch allein aus NAND baubar, denn NAND liefert dir bereits den AND-Teil und nun auch den NOT-Teil.",
    },
    {
      pretitle: "Abschnitt 03 · AND, OR, XOR",
      title: "Zwei, drei, vier Gatter",
      body: "AND besteht aus zwei NANDs: erst a ↑ b berechnen, dann das Ergebnis mit einem zweiten NAND (mit gekoppelten Eingängen) negieren. OR folgt aus De Morgan: a ∨ b = ¬(¬a ∧ ¬b), also genau (a ↑ a) ↑ (b ↑ b) — drei NANDs. XOR braucht vier, in einer kleinen Raute angeordnet. Sobald du das Muster siehst, wird jede Boolesche Funktion zu einem gerichteten azyklischen Graphen identischer NAND-Zellen. Es gibt keinen anderen Baustein.",
    },
    {
      pretitle: "Abschnitt 04 · Funktionale Vollständigkeit",
      title: "Warum ein Gatter genügt",
      body: "Eine Menge boolescher Operatoren ist funktional vollständig, wenn sich jede boolesche Funktion allein mit diesen Operatoren ausdrücken lässt. {AND, OR, NOT} ist vollständig — das ist die Standardaussage. {AND, OR} allein ist es nicht: aus AND und OR lässt sich NOT nie herstellen. {NAND} allein ist vollständig, weil es NOT (durch Eingangskopplung) und AND (durch Negation seiner eigenen Ausgabe) liefert, und {AND, NOT} reicht bereits. Induktiv: jede boolesche Funktion hat eine Normalform aus AND, OR, NOT; schreibe alle drei in NANDs um; fertig.",
    },
    {
      pretitle: "Abschnitt 05 · Die Hardware-Realität",
      title: "Warum Silizium NAND liebt",
      body: "CMOS — die Technik hinter im Grunde jedem modernen Chip — realisiert NAND mit nur vier Transistoren: zwei P-Typen parallel, zwei N-Typen in Serie. AND braucht sechs (NAND plus Inverter), OR ebenfalls sechs. Jedes Gatter ist als NAND billiger, und ein NAND-Ausgang kann andere NANDs ohne Zwischenpuffer treiben. Die Fotolithographie reproduziert dann Milliarden identischer NAND-Zellen über den Wafer. Die CPU, auf der du das gerade liest, ist auf Transistorebene ein Ozean von NANDs.",
    },
    {
      pretitle: "Abschnitt 06 · Andere allein-vollständige Gatter",
      title: "NOR, der Peirce-Pfeil",
      body: "NAND ist nicht das einzige Gatter, das allein genügt. Charles Sanders Peirce hatte schon 1880 in einem unveröffentlichten Manuskript bemerkt, dass NOR — geschrieben a ↓ b = ¬(a ∨ b) — ebenfalls funktional vollständig ist. Sheffer entdeckte die NAND-Variante 1913 neu und veröffentlichte sie. Das sind die einzigen beiden binären booleschen Operatoren mit dieser Eigenschaft: jeder andere binäre Operator braucht Hilfe. Der Apollo Guidance Computer war komplett aus NOR-Gattern gebaut; der Chip in deiner Tasche läuft auf NANDs. Zwei Wege, ein Universum zu bauen.",
    },
  ],
  truthTable: {
    caption: "Wahrheitstafel-Spielplatz · Zeile anklicken",
    labels: {
      a: "a",
      b: "b",
      nand: "a ↑ b",
      nota: "¬a",
      and: "a ∧ b",
      or: "a ∨ b",
      xor: "a ⊕ b",
      hint: "alle vier klassischen Gatter, allein aus NAND abgeleitet.",
      flip: "Klick eine Zeile, um sie hervorzuheben.",
    },
  },
  builder: {
    caption: "Gatter-Komposition · Ziel auswählen",
    labels: {
      not: "NOT",
      and: "AND",
      or: "OR",
      xor: "XOR",
      countOne: "1 NAND-Gatter.",
      countN: (n: number) => `${n} NAND-Gatter.`,
      circuit: (target, n) => `Schaltung: ${target} aus ${n} NAND-Gatter${n > 1 ? "n" : ""}`,
      description: {
        NOT: "Beide Eingänge eines einzigen NAND auf a verbinden.",
        AND: "NAND, dann NAND mit gekoppelten Eingängen (= NOT). Zwei Gatter.",
        OR: "Zwei NOTs, in ein NAND. Drei Gatter.",
        XOR: "Eine Raute: ein NAND fächert in zwei weitere, ein letztes NAND führt zusammen. Vier Gatter.",
      },
    },
  },
  intuitionLabel: "Intuition",
  intuitionBody:
    "Stell dir ein NAND-Gatter als kleinen misstrauischen Wächter vor. Er verweigert nur (gibt 0 aus), wenn beide Zeugen übereinstimmen (a = 1 und b = 1). Jede andere Aussage — ein Widerspruch, ein Schweigen — und er winkt mit einer 1 durch. Dieses einzige Misstrauen, oft genug wiederholt, reicht aus, um alles zu berechnen.",
  notLabel: "NOT, in einem Gatter",
  notBody:
    "Verbinde die beiden Eingänge eines einzigen NAND und führe beide mit derselben Leitung a. Das Gatter sieht (a, a). Wenn a = 1 ist, sind beide Eingänge 1, der Ausgang ist 0 = ¬a. Wenn a = 0, ist mindestens ein Eingang 0, der Ausgang ist 1 = ¬a. Ein Gatter, beide Fälle bestätigt.",
  notFormula: "¬a  =  a ↑ a",
  completenessLabel: "Funktionale Vollständigkeit",
  completenessBody:
    "Eine Menge boolescher Operatoren ist funktional vollständig, wenn sich jede Wahrheitstafel auf n Eingängen mit einem Schaltkreis aus nur diesen Operatoren realisieren lässt. Manche Mengen funktionieren, andere nicht.",
  completenessRows: [
    { set: "{NAND}", complete: true, note: "allein vollständig · Sheffer 1913" },
    { set: "{NOR}", complete: true, note: "allein vollständig · Peirce 1880 (unveröffentlicht)" },
    { set: "{AND, OR, NOT}", complete: true, note: "die Lehrbuch-Basis" },
    { set: "{AND, NOT}", complete: true, note: "OR via De Morgan: ¬(¬a ∧ ¬b)" },
    { set: "{OR, NOT}", complete: true, note: "AND via De Morgan: ¬(¬a ∨ ¬b)" },
    {
      set: "{AND, OR}",
      complete: false,
      note: "keine Möglichkeit, eine 1 in eine 0 zu kippen — NOT fehlt",
    },
    { set: "{XOR, AND}", complete: true, note: "Zhegalkin- / algebraische Normalform" },
    { set: "{XOR}", complete: false, note: "nur lineare Funktionen erreichbar" },
  ],
  completenessYes: "vollständig",
  completenessNo: "nicht vollständig",
  hardwareLabel: "CMOS-Transistorzahlen",
  hardwareIntro:
    "Moderne Chips sind CMOS — Paare aus N- und P-Typ-Transistoren, die den Ausgang hoch oder runter ziehen. NAND ist das billigste Zweieingangsgatter überhaupt.",
  hardwareRows: [
    { gate: "NAND", transistors: 4, note: "2 PMOS parallel + 2 NMOS in Serie" },
    { gate: "NOR", transistors: 4, note: "2 PMOS in Serie + 2 NMOS parallel" },
    { gate: "NOT", transistors: 2, note: "1 PMOS + 1 NMOS (CMOS-Inverter)" },
    { gate: "AND", transistors: 6, note: "NAND + Inverter" },
    { gate: "OR", transistors: 6, note: "NOR + Inverter" },
    {
      gate: "XOR",
      transistors: 12,
      note: "Complex-Gate-Design (AOI); 16 als 4 NANDs, weniger mit Pass-Transistor-Tricks",
    },
  ],
  hardwareHead: { gate: "Gatter", t: "Transistoren", note: "Aufbau" },
  hardwareFoot:
    "Weil NAND billig und allein-vollständig ist, synthetisieren ASIC-Werkzeuge oft ganze Schaltkreise zunächst in NAND2-Zellen, bevor sie platziert und verdrahtet werden. Der Chip ist buchstäblich ein Meer aus NANDs.",
  otherLabel: "Die zwei allein-vollständigen Gatter",
  otherBody:
    "NAND und NOR sind die einzigen binären booleschen Operatoren, die jeder für sich allein funktional vollständig sind. NOR wurde zuerst von Charles Sanders Peirce in einem Manuskript von 1880 notiert (posthum veröffentlicht). NAND wurde 1913 von Henry Sheffer publiziert; er zeigte, dass es das gesamte Primitivsystem der Principia Mathematica ersetzen kann. Russell und Whitehead fügten in der zweiten Auflage eine Notiz dazu an.",
  otherFormulaNor: "a ↓ b  =  ¬(a ∨ b)",
  otherFormulaNand: "a ↑ b  =  ¬(a ∧ b)",
  otherCardNand: "NAND · die Wahl des Chips",
  otherCardNor: "NOR · die Wahl von Apollo",
  closingPretitle: "Geh weiter",
  closingTitle: "Öffne den Builder.",
  closingBody:
    "Der Builder lässt dich ein Zielgatter wählen und seinen NAND-Skelettaufbau erscheinen, Transistor für Transistor. Verdrahte eigene Schaltkreise und sieh sie auf einen Wald identischer Striche schrumpfen.",
  closingCta: "→ Builder öffnen",
};

const es: RichStory = {
  encounter: {
    pretitle: "Primer encuentro",
    title: "Una puerta. Todo computador.",
    cards: [
      {
        label: "01",
        title: "La gran idea",
        body: "Una sola puerta lógica diminuta basta para construir cualquier computador jamás fabricado. NAND — abreviatura de «no-y» — devuelve 0 sólo cuando ambas entradas son 1. Conecta las suficientes y podrás computar cualquier cosa que cualquier otro circuito digital pueda computar. Sheffer lo demostró en 1913, y los chips modernos siguen funcionando con eso.",
      },
      {
        label: "02",
        title: "Un ejemplo concreto",
        body: "NAND es AND con la respuesta invertida. Mira la tabla de verdad: sólo una fila vale 0 (cuando ambas entradas son 1); las otras tres valen 1. De ese único hecho sale todo: NOT a = a NAND a. Dos NAND dan AND. Tres dan OR. Cuatro dan XOR. Lo demás es composición.",
      },
      {
        label: "03",
        title: "Por qué importa",
        body: "Las CPU modernas son, físicamente, un mar de puertas NAND grabadas en silicio — miles de millones, idénticas, en filas ordenadas. La complejidad de un procesador no está en las piezas, sino en el cableado. Escoge la primitiva correcta y todo se vuelve ensamblaje.",
      },
    ],
    tryIt: "Abajo: cambia los bits, mira las puertas recablearse, construye tú mismo el universo.",
  },
  sections: [
    {
      pretitle: "Sección 01 · La única puerta",
      title: "AND, pero invertido",
      body: "El trazo de Sheffer a ↑ b toma dos entradas binarias y devuelve una salida binaria. Devuelve 1 en tres de los cuatro casos posibles — sólo cuando ambas entradas son 1 devuelve 0. Esa es literalmente la definición: a ↑ b = ¬(a ∧ b). La pequeña flecha se llama a veces trazo de Sheffer, a veces se dibuja como barra (a | b). Es la misma operación en cualquier notación.",
    },
    {
      pretitle: "Sección 02 · Construir NOT",
      title: "Una puerta, ambas entradas unidas",
      body: "El primer milagro es NOT. Toma una sola NAND y mete la misma señal a en sus dos entradas. El resultado es a ↑ a = ¬(a ∧ a) = ¬a. Una puerta, sin extras. Desde ese momento, cualquier cosa que puedas construir con AND, OR y NOT — es decir, todo en la lógica clásica — puedes construirla sólo con NAND, porque NAND ya te da el AND y ahora también el NOT.",
    },
    {
      pretitle: "Sección 03 · AND, OR, XOR",
      title: "Dos, tres, cuatro puertas",
      body: "AND son dos NAND: primero calcula a ↑ b, luego niega el resultado con otra NAND (entradas unidas). OR sale de De Morgan: a ∨ b = ¬(¬a ∧ ¬b), que es exactamente (a ↑ a) ↑ (b ↑ b) — tres NAND. XOR necesita cuatro, dispuestas en un pequeño rombo. Una vez ves el patrón, toda función booleana se vuelve un grafo dirigido acíclico de celdas NAND idénticas. No hay otro ladrillo.",
    },
    {
      pretitle: "Sección 04 · Completitud funcional",
      title: "Por qué una puerta basta",
      body: "Un conjunto de operadores booleanos es funcionalmente completo si toda función booleana se puede expresar usando sólo esos operadores. {AND, OR, NOT} es completo — es el hecho estándar de manual. {AND, OR} solo no lo es: no hay forma de producir NOT a partir de AND y OR. {NAND} solo es completo porque produce NOT (uniendo entradas) y AND (negando su propia salida), y {AND, NOT} ya basta. Inductivamente: toda función booleana tiene una forma normal con AND, OR, NOT; reescribe cada una en NAND; listo.",
    },
    {
      pretitle: "Sección 05 · La realidad del hardware",
      title: "Por qué al silicio le encanta NAND",
      body: "CMOS — la tecnología detrás de prácticamente todo chip moderno — implementa NAND con sólo cuatro transistores: dos de tipo p en paralelo, dos de tipo n en serie. AND necesita seis (un NAND más un inversor), OR también seis. Toda puerta es más barata como NAND, y la salida de una NAND puede alimentar a otras NAND sin búfer extra. La fotolitografía replica entonces miles de millones de celdas NAND idénticas en la oblea. La CPU con la que lees esto es, a nivel de transistor, un océano de NAND.",
    },
    {
      pretitle: "Sección 06 · Otras puertas únicas completas",
      title: "NOR, la flecha de Peirce",
      body: "NAND no es la única puerta que por sí sola basta. Charles Sanders Peirce ya había notado, en un manuscrito inédito de 1880, que NOR — escrita a ↓ b = ¬(a ∨ b) — también es funcionalmente completa por sí misma. Sheffer redescubrió la versión NAND en 1913 y la publicó. Son los únicos dos operadores booleanos binarios con esa propiedad: cualquier otro necesita ayuda. El computador de guiado del Apollo se construyó enteramente con puertas NOR; el chip de tu bolsillo funciona con NAND. Dos formas de construir un universo.",
    },
  ],
  truthTable: {
    caption: "Tabla de verdad · pulsa una fila",
    labels: {
      a: "a",
      b: "b",
      nand: "a ↑ b",
      nota: "¬a",
      and: "a ∧ b",
      or: "a ∨ b",
      xor: "a ⊕ b",
      hint: "las cuatro puertas clásicas, derivadas sólo de NAND.",
      flip: "Pulsa una fila para resaltarla.",
    },
  },
  builder: {
    caption: "Composición de puertas · escoge un objetivo",
    labels: {
      not: "NOT",
      and: "AND",
      or: "OR",
      xor: "XOR",
      countOne: "1 puerta NAND.",
      countN: (n: number) => `${n} puertas NAND.`,
      circuit: (target, n) => `Circuito: ${target} construido con ${n} puerta${n > 1 ? "s" : ""} NAND`,
      description: {
        NOT: "Une las dos entradas de una sola NAND a la señal a.",
        AND: "NAND, después NAND con entradas unidas (= NOT). Dos puertas.",
        OR: "Dos NOT, alimentando una NAND. Tres puertas.",
        XOR: "Un rombo: un NAND se reparte en otros dos, un NAND final los junta. Cuatro puertas.",
      },
    },
  },
  intuitionLabel: "Intuición",
  intuitionBody:
    "Piensa en una puerta NAND como un pequeño guarda desconfiado. Sólo niega (devuelve 0) cuando ambos testigos están de acuerdo (a = 1 y b = 1). Cualquier otro testimonio — un desacuerdo, un silencio — y deja pasar con un 1. Esa única desconfianza, repetida, basta para computar todo.",
  notLabel: "NOT, en una sola puerta",
  notBody:
    "Une las dos entradas de una sola NAND y aliméntalas con el mismo cable a. La puerta ve (a, a). Si a = 1, ambas entradas son 1, la salida es 0 = ¬a. Si a = 0, al menos una entrada es 0, la salida es 1 = ¬a. Una puerta, ambos casos verificados.",
  notFormula: "¬a  =  a ↑ a",
  completenessLabel: "Completitud funcional",
  completenessBody:
    "Un conjunto de operadores booleanos es funcionalmente completo si toda tabla de verdad sobre n entradas se puede realizar con un circuito que use sólo esos operadores. Algunos conjuntos sirven, otros no.",
  completenessRows: [
    { set: "{NAND}", complete: true, note: "completo en solitario · Sheffer 1913" },
    { set: "{NOR}", complete: true, note: "completo en solitario · Peirce 1880 (inédito)" },
    { set: "{AND, OR, NOT}", complete: true, note: "la base de manual" },
    { set: "{AND, NOT}", complete: true, note: "OR vía De Morgan: ¬(¬a ∧ ¬b)" },
    { set: "{OR, NOT}", complete: true, note: "AND vía De Morgan: ¬(¬a ∨ ¬b)" },
    { set: "{AND, OR}", complete: false, note: "no se puede convertir un 1 en 0 — falta NOT" },
    { set: "{XOR, AND}", complete: true, note: "forma normal de Zhegalkin / algebraica" },
    { set: "{XOR}", complete: false, note: "sólo se alcanzan funciones lineales" },
  ],
  completenessYes: "completo",
  completenessNo: "incompleto",
  hardwareLabel: "Conteo de transistores CMOS",
  hardwareIntro:
    "Los chips modernos son CMOS — parejas de transistores n y p que tiran de la salida arriba o abajo. NAND es la puerta de dos entradas más barata.",
  hardwareRows: [
    { gate: "NAND", transistors: 4, note: "2 PMOS en paralelo + 2 NMOS en serie" },
    { gate: "NOR", transistors: 4, note: "2 PMOS en serie + 2 NMOS en paralelo" },
    { gate: "NOT", transistors: 2, note: "1 PMOS + 1 NMOS (inversor CMOS)" },
    { gate: "AND", transistors: 6, note: "NAND + inversor" },
    { gate: "OR", transistors: 6, note: "NOR + inversor" },
    {
      gate: "XOR",
      transistors: 12,
      note: "diseño de puerta compleja (AOI); 16 como 4 NAND, menos con trucos de pass-transistor",
    },
  ],
  hardwareHead: { gate: "puerta", t: "transistores", note: "construcción" },
  hardwareFoot:
    "Como NAND es barata y completa en solitario, las herramientas ASIC suelen sintetizar todo el circuito a celdas NAND2 antes del placement-and-routing. El chip es, literalmente, un mar de NAND.",
  otherLabel: "Las dos puertas únicas completas",
  otherBody:
    "NAND y NOR son los únicos operadores booleanos binarios funcionalmente completos por sí solos. NOR fue notado por primera vez por Charles Sanders Peirce en un manuscrito de 1880 (publicado póstumamente). NAND fue publicado por Henry Sheffer en 1913, quien mostró que podía reemplazar todo el sistema de primitivas de Principia Mathematica. Russell y Whitehead añadieron una nota al respecto en la segunda edición.",
  otherFormulaNor: "a ↓ b  =  ¬(a ∨ b)",
  otherFormulaNand: "a ↑ b  =  ¬(a ∧ b)",
  otherCardNand: "NAND · la elección del chip",
  otherCardNor: "NOR · la elección del Apollo",
  closingPretitle: "Ve más lejos",
  closingTitle: "Abre el Builder.",
  closingBody:
    "El Builder te deja escoger una puerta objetivo y ver aparecer su esqueleto NAND, transistor a transistor. Conecta tus propios circuitos y velos reducirse a un bosque de trazos idénticos.",
  closingCta: "→ Abrir el Builder",
};

const fr: RichStory = {
  encounter: {
    pretitle: "Première rencontre",
    title: "Une porte. Tout ordinateur.",
    cards: [
      {
        label: "01",
        title: "L'idée centrale",
        body: "Une seule petite porte logique suffit à construire n'importe quel ordinateur. NAND — abréviation de « non-et » — sort 0 uniquement quand les deux entrées valent 1. Cable-en assez et tu peux calculer tout ce qu'un autre circuit numérique peut calculer. Sheffer l'a prouvé en 1913, et les puces modernes tournent encore là-dessus.",
      },
      {
        label: "02",
        title: "Un exemple concret",
        body: "NAND est juste AND avec la réponse retournée. Regarde la table de vérité : une seule ligne vaut 0 (quand les deux entrées valent 1) ; les trois autres valent 1. De ce seul fait découle tout : NOT a = a NAND a. Deux NAND donnent AND. Trois donnent OR. Quatre donnent XOR. Le reste, c'est de la composition.",
      },
      {
        label: "03",
        title: "Pourquoi ça compte",
        body: "Les processeurs modernes sont physiquement une mer de portes NAND gravées dans le silicium — des milliards, identiques, en lignes bien rangées. La complexité d'un processeur n'est pas dans les pièces mais dans le câblage. Choisis la bonne primitive, et tout devient assemblage.",
      },
    ],
    tryIt:
      "Ci-dessous : retourne les bits, regarde les portes se recâbler, construis toi-même l'univers.",
  },
  sections: [
    {
      pretitle: "Section 01 · L'unique porte",
      title: "AND, mais retourné",
      body: "Le trait de Sheffer a ↑ b prend deux entrées binaires et renvoie une sortie binaire. Il vaut 1 dans trois des quatre cas possibles — uniquement quand les deux entrées valent 1 il sort 0. C'est littéralement la définition : a ↑ b = ¬(a ∧ b). La petite flèche s'appelle parfois trait de Sheffer, parfois on la note comme une barre (a | b). C'est la même opération dans chaque notation.",
    },
    {
      pretitle: "Section 02 · Construire NOT",
      title: "Une porte, deux entrées reliées",
      body: "Le premier miracle, c'est NOT. Prends une seule NAND et alimente ses deux entrées avec le même signal a. Le résultat est a ↑ a = ¬(a ∧ a) = ¬a. Une porte, sans rien d'autre. À partir de là, tout ce que tu peux construire avec AND, OR et NOT — c'est-à-dire tout en logique classique — tu peux le construire à partir de NAND seule, puisque NAND te donne déjà le AND et désormais le NOT.",
    },
    {
      pretitle: "Section 03 · AND, OR, XOR",
      title: "Deux, trois, quatre portes",
      body: "AND, c'est deux NAND : calcule d'abord a ↑ b, puis nie le résultat avec une autre NAND (entrées reliées). OR vient de De Morgan : a ∨ b = ¬(¬a ∧ ¬b), soit exactement (a ↑ a) ↑ (b ↑ b) — trois NAND. XOR en demande quatre, disposées en petit losange. Une fois le motif vu, toute fonction booléenne devient un graphe acyclique dirigé de cellules NAND identiques. Il n'y a pas d'autre brique.",
    },
    {
      pretitle: "Section 04 · Complétude fonctionnelle",
      title: "Pourquoi une porte suffit",
      body: "Un ensemble d'opérateurs booléens est fonctionnellement complet si toute fonction booléenne peut s'exprimer avec ces seuls opérateurs. {AND, OR, NOT} est complet — c'est le fait classique des manuels. {AND, OR} seuls ne le sont pas : on ne peut jamais produire NOT à partir de AND et OR. {NAND} seul est complet car il produit NOT (en reliant ses entrées) et AND (en niant sa propre sortie), et {AND, NOT} suffit déjà. Par induction : toute fonction booléenne admet une forme normale en AND, OR, NOT ; réécris chacun en NAND ; c'est fini.",
    },
    {
      pretitle: "Section 05 · La réalité du silicium",
      title: "Pourquoi le silicium adore NAND",
      body: "CMOS — la technologie derrière en gros toute puce moderne — réalise NAND avec seulement quatre transistors : deux p en parallèle, deux n en série. AND en demande six (un NAND suivi d'un inverseur), OR aussi. Toute porte coûte moins cher en NAND, et la sortie d'une NAND peut alimenter d'autres NAND sans tampon. La photolithographie reproduit ensuite des milliards de cellules NAND identiques sur la plaquette. Le processeur sur lequel tu lis ceci est, au niveau du transistor, un océan de NAND.",
    },
    {
      pretitle: "Section 06 · Les autres portes solitaires complètes",
      title: "NOR, la flèche de Peirce",
      body: "NAND n'est pas la seule porte à se suffire à elle-même. Charles Sanders Peirce avait déjà remarqué, dans un manuscrit inédit de 1880, que NOR — notée a ↓ b = ¬(a ∨ b) — est aussi fonctionnellement complète seule. Sheffer a redécouvert la version NAND en 1913 et l'a publiée. Ce sont les deux seuls opérateurs booléens binaires à cette propriété : tout autre opérateur binaire a besoin d'aide. L'ordinateur de bord d'Apollo a été bâti entièrement en portes NOR ; la puce dans ta poche tourne en NAND. Deux manières de construire un univers.",
    },
  ],
  truthTable: {
    caption: "Table de vérité · clique sur une ligne",
    labels: {
      a: "a",
      b: "b",
      nand: "a ↑ b",
      nota: "¬a",
      and: "a ∧ b",
      or: "a ∨ b",
      xor: "a ⊕ b",
      hint: "les quatre portes classiques, dérivées de NAND seule.",
      flip: "Clique sur une ligne pour la mettre en évidence.",
    },
  },
  builder: {
    caption: "Composition de portes · choisis une cible",
    labels: {
      not: "NOT",
      and: "AND",
      or: "OR",
      xor: "XOR",
      countOne: "1 porte NAND.",
      countN: (n: number) => `${n} portes NAND.`,
      circuit: (target, n) => `Circuit : ${target} construit avec ${n} porte${n > 1 ? "s" : ""} NAND`,
      description: {
        NOT: "Relie les deux entrées d'une seule NAND au signal a.",
        AND: "NAND, puis NAND à entrées reliées (= NOT). Deux portes.",
        OR: "Deux NOT, alimentant une NAND. Trois portes.",
        XOR: "Un losange : un NAND se sépare vers deux autres, une NAND finale les fusionne. Quatre portes.",
      },
    },
  },
  intuitionLabel: "Intuition",
  intuitionBody:
    "Vois une porte NAND comme un petit garde méfiant. Elle refuse (sort 0) uniquement quand les deux témoins sont d'accord (a = 1 et b = 1). Tout autre témoignage — un désaccord, un silence — et elle laisse passer avec un 1. Cette seule méfiance, répétée, suffit à tout calculer.",
  notLabel: "NOT, en une seule porte",
  notBody:
    "Relie les deux entrées d'une seule NAND et alimente-les avec le même fil a. La porte voit (a, a). Si a = 1, les deux entrées sont 1, la sortie est 0 = ¬a. Si a = 0, au moins une entrée est 0, la sortie est 1 = ¬a. Une porte, les deux cas vérifiés.",
  notFormula: "¬a  =  a ↑ a",
  completenessLabel: "Complétude fonctionnelle",
  completenessBody:
    "Un ensemble d'opérateurs booléens est fonctionnellement complet si toute table de vérité sur n entrées peut être réalisée avec un circuit n'utilisant que ces opérateurs. Certains ensembles marchent, d'autres non.",
  completenessRows: [
    { set: "{NAND}", complete: true, note: "complet seul · Sheffer 1913" },
    { set: "{NOR}", complete: true, note: "complet seul · Peirce 1880 (inédit)" },
    { set: "{AND, OR, NOT}", complete: true, note: "la base des manuels" },
    { set: "{AND, NOT}", complete: true, note: "OR via De Morgan : ¬(¬a ∧ ¬b)" },
    { set: "{OR, NOT}", complete: true, note: "AND via De Morgan : ¬(¬a ∨ ¬b)" },
    { set: "{AND, OR}", complete: false, note: "impossible de basculer un 1 en 0 — il manque NOT" },
    { set: "{XOR, AND}", complete: true, note: "forme normale de Zhegalkin / algébrique" },
    { set: "{XOR}", complete: false, note: "seules les fonctions linéaires sont atteignables" },
  ],
  completenessYes: "complet",
  completenessNo: "incomplet",
  hardwareLabel: "Comptes de transistors CMOS",
  hardwareIntro:
    "Les puces modernes sont en CMOS — des paires de transistors n et p qui tirent la sortie en haut ou en bas. NAND est la porte deux-entrées la moins chère à fabriquer.",
  hardwareRows: [
    { gate: "NAND", transistors: 4, note: "2 PMOS en parallèle + 2 NMOS en série" },
    { gate: "NOR", transistors: 4, note: "2 PMOS en série + 2 NMOS en parallèle" },
    { gate: "NOT", transistors: 2, note: "1 PMOS + 1 NMOS (inverseur CMOS)" },
    { gate: "AND", transistors: 6, note: "NAND + inverseur" },
    { gate: "OR", transistors: 6, note: "NOR + inverseur" },
    {
      gate: "XOR",
      transistors: 12,
      note: "conception à porte complexe (AOI); 16 en 4 NAND, moins avec des astuces pass-transistor",
    },
  ],
  hardwareHead: { gate: "porte", t: "transistors", note: "construction" },
  hardwareFoot:
    "Parce que NAND est bon marché et complet seul, les outils ASIC synthétisent souvent tout le circuit en cellules NAND2 avant placement-routage. La puce est, littéralement, un océan de NAND.",
  otherLabel: "Les deux portes solitaires complètes",
  otherBody:
    "NAND et NOR sont les deux seuls opérateurs booléens binaires fonctionnellement complets à eux seuls. NOR fut d'abord noté par Charles Sanders Peirce dans un manuscrit de 1880 (publié à titre posthume). NAND fut publié par Henry Sheffer en 1913, qui montra qu'il pouvait remplacer tout le système de primitives des Principia Mathematica. Russell et Whitehead ajoutèrent une note à ce sujet dans la seconde édition.",
  otherFormulaNor: "a ↓ b  =  ¬(a ∨ b)",
  otherFormulaNand: "a ↑ b  =  ¬(a ∧ b)",
  otherCardNand: "NAND · le choix de la puce",
  otherCardNor: "NOR · le choix d'Apollo",
  closingPretitle: "Aller plus loin",
  closingTitle: "Ouvre le Builder.",
  closingBody:
    "Le Builder te laisse choisir une porte cible et voir apparaître son squelette NAND, transistor par transistor. Câble tes propres circuits et regarde-les se réduire à une forêt de traits identiques.",
  closingCta: "→ Ouvrir le Builder",
};

const it: RichStory = {
  encounter: {
    pretitle: "Primo incontro",
    title: "Una porta. Ogni computer.",
    cards: [
      {
        label: "01",
        title: "L'idea centrale",
        body: "Una sola minuscola porta logica basta a costruire qualunque computer mai realizzato. NAND — abbreviazione di «non-e» — restituisce 0 solo quando entrambi gli ingressi sono 1. Collegane abbastanza e potrai calcolare tutto ciò che un qualunque altro circuito digitale calcola. Sheffer lo dimostrò nel 1913, e i chip moderni girano ancora su questo.",
      },
      {
        label: "02",
        title: "Un esempio concreto",
        body: "NAND è AND con la risposta capovolta. Guarda la tavola di verità: una sola riga vale 0 (quando entrambi gli ingressi sono 1); le altre tre valgono 1. Da questo unico fatto segue tutto: NOT a = a NAND a. Due NAND fanno AND. Tre fanno OR. Quattro fanno XOR. Il resto è composizione.",
      },
      {
        label: "03",
        title: "Perché conta",
        body: "Le CPU moderne sono, fisicamente, un mare di porte NAND incise nel silicio — miliardi, identiche, in file ordinate. La complessità di un processore non sta nei pezzi ma nei collegamenti. Scegli la primitiva giusta e tutto diventa assemblaggio.",
      },
    ],
    tryIt: "Sotto: capovolgi i bit, guarda le porte ricablearsi, costruisci tu stesso l'universo.",
  },
  sections: [
    {
      pretitle: "Sezione 01 · L'unica porta",
      title: "AND, ma rovesciato",
      body: "Il tratto di Sheffer a ↑ b prende due ingressi binari e dà un'uscita binaria. Vale 1 in tre dei quattro casi possibili — solo quando entrambi gli ingressi valgono 1 dà 0. È letteralmente la definizione: a ↑ b = ¬(a ∧ b). La piccola freccia si chiama talvolta tratto di Sheffer, talvolta si scrive come barra (a | b). È la stessa operazione in qualunque notazione.",
    },
    {
      pretitle: "Sezione 02 · Costruire NOT",
      title: "Una porta, due ingressi uniti",
      body: "Il primo miracolo è NOT. Prendi una singola NAND e porta lo stesso segnale a su entrambi gli ingressi. Il risultato è a ↑ a = ¬(a ∧ a) = ¬a. Una porta, niente di più. Da quel momento, tutto ciò che si costruisce con AND, OR e NOT — cioè tutto nella logica classica — si può costruire con la sola NAND, perché NAND ti dà già l'AND e ora anche il NOT.",
    },
    {
      pretitle: "Sezione 03 · AND, OR, XOR",
      title: "Due, tre, quattro porte",
      body: "AND sono due NAND: prima calcola a ↑ b, poi nega il risultato con un'altra NAND (ingressi uniti). OR viene da De Morgan: a ∨ b = ¬(¬a ∧ ¬b), cioè esattamente (a ↑ a) ↑ (b ↑ b) — tre NAND. XOR ne richiede quattro, disposte in un piccolo rombo. Una volta visto lo schema, ogni funzione booleana diventa un grafo aciclico orientato di celle NAND identiche. Non c'è altro mattone.",
    },
    {
      pretitle: "Sezione 04 · Completezza funzionale",
      title: "Perché basta una porta",
      body: "Un insieme di operatori booleani è funzionalmente completo se ogni funzione booleana si può esprimere usando solo quegli operatori. {AND, OR, NOT} è completo — è il fatto standard dei manuali. {AND, OR} da soli non lo sono: da AND e OR non si ottiene mai NOT. {NAND} da solo è completo perché produce NOT (unendo gli ingressi) e AND (negando la propria uscita), e {AND, NOT} basta già. Per induzione: ogni funzione booleana ha una forma normale in AND, OR, NOT; riscrivi ciascuno in NAND; fatto.",
    },
    {
      pretitle: "Sezione 05 · La realtà del silicio",
      title: "Perché al silicio piace NAND",
      body: "CMOS — la tecnologia dietro essenzialmente ogni chip moderno — realizza NAND con soli quattro transistor: due di tipo p in parallelo, due di tipo n in serie. AND ne richiede sei (NAND più inverter), anche OR sei. Ogni porta costa meno se costruita come NAND, e l'uscita di una NAND può alimentare altre NAND senza buffer. La fotolitografia poi replica miliardi di celle NAND identiche sul wafer. La CPU su cui stai leggendo è, a livello di transistor, un oceano di NAND.",
    },
    {
      pretitle: "Sezione 06 · Altre porte solitarie complete",
      title: "NOR, la freccia di Peirce",
      body: "NAND non è la sola porta che basti da sola. Charles Sanders Peirce aveva già notato, in un manoscritto inedito del 1880, che NOR — scritta a ↓ b = ¬(a ∨ b) — è anch'essa funzionalmente completa da sola. Sheffer riscoprì la versione NAND nel 1913 e la pubblicò. Sono i due soli operatori booleani binari con questa proprietà: ogni altro operatore binario ha bisogno di aiuto. L'Apollo Guidance Computer fu costruito interamente con porte NOR; il chip in tasca tua gira su NAND. Due modi di costruire un universo.",
    },
  ],
  truthTable: {
    caption: "Tavola di verità · clicca una riga",
    labels: {
      a: "a",
      b: "b",
      nand: "a ↑ b",
      nota: "¬a",
      and: "a ∧ b",
      or: "a ∨ b",
      xor: "a ⊕ b",
      hint: "le quattro porte classiche, derivate dalla sola NAND.",
      flip: "Clicca una riga per evidenziarla.",
    },
  },
  builder: {
    caption: "Composizione di porte · scegli un obiettivo",
    labels: {
      not: "NOT",
      and: "AND",
      or: "OR",
      xor: "XOR",
      countOne: "1 porta NAND.",
      countN: (n: number) => `${n} porte NAND.`,
      circuit: (target, n) => `Circuito: ${target} costruito con ${n} ${n > 1 ? "porte" : "porta"} NAND`,
      description: {
        NOT: "Unisci i due ingressi di una sola NAND al segnale a.",
        AND: "NAND, poi NAND con ingressi uniti (= NOT). Due porte.",
        OR: "Due NOT, in ingresso a una NAND. Tre porte.",
        XOR: "Un rombo: una NAND si dirama verso altre due, una NAND finale le unisce. Quattro porte.",
      },
    },
  },
  intuitionLabel: "Intuizione",
  intuitionBody:
    "Pensa a una porta NAND come a un piccolo guardiano sospettoso. Nega (dà 0) solo quando entrambi i testimoni sono d'accordo (a = 1 e b = 1). Qualunque altra testimonianza — un disaccordo, un silenzio — e fa passare con un 1. Questa unica sfiducia, ripetuta, basta a calcolare tutto.",
  notLabel: "NOT, in una sola porta",
  notBody:
    "Unisci i due ingressi di una sola NAND e alimentali con lo stesso filo a. La porta vede (a, a). Se a = 1, entrambi gli ingressi sono 1, l'uscita è 0 = ¬a. Se a = 0, almeno un ingresso è 0, l'uscita è 1 = ¬a. Una porta, entrambi i casi verificati.",
  notFormula: "¬a  =  a ↑ a",
  completenessLabel: "Completezza funzionale",
  completenessBody:
    "Un insieme di operatori booleani è funzionalmente completo se ogni tavola di verità su n ingressi può essere realizzata con un circuito che usi solo quegli operatori. Alcuni insiemi vanno bene, altri no.",
  completenessRows: [
    { set: "{NAND}", complete: true, note: "completa da sola · Sheffer 1913" },
    { set: "{NOR}", complete: true, note: "completa da sola · Peirce 1880 (inedito)" },
    { set: "{AND, OR, NOT}", complete: true, note: "la base dei manuali" },
    { set: "{AND, NOT}", complete: true, note: "OR via De Morgan: ¬(¬a ∧ ¬b)" },
    { set: "{OR, NOT}", complete: true, note: "AND via De Morgan: ¬(¬a ∨ ¬b)" },
    { set: "{AND, OR}", complete: false, note: "impossibile capovolgere 1 in 0 — manca NOT" },
    { set: "{XOR, AND}", complete: true, note: "forma normale di Zhegalkin / algebrica" },
    { set: "{XOR}", complete: false, note: "solo funzioni lineari raggiungibili" },
  ],
  completenessYes: "completo",
  completenessNo: "incompleto",
  hardwareLabel: "Conteggio dei transistor CMOS",
  hardwareIntro:
    "I chip moderni sono CMOS — coppie di transistor di tipo n e p che tirano l'uscita in alto o in basso. NAND è la porta a due ingressi più economica da costruire.",
  hardwareRows: [
    { gate: "NAND", transistors: 4, note: "2 PMOS in parallelo + 2 NMOS in serie" },
    { gate: "NOR", transistors: 4, note: "2 PMOS in serie + 2 NMOS in parallelo" },
    { gate: "NOT", transistors: 2, note: "1 PMOS + 1 NMOS (inverter CMOS)" },
    { gate: "AND", transistors: 6, note: "NAND + inverter" },
    { gate: "OR", transistors: 6, note: "NOR + inverter" },
    {
      gate: "XOR",
      transistors: 12,
      note: "progetto a porta complessa (AOI); 16 come 4 NAND, meno con trucchi a pass-transistor",
    },
  ],
  hardwareHead: { gate: "porta", t: "transistor", note: "costruzione" },
  hardwareFoot:
    "Poiché NAND è economica e completa da sola, gli strumenti ASIC spesso sintetizzano l'intero circuito in celle NAND2 prima del placement-and-routing. Il chip è, letteralmente, un mare di NAND.",
  otherLabel: "Le due porte solitarie complete",
  otherBody:
    "NAND e NOR sono i due soli operatori booleani binari funzionalmente completi da soli. NOR fu notato per la prima volta da Charles Sanders Peirce in un manoscritto del 1880 (pubblicato postumo). NAND fu pubblicato da Henry Sheffer nel 1913, che mostrò come potesse sostituire l'intero sistema di primitive dei Principia Mathematica. Russell e Whitehead aggiunsero una nota in proposito nella seconda edizione.",
  otherFormulaNor: "a ↓ b  =  ¬(a ∨ b)",
  otherFormulaNand: "a ↑ b  =  ¬(a ∧ b)",
  otherCardNand: "NAND · la scelta del chip",
  otherCardNor: "NOR · la scelta dell'Apollo",
  closingPretitle: "Vai oltre",
  closingTitle: "Apri il Builder.",
  closingBody:
    "Il Builder ti lascia scegliere una porta obiettivo e vederne apparire lo scheletro NAND, transistor per transistor. Cabla i tuoi circuiti e guardali ridursi a una foresta di tratti identici.",
  closingCta: "→ Apri il Builder",
};

const pt: RichStory = {
  encounter: {
    pretitle: "Primeiro encontro",
    title: "Uma porta. Todo computador.",
    cards: [
      {
        label: "01",
        title: "A ideia central",
        body: "Uma única porta lógica minúscula basta para construir qualquer computador alguma vez feito. NAND — abreviatura de «não-e» — devolve 0 só quando ambas as entradas são 1. Liga as suficientes e podes calcular tudo o que qualquer outro circuito digital calcula. Sheffer provou-o em 1913, e os chips modernos ainda correm assim.",
      },
      {
        label: "02",
        title: "Um exemplo concreto",
        body: "NAND é AND com a resposta invertida. Olha para a tabela de verdade: só uma linha vale 0 (quando ambas as entradas são 1); as outras três valem 1. Desse único facto sai tudo: NOT a = a NAND a. Duas NAND dão AND. Três dão OR. Quatro dão XOR. O resto é composição.",
      },
      {
        label: "03",
        title: "Porque importa",
        body: "Os CPUs modernos são, fisicamente, um mar de portas NAND gravadas em silício — milhares de milhões, idênticas, em filas arrumadas. A complexidade de um processador não está nas peças, mas no cabeamento. Escolhe a primitiva certa e tudo vira montagem.",
      },
    ],
    tryIt: "Abaixo: troca os bits, vê as portas a recabearem-se, constrói tu mesmo o universo.",
  },
  sections: [
    {
      pretitle: "Secção 01 · A única porta",
      title: "AND, mas ao contrário",
      body: "O traço de Sheffer a ↑ b recebe duas entradas binárias e devolve uma saída binária. Devolve 1 em três dos quatro casos possíveis — só quando ambas as entradas são 1 devolve 0. É literalmente a definição: a ↑ b = ¬(a ∧ b). A seta pequena chama-se às vezes traço de Sheffer, às vezes desenha-se como barra (a | b). É a mesma operação em qualquer notação.",
    },
    {
      pretitle: "Secção 02 · Construir NOT",
      title: "Uma porta, ambas as entradas unidas",
      body: "O primeiro milagre é NOT. Pega numa única NAND e liga o mesmo sinal a às duas entradas. O resultado é a ↑ a = ¬(a ∧ a) = ¬a. Uma porta, sem mais. A partir daí, tudo o que se constrói com AND, OR e NOT — ou seja, tudo na lógica clássica — também se constrói só com NAND, porque NAND já te dá o AND e agora também o NOT.",
    },
    {
      pretitle: "Secção 03 · AND, OR, XOR",
      title: "Duas, três, quatro portas",
      body: "AND são duas NAND: calcula primeiro a ↑ b, depois nega o resultado com outra NAND (entradas unidas). OR vem de De Morgan: a ∨ b = ¬(¬a ∧ ¬b), ou seja exatamente (a ↑ a) ↑ (b ↑ b) — três NAND. XOR precisa de quatro, dispostas num pequeno losango. Vista a regra, toda função booleana se torna um grafo dirigido acíclico de células NAND idênticas. Não há outro tijolo.",
    },
    {
      pretitle: "Secção 04 · Completude funcional",
      title: "Porque basta uma porta",
      body: "Um conjunto de operadores booleanos é funcionalmente completo se toda função booleana se pode exprimir usando só esses operadores. {AND, OR, NOT} é completo — é o facto-padrão dos manuais. {AND, OR} sozinhos não são: a partir de AND e OR nunca se produz NOT. {NAND} sozinho é completo porque produz NOT (unindo entradas) e AND (negando a própria saída), e {AND, NOT} já chega. Por indução: toda função booleana tem uma forma normal em AND, OR, NOT; reescreve cada um em NAND; pronto.",
    },
    {
      pretitle: "Secção 05 · A realidade do silício",
      title: "Porque o silício adora NAND",
      body: "CMOS — a tecnologia por trás de essencialmente cada chip moderno — realiza NAND com apenas quatro transístores: dois de tipo p em paralelo, dois de tipo n em série. AND precisa de seis (NAND mais inversor), OR também seis. Toda porta sai mais barata como NAND, e a saída de uma NAND pode alimentar outras NAND sem buffer extra. A fotolitografia depois replica milhares de milhões de células NAND idênticas no wafer. O CPU em que lês isto é, ao nível do transístor, um oceano de NAND.",
    },
    {
      pretitle: "Secção 06 · Outras portas solitárias completas",
      title: "NOR, a seta de Peirce",
      body: "NAND não é a única porta que basta sozinha. Charles Sanders Peirce já notara, num manuscrito inédito de 1880, que NOR — escrita a ↓ b = ¬(a ∨ b) — também é funcionalmente completa por si só. Sheffer redescobriu a versão NAND em 1913 e publicou-a. São os únicos dois operadores booleanos binários com esta propriedade: qualquer outro operador binário precisa de ajuda. O Apollo Guidance Computer foi construído inteiramente com portas NOR; o chip no teu bolso corre em NAND. Duas formas de construir um universo.",
    },
  ],
  truthTable: {
    caption: "Tabela de verdade · clica numa linha",
    labels: {
      a: "a",
      b: "b",
      nand: "a ↑ b",
      nota: "¬a",
      and: "a ∧ b",
      or: "a ∨ b",
      xor: "a ⊕ b",
      hint: "as quatro portas clássicas, derivadas só de NAND.",
      flip: "Clica numa linha para destacá-la.",
    },
  },
  builder: {
    caption: "Composição de portas · escolhe um alvo",
    labels: {
      not: "NOT",
      and: "AND",
      or: "OR",
      xor: "XOR",
      countOne: "1 porta NAND.",
      countN: (n: number) => `${n} portas NAND.`,
      circuit: (target, n) => `Circuito: ${target} construído com ${n} porta${n > 1 ? "s" : ""} NAND`,
      description: {
        NOT: "Liga as duas entradas de uma única NAND ao sinal a.",
        AND: "NAND, depois NAND com entradas unidas (= NOT). Duas portas.",
        OR: "Dois NOT, à entrada de uma NAND. Três portas.",
        XOR: "Um losango: uma NAND ramifica em outras duas, uma NAND final junta-as. Quatro portas.",
      },
    },
  },
  intuitionLabel: "Intuição",
  intuitionBody:
    "Pensa numa porta NAND como um pequeno guarda desconfiado. Só recusa (devolve 0) quando ambas as testemunhas concordam (a = 1 e b = 1). Qualquer outro testemunho — discordância, silêncio — e deixa passar com um 1. Essa única desconfiança, repetida, basta para calcular tudo.",
  notLabel: "NOT, numa só porta",
  notBody:
    "Une as duas entradas de uma única NAND e alimenta-as com o mesmo fio a. A porta vê (a, a). Se a = 1, ambas as entradas são 1, a saída é 0 = ¬a. Se a = 0, pelo menos uma entrada é 0, a saída é 1 = ¬a. Uma porta, ambos os casos verificados.",
  notFormula: "¬a  =  a ↑ a",
  completenessLabel: "Completude funcional",
  completenessBody:
    "Um conjunto de operadores booleanos é funcionalmente completo se toda tabela de verdade sobre n entradas pode ser realizada com um circuito que use só esses operadores. Alguns conjuntos servem, outros não.",
  completenessRows: [
    { set: "{NAND}", complete: true, note: "completa sozinha · Sheffer 1913" },
    { set: "{NOR}", complete: true, note: "completa sozinha · Peirce 1880 (inédito)" },
    { set: "{AND, OR, NOT}", complete: true, note: "a base dos manuais" },
    { set: "{AND, NOT}", complete: true, note: "OR via De Morgan: ¬(¬a ∧ ¬b)" },
    { set: "{OR, NOT}", complete: true, note: "AND via De Morgan: ¬(¬a ∨ ¬b)" },
    { set: "{AND, OR}", complete: false, note: "impossível trocar 1 por 0 — falta NOT" },
    { set: "{XOR, AND}", complete: true, note: "forma normal de Zhegalkin / algébrica" },
    { set: "{XOR}", complete: false, note: "só funções lineares alcançáveis" },
  ],
  completenessYes: "completo",
  completenessNo: "incompleto",
  hardwareLabel: "Contagem de transístores CMOS",
  hardwareIntro:
    "Os chips modernos são CMOS — pares de transístores n e p que puxam a saída para cima ou para baixo. NAND é a porta de duas entradas mais barata de construir.",
  hardwareRows: [
    { gate: "NAND", transistors: 4, note: "2 PMOS em paralelo + 2 NMOS em série" },
    { gate: "NOR", transistors: 4, note: "2 PMOS em série + 2 NMOS em paralelo" },
    { gate: "NOT", transistors: 2, note: "1 PMOS + 1 NMOS (inversor CMOS)" },
    { gate: "AND", transistors: 6, note: "NAND + inversor" },
    { gate: "OR", transistors: 6, note: "NOR + inversor" },
    {
      gate: "XOR",
      transistors: 12,
      note: "design de porta complexa (AOI); 16 como 4 NAND, menos com truques de pass-transistor",
    },
  ],
  hardwareHead: { gate: "porta", t: "transístores", note: "construção" },
  hardwareFoot:
    "Porque NAND é barata e completa sozinha, as ferramentas ASIC sintetizam frequentemente todo o circuito em células NAND2 antes do placement-and-routing. O chip é, literalmente, um mar de NAND.",
  otherLabel: "As duas portas solitárias completas",
  otherBody:
    "NAND e NOR são os únicos dois operadores booleanos binários funcionalmente completos por si só. NOR foi notado pela primeira vez por Charles Sanders Peirce num manuscrito de 1880 (publicado postumamente). NAND foi publicado por Henry Sheffer em 1913, que mostrou poder substituir todo o sistema de primitivas dos Principia Mathematica. Russell e Whitehead acrescentaram uma nota a respeito na segunda edição.",
  otherFormulaNor: "a ↓ b  =  ¬(a ∨ b)",
  otherFormulaNand: "a ↑ b  =  ¬(a ∧ b)",
  otherCardNand: "NAND · a escolha do chip",
  otherCardNor: "NOR · a escolha do Apollo",
  closingPretitle: "Vai mais longe",
  closingTitle: "Abre o Builder.",
  closingBody:
    "O Builder deixa-te escolher uma porta-alvo e ver aparecer o seu esqueleto NAND, transístor a transístor. Cableia os teus próprios circuitos e vê-os reduzirem-se a uma floresta de traços idênticos.",
  closingCta: "→ Abrir o Builder",
};

const sv: RichStory = {
  encounter: {
    pretitle: "Första mötet",
    title: "En grind. Varje dator.",
    cards: [
      {
        label: "01",
        title: "Den stora idén",
        body: "En enda liten logisk grind räcker för att bygga vilken dator som helst som någonsin tillverkats. NAND — kort för «icke-och» — ger 0 endast när båda ingångarna är 1. Koppla ihop tillräckligt många och du kan beräkna allt som någon annan digital krets kan beräkna. Sheffer bevisade det 1913, och moderna chip kör fortfarande på det.",
      },
      {
        label: "02",
        title: "Ett konkret exempel",
        body: "NAND är AND med svaret omvänt. Titta på sanningstabellen: bara en rad är 0 (när båda ingångarna är 1); de övriga tre är 1. Ur det enda faktum följer allt: NOT a = a NAND a. Två NAND ger AND. Tre ger OR. Fyra ger XOR. Resten är komposition.",
      },
      {
        label: "03",
        title: "Varför det spelar roll",
        body: "Moderna CPU:er är fysiskt ett hav av NAND-grindar etsade i kisel — miljarder, identiska, i prydliga rader. En processors komplexitet sitter inte i delarna utan i ledningsdragningen. Välj rätt primitiv, så blir allt montering.",
      },
    ],
    tryIt: "Nedan: vänd bitarna, se grindarna kopplas om, bygg själv universum.",
  },
  sections: [
    {
      pretitle: "Avsnitt 01 · Den enda grinden",
      title: "AND, men omvänt",
      body: "Sheffers streck a ↑ b tar två binära ingångar och ger en binär utgång. Den ger 1 i tre av de fyra möjliga fallen: endast när båda ingångarna är 1 ger den 0. Det är bokstavligen definitionen: a ↑ b = ¬(a ∧ b). Den lilla pilen kallas ibland Sheffer-streck, ibland ritas den som ett streck (a | b). Det är samma operation i alla notationer.",
    },
    {
      pretitle: "Avsnitt 02 · Bygga NOT",
      title: "En grind, båda ingångarna kopplade",
      body: "Det första miraklet är NOT. Ta en enda NAND och mata in samma signal a i båda dess ingångar. Resultatet är a ↑ a = ¬(a ∧ a) = ¬a. En grind, inget mer. Från det ögonblicket går allt som du kan bygga av AND, OR och NOT — det vill säga allt i klassisk logik — att bygga av enbart NAND, för NAND ger dig redan AND-delen och nu har du NOT.",
    },
    {
      pretitle: "Avsnitt 03 · AND, OR, XOR",
      title: "Två, tre, fyra grindar",
      body: "AND är två NAND: räkna först ut a ↑ b, negera sedan resultatet med en till NAND (kopplade ingångar). OR följer av De Morgan: a ∨ b = ¬(¬a ∧ ¬b), vilket är exakt (a ↑ a) ↑ (b ↑ b) — tre NAND. XOR behöver fyra, ordnade som en liten ruta. När du väl ser mönstret blir varje boolesk funktion en riktad acyklisk graf av identiska NAND-celler. Det finns ingen annan byggsten.",
    },
    {
      pretitle: "Avsnitt 04 · Funktionell fullständighet",
      title: "Varför en grind räcker",
      body: "En mängd booleska operatorer är funktionellt fullständig om varje boolesk funktion kan uttryckas med enbart dessa operatorer. {AND, OR, NOT} är fullständig — det är standardkursfaktumet. {AND, OR} ensamma är det inte: NOT kan aldrig produceras ur AND och OR. {NAND} ensamt är fullständigt eftersom det ger NOT (genom att koppla ingångarna) och AND (genom att negera sin egen utgång), och {AND, NOT} räcker redan. Induktivt: varje boolesk funktion har en normalform av AND, OR, NOT; skriv om var och en i NAND; klart.",
    },
    {
      pretitle: "Avsnitt 05 · Hårdvarans verklighet",
      title: "Varför kisel älskar NAND",
      body: "CMOS — tekniken bakom i princip varje modernt chip — bygger NAND med bara fyra transistorer: två p-typer parallellt, två n-typer i serie. AND kräver sex (NAND plus inverterare), OR också sex. Varje grind blir billigare som NAND, och en NAND-utgång kan driva andra NAND utan extra buffert. Fotolitografin replikerar sedan miljarder identiska NAND-celler över wafern. Processorn du läser detta på är, på transistornivå, ett hav av NAND.",
    },
    {
      pretitle: "Avsnitt 06 · Andra ensamma fullständiga grindar",
      title: "NOR, Peirces pil",
      body: "NAND är inte ensamt om att räcka ensamt. Charles Sanders Peirce hade redan noterat, i ett opublicerat manuskript från 1880, att NOR — skriven a ↓ b = ¬(a ∨ b) — också är funktionellt fullständig på egen hand. Sheffer återupptäckte NAND-versionen 1913 och publicerade. Det är de enda två binära booleska operatorer med denna egenskap: varje annan binär operator behöver hjälp. Apollo Guidance Computer byggdes helt av NOR-grindar; chipet i din ficka kör på NAND. Två sätt att bygga ett universum.",
    },
  ],
  truthTable: {
    caption: "Sanningstabell · klicka på en rad",
    labels: {
      a: "a",
      b: "b",
      nand: "a ↑ b",
      nota: "¬a",
      and: "a ∧ b",
      or: "a ∨ b",
      xor: "a ⊕ b",
      hint: "alla fyra klassiska grindar, härledda enbart ur NAND.",
      flip: "Klicka på en rad för att markera den.",
    },
  },
  builder: {
    caption: "Grindkomposition · välj ett mål",
    labels: {
      not: "NOT",
      and: "AND",
      or: "OR",
      xor: "XOR",
      countOne: "1 NAND-grind.",
      countN: (n: number) => `${n} NAND-grindar.`,
      circuit: (target, n) => `Krets: ${target} byggd av ${n} NAND-grind${n > 1 ? "ar" : ""}`,
      description: {
        NOT: "Koppla båda ingångarna på en enda NAND till signalen a.",
        AND: "NAND, sedan NAND med kopplade ingångar (= NOT). Två grindar.",
        OR: "Två NOT, matar en NAND. Tre grindar.",
        XOR: "En ruta: en NAND grenar ut till två andra, en sista NAND förenar. Fyra grindar.",
      },
    },
  },
  intuitionLabel: "Intuition",
  intuitionBody:
    "Tänk på en NAND-grind som en liten misstänksam vakt. Den vägrar (ger 0) bara när båda vittnena är överens (a = 1 och b = 1). All annan vittnesutsaga — oenighet, tystnad — och den vinkar igenom med en 1. Den enda misstron, upprepad, räcker för att beräkna allt.",
  notLabel: "NOT, i en enda grind",
  notBody:
    "Koppla samman de två ingångarna på en enda NAND och mata båda med samma tråd a. Grinden ser (a, a). Om a = 1 är båda ingångarna 1, utgången är 0 = ¬a. Om a = 0 är minst en ingång 0, utgången är 1 = ¬a. En grind, båda fallen verifierade.",
  notFormula: "¬a  =  a ↑ a",
  completenessLabel: "Funktionell fullständighet",
  completenessBody:
    "En mängd booleska operatorer är funktionellt fullständig om varje sanningstabell på n ingångar kan realiseras med en krets som bara använder dessa operatorer. Vissa mängder duger, andra inte.",
  completenessRows: [
    { set: "{NAND}", complete: true, note: "ensam fullständig · Sheffer 1913" },
    { set: "{NOR}", complete: true, note: "ensam fullständig · Peirce 1880 (opublicerat)" },
    { set: "{AND, OR, NOT}", complete: true, note: "kursbokens bas" },
    { set: "{AND, NOT}", complete: true, note: "OR via De Morgan: ¬(¬a ∧ ¬b)" },
    { set: "{OR, NOT}", complete: true, note: "AND via De Morgan: ¬(¬a ∨ ¬b)" },
    { set: "{AND, OR}", complete: false, note: "går inte att vända 1 till 0 — saknar NOT" },
    { set: "{XOR, AND}", complete: true, note: "Zhegalkin / algebraisk normalform" },
    { set: "{XOR}", complete: false, note: "endast linjära funktioner går att nå" },
  ],
  completenessYes: "fullständig",
  completenessNo: "ofullständig",
  hardwareLabel: "CMOS-transistorräkning",
  hardwareIntro:
    "Moderna chip är CMOS — par av n- och p-typ-transistorer som drar utgången hög eller låg. NAND är den billigaste tvåingångsgrinden att bygga.",
  hardwareRows: [
    { gate: "NAND", transistors: 4, note: "2 PMOS parallellt + 2 NMOS i serie" },
    { gate: "NOR", transistors: 4, note: "2 PMOS i serie + 2 NMOS parallellt" },
    { gate: "NOT", transistors: 2, note: "1 PMOS + 1 NMOS (CMOS-inverterare)" },
    { gate: "AND", transistors: 6, note: "NAND + inverterare" },
    { gate: "OR", transistors: 6, note: "NOR + inverterare" },
    {
      gate: "XOR",
      transistors: 12,
      note: "complex-gate-design (AOI); 16 som 4 NAND, färre med pass-transistor-tricks",
    },
  ],
  hardwareHead: { gate: "grind", t: "transistorer", note: "konstruktion" },
  hardwareFoot:
    "Eftersom NAND är billig och ensam fullständig syntetiserar ASIC-verktyg ofta hela kretsen i NAND2-celler innan placement-and-routing. Chipet är, bokstavligen, ett hav av NAND.",
  otherLabel: "De två ensamma fullständiga grindarna",
  otherBody:
    "NAND och NOR är de enda två binära booleska operatorer som var och en på egen hand är funktionellt fullständig. NOR noterades först av Charles Sanders Peirce i ett manuskript från 1880 (postumt publicerat). NAND publicerades av Henry Sheffer 1913, som visade att det kunde ersätta hela primitivsystemet i Principia Mathematica. Russell och Whitehead lade till en not om det i andra upplagan.",
  otherFormulaNor: "a ↓ b  =  ¬(a ∨ b)",
  otherFormulaNand: "a ↑ b  =  ¬(a ∧ b)",
  otherCardNand: "NAND · chipets val",
  otherCardNor: "NOR · Apollos val",
  closingPretitle: "Gå vidare",
  closingTitle: "Öppna Byggaren.",
  closingBody:
    "Byggaren låter dig välja en målgrind och se dess NAND-skelett dyka upp, transistor för transistor. Koppla dina egna kretsar och se dem krympa till en skog av identiska streck.",
  closingCta: "→ Öppna Byggaren",
};

const no: RichStory = {
  encounter: {
    pretitle: "Første møte",
    title: "Én port. Hver datamaskin.",
    cards: [
      {
        label: "01",
        title: "Den store ideen",
        body: "Én eneste liten logisk port er nok til å bygge enhver datamaskin som noensinne er laget. NAND — kort for «ikke-og» — gir 0 bare når begge inngangene er 1. Koble nok av dem sammen og du kan beregne alt som en hvilken som helst annen digital krets kan beregne. Sheffer beviste det i 1913, og moderne brikker kjører fortsatt på det.",
      },
      {
        label: "02",
        title: "Et konkret eksempel",
        body: "NAND er bare AND med svaret snudd. Se på sannhetstabellen: bare én rad er 0 (når begge inngangene er 1); de andre tre er 1. Ut fra det ene faktum følger alt: NOT a = a NAND a. To NAND gir AND. Tre gir OR. Fire gir XOR. Resten er sammensetning.",
      },
      {
        label: "03",
        title: "Hvorfor det betyr noe",
        body: "Moderne CPU-er er fysisk et hav av NAND-porter etset inn i silisium — milliarder, identiske, i ryddige rader. Kompleksiteten til en prosessor ligger ikke i delene, men i ledningsføringen. Velg den rette primitiven, så blir alt montering.",
      },
    ],
    tryIt: "Under: vipp bitene, se portene koble seg om, bygg selv universet.",
  },
  sections: [
    {
      pretitle: "Avsnitt 01 · Den ene porten",
      title: "AND, men snudd",
      body: "Sheffer-streken a ↑ b tar to binære innganger og gir én binær utgang. Den gir 1 i tre av de fire mulige tilfellene — bare når begge inngangene er 1 gir den 0. Det er bokstavelig talt definisjonen: a ↑ b = ¬(a ∧ b). Den lille pilen kalles iblant Sheffer-strek, iblant tegnes den som en strek (a | b). Det er den samme operasjonen i hvilken som helst notasjon.",
    },
    {
      pretitle: "Avsnitt 02 · Bygge NOT",
      title: "Én port, begge innganger koblet",
      body: "Det første mirakelet er NOT. Ta én enkelt NAND og før det samme signalet a inn på begge inngangene. Resultatet er a ↑ a = ¬(a ∧ a) = ¬a. Én port, ikke noe mer. Fra det øyeblikket kan alt du kan bygge av AND, OR og NOT — altså alt i klassisk logikk — også bygges av NAND alene, fordi NAND allerede gir deg AND-delen og nå har du NOT.",
    },
    {
      pretitle: "Avsnitt 03 · AND, OR, XOR",
      title: "To, tre, fire porter",
      body: "AND er to NAND: regn først ut a ↑ b, så negér resultatet med en annen NAND (koblede innganger). OR følger av De Morgan: a ∨ b = ¬(¬a ∧ ¬b), altså nøyaktig (a ↑ a) ↑ (b ↑ b) — tre NAND. XOR trenger fire, ordnet som en liten rute. Når du først ser mønsteret blir hver boolsk funksjon en rettet asyklisk graf av identiske NAND-celler. Det finnes ingen annen byggekloss.",
    },
    {
      pretitle: "Avsnitt 04 · Funksjonell fullstendighet",
      title: "Hvorfor én port holder",
      body: "Et sett boolske operatorer er funksjonelt fullstendig hvis enhver boolsk funksjon kan uttrykkes ved bare disse operatorene. {AND, OR, NOT} er fullstendig — det er kursbokas standardfakta. {AND, OR} alene er det ikke: man får aldri NOT ut av AND og OR. {NAND} alene er fullstendig fordi det gir NOT (ved å koble inngangene) og AND (ved å negere sin egen utgang), og {AND, NOT} er allerede nok. Induktivt: hver boolsk funksjon har en normalform i AND, OR, NOT; skriv hver av disse om i NAND; ferdig.",
    },
    {
      pretitle: "Avsnitt 05 · Maskinvarens virkelighet",
      title: "Hvorfor silisium elsker NAND",
      body: "CMOS — teknologien bak i grunnen hver moderne brikke — implementerer NAND med bare fire transistorer: to p-type parallelt, to n-type i serie. AND krever seks (NAND pluss inverter), OR også seks. Hver port blir billigere som NAND, og en NAND-utgang kan drive andre NAND-er uten ekstra buffer. Fotolitografi reproduserer så milliarder av identiske NAND-celler over waferen. Prosessoren du leser dette på er, på transistornivå, et hav av NAND.",
    },
    {
      pretitle: "Avsnitt 06 · Andre alene-fullstendige porter",
      title: "NOR, Peirce-pilen",
      body: "NAND er ikke alene om å klare seg alene. Charles Sanders Peirce hadde allerede notert, i et upublisert manuskript fra 1880, at NOR — skrevet a ↓ b = ¬(a ∨ b) — også er funksjonelt fullstendig alene. Sheffer gjenoppdaget NAND-varianten i 1913 og publiserte. Det er de eneste to binære boolske operatorene med denne egenskapen: enhver annen binær operator trenger hjelp. Apollo Guidance Computer ble bygget utelukkende av NOR-porter; brikken i lommen din kjører på NAND. To måter å bygge et univers.",
    },
  ],
  truthTable: {
    caption: "Sannhetstabell · klikk på en rad",
    labels: {
      a: "a",
      b: "b",
      nand: "a ↑ b",
      nota: "¬a",
      and: "a ∧ b",
      or: "a ∨ b",
      xor: "a ⊕ b",
      hint: "alle fire klassiske porter, utledet fra NAND alene.",
      flip: "Klikk på en rad for å markere den.",
    },
  },
  builder: {
    caption: "Portsammensetning · velg et mål",
    labels: {
      not: "NOT",
      and: "AND",
      or: "OR",
      xor: "XOR",
      countOne: "1 NAND-port.",
      countN: (n: number) => `${n} NAND-porter.`,
      circuit: (target, n) => `Krets: ${target} bygd av ${n} NAND-port${n > 1 ? "er" : ""}`,
      description: {
        NOT: "Koble begge inngangene på én enkelt NAND til signalet a.",
        AND: "NAND, så NAND med koblede innganger (= NOT). To porter.",
        OR: "To NOT, inn i en NAND. Tre porter.",
        XOR: "En rute: én NAND forgrener til to andre, en siste NAND samler dem. Fire porter.",
      },
    },
  },
  intuitionLabel: "Intuisjon",
  intuitionBody:
    "Tenk på en NAND-port som en liten mistenksom vakt. Den nekter (gir 0) bare når begge vitnene er enige (a = 1 og b = 1). Enhver annen vitneutsagn — uenighet, taushet — og den slipper gjennom med en 1. Den ene mistilliten, gjentatt, er nok til å beregne alt.",
  notLabel: "NOT, i én port",
  notBody:
    "Koble sammen de to inngangene på én enkelt NAND og mat begge med samme ledning a. Porten ser (a, a). Hvis a = 1 er begge inngangene 1, utgangen er 0 = ¬a. Hvis a = 0 er minst én inngang 0, utgangen er 1 = ¬a. Én port, begge tilfeller verifisert.",
  notFormula: "¬a  =  a ↑ a",
  completenessLabel: "Funksjonell fullstendighet",
  completenessBody:
    "Et sett boolske operatorer er funksjonelt fullstendig hvis enhver sannhetstabell på n innganger kan realiseres med en krets som bare bruker disse operatorene. Noen sett duger, andre ikke.",
  completenessRows: [
    { set: "{NAND}", complete: true, note: "alene fullstendig · Sheffer 1913" },
    { set: "{NOR}", complete: true, note: "alene fullstendig · Peirce 1880 (upublisert)" },
    { set: "{AND, OR, NOT}", complete: true, note: "kursbokas grunnlag" },
    { set: "{AND, NOT}", complete: true, note: "OR via De Morgan: ¬(¬a ∧ ¬b)" },
    { set: "{OR, NOT}", complete: true, note: "AND via De Morgan: ¬(¬a ∨ ¬b)" },
    { set: "{AND, OR}", complete: false, note: "ingen måte å snu 1 til 0 — mangler NOT" },
    { set: "{XOR, AND}", complete: true, note: "Zhegalkin / algebraisk normalform" },
    { set: "{XOR}", complete: false, note: "bare lineære funksjoner nås" },
  ],
  completenessYes: "fullstendig",
  completenessNo: "ufullstendig",
  hardwareLabel: "CMOS-transistorantall",
  hardwareIntro:
    "Moderne brikker er CMOS — par av n- og p-type-transistorer som trekker utgangen høyt eller lavt. NAND er den billigste toinngangsporten å bygge.",
  hardwareRows: [
    { gate: "NAND", transistors: 4, note: "2 PMOS parallelt + 2 NMOS i serie" },
    { gate: "NOR", transistors: 4, note: "2 PMOS i serie + 2 NMOS parallelt" },
    { gate: "NOT", transistors: 2, note: "1 PMOS + 1 NMOS (CMOS-inverter)" },
    { gate: "AND", transistors: 6, note: "NAND + inverter" },
    { gate: "OR", transistors: 6, note: "NOR + inverter" },
    {
      gate: "XOR",
      transistors: 12,
      note: "complex-gate-design (AOI); 16 som 4 NAND, færre med pass-transistor-triks",
    },
  ],
  hardwareHead: { gate: "port", t: "transistorer", note: "konstruksjon" },
  hardwareFoot:
    "Fordi NAND er billig og alene fullstendig, syntetiserer ASIC-verktøy ofte hele kretsen i NAND2-celler før placement-and-routing. Brikken er, bokstavelig talt, et hav av NAND.",
  otherLabel: "De to alene-fullstendige portene",
  otherBody:
    "NAND og NOR er de eneste to binære boolske operatorene som hver for seg alene er funksjonelt fullstendige. NOR ble først notert av Charles Sanders Peirce i et manuskript fra 1880 (publisert posthumt). NAND ble publisert av Henry Sheffer i 1913, som viste at det kunne erstatte hele primitivsystemet i Principia Mathematica. Russell og Whitehead la til en merknad om det i andre utgave.",
  otherFormulaNor: "a ↓ b  =  ¬(a ∨ b)",
  otherFormulaNand: "a ↑ b  =  ¬(a ∧ b)",
  otherCardNand: "NAND · brikkens valg",
  otherCardNor: "NOR · Apollos valg",
  closingPretitle: "Gå videre",
  closingTitle: "Åpne Byggeren.",
  closingBody:
    "Byggeren lar deg velge en målport og se NAND-skjelettet dukke opp, transistor for transistor. Koble dine egne kretser og se dem krympe til en skog av identiske streker.",
  closingCta: "→ Åpne Byggeren",
};

const RICH_STORY: Record<Locale, RichStory> = { en, de, es, fr, it, pt, sv, no };

// --------------------------------------------------------------------------

export default function NandStory() {
  const { locale, s, u } = useI18n();
  const page = s.pages.nand;
  const story = RICH_STORY[locale];
  const [sec0, sec1, sec2, sec3, sec4, sec5] = story.sections;

  return (
    <main className="relative isolate min-h-screen px-6 pb-32 pt-24">
      <div className="grid-bg pointer-events-none fixed inset-0 -z-10 opacity-30" />
      <div className="from-signal-violet/12 pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b via-transparent to-ink-950" />

      {/* Hero — unchanged structure */}
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
              href="/nand/builder"
              className="rounded-full border border-signal-violet/70 bg-signal-violet/10 px-6 py-3 font-mono text-xs uppercase tracking-widest2 text-signal-violet transition-colors hover:bg-signal-violet/20"
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
            a ↑ b = ¬(a ∧ b)
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
                        0 ↑ 0 = <span className="text-signal-violet">1</span>
                      </div>
                      <div>
                        0 ↑ 1 = <span className="text-signal-violet">1</span>
                      </div>
                      <div>
                        1 ↑ 0 = <span className="text-signal-violet">1</span>
                      </div>
                      <div>
                        1 ↑ 1 = <span className="text-signal-rose">0</span>
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

      {/* Section 01 — the single gate */}
      <section className="mx-auto mb-32 max-w-5xl space-y-8">
        <StoryCard pretitle={sec0.pretitle} title={sec0.title} body={sec0.body} accent={ACCENT} />
        <Reveal delay={120}>
          <div className="hairline grid grid-cols-1 items-center gap-6 rounded-2xl border bg-ink-950/40 p-6 md:grid-cols-2">
            <div>
              <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT} mb-3`}>
                a ↑ b
              </div>
              <table className="w-full text-center font-mono">
                <thead className="hairline border-b text-ink-300">
                  <tr>
                    <th className="px-3 py-2 text-xs uppercase tracking-widest">a</th>
                    <th className="px-3 py-2 text-xs uppercase tracking-widest">b</th>
                    <th className="px-3 py-2 text-xs uppercase tracking-widest text-signal-violet">
                      a ↑ b
                    </th>
                  </tr>
                </thead>
                <tbody className="text-ink-100">
                  <tr className="border-b border-ink-700/30">
                    <td className="py-2">0</td>
                    <td>0</td>
                    <td className="text-signal-violet">1</td>
                  </tr>
                  <tr className="border-b border-ink-700/30">
                    <td className="py-2">0</td>
                    <td>1</td>
                    <td className="text-signal-violet">1</td>
                  </tr>
                  <tr className="border-b border-ink-700/30">
                    <td className="py-2">1</td>
                    <td>0</td>
                    <td className="text-signal-violet">1</td>
                  </tr>
                  <tr>
                    <td className="py-2">1</td>
                    <td>1</td>
                    <td className="text-lg text-signal-rose">0</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="space-y-2 text-sm leading-relaxed text-ink-200">
              <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
                {story.intuitionLabel}
              </div>
              <p>{story.intuitionBody}</p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Section 02 — building NOT */}
      <section className="mx-auto mb-32 max-w-5xl space-y-8">
        <StoryCard pretitle={sec1.pretitle} title={sec1.title} body={sec1.body} accent={ACCENT} />
        <Reveal delay={120}>
          <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-8 text-center">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {story.notLabel}
            </div>
            <div className="math-italic text-3xl leading-tight text-ink-100 md:text-4xl">
              {story.notFormula}
            </div>
            <p className="mx-auto max-w-xl text-sm leading-relaxed text-ink-300">{story.notBody}</p>
          </div>
        </Reveal>
      </section>

      {/* INTERACTIVE 1 — truth table playground */}
      <section className="mx-auto mb-32 max-w-5xl space-y-4">
        <Reveal>
          <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT} text-center`}>
            {story.truthTable.caption}
          </div>
        </Reveal>
        <Reveal delay={120}>
          <NandTruthTable caption={story.truthTable.caption} labels={story.truthTable.labels} />
        </Reveal>
      </section>

      {/* Section 03 — AND, OR, XOR — wired together */}
      <section className="mx-auto mb-32 max-w-5xl space-y-8">
        <StoryCard pretitle={sec2.pretitle} title={sec2.title} body={sec2.body} accent={ACCENT} />
      </section>

      {/* INTERACTIVE 2 — gate-composition canvas */}
      <section className="mx-auto mb-32 max-w-5xl space-y-4">
        <Reveal>
          <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT} text-center`}>
            {story.builder.caption}
          </div>
        </Reveal>
        <Reveal delay={120}>
          <NandGateBuilder caption={story.builder.caption} labels={story.builder.labels} />
        </Reveal>
      </section>

      {/* Section 04 — functional completeness */}
      <section className="mx-auto mb-32 max-w-5xl space-y-8">
        <StoryCard pretitle={sec3.pretitle} title={sec3.title} body={sec3.body} accent={ACCENT} />
        <Reveal delay={120}>
          <div className="hairline space-y-4 rounded-2xl border bg-ink-950/40 p-6">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {story.completenessLabel}
            </div>
            <p className="text-sm leading-relaxed text-ink-200">{story.completenessBody}</p>
            <div className="overflow-x-auto">
              <table className="w-full font-mono text-sm">
                <tbody>
                  {story.completenessRows.map((row) => (
                    <tr key={row.set} className="border-b border-ink-700/30 last:border-0">
                      <td className="px-2 py-2 align-top text-ink-100">{row.set}</td>
                      <td className="px-2 py-2 align-top">
                        {row.complete ? (
                          <span className="text-[10px] uppercase tracking-widest2 text-signal-violet">
                            ✓ {story.completenessYes}
                          </span>
                        ) : (
                          <span className="text-[10px] uppercase tracking-widest2 text-signal-rose">
                            ✗ {story.completenessNo}
                          </span>
                        )}
                      </td>
                      <td className="px-2 py-2 align-top text-xs text-ink-300">{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Section 05 — hardware reality */}
      <section className="mx-auto mb-32 max-w-5xl space-y-8">
        <StoryCard pretitle={sec4.pretitle} title={sec4.title} body={sec4.body} accent={ACCENT} />
        <Reveal delay={120}>
          <div className="hairline space-y-4 rounded-2xl border bg-ink-950/40 p-6">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {story.hardwareLabel}
            </div>
            <p className="text-sm leading-relaxed text-ink-200">{story.hardwareIntro}</p>
            <div className="overflow-x-auto">
              <table className="w-full font-mono text-sm">
                <thead className="hairline border-b text-ink-300">
                  <tr>
                    <th className="px-2 py-2 text-left text-[10px] uppercase tracking-widest">
                      {story.hardwareHead.gate}
                    </th>
                    <th className="px-2 py-2 text-right text-[10px] uppercase tracking-widest">
                      {story.hardwareHead.t}
                    </th>
                    <th className="px-2 py-2 text-left text-[10px] uppercase tracking-widest">
                      {story.hardwareHead.note}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {story.hardwareRows.map((row) => (
                    <tr key={row.gate} className="border-b border-ink-700/30 last:border-0">
                      <td className="px-2 py-2 text-ink-100">{row.gate}</td>
                      <td className="px-2 py-2 text-right text-signal-violet">{row.transistors}</td>
                      <td className="px-2 py-2 text-xs text-ink-200">{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="hairline border-t pt-2 text-xs leading-relaxed text-ink-300">
              {story.hardwareFoot}
            </p>
          </div>
        </Reveal>
      </section>

      {/* Section 06 — other complete singletons */}
      <section className="mx-auto mb-32 max-w-5xl space-y-8">
        <StoryCard pretitle={sec5.pretitle} title={sec5.title} body={sec5.body} accent={ACCENT} />
        <Reveal delay={120}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-6 text-center">
              <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
                Sheffer · 1913
              </div>
              <div className="math-italic text-2xl text-ink-100 md:text-3xl">
                {story.otherFormulaNand}
              </div>
              <div className="text-xs text-ink-300">{story.otherCardNand}</div>
            </div>
            <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-6 text-center">
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
                Peirce · 1880
              </div>
              <div className="math-italic text-2xl text-ink-100 md:text-3xl">
                {story.otherFormulaNor}
              </div>
              <div className="text-xs text-ink-300">{story.otherCardNor}</div>
            </div>
          </div>
        </Reveal>
        <Reveal delay={200}>
          <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-6">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {story.otherLabel}
            </div>
            <p className="text-sm leading-relaxed text-ink-200">{story.otherBody}</p>
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
            href="/nand/builder"
            className="inline-block rounded-full border border-signal-violet/70 bg-signal-violet/10 px-8 py-4 font-mono text-sm uppercase tracking-widest2 text-signal-violet transition-colors hover:bg-signal-violet/25"
          >
            {story.closingCta}
          </Link>
        </section>
      </Reveal>
    </main>
  );
}

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
    <div className="glass hairline h-full space-y-3 rounded-2xl border p-6 transition-colors hover:border-signal-violet/40">
      <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>{label}</div>
      <h3 className="math-italic text-2xl leading-snug text-ink-100">{title}</h3>
      <div className="text-sm leading-relaxed text-ink-200">{children}</div>
    </div>
  );
}
