"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { useDpr } from "@/lib/hooks/useDpr";
import { palette } from "@/lib/visual/palette";
import type { Locale } from "@/lib/i18n/types";

type Panel = "spiral" | "ratios" | "sunflower";

// Derive an rgba() string from a palette hex token so canvas/SVG colours stay
// in sync with the palette rather than restating the channel literals.
function withAlpha(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const PHI = (1 + Math.sqrt(5)) / 2;
const PHI_STR = "1.618033988749";
// Golden angle in radians ≈ 2.39996
const GOLDEN_ANGLE_RAD = Math.PI * (3 - Math.sqrt(5));
const GOLDEN_ANGLE_DEG = 360 / (PHI * PHI); // ≈ 137.507764...

// Precompute Fibonacci numbers up to a safe length.
const FIB: number[] = (() => {
  const out: number[] = [0, 1];
  for (let i = 2; i < 31; i++) out.push(out[i - 1] + out[i - 2]);
  return out;
})();

// --------------------------------------------------------------------------
// Explorer UI copy per locale. This room carries enough prose (panel labels,
// control captions, three explanatory paragraphs, status bar + canvas
// annotations) that it declares its own RICH_EXPLORER, mirroring the
// eulerchar/mobius explorers.
// --------------------------------------------------------------------------

type RichExplorer = {
  panels: { spiral: string; ratios: string; sunflower: string };
  panelHeading: string;
  status: {
    spiral: (depth: number, ratio: string) => string;
    ratios: (n: number) => string;
    sunflower: (alpha: string, seeds: number) => string;
  };
  spiral: { depthLabel: string; side: (s: number) => string; note: string };
  ratios: { termsLabel: string; note: string };
  sunflower: {
    angleLabel: string;
    snap: string;
    note: string;
    seedCountLabel: string;
    annotationGolden: string;
    annotationOff: (alpha: string, delta: string) => string;
    goldenAngleRad: (rad: string) => string;
  };
  constant: string;
  aria: { spiral: string; ratios: string; sunflower: string };
};

const RICH_EXPLORER: Record<Locale, RichExplorer> = {
  en: {
    panels: { spiral: "Spiral", ratios: "Ratios", sunflower: "Sunflower" },
    panelHeading: "Panel",
    status: {
      spiral: (d, r) => `Fibonacci squares · depth ${d} · golden rectangle ratio ${r}`,
      ratios: (n) => `Ratios Fₙ₊₁/Fₙ for n = 1 … ${n} · target φ ≈ ${PHI_STR}`,
      sunflower: (a, s) => `Vogel phyllotaxis · α = ${a}° · ${s} seeds`,
    },
    spiral: {
      depthLabel: "Depth · squares to show",
      side: (s) => `side ${s}`,
      note: "Each square's side is the next Fibonacci number; a quarter-circle inside each connects into the golden spiral. The outer rectangle's aspect ratio approaches φ.",
    },
    ratios: {
      termsLabel: "n · terms",
      note: "Each ratio sits above or below φ alternately and the gap shrinks by a factor of ψ² ≈ 0.382 each step.",
    },
    sunflower: {
      angleLabel: "Divergence angle α",
      snap: "Snap to φ angle (360°/φ²)",
      note: "At the golden angle (137.5078°) seeds pack without gaps or preferred direction. Nudge by even a hundredth of a degree and clear spiral arms appear.",
      seedCountLabel: "Seed count",
      annotationGolden: "α = golden angle (137.5078°), no spiral arms",
      annotationOff: (a, d) => `α = ${a}° (Δ ${d}°), spiral arms appear`,
      goldenAngleRad: (r) => `golden angle = π(3 − √5) ≈ ${r} rad`,
    },
    constant: "The constant",
    aria: {
      spiral: "Golden spiral built from nested Fibonacci squares",
      ratios: "Line chart of consecutive Fibonacci ratios approaching φ",
      sunflower: "Sunflower phyllotaxis with adjustable divergence angle",
    },
  },
  de: {
    panels: { spiral: "Spirale", ratios: "Verhältnisse", sunflower: "Sonnenblume" },
    panelHeading: "Ansicht",
    status: {
      spiral: (d, r) => `Fibonacci-Quadrate · Tiefe ${d} · Verhältnis des goldenen Rechtecks ${r}`,
      ratios: (n) => `Verhältnisse Fₙ₊₁/Fₙ für n = 1 … ${n} · Ziel φ ≈ ${PHI_STR}`,
      sunflower: (a, s) => `Vogel-Phyllotaxis · α = ${a}° · ${s} Samen`,
    },
    spiral: {
      depthLabel: "Tiefe · sichtbare Quadrate",
      side: (s) => `Seite ${s}`,
      note: "Die Seite jedes Quadrats ist die nächste Fibonacci-Zahl; ein Viertelkreis in jedem verbindet sich zur goldenen Spirale. Das Seitenverhältnis des äußeren Rechtecks nähert sich φ.",
    },
    ratios: {
      termsLabel: "n · Glieder",
      note: "Jedes Verhältnis liegt abwechselnd über oder unter φ, und der Abstand schrumpft pro Schritt um den Faktor ψ² ≈ 0,382.",
    },
    sunflower: {
      angleLabel: "Divergenzwinkel α",
      snap: "Auf φ-Winkel springen (360°/φ²)",
      note: "Beim goldenen Winkel (137,5078°) packen sich die Samen ohne Lücken oder Vorzugsrichtung. Schon eine hundertstel Grad daneben, und klare Spiralarme erscheinen.",
      seedCountLabel: "Samenanzahl",
      annotationGolden: "α = goldener Winkel (137,5078°), keine Spiralarme",
      annotationOff: (a, d) => `α = ${a}° (Δ ${d}°), Spiralarme erscheinen`,
      goldenAngleRad: (r) => `goldener Winkel = π(3 − √5) ≈ ${r} rad`,
    },
    constant: "Die Konstante",
    aria: {
      spiral: "Goldene Spirale aus verschachtelten Fibonacci-Quadraten",
      ratios: "Liniendiagramm aufeinanderfolgender Fibonacci-Verhältnisse, die sich φ nähern",
      sunflower: "Sonnenblumen-Phyllotaxis mit einstellbarem Divergenzwinkel",
    },
  },
  es: {
    panels: { spiral: "Espiral", ratios: "Razones", sunflower: "Girasol" },
    panelHeading: "Panel",
    status: {
      spiral: (d, r) => `Cuadrados de Fibonacci · profundidad ${d} · razón del rectángulo áureo ${r}`,
      ratios: (n) => `Razones Fₙ₊₁/Fₙ para n = 1 … ${n} · objetivo φ ≈ ${PHI_STR}`,
      sunflower: (a, s) => `Filotaxis de Vogel · α = ${a}° · ${s} semillas`,
    },
    spiral: {
      depthLabel: "Profundidad · cuadrados a mostrar",
      side: (s) => `lado ${s}`,
      note: "El lado de cada cuadrado es el siguiente número de Fibonacci; un cuarto de círculo en cada uno se une en la espiral áurea. La razón del rectángulo exterior se acerca a φ.",
    },
    ratios: {
      termsLabel: "n · términos",
      note: "Cada razón queda alternativamente por encima o por debajo de φ y la brecha se reduce por un factor ψ² ≈ 0,382 en cada paso.",
    },
    sunflower: {
      angleLabel: "Ángulo de divergencia α",
      snap: "Ir al ángulo φ (360°/φ²)",
      note: "En el ángulo áureo (137,5078°) las semillas se empaquetan sin huecos ni dirección preferida. Muévelo aunque sea una centésima de grado y aparecen brazos espirales claros.",
      seedCountLabel: "Número de semillas",
      annotationGolden: "α = ángulo áureo (137,5078°), sin brazos espirales",
      annotationOff: (a, d) => `α = ${a}° (Δ ${d}°), aparecen brazos espirales`,
      goldenAngleRad: (r) => `ángulo áureo = π(3 − √5) ≈ ${r} rad`,
    },
    constant: "La constante",
    aria: {
      spiral: "Espiral áurea construida con cuadrados de Fibonacci anidados",
      ratios: "Gráfico de líneas de razones de Fibonacci consecutivas acercándose a φ",
      sunflower: "Filotaxis de girasol con ángulo de divergencia ajustable",
    },
  },
  fr: {
    panels: { spiral: "Spirale", ratios: "Rapports", sunflower: "Tournesol" },
    panelHeading: "Panneau",
    status: {
      spiral: (d, r) => `Carrés de Fibonacci · profondeur ${d} · rapport du rectangle d'or ${r}`,
      ratios: (n) => `Rapports Fₙ₊₁/Fₙ pour n = 1 … ${n} · cible φ ≈ ${PHI_STR}`,
      sunflower: (a, s) => `Phyllotaxie de Vogel · α = ${a}° · ${s} graines`,
    },
    spiral: {
      depthLabel: "Profondeur · carrés à afficher",
      side: (s) => `côté ${s}`,
      note: "Le côté de chaque carré est le nombre de Fibonacci suivant ; un quart de cercle dans chacun se raccorde en la spirale d'or. Le rapport du rectangle extérieur tend vers φ.",
    },
    ratios: {
      termsLabel: "n · termes",
      note: "Chaque rapport se place alternativement au-dessus ou en dessous de φ et l'écart se réduit d'un facteur ψ² ≈ 0,382 à chaque pas.",
    },
    sunflower: {
      angleLabel: "Angle de divergence α",
      snap: "Aller à l'angle φ (360°/φ²)",
      note: "À l'angle d'or (137,5078°) les graines s'empilent sans vides ni direction privilégiée. Décale-le d'un centième de degré et des bras spiraux nets apparaissent.",
      seedCountLabel: "Nombre de graines",
      annotationGolden: "α = angle d'or (137,5078°), aucun bras spiral",
      annotationOff: (a, d) => `α = ${a}° (Δ ${d}°), des bras spiraux apparaissent`,
      goldenAngleRad: (r) => `angle d'or = π(3 − √5) ≈ ${r} rad`,
    },
    constant: "La constante",
    aria: {
      spiral: "Spirale d'or construite à partir de carrés de Fibonacci imbriqués",
      ratios: "Graphique des rapports de Fibonacci consécutifs se rapprochant de φ",
      sunflower: "Phyllotaxie de tournesol avec angle de divergence réglable",
    },
  },
  it: {
    panels: { spiral: "Spirale", ratios: "Rapporti", sunflower: "Girasole" },
    panelHeading: "Pannello",
    status: {
      spiral: (d, r) => `Quadrati di Fibonacci · profondità ${d} · rapporto del rettangolo aureo ${r}`,
      ratios: (n) => `Rapporti Fₙ₊₁/Fₙ per n = 1 … ${n} · obiettivo φ ≈ ${PHI_STR}`,
      sunflower: (a, s) => `Fillotassi di Vogel · α = ${a}° · ${s} semi`,
    },
    spiral: {
      depthLabel: "Profondità · quadrati da mostrare",
      side: (s) => `lato ${s}`,
      note: "Il lato di ogni quadrato è il numero di Fibonacci successivo; un quarto di cerchio in ciascuno si collega nella spirale aurea. Il rapporto del rettangolo esterno si avvicina a φ.",
    },
    ratios: {
      termsLabel: "n · termini",
      note: "Ogni rapporto sta alternativamente sopra o sotto φ e il divario si riduce di un fattore ψ² ≈ 0,382 a ogni passo.",
    },
    sunflower: {
      angleLabel: "Angolo di divergenza α",
      snap: "Vai all'angolo φ (360°/φ²)",
      note: "All'angolo aureo (137,5078°) i semi si impacchettano senza vuoti né direzione preferita. Spostalo anche di un centesimo di grado e compaiono bracci a spirale netti.",
      seedCountLabel: "Numero di semi",
      annotationGolden: "α = angolo aureo (137,5078°), nessun braccio a spirale",
      annotationOff: (a, d) => `α = ${a}° (Δ ${d}°), compaiono bracci a spirale`,
      goldenAngleRad: (r) => `angolo aureo = π(3 − √5) ≈ ${r} rad`,
    },
    constant: "La costante",
    aria: {
      spiral: "Spirale aurea costruita con quadrati di Fibonacci annidati",
      ratios: "Grafico a linee dei rapporti di Fibonacci consecutivi che si avvicinano a φ",
      sunflower: "Fillotassi del girasole con angolo di divergenza regolabile",
    },
  },
  pt: {
    panels: { spiral: "Espiral", ratios: "Razões", sunflower: "Girassol" },
    panelHeading: "Painel",
    status: {
      spiral: (d, r) => `Quadrados de Fibonacci · profundidade ${d} · razão do retângulo áureo ${r}`,
      ratios: (n) => `Razões Fₙ₊₁/Fₙ para n = 1 … ${n} · alvo φ ≈ ${PHI_STR}`,
      sunflower: (a, s) => `Filotaxia de Vogel · α = ${a}° · ${s} sementes`,
    },
    spiral: {
      depthLabel: "Profundidade · quadrados a mostrar",
      side: (s) => `lado ${s}`,
      note: "O lado de cada quadrado é o número de Fibonacci seguinte; um quarto de círculo em cada um liga-se na espiral áurea. A razão do retângulo exterior aproxima-se de φ.",
    },
    ratios: {
      termsLabel: "n · termos",
      note: "Cada razão fica alternadamente acima ou abaixo de φ e a diferença reduz-se por um fator ψ² ≈ 0,382 a cada passo.",
    },
    sunflower: {
      angleLabel: "Ângulo de divergência α",
      snap: "Ir para o ângulo φ (360°/φ²)",
      note: "No ângulo áureo (137,5078°) as sementes empacotam-se sem vazios nem direção preferida. Desloca-o mesmo um centésimo de grau e surgem braços espirais nítidos.",
      seedCountLabel: "Número de sementes",
      annotationGolden: "α = ângulo áureo (137,5078°), sem braços espirais",
      annotationOff: (a, d) => `α = ${a}° (Δ ${d}°), surgem braços espirais`,
      goldenAngleRad: (r) => `ângulo áureo = π(3 − √5) ≈ ${r} rad`,
    },
    constant: "A constante",
    aria: {
      spiral: "Espiral áurea construída com quadrados de Fibonacci aninhados",
      ratios: "Gráfico de linhas das razões de Fibonacci consecutivas a aproximarem-se de φ",
      sunflower: "Filotaxia de girassol com ângulo de divergência ajustável",
    },
  },
  sv: {
    panels: { spiral: "Spiral", ratios: "Kvoter", sunflower: "Solros" },
    panelHeading: "Panel",
    status: {
      spiral: (d, r) => `Fibonacci-kvadrater · djup ${d} · gyllene rektangelns förhållande ${r}`,
      ratios: (n) => `Kvoter Fₙ₊₁/Fₙ för n = 1 … ${n} · mål φ ≈ ${PHI_STR}`,
      sunflower: (a, s) => `Vogel-fyllotaxi · α = ${a}° · ${s} frön`,
    },
    spiral: {
      depthLabel: "Djup · kvadrater att visa",
      side: (s) => `sida ${s}`,
      note: "Varje kvadrats sida är nästa Fibonacci-tal; en fjärdedelscirkel i var och en fogas ihop till den gyllene spiralen. Den yttre rektangelns sidoförhållande närmar sig φ.",
    },
    ratios: {
      termsLabel: "n · termer",
      note: "Varje kvot ligger omväxlande över eller under φ och gapet krymper med en faktor ψ² ≈ 0,382 för varje steg.",
    },
    sunflower: {
      angleLabel: "Divergensvinkel α",
      snap: "Hoppa till φ-vinkeln (360°/φ²)",
      note: "Vid den gyllene vinkeln (137,5078°) packas fröna utan luckor eller föredragen riktning. Rubba den bara en hundradels grad så framträder tydliga spiralarmar.",
      seedCountLabel: "Antal frön",
      annotationGolden: "α = gyllene vinkeln (137,5078°), inga spiralarmar",
      annotationOff: (a, d) => `α = ${a}° (Δ ${d}°), spiralarmar framträder`,
      goldenAngleRad: (r) => `gyllene vinkeln = π(3 − √5) ≈ ${r} rad`,
    },
    constant: "Konstanten",
    aria: {
      spiral: "Gyllene spiral byggd av nästlade Fibonacci-kvadrater",
      ratios: "Linjediagram över på varandra följande Fibonacci-kvoter som närmar sig φ",
      sunflower: "Solrosens fyllotaxi med justerbar divergensvinkel",
    },
  },
  no: {
    panels: { spiral: "Spiral", ratios: "Forhold", sunflower: "Solsikke" },
    panelHeading: "Panel",
    status: {
      spiral: (d, r) => `Fibonacci-kvadrater · dybde ${d} · gyllen rektangels forhold ${r}`,
      ratios: (n) => `Forhold Fₙ₊₁/Fₙ for n = 1 … ${n} · mål φ ≈ ${PHI_STR}`,
      sunflower: (a, s) => `Vogel-fyllotaksi · α = ${a}° · ${s} frø`,
    },
    spiral: {
      depthLabel: "Dybde · kvadrater å vise",
      side: (s) => `side ${s}`,
      note: "Hver kvadrats side er det neste Fibonacci-tallet; en kvartsirkel i hver forbindes til den gylne spiralen. Det ytre rektangelets sideforhold nærmer seg φ.",
    },
    ratios: {
      termsLabel: "n · ledd",
      note: "Hvert forhold ligger vekselvis over eller under φ, og gapet krymper med en faktor ψ² ≈ 0,382 for hvert steg.",
    },
    sunflower: {
      angleLabel: "Divergensvinkel α",
      snap: "Hopp til φ-vinkelen (360°/φ²)",
      note: "Ved den gylne vinkelen (137,5078°) pakker frøene seg uten tomrom eller foretrukket retning. Flytt den bare et hundredels grad, og tydelige spiralarmer dukker opp.",
      seedCountLabel: "Antall frø",
      annotationGolden: "α = gylden vinkel (137,5078°), ingen spiralarmer",
      annotationOff: (a, d) => `α = ${a}° (Δ ${d}°), spiralarmer dukker opp`,
      goldenAngleRad: (r) => `gylden vinkel = π(3 − √5) ≈ ${r} rad`,
    },
    constant: "Konstanten",
    aria: {
      spiral: "Gylden spiral bygd av nøstede Fibonacci-kvadrater",
      ratios: "Linjediagram over påfølgende Fibonacci-forhold som nærmer seg φ",
      sunflower: "Solsikkens fyllotaksi med justerbar divergensvinkel",
    },
  },
};

export default function PhiExplorer() {
  const { a, u, locale } = useI18n();
  const topic = a.topics.phi;
  const t = RICH_EXPLORER[locale];

  const [panel, setPanel] = useState<Panel>("spiral");

  // Spiral controls
  const [spiralDepth, setSpiralDepth] = useState(10);

  // Ratios controls
  const [ratiosN, setRatiosN] = useState(12);

  // Sunflower controls
  const [angleDeg, setAngleDeg] = useState(GOLDEN_ANGLE_DEG);
  const [seedCount, setSeedCount] = useState(800);

  return (
    <main className="flex min-h-screen flex-col pt-14">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_420px]">
        <div className="relative flex min-h-[60vh] flex-col gap-4 bg-ink-950 p-4 lg:min-h-[calc(100vh-3.5rem)] lg:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-2">
              {(
                [
                  { key: "spiral", label: t.panels.spiral },
                  { key: "ratios", label: t.panels.ratios },
                  { key: "sunflower", label: t.panels.sunflower },
                ] as ReadonlyArray<{ key: Panel; label: string }>
              ).map((t) => (
                <button
                  key={t.key}
                  onClick={() => setPanel(t.key)}
                  className={`rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 transition-colors ${
                    panel === t.key
                      ? "border-signal-amber/60 bg-signal-amber/10 text-signal-amber"
                      : "hairline text-ink-300 hover:border-signal-amber/40 hover:text-ink-100"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
              φ = (1 + √5) / 2 ≈ {PHI_STR}
            </div>
          </div>

          <div className="hairline flex-1 overflow-hidden rounded-2xl border bg-ink-950">
            {panel === "spiral" && <SpiralPanel depth={spiralDepth} ariaLabel={t.aria.spiral} />}
            {panel === "ratios" && <RatiosPanel n={ratiosN} ariaLabel={t.aria.ratios} />}
            {panel === "sunflower" && (
              <SunflowerPanel
                angleDeg={angleDeg}
                count={seedCount}
                ariaLabel={t.aria.sunflower}
                annotationGolden={t.sunflower.annotationGolden}
                annotationOff={t.sunflower.annotationOff}
                goldenAngleRad={t.sunflower.goldenAngleRad}
              />
            )}
          </div>

          <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
            {panel === "spiral" &&
              t.status.spiral(spiralDepth, (FIB[spiralDepth + 1] / FIB[spiralDepth]).toFixed(8))}
            {panel === "ratios" && t.status.ratios(ratiosN)}
            {panel === "sunflower" && t.status.sunflower(angleDeg.toFixed(4), seedCount)}
          </div>
        </div>

        <aside className="hairline scrollbar-thin flex flex-col overflow-y-auto border-l bg-ink-900/40">
          <div className="hairline space-y-3 border-b p-6">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
              {topic.title}
            </div>
            <h1 className="math-italic text-3xl leading-tight text-ink-100">{topic.tagline}</h1>
            <p className="text-sm leading-relaxed text-ink-200">{topic.body}</p>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {t.panelHeading}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { key: "spiral", label: t.panels.spiral },
                  { key: "ratios", label: t.panels.ratios },
                  { key: "sunflower", label: t.panels.sunflower },
                ] as ReadonlyArray<{ key: Panel; label: string }>
              ).map((t) => (
                <button
                  key={t.key}
                  onClick={() => setPanel(t.key)}
                  className={`rounded-md border px-2 py-2 font-mono text-[10px] uppercase tracking-widest2 transition-colors ${
                    panel === t.key
                      ? "border-signal-amber/60 bg-signal-amber/10 text-signal-amber"
                      : "hairline text-ink-300 hover:border-signal-amber/40 hover:text-ink-100"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {panel === "spiral" && (
            <div className="hairline space-y-3 border-b p-5">
              <label
                htmlFor="phi-exp-depth"
                className="block font-mono text-[10px] uppercase tracking-widest2 text-ink-300"
              >
                {t.spiral.depthLabel}
              </label>
              <div className="flex items-center justify-between font-mono text-sm">
                <span className="text-signal-amber">{spiralDepth}</span>
                <span className="text-xs text-ink-400">{t.spiral.side(FIB[spiralDepth])}</span>
              </div>
              <input
                id="phi-exp-depth"
                type="range"
                value={spiralDepth}
                min={3}
                max={14}
                step={1}
                onChange={(e) => setSpiralDepth(parseInt(e.target.value))}
                className="w-full accent-signal-amber"
              />
              <p className="text-[11px] leading-relaxed text-ink-400">{t.spiral.note}</p>
            </div>
          )}

          {panel === "ratios" && (
            <div className="hairline space-y-3 border-b p-5">
              <label
                htmlFor="phi-exp-n"
                className="block font-mono text-[10px] uppercase tracking-widest2 text-ink-300"
              >
                {t.ratios.termsLabel}
              </label>
              <div className="flex items-center justify-between font-mono text-sm">
                <span className="text-signal-amber">{ratiosN}</span>
                <span className="text-xs text-ink-400">
                  F{ratiosN + 1}/F{ratiosN} = {(FIB[ratiosN + 1] / FIB[ratiosN]).toFixed(10)}
                </span>
              </div>
              <input
                id="phi-exp-n"
                type="range"
                value={ratiosN}
                min={2}
                max={20}
                step={1}
                onChange={(e) => setRatiosN(parseInt(e.target.value))}
                className="w-full accent-signal-amber"
              />
              <p className="text-[11px] leading-relaxed text-ink-400">{t.ratios.note}</p>
            </div>
          )}

          {panel === "sunflower" && (
            <>
              <div className="hairline space-y-3 border-b p-5">
                <label
                  htmlFor="phi-exp-angle"
                  className="block font-mono text-[10px] uppercase tracking-widest2 text-ink-300"
                >
                  {t.sunflower.angleLabel}
                </label>
                <div className="flex items-center justify-between font-mono text-sm">
                  <span className="text-signal-amber">{angleDeg.toFixed(4)}°</span>
                  <span className="text-xs text-ink-400">
                    Δ = {(angleDeg - GOLDEN_ANGLE_DEG).toFixed(4)}°
                  </span>
                </div>
                <input
                  id="phi-exp-angle"
                  type="range"
                  value={angleDeg}
                  min={137.4}
                  max={137.6}
                  step={0.0005}
                  onChange={(e) => setAngleDeg(parseFloat(e.target.value))}
                  className="w-full accent-signal-amber"
                />
                <button
                  onClick={() => setAngleDeg(GOLDEN_ANGLE_DEG)}
                  className="w-full rounded-md border border-signal-amber/40 bg-signal-amber/10 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-amber transition-colors hover:bg-signal-amber/20"
                >
                  {t.sunflower.snap}
                </button>
                <p className="text-[11px] leading-relaxed text-ink-400">{t.sunflower.note}</p>
              </div>

              <div className="hairline space-y-3 border-b p-5">
                <label
                  htmlFor="phi-exp-seeds"
                  className="block font-mono text-[10px] uppercase tracking-widest2 text-ink-300"
                >
                  {t.sunflower.seedCountLabel}
                </label>
                <div className="flex items-center justify-between font-mono text-sm">
                  <span className="text-signal-amber">{seedCount}</span>
                </div>
                <input
                  id="phi-exp-seeds"
                  type="range"
                  value={seedCount}
                  min={50}
                  max={2000}
                  step={10}
                  onChange={(e) => setSeedCount(parseInt(e.target.value))}
                  className="w-full accent-signal-amber"
                />
              </div>
            </>
          )}

          <div className="hairline space-y-2 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {t.constant}
            </div>
            <div className="hairline rounded-md border bg-ink-950/60 p-3 text-center font-mono text-base text-signal-amber">
              φ = {PHI_STR}
            </div>
            <div className="grid grid-cols-2 gap-2 font-mono text-[10px] text-ink-400">
              <div className="hairline rounded border px-2 py-1">1/φ = 0.618033988749</div>
              <div className="hairline rounded border px-2 py-1">φ² = 2.618033988749</div>
              <div className="hairline rounded border px-2 py-1">ψ = −0.618033988749</div>
              <div className="hairline rounded border px-2 py-1">360°/φ² = 137.5078°</div>
            </div>
          </div>

          <div className="p-5">
            <Link
              href="/"
              className="hairline block w-full rounded-md border py-2 text-center font-mono text-[10px] uppercase tracking-widest2 text-ink-300 transition-colors hover:border-signal-amber/40 hover:text-signal-amber"
            >
              {u.back}
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}

// ----------------------------------------------------------------------------
// Spiral panel — nested Fibonacci squares + quarter-arc spiral
// ----------------------------------------------------------------------------

// Build the canonical Fibonacci-squares spiral. Returns square boxes plus
// per-arc centre, radius, and start/end angles (canvas convention: angles in
// radians, going CW on screen because Y points down). Arcs chain endpoint-to-
// endpoint so a single ctx.arc loop draws one continuous in-spiralling curve.
//
// Construction (Y-down):
//   - Sides F_1, F_2, ..., F_n. First square at (0,0); each subsequent square
//     attaches to the current bounding rectangle in the cycle L, U, R, D and
//     spans the full side it attaches to.
//   - Per-square arc centre is the corner adjacent to BOTH the edge shared
//     with the previous square and the edge shared with the next; this is
//     what makes the chain tangent-continuous. Direction -> centre corner:
//     L -> TR, U -> BR, R -> BL, D -> TL.
//   - All arcs are swept clockwise on screen, so canvas-arc anticlockwise = false.
type Sq = { x: number; y: number; s: number };
type Arc = { cx: number; cy: number; sx: number; sy: number; ex: number; ey: number; r: number };

function adjCorners(sq: Sq, c: [number, number]): [[number, number], [number, number]] {
  const x0 = sq.x;
  const y0 = sq.y;
  const x1 = sq.x + sq.s;
  const y1 = sq.y + sq.s;
  const [cx, cy] = c;
  if (cx === x0 && cy === y0) return [[x1, y0], [x0, y1]];
  if (cx === x1 && cy === y0) return [[x0, y0], [x1, y1]];
  if (cx === x1 && cy === y1) return [[x1, y0], [x0, y1]];
  if (cx === x0 && cy === y1) return [[x0, y0], [x1, y1]];
  return [[x0, y0], [x1, y1]];
}

function buildFibSpiral(n: number): { squares: Sq[]; arcs: Arc[]; bx: number; by: number; bw: number; bh: number } {
  const sizes: number[] = [];
  for (let i = 1; i <= n; i++) sizes.push(FIB[i]);

  const squares: Sq[] = [{ x: 0, y: 0, s: sizes[0] }];
  const dirs = ["L", "U", "R", "D"] as const;
  let bx = 0;
  let by = 0;
  let bw = sizes[0];
  let bh = sizes[0];
  for (let i = 1; i < n; i++) {
    const s = sizes[i];
    const d = dirs[(i - 1) % 4];
    let nx = 0;
    let ny = 0;
    if (d === "L") {
      nx = bx - s;
      ny = by;
    } else if (d === "U") {
      nx = bx;
      ny = by - s;
    } else if (d === "R") {
      nx = bx + bw;
      ny = by;
    } else {
      nx = bx;
      ny = by + bh;
    }
    squares.push({ x: nx, y: ny, s });
    const mnx = Math.min(bx, nx);
    const mny = Math.min(by, ny);
    const mxx = Math.max(bx + bw, nx + s);
    const mxy = Math.max(by + bh, ny + s);
    bx = mnx;
    by = mny;
    bw = mxx - mnx;
    bh = mxy - mny;
  }

  const centres: Array<[number, number]> = new Array(n);
  for (let i = 1; i < n; i++) {
    const sq = squares[i];
    const d = dirs[(i - 1) % 4];
    if (d === "L") centres[i] = [sq.x + sq.s, sq.y];
    else if (d === "U") centres[i] = [sq.x + sq.s, sq.y + sq.s];
    else if (d === "R") centres[i] = [sq.x, sq.y + sq.s];
    else centres[i] = [sq.x, sq.y];
  }

  const sq0 = squares[0];
  if (n >= 2) {
    const sq1 = squares[1];
    const corners0: Array<[number, number]> = [
      [sq0.x, sq0.y],
      [sq0.x + sq0.s, sq0.y],
      [sq0.x + sq0.s, sq0.y + sq0.s],
      [sq0.x, sq0.y + sq0.s],
    ];
    const isCornerOfSq1 = (p: [number, number]) =>
      (p[0] === sq1.x || p[0] === sq1.x + sq1.s) && (p[1] === sq1.y || p[1] === sq1.y + sq1.s);
    const isCornerOfSq0 = (p: [number, number]) =>
      (p[0] === sq0.x || p[0] === sq0.x + sq0.s) && (p[1] === sq0.y || p[1] === sq0.y + sq0.s);
    const adj1 = adjCorners(sq1, centres[1]);
    const connecting = isCornerOfSq0(adj1[0]) ? adj1[0] : adj1[1];
    const shared = corners0.filter(isCornerOfSq1);
    centres[0] =
      shared.find((p) => p[0] !== connecting[0] || p[1] !== connecting[1]) ??
      shared[0] ??
      [sq0.x, sq0.y];
  } else {
    centres[0] = [sq0.x, sq0.y];
  }

  const arcs: Arc[] = squares.map((sq, i) => {
    const c = centres[i];
    const [p, q] = adjCorners(sq, c);
    return { cx: c[0], cy: c[1], sx: p[0], sy: p[1], ex: q[0], ey: q[1], r: sq.s };
  });
  for (let i = 0; i < n - 1; i++) {
    const cur = arcs[i];
    const nxt = arcs[i + 1];
    const eq = (ax: number, ay: number, bx2: number, by2: number) => ax === bx2 && ay === by2;
    const sharedIsCurEnd =
      eq(cur.ex, cur.ey, nxt.sx, nxt.sy) || eq(cur.ex, cur.ey, nxt.ex, nxt.ey);
    if (!sharedIsCurEnd) {
      const tx = cur.sx;
      const ty = cur.sy;
      cur.sx = cur.ex;
      cur.sy = cur.ey;
      cur.ex = tx;
      cur.ey = ty;
    }
    if (!eq(nxt.sx, nxt.sy, cur.ex, cur.ey)) {
      const tx = nxt.sx;
      const ty = nxt.sy;
      nxt.sx = nxt.ex;
      nxt.sy = nxt.ey;
      nxt.ex = tx;
      nxt.ey = ty;
    }
  }

  return { squares, arcs, bx, by, bw, bh };
}

function SpiralPanel({ depth, ariaLabel }: { depth: number; ariaLabel: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dpr = useDpr();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const render = () => {
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = palette.canvas.bg;
      ctx.fillRect(0, 0, W, H);

      const spiral = buildFibSpiral(depth);
      const { squares, arcs, bx, by, bw, bh } = spiral;

      const pad = 30;
      const scale = Math.min((W - 2 * pad) / bw, (H - 2 * pad) / bh);
      const ox = (W - bw * scale) / 2 - bx * scale;
      const oy = (H - bh * scale) / 2 - by * scale;

      const tx = (x: number) => ox + x * scale;
      const ty = (y: number) => oy + y * scale;

      // Outer golden rectangle
      ctx.strokeStyle = withAlpha(palette.signal.amber, 0.35);
      ctx.lineWidth = 1.4;
      ctx.strokeRect(tx(bx), ty(by), bw * scale, bh * scale);

      // Squares
      ctx.font = "11px ui-monospace, monospace";
      for (let i = 0; i < squares.length; i++) {
        const r = squares[i];
        const alpha = 0.18 + (i / squares.length) * 0.35;
        ctx.strokeStyle = withAlpha(palette.signal.amber, alpha);
        ctx.fillStyle = withAlpha(palette.signal.amber, 0.04 + (i / squares.length) * 0.08);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.rect(tx(r.x), ty(r.y), r.s * scale, r.s * scale);
        ctx.fill();
        ctx.stroke();
        if (r.s * scale > 28) {
          ctx.fillStyle = "rgba(255, 232, 170, 0.85)";
          ctx.fillText(String(r.s), tx(r.x) + 6, ty(r.y) + 14);
        }
      }

      // Quarter-circle spiral - one continuous chained path. moveTo to the
      // first start, then ctx.arc per square (each arc starts exactly where
      // the previous ended, so no spurious straight lines).
      ctx.strokeStyle = withAlpha(palette.signal.rose, 0.95);
      ctx.lineWidth = 2;
      ctx.beginPath();
      if (arcs.length > 0) {
        const a0 = arcs[0];
        ctx.moveTo(tx(a0.sx), ty(a0.sy));
        for (const a of arcs) {
          const startAngle = Math.atan2(a.sy - a.cy, a.sx - a.cx);
          const endAngle = startAngle + Math.PI / 2; // CW on screen = +angle in canvas (Y-down)
          ctx.arc(tx(a.cx), ty(a.cy), a.r * scale, startAngle, endAngle, false);
        }
      }
      ctx.stroke();
    };

    render();
    const ro = new ResizeObserver(render);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [depth, dpr]);

  return <canvas ref={canvasRef} role="img" aria-label={ariaLabel} className="block h-full w-full" />;
}

// ----------------------------------------------------------------------------
// Ratios panel — line chart of F_{n+1}/F_n approaching φ
// ----------------------------------------------------------------------------

function RatiosPanel({ n, ariaLabel }: { n: number; ariaLabel: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dpr = useDpr();
  const ratios = useMemo(() => {
    const out: number[] = [];
    for (let i = 1; i <= n; i++) out.push(FIB[i + 1] / FIB[i]);
    return out;
  }, [n]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const render = () => {
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = palette.canvas.bg;
      ctx.fillRect(0, 0, W, H);

      const padL = 60;
      const padR = 20;
      const padT = 30;
      const padB = 40;
      const innerW = W - padL - padR;
      const innerH = H - padT - padB;

      // y range: 1.0 .. 2.5
      const yMin = 1.0;
      const yMax = 2.5;
      const xOf = (i: number) =>
        padL + (ratios.length <= 1 ? innerW / 2 : (i / (ratios.length - 1)) * innerW);
      const yOf = (v: number) => padT + (1 - (v - yMin) / (yMax - yMin)) * innerH;

      // Grid + y labels
      ctx.strokeStyle = withAlpha(palette.canvas.muted, 0.1);
      ctx.lineWidth = 1;
      ctx.font = "10px ui-monospace, monospace";
      ctx.fillStyle = "rgba(180,188,210,0.6)";
      for (let i = 0; i <= 6; i++) {
        const v = yMin + (i / 6) * (yMax - yMin);
        const y = yOf(v);
        ctx.beginPath();
        ctx.moveTo(padL, y);
        ctx.lineTo(W - padR, y);
        ctx.stroke();
        ctx.fillText(v.toFixed(2), 8, y + 3);
      }

      // φ line
      ctx.strokeStyle = withAlpha(palette.signal.cyan, 0.7);
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(padL, yOf(PHI));
      ctx.lineTo(W - padR, yOf(PHI));
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = palette.signal.cyan;
      ctx.fillText(`φ ≈ ${PHI_STR}`, W - padR - 130, yOf(PHI) - 6);

      // Line of ratios
      ctx.strokeStyle = withAlpha(palette.signal.amber, 0.85);
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      for (let i = 0; i < ratios.length; i++) {
        const px = xOf(i);
        const py = yOf(ratios[i]);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Points + last-point highlight
      for (let i = 0; i < ratios.length; i++) {
        const px = xOf(i);
        const py = yOf(ratios[i]);
        const isLast = i === ratios.length - 1;
        ctx.fillStyle = isLast ? palette.signal.amber : withAlpha(palette.signal.amber, 0.6);
        ctx.beginPath();
        ctx.arc(px, py, isLast ? 4 : 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // x-axis labels (sparse)
      ctx.fillStyle = "rgba(180,188,210,0.6)";
      const step = Math.max(1, Math.ceil(ratios.length / 10));
      for (let i = 0; i < ratios.length; i += step) {
        const px = xOf(i);
        ctx.fillText(String(i + 1), px - 6, H - 18);
      }
      ctx.fillStyle = "rgba(180,188,210,0.8)";
      ctx.fillText("n", padL + innerW / 2, H - 4);

      // Last value annotation
      if (ratios.length > 0) {
        const last = ratios[ratios.length - 1];
        const lx = xOf(ratios.length - 1);
        const ly = yOf(last);
        ctx.fillStyle = palette.signal.amber;
        ctx.fillText(
          `F${ratios.length + 1}/F${ratios.length} = ${last.toFixed(10)}`,
          lx - 200,
          ly - 10,
        );
      }
    };

    render();
    const ro = new ResizeObserver(render);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [ratios, dpr]);

  return <canvas ref={canvasRef} role="img" aria-label={ariaLabel} className="block h-full w-full" />;
}

// ----------------------------------------------------------------------------
// Sunflower panel — Vogel phyllotaxis
// ----------------------------------------------------------------------------

function SunflowerPanel({
  angleDeg,
  count,
  ariaLabel,
  annotationGolden,
  annotationOff,
  goldenAngleRad,
}: {
  angleDeg: number;
  count: number;
  ariaLabel: string;
  annotationGolden: string;
  annotationOff: (alpha: string, delta: string) => string;
  goldenAngleRad: (rad: string) => string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dpr = useDpr();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const render = () => {
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = palette.canvas.bg;
      ctx.fillRect(0, 0, W, H);

      const cx = W / 2;
      const cy = H / 2;
      const R = Math.min(W, H) / 2 - 20;
      const c = R / Math.sqrt(count);
      const alpha = (angleDeg * Math.PI) / 180;

      // Subtle disc backdrop
      ctx.strokeStyle = withAlpha(palette.canvas.muted, 0.15);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.stroke();

      const isGolden = Math.abs(angleDeg - GOLDEN_ANGLE_DEG) < 0.0005;

      for (let n = 1; n <= count; n++) {
        const r = c * Math.sqrt(n);
        const theta = n * alpha;
        const x = cx + r * Math.cos(theta);
        const y = cy + r * Math.sin(theta);
        const t = n / count;
        // Amber-pink gradient outward
        const red = 255;
        const green = Math.round(209 - 60 * t);
        const blue = Math.round(102 + 80 * t);
        ctx.fillStyle = `rgba(${red},${green},${blue},0.85)`;
        const size = Math.max(1.2, c * 0.45);
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Status badge top-left
      ctx.font = "11px ui-monospace, monospace";
      ctx.fillStyle = isGolden ? palette.signal.amber : "rgba(180,188,210,0.8)";
      ctx.fillText(
        isGolden
          ? annotationGolden
          : annotationOff(
              angleDeg.toFixed(4),
              (angleDeg - GOLDEN_ANGLE_DEG).toFixed(4),
            ),
        14,
        20,
      );

      // Reference: also annotate golden angle in radians
      ctx.fillStyle = "rgba(180,188,210,0.6)";
      ctx.fillText(goldenAngleRad(GOLDEN_ANGLE_RAD.toFixed(6)), 14, H - 12);
    };

    render();
    const ro = new ResizeObserver(render);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [angleDeg, count, dpr, annotationGolden, annotationOff, goldenAngleRad]);

  return <canvas ref={canvasRef} role="img" aria-label={ariaLabel} className="block h-full w-full" />;
}
