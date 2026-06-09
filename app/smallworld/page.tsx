"use client";

import { Reveal } from "@/components/Reveal";
import { StoryPageShell, StoryCard } from "@/components/StoryPageShell";
import { useI18n } from "@/lib/i18n/context";
import type { Locale } from "@/lib/i18n/types";

const ACCENT = "text-signal-teal";

// --------------------------------------------------------------------------
// Per-locale strings for the inline "three networks, three regimes" figure
// and the CTA label. Kept inline so the multi-locale prose lives with the
// page that owns it, rather than fattening the shared stories bundle
// (s.pages.smallworld already carries hero + sections).
// Math symbols (N, k, p, C, L) stay verbatim across locales.
// --------------------------------------------------------------------------

type PanelKey = "lattice" | "small" | "random";

type RichFigures = {
  finalLabel: string;
  figurePretitle: string;
  figureTitle: string; // math-italic, kept short
  panels: Record<
    PanelKey,
    {
      label: string;
      sub: string;
      body: string;
    }
  >;
  caption: string;
};

const FIGURES: Record<Locale, RichFigures> = {
  en: {
    finalLabel: "Shrink the world.",
    figurePretitle: "Three networks, three regimes",
    figureTitle: "Lattice · small world · random",
    panels: {
      lattice: {
        label: "Regular lattice",
        sub: "p = 0 · high C, high L",
        body: "Every node is tied to its neighbours. Friends-of-friends are friends. To reach the far side of the ring you take many short steps.",
      },
      small: {
        label: "Watts-Strogatz",
        sub: "p ≈ 0.1 · high C, low L",
        body: "A handful of random shortcuts. Clustering survives; the diameter collapses. The small-world sweet spot.",
      },
      random: {
        label: "Random graph",
        sub: "p = 1 · low C, low L",
        body: "Edges land anywhere. Path lengths are tiny, but the local triangles are gone — no community structure left.",
      },
    },
    caption:
      "Same N = 24 nodes, same starting ring lattice with k = 3 neighbours per side. Only the rewiring probability p changes. The middle picture is the small-world regime — shortcuts (drawn as chords across the circle) shrink the average path length dramatically while local triangles, the source of clustering, are mostly preserved.",
  },
  de: {
    finalLabel: "Schrumpfe die Welt.",
    figurePretitle: "Drei Netzwerke, drei Regime",
    figureTitle: "Gitter · small world · Zufall",
    panels: {
      lattice: {
        label: "Reguläres Gitter",
        sub: "p = 0 · hohes C, hohes L",
        body: "Jeder Knoten ist mit seinen Nachbarn verbunden. Freunde von Freunden sind Freunde. Um auf die andere Seite des Rings zu gelangen, braucht es viele kurze Schritte.",
      },
      small: {
        label: "Watts-Strogatz",
        sub: "p ≈ 0,1 · hohes C, niedriges L",
        body: "Eine Handvoll zufälliger Abkürzungen. Das Clustering überlebt, der Durchmesser bricht ein. Der Small-World-Sweetspot.",
      },
      random: {
        label: "Zufallsgraph",
        sub: "p = 1 · niedriges C, niedriges L",
        body: "Kanten landen irgendwo. Pfadlängen sind winzig, aber die lokalen Dreiecke sind weg — keine Gemeinschaftsstruktur bleibt übrig.",
      },
    },
    caption:
      "Dieselben N = 24 Knoten, dasselbe Ring-Gitter zu Beginn mit k = 3 Nachbarn pro Seite. Nur die Verdrahtungswahrscheinlichkeit p ändert sich. Das mittlere Bild ist das Small-World-Regime — Abkürzungen (als Sehnen durch den Kreis gezeichnet) verkürzen die mittlere Pfadlänge dramatisch, während die lokalen Dreiecke, die Quelle des Clusterings, weitgehend erhalten bleiben.",
  },
  es: {
    finalLabel: "Encoge el mundo.",
    figurePretitle: "Tres redes, tres regímenes",
    figureTitle: "Retícula · small world · azar",
    panels: {
      lattice: {
        label: "Retícula regular",
        sub: "p = 0 · C alto, L alto",
        body: "Cada nodo está conectado a sus vecinos. Los amigos de los amigos son amigos. Para llegar al otro lado del anillo hacen falta muchos pasos cortos.",
      },
      small: {
        label: "Watts-Strogatz",
        sub: "p ≈ 0,1 · C alto, L bajo",
        body: "Un puñado de atajos aleatorios. El clustering sobrevive; el diámetro se desploma. El punto dulce del small world.",
      },
      random: {
        label: "Grafo aleatorio",
        sub: "p = 1 · C bajo, L bajo",
        body: "Las aristas caen en cualquier sitio. Las longitudes de camino son diminutas, pero los triángulos locales han desaparecido — no queda estructura de comunidad.",
      },
    },
    caption:
      "Los mismos N = 24 nodos, la misma retícula anular de partida con k = 3 vecinos por lado. Solo cambia la probabilidad de recableado p. La imagen central es el régimen small world — los atajos (dibujados como cuerdas a través del círculo) acortan drásticamente la longitud media de camino mientras los triángulos locales, fuente del clustering, se conservan en su mayoría.",
  },
  fr: {
    finalLabel: "Rétrécis le monde.",
    figurePretitle: "Trois réseaux, trois régimes",
    figureTitle: "Réseau régulier · small world · aléatoire",
    panels: {
      lattice: {
        label: "Réseau régulier",
        sub: "p = 0 · C élevé, L élevé",
        body: "Chaque nœud est relié à ses voisins. Les amis des amis sont des amis. Pour atteindre l'autre côté de l'anneau, il faut de nombreux petits pas.",
      },
      small: {
        label: "Watts-Strogatz",
        sub: "p ≈ 0,1 · C élevé, L faible",
        body: "Une poignée de raccourcis aléatoires. Le clustering survit ; le diamètre s'effondre. Le sweet spot du small world.",
      },
      random: {
        label: "Graphe aléatoire",
        sub: "p = 1 · C faible, L faible",
        body: "Les arêtes atterrissent n'importe où. Les longueurs de chemin sont minuscules, mais les triangles locaux ont disparu — plus de structure de communauté.",
      },
    },
    caption:
      "Les mêmes N = 24 nœuds, le même réseau annulaire de départ avec k = 3 voisins par côté. Seule la probabilité de recâblage p change. L'image du milieu est le régime small world — les raccourcis (dessinés comme des cordes à travers le cercle) réduisent radicalement la longueur moyenne des chemins tandis que les triangles locaux, source du clustering, sont en grande partie préservés.",
  },
  it: {
    finalLabel: "Restringi il mondo.",
    figurePretitle: "Tre reti, tre regimi",
    figureTitle: "Reticolo · small world · casuale",
    panels: {
      lattice: {
        label: "Reticolo regolare",
        sub: "p = 0 · C alto, L alto",
        body: "Ogni nodo è legato ai suoi vicini. Gli amici degli amici sono amici. Per raggiungere l'altro lato dell'anello servono molti piccoli passi.",
      },
      small: {
        label: "Watts-Strogatz",
        sub: "p ≈ 0,1 · C alto, L basso",
        body: "Una manciata di scorciatoie casuali. Il clustering sopravvive; il diametro crolla. Il punto dolce dello small world.",
      },
      random: {
        label: "Grafo casuale",
        sub: "p = 1 · C basso, L basso",
        body: "Gli archi cadono ovunque. Le lunghezze dei cammini sono minuscole, ma i triangoli locali sono spariti — non resta alcuna struttura di comunità.",
      },
    },
    caption:
      "Gli stessi N = 24 nodi, lo stesso reticolo ad anello iniziale con k = 3 vicini per lato. Cambia solo la probabilità di ricablaggio p. L'immagine centrale è il regime small world — le scorciatoie (disegnate come corde attraverso il cerchio) riducono drasticamente la lunghezza media dei cammini mentre i triangoli locali, fonte del clustering, sono in gran parte preservati.",
  },
  pt: {
    finalLabel: "Encolha o mundo.",
    figurePretitle: "Três redes, três regimes",
    figureTitle: "Reticulado · small world · aleatório",
    panels: {
      lattice: {
        label: "Reticulado regular",
        sub: "p = 0 · C alto, L alto",
        body: "Cada nó está ligado aos seus vizinhos. Os amigos dos amigos são amigos. Para chegar ao outro lado do anel são precisos muitos passos curtos.",
      },
      small: {
        label: "Watts-Strogatz",
        sub: "p ≈ 0,1 · C alto, L baixo",
        body: "Um punhado de atalhos aleatórios. O clustering sobrevive; o diâmetro desaba. O ponto doce do small world.",
      },
      random: {
        label: "Grafo aleatório",
        sub: "p = 1 · C baixo, L baixo",
        body: "As arestas caem em qualquer lado. Os comprimentos dos caminhos são minúsculos, mas os triângulos locais desapareceram — não resta estrutura de comunidade.",
      },
    },
    caption:
      "Os mesmos N = 24 nós, o mesmo reticulado em anel inicial com k = 3 vizinhos por lado. Só muda a probabilidade de religação p. A imagem do meio é o regime small world — os atalhos (desenhados como cordas através do círculo) reduzem drasticamente o comprimento médio dos caminhos enquanto os triângulos locais, fonte do clustering, são em grande parte preservados.",
  },
  sv: {
    finalLabel: "Krymp världen.",
    figurePretitle: "Tre nätverk, tre regimer",
    figureTitle: "Gitter · small world · slump",
    panels: {
      lattice: {
        label: "Reguljärt gitter",
        sub: "p = 0 · högt C, högt L",
        body: "Varje nod är knuten till sina grannar. Vänners vänner är vänner. För att nå andra sidan av ringen krävs många små steg.",
      },
      small: {
        label: "Watts-Strogatz",
        sub: "p ≈ 0,1 · högt C, lågt L",
        body: "En handfull slumpmässiga genvägar. Clustering överlever; diametern kollapsar. Small world-zonens sweet spot.",
      },
      random: {
        label: "Slumpgraf",
        sub: "p = 1 · lågt C, lågt L",
        body: "Kanterna landar var som helst. Väglängderna är pyttesmå, men de lokala trianglarna är borta — ingen gemenskapsstruktur kvar.",
      },
    },
    caption:
      "Samma N = 24 noder, samma startringgitter med k = 3 grannar per sida. Endast omkopplingssannolikheten p ändras. Mittenbilden är small world-regimen — genvägar (ritade som kordor genom cirkeln) krymper den genomsnittliga väglängden dramatiskt medan de lokala trianglarna, källan till clustering, till stor del bevaras.",
  },
  no: {
    finalLabel: "Krymp verden.",
    figurePretitle: "Tre nettverk, tre regimer",
    figureTitle: "Gitter · small world · tilfeldig",
    panels: {
      lattice: {
        label: "Regulært gitter",
        sub: "p = 0 · høyt C, høyt L",
        body: "Hver node er knyttet til naboene sine. Venner av venner er venner. For å nå andre siden av ringen kreves mange små skritt.",
      },
      small: {
        label: "Watts-Strogatz",
        sub: "p ≈ 0,1 · høyt C, lavt L",
        body: "En håndfull tilfeldige snarveier. Clusteringen overlever; diameteren kollapser. Small world-sonens sweet spot.",
      },
      random: {
        label: "Tilfeldig graf",
        sub: "p = 1 · lavt C, lavt L",
        body: "Kantene lander hvor som helst. Sti-lengdene er bittesmå, men de lokale trekantene er borte — ingen fellesskapsstruktur igjen.",
      },
    },
    caption:
      "Samme N = 24 noder, samme start-ringgitter med k = 3 naboer per side. Bare omkoblingssannsynligheten p endres. Midtbildet er small world-regimet — snarveier (tegnet som korder gjennom sirkelen) krymper den gjennomsnittlige sti-lengden dramatisk mens de lokale trekantene, kilden til clustering, i stor grad bevares.",
  },
};

export default function SmallWorldStoryPage() {
  const { s, locale } = useI18n();
  const page = s.pages.smallworld;
  const [sec0, sec1, sec2, sec3] = page.sections;
  const f = FIGURES[locale];
  const panelOrder: PanelKey[] = ["lattice", "small", "random"];
  const panelP: Record<PanelKey, number> = { lattice: 0, small: 0.1, random: 1 };

  return (
    <StoryPageShell
      page={page}
      ctaHref="/smallworld/explorer"
      accent={ACCENT}
      borderAccent="border-signal-teal/70"
      bgAccent="bg-signal-teal/10"
      hoverAccent="hover:bg-signal-teal/20"
      gradient="from-signal-teal/10"
      formulaBadge="L ∝ log N,  C ≈ 0.7"
      formulaLatex={"L \\propto \\log N, \\quad C \\approx 0.7"}
      finalLabel={f.finalLabel}
    >
      <section className="mx-auto mt-16 max-w-5xl space-y-8">
        <StoryCard pretitle={sec0.pretitle} title={sec0.title} body={sec0.body} accent={ACCENT} />
        <StoryCard pretitle={sec1.pretitle} title={sec1.title} body={sec1.body} accent={ACCENT} />
        <StoryCard pretitle={sec2.pretitle} title={sec2.title} body={sec2.body} accent={ACCENT} />
        <StoryCard pretitle={sec3.pretitle} title={sec3.title} body={sec3.body} accent={ACCENT} />

        <Reveal>
          <figure className="glass hairline space-y-6 rounded-2xl border p-8 md:p-10">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {f.figurePretitle}
            </div>
            <h2 className="math-italic text-2xl leading-tight md:text-3xl">{f.figureTitle}</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {panelOrder.map((key) => {
                const card = f.panels[key];
                return (
                  <div
                    key={key}
                    className="hairline space-y-3 rounded-xl border bg-ink-950/60 p-4"
                  >
                    <div className="overflow-hidden rounded-md bg-ink-950">
                      {/* Seed is stable per panel slot so the three pictures stay
                          identical across locales (label length used to vary the
                          seed before — now we lock it to the panel key index). */}
                      <SmallNetworkSVG p={panelP[key]} seed={key.length + key.charCodeAt(0)} />
                    </div>
                    <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
                      {card.sub}
                    </div>
                    <div className="math-italic text-lg leading-tight text-ink-100">
                      {card.label}
                    </div>
                    <p className="text-sm leading-relaxed text-ink-200">{card.body}</p>
                  </div>
                );
              })}
            </div>
            <figcaption className="text-sm leading-relaxed text-ink-200">{f.caption}</figcaption>
          </figure>
        </Reveal>
      </section>
    </StoryPageShell>
  );
}

// Deterministic Watts-Strogatz mini-graph for the comparison panel. Pure SVG,
// no client state needed — the seed makes the rewiring reproducible across
// renders so the three pictures stay stable.
function SmallNetworkSVG({ p, seed }: { p: number; seed: number }) {
  const N = 24;
  const k = 3;
  const R = 70;
  const cx = 90;
  const cy = 90;

  // Tiny seeded RNG (mulberry32) — keeps the pictures stable.
  let s = (seed * 9301 + 49297) >>> 0;
  const rand = () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  // Position on the ring.
  const pos = (i: number): { x: number; y: number } => {
    const a = (i / N) * 2 * Math.PI - Math.PI / 2;
    return { x: cx + R * Math.cos(a), y: cy + R * Math.sin(a) };
  };

  // Build edges: for each node, k forward neighbours. Rewire with probability p.
  const edges: Array<{ a: number; b: number; rewired: boolean }> = [];
  for (let i = 0; i < N; i++) {
    for (let j = 1; j <= k; j++) {
      const orig = (i + j) % N;
      if (rand() < p) {
        // Pick a random target that isn't i itself and isn't already a neighbour.
        let target = Math.floor(rand() * N);
        let tries = 0;
        while (
          (target === i ||
            edges.some((e) => (e.a === i && e.b === target) || (e.a === target && e.b === i))) &&
          tries < 20
        ) {
          target = Math.floor(rand() * N);
          tries++;
        }
        edges.push({ a: i, b: target, rewired: true });
      } else {
        edges.push({ a: i, b: orig, rewired: false });
      }
    }
  }

  return (
    <svg viewBox="0 0 180 180" className="block h-auto w-full">
      {edges.map((e, idx) => {
        const A = pos(e.a);
        const B = pos(e.b);
        return (
          <line
            key={idx}
            x1={A.x}
            y1={A.y}
            x2={B.x}
            y2={B.y}
            stroke={e.rewired ? "#7df3ff" : "#8a90a4"}
            strokeOpacity={e.rewired ? 0.9 : 0.45}
            strokeWidth={e.rewired ? 1.2 : 0.7}
          />
        );
      })}
      {Array.from({ length: N }, (_, i) => {
        const P = pos(i);
        return <circle key={i} cx={P.x} cy={P.y} r={2.6} fill="#7df3ff" />;
      })}
    </svg>
  );
}
