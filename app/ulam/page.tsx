"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { StoryPageShell, StoryCard } from "@/components/StoryPageShell";
import { Reveal } from "@/components/Reveal";
import { UlamSpiralMini } from "@/components/UlamSpiralMini";
import { UlamQuadraticTester } from "@/components/UlamQuadraticTester";
import type { Locale } from "@/lib/i18n/types";
import type { StoryPage } from "@/lib/i18n/stories";

const ACCENT = "text-signal-teal";

// --------------------------------------------------------------------------
// Rich, per-locale story content. The canonical hero comes from this module
// (page = Omit<StoryPage, "sections">) and is fed to the shared shell; the
// long-form story below the hero is authored here in all eight locales so
// the page can speak without bloating the shared i18n bundles.
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
  spiralCaption: string;
  spiralSideLabel: string;
  spiralHighlightLabel: string;
  spiralPrimes: (n: number) => string;
  spiralNumbers: (n: number) => string;
  spiralHint: string;
  spiralQuadratics: Array<{ id: string; label: string; a: number; b: number; c: number }>;
  quadraticCaption: string;
  quadraticCoefficientsLabel: string;
  quadraticPresetsLabel: string;
  quadraticRangeLabel: string;
  quadraticFormulaLabel: string;
  quadraticPrimeRate: (hits: number, total: number, pct: string) => string;
  quadraticNote: string;
  quadraticPresets: Array<{ label: string; a: number; b: number; c: number }>;
  closingPretitle: string;
  closingTitle: string;
  closingBody: string;
  ctaLabel: string;
};

// English ----------------------------------------------------------------
const en: RichStory = {
  page: {
    pretitle: "Topic · Analysis",
    title: "The Ulam Spiral",
    tagline: "Primes lining up on diagonals nobody can fully explain.",
    intro:
      "Stanisław Ulam, bored in a 1963 lecture, doodled the integers in a square spiral and circled the primes. The primes did not scatter. They crowded along visible diagonals. Why primes prefer certain quadratic forms over others is one of the deepest unsolved problems in number theory — Ulam saw it on a napkin.",
    ctaInteractive: "→ Open the Explorer",
  },
  encounter: {
    pretitle: "First encounter",
    title: "Write integers in a spiral. Mark the primes. Watch.",
    cards: [
      {
        label: "01",
        title: "The big idea",
        body: "Write 1 at the centre, then walk the integers around it in a square spiral — right, up, left, left, down, down, right, right, right. Now fill only the cells whose number is prime. A pattern should not be there. One is.",
      },
      {
        label: "02",
        title: "Ulam, 1963",
        body: "Stanisław Ulam doodled this during a tedious seminar on the back of a napkin. The next year he, Stein and Wells published it in the American Mathematical Monthly, and Martin Gardner's Scientific American column made the 65 000-cell picture famous the same year. The diagonals had been hiding in the integers the whole time.",
      },
      {
        label: "03",
        title: "Why it matters",
        body: "Each diagonal is a quadratic 4n² + bn + c. That so many of them are prime-rich is a window onto Bunyakovsky's 1857 conjecture and the Hardy–Littlewood prime-tuple program — open problems that still surprise us today.",
      },
    ],
    tryIt: "Below: draw the spiral yourself, then test any quadratic you like for primes.",
  },
  sections: [
    {
      pretitle: "Section 01 · The construction",
      title: "Start at 1, spiral out",
      body: "Write 1 in the middle of squared paper. Step right for 2, up for 3, left for 4 and 5, down for 6 and 7, right for 8, 9, 10, then up for 11, 12, 13. Keep walking outward in a square spiral — every integer lands in exactly one cell.",
    },
    {
      pretitle: "Section 02 · The diagonals",
      title: "Primes prefer certain quadratics 4n² + bn + c",
      body: "Numbers along any straight diagonal of the spiral obey a quadratic of the form 4n² + bn + c. The visible streaks of primes are exactly the diagonals whose polynomial happens to be unusually prime-rich. The geometry is just bookkeeping; the arithmetic is the surprise.",
    },
    {
      pretitle: "Section 03 · Famous quadratics",
      title: "Euler's n² − n + 41",
      body: "In 1772 Euler noticed that n² − n + 41 is prime for every integer n from 0 to 40: forty-one consecutive prime values from a single quadratic, first failing at n = 41 (which lands on 41²). On the spiral this is a single uninterrupted diagonal streak. No other simple quadratic has yet beaten it.",
    },
    {
      pretitle: "Section 04 · Bunyakovsky's conjecture",
      title: "Infinitely many primes — unproven for every single one",
      body: "Viktor Bunyakovsky conjectured in 1857 that any irreducible polynomial in ℤ[x] with no fixed prime divisor and positive leading coefficient produces infinitely many primes. For n² + 1, for n² − n + 41, for almost every specific quadratic the spiral makes visible — we still cannot prove it.",
    },
    {
      pretitle: "Section 05 · Hardy–Littlewood densities",
      title: "The match between conjecture and picture is uncanny",
      body: "Hardy and Littlewood's 1923 conjecture F predicts, for each quadratic, the exact asymptotic density of primes along its diagonal. The conjectures are unproven, yet the numerical match with Ulam's spiral is near-perfect — the picture confirms the arithmetic, and the arithmetic explains the picture.",
    },
    {
      pretitle: "Section 06 · The deeper mystery",
      title: "Quadratic forms, Sato–Tate, modular shadows",
      body: "Behind the diagonals lives the analytic number theory of quadratic forms, the Sato–Tate distribution of trace data, and modular forms. Ulam's napkin doodle is a window onto one of the most stubborn corners of modern mathematics — accidentally drawn by anyone with squared paper.",
    },
  ],
  spiralCaption: "Interactive · the spiral live",
  spiralSideLabel: "Grid side",
  spiralHighlightLabel: "Highlight a diagonal",
  spiralPrimes: (n) => `${n.toLocaleString()} primes`,
  spiralNumbers: (n) => `${n.toLocaleString()} numbers`,
  spiralHint:
    "Amber = prime. Pink = the diagonal carved by the chosen quadratic. Cyan outline marks 1 at the centre.",
  spiralQuadratics: [
    { id: "none", label: "Off", a: 0, b: 0, c: 0 },
    { id: "euler", label: "Euler · n² − n + 41", a: 1, b: -1, c: 41 },
    { id: "n2n17", label: "n² + n + 17", a: 1, b: 1, c: 17 },
    { id: "n2n11", label: "n² + n + 11", a: 1, b: 1, c: 11 },
    { id: "4n2_2n41", label: "4n² − 2n + 41", a: 4, b: -2, c: 41 },
  ],
  quadraticCaption: "Interactive · test a quadratic",
  quadraticCoefficientsLabel: "Coefficients of an² + bn + c",
  quadraticPresetsLabel: "Famous presets",
  quadraticRangeLabel: "n = 0 … 40",
  quadraticFormulaLabel: "the quadratic",
  quadraticPrimeRate: (hits, total, pct) => `${hits} / ${total} prime · ${pct}`,
  quadraticNote:
    "Each cell shows n on top and a·n² + b·n + c below. Amber cells are prime. Euler's quadratic scores a perfect 41 / 41, with 41 itself appearing at both n = 0 and n = 1. Try your own.",
  quadraticPresets: [
    { label: "n² − n + 41", a: 1, b: -1, c: 41 },
    { label: "n² + n + 17", a: 1, b: 1, c: 17 },
    { label: "n² + n + 11", a: 1, b: 1, c: 11 },
    { label: "n² + 1", a: 1, b: 0, c: 1 },
    { label: "2n² + 29", a: 2, b: 0, c: 29 },
    { label: "n² + n + 1", a: 1, b: 1, c: 1 },
  ],
  closingPretitle: "Take it further",
  closingTitle: "Open the Explorer.",
  closingBody:
    "The Explorer pushes the grid up to 501 × 501 — a quarter-million integers — and lets you sweep through quadratics to find your own prime-rich diagonals.",
  ctaLabel: "→ Open the Explorer",
};

// German -----------------------------------------------------------------
const de: RichStory = {
  page: {
    pretitle: "Thema · Analysis",
    title: "Die Ulam-Spirale",
    tagline: "Primzahlen reihen sich auf Diagonalen, die niemand erklären kann.",
    intro:
      "Stanisław Ulam kritzelte 1963 aus Langeweile bei einem Vortrag die ganzen Zahlen in eine quadratische Spirale und kreiste die Primzahlen ein. Die Primzahlen verteilten sich nicht — sie drängten sich auf sichtbaren Diagonalen. Warum Primzahlen bestimmte quadratische Formen anderen vorziehen, gehört zum tiefsten ungelösten Bereich der Zahlentheorie — Ulam sah es auf einer Serviette.",
    ctaInteractive: "→ Explorer öffnen",
  },
  encounter: {
    pretitle: "Erste Begegnung",
    title: "Schreib die Zahlen in eine Spirale. Markier die Primzahlen. Schau hin.",
    cards: [
      {
        label: "01",
        title: "Die große Idee",
        body: "Schreib 1 in die Mitte, dann lauf die ganzen Zahlen drumherum in einer quadratischen Spirale — rechts, hoch, links, links, runter, runter, rechts, rechts, rechts. Markier nur die Felder, deren Zahl prim ist. Da sollte kein Muster sein. Da ist eins.",
      },
      {
        label: "02",
        title: "Ulam, 1963",
        body: "Stanisław Ulam kritzelte das während eines langweiligen Seminars auf eine Serviette. Ein Jahr später veröffentlichte er mit Stein und Wells das Ganze im American Mathematical Monthly, und Martin Gardners Kolumne in Scientific American machte das Bild mit 65 000 Zellen im selben Jahr berühmt. Die Diagonalen lagen die ganze Zeit in den ganzen Zahlen verborgen.",
      },
      {
        label: "03",
        title: "Warum es zählt",
        body: "Jede Diagonale ist ein Polynom 4n² + bn + c. Dass so viele davon primzahlenreich sind, ist ein Fenster zu Bunjakowskis Vermutung von 1857 und dem Hardy–Littlewood-Programm — offene Probleme, die uns bis heute überraschen.",
      },
    ],
    tryIt:
      "Unten: zeichne die Spirale selbst, dann teste jedes Polynom deiner Wahl auf Primzahlen.",
  },
  sections: [
    {
      pretitle: "Abschnitt 01 · Die Konstruktion",
      title: "Starte bei 1, spiral nach außen",
      body: "Schreib 1 in die Mitte von kariertem Papier. Schritt rechts für 2, hoch für 3, links für 4 und 5, runter für 6 und 7, rechts für 8, 9, 10, dann hoch für 11, 12, 13. Lauf in einer quadratischen Spirale nach außen — jede ganze Zahl landet in genau einem Feld.",
    },
    {
      pretitle: "Abschnitt 02 · Die Diagonalen",
      title: "Primzahlen bevorzugen bestimmte Quadratiken 4n² + bn + c",
      body: "Zahlen entlang jeder geraden Diagonale gehorchen einem Polynom der Form 4n² + bn + c. Die sichtbaren Primzahl-Streifen sind genau jene Diagonalen, deren Polynom ungewöhnlich primzahlreich ist. Die Geometrie ist bloß Buchhaltung; die Arithmetik ist die Überraschung.",
    },
    {
      pretitle: "Abschnitt 03 · Berühmte Quadratiken",
      title: "Eulers n² − n + 41",
      body: "Euler bemerkte 1772, dass n² − n + 41 für jedes n von 0 bis 40 prim ist: einundvierzig aufeinanderfolgende Primwerte aus einem einzigen Polynom, erstmals scheiternd bei n = 41 (das auf 41² fällt). Auf der Spirale ist das ein durchgehender diagonaler Streifen. Keine andere einfache Quadratik hat es bis heute geschlagen.",
    },
    {
      pretitle: "Abschnitt 04 · Bunjakowskis Vermutung",
      title: "Unendlich viele Primzahlen — für jede einzelne unbewiesen",
      body: "Wiktor Bunjakowski vermutete 1857, dass jedes irreduzible Polynom in ℤ[x] ohne festen Primteiler und mit positivem Leitkoeffizient unendlich viele Primzahlen liefert. Für n² + 1, für n² − n + 41, für fast jede konkrete Quadratik auf der Spirale — wir können es immer noch nicht beweisen.",
    },
    {
      pretitle: "Abschnitt 05 · Hardy–Littlewood-Dichten",
      title: "Der Abgleich zwischen Vermutung und Bild ist unheimlich",
      body: "Hardy und Littlewood sagten 1923 in ihrer Vermutung F die exakte asymptotische Dichte der Primzahlen entlang jeder Diagonale voraus. Die Vermutungen sind unbewiesen, der numerische Abgleich mit Ulams Spirale aber nahezu perfekt — das Bild bestätigt die Arithmetik, die Arithmetik erklärt das Bild.",
    },
    {
      pretitle: "Abschnitt 06 · Das tiefere Geheimnis",
      title: "Quadratische Formen, Sato–Tate, Schatten der Modulformen",
      body: "Hinter den Diagonalen lebt die analytische Zahlentheorie quadratischer Formen, die Sato–Tate-Verteilung von Spurdaten und die Modulformen. Ulams Servietten-Skizze ist ein Fenster in eine der hartnäckigsten Ecken der modernen Mathematik — versehentlich gezeichnet von jedem mit kariertem Papier.",
    },
  ],
  spiralCaption: "Interaktiv · die Spirale live",
  spiralSideLabel: "Gitter-Seite",
  spiralHighlightLabel: "Diagonale hervorheben",
  spiralPrimes: (n) => `${n.toLocaleString("de-DE")} Primzahlen`,
  spiralNumbers: (n) => `${n.toLocaleString("de-DE")} Zahlen`,
  spiralHint:
    "Bernstein = prim. Rosa = die Diagonale der gewählten Quadratik. Cyan-Umriss markiert die 1 in der Mitte.",
  spiralQuadratics: [
    { id: "none", label: "Aus", a: 0, b: 0, c: 0 },
    { id: "euler", label: "Euler · n² − n + 41", a: 1, b: -1, c: 41 },
    { id: "n2n17", label: "n² + n + 17", a: 1, b: 1, c: 17 },
    { id: "n2n11", label: "n² + n + 11", a: 1, b: 1, c: 11 },
    { id: "4n2_2n41", label: "4n² − 2n + 41", a: 4, b: -2, c: 41 },
  ],
  quadraticCaption: "Interaktiv · ein Polynom testen",
  quadraticCoefficientsLabel: "Koeffizienten von an² + bn + c",
  quadraticPresetsLabel: "Berühmte Voreinstellungen",
  quadraticRangeLabel: "n = 0 … 40",
  quadraticFormulaLabel: "das Polynom",
  quadraticPrimeRate: (hits, total, pct) => `${hits} / ${total} prim · ${pct}`,
  quadraticNote:
    "Jede Zelle zeigt n oben und a·n² + b·n + c unten. Bernsteinfarbene Zellen sind prim. Eulers Polynom trifft alle 41 / 41, wobei die 41 selbst bei n = 0 und n = 1 auftaucht. Probier dein eigenes.",
  quadraticPresets: [
    { label: "n² − n + 41", a: 1, b: -1, c: 41 },
    { label: "n² + n + 17", a: 1, b: 1, c: 17 },
    { label: "n² + n + 11", a: 1, b: 1, c: 11 },
    { label: "n² + 1", a: 1, b: 0, c: 1 },
    { label: "2n² + 29", a: 2, b: 0, c: 29 },
    { label: "n² + n + 1", a: 1, b: 1, c: 1 },
  ],
  closingPretitle: "Geh weiter",
  closingTitle: "Öffne den Explorer.",
  closingBody:
    "Der Explorer treibt das Gitter auf 501 × 501 — eine Viertelmillion ganzer Zahlen — und lässt dich durch Polynome streifen, um deine eigenen primzahlreichen Diagonalen zu finden.",
  ctaLabel: "→ Explorer öffnen",
};

// Spanish ----------------------------------------------------------------
const es: RichStory = {
  page: {
    pretitle: "Tema · Análisis",
    title: "La espiral de Ulam",
    tagline: "Primos alineándose en diagonales que nadie explica del todo.",
    intro:
      "Stanisław Ulam, aburrido en una conferencia de 1963, garabateó los enteros en una espiral cuadrada y rodeó los primos. Los primos no se dispersaron. Se apiñaron en diagonales visibles. Por qué los primos prefieren ciertas formas cuadráticas es uno de los problemas abiertos más profundos de la teoría de números — Ulam lo vio en una servilleta.",
    ctaInteractive: "→ Abrir el Explorador",
  },
  encounter: {
    pretitle: "Primer encuentro",
    title: "Escribe los enteros en espiral. Marca los primos. Mira.",
    cards: [
      {
        label: "01",
        title: "La gran idea",
        body: "Escribe 1 en el centro y luego camina los enteros a su alrededor en espiral cuadrada — derecha, arriba, izquierda, izquierda, abajo, abajo, derecha, derecha, derecha. Pinta solo las casillas cuyo número es primo. No debería haber un patrón. Lo hay.",
      },
      {
        label: "02",
        title: "Ulam, 1963",
        body: "Stanisław Ulam lo garabateó durante un seminario tedioso en una servilleta. Al año siguiente él, Stein y Wells lo publicaron en el American Mathematical Monthly, y la columna de Martin Gardner en Scientific American hizo famosa la imagen de 65 000 celdas ese mismo año. Las diagonales llevaban escondidas todo el tiempo dentro de los enteros.",
      },
      {
        label: "03",
        title: "Por qué importa",
        body: "Cada diagonal es un polinomio 4n² + bn + c. Que tantas sean ricas en primos es una ventana a la conjetura de Bunyakovsky de 1857 y al programa de Hardy–Littlewood — problemas abiertos que todavía nos sorprenden.",
      },
    ],
    tryIt:
      "Abajo: dibuja tú la espiral, luego prueba cualquier cuadrática que quieras a ver cuántos primos da.",
  },
  sections: [
    {
      pretitle: "Sección 01 · La construcción",
      title: "Empieza en 1, sal en espiral",
      body: "Escribe 1 en el centro del papel cuadriculado. Paso a la derecha para el 2, arriba para el 3, izquierda para 4 y 5, abajo para 6 y 7, derecha para 8, 9, 10, luego arriba para 11, 12, 13. Sigue caminando en espiral cuadrada hacia fuera — cada entero ocupa exactamente una casilla.",
    },
    {
      pretitle: "Sección 02 · Las diagonales",
      title: "Los primos prefieren ciertas cuadráticas 4n² + bn + c",
      body: "Los números a lo largo de cualquier diagonal recta obedecen una cuadrática del tipo 4n² + bn + c. Las rayas visibles de primos son exactamente las diagonales cuyo polinomio resulta ser inusualmente rico en primos. La geometría es solo contabilidad; la aritmética es la sorpresa.",
    },
    {
      pretitle: "Sección 03 · Cuadráticas célebres",
      title: "La n² − n + 41 de Euler",
      body: "En 1772 Euler observó que n² − n + 41 es primo para todo n entero de 0 a 40: cuarenta y un valores primos consecutivos de un solo polinomio, fallando por primera vez en n = 41 (que cae en 41²). En la espiral es una raya diagonal ininterrumpida. Ninguna otra cuadrática simple lo ha batido todavía.",
    },
    {
      pretitle: "Sección 04 · La conjetura de Bunyakovsky",
      title: "Infinitos primos — sin demostrar para ninguna",
      body: "Víktor Bunyakovsky conjeturó en 1857 que todo polinomio irreducible de ℤ[x] sin divisor primo fijo y con coeficiente principal positivo produce infinitos primos. Para n² + 1, para n² − n + 41, para casi cualquier cuadrática concreta que la espiral muestra — todavía no sabemos demostrarlo.",
    },
    {
      pretitle: "Sección 05 · Densidades de Hardy–Littlewood",
      title: "El ajuste entre conjetura e imagen es asombroso",
      body: "La conjetura F de Hardy y Littlewood de 1923 predice, para cada cuadrática, la densidad asintótica exacta de primos a lo largo de su diagonal. Las conjeturas siguen sin demostrar, pero el ajuste numérico con la espiral de Ulam es casi perfecto — la imagen confirma la aritmética y la aritmética explica la imagen.",
    },
    {
      pretitle: "Sección 06 · El misterio más hondo",
      title: "Formas cuadráticas, Sato–Tate, sombras modulares",
      body: "Detrás de las diagonales vive la teoría analítica de los números de las formas cuadráticas, la distribución de Sato–Tate de las trazas y las formas modulares. La servilleta de Ulam es una ventana a uno de los rincones más tercos de la matemática moderna — dibujado sin querer por cualquiera con papel cuadriculado.",
    },
  ],
  spiralCaption: "Interactivo · la espiral en vivo",
  spiralSideLabel: "Lado del retículo",
  spiralHighlightLabel: "Destacar una diagonal",
  spiralPrimes: (n) => `${n.toLocaleString("es-ES")} primos`,
  spiralNumbers: (n) => `${n.toLocaleString("es-ES")} números`,
  spiralHint:
    "Ámbar = primo. Rosa = la diagonal que talla la cuadrática elegida. El contorno cian marca el 1 en el centro.",
  spiralQuadratics: [
    { id: "none", label: "Apagado", a: 0, b: 0, c: 0 },
    { id: "euler", label: "Euler · n² − n + 41", a: 1, b: -1, c: 41 },
    { id: "n2n17", label: "n² + n + 17", a: 1, b: 1, c: 17 },
    { id: "n2n11", label: "n² + n + 11", a: 1, b: 1, c: 11 },
    { id: "4n2_2n41", label: "4n² − 2n + 41", a: 4, b: -2, c: 41 },
  ],
  quadraticCaption: "Interactivo · prueba una cuadrática",
  quadraticCoefficientsLabel: "Coeficientes de an² + bn + c",
  quadraticPresetsLabel: "Predefinidas célebres",
  quadraticRangeLabel: "n = 0 … 40",
  quadraticFormulaLabel: "la cuadrática",
  quadraticPrimeRate: (hits, total, pct) => `${hits} / ${total} primos · ${pct}`,
  quadraticNote:
    "Cada celda muestra n arriba y a·n² + b·n + c abajo. Las ámbar son primos. La cuadrática de Euler acierta las 41 / 41, con el 41 apareciendo en n = 0 y n = 1. Prueba la tuya.",
  quadraticPresets: [
    { label: "n² − n + 41", a: 1, b: -1, c: 41 },
    { label: "n² + n + 17", a: 1, b: 1, c: 17 },
    { label: "n² + n + 11", a: 1, b: 1, c: 11 },
    { label: "n² + 1", a: 1, b: 0, c: 1 },
    { label: "2n² + 29", a: 2, b: 0, c: 29 },
    { label: "n² + n + 1", a: 1, b: 1, c: 1 },
  ],
  closingPretitle: "Ve más lejos",
  closingTitle: "Abre el Explorador.",
  closingBody:
    "El Explorador lleva el retículo hasta 501 × 501 — un cuarto de millón de enteros — y te deja recorrer cuadráticas para encontrar tus propias diagonales ricas en primos.",
  ctaLabel: "→ Abrir el Explorador",
};

// French -----------------------------------------------------------------
const fr: RichStory = {
  page: {
    pretitle: "Sujet · Analyse",
    title: "La spirale d'Ulam",
    tagline: "Des nombres premiers alignés sur des diagonales que personne n'explique vraiment.",
    intro:
      "Stanisław Ulam, ennuyé pendant une conférence en 1963, a griffonné les entiers en spirale carrée et entouré les nombres premiers. Les premiers ne se sont pas dispersés. Ils se sont serrés le long de diagonales visibles. Pourquoi les premiers préfèrent certaines formes quadratiques est l'un des problèmes ouverts les plus profonds de la théorie des nombres — Ulam l'a vu sur une serviette.",
    ctaInteractive: "→ Ouvrir l'Explorateur",
  },
  encounter: {
    pretitle: "Première rencontre",
    title: "Écris les entiers en spirale. Marque les premiers. Regarde.",
    cards: [
      {
        label: "01",
        title: "L'idée centrale",
        body: "Écris 1 au centre, puis fais marcher les entiers autour en spirale carrée — droite, haut, gauche, gauche, bas, bas, droite, droite, droite. Ne remplis que les cases dont le nombre est premier. Il ne devrait pas y avoir de motif. Il y en a un.",
      },
      {
        label: "02",
        title: "Ulam, 1963",
        body: "Stanisław Ulam a griffonné ça pendant un séminaire ennuyeux au dos d'une serviette. L'année suivante, avec Stein et Wells, il l'a publiée dans l'American Mathematical Monthly, et la chronique de Martin Gardner dans Scientific American a rendu célèbre l'image à 65 000 cases la même année. Les diagonales se cachaient depuis toujours dans les entiers.",
      },
      {
        label: "03",
        title: "Pourquoi ça compte",
        body: "Chaque diagonale est un polynôme 4n² + bn + c. Que tant d'entre elles soient riches en premiers est une fenêtre sur la conjecture de Bouniakovski de 1857 et le programme de Hardy–Littlewood — des problèmes ouverts qui nous surprennent encore.",
      },
    ],
    tryIt:
      "Ci-dessous : dessine la spirale toi-même, puis teste n'importe quel polynôme pour voir s'il pond des premiers.",
  },
  sections: [
    {
      pretitle: "Section 01 · La construction",
      title: "Pars de 1, spirale vers l'extérieur",
      body: "Écris 1 au milieu d'une feuille quadrillée. Un pas à droite pour 2, en haut pour 3, à gauche pour 4 et 5, en bas pour 6 et 7, à droite pour 8, 9, 10, puis en haut pour 11, 12, 13. Continue en spirale carrée vers l'extérieur — chaque entier occupe exactement une case.",
    },
    {
      pretitle: "Section 02 · Les diagonales",
      title: "Les premiers préfèrent certaines quadratiques 4n² + bn + c",
      body: "Les nombres le long d'une diagonale droite obéissent à une quadratique de la forme 4n² + bn + c. Les traînées visibles de premiers sont exactement les diagonales dont le polynôme se trouve être inhabituellement riche en premiers. La géométrie n'est que comptabilité ; la surprise est arithmétique.",
    },
    {
      pretitle: "Section 03 · Quadratiques célèbres",
      title: "Le n² − n + 41 d'Euler",
      body: "En 1772 Euler a remarqué que n² − n + 41 est premier pour tout entier n de 0 à 40 : quarante et une valeurs premières consécutives d'un seul polynôme, échouant pour la première fois à n = 41 (qui tombe sur 41²). Sur la spirale c'est une seule traînée diagonale ininterrompue. Aucune autre quadratique simple ne l'a battu à ce jour.",
    },
    {
      pretitle: "Section 04 · La conjecture de Bouniakovski",
      title: "Une infinité de premiers — non démontré pour aucune",
      body: "Viktor Bouniakovski a conjecturé en 1857 que tout polynôme irréductible de ℤ[x] sans diviseur premier fixe et à coefficient dominant positif produit une infinité de premiers. Pour n² + 1, pour n² − n + 41, pour presque toute quadratique concrète qu'on voit sur la spirale — on ne sait toujours pas le démontrer.",
    },
    {
      pretitle: "Section 05 · Densités de Hardy–Littlewood",
      title: "L'accord entre conjecture et image est troublant",
      body: "La conjecture F de Hardy et Littlewood, 1923, prédit pour chaque quadratique la densité asymptotique exacte des premiers le long de sa diagonale. Les conjectures restent non démontrées, mais l'accord numérique avec la spirale d'Ulam est presque parfait — l'image confirme l'arithmétique et l'arithmétique explique l'image.",
    },
    {
      pretitle: "Section 06 · Le mystère plus profond",
      title: "Formes quadratiques, Sato–Tate, ombres modulaires",
      body: "Derrière les diagonales vit la théorie analytique des formes quadratiques, la distribution de Sato–Tate des traces et les formes modulaires. La serviette d'Ulam est une fenêtre sur l'un des coins les plus têtus des mathématiques modernes — dessinée par accident par quiconque possède du papier quadrillé.",
    },
  ],
  spiralCaption: "Interactif · la spirale en direct",
  spiralSideLabel: "Côté de la grille",
  spiralHighlightLabel: "Mettre en évidence une diagonale",
  spiralPrimes: (n) => `${n.toLocaleString("fr-FR")} premiers`,
  spiralNumbers: (n) => `${n.toLocaleString("fr-FR")} nombres`,
  spiralHint:
    "Ambre = premier. Rose = la diagonale que sculpte la quadratique choisie. Le contour cyan marque le 1 au centre.",
  spiralQuadratics: [
    { id: "none", label: "Off", a: 0, b: 0, c: 0 },
    { id: "euler", label: "Euler · n² − n + 41", a: 1, b: -1, c: 41 },
    { id: "n2n17", label: "n² + n + 17", a: 1, b: 1, c: 17 },
    { id: "n2n11", label: "n² + n + 11", a: 1, b: 1, c: 11 },
    { id: "4n2_2n41", label: "4n² − 2n + 41", a: 4, b: -2, c: 41 },
  ],
  quadraticCaption: "Interactif · teste une quadratique",
  quadraticCoefficientsLabel: "Coefficients de an² + bn + c",
  quadraticPresetsLabel: "Préréglages célèbres",
  quadraticRangeLabel: "n = 0 … 40",
  quadraticFormulaLabel: "la quadratique",
  quadraticPrimeRate: (hits, total, pct) => `${hits} / ${total} premiers · ${pct}`,
  quadraticNote:
    "Chaque case montre n en haut et a·n² + b·n + c en bas. Les cases ambrées sont premières. La quadratique d'Euler fait 41 / 41, le 41 apparaissant à n = 0 et n = 1. Essaie la tienne.",
  quadraticPresets: [
    { label: "n² − n + 41", a: 1, b: -1, c: 41 },
    { label: "n² + n + 17", a: 1, b: 1, c: 17 },
    { label: "n² + n + 11", a: 1, b: 1, c: 11 },
    { label: "n² + 1", a: 1, b: 0, c: 1 },
    { label: "2n² + 29", a: 2, b: 0, c: 29 },
    { label: "n² + n + 1", a: 1, b: 1, c: 1 },
  ],
  closingPretitle: "Aller plus loin",
  closingTitle: "Ouvre l'Explorateur.",
  closingBody:
    "L'Explorateur pousse la grille à 501 × 501 — un quart de million d'entiers — et te laisse balayer des quadratiques pour trouver tes propres diagonales riches en premiers.",
  ctaLabel: "→ Ouvrir l'Explorateur",
};

// Italian ----------------------------------------------------------------
const it: RichStory = {
  page: {
    pretitle: "Tema · Analisi",
    title: "La spirale di Ulam",
    tagline: "Numeri primi che si allineano su diagonali che nessuno spiega del tutto.",
    intro:
      "Stanisław Ulam, annoiato in una conferenza nel 1963, scarabocchiò gli interi in una spirale quadrata e cerchiò i primi. I primi non si sparpagliarono. Si addensarono lungo diagonali visibili. Perché i primi preferiscano certe forme quadratiche è uno dei problemi aperti più profondi della teoria dei numeri — Ulam lo vide su un tovagliolo.",
    ctaInteractive: "→ Apri l'Esploratore",
  },
  encounter: {
    pretitle: "Primo incontro",
    title: "Scrivi gli interi in spirale. Segna i primi. Guarda.",
    cards: [
      {
        label: "01",
        title: "L'idea centrale",
        body: "Scrivi 1 al centro, poi cammina con gli interi attorno in una spirale quadrata — destra, su, sinistra, sinistra, giù, giù, destra, destra, destra. Riempi solo le caselle il cui numero è primo. Non dovrebbe esserci uno schema. C'è.",
      },
      {
        label: "02",
        title: "Ulam, 1963",
        body: "Stanisław Ulam lo scarabocchiò durante un noioso seminario sul retro di un tovagliolo. L'anno dopo, con Stein e Wells, lo pubblicò sull'American Mathematical Monthly, e la rubrica di Martin Gardner su Scientific American rese celebre l'immagine da 65 000 celle lo stesso anno. Le diagonali stavano nascoste negli interi da sempre.",
      },
      {
        label: "03",
        title: "Perché conta",
        body: "Ogni diagonale è un polinomio 4n² + bn + c. Che tante siano ricche di primi è una finestra sulla congettura di Bunjakovskij del 1857 e sul programma di Hardy–Littlewood — problemi aperti che ancora ci sorprendono.",
      },
    ],
    tryIt:
      "Sotto: disegna la spirale tu stesso, poi prova una qualsiasi quadratica per vedere quanti primi sforna.",
  },
  sections: [
    {
      pretitle: "Sezione 01 · La costruzione",
      title: "Parti da 1, vai a spirale verso l'esterno",
      body: "Scrivi 1 al centro di un foglio a quadretti. Un passo a destra per il 2, su per il 3, a sinistra per 4 e 5, giù per 6 e 7, a destra per 8, 9, 10, poi su per 11, 12, 13. Continua a camminare in spirale quadrata verso l'esterno — ogni intero finisce in esattamente una casella.",
    },
    {
      pretitle: "Sezione 02 · Le diagonali",
      title: "I primi preferiscono certe quadratiche 4n² + bn + c",
      body: "I numeri lungo una qualsiasi diagonale dritta obbediscono a una quadratica della forma 4n² + bn + c. Le scie visibili di primi sono esattamente le diagonali il cui polinomio risulta inusualmente ricco di primi. La geometria è solo contabilità; la sorpresa è aritmetica.",
    },
    {
      pretitle: "Sezione 03 · Quadratiche celebri",
      title: "L'n² − n + 41 di Eulero",
      body: "Nel 1772 Eulero notò che n² − n + 41 è primo per ogni n intero da 0 a 40: quarantuno valori primi consecutivi da un solo polinomio, fallendo per la prima volta a n = 41 (che cade su 41²). Sulla spirale è un'unica scia diagonale ininterrotta. Nessuna altra quadratica semplice l'ha ancora battuta.",
    },
    {
      pretitle: "Sezione 04 · La congettura di Bunjakovskij",
      title: "Infiniti primi — indimostrata per ognuna",
      body: "Viktor Bunjakovskij congetturò nel 1857 che ogni polinomio irriducibile in ℤ[x] senza divisore primo fisso e con coefficiente direttivo positivo produca infiniti primi. Per n² + 1, per n² − n + 41, per quasi ogni quadratica concreta che la spirale mostra — ancora non sappiamo dimostrarlo.",
    },
    {
      pretitle: "Sezione 05 · Densità di Hardy–Littlewood",
      title: "L'accordo tra congettura e immagine è inquietante",
      body: "La congettura F di Hardy e Littlewood del 1923 prevede, per ogni quadratica, la densità asintotica esatta dei primi lungo la sua diagonale. Le congetture restano indimostrate, ma l'accordo numerico con la spirale di Ulam è quasi perfetto — l'immagine conferma l'aritmetica e l'aritmetica spiega l'immagine.",
    },
    {
      pretitle: "Sezione 06 · Il mistero più profondo",
      title: "Forme quadratiche, Sato–Tate, ombre modulari",
      body: "Dietro le diagonali vive la teoria analitica dei numeri delle forme quadratiche, la distribuzione di Sato–Tate delle tracce e le forme modulari. Il tovagliolo di Ulam è una finestra su uno degli angoli più ostinati della matematica moderna — disegnato per caso da chiunque abbia un foglio a quadretti.",
    },
  ],
  spiralCaption: "Interattivo · la spirale dal vivo",
  spiralSideLabel: "Lato della griglia",
  spiralHighlightLabel: "Evidenzia una diagonale",
  spiralPrimes: (n) => `${n.toLocaleString("it-IT")} primi`,
  spiralNumbers: (n) => `${n.toLocaleString("it-IT")} numeri`,
  spiralHint:
    "Ambra = primo. Rosa = la diagonale che la quadratica scelta scolpisce. Il contorno ciano segna l'1 al centro.",
  spiralQuadratics: [
    { id: "none", label: "Off", a: 0, b: 0, c: 0 },
    { id: "euler", label: "Eulero · n² − n + 41", a: 1, b: -1, c: 41 },
    { id: "n2n17", label: "n² + n + 17", a: 1, b: 1, c: 17 },
    { id: "n2n11", label: "n² + n + 11", a: 1, b: 1, c: 11 },
    { id: "4n2_2n41", label: "4n² − 2n + 41", a: 4, b: -2, c: 41 },
  ],
  quadraticCaption: "Interattivo · prova una quadratica",
  quadraticCoefficientsLabel: "Coefficienti di an² + bn + c",
  quadraticPresetsLabel: "Preset celebri",
  quadraticRangeLabel: "n = 0 … 40",
  quadraticFormulaLabel: "la quadratica",
  quadraticPrimeRate: (hits, total, pct) => `${hits} / ${total} primi · ${pct}`,
  quadraticNote:
    "Ogni cella mostra n sopra e a·n² + b·n + c sotto. Le celle ambra sono prime. La quadratica di Eulero fa 41 / 41, con il 41 che compare a n = 0 e n = 1. Prova la tua.",
  quadraticPresets: [
    { label: "n² − n + 41", a: 1, b: -1, c: 41 },
    { label: "n² + n + 17", a: 1, b: 1, c: 17 },
    { label: "n² + n + 11", a: 1, b: 1, c: 11 },
    { label: "n² + 1", a: 1, b: 0, c: 1 },
    { label: "2n² + 29", a: 2, b: 0, c: 29 },
    { label: "n² + n + 1", a: 1, b: 1, c: 1 },
  ],
  closingPretitle: "Vai oltre",
  closingTitle: "Apri l'Esploratore.",
  closingBody:
    "L'Esploratore spinge la griglia fino a 501 × 501 — un quarto di milione di interi — e ti lascia scorrere fra le quadratiche per trovare le tue diagonali ricche di primi.",
  ctaLabel: "→ Apri l'Esploratore",
};

// Portuguese -------------------------------------------------------------
const pt: RichStory = {
  page: {
    pretitle: "Tópico · Análise",
    title: "A espiral de Ulam",
    tagline: "Primos alinhados em diagonais que ninguém explica de todo.",
    intro:
      "Stanisław Ulam, entediado numa conferência em 1963, rabiscou os inteiros em espiral quadrada e circundou os primos. Os primos não se dispersaram. Apinharam-se em diagonais visíveis. Porque é que os primos preferem certas formas quadráticas é um dos problemas em aberto mais profundos da teoria dos números — Ulam viu-o num guardanapo.",
    ctaInteractive: "→ Abrir o Explorador",
  },
  encounter: {
    pretitle: "Primeiro encontro",
    title: "Escreve os inteiros em espiral. Marca os primos. Olha.",
    cards: [
      {
        label: "01",
        title: "A ideia central",
        body: "Escreve 1 no meio, depois caminha com os inteiros à volta numa espiral quadrada — direita, cima, esquerda, esquerda, baixo, baixo, direita, direita, direita. Preenche só as células cujo número é primo. Não devia haver um padrão. Há.",
      },
      {
        label: "02",
        title: "Ulam, 1963",
        body: "Stanisław Ulam rabiscou isto durante um seminário tedioso nas costas de um guardanapo. No ano seguinte, com Stein e Wells, publicou-o no American Mathematical Monthly, e a coluna de Martin Gardner na Scientific American tornou famosa a imagem de 65 000 células no mesmo ano. As diagonais andavam escondidas nos inteiros desde sempre.",
      },
      {
        label: "03",
        title: "Porque importa",
        body: "Cada diagonal é um polinómio 4n² + bn + c. Que tantas sejam ricas em primos é uma janela para a conjetura de Buniakovski de 1857 e para o programa de Hardy–Littlewood — problemas em aberto que ainda nos surpreendem.",
      },
    ],
    tryIt:
      "Abaixo: desenha tu mesmo a espiral, depois testa qualquer quadrática para ver quantos primos dá.",
  },
  sections: [
    {
      pretitle: "Secção 01 · A construção",
      title: "Começa em 1, sai em espiral",
      body: "Escreve 1 no centro de papel quadriculado. Um passo à direita para o 2, cima para o 3, esquerda para 4 e 5, baixo para 6 e 7, direita para 8, 9, 10, depois cima para 11, 12, 13. Continua a caminhar em espiral quadrada para fora — cada inteiro ocupa exatamente uma casa.",
    },
    {
      pretitle: "Secção 02 · As diagonais",
      title: "Os primos preferem certas quadráticas 4n² + bn + c",
      body: "Os números ao longo de qualquer diagonal reta obedecem a uma quadrática da forma 4n² + bn + c. As riscas visíveis de primos são exatamente as diagonais cujo polinómio acontece ser invulgarmente rico em primos. A geometria é só escrituração; a surpresa é aritmética.",
    },
    {
      pretitle: "Secção 03 · Quadráticas célebres",
      title: "O n² − n + 41 de Euler",
      body: "Em 1772 Euler reparou que n² − n + 41 é primo para todo o n inteiro de 0 a 40: quarenta e um valores primos consecutivos de um único polinómio, falhando pela primeira vez em n = 41 (que cai em 41²). Na espiral é uma única risca diagonal ininterrupta. Nenhuma outra quadrática simples a venceu ainda.",
    },
    {
      pretitle: "Secção 04 · A conjetura de Buniakovski",
      title: "Infinitos primos — não provada para nenhuma",
      body: "Viktor Buniakovski conjeturou em 1857 que todo o polinómio irredutível em ℤ[x] sem divisor primo fixo e com coeficiente diretor positivo produz infinitos primos. Para n² + 1, para n² − n + 41, para quase toda a quadrática concreta que a espiral mostra — ainda não a conseguimos provar.",
    },
    {
      pretitle: "Secção 05 · Densidades de Hardy–Littlewood",
      title: "A correspondência entre conjetura e imagem é arrepiante",
      body: "A conjetura F de Hardy e Littlewood de 1923 prediz, para cada quadrática, a densidade assintótica exata dos primos ao longo da sua diagonal. As conjeturas continuam por provar, mas a correspondência numérica com a espiral de Ulam é quase perfeita — a imagem confirma a aritmética e a aritmética explica a imagem.",
    },
    {
      pretitle: "Secção 06 · O mistério mais fundo",
      title: "Formas quadráticas, Sato–Tate, sombras modulares",
      body: "Por trás das diagonais vive a teoria analítica dos números das formas quadráticas, a distribuição de Sato–Tate dos traços e as formas modulares. O guardanapo de Ulam é uma janela para um dos cantos mais teimosos da matemática moderna — desenhado por acaso por qualquer pessoa com papel quadriculado.",
    },
  ],
  spiralCaption: "Interativo · a espiral em direto",
  spiralSideLabel: "Lado da grelha",
  spiralHighlightLabel: "Destacar uma diagonal",
  spiralPrimes: (n) => `${n.toLocaleString("pt-PT")} primos`,
  spiralNumbers: (n) => `${n.toLocaleString("pt-PT")} números`,
  spiralHint:
    "Âmbar = primo. Rosa = a diagonal que a quadrática escolhida talha. O contorno ciano marca o 1 no centro.",
  spiralQuadratics: [
    { id: "none", label: "Off", a: 0, b: 0, c: 0 },
    { id: "euler", label: "Euler · n² − n + 41", a: 1, b: -1, c: 41 },
    { id: "n2n17", label: "n² + n + 17", a: 1, b: 1, c: 17 },
    { id: "n2n11", label: "n² + n + 11", a: 1, b: 1, c: 11 },
    { id: "4n2_2n41", label: "4n² − 2n + 41", a: 4, b: -2, c: 41 },
  ],
  quadraticCaption: "Interativo · testa uma quadrática",
  quadraticCoefficientsLabel: "Coeficientes de an² + bn + c",
  quadraticPresetsLabel: "Predefinições célebres",
  quadraticRangeLabel: "n = 0 … 40",
  quadraticFormulaLabel: "a quadrática",
  quadraticPrimeRate: (hits, total, pct) => `${hits} / ${total} primos · ${pct}`,
  quadraticNote:
    "Cada célula mostra n em cima e a·n² + b·n + c em baixo. As âmbar são primas. A quadrática de Euler acerta 41 / 41, com o 41 a aparecer em n = 0 e n = 1. Tenta a tua.",
  quadraticPresets: [
    { label: "n² − n + 41", a: 1, b: -1, c: 41 },
    { label: "n² + n + 17", a: 1, b: 1, c: 17 },
    { label: "n² + n + 11", a: 1, b: 1, c: 11 },
    { label: "n² + 1", a: 1, b: 0, c: 1 },
    { label: "2n² + 29", a: 2, b: 0, c: 29 },
    { label: "n² + n + 1", a: 1, b: 1, c: 1 },
  ],
  closingPretitle: "Vai mais longe",
  closingTitle: "Abre o Explorador.",
  closingBody:
    "O Explorador leva a grelha até 501 × 501 — um quarto de milhão de inteiros — e deixa-te varrer quadráticas para encontrar as tuas próprias diagonais ricas em primos.",
  ctaLabel: "→ Abrir o Explorador",
};

// Swedish ----------------------------------------------------------------
const sv: RichStory = {
  page: {
    pretitle: "Ämne · Analys",
    title: "Ulam-spiralen",
    tagline: "Primtal som ställer upp sig på diagonaler som ingen riktigt förklarar.",
    intro:
      "Stanisław Ulam, uttråkad under en föreläsning 1963, klottrade ner heltalen i en kvadratisk spiral och ringade in primtalen. Primtalen spreds inte. De trängdes längs synliga diagonaler. Varför primtal föredrar vissa kvadratiska former framför andra är ett av de djupaste olösta problemen i talteorin — Ulam såg det på en servett.",
    ctaInteractive: "→ Öppna Utforskaren",
  },
  encounter: {
    pretitle: "Första mötet",
    title: "Skriv heltalen i spiral. Markera primtalen. Se efter.",
    cards: [
      {
        label: "01",
        title: "Den stora idén",
        body: "Skriv 1 i mitten, gå sedan med heltalen runt det i en kvadratisk spiral — höger, upp, vänster, vänster, ner, ner, höger, höger, höger. Fyll bara cellerna vars tal är primtal. Det borde inte finnas något mönster. Det gör det.",
      },
      {
        label: "02",
        title: "Ulam, 1963",
        body: "Stanisław Ulam klottrade ner det under ett tråkigt seminarium på baksidan av en servett. Året därpå publicerade han, Stein och Wells det i American Mathematical Monthly, och Martin Gardners spalt i Scientific American gjorde bilden med 65 000 celler berömd samma år. Diagonalerna hade legat gömda i heltalen hela tiden.",
      },
      {
        label: "03",
        title: "Varför det spelar roll",
        body: "Varje diagonal är ett polynom 4n² + bn + c. Att så många är primtalsrika är ett fönster mot Bunjakovskijs förmodan från 1857 och Hardy–Littlewood-programmet — öppna problem som ännu överraskar oss.",
      },
    ],
    tryIt:
      "Nedan: rita spiralen själv, testa sedan vilket polynom du vill för att se hur många primtal det ger.",
  },
  sections: [
    {
      pretitle: "Avsnitt 01 · Konstruktionen",
      title: "Börja på 1, spirala utåt",
      body: "Skriv 1 mitt på rutigt papper. Steg höger för 2, upp för 3, vänster för 4 och 5, ner för 6 och 7, höger för 8, 9, 10, sedan upp för 11, 12, 13. Fortsätt gå utåt i en kvadratisk spiral — varje heltal hamnar i exakt en cell.",
    },
    {
      pretitle: "Avsnitt 02 · Diagonalerna",
      title: "Primtal föredrar vissa kvadrater 4n² + bn + c",
      body: "Talen längs varje rak diagonal lyder en kvadrat på formen 4n² + bn + c. De synliga primtalsstråken är just de diagonaler vars polynom råkar vara ovanligt primtalsrika. Geometrin är bara bokföring; aritmetiken är överraskningen.",
    },
    {
      pretitle: "Avsnitt 03 · Berömda kvadrater",
      title: "Eulers n² − n + 41",
      body: "År 1772 noterade Euler att n² − n + 41 är primtal för varje heltal n från 0 till 40: fyrtioett på varandra följande primvärden från ett enda polynom, och missar först vid n = 41 (som hamnar på 41²). På spiralen är det ett enda obrutet diagonalstreck. Ingen annan enkel kvadrat har slagit den än.",
    },
    {
      pretitle: "Avsnitt 04 · Bunjakovskijs förmodan",
      title: "Oändligt många primtal — obevisat för var och en",
      body: "Viktor Bunjakovskij förmodade 1857 att varje irreducibelt polynom i ℤ[x] utan fast primdelare och med positiv ledande koefficient ger oändligt många primtal. För n² + 1, för n² − n + 41, för nästan varje konkret kvadrat som spiralen visar — vi kan fortfarande inte bevisa det.",
    },
    {
      pretitle: "Avsnitt 05 · Hardy–Littlewood-täthet",
      title: "Överensstämmelsen mellan förmodan och bild är kuslig",
      body: "Hardy och Littlewoods förmodan F från 1923 förutsäger för varje kvadrat den exakta asymptotiska tätheten av primtal längs dess diagonal. Förmodandena är obevisade, men den numeriska överensstämmelsen med Ulam-spiralen är nästan perfekt — bilden bekräftar aritmetiken och aritmetiken förklarar bilden.",
    },
    {
      pretitle: "Avsnitt 06 · Det djupare mysteriet",
      title: "Kvadratiska former, Sato–Tate, modulära skuggor",
      body: "Bakom diagonalerna lever den analytiska talteorin för kvadratiska former, Sato–Tate-fördelningen av spårdata och de modulära formerna. Ulams servettklotter är ett fönster mot ett av den moderna matematikens mest envisa hörn — råkat ritat av vem som helst med rutigt papper.",
    },
  ],
  spiralCaption: "Interaktivt · spiralen i realtid",
  spiralSideLabel: "Rutans sida",
  spiralHighlightLabel: "Markera en diagonal",
  spiralPrimes: (n) => `${n.toLocaleString("sv-SE")} primtal`,
  spiralNumbers: (n) => `${n.toLocaleString("sv-SE")} tal`,
  spiralHint:
    "Bärnsten = primtal. Rosa = diagonalen som den valda kvadraten skär ut. Cyankontur markerar 1 i mitten.",
  spiralQuadratics: [
    { id: "none", label: "Av", a: 0, b: 0, c: 0 },
    { id: "euler", label: "Euler · n² − n + 41", a: 1, b: -1, c: 41 },
    { id: "n2n17", label: "n² + n + 17", a: 1, b: 1, c: 17 },
    { id: "n2n11", label: "n² + n + 11", a: 1, b: 1, c: 11 },
    { id: "4n2_2n41", label: "4n² − 2n + 41", a: 4, b: -2, c: 41 },
  ],
  quadraticCaption: "Interaktivt · testa en kvadrat",
  quadraticCoefficientsLabel: "Koefficienter i an² + bn + c",
  quadraticPresetsLabel: "Berömda förinställningar",
  quadraticRangeLabel: "n = 0 … 40",
  quadraticFormulaLabel: "kvadraten",
  quadraticPrimeRate: (hits, total, pct) => `${hits} / ${total} primtal · ${pct}`,
  quadraticNote:
    "Varje cell visar n överst och a·n² + b·n + c under. Bärnstensfärgade celler är primtal. Eulers kvadrat klarar alla 41 / 41, där 41 dyker upp vid både n = 0 och n = 1. Pröva din egen.",
  quadraticPresets: [
    { label: "n² − n + 41", a: 1, b: -1, c: 41 },
    { label: "n² + n + 17", a: 1, b: 1, c: 17 },
    { label: "n² + n + 11", a: 1, b: 1, c: 11 },
    { label: "n² + 1", a: 1, b: 0, c: 1 },
    { label: "2n² + 29", a: 2, b: 0, c: 29 },
    { label: "n² + n + 1", a: 1, b: 1, c: 1 },
  ],
  closingPretitle: "Gå vidare",
  closingTitle: "Öppna Utforskaren.",
  closingBody:
    "Utforskaren skjuter rutnätet upp till 501 × 501 — en kvarts miljon heltal — och låter dig svepa genom kvadrater för att hitta dina egna primtalsrika diagonaler.",
  ctaLabel: "→ Öppna Utforskaren",
};

// Norwegian --------------------------------------------------------------
const no: RichStory = {
  page: {
    pretitle: "Tema · Analyse",
    title: "Ulam-spiralen",
    tagline: "Primtall som stiller seg opp på diagonaler ingen helt forklarer.",
    intro:
      "Stanisław Ulam, lei på en forelesning i 1963, krotet ned heltallene i en kvadratisk spiral og ringet inn primtallene. Primtallene ble ikke spredd. De trengte seg langs synlige diagonaler. Hvorfor primtall foretrekker visse kvadratiske former framfor andre er ett av de dypeste uløste problemene i tallteorien — Ulam så det på en serviett.",
    ctaInteractive: "→ Åpne Utforskeren",
  },
  encounter: {
    pretitle: "Første møte",
    title: "Skriv heltallene i spiral. Merk primtallene. Se etter.",
    cards: [
      {
        label: "01",
        title: "Den store ideen",
        body: "Skriv 1 i midten, gå så heltallene rundt det i en kvadratisk spiral — høyre, opp, venstre, venstre, ned, ned, høyre, høyre, høyre. Fyll bare cellene hvis tall er primtall. Det burde ikke være noe mønster. Det er det.",
      },
      {
        label: "02",
        title: "Ulam, 1963",
        body: "Stanisław Ulam krotet det ned under et kjedelig seminar på baksiden av en serviett. Året etter publiserte han, Stein og Wells det i American Mathematical Monthly, og Martin Gardners spalte i Scientific American gjorde bildet med 65 000 celler berømt samme år. Diagonalene hadde ligget skjult i heltallene hele tiden.",
      },
      {
        label: "03",
        title: "Hvorfor det betyr noe",
        body: "Hver diagonal er et polynom 4n² + bn + c. At så mange er rike på primtall, er et vindu inn til Bunjakovskijs formodning fra 1857 og Hardy–Littlewood-programmet — åpne problemer som fortsatt overrasker oss.",
      },
    ],
    tryIt:
      "Under: tegn spiralen selv, og test så et hvilket som helst polynom for å se hvor mange primtall det gir.",
  },
  sections: [
    {
      pretitle: "Avsnitt 01 · Konstruksjonen",
      title: "Start på 1, spiral utover",
      body: "Skriv 1 midt på rutete papir. Steg høyre for 2, opp for 3, venstre for 4 og 5, ned for 6 og 7, høyre for 8, 9, 10, så opp for 11, 12, 13. Fortsett å gå utover i en kvadratisk spiral — hvert heltall havner i nøyaktig én rute.",
    },
    {
      pretitle: "Avsnitt 02 · Diagonalene",
      title: "Primtall foretrekker visse kvadrater 4n² + bn + c",
      body: "Tall langs en hvilken som helst rett diagonal lyder en kvadrat på formen 4n² + bn + c. De synlige primtallsstripene er nettopp de diagonalene hvis polynom tilfeldigvis er uvanlig rikt på primtall. Geometrien er bare bokføring; overraskelsen er aritmetisk.",
    },
    {
      pretitle: "Avsnitt 03 · Berømte kvadrater",
      title: "Eulers n² − n + 41",
      body: "I 1772 la Euler merke til at n² − n + 41 er primtall for hvert heltall n fra 0 til 40: førtién etterfølgende primverdier fra et eneste polynom, og bommer først ved n = 41 (som havner på 41²). På spiralen er det én ubrutt diagonal stripe. Ingen annen enkel kvadrat har slått den ennå.",
    },
    {
      pretitle: "Avsnitt 04 · Bunjakovskijs formodning",
      title: "Uendelig mange primtall — ubevist for hver eneste",
      body: "Viktor Bunjakovskij formodet i 1857 at ethvert irredusibelt polynom i ℤ[x] uten fast primdivisor og med positiv ledende koeffisient gir uendelig mange primtall. For n² + 1, for n² − n + 41, for nesten enhver konkret kvadrat spiralen viser — vi klarer fortsatt ikke å bevise det.",
    },
    {
      pretitle: "Avsnitt 05 · Hardy–Littlewood-tettheter",
      title: "Samsvaret mellom formodning og bilde er nifst",
      body: "Hardy og Littlewoods formodning F fra 1923 forutsier for hver kvadrat den nøyaktige asymptotiske tettheten av primtall langs diagonalen. Formodningene er ubeviste, men det numeriske samsvaret med Ulam-spiralen er nesten perfekt — bildet bekrefter aritmetikken og aritmetikken forklarer bildet.",
    },
    {
      pretitle: "Avsnitt 06 · Den dypere gåten",
      title: "Kvadratiske former, Sato–Tate, modulære skygger",
      body: "Bak diagonalene lever den analytiske tallteorien for kvadratiske former, Sato–Tate-fordelingen av spordata og de modulære formene. Ulams serviett-skisse er et vindu inn i en av den moderne matematikkens mest sta avkroker — uforvarende tegnet av hvem som helst med rutete papir.",
    },
  ],
  spiralCaption: "Interaktivt · spiralen i sanntid",
  spiralSideLabel: "Rutenettets side",
  spiralHighlightLabel: "Fremhev en diagonal",
  spiralPrimes: (n) => `${n.toLocaleString("nb-NO")} primtall`,
  spiralNumbers: (n) => `${n.toLocaleString("nb-NO")} tall`,
  spiralHint:
    "Rav = primtall. Rosa = diagonalen den valgte kvadraten skjærer ut. Cyan-kontur markerer 1 i midten.",
  spiralQuadratics: [
    { id: "none", label: "Av", a: 0, b: 0, c: 0 },
    { id: "euler", label: "Euler · n² − n + 41", a: 1, b: -1, c: 41 },
    { id: "n2n17", label: "n² + n + 17", a: 1, b: 1, c: 17 },
    { id: "n2n11", label: "n² + n + 11", a: 1, b: 1, c: 11 },
    { id: "4n2_2n41", label: "4n² − 2n + 41", a: 4, b: -2, c: 41 },
  ],
  quadraticCaption: "Interaktivt · test en kvadrat",
  quadraticCoefficientsLabel: "Koeffisienter i an² + bn + c",
  quadraticPresetsLabel: "Berømte forhåndsinnstillinger",
  quadraticRangeLabel: "n = 0 … 40",
  quadraticFormulaLabel: "kvadraten",
  quadraticPrimeRate: (hits, total, pct) => `${hits} / ${total} primtall · ${pct}`,
  quadraticNote:
    "Hver celle viser n øverst og a·n² + b·n + c under. Ravfargede celler er primtall. Eulers kvadrat klarer alle 41 / 41, der 41 dukker opp ved både n = 0 og n = 1. Prøv din egen.",
  quadraticPresets: [
    { label: "n² − n + 41", a: 1, b: -1, c: 41 },
    { label: "n² + n + 17", a: 1, b: 1, c: 17 },
    { label: "n² + n + 11", a: 1, b: 1, c: 11 },
    { label: "n² + 1", a: 1, b: 0, c: 1 },
    { label: "2n² + 29", a: 2, b: 0, c: 29 },
    { label: "n² + n + 1", a: 1, b: 1, c: 1 },
  ],
  closingPretitle: "Gå videre",
  closingTitle: "Åpne Utforskeren.",
  closingBody:
    "Utforskeren skyver rutenettet opp til 501 × 501 — en kvart million heltall — og lar deg sveipe gjennom kvadrater for å finne dine egne primtallsrike diagonaler.",
  ctaLabel: "→ Åpne Utforskeren",
};

const RICH_STORY: Record<Locale, RichStory> = { en, de, es, fr, it, pt, sv, no };

// --------------------------------------------------------------------------

function EncounterCard({ label, title, body }: { label: string; title: string; body: string }) {
  return (
    <div className="glass hairline h-full space-y-3 rounded-2xl border p-6 transition-colors hover:border-signal-teal/40">
      <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>{label}</div>
      <h3 className="math-italic text-2xl leading-snug text-ink-100">{title}</h3>
      <p className="text-sm leading-relaxed text-ink-200">{body}</p>
    </div>
  );
}

export default function UlamStory() {
  const { locale } = useI18n();
  const story = RICH_STORY[locale];
  const heroPage: StoryPage = { ...story.page, sections: [] };
  const [sec0, sec1, sec2, sec3, sec4, sec5] = story.sections;

  return (
    <StoryPageShell
      page={heroPage}
      ctaHref="/ulam/explorer"
      accent={ACCENT}
      borderAccent="border-signal-teal/70"
      bgAccent="bg-signal-teal/10"
      hoverAccent="hover:bg-signal-teal/20"
      gradient="from-signal-teal/10"
      formulaBadge="diagonals ↔ 4n² + bn + c"
      formulaLatex={"\\mathrm{spiral}(n) \\in \\mathbb{P}\\,?"}
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
              <EncounterCard label={card.label} title={card.title} body={card.body} />
            </Reveal>
          ))}
        </div>
        <Reveal delay={500}>
          <div className="text-center italic text-ink-300">{story.encounter.tryIt}</div>
        </Reveal>
      </section>

      {/* Section 01 — the construction */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec0!.pretitle}
          title={sec0!.title}
          body={sec0!.body}
          accent={ACCENT}
        />
      </section>

      {/* Section 02 — the diagonals */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec1!.pretitle}
          title={sec1!.title}
          body={sec1!.body}
          accent={ACCENT}
        />
      </section>

      {/* INTERACTIVE 1 · the spiral live */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <Reveal delay={120}>
          <UlamSpiralMini
            caption={story.spiralCaption}
            sideLabel={story.spiralSideLabel}
            highlightLabel={story.spiralHighlightLabel}
            primesLabel={story.spiralPrimes}
            numbersLabel={story.spiralNumbers}
            hint={story.spiralHint}
            quadratics={story.spiralQuadratics}
            ariaLabel={story.page.title}
          />
        </Reveal>
      </section>

      {/* Section 03 — famous quadratics: Euler */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec2!.pretitle}
          title={sec2!.title}
          body={sec2!.body}
          accent={ACCENT}
        />
        <Reveal delay={120}>
          <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-8 text-center">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              Euler, 1772
            </div>
            <div className="math-italic text-3xl text-ink-100 md:text-4xl">n² − n + 41</div>
            <p className="mx-auto max-w-xl text-sm leading-relaxed text-ink-300">
              Prime for every n from 0 to 40: a single uninterrupted diagonal streak.
            </p>
          </div>
        </Reveal>
      </section>

      {/* INTERACTIVE 2 · quadratic tester */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <Reveal delay={120}>
          <UlamQuadraticTester
            caption={story.quadraticCaption}
            coefficientsLabel={story.quadraticCoefficientsLabel}
            presetsLabel={story.quadraticPresetsLabel}
            rangeLabel={story.quadraticRangeLabel}
            primeRateLabel={story.quadraticPrimeRate}
            formulaLabel={story.quadraticFormulaLabel}
            note={story.quadraticNote}
            presets={story.quadraticPresets}
          />
        </Reveal>
      </section>

      {/* Section 04 — Bunyakovsky */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec3!.pretitle}
          title={sec3!.title}
          body={sec3!.body}
          accent={ACCENT}
        />
      </section>

      {/* Section 05 — Hardy–Littlewood */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec4!.pretitle}
          title={sec4!.title}
          body={sec4!.body}
          accent={ACCENT}
        />
      </section>

      {/* Section 06 — the deeper mystery */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec5!.pretitle}
          title={sec5!.title}
          body={sec5!.body}
          accent={ACCENT}
        />
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
            href="/ulam/explorer"
            className="inline-block rounded-full border border-signal-teal/70 bg-signal-teal/10 px-8 py-4 font-mono text-sm uppercase tracking-widest2 text-signal-teal transition-colors hover:bg-signal-teal/25"
          >
            {story.ctaLabel}
          </Link>
        </section>
      </Reveal>
    </StoryPageShell>
  );
}
