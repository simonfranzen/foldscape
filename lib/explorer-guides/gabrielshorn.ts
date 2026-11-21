import type { ExplorerGuide } from "./types";

// Numbers quoted here (x_max from 1.5 to 1000, default 10, ε from 0.001 to
// 0.1, A − 2π ln x_max → 0.710, the paint crossover near x_max ≈ 127 at
// ε = 0.1, Simpson with N = 2000) were computed with the same code as
// app/gabrielshorn/explorer/page.tsx; update both together.
const AREA_EXCERPT = `// A = 2π ∫₁^{xMax} (1/x) · √(1 + 1/x⁴) dx. Substituting u = ln x gives
// A = 2π ∫₀^{ln xMax} √(1 + e^{-4u}) du, smooth and bounded in u.
function surfaceArea(xMax: number, N = 2000): number {
  if (xMax <= X_MIN) return 0;
  const a = 0;
  const b = Math.log(xMax);
  const n = N % 2 === 0 ? N : N + 1;
  const h = (b - a) / n;
  const f = (u: number) => Math.sqrt(1 + Math.exp(-4 * u));
  let sum = f(a) + f(b);
  for (let i = 1; i < n; i++) {
    sum += (i % 2 === 0 ? 2 : 4) * f(a + i * h);
  }
  return 2 * Math.PI * (h / 3) * sum;  // Simpson's rule
}`;

export const GABRIELS_HORN_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Explore Gabriel's horn: cut y = 1/x at any length up to 1000, watch the volume approach π while the surface area keeps growing, and test the painter's paradox.",
    heading: "How this explorer works",
    intro:
      "The shape on the canvas is what you get when you spin the curve y = 1/x, for x from 1 onwards, around the x axis. It starts as a mouth of radius 1 and narrows forever without ever closing. The explorer cuts it off at a length you choose, x_max, and computes two numbers for the piece: the volume inside and the area of the surface. As you push x_max further out, one number settles down and the other never stops growing. That mismatch is the whole puzzle of Gabriel's horn.",
    sections: [
      {
        heading: "Finite volume, infinite area",
        paragraphs: [
          "The volume comes from adding up thin discs of radius 1/x, each with area π/x². That integral is easy and stays bounded: the piece up to x_max holds π(1 − 1/x_max), so the full infinite horn holds exactly π. The surface area adds up thin bands instead, and each band contributes at least 2π/x times its width. The integral of 1/x is the logarithm, which grows without limit, so the area of the full horn is infinite.",
          "Evangelista Torricelli studied this solid in the 1640s, and it caused real unease at the time: a body of infinite extent with a finite volume seemed to contradict the intuition that infinite things must be infinitely large in every sense. The name Gabriel's horn, after the archangel's trumpet, came later.",
        ],
        formula:
          "V = \\pi \\int_1^{x_{\\max}} \\frac{dx}{x^2} = \\pi\\Big(1 - \\frac{1}{x_{\\max}}\\Big), \\qquad A = 2\\pi \\int_1^{x_{\\max}} \\frac{1}{x}\\sqrt{1 + \\frac{1}{x^4}}\\, dx \\ \\ge\\ 2\\pi \\ln x_{\\max}",
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "View switches between a rotating 3D wireframe and a 2D side view of the profile y = ±1/x. In 3D you can drag to rotate (also by touch); Spin toggles the slow automatic rotation and Reset returns to the starting angle. The x_max slider sets the cutoff on a logarithmic scale from 1.5 to 1000, starting at 10. Animate growth sweeps x_max from 1.5 to 1000 and then starts over, about eleven seconds per pass.",
          "The live values show the volume of the cut piece, the surface area computed numerically, the lower bound 2π ln(x_max), and V/π, which tells you how close the volume is to its limit. The painter's paradox panel adds a paint thickness ε from 0.001 to 0.1 (default 0.01) and compares the paint needed to coat the surface, A times ε, with the paint needed to fill the horn.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "The volume has a closed form, so it is simply evaluated. The surface area has no elementary antiderivative and is computed with Simpson's rule. The direct integrand in x is steep near the mouth and very flat far out, which makes an even grid in x inaccurate for long horns. The code therefore substitutes u = ln x, which turns the integrand into √(1 + e^(−4u)), a smooth function between 1 and √2, and integrates that on 2000 equal steps. The result stays accurate to six significant digits across the whole range.",
          "The 3D view is drawn by hand on a 2D canvas: 29 circular cross sections and 14 lines along the length, rotated and projected in perspective. To fit a horn a thousand units long next to a mouth of radius 1, the axis is compressed logarithmically, so the 3D view shows the shape but not its true proportions. The 2D view uses a linear x axis and shows the real profile, with the interior shaded as paint. With reduced motion enabled, automatic spin and growth are switched off; dragging still rotates the horn and redraws it on each move.",
        ],
        code: AREA_EXCERPT,
      },
      {
        heading: "Where the paradox comes from",
        paragraphs: [
          "The popular version says you can fill the horn with π units of paint but never paint its surface. The panel shows why this is less strange than it sounds. Real paint has a thickness ε, so coating area A takes about A·ε of paint, and since A grows without bound, that eventually exceeds any finite amount. Beyond x = 1/ε the horn is also narrower than the paint layer itself, so a coat of that thickness no longer fits inside it. Filling the horn and painting it are different questions, and only the mathematical version with zero thickness makes them clash.",
          "The numbers also show how slowly the area diverges. The gap between A and the lower bound 2π ln(x_max) settles at about 0.710, so the area grows exactly like a logarithm: making the horn ten times longer adds only about 14.5 to the area.",
        ],
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "Watch the volume stall",
        text: "Move x_max from 10 to 100 to 1000 and read V/π: 0.9, 0.99, 0.999. The horn becomes a hundred times longer while the volume gains less than a tenth of π.",
      },
      {
        title: "Watch the area keep going",
        text: "At the same three points the area reads about 15.18, 29.65 and 44.11. Each tenfold step adds the same amount, roughly 2π ln 10 ≈ 14.47, and nothing ever stops that.",
      },
      {
        title: "Find the painting crossover",
        text: "Set ε to 0.1 and slowly raise x_max. Somewhere near 127 the paint needed to coat the surface overtakes the paint needed to fill the whole horn. With ε = 0.01 the crossover lies far beyond the slider, but it always exists.",
      },
      {
        title: "Compare the two views",
        text: "Set x_max to 1000 and switch to 2D. The profile is a sliver that hugs the axis almost immediately. Switch back to 3D: the logarithmic axis stretches the narrow tail so you can still see its rings.",
      },
    ],
  },
  de: {
    metaDescription:
      "Gabriels Horn erkunden: die Fläche y = 1/x bei beliebiger Länge bis 1000 abschneiden, das Volumen gegen π streben und die Oberfläche weiter wachsen sehen.",
    heading: "So funktioniert dieser Explorer",
    intro:
      "Die Form auf dem Canvas entsteht, wenn man die Kurve y = 1/x ab x = 1 um die x-Achse rotieren lässt. Sie beginnt mit einer Öffnung vom Radius 1 und verengt sich endlos, ohne sich je zu schließen. Der Explorer schneidet sie bei einer Länge x_max ab, die du wählst, und berechnet für das Stück zwei Zahlen: das Volumen innen und den Inhalt der Oberfläche. Schiebst du x_max weiter hinaus, kommt die eine Zahl zur Ruhe, die andere wächst immer weiter. Dieses Missverhältnis ist das ganze Rätsel von Gabriels Horn.",
    sections: [
      {
        heading: "Endliches Volumen, unendliche Oberfläche",
        paragraphs: [
          "Das Volumen ergibt sich aus dünnen Scheiben mit Radius 1/x, jede mit der Fläche π/x². Dieses Integral ist leicht und bleibt beschränkt: Das Stück bis x_max fasst π(1 − 1/x_max), das ganze unendliche Horn also genau π. Für die Oberfläche addiert man stattdessen dünne Ringbänder, und jedes trägt mindestens 2π/x mal seine Breite bei. Das Integral von 1/x ist der Logarithmus, der unbegrenzt wächst, deshalb ist die Oberfläche des ganzen Horns unendlich.",
          "Evangelista Torricelli untersuchte diesen Körper in den 1640er-Jahren, und er sorgte damals für echtes Unbehagen: Ein unendlich ausgedehnter Körper mit endlichem Volumen schien der Vorstellung zu widersprechen, dass Unendliches in jedem Sinn unendlich groß sein muss. Der Name Gabriels Horn, nach der Posaune des Erzengels, kam erst später auf.",
        ],
        formula:
          "V = \\pi \\int_1^{x_{\\max}} \\frac{dx}{x^2} = \\pi\\Big(1 - \\frac{1}{x_{\\max}}\\Big), \\qquad A = 2\\pi \\int_1^{x_{\\max}} \\frac{1}{x}\\sqrt{1 + \\frac{1}{x^4}}\\, dx \\ \\ge\\ 2\\pi \\ln x_{\\max}",
      },
      {
        heading: "Was die Regler bewirken",
        paragraphs: [
          "«Ansicht» wechselt zwischen einem rotierenden 3D-Drahtgitter und einer 2D-Seitenansicht des Profils y = ±1/x. In 3D kannst du das Horn per Ziehen drehen, auch per Touch. «Dreht» und «Hält» schalten die langsame automatische Rotation ein und aus, «Zurücksetzen» stellt den Startwinkel wieder her. Der Regler für x_max legt den Schnitt auf einer logarithmischen Skala von 1,5 bis 1000 fest, Startwert ist 10. «Wachstum animieren» lässt x_max von 1,5 bis 1000 laufen und dann von vorn beginnen, etwa elf Sekunden pro Durchlauf.",
          "Die Live-Werte zeigen das Volumen des abgeschnittenen Stücks, die numerisch berechnete Oberfläche, die untere Schranke 2π ln(x_max) und V/π, also wie nah das Volumen seinem Grenzwert ist. Das Feld zum Malerparadoxon ergänzt eine Farbschichtdicke ε von 0,001 bis 0,1 (Standard 0,01) und vergleicht die Farbe, die zum Anstreichen der Oberfläche nötig ist, also A mal ε, mit der Farbe zum Füllen des Horns.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Das Volumen hat eine geschlossene Form und wird einfach ausgewertet. Die Oberfläche hat keine elementare Stammfunktion und wird mit der Simpsonregel berechnet. Der Integrand in x ist nahe der Öffnung steil und weit draußen sehr flach, ein gleichmäßiges Gitter in x wird bei langen Hörnern deshalb ungenau. Der Code substituiert daher u = ln x. Daraus wird der Integrand √(1 + e^(−4u)), eine glatte Funktion zwischen 1 und √2, die auf 2000 gleich großen Schritten integriert wird. Das Ergebnis bleibt im ganzen Bereich auf sechs signifikante Stellen genau.",
          "Die 3D-Ansicht wird von Hand auf ein 2D-Canvas gezeichnet: 29 kreisförmige Querschnitte und 14 Linien in Längsrichtung, gedreht und perspektivisch projiziert. Damit ein tausend Einheiten langes Horn neben eine Öffnung mit Radius 1 passt, ist die Achse logarithmisch gestaucht. Die 3D-Ansicht zeigt also die Form, aber nicht die echten Proportionen. Die 2D-Ansicht nutzt eine lineare x-Achse und zeigt das wahre Profil, das Innere ist als Farbe schattiert. Ist reduzierte Bewegung eingestellt, sind automatische Drehung und Wachstum abgeschaltet. Ziehen dreht das Horn trotzdem und zeichnet es bei jeder Bewegung neu.",
        ],
        code: AREA_EXCERPT,
      },
      {
        heading: "Woher das Paradoxon kommt",
        paragraphs: [
          "Die bekannte Fassung lautet: Man kann das Horn mit π Einheiten Farbe füllen, aber nie seine Oberfläche streichen. Das Feld zeigt, warum das weniger seltsam ist, als es klingt. Echte Farbe hat eine Dicke ε, das Anstreichen der Fläche A braucht also etwa A·ε Farbe, und weil A unbegrenzt wächst, übersteigt das irgendwann jede endliche Menge. Jenseits von x = 1/ε ist das Horn außerdem enger als die Farbschicht selbst, eine Schicht dieser Dicke passt dort gar nicht mehr hinein. Füllen und Anstreichen sind verschiedene Fragen, und nur die mathematische Version mit Dicke null lässt sie kollidieren.",
          "Die Zahlen zeigen auch, wie langsam die Oberfläche divergiert. Der Abstand zwischen A und der unteren Schranke 2π ln(x_max) pendelt sich bei etwa 0,710 ein, die Fläche wächst also genau wie ein Logarithmus: Zehnmal so lang heißt nur etwa 14,5 mehr Fläche.",
        ],
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Das Volumen bleibt stehen",
        text: "Schieb x_max von 10 auf 100 und auf 1000 und lies V/π ab: 0,9, dann 0,99, dann 0,999. Das Horn wird hundertmal länger, das Volumen wächst um weniger als ein Zehntel von π.",
      },
      {
        title: "Die Fläche wächst weiter",
        text: "An denselben drei Stellen zeigt die Fläche etwa 15,18, 29,65 und 44,11. Jeder Zehnerschritt fügt denselben Betrag hinzu, ungefähr 2π ln 10 ≈ 14,47, und nichts hält das je auf.",
      },
      {
        title: "Den Kipppunkt beim Streichen finden",
        text: "Stell ε auf 0,1 und erhöhe x_max langsam. Irgendwo bei 127 überholt die Farbe zum Anstreichen der Oberfläche die Farbe zum Füllen des ganzen Horns. Bei ε = 0,01 liegt der Kipppunkt weit jenseits des Reglers, aber es gibt ihn immer.",
      },
      {
        title: "Die beiden Ansichten vergleichen",
        text: "Stell x_max auf 1000 und wechsle zu 2D. Das Profil ist ein Strich, der sich fast sofort an die Achse schmiegt. Zurück in 3D streckt die logarithmische Achse das dünne Ende, sodass du seine Ringe noch sehen kannst.",
      },
    ],
  },
};
