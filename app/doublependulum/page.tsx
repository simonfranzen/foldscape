"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { palette } from "@/lib/visual/palette";
import { StoryPageShell, StoryCard } from "@/components/StoryPageShell";
import { Reveal } from "@/components/Reveal";
import { DoublePendulumSim } from "@/components/DoublePendulumSim";
import { DoublePendulumTwin } from "@/components/DoublePendulumTwin";
import type { Locale } from "@/lib/i18n/types";
import type { StoryPage } from "@/lib/i18n/stories";

const ACCENT = "text-signal-coral";

// -----------------------------------------------------------------------------
// Rich locale-aware story content for the Double Pendulum page. We override
// the four-section base in stories.ts with a full hero + encounter + six
// deeper sections + closing prose in all eight supported locales.
// -----------------------------------------------------------------------------

type RichSection = { pretitle: string; title: string; body: string };

type RichStory = {
  page: StoryPage;
  encounter: {
    pretitle: string;
    title: string;
    cards: Array<{ label: string; title: string; body: string }>;
    tryIt: string;
  };
  sections: RichSection[]; // exactly 6
  simCaption: string;
  simTh1Label: string;
  simTh2Label: string;
  simPlay: string;
  simPause: string;
  simReset: string;
  simHint: string;
  twinCaption: string;
  twinCaptionA: string;
  twinCaptionB: string;
  twinPlay: string;
  twinPause: string;
  twinReset: string;
  twinTimeLabel: string;
  twinDivergenceLabel: string;
  twinLegend: string;
  lyapunovLabel: string;
  lyapunovValue: string;
  lyapunovNote: string;
  regimeQuasiLabel: string;
  regimeQuasiBody: string;
  regimeChaosLabel: string;
  regimeChaosBody: string;
  closingPill: string;
  closingTitle: string;
  closingBody: string;
  closingCta: string;
  finalLabel: string;
};

const RICH_STORY: Record<Locale, RichStory> = {
  en: {
    page: {
      pretitle: "Topic · Chaos",
      title: "The Double Pendulum",
      tagline: "Two angles, one mess, infinite futures.",
      intro:
        "Hang one pendulum from another and write down Lagrange's equations. The recipe is high-school physics. The motion is the textbook face of deterministic chaos — beautiful, bounded, and utterly unpredictable past a few seconds.",
      ctaInteractive: "→ Open the Explorer",
      sections: [
        {
          pretitle: "Step one · The setup",
          title: "Two pendulums, one bob hanging from another",
          body: "A rigid rod of length L₁ with a bob of mass m₁, pivoting under gravity. From that first bob, a second rod of length L₂ with a second bob m₂. Two angles, θ₁ and θ₂, measured from the vertical, plus their velocities — and that is the entire state.",
        },
        {
          pretitle: "Step two · The Lagrangian",
          title: "Kinetic minus potential, then crank Euler-Lagrange",
          body: "Write T (kinetic) and V (potential), form L = T − V, and Euler-Lagrange grinds out two coupled nonlinear second-order ODEs for θ̈₁ and θ̈₂. The coupling is through sin(θ₁−θ₂) and cos(θ₁−θ₂). No closed form exists; numerics is the only road in.",
        },
        {
          pretitle: "Step three · Chaos",
          title: "Small energy: pretty. Large energy: unpredictable.",
          body: "At low energy, gentle quasi-periodic motion on an invariant torus. Push past a critical energy and the system goes chaotic: the largest Lyapunov exponent turns positive, and a one-part-in-a-million difference at the start blows up to total disagreement within seconds.",
        },
        {
          pretitle: "Step four · Where it shows up",
          title: "Robots, walking, control theory, museums",
          body: "The same coupled-rotor equations describe two-link robotic arms, the swinging human leg in gait, compound oscillators in machinery, and the canonical hard problem of stabilising a pendulum upright. Every science museum has one swinging in a glass case, drawing a trace nobody can predict.",
        },
      ],
    },
    encounter: {
      pretitle: "First encounter",
      title: "Two rods, one pivot, an entire physics of chaos",
      cards: [
        {
          label: "01 · The big idea",
          title: "Hang a pendulum from a pendulum",
          body: "A swing has two angles, two velocities — four numbers. That is the entire state of the toy. And yet two starts that look identical to the eye will, within a handful of seconds, dance two completely different dances. The same equations, different futures. Determinism without predictability.",
        },
        {
          label: "02 · A concrete example",
          title: "90°, 90° vs. 90°, 90.00001°",
          body: "Start one pendulum at θ₁ = 90°, θ₂ = 90°. The tip traces a beautiful, intricate curve. Restart with θ₂ = 90.00001° — a hundred-thousandth of a degree of difference. The two curves coincide for a few seconds, then peel apart, and by ten seconds in they have nothing whatsoever to say to each other.",
        },
        {
          label: "03 · Why it matters",
          title: "Classical chaos, distilled into four numbers",
          body: "This is the purest example of chaos in a low-dimensional classical system. Just Newton's laws, just Lagrange's equations — no randomness anywhere. Yet sensitive dependence on initial conditions is on full display, in motion you can see, in a system you can build with two paperclips.",
        },
      ],
      tryIt:
        "Move the sliders below to set initial angles. Hit play and watch the tip trace its short, doomed history.",
    },
    sections: [
      {
        pretitle: "Section one · The Lagrangian",
        title: "Energy in, energy out, equations of motion",
        body: "Write the position of each bob: (x₁, y₁) for the first and (x₂, y₂) for the second, both as functions of θ₁ and θ₂. Differentiate to get velocities. The kinetic energy T is ½ m₁ v₁² + ½ m₂ v₂². The potential energy V is m₁ g y₁ + m₂ g y₂. Form the Lagrangian L = T − V — a single scalar function on the four-dimensional state space — and the entire dynamics is buried in it. Lagrange's deep insight, from 1788, is that you never need to draw a single free-body diagram: nature minimises an action, and the equations follow.",
      },
      {
        pretitle: "Section two · The coupled ODEs",
        title: "Euler-Lagrange grinds out two nonlinear equations",
        body: "Applying ∂L/∂θᵢ − d/dt(∂L/∂θ̇ᵢ) = 0 for i = 1, 2 yields two second-order ODEs. After solving for the angular accelerations θ̈₁ and θ̈₂, you get expressions full of sines, cosines, products of velocities, and a denominator that involves 2 m₁ + m₂ − m₂ cos(2θ₁ − 2θ₂). The equations are exact, deterministic, and completely free of friction or noise. They also admit no elementary closed-form solution. To watch the system, you integrate — RK4 is plenty.",
      },
      {
        pretitle: "Section three · Three regimes",
        title: "Quiet, wild, and the KAM tear between them",
        body: "At low total energy the motion lives on a smooth invariant torus in the 4D phase space — quasi-periodic, bounded, almost boring. Crank the energy up and the torus shreds: by the KAM theorem of Kolmogorov, Arnold and Moser, most invariant tori survive small perturbations, but as energy grows they break one by one until what is left is a chaotic sea. In the middle, a critical transition where islands of order coexist with stochastic layers. The double pendulum is a tabletop demonstration of the whole KAM story.",
      },
      {
        pretitle: "Section four · Lyapunov and the horizon",
        title: "A predictability ceiling, measured in seconds",
        body: "In the chaotic regime, two nearby trajectories drift apart roughly like ε · e^(λt), where λ is the largest Lyapunov exponent — positive, finite, and a property of the system, not the observer. Equivalently, the predictability horizon scales as t* ≈ (1/λ) · log(L/ε): every extra factor of ten in initial precision buys you only a constant number of seconds of foresight. No better stopwatch, no faster computer, no cleverer integrator can outrun the exponent.",
      },
      {
        pretitle: "Section five · Phase space and Poincaré",
        title: "Slicing the dance to see its shape",
        body: "The state lives in a 4D space (θ₁, θ₂, ω₁, ω₂). Pick a hyperplane — say, the moments when θ₁ = 0 with ω₁ > 0 — and record where the trajectory crosses it. The collection of crossings is a Poincaré section: at low energy a clean closed curve (the torus sliced once), at high energy a fuzzy two-dimensional cloud (the chaotic attractor), and at the critical energy a beautiful mix of curves and clouds — the geometric signature of the KAM transition.",
      },
      {
        pretitle: "Section six · Connections",
        title: "From robot arms to brain rhythms to Solar System chaos",
        body: "The same coupled-rotor mathematics governs two-link robotic arms (where control engineers fight to suppress the chaos), human gait (where a swinging leg is essentially a passive double pendulum), and chains of coupled oscillators that model power grids, heart pacemakers, and Kuramoto's universal synchronisation. The KAM mechanism behind the regime change also runs in the Solar System: the planets, modeled carefully enough, are chaotic on Gigayear timescales.",
      },
    ],
    simCaption: "Live · double pendulum",
    simTh1Label: "θ₁",
    simTh2Label: "θ₂",
    simPlay: "Play",
    simPause: "Pause",
    simReset: "Reset",
    simHint: "Slide θ₁, θ₂ to set initial angles. Velocities start at zero.",
    twinCaption: "Sensitive dependence · two near-identical starts",
    twinCaptionA: "Pendulum A · θ₁ = 120°",
    twinCaptionB: "Pendulum B · θ₁ = 120° + 10⁻⁵°",
    twinPlay: "Play",
    twinPause: "Pause",
    twinReset: "Reset",
    twinTimeLabel: "t",
    twinDivergenceLabel: "|Δ|",
    twinLegend:
      "Two pendulums. Same rods, same masses, same gravity. Initial angles differ by one hundred-thousandth of a degree. After a few seconds they have nothing in common.",
    lyapunovLabel: "Largest Lyapunov exponent",
    lyapunovValue: "λ > 0",
    lyapunovNote:
      "In the chaotic regime, gaps grow like e^(λt) — and the predictability horizon scales only as log(1/ε).",
    regimeQuasiLabel: "Low energy",
    regimeQuasiBody:
      "Smooth quasi-periodic swing. The trajectory winds an invariant torus and never settles, never escapes.",
    regimeChaosLabel: "High energy",
    regimeChaosBody:
      "Chaos. The torus has shredded; trajectories fill a fuzzy region of phase space, and no two starts agree for long.",
    closingPill: "Open the Explorer",
    closingTitle: "Hold the chaos in your hands",
    closingBody:
      "The Explorer integrates the equations live, lets you tune masses, lengths, and the two initial angles, and races two near-identical starts side by side. You can also draw Poincaré sections and watch the KAM tori shred as you crank up the energy.",
    closingCta: "→ Open the Explorer",
    finalLabel: "Let it loose.",
  },
  de: {
    page: {
      pretitle: "Thema · Chaos",
      title: "Das Doppelpendel",
      tagline: "Zwei Winkel, ein Chaos, unendliche Zukünfte.",
      intro:
        "Häng ein Pendel an ein Pendel und schreib Lagranges Gleichungen hin. Das Rezept ist Schulphysik. Die Bewegung ist das Schulbeispiel deterministischen Chaos — schön, beschränkt und nach wenigen Sekunden vollkommen unvorhersehbar.",
      ctaInteractive: "→ Explorer öffnen",
      sections: [
        {
          pretitle: "Schritt eins · Der Aufbau",
          title: "Zwei Pendel, ein Bob hängt am anderen",
          body: "Ein starrer Stab der Länge L₁ mit einer Masse m₁ am Ende, der unter der Schwerkraft schwingt. An diesem ersten Bob hängt ein zweiter Stab der Länge L₂ mit Masse m₂. Zwei Winkel θ₁ und θ₂ gegen die Vertikale, dazu ihre Winkelgeschwindigkeiten — das ist der gesamte Zustand.",
        },
        {
          pretitle: "Schritt zwei · Die Lagrange-Funktion",
          title: "Kinetisch minus potentiell, dann Euler-Lagrange",
          body: "Schreib T (kinetisch) und V (potentiell), bilde L = T − V, und Euler-Lagrange wirft zwei gekoppelte nichtlineare ODEs zweiter Ordnung für θ̈₁ und θ̈₂ aus. Die Kopplung läuft über sin(θ₁−θ₂) und cos(θ₁−θ₂). Keine geschlossene Lösung; nur Numerik führt rein.",
        },
        {
          pretitle: "Schritt drei · Chaos",
          title: "Niedrige Energie: schön. Hohe Energie: unvorhersehbar.",
          body: "Bei niedriger Energie sanfte quasiperiodische Bewegung auf einem invarianten Torus. Über eine kritische Energie hinaus wird das System chaotisch: der größte Lyapunov-Exponent wird positiv, und ein Unterschied von eins zu einer Million am Start wird in Sekunden zur völligen Uneinigkeit.",
        },
        {
          pretitle: "Schritt vier · Wo es auftaucht",
          title: "Roboter, Gehen, Regelungstheorie, Museen",
          body: "Dieselben Gleichungen beschreiben zweigliedrige Roboterarme, das schwingende Bein beim Gehen, zusammengesetzte Oszillatoren in der Maschinenwelt — und das klassische Problem, ein Pendel aufrecht zu stabilisieren. Jedes Wissenschaftsmuseum hat eins im Glaskasten, das Bahnen zieht, die niemand vorhersagen kann.",
        },
      ],
    },
    encounter: {
      pretitle: "Erste Begegnung",
      title: "Zwei Stäbe, ein Drehpunkt — eine ganze Chaosphysik",
      cards: [
        {
          label: "01 · Die große Idee",
          title: "Häng ein Pendel an ein Pendel",
          body: "Eine Doppelschwingung hat zwei Winkel und zwei Geschwindigkeiten — vier Zahlen. Das ist der ganze Zustand. Und trotzdem tanzen zwei Starts, die für das Auge identisch aussehen, nach wenigen Sekunden völlig verschiedene Tänze. Dieselben Gleichungen, andere Zukünfte. Determinismus ohne Vorhersagbarkeit.",
        },
        {
          label: "02 · Ein konkretes Beispiel",
          title: "90°, 90° gegen 90°, 90.00001°",
          body: "Starte ein Pendel bei θ₁ = 90°, θ₂ = 90°. Die Spitze zeichnet eine schöne, verschlungene Kurve. Neustart mit θ₂ = 90.00001° — ein Hunderttausendstel Grad Unterschied. Die beiden Kurven decken sich ein paar Sekunden, lösen sich dann ab, und nach zehn Sekunden haben sie einander nichts mehr zu sagen.",
        },
        {
          label: "03 · Warum es zählt",
          title: "Klassisches Chaos, eingedampft auf vier Zahlen",
          body: "Das ist das reinste Beispiel von Chaos in einem niedrigdimensionalen klassischen System. Nur Newtons Gesetze, nur Lagranges Gleichungen — keine Zufälligkeit. Trotzdem ist die sensitive Abhängigkeit von Anfangsbedingungen voll sichtbar, in einer Bewegung, die man sieht, an einem System, das aus zwei Büroklammern entsteht.",
        },
      ],
      tryIt:
        "Verschieb unten die Regler für die Startwinkel. Drück Play und sieh zu, wie die Spitze ihre kurze, verlorene Geschichte zeichnet.",
    },
    sections: [
      {
        pretitle: "Abschnitt eins · Die Lagrange-Funktion",
        title: "Energie rein, Energie raus, Bewegungsgleichungen",
        body: "Schreib die Position jedes Bobs: (x₁, y₁) für den ersten und (x₂, y₂) für den zweiten, beide als Funktion von θ₁ und θ₂. Ableiten gibt Geschwindigkeiten. Die kinetische Energie T ist ½ m₁ v₁² + ½ m₂ v₂². Die potentielle Energie V ist m₁ g y₁ + m₂ g y₂. Bilde L = T − V — eine einzige skalare Funktion auf dem vierdimensionalen Zustandsraum — und die ganze Dynamik steckt darin. Lagranges tiefe Einsicht von 1788: man braucht keine Freikörperbilder, die Natur minimiert eine Wirkung und die Gleichungen folgen.",
      },
      {
        pretitle: "Abschnitt zwei · Die gekoppelten ODEs",
        title: "Euler-Lagrange spuckt zwei nichtlineare Gleichungen aus",
        body: "Mit ∂L/∂θᵢ − d/dt(∂L/∂θ̇ᵢ) = 0 für i = 1, 2 entstehen zwei ODEs zweiter Ordnung. Auflösen nach den Winkelbeschleunigungen θ̈₁ und θ̈₂ liefert Ausdrücke voller Sinus, Kosinus, Produkte von Geschwindigkeiten und einem Nenner mit 2 m₁ + m₂ − m₂ cos(2θ₁ − 2θ₂). Die Gleichungen sind exakt, deterministisch, ohne Reibung und ohne Rauschen — und ohne elementare geschlossene Lösung. Wer zusehen will, integriert. RK4 reicht.",
      },
      {
        pretitle: "Abschnitt drei · Drei Regime",
        title: "Ruhig, wild und der KAM-Riss dazwischen",
        body: "Bei niedriger Gesamtenergie liegt die Bewegung auf einem glatten invarianten Torus im 4D-Phasenraum — quasiperiodisch, beschränkt, fast langweilig. Drehst du die Energie hoch, zerreißt der Torus: nach dem KAM-Satz von Kolmogorow, Arnold und Moser überleben die meisten invarianten Tori kleine Störungen, mit wachsender Energie brechen sie aber Stück für Stück, bis ein chaotisches Meer übrigbleibt. Dazwischen ein kritischer Übergang, in dem Inseln der Ordnung neben stochastischen Schichten existieren. Das Doppelpendel ist die Tischvorführung der gesamten KAM-Geschichte.",
      },
      {
        pretitle: "Abschnitt vier · Lyapunov und der Horizont",
        title: "Eine Vorhersagedecke, gemessen in Sekunden",
        body: "Im chaotischen Regime driften zwei nahe Bahnen ungefähr wie ε · e^(λt) auseinander, wobei λ der größte Lyapunov-Exponent ist — positiv, endlich, eine Eigenschaft des Systems, nicht des Beobachters. Der Vorhersagehorizont skaliert dann wie t* ≈ (1/λ) · log(L/ε): jeder weitere Faktor zehn an Anfangsgenauigkeit kauft dir nur konstant viele Sekunden Vorausschau. Keine bessere Uhr, kein schnellerer Rechner, kein klügerer Integrator schlägt den Exponenten.",
      },
      {
        pretitle: "Abschnitt fünf · Phasenraum und Poincaré",
        title: "Den Tanz aufschneiden, um seine Form zu sehen",
        body: "Der Zustand lebt in einem 4D-Raum (θ₁, θ₂, ω₁, ω₂). Wähl eine Hyperebene — etwa die Momente, in denen θ₁ = 0 mit ω₁ > 0 — und vermerke, wo die Bahn sie kreuzt. Die Sammlung der Schnittpunkte ist ein Poincaré-Schnitt: bei niedriger Energie eine saubere geschlossene Kurve (der Torus einmal angeschnitten), bei hoher Energie eine flauschige zweidimensionale Wolke (der chaotische Attraktor), bei kritischer Energie eine schöne Mischung aus Kurven und Wolken — das geometrische Signal des KAM-Übergangs.",
      },
      {
        pretitle: "Abschnitt sechs · Verbindungen",
        title: "Von Roboterarmen über Hirnrhythmen zum Chaos im Sonnensystem",
        body: "Dieselbe gekoppelte Mathematik regelt zweigliedrige Roboterarme (wo Regelungstechniker das Chaos bekämpfen), den menschlichen Gang (wo das schwingende Bein im Wesentlichen ein passives Doppelpendel ist) und Ketten gekoppelter Oszillatoren in Stromnetzen, Herzschrittmachern und Kuramotos universeller Synchronisation. Der KAM-Mechanismus hinter dem Regimewechsel läuft auch im Sonnensystem: die Planeten, sorgfältig modelliert, sind auf Gigajahre-Skalen chaotisch.",
      },
    ],
    simCaption: "Live · Doppelpendel",
    simTh1Label: "θ₁",
    simTh2Label: "θ₂",
    simPlay: "Start",
    simPause: "Pause",
    simReset: "Zurück",
    simHint: "Schieb θ₁, θ₂ für die Startwinkel. Geschwindigkeiten beginnen bei null.",
    twinCaption: "Sensitive Abhängigkeit · zwei fast identische Starts",
    twinCaptionA: "Pendel A · θ₁ = 120°",
    twinCaptionB: "Pendel B · θ₁ = 120° + 10⁻⁵°",
    twinPlay: "Start",
    twinPause: "Pause",
    twinReset: "Zurück",
    twinTimeLabel: "t",
    twinDivergenceLabel: "|Δ|",
    twinLegend:
      "Zwei Pendel. Dieselben Stäbe, dieselben Massen, dieselbe Schwerkraft. Startwinkel unterscheiden sich um ein Hunderttausendstel Grad. Nach wenigen Sekunden haben sie nichts mehr gemein.",
    lyapunovLabel: "Größter Lyapunov-Exponent",
    lyapunovValue: "λ > 0",
    lyapunovNote:
      "Im chaotischen Regime wachsen Abstände wie e^(λt) — und der Vorhersagehorizont skaliert nur wie log(1/ε).",
    regimeQuasiLabel: "Niedrige Energie",
    regimeQuasiBody:
      "Glattes quasiperiodisches Schwingen. Die Bahn wickelt einen invarianten Torus, kommt nie zur Ruhe, entwischt nie.",
    regimeChaosLabel: "Hohe Energie",
    regimeChaosBody:
      "Chaos. Der Torus ist zerrissen; Bahnen füllen einen flauschigen Bereich des Phasenraums, und keine zwei Starts bleiben lange einig.",
    closingPill: "Explorer öffnen",
    closingTitle: "Halt das Chaos in den Händen",
    closingBody:
      "Der Explorer integriert die Gleichungen live, lässt dich Massen, Längen und die zwei Startwinkel stellen und stellt zwei fast identische Starts nebeneinander. Du kannst auch Poincaré-Schnitte zeichnen und den KAM-Tori beim Zerfetzen zuschauen, während du die Energie hochdrehst.",
    closingCta: "→ Explorer öffnen",
    finalLabel: "Lass es los.",
  },
  es: {
    page: {
      pretitle: "Tema · Caos",
      title: "El Péndulo Doble",
      tagline: "Dos ángulos, un lío, infinitos futuros.",
      intro:
        "Cuelga un péndulo de otro y escribe las ecuaciones de Lagrange. La receta es física de instituto. El movimiento es la cara de manual del caos determinista — bello, acotado y totalmente impredecible pasados unos segundos.",
      ctaInteractive: "→ Abrir el Explorer",
      sections: [
        {
          pretitle: "Paso uno · El montaje",
          title: "Dos péndulos, una masa colgando de otra",
          body: "Una varilla rígida de longitud L₁ con una masa m₁ en el extremo, pivotando bajo la gravedad. De esa primera masa cuelga una segunda varilla L₂ con masa m₂. Dos ángulos θ₁ y θ₂ medidos desde la vertical, junto a sus velocidades — ese es todo el estado.",
        },
        {
          pretitle: "Paso dos · El lagrangiano",
          title: "Cinética menos potencial, luego Euler-Lagrange",
          body: "Escribe T (cinética) y V (potencial), forma L = T − V, y Euler-Lagrange escupe dos EDO no lineales de segundo orden para θ̈₁ y θ̈₂. El acoplamiento va por sin(θ₁−θ₂) y cos(θ₁−θ₂). No hay forma cerrada; solo numérico.",
        },
        {
          pretitle: "Paso tres · Caos",
          title: "Energía baja: bonito. Energía alta: impredecible.",
          body: "A baja energía, movimiento cuasiperiódico suave sobre un toro invariante. Pasa una energía crítica y el sistema se vuelve caótico: el mayor exponente de Lyapunov se vuelve positivo, y una diferencia de una parte en un millón al inicio explota a desacuerdo total en segundos.",
        },
        {
          pretitle: "Paso cuatro · Dónde aparece",
          title: "Robots, marcha, teoría de control, museos",
          body: "Las mismas ecuaciones describen brazos robóticos de dos eslabones, la pierna humana al caminar, osciladores compuestos en maquinaria, y el problema canónico de estabilizar un péndulo vertical. Cada museo de ciencia tiene uno oscilando en una vitrina, trazando una traza que nadie puede predecir.",
        },
      ],
    },
    encounter: {
      pretitle: "Primer encuentro",
      title: "Dos varillas, un pivote — toda una física del caos",
      cards: [
        {
          label: "01 · La gran idea",
          title: "Cuelga un péndulo de un péndulo",
          body: "Un balanceo tiene dos ángulos y dos velocidades — cuatro números. Ese es el estado entero. Y sin embargo dos arranques que al ojo son idénticos, en unos segundos bailan dos danzas completamente distintas. Las mismas ecuaciones, otros futuros. Determinismo sin predictibilidad.",
        },
        {
          label: "02 · Un ejemplo concreto",
          title: "90°, 90° frente a 90°, 90.00001°",
          body: "Arranca un péndulo en θ₁ = 90°, θ₂ = 90°. La punta dibuja una curva bonita y enredada. Reinicia con θ₂ = 90.00001° — una cienmilésima de grado de diferencia. Las dos curvas coinciden unos segundos, luego se separan, y a los diez segundos ya no tienen nada en común.",
        },
        {
          label: "03 · Por qué importa",
          title: "Caos clásico, condensado en cuatro números",
          body: "Es el ejemplo más puro de caos en un sistema clásico de baja dimensión. Solo Newton, solo Lagrange — sin aleatoriedad. Y aun así la dependencia sensible a las condiciones iniciales se ve plenamente, en un movimiento visible, en un sistema que armas con dos clips.",
        },
      ],
      tryIt:
        "Mueve los deslizadores para fijar los ángulos iniciales. Pulsa play y mira cómo la punta dibuja su breve historia condenada.",
    },
    sections: [
      {
        pretitle: "Sección uno · El lagrangiano",
        title: "Energía dentro, energía fuera, ecuaciones de movimiento",
        body: "Escribe la posición de cada masa: (x₁, y₁) para la primera y (x₂, y₂) para la segunda, ambas como funciones de θ₁ y θ₂. Deriva para obtener velocidades. La energía cinética T es ½ m₁ v₁² + ½ m₂ v₂². La potencial V es m₁ g y₁ + m₂ g y₂. Forma L = T − V — una sola función escalar en el espacio de estados 4D — y toda la dinámica está dentro. La intuición profunda de Lagrange, de 1788: no hacen falta diagramas de cuerpo libre, la naturaleza minimiza una acción y las ecuaciones salen solas.",
      },
      {
        pretitle: "Sección dos · Las EDO acopladas",
        title: "Euler-Lagrange produce dos ecuaciones no lineales",
        body: "Aplicando ∂L/∂θᵢ − d/dt(∂L/∂θ̇ᵢ) = 0 para i = 1, 2 salen dos EDO de segundo orden. Despejando θ̈₁ y θ̈₂ aparecen expresiones llenas de senos, cosenos, productos de velocidades y un denominador con 2 m₁ + m₂ − m₂ cos(2θ₁ − 2θ₂). Las ecuaciones son exactas, deterministas, sin fricción ni ruido — y sin solución cerrada elemental. Para verlas moverse, integras. RK4 basta.",
      },
      {
        pretitle: "Sección tres · Tres regímenes",
        title: "Tranquilo, salvaje y la rasgadura KAM entre ambos",
        body: "A baja energía total el movimiento vive en un toro invariante suave del espacio de fases 4D — cuasiperiódico, acotado, casi aburrido. Sube la energía y el toro se rompe: el teorema KAM de Kolmogórov, Arnold y Moser dice que la mayoría de los toros invariantes sobrevive a pequeñas perturbaciones, pero al crecer la energía se rompen uno a uno hasta quedar un mar caótico. Entre medias, una transición crítica donde islas de orden conviven con capas estocásticas. El péndulo doble demuestra toda la historia KAM sobre la mesa.",
      },
      {
        pretitle: "Sección cuatro · Lyapunov y el horizonte",
        title: "Un techo de previsibilidad medido en segundos",
        body: "En el régimen caótico, dos trayectorias cercanas se alejan aproximadamente como ε · e^(λt), donde λ es el mayor exponente de Lyapunov — positivo, finito, propiedad del sistema, no del observador. El horizonte de previsibilidad escala entonces como t* ≈ (1/λ) · log(L/ε): cada factor diez más de precisión inicial te compra solo una cantidad constante de segundos. Ningún cronómetro mejor, ningún ordenador más rápido, ningún integrador más listo gana al exponente.",
      },
      {
        pretitle: "Sección cinco · Espacio de fases y Poincaré",
        title: "Cortar la danza para ver su forma",
        body: "El estado vive en un espacio 4D (θ₁, θ₂, ω₁, ω₂). Elige un hiperplano — por ejemplo los instantes en que θ₁ = 0 con ω₁ > 0 — y anota dónde lo cruza la trayectoria. El conjunto de cruces es una sección de Poincaré: a baja energía una curva cerrada limpia (el toro cortado una vez), a alta energía una nube borrosa 2D (el atractor caótico), y a energía crítica una mezcla preciosa de curvas y nubes — la firma geométrica de la transición KAM.",
      },
      {
        pretitle: "Sección seis · Conexiones",
        title: "De brazos robot a ritmos cerebrales y al caos del Sistema Solar",
        body: "La misma matemática de rotores acoplados rige los brazos robóticos de dos eslabones (donde la ingeniería de control lucha por suprimir el caos), la marcha humana (con la pierna oscilante esencialmente como péndulo doble pasivo), y cadenas de osciladores acoplados que modelan redes eléctricas, marcapasos cardíacos y la sincronización universal de Kuramoto. El mecanismo KAM tras el cambio de régimen corre también en el Sistema Solar: los planetas, modelados con cuidado, son caóticos en escalas de gigaaño.",
      },
    ],
    simCaption: "En vivo · péndulo doble",
    simTh1Label: "θ₁",
    simTh2Label: "θ₂",
    simPlay: "Reproducir",
    simPause: "Pausa",
    simReset: "Reiniciar",
    simHint: "Mueve θ₁, θ₂ para fijar los ángulos iniciales. Las velocidades arrancan en cero.",
    twinCaption: "Dependencia sensible · dos arranques casi idénticos",
    twinCaptionA: "Péndulo A · θ₁ = 120°",
    twinCaptionB: "Péndulo B · θ₁ = 120° + 10⁻⁵°",
    twinPlay: "Reproducir",
    twinPause: "Pausa",
    twinReset: "Reiniciar",
    twinTimeLabel: "t",
    twinDivergenceLabel: "|Δ|",
    twinLegend:
      "Dos péndulos. Mismas varillas, mismas masas, misma gravedad. Ángulos iniciales que difieren en una cienmilésima de grado. En unos segundos no tienen nada en común.",
    lyapunovLabel: "Mayor exponente de Lyapunov",
    lyapunovValue: "λ > 0",
    lyapunovNote:
      "En el régimen caótico, las separaciones crecen como e^(λt) — y el horizonte de previsibilidad escala solo como log(1/ε).",
    regimeQuasiLabel: "Energía baja",
    regimeQuasiBody:
      "Oscilación cuasiperiódica suave. La trayectoria envuelve un toro invariante, no se asienta, no escapa.",
    regimeChaosLabel: "Energía alta",
    regimeChaosBody:
      "Caos. El toro se ha rasgado; las trayectorias llenan una región borrosa del espacio de fases y ningún par de arranques se mantiene de acuerdo.",
    closingPill: "Abrir el Explorer",
    closingTitle: "Sostén el caos entre las manos",
    closingBody:
      "El Explorer integra las ecuaciones en vivo, te deja afinar masas, longitudes y los dos ángulos iniciales, y enfrenta dos arranques casi idénticos lado a lado. También puedes dibujar secciones de Poincaré y ver los toros KAM rasgarse al subir la energía.",
    closingCta: "→ Abrir el Explorer",
    finalLabel: "Suéltalo.",
  },
  fr: {
    page: {
      pretitle: "Sujet · Chaos",
      title: "Le Pendule Double",
      tagline: "Deux angles, un chaos, des futurs infinis.",
      intro:
        "Suspends un pendule à un autre et écris les équations de Lagrange. La recette est de la physique de lycée. Le mouvement est le visage de manuel du chaos déterministe — beau, borné, et tout à fait imprévisible passé quelques secondes.",
      ctaInteractive: "→ Ouvrir l'Explorer",
      sections: [
        {
          pretitle: "Étape un · Le montage",
          title: "Deux pendules, une masse suspendue à une autre",
          body: "Une tige rigide de longueur L₁ avec une masse m₁ au bout, pivotant sous la gravité. À cette première masse on accroche une seconde tige L₂ avec une masse m₂. Deux angles θ₁ et θ₂ mesurés depuis la verticale, plus leurs vitesses — voilà tout l'état.",
        },
        {
          pretitle: "Étape deux · Le lagrangien",
          title: "Cinétique moins potentiel, puis Euler-Lagrange",
          body: "Écris T (cinétique) et V (potentiel), forme L = T − V, et Euler-Lagrange recrache deux EDO non linéaires d'ordre deux pour θ̈₁ et θ̈₂. Le couplage passe par sin(θ₁−θ₂) et cos(θ₁−θ₂). Pas de forme close; seule la numérique entre.",
        },
        {
          pretitle: "Étape trois · Chaos",
          title: "Petite énergie : joli. Grande énergie : imprévisible.",
          body: "À basse énergie, mouvement quasi-périodique doux sur un tore invariant. Passe une énergie critique et le système devient chaotique : le plus grand exposant de Lyapunov devient positif, et un écart d'un sur un million au départ devient un désaccord total en quelques secondes.",
        },
        {
          pretitle: "Étape quatre · Où ça apparaît",
          title: "Robots, marche, théorie du contrôle, musées",
          body: "Les mêmes équations décrivent les bras robotiques à deux segments, la jambe humaine en marche, des oscillateurs composés en mécanique, et le problème canonique de stabiliser un pendule à la verticale. Chaque musée des sciences en a un qui se balance dans une vitrine, traçant une trace que personne ne peut prédire.",
        },
      ],
    },
    encounter: {
      pretitle: "Première rencontre",
      title: "Deux tiges, un pivot — toute une physique du chaos",
      cards: [
        {
          label: "01 · La grande idée",
          title: "Suspends un pendule à un pendule",
          body: "Un balancier a deux angles et deux vitesses — quatre nombres. C'est tout l'état du jouet. Et pourtant deux départs qui semblent identiques à l'œil dansent, en quelques secondes, deux danses totalement différentes. Mêmes équations, futurs différents. Déterminisme sans prévisibilité.",
        },
        {
          label: "02 · Un exemple concret",
          title: "90°, 90° contre 90°, 90,00001°",
          body: "Lance un pendule à θ₁ = 90°, θ₂ = 90°. La pointe trace une belle courbe entremêlée. Recommence avec θ₂ = 90,00001° — un cent-millième de degré d'écart. Les deux courbes coïncident quelques secondes, se détachent, et à dix secondes elles n'ont plus rien à se dire.",
        },
        {
          label: "03 · Pourquoi ça compte",
          title: "Le chaos classique, distillé en quatre nombres",
          body: "C'est l'exemple le plus pur de chaos dans un système classique de basse dimension. Juste Newton, juste Lagrange — aucune aléatoire. Et pourtant la dépendance sensible aux conditions initiales s'affiche pleinement, dans un mouvement visible, dans un système que tu peux bricoler avec deux trombones.",
        },
      ],
      tryIt:
        "Déplace les curseurs pour fixer les angles initiaux. Appuie sur play et regarde la pointe dessiner sa courte histoire condamnée.",
    },
    sections: [
      {
        pretitle: "Section un · Le lagrangien",
        title: "Énergie entrée, énergie sortie, équations du mouvement",
        body: "Écris la position de chaque masse : (x₁, y₁) pour la première et (x₂, y₂) pour la seconde, toutes deux en fonction de θ₁ et θ₂. Dérive pour obtenir les vitesses. L'énergie cinétique T vaut ½ m₁ v₁² + ½ m₂ v₂². L'énergie potentielle V vaut m₁ g y₁ + m₂ g y₂. Forme L = T − V — une seule fonction scalaire sur l'espace d'état 4D — et toute la dynamique y est enfouie. Intuition profonde de Lagrange, 1788 : pas besoin de diagrammes du corps libre, la nature minimise une action et les équations suivent.",
      },
      {
        pretitle: "Section deux · Les EDO couplées",
        title: "Euler-Lagrange recrache deux équations non linéaires",
        body: "En appliquant ∂L/∂θᵢ − d/dt(∂L/∂θ̇ᵢ) = 0 pour i = 1, 2 on obtient deux EDO d'ordre deux. Après résolution en θ̈₁ et θ̈₂, on tombe sur des expressions pleines de sinus, cosinus, produits de vitesses, et un dénominateur en 2 m₁ + m₂ − m₂ cos(2θ₁ − 2θ₂). Les équations sont exactes, déterministes, sans frottement ni bruit — et sans solution close élémentaire. Pour voir, on intègre. RK4 suffit largement.",
      },
      {
        pretitle: "Section trois · Trois régimes",
        title: "Calme, sauvage, et la déchirure KAM entre les deux",
        body: "À basse énergie totale, le mouvement vit sur un tore invariant lisse dans l'espace de phase 4D — quasi-périodique, borné, presque ennuyeux. Monte l'énergie et le tore se déchire : le théorème KAM de Kolmogorov, Arnold et Moser dit que la plupart des tores invariants survivent à de petites perturbations, mais que la croissance de l'énergie les casse un par un jusqu'à laisser une mer chaotique. Au milieu, une transition critique où des îles d'ordre cohabitent avec des couches stochastiques. Le pendule double est la démonstration de salon de toute l'histoire KAM.",
      },
      {
        pretitle: "Section quatre · Lyapunov et l'horizon",
        title: "Un plafond de prévisibilité, en secondes",
        body: "Dans le régime chaotique, deux trajectoires voisines s'écartent à peu près comme ε · e^(λt), où λ est le plus grand exposant de Lyapunov — positif, fini, propriété du système et non de l'observateur. L'horizon de prévisibilité s'écrit alors t* ≈ (1/λ) · log(L/ε) : chaque facteur dix gagné sur la précision initiale ne rachète qu'un nombre constant de secondes. Aucun chronomètre, aucun ordinateur, aucun intégrateur ne distance l'exposant.",
      },
      {
        pretitle: "Section cinq · Espace de phase et Poincaré",
        title: "Trancher la danse pour en voir la forme",
        body: "L'état vit dans un espace 4D (θ₁, θ₂, ω₁, ω₂). Choisis un hyperplan — disons les instants où θ₁ = 0 avec ω₁ > 0 — et note où la trajectoire le coupe. La collection des intersections est une section de Poincaré : à basse énergie une courbe fermée nette (le tore tranché une fois), à haute énergie un nuage flou 2D (l'attracteur chaotique), à énergie critique un mélange superbe de courbes et de nuages — la signature géométrique de la transition KAM.",
      },
      {
        pretitle: "Section six · Connexions",
        title: "Des bras de robot aux rythmes cérébraux jusqu'au chaos du Système solaire",
        body: "La même mathématique de rotors couplés régit les bras robotiques à deux segments (où l'automatique se bat pour étouffer le chaos), la marche humaine (où la jambe oscillante est essentiellement un pendule double passif), et les chaînes d'oscillateurs couplés qui modélisent les réseaux électriques, les stimulateurs cardiaques et la synchronisation universelle de Kuramoto. Le mécanisme KAM derrière le changement de régime court aussi dans le Système solaire : les planètes, modélisées soigneusement, sont chaotiques sur des échelles de l'ordre du gigaan.",
      },
    ],
    simCaption: "En direct · pendule double",
    simTh1Label: "θ₁",
    simTh2Label: "θ₂",
    simPlay: "Lecture",
    simPause: "Pause",
    simReset: "Réinit.",
    simHint: "Glisse θ₁, θ₂ pour les angles initiaux. Les vitesses partent à zéro.",
    twinCaption: "Dépendance sensible · deux départs presque identiques",
    twinCaptionA: "Pendule A · θ₁ = 120°",
    twinCaptionB: "Pendule B · θ₁ = 120° + 10⁻⁵°",
    twinPlay: "Lecture",
    twinPause: "Pause",
    twinReset: "Réinit.",
    twinTimeLabel: "t",
    twinDivergenceLabel: "|Δ|",
    twinLegend:
      "Deux pendules. Mêmes tiges, mêmes masses, même gravité. Angles initiaux différant d'un cent-millième de degré. En quelques secondes, plus rien en commun.",
    lyapunovLabel: "Plus grand exposant de Lyapunov",
    lyapunovValue: "λ > 0",
    lyapunovNote:
      "Dans le régime chaotique, les écarts croissent en e^(λt) — et l'horizon de prévisibilité ne grandit qu'en log(1/ε).",
    regimeQuasiLabel: "Basse énergie",
    regimeQuasiBody:
      "Oscillation quasi-périodique douce. La trajectoire enroule un tore invariant, ne se pose jamais, ne s'échappe jamais.",
    regimeChaosLabel: "Haute énergie",
    regimeChaosBody:
      "Chaos. Le tore est déchiré ; les trajectoires remplissent une région floue de l'espace de phase, et deux départs ne s'accordent pas longtemps.",
    closingPill: "Ouvrir l'Explorer",
    closingTitle: "Tiens le chaos entre tes mains",
    closingBody:
      "L'Explorer intègre les équations en direct, te laisse régler masses, longueurs et les deux angles initiaux, et oppose deux départs presque identiques côte à côte. Tu peux aussi tracer des sections de Poincaré et regarder les tores KAM se déchirer en montant l'énergie.",
    closingCta: "→ Ouvrir l'Explorer",
    finalLabel: "Lâche-le.",
  },
  it: {
    page: {
      pretitle: "Tema · Caos",
      title: "Il Pendolo Doppio",
      tagline: "Due angoli, un casino, futuri infiniti.",
      intro:
        "Appendi un pendolo a un altro e scrivi le equazioni di Lagrange. La ricetta è fisica del liceo. Il moto è la faccia da manuale del caos deterministico — bello, limitato e del tutto imprevedibile dopo pochi secondi.",
      ctaInteractive: "→ Apri l'Explorer",
      sections: [
        {
          pretitle: "Passo uno · Il setup",
          title: "Due pendoli, una massa appesa a un'altra",
          body: "Un'asta rigida di lunghezza L₁ con una massa m₁ in fondo, che ruota sotto gravità. A quella prima massa è appesa una seconda asta L₂ con massa m₂. Due angoli θ₁ e θ₂ misurati dalla verticale, più le loro velocità — questo è tutto lo stato.",
        },
        {
          pretitle: "Passo due · La lagrangiana",
          title: "Cinetica meno potenziale, poi Euler-Lagrange",
          body: "Scrivi T (cinetica) e V (potenziale), forma L = T − V, e Euler-Lagrange sputa fuori due EDO non lineari del secondo ordine per θ̈₁ e θ̈₂. L'accoppiamento passa per sin(θ₁−θ₂) e cos(θ₁−θ₂). Niente forma chiusa; resta solo il numerico.",
        },
        {
          pretitle: "Passo tre · Caos",
          title: "Bassa energia: carino. Alta energia: imprevedibile.",
          body: "A bassa energia, moto quasiperiodico dolce su un toro invariante. Supera un'energia critica e il sistema diventa caotico: il maggiore esponente di Lyapunov diventa positivo e una differenza di una parte su un milione all'inizio diventa disaccordo totale in pochi secondi.",
        },
        {
          pretitle: "Passo quattro · Dove compare",
          title: "Robot, camminata, teoria del controllo, musei",
          body: "Le stesse equazioni descrivono bracci robotici a due segmenti, la gamba umana che oscilla nel passo, oscillatori composti in meccanica, e il classico problema di stabilizzare un pendolo in verticale. Ogni museo della scienza ne ha uno in vetrina che disegna una traccia che nessuno sa prevedere.",
        },
      ],
    },
    encounter: {
      pretitle: "Primo incontro",
      title: "Due aste, un perno — un'intera fisica del caos",
      cards: [
        {
          label: "01 · La grande idea",
          title: "Appendi un pendolo a un pendolo",
          body: "Un'oscillazione ha due angoli e due velocità — quattro numeri. È tutto lo stato del giocattolo. Eppure due partenze che all'occhio sembrano identiche, in pochi secondi danzano due danze del tutto diverse. Stesse equazioni, futuri diversi. Determinismo senza prevedibilità.",
        },
        {
          label: "02 · Un esempio concreto",
          title: "90°, 90° contro 90°, 90,00001°",
          body: "Avvia un pendolo a θ₁ = 90°, θ₂ = 90°. La punta traccia una curva intricata e bellissima. Riparti con θ₂ = 90,00001° — un centomillesimo di grado di differenza. Le due curve coincidono per qualche secondo, poi si staccano, e dopo dieci secondi non hanno più nulla da dirsi.",
        },
        {
          label: "03 · Perché conta",
          title: "Caos classico, distillato in quattro numeri",
          body: "È l'esempio più puro di caos in un sistema classico di bassa dimensione. Solo Newton, solo Lagrange — niente casualità. Eppure la dipendenza sensibile dalle condizioni iniziali è in piena vista, in un moto che si vede, in un sistema che si costruisce con due graffette.",
        },
      ],
      tryIt:
        "Sposta i cursori per fissare gli angoli iniziali. Premi play e guarda la punta tracciare la sua breve storia segnata.",
    },
    sections: [
      {
        pretitle: "Sezione uno · La lagrangiana",
        title: "Energia dentro, energia fuori, equazioni del moto",
        body: "Scrivi la posizione di ogni massa: (x₁, y₁) per la prima e (x₂, y₂) per la seconda, entrambe come funzioni di θ₁ e θ₂. Deriva per ottenere le velocità. L'energia cinetica T è ½ m₁ v₁² + ½ m₂ v₂². L'energia potenziale V è m₁ g y₁ + m₂ g y₂. Forma L = T − V — una sola funzione scalare sullo spazio degli stati 4D — e tutta la dinamica è lì dentro. Intuizione profonda di Lagrange, 1788: niente diagrammi del corpo libero, la natura minimizza un'azione e le equazioni seguono.",
      },
      {
        pretitle: "Sezione due · Le EDO accoppiate",
        title: "Euler-Lagrange tira fuori due equazioni non lineari",
        body: "Applicando ∂L/∂θᵢ − d/dt(∂L/∂θ̇ᵢ) = 0 per i = 1, 2 si ottengono due EDO del secondo ordine. Risolvendo per le accelerazioni angolari θ̈₁ e θ̈₂ saltano fuori espressioni piene di seni, coseni, prodotti di velocità e un denominatore con 2 m₁ + m₂ − m₂ cos(2θ₁ − 2θ₂). Le equazioni sono esatte, deterministiche, senza attrito né rumore — e senza soluzione chiusa elementare. Per vederle muovere, integri. RK4 basta.",
      },
      {
        pretitle: "Sezione tre · Tre regimi",
        title: "Calmo, selvaggio e la lacerazione KAM in mezzo",
        body: "A bassa energia totale il moto vive su un toro invariante liscio nello spazio delle fasi 4D — quasiperiodico, limitato, quasi noioso. Alza l'energia e il toro si strappa: il teorema KAM di Kolmogorov, Arnold e Moser dice che la maggior parte dei tori invarianti sopravvive a piccole perturbazioni, ma con l'energia crescente si rompono uno a uno finché resta un mare caotico. In mezzo, una transizione critica dove isole d'ordine convivono con strati stocastici. Il pendolo doppio è la dimostrazione da tavolo dell'intera storia KAM.",
      },
      {
        pretitle: "Sezione quattro · Lyapunov e l'orizzonte",
        title: "Un soffitto di prevedibilità misurato in secondi",
        body: "Nel regime caotico, due traiettorie vicine si allontanano grossomodo come ε · e^(λt), con λ il maggiore esponente di Lyapunov — positivo, finito, proprietà del sistema e non dell'osservatore. L'orizzonte di prevedibilità scala come t* ≈ (1/λ) · log(L/ε): ogni fattore dieci in più di precisione iniziale ti compra solo una quantità costante di secondi. Nessun cronometro migliore, nessun computer più veloce, nessun integratore più furbo batte l'esponente.",
      },
      {
        pretitle: "Sezione cinque · Spazio delle fasi e Poincaré",
        title: "Fettare la danza per vederne la forma",
        body: "Lo stato vive in uno spazio 4D (θ₁, θ₂, ω₁, ω₂). Scegli un iperpiano — diciamo gli istanti in cui θ₁ = 0 con ω₁ > 0 — e segna dove la traiettoria lo attraversa. L'insieme degli attraversamenti è una sezione di Poincaré: a bassa energia una curva chiusa pulita (il toro tagliato una volta), ad alta energia una nuvola sfocata 2D (l'attrattore caotico), e all'energia critica una bella mescolanza di curve e nuvole — la firma geometrica della transizione KAM.",
      },
      {
        pretitle: "Sezione sei · Connessioni",
        title: "Da bracci robotici a ritmi cerebrali al caos del Sistema solare",
        body: "La stessa matematica dei rotori accoppiati regge i bracci robotici a due segmenti (dove gli ingegneri del controllo combattono per sopprimere il caos), il passo umano (con la gamba oscillante essenzialmente un pendolo doppio passivo), e catene di oscillatori accoppiati che modellano reti elettriche, pacemaker cardiaci e la sincronizzazione universale di Kuramoto. Il meccanismo KAM dietro il cambio di regime gira anche nel Sistema solare: i pianeti, modellati con cura, sono caotici su scale del gigaanno.",
      },
    ],
    simCaption: "Live · pendolo doppio",
    simTh1Label: "θ₁",
    simTh2Label: "θ₂",
    simPlay: "Play",
    simPause: "Pausa",
    simReset: "Reset",
    simHint: "Sposta θ₁, θ₂ per gli angoli iniziali. Le velocità partono da zero.",
    twinCaption: "Dipendenza sensibile · due partenze quasi identiche",
    twinCaptionA: "Pendolo A · θ₁ = 120°",
    twinCaptionB: "Pendolo B · θ₁ = 120° + 10⁻⁵°",
    twinPlay: "Play",
    twinPause: "Pausa",
    twinReset: "Reset",
    twinTimeLabel: "t",
    twinDivergenceLabel: "|Δ|",
    twinLegend:
      "Due pendoli. Stesse aste, stesse masse, stessa gravità. Angoli iniziali che differiscono di un centomillesimo di grado. Dopo pochi secondi non hanno più nulla in comune.",
    lyapunovLabel: "Maggiore esponente di Lyapunov",
    lyapunovValue: "λ > 0",
    lyapunovNote:
      "Nel regime caotico le separazioni crescono come e^(λt) — e l'orizzonte di prevedibilità cresce solo come log(1/ε).",
    regimeQuasiLabel: "Bassa energia",
    regimeQuasiBody:
      "Oscillazione quasiperiodica dolce. La traiettoria avvolge un toro invariante, non si stabilizza mai, non sfugge mai.",
    regimeChaosLabel: "Alta energia",
    regimeChaosBody:
      "Caos. Il toro è strappato; le traiettorie riempiono una regione sfocata dello spazio delle fasi e nessuna coppia di partenze resta d'accordo a lungo.",
    closingPill: "Apri l'Explorer",
    closingTitle: "Tieni il caos tra le mani",
    closingBody:
      "L'Explorer integra le equazioni in tempo reale, ti lascia regolare masse, lunghezze e i due angoli iniziali, e mette a confronto due partenze quasi identiche. Puoi anche disegnare sezioni di Poincaré e vedere i tori KAM strapparsi mentre alzi l'energia.",
    closingCta: "→ Apri l'Explorer",
    finalLabel: "Lascialo andare.",
  },
  pt: {
    page: {
      pretitle: "Tópico · Caos",
      title: "O Pêndulo Duplo",
      tagline: "Dois ângulos, uma bagunça, futuros infinitos.",
      intro:
        "Pendure um pêndulo em outro e escreva as equações de Lagrange. A receita é física do ensino médio. O movimento é a cara de manual do caos determinista — belo, limitado e completamente imprevisível depois de alguns segundos.",
      ctaInteractive: "→ Abrir o Explorer",
      sections: [
        {
          pretitle: "Passo um · A montagem",
          title: "Dois pêndulos, uma massa pendurada noutra",
          body: "Uma haste rígida de comprimento L₁ com massa m₁ na ponta, pivotando sob a gravidade. Dessa primeira massa pendura-se uma segunda haste L₂ com massa m₂. Dois ângulos θ₁ e θ₂ medidos a partir da vertical, mais suas velocidades — esse é o estado inteiro.",
        },
        {
          pretitle: "Passo dois · A lagrangiana",
          title: "Cinética menos potencial, depois Euler-Lagrange",
          body: "Escreva T (cinética) e V (potencial), forme L = T − V, e Euler-Lagrange cospe duas EDOs não lineares de segunda ordem para θ̈₁ e θ̈₂. O acoplamento vai por sin(θ₁−θ₂) e cos(θ₁−θ₂). Sem forma fechada; só numérico.",
        },
        {
          pretitle: "Passo três · Caos",
          title: "Energia baixa: bonito. Energia alta: imprevisível.",
          body: "A baixa energia, movimento quasiperiódico suave num toro invariante. Passa uma energia crítica e o sistema vai a caos: o maior expoente de Lyapunov fica positivo, e uma diferença de uma parte em um milhão no início vira desacordo total em segundos.",
        },
        {
          pretitle: "Passo quatro · Onde aparece",
          title: "Robôs, caminhada, teoria de controle, museus",
          body: "As mesmas equações descrevem braços robóticos de dois elos, a perna humana ao caminhar, osciladores compostos em máquinas, e o problema clássico de estabilizar um pêndulo na vertical. Todo museu de ciência tem um balançando numa vitrine, traçando um rastro que ninguém consegue prever.",
        },
      ],
    },
    encounter: {
      pretitle: "Primeiro encontro",
      title: "Duas hastes, um pivô — toda uma física do caos",
      cards: [
        {
          label: "01 · A grande ideia",
          title: "Pendure um pêndulo num pêndulo",
          body: "Um balanço tem dois ângulos e duas velocidades — quatro números. É o estado todo do brinquedo. E ainda assim duas partidas que parecem idênticas ao olho, em poucos segundos dançam duas danças totalmente diferentes. As mesmas equações, futuros diferentes. Determinismo sem previsibilidade.",
        },
        {
          label: "02 · Um exemplo concreto",
          title: "90°, 90° contra 90°, 90,00001°",
          body: "Inicie um pêndulo em θ₁ = 90°, θ₂ = 90°. A ponta desenha uma curva linda e entrelaçada. Reinicie com θ₂ = 90,00001° — um centomilésimo de grau de diferença. As duas curvas coincidem por alguns segundos, depois se separam, e em dez segundos não têm mais nada a dizer uma à outra.",
        },
        {
          label: "03 · Por que importa",
          title: "Caos clássico, destilado em quatro números",
          body: "É o exemplo mais puro de caos num sistema clássico de baixa dimensão. Só Newton, só Lagrange — sem aleatoriedade. E ainda assim a dependência sensível das condições iniciais aparece de cheio, num movimento visível, num sistema que se monta com dois clipes.",
        },
      ],
      tryIt:
        "Mexa os controles para ajustar os ângulos iniciais. Aperte play e veja a ponta desenhar sua breve história fadada.",
    },
    sections: [
      {
        pretitle: "Seção um · A lagrangiana",
        title: "Energia entra, energia sai, equações do movimento",
        body: "Escreva a posição de cada massa: (x₁, y₁) para a primeira e (x₂, y₂) para a segunda, ambas como funções de θ₁ e θ₂. Derive para obter velocidades. A energia cinética T é ½ m₁ v₁² + ½ m₂ v₂². A potencial V é m₁ g y₁ + m₂ g y₂. Forme L = T − V — uma única função escalar sobre o espaço de estados 4D — e toda a dinâmica está nela. Intuição profunda de Lagrange, 1788: não precisa de diagramas de corpo livre, a natureza minimiza uma ação e as equações vêm.",
      },
      {
        pretitle: "Seção dois · As EDOs acopladas",
        title: "Euler-Lagrange produz duas equações não lineares",
        body: "Aplicando ∂L/∂θᵢ − d/dt(∂L/∂θ̇ᵢ) = 0 para i = 1, 2 saem duas EDOs de segunda ordem. Resolvendo para θ̈₁ e θ̈₂ aparecem expressões cheias de senos, cossenos, produtos de velocidades e um denominador com 2 m₁ + m₂ − m₂ cos(2θ₁ − 2θ₂). As equações são exatas, deterministas, sem atrito nem ruído — e sem solução fechada elementar. Para ver, integra-se. RK4 chega.",
      },
      {
        pretitle: "Seção três · Três regimes",
        title: "Calmo, selvagem e o rasgo KAM entre eles",
        body: "A baixa energia total o movimento vive num toro invariante suave do espaço de fases 4D — quasiperiódico, limitado, quase tedioso. Suba a energia e o toro rasga: o teorema KAM de Kolmogórov, Arnold e Moser diz que a maioria dos toros invariantes sobrevive a pequenas perturbações, mas com a energia crescente quebram um a um até sobrar um mar caótico. No meio, uma transição crítica onde ilhas de ordem convivem com camadas estocásticas. O pêndulo duplo é a demonstração de mesa de toda a história KAM.",
      },
      {
        pretitle: "Seção quatro · Lyapunov e o horizonte",
        title: "Um teto de previsibilidade, em segundos",
        body: "No regime caótico, duas trajetórias próximas se afastam aproximadamente como ε · e^(λt), com λ o maior expoente de Lyapunov — positivo, finito, propriedade do sistema, não do observador. O horizonte de previsibilidade escala como t* ≈ (1/λ) · log(L/ε): cada fator dez a mais de precisão inicial te compra apenas uma quantidade constante de segundos. Nenhum cronômetro, nenhum computador, nenhum integrador derrota o expoente.",
      },
      {
        pretitle: "Seção cinco · Espaço de fases e Poincaré",
        title: "Fatiar a dança para ver sua forma",
        body: "O estado vive num espaço 4D (θ₁, θ₂, ω₁, ω₂). Escolha um hiperplano — digamos os instantes em que θ₁ = 0 com ω₁ > 0 — e marque onde a trajetória o cruza. A coleção dos cruzamentos é uma seção de Poincaré: em baixa energia uma curva fechada limpa (o toro fatiado uma vez), em alta energia uma nuvem desfocada 2D (o atrator caótico), em energia crítica uma mistura bonita de curvas e nuvens — a assinatura geométrica da transição KAM.",
      },
      {
        pretitle: "Seção seis · Conexões",
        title: "De braços robôs a ritmos cerebrais e ao caos do Sistema Solar",
        body: "A mesma matemática de rotores acoplados rege braços robóticos de dois elos (onde os engenheiros de controle lutam para suprimir o caos), a marcha humana (com a perna oscilante sendo essencialmente um pêndulo duplo passivo) e cadeias de osciladores acoplados que modelam redes elétricas, marcapassos cardíacos e a sincronização universal de Kuramoto. O mecanismo KAM por trás da mudança de regime também roda no Sistema Solar: os planetas, modelados com cuidado, são caóticos em escalas de gigaanos.",
      },
    ],
    simCaption: "Ao vivo · pêndulo duplo",
    simTh1Label: "θ₁",
    simTh2Label: "θ₂",
    simPlay: "Tocar",
    simPause: "Pausa",
    simReset: "Reset",
    simHint: "Mova θ₁, θ₂ para definir os ângulos iniciais. As velocidades começam em zero.",
    twinCaption: "Dependência sensível · duas partidas quase idênticas",
    twinCaptionA: "Pêndulo A · θ₁ = 120°",
    twinCaptionB: "Pêndulo B · θ₁ = 120° + 10⁻⁵°",
    twinPlay: "Tocar",
    twinPause: "Pausa",
    twinReset: "Reset",
    twinTimeLabel: "t",
    twinDivergenceLabel: "|Δ|",
    twinLegend:
      "Dois pêndulos. Mesmas hastes, mesmas massas, mesma gravidade. Ângulos iniciais diferindo num centésimo de milésimo de grau. Em poucos segundos não têm mais nada em comum.",
    lyapunovLabel: "Maior expoente de Lyapunov",
    lyapunovValue: "λ > 0",
    lyapunovNote:
      "No regime caótico, as separações crescem como e^(λt) — e o horizonte de previsibilidade cresce só como log(1/ε).",
    regimeQuasiLabel: "Energia baixa",
    regimeQuasiBody:
      "Oscilação quasiperiódica suave. A trajetória enrola um toro invariante, nunca se acomoda, nunca escapa.",
    regimeChaosLabel: "Energia alta",
    regimeChaosBody:
      "Caos. O toro foi rasgado; as trajetórias preenchem uma região desfocada do espaço de fases e duas partidas não concordam por muito tempo.",
    closingPill: "Abrir o Explorer",
    closingTitle: "Segure o caos nas mãos",
    closingBody:
      "O Explorer integra as equações ao vivo, deixa você ajustar massas, comprimentos e os dois ângulos iniciais, e coloca duas partidas quase idênticas lado a lado. Você também pode desenhar seções de Poincaré e ver os toros KAM rasgando enquanto sobe a energia.",
    closingCta: "→ Abrir o Explorer",
    finalLabel: "Solte-o.",
  },
  sv: {
    page: {
      pretitle: "Ämne · Kaos",
      title: "Dubbelpendeln",
      tagline: "Två vinklar, ett kaos, oändliga framtider.",
      intro:
        "Häng en pendel under en annan och skriv ner Lagranges ekvationer. Receptet är gymnasiefysik. Rörelsen är läroboksansiktet för deterministiskt kaos — vackert, begränsat och fullständigt oförutsägbart efter några sekunder.",
      ctaInteractive: "→ Öppna Explorer",
      sections: [
        {
          pretitle: "Steg ett · Uppställningen",
          title: "Två pendlar, en lod hänger i en annan",
          body: "En styv stång med längd L₁ och en lod m₁ i änden, som svänger under gravitation. Från första loden hänger en andra stång L₂ med lod m₂. Två vinklar θ₁ och θ₂ mätta från lodlinjen, plus deras vinkelhastigheter — det är hela tillståndet.",
        },
        {
          pretitle: "Steg två · Lagrangianen",
          title: "Kinetisk minus potentiell, sen Euler-Lagrange",
          body: "Skriv T (kinetisk) och V (potentiell), bilda L = T − V, och Euler-Lagrange spottar ur sig två kopplade icke-linjära ODE:er av andra ordningen för θ̈₁ och θ̈₂. Kopplingen går via sin(θ₁−θ₂) och cos(θ₁−θ₂). Ingen sluten form; bara numerik.",
        },
        {
          pretitle: "Steg tre · Kaos",
          title: "Låg energi: snyggt. Hög energi: oförutsägbart.",
          body: "Vid låg energi mjuk kvasiperiodisk rörelse på en invariant torus. Passera en kritisk energi och systemet blir kaotiskt: största Lyapunov-exponenten blir positiv, och en miljondelsskillnad vid start blir totalt oense på sekunder.",
        },
        {
          pretitle: "Steg fyra · Var den dyker upp",
          title: "Robotar, gång, reglerteknik, museer",
          body: "Samma ekvationer beskriver tvålänkars robotarmar, det svängande benet i mänsklig gång, sammansatta oscillatorer i maskiner och det klassiska problemet att stabilisera en pendel upprätt. Varje vetenskapsmuseum har en i en glasmonter som ritar ett spår ingen kan förutsäga.",
        },
      ],
    },
    encounter: {
      pretitle: "Första mötet",
      title: "Två stänger, en pivot — en hel kaosens fysik",
      cards: [
        {
          label: "01 · Den stora idén",
          title: "Häng en pendel i en pendel",
          body: "En gungning har två vinklar och två hastigheter — fyra tal. Det är hela tillståndet hos leksaken. Och ändå dansar två starter som för ögat ser identiska ut, inom några sekunder två helt olika danser. Samma ekvationer, andra framtider. Determinism utan förutsägbarhet.",
        },
        {
          label: "02 · Ett konkret exempel",
          title: "90°, 90° mot 90°, 90,00001°",
          body: "Starta en pendel vid θ₁ = 90°, θ₂ = 90°. Spetsen ritar en vacker, sammanflätad kurva. Starta om med θ₂ = 90,00001° — en hundratusendels grad i skillnad. De två kurvorna sammanfaller några sekunder, släpper sedan från varandra och vid tio sekunder har de ingenting kvar att säga varandra.",
        },
        {
          label: "03 · Varför det betyder något",
          title: "Klassiskt kaos, kokt ner till fyra tal",
          body: "Det här är det renaste exemplet på kaos i ett lågdimensionellt klassiskt system. Bara Newton, bara Lagrange — ingen slumpmässighet. Ändå syns känslig beroende av begynnelsevillkor fullt ut, i en synlig rörelse, i ett system du kan bygga med två gem.",
        },
      ],
      tryIt:
        "Dra reglagen under för att ställa startvinklarna. Tryck play och se spetsen rita sin korta, dömda historia.",
    },
    sections: [
      {
        pretitle: "Avsnitt ett · Lagrangianen",
        title: "Energi in, energi ut, rörelseekvationer",
        body: "Skriv positionen för varje lod: (x₁, y₁) för den första och (x₂, y₂) för den andra, båda som funktioner av θ₁ och θ₂. Derivera för att få hastigheter. Den kinetiska energin T är ½ m₁ v₁² + ½ m₂ v₂². Potentiella V är m₁ g y₁ + m₂ g y₂. Bilda L = T − V — en enda skalär funktion över det 4-dimensionella tillståndsrummet — och hela dynamiken ligger där. Lagranges djupa insikt från 1788: inga frikroppsdiagram behövs, naturen minimerar en verkan och ekvationerna följer.",
      },
      {
        pretitle: "Avsnitt två · De kopplade ODE:erna",
        title: "Euler-Lagrange ger två icke-linjära ekvationer",
        body: "Applicera ∂L/∂θᵢ − d/dt(∂L/∂θ̇ᵢ) = 0 för i = 1, 2 så får du två ODE:er av andra ordningen. Lös ut vinkelaccelerationerna θ̈₁ och θ̈₂ och uttrycken fylls av sinus, cosinus, hastighetsprodukter och en nämnare med 2 m₁ + m₂ − m₂ cos(2θ₁ − 2θ₂). Ekvationerna är exakta, deterministiska, utan friktion eller brus — och utan elementär sluten lösning. För att se rörelsen integrerar du. RK4 räcker.",
      },
      {
        pretitle: "Avsnitt tre · Tre regimer",
        title: "Stilla, vild, och KAM-revan däremellan",
        body: "Vid låg total energi bor rörelsen på en slät invariant torus i 4D-fasrummet — kvasiperiodisk, begränsad, nästan trist. Skruva upp energin och torusen slits sönder: enligt KAM-satsen av Kolmogorov, Arnold och Moser överlever de flesta invarianta tori små störningar, men när energin växer går de sönder en efter en tills bara ett kaotiskt hav återstår. Däremellan en kritisk övergång där ordningsöar samexisterar med stokastiska skikt. Dubbelpendeln är bordsdemonstrationen av hela KAM-berättelsen.",
      },
      {
        pretitle: "Avsnitt fyra · Lyapunov och horisonten",
        title: "Ett förutsägelsetak, mätt i sekunder",
        body: "I den kaotiska regimen växer två närliggande banor från varandra ungefär som ε · e^(λt), där λ är den största Lyapunov-exponenten — positiv, ändlig, en egenskap hos systemet, inte hos observatören. Förutsägelsehorisonten skalar då som t* ≈ (1/λ) · log(L/ε): varje extra faktor tio i utgångsprecision köper bara ett konstant antal sekunder framförhållning. Inget bättre stoppur, ingen snabbare dator, ingen klokare integrator slår exponenten.",
      },
      {
        pretitle: "Avsnitt fem · Fasrum och Poincaré",
        title: "Skär dansen för att se dess form",
        body: "Tillståndet bor i ett 4D-rum (θ₁, θ₂, ω₁, ω₂). Välj ett hyperplan — säg ögonblicken då θ₁ = 0 med ω₁ > 0 — och anteckna var banan korsar det. Mängden av korsningar är en Poincaré-sektion: vid låg energi en ren sluten kurva (torus skuren en gång), vid hög energi ett luddigt 2D-moln (den kaotiska attraktorn), och vid kritisk energi en vacker blandning av kurvor och moln — den geometriska signaturen av KAM-övergången.",
      },
      {
        pretitle: "Avsnitt sex · Kopplingar",
        title: "Från robotarmar till hjärnrytmer och Solsystemets kaos",
        body: "Samma matematik för kopplade rotorer styr tvålänkars robotarmar (där reglertekniker slåss för att kväva kaoset), mänsklig gång (där det svängande benet i grunden är en passiv dubbelpendel) och kedjor av kopplade oscillatorer som modellerar elnät, pacemakers och Kuramotos universella synkronisering. KAM-mekanismen bakom regimskiftet löper också i Solsystemet: planeterna, noggrant modellerade, är kaotiska på gigaårsskalor.",
      },
    ],
    simCaption: "Live · dubbelpendel",
    simTh1Label: "θ₁",
    simTh2Label: "θ₂",
    simPlay: "Spela",
    simPause: "Paus",
    simReset: "Återställ",
    simHint: "Dra θ₁, θ₂ för startvinklarna. Hastigheterna startar i noll.",
    twinCaption: "Känslig beroende · två nästan identiska starter",
    twinCaptionA: "Pendel A · θ₁ = 120°",
    twinCaptionB: "Pendel B · θ₁ = 120° + 10⁻⁵°",
    twinPlay: "Spela",
    twinPause: "Paus",
    twinReset: "Återställ",
    twinTimeLabel: "t",
    twinDivergenceLabel: "|Δ|",
    twinLegend:
      "Två pendlar. Samma stänger, samma massor, samma gravitation. Startvinklar som skiljer sig med en hundratusendels grad. Efter några sekunder har de inget gemensamt.",
    lyapunovLabel: "Största Lyapunov-exponent",
    lyapunovValue: "λ > 0",
    lyapunovNote:
      "I den kaotiska regimen växer gapen som e^(λt) — och förutsägelsehorisonten växer bara som log(1/ε).",
    regimeQuasiLabel: "Låg energi",
    regimeQuasiBody:
      "Mjuk kvasiperiodisk svängning. Banan virar en invariant torus, slår sig aldrig till ro, rymmer aldrig.",
    regimeChaosLabel: "Hög energi",
    regimeChaosBody:
      "Kaos. Torus är riven; banor fyller en luddig region av fasrummet och två starter förblir inte överens länge.",
    closingPill: "Öppna Explorer",
    closingTitle: "Håll kaoset i händerna",
    closingBody:
      "Explorern integrerar ekvationerna live, låter dig ställa massor, längder och de två startvinklarna, och kör två nästan identiska starter sida vid sida. Du kan också rita Poincaré-sektioner och se KAM-tori slitas sönder medan du höjer energin.",
    closingCta: "→ Öppna Explorer",
    finalLabel: "Släpp det loss.",
  },
  no: {
    page: {
      pretitle: "Tema · Kaos",
      title: "Dobbeltpendelen",
      tagline: "To vinkler, ett rot, uendelige framtider.",
      intro:
        "Heng én pendel under en annen og skriv ned Lagranges ligninger. Oppskriften er videregående fysikk. Bevegelsen er læreboksansiktet til deterministisk kaos — vakker, begrenset og fullstendig uforutsigbar etter noen sekunder.",
      ctaInteractive: "→ Åpne Explorer",
      sections: [
        {
          pretitle: "Steg én · Oppsettet",
          title: "To pendler, ett lodd henger i et annet",
          body: "En stiv stang med lengde L₁ og et lodd m₁ i enden, som svinger under tyngdekraften. Fra det første loddet henger en andre stang L₂ med lodd m₂. To vinkler θ₁ og θ₂ målt fra loddrett, pluss vinkelhastighetene deres — det er hele tilstanden.",
        },
        {
          pretitle: "Steg to · Lagrangianen",
          title: "Kinetisk minus potensiell, så Euler-Lagrange",
          body: "Skriv T (kinetisk) og V (potensiell), dann L = T − V, og Euler-Lagrange spytter ut to koblede ikke-lineære ODEer av andre orden for θ̈₁ og θ̈₂. Koblingen går via sin(θ₁−θ₂) og cos(θ₁−θ₂). Ingen lukket form; bare numerikk.",
        },
        {
          pretitle: "Steg tre · Kaos",
          title: "Lav energi: pent. Høy energi: uforutsigbart.",
          body: "Ved lav energi myk kvasiperiodisk bevegelse på en invariant torus. Forbi en kritisk energi blir systemet kaotisk: største Lyapunov-eksponent blir positiv, og en millionsdels forskjell ved start blir total uenighet på sekunder.",
        },
        {
          pretitle: "Steg fire · Hvor det dukker opp",
          title: "Roboter, gange, reguleringsteori, museer",
          body: "De samme ligningene beskriver tolinks robotarmer, det svingende menneskebeinet i gange, sammensatte oscillatorer i maskiner og det klassiske problemet med å stabilisere en pendel oppreist. Hvert vitenskapsmuseum har en i en glassmonter som tegner et spor ingen kan forutsi.",
        },
      ],
    },
    encounter: {
      pretitle: "Første møte",
      title: "To stenger, ett pivot — en hel kaoset fysikk",
      cards: [
        {
          label: "01 · Den store idéen",
          title: "Heng en pendel i en pendel",
          body: "En dingling har to vinkler og to hastigheter — fire tall. Det er hele tilstanden til leketøyet. Likevel danser to starter som ser identiske ut for øyet, i løpet av få sekunder, to helt forskjellige danser. Samme ligninger, andre framtider. Determinisme uten forutsigbarhet.",
        },
        {
          label: "02 · Et konkret eksempel",
          title: "90°, 90° mot 90°, 90,00001°",
          body: "Start en pendel ved θ₁ = 90°, θ₂ = 90°. Spissen tegner en vakker, flettet kurve. Start på nytt med θ₂ = 90,00001° — en hundretusendels grad forskjell. De to kurvene faller sammen et par sekunder, slipper så hverandre, og etter ti sekunder har de ingenting igjen å si til hverandre.",
        },
        {
          label: "03 · Hvorfor det betyr noe",
          title: "Klassisk kaos, kokt ned til fire tall",
          body: "Dette er det reneste eksempelet på kaos i et lavdimensjonalt klassisk system. Bare Newton, bare Lagrange — ingen tilfeldighet. Likevel vises sensitiv avhengighet av startbetingelsene fullt ut, i en synlig bevegelse, i et system du kan bygge av to binders.",
        },
      ],
      tryIt:
        "Dra glidebryterne under for å sette startvinklene. Trykk spill og se spissen tegne sin korte, fortapte historie.",
    },
    sections: [
      {
        pretitle: "Del én · Lagrangianen",
        title: "Energi inn, energi ut, bevegelseslikninger",
        body: "Skriv posisjonen til hvert lodd: (x₁, y₁) for det første og (x₂, y₂) for det andre, begge som funksjoner av θ₁ og θ₂. Deriver for å få hastigheter. Den kinetiske energien T er ½ m₁ v₁² + ½ m₂ v₂². Den potensielle V er m₁ g y₁ + m₂ g y₂. Dann L = T − V — en enkelt skalar funksjon over 4D-tilstandsrommet — og hele dynamikken ligger der. Lagranges dype innsikt fra 1788: ingen frikroppsdiagrammer trengs, naturen minimerer en virkning og ligningene følger.",
      },
      {
        pretitle: "Del to · De koblede ODEene",
        title: "Euler-Lagrange gir to ikke-lineære likninger",
        body: "Anvend ∂L/∂θᵢ − d/dt(∂L/∂θ̇ᵢ) = 0 for i = 1, 2 og du får to ODEer av andre orden. Løs for vinkelakselerasjonene θ̈₁ og θ̈₂ og uttrykkene fylles med sinus, cosinus, hastighetsprodukter og en nevner med 2 m₁ + m₂ − m₂ cos(2θ₁ − 2θ₂). Ligningene er eksakte, deterministiske, uten friksjon eller støy — og uten elementær lukket løsning. For å se bevegelsen integrerer du. RK4 holder.",
      },
      {
        pretitle: "Del tre · Tre regimer",
        title: "Rolig, vill, og KAM-riften imellom",
        body: "Ved lav total energi lever bevegelsen på en glatt invariant torus i 4D-faserommet — kvasiperiodisk, begrenset, nesten kjedelig. Skru opp energien og torusen revner: KAM-satsen til Kolmogorov, Arnold og Moser sier at de fleste invariante tori overlever små forstyrrelser, men når energien vokser brytes de én etter én til bare et kaotisk hav er igjen. Imellom en kritisk overgang der ordensøyer sameksisterer med stokastiske lag. Dobbeltpendelen er bordemonstrasjonen av hele KAM-historien.",
      },
      {
        pretitle: "Del fire · Lyapunov og horisonten",
        title: "Et forutsigbarhetstak, målt i sekunder",
        body: "I det kaotiske regimet vokser to nære baner fra hverandre omtrent som ε · e^(λt), der λ er den største Lyapunov-eksponenten — positiv, endelig, en egenskap ved systemet, ikke ved observatøren. Forutsigbarhetshorisonten skalerer som t* ≈ (1/λ) · log(L/ε): hver ekstra faktor ti i startpresisjon kjøper bare et konstant antall sekunder framsyn. Ingen bedre stoppeklokke, ingen raskere datamaskin, ingen smartere integrator slår eksponenten.",
      },
      {
        pretitle: "Del fem · Faserom og Poincaré",
        title: "Skjær dansen for å se formen",
        body: "Tilstanden bor i et 4D-rom (θ₁, θ₂, ω₁, ω₂). Velg et hyperplan — for eksempel øyeblikkene der θ₁ = 0 med ω₁ > 0 — og noter hvor banen krysser det. Samlingen av kryssinger er et Poincaré-snitt: ved lav energi en ren lukket kurve (torusen skåret én gang), ved høy energi en lodden 2D-sky (den kaotiske attraktoren), og ved kritisk energi en vakker blanding av kurver og skyer — den geometriske signaturen til KAM-overgangen.",
      },
      {
        pretitle: "Del seks · Forbindelser",
        title: "Fra robotarmer til hjernrytmer og Solsystemets kaos",
        body: "Den samme matematikken for koblede rotorer styrer tolinks robotarmer (der reguleringsteknikere kjemper for å kvele kaoset), menneskelig gange (der det svingende beinet i bunn og grunn er en passiv dobbeltpendel), og kjeder av koblede oscillatorer som modellerer strømnett, pacemakere og Kuramotos universelle synkronisering. KAM-mekanismen bak regimeskiftet løper også i Solsystemet: planetene, modellert nøye, er kaotiske på gigaårsskalaer.",
      },
    ],
    simCaption: "Live · dobbeltpendel",
    simTh1Label: "θ₁",
    simTh2Label: "θ₂",
    simPlay: "Spill",
    simPause: "Pause",
    simReset: "Nullstill",
    simHint: "Dra θ₁, θ₂ for å sette startvinklene. Hastighetene starter på null.",
    twinCaption: "Sensitiv avhengighet · to nesten identiske starter",
    twinCaptionA: "Pendel A · θ₁ = 120°",
    twinCaptionB: "Pendel B · θ₁ = 120° + 10⁻⁵°",
    twinPlay: "Spill",
    twinPause: "Pause",
    twinReset: "Nullstill",
    twinTimeLabel: "t",
    twinDivergenceLabel: "|Δ|",
    twinLegend:
      "To pendler. Samme stenger, samme masser, samme tyngdekraft. Startvinkler som skiller seg med en hundretusendels grad. Etter få sekunder har de ingenting til felles.",
    lyapunovLabel: "Største Lyapunov-eksponent",
    lyapunovValue: "λ > 0",
    lyapunovNote:
      "I det kaotiske regimet vokser avstandene som e^(λt) — og forutsigbarhetshorisonten vokser bare som log(1/ε).",
    regimeQuasiLabel: "Lav energi",
    regimeQuasiBody:
      "Myk kvasiperiodisk svinging. Banen virrer rundt en invariant torus, slår seg aldri til ro, rømmer aldri.",
    regimeChaosLabel: "Høy energi",
    regimeChaosBody:
      "Kaos. Torus er revnet; banene fyller en lodden del av faserommet, og to starter forblir ikke enige lenge.",
    closingPill: "Åpne Explorer",
    closingTitle: "Hold kaoset i hendene",
    closingBody:
      "Explorer integrerer ligningene live, lar deg justere masser, lengder og de to startvinklene, og kjører to nesten identiske starter side om side. Du kan også tegne Poincaré-snitt og se KAM-toriene revne mens du skrur opp energien.",
    closingCta: "→ Åpne Explorer",
    finalLabel: "Slipp det løs.",
  },
};

export default function DoublePendulumStory() {
  const { locale } = useI18n();
  const story = RICH_STORY[locale] ?? RICH_STORY.en;
  const page = story.page;

  return (
    <StoryPageShell
      page={page}
      ctaHref="/doublependulum/explorer"
      accent={ACCENT}
      borderAccent="border-signal-coral/70"
      bgAccent="bg-signal-coral/10"
      hoverAccent="hover:bg-signal-coral/20"
      gradient="from-signal-coral/10"
      formulaBadge="θ̈₁ , θ̈₂ — coupled"
      formulaLatex={
        "\\ddot{\\theta}_1, \\ddot{\\theta}_2 \\;\\text{ from }\\; \\mathcal{L}(\\theta_1,\\theta_2,\\dot{\\theta}_1,\\dot{\\theta}_2) = T - V"
      }
      finalLabel={story.finalLabel}
    >
      {/* Encounter — three layperson cards + inline live sim */}
      <section className="mx-auto mb-32 max-w-5xl space-y-10">
        <div className="space-y-3 text-center">
          <Reveal>
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {story.encounter.pretitle}
            </div>
          </Reveal>
          <Reveal delay={120}>
            <h2 className="math-italic text-4xl leading-tight md:text-5xl">
              {story.encounter.title}
            </h2>
          </Reveal>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {story.encounter.cards.map((card, i) => (
            <Reveal key={i} delay={140 + i * 90}>
              <article className="glass hairline h-full space-y-3 rounded-2xl border p-6 transition-colors hover:border-signal-coral/40">
                <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
                  {card.label}
                </div>
                <h3 className="math-italic text-2xl leading-snug text-ink-100">{card.title}</h3>
                <p className="text-sm leading-relaxed text-ink-200">{card.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal delay={420}>
          <p className="mx-auto max-w-2xl text-center italic text-ink-300">
            {story.encounter.tryIt}
          </p>
        </Reveal>
        <Reveal delay={520}>
          <DoublePendulumSim
            caption={story.simCaption}
            th1Label={story.simTh1Label}
            th2Label={story.simTh2Label}
            playLabel={story.simPlay}
            pauseLabel={story.simPause}
            resetLabel={story.simReset}
            hint={story.simHint}
          />
        </Reveal>
      </section>

      {/* Section 1 — The Lagrangian */}
      <section className="mx-auto mb-32 max-w-4xl space-y-8">
        <StoryCard {...story.sections[0]} accent={ACCENT} />
        <Reveal delay={120}>
          <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-6">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              L = T − V
            </div>
            <pre className="overflow-x-auto whitespace-pre font-mono text-[11px] leading-relaxed text-ink-100 md:text-xs">
              {`T = ½ m₁ (L₁ θ̇₁)²
  + ½ m₂ [ (L₁ θ̇₁)² + (L₂ θ̇₂)² + 2 L₁ L₂ θ̇₁ θ̇₂ cos(θ₁ − θ₂) ]

V = − (m₁ + m₂) g L₁ cos θ₁
    − m₂ g L₂ cos θ₂

L = T − V`}
            </pre>
            <p className="text-xs leading-relaxed text-ink-300">
              One scalar L on the (θ₁, θ₂, θ̇₁, θ̇₂) phase space. Plug into Euler-Lagrange and the
              equations of motion drop out.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Section 2 — The coupled ODEs */}
      <section className="mx-auto mb-32 max-w-4xl space-y-8">
        <StoryCard {...story.sections[1]} accent={ACCENT} />
        <Reveal delay={120}>
          <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-6">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              Equations of motion
            </div>
            <pre className="overflow-x-auto whitespace-pre font-mono text-[11px] leading-relaxed text-ink-100 md:text-xs">
              {`Let Δ = θ₁ − θ₂ ,   M = 2 m₁ + m₂ − m₂ cos(2θ₁ − 2θ₂)

θ̈₁ =
  ( −g(2 m₁ + m₂) sin θ₁
    − m₂ g sin(θ₁ − 2θ₂)
    − 2 sin Δ · m₂ ( ω₂² L₂ + ω₁² L₁ cos Δ ) )
  /  ( L₁ · M )

θ̈₂ =
  ( 2 sin Δ
    · ( ω₁² L₁ (m₁ + m₂)
        + g (m₁ + m₂) cos θ₁
        + ω₂² L₂ m₂ cos Δ ) )
  /  ( L₂ · M )`}
            </pre>
            <p className="text-xs leading-relaxed text-ink-300">
              Two coupled second-order nonlinear ODEs. No elementary closed form. The sim above and
              the twin demo below both integrate them with 4th-order Runge-Kutta.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Section 3 — Three regimes / KAM */}
      <section className="mx-auto mb-32 max-w-4xl space-y-8">
        <StoryCard {...story.sections[2]} accent={ACCENT} />
        <Reveal delay={120}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="hairline space-y-2 rounded-2xl border bg-ink-950/40 p-6">
              <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
                {story.regimeQuasiLabel}
              </div>
              <RegimeMini variant="torus" />
              <p className="text-xs leading-relaxed text-ink-300">{story.regimeQuasiBody}</p>
            </div>
            <div className="hairline space-y-2 rounded-2xl border bg-ink-950/40 p-6">
              <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
                {story.regimeChaosLabel}
              </div>
              <RegimeMini variant="chaos" />
              <p className="text-xs leading-relaxed text-ink-300">{story.regimeChaosBody}</p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Section 4 — Lyapunov + twin divergence demo */}
      <section className="mx-auto mb-32 max-w-5xl space-y-8">
        <StoryCard {...story.sections[3]} accent={ACCENT} />
        <Reveal delay={120}>
          <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-6 text-center">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {story.lyapunovLabel}
            </div>
            <div className="math-italic text-5xl text-ink-100 md:text-6xl">
              {story.lyapunovValue}
            </div>
            <p className="mx-auto max-w-xl text-sm leading-relaxed text-ink-300">
              {story.lyapunovNote}
            </p>
          </div>
        </Reveal>
        <Reveal delay={220}>
          <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT} text-center`}>
            {story.twinCaption}
          </div>
        </Reveal>
        <Reveal delay={260}>
          <DoublePendulumTwin
            captionA={story.twinCaptionA}
            captionB={story.twinCaptionB}
            playLabel={story.twinPlay}
            pauseLabel={story.twinPause}
            resetLabel={story.twinReset}
            timeLabel={story.twinTimeLabel}
            divergenceLabel={story.twinDivergenceLabel}
          />
        </Reveal>
        <Reveal delay={360}>
          <p className="mx-auto max-w-2xl text-center text-xs italic leading-relaxed text-ink-400">
            {story.twinLegend}
          </p>
        </Reveal>
      </section>

      {/* Section 5 — Phase space + Poincaré */}
      <section className="mx-auto mb-32 max-w-4xl space-y-8">
        <StoryCard {...story.sections[4]} accent={ACCENT} />
        <Reveal delay={120}>
          <div className="hairline flex flex-col items-center gap-3 rounded-2xl border bg-ink-950/40 p-6">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              Poincaré section · θ₁ = 0, ω₁ &gt; 0
            </div>
            <PoincareSVG />
            <p className="max-w-md text-center text-xs leading-relaxed text-ink-300">
              Closed loops at low energy (intact KAM tori), a scattering of points at high energy
              (chaotic sea), and a mixed-phase mosaic in between.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Section 6 — Connections */}
      <section className="mx-auto mb-32 max-w-4xl">
        <StoryCard {...story.sections[5]} accent={ACCENT} />
      </section>

      {/* Closing CTA */}
      <Reveal>
        <section className="glass hairline mx-auto mb-16 max-w-3xl space-y-6 rounded-3xl border p-10 text-center">
          <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
            {story.closingPill}
          </div>
          <h2 className="math-italic text-3xl leading-tight md:text-5xl">{story.closingTitle}</h2>
          <p className="mx-auto max-w-2xl leading-relaxed text-ink-200">{story.closingBody}</p>
          <div className="pt-2">
            <Link
              href="/doublependulum/explorer"
              className="inline-block rounded-full border border-signal-coral/70 bg-signal-coral/10 px-8 py-4 font-mono text-sm uppercase tracking-widest2 text-signal-coral transition-colors hover:bg-signal-coral/25"
            >
              {story.closingCta}
            </Link>
          </div>
        </section>
      </Reveal>
    </StoryPageShell>
  );
}

// Tiny static SVG showing the two phase-space regimes — a smooth torus
// (quasi-periodic) and a fuzzy chaotic sea. Pure decoration; the live demo
// is the twin pendulum above.
function RegimeMini({ variant }: { variant: "torus" | "chaos" }) {
  if (variant === "torus") {
    const path: string[] = [];
    for (let i = 0; i <= 600; i++) {
      const t = (i / 600) * Math.PI * 2 * 9;
      const a = (i / 600) * Math.PI * 2;
      const r1 = 50;
      const r2 = 14;
      const x = 110 + (r1 + r2 * Math.cos(t)) * Math.cos(a) * 0.7;
      const y = 70 + (r1 + r2 * Math.cos(t)) * Math.sin(a) * 0.5 + r2 * Math.sin(t) * 0.3;
      path.push(`${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`);
    }
    return (
      <svg viewBox="0 0 220 140" className="h-auto w-full" role="img" aria-label="Invariant torus">
        <rect width="220" height="140" fill={palette.canvas.bg} rx="6" />
        <path d={path.join(" ")} fill="none" stroke="rgba(125,243,255,0.65)" strokeWidth="0.9" />
      </svg>
    );
  }
  // chaos: dense scattered cloud of points
  const dots: Array<[number, number]> = [];
  let seed = 1.337;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let i = 0; i < 380; i++) {
    const r = 30 + rand() * 38;
    const a = rand() * Math.PI * 2;
    const jx = (rand() - 0.5) * 18;
    const jy = (rand() - 0.5) * 12;
    const x = 110 + r * Math.cos(a) * 0.7 + jx;
    const y = 70 + r * Math.sin(a) * 0.5 + jy;
    dots.push([x, y]);
  }
  return (
    <svg viewBox="0 0 220 140" className="h-auto w-full" role="img" aria-label="Chaotic cloud">
      <rect width="220" height="140" fill={palette.canvas.bg} rx="6" />
      {dots.map(([x, y], i) => (
        <circle key={i} cx={x.toFixed(2)} cy={y.toFixed(2)} r="0.9" fill="rgba(255,122,182,0.65)" />
      ))}
    </svg>
  );
}

// Sketch of a Poincaré section — a few invariant curves (intact tori) sit
// inside a fuzzy band of scattered crossings (chaotic sea). Pure decoration.
function PoincareSVG() {
  const islands: string[] = [];
  // Three nested elliptical curves (KAM tori).
  for (let k = 0; k < 3; k++) {
    const path: string[] = [];
    for (let i = 0; i <= 120; i++) {
      const a = (i / 120) * Math.PI * 2;
      const rx = 22 + k * 14;
      const ry = 12 + k * 7;
      const x = 110 + rx * Math.cos(a);
      const y = 90 + ry * Math.sin(a);
      path.push(`${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`);
    }
    islands.push(path.join(" "));
  }
  // Stochastic cloud at the rim.
  const dots: Array<[number, number]> = [];
  let seed = 42.0;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let i = 0; i < 240; i++) {
    const r = 56 + rand() * 22;
    const a = rand() * Math.PI * 2;
    const x = 110 + r * Math.cos(a) * 1.05;
    const y = 90 + r * Math.sin(a) * 0.55;
    if (x > 6 && x < 314 && y > 6 && y < 174) dots.push([x, y]);
  }
  return (
    <svg
      viewBox="0 0 320 180"
      className="h-auto w-full max-w-[320px]"
      role="img"
      aria-label="Poincaré section"
    >
      <rect width="320" height="180" fill={palette.canvas.bg} rx="8" />
      {dots.map(([x, y], i) => (
        <circle key={i} cx={x.toFixed(2)} cy={y.toFixed(2)} r="0.8" fill="rgba(255,122,182,0.55)" />
      ))}
      {islands.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke={
            i === 0
              ? "rgba(255,209,102,0.95)"
              : i === 1
                ? "rgba(125,243,255,0.85)"
                : "rgba(179,136,255,0.8)"
          }
          strokeWidth="1.0"
        />
      ))}
      <text
        x="110"
        y="170"
        textAnchor="middle"
        fontFamily="ui-monospace, monospace"
        fontSize="9"
        fill={palette.signal.amber}
      >
        KAM islands · stochastic sea
      </text>
    </svg>
  );
}
