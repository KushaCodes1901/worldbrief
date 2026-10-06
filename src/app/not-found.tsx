import Link from "next/link";
export default function NotFound() { return <main id="main-content" className="shell state-page"><span className="eyebrow">404 · Off the page</span><h1>This story ends here.</h1><p>We couldn’t find that page or topic. There’s more to explore on the homepage.</p><Link href="/" prefetch={false} className="text-link">Back to WorldBrief →</Link></main>; }
