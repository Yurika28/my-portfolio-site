export type Project = {
  slug: string;
  title: string;
  overview: string;
  tech: string[];
  demoUrl: string;
  video?: string;
  poster?: string;
};

export const PROJECTS: Project[] = [
  {
    slug: "finfolio",
    title: "FinFolio",
    overview:
      "A full-stack finance dashboard for tracking stocks, crypto, and forex in real time — with AI-generated market summaries, a conversational market chat grounded in live data, and simulated portfolio trading with live gain/loss.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Express", "PostgreSQL / Prisma", "Socket.io", "Google Gemini"],
    demoUrl: "https://finfolio-app-uhwj.vercel.app/",
    video: "/projects/finfolio.mp4",
    poster: "/projects/finfolio.jpg",
  },
  {
    slug: "interior-haus",
    title: "Interior Haus",
    overview:
      "A full-stack interior design storefront with an interactive 3D product scene, JWT auth with role-based access control, and an admin flow for managing the catalog — built for browsing and purchasing furniture and decor.",
    tech: ["Next.js", "React Three Fiber", "GSAP", "Zustand", "Express", "PostgreSQL / Prisma", "Zod"],
    demoUrl: "https://interior-haus.vercel.app/",
    video: "/projects/interior-haus.mp4",
    poster: "/projects/interior-haus.jpg",
  },
  {
    slug: "photographer-portfolio",
    title: "Photographer Portfolio",
    overview:
      "A portfolio site for a Bali-based photographer/videographer, with a parallax hero, shuffled masonry photo grid and rotating video strips, and filterable photo/video galleries synced from Google Drive into Cloudinary.",
    tech: ["Next.js", "Tailwind CSS", "Cloudinary", "Supabase", "Google Drive API"],
    demoUrl: "https://geenphovid-graphy.vercel.app/",
    video: "/projects/photographer-portfolio.mp4",
    poster: "/projects/photographer-portfolio.jpg",
  },
];
