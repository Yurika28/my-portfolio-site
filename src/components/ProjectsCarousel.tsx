 "use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROJECTS } from "@/data/projects";

gsap.registerPlugin(ScrollTrigger);

export default function ProjectsCarousel() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const [activeIndex, setActiveIndex] = useState(0);
  const [hasEnteredView, setHasEnteredView] = useState(false);
  const [brokenVideos, setBrokenVideos] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEnteredView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasEnteredView) return;
    PROJECTS.forEach((project, i) => {
      const video = videoRefs.current[project.slug];
      if (!video || brokenVideos[project.slug]) return;
      if (i === activeIndex) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [activeIndex, hasEnteredView, brokenVideos]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const nav = document.querySelector<HTMLElement>("nav");
    let navVisible = true;

    // Single crossfade entry point for nav visibility — both the carousel
    // index and the Contact section's ScrollTrigger below call this, each
    // only triggering a tween when the desired state actually changes.
    const setNavVisible = (visible: boolean) => {
      if (!nav || visible === navVisible) return;
      navVisible = visible;
      gsap.to(nav, { autoAlpha: visible ? 1 : 0, duration: 0.4, ease: "power1.out" });
    };

    const ctx = gsap.context(() => {
      const getMaxScroll = () => track.scrollWidth - section.offsetWidth;
      // Extra scroll distance held after the horizontal slide finishes, so the
      // section un-pins gradually instead of releasing the instant progress hits 1.
      const getRestBuffer = () => window.innerHeight * 0.3;
      const getHorizontalProgress = (scrollTriggerProgress: number) => {
        const maxScroll = getMaxScroll();
        if (maxScroll <= 0) return 1;
        const total = maxScroll + getRestBuffer();
        return Math.min(1, (scrollTriggerProgress * total) / maxScroll);
      };

      const tween = gsap.to(track, {
        x: () => -getMaxScroll(),
        ease: getHorizontalProgress,
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${getMaxScroll() + getRestBuffer()}`,
          scrub: true,
          anticipatePin: 1,
          pin: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const index = Math.round(getHorizontalProgress(self.progress) * (PROJECTS.length - 1));
            setActiveIndex(index);
            // Only the final card clashes visually with the nav, so it hides
            // there and stays hidden through Contact — the footer trigger
            // below is what brings it back, at the very bottom of the page.
            setNavVisible(index < PROJECTS.length - 1);
          },
        },
      });

      stRef.current = tween.scrollTrigger ?? null;

      // Nav reappears only once the page is scrolled all the way to the
      // bottom, and hides again if the user scrolls back up away from it.
      // Lenis' own `limit` is the real max scroll — the carousel's pin-spacer
      // makes the raw document height (and thus ScrollTrigger.maxScroll)
      // overshoot it, which would make a DOM-based trigger unreachable.
      const getMaxDocScroll = () => window.__lenis?.limit ?? ScrollTrigger.maxScroll(window);
      ScrollTrigger.create({
        start: () => getMaxDocScroll() - 1,
        end: () => getMaxDocScroll(),
        onEnter: () => setNavVisible(true),
        onEnterBack: () => setNavVisible(true),
        onLeaveBack: () => setNavVisible(false),
      });
    }, section);

    return () => {
      ctx.revert();
      if (nav) gsap.set(nav, { clearProps: "opacity,visibility" });
    };
  }, []);

  const goTo = (index: number) => {
    const st = stRef.current;
    const track = trackRef.current;
    const section = sectionRef.current;
    if (!st || !track || !section) return;
    const maxScroll = track.scrollWidth - section.offsetWidth;
    const clamped = Math.max(0, Math.min(PROJECTS.length - 1, index));
    const target = st.start + (clamped / (PROJECTS.length - 1)) * maxScroll;
    if (window.__lenis) {
      window.__lenis.scrollTo(target, { duration: 1.2 });
    } else {
      window.scrollTo({ top: target, behavior: "smooth" });
    }
  };

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative h-dvh overflow-hidden"
    >
      <div ref={trackRef} className="flex h-full w-max">
        {PROJECTS.map((project) => (
          <article
            key={project.slug}
            className="flex h-full w-screen shrink-0 items-center px-1 pt-24 sm:pt-28 md:pt-32"
          >
            <div className="grid w-full max-w-6xl grid-cols-1 items-center gap-6 rounded-3xl border border-white/30 bg-white/10 p-4 shadow-xl shadow-black/5 backdrop-blur-xl sm:gap-8 sm:p-6 md:grid-cols-2 md:gap-10 md:p-10 dark:border-white/10 dark:bg-white/5">
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-neutral-200 dark:bg-neutral-800">
                {project.video && !brokenVideos[project.slug] ? (
                  <video
                    ref={(el) => {
                      videoRefs.current[project.slug] = el;
                    }}
                    className="h-full w-full object-cover"
                    src={project.video}
                    poster={project.poster}
                    muted
                    loop
                    playsInline
                    preload="none"
                    onError={() =>
                      setBrokenVideos((prev) => ({ ...prev, [project.slug]: true }))
                    }
                  />
                ) : project.poster ? (
                  <Image
                    src={project.poster}
                    alt={project.title}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm uppercase tracking-widest text-neutral-500">
                    {project.title}
                  </div>
                )}
              </div>

              <div className="flex flex-col items-start gap-3 sm:gap-4">
                <h3 className="text-2xl font-bold uppercase tracking-wide sm:text-3xl md:text-4xl">
                  {project.title}
                </h3>
                <p className="max-w-md text-sm text-neutral-600 sm:text-base dark:text-neutral-300">
                  {project.overview}
                </p>
                <ul className="flex flex-wrap gap-2">
                  {project.tech.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-current/20 px-3 py-1 text-xs font-medium uppercase tracking-wide"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative mt-2 pb-1 text-sm font-bold uppercase tracking-widest after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-100 after:bg-current"
                >
                  Live Demo →
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>

      <button
        type="button"
        aria-label="Previous project"
        onClick={() => goTo(activeIndex - 1)}
        disabled={activeIndex === 0}
        className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-current/20 p-2 text-lg transition-opacity disabled:opacity-30 sm:left-4 sm:p-3 sm:text-xl md:left-8"
      >
        ←
      </button>
      <button
        type="button"
        aria-label="Next project"
        onClick={() => goTo(activeIndex + 1)}
        disabled={activeIndex === PROJECTS.length - 1}
        className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-current/20 p-2 text-lg transition-opacity disabled:opacity-30 sm:right-4 sm:p-3 sm:text-xl md:right-8"
      >
        →
      </button>
    </section>
  );
}
