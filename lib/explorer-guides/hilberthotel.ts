import type { ExplorerGuide } from "./types";

// Numbers quoted here (64 visible rooms in rows of 8, k from 1 to 10 with
// default 3, speed 1 to 40 with default 6, the primes 3 to 23 for buses 1 to
// 8, step totals 65 / 64 + k / 96 / 76) match
// app/hilberthotel/explorer/page.tsx; update both together.
const STEP_EXCERPT = `// Step s of the "infinitely many new guests" scenario.
if (s <= VISIBLE_ROOMS) {
  // Work from the top room down, so nobody lands on an occupied room.
  const fromRoom = VISIBLE_ROOMS - s + 1;
  const toRoom = 2 * fromRoom;
  setGuests((gs) =>
    gs.map((g) =>
      g.origin === "existing" && g.room === fromRoom ? { ...g, room: toRoom } : g,
    ),
  );
} else {
  const placeIdx = s - VISIBLE_ROOMS;   // 1, 2, 3, ...
  const targetRoom = 2 * placeIdx - 1;  // 1, 3, 5, ...
  setGuests((gs) => [...gs, { ...queue[0], room: targetRoom }]);
  setQueue((q) => q.slice(1));
}`;

// Display formulas are shared by every locale, so they live here once.
const ROOM_MAP_FORMULA =
  "n \\mapsto 2^n, \\qquad (k, m) \\mapsto p_k^{\\,m}, \\quad p_1 = 3,\\ p_2 = 5,\\ p_3 = 7,\\ \\dots";

export const HILBERTHOTEL_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Check guests into Hilbert's Hotel step by step: one guest, k guests, infinitely many, then infinitely many buses placed in rooms by prime powers.",
    heading: "How this explorer works",
    intro:
      "The grid shows the first 64 rooms of a hotel with infinitely many rooms, numbered 1, 2, 3 and so on forever. The dashed cells at the end stand for everything beyond room 64. At the start every room is taken: each soft white dot is a guest. New arrivals wait in the lobby strip below, and the hotel must fit them all in without evicting anyone. Every press of Step moves exactly one guest.",
    sections: [
      {
        heading: "A full hotel that still has room",
        paragraphs: [
          "David Hilbert sketched this hotel in a 1924 lecture to show how strange infinite sets are. In a finite hotel, full means full. In an infinite one, you can ask every guest to move from room n to room n + 1 at the same moment. Nobody is evicted, because every n has a successor, and room 1 is suddenly empty. The same idea with n → n + k frees k rooms.",
          "The trick behind all four scenarios is a function from room numbers to room numbers that is one-to-one (no two guests are sent to the same room) but not onto (some rooms are left over). A finite set can never be mapped one-to-one into a proper part of itself; an infinite set always can.",
          "The bigger scenarios need bigger tricks. For a countably infinite crowd of new guests (ℵ₀, aleph-null, the size of the natural numbers) every current guest moves from n to 2n. All even rooms are taken, all odd rooms are free, and new guest number i takes room 2i − 1. For infinitely many buses, each with infinitely many passengers, the hotel uses prime numbers: current guest n moves to 2ⁿ, and passenger m of bus k goes to pₖᵐ, where pₖ is the k-th odd prime.",
        ],
        formula: ROOM_MAP_FORMULA,
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "The four scenario buttons choose the arrivals: one new guest, k new guests, ℵ₀ new guests, or ℵ₀ buses with ℵ₀ guests each. The badge above the grid shows the rule in force. In the k scenario a slider appears that sets k from 1 to 10 (default 3).",
          "Step performs one move, Play repeats it automatically, Pause stops, Reset starts the scenario over. The speed slider sets 1 to 40 steps per second, starting at 6. The progress bar counts the moves, for example 65 for one guest (64 shifts, then one check-in). Amber outlines mark the room a guest is leaving and the one they move into, cyan marks a new guest checking in, rose marks a bus passenger. The counter at the right of the lobby strip says how many guests are now in rooms beyond 64.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "Every guest is a small object with an origin (existing, new or bus), an index and a current room; room 0 means still waiting in the lobby. The grid is ordinary HTML: 64 square cells in rows of 8, plus six dashed cells for the infinite tail, each drawing up to four coloured dots for its occupants. There is no canvas and no continuous animation, only a short colour transition when a room is highlighted, so nothing needs to be frozen for reduced motion.",
          "One detail matters for correctness. The shifts run from the highest visible room downwards. If guest 1 moved first, they would land in room 2 while its occupant was still there. Starting at room 64 means every target room has already been vacated by the time someone arrives. In the mathematical hotel everyone moves at once, so the order only matters for the animation.",
          "For the buses the page shows buses 1 to 8 with the primes 3, 5, 7, 11, 13, 17, 19 and 23, and queues only the passengers whose room pₖᵐ is at most 64. That gives 12 visible bus passengers, for example rooms 3, 9 and 27 for bus 1.",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "Why the primes never collide",
        paragraphs: [
          "Every whole number greater than 1 has exactly one factorisation into primes. A power of 2 has only the factor 2, and a power of an odd prime has only that prime, so 2ⁿ, 3ᵐ, 5ᵐ and so on can never coincide. It is also wasteful: rooms like 6, 10, 12 or 15 have two different prime factors and stay empty forever. The hotel ends up with infinitely many free rooms even after absorbing infinitely many infinite buses. What it can never absorb is a crowd as large as the real numbers. That is Cantor's diagonal argument, told on the story page.",
        ],
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "Follow the top guest out of view",
        text: "Choose «1 new guest» and press Step once. The guest in room 64 moves to room 65, off the grid, and the lobby counter reports one guest beyond room 64. That guest did not vanish: in the infinite hotel there is always a next room.",
      },
      {
        title: "Free ten rooms at once",
        text: "Pick «k new guests», drag k to 10 and press Play at around 20 steps per second. Each guest jumps ten rooms ahead, and at the end rooms 1 to 10 fill with cyan dots while 10 original guests now live beyond room 64.",
      },
      {
        title: "Watch the odd rooms open",
        text: "Select «ℵ₀ new guests» and play at speed 6. The doublings empty every odd room on the grid, and 32 original guests leave the visible area. Then the cyan arrivals fill rooms 1, 3, 5 up to 63, one after the other.",
      },
      {
        title: "Count the empty rooms after the buses",
        text: "Run the bus scenario to the end (76 steps). Only 18 of the 64 visible rooms are occupied: the powers of 2 up to 64 and the 12 prime-power rooms. Rooms such as 6, 15 or 21 stay empty, even though everyone has a bed.",
      },
    ],
  },
  de: {
    metaDescription:
      "Gäste in Hilberts Hotel Schritt für Schritt einchecken: ein Gast, k Gäste, unendlich viele, dann unendlich viele Busse, verteilt über Primzahlpotenzen.",
    heading: "So funktioniert dieser Explorer",
    intro:
      "Das Raster zeigt die ersten 64 Zimmer eines Hotels mit unendlich vielen Zimmern, nummeriert 1, 2, 3 und so weiter ohne Ende. Die gestrichelten Felder am Schluss stehen für alles jenseits von Zimmer 64. Zu Beginn ist jedes Zimmer belegt, jeder weißliche Punkt ist ein Gast. Neue Gäste warten im Lobby-Streifen darunter, und das Hotel muss alle unterbringen, ohne jemanden hinauszuwerfen. Jeder Druck auf Schritt bewegt genau einen Gast.",
    sections: [
      {
        heading: "Ein volles Hotel mit freien Zimmern",
        paragraphs: [
          "David Hilbert skizzierte dieses Hotel 1924 in einer Vorlesung, um zu zeigen, wie seltsam unendliche Mengen sind. In einem endlichen Hotel heißt voll eben voll. In einem unendlichen kannst du alle Gäste bitten, gleichzeitig von Zimmer n nach Zimmer n + 1 zu ziehen. Niemand fliegt raus, denn jedes n hat einen Nachfolger, und Zimmer 1 ist plötzlich frei. Mit n → n + k werden auf dieselbe Weise k Zimmer frei.",
          "Hinter allen vier Szenarien steckt eine Abbildung von Zimmernummern auf Zimmernummern, die injektiv ist (keine zwei Gäste landen im selben Zimmer), aber nicht surjektiv (es bleiben Zimmer übrig). Eine endliche Menge lässt sich nie injektiv in einen echten Teil von sich selbst abbilden, eine unendliche immer.",
          "Die größeren Szenarien brauchen größere Tricks. Für abzählbar unendlich viele neue Gäste (ℵ₀, Aleph null, die Größe der natürlichen Zahlen) zieht jeder bisherige Gast von n nach 2n. Alle geraden Zimmer sind belegt, alle ungeraden frei, und der neue Gast Nummer i bekommt Zimmer 2i − 1. Für unendlich viele Busse mit jeweils unendlich vielen Fahrgästen nimmt das Hotel Primzahlen: Der bisherige Gast n zieht nach 2ⁿ, und Fahrgast m aus Bus k bekommt pₖᵐ, wobei pₖ die k-te ungerade Primzahl ist.",
        ],
        formula: ROOM_MAP_FORMULA,
      },
      {
        heading: "Was die Bedienelemente tun",
        paragraphs: [
          "Die vier Szenario-Knöpfe legen fest, wer ankommt: ein neuer Gast, k neue Gäste, ℵ₀ neue Gäste oder ℵ₀ Busse mit je ℵ₀ Gästen. Das Abzeichen über dem Raster zeigt die gerade gültige Regel. Im k-Szenario erscheint ein Regler, der k von 1 bis 10 einstellt (Startwert 3).",
          "Schritt führt einen Umzug aus, Start wiederholt das automatisch, Pause hält an, Zurück startet das Szenario neu. Der Tempo-Regler erlaubt 1 bis 40 Schritte pro Sekunde, Startwert 6. Der Fortschrittsbalken zählt die Umzüge, etwa 65 für einen Gast (64 Verschiebungen, dann ein Check-in). Bernsteinfarbene Rahmen markieren das Zimmer, das ein Gast verlässt, und das, in das er zieht. Cyan zeigt einen neuen Gast beim Einchecken, Rosa einen Busgast. Rechts im Lobby-Streifen steht, wie viele Gäste inzwischen jenseits von Zimmer 64 wohnen.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Jeder Gast ist ein kleines Objekt mit Herkunft (bisheriger Gast, neu oder Bus), einem Index und einem aktuellen Zimmer. Zimmer 0 bedeutet: wartet noch in der Lobby. Das Raster ist gewöhnliches HTML, 64 quadratische Felder in Reihen zu 8 plus sechs gestrichelte Felder für den unendlichen Rest. Jedes Feld zeichnet bis zu vier farbige Punkte für seine Gäste. Es gibt kein Canvas und keine Daueranimation, nur einen kurzen Farbübergang, wenn ein Zimmer hervorgehoben wird. Für reduzierte Bewegung muss daher nichts eingefroren werden.",
          "Ein Detail ist für die Korrektheit wichtig. Die Verschiebungen laufen vom höchsten sichtbaren Zimmer abwärts. Zöge Gast 1 zuerst um, landete er in Zimmer 2, während dessen Gast noch dort ist. Beginnt man bei Zimmer 64, ist jedes Zielzimmer schon geräumt, wenn jemand ankommt. Im mathematischen Hotel ziehen alle gleichzeitig um, die Reihenfolge zählt also nur für die Animation.",
          "Bei den Bussen zeigt die Seite die Busse 1 bis 8 mit den Primzahlen 3, 5, 7, 11, 13, 17, 19 und 23 und reiht nur die Fahrgäste ein, deren Zimmer pₖᵐ höchstens 64 ist. Das ergibt 12 sichtbare Busgäste, etwa die Zimmer 3, 9 und 27 für Bus 1.",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "Warum die Primzahlen nie kollidieren",
        paragraphs: [
          "Jede ganze Zahl größer als 1 lässt sich auf genau eine Weise in Primfaktoren zerlegen. Eine Zweierpotenz hat nur den Faktor 2, eine Potenz einer ungeraden Primzahl nur diese Primzahl. Deshalb können 2ⁿ, 3ᵐ, 5ᵐ und so weiter nie zusammenfallen. Das Verfahren ist verschwenderisch: Zimmer wie 6, 10, 12 oder 15 haben zwei verschiedene Primfaktoren und bleiben für immer leer. Das Hotel hat also selbst nach unendlich vielen unendlichen Bussen noch unendlich viele freie Zimmer. Was es nie aufnehmen kann, ist eine Menge so groß wie die reellen Zahlen. Das ist Cantors Diagonalargument, erzählt auf der Themenseite.",
        ],
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Dem obersten Gast aus dem Bild folgen",
        text: "Wähl «1 neuer Gast» und drück einmal auf Schritt. Der Gast aus Zimmer 64 zieht in Zimmer 65, aus dem Raster hinaus, und die Lobby meldet einen Gast jenseits von Zimmer 64. Verschwunden ist er nicht: Im unendlichen Hotel gibt es immer ein nächstes Zimmer.",
      },
      {
        title: "Zehn Zimmer auf einmal frei machen",
        text: "Nimm «k neue Gäste», zieh k auf 10 und drück bei etwa 20 Schritten pro Sekunde auf Start. Jeder Gast springt zehn Zimmer weiter. Am Ende füllen sich die Zimmer 1 bis 10 mit cyanfarbenen Punkten, und 10 bisherige Gäste wohnen jetzt jenseits von Zimmer 64.",
      },
      {
        title: "Den ungeraden Zimmern beim Freiwerden zusehen",
        text: "Wähl «ℵ₀ neue Gäste» und drück bei Tempo 6 auf Start. Die Verdopplungen räumen jedes ungerade Zimmer im Raster, und 32 bisherige Gäste verlassen den sichtbaren Bereich. Danach füllen die neuen Gäste nacheinander die Zimmer 1, 3, 5 bis 63.",
      },
      {
        title: "Nach den Bussen die leeren Zimmer zählen",
        text: "Lass das Bus-Szenario bis zum Ende laufen (76 Schritte). Nur 18 der 64 sichtbaren Zimmer sind belegt: die Zweierpotenzen bis 64 und die 12 Primzahlpotenz-Zimmer. Zimmer wie 6, 15 oder 21 bleiben leer, obwohl alle ein Bett haben.",
      },
    ],
  },
  es: {
    metaDescription:
      "Aloja huéspedes en el hotel de Hilbert paso a paso: uno, k, infinitos, y luego infinitos autocares repartidos por habitaciones con potencias de primos.",
    heading: "Cómo funciona este explorador",
    intro:
      "La cuadrícula muestra las primeras 64 habitaciones de un hotel con infinitas habitaciones, numeradas 1, 2, 3 y así para siempre. Las celdas discontinuas del final representan todo lo que hay más allá de la habitación 64. Al principio todas las habitaciones están ocupadas: cada punto blanco suave es un huésped. Quienes llegan esperan en la franja del vestíbulo, abajo, y el hotel tiene que acomodar a todo el mundo sin echar a nadie. Cada pulsación de «Paso» mueve exactamente a un huésped.",
    sections: [
      {
        heading: "Un hotel lleno que aún tiene sitio",
        paragraphs: [
          "David Hilbert esbozó este hotel en una conferencia de 1924 para mostrar lo extraños que son los conjuntos infinitos. En un hotel finito, lleno quiere decir lleno. En uno infinito puedes pedir a cada huésped que pase de la habitación n a la habitación n + 1 en el mismo instante. Nadie se queda fuera, porque todo n tiene un sucesor, y la habitación 1 queda de pronto vacía. La misma idea con n → n + k libera k habitaciones.",
          "El truco que hay detrás de los cuatro escenarios es una función de números de habitación en números de habitación que es inyectiva (no se envía a dos huéspedes a la misma habitación) pero no sobreyectiva (sobran habitaciones). Un conjunto finito nunca puede aplicarse de forma inyectiva en una parte propia de sí mismo; un conjunto infinito siempre puede.",
          "Los escenarios mayores piden trucos mayores. Para una multitud infinita numerable de huéspedes nuevos (ℵ₀, álef cero, el tamaño de los números naturales), cada huésped actual pasa de n a 2n. Todas las habitaciones pares quedan ocupadas, todas las impares quedan libres, y el huésped nuevo número i ocupa la habitación 2i − 1. Para infinitos autocares, cada uno con infinitos pasajeros, el hotel recurre a los números primos: el huésped actual n pasa a 2ⁿ, y el pasajero m del autocar k va a pₖᵐ, donde pₖ es el k-ésimo primo impar.",
        ],
        formula: ROOM_MAP_FORMULA,
      },
      {
        heading: "Qué hacen los controles",
        paragraphs: [
          "Los cuatro botones de escenario eligen quién llega: un huésped nuevo, k huéspedes nuevos, ℵ₀ huéspedes nuevos, o ℵ₀ autocares con ℵ₀ huéspedes cada uno. La etiqueta sobre la cuadrícula muestra la regla vigente. En el escenario k aparece un deslizador que fija k entre 1 y 10 (3 por defecto).",
          "«Paso» realiza un movimiento, «Reproducir» lo repite automáticamente, «Pausa» lo detiene y «Reiniciar» empieza el escenario de nuevo. El deslizador de velocidad fija de 1 a 40 pasos por segundo y empieza en 6. La barra de progreso cuenta los movimientos, por ejemplo 65 para un huésped (64 desplazamientos y luego un registro de entrada). Los contornos ámbar marcan la habitación que un huésped abandona y aquella a la que se muda, el cian marca a un huésped nuevo que se registra y el rosa a un pasajero de autocar. El contador a la derecha de la franja del vestíbulo dice cuántos huéspedes están ya en habitaciones más allá de la 64.",
        ],
      },
      {
        heading: "Cómo está construido",
        paragraphs: [
          "Cada huésped es un pequeño objeto con un origen (existente, nuevo o de autocar), un índice y una habitación actual; la habitación 0 significa que sigue esperando en el vestíbulo. La cuadrícula es HTML corriente: 64 celdas cuadradas en filas de 8, más seis celdas discontinuas para la cola infinita, y cada una dibuja hasta cuatro puntos de color para sus ocupantes. No hay lienzo ni animación continua, solo una breve transición de color cuando se resalta una habitación, así que no hace falta congelar nada para el movimiento reducido.",
          "Hay un detalle que importa para que todo sea correcto. Los desplazamientos van de la habitación visible más alta hacia abajo. Si el huésped 1 se moviera primero, aterrizaría en la habitación 2 mientras su ocupante sigue allí. Empezar por la habitación 64 garantiza que cada habitación de destino ya ha quedado libre cuando llega alguien. En el hotel matemático todo el mundo se mueve a la vez, de modo que el orden solo importa para la animación.",
          "Para los autocares, la página muestra los autocares 1 a 8 con los primos 3, 5, 7, 11, 13, 17, 19 y 23, y solo pone en cola a los pasajeros cuya habitación pₖᵐ es como máximo 64. Eso da 12 pasajeros de autocar visibles, por ejemplo las habitaciones 3, 9 y 27 para el autocar 1.",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "Por qué los primos nunca chocan",
        paragraphs: [
          "Todo número entero mayor que 1 tiene exactamente una factorización en primos. Una potencia de 2 solo tiene el factor 2, y una potencia de un primo impar solo tiene ese primo, de modo que 2ⁿ, 3ᵐ, 5ᵐ y demás no pueden coincidir nunca. Además es un derroche: habitaciones como la 6, la 10, la 12 o la 15 tienen dos factores primos distintos y se quedan vacías para siempre. El hotel acaba con infinitas habitaciones libres incluso después de absorber infinitos autocares infinitos. Lo que nunca podrá absorber es una multitud tan grande como los números reales. Ese es el argumento diagonal de Cantor, que se cuenta en la página de la historia.",
        ],
      },
    ],
    experimentsHeading: "Prueba esto",
    experiments: [
      {
        title: "Sigue al último huésped hasta que sale de la vista",
        text: "Elige «1 huésped nuevo» y pulsa «Paso» una vez. El huésped de la habitación 64 pasa a la 65, fuera de la cuadrícula, y el contador del vestíbulo informa de un huésped más allá de la habitación 64. Ese huésped no ha desaparecido: en el hotel infinito siempre hay una habitación siguiente.",
      },
      {
        title: "Libera diez habitaciones de golpe",
        text: "Escoge «k huéspedes nuevos», arrastra k hasta 10 y pulsa «Reproducir» a unos 20 pasos por segundo. Cada huésped salta diez habitaciones hacia delante, y al final las habitaciones 1 a 10 se llenan de puntos cian mientras 10 huéspedes originales viven ahora más allá de la habitación 64.",
      },
      {
        title: "Mira cómo se abren las habitaciones impares",
        text: "Selecciona «ℵ₀ huéspedes nuevos» y reproduce a velocidad 6. Las duplicaciones vacían todas las habitaciones impares de la cuadrícula, y 32 huéspedes originales abandonan la zona visible. Después, las llegadas en cian llenan las habitaciones 1, 3, 5 hasta la 63, una tras otra.",
      },
      {
        title: "Cuenta las habitaciones vacías tras los autocares",
        text: "Ejecuta el escenario de los autocares hasta el final (76 pasos). Solo 18 de las 64 habitaciones visibles están ocupadas: las potencias de 2 hasta 64 y las 12 habitaciones que son potencias de primos. Habitaciones como la 6, la 15 o la 21 se quedan vacías, aunque todo el mundo tiene cama.",
      },
    ],
  },
  fr: {
    metaDescription:
      "Installe pas à pas des clients dans l'hôtel de Hilbert : un seul, k, une infinité, puis une infinité de cars logés grâce aux puissances de nombres premiers.",
    heading: "Comment fonctionne cet explorateur",
    intro:
      "La grille montre les 64 premières chambres d'un hôtel qui en compte une infinité, numérotées 1, 2, 3 et ainsi de suite sans fin. Les cases en pointillés au bout représentent tout ce qui se trouve au-delà de la chambre 64. Au départ, toutes les chambres sont prises : chaque point blanc doux est un client. Les nouveaux arrivants patientent dans la bande du hall, en dessous, et l'hôtel doit loger tout le monde sans mettre personne dehors. Chaque appui sur « Pas » déplace exactement un client.",
    sections: [
      {
        heading: "Un hôtel complet qui a encore de la place",
        paragraphs: [
          "David Hilbert a esquissé cet hôtel dans une conférence de 1924 pour montrer à quel point les ensembles infinis sont étranges. Dans un hôtel fini, complet veut dire complet. Dans un hôtel infini, tu peux demander à chaque client de passer de la chambre n à la chambre n + 1 au même instant. Personne n'est mis dehors, puisque tout n a un successeur, et la chambre 1 se retrouve soudain vide. La même idée avec n → n + k libère k chambres.",
          "L'astuce derrière les quatre scénarios est une fonction des numéros de chambre vers les numéros de chambre qui est injective (deux clients ne sont jamais envoyés dans la même chambre) mais pas surjective (il reste des chambres). Un ensemble fini ne peut jamais être envoyé de façon injective dans une partie stricte de lui-même ; un ensemble infini le peut toujours.",
          "Les scénarios plus vastes demandent des astuces plus fortes. Pour une foule infinie dénombrable de nouveaux clients (ℵ₀, aleph zéro, la taille des entiers naturels), chaque client présent passe de n à 2n. Toutes les chambres paires sont prises, toutes les impaires sont libres, et le nouveau client numéro i prend la chambre 2i − 1. Pour une infinité de cars transportant chacun une infinité de passagers, l'hôtel fait appel aux nombres premiers : le client présent n passe en 2ⁿ, et le passager m du car k va en pₖᵐ, où pₖ est le k-ième nombre premier impair.",
        ],
        formula: ROOM_MAP_FORMULA,
      },
      {
        heading: "À quoi servent les commandes",
        paragraphs: [
          "Les quatre boutons de scénario choisissent les arrivées : un nouveau client, k nouveaux clients, ℵ₀ nouveaux clients, ou ℵ₀ cars de ℵ₀ clients chacun. Le badge au-dessus de la grille affiche la règle en vigueur. Dans le scénario k apparaît un curseur qui règle k de 1 à 10 (3 par défaut).",
          "« Pas » effectue un déplacement, « Lecture » le répète automatiquement, « Pause » arrête et « Réinit. » relance le scénario depuis le début. Le curseur de vitesse règle de 1 à 40 pas par seconde et démarre à 6. La barre de progression compte les déplacements, par exemple 65 pour un client (64 décalages, puis une arrivée). Les contours ambrés signalent la chambre qu'un client quitte et celle où il s'installe, le cyan signale un nouveau client qui s'enregistre, le rose un passager de car. Le compteur à droite de la bande du hall indique combien de clients occupent désormais des chambres au-delà de la 64.",
        ],
      },
      {
        heading: "Comment c'est construit",
        paragraphs: [
          "Chaque client est un petit objet doté d'une origine (présent, nouveau ou car), d'un indice et d'une chambre courante ; la chambre 0 signifie qu'il attend encore dans le hall. La grille est du HTML ordinaire : 64 cases carrées en rangées de 8, plus six cases en pointillés pour la queue infinie, chacune dessinant jusqu'à quatre points colorés pour ses occupants. Il n'y a ni canevas ni animation continue, seulement une brève transition de couleur quand une chambre est mise en évidence, si bien que rien n'a besoin d'être figé pour la réduction des animations.",
          "Un détail compte pour que tout reste correct. Les décalages partent de la chambre visible la plus haute et descendent. Si le client 1 bougeait en premier, il arriverait dans la chambre 2 alors que son occupant y est encore. Commencer par la chambre 64 garantit que chaque chambre de destination a déjà été libérée quand quelqu'un y arrive. Dans l'hôtel mathématique, tout le monde bouge en même temps, l'ordre ne compte donc que pour l'animation.",
          "Pour les cars, la page montre les cars 1 à 8 avec les nombres premiers 3, 5, 7, 11, 13, 17, 19 et 23, et ne met en file que les passagers dont la chambre pₖᵐ vaut au plus 64. Cela donne 12 passagers de car visibles, par exemple les chambres 3, 9 et 27 pour le car 1.",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "Pourquoi les nombres premiers ne se télescopent jamais",
        paragraphs: [
          "Tout entier supérieur à 1 possède exactement une décomposition en facteurs premiers. Une puissance de 2 n'a que le facteur 2, et une puissance d'un nombre premier impair n'a que ce nombre premier, de sorte que 2ⁿ, 3ᵐ, 5ᵐ et ainsi de suite ne peuvent jamais coïncider. C'est aussi du gaspillage : des chambres comme 6, 10, 12 ou 15 ont deux facteurs premiers différents et restent vides pour toujours. L'hôtel se retrouve avec une infinité de chambres libres même après avoir absorbé une infinité de cars infinis. Ce qu'il ne pourra jamais absorber, c'est une foule aussi grande que les nombres réels. C'est l'argument diagonal de Cantor, raconté sur la page de l'histoire.",
        ],
      },
    ],
    experimentsHeading: "À essayer",
    experiments: [
      {
        title: "Suis le dernier client jusqu'à ce qu'il sorte du cadre",
        text: "Choisis « 1 nouveau client » et appuie une fois sur « Pas ». Le client de la chambre 64 passe dans la chambre 65, hors de la grille, et le compteur du hall signale un client au-delà de la chambre 64. Ce client n'a pas disparu : dans l'hôtel infini, il y a toujours une chambre suivante.",
      },
      {
        title: "Libère dix chambres d'un coup",
        text: "Prends « k nouveaux clients », fais glisser k jusqu'à 10 et appuie sur « Lecture » à environ 20 pas par seconde. Chaque client saute dix chambres plus loin, et à la fin les chambres 1 à 10 se remplissent de points cyan tandis que 10 clients d'origine logent désormais au-delà de la chambre 64.",
      },
      {
        title: "Regarde les chambres impaires se libérer",
        text: "Sélectionne « ℵ₀ nouveaux clients » et lance la lecture à la vitesse 6. Les doublements vident toutes les chambres impaires de la grille, et 32 clients d'origine quittent la zone visible. Puis les arrivants en cyan remplissent les chambres 1, 3, 5 jusqu'à 63, l'une après l'autre.",
      },
      {
        title: "Compte les chambres vides après les cars",
        text: "Déroule le scénario des cars jusqu'au bout (76 pas). Seules 18 des 64 chambres visibles sont occupées : les puissances de 2 jusqu'à 64 et les 12 chambres qui sont des puissances de nombres premiers. Des chambres comme 6, 15 ou 21 restent vides, alors que tout le monde a un lit.",
      },
    ],
  },
  it: {
    metaDescription:
      "Sistema gli ospiti nell'hotel di Hilbert passo dopo passo: uno, k, infiniti, e poi infiniti pullman distribuiti nelle stanze con le potenze dei primi.",
    heading: "Come funziona questo esploratore",
    intro:
      "La griglia mostra le prime 64 stanze di un hotel con infinite stanze, numerate 1, 2, 3 e così via per sempre. Le celle tratteggiate alla fine rappresentano tutto ciò che sta oltre la stanza 64. All'inizio ogni stanza è occupata: ogni puntino bianco tenue è un ospite. I nuovi arrivati aspettano nella striscia della hall, in basso, e l'hotel deve sistemarli tutti senza mandare via nessuno. Ogni pressione di «Passo» sposta esattamente un ospite.",
    sections: [
      {
        heading: "Un hotel pieno che ha ancora posto",
        paragraphs: [
          "David Hilbert abbozzò questo hotel in una lezione del 1924 per mostrare quanto siano strani gli insiemi infiniti. In un hotel finito, pieno vuol dire pieno. In uno infinito puoi chiedere a ogni ospite di spostarsi dalla stanza n alla stanza n + 1 nello stesso istante. Nessuno resta fuori, perché ogni n ha un successore, e la stanza 1 è all'improvviso vuota. La stessa idea con n → n + k libera k stanze.",
          "Il trucco dietro tutti e quattro gli scenari è una funzione dai numeri di stanza ai numeri di stanza che è iniettiva (due ospiti non vengono mai mandati nella stessa stanza) ma non suriettiva (qualche stanza avanza). Un insieme finito non può mai essere mandato in modo iniettivo in una sua parte propria; un insieme infinito sì, sempre.",
          "Gli scenari più grandi richiedono trucchi più grandi. Per una folla infinita numerabile di nuovi ospiti (ℵ₀, aleph zero, la grandezza dei numeri naturali) ogni ospite presente si sposta da n a 2n. Tutte le stanze pari sono occupate, tutte le dispari sono libere, e il nuovo ospite numero i prende la stanza 2i − 1. Per infiniti pullman, ciascuno con infiniti passeggeri, l'hotel usa i numeri primi: l'ospite presente n si sposta in 2ⁿ, e il passeggero m del pullman k va in pₖᵐ, dove pₖ è il k-esimo primo dispari.",
        ],
        formula: ROOM_MAP_FORMULA,
      },
      {
        heading: "Che cosa fanno i controlli",
        paragraphs: [
          "I quattro pulsanti di scenario scelgono chi arriva: un ospite nuovo, k ospiti nuovi, ℵ₀ ospiti nuovi, oppure ℵ₀ pullman con ℵ₀ ospiti ciascuno. L'etichetta sopra la griglia mostra la regola in vigore. Nello scenario k compare un cursore che imposta k da 1 a 10 (predefinito 3).",
          "«Passo» esegue una mossa, «Play» la ripete automaticamente, «Pausa» ferma tutto e «Azzera» fa ripartire lo scenario. Il cursore della velocità imposta da 1 a 40 passi al secondo e parte da 6. La barra di avanzamento conta le mosse, per esempio 65 per un ospite (64 spostamenti, poi un check-in). I contorni ambra indicano la stanza che un ospite sta lasciando e quella in cui si trasferisce, il ciano indica un nuovo ospite che fa il check-in, il rosa un passeggero di pullman. Il contatore a destra nella striscia della hall dice quanti ospiti si trovano ormai in stanze oltre la 64.",
        ],
      },
      {
        heading: "Com'è costruito",
        paragraphs: [
          "Ogni ospite è un piccolo oggetto con un'origine (presente, nuovo o pullman), un indice e una stanza corrente; la stanza 0 significa che sta ancora aspettando nella hall. La griglia è normale HTML: 64 celle quadrate in righe da 8, più sei celle tratteggiate per la coda infinita, e ognuna disegna fino a quattro puntini colorati per i suoi occupanti. Non c'è canvas e non c'è animazione continua, solo una breve transizione di colore quando una stanza viene evidenziata, quindi non occorre congelare nulla per il movimento ridotto.",
          "Un dettaglio conta per la correttezza. Gli spostamenti procedono dalla stanza visibile più alta verso il basso. Se l'ospite 1 si muovesse per primo, finirebbe nella stanza 2 mentre il suo occupante è ancora lì. Partire dalla stanza 64 significa che ogni stanza di destinazione è già stata liberata quando arriva qualcuno. Nell'hotel matematico tutti si muovono insieme, quindi l'ordine conta solo per l'animazione.",
          "Per i pullman la pagina mostra i pullman da 1 a 8 con i primi 3, 5, 7, 11, 13, 17, 19 e 23, e mette in coda solo i passeggeri la cui stanza pₖᵐ è al massimo 64. Ne risultano 12 passeggeri di pullman visibili, per esempio le stanze 3, 9 e 27 per il pullman 1.",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "Perché i primi non si scontrano mai",
        paragraphs: [
          "Ogni numero intero maggiore di 1 ha esattamente una fattorizzazione in primi. Una potenza di 2 ha solo il fattore 2, e una potenza di un primo dispari ha solo quel primo, quindi 2ⁿ, 3ᵐ, 5ᵐ e così via non possono mai coincidere. È anche uno spreco: stanze come la 6, la 10, la 12 o la 15 hanno due fattori primi diversi e restano vuote per sempre. L'hotel si ritrova con infinite stanze libere anche dopo aver assorbito infiniti pullman infiniti. Ciò che non potrà mai assorbire è una folla grande quanto i numeri reali. È l'argomento diagonale di Cantor, raccontato nella pagina della storia.",
        ],
      },
    ],
    experimentsHeading: "Prova così",
    experiments: [
      {
        title: "Segui l'ultimo ospite fuori dalla vista",
        text: "Scegli «1 ospite nuovo» e premi «Passo» una volta. L'ospite della stanza 64 si sposta nella stanza 65, fuori dalla griglia, e il contatore della hall segnala un ospite oltre la stanza 64. Quell'ospite non è svanito: nell'hotel infinito c'è sempre una stanza successiva.",
      },
      {
        title: "Libera dieci stanze in un colpo",
        text: "Scegli «k ospiti nuovi», trascina k fino a 10 e premi «Play» a circa 20 passi al secondo. Ogni ospite salta dieci stanze più avanti, e alla fine le stanze da 1 a 10 si riempiono di puntini ciano mentre 10 ospiti originari vivono ora oltre la stanza 64.",
      },
      {
        title: "Guarda aprirsi le stanze dispari",
        text: "Seleziona «ℵ₀ ospiti nuovi» e riproduci a velocità 6. I raddoppi svuotano ogni stanza dispari della griglia, e 32 ospiti originari lasciano l'area visibile. Poi i nuovi arrivi in ciano riempiono le stanze 1, 3, 5 fino alla 63, una dopo l'altra.",
      },
      {
        title: "Conta le stanze vuote dopo i pullman",
        text: "Porta lo scenario dei pullman fino alla fine (76 passi). Solo 18 delle 64 stanze visibili sono occupate: le potenze di 2 fino a 64 e le 12 stanze che sono potenze di primi. Stanze come la 6, la 15 o la 21 restano vuote, anche se tutti hanno un letto.",
      },
    ],
  },
  pt: {
    metaDescription:
      "Instala hóspedes no Hotel de Hilbert passo a passo: um, k, infinitos, e depois infinitos autocarros distribuídos pelos quartos com potências de primos.",
    heading: "Como funciona este explorador",
    intro:
      "A grelha mostra os primeiros 64 quartos de um hotel com infinitos quartos, numerados 1, 2, 3 e assim por diante, para sempre. As células tracejadas no fim representam tudo o que fica para além do quarto 64. No início todos os quartos estão ocupados: cada ponto branco suave é um hóspede. Quem chega espera na faixa do átrio, em baixo, e o hotel tem de alojar toda a gente sem pôr ninguém na rua. Cada toque em «Passo» move exatamente um hóspede.",
    sections: [
      {
        heading: "Um hotel cheio que ainda tem lugar",
        paragraphs: [
          "David Hilbert esboçou este hotel numa palestra de 1924 para mostrar como os conjuntos infinitos são estranhos. Num hotel finito, cheio quer dizer cheio. Num hotel infinito podes pedir a cada hóspede que passe do quarto n para o quarto n + 1 no mesmo instante. Ninguém fica de fora, porque todo o n tem um sucessor, e o quarto 1 fica subitamente vazio. A mesma ideia com n → n + k liberta k quartos.",
          "O truque por trás dos quatro cenários é uma função de números de quarto em números de quarto que é injetiva (nunca se enviam dois hóspedes para o mesmo quarto) mas não sobrejetiva (sobram quartos). Um conjunto finito nunca pode ser aplicado de forma injetiva numa parte própria de si mesmo; um conjunto infinito pode sempre.",
          "Os cenários maiores pedem truques maiores. Para uma multidão infinita numerável de hóspedes novos (ℵ₀, álefe zero, o tamanho dos números naturais), cada hóspede atual passa de n para 2n. Todos os quartos pares ficam ocupados, todos os ímpares ficam livres, e o hóspede novo número i fica com o quarto 2i − 1. Para infinitos autocarros, cada um com infinitos passageiros, o hotel recorre aos números primos: o hóspede atual n passa para 2ⁿ, e o passageiro m do autocarro k vai para pₖᵐ, onde pₖ é o k-ésimo primo ímpar.",
        ],
        formula: ROOM_MAP_FORMULA,
      },
      {
        heading: "O que fazem os controlos",
        paragraphs: [
          "Os quatro botões de cenário escolhem quem chega: um hóspede novo, k hóspedes novos, ℵ₀ hóspedes novos, ou ℵ₀ autocarros com ℵ₀ hóspedes cada. A etiqueta por cima da grelha mostra a regra em vigor. No cenário k aparece um cursor que define k de 1 a 10 (3 por omissão).",
          "«Passo» faz uma mudança, «Reproduzir» repete-a automaticamente, «Pausa» para e «Reiniciar» recomeça o cenário. O cursor de velocidade define de 1 a 40 passos por segundo e começa em 6. A barra de progresso conta as mudanças, por exemplo 65 para um hóspede (64 deslocações e depois um check-in). Os contornos âmbar assinalam o quarto que um hóspede está a deixar e aquele para onde se muda, o ciano assinala um hóspede novo a fazer o check-in, o rosa um passageiro de autocarro. O contador à direita da faixa do átrio diz quantos hóspedes estão agora em quartos para além do 64.",
        ],
      },
      {
        heading: "Como está construído",
        paragraphs: [
          "Cada hóspede é um pequeno objeto com uma origem (existente, novo ou autocarro), um índice e um quarto atual; o quarto 0 significa que ainda está à espera no átrio. A grelha é HTML normal: 64 células quadradas em filas de 8, mais seis células tracejadas para a cauda infinita, cada uma a desenhar até quatro pontos coloridos para os seus ocupantes. Não há canvas nem animação contínua, apenas uma breve transição de cor quando um quarto é destacado, por isso nada precisa de ser congelado para o movimento reduzido.",
          "Há um pormenor que importa para a correção. As deslocações correm do quarto visível mais alto para baixo. Se o hóspede 1 se mexesse primeiro, iria parar ao quarto 2 enquanto o ocupante ainda lá estava. Começar no quarto 64 garante que cada quarto de destino já foi desocupado quando alguém chega. No hotel matemático toda a gente se muda ao mesmo tempo, pelo que a ordem só interessa para a animação.",
          "Para os autocarros, a página mostra os autocarros 1 a 8 com os primos 3, 5, 7, 11, 13, 17, 19 e 23, e só põe na fila os passageiros cujo quarto pₖᵐ é no máximo 64. Isso dá 12 passageiros de autocarro visíveis, por exemplo os quartos 3, 9 e 27 para o autocarro 1.",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "Porque é que os primos nunca colidem",
        paragraphs: [
          "Todo o número inteiro maior do que 1 tem exatamente uma fatorização em primos. Uma potência de 2 só tem o fator 2, e uma potência de um primo ímpar só tem esse primo, pelo que 2ⁿ, 3ᵐ, 5ᵐ e por aí fora nunca podem coincidir. É também um desperdício: quartos como o 6, o 10, o 12 ou o 15 têm dois fatores primos diferentes e ficam vazios para sempre. O hotel acaba com infinitos quartos livres mesmo depois de absorver infinitos autocarros infinitos. O que nunca conseguirá absorver é uma multidão tão grande como os números reais. Esse é o argumento diagonal de Cantor, contado na página da história.",
        ],
      },
    ],
    experimentsHeading: "Experimenta isto",
    experiments: [
      {
        title: "Segue o último hóspede até sair de vista",
        text: "Escolhe «1 hóspede novo» e carrega em «Passo» uma vez. O hóspede do quarto 64 passa para o quarto 65, fora da grelha, e o contador do átrio indica um hóspede para além do quarto 64. Esse hóspede não desapareceu: no hotel infinito há sempre um quarto seguinte.",
      },
      {
        title: "Liberta dez quartos de uma vez",
        text: "Escolhe «k hóspedes novos», arrasta k até 10 e carrega em «Reproduzir» a cerca de 20 passos por segundo. Cada hóspede salta dez quartos para a frente, e no fim os quartos 1 a 10 enchem-se de pontos ciano enquanto 10 hóspedes originais vivem agora para além do quarto 64.",
      },
      {
        title: "Vê os quartos ímpares a abrir",
        text: "Seleciona «ℵ₀ hóspedes novos» e reproduz à velocidade 6. As duplicações esvaziam todos os quartos ímpares da grelha, e 32 hóspedes originais saem da zona visível. Depois, as chegadas a ciano enchem os quartos 1, 3, 5 até ao 63, um a seguir ao outro.",
      },
      {
        title: "Conta os quartos vazios depois dos autocarros",
        text: "Corre o cenário dos autocarros até ao fim (76 passos). Só 18 dos 64 quartos visíveis estão ocupados: as potências de 2 até 64 e os 12 quartos que são potências de primos. Quartos como o 6, o 15 ou o 21 ficam vazios, embora toda a gente tenha cama.",
      },
    ],
  },
  sv: {
    metaDescription:
      "Checka in gäster på Hilberts hotell steg för steg: en gäst, k gäster, oändligt många och sedan oändligt många bussar som får rum via primtalspotenser.",
    heading: "Så fungerar den här utforskaren",
    intro:
      "Rutnätet visar de första 64 rummen i ett hotell med oändligt många rum, numrerade 1, 2, 3 och så vidare i all evighet. De streckade rutorna i slutet står för allt bortom rum 64. Från början är varje rum upptaget: varje mjukt vit prick är en gäst. Nyanlända väntar i lobbyremsan nedanför, och hotellet måste få plats med alla utan att kasta ut någon. Varje tryck på ”Steg” flyttar exakt en gäst.",
    sections: [
      {
        heading: "Ett fullt hotell som ändå har plats",
        paragraphs: [
          "David Hilbert skisserade det här hotellet i en föreläsning 1924 för att visa hur märkliga oändliga mängder är. I ett ändligt hotell betyder fullt att det är fullt. I ett oändligt kan du be varje gäst att flytta från rum n till rum n + 1 i samma ögonblick. Ingen kastas ut, eftersom varje n har en efterföljare, och rum 1 är plötsligt ledigt. Samma idé med n → n + k frigör k rum.",
          "Tricket bakom alla fyra scenarierna är en funktion från rumsnummer till rumsnummer som är injektiv (två gäster skickas aldrig till samma rum) men inte surjektiv (några rum blir över). En ändlig mängd kan aldrig avbildas injektivt in i en äkta del av sig själv. En oändlig mängd kan det alltid.",
          "De större scenarierna kräver större trick. För en uppräkneligt oändlig skara nya gäster (ℵ₀, alef-noll, storleken på de naturliga talen) flyttar varje nuvarande gäst från n till 2n. Alla jämna rum är upptagna, alla udda rum är lediga, och ny gäst nummer i tar rum 2i − 1. För oändligt många bussar, var och en med oändligt många passagerare, använder hotellet primtal: nuvarande gäst n flyttar till 2ⁿ, och passagerare m i buss k hamnar i pₖᵐ, där pₖ är det k:te udda primtalet.",
        ],
        formula: ROOM_MAP_FORMULA,
      },
      {
        heading: "Vad reglagen gör",
        paragraphs: [
          "De fyra scenarioknapparna väljer vilka som anländer: en ny gäst, k nya gäster, ℵ₀ nya gäster eller ℵ₀ bussar med ℵ₀ gäster vardera. Märket ovanför rutnätet visar regeln som gäller. I k-scenariot dyker ett reglage upp som ställer in k från 1 till 10 (standard 3).",
          "”Steg” utför en flytt, ”Spela” upprepar det automatiskt, ”Paus” stannar och ”Återställ” börjar om scenariot. Hastighetsreglaget ställer in 1 till 40 steg per sekund och börjar på 6. Förloppsindikatorn räknar flyttarna, till exempel 65 för en gäst (64 förskjutningar och sedan en incheckning). Bärnstensfärgade konturer markerar rummet en gäst lämnar och rummet gästen flyttar in i, cyan markerar en ny gäst som checkar in och rosa en busspassagerare. Räknaren till höger i lobbyremsan säger hur många gäster som nu bor i rum bortom 64.",
        ],
      },
      {
        heading: "Hur den är byggd",
        paragraphs: [
          "Varje gäst är ett litet objekt med ett ursprung (befintlig, ny eller buss), ett index och ett aktuellt rum. Rum 0 betyder att gästen fortfarande väntar i lobbyn. Rutnätet är vanlig HTML: 64 kvadratiska rutor i rader om 8, plus sex streckade rutor för den oändliga svansen, och varje ruta ritar upp till fyra färgade prickar för dem som bor där. Det finns ingen canvas och ingen kontinuerlig animation, bara en kort färgövergång när ett rum markeras, så ingenting behöver frysas för minskad rörelse.",
          "En detalj är viktig för att det ska bli rätt. Förskjutningarna går från det högsta synliga rummet och nedåt. Om gäst 1 flyttade först skulle den hamna i rum 2 medan den som bor där fortfarande är kvar. Att börja i rum 64 innebär att varje målrum redan har utrymts när någon kommer dit. I det matematiska hotellet flyttar alla på en gång, så ordningen spelar bara roll för animationen.",
          "För bussarna visar sidan buss 1 till 8 med primtalen 3, 5, 7, 11, 13, 17, 19 och 23, och köar bara de passagerare vars rum pₖᵐ är högst 64. Det ger 12 synliga busspassagerare, till exempel rum 3, 9 och 27 för buss 1.",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "Varför primtalen aldrig krockar",
        paragraphs: [
          "Varje heltal större än 1 har exakt en primtalsfaktorisering. En potens av 2 har bara faktorn 2, och en potens av ett udda primtal har bara det primtalet, så 2ⁿ, 3ᵐ, 5ᵐ och så vidare kan aldrig sammanfalla. Det är också slösaktigt: rum som 6, 10, 12 eller 15 har två olika primfaktorer och står tomma för alltid. Hotellet har till slut oändligt många lediga rum även efter att ha tagit emot oändligt många oändliga bussar. Det enda det aldrig kan ta emot är en skara lika stor som de reella talen. Det är Cantors diagonalargument, som berättas på berättelsesidan.",
        ],
      },
    ],
    experimentsHeading: "Prova det här",
    experiments: [
      {
        title: "Följ den översta gästen ut ur bild",
        text: "Välj ”1 ny gäst” och tryck på ”Steg” en gång. Gästen i rum 64 flyttar till rum 65, utanför rutnätet, och lobbyräknaren rapporterar en gäst bortom rum 64. Den gästen försvann inte: i det oändliga hotellet finns det alltid ett nästa rum.",
      },
      {
        title: "Frigör tio rum på en gång",
        text: "Välj ”k nya gäster”, dra k till 10 och tryck på ”Spela” vid ungefär 20 steg per sekund. Varje gäst hoppar tio rum framåt, och till slut fylls rum 1 till 10 med cyanfärgade prickar medan 10 ursprungliga gäster nu bor bortom rum 64.",
      },
      {
        title: "Se de udda rummen öppnas",
        text: "Välj ”ℵ₀ nya gäster” och spela med hastighet 6. Fördubblingarna tömmer varje udda rum i rutnätet, och 32 ursprungliga gäster lämnar det synliga området. Sedan fyller de cyanfärgade nyanlända rum 1, 3, 5 upp till 63, ett efter ett.",
      },
      {
        title: "Räkna de tomma rummen efter bussarna",
        text: "Kör busscenariot till slutet (76 steg). Bara 18 av de 64 synliga rummen är upptagna: potenserna av 2 upp till 64 och de 12 rum som är primtalspotenser. Rum som 6, 15 eller 21 står tomma, trots att alla har en säng.",
      },
    ],
  },
  no: {
    metaDescription:
      "Sjekk inn gjester på Hilberts hotell steg for steg: én gjest, k gjester, uendelig mange og så uendelig mange busser som får rom via primtallspotenser.",
    heading: "Slik fungerer denne utforskeren",
    intro:
      "Rutenettet viser de første 64 rommene i et hotell med uendelig mange rom, nummerert 1, 2, 3 og så videre i det uendelige. De stiplede rutene til slutt står for alt bortenfor rom 64. I starten er alle rom opptatt: Hver myke hvite prikk er en gjest. Nyankomne venter i lobbystripen nedenfor, og hotellet må få plass til alle uten å kaste ut noen. Hvert trykk på «Steg» flytter nøyaktig én gjest.",
    sections: [
      {
        heading: "Et fullt hotell som likevel har plass",
        paragraphs: [
          "David Hilbert skisserte dette hotellet i en forelesning i 1924 for å vise hvor merkelige uendelige mengder er. I et endelig hotell betyr fullt at det er fullt. I et uendelig kan du be hver gjest flytte fra rom n til rom n + 1 i samme øyeblikk. Ingen blir kastet ut, fordi hver n har en etterfølger, og rom 1 er plutselig ledig. Den samme ideen med n → n + k frigjør k rom.",
          "Trikset bak alle de fire scenarioene er en funksjon fra romnumre til romnumre som er injektiv (to gjester sendes aldri til samme rom), men ikke surjektiv (noen rom blir til overs). En endelig mengde kan aldri avbildes injektivt inn i en ekte delmengde av seg selv. En uendelig mengde kan det alltid.",
          "De større scenarioene krever større triks. For en tellbart uendelig flokk av nye gjester (ℵ₀, alef-null, størrelsen på de naturlige tallene) flytter hver nåværende gjest fra n til 2n. Alle partallsrom er opptatt, alle oddetallsrom er ledige, og ny gjest nummer i tar rom 2i − 1. For uendelig mange busser, hver med uendelig mange passasjerer, bruker hotellet primtall: Nåværende gjest n flytter til 2ⁿ, og passasjer m i buss k går til pₖᵐ, der pₖ er det k-te odde primtallet.",
        ],
        formula: ROOM_MAP_FORMULA,
      },
      {
        heading: "Hva kontrollene gjør",
        paragraphs: [
          "De fire scenarioknappene velger hvem som ankommer: én ny gjest, k nye gjester, ℵ₀ nye gjester eller ℵ₀ busser med ℵ₀ gjester hver. Merket over rutenettet viser regelen som gjelder. I k-scenarioet dukker det opp en glidebryter som setter k fra 1 til 10 (standard 3).",
          "«Steg» utfører én flytting, «Spill» gjentar det automatisk, «Pause» stopper, og «Nullstill» starter scenarioet på nytt. Glidebryteren for hastighet setter 1 til 40 steg per sekund og starter på 6. Framdriftslinjen teller flyttingene, for eksempel 65 for én gjest (64 forskyvninger og så én innsjekking). Ravgule omriss markerer rommet en gjest forlater og rommet gjesten flytter inn i, cyan markerer en ny gjest som sjekker inn, rosa en busspassasjer. Telleren til høyre i lobbystripen sier hvor mange gjester som nå bor i rom bortenfor 64.",
        ],
      },
      {
        heading: "Slik er den bygget",
        paragraphs: [
          "Hver gjest er et lite objekt med et opphav (eksisterende, ny eller buss), en indeks og et gjeldende rom. Rom 0 betyr at gjesten fortsatt venter i lobbyen. Rutenettet er vanlig HTML: 64 kvadratiske ruter i rader på 8, pluss seks stiplede ruter for den uendelige halen, og hver rute tegner opptil fire fargede prikker for dem som bor der. Det finnes ikke noe lerret og ingen kontinuerlig animasjon, bare en kort fargeovergang når et rom utheves, så ingenting trenger å fryses for redusert bevegelse.",
          "Én detalj er viktig for at det skal bli riktig. Forskyvningene går fra det høyeste synlige rommet og nedover. Hvis gjest 1 flyttet først, ville den havnet i rom 2 mens den som bor der, fortsatt var der. Å starte i rom 64 betyr at hvert målrom allerede er fraflyttet når noen kommer dit. I det matematiske hotellet flytter alle samtidig, så rekkefølgen betyr bare noe for animasjonen.",
          "For bussene viser siden buss 1 til 8 med primtallene 3, 5, 7, 11, 13, 17, 19 og 23, og setter bare de passasjerene i kø som har et rom pₖᵐ på høyst 64. Det gir 12 synlige busspassasjerer, for eksempel rom 3, 9 og 27 for buss 1.",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "Hvorfor primtallene aldri kolliderer",
        paragraphs: [
          "Hvert heltall større enn 1 har nøyaktig én primtallsfaktorisering. En potens av 2 har bare faktoren 2, og en potens av et odde primtall har bare det primtallet, så 2ⁿ, 3ᵐ, 5ᵐ og så videre kan aldri falle sammen. Det er også sløsing: Rom som 6, 10, 12 eller 15 har to ulike primfaktorer og står tomme for alltid. Hotellet ender opp med uendelig mange ledige rom selv etter å ha tatt imot uendelig mange uendelige busser. Det eneste det aldri kan ta imot, er en flokk like stor som de reelle tallene. Det er Cantors diagonalargument, som fortelles på historiesiden.",
        ],
      },
    ],
    experimentsHeading: "Prøv dette",
    experiments: [
      {
        title: "Følg den øverste gjesten ut av syne",
        text: "Velg «1 ny gjest» og trykk på «Steg» én gang. Gjesten i rom 64 flytter til rom 65, utenfor rutenettet, og lobbytelleren melder om én gjest bortenfor rom 64. Den gjesten forsvant ikke: I det uendelige hotellet finnes det alltid et neste rom.",
      },
      {
        title: "Frigjør ti rom på én gang",
        text: "Velg «k nye gjester», dra k til 10 og trykk på «Spill» ved omtrent 20 steg per sekund. Hver gjest hopper ti rom fram, og til slutt fylles rom 1 til 10 med cyanfargede prikker mens 10 opprinnelige gjester nå bor bortenfor rom 64.",
      },
      {
        title: "Se oddetallsrommene åpne seg",
        text: "Velg «ℵ₀ nye gjester» og spill av med hastighet 6. Doblingene tømmer hvert oddetallsrom i rutenettet, og 32 opprinnelige gjester forlater det synlige området. Så fyller de cyanfargede nyankomne rom 1, 3, 5 opp til 63, ett etter ett.",
      },
      {
        title: "Tell de tomme rommene etter bussene",
        text: "Kjør busscenarioet til slutten (76 steg). Bare 18 av de 64 synlige rommene er opptatt: potensene av 2 opp til 64 og de 12 rommene som er primtallspotenser. Rom som 6, 15 eller 21 står tomme, selv om alle har en seng.",
      },
    ],
  },
};
