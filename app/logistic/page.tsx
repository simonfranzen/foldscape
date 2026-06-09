"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { StoryPageShell } from "@/components/StoryPageShell";
import { Reveal } from "@/components/Reveal";
import { LogisticRTimeSeries } from "@/components/LogisticRTimeSeries";
import { LogisticDivergeDemo } from "@/components/LogisticDivergeDemo";
import type { Locale } from "@/lib/i18n/types";

const ACCENT = "text-signal-coral";

// Rich, locale-aware story copy lives in the page itself — the shared
// stories.ts dictionary only carries the hero block. Eight languages,
// all hand-written, all the same six section beats.

type RichStory = {
  encounter: {
    pretitle: string;
    title: string;
    cards: Array<{ label: string; title: string; body: string }>;
    tryIt: string;
  };
  sections: Array<{ pretitle: string; title: string; body: string }>;
  demoCaption1: string;
  demoCaption2: string;
  cobwebCaption: string;
  orbitACaption: string;
  orbitBCaption: string;
  playLabel: string;
  pauseLabel: string;
  resetLabel: string;
  iterLabel: string;
  divergenceLabel: string;
  closingPretitle: string;
  closingTitle: string;
  closingBody: string;
  ctaLabel: string;
};

const RICH_STORY: Record<Locale, RichStory> = {
  en: {
    encounter: {
      pretitle: "First encounter · meet the formula",
      title: "One line of arithmetic, a whole zoo of behaviours",
      cards: [
        {
          label: "01 · The big idea",
          title: "A rabbit-population formula",
          body: "Imagine a meadow with a maximum number of rabbits it can feed. Each year next year's rabbits = (growth rate) × (this year's rabbits) × (room still left in the meadow). Write that in symbols and you get xₙ₊₁ = r·xₙ·(1−xₙ). One line, one knob r. Out of that single line the whole modern theory of chaos was built.",
        },
        {
          label: "02 · A concrete example",
          title: "Three turns of the same knob",
          body: "Start with x₀ = 0.2 and crank r. At r = 2.5 the meadow settles to a single steady population — boring. At r = 3.1 it starts flickering between two values, high year, low year, forever. At r = 4 the sequence is wild — it leaps around between 0 and 1 and never repeats. Same formula, three completely different worlds.",
        },
        {
          label: "03 · Why it matters",
          title: "The same recipe shows up everywhere",
          body: "The cascade you are about to see — single value, then 2, then 4, then 8, then chaos — also governs heart arrhythmias, predator-prey populations, lasers slipping into instability, and convection cells in fluids. The constant that controls how fast the doublings pile up, Feigenbaum's δ ≈ 4.6692…, is the same in every one of them. It is one of the deepest universalities in science.",
        },
      ],
      tryIt: "Drag the slider in the demos below. The picture changes; the formula does not.",
    },
    sections: [
      {
        pretitle: "Step one · The recipe",
        title: "One year, written down",
        body: "Treat x as the fraction of carrying capacity used up, between 0 (empty meadow) and 1 (completely full). Pick a growth rate r between 0 and 4. Then next year's fraction is xₙ₊₁ = r · xₙ · (1 − xₙ). Worked example: r = 2.5, xₙ = 0.4 ⇒ xₙ₊₁ = 2.5 · 0.4 · 0.6 = 0.60. Run the line again: 2.5 · 0.60 · 0.40 = 0.60. Already at the fixed point. The 1845 logistic equation of Pierre-François Verhulst, sampled once per generation, is exactly this map.",
      },
      {
        pretitle: "Step two · The first bifurcation",
        title: "At r = 3 the steady state splits in two",
        body: "Below r = 3 the iteration always settles to one steady population — a fixed point. Push r just past 3 and the fixed point stops being stable: instead the orbit jumps every year between a higher value and a lower value. The dot has become a 2-cycle. This is a pitchfork bifurcation, the simplest way a system can break a symmetry, and it is the first crack in the calm.",
      },
      {
        pretitle: "Step three · The cascade",
        title: "2, 4, 8, 16 — faster and faster",
        body: "Keep nudging r upward. At r ≈ 3.449 the 2-cycle splits into a 4-cycle. At r ≈ 3.544 the 4-cycle becomes an 8-cycle. Then 16, 32, 64 — and the windows where each new doubled cycle is stable get shorter every time. Plotted, this is the famous bifurcation diagram: the trunk that forks, then forks again, then forks faster than the eye can resolve.",
      },
      {
        pretitle: "Step four · Feigenbaum's constant",
        title: "δ ≈ 4.6692 — universal across systems",
        body: "Measure how much the windows shrink between doublings: the ratio (rₙ − rₙ₋₁) / (rₙ₊₁ − rₙ) approaches the same limit. Mitchell Feigenbaum computed it on a pocket calculator at Los Alamos in 1975 and got δ ≈ 4.66920160910… The astonishing fact, proved a few years later by Lanford and others, is that this constant is universal: it shows up in the Hénon map, in the Duffing oscillator, in experimental fluid convection, in dripping faucets. Period-doubling is a route, and δ is the speed limit.",
      },
      {
        pretitle: "Step five · Full chaos",
        title: "r ≈ 3.56995 and what lies beyond",
        body: "After infinitely many doublings, all crammed into a finite r-window, the system finally tips into chaos at the Feigenbaum point r∞ ≈ 3.56994567… Past it, the orbit no longer settles to any cycle — it visits an infinite set of values, and two starting points that differ by 10⁻⁶ end up uncorrelated within thirty iterations. At r = 4 the map is conjugate to the doubling map on [0,1]: pure deterministic randomness, generated by one line of arithmetic.",
      },
      {
        pretitle: "Step six · The period-3 window",
        title: "Order, hiding inside the chaos",
        body: 'Slide r up to about 1 + √8 ≈ 3.8284 and the chaos suddenly stops: a stable 3-cycle appears. From there the doublings start again — period 6, 12, 24 — and the system re-enters chaos. In 1975 Tien-Yien Li and James Yorke proved a startling theorem in the American Mathematical Monthly: for any continuous map of an interval, period three implies chaos. A single 3-cycle anywhere forces orbits of every other period and uncountably many that never repeat. The phrase coined for the title — "chaos" — has been the field\'s name ever since.',
      },
    ],
    demoCaption1: "Live demo · slide r to change the regime",
    demoCaption2: "Sensitive dependence · two orbits, ε apart",
    cobwebCaption: "Cobweb · parabola + staircase",
    orbitACaption: "Orbit A · x₀ = 0.200000",
    orbitBCaption: "Orbit B · x₀ = 0.200001",
    playLabel: "Play",
    pauseLabel: "Pause",
    resetLabel: "Reset",
    iterLabel: "iteration",
    divergenceLabel: "|Δ|",
    closingPretitle: "And now · the explorer",
    closingTitle: "Turn the knob yourself",
    closingBody:
      "The Explorer renders the full bifurcation diagram from r = 2.5 to 4, draws the live time series, and lets you sweep through every regime in the story above. Pick the famous values from the side panel; or just drag.",
    ctaLabel: "→ Open the Explorer",
  },

  de: {
    encounter: {
      pretitle: "Erste Begegnung · die Formel kennenlernen",
      title: "Eine Zeile Arithmetik, ein ganzer Zoo an Verhalten",
      cards: [
        {
          label: "01 · Die Grundidee",
          title: "Eine Formel für Kaninchen",
          body: "Stell dir eine Wiese vor, die nur eine begrenzte Zahl Kaninchen ernähren kann. Jedes Jahr gilt: nächstjährige Kaninchen = (Wachstumsrate) × (heutige Kaninchen) × (noch freier Platz auf der Wiese). In Symbolen: xₙ₊₁ = r·xₙ·(1−xₙ). Eine Zeile, ein Drehknopf r. Aus dieser einen Zeile ist die ganze moderne Chaostheorie gewachsen.",
        },
        {
          label: "02 · Ein konkretes Beispiel",
          title: "Dreimal am selben Knopf gedreht",
          body: "Starte mit x₀ = 0,2 und schraube an r. Bei r = 2,5 pendelt sich die Wiese auf eine einzige stabile Population ein — langweilig. Bei r = 3,1 fängt sie an zu flackern, ein Jahr hoch, ein Jahr tief, für immer. Bei r = 4 wird die Folge wild — sie springt zwischen 0 und 1 hin und her und wiederholt sich nie. Dieselbe Formel, drei völlig verschiedene Welten.",
        },
        {
          label: "03 · Warum es wichtig ist",
          title: "Dasselbe Rezept überall",
          body: "Die Kaskade, die du gleich sehen wirst — ein Wert, dann 2, dann 4, dann 8, dann Chaos — steuert auch Herzrhythmusstörungen, Räuber-Beute-Systeme, Laser, die instabil werden, und Konvektionszellen in Flüssigkeiten. Die Konstante, die das Tempo der Verdoppelungen festlegt, Feigenbaums δ ≈ 4,6692…, ist in all diesen Systemen dieselbe. Es ist eine der tiefsten Universalitäten der Naturwissenschaft.",
        },
      ],
      tryIt:
        "Zieh in den Demos unten an den Schiebereglern. Das Bild ändert sich; die Formel nicht.",
    },
    sections: [
      {
        pretitle: "Schritt eins · Das Rezept",
        title: "Ein Jahr, aufgeschrieben",
        body: "Lies x als Anteil der genutzten Kapazität, zwischen 0 (leere Wiese) und 1 (randvoll). Wähle eine Wachstumsrate r zwischen 0 und 4. Dann ist der Anteil im nächsten Jahr xₙ₊₁ = r · xₙ · (1 − xₙ). Beispielrechnung: r = 2,5, xₙ = 0,4 ⇒ xₙ₊₁ = 2,5 · 0,4 · 0,6 = 0,60. Nochmal: 2,5 · 0,60 · 0,40 = 0,60. Schon auf dem Fixpunkt. Genau das ist Pierre-François Verhulsts logistische Gleichung von 1845, pro Generation einmal abgetastet.",
      },
      {
        pretitle: "Schritt zwei · Die erste Bifurkation",
        title: "Bei r = 3 spaltet sich der Ruhepunkt",
        body: "Unterhalb von r = 3 landet die Iteration immer bei einer einzigen stabilen Population — einem Fixpunkt. Drücke r knapp über 3 und der Fixpunkt verliert seine Stabilität: stattdessen springt der Orbit jedes Jahr zwischen einem höheren und einem niedrigeren Wert. Aus dem Punkt ist ein 2-Zyklus geworden. Das ist eine Heugabel-Bifurkation, der einfachste Weg, auf dem ein System eine Symmetrie bricht — der erste Riss in der Ruhe.",
      },
      {
        pretitle: "Schritt drei · Die Kaskade",
        title: "2, 4, 8, 16 — immer schneller",
        body: "Schiebe r weiter nach oben. Bei r ≈ 3,449 wird aus dem 2-Zyklus ein 4-Zyklus. Bei r ≈ 3,544 wird aus dem 4-Zyklus ein 8-Zyklus. Dann 16, 32, 64 — und die Fenster, in denen jeder neu verdoppelte Zyklus stabil ist, werden jedes Mal kürzer. Aufgetragen ergibt das das berühmte Bifurkationsdiagramm: der Stamm gabelt, gabelt wieder, gabelt schneller, als das Auge auflöst.",
      },
      {
        pretitle: "Schritt vier · Feigenbaums Konstante",
        title: "δ ≈ 4,6692 — universell über Systeme hinweg",
        body: "Miss, wie sehr die Fenster zwischen den Verdoppelungen schrumpfen: das Verhältnis (rₙ − rₙ₋₁) / (rₙ₊₁ − rₙ) strebt gegen denselben Grenzwert. Mitchell Feigenbaum rechnete ihn 1975 auf einem Taschenrechner in Los Alamos aus und erhielt δ ≈ 4,66920160910… Verblüffend ist, dass diese Konstante universell ist — sie taucht in der Hénon-Abbildung auf, im Duffing-Oszillator, in experimenteller Strömungs-Konvektion, in tropfenden Wasserhähnen. Periodenverdopplung ist ein Weg, und δ ist die Geschwindigkeitsbegrenzung.",
      },
      {
        pretitle: "Schritt fünf · Volles Chaos",
        title: "r ≈ 3,56995 und was dahinter liegt",
        body: "Nach unendlich vielen Verdoppelungen, alle in ein endliches r-Fenster gequetscht, kippt das System schließlich am Feigenbaum-Punkt r∞ ≈ 3,56994567… ins Chaos. Dahinter lässt sich der Orbit auf keinen Zyklus mehr ein — er besucht eine unendliche Menge an Werten, und zwei Startpunkte, die sich um 10⁻⁶ unterscheiden, sind nach dreißig Iterationen vollkommen unkorreliert. Bei r = 4 ist die Abbildung konjugiert zur Verdopplungsabbildung auf [0,1]: reine deterministische Zufälligkeit, erzeugt aus einer Zeile Arithmetik.",
      },
      {
        pretitle: "Schritt sechs · Das Periode-3-Fenster",
        title: "Ordnung, mitten im Chaos versteckt",
        body: "Schiebe r auf etwa 1 + √8 ≈ 3,8284 — und das Chaos hört plötzlich auf: ein stabiler 3-Zyklus erscheint. Von dort beginnen die Verdoppelungen erneut — Periode 6, 12, 24 — und das System kehrt ins Chaos zurück. 1975 bewiesen Tien-Yien Li und James Yorke ein verblüffendes Theorem im American Mathematical Monthly: für jede stetige Abbildung eines Intervalls impliziert Periode drei Chaos. Ein einziger 3-Zyklus erzwingt Orbits jeder anderen Periode und überabzählbar viele, die sich nie wiederholen. Das Wort, das sie für den Titel prägten — „chaos“ — ist seither der Name des Feldes.",
      },
    ],
    demoCaption1: "Live-Demo · zieh an r, um das Regime zu ändern",
    demoCaption2: "Sensitive Abhängigkeit · zwei Orbits, ε auseinander",
    cobwebCaption: "Spinnweb · Parabel + Treppe",
    orbitACaption: "Orbit A · x₀ = 0,200000",
    orbitBCaption: "Orbit B · x₀ = 0,200001",
    playLabel: "Start",
    pauseLabel: "Pause",
    resetLabel: "Zurücksetzen",
    iterLabel: "Iteration",
    divergenceLabel: "|Δ|",
    closingPretitle: "Und jetzt · der Explorer",
    closingTitle: "Dreh selbst am Knopf",
    closingBody:
      "Der Explorer rendert das volle Bifurkationsdiagramm von r = 2,5 bis 4, zeichnet die Zeitreihe live und lässt dich durch jedes Regime der Geschichte oben streifen. Wähl die berühmten Werte im Seitenpanel — oder zieh einfach.",
    ctaLabel: "→ Explorer öffnen",
  },

  es: {
    encounter: {
      pretitle: "Primer encuentro · conoce la fórmula",
      title: "Una línea de aritmética, todo un zoo de comportamientos",
      cards: [
        {
          label: "01 · La gran idea",
          title: "Una fórmula para los conejos",
          body: "Imagina un prado con un número máximo de conejos al que puede alimentar. Cada año: conejos del año que viene = (tasa de crecimiento) × (conejos de este año) × (espacio que aún queda en el prado). En símbolos: xₙ₊₁ = r·xₙ·(1−xₙ). Una línea, una perilla r. De esa única línea se ha levantado toda la teoría moderna del caos.",
        },
        {
          label: "02 · Un ejemplo concreto",
          title: "Tres giros de la misma perilla",
          body: "Empieza con x₀ = 0,2 y gira r. Con r = 2,5 el prado se asienta en una única población estable — aburrido. Con r = 3,1 empieza a parpadear entre dos valores, año alto, año bajo, para siempre. Con r = 4 la sucesión se vuelve salvaje — salta entre 0 y 1 y no se repite nunca. La misma fórmula, tres mundos completamente distintos.",
        },
        {
          label: "03 · Por qué importa",
          title: "La misma receta aparece por todas partes",
          body: "La cascada que vas a ver — un valor, luego 2, luego 4, luego 8, luego caos — también gobierna las arritmias cardíacas, las poblaciones de depredador-presa, los láseres que se vuelven inestables y las celdas de convección en fluidos. La constante que controla la rapidez con que se acumulan las duplicaciones, la δ de Feigenbaum ≈ 4,6692…, es la misma en todas. Es una de las universalidades más profundas de la ciencia.",
        },
      ],
      tryIt: "Arrastra los deslizadores en las demos de abajo. La imagen cambia; la fórmula no.",
    },
    sections: [
      {
        pretitle: "Paso uno · La receta",
        title: "Un año, escrito",
        body: "Lee x como la fracción de capacidad utilizada, entre 0 (prado vacío) y 1 (lleno). Elige una tasa de crecimiento r entre 0 y 4. Entonces la fracción del año siguiente es xₙ₊₁ = r · xₙ · (1 − xₙ). Ejemplo: r = 2,5, xₙ = 0,4 ⇒ xₙ₊₁ = 2,5 · 0,4 · 0,6 = 0,60. Otra vez: 2,5 · 0,60 · 0,40 = 0,60. Ya en el punto fijo. Esto es exactamente la ecuación logística de Pierre-François Verhulst de 1845, muestreada una vez por generación.",
      },
      {
        pretitle: "Paso dos · La primera bifurcación",
        title: "En r = 3 el estado estable se parte en dos",
        body: "Por debajo de r = 3 la iteración siempre se asienta en una única población estable — un punto fijo. Empuja r justo por encima de 3 y el punto fijo deja de ser estable: ahora la órbita salta cada año entre un valor alto y uno bajo. El punto se ha convertido en un 2-ciclo. Es una bifurcación de tipo tridente, la forma más simple en que un sistema puede romper una simetría, y es la primera grieta en la calma.",
      },
      {
        pretitle: "Paso tres · La cascada",
        title: "2, 4, 8, 16 — cada vez más rápido",
        body: "Sigue empujando r hacia arriba. En r ≈ 3,449 el 2-ciclo se parte en un 4-ciclo. En r ≈ 3,544 el 4-ciclo se convierte en un 8-ciclo. Luego 16, 32, 64 — y las ventanas en que cada nuevo ciclo duplicado es estable se acortan más cada vez. Trazado, esto es el famoso diagrama de bifurcación: el tronco que se bifurca, luego se bifurca de nuevo, luego se bifurca más rápido de lo que el ojo puede resolver.",
      },
      {
        pretitle: "Paso cuatro · La constante de Feigenbaum",
        title: "δ ≈ 4,6692 — universal entre sistemas",
        body: "Mide cuánto se encogen las ventanas entre duplicaciones: el cociente (rₙ − rₙ₋₁) / (rₙ₊₁ − rₙ) tiende al mismo límite. Mitchell Feigenbaum lo calculó en una calculadora de bolsillo en Los Álamos en 1975 y obtuvo δ ≈ 4,66920160910… Lo asombroso, probado pocos años más tarde por Lanford y otros, es que esta constante es universal: aparece en la aplicación de Hénon, en el oscilador de Duffing, en experimentos de convección de fluidos, en grifos que gotean. La duplicación de periodos es una ruta, y δ es el límite de velocidad.",
      },
      {
        pretitle: "Paso cinco · Caos pleno",
        title: "r ≈ 3,56995 y lo que hay más allá",
        body: "Tras infinitas duplicaciones, todas comprimidas en una ventana finita de r, el sistema cae al fin en el caos en el punto de Feigenbaum r∞ ≈ 3,56994567… A partir de ahí la órbita ya no se asienta en ningún ciclo — visita un conjunto infinito de valores, y dos puntos de partida que difieren en 10⁻⁶ acaban descorrelacionados en treinta iteraciones. En r = 4 la aplicación es conjugada con la duplicación angular en [0,1]: aleatoriedad determinista pura, generada por una línea de aritmética.",
      },
      {
        pretitle: "Paso seis · La ventana de periodo 3",
        title: "Orden, escondido dentro del caos",
        body: 'Mueve r hasta cerca de 1 + √8 ≈ 3,8284 y el caos se detiene de pronto: aparece un 3-ciclo estable. Desde ahí las duplicaciones empiezan de nuevo — periodo 6, 12, 24 — y el sistema vuelve a entrar en el caos. En 1975 Tien-Yien Li y James Yorke demostraron un teorema sorprendente en el American Mathematical Monthly: para cualquier aplicación continua de un intervalo, periodo tres implica caos. Un solo 3-ciclo fuerza órbitas de todos los demás periodos y otras incontables que no se repiten nunca. La palabra que acuñaron para el título — "caos" — es desde entonces el nombre del campo.',
      },
    ],
    demoCaption1: "Demo en vivo · arrastra r para cambiar de régimen",
    demoCaption2: "Dependencia sensible · dos órbitas, ε aparte",
    cobwebCaption: "Telaraña · parábola + escalera",
    orbitACaption: "Órbita A · x₀ = 0,200000",
    orbitBCaption: "Órbita B · x₀ = 0,200001",
    playLabel: "Reproducir",
    pauseLabel: "Pausa",
    resetLabel: "Reiniciar",
    iterLabel: "iteración",
    divergenceLabel: "|Δ|",
    closingPretitle: "Y ahora · el Explorer",
    closingTitle: "Gira tú la perilla",
    closingBody:
      "El Explorer renderiza el diagrama de bifurcación completo desde r = 2,5 hasta 4, dibuja la serie temporal en vivo y te deja recorrer cada régimen de la historia de arriba. Elige los valores famosos en el panel lateral — o simplemente arrastra.",
    ctaLabel: "→ Abrir el Explorer",
  },

  fr: {
    encounter: {
      pretitle: "Premier contact · découvrir la formule",
      title: "Une ligne d'arithmétique, tout un zoo de comportements",
      cards: [
        {
          label: "01 · L'idée centrale",
          title: "Une formule pour les lapins",
          body: "Imaginez une prairie qui ne peut nourrir qu'un nombre maximal de lapins. Chaque année : lapins de l'an prochain = (taux de croissance) × (lapins de cette année) × (place encore libre dans la prairie). En symboles : xₙ₊₁ = r·xₙ·(1−xₙ). Une ligne, un bouton r. De cette unique ligne est née toute la théorie moderne du chaos.",
        },
        {
          label: "02 · Un exemple concret",
          title: "Trois tours du même bouton",
          body: "Partez de x₀ = 0,2 et tournez r. Avec r = 2,5 la prairie se stabilise sur une population unique — ennuyeux. Avec r = 3,1 elle se met à osciller entre deux valeurs, année haute, année basse, pour toujours. Avec r = 4 la suite devient sauvage — elle saute entre 0 et 1 et ne se répète jamais. Même formule, trois mondes complètement différents.",
        },
        {
          label: "03 · Pourquoi cela compte",
          title: "La même recette partout",
          body: "La cascade que vous allez voir — une valeur, puis 2, puis 4, puis 8, puis le chaos — gouverne aussi les arythmies cardiaques, les populations proie-prédateur, les lasers qui basculent dans l'instabilité, et les cellules de convection dans les fluides. La constante qui pilote la vitesse des doublements, le δ de Feigenbaum ≈ 4,6692…, est la même dans chacun. C'est l'une des universalités les plus profondes de la science.",
        },
      ],
      tryIt:
        "Faites glisser les curseurs dans les démos ci-dessous. L'image change ; la formule, non.",
    },
    sections: [
      {
        pretitle: "Étape un · La recette",
        title: "Une année, mise en équation",
        body: "Lisez x comme la fraction de capacité utilisée, entre 0 (prairie vide) et 1 (pleine). Choisissez un taux de croissance r entre 0 et 4. Alors la fraction de l'année suivante est xₙ₊₁ = r · xₙ · (1 − xₙ). Exemple chiffré : r = 2,5, xₙ = 0,4 ⇒ xₙ₊₁ = 2,5 · 0,4 · 0,6 = 0,60. Encore : 2,5 · 0,60 · 0,40 = 0,60. Déjà au point fixe. C'est exactement l'équation logistique de Pierre-François Verhulst de 1845, échantillonnée une fois par génération.",
      },
      {
        pretitle: "Étape deux · La première bifurcation",
        title: "À r = 3 l'état stable se dédouble",
        body: "Sous r = 3 l'itération converge toujours vers une population stable unique — un point fixe. Poussez r juste au-delà de 3 et le point fixe perd sa stabilité : l'orbite saute alors chaque année entre une valeur haute et une valeur basse. Le point est devenu un 2-cycle. C'est une bifurcation en fourche, la façon la plus simple pour un système de briser une symétrie, et c'est la première fissure dans le calme.",
      },
      {
        pretitle: "Étape trois · La cascade",
        title: "2, 4, 8, 16 — de plus en plus vite",
        body: "Continuez à pousser r. À r ≈ 3,449 le 2-cycle se scinde en 4-cycle. À r ≈ 3,544 le 4-cycle devient un 8-cycle. Puis 16, 32, 64 — et les fenêtres où chaque nouveau cycle doublé est stable raccourcissent à chaque étape. Tracé, c'est le célèbre diagramme de bifurcation : le tronc se fourche, puis se fourche encore, puis se fourche plus vite que l'œil ne peut le résoudre.",
      },
      {
        pretitle: "Étape quatre · La constante de Feigenbaum",
        title: "δ ≈ 4,6692 — universel d'un système à l'autre",
        body: "Mesurez combien les fenêtres rétrécissent d'un doublement à l'autre : le rapport (rₙ − rₙ₋₁) / (rₙ₊₁ − rₙ) tend vers la même limite. Mitchell Feigenbaum l'a calculé en 1975 à Los Alamos sur une calculatrice de poche et a obtenu δ ≈ 4,66920160910… Ce qui est stupéfiant, prouvé quelques années plus tard par Lanford et d'autres, c'est que cette constante est universelle : elle apparaît dans l'application de Hénon, dans l'oscillateur de Duffing, dans des expériences de convection de fluide, dans des robinets qui gouttent. Le doublement de période est une route, et δ en est la limite de vitesse.",
      },
      {
        pretitle: "Étape cinq · Chaos complet",
        title: "r ≈ 3,56995 et au-delà",
        body: "Après une infinité de doublements, tous comprimés dans une fenêtre finie de r, le système bascule enfin dans le chaos au point de Feigenbaum r∞ ≈ 3,56994567… Au-delà, l'orbite ne se stabilise plus sur aucun cycle — elle visite un ensemble infini de valeurs, et deux points de départ écartés de 10⁻⁶ deviennent décorrélés en trente itérations. À r = 4, l'application est conjuguée au doublement angulaire sur [0,1] : pur aléa déterministe, généré par une ligne d'arithmétique.",
      },
      {
        pretitle: "Étape six · La fenêtre de période 3",
        title: "L'ordre, caché dans le chaos",
        body: "Poussez r jusque vers 1 + √8 ≈ 3,8284 et le chaos s'arrête soudain : un 3-cycle stable apparaît. À partir de là, les doublements recommencent — période 6, 12, 24 — et le système replonge dans le chaos. En 1975 Tien-Yien Li et James Yorke ont prouvé un théorème saisissant dans l'American Mathematical Monthly : pour toute application continue d'un intervalle, la période trois implique le chaos. Un unique 3-cycle, où qu'il soit, force des orbites de toute autre période et une infinité non dénombrable d'orbites qui ne se répètent jamais. Le mot qu'ils ont forgé pour le titre — « chaos » — est depuis le nom du domaine.",
      },
    ],
    demoCaption1: "Démo en direct · faites glisser r pour changer de régime",
    demoCaption2: "Dépendance sensible · deux orbites, distantes de ε",
    cobwebCaption: "Toile · parabole + escalier",
    orbitACaption: "Orbite A · x₀ = 0,200000",
    orbitBCaption: "Orbite B · x₀ = 0,200001",
    playLabel: "Lancer",
    pauseLabel: "Pause",
    resetLabel: "Réinitialiser",
    iterLabel: "itération",
    divergenceLabel: "|Δ|",
    closingPretitle: "Et maintenant · l'Explorer",
    closingTitle: "Tournez le bouton vous-même",
    closingBody:
      "L'Explorer rend le diagramme de bifurcation complet de r = 2,5 à 4, dessine la série temporelle en direct et vous laisse parcourir chaque régime du récit ci-dessus. Choisissez les valeurs célèbres dans le panneau latéral — ou faites simplement glisser.",
    ctaLabel: "→ Ouvrir l'Explorer",
  },

  it: {
    encounter: {
      pretitle: "Primo incontro · conoscere la formula",
      title: "Una riga di aritmetica, un intero zoo di comportamenti",
      cards: [
        {
          label: "01 · L'idea di fondo",
          title: "Una formula per i conigli",
          body: "Immagina un prato che può sfamare al massimo un certo numero di conigli. Ogni anno: conigli dell'anno prossimo = (tasso di crescita) × (conigli di quest'anno) × (spazio ancora libero nel prato). In simboli: xₙ₊₁ = r·xₙ·(1−xₙ). Una riga, una manopola r. Da quell'unica riga è nata l'intera teoria moderna del caos.",
        },
        {
          label: "02 · Un esempio concreto",
          title: "Tre giri della stessa manopola",
          body: "Parti da x₀ = 0,2 e giri r. Con r = 2,5 il prato si assesta su una popolazione stabile — noioso. Con r = 3,1 inizia a oscillare fra due valori, anno alto, anno basso, per sempre. Con r = 4 la successione diventa selvaggia — salta fra 0 e 1 e non si ripete mai. Stessa formula, tre mondi completamente diversi.",
        },
        {
          label: "03 · Perché conta",
          title: "La stessa ricetta ovunque",
          body: "La cascata che stai per vedere — un valore, poi 2, poi 4, poi 8, poi caos — governa anche le aritmie cardiache, le popolazioni preda-predatore, i laser che diventano instabili, le celle di convezione nei fluidi. La costante che regola la velocità delle duplicazioni, il δ di Feigenbaum ≈ 4,6692…, è la stessa in tutti. È una delle universalità più profonde della scienza.",
        },
      ],
      tryIt: "Trascina i cursori nelle demo qui sotto. L'immagine cambia; la formula no.",
    },
    sections: [
      {
        pretitle: "Passo uno · La ricetta",
        title: "Un anno, scritto",
        body: "Leggi x come la frazione di capacità usata, fra 0 (prato vuoto) e 1 (pieno). Scegli un tasso di crescita r fra 0 e 4. Allora la frazione dell'anno successivo è xₙ₊₁ = r · xₙ · (1 − xₙ). Esempio: r = 2,5, xₙ = 0,4 ⇒ xₙ₊₁ = 2,5 · 0,4 · 0,6 = 0,60. Di nuovo: 2,5 · 0,60 · 0,40 = 0,60. Già al punto fisso. Questa è esattamente l'equazione logistica di Pierre-François Verhulst del 1845, campionata una volta a generazione.",
      },
      {
        pretitle: "Passo due · La prima biforcazione",
        title: "A r = 3 lo stato stabile si sdoppia",
        body: "Sotto r = 3 l'iterazione si assesta sempre su una sola popolazione stabile — un punto fisso. Spingi r appena oltre 3 e il punto fisso perde stabilità: l'orbita salta ogni anno fra un valore alto e uno basso. Il punto è diventato un 2-ciclo. È una biforcazione a forchetta, il modo più semplice in cui un sistema rompe una simmetria, ed è la prima crepa nella calma.",
      },
      {
        pretitle: "Passo tre · La cascata",
        title: "2, 4, 8, 16 — sempre più veloce",
        body: "Continua a spingere r. A r ≈ 3,449 il 2-ciclo si scinde in 4-ciclo. A r ≈ 3,544 il 4-ciclo diventa 8-ciclo. Poi 16, 32, 64 — e le finestre in cui ogni nuovo ciclo raddoppiato è stabile si accorciano sempre di più. Tracciato, è il famoso diagramma di biforcazione: il tronco si biforca, si biforca di nuovo, si biforca più rapido di quanto l'occhio riesca a risolvere.",
      },
      {
        pretitle: "Passo quattro · La costante di Feigenbaum",
        title: "δ ≈ 4,6692 — universale fra sistemi",
        body: "Misura quanto si restringono le finestre fra una duplicazione e la successiva: il rapporto (rₙ − rₙ₋₁) / (rₙ₊₁ − rₙ) tende allo stesso limite. Mitchell Feigenbaum lo calcolò su una calcolatrice tascabile a Los Alamos nel 1975 ottenendo δ ≈ 4,66920160910… La cosa stupefacente, dimostrata pochi anni dopo da Lanford e altri, è che questa costante è universale: compare nella mappa di Hénon, nell'oscillatore di Duffing, in esperimenti di convezione fluida, in rubinetti che gocciolano. La duplicazione di periodo è una strada, e δ è il limite di velocità.",
      },
      {
        pretitle: "Passo cinque · Caos pieno",
        title: "r ≈ 3,56995 e oltre",
        body: "Dopo infinite duplicazioni, tutte schiacciate in una finestra finita di r, il sistema cade infine nel caos al punto di Feigenbaum r∞ ≈ 3,56994567… Oltre, l'orbita non si assesta più su alcun ciclo — visita un insieme infinito di valori, e due punti di partenza distanti 10⁻⁶ diventano scorrelati in trenta iterazioni. A r = 4 la mappa è coniugata alla mappa di duplicazione su [0,1]: pura casualità deterministica, generata da una riga di aritmetica.",
      },
      {
        pretitle: "Passo sei · La finestra di periodo 3",
        title: "Ordine, nascosto nel caos",
        body: 'Sposta r fino a circa 1 + √8 ≈ 3,8284 e il caos si ferma di colpo: appare un 3-ciclo stabile. Da lì le duplicazioni ricominciano — periodo 6, 12, 24 — e il sistema rientra nel caos. Nel 1975 Tien-Yien Li e James Yorke dimostrarono un teorema sconvolgente sull\'American Mathematical Monthly: per ogni mappa continua di un intervallo, periodo tre implica caos. Un solo 3-ciclo, ovunque sia, forza orbite di ogni altro periodo e una quantità non numerabile che non si ripete mai. La parola che coniarono per il titolo — "chaos" — è da allora il nome del campo.',
      },
    ],
    demoCaption1: "Demo in diretta · trascina r per cambiare regime",
    demoCaption2: "Dipendenza sensibile · due orbite, distanti ε",
    cobwebCaption: "Ragnatela · parabola + scala",
    orbitACaption: "Orbita A · x₀ = 0,200000",
    orbitBCaption: "Orbita B · x₀ = 0,200001",
    playLabel: "Avvia",
    pauseLabel: "Pausa",
    resetLabel: "Reimposta",
    iterLabel: "iterazione",
    divergenceLabel: "|Δ|",
    closingPretitle: "E ora · l'Explorer",
    closingTitle: "Gira tu la manopola",
    closingBody:
      "L'Explorer disegna l'intero diagramma di biforcazione da r = 2,5 a 4, traccia la serie temporale dal vivo e ti lascia attraversare ogni regime della storia qui sopra. Scegli i valori famosi dal pannello laterale — o trascina e basta.",
    ctaLabel: "→ Apri l'Explorer",
  },

  pt: {
    encounter: {
      pretitle: "Primeiro encontro · conhecer a fórmula",
      title: "Uma linha de aritmética, todo um zoo de comportamentos",
      cards: [
        {
          label: "01 · A ideia central",
          title: "Uma fórmula para os coelhos",
          body: "Imagina um prado que só consegue alimentar um número máximo de coelhos. Cada ano: coelhos do próximo ano = (taxa de crescimento) × (coelhos deste ano) × (espaço ainda livre no prado). Em símbolos: xₙ₊₁ = r·xₙ·(1−xₙ). Uma linha, um botão r. Dessa única linha cresceu toda a teoria moderna do caos.",
        },
        {
          label: "02 · Um exemplo concreto",
          title: "Três voltas do mesmo botão",
          body: "Começa em x₀ = 0,2 e gira r. Em r = 2,5 o prado assenta numa única população estável — entediante. Em r = 3,1 começa a oscilar entre dois valores, ano alto, ano baixo, para sempre. Em r = 4 a sucessão fica selvagem — salta entre 0 e 1 e nunca se repete. A mesma fórmula, três mundos completamente diferentes.",
        },
        {
          label: "03 · Por que importa",
          title: "A mesma receita aparece em todo o lado",
          body: "A cascata que vais ver — um valor, depois 2, depois 4, depois 8, depois caos — também governa as arritmias cardíacas, as populações presa-predador, os lasers que se tornam instáveis, as células de convecção em fluidos. A constante que controla a rapidez com que as duplicações se acumulam, o δ de Feigenbaum ≈ 4,6692…, é a mesma em todos. É uma das universalidades mais profundas da ciência.",
        },
      ],
      tryIt: "Arrasta os controlos nas demos abaixo. A imagem muda; a fórmula não.",
    },
    sections: [
      {
        pretitle: "Passo um · A receita",
        title: "Um ano, escrito",
        body: "Lê x como a fração de capacidade utilizada, entre 0 (prado vazio) e 1 (cheio). Escolhe uma taxa de crescimento r entre 0 e 4. Então a fração do ano seguinte é xₙ₊₁ = r · xₙ · (1 − xₙ). Exemplo: r = 2,5, xₙ = 0,4 ⇒ xₙ₊₁ = 2,5 · 0,4 · 0,6 = 0,60. Outra vez: 2,5 · 0,60 · 0,40 = 0,60. Já no ponto fixo. É exatamente a equação logística de Pierre-François Verhulst, de 1845, amostrada uma vez por geração.",
      },
      {
        pretitle: "Passo dois · A primeira bifurcação",
        title: "Em r = 3 o estado estável divide-se",
        body: "Abaixo de r = 3 a iteração assenta sempre numa única população estável — um ponto fixo. Empurra r logo acima de 3 e o ponto fixo perde estabilidade: a órbita salta cada ano entre um valor alto e um baixo. O ponto tornou-se num 2-ciclo. É uma bifurcação em tridente, a maneira mais simples de um sistema quebrar uma simetria, e é a primeira fissura na calma.",
      },
      {
        pretitle: "Passo três · A cascata",
        title: "2, 4, 8, 16 — cada vez mais rápido",
        body: "Continua a empurrar r. Em r ≈ 3,449 o 2-ciclo divide-se num 4-ciclo. Em r ≈ 3,544 o 4-ciclo torna-se num 8-ciclo. Depois 16, 32, 64 — e as janelas em que cada novo ciclo duplicado é estável encurtam-se sempre mais. Traçado, é o famoso diagrama de bifurcação: o tronco bifurca, bifurca de novo, bifurca mais depressa do que o olho consegue resolver.",
      },
      {
        pretitle: "Passo quatro · A constante de Feigenbaum",
        title: "δ ≈ 4,6692 — universal entre sistemas",
        body: "Mede quanto as janelas encolhem entre duplicações: o quociente (rₙ − rₙ₋₁) / (rₙ₊₁ − rₙ) tende para o mesmo limite. Mitchell Feigenbaum calculou-o numa calculadora de bolso em Los Alamos em 1975 e obteve δ ≈ 4,66920160910… O surpreendente, demonstrado uns anos depois por Lanford e outros, é que esta constante é universal: aparece na aplicação de Hénon, no oscilador de Duffing, em experiências de convecção de fluidos, em torneiras a pingar. A duplicação de período é uma rota, e δ é o limite de velocidade.",
      },
      {
        pretitle: "Passo cinco · Caos pleno",
        title: "r ≈ 3,56995 e o que está além",
        body: "Depois de infinitas duplicações, todas espremidas numa janela finita de r, o sistema cai finalmente no caos no ponto de Feigenbaum r∞ ≈ 3,56994567… A partir daí a órbita já não assenta em nenhum ciclo — visita um conjunto infinito de valores, e dois pontos de partida que diferem em 10⁻⁶ ficam descorrelacionados em trinta iterações. Em r = 4 a aplicação é conjugada com a duplicação angular em [0,1]: pura aleatoriedade determinística, gerada por uma linha de aritmética.",
      },
      {
        pretitle: "Passo seis · A janela de período 3",
        title: "Ordem, escondida dentro do caos",
        body: 'Desloca r até cerca de 1 + √8 ≈ 3,8284 e o caos para de repente: aparece um 3-ciclo estável. A partir daí as duplicações recomeçam — período 6, 12, 24 — e o sistema regressa ao caos. Em 1975 Tien-Yien Li e James Yorke demonstraram um teorema chocante no American Mathematical Monthly: para qualquer aplicação contínua de um intervalo, período três implica caos. Um único 3-ciclo, onde quer que esteja, força órbitas de todos os outros períodos e uma quantidade não contável de órbitas que nunca se repetem. A palavra que cunharam no título — "chaos" — é desde então o nome do campo.',
      },
    ],
    demoCaption1: "Demo em direto · arrasta r para mudar de regime",
    demoCaption2: "Dependência sensível · duas órbitas, distantes ε",
    cobwebCaption: "Teia · parábola + escada",
    orbitACaption: "Órbita A · x₀ = 0,200000",
    orbitBCaption: "Órbita B · x₀ = 0,200001",
    playLabel: "Reproduzir",
    pauseLabel: "Pausa",
    resetLabel: "Repor",
    iterLabel: "iteração",
    divergenceLabel: "|Δ|",
    closingPretitle: "E agora · o Explorer",
    closingTitle: "Gira tu o botão",
    closingBody:
      "O Explorer renderiza o diagrama de bifurcação completo de r = 2,5 a 4, desenha a série temporal em direto e deixa-te percorrer todos os regimes da história acima. Escolhe os valores famosos no painel lateral — ou simplesmente arrasta.",
    ctaLabel: "→ Abrir o Explorer",
  },

  sv: {
    encounter: {
      pretitle: "Första mötet · lär känna formeln",
      title: "En rad aritmetik, en hel djurpark av beteenden",
      cards: [
        {
          label: "01 · Grundidén",
          title: "En formel för kaniner",
          body: "Tänk dig en äng som bara kan föda ett visst antal kaniner. Varje år: nästa års kaniner = (tillväxttakt) × (årets kaniner) × (utrymme som finns kvar i ängen). I symboler: xₙ₊₁ = r·xₙ·(1−xₙ). En rad, en ratt r. Ur den enda raden har hela den moderna kaosteorin vuxit fram.",
        },
        {
          label: "02 · Ett konkret exempel",
          title: "Tre vridningar av samma ratt",
          body: "Börja vid x₀ = 0,2 och vrid på r. Vid r = 2,5 stabiliseras ängen vid en enda population — tråkigt. Vid r = 3,1 börjar den fladdra mellan två värden, högt år, lågt år, för evigt. Vid r = 4 blir följden vild — den hoppar mellan 0 och 1 och upprepas aldrig. Samma formel, tre helt olika världar.",
        },
        {
          label: "03 · Varför det spelar roll",
          title: "Samma recept dyker upp överallt",
          body: "Kaskaden du strax ska se — ett värde, sedan 2, sedan 4, sedan 8, sedan kaos — styr också hjärtarytmier, rovdjur–byte-system, lasrar som blir instabila och konvektionsceller i vätskor. Konstanten som styr hur snabbt fördubblingarna travas på varandra, Feigenbaums δ ≈ 4,6692…, är densamma i dem alla. Det är en av vetenskapens djupaste universalitetsfenomen.",
        },
      ],
      tryIt: "Dra i reglagen i demona nedan. Bilden ändras; formeln gör det inte.",
    },
    sections: [
      {
        pretitle: "Steg ett · Receptet",
        title: "Ett år, nedskrivet",
        body: "Läs x som andelen utnyttjad kapacitet, mellan 0 (tom äng) och 1 (full). Välj en tillväxttakt r mellan 0 och 4. Då är nästa års andel xₙ₊₁ = r · xₙ · (1 − xₙ). Räkneexempel: r = 2,5, xₙ = 0,4 ⇒ xₙ₊₁ = 2,5 · 0,4 · 0,6 = 0,60. Igen: 2,5 · 0,60 · 0,40 = 0,60. Redan vid fixpunkten. Det är precis Pierre-François Verhulsts logistiska ekvation från 1845, samplad en gång per generation.",
      },
      {
        pretitle: "Steg två · Den första bifurkationen",
        title: "Vid r = 3 delas det stabila tillståndet",
        body: "Under r = 3 hamnar iterationen alltid vid en enda stabil population — en fixpunkt. Tryck upp r strax över 3 och fixpunkten förlorar sin stabilitet: banan hoppar i stället varje år mellan ett högt och ett lågt värde. Punkten har blivit en 2-cykel. Det är en gaffelbifurkation, det enklaste sättet för ett system att bryta en symmetri, och det är den första sprickan i lugnet.",
      },
      {
        pretitle: "Steg tre · Kaskaden",
        title: "2, 4, 8, 16 — snabbare och snabbare",
        body: "Fortsätt skjuta upp r. Vid r ≈ 3,449 splittras 2-cykeln i en 4-cykel. Vid r ≈ 3,544 blir 4-cykeln en 8-cykel. Sedan 16, 32, 64 — och fönstren där varje ny dubblerad cykel är stabil krymper för varje gång. Plottat blir det det berömda bifurkationsdiagrammet: stammen som klyver sig, klyver sig igen, klyver sig snabbare än ögat kan följa.",
      },
      {
        pretitle: "Steg fyra · Feigenbaums konstant",
        title: "δ ≈ 4,6692 — universell mellan system",
        body: "Mät hur mycket fönstren krymper mellan fördubblingarna: kvoten (rₙ − rₙ₋₁) / (rₙ₊₁ − rₙ) går mot samma gränsvärde. Mitchell Feigenbaum räknade ut den på en fickkalkylator i Los Alamos 1975 och fick δ ≈ 4,66920160910… Det förbluffande, bevisat några år senare av Lanford och andra, är att konstanten är universell: den dyker upp i Hénon-avbildningen, i Duffing-oscillatorn, i experimentell vätskeflödeskonvektion, i droppande kranar. Periodfördubbling är en väg, och δ är hastighetsgränsen.",
      },
      {
        pretitle: "Steg fem · Fullt kaos",
        title: "r ≈ 3,56995 och vidare",
        body: "Efter oändligt många fördubblingar, allesammans hopträngda i ett ändligt r-fönster, tippar systemet till slut över i kaos vid Feigenbaum-punkten r∞ ≈ 3,56994567… Bortom den stannar banan inte längre vid någon cykel — den besöker en oändlig mängd värden, och två startvärden som skiljer sig med 10⁻⁶ är okorrelerade efter trettio iterationer. Vid r = 4 är avbildningen konjugerad med dubblingsavbildningen på [0,1]: ren deterministisk slumpmässighet, genererad av en rad aritmetik.",
      },
      {
        pretitle: "Steg sex · Period-3-fönstret",
        title: "Ordning, gömd inne i kaoset",
        body: 'Skjut r upp mot 1 + √8 ≈ 3,8284 och kaoset upphör plötsligt: en stabil 3-cykel träder fram. Därifrån börjar fördubblingarna om — period 6, 12, 24 — och systemet glider tillbaka in i kaoset. 1975 bevisade Tien-Yien Li och James Yorke en uppseendeväckande sats i American Mathematical Monthly: för varje kontinuerlig avbildning av ett intervall gäller att period tre medför kaos. En enda 3-cykel tvingar fram banor av varje annan period och en oräknelig mängd som aldrig upprepar sig. Ordet de myntade i titeln — "chaos" — har varit fältets namn sedan dess.',
      },
    ],
    demoCaption1: "Live-demo · dra i r för att byta regim",
    demoCaption2: "Känslig beroende · två banor, ε ifrån varandra",
    cobwebCaption: "Spindelnät · parabel + trappa",
    orbitACaption: "Bana A · x₀ = 0,200000",
    orbitBCaption: "Bana B · x₀ = 0,200001",
    playLabel: "Spela",
    pauseLabel: "Pausa",
    resetLabel: "Återställ",
    iterLabel: "iteration",
    divergenceLabel: "|Δ|",
    closingPretitle: "Och nu · utforskaren",
    closingTitle: "Vrid på ratten själv",
    closingBody:
      "Explorer renderar hela bifurkationsdiagrammet från r = 2,5 till 4, ritar tidsserien live och låter dig vandra genom varje regim i berättelsen ovan. Välj de berömda värdena i sidopanelen — eller dra bara.",
    ctaLabel: "→ Öppna Explorer",
  },

  no: {
    encounter: {
      pretitle: "Første møte · bli kjent med formelen",
      title: "Én linje aritmetikk, en hel dyrehage av oppførsel",
      cards: [
        {
          label: "01 · Grunntanken",
          title: "En formel for kaniner",
          body: "Se for deg en eng som bare kan fø et bestemt antall kaniner. Hvert år: neste års kaniner = (vekstrate) × (årets kaniner) × (plassen som er igjen på enga). I symboler: xₙ₊₁ = r·xₙ·(1−xₙ). Én linje, én ratt r. Ut av den ene linjen har hele den moderne kaosteorien vokst frem.",
        },
        {
          label: "02 · Et konkret eksempel",
          title: "Tre vridninger av samme ratt",
          body: "Start på x₀ = 0,2 og vri på r. Ved r = 2,5 legger enga seg på en eneste stabil populasjon — kjedelig. Ved r = 3,1 begynner den å flimre mellom to verdier, høyt år, lavt år, for alltid. Ved r = 4 blir følgen vill — den hopper mellom 0 og 1 og gjentar seg aldri. Samme formel, tre helt forskjellige verdener.",
        },
        {
          label: "03 · Hvorfor det betyr noe",
          title: "Den samme oppskriften dukker opp overalt",
          body: "Kaskaden du straks får se — én verdi, så 2, så 4, så 8, så kaos — styrer også hjertearytmier, byttedyr–rovdyr-systemer, lasere som blir ustabile, og konveksjonsceller i væsker. Konstanten som bestemmer hvor fort doblingen stables, Feigenbaums δ ≈ 4,6692…, er den samme i alle. Det er en av de dypeste universalitetene i vitenskapen.",
        },
      ],
      tryIt: "Dra i regulatorene i demoene nedenfor. Bildet endrer seg; formelen gjør det ikke.",
    },
    sections: [
      {
        pretitle: "Steg en · Oppskriften",
        title: "Ett år, skrevet ned",
        body: "Les x som andelen utnyttet kapasitet, mellom 0 (tom eng) og 1 (full). Velg en vekstrate r mellom 0 og 4. Da er neste års andel xₙ₊₁ = r · xₙ · (1 − xₙ). Regneeksempel: r = 2,5, xₙ = 0,4 ⇒ xₙ₊₁ = 2,5 · 0,4 · 0,6 = 0,60. Én gang til: 2,5 · 0,60 · 0,40 = 0,60. Allerede ved fastpunktet. Dette er nettopp Pierre-François Verhulsts logistiske ligning fra 1845, samplet én gang per generasjon.",
      },
      {
        pretitle: "Steg to · Den første bifurkasjonen",
        title: "Ved r = 3 deler den stabile tilstanden seg",
        body: "Under r = 3 lander iterasjonen alltid på én enkelt stabil populasjon — et fastpunkt. Skyv r så vidt over 3 og fastpunktet mister stabiliteten: banen hopper i stedet hvert år mellom en høy og en lav verdi. Punktet er blitt til en 2-syklus. Det er en høygaffel-bifurkasjon, den enkleste måten et system bryter en symmetri på, og det er den første sprekken i roen.",
      },
      {
        pretitle: "Steg tre · Kaskaden",
        title: "2, 4, 8, 16 — raskere og raskere",
        body: "Skyv r videre opp. Ved r ≈ 3,449 splittes 2-syklusen i en 4-syklus. Ved r ≈ 3,544 blir 4-syklusen til en 8-syklus. Så 16, 32, 64 — og vinduene der hver ny doblet syklus er stabil, blir kortere for hver gang. Plottet blir det det berømte bifurkasjonsdiagrammet: stammen forgrener seg, forgrener seg igjen, forgrener seg raskere enn øyet rekker å oppløse.",
      },
      {
        pretitle: "Steg fire · Feigenbaums konstant",
        title: "δ ≈ 4,6692 — universell på tvers av systemer",
        body: "Mål hvor mye vinduene krymper mellom doblingene: forholdet (rₙ − rₙ₋₁) / (rₙ₊₁ − rₙ) går mot samme grense. Mitchell Feigenbaum regnet den ut på en lommekalkulator i Los Alamos i 1975 og fikk δ ≈ 4,66920160910… Det forbløffende, bevist noen år senere av Lanford og andre, er at denne konstanten er universell: den dukker opp i Hénon-avbildningen, i Duffing-oscillatoren, i eksperimentell væskekonveksjon, i dryppende kraner. Periodedobling er en rute, og δ er fartsgrensen.",
      },
      {
        pretitle: "Steg fem · Fullt kaos",
        title: "r ≈ 3,56995 og videre",
        body: "Etter uendelig mange doblinger, alle presset inn i et endelig r-vindu, tipper systemet til slutt over i kaos ved Feigenbaum-punktet r∞ ≈ 3,56994567… Bortenfor legger banen seg ikke lenger på noen syklus — den besøker et uendelig sett av verdier, og to startpunkter som skiller seg med 10⁻⁶ blir ukorrelerte i løpet av tretti iterasjoner. Ved r = 4 er avbildningen konjugert med doblingsavbildningen på [0,1]: ren deterministisk tilfeldighet, generert av én linje aritmetikk.",
      },
      {
        pretitle: "Steg seks · Periode-3-vinduet",
        title: "Orden, gjemt midt i kaoset",
        body: 'Skyv r opp til omtrent 1 + √8 ≈ 3,8284 og kaoset stopper plutselig: en stabil 3-syklus dukker opp. Derfra starter doblingene på nytt — periode 6, 12, 24 — og systemet glir tilbake i kaoset. I 1975 beviste Tien-Yien Li og James Yorke et oppsiktsvekkende teorem i American Mathematical Monthly: for enhver kontinuerlig avbildning av et intervall medfører periode tre kaos. En eneste 3-syklus tvinger frem baner av enhver annen periode og en uoverkjørbar mengde som aldri gjentar seg. Ordet de skapte i tittelen — "chaos" — har vært feltets navn siden.',
      },
    ],
    demoCaption1: "Live-demo · dra i r for å skifte regime",
    demoCaption2: "Sensitiv avhengighet · to baner, ε fra hverandre",
    cobwebCaption: "Spindelvev · parabel + trapp",
    orbitACaption: "Bane A · x₀ = 0,200000",
    orbitBCaption: "Bane B · x₀ = 0,200001",
    playLabel: "Spill",
    pauseLabel: "Pause",
    resetLabel: "Nullstill",
    iterLabel: "iterasjon",
    divergenceLabel: "|Δ|",
    closingPretitle: "Og nå · utforskeren",
    closingTitle: "Vri på ratten selv",
    closingBody:
      "Explorer rendrer hele bifurkasjonsdiagrammet fra r = 2,5 til 4, tegner tidsserien live og lar deg vandre gjennom hvert regime i historien over. Velg de berømte verdiene i sidepanelet — eller bare dra.",
    ctaLabel: "→ Åpne Explorer",
  },
};

// Per-locale bifurcation-table rows. Keep the r values universal; only the
// "what happens" prose is localised.
const BIFURCATION_TABLE: Record<Locale, Array<[string, string]>> = {
  en: [
    ["0 ≤ r < 1", "Extinction. Every starting population dies out."],
    ["1 ≤ r < 3", "Stable fixed point. One steady population."],
    ["r = 3", "First bifurcation. Splits into a 2-cycle."],
    ["r ≈ 3.449", "2-cycle → 4-cycle."],
    ["r ≈ 3.544", "4-cycle → 8-cycle."],
    ["r ≈ 3.5644", "8-cycle → 16-cycle."],
    ["r ≈ 3.56995", "Onset of chaos (Feigenbaum point)."],
    ["r ≈ 3.8284", "Period-3 window opens (1 + √8)."],
    ["r = 4", "Full chaos; orbit covers [0, 1]."],
  ],
  de: [
    ["0 ≤ r < 1", "Aussterben. Jede Anfangspopulation stirbt aus."],
    ["1 ≤ r < 3", "Stabiler Fixpunkt. Eine stetige Population."],
    ["r = 3", "Erste Bifurkation. Spaltet in 2-Zyklus."],
    ["r ≈ 3,449", "2-Zyklus → 4-Zyklus."],
    ["r ≈ 3,544", "4-Zyklus → 8-Zyklus."],
    ["r ≈ 3,5644", "8-Zyklus → 16-Zyklus."],
    ["r ≈ 3,56995", "Beginn des Chaos (Feigenbaum-Punkt)."],
    ["r ≈ 3,8284", "Periode-3-Fenster (1 + √8)."],
    ["r = 4", "Volles Chaos; Orbit deckt [0, 1] ab."],
  ],
  es: [
    ["0 ≤ r < 1", "Extinción. Toda población inicial muere."],
    ["1 ≤ r < 3", "Punto fijo estable. Una sola población."],
    ["r = 3", "Primera bifurcación. Pasa a 2-ciclo."],
    ["r ≈ 3,449", "2-ciclo → 4-ciclo."],
    ["r ≈ 3,544", "4-ciclo → 8-ciclo."],
    ["r ≈ 3,5644", "8-ciclo → 16-ciclo."],
    ["r ≈ 3,56995", "Inicio del caos (punto de Feigenbaum)."],
    ["r ≈ 3,8284", "Ventana de periodo 3 (1 + √8)."],
    ["r = 4", "Caos pleno; órbita cubre [0, 1]."],
  ],
  fr: [
    ["0 ≤ r < 1", "Extinction. Toute population initiale s'éteint."],
    ["1 ≤ r < 3", "Point fixe stable. Population unique."],
    ["r = 3", "Première bifurcation. Devient 2-cycle."],
    ["r ≈ 3,449", "2-cycle → 4-cycle."],
    ["r ≈ 3,544", "4-cycle → 8-cycle."],
    ["r ≈ 3,5644", "8-cycle → 16-cycle."],
    ["r ≈ 3,56995", "Début du chaos (point de Feigenbaum)."],
    ["r ≈ 3,8284", "Fenêtre de période 3 (1 + √8)."],
    ["r = 4", "Chaos complet ; orbite couvre [0, 1]."],
  ],
  it: [
    ["0 ≤ r < 1", "Estinzione. Ogni popolazione iniziale si spegne."],
    ["1 ≤ r < 3", "Punto fisso stabile. Una sola popolazione."],
    ["r = 3", "Prima biforcazione. Diventa 2-ciclo."],
    ["r ≈ 3,449", "2-ciclo → 4-ciclo."],
    ["r ≈ 3,544", "4-ciclo → 8-ciclo."],
    ["r ≈ 3,5644", "8-ciclo → 16-ciclo."],
    ["r ≈ 3,56995", "Inizio del caos (punto di Feigenbaum)."],
    ["r ≈ 3,8284", "Finestra di periodo 3 (1 + √8)."],
    ["r = 4", "Caos pieno; orbita copre [0, 1]."],
  ],
  pt: [
    ["0 ≤ r < 1", "Extinção. Toda população inicial morre."],
    ["1 ≤ r < 3", "Ponto fixo estável. Uma só população."],
    ["r = 3", "Primeira bifurcação. Passa a 2-ciclo."],
    ["r ≈ 3,449", "2-ciclo → 4-ciclo."],
    ["r ≈ 3,544", "4-ciclo → 8-ciclo."],
    ["r ≈ 3,5644", "8-ciclo → 16-ciclo."],
    ["r ≈ 3,56995", "Início do caos (ponto de Feigenbaum)."],
    ["r ≈ 3,8284", "Janela de período 3 (1 + √8)."],
    ["r = 4", "Caos pleno; órbita cobre [0, 1]."],
  ],
  sv: [
    ["0 ≤ r < 1", "Utdöende. Varje startpopulation dör ut."],
    ["1 ≤ r < 3", "Stabil fixpunkt. En enda jämn population."],
    ["r = 3", "Första bifurkationen. Övergår till 2-cykel."],
    ["r ≈ 3,449", "2-cykel → 4-cykel."],
    ["r ≈ 3,544", "4-cykel → 8-cykel."],
    ["r ≈ 3,5644", "8-cykel → 16-cykel."],
    ["r ≈ 3,56995", "Kaoset börjar (Feigenbaum-punkten)."],
    ["r ≈ 3,8284", "Period-3-fönster öppnas (1 + √8)."],
    ["r = 4", "Fullt kaos; banan täcker [0, 1]."],
  ],
  no: [
    ["0 ≤ r < 1", "Utdøing. Enhver startpopulasjon dør ut."],
    ["1 ≤ r < 3", "Stabilt fastpunkt. Én jevn populasjon."],
    ["r = 3", "Første bifurkasjon. Blir 2-syklus."],
    ["r ≈ 3,449", "2-syklus → 4-syklus."],
    ["r ≈ 3,544", "4-syklus → 8-syklus."],
    ["r ≈ 3,5644", "8-syklus → 16-syklus."],
    ["r ≈ 3,56995", "Kaos starter (Feigenbaum-punktet)."],
    ["r ≈ 3,8284", "Periode-3-vindu åpner (1 + √8)."],
    ["r = 4", "Fullt kaos; banen dekker [0, 1]."],
  ],
};

// Column labels for the bifurcation table.
const BIF_LABELS: Record<
  Locale,
  { r: string; what: string; title: string; feigenbaum: string; feigenbaumNote: string }
> = {
  en: {
    r: "r",
    what: "what happens",
    title: "Bifurcation cascade",
    feigenbaum: "Feigenbaum constant",
    feigenbaumNote:
      "Ratio of successive doubling-interval widths. Universal across period-doubling systems.",
  },
  de: {
    r: "r",
    what: "was passiert",
    title: "Bifurkations-Kaskade",
    feigenbaum: "Feigenbaum-Konstante",
    feigenbaumNote:
      "Verhältnis aufeinanderfolgender Verdoppelungs-Fenster. Universell für alle Periodenverdopplungs-Systeme.",
  },
  es: {
    r: "r",
    what: "qué sucede",
    title: "Cascada de bifurcaciones",
    feigenbaum: "Constante de Feigenbaum",
    feigenbaumNote:
      "Cociente entre anchuras de ventanas de duplicación sucesivas. Universal en sistemas que duplican periodo.",
  },
  fr: {
    r: "r",
    what: "ce qui se passe",
    title: "Cascade de bifurcations",
    feigenbaum: "Constante de Feigenbaum",
    feigenbaumNote:
      "Rapport entre fenêtres de doublement successives. Universelle parmi les systèmes à doublement de période.",
  },
  it: {
    r: "r",
    what: "cosa succede",
    title: "Cascata di biforcazioni",
    feigenbaum: "Costante di Feigenbaum",
    feigenbaumNote:
      "Rapporto fra finestre di duplicazione successive. Universale nei sistemi a duplicazione di periodo.",
  },
  pt: {
    r: "r",
    what: "o que acontece",
    title: "Cascata de bifurcações",
    feigenbaum: "Constante de Feigenbaum",
    feigenbaumNote:
      "Razão entre janelas de duplicação sucessivas. Universal entre sistemas com duplicação de período.",
  },
  sv: {
    r: "r",
    what: "vad som händer",
    title: "Bifurkationskaskad",
    feigenbaum: "Feigenbaums konstant",
    feigenbaumNote:
      "Förhållande mellan på varandra följande fördubblingsfönster. Universell för periodfördubblande system.",
  },
  no: {
    r: "r",
    what: "hva som skjer",
    title: "Bifurkasjons-kaskade",
    feigenbaum: "Feigenbaums konstant",
    feigenbaumNote:
      "Forholdet mellom etterfølgende doblingsvinduer. Universelt for periodedoblende systemer.",
  },
};

export default function LogisticStory() {
  const { locale, s, u } = useI18n();
  const page = s.pages.logistic;
  const story = RICH_STORY[locale];
  const bif = BIFURCATION_TABLE[locale];
  const labels = BIF_LABELS[locale];

  return (
    <StoryPageShell
      page={page}
      ctaHref="/logistic/explorer"
      accent={ACCENT}
      borderAccent="border-signal-coral/70"
      bgAccent="bg-signal-coral/10"
      hoverAccent="hover:bg-signal-coral/20"
      gradient="from-signal-coral/10"
      formulaBadge="xₙ₊₁ = r · xₙ (1 − xₙ)"
      formulaLatex={"x_{n+1} = r\\, x_n (1 - x_n)"}
      finalLabel={s.storyLabels.yourTurn}
    >
      {/* ─────────── First encounter — three layperson cards ─────────── */}
      <section className="mx-auto mb-32 max-w-5xl space-y-10 px-2">
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
            <Reveal key={card.label} delay={120 + i * 120}>
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
        <Reveal delay={520}>
          <div className="text-center italic text-ink-300">{story.encounter.tryIt}</div>
        </Reveal>
      </section>

      {/* ─────────── Section 1: recipe + worked example ─────────── */}
      <section className="mx-auto mb-32 max-w-4xl space-y-6">
        <Reveal>
          <article className="glass hairline space-y-4 rounded-2xl border p-8 md:p-10">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {story.sections[0].pretitle}
            </div>
            <h2 className="math-italic text-3xl leading-tight md:text-4xl">
              {story.sections[0].title}
            </h2>
            <p className="leading-relaxed text-ink-100">{story.sections[0].body}</p>
          </article>
        </Reveal>
        <Reveal delay={120}>
          <div className="hairline space-y-2 rounded-2xl border bg-ink-950/40 p-6">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              r = 2.5, x₀ = 0.4
            </div>
            <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-ink-100 md:text-sm">
              {`x₀ = 0.40
x₁ = 2.5 · 0.40 · (1 − 0.40) = 0.60
x₂ = 2.5 · 0.60 · (1 − 0.60) = 0.60
x₃ = 0.60   →   fixed point reached`}
            </pre>
          </div>
        </Reveal>
      </section>

      {/* ─────────── Section 2: first bifurcation ─────────── */}
      <section className="mx-auto mb-32 max-w-4xl space-y-6">
        <Reveal>
          <article className="glass hairline space-y-4 rounded-2xl border p-8 md:p-10">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {story.sections[1].pretitle}
            </div>
            <h2 className="math-italic text-3xl leading-tight md:text-4xl">
              {story.sections[1].title}
            </h2>
            <p className="leading-relaxed text-ink-100">{story.sections[1].body}</p>
          </article>
        </Reveal>
        <Reveal delay={120}>
          <div className="space-y-2">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {story.demoCaption1}
            </div>
            <LogisticRTimeSeries
              caption={story.demoCaption1}
              cobwebCaption={story.cobwebCaption}
              initialR={3.1}
            />
          </div>
        </Reveal>
      </section>

      {/* ─────────── Section 3: cascade + table ─────────── */}
      <section className="mx-auto mb-32 max-w-4xl space-y-6">
        <Reveal>
          <article className="glass hairline space-y-4 rounded-2xl border p-8 md:p-10">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {story.sections[2].pretitle}
            </div>
            <h2 className="math-italic text-3xl leading-tight md:text-4xl">
              {story.sections[2].title}
            </h2>
            <p className="leading-relaxed text-ink-100">{story.sections[2].body}</p>
          </article>
        </Reveal>
        <Reveal delay={120}>
          <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-6">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {labels.title}
            </div>
            <table className="w-full font-mono text-sm">
              <thead className="hairline border-b text-ink-300">
                <tr>
                  <th className="px-2 py-2 text-left text-[10px] uppercase tracking-widest">
                    {labels.r}
                  </th>
                  <th className="px-2 py-2 text-left text-[10px] uppercase tracking-widest">
                    {labels.what}
                  </th>
                </tr>
              </thead>
              <tbody>
                {bif.map(([rRow, what]) => (
                  <tr key={rRow} className="border-b border-ink-700/30 last:border-0">
                    <td className="whitespace-nowrap px-2 py-2 text-signal-amber">{rRow}</td>
                    <td className="px-2 py-2 text-ink-200">{what}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </section>

      {/* ─────────── Section 4: Feigenbaum δ ─────────── */}
      <section className="mx-auto mb-32 max-w-4xl space-y-6">
        <Reveal>
          <article className="glass hairline space-y-4 rounded-2xl border p-8 md:p-10">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {story.sections[3].pretitle}
            </div>
            <h2 className="math-italic text-3xl leading-tight md:text-4xl">
              {story.sections[3].title}
            </h2>
            <p className="leading-relaxed text-ink-100">{story.sections[3].body}</p>
          </article>
        </Reveal>
        <Reveal delay={120}>
          <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-8 text-center">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {labels.feigenbaum}
            </div>
            <div className="math-italic text-6xl text-ink-100 md:text-7xl">δ = 4.66920…</div>
            <p className="mx-auto max-w-xl text-sm leading-relaxed text-ink-300">
              {labels.feigenbaumNote}
            </p>
          </div>
        </Reveal>
      </section>

      {/* ─────────── Section 5: full chaos + divergence demo ─────────── */}
      <section className="mx-auto mb-32 max-w-4xl space-y-6">
        <Reveal>
          <article className="glass hairline space-y-4 rounded-2xl border p-8 md:p-10">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {story.sections[4].pretitle}
            </div>
            <h2 className="math-italic text-3xl leading-tight md:text-4xl">
              {story.sections[4].title}
            </h2>
            <p className="leading-relaxed text-ink-100">{story.sections[4].body}</p>
          </article>
        </Reveal>
        <Reveal delay={120}>
          <div className="space-y-2">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {story.demoCaption2}
            </div>
            <LogisticDivergeDemo
              captionA={story.orbitACaption}
              captionB={story.orbitBCaption}
              playLabel={story.playLabel}
              pauseLabel={story.pauseLabel}
              resetLabel={story.resetLabel}
              iterLabel={story.iterLabel}
              divergenceLabel={story.divergenceLabel}
            />
          </div>
        </Reveal>
      </section>

      {/* ─────────── Section 6: period-3 / Li–Yorke ─────────── */}
      <section className="mx-auto mb-32 max-w-4xl space-y-6">
        <Reveal>
          <article className="glass hairline space-y-4 rounded-2xl border p-8 md:p-10">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {story.sections[5].pretitle}
            </div>
            <h2 className="math-italic text-3xl leading-tight md:text-4xl">
              {story.sections[5].title}
            </h2>
            <p className="leading-relaxed text-ink-100">{story.sections[5].body}</p>
          </article>
        </Reveal>
        <Reveal delay={120}>
          <div className="hairline space-y-2 rounded-2xl border bg-ink-950/40 p-8 text-center">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              Li &amp; Yorke · Am. Math. Monthly · 1975
            </div>
            <div className="math-italic text-3xl leading-tight text-ink-100 md:text-4xl">
              Period three implies chaos.
            </div>
          </div>
        </Reveal>
      </section>

      {/* ─────────── Closing CTA glass card ─────────── */}
      <Reveal>
        <section className="glass hairline mx-auto mb-16 max-w-4xl space-y-6 rounded-3xl border p-10 text-center md:p-14">
          <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
            {story.closingPretitle}
          </div>
          <h2 className="math-italic text-4xl leading-tight md:text-5xl">{story.closingTitle}</h2>
          <p className="mx-auto max-w-2xl leading-relaxed text-ink-200">{story.closingBody}</p>
          <div className="flex flex-col items-center justify-center gap-3 pt-2 md:flex-row">
            <Link
              href="/logistic/explorer"
              className="rounded-full border border-signal-coral/70 bg-signal-coral/10 px-6 py-3 font-mono text-xs uppercase tracking-widest2 text-signal-coral transition-colors hover:bg-signal-coral/25"
            >
              {story.ctaLabel}
            </Link>
            <Link
              href="/"
              className="hairline rounded-full border px-6 py-3 font-mono text-xs uppercase tracking-widest2 text-ink-200 transition-colors hover:border-ink-300/50 hover:text-ink-100"
            >
              {u.back}
            </Link>
          </div>
        </section>
      </Reveal>
    </StoryPageShell>
  );
}
