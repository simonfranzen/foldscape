"use client";

import { useEffect, useRef, useState } from "react";

// Tiny info chip. Hover or click reveals an explanation. Click-state persists
// so users can read longer copy without keeping the cursor still.
export function Info({
  children,
  className = "",
  side = "top",
}: {
  children: React.ReactNode;
  className?: string;
  side?: "top" | "bottom" | "right";
}) {
  const [open, setOpen] = useState(false);
  const [sticky, setSticky] = useState(false);
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!sticky) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setSticky(false);
        setOpen(false);
      }
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [sticky]);

  const placement =
    side === "bottom"
      ? "top-full mt-2 left-1/2 -translate-x-1/2"
      : side === "right"
      ? "left-full ml-2 top-1/2 -translate-y-1/2"
      : "bottom-full mb-2 left-1/2 -translate-x-1/2";

  return (
    <span ref={ref} className={`relative inline-flex align-middle ${className}`}>
      <button
        type="button"
        aria-label="More info"
        onMouseEnter={() => !sticky && setOpen(true)}
        onMouseLeave={() => !sticky && setOpen(false)}
        onClick={() => {
          setSticky((v) => !v);
          setOpen((v) => !v || !sticky);
        }}
        className={`w-4 h-4 inline-flex items-center justify-center rounded-full border text-[9px] font-mono leading-none transition-colors ${
          sticky
            ? "border-signal-violet text-signal-violet bg-signal-violet/10"
            : "border-ink-300/40 text-ink-300 hover:text-signal-violet hover:border-signal-violet/60"
        }`}
      >
        i
      </button>
      {open && (
        <span
          className={`absolute ${placement} z-50 w-64 glass border hairline rounded-md px-3 py-2 text-xs text-ink-200 leading-relaxed pointer-events-none shadow-xl`}
          style={{ pointerEvents: sticky ? "auto" : "none" }}
        >
          {children}
        </span>
      )}
    </span>
  );
}
