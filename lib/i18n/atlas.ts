// Landing page + per-topic strings in 8 languages. The topic body is one
// concise paragraph that explains the curiosity to a layperson, accurate
// enough that a mathematician will not wince.

import type { Locale } from "./types";
import type { TopicId } from "../topics";
import { EN_PLACEHOLDERS } from "./placeholders";

export interface AtlasDict {
  landing: {
    pretitle: string;
    title1: string;
    title2: string;
    subtitle: string;
    hook: string;
    intro1: string;
    intro2: string;
    forWhomLabel: string;
    forWhom: string;
    motivationLabel: string;
    motivation: string;
    browseLabel: string;
    statusInteractive: string;
    statusStub: string;
    categoryLogic: string;
    categoryComputation: string;
    categoryChaos: string;
    categoryGeometry: string;
    categoryAnalysis: string;
    categoryParadox: string;
    enterTopic: string;
    inDevelopment: string;
    authoredByPrefix: string;
    authoredByName: string;
    authoredByOrg: string;
    // Atlas-as-constellation strings (optional — fall back in English in
    // TopicConstellation when a locale hasn't filled them in yet).
    constellationAriaLabel?: string;
    constellationHint?: string;
    viewConstellation?: string;
    viewList?: string;
    // v2 spotlight constellation additions. Optional so locales that haven't
    // been translated yet fall back to English literals at the call site.
    constellationSearchLabel?: string;
    constellationSearchPlaceholder?: string;
    constellationEmpty?: string;
    // v3 cluster-expand constellation additions. Optional, EN literals as
    // fallback so untranslated locales keep working.
    constellationExpandHint?: string;
    constellationClose?: string;
    constellationCategoryHint?: string;
    // Always-visible "back to overview" pill shown when a cluster is zoomed.
    // Different from constellationClose (the older small Close button) — this
    // one is the primary escape hatch from a zoomed-in state.
    constellationCloseZoom?: string;
  };
  nav: {
    atlas: string;
  };
  footer: {
    author: string;
  };
  comingSoon: {
    title: string;
    body: string;
    back: string;
  };
  topics: Record<TopicId, { title: string; tagline: string; body: string }>;
}

const en: AtlasDict = {
  landing: {
    pretitle: "An atlas of mathematical curiosities",
    title1: "From almost nothing",
    title2: "everything",
    subtitle: "Ideas in which a single rule unfolds into an entire universe.",
    hook: "One operator. One rule. One equation. And suddenly: logic, life, chaos. Universes from almost nothing — math at the moment it stops being homework and starts looking like art.",
    intro1:
      "Every room begins with almost nothing — one operator, one rule, one equation — and walks until the picture is dense. Every room is fully built; you get to turn every knob, restart every iteration, zoom every picture down to the last digit.",
    intro2:
      "Click a tile to step in. Two minutes of reading, ten of playing. No tricks. These are the small statements mathematicians keep coming back to — laid out here so you can see them.",
    forWhomLabel: "Who this is for",
    forWhom:
      "For anyone who once paused because a formula was beautiful. Students, developers, teachers, artists, curious humans — and anyone who suspects the prettiest part of mathematics never made it into the textbook.",
    motivationLabel: "Why this exists",
    motivation:
      "Because the best part of a proof is rarely the proof itself — it's the moment when a tiny rule first produces something nobody expected. Textbooks rush past that moment. Foldscape is my attempt to hand it to you so you can hold it.",
    browseLabel: "Browse the atlas",
    statusInteractive: "Interactive",
    statusStub: "In development",
    categoryLogic: "Logic",
    categoryComputation: "Computation",
    categoryChaos: "Chaos",
    categoryGeometry: "Geometry",
    categoryAnalysis: "Analysis",
    categoryParadox: "Paradox",
    enterTopic: "Enter →",
    inDevelopment:
      "An interactive room is being built. Below is the idea itself, in plain language.",
    authoredByPrefix: "Curated by",
    authoredByName: "Simon Franzen",
    authoredByOrg: "zauberware",
    constellationAriaLabel:
      "Atlas constellation — twelve bright stars, six clickable categories. Open a category to see its other stars.",
    constellationHint: "Click a category to open it. Hover a star to see its relatives.",
    viewConstellation: "Constellation",
    viewList: "List",
    constellationSearchLabel: "Search the atlas",
    constellationSearchPlaceholder: "Search topics, formulas, ideas…",
    constellationEmpty: "Nothing matches.",
    constellationExpandHint: "Open",
    constellationClose: "Close",
    constellationCategoryHint: "Open the cluster",
    constellationCloseZoom: "↺ Back to atlas",
  },
  nav: { atlas: "Atlas" },
  footer: {
    author: "Curated by Simon Franzen · zauberware",
  },
  comingSoon: {
    title: "Coming soon",
    body: "An interactive exhibit for this curiosity is in progress. The text below is the idea in plain language — accurate, but not yet playable.",
    back: "← Back to the atlas",
  },
  topics: {
    ...EN_PLACEHOLDERS,
    nand: {
      title: "The Sheffer Stroke",
      tagline: "One gate is enough for all of digital logic",
      body: "The NAND gate (a ↑ b = ¬(a ∧ b)) is functionally complete on its own: every Boolean expression — AND, OR, NOT, XOR, the lot — can be built from NANDs alone. This is why entire computer chips are physically realised as a sea of NANDs. The result was settled in the 1910s by Henry Sheffer.",
    },
    iota: {
      title: "The Iota Combinator",
      tagline: "One symbol that is Turing-complete",
      body: "Iota (℩) is a single combinator defined as ℩x = xSK. With nothing but Iota and parentheses you can re-derive S and K, and from S and K you can encode every computable function. A whole programming language lives inside one symbol.",
    },
    life: {
      title: "Conway's Game of Life",
      tagline: "Four rules. Spaceships, factories, computers.",
      body: "A cell on a grid is born if it has exactly three live neighbours, survives with two or three, dies otherwise. From those four lines unfold gliders, glider guns, oscillators, replicators — and, fully working, a Turing machine. People have built Game of Life inside Game of Life.",
    },
    rule110: {
      title: "Rule 110",
      tagline: "An eight-bit rule, provably universal",
      body: "Each cell looks at itself and its two neighbours and updates by the rule numbered 110 in binary (01101110). The pattern that grows from a single dot encodes computations — Cook and Wolfram proved this single rule is Turing-complete. The simplest known universal machine you can describe in a tweet.",
    },
    logistic: {
      title: "The Logistic Map",
      tagline: "A harmless formula where order collapses into chaos",
      body: "Iterate xₙ₊₁ = r · xₙ · (1 − xₙ) and increase r. The fixed point splits into a 2-cycle, then 4, then 8 — a cascade of doublings that ends in full chaos around r ≈ 3.5699. Inside that cascade hides the Feigenbaum constant 4.6692…, the same number that governs unrelated chaotic systems across physics.",
    },
    mandelbrot: {
      title: "The Mandelbrot Set",
      tagline: "Square and add. Forever.",
      body: "For each complex number c, iterate zₙ₊₁ = zₙ² + c starting from 0 and ask whether the sequence stays bounded. The black blob of points that do is the Mandelbrot set — one of the most intricate objects ever drawn. Zoom anywhere on its edge and the structure never simplifies.",
    },
    lorenz: {
      title: "The Lorenz Attractor",
      tagline: "Three lines of code, one butterfly",
      body: "Three coupled differential equations modelling a slice of the atmosphere. Plotted in space, the trajectory loops around two centres in a shape that looks exactly like a butterfly — the visual signature of chaos theory and the source of the phrase 'butterfly effect'.",
    },
    fourier: {
      title: "The Fourier Transform",
      tagline: "Every signal is a sum of sine waves",
      body: "Any reasonable function of time can be decomposed into a (possibly infinite) sum of pure sines and cosines, each with its own frequency and amplitude. This single fact is why MP3, JPEG, MRI scanners, your Wi-Fi, and almost every modern audio tool work. Sound, image, signal — all secretly waves stacked on waves.",
    },
    euler: {
      title: "Euler's Identity",
      tagline: "The five most important numbers, in one line",
      body: "eⁱᵖⁱ + 1 = 0. The number e from growth, π from circles, i from the imaginary, plus 0 and 1 — all bound by a single equality. Most working mathematicians vote it the most beautiful formula they know; the proof is two lines of calculus and a leap of identification.",
    },
    banach: {
      title: "The Banach–Tarski Paradox",
      tagline: "Cut a ball, end up with two of the same size",
      body: "Using the Axiom of Choice you can decompose a solid ball in three-dimensional space into finitely many pieces and reassemble them — without stretching or distorting — into two solid balls each identical to the original. It is rigorously proven and impossible to do with anything physical. The 'pieces' are not measurable sets; that is where the strangeness lives.",
    },
  },
};

const de: AtlasDict = {
  landing: {
    pretitle: "Ein Atlas mathematischer Kuriositäten",
    title1: "Aus fast nichts",
    title2: "alles",
    subtitle: "Ideen, in denen sich aus einer einzigen Regel ein ganzes Universum entfaltet.",
    hook: "Eine Operation. Eine Regel. Eine Gleichung. Und plötzlich: Logik, Leben, Chaos. Universen aus fast nichts — Mathematik in dem Moment, in dem sie aufhört Hausaufgabe zu sein und anfängt, wie Kunst auszusehen.",
    intro1:
      "Jeder Raum beginnt bei fast nichts — ein Operator, eine Regel, eine Gleichung — und läuft, bis das Bild dicht wird. Jeder Raum ist fertig ausgebaut; du darfst an jedem Knopf drehen, jede Iteration neu starten, jedes Bild bis zur letzten Stelle zoomen.",
    intro2:
      "Klicke eine Kachel, um einzutreten. Zwei Minuten Lesen, zehn Minuten Spielen. Keine Tricks. Es sind die kleinen Aussagen, zu denen Mathematiker:innen immer wieder zurückkehren — hier aufbereitet, damit du sie siehst.",
    forWhomLabel: "Für wen das hier ist",
    forWhom:
      "Für alle, die schon einmal stehen geblieben sind, weil eine Formel schön war. Schüler:innen, Studierende, Entwickler:innen, Künstler:innen, Mathelehrer:innen — und alle, die ahnen, dass der schönste Teil der Mathematik nie im Schulbuch gelandet ist.",
    motivationLabel: "Warum es das gibt",
    motivation:
      "Weil das Schönste an einem Beweis selten der Beweis selbst ist — es ist der Moment, in dem eine winzige Regel zum ersten Mal etwas hervorbringt, das niemand erwartet hat. Lehrbücher überspringen diesen Moment. Foldscape ist mein Versuch, ihn dir in die Hand zu legen.",
    browseLabel: "Atlas durchstöbern",
    statusInteractive: "Interaktiv",
    statusStub: "In Entwicklung",
    categoryLogic: "Logik",
    categoryComputation: "Berechnung",
    categoryChaos: "Chaos",
    categoryGeometry: "Geometrie",
    categoryAnalysis: "Analysis",
    categoryParadox: "Paradoxon",
    enterTopic: "Eintreten →",
    inDevelopment:
      "Der interaktive Raum wird noch gebaut. Unten steht die Idee selbst, in einfacher Sprache.",
    authoredByPrefix: "Kuratiert von",
    authoredByName: "Simon Franzen",
    authoredByOrg: "zauberware",
    constellationAriaLabel:
      "Atlas-Sternbild — zwölf helle Sterne, sechs klickbare Kategorien. Öffne eine Kategorie, um ihre weiteren Sterne zu sehen.",
    constellationHint:
      "Klicke eine Kategorie, um sie zu öffnen. Zeige auf einen Stern, um seine Verwandten zu sehen.",
    viewConstellation: "Sternbild",
    viewList: "Liste",
    constellationSearchLabel: "Atlas durchsuchen",
    constellationSearchPlaceholder: "Themen, Formeln, Ideen suchen…",
    constellationEmpty: "Nichts passt.",
    constellationExpandHint: "Öffnen",
    constellationClose: "Schließen",
    constellationCategoryHint: "Cluster öffnen",
    constellationCloseZoom: "↺ Zurück zum Atlas",
  },
  nav: { atlas: "Atlas" },
  footer: {
    author: "Kuratiert von Simon Franzen · zauberware",
  },
  comingSoon: {
    title: "In Vorbereitung",
    body: "Eine interaktive Ausstellung zu dieser Kuriosität ist in Arbeit. Der Text unten ist die Idee in einfacher Sprache — korrekt, aber noch nicht spielbar.",
    back: "← Zurück zum Atlas",
  },
  topics: {
    ...EN_PLACEHOLDERS,
    diffusion: {
      title: "Diffusionsmodelle",
      tagline: "Rauschen, Schritt für Schritt zu einem Bild aufgelöst",
      body: "Nimm ein Bild und streue ein wenig Gauß-Rauschen darüber. Wiederhole das tausendmal, und es bleibt nur noch Rauschen. Lerne nun die Umkehrung: gegeben reines Rauschen, sage die leicht weniger verrauschte Version voraus. Stapele tausend solcher Schritte und du erzeugst aus reinem Zufall völlig neue Bilder. Das ist die ganze Idee hinter Stable Diffusion, Midjourney und DALL·E — eine Markov-Kette, die gelernt hat, die Wärmegleichung rückwärts zu laufen.",
    },
    nand: {
      title: "Der Sheffer-Strich",
      tagline: "Ein Gatter genügt für die gesamte digitale Logik",
      body: "Das NAND-Gatter (a ↑ b = ¬(a ∧ b)) ist allein funktional vollständig: jede boolesche Verknüpfung — UND, ODER, NICHT, XOR, alles — lässt sich aus NANDs bauen. Genau deshalb sind ganze Computerchips physikalisch ein Meer aus NAND-Gattern. Das Resultat geht auf Henry Sheffer in den 1910ern zurück.",
    },
    iota: {
      title: "Der Iota-Kombinator",
      tagline: "Ein Symbol — und damit Turing-vollständig",
      body: "Iota (℩) ist ein einzelner Kombinator, definiert als ℩x = xSK. Mit nichts als Iota und Klammern kannst du S und K wiedergewinnen — und aus S und K jede berechenbare Funktion. Eine ganze Programmiersprache lebt in einem einzigen Symbol.",
    },
    life: {
      title: "Conways Game of Life",
      tagline: "Vier Regeln. Raumschiffe, Fabriken, Computer.",
      body: "Eine Zelle auf einem Gitter wird geboren bei genau drei lebenden Nachbarn, überlebt bei zwei oder drei, stirbt sonst. Aus diesen vier Zeilen entstehen Gleiter, Gleiter-Kanonen, Oszillatoren, Replikatoren — und eine voll funktionierende Turing-Maschine. Man hat Game of Life innerhalb von Game of Life gebaut.",
    },
    rule110: {
      title: "Regel 110",
      tagline: "Eine Achtbit-Regel, beweisbar universell",
      body: "Jede Zelle sieht sich selbst und ihre zwei Nachbarn an und aktualisiert nach der Regel mit Binärnummer 110 (01101110). Das Muster, das aus einem einzigen Punkt wächst, kodiert Berechnungen — Cook und Wolfram bewiesen, dass diese eine Regel Turing-vollständig ist. Die einfachste bekannte universelle Maschine, die in einen Tweet passt.",
    },
    logistic: {
      title: "Die logistische Abbildung",
      tagline: "Eine harmlose Formel, in der Ordnung in Chaos kippt",
      body: "Iteriere xₙ₊₁ = r · xₙ · (1 − xₙ) und erhöhe r. Der Fixpunkt spaltet sich in einen 2-Zyklus, dann 4, dann 8 — eine Kaskade von Verdoppelungen, die um r ≈ 3,5699 in volles Chaos endet. In dieser Kaskade versteckt sich die Feigenbaum-Konstante 4,6692…, die dieselbe Zahl ist, die in völlig anderen chaotischen Systemen der Physik wiederkehrt.",
    },
    mandelbrot: {
      title: "Die Mandelbrot-Menge",
      tagline: "Quadriere und addiere. Immer wieder.",
      body: "Für jede komplexe Zahl c iteriere zₙ₊₁ = zₙ² + c, startend bei 0, und frage, ob die Folge beschränkt bleibt. Die schwarze Insel jener Punkte, die das tun, ist die Mandelbrot-Menge — eines der filigransten je gezeichneten Objekte. Zoom irgendwo an ihren Rand und die Struktur wird nie einfacher.",
    },
    lorenz: {
      title: "Der Lorenz-Attraktor",
      tagline: "Drei Zeilen Code, ein Schmetterling",
      body: "Drei gekoppelte Differentialgleichungen modellieren ein Stück Atmosphäre. Im Raum dargestellt, schlingt sich die Bahn um zwei Zentren — in einer Form, die exakt wie ein Schmetterling aussieht. Das visuelle Markenzeichen der Chaostheorie und Ursprung des Begriffs „Schmetterlingseffekt“.",
    },
    fourier: {
      title: "Die Fourier-Transformation",
      tagline: "Jedes Signal ist eine Summe von Sinuswellen",
      body: "Jede vernünftige Funktion der Zeit lässt sich in eine (möglicherweise unendliche) Summe reiner Sinus- und Cosinuswellen zerlegen — jede mit eigener Frequenz und Amplitude. Diese eine Tatsache ist der Grund, warum MP3, JPEG, MRT-Scanner, dein WLAN und fast jedes moderne Audio-Werkzeug funktionieren. Klang, Bild, Signal — alle insgeheim Wellen auf Wellen.",
    },
    euler: {
      title: "Eulers Identität",
      tagline: "Die fünf wichtigsten Zahlen, in einer Zeile",
      body: "eⁱᵖⁱ + 1 = 0. Die Zahl e aus dem Wachstum, π aus dem Kreis, i aus dem Imaginären, dazu 0 und 1 — alle verbunden in einer einzigen Gleichheit. Die meisten Mathematiker:innen halten sie für die schönste Formel überhaupt; der Beweis sind zwei Zeilen Analysis und ein gedanklicher Sprung.",
    },
    banach: {
      title: "Das Banach-Tarski-Paradoxon",
      tagline: "Zerlege eine Kugel — und erhalte zwei gleich große",
      body: "Mit dem Auswahlaxiom kannst du eine massive Kugel im dreidimensionalen Raum in endlich viele Teile zerlegen und sie — ohne Strecken oder Verformen — zu zwei massiven Kugeln gleicher Größe wie das Original zusammensetzen. Streng bewiesen und mit nichts Physikalischem nachvollziehbar. Die „Teile“ sind keine messbaren Mengen; dort wohnt die Seltsamkeit.",
    },
    boids: {
      title: "Boids — Schwärme aus drei Regeln",
      tagline: "Trennung, Ausrichtung, Zusammenhalt. Heraus fliegt ein Schwarm.",
      body: "1986 gab Craig Reynolds jedem simulierten Vogel drei lokale Instinkte: weiche Nachbarn aus, die zu nahe sind (Trennung), drehe in die mittlere Flugrichtung deiner Nachbarn (Ausrichtung), steuere auf deren mittleren Standort zu (Zusammenhalt). Kein Anführer, kein Plan, keine Vogelperspektive. Aus diesen drei winzigen Drangregeln entstehen dichte Schwärme, sich teilende Ströme, wirbelnde Wiedervereinigungen — exakt die Choreografie, die echte Stare, Fischschwärme und Heuschreckenwolken aufführen.",
    },
    dla: {
      title: "Diffusionsbegrenzte Aggregation",
      tagline: "Zufällige Wanderer bleiben kleben — und es wachsen Korallen",
      body: "Setze ein einzelnes Saatpixel. Lass Teilchen einzeln los, jedes auf einer Zufallsbewegung; in dem Moment, in dem ein wanderndes Teilchen den Cluster berührt, friert es dort fest. Wiederhole das zehntausendmal und es wächst eine verästelte, dendritische Struktur aus dem Saatpixel — die gleiche Fraktalform, die Kupfer beim Galvanisieren annimmt, die Flechten an einer Mauer bilden, die ein Blitz auf nackter Haut zurücklässt. Witten und Sander bewiesen 1981, dass das Ergebnis im Zweidimensionalen eine fraktale Dimension von ≈ 1,71 hat — egal womit du anfängst.",
    },
    langton: {
      title: "Langtons Ameise",
      tagline: "Zwei Regeln, zehntausend Schritte, eine Autobahn",
      body: "Eine Ameise steht auf einem weißen Feld eines unendlichen Gitters. Regel: auf Weiß färbe das Feld um, drehe nach rechts, gehe einen Schritt. Auf Schwarz färbe um, drehe nach links, gehe einen Schritt. Etwa zehntausend Schritte lang sieht die Spur wie pures Chaos aus. Dann — ohne Vorwarnung — beginnt die Ameise, ein perfekt periodisches Muster aus 104 Schritten zu zeichnen, das nach unendlich davondriftet. Niemand hat bewiesen, dass die Autobahn immer entsteht; bisher hat sie es einfach immer. Zwei Regeln, ein ungelöstes Wunder der Emergenz.",
    },
    pascalmod: {
      title: "Pascals Dreieck (mod n)",
      tagline: "Färbe nach Teilbarkeit — und ein Fraktal fällt heraus",
      body: "Schreibe Pascals Dreieck. Färbe nun jeden Eintrag nach seinem Rest modulo einer Primzahl p. Für p = 2 (ungerade schwarz, gerade weiß) ist das Resultat das Sierpiński-Dreieck — exakt, unendlich, allein durch Zählen erzeugt. Für p = 3, 5, 7 bekommst du jeweils ein anderes selbstähnliches Sieb. Der Satz dahinter (Kummer, 1852) sagt: C(n, k) ist genau dann durch p teilbar, wenn die p-adische Addition k + (n − k) mindestens einen Übertrag hat — das Fraktal ist also insgeheim ein Bild davon, wann Überträge passieren.",
    },
    sternbrocot: {
      title: "Der Stern-Brocot-Baum",
      tagline: "Jeder Bruch, genau einmal, aus falsch addieren gebaut",
      body: "Starte mit 0/1 und 1/0. Wann immer zwei Brüche nebeneinanderstehen, schiebe ihren Medianten (a + c)/(b + d) dazwischen. Weiter, unendlich. Im so wachsenden Baum bekommt jeder gekürzte Bruch p/q mit p, q > 0 seinen eigenen, einzigen Knoten — keiner fehlt, keiner taucht doppelt auf — und der Links-Rechts-Pfad zu einem Bruch ist exakt seine Kettenbruchentwicklung. Derselbe Baum liefert die besten rationalen Approximationen für irrationale Zahlen: der Weg zu π und φ führt mitten hindurch.",
    },
    ulam: {
      title: "Die Ulam-Spirale",
      tagline: "Primzahlen reihen sich auf rätselhaften Diagonalen auf",
      body: "Stanisław Ulam kritzelte 1963 aus Langeweile bei einem Vortrag die ganzen Zahlen in eine quadratische Spirale und kreiste die Primzahlen ein. Die Primzahlen verteilten sich nicht — sie drängten sich entlang sichtbarer Diagonalen. Viele dieser Diagonalen entsprechen primzahlreichen quadratischen Polynomen wie Eulers n² − n + 41, das für jedes n von 0 bis 39 prim ist. Warum Primzahlen bestimmte quadratische Formen anderen vorziehen, gehört zum tiefsten ungelösten Bereich der Zahlentheorie — Ulam sah es auf einer Serviette.",
    },
    aizawa: {
      title: "Der Aizawa-Attraktor",
      tagline: "Lorenz' seltsamerer, fremderer Cousin",
      body: "Wie Lorenz besteht Aizawa aus drei gekoppelten Differentialgleichungen, die einen Punkt durch den 3D-Raum zerren. Anders als Lorenz' Schmetterling faltet sich die Bahn hier zu einem verknoteten Torus mit Korbhenkel und einer vertikalen Spitze in der Mitte — eine Form, so markant, dass sie zu den meistfotografierten seltsamen Attraktoren überhaupt zählt. Winzige Änderungen der Parameter formen die gesamte Geometrie um: ein einziger Regler verwandelt den Korb in eine Blume, in eine Vase, in Chaos.",
    },
    cardioid: {
      title: "Die Kaffeetassen-Kardioide",
      tagline: "Die Lichtkurve in deiner Tasse ist Mandelbrots Herz",
      body: "Lass paralleles Sonnenlicht in eine zylindrische Kaffeetasse fallen. Die Reflexionen an der Innenwand bündeln sich nicht in einem Punkt — sie umhüllen eine leuchtende, herzförmige Kurve auf der Oberfläche des Kaffees. Diese Kurve ist eine Kardioide: r = 2a(1 − cos θ) in Polarkoordinaten. Dieselbe Gleichung beschreibt die Hauptknospe der Mandelbrot-Menge. Jeden Morgen, in jedem Café, wird die berühmteste Form der Dynamik in Licht gezeichnet.",
    },
    galton: {
      title: "Das Galton-Brett",
      tagline: "Hüpfende Kugeln zeichnen immer dieselbe Glocke",
      body: "Francis Galtons Quincunx ist ein Dreieck aus Stiften. Lass oben eine Kugel los: an jedem Stift entscheidet ein fifty-fifty-Münzwurf, ob es nach links oder rechts geht, bis die Schwerkraft sie in eines der Auffangfächer am Boden befördert. Lässt du zehntausend Kugeln fallen, füllen sich die Fächer — immer — zur Form der Normalverteilung. Die Glocke ist kein Zufall; sie ist der Zentrale Grenzwertsatz zum Anfassen: jede Summe vieler unabhängiger kleiner Zufallsstöße konvergiert gegen eine Gauß-Kurve, unabhängig davon, wie die einzelnen Stöße aussehen.",
    },
    magpendulum: {
      title: "Das magnetische Pendel",
      tagline: "Färbe nach Gewinner — und ein Fraktal erscheint",
      body: "Hänge ein eisernes Pendel über drei in einem Dreieck angeordnete Magnete. Die Bewegung ist deterministisch — Newtons Gesetze plus Magnetkraft plus etwas Reibung — und doch hat die Frage „Über welchem Magneten landet es?“ keine glatte Antwort. Färbe jeden Startpunkt nach seinem späteren Sieger ein und du legst ein Bassin-Fraktal frei: rote, grüne und blaue Bereiche, ineinander verschachtelt auf jeder Skala, mit jedem Grenzpunkt als gleichzeitiger Grenze zwischen allen drei Magneten. Determinismus ohne Vorhersagbarkeit.",
    },
    lsystem: {
      title: "L-Systeme",
      tagline: "Buchstabenweise Umschreibungen, die zu Pflanzen werden",
      body: "Ein L-System (Lindenmayer-System) beginnt mit einer Zeichenkette aus Buchstaben und einer Handvoll Umschreibungsregeln. In jedem Schritt wird jeder Buchstabe gleichzeitig nach den Regeln ersetzt. Interpretierst du das Ergebnis als Befehlssatz für eine Schildkröten-Grafik, entstehen fraktale Farne, Korallen, Astgeflechte — Botanik aus wenigen Zeichen.",
    },
    wang: {
      title: "Wang-Kacheln",
      tagline: "Quadrate mit farbigen Kanten, heimlich ein Computer",
      body: "Eine Wang-Kachel ist ein Einheitsquadrat mit vier farbigen Kanten. Kacheln müssen so gelegt werden, dass benachbarte Kanten in der Farbe übereinstimmen; drehen ist verboten. Mit dem richtigen endlichen Kachelsatz lässt sich jede Turing-Maschine simulieren — und das Muster zwingen, sich nie zu wiederholen. Berechnung und Aperiodizität, versteckt in einem Farbabgleich.",
    },
    collatz: {
      title: "Die Collatz-Vermutung",
      tagline: "Halbiere bei gerade, mal drei plus eins bei ungerade",
      body: "Starte mit einer beliebigen positiven ganzen Zahl. Ist sie gerade, halbiere sie; ist sie ungerade, mal drei plus eins. Die Vermutung: egal womit du beginnst, die Folge erreicht irgendwann die 1. Mit dem Computer für jede Zahl bis 2⁶⁸ bestätigt, nie bewiesen. Rückwärts von 1 aufgespannt, formt die Kette aller ganzen Zahlen einen korallenartigen Baum.",
    },
    doublependulum: {
      title: "Das Doppelpendel",
      tagline: "Zwei verkettete Pendel, totales Chaos",
      body: "Hänge ein zweites Pendel an die Masse eines ersten. Das System hat nur zwei Winkel und zwei Geschwindigkeiten — und doch ist seine Bewegung berüchtigt chaotisch: identisch wirkende Startwerte driften innerhalb von Sekunden weit auseinander. Die Bahnen im Phasenraum zeichnen einige der schönsten Kurven der gesamten dynamischen Systeme.",
    },
    bzr: {
      title: "Die Belousov-Zhabotinsky-Reaktion",
      tagline: "Eine chemische Reaktion, die Spiralen malt",
      body: "Mische Bromat, Malonsäure und einen Katalysator im richtigen Verhältnis und die Lösung kommt nicht zur Ruhe — sie pulsiert, wechselt die Farbe und ordnet sich spontan zu rotierenden Spiralwellen. Die Chemie ist real; die Mathematik dahinter ist ein Reaktions-Diffusions-System, dessen Muster sich im Code nachbauen lassen.",
    },
    turingpattern: {
      title: "Turing-Muster",
      tagline: "Woher die Leopardenflecken kommen",
      body: "1952 zeigte Alan Turing, dass zwei wechselwirkende „Chemikalien“, die unterschiedlich schnell diffundieren, spontan die Symmetrie brechen und stabile Muster bilden können — Flecken, Streifen, verzweigte Netzwerke. Dieselben Gleichungen erklären Leopardenfell, Zebrastreifen, Kaiserfisch-Haut und Teile der Embryonalentwicklung. Ein kleines Reaktions-Diffusions-System mit erstaunlicher Reichweite.",
    },
    sierpinski: {
      title: "Das Sierpiński-Dreieck",
      tagline: "Ein Fraktal, drei Wege hinein",
      body: "Dasselbe Loch-im-Loch-Dreieck taucht aus drei völlig verschiedenen Rezepten auf: rekursive Unterteilung eines Dreiecks, das Chaosspiel mit drei Ecken und die ungeraden Einträge des Pascalschen Dreiecks. Das Muster ist der Fixpunkt dreier unabhängiger Prozesse — konvergente Indizien dafür, dass die Struktur unausweichlich war.",
    },
    chaosgame: {
      title: "Das Chaosspiel",
      tagline: "Würfle, zeichne ein Fraktal",
      body: "Setze drei Punkte zu einem Dreieck. Wähle einen beliebigen Startpunkt. Wiederholt: wähle eine Ecke zufällig, gehe die halbe Strecke dorthin und markiere die Stelle. Nach ein paar tausend Schritten verdichtet sich das Rauschen zu einem perfekten Sierpiński-Dreieck — Ordnung aus purem Zufall, ohne andere Anweisung als das Halbieren.",
    },
    penrose: {
      title: "Penrose-Parkettierungen",
      tagline: "Kacheln, die die Ebene füllen und sich nie wiederholen",
      body: "Roger Penroses Drachen-und-Pfeil-Parkettierung deckt eine unendliche Ebene mit nur zwei Kachelformen ab — aber kein endlicher Ausschnitt wiederholt sich exakt irgendwo anders. Die Symmetrien sind fünfzählig, von der klassischen Kristallographie verboten, und werden insgeheim vom Goldenen Schnitt geregelt. Quasikristalle in der Natur kopieren den Trick.",
    },
    apollonian: {
      title: "Apollonische Kreispackung",
      tagline: "Kreise in Kreisen in Kreisen",
      body: "Starte mit drei einander tangierenden Kreisen. Zwei weitere Kreise lassen sich tangential zu allen dreien zeichnen; fülle jeden Zwischenraum mit einem weiteren solchen Kreis, rekursiv, für immer. Der Satz von Descartes verknüpft ihre Krümmungen algebraisch, und in manchen Startkonfigurationen hat jeder Kreis der gesamten Packung eine ganzzahlige Krümmung. Geometrie voller geheimer Arithmetik.",
    },
    phi: {
      title: "Goldener Schnitt & Fibonacci",
      tagline: "1, 1, 2, 3, 5, 8 — und das Verhältnis, das sich überall versteckt",
      body: "Jedes Glied der Fibonacci-Folge ist die Summe der beiden davor. Das Verhältnis aufeinanderfolgender Glieder konvergiert gegen φ = (1 + √5)/2 ≈ 1,618. Dasselbe φ taucht in den Spiralen von Sonnenblumenkernen auf, in Tannenzapfen, in den Proportionen der Architektur und, weniger zuverlässig, in Postern darüber.",
    },
    buffon: {
      title: "π aus Buffons Nadel",
      tagline: "Wirf Nadeln auf liniertes Papier, teile, erhalte π",
      body: "Zeichne parallele Linien im Abstand d. Lass eine Nadel der Länge ℓ ≤ d zufällig fallen. Die Wahrscheinlichkeit, dass die Nadel eine Linie kreuzt, ist exakt 2ℓ/(πd). Wirfst du tausend Nadeln und zählst die Kreuzungen, kannst du π schätzen — eine Konstante aus Kreisen, die aus geraden Nadeln auf geradem Papier hervorgeht.",
    },
    hilberthotel: {
      title: "Hilberts Hotel",
      tagline: "Immer ein Zimmer frei, auch wenn alles voll ist",
      body: "Stell dir ein Hotel mit unendlich vielen Zimmern vor, alle belegt. Ein neuer Gast trifft ein; bitte alle, ein Zimmer höher zu ziehen, und Zimmer 1 ist plötzlich frei. Unendlich viele neue Gäste treffen ein; verschiebe jede:n in die doppelte Zimmernummer, und jedes ungerade Zimmer ist frei. Unendlichkeit verhält sich anders als alles Endliche, und Hilberts Hotel ist die heiterste Einführung dazu.",
    },
    gabrielshorn: {
      title: "Gabriels Horn",
      tagline: "Endliches Volumen, unendliche Oberfläche",
      body: "Rotiere die Kurve y = 1/x für x ≥ 1 um die x-Achse. Das entstehende Horn hat ein endliches Volumen — π Kubikeinheiten — aber eine unendliche Oberfläche. Du könntest π Kubikeinheiten Farbe hineinfüllen; du könntest seine Außenseite niemals streichen.",
    },
    cantor: {
      title: "Cantors Diagonalargument",
      tagline: "Es gibt mehr reelle als natürliche Zahlen",
      body: "Angenommen, die reellen Zahlen zwischen 0 und 1 ließen sich in einer Folge auflisten. Cantor zeigte, wie man aus jeder solchen Liste eine reelle Zahl konstruiert, die fehlt: ändere die erste Ziffer der ersten Zahl, die zweite Ziffer der zweiten und so weiter entlang der Diagonale. Die neue Zahl kann keiner in der Liste gleichen. Die reellen Zahlen sind überabzählbar — und Unendlichkeit kommt in Größen.",
    },
    godel: {
      title: "Gödels Unvollständigkeit",
      tagline: "Es gibt wahre Aussagen, die kein System beweisen kann",
      body: "Kurt Gödel, 1931. In jedem widerspruchsfreien formalen System, das reich genug ist, um Arithmetik auszudrücken, existiert eine wahre Aussage, die das System selbst nicht beweisen kann. Der Kniff: baue einen Satz, der in der Sprache des Systems sagt „Ich bin nicht beweisbar.“ Könntest du ihn beweisen, wäre er falsch; kannst du es nicht, ist er genau das, was er behauptet. Mathematik wird nie vollständig sein, wie Hilbert es erhoffte.",
    },
    halting: {
      title: "Das Halteproblem",
      tagline: "Kein Programm kann jedes andere Programm vorhersagen",
      body: "Alan Turing, 1936. Angenommen, eine magische Funktion hält(P, x) entscheidet, ob Programm P auf Eingabe x hält. Baue ein neues Programm H', das hält auf sich selbst aufruft und dann das Gegenteil tut — halten, wenn hält(H', H') Schleife sagt, schleifen, wenn hält halten sagt. Füttere H' mit sich selbst. Widerspruch — also kann es keine solche universelle Entscheidungsfunktion geben. Die ursprüngliche Grenze dessen, was Computer entscheiden können.",
    },
    pvsnp: {
      title: "P vs. NP",
      tagline: "Die größte offene Frage der Informatik",
      body: "P ist die Klasse der Probleme, die ein Computer schnell löst. NP ist die Klasse, in der man eine Antwort schnell verifizieren kann. Liegt jedes NP-Problem heimlich in P? Jahrzehnte Forschung, eine Million Dollar Clay-Preis, kein Beweis in beide Richtungen. Wäre P = NP, würde jedes kryptografische System fallen und jedes Kürzeste-Wege-Problem zerschmelzen. Die meisten Informatiker:innen wetten P ≠ NP — aber niemand weiß es.",
    },
    rsa: {
      title: "RSA & Einwegfunktionen",
      tagline: "Multiplizieren ist leicht; Faktorisieren ist unmöglich",
      body: "Rivest, Shamir, Adleman, 1977. Wähle zwei riesige Primzahlen p und q. Multipliziere: n = p · q. Jede:r kann multiplizieren, niemand kann n ohne enormen Rechenaufwand zurück in seine Faktoren spalten. Aus dieser Asymmetrie entstehen Public-Key-Kryptografie, digitale Signaturen, sicheres Banking und verschlüsselte Chats. Die Mathematik unter jedem TLS-Handshake.",
    },
    mobius: {
      title: "Möbiusband & Kleinsche Flasche",
      tagline: "Flächen mit nur einer Seite",
      body: "Verdrehe einen Papierstreifen um eine halbe Drehung und klebe die Enden zusammen. Das Ergebnis hat eine Kante und eine Seite — eine Ameise, die über die Fläche läuft, besucht „beide Seiten“, ohne je die Kante zu überqueren. Im vierdimensionalen Raum erzeugt derselbe Trick an einem Schlauch die Kleinsche Flasche: eine geschlossene Fläche ohne Innen oder Außen. Spielzeug, Kunst und die Grundlagen der Topologie.",
    },
    eulerchar: {
      title: "Euler-Charakteristik",
      tagline: "V − E + F = 2 für jedes brave Polyeder",
      body: "Zähle Ecken, subtrahiere Kanten, addiere Flächen. Für jedes Polyeder ohne Löcher ist die Antwort immer 2 — Würfel, Dodekaeder, Fußball, dein Haus. Die Zahl ist eine topologische Invariante: ziehe die Form, wie du willst, das Ergebnis bleibt fest. Füge ein Loch hinzu und sie fällt auf 0. Topologie in einer Gleichung.",
    },
    konigsberg: {
      title: "Die Königsberger Brücken",
      tagline: "Sieben Brücken, ein unmöglicher Spaziergang",
      body: "1736 bewies Leonhard Euler, dass es keinen Weg gibt, alle sieben Brücken Königsbergs genau einmal zu überqueren. Der Beweis: reduziere die Karte auf einen Graphen; ein Eulerweg existiert nur, wenn höchstens zwei Landmassen eine ungerade Anzahl Brücken haben. Königsberg hatte vier mit ungeradem Grad. Mit diesem Argument erfand Euler die Graphentheorie.",
    },
    fourcolor: {
      title: "Der Vierfarbensatz",
      tagline: "Jede flache Landkarte braucht höchstens vier Farben",
      body: "1852 formuliert, 1976 von Kenneth Appel und Wolfgang Haken bewiesen. Jede Unterteilung der Ebene in Regionen lässt sich mit höchstens vier Farben so einfärben, dass keine zwei angrenzenden Regionen dieselbe Farbe tragen. Der Beweis war der erste große computergestützte Beweis — er reduziert das Problem auf 1834 unvermeidbare Konfigurationen und prüft jede. Mathematiker:innen stritten jahrelang, ob der Beweis „wirklich zähle“.",
    },
    smallworld: {
      title: "Sechs Ecken & kleine Welten",
      tagline: "Zwei beliebige Menschen, sechs Handschläge voneinander entfernt",
      body: "Stanley Milgrams Experiment von 1967 schickte Briefe durch die USA über persönliche Kontakte. Die durchschnittliche Kette war etwa sechs Glieder lang. 1998 zeigten Duncan Watts und Steven Strogatz, dass schon ein paar zufällige Abkürzungen in einem regelmäßigen Netzwerk die mittlere Pfadlänge auf rund log(N) kollabieren lassen, während die lokale Clusterung hoch bleibt. Soziale Netzwerke, Gehirne, Stromnetze und das Internet leben alle in diesem Small-World-Regime.",
    },
    riemann: {
      title: "Die Riemann-Hypothese",
      tagline: "Jede nichttriviale Nullstelle von ζ liegt auf der kritischen Linie",
      body: "Die Riemannsche Zeta-Funktion ζ(s) = 1 + 1/2ˢ + 1/3ˢ + 1/4ˢ + … wird in die gesamte komplexe Ebene fortgesetzt. Die Nullstellen, die nicht bei den negativen geraden Zahlen liegen, scheinen alle auf einer einzigen senkrechten Linie zu sitzen: Realteil genau 1/2. Bernhard Riemann vermutete das 1859 und niemand hat es seither bewiesen oder widerlegt. Ein Beweis würde die Verteilung der Primzahlen festlegen; eines der sieben Millennium-Probleme, 1 Mio. $ Belohnung.",
    },
    backprop: {
      title: "Backpropagation",
      tagline: "Gradientenabstieg auf einer Kettenregel",
      body: "Backpropagation ist der Algorithmus, der ein neuronales Netz aus seinen Fehlern lernen lässt. Schicke eine Eingabe vorwärts durch die Schichten, vergleiche die Ausgabe mit dem Ziel und laufe dann die Kettenregel rückwärts, um für jedes Gewicht zu bestimmen, wie sehr es sich ändern muss, damit die Antwort beim nächsten Mal näher dran ist. Der gesamte moderne KI-Boom ruht auf dieser Idee: nichts als mehrdimensionale Analysis plus eine Menge GPUs. Mehrfach unabhängig entdeckt; bekannt geworden durch Rumelhart, Hinton und Williams 1986.",
    },
  },
};

const es: AtlasDict = {
  landing: {
    pretitle: "Un atlas de curiosidades matemáticas",
    title1: "Desde casi nada",
    title2: "todo",
    subtitle: "Ideas en que una sola regla se despliega en un universo entero.",
    hook: "Un operador. Una regla. Una ecuación. Y de pronto: lógica, vida, caos. Universos a partir de casi nada — la matemática justo cuando deja de ser tarea y empieza a parecer arte.",
    intro1:
      "Cada sala empieza con casi nada — un operador, una regla, una ecuación — y avanza hasta que la imagen se densifica. Todas las salas están totalmente montadas; puedes girar cada perilla, reiniciar cada iteración, hacer zoom en cada imagen hasta el último dígito.",
    intro2:
      "Pulsa una baldosa para entrar. Dos minutos leyendo, diez jugando. Sin trucos. Son los pequeños enunciados a los que los matemáticos vuelven una y otra vez, presentados para que los veas.",
    forWhomLabel: "Para quién es esto",
    forWhom:
      "Para cualquiera que alguna vez se haya detenido porque una fórmula era hermosa. Estudiantes, programadores, profesores, artistas, curiosos — y para todos los que sospechan que la parte más bonita de la matemática nunca llegó al libro de texto.",
    motivationLabel: "Por qué existe",
    motivation:
      "Porque lo más bello de una demostración rara vez es la demostración en sí — es el instante en que una regla minúscula produce por primera vez algo que nadie esperaba. Los libros de texto pasan ese instante de largo. Foldscape es mi intento de ponerlo en tus manos.",
    browseLabel: "Recorrer el atlas",
    statusInteractive: "Interactivo",
    statusStub: "En preparación",
    categoryLogic: "Lógica",
    categoryComputation: "Computación",
    categoryChaos: "Caos",
    categoryGeometry: "Geometría",
    categoryAnalysis: "Análisis",
    categoryParadox: "Paradoja",
    enterTopic: "Entrar →",
    inDevelopment:
      "La sala interactiva todavía se está construyendo. Abajo está la idea misma, en lenguaje sencillo.",
    authoredByPrefix: "Comisariado por",
    authoredByName: "Simon Franzen",
    authoredByOrg: "zauberware",
  },
  nav: { atlas: "Atlas" },
  footer: { author: "Comisariado por Simon Franzen · zauberware" },
  comingSoon: {
    title: "Próximamente",
    body: "Una sala interactiva para esta curiosidad está en preparación. El texto siguiente es la idea en lenguaje sencillo — precisa, pero aún no jugable.",
    back: "← Volver al atlas",
  },
  topics: {
    ...EN_PLACEHOLDERS,
    diffusion: {
      title: "Modelos de difusión",
      tagline: "Ruido disuelto en una imagen, paso a paso",
      body: "Toma cualquier foto y espolvorea un poco de ruido gaussiano. Repítelo mil veces y la imagen se vuelve estática pura. Ahora aprende lo inverso: dado ruido puro, predice la versión un poco menos ruidosa. Apila mil pasos así y puedes generar imágenes nuevas a partir de puro azar. Esa es toda la idea detrás de Stable Diffusion, Midjourney y DALL·E — una cadena de Markov entrenada para hacer correr la ecuación del calor hacia atrás.",
    },
    nand: {
      title: "La barra de Sheffer",
      tagline: "Una sola puerta basta para toda la lógica digital",
      body: "La puerta NAND (a ↑ b = ¬(a ∧ b)) es funcionalmente completa por sí sola: toda expresión booleana — AND, OR, NOT, XOR, lo que sea — se construye sólo con NANDs. Por eso chips enteros se realizan físicamente como un mar de NANDs. El resultado lo estableció Henry Sheffer en los años 1910.",
    },
    iota: {
      title: "El combinador Iota",
      tagline: "Un símbolo y, con él, completitud de Turing",
      body: "Iota (℩) es un solo combinador definido como ℩x = xSK. Con sólo Iota y paréntesis se derivan S y K, y a partir de S y K se codifica toda función computable. Todo un lenguaje habita en un único símbolo.",
    },
    life: {
      title: "El juego de la vida de Conway",
      tagline: "Cuatro reglas. Naves, fábricas, ordenadores.",
      body: "Una célula en una cuadrícula nace si tiene exactamente tres vecinas vivas, sobrevive con dos o tres, muere en otro caso. De esas cuatro líneas surgen planeadores, cañones de planeadores, osciladores, replicadores — y una máquina de Turing en pleno funcionamiento. Se ha construido el juego de la vida dentro del juego de la vida.",
    },
    rule110: {
      title: "Regla 110",
      tagline: "Una regla de ocho bits, demostradamente universal",
      body: "Cada célula mira a sí misma y a sus dos vecinas y se actualiza según la regla número 110 en binario (01101110). El patrón que crece a partir de un solo punto codifica computaciones — Cook y Wolfram demostraron que esta sola regla es Turing-completa. La máquina universal más simple conocida, que cabe en un tuit.",
    },
    logistic: {
      title: "El mapa logístico",
      tagline: "Una fórmula inocente donde el orden cae en caos",
      body: "Itera xₙ₊₁ = r · xₙ · (1 − xₙ) e incrementa r. El punto fijo se divide en un ciclo de 2, luego 4, luego 8 — una cascada de duplicaciones que acaba en caos total alrededor de r ≈ 3,5699. Dentro de esa cascada se esconde la constante de Feigenbaum 4,6692…, el mismo número que rige sistemas caóticos sin relación entre sí en la física.",
    },
    mandelbrot: {
      title: "El conjunto de Mandelbrot",
      tagline: "Eleva al cuadrado y suma. Para siempre.",
      body: "Para cada número complejo c, itera zₙ₊₁ = zₙ² + c empezando en 0 y pregunta si la sucesión queda acotada. La mancha negra de puntos que sí lo hacen es el conjunto de Mandelbrot — uno de los objetos más intrincados jamás dibujados. Haz zoom en cualquier lugar de su borde y la estructura nunca se simplifica.",
    },
    lorenz: {
      title: "El atractor de Lorenz",
      tagline: "Tres líneas de código, una mariposa",
      body: "Tres ecuaciones diferenciales acopladas que modelan un trozo de atmósfera. Trazada en el espacio, la trayectoria gira alrededor de dos centros con una forma exactamente de mariposa — el emblema visual de la teoría del caos y origen de la expresión «efecto mariposa».",
    },
    fourier: {
      title: "La transformada de Fourier",
      tagline: "Toda señal es una suma de ondas senoidales",
      body: "Cualquier función razonable del tiempo puede descomponerse en una suma (posiblemente infinita) de senos y cosenos puros, cada uno con su frecuencia y amplitud. Este único hecho explica por qué MP3, JPEG, los escáneres MRI, tu Wi-Fi y casi toda herramienta de audio moderna funcionan. Sonido, imagen, señal — todos en secreto son ondas sobre ondas.",
    },
    euler: {
      title: "La identidad de Euler",
      tagline: "Los cinco números más importantes en una sola línea",
      body: "eⁱᵖⁱ + 1 = 0. El número e del crecimiento, π de los círculos, i de lo imaginario, más 0 y 1 — todos unidos por una sola igualdad. La mayoría de matemáticos la votan como la fórmula más bella; su demostración son dos líneas de cálculo y un salto de identificación.",
    },
    banach: {
      title: "La paradoja de Banach–Tarski",
      tagline: "Corta una bola y queda con dos del mismo tamaño",
      body: "Usando el axioma de elección puedes descomponer una bola sólida en el espacio tridimensional en un número finito de piezas y reensamblarlas — sin estirar ni deformar — en dos bolas sólidas idénticas a la original. Está rigurosamente probado e imposible con nada físico. Las «piezas» no son conjuntos medibles; allí vive lo extraño.",
    },
    lsystem: {
      title: "Sistemas L",
      tagline: "Reescrituras letra a letra que crecen como plantas",
      body: "Un sistema L (de Lindenmayer) parte de una cadena de letras y un puñado de reglas de reescritura. En cada paso, cada letra se sustituye según las reglas, todas a la vez. Interpreta la cadena resultante como órdenes para una tortuga gráfica y obtienes helechos fractales, corales, ramas de árbol — botánica derivada de unos pocos caracteres.",
    },
    wang: {
      title: "Baldosas de Wang",
      tagline: "Cuadrados con bordes de color, en secreto un ordenador",
      body: "Una baldosa de Wang es un cuadrado unidad cuyos cuatro bordes llevan colores. Las baldosas deben colocarse de modo que los bordes contiguos coincidan; se prohíbe la rotación. Con el conjunto finito adecuado se puede simular cualquier máquina de Turing — y forzar que el embaldosado no se repita nunca. Computación y aperiodicidad escondidas en una coincidencia de colores.",
    },
    collatz: {
      title: "La conjetura de Collatz",
      tagline: "Si es par, divide; si es impar, triplica y suma uno",
      body: "Empieza con cualquier entero positivo. Si es par, divídelo entre dos; si es impar, multiplícalo por tres y suma uno. La conjetura: empieces donde empieces, la sucesión acaba llegando a 1. Verificada por ordenador hasta 2⁶⁸, jamás demostrada. Trazada hacia atrás desde 1, la cadena de todos los enteros forma un árbol parecido a un coral.",
    },
    doublependulum: {
      title: "El péndulo doble",
      tagline: "Dos péndulos en serie, caos total",
      body: "Cuelga un segundo péndulo de la masa de un primero. El sistema tiene apenas dos ángulos y dos velocidades, pero su movimiento es célebremente caótico: arranques idénticos a la vista divergen salvajemente en segundos. Las órbitas en el espacio de fases trazan algunas de las curvas más bellas de los sistemas dinámicos.",
    },
    bzr: {
      title: "La reacción de Belousov–Zhabotinsky",
      tagline: "Una reacción química que dibuja espirales",
      body: "Mezcla bromato, ácido malónico y un catalizador en la proporción adecuada y la disolución no se asienta — late, cambia de color y se organiza espontáneamente en ondas espirales rotantes. La química es real; la matemática detrás es un sistema de reacción-difusión cuyos patrones pueden rederivarse en código.",
    },
    turingpattern: {
      title: "Patrones de Turing",
      tagline: "De dónde vienen las manchas del leopardo",
      body: "En 1952 Alan Turing demostró que dos «sustancias químicas» en interacción que difunden a ritmos distintos pueden romper espontáneamente la simetría y formar patrones estables — manchas, rayas, redes ramificadas. Las mismas ecuaciones explican el pelaje del leopardo, las rayas de la cebra, la piel del pez ángel y parte del desarrollo embrionario. Un pequeño sistema de reacción-difusión, un alcance asombroso.",
    },
    sierpinski: {
      title: "El triángulo de Sierpiński",
      tagline: "Un fractal, tres caminos para llegar a él",
      body: "El mismo fractal de agujero-dentro-de-agujero aparece desde tres recetas completamente distintas: subdivisión recursiva de un triángulo, el juego del caos con tres vértices y las entradas impares del triángulo de Pascal. El patrón es el punto fijo de tres procesos independientes — evidencia convergente de que la estructura era inevitable.",
    },
    chaosgame: {
      title: "El juego del caos",
      tagline: "Lanza un dado, dibuja un fractal",
      body: "Coloca tres puntos formando un triángulo. Elige un punto inicial cualquiera. Repite: elige un vértice al azar, avanza la mitad del camino hacia él y marca el lugar. En unos pocos miles de pasos, el ruido se condensa en un triángulo de Sierpiński perfecto — orden surgido del puro azar, sin más instrucción que un paso a la mitad.",
    },
    penrose: {
      title: "Embaldosados de Penrose",
      tagline: "Baldosas que llenan el plano y nunca se repiten",
      body: "El embaldosado de cometa y dardo de Roger Penrose cubre un plano infinito con sólo dos formas de baldosa — pero ninguna sección finita reaparece exactamente en ningún otro sitio. Las simetrías son de orden cinco, prohibidas por la cristalografía clásica, y gobernadas en silencio por la razón áurea. Los cuasicristales en la naturaleza copian el truco.",
    },
    apollonian: {
      title: "Empaquetado apolíneo de círculos",
      tagline: "Círculos dentro de círculos dentro de círculos",
      body: "Parte de tres círculos mutuamente tangentes. Pueden trazarse dos más tangentes a los tres; rellena cada hueco con otro círculo así, recursivamente, para siempre. El teorema de Descartes liga sus curvaturas algebraicamente, y en algunas configuraciones iniciales todo círculo del empaquetado tiene curvatura entera. Geometría llena de aritmética secreta.",
    },
    phi: {
      title: "Razón áurea y Fibonacci",
      tagline: "1, 1, 2, 3, 5, 8 — y la proporción que se esconde en todas partes",
      body: "Cada término de la sucesión de Fibonacci es la suma de los dos anteriores. La razón de términos consecutivos converge a φ = (1 + √5)/2 ≈ 1,618. El mismo φ aparece en las espirales de las semillas de girasol, en las piñas, en las proporciones de la arquitectura y, con menos fiabilidad, en los pósteres que lo proclaman.",
    },
    buffon: {
      title: "Pi a partir de la aguja de Buffon",
      tagline: "Tira agujas sobre papel rayado, divide, obtén π",
      body: "Traza líneas paralelas separadas una distancia d. Deja caer al azar una aguja de longitud ℓ ≤ d. La probabilidad de que la aguja cruce una línea es exactamente 2ℓ/(πd). Así, si dejas caer mil agujas y cuentas los cruces, puedes estimar π — una constante de círculos surgida de agujas rectas sobre papel recto.",
    },
    hilberthotel: {
      title: "El hotel de Hilbert",
      tagline: "Siempre una habitación más, aunque esté lleno",
      body: "Imagina un hotel con infinitas habitaciones, todas ocupadas. Llega un nuevo huésped; pide a todos que se muden una habitación más arriba y la 1 queda libre. Llegan infinitos huéspedes nuevos; mueve a cada cual al doble de su número y todas las impares quedan libres. El infinito no se comporta como nada finito, y el hotel de Hilbert es la introducción más alegre a ese hecho.",
    },
    gabrielshorn: {
      title: "El cuerno de Gabriel",
      tagline: "Volumen finito, superficie infinita",
      body: "Gira la curva y = 1/x alrededor del eje x desde x = 1 hasta infinito. El cuerno resultante tiene volumen finito — π unidades cúbicas — pero área superficial infinita. Podrías verter π unidades cúbicas de pintura en su interior; nunca podrías pintar su exterior.",
    },
    cantor: {
      title: "El argumento diagonal de Cantor",
      tagline: "Hay más reales que números para contar",
      body: "Supón que los números reales entre 0 y 1 pudieran listarse en una sucesión. Cantor mostró cómo construir, a partir de cualquier lista, un real que falta en ella: cambia la primera cifra del primer número, la segunda del segundo, y así por la diagonal. El nuevo número no puede coincidir con ninguno de la lista. Los reales son incontables — y el infinito tiene tallas.",
    },
    godel: {
      title: "La incompletitud de Gödel",
      tagline: "Hay enunciados verdaderos que ningún sistema puede probar",
      body: "Kurt Gödel, 1931. En todo sistema formal consistente lo bastante rico para expresar la aritmética existe un enunciado verdadero que el sistema no puede demostrar. El truco: construir una sentencia que diga, en el propio lenguaje del sistema, «no soy demostrable». Si pudieras demostrarla, sería falsa; si no puedes, es exactamente lo que afirma. La matemática nunca será completa como Hilbert esperaba.",
    },
    halting: {
      title: "El problema de la parada",
      tagline: "Ningún programa puede predecir a todos los demás",
      body: "Alan Turing, 1936. Supón una función mágica para(P, x) que decide si el programa P se detiene con entrada x. Construye un nuevo programa H' que llame a para sobre sí mismo y haga lo contrario — detenerse si para(H', H') dice bucle, hacer bucle si para dice detenerse. Aliméntalo consigo mismo. Contradicción — luego no existe tal decisor universal. El límite original de lo que los ordenadores pueden decidir.",
    },
    pvsnp: {
      title: "P frente a NP",
      tagline: "La mayor pregunta abierta de la informática",
      body: "P es la clase de problemas que un ordenador resuelve deprisa. NP es la clase en la que, dada una respuesta, se puede verificar deprisa. ¿Está todo problema NP secretamente en P? Décadas de investigación, un premio Clay de un millón de dólares, ningún resultado en ningún sentido. Si P = NP, todo sistema criptográfico se rompería y todo problema de ruta más corta se desharía. La mayoría apuesta P ≠ NP — pero nadie lo sabe.",
    },
    rsa: {
      title: "RSA y funciones de un solo sentido",
      tagline: "Multiplicar es fácil; factorizar es imposible",
      body: "Rivest, Shamir, Adleman, 1977. Toma dos primos enormes p y q. Multiplica: n = p · q. Cualquiera multiplica, nadie revierte n sin un cálculo descomunal. De esa asimetría salen la criptografía de clave pública, las firmas digitales, la banca segura y los chats cifrados. La matemática bajo cada apretón de manos TLS.",
    },
    mobius: {
      title: "Banda de Möbius y botella de Klein",
      tagline: "Superficies con una sola cara",
      body: "Da media vuelta a una tira de papel y pega los extremos. El resultado tiene un solo borde y una sola cara — una hormiga que recorre la superficie visita «ambos lados» sin cruzar nunca el borde. En el espacio cuatridimensional, el mismo truco aplicado a un tubo da la botella de Klein: una superficie cerrada sin interior ni exterior. Juguetes, arte y los cimientos de la topología.",
    },
    eulerchar: {
      title: "Característica de Euler",
      tagline: "V − E + F = 2 para todo poliedro decente",
      body: "Cuenta vértices, resta aristas, suma caras. Para cualquier poliedro sin agujeros la respuesta es siempre 2 — cubo, dodecaedro, balón de fútbol, tu casa. El número es un invariante topológico: estira la forma como quieras, la respuesta no cambia. Añade un agujero y cae a 0. La topología en una sola ecuación.",
    },
    konigsberg: {
      title: "Los puentes de Königsberg",
      tagline: "Siete puentes, un paseo imposible",
      body: "En 1736 Leonhard Euler demostró que no hay manera de cruzar los siete puentes de Königsberg exactamente una vez. La prueba: reduce el mapa a un grafo; un camino euleriano existe sólo si a lo sumo dos masas de tierra tienen un número impar de puentes. Königsberg tenía cuatro con grado impar. Con ese argumento, Euler inventó la teoría de grafos.",
    },
    fourcolor: {
      title: "El teorema de los cuatro colores",
      tagline: "Todo mapa plano necesita a lo sumo cuatro colores",
      body: "Enunciado en 1852, probado en 1976 por Kenneth Appel y Wolfgang Haken. Cualquier subdivisión del plano en regiones puede colorearse con no más de cuatro colores sin que dos regiones vecinas compartan color. Fue el primer gran teorema verificado por ordenador — reduce el problema a 1834 configuraciones inevitables y comprueba cada una. Hubo años de discusión sobre si la prueba «contaba de verdad».",
    },
    smallworld: {
      title: "Seis grados y mundos pequeños",
      tagline: "Dos personas cualesquiera, a seis apretones de mano",
      body: "El experimento de Stanley Milgram de 1967 envió cartas a través de Estados Unidos por contactos personales. La cadena media tenía unos seis eslabones. En 1998 Duncan Watts y Steven Strogatz mostraron que basta añadir unos pocos atajos aleatorios a una red regular para que la longitud media de camino caiga a casi log(N), conservando el clustering local. Redes sociales, cerebros, redes eléctricas e Internet viven en este régimen de mundo pequeño.",
    },
    riemann: {
      title: "La hipótesis de Riemann",
      tagline: "Todo cero no trivial de ζ está en la línea crítica",
      body: "La función zeta de Riemann ζ(s) = 1 + 1/2ˢ + 1/3ˢ + 1/4ˢ + … se extiende a todo el plano complejo. Los ceros que no están en los enteros pares negativos parecen estar todos en una única línea vertical: parte real exactamente 1/2. Bernhard Riemann lo conjeturó en 1859 y nadie lo ha probado ni refutado desde entonces. Una prueba fijaría la distribución de los primos; uno de los siete Problemas del Milenio, recompensa de 1 millón de dólares.",
    },
    backprop: {
      title: "Retropropagación",
      tagline: "Descenso de gradiente sobre la regla de la cadena",
      body: "La retropropagación es el algoritmo que permite a una red neuronal aprender de sus errores. Pasa una entrada hacia adelante por las capas, compara la salida con el objetivo y luego recorre la regla de la cadena hacia atrás para saber, peso a peso, cuánto debe cambiar cada uno para acercar la respuesta la próxima vez. Todo el auge moderno de la IA descansa en esta idea: solo cálculo multivariable más muchas GPUs. Descubierta varias veces de forma independiente; popularizada por Rumelhart, Hinton y Williams en 1986.",
    },
  },
};

const fr: AtlasDict = {
  landing: {
    pretitle: "Un atlas de curiosités mathématiques",
    title1: "À partir de presque rien",
    title2: "tout",
    subtitle: "Des idées où une seule règle se déploie en un univers entier.",
    hook: "Un opérateur. Une règle. Une équation. Et soudain : logique, vie, chaos. Des univers à partir de presque rien — la mathématique au moment où elle cesse d'être un devoir et commence à ressembler à de l'art.",
    intro1:
      "Chaque salle commence avec presque rien — un opérateur, une règle, une équation — et marche jusqu'à ce que l'image soit dense. Chaque salle est entièrement bâtie ; tu peux tourner chaque bouton, relancer chaque itération, zoomer chaque image jusqu'au dernier chiffre.",
    intro2:
      "Clique sur une tuile pour entrer. Deux minutes de lecture, dix de jeu. Aucun tour de magie. Ce sont les petits énoncés sur lesquels les mathématiciens reviennent sans cesse, posés là pour que tu les voies.",
    forWhomLabel: "Pour qui c'est",
    forWhom:
      "Pour quiconque s'est déjà arrêté parce qu'une formule était belle. Élèves, étudiants, développeurs, enseignants, artistes, curieux — et tous ceux qui devinent que la plus belle part des mathématiques n'a jamais atteint le manuel.",
    motivationLabel: "Pourquoi ce site existe",
    motivation:
      "Parce que le plus beau dans une démonstration n'est que rarement la démonstration elle-même — c'est l'instant où une règle minuscule produit pour la première fois quelque chose que personne n'attendait. Les manuels filent devant cet instant. Foldscape est ma tentative de te le mettre entre les mains.",
    browseLabel: "Parcourir l'atlas",
    statusInteractive: "Interactif",
    statusStub: "En préparation",
    categoryLogic: "Logique",
    categoryComputation: "Calcul",
    categoryChaos: "Chaos",
    categoryGeometry: "Géométrie",
    categoryAnalysis: "Analyse",
    categoryParadox: "Paradoxe",
    enterTopic: "Entrer →",
    inDevelopment:
      "La salle interactive est encore en construction. Ci-dessous se trouve l'idée même, en mots simples.",
    authoredByPrefix: "Commissariat",
    authoredByName: "Simon Franzen",
    authoredByOrg: "zauberware",
  },
  nav: { atlas: "Atlas" },
  footer: { author: "Commissariat : Simon Franzen · zauberware" },
  comingSoon: {
    title: "Bientôt disponible",
    body: "Une salle interactive pour cette curiosité est en préparation. Le texte ci-dessous présente l'idée en langage simple — exacte, mais pas encore jouable.",
    back: "← Retour à l'atlas",
  },
  topics: {
    ...EN_PLACEHOLDERS,
    diffusion: {
      title: "Modèles de diffusion",
      tagline: "Du bruit dissous en image, pas après pas",
      body: "Prenez une photographie et saupoudrez-y un peu de bruit gaussien. Recommencez mille fois et l'image n'est plus que grésillement. Apprenez maintenant l'inverse : à partir de bruit pur, prédisez la version un peu moins bruitée. Empilez mille étapes de ce type et vous générez des images inédites depuis du pur hasard. C'est toute l'idée derrière Stable Diffusion, Midjourney et DALL·E — une chaîne de Markov entraînée à faire tourner l'équation de la chaleur à l'envers.",
    },
    nand: {
      title: "La barre de Sheffer",
      tagline: "Une seule porte suffit à toute la logique numérique",
      body: "La porte NAND (a ↑ b = ¬(a ∧ b)) est fonctionnellement complète à elle seule : toute expression booléenne — ET, OU, NON, XOR, l'intégralité — se construit avec des NAND seuls. C'est pour cela que des puces entières sont physiquement réalisées comme une mer de NAND. Le résultat a été établi par Henry Sheffer dans les années 1910.",
    },
    iota: {
      title: "Le combinateur Iota",
      tagline: "Un symbole, et avec lui la complétude de Turing",
      body: "Iota (℩) est un combinateur unique défini par ℩x = xSK. Avec seulement Iota et des parenthèses on retrouve S et K, et à partir de S et K on encode toute fonction calculable. Tout un langage habite dans un seul symbole.",
    },
    life: {
      title: "Le jeu de la vie de Conway",
      tagline: "Quatre règles. Vaisseaux, usines, ordinateurs.",
      body: "Une cellule sur une grille naît avec exactement trois voisines vivantes, survit avec deux ou trois, meurt sinon. De ces quatre lignes naissent planeurs, canons à planeurs, oscillateurs, réplicateurs — et une machine de Turing pleinement fonctionnelle. On a bâti le jeu de la vie à l'intérieur du jeu de la vie.",
    },
    rule110: {
      title: "Règle 110",
      tagline: "Une règle huit bits, démontrablement universelle",
      body: "Chaque cellule se regarde et regarde ses deux voisines, puis se met à jour selon la règle numérotée 110 en binaire (01101110). Le motif issu d'un seul point encode des calculs — Cook et Wolfram ont prouvé que cette règle unique est Turing-complète. La machine universelle la plus simple connue tient dans un tweet.",
    },
    logistic: {
      title: "La carte logistique",
      tagline: "Une formule inoffensive où l'ordre bascule en chaos",
      body: "Itérez xₙ₊₁ = r · xₙ · (1 − xₙ) en augmentant r. Le point fixe se scinde en cycle de 2, puis 4, puis 8 — une cascade de doublements qui s'achève en chaos total vers r ≈ 3,5699. Dans cette cascade se cache la constante de Feigenbaum 4,6692…, le même nombre qui régit des systèmes chaotiques sans rapport en physique.",
    },
    mandelbrot: {
      title: "L'ensemble de Mandelbrot",
      tagline: "Carrer et ajouter. À l'infini.",
      body: "Pour chaque nombre complexe c, itérez zₙ₊₁ = zₙ² + c en partant de 0 et demandez si la suite reste bornée. La tache noire des points qui le font est l'ensemble de Mandelbrot — l'un des objets les plus complexes jamais dessinés. Zoomez n'importe où sur son bord, la structure ne se simplifie jamais.",
    },
    lorenz: {
      title: "L'attracteur de Lorenz",
      tagline: "Trois lignes de code, un papillon",
      body: "Trois équations différentielles couplées modélisant un morceau d'atmosphère. Tracée dans l'espace, la trajectoire s'enroule autour de deux centres en une forme exactement de papillon — la signature visuelle de la théorie du chaos et l'origine de l'« effet papillon ».",
    },
    fourier: {
      title: "La transformation de Fourier",
      tagline: "Tout signal est une somme d'ondes sinusoïdales",
      body: "Toute fonction raisonnable du temps se décompose en une somme (possiblement infinie) de sinus et cosinus purs, chacun avec sa fréquence et son amplitude. Ce seul fait explique pourquoi MP3, JPEG, IRM, votre Wi-Fi et presque tout outil audio moderne fonctionnent. Son, image, signal — tous, en secret, des ondes empilées sur des ondes.",
    },
    euler: {
      title: "L'identité d'Euler",
      tagline: "Les cinq nombres les plus importants en une ligne",
      body: "eⁱᵖⁱ + 1 = 0. Le nombre e issu de la croissance, π des cercles, i de l'imaginaire, plus 0 et 1 — tous reliés par une seule égalité. La plupart des mathématiciens la votent plus belle formule connue ; la démonstration tient en deux lignes d'analyse et un saut d'identification.",
    },
    banach: {
      title: "Le paradoxe de Banach–Tarski",
      tagline: "Découpez une boule, obtenez-en deux de même taille",
      body: "Avec l'axiome du choix, on peut décomposer une boule pleine de l'espace tridimensionnel en un nombre fini de morceaux et les réassembler — sans étirer ni déformer — en deux boules pleines identiques à l'originale. C'est rigoureusement prouvé et impossible avec quoi que ce soit de physique. Les « morceaux » ne sont pas des ensembles mesurables ; c'est là que vit l'étrangeté.",
    },
    lsystem: {
      title: "Les L-systèmes",
      tagline: "Des réécritures lettre à lettre qui poussent en plantes",
      body: "Un L-système (système de Lindenmayer) part d'une chaîne de lettres et d'une poignée de règles de réécriture. À chaque étape, chaque lettre est remplacée selon les règles, simultanément. Interprétez la chaîne obtenue comme un jeu de commandes pour une tortue graphique et vous obtenez fougères fractales, coraux, ramures — de la botanique tirée de quelques caractères.",
    },
    wang: {
      title: "Les tuiles de Wang",
      tagline: "Des carrés à bords colorés, secrètement un ordinateur",
      body: "Une tuile de Wang est un carré unité dont les quatre bords portent des couleurs. Les tuiles doivent être posées de sorte que les bords adjacents s'accordent ; la rotation est interdite. Avec le bon ensemble fini on simule n'importe quelle machine de Turing — et l'on force le pavage à ne jamais se répéter. Calcul et apériodicité cachés dans un accord de couleurs.",
    },
    collatz: {
      title: "La conjecture de Collatz",
      tagline: "Divise si pair, triple-et-un si impair",
      body: "Partez d'un entier positif quelconque. S'il est pair, divisez par deux ; s'il est impair, multipliez par trois et ajoutez un. La conjecture : quel que soit le départ, la suite finit par atteindre 1. Vérifiée par ordinateur jusqu'à 2⁶⁸, jamais démontrée. Tracée à rebours depuis 1, la chaîne de tous les entiers forme un arbre qui ressemble à un corail.",
    },
    doublependulum: {
      title: "Le double pendule",
      tagline: "Deux pendules en série, chaos absolu",
      body: "Suspendez un second pendule à la masse d'un premier. Le système n'a que deux angles et deux vitesses, et pourtant son mouvement est célèbrement chaotique : des départs identiques à l'œil divergent en quelques secondes. Les orbites dans l'espace des phases tracent certaines des courbes les plus belles de la théorie des systèmes dynamiques.",
    },
    bzr: {
      title: "La réaction de Belooussov-Jabotinski",
      tagline: "Une réaction chimique qui dessine des spirales",
      body: "Mélangez bromate, acide malonique et un catalyseur dans les bonnes proportions et la solution ne se stabilise pas — elle pulse, change de couleur, s'organise spontanément en ondes spirales tournantes. La chimie est réelle ; la mathématique sous-jacente est un système de réaction-diffusion dont les motifs se retrouvent dans le code.",
    },
    turingpattern: {
      title: "Les motifs de Turing",
      tagline: "D'où viennent les taches du léopard",
      body: "En 1952, Alan Turing a montré que deux « substances chimiques » en interaction qui diffusent à des vitesses différentes peuvent rompre spontanément la symétrie et former des motifs stables — taches, rayures, réseaux ramifiés. Les mêmes équations expliquent le pelage du léopard, les rayures du zèbre, la peau du poisson-ange et des pans du développement embryonnaire. Un petit système de réaction-diffusion, une portée stupéfiante.",
    },
    sierpinski: {
      title: "Le triangle de Sierpiński",
      tagline: "Un seul fractal, trois chemins pour y arriver",
      body: "Le même fractal triangulaire troué apparaît à partir de trois recettes complètement différentes : subdivision récursive d'un triangle, jeu du chaos à trois sommets et entrées impaires du triangle de Pascal. Le motif est le point fixe de trois processus indépendants — preuves convergentes que cette structure était inévitable.",
    },
    chaosgame: {
      title: "Le jeu du chaos",
      tagline: "Lance un dé, dessine un fractal",
      body: "Placez trois points en triangle. Choisissez un point de départ quelconque. Répétez : tirez un sommet au hasard, avancez de la moitié du chemin et marquez la position. En quelques milliers de tirages, le bruit se condense en un triangle de Sierpiński parfait — l'ordre surgi du hasard pur, sans autre instruction qu'une étape de bissection.",
    },
    penrose: {
      title: "Les pavages de Penrose",
      tagline: "Des tuiles qui couvrent le plan sans jamais se répéter",
      body: "Le pavage cerf-volant-et-fléchette de Roger Penrose couvre un plan infini avec seulement deux formes de tuile — mais aucune portion finie ne se reproduit exactement ailleurs. Les symétries sont d'ordre cinq, interdites par la cristallographie classique, et secrètement régies par le nombre d'or. Les quasi-cristaux naturels copient l'astuce.",
    },
    apollonian: {
      title: "L'empilement apollinien",
      tagline: "Des cercles dans des cercles dans des cercles",
      body: "Partez de trois cercles mutuellement tangents. On peut en tracer deux autres tangents aux trois ; remplissez chaque interstice par un nouveau tel cercle, récursivement, à l'infini. Le théorème de Descartes lie leurs courbures algébriquement, et dans certaines configurations initiales chaque cercle de l'empilement a une courbure entière. De la géométrie pleine d'arithmétique secrète.",
    },
    phi: {
      title: "Nombre d'or & Fibonacci",
      tagline: "1, 1, 2, 3, 5, 8 — et le rapport qui se cache partout",
      body: "Chaque terme de la suite de Fibonacci est la somme des deux précédents. Le rapport de termes consécutifs converge vers φ = (1 + √5)/2 ≈ 1,618. Le même φ se retrouve dans les spirales des graines de tournesol, dans les pommes de pin, dans les proportions de l'architecture et, moins fiablement, dans les affiches qui en parlent.",
    },
    buffon: {
      title: "Pi par l'aiguille de Buffon",
      tagline: "Jetez des aiguilles sur du papier rayé, divisez, obtenez π",
      body: "Tracez des lignes parallèles distantes de d. Lâchez au hasard une aiguille de longueur ℓ ≤ d. La probabilité que l'aiguille croise une ligne vaut exactement 2ℓ/(πd). Donc en lâchant mille aiguilles et en comptant les croisements on estime π — une constante issue des cercles, surgie d'aiguilles droites sur du papier droit.",
    },
    hilberthotel: {
      title: "L'hôtel de Hilbert",
      tagline: "Toujours une chambre de plus, même complet",
      body: "Imaginez un hôtel à une infinité de chambres, toutes occupées. Un nouveau client arrive ; demandez à chacun de monter d'une chambre, et la chambre 1 est libre. Une infinité de nouveaux clients arrivent ; déplacez chacun au double de son numéro, libérant toutes les chambres impaires. L'infini ne se comporte comme rien de fini, et l'hôtel de Hilbert en est l'introduction la plus joyeuse.",
    },
    gabrielshorn: {
      title: "La trompette de Gabriel",
      tagline: "Volume fini, surface infinie",
      body: "Faites tourner la courbe y = 1/x autour de l'axe des x, pour x ≥ 1. La trompette obtenue a un volume fini — π unités cubiques — mais une surface infinie. Vous pourriez y verser π unités cubiques de peinture ; vous ne pourriez jamais en peindre l'extérieur.",
    },
    cantor: {
      title: "L'argument diagonal de Cantor",
      tagline: "Il y a plus de réels que d'entiers à compter",
      body: "Supposez que les réels entre 0 et 1 puissent être listés en suite. Cantor montre comment construire, à partir de toute telle liste, un réel qui en est absent : changez le premier chiffre du premier, le deuxième chiffre du deuxième, et ainsi de suite le long de la diagonale. Le nouveau réel ne peut être aucun de la liste. Les réels sont indénombrables — et l'infini a des tailles.",
    },
    godel: {
      title: "L'incomplétude de Gödel",
      tagline: "Il existe des énoncés vrais qu'aucun système ne peut prouver",
      body: "Kurt Gödel, 1931. Dans tout système formel cohérent assez riche pour exprimer l'arithmétique, il existe un énoncé vrai que le système lui-même ne peut prouver. L'astuce : bâtir une phrase qui dit, dans le langage du système, « je ne suis pas prouvable ». Si vous pouviez la prouver, elle serait fausse ; si vous ne le pouvez pas, elle est exactement ce qu'elle affirme. La mathématique ne sera jamais complète comme Hilbert l'espérait.",
    },
    halting: {
      title: "Le problème de l'arrêt",
      tagline: "Aucun programme ne peut prédire tous les autres",
      body: "Alan Turing, 1936. Supposez une fonction magique arrête(P, x) qui décide si le programme P s'arrête sur l'entrée x. Construisez un programme H' qui appelle arrête sur lui-même puis fait l'inverse — s'arrêter si arrête(H', H') dit boucle, boucler si arrête dit arrêter. Donnez H' en entrée à lui-même. Contradiction — donc aucun tel décideur universel n'existe. La limite originelle de ce que les ordinateurs peuvent décider.",
    },
    pvsnp: {
      title: "P contre NP",
      tagline: "La plus grande question ouverte de l'informatique",
      body: "P est la classe des problèmes qu'un ordinateur résout vite. NP est la classe où, étant donnée une réponse, on la vérifie vite. Tout problème NP est-il secrètement dans P ? Des décennies de recherche, un prix Clay d'un million de dollars, aucune preuve dans un sens ou l'autre. Si P = NP, tout système cryptographique tomberait et tout plus court chemin fondrait. La plupart parient P ≠ NP — mais personne ne sait.",
    },
    rsa: {
      title: "RSA & fonctions à sens unique",
      tagline: "Multiplier est facile ; factoriser est impossible",
      body: "Rivest, Shamir, Adleman, 1977. Prenez deux énormes nombres premiers p et q. Multipliez : n = p · q. Tout le monde sait multiplier, personne ne sait scinder n sans un calcul colossal. De cette asymétrie viennent la cryptographie à clé publique, les signatures numériques, la banque en ligne et les chats chiffrés. La mathématique sous chaque poignée de main TLS.",
    },
    mobius: {
      title: "Ruban de Möbius & bouteille de Klein",
      tagline: "Des surfaces à une seule face",
      body: "Faites un demi-tour à une bande de papier et collez les extrémités. Le résultat a un bord et une face — une fourmi qui parcourt la surface visite « les deux côtés » sans jamais traverser le bord. En quatre dimensions, le même tour appliqué à un tube donne la bouteille de Klein : une surface fermée sans intérieur ni extérieur. Des jouets, de l'art et les fondations de la topologie.",
    },
    eulerchar: {
      title: "Caractéristique d'Euler",
      tagline: "S − A + F = 2 pour tout polyèdre sage",
      body: "Comptez les sommets, soustrayez les arêtes, ajoutez les faces. Pour tout polyèdre sans trou, la réponse vaut toujours 2 — cube, dodécaèdre, ballon de foot, votre maison. Le nombre est un invariant topologique : étirez la forme à votre guise, la réponse reste fixe. Ajoutez un trou et il tombe à 0. La topologie en une équation.",
    },
    konigsberg: {
      title: "Les ponts de Königsberg",
      tagline: "Sept ponts, une promenade impossible",
      body: "En 1736, Leonhard Euler prouve qu'on ne peut traverser exactement une fois chacun des sept ponts de Königsberg. La preuve : ramener la carte à un graphe ; un chemin eulérien n'existe que si au plus deux îles ont un nombre impair de ponts. Königsberg en avait quatre de degré impair. Avec ce raisonnement, Euler inventait la théorie des graphes.",
    },
    fourcolor: {
      title: "Le théorème des quatre couleurs",
      tagline: "Toute carte plane se colore avec au plus quatre couleurs",
      body: "Énoncé en 1852, prouvé en 1976 par Kenneth Appel et Wolfgang Haken. Toute subdivision du plan en régions peut être coloriée avec au plus quatre couleurs sans que deux régions voisines partagent leur couleur. Ce fut le premier grand théorème vérifié par ordinateur — il réduit le problème à 1834 configurations inévitables et les vérifie une à une. Pendant des années on a débattu de savoir si la preuve « comptait vraiment ».",
    },
    smallworld: {
      title: "Six degrés & petits mondes",
      tagline: "Deux personnes quelconques, à six poignées de main",
      body: "L'expérience de Stanley Milgram (1967) envoyait des lettres à travers les États-Unis par contacts personnels. La chaîne moyenne était d'environ six maillons. En 1998, Duncan Watts et Steven Strogatz montrent qu'il suffit d'ajouter quelques raccourcis aléatoires à un réseau régulier pour faire chuter la longueur moyenne des chemins à environ log(N) tout en conservant un fort clustering local. Réseaux sociaux, cerveaux, réseaux électriques et Internet vivent tous dans ce régime de petit monde.",
    },
    riemann: {
      title: "L'hypothèse de Riemann",
      tagline: "Tout zéro non trivial de ζ se trouve sur la droite critique",
      body: "La fonction zêta de Riemann ζ(s) = 1 + 1/2ˢ + 1/3ˢ + 1/4ˢ + … se prolonge à tout le plan complexe. Les zéros qui ne sont pas aux entiers pairs négatifs semblent tous se tenir sur une seule droite verticale : partie réelle exactement 1/2. Bernhard Riemann l'a conjecturé en 1859 et personne ne l'a prouvé ni réfuté depuis. Une preuve fixerait la distribution des nombres premiers ; l'un des sept problèmes du millénaire, un million de dollars à la clé.",
    },
    backprop: {
      title: "Rétropropagation",
      tagline: "Descente de gradient sur la règle de la chaîne",
      body: "La rétropropagation est l'algorithme qui permet à un réseau de neurones d'apprendre de ses erreurs. Fais passer une entrée à travers les couches, compare la sortie à la cible, puis remonte la règle de la chaîne pour déterminer, poids par poids, de combien chacun doit changer pour rapprocher la réponse la prochaine fois. Tout l'essor moderne de l'IA repose sur cette idée : juste du calcul multivariable plus beaucoup de GPUs. Découverte plusieurs fois indépendamment ; popularisée par Rumelhart, Hinton et Williams en 1986.",
    },
  },
};

const it: AtlasDict = {
  landing: {
    pretitle: "Un atlante di curiosità matematiche",
    title1: "Da quasi nulla",
    title2: "tutto",
    subtitle: "Idee in cui una sola regola si dispiega in un intero universo.",
    hook: "Un operatore. Una regola. Un'equazione. E all'improvviso: logica, vita, caos. Universi da quasi nulla — la matematica nel momento in cui smette di essere compito e inizia ad assomigliare all'arte.",
    intro1:
      "Ogni stanza inizia da quasi nulla — un operatore, una regola, un'equazione — e cammina finché l'immagine non si addensa. Ogni stanza è completamente allestita; puoi girare ogni manopola, riavviare ogni iterazione, ingrandire ogni immagine fino all'ultima cifra.",
    intro2:
      "Tocca una mattonella per entrare. Due minuti di lettura, dieci di gioco. Nessun trucco. Sono i piccoli enunciati ai quali i matematici tornano sempre, presentati perché tu li veda.",
    forWhomLabel: "Per chi è questo",
    forWhom:
      "Per chiunque si sia mai fermato perché una formula era bella. Studenti, sviluppatori, insegnanti, artisti, curiosi — e per chiunque sospetti che la parte più bella della matematica non sia mai finita nei libri di testo.",
    motivationLabel: "Perché esiste",
    motivation:
      "Perché il bello di una dimostrazione raramente è la dimostrazione stessa — è l'istante in cui una regola minuscola produce per la prima volta qualcosa che nessuno si aspettava. I manuali passano oltre quell'istante. Foldscape è il mio tentativo di metterlo nelle tue mani.",
    browseLabel: "Sfoglia l'atlante",
    statusInteractive: "Interattivo",
    statusStub: "In sviluppo",
    categoryLogic: "Logica",
    categoryComputation: "Calcolo",
    categoryChaos: "Caos",
    categoryGeometry: "Geometria",
    categoryAnalysis: "Analisi",
    categoryParadox: "Paradosso",
    enterTopic: "Entra →",
    inDevelopment:
      "La sala interattiva è ancora in costruzione. Sotto trovi l'idea stessa, in parole semplici.",
    authoredByPrefix: "A cura di",
    authoredByName: "Simon Franzen",
    authoredByOrg: "zauberware",
  },
  nav: { atlas: "Atlante" },
  footer: { author: "A cura di Simon Franzen · zauberware" },
  comingSoon: {
    title: "In arrivo",
    body: "Una sala interattiva per questa curiosità è in lavorazione. Il testo seguente è l'idea in linguaggio semplice — corretta, ma non ancora giocabile.",
    back: "← Torna all'atlante",
  },
  topics: {
    ...EN_PLACEHOLDERS,
    diffusion: {
      title: "Modelli di diffusione",
      tagline: "Rumore disciolto in un'immagine, passo dopo passo",
      body: "Prendi una fotografia e cospargila di un po' di rumore gaussiano. Ripeti mille volte e l'immagine è solo fruscio. Ora impara l'inverso: dato il rumore puro, prevedi la versione un po' meno rumorosa. Impila mille passi del genere e generi immagini inedite dal puro caso. È tutta l'idea dietro Stable Diffusion, Midjourney e DALL·E — una catena di Markov addestrata a far girare l'equazione del calore al contrario.",
    },
    nand: {
      title: "Il tratto di Sheffer",
      tagline: "Una sola porta basta per tutta la logica digitale",
      body: "La porta NAND (a ↑ b = ¬(a ∧ b)) è funzionalmente completa da sola: ogni espressione booleana — AND, OR, NOT, XOR, tutto — si costruisce con soli NAND. Per questo interi chip sono realizzati fisicamente come un mare di NAND. Il risultato fu fissato da Henry Sheffer negli anni 1910.",
    },
    iota: {
      title: "Il combinatore Iota",
      tagline: "Un simbolo e, con esso, completezza di Turing",
      body: "Iota (℩) è un singolo combinatore definito da ℩x = xSK. Con sole Iota e parentesi si ricavano S e K, e da S e K si codifica ogni funzione calcolabile. Un intero linguaggio abita in un solo simbolo.",
    },
    life: {
      title: "Il gioco della vita di Conway",
      tagline: "Quattro regole. Navi, fabbriche, computer.",
      body: "Una cellula su una griglia nasce con esattamente tre vicine vive, sopravvive con due o tre, muore altrimenti. Da quelle quattro righe nascono alianti, cannoni di alianti, oscillatori, replicatori — e una macchina di Turing pienamente funzionante. È stato costruito il gioco della vita dentro al gioco della vita.",
    },
    rule110: {
      title: "Regola 110",
      tagline: "Una regola a otto bit, dimostrata universale",
      body: "Ogni cellula guarda sé stessa e le due vicine e si aggiorna secondo la regola numerata 110 in binario (01101110). Il motivo che cresce da un singolo punto codifica calcoli — Cook e Wolfram hanno dimostrato che questa sola regola è Turing-completa. La più semplice macchina universale nota, che entra in un tweet.",
    },
    logistic: {
      title: "La mappa logistica",
      tagline: "Una formula innocua dove l'ordine scivola nel caos",
      body: "Itera xₙ₊₁ = r · xₙ · (1 − xₙ) aumentando r. Il punto fisso si scinde in un ciclo 2, poi 4, poi 8 — una cascata di raddoppi che finisce in caos pieno intorno a r ≈ 3,5699. Dentro quella cascata si nasconde la costante di Feigenbaum 4,6692…, lo stesso numero che governa sistemi caotici scorrelati nella fisica.",
    },
    mandelbrot: {
      title: "L'insieme di Mandelbrot",
      tagline: "Eleva al quadrato e somma. All'infinito.",
      body: "Per ogni numero complesso c, itera zₙ₊₁ = zₙ² + c partendo da 0 e chiediti se la successione resta limitata. La macchia nera dei punti che ci riescono è l'insieme di Mandelbrot — uno degli oggetti più intricati mai disegnati. Zooma in qualunque punto del suo bordo: la struttura non si semplifica mai.",
    },
    lorenz: {
      title: "L'attrattore di Lorenz",
      tagline: "Tre righe di codice, una farfalla",
      body: "Tre equazioni differenziali accoppiate che modellano una fetta di atmosfera. Tracciata nello spazio, la traiettoria si avvolge attorno a due centri in una forma esattamente a farfalla — la firma visiva della teoria del caos e origine dell'« effetto farfalla ».",
    },
    fourier: {
      title: "La trasformata di Fourier",
      tagline: "Ogni segnale è una somma di onde sinusoidali",
      body: "Ogni funzione ragionevole del tempo si decompone in una somma (eventualmente infinita) di seni e coseni puri, ciascuno con la propria frequenza e ampiezza. Questo unico fatto è il motivo per cui MP3, JPEG, le risonanze magnetiche, il tuo Wi-Fi e quasi ogni strumento audio moderno funzionano. Suono, immagine, segnale — tutti in segreto onde su onde.",
    },
    euler: {
      title: "L'identità di Eulero",
      tagline: "I cinque numeri più importanti, in una riga",
      body: "eⁱᵖⁱ + 1 = 0. Il numero e dalla crescita, π dai cerchi, i dall'immaginario, più 0 e 1 — tutti legati da una sola uguaglianza. La maggior parte dei matematici la elegge formula più bella che conoscano; la dimostrazione è due righe di analisi e un balzo di identificazione.",
    },
    banach: {
      title: "Il paradosso di Banach–Tarski",
      tagline: "Taglia una palla, ottienine due della stessa misura",
      body: "Usando l'assioma della scelta puoi decomporre una palla solida nello spazio tridimensionale in un numero finito di pezzi e riassemblarli — senza stirare né deformare — in due palle solide identiche all'originale. È rigorosamente dimostrato e impossibile con qualsiasi cosa fisica. I « pezzi » non sono insiemi misurabili; lì abita la stranezza.",
    },
    lsystem: {
      title: "Sistemi L",
      tagline: "Riscritture lettera per lettera che crescono come piante",
      body: "Un sistema L (di Lindenmayer) parte da una stringa di lettere e da una manciata di regole di riscrittura. A ogni passo ogni lettera viene sostituita secondo le regole, simultaneamente. Interpreta la stringa risultante come comandi per una tartaruga grafica e ottieni felci frattali, coralli, rami d'albero — botanica ricavata da pochi caratteri.",
    },
    wang: {
      title: "Tessere di Wang",
      tagline: "Quadrati con bordi colorati, in segreto un computer",
      body: "Una tessera di Wang è un quadrato unitario i cui quattro bordi portano dei colori. Le tessere vanno poste in modo che i bordi adiacenti combacino; la rotazione è vietata. Con il giusto insieme finito si può simulare qualsiasi macchina di Turing — e forzare il pavimento a non ripetersi mai. Calcolo e aperiodicità nascosti dietro un accordo di colori.",
    },
    collatz: {
      title: "La congettura di Collatz",
      tagline: "Dimezza se pari, triplica più uno se dispari",
      body: "Parti da un intero positivo qualsiasi. Se è pari, dimezzalo; se è dispari, moltiplica per tre e somma uno. La congettura: comunque parta, la successione finisce per raggiungere 1. Verificata al computer fino a 2⁶⁸, mai dimostrata. Tracciata a ritroso da 1, la catena di tutti gli interi forma un albero simile a un corallo.",
    },
    doublependulum: {
      title: "Il doppio pendolo",
      tagline: "Due pendoli incatenati, caos totale",
      body: "Appendi un secondo pendolo alla massa di un primo. Il sistema ha solo due angoli e due velocità, eppure il suo moto è notoriamente caotico: condizioni iniziali identiche all'occhio divergono violentemente in pochi secondi. Le orbite nello spazio delle fasi tracciano alcune delle curve più belle dei sistemi dinamici.",
    },
    bzr: {
      title: "La reazione di Belousov–Zhabotinsky",
      tagline: "Una reazione chimica che disegna spirali",
      body: "Mescola bromato, acido malonico e un catalizzatore nelle giuste proporzioni e la soluzione non si stabilizza — pulsa, cambia colore e si organizza spontaneamente in onde a spirale rotanti. La chimica è reale; la matematica dietro è un sistema di reazione-diffusione i cui motivi si possono riderivare in codice.",
    },
    turingpattern: {
      title: "Pattern di Turing",
      tagline: "Da dove vengono le macchie del leopardo",
      body: "Nel 1952 Alan Turing mostrò che due « sostanze chimiche » in interazione che diffondono a velocità diverse possono rompere spontaneamente la simmetria e formare pattern stabili — macchie, strisce, reti ramificate. Le stesse equazioni spiegano la pelliccia del leopardo, le strisce della zebra, la pelle del pesce angelo e parti dello sviluppo embrionale. Un piccolo sistema di reazione-diffusione, una portata sorprendente.",
    },
    sierpinski: {
      title: "Il triangolo di Sierpiński",
      tagline: "Un solo frattale, tre strade per arrivarci",
      body: "Lo stesso frattale a buco-nel-buco emerge da tre ricette del tutto diverse: suddivisione ricorsiva di un triangolo, gioco del caos con tre vertici e voci dispari del triangolo di Tartaglia. Il pattern è il punto fisso di tre processi indipendenti — prove convergenti che la struttura era inevitabile.",
    },
    chaosgame: {
      title: "Il gioco del caos",
      tagline: "Tira un dado, disegna un frattale",
      body: "Disponi tre punti a triangolo. Scegli un punto di partenza qualunque. Ripeti: pesca un vertice a caso, vai a metà strada verso di esso e marca il posto. In qualche migliaio di lanci, il rumore si condensa in un perfetto triangolo di Sierpiński — ordine emerso dal puro caso, senza altra istruzione che una bisezione.",
    },
    penrose: {
      title: "Tassellature di Penrose",
      tagline: "Tessere che riempiono il piano e mai si ripetono",
      body: "La tassellatura aquilone-e-dardo di Roger Penrose copre un piano infinito con sole due forme di tessera — ma nessun pezzo finito ricompare esattamente altrove. Le simmetrie sono di ordine cinque, vietate dalla cristallografia classica, e silenziosamente governate dalla sezione aurea. I quasicristalli in natura copiano il trucco.",
    },
    apollonian: {
      title: "Impacchettamento apolloniano",
      tagline: "Cerchi dentro cerchi dentro cerchi",
      body: "Parti da tre cerchi mutuamente tangenti. Se ne possono tracciare altri due tangenti a tutti e tre; riempi ogni interstizio con un altro cerchio così, ricorsivamente, all'infinito. Il teorema di Cartesio lega algebricamente le loro curvature, e in certe configurazioni iniziali ogni cerchio dell'impacchettamento ha curvatura intera. Geometria piena di aritmetica segreta.",
    },
    phi: {
      title: "Sezione aurea & Fibonacci",
      tagline: "1, 1, 2, 3, 5, 8 — e il rapporto che si nasconde ovunque",
      body: "Ogni termine della successione di Fibonacci è la somma dei due precedenti. Il rapporto tra termini consecutivi converge a φ = (1 + √5)/2 ≈ 1,618. Lo stesso φ compare nelle spirali dei semi del girasole, nelle pigne, nelle proporzioni dell'architettura e, meno affidabilmente, nei poster che ne parlano.",
    },
    buffon: {
      title: "Pi greco dall'ago di Buffon",
      tagline: "Lancia aghi su carta a righe, dividi, ottieni π",
      body: "Traccia rette parallele a distanza d. Lascia cadere a caso un ago di lunghezza ℓ ≤ d. La probabilità che l'ago attraversi una riga è esattamente 2ℓ/(πd). Quindi lanciando mille aghi e contando gli attraversamenti puoi stimare π — una costante dei cerchi che spunta da aghi dritti su carta dritta.",
    },
    hilberthotel: {
      title: "L'hotel di Hilbert",
      tagline: "Sempre una stanza in più, anche se è tutto pieno",
      body: "Immagina un hotel con infinite stanze, tutte occupate. Arriva un nuovo ospite; chiedi a tutti di spostarsi di una stanza in su, e la stanza 1 è libera. Arrivano infiniti nuovi ospiti; sposta ciascuno al doppio del proprio numero, liberando tutte le stanze dispari. L'infinito non si comporta come nulla di finito, e l'hotel di Hilbert è l'introduzione più allegra a questo fatto.",
    },
    gabrielshorn: {
      title: "Il corno di Gabriele",
      tagline: "Volume finito, superficie infinita",
      body: "Ruota la curva y = 1/x attorno all'asse x da x = 1 a infinito. Il corno risultante ha volume finito — π unità cubiche — ma superficie infinita. Potresti versarci dentro π unità cubiche di vernice; non potresti mai dipingerne l'esterno.",
    },
    cantor: {
      title: "L'argomento diagonale di Cantor",
      tagline: "Ci sono più reali che numeri per contarli",
      body: "Supponi che i reali tra 0 e 1 possano essere elencati in una successione. Cantor mostra come costruire, da qualsiasi elenco, un reale che ne manca: cambia la prima cifra del primo, la seconda del secondo, e così via lungo la diagonale. Il nuovo numero non può coincidere con nessuno della lista. I reali sono non numerabili — e l'infinito ha taglie.",
    },
    godel: {
      title: "Incompletezza di Gödel",
      tagline: "Esistono enunciati veri che nessun sistema può dimostrare",
      body: "Kurt Gödel, 1931. In ogni sistema formale coerente abbastanza ricco da esprimere l'aritmetica esiste un enunciato vero che il sistema stesso non può dimostrare. Il trucco: costruire una frase che, nel linguaggio del sistema, dice « io non sono dimostrabile ». Se potessi dimostrarla, sarebbe falsa; se non puoi, è esattamente ciò che afferma. La matematica non sarà mai completa come Hilbert sperava.",
    },
    halting: {
      title: "Il problema dell'arresto",
      tagline: "Nessun programma può prevedere ogni altro programma",
      body: "Alan Turing, 1936. Supponi una funzione magica si_ferma(P, x) che decide se il programma P si arresta sull'input x. Costruisci un nuovo programma H' che chiama si_ferma su sé stesso e poi fa l'opposto — fermarsi se si_ferma(H', H') dice ciclo, ciclare se dice fermarsi. Passa H' a sé stesso. Contraddizione — quindi nessun simile decisore universale esiste. Il limite originario di ciò che i computer possono decidere.",
    },
    pvsnp: {
      title: "P vs NP",
      tagline: "La più grande questione aperta dell'informatica",
      body: "P è la classe dei problemi che un computer risolve in fretta. NP è la classe in cui, data una risposta, la si verifica in fretta. Ogni problema NP è segretamente in P? Decenni di ricerca, un premio Clay da un milione di dollari, nessuna dimostrazione in nessun verso. Se fosse P = NP, ogni cifrario crollerebbe e ogni problema di percorso minimo si scioglierebbe. La maggior parte scommette P ≠ NP — ma nessuno lo sa.",
    },
    rsa: {
      title: "RSA & funzioni a senso unico",
      tagline: "Moltiplicare è facile; fattorizzare è impossibile",
      body: "Rivest, Shamir, Adleman, 1977. Scegli due primi enormi p e q. Moltiplica: n = p · q. Chiunque sa moltiplicare, nessuno sa scomporre n senza un calcolo enorme. Da questa asimmetria nascono la crittografia a chiave pubblica, le firme digitali, l'home banking sicuro e la chat cifrata. La matematica sotto ogni handshake TLS.",
    },
    mobius: {
      title: "Nastro di Möbius & bottiglia di Klein",
      tagline: "Superfici con una sola faccia",
      body: "Dai mezzo giro a una striscia di carta e incolla i bordi. Il risultato ha un solo bordo e una sola faccia — una formica che cammina sulla superficie visita « entrambi i lati » senza mai attraversare il bordo. Nello spazio quadridimensionale, lo stesso trucco su un tubo dà la bottiglia di Klein: una superficie chiusa senza dentro né fuori. Giocattoli, arte e fondamenti della topologia.",
    },
    eulerchar: {
      title: "Caratteristica di Eulero",
      tagline: "V − S + F = 2 per ogni poliedro per bene",
      body: "Conta i vertici, sottrai gli spigoli, aggiungi le facce. Per qualsiasi poliedro senza buchi la risposta è sempre 2 — cubo, dodecaedro, pallone da calcio, casa tua. Il numero è un invariante topologico: deforma la forma come vuoi, la risposta non cambia. Aggiungi un buco e scende a 0. La topologia in un'equazione.",
    },
    konigsberg: {
      title: "I ponti di Königsberg",
      tagline: "Sette ponti, una passeggiata impossibile",
      body: "Nel 1736 Leonhard Euler dimostrò che non c'è modo di attraversare i sette ponti di Königsberg esattamente una volta ciascuno. La prova: ridurre la mappa a un grafo; un cammino euleriano esiste solo se al massimo due masse di terra hanno un numero dispari di ponti. Königsberg ne aveva quattro con grado dispari. Con quell'argomento, Euler inventò la teoria dei grafi.",
    },
    fourcolor: {
      title: "Il teorema dei quattro colori",
      tagline: "Ogni mappa piana si colora con al più quattro colori",
      body: "Enunciato nel 1852, dimostrato nel 1976 da Kenneth Appel e Wolfgang Haken. Ogni suddivisione del piano in regioni si può colorare con al massimo quattro colori senza che due regioni vicine condividano il colore. Fu il primo grande teorema verificato dal computer — riduce il problema a 1834 configurazioni inevitabili e le controlla una per una. Per anni si è discusso se la dimostrazione « contasse davvero ».",
    },
    smallworld: {
      title: "Sei gradi & piccoli mondi",
      tagline: "Due persone qualsiasi, a sei strette di mano di distanza",
      body: "L'esperimento di Stanley Milgram del 1967 spediva lettere attraverso gli Stati Uniti tramite contatti personali. La catena media era lunga circa sei anelli. Nel 1998 Duncan Watts e Steven Strogatz mostrarono che basta aggiungere pochi collegamenti casuali a una rete regolare per far crollare la lunghezza media del cammino a circa log(N), mantenendo alto il clustering locale. Reti sociali, cervelli, reti elettriche e Internet vivono tutti in questo regime di piccolo mondo.",
    },
    riemann: {
      title: "L'ipotesi di Riemann",
      tagline: "Ogni zero non banale di ζ giace sulla retta critica",
      body: "La funzione zeta di Riemann ζ(s) = 1 + 1/2ˢ + 1/3ˢ + 1/4ˢ + … si estende a tutto il piano complesso. Gli zeri che non si trovano agli interi pari negativi sembrano stare tutti su un'unica retta verticale: parte reale esattamente 1/2. Bernhard Riemann lo congetturò nel 1859 e nessuno l'ha dimostrato né confutato da allora. Una dimostrazione fisserebbe la distribuzione dei numeri primi; uno dei sette Problemi del Millennio, premio di 1 milione di dollari.",
    },
    backprop: {
      title: "Retropropagazione",
      tagline: "Discesa del gradiente su una regola della catena",
      body: "La retropropagazione è l'algoritmo che permette a una rete neurale di imparare dai propri errori. Manda un input in avanti attraverso gli strati, confronta l'uscita con il bersaglio, poi percorri all'indietro la regola della catena per scoprire, peso per peso, di quanto ciascuno deve cambiare per rendere la risposta più vicina la prossima volta. L'intero boom moderno dell'IA poggia su questa idea: nient'altro che analisi multivariabile più molte GPU. Scoperta più volte in modo indipendente; resa popolare da Rumelhart, Hinton e Williams nel 1986.",
    },
  },
};

const pt: AtlasDict = {
  landing: {
    pretitle: "Um atlas de curiosidades matemáticas",
    title1: "De quase nada",
    title2: "tudo",
    subtitle: "Ideias em que uma única regra se desdobra num universo inteiro.",
    hook: "Um operador. Uma regra. Uma equação. E de repente: lógica, vida, caos. Universos a partir de quase nada — matemática no momento em que deixa de ser trabalho de casa e começa a parecer arte.",
    intro1:
      "Cada sala começa com quase nada — um operador, uma regra, uma equação — e caminha até a imagem ficar densa. Cada sala está totalmente montada; podes girar cada botão, reiniciar cada iteração, fazer zoom em cada imagem até ao último dígito.",
    intro2:
      "Carrega num azulejo para entrar. Dois minutos a ler, dez a brincar. Sem truques. São os pequenos enunciados aos quais os matemáticos voltam sempre, postos à mostra para que os vejas.",
    forWhomLabel: "Para quem é isto",
    forWhom:
      "Para quem já parou porque uma fórmula era bonita. Alunos, programadores, professores, artistas, curiosos — e para quem suspeita que a parte mais bonita da matemática nunca chegou ao livro de texto.",
    motivationLabel: "Porque existe",
    motivation:
      "Porque o mais belo numa demonstração raramente é a demonstração em si — é o instante em que uma regra minúscula produz pela primeira vez algo que ninguém esperava. Os manuais passam ao lado desse instante. Foldscape é a minha tentativa de o colocar nas tuas mãos.",
    browseLabel: "Percorrer o atlas",
    statusInteractive: "Interativo",
    statusStub: "Em desenvolvimento",
    categoryLogic: "Lógica",
    categoryComputation: "Computação",
    categoryChaos: "Caos",
    categoryGeometry: "Geometria",
    categoryAnalysis: "Análise",
    categoryParadox: "Paradoxo",
    enterTopic: "Entrar →",
    inDevelopment:
      "A sala interativa ainda está a ser construída. Abaixo está a ideia mesma, em linguagem simples.",
    authoredByPrefix: "Curado por",
    authoredByName: "Simon Franzen",
    authoredByOrg: "zauberware",
  },
  nav: { atlas: "Atlas" },
  footer: { author: "Curado por Simon Franzen · zauberware" },
  comingSoon: {
    title: "Em breve",
    body: "Uma sala interativa para esta curiosidade está em preparação. O texto seguinte é a ideia em linguagem simples — correta, mas ainda não jogável.",
    back: "← Voltar ao atlas",
  },
  topics: {
    ...EN_PLACEHOLDERS,
    diffusion: {
      title: "Modelos de difusão",
      tagline: "Ruído dissolvido numa imagem, passo a passo",
      body: "Pega numa fotografia e polvilha-lhe um pouco de ruído gaussiano. Repete mil vezes e a imagem é só chuvisco. Aprende agora o inverso: dado ruído puro, prevê a versão um pouco menos ruidosa. Empilha mil passos destes e geras imagens inéditas a partir de puro acaso. É toda a ideia por trás do Stable Diffusion, Midjourney e DALL·E — uma cadeia de Markov treinada para fazer correr a equação do calor ao contrário.",
    },
    nand: {
      title: "O traço de Sheffer",
      tagline: "Uma só porta basta para toda a lógica digital",
      body: "A porta NAND (a ↑ b = ¬(a ∧ b)) é por si só funcionalmente completa: toda expressão booleana — AND, OR, NOT, XOR, tudo — constrói-se só com NANDs. Por isso chips inteiros são realizados fisicamente como um mar de NANDs. O resultado foi estabelecido por Henry Sheffer nos anos 1910.",
    },
    iota: {
      title: "O combinador Iota",
      tagline: "Um símbolo e, com ele, completude de Turing",
      body: "Iota (℩) é um único combinador definido por ℩x = xSK. Com apenas Iota e parênteses recuperas S e K, e a partir de S e K codificas qualquer função computável. Uma linguagem inteira mora num só símbolo.",
    },
    life: {
      title: "O jogo da vida de Conway",
      tagline: "Quatro regras. Naves, fábricas, computadores.",
      body: "Uma célula numa grelha nasce se tiver exatamente três vizinhas vivas, sobrevive com duas ou três, morre caso contrário. Dessas quatro linhas nascem planadores, canhões de planadores, osciladores, replicadores — e uma máquina de Turing em pleno funcionamento. Já se construiu o jogo da vida dentro do jogo da vida.",
    },
    rule110: {
      title: "Regra 110",
      tagline: "Uma regra de oito bits, comprovadamente universal",
      body: "Cada célula olha para si e para as duas vizinhas e atualiza-se pela regra numerada 110 em binário (01101110). O padrão que cresce a partir de um único ponto codifica computações — Cook e Wolfram provaram que esta regra única é Turing-completa. A máquina universal mais simples conhecida, cabe num tweet.",
    },
    logistic: {
      title: "O mapa logístico",
      tagline: "Uma fórmula inofensiva onde a ordem cai no caos",
      body: "Itera xₙ₊₁ = r · xₙ · (1 − xₙ) e aumenta r. O ponto fixo divide-se num ciclo 2, depois 4, depois 8 — uma cascata de duplicações que termina em caos pleno em torno de r ≈ 3,5699. Dentro dessa cascata esconde-se a constante de Feigenbaum 4,6692…, o mesmo número que rege sistemas caóticos sem relação na física.",
    },
    mandelbrot: {
      title: "O conjunto de Mandelbrot",
      tagline: "Eleva ao quadrado e soma. Para sempre.",
      body: "Para cada número complexo c, itera zₙ₊₁ = zₙ² + c começando em 0 e pergunta se a sucessão fica limitada. A mancha negra dos pontos que ficam é o conjunto de Mandelbrot — um dos objetos mais intrincados já desenhados. Faz zoom em qualquer ponto do seu bordo: a estrutura nunca simplifica.",
    },
    lorenz: {
      title: "O atrator de Lorenz",
      tagline: "Três linhas de código, uma borboleta",
      body: "Três equações diferenciais acopladas a modelar uma fatia de atmosfera. Traçada no espaço, a trajetória enrola-se em torno de dois centros numa forma exatamente de borboleta — a assinatura visual da teoria do caos e origem da expressão « efeito borboleta ».",
    },
    fourier: {
      title: "A transformada de Fourier",
      tagline: "Todo sinal é uma soma de ondas senoidais",
      body: "Qualquer função razoável do tempo decompõe-se numa soma (possivelmente infinita) de senos e cossenos puros, cada um com a sua frequência e amplitude. Este único facto explica por que o MP3, o JPEG, os scanners de ressonância, o teu Wi-Fi e quase toda ferramenta moderna de áudio funcionam. Som, imagem, sinal — todos em segredo ondas sobre ondas.",
    },
    euler: {
      title: "A identidade de Euler",
      tagline: "Os cinco números mais importantes, numa linha",
      body: "eⁱᵖⁱ + 1 = 0. O número e do crescimento, π dos círculos, i do imaginário, mais 0 e 1 — todos amarrados por uma única igualdade. A maioria dos matemáticos elege-a a fórmula mais bela que conhece; a prova são duas linhas de análise e um salto de identificação.",
    },
    banach: {
      title: "O paradoxo de Banach–Tarski",
      tagline: "Corta uma bola e obténs duas do mesmo tamanho",
      body: "Usando o axioma da escolha podes decompor uma bola sólida no espaço tridimensional num número finito de peças e remontá-las — sem esticar nem deformar — em duas bolas sólidas idênticas à original. É rigorosamente demonstrado e impossível com qualquer coisa física. As « peças » não são conjuntos mensuráveis; é aí que vive a estranheza.",
    },
    lsystem: {
      title: "Sistemas L",
      tagline: "Reescritas letra a letra que crescem como plantas",
      body: "Um sistema L (de Lindenmayer) parte de uma cadeia de letras e de um punhado de regras de reescrita. A cada passo cada letra é substituída segundo as regras, em simultâneo. Interpreta a cadeia resultante como comandos para uma tartaruga gráfica e obténs fetos fractais, corais, ramos de árvore — botânica tirada de uns poucos caracteres.",
    },
    wang: {
      title: "Azulejos de Wang",
      tagline: "Quadrados com bordos coloridos, em segredo um computador",
      body: "Um azulejo de Wang é um quadrado unitário cujos quatro bordos têm cores. Os azulejos têm de ser colocados de modo que bordos adjacentes coincidam; rodar é proibido. Com o conjunto finito certo podes simular qualquer máquina de Turing — e forçar o padrão a nunca se repetir. Computação e aperiodicidade escondidas num jogo de cores.",
    },
    collatz: {
      title: "A conjetura de Collatz",
      tagline: "Se é par, divide; se é ímpar, triplica e soma um",
      body: "Começa com qualquer inteiro positivo. Se é par, divide por dois; se é ímpar, multiplica por três e soma um. A conjetura: comeces por onde começares, a sucessão acaba por chegar a 1. Verificada por computador até 2⁶⁸, nunca demonstrada. Traçada de trás para a frente a partir de 1, a cadeia de todos os inteiros forma uma árvore parecida com um coral.",
    },
    doublependulum: {
      title: "O pêndulo duplo",
      tagline: "Dois pêndulos em série, caos total",
      body: "Pendura um segundo pêndulo na massa de um primeiro. O sistema tem apenas dois ângulos e duas velocidades, mas o seu movimento é célebre pelo caos: arranques idênticos à vista divergem violentamente em segundos. As órbitas no espaço de fases traçam algumas das curvas mais belas de toda a dinâmica.",
    },
    bzr: {
      title: "A reação de Belousov–Zhabotinsky",
      tagline: "Uma reação química que desenha espirais",
      body: "Mistura bromato, ácido malónico e um catalisador nas proporções certas e a solução não assenta — pulsa, muda de cor e organiza-se espontaneamente em ondas espirais rotativas. A química é real; a matemática por trás é um sistema de reação-difusão cujos padrões se podem refazer em código.",
    },
    turingpattern: {
      title: "Padrões de Turing",
      tagline: "De onde vêm as manchas do leopardo",
      body: "Em 1952 Alan Turing mostrou que duas « substâncias químicas » em interação que difundem a ritmos diferentes podem quebrar espontaneamente a simetria e formar padrões estáveis — manchas, riscas, redes ramificadas. As mesmas equações explicam a pelagem do leopardo, as riscas da zebra, a pele do peixe-anjo e partes do desenvolvimento embrionário. Um pequeno sistema de reação-difusão, um alcance espantoso.",
    },
    sierpinski: {
      title: "O triângulo de Sierpiński",
      tagline: "Um fractal, três caminhos para lá chegar",
      body: "O mesmo fractal de buraco-dentro-de-buraco surge de três receitas inteiramente distintas: subdivisão recursiva de um triângulo, jogo do caos com três vértices e as entradas ímpares do triângulo de Pascal. O padrão é o ponto fixo de três processos independentes — provas convergentes de que a estrutura era inevitável.",
    },
    chaosgame: {
      title: "O jogo do caos",
      tagline: "Lança um dado, desenha um fractal",
      body: "Coloca três pontos em triângulo. Escolhe um ponto inicial qualquer. Repete: escolhe um vértice ao acaso, anda metade do caminho até ele e marca o lugar. Em poucos milhares de jogadas, o ruído condensa-se num triângulo de Sierpiński perfeito — ordem nascida do puro acaso, sem mais instrução que um passo de bissecção.",
    },
    penrose: {
      title: "Pavimentações de Penrose",
      tagline: "Peças que cobrem o plano e nunca se repetem",
      body: "A pavimentação papagaio-e-seta de Roger Penrose cobre um plano infinito com apenas duas formas de peça — mas nenhuma secção finita reaparece exactamente noutro sítio. As simetrias são de ordem cinco, proibidas pela cristalografia clássica, e regidas em silêncio pela razão áurea. Os quasicristais na natureza copiam o truque.",
    },
    apollonian: {
      title: "Empacotamento apoloniano",
      tagline: "Círculos dentro de círculos dentro de círculos",
      body: "Começa com três círculos mutuamente tangentes. Podem traçar-se dois mais, tangentes aos três; preenche cada intervalo com mais um círculo assim, recursivamente, para sempre. O teorema de Descartes liga algebricamente as suas curvaturas, e em certas configurações iniciais todo o círculo do empacotamento tem curvatura inteira. Geometria cheia de aritmética secreta.",
    },
    phi: {
      title: "Razão áurea & Fibonacci",
      tagline: "1, 1, 2, 3, 5, 8 — e a razão que se esconde em todo o lado",
      body: "Cada termo da sucessão de Fibonacci é a soma dos dois anteriores. A razão entre termos consecutivos converge para φ = (1 + √5)/2 ≈ 1,618. O mesmo φ aparece nas espirais das sementes de girassol, nas pinhas, nas proporções da arquitetura e, com menos confiança, nos cartazes a propósito.",
    },
    buffon: {
      title: "Pi pela agulha de Buffon",
      tagline: "Deixa cair agulhas em papel pautado, divide, obténs π",
      body: "Traça retas paralelas a distância d. Deixa cair ao acaso uma agulha de comprimento ℓ ≤ d. A probabilidade de a agulha cruzar uma reta é exactamente 2ℓ/(πd). Logo, deixando cair mil agulhas e contando os cruzamentos, podes estimar π — uma constante dos círculos vinda de agulhas retas sobre papel reto.",
    },
    hilberthotel: {
      title: "O hotel de Hilbert",
      tagline: "Há sempre mais um quarto, mesmo cheio",
      body: "Imagina um hotel com infinitos quartos, todos ocupados. Chega um hóspede novo; pede a todos que avancem um quarto e o quarto 1 fica livre. Chegam infinitos hóspedes novos; manda cada um para o dobro do seu número e todos os quartos ímpares ficam livres. O infinito não se comporta como nada de finito, e o hotel de Hilbert é a introdução mais alegre a este facto.",
    },
    gabrielshorn: {
      title: "A trombeta de Gabriel",
      tagline: "Volume finito, superfície infinita",
      body: "Roda a curva y = 1/x à volta do eixo x para x ≥ 1. A trombeta resultante tem volume finito — π unidades cúbicas — mas área de superfície infinita. Podias deitar-lhe π unidades cúbicas de tinta dentro; nunca poderias pintar o seu exterior.",
    },
    cantor: {
      title: "O argumento diagonal de Cantor",
      tagline: "Há mais reais do que números para contar",
      body: "Supõe que os reais entre 0 e 1 podiam ser listados numa sucessão. Cantor mostrou como construir, a partir de qualquer lista, um real que dela falta: muda o primeiro dígito do primeiro número, o segundo do segundo, e assim por diante na diagonal. O novo número não pode coincidir com nenhum da lista. Os reais são não numeráveis — e o infinito tem tamanhos.",
    },
    godel: {
      title: "A incompletude de Gödel",
      tagline: "Há afirmações verdadeiras que nenhum sistema consegue provar",
      body: "Kurt Gödel, 1931. Em qualquer sistema formal consistente suficientemente rico para exprimir a aritmética existe uma afirmação verdadeira que o próprio sistema não consegue provar. O truque: construir uma frase que, na linguagem do sistema, diz « não sou demonstrável ». Se a pudesses provar, seria falsa; se não consegues, é exactamente o que afirma. A matemática nunca será completa como Hilbert esperou.",
    },
    halting: {
      title: "O problema da paragem",
      tagline: "Nenhum programa consegue prever todos os outros",
      body: "Alan Turing, 1936. Supõe uma função mágica para(P, x) que decide se o programa P pára na entrada x. Constrói um novo programa H' que chama para sobre si próprio e depois faz o oposto — parar se para(H', H') disser ciclar, ciclar se disser parar. Dá H' a si próprio. Contradição — logo nenhum decisor universal desses pode existir. O limite original do que os computadores podem decidir.",
    },
    pvsnp: {
      title: "P vs NP",
      tagline: "A maior questão em aberto da informática",
      body: "P é a classe dos problemas que um computador resolve depressa. NP é a classe em que, dada uma resposta, se pode verificar depressa. Estará todo o problema NP secretamente em P? Décadas de investigação, um prémio Clay de um milhão de dólares, nenhuma prova em qualquer dos sentidos. Se P = NP, cada sistema criptográfico cairia e cada problema de caminho mais curto derreteria. A maioria aposta P ≠ NP — mas ninguém sabe.",
    },
    rsa: {
      title: "RSA & funções de sentido único",
      tagline: "Multiplicar é fácil; fatorizar é impossível",
      body: "Rivest, Shamir, Adleman, 1977. Escolhe dois primos enormes p e q. Multiplica: n = p · q. Qualquer um multiplica, ninguém volta a partir n sem cálculo imenso. Desta assimetria surgem a criptografia de chave pública, as assinaturas digitais, a banca segura e os chats cifrados. A matemática sob cada aperto de mão TLS.",
    },
    mobius: {
      title: "Banda de Möbius & garrafa de Klein",
      tagline: "Superfícies com um só lado",
      body: "Dá meia volta a uma tira de papel e cola as pontas. O resultado tem uma só margem e um só lado — uma formiga a passear pela superfície visita « ambos os lados » sem nunca atravessar a margem. No espaço tetradimensional, o mesmo truque aplicado a um tubo dá a garrafa de Klein: uma superfície fechada sem interior nem exterior. Brinquedos, arte e os alicerces da topologia.",
    },
    eulerchar: {
      title: "Característica de Euler",
      tagline: "V − A + F = 2 para todo o poliedro bem-comportado",
      body: "Conta vértices, subtrai arestas, soma faces. Para qualquer poliedro sem buracos a resposta é sempre 2 — cubo, dodecaedro, bola de futebol, a tua casa. O número é um invariante topológico: estica a forma como quiseres, a resposta não muda. Acrescenta um buraco e cai para 0. Topologia numa equação.",
    },
    konigsberg: {
      title: "As pontes de Königsberg",
      tagline: "Sete pontes, um passeio impossível",
      body: "Em 1736 Leonhard Euler provou que não há maneira de atravessar as sete pontes de Königsberg exactamente uma vez. A prova: reduzir o mapa a um grafo; um caminho euleriano existe apenas se no máximo duas massas de terra tiverem um número ímpar de pontes. Königsberg tinha quatro com grau ímpar. Com esse argumento, Euler inventou a teoria dos grafos.",
    },
    fourcolor: {
      title: "O teorema das quatro cores",
      tagline: "Todo o mapa plano basta com quatro cores",
      body: "Enunciado em 1852, provado em 1976 por Kenneth Appel e Wolfgang Haken. Qualquer divisão do plano em regiões pode ser colorida com no máximo quatro cores sem que duas regiões vizinhas partilhem cor. Foi o primeiro grande teorema verificado por computador — reduz o problema a 1834 configurações inevitáveis e verifica cada uma. Durante anos discutiu-se se a prova « contava mesmo ».",
    },
    smallworld: {
      title: "Seis graus & mundos pequenos",
      tagline: "Duas pessoas quaisquer, a seis apertos de mão de distância",
      body: "A experiência de Stanley Milgram (1967) enviou cartas pelos Estados Unidos por contactos pessoais. A cadeia média tinha cerca de seis elos. Em 1998 Duncan Watts e Steven Strogatz mostraram que basta acrescentar uns poucos atalhos aleatórios a uma rede regular para o comprimento médio dos caminhos colapsar para cerca de log(N), mantendo alto o clustering local. Redes sociais, cérebros, redes eléctricas e a Internet vivem todos neste regime de mundo pequeno.",
    },
    riemann: {
      title: "A hipótese de Riemann",
      tagline: "Todo zero não trivial de ζ está na recta crítica",
      body: "A função zeta de Riemann ζ(s) = 1 + 1/2ˢ + 1/3ˢ + 1/4ˢ + … estende-se a todo o plano complexo. Os zeros que não estão nos inteiros pares negativos parecem estar todos numa única recta vertical: parte real exactamente 1/2. Bernhard Riemann conjecturou-o em 1859 e ninguém o provou ou refutou desde então. Uma demonstração fixaria a distribuição dos primos; um dos sete Problemas do Milénio, prémio de 1 milhão de dólares.",
    },
    backprop: {
      title: "Retropropagação",
      tagline: "Descida do gradiente sobre a regra da cadeia",
      body: "A retropropagação é o algoritmo que permite a uma rede neuronal aprender com os seus erros. Empurra uma entrada para a frente pelas camadas, compara a saída com o alvo e depois percorre a regra da cadeia para trás para descobrir, peso a peso, quanto cada um deve mudar para que a resposta fique mais perto da próxima vez. Todo o boom moderno da IA assenta nesta ideia: apenas cálculo multivariável mais muitas GPUs. Descoberta várias vezes de forma independente; popularizada por Rumelhart, Hinton e Williams em 1986.",
    },
  },
};

const sv: AtlasDict = {
  landing: {
    pretitle: "En atlas över matematiska kuriosa",
    title1: "Från nästan ingenting",
    title2: "allt",
    subtitle: "Idéer där en enda regel viker ut sig till ett helt universum.",
    hook: "En operator. En regel. En ekvation. Och plötsligt: logik, liv, kaos. Universum ur nästan ingenting — matematiken i det ögonblick då den slutar vara läxa och börjar se ut som konst.",
    intro1:
      "Varje rum börjar med nästan ingenting — en operator, en regel, en ekvation — och går tills bilden är tät. Varje rum är helt utbyggt; du får vrida på varje ratt, starta om varje iteration, zooma varje bild till sista siffran.",
    intro2:
      "Klicka på en bricka för att gå in. Två minuters läsning, tio minuters lek. Inga trick. Det är de små utsagor som matematiker återkommer till, framlagda så att du ser dem.",
    forWhomLabel: "Vem detta är för",
    forWhom:
      "För alla som någon gång stannat upp för att en formel var vacker. Elever, studenter, utvecklare, lärare, konstnärer, nyfikna — och alla som anar att den vackraste delen av matematiken aldrig nådde läroboken.",
    motivationLabel: "Varför detta finns",
    motivation:
      "För att det vackraste med ett bevis sällan är beviset självt — det är ögonblicket när en pytteliten regel för första gången frambringar något ingen hade väntat sig. Läroböckerna far förbi det ögonblicket. Foldscape är mitt försök att lägga det i din hand.",
    browseLabel: "Botanisera i atlasen",
    statusInteractive: "Interaktiv",
    statusStub: "Under utveckling",
    categoryLogic: "Logik",
    categoryComputation: "Beräkning",
    categoryChaos: "Kaos",
    categoryGeometry: "Geometri",
    categoryAnalysis: "Analys",
    categoryParadox: "Paradox",
    enterTopic: "Gå in →",
    inDevelopment:
      "Det interaktiva rummet håller på att byggas. Här nedan står själva idén, i enkel form.",
    authoredByPrefix: "Kurerat av",
    authoredByName: "Simon Franzen",
    authoredByOrg: "zauberware",
  },
  nav: { atlas: "Atlas" },
  footer: { author: "Kurerat av Simon Franzen · zauberware" },
  comingSoon: {
    title: "Kommer snart",
    body: "Ett interaktivt rum för denna kuriositet är under arbete. Texten nedan är idén i enkelt språk — korrekt, men ännu inte spelbar.",
    back: "← Tillbaka till atlasen",
  },
  topics: {
    ...EN_PLACEHOLDERS,
    diffusion: {
      title: "Diffusionsmodeller",
      tagline: "Brus upplöst i en bild, steg för steg",
      body: "Ta vilket fotografi som helst och strö i lite gaussiskt brus. Upprepa tusen gånger och bilden är rent brus. Lär dig nu omvändningen: givet rent brus, förutsäg den något mindre brusiga versionen. Stapla tusen sådana steg och du kan generera helt nya bilder ur ren slump. Det är hela idén bakom Stable Diffusion, Midjourney och DALL·E — en Markovkedja tränad att köra värmeekvationen baklänges.",
    },
    nand: {
      title: "Sheffer-strecket",
      tagline: "En enda grind räcker för all digital logik",
      body: "NAND-grinden (a ↑ b = ¬(a ∧ b)) är funktionellt fullständig i sig själv: varje booleskt uttryck — AND, OR, NOT, XOR, alltihop — kan byggas av enbart NAND. Det är därför hela chip fysiskt realiseras som ett hav av NAND-grindar. Resultatet slogs fast av Henry Sheffer på 1910-talet.",
    },
    iota: {
      title: "Iota-kombinatorn",
      tagline: "En symbol, och med den Turing-fullständighet",
      body: "Iota (℩) är en enda kombinator definierad som ℩x = xSK. Med bara Iota och parenteser kan du återskapa S och K, och från S och K koda varje beräkningsbar funktion. Ett helt programmeringsspråk bor i en enda symbol.",
    },
    life: {
      title: "Conways Game of Life",
      tagline: "Fyra regler. Rymdskepp, fabriker, datorer.",
      body: "En cell på ett rutnät föds om den har exakt tre levande grannar, överlever med två eller tre, dör annars. Ur dessa fyra rader växer glidare, glidarkanoner, oscillatorer, replikatorer — och en fullt fungerande Turing-maskin. Man har byggt Game of Life inuti Game of Life.",
    },
    rule110: {
      title: "Regel 110",
      tagline: "En åttabitsregel, bevisat universell",
      body: "Varje cell tittar på sig själv och sina två grannar och uppdateras enligt regeln med binärnumret 110 (01101110). Mönstret som växer ur en enda punkt kodar beräkningar — Cook och Wolfram bevisade att denna enda regel är Turing-fullständig. Den enklaste kända universella maskinen, som ryms i en tweet.",
    },
    logistic: {
      title: "Den logistiska avbildningen",
      tagline: "En oskyldig formel där ordningen tippar över i kaos",
      body: "Itera xₙ₊₁ = r · xₙ · (1 − xₙ) och öka r. Fixpunkten delas i en 2-cykel, sedan 4, sedan 8 — en kaskad av fördubblingar som mynnar i fullt kaos kring r ≈ 3,5699. Inuti kaskaden gömmer sig Feigenbaums konstant 4,6692…, samma tal som styr orelaterade kaotiska system i fysiken.",
    },
    mandelbrot: {
      title: "Mandelbrotmängden",
      tagline: "Kvadrera och addera. För evigt.",
      body: "För varje komplext tal c, itera zₙ₊₁ = zₙ² + c med start i 0 och fråga om följden förblir begränsad. Den svarta klumpen av punkter där så sker är Mandelbrotmängden — ett av de mest invecklade objekt som någonsin ritats. Zooma var som helst längs randen, strukturen blir aldrig enklare.",
    },
    lorenz: {
      title: "Lorenzattraktorn",
      tagline: "Tre rader kod, en fjäril",
      body: "Tre kopplade differentialekvationer som modellerar en bit av atmosfären. Ritad i rummet slingrar sig banan kring två centra i en form som är exakt en fjäril — kaosteorins visuella signatur och ursprunget till uttrycket « fjärilseffekten ».",
    },
    fourier: {
      title: "Fouriertransformen",
      tagline: "Varje signal är en summa av sinusvågor",
      body: "Varje rimlig tidsfunktion kan delas upp i en (möjligen oändlig) summa av rena sinus- och cosinusvågor, var och en med sin frekvens och amplitud. Detta enda faktum förklarar varför MP3, JPEG, magnetröntgen, ditt Wi-Fi och nästan varje modernt ljudverktyg fungerar. Ljud, bild, signal — alla i hemlighet vågor på vågor.",
    },
    euler: {
      title: "Eulers identitet",
      tagline: "De fem viktigaste talen, på en rad",
      body: "eⁱᵖⁱ + 1 = 0. Talet e från tillväxten, π från cirkeln, i från det imaginära, plus 0 och 1 — alla bundna i en enda likhet. De flesta matematiker röstar fram den som den vackraste formeln; beviset är två rader analys och ett identifikationssprång.",
    },
    banach: {
      title: "Banach–Tarskis paradox",
      tagline: "Skär en boll, få två lika stora",
      body: "Med urvalsaxiomet kan du dela en solid boll i tredimensionellt rum i ändligt många bitar och sätta ihop dem — utan att tänja eller deformera — till två solida bollar identiska med originalet. Det är strängt bevisat och omöjligt med något fysiskt. « Bitarna » är inte mätbara mängder; där bor det märkliga.",
    },
    lsystem: {
      title: "L-system",
      tagline: "Bokstavsvisa omskrivningar som växer till växter",
      body: "Ett L-system (Lindenmayer-system) börjar med en sträng av bokstäver och en handfull omskrivningsregler. I varje steg byts varje bokstav samtidigt enligt reglerna. Tolka den färdiga strängen som kommandon till en sköldpaddsritare och du får fraktala ormbunkar, koraller, trädgrenar — botanik ur några få tecken.",
    },
    wang: {
      title: "Wang-plattor",
      tagline: "Kvadrater med färgade kanter, i hemlighet en dator",
      body: "En Wang-platta är en enhetskvadrat vars fyra kanter bär färger. Plattorna måste läggas så att angränsande kanter matchar; rotation är förbjuden. Med rätt ändlig uppsättning kan vilken Turing-maskin som helst simuleras — och mönstret tvingas att aldrig upprepa sig. Beräkning och aperiodicitet, gömda i en färgmatchning.",
    },
    collatz: {
      title: "Collatz förmodan",
      tagline: "Halvera om jämnt, tredubbla plus ett om udda",
      body: "Börja med ett godtyckligt positivt heltal. Är det jämnt, halvera; är det udda, multiplicera med tre och addera ett. Förmodan: oavsett start når följden så småningom 1. Verifierat av dator för varje tal upp till 2⁶⁸, aldrig bevisat. Kartlagd bakåt från 1 bildar kedjan av alla heltal ett korallikt träd.",
    },
    doublependulum: {
      title: "Dubbelpendeln",
      tagline: "Två pendlar i kedja, totalt kaos",
      body: "Häng en andra pendel i loden på en första. Systemet har bara två vinklar och två hastigheter, och ändå är dess rörelse berömt kaotisk: starter som ser identiska ut driver isär våldsamt på några sekunder. Banorna i fasrummet ritar några av de vackraste kurvorna i hela den dynamiska systemvärlden.",
    },
    bzr: {
      title: "Belousov–Zjabotinskij-reaktionen",
      tagline: "En kemisk reaktion som ritar spiraler",
      body: "Blanda bromat, malonsyra och en katalysator i rätt proportioner och lösningen lägger sig inte — den pulserar, byter färg och organiserar sig spontant i roterande spiralvågor. Kemin är riktig; matematiken bakom är ett reaktions-diffusionssystem vars mönster kan återskapas i kod.",
    },
    turingpattern: {
      title: "Turingmönster",
      tagline: "Varifrån leopardens fläckar kommer",
      body: "År 1952 visade Alan Turing att två « kemikalier » som växelverkar och diffunderar olika snabbt spontant kan bryta symmetrin och bilda stabila mönster — fläckar, ränder, förgrenade nätverk. Samma ekvationer förklarar leopardpäls, sebraränder, kejsarfiskhud och delar av fosterutvecklingen. Ett litet reaktions-diffusionssystem, en häpnadsväckande räckvidd.",
    },
    sierpinski: {
      title: "Sierpińskitriangeln",
      tagline: "En fraktal, tre vägar in",
      body: "Samma triangulära hål-i-hål-fraktal dyker upp ur tre helt olika recept: rekursiv triangeluppdelning, kaosspelet med tre hörn och de udda posterna i Pascals triangel. Mönstret är fixpunkten för tre oberoende processer — konvergenta bevis för att strukturen var oundviklig.",
    },
    chaosgame: {
      title: "Kaosspelet",
      tagline: "Slå en tärning, rita en fraktal",
      body: "Sätt ut tre punkter i en triangel. Välj en godtycklig startpunkt. Upprepa: dra ett hörn slumpvis, gå halva vägen dit och markera platsen. Inom några tusen drag förtätar sig bruset till en perfekt Sierpińskitriangel — ordning ur rent slumpmässighet, utan annan instruktion än ett halveringssteg.",
    },
    penrose: {
      title: "Penrose-mosaiker",
      tagline: "Plattor som fyller planet och aldrig upprepar sig",
      body: "Roger Penroses drake-och-pil-mosaik täcker ett oändligt plan med bara två plattformer — men ingen ändlig del återkommer exakt någon annanstans. Symmetrierna är femfaldiga, förbjudna av klassisk kristallografi, och tyst styrda av gyllene snittet. Naturens kvasikristaller härmar tricket.",
    },
    apollonian: {
      title: "Apollonisk cirkelpackning",
      tagline: "Cirklar i cirklar i cirklar",
      body: "Börja med tre cirklar som tangerar varandra. Två till kan ritas tangentiella till alla tre; fyll varje mellanrum med ytterligare en sådan cirkel, rekursivt, för evigt. Descartes sats binder ihop deras krökningar algebraiskt, och i vissa startkonfigurationer har varje cirkel i hela packningen heltalskrökning. Geometri full av hemlig aritmetik.",
    },
    phi: {
      title: "Gyllene snittet & Fibonacci",
      tagline: "1, 1, 2, 3, 5, 8 — och förhållandet som gömmer sig överallt",
      body: "Varje term i Fibonaccis följd är summan av de två föregående. Kvoten av konsekutiva termer konvergerar mot φ = (1 + √5)/2 ≈ 1,618. Samma φ dyker upp i solroskärnornas spiraler, i kottar, i arkitekturens proportioner och, mindre tillförlitligt, i affischer om det.",
    },
    buffon: {
      title: "Pi ur Buffons nål",
      tagline: "Släpp nålar på linjerat papper, dela, få π",
      body: "Dra parallella linjer på avståndet d. Släpp slumpvis en nål av längd ℓ ≤ d. Sannolikheten att nålen korsar en linje är exakt 2ℓ/(πd). Så släpper du tusen nålar och räknar korsningarna kan du uppskatta π — en konstant från cirklar som dyker upp ur raka nålar på rakt papper.",
    },
    hilberthotel: {
      title: "Hilberts hotell",
      tagline: "Alltid ett rum till, även när det är fullt",
      body: "Tänk dig ett hotell med oändligt många rum, alla upptagna. En ny gäst kommer; be alla flytta ett rum uppåt, och rum 1 blir ledigt. Oändligt många nya gäster kommer; flytta var och en till sitt dubblerade rumsnummer och alla udda rum blir lediga. Oändligheten beter sig inte som något ändligt, och Hilberts hotell är den gladaste introduktionen till det.",
    },
    gabrielshorn: {
      title: "Gabriels horn",
      tagline: "Ändlig volym, oändlig yta",
      body: "Rotera kurvan y = 1/x kring x-axeln från x = 1 till oändligheten. Det resulterande hornet har ändlig volym — π kubikenheter — men oändlig yta. Du skulle kunna hälla π kubikenheter färg i det; du skulle aldrig kunna måla utsidan.",
    },
    cantor: {
      title: "Cantors diagonalargument",
      tagline: "Det finns fler reella tal än räknetal",
      body: "Anta att de reella talen mellan 0 och 1 kunde radas upp i en följd. Cantor visade hur man från varje sådan lista konstruerar ett reellt tal som saknas: ändra första siffran i första talet, andra i andra, och så vidare längs diagonalen. Det nya talet kan inte vara något av dem i listan. De reella talen är oräkneliga — och oändligheten finns i storlekar.",
    },
    godel: {
      title: "Gödels ofullständighet",
      tagline: "Det finns sanna påståenden inget system kan bevisa",
      body: "Kurt Gödel, 1931. I varje motsägelsefritt formellt system rikt nog att uttrycka aritmetik finns ett sant påstående som systemet självt inte kan bevisa. Tricket: bygg en mening som på systemets eget språk säger « jag är inte bevisbar ». Kunde du bevisa den vore den falsk; kan du det inte är den precis vad den påstår. Matematiken blir aldrig komplett som Hilbert hoppades.",
    },
    halting: {
      title: "Stopproblemet",
      tagline: "Inget program kan förutsäga alla andra",
      body: "Alan Turing, 1936. Anta en magisk funktion stannar(P, x) som avgör om programmet P stannar på indata x. Bygg ett nytt program H' som anropar stannar på sig självt och sedan gör motsatsen — stanna om stannar(H', H') säger loop, loopa om den säger stanna. Mata H' med sig självt. Motsägelse — alltså finns ingen sådan universell avgörare. Den ursprungliga gränsen för vad datorer kan avgöra.",
    },
    pvsnp: {
      title: "P kontra NP",
      tagline: "Datavetenskapens största öppna fråga",
      body: "P är klassen problem en dator löser snabbt. NP är klassen där, givet ett svar, det går att verifiera snabbt. Är varje NP-problem i hemlighet i P? Decenniers forskning, ett Clay-pris på en miljon dollar, inget bevis åt något håll. Vore P = NP skulle varje kryptosystem falla och varje kortaste-väg-problem smälta. De flesta gissar P ≠ NP — men ingen vet.",
    },
    rsa: {
      title: "RSA & envägsfunktioner",
      tagline: "Att multiplicera är lätt; att faktorisera är omöjligt",
      body: "Rivest, Shamir, Adleman, 1977. Välj två gigantiska primtal p och q. Multiplicera: n = p · q. Vem som helst kan multiplicera, ingen kan dela tillbaka n utan enormt mycket räknande. Ur den asymmetrin kommer publik nyckel-kryptografi, digitala signaturer, säker bankhantering och krypterad chatt. Matematiken under varje TLS-handskakning.",
    },
    mobius: {
      title: "Möbiusband & Kleinflaska",
      tagline: "Ytor med bara en sida",
      body: "Ge en pappersremsa en halv vridning och limma ihop ändarna. Resultatet har en kant och en sida — en myra som går på ytan besöker « båda sidorna » utan att korsa kanten. I fyra dimensioner ger samma trick på ett rör Kleinflaskan: en sluten yta utan in- eller utsida. Leksaker, konst och topologins grund.",
    },
    eulerchar: {
      title: "Eulerkarakteristiken",
      tagline: "H − K + S = 2 för varje snäll polyeder",
      body: "Räkna hörn, dra bort kanter, lägg till sidor. För varje polyeder utan hål är svaret alltid 2 — kub, dodekaeder, fotboll, ditt hus. Talet är en topologisk invariant: töj formen hur du vill, svaret står fast. Lägg till ett hål och det faller till 0. Topologi i en ekvation.",
    },
    konigsberg: {
      title: "Königsbergs broar",
      tagline: "Sju broar, en omöjlig promenad",
      body: "År 1736 bevisade Leonhard Euler att det inte går att korsa alla sju broar i Königsberg exakt en gång var. Beviset: reducera kartan till en graf; en eulerväg finns bara om högst två landmassor har udda antal broar. Königsberg hade fyra med udda grad. Med det argumentet uppfann Euler grafteorin.",
    },
    fourcolor: {
      title: "Fyrfärgssatsen",
      tagline: "Varje plan karta klarar sig med högst fyra färger",
      body: "Formulerad 1852, bevisad 1976 av Kenneth Appel och Wolfgang Haken. Varje uppdelning av planet i regioner kan färgas med högst fyra färger så att inga två grannregioner delar färg. Det var den första stora satsen verifierad med dator — den reducerar problemet till 1834 oundvikliga konfigurationer och kontrollerar var och en. I åratal stred matematiker om huruvida beviset « räknades på riktigt ».",
    },
    smallworld: {
      title: "Sex grader & små världar",
      tagline: "Vilka två personer som helst, sex handslag bort",
      body: "Stanley Milgrams experiment 1967 skickade brev tvärs över USA via personliga kontakter. Den genomsnittliga kedjan var ungefär sex länkar lång. År 1998 visade Duncan Watts och Steven Strogatz att det räcker att lägga in några slumpmässiga genvägar i ett regelbundet nätverk för att medellängden ska kollapsa till ungefär log(N) medan den lokala klustringen förblir hög. Sociala nätverk, hjärnor, elnät och internet lever alla i denna small-world-regim.",
    },
    riemann: {
      title: "Riemannhypotesen",
      tagline: "Varje icke-trivialt nollställe till ζ ligger på den kritiska linjen",
      body: "Riemanns zetafunktion ζ(s) = 1 + 1/2ˢ + 1/3ˢ + 1/4ˢ + … utvidgas till hela det komplexa planet. Nollställena som inte ligger vid de negativa jämna heltalen tycks alla sitta på en enda lodrät linje: realdel precis 1/2. Bernhard Riemann förmodade detta 1859 och ingen har bevisat eller motbevisat det sedan dess. Ett bevis skulle låsa fast primtalens fördelning; ett av de sju millennieproblemen, en miljon dollar i belöning.",
    },
    backprop: {
      title: "Backpropagation",
      tagline: "Gradientnedstigning på en kedjeregel",
      body: "Backpropagation är algoritmen som låter ett neuralt nätverk lära sig av sina misstag. Mata en ingång framåt genom lagren, jämför utgången med målet och gå sedan kedjeregeln baklänges för att, vikt för vikt, ta reda på hur mycket var och en ska ändras för att svaret ska bli närmare nästa gång. Hela den moderna AI-explosionen vilar på denna idé: bara multivariabel kalkyl plus en massa GPU:er. Upptäckt oberoende flera gånger; populariserad av Rumelhart, Hinton och Williams 1986.",
    },
  },
};

const no: AtlasDict = {
  landing: {
    pretitle: "Et atlas over matematiske kuriositeter",
    title1: "Fra nesten ingenting",
    title2: "alt",
    subtitle: "Idéer der én eneste regel folder seg ut til et helt univers.",
    hook: "Én operator. Én regel. Én likning. Og plutselig: logikk, liv, kaos. Univers fra nesten ingenting — matematikken i det øyeblikket den slutter å være lekse og begynner å se ut som kunst.",
    intro1:
      "Hvert rom starter med nesten ingenting — én operator, én regel, én likning — og går til bildet er tett. Hvert rom er ferdig bygd; du får vri på hver knapp, starte hver iterasjon på nytt, zoome hvert bilde til siste siffer.",
    intro2:
      "Klikk på en flis for å gå inn. To minutter lesing, ti minutter lek. Ingen triks. Det er de små utsagnene matematikere alltid vender tilbake til, satt frem så du ser dem.",
    forWhomLabel: "Hvem dette er for",
    forWhom:
      "For alle som noen gang har stoppet opp fordi en formel var vakker. Elever, studenter, utviklere, lærere, kunstnere, nysgjerrige — og for alle som aner at den vakreste delen av matematikken aldri kom inn i læreboka.",
    motivationLabel: "Hvorfor dette finnes",
    motivation:
      "Fordi det vakreste ved et bevis sjelden er beviset selv — det er øyeblikket når en bitteliten regel for første gang frambringer noe ingen hadde forutsett. Lærebøker raser forbi det øyeblikket. Foldscape er mitt forsøk på å legge det i hånden din.",
    browseLabel: "Bla i atlaset",
    statusInteractive: "Interaktiv",
    statusStub: "Under utvikling",
    categoryLogic: "Logikk",
    categoryComputation: "Beregning",
    categoryChaos: "Kaos",
    categoryGeometry: "Geometri",
    categoryAnalysis: "Analyse",
    categoryParadox: "Paradoks",
    enterTopic: "Gå inn →",
    inDevelopment:
      "Det interaktive rommet bygges fortsatt. Under finner du selve idéen, i enkelt språk.",
    authoredByPrefix: "Kuratert av",
    authoredByName: "Simon Franzen",
    authoredByOrg: "zauberware",
  },
  nav: { atlas: "Atlas" },
  footer: { author: "Kuratert av Simon Franzen · zauberware" },
  comingSoon: {
    title: "Kommer snart",
    body: "Et interaktivt rom for denne kuriositeten er under arbeid. Teksten nedenfor er idéen i enkelt språk — korrekt, men ennå ikke spillbar.",
    back: "← Tilbake til atlaset",
  },
  topics: {
    ...EN_PLACEHOLDERS,
    diffusion: {
      title: "Diffusjonsmodeller",
      tagline: "Støy oppløst til et bilde, steg for steg",
      body: "Ta et hvilket som helst fotografi og strø på litt gaussisk støy. Gjenta tusen ganger og bildet er ren snø. Lær nå det motsatte: gitt ren støy, forutsi den litt mindre støyete versjonen. Stable tusen slike steg og du kan generere helt nye bilder fra ren tilfeldighet. Det er hele idéen bak Stable Diffusion, Midjourney og DALL·E — en Markov-kjede trent til å kjøre varmelikningen baklengs.",
    },
    nand: {
      title: "Sheffer-streken",
      tagline: "Én port er nok for all digital logikk",
      body: "NAND-porten (a ↑ b = ¬(a ∧ b)) er funksjonelt fullstendig alene: ethvert boolsk uttrykk — AND, OR, NOT, XOR, alt — kan bygges utelukkende av NAND. Det er derfor hele brikker fysisk realiseres som et hav av NAND-porter. Resultatet ble slått fast av Henry Sheffer på 1910-tallet.",
    },
    iota: {
      title: "Iota-kombinatoren",
      tagline: "Ett symbol, og med det Turing-fullstendighet",
      body: "Iota (℩) er én enkelt kombinator definert ved ℩x = xSK. Med kun Iota og parenteser gjenfinner du S og K, og fra S og K koder du enhver beregnelig funksjon. Et helt programmerings­språk bor i ett symbol.",
    },
    life: {
      title: "Conways Game of Life",
      tagline: "Fire regler. Romskip, fabrikker, datamaskiner.",
      body: "En celle på et rutenett fødes med nøyaktig tre levende naboer, overlever med to eller tre, dør ellers. Av disse fire linjene vokser glidere, glider­kanoner, oscillatorer, replikatorer — og en fullt fungerende Turing-maskin. Man har bygget Game of Life inni Game of Life.",
    },
    rule110: {
      title: "Regel 110",
      tagline: "En åttebitsregel, bevist universell",
      body: "Hver celle ser på seg selv og sine to naboer og oppdateres etter regelen med binærnummeret 110 (01101110). Mønsteret som vokser fra ett enkelt punkt koder beregninger — Cook og Wolfram beviste at denne ene regelen er Turing-fullstendig. Den enkleste kjente universelle maskinen, som får plass i en tweet.",
    },
    logistic: {
      title: "Den logistiske avbildningen",
      tagline: "En harmløs formel der orden kollapser i kaos",
      body: "Iterér xₙ₊₁ = r · xₙ · (1 − xₙ) og øk r. Fastpunktet splittes i en 2-syklus, så 4, så 8 — en kaskade av doblinger som ender i fullt kaos rundt r ≈ 3,5699. I kaskaden gjemmer Feigenbaum-konstanten 4,6692… seg, det samme tallet som styrer urelaterte kaotiske systemer i fysikken.",
    },
    mandelbrot: {
      title: "Mandelbrotmengden",
      tagline: "Kvadrér og legg til. For alltid.",
      body: "For hvert komplekst tall c, iterér zₙ₊₁ = zₙ² + c med start i 0 og spør om følgen forblir begrenset. Den svarte klumpen av punkter der det skjer er Mandelbrotmengden — et av de mest sammenvevde objektene som er tegnet. Zoom hvor som helst på kanten; strukturen blir aldri enklere.",
    },
    lorenz: {
      title: "Lorenz-attraktoren",
      tagline: "Tre linjer kode, én sommerfugl",
      body: "Tre koblede differensiallikninger som modellerer en skive av atmosfæren. Tegnet i rommet snor banen seg rundt to sentre i en form som er nøyaktig en sommerfugl — kaosteoriens visuelle signatur og opphav til « sommerfugleffekten ».",
    },
    fourier: {
      title: "Fouriertransformasjonen",
      tagline: "Hvert signal er en sum av sinusbølger",
      body: "Enhver rimelig tidsfunksjon kan dekomponeres i en (eventuelt uendelig) sum av rene sinus- og cosinusbølger, hver med sin frekvens og amplitude. Dette ene faktumet forklarer hvorfor MP3, JPEG, MR-skannere, Wi-Fi-en din og nær sagt ethvert moderne lydverktøy fungerer. Lyd, bilde, signal — alle i det skjulte bølger på bølger.",
    },
    euler: {
      title: "Eulers identitet",
      tagline: "De fem viktigste tallene, på én linje",
      body: "eⁱᵖⁱ + 1 = 0. Tallet e fra veksten, π fra sirkelen, i fra det imaginære, pluss 0 og 1 — alle bundet i én likhet. De fleste matematikere stemmer den frem som den vakreste formelen de kjenner; beviset er to linjer analyse og et identifiseringssprang.",
    },
    banach: {
      title: "Banach–Tarski-paradokset",
      tagline: "Del en kule, sitt igjen med to like store",
      body: "Med utvalgsaksiomet kan du dekomponere en solid kule i tredimensjonalt rom i et endelig antall biter og sette dem sammen igjen — uten å strekke eller forvrenge — til to solide kuler identiske med originalen. Det er strengt bevist og umulig med noe fysisk. « Bitene » er ikke målbare mengder; der bor det merkelige.",
    },
    lsystem: {
      title: "L-systemer",
      tagline: "Bokstavvise omskrivninger som vokser til planter",
      body: "Et L-system (Lindenmayer-system) starter med en streng av bokstaver og noen få omskrivingsregler. I hvert steg byttes hver bokstav ut samtidig etter reglene. Tolk den ferdige strengen som kommandoer til en skilpaddetegner og du får fraktale bregner, koraller, tregreiner — botanikk hentet ut av noen få tegn.",
    },
    wang: {
      title: "Wang-fliser",
      tagline: "Kvadrater med fargede kanter, i hemmelighet en datamaskin",
      body: "En Wang-flis er et enhetskvadrat hvis fire kanter bærer farger. Flisene må legges slik at tilstøtende kanter stemmer; rotasjon er forbudt. Med riktig endelig sett kan du simulere enhver Turing-maskin — og tvinge flismønsteret til aldri å gjenta seg. Beregning og aperiodisitet, gjemt i en fargematch.",
    },
    collatz: {
      title: "Collatz-formodningen",
      tagline: "Halver hvis partall, tre ganger pluss én hvis oddetall",
      body: "Start med et hvilket som helst positivt heltall. Er det partall, halver det; er det oddetall, gang med tre og legg til én. Formodningen: uansett start når følgen til slutt 1. Verifisert av datamaskin for hvert tall opp til 2⁶⁸, aldri bevist. Tegnet baklengs fra 1 danner kjeden av alle heltall et koralllignende tre.",
    },
    doublependulum: {
      title: "Dobbeltpendelen",
      tagline: "To pendler i kjede, totalt kaos",
      body: "Heng en andre pendel i loddet på en første. Systemet har bare to vinkler og to hastigheter, og likevel er bevegelsen berømt kaotisk: tilsynelatende identiske starter driver fra hverandre på sekunder. Banene i faserommet tegner noen av de vakreste kurvene i hele den dynamiske systemverdenen.",
    },
    bzr: {
      title: "Belousov–Zjabotinskij-reaksjonen",
      tagline: "En kjemisk reaksjon som tegner spiraler",
      body: "Bland bromat, malonsyre og en katalysator i riktige forhold, og løsningen faller ikke til ro — den pulserer, skifter farge og organiserer seg spontant i roterende spiralbølger. Kjemien er virkelig; matematikken bak er et reaksjons-diffusjonssystem hvis mønstre kan gjenskapes i kode.",
    },
    turingpattern: {
      title: "Turing-mønstre",
      tagline: "Der leopardflekkene kommer fra",
      body: "I 1952 viste Alan Turing at to « kjemikalier » i vekselvirkning som diffunderer ulikt raskt spontant kan bryte symmetri og danne stabile mønstre — flekker, striper, forgrenede nettverk. De samme ligningene forklarer leopardpels, sebrastriper, keiserfiskens hud og deler av fosterutviklingen. Et lite reaksjons-diffusjonssystem, en forbløffende rekkevidde.",
    },
    sierpinski: {
      title: "Sierpiński-trekanten",
      tagline: "Én fraktal, tre veier inn",
      body: "Den samme hull-i-hull-trekanten dukker opp fra tre helt ulike oppskrifter: rekursiv oppdeling av en trekant, kaosspillet med tre hjørner og de oddetallige verdiene i Pascals trekant. Mønsteret er fikspunktet for tre uavhengige prosesser — sammenfallende bevis på at strukturen var uunngåelig.",
    },
    chaosgame: {
      title: "Kaosspillet",
      tagline: "Kast en terning, tegn en fraktal",
      body: "Plasser tre punkter i en trekant. Velg et hvilket som helst startpunkt. Gjenta: trekk et hjørne tilfeldig, gå halvveis dit og marker stedet. I løpet av noen tusen trekk fortettes støyen til en perfekt Sierpiński-trekant — orden ut av ren tilfeldighet, uten annen instruks enn et halveringssteg.",
    },
    penrose: {
      title: "Penrose-flislegging",
      tagline: "Fliser som dekker planet og aldri gjentar seg",
      body: "Roger Penroses drage-og-pil-flislegging dekker et uendelig plan med kun to flisformer — men ingen endelig del gjenoppstår eksakt noe annet sted. Symmetriene er femfoldige, forbudt av klassisk krystallografi, og stille styrt av det gylne snitt. Naturens kvasikrystaller hermer trikset.",
    },
    apollonian: {
      title: "Apollonisk sirkelpakking",
      tagline: "Sirkler i sirkler i sirkler",
      body: "Start med tre sirkler som tangerer hverandre. To til kan tegnes tangentielle til alle tre; fyll hvert mellomrom med enda en slik sirkel, rekursivt, i det uendelige. Descartes' sats binder krumningene sammen algebraisk, og i visse startkonfigurasjoner har hver sirkel i hele pakkingen heltallskrumning. Geometri full av hemmelig aritmetikk.",
    },
    phi: {
      title: "Det gylne snitt & Fibonacci",
      tagline: "1, 1, 2, 3, 5, 8 — og forholdet som gjemmer seg overalt",
      body: "Hvert ledd i Fibonacci-følgen er summen av de to foregående. Forholdet mellom etterfølgende ledd konvergerer mot φ = (1 + √5)/2 ≈ 1,618. Den samme φ dukker opp i solsikkefrøenes spiraler, i kongler, i arkitekturens proporsjoner og, mindre pålitelig, i plakater om det.",
    },
    buffon: {
      title: "Pi fra Buffons nål",
      tagline: "Slipp nåler på linjert papir, del, få π",
      body: "Tegn parallelle linjer i avstand d. Slipp tilfeldig en nål av lengde ℓ ≤ d. Sannsynligheten for at nålen krysser en linje er nøyaktig 2ℓ/(πd). Slipper du tusen nåler og teller krysningene, kan du estimere π — en konstant fra sirkler som dukker opp av rette nåler på rett papir.",
    },
    hilberthotel: {
      title: "Hilberts hotell",
      tagline: "Alltid ett rom til, selv når det er fullt",
      body: "Tenk deg et hotell med uendelig mange rom, alle opptatt. En ny gjest kommer; be alle flytte ett rom opp, og rom 1 er ledig. Uendelig mange nye gjester kommer; flytt hver enkelt til dobbelt så høyt romnummer, og alle oddetallsrom blir ledige. Uendeligheten oppfører seg ikke som noe endelig, og Hilberts hotell er den muntreste introduksjonen til det.",
    },
    gabrielshorn: {
      title: "Gabriels horn",
      tagline: "Endelig volum, uendelig overflate",
      body: "Roter kurven y = 1/x rundt x-aksen fra x = 1 til uendelig. Det resulterende hornet har endelig volum — π kubikkenheter — men uendelig overflateareal. Du kunne helle π kubikkenheter maling i det; du kunne aldri male det utenfra.",
    },
    cantor: {
      title: "Cantors diagonalargument",
      tagline: "Det finnes flere reelle tall enn telletall",
      body: "Anta at de reelle tallene mellom 0 og 1 kunne listes opp i en følge. Cantor viste hvordan man fra hvilken som helst slik liste konstruerer et reelt tall som mangler: endre første siffer i det første, andre siffer i det andre, og så videre langs diagonalen. Det nye tallet kan ikke være lik noe i listen. De reelle er ikke tellbare — og uendeligheten kommer i størrelser.",
    },
    godel: {
      title: "Gödels ufullstendighet",
      tagline: "Det finnes sanne utsagn ingen system kan bevise",
      body: "Kurt Gödel, 1931. I ethvert konsistent formelt system rikt nok til å uttrykke aritmetikk finnes et sant utsagn som systemet selv ikke kan bevise. Trikset: bygg en setning som på systemets eget språk sier « jeg er ikke bevisbar ». Kunne du bevise den, ville den være falsk; kan du det ikke, er den nøyaktig det den hevder. Matematikken blir aldri komplett slik Hilbert håpet.",
    },
    halting: {
      title: "Stoppe-problemet",
      tagline: "Ingen program kan forutsi alle andre",
      body: "Alan Turing, 1936. Anta en magisk funksjon stopper(P, x) som avgjør om programmet P stopper på inndata x. Bygg et nytt program H' som kaller stopper på seg selv og deretter gjør det motsatte — stoppe hvis stopper(H', H') sier løkke, løkke hvis den sier stoppe. Mat H' med seg selv. Motsigelse — altså finnes ingen slik universell avgjører. Den opprinnelige grensen for hva datamaskiner kan avgjøre.",
    },
    pvsnp: {
      title: "P mot NP",
      tagline: "Informatikkens største åpne spørsmål",
      body: "P er klassen av problemer en datamaskin løser raskt. NP er klassen der man, gitt et svar, kan verifisere det raskt. Er hvert NP-problem i hemmelighet i P? Tiår med forskning, en Clay-premie på en million dollar, ingen bevis i noen retning. Var P = NP, ville hvert kryptosystem falle og hvert korteste-vei-problem smelte. De fleste tipper P ≠ NP — men ingen vet.",
    },
    rsa: {
      title: "RSA & enveisfunksjoner",
      tagline: "Å multiplisere er lett; å faktorisere er umulig",
      body: "Rivest, Shamir, Adleman, 1977. Velg to enorme primtall p og q. Multipliser: n = p · q. Hvem som helst kan multiplisere, ingen kan dele n tilbake uten enorm regning. Av denne asymmetrien kommer offentlig-nøkkel-kryptografi, digitale signaturer, sikker nettbank og kryptert chat. Matematikken under hvert TLS-håndtrykk.",
    },
    mobius: {
      title: "Möbius-bånd & Klein-flaske",
      tagline: "Flater med bare én side",
      body: "Gi en papirstrimmel en halv vridning og lim sammen endene. Resultatet har én kant og én side — en maur som går på flaten besøker « begge sider » uten noen gang å krysse kanten. I fire dimensjoner gir samme triks på et rør Klein-flasken: en lukket flate uten innside eller utside. Leketøy, kunst og topologiens grunnlag.",
    },
    eulerchar: {
      title: "Euler-karakteristikken",
      tagline: "H − K + F = 2 for hver snill polyeder",
      body: "Tell hjørner, trekk fra kanter, legg til flater. For enhver polyeder uten hull er svaret alltid 2 — terning, dodekaeder, fotball, huset ditt. Tallet er en topologisk invariant: dra formen som du vil, svaret står fast. Legg til ett hull og det faller til 0. Topologi i én ligning.",
    },
    konigsberg: {
      title: "Königsberg-broene",
      tagline: "Sju broer, en umulig spasertur",
      body: "I 1736 beviste Leonhard Euler at det ikke går an å krysse alle de sju broene i Königsberg nøyaktig én gang hver. Beviset: reduser kartet til en graf; en Euler-vei finnes bare hvis høyst to landmasser har et oddetall antall broer. Königsberg hadde fire med oddetallsgrad. Med det argumentet fant Euler opp grafteorien.",
    },
    fourcolor: {
      title: "Firefargesatsen",
      tagline: "Hvert flatt kart greier seg med høyst fire farger",
      body: "Formulert 1852, bevist 1976 av Kenneth Appel og Wolfgang Haken. Enhver inndeling av planet i regioner kan farges med høyst fire farger uten at to naborregioner deler farge. Det var den første store satsen verifisert av datamaskin — den reduserer problemet til 1834 uunngåelige konfigurasjoner og sjekker hver. Matematikere kranglet i årevis om hvorvidt beviset « virkelig telte ».",
    },
    smallworld: {
      title: "Seks grader & små verdener",
      tagline: "Hvilke som helst to mennesker, seks håndtrykk fra hverandre",
      body: "Stanley Milgrams eksperiment fra 1967 sendte brev tvers gjennom USA via personlige kontakter. Den gjennomsnittlige kjeden var om lag seks ledd lang. I 1998 viste Duncan Watts og Steven Strogatz at det holder å legge inn noen tilfeldige snarveier i et regelmessig nettverk for å få den gjennomsnittlige veilengden til å falle til omtrent log(N), samtidig som den lokale klyngingen holder seg høy. Sosiale nettverk, hjerner, strømnett og internett lever alle i dette small-world-regimet.",
    },
    riemann: {
      title: "Riemannhypotesen",
      tagline: "Hvert ikke-trivielt nullpunkt til ζ ligger på den kritiske linjen",
      body: "Riemanns zetafunksjon ζ(s) = 1 + 1/2ˢ + 1/3ˢ + 1/4ˢ + … utvides til hele det komplekse planet. Nullpunktene som ikke ligger ved de negative partallene ser ut til å sitte alle på én eneste loddrett linje: realdel nøyaktig 1/2. Bernhard Riemann formodet dette i 1859 og ingen har bevist eller motbevist det siden. Et bevis ville feste primtallenes fordeling; ett av de syv tusenårsproblemene, en million dollar i belønning.",
    },
    backprop: {
      title: "Backpropagation",
      tagline: "Gradientnedstigning på en kjerneregel",
      body: "Backpropagation er algoritmen som lar et nevralt nettverk lære av feilene sine. Send en inngang fremover gjennom lagene, sammenlign utgangen med målet, og gå deretter kjerneregelen baklengs for, vekt for vekt, å finne ut hvor mye hver enkelt må endres for at svaret skal bli nærmere neste gang. Hele den moderne AI-eksplosjonen hviler på denne ideen: bare multivariabel kalkulus pluss massevis av GPU-er. Oppdaget uavhengig flere ganger; gjort kjent av Rumelhart, Hinton og Williams i 1986.",
    },
  },
};

export const ATLAS: Record<Locale, AtlasDict> = { en, de, es, fr, it, pt, sv, no };
