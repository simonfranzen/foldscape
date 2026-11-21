import type { ExplorerGuide } from "./types";

// Facts quoted here (seven historical bridges, three hypothetical extras,
// degrees 3/5/3/3 for A/B/C/D, the 30-unit click tolerance, 650 ms per auto-walk step) match
// app/konigsberg/explorer/page.tsx; update both together.
const CLASSIFY_EXCERPT = `function computeDegrees(activeIds) {
  const deg = { A: 0, B: 0, C: 0, D: 0 };
  for (const br of BRIDGES) {
    if (!activeIds.has(br.id)) continue;
    deg[br.a] += 1;
    deg[br.b] += 1;
  }
  return deg;
}

function classifyGraph(activeIds) {
  if (!isConnected(activeIds)) return { kind: "disconnected" };
  const deg = computeDegrees(activeIds);
  const odd = ["A", "B", "C", "D"].filter((v) => deg[v] % 2 === 1);
  if (odd.length === 0) return { kind: "circuit", oddCount: 0 };
  if (odd.length === 2) return { kind: "path", oddCount: 2, ends: [odd[0], odd[1]] };
  return { kind: "none", oddCount: odd.length };
}`;

export const KONIGSBERG_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Walk the seven bridges of Königsberg yourself, toggle bridges, watch vertex degrees change and see Euler's parity rule and Hierholzer's algorithm at work.",
    heading: "How this explorer works",
    intro:
      "The map shows two river banks (A in the north, D in the south) and two islands (Kneiphof, B, and Lomse, C), joined by bridges. You pick a starting point and then click bridges to cross them, one after another, never using a bridge twice. The question is the one the citizens of Königsberg are said to have asked: can you cross every bridge exactly once? With the seven bridges, the answer is no, and you can find that out the honest way: by getting stuck.",
    sections: [
      {
        heading: "Euler's parity argument",
        paragraphs: [
          "In 1736 Leonhard Euler noticed that the shape of the land and the length of the bridges are irrelevant. All that matters is which land masses are connected, and by how many bridges. Today this is called a graph: the land masses are vertices, the bridges are edges, and the number of bridges at a land mass is its degree.",
          "Every time a walk passes through a land mass, it uses one bridge to arrive and another to leave. So every vertex in the middle of the walk uses up its bridges in pairs. Only the start and the end can have a bridge left over. A walk that uses every edge exactly once (an Eulerian path) is therefore only possible if at most two vertices have odd degree. If it should end where it started (an Eulerian circuit), every degree must be even. For a connected graph, these conditions are also sufficient.",
          "In the default setup, the island B has five bridges and A, C and D have three each. Four odd vertices, so no such walk exists, no matter where you start or how cleverly you choose.",
        ],
        formula:
          "\\sum_{v} \\deg(v) = 2\\,|E| \\quad\\Longrightarrow\\quad \\#\\{v : \\deg(v) \\text{ odd}\\} \\text{ is even}",
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "Start at chooses the land mass where your walk begins; it is highlighted on the map. On the canvas, the bridges you may cross next light up when you hover over them. A click within a short distance of a bridge crosses it, as long as it touches your current land mass and has not been used yet. Crossed bridges fade and get a numbered marker.",
          "The bridges list has ten entries: the seven historical bridges, which are on by default, plus three hypothetical ones that never existed and are drawn dashed (two direct bank to bank bridges, AD and AD2, and a second bridge between the islands, BC2). Toggling any of them recomputes every degree, the odd or even badge of each vertex and the status at the top: Eulerian circuit, Eulerian path (with its two possible end points), not Eulerian, or disconnected. Changing the bridge set or the start resets your walk.",
          "The auto button changes its job with the graph. If an Eulerian path or circuit exists, it animates Hierholzer's algorithm crossing every bridge exactly once, one bridge every 650 milliseconds. It begins at your start if a complete walk can begin there, and otherwise moves the start to an odd vertex. If not, it runs a greedy walk that picks a random unused bridge at every step until none is left, and you watch it get stuck.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "The map is drawn on a 2D canvas in a fixed logical space of 800 by 500 units, scaled to your screen and pixel density. Each bridge is a cubic Bézier curve between two vertex centres. To decide which bridge you clicked, the explorer samples each curve at 25 points and takes the bridge whose nearest sample is within 30 units of the pointer.",
          "The graph itself is just the list of active bridge ids. Degrees are counted by walking that list once. Connectivity is a depth-first search over the vertices that still have at least one bridge, so a land mass with all its bridges removed is simply ignored rather than making the graph count as disconnected. Hierholzer's algorithm uses a stack: it keeps following unused edges, and whenever it reaches a dead end it backtracks and records the edge it backs out of. Reversing that record gives the Eulerian trail.",
          "There is no continuous animation on this page. The map only redraws when something changes (a hover, a crossing, a toggle) or when the canvas is resized.",
        ],
        code: CLASSIFY_EXCERPT,
      },
      {
        heading: "Why one bridge changes everything",
        paragraphs: [
          "Adding or removing a single bridge changes the degree of exactly two vertices by one, so it flips the parity of both ends. That is why the status jumps in steps of two: from four odd vertices to two, or from two to zero. It is also why a graph never has exactly one or three odd vertices: the degrees always add up to twice the number of edges.",
          "The map is a schematic of the layout Euler analysed in 1736. Kneiphof (B) has five bridges: two to each bank and one to the neighbouring island Lomse (C), which in turn has one bridge to each bank. Shapes and distances are simplified, but which land mass is joined to which, and how often, is historical.",
        ],
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "Get stuck on purpose",
        text: "Leave the seven bridges on, start at A and try to cross everything by hand. Then press the auto button a few times. The greedy walk picks differently each time, but it always ends with at least one bridge unused.",
      },
      {
        title: "Add one bridge that never existed",
        text: "Switch on AD, a direct bridge between the banks. Now A and D have degree four, and only B and C are odd. The status turns to Eulerian path, from B to C. Start at B and you can finish the tour; start at A and you will strand yourself.",
      },
      {
        title: "Close the circuit",
        text: "With AD on, also switch on BC2. Every vertex is now even, and the status says Eulerian circuit: a round trip over all nine bridges that ends where it began.",
      },
      {
        title: "Remove instead of adding",
        text: "Return to the original seven and switch off AC, BC and CD. Lomse (C) drops out of the graph entirely, and A, B and D are left with degrees two, four and two. Without building anything new, the remaining four bridges form a circuit.",
      },
    ],
  },
  de: {
    metaDescription:
      "Lauf selbst über die sieben Brücken von Königsberg, schalte Brücken um, beobachte die Knotengrade und sieh Eulers Paritätsregel und Hierholzer in Aktion.",
    heading: "So funktioniert dieser Explorer",
    intro:
      "Die Karte zeigt zwei Flussufer (A im Norden, D im Süden) und zwei Inseln (Kneiphof, B, und Lomse, C), verbunden durch Brücken. Du wählst einen Startpunkt und klickst dann Brücke für Brücke an, um sie zu überqueren, ohne eine Brücke zweimal zu benutzen. Die Frage ist die, die sich die Menschen in Königsberg gestellt haben sollen: Kann man jede Brücke genau einmal überqueren? Mit den sieben Brücken lautet die Antwort nein, und du findest das auf ehrliche Weise heraus: indem du stecken bleibst.",
    sections: [
      {
        heading: "Eulers Paritätsargument",
        paragraphs: [
          "1736 erkannte Leonhard Euler, dass die Form des Landes und die Länge der Brücken keine Rolle spielen. Es zählt nur, welche Landstücke verbunden sind und durch wie viele Brücken. Heute nennen wir so ein Bild einen Graphen: Die Landstücke sind Knoten, die Brücken Kanten, und die Zahl der Brücken an einem Landstück ist sein Grad.",
          "Jedes Mal, wenn ein Weg durch ein Landstück führt, braucht er eine Brücke zum Ankommen und eine zum Verlassen. Jeder Knoten in der Mitte des Wegs verbraucht seine Brücken also paarweise. Nur Start und Ziel dürfen eine Brücke übrig haben. Ein Weg, der jede Kante genau einmal benutzt (ein Eulerweg), ist deshalb nur möglich, wenn höchstens zwei Knoten ungeraden Grad haben. Soll er dort enden, wo er begann (ein Eulerkreis), müssen alle Grade gerade sein. Für zusammenhängende Graphen reichen diese Bedingungen auch aus.",
          "In der Grundeinstellung hat die Insel B fünf Brücken, A, C und D je drei. Vier ungerade Knoten, also gibt es keinen solchen Weg, egal wo du startest und wie geschickt du wählst.",
        ],
        formula:
          "\\sum_{v} \\deg(v) = 2\\,|E| \\quad\\Longrightarrow\\quad \\#\\{v : \\deg(v) \\text{ ungerade}\\} \\text{ ist gerade}",
      },
      {
        heading: "Was die Bedienelemente bewirken",
        paragraphs: [
          "«Start bei» legt fest, auf welchem Landstück dein Weg beginnt; es wird auf der Karte hervorgehoben. Auf dem Canvas leuchten die Brücken auf, die du als Nächstes nehmen darfst, sobald du mit der Maus darüberfährst. Ein Klick in der Nähe einer Brücke überquert sie, sofern sie an deinem aktuellen Landstück liegt und noch nicht benutzt wurde. Überquerte Brücken verblassen und bekommen eine Nummer.",
          "Die Brückenliste hat zehn Einträge: die sieben historischen Brücken, die anfangs aktiv sind, und drei hypothetische, die es nie gab und die gestrichelt gezeichnet sind (zwei direkte Brücken von Ufer zu Ufer, AD und AD2, und eine zweite Brücke zwischen den Inseln, BC2). Jedes Umschalten berechnet alle Grade neu, dazu die Markierung gerade oder ungerade an jedem Knoten und den Status oben: Eulerkreis, Eulerweg (mit seinen beiden möglichen Endpunkten), nicht eulersch oder unzusammenhängend. Eine neue Brückenauswahl oder ein neuer Start setzt deinen Weg zurück.",
          "Der Auto-Knopf ändert seine Aufgabe je nach Graph. Gibt es einen Eulerweg oder Eulerkreis, animiert er den Algorithmus von Hierholzer, der jede Brücke genau einmal überquert, alle 650 Millisekunden eine. Er beginnt an deinem Start, wenn ein vollständiger Weg dort beginnen kann, und verlegt den Start sonst auf einen ungeraden Knoten. Gibt es keinen, läuft ein gieriger Weg, der bei jedem Schritt zufällig eine unbenutzte Brücke wählt, bis keine mehr übrig ist, und du siehst ihn stecken bleiben.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Die Karte wird auf ein 2D-Canvas in einem festen logischen Raum von 800 mal 500 Einheiten gezeichnet und auf deinen Bildschirm und dessen Pixeldichte skaliert. Jede Brücke ist eine kubische Bézierkurve zwischen zwei Knotenmittelpunkten. Um herauszufinden, welche Brücke du angeklickt hast, tastet der Explorer jede Kurve an 25 Punkten ab und nimmt die Brücke, deren nächster Punkt höchstens 30 Einheiten vom Zeiger entfernt liegt.",
          "Der Graph selbst ist nur die Liste der aktiven Brücken. Die Grade entstehen in einem einzigen Durchlauf durch diese Liste. Der Zusammenhang wird per Tiefensuche über die Knoten geprüft, die noch mindestens eine Brücke haben. Ein Landstück ohne Brücken wird also einfach ignoriert, statt den Graphen als unzusammenhängend zu werten. Hierholzers Algorithmus arbeitet mit einem Stapel: Er folgt so lange unbenutzten Kanten, bis er in einer Sackgasse landet, geht dann zurück und notiert die Kante, über die er zurückweicht. Diese Notiz rückwärts gelesen ergibt den Eulerweg.",
          "Auf dieser Seite gibt es keine Daueranimation. Die Karte wird nur neu gezeichnet, wenn sich etwas ändert (Hover, Überquerung, Umschalten) oder das Canvas seine Größe ändert.",
        ],
        code: CLASSIFY_EXCERPT,
      },
      {
        heading: "Warum eine Brücke alles ändert",
        paragraphs: [
          "Eine Brücke mehr oder weniger ändert den Grad von genau zwei Knoten um eins, sie kippt also die Parität an beiden Enden. Darum springt der Status immer in Zweierschritten: von vier ungeraden Knoten auf zwei oder von zwei auf null. Deshalb hat ein Graph auch nie genau einen oder drei ungerade Knoten: Die Grade ergeben zusammen immer das Doppelte der Kantenzahl.",
          "Die Karte ist ein Schema der Lage, die Euler 1736 untersucht hat. Der Kneiphof (B) hat fünf Brücken: je zwei zu den beiden Ufern und eine zur Nachbarinsel Lomse (C), die ihrerseits je eine Brücke zu jedem Ufer hat. Formen und Entfernungen sind vereinfacht, aber welches Landstück mit welchem verbunden ist und wie oft, ist historisch.",
        ],
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Absichtlich stecken bleiben",
        text: "Lass die sieben Brücken aktiv, starte bei A und versuch, alles von Hand zu überqueren. Drück danach ein paarmal den Auto-Knopf. Der gierige Weg wählt jedes Mal anders, endet aber immer mit mindestens einer unbenutzten Brücke.",
      },
      {
        title: "Eine Brücke, die es nie gab",
        text: "Schalte AD ein, eine direkte Brücke zwischen den Ufern. Jetzt haben A und D den Grad vier, und nur noch B und C sind ungerade. Der Status springt auf Eulerweg, von B nach C. Startest du bei B, schaffst du die Runde; startest du bei A, sitzt du irgendwann fest.",
      },
      {
        title: "Den Kreis schließen",
        text: "Lass AD an und schalte zusätzlich BC2 ein. Jetzt ist jeder Knoten gerade, und der Status meldet einen Eulerkreis: eine Rundtour über alle neun Brücken, die dort endet, wo sie begann.",
      },
      {
        title: "Wegnehmen statt bauen",
        text: "Kehr zu den sieben Originalbrücken zurück und schalte AC, BC und CD aus. Die Lomse (C) fällt ganz aus dem Graphen, A, B und D behalten die Grade zwei, vier und zwei. Ohne eine einzige neue Brücke bilden die übrigen vier einen Kreis.",
      },
    ],
  },
};
