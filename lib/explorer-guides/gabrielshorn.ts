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

// Volume and surface area of the cut horn; the same in every locale.
const HORN_FORMULA =
  "V = \\pi \\int_1^{x_{\\max}} \\frac{dx}{x^2} = \\pi\\Big(1 - \\frac{1}{x_{\\max}}\\Big), \\qquad A = 2\\pi \\int_1^{x_{\\max}} \\frac{1}{x}\\sqrt{1 + \\frac{1}{x^4}}\\, dx \\ \\ge\\ 2\\pi \\ln x_{\\max}";

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
        formula: HORN_FORMULA,
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "View switches between a rotating 3D wireframe and a 2D side view of the profile y = ±1/x. In 3D you can drag to rotate (also by touch); Spin and Hold toggle the slow automatic rotation and Reset returns to the starting angle. The x_max slider sets the cutoff on a logarithmic scale from 1.5 to 1000, starting at 10. Animate growth sweeps x_max from 1.5 to 1000 and then starts over, about eleven seconds per pass.",
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
        formula: HORN_FORMULA,
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
  es: {
    metaDescription:
      "Explora el cuerno de Gabriel: corta y = 1/x hasta 1000, mira cómo el volumen tiende a π mientras el área crece y prueba la paradoja del pintor.",
    heading: "Cómo funciona este explorador",
    intro:
      "La figura del lienzo es lo que se obtiene al hacer girar la curva y = 1/x, para x desde 1 en adelante, alrededor del eje x. Empieza como una boca de radio 1 y se estrecha para siempre sin llegar a cerrarse. El explorador la corta en la longitud que elijas, x_max, y calcula dos números para ese trozo: el volumen interior y el área de la superficie. A medida que llevas x_max más lejos, uno de los números se estabiliza y el otro no deja de crecer. Ese desajuste es todo el enigma del cuerno de Gabriel.",
    sections: [
      {
        heading: "Volumen finito, área infinita",
        paragraphs: [
          "El volumen sale de sumar discos delgados de radio 1/x, cada uno con área π/x². Esa integral es fácil y se mantiene acotada: el trozo hasta x_max contiene π(1 − 1/x_max), así que el cuerno infinito completo contiene exactamente π. El área de la superficie, en cambio, suma bandas delgadas, y cada banda aporta al menos 2π/x por su anchura. La integral de 1/x es el logaritmo, que crece sin límite, de modo que el área del cuerno completo es infinita.",
          "Evangelista Torricelli estudió este sólido en la década de 1640, y en su época causó verdadera inquietud: un cuerpo de extensión infinita con volumen finito parecía contradecir la intuición de que las cosas infinitas tienen que ser infinitamente grandes en todos los sentidos. El nombre de cuerno de Gabriel, por la trompeta del arcángel, llegó más tarde.",
        ],
        formula: HORN_FORMULA,
      },
      {
        heading: "Qué hacen los controles",
        paragraphs: [
          "«Vista» alterna entre una malla de alambre 3D que gira y una vista lateral 2D del perfil y = ±1/x. En 3D puedes arrastrar para girar (también con el dedo); «Gira» y «Fija» activan y desactivan la rotación automática lenta y «Reiniciar» vuelve al ángulo inicial. El deslizador de x_max fija el corte en una escala logarítmica de 1,5 a 1000 y empieza en 10. «Animar crecimiento» recorre x_max de 1,5 a 1000 y luego vuelve a empezar, unos once segundos por pasada.",
          "Los valores en vivo muestran el volumen del trozo cortado, el área de la superficie calculada numéricamente, la cota inferior 2π ln(x_max) y V/π, que te dice lo cerca que está el volumen de su límite. El panel «Paradoja del pintor» añade un grosor de pintura ε de 0,001 a 0,1 (por defecto 0,01) y compara la pintura necesaria para cubrir la superficie, A por ε, con la necesaria para llenar el cuerno.",
        ],
      },
      {
        heading: "Cómo está construido",
        paragraphs: [
          "El volumen tiene una forma cerrada, así que simplemente se evalúa. El área de la superficie no tiene primitiva elemental y se calcula con la regla de Simpson. El integrando directo en x es muy empinado cerca de la boca y muy plano lejos de ella, lo que vuelve imprecisa una malla uniforme en x para cuernos largos. Por eso el código hace el cambio u = ln x, que convierte el integrando en √(1 + e^(−4u)), una función suave entre 1 y √2, y la integra en 2000 pasos iguales. El resultado se mantiene exacto hasta seis cifras significativas en todo el rango.",
          "La vista 3D se dibuja a mano en un lienzo 2D: 29 secciones circulares y 14 líneas a lo largo, rotadas y proyectadas en perspectiva. Para que quepa un cuerno de mil unidades de largo junto a una boca de radio 1, el eje se comprime logarítmicamente, así que la vista 3D muestra la forma pero no sus proporciones reales. La vista 2D usa un eje x lineal y muestra el perfil real, con el interior sombreado como pintura. Con el movimiento reducido activado, el giro automático y el crecimiento quedan desactivados; arrastrar sigue girando el cuerno y lo redibuja con cada movimiento.",
        ],
        code: AREA_EXCERPT,
      },
      {
        heading: "De dónde viene la paradoja",
        paragraphs: [
          "La versión popular dice que puedes llenar el cuerno con π unidades de pintura pero nunca pintar su superficie. El panel muestra por qué esto es menos extraño de lo que parece. La pintura real tiene un grosor ε, así que cubrir un área A requiere aproximadamente A·ε de pintura, y como A crece sin cota, eso acaba superando cualquier cantidad finita. Más allá de x = 1/ε, además, el cuerno es más estrecho que la propia capa de pintura, así que una mano de ese grosor ya no cabe dentro. Llenar el cuerno y pintarlo son preguntas distintas, y solo la versión matemática con grosor cero las hace chocar.",
          "Los números muestran también lo despacio que diverge el área. La diferencia entre A y la cota inferior 2π ln(x_max) se estabiliza en torno a 0,710, así que el área crece exactamente como un logaritmo: hacer el cuerno diez veces más largo añade solo unos 14,5 al área.",
        ],
      },
    ],
    experimentsHeading: "Prueba esto",
    experiments: [
      {
        title: "Mira cómo se estanca el volumen",
        text: "Mueve x_max de 10 a 100 y a 1000 y lee V/π: 0,9; 0,99; 0,999. El cuerno se vuelve cien veces más largo mientras el volumen gana menos de una décima de π.",
      },
      {
        title: "Mira cómo el área sigue creciendo",
        text: "En esos mismos tres puntos el área marca aproximadamente 15,18; 29,65 y 44,11. Cada paso de diez veces añade la misma cantidad, más o menos 2π ln 10 ≈ 14,47, y nada lo detiene nunca.",
      },
      {
        title: "Encuentra el cruce de la pintura",
        text: "Pon ε en 0,1 y sube x_max poco a poco. Cerca de 127, la pintura necesaria para cubrir la superficie supera a la necesaria para llenar el cuerno entero. Con ε = 0,01 el cruce queda mucho más allá del deslizador, pero siempre existe.",
      },
      {
        title: "Compara las dos vistas",
        text: "Pon x_max en 1000 y cambia a 2D. El perfil es una astilla que se pega al eje casi de inmediato. Vuelve a 3D: el eje logarítmico estira la cola estrecha para que aún puedas ver sus anillos.",
      },
    ],
  },
  fr: {
    metaDescription:
      "Explore la trompette de Gabriel : coupe y = 1/x jusqu'à 1 000, vois le volume tendre vers π quand l'aire croît sans fin, et teste le paradoxe du peintre.",
    heading: "Comment fonctionne cet explorateur",
    intro:
      "La forme sur le canevas est ce que l'on obtient en faisant tourner la courbe y = 1/x, pour x à partir de 1, autour de l'axe des x. Elle commence par une embouchure de rayon 1 et se resserre indéfiniment sans jamais se fermer. L'explorateur la coupe à la longueur que tu choisis, x_max, et calcule deux nombres pour ce tronçon : le volume intérieur et l'aire de la surface. Plus tu repousses x_max, plus l'un des nombres se stabilise, tandis que l'autre ne cesse de croître. Ce décalage est toute l'énigme de la trompette de Gabriel.",
    sections: [
      {
        heading: "Volume fini, aire infinie",
        paragraphs: [
          "Le volume s'obtient en additionnant de fins disques de rayon 1/x, chacun d'aire π/x². Cette intégrale est facile et reste bornée : le tronçon jusqu'à x_max contient π(1 − 1/x_max), donc la trompette infinie entière contient exactement π. L'aire de la surface, elle, additionne de fines bandes, et chaque bande apporte au moins 2π/x fois sa largeur. L'intégrale de 1/x est le logarithme, qui croît sans limite : l'aire de la trompette entière est donc infinie.",
          "Evangelista Torricelli a étudié ce solide dans les années 1640, et il a causé à l'époque un réel malaise : un corps d'étendue infinie mais de volume fini semblait contredire l'intuition selon laquelle les choses infinies doivent être infiniment grandes à tous égards. Le nom de trompette de Gabriel, d'après la trompette de l'archange, est venu plus tard.",
        ],
        formula: HORN_FORMULA,
      },
      {
        heading: "À quoi servent les commandes",
        paragraphs: [
          "« Vue » bascule entre un modèle filaire 3D en rotation et une vue de côté 2D du profil y = ±1/x. En 3D, tu peux faire glisser pour tourner (au doigt aussi) ; « Tourne » et « Fige » activent ou coupent la lente rotation automatique et « Réinitialiser » revient à l'angle de départ. Le curseur x_max fixe la coupure sur une échelle logarithmique de 1,5 à 1 000, avec 10 au départ. « Animer la croissance » fait balayer x_max de 1,5 à 1 000 puis recommence, environ onze secondes par passage.",
          "Les valeurs en direct indiquent le volume du tronçon coupé, l'aire de la surface calculée numériquement, le minorant 2π ln(x_max), et V/π, qui te dit à quel point le volume est proche de sa limite. Le panneau « Paradoxe du peintre » ajoute une épaisseur de peinture ε de 0,001 à 0,1 (0,01 par défaut) et compare la peinture nécessaire pour couvrir la surface, A fois ε, à celle qu'il faut pour remplir la trompette.",
        ],
      },
      {
        heading: "Comment c'est construit",
        paragraphs: [
          "Le volume a une forme close, il est donc simplement évalué. L'aire de la surface n'a pas de primitive élémentaire et se calcule par la méthode de Simpson. L'intégrande direct en x est raide près de l'embouchure et très plat au loin, ce qui rend une grille régulière en x imprécise pour les longues trompettes. Le code effectue donc le changement de variable u = ln x, qui transforme l'intégrande en √(1 + e^(−4u)), une fonction lisse comprise entre 1 et √2, et l'intègre sur 2 000 pas égaux. Le résultat reste exact à six chiffres significatifs sur toute la plage.",
          "La vue 3D est dessinée à la main sur un canevas 2D : 29 sections circulaires et 14 lignes dans le sens de la longueur, tournées puis projetées en perspective. Pour faire tenir une trompette longue de mille unités à côté d'une embouchure de rayon 1, l'axe est comprimé de façon logarithmique : la vue 3D montre donc la forme, mais pas ses vraies proportions. La vue 2D utilise un axe des x linéaire et montre le profil réel, l'intérieur étant ombré comme de la peinture. Quand la réduction des animations est activée, la rotation automatique et la croissance sont coupées ; faire glisser continue de tourner la trompette et la redessine à chaque mouvement.",
        ],
        code: AREA_EXCERPT,
      },
      {
        heading: "D'où vient le paradoxe",
        paragraphs: [
          "La version populaire dit que l'on peut remplir la trompette avec π unités de peinture mais jamais peindre sa surface. Le panneau montre pourquoi c'est moins étrange qu'il n'y paraît. La vraie peinture a une épaisseur ε, donc couvrir une aire A demande environ A·ε de peinture, et comme A croît sans borne, cela finit par dépasser toute quantité finie. Au-delà de x = 1/ε, la trompette est en outre plus étroite que la couche de peinture elle-même, si bien qu'une couche de cette épaisseur n'y entre plus. Remplir la trompette et la peindre sont deux questions différentes, et seule la version mathématique à épaisseur nulle les fait se heurter.",
          "Les nombres montrent aussi la lenteur avec laquelle l'aire diverge. L'écart entre A et le minorant 2π ln(x_max) se stabilise vers 0,710, donc l'aire croît exactement comme un logarithme : rendre la trompette dix fois plus longue n'ajoute qu'environ 14,5 à l'aire.",
        ],
      },
    ],
    experimentsHeading: "À essayer",
    experiments: [
      {
        title: "Regarde le volume plafonner",
        text: "Fais passer x_max de 10 à 100 puis à 1 000 et lis V/π : 0,9 ; 0,99 ; 0,999. La trompette devient cent fois plus longue alors que le volume gagne moins d'un dixième de π.",
      },
      {
        title: "Regarde l'aire continuer",
        text: "Aux trois mêmes points, l'aire affiche environ 15,18 ; 29,65 et 44,11. Chaque multiplication par dix ajoute la même quantité, à peu près 2π ln 10 ≈ 14,47, et rien n'arrête jamais cela.",
      },
      {
        title: "Trouve le point de bascule de la peinture",
        text: "Règle ε sur 0,1 et augmente lentement x_max. Vers 127, la peinture nécessaire pour couvrir la surface dépasse celle qu'il faut pour remplir toute la trompette. Avec ε = 0,01, la bascule se situe bien au-delà du curseur, mais elle existe toujours.",
      },
      {
        title: "Compare les deux vues",
        text: "Règle x_max sur 1 000 et passe en 2D. Le profil est un filet qui colle à l'axe presque aussitôt. Reviens en 3D : l'axe logarithmique étire la queue étroite pour que tu puisses encore voir ses anneaux.",
      },
    ],
  },
  it: {
    metaDescription:
      "Esplora il corno di Gabriele: taglia y = 1/x fino a 1000, guarda il volume avvicinarsi a π mentre l'area continua a crescere e prova il paradosso del pittore.",
    heading: "Come funziona questo esploratore",
    intro:
      "La forma sul canvas è ciò che si ottiene facendo ruotare la curva y = 1/x, per x da 1 in poi, attorno all'asse x. Parte come un'imboccatura di raggio 1 e si restringe per sempre senza mai chiudersi. L'esploratore la taglia alla lunghezza che scegli, x_max, e calcola due numeri per quel pezzo: il volume interno e l'area della superficie. Man mano che spingi x_max più lontano, un numero si assesta e l'altro non smette mai di crescere. Questa discrepanza è tutto l'enigma del corno di Gabriele.",
    sections: [
      {
        heading: "Volume finito, area infinita",
        paragraphs: [
          "Il volume si ottiene sommando dischi sottili di raggio 1/x, ciascuno di area π/x². Quell'integrale è facile e resta limitato: il pezzo fino a x_max contiene π(1 − 1/x_max), quindi l'intero corno infinito contiene esattamente π. L'area della superficie somma invece fasce sottili, e ogni fascia contribuisce almeno 2π/x per la sua larghezza. L'integrale di 1/x è il logaritmo, che cresce senza limite, quindi l'area del corno intero è infinita.",
          "Evangelista Torricelli studiò questo solido negli anni Quaranta del Seicento, e all'epoca suscitò un vero disagio: un corpo di estensione infinita con un volume finito sembrava contraddire l'intuizione che le cose infinite debbano essere infinitamente grandi sotto ogni aspetto. Il nome corno di Gabriele, dalla tromba dell'arcangelo, arrivò più tardi.",
        ],
        formula: HORN_FORMULA,
      },
      {
        heading: "Che cosa fanno i controlli",
        paragraphs: [
          "«Vista» passa da un wireframe 3D rotante a una vista laterale 2D del profilo y = ±1/x. In 3D puoi trascinare per ruotare (anche con il tocco); «Ruota» attiva o disattiva la lenta rotazione automatica e «Reimposta» torna all'angolo iniziale. Il cursore x_max imposta il taglio su una scala logaritmica da 1,5 a 1000, partendo da 10. «Anima la crescita» fa scorrere x_max da 1,5 a 1000 e poi ricomincia, circa undici secondi a passata.",
          "I valori dal vivo mostrano il volume del pezzo tagliato, l'area della superficie calcolata numericamente, il limite inferiore 2π ln(x_max) e V/π, che ti dice quanto il volume è vicino al suo limite. Il pannello «Paradosso del pittore» aggiunge uno spessore di vernice ε da 0,001 a 0,1 (predefinito 0,01) e confronta la vernice necessaria per rivestire la superficie, A per ε, con quella necessaria per riempire il corno.",
        ],
      },
      {
        heading: "Com'è costruito",
        paragraphs: [
          "Il volume ha una forma chiusa, quindi viene semplicemente valutato. L'area della superficie non ha una primitiva elementare e viene calcolata con la regola di Simpson. L'integranda diretta in x è ripida vicino all'imboccatura e molto piatta lontano, il che rende imprecisa una griglia uniforme in x per i corni lunghi. Il codice perciò sostituisce u = ln x, che trasforma l'integranda in √(1 + e^(−4u)), una funzione liscia compresa tra 1 e √2, e la integra su 2000 passi uguali. Il risultato resta accurato a sei cifre significative su tutto l'intervallo.",
          "La vista 3D è disegnata a mano su un canvas 2D: 29 sezioni circolari e 14 linee lungo la lunghezza, ruotate e proiettate in prospettiva. Per far stare un corno lungo mille unità accanto a un'imboccatura di raggio 1, l'asse viene compresso logaritmicamente, quindi la vista 3D mostra la forma ma non le sue vere proporzioni. La vista 2D usa un asse x lineare e mostra il profilo reale, con l'interno ombreggiato come vernice. Con il movimento ridotto attivo, la rotazione automatica e la crescita sono disattivate; trascinare continua a ruotare il corno e lo ridisegna a ogni movimento.",
        ],
        code: AREA_EXCERPT,
      },
      {
        heading: "Da dove viene il paradosso",
        paragraphs: [
          "La versione popolare dice che puoi riempire il corno con π unità di vernice ma non riuscirai mai a dipingerne la superficie. Il pannello mostra perché la cosa è meno strana di quanto sembri. La vernice vera ha uno spessore ε, quindi rivestire un'area A richiede circa A·ε di vernice, e poiché A cresce senza limite, prima o poi questo supera qualsiasi quantità finita. Oltre x = 1/ε il corno è inoltre più stretto dello strato di vernice stesso, quindi una mano di quello spessore non ci sta più dentro. Riempire il corno e dipingerlo sono domande diverse, e solo la versione matematica con spessore zero le fa scontrare.",
          "I numeri mostrano anche quanto lentamente diverge l'area. Lo scarto tra A e il limite inferiore 2π ln(x_max) si assesta intorno a 0,710, quindi l'area cresce esattamente come un logaritmo: rendere il corno dieci volte più lungo aggiunge solo circa 14,5 all'area.",
        ],
      },
    ],
    experimentsHeading: "Prova così",
    experiments: [
      {
        title: "Guarda il volume fermarsi",
        text: "Sposta x_max da 10 a 100 a 1000 e leggi V/π: 0,9; 0,99; 0,999. Il corno diventa cento volte più lungo mentre il volume guadagna meno di un decimo di π.",
      },
      {
        title: "Guarda l'area andare avanti",
        text: "Negli stessi tre punti l'area segna circa 15,18; 29,65 e 44,11. Ogni passo di dieci volte aggiunge la stessa quantità, all'incirca 2π ln 10 ≈ 14,47, e nulla lo ferma mai.",
      },
      {
        title: "Trova il sorpasso della vernice",
        text: "Imposta ε a 0,1 e alza lentamente x_max. Intorno a 127 la vernice necessaria per rivestire la superficie supera quella necessaria per riempire l'intero corno. Con ε = 0,01 il sorpasso si trova molto oltre il cursore, ma esiste sempre.",
      },
      {
        title: "Confronta le due viste",
        text: "Imposta x_max a 1000 e passa al 2D. Il profilo è una scheggia che si schiaccia sull'asse quasi subito. Torna al 3D: l'asse logaritmico allunga la coda stretta, così puoi ancora vederne gli anelli.",
      },
    ],
  },
  pt: {
    metaDescription:
      "Explora a trombeta de Gabriel: corta y = 1/x em qualquer comprimento até 1000, vê o volume tender para π enquanto a área cresce e testa o paradoxo do pintor.",
    heading: "Como funciona este explorador",
    intro:
      "A forma no canvas é o que se obtém quando se faz rodar a curva y = 1/x, para x a partir de 1, em torno do eixo x. Começa como uma boca de raio 1 e estreita para sempre sem nunca fechar. O explorador corta-a no comprimento que escolheres, x_max, e calcula dois números para esse pedaço: o volume interior e a área da superfície. À medida que empurras x_max para mais longe, um dos números estabiliza e o outro nunca para de crescer. Esse desencontro é todo o enigma da trombeta de Gabriel.",
    sections: [
      {
        heading: "Volume finito, área infinita",
        paragraphs: [
          "O volume vem de somar discos finos de raio 1/x, cada um com área π/x². Esse integral é fácil e mantém-se limitado: o pedaço até x_max contém π(1 − 1/x_max), pelo que a trombeta infinita inteira contém exatamente π. Já a área da superfície soma faixas finas, e cada faixa contribui com pelo menos 2π/x vezes a sua largura. O integral de 1/x é o logaritmo, que cresce sem limite, pelo que a área da trombeta inteira é infinita.",
          "Evangelista Torricelli estudou este sólido na década de 1640, e na altura causou verdadeiro desconforto: um corpo de extensão infinita com volume finito parecia contradizer a intuição de que as coisas infinitas têm de ser infinitamente grandes em todos os sentidos. O nome trombeta de Gabriel, por causa da trombeta do arcanjo, veio mais tarde.",
        ],
        formula: HORN_FORMULA,
      },
      {
        heading: "O que fazem os controlos",
        paragraphs: [
          "«Vista» alterna entre um modelo de arame 3D a rodar e uma vista lateral 2D do perfil y = ±1/x. Em 3D podes arrastar para rodar (também com o dedo); «Roda» e «Fixa» ligam e desligam a rotação automática lenta e «Repor» volta ao ângulo inicial. O cursor de x_max define o corte numa escala logarítmica de 1,5 a 1000, começando em 10. «Animar crescimento» varre x_max de 1,5 a 1000 e depois recomeça, cerca de onze segundos por passagem.",
          "Os valores ao vivo mostram o volume do pedaço cortado, a área da superfície calculada numericamente, o minorante 2π ln(x_max) e V/π, que te diz quão perto o volume está do seu limite. O painel «Paradoxo do pintor» acrescenta uma espessura de tinta ε de 0,001 a 0,1 (0,01 por omissão) e compara a tinta necessária para cobrir a superfície, A vezes ε, com a tinta necessária para encher a trombeta.",
        ],
      },
      {
        heading: "Como está construído",
        paragraphs: [
          "O volume tem uma forma fechada, por isso é simplesmente avaliado. A área da superfície não tem primitiva elementar e é calculada com a regra de Simpson. A integranda direta em x é íngreme perto da boca e muito plana ao longe, o que torna imprecisa uma grelha uniforme em x para trombetas compridas. Por isso o código faz a substituição u = ln x, que transforma a integranda em √(1 + e^(−4u)), uma função suave entre 1 e √2, e integra-a em 2000 passos iguais. O resultado mantém-se exato até seis algarismos significativos em toda a gama.",
          "A vista 3D é desenhada à mão num canvas 2D: 29 secções circulares e 14 linhas ao longo do comprimento, rodadas e projetadas em perspetiva. Para caber uma trombeta com mil unidades de comprimento ao lado de uma boca de raio 1, o eixo é comprimido logaritmicamente, pelo que a vista 3D mostra a forma mas não as suas proporções verdadeiras. A vista 2D usa um eixo x linear e mostra o perfil real, com o interior sombreado como tinta. Com o movimento reduzido ativado, a rotação automática e o crescimento ficam desligados; arrastar continua a rodar a trombeta e redesenha-a a cada movimento.",
        ],
        code: AREA_EXCERPT,
      },
      {
        heading: "De onde vem o paradoxo",
        paragraphs: [
          "A versão popular diz que podes encher a trombeta com π unidades de tinta mas nunca pintar a sua superfície. O painel mostra porque é que isto é menos estranho do que parece. A tinta verdadeira tem uma espessura ε, por isso cobrir uma área A gasta cerca de A·ε de tinta, e como A cresce sem limite, isso acaba por ultrapassar qualquer quantidade finita. Para lá de x = 1/ε, a trombeta é além disso mais estreita do que a própria camada de tinta, pelo que uma demão com essa espessura já não cabe lá dentro. Encher a trombeta e pintá-la são perguntas diferentes, e só a versão matemática com espessura zero as faz chocar.",
          "Os números mostram também a lentidão com que a área diverge. A diferença entre A e o minorante 2π ln(x_max) estabiliza em cerca de 0,710, pelo que a área cresce exatamente como um logaritmo: tornar a trombeta dez vezes mais comprida acrescenta apenas cerca de 14,5 à área.",
        ],
      },
    ],
    experimentsHeading: "Experimenta isto",
    experiments: [
      {
        title: "Vê o volume estagnar",
        text: "Leva x_max de 10 para 100 e para 1000 e lê V/π: 0,9; 0,99; 0,999. A trombeta fica cem vezes mais comprida enquanto o volume ganha menos de um décimo de π.",
      },
      {
        title: "Vê a área continuar",
        text: "Nos mesmos três pontos a área marca cerca de 15,18; 29,65 e 44,11. Cada passo de dez vezes acrescenta a mesma quantidade, aproximadamente 2π ln 10 ≈ 14,47, e nada trava isso.",
      },
      {
        title: "Encontra o cruzamento da tinta",
        text: "Põe ε em 0,1 e sobe x_max devagar. Algures perto de 127, a tinta necessária para cobrir a superfície ultrapassa a tinta necessária para encher a trombeta inteira. Com ε = 0,01 o cruzamento fica muito para lá do cursor, mas existe sempre.",
      },
      {
        title: "Compara as duas vistas",
        text: "Põe x_max em 1000 e muda para 2D. O perfil é uma lasca que se cola ao eixo quase de imediato. Volta ao 3D: o eixo logarítmico estica a cauda estreita para que ainda consigas ver os seus anéis.",
      },
    ],
  },
  sv: {
    metaDescription:
      "Utforska Gabriels horn: kapa y = 1/x vid valfri längd upp till 1000, se volymen närma sig π medan ytarean fortsätter att växa, och pröva målarens paradox.",
    heading: "Så fungerar den här utforskaren",
    intro:
      "Formen på ytan är det du får när du låter kurvan y = 1/x, för x från 1 och uppåt, rotera kring x-axeln. Den börjar som en mynning med radien 1 och smalnar av i all evighet utan att någonsin sluta sig. Utforskaren kapar den vid en längd som du väljer, x_max, och beräknar två tal för biten: volymen inuti och ytans area. När du skjuter x_max längre ut lägger sig det ena talet till ro medan det andra aldrig slutar växa. Den skillnaden är hela gåtan med Gabriels horn.",
    sections: [
      {
        heading: "Ändlig volym, oändlig area",
        paragraphs: [
          "Volymen får man genom att lägga ihop tunna skivor med radien 1/x, var och en med arean π/x². Den integralen är lätt och förblir begränsad: biten fram till x_max rymmer π(1 − 1/x_max), så hela det oändliga hornet rymmer exakt π. Ytarean lägger i stället ihop tunna band, och varje band bidrar med minst 2π/x gånger sin bredd. Integralen av 1/x är logaritmen, som växer utan gräns, så arean av hela hornet är oändlig.",
          "Evangelista Torricelli studerade den här kroppen på 1640-talet, och den väckte verklig oro på sin tid: en kropp med oändlig utsträckning och ändlig volym tycktes motsäga intuitionen att oändliga ting måste vara oändligt stora i alla avseenden. Namnet Gabriels horn, efter ärkeängelns trumpet, kom senare.",
        ],
        formula: HORN_FORMULA,
      },
      {
        heading: "Vad reglagen gör",
        paragraphs: [
          "”Vy” växlar mellan en roterande 3D-trådmodell och en 2D-sidvy av profilen y = ±1/x. I 3D kan du dra för att rotera (även med fingret). ”Snurrar” slår på eller av den långsamma automatiska rotationen och ”Återställ” går tillbaka till startvinkeln. Reglaget för x_max anger kapningen på en logaritmisk skala från 1,5 till 1000 och börjar på 10. ”Animera tillväxt” sveper x_max från 1,5 till 1000 och börjar sedan om, ungefär elva sekunder per varv.",
          "Livevärdena visar volymen av den kapade biten, den numeriskt beräknade ytarean, den undre gränsen 2π ln(x_max) och V/π, som säger hur nära volymen är sitt gränsvärde. Panelen ”Målarens paradox” lägger till en färgtjocklek ε från 0,001 till 0,1 (standard 0,01) och jämför färgen som behövs för att täcka ytan, A gånger ε, med färgen som behövs för att fylla hornet.",
        ],
      },
      {
        heading: "Hur den är byggd",
        paragraphs: [
          "Volymen har ett slutet uttryck, så den räknas helt enkelt ut. Ytarean saknar elementär primitiv funktion och beräknas med Simpsons regel. Den direkta integranden i x är brant nära mynningen och mycket flack långt ut, vilket gör ett jämnt rutnät i x onoggrant för långa horn. Koden gör därför substitutionen u = ln x, som förvandlar integranden till √(1 + e^(−4u)), en slät funktion mellan 1 och √2, och integrerar den över 2000 lika stora steg. Resultatet håller sex gällande siffror över hela intervallet.",
          "3D-vyn ritas för hand på en 2D-canvas: 29 cirkulära tvärsnitt och 14 linjer längs hornet, roterade och projicerade i perspektiv. För att få plats med ett horn som är tusen enheter långt bredvid en mynning med radien 1 trycks axeln ihop logaritmiskt, så 3D-vyn visar formen men inte dess verkliga proportioner. 2D-vyn använder en linjär x-axel och visar den verkliga profilen, med insidan skuggad som färg. Med minskad rörelse aktiverad är den automatiska rotationen och tillväxten avstängda. Att dra roterar fortfarande hornet och ritar om det vid varje rörelse.",
        ],
        code: AREA_EXCERPT,
      },
      {
        heading: "Var paradoxen kommer ifrån",
        paragraphs: [
          "Den populära versionen säger att du kan fylla hornet med π enheter färg men aldrig måla dess yta. Panelen visar varför det är mindre konstigt än det låter. Verklig färg har en tjocklek ε, så att täcka arean A kräver ungefär A·ε färg, och eftersom A växer obegränsat överstiger det till slut varje ändlig mängd. Bortom x = 1/ε är hornet dessutom smalare än själva färgskiktet, så ett lager med den tjockleken får inte längre plats inuti. Att fylla hornet och att måla det är olika frågor, och det är bara den matematiska versionen med tjockleken noll som får dem att krocka.",
          "Talen visar också hur långsamt arean divergerar. Avståndet mellan A och den undre gränsen 2π ln(x_max) stannar på ungefär 0,710, så arean växer precis som en logaritm: att göra hornet tio gånger längre lägger bara till ungefär 14,5 till arean.",
        ],
      },
    ],
    experimentsHeading: "Prova det här",
    experiments: [
      {
        title: "Se volymen stanna av",
        text: "Flytta x_max från 10 till 100 till 1000 och läs av V/π: 0,9; 0,99; 0,999. Hornet blir hundra gånger längre medan volymen ökar med mindre än en tiondel av π.",
      },
      {
        title: "Se arean fortsätta",
        text: "I samma tre punkter visar arean ungefär 15,18; 29,65 och 44,11. Varje tiofaldigt steg lägger till lika mycket, omkring 2π ln 10 ≈ 14,47, och ingenting stoppar det någonsin.",
      },
      {
        title: "Hitta brytpunkten för målningen",
        text: "Sätt ε till 0,1 och höj x_max långsamt. Någonstans nära 127 går färgen som behövs för att täcka ytan om färgen som behövs för att fylla hela hornet. Med ε = 0,01 ligger brytpunkten långt bortom reglaget, men den finns alltid.",
      },
      {
        title: "Jämför de två vyerna",
        text: "Sätt x_max till 1000 och byt till 2D. Profilen är en flisa som nästan genast smiter tätt intill axeln. Byt tillbaka till 3D: den logaritmiska axeln sträcker ut den smala svansen så att du fortfarande kan se dess ringar.",
      },
    ],
  },
  no: {
    metaDescription:
      "Utforsk Gabriels horn: Kutt y = 1/x ved valgfri lengde opp til 1000, se volumet nærme seg π mens arealet fortsetter å vokse, og test malerens paradoks.",
    heading: "Slik fungerer denne utforskeren",
    intro:
      "Formen på lerretet er det du får når du lar kurven y = 1/x, for x fra 1 og utover, rotere om x-aksen. Den begynner som en munning med radius 1 og smalner i det uendelige uten noen gang å lukke seg. Utforskeren kutter den ved en lengde du velger, x_max, og regner ut to tall for biten: volumet inni og arealet av overflaten. Når du skyver x_max lenger ut, faller det ene tallet til ro, mens det andre aldri slutter å vokse. Det misforholdet er hele gåten med Gabriels horn.",
    sections: [
      {
        heading: "Endelig volum, uendelig areal",
        paragraphs: [
          "Volumet kommer av å legge sammen tynne skiver med radius 1/x, hver med areal π/x². Det integralet er lett og holder seg begrenset: Biten fram til x_max rommer π(1 − 1/x_max), så hele det uendelige hornet rommer nøyaktig π. Overflatearealet legger i stedet sammen tynne bånd, og hvert bånd bidrar med minst 2π/x ganger bredden sin. Integralet av 1/x er logaritmen, som vokser uten grense, så arealet av hele hornet er uendelig.",
          "Evangelisten Torricelli studerte dette legemet på 1640-tallet, og det skapte virkelig uro i samtiden: Et legeme med uendelig utstrekning og endelig volum så ut til å motsi intuisjonen om at uendelige ting må være uendelig store på alle måter. Navnet Gabriels horn, etter erkeengelens trompet, kom senere.",
        ],
        formula: HORN_FORMULA,
      },
      {
        heading: "Hva kontrollene gjør",
        paragraphs: [
          "«Visning» veksler mellom en roterende 3D-trådmodell og en 2D-sidevisning av profilen y = ±1/x. I 3D kan du dra for å rotere (også med fingeren). «Snurrer» slår den langsomme automatiske rotasjonen av eller på, og «Nullstill» går tilbake til startvinkelen. Glidebryteren for x_max setter kuttet på en logaritmisk skala fra 1,5 til 1000 og starter på 10. «Animer vekst» sveiper x_max fra 1,5 til 1000 og begynner så på nytt, omtrent elleve sekunder per runde.",
          "Sanntidsverdiene viser volumet av den kuttede biten, overflatearealet regnet ut numerisk, den nedre grensen 2π ln(x_max) og V/π, som forteller hvor nær volumet er grenseverdien sin. Panelet «Malerens paradoks» legger til en malingstykkelse ε fra 0,001 til 0,1 (standard 0,01) og sammenligner malingen som trengs for å dekke overflaten, A ganger ε, med malingen som trengs for å fylle hornet.",
        ],
      },
      {
        heading: "Slik er den bygget",
        paragraphs: [
          "Volumet har et lukket uttrykk, så det regnes ganske enkelt ut. Overflatearealet har ingen elementær antiderivert og regnes ut med Simpsons regel. Den direkte integranden i x er bratt nær munningen og svært flat langt ute, noe som gjør et jevnt rutenett i x unøyaktig for lange horn. Koden gjør derfor substitusjonen u = ln x, som gjør integranden til √(1 + e^(−4u)), en glatt funksjon mellom 1 og √2, og integrerer den over 2000 like store steg. Resultatet er nøyaktig til seks gjeldende sifre over hele området.",
          "3D-visningen tegnes for hånd på et 2D-lerret: 29 sirkulære tverrsnitt og 14 linjer langs lengden, rotert og projisert i perspektiv. For å få plass til et horn som er tusen enheter langt ved siden av en munning med radius 1, presses aksen sammen logaritmisk, så 3D-visningen viser formen, men ikke de virkelige proporsjonene. 2D-visningen bruker en lineær x-akse og viser den virkelige profilen, med innsiden skyggelagt som maling. Med redusert bevegelse slått på er den automatiske rotasjonen og veksten slått av. Å dra roterer fortsatt hornet og tegner det på nytt for hver bevegelse.",
        ],
        code: AREA_EXCERPT,
      },
      {
        heading: "Hvor paradokset kommer fra",
        paragraphs: [
          "Den populære versjonen sier at du kan fylle hornet med π enheter maling, men aldri male overflaten. Panelet viser hvorfor dette er mindre rart enn det høres ut. Virkelig maling har en tykkelse ε, så å dekke arealet A krever omtrent A·ε maling, og siden A vokser ubegrenset, overstiger det til slutt enhver endelig mengde. Forbi x = 1/ε er hornet dessuten smalere enn selve malingslaget, så et strøk med den tykkelsen får ikke lenger plass inni. Å fylle hornet og å male det er ulike spørsmål, og bare den matematiske versjonen med tykkelse null får dem til å kollidere.",
          "Tallene viser også hvor sakte arealet divergerer. Avstanden mellom A og den nedre grensen 2π ln(x_max) faller til ro på omtrent 0,710, så arealet vokser nøyaktig som en logaritme: Å gjøre hornet ti ganger lengre legger bare rundt 14,5 til arealet.",
        ],
      },
    ],
    experimentsHeading: "Prøv dette",
    experiments: [
      {
        title: "Se volumet stoppe opp",
        text: "Flytt x_max fra 10 til 100 til 1000 og les av V/π: 0,9; 0,99; 0,999. Hornet blir hundre ganger lengre, mens volumet øker med mindre enn en tidel av π.",
      },
      {
        title: "Se arealet fortsette",
        text: "I de samme tre punktene viser arealet omtrent 15,18; 29,65 og 44,11. Hvert tidoblingssteg legger til like mye, rundt 2π ln 10 ≈ 14,47, og ingenting stopper det noen gang.",
      },
      {
        title: "Finn krysningspunktet for malingen",
        text: "Sett ε til 0,1 og øk x_max sakte. Et sted nær 127 går malingen som trengs for å dekke overflaten, forbi malingen som trengs for å fylle hele hornet. Med ε = 0,01 ligger krysningspunktet langt forbi glidebryteren, men det finnes alltid.",
      },
      {
        title: "Sammenlign de to visningene",
        text: "Sett x_max til 1000 og bytt til 2D. Profilen er en flis som nesten med en gang legger seg tett inntil aksen. Bytt tilbake til 3D: Den logaritmiske aksen strekker ut den smale halen, slik at du fortsatt kan se ringene.",
      },
    ],
  },
};
