"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import type { Locale } from "@/lib/i18n/types";
import { useDpr } from "@/lib/hooks/useDpr";
import { palette } from "@/lib/visual/palette";

const ACCENT = "text-signal-amber";
const TRUE_PI = Math.PI;

// Each needle records its centre (x, y) and angle in [0, π).
// We keep a circular buffer of the last RENDER_MAX needles for drawing.
interface Needle {
  x: number;
  y: number;
  angle: number;
  cross: boolean;
}

const RENDER_MAX = 240;

// History sample of the running π estimate, sampled every SAMPLE_EVERY drops.
interface Sample {
  n: number;
  est: number;
}

const SAMPLE_EVERY = 25;
const HISTORY_MAX = 1200;

// Local UI strings for all eight locales, following the RICH_EXPLORER pattern
// used by app/mobius/explorer. Math notation (d, ℓ, π ≈ 2ℓn/(d·k)) stays as-is.
type RichExplorer = {
  needleDrop: string;
  convergence: string;
  stats: string;
  drops: string;
  crossings: string;
  piEstimate: string;
  error: string;
  biasNote: string;
  autoDrop: string;
  on: string;
  off: string;
  rate: string;
  perFrame: string;
  drop1k: string;
  drop10k: string;
  clear: string;
  needleLength: string;
  lineSpacing: string;
  hint: string;
  dropAria: string;
  plotAria: string;
};

const RICH_EXPLORER: Record<Locale, RichExplorer> = {
  en: {
    needleDrop: "Needle drop",
    convergence: "Convergence · running π estimate vs needles dropped",
    stats: "Stats",
    drops: "Drops",
    crossings: "Crossings",
    piEstimate: "π estimate",
    error: "|error|",
    biasNote:
      "Note: ℓ > d. The simple formula over-estimates crossings here; the exact closed form is more elaborate. The Explorer keeps the basic estimator so you can watch the bias appear.",
    autoDrop: "Auto drop",
    on: "On",
    off: "Off",
    rate: "Rate",
    perFrame: "drops/frame",
    drop1k: "Drop 1 000",
    drop10k: "Drop 10 000",
    clear: "Clear",
    needleLength: "Needle length ℓ",
    lineSpacing: "Line spacing d",
    hint: "Drop a few needles to begin sampling.",
    dropAria: "Needles dropped on parallel lines; crossings highlighted in amber.",
    plotAria: "Running estimate of π versus number of needles dropped.",
  },
  de: {
    needleDrop: "Nadelwurf",
    convergence: "Konvergenz · laufende π-Schätzung vs geworfene Nadeln",
    stats: "Statistik",
    drops: "Würfe",
    crossings: "Kreuzungen",
    piEstimate: "π-Schätzung",
    error: "|Fehler|",
    biasNote:
      "Hinweis: ℓ > d. Die einfache Formel überschätzt hier die Kreuzungen; die exakte geschlossene Form ist aufwendiger. Der Explorer behält den einfachen Schätzer, damit du die Verzerrung auftauchen siehst.",
    autoDrop: "Auto-Wurf",
    on: "An",
    off: "Aus",
    rate: "Rate",
    perFrame: "Würfe/Bild",
    drop1k: "1 000 werfen",
    drop10k: "10 000 werfen",
    clear: "Zurücksetzen",
    needleLength: "Nadellänge ℓ",
    lineSpacing: "Linienabstand d",
    hint: "Wirf ein paar Nadeln, um mit dem Sampeln zu beginnen.",
    dropAria: "Nadeln auf parallele Linien geworfen; Kreuzungen amber hervorgehoben.",
    plotAria: "Laufende π-Schätzung gegen die Anzahl geworfener Nadeln.",
  },
  es: {
    needleDrop: "Caída de aguja",
    convergence: "Convergencia · estimación de π vs agujas lanzadas",
    stats: "Estadísticas",
    drops: "Caídas",
    crossings: "Cruces",
    piEstimate: "estimación de π",
    error: "|error|",
    biasNote:
      "Nota: ℓ > d. La fórmula simple sobrestima los cruces aquí; la forma cerrada exacta es más elaborada. El Explorador mantiene el estimador básico para que veas aparecer el sesgo.",
    autoDrop: "Caída automática",
    on: "Sí",
    off: "No",
    rate: "Ritmo",
    perFrame: "caídas/fotograma",
    drop1k: "Lanzar 1 000",
    drop10k: "Lanzar 10 000",
    clear: "Limpiar",
    needleLength: "Longitud de aguja ℓ",
    lineSpacing: "Separación de líneas d",
    hint: "Lanza unas agujas para empezar a muestrear.",
    dropAria: "Agujas lanzadas sobre líneas paralelas; los cruces se resaltan en ámbar.",
    plotAria: "Estimación de π en curso frente al número de agujas lanzadas.",
  },
  fr: {
    needleDrop: "Lancer d'aiguille",
    convergence: "Convergence · estimation courante de π vs aiguilles lancées",
    stats: "Statistiques",
    drops: "Lancers",
    crossings: "Croisements",
    piEstimate: "estimation de π",
    error: "|erreur|",
    biasNote:
      "Note : ℓ > d. La formule simple surestime les croisements ici ; la forme close exacte est plus élaborée. L'Explorateur garde l'estimateur de base pour que tu voies le biais apparaître.",
    autoDrop: "Lancer auto",
    on: "Oui",
    off: "Non",
    rate: "Cadence",
    perFrame: "lancers/image",
    drop1k: "Lancer 1 000",
    drop10k: "Lancer 10 000",
    clear: "Effacer",
    needleLength: "Longueur d'aiguille ℓ",
    lineSpacing: "Espacement des lignes d",
    hint: "Lance quelques aiguilles pour commencer l'échantillonnage.",
    dropAria: "Aiguilles lancées sur des lignes parallèles ; croisements en ambre.",
    plotAria: "Estimation courante de π selon le nombre d'aiguilles lancées.",
  },
  it: {
    needleDrop: "Lancio dell'ago",
    convergence: "Convergenza · stima corrente di π vs aghi lanciati",
    stats: "Statistiche",
    drops: "Lanci",
    crossings: "Incroci",
    piEstimate: "stima di π",
    error: "|errore|",
    biasNote:
      "Nota: ℓ > d. La formula semplice sovrastima gli incroci qui; la forma chiusa esatta è più elaborata. L'Esploratore mantiene lo stimatore di base così vedi comparire la distorsione.",
    autoDrop: "Lancio automatico",
    on: "Sì",
    off: "No",
    rate: "Ritmo",
    perFrame: "lanci/fotogramma",
    drop1k: "Lancia 1 000",
    drop10k: "Lancia 10 000",
    clear: "Azzera",
    needleLength: "Lunghezza dell'ago ℓ",
    lineSpacing: "Distanza tra le linee d",
    hint: "Lancia qualche ago per iniziare a campionare.",
    dropAria: "Aghi lanciati su linee parallele; incroci evidenziati in ambra.",
    plotAria: "Stima corrente di π rispetto al numero di aghi lanciati.",
  },
  pt: {
    needleDrop: "Lançamento de agulha",
    convergence: "Convergência · estimativa de π vs agulhas lançadas",
    stats: "Estatísticas",
    drops: "Lançamentos",
    crossings: "Cruzamentos",
    piEstimate: "estimativa de π",
    error: "|erro|",
    biasNote:
      "Nota: ℓ > d. A fórmula simples sobrestima os cruzamentos aqui; a forma fechada exata é mais elaborada. O Explorador mantém o estimador básico para veres o viés a aparecer.",
    autoDrop: "Lançamento automático",
    on: "Sim",
    off: "Não",
    rate: "Ritmo",
    perFrame: "lançamentos/quadro",
    drop1k: "Lançar 1 000",
    drop10k: "Lançar 10 000",
    clear: "Limpar",
    needleLength: "Comprimento da agulha ℓ",
    lineSpacing: "Espaçamento das linhas d",
    hint: "Lança umas agulhas para começar a amostrar.",
    dropAria: "Agulhas lançadas sobre linhas paralelas; cruzamentos realçados a âmbar.",
    plotAria: "Estimativa corrente de π em função do número de agulhas lançadas.",
  },
  sv: {
    needleDrop: "Nålsläpp",
    convergence: "Konvergens · löpande π-skattning vs släppta nålar",
    stats: "Statistik",
    drops: "Släpp",
    crossings: "Korsningar",
    piEstimate: "π-skattning",
    error: "|fel|",
    biasNote:
      "Obs: ℓ > d. Den enkla formeln överskattar korsningarna här; den exakta slutna formen är mer invecklad. Utforskaren behåller den enkla skattaren så att du kan se skevheten träda fram.",
    autoDrop: "Autosläpp",
    on: "På",
    off: "Av",
    rate: "Takt",
    perFrame: "släpp/bildruta",
    drop1k: "Släpp 1 000",
    drop10k: "Släpp 10 000",
    clear: "Rensa",
    needleLength: "Nållängd ℓ",
    lineSpacing: "Linjeavstånd d",
    hint: "Släpp några nålar för att börja sampla.",
    dropAria: "Nålar släppta på parallella linjer; korsningar markerade i bärnsten.",
    plotAria: "Löpande π-skattning mot antalet släppta nålar.",
  },
  no: {
    needleDrop: "Nålslipp",
    convergence: "Konvergens · løpende π-estimat vs slupne nåler",
    stats: "Statistikk",
    drops: "Slipp",
    crossings: "Kryssinger",
    piEstimate: "π-estimat",
    error: "|feil|",
    biasNote:
      "Merk: ℓ > d. Den enkle formelen overestimerer kryssingene her; den eksakte lukkede formen er mer omfattende. Utforskeren beholder den enkle estimatoren så du kan se skjevheten tre fram.",
    autoDrop: "Autoslipp",
    on: "På",
    off: "Av",
    rate: "Takt",
    perFrame: "slipp/bilde",
    drop1k: "Slipp 1 000",
    drop10k: "Slipp 10 000",
    clear: "Tøm",
    needleLength: "Nålelengde ℓ",
    lineSpacing: "Linjeavstand d",
    hint: "Slipp noen nåler for å begynne å sample.",
    dropAria: "Nåler sluppet på parallelle linjer; kryssinger uthevet i rav.",
    plotAria: "Løpende π-estimat mot antall slupne nåler.",
  },
};

export default function BuffonExplorer() {
  const { a, u, locale } = useI18n();
  const topic = a.topics.buffon;
  const ex = RICH_EXPLORER[locale] ?? RICH_EXPLORER.en;
  const dpr = useDpr();
  const dropCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const plotCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Tunables
  const [spacing, setSpacing] = useState(60); // d in CSS px
  const [needleLen, setNeedleLen] = useState(50); // ℓ in CSS px
  const [rate, setRate] = useState(40); // drops per frame when auto
  const [auto, setAuto] = useState(false);

  // Running totals
  const [total, setTotal] = useState(0);
  const [crossings, setCrossings] = useState(0);

  // We keep needles + samples in refs to avoid re-rendering on every drop;
  // a counter (totalRef) drives the React state via setState calls at most once
  // per animation frame.
  const needlesRef = useRef<Needle[]>([]);
  const headRef = useRef(0); // circular buffer head
  const totalRef = useRef(0);
  const crossRef = useRef(0);
  const samplesRef = useRef<Sample[]>([]);
  const sampleHeadRef = useRef(0);

  // Mirror tunables into refs so the rAF loop sees fresh values.
  const spacingRef = useRef(spacing);
  const needleLenRef = useRef(needleLen);
  const rateRef = useRef(rate);
  const autoRef = useRef(auto);
  useEffect(() => {
    spacingRef.current = spacing;
  }, [spacing]);
  useEffect(() => {
    needleLenRef.current = needleLen;
  }, [needleLen]);
  useEffect(() => {
    rateRef.current = rate;
  }, [rate]);
  useEffect(() => {
    autoRef.current = auto;
  }, [auto]);

  // Bumping this counter forces the drawing effects to re-run after manual drops.
  const [tick, setTick] = useState(0);

  const drop = (n: number) => {
    const canvas = dropCanvasRef.current;
    if (!canvas) return;
    const W = canvas.clientWidth;
    const H = canvas.clientHeight;
    const d = spacingRef.current;
    const len = needleLenRef.current;
    const buf = needlesRef.current;
    let newCross = 0;
    // Sample the centre over a whole number of line-periods so y mod d is
    // uniform. Over the full canvas height it is not (H rarely divides evenly
    // by d), which biases the crossing probability and the π estimate.
    const rows = Math.max(1, Math.floor(H / d));
    const yRange = rows * d;
    for (let i = 0; i < n; i++) {
      const x = Math.random() * W;
      const y = Math.random() * yRange;
      const angle = Math.random() * Math.PI;
      // Crossing test: position centre within its horizontal strip of width d.
      // It crosses iff |yWithinStrip − d/2| + (ℓ/2)·sin(angle) > d/2.
      const yMod = ((y % d) + d) % d;
      const sinA = Math.sin(angle);
      const half = len / 2;
      const cross = Math.abs(yMod - d / 2) + half * sinA > d / 2;
      if (cross) newCross++;
      const needle: Needle = { x, y, angle, cross };
      if (buf.length < RENDER_MAX) {
        buf.push(needle);
      } else {
        buf[headRef.current] = needle;
        headRef.current = (headRef.current + 1) % RENDER_MAX;
      }
      totalRef.current += 1;
      if (cross) crossRef.current += 1;
      // Sample running π estimate periodically.
      if (totalRef.current % SAMPLE_EVERY === 0 && crossRef.current > 0) {
        const est = (2 * len * totalRef.current) / (d * crossRef.current);
        const sample: Sample = { n: totalRef.current, est };
        const sbuf = samplesRef.current;
        if (sbuf.length < HISTORY_MAX) {
          sbuf.push(sample);
        } else {
          sbuf[sampleHeadRef.current] = sample;
          sampleHeadRef.current = (sampleHeadRef.current + 1) % HISTORY_MAX;
        }
      }
    }
    setTotal(totalRef.current);
    setCrossings(crossRef.current);
    setTick((t) => t + 1);
    return newCross;
  };

  const clear = () => {
    needlesRef.current = [];
    headRef.current = 0;
    samplesRef.current = [];
    sampleHeadRef.current = 0;
    totalRef.current = 0;
    crossRef.current = 0;
    setTotal(0);
    setCrossings(0);
    setTick((t) => t + 1);
  };

  // The estimator π ≈ 2ℓn/(dk) applies the CURRENT ℓ and d to the cumulative
  // counts. Mixing drops collected under different parameters would bias it
  // permanently, so start a fresh sample whenever ℓ or d changes.
  useEffect(() => {
    clear();
    // clear is stable for our purposes; only re-run on a parameter change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spacing, needleLen]);

  // Auto-drop loop via requestAnimationFrame.
  useEffect(() => {
    let raf = 0;
    const step = () => {
      if (autoRef.current) {
        drop(rateRef.current);
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // The loop reads autoRef/rateRef, so it only needs to mount once.
  }, []);

  // Render the needle-drop canvas: parallel lines + the most recent needles.
  useEffect(() => {
    const canvas = dropCanvasRef.current;
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

      // Parallel lines. Start at y = 0 so every line the modular crossing test
      // uses (the grid at each multiple of d) is actually visible; otherwise a
      // needle near the top edge looks like it crosses nothing.
      ctx.strokeStyle = "rgba(138,144,164,0.35)";
      ctx.lineWidth = 1;
      for (let y = 0; y <= H; y += spacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      // Needles
      const half = needleLen / 2;
      const buf = needlesRef.current;
      ctx.lineCap = "round";
      ctx.lineWidth = 1.6;
      for (const n of buf) {
        const dx = half * Math.cos(n.angle);
        const dy = half * Math.sin(n.angle);
        ctx.strokeStyle = n.cross ? "rgba(255, 181, 71, 0.9)" : "rgba(176,182,200,0.55)";
        ctx.beginPath();
        ctx.moveTo(n.x - dx, n.y - dy);
        ctx.lineTo(n.x + dx, n.y + dy);
        ctx.stroke();
      }
    };
    render();
    const ro = new ResizeObserver(render);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [tick, spacing, needleLen, dpr]);

  // Render the convergence plot: running π estimate vs n.
  useEffect(() => {
    const canvas = plotCanvasRef.current;
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

      // Read samples in chronological order out of the circular buffer.
      const sbuf = samplesRef.current;
      const ordered: Sample[] =
        sbuf.length < HISTORY_MAX
          ? sbuf
          : [...sbuf.slice(sampleHeadRef.current), ...sbuf.slice(0, sampleHeadRef.current)];

      // Y-axis: π ± 0.6 typically. Clamp est into a visible band.
      const yMin = TRUE_PI - 0.8;
      const yMax = TRUE_PI + 0.8;
      const yToPx = (v: number) => {
        const clamped = Math.max(yMin, Math.min(yMax, v));
        return H - ((clamped - yMin) / (yMax - yMin)) * H;
      };

      // Gridlines
      ctx.strokeStyle = "rgba(138,144,164,0.1)";
      ctx.lineWidth = 1;
      for (let i = 0; i <= 4; i++) {
        const y = (i / 4) * H;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      // True-π reference line
      const piY = yToPx(TRUE_PI);
      ctx.strokeStyle = "rgba(125, 243, 255, 0.55)";
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, piY);
      ctx.lineTo(W, piY);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = palette.signal.cyan;
      ctx.font = "10px ui-monospace, monospace";
      ctx.fillText("π = 3.14159…", 8, piY - 4);

      if (ordered.length < 2) {
        ctx.fillStyle = "rgba(176,182,200,0.5)";
        ctx.font = "11px ui-monospace, monospace";
        ctx.fillText(ex.hint, 12, H / 2);
        return;
      }

      const nMax = ordered[ordered.length - 1].n;
      const xToPx = (n: number) => (n / nMax) * W;

      ctx.strokeStyle = "rgba(255, 181, 71, 0.85)";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      for (let i = 0; i < ordered.length; i++) {
        const s = ordered[i];
        const px = xToPx(s.n);
        const py = yToPx(s.est);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Axis labels
      ctx.fillStyle = "rgba(176,182,200,0.55)";
      ctx.font = "10px ui-monospace, monospace";
      ctx.fillText(`n = ${nMax.toLocaleString()}`, W - 110, H - 6);
      ctx.fillText(yMax.toFixed(2), 4, 12);
      ctx.fillText(yMin.toFixed(2), 4, H - 4);
    };
    render();
    const ro = new ResizeObserver(render);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [tick, dpr, ex.hint]);

  const piEst = crossings > 0 ? (2 * needleLen * total) / (spacing * crossings) : NaN;
  const errPct = Number.isFinite(piEst) ? (Math.abs(piEst - TRUE_PI) / TRUE_PI) * 100 : NaN;
  const lenRatio = needleLen / spacing;

  return (
    <main className="flex min-h-screen flex-col pt-14">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_420px]">
        <div className="relative flex min-h-[60vh] flex-col gap-4 bg-ink-950 p-4 lg:min-h-[calc(100vh-3.5rem)] lg:p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              {ex.needleDrop} · d = {spacing}px · ℓ = {needleLen}px ({lenRatio.toFixed(2)} d)
            </div>
            <div
              className={`glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}
            >
              π ≈ 2ℓn / (d·k)
            </div>
          </div>
          <div className="hairline flex-1 overflow-hidden rounded-2xl border bg-ink-950">
            <canvas
              ref={dropCanvasRef}
              role="img"
              aria-label={ex.dropAria}
              className="block h-full w-full"
            />
          </div>
          <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
            {ex.convergence}
          </div>
          <div className="hairline h-44 overflow-hidden rounded-2xl border bg-ink-950">
            <canvas
              ref={plotCanvasRef}
              role="img"
              aria-label={ex.plotAria}
              className="block h-full w-full"
            />
          </div>
        </div>

        <aside className="hairline scrollbar-thin flex flex-col overflow-y-auto border-l bg-ink-900/40">
          <div className="hairline space-y-3 border-b p-6">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {topic.title}
            </div>
            <h1 className="math-italic text-3xl leading-tight text-ink-100">{topic.tagline}</h1>
            <p className="text-sm leading-relaxed text-ink-200">{topic.body}</p>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {ex.stats}
            </div>
            <dl className="grid grid-cols-2 gap-y-1 font-mono text-sm">
              <dt className="text-ink-300">{ex.drops}</dt>
              <dd className="text-right text-ink-100">{total.toLocaleString()}</dd>
              <dt className="text-ink-300">{ex.crossings}</dt>
              <dd className="text-right text-ink-100">{crossings.toLocaleString()}</dd>
              <dt className="text-ink-300">{ex.piEstimate}</dt>
              <dd className={`text-right ${ACCENT}`}>
                {Number.isFinite(piEst) ? piEst.toFixed(6) : "—"}
              </dd>
              <dt className="text-ink-300">{ex.error}</dt>
              <dd className="text-right text-ink-100">
                {Number.isFinite(errPct) ? `${errPct.toFixed(3)} %` : "—"}
              </dd>
            </dl>
            {lenRatio > 1 ? (
              <p className="text-[10px] leading-relaxed text-ink-400">{ex.biasNote}</p>
            ) : null}
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="flex items-center justify-between">
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                {ex.autoDrop}
              </div>
              <button
                type="button"
                onClick={() => setAuto((v) => !v)}
                className={`rounded-md border px-3 py-1 font-mono text-[10px] uppercase tracking-widest2 transition-colors ${
                  auto
                    ? "border-signal-amber/60 bg-signal-amber/15 text-signal-amber"
                    : "hairline text-ink-300 hover:border-signal-amber/40 hover:text-ink-100"
                }`}
              >
                {auto ? ex.on : ex.off}
              </button>
            </div>
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {ex.rate} · {rate} {ex.perFrame}
            </div>
            <input
              type="range"
              value={rate}
              min={1}
              max={500}
              step={1}
              onChange={(e) => setRate(parseInt(e.target.value, 10))}
              aria-label={ex.rate}
              className="w-full accent-signal-amber"
            />
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => drop(1000)}
                className="hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-signal-amber/40 hover:text-signal-amber"
              >
                {ex.drop1k}
              </button>
              <button
                type="button"
                onClick={() => drop(10000)}
                className="hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-signal-amber/40 hover:text-signal-amber"
              >
                {ex.drop10k}
              </button>
            </div>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {ex.needleLength} · {needleLen}px ({lenRatio.toFixed(2)} d)
            </div>
            <input
              type="range"
              value={needleLen}
              min={Math.round(spacing * 0.2)}
              max={Math.round(spacing * 1.5)}
              step={1}
              onChange={(e) => setNeedleLen(parseInt(e.target.value, 10))}
              aria-label={ex.needleLength}
              className="w-full accent-signal-amber"
            />
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {ex.lineSpacing} · {spacing}px
            </div>
            <input
              type="range"
              value={spacing}
              min={40}
              max={120}
              step={1}
              onChange={(e) => {
                const next = parseInt(e.target.value, 10);
                setSpacing(next);
                // Keep ℓ/d ratio meaningful by clamping ℓ into the new allowed range.
                setNeedleLen((cur) =>
                  Math.max(Math.round(next * 0.2), Math.min(Math.round(next * 1.5), cur)),
                );
              }}
              aria-label={ex.lineSpacing}
              className="w-full accent-signal-amber"
            />
          </div>

          <div className="hairline border-b p-5">
            <button
              type="button"
              onClick={clear}
              className="hairline block w-full rounded-md border py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-signal-amber/40 hover:text-signal-amber"
            >
              {ex.clear}
            </button>
          </div>

          <div className="p-5">
            <Link
              href="/buffon"
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
