"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { Flip } from "gsap/Flip";

gsap.registerPlugin(Flip);

const NAME = "Yurika Maha";
const EMAIL = "yurikamaha@gmail.com";

const SKILLS = [
  "TypeScript",
  "React",
  "Next.js",
  "Tailwind CSS",
  "GSAP",
  "React Three Fiber",
  "Node.js / Express",
  "PostgreSQL / Prisma",
  "Socket.io",
  "Zustand",
  "Zod",
  "REST APIs",
];

// Tight overlapping stack for the pre-Flip "pile" state.
const pileTransform = (index: number) => {
  const angle = (index % 2 === 0 ? 1 : -1) * (3 + (index % 4) * 1.5);
  const x = (index % 3) * 3 - 3;
  const y = (index % 2) * 3 - 1.5;
  return `translate(${x}px, ${y}px) rotate(${angle}deg)`;
};

export default function AboutPage() {
  const pileRef = useRef<HTMLUListElement>(null);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      return;
    }
    setCopied(true);
    if (copyTimer.current) clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(false), 2000);
  };

  useLayoutEffect(() => {
    const pile = pileRef.current;
    if (!pile) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          reduce: "(prefers-reduced-motion: reduce)",
          noPreference: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const { reduce } = context.conditions as { reduce: boolean };
          const cards = pile.querySelectorAll<HTMLElement>("[data-card]");

          if (reduce) {
            pile.classList.remove("grid");
            pile.classList.add("flex", "flex-wrap");
            cards.forEach((card) => {
              card.style.transform = "none";
              card.style.gridArea = "auto";
            });
            return;
          }

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
            stagger: 0.04,
          });
        }
      );

      return () => mm.revert();
    }, pile);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <nav className="fixed inset-x-0 top-0 z-50 flex items-center gap-4 px-4 py-3 sm:gap-6 sm:px-6 sm:py-4 md:gap-10 md:px-10">
        <Link href="/" className="flex flex-row items-center gap-3">
          <div className="h-15 w-15 shrink-0 overflow-hidden rounded-full">
            <Image
              src="/DSC08449.jpg"
              alt={NAME}
              width={256}
              height={256}
              priority
              className="h-full w-full object-cover"
            />
          </div>
          <h1 className="whitespace-nowrap text-2xl tracking-widest">
            <span className="font-serif-italic italic">
              Yurika{" "}
            </span>
            <span className="font-sans font-bold uppercase">MAHA</span>
          </h1>
        </Link>

        <ul className="ml-auto flex items-center gap-3 sm:gap-6 text-xs font-medium tracking-wide sm:text-sm md:gap-8">
          <li>
            <Link
              href="/about"
              className="relative pb-1 after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100"
            >
              About
            </Link>
          </li>
          <li className="relative">
            <button
              type="button"
              onClick={handleCopyEmail}
              className="relative appearance-none border-0 bg-transparent p-0 pb-1 text-inherit after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100"
            >
              Contact
            </button>
            {copied && (
              <span className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-full border border-(--card-border) bg-(--accent-soft) px-3 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-(--ink)">
                Copied
              </span>
            )}
            <span role="status" aria-live="polite" className="sr-only">
              {copied ? "Email copied to clipboard" : ""}
            </span>
          </li>
        </ul>
      </nav>

      <section className="relative flex h-dvh flex-col justify-center gap-6 overflow-hidden px-4 pt-24 pb-6 sm:gap-8 sm:px-6 sm:pt-28 md:px-10">
        <div className="flex flex-col items-start gap-4 sm:gap-6">
          <h2 className="flex items-baseline gap-2 text-2xl sm:text-3xl md:text-4xl">
            <span className="font-bold uppercase tracking-wide">About</span>
            <span className="font-serif-italic italic">Me</span>
          </h2>
          <p className="max-w-xs text-sm text-neutral-600 sm:max-w-md sm:text-base md:max-w-2xl md:text-lg dark:text-neutral-300">
            I&apos;m a full-stack developer based in Bali, Indonesia.
          </p>
          <p className="max-w-xs text-sm text-neutral-600 sm:max-w-md sm:text-base md:max-w-2xl md:text-lg dark:text-neutral-300">
            Recent work spans real-time finance dashboards, 3D-driven product
            storefronts, and media-heavy portfolio sites.
          </p>
        </div>

        <div className="flex flex-col items-start gap-4 sm:gap-6">
          <h3 className="text-xl font-bold uppercase tracking-wide sm:text-2xl">
            Skills
          </h3>
          <ul ref={pileRef} className="grid gap-2 sm:gap-3">
            {SKILLS.map((skill, i) => (
              <li
                key={skill}
                data-card
                style={{ gridArea: "1 / 1", transform: pileTransform(i), zIndex: i }}
                className="rounded-full border border-(--card-border) bg-(--card-bg) px-3 py-1 text-xs font-medium uppercase tracking-wide backdrop-blur-sm sm:px-4 sm:py-2 sm:text-sm"
              >
                {skill}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
