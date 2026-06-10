"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { useDpr } from "@/lib/hooks/useDpr";
import { palette } from "@/lib/visual/palette";

const R_MIN = 2.5;
const R_MAX = 4.0;

const R_MARKERS: { r: number; label: string }[] = [
  { r: 3.0, label: "2-cycle" },
  { r: 3.449, label: "4-cycle" },
  { r: 3.544, label: "8-cycle" },
  { r: 3.56995, label: "chaos" },
  { r: 3.8284, label: "period-3" },
  { r: 4.0, label: "full chaos" },
];

const SNAP_R: number[] = [3.0, 3.449, 3.56995, 3.8284, 3.9];

type PitchRange = { label: string; min: number; max: number };
const PITCH_RANGES: PitchRange[] = [
  { label: "220–440 Hz", min: 220, max: 440 },
  { label: "220–880 Hz", min: 220, max: 880 },
  { label: "110–880 Hz", min: 110, max: 880 },
  { label: "55–1760 Hz", min: 55, max: 1760 },
];

const WAVES: OscillatorType[] = ["sine", "triangle", "sawtooth", "square"];

// Major scale (semitone offsets from root)
const MAJOR_SCALE = [0, 2, 4, 5, 7, 9, 11];
const QUANT_ROOT = 110; // A2

// Precompute all major-scale frequencies across 12 octaves above A2.
const SCALE_FREQS: number[] = (() => {
  const out: number[] = [];
  for (let oct = 0; oct < 12; oct++) {
    for (const semi of MAJOR_SCALE) {
      out.push(QUANT_ROOT * Math.pow(2, oct + semi / 12));
    }
  }
  return out.sort((a, b) => a - b);
})();

function snapToScale(freq: number): number {
  // Snap in log-frequency to nearest major-scale note.
  const logF = Math.log(freq);
  let best = SCALE_FREQS[0];
  let bestErr = Math.abs(Math.log(best) - logF);
  for (let i = 1; i < SCALE_FREQS.length; i++) {
    const err = Math.abs(Math.log(SCALE_FREQS[i]) - logF);
    if (err < bestErr) {
      bestErr = err;
      best = SCALE_FREQS[i];
    }
  }
  return best;
}

interface AudioRefs {
  ctx: AudioContext;
  master: GainNode;
  voiceGain: GainNode;
  osc: OscillatorNode;
}

export default function LogisticSound() {
  const { a, u } = useI18n();
  const topic = a.topics.logistic;
  const dpr = useDpr();
  const dprRef = useRef(dpr);
  dprRef.current = dpr;

  // Audio state
  const audioRef = useRef<AudioRefs | null>(null);
  const [audioOn, setAudioOn] = useState(false);

  // Parameters (live refs so the RAF loop sees latest values)
  const [r, setR] = useState(3.7);
  const rRef = useRef(r);
  useEffect(() => {
    rRef.current = r;
  }, [r]);

  const [masterGain, setMasterGain] = useState(0.2);
  const masterGainRef = useRef(masterGain);
  useEffect(() => {
    masterGainRef.current = masterGain;
    const refs = audioRef.current;
    if (refs) {
      refs.master.gain.setTargetAtTime(masterGain, refs.ctx.currentTime, 0.05);
    }
  }, [masterGain]);

  const [autoSweep, setAutoSweep] = useState(false);
  const autoSweepRef = useRef(autoSweep);
  useEffect(() => {
    autoSweepRef.current = autoSweep;
  }, [autoSweep]);

  const [sweepSeconds, setSweepSeconds] = useState(120);
  const sweepSecondsRef = useRef(sweepSeconds);
  useEffect(() => {
    sweepSecondsRef.current = sweepSeconds;
  }, [sweepSeconds]);

  const [iterRate, setIterRate] = useState(10);
  const iterRateRef = useRef(iterRate);
  useEffect(() => {
    iterRateRef.current = iterRate;
  }, [iterRate]);

  const [pitchRangeIdx, setPitchRangeIdx] = useState(1);
  const pitchRangeRef = useRef(PITCH_RANGES[pitchRangeIdx]);
  useEffect(() => {
    pitchRangeRef.current = PITCH_RANGES[pitchRangeIdx];
  }, [pitchRangeIdx]);

  const [quantize, setQuantize] = useState(false);
  const quantizeRef = useRef(quantize);
  useEffect(() => {
    quantizeRef.current = quantize;
  }, [quantize]);

  const [waveIdx, setWaveIdx] = useState(0);
  useEffect(() => {
    const refs = audioRef.current;
    if (refs) refs.osc.type = WAVES[waveIdx];
  }, [waveIdx]);

  // Iterate history for the scrolling strip chart.
  const HISTORY_MAX = 200;
  const historyRef = useRef<number[]>([]);
  const xRef = useRef(0.4);

  // Strip chart canvas
  const stripRef = useRef<HTMLCanvasElement | null>(null);
  // r-axis canvas
  const rAxisRef = useRef<HTMLCanvasElement | null>(null);

  // Animation / iteration loop
  useEffect(() => {
    let raf = 0;
    let lastIterTime = performance.now();
    let lastSweepTime = performance.now();

    const draw = () => {
      // Strip chart
      const canvas = stripRef.current;
      if (canvas) {
        const W = canvas.clientWidth;
        const H = canvas.clientHeight;
        const dpr = dprRef.current;
        if (canvas.width !== Math.floor(W * dpr) || canvas.height !== Math.floor(H * dpr)) {
          canvas.width = Math.floor(W * dpr);
          canvas.height = Math.floor(H * dpr);
        }
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          ctx.fillStyle = palette.canvas.bg;
          ctx.fillRect(0, 0, W, H);

          // Horizontal grid
          ctx.strokeStyle = "rgba(138,144,164,0.1)";
          ctx.lineWidth = 1;
          for (let i = 0; i <= 4; i++) {
            const y = (i / 4) * H;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(W, y);
            ctx.stroke();
          }

          // Iterates as scrolling dots; newest on the right.
          const hist = historyRef.current;
          const n = hist.length;
          ctx.fillStyle = palette.signal.rose;
          for (let i = 0; i < n; i++) {
            const px = (i / (HISTORY_MAX - 1)) * W;
            const py = (1 - hist[i]) * H;
            const radius = 1.4 + (i / Math.max(1, n - 1)) * 1.6;
            ctx.beginPath();
            ctx.arc(px, py, radius, 0, Math.PI * 2);
            ctx.fill();
          }

          // Y-axis labels
          ctx.fillStyle = "rgba(138,144,164,0.7)";
          ctx.font = "10px ui-monospace, monospace";
          ctx.fillText("x = 1", 6, 12);
          ctx.fillText("x = 0", 6, H - 4);
        }
      }

      // r-axis
      const axis = rAxisRef.current;
      if (axis) {
        const W = axis.clientWidth;
        const H = axis.clientHeight;
        const dpr = dprRef.current;
        if (axis.width !== Math.floor(W * dpr) || axis.height !== Math.floor(H * dpr)) {
          axis.width = Math.floor(W * dpr);
          axis.height = Math.floor(H * dpr);
        }
        const ctx = axis.getContext("2d");
        if (ctx) {
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          ctx.fillStyle = palette.canvas.bg;
          ctx.fillRect(0, 0, W, H);

          // Track
          ctx.fillStyle = "rgba(138,144,164,0.2)";
          ctx.fillRect(0, H / 2 - 1, W, 2);

          // Markers
          ctx.font = "10px ui-monospace, monospace";
          for (const m of R_MARKERS) {
            const x = ((m.r - R_MIN) / (R_MAX - R_MIN)) * W;
            ctx.strokeStyle = "rgba(125, 243, 255, 0.45)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x, H / 2 - 8);
            ctx.lineTo(x, H / 2 + 8);
            ctx.stroke();
            ctx.fillStyle = "rgba(125, 243, 255, 0.7)";
            ctx.fillText(m.r.toFixed(3), x + 4, H / 2 - 6);
            ctx.fillStyle = "rgba(138,144,164,0.7)";
            ctx.fillText(m.label, x + 4, H - 4);
          }

          // Current r cursor
          const cx = ((rRef.current - R_MIN) / (R_MAX - R_MIN)) * W;
          ctx.strokeStyle = palette.signal.rose;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(cx, 0);
          ctx.lineTo(cx, H);
          ctx.stroke();
          ctx.fillStyle = palette.signal.rose;
          ctx.beginPath();
          ctx.arc(cx, H / 2, 5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const tick = () => {
      const now = performance.now();
      const dtSec = (now - lastSweepTime) / 1000;
      lastSweepTime = now;

      // Auto-sweep r
      if (autoSweepRef.current) {
        const speed = (R_MAX - R_MIN) / Math.max(5, sweepSecondsRef.current);
        let newR = rRef.current + speed * dtSec;
        if (newR > R_MAX) newR = R_MIN;
        rRef.current = newR;
        setR(newR);
      }

      // Iteration ticks
      const period = 1000 / Math.max(0.5, iterRateRef.current);
      let safety = 0;
      while (now - lastIterTime >= period && safety < 50) {
        lastIterTime += period;
        safety++;
        // Compute next iterate
        const rNow = rRef.current;
        let x = rNow * xRef.current * (1 - xRef.current);
        if (!isFinite(x) || x < 0 || x > 1) x = Math.random() * 0.5 + 0.25;
        xRef.current = x;

        // Push to history
        const hist = historyRef.current;
        hist.push(x);
        if (hist.length > HISTORY_MAX) hist.shift();

        // Sonify
        const refs = audioRef.current;
        if (refs) {
          const pr = pitchRangeRef.current;
          const logFmin = Math.log(pr.min);
          const logFmax = Math.log(pr.max);
          let freq = Math.exp(logFmin + (logFmax - logFmin) * x);
          if (quantizeRef.current) freq = snapToScale(freq);
          const t = refs.ctx.currentTime;
          refs.osc.frequency.setTargetAtTime(freq, t, 0.01);
          // Soft pluck: quick rise then decay on the voice gain.
          const g = refs.voiceGain.gain;
          g.cancelScheduledValues(t);
          g.setValueAtTime(g.value, t);
          g.linearRampToValueAtTime(1.0, t + 0.005);
          g.setTargetAtTime(0.0, t + 0.01, 0.08);
        }
      }

      draw();
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      const refs = audioRef.current;
      if (refs) {
        try {
          refs.osc.stop();
        } catch {
          // already stopped
        }
        refs.ctx.close().catch(() => undefined);
        audioRef.current = null;
      }
    };
  }, []);

  const toggleAudio = async () => {
    if (audioOn) {
      const refs = audioRef.current;
      if (refs) {
        try {
          refs.osc.stop();
        } catch {
          // already stopped
        }
        await refs.ctx.close().catch(() => undefined);
        audioRef.current = null;
      }
      setAudioOn(false);
      return;
    }
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctor();
    await ctx.resume();
    const master = ctx.createGain();
    master.gain.value = masterGainRef.current;
    master.connect(ctx.destination);
    const voiceGain = ctx.createGain();
    voiceGain.gain.value = 0;
    voiceGain.connect(master);
    const osc = ctx.createOscillator();
    osc.type = WAVES[waveIdx];
    osc.frequency.value = 440;
    osc.connect(voiceGain);
    osc.start();
    audioRef.current = { ctx, master, voiceGain, osc };
    setAudioOn(true);
  };

  return (
    <main className="flex min-h-screen flex-col pt-14">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_420px]">
        <div className="relative flex min-h-[60vh] flex-col gap-4 bg-ink-950 p-4 lg:min-h-[calc(100vh-3.5rem)] lg:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              Listening to the cascade · last {HISTORY_MAX} iterates
            </div>
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-coral">
              xₙ₊₁ = r · xₙ (1 − xₙ)
            </div>
          </div>
          <div className="hairline flex-1 overflow-hidden rounded-2xl border bg-ink-950">
            <canvas ref={stripRef} className="block h-full w-full" />
          </div>
          <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
            r-axis · r ∈ [{R_MIN}, {R_MAX}] · current r = {r.toFixed(4)}
          </div>
          <div className="hairline h-20 overflow-hidden rounded-2xl border bg-ink-950">
            <canvas ref={rAxisRef} className="block h-full w-full" />
          </div>
        </div>

        <aside className="hairline scrollbar-thin flex flex-col overflow-y-auto border-l bg-ink-900/40">
          <div className="hairline space-y-3 border-b p-6">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-coral">
              {topic.title}
            </div>
            <h1 className="math-italic text-3xl leading-tight text-ink-100">{topic.tagline}</h1>
            <p className="text-sm leading-relaxed text-ink-200">
              Each new iterate xₙ becomes a tone. At low r you hear one steady note (a fixed point).
              Past r = 3 the note splits in two and you hear a 2-note oscillation, then 4, then 8 —
              a period-doubling cascade. Past r ≈ 3.5699 the pitches scatter into noise.
            </p>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <button
              onClick={toggleAudio}
              className={`w-full rounded-md border px-4 py-2 font-mono text-[11px] uppercase tracking-widest2 transition-colors ${
                audioOn
                  ? "border-signal-coral/60 bg-signal-coral/10 text-signal-coral"
                  : "border-signal-cyan/60 bg-signal-cyan/10 text-signal-cyan hover:bg-signal-cyan/20"
              }`}
            >
              {audioOn ? "● stop audio" : "○ start audio"}
            </button>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                  Master gain
                </span>
                <span className="font-mono text-[10px] text-signal-coral">
                  {masterGain.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                value={masterGain}
                min={0}
                max={0.4}
                step={0.005}
                onChange={(e) => setMasterGain(parseFloat(e.target.value))}
                className="w-full accent-signal-coral"
              />
            </div>
          </div>

          <div className="hairline space-y-4 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Growth rate r
            </div>
            <div className="flex items-center justify-between font-mono text-sm">
              <span className="text-signal-coral">{r.toFixed(4)}</span>
            </div>
            <input
              type="range"
              value={r}
              min={R_MIN}
              max={R_MAX}
              step={0.0005}
              onChange={(e) => setR(parseFloat(e.target.value))}
              className="w-full accent-signal-coral"
            />
            <div className="grid grid-cols-5 gap-1">
              {SNAP_R.map((sr) => (
                <button
                  key={sr}
                  onClick={() => setR(sr)}
                  className={`rounded-md border px-2 py-1.5 font-mono text-[10px] transition-colors ${
                    Math.abs(r - sr) < 0.001
                      ? "border-signal-coral/60 bg-signal-coral/10 text-signal-coral"
                      : "hairline text-ink-200 hover:border-signal-coral/40 hover:text-ink-100"
                  }`}
                >
                  {sr}
                </button>
              ))}
            </div>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <label className="flex cursor-pointer items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                Auto-sweep r
              </span>
              <input
                type="checkbox"
                checked={autoSweep}
                onChange={(e) => setAutoSweep(e.target.checked)}
                className="h-4 w-4 accent-signal-coral"
              />
            </label>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                  Sweep duration
                </span>
                <span className="font-mono text-[10px] text-signal-coral">{sweepSeconds}s</span>
              </div>
              <input
                type="range"
                value={sweepSeconds}
                min={30}
                max={240}
                step={1}
                onChange={(e) => setSweepSeconds(parseInt(e.target.value))}
                className="w-full accent-signal-coral"
                disabled={!autoSweep}
              />
            </div>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                  Iteration rate
                </span>
                <span className="font-mono text-[10px] text-signal-coral">{iterRate} / s</span>
              </div>
              <input
                type="range"
                value={iterRate}
                min={2}
                max={40}
                step={1}
                onChange={(e) => setIterRate(parseInt(e.target.value))}
                className="w-full accent-signal-coral"
              />
            </div>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Pitch range
            </div>
            <div className="grid grid-cols-2 gap-1">
              {PITCH_RANGES.map((pr, i) => (
                <button
                  key={pr.label}
                  onClick={() => setPitchRangeIdx(i)}
                  className={`rounded-md border px-2 py-1.5 font-mono text-[10px] transition-colors ${
                    pitchRangeIdx === i
                      ? "border-signal-coral/60 bg-signal-coral/10 text-signal-coral"
                      : "hairline text-ink-200 hover:border-signal-coral/40 hover:text-ink-100"
                  }`}
                >
                  {pr.label}
                </button>
              ))}
            </div>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <label className="flex cursor-pointer items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                Quantize to major scale
              </span>
              <input
                type="checkbox"
                checked={quantize}
                onChange={(e) => setQuantize(e.target.checked)}
                className="h-4 w-4 accent-signal-coral"
              />
            </label>
            <p className="font-mono text-[10px] leading-relaxed text-ink-400">
              Off: continuous pitch. On: snap each tone to the nearest note of A major (root A2).
            </p>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Sound source
            </div>
            <div className="grid grid-cols-4 gap-1">
              {WAVES.map((w, i) => (
                <button
                  key={w}
                  onClick={() => setWaveIdx(i)}
                  className={`rounded-md border px-2 py-1.5 font-mono text-[10px] uppercase transition-colors ${
                    waveIdx === i
                      ? "border-signal-coral/60 bg-signal-coral/10 text-signal-coral"
                      : "hairline text-ink-200 hover:border-signal-coral/40 hover:text-ink-100"
                  }`}
                >
                  {w}
                </button>
              ))}
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
