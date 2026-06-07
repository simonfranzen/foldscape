"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { Info } from "@/components/Info";

type WaveType = "square" | "sawtooth" | "triangle" | "pulse";

const WAVE_LABELS: Record<WaveType, string> = {
  square: "Square",
  sawtooth: "Sawtooth",
  triangle: "Triangle",
  pulse: "Pulse",
};

const MAX_HARMONICS = 32;
const CUSTOM_BANK_SIZE = 8;

function canonicalCoefficient(wave: WaveType, k: number): number {
  if (wave === "square") {
    return k % 2 === 1 ? 4 / (Math.PI * k) : 0;
  }
  if (wave === "sawtooth") {
    return ((2 / Math.PI) * (k % 2 === 0 ? -1 : 1)) / k;
  }
  if (wave === "triangle") {
    if (k % 2 === 0) return 0;
    return (8 / (Math.PI * Math.PI) / (k * k)) * Math.sin((k * Math.PI) / 2);
  }
  // pulse
  return 0.4 / k;
}

function makeAudioContext(): AudioContext {
  type WindowWithWebkit = Window & {
    webkitAudioContext?: typeof AudioContext;
  };
  const w = window as WindowWithWebkit;
  const Ctor = window.AudioContext ?? w.webkitAudioContext;
  if (!Ctor) throw new Error("WebAudio not supported");
  return new Ctor();
}

interface Voice {
  osc: OscillatorNode;
  gain: GainNode;
}

export default function FourierSoundPage() {
  const { a, u } = useI18n();
  const topic = a.topics.fourier;

  // Audio state
  const [audioOn, setAudioOn] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const voicesRef = useRef<Voice[]>([]);
  const analyserBufferRef = useRef<Float32Array<ArrayBuffer> | null>(null);

  // Controls
  const [masterGain, setMasterGain] = useState(0.2);
  const [baseFreq, setBaseFreq] = useState(220);
  const [wave, setWave] = useState<WaveType>("square");
  const [numHarmonics, setNumHarmonics] = useState(8);
  const [customMode, setCustomMode] = useState(false);
  const [customAmps, setCustomAmps] = useState<number[]>(() =>
    Array.from({ length: CUSTOM_BANK_SIZE }, (_, i) => canonicalCoefficient("square", i + 1)),
  );
  const [sweep, setSweep] = useState(false);

  // Latest values for audio loop, kept in refs to avoid teardown on every change
  const masterGainRef = useRef(masterGain);
  const baseFreqRef = useRef(baseFreq);
  const waveRef = useRef<WaveType>(wave);
  const numHarmonicsRef = useRef(numHarmonics);
  const customModeRef = useRef(customMode);
  const customAmpsRef = useRef(customAmps);
  const sweepRef = useRef(sweep);
  const sweepPhaseRef = useRef(0);

  useEffect(() => {
    masterGainRef.current = masterGain;
  }, [masterGain]);
  useEffect(() => {
    baseFreqRef.current = baseFreq;
  }, [baseFreq]);
  useEffect(() => {
    waveRef.current = wave;
  }, [wave]);
  useEffect(() => {
    numHarmonicsRef.current = numHarmonics;
  }, [numHarmonics]);
  useEffect(() => {
    customModeRef.current = customMode;
  }, [customMode]);
  useEffect(() => {
    customAmpsRef.current = customAmps;
  }, [customAmps]);
  useEffect(() => {
    sweepRef.current = sweep;
  }, [sweep]);

  // Resolve current amplitude for harmonic k (1-based)
  const ampFor = useCallback(
    (w: WaveType, k: number, custom: boolean, customs: number[]): number => {
      if (custom && k <= customs.length) return customs[k - 1];
      return canonicalCoefficient(w, k);
    },
    [],
  );

  // Compute effective base frequency (with optional sweep)
  const effectiveBase = useCallback((): number => {
    if (!sweepRef.current) return baseFreqRef.current;
    // 0.2 Hz sine, range 110..660
    const center = (110 + 660) / 2;
    const halfRange = (660 - 110) / 2;
    return center + Math.sin(sweepPhaseRef.current) * halfRange;
  }, []);

  // Push current parameter values into the audio graph
  const updateAudio = useCallback(() => {
    const ctx = ctxRef.current;
    const master = masterRef.current;
    if (!ctx || !master) return;
    const now = ctx.currentTime;
    const tc = 0.04;

    master.gain.setTargetAtTime(masterGainRef.current, now, tc);

    const base = effectiveBase();
    const N = numHarmonicsRef.current;
    const w = waveRef.current;
    const custom = customModeRef.current;
    const customs = customAmpsRef.current;

    const coeffs: number[] = [];
    let maxAbs = 0;
    for (let k = 1; k <= MAX_HARMONICS; k++) {
      const a = k <= N ? ampFor(w, k, custom, customs) : 0;
      coeffs.push(a);
      if (Math.abs(a) > maxAbs) maxAbs = Math.abs(a);
    }
    // Normalise so the loudest partial sits at ~1/N(active) — keeps overall level stable
    const norm = maxAbs > 0 ? 1 / maxAbs : 1;

    for (let i = 0; i < voicesRef.current.length; i++) {
      const v = voicesRef.current[i];
      const k = i + 1;
      const freq = base * k;
      v.osc.frequency.setTargetAtTime(freq, now, tc);
      // Per-harmonic gain: divide by k-ish via the canonical coefficients themselves;
      // they already encode roll-off. We multiply by 1/sqrt(active) so dense stacks
      // don't clip — sin partials with random phases sum incoherently.
      const activeCount = Math.min(N, MAX_HARMONICS);
      const headroom = 1 / Math.sqrt(Math.max(1, activeCount));
      const target = coeffs[i] * norm * headroom;
      v.gain.gain.setTargetAtTime(target, now, tc);
    }
  }, [ampFor, effectiveBase]);

  // Start / stop audio
  const startAudio = useCallback(async () => {
    if (ctxRef.current) return;
    const ctx = makeAudioContext();
    await ctx.resume();
    ctxRef.current = ctx;

    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    masterRef.current = master;

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0;
    master.connect(analyser);
    analyserRef.current = analyser;
    analyserBufferRef.current = new Float32Array(new ArrayBuffer(analyser.fftSize * 4));

    const voices: Voice[] = [];
    for (let k = 1; k <= MAX_HARMONICS; k++) {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = baseFreqRef.current * k;
      const gain = ctx.createGain();
      gain.gain.value = 0;
      osc.connect(gain).connect(master);
      osc.start();
      voices.push({ osc, gain });
    }
    voicesRef.current = voices;
    updateAudio();
    setAudioOn(true);
  }, [updateAudio]);

  const stopAudio = useCallback(() => {
    const ctx = ctxRef.current;
    const master = masterRef.current;
    if (!ctx || !master) {
      setAudioOn(false);
      return;
    }
    const now = ctx.currentTime;
    master.gain.setTargetAtTime(0, now, 0.08);
    const voicesAtStop = voicesRef.current;
    voicesRef.current = [];
    masterRef.current = null;
    analyserRef.current = null;
    analyserBufferRef.current = null;
    ctxRef.current = null;
    setAudioOn(false);
    window.setTimeout(() => {
      for (const v of voicesAtStop) {
        try {
          v.osc.stop();
        } catch {
          // ignore
        }
      }
      ctx.close().catch(() => {
        // ignore
      });
    }, 220);
  }, []);

  // Tear down on unmount
  useEffect(() => {
    return () => {
      const ctx = ctxRef.current;
      if (ctx) {
        for (const v of voicesRef.current) {
          try {
            v.osc.stop();
          } catch {
            // ignore
          }
        }
        ctx.close().catch(() => {
          // ignore
        });
      }
    };
  }, []);

  // Push parameter changes into the graph whenever they change
  useEffect(() => {
    if (audioOn) updateAudio();
  }, [audioOn, masterGain, baseFreq, wave, numHarmonics, customMode, customAmps, updateAudio]);

  // Sweep + oscilloscope draw loop
  const scopeRef = useRef<HTMLCanvasElement | null>(null);
  const spectrumRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const scope = scopeRef.current;
    const spectrum = spectrumRef.current;
    if (!scope || !spectrum) return;
    const sctx = scope.getContext("2d");
    const pctx = spectrum.getContext("2d");
    if (!sctx || !pctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    let last = performance.now();

    const resize = (canvas: HTMLCanvasElement) => {
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      const c = canvas.getContext("2d");
      if (c) c.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const ro = new ResizeObserver(() => {
      resize(scope);
      resize(spectrum);
    });
    ro.observe(scope);
    ro.observe(spectrum);
    resize(scope);
    resize(spectrum);

    const draw = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;

      // Update sweep phase
      if (sweepRef.current) {
        sweepPhaseRef.current += 2 * Math.PI * 0.2 * dt;
        if (audioOn) updateAudio();
      }

      // Oscilloscope
      const sW = scope.clientWidth;
      const sH = scope.clientHeight;
      sctx.fillStyle = "#06070d";
      sctx.fillRect(0, 0, sW, sH);
      sctx.strokeStyle = "rgba(138,144,164,0.15)";
      sctx.lineWidth = 1;
      sctx.beginPath();
      sctx.moveTo(0, sH / 2);
      sctx.lineTo(sW, sH / 2);
      sctx.stroke();

      const analyser = analyserRef.current;
      const buf = analyserBufferRef.current;
      if (analyser && buf) {
        analyser.getFloatTimeDomainData(buf);
        sctx.strokeStyle = "#7df3ff";
        sctx.shadowColor = "#7df3ff";
        sctx.shadowBlur = 8;
        sctx.lineWidth = 1.6;
        sctx.beginPath();
        // Show ~2 periods of the fundamental
        const base = effectiveBase();
        const sampleRate = ctxRef.current?.sampleRate ?? 44100;
        const periodSamples = sampleRate / Math.max(1, base);
        const visible = Math.min(buf.length, Math.floor(periodSamples * 2.5));
        for (let i = 0; i < visible; i++) {
          const x = (i / (visible - 1)) * sW;
          const v = buf[i];
          const y = sH / 2 - v * (sH / 2 - 8);
          if (i === 0) sctx.moveTo(x, y);
          else sctx.lineTo(x, y);
        }
        sctx.stroke();
        sctx.shadowBlur = 0;
      } else {
        sctx.fillStyle = "rgba(168,175,191,0.4)";
        sctx.font = "12px ui-monospace, monospace";
        sctx.fillText("audio off — press start", 16, sH / 2 - 6);
      }

      // Spectrum
      const pW = spectrum.clientWidth;
      const pH = spectrum.clientHeight;
      pctx.fillStyle = "#06070d";
      pctx.fillRect(0, 0, pW, pH);

      const N = numHarmonicsRef.current;
      const w = waveRef.current;
      const custom = customModeRef.current;
      const customs = customAmpsRef.current;
      let maxAbs = 0;
      const amps: number[] = [];
      for (let k = 1; k <= N; k++) {
        const aVal = custom && k <= customs.length ? customs[k - 1] : canonicalCoefficient(w, k);
        amps.push(aVal);
        if (Math.abs(aVal) > maxAbs) maxAbs = Math.abs(aVal);
      }
      const denom = Math.max(0.1, maxAbs);
      const barW = pW / N;
      for (let i = 0; i < N; i++) {
        const aVal = amps[i];
        const bx = i * barW + 2;
        const bh = (Math.abs(aVal) / denom) * (pH - 28);
        const by = pH - bh - 14;
        pctx.fillStyle = aVal >= 0 ? "rgba(125,243,255,0.85)" : "rgba(255,122,182,0.85)";
        pctx.fillRect(bx, by, Math.max(1, barW - 4), bh);
        if (barW > 18) {
          pctx.fillStyle = "rgba(168,175,191,0.55)";
          pctx.font = "10px ui-monospace, monospace";
          pctx.fillText(`k${i + 1}`, bx + 2, pH - 4);
        }
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [audioOn, effectiveBase, updateAudio]);

  // When the target waveform changes (and we're not in custom mode),
  // seed the custom bank to the canonical values for the new wave so toggling
  // into custom feels intuitive.
  useEffect(() => {
    if (customMode) return;
    setCustomAmps(
      Array.from({ length: CUSTOM_BANK_SIZE }, (_, i) => canonicalCoefficient(wave, i + 1)),
    );
  }, [wave, customMode]);

  const toggleAudio = () => {
    if (audioOn) stopAudio();
    else void startAudio();
  };

  return (
    <main className="flex min-h-screen flex-col pt-14">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_420px]">
        <div className="relative flex min-h-[60vh] flex-col gap-4 bg-ink-950 p-4 lg:min-h-[calc(100vh-3.5rem)] lg:p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              {WAVE_LABELS[wave]} · {numHarmonics} harmonic{numHarmonics === 1 ? "" : "s"} ·{" "}
              {Math.round(baseFreq)} Hz
              {sweep && <span className="text-signal-cyan"> · sweeping</span>}
            </div>
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
              live oscilloscope
            </div>
          </div>
          <div className="hairline flex-1 overflow-hidden rounded-2xl border bg-ink-950">
            <canvas ref={scopeRef} className="block h-full w-full" />
          </div>
          <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
            Spectrum · amplitude per harmonic ({customMode ? "custom" : "auto"})
          </div>
          <div className="hairline h-32 overflow-hidden rounded-2xl border bg-ink-950">
            <canvas ref={spectrumRef} className="block h-full w-full" />
          </div>
        </div>

        <aside className="hairline scrollbar-thin flex flex-col overflow-y-auto border-l bg-ink-900/40">
          <div className="hairline space-y-3 border-b p-6">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
              {topic.title} · Sound
            </div>
            <h1 className="math-italic text-3xl leading-tight text-ink-100">{topic.tagline}</h1>
            <p className="text-sm leading-relaxed text-ink-200">
              You are hearing the same partial Fourier sum the visual explorer draws — each harmonic
              is a real sine oscillator running through WebAudio. Add harmonics, swap targets, or
              drag individual amplitudes to sculpt the timbre in real time.
            </p>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <button
              onClick={toggleAudio}
              className={`w-full rounded-md border px-4 py-2.5 font-mono text-[11px] uppercase tracking-widest2 transition-colors ${
                audioOn
                  ? "border-signal-rose/60 bg-signal-rose/10 text-signal-rose hover:bg-signal-rose/20"
                  : "border-signal-cyan/70 bg-signal-cyan/10 text-signal-cyan hover:bg-signal-cyan/20"
              }`}
            >
              {audioOn ? "● stop audio" : "○ start audio"}
            </button>
            <Slider
              label="Master gain"
              value={masterGain}
              min={0}
              max={0.4}
              step={0.005}
              format={(v) => v.toFixed(2)}
              onChange={setMasterGain}
            />
            <Slider
              label="Base frequency (Hz)"
              value={baseFreq}
              min={55}
              max={880}
              step={1}
              format={(v) => `${Math.round(v)}`}
              onChange={setBaseFreq}
              disabled={sweep}
            />
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Target wave
              <Info side="bottom">
                Each wave has a known recipe of sine partials. In Auto mode the harmonics follow
                that recipe; in Custom mode the first eight are yours to shape.
              </Info>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(WAVE_LABELS) as WaveType[]).map((w) => (
                <button
                  key={w}
                  onClick={() => setWave(w)}
                  className={`rounded-md border py-2 font-mono text-[10px] uppercase tracking-widest transition-colors ${
                    wave === w
                      ? "border-signal-cyan/70 bg-signal-cyan/10 text-signal-cyan"
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
              <span className="text-signal-cyan">{numHarmonics}</span>
              <span className="text-[10px] text-ink-400">max {MAX_HARMONICS}</span>
            </div>
            <input
              type="range"
              value={numHarmonics}
              min={1}
              max={MAX_HARMONICS}
              step={1}
              onChange={(e) => setNumHarmonics(parseInt(e.target.value))}
              className="w-full accent-signal-cyan"
            />
            <div className="grid grid-cols-4 gap-2 pt-1">
              {[1, 3, 8, 24].map((n) => (
                <button
                  key={n}
                  onClick={() => setNumHarmonics(n)}
                  className={`rounded-md border py-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors ${
                    numHarmonics === n
                      ? "border-signal-cyan/70 text-signal-cyan"
                      : "hairline text-ink-300 hover:text-ink-100"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="flex items-center justify-between">
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                Partial amplitudes
              </div>
              <button
                onClick={() => setCustomMode((v) => !v)}
                className={`rounded-md border px-2 py-1 font-mono text-[9px] uppercase tracking-widest transition-colors ${
                  customMode
                    ? "border-signal-cyan/70 bg-signal-cyan/10 text-signal-cyan"
                    : "hairline text-ink-300 hover:text-ink-100"
                }`}
              >
                {customMode ? "custom" : "auto"}
              </button>
            </div>
            <div className="space-y-2 pt-1">
              {customAmps.map((v, i) => (
                <label key={i} className="block">
                  <div className="mb-0.5 flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                      k{i + 1}
                    </span>
                    <span className="font-mono text-[10px] text-signal-cyan">{v.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    value={v}
                    min={-1.3}
                    max={1.3}
                    step={0.01}
                    disabled={!customMode}
                    onChange={(e) => {
                      const next = customAmps.slice();
                      next[i] = parseFloat(e.target.value);
                      setCustomAmps(next);
                    }}
                    className="w-full accent-signal-cyan disabled:opacity-40"
                  />
                </label>
              ))}
            </div>
            <p className="pt-1 text-[11px] text-ink-400">
              In Auto, partials k &gt; 8 follow the target wave&apos;s recipe. In Custom, partials k
              &gt; 8 are silenced — you are sculpting the first eight.
            </p>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <Toggle label="Sweep frequency" on={sweep} onChange={setSweep} />
            <p className="text-[11px] text-ink-400">
              Slowly modulates the fundamental between 110 and 660 Hz at 0.2 Hz. The harmonic
              spacing stretches with it.
            </p>
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

function Slider({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
  disabled = false,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <div className="mb-1 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
          {label}
        </span>
        <span className="font-mono text-[10px] text-signal-cyan">{format(value)}</span>
      </div>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-signal-cyan disabled:opacity-40"
      />
    </label>
  );
}

function Toggle({
  label,
  on,
  onChange,
}: {
  label: string;
  on: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={`flex w-full items-center justify-between rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest transition-colors ${
        on ? "border-signal-cyan/60 bg-signal-cyan/5 text-signal-cyan" : "hairline text-ink-300"
      }`}
    >
      <span>{label}</span>
      <span className="text-base">{on ? "●" : "○"}</span>
    </button>
  );
}
