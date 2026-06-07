"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MandelRenderer, BOOKMARKS, defaultMandel, suggestedIter } from "@/lib/gl/mandelbrot";
import { useI18n } from "@/lib/i18n/context";
import { Info } from "@/components/Info";

const PALETTE_LABELS = ["Aurora", "Twilight", "Inferno", "Patina", "Ink"];

const SCALE_MIN = 1e-10;
const SCALE_MAX = 4;

export default function MandelbrotExplorer() {
  const { u, a } = useI18n();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<MandelRenderer | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{ x: number; y: number; cx: number; cy: number; moved: boolean } | null>(
    null,
  );

  const [center, setCenter] = useState<[number, number]>([-0.6, 0]);
  const [scale, setScale] = useState(1.4);
  const [maxIter, setMaxIter] = useState(300);
  const [autoIter, setAutoIter] = useState(true);
  const [palette, setPalette] = useState(0);
  const [hueShift, setHueShift] = useState(0);
  const [exposure, setExposure] = useState(1.0);

  // Init renderer
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const r = new MandelRenderer(c);
    rendererRef.current = r;
    r.setState({ ...defaultMandel(), center, scale, maxIter, palette, hueShift, exposure });
    r.start();
    const ro = new ResizeObserver(() => r.render());
    ro.observe(c);
    return () => {
      ro.disconnect();
      r.dispose();
      rendererRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync to renderer
  useEffect(() => {
    rendererRef.current?.setState({ center, scale, maxIter, palette, hueShift, exposure });
  }, [center, scale, maxIter, palette, hueShift, exposure]);

  // Auto-iteration: bump as we zoom in
  useEffect(() => {
    if (!autoIter) return;
    setMaxIter(suggestedIter(scale));
  }, [scale, autoIter]);

  // Reset coords-keep-cursor zoom helper
  const zoomAt = (clientX: number, clientY: number, factor: number) => {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (clientX - rect.left - rect.width / 2) / rect.height;
    const py = -(clientY - rect.top - rect.height / 2) / rect.height;
    const worldX = center[0] + px * scale;
    const worldY = center[1] + py * scale;
    const newScale = Math.min(SCALE_MAX, Math.max(SCALE_MIN, scale * factor));
    setCenter([worldX - px * newScale, worldY - py * newScale]);
    setScale(newScale);
  };

  const zoomCenter = (factor: number) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    zoomAt(rect.left + rect.width / 2, rect.top + rect.height / 2, factor);
  };

  // Wheel only zooms when modifier held. Otherwise the page scrolls normally.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const onWheel = (e: WheelEvent) => {
      if (!(e.metaKey || e.ctrlKey)) return; // pass through to page
      e.preventDefault();
      const factor = Math.exp(e.deltaY * 0.0015);
      zoomAt(e.clientX, e.clientY, factor);
    };
    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => stage.removeEventListener("wheel", onWheel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center, scale]);

  const onDown = (e: React.PointerEvent) => {
    dragRef.current = { x: e.clientX, y: e.clientY, cx: center[0], cy: center[1], moved: false };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.x;
    const dy = e.clientY - dragRef.current.y;
    if (Math.hypot(dx, dy) > 3) dragRef.current.moved = true;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const per = scale / (rect.height / 2);
    setCenter([dragRef.current.cx - dx * per, dragRef.current.cy + dy * per]);
  };
  const onUp = () => {
    dragRef.current = null;
  };

  const onDoubleClick = (e: React.MouseEvent) => {
    // Shift = zoom out, otherwise zoom in
    const factor = e.shiftKey ? 2.0 : 0.5;
    zoomAt(e.clientX, e.clientY, factor);
  };

  const loadBookmark = (id: string) => {
    const b = BOOKMARKS.find((x) => x.id === id);
    if (!b) return;
    setCenter(b.center);
    setScale(b.scale);
    if (autoIter) setMaxIter(suggestedIter(b.scale));
    else setMaxIter(b.maxIter);
  };

  const resetView = () => {
    setCenter([-0.6, 0]);
    setScale(1.4);
    if (autoIter) setMaxIter(suggestedIter(1.4));
  };

  const zoom = scale > 0 ? Math.log10(2.8 / scale) : 0;
  const zoomFmt = zoom.toFixed(2);

  return (
    <main className="flex min-h-screen flex-col pt-14">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_420px]">
        {/* Stage */}
        <div
          ref={stageRef}
          className="relative min-h-[60vh] cursor-grab select-none overflow-hidden bg-ink-950 active:cursor-grabbing lg:min-h-[calc(100vh-3.5rem)]"
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          onDoubleClick={onDoubleClick}
        >
          <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />

          {/* Top-left: coords */}
          <div className="pointer-events-none absolute left-4 right-4 top-4 flex items-start justify-between gap-3">
            <div className="glass hairline pointer-events-auto rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              c = {center[0].toFixed(8)} {center[1] >= 0 ? "+" : "−"}{" "}
              {Math.abs(center[1]).toFixed(8)}i
              <span className="ml-3 text-signal-amber">
                {u.mandel.zoomLevel} 10^{zoomFmt}
              </span>
            </div>
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
              z → z² + c
            </div>
          </div>

          {/* Map-style zoom controls (top-right under formula) */}
          <div className="pointer-events-auto absolute right-4 top-20 flex flex-col gap-2">
            <button
              onClick={() => zoomCenter(0.5)}
              title={u.mandel.zoomIn}
              className="glass hairline flex h-10 w-10 items-center justify-center rounded-md border text-xl text-ink-100 transition-colors hover:border-signal-amber/50 hover:text-signal-amber"
            >
              +
            </button>
            <button
              onClick={() => zoomCenter(2.0)}
              title={u.mandel.zoomOut}
              className="glass hairline flex h-10 w-10 items-center justify-center rounded-md border text-xl text-ink-100 transition-colors hover:border-signal-amber/50 hover:text-signal-amber"
            >
              −
            </button>
            <button
              onClick={resetView}
              title={u.mandel.reset}
              className="glass hairline flex h-10 w-10 items-center justify-center rounded-md border text-base text-ink-100 transition-colors hover:border-signal-violet/50 hover:text-signal-violet"
            >
              ⟳
            </button>
          </div>

          {/* Bottom-left: pan hint */}
          <div className="glass hairline pointer-events-none absolute bottom-4 left-4 rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
            {u.mandel.panHint}
          </div>
        </div>

        {/* Panel */}
        <aside className="hairline scrollbar-thin flex flex-col overflow-y-auto border-l bg-ink-900/40">
          <div className="hairline space-y-3 border-b p-6">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
              {a.topics.mandelbrot.title}
            </div>
            <h1 className="math-italic text-3xl leading-tight text-ink-100">
              {a.topics.mandelbrot.tagline}
            </h1>
            <p className="text-sm leading-relaxed text-ink-200">{a.topics.mandelbrot.body}</p>
            <div className="hairline rounded-md border bg-ink-950/60 p-3 font-mono text-xs text-ink-100">
              z₀ = 0, zₙ₊₁ = zₙ² + c
            </div>
          </div>

          {/* Bookmarks */}
          <div className="hairline border-b p-5">
            <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {u.mandel.bookmarks}
              <Info side="bottom">{u.mandel.bookmarksInfo}</Info>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {BOOKMARKS.map((b) => (
                <button
                  key={b.id}
                  onClick={() => loadBookmark(b.id)}
                  className="hairline rounded-md border px-3 py-2 text-left transition-colors hover:border-signal-amber/50"
                >
                  <div className="text-sm text-ink-100">
                    {u.mandel[b.labelKey as keyof typeof u.mandel] as string}
                  </div>
                  <div className="mt-0.5 font-mono text-[10px] text-ink-400">
                    10^{Math.log10(2.8 / b.scale).toFixed(1)} · {b.maxIter} iter
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Iteration */}
          <div className="hairline space-y-4 border-b p-5">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {u.mandel.iterations}
              <Info side="bottom">{u.mandel.iterationsInfo}</Info>
              <button
                onClick={() => setAutoIter((v) => !v)}
                className={`ml-auto rounded border px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest transition-colors ${
                  autoIter
                    ? "border-signal-cyan/60 bg-signal-cyan/10 text-signal-cyan"
                    : "hairline text-ink-300"
                }`}
                title={u.mandel.autoIter}
              >
                {autoIter ? "● auto" : "○ auto"}
              </button>
            </div>
            <Slider
              value={maxIter}
              onChange={(v) => {
                setAutoIter(false);
                setMaxIter(v);
              }}
              min={50}
              max={3000}
              step={10}
              format={(v) => `${v}`}
              accent="text-signal-amber"
            />
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {u.mandel.hueShift}
            </div>
            <Slider
              value={hueShift}
              onChange={setHueShift}
              min={0}
              max={1}
              step={0.001}
              format={(v) => v.toFixed(3)}
              accent="text-signal-violet"
            />
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {u.mandel.exposure}
            </div>
            <Slider
              value={exposure}
              onChange={setExposure}
              min={0.4}
              max={2.0}
              step={0.01}
              format={(v) => v.toFixed(2)}
              accent="text-signal-cyan"
            />
          </div>

          {/* Palette */}
          <div className="hairline border-b p-5">
            <div className="mb-3 font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {u.mandel.palette}
            </div>
            <div className="grid grid-cols-5 gap-2">
              {PALETTE_LABELS.map((label, i) => (
                <button
                  key={label}
                  onClick={() => setPalette(i)}
                  className={`rounded-md border py-2 text-center font-mono text-[10px] uppercase tracking-widest transition-colors ${
                    palette === i
                      ? "border-signal-violet/60 bg-signal-violet/10 text-signal-violet"
                      : "hairline text-ink-300 hover:text-ink-100"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Back link */}
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
  value,
  onChange,
  min,
  max,
  step,
  format,
  accent,
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  accent: string;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className={`font-mono text-[10px] tracking-widest2 ${accent} uppercase`}>
          {format(value)}
        </span>
      </div>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className={`w-full ${accent.replace("text-", "accent-")}`}
      />
    </div>
  );
}
