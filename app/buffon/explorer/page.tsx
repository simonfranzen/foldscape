"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
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

export default function BuffonExplorer() {
  const { a, u } = useI18n();
  const topic = a.topics.buffon;
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
    for (let i = 0; i < n; i++) {
      const x = Math.random() * W;
      const y = Math.random() * H;
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

      // Parallel lines
      ctx.strokeStyle = "rgba(138,144,164,0.35)";
      ctx.lineWidth = 1;
      for (let y = spacing; y < H; y += spacing) {
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
        ctx.fillText("Drop a few needles to begin sampling.", 12, H / 2);
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
  }, [tick, dpr]);

  const piEst = crossings > 0 ? (2 * needleLen * total) / (spacing * crossings) : NaN;
  const errPct = Number.isFinite(piEst) ? (Math.abs(piEst - TRUE_PI) / TRUE_PI) * 100 : NaN;
  const lenRatio = needleLen / spacing;

  return (
    <main className="flex min-h-screen flex-col pt-14">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_420px]">
        <div className="relative flex min-h-[60vh] flex-col gap-4 bg-ink-950 p-4 lg:min-h-[calc(100vh-3.5rem)] lg:p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              Needle drop · d = {spacing}px · ℓ = {needleLen}px ({lenRatio.toFixed(2)} d)
            </div>
            <div
              className={`glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}
            >
              π ≈ 2ℓn / (d·k)
            </div>
          </div>
          <div className="hairline flex-1 overflow-hidden rounded-2xl border bg-ink-950">
            <canvas ref={dropCanvasRef} className="block h-full w-full" />
          </div>
          <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
            Convergence · running π estimate vs needles dropped
          </div>
          <div className="hairline h-44 overflow-hidden rounded-2xl border bg-ink-950">
            <canvas ref={plotCanvasRef} className="block h-full w-full" />
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
              Stats
            </div>
            <dl className="grid grid-cols-2 gap-y-1 font-mono text-sm">
              <dt className="text-ink-300">Drops</dt>
              <dd className="text-right text-ink-100">{total.toLocaleString()}</dd>
              <dt className="text-ink-300">Crossings</dt>
              <dd className="text-right text-ink-100">{crossings.toLocaleString()}</dd>
              <dt className="text-ink-300">π estimate</dt>
              <dd className={`text-right ${ACCENT}`}>
                {Number.isFinite(piEst) ? piEst.toFixed(6) : "—"}
              </dd>
              <dt className="text-ink-300">|error|</dt>
              <dd className="text-right text-ink-100">
                {Number.isFinite(errPct) ? `${errPct.toFixed(3)} %` : "—"}
              </dd>
            </dl>
            {lenRatio > 1 ? (
              <p className="text-[10px] leading-relaxed text-ink-400">
                Note: ℓ &gt; d. The simple formula over-estimates crossings here — the exact closed
                form is more elaborate. The Explorer keeps the basic estimator so you can watch the
                bias appear.
              </p>
            ) : null}
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="flex items-center justify-between">
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                Auto drop
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
                {auto ? "On" : "Off"}
              </button>
            </div>
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Rate · {rate} drops/frame
            </div>
            <input
              type="range"
              value={rate}
              min={1}
              max={500}
              step={1}
              onChange={(e) => setRate(parseInt(e.target.value, 10))}
              className="w-full accent-signal-amber"
            />
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => drop(1000)}
                className="hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-signal-amber/40 hover:text-signal-amber"
              >
                Drop 1 000
              </button>
              <button
                type="button"
                onClick={() => drop(10000)}
                className="hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-signal-amber/40 hover:text-signal-amber"
              >
                Drop 10 000
              </button>
            </div>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Needle length ℓ · {needleLen}px ({lenRatio.toFixed(2)} d)
            </div>
            <input
              type="range"
              value={needleLen}
              min={Math.round(spacing * 0.2)}
              max={Math.round(spacing * 1.5)}
              step={1}
              onChange={(e) => setNeedleLen(parseInt(e.target.value, 10))}
              className="w-full accent-signal-amber"
            />
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Line spacing d · {spacing}px
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
              className="w-full accent-signal-amber"
            />
          </div>

          <div className="hairline border-b p-5">
            <button
              type="button"
              onClick={clear}
              className="hairline block w-full rounded-md border py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-signal-amber/40 hover:text-signal-amber"
            >
              Clear
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
