"use client";

import Link from "next/link";
import { StoryPageShell, StoryCard } from "@/components/StoryPageShell";
import { Reveal } from "@/components/Reveal";
import { useI18n } from "@/lib/i18n/context";
import { HilbertHotelInline } from "@/components/HilbertHotelInline";
import { HilbertHotelCardinality } from "@/components/HilbertHotelCardinality";
import type { Locale } from "@/lib/i18n/types";
import type { StoryPage } from "@/lib/i18n/stories";

const ACCENT = "text-signal-rose";

// --------------------------------------------------------------------------
// Hilbert's Hotel — long-form story page. The canonical hero (pretitle,
// title, tagline, intro, ctaInteractive) lives inside RICH_STORY[locale].page
// so the whole 8-locale bundle can be edited from a single file. The
// six body sections, the two encounter cards, and the captions for the
// two inline interactive widgets are authored here as well.
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
  closingTitle: string;
  closingBody: string;
  ctaLabel: string;
  // HilbertHotelInline labels
  inlineCaption: string;
  inlineOne: string;
  inlineK: string;
  inlineInfinite: string;
  inlineBuses: string;
  inlineReset: string;
  inlineFormulaLabel: string;
  inlineHint: string;
  inlineNewGuest: string;
  inlineExistingGuest: string;
  inlineBusGuest: string;
  inlineGapNote: string;
  // HilbertHotelCardinality labels
  cardinalityCaption: string;
  cardinalityDoubles: string;
  cardinalityPairs: string;
  cardinalityReals: string;
  cardinalitySlider: string;
  cardinalityHint: string;
  cardinalityCountable: string;
  cardinalityUncountable: string;
  cardinalityBijection: string;
  cardinalityNoBijection: string;
  // Section 05 prime-power table (the maths columns 2ⁿ / "2, 4, 8 …" stay literal)
  primeTableTitle: string;
  primeTableHeadWho: string;
  primeTableHeadRoom: string;
  primeTableHeadFirst: string;
  primeTableRowExisting: string;
  primeTableRowBus1: string;
  primeTableRowBus2: string;
  primeTableRowBus3: string;
  primeTableRowBusK: string;
  primeTableNote: string;
  // Section 06 link + closing CTA heading
  cantorLinkLabel: string;
  takeItFurther: string;
};

// ---------------- English ----------------
const en: RichStory = {
  page: {
    pretitle: "Topic · Paradox",
    title: "Hilbert's Hotel",
    tagline: "Always room for one more — even when full.",
    intro:
      "David Hilbert sketched the hotel in a 1924 Göttingen lecture; George Gamow carried it to the public in his 1947 book One, Two, Three… Infinity. Below: the four classical scenarios, animated, plus the moment infinity finally pushes back — Cantor's diagonal.",
    ctaInteractive: "→ Open the Explorer",
  },
  encounter: {
    pretitle: "First encounter",
    title: "A hotel with ℵ₀ rooms, every one already taken.",
    cards: [
      {
        label: "01",
        title: "The big idea",
        body: "Infinity is not a very large number — it is a different kind of size, with its own arithmetic. A 'full' infinite hotel can still absorb more guests because ℵ₀ + 1 = ℵ₀.",
      },
      {
        label: "02",
        title: "One new guest",
        body: "Ask every guest in room n to walk to room n+1. Nobody is kicked out, and room 1 falls vacant for the newcomer.",
      },
      {
        label: "03",
        title: "Why it matters",
        body: "Hilbert's 1924 thought experiment is the cleanest argument that infinite sets follow rules our finite intuition does not. It is also the prelude to Cantor's deeper shock: some infinities really are larger than others.",
      },
    ],
    tryIt: "Below: run the four shifts, then watch infinity outgrow the hotel.",
  },
  sections: [
    {
      pretitle: "Section 01 · Countably infinite",
      title: "Rooms 1, 2, 3, … forever",
      body: "The hotel has one room for every natural number — a guest in 1, a guest in 17, a guest in 10¹⁰⁰. Tonight every room is taken, yet 'full' is the wrong word: the cardinality of the guests is ℵ₀, and ℵ₀ is not a number you can fill up.",
    },
    {
      pretitle: "Section 02 · One new guest",
      title: "Shift n → n+1",
      body: "A traveller knocks. The manager broadcasts a single instruction: every guest, move from room n to room n+1. Nobody is displaced — there is always a higher-numbered room waiting — and room 1 falls vacant for the newcomer.",
    },
    {
      pretitle: "Section 03 · k new guests",
      title: "Shift n → n+k",
      body: "A coach arrives with k passengers. Send each existing guest from room n to room n+k. Rooms 1 through k empty out in one motion; the k newcomers walk straight in.",
    },
    {
      pretitle: "Section 04 · ℵ₀ new guests",
      title: "Shift n → 2n; the odd rooms open",
      body: "Now a countably infinite queue arrives. The manager sends each existing guest from room n to room 2n: every even room stays occupied and every odd room becomes free. The newcomers fill 1, 3, 5, 7, … — the equality ℵ₀ + ℵ₀ = ℵ₀, executed in one announcement.",
    },
    {
      pretitle: "Section 05 · ℵ₀ buses × ℵ₀ guests",
      title: "Prime powers absorb ℵ₀ × ℵ₀",
      body: "A fleet of ℵ₀ buses pulls up, each carrying ℵ₀ passengers. Send each existing guest n to room 2ⁿ, then send bus-k passenger m to room pₖᵐ, where pₖ is the k-th odd prime. The fundamental theorem of arithmetic guarantees no two guests collide — ℵ₀ × ℵ₀ = ℵ₀.",
    },
    {
      pretitle: "Section 06 · The uncountable bridge",
      title: "ℝ defeats the hotel",
      body: "Push one step further and the trick breaks. Cantor's 1891 diagonal argument shows that the real numbers in [0,1] cannot be listed even once — for any proposed enumeration, a new real differs from row n at the n-th digit. The reals are uncountable; the hotel is not big enough.",
    },
  ],
  closingTitle: "Open the Explorer.",
  closingBody:
    "Replay the four shifts, watch the prime-power assignment land bus by bus, then cross over to Cantor's diagonal and see why this particular trick stops working.",
  ctaLabel: "→ Open the Explorer",
  inlineCaption: "Hilbert's hotel — animate a shift",
  inlineOne: "+1 guest",
  inlineK: "+k guests",
  inlineInfinite: "+ℵ₀ guests",
  inlineBuses: "+ℵ₀ buses × ℵ₀",
  inlineReset: "↺ reset",
  inlineFormulaLabel: "shift",
  inlineHint:
    "Pick a scenario. The amber pulse is the shift; cyan tiles are the newcomers; rose is a bus passenger. Tile labels show original room numbers (or bus·seat for bus passengers).",
  inlineNewGuest: "new",
  inlineExistingGuest: "existing",
  inlineBusGuest: "bus",
  inlineGapNote:
    "Grey ∅ rooms are numbers that are not a prime power — no one maps there, so they stay empty. The packing wastes rooms but never collides.",
  cardinalityCaption: "Bijection lab — does the hotel still fit?",
  cardinalityDoubles: "ℕ ↔ 2ℕ",
  cardinalityPairs: "ℕ ↔ ℕ × ℕ",
  cardinalityReals: "ℕ → ℝ ?",
  cardinalitySlider: "rows",
  cardinalityHint:
    "The first two modes show a clean bijection — countable. The third tries to enumerate the reals; the diagonal real at the bottom differs from every row, so no list of reals can ever be complete. See /cantor for the full argument.",
  cardinalityCountable: "ℵ₀",
  cardinalityUncountable: "uncountable",
  cardinalityBijection: "bijection",
  cardinalityNoBijection: "no bijection",
  primeTableTitle: "Prime-power assignment",
  primeTableHeadWho: "Who",
  primeTableHeadRoom: "Room",
  primeTableHeadFirst: "First rooms",
  primeTableRowExisting: "Existing guest n",
  primeTableRowBus1: "Bus 1 passenger m",
  primeTableRowBus2: "Bus 2 passenger m",
  primeTableRowBus3: "Bus 3 passenger m",
  primeTableRowBusK: "Bus k passenger m",
  primeTableNote:
    "Unique prime factorisation guarantees no two passengers ever request the same room. Many room numbers (6, 10, 12, 14, …) stay vacant: there is slack to spare.",
  cantorLinkLabel: "→ /cantor · the full diagonal argument",
  takeItFurther: "Take it further",
};

// ---------------- Deutsch ----------------
const de: RichStory = {
  page: {
    pretitle: "Thema · Paradox",
    title: "Hilberts Hotel",
    tagline: "Immer noch ein Zimmer frei — selbst wenn alles belegt ist.",
    intro:
      "David Hilbert skizzierte das Hotel in einer Göttinger Vorlesung 1924; George Gamow trug es 1947 in seinem Buch Eins, Zwei, Drei… Unendlichkeit zum Publikum. Unten: die vier klassischen Szenarien, animiert, plus der Moment, in dem die Unendlichkeit doch zurückschlägt — Cantors Diagonale.",
    ctaInteractive: "→ Zum Explorer",
  },
  encounter: {
    pretitle: "Erste Begegnung",
    title: "Ein Hotel mit ℵ₀ Zimmern, jedes schon belegt.",
    cards: [
      {
        label: "01",
        title: "Die große Idee",
        body: "Unendlichkeit ist keine sehr große Zahl — sie ist eine andere Art von Größe, mit eigener Arithmetik. Ein «volles» unendliches Hotel kann immer noch mehr Gäste aufnehmen, weil ℵ₀ + 1 = ℵ₀.",
      },
      {
        label: "02",
        title: "Ein neuer Gast",
        body: "Bitte jeden Gast aus Zimmer n in Zimmer n+1. Niemand wird hinausgeworfen, und Zimmer 1 wird frei für den Neuankömmling.",
      },
      {
        label: "03",
        title: "Warum es zählt",
        body: "Hilberts Gedankenexperiment von 1924 ist das sauberste Argument, dass unendliche Mengen Regeln folgen, die unsere endliche Intuition nicht kennt. Es ist zugleich das Vorspiel zu Cantors tieferem Schlag: manche Unendlichkeiten sind wirklich größer als andere.",
      },
    ],
    tryIt:
      "Unten: spiele die vier Verschiebungen durch und sieh dann, wie die Unendlichkeit dem Hotel doch entwächst.",
  },
  sections: [
    {
      pretitle: "Abschnitt 01 · Abzählbar unendlich",
      title: "Zimmer 1, 2, 3, … bis ins Unendliche",
      body: "Das Hotel hat ein Zimmer für jede natürliche Zahl — ein Gast in 1, ein Gast in 17, ein Gast in 10¹⁰⁰. Heute Nacht ist jedes belegt, doch «voll» ist das falsche Wort: die Mächtigkeit der Gäste ist ℵ₀, und ℵ₀ ist keine Zahl, die man auffüllen kann.",
    },
    {
      pretitle: "Abschnitt 02 · Ein neuer Gast",
      title: "Verschiebung n → n+1",
      body: "Eine reisende Person klopft. Der Empfang gibt eine einzige Anweisung durch: jeder Gast, geh von Zimmer n nach Zimmer n+1. Niemand wird verdrängt, es wartet immer ein höher nummeriertes Zimmer, und Zimmer 1 ist frei für den neuen Gast.",
    },
    {
      pretitle: "Abschnitt 03 · k neue Gäste",
      title: "Verschiebung n → n+k",
      body: "Ein Bus mit k Passagier:innen rollt an. Schick jeden bisherigen Gast aus Zimmer n in Zimmer n+k. Die Zimmer 1 bis k werden in einer Bewegung leer; die k Neuankömmlinge ziehen direkt ein.",
    },
    {
      pretitle: "Abschnitt 04 · ℵ₀ neue Gäste",
      title: "Verschiebung n → 2n; die ungeraden Zimmer öffnen sich",
      body: "Nun trifft eine abzählbar unendliche Schlange ein. Der Empfang schickt jeden bisherigen Gast aus Zimmer n in Zimmer 2n: jedes gerade Zimmer bleibt belegt, jedes ungerade wird frei. Die Neuen füllen 1, 3, 5, 7, … — die Gleichung ℵ₀ + ℵ₀ = ℵ₀, in einer einzigen Durchsage erledigt.",
    },
    {
      pretitle: "Abschnitt 05 · ℵ₀ Busse × ℵ₀ Gäste",
      title: "Primzahlpotenzen schlucken ℵ₀ × ℵ₀",
      body: "Eine Flotte aus ℵ₀ Bussen fährt vor, jeder mit ℵ₀ Passagier:innen. Schick jeden bisherigen Gast n in Zimmer 2ⁿ, dann Bus-k-Passagier:in m in Zimmer pₖᵐ, wobei pₖ die k-te ungerade Primzahl ist. Der Hauptsatz der Arithmetik garantiert, dass nie zwei Gäste kollidieren — ℵ₀ × ℵ₀ = ℵ₀.",
    },
    {
      pretitle: "Abschnitt 06 · Die überabzählbare Brücke",
      title: "ℝ schlägt das Hotel",
      body: "Geh einen Schritt weiter, und der Trick bricht. Cantors Diagonalargument von 1891 zeigt, dass die reellen Zahlen in [0,1] nicht einmal aufgelistet werden können — zu jeder Aufzählung gibt es eine neue reelle Zahl, die sich in der n-ten Stelle von Zeile n unterscheidet. Die reellen Zahlen sind überabzählbar; das Hotel ist nicht groß genug.",
    },
  ],
  closingTitle: "Öffne den Explorer.",
  closingBody:
    "Spiel die vier Verschiebungen erneut ab, sieh die Primzahlpotenz-Zuteilung Bus um Bus einlaufen, und wechsle dann zu Cantors Diagonale, um zu sehen, warum dieser Trick irgendwann nicht mehr greift.",
  ctaLabel: "→ Zum Explorer",
  inlineCaption: "Hilberts Hotel — eine Verschiebung animieren",
  inlineOne: "+1 Gast",
  inlineK: "+k Gäste",
  inlineInfinite: "+ℵ₀ Gäste",
  inlineBuses: "+ℵ₀ Busse × ℵ₀",
  inlineReset: "↺ zurücksetzen",
  inlineFormulaLabel: "Verschiebung",
  inlineHint:
    "Wähl ein Szenario. Der Bernstein-Puls zeigt die Verschiebung, cyanfarbene Felder sind Neuankömmlinge, Rose ist ein Gast aus dem Bus. Die Beschriftung zeigt die ursprüngliche Zimmernummer (bzw. Bus·Sitz bei Busgästen).",
  inlineNewGuest: "neu",
  inlineExistingGuest: "bestehend",
  inlineBusGuest: "Bus",
  inlineGapNote:
    "Graue ∅-Zimmer sind Nummern, die keine Primzahlpotenz sind — dorthin wird niemand abgebildet, sie bleiben leer. Das Schema verschenkt Zimmer, kollidiert aber nie.",
  cardinalityCaption: "Bijektions-Labor — passt das Hotel noch?",
  cardinalityDoubles: "ℕ ↔ 2ℕ",
  cardinalityPairs: "ℕ ↔ ℕ × ℕ",
  cardinalityReals: "ℕ → ℝ ?",
  cardinalitySlider: "Zeilen",
  cardinalityHint:
    "Die ersten beiden Modi zeigen eine saubere Bijektion — abzählbar. Der dritte versucht, die reellen Zahlen aufzulisten; die Diagonal-Zahl unten unterscheidet sich von jeder Zeile, also kann keine Liste der reellen Zahlen je vollständig sein. Siehe /cantor für das volle Argument.",
  cardinalityCountable: "ℵ₀",
  cardinalityUncountable: "überabzählbar",
  cardinalityBijection: "Bijektion",
  cardinalityNoBijection: "keine Bijektion",
  primeTableTitle: "Primzahlpotenz-Zuteilung",
  primeTableHeadWho: "Wer",
  primeTableHeadRoom: "Zimmer",
  primeTableHeadFirst: "Erste Zimmer",
  primeTableRowExisting: "Bisheriger Gast n",
  primeTableRowBus1: "Bus 1, Gast m",
  primeTableRowBus2: "Bus 2, Gast m",
  primeTableRowBus3: "Bus 3, Gast m",
  primeTableRowBusK: "Bus k, Gast m",
  primeTableNote:
    "Die eindeutige Primfaktorzerlegung garantiert, dass nie zwei Gäste dasselbe Zimmer verlangen. Viele Zimmernummern (6, 10, 12, 14, …) bleiben frei: es ist Spielraum im Überfluss da.",
  cantorLinkLabel: "→ /cantor · das vollständige Diagonalargument",
  takeItFurther: "Geh weiter",
};

// ---------------- Español ----------------
const es: RichStory = {
  page: {
    pretitle: "Tema · Paradoja",
    title: "El hotel de Hilbert",
    tagline: "Siempre hay sitio para uno más — incluso lleno.",
    intro:
      "David Hilbert esbozó el hotel en una conferencia en Gotinga en 1924; George Gamow lo llevó al gran público en su libro de 1947 Uno, dos, tres… infinito. Abajo: los cuatro escenarios clásicos animados, más el momento en que el infinito devuelve el golpe — la diagonal de Cantor.",
    ctaInteractive: "→ Abrir el Explorador",
  },
  encounter: {
    pretitle: "Primer encuentro",
    title: "Un hotel con ℵ₀ habitaciones, todas ya ocupadas.",
    cards: [
      {
        label: "01",
        title: "La idea grande",
        body: "El infinito no es un número muy grande — es otro tipo de tamaño, con su propia aritmética. Un hotel infinito «lleno» todavía puede absorber más huéspedes porque ℵ₀ + 1 = ℵ₀.",
      },
      {
        label: "02",
        title: "Un huésped nuevo",
        body: "Pide a cada huésped de la habitación n que pase a la habitación n+1. Nadie es expulsado, y la habitación 1 queda libre para el recién llegado.",
      },
      {
        label: "03",
        title: "Por qué importa",
        body: "El experimento mental de Hilbert de 1924 es el argumento más limpio de que los conjuntos infinitos siguen reglas que nuestra intuición finita ignora. También es el preludio al golpe más profundo de Cantor: algunos infinitos son realmente mayores que otros.",
      },
    ],
    tryIt:
      "Abajo: ejecuta los cuatro desplazamientos y mira luego cómo el infinito acaba desbordando el hotel.",
  },
  sections: [
    {
      pretitle: "Sección 01 · Infinito numerable",
      title: "Habitaciones 1, 2, 3, … para siempre",
      body: "El hotel tiene una habitación por cada número natural — un huésped en 1, un huésped en 17, un huésped en 10¹⁰⁰. Esta noche todas están ocupadas, pero «lleno» es la palabra equivocada: la cardinalidad de los huéspedes es ℵ₀, y ℵ₀ no es un número que se pueda colmar.",
    },
    {
      pretitle: "Sección 02 · Un huésped nuevo",
      title: "Desplazamiento n → n+1",
      body: "Llama a la puerta un viajero. La recepción emite una sola instrucción: cada huésped, pasa de la habitación n a la n+1. Nadie queda fuera — siempre hay una habitación de número mayor esperando — y la 1 queda libre para el recién llegado.",
    },
    {
      pretitle: "Sección 03 · k huéspedes nuevos",
      title: "Desplazamiento n → n+k",
      body: "Llega un autocar con k pasajeros. Manda a cada huésped existente de la habitación n a la n+k. Las habitaciones 1 a k se vacían en un solo movimiento; los k recién llegados entran directos.",
    },
    {
      pretitle: "Sección 04 · ℵ₀ huéspedes nuevos",
      title: "Desplazamiento n → 2n; se abren los impares",
      body: "Ahora llega una cola numerablemente infinita. La recepción manda a cada huésped existente de la n a la 2n: toda habitación par sigue ocupada y toda impar queda libre. Los nuevos llenan 1, 3, 5, 7, … — la igualdad ℵ₀ + ℵ₀ = ℵ₀, resuelta en un solo anuncio.",
    },
    {
      pretitle: "Sección 05 · ℵ₀ autocares × ℵ₀ huéspedes",
      title: "Las potencias de primos absorben ℵ₀ × ℵ₀",
      body: "Una flota de ℵ₀ autocares aparca, cada uno con ℵ₀ pasajeros. Manda a cada huésped existente n a la habitación 2ⁿ, después al pasajero m del autocar k a la habitación pₖᵐ, siendo pₖ el k-ésimo primo impar. El teorema fundamental de la aritmética garantiza que no choquen dos huéspedes — ℵ₀ × ℵ₀ = ℵ₀.",
    },
    {
      pretitle: "Sección 06 · El puente no numerable",
      title: "ℝ derrota al hotel",
      body: "Avanza un paso más y el truco se rompe. El argumento diagonal de Cantor de 1891 muestra que los reales de [0,1] no pueden ni siquiera enumerarse — para cualquier enumeración propuesta, un nuevo real difiere de la fila n en el n-ésimo dígito. Los reales son no numerables; el hotel no es lo bastante grande.",
    },
  ],
  closingTitle: "Abre el Explorador.",
  closingBody:
    "Vuelve a ejecutar los cuatro desplazamientos, mira cómo la asignación por potencias de primos coloca un autocar tras otro, y pasa después a la diagonal de Cantor para ver por qué este truco concreto deja de funcionar.",
  ctaLabel: "→ Abrir el Explorador",
  inlineCaption: "Hotel de Hilbert — anima un desplazamiento",
  inlineOne: "+1 huésped",
  inlineK: "+k huéspedes",
  inlineInfinite: "+ℵ₀ huéspedes",
  inlineBuses: "+ℵ₀ autocares × ℵ₀",
  inlineReset: "↺ reiniciar",
  inlineFormulaLabel: "desplazamiento",
  inlineHint:
    "Elige un escenario. El pulso ámbar marca el desplazamiento, las casillas cian son los recién llegados, la rosa es un pasajero de autocar. Las etiquetas muestran la habitación original (o autocar·asiento para los pasajeros).",
  inlineNewGuest: "nuevo",
  inlineExistingGuest: "existente",
  inlineBusGuest: "autocar",
  inlineGapNote:
    "Las habitaciones ∅ grises son números que no son potencia de primo — nadie va a parar ahí, quedan vacías. El esquema desperdicia habitaciones, pero nunca colisiona.",
  cardinalityCaption: "Laboratorio de biyecciones — ¿sigue cabiendo en el hotel?",
  cardinalityDoubles: "ℕ ↔ 2ℕ",
  cardinalityPairs: "ℕ ↔ ℕ × ℕ",
  cardinalityReals: "ℕ → ℝ ?",
  cardinalitySlider: "filas",
  cardinalityHint:
    "Los dos primeros modos muestran una biyección limpia — numerable. El tercero intenta enumerar los reales; el real diagonal de abajo difiere de cada fila, así que ninguna lista de reales puede estar completa. Ver /cantor para el argumento entero.",
  cardinalityCountable: "ℵ₀",
  cardinalityUncountable: "no numerable",
  cardinalityBijection: "biyección",
  cardinalityNoBijection: "sin biyección",
  primeTableTitle: "Asignación por potencias de primos",
  primeTableHeadWho: "Quién",
  primeTableHeadRoom: "Habitación",
  primeTableHeadFirst: "Primeras habitaciones",
  primeTableRowExisting: "Huésped existente n",
  primeTableRowBus1: "Autocar 1, pasajero m",
  primeTableRowBus2: "Autocar 2, pasajero m",
  primeTableRowBus3: "Autocar 3, pasajero m",
  primeTableRowBusK: "Autocar k, pasajero m",
  primeTableNote:
    "La factorización única en primos garantiza que dos pasajeros nunca pidan la misma habitación. Muchos números de habitación (6, 10, 12, 14, …) quedan vacíos: sobra margen.",
  cantorLinkLabel: "→ /cantor · el argumento diagonal completo",
  takeItFurther: "Ve más allá",
};

// ---------------- Français ----------------
const fr: RichStory = {
  page: {
    pretitle: "Thème · Paradoxe",
    title: "L'hôtel de Hilbert",
    tagline: "Toujours une chambre de plus — même complet.",
    intro:
      "David Hilbert a esquissé l'hôtel dans une conférence à Göttingen en 1924 ; George Gamow l'a porté au grand public dans son livre de 1947 Un, deux, trois… l'infini. En bas : les quatre scénarios classiques animés, plus l'instant où l'infini riposte enfin — la diagonale de Cantor.",
    ctaInteractive: "→ Ouvrir l'Explorateur",
  },
  encounter: {
    pretitle: "Première rencontre",
    title: "Un hôtel avec ℵ₀ chambres, toutes déjà occupées.",
    cards: [
      {
        label: "01",
        title: "L'idée centrale",
        body: "L'infini n'est pas un très grand nombre — c'est un autre type de taille, avec sa propre arithmétique. Un hôtel infini « complet » peut quand même absorber plus de clients, car ℵ₀ + 1 = ℵ₀.",
      },
      {
        label: "02",
        title: "Un nouveau client",
        body: "Demande à chaque client de la chambre n de passer en chambre n+1. Personne n'est mis dehors, et la chambre 1 se libère pour le nouveau venu.",
      },
      {
        label: "03",
        title: "Pourquoi cela compte",
        body: "L'expérience de pensée de Hilbert (1924) est l'argument le plus net que les ensembles infinis suivent des règles que notre intuition finie ignore. C'est aussi le prélude au coup plus profond de Cantor : certaines infinités sont vraiment plus grandes que d'autres.",
      },
    ],
    tryIt:
      "En bas : exécute les quatre décalages, puis regarde l'infini finir par déborder l'hôtel.",
  },
  sections: [
    {
      pretitle: "Section 01 · Infini dénombrable",
      title: "Chambres 1, 2, 3, … pour toujours",
      body: "L'hôtel a une chambre pour chaque entier naturel — un client en 1, un client en 17, un client en 10¹⁰⁰. Ce soir toutes sont prises, mais « complet » est le mauvais mot : le cardinal des clients est ℵ₀, et ℵ₀ n'est pas un nombre que l'on puisse remplir.",
    },
    {
      pretitle: "Section 02 · Un nouveau client",
      title: "Décalage n → n+1",
      body: "Un voyageur frappe. La réception diffuse une seule consigne : chaque client, passe de la chambre n à la chambre n+1. Personne n'est délogé — il y a toujours une chambre de numéro plus haut qui attend — et la 1 se libère pour le nouveau venu.",
    },
    {
      pretitle: "Section 03 · k nouveaux clients",
      title: "Décalage n → n+k",
      body: "Un car arrive avec k passagers. Envoie chaque client existant de la chambre n vers la chambre n+k. Les chambres 1 à k se vident d'un seul geste ; les k nouveaux entrent directement.",
    },
    {
      pretitle: "Section 04 · ℵ₀ nouveaux clients",
      title: "Décalage n → 2n ; les chambres impaires s'ouvrent",
      body: "Une file dénombrablement infinie arrive. La réception envoie chaque client existant de la n vers la 2n : toute chambre paire reste occupée, toute chambre impaire devient libre. Les nouveaux remplissent 1, 3, 5, 7, … — l'égalité ℵ₀ + ℵ₀ = ℵ₀, exécutée en une seule annonce.",
    },
    {
      pretitle: "Section 05 · ℵ₀ cars × ℵ₀ clients",
      title: "Les puissances de premiers absorbent ℵ₀ × ℵ₀",
      body: "Une flotte de ℵ₀ cars se gare, chacun avec ℵ₀ passagers. Envoie chaque client existant n vers la chambre 2ⁿ, puis le passager m du car k vers pₖᵐ, où pₖ est le k-ième nombre premier impair. Le théorème fondamental de l'arithmétique garantit qu'aucun client n'en croise un autre — ℵ₀ × ℵ₀ = ℵ₀.",
    },
    {
      pretitle: "Section 06 · Le pont non dénombrable",
      title: "ℝ bat l'hôtel",
      body: "Pousse d'un cran de plus et l'astuce casse. L'argument diagonal de Cantor (1891) montre que les réels de [0,1] ne peuvent même pas être énumérés — pour toute énumération proposée, un nouveau réel diffère de la ligne n au n-ième chiffre. Les réels sont non dénombrables ; l'hôtel n'est pas assez grand.",
    },
  ],
  closingTitle: "Ouvre l'Explorateur.",
  closingBody:
    "Rejoue les quatre décalages, regarde l'attribution par puissances de premiers atterrir car après car, puis bascule vers la diagonale de Cantor pour voir pourquoi ce tour précis finit par ne plus marcher.",
  ctaLabel: "→ Ouvrir l'Explorateur",
  inlineCaption: "Hôtel de Hilbert — anime un décalage",
  inlineOne: "+1 client",
  inlineK: "+k clients",
  inlineInfinite: "+ℵ₀ clients",
  inlineBuses: "+ℵ₀ cars × ℵ₀",
  inlineReset: "↺ réinitialiser",
  inlineFormulaLabel: "décalage",
  inlineHint:
    "Choisis un scénario. Le pulse ambré marque le décalage, les cases cyan sont les nouveaux venus, la rose est un passager de car. Les étiquettes montrent la chambre d'origine (ou car·siège pour les passagers).",
  inlineNewGuest: "nouveau",
  inlineExistingGuest: "existant",
  inlineBusGuest: "car",
  inlineGapNote:
    "Les chambres ∅ grises sont des numéros qui ne sont pas une puissance de premier — personne n'y est envoyé, elles restent vides. Le schéma gaspille des chambres, mais ne provoque jamais de collision.",
  cardinalityCaption: "Labo de bijections — l'hôtel suffit-il encore ?",
  cardinalityDoubles: "ℕ ↔ 2ℕ",
  cardinalityPairs: "ℕ ↔ ℕ × ℕ",
  cardinalityReals: "ℕ → ℝ ?",
  cardinalitySlider: "lignes",
  cardinalityHint:
    "Les deux premiers modes montrent une bijection nette — dénombrable. Le troisième tente d'énumérer les réels ; le réel diagonal en bas diffère de chaque ligne, donc aucune liste de réels ne peut être complète. Voir /cantor pour l'argument entier.",
  cardinalityCountable: "ℵ₀",
  cardinalityUncountable: "non dénombrable",
  cardinalityBijection: "bijection",
  cardinalityNoBijection: "pas de bijection",
  primeTableTitle: "Attribution par puissances de premiers",
  primeTableHeadWho: "Qui",
  primeTableHeadRoom: "Chambre",
  primeTableHeadFirst: "Premières chambres",
  primeTableRowExisting: "Client existant n",
  primeTableRowBus1: "Car 1, passager m",
  primeTableRowBus2: "Car 2, passager m",
  primeTableRowBus3: "Car 3, passager m",
  primeTableRowBusK: "Car k, passager m",
  primeTableNote:
    "La factorisation unique en nombres premiers garantit que deux passagers ne demandent jamais la même chambre. Beaucoup de numéros (6, 10, 12, 14, …) restent vacants : il y a de la marge à revendre.",
  cantorLinkLabel: "→ /cantor · l'argument diagonal complet",
  takeItFurther: "Va plus loin",
};

// ---------------- Italiano ----------------
const it: RichStory = {
  page: {
    pretitle: "Tema · Paradosso",
    title: "L'hotel di Hilbert",
    tagline: "C'è sempre posto per uno in più — anche quando è pieno.",
    intro:
      "David Hilbert schizzò l'hotel in una conferenza a Gottinga nel 1924; George Gamow lo portò al pubblico nel suo libro del 1947 Uno, due, tre… infinito. Sotto: i quattro scenari classici animati, più il momento in cui l'infinito risponde — la diagonale di Cantor.",
    ctaInteractive: "→ Apri l'Esploratore",
  },
  encounter: {
    pretitle: "Primo incontro",
    title: "Un hotel con ℵ₀ stanze, tutte già occupate.",
    cards: [
      {
        label: "01",
        title: "L'idea grande",
        body: "L'infinito non è un numero molto grande — è un altro tipo di grandezza, con la sua aritmetica. Un hotel infinito «pieno» può comunque assorbire altri ospiti perché ℵ₀ + 1 = ℵ₀.",
      },
      {
        label: "02",
        title: "Un ospite nuovo",
        body: "Chiedi a ogni ospite della stanza n di passare alla stanza n+1. Nessuno viene cacciato, e la stanza 1 si libera per il nuovo arrivato.",
      },
      {
        label: "03",
        title: "Perché conta",
        body: "L'esperimento di pensiero di Hilbert del 1924 è l'argomento più pulito che gli insiemi infiniti seguono regole che la nostra intuizione finita ignora. È anche il preludio al colpo più profondo di Cantor: alcuni infiniti sono davvero più grandi di altri.",
      },
    ],
    tryIt:
      "Sotto: esegui i quattro spostamenti, poi guarda come l'infinito finisce per superare l'hotel.",
  },
  sections: [
    {
      pretitle: "Sezione 01 · Infinito numerabile",
      title: "Stanze 1, 2, 3, … per sempre",
      body: "L'hotel ha una stanza per ogni numero naturale — un ospite in 1, uno in 17, uno in 10¹⁰⁰. Stanotte tutte sono occupate, ma «pieno» è la parola sbagliata: la cardinalità degli ospiti è ℵ₀, e ℵ₀ non è un numero che si possa riempire.",
    },
    {
      pretitle: "Sezione 02 · Un ospite nuovo",
      title: "Spostamento n → n+1",
      body: "Un viaggiatore bussa. La reception trasmette una sola istruzione: ogni ospite, passa dalla stanza n alla n+1. Nessuno viene scalzato — c'è sempre una stanza con numero più alto in attesa — e la 1 si libera per il nuovo.",
    },
    {
      pretitle: "Sezione 03 · k ospiti nuovi",
      title: "Spostamento n → n+k",
      body: "Arriva un pullman con k passeggeri. Manda ogni ospite esistente dalla stanza n alla n+k. Le stanze da 1 a k si svuotano in un solo gesto; i k nuovi entrano dritti dentro.",
    },
    {
      pretitle: "Sezione 04 · ℵ₀ ospiti nuovi",
      title: "Spostamento n → 2n; si aprono le dispari",
      body: "Ora arriva una coda numerabilmente infinita. La reception manda ogni ospite esistente dalla n alla 2n: ogni stanza pari resta occupata, ogni dispari si libera. I nuovi riempiono 1, 3, 5, 7, … — l'uguaglianza ℵ₀ + ℵ₀ = ℵ₀, eseguita in un unico annuncio.",
    },
    {
      pretitle: "Sezione 05 · ℵ₀ pullman × ℵ₀ ospiti",
      title: "Le potenze di primi assorbono ℵ₀ × ℵ₀",
      body: "Una flotta di ℵ₀ pullman accosta, ciascuno con ℵ₀ passeggeri. Manda ogni ospite esistente n alla stanza 2ⁿ, poi il passeggero m del pullman k alla stanza pₖᵐ, dove pₖ è il k-esimo primo dispari. Il teorema fondamentale dell'aritmetica garantisce che nessun ospite collida — ℵ₀ × ℵ₀ = ℵ₀.",
    },
    {
      pretitle: "Sezione 06 · Il ponte non numerabile",
      title: "ℝ batte l'hotel",
      body: "Spingi un passo oltre e il trucco si rompe. L'argomento diagonale di Cantor del 1891 mostra che i reali di [0,1] non possono nemmeno essere elencati — per ogni enumerazione proposta, un nuovo reale differisce dalla riga n alla n-esima cifra. I reali sono non numerabili; l'hotel non è abbastanza grande.",
    },
  ],
  closingTitle: "Apri l'Esploratore.",
  closingBody:
    "Riproduci i quattro spostamenti, guarda l'assegnazione per potenze di primi atterrare pullman dopo pullman, poi passa alla diagonale di Cantor per vedere perché questo trucco a un certo punto smette di funzionare.",
  ctaLabel: "→ Apri l'Esploratore",
  inlineCaption: "Hotel di Hilbert — anima uno spostamento",
  inlineOne: "+1 ospite",
  inlineK: "+k ospiti",
  inlineInfinite: "+ℵ₀ ospiti",
  inlineBuses: "+ℵ₀ pullman × ℵ₀",
  inlineReset: "↺ azzera",
  inlineFormulaLabel: "spostamento",
  inlineHint:
    "Scegli uno scenario. Il pulsare ambra è lo spostamento, i riquadri ciano sono i nuovi arrivati, il rosa è un passeggero di pullman. Le etichette mostrano la stanza originaria (o pullman·posto per i passeggeri).",
  inlineNewGuest: "nuovo",
  inlineExistingGuest: "esistente",
  inlineBusGuest: "pullman",
  inlineGapNote:
    "Le stanze ∅ grigie sono numeri che non sono potenza di un primo — nessuno ci finisce, restano vuote. Lo schema spreca stanze, ma non collide mai.",
  cardinalityCaption: "Laboratorio di biiezioni — l'hotel basta ancora?",
  cardinalityDoubles: "ℕ ↔ 2ℕ",
  cardinalityPairs: "ℕ ↔ ℕ × ℕ",
  cardinalityReals: "ℕ → ℝ ?",
  cardinalitySlider: "righe",
  cardinalityHint:
    "I primi due modi mostrano una biiezione pulita — numerabile. Il terzo prova a enumerare i reali; il reale diagonale in basso differisce da ogni riga, quindi nessuna lista di reali può essere completa. Vedi /cantor per l'argomento intero.",
  cardinalityCountable: "ℵ₀",
  cardinalityUncountable: "non numerabile",
  cardinalityBijection: "biiezione",
  cardinalityNoBijection: "nessuna biiezione",
  primeTableTitle: "Assegnazione per potenze di primi",
  primeTableHeadWho: "Chi",
  primeTableHeadRoom: "Stanza",
  primeTableHeadFirst: "Prime stanze",
  primeTableRowExisting: "Ospite esistente n",
  primeTableRowBus1: "Pullman 1, passeggero m",
  primeTableRowBus2: "Pullman 2, passeggero m",
  primeTableRowBus3: "Pullman 3, passeggero m",
  primeTableRowBusK: "Pullman k, passeggero m",
  primeTableNote:
    "La fattorizzazione unica in primi garantisce che due passeggeri non chiedano mai la stessa stanza. Molti numeri di stanza (6, 10, 12, 14, …) restano vuoti: c'è margine in abbondanza.",
  cantorLinkLabel: "→ /cantor · l'argomento diagonale completo",
  takeItFurther: "Vai oltre",
};

// ---------------- Português ----------------
const pt: RichStory = {
  page: {
    pretitle: "Tema · Paradoxo",
    title: "O hotel de Hilbert",
    tagline: "Há sempre lugar para mais um — mesmo cheio.",
    intro:
      "David Hilbert esboçou o hotel numa conferência em Gotinga em 1924; George Gamow levou-o ao público no seu livro de 1947 Um, Dois, Três… Infinito. Abaixo: os quatro cenários clássicos animados, mais o momento em que o infinito devolve o golpe — a diagonal de Cantor.",
    ctaInteractive: "→ Abrir o Explorador",
  },
  encounter: {
    pretitle: "Primeiro encontro",
    title: "Um hotel com ℵ₀ quartos, todos já ocupados.",
    cards: [
      {
        label: "01",
        title: "A ideia central",
        body: "O infinito não é um número muito grande — é outro tipo de tamanho, com a sua própria aritmética. Um hotel infinito «cheio» ainda consegue absorver mais hóspedes porque ℵ₀ + 1 = ℵ₀.",
      },
      {
        label: "02",
        title: "Um hóspede novo",
        body: "Pede a cada hóspede do quarto n que passe para o quarto n+1. Ninguém é expulso, e o quarto 1 fica livre para o recém-chegado.",
      },
      {
        label: "03",
        title: "Porque importa",
        body: "A experiência de pensamento de Hilbert (1924) é o argumento mais limpo de que os conjuntos infinitos seguem regras que a nossa intuição finita ignora. É também o prelúdio ao golpe mais profundo de Cantor: alguns infinitos são realmente maiores do que outros.",
      },
    ],
    tryIt:
      "Abaixo: executa os quatro deslocamentos e depois vê como o infinito acaba por extravasar o hotel.",
  },
  sections: [
    {
      pretitle: "Secção 01 · Infinito numerável",
      title: "Quartos 1, 2, 3, … para sempre",
      body: "O hotel tem um quarto para cada número natural — um hóspede em 1, um em 17, um em 10¹⁰⁰. Esta noite todos estão ocupados, mas «cheio» é a palavra errada: a cardinalidade dos hóspedes é ℵ₀, e ℵ₀ não é um número que se possa esgotar.",
    },
    {
      pretitle: "Secção 02 · Um hóspede novo",
      title: "Deslocamento n → n+1",
      body: "Bate um viajante. A recepção emite uma única instrução: cada hóspede, passa do quarto n para o n+1. Ninguém fica de fora — há sempre um quarto de número mais alto à espera — e o 1 fica livre para o novo.",
    },
    {
      pretitle: "Secção 03 · k hóspedes novos",
      title: "Deslocamento n → n+k",
      body: "Chega um autocarro com k passageiros. Manda cada hóspede existente do quarto n para o n+k. Os quartos 1 a k esvaziam-se num só gesto; os k novos entram directos.",
    },
    {
      pretitle: "Secção 04 · ℵ₀ hóspedes novos",
      title: "Deslocamento n → 2n; abrem os ímpares",
      body: "Chega agora uma fila numeravelmente infinita. A recepção manda cada hóspede existente do quarto n para o 2n: todo quarto par continua ocupado, todo ímpar fica livre. Os novos preenchem 1, 3, 5, 7, … — a igualdade ℵ₀ + ℵ₀ = ℵ₀, executada num único anúncio.",
    },
    {
      pretitle: "Secção 05 · ℵ₀ autocarros × ℵ₀ hóspedes",
      title: "As potências de primos absorvem ℵ₀ × ℵ₀",
      body: "Uma frota de ℵ₀ autocarros encosta, cada um com ℵ₀ passageiros. Manda cada hóspede existente n para o quarto 2ⁿ, depois o passageiro m do autocarro k para o pₖᵐ, sendo pₖ o k-ésimo primo ímpar. O teorema fundamental da aritmética garante que nunca dois hóspedes colidem — ℵ₀ × ℵ₀ = ℵ₀.",
    },
    {
      pretitle: "Secção 06 · A ponte não numerável",
      title: "ℝ derrota o hotel",
      body: "Dá mais um passo e o truque parte-se. O argumento diagonal de Cantor de 1891 mostra que os reais de [0,1] não podem sequer ser enumerados — para qualquer enumeração proposta, um novo real difere da linha n no n-ésimo dígito. Os reais são não numeráveis; o hotel não é suficientemente grande.",
    },
  ],
  closingTitle: "Abre o Explorador.",
  closingBody:
    "Repete os quatro deslocamentos, vê a atribuição por potências de primos aterrar autocarro a autocarro, e passa depois à diagonal de Cantor para perceber por que este truque em particular deixa de funcionar.",
  ctaLabel: "→ Abrir o Explorador",
  inlineCaption: "Hotel de Hilbert — animar um deslocamento",
  inlineOne: "+1 hóspede",
  inlineK: "+k hóspedes",
  inlineInfinite: "+ℵ₀ hóspedes",
  inlineBuses: "+ℵ₀ autocarros × ℵ₀",
  inlineReset: "↺ reiniciar",
  inlineFormulaLabel: "deslocamento",
  inlineHint:
    "Escolhe um cenário. O pulso âmbar marca o deslocamento, as casas ciano são os recém-chegados, a rosa é um passageiro de autocarro. As etiquetas mostram o quarto original (ou autocarro·lugar para os passageiros).",
  inlineNewGuest: "novo",
  inlineExistingGuest: "existente",
  inlineBusGuest: "autocarro",
  inlineGapNote:
    "Os quartos ∅ cinzentos são números que não são potência de primo — ninguém é mapeado para lá, ficam vazios. O esquema desperdiça quartos, mas nunca colide.",
  cardinalityCaption: "Laboratório de bijecções — o hotel ainda chega?",
  cardinalityDoubles: "ℕ ↔ 2ℕ",
  cardinalityPairs: "ℕ ↔ ℕ × ℕ",
  cardinalityReals: "ℕ → ℝ ?",
  cardinalitySlider: "linhas",
  cardinalityHint:
    "Os dois primeiros modos mostram uma bijecção limpa — numerável. O terceiro tenta enumerar os reais; o real diagonal em baixo difere de cada linha, logo nenhuma lista de reais pode estar completa. Ver /cantor para o argumento completo.",
  cardinalityCountable: "ℵ₀",
  cardinalityUncountable: "não numerável",
  cardinalityBijection: "bijecção",
  cardinalityNoBijection: "sem bijecção",
  primeTableTitle: "Atribuição por potências de primos",
  primeTableHeadWho: "Quem",
  primeTableHeadRoom: "Quarto",
  primeTableHeadFirst: "Primeiros quartos",
  primeTableRowExisting: "Hóspede existente n",
  primeTableRowBus1: "Autocarro 1, passageiro m",
  primeTableRowBus2: "Autocarro 2, passageiro m",
  primeTableRowBus3: "Autocarro 3, passageiro m",
  primeTableRowBusK: "Autocarro k, passageiro m",
  primeTableNote:
    "A factorização única em primos garante que dois passageiros nunca pedem o mesmo quarto. Muitos números de quarto (6, 10, 12, 14, …) ficam vagos: há folga de sobra.",
  cantorLinkLabel: "→ /cantor · o argumento diagonal completo",
  takeItFurther: "Vai mais longe",
};

// ---------------- Svenska ----------------
const sv: RichStory = {
  page: {
    pretitle: "Ämne · Paradox",
    title: "Hilberts hotell",
    tagline: "Alltid plats för en till — även när det är fullt.",
    intro:
      "David Hilbert skissade hotellet i en föreläsning i Göttingen 1924; George Gamow förde det vidare till allmänheten i sin bok från 1947 Ett, två, tre… oändligheten. Nedan: de fyra klassiska scenarierna animerade, plus ögonblicket då oändligheten slår tillbaka — Cantors diagonal.",
    ctaInteractive: "→ Öppna Utforskaren",
  },
  encounter: {
    pretitle: "Första mötet",
    title: "Ett hotell med ℵ₀ rum, alla redan tagna.",
    cards: [
      {
        label: "01",
        title: "Den stora idén",
        body: "Oändlighet är inte ett mycket stort tal — det är en annan sorts storlek, med egen aritmetik. Ett «fullt» oändligt hotell kan fortfarande ta emot fler gäster eftersom ℵ₀ + 1 = ℵ₀.",
      },
      {
        label: "02",
        title: "En ny gäst",
        body: "Be varje gäst i rum n att gå till rum n+1. Ingen kastas ut, och rum 1 blir ledigt för nykomlingen.",
      },
      {
        label: "03",
        title: "Varför det spelar roll",
        body: "Hilberts tankeexperiment från 1924 är det renaste argumentet för att oändliga mängder lyder regler som vår ändliga intuition inte känner. Det är också upptakten till Cantors djupare smäll: vissa oändligheter är verkligen större än andra.",
      },
    ],
    tryIt: "Nedan: kör de fyra förskjutningarna, se sedan oändligheten växa ur hotellet.",
  },
  sections: [
    {
      pretitle: "Avsnitt 01 · Uppräkneligt oändligt",
      title: "Rum 1, 2, 3, … för evigt",
      body: "Hotellet har ett rum för varje naturligt tal — en gäst i 1, en i 17, en i 10¹⁰⁰. I natt är alla tagna, men «fullt» är fel ord: gästernas kardinalitet är ℵ₀, och ℵ₀ är inte ett tal man kan fylla.",
    },
    {
      pretitle: "Avsnitt 02 · En ny gäst",
      title: "Förskjutning n → n+1",
      body: "En resenär knackar. Receptionen sänder ut en enda instruktion: varje gäst, gå från rum n till rum n+1. Ingen knuffas ut — det finns alltid ett rum med högre nummer som väntar — och 1 blir ledigt för nykomlingen.",
    },
    {
      pretitle: "Avsnitt 03 · k nya gäster",
      title: "Förskjutning n → n+k",
      body: "En buss anländer med k passagerare. Skicka varje befintlig gäst från rum n till rum n+k. Rum 1 till k töms i en rörelse; de k nykomna går rakt in.",
    },
    {
      pretitle: "Avsnitt 04 · ℵ₀ nya gäster",
      title: "Förskjutning n → 2n; udda rummen öppnar sig",
      body: "Nu kommer en uppräkneligt oändlig kö. Receptionen skickar varje befintlig gäst från n till 2n: varje jämnt rum förblir taget, varje udda blir ledigt. De nya fyller 1, 3, 5, 7, … — likheten ℵ₀ + ℵ₀ = ℵ₀, utförd i ett enda meddelande.",
    },
    {
      pretitle: "Avsnitt 05 · ℵ₀ bussar × ℵ₀ gäster",
      title: "Primtalspotenser sväljer ℵ₀ × ℵ₀",
      body: "En flotta av ℵ₀ bussar rullar fram, var och en med ℵ₀ passagerare. Skicka varje befintlig gäst n till rum 2ⁿ, sedan passagerare m i buss k till rum pₖᵐ, där pₖ är det k:e udda primtalet. Aritmetikens fundamentalsats garanterar att inga två gäster krockar — ℵ₀ × ℵ₀ = ℵ₀.",
    },
    {
      pretitle: "Avsnitt 06 · Den överuppräkneliga bron",
      title: "ℝ besegrar hotellet",
      body: "Ta ett steg till och tricket går sönder. Cantors diagonalargument från 1891 visar att de reella talen i [0,1] inte ens kan listas — för varje föreslagen uppräkning skiljer sig ett nytt reellt tal från rad n vid den n:e siffran. De reella är överuppräkneliga; hotellet räcker inte.",
    },
  ],
  closingTitle: "Öppna Utforskaren.",
  closingBody:
    "Spela upp de fyra förskjutningarna igen, se primtalspotens-tilldelningen landa buss för buss, och gå sedan över till Cantors diagonal för att se varför just det här tricket till slut inte fungerar längre.",
  ctaLabel: "→ Öppna Utforskaren",
  inlineCaption: "Hilberts hotell — animera en förskjutning",
  inlineOne: "+1 gäst",
  inlineK: "+k gäster",
  inlineInfinite: "+ℵ₀ gäster",
  inlineBuses: "+ℵ₀ bussar × ℵ₀",
  inlineReset: "↺ återställ",
  inlineFormulaLabel: "förskjutning",
  inlineHint:
    "Välj ett scenario. Den bärnstensfärgade pulsen är förskjutningen, cyanrutorna är nykomlingarna, rosa är en busspassagerare. Etiketterna visar ursprungsrummet (eller buss·plats för passagerare).",
  inlineNewGuest: "ny",
  inlineExistingGuest: "befintlig",
  inlineBusGuest: "buss",
  inlineGapNote:
    "Grå ∅-rum är nummer som inte är en primtalspotens — ingen hamnar där, de förblir tomma. Schemat slösar rum men krockar aldrig.",
  cardinalityCaption: "Bijektionslabb — räcker hotellet ännu?",
  cardinalityDoubles: "ℕ ↔ 2ℕ",
  cardinalityPairs: "ℕ ↔ ℕ × ℕ",
  cardinalityReals: "ℕ → ℝ ?",
  cardinalitySlider: "rader",
  cardinalityHint:
    "De två första lägena visar en ren bijektion — uppräknelig. Det tredje försöker räkna upp de reella; det diagonala reella längst ner skiljer sig från varje rad, alltså kan ingen lista av reella tal vara fullständig. Se /cantor för hela argumentet.",
  cardinalityCountable: "ℵ₀",
  cardinalityUncountable: "överuppräknelig",
  cardinalityBijection: "bijektion",
  cardinalityNoBijection: "ingen bijektion",
  primeTableTitle: "Primtalspotens-tilldelning",
  primeTableHeadWho: "Vem",
  primeTableHeadRoom: "Rum",
  primeTableHeadFirst: "Första rummen",
  primeTableRowExisting: "Befintlig gäst n",
  primeTableRowBus1: "Buss 1, passagerare m",
  primeTableRowBus2: "Buss 2, passagerare m",
  primeTableRowBus3: "Buss 3, passagerare m",
  primeTableRowBusK: "Buss k, passagerare m",
  primeTableNote:
    "Den unika primtalsfaktoriseringen garanterar att två passagerare aldrig begär samma rum. Många rumsnummer (6, 10, 12, 14, …) förblir tomma: det finns gott om marginal.",
  cantorLinkLabel: "→ /cantor · hela diagonalargumentet",
  takeItFurther: "Gå vidare",
};

// ---------------- Norsk ----------------
const no: RichStory = {
  page: {
    pretitle: "Tema · Paradoks",
    title: "Hilberts hotell",
    tagline: "Alltid plass til én til — selv når det er fullt.",
    intro:
      "David Hilbert skisserte hotellet i en forelesning i Göttingen i 1924; George Gamow tok det videre til publikum i boken sin fra 1947 Én, to, tre… uendelig. Nedenfor: de fire klassiske scenariene animert, pluss øyeblikket der uendeligheten endelig slår tilbake — Cantors diagonal.",
    ctaInteractive: "→ Åpne Utforskeren",
  },
  encounter: {
    pretitle: "Første møte",
    title: "Et hotell med ℵ₀ rom, alle allerede tatt.",
    cards: [
      {
        label: "01",
        title: "Den store idéen",
        body: "Uendelighet er ikke et veldig stort tall — det er en annen slags størrelse, med sin egen aritmetikk. Et «fullt» uendelig hotell kan fortsatt ta imot flere gjester fordi ℵ₀ + 1 = ℵ₀.",
      },
      {
        label: "02",
        title: "Én ny gjest",
        body: "Be hver gjest i rom n om å gå til rom n+1. Ingen blir kastet ut, og rom 1 blir ledig for den nyankomne.",
      },
      {
        label: "03",
        title: "Hvorfor det betyr noe",
        body: "Hilberts tankeeksperiment fra 1924 er det reneste argumentet for at uendelige mengder følger regler vår endelige intuisjon ikke kjenner. Det er også opptakten til Cantors dypere smell: noen uendeligheter er virkelig større enn andre.",
      },
    ],
    tryIt: "Nedenfor: kjør de fire forskyvningene, se så uendeligheten vokse ut av hotellet.",
  },
  sections: [
    {
      pretitle: "Avsnitt 01 · Tellbart uendelig",
      title: "Rom 1, 2, 3, … for alltid",
      body: "Hotellet har ett rom for hvert naturlig tall — en gjest i 1, en i 17, en i 10¹⁰⁰. I natt er alle tatt, men «fullt» er feil ord: gjestenes kardinalitet er ℵ₀, og ℵ₀ er ikke et tall man kan fylle.",
    },
    {
      pretitle: "Avsnitt 02 · Én ny gjest",
      title: "Forskyvning n → n+1",
      body: "En reisende banker på. Resepsjonen sender ut én enkelt instruksjon: hver gjest, gå fra rom n til rom n+1. Ingen blir skjøvet ut — det venter alltid et rom med høyere nummer — og 1 blir ledig for den nyankomne.",
    },
    {
      pretitle: "Avsnitt 03 · k nye gjester",
      title: "Forskyvning n → n+k",
      body: "En buss kommer med k passasjerer. Send hver eksisterende gjest fra rom n til rom n+k. Rommene 1 til k tømmes i én bevegelse; de k nyankomne går rett inn.",
    },
    {
      pretitle: "Avsnitt 04 · ℵ₀ nye gjester",
      title: "Forskyvning n → 2n; oddetallsrommene åpner seg",
      body: "Nå kommer en tellbart uendelig kø. Resepsjonen sender hver eksisterende gjest fra n til 2n: hvert partallsrom forblir tatt, hvert oddetallsrom blir ledig. De nye fyller 1, 3, 5, 7, … — likheten ℵ₀ + ℵ₀ = ℵ₀, utført i én enkelt kunngjøring.",
    },
    {
      pretitle: "Avsnitt 05 · ℵ₀ busser × ℵ₀ gjester",
      title: "Primtallspotenser sluker ℵ₀ × ℵ₀",
      body: "En flåte på ℵ₀ busser kjører frem, hver med ℵ₀ passasjerer. Send hver eksisterende gjest n til rom 2ⁿ, så passasjer m i buss k til rom pₖᵐ, der pₖ er det k-te oddetallsprimtallet. Aritmetikkens fundamentalteorem sikrer at ingen to gjester kolliderer — ℵ₀ × ℵ₀ = ℵ₀.",
    },
    {
      pretitle: "Avsnitt 06 · Den overtellbare broen",
      title: "ℝ slår hotellet",
      body: "Ta ett skritt til, og trikset brekker. Cantors diagonalargument fra 1891 viser at de reelle tallene i [0,1] ikke engang kan listes: for enhver foreslått oppramsing skiller et nytt reelt tall seg fra rad n ved det n-te sifferet. De reelle er overtellbare; hotellet er ikke stort nok.",
    },
  ],
  closingTitle: "Åpne Utforskeren.",
  closingBody:
    "Spill av de fire forskyvningene igjen, se primtallspotens-tildelingen lande buss for buss, og gå så over til Cantors diagonal for å se hvorfor akkurat dette trikset til slutt ikke fungerer.",
  ctaLabel: "→ Åpne Utforskeren",
  inlineCaption: "Hilberts hotell — animer en forskyvning",
  inlineOne: "+1 gjest",
  inlineK: "+k gjester",
  inlineInfinite: "+ℵ₀ gjester",
  inlineBuses: "+ℵ₀ busser × ℵ₀",
  inlineReset: "↺ nullstill",
  inlineFormulaLabel: "forskyvning",
  inlineHint:
    "Velg et scenario. Den ravgule pulsen er forskyvningen, cyanrutene er nykommerne, rosa er en busspassasjer. Etikettene viser opprinnelig rom (eller buss·sete for passasjerer).",
  inlineNewGuest: "ny",
  inlineExistingGuest: "eksisterende",
  inlineBusGuest: "buss",
  inlineGapNote:
    "Grå ∅-rom er tall som ikke er en primtallspotens — ingen havner der, de forblir tomme. Skjemaet sløser med rom, men kolliderer aldri.",
  cardinalityCaption: "Bijeksjonslab — strekker hotellet fortsatt til?",
  cardinalityDoubles: "ℕ ↔ 2ℕ",
  cardinalityPairs: "ℕ ↔ ℕ × ℕ",
  cardinalityReals: "ℕ → ℝ ?",
  cardinalitySlider: "rader",
  cardinalityHint:
    "De to første modusene viser en ren bijeksjon — tellbar. Den tredje prøver å ramse opp de reelle; det diagonale reelle tallet nederst skiller seg fra hver rad, så ingen liste over reelle tall kan være fullstendig. Se /cantor for hele argumentet.",
  cardinalityCountable: "ℵ₀",
  cardinalityUncountable: "overtellbar",
  cardinalityBijection: "bijeksjon",
  cardinalityNoBijection: "ingen bijeksjon",
  primeTableTitle: "Primtallspotens-tildeling",
  primeTableHeadWho: "Hvem",
  primeTableHeadRoom: "Rom",
  primeTableHeadFirst: "Første rom",
  primeTableRowExisting: "Eksisterende gjest n",
  primeTableRowBus1: "Buss 1, passasjer m",
  primeTableRowBus2: "Buss 2, passasjer m",
  primeTableRowBus3: "Buss 3, passasjer m",
  primeTableRowBusK: "Buss k, passasjer m",
  primeTableNote:
    "Den entydige primtallsfaktoriseringen garanterer at to passasjerer aldri ber om samme rom. Mange romnummer (6, 10, 12, 14, …) forblir tomme: det er rikelig med slark.",
  cantorLinkLabel: "→ /cantor · hele diagonalargumentet",
  takeItFurther: "Gå videre",
};

const RICH_STORY: Record<Locale, RichStory> = { en, de, es, fr, it, pt, sv, no };

export default function HilbertHotelStory() {
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
      ctaHref="/hilberthotel/explorer"
      accent={ACCENT}
      borderAccent="border-signal-rose/70"
      bgAccent="bg-signal-rose/10"
      hoverAccent="hover:bg-signal-rose/20"
      gradient="from-signal-rose/10"
      formulaBadge="ℵ₀ + 1 = ℵ₀  ·  ℵ₀ + ℵ₀ = ℵ₀  ·  ℵ₀ × ℵ₀ = ℵ₀"
      formulaLatex={
        "\\aleph_0 + 1 \\;=\\; \\aleph_0 + \\aleph_0 \\;=\\; \\aleph_0 \\times \\aleph_0 \\;=\\; \\aleph_0"
      }
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

      {/* Section 01 — Countably infinite */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec0!.pretitle}
          title={sec0!.title}
          body={sec0!.body}
          accent={ACCENT}
        />
      </section>

      {/* Section 02 — One new guest */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec1!.pretitle}
          title={sec1!.title}
          body={sec1!.body}
          accent={ACCENT}
        />
      </section>

      {/* Section 03 — k new guests */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec2!.pretitle}
          title={sec2!.title}
          body={sec2!.body}
          accent={ACCENT}
        />
      </section>

      {/* Section 04 — ℵ₀ new guests + inline hotel animation */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec3!.pretitle}
          title={sec3!.title}
          body={sec3!.body}
          accent={ACCENT}
        />
        <Reveal delay={120}>
          <HilbertHotelInline
            caption={story.inlineCaption}
            oneLabel={story.inlineOne}
            kLabel={story.inlineK}
            infiniteLabel={story.inlineInfinite}
            busesLabel={story.inlineBuses}
            resetLabel={story.inlineReset}
            formulaLabel={story.inlineFormulaLabel}
            hintLabel={story.inlineHint}
            newGuestLabel={story.inlineNewGuest}
            existingGuestLabel={story.inlineExistingGuest}
            busGuestLabel={story.inlineBusGuest}
            gapNoteLabel={story.inlineGapNote}
          />
        </Reveal>
      </section>

      {/* Section 05 — ℵ₀ buses × ℵ₀ guests */}
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
              {story.primeTableTitle}
            </div>
            <table className="w-full font-mono text-sm">
              <thead className="hairline border-b text-ink-300">
                <tr>
                  <th className="px-2 py-2 text-left text-[10px] uppercase tracking-widest">
                    {story.primeTableHeadWho}
                  </th>
                  <th className="px-2 py-2 text-left text-[10px] uppercase tracking-widest">
                    {story.primeTableHeadRoom}
                  </th>
                  <th className="px-2 py-2 text-left text-[10px] uppercase tracking-widest">
                    {story.primeTableHeadFirst}
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  [story.primeTableRowExisting, "2ⁿ", "2, 4, 8, 16, 32, …"],
                  [story.primeTableRowBus1, "3ᵐ", "3, 9, 27, 81, …"],
                  [story.primeTableRowBus2, "5ᵐ", "5, 25, 125, 625, …"],
                  [story.primeTableRowBus3, "7ᵐ", "7, 49, 343, …"],
                  [story.primeTableRowBusK, "pₖᵐ", "pₖ, pₖ², pₖ³, …"],
                ].map(([who, room, first]) => (
                  <tr key={who} className="border-b border-ink-700/30 last:border-0">
                    <td className="px-2 py-2 text-ink-200">{who}</td>
                    <td className="px-2 py-2 text-signal-rose">{room}</td>
                    <td className="px-2 py-2 text-ink-300">{first}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="pt-2 text-xs leading-relaxed text-ink-400">{story.primeTableNote}</p>
          </div>
        </Reveal>
      </section>

      {/* Section 06 — The uncountable bridge + cardinality demo */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec5!.pretitle}
          title={sec5!.title}
          body={sec5!.body}
          accent={ACCENT}
        />
        <Reveal delay={120}>
          <HilbertHotelCardinality
            caption={story.cardinalityCaption}
            modeDoublesLabel={story.cardinalityDoubles}
            modePairsLabel={story.cardinalityPairs}
            modeRealsLabel={story.cardinalityReals}
            sliderLabel={story.cardinalitySlider}
            hintLabel={story.cardinalityHint}
            countableLabel={story.cardinalityCountable}
            uncountableLabel={story.cardinalityUncountable}
            bijectionLabel={story.cardinalityBijection}
            noBijectionLabel={story.cardinalityNoBijection}
          />
        </Reveal>
        <Reveal delay={200}>
          <div className="text-center">
            <Link
              href="/cantor"
              className="hairline inline-block rounded-full border px-4 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-signal-rose/50 hover:text-signal-rose"
            >
              {story.cantorLinkLabel}
            </Link>
          </div>
        </Reveal>
      </section>

      {/* Closing CTA */}
      <Reveal>
        <section className="glass hairline mx-auto mb-16 max-w-3xl space-y-6 rounded-3xl border p-10 text-center">
          <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
            {story.takeItFurther}
          </div>
          <div className="math-italic shimmer-text text-3xl leading-tight md:text-5xl">
            {story.closingTitle}
          </div>
          <p className="leading-relaxed text-ink-200">{story.closingBody}</p>
          <Link
            href="/hilberthotel/explorer"
            className="inline-block rounded-full border border-signal-rose/70 bg-signal-rose/10 px-8 py-4 font-mono text-sm uppercase tracking-widest2 text-signal-rose transition-colors hover:bg-signal-rose/25"
          >
            {story.ctaLabel}
          </Link>
        </section>
      </Reveal>
    </StoryPageShell>
  );
}
