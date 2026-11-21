import type { ExplorerGuide } from "./types";

// Numbers quoted here (default weights 1.5 / 1.0 / 1.0, radii 80 and 25 px,
// the 0.05, 1/100 and 0.6 gains, the 500-boid cap, the 30 px edge margin)
// match app/boids/explorer/page.tsx; update both together.
const STEER_EXCERPT = `if (d2 > perR2 || d2 === 0) continue;
perCount++;
aliX += boids[j * 4 + 2];      // sum neighbour velocities
aliY += boids[j * 4 + 3];
cohX += dx;                    // sum displacements to neighbours
cohY += dy;
if (d2 < sepR2) {              // too close: push away, 1/distance weighted
  sepX += -dx / d2;
  sepY += -dy / d2;
  sepCount++;
}
// after the neighbour loop:
ax += (aliX / perCount - ivx) * p.wAli * 0.05;
ax += (cohX / perCount / 100) * p.wCoh;
ax += (sepX / Math.hypot(sepX, sepY)) * p.wSep * 0.6 * dpr;`;

export const BOIDS_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Tune Craig Reynolds' boids live: weight separation, alignment and cohesion, change the perception radius and watch a flock emerge from three local rules.",
    heading: "How this explorer works",
    intro:
      "Every small triangle on the canvas is a boid, a simulated bird that knows nothing about the flock as a whole. It only looks at the boids within a fixed radius around it and adjusts its velocity a little every frame. There is no leader, no target and no shared plan. Still, within a few seconds the scattered triangles line up into streams, merge into swarms and swirl around each other. The flock is not programmed anywhere; it emerges from the interactions.",
    sections: [
      {
        heading: "Three rules, nothing more",
        paragraphs: [
          "Craig Reynolds introduced boids in a paper presented at SIGGRAPH in 1987. Each boid follows three steering rules. Separation: move away from neighbours that are too close. Alignment: turn towards the average heading of the neighbours. Cohesion: move towards the average position of the neighbours. Each rule produces a small acceleration, the three are added with adjustable weights, and the sum changes the velocity.",
          "None of the rules mentions the flock. They only refer to what a single boid can see, which is why the model is a standard example of emergence: global order from purely local decisions. Switch off any one of the three and the collective behaviour changes in a characteristic way, which the experiments below let you see directly.",
        ],
        formula:
          "\\vec v_i \\leftarrow \\vec v_i + w_s\\,\\vec a_{\\text{sep}} + w_a\\,\\vec a_{\\text{ali}} + w_c\\,\\vec a_{\\text{coh}}, \\qquad |\\vec v_i| \\le v_{\\max}",
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "The three weight sliders scale the rules from 0 to 3. The defaults are separation 1.5, alignment 1.0 and cohesion 1.0; separation starts a bit stronger so the flock does not collapse into a single dot. The Active rules buttons switch a rule off entirely. For the motion that is the same as a weight of zero, but the toggle keeps your tuned weight, so one click brings it back.",
          "Perception radius (20 to 200 px, default 80) decides how far a boid can see. Separation radius (10 to 80 px, default 25) is the personal space inside which the push-away rule kicks in. Only boids that are already within the perception radius count for separation, so a separation radius larger than the perception radius has no extra effect. Max speed (1 to 8, default 4) caps the length of every velocity vector.",
          "The population slider ranges from 50 to 500 boids, default 220. Plus Cluster drops 30 new boids into a small disc in the centre with random headings, up to the same cap of 500. Reset scatters the current number of boids over the canvas with random positions and speeds. Edge behaviour switches between a torus, where a boid leaving on the right re-enters on the left, and a bounded box with walls.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "All boids live in one Float32Array with four numbers per boid: x, y, vx and vy. Each animation frame compares every boid with every other boid, which costs n squared distance checks: about 48,000 at the default 220 boids and about 250,000 at 500. That is cheap enough for a modern browser without a spatial grid. The new velocities go into a separate buffer first, so every boid reacts to the same snapshot of the flock rather than to neighbours that have already moved.",
          "Separation sums the vectors pointing away from close neighbours, each divided by the squared distance, so the nearest neighbour dominates. The sum is then normalised, which means separation always has the same strength no matter how many boids crowd in. Alignment steers 5 percent of the way towards the neighbours' mean velocity per frame, cohesion adds one hundredth of the mean offset to the neighbours. If a boid ever stalls below a tiny speed, it gets a random kick so it cannot freeze in place.",
          "In torus mode, distances are measured the short way around the edges. Without that, two boids on opposite sides of a seam would look a full screen apart and the flock would tear every time it crossed the border. In bounded mode, boids within 30 px of a wall are nudged inwards and reflected if they still hit it. Each boid is drawn as a triangle rotated to its velocity, over a translucent fill that leaves short motion trails. If your system asks for reduced motion, the simulation starts paused and shows one crisp frame; Play opts in to the animation.",
        ],
        code: STEER_EXCERPT,
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "Remove the glue",
        text: "Switch off Coh and keep the other two. Boids still line up with their neighbours, but nothing pulls groups together, so the flock dissolves into loose parallel streams that drift apart.",
      },
      {
        title: "A traffic jam without alignment",
        text: "Switch off Ali and raise cohesion to 2. Boids gather into tight, buzzing clumps that wobble around their centre but have no common direction. Turn alignment back on and the clumps start travelling.",
      },
      {
        title: "Short-sighted birds",
        text: "Lower the perception radius to 25 px. Each boid sees only its immediate neighbours, so you get many small flocks that pass through each other. Push it to 200 px and the whole population soon moves as one huge swarm.",
      },
      {
        title: "Crowd control",
        text: "Set separation to 0 and press Plus Cluster a few times. The boids collapse onto almost the same point. Raise separation to 3 and the cluster explodes into an evenly spaced lattice that still flies together.",
      },
    ],
  },
  de: {
    metaDescription:
      "Boids nach Craig Reynolds live steuern: Separation, Ausrichtung und Kohäsion gewichten, den Sichtradius ändern und sehen, wie aus drei Regeln ein Schwarm wird.",
    heading: "So funktioniert dieser Explorer",
    intro:
      "Jedes kleine Dreieck auf dem Canvas ist ein Boid, ein simulierter Vogel, der vom Schwarm als Ganzem nichts weiß. Er schaut nur auf die Boids in einem festen Radius um sich herum und passt seine Geschwindigkeit in jedem Frame ein wenig an. Es gibt keine Anführung, kein Ziel und keinen gemeinsamen Plan. Trotzdem ordnen sich die verstreuten Dreiecke nach wenigen Sekunden zu Strömen, verschmelzen zu Schwärmen und umkreisen einander. Der Schwarm ist nirgends programmiert, er entsteht aus den Wechselwirkungen.",
    sections: [
      {
        heading: "Drei Regeln, mehr nicht",
        paragraphs: [
          "Craig Reynolds stellte Boids 1987 in einem Paper auf der SIGGRAPH vor. Jeder Boid folgt drei Steuerregeln. Separation: weg von Nachbarn, die zu nah sind. Ausrichtung: in die durchschnittliche Flugrichtung der Nachbarn drehen. Kohäsion: zur durchschnittlichen Position der Nachbarn hin. Jede Regel erzeugt eine kleine Beschleunigung, die drei werden mit einstellbaren Gewichten addiert, und die Summe verändert die Geschwindigkeit.",
          "Keine der Regeln erwähnt den Schwarm. Sie beziehen sich nur auf das, was ein einzelner Boid sieht. Deshalb ist das Modell ein Paradebeispiel für Emergenz: globale Ordnung aus rein lokalen Entscheidungen. Schaltest du eine der drei Regeln ab, ändert sich das Verhalten des Schwarms auf typische Weise, und genau das kannst du unten in den Experimenten beobachten.",
        ],
        formula:
          "\\vec v_i \\leftarrow \\vec v_i + w_s\\,\\vec a_{\\text{sep}} + w_a\\,\\vec a_{\\text{ali}} + w_c\\,\\vec a_{\\text{coh}}, \\qquad |\\vec v_i| \\le v_{\\max}",
      },
      {
        heading: "Was die Regler bewirken",
        paragraphs: [
          "Die drei Gewichtsregler skalieren die Regeln von 0 bis 3. Voreingestellt sind Separation 1,5, Ausrichtung 1,0 und Kohäsion 1,0. Die Separation startet etwas stärker, damit der Schwarm nicht zu einem einzigen Punkt zusammenfällt. Mit den Knöpfen unter «Active rules» schaltest du eine Regel ganz ab. Auf die Bewegung wirkt das wie Gewicht null, aber du kommst mit einem Klick zu deinem eingestellten Gewicht zurück.",
          "Der Wahrnehmungsradius (20 bis 200 px, Standard 80) legt fest, wie weit ein Boid sieht. Der Separationsradius (10 bis 80 px, Standard 25) ist der persönliche Abstand, ab dem die Ausweichregel greift. Für die Separation zählen nur Boids, die schon im Wahrnehmungsradius liegen; ein Separationsradius größer als der Wahrnehmungsradius bringt also nichts zusätzlich. Die Höchstgeschwindigkeit (1 bis 8, Standard 4) begrenzt die Länge jedes Geschwindigkeitsvektors.",
          "Die Population reicht von 50 bis 500 Boids, Standard 220. «+ Cluster» setzt 30 neue Boids mit zufälligen Richtungen in eine kleine Scheibe in der Mitte, bis zur selben Obergrenze von 500. «Reset» verteilt die aktuelle Anzahl neu mit zufälligen Positionen und Geschwindigkeiten. Beim Randverhalten wählst du zwischen einem Torus, auf dem ein Boid, der rechts hinausfliegt, links wieder auftaucht, und einer Box mit Wänden.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Alle Boids stecken in einem einzigen Float32Array mit vier Zahlen pro Boid: x, y, vx und vy. In jedem Frame wird jeder Boid mit jedem anderen verglichen, das sind n² Abstandsprüfungen: rund 48.000 bei den voreingestellten 220 Boids und rund 250.000 bei 500. Das schafft ein moderner Browser auch ohne räumliches Gitter. Die neuen Geschwindigkeiten landen zuerst in einem eigenen Puffer, damit alle Boids auf denselben Schnappschuss des Schwarms reagieren und nicht auf Nachbarn, die sich schon bewegt haben.",
          "Die Separation summiert die Vektoren weg von nahen Nachbarn, jeweils geteilt durch das Abstandsquadrat, sodass der nächste Nachbar dominiert. Danach wird die Summe normiert: Die Separation wirkt also immer gleich stark, egal wie viele Boids sich drängen. Die Ausrichtung steuert pro Frame 5 Prozent des Wegs zur mittleren Geschwindigkeit der Nachbarn, die Kohäsion addiert ein Hundertstel des mittleren Abstands zu ihnen. Fällt ein Boid unter eine winzige Geschwindigkeit, bekommt er einen zufälligen Schubs, damit er nicht einfriert.",
          "Im Torus-Modus werden Abstände auf dem kurzen Weg über die Ränder gemessen. Sonst lägen zwei Boids auf beiden Seiten einer Kante scheinbar einen ganzen Bildschirm auseinander, und der Schwarm würde bei jedem Grenzübertritt zerreißen. Im begrenzten Modus werden Boids, die einer Wand näher als 30 px kommen, nach innen gelenkt und notfalls reflektiert. Jeder Boid ist ein Dreieck in Flugrichtung, gezeichnet über eine halbtransparente Fläche, die kurze Bewegungsspuren hinterlässt. Wünscht dein System reduzierte Bewegung, startet die Simulation pausiert mit einem scharfen Standbild; mit «Play» schaltest du die Animation bewusst ein.",
        ],
        code: STEER_EXCERPT,
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Den Klebstoff entfernen",
        text: "Schalte «Coh» ab und lass die anderen beiden an. Die Boids richten sich weiter nach ihren Nachbarn aus, aber nichts hält Gruppen zusammen. Der Schwarm löst sich in lockere, parallele Ströme auf, die auseinanderdriften.",
      },
      {
        title: "Stau ohne Ausrichtung",
        text: "Schalte «Ali» ab und erhöhe die Kohäsion auf 2. Die Boids sammeln sich zu dichten, zappelnden Klumpen, die um ihr Zentrum wackeln, aber keine gemeinsame Richtung haben. Schaltest du die Ausrichtung wieder ein, setzen sich die Klumpen in Bewegung.",
      },
      {
        title: "Kurzsichtige Vögel",
        text: "Senke den Wahrnehmungsradius auf 25 px. Jeder Boid sieht nur seine direkten Nachbarn, und es entstehen viele kleine Schwärme, die durcheinander hindurchfliegen. Bei 200 px bewegt sich bald die ganze Population als ein riesiger Schwarm.",
      },
      {
        title: "Gedränge steuern",
        text: "Stell die Separation auf 0 und drück ein paarmal «+ Cluster». Die Boids fallen fast auf denselben Punkt zusammen. Erhöhst du die Separation auf 3, platzt der Haufen zu einem gleichmäßig verteilten Gitter auf, das trotzdem gemeinsam weiterfliegt.",
      },
    ],
  },
};
