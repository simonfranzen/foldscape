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
        formula:
          "n \\mapsto 2^n, \\qquad (k, m) \\mapsto p_k^{\\,m}, \\quad p_1 = 3,\\ p_2 = 5,\\ p_3 = 7,\\ \\dots",
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
        formula:
          "n \\mapsto 2^n, \\qquad (k, m) \\mapsto p_k^{\\,m}, \\quad p_1 = 3,\\ p_2 = 5,\\ p_3 = 7,\\ \\dots",
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
};
