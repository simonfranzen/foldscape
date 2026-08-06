"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { useDpr } from "@/lib/hooks/useDpr";
import { palette } from "@/lib/visual/palette";
import type { Locale } from "@/lib/i18n/types";

// Only pure-sine (odd-about-t=0.5) targets: every one converges under the
// sine-only partial sum below. A Gaussian pulse is even about t=0.5 and needs
// cosine + DC terms this model cannot represent, so it is intentionally absent.
type WaveType = "square" | "sawtooth" | "triangle";

// Truth: each waveform's Fourier series coefficients (for sin(k·2π·t/T))
function harmonics(wave: WaveType, N: number): { k: number; a: number }[] {
  const out: { k: number; a: number }[] = [];
  for (let k = 1; k <= N; k++) {
    let a = 0;
    if (wave === "square") {
      // square: 4/π · Σ sin((2m-1)x)/(2m-1)
      if (k % 2 === 1) a = 4 / Math.PI / k;
    } else if (wave === "sawtooth") {
      // sawtooth: 2/π · Σ (-1)^(k+1) sin(kx)/k
      a = ((2 / Math.PI) * (k % 2 === 0 ? -1 : 1)) / k;
    } else if (wave === "triangle") {
      // triangle: 8/π² · Σ (-1)^m sin((2m+1)x)/(2m+1)^2 for m = 0,1,...
      if (k % 2 === 1) {
        const m = (k - 1) / 2;
        a = ((8 / (Math.PI * Math.PI)) * (m % 2 === 0 ? 1 : -1)) / (k * k);
      }
    }
    out.push({ k, a });
  }
  return out;
}

function partialSum(harms: { k: number; a: number }[], t: number) {
  let s = 0;
  for (const { k, a } of harms) s += a * Math.sin(k * 2 * Math.PI * t);
  return s;
}

function target(wave: WaveType, t: number) {
  // t ∈ [0, 1)
  const u = ((t % 1) + 1) % 1;
  if (wave === "square") return u < 0.5 ? 1 : -1;
  if (wave === "sawtooth") return 2 * (u - Math.floor(u + 0.5));
  // triangle in sine phase: 0 at t=0, +1 at t=0.25, −1 at t=0.75,
  // matching the (−1)^m sin((2m+1)·2πt) series above.
  if (wave === "triangle") return u < 0.25 ? 4 * u : u < 0.75 ? 2 - 4 * u : 4 * u - 4;
  return 0;
}

// Explorer-local UI strings, following the RICH_EXPLORER convention. The story
// page's atlas copy is already localised via useI18n; the interactive chrome is
// not covered by any shared bundle, so it lives here for all 8 locales.
type ExplorerDict = {
  waveLabels: Record<WaveType, string>;
  targetWave: string;
  harmonics: string;
  layers: string;
  spectrumLabel: string;
  targetToggle: string;
  harmonicsToggle: string;
  gibbsHint: string;
  harmonicsCount: (n: number) => string;
  waveCanvasLabel: string;
  spectrumCanvasLabel: string;
};

const RICH_EXPLORER: Record<Locale, ExplorerDict> = {
  en: {
    waveLabels: { square: "Square wave", sawtooth: "Sawtooth", triangle: "Triangle" },
    targetWave: "Target wave",
    harmonics: "Harmonics",
    layers: "Layers",
    spectrumLabel: "Spectrum · amplitude per harmonic",
    targetToggle: "Target (white)",
    harmonicsToggle: "Individual harmonics (cyan)",
    gibbsHint:
      "Adding more harmonics sharpens the corners. Notice the small overshoot near jumps, Gibbs' phenomenon.",
    harmonicsCount: (n) => `${n} harmonic${n === 1 ? "" : "s"}`,
    waveCanvasLabel:
      "Waveform: the white target with the amber partial sum of harmonics converging onto it.",
    spectrumCanvasLabel: "Bar chart of harmonic amplitudes.",
  },
  de: {
    waveLabels: { square: "Rechteckwelle", sawtooth: "Sägezahn", triangle: "Dreieck" },
    targetWave: "Zielwelle",
    harmonics: "Harmonische",
    layers: "Ebenen",
    spectrumLabel: "Spektrum · Amplitude je Harmonische",
    targetToggle: "Ziel (weiß)",
    harmonicsToggle: "Einzelne Harmonische (cyan)",
    gibbsHint:
      "Mehr Harmonische schärfen die Ecken. Beachte den kleinen Überschwinger nahe den Sprüngen, das Gibbs-Phänomen.",
    harmonicsCount: (n) => `${n} Harmonische`,
    waveCanvasLabel:
      "Wellenform: die weiße Zielkurve, auf die sich die bernsteinfarbene Partialsumme der Harmonischen zubewegt.",
    spectrumCanvasLabel: "Balkendiagramm der Amplituden je Harmonische.",
  },
  es: {
    waveLabels: { square: "Onda cuadrada", sawtooth: "Diente de sierra", triangle: "Triangular" },
    targetWave: "Onda objetivo",
    harmonics: "Armónicos",
    layers: "Capas",
    spectrumLabel: "Espectro · amplitud por armónico",
    targetToggle: "Objetivo (blanco)",
    harmonicsToggle: "Armónicos individuales (cian)",
    gibbsHint:
      "Añadir más armónicos afila las esquinas. Fíjate en el pequeño sobreimpulso cerca de los saltos, el fenómeno de Gibbs.",
    harmonicsCount: (n) => `${n} armónico${n === 1 ? "" : "s"}`,
    waveCanvasLabel:
      "Forma de onda: el objetivo blanco con la suma parcial ámbar de armónicos convergiendo hacia él.",
    spectrumCanvasLabel: "Gráfico de barras de las amplitudes de los armónicos.",
  },
  fr: {
    waveLabels: { square: "Onde carrée", sawtooth: "Dent de scie", triangle: "Triangle" },
    targetWave: "Onde cible",
    harmonics: "Harmoniques",
    layers: "Couches",
    spectrumLabel: "Spectre · amplitude par harmonique",
    targetToggle: "Cible (blanc)",
    harmonicsToggle: "Harmoniques individuelles (cyan)",
    gibbsHint:
      "Ajouter des harmoniques affine les coins. Remarquez le petit dépassement près des sauts, le phénomène de Gibbs.",
    harmonicsCount: (n) => `${n} harmonique${n === 1 ? "" : "s"}`,
    waveCanvasLabel:
      "Forme d'onde : la cible blanche vers laquelle converge la somme partielle ambre des harmoniques.",
    spectrumCanvasLabel: "Diagramme en barres des amplitudes des harmoniques.",
  },
  it: {
    waveLabels: { square: "Onda quadra", sawtooth: "Dente di sega", triangle: "Triangolare" },
    targetWave: "Onda bersaglio",
    harmonics: "Armoniche",
    layers: "Livelli",
    spectrumLabel: "Spettro · ampiezza per armonica",
    targetToggle: "Bersaglio (bianco)",
    harmonicsToggle: "Armoniche individuali (ciano)",
    gibbsHint:
      "Aggiungere armoniche affila gli angoli. Nota il piccolo sovrasbalzo vicino ai salti, il fenomeno di Gibbs.",
    harmonicsCount: (n) => `${n} armonic${n === 1 ? "a" : "he"}`,
    waveCanvasLabel:
      "Forma d'onda: il bersaglio bianco verso cui converge la somma parziale ambra delle armoniche.",
    spectrumCanvasLabel: "Grafico a barre delle ampiezze delle armoniche.",
  },
  pt: {
    waveLabels: { square: "Onda quadrada", sawtooth: "Dente de serra", triangle: "Triangular" },
    targetWave: "Onda alvo",
    harmonics: "Harmônicos",
    layers: "Camadas",
    spectrumLabel: "Espectro · amplitude por harmônico",
    targetToggle: "Alvo (branco)",
    harmonicsToggle: "Harmônicos individuais (ciano)",
    gibbsHint:
      "Adicionar mais harmônicos afia os cantos. Repare no pequeno sobressinal perto dos saltos, o fenômeno de Gibbs.",
    harmonicsCount: (n) => `${n} harmônico${n === 1 ? "" : "s"}`,
    waveCanvasLabel:
      "Forma de onda: o alvo branco com a soma parcial âmbar dos harmônicos convergindo para ele.",
    spectrumCanvasLabel: "Gráfico de barras das amplitudes dos harmônicos.",
  },
  sv: {
    waveLabels: { square: "Fyrkantsvåg", sawtooth: "Sågtand", triangle: "Triangel" },
    targetWave: "Målvåg",
    harmonics: "Övertoner",
    layers: "Lager",
    spectrumLabel: "Spektrum · amplitud per överton",
    targetToggle: "Mål (vitt)",
    harmonicsToggle: "Enskilda övertoner (cyan)",
    gibbsHint:
      "Fler övertoner skärper hörnen. Lägg märke till den lilla överslängen nära hoppen, Gibbs fenomen.",
    harmonicsCount: (n) => `${n} överton${n === 1 ? "" : "er"}`,
    waveCanvasLabel:
      "Vågform: den vita målkurvan som den bärnstensfärgade partialsumman av övertoner närmar sig.",
    spectrumCanvasLabel: "Stapeldiagram över övertonernas amplituder.",
  },
  no: {
    waveLabels: { square: "Firkantbølge", sawtooth: "Sagtann", triangle: "Trekant" },
    targetWave: "Målbølge",
    harmonics: "Overtoner",
    layers: "Lag",
    spectrumLabel: "Spektrum · amplitude per overtone",
    targetToggle: "Mål (hvitt)",
    harmonicsToggle: "Enkelte overtoner (cyan)",
    gibbsHint:
      "Flere overtoner skjerper hjørnene. Legg merke til det lille oversvinget nær hoppene, Gibbs' fenomen.",
    harmonicsCount: (n) => `${n} overtone${n === 1 ? "" : "r"}`,
    waveCanvasLabel:
      "Bølgeform: den hvite målkurven som den ravfargede delsummen av overtoner nærmer seg.",
    spectrumCanvasLabel: "Stolpediagram over overtonenes amplituder.",
  },
};

export default function FourierExplorer() {
  const { a, u, locale } = useI18n();
  const topic = a.topics.fourier;
  const ex = RICH_EXPLORER[locale];
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const spectrumRef = useRef<HTMLCanvasElement | null>(null);
  const dpr = useDpr();

  const [wave, setWave] = useState<WaveType>("square");
  const [N, setN] = useState(8);
  const [showTarget, setShowTarget] = useState(true);
  const [showHarmonics, setShowHarmonics] = useState(true);

  const harms = harmonics(wave, N);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = palette.canvas.bg;
      ctx.fillRect(0, 0, W, H);

      // Axes
      ctx.strokeStyle = "rgba(138,144,164,0.15)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, H / 2);
      ctx.lineTo(W, H / 2);
      ctx.stroke();

      const Y = (v: number) => H / 2 - (v / 1.5) * (H / 2 - 16);
      const X = (t: number) => t * W;

      // Target waveform (faint white)
      if (showTarget) {
        ctx.strokeStyle = "rgba(232, 235, 245, 0.35)";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        for (let i = 0; i <= W; i++) {
          const t = i / W;
          if (i === 0) ctx.moveTo(X(t), Y(target(wave, t)));
          else ctx.lineTo(X(t), Y(target(wave, t)));
        }
        ctx.stroke();
      }

      // Individual harmonics (faint cyan)
      if (showHarmonics) {
        for (const { k, a } of harms) {
          ctx.strokeStyle = `rgba(125, 243, 255, ${0.08 + 0.25 * Math.min(1, Math.abs(a))})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          for (let i = 0; i <= W; i++) {
            const t = i / W;
            const y = a * Math.sin(k * 2 * Math.PI * t);
            if (i === 0) ctx.moveTo(X(t), Y(y));
            else ctx.lineTo(X(t), Y(y));
          }
          ctx.stroke();
        }
      }

      // Partial sum (bright amber)
      ctx.strokeStyle = palette.signal.amber;
      ctx.shadowColor = palette.signal.amber;
      ctx.shadowBlur = 8;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i <= W; i++) {
        const t = i / W;
        const v = partialSum(harms, t);
        if (i === 0) ctx.moveTo(X(t), Y(v));
        else ctx.lineTo(X(t), Y(v));
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    render();
    const ro = new ResizeObserver(render);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [wave, N, showTarget, showHarmonics, harms, dpr]);

  // Spectrum (bar chart of amplitudes)
  useEffect(() => {
    const canvas = spectrumRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = palette.canvas.bg;
      ctx.fillRect(0, 0, W, H);

      const max = Math.max(0.1, ...harms.map((h) => Math.abs(h.a)));
      const barW = W / N;
      for (let i = 0; i < harms.length; i++) {
        const h = harms[i];
        const bx = i * barW + 2;
        const bh = (Math.abs(h.a) / max) * (H - 28);
        const by = H - bh - 14;
        ctx.fillStyle = h.a >= 0 ? "rgba(125,243,255,0.85)" : "rgba(255,122,182,0.85)";
        ctx.fillRect(bx, by, barW - 4, bh);
        ctx.fillStyle = "rgba(168,175,191,0.55)";
        ctx.font = "10px ui-monospace, monospace";
        ctx.fillText(`k${h.k}`, bx + 2, H - 4);
      }
    };

    render();
    const ro = new ResizeObserver(render);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [harms, N, dpr]);

  return (
    <main className="flex min-h-screen flex-col pt-14">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_420px]">
        <div className="relative flex min-h-[60vh] flex-col gap-4 bg-ink-950 p-4 lg:min-h-[calc(100vh-3.5rem)] lg:p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              {ex.waveLabels[wave]} · {ex.harmonicsCount(N)}
            </div>
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
              Σₖ aₖ sin(2πk t)
            </div>
          </div>
          <div className="hairline flex-1 overflow-hidden rounded-2xl border bg-ink-950">
            <canvas
              ref={canvasRef}
              role="img"
              aria-label={ex.waveCanvasLabel}
              className="block h-full w-full"
            />
          </div>
          <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
            {ex.spectrumLabel}
          </div>
          <div className="hairline h-32 overflow-hidden rounded-2xl border bg-ink-950">
            <canvas
              ref={spectrumRef}
              role="img"
              aria-label={ex.spectrumCanvasLabel}
              className="block h-full w-full"
            />
          </div>
        </div>

        <aside className="hairline scrollbar-thin flex flex-col overflow-y-auto border-l bg-ink-900/40">
          <div className="hairline space-y-3 border-b p-6">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
              {topic.title}
            </div>
            <h1 className="math-italic text-3xl leading-tight text-ink-100">{topic.tagline}</h1>
            <p className="text-sm leading-relaxed text-ink-200">{topic.body}</p>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {ex.targetWave}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(ex.waveLabels) as WaveType[]).map((w) => (
                <button
                  key={w}
                  onClick={() => setWave(w)}
                  className={`rounded-md border py-2 font-mono text-[10px] uppercase tracking-widest transition-colors ${
                    wave === w
                      ? "border-signal-cyan/60 bg-signal-cyan/10 text-signal-cyan"
                      : "hairline text-ink-300 hover:text-ink-100"
                  }`}
                >
                  {ex.waveLabels[w]}
                </button>
              ))}
            </div>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {ex.harmonics}
            </div>
            <div className="flex items-center justify-between font-mono text-sm">
              <span className="text-signal-cyan">{N}</span>
            </div>
            <input
              type="range"
              value={N}
              min={1}
              max={48}
              step={1}
              aria-label={ex.harmonics}
              onChange={(e) => setN(parseInt(e.target.value))}
              className="w-full accent-signal-cyan"
            />
            <div className="grid grid-cols-4 gap-2 pt-1">
              {[1, 3, 8, 24].map((n) => (
                <button
                  key={n}
                  onClick={() => setN(n)}
                  className={`rounded-md border py-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors ${
                    N === n
                      ? "border-signal-cyan/60 text-signal-cyan"
                      : "hairline text-ink-300 hover:text-ink-100"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <p className="pt-2 text-[11px] text-ink-400">{ex.gibbsHint}</p>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {ex.layers}
            </div>
            <Toggle
              label={ex.targetToggle}
              on={showTarget}
              onChange={setShowTarget}
              accent="text-ink-200"
            />
            <Toggle
              label={ex.harmonicsToggle}
              on={showHarmonics}
              onChange={setShowHarmonics}
              accent="text-signal-cyan"
            />
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

function Toggle({
  label,
  on,
  onChange,
  accent,
}: {
  label: string;
  on: boolean;
  onChange: (v: boolean) => void;
  accent: string;
}) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={`flex w-full items-center justify-between rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest transition-colors ${
        on ? "border-signal-cyan/40 bg-signal-cyan/5" : "hairline"
      }`}
    >
      <span className={accent}>{label}</span>
      <span className={`${accent} text-base`}>{on ? "●" : "○"}</span>
    </button>
  );
}
