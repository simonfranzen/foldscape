"use client";

import { useEffect, useRef, useState } from "react";
import { useDpr } from "@/lib/hooks/useDpr";
import { palette } from "@/lib/visual/palette";

const N_BARS = 5;
const DEFAULT_AMPS: number[] = [1.0, 0.0, 0.35, 0.0, 0.18];
const COLORS = [
  palette.signal.cyan,
  palette.signal.violet,
  palette.signal.amber,
  palette.signal.rose,
  palette.signal.cyan,
];

const DEFAULT_EXPLAIN =
  "Top: the waveform you just synthesised. Bottom: the same signal in frequency-space, one bar per harmonic. The two pictures carry the same information.";

interface Props {
  caption?: string;
  topHeight?: number;
  bottomHeight?: number;
  baseFreq?: number; // Hz, for optional audio
  explain?: string;
  hearLabel?: string;
  stopLabel?: string;
}

// A custom slider styled to match the rest of the page.
function Knob({
  label,
  color,
  value,
  onChange,
}: {
  label: string;
  color: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex min-w-[44px] flex-col items-center gap-1">
      <div className="font-mono text-[9px] uppercase tracking-widest2 text-ink-300">{label}</div>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={value}
        aria-label={label}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full"
        style={{ accentColor: color }}
      />
      <div className="font-mono text-[9px] text-ink-400">{value.toFixed(2)}</div>
    </div>
  );
}

export function FourierSpectrumPlay({
  caption,
  topHeight = 100,
  bottomHeight = 120,
  baseFreq = 220,
  explain = DEFAULT_EXPLAIN,
  hearLabel = "▶ Hear it",
  stopLabel = "■ Stop",
}: Props) {
  const waveRef = useRef<HTMLCanvasElement | null>(null);
  const specRef = useRef<HTMLCanvasElement | null>(null);
  const [amps, setAmps] = useState<number[]>([...DEFAULT_AMPS]);
  const [playing, setPlaying] = useState(false);
  const dpr = useDpr();
  const audioRef = useRef<{
    ctx: AudioContext;
    osc: OscillatorNode[];
    gain: GainNode[];
    master: GainNode;
  } | null>(null);

  // Time-domain canvas
  useEffect(() => {
    const canvas = waveRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      if (canvas.width !== Math.floor(W * dpr) || canvas.height !== Math.floor(H * dpr)) {
        canvas.width = Math.floor(W * dpr);
        canvas.height = Math.floor(H * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = palette.canvas.bg;
      ctx.fillRect(0, 0, W, H);

      // baseline
      ctx.strokeStyle = "rgba(138,144,164,0.18)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, H / 2);
      ctx.lineTo(W, H / 2);
      ctx.stroke();

      const total = amps.reduce((s, a) => s + a, 0) || 1;
      const scale = 0.95 / Math.max(1, total);
      const Y = (v: number) => H / 2 - v * scale * (H / 2 - 6);
      const STEPS = 480;

      // Individual harmonics — dim
      for (let i = 0; i < N_BARS; i++) {
        const a = amps[i];
        if (a <= 0.001) continue;
        const c = COLORS[i % COLORS.length];
        ctx.strokeStyle = c + "44";
        ctx.lineWidth = 0.9;
        ctx.beginPath();
        for (let s = 0; s <= STEPS; s++) {
          const t = s / STEPS;
          const y = Y(a * Math.sin((i + 1) * 2 * Math.PI * t));
          if (s === 0) ctx.moveTo(t * W, y);
          else ctx.lineTo(t * W, y);
        }
        ctx.stroke();
      }

      // Sum — amber
      ctx.strokeStyle = palette.signal.amber;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      for (let s = 0; s <= STEPS; s++) {
        const t = s / STEPS;
        let sum = 0;
        for (let i = 0; i < N_BARS; i++) sum += amps[i] * Math.sin((i + 1) * 2 * Math.PI * t);
        const y = Y(sum);
        if (s === 0) ctx.moveTo(t * W, y);
        else ctx.lineTo(t * W, y);
      }
      ctx.stroke();
    };

    render();
    const ro = new ResizeObserver(render);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [amps, dpr]);

  // Spectrum bar canvas
  useEffect(() => {
    const canvas = specRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      if (canvas.width !== Math.floor(W * dpr) || canvas.height !== Math.floor(H * dpr)) {
        canvas.width = Math.floor(W * dpr);
        canvas.height = Math.floor(H * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = palette.canvas.bg;
      ctx.fillRect(0, 0, W, H);

      const baseY = H - 22;
      ctx.strokeStyle = "rgba(138,144,164,0.18)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, baseY);
      ctx.lineTo(W, baseY);
      ctx.stroke();

      const slot = W / (N_BARS + 1);
      const barW = slot * 0.38;
      const maxH = baseY - 8;

      for (let i = 0; i < N_BARS; i++) {
        const x = slot * (i + 1) - barW / 2;
        const h = Math.max(1, amps[i] * maxH);
        const c = COLORS[i % COLORS.length];
        ctx.fillStyle = c;
        ctx.fillRect(x, baseY - h, barW, h);

        ctx.fillStyle = "rgba(232,235,245,0.65)";
        ctx.font = "10px ui-monospace, monospace";
        ctx.textAlign = "center";
        ctx.fillText(`${i + 1}f`, slot * (i + 1), H - 6);
      }
    };

    render();
    const ro = new ResizeObserver(render);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [amps, dpr]);

  // Audio: build oscillators per harmonic on first play.
  const start = async () => {
    if (typeof window === "undefined") return;
    try {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AC();
      const master = ctx.createGain();
      master.gain.value = 0.18;
      master.connect(ctx.destination);
      const osc: OscillatorNode[] = [];
      const gain: GainNode[] = [];
      for (let i = 0; i < N_BARS; i++) {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "sine";
        o.frequency.value = baseFreq * (i + 1);
        g.gain.value = amps[i];
        o.connect(g).connect(master);
        o.start();
        osc.push(o);
        gain.push(g);
      }
      audioRef.current = { ctx, osc, gain, master };
      setPlaying(true);
    } catch {
      // Audio unavailable — silently ignore.
    }
  };

  const stop = () => {
    const ref = audioRef.current;
    if (!ref) {
      setPlaying(false);
      return;
    }
    try {
      ref.osc.forEach((o) => o.stop());
      ref.ctx.close();
    } catch {
      // ignore
    }
    audioRef.current = null;
    setPlaying(false);
  };

  // Sync gain to amps while playing.
  useEffect(() => {
    const ref = audioRef.current;
    if (!ref) return;
    for (let i = 0; i < N_BARS; i++) {
      ref.gain[i].gain.value = amps[i];
    }
  }, [amps]);

  // Stop audio on unmount.
  useEffect(() => {
    return () => {
      const ref = audioRef.current;
      if (ref) {
        try {
          ref.osc.forEach((o) => o.stop());
          ref.ctx.close();
        } catch {
          // ignore
        }
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <div className="hairline space-y-4 rounded-2xl border bg-ink-950/40 p-5">
      {caption && (
        <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
          {caption}
        </div>
      )}
      <canvas
        ref={waveRef}
        style={{ height: topHeight }}
        role="img"
        aria-label={explain}
        className="hairline block w-full rounded-lg border"
      />
      <canvas
        ref={specRef}
        style={{ height: bottomHeight }}
        role="img"
        aria-label={caption ?? explain}
        className="hairline block w-full rounded-lg border"
      />
      <div className="grid grid-cols-5 gap-3 pt-1">
        {amps.map((a, i) => (
          <Knob
            key={i}
            label={`${i + 1}f`}
            color={COLORS[i % COLORS.length]}
            value={a}
            onChange={(v) => {
              const next = [...amps];
              next[i] = v;
              setAmps(next);
            }}
          />
        ))}
      </div>
      <div className="flex items-center justify-between gap-3 pt-1">
        <p className="max-w-md text-[11px] leading-relaxed text-ink-400">{explain}</p>
        <button
          onClick={() => (playing ? stop() : start())}
          className={`shrink-0 rounded-md border px-4 py-2 font-mono text-[10px] uppercase tracking-widest2 transition-colors ${
            playing
              ? "border-signal-rose/70 bg-signal-rose/10 text-signal-rose"
              : "border-signal-amber/70 bg-signal-amber/10 text-signal-amber hover:bg-signal-amber/20"
          }`}
        >
          {playing ? stopLabel : hearLabel}
        </button>
      </div>
    </div>
  );
}
