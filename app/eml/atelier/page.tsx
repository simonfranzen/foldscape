"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { EmlCanvas } from "@/components/EmlCanvas";
import { EmlTree } from "@/components/EmlTree";
import { PRESETS } from "@/lib/eml/presets";
import { safeParse } from "@/lib/eml/parse";
import { buildFragmentShader, PALETTES } from "@/lib/gl/shader";
import { depth, nodeCount } from "@/lib/eml/ast";
import { Info } from "@/components/Info";

const DEFAULT_PRESET_ID = "cathedral";

export default function AtelierPage() {
  const defaultPreset = PRESETS.find((p) => p.id === DEFAULT_PRESET_ID)!;
  const [src, setSrc] = useState(defaultPreset.src);
  const [activePresetId, setActivePresetId] = useState<string | null>(DEFAULT_PRESET_ID);
  const [paramRe, setParamRe] = useState(defaultPreset.p?.[0] ?? 0.5);
  const [paramIm, setParamIm] = useState(defaultPreset.p?.[1] ?? 0.5);
  const [scale, setScale] = useState(defaultPreset.view?.[2] ?? 2.6);
  const [centerX, setCenterX] = useState(defaultPreset.view?.[0] ?? 0);
  const [centerY, setCenterY] = useState(defaultPreset.view?.[1] ?? 0);
  const [hue, setHue] = useState(0);
  const [contours, setContours] = useState(0.8);
  const [palette, setPalette] = useState(0);
  const [gridStrength, setGridStrength] = useState(0.5);
  const [exposure, setExposure] = useState(1.0);
  const [autoMorph, setAutoMorph] = useState(false);
  const dragRef = useRef<{ x: number; y: number; cx: number; cy: number } | null>(null);

  const parsed = useMemo(() => safeParse(src), [src]);
  const fragSrc = useMemo(() => {
    if (!parsed.ok) return null;
    return buildFragmentShader(parsed.node);
  }, [parsed]);

  // Mark preset as inactive when src diverges from any preset
  useEffect(() => {
    const match = PRESETS.find((p) => p.src === src);
    setActivePresetId(match ? match.id : null);
  }, [src]);

  useEffect(() => {
    if (!autoMorph) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = (now - t0) / 1000;
      setParamRe(0.7 * Math.cos(t * 0.4));
      setParamIm(0.7 * Math.sin(t * 0.31));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [autoMorph]);

  const state = useMemo(
    () => ({
      param: [paramRe, paramIm] as [number, number],
      scale,
      center: [centerX, centerY] as [number, number],
      hueShift: hue,
      contours,
      palette,
      gridStrength,
      exposure,
    }),
    [paramRe, paramIm, scale, centerX, centerY, hue, contours, palette, gridStrength, exposure],
  );

  const onWheel = (e: React.WheelEvent) => {
    const factor = Math.exp(e.deltaY * 0.001);
    setScale((s) => Math.min(20, Math.max(0.05, s * factor)));
  };
  const onDown = (e: React.PointerEvent) => {
    dragRef.current = { x: e.clientX, y: e.clientY, cx: centerX, cy: centerY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.x;
    const dy = e.clientY - dragRef.current.y;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const per = scale / (rect.height / 2);
    setCenterX(dragRef.current.cx - dx * per);
    setCenterY(dragRef.current.cy + dy * per);
  };
  const onUp = () => {
    dragRef.current = null;
  };

  const loadPreset = (id: string) => {
    const p = PRESETS.find((q) => q.id === id);
    if (!p) return;
    setSrc(p.src);
    setActivePresetId(id);
    setAutoMorph(false);
    if (p.view) {
      setCenterX(p.view[0]);
      setCenterY(p.view[1]);
      setScale(p.view[2]);
    }
    if (p.p) {
      setParamRe(p.p[0]);
      setParamIm(p.p[1]);
    }
  };

  const resetView = () => {
    setCenterX(0);
    setCenterY(0);
    setScale(2.4);
  };

  const stats = parsed.ok
    ? { ok: true as const, depth: depth(parsed.node), count: nodeCount(parsed.node) }
    : { ok: false as const, error: parsed.error };

  return (
    <main className="pt-14 min-h-screen flex flex-col">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-0">
        {/* Stage */}
        <div
          className="relative bg-ink-950 min-h-[60vh] lg:min-h-[calc(100vh-3.5rem)] cursor-grab active:cursor-grabbing select-none"
          onWheel={onWheel}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        >
          {fragSrc && (
            <EmlCanvas
              fragSrc={fragSrc}
              state={state}
              className="absolute inset-0 w-full h-full block"
            />
          )}
          {/* HUD */}
          <div className="absolute top-4 left-4 right-4 flex items-start justify-between pointer-events-none gap-3">
            <div className="glass border hairline rounded-md px-3 py-2 font-mono text-[10px] tracking-widest2 text-ink-300 uppercase pointer-events-auto flex items-center gap-2">
              <span>
                center {centerX.toFixed(2)}, {centerY.toFixed(2)} · scale {scale.toFixed(2)}
              </span>
              <button
                onClick={resetView}
                className="text-signal-violet hover:text-ink-100 transition-colors"
                title="reset view"
              >
                ↺
              </button>
            </div>
            <div className="glass border hairline rounded-md px-3 py-2 font-mono text-[10px] tracking-widest2 text-ink-300 uppercase">
              p = ({paramRe.toFixed(2)},{" "}
              {paramIm.toFixed(2)}
              <span className="text-signal-rose">i</span>)
            </div>
          </div>
          <div className="absolute bottom-4 left-4 glass border hairline rounded-md px-3 py-2 font-mono text-[10px] tracking-widest2 text-ink-300 uppercase pointer-events-none flex items-center gap-2">
            <span>drag · scroll · domain coloring</span>
          </div>
        </div>

        {/* Right panel */}
        <aside className="border-l hairline bg-ink-900/40 flex flex-col overflow-hidden scrollbar-thin overflow-y-auto">
          {/* Formula card */}
          <div className="p-5 border-b hairline space-y-4">
            <div className="flex items-center justify-between">
              <div className="font-mono text-[10px] tracking-widest2 text-ink-300 uppercase flex items-center gap-2">
                Formula
                <Info side="bottom">
                  An EML formula is a tree built from three atoms — the
                  constant <span className="math-italic">1</span>, the input
                  variable <span className="math-italic">z</span>, and a
                  parameter <span className="math-italic">p</span> — combined
                  by the operator{" "}
                  <span className="math-italic">eml(a, b)</span>. Pick a
                  preset to start, or type your own.
                </Info>
              </div>
              <div
                className={`font-mono text-[10px] tracking-widest2 uppercase ${
                  stats.ok ? "text-signal-cyan" : "text-signal-rose"
                }`}
              >
                {stats.ok ? `depth ${stats.depth} · ${stats.count} nodes` : "parse error"}
              </div>
            </div>

            {/* Preset chips */}
            <div className="flex flex-wrap gap-1.5">
              {PRESETS.map((p) => {
                const active = activePresetId === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => loadPreset(p.id)}
                    title={p.tagline}
                    className={`group relative rounded-full border px-3 py-1.5 transition-colors ${
                      active
                        ? "border-signal-violet/70 bg-signal-violet/10 text-ink-100"
                        : "hairline text-ink-300 hover:text-ink-100 hover:border-ink-300/50"
                    }`}
                  >
                    <span className="math-italic text-sm">{p.title}</span>
                    <span className="ml-2 font-mono text-[9px] text-ink-500 tracking-widest uppercase">
                      d{p.depth}
                    </span>
                  </button>
                );
              })}
            </div>
            {activePresetId && (
              <div className="text-[11px] text-ink-300 italic leading-relaxed border-l-2 border-signal-violet/40 pl-3">
                {PRESETS.find((p) => p.id === activePresetId)?.tagline}
              </div>
            )}

            {/* Editor */}
            <div className="space-y-2">
              <div className="font-mono text-[9px] tracking-widest2 text-ink-500 uppercase flex items-center gap-2">
                or type your own
                <Info side="bottom">
                  Grammar:{" "}
                  <span className="font-mono text-ink-100">expr</span> ={" "}
                  <span className="font-mono text-signal-amber">1</span> ·{" "}
                  <span className="font-mono text-signal-cyan">z</span> ·{" "}
                  <span className="font-mono text-signal-rose">p</span> ·{" "}
                  <span className="font-mono">eml(expr, expr)</span>.
                  Whitespace is ignored. Try{" "}
                  <span className="font-mono">eml(z, eml(p, z))</span> to
                  start.
                </Info>
              </div>
              <textarea
                value={src}
                onChange={(e) => setSrc(e.target.value)}
                spellCheck={false}
                rows={3}
                placeholder="eml(z, 1)"
                className="w-full bg-ink-950/80 border hairline rounded-md p-3 font-mono text-xs text-ink-100 outline-none focus:border-signal-violet/60 resize-none placeholder:text-ink-500"
              />
              {!stats.ok && (
                <div className="text-[11px] font-mono text-signal-rose">
                  {parsed.ok ? "" : parsed.error}
                </div>
              )}
              <div className="text-[10px] font-mono text-ink-500 leading-relaxed">
                atoms:{" "}
                <span className="text-signal-amber">1</span> ·{" "}
                <span className="text-signal-cyan">z</span>{" "}
                <span className="text-ink-500">(input)</span> ·{" "}
                <span className="text-signal-rose">p</span>{" "}
                <span className="text-ink-500">(slider)</span>
              </div>
            </div>
          </div>

          {/* Tree */}
          <div className="p-5 border-b hairline">
            <div className="font-mono text-[10px] tracking-widest2 text-ink-300 uppercase mb-3 flex items-center gap-2">
              Tree
              <Info side="bottom">
                Visual structure of the formula. Each{" "}
                <span className="text-signal-violet">eml</span> node combines
                its two children. Leaves are the atoms{" "}
                <span className="text-signal-amber">1</span>,{" "}
                <span className="text-signal-cyan">z</span>,{" "}
                <span className="text-signal-rose">p</span>. Depth equals the
                longest path from root to leaf.
              </Info>
            </div>
            <div className="bg-ink-950/60 rounded-md border hairline p-2 max-h-[28vh] overflow-auto scrollbar-thin">
              {stats.ok && parsed.ok ? (
                <EmlTree root={parsed.node} className="w-full h-auto" />
              ) : (
                <div className="text-[11px] font-mono text-ink-500 px-2 py-6 text-center">
                  fix the formula to render the tree
                </div>
              )}
            </div>
          </div>

          {/* Knobs */}
          <div className="p-5 border-b hairline space-y-4">
            <div className="font-mono text-[10px] tracking-widest2 text-ink-300 uppercase flex items-center gap-2">
              Parameters
              <Info side="bottom">
                Live controls. The first four shape the formula or the
                viewer; the rest are aesthetic. Sliding <em>p</em> is the
                most dramatic — it moves singularities through the field.
              </Info>
            </div>
            <Knob
              label="p (real)"
              value={paramRe}
              onChange={(v) => {
                setAutoMorph(false);
                setParamRe(v);
              }}
              min={-2}
              max={2}
              accent="text-signal-rose"
              info={
                <>
                  The real part of the complex parameter{" "}
                  <span className="math-italic">p</span>. Only matters if the
                  formula contains <span className="math-italic">p</span>.
                </>
              }
            />
            <Knob
              label="p (imag)"
              value={paramIm}
              onChange={(v) => {
                setAutoMorph(false);
                setParamIm(v);
              }}
              min={-2}
              max={2}
              accent="text-signal-rose"
              info={
                <>
                  Imaginary part of <span className="math-italic">p</span>. A
                  non-zero imaginary part rotates the field instead of
                  scaling it.
                </>
              }
            />
            <Knob
              label="hue shift"
              value={hue}
              onChange={setHue}
              min={0}
              max={1}
              accent="text-signal-violet"
              info="Rotates the palette around the color wheel. Doesn't change the math — only the chosen colour for each argument."
            />
            <Knob
              label="contours"
              value={contours}
              onChange={setContours}
              min={0}
              max={1}
              accent="text-signal-cyan"
              info={
                <>
                  Intensity of the magnitude rings. Each ring marks a
                  doubling of <span className="math-italic">|w|</span>. Set
                  to zero for a smooth field.
                </>
              }
            />
            <Knob
              label="exposure"
              value={exposure}
              onChange={setExposure}
              min={0.3}
              max={1.8}
              accent="text-signal-amber"
              info="Overall brightness, like a camera. Useful when the field is mostly dark or mostly bright."
            />
            <Knob
              label="grid"
              value={gridStrength}
              onChange={setGridStrength}
              min={0}
              max={1}
              accent="text-ink-200"
              info="Overlay marking integer values on the real and imaginary axes — orients you in the complex plane."
            />
            <button
              onClick={() => setAutoMorph((v) => !v)}
              className={`w-full mt-1 font-mono text-[10px] tracking-widest2 uppercase border rounded-md py-2 transition-colors ${
                autoMorph
                  ? "border-signal-rose/60 text-signal-rose bg-signal-rose/10"
                  : "border-ink-300/40 text-ink-300 hover:text-ink-100"
              }`}
            >
              {autoMorph ? "● auto-morph on" : "○ auto-morph p along a curve"}
            </button>
          </div>

          {/* Palettes */}
          <div className="p-5">
            <div className="font-mono text-[10px] tracking-widest2 text-ink-300 uppercase mb-3 flex items-center gap-2">
              Palette
              <Info side="bottom">
                The colour mapping. Each palette is hand-tuned to be readable
                without being garish — the &quot;Spectrum&quot; option restores
                the classic full rainbow for reference.
              </Info>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {PALETTES.map((pal, i) => (
                <button
                  key={pal.id}
                  onClick={() => setPalette(i)}
                  className={`text-left rounded-md border px-3 py-2 transition-colors ${
                    palette === i
                      ? "border-signal-violet/60 bg-signal-violet/5"
                      : "hairline hover:border-ink-300/40"
                  }`}
                >
                  <div className="font-mono text-[11px] text-ink-100 uppercase tracking-widest">
                    {pal.label}
                  </div>
                  <div className="font-mono text-[9px] text-ink-500 mt-0.5">{pal.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

function Knob({
  label,
  value,
  onChange,
  min,
  max,
  accent,
  info,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  accent: string;
  info?: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="flex items-center justify-between mb-1 gap-2">
        <span className="font-mono text-[10px] tracking-widest2 text-ink-300 uppercase flex items-center gap-1.5">
          {label}
          {info && <Info side="right">{info}</Info>}
        </span>
        <span className={`font-mono text-[10px] ${accent}`}>{value.toFixed(3)}</span>
      </div>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={(max - min) / 500}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-signal-violet"
      />
    </label>
  );
}
