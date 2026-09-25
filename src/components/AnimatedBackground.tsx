"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

const BLOBS = [
  { from: 0, to: 40, x: "10%", y: "-9%", duration: 5 },
  { from: -75, to: -35, x: "-10%", y: "9%", duration: 7 },
  { from: 0, to: -42, x: "-9%", y: "10%", duration: 6.5 },
  { from: 75, to: 136, x: "10%", y: "-8%", duration: 4.5 },
];

export default function AnimatedBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      const blobs = container.querySelectorAll<HTMLElement>("[data-blob]");
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        blobs.forEach((blob, i) => gsap.set(blob, { rotation: BLOBS[i].from }));
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        blobs.forEach((blob, i) => {
          const { from, to, x, y, duration } = BLOBS[i];
          gsap.set(blob, { rotation: from, x: 0, y: 0 });
          gsap.to(blob, {
            rotation: to,
            x,
            y,
            duration,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          });
        });
      });

      return () => mm.revert();
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="fixed inset-0 -z-10 overflow-hidden bg-neutral-100 dark:bg-neutral-950"
    >
      <span data-blob className="bg-blob bg-blob-1" />
      <span data-blob className="bg-blob bg-blob-2" />
      <span data-blob className="bg-blob bg-blob-3" />
      <span data-blob className="bg-blob bg-blob-4" />
    </div>
  );
}
