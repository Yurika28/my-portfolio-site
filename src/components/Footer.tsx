const TAGS = [
  "Full-Stack Development",
  "Frontend",
  "Backend",
  "Database",
  "React / Next.js",
  "3D Graphics",
];

export default function Footer() {
  return (
    <footer className="mx-auto max-w-295 px-6 pb-10 pt-4 sm:pb-12 mb-6">
      <ul className="flex flex-wrap gap-3">
        {TAGS.map((tag) => (
          <li
            key={tag}
            className="rounded-full border border-(--card-border) bg-(--card-bg) px-4 py-2 font-sans text-xs font-bold uppercase tracking-[0.08em] text-(--muted) backdrop-blur-sm"
          >
            {tag}
          </li>
        ))}
      </ul>

      <p className="mt-6 font-sans text-xs text-(--muted)">
        © {new Date().getFullYear()} Yurika Maha
      </p>
    </footer>
  );
}
