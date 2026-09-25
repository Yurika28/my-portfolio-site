"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";

gsap.registerPlugin(ScrollTrigger, Flip);

const EMAIL = "yurikamaha@gmail.com";

const SUBTEXT =
  "Have a project in mind? Let's connect";

const SOCIALS = [
  {
    label: "GitHub",
    handle: "@yurikamaha",
    href: "https://github.com/Yurika28",
    transform: "translate(-6px, 4px) rotate(-6deg)",
    z: 2,
  },
  {
    label: "LinkedIn",
    handle: "in/yurikamaha",
    href: "https://www.linkedin.com/in/yurika-maha-261b40111",
    transform: "translate(8px, -3px) rotate(5deg)",
    z: 1,
  },
];

export default function Contact() {
  const splitRef = useRef<HTMLParagraphElement>(null);
  const pileRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useLayoutEffect(() => {
    const split = splitRef.current;
    const pile = pileRef.current;
    if (!split || !pile) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          reduce: "(prefers-reduced-motion: reduce)",
          noPreference: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const { reduce } = context.conditions as { reduce: boolean };
          const words = split.querySelectorAll<HTMLElement>("[data-word]");
          const cards = pile.querySelectorAll<HTMLElement>("[data-card]");

          if (reduce) {
            gsap.set(words, { opacity: 1 });
            pile.classList.remove("grid");
            pile.classList.add("flex", "flex-wrap");
            cards.forEach((card) => {
              card.style.transform = "none";
              card.style.gridArea = "auto";
            });
            return;
          }

          // 5.1 — scroll-scrubbed split-word opacity fill
          gsap.fromTo(
            words,
            { opacity: 0.22 },
            {
              opacity: 1,
              stagger: 0.05,
              ease: "none",
              scrollTrigger: {
                trigger: split,
                start: "top 80%",
                end: "top 30%",
                scrub: true,
              },
            }
          );

          // 5.2 — fanned pile -> row, plays once on scroll into view
          ScrollTrigger.create({
            trigger: pile,
            start: "top 85%",
            once: true,
            onEnter: () => {
              const state = Flip.getState(cards);

              pile.classList.remove("grid");
              pile.classList.add("flex", "flex-wrap");
              cards.forEach((card) => {
                card.style.transform = "none";
                card.style.gridArea = "auto";
              });

              Flip.from(state, {
                duration: 0.7,
                ease: "power3.out",
                stagger: 0.08,
              });
            },
          });
        }
      );

      return () => mm.revert();
    }, pile);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    return () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      return;
    }

    const label = labelRef.current;
    if (label) {
      gsap.to(label, {
        rotationX: 90,
        duration: 0.15,
        ease: "power1.in",
        onComplete: () => {
          setCopied(true);
          gsap.fromTo(
            label,
            { rotationX: -90 },
            { rotationX: 0, duration: 0.15, ease: "power1.out" }
          );
        },
      });
    } else {
      setCopied(true);
    }

    if (copyTimer.current) clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      id="contact"
      className="scroll-mt-24 mx-auto max-w-295 px-6 pt-24 pb-10 sm:pt-28 md:pt-32"
    >
      <h2 className="font-sans text-[clamp(2.1rem,5.5vw,4.1rem)] font-extrabold uppercase leading-none tracking-[-0.01em] text-(--ink)">
        Contact
      </h2>

      <div className="mt-6 flex flex-col gap-10 sm:mt-10 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-8 sm:flex-1">
          <p
            ref={splitRef}
            className="max-w-2xl font-serif-italic text-[clamp(1.3rem,2.6vw,1.95rem)] italic leading-[1.2] text-(--ink)"
          >
            {SUBTEXT.split(" ").map((word, i) => (
              <span key={i} data-word className="opacity-[0.22]">
                {word}{" "}
              </span>
            ))}
          </p>

          <button
            type="button"
            onClick={handleCopy}
            className="group flex flex-wrap items-center gap-4"
            style={{ perspective: 600 }}
          >
            <span className="border-b-2 border-(--accent) pb-1 font-sans text-[clamp(0.95rem,2.2vw,1.65rem)] font-medium uppercase tracking-[0.08em] text-(--ink)">
              {EMAIL}
            </span>
            <span
              ref={labelRef}
              className="inline-block min-w-21 rounded-full border border-(--card-border) bg-(--accent-soft) px-4 py-2 text-center font-sans text-xs font-bold uppercase tracking-[0.08em] text-(--ink)"
            >
              {copied ? "Copied" : "Copy"}
            </span>
            <span role="status" aria-live="polite" className="sr-only">
              {copied ? "Email copied to clipboard" : ""}
            </span>
          </button>
        </div>

        <div
          ref={pileRef}
          className="grid gap-4 max-sm:w-full sm:shrink-0"
        >
          {SOCIALS.map((social) => (
            <a
              key={social.label}
              data-card
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{ gridArea: "1 / 1", transform: social.transform, zIndex: social.z }}
              className="flex items-center justify-between gap-6 rounded-2xl border border-(--card-border) bg-(--card-bg) px-5 py-4 backdrop-blur-sm sm:w-72"
            >
              <div className="flex flex-col">
                <span className="font-sans text-[1.15rem] font-extrabold uppercase tracking-[0.04em] text-(--ink)">
                  {social.label}
                </span>
                <span className="font-sans text-[0.85rem] text-(--muted)">
                  {social.handle}
                </span>
              </div>
              <span className="text-[1.2rem] text-(--accent)">→</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
