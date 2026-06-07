"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { EmlCanvas } from "@/components/EmlCanvas";
import { PRESETS } from "@/lib/eml/presets";
import { parse } from "@/lib/eml/parse";
import { buildFragmentShader, PALETTES } from "@/lib/gl/shader";
import { evalEml } from "@/lib/eml/compile";
import { EmlSynth } from "@/lib/audio/synth";

const RESONANCE_PRESETS = ["twin", "param-vortex", "cathedral", "nebula", "selfdual"];

export default function ResonancePage() {
  const [presetId, setPresetId] = useState("twin");
  const preset = useMemo(() => PRESETS.find((p) => p.id === presetId)!, [presetId]);
  const node = useMemo(() => parse(preset.src), [preset]);
  const fragSrc = useMemo(() => buildFragmentShader(node), [node]);

  const [audioOn, setAudioOn] = useState(false);
  const synthRef = useRef<EmlSynth | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const trailRef = useRef<HTMLCanvasElement | null>(null);
  const [hudReadout, setHudReadout] = useState({
    z: [0, 0] as [number, number],
    w: [0, 0] as [number, number],
  });

  const view = preset.view ?? [0, 0, 2.4];
  const paramDefault = preset.p ?? [0.4, 0.4];
  const [param, setParam] = useState<[number, number]>(paramDefault);
  const [palette, setPalette] = useState(1); // Twilight default

  useEffect(() => {
    setParam(preset.p ?? [0.4, 0.4]);
  }, [preset]);

  const state = useMemo(
    () => ({
      center: [view[0], view[1]] as [number, number],
      scale: view[2],
      param,
      contours: 0.75,
      hueShift: 0,
      palette,
      gridStrength: 0.4,
      exposure: 1.1,
    }),
    [view, param, palette],
  );

  useEffect(() => {
    return () => {
      synthRef.current?.stop();
      synthRef.current = null;
    };
  }, []);

  // Mouse → eval → drive trail + audio
  useEffect(() => {
    const stage = stageRef.current;
    const trail = trailRef.current;
    if (!stage || !trail) return;
    const ctx2d = trail.getContext("2d")!;
    let last: { x: number; y: number } | null = null;
    let raf = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      trail.width = Math.floor(stage.clientWidth * dpr);
      trail.height = Math.floor(stage.clientHeight * dpr);
      ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(stage);

    const fade = () => {
      ctx2d.globalCompositeOperation = "destination-out";
      ctx2d.fillStyle = "rgba(0,0,0,0.018)";
      ctx2d.fillRect(0, 0, stage.clientWidth, stage.clientHeight);
      ctx2d.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(fade);
    };
    raf = requestAnimationFrame(fade);

    const onMove = (e: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const H = rect.height;
      const uvX = (mx - rect.width / 2) / H;
      const uvY = -(my - rect.height / 2) / H;
      const zRe = view[0] + uvX * view[2];
      const zIm = view[1] + uvY * view[2];
      const w = evalEml(node, [zRe, zIm], param);
      const mag = Math.hypot(w[0], w[1]);
      const ang = Math.atan2(w[1], w[0]);

      // Drive synth
      synthRef.current?.drive(mag, ang);

      // Draw trail
      const hue = ((ang / (Math.PI * 2) + 0.5) * 360) % 360;
      const sat = 90;
      const lit = 60;
      if (last) {
        const grad = ctx2d.createLinearGradient(last.x, last.y, mx, my);
        grad.addColorStop(0, `hsla(${hue}, ${sat}%, ${lit}%, 0)`);
        grad.addColorStop(1, `hsla(${hue}, ${sat}%, ${lit}%, 1)`);
        ctx2d.strokeStyle = grad;
        ctx2d.lineWidth = 4;
        ctx2d.lineCap = "round";
        ctx2d.shadowColor = `hsla(${hue}, 100%, 70%, 0.9)`;
        ctx2d.shadowBlur = 22;
        ctx2d.beginPath();
        ctx2d.moveTo(last.x, last.y);
        ctx2d.lineTo(mx, my);
        ctx2d.stroke();
      }
      ctx2d.shadowColor = `hsla(${hue}, 100%, 80%, 1)`;
      ctx2d.shadowBlur = 36;
      ctx2d.fillStyle = `hsl(${hue}, 100%, ${Math.min(90, 55 + Math.log10(mag + 1) * 6)}%)`;
      ctx2d.beginPath();
      ctx2d.arc(mx, my, 7, 0, Math.PI * 2);
      ctx2d.fill();
      // bright white core for visibility against rainbow background
      ctx2d.shadowBlur = 0;
      ctx2d.fillStyle = "rgba(255,255,255,0.95)";
      ctx2d.beginPath();
      ctx2d.arc(mx, my, 2, 0, Math.PI * 2);
      ctx2d.fill();
      last = { x: mx, y: my };

      setHudReadout({ z: [zRe, zIm], w });
    };

    const onLeave = () => {
      last = null;
      synthRef.current?.silence();
    };

    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
    };
  }, [node, param, view]);

  const toggleAudio = async () => {
    if (audioOn) {
      synthRef.current?.stop();
      synthRef.current = null;
      setAudioOn(false);
    } else {
      const s = new EmlSynth();
      await s.start();
      synthRef.current = s;
      setAudioOn(true);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh)] flex-col pt-14">
      <div
        ref={stageRef}
        className="relative min-h-[calc(100vh-3.5rem)] flex-1 overflow-hidden bg-ink-950"
      >
        <EmlCanvas
          fragSrc={fragSrc}
          state={state}
          className="absolute inset-0 block h-full w-full"
        />
        <canvas
          ref={trailRef}
          className="pointer-events-none absolute inset-0 h-full w-full [mix-blend-mode:plus-lighter]"
        />

        {/* HUD top */}
        <div className="pointer-events-none absolute left-4 right-4 top-4 flex items-start justify-between">
          <div className="glass hairline pointer-events-auto max-w-md rounded-md border px-3 py-2">
            <div className="mb-1 font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
              Room III · Resonance
            </div>
            <div className="math-italic text-lg leading-tight">{preset.title}</div>
            <div className="mt-1 break-all font-mono text-[10px] text-ink-300">{preset.src}</div>
          </div>
          <button
            onClick={toggleAudio}
            className={`pointer-events-auto rounded-md border px-4 py-2 font-mono text-[11px] uppercase tracking-widest2 transition-colors ${
              audioOn
                ? "border-signal-rose/60 bg-signal-rose/10 text-signal-rose"
                : "border-signal-cyan/60 bg-signal-cyan/10 text-signal-cyan hover:bg-signal-cyan/20"
            }`}
          >
            {audioOn ? "● audio on" : "○ start audio"}
          </button>
        </div>

        {/* Readout bottom */}
        <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
          <div className="glass hairline pointer-events-auto rounded-md border px-3 py-2 font-mono text-[11px] text-ink-200">
            <div className="flex gap-6">
              <div>
                <span className="text-ink-500">z =</span> {hudReadout.z[0].toFixed(2)}{" "}
                <span className="text-signal-cyan">+</span> {hudReadout.z[1].toFixed(2)}
                <span className="text-signal-cyan">i</span>
              </div>
              <div>
                <span className="text-ink-500">w =</span> {fmt(hudReadout.w[0])}{" "}
                <span className="text-signal-violet">+</span> {fmt(hudReadout.w[1])}
                <span className="text-signal-violet">i</span>
              </div>
              <div>
                <span className="text-ink-500">|w| =</span>{" "}
                {fmt(Math.hypot(hudReadout.w[0], hudReadout.w[1]))}
              </div>
            </div>
          </div>
          <div className="pointer-events-auto flex flex-wrap justify-end gap-2">
            {RESONANCE_PRESETS.map((id) => {
              const p = PRESETS.find((q) => q.id === id)!;
              const active = id === presetId;
              return (
                <button
                  key={id}
                  onClick={() => setPresetId(id)}
                  className={`rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 transition-colors ${
                    active
                      ? "border-signal-violet/60 bg-signal-violet/10 text-signal-violet"
                      : "hairline text-ink-300 hover:text-ink-100"
                  }`}
                >
                  {p.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* Param dials, mid-left */}
        <div className="glass hairline pointer-events-auto absolute left-4 top-1/2 w-56 -translate-y-1/2 space-y-3 rounded-md border p-3">
          <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-rose">
            parameter p
          </div>
          <div className="flex flex-wrap gap-1">
            {PALETTES.slice(0, 5).map((pal, i) => (
              <button
                key={pal.id}
                onClick={() => setPalette(i)}
                title={pal.label}
                className={`rounded border px-2 py-1 font-mono text-[9px] uppercase tracking-widest transition-colors ${
                  palette === i
                    ? "border-signal-violet/70 bg-signal-violet/10 text-signal-violet"
                    : "hairline text-ink-300 hover:text-ink-100"
                }`}
              >
                {pal.label}
              </button>
            ))}
          </div>
          <Slider
            label="real"
            value={param[0]}
            min={-2}
            max={2}
            onChange={(v) => setParam([v, param[1]])}
          />
          <Slider
            label="imag"
            value={param[1]}
            min={-2}
            max={2}
            onChange={(v) => setParam([param[0], v])}
          />
          <div className="hairline border-t pt-1 font-mono text-[10px] leading-relaxed text-ink-300">
            move the mouse over the field. each position is a complex number; what you hear is{" "}
            <span className="math-italic">w</span> = eml-tree(<span className="math-italic">z</span>
            ).
          </div>
        </div>
      </div>
    </main>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <div className="mb-1 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
          {label}
        </span>
        <span className="font-mono text-[10px] text-signal-rose">{value.toFixed(2)}</span>
      </div>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={(max - min) / 400}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-signal-rose"
      />
    </label>
  );
}

function fmt(n: number): string {
  if (!isFinite(n)) return "∞";
  if (Math.abs(n) < 1e3 && Math.abs(n) > 1e-2) return n.toFixed(2);
  return n.toExponential(1);
}
