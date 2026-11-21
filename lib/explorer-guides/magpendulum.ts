import type { ExplorerGuide } from "./types";

// Numbers quoted here (dt = 0.02, 3000 steps, capture radius² 0.06 and
// speed² 0.005, 6 rows per frame, the slider defaults) match
// app/magpendulum/explorer/page.tsx; update both together.
const STEP_EXCERPT = `const dt = 0.02;
for (let step = 0; step < maxSteps; step++) {
  let ax = -gamma * vx - omega2 * x;
  let ay = -gamma * vy - omega2 * y;
  for (let i = 0; i < magnets.length; i++) {
    const dx = x - magnets[i].x;
    const dy = y - magnets[i].y;
    const r2 = dx * dx + dy * dy + h * h;
    const r3 = r2 * Math.sqrt(r2);
    ax -= (k * dx) / r3;
    ay -= (k * dy) / r3;
  }
  vx += ax * dt;  vy += ay * dt;  // velocity first,
  x += vx * dt;   y += vy * dt;   // then position
  // every 8 steps: captured if d² < 0.06 and v² < 0.005
}`;

export const MAGPENDULUM_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Magnetic pendulum basin map: every pixel is a full simulation of a pendulum over three magnets. Tune strength, damping and height and see fractal boundaries.",
    heading: "How this explorer works",
    intro:
      "Picture a pendulum bob hanging over a plate with three magnets set in a triangle. Pull it to some point, let go, and after a while it comes to rest over one of the magnets. The map colours every starting point by the magnet that finally catches it: rose, cyan or green. Big calm patches mean predictable behaviour. Where the colours braid into thin interleaved bands, a tiny change in where you let go decides the outcome. Every pixel is its own complete simulation.",
    sections: [
      {
        heading: "The model",
        paragraphs: [
          "The explorer flattens the pendulum into the plane: p = (x, y) is the position of the bob seen from above. Three forces act on it. Air resistance γ·ṗ slows it down, a spring term ω²·p pulls it back toward the centre (that is what gravity does for a real pendulum at small amplitudes), and each magnet pulls it toward itself with a force that falls off with distance.",
          "The bob does not touch the plate. It swings at height h above it, so the distance to a magnet is √(d² + h²) rather than d. That keeps the force finite directly over a magnet and is what makes the model behave sensibly. The magnets sit at the corners of an equilateral triangle of radius 1 around the centre, at (0, −1) and (±0.866, 0.5).",
        ],
        formula:
          "\\ddot{\\mathbf p} = -\\gamma\\,\\dot{\\mathbf p} - \\omega^2 \\mathbf p - \\sum_{i=1}^{3} \\frac{k\\,(\\mathbf p - \\mathbf m_i)}{\\left(|\\mathbf p - \\mathbf m_i|^2 + h^2\\right)^{3/2}}",
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "Magnet strength k (0.05 to 1.5, default 0.4) scales the pull of all three magnets. Damping γ (0.01 to 0.6, default 0.18) is the friction: low values let the bob fly past magnets many times before it settles, high values make it stop almost where it was aimed. Restoring ω² (0.05 to 2, default 0.5) is the stiffness of the pull back to the centre. Pendulum height h (0.05 to 0.6, default 0.18) sets how close the bob passes over the magnets; small h means sharp, strong pulls right above a magnet, large h smears the field out.",
          "View span (0.8 to 4, default 2.0) chooses the square of starting points, from −span to +span in both directions, so lowering it zooms in on the centre. Resolution (60 to 360 pixels per side, default 180) sets how many starting points are simulated. With shading on, each pixel is darkened by how long capture took: bright means caught quickly, dark means a long chaotic flight. Recompute runs the whole map again; any slider change does that automatically.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "Each pixel starts the bob at rest at the centre of that pixel's cell and integrates the equation with the semi-implicit Euler method at a fixed step of dt = 0.02: velocity is updated from the acceleration first, then position from the new velocity. That ordering is barely more expensive than plain Euler but keeps oscillations from gaining energy out of nothing, which is good enough here because the only result that matters is which magnet wins.",
          "Every eighth step the code checks whether the bob is within distance √0.06 ≈ 0.245 of a magnet and slower than √0.005 ≈ 0.07. If so, that magnet is the winner and the step count becomes the capture time. If 3000 steps pass without capture, or the numbers blow up, the nearest magnet is taken instead and the pixel gets the darkest shade.",
          "At the default resolution that is 32,400 trajectories of up to 3000 steps each, so the map is computed in slices of six rows per animation frame. The progress badge counts up while the image fills from top to bottom, and the browser stays responsive. Pixels go into an ImageData buffer at the chosen resolution, which is then scaled up without smoothing into the largest centred square of the canvas, so the triangle is never stretched. There is no ongoing animation: once the badge reads ready, the picture stays still.",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "Why the boundaries look fractal",
        paragraphs: [
          "Near the border between two colours, a trajectory passes close to a magnet without being caught, gets flung toward another one, and repeats. Each near miss stretches small differences in the starting point, so the closer you look at a boundary, the more thin bands of all three colours appear between the two. That is sensitive dependence on initial conditions, but here it is drawn as a map instead of a single wobbling curve. Note what the map is not: it does not mean the outcome is random. Each pixel is completely deterministic and gives the same answer every time; the trouble is that a slightly different pixel can give a different one.",
        ],
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "Calm it down",
        text: "Raise damping γ to 0.5. The bob loses its energy before it can visit more than one magnet, and the map turns into three large, almost clean wedges with simple borders. Then drop γ to 0.05 and watch the wedges dissolve into bands.",
      },
      {
        title: "Zoom into the centre",
        text: "Set the span to 0.8 and the resolution to 300. Around the centre, between the three magnets, the bands of colour wind into each other much more finely than the default view suggests.",
      },
      {
        title: "Lower the bob",
        text: "Reduce h from 0.18 to 0.08. The pull directly above each magnet becomes much stronger and sharper, near misses fling the bob harder, and the interleaved regions grow. Raising h to 0.5 softens everything again.",
      },
      {
        title: "Magnets too weak to hold",
        text: "Set k to 0.05 and ω² to 2. The spring now beats the magnets, so the bob tends to come to rest near the centre where no magnet can claim it. Capture never registers, the code falls back to the nearest magnet after 3000 steps, and with shading on the map turns dark.",
      },
    ],
  },
  de: {
    metaDescription:
      "Bassin-Karte des magnetischen Pendels: Jedes Pixel ist eine eigene Simulation über drei Magneten. Stärke, Dämpfung und Höhe ändern und fraktale Ränder sehen.",
    heading: "So funktioniert dieser Explorer",
    intro:
      "Stell dir ein Pendel vor, das über einer Platte mit drei Magneten im Dreieck hängt. Du ziehst es an eine Stelle, lässt los, und nach einer Weile kommt es über einem der Magneten zur Ruhe. Die Karte färbt jeden Startpunkt nach dem Magneten, der das Pendel am Ende einfängt: Rosa, Cyan oder Grün. Große ruhige Flächen bedeuten vorhersagbares Verhalten. Wo sich die Farben zu dünnen, ineinander verflochtenen Bändern verweben, entscheidet ein winziger Unterschied beim Loslassen über das Ergebnis. Jedes Pixel ist eine eigene, vollständige Simulation.",
    sections: [
      {
        heading: "Das Modell",
        paragraphs: [
          "Der Explorer drückt das Pendel in die Ebene: p = (x, y) ist die Position des Pendelkörpers von oben gesehen. Drei Kräfte wirken auf ihn. Luftwiderstand γ·ṗ bremst ihn, ein Federterm ω²·p zieht ihn zur Mitte zurück (das übernimmt bei einem echten Pendel mit kleiner Auslenkung die Schwerkraft), und jeder Magnet zieht ihn mit einer Kraft zu sich, die mit dem Abstand abnimmt.",
          "Das Pendel berührt die Platte nicht. Es schwingt in der Höhe h darüber, deshalb ist der Abstand zu einem Magneten √(d² + h²) statt d. So bleibt die Kraft direkt über einem Magneten endlich, und das Modell verhält sich vernünftig. Die Magneten sitzen an den Ecken eines gleichseitigen Dreiecks mit Radius 1 um die Mitte, bei (0, −1) und (±0,866, 0,5).",
        ],
        formula:
          "\\ddot{\\mathbf p} = -\\gamma\\,\\dot{\\mathbf p} - \\omega^2 \\mathbf p - \\sum_{i=1}^{3} \\frac{k\\,(\\mathbf p - \\mathbf m_i)}{\\left(|\\mathbf p - \\mathbf m_i|^2 + h^2\\right)^{3/2}}",
      },
      {
        heading: "Was die Regler bewirken",
        paragraphs: [
          "Die Magnetstärke k (0,05 bis 1,5, Standard 0,4) skaliert den Zug aller drei Magneten. Die Dämpfung γ (0,01 bis 0,6, Standard 0,18) ist die Reibung: Bei kleinen Werten fliegt das Pendel viele Male an den Magneten vorbei, bevor es zur Ruhe kommt, bei großen bleibt es fast dort stehen, wohin es gezielt war. Die Rückstellung ω² (0,05 bis 2, Standard 0,5) ist die Steifigkeit des Zugs zur Mitte. Die Pendelhöhe h (0,05 bis 0,6, Standard 0,18) legt fest, wie dicht das Pendel über die Magneten streicht; kleines h bedeutet scharfe, starke Kräfte direkt über einem Magneten, großes h verschmiert das Feld.",
          "Der Ausschnitt (0,8 bis 4, Standard 2,0) wählt das Quadrat der Startpunkte, von −span bis +span in beide Richtungen; kleinere Werte zoomen also auf die Mitte. Die Auflösung (60 bis 360 Pixel pro Seite, Standard 180) bestimmt, wie viele Startpunkte simuliert werden. Mit eingeschalteter Schattierung wird jedes Pixel nach der Einfangzeit abgedunkelt: hell heißt schnell gefangen, dunkel heißt langer, chaotischer Flug. «Neu berechnen» rechnet die ganze Karte noch einmal; jede Regleränderung tut das ohnehin automatisch.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Jedes Pixel startet das Pendel in Ruhe in der Mitte seiner Zelle und integriert die Gleichung mit dem semi-impliziten Euler-Verfahren bei festem Schritt dt = 0,02: Zuerst wird die Geschwindigkeit aus der Beschleunigung aktualisiert, dann die Position aus der neuen Geschwindigkeit. Diese Reihenfolge kostet kaum mehr als das einfache Euler-Verfahren, verhindert aber, dass Schwingungen aus dem Nichts Energie gewinnen. Das reicht hier, denn am Ende zählt nur, welcher Magnet gewinnt.",
          "Bei jedem achten Schritt prüft der Code, ob das Pendel näher als √0,06 ≈ 0,245 an einem Magneten und langsamer als √0,005 ≈ 0,07 ist. Dann ist dieser Magnet der Gewinner, und die Schrittzahl wird zur Einfangzeit. Vergehen 3000 Schritte ohne Einfang oder laufen die Zahlen aus dem Ruder, nimmt der Code den nächstgelegenen Magneten, und das Pixel bekommt die dunkelste Schattierung.",
          "Bei der Standardauflösung sind das 32.400 Bahnen mit je bis zu 3000 Schritten. Deshalb wird die Karte in Scheiben von sechs Zeilen pro Animationsframe berechnet. Die Fortschrittsanzeige zählt hoch, während sich das Bild von oben nach unten füllt, und der Browser bleibt bedienbar. Die Pixel landen in einem ImageData-Puffer in der gewählten Auflösung, der dann ohne Glättung in das größte zentrierte Quadrat des Canvas hochskaliert wird, damit das Dreieck nie verzerrt ist. Eine laufende Animation gibt es nicht: Sobald die Anzeige «bereit» meldet, steht das Bild still.",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "Warum die Ränder fraktal aussehen",
        paragraphs: [
          "Nahe der Grenze zwischen zwei Farben zieht eine Bahn dicht an einem Magneten vorbei, ohne gefangen zu werden, wird zu einem anderen geschleudert, und das wiederholt sich. Jeder Beinahe-Treffer vergrößert kleine Unterschiede im Startpunkt. Je genauer du auf eine Grenze schaust, desto mehr dünne Bänder aller drei Farben tauchen zwischen den beiden auf. Das ist die empfindliche Abhängigkeit von den Anfangsbedingungen, hier als Karte gezeichnet statt als einzelne zappelnde Kurve. Zufall ist es trotzdem nicht: Jedes Pixel ist vollständig deterministisch und liefert jedes Mal dieselbe Antwort. Das Problem ist nur, dass ein minimal anderes Pixel eine andere liefern kann.",
        ],
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Beruhige das Pendel",
        text: "Erhöhe die Dämpfung γ auf 0,5. Das Pendel verliert seine Energie, bevor es mehr als einen Magneten besuchen kann, und die Karte zerfällt in drei große, fast saubere Keile mit einfachen Grenzen. Senke γ dann auf 0,05 und sieh zu, wie sich die Keile in Bänder auflösen.",
      },
      {
        title: "In die Mitte zoomen",
        text: "Stell den Ausschnitt auf 0,8 und die Auflösung auf 300. Um die Mitte herum, zwischen den drei Magneten, winden sich die Farbbänder viel feiner ineinander, als die Standardansicht vermuten lässt.",
      },
      {
        title: "Das Pendel absenken",
        text: "Verringere h von 0,18 auf 0,08. Der Zug direkt über jedem Magneten wird viel stärker und schärfer, Beinahe-Treffer schleudern das Pendel heftiger, und die verflochtenen Bereiche wachsen. Hebst du h auf 0,5, wird alles wieder weicher.",
      },
      {
        title: "Zu schwache Magneten",
        text: "Stell k auf 0,05 und ω² auf 2. Jetzt ist die Feder stärker als die Magneten, und das Pendel kommt eher in der Mitte zur Ruhe, wo kein Magnet es beanspruchen kann. Ein Einfang wird nie registriert, nach 3000 Schritten greift der Code auf den nächstgelegenen Magneten zurück, und mit Schattierung wird die Karte dunkel.",
      },
    ],
  },
};
