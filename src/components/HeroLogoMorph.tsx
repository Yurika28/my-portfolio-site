"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const NAME = "Yurika Maha";
const ROLE = "Full-Stack Developer";
const EMAIL = "yurikamaha@gmail.com";
const DESCRIPTION =
  "I build interactive frontends with resilient backends and maintainable end-to-end architecture.";

const INK_LIGHT = "rgb(12,12,14)";
const INK_DARK = "rgb(245,245,247)";
const MUTED_LIGHT = "rgb(150,150,158)";
const MUTED_DARK = "rgb(110,110,118)";

export default function HeroLogoMorph() {
  const sectionRef = useRef<HTMLElement>(null);

  const logoImgRef = useRef<HTMLDivElement>(null);
  const logoH1Ref = useRef<HTMLHeadingElement>(null);
  const logoRoleRef = useRef<HTMLParagraphElement>(null);
  const heroImgSlotRef = useRef<HTMLDivElement>(null);
  const heroH1SlotRef = useRef<HTMLHeadingElement>(null);
  const heroRoleSlotRef = useRef<HTMLHeadingElement>(null);
  const heroDescRef = useRef<HTMLParagraphElement>(null);
  const heroDescSlotRef = useRef<HTMLParagraphElement>(null);

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
    const logoImg = logoImgRef.current;
    const logoH1 = logoH1Ref.current;
    const logoRole = logoRoleRef.current;
    const heroImgSlot = heroImgSlotRef.current;
    const heroH1Slot = heroH1SlotRef.current;
    const heroRoleSlot = heroRoleSlotRef.current;
    const heroDesc = heroDescRef.current;
    const heroDescSlot = heroDescSlotRef.current;
    const section = sectionRef.current;
    if (
      !logoImg ||
      !logoH1 ||
      !logoRole ||
      !heroImgSlot ||
      !heroH1Slot ||
      !heroRoleSlot ||
      !heroDesc ||
      !heroDescSlot ||
      !section
    )
      return;

    const ctx = gsap.context(() => {
      // FLIP delta, anchored left-center (matches transformOrigin: "left center"):
        // align left edges on the x-axis, vertical centers on the y-axis.
        const getDelta = (from: Element, to: Element) => {
          const fromRect = from.getBoundingClientRect();
          const toRect = to.getBoundingClientRect();
          return {
            scale: toRect.width / fromRect.width,
            x: toRect.left - fromRect.left,
            y: toRect.top + toRect.height / 2 - (fromRect.top + fromRect.height / 2),
          };
        };

        gsap.set([logoImg, logoH1, logoRole, heroDesc], { transformOrigin: "left center" });

        // Start the nav-sized logo/role/desc looking like they're sitting in the hero slots.
        gsap.set(logoImg, {
          x: () => getDelta(logoImg, heroImgSlot).x,
          y: () => getDelta(logoImg, heroImgSlot).y,
          scale: () => getDelta(logoImg, heroImgSlot).scale,
        });
        gsap.set(logoH1, {
          x: () => getDelta(logoH1, heroH1Slot).x,
          y: () => getDelta(logoH1, heroH1Slot).y,
          scale: () => getDelta(logoH1, heroH1Slot).scale,
        });
        gsap.set(logoRole, {
          x: () => getDelta(logoRole, heroRoleSlot).x,
          y: () => getDelta(logoRole, heroRoleSlot).y,
          scale: () => getDelta(logoRole, heroRoleSlot).scale,
        });
        gsap.set(heroDesc, {
          x: () => getDelta(heroDesc, heroDescSlot).x,
          y: () => getDelta(heroDesc, heroDescSlot).y,
          scale: () => getDelta(heroDesc, heroDescSlot).scale,
        });

        const words = heroDesc.querySelectorAll<HTMLElement>("[data-word]");
        const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const muted = isDark ? MUTED_DARK : MUTED_LIGHT;
        const ink = isDark ? INK_DARK : INK_LIGHT;

        const mm = gsap.matchMedia();

        mm.add("(prefers-reduced-motion: reduce)", () => {
          gsap.set(words, { color: ink });
        });

        mm.add("(prefers-reduced-motion: no-preference)", () => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "+=100%",
              scrub: 1,
              pin: true,
              invalidateOnRefresh: true,
            },
          });

          // Phase 1 (0 -> 0.2): description words fill from muted to ink —
          // short, so the shrink below starts almost immediately on scroll.
          const M = 0.2;
          tl.fromTo(
            words,
            { color: muted },
            {
              color: ink,
              ease: "none",
              duration: M,
              stagger: { each: M / words.length },
            },
            0
          );

          // Phase 2 (0.2 -> 1): existing FLIP back to identity.
          tl.to(logoImg, { x: 0, y: 0, scale: 1, ease: "none", duration: 1 - M }, M)
            .to(logoH1, { x: 0, y: 0, scale: 1, ease: "none", duration: 1 - M }, M)
            .to(logoRole, { x: 0, y: 0, scale: 1, ease: "none", duration: 1 - M }, M)
            .to(heroDesc, { x: 0, y: 0, scale: 1, ease: "none", duration: 1 - M }, M);
        });
    }, section);

    // Re-measure the FLIP deltas once web fonts finish swapping in, without
    // delaying ScrollTrigger creation (which must happen synchronously so
    // scroll response is immediate on first paint).
    document.fonts.ready.then(() => ScrollTrigger.refresh());

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <>
      <nav className="fixed inset-x-0 top-0 z-50 flex flex-col gap-1 px-4 py-3 sm:gap-2 sm:px-6 sm:py-4 md:px-10 md:py-5">
        <div className="flex items-center gap-4 sm:gap-6 md:gap-10">
          <div className="flex flex-row items-center gap-3">
            <div ref={logoImgRef} className="h-11 w-11 shrink-0 overflow-hidden rounded-full">
              <Image
                src="/DSC08449.jpg"
                alt={NAME}
                width={256}
                height={256}
                priority
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex flex-col gap-0.5">
              <h1
                ref={logoH1Ref}
                className="flex items-baseline gap-2 whitespace-nowrap leading-none"
              >
                <span className="font-script text-[28px]">Yurika</span>
                <span className="font-sans text-[21px] font-extrabold uppercase tracking-[0.04em]">
                  Maha
                </span>
              </h1>
              <p
                ref={logoRoleRef}
                className="whitespace-nowrap font-sans text-[11px] font-bold uppercase tracking-[0.12em]"
              >
                {ROLE}
              </p>
            </div>
          </div>

          <ul className="ml-auto flex items-center gap-3 sm:gap-6 font-sans text-xs font-bold tracking-[0.08em] sm:text-sm">
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
        </div>

        <p
          ref={heroDescRef}
          aria-label={DESCRIPTION}
          className="flex max-w-xs flex-wrap gap-x-[0.26em] font-sans text-xs sm:max-w-sm sm:text-sm"
        >
          {DESCRIPTION.split(" ").map((word, i) => (
            <span
              key={i}
              data-word
              aria-hidden
              className="text-[rgb(150,150,158)] dark:text-[rgb(110,110,118)]"
            >
              {word}
            </span>
          ))}
        </p>
      </nav>

      <section
        ref={sectionRef}
        className="relative flex flex-col justify-center px-4 py-24 sm:px-6 md:px-16"
      >
        <div className="flex flex-col items-start gap-5">
          <div
            ref={heroImgSlotRef}
            className="invisible h-24 w-24 shrink-0 rounded-full sm:h-28 sm:w-28 md:h-33 md:w-33"
          />

          <div className="flex flex-col gap-1 sm:gap-2">
            <h1
              ref={heroH1SlotRef}
              aria-hidden
              className="invisible flex flex-wrap items-baseline gap-x-3 leading-[1.1] sm:gap-x-4 md:gap-x-5.5"
            >
              <span className="font-script text-6xl sm:text-7xl md:text-[116px]">Yurika</span>
              <span className="font-sans text-5xl font-extrabold uppercase tracking-[0.03em] sm:text-6xl md:text-[92px]">
                Maha
              </span>
            </h1>
            <h2
              ref={heroRoleSlotRef}
              aria-hidden
              className="invisible text-left font-sans text-lg font-bold uppercase tracking-[0.12em] sm:text-xl md:text-3xl"
            >
              {ROLE}
            </h2>
          </div>

          <p
            ref={heroDescSlotRef}
            aria-hidden
            className="invisible max-w-[36ch] font-sans text-base leading-[1.45] sm:text-lg md:text-[26px]"
          >
            {DESCRIPTION}
          </p>
        </div>
      </section>
    </>
  );
}
