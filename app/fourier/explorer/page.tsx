"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";

type WaveType = "square" | "sawtooth" | "triangle" | "pulse";

const WAVE_LABELS: Record<WaveType, string> = {
  square: "Square wave",
  sawtooth: "Sawtooth",
  triangle: "Triangle",
  pulse: "Single pulse",
};

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
    } else if (wave === "pulse") {
      // narrow pulse: roughly constant amplitude across k (DC-removed)
      a = 0.4 / k;
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
  if (wave === "triangle") return 4 * Math.abs(u - 0.5) - 1;
  if (wave === "pulse") return Math.exp(-200 * (u - 0.5) ** 2) * 2 - 1;
  return 0;
}

export default function FourierExplorer() {
  const { a, u } = useI18n();
  const topic = a.topics.fourier;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const spectrumRef = useRef<HTMLCanvasElement | null>(null);

  const [wave, setWave] = useState<WaveType>("square");
  const [N, setN] = useState(8);
  const [showTarget, setShowTarget] = useState(true);
  const [showHarmonics, setShowHarmonics] = useState(true);

  const harms = harmonics(wave, N);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const render = () => {
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#06070d";
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
      ctx.strokeStyle = "#ffd166";
      ctx.shadowColor = "#ffd166";
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
  }, [wave, N, showTarget, showHarmonics, harms]);

  // Spectrum (bar chart of amplitudes)
  useEffect(() => {
    const canvas = spectrumRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const render = () => {
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#06070d";
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
  }, [harms, N]);

  return (
    <main className="flex min-h-screen flex-col pt-14">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_420px]">
        <div className="relative flex min-h-[60vh] flex-col gap-4 bg-ink-950 p-4 lg:min-h-[calc(100vh-3.5rem)] lg:p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              {WAVE_LABELS[wave]} · {N} harmonic{N === 1 ? "" : "s"}
            </div>
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
              Σₖ aₖ sin(2πk t)
            </div>
          </div>
          <div className="hairline flex-1 overflow-hidden rounded-2xl border bg-ink-950">
            <canvas ref={canvasRef} className="block h-full w-full" />
          </div>
          <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
            Spectrum · amplitude per harmonic
          </div>
          <div className="hairline h-32 overflow-hidden rounded-2xl border bg-ink-950">
            <canvas ref={spectrumRef} className="block h-full w-full" />
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
              Target wave
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(WAVE_LABELS) as WaveType[]).map((w) => (
                <button
                  key={w}
                  onClick={() => setWave(w)}
                  className={`rounded-md border py-2 font-mono text-[10px] uppercase tracking-widest transition-colors ${
                    wave === w
                      ? "border-signal-cyan/60 bg-signal-cyan/10 text-signal-cyan"
                      : "hairline text-ink-300 hover:text-ink-100"
                  }`}
                >
                  {WAVE_LABELS[w]}
                </button>
              ))}
            </div>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Harmonics
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
            <p className="pt-2 text-[11px] text-ink-400">
              Adding more harmonics sharpens the corners. Notice the small overshoot near jumps —
              Gibbs' phenomenon.
            </p>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Layers
            </div>
            <Toggle
              label="Target (white)"
              on={showTarget}
              onChange={setShowTarget}
              accent="text-ink-200"
            />
            <Toggle
              label="Individual harmonics (cyan)"
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
