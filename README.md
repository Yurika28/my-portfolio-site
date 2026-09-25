# Dev Portfolio

A personal developer portfolio built with Next.js and React, styled with Tailwind CSS, and animated with GSAP.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI:** React 19
- **Styling:** Tailwind CSS 4
- **Animation:** GSAP 3
- **Smooth Scrolling:** Lenis
- **E2E Testing:** Playwright

## Animation

Motion throughout the site is powered by [GSAP](https://gsap.com/), using the following plugins:

- **ScrollTrigger** — scroll-driven animations and scroll-linked effects
- **Flip** — smooth state/layout transition animations

GSAP context and `matchMedia` scoping are used to keep animations responsive and properly cleaned up across viewport changes.

## Getting Started

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Scripts

- `npm run dev` — start the development server
- `npm run build` — create a production build
- `npm run start` — run the production build
- `npm run lint` — run ESLint
- `npm run test:e2e` — run Playwright end-to-end tests
- `npm run test:e2e:ui` — run Playwright tests in UI mode
