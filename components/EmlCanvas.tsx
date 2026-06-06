"use client";

import { useEffect, useRef } from "react";
import { EmlRenderer, type UniformState } from "@/lib/gl/renderer";

interface Props {
  fragSrc: string;
  state?: Partial<UniformState>;
  className?: string;
  onReady?: (renderer: EmlRenderer) => void;
  onError?: (msg: string) => void;
  animated?: boolean;
}

// Reusable WebGL2 canvas. The parent controls the fragment source and uniform
// patches; we just keep the renderer in sync and run the RAF loop.
export function EmlCanvas({ fragSrc, state, className, onReady, onError, animated = true }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<EmlRenderer | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let renderer: EmlRenderer;
    try {
      renderer = new EmlRenderer(canvas);
    } catch (e) {
      onError?.(String(e));
      return;
    }
    rendererRef.current = renderer;
    renderer.onError = (msg) => onError?.(msg);
    onReady?.(renderer);
    const ro = new ResizeObserver(() => renderer.renderOnce());
    ro.observe(canvas);
    if (animated) renderer.start();
    else renderer.renderOnce();
    return () => {
      ro.disconnect();
      renderer.dispose();
      rendererRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const r = rendererRef.current;
    if (!r) return;
    const ok = r.setShader(fragSrc);
    if (ok && !animated) r.renderOnce();
  }, [fragSrc, animated]);

  useEffect(() => {
    const r = rendererRef.current;
    if (!r || !state) return;
    r.setState(state);
    if (!animated) r.renderOnce();
  }, [state, animated]);

  return <canvas ref={canvasRef} className={className} />;
}
