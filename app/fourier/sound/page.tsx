"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import type { Locale } from "@/lib/i18n/types";
import { Info } from "@/components/Info";
import { useDpr } from "@/lib/hooks/useDpr";
import { palette } from "@/lib/visual/palette";
import { ExplorerGuideSection, ExplorerHelpButton } from "@/components/ExplorerGuide";
import { FOURIER_SOUND_GUIDE } from "@/lib/explorer-guides/fourier-sound";
import {
  CUSTOM_BANK_SIZE,
  MAX_HARMONICS,
  canonicalCoefficient,
  partialAmplitude,
  partialGains,
  partialSum,
  usesCosine,
  type WaveType,
} from "@/lib/fourier/soundRecipes";

// --------------------------------------------------------------------------
// Per-locale UI strings. EN and DE are filled in; the other locales fall back
// to EN at the call site until they are translated.
// --------------------------------------------------------------------------

type RichExplorer = {
  waves: Record<WaveType, string>;
  harmonicsCount: (n: number) => string;
  sweeping: string;
  liveScope: string;
  staticScope: string;
  spectrum: string;
  custom: string;
  auto: string;
  soundSuffix: string;
  intro: string;
  startAudio: string;
  stopAudio: string;
  masterGain: string;
  baseFreq: string;
  targetWave: string;
  targetInfo: string;
  harmonics: string;
  max: string;
  partialAmps: string;
  partialNote: string;
  sweep: string;
  sweepNote: string;
  audioOff: string;
};

const RICH_EXPLORER: { en: RichExplorer } & Partial<Record<Locale, RichExplorer>> = {
  en: {
    waves: { square: "Square", sawtooth: "Sawtooth", triangle: "Triangle", pulse: "Pulse 25%" },
    harmonicsCount: (n) => `${n} harmonic${n === 1 ? "" : "s"}`,
    sweeping: "sweeping",
    liveScope: "live oscilloscope",
    staticScope: "waveform (static)",
    spectrum: "Spectrum · amplitude per harmonic",
    custom: "custom",
    auto: "auto",
    soundSuffix: "Sound",
    intro:
      "You are hearing the same partial Fourier sum the visual explorer draws: each harmonic is a real oscillator running through WebAudio. Add harmonics, swap targets, or drag individual amplitudes to sculpt the timbre in real time.",
    startAudio: "○ start audio",
    stopAudio: "● stop audio",
    masterGain: "Master gain",
    baseFreq: "Base frequency (Hz)",
    targetWave: "Target wave",
    targetInfo:
      "Each wave has a known recipe of harmonic partials. In Auto mode the harmonics follow that recipe; in Custom mode the first eight are yours to shape.",
    harmonics: "Harmonics",
    max: "max",
    partialAmps: "Partial amplitudes",
    partialNote:
      "In Auto, partials k > 8 follow the target wave's recipe. In Custom, partials k > 8 are silenced: you are sculpting the first eight.",
    sweep: "Sweep frequency",
    sweepNote:
      "Slowly modulates the fundamental between 110 and 660 Hz at 0.2 Hz. The harmonic spacing stretches with it.",
    audioOff: "audio off, press start",
  },
  de: {
    waves: { square: "Rechteck", sawtooth: "Sägezahn", triangle: "Dreieck", pulse: "Puls 25 %" },
    harmonicsCount: (n) => `${n} Harmonische`,
    sweeping: "Sweep läuft",
    liveScope: "Live-Oszilloskop",
    staticScope: "Wellenform (statisch)",
    spectrum: "Spektrum · Amplitude je Harmonische",
    custom: "eigene",
    auto: "auto",
    soundSuffix: "Klang",
    intro:
      "Du hörst dieselbe Fourier-Teilsumme, die der visuelle Explorer zeichnet: Jede Harmonische ist ein echter Oszillator, der über WebAudio läuft. Füge Harmonische hinzu, wechsle das Ziel oder zieh einzelne Amplituden, um die Klangfarbe in Echtzeit zu formen.",
    startAudio: "○ Audio starten",
    stopAudio: "● Audio stoppen",
    masterGain: "Gesamtlautstärke",
    baseFreq: "Grundfrequenz (Hz)",
    targetWave: "Zielwelle",
    targetInfo:
      "Jede Welle hat ein bekanntes Rezept aus harmonischen Teiltönen. Im Modus «auto» folgen die Harmonischen diesem Rezept, im Modus «eigene» formst du die ersten acht selbst.",
    harmonics: "Harmonische",
    max: "max.",
    partialAmps: "Teiltonamplituden",
    partialNote:
      "In «auto» folgen die Teiltöne k > 8 dem Rezept der Zielwelle. In «eigene» sind die Teiltöne k > 8 stumm: Du formst die ersten acht.",
    sweep: "Frequenz-Sweep",
    sweepNote:
      "Verschiebt den Grundton langsam zwischen 110 und 660 Hz, mit 0,2 Hz. Der Abstand der Harmonischen dehnt sich mit.",
    audioOff: "Audio aus, drück Start",
  },
};

const WAVES: WaveType[] = ["square", "sawtooth", "triangle", "pulse"];

function makeAudioContext(): AudioContext {
  type WindowWithWebkit = Window & {
    webkitAudioContext?: typeof AudioContext;
  };
  const w = window as WindowWithWebkit;
  const Ctor = window.AudioContext ?? w.webkitAudioContext;
  if (!Ctor) throw new Error("WebAudio not supported");
  return new Ctor();
}

// One harmonic. Both phases run all the time and only the gains move, so
// switching between sine-based and cosine-based recipes is a smooth crossfade
// instead of a phase jump (which would click).
interface Voice {
  sin: OscillatorNode;
  cos: OscillatorNode;
  sinGain: GainNode;
  cosGain: GainNode;
}

export default function FourierSoundPage() {
  const { a, u, locale } = useI18n();
  const topic = a.topics.fourier;
  const tx = RICH_EXPLORER[locale] ?? RICH_EXPLORER.en;
  const dpr = useDpr();

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
  const [reduced, setReduced] = useState(false);

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

  // Track prefers-reduced-motion and re-subscribe so a system-setting change
  // swaps between the live trace and a still picture.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(m.matches);
    on();
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);

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

    const gains = partialGains(w, N, custom, customs);
    const cosine = usesCosine(w);
    for (let i = 0; i < voicesRef.current.length; i++) {
      const v = voicesRef.current[i];
      const k = i + 1;
      const freq = base * k;
      v.sin.frequency.setTargetAtTime(freq, now, tc);
      v.cos.frequency.setTargetAtTime(freq, now, tc);
      const target = gains[i];
      v.sinGain.gain.setTargetAtTime(cosine ? 0 : target, now, tc);
      v.cosGain.gain.setTargetAtTime(cosine ? target : 0, now, tc);
    }
  }, [effectiveBase]);

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

    // A one-term periodic wave with only a real (cosine) coefficient: the
    // built-in "sine" type has no phase parameter.
    const cosWave = ctx.createPeriodicWave(new Float32Array([0, 1]), new Float32Array([0, 0]));
    // One shared start time keeps all partials phase-locked; without it each
    // oscillator would start wherever the audio clock happens to be.
    const t0 = ctx.currentTime + 0.02;
    const voices: Voice[] = [];
    for (let k = 1; k <= MAX_HARMONICS; k++) {
      const sin = ctx.createOscillator();
      sin.type = "sine";
      const cos = ctx.createOscillator();
      cos.setPeriodicWave(cosWave);
      sin.frequency.value = baseFreqRef.current * k;
      cos.frequency.value = baseFreqRef.current * k;
      const sinGain = ctx.createGain();
      const cosGain = ctx.createGain();
      sinGain.gain.value = 0;
      cosGain.gain.value = 0;
      sin.connect(sinGain).connect(master);
      cos.connect(cosGain).connect(master);
      sin.start(t0);
      cos.start(t0);
      voices.push({ sin, cos, sinGain, cosGain });
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
          v.sin.stop();
          v.cos.stop();
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
            v.sin.stop();
            v.cos.stop();
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

  // Under reduced motion the canvases are only repainted when something
  // changed. The flag starts true so the first frame is always painted.
  const dirtyRef = useRef(true);
  // The draw loop reads the canvas caption from a ref so a locale switch does
  // not tear the loop down.
  const audioOffRef = useRef(tx.audioOff);
  useEffect(() => {
    audioOffRef.current = tx.audioOff;
    dirtyRef.current = true;
  }, [wave, numHarmonics, customMode, customAmps, audioOn, reduced, tx.audioOff]);

  useEffect(() => {
    const scope = scopeRef.current;
    const spectrum = spectrumRef.current;
    if (!scope || !spectrum) return;
    const sctx = scope.getContext("2d");
    const pctx = spectrum.getContext("2d");
    if (!sctx || !pctx) return;
    let raf = 0;
    let last = performance.now();

    const resize = (canvas: HTMLCanvasElement) => {
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      const c = canvas.getContext("2d");
      if (c) c.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Resizing clears the canvas.
      dirtyRef.current = true;
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

      // The loop keeps running under reduced motion because the sweep drives
      // the audio from here, but it must not repaint an unchanged picture.
      if (reduced && !dirtyRef.current) {
        raf = requestAnimationFrame(draw);
        return;
      }
      dirtyRef.current = false;

      const N = numHarmonicsRef.current;
      const w = waveRef.current;
      const custom = customModeRef.current;
      const customs = customAmpsRef.current;

      // Oscilloscope
      const sW = scope.clientWidth;
      const sH = scope.clientHeight;
      sctx.fillStyle = palette.canvas.bg;
      sctx.fillRect(0, 0, sW, sH);
      sctx.strokeStyle = "rgba(138,144,164,0.15)";
      sctx.lineWidth = 1;
      sctx.beginPath();
      sctx.moveTo(0, sH / 2);
      sctx.lineTo(sW, sH / 2);
      sctx.stroke();

      const analyser = analyserRef.current;
      const buf = analyserBufferRef.current;
      if (reduced) {
        // A live trace drifts across the screen, so reduced motion gets the
        // partial sum computed from the recipe instead: same shape, no drift.
        const samples = Math.max(2, Math.floor(sW));
        const ys: number[] = [];
        let peak = 0;
        for (let i = 0; i < samples; i++) {
          const y = partialSum(w, N, custom, customs, (i / (samples - 1)) * 2.5 * 2 * Math.PI);
          ys.push(y);
          if (Math.abs(y) > peak) peak = Math.abs(y);
        }
        sctx.strokeStyle = palette.signal.cyan;
        sctx.lineWidth = 1.6;
        sctx.beginPath();
        for (let i = 0; i < samples; i++) {
          const x = (i / (samples - 1)) * sW;
          const y = sH / 2 - (peak > 0 ? ys[i] / peak : 0) * (sH / 2 - 8);
          if (i === 0) sctx.moveTo(x, y);
          else sctx.lineTo(x, y);
        }
        sctx.stroke();
      } else if (analyser && buf) {
        analyser.getFloatTimeDomainData(buf);
        sctx.strokeStyle = palette.signal.cyan;
        sctx.shadowColor = palette.signal.cyan;
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
        sctx.fillText(audioOffRef.current, 16, sH / 2 - 6);
      }

      // Spectrum
      const pW = spectrum.clientWidth;
      const pH = spectrum.clientHeight;
      pctx.fillStyle = palette.canvas.bg;
      pctx.fillRect(0, 0, pW, pH);

      let maxAbs = 0;
      const amps: number[] = [];
      for (let k = 1; k <= N; k++) {
        const aVal = partialAmplitude(w, k, custom, customs);
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
  }, [audioOn, effectiveBase, updateAudio, dpr, reduced]);

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
              {tx.waves[wave]} · {tx.harmonicsCount(numHarmonics)} · {Math.round(baseFreq)} Hz
              {sweep && <span className="text-signal-cyan"> · {tx.sweeping}</span>}
            </div>
            <div className="flex items-center gap-2">
              <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
                {reduced ? tx.staticScope : tx.liveScope}
              </div>
              <ExplorerHelpButton guide={FOURIER_SOUND_GUIDE} />
            </div>
          </div>
          <div className="hairline flex-1 overflow-hidden rounded-2xl border bg-ink-950">
            <canvas ref={scopeRef} className="block h-full w-full" />
          </div>
          <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
            {tx.spectrum} ({customMode ? tx.custom : tx.auto})
          </div>
          <div className="hairline h-32 overflow-hidden rounded-2xl border bg-ink-950">
            <canvas ref={spectrumRef} className="block h-full w-full" />
          </div>
        </div>

        <aside className="hairline scrollbar-thin flex flex-col overflow-y-auto border-l bg-ink-900/40">
          <div className="hairline space-y-3 border-b p-6">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
              {topic.title} · {tx.soundSuffix}
            </div>
            <h1 className="math-italic text-3xl leading-tight text-ink-100">{topic.tagline}</h1>
            <p className="text-sm leading-relaxed text-ink-200">{tx.intro}</p>
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
              {audioOn ? tx.stopAudio : tx.startAudio}
            </button>
            <Slider
              label={tx.masterGain}
              value={masterGain}
              min={0}
              max={0.4}
              step={0.005}
              format={(v) => v.toFixed(2)}
              onChange={setMasterGain}
            />
            <Slider
              label={tx.baseFreq}
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
              {tx.targetWave}
              <Info side="bottom">{tx.targetInfo}</Info>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {WAVES.map((w) => (
                <button
                  key={w}
                  onClick={() => setWave(w)}
                  className={`rounded-md border py-2 font-mono text-[10px] uppercase tracking-widest transition-colors ${
                    wave === w
                      ? "border-signal-cyan/70 bg-signal-cyan/10 text-signal-cyan"
                      : "hairline text-ink-300 hover:text-ink-100"
                  }`}
                >
                  {tx.waves[w]}
                </button>
              ))}
            </div>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {tx.harmonics}
            </div>
            <div className="flex items-center justify-between font-mono text-sm">
              <span className="text-signal-cyan">{numHarmonics}</span>
              <span className="text-[10px] text-ink-400">
                {tx.max} {MAX_HARMONICS}
              </span>
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
                {tx.partialAmps}
              </div>
              <button
                onClick={() => setCustomMode((v) => !v)}
                className={`rounded-md border px-2 py-1 font-mono text-[9px] uppercase tracking-widest transition-colors ${
                  customMode
                    ? "border-signal-cyan/70 bg-signal-cyan/10 text-signal-cyan"
                    : "hairline text-ink-300 hover:text-ink-100"
                }`}
              >
                {customMode ? tx.custom : tx.auto}
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
            <p className="pt-1 text-[11px] text-ink-400">{tx.partialNote}</p>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <Toggle label={tx.sweep} on={sweep} onChange={setSweep} />
            <p className="text-[11px] text-ink-400">{tx.sweepNote}</p>
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
      <ExplorerGuideSection guide={FOURIER_SOUND_GUIDE} storyHref="/fourier" />
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
