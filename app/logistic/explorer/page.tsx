"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { useDpr } from "@/lib/hooks/useDpr";
import { palette } from "@/lib/visual/palette";
import type { Locale } from "@/lib/i18n/types";

// Fixed r values for the preset buttons. The human-readable labels live in
// RICH_EXPLORER (per-locale, index-aligned with this array).
const FAMOUS_R = [2.5, 3.0, 3.45, 3.56995, 3.7, 3.8284, 3.9, 4.0];

// Locale-aware room copy. The story page explicitly points visitors at this
// side panel, so its labels must not be hardcoded English.
type RichExplorer = {
  famous: string[]; // index-aligned with FAMOUS_R
  bifurcationDiagram: string;
  timeSeries: (show: number, burn: number) => string;
  growthRate: string;
  startingPoint: string;
  burnIn: string;
  show: string;
  iterUnit: string;
  ariaBifCanvas: string;
  ariaTimeSeriesCanvas: string;
};

const RICH_EXPLORER: Record<Locale, RichExplorer> = {
  en: {
    famous: [
      "Calm fixed point",
      "First bifurcation",
      "4-cycle",
      "Onset of chaos",
      "Deep chaos",
      "Period-3 window",
      "Chaos again",
      "Full chaos",
    ],
    bifurcationDiagram: "Bifurcation diagram",
    timeSeries: (show, burn) => `Time series · last ${show} iterations (after ${burn} burn-in)`,
    growthRate: "Growth rate r",
    startingPoint: "x₀ · starting point",
    burnIn: "Burn-in",
    show: "Show",
    iterUnit: "iter",
    ariaBifCanvas: "Bifurcation diagram of the logistic map, r from 2.5 to 4",
    ariaTimeSeriesCanvas: "Time series of the logistic map orbit",
  },
  de: {
    famous: [
      "Ruhiger Fixpunkt",
      "Erste Bifurkation",
      "4-Zyklus",
      "Beginn des Chaos",
      "Tiefes Chaos",
      "Periode-3-Fenster",
      "Wieder Chaos",
      "Volles Chaos",
    ],
    bifurcationDiagram: "Bifurkationsdiagramm",
    timeSeries: (show, burn) =>
      `Zeitreihe · letzte ${show} Iterationen (nach ${burn} Einschwingen)`,
    growthRate: "Wachstumsrate r",
    startingPoint: "x₀ · Startpunkt",
    burnIn: "Einschwingen",
    show: "Anzeigen",
    iterUnit: "Iter.",
    ariaBifCanvas: "Bifurkationsdiagramm der logistischen Abbildung, r von 2,5 bis 4",
    ariaTimeSeriesCanvas: "Zeitreihe der Bahn der logistischen Abbildung",
  },
  es: {
    famous: [
      "Punto fijo tranquilo",
      "Primera bifurcación",
      "4-ciclo",
      "Inicio del caos",
      "Caos profundo",
      "Ventana de periodo 3",
      "Caos de nuevo",
      "Caos pleno",
    ],
    bifurcationDiagram: "Diagrama de bifurcación",
    timeSeries: (show, burn) =>
      `Serie temporal · últimas ${show} iteraciones (tras ${burn} de calentamiento)`,
    growthRate: "Tasa de crecimiento r",
    startingPoint: "x₀ · punto inicial",
    burnIn: "Calentamiento",
    show: "Mostrar",
    iterUnit: "iter",
    ariaBifCanvas: "Diagrama de bifurcación de la aplicación logística, r de 2,5 a 4",
    ariaTimeSeriesCanvas: "Serie temporal de la órbita de la aplicación logística",
  },
  fr: {
    famous: [
      "Point fixe calme",
      "Première bifurcation",
      "4-cycle",
      "Début du chaos",
      "Chaos profond",
      "Fenêtre de période 3",
      "À nouveau le chaos",
      "Chaos complet",
    ],
    bifurcationDiagram: "Diagramme de bifurcation",
    timeSeries: (show, burn) =>
      `Série temporelle · ${show} dernières itérations (après ${burn} de rodage)`,
    growthRate: "Taux de croissance r",
    startingPoint: "x₀ · point de départ",
    burnIn: "Rodage",
    show: "Afficher",
    iterUnit: "itér.",
    ariaBifCanvas: "Diagramme de bifurcation de l'application logistique, r de 2,5 à 4",
    ariaTimeSeriesCanvas: "Série temporelle de l'orbite de l'application logistique",
  },
  it: {
    famous: [
      "Punto fisso calmo",
      "Prima biforcazione",
      "4-ciclo",
      "Inizio del caos",
      "Caos profondo",
      "Finestra di periodo 3",
      "Di nuovo caos",
      "Caos pieno",
    ],
    bifurcationDiagram: "Diagramma di biforcazione",
    timeSeries: (show, burn) =>
      `Serie temporale · ultime ${show} iterazioni (dopo ${burn} di assestamento)`,
    growthRate: "Tasso di crescita r",
    startingPoint: "x₀ · punto iniziale",
    burnIn: "Assestamento",
    show: "Mostra",
    iterUnit: "iter",
    ariaBifCanvas: "Diagramma di biforcazione della mappa logistica, r da 2,5 a 4",
    ariaTimeSeriesCanvas: "Serie temporale dell'orbita della mappa logistica",
  },
  pt: {
    famous: [
      "Ponto fixo calmo",
      "Primeira bifurcação",
      "4-ciclo",
      "Início do caos",
      "Caos profundo",
      "Janela de período 3",
      "Caos de novo",
      "Caos pleno",
    ],
    bifurcationDiagram: "Diagrama de bifurcação",
    timeSeries: (show, burn) =>
      `Série temporal · últimas ${show} iterações (após ${burn} de aquecimento)`,
    growthRate: "Taxa de crescimento r",
    startingPoint: "x₀ · ponto inicial",
    burnIn: "Aquecimento",
    show: "Mostrar",
    iterUnit: "iter",
    ariaBifCanvas: "Diagrama de bifurcação da aplicação logística, r de 2,5 a 4",
    ariaTimeSeriesCanvas: "Série temporal da órbita da aplicação logística",
  },
  sv: {
    famous: [
      "Lugn fixpunkt",
      "Första bifurkationen",
      "4-cykel",
      "Kaoset börjar",
      "Djupt kaos",
      "Period-3-fönster",
      "Kaos igen",
      "Fullt kaos",
    ],
    bifurcationDiagram: "Bifurkationsdiagram",
    timeSeries: (show, burn) =>
      `Tidsserie · senaste ${show} iterationerna (efter ${burn} inkörning)`,
    growthRate: "Tillväxttakt r",
    startingPoint: "x₀ · startpunkt",
    burnIn: "Inkörning",
    show: "Visa",
    iterUnit: "iter",
    ariaBifCanvas: "Bifurkationsdiagram för den logistiska avbildningen, r från 2,5 till 4",
    ariaTimeSeriesCanvas: "Tidsserie för den logistiska avbildningens bana",
  },
  no: {
    famous: [
      "Rolig fastpunkt",
      "Første bifurkasjon",
      "4-syklus",
      "Kaos starter",
      "Dypt kaos",
      "Periode-3-vindu",
      "Kaos igjen",
      "Fullt kaos",
    ],
    bifurcationDiagram: "Bifurkasjonsdiagram",
    timeSeries: (show, burn) =>
      `Tidsserie · siste ${show} iterasjoner (etter ${burn} innkjøring)`,
    growthRate: "Vekstrate r",
    startingPoint: "x₀ · startpunkt",
    burnIn: "Innkjøring",
    show: "Vis",
    iterUnit: "iter",
    ariaBifCanvas: "Bifurkasjonsdiagram for den logistiske avbildningen, r fra 2,5 til 4",
    ariaTimeSeriesCanvas: "Tidsserie for banen til den logistiske avbildningen",
  },
};

const BIFURCATION_R_MIN = 2.5;
const BIFURCATION_R_MAX = 4.0;

export default function LogisticExplorer() {
  const { a, u, locale } = useI18n();
  const topic = a.topics.logistic;
  const ex = RICH_EXPLORER[locale];
  const bifurcationRef = useRef<HTMLCanvasElement | null>(null);
  const timeSeriesRef = useRef<HTMLCanvasElement | null>(null);
  const dpr = useDpr();
  const dprRef = useRef(dpr);
  dprRef.current = dpr;

  // Cache the heavy bifurcation render so we can redraw it under the cursor
  // without recomputing 350 k iterations on every r-slider tick.
  const bifCacheRef = useRef<ImageData | null>(null);
  const bifSizeRef = useRef<{ w: number; h: number; dpr: number }>({ w: 0, h: 0, dpr: 1 });
  const [bifReady, setBifReady] = useState(0); // bump after each re-cache to retrigger cursor draw

  const [r, setR] = useState(3.7);
  const [x0, setX0] = useState(0.2);
  const [skipIter, setSkipIter] = useState(200);
  const [showCount, setShowCount] = useState(200);

  // Heavy render: depends only on mount + canvas size, NOT on r.
  useEffect(() => {
    const canvas = bifurcationRef.current;
    if (!canvas) return;

    const renderHeavy = () => {
      const dpr = dprRef.current;
      const cssW = canvas.clientWidth;
      const cssH = canvas.clientHeight;
      if (cssW === 0 || cssH === 0) return;
      const W = Math.floor(cssW * dpr);
      const H = Math.floor(cssH * dpr);
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = palette.canvas.bg;
      ctx.fillRect(0, 0, W, H);

      const NR = 700;
      const skip = 300;
      const drawN = 200;
      const dot = Math.max(1, Math.round(dpr));
      ctx.fillStyle = "rgba(255, 122, 182, 0.55)";
      for (let i = 0; i <= NR; i++) {
        const rr = BIFURCATION_R_MIN + (i / NR) * (BIFURCATION_R_MAX - BIFURCATION_R_MIN);
        let x = 0.5;
        for (let k = 0; k < skip; k++) x = rr * x * (1 - x);
        for (let k = 0; k < drawN; k++) {
          x = rr * x * (1 - x);
          const px = (i / NR) * W;
          const py = (1 - x) * H;
          ctx.fillRect(px, py, dot, dot);
        }
      }

      bifCacheRef.current = ctx.getImageData(0, 0, W, H);
      bifSizeRef.current = { w: W, h: H, dpr };
      setBifReady((n) => n + 1);
    };

    renderHeavy();
    const ro = new ResizeObserver(renderHeavy);
    ro.observe(canvas);
    return () => ro.disconnect();
    // dpr is a dependency so the backing store re-renders at full resolution
    // when the window moves to a screen with a different devicePixelRatio.
  }, [dpr]);

  // Light render: cursor only, cheap, runs on every r change.
  useEffect(() => {
    const canvas = bifurcationRef.current;
    const cache = bifCacheRef.current;
    if (!canvas || !cache) return;
    const { w: W, h: H, dpr } = bifSizeRef.current;
    if (W === 0 || H === 0) return;
    const ctx = canvas.getContext("2d")!;
    ctx.putImageData(cache, 0, 0);

    const rx = ((r - BIFURCATION_R_MIN) / (BIFURCATION_R_MAX - BIFURCATION_R_MIN)) * W;
    ctx.strokeStyle = "rgba(125, 243, 255, 0.8)";
    ctx.lineWidth = 1.4 * dpr;
    ctx.beginPath();
    ctx.moveTo(rx, 0);
    ctx.lineTo(rx, H);
    ctx.stroke();
    ctx.fillStyle = palette.signal.cyan;
    ctx.font = `${11 * dpr}px ui-monospace, monospace`;
    ctx.fillText(`r = ${r.toFixed(4)}`, rx + 6 * dpr, 14 * dpr);
  }, [r, bifReady]);

  // Render time series
  useEffect(() => {
    const canvas = timeSeriesRef.current;
    if (!canvas) return;
    const dpr = dprRef.current;

    const render = () => {
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      const ctx = canvas.getContext("2d")!;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = palette.canvas.bg;
      ctx.fillRect(0, 0, W, H);

      // Grid
      ctx.strokeStyle = "rgba(138,144,164,0.1)";
      ctx.lineWidth = 1;
      for (let i = 0; i <= 4; i++) {
        const y = (i / 4) * H;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      let x = x0;
      for (let k = 0; k < skipIter; k++) x = r * x * (1 - x);

      // Plot trajectory
      ctx.strokeStyle = "rgba(255, 209, 102, 0.65)";
      ctx.fillStyle = palette.signal.amber;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      for (let k = 0; k <= showCount; k++) {
        const px = (k / showCount) * W;
        const py = (1 - x) * H;
        if (k === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
        x = r * x * (1 - x);
      }
      ctx.stroke();

      // Dots
      x = x0;
      for (let k = 0; k < skipIter; k++) x = r * x * (1 - x);
      for (let k = 0; k <= showCount; k++) {
        const px = (k / showCount) * W;
        const py = (1 - x) * H;
        ctx.beginPath();
        ctx.arc(px, py, 1.6, 0, Math.PI * 2);
        ctx.fill();
        x = r * x * (1 - x);
      }
    };

    render();
    const ro = new ResizeObserver(render);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [r, x0, skipIter, showCount, dpr]);

  return (
    <main className="flex min-h-screen flex-col pt-14">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_420px]">
        <div className="relative flex min-h-[60vh] flex-col gap-4 bg-ink-950 p-4 lg:min-h-[calc(100vh-3.5rem)] lg:p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              {ex.bifurcationDiagram} · r ∈ [{BIFURCATION_R_MIN}, {BIFURCATION_R_MAX}]
            </div>
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-coral">
              xₙ₊₁ = r · xₙ (1 − xₙ)
            </div>
          </div>
          <div className="hairline flex-1 overflow-hidden rounded-2xl border bg-ink-950">
            <canvas
              ref={bifurcationRef}
              role="img"
              aria-label={ex.ariaBifCanvas}
              className="block h-full w-full"
            />
          </div>
          <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
            {ex.timeSeries(showCount, skipIter)}
          </div>
          <div className="hairline h-44 overflow-hidden rounded-2xl border bg-ink-950">
            <canvas
              ref={timeSeriesRef}
              role="img"
              aria-label={ex.ariaTimeSeriesCanvas}
              className="block h-full w-full"
            />
          </div>
        </div>

        <aside className="hairline scrollbar-thin flex flex-col overflow-y-auto border-l bg-ink-900/40">
          <div className="hairline space-y-3 border-b p-6">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-coral">
              {topic.title}
            </div>
            <h1 className="math-italic text-3xl leading-tight text-ink-100">{topic.tagline}</h1>
            <p className="text-sm leading-relaxed text-ink-200">{topic.body}</p>
          </div>

          <div className="hairline space-y-4 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {ex.growthRate}
            </div>
            <div className="flex items-center justify-between font-mono text-sm">
              <span className="text-signal-coral">{r.toFixed(4)}</span>
            </div>
            <input
              type="range"
              aria-label={ex.growthRate}
              value={r}
              min={2.5}
              max={4.0}
              step={0.0005}
              onChange={(e) => setR(parseFloat(e.target.value))}
              className="w-full accent-signal-coral"
            />
            <div className="grid grid-cols-2 gap-2">
              {FAMOUS_R.map((pr, i) => (
                <button
                  key={pr}
                  onClick={() => setR(pr)}
                  className={`rounded-md border px-3 py-2 text-left transition-colors ${
                    Math.abs(r - pr) < 0.001
                      ? "border-signal-coral/60 bg-signal-coral/10 text-signal-coral"
                      : "hairline text-ink-200 hover:border-signal-coral/40 hover:text-ink-100"
                  }`}
                >
                  <div className="font-mono text-xs">{pr}</div>
                  <div className="mt-0.5 font-mono text-[10px] text-ink-400">{ex.famous[i]}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {ex.startingPoint}
            </div>
            <div className="flex items-center justify-between font-mono text-sm">
              <span className="text-signal-amber">{x0.toFixed(3)}</span>
            </div>
            <input
              type="range"
              aria-label={ex.startingPoint}
              value={x0}
              min={0.001}
              max={0.999}
              step={0.001}
              onChange={(e) => setX0(parseFloat(e.target.value))}
              className="w-full accent-signal-amber"
            />
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {ex.burnIn}
            </div>
            <input
              type="range"
              aria-label={ex.burnIn}
              value={skipIter}
              min={0}
              max={2000}
              step={10}
              onChange={(e) => setSkipIter(parseInt(e.target.value))}
              className="w-full accent-signal-amber"
            />
            <div className="text-right font-mono text-[10px] text-ink-400">
              {skipIter} {ex.iterUnit}
            </div>
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {ex.show}
            </div>
            <input
              type="range"
              aria-label={ex.show}
              value={showCount}
              min={20}
              max={1000}
              step={10}
              onChange={(e) => setShowCount(parseInt(e.target.value))}
              className="w-full accent-signal-amber"
            />
            <div className="text-right font-mono text-[10px] text-ink-400">
              {showCount} {ex.iterUnit}
            </div>
          </div>

          <div className="p-5">
            <Link
              href="/"
              className="hairline block w-full rounded-md border py-2 text-center font-mono text-[10px] uppercase tracking-widest2 text-ink-300 transition-colors hover:border-signal-violet/40 hover:text-signal-violet"
            >
              {u.back}
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
