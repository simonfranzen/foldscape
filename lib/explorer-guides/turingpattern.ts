import type { ExplorerGuide } from "./types";

// Numbers quoted here (200 × 200 grid, D_a = 0.16 and D_b = 0.08, slider
// ranges, the seven presets and their 1500-step ramp, 20 seed blotches of
// radius 3 to 5, the radius-5 centred seed, gain 3.5, 6000 reduced-motion
// steps) match app/[locale]/turingpattern/explorer/page.tsx; update both together.
const EULER_EXCERPT = `// 5-point Laplacian with toroidal wrap, then one explicit Euler step (dt = 1)
const lapA = aCur[row + xL] + aCur[row + xR] + aCur[rowU + x] + aCur[rowD + x] - 4 * aC;
const lapB = bCur[row + xL] + bCur[row + xR] + bCur[rowU + x] + bCur[rowD + x] - 4 * bC;
const abb = aC * bC * bC;
let aN = aC + (p.Da * lapA - abb + F * (1 - aC));
let bN = bC + (p.Db * lapB + abb - (F + k) * bC);
if (aN < 0) aN = 0;
else if (aN > 1) aN = 1;
if (bN < 0) bN = 0;
else if (bN > 1) bN = 1;
aNext[i] = aN;
bNext[i] = bN;`;

export const TURINGPATTERN_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Grow Turing patterns live with the Gray-Scott reaction-diffusion model: tune feed and kill rates to get spots, mazes, worms and dividing cells.",
    heading: "How this explorer works",
    intro:
      "The glowing field is a 200 × 200 grid holding two virtual chemicals. One of them, a, is fed in everywhere. The other, b, consumes a to make more of itself and is slowly removed. Both spread to neighbouring cells, a twice as fast as b. The picture is bright where b is concentrated. From a few random blotches, these simple rules grow spots, stripes, labyrinths or cells that divide, and which of these you get depends mostly on two numbers.",
    sections: [
      {
        heading: "Turing's idea and the Gray-Scott model",
        paragraphs: [
          "In 1952 Alan Turing published «The Chemical Basis of Morphogenesis». His surprising claim was that diffusion, which normally smooths everything out, can create pattern: if two reacting substances spread at different speeds, a perfectly uniform mixture can become unstable and break up into a regular structure. The essential ingredients are a substance that amplifies itself locally and an inhibiting effect that reaches further.",
          "The Gray-Scott model is one of the simplest systems with this behaviour. Its reaction is a + 2b → 3b: wherever b is present it converts a into more b, which is the term ab² below. The feed rate F pulls a back towards 1, as if fresh a were pumped in, and also drains b; the kill rate k removes b on top of that. John Pearson mapped this system in 1993 and found a whole zoo of patterns in a small window of F and k, the zoo the presets come from.",
        ],
        formula:
          "\\frac{\\partial a}{\\partial t} = D_a \\nabla^2 a - a b^2 + F(1-a), \\qquad \\frac{\\partial b}{\\partial t} = D_b \\nabla^2 b + a b^2 - (F+k)\\, b",
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "The seven presets set F and k: Spots (0.025, 0.06), Mitosis (0.0367, 0.0649), Maze (0.029, 0.057), Worms (0.046, 0.065), Holes (0.039, 0.058), Solitons (0.03, 0.062) and Coral (0.0545, 0.0625). A preset does not clear the grid. It glides F and k to the new pair over 1500 simulation steps, because a sudden jump makes dense patterns such as the maze die out everywhere at once. This way the current pattern reorganises itself under the new rules.",
          "The sliders act at once. F runs from 0 to 0.1 and k from 0 to 0.08, both in steps of 0.0005. D_a, the diffusion rate of a, runs from 0.05 to 0.25 (default 0.16), and D_b from 0.02 to 0.12 (default 0.08). «Reset random» clears the grid and drops 20 soft blotches of radius 3 to 5 cells at random places; «Reset centered» drops a single blotch of radius 5 in the middle. The speed slider sets how many simulation steps run per animation frame, from 1 to 20 (default 8), next to a Play/Pause button and four colour maps.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "The state lives in four Float32Arrays: the current and the next values of a and b. Each simulation step reads the current arrays and writes the next ones, then the two pairs swap roles, so no memory is allocated while it runs. The Laplacian, which measures how much a cell differs from its four neighbours, uses the classic five-point stencil, and the grid wraps around at the edges, so the field is really a torus with no borders.",
          "Time advances with explicit Euler steps of size 1, and both concentrations are clamped to the range from 0 to 1. Seeds use soft values (a around 0.5, b around 0.25, with a little noise) rather than hard jumps from 0 to 1, because a sharp edge creates a huge Laplacian that would make the integration blow up within a few steps. They are also small on purpose: a soft disc of radius 6 or more burns out from its middle, and with the Mitosis values it vanishes completely.",
          "To paint a frame, b is multiplied by 3.5, clamped, and looked up in a 256-entry colour table, then written into a 200 × 200 ImageData and scaled up with pixelated rendering. If your system asks for reduced motion, the page computes 6000 steps without drawing them and shows a single still image; pressing a preset or reset button computes a new still.",
        ],
        code: EULER_EXCERPT,
      },
      {
        heading: "Why the diffusion sliders matter",
        paragraphs: [
          "With the default values a spreads twice as fast as b. A growing patch of b uses up a in its surroundings, and because a diffuses quickly, that shortage reaches well beyond the patch itself. New patches cannot form inside the depleted halo, so patches keep a typical distance from each other. This is Turing's local activation and long-range inhibition, and it is why spots end up roughly evenly spaced.",
          "There is also a numerical reason for the range of D_a. For an explicit Euler step on this grid, diffusion alone stays stable only while 4 · D · dt ≤ 1. With dt = 1 that means D ≤ 0.25, which is exactly where the D_a slider ends.",
        ],
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "Watch spots multiply",
        text: "Choose Mitosis and press «Reset random». The blotches break up into spots, and the spots keep stretching and splitting in two. At the default speed there are well over a hundred of them within a minute or so.",
      },
      {
        title: "Morph one pattern into another",
        text: "Start with Spots and let the dots fill the grid. Then click Maze without resetting. Because presets keep the field, you can watch neighbouring dots reach towards each other and fuse into winding corridors. Click Spots again and the corridors break back up into dots.",
      },
      {
        title: "Starve the pattern",
        text: "From the Spots preset, drag k slowly up towards 0.075. The spots shrink and eventually vanish, leaving a dark field: b is now removed faster than the reaction can replace it, and the uniform state without b is the only one left.",
      },
      {
        title: "Break Turing's condition",
        text: "From the Spots preset, lower D_a until it equals D_b at 0.08. Turing's analysis says that without a difference in diffusion speeds the uniform state cannot destabilise on its own, and here the spots indeed fade away. Raise D_a back to 0.16 and press «Reset random» to bring them back.",
      },
    ],
  },
  de: {
    metaDescription:
      "Turing-Muster live wachsen lassen mit dem Gray-Scott-Modell der Reaktion und Diffusion: Zufuhr- und Abbaurate einstellen für Punkte, Labyrinthe und Zellteilung.",
    heading: "So funktioniert dieser Explorer",
    intro:
      "Das leuchtende Feld ist ein Gitter aus 200 × 200 Zellen mit zwei virtuellen Chemikalien. Die eine, a, wird überall nachgefüllt. Die andere, b, verbraucht a, um sich selbst zu vermehren, und wird langsam abgebaut. Beide breiten sich in Nachbarzellen aus, a doppelt so schnell wie b. Hell ist das Bild dort, wo viel b ist. Aus ein paar zufälligen Flecken wachsen mit diesen einfachen Regeln Punkte, Streifen, Labyrinthe oder Zellen, die sich teilen, und was davon entsteht, hängt vor allem von zwei Zahlen ab.",
    sections: [
      {
        heading: "Turings Idee und das Gray-Scott-Modell",
        paragraphs: [
          "1952 veröffentlichte Alan Turing «The Chemical Basis of Morphogenesis». Seine überraschende Behauptung: Diffusion, die normalerweise alles glättet, kann Muster erzeugen. Breiten sich zwei reagierende Stoffe unterschiedlich schnell aus, kann eine vollkommen gleichmäßige Mischung instabil werden und in eine regelmäßige Struktur zerfallen. Die Zutaten sind ein Stoff, der sich lokal selbst verstärkt, und eine hemmende Wirkung, die weiter reicht.",
          "Das Gray-Scott-Modell ist eines der einfachsten Systeme mit diesem Verhalten. Seine Reaktion ist a + 2b → 3b: Wo b vorhanden ist, wandelt es a in weiteres b um, das ist der Term ab² unten. Die Zufuhrrate F zieht a zurück in Richtung 1, als würde frisches a hineingepumpt, und spült zugleich b aus; die Abbaurate k entfernt b zusätzlich. John Pearson kartierte dieses System 1993 und fand in einem kleinen Fenster von F und k einen ganzen Zoo von Mustern, aus dem die Voreinstellungen stammen.",
        ],
        formula:
          "\\frac{\\partial a}{\\partial t} = D_a \\nabla^2 a - a b^2 + F(1-a), \\qquad \\frac{\\partial b}{\\partial t} = D_b \\nabla^2 b + a b^2 - (F+k)\\, b",
      },
      {
        heading: "Was die Regler bewirken",
        paragraphs: [
          "Die sieben Voreinstellungen setzen F und k: Punkte (0,025, 0,06), Mitose (0,0367, 0,0649), Labyrinth (0,029, 0,057), Würmer (0,046, 0,065), Löcher (0,039, 0,058), Solitonen (0,03, 0,062) und Koralle (0,0545, 0,0625). Eine Voreinstellung leert das Gitter nicht. Sie führt F und k über 1500 Simulationsschritte zum neuen Wertepaar, weil ein plötzlicher Sprung dichte Muster wie das Labyrinth überall zugleich absterben lässt. So ordnet sich das aktuelle Muster unter den neuen Regeln um.",
          "Die Regler wirken sofort. F reicht von 0 bis 0,1 und k von 0 bis 0,08, beide in Schritten von 0,0005. D_a, die Diffusionsrate von a, reicht von 0,05 bis 0,25 (voreingestellt 0,16), D_b von 0,02 bis 0,12 (voreingestellt 0,08). «Neustart zufällig» leert das Gitter und setzt 20 weiche Flecken mit 3 bis 5 Zellen Radius an zufällige Stellen; «Neustart mittig» setzt einen einzelnen Fleck mit Radius 5 in die Mitte. Der Geschwindigkeitsregler bestimmt, wie viele Simulationsschritte pro Animationsframe laufen, von 1 bis 20 (voreingestellt 8), daneben gibt es einen Knopf für Start und Pause und vier Farbskalen.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Der Zustand steckt in vier Float32Arrays: den aktuellen und den nächsten Werten von a und b. Jeder Simulationsschritt liest die aktuellen Arrays und schreibt die nächsten, danach tauschen die Paare die Rollen, während des Laufs wird also kein Speicher angelegt. Der Laplace-Operator, der misst, wie stark eine Zelle von ihren vier Nachbarinnen abweicht, nutzt die klassische Fünf-Punkte-Schablone, und das Gitter ist an den Rändern verbunden. Das Feld ist also eigentlich ein Torus ohne Ränder.",
          "Die Zeit schreitet in expliziten Euler-Schritten der Größe 1 voran, und beide Konzentrationen werden auf den Bereich von 0 bis 1 begrenzt. Die Startflecken haben weiche Werte (a um 0,5, b um 0,25, mit etwas Rauschen) statt harter Sprünge von 0 auf 1, weil eine scharfe Kante einen riesigen Laplace-Wert erzeugt, der die Integration binnen weniger Schritte explodieren ließe. Sie sind außerdem absichtlich klein: Eine weiche Scheibe ab Radius 6 brennt von der Mitte her aus, und mit den Werten von Mitose verschwindet sie ganz.",
          "Für jedes Bild wird b mit 3,5 multipliziert, begrenzt und in einer Farbtabelle mit 256 Einträgen nachgeschlagen, dann in ein ImageData mit 200 × 200 Pixeln geschrieben und pixelig hochskaliert. Wünscht dein System reduzierte Bewegung, rechnet die Seite 6000 Schritte, ohne sie zu zeichnen, und zeigt ein einziges Standbild; ein Klick auf eine Voreinstellung oder einen Neustart berechnet ein neues.",
        ],
        code: EULER_EXCERPT,
      },
      {
        heading: "Warum die Diffusionsregler zählen",
        paragraphs: [
          "Mit den Standardwerten breitet sich a doppelt so schnell aus wie b. Ein wachsender Fleck aus b verbraucht a in seiner Umgebung, und weil a schnell diffundiert, reicht dieser Mangel weit über den Fleck hinaus. Im ausgezehrten Hof können keine neuen Flecken entstehen, deshalb halten Flecken einen typischen Abstand zueinander. Das ist Turings lokale Aktivierung mit weitreichender Hemmung, und deshalb liegen Punkte am Ende ungefähr gleichmäßig verteilt.",
          "Für den Bereich von D_a gibt es außerdem einen numerischen Grund. Bei einem expliziten Euler-Schritt auf diesem Gitter bleibt die Diffusion allein nur stabil, solange 4 · D · dt ≤ 1 gilt. Mit dt = 1 heißt das D ≤ 0,25, und genau dort endet der Regler für D_a.",
        ],
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Punkte vermehren sich",
        text: "Wähle Mitose und drück «Neustart zufällig». Die Flecken zerfallen in Punkte, und die Punkte strecken sich und teilen sich immer wieder. Bei der voreingestellten Geschwindigkeit sind es nach etwa einer Minute weit über hundert.",
      },
      {
        title: "Ein Muster ins andere verwandeln",
        text: "Starte mit Punkte und lass die Punkte das Gitter füllen. Klick dann ohne Neustart auf Labyrinth. Weil Voreinstellungen das Feld behalten, siehst du, wie benachbarte Punkte aufeinander zuwachsen und zu gewundenen Gängen verschmelzen. Klick wieder auf Punkte, und die Gänge zerfallen zurück in Punkte.",
      },
      {
        title: "Das Muster aushungern",
        text: "Zieh k ausgehend von der Voreinstellung Punkte langsam in Richtung 0,075. Die Punkte schrumpfen und verschwinden schließlich, zurück bleibt ein dunkles Feld: b wird jetzt schneller entfernt, als die Reaktion es ersetzen kann, und übrig bleibt nur der gleichförmige Zustand ohne b.",
      },
      {
        title: "Turings Bedingung brechen",
        text: "Senke D_a ausgehend von der Voreinstellung Punkte, bis es mit 0,08 gleich D_b ist. Nach Turings Analyse kann der gleichförmige Zustand ohne Unterschied in den Diffusionsgeschwindigkeiten nicht von selbst instabil werden, und tatsächlich verblassen die Punkte hier. Stell D_a zurück auf 0,16 und drück «Neustart zufällig», um sie zurückzuholen.",
      },
    ],
  },
  es: {
    metaDescription:
      "Haz crecer patrones de Turing en vivo con el modelo de reacción-difusión de Gray-Scott: ajusta las tasas F y k y obtén manchas, laberintos y células.",
    heading: "Cómo funciona este explorador",
    intro:
      "El campo luminoso es una cuadrícula de 200 × 200 celdas con dos sustancias químicas virtuales. Una de ellas, a, se repone en todas partes. La otra, b, consume a para producir más de sí misma y se elimina lentamente. Las dos se propagan a las celdas vecinas, a el doble de rápido que b. La imagen brilla donde se concentra b. A partir de unas pocas manchas al azar, estas reglas sencillas hacen crecer puntos, rayas, laberintos o células que se dividen, y cuál de ellos obtienes depende sobre todo de dos números.",
    sections: [
      {
        heading: "La idea de Turing y el modelo de Gray-Scott",
        paragraphs: [
          "En 1952 Alan Turing publicó «The Chemical Basis of Morphogenesis». Su sorprendente afirmación era que la difusión, que normalmente lo alisa todo, puede crear patrones: si dos sustancias que reaccionan se propagan a velocidades distintas, una mezcla perfectamente uniforme puede volverse inestable y romperse en una estructura regular. Los ingredientes esenciales son una sustancia que se amplifica a sí misma localmente y un efecto inhibidor que llega más lejos.",
          "El modelo de Gray-Scott es uno de los sistemas más sencillos con este comportamiento. Su reacción es a + 2b → 3b: allí donde hay b, convierte a en más b, y ese es el término ab² de abajo. La tasa de alimentación F tira de a hacia 1, como si se bombeara a fresco, y además arrastra b hacia fuera; la tasa de eliminación k retira b por añadidura. John Pearson cartografió este sistema en 1993 y encontró todo un zoo de patrones en una pequeña ventana de F y k, el zoo del que proceden los preajustes.",
        ],
        formula:
          "\\frac{\\partial a}{\\partial t} = D_a \\nabla^2 a - a b^2 + F(1-a), \\qquad \\frac{\\partial b}{\\partial t} = D_b \\nabla^2 b + a b^2 - (F+k)\\, b",
      },
      {
        heading: "Qué hacen los controles",
        paragraphs: [
          "Los siete preajustes fijan F y k: «Spots» (0,025; 0,06), «Mitosis» (0,0367; 0,0649), «Maze» (0,029; 0,057), «Worms» (0,046; 0,065), «Holes» (0,039; 0,058), «Solitons» (0,03; 0,062) y «Coral» (0,0545; 0,0625). Un preajuste no borra la cuadrícula. Desliza F y k hacia el nuevo par a lo largo de 1500 pasos de simulación, porque un salto brusco hace que los patrones densos, como el laberinto, mueran en todas partes a la vez. Así el patrón actual se reorganiza bajo las nuevas reglas.",
          "Los deslizadores actúan al instante. F va de 0 a 0,1 y k de 0 a 0,08, ambos en pasos de 0,0005. D_a, la tasa de difusión de a, va de 0,05 a 0,25 (por defecto 0,16), y D_b de 0,02 a 0,12 (por defecto 0,08). «Reset random» borra la cuadrícula y deja caer 20 manchas suaves de entre 3 y 5 celdas de radio en lugares al azar; «Reset centered» deja una sola mancha de radio 5 en el centro. El deslizador de velocidad fija cuántos pasos de simulación se ejecutan por fotograma de animación, de 1 a 20 (por defecto 8), y a su lado hay un botón «Play»/«Pause» y cuatro mapas de color.",
        ],
      },
      {
        heading: "Cómo está construido",
        paragraphs: [
          "El estado vive en cuatro Float32Array: los valores actuales y los siguientes de a y de b. Cada paso de simulación lee los arrays actuales y escribe los siguientes, y después los dos pares intercambian sus papeles, de modo que no se reserva memoria mientras corre. El laplaciano, que mide cuánto difiere una celda de sus cuatro vecinas, usa la clásica plantilla de cinco puntos, y la cuadrícula se enrolla en los bordes, así que el campo es en realidad un toro sin fronteras.",
          "El tiempo avanza con pasos de Euler explícitos de tamaño 1, y ambas concentraciones se recortan al intervalo de 0 a 1. Las semillas usan valores suaves (a en torno a 0,5, b en torno a 0,25, con un poco de ruido) en lugar de saltos bruscos de 0 a 1, porque un borde afilado crea un laplaciano enorme que haría estallar la integración en pocos pasos. Además son pequeñas a propósito: un disco suave de radio 6 o más se consume desde el centro, y con los valores de «Mitosis» desaparece por completo.",
          "Para pintar un fotograma, b se multiplica por 3,5, se recorta y se busca en una tabla de color de 256 entradas; después se escribe en un ImageData de 200 × 200 y se amplía con renderizado pixelado. Si tu sistema pide movimiento reducido, la página calcula 6000 pasos sin dibujarlos y muestra una única imagen fija; al pulsar un preajuste o un botón de reinicio se calcula una nueva.",
        ],
        code: EULER_EXCERPT,
      },
      {
        heading: "Por qué importan los deslizadores de difusión",
        paragraphs: [
          "Con los valores por defecto, a se propaga el doble de rápido que b. Una mancha de b en crecimiento agota a en su entorno, y como a se difunde deprisa, esa escasez llega mucho más allá de la propia mancha. Dentro del halo empobrecido no pueden formarse manchas nuevas, de modo que las manchas mantienen una distancia típica entre sí. Esto es la activación local con inhibición de largo alcance de Turing, y es la razón de que los puntos acaben repartidos de forma más o menos uniforme.",
          "También hay una razón numérica para el rango de D_a. En un paso de Euler explícito sobre esta cuadrícula, la difusión por sí sola solo se mantiene estable mientras 4 · D · dt ≤ 1. Con dt = 1 eso significa D ≤ 0,25, que es exactamente donde termina el deslizador de D_a.",
        ],
      },
    ],
    experimentsHeading: "Prueba esto",
    experiments: [
      {
        title: "Mira cómo se multiplican los puntos",
        text: "Elige «Mitosis» y pulsa «Reset random». Las manchas se rompen en puntos, y los puntos no dejan de estirarse y partirse en dos. A la velocidad por defecto hay bastante más de cien en más o menos un minuto.",
      },
      {
        title: "Transforma un patrón en otro",
        text: "Empieza con «Spots» y deja que los puntos llenen la cuadrícula. Luego haz clic en «Maze» sin reiniciar. Como los preajustes conservan el campo, puedes ver cómo los puntos vecinos se estiran unos hacia otros y se funden en pasillos sinuosos. Vuelve a hacer clic en «Spots» y los pasillos se rompen otra vez en puntos.",
      },
      {
        title: "Deja el patrón sin alimento",
        text: "Desde el preajuste «Spots», arrastra k despacio hacia 0,075. Los puntos encogen y al final desaparecen, y queda un campo oscuro: ahora b se elimina más rápido de lo que la reacción puede reponerlo, y el estado uniforme sin b es el único que queda.",
      },
      {
        title: "Rompe la condición de Turing",
        text: "Desde el preajuste «Spots», baja D_a hasta que iguale a D_b en 0,08. El análisis de Turing dice que, sin una diferencia en las velocidades de difusión, el estado uniforme no puede desestabilizarse por sí solo, y aquí los puntos efectivamente se desvanecen. Sube D_a de nuevo a 0,16 y pulsa «Reset random» para recuperarlos.",
      },
    ],
  },
  fr: {
    metaDescription:
      "Fais pousser des motifs de Turing en direct avec le modèle de réaction-diffusion de Gray-Scott : règle F et k pour obtenir taches, labyrinthes et cellules.",
    heading: "Comment fonctionne cet explorateur",
    intro:
      "Le champ lumineux est une grille de 200 × 200 cellules qui contient deux substances chimiques virtuelles. L'une, a, est apportée partout. L'autre, b, consomme a pour se multiplier et est lentement éliminée. Toutes deux se répandent dans les cellules voisines, a deux fois plus vite que b. L'image est claire là où b est concentrée. À partir de quelques taches aléatoires, ces règles simples font pousser des points, des rayures, des labyrinthes ou des cellules qui se divisent, et ce que tu obtiens dépend surtout de deux nombres.",
    sections: [
      {
        heading: "L'idée de Turing et le modèle de Gray-Scott",
        paragraphs: [
          "En 1952, Alan Turing publie « The Chemical Basis of Morphogenesis ». Son affirmation surprenante : la diffusion, qui d'ordinaire lisse tout, peut créer des motifs. Si deux substances qui réagissent se répandent à des vitesses différentes, un mélange parfaitement uniforme peut devenir instable et se fragmenter en une structure régulière. Les ingrédients essentiels sont une substance qui s'amplifie elle-même localement et un effet inhibiteur qui porte plus loin.",
          "Le modèle de Gray-Scott est l'un des systèmes les plus simples à présenter ce comportement. Sa réaction est a + 2b → 3b : partout où b est présente, elle transforme a en davantage de b, et c'est le terme ab² ci-dessous. Le taux d'alimentation F ramène a vers 1, comme si l'on injectait de la substance a fraîche, et évacue aussi b ; le taux d'élimination k retire b en plus. John Pearson a cartographié ce système en 1993 et a trouvé tout un zoo de motifs dans une petite fenêtre de F et k, le zoo dont proviennent les préréglages.",
        ],
        formula:
          "\\frac{\\partial a}{\\partial t} = D_a \\nabla^2 a - a b^2 + F(1-a), \\qquad \\frac{\\partial b}{\\partial t} = D_b \\nabla^2 b + a b^2 - (F+k)\\, b",
      },
      {
        heading: "À quoi servent les commandes",
        paragraphs: [
          "Les sept préréglages fixent F et k : Spots (0,025 ; 0,06), Mitosis (0,0367 ; 0,0649), Maze (0,029 ; 0,057), Worms (0,046 ; 0,065), Holes (0,039 ; 0,058), Solitons (0,03 ; 0,062) et Coral (0,0545 ; 0,0625). Un préréglage n'efface pas la grille. Il fait glisser F et k vers la nouvelle paire en 1 500 pas de simulation, car un saut brutal fait mourir partout à la fois les motifs denses comme le labyrinthe. Le motif en cours se réorganise ainsi selon les nouvelles règles.",
          "Les curseurs agissent immédiatement. F va de 0 à 0,1 et k de 0 à 0,08, tous deux par pas de 0,0005. D_a, le taux de diffusion de a, va de 0,05 à 0,25 (0,16 par défaut), et D_b de 0,02 à 0,12 (0,08 par défaut). « Reset random » efface la grille et dépose 20 taches douces de 3 à 5 cellules de rayon à des endroits aléatoires ; « Reset centered » dépose une seule tache de rayon 5 au milieu. Le curseur de vitesse fixe le nombre de pas de simulation exécutés par image d'animation, de 1 à 20 (8 par défaut), à côté d'un bouton « Play »/« Pause » et de quatre palettes de couleurs.",
        ],
      },
      {
        heading: "Comment c'est construit",
        paragraphs: [
          "L'état tient dans quatre Float32Array : les valeurs courantes et les valeurs suivantes de a et de b. Chaque pas de simulation lit les tableaux courants et écrit les suivants, puis les deux paires échangent leurs rôles, de sorte qu'aucune mémoire n'est allouée pendant l'exécution. Le laplacien, qui mesure à quel point une cellule diffère de ses quatre voisines, utilise le classique schéma à cinq points, et la grille se referme sur elle-même aux bords : le champ est donc en réalité un tore sans frontières.",
          "Le temps avance par pas d'Euler explicites de taille 1, et les deux concentrations sont bornées à l'intervalle de 0 à 1. Les germes utilisent des valeurs douces (a autour de 0,5, b autour de 0,25, avec un peu de bruit) plutôt que des sauts francs de 0 à 1, car un bord net crée un laplacien énorme qui ferait diverger l'intégration en quelques pas. Ils sont aussi petits à dessein : un disque doux de rayon 6 ou plus se consume par son centre, et avec les valeurs de Mitosis il disparaît complètement.",
          "Pour peindre une image, b est multipliée par 3,5, bornée, puis recherchée dans une table de couleurs de 256 entrées, écrite dans un ImageData de 200 × 200 et agrandie avec un rendu pixellisé. Si ton système demande une réduction des animations, la page calcule 6 000 pas sans les dessiner et affiche une seule image fixe ; un clic sur un préréglage ou sur un bouton de réinitialisation en calcule une nouvelle.",
        ],
        code: EULER_EXCERPT,
      },
      {
        heading: "Pourquoi les curseurs de diffusion comptent",
        paragraphs: [
          "Avec les valeurs par défaut, a se répand deux fois plus vite que b. Une tache de b en croissance épuise a dans son voisinage, et comme a diffuse vite, cette pénurie s'étend bien au-delà de la tache elle-même. De nouvelles taches ne peuvent pas se former dans le halo appauvri, si bien que les taches gardent une distance typique entre elles. C'est l'activation locale et l'inhibition à longue portée de Turing, et c'est pourquoi les points finissent répartis à peu près régulièrement.",
          "Il y a aussi une raison numérique à la plage de D_a. Pour un pas d'Euler explicite sur cette grille, la diffusion seule ne reste stable que tant que 4 · D · dt ≤ 1. Avec dt = 1, cela signifie D ≤ 0,25, et c'est exactement là que s'arrête le curseur de D_a.",
        ],
      },
    ],
    experimentsHeading: "À essayer",
    experiments: [
      {
        title: "Regarde les points se multiplier",
        text: "Choisis Mitosis et appuie sur « Reset random ». Les taches se fragmentent en points, et les points ne cessent de s'étirer et de se scinder en deux. À la vitesse par défaut, il y en a bien plus d'une centaine au bout d'une minute environ.",
      },
      {
        title: "Transforme un motif en un autre",
        text: "Commence par Spots et laisse les points remplir la grille. Clique ensuite sur Maze sans réinitialiser. Comme les préréglages conservent le champ, tu peux voir les points voisins s'étirer les uns vers les autres et fusionner en couloirs sinueux. Clique de nouveau sur Spots et les couloirs se fragmentent à nouveau en points.",
      },
      {
        title: "Affame le motif",
        text: "À partir du préréglage Spots, fais glisser k lentement vers 0,075. Les points rétrécissent et finissent par disparaître, laissant un champ sombre : b est maintenant éliminée plus vite que la réaction ne peut la remplacer, et l'état uniforme sans b est le seul qui reste.",
      },
      {
        title: "Brise la condition de Turing",
        text: "À partir du préréglage Spots, baisse D_a jusqu'à ce qu'il égale D_b à 0,08. L'analyse de Turing dit que, sans différence entre les vitesses de diffusion, l'état uniforme ne peut pas se déstabiliser tout seul, et ici les points s'estompent en effet. Remonte D_a à 0,16 et appuie sur « Reset random » pour les faire revenir.",
      },
    ],
  },
  it: {
    metaDescription:
      "Fai crescere dal vivo i pattern di Turing con il modello di reazione-diffusione di Gray-Scott: regola F e k per ottenere macchie, labirinti e cellule.",
    heading: "Come funziona questo esploratore",
    intro:
      "Il campo luminoso è una griglia di 200 × 200 celle che contiene due sostanze chimiche virtuali. Una, a, viene immessa ovunque. L'altra, b, consuma a per produrre altra b e viene rimossa lentamente. Entrambe si diffondono nelle celle vicine, a due volte più in fretta di b. L'immagine è luminosa dove b è concentrata. Da poche macchie casuali queste semplici regole fanno crescere punti, strisce, labirinti o cellule che si dividono, e quale di questi ottieni dipende soprattutto da due numeri.",
    sections: [
      {
        heading: "L'idea di Turing e il modello di Gray-Scott",
        paragraphs: [
          "Nel 1952 Alan Turing pubblicò «The Chemical Basis of Morphogenesis». La sua tesi sorprendente era che la diffusione, che di norma appiana tutto, può creare strutture: se due sostanze che reagiscono si diffondono a velocità diverse, una miscela perfettamente uniforme può diventare instabile e spezzarsi in una struttura regolare. Gli ingredienti essenziali sono una sostanza che si amplifica da sola localmente e un effetto inibitore che arriva più lontano.",
          "Il modello di Gray-Scott è uno dei sistemi più semplici con questo comportamento. La sua reazione è a + 2b → 3b: dovunque b sia presente, converte a in altra b, ed è il termine ab² qui sotto. Il tasso di alimentazione F riporta a verso 1, come se venisse pompata a fresca, e inoltre porta via b; il tasso di rimozione k elimina b in aggiunta. John Pearson mappò questo sistema nel 1993 e trovò un intero zoo di pattern in una piccola finestra di F e k, lo zoo da cui provengono i preset.",
        ],
        formula:
          "\\frac{\\partial a}{\\partial t} = D_a \\nabla^2 a - a b^2 + F(1-a), \\qquad \\frac{\\partial b}{\\partial t} = D_b \\nabla^2 b + a b^2 - (F+k)\\, b",
      },
      {
        heading: "Che cosa fanno i controlli",
        paragraphs: [
          "I sette preset impostano F e k: «Spots» (0,025; 0,06), «Mitosis» (0,0367; 0,0649), «Maze» (0,029; 0,057), «Worms» (0,046; 0,065), «Holes» (0,039; 0,058), «Solitons» (0,03; 0,062) e «Coral» (0,0545; 0,0625). Un preset non cancella la griglia. Fa scivolare F e k verso la nuova coppia nell'arco di 1500 passi di simulazione, perché un salto improvviso fa morire ovunque nello stesso istante i pattern densi come il labirinto. In questo modo il pattern attuale si riorganizza secondo le nuove regole.",
          "I cursori agiscono subito. F va da 0 a 0,1 e k da 0 a 0,08, entrambi a passi di 0,0005. D_a, il tasso di diffusione di a, va da 0,05 a 0,25 (predefinito 0,16), e D_b da 0,02 a 0,12 (predefinito 0,08). «Reset random» cancella la griglia e lascia cadere 20 macchie morbide con raggio da 3 a 5 celle in punti casuali; «Reset centered» lascia una sola macchia di raggio 5 al centro. Il cursore della velocità stabilisce quanti passi di simulazione vengono eseguiti per fotogramma dell'animazione, da 1 a 20 (predefinito 8), accanto a un pulsante «Play»/«Pause» e a quattro mappe di colore.",
        ],
      },
      {
        heading: "Com'è costruito",
        paragraphs: [
          "Lo stato vive in quattro Float32Array: i valori correnti e quelli successivi di a e di b. Ogni passo di simulazione legge gli array correnti e scrive quelli successivi, poi le due coppie si scambiano i ruoli, così non viene allocata memoria durante l'esecuzione. Il laplaciano, che misura quanto una cella differisce dalle sue quattro vicine, usa il classico stencil a cinque punti, e la griglia si richiude su sé stessa ai bordi, quindi il campo è in realtà un toro senza confini.",
          "Il tempo avanza con passi di Eulero espliciti di ampiezza 1, ed entrambe le concentrazioni vengono limitate all'intervallo da 0 a 1. I semi usano valori morbidi (a intorno a 0,5, b intorno a 0,25, con un po' di rumore) invece di salti netti da 0 a 1, perché un bordo netto crea un laplaciano enorme che farebbe esplodere l'integrazione in pochi passi. Sono anche piccoli di proposito: un disco morbido di raggio 6 o più si esaurisce a partire dal centro, e con i valori di «Mitosis» svanisce del tutto.",
          "Per disegnare un fotogramma, b viene moltiplicata per 3,5, limitata e cercata in una tabella di colori da 256 voci, poi scritta in un ImageData di 200 × 200 e ingrandita con resa a pixel netti. Se il tuo sistema chiede movimento ridotto, la pagina calcola 6000 passi senza disegnarli e mostra una sola immagine fissa; premendo un preset o un pulsante di reset se ne calcola una nuova.",
        ],
        code: EULER_EXCERPT,
      },
      {
        heading: "Perché i cursori di diffusione contano",
        paragraphs: [
          "Con i valori predefiniti a si diffonde due volte più in fretta di b. Una chiazza di b in crescita consuma a nei suoi dintorni, e poiché a si diffonde rapidamente, quella carenza arriva ben oltre la chiazza stessa. Dentro l'alone impoverito non possono formarsi nuove chiazze, perciò le chiazze mantengono una distanza tipica l'una dall'altra. È l'attivazione locale con inibizione a lungo raggio di Turing, ed è il motivo per cui i punti finiscono distribuiti in modo più o meno uniforme.",
          "C'è anche una ragione numerica per l'intervallo di D_a. Per un passo di Eulero esplicito su questa griglia, la sola diffusione resta stabile soltanto finché 4 · D · dt ≤ 1. Con dt = 1 questo significa D ≤ 0,25, che è esattamente il punto in cui finisce il cursore di D_a.",
        ],
      },
    ],
    experimentsHeading: "Prova così",
    experiments: [
      {
        title: "Guarda i punti moltiplicarsi",
        text: "Scegli «Mitosis» e premi «Reset random». Le macchie si spezzano in punti, e i punti continuano ad allungarsi e a dividersi in due. Alla velocità predefinita ce ne sono ben più di cento nel giro di un minuto circa.",
      },
      {
        title: "Trasforma un pattern in un altro",
        text: "Parti da «Spots» e lascia che i punti riempiano la griglia. Poi fai clic su «Maze» senza azzerare la griglia. Poiché i preset conservano il campo, puoi vedere i punti vicini allungarsi l'uno verso l'altro e fondersi in corridoi tortuosi. Fai di nuovo clic su «Spots» e i corridoi tornano a spezzarsi in punti.",
      },
      {
        title: "Affama il pattern",
        text: "Dal preset «Spots», trascina k lentamente verso 0,075. I punti rimpiccioliscono e alla fine svaniscono, lasciando un campo scuro: ora b viene rimossa più in fretta di quanto la reazione riesca a rimpiazzarla, e lo stato uniforme senza b è l'unico rimasto.",
      },
      {
        title: "Rompi la condizione di Turing",
        text: "Dal preset «Spots», abbassa D_a finché non è uguale a D_b, a 0,08. L'analisi di Turing dice che, senza una differenza nelle velocità di diffusione, lo stato uniforme non può destabilizzarsi da solo, e qui i punti in effetti sbiadiscono. Riporta D_a a 0,16 e premi «Reset random» per farli tornare.",
      },
    ],
  },
  pt: {
    metaDescription:
      "Faz crescer padrões de Turing ao vivo com o modelo de reação-difusão de Gray-Scott: ajusta as taxas F e k para obter manchas, labirintos e células.",
    heading: "Como funciona este explorador",
    intro:
      "O campo luminoso é uma grelha de 200 × 200 células com duas substâncias químicas virtuais. Uma delas, a, é reposta em todo o lado. A outra, b, consome a para produzir mais de si própria e é removida lentamente. Ambas se espalham para as células vizinhas, a duas vezes mais depressa do que b. A imagem brilha onde b está concentrada. A partir de algumas manchas aleatórias, estas regras simples fazem crescer pontos, riscas, labirintos ou células que se dividem, e qual deles obténs depende sobretudo de dois números.",
    sections: [
      {
        heading: "A ideia de Turing e o modelo de Gray-Scott",
        paragraphs: [
          "Em 1952 Alan Turing publicou «The Chemical Basis of Morphogenesis». A sua afirmação surpreendente era que a difusão, que normalmente alisa tudo, pode criar padrões: se duas substâncias que reagem se espalharem a velocidades diferentes, uma mistura perfeitamente uniforme pode tornar-se instável e desfazer-se numa estrutura regular. Os ingredientes essenciais são uma substância que se amplifica a si própria localmente e um efeito inibidor que chega mais longe.",
          "O modelo de Gray-Scott é um dos sistemas mais simples com este comportamento. A sua reação é a + 2b → 3b: onde quer que b esteja presente, converte a em mais b, e esse é o termo ab² em baixo. A taxa de alimentação F puxa a de volta para 1, como se fosse bombeada a fresca, e também escoa b; a taxa de remoção k retira b por acréscimo. John Pearson mapeou este sistema em 1993 e encontrou todo um zoo de padrões numa pequena janela de F e k, o zoo de onde vêm as predefinições.",
        ],
        formula:
          "\\frac{\\partial a}{\\partial t} = D_a \\nabla^2 a - a b^2 + F(1-a), \\qquad \\frac{\\partial b}{\\partial t} = D_b \\nabla^2 b + a b^2 - (F+k)\\, b",
      },
      {
        heading: "O que fazem os controlos",
        paragraphs: [
          "As sete predefinições fixam F e k: «Spots» (0,025; 0,06), «Mitosis» (0,0367; 0,0649), «Maze» (0,029; 0,057), «Worms» (0,046; 0,065), «Holes» (0,039; 0,058), «Solitons» (0,03; 0,062) e «Coral» (0,0545; 0,0625). Uma predefinição não limpa a grelha. Faz deslizar F e k até ao novo par ao longo de 1500 passos de simulação, porque um salto súbito faz com que padrões densos, como o labirinto, morram em todo o lado ao mesmo tempo. Assim o padrão atual reorganiza-se segundo as novas regras.",
          "Os cursores atuam de imediato. F vai de 0 a 0,1 e k de 0 a 0,08, ambos em passos de 0,0005. D_a, a taxa de difusão de a, vai de 0,05 a 0,25 (predefinição 0,16), e D_b de 0,02 a 0,12 (predefinição 0,08). «Reset random» limpa a grelha e deixa cair 20 manchas suaves com raio de 3 a 5 células em sítios aleatórios; «Reset centered» deixa uma única mancha de raio 5 no centro. O cursor de velocidade define quantos passos de simulação correm por fotograma de animação, de 1 a 20 (predefinição 8), ao lado de um botão «Play»/«Pause» e de quatro mapas de cores.",
        ],
      },
      {
        heading: "Como está construído",
        paragraphs: [
          "O estado vive em quatro Float32Array: os valores atuais e os seguintes de a e de b. Cada passo de simulação lê os arrays atuais e escreve os seguintes, e depois os dois pares trocam de papel, pelo que não é alocada memória durante a execução. O laplaciano, que mede quanto uma célula difere das suas quatro vizinhas, usa o clássico estêncil de cinco pontos, e a grelha dá a volta nas margens, por isso o campo é na verdade um toro sem fronteiras.",
          "O tempo avança com passos de Euler explícitos de tamanho 1, e ambas as concentrações são limitadas ao intervalo de 0 a 1. As sementes usam valores suaves (a à volta de 0,5, b à volta de 0,25, com um pouco de ruído) em vez de saltos bruscos de 0 para 1, porque um bordo abrupto cria um laplaciano enorme que faria a integração explodir em poucos passos. Também são pequenas de propósito: um disco suave de raio 6 ou mais consome-se a partir do centro, e com os valores de «Mitosis» desaparece por completo.",
          "Para pintar um fotograma, b é multiplicada por 3,5, limitada e procurada numa tabela de cores de 256 entradas, depois escrita num ImageData de 200 × 200 e ampliada com renderização pixelizada. Se o teu sistema pedir movimento reduzido, a página calcula 6000 passos sem os desenhar e mostra uma única imagem fixa; carregar numa predefinição ou num botão de reinício calcula uma nova.",
        ],
        code: EULER_EXCERPT,
      },
      {
        heading: "Porque é que os cursores de difusão importam",
        paragraphs: [
          "Com os valores predefinidos, a espalha-se duas vezes mais depressa do que b. Uma mancha de b em crescimento esgota a à sua volta, e como a se difunde depressa, essa escassez chega muito além da própria mancha. Dentro do halo empobrecido não se podem formar manchas novas, por isso as manchas mantêm uma distância típica entre si. É a ativação local com inibição de longo alcance de Turing, e é por isso que os pontos acabam distribuídos de forma mais ou menos uniforme.",
          "Há também uma razão numérica para o intervalo de D_a. Num passo de Euler explícito nesta grelha, a difusão por si só só se mantém estável enquanto 4 · D · dt ≤ 1. Com dt = 1 isso significa D ≤ 0,25, que é exatamente onde termina o cursor de D_a.",
        ],
      },
    ],
    experimentsHeading: "Experimenta isto",
    experiments: [
      {
        title: "Vê os pontos multiplicarem-se",
        text: "Escolhe «Mitosis» e carrega em «Reset random». As manchas desfazem-se em pontos, e os pontos não param de se esticar e de se dividir em dois. À velocidade predefinida há bem mais de cem ao fim de cerca de um minuto.",
      },
      {
        title: "Transforma um padrão noutro",
        text: "Começa com «Spots» e deixa os pontos encherem a grelha. Depois clica em «Maze» sem reiniciar. Como as predefinições mantêm o campo, podes ver os pontos vizinhos esticarem-se uns para os outros e fundirem-se em corredores sinuosos. Clica outra vez em «Spots» e os corredores voltam a desfazer-se em pontos.",
      },
      {
        title: "Deixa o padrão à fome",
        text: "A partir da predefinição «Spots», arrasta k devagar em direção a 0,075. Os pontos encolhem e acabam por desaparecer, deixando um campo escuro: agora b é removida mais depressa do que a reação a consegue repor, e o estado uniforme sem b é o único que resta.",
      },
      {
        title: "Quebra a condição de Turing",
        text: "A partir da predefinição «Spots», baixa D_a até igualar D_b em 0,08. A análise de Turing diz que, sem uma diferença nas velocidades de difusão, o estado uniforme não se pode desestabilizar sozinho, e aqui os pontos de facto desvanecem-se. Volta a subir D_a para 0,16 e carrega em «Reset random» para os trazer de volta.",
      },
    ],
  },
  sv: {
    metaDescription:
      "Låt Turingmönster växa fram live med Gray-Scott-modellen för reaktion och diffusion: justera F och k och få prickar, labyrinter och celler som delar sig.",
    heading: "Så fungerar den här utforskaren",
    intro:
      "Det lysande fältet är ett rutnät på 200 × 200 celler med två virtuella kemikalier. Den ena, a, fylls på överallt. Den andra, b, förbrukar a för att göra mer av sig själv och avlägsnas långsamt. Båda sprider sig till grannceller, a dubbelt så fort som b. Bilden är ljus där b är koncentrerad. Ur några slumpmässiga fläckar får de här enkla reglerna prickar, ränder, labyrinter eller celler som delar sig att växa fram, och vilket av dem du får beror mest på två tal.",
    sections: [
      {
        heading: "Turings idé och Gray-Scott-modellen",
        paragraphs: [
          "År 1952 publicerade Alan Turing ”The Chemical Basis of Morphogenesis”. Hans överraskande påstående var att diffusion, som normalt jämnar ut allt, kan skapa mönster: om två reagerande ämnen sprider sig olika fort kan en helt jämn blandning bli instabil och brytas upp i en regelbunden struktur. De väsentliga ingredienserna är ett ämne som förstärker sig självt lokalt och en hämmande verkan som når längre.",
          "Gray-Scott-modellen är ett av de enklaste systemen med det här beteendet. Dess reaktion är a + 2b → 3b: överallt där b finns omvandlar det a till mer b, vilket är termen ab² nedan. Matningstakten F drar a tillbaka mot 1, som om färskt a pumpades in, och spolar också bort b; dödningstakten k avlägsnar b därutöver. John Pearson kartlade systemet 1993 och fann ett helt zoo av mönster i ett litet fönster av F och k, det zoo som förvalen kommer från.",
        ],
        formula:
          "\\frac{\\partial a}{\\partial t} = D_a \\nabla^2 a - a b^2 + F(1-a), \\qquad \\frac{\\partial b}{\\partial t} = D_b \\nabla^2 b + a b^2 - (F+k)\\, b",
      },
      {
        heading: "Vad reglagen gör",
        paragraphs: [
          "De sju förvalen ställer in F och k: ”Spots” (0,025; 0,06), ”Mitosis” (0,0367; 0,0649), ”Maze” (0,029; 0,057), ”Worms” (0,046; 0,065), ”Holes” (0,039; 0,058), ”Solitons” (0,03; 0,062) och ”Coral” (0,0545; 0,0625). Ett förval tömmer inte rutnätet. Det låter F och k glida till det nya paret under 1500 simuleringssteg, eftersom ett plötsligt hopp får täta mönster som labyrinten att dö ut överallt på en gång. På så vis organiserar det nuvarande mönstret om sig enligt de nya reglerna.",
          "Reglagen verkar direkt. F går från 0 till 0,1 och k från 0 till 0,08, båda i steg om 0,0005. D_a, diffusionshastigheten för a, går från 0,05 till 0,25 (standard 0,16), och D_b från 0,02 till 0,12 (standard 0,08). ”Reset random” tömmer rutnätet och släpper ned 20 mjuka fläckar med 3 till 5 cellers radie på slumpmässiga platser; ”Reset centered” släpper ned en enda fläck med radie 5 i mitten. Hastighetsreglaget bestämmer hur många simuleringssteg som körs per animationsbildruta, från 1 till 20 (standard 8), och bredvid finns en knapp ”Play”/”Pause” och fyra färgkartor.",
        ],
      },
      {
        heading: "Hur den är byggd",
        paragraphs: [
          "Tillståndet ligger i fyra Float32Array: de nuvarande och de nästa värdena för a och b. Varje simuleringssteg läser de nuvarande arrayerna och skriver de nästa, sedan byter de två paren roller, så inget minne allokeras under körningen. Laplaceoperatorn, som mäter hur mycket en cell skiljer sig från sina fyra grannar, använder den klassiska fempunktsstencilen, och rutnätet går runt vid kanterna, så fältet är egentligen en torus utan gränser.",
          "Tiden går framåt med explicita Eulersteg av storlek 1, och båda koncentrationerna begränsas till intervallet från 0 till 1. Fröna använder mjuka värden (a kring 0,5 och b kring 0,25, med lite brus) i stället för hårda hopp från 0 till 1, eftersom en skarp kant skapar ett enormt Laplacevärde som skulle få integrationen att explodera inom några få steg. De är också små med flit: en mjuk skiva med radie 6 eller mer brinner ut från mitten, och med värdena för ”Mitosis” försvinner den helt.",
          "För att måla en bildruta multipliceras b med 3,5, begränsas och slås upp i en färgtabell med 256 poster, skrivs sedan till ett ImageData på 200 × 200 och skalas upp med pixlad rendering. Om ditt system ber om minskad rörelse räknar sidan 6000 steg utan att rita dem och visar en enda stillbild; ett tryck på ett förval eller en återställningsknapp räknar fram en ny.",
        ],
        code: EULER_EXCERPT,
      },
      {
        heading: "Varför diffusionsreglagen spelar roll",
        paragraphs: [
          "Med standardvärdena sprider sig a dubbelt så fort som b. En växande fläck av b förbrukar a i sin omgivning, och eftersom a diffunderar snabbt når den bristen långt utanför själva fläcken. Nya fläckar kan inte bildas inne i den utarmade zonen, så fläckarna håller ett typiskt avstånd till varandra. Det här är Turings lokala aktivering och långväga hämning, och det är därför prickarna till slut hamnar ungefär jämnt utspridda.",
          "Det finns också ett numeriskt skäl till intervallet för D_a. För ett explicit Eulersteg på det här rutnätet förblir diffusionen ensam stabil bara så länge 4 · D · dt ≤ 1. Med dt = 1 betyder det D ≤ 0,25, och det är precis där reglaget för D_a slutar.",
        ],
      },
    ],
    experimentsHeading: "Prova det här",
    experiments: [
      {
        title: "Se prickar föröka sig",
        text: "Välj ”Mitosis” och tryck på ”Reset random”. Fläckarna bryts upp i prickar, och prickarna fortsätter att sträcka ut sig och dela sig i två. Med standardhastigheten finns det gott och väl över hundra av dem inom någon minut.",
      },
      {
        title: "Förvandla ett mönster till ett annat",
        text: "Börja med ”Spots” och låt prickarna fylla rutnätet. Klicka sedan på ”Maze” utan att återställa. Eftersom förvalen behåller fältet kan du se hur intilliggande prickar sträcker sig mot varandra och smälter samman till slingrande gångar. Klicka på ”Spots” igen, så bryts gångarna upp i prickar på nytt.",
      },
      {
        title: "Svält ut mönstret",
        text: "Utgå från förvalet ”Spots” och dra k långsamt upp mot 0,075. Prickarna krymper och försvinner till slut, och kvar blir ett mörkt fält: b avlägsnas nu snabbare än reaktionen hinner ersätta det, och det jämna tillståndet utan b är det enda som återstår.",
      },
      {
        title: "Bryt Turings villkor",
        text: "Utgå från förvalet ”Spots” och sänk D_a tills det är lika med D_b på 0,08. Turings analys säger att det jämna tillståndet inte kan destabiliseras av sig självt utan en skillnad i diffusionshastighet, och här bleknar prickarna mycket riktigt bort. Höj D_a tillbaka till 0,16 och tryck på ”Reset random” för att få dem tillbaka.",
      },
    ],
  },
  no: {
    metaDescription:
      "La Turing-mønstre vokse fram direkte med Gray-Scott-modellen for reaksjon og diffusjon: Juster F og k og få prikker, labyrinter og celler som deler seg.",
    heading: "Slik fungerer denne utforskeren",
    intro:
      "Det lysende feltet er et rutenett på 200 × 200 celler med to virtuelle kjemikalier. Det ene, a, fylles på overalt. Det andre, b, forbruker a for å lage mer av seg selv og fjernes langsomt. Begge sprer seg til nabocellene, a dobbelt så fort som b. Bildet er lyst der b er konsentrert. Fra noen få tilfeldige flekker får disse enkle reglene prikker, striper, labyrinter eller celler som deler seg, til å vokse fram, og hvilket av dem du får, avhenger mest av to tall.",
    sections: [
      {
        heading: "Turings idé og Gray-Scott-modellen",
        paragraphs: [
          "I 1952 publiserte Alan Turing «The Chemical Basis of Morphogenesis». Den overraskende påstanden hans var at diffusjon, som vanligvis jevner ut alt, kan skape mønstre: Hvis to reagerende stoffer sprer seg med ulik fart, kan en helt jevn blanding bli ustabil og brytes opp i en regelmessig struktur. De vesentlige ingrediensene er et stoff som forsterker seg selv lokalt, og en hemmende virkning som rekker lenger.",
          "Gray-Scott-modellen er et av de enkleste systemene med denne oppførselen. Reaksjonen er a + 2b → 3b: Overalt der b finnes, omdanner det a til mer b, og det er leddet ab² nedenfor. Tilførselsraten F trekker a tilbake mot 1, som om fersk a ble pumpet inn, og skyller også ut b; fjerningsraten k fjerner b i tillegg. John Pearson kartla dette systemet i 1993 og fant en hel dyrehage av mønstre i et lite vindu av F og k, dyrehagen som forhåndsvalgene kommer fra.",
        ],
        formula:
          "\\frac{\\partial a}{\\partial t} = D_a \\nabla^2 a - a b^2 + F(1-a), \\qquad \\frac{\\partial b}{\\partial t} = D_b \\nabla^2 b + a b^2 - (F+k)\\, b",
      },
      {
        heading: "Hva kontrollene gjør",
        paragraphs: [
          "De sju forhåndsvalgene setter F og k: «Spots» (0,025; 0,06), «Mitosis» (0,0367; 0,0649), «Maze» (0,029; 0,057), «Worms» (0,046; 0,065), «Holes» (0,039; 0,058), «Solitons» (0,03; 0,062) og «Coral» (0,0545; 0,0625). Et forhåndsvalg tømmer ikke rutenettet. Det lar F og k gli til det nye paret over 1500 simuleringssteg, fordi et brått hopp får tette mønstre som labyrinten til å dø ut overalt på én gang. Slik omorganiserer det nåværende mønsteret seg under de nye reglene.",
          "Glidebryterne virker med en gang. F går fra 0 til 0,1 og k fra 0 til 0,08, begge i steg på 0,0005. D_a, diffusjonsraten til a, går fra 0,05 til 0,25 (standard 0,16), og D_b fra 0,02 til 0,12 (standard 0,08). «Reset random» tømmer rutenettet og slipper ned 20 myke flekker med radius på 3 til 5 celler på tilfeldige steder; «Reset centered» slipper ned én enkelt flekk med radius 5 i midten. Glidebryteren for fart bestemmer hvor mange simuleringssteg som kjøres per animasjonsbilde, fra 1 til 20 (standard 8), og ved siden av finnes en knapp «Play»/«Pause» og fire fargekart.",
        ],
      },
      {
        heading: "Slik er den bygget",
        paragraphs: [
          "Tilstanden ligger i fire Float32Array: de nåværende og de neste verdiene for a og b. Hvert simuleringssteg leser de nåværende arrayene og skriver de neste, og så bytter de to parene roller, slik at det ikke allokeres minne mens den kjører. Laplace-operatoren, som måler hvor mye en celle avviker fra de fire naboene sine, bruker den klassiske fempunktssjablongen, og rutenettet går rundt i kantene, så feltet er egentlig en torus uten grenser.",
          "Tiden går framover med eksplisitte Euler-steg av størrelse 1, og begge konsentrasjonene begrenses til området fra 0 til 1. Frøene bruker myke verdier (a rundt 0,5, b rundt 0,25, med litt støy) i stedet for harde hopp fra 0 til 1, fordi en skarp kant gir en enorm Laplace-verdi som ville fått integrasjonen til å eksplodere i løpet av noen få steg. De er også små med vilje: En myk skive med radius 6 eller mer brenner ut fra midten, og med verdiene for «Mitosis» forsvinner den helt.",
          "For å male et bilde blir b multiplisert med 3,5, begrenset og slått opp i en fargetabell med 256 oppføringer, deretter skrevet til et ImageData på 200 × 200 og skalert opp med pikselert gjengivelse. Hvis systemet ditt ber om redusert bevegelse, regner siden ut 6000 steg uten å tegne dem og viser ett enkelt stillbilde; et trykk på et forhåndsvalg eller en tilbakestillingsknapp regner ut et nytt.",
        ],
        code: EULER_EXCERPT,
      },
      {
        heading: "Hvorfor glidebryterne for diffusjon betyr noe",
        paragraphs: [
          "Med standardverdiene sprer a seg dobbelt så fort som b. En voksende flekk av b bruker opp a i omgivelsene, og fordi a diffunderer raskt, rekker den mangelen langt utenfor selve flekken. Nye flekker kan ikke dannes inne i den utarmede sonen, så flekkene holder en typisk avstand til hverandre. Dette er Turings lokale aktivering og langtrekkende hemming, og det er derfor prikkene ender opp omtrent jevnt fordelt.",
          "Det finnes også en numerisk grunn til området for D_a. For et eksplisitt Euler-steg på dette rutenettet holder diffusjonen alene seg stabil bare så lenge 4 · D · dt ≤ 1. Med dt = 1 betyr det D ≤ 0,25, og det er nøyaktig der glidebryteren for D_a slutter.",
        ],
      },
    ],
    experimentsHeading: "Prøv dette",
    experiments: [
      {
        title: "Se prikker formere seg",
        text: "Velg «Mitosis» og trykk på «Reset random». Flekkene brytes opp i prikker, og prikkene fortsetter å strekke seg og dele seg i to. Med standardfarten er det godt over hundre av dem i løpet av et minutts tid.",
      },
      {
        title: "Gjør ett mønster om til et annet",
        text: "Start med «Spots» og la prikkene fylle rutenettet. Klikk så på «Maze» uten å tilbakestille. Fordi forhåndsvalgene beholder feltet, kan du se naboprikker strekke seg mot hverandre og smelte sammen til buktende ganger. Klikk på «Spots» igjen, og gangene brytes opp i prikker på nytt.",
      },
      {
        title: "Sult ut mønsteret",
        text: "Start fra forhåndsvalget «Spots» og dra k langsomt opp mot 0,075. Prikkene krymper og forsvinner til slutt, og tilbake blir et mørkt felt: b fjernes nå raskere enn reaksjonen klarer å erstatte det, og den jevne tilstanden uten b er den eneste som er igjen.",
      },
      {
        title: "Bryt Turings betingelse",
        text: "Start fra forhåndsvalget «Spots» og senk D_a til den er lik D_b på 0,08. Turings analyse sier at den jevne tilstanden ikke kan destabiliseres av seg selv uten en forskjell i diffusjonsfart, og her blekner prikkene ganske riktig bort. Sett D_a tilbake til 0,16 og trykk på «Reset random» for å få dem tilbake.",
      },
    ],
  },
};
