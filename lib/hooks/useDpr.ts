"use client";

import { useEffect, useState } from "react";

const DEFAULT_CAP = 2;

function readDpr(cap: number): number {
  if (typeof window === "undefined") return 1;
  return Math.min(window.devicePixelRatio || 1, cap);
}

export function useDpr(cap: number = DEFAULT_CAP): number {
  const [dpr, setDpr] = useState(() => readDpr(cap));

  useEffect(() => {
    let mq: MediaQueryList | null = null;
    const handler = () => {
      setDpr(readDpr(cap));
      // Re-subscribe with the new DPR — otherwise a 1→2→3 chain stays silent
      // after the first change because the original MQ matches neither 2 nor 3.
      mq?.removeEventListener?.("change", handler);
      mq = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
      mq.addEventListener?.("change", handler);
    };
    setDpr(readDpr(cap));
    mq = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
    mq.addEventListener?.("change", handler);
    return () => mq?.removeEventListener?.("change", handler);
  }, [cap]);

  return dpr;
}

export function getDpr(cap: number = DEFAULT_CAP): number {
  return readDpr(cap);
}
