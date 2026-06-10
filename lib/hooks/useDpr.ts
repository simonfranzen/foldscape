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
    const update = () => setDpr(readDpr(cap));
    update();
    const mq = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, [cap]);

  return dpr;
}

export function getDpr(cap: number = DEFAULT_CAP): number {
  return readDpr(cap);
}
