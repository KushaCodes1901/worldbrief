import Link from "next/link";
import { safeUrl } from "@/lib/currents";

export function Header() {
  return (
    <header className="site-header">
      <div className="masthead shell">
        <Link
          href="/"
          prefetch={false}
          className="wordmark"
          aria-label="WorldBrief home"
        >
          <span className="brand-symbol" aria-hidden="true">
            w<span>↗</span>
          </span>
          WorldBrief<span className="wordmark-dot">.</span>
        </Link>
        <span className="masthead-tagline">
          A wider world. A little closer.
        </span>
        <Link href="/about" prefetch={false} className="about-link">
          About <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </header>
  );
}
export function Attribution() {
  return (
    <a
      href="https://currentsapi.services/"
      target="_blank"
      rel="noopener noreferrer"
      className="attribution"
    >
      Powered by Currents News API <span aria-hidden="true">↗</span>
      <span className="sr-only"> (opens an external website)</span>
    </a>
  );
}
export function Footer() {
  const github = safeUrl(
    process.env.WORLDBRIEF_GITHUB_URL ||
      "https://github.com/KushaCodes1901/worldbrief",
  );
  return (
    <footer className="site-footer shell">
      <div>
        <Link href="/" prefetch={false} className="footer-brand">
          WorldBrief<span>.</span>
        </Link>
        <p>Headlines lead here. Full stories belong to their publishers.</p>
      </div>
      <div className="footer-links">
        <Attribution />
        <Link href="/about" prefetch={false}>
          About & content use
        </Link>
        {github && (
          <a href={github} target="_blank" rel="noopener noreferrer">
            Source on GitHub ↗
            <span className="sr-only"> (external website)</span>
          </a>
        )}
      </div>
      <div className="footer-bottom">
        <span>A personal, non-commercial project by Shkamb.</span>
        <span>Made with curiosity & AI assistance.</span>
      </div>
    </footer>
  );
}
