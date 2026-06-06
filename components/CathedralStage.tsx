"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { EmlRenderer } from "@/lib/gl/renderer";
import { buildLerpShader } from "@/lib/gl/shader";
import { parse } from "@/lib/eml/parse";
import { PRESETS } from "@/lib/eml/presets";

// Stations correspond to scroll sections. We morph the WebGL output across
// adjacent stations using a lerp shader. Camera (center, scale) also lerps.

const STATIONS = [
  { presetId: "exp", hue: 0.00 },
  { presetId: "ln", hue: 0.08 },
  { presetId: "id", hue: 0.14 },
  { presetId: "selfdual", hue: 0.22 },
  { presetId: "twin", hue: 0.30 },
  { presetId: "param-vortex", hue: 0.42 },
  { presetId: "cathedral", hue: 0.55 },
  { presetId: "nebula", hue: 0.70 },
];

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function CathedralStage({
  onStationChange,
}: {
  onStationChange?: (idx: number, progress: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<EmlRenderer | null>(null);
  const [currentSegment, setCurrentSegment] = useState(0);
  const [progress, setProgress] = useState(0);

  // Build current lerp shader for segment [idx, idx+1]
  const fragSrc = useMemo(() => {
    const a = PRESETS.find((p) => p.id === STATIONS[currentSegment].presetId)!;
    const b = PRESETS.find((p) => p.id === STATIONS[Math.min(currentSegment + 1, STATIONS.length - 1)].presetId)!;
    return buildLerpShader(parse(a.src), parse(b.src));
  }, [currentSegment]);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const r = new EmlRenderer(c);
    rendererRef.current = r;
    r.setState({ contours: 0.7, palette: 0, gridStrength: 0.55, exposure: 1.05 });
    r.start();
    const ro = new ResizeObserver(() => r.renderOnce());
    ro.observe(c);
    return () => {
      ro.disconnect();
      r.dispose();
    };
  }, []);

  useEffect(() => {
    const r = rendererRef.current;
    if (!r) return;
    r.setShader(fragSrc);
  }, [fragSrc]);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const totalH = doc.scrollHeight - window.innerHeight;
      const y = window.scrollY;
      const t = Math.min(1, Math.max(0, y / totalH));
      const segs = STATIONS.length - 1;
      const idx = Math.min(Math.floor(t * segs), segs - 1);
      const segT = t * segs - idx;
      setCurrentSegment(idx);
      setProgress(segT);
      const r = rendererRef.current;
      if (r) {
        const aPre = PRESETS.find((p) => p.id === STATIONS[idx].presetId)!;
        const bPre = PRESETS.find((p) => p.id === STATIONS[idx + 1].presetId)!;
        const aView = aPre.view ?? [0, 0, 2.4];
        const bView = bPre.view ?? [0, 0, 2.4];
        const aP = aPre.p ?? [0.5, 0.5];
        const bP = bPre.p ?? [0.5, 0.5];
        const aHue = STATIONS[idx].hue;
        const bHue = STATIONS[idx + 1].hue;
        const et = easeInOut(segT);
        r.setState({
          morph: et,
          center: [lerp(aView[0], bView[0], et), lerp(aView[1], bView[1], et)],
          scale: lerp(aView[2], bView[2], et),
          param: [lerp(aP[0], bP[0], et), lerp(aP[1], bP[1], et)],
          hueShift: lerp(aHue, bHue, et),
        });
      }
      onStationChange?.(idx, segT);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [onStationChange]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full block" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink-950/40 via-transparent to-ink-950/75" />
    </div>
  );
}

export const STATION_COUNT = STATIONS.length;
export const STATION_IDS = STATIONS.map((s) => s.presetId);
