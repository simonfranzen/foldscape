"use client";

import { useEffect, useRef } from "react";

// Wraps children with a CSS class that fades+rises into view the first time
// the element intersects the viewport. The animation is controlled by
// .reveal in globals.css; this component is just the trigger.

interface Props {
  children: React.ReactNode;
  delay?: number;       // ms
  className?: string;
  threshold?: number;   // 0..1
}

export function Reveal({ children, delay = 0, className = "", threshold = 0.15 }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Honor reduced motion
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      el.setAttribute("data-revealed", "true");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.setAttribute("data-revealed", "true");
            io.unobserve(el);
          }
        }
      },
      { threshold, rootMargin: "0px 0px -80px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={{ ["--reveal-delay" as string]: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
