"use client";

import Link from "next/link";
import { StoryPageShell, StoryCard } from "@/components/StoryPageShell";
import { Reveal } from "@/components/Reveal";
import { useI18n } from "@/lib/i18n/context";
import { PenroseTiling } from "@/components/PenroseTiling";
import { PenroseGoldenRatio } from "@/components/PenroseGoldenRatio";
import type { Locale } from "@/lib/i18n/types";
import type { StoryPage } from "@/lib/i18n/stories";

const ACCENT = "text-signal-amber";

// --------------------------------------------------------------------------
// Per-locale rich story. Hero copy (pretitle/title/tagline/intro/cta) is
// authored inline here so the page can tell the longer Penrose story
// without bloating the shared i18n bundles.
// --------------------------------------------------------------------------

type RichStory = {
  page: StoryPage;
  encounter: {
    pretitle: string;
    title: string;
    cards: Array<{ label: string; title: string; body: string }>;
    tryIt: string;
  };
  sections: Array<{ pretitle: string; title: string; body: string }>;
  tiling: {
    caption: string;
    depthLabel: string;
    tilesLabel: (n: number) => string;
    thickLabel: string;
    thinLabel: string;
    hint: string;
    pretitle: string;
    title: string;
    body: string;
  };
  golden: {
    caption: string;
    levelsLabel: string;
    ratioLabel: string;
    hint: string;
    pretitle: string;
    title: string;
    body: string;
  };
  crystal: { title: string; note: string };
  race: {
    title: string;
    colYear: string;
    colWho: string;
    colTiles: string;
    rows: Array<[string, string, string]>;
  };
  cardBox: { line1: string; line2: string };
  inflationBox: { title: string; note: string };
  timeline: { title: string; entries: Array<{ year: string; text: string }> };
  closingPretitle: string;
  closingTitle: string;
  closingBody: string;
  closingCta: string;
  finalLabel: string;
};

// ---------- EN ----------
const en: RichStory = {
  page: {
    pretitle: "Topic · Geometry",
    title: "Penrose Tilings",
    tagline: "Two shapes that cover the plane and never repeat.",
    intro:
      "A kite and a dart. Two simple tiles, four matching rules, and a plane that fills forever without any finite patch ever recurring. Roger Penrose described the construction in 1974; nature copied it in 1982 with quasicrystals. The pattern hides the golden ratio in plain sight.",
    ctaInteractive: "→ Open the Explorer",
    sections: [],
  },
  encounter: {
    pretitle: "First encounter",
    title: "Two tiles. Cover the plane. Never repeat.",
    cards: [
      {
        label: "01",
        title: "The big idea",
        body: "Take two simple shapes — a kite and a dart, cut from a single rhombus. Lay them down side by side, respecting a few simple matching rules on the edges. They cover the whole infinite plane perfectly, like normal tiles. But here is the twist: no finite chunk of the pattern ever appears twice in the same orientation. Anywhere. Ever. Roger Penrose found this in 1974, and it broke a decades-old question.",
      },
      {
        label: "02",
        title: "A concrete example",
        body: "Count the tiles in any large patch and you find the same number waiting: kites over darts always converges to φ = (1+√5)/2 ≈ 1.618. There is also a rule called inflation: every tiling has a unique parent tiling at the larger scale and a unique child tiling at the smaller — and each step scales lengths by φ exactly. The golden ratio is not decoration; it is the structure.",
      },
      {
        label: "03",
        title: "Why it matters",
        body: "For 20 years mathematicians wondered: could a finite tile set force only aperiodic tilings? Berger answered yes with 20,426 tiles in 1966; Penrose dropped it to two in 1974. Then in 1982 Dan Shechtman fired electrons at an aluminium-manganese alloy and saw five-fold diffraction patterns — impossible under classical crystallography. Penrose tilings were the existing piece of paper-mathematics that proved nature was allowed to do this. Shechtman got the Nobel in 2011.",
      },
    ],
    tryIt: "Below: grow a tiling by inflation, then watch φ emerge from the Fibonacci spiral.",
  },
  sections: [
    {
      pretitle: "Section 01 · The crystallographic restriction",
      title: "Five-fold symmetry is forbidden in classical crystals",
      body: "A classical crystal is a periodic tiling — a wallpaper pattern. A theorem from the 19th century says that any wallpaper repeating in two independent directions can only have 2-, 3-, 4-, or 6-fold rotational symmetry. Five-fold is impossible: pentagons cannot tile the plane without gaps. So if you ever saw a material with sharp diffraction spots arranged with 5-fold symmetry, the rulebook said you were hallucinating. The Penrose tiling sidesteps the theorem by refusing to be periodic in the first place — it can have local five-fold order at every scale precisely because it never closes into a repeating cell.",
    },
    {
      pretitle: "Section 02 · From 20,426 tiles to one",
      title: "Wang → Berger → Penrose → einstein",
      body: "In 1961 Hao Wang asked: is there an algorithm that decides whether a given set of tiles can tile the plane? He noticed his question reduces to whether any aperiodic tile set exists. His student Robert Berger answered in 1966: yes, and he gave one — a Frankenstein set of 20,426 Wang tiles. Other mathematicians whittled the count down through the late 1960s. Then in 1974 Penrose found just two tiles. For 49 years that was the record. In 2023 David Smith, Joseph Myers, Craig Kaplan and Chaim Goodman-Strauss announced the einstein — a single tile (one polygon, no matching rules!) that tiles the plane only aperiodically. They followed it months later with the spectre, which doesn't even need reflections. The 60-year hunt ended with one shape.",
    },
    {
      pretitle: "Section 03 · Kite and dart with matching rules",
      title: "The matching rules force aperiodicity",
      body: "From two golden triangles — a 72-72-36 acute triangle and a 108-36-36 obtuse triangle — Penrose assembles the kite and the dart. (The P3 set of thin and thick rhombs is a separate, dual family — not produced by halving the same rhombus.) With no further restrictions you could tile the plane periodically using just kites and darts. The trick is the colored arcs Conway drew on each tile's edges: one red, one green, both crossing the kite and dart in specific places. The rule is then simply: where two tiles meet, their arcs must continue. With this single constraint every legal tiling becomes aperiodic. The arcs grow into never-closing curves that wander the whole plane.",
    },
    {
      pretitle: "Section 04 · Inflation and deflation",
      title: "Every tiling has a unique parent and unique children",
      body: "Penrose's deepest move was the deflation rule. Take any kite-and-dart tiling and subdivide every tile by a fixed recipe: each half-kite becomes two smaller half-kites and one half-dart, each half-dart becomes one half-kite and one half-dart. The pieces reassemble into a Penrose tiling at 1/φ the scale. Run the recipe backwards (inflation) and neighbouring tiles merge into a unique parent tiling at φ times the scale. The parent is unique: there is only one way to coarsen a Penrose tiling into a Penrose tiling. That is what locks the pattern into aperiodicity, because any periodic tiling would eventually inflate into itself, yet the φ-scaling is irrational and never closes.",
    },
    {
      pretitle: "Section 05 · The golden ratio everywhere",
      title: "Every measurement ratio contains φ",
      body: "Once you start looking, φ = (1+√5)/2 is everywhere in the tiling. The number of kites divided by the number of darts in any large patch converges to φ. The side-length ratios inside the underlying Robinson triangles are 1 : φ. The inflation rule scales every length by exactly φ. The kite covers exactly φ times the area of the dart, and every tile is built from just two edge lengths whose ratio is φ. φ-scaling is also why you can prove the tiling is aperiodic without any geometry at all: a periodic tiling would force kites/darts to be a rational number, and φ is the most irrational number there is — its continued-fraction expansion is [1; 1, 1, 1, …], the slowest convergent in all of mathematics.",
    },
    {
      pretitle: "Section 06 · Quasicrystals — the picture became matter",
      title: "Shechtman, 1982 · Nobel, 2011",
      body: "On April 8, 1982, Dan Shechtman at NIST shot electrons through a rapidly quenched aluminium-manganese alloy and recorded a diffraction pattern with sharp 10-fold (and therefore 5-fold) symmetry. By every textbook rule it should not have existed. He spent two years convincing colleagues he had not made a mistake; Linus Pauling spent the next decade insisting publicly that 'there is no such thing as quasicrystals, only quasi-scientists.' Shechtman published in 1984. The Penrose tiling was the existing piece of mathematics that proved the diffraction pattern was consistent — long-range order without periodicity, five-fold symmetry allowed by aperiodicity. Today quasicrystals are an entire branch of materials science, used in non-stick coatings and even found in a meteorite from Russia. Shechtman received the 2011 Nobel Prize in Chemistry. A drawing on paper preceded a piece of matter by eight years.",
    },
  ],
  tiling: {
    caption: "Interactive · deflate the tiling",
    depthLabel: "Deflation depth",
    tilesLabel: (n: number) => `${n} half-tiles`,
    thickLabel: "thick rhombi",
    thinLabel: "thin rhombi",
    hint: "Each deflation step subdivides every tile into pieces 1/φ times smaller. Thick rhombi outnumber thin ones, so the thick-to-thin count ratio walks toward φ ≈ 1.618 as depth grows. Five-fold symmetry is preserved exactly at every step.",
    pretitle: "Interactive · the deflation rule",
    title: "Start with a sun, deflate by 1/φ, watch a tiling appear",
    body: "This grows the P3 rhombus form, the thin-and-thick sibling of the kite and dart, from the canonical sun seed: a five-fold star of ten half-rhombi around the origin. Each deflation step subdivides every tile by Penrose's rules. Slide the depth up: at level 1 you can still see the seed; by level 6 you are looking at a few thousand half-tiles and the thick/thin ratio is already several digits of φ.",
  },
  golden: {
    caption: "Interactive · the golden ratio",
    levelsLabel: "Fibonacci levels",
    ratioLabel: "Consecutive Fibonacci ratio",
    hint: "Each new square has the side length of the next Fibonacci number, and rotates around the previous one in 90° steps. The quarter-circle arcs join into the golden spiral — the same curve hidden inside every Penrose patch.",
    pretitle: "Interactive · why φ shows up everywhere",
    title: "1, 1, 2, 3, 5, 8, 13 … and the spiral that converges to φ",
    body: "Place a 1×1 square. Next to it, another 1×1. Then a 2×2 along their joined edge. Then a 3×3, then 5×5, then 8×8 — each new square's side length is the sum of the previous two. Inside each square draw a quarter-circle. The arcs join into a logarithmic spiral whose growth factor is φ. Slide the level up to watch the ratio of consecutive Fibonacci numbers crash into φ exponentially fast.",
  },
  crystal: {
    title: "Crystallographic restriction",
    note: "Only 2-, 3-, 4-, and 6-fold rotations are compatible with a 2-D lattice. Five-fold is the simplest forbidden order, and the one Penrose tilings deliver anyway.",
  },
  race: {
    title: "The tile-count race",
    colYear: "year",
    colWho: "who",
    colTiles: "tiles",
    rows: [
      ["1961", "Wang · question posed", "?"],
      ["1966", "Berger · first answer", "20,426"],
      ["1968", "Knuth", "92"],
      ["1971", "Robinson", "6"],
      ["1974", "Penrose · kite + dart", "2"],
      ["2023", "Smith / einstein", "1"],
      ["2023", "Smith / spectre", "1 (no reflections)"],
    ],
  },
  cardBox: { line1: "kites / darts → φ", line2: "each deflation scales by 1/φ" },
  inflationBox: {
    title: "Inflation",
    note: "Inflation grows the tiling by exactly φ each step. Because φ is irrational, no inflated copy ever lines up with itself, and that is the formal reason the tiling cannot be periodic.",
  },
  timeline: {
    title: "Timeline · paper → matter → Nobel",
    entries: [
      { year: "1974", text: "Penrose publishes the kite and dart aperiodic tiling." },
      { year: "1982", text: "Shechtman records 5-fold electron diffraction in Al-Mn." },
      { year: "1984", text: "Shechtman et al. publish; the term quasicrystal is coined." },
      { year: "2009", text: "Natural quasicrystal found in a Russian meteorite (icosahedrite)." },
      { year: "2011", text: "Shechtman receives the Nobel Prize in Chemistry." },
      {
        year: "2023",
        text: "Smith, Goodman-Strauss et al. announce the einstein and the spectre.",
      },
    ],
  },
  closingPretitle: "Take it further",
  closingTitle: "Open the Explorer.",
  closingBody:
    "The Explorer lets you push the deflation deeper, toggle between the full rhombi and the Robinson half-triangles that build them, switch on Conway's matching markers, and rotate the seed. Every claim on this page becomes a knob there.",
  closingCta: "→ Open the Explorer",
  finalLabel: "Inflate a tiling.",
};

// ---------- DE ----------
const de: RichStory = {
  page: {
    pretitle: "Thema · Geometrie",
    title: "Penrose-Parkettierungen",
    tagline: "Zwei Formen, die die Ebene füllen und sich nie wiederholen.",
    intro:
      "Ein Drache und ein Pfeil. Zwei einfache Kacheln, vier Anlegeregeln und eine Ebene, die sich für immer füllt, ohne dass irgendein endlicher Ausschnitt jemals wiederkehrt. Roger Penrose beschrieb die Konstruktion 1974; die Natur kopierte sie 1982 mit Quasikristallen. Mittendrin steckt der goldene Schnitt.",
    ctaInteractive: "→ Explorer öffnen",
    sections: [],
  },
  encounter: {
    pretitle: "Erste Begegnung",
    title: "Zwei Kacheln. Die Ebene füllen. Nie wiederholen.",
    cards: [
      {
        label: "01",
        title: "Die große Idee",
        body: "Nimm zwei einfache Formen — einen Drachen und einen Pfeil, beide aus demselben Rhombus geschnitten. Leg sie nebeneinander und halte dich an ein paar einfache Anlegeregeln an den Kanten. Sie bedecken die ganze unendliche Ebene lückenlos, wie normale Kacheln. Aber: kein endlicher Ausschnitt taucht jemals zweimal in derselben Lage auf. Nirgends. Niemals. Roger Penrose fand das 1974, und es brach eine jahrzehntealte Frage.",
      },
      {
        label: "02",
        title: "Ein konkretes Beispiel",
        body: "Zähl die Kacheln in irgendeinem großen Ausschnitt, und du findest dieselbe Zahl wartend: Drachen geteilt durch Pfeile konvergiert immer gegen φ = (1+√5)/2 ≈ 1,618. Es gibt auch eine Regel namens Inflation: jede Parkettierung hat eine eindeutige Eltern-Parkettierung auf größerer Skala und eindeutige Kinder auf kleinerer — und jeder Schritt skaliert Längen exakt um φ. Der goldene Schnitt ist nicht Dekoration; er ist die Struktur.",
      },
      {
        label: "03",
        title: "Warum es zählt",
        body: "20 Jahre lang fragten sich Mathematiker:innen: kann eine endliche Kachelmenge nur aperiodische Parkettierungen erzwingen? Berger antwortete 1966 mit 20.426 Kacheln, Penrose drückte es 1974 auf zwei. Dann schoss Dan Shechtman 1982 Elektronen auf eine Aluminium-Mangan-Legierung und sah fünfzählige Beugungsmuster — nach klassischer Kristallografie unmöglich. Penrose-Parkettierungen waren die fertige Papier-Mathematik, die zeigte: die Natur darf das. Shechtman bekam 2011 den Nobelpreis.",
      },
    ],
    tryIt:
      "Unten: lass eine Parkettierung per Inflation wachsen, dann sieh φ aus der Fibonacci-Spirale hervortreten.",
  },
  sections: [
    {
      pretitle: "Abschnitt 01 · Die kristallographische Einschränkung",
      title: "Fünfzählige Symmetrie ist in klassischen Kristallen verboten",
      body: "Ein klassischer Kristall ist eine periodische Parkettierung — ein Tapetenmuster. Ein Satz aus dem 19. Jahrhundert besagt, dass eine Tapete, die sich in zwei unabhängigen Richtungen wiederholt, nur 2-, 3-, 4- oder 6-zählige Rotationssymmetrie haben kann. Fünfzählig ist unmöglich: Pentagons können die Ebene nicht lückenlos parkettieren. Wenn man also je ein Material mit scharfen Beugungspeaks in fünfzähliger Anordnung gesehen hätte, hätte das Regelbuch gesagt: du halluzinierst. Die Penrose-Parkettierung umgeht den Satz, indem sie sich gar nicht erst periodisch verhält — sie kann lokale Fünfzähligkeit auf jeder Skala haben, gerade weil sie nie in eine sich wiederholende Zelle schließt.",
    },
    {
      pretitle: "Abschnitt 02 · Von 20.426 Kacheln zu einer",
      title: "Wang → Berger → Penrose → einstein",
      body: "1961 fragte Hao Wang: gibt es einen Algorithmus, der entscheidet, ob eine gegebene Kachelmenge die Ebene parkettieren kann? Er bemerkte, dass seine Frage darauf hinausläuft, ob überhaupt irgendeine aperiodische Kachelmenge existiert. Sein Student Robert Berger antwortete 1966: ja, und er lieferte eine — eine Frankenstein-Menge aus 20.426 Wang-Kacheln. Andere Mathematiker:innen drückten die Zahl bis Ende der 1960er weiter herunter. Dann fand Penrose 1974 nur zwei. 49 Jahre lang war das der Rekord. 2023 verkündeten David Smith, Joseph Myers, Craig Kaplan und Chaim Goodman-Strauss den «einstein» — eine einzige Kachel (ein Polygon, keine Anlegeregeln!), die die Ebene nur aperiodisch parkettiert. Monate später folgte der «spectre», der nicht einmal Spiegelungen braucht. Die 60-jährige Jagd endete mit einer Form.",
    },
    {
      pretitle: "Abschnitt 03 · Drache und Pfeil mit Anlegeregeln",
      title: "Die Anlegeregeln erzwingen die Aperiodizität",
      body: "Aus zwei goldenen Dreiecken — einem 72-72-36-Akut-Dreieck und einem 108-36-36-Obtus-Dreieck — setzt Penrose den Drachen (Kite) und den Pfeil (Dart) zusammen. (Das P3-Set aus dünnen und dicken Rhomben ist eine eigenständige, duale Familie — nicht durch Halbieren desselben Rhombus erzeugt.) Ohne weitere Einschränkungen könntest du die Ebene mit ihnen ganz normal periodisch parkettieren. Der Trick sind die farbigen Bögen, die Conway auf jede Kante zeichnete: einer rot, einer grün, jeder kreuzt Drachen und Pfeil an bestimmten Stellen. Die Regel ist dann schlicht: wo zwei Kacheln aneinander stoßen, müssen die Bögen weiterlaufen. Mit dieser einen Bedingung wird jede legale Parkettierung aperiodisch. Die Bögen wachsen zu nie-schließenden Kurven, die die ganze Ebene durchwandern.",
    },
    {
      pretitle: "Abschnitt 04 · Inflation und Deflation",
      title: "Jede Parkettierung hat eindeutige Eltern und eindeutige Kinder",
      body: "Penroses tiefster Zug war die Deflationsregel. Nimm irgendeine Drache-Pfeil-Parkettierung und unterteile jede Kachel nach einem festen Rezept: jeder Halb-Drache wird zu zwei kleineren Halb-Drachen und einem Halb-Pfeil, jeder Halb-Pfeil zu einem Halb-Drachen und einem Halb-Pfeil. Die Teile fügen sich zu einer Penrose-Parkettierung mit Skala 1/φ zusammen. Lauf das Rezept rückwärts (Inflation), und benachbarte Kacheln verschmelzen zu einer eindeutigen Eltern-Parkettierung mit φ-facher Skala. Die Eltern-Parkettierung ist eindeutig: es gibt nur eine Art, eine Penrose-Parkettierung in eine Penrose-Parkettierung zu vergröbern. Genau das schließt das Muster in die Aperiodizität ein, denn jede periodische Parkettierung würde sich irgendwann in sich selbst inflatieren, doch die φ-Skalierung ist irrational und schließt sich nie.",
    },
    {
      pretitle: "Abschnitt 05 · Der goldene Schnitt überall",
      title: "Jedes Längenverhältnis enthält φ",
      body: "Sobald du anfängst zu schauen, ist φ = (1+√5)/2 überall in der Parkettierung. Die Anzahl Drachen geteilt durch die Anzahl Pfeile in jedem großen Ausschnitt konvergiert gegen φ. Die Seitenverhältnisse in den darunterliegenden Robinson-Dreiecken sind 1 : φ. Die Inflationsregel skaliert jede Länge exakt um φ. Der Drache bedeckt genau φ-mal die Fläche des Pfeils, und jede Kachel besteht aus nur zwei Kantenlängen, deren Verhältnis φ ist. Die φ-Skalierung ist auch der Grund, warum man die Aperiodizität ohne jede Geometrie beweisen kann: eine periodische Parkettierung würde Drachen/Pfeile rational machen, und φ ist die irrationalste Zahl, die es gibt — ihre Kettenbruchentwicklung ist [1; 1, 1, 1, …], die langsamste Konvergenz in der ganzen Mathematik.",
    },
    {
      pretitle: "Abschnitt 06 · Quasikristalle — das Bild wurde Materie",
      title: "Shechtman, 1982 · Nobelpreis, 2011",
      body: "Am 8. April 1982 schoss Dan Shechtman am NIST Elektronen durch eine rasch abgeschreckte Aluminium-Mangan-Legierung und nahm ein Beugungsmuster mit scharfer 10- (und damit 5-) zähliger Symmetrie auf. Nach jedem Lehrbuch hätte es das nicht geben dürfen. Er brauchte zwei Jahre, um Kolleg:innen zu überzeugen, dass er keinen Fehler gemacht hatte; Linus Pauling beharrte das nächste Jahrzehnt öffentlich darauf, dass es «keine Quasikristalle gibt, nur Quasi-Wissenschaftler». Shechtman publizierte 1984. Die Penrose-Parkettierung war die existierende Mathematik, die zeigte, dass das Beugungsmuster konsistent war — Fernordnung ohne Periodizität, Fünfzähligkeit erlaubt durch Aperiodizität. Heute sind Quasikristalle ein ganzer Zweig der Materialwissenschaft, sie stecken in Antihaftbeschichtungen und wurden sogar in einem russischen Meteoriten gefunden. Shechtman erhielt 2011 den Nobelpreis für Chemie. Eine Zeichnung auf Papier ging einem Stück Materie um acht Jahre voraus.",
    },
  ],
  tiling: {
    caption: "Interaktiv · Parkettierung unterteilen",
    depthLabel: "Deflationstiefe",
    tilesLabel: (n: number) => `${n} Halbkacheln`,
    thickLabel: "dicke Rhomben",
    thinLabel: "dünne Rhomben",
    hint: "Jeder Deflationsschritt teilt jede Kachel in 1/φ-mal kleinere Stücke auf. Dicke Rhomben überwiegen die dünnen, also wandert das Verhältnis dick zu dünn mit wachsender Tiefe Richtung φ ≈ 1,618. Die fünfzählige Symmetrie bleibt auf jeder Stufe exakt erhalten.",
    pretitle: "Interaktiv · die Deflationsregel",
    title: "Beginn mit einer Sonne, unterteile um 1/φ, sieh die Parkettierung entstehen",
    body: "Das lässt die P3-Rhombenform wachsen, die dünn-und-dicke Schwester von Drache und Pfeil, aus dem klassischen Sonnen-Keim: ein fünfzähliger Stern aus zehn Halb-Rhomben um den Ursprung. Jeder Deflationsschritt unterteilt jede Kachel nach Penroses Regeln. Schieb die Tiefe hoch: auf Stufe 1 erkennst du noch den Keim, auf Stufe 6 schaust du auf einige Tausend Halbkacheln, und das Dick/Dünn-Verhältnis trifft schon mehrere Stellen von φ.",
  },
  golden: {
    caption: "Interaktiv · der goldene Schnitt",
    levelsLabel: "Fibonacci-Stufen",
    ratioLabel: "Aufeinanderfolgendes Fibonacci-Verhältnis",
    hint: "Jedes neue Quadrat hat die Seitenlänge der nächsten Fibonacci-Zahl und legt sich im 90°-Schritt um das vorige. Die Viertelkreis-Bögen schließen sich zur goldenen Spirale — derselben Kurve, die in jedem Penrose-Ausschnitt steckt.",
    pretitle: "Interaktiv · warum φ überall auftaucht",
    title: "1, 1, 2, 3, 5, 8, 13 … und die Spirale, die gegen φ konvergiert",
    body: "Leg ein 1×1-Quadrat. Daneben ein zweites 1×1. Dann ein 2×2 entlang ihrer gemeinsamen Kante. Dann 3×3, dann 5×5, dann 8×8 — jede neue Seitenlänge ist die Summe der zwei vorigen. In jedes Quadrat zeichnest du einen Viertelkreis. Die Bögen verbinden sich zu einer logarithmischen Spirale mit Wachstumsfaktor φ. Zieh die Stufe hoch und sieh, wie das Verhältnis aufeinanderfolgender Fibonacci-Zahlen exponentiell schnell in φ einrastet.",
  },
  crystal: {
    title: "Kristallographische Einschränkung",
    note: "Nur 2-, 3-, 4- und 6-zählige Drehungen sind mit einem 2-D-Gitter verträglich. Fünfzählig ist die einfachste verbotene Ordnung, und genau die liefern Penrose-Parkettierungen trotzdem.",
  },
  race: {
    title: "Das Rennen um die Kachelzahl",
    colYear: "Jahr",
    colWho: "wer",
    colTiles: "Kacheln",
    rows: [
      ["1961", "Wang · Frage gestellt", "?"],
      ["1966", "Berger · erste Antwort", "20.426"],
      ["1968", "Knuth", "92"],
      ["1971", "Robinson", "6"],
      ["1974", "Penrose · Drache + Pfeil", "2"],
      ["2023", "Smith / einstein", "1"],
      ["2023", "Smith / spectre", "1 (ohne Spiegelungen)"],
    ],
  },
  cardBox: { line1: "Drachen / Pfeile → φ", line2: "jede Deflation skaliert um 1/φ" },
  inflationBox: {
    title: "Inflation",
    note: "Inflation vergrößert die Parkettierung pro Schritt um genau φ. Weil φ irrational ist, deckt sich keine inflatierte Kopie je mit sich selbst, und das ist der formale Grund, warum die Parkettierung nicht periodisch sein kann.",
  },
  timeline: {
    title: "Zeitleiste · Papier → Materie → Nobel",
    entries: [
      {
        year: "1974",
        text: "Penrose veröffentlicht die aperiodische Drache-und-Pfeil-Parkettierung.",
      },
      { year: "1982", text: "Shechtman misst fünfzählige Elektronenbeugung in Al-Mn." },
      { year: "1984", text: "Shechtman u.a. publizieren; der Begriff Quasikristall entsteht." },
      {
        year: "2009",
        text: "Natürlicher Quasikristall in einem russischen Meteoriten gefunden (Ikosaedrit).",
      },
      { year: "2011", text: "Shechtman erhält den Nobelpreis für Chemie." },
      { year: "2023", text: "Smith, Goodman-Strauss u.a. verkünden den einstein und den spectre." },
    ],
  },
  closingPretitle: "Geh weiter",
  closingTitle: "Öffne den Explorer.",
  closingBody:
    "Der Explorer lässt dich die Deflation tiefer treiben, zwischen den vollen Rhomben und den Robinson-Halbdreiecken wechseln, aus denen sie bestehen, Conways Anlegemarken einblenden und den Keim drehen. Jede Behauptung dieser Seite wird dort zu einem Regler.",
  closingCta: "→ Explorer öffnen",
  finalLabel: "Inflatiere eine Parkettierung.",
};

// ---------- ES ----------
const es: RichStory = {
  page: {
    pretitle: "Tema · Geometría",
    title: "Teselados de Penrose",
    tagline: "Dos formas que cubren el plano y nunca se repiten.",
    intro:
      "Una cometa y un dardo. Dos baldosas simples, cuatro reglas de encaje y un plano que se llena para siempre sin que ningún fragmento finito vuelva a aparecer. Roger Penrose lo describió en 1974; la naturaleza lo copió en 1982 con los cuasicristales. La proporción áurea está escondida a la vista.",
    ctaInteractive: "→ Abrir el Explorador",
    sections: [],
  },
  encounter: {
    pretitle: "Primer encuentro",
    title: "Dos baldosas. Cubrir el plano. Nunca repetirse.",
    cards: [
      {
        label: "01",
        title: "La gran idea",
        body: "Toma dos formas simples — una cometa y un dardo, recortadas del mismo rombo. Ponlas una al lado de la otra respetando unas reglas de encaje en los bordes. Cubren todo el plano infinito sin huecos, como baldosas normales. Pero el giro: ningún trozo finito del patrón vuelve a aparecer dos veces en la misma orientación. En ningún sitio. Nunca. Roger Penrose lo encontró en 1974, y rompió una pregunta de décadas.",
      },
      {
        label: "02",
        title: "Un ejemplo concreto",
        body: "Cuenta las baldosas en cualquier región grande y aparece el mismo número esperando: cometas dividido por dardos converge siempre a φ = (1+√5)/2 ≈ 1,618. Existe también la regla de inflación: cada teselado tiene un único teselado padre a mayor escala y un único hijo a menor — cada paso escala las longitudes exactamente por φ. La proporción áurea no es adorno; es la estructura.",
      },
      {
        label: "03",
        title: "Por qué importa",
        body: "Durante 20 años los matemáticos preguntaron: ¿puede un conjunto finito de baldosas forzar solo teselados aperiódicos? Berger respondió que sí con 20 426 baldosas en 1966; Penrose lo bajó a dos en 1974. Luego en 1982 Dan Shechtman disparó electrones contra una aleación aluminio-manganeso y vio patrones de difracción de cinco pliegues — imposibles según la cristalografía clásica. Los teselados de Penrose eran la matemática de papel que demostraba que la naturaleza podía hacerlo. Shechtman recibió el Nobel en 2011.",
      },
    ],
    tryIt:
      "Abajo: haz crecer un teselado por inflación y mira aparecer φ desde la espiral de Fibonacci.",
  },
  sections: [
    {
      pretitle: "Sección 01 · La restricción cristalográfica",
      title: "La simetría de orden cinco está prohibida en cristales clásicos",
      body: "Un cristal clásico es un teselado periódico — un patrón de papel pintado. Un teorema del siglo XIX dice que cualquier papel pintado que se repita en dos direcciones independientes solo puede tener simetría rotacional de orden 2, 3, 4 o 6. La de orden cinco es imposible: los pentágonos no pueden teselar el plano sin huecos. Así que si vieras alguna vez un material con picos de difracción nítidos dispuestos con simetría de orden cinco, el reglamento diría que estás alucinando. El teselado de Penrose esquiva el teorema negándose a ser periódico — puede tener orden cinco local a toda escala precisamente porque nunca se cierra en una celda repetida.",
    },
    {
      pretitle: "Sección 02 · De 20 426 baldosas a una",
      title: "Wang → Berger → Penrose → einstein",
      body: "En 1961 Hao Wang preguntó: ¿hay un algoritmo que decida si un conjunto dado de baldosas tesela el plano? Notó que su pregunta se reduce a si existe algún conjunto aperiódico. Su estudiante Robert Berger respondió en 1966: sí, y dio uno — un conjunto Frankenstein de 20 426 baldosas de Wang. Otros matemáticos redujeron el número a finales de los 60. En 1974 Penrose encontró solo dos. Durante 49 años ese fue el récord. En 2023 David Smith, Joseph Myers, Craig Kaplan y Chaim Goodman-Strauss anunciaron el einstein — una sola baldosa (un polígono, ¡sin reglas de encaje!) que tesela el plano solo de forma aperiódica. Meses después llegó el spectre, que ni siquiera necesita reflexiones. La caza de 60 años terminó con una forma.",
    },
    {
      pretitle: "Sección 03 · Cometa y dardo con reglas de encaje",
      title: "Las reglas de encaje fuerzan la aperiodicidad",
      body: "A partir de dos triángulos áureos — uno agudo de 72-72-36 y uno obtuso de 108-36-36 — Penrose monta la cometa y el dardo. (El conjunto P3 de rombos finos y gruesos es una familia independiente y dual — no se obtiene partiendo el mismo rombo.) Sin más restricciones podrías teselar el plano periódicamente solo con cometas y dardos. El truco son los arcos de colores que Conway dibujó en cada arista: uno rojo, otro verde, ambos cruzando la cometa y el dardo en lugares concretos. La regla es entonces simple: donde dos baldosas se encuentran, sus arcos tienen que continuar. Con esta única restricción todo teselado legal se vuelve aperiódico. Los arcos crecen en curvas que nunca cierran y recorren todo el plano.",
    },
    {
      pretitle: "Sección 04 · Inflación y deflación",
      title: "Cada teselado tiene un único padre y únicos hijos",
      body: "El movimiento más profundo de Penrose fue la regla de deflación. Toma cualquier teselado cometa-dardo y subdivide cada baldosa según una receta fija: cada media-cometa se convierte en dos medias-cometas más pequeñas y una media-dardo, cada media-dardo en una media-cometa y una media-dardo. Las piezas se recomponen en un teselado de Penrose a escala 1/φ. Aplica la receta al revés (inflación) y las baldosas vecinas se funden en un único teselado padre a φ veces la escala. El padre es único: solo hay una forma de engrosar un teselado de Penrose en otro teselado de Penrose. Eso es lo que ata el patrón a la aperiodicidad, porque cualquier teselado periódico acabaría inflándose a sí mismo, pero la escala φ es irracional y nunca cierra.",
    },
    {
      pretitle: "Sección 05 · La proporción áurea por todas partes",
      title: "Cada razón de medidas contiene φ",
      body: "En cuanto empiezas a mirar, φ = (1+√5)/2 está por todas partes en el teselado. El número de cometas dividido por el de dardos en cualquier región grande converge a φ. Las razones de lados en los triángulos de Robinson subyacentes son 1 : φ. La regla de inflación escala cada longitud exactamente por φ. La cometa cubre exactamente φ veces el área del dardo, y cada baldosa se construye con solo dos longitudes de arista cuya razón es φ. La escala por φ es también el motivo por el que se puede probar la aperiodicidad sin geometría: un teselado periódico forzaría cometas/dardos a ser racional, y φ es el número más irracional que existe — su desarrollo en fracción continua es [1; 1, 1, 1, …], la convergencia más lenta de toda la matemática.",
    },
    {
      pretitle: "Sección 06 · Cuasicristales — la imagen se hizo materia",
      title: "Shechtman, 1982 · Nobel, 2011",
      body: "El 8 de abril de 1982, Dan Shechtman en el NIST disparó electrones a través de una aleación aluminio-manganeso enfriada rápidamente y registró un patrón de difracción con simetría nítida de 10 (y por tanto 5) pliegues. Según todo libro de texto no debería existir. Pasó dos años convenciendo a colegas de que no se había equivocado; Linus Pauling pasó la siguiente década insistiendo en público que «no existen los cuasicristales, solo los cuasi-científicos». Shechtman publicó en 1984. El teselado de Penrose era la matemática ya escrita que demostraba que el patrón de difracción era consistente — orden de largo alcance sin periodicidad, simetría de cinco pliegues permitida por la aperiodicidad. Hoy los cuasicristales son una rama entera de la ciencia de materiales, presentes en revestimientos antiadherentes e incluso encontrados en un meteorito ruso. Shechtman recibió el Nobel de Química en 2011. Un dibujo en papel precedió a un trozo de materia por ocho años.",
    },
  ],
  tiling: {
    caption: "Interactivo · subdividir el teselado",
    depthLabel: "Profundidad de deflación",
    tilesLabel: (n: number) => `${n} medias-baldosas`,
    thickLabel: "rombos gruesos",
    thinLabel: "rombos finos",
    hint: "Cada paso de deflación subdivide cada baldosa en piezas 1/φ veces menores. Los rombos gruesos superan a los finos, así que la razón grueso/fino camina hacia φ ≈ 1,618 al crecer la profundidad. La simetría de orden cinco se conserva exactamente en cada nivel.",
    pretitle: "Interactivo · la regla de deflación",
    title: "Empieza con un sol, subdivide por 1/φ, mira aparecer el teselado",
    body: "Esto hace crecer la forma de rombos P3, la hermana fina-y-gruesa de la cometa y el dardo, a partir de la semilla canónica del sol: una estrella de cinco puntas de diez medios-rombos alrededor del origen. Cada paso de deflación subdivide cada baldosa según las reglas de Penrose. Desliza la profundidad arriba: en el nivel 1 todavía ves la semilla; en el 6 miras unos miles de medias-baldosas, y la razón grueso/fino ya acierta varios dígitos de φ.",
  },
  golden: {
    caption: "Interactivo · la proporción áurea",
    levelsLabel: "Niveles de Fibonacci",
    ratioLabel: "Razón Fibonacci consecutiva",
    hint: "Cada nuevo cuadrado tiene el lado del siguiente número de Fibonacci y rota alrededor del anterior en pasos de 90°. Los cuartos de círculo se enlazan en la espiral áurea — la misma curva escondida en cada fragmento de Penrose.",
    pretitle: "Interactivo · por qué φ aparece por todas partes",
    title: "1, 1, 2, 3, 5, 8, 13 … y la espiral que converge a φ",
    body: "Coloca un cuadrado 1×1. Al lado, otro 1×1. Luego un 2×2 a lo largo de su lado compartido. Después 3×3, 5×5, 8×8 — cada nuevo lado es la suma de los dos anteriores. Dentro de cada cuadrado dibuja un cuarto de círculo. Los arcos se unen en una espiral logarítmica con factor de crecimiento φ. Sube el nivel y mira cómo la razón de Fibonacci consecutiva se clava en φ exponencialmente rápido.",
  },
  crystal: {
    title: "Restricción cristalográfica",
    note: "Solo las rotaciones de orden 2, 3, 4 y 6 son compatibles con una red 2-D. El orden cinco es el más simple prohibido, y el que los teselados de Penrose entregan de todos modos.",
  },
  race: {
    title: "La carrera por el número de baldosas",
    colYear: "año",
    colWho: "quién",
    colTiles: "baldosas",
    rows: [
      ["1961", "Wang · pregunta planteada", "?"],
      ["1966", "Berger · primera respuesta", "20 426"],
      ["1968", "Knuth", "92"],
      ["1971", "Robinson", "6"],
      ["1974", "Penrose · cometa + dardo", "2"],
      ["2023", "Smith / einstein", "1"],
      ["2023", "Smith / spectre", "1 (sin reflexiones)"],
    ],
  },
  cardBox: { line1: "cometas / dardos → φ", line2: "cada deflación escala por 1/φ" },
  inflationBox: {
    title: "Inflación",
    note: "La inflación agranda el teselado exactamente por φ en cada paso. Como φ es irracional, ninguna copia inflada coincide jamás consigo misma, y esa es la razón formal de que el teselado no pueda ser periódico.",
  },
  timeline: {
    title: "Cronología · papel → materia → Nobel",
    entries: [
      { year: "1974", text: "Penrose publica el teselado aperiódico de cometa y dardo." },
      {
        year: "1982",
        text: "Shechtman registra difracción electrónica de cinco pliegues en Al-Mn.",
      },
      { year: "1984", text: "Shechtman et al. publican; se acuña el término cuasicristal." },
      { year: "2009", text: "Cuasicristal natural hallado en un meteorito ruso (icosaedrita)." },
      { year: "2011", text: "Shechtman recibe el Nobel de Química." },
      { year: "2023", text: "Smith, Goodman-Strauss et al. anuncian el einstein y el spectre." },
    ],
  },
  closingPretitle: "Ve más lejos",
  closingTitle: "Abre el Explorador.",
  closingBody:
    "El Explorador te deja empujar la deflación más hondo, alternar entre los rombos completos y los medios triángulos de Robinson que los forman, activar las marcas de encaje de Conway y girar la semilla. Cada afirmación de esta página se convierte allí en una perilla.",
  closingCta: "→ Abrir el Explorador",
  finalLabel: "Infla un teselado.",
};

// ---------- FR ----------
const fr: RichStory = {
  page: {
    pretitle: "Sujet · Géométrie",
    title: "Pavages de Penrose",
    tagline: "Deux formes qui couvrent le plan et ne se répètent jamais.",
    intro:
      "Un cerf-volant et une flèche. Deux tuiles simples, quatre règles d'accord et un plan qui se remplit pour toujours sans qu'aucun morceau fini ne réapparaisse. Roger Penrose a décrit la construction en 1974 ; la nature l'a copiée en 1982 avec les quasi-cristaux. Le nombre d'or s'y cache à la vue de tous.",
    ctaInteractive: "→ Ouvrir l'Explorateur",
    sections: [],
  },
  encounter: {
    pretitle: "Première rencontre",
    title: "Deux tuiles. Couvrir le plan. Ne jamais se répéter.",
    cards: [
      {
        label: "01",
        title: "L'idée centrale",
        body: "Prends deux formes simples — un cerf-volant et une flèche, taillés dans un seul losange. Pose-les côte à côte en respectant quelques règles d'accord sur les bords. Elles couvrent tout le plan infini sans trou, comme des tuiles normales. Mais voici le tour : aucun morceau fini du motif ne réapparaît jamais deux fois dans la même orientation. Nulle part. Jamais. Roger Penrose l'a trouvé en 1974, et cela a brisé une question vieille de plusieurs décennies.",
      },
      {
        label: "02",
        title: "Un exemple concret",
        body: "Compte les tuiles dans n'importe quel grand morceau et tu trouves le même nombre qui t'attend : cerfs-volants sur flèches converge toujours vers φ = (1+√5)/2 ≈ 1,618. Il existe aussi une règle d'inflation : tout pavage a un unique pavage parent à plus grande échelle et un unique pavage enfant à plus petite — chaque étape multiplie les longueurs exactement par φ. Le nombre d'or n'est pas une décoration ; c'est la structure.",
      },
      {
        label: "03",
        title: "Pourquoi ça compte",
        body: "Pendant 20 ans les mathématiciens se sont demandé : un ensemble fini de tuiles peut-il forcer uniquement des pavages apériodiques ? Berger a répondu oui avec 20 426 tuiles en 1966 ; Penrose est descendu à deux en 1974. Puis en 1982 Dan Shechtman a tiré des électrons sur un alliage aluminium-manganèse et a vu des figures de diffraction d'ordre cinq — impossibles selon la cristallographie classique. Les pavages de Penrose étaient la mathématique de papier qui prouvait que la nature avait le droit. Shechtman a eu le Nobel en 2011.",
      },
    ],
    tryIt:
      "En dessous : fais pousser un pavage par inflation, puis regarde φ émerger de la spirale de Fibonacci.",
  },
  sections: [
    {
      pretitle: "Section 01 · La restriction cristallographique",
      title: "La symétrie d'ordre cinq est interdite dans les cristaux classiques",
      body: "Un cristal classique est un pavage périodique — un motif de papier peint. Un théorème du XIXᵉ siècle dit que tout papier peint qui se répète dans deux directions indépendantes ne peut avoir que des symétries de rotation d'ordre 2, 3, 4 ou 6. L'ordre cinq est impossible : les pentagones ne peuvent pas paver le plan sans trous. Donc si l'on voyait un matériau avec des pics de diffraction nets en symétrie d'ordre cinq, le règlement disait que l'on hallucinait. Le pavage de Penrose contourne le théorème en refusant d'être périodique d'emblée — il peut avoir un ordre cinq local à toute échelle précisément parce qu'il ne se referme jamais en une cellule répétée.",
    },
    {
      pretitle: "Section 02 · De 20 426 tuiles à une",
      title: "Wang → Berger → Penrose → einstein",
      body: "En 1961, Hao Wang a posé la question : existe-t-il un algorithme qui décide si un ensemble de tuiles donné pave le plan ? Il a remarqué que sa question revient à savoir s'il existe un ensemble apériodique. Son étudiant Robert Berger a répondu en 1966 : oui, et il en a donné un — un Frankenstein de 20 426 tuiles de Wang. D'autres ont fait descendre le compte à la fin des années 60. Puis Penrose en a trouvé deux en 1974. Pendant 49 ans, ce fut le record. En 2023, David Smith, Joseph Myers, Craig Kaplan et Chaim Goodman-Strauss ont annoncé l'einstein — une seule tuile (un polygone, sans règles d'accord !) qui ne pave le plan que de façon apériodique. Quelques mois plus tard est arrivé le spectre, qui n'a même pas besoin de réflexions. La chasse de 60 ans s'est terminée avec une forme.",
    },
    {
      pretitle: "Section 03 · Cerf-volant et flèche avec règles d'accord",
      title: "Les règles d'accord forcent l'apériodicité",
      body: "À partir de deux triangles d'or — un aigu 72-72-36 et un obtus 108-36-36 — Penrose assemble le cerf-volant et la flèche. (Le jeu P3 fait de losanges fins et épais est une famille distincte, duale — elle ne s'obtient pas en coupant en deux le même losange.) Sans restriction supplémentaire, tu pourrais paver le plan périodiquement avec eux. L'astuce : les arcs colorés que Conway a dessinés sur chaque bord — un rouge, un vert, traversant cerf-volant et flèche à des endroits précis. La règle est alors simple : là où deux tuiles se rencontrent, leurs arcs doivent se prolonger. Avec cette seule contrainte, tout pavage légal devient apériodique. Les arcs grandissent en courbes qui ne se referment jamais et parcourent tout le plan.",
    },
    {
      pretitle: "Section 04 · Inflation et déflation",
      title: "Tout pavage a un unique parent et d'uniques enfants",
      body: "Le geste le plus profond de Penrose, c'est la règle de déflation. Prends n'importe quel pavage de cerfs-volants et flèches et subdivise chaque tuile selon une recette fixe : chaque demi-cerf-volant devient deux demi-cerfs-volants plus petits et une demi-flèche, chaque demi-flèche devient un demi-cerf-volant et une demi-flèche. Les morceaux se recomposent en un pavage de Penrose à l'échelle 1/φ. Joue la recette à l'envers (inflation) et les tuiles voisines fusionnent en un unique pavage parent à φ fois l'échelle. Le parent est unique : il n'y a qu'une façon de grossir un pavage de Penrose en un pavage de Penrose. C'est ce qui enferme le motif dans l'apériodicité, car un pavage périodique finirait par s'inflater en lui-même, mais l'échelle φ est irrationnelle et ne se referme jamais.",
    },
    {
      pretitle: "Section 05 · Le nombre d'or partout",
      title: "Chaque rapport de mesures contient φ",
      body: "Dès que tu commences à regarder, φ = (1+√5)/2 est partout dans le pavage. Le nombre de cerfs-volants divisé par celui des flèches dans tout grand morceau converge vers φ. Les rapports de côtés dans les triangles de Robinson sous-jacents valent 1 : φ. La règle d'inflation multiplie chaque longueur exactement par φ. Le cerf-volant couvre exactement φ fois l'aire de la flèche, et chaque tuile est bâtie sur seulement deux longueurs d'arête dont le rapport vaut φ. La mise à l'échelle par φ explique aussi qu'on puisse prouver l'apériodicité sans la moindre géométrie : un pavage périodique forcerait cerfs-volants/flèches à être rationnel, et φ est le nombre le plus irrationnel qui existe — son développement en fraction continue est [1; 1, 1, 1, …], la convergence la plus lente de toute la mathématique.",
    },
    {
      pretitle: "Section 06 · Quasi-cristaux — l'image est devenue matière",
      title: "Shechtman, 1982 · Nobel, 2011",
      body: "Le 8 avril 1982, Dan Shechtman au NIST a tiré des électrons à travers un alliage aluminium-manganèse refroidi brutalement et a enregistré une figure de diffraction avec symétrie nette d'ordre 10 (donc d'ordre 5). D'après tout manuel, elle n'aurait pas dû exister. Il a passé deux ans à convaincre ses collègues qu'il ne s'était pas trompé ; Linus Pauling a passé la décennie suivante à répéter publiquement qu'« il n'y a pas de quasi-cristaux, seulement des quasi-scientifiques ». Shechtman a publié en 1984. Le pavage de Penrose était la mathématique déjà écrite qui prouvait que la figure de diffraction était cohérente — ordre à grande distance sans périodicité, symétrie d'ordre cinq autorisée par l'apériodicité. Aujourd'hui les quasi-cristaux sont une branche entière de la science des matériaux, présents dans des revêtements anti-adhésifs et même trouvés dans une météorite russe. Shechtman a reçu le Nobel de Chimie en 2011. Un dessin sur papier a précédé un morceau de matière de huit ans.",
    },
  ],
  tiling: {
    caption: "Interactif · subdiviser le pavage",
    depthLabel: "Profondeur de déflation",
    tilesLabel: (n: number) => `${n} demi-tuiles`,
    thickLabel: "losanges épais",
    thinLabel: "losanges fins",
    hint: "Chaque étape de déflation subdivise chaque tuile en pièces 1/φ fois plus petites. Les losanges épais l'emportent sur les fins, donc le rapport épais/fin marche vers φ ≈ 1,618 à mesure que la profondeur grandit. La symétrie d'ordre cinq est conservée exactement à chaque étape.",
    pretitle: "Interactif · la règle de déflation",
    title: "Commence par un soleil, subdivise par 1/φ, regarde un pavage apparaître",
    body: "Cela fait pousser la forme en losanges P3, la sœur fine-et-épaisse du cerf-volant et de la flèche, à partir de la graine canonique du soleil : une étoile à cinq branches de dix demi-losanges autour de l'origine. Chaque étape de déflation subdivise chaque tuile selon les règles de Penrose. Pousse la profondeur : au niveau 1 tu vois encore la graine ; au niveau 6 tu regardes quelques milliers de demi-tuiles, et le rapport épais/fin accroche déjà plusieurs chiffres de φ.",
  },
  golden: {
    caption: "Interactif · le nombre d'or",
    levelsLabel: "Niveaux de Fibonacci",
    ratioLabel: "Rapport Fibonacci consécutif",
    hint: "Chaque nouveau carré a pour côté le Fibonacci suivant et tourne autour du précédent par pas de 90°. Les quarts de cercle se relient en spirale d'or — la même courbe cachée dans chaque morceau de Penrose.",
    pretitle: "Interactif · pourquoi φ apparaît partout",
    title: "1, 1, 2, 3, 5, 8, 13 … et la spirale qui converge vers φ",
    body: "Pose un carré 1×1. À côté, un autre 1×1. Puis un 2×2 le long de leur arête commune. Puis 3×3, 5×5, 8×8 — chaque nouveau côté est la somme des deux précédents. Dans chaque carré, trace un quart de cercle. Les arcs se rejoignent en une spirale logarithmique de facteur de croissance φ. Pousse le niveau et regarde le rapport de Fibonacci consécutif claquer dans φ à vitesse exponentielle.",
  },
  crystal: {
    title: "Restriction cristallographique",
    note: "Seules les rotations d'ordre 2, 3, 4 et 6 sont compatibles avec un réseau 2-D. L'ordre cinq est le plus simple des ordres interdits, et celui que les pavages de Penrose livrent malgré tout.",
  },
  race: {
    title: "La course au nombre de tuiles",
    colYear: "année",
    colWho: "qui",
    colTiles: "tuiles",
    rows: [
      ["1961", "Wang · question posée", "?"],
      ["1966", "Berger · première réponse", "20 426"],
      ["1968", "Knuth", "92"],
      ["1971", "Robinson", "6"],
      ["1974", "Penrose · cerf-volant + flèche", "2"],
      ["2023", "Smith / einstein", "1"],
      ["2023", "Smith / spectre", "1 (sans réflexions)"],
    ],
  },
  cardBox: { line1: "cerfs-volants / flèches → φ", line2: "chaque déflation met à l'échelle 1/φ" },
  inflationBox: {
    title: "Inflation",
    note: "L'inflation agrandit le pavage d'exactement φ à chaque étape. Comme φ est irrationnel, aucune copie inflée ne coïncide jamais avec elle-même, et c'est la raison formelle pour laquelle le pavage ne peut pas être périodique.",
  },
  timeline: {
    title: "Chronologie · papier → matière → Nobel",
    entries: [
      { year: "1974", text: "Penrose publie le pavage apériodique cerf-volant et flèche." },
      {
        year: "1982",
        text: "Shechtman enregistre une diffraction électronique d'ordre cinq dans Al-Mn.",
      },
      { year: "1984", text: "Shechtman et al. publient ; le terme quasi-cristal est forgé." },
      {
        year: "2009",
        text: "Quasi-cristal naturel trouvé dans une météorite russe (icosaédrite).",
      },
      { year: "2011", text: "Shechtman reçoit le prix Nobel de chimie." },
      { year: "2023", text: "Smith, Goodman-Strauss et al. annoncent l'einstein et le spectre." },
    ],
  },
  closingPretitle: "Aller plus loin",
  closingTitle: "Ouvre l'Explorateur.",
  closingBody:
    "L'Explorateur te laisse pousser la déflation plus loin, basculer entre les losanges entiers et les demi-triangles de Robinson qui les composent, afficher les marques d'accord de Conway et tourner la graine. Chaque affirmation de cette page devient là-bas une molette.",
  closingCta: "→ Ouvrir l'Explorateur",
  finalLabel: "Inflate un pavage.",
};

// ---------- IT ----------
const it: RichStory = {
  page: {
    pretitle: "Tema · Geometria",
    title: "Tassellature di Penrose",
    tagline: "Due forme che coprono il piano e non si ripetono mai.",
    intro:
      "Un aquilone e un dardo. Due piastrelle semplici, quattro regole di incastro e un piano che si riempie per sempre senza che alcuna porzione finita si ripeta. Roger Penrose lo descrisse nel 1974; la natura lo copiò nel 1982 con i quasicristalli. La sezione aurea è nascosta in piena vista.",
    ctaInteractive: "→ Apri l'Esploratore",
    sections: [],
  },
  encounter: {
    pretitle: "Primo incontro",
    title: "Due piastrelle. Coprire il piano. Non ripetersi mai.",
    cards: [
      {
        label: "01",
        title: "L'idea centrale",
        body: "Prendi due forme semplici — un aquilone e un dardo, tagliati dallo stesso rombo. Posale fianco a fianco rispettando alcune regole di incastro sui bordi. Coprono tutto il piano infinito senza buchi, come piastrelle normali. Ma il colpo di scena: nessuna porzione finita del motivo compare mai due volte nella stessa orientazione. Da nessuna parte. Mai. Roger Penrose lo trovò nel 1974, e ha rotto una domanda vecchia di decenni.",
      },
      {
        label: "02",
        title: "Un esempio concreto",
        body: "Conta le piastrelle in una regione qualsiasi grande e trovi lo stesso numero ad aspettarti: aquiloni diviso dardi converge sempre a φ = (1+√5)/2 ≈ 1,618. Esiste anche una regola detta inflazione: ogni tassellatura ha un'unica tassellatura genitrice a scala maggiore e un'unica figlia a scala minore — ogni passo scala le lunghezze esattamente di φ. La sezione aurea non è decorazione; è la struttura.",
      },
      {
        label: "03",
        title: "Perché conta",
        body: "Per 20 anni i matematici si chiesero: un insieme finito di piastrelle può forzare solo tassellature aperiodiche? Berger rispose di sì con 20 426 piastrelle nel 1966; Penrose scese a due nel 1974. Poi nel 1982 Dan Shechtman sparò elettroni su una lega alluminio-manganese e vide diffrazioni a cinque pieghe — impossibili secondo la cristallografia classica. Le tassellature di Penrose erano la matematica di carta che dimostrava che la natura aveva il permesso. Shechtman prese il Nobel nel 2011.",
      },
    ],
    tryIt:
      "Sotto: fai crescere una tassellatura per inflazione, poi guarda φ emergere dalla spirale di Fibonacci.",
  },
  sections: [
    {
      pretitle: "Sezione 01 · La restrizione cristallografica",
      title: "La simmetria a cinque pieghe è vietata nei cristalli classici",
      body: "Un cristallo classico è una tassellatura periodica — un motivo di carta da parati. Un teorema dell'Ottocento dice che ogni carta da parati che si ripete in due direzioni indipendenti può avere solo simmetria di rotazione di ordine 2, 3, 4 o 6. L'ordine cinque è impossibile: i pentagoni non possono tassellare il piano senza buchi. Quindi se mai si fosse visto un materiale con picchi di diffrazione netti in simmetria a cinque pieghe, il regolamento avrebbe detto che si stava allucinando. La tassellatura di Penrose aggira il teorema rifiutandosi di essere periodica fin dall'inizio — può avere ordine cinque locale a ogni scala proprio perché non si chiude mai in una cella ripetuta.",
    },
    {
      pretitle: "Sezione 02 · Da 20 426 piastrelle a una",
      title: "Wang → Berger → Penrose → einstein",
      body: "Nel 1961 Hao Wang chiese: esiste un algoritmo che decida se un dato insieme di piastrelle tassella il piano? Notò che la sua domanda si riduce all'esistenza di un insieme aperiodico. Il suo studente Robert Berger rispose nel 1966: sì, e ne diede uno — un Frankenstein di 20 426 piastrelle di Wang. Altri matematici ridussero il numero a fine anni '60. Nel 1974 Penrose ne trovò solo due. Per 49 anni quello fu il record. Nel 2023 David Smith, Joseph Myers, Craig Kaplan e Chaim Goodman-Strauss annunciarono l'einstein — una sola piastrella (un poligono, niente regole di incastro!) che tassella il piano solo in modo aperiodico. Pochi mesi dopo arrivò lo spectre, che non ha bisogno nemmeno di riflessioni. La caccia durata 60 anni è finita con una sola forma.",
    },
    {
      pretitle: "Sezione 03 · Aquilone e dardo con regole di incastro",
      title: "Le regole di incastro forzano l'aperiodicità",
      body: "A partire da due triangoli aurei — uno acuto 72-72-36 e uno ottuso 108-36-36 — Penrose costruisce l'aquilone e il dardo. (Il set P3 di rombi sottili e spessi è una famiglia separata e duale — non ottenuta tagliando lo stesso rombo a metà.) Senza ulteriori vincoli potresti tassellare il piano periodicamente. Il trucco sono gli archi colorati che Conway disegnò su ogni bordo: uno rosso, uno verde, ciascuno che attraversa aquilone e dardo in posizioni precise. La regola è poi semplice: dove due piastrelle si incontrano, i loro archi devono proseguire. Con questo unico vincolo ogni tassellatura legale diventa aperiodica. Gli archi crescono in curve mai chiuse che attraversano tutto il piano.",
    },
    {
      pretitle: "Sezione 04 · Inflazione e deflazione",
      title: "Ogni tassellatura ha un unico genitore e unici figli",
      body: "La mossa più profonda di Penrose è stata la regola di deflazione. Prendi una tassellatura aquilone-dardo qualsiasi e suddividi ogni piastrella secondo una ricetta fissa: ogni mezzo-aquilone diventa due mezzi-aquiloni più piccoli e un mezzo-dardo, ogni mezzo-dardo diventa un mezzo-aquilone e un mezzo-dardo. I pezzi si ricompongono in una tassellatura di Penrose a scala 1/φ. Esegui la ricetta al contrario (inflazione) e le piastrelle vicine si fondono in un'unica tassellatura genitrice a φ volte la scala. La genitrice è unica: c'è un solo modo di ingrandire una tassellatura di Penrose in un'altra. È questo che chiude il motivo nell'aperiodicità, perché una tassellatura periodica finirebbe per inflazionarsi in se stessa, ma la scala φ è irrazionale e non chiude mai.",
    },
    {
      pretitle: "Sezione 05 · La sezione aurea ovunque",
      title: "Ogni rapporto di misura contiene φ",
      body: "Appena inizi a guardare, φ = (1+√5)/2 è ovunque nella tassellatura. Il numero di aquiloni diviso quello dei dardi in qualunque grande regione converge a φ. I rapporti tra i lati nei triangoli di Robinson sottostanti sono 1 : φ. La regola di inflazione scala ogni lunghezza esattamente di φ. L'aquilone copre esattamente φ volte l'area del dardo, e ogni piastrella è costruita con solo due lunghezze di lato il cui rapporto è φ. La scala per φ è anche il motivo per cui si può dimostrare l'aperiodicità senza alcuna geometria: una tassellatura periodica costringerebbe aquiloni/dardi a essere razionale, e φ è il numero più irrazionale che esista — il suo sviluppo in frazione continua è [1; 1, 1, 1, …], la convergenza più lenta di tutta la matematica.",
    },
    {
      pretitle: "Sezione 06 · Quasicristalli — l'immagine è diventata materia",
      title: "Shechtman, 1982 · Nobel, 2011",
      body: "L'8 aprile 1982 Dan Shechtman al NIST sparò elettroni attraverso una lega alluminio-manganese raffreddata in fretta e registrò una diffrazione con netta simmetria a 10 (quindi 5) pieghe. Per ogni libro di testo non sarebbe dovuta esistere. Spese due anni a convincere i colleghi di non aver sbagliato; Linus Pauling spese il decennio successivo a ripetere pubblicamente che «non esistono i quasicristalli, solo i quasi-scienziati». Shechtman pubblicò nel 1984. La tassellatura di Penrose era la matematica già scritta che dimostrava che la diffrazione era coerente — ordine a lunga distanza senza periodicità, simmetria a cinque pieghe permessa dall'aperiodicità. Oggi i quasicristalli sono un intero ramo della scienza dei materiali, presenti in rivestimenti antiaderenti e perfino trovati in un meteorite russo. Shechtman ricevette il Nobel per la Chimica nel 2011. Un disegno su carta precedette un pezzo di materia di otto anni.",
    },
  ],
  tiling: {
    caption: "Interattivo · suddividere la tassellatura",
    depthLabel: "Profondità di deflazione",
    tilesLabel: (n: number) => `${n} mezze-piastrelle`,
    thickLabel: "rombi spessi",
    thinLabel: "rombi sottili",
    hint: "Ogni passo di deflazione suddivide ogni piastrella in pezzi 1/φ volte più piccoli. I rombi spessi superano i sottili, quindi il rapporto spesso/sottile cammina verso φ ≈ 1,618 con la profondità. La simmetria a cinque pieghe è conservata esattamente a ogni livello.",
    pretitle: "Interattivo · la regola di deflazione",
    title: "Parti da un sole, suddividi di 1/φ, guarda apparire la tassellatura",
    body: "Questo fa crescere la forma a rombi P3, la sorella sottile-e-spessa dell'aquilone e del dardo, dal seme canonico del sole: una stella a cinque punte di dieci mezzi-rombi attorno all'origine. Ogni passo di deflazione suddivide ogni piastrella secondo Penrose. Spingi su la profondità: al livello 1 vedi ancora il seme; al 6 guardi qualche migliaio di mezze-piastrelle, e il rapporto spesso/sottile azzecca già diverse cifre di φ.",
  },
  golden: {
    caption: "Interattivo · la sezione aurea",
    levelsLabel: "Livelli di Fibonacci",
    ratioLabel: "Rapporto Fibonacci consecutivo",
    hint: "Ogni nuovo quadrato ha il lato del Fibonacci successivo e ruota attorno al precedente di 90°. I quarti di cerchio si collegano nella spirale aurea — la stessa curva nascosta in ogni frammento di Penrose.",
    pretitle: "Interattivo · perché φ spunta ovunque",
    title: "1, 1, 2, 3, 5, 8, 13 … e la spirale che converge a φ",
    body: "Metti un quadrato 1×1. Accanto, un altro 1×1. Poi un 2×2 lungo il loro lato comune. Poi 3×3, 5×5, 8×8 — ogni nuovo lato è la somma dei due precedenti. In ogni quadrato traccia un quarto di cerchio. Gli archi si collegano in una spirale logaritmica con fattore di crescita φ. Sali con il livello e guarda il rapporto Fibonacci consecutivo schiantarsi in φ esponenzialmente.",
  },
  crystal: {
    title: "Restrizione cristallografica",
    note: "Solo le rotazioni di ordine 2, 3, 4 e 6 sono compatibili con un reticolo 2-D. L'ordine cinque è il più semplice tra quelli vietati, e quello che le tassellature di Penrose realizzano comunque.",
  },
  race: {
    title: "La corsa al numero di piastrelle",
    colYear: "anno",
    colWho: "chi",
    colTiles: "piastrelle",
    rows: [
      ["1961", "Wang · domanda posta", "?"],
      ["1966", "Berger · prima risposta", "20 426"],
      ["1968", "Knuth", "92"],
      ["1971", "Robinson", "6"],
      ["1974", "Penrose · aquilone + dardo", "2"],
      ["2023", "Smith / einstein", "1"],
      ["2023", "Smith / spectre", "1 (senza riflessioni)"],
    ],
  },
  cardBox: { line1: "aquiloni / dardi → φ", line2: "ogni deflazione scala di 1/φ" },
  inflationBox: {
    title: "Inflazione",
    note: "L'inflazione ingrandisce la tassellatura esattamente di φ a ogni passo. Poiché φ è irrazionale, nessuna copia inflazionata coincide mai con se stessa, ed è la ragione formale per cui la tassellatura non può essere periodica.",
  },
  timeline: {
    title: "Cronologia · carta → materia → Nobel",
    entries: [
      { year: "1974", text: "Penrose pubblica la tassellatura aperiodica ad aquilone e dardo." },
      {
        year: "1982",
        text: "Shechtman registra una diffrazione elettronica a cinque pieghe in Al-Mn.",
      },
      { year: "1984", text: "Shechtman et al. pubblicano; si conia il termine quasicristallo." },
      {
        year: "2009",
        text: "Quasicristallo naturale trovato in un meteorite russo (icosaedrite).",
      },
      { year: "2011", text: "Shechtman riceve il Nobel per la Chimica." },
      { year: "2023", text: "Smith, Goodman-Strauss et al. annunciano l'einstein e lo spectre." },
    ],
  },
  closingPretitle: "Vai oltre",
  closingTitle: "Apri l'Esploratore.",
  closingBody:
    "L'Esploratore ti lascia spingere la deflazione più in profondità, alternare tra i rombi interi e i mezzi triangoli di Robinson che li compongono, accendere le marche di Conway e ruotare il seme. Ogni affermazione di questa pagina diventa lì una manopola.",
  closingCta: "→ Apri l'Esploratore",
  finalLabel: "Inflaziona una tassellatura.",
};

// ---------- PT ----------
const pt: RichStory = {
  page: {
    pretitle: "Tema · Geometria",
    title: "Tilings de Penrose",
    tagline: "Duas formas que cobrem o plano e nunca se repetem.",
    intro:
      "Um papagaio e um dardo. Duas peças simples, quatro regras de encaixe e um plano que se enche para sempre sem que qualquer pedaço finito volte a aparecer. Roger Penrose descreveu a construção em 1974; a natureza copiou-a em 1982 com os quasicristais. A razão de ouro está escondida à vista.",
    ctaInteractive: "→ Abrir o Explorador",
    sections: [],
  },
  encounter: {
    pretitle: "Primeiro encontro",
    title: "Duas peças. Cobrir o plano. Nunca se repetir.",
    cards: [
      {
        label: "01",
        title: "A ideia central",
        body: "Pega em duas formas simples — um papagaio e um dardo, cortados do mesmo losango. Põe-nos lado a lado respeitando algumas regras de encaixe nas arestas. Cobrem todo o plano infinito sem buracos, como peças normais. Mas a viragem: nenhum pedaço finito do padrão volta a aparecer duas vezes na mesma orientação. Em parte alguma. Nunca. Roger Penrose encontrou-o em 1974, e quebrou uma pergunta de décadas.",
      },
      {
        label: "02",
        title: "Um exemplo concreto",
        body: "Conta as peças em qualquer região grande e encontras o mesmo número à espera: papagaios sobre dardos converge sempre para φ = (1+√5)/2 ≈ 1,618. Existe também uma regra chamada inflação: cada tiling tem um único tiling pai a maior escala e um único filho a menor — cada passo escala os comprimentos exatamente por φ. A razão de ouro não é decoração; é a estrutura.",
      },
      {
        label: "03",
        title: "Porque importa",
        body: "Durante 20 anos os matemáticos perguntaram: pode um conjunto finito de peças forçar apenas tilings aperiódicos? Berger respondeu que sim com 20 426 peças em 1966; Penrose desceu para duas em 1974. Em 1982 Dan Shechtman disparou eletrões contra uma liga alumínio-manganês e viu padrões de difração de cinco dobras — impossíveis segundo a cristalografia clássica. Os tilings de Penrose eram a matemática de papel que mostrava que a natureza podia. Shechtman recebeu o Nobel em 2011.",
      },
    ],
    tryIt:
      "Abaixo: faz crescer um tiling por inflação, depois vê φ emergir da espiral de Fibonacci.",
  },
  sections: [
    {
      pretitle: "Secção 01 · A restrição cristalográfica",
      title: "A simetria de ordem cinco é proibida em cristais clássicos",
      body: "Um cristal clássico é um tiling periódico — um motivo de papel de parede. Um teorema do século XIX diz que qualquer papel de parede que se repita em duas direções independentes só pode ter simetria de rotação de ordem 2, 3, 4 ou 6. A de ordem cinco é impossível: os pentágonos não pavimentam o plano sem buracos. Logo se algum dia se visse um material com picos de difração nítidos em ordem cinco, o regulamento diria que se estava a alucinar. O tiling de Penrose contorna o teorema recusando-se a ser periódico — pode ter ordem cinco local a toda escala precisamente porque nunca se fecha numa célula repetida.",
    },
    {
      pretitle: "Secção 02 · De 20 426 peças a uma",
      title: "Wang → Berger → Penrose → einstein",
      body: "Em 1961 Hao Wang perguntou: existe um algoritmo que decida se um dado conjunto de peças pavimenta o plano? Reparou que a pergunta se reduz à existência de algum conjunto aperiódico. O seu aluno Robert Berger respondeu em 1966: sim, e deu um — um Frankenstein de 20 426 peças de Wang. Outros foram baixando o número até fim dos anos 60. Em 1974 Penrose encontrou apenas duas. Durante 49 anos esse foi o recorde. Em 2023 David Smith, Joseph Myers, Craig Kaplan e Chaim Goodman-Strauss anunciaram o einstein — uma única peça (um polígono, sem regras de encaixe!) que pavimenta o plano só de forma aperiódica. Meses depois veio o spectre, que nem precisa de reflexões. A caça de 60 anos terminou com uma forma.",
    },
    {
      pretitle: "Secção 03 · Papagaio e dardo com regras de encaixe",
      title: "As regras de encaixe forçam a aperiodicidade",
      body: "A partir de dois triângulos áureos — um agudo de 72-72-36 e um obtuso de 108-36-36 — Penrose monta o papagaio e o dardo. (O conjunto P3 de losangos finos e espessos é uma família distinta, dual — não se obtém partindo o mesmo losango.) Sem mais restrições poderias pavimentar o plano periodicamente. O truque são os arcos coloridos que Conway desenhou em cada aresta: um vermelho, outro verde, atravessando papagaio e dardo em pontos certos. A regra é então simples: onde duas peças se encontram, os seus arcos têm de continuar. Com este único constrangimento todo tiling legal se torna aperiódico. Os arcos crescem em curvas que nunca fecham e percorrem todo o plano.",
    },
    {
      pretitle: "Secção 04 · Inflação e deflação",
      title: "Cada tiling tem um único pai e únicos filhos",
      body: "A jogada mais funda de Penrose foi a regra de deflação. Pega num tiling papagaio-dardo qualquer e subdivide cada peça segundo uma receita fixa: cada meio-papagaio torna-se dois meios-papagaios mais pequenos e um meio-dardo, cada meio-dardo torna-se um meio-papagaio e um meio-dardo. As peças recompõem-se num tiling de Penrose à escala 1/φ. Faz a receita ao contrário (inflação) e as peças vizinhas fundem-se num único tiling pai a φ vezes a escala. O pai é único: só há uma forma de engrossar um tiling de Penrose noutro tiling de Penrose. É isto que prende o padrão na aperiodicidade, porque qualquer tiling periódico acabaria por inflar-se a si mesmo, mas a escala φ é irracional e nunca fecha.",
    },
    {
      pretitle: "Secção 05 · A razão de ouro em todo o lado",
      title: "Cada razão de medidas contém φ",
      body: "Assim que começas a olhar, φ = (1+√5)/2 está em todo o lado no tiling. O número de papagaios dividido pelo de dardos em qualquer região grande converge para φ. As razões de lados nos triângulos de Robinson subjacentes são 1 : φ. A regra de inflação escala cada comprimento exatamente por φ. O papagaio cobre exatamente φ vezes a área do dardo, e cada peça é construída com apenas dois comprimentos de aresta cuja razão é φ. A escala por φ é também o motivo de se poder provar a aperiodicidade sem geometria nenhuma: um tiling periódico forçaria papagaios/dardos a serem racional, e φ é o número mais irracional que existe — o seu desenvolvimento em fração contínua é [1; 1, 1, 1, …], a convergência mais lenta de toda a matemática.",
    },
    {
      pretitle: "Secção 06 · Quasicristais — a imagem virou matéria",
      title: "Shechtman, 1982 · Nobel, 2011",
      body: "A 8 de abril de 1982 Dan Shechtman no NIST disparou eletrões através de uma liga alumínio-manganês arrefecida bruscamente e registou uma difração com simetria nítida de 10 (logo 5) dobras. Segundo todo manual não deveria existir. Passou dois anos a convencer colegas de que não se enganara; Linus Pauling passou a década seguinte a repetir publicamente que «não há quasicristais, apenas quasi-cientistas». Shechtman publicou em 1984. O tiling de Penrose era a matemática já escrita que mostrava que a difração era consistente — ordem a longa distância sem periodicidade, simetria de cinco dobras permitida pela aperiodicidade. Hoje os quasicristais são um ramo inteiro da ciência dos materiais, presentes em revestimentos antiaderentes e até encontrados num meteorito russo. Shechtman recebeu o Nobel da Química em 2011. Um desenho em papel antecedeu um pedaço de matéria em oito anos.",
    },
  ],
  tiling: {
    caption: "Interativo · subdividir o tiling",
    depthLabel: "Profundidade de deflação",
    tilesLabel: (n: number) => `${n} meias-peças`,
    thickLabel: "losangos espessos",
    thinLabel: "losangos finos",
    hint: "Cada passo de deflação subdivide cada peça em pedaços 1/φ vezes menores. Os losangos espessos superam os finos, por isso a razão espesso/fino caminha para φ ≈ 1,618 com o aumento da profundidade. A simetria de ordem cinco preserva-se exatamente em cada nível.",
    pretitle: "Interativo · a regra de deflação",
    title: "Começa por um sol, subdivide por 1/φ, vê o tiling aparecer",
    body: "Isto faz crescer a forma de losangos P3, a irmã fina-e-espessa do papagaio e do dardo, a partir da semente canónica do sol: uma estrela de cinco pontas de dez meios-losangos à volta da origem. Cada passo de deflação subdivide cada peça segundo Penrose. Empurra a profundidade: no nível 1 ainda vês a semente; no 6 olhas para uns milhares de meias-peças, e a razão espesso/fino já apanha vários dígitos de φ.",
  },
  golden: {
    caption: "Interativo · a razão de ouro",
    levelsLabel: "Níveis de Fibonacci",
    ratioLabel: "Razão Fibonacci consecutiva",
    hint: "Cada novo quadrado tem o lado do Fibonacci seguinte e roda em torno do anterior em passos de 90°. Os quartos de círculo ligam-se na espiral de ouro — a mesma curva escondida em cada fragmento de Penrose.",
    pretitle: "Interativo · porque é que φ aparece em todo o lado",
    title: "1, 1, 2, 3, 5, 8, 13 … e a espiral que converge para φ",
    body: "Coloca um quadrado 1×1. Ao lado, outro 1×1. Depois um 2×2 ao longo do lado comum. Depois 3×3, 5×5, 8×8 — cada novo lado é a soma dos dois anteriores. Em cada quadrado desenha um quarto de círculo. Os arcos ligam-se numa espiral logarítmica com fator de crescimento φ. Sobe o nível e vê a razão Fibonacci consecutiva colar-se a φ exponencialmente rápido.",
  },
  crystal: {
    title: "Restrição cristalográfica",
    note: "Apenas as rotações de ordem 2, 3, 4 e 6 são compatíveis com uma rede 2-D. A ordem cinco é a mais simples das proibidas, e a que os tilings de Penrose entregam mesmo assim.",
  },
  race: {
    title: "A corrida ao número de peças",
    colYear: "ano",
    colWho: "quem",
    colTiles: "peças",
    rows: [
      ["1961", "Wang · pergunta colocada", "?"],
      ["1966", "Berger · primeira resposta", "20 426"],
      ["1968", "Knuth", "92"],
      ["1971", "Robinson", "6"],
      ["1974", "Penrose · papagaio + dardo", "2"],
      ["2023", "Smith / einstein", "1"],
      ["2023", "Smith / spectre", "1 (sem reflexões)"],
    ],
  },
  cardBox: { line1: "papagaios / dardos → φ", line2: "cada deflação escala por 1/φ" },
  inflationBox: {
    title: "Inflação",
    note: "A inflação aumenta o tiling exatamente por φ a cada passo. Como φ é irracional, nenhuma cópia inflada coincide alguma vez consigo mesma, e é essa a razão formal de o tiling não poder ser periódico.",
  },
  timeline: {
    title: "Cronologia · papel → matéria → Nobel",
    entries: [
      { year: "1974", text: "Penrose publica o tiling aperiódico de papagaio e dardo." },
      { year: "1982", text: "Shechtman regista difração eletrónica de cinco dobras em Al-Mn." },
      { year: "1984", text: "Shechtman et al. publicam; cunha-se o termo quasicristal." },
      { year: "2009", text: "Quasicristal natural encontrado num meteorito russo (icosaedrite)." },
      { year: "2011", text: "Shechtman recebe o Nobel da Química." },
      { year: "2023", text: "Smith, Goodman-Strauss et al. anunciam o einstein e o spectre." },
    ],
  },
  closingPretitle: "Vai mais longe",
  closingTitle: "Abre o Explorador.",
  closingBody:
    "O Explorador deixa-te empurrar a deflação mais fundo, alternar entre os losangos inteiros e os meios triângulos de Robinson que os formam, ligar as marcas de encaixe de Conway e rodar a semente. Cada afirmação desta página torna-se ali um botão.",
  closingCta: "→ Abrir o Explorador",
  finalLabel: "Infla um tiling.",
};

// ---------- SV ----------
const sv: RichStory = {
  page: {
    pretitle: "Ämne · Geometri",
    title: "Penroses parkettering",
    tagline: "Två former som täcker planet och aldrig upprepar sig.",
    intro:
      "En drake och en pil. Två enkla plattor, fyra matchningsregler och ett plan som fylls för evigt utan att någon ändlig bit någonsin återkommer. Roger Penrose beskrev konstruktionen 1974; naturen kopierade den 1982 med kvasikristaller. Gyllene snittet ligger gömt i synfältet.",
    ctaInteractive: "→ Öppna Utforskaren",
    sections: [],
  },
  encounter: {
    pretitle: "Första mötet",
    title: "Två plattor. Täck planet. Upprepa aldrig.",
    cards: [
      {
        label: "01",
        title: "Den stora idén",
        body: "Ta två enkla former — en drake och en pil, klippta ur samma romb. Lägg dem sida vid sida med några matchningsregler längs kanterna. De täcker hela det oändliga planet utan luckor, som vanliga plattor. Men knorren: ingen ändlig del av mönstret återkommer någonsin två gånger i samma orientering. Ingenstans. Aldrig. Roger Penrose hittade detta 1974 och knäckte en decennier gammal fråga.",
      },
      {
        label: "02",
        title: "Ett konkret exempel",
        body: "Räkna plattorna i vilken stor lapp som helst och du hittar samma tal som väntar: drakar genom pilar konvergerar alltid mot φ = (1+√5)/2 ≈ 1,618. Det finns också en regel som heter inflation: varje parkettering har en unik förälder-parkettering i större skala och ett unikt barn i mindre — varje steg skalar längder exakt med φ. Gyllene snittet är inte dekoration; det är strukturen.",
      },
      {
        label: "03",
        title: "Varför det spelar roll",
        body: "I 20 år undrade matematiker: kan en ändlig plattuppsättning tvinga endast aperiodiska parketteringar? Berger svarade ja med 20 426 plattor 1966; Penrose drog ner det till två 1974. Sedan sköt Dan Shechtman 1982 elektroner mot en aluminium-mangan-legering och såg femtaliga diffraktionsmönster — omöjliga enligt klassisk kristallografi. Penroses parketteringar var den färdiga pappersmatematiken som visade att naturen fick göra detta. Shechtman fick Nobelpriset 2011.",
      },
    ],
    tryIt:
      "Nedan: låt en parkettering växa genom inflation, se sedan φ träda fram ur Fibonacci-spiralen.",
  },
  sections: [
    {
      pretitle: "Avsnitt 01 · Den kristallografiska restriktionen",
      title: "Femtalig symmetri är förbjuden i klassiska kristaller",
      body: "En klassisk kristall är en periodisk parkettering — ett tapetmönster. En 1800-talssats säger att vilken tapet som upprepas i två oberoende riktningar bara kan ha rotationssymmetri av ordning 2, 3, 4 eller 6. Femtalig är omöjlig: femhörningar kan inte tessellera planet utan luckor. Så om man någonsin sett ett material med skarpa diffraktionstoppar i femtalig symmetri skulle regelboken sagt att man hallucinerade. Penrose-parketteringen kringgår satsen genom att vägra vara periodisk från början — den kan ha lokal femtalig ordning i varje skala just för att den aldrig sluts till en upprepad cell.",
    },
    {
      pretitle: "Avsnitt 02 · Från 20 426 plattor till en",
      title: "Wang → Berger → Penrose → einstein",
      body: "År 1961 frågade Hao Wang: finns det en algoritm som avgör om en given plattuppsättning tessellerar planet? Han märkte att frågan reduceras till om någon aperiodisk uppsättning finns. Hans student Robert Berger svarade 1966: ja, och gav en — en Frankenstein-uppsättning av 20 426 Wang-plattor. Andra matematiker drog ner antalet under sena 60-talet. 1974 hittade Penrose bara två. I 49 år var det rekordet. 2023 tillkännagav David Smith, Joseph Myers, Craig Kaplan och Chaim Goodman-Strauss einsteinet — en enda platta (en polygon, inga matchningsregler!) som tessellerar planet endast aperiodiskt. Månader senare följde spectre, som inte ens behöver reflektioner. 60-årsjakten slutade med en form.",
    },
    {
      pretitle: "Avsnitt 03 · Drake och pil med matchningsregler",
      title: "Matchningsreglerna tvingar fram aperiodicitet",
      body: "Av två gyllene trianglar — en spetsig 72-72-36 och en trubbig 108-36-36 — sätter Penrose ihop draken och pilen. (P3-mängden av tunna och tjocka romber är en separat, dual familj — inte framställd genom att halvera samma romb.) Utan ytterligare restriktioner skulle du kunna tessellera planet periodiskt. Tricket är de färgade bågarna som Conway ritade på varje kant: en röd, en grön, båda korsande drake och pil på bestämda ställen. Regeln är då enkel: där två plattor möts måste deras bågar fortsätta. Med detta enda villkor blir varje laglig parkettering aperiodisk. Bågarna växer ut i aldrig-slutande kurvor som vandrar genom hela planet.",
    },
    {
      pretitle: "Avsnitt 04 · Inflation och deflation",
      title: "Varje parkettering har en unik förälder och unika barn",
      body: "Penroses djupaste drag var deflationsregeln. Ta vilken drake-pil-parkettering som helst och dela upp varje platta efter ett fixt recept: varje halvdrake blir två mindre halvdrakar och en halvpil, varje halvpil blir en halvdrake och en halvpil. Bitarna fogas ihop till en Penrose-parkettering i skala 1/φ. Kör receptet baklänges (inflation) och grannplattorna smälter samman till en unik förälder-parkettering i φ gånger skalan. Föräldern är unik: det finns bara ett sätt att grovkorna en Penrose-parkettering till en Penrose-parkettering. Det är detta som låser mönstret i aperiodicitet, eftersom vilken periodisk parkettering som helst till slut skulle inflateras in i sig själv, men φ-skalningen är irrationell och sluts aldrig.",
    },
    {
      pretitle: "Avsnitt 05 · Gyllene snittet överallt",
      title: "Varje mätningsförhållande innehåller φ",
      body: "Så snart du börjar titta är φ = (1+√5)/2 överallt i parketteringen. Antalet drakar dividerat med antalet pilar i vilken stor lapp som helst konvergerar mot φ. Sidolängdsförhållandena i de underliggande Robinson-trianglarna är 1 : φ. Inflationsregeln skalar varje längd exakt med φ. Draken täcker exakt φ gånger pilens area, och varje platta byggs av bara två kantlängder vars förhållande är φ. φ-skalningen är också skälet till att man kan bevisa aperiodicitet utan någon geometri alls: en periodisk parkettering skulle tvinga drakar/pilar att vara rationellt, och φ är det mest irrationella tal som finns — dess kedjebråksutveckling är [1; 1, 1, 1, …], den långsammaste konvergensen i hela matematiken.",
    },
    {
      pretitle: "Avsnitt 06 · Kvasikristaller — bilden blev materia",
      title: "Shechtman, 1982 · Nobel, 2011",
      body: "Den 8 april 1982 sköt Dan Shechtman vid NIST elektroner genom en snabbkyld aluminium-mangan-legering och spelade in ett diffraktionsmönster med skarp 10-talig (alltså 5-talig) symmetri. Enligt varje lärobok borde det inte ha funnits. Han ägnade två år åt att övertyga kollegor om att han inte gjort fel; Linus Pauling ägnade nästa decennium åt att offentligt upprepa att «det finns inga kvasikristaller, bara kvasi-vetenskapsmän». Shechtman publicerade 1984. Penrose-parketteringen var den redan färdiga matematiken som visade att diffraktionsmönstret var konsistent — långdistansordning utan periodicitet, femtalig symmetri tillåten av aperiodicitet. Idag är kvasikristaller en hel gren av materialvetenskapen, finns i non-stick-beläggningar och har till och med hittats i en rysk meteorit. Shechtman fick Nobelpriset i kemi 2011. En teckning på papper föregick ett stycke materia med åtta år.",
    },
  ],
  tiling: {
    caption: "Interaktivt · dela upp parketteringen",
    depthLabel: "Deflationsdjup",
    tilesLabel: (n: number) => `${n} halvplattor`,
    thickLabel: "tjocka romber",
    thinLabel: "tunna romber",
    hint: "Varje deflationssteg delar varje platta i 1/φ-gånger mindre bitar. De tjocka romberna överväger de tunna, så förhållandet tjock/tunn vandrar mot φ ≈ 1,618 med växande djup. Den femtaliga symmetrin bevaras exakt på varje nivå.",
    pretitle: "Interaktivt · deflationsregeln",
    title: "Börja med en sol, dela upp med 1/φ, se en parkettering träda fram",
    body: "Detta låter P3-rombformen växa fram, den tunna-och-tjocka systern till drake och pil, ur det kanoniska sol-fröet: en femuddig stjärna av tio halvromber runt origo. Varje deflationssteg delar varje platta efter Penroses regler. Skjut djupet uppåt: på nivå 1 ser du fortfarande fröet; på nivå 6 tittar du på några tusen halvplattor och tjock/tunn-förhållandet träffar redan flera siffror av φ.",
  },
  golden: {
    caption: "Interaktivt · gyllene snittet",
    levelsLabel: "Fibonacci-nivåer",
    ratioLabel: "Förhållande mellan på varandra följande Fibonacci-tal",
    hint: "Varje ny kvadrat har sidan av nästa Fibonacci-tal och roterar runt den förra i 90°-steg. Kvartscirkelbågarna binds samman i den gyllene spiralen — samma kurva som ligger gömd i varje Penrose-lapp.",
    pretitle: "Interaktivt · varför φ dyker upp överallt",
    title: "1, 1, 2, 3, 5, 8, 13 … och spiralen som konvergerar mot φ",
    body: "Placera en kvadrat 1×1. Bredvid, en till 1×1. Sedan en 2×2 längs deras gemensamma kant. Sedan 3×3, 5×5, 8×8 — varje ny sida är summan av de två föregående. I varje kvadrat ritas en kvartscirkel. Bågarna binds samman i en logaritmisk spiral med tillväxtfaktor φ. Skjut upp nivån och se förhållandet mellan Fibonacci-tal slå an i φ exponentiellt snabbt.",
  },
  crystal: {
    title: "Den kristallografiska restriktionen",
    note: "Bara rotationer av ordning 2, 3, 4 och 6 är förenliga med ett 2-D-gitter. Femtalig är den enklaste av de förbjudna ordningarna, och den som Penrose-parketteringar ändå levererar.",
  },
  race: {
    title: "Kapplöpningen om plattantalet",
    colYear: "år",
    colWho: "vem",
    colTiles: "plattor",
    rows: [
      ["1961", "Wang · frågan ställd", "?"],
      ["1966", "Berger · första svaret", "20 426"],
      ["1968", "Knuth", "92"],
      ["1971", "Robinson", "6"],
      ["1974", "Penrose · drake + pil", "2"],
      ["2023", "Smith / einstein", "1"],
      ["2023", "Smith / spectre", "1 (utan reflektioner)"],
    ],
  },
  cardBox: { line1: "drakar / pilar → φ", line2: "varje deflation skalar med 1/φ" },
  inflationBox: {
    title: "Inflation",
    note: "Inflation förstorar parketteringen med exakt φ i varje steg. Eftersom φ är irrationellt sammanfaller ingen inflaterad kopia någonsin med sig själv, och det är det formella skälet till att parketteringen inte kan vara periodisk.",
  },
  timeline: {
    title: "Tidslinje · papper → materia → Nobel",
    entries: [
      { year: "1974", text: "Penrose publicerar den aperiodiska drake-och-pil-parketteringen." },
      { year: "1982", text: "Shechtman registrerar femtalig elektrondiffraktion i Al-Mn." },
      { year: "1984", text: "Shechtman m.fl. publicerar; termen kvasikristall myntas." },
      { year: "2009", text: "Naturlig kvasikristall hittad i en rysk meteorit (icosahedrit)." },
      { year: "2011", text: "Shechtman får Nobelpriset i kemi." },
      { year: "2023", text: "Smith, Goodman-Strauss m.fl. tillkännager einsteinet och spectre." },
    ],
  },
  closingPretitle: "Gå vidare",
  closingTitle: "Öppna Utforskaren.",
  closingBody:
    "Utforskaren låter dig pressa deflationen djupare, växla mellan de hela romberna och Robinson-halvtrianglarna som bygger dem, slå på Conways matchmarkeringar och rotera fröet. Varje påstående på denna sida blir där ett vridreglage.",
  closingCta: "→ Öppna Utforskaren",
  finalLabel: "Inflatera en parkettering.",
};

// ---------- NO ----------
const no: RichStory = {
  page: {
    pretitle: "Tema · Geometri",
    title: "Penroses flislegging",
    tagline: "To former som dekker planet og aldri gjentar seg.",
    intro:
      "En drage og en pil. To enkle fliser, fire matchregler og et plan som fylles for alltid uten at noen endelig bit noen gang dukker opp igjen. Roger Penrose beskrev konstruksjonen i 1974; naturen kopierte den i 1982 med kvasikrystaller. Det gylne snitt ligger skjult i fullt syn.",
    ctaInteractive: "→ Åpne Utforskeren",
    sections: [],
  },
  encounter: {
    pretitle: "Første møte",
    title: "To fliser. Dekk planet. Gjenta aldri.",
    cards: [
      {
        label: "01",
        title: "Den store ideen",
        body: "Ta to enkle former — en drage og en pil, klippet ut av samme rombe. Legg dem ved siden av hverandre med noen matchregler langs kantene. De dekker hele det uendelige planet uten hull, som vanlige fliser. Men vrien: ingen endelig bit av mønsteret dukker noen gang opp to ganger i samme orientering. Ingen steder. Aldri. Roger Penrose fant dette i 1974, og det knuste et flere tiår gammelt spørsmål.",
      },
      {
        label: "02",
        title: "Et konkret eksempel",
        body: "Tell flisene i hvilken som helst stor flekk og du finner samme tall som venter: drager delt på piler konvergerer alltid mot φ = (1+√5)/2 ≈ 1,618. Det finnes også en regel som heter inflasjon: hver flislegging har en unik forelder-flislegging på større skala og en unik barn-flislegging på mindre — hvert trinn skalerer lengder med nøyaktig φ. Det gylne snittet er ikke pynt; det er strukturen.",
      },
      {
        label: "03",
        title: "Hvorfor det betyr noe",
        body: "I 20 år lurte matematikere på: kan en endelig flismengde tvinge bare aperiodiske flislegginger? Berger svarte ja med 20 426 fliser i 1966; Penrose dro det ned til to i 1974. Så i 1982 skjøt Dan Shechtman elektroner mot en aluminium-mangan-legering og så femfoldig diffraksjon — umulig i klassisk krystallografi. Penroses flislegginger var den ferdige papirmatematikken som viste at naturen hadde lov. Shechtman fikk Nobelprisen i 2011.",
      },
    ],
    tryIt: "Under: la en flislegging vokse ved inflasjon, se så φ tre frem fra Fibonacci-spiralen.",
  },
  sections: [
    {
      pretitle: "Avsnitt 01 · Den krystallografiske begrensningen",
      title: "Femfoldig symmetri er forbudt i klassiske krystaller",
      body: "En klassisk krystall er en periodisk flislegging — et tapetmønster. Et teorem fra 1800-tallet sier at en tapet som gjentar seg i to uavhengige retninger kun kan ha rotasjonssymmetri av orden 2, 3, 4 eller 6. Femfoldig er umulig: femkanter kan ikke flise planet uten hull. Så hvis man noen gang så et materiale med skarpe diffraksjonstopper i femfoldig symmetri, ville regelboken si at man hallusinerte. Penrose-flisleggingen omgår teoremet ved å nekte å være periodisk fra begynnelsen — den kan ha lokal femfoldig orden i hver skala nettopp fordi den aldri lukker seg i en gjentatt celle.",
    },
    {
      pretitle: "Avsnitt 02 · Fra 20 426 fliser til én",
      title: "Wang → Berger → Penrose → einstein",
      body: "I 1961 spurte Hao Wang: finnes det en algoritme som avgjør om en gitt flismengde fliser planet? Han la merke til at spørsmålet reduseres til om noen aperiodisk mengde finnes. Studenten hans Robert Berger svarte i 1966: ja, og han ga en — en Frankenstein-mengde på 20 426 Wang-fliser. Andre matematikere fikk antallet ned mot slutten av 60-tallet. I 1974 fant Penrose bare to. I 49 år var det rekorden. I 2023 kunngjorde David Smith, Joseph Myers, Craig Kaplan og Chaim Goodman-Strauss einsteinet — én eneste flis (et polygon, ingen matchregler!) som fliser planet kun aperiodisk. Måneder senere fulgte spectre, som ikke en gang trenger refleksjoner. 60-årsjakten endte med én form.",
    },
    {
      pretitle: "Avsnitt 03 · Drage og pil med matchregler",
      title: "Matchreglene tvinger frem aperiodisitet",
      body: "Av to gylne trekanter — en spiss 72-72-36 og en stump 108-36-36 — setter Penrose sammen dragen og pilen. (P3-settet med tynne og tjukke romber er en egen, dual familie — ikke laget ved å halvere den samme romben.) Uten flere restriksjoner kunne du flise planet periodisk. Trikset er de fargede buene som Conway tegnet på hver kant: én rød, én grønn, hver av dem krysser drage og pil på spesifikke steder. Regelen er da enkel: der to fliser møtes, må buene fortsette. Med dette ene vilkåret blir hver lovlige flislegging aperiodisk. Buene vokser ut til aldri-lukkende kurver som vandrer over hele planet.",
    },
    {
      pretitle: "Avsnitt 04 · Inflasjon og deflasjon",
      title: "Hver flislegging har en unik forelder og unike barn",
      body: "Penroses dypeste trekk var deflasjonsregelen. Ta hvilken som helst drage-pil-flislegging og del opp hver flis etter en fast oppskrift: hver halv-drage blir to mindre halv-drager og en halv-pil, hver halv-pil blir en halv-drage og en halv-pil. Bitene settes sammen til en Penrose-flislegging i skala 1/φ. Kjør oppskriften baklengs (inflasjon), og nabofliser smelter sammen til en unik forelder-flislegging i φ ganger skalaen. Forelderen er unik: det finnes bare én måte å gjøre en Penrose-flislegging grovere til en Penrose-flislegging. Det er dette som låser mønsteret i aperiodisitet, for enhver periodisk flislegging ville før eller siden inflatere seg inn i seg selv, men φ-skaleringen er irrasjonell og lukker seg aldri.",
    },
    {
      pretitle: "Avsnitt 05 · Det gylne snittet overalt",
      title: "Hvert måleforhold inneholder φ",
      body: "Så snart du begynner å se, er φ = (1+√5)/2 overalt i flisleggingen. Antall drager delt på antall piler i hvilken som helst stor flekk konvergerer mot φ. Sidelengdeforholdene i de underliggende Robinson-trekantene er 1 : φ. Inflasjonsregelen skalerer hver lengde nøyaktig med φ. Dragen dekker nøyaktig φ ganger arealet til pilen, og hver flis er bygd av bare to kantlengder med forhold φ. φ-skaleringen er også grunnen til at man kan bevise aperiodisitet uten noen geometri i det hele tatt: en periodisk flislegging ville tvinge drager/piler til å være rasjonelt, og φ er det mest irrasjonelle tallet som finnes — dens kjedebrøkutvikling er [1; 1, 1, 1, …], den tregeste konvergensen i hele matematikken.",
    },
    {
      pretitle: "Avsnitt 06 · Kvasikrystaller — bildet ble materie",
      title: "Shechtman, 1982 · Nobel, 2011",
      body: "Den 8. april 1982 skjøt Dan Shechtman ved NIST elektroner gjennom en hurtigavkjølt aluminium-mangan-legering og registrerte et diffraksjonsmønster med skarp 10-foldig (altså 5-foldig) symmetri. Etter hver lærebok skulle det ikke ha eksistert. Han brukte to år på å overbevise kolleger om at han ikke hadde gjort en feil; Linus Pauling brukte det neste tiåret på offentlig å gjenta at «det finnes ingen kvasikrystaller, bare kvasi-vitenskapsmenn». Shechtman publiserte i 1984. Penrose-flisleggingen var den ferdige matematikken som viste at diffraksjonsmønsteret var konsistent — langdistanseorden uten periodisitet, femfoldig symmetri tillatt av aperiodisitet. I dag er kvasikrystaller en hel gren av materialvitenskapen, brukt i non-stick-belegg og funnet i en russisk meteoritt. Shechtman mottok Nobelprisen i kjemi i 2011. En tegning på papir gikk forut for et stykke materie med åtte år.",
    },
  ],
  tiling: {
    caption: "Interaktivt · del opp flisleggingen",
    depthLabel: "Deflasjonsdybde",
    tilesLabel: (n: number) => `${n} halvfliser`,
    thickLabel: "tykke romber",
    thinLabel: "tynne romber",
    hint: "Hvert deflasjonstrinn deler hver flis i biter 1/φ ganger mindre. De tykke rombene er flere enn de tynne, så forholdet tykk/tynn går mot φ ≈ 1,618 ettersom dybden vokser. Den femfoldige symmetrien bevares nøyaktig på hvert nivå.",
    pretitle: "Interaktivt · deflasjonsregelen",
    title: "Start med en sol, del opp med 1/φ, se en flislegging dukke opp",
    body: "Dette lar P3-rombeformen vokse frem, den tynne-og-tykke søsteren til drage og pil, fra det kanoniske sol-frøet: en femtakket stjerne av ti halvromber rundt origo. Hvert deflasjonstrinn deler hver flis etter Penroses regler. Dra opp dybden: på nivå 1 ser du fortsatt frøet; på nivå 6 ser du på noen tusen halvfliser, og tykk/tynn-forholdet treffer allerede flere sifre av φ.",
  },
  golden: {
    caption: "Interaktivt · det gylne snitt",
    levelsLabel: "Fibonacci-nivåer",
    ratioLabel: "Forhold mellom påfølgende Fibonacci-tall",
    hint: "Hvert nytt kvadrat har siden til neste Fibonacci-tall og roterer rundt det forrige i 90°-trinn. Kvartsirkelbuene knyttes sammen i den gylne spiralen — den samme kurven som ligger skjult i hver Penrose-flekk.",
    pretitle: "Interaktivt · hvorfor φ dukker opp overalt",
    title: "1, 1, 2, 3, 5, 8, 13 … og spiralen som konvergerer mot φ",
    body: "Plasser et kvadrat 1×1. Ved siden av, et til 1×1. Så et 2×2 langs deres felles kant. Så 3×3, 5×5, 8×8 — hver ny side er summen av de to forrige. I hvert kvadrat tegner du en kvartsirkel. Buene bindes sammen i en logaritmisk spiral med vekstfaktor φ. Skyv nivået opp og se forholdet mellom påfølgende Fibonacci-tall slå inn i φ eksponentielt raskt.",
  },
  crystal: {
    title: "Den krystallografiske begrensningen",
    note: "Bare rotasjoner av orden 2, 3, 4 og 6 er forenlige med et 2-D-gitter. Femfoldig er den enkleste av de forbudte ordenene, og den Penrose-flislegginger likevel gir.",
  },
  race: {
    title: "Kappløpet om flisantallet",
    colYear: "år",
    colWho: "hvem",
    colTiles: "fliser",
    rows: [
      ["1961", "Wang · spørsmålet stilt", "?"],
      ["1966", "Berger · første svar", "20 426"],
      ["1968", "Knuth", "92"],
      ["1971", "Robinson", "6"],
      ["1974", "Penrose · drage + pil", "2"],
      ["2023", "Smith / einstein", "1"],
      ["2023", "Smith / spectre", "1 (uten refleksjoner)"],
    ],
  },
  cardBox: { line1: "drager / piler → φ", line2: "hver deflasjon skalerer med 1/φ" },
  inflationBox: {
    title: "Inflasjon",
    note: "Inflasjon forstørrer flisleggingen med nøyaktig φ hvert trinn. Fordi φ er irrasjonell, faller ingen inflatert kopi noen gang sammen med seg selv, og det er den formelle grunnen til at flisleggingen ikke kan være periodisk.",
  },
  timeline: {
    title: "Tidslinje · papir → materie → Nobel",
    entries: [
      { year: "1974", text: "Penrose publiserer den aperiodiske drage-og-pil-flisleggingen." },
      { year: "1982", text: "Shechtman registrerer femfoldig elektrondiffraksjon i Al-Mn." },
      { year: "1984", text: "Shechtman m.fl. publiserer; begrepet kvasikrystall myntes." },
      { year: "2009", text: "Naturlig kvasikrystall funnet i en russisk meteoritt (ikosaedritt)." },
      { year: "2011", text: "Shechtman mottar Nobelprisen i kjemi." },
      { year: "2023", text: "Smith, Goodman-Strauss m.fl. kunngjør einsteinet og spectre." },
    ],
  },
  closingPretitle: "Gå videre",
  closingTitle: "Åpne Utforskeren.",
  closingBody:
    "Utforskeren lar deg presse deflasjonen dypere, veksle mellom de hele rombene og Robinson-halvtrekantene som bygger dem, slå på Conways matchmarkeringer og rotere frøet. Hver påstand på denne siden blir der en knapp.",
  closingCta: "→ Åpne Utforskeren",
  finalLabel: "Inflater en flislegging.",
};

const RICH_STORY: Record<Locale, RichStory> = { en, de, es, fr, it, pt, sv, no };

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
    <div className="glass hairline h-full space-y-3 rounded-2xl border p-6 transition-colors hover:border-signal-amber/40">
      <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
        {label}
      </div>
      <h3 className="math-italic text-2xl leading-snug text-ink-100">{title}</h3>
      <div className="text-sm leading-relaxed text-ink-200">{children}</div>
    </div>
  );
}

// Tiny inflation-rule diagram for card 2: shows a thick rhombus subdividing
// into smaller Robinson half-triangles. Pure visual flavour.
function InflationMiniSVG() {
  const cx = 80;
  const cy = 80;
  const r = 56;
  const halfWide = (72 * Math.PI) / 180;
  const halfNarrow = (36 * Math.PI) / 180;
  // Thick rhombus vertices
  const top = [cx, cy - r * Math.cos(halfWide / 2)];
  const bot = [cx, cy + r * Math.cos(halfWide / 2)];
  const left = [cx - r * Math.sin(halfNarrow), cy];
  const right = [cx + r * Math.sin(halfNarrow), cy];
  const rhombus = `${top[0]},${top[1]} ${right[0]},${right[1]} ${bot[0]},${bot[1]} ${left[0]},${left[1]}`;
  return (
    <svg
      viewBox="0 0 160 160"
      className="mx-auto h-auto w-full max-w-[140px]"
      role="img"
      aria-label="Penrose deflation rule mini diagram"
    >
      <rect width="160" height="160" fill="#06070d" rx="10" />
      <polygon
        points={rhombus}
        fill="rgba(255,209,102,0.18)"
        stroke="rgba(255,209,102,0.85)"
        strokeWidth={1.2}
      />
      {/* Subdivision lines */}
      <line
        x1={left[0]}
        y1={left[1]}
        x2={top[0]}
        y2={top[1] + 0}
        stroke="rgba(179,136,255,0.6)"
        strokeWidth={0.8}
        strokeDasharray="2,2"
      />
      <line
        x1={right[0]}
        y1={right[1]}
        x2={bot[0]}
        y2={bot[1]}
        stroke="rgba(179,136,255,0.6)"
        strokeWidth={0.8}
        strokeDasharray="2,2"
      />
      <line
        x1={top[0]}
        y1={top[1]}
        x2={bot[0]}
        y2={bot[1]}
        stroke="rgba(125,243,255,0.5)"
        strokeWidth={0.7}
        strokeDasharray="3,3"
      />
      <text
        x={cx}
        y={150}
        textAnchor="middle"
        fontFamily="ui-monospace, monospace"
        fontSize={9}
        fill="#8a90a4"
      >
        scale by 1/φ
      </text>
    </svg>
  );
}

export default function PenroseStory() {
  const { locale } = useI18n();
  const story = RICH_STORY[locale];
  const page = story.page;
  const [sec0, sec1, sec2, sec3, sec4, sec5] = story.sections;

  return (
    <StoryPageShell
      page={page}
      ctaHref="/penrose/explorer"
      accent={ACCENT}
      borderAccent="border-signal-amber/70"
      bgAccent="bg-signal-amber/10"
      hoverAccent="hover:bg-signal-amber/20"
      gradient="from-signal-amber/10"
      formulaBadge="φ = (1 + √5) / 2"
      formulaLatex={"\\varphi = \\frac{1 + \\sqrt{5}}{2}"}
      finalLabel={story.finalLabel}
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
              <EncounterCard label={card.label} title={card.title}>
                {i === 1 ? (
                  <>
                    <p>{card.body}</p>
                    <div className="mt-4">
                      <InflationMiniSVG />
                    </div>
                    <div className="hairline mt-3 space-y-1 rounded-md border bg-ink-950/60 p-3 font-mono text-[11px] text-ink-100">
                      <div>{story.cardBox.line1}</div>
                      <div>{story.cardBox.line2}</div>
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

      {/* Section 01 — crystallographic restriction */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec0!.pretitle}
          title={sec0!.title}
          body={sec0!.body}
          accent={ACCENT}
        />
        <Reveal delay={120}>
          <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-6 text-center">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {story.crystal.title}
            </div>
            <div className="font-mono text-sm text-ink-200">
              allowed: <span className="text-signal-cyan">2</span> ·{" "}
              <span className="text-signal-cyan">3</span> ·{" "}
              <span className="text-signal-cyan">4</span> ·{" "}
              <span className="text-signal-cyan">6</span>
              {"  forbidden: "}
              <span className="text-signal-rose">5</span> ·{" "}
              <span className="text-signal-rose">7</span> ·{" "}
              <span className="text-signal-rose">8</span> ·{" "}
              <span className="text-signal-rose">…</span>
            </div>
            <p className="mx-auto max-w-xl text-xs leading-relaxed text-ink-300">
              {story.crystal.note}
            </p>
          </div>
        </Reveal>
      </section>

      {/* Section 02 — the historical chain */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec1!.pretitle}
          title={sec1!.title}
          body={sec1!.body}
          accent={ACCENT}
        />
        <Reveal delay={120}>
          <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-6">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {story.race.title}
            </div>
            <table className="w-full font-mono text-sm">
              <thead className="hairline border-b text-ink-300">
                <tr>
                  <th className="px-2 py-2 text-left text-[10px] uppercase tracking-widest">
                    {story.race.colYear}
                  </th>
                  <th className="px-2 py-2 text-left text-[10px] uppercase tracking-widest">
                    {story.race.colWho}
                  </th>
                  <th className="px-2 py-2 text-right text-[10px] uppercase tracking-widest">
                    {story.race.colTiles}
                  </th>
                </tr>
              </thead>
              <tbody>
                {story.race.rows.map(([year, who, tiles]) => (
                  <tr key={year + who} className="border-b border-ink-700/30 last:border-0">
                    <td className="px-2 py-2 text-signal-amber">{year}</td>
                    <td className="px-2 py-2 text-ink-200">{who}</td>
                    <td className="px-2 py-2 text-right text-ink-100">{tiles}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </section>

      {/* Section 03 — kite + dart with matching rules */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec2!.pretitle}
          title={sec2!.title}
          body={sec2!.body}
          accent={ACCENT}
        />
      </section>

      {/* INTERACTIVE 1 · the tiling */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <Reveal>
          <div className="space-y-2 text-center">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {story.tiling.pretitle}
            </div>
            <h2 className="math-italic text-3xl leading-tight md:text-4xl">{story.tiling.title}</h2>
            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-ink-200">
              {story.tiling.body}
            </p>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <PenroseTiling
            caption={story.tiling.caption}
            depthLabel={story.tiling.depthLabel}
            tilesLabel={story.tiling.tilesLabel}
            thickLabel={story.tiling.thickLabel}
            thinLabel={story.tiling.thinLabel}
            hint={story.tiling.hint}
          />
        </Reveal>
      </section>

      {/* Section 04 — inflation/deflation */}
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
              {story.inflationBox.title}
            </div>
            <div className="math-italic text-3xl text-ink-100 md:text-4xl">
              length<sub>n+1</sub> = φ · length<sub>n</sub>
            </div>
            <p className="mx-auto max-w-xl text-sm leading-relaxed text-ink-300">
              {story.inflationBox.note}
            </p>
          </div>
        </Reveal>
      </section>

      {/* Section 05 — the golden ratio everywhere */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec4!.pretitle}
          title={sec4!.title}
          body={sec4!.body}
          accent={ACCENT}
        />
      </section>

      {/* INTERACTIVE 2 · golden ratio */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <Reveal>
          <div className="space-y-2 text-center">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {story.golden.pretitle}
            </div>
            <h2 className="math-italic text-3xl leading-tight md:text-4xl">{story.golden.title}</h2>
            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-ink-200">
              {story.golden.body}
            </p>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <PenroseGoldenRatio
            caption={story.golden.caption}
            levelsLabel={story.golden.levelsLabel}
            ratioLabel={story.golden.ratioLabel}
            hint={story.golden.hint}
          />
        </Reveal>
      </section>

      {/* Section 06 — quasicrystals */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec5!.pretitle}
          title={sec5!.title}
          body={sec5!.body}
          accent={ACCENT}
        />
        <Reveal delay={120}>
          <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-6">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {story.timeline.title}
            </div>
            <ul className="space-y-2 font-mono text-sm">
              {story.timeline.entries.map((entry) => (
                <li key={entry.year + entry.text} className="flex gap-3">
                  <span className="w-16 shrink-0 text-signal-amber">{entry.year}</span>
                  <span className="text-ink-200">{entry.text}</span>
                </li>
              ))}
            </ul>
          </div>
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
            href="/penrose/explorer"
            className="inline-block rounded-full border border-signal-amber/70 bg-signal-amber/10 px-8 py-4 font-mono text-sm uppercase tracking-widest2 text-signal-amber transition-colors hover:bg-signal-amber/25"
          >
            {story.closingCta}
          </Link>
        </section>
      </Reveal>
    </StoryPageShell>
  );
}
