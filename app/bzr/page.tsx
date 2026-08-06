"use client";

import Link from "next/link";
import { StoryPageShell, StoryCard } from "@/components/StoryPageShell";
import { Reveal } from "@/components/Reveal";
import { useI18n } from "@/lib/i18n/context";
import { BzrOregonator } from "@/components/BzrOregonator";
import { BzrSpiralSim } from "@/components/BzrSpiralSim";
import type { Locale } from "@/lib/i18n/types";
import type { StoryPage } from "@/lib/i18n/stories";

const ACCENT = "text-signal-coral";

// --------------------------------------------------------------------------
// Rich, per-locale story copy for the Belousov-Zhabotinsky story page. All
// page-level prose lives here so we can match the canonical StoryPageShell
// layout without touching the shared i18n files.
// --------------------------------------------------------------------------

type Card = { label: string; title: string; body: string };
type Section = { pretitle: string; title: string; body: string };

type OregonatorCopy = {
  caption: string;
  epsilonLabel: string;
  qLabel: string;
  resetLabel: string;
  pauseLabel: string;
  playLabel: string;
  legendLabel: string;
  note: string;
  pretitle: string;
  title: string;
  body: string;
};

type SpiralCopy = {
  caption: string;
  resetLabel: string;
  plantLabel: string;
  pauseLabel: string;
  playLabel: string;
  note: string;
  pretitle: string;
  title: string;
  body: string;
};

type RichStory = {
  page: StoryPage;
  encounter: { pretitle: string; title: string; cards: Card[]; tryIt: string };
  sections: Section[];
  oregonator: OregonatorCopy;
  spiral: SpiralCopy;
  closingPretitle: string;
  closingTitle: string;
  closingBody: string;
  ctaLabel: string;
};

// ---------- English ----------
const en: RichStory = {
  page: {
    pretitle: "Topic · Chaos · Self-organisation",
    title: "The Belousov-Zhabotinsky reaction",
    tagline: "A chemical clock that draws spirals.",
    intro:
      "Mix bromate, malonic acid and a cerium catalyst in dilute sulphuric acid. The flask refuses to settle — it pulses through colours like a heartbeat. Pour the same mixture thin across a Petri dish and rotating spirals appear, the very same shapes that ripple across a fibrillating heart. Born in a Moscow lab in 1951, dismissed for a decade as a second-law violation, the BZ reaction is the cleanest evidence we have that chemistry can self-organise.",
    ctaInteractive: "Open the Explorer",
    sections: [],
  },
  encounter: {
    pretitle: "First encounter",
    title: "Three chemicals. One stubborn rhythm.",
    cards: [
      {
        label: "01",
        title: "The big idea",
        body: "Pour three chemicals into a flask in the right ratio and the solution refuses to settle. It pulses — yellow, then clear, then yellow again, beat after beat, for an hour or more. Spread the same mixture thin across a Petri dish and rotating spiral waves appear from nowhere, rolling outward like a slow, silent storm. A pile of inert molecules has organised itself into a clock and a pattern, with no external metronome telling it what to do.",
      },
      {
        label: "02",
        title: "A concrete example",
        body: "In 1951 the Soviet biochemist Boris Belousov was trying to model the Krebs cycle in a beaker. His mixture turned yellow, then colourless, then yellow again — and kept going. Two journals rejected his paper as obvious nonsense: every chemist knew reactions ran one way, toward equilibrium. He filed it away. A decade later Anatol Zhabotinsky, a Moscow grad student, reproduced and extended the reaction, and the chemistry community slowly admitted that Belousov had been right all along.",
      },
      {
        label: "03",
        title: "Why it matters",
        body: "The BZ reaction was the first unambiguous laboratory demonstration that a chemical system can spontaneously organise itself in time and space, far from equilibrium. The same equations that govern its spirals also govern the spiral waves of cardiac fibrillation, the aggregation rings of slime moulds, and the rotating excitations on the cortex during epilepsy. Ilya Prigogine won the 1977 Nobel for the underlying theory of dissipative structures. The chemistry came first; the mathematics arrived later to explain it.",
      },
    ],
    tryIt:
      "Below: an Oregonator time-series, then a small reaction-diffusion field where you can plant defects and watch spirals form.",
  },
  sections: [
    {
      pretitle: "Section 01 · The recipe",
      title: "Bromate, malonic acid, cerium — and acid",
      body: "The classic BZ mixture is a few millimoles of potassium bromate (BrO₃⁻) and malonic acid (CH₂(COOH)₂), with a trace of cerium (Ce³⁺/Ce⁴⁺) or ferroin as catalyst, all dissolved in 1 M sulphuric acid. The bromate is the oxidiser, malonic acid the organic fuel, the metal a colour-changing indicator that tracks its own oxidation state. In a stirred flask the colour cycles every few seconds; in a thin unstirred film, the same chemistry paints concentric and spiral waves across the dish.",
    },
    {
      pretitle: "Section 02 · The two regimes",
      title: "An oxidation pulse, switched off by bromide",
      body: "The cycle alternates between two regimes, gated by the local bromide concentration. When [Br⁻] is high enough, it scavenges any growing HBrO₂ before it can autocatalyse, and the metal sits in its reduced state. When malonic acid eats the bromide below a critical threshold, the brake fails: HBrO₂ runs away exponentially, oxidising the metal in a sudden flash. The oxidised metal then regenerates Br⁻ from a side reaction with the bromomalonic acid, the brake comes back, and the cycle starts over. A chemical relaxation oscillator, ticking on its own.",
    },
    {
      pretitle: "Section 03 · Field, Körös, Noyes (1972)",
      title: "Eleven elementary steps, a working mechanism",
      body: "By the early 1970s Richard Field, Endre Körös and Richard Noyes at Oregon had distilled the chaos of intermediates into a concrete eleven-reaction mechanism — the FKN mechanism. It cleanly identified HBrO₂ as the autocatalytic switch, Br⁻ as the inhibitor it had to outrun, and the Ce(IV) → Ce(III) regeneration loop that produced fresh bromide. The FKN paper turned BZ from a curiosity into a textbook system: the first complex oscillating reaction whose every step could be written down.",
    },
    {
      pretitle: "Section 04 · The Oregonator (1974)",
      title: "Three variables, a faithful caricature",
      body: "A year later Field and Noyes published a minimal three-variable abstraction of FKN — the Oregonator. In dimensionless form: ε ẋ = q y − x y + x(1−x), ε′ ẏ = −q y − x y + f z, ż = x − z, with x ∼ HBrO₂, y ∼ Br⁻ and z ∼ the oxidised catalyst. Tiny ε makes the activator x snap; q is the cross-inhibition strength. Add a Laplacian diffusion term to each line and the same equations grow target patterns and rotating spirals on a plate. Three numbers and a stiff ODE — and you have a working chemical clock.",
    },
    {
      pretitle: "Section 05 · Spatial structure",
      title: "Target patterns, spirals, broken symmetry",
      body: "Stop stirring the flask and pour the mixture thin. A few dust grains kick off concentric target waves; a tiny shear breaks one of the wavefronts and the open ends curl into a pair of counter-rotating spirals. Each spiral tip rotates at a fixed frequency that is faster than any target — the spirals always win, sweeping the dish into a kaleidoscope of rotors. Arthur Winfree spent the 1970s photographing these tips, sketching their topology, and arguing that the same rotors set fire to a fibrillating heart.",
    },
    {
      pretitle: "Section 06 · Connections",
      title: "Hearts, slime moulds, neurons, biological clocks",
      body: "The BZ spirals turned out to be a universal signature of excitable media. The same equations describe spiral re-entrant waves in cardiac tissue (Winfree, Keener), aggregation waves in Dictyostelium slime moulds responding to cAMP pulses (Tomchik and Devreotes), spreading depression on the cortex during migraine, and population waves in predator-prey ecosystems. Prigogine's 1977 Nobel lecture used the BZ flask as the canonical example of a dissipative structure: order paid for by a steady flow of free energy. The chemistry had become a universal language.",
    },
  ],
  oregonator: {
    caption: "Interactive · Oregonator time series",
    epsilonLabel: "ε · activator stiffness",
    qLabel: "q · inhibition",
    resetLabel: "Reset",
    pauseLabel: "Pause",
    playLabel: "Play",
    legendLabel: "Traces",
    note: "Three-variable Oregonator integrated with small forward-Euler steps. ε controls how sharply the activator x ignites; q tunes the bromide inhibition. Push ε too far and the spikes blur into smooth oscillation; pull q below ~1e−4 and the bromide brake gives up.",
    pretitle: "Interactive · the chemical clock",
    title: "Watch the three concentrations dance",
    body: "The same three variables — x ∼ HBrO₂, y ∼ Br⁻, z ∼ Ce⁴⁺ — that Field and Noyes wrote down in 1974, evolving in real time. Slow rise of the activator, sharp ignition, a flash of oxidised catalyst, the bromide brake catching up, the system reloading. A clock made of nothing but kinetics.",
  },
  spiral: {
    caption: "Interactive · 2D excitable medium",
    resetLabel: "Reset",
    plantLabel: "Plant defect",
    pauseLabel: "Pause",
    playLabel: "Play",
    note: "Barkley two-variable reduction of the FitzHugh-Nagumo / Oregonator family on a 180×140 grid with toroidal wrap. Hit Plant defect a couple of times to nucleate fresh spirals; each rotor will then pull the rest of the field into its own rhythm.",
    pretitle: "Interactive · grow a spiral",
    title: "Break a wavefront, watch the rotor catch",
    body: "An excitable medium has only two states: rest and brief excitation, separated by a refractory tail. Send a wave through it and it propagates without dispersion. Break a single wavefront and the open end curls — that is the universal shape every excitable medium settles on, from a Petri dish to a fibrillating ventricle. The spatial demo uses Barkley's two-variable reduction of the same reaction-diffusion family — it produces the same spirals without integrating the full stiff Oregonator system.",
  },
  closingPretitle: "Take it further",
  closingTitle: "Stir the dish.",
  closingBody:
    "The Explorer runs a Hodgepodge cellular automaton, a Greenberg-Hastings style excitable grid where each cell is healthy, infected or ill. Three sliders shape the rhythm: k1 (infected weight), k2 (ill weight) and g (reaction rate). Pick one of four colour maps, load a preset, restart from random noise or seed a clean spiral, then watch the rotors take over the whole field.",
  ctaLabel: "→ Open the Explorer",
};

// ---------- German ----------
const de: RichStory = {
  page: {
    pretitle: "Thema · Chaos · Selbstorganisation",
    title: "Die Belousov-Zhabotinsky-Reaktion",
    tagline: "Eine chemische Uhr, die Spiralen zeichnet.",
    intro:
      "Bromat, Malonsäure und ein Cer-Katalysator in verdünnter Schwefelsäure: der Kolben weigert sich, zur Ruhe zu kommen — er pulsiert durch die Farben wie ein Herzschlag. Verteilt man dieselbe Mischung dünn über eine Petrischale, erscheinen rotierende Spiralen, exakt die Form, die durch ein flimmerndes Herz läuft. Geboren in einem Moskauer Labor 1951, ein Jahrzehnt lang als Verletzung des zweiten Hauptsatzes abgetan, ist die BZ-Reaktion der sauberste Beleg dafür, dass Chemie sich selbst organisieren kann.",
    ctaInteractive: "Explorer öffnen",
    sections: [],
  },
  encounter: {
    pretitle: "Erste Begegnung",
    title: "Drei Stoffe. Ein hartnäckiger Takt.",
    cards: [
      {
        label: "01",
        title: "Die große Idee",
        body: "Gieße drei Stoffe im richtigen Verhältnis in einen Kolben — und die Lösung weigert sich zu ruhen. Sie pulsiert: gelb, klar, gelb, klar, Schlag um Schlag, eine Stunde oder länger. Verteilt man dieselbe Mischung dünn auf einer Petrischale, erscheinen aus dem Nichts rotierende Spiralen, die langsam und lautlos nach außen rollen. Ein Stapel träger Moleküle organisiert sich zu einer Uhr und einem Muster, ganz ohne Metronom von außen.",
      },
      {
        label: "02",
        title: "Ein konkretes Beispiel",
        body: "1951 versuchte der sowjetische Biochemiker Boris Belousov, den Krebs-Zyklus im Becherglas nachzustellen. Seine Mischung wurde gelb, dann klar, dann wieder gelb — und hörte nicht auf. Zwei Zeitschriften lehnten seine Arbeit als offensichtlichen Unsinn ab: jede:r Chemiker:in wusste, Reaktionen liefen nur in eine Richtung, hin zum Gleichgewicht. Er legte das Papier in die Schublade. Zehn Jahre später reproduzierte und erweiterte Anatol Zhabotinsky, ein Moskauer Doktorand, die Reaktion, und die Zunft musste zugeben, dass Belousov die ganze Zeit recht gehabt hatte.",
      },
      {
        label: "03",
        title: "Warum es zählt",
        body: "Die BZ-Reaktion war der erste unmissverständliche Labornachweis, dass sich ein chemisches System fernab vom Gleichgewicht in Zeit und Raum von selbst organisieren kann. Dieselben Gleichungen, die ihre Spiralen erzeugen, regieren auch die Spiralwellen des Herzkammerflimmerns, die Aggregationsringe der Schleimpilze und die rotierenden Erregungen auf der Großhirnrinde bei Epilepsie. Ilya Prigogine bekam 1977 den Nobelpreis für die zugrundeliegende Theorie dissipativer Strukturen. Die Chemie kam zuerst; die Mathematik kam später, um sie zu erklären.",
      },
    ],
    tryIt:
      "Unten: eine Oregonator-Zeitreihe, dann ein kleines Reaktions-Diffusionsfeld, in dem du Defekte setzen und Spiralen entstehen lassen kannst.",
  },
  sections: [
    {
      pretitle: "Abschnitt 01 · Das Rezept",
      title: "Bromat, Malonsäure, Cer — und Säure",
      body: "Die klassische BZ-Mischung sind ein paar Millimol Kaliumbromat (BrO₃⁻) und Malonsäure (CH₂(COOH)₂), eine Spur Cer (Ce³⁺/Ce⁴⁺) oder Ferroin als Katalysator, alles in 1-molarer Schwefelsäure gelöst. Das Bromat ist das Oxidationsmittel, Malonsäure der organische Brennstoff, das Metall ein farbwechselnder Indikator, der seinen eigenen Oxidationszustand verrät. Im gerührten Kolben springt die Farbe alle paar Sekunden um; in einem dünnen, ungerührten Film malt dieselbe Chemie konzentrische Ringe und Spiralen durch die Schale.",
    },
    {
      pretitle: "Abschnitt 02 · Die zwei Regime",
      title: "Ein Oxidationspuls, vom Bromid abgewürgt",
      body: "Der Zyklus wechselt zwischen zwei Regimen, gesteuert von der lokalen Bromidkonzentration. Ist [Br⁻] hoch genug, fängt es jedes wachsende HBrO₂ ab, bevor es sich selbst katalysieren kann, und das Metall bleibt reduziert. Frisst die Malonsäure das Bromid unter eine kritische Schwelle, versagt die Bremse: HBrO₂ läuft exponentiell weg und oxidiert das Metall in einem schlagartigen Blitz. Das oxidierte Metall regeneriert dann über eine Nebenreaktion mit Brommalonsäure frisches Br⁻, die Bremse kehrt zurück, der Zyklus beginnt von neuem. Ein chemischer Relaxationsoszillator, der von allein tickt.",
    },
    {
      pretitle: "Abschnitt 03 · Field, Körös, Noyes (1972)",
      title: "Elf Elementarschritte, ein funktionierender Mechanismus",
      body: "Anfang der 1970er hatten Richard Field, Endre Körös und Richard Noyes in Oregon das Chaos der Zwischenstufen zu einem konkreten elfstufigen Mechanismus destilliert — dem FKN-Mechanismus. Er identifizierte sauber HBrO₂ als autokatalytischen Schalter, Br⁻ als den Inhibitor, dem es davonlaufen musste, und die Ce(IV) → Ce(III)-Schleife, die frisches Bromid lieferte. Das FKN-Papier machte aus BZ aus einer Kuriosität ein Lehrbuchsystem: die erste komplexe oszillierende Reaktion, deren jeder Schritt aufgeschrieben werden konnte.",
    },
    {
      pretitle: "Abschnitt 04 · Der Oregonator (1974)",
      title: "Drei Variablen, eine treue Karikatur",
      body: "Ein Jahr später veröffentlichten Field und Noyes eine minimale Drei-Variablen-Abstraktion von FKN — den Oregonator. In dimensionsloser Form: ε ẋ = q y − x y + x(1−x), ε′ ẏ = −q y − x y + f z, ż = x − z, mit x ∼ HBrO₂, y ∼ Br⁻ und z ∼ dem oxidierten Katalysator. Winziges ε lässt den Aktivator x schnappen; q ist die Stärke der Kreuz-Inhibition. Fügt man jeder Zeile einen Laplace-Term hinzu, lassen dieselben Gleichungen Zielringe und rotierende Spiralen auf einer Platte wachsen. Drei Zahlen und eine steife DGL — und du hast eine funktionierende chemische Uhr.",
    },
    {
      pretitle: "Abschnitt 05 · Räumliche Struktur",
      title: "Zielringe, Spiralen, gebrochene Symmetrie",
      body: "Hör auf zu rühren und gieße die Mischung dünn aus. Ein paar Staubkörner lösen konzentrische Zielwellen aus; eine winzige Scherung bricht eine der Wellenfronten, und die offenen Enden rollen sich zu einem Paar gegenläufig rotierender Spiralen ein. Jede Spiralspitze rotiert mit einer festen Frequenz, die höher ist als jedes Ziel — die Spiralen gewinnen immer und ziehen die Schale in ein Kaleidoskop von Rotoren. Arthur Winfree verbrachte die 1970er damit, diese Spitzen zu fotografieren, ihre Topologie zu skizzieren und zu argumentieren, dass dieselben Rotoren ein flimmerndes Herz in Brand setzen.",
    },
    {
      pretitle: "Abschnitt 06 · Verbindungen",
      title: "Herzen, Schleimpilze, Neuronen, biologische Uhren",
      body: "Die BZ-Spiralen entpuppten sich als universelle Signatur erregbarer Medien. Dieselben Gleichungen beschreiben spiralförmige Reentry-Wellen in Herzgewebe (Winfree, Keener), Aggregationswellen in Dictyostelium-Schleimpilzen, die auf cAMP-Pulse antworten (Tomchik und Devreotes), Streudepression auf der Großhirnrinde bei Migräne und Populationswellen in Räuber-Beute-Ökosystemen. Prigogines Nobelvortrag von 1977 nutzte den BZ-Kolben als kanonisches Beispiel einer dissipativen Struktur: Ordnung, bezahlt durch einen stetigen Fluss freier Energie. Aus der Chemie war eine universelle Sprache geworden.",
    },
  ],
  oregonator: {
    caption: "Interaktiv · Oregonator-Zeitreihe",
    epsilonLabel: "ε · Aktivator-Steifigkeit",
    qLabel: "q · Inhibition",
    resetLabel: "Zurücksetzen",
    pauseLabel: "Pause",
    playLabel: "Start",
    legendLabel: "Spuren",
    note: "Drei-Variablen-Oregonator, mit kleinen Vorwärts-Euler-Schritten integriert. ε steuert, wie scharf der Aktivator x zündet; q stimmt die Bromid-Inhibition. Treibst du ε zu weit, verschmieren die Spitzen zu glatter Schwingung; ziehst du q unter ~1e−4, gibt die Bromid-Bremse auf.",
    pretitle: "Interaktiv · die chemische Uhr",
    title: "Sieh die drei Konzentrationen tanzen",
    body: "Dieselben drei Variablen — x ∼ HBrO₂, y ∼ Br⁻, z ∼ Ce⁴⁺ — die Field und Noyes 1974 aufschrieben, in Echtzeit. Langsamer Anstieg des Aktivators, scharfes Zünden, ein Blitz des oxidierten Katalysators, die Bromid-Bremse holt auf, das System lädt nach. Eine Uhr, gebaut aus nichts als Kinetik.",
  },
  spiral: {
    caption: "Interaktiv · 2D-erregbares Medium",
    resetLabel: "Zurücksetzen",
    plantLabel: "Defekt setzen",
    pauseLabel: "Pause",
    playLabel: "Start",
    note: "Barkley-Reduktion der FitzHugh-Nagumo-/Oregonator-Familie auf einem 180×140-Gitter mit toroidalem Rand. Drück ein paarmal auf Defekt setzen, um frische Spiralen zu zünden; jeder Rotor zieht dann den Rest des Feldes in seinen eigenen Takt.",
    pretitle: "Interaktiv · züchte eine Spirale",
    title: "Brich eine Wellenfront, sieh den Rotor einrasten",
    body: "Ein erregbares Medium hat nur zwei Zustände: Ruhe und kurze Erregung, getrennt durch eine refraktäre Welle. Schick eine Welle hindurch, und sie läuft ohne Dispersion. Brich eine einzelne Wellenfront, und das offene Ende rollt sich ein — das ist die universelle Form, auf die sich jedes erregbare Medium einpendelt, von einer Petrischale bis zu einem flimmernden Herzventrikel. Das räumliche Demo nutzt Barkleys Zwei-Variablen-Reduktion derselben Reaktions-Diffusions-Familie — sie zeigt dieselbe Spirale, ohne das volle steife Oregonator-System zu integrieren.",
  },
  closingPretitle: "Geh weiter",
  closingTitle: "Rühr die Schale.",
  closingBody:
    "Der Explorer läuft als Hodgepodge-Zellularautomat, ein erregbares Gitter im Greenberg-Hastings-Stil, in dem jede Zelle gesund, infiziert oder krank ist. Drei Regler formen den Takt: k1 (Gewicht infizierter Nachbarn), k2 (Gewicht kranker Nachbarn) und g (Reaktionsrate). Wähle eine von vier Farbpaletten, lade ein Preset, starte neu aus Zufallsrauschen oder setze eine saubere Spirale, und sieh zu, wie die Rotoren das ganze Feld übernehmen.",
  ctaLabel: "→ Explorer öffnen",
};

// ---------- Spanish ----------
const es: RichStory = {
  page: {
    pretitle: "Tema · Caos · Autoorganización",
    title: "La reacción de Belousov-Zhabotinsky",
    tagline: "Un reloj químico que dibuja espirales.",
    intro:
      "Mezcla bromato, ácido malónico y un catalizador de cerio en ácido sulfúrico diluido. El matraz se niega a calmarse — pulsa entre colores como un latido. Vierte la misma mezcla en una capa fina sobre una placa de Petri y aparecen espirales rotantes, las mismas formas que recorren un corazón en fibrilación. Nacida en un laboratorio de Moscú en 1951, descartada durante una década como violación de la segunda ley, la reacción BZ es la prueba más limpia que tenemos de que la química puede autoorganizarse.",
    ctaInteractive: "Abrir el Explorador",
    sections: [],
  },
  encounter: {
    pretitle: "Primer encuentro",
    title: "Tres químicos. Un ritmo tozudo.",
    cards: [
      {
        label: "01",
        title: "La gran idea",
        body: "Vierte tres químicos en un matraz en la proporción correcta y la solución se niega a calmarse. Pulsa: amarillo, transparente, amarillo, transparente, latido tras latido, durante una hora o más. Extiende la misma mezcla en capa fina sobre una placa de Petri y aparecen espirales rotantes de la nada, rodando hacia afuera como una tormenta lenta y silenciosa. Una pila de moléculas inertes se ha organizado en un reloj y un patrón, sin metrónomo externo que le diga qué hacer.",
      },
      {
        label: "02",
        title: "Un ejemplo concreto",
        body: "En 1951 el bioquímico soviético Borís Belousov intentaba modelar el ciclo de Krebs en un vaso. Su mezcla se puso amarilla, luego incolora, luego amarilla otra vez — y no paraba. Dos revistas rechazaron su artículo como un disparate obvio: todo químico sabía que las reacciones iban en una dirección, hacia el equilibrio. Lo archivó. Una década después Anatol Zhabotinski, doctorando en Moscú, reprodujo y amplió la reacción, y la comunidad química acabó admitiendo que Belousov había tenido razón todo el tiempo.",
      },
      {
        label: "03",
        title: "Por qué importa",
        body: "La reacción BZ fue la primera demostración inequívoca de laboratorio de que un sistema químico puede organizarse espontáneamente en el tiempo y el espacio, lejos del equilibrio. Las mismas ecuaciones que gobiernan sus espirales gobiernan también las ondas espirales de la fibrilación cardíaca, los anillos de agregación del moho mucilaginoso y las excitaciones rotantes en la corteza durante la epilepsia. Ilya Prigogine ganó el Nobel de 1977 por la teoría subyacente de estructuras disipativas. La química vino primero; la matemática llegó después a explicarla.",
      },
    ],
    tryIt:
      "Abajo: una serie temporal del Oregonator y luego un pequeño campo de reacción-difusión donde puedes plantar defectos y ver formarse espirales.",
  },
  sections: [
    {
      pretitle: "Sección 01 · La receta",
      title: "Bromato, ácido malónico, cerio — y ácido",
      body: "La mezcla BZ clásica son unos pocos milimoles de bromato de potasio (BrO₃⁻) y ácido malónico (CH₂(COOH)₂), con una traza de cerio (Ce³⁺/Ce⁴⁺) o ferroína como catalizador, todo disuelto en ácido sulfúrico 1 M. El bromato es el oxidante, el ácido malónico el combustible orgánico, el metal un indicador que cambia de color y delata su propio estado de oxidación. En un matraz agitado el color cicla cada pocos segundos; en una película fina sin agitar, la misma química pinta ondas concéntricas y espirales por la placa.",
    },
    {
      pretitle: "Sección 02 · Los dos regímenes",
      title: "Un pulso de oxidación, apagado por el bromuro",
      body: "El ciclo alterna entre dos regímenes, controlados por la concentración local de bromuro. Cuando [Br⁻] es lo bastante alta, captura cualquier HBrO₂ creciente antes de que pueda autocatalizarse, y el metal queda reducido. Cuando el ácido malónico consume el bromuro por debajo de un umbral crítico, el freno falla: HBrO₂ se dispara exponencialmente y oxida el metal en un destello súbito. El metal oxidado regenera entonces Br⁻ desde una reacción lateral con el ácido bromomalónico, vuelve el freno y el ciclo recomienza. Un oscilador químico de relajación, marchando solo.",
    },
    {
      pretitle: "Sección 03 · Field, Körös, Noyes (1972)",
      title: "Once pasos elementales, un mecanismo que funciona",
      body: "A principios de los 1970 Richard Field, Endre Körös y Richard Noyes en Oregón habían destilado el caos de intermediarios en un mecanismo concreto de once reacciones — el mecanismo FKN. Identificaba con limpieza HBrO₂ como interruptor autocatalítico, Br⁻ como el inhibidor al que tenía que adelantarse y el lazo Ce(IV) → Ce(III) que producía bromuro fresco. El artículo FKN convirtió a BZ de curiosidad en sistema de manual: la primera reacción oscilante compleja cuyo cada paso podía escribirse.",
    },
    {
      pretitle: "Sección 04 · El Oregonator (1974)",
      title: "Tres variables, una caricatura fiel",
      body: "Un año después Field y Noyes publicaron una abstracción minimal de tres variables del FKN — el Oregonator. En forma adimensional: ε ẋ = q y − x y + x(1−x), ε′ ẏ = −q y − x y + f z, ż = x − z, con x ∼ HBrO₂, y ∼ Br⁻ y z ∼ el catalizador oxidado. Un ε pequeño hace que el activador x chasquee; q es la fuerza de la inhibición cruzada. Añade un término laplaciano a cada línea y las mismas ecuaciones hacen crecer patrones de diana y espirales rotantes sobre una placa. Tres números y una EDO rígida — y tienes un reloj químico funcional.",
    },
    {
      pretitle: "Sección 05 · Estructura espacial",
      title: "Dianas, espirales, simetría rota",
      body: "Deja de agitar el matraz y extiende la mezcla en capa fina. Unos granos de polvo arrancan ondas concéntricas tipo diana; un mínimo cizallamiento rompe uno de los frentes de onda y los extremos abiertos se enrollan en un par de espirales contrarrotantes. Cada punta de espiral rota a frecuencia fija, mayor que la de cualquier diana — las espirales siempre ganan y barren la placa en un calidoscopio de rotores. Arthur Winfree pasó los 1970 fotografiando estas puntas, dibujando su topología y argumentando que los mismos rotores prenden fuego a un corazón en fibrilación.",
    },
    {
      pretitle: "Sección 06 · Conexiones",
      title: "Corazones, mohos mucilaginosos, neuronas, relojes biológicos",
      body: "Las espirales BZ resultaron ser una firma universal de los medios excitables. Las mismas ecuaciones describen ondas reentrantes en espiral en tejido cardíaco (Winfree, Keener), ondas de agregación en mohos Dictyostelium respondiendo a pulsos de cAMP (Tomchik y Devreotes), depresión cortical propagada durante la migraña y ondas poblacionales en ecosistemas predador-presa. La conferencia Nobel de Prigogine de 1977 usó el matraz BZ como ejemplo canónico de estructura disipativa: orden pagado por un flujo continuo de energía libre. La química se había vuelto un lenguaje universal.",
    },
  ],
  oregonator: {
    caption: "Interactivo · serie temporal del Oregonator",
    epsilonLabel: "ε · rigidez del activador",
    qLabel: "q · inhibición",
    resetLabel: "Reiniciar",
    pauseLabel: "Pausa",
    playLabel: "Jugar",
    legendLabel: "Trazos",
    note: "Oregonator de tres variables integrado con pasos pequeños de Euler hacia adelante. ε controla cuán bruscamente se enciende el activador x; q ajusta la inhibición del bromuro. Si empujas demasiado ε, los picos se difuminan en oscilación suave; si tiras q por debajo de ~1e−4, el freno del bromuro se rinde.",
    pretitle: "Interactivo · el reloj químico",
    title: "Mira danzar las tres concentraciones",
    body: "Las mismas tres variables — x ∼ HBrO₂, y ∼ Br⁻, z ∼ Ce⁴⁺ — que Field y Noyes escribieron en 1974, evolucionando en tiempo real. Subida lenta del activador, ignición brusca, destello del catalizador oxidado, el freno del bromuro alcanzándolo, el sistema recargando. Un reloj hecho sólo de cinética.",
  },
  spiral: {
    caption: "Interactivo · medio excitable 2D",
    resetLabel: "Reiniciar",
    plantLabel: "Plantar defecto",
    pauseLabel: "Pausa",
    playLabel: "Jugar",
    note: "Reducción de Barkley de la familia FitzHugh-Nagumo / Oregonator en una rejilla 180×140 con envoltura toroidal. Pulsa Plantar defecto un par de veces para nuclear espirales nuevas; cada rotor arrastrará luego al resto del campo a su propio ritmo.",
    pretitle: "Interactivo · cultiva una espiral",
    title: "Rompe un frente de onda, observa al rotor engancharse",
    body: "Un medio excitable tiene sólo dos estados: reposo y excitación breve, separados por una cola refractaria. Manda una onda a través suyo y se propaga sin dispersión. Rompe un solo frente de onda y el extremo abierto se enrolla — es la forma universal a la que se asienta todo medio excitable, desde una placa de Petri hasta un ventrículo en fibrilación. El demo espacial usa la reducción de dos variables de Barkley de la misma familia de reacción-difusión — produce las mismas espirales sin integrar el sistema rígido completo del Oregonator.",
  },
  closingPretitle: "Ve más lejos",
  closingTitle: "Agita la placa.",
  closingBody:
    "El Explorador ejecuta un autómata celular Hodgepodge, una rejilla excitable al estilo Greenberg-Hastings donde cada celda está sana, infectada o enferma. Tres deslizadores moldean el ritmo: k1 (peso de vecinas infectadas), k2 (peso de vecinas enfermas) y g (tasa de reacción). Elige una de cuatro paletas de color, carga un preajuste, reinicia desde ruido aleatorio o siembra una espiral limpia, y observa cómo los rotores se apoderan de todo el campo.",
  ctaLabel: "→ Abrir el Explorador",
};

// ---------- French ----------
const fr: RichStory = {
  page: {
    pretitle: "Sujet · Chaos · Auto-organisation",
    title: "La réaction de Belousov-Zhabotinsky",
    tagline: "Une horloge chimique qui dessine des spirales.",
    intro:
      "Mélange bromate, acide malonique et un catalyseur au cérium dans de l'acide sulfurique dilué. Le ballon refuse de se calmer — il pulse à travers les couleurs comme un battement de cœur. Étale ce même mélange en couche fine sur une boîte de Petri et des spirales rotatives apparaissent, les mêmes formes que celles qui parcourent un cœur en fibrillation. Née dans un labo moscovite en 1951, rejetée pendant dix ans comme violation du second principe, la réaction BZ est la preuve la plus nette dont nous disposions que la chimie peut s'auto-organiser.",
    ctaInteractive: "Ouvrir l'Explorateur",
    sections: [],
  },
  encounter: {
    pretitle: "Première rencontre",
    title: "Trois produits. Un rythme têtu.",
    cards: [
      {
        label: "01",
        title: "L'idée centrale",
        body: "Verse trois produits dans un ballon dans le bon rapport et la solution refuse de se calmer. Elle pulse : jaune, transparent, jaune, transparent, battement après battement, pendant une heure ou plus. Étale le même mélange en couche fine sur une boîte de Petri et des spirales rotatives apparaissent de nulle part, roulant vers l'extérieur comme un orage lent et silencieux. Une pile de molécules inertes s'est organisée en horloge et en motif, sans métronome extérieur pour lui dicter quoi faire.",
      },
      {
        label: "02",
        title: "Un exemple concret",
        body: "En 1951 le biochimiste soviétique Boris Belousov essayait de modéliser le cycle de Krebs dans un bécher. Son mélange devint jaune, puis incolore, puis jaune à nouveau — et ne s'arrêtait plus. Deux revues rejetèrent son article comme manifestement absurde : tout chimiste savait que les réactions allaient dans un sens, vers l'équilibre. Il rangea le papier. Dix ans plus tard Anatol Jabotinski, doctorant à Moscou, reproduisit et étendit la réaction, et la communauté chimique finit par admettre que Belousov avait eu raison depuis le début.",
      },
      {
        label: "03",
        title: "Pourquoi ça compte",
        body: "La réaction BZ fut la première démonstration sans ambiguïté qu'un système chimique peut s'organiser spontanément dans le temps et l'espace, loin de l'équilibre. Les mêmes équations qui gouvernent ses spirales gouvernent aussi les ondes spirales de la fibrillation cardiaque, les anneaux d'agrégation des moisissures visqueuses et les excitations rotatives sur le cortex pendant l'épilepsie. Ilya Prigogine reçut le Nobel 1977 pour la théorie sous-jacente des structures dissipatives. La chimie vint en premier ; la mathématique arriva plus tard pour l'expliquer.",
      },
    ],
    tryIt:
      "Ci-dessous : une série temporelle de l'Oregonator, puis un petit champ de réaction-diffusion où tu peux planter des défauts et voir naître des spirales.",
  },
  sections: [
    {
      pretitle: "Section 01 · La recette",
      title: "Bromate, acide malonique, cérium — et acide",
      body: "Le mélange BZ classique tient en quelques millimoles de bromate de potassium (BrO₃⁻) et d'acide malonique (CH₂(COOH)₂), avec une trace de cérium (Ce³⁺/Ce⁴⁺) ou de ferroïne comme catalyseur, le tout dissous dans de l'acide sulfurique 1 M. Le bromate est l'oxydant, l'acide malonique le carburant organique, le métal un indicateur qui change de couleur et trahit son propre état d'oxydation. Dans un ballon agité la couleur cycle toutes les quelques secondes ; en film fin non agité, la même chimie peint des ondes concentriques et des spirales à travers la boîte.",
    },
    {
      pretitle: "Section 02 · Les deux régimes",
      title: "Une impulsion d'oxydation, étouffée par le bromure",
      body: "Le cycle alterne entre deux régimes, commandés par la concentration locale en bromure. Tant que [Br⁻] est assez élevée, elle capte tout HBrO₂ en croissance avant qu'il puisse s'autocatalyser, et le métal reste réduit. Quand l'acide malonique rabaisse le bromure sous un seuil critique, le frein lâche : HBrO₂ s'emballe exponentiellement et oxyde le métal en un éclair soudain. Le métal oxydé régénère ensuite Br⁻ via une réaction secondaire avec l'acide bromomalonique, le frein revient, le cycle recommence. Un oscillateur chimique à relaxation, qui bat tout seul.",
    },
    {
      pretitle: "Section 03 · Field, Körös, Noyes (1972)",
      title: "Onze étapes élémentaires, un mécanisme qui marche",
      body: "Au début des années 1970 Richard Field, Endre Körös et Richard Noyes en Oregon avaient distillé le chaos des intermédiaires en un mécanisme concret de onze réactions — le mécanisme FKN. Il identifiait nettement HBrO₂ comme commutateur autocatalytique, Br⁻ comme l'inhibiteur qu'il fallait distancer et la boucle Ce(IV) → Ce(III) qui produisait du bromure frais. L'article FKN transforma BZ de curiosité en système de manuel : la première réaction oscillante complexe dont chaque étape pouvait être écrite.",
    },
    {
      pretitle: "Section 04 · L'Oregonator (1974)",
      title: "Trois variables, une caricature fidèle",
      body: "Un an plus tard, Field et Noyes publièrent une abstraction minimale à trois variables du FKN — l'Oregonator. Sous forme adimensionnelle : ε ẋ = q y − x y + x(1−x), ε′ ẏ = −q y − x y + f z, ż = x − z, avec x ∼ HBrO₂, y ∼ Br⁻ et z ∼ le catalyseur oxydé. Un ε minuscule fait claquer l'activateur x ; q est la force de l'inhibition croisée. Ajoute un terme laplacien à chaque ligne et les mêmes équations font pousser des cibles concentriques et des spirales rotatives sur une plaque. Trois nombres et une EDO raide — et tu as une horloge chimique qui marche.",
    },
    {
      pretitle: "Section 05 · Structure spatiale",
      title: "Cibles, spirales, symétrie brisée",
      body: "Arrête d'agiter et verse le mélange en couche fine. Quelques grains de poussière lancent des cibles concentriques ; un léger cisaillement brise un des fronts d'onde et les extrémités ouvertes s'enroulent en une paire de spirales contrarotatives. Chaque pointe de spirale tourne à une fréquence fixe, plus rapide que toute cible — les spirales gagnent toujours et balaient la boîte en un kaléidoscope de rotors. Arthur Winfree passa les années 1970 à photographier ces pointes, à esquisser leur topologie et à soutenir que les mêmes rotors embrasent un cœur en fibrillation.",
    },
    {
      pretitle: "Section 06 · Connexions",
      title: "Cœurs, moisissures, neurones, horloges biologiques",
      body: "Les spirales BZ se sont avérées la signature universelle des milieux excitables. Les mêmes équations décrivent des ondes de réentrée en spirale dans le tissu cardiaque (Winfree, Keener), des ondes d'agrégation chez les Dictyostelium répondant à des impulsions d'AMPc (Tomchik et Devreotes), la dépression corticale envahissante de la migraine et des ondes de population dans les écosystèmes proie-prédateur. Le discours Nobel de Prigogine en 1977 prenait le ballon BZ comme exemple canonique de structure dissipative : ordre payé par un flux constant d'énergie libre. La chimie était devenue une langue universelle.",
    },
  ],
  oregonator: {
    caption: "Interactif · série temporelle de l'Oregonator",
    epsilonLabel: "ε · raideur de l'activateur",
    qLabel: "q · inhibition",
    resetLabel: "Réinitialiser",
    pauseLabel: "Pause",
    playLabel: "Lire",
    legendLabel: "Traces",
    note: "Oregonator à trois variables intégré par petits pas d'Euler. ε commande la vivacité de l'allumage de l'activateur x ; q règle l'inhibition par le bromure. Pousse ε trop loin et les pics se brouillent en oscillation lisse ; tire q sous ~1e−4 et le frein du bromure abandonne.",
    pretitle: "Interactif · l'horloge chimique",
    title: "Regarde danser les trois concentrations",
    body: "Les mêmes trois variables — x ∼ HBrO₂, y ∼ Br⁻, z ∼ Ce⁴⁺ — que Field et Noyes ont écrites en 1974, évoluant en temps réel. Montée lente de l'activateur, allumage brutal, éclair de catalyseur oxydé, le frein du bromure rattrape, le système recharge. Une horloge faite de pure cinétique.",
  },
  spiral: {
    caption: "Interactif · milieu excitable 2D",
    resetLabel: "Réinitialiser",
    plantLabel: "Planter un défaut",
    pauseLabel: "Pause",
    playLabel: "Lire",
    note: "Réduction de Barkley de la famille FitzHugh-Nagumo / Oregonator sur une grille 180×140 avec repli toroïdal. Clique Planter un défaut deux ou trois fois pour amorcer des spirales fraîches ; chaque rotor tirera ensuite le reste du champ dans son propre rythme.",
    pretitle: "Interactif · cultive une spirale",
    title: "Brise un front d'onde, regarde le rotor s'accrocher",
    body: "Un milieu excitable n'a que deux états : repos et brève excitation, séparés par une traîne réfractaire. Envoie-lui une onde et elle se propage sans dispersion. Brise un seul front d'onde et l'extrémité ouverte s'enroule — c'est la forme universelle vers laquelle se stabilise tout milieu excitable, d'une boîte de Petri à un ventricule en fibrillation. La démo spatiale utilise la réduction à deux variables de Barkley de la même famille réaction-diffusion — elle produit les mêmes spirales sans intégrer le système raide complet de l'Oregonator.",
  },
  closingPretitle: "Va plus loin",
  closingTitle: "Agite la boîte.",
  closingBody:
    "L'Explorateur fait tourner un automate cellulaire Hodgepodge, une grille excitable de style Greenberg-Hastings où chaque cellule est saine, infectée ou malade. Trois curseurs façonnent le rythme : k1 (poids des voisines infectées), k2 (poids des voisines malades) et g (taux de réaction). Choisis une des quatre palettes, charge un préréglage, redémarre depuis du bruit aléatoire ou sème une spirale nette, et regarde les rotors envahir tout le champ.",
  ctaLabel: "→ Ouvrir l'Explorateur",
};

// ---------- Italian ----------
const it: RichStory = {
  page: {
    pretitle: "Tema · Caos · Autorganizzazione",
    title: "La reazione di Belousov-Zhabotinsky",
    tagline: "Un orologio chimico che disegna spirali.",
    intro:
      "Mescola bromato, acido malonico e un catalizzatore al cerio in acido solforico diluito. La beuta si rifiuta di acquietarsi — pulsa attraverso i colori come un battito cardiaco. Versa la stessa miscela in strato sottile su una piastra di Petri e compaiono spirali rotanti, le stesse forme che attraversano un cuore in fibrillazione. Nata in un laboratorio di Mosca nel 1951, scartata per un decennio come violazione del secondo principio, la reazione BZ è la prova più pulita che abbiamo che la chimica possa autorganizzarsi.",
    ctaInteractive: "Apri l'Esploratore",
    sections: [],
  },
  encounter: {
    pretitle: "Primo incontro",
    title: "Tre sostanze. Un ritmo testardo.",
    cards: [
      {
        label: "01",
        title: "L'idea centrale",
        body: "Versa tre sostanze in una beuta nel giusto rapporto e la soluzione si rifiuta di acquietarsi. Pulsa: gialla, trasparente, gialla, trasparente, battito dopo battito, per un'ora o più. Stendi la stessa miscela in strato sottile su una piastra di Petri e compaiono spirali rotanti dal nulla, che rotolano verso l'esterno come una tempesta lenta e silenziosa. Una pila di molecole inerti si è organizzata in un orologio e in un disegno, senza alcun metronomo esterno a dirle cosa fare.",
      },
      {
        label: "02",
        title: "Un esempio concreto",
        body: "Nel 1951 il biochimico sovietico Boris Belousov cercava di modellare il ciclo di Krebs in un becher. La sua miscela divenne gialla, poi incolore, poi di nuovo gialla — e non si fermava. Due riviste respinsero il suo articolo come ovvia sciocchezza: ogni chimico sapeva che le reazioni andavano in una sola direzione, verso l'equilibrio. Lo archiviò. Dieci anni dopo Anatol Zhabotinsky, dottorando a Mosca, riprodusse ed estese la reazione, e la comunità chimica finì per ammettere che Belousov aveva avuto ragione fin dall'inizio.",
      },
      {
        label: "03",
        title: "Perché conta",
        body: "La reazione BZ fu la prima dimostrazione di laboratorio inequivocabile che un sistema chimico può organizzarsi spontaneamente nel tempo e nello spazio, lontano dall'equilibrio. Le stesse equazioni che governano le sue spirali governano anche le onde a spirale della fibrillazione cardiaca, gli anelli di aggregazione delle muffe mucillaginose e le eccitazioni rotanti sulla corteccia durante l'epilessia. Ilya Prigogine vinse il Nobel 1977 per la teoria sottostante delle strutture dissipative. La chimica arrivò prima; la matematica venne dopo a spiegarla.",
      },
    ],
    tryIt:
      "Sotto: una serie temporale dell'Oregonator, poi un piccolo campo di reazione-diffusione in cui puoi piantare difetti e vedere formarsi spirali.",
  },
  sections: [
    {
      pretitle: "Sezione 01 · La ricetta",
      title: "Bromato, acido malonico, cerio — e acido",
      body: "La miscela BZ classica sono pochi millimoli di bromato di potassio (BrO₃⁻) e acido malonico (CH₂(COOH)₂), una traccia di cerio (Ce³⁺/Ce⁴⁺) o ferroina come catalizzatore, tutto disciolto in acido solforico 1 M. Il bromato è l'ossidante, l'acido malonico il combustibile organico, il metallo un indicatore che cambia colore e svela il proprio stato d'ossidazione. In una beuta agitata il colore cambia ogni pochi secondi; in un sottile film non agitato, la stessa chimica dipinge onde concentriche e spirali attraverso il piatto.",
    },
    {
      pretitle: "Sezione 02 · I due regimi",
      title: "Un impulso d'ossidazione, spento dal bromuro",
      body: "Il ciclo alterna due regimi, regolati dalla concentrazione locale di bromuro. Quando [Br⁻] è abbastanza alta, intercetta qualsiasi HBrO₂ in crescita prima che possa autocatalizzarsi, e il metallo resta ridotto. Quando l'acido malonico consuma il bromuro sotto una soglia critica, il freno cede: HBrO₂ corre via in modo esponenziale, ossidando il metallo in un lampo improvviso. Il metallo ossidato rigenera poi Br⁻ tramite una reazione secondaria con l'acido bromomalonico, il freno torna, e il ciclo riparte. Un oscillatore chimico a rilassamento, che ticchetta da sé.",
    },
    {
      pretitle: "Sezione 03 · Field, Körös, Noyes (1972)",
      title: "Undici passi elementari, un meccanismo funzionante",
      body: "Nei primi anni 1970 Richard Field, Endre Körös e Richard Noyes a Oregon avevano distillato il caos degli intermedi in un meccanismo concreto a undici reazioni — il meccanismo FKN. Identificava in modo pulito HBrO₂ come l'interruttore autocatalitico, Br⁻ come l'inibitore a cui dover sfuggire e l'anello Ce(IV) → Ce(III) che produceva bromuro fresco. L'articolo FKN trasformò BZ da curiosità in sistema da manuale: la prima reazione oscillante complessa di cui ogni passo poteva essere scritto.",
    },
    {
      pretitle: "Sezione 04 · L'Oregonator (1974)",
      title: "Tre variabili, una caricatura fedele",
      body: "Un anno dopo Field e Noyes pubblicarono un'astrazione minimale a tre variabili dell'FKN — l'Oregonator. In forma adimensionale: ε ẋ = q y − x y + x(1−x), ε′ ẏ = −q y − x y + f z, ż = x − z, con x ∼ HBrO₂, y ∼ Br⁻ e z ∼ il catalizzatore ossidato. Un ε piccolo fa scattare l'attivatore x; q è la forza dell'inibizione incrociata. Aggiungi un termine laplaciano a ogni riga e le stesse equazioni fanno crescere bersagli concentrici e spirali rotanti su un piatto. Tre numeri e una ODE rigida — e hai un orologio chimico funzionante.",
    },
    {
      pretitle: "Sezione 05 · Struttura spaziale",
      title: "Bersagli, spirali, simmetria rotta",
      body: "Smetti di agitare e versa la miscela in strato sottile. Qualche granello di polvere innesca onde a bersaglio concentriche; un minimo taglio rompe uno dei fronti d'onda e le estremità aperte si arrotolano in una coppia di spirali controrotanti. Ogni punta di spirale ruota a frequenza fissa, più rapida di qualsiasi bersaglio — le spirali vincono sempre, spazzando il piatto in un caleidoscopio di rotori. Arthur Winfree passò gli anni 1970 a fotografare queste punte, a disegnarne la topologia e a sostenere che gli stessi rotori incendiano un cuore in fibrillazione.",
    },
    {
      pretitle: "Sezione 06 · Connessioni",
      title: "Cuori, muffe, neuroni, orologi biologici",
      body: "Le spirali BZ si sono rivelate la firma universale dei mezzi eccitabili. Le stesse equazioni descrivono onde di rientro a spirale nel tessuto cardiaco (Winfree, Keener), onde di aggregazione nelle Dictyostelium che rispondono a impulsi di cAMP (Tomchik e Devreotes), depressione corticale propagata nell'emicrania e onde di popolazione in ecosistemi preda-predatore. La lezione Nobel di Prigogine del 1977 usava la beuta BZ come esempio canonico di struttura dissipativa: ordine pagato da un flusso costante di energia libera. La chimica era diventata una lingua universale.",
    },
  ],
  oregonator: {
    caption: "Interattivo · serie temporale dell'Oregonator",
    epsilonLabel: "ε · rigidità dell'attivatore",
    qLabel: "q · inibizione",
    resetLabel: "Reset",
    pauseLabel: "Pausa",
    playLabel: "Vai",
    legendLabel: "Tracce",
    note: "Oregonator a tre variabili integrato con piccoli passi di Eulero in avanti. ε regola quanto bruscamente si accende l'attivatore x; q regola l'inibizione del bromuro. Spingi ε troppo lontano e i picchi si fondono in oscillazione liscia; abbassa q sotto ~1e−4 e il freno del bromuro si arrende.",
    pretitle: "Interattivo · l'orologio chimico",
    title: "Guarda danzare le tre concentrazioni",
    body: "Le stesse tre variabili — x ∼ HBrO₂, y ∼ Br⁻, z ∼ Ce⁴⁺ — che Field e Noyes scrissero nel 1974, in tempo reale. Lenta salita dell'attivatore, accensione netta, lampo di catalizzatore ossidato, il freno del bromuro recupera, il sistema si ricarica. Un orologio fatto di sola cinetica.",
  },
  spiral: {
    caption: "Interattivo · mezzo eccitabile 2D",
    resetLabel: "Reset",
    plantLabel: "Pianta un difetto",
    pauseLabel: "Pausa",
    playLabel: "Vai",
    note: "Riduzione di Barkley della famiglia FitzHugh-Nagumo / Oregonator su una griglia 180×140 con bordo toroidale. Premi Pianta un difetto un paio di volte per nucleare nuove spirali; ogni rotore trascinerà poi il resto del campo nel proprio ritmo.",
    pretitle: "Interattivo · coltiva una spirale",
    title: "Spezza un fronte d'onda, guarda il rotore agganciarsi",
    body: "Un mezzo eccitabile ha solo due stati: riposo e breve eccitazione, separati da una coda refrattaria. Manda un'onda dentro e si propaga senza dispersione. Spezza un singolo fronte d'onda e l'estremità aperta si arrotola — è la forma universale su cui si assesta ogni mezzo eccitabile, dalla piastra di Petri al ventricolo in fibrillazione. La demo spaziale usa la riduzione a due variabili di Barkley della stessa famiglia di reazione-diffusione — produce le stesse spirali senza integrare l'intero sistema rigido dell'Oregonator.",
  },
  closingPretitle: "Vai oltre",
  closingTitle: "Agita il piatto.",
  closingBody:
    "L'Esploratore fa girare un automa cellulare Hodgepodge, una griglia eccitabile in stile Greenberg-Hastings dove ogni cella è sana, infetta o malata. Tre cursori modellano il ritmo: k1 (peso delle vicine infette), k2 (peso delle vicine malate) e g (tasso di reazione). Scegli una delle quattro palette, carica un preset, riparti dal rumore casuale o semina una spirale pulita, e guarda i rotori impadronirsi di tutto il campo.",
  ctaLabel: "→ Apri l'Esploratore",
};

// ---------- Portuguese ----------
const pt: RichStory = {
  page: {
    pretitle: "Tema · Caos · Auto-organização",
    title: "A reação de Belousov-Zhabotinsky",
    tagline: "Um relógio químico que desenha espirais.",
    intro:
      "Mistura bromato, ácido malónico e um catalisador de cério em ácido sulfúrico diluído. O balão recusa-se a sossegar — pulsa entre cores como um batimento cardíaco. Espalha a mesma mistura em camada fina numa caixa de Petri e aparecem espirais rotativas, as mesmas formas que percorrem um coração em fibrilhação. Nascida num laboratório de Moscovo em 1951, descartada durante uma década como violação da segunda lei, a reação BZ é a prova mais limpa que temos de que a química se pode auto-organizar.",
    ctaInteractive: "Abrir o Explorador",
    sections: [],
  },
  encounter: {
    pretitle: "Primeiro encontro",
    title: "Três químicos. Um ritmo teimoso.",
    cards: [
      {
        label: "01",
        title: "A ideia central",
        body: "Despeja três químicos num balão na proporção certa e a solução recusa-se a sossegar. Pulsa: amarelo, transparente, amarelo, transparente, batimento após batimento, durante uma hora ou mais. Espalha a mesma mistura em camada fina numa caixa de Petri e aparecem espirais rotativas do nada, a rolar para fora como uma tempestade lenta e silenciosa. Uma pilha de moléculas inertes organizou-se em relógio e em padrão, sem qualquer metrónomo externo a dizer-lhe o que fazer.",
      },
      {
        label: "02",
        title: "Um exemplo concreto",
        body: "Em 1951 o bioquímico soviético Boris Belousov tentava modelar o ciclo de Krebs num copo. A sua mistura ficou amarela, depois incolor, depois amarela outra vez — e não parava. Duas revistas rejeitaram o artigo como disparate óbvio: todo o químico sabia que as reações iam num único sentido, rumo ao equilíbrio. Arquivou-o. Dez anos depois Anatol Zhabotinsky, doutorando em Moscovo, reproduziu e estendeu a reação, e a comunidade química acabou por admitir que Belousov sempre tivera razão.",
      },
      {
        label: "03",
        title: "Porque importa",
        body: "A reação BZ foi a primeira demonstração inequívoca, em laboratório, de que um sistema químico pode organizar-se espontaneamente no tempo e no espaço, longe do equilíbrio. As mesmas equações que governam as suas espirais governam também as ondas em espiral da fibrilhação cardíaca, os anéis de agregação dos bolores mucilaginosos e as excitações rotativas no córtex durante a epilepsia. Ilya Prigogine ganhou o Nobel de 1977 pela teoria subjacente das estruturas dissipativas. A química chegou primeiro; a matemática veio depois para a explicar.",
      },
    ],
    tryIt:
      "Abaixo: uma série temporal do Oregonator, depois um pequeno campo de reação-difusão onde podes plantar defeitos e ver formarem-se espirais.",
  },
  sections: [
    {
      pretitle: "Secção 01 · A receita",
      title: "Bromato, ácido malónico, cério — e ácido",
      body: "A mistura BZ clássica são uns milimoles de bromato de potássio (BrO₃⁻) e ácido malónico (CH₂(COOH)₂), com um vestígio de cério (Ce³⁺/Ce⁴⁺) ou ferroína como catalisador, tudo dissolvido em ácido sulfúrico 1 M. O bromato é o oxidante, o ácido malónico o combustível orgânico, o metal um indicador que muda de cor e denuncia o seu estado de oxidação. Num balão agitado a cor cicla a cada poucos segundos; num filme fino não agitado, a mesma química pinta ondas concêntricas e espirais pela caixa.",
    },
    {
      pretitle: "Secção 02 · Os dois regimes",
      title: "Um pulso de oxidação, abafado pelo brometo",
      body: "O ciclo alterna entre dois regimes, controlados pela concentração local de brometo. Quando [Br⁻] está suficientemente alta, capta qualquer HBrO₂ em crescimento antes que ele possa autocatalisar-se, e o metal fica reduzido. Quando o ácido malónico come o brometo abaixo de um limiar crítico, o travão falha: HBrO₂ dispara exponencialmente e oxida o metal num clarão súbito. O metal oxidado regenera então Br⁻ por uma reação secundária com o ácido bromomalónico, o travão volta, e o ciclo recomeça. Um oscilador químico de relaxação, a marcar sozinho.",
    },
    {
      pretitle: "Secção 03 · Field, Körös, Noyes (1972)",
      title: "Onze passos elementares, um mecanismo a funcionar",
      body: "No início dos anos 1970 Richard Field, Endre Körös e Richard Noyes em Oregon tinham destilado o caos dos intermediários num mecanismo concreto de onze reações — o mecanismo FKN. Identificava com limpeza HBrO₂ como o interruptor autocatalítico, Br⁻ como o inibidor que ele tinha de ultrapassar e o ciclo Ce(IV) → Ce(III) que produzia brometo fresco. O artigo FKN transformou BZ de curiosidade em sistema de manual: a primeira reação oscilante complexa em que cada passo podia ser escrito.",
    },
    {
      pretitle: "Secção 04 · O Oregonator (1974)",
      title: "Três variáveis, uma caricatura fiel",
      body: "Um ano depois Field e Noyes publicaram uma abstração mínima de três variáveis do FKN — o Oregonator. Na forma adimensional: ε ẋ = q y − x y + x(1−x), ε′ ẏ = −q y − x y + f z, ż = x − z, com x ∼ HBrO₂, y ∼ Br⁻ e z ∼ o catalisador oxidado. Um ε pequeno faz o activador x estalar; q é a força da inibição cruzada. Acrescenta um termo laplaciano a cada linha e as mesmas equações fazem crescer alvos concêntricos e espirais rotativas numa placa. Três números e uma EDO rígida — e tens um relógio químico a funcionar.",
    },
    {
      pretitle: "Secção 05 · Estrutura espacial",
      title: "Alvos, espirais, simetria quebrada",
      body: "Para de agitar e despeja a mistura em camada fina. Uns grãos de pó arrancam ondas-alvo concêntricas; um pequeno corte parte uma das frentes de onda e as pontas abertas enrolam-se num par de espirais a girar em sentidos opostos. Cada ponta de espiral roda a uma frequência fixa, maior do que a de qualquer alvo — as espirais ganham sempre e varrem a caixa num caleidoscópio de rotores. Arthur Winfree passou os anos 1970 a fotografar estas pontas, a esboçar a sua topologia e a argumentar que os mesmos rotores pegam fogo a um coração em fibrilhação.",
    },
    {
      pretitle: "Secção 06 · Ligações",
      title: "Corações, bolores, neurónios, relógios biológicos",
      body: "As espirais BZ vieram a ser a assinatura universal dos meios excitáveis. As mesmas equações descrevem ondas de reentrada em espiral no tecido cardíaco (Winfree, Keener), ondas de agregação em Dictyostelium a responder a pulsos de cAMP (Tomchik e Devreotes), depressão cortical alastrante na enxaqueca e ondas de população em ecossistemas predador-presa. A conferência Nobel de Prigogine em 1977 usou o balão BZ como exemplo canónico de estrutura dissipativa: ordem paga por um fluxo contínuo de energia livre. A química tinha-se tornado língua universal.",
    },
  ],
  oregonator: {
    caption: "Interativo · série temporal do Oregonator",
    epsilonLabel: "ε · rigidez do ativador",
    qLabel: "q · inibição",
    resetLabel: "Repor",
    pauseLabel: "Pausa",
    playLabel: "Jogar",
    legendLabel: "Traços",
    note: "Oregonator de três variáveis integrado com pequenos passos de Euler em frente. ε controla a brusquidão com que o ativador x se acende; q afina a inibição do brometo. Empurra demasiado ε e os picos esborratam-se em oscilação suave; puxa q abaixo de ~1e−4 e o travão do brometo desiste.",
    pretitle: "Interativo · o relógio químico",
    title: "Vê dançar as três concentrações",
    body: "As mesmas três variáveis — x ∼ HBrO₂, y ∼ Br⁻, z ∼ Ce⁴⁺ — que Field e Noyes escreveram em 1974, a evoluir em tempo real. Subida lenta do ativador, ignição brusca, clarão de catalisador oxidado, o travão do brometo a recuperar, o sistema a recarregar. Um relógio feito só de cinética.",
  },
  spiral: {
    caption: "Interativo · meio excitável 2D",
    resetLabel: "Repor",
    plantLabel: "Plantar defeito",
    pauseLabel: "Pausa",
    playLabel: "Jogar",
    note: "Redução de Barkley da família FitzHugh-Nagumo / Oregonator numa grelha 180×140 com fronteira toroidal. Carrega Plantar defeito duas ou três vezes para nuclear espirais novas; cada rotor arrasta depois o resto do campo para o seu próprio ritmo.",
    pretitle: "Interativo · faz crescer uma espiral",
    title: "Quebra uma frente de onda, vê o rotor encaixar",
    body: "Um meio excitável só tem dois estados: repouso e excitação breve, separados por uma cauda refractária. Manda uma onda lá dentro e propaga-se sem dispersão. Parte uma única frente de onda e a ponta aberta enrola-se — é a forma universal em que cada meio excitável assenta, da placa de Petri ao ventrículo em fibrilhação. A demo espacial usa a redução de duas variáveis de Barkley da mesma família de reação-difusão — produz as mesmas espirais sem integrar o sistema rígido completo do Oregonator.",
  },
  closingPretitle: "Vai mais longe",
  closingTitle: "Mexe a caixa.",
  closingBody:
    "O Explorador corre um autómato celular Hodgepodge, uma grelha excitável ao estilo Greenberg-Hastings onde cada célula está saudável, infetada ou doente. Três deslizadores moldam o ritmo: k1 (peso das vizinhas infetadas), k2 (peso das vizinhas doentes) e g (taxa de reação). Escolhe uma de quatro paletas, carrega uma predefinição, reinicia a partir de ruído aleatório ou semeia uma espiral limpa, e vê os rotores tomar conta de todo o campo.",
  ctaLabel: "→ Abrir o Explorador",
};

// ---------- Swedish ----------
const sv: RichStory = {
  page: {
    pretitle: "Ämne · Kaos · Självorganisering",
    title: "Belousov-Zhabotinsky-reaktionen",
    tagline: "En kemisk klocka som ritar spiraler.",
    intro:
      "Blanda bromat, malonsyra och en ceriumkatalysator i utspädd svavelsyra. Kolven vägrar lugna ner sig — den pulserar genom färgerna som ett hjärtslag. Häll samma blandning i ett tunt lager på en petriskål och roterande spiraler dyker upp, exakt de former som rusar genom ett flimrande hjärta. Född i ett Moskvalaboratorium 1951, avfärdad i ett decennium som ett brott mot andra huvudsatsen, är BZ-reaktionen det renaste beviset vi har på att kemi kan organisera sig själv.",
    ctaInteractive: "Öppna utforskaren",
    sections: [],
  },
  encounter: {
    pretitle: "Första mötet",
    title: "Tre ämnen. En envis takt.",
    cards: [
      {
        label: "01",
        title: "Den stora idén",
        body: "Häll tre ämnen i en kolv i rätt förhållande och lösningen vägrar lugna ner sig. Den pulserar: gul, klar, gul, klar, slag efter slag, en timme eller mer. Bred ut samma blandning tunt på en petriskål och roterande spiraler dyker upp ur ingenting och rullar utåt som en långsam, tyst storm. En hög med tröga molekyler har organiserat sig till en klocka och ett mönster, utan någon yttre metronom som säger vad de ska göra.",
      },
      {
        label: "02",
        title: "Ett konkret exempel",
        body: "1951 försökte den sovjetiske biokemisten Boris Belousov modellera Krebs-cykeln i en bägare. Hans blandning blev gul, sedan färglös, sedan gul igen — och slutade inte. Två tidskrifter avvisade hans artikel som uppenbart nonsens: varje kemist visste att reaktioner gick åt ett håll, mot jämvikt. Han la den i lådan. Tio år senare reproducerade och utvidgade Anatol Zjabotinskij, doktorand i Moskva, reaktionen, och kemikåren fick långsamt erkänna att Belousov hade haft rätt hela tiden.",
      },
      {
        label: "03",
        title: "Varför det betyder något",
        body: "BZ-reaktionen var den första entydiga laboratoriedemonstrationen av att ett kemiskt system spontant kan organisera sig i tid och rum, långt från jämvikt. Samma ekvationer som styr dess spiraler styr också spiralvågorna vid kammarflimmer, aggregationsringarna hos slemsvampar och de roterande exciteringarna på hjärnbarken under epilepsi. Ilya Prigogine fick Nobelpriset 1977 för den underliggande teorin om dissipativa strukturer. Kemin kom först; matematiken kom senare för att förklara den.",
      },
    ],
    tryIt:
      "Nedan: en tidsserie från Oregonatorn, sedan ett litet reaktions-diffusionsfält där du kan plantera defekter och se spiraler bildas.",
  },
  sections: [
    {
      pretitle: "Avsnitt 01 · Receptet",
      title: "Bromat, malonsyra, cerium — och syra",
      body: "Den klassiska BZ-blandningen är några millimol kaliumbromat (BrO₃⁻) och malonsyra (CH₂(COOH)₂), med en spårmängd cerium (Ce³⁺/Ce⁴⁺) eller ferroin som katalysator, allt löst i 1 M svavelsyra. Bromatet är oxidationsmedlet, malonsyran det organiska bränslet, metallen en färgskiftande indikator som avslöjar sitt eget oxidationstillstånd. I en omrörd kolv cyklar färgen var några sekund; i en tunn oomrörd film målar samma kemi koncentriska och spiralformade vågor över skålen.",
    },
    {
      pretitle: "Avsnitt 02 · De två regimerna",
      title: "En oxidationspuls, släckt av bromid",
      body: "Cykeln växlar mellan två regimer, styrda av den lokala bromidkoncentrationen. När [Br⁻] är tillräckligt hög fångar den in varje växande HBrO₂ innan det kan autokatalysera, och metallen förblir reducerad. När malonsyran äter bromiden under ett kritiskt tröskelvärde brister bromsen: HBrO₂ skenar exponentiellt och oxiderar metallen i en plötslig blixt. Den oxiderade metallen regenererar sedan Br⁻ via en sidoreaktion med brommalonsyra, bromsen återkommer, och cykeln börjar om. En kemisk relaxationsoscillator som tickar av sig själv.",
    },
    {
      pretitle: "Avsnitt 03 · Field, Körös, Noyes (1972)",
      title: "Elva elementarsteg, en fungerande mekanism",
      body: "I början av 1970-talet hade Richard Field, Endre Körös och Richard Noyes i Oregon destillerat kaoset av mellansteg till en konkret elvareaktionsmekanism — FKN-mekanismen. Den identifierade rent HBrO₂ som den autokatalytiska brytaren, Br⁻ som den inhibitor det måste springa ifrån och Ce(IV) → Ce(III)-slingan som producerade färskt bromid. FKN-artikeln gjorde BZ från kuriosa till läroboksexempel: den första komplexa oscillerande reaktion där varje steg kunde skrivas ned.",
    },
    {
      pretitle: "Avsnitt 04 · Oregonatorn (1974)",
      title: "Tre variabler, en trogen karikatyr",
      body: "Ett år senare publicerade Field och Noyes en minimal trevariabel-abstraktion av FKN — Oregonatorn. I dimensionslös form: ε ẋ = q y − x y + x(1−x), ε′ ẏ = −q y − x y + f z, ż = x − z, med x ∼ HBrO₂, y ∼ Br⁻ och z ∼ den oxiderade katalysatorn. Litet ε får aktivatorn x att slå till; q är styrkan på korsinhiberingen. Lägg till en laplaceterm i varje rad och samma ekvationer låter målmönster och roterande spiraler växa på en platta. Tre tal och en styv ODE — och du har en fungerande kemisk klocka.",
    },
    {
      pretitle: "Avsnitt 05 · Rumslig struktur",
      title: "Målmönster, spiraler, bruten symmetri",
      body: "Sluta röra och häll blandningen tunt. Några dammkorn startar koncentriska målvågor; en pytteliten skjuvning bryter en av vågfronterna och de öppna ändarna rullar ihop sig till ett par motroterande spiraler. Varje spiralspets roterar med en fast frekvens som är högre än något måls — spiralerna vinner alltid och sopar skålen till ett kalejdoskop av rotorer. Arthur Winfree tillbringade 1970-talet med att fotografera dessa spetsar, skissa deras topologi och argumentera för att samma rotorer tänder eld på ett flimrande hjärta.",
    },
    {
      pretitle: "Avsnitt 06 · Förbindelser",
      title: "Hjärtan, slemsvampar, neuroner, biologiska klockor",
      body: "BZ-spiralerna visade sig vara den universella signaturen för excitabla medier. Samma ekvationer beskriver spiralreentrantvågor i hjärtvävnad (Winfree, Keener), aggregationsvågor hos Dictyostelium som svarar på cAMP-pulser (Tomchik och Devreotes), spridande depression på hjärnbarken vid migrän och populationsvågor i bytesdjursekosystem. Prigogines Nobelföreläsning 1977 använde BZ-kolven som det kanoniska exemplet på en dissipativ struktur: ordning betald av ett stadigt flöde av fri energi. Kemin hade blivit ett universellt språk.",
    },
  ],
  oregonator: {
    caption: "Interaktivt · Oregonator-tidsserie",
    epsilonLabel: "ε · aktivatorstyvhet",
    qLabel: "q · inhibering",
    resetLabel: "Återställ",
    pauseLabel: "Paus",
    playLabel: "Spela",
    legendLabel: "Spår",
    note: "Trevariabel-Oregonator integrerad med små framåt-Eulersteg. ε styr hur skarpt aktivatorn x tänder; q ställer in bromidinhiberingen. Trycker du ε för långt suddar topparna ut till mjuk svängning; drar du q under ~1e−4 ger bromidbromsen upp.",
    pretitle: "Interaktivt · den kemiska klockan",
    title: "Se de tre koncentrationerna dansa",
    body: "Samma tre variabler — x ∼ HBrO₂, y ∼ Br⁻, z ∼ Ce⁴⁺ — som Field och Noyes skrev ned 1974, i realtid. Långsam ökning av aktivatorn, skarp tändning, blixt av oxiderad katalysator, bromidbromsen kommer ifatt, systemet laddar om. En klocka byggd av ren kinetik.",
  },
  spiral: {
    caption: "Interaktivt · 2D excitabelt medium",
    resetLabel: "Återställ",
    plantLabel: "Plantera defekt",
    pauseLabel: "Paus",
    playLabel: "Spela",
    note: "Barkley-reduktion av FitzHugh-Nagumo / Oregonator-familjen på ett 180×140-rutnät med toroidkant. Tryck Plantera defekt ett par gånger för att nukleera nya spiraler; varje rotor drar sedan resten av fältet in i sin egen takt.",
    pretitle: "Interaktivt · odla en spiral",
    title: "Bryt en vågfront, se rotorn fästa",
    body: "Ett excitabelt medium har bara två tillstånd: vila och kort excitering, åtskilda av en refraktär svans. Skicka en våg genom det och den propagerar utan dispersion. Bryt en enda vågfront och den öppna änden rullar ihop sig — det är den universella form som varje excitabelt medium hamnar i, från en petriskål till en flimrande hjärtkammare. Den rumsliga demon använder Barkleys tvåvariabelreduktion av samma reaktions-diffusionsfamilj — den ger samma spiraler utan att integrera hela det styva Oregonator-systemet.",
  },
  closingPretitle: "Gå vidare",
  closingTitle: "Rör om skålen.",
  closingBody:
    "Utforskaren kör en Hodgepodge-cellulär automat, ett excitabelt rutnät i Greenberg-Hastings-stil där varje cell är frisk, infekterad eller sjuk. Tre reglage formar takten: k1 (vikt för infekterade grannar), k2 (vikt för sjuka grannar) och g (reaktionshastighet). Välj en av fyra färgpaletter, ladda en förinställning, starta om från slumpbrus eller så en ren spiral, och se rotorerna ta över hela fältet.",
  ctaLabel: "→ Öppna utforskaren",
};

// ---------- Norwegian ----------
const no: RichStory = {
  page: {
    pretitle: "Tema · Kaos · Selvorganisering",
    title: "Belousov-Zhabotinsky-reaksjonen",
    tagline: "En kjemisk klokke som tegner spiraler.",
    intro:
      "Bland bromat, malonsyre og en ceriumkatalysator i fortynnet svovelsyre. Kolben nekter å roe seg — den pulserer gjennom fargene som et hjerteslag. Hell den samme blandingen tynt på en petriskål, og roterende spiraler dukker opp, akkurat de samme formene som farer gjennom et flimrende hjerte. Født i et Moskva-laboratorium i 1951, avskrevet i et tiår som et brudd på andre lov, er BZ-reaksjonen det reneste beviset vi har på at kjemi kan organisere seg selv.",
    ctaInteractive: "Åpne utforskeren",
    sections: [],
  },
  encounter: {
    pretitle: "Første møte",
    title: "Tre stoffer. En sta takt.",
    cards: [
      {
        label: "01",
        title: "Den store ideen",
        body: "Hell tre stoffer i en kolbe i riktig forhold, og løsningen nekter å roe seg. Den pulserer: gul, klar, gul, klar, slag etter slag, i en time eller mer. Bre den samme blandingen tynt utover en petriskål, og roterende spiraler dukker opp ut av ingenting og ruller utover som en langsom, taus storm. En haug av trege molekyler har organisert seg til en klokke og et mønster, uten noen ytre metronom som forteller dem hva de skal gjøre.",
      },
      {
        label: "02",
        title: "Et konkret eksempel",
        body: "I 1951 prøvde den sovjetiske biokjemikeren Boris Belousov å modellere Krebs-syklusen i et beger. Blandingen ble gul, så fargeløs, så gul igjen — og sluttet ikke. To tidsskrifter avviste artikkelen hans som åpenbart tøv: enhver kjemiker visste at reaksjoner gikk én vei, mot likevekt. Han la den i skuffen. Ti år senere reproduserte og utvidet Anatol Zjabotinskij, doktorgradsstudent i Moskva, reaksjonen, og kjemimiljøet måtte sakte innrømme at Belousov hadde hatt rett hele tiden.",
      },
      {
        label: "03",
        title: "Hvorfor det betyr noe",
        body: "BZ-reaksjonen var den første utvetydige laboratoriedemonstrasjonen av at et kjemisk system spontant kan organisere seg i tid og rom, langt fra likevekt. De samme ligningene som styrer spiralene styrer også spiralbølgene ved hjerteflimmer, aggregeringsringene hos slimsopp og de roterende exciteringene i hjernebarken under epilepsi. Ilya Prigogine fikk Nobelprisen i 1977 for den underliggende teorien om dissipative strukturer. Kjemien kom først; matematikken kom senere for å forklare den.",
      },
    ],
    tryIt:
      "Under: en Oregonator-tidsserie, så et lite reaksjons-diffusjonsfelt der du kan plante defekter og se spiraler dannes.",
  },
  sections: [
    {
      pretitle: "Avsnitt 01 · Oppskriften",
      title: "Bromat, malonsyre, cerium — og syre",
      body: "Den klassiske BZ-blandingen er noen millimol kaliumbromat (BrO₃⁻) og malonsyre (CH₂(COOH)₂), med et spor av cerium (Ce³⁺/Ce⁴⁺) eller ferroin som katalysator, alt løst i 1 M svovelsyre. Bromatet er oksidasjonsmiddelet, malonsyren det organiske drivstoffet, metallet en fargeskiftende indikator som røper sin egen oksidasjonstilstand. I en rørt kolbe sykler fargen hvert par sekund; i en tynn, urørt film maler den samme kjemien konsentriske og spiralformede bølger over skålen.",
    },
    {
      pretitle: "Avsnitt 02 · De to regimene",
      title: "En oksidasjonspuls, slukket av bromid",
      body: "Syklusen veksler mellom to regimer, styrt av den lokale bromidkonsentrasjonen. Når [Br⁻] er høy nok, fanger den enhver voksende HBrO₂ før den får autokatalysert, og metallet forblir redusert. Når malonsyren spiser bromidet under en kritisk terskel, svikter bremsen: HBrO₂ stikker av eksponentielt og oksiderer metallet i et plutselig glimt. Det oksiderte metallet regenererer så Br⁻ via en sidereaksjon med brommalonsyre, bremsen kommer tilbake, og syklusen starter på nytt. En kjemisk relaksasjonsoscillator som tikker av seg selv.",
    },
    {
      pretitle: "Avsnitt 03 · Field, Körös, Noyes (1972)",
      title: "Elleve elementærtrinn, en fungerende mekanisme",
      body: "På begynnelsen av 1970-tallet hadde Richard Field, Endre Körös og Richard Noyes i Oregon destillert kaoset av mellomtrinn til en konkret ellevereaksjonsmekanisme — FKN-mekanismen. Den identifiserte rent HBrO₂ som den autokatalytiske bryteren, Br⁻ som inhibitoren den måtte løpe fra, og Ce(IV) → Ce(III)-løkken som produserte ferskt bromid. FKN-artikkelen gjorde BZ fra kuriositet til lærebokseksempel: den første komplekse oscillerende reaksjonen der hvert trinn kunne skrives ned.",
    },
    {
      pretitle: "Avsnitt 04 · Oregonatoren (1974)",
      title: "Tre variabler, en trofast karikatur",
      body: "Et år senere publiserte Field og Noyes en minimal tre-variabel-abstraksjon av FKN — Oregonatoren. På dimensjonsløs form: ε ẋ = q y − x y + x(1−x), ε′ ẏ = −q y − x y + f z, ż = x − z, med x ∼ HBrO₂, y ∼ Br⁻ og z ∼ den oksiderte katalysatoren. Lite ε får aktivatoren x til å smelle; q er styrken på krysshemmingen. Legg til en laplaceterm i hver linje, og de samme ligningene lar målmønstre og roterende spiraler vokse på en plate. Tre tall og en stiv ODE — og du har en fungerende kjemisk klokke.",
    },
    {
      pretitle: "Avsnitt 05 · Romlig struktur",
      title: "Målmønstre, spiraler, brutt symmetri",
      body: "Slutt å røre, og hell blandingen tynt utover. Noen støvkorn starter konsentriske målbølger; et bittelite skjær bryter en av bølgefrontene, og de åpne endene ruller seg sammen til et par motroterende spiraler. Hver spiraltipp roterer med fast frekvens som er høyere enn noe måls — spiralene vinner alltid og feier skålen til et kaleidoskop av rotorer. Arthur Winfree brukte 1970-tallet på å fotografere disse tippene, skissere topologien deres og argumentere for at de samme rotorene tenner et flimrende hjerte.",
    },
    {
      pretitle: "Avsnitt 06 · Sammenhenger",
      title: "Hjerter, slimsopp, nevroner, biologiske klokker",
      body: "BZ-spiralene viste seg å være den universelle signaturen til eksiterbare medier. De samme ligningene beskriver spiralreentrantbølger i hjertevev (Winfree, Keener), aggregeringsbølger hos Dictyostelium som svarer på cAMP-pulser (Tomchik og Devreotes), spredende depresjon i hjernebarken ved migrene og populasjonsbølger i rovdyr–byttedyr-økosystemer. Prigogines Nobelforedrag i 1977 brukte BZ-kolben som det kanoniske eksemplet på en dissipativ struktur: orden betalt av en jevn strøm av fri energi. Kjemien hadde blitt et universelt språk.",
    },
  ],
  oregonator: {
    caption: "Interaktivt · Oregonator-tidsserie",
    epsilonLabel: "ε · aktivatorstivhet",
    qLabel: "q · hemming",
    resetLabel: "Nullstill",
    pauseLabel: "Pause",
    playLabel: "Spill",
    legendLabel: "Spor",
    note: "Tre-variabel Oregonator integrert med små foroverrettede Euler-skritt. ε styrer hvor skarpt aktivatoren x tenner; q stiller bromidhemmingen. Skyver du ε for langt, smører toppene seg ut til myk svingning; trekker du q under ~1e−4, gir bromidbremsen opp.",
    pretitle: "Interaktivt · den kjemiske klokken",
    title: "Se de tre konsentrasjonene danse",
    body: "De samme tre variablene — x ∼ HBrO₂, y ∼ Br⁻, z ∼ Ce⁴⁺ — som Field og Noyes skrev ned i 1974, i sanntid. Sakte stigning av aktivatoren, skarp tenning, glimt av oksidert katalysator, bromidbremsen tar igjen, systemet lader om. En klokke laget av ren kinetikk.",
  },
  spiral: {
    caption: "Interaktivt · 2D eksiterbart medium",
    resetLabel: "Nullstill",
    plantLabel: "Plant defekt",
    pauseLabel: "Pause",
    playLabel: "Spill",
    note: "Barkley-reduksjon av FitzHugh-Nagumo / Oregonator-familien på et 180×140-rutenett med toroidalkant. Trykk Plant defekt et par ganger for å starte nye spiraler; hver rotor drar deretter resten av feltet inn i sin egen takt.",
    pretitle: "Interaktivt · dyrk en spiral",
    title: "Bryt en bølgefront, se rotoren feste seg",
    body: "Et eksiterbart medium har bare to tilstander: hvile og kort eksitering, atskilt av en refraktær hale. Send en bølge gjennom det, og den forplanter seg uten dispersjon. Bryt én bølgefront, og den åpne enden ruller seg sammen — det er den universelle formen ethvert eksiterbart medium ender i, fra en petriskål til et flimrende hjertekammer. Den romlige demoen bruker Barkleys tovariabel-reduksjon av samme reaksjons-diffusjonsfamilie — den gir de samme spiralene uten å integrere hele det stive Oregonator-systemet.",
  },
  closingPretitle: "Gå videre",
  closingTitle: "Rør om i skålen.",
  closingBody:
    "Utforskeren kjører en Hodgepodge-cellulær automat, et eksiterbart rutenett i Greenberg-Hastings-stil der hver celle er frisk, infisert eller syk. Tre glidere former takten: k1 (vekt for infiserte naboer), k2 (vekt for syke naboer) og g (reaksjonsrate). Velg en av fire fargepaletter, last en forhåndsinnstilling, start på nytt fra tilfeldig støy eller så en ren spiral, og se rotorene ta over hele feltet.",
  ctaLabel: "→ Åpne utforskeren",
};

const RICH_STORY: Record<Locale, RichStory> = {
  en,
  de,
  es,
  fr,
  it,
  pt,
  sv,
  no,
};

function EncounterCard({ label, title, body }: { label: string; title: string; body: string }) {
  return (
    <div className="glass hairline h-full space-y-3 rounded-2xl border p-6 transition-colors hover:border-signal-coral/40">
      <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>{label}</div>
      <h3 className="math-italic text-2xl leading-snug text-ink-100">{title}</h3>
      <p className="text-sm leading-relaxed text-ink-200">{body}</p>
    </div>
  );
}

export default function BzrStory() {
  const { locale } = useI18n();
  const story = RICH_STORY[locale];
  const page = story.page;
  const [sec0, sec1, sec2, sec3, sec4, sec5] = story.sections;

  return (
    <StoryPageShell
      page={page}
      ctaHref="/bzr/explorer"
      accent={ACCENT}
      borderAccent="border-signal-coral/70"
      bgAccent="bg-signal-coral/10"
      hoverAccent="hover:bg-signal-coral/20"
      gradient="from-signal-coral/10"
      formulaBadge="3 species · reaction + diffusion"
      formulaLatex={
        "\\varepsilon\\,\\dot{x} = q\\,y - x\\,y + x(1-x) \\qquad \\varepsilon'\\,\\dot{y} = -q\\,y - x\\,y + f\\,z \\qquad \\dot{z} = x - z"
      }
      finalLabel={story.closingTitle}
    >
      {/* Encounter — three layperson cards */}
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

      {/* Section 01 — the recipe */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec0!.pretitle}
          title={sec0!.title}
          body={sec0!.body}
          accent={ACCENT}
        />
        <Reveal delay={120}>
          <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-6">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              Recipe
            </div>
            <table className="w-full font-mono text-sm">
              <thead className="hairline border-b text-ink-300">
                <tr>
                  <th className="px-2 py-2 text-left text-[10px] uppercase tracking-widest">
                    Ingredient
                  </th>
                  <th className="px-2 py-2 text-left text-[10px] uppercase tracking-widest">
                    Role
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["BrO₃⁻ (bromate)", "Oxidiser. Drives the cycle forward."],
                  ["Br⁻ (bromide)", "Inhibitor. Switches the cycle off until it is consumed."],
                  ["Malonic acid", "Fuel. Reduced organic substrate, regenerates Br⁻."],
                  ["Ce³⁺/Ce⁴⁺ or ferroin", "Catalyst. Colour change tracks its oxidation state."],
                  ["H₂SO₄ (acid bath)", "Sets the protonation regime where oscillation lives."],
                ].map(([what, role]) => (
                  <tr key={what} className="border-b border-ink-700/30 last:border-0">
                    <td className="px-2 py-2 text-signal-amber">{what}</td>
                    <td className="px-2 py-2 text-ink-200">{role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </section>

      {/* Section 02 — two regimes */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec1!.pretitle}
          title={sec1!.title}
          body={sec1!.body}
          accent={ACCENT}
        />
        <Reveal delay={120}>
          <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-8 text-center">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              Bromide threshold
            </div>
            <div className="math-italic text-3xl leading-snug text-ink-100 md:text-4xl">
              [Br⁻] &gt; [Br⁻]<sub>crit</sub> &nbsp; ⇒ &nbsp; brake on
              <br />
              [Br⁻] &lt; [Br⁻]<sub>crit</sub> &nbsp; ⇒ &nbsp; HBrO₂ ignites
            </div>
            <p className="mx-auto max-w-xl text-sm leading-relaxed text-ink-300">
              The whole cycle hinges on a single concentration crossing a threshold. Cross it once
              and the medium snaps — then resets itself, ready to snap again.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Section 03 — FKN mechanism */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec2!.pretitle}
          title={sec2!.title}
          body={sec2!.body}
          accent={ACCENT}
        />
      </section>

      {/* INTERACTIVE 1 — Oregonator time series */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <Reveal>
          <div className="space-y-2 text-center">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {story.oregonator.pretitle}
            </div>
            <h2 className="math-italic text-3xl leading-tight md:text-4xl">
              {story.oregonator.title}
            </h2>
            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-ink-200">
              {story.oregonator.body}
            </p>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <BzrOregonator
            caption={story.oregonator.caption}
            epsilonLabel={story.oregonator.epsilonLabel}
            qLabel={story.oregonator.qLabel}
            resetLabel={story.oregonator.resetLabel}
            pauseLabel={story.oregonator.pauseLabel}
            playLabel={story.oregonator.playLabel}
            legendLabel={story.oregonator.legendLabel}
            note={story.oregonator.note}
          />
        </Reveal>
      </section>

      {/* Section 04 — Oregonator */}
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
              Oregonator · Field, Noyes 1974
            </div>
            <div className="math-italic text-2xl leading-relaxed text-ink-100 md:text-3xl">
              ε ẋ = q y − x y + x(1 − x)
              <br />
              ε′ ẏ = −q y − x y + f z
              <br />ż = x − z
            </div>
            <p className="mx-auto max-w-xl text-sm leading-relaxed text-ink-300">
              x ∼ HBrO₂, y ∼ Br⁻, z ∼ oxidised catalyst. Add Laplacian diffusion terms and the same
              equations grow spiral waves.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Section 05 — spatial structure */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec4!.pretitle}
          title={sec4!.title}
          body={sec4!.body}
          accent={ACCENT}
        />
      </section>

      {/* INTERACTIVE 2 — Spiral sim */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <Reveal>
          <div className="space-y-2 text-center">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {story.spiral.pretitle}
            </div>
            <h2 className="math-italic text-3xl leading-tight md:text-4xl">{story.spiral.title}</h2>
            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-ink-200">
              {story.spiral.body}
            </p>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <BzrSpiralSim
            caption={story.spiral.caption}
            resetLabel={story.spiral.resetLabel}
            plantLabel={story.spiral.plantLabel}
            pauseLabel={story.spiral.pauseLabel}
            playLabel={story.spiral.playLabel}
            note={story.spiral.note}
          />
        </Reveal>
      </section>

      {/* Section 06 — connections */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec5!.pretitle}
          title={sec5!.title}
          body={sec5!.body}
          accent={ACCENT}
        />
        <Reveal delay={120}>
          <div className="hairline mt-2 rounded-2xl border bg-ink-950/40 p-6 text-sm leading-relaxed text-ink-300">
            See also the{" "}
            <Link href="/turingpattern" className="text-signal-coral hover:underline">
              Turing patterns
            </Link>{" "}
            room — a parallel story about reaction-diffusion, told in stripes and spots instead of
            spirals.
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
            href="/bzr/explorer"
            className="inline-block rounded-full border border-signal-coral/70 bg-signal-coral/10 px-8 py-4 font-mono text-sm uppercase tracking-widest2 text-signal-coral transition-colors hover:bg-signal-coral/25"
          >
            {story.ctaLabel}
          </Link>
        </section>
      </Reveal>
    </StoryPageShell>
  );
}
